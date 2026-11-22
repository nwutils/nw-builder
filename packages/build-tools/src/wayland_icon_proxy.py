#!/usr/bin/env python3
"""A Wayland proxy that adds the window icon protocol, for issue tests.

Chromium sets window icons on Wayland through xdg_toplevel_icon_manager_v1,
which the headless compositors on CI runners don't offer. This proxy sits
between NW.js and a compositor: it forwards everything, advertises that
protocol as an extra global, and answers its requests itself, printing each
one to stdout as a JSON line. Wayland needs the client's object ids to stay
contiguous on the compositor's side, so each icon object it creates is
forwarded as a wl_display.sync with the same id, whose reply is hidden from
the client.

Each icon request is printed as a JSON line:

  {"request": "create_icon", "icon": 12}
  {"request": "add_buffer", "icon": 12, "width": 128, "height": 128, "scale": 1}
  {"request": "set_icon", "toplevel": 9, "icon": 12}

"ready" is printed once it listens.

Usage: wayland_icon_proxy.py LISTEN_SOCKET COMPOSITOR_SOCKET
"""

import array
import json
import os
import select
import socket
import struct
import sys

ICON_GLOBAL_NAME = 0xFFFF0001
ICON_INTERFACE = "xdg_toplevel_icon_manager_v1"
MAX_FDS = 28  # libwayland's limit per message chunk


def emit(record):
    print(json.dumps(record) if isinstance(record, dict) else record, flush=True)


def wl_string(data, offset):
    """Reads a Wayland string; returns it and the offset after it."""
    (length,) = struct.unpack_from("=I", data, offset)
    offset += 4
    value = data[offset:offset + length - 1].decode() if length else None
    return value, offset + (length + 3) // 4 * 4


def message(obj, opcode, payload):
    return struct.pack("=II", obj, (8 + len(payload)) << 16 | opcode) + payload


def wl_string_bytes(value):
    raw = value.encode() + b"\0"
    return struct.pack("=I", len(raw)) + raw + b"\0" * (-len(raw) % 4)


