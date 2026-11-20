#!/usr/bin/env python3
"""A stand-in xdg-desktop-portal FileChooser, for issue tests.

On Linux, Chromium shows file dialogs through the desktop portal
(org.freedesktop.portal.FileChooser on the D-Bus session bus). This answers
every file dialog at once with the paths given on the command line, as if the
user picked them. Run it on a private bus, under dbus-run-session; it prints
the bus's address once it is up.

Usage: dbus-run-session -- file_chooser_portal.py PATH...
Needs PyGObject (apt install python3-gi).
"""

import os
import pathlib
import sys

from gi.repository import Gio, GLib

OBJECT = "/org/freedesktop/portal/desktop"

INTERFACE = Gio.DBusNodeInfo.new_for_xml(
    """
<node>
  <interface name="org.freedesktop.portal.FileChooser">
    <method name="OpenFile">
      <arg type="s" name="parent_window" direction="in"/>
      <arg type="s" name="title" direction="in"/>
      <arg type="a{sv}" name="options" direction="in"/>
      <arg type="o" name="handle" direction="out"/>
    </method>
    <property name="version" type="u" access="read"/>
  </interface>
</node>
"""
).interfaces[0]


def main(paths):
    uris = [pathlib.Path(p).resolve().as_uri() for p in paths]

    def open_file(conn, sender, path, interface, method, params, invocation):
        # The answer comes as a Response signal from a Request object named
        # after the caller and its handle_token.
        caller = sender.lstrip(":").replace(".", "_")
        token = params.unpack()[2]["handle_token"]
        handle = f"{OBJECT}/request/{caller}/{token}"
        invocation.return_value(GLib.Variant("(o)", (handle,)))
        conn.emit_signal(
            sender, handle, "org.freedesktop.portal.Request", "Response",
            GLib.Variant("(ua{sv})", (0, {"uris": GLib.Variant("as", uris)})),
        )

    bus = Gio.bus_get_sync(Gio.BusType.SESSION)
    bus.register_object(
        OBJECT, INTERFACE, open_file, lambda *_: GLib.Variant("u", 4), None
    )
    loop = GLib.MainLoop()
    Gio.bus_own_name_on_connection(
        bus, "org.freedesktop.portal.Desktop", Gio.BusNameOwnerFlags.NONE,
        lambda *_: print(os.environ["DBUS_SESSION_BUS_ADDRESS"], flush=True),
        lambda *_: loop.quit(),
    )
    loop.run()
    return 1  # Lost the name, or never got it.


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
