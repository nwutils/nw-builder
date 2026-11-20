#!/usr/bin/env python3
"""A stand-in xdg-desktop-portal FileChooser, for issue tests.

On Linux, Chromium shows file dialogs through the desktop portal
(org.freedesktop.portal.FileChooser on the D-Bus session bus). This serves that
interface on the session bus it is started on, answering every OpenFile and
SaveFile request at once, as if the user picked the paths given on the command
line. Each request is printed to stdout as a JSON line; "ready" is printed once
the portal is up.

Usage: file_chooser_portal.py PATH...   (needs PyGObject: apt install python3-gi)
"""

import json
import pathlib
import sys

from gi.repository import Gio, GLib

SERVICE = "org.freedesktop.portal.Desktop"
OBJECT = "/org/freedesktop/portal/desktop"

INTERFACES = Gio.DBusNodeInfo.new_for_xml(
    """
<node>
  <interface name="org.freedesktop.portal.FileChooser">
    <method name="OpenFile">
      <arg type="s" name="parent_window" direction="in"/>
      <arg type="s" name="title" direction="in"/>
      <arg type="a{sv}" name="options" direction="in"/>
      <arg type="o" name="handle" direction="out"/>
    </method>
    <method name="SaveFile">
      <arg type="s" name="parent_window" direction="in"/>
      <arg type="s" name="title" direction="in"/>
      <arg type="a{sv}" name="options" direction="in"/>
      <arg type="o" name="handle" direction="out"/>
    </method>
    <property name="version" type="u" access="read"/>
  </interface>
  <interface name="org.freedesktop.host.portal.Registry">
    <method name="Register">
      <arg type="s" name="app_id" direction="in"/>
      <arg type="a{sv}" name="options" direction="in"/>
    </method>
  </interface>
</node>
"""
).interfaces


def emit(line):
    print(line, flush=True)


def main(paths):
    uris = [pathlib.Path(p).resolve().as_uri() for p in paths]

    def method_call(conn, sender, path, interface, method, params, invocation):
        if interface == "org.freedesktop.host.portal.Registry":
            invocation.return_value(None)
            return
        _parent, title, options = params.unpack()
        emit(json.dumps({"method": method, "title": title, "options": {
            k: v for k, v in options.items() if isinstance(v, (bool, str))
        }}))
        # The portal answers on a Request object named after the caller and
        # its handle_token: .../request/<sender without ':', '.' as '_'>/<token>.
        caller = sender.lstrip(":").replace(".", "_")
        handle = f"{OBJECT}/request/{caller}/{options['handle_token']}"
        invocation.return_value(GLib.Variant("(o)", (handle,)))

        def respond():
            conn.emit_signal(
                sender, handle, "org.freedesktop.portal.Request", "Response",
                GLib.Variant("(ua{sv})", (0, {"uris": GLib.Variant("as", uris)})),
            )
            return GLib.SOURCE_REMOVE

        GLib.idle_add(respond)

    def get_property(conn, sender, path, interface, name):
        return GLib.Variant("u", 4)

    loop = GLib.MainLoop()
    bus = Gio.bus_get_sync(Gio.BusType.SESSION)
    for interface in INTERFACES:
        bus.register_object(OBJECT, interface, method_call, get_property, None)
    Gio.bus_own_name_on_connection(
        bus, SERVICE, Gio.BusNameOwnerFlags.NONE,
        lambda *_: emit("ready"), lambda *_: loop.quit(),
    )
    loop.run()
    return 1  # Lost the name, or never got it.


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