class Connection:
    """One client: forwards between it and the compositor, rewriting the
    registry and serving the icon protocol."""

    def __init__(self, client, server):
        self.client, self.server = client, server
        self.registries = set()
        self.shm = set()
        self.pools = set()
        self.buffers = {}  # wl_buffer id -> (width, height)
        self.icon_managers = set()
        self.icons = set()
        # Ids the compositor holds as wl_display.sync callbacks for icon
        # objects: their replies are hidden from the client.
        self.shadows = set()
        self.pending = {client: b"", server: b""}

    def recv(self, sock):
        fds = array.array("i")
        data, ancdata, _, _ = sock.recvmsg(
            65536, socket.CMSG_SPACE(MAX_FDS * fds.itemsize))
        for level, kind, cdata in ancdata:
            if level == socket.SOL_SOCKET and kind == socket.SCM_RIGHTS:
                fds.frombytes(cdata[: len(cdata) - len(cdata) % fds.itemsize])
        return data, list(fds)

    def pump(self, sock):
        """Moves what `sock` sent to the other side. False once it closed."""
        data, fds = self.recv(sock)
        if not data and not fds:
            return False
        buf = self.pending[sock] + data
        out, reply = b"", b""
        while len(buf) >= 8:
            obj, word = struct.unpack_from("=II", buf, 0)
            size, opcode = word >> 16, word & 0xFFFF
            if size < 8 or len(buf) < size:
                break
            msg, buf = buf[:size], buf[size:]
            if sock is self.client:
                forward, answer = self.request(obj, opcode, msg)
                reply += answer
                out += forward
            elif self.event_visible(obj, opcode, msg):
                out += msg
        self.pending[sock] = buf
        other = self.server if sock is self.client else self.client
        if out or fds:
            anc = [(socket.SOL_SOCKET, socket.SCM_RIGHTS,
                    array.array("i", fds).tobytes())] if fds else []
            other.sendmsg([out], anc)
        for fd in fds:
            os.close(fd)
        if reply:
            self.client.sendall(reply)
        return True

    def request(self, obj, opcode, msg):
        """Inspects a client request. Returns what to forward to the
        compositor, and events to send back to the client."""
        args = msg[8:]
        # wl_display.get_registry(new_id): advertise the icon manager too.
        if obj == 1 and opcode == 1:
            (registry,) = struct.unpack_from("=I", args, 0)
            self.registries.add(registry)
            event = message(registry, 0, struct.pack("=I", ICON_GLOBAL_NAME)
                            + wl_string_bytes(ICON_INTERFACE) + struct.pack("=I", 1))
            return msg, event
        # wl_registry.bind(name, interface, version, new_id)
        if obj in self.registries and opcode == 0:
            (name,) = struct.unpack_from("=I", args, 0)
            interface, offset = wl_string(args, 4)
            _version, new_id = struct.unpack_from("=II", args, offset)
            if name == ICON_GLOBAL_NAME:
                self.icon_managers.add(new_id)
                return self.shadow(new_id), b""
            if interface == "wl_shm":
                self.shm.add(new_id)
            return msg, b""
        # wl_shm.create_pool(new_id, fd, size): the fd travels separately.
        if obj in self.shm and opcode == 0:
            self.pools.add(struct.unpack_from("=I", args, 0)[0])
            return msg, b""
        # wl_shm_pool.create_buffer(new_id, offset, width, height, stride, format)
        if obj in self.pools and opcode == 0 and len(args) >= 24:
            buffer, _offset, width, height = struct.unpack_from("=Iiii", args, 0)
            self.buffers[buffer] = (width, height)
            return msg, b""
        if obj in self.icon_managers:
            if opcode == 0:  # destroy
                self.icon_managers.discard(obj)
                return b"", self.delete_id(obj)
            if opcode == 1:  # create_icon(new_id)
                (icon,) = struct.unpack_from("=I", args, 0)
                self.icons.add(icon)
                emit({"request": "create_icon", "icon": icon})
                return self.shadow(icon), b""
            if opcode == 2:  # set_icon(toplevel, icon or null)
                toplevel, icon = struct.unpack_from("=II", args, 0)
                emit({"request": "set_icon", "toplevel": toplevel, "icon": icon})
            return b"", b""
        if obj in self.icons:
            if opcode == 0:  # destroy
                self.icons.discard(obj)
                return b"", self.delete_id(obj)
            if opcode == 2:  # add_buffer(buffer, scale)
                buffer, scale = struct.unpack_from("=Ii", args, 0)
                width, height = self.buffers.get(buffer, (None, None))
                emit({"request": "add_buffer", "icon": obj, "width": width,
                      "height": height, "scale": scale})
            return b"", b""
        return msg, b""

    def shadow(self, obj):
        """A wl_display.sync creating `obj` on the compositor, in place of
        an icon object, so the client's ids stay contiguous there."""
        self.shadows.add(obj)
        return message(1, 0, struct.pack("=I", obj))

    def event_visible(self, obj, opcode, msg):
        """Whether to pass a compositor event to the client: not the replies
        to the wl_display.sync standing in for icon objects."""
        if obj in self.shadows and opcode == 0:  # wl_callback.done
            return False
        if obj == 1 and opcode == 1:  # wl_display.delete_id(id)
            (deleted,) = struct.unpack_from("=I", msg, 8)
            if deleted in self.shadows:
                self.shadows.discard(deleted)
                return False
            # The id is free: it may name a different object next.
            for ids in (self.registries, self.shm, self.pools):
                ids.discard(deleted)
            self.buffers.pop(deleted, None)
        return True

    @staticmethod
    def delete_id(obj):
        """wl_display.delete_id, so the client may reuse the id."""
        return message(1, 1, struct.pack("=I", obj))


def main(listen_path, compositor_path):
    listener = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    listener.bind(listen_path)
    listener.listen()
    emit("ready")
    connections = {}
    while True:
        readable, _, _ = select.select([listener, *connections], [], [])
        for sock in readable:
            if sock is listener:
                client, _ = listener.accept()
                server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
                server.connect(compositor_path)
                conn = Connection(client, server)
                connections[client] = connections[server] = conn
                continue
            conn = connections.get(sock)
            if conn is None:
                continue
            try:
                alive = conn.pump(sock)
            except OSError:
                alive = False
            if not alive:
                for s in (conn.client, conn.server):
                    connections.pop(s, None)
                    s.close()


if __name__ == "__main__":
    sys.exit(main(*sys.argv[1:3]))
