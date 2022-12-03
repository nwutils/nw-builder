var x3 = Object.create;
var Uu = Object.defineProperty;
var C3 = Object.getOwnPropertyDescriptor;
var O3 = Object.getOwnPropertyNames;
var T3 = Object.getPrototypeOf,
  F3 = Object.prototype.hasOwnProperty;
var y = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports),
  R3 = (e, t) => {
    for (var r in t) Uu(e, r, { get: t[r], enumerable: !0 });
  },
  xw = (e, t, r, i) => {
    if ((t && typeof t == "object") || typeof t == "function")
      for (let n of O3(t))
        !F3.call(e, n) &&
          n !== r &&
          Uu(e, n, {
            get: () => t[n],
            enumerable: !(i = C3(t, n)) || i.enumerable,
          });
    return e;
  };
var ht = (e, t, r) => (
    (r = e != null ? x3(T3(e)) : {}),
    xw(
      t || !e || !e.__esModule
        ? Uu(r, "default", { value: e, enumerable: !0 })
        : r,
      e,
    )
  ),
  A3 = (e) => xw(Uu({}, "__esModule", { value: !0 }), e);
var ed = y((ZX, Cw) => {
  var Xn = 1e3,
    Zn = Xn * 60,
    Kn = Zn * 60,
    Zi = Kn * 24,
    N3 = Zi * 7,
    I3 = Zi * 365.25;
  Cw.exports = function (e, t) {
    t = t || {};
    var r = typeof e;
    if (r === "string" && e.length > 0) return M3(e);
    if (r === "number" && isFinite(e)) return t.long ? q3(e) : L3(e);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" +
        JSON.stringify(e),
    );
  };
  function M3(e) {
    if (((e = String(e)), !(e.length > 100))) {
      var t =
        /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
          e,
        );
      if (!!t) {
        var r = parseFloat(t[1]),
          i = (t[2] || "ms").toLowerCase();
        switch (i) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return r * I3;
          case "weeks":
          case "week":
          case "w":
            return r * N3;
          case "days":
          case "day":
          case "d":
            return r * Zi;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return r * Kn;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return r * Zn;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return r * Xn;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return r;
          default:
            return;
        }
      }
    }
  }
  function L3(e) {
    var t = Math.abs(e);
    return t >= Zi
      ? Math.round(e / Zi) + "d"
      : t >= Kn
      ? Math.round(e / Kn) + "h"
      : t >= Zn
      ? Math.round(e / Zn) + "m"
      : t >= Xn
      ? Math.round(e / Xn) + "s"
      : e + "ms";
  }
  function q3(e) {
    var t = Math.abs(e);
    return t >= Zi
      ? zu(e, t, Zi, "day")
      : t >= Kn
      ? zu(e, t, Kn, "hour")
      : t >= Zn
      ? zu(e, t, Zn, "minute")
      : t >= Xn
      ? zu(e, t, Xn, "second")
      : e + " ms";
  }
  function zu(e, t, r, i) {
    var n = t >= r * 1.5;
    return Math.round(e / r) + " " + i + (n ? "s" : "");
  }
});
var td = y((KX, Ow) => {
  function P3(e) {
    (r.debug = r),
      (r.default = r),
      (r.coerce = u),
      (r.disable = s),
      (r.enable = n),
      (r.enabled = a),
      (r.humanize = ed()),
      (r.destroy = l),
      Object.keys(e).forEach((f) => {
        r[f] = e[f];
      }),
      (r.names = []),
      (r.skips = []),
      (r.formatters = {});
    function t(f) {
      let h = 0;
      for (let c = 0; c < f.length; c++)
        (h = (h << 5) - h + f.charCodeAt(c)), (h |= 0);
      return r.colors[Math.abs(h) % r.colors.length];
    }
    r.selectColor = t;
    function r(f) {
      let h,
        c = null,
        d,
        g;
      function C(...S) {
        if (!C.enabled) return;
        let O = C,
          L = Number(new Date()),
          D = L - (h || L);
        (O.diff = D),
          (O.prev = h),
          (O.curr = L),
          (h = L),
          (S[0] = r.coerce(S[0])),
          typeof S[0] != "string" && S.unshift("%O");
        let w = 0;
        (S[0] = S[0].replace(/%([a-zA-Z%])/g, (m, x) => {
          if (m === "%%") return "%";
          w++;
          let A = r.formatters[x];
          if (typeof A == "function") {
            let p = S[w];
            (m = A.call(O, p)), S.splice(w, 1), w--;
          }
          return m;
        })),
          r.formatArgs.call(O, S),
          (O.log || r.log).apply(O, S);
      }
      return (
        (C.namespace = f),
        (C.useColors = r.useColors()),
        (C.color = r.selectColor(f)),
        (C.extend = i),
        (C.destroy = r.destroy),
        Object.defineProperty(C, "enabled", {
          enumerable: !0,
          configurable: !1,
          get: () =>
            c !== null
              ? c
              : (d !== r.namespaces && ((d = r.namespaces), (g = r.enabled(f))),
                g),
          set: (S) => {
            c = S;
          },
        }),
        typeof r.init == "function" && r.init(C),
        C
      );
    }
    function i(f, h) {
      let c = r(this.namespace + (typeof h > "u" ? ":" : h) + f);
      return (c.log = this.log), c;
    }
    function n(f) {
      r.save(f), (r.namespaces = f), (r.names = []), (r.skips = []);
      let h,
        c = (typeof f == "string" ? f : "").split(/[\s,]+/),
        d = c.length;
      for (h = 0; h < d; h++)
        !c[h] ||
          ((f = c[h].replace(/\*/g, ".*?")),
          f[0] === "-"
            ? r.skips.push(new RegExp("^" + f.slice(1) + "$"))
            : r.names.push(new RegExp("^" + f + "$")));
    }
    function s() {
      let f = [...r.names.map(o), ...r.skips.map(o).map((h) => "-" + h)].join(
        ",",
      );
      return r.enable(""), f;
    }
    function a(f) {
      if (f[f.length - 1] === "*") return !0;
      let h, c;
      for (h = 0, c = r.skips.length; h < c; h++)
        if (r.skips[h].test(f)) return !1;
      for (h = 0, c = r.names.length; h < c; h++)
        if (r.names[h].test(f)) return !0;
      return !1;
    }
    function o(f) {
      return f
        .toString()
        .substring(2, f.toString().length - 2)
        .replace(/\.\*\?$/, "*");
    }
    function u(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function l() {
      console.warn(
        "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.",
      );
    }
    return r.enable(r.load()), r;
  }
  Ow.exports = P3;
});
var Tw = y((St, $u) => {
  St.formatArgs = k3;
  St.save = j3;
  St.load = U3;
  St.useColors = B3;
  St.storage = z3();
  St.destroy = (() => {
    let e = !1;
    return () => {
      e ||
        ((e = !0),
        console.warn(
          "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.",
        ));
    };
  })();
  St.colors = [
    "#0000CC",
    "#0000FF",
    "#0033CC",
    "#0033FF",
    "#0066CC",
    "#0066FF",
    "#0099CC",
    "#0099FF",
    "#00CC00",
    "#00CC33",
    "#00CC66",
    "#00CC99",
    "#00CCCC",
    "#00CCFF",
    "#3300CC",
    "#3300FF",
    "#3333CC",
    "#3333FF",
    "#3366CC",
    "#3366FF",
    "#3399CC",
    "#3399FF",
    "#33CC00",
    "#33CC33",
    "#33CC66",
    "#33CC99",
    "#33CCCC",
    "#33CCFF",
    "#6600CC",
    "#6600FF",
    "#6633CC",
    "#6633FF",
    "#66CC00",
    "#66CC33",
    "#9900CC",
    "#9900FF",
    "#9933CC",
    "#9933FF",
    "#99CC00",
    "#99CC33",
    "#CC0000",
    "#CC0033",
    "#CC0066",
    "#CC0099",
    "#CC00CC",
    "#CC00FF",
    "#CC3300",
    "#CC3333",
    "#CC3366",
    "#CC3399",
    "#CC33CC",
    "#CC33FF",
    "#CC6600",
    "#CC6633",
    "#CC9900",
    "#CC9933",
    "#CCCC00",
    "#CCCC33",
    "#FF0000",
    "#FF0033",
    "#FF0066",
    "#FF0099",
    "#FF00CC",
    "#FF00FF",
    "#FF3300",
    "#FF3333",
    "#FF3366",
    "#FF3399",
    "#FF33CC",
    "#FF33FF",
    "#FF6600",
    "#FF6633",
    "#FF9900",
    "#FF9933",
    "#FFCC00",
    "#FFCC33",
  ];
  function B3() {
    return typeof window < "u" &&
      window.process &&
      (window.process.type === "renderer" || window.process.__nwjs)
      ? !0
      : typeof navigator < "u" &&
        navigator.userAgent &&
        navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
      ? !1
      : (typeof document < "u" &&
          document.documentElement &&
          document.documentElement.style &&
          document.documentElement.style.WebkitAppearance) ||
        (typeof window < "u" &&
          window.console &&
          (window.console.firebug ||
            (window.console.exception && window.console.table))) ||
        (typeof navigator < "u" &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
          parseInt(RegExp.$1, 10) >= 31) ||
        (typeof navigator < "u" &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
  }
  function k3(e) {
    if (
      ((e[0] =
        (this.useColors ? "%c" : "") +
        this.namespace +
        (this.useColors ? " %c" : " ") +
        e[0] +
        (this.useColors ? "%c " : " ") +
        "+" +
        $u.exports.humanize(this.diff)),
      !this.useColors)
    )
      return;
    let t = "color: " + this.color;
    e.splice(1, 0, t, "color: inherit");
    let r = 0,
      i = 0;
    e[0].replace(/%[a-zA-Z%]/g, (n) => {
      n !== "%%" && (r++, n === "%c" && (i = r));
    }),
      e.splice(i, 0, t);
  }
  St.log = console.debug || console.log || (() => {});
  function j3(e) {
    try {
      e ? St.storage.setItem("debug", e) : St.storage.removeItem("debug");
    } catch {}
  }
  function U3() {
    let e;
    try {
      e = St.storage.getItem("debug");
    } catch {}
    return (
      !e && typeof process < "u" && "env" in process && (e = process.env.DEBUG),
      e
    );
  }
  function z3() {
    try {
      return localStorage;
    } catch {}
  }
  $u.exports = td()(St);
  var { formatters: $3 } = $u.exports;
  $3.j = function (e) {
    try {
      return JSON.stringify(e);
    } catch (t) {
      return "[UnexpectedJSONParseError]: " + t.message;
    }
  };
});
var Rw = y((QX, Fw) => {
  "use strict";
  Fw.exports = (e, t = process.argv) => {
    let r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--",
      i = t.indexOf(r + e),
      n = t.indexOf("--");
    return i !== -1 && (n === -1 || i < n);
  };
});
var Iw = y((JX, Nw) => {
  "use strict";
  var W3 = require("os"),
    Aw = require("tty"),
    jt = Rw(),
    { env: We } = process,
    ii;
  jt("no-color") || jt("no-colors") || jt("color=false") || jt("color=never")
    ? (ii = 0)
    : (jt("color") || jt("colors") || jt("color=true") || jt("color=always")) &&
      (ii = 1);
  "FORCE_COLOR" in We &&
    (We.FORCE_COLOR === "true"
      ? (ii = 1)
      : We.FORCE_COLOR === "false"
      ? (ii = 0)
      : (ii =
          We.FORCE_COLOR.length === 0
            ? 1
            : Math.min(parseInt(We.FORCE_COLOR, 10), 3)));
  function rd(e) {
    return e === 0
      ? !1
      : { level: e, hasBasic: !0, has256: e >= 2, has16m: e >= 3 };
  }
  function id(e, t) {
    if (ii === 0) return 0;
    if (jt("color=16m") || jt("color=full") || jt("color=truecolor")) return 3;
    if (jt("color=256")) return 2;
    if (e && !t && ii === void 0) return 0;
    let r = ii || 0;
    if (We.TERM === "dumb") return r;
    if (process.platform === "win32") {
      let i = W3.release().split(".");
      return Number(i[0]) >= 10 && Number(i[2]) >= 10586
        ? Number(i[2]) >= 14931
          ? 3
          : 2
        : 1;
    }
    if ("CI" in We)
      return [
        "TRAVIS",
        "CIRCLECI",
        "APPVEYOR",
        "GITLAB_CI",
        "GITHUB_ACTIONS",
        "BUILDKITE",
      ].some((i) => i in We) || We.CI_NAME === "codeship"
        ? 1
        : r;
    if ("TEAMCITY_VERSION" in We)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(We.TEAMCITY_VERSION) ? 1 : 0;
    if (We.COLORTERM === "truecolor") return 3;
    if ("TERM_PROGRAM" in We) {
      let i = parseInt((We.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (We.TERM_PROGRAM) {
        case "iTerm.app":
          return i >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(We.TERM)
      ? 2
      : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(
          We.TERM,
        ) || "COLORTERM" in We
      ? 1
      : r;
  }
  function G3(e) {
    let t = id(e, e && e.isTTY);
    return rd(t);
  }
  Nw.exports = {
    supportsColor: G3,
    stdout: rd(id(!0, Aw.isatty(1))),
    stderr: rd(id(!0, Aw.isatty(2))),
  };
});
var Lw = y((Ve, Gu) => {
  var H3 = require("tty"),
    Wu = require("util");
  Ve.init = J3;
  Ve.log = Z3;
  Ve.formatArgs = V3;
  Ve.save = K3;
  Ve.load = Q3;
  Ve.useColors = Y3;
  Ve.destroy = Wu.deprecate(() => {},
  "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
  Ve.colors = [6, 2, 3, 4, 5, 1];
  try {
    let e = Iw();
    e &&
      (e.stderr || e).level >= 2 &&
      (Ve.colors = [
        20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63,
        68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128,
        129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168,
        169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200,
        201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221,
      ]);
  } catch {}
  Ve.inspectOpts = Object.keys(process.env)
    .filter((e) => /^debug_/i.test(e))
    .reduce((e, t) => {
      let r = t
          .substring(6)
          .toLowerCase()
          .replace(/_([a-z])/g, (n, s) => s.toUpperCase()),
        i = process.env[t];
      return (
        /^(yes|on|true|enabled)$/i.test(i)
          ? (i = !0)
          : /^(no|off|false|disabled)$/i.test(i)
          ? (i = !1)
          : i === "null"
          ? (i = null)
          : (i = Number(i)),
        (e[r] = i),
        e
      );
    }, {});
  function Y3() {
    return "colors" in Ve.inspectOpts
      ? Boolean(Ve.inspectOpts.colors)
      : H3.isatty(process.stderr.fd);
  }
  function V3(e) {
    let { namespace: t, useColors: r } = this;
    if (r) {
      let i = this.color,
        n = "\x1B[3" + (i < 8 ? i : "8;5;" + i),
        s = `  ${n};1m${t} \x1B[0m`;
      (e[0] =
        s +
        e[0]
          .split(
            `
`,
          )
          .join(
            `
` + s,
          )),
        e.push(n + "m+" + Gu.exports.humanize(this.diff) + "\x1B[0m");
    } else e[0] = X3() + t + " " + e[0];
  }
  function X3() {
    return Ve.inspectOpts.hideDate ? "" : new Date().toISOString() + " ";
  }
  function Z3(...e) {
    return process.stderr.write(
      Wu.format(...e) +
        `
`,
    );
  }
  function K3(e) {
    e ? (process.env.DEBUG = e) : delete process.env.DEBUG;
  }
  function Q3() {
    return process.env.DEBUG;
  }
  function J3(e) {
    e.inspectOpts = {};
    let t = Object.keys(Ve.inspectOpts);
    for (let r = 0; r < t.length; r++)
      e.inspectOpts[t[r]] = Ve.inspectOpts[t[r]];
  }
  Gu.exports = td()(Ve);
  var { formatters: Mw } = Gu.exports;
  Mw.o = function (e) {
    return (
      (this.inspectOpts.colors = this.useColors),
      Wu.inspect(e, this.inspectOpts)
        .split(
          `
`,
        )
        .map((t) => t.trim())
        .join(" ")
    );
  };
  Mw.O = function (e) {
    return (
      (this.inspectOpts.colors = this.useColors),
      Wu.inspect(e, this.inspectOpts)
    );
  };
});
var qw = y((eZ, nd) => {
  typeof process > "u" ||
  process.type === "renderer" ||
  process.browser === !0 ||
  process.__nwjs
    ? (nd.exports = Tw())
    : (nd.exports = Lw());
});
var sd = y((tZ, Bw) => {
  Bw.exports = Pw;
  function Pw(e, t) {
    if (e && t) return Pw(e)(t);
    if (typeof e != "function") throw new TypeError("need wrapper function");
    return (
      Object.keys(e).forEach(function (i) {
        r[i] = e[i];
      }),
      r
    );
    function r() {
      for (var i = new Array(arguments.length), n = 0; n < i.length; n++)
        i[n] = arguments[n];
      var s = e.apply(this, i),
        a = i[i.length - 1];
      return (
        typeof s == "function" &&
          s !== a &&
          Object.keys(a).forEach(function (o) {
            s[o] = a[o];
          }),
        s
      );
    }
  }
});
var Ra = y((rZ, ad) => {
  var kw = sd();
  ad.exports = kw(Hu);
  ad.exports.strict = kw(jw);
  Hu.proto = Hu(function () {
    Object.defineProperty(Function.prototype, "once", {
      value: function () {
        return Hu(this);
      },
      configurable: !0,
    }),
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function () {
          return jw(this);
        },
        configurable: !0,
      });
  });
  function Hu(e) {
    var t = function () {
      return t.called
        ? t.value
        : ((t.called = !0), (t.value = e.apply(this, arguments)));
    };
    return (t.called = !1), t;
  }
  function jw(e) {
    var t = function () {
        if (t.called) throw new Error(t.onceError);
        return (t.called = !0), (t.value = e.apply(this, arguments));
      },
      r = e.name || "Function wrapped with `once`";
    return (
      (t.onceError = r + " shouldn't be called more than once"),
      (t.called = !1),
      t
    );
  }
});
var od = y((iZ, zw) => {
  var e5 = Ra(),
    t5 = function () {},
    r5 = function (e) {
      return e.setHeader && typeof e.abort == "function";
    },
    i5 = function (e) {
      return e.stdio && Array.isArray(e.stdio) && e.stdio.length === 3;
    },
    Uw = function (e, t, r) {
      if (typeof t == "function") return Uw(e, null, t);
      t || (t = {}), (r = e5(r || t5));
      var i = e._writableState,
        n = e._readableState,
        s = t.readable || (t.readable !== !1 && e.readable),
        a = t.writable || (t.writable !== !1 && e.writable),
        o = !1,
        u = function () {
          e.writable || l();
        },
        l = function () {
          (a = !1), s || r.call(e);
        },
        f = function () {
          (s = !1), a || r.call(e);
        },
        h = function (S) {
          r.call(e, S ? new Error("exited with error code: " + S) : null);
        },
        c = function (S) {
          r.call(e, S);
        },
        d = function () {
          process.nextTick(g);
        },
        g = function () {
          if (!o) {
            if (s && !(n && n.ended && !n.destroyed))
              return r.call(e, new Error("premature close"));
            if (a && !(i && i.ended && !i.destroyed))
              return r.call(e, new Error("premature close"));
          }
        },
        C = function () {
          e.req.on("finish", l);
        };
      return (
        r5(e)
          ? (e.on("complete", l),
            e.on("abort", d),
            e.req ? C() : e.on("request", C))
          : a && !i && (e.on("end", u), e.on("close", u)),
        i5(e) && e.on("exit", h),
        e.on("end", f),
        e.on("finish", l),
        t.error !== !1 && e.on("error", c),
        e.on("close", d),
        function () {
          (o = !0),
            e.removeListener("complete", l),
            e.removeListener("abort", d),
            e.removeListener("request", C),
            e.req && e.req.removeListener("finish", l),
            e.removeListener("end", u),
            e.removeListener("close", u),
            e.removeListener("finish", l),
            e.removeListener("exit", h),
            e.removeListener("end", f),
            e.removeListener("error", c),
            e.removeListener("close", d);
        }
      );
    };
  zw.exports = Uw;
});
var Gw = y((nZ, Ww) => {
  var n5 = Ra(),
    s5 = od(),
    ud = require("fs"),
    Aa = function () {},
    a5 = /^v?\.0/.test(process.version),
    Yu = function (e) {
      return typeof e == "function";
    },
    o5 = function (e) {
      return !a5 || !ud
        ? !1
        : (e instanceof (ud.ReadStream || Aa) ||
            e instanceof (ud.WriteStream || Aa)) &&
            Yu(e.close);
    },
    u5 = function (e) {
      return e.setHeader && Yu(e.abort);
    },
    l5 = function (e, t, r, i) {
      i = n5(i);
      var n = !1;
      e.on("close", function () {
        n = !0;
      }),
        s5(e, { readable: t, writable: r }, function (a) {
          if (a) return i(a);
          (n = !0), i();
        });
      var s = !1;
      return function (a) {
        if (!n && !s) {
          if (((s = !0), o5(e))) return e.close(Aa);
          if (u5(e)) return e.abort();
          if (Yu(e.destroy)) return e.destroy();
          i(a || new Error("stream was destroyed"));
        }
      };
    },
    $w = function (e) {
      e();
    },
    f5 = function (e, t) {
      return e.pipe(t);
    },
    h5 = function () {
      var e = Array.prototype.slice.call(arguments),
        t = (Yu(e[e.length - 1] || Aa) && e.pop()) || Aa;
      if ((Array.isArray(e[0]) && (e = e[0]), e.length < 2))
        throw new Error("pump requires two streams per minimum");
      var r,
        i = e.map(function (n, s) {
          var a = s < e.length - 1,
            o = s > 0;
          return l5(n, a, o, function (u) {
            r || (r = u), u && i.forEach($w), !a && (i.forEach($w), t(r));
          });
        });
      return e.reduce(f5);
    };
  Ww.exports = h5;
});
var Yw = y((sZ, Hw) => {
  "use strict";
  var { PassThrough: c5 } = require("stream");
  Hw.exports = (e) => {
    e = { ...e };
    let { array: t } = e,
      { encoding: r } = e,
      i = r === "buffer",
      n = !1;
    t ? (n = !(r || i)) : (r = r || "utf8"), i && (r = null);
    let s = new c5({ objectMode: n });
    r && s.setEncoding(r);
    let a = 0,
      o = [];
    return (
      s.on("data", (u) => {
        o.push(u), n ? (a = o.length) : (a += u.length);
      }),
      (s.getBufferedValue = () =>
        t ? o : i ? Buffer.concat(o, a) : o.join("")),
      (s.getBufferedLength = () => a),
      s
    );
  };
});
var Vw = y((aZ, Qn) => {
  "use strict";
  var { constants: d5 } = require("buffer"),
    p5 = Gw(),
    m5 = Yw(),
    Vu = class extends Error {
      constructor() {
        super("maxBuffer exceeded"), (this.name = "MaxBufferError");
      }
    };
  async function Xu(e, t) {
    if (!e) return Promise.reject(new Error("Expected a stream"));
    t = { maxBuffer: 1 / 0, ...t };
    let { maxBuffer: r } = t,
      i;
    return (
      await new Promise((n, s) => {
        let a = (o) => {
          o &&
            i.getBufferedLength() <= d5.MAX_LENGTH &&
            (o.bufferedData = i.getBufferedValue()),
            s(o);
        };
        (i = p5(e, m5(t), (o) => {
          if (o) {
            a(o);
            return;
          }
          n();
        })),
          i.on("data", () => {
            i.getBufferedLength() > r && a(new Vu());
          });
      }),
      i.getBufferedValue()
    );
  }
  Qn.exports = Xu;
  Qn.exports.default = Xu;
  Qn.exports.buffer = (e, t) => Xu(e, { ...t, encoding: "buffer" });
  Qn.exports.array = (e, t) => Xu(e, { ...t, array: !0 });
  Qn.exports.MaxBufferError = Vu;
});
var Qw = y((oZ, Kw) => {
  Kw.exports = Zu;
  function Zu() {
    (this.pending = 0),
      (this.max = 1 / 0),
      (this.listeners = []),
      (this.waiting = []),
      (this.error = null);
  }
  Zu.prototype.go = function (e) {
    this.pending < this.max ? Zw(this, e) : this.waiting.push(e);
  };
  Zu.prototype.wait = function (e) {
    this.pending === 0 ? e(this.error) : this.listeners.push(e);
  };
  Zu.prototype.hold = function () {
    return Xw(this);
  };
  function Xw(e) {
    e.pending += 1;
    var t = !1;
    return r;
    function r(n) {
      if (t) throw new Error("callback called twice");
      if (
        ((t = !0),
        (e.error = e.error || n),
        (e.pending -= 1),
        e.waiting.length > 0 && e.pending < e.max)
      )
        Zw(e, e.waiting.shift());
      else if (e.pending === 0) {
        var s = e.listeners;
        (e.listeners = []), s.forEach(i);
      }
    }
    function i(n) {
      n(e.error);
    }
  }
  function Zw(e, t) {
    t(Xw(e));
  }
});
var eD = y((Ia) => {
  var Na = require("fs"),
    Ku = require("util"),
    ld = require("stream"),
    Jw = ld.Readable,
    fd = ld.Writable,
    g5 = ld.PassThrough,
    y5 = Qw(),
    Qu = require("events").EventEmitter;
  Ia.createFromBuffer = v5;
  Ia.createFromFd = w5;
  Ia.BufferSlicer = Tr;
  Ia.FdSlicer = Or;
  Ku.inherits(Or, Qu);
  function Or(e, t) {
    (t = t || {}),
      Qu.call(this),
      (this.fd = e),
      (this.pend = new y5()),
      (this.pend.max = 1),
      (this.refCount = 0),
      (this.autoClose = !!t.autoClose);
  }
  Or.prototype.read = function (e, t, r, i, n) {
    var s = this;
    s.pend.go(function (a) {
      Na.read(s.fd, e, t, r, i, function (o, u, l) {
        a(), n(o, u, l);
      });
    });
  };
  Or.prototype.write = function (e, t, r, i, n) {
    var s = this;
    s.pend.go(function (a) {
      Na.write(s.fd, e, t, r, i, function (o, u, l) {
        a(), n(o, u, l);
      });
    });
  };
  Or.prototype.createReadStream = function (e) {
    return new Ju(this, e);
  };
  Or.prototype.createWriteStream = function (e) {
    return new el(this, e);
  };
  Or.prototype.ref = function () {
    this.refCount += 1;
  };
  Or.prototype.unref = function () {
    var e = this;
    if (((e.refCount -= 1), e.refCount > 0)) return;
    if (e.refCount < 0) throw new Error("invalid unref");
    e.autoClose && Na.close(e.fd, t);
    function t(r) {
      r ? e.emit("error", r) : e.emit("close");
    }
  };
  Ku.inherits(Ju, Jw);
  function Ju(e, t) {
    (t = t || {}),
      Jw.call(this, t),
      (this.context = e),
      this.context.ref(),
      (this.start = t.start || 0),
      (this.endOffset = t.end),
      (this.pos = this.start),
      (this.destroyed = !1);
  }
  Ju.prototype._read = function (e) {
    var t = this;
    if (!t.destroyed) {
      var r = Math.min(t._readableState.highWaterMark, e);
      if (
        (t.endOffset != null && (r = Math.min(r, t.endOffset - t.pos)), r <= 0)
      ) {
        (t.destroyed = !0), t.push(null), t.context.unref();
        return;
      }
      t.context.pend.go(function (i) {
        if (t.destroyed) return i();
        var n = new Buffer(r);
        Na.read(t.context.fd, n, 0, r, t.pos, function (s, a) {
          s
            ? t.destroy(s)
            : a === 0
            ? ((t.destroyed = !0), t.push(null), t.context.unref())
            : ((t.pos += a), t.push(n.slice(0, a))),
            i();
        });
      });
    }
  };
  Ju.prototype.destroy = function (e) {
    this.destroyed ||
      ((e = e || new Error("stream destroyed")),
      (this.destroyed = !0),
      this.emit("error", e),
      this.context.unref());
  };
  Ku.inherits(el, fd);
  function el(e, t) {
    (t = t || {}),
      fd.call(this, t),
      (this.context = e),
      this.context.ref(),
      (this.start = t.start || 0),
      (this.endOffset = t.end == null ? 1 / 0 : +t.end),
      (this.bytesWritten = 0),
      (this.pos = this.start),
      (this.destroyed = !1),
      this.on("finish", this.destroy.bind(this));
  }
  el.prototype._write = function (e, t, r) {
    var i = this;
    if (!i.destroyed) {
      if (i.pos + e.length > i.endOffset) {
        var n = new Error("maximum file length exceeded");
        (n.code = "ETOOBIG"), i.destroy(), r(n);
        return;
      }
      i.context.pend.go(function (s) {
        if (i.destroyed) return s();
        Na.write(i.context.fd, e, 0, e.length, i.pos, function (a, o) {
          a
            ? (i.destroy(), s(), r(a))
            : ((i.bytesWritten += o),
              (i.pos += o),
              i.emit("progress"),
              s(),
              r());
        });
      });
    }
  };
  el.prototype.destroy = function () {
    this.destroyed || ((this.destroyed = !0), this.context.unref());
  };
  Ku.inherits(Tr, Qu);
  function Tr(e, t) {
    Qu.call(this),
      (t = t || {}),
      (this.refCount = 0),
      (this.buffer = e),
      (this.maxChunkSize = t.maxChunkSize || Number.MAX_SAFE_INTEGER);
  }
  Tr.prototype.read = function (e, t, r, i, n) {
    var s = i + r,
      a = s - this.buffer.length,
      o = a > 0 ? a : r;
    this.buffer.copy(e, t, i, s),
      setImmediate(function () {
        n(null, o);
      });
  };
  Tr.prototype.write = function (e, t, r, i, n) {
    e.copy(this.buffer, i, t, t + r),
      setImmediate(function () {
        n(null, r, e);
      });
  };
  Tr.prototype.createReadStream = function (e) {
    e = e || {};
    var t = new g5(e);
    (t.destroyed = !1),
      (t.start = e.start || 0),
      (t.endOffset = e.end),
      (t.pos = t.endOffset || this.buffer.length);
    for (var r = this.buffer.slice(t.start, t.pos), i = 0; ; ) {
      var n = i + this.maxChunkSize;
      if (n >= r.length) {
        i < r.length && t.write(r.slice(i, r.length));
        break;
      }
      t.write(r.slice(i, n)), (i = n);
    }
    return (
      t.end(),
      (t.destroy = function () {
        t.destroyed = !0;
      }),
      t
    );
  };
  Tr.prototype.createWriteStream = function (e) {
    var t = this;
    e = e || {};
    var r = new fd(e);
    return (
      (r.start = e.start || 0),
      (r.endOffset = e.end == null ? this.buffer.length : +e.end),
      (r.bytesWritten = 0),
      (r.pos = r.start),
      (r.destroyed = !1),
      (r._write = function (i, n, s) {
        if (!r.destroyed) {
          var a = r.pos + i.length;
          if (a > r.endOffset) {
            var o = new Error("maximum file length exceeded");
            (o.code = "ETOOBIG"), (r.destroyed = !0), s(o);
            return;
          }
          i.copy(t.buffer, r.pos, 0, i.length),
            (r.bytesWritten += i.length),
            (r.pos = a),
            r.emit("progress"),
            s();
        }
      }),
      (r.destroy = function () {
        r.destroyed = !0;
      }),
      r
    );
  };
  Tr.prototype.ref = function () {
    this.refCount += 1;
  };
  Tr.prototype.unref = function () {
    if (((this.refCount -= 1), this.refCount < 0))
      throw new Error("invalid unref");
  };
  function v5(e, t) {
    return new Tr(e, t);
  }
  function w5(e, t) {
    return new Or(e, t);
  }
});
var tl = y((lZ, rD) => {
  var ni = require("buffer").Buffer,
    hd = [
      0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685,
      2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995,
      2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648,
      2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990,
      1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755,
      2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145,
      1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206,
      2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980,
      1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705,
      3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527,
      1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772,
      4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290,
      251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719,
      3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925,
      453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202,
      4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960,
      984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733,
      3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467,
      855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048,
      3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054,
      702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443,
      3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945,
      2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430,
      2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580,
      2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225,
      1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143,
      2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732,
      1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850,
      2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135,
      1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109,
      3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954,
      1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920,
      3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877,
      83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603,
      3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992,
      534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934,
      4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795,
      376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105,
      3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270,
      936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108,
      3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449,
      601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471,
      3272380065, 1510334235, 755167117,
    ];
  typeof Int32Array < "u" && (hd = new Int32Array(hd));
  function tD(e) {
    if (ni.isBuffer(e)) return e;
    var t = typeof ni.alloc == "function" && typeof ni.from == "function";
    if (typeof e == "number") return t ? ni.alloc(e) : new ni(e);
    if (typeof e == "string") return t ? ni.from(e) : new ni(e);
    throw new Error(
      "input must be buffer, number, or string, received " + typeof e,
    );
  }
  function D5(e) {
    var t = tD(4);
    return t.writeInt32BE(e, 0), t;
  }
  function cd(e, t) {
    (e = tD(e)), ni.isBuffer(t) && (t = t.readUInt32BE(0));
    for (var r = ~~t ^ -1, i = 0; i < e.length; i++)
      r = hd[(r ^ e[i]) & 255] ^ (r >>> 8);
    return r ^ -1;
  }
  function dd() {
    return D5(cd.apply(null, arguments));
  }
  dd.signed = function () {
    return cd.apply(null, arguments);
  };
  dd.unsigned = function () {
    return cd.apply(null, arguments) >>> 0;
  };
  rD.exports = dd;
});
var lD = y((ur) => {
  var pd = require("fs"),
    b5 = require("zlib"),
    iD = eD(),
    E5 = tl(),
    nl = require("util"),
    sl = require("events").EventEmitter,
    nD = require("stream").Transform,
    md = require("stream").PassThrough,
    _5 = require("stream").Writable;
  ur.open = S5;
  ur.fromFd = sD;
  ur.fromBuffer = x5;
  ur.fromRandomAccessReader = gd;
  ur.dosDateTimeToDate = oD;
  ur.validateFileName = uD;
  ur.ZipFile = si;
  ur.Entry = Ma;
  ur.RandomAccessReader = ai;
  function S5(e, t, r) {
    typeof t == "function" && ((r = t), (t = null)),
      t == null && (t = {}),
      t.autoClose == null && (t.autoClose = !0),
      t.lazyEntries == null && (t.lazyEntries = !1),
      t.decodeStrings == null && (t.decodeStrings = !0),
      t.validateEntrySizes == null && (t.validateEntrySizes = !0),
      t.strictFileNames == null && (t.strictFileNames = !1),
      r == null && (r = il),
      pd.open(e, "r", function (i, n) {
        if (i) return r(i);
        sD(n, t, function (s, a) {
          s && pd.close(n, il), r(s, a);
        });
      });
  }
  function sD(e, t, r) {
    typeof t == "function" && ((r = t), (t = null)),
      t == null && (t = {}),
      t.autoClose == null && (t.autoClose = !1),
      t.lazyEntries == null && (t.lazyEntries = !1),
      t.decodeStrings == null && (t.decodeStrings = !0),
      t.validateEntrySizes == null && (t.validateEntrySizes = !0),
      t.strictFileNames == null && (t.strictFileNames = !1),
      r == null && (r = il),
      pd.fstat(e, function (i, n) {
        if (i) return r(i);
        var s = iD.createFromFd(e, { autoClose: !0 });
        gd(s, n.size, t, r);
      });
  }
  function x5(e, t, r) {
    typeof t == "function" && ((r = t), (t = null)),
      t == null && (t = {}),
      (t.autoClose = !1),
      t.lazyEntries == null && (t.lazyEntries = !1),
      t.decodeStrings == null && (t.decodeStrings = !0),
      t.validateEntrySizes == null && (t.validateEntrySizes = !0),
      t.strictFileNames == null && (t.strictFileNames = !1);
    var i = iD.createFromBuffer(e, { maxChunkSize: 65536 });
    gd(i, e.length, t, r);
  }
  function gd(e, t, r, i) {
    typeof r == "function" && ((i = r), (r = null)),
      r == null && (r = {}),
      r.autoClose == null && (r.autoClose = !0),
      r.lazyEntries == null && (r.lazyEntries = !1),
      r.decodeStrings == null && (r.decodeStrings = !0);
    var n = !!r.decodeStrings;
    if (
      (r.validateEntrySizes == null && (r.validateEntrySizes = !0),
      r.strictFileNames == null && (r.strictFileNames = !1),
      i == null && (i = il),
      typeof t != "number")
    )
      throw new Error("expected totalSize parameter to be a number");
    if (t > Number.MAX_SAFE_INTEGER)
      throw new Error(
        "zip file too large. only file sizes up to 2^52 are supported due to JavaScript's Number type being an IEEE 754 double.",
      );
    e.ref();
    var s = 22,
      a = 65535,
      o = Math.min(s + a, t),
      u = or(o),
      l = t - u.length;
    Jn(e, u, 0, o, l, function (f) {
      if (f) return i(f);
      for (var h = o - s; h >= 0; h -= 1)
        if (u.readUInt32LE(h) === 101010256) {
          var c = u.slice(h),
            d = c.readUInt16LE(4);
          if (d !== 0)
            return i(
              new Error(
                "multi-disk zip files are not supported: found disk number: " +
                  d,
              ),
            );
          var g = c.readUInt16LE(10),
            C = c.readUInt32LE(16),
            S = c.readUInt16LE(20),
            O = c.length - s;
          if (S !== O)
            return i(
              new Error(
                "invalid comment length. expected: " + O + ". found: " + S,
              ),
            );
          var L = n ? rl(c, 22, c.length, !1) : c.slice(22);
          if (!(g === 65535 || C === 4294967295))
            return i(
              null,
              new si(
                e,
                C,
                t,
                g,
                L,
                r.autoClose,
                r.lazyEntries,
                n,
                r.validateEntrySizes,
                r.strictFileNames,
              ),
            );
          var D = or(20),
            w = l + h - D.length;
          Jn(e, D, 0, D.length, w, function (F) {
            if (F) return i(F);
            if (D.readUInt32LE(0) !== 117853008)
              return i(
                new Error(
                  "invalid zip64 end of central directory locator signature",
                ),
              );
            var m = es(D, 8),
              x = or(56);
            Jn(e, x, 0, x.length, m, function (A) {
              return A
                ? i(A)
                : x.readUInt32LE(0) !== 101075792
                ? i(
                    new Error(
                      "invalid zip64 end of central directory record signature",
                    ),
                  )
                : ((g = es(x, 32)),
                  (C = es(x, 48)),
                  i(
                    null,
                    new si(
                      e,
                      C,
                      t,
                      g,
                      L,
                      r.autoClose,
                      r.lazyEntries,
                      n,
                      r.validateEntrySizes,
                      r.strictFileNames,
                    ),
                  ));
            });
          });
          return;
        }
      i(new Error("end of central directory record signature not found"));
    });
  }
  nl.inherits(si, sl);
  function si(e, t, r, i, n, s, a, o, u, l) {
    var f = this;
    sl.call(f),
      (f.reader = e),
      f.reader.on("error", function (h) {
        aD(f, h);
      }),
      f.reader.once("close", function () {
        f.emit("close");
      }),
      (f.readEntryCursor = t),
      (f.fileSize = r),
      (f.entryCount = i),
      (f.comment = n),
      (f.entriesRead = 0),
      (f.autoClose = !!s),
      (f.lazyEntries = !!a),
      (f.decodeStrings = !!o),
      (f.validateEntrySizes = !!u),
      (f.strictFileNames = !!l),
      (f.isOpen = !0),
      (f.emittedError = !1),
      f.lazyEntries || f._readEntry();
  }
  si.prototype.close = function () {
    !this.isOpen || ((this.isOpen = !1), this.reader.unref());
  };
  function Zt(e, t) {
    e.autoClose && e.close(), aD(e, t);
  }
  function aD(e, t) {
    e.emittedError || ((e.emittedError = !0), e.emit("error", t));
  }
  si.prototype.readEntry = function () {
    if (!this.lazyEntries)
      throw new Error("readEntry() called without lazyEntries:true");
    this._readEntry();
  };
  si.prototype._readEntry = function () {
    var e = this;
    if (e.entryCount === e.entriesRead) {
      setImmediate(function () {
        e.autoClose && e.close(), !e.emittedError && e.emit("end");
      });
      return;
    }
    if (!e.emittedError) {
      var t = or(46);
      Jn(e.reader, t, 0, t.length, e.readEntryCursor, function (r) {
        if (r) return Zt(e, r);
        if (!e.emittedError) {
          var i = new Ma(),
            n = t.readUInt32LE(0);
          if (n !== 33639248)
            return Zt(
              e,
              new Error(
                "invalid central directory file header signature: 0x" +
                  n.toString(16),
              ),
            );
          if (
            ((i.versionMadeBy = t.readUInt16LE(4)),
            (i.versionNeededToExtract = t.readUInt16LE(6)),
            (i.generalPurposeBitFlag = t.readUInt16LE(8)),
            (i.compressionMethod = t.readUInt16LE(10)),
            (i.lastModFileTime = t.readUInt16LE(12)),
            (i.lastModFileDate = t.readUInt16LE(14)),
            (i.crc32 = t.readUInt32LE(16)),
            (i.compressedSize = t.readUInt32LE(20)),
            (i.uncompressedSize = t.readUInt32LE(24)),
            (i.fileNameLength = t.readUInt16LE(28)),
            (i.extraFieldLength = t.readUInt16LE(30)),
            (i.fileCommentLength = t.readUInt16LE(32)),
            (i.internalFileAttributes = t.readUInt16LE(36)),
            (i.externalFileAttributes = t.readUInt32LE(38)),
            (i.relativeOffsetOfLocalHeader = t.readUInt32LE(42)),
            i.generalPurposeBitFlag & 64)
          )
            return Zt(e, new Error("strong encryption is not supported"));
          (e.readEntryCursor += 46),
            (t = or(
              i.fileNameLength + i.extraFieldLength + i.fileCommentLength,
            )),
            Jn(e.reader, t, 0, t.length, e.readEntryCursor, function (s) {
              if (s) return Zt(e, s);
              if (!e.emittedError) {
                var a = (i.generalPurposeBitFlag & 2048) !== 0;
                i.fileName = e.decodeStrings
                  ? rl(t, 0, i.fileNameLength, a)
                  : t.slice(0, i.fileNameLength);
                var o = i.fileNameLength + i.extraFieldLength,
                  u = t.slice(i.fileNameLength, o);
                i.extraFields = [];
                for (var l = 0; l < u.length - 3; ) {
                  var f = u.readUInt16LE(l + 0),
                    h = u.readUInt16LE(l + 2),
                    c = l + 4,
                    d = c + h;
                  if (d > u.length)
                    return Zt(
                      e,
                      new Error(
                        "extra field length exceeds extra field buffer size",
                      ),
                    );
                  var g = or(h);
                  u.copy(g, 0, c, d),
                    i.extraFields.push({ id: f, data: g }),
                    (l = d);
                }
                if (
                  ((i.fileComment = e.decodeStrings
                    ? rl(t, o, o + i.fileCommentLength, a)
                    : t.slice(o, o + i.fileCommentLength)),
                  (i.comment = i.fileComment),
                  (e.readEntryCursor += t.length),
                  (e.entriesRead += 1),
                  i.uncompressedSize === 4294967295 ||
                    i.compressedSize === 4294967295 ||
                    i.relativeOffsetOfLocalHeader === 4294967295)
                ) {
                  for (var C = null, l = 0; l < i.extraFields.length; l++) {
                    var S = i.extraFields[l];
                    if (S.id === 1) {
                      C = S.data;
                      break;
                    }
                  }
                  if (C == null)
                    return Zt(
                      e,
                      new Error(
                        "expected zip64 extended information extra field",
                      ),
                    );
                  var O = 0;
                  if (i.uncompressedSize === 4294967295) {
                    if (O + 8 > C.length)
                      return Zt(
                        e,
                        new Error(
                          "zip64 extended information extra field does not include uncompressed size",
                        ),
                      );
                    (i.uncompressedSize = es(C, O)), (O += 8);
                  }
                  if (i.compressedSize === 4294967295) {
                    if (O + 8 > C.length)
                      return Zt(
                        e,
                        new Error(
                          "zip64 extended information extra field does not include compressed size",
                        ),
                      );
                    (i.compressedSize = es(C, O)), (O += 8);
                  }
                  if (i.relativeOffsetOfLocalHeader === 4294967295) {
                    if (O + 8 > C.length)
                      return Zt(
                        e,
                        new Error(
                          "zip64 extended information extra field does not include relative header offset",
                        ),
                      );
                    (i.relativeOffsetOfLocalHeader = es(C, O)), (O += 8);
                  }
                }
                if (e.decodeStrings)
                  for (var l = 0; l < i.extraFields.length; l++) {
                    var S = i.extraFields[l];
                    if (S.id === 28789) {
                      if (S.data.length < 6 || S.data.readUInt8(0) !== 1)
                        continue;
                      var L = S.data.readUInt32LE(1);
                      if (E5.unsigned(t.slice(0, i.fileNameLength)) !== L)
                        continue;
                      i.fileName = rl(S.data, 5, S.data.length, !0);
                      break;
                    }
                  }
                if (e.validateEntrySizes && i.compressionMethod === 0) {
                  var D = i.uncompressedSize;
                  if ((i.isEncrypted() && (D += 12), i.compressedSize !== D)) {
                    var w =
                      "compressed/uncompressed size mismatch for stored file: " +
                      i.compressedSize +
                      " != " +
                      i.uncompressedSize;
                    return Zt(e, new Error(w));
                  }
                }
                if (e.decodeStrings) {
                  e.strictFileNames ||
                    (i.fileName = i.fileName.replace(/\\/g, "/"));
                  var F = uD(i.fileName, e.validateFileNameOptions);
                  if (F != null) return Zt(e, new Error(F));
                }
                e.emit("entry", i), e.lazyEntries || e._readEntry();
              }
            });
        }
      });
    }
  };
  si.prototype.openReadStream = function (e, t, r) {
    var i = this,
      n = 0,
      s = e.compressedSize;
    if (r == null) (r = t), (t = {});
    else {
      if (t.decrypt != null) {
        if (!e.isEncrypted())
          throw new Error(
            "options.decrypt can only be specified for encrypted entries",
          );
        if (t.decrypt !== !1)
          throw new Error("invalid options.decrypt value: " + t.decrypt);
        if (e.isCompressed() && t.decompress !== !1)
          throw new Error(
            "entry is encrypted and compressed, and options.decompress !== false",
          );
      }
      if (t.decompress != null) {
        if (!e.isCompressed())
          throw new Error(
            "options.decompress can only be specified for compressed entries",
          );
        if (!(t.decompress === !1 || t.decompress === !0))
          throw new Error("invalid options.decompress value: " + t.decompress);
      }
      if (t.start != null || t.end != null) {
        if (e.isCompressed() && t.decompress !== !1)
          throw new Error(
            "start/end range not allowed for compressed entry without options.decompress === false",
          );
        if (e.isEncrypted() && t.decrypt !== !1)
          throw new Error(
            "start/end range not allowed for encrypted entry without options.decrypt === false",
          );
      }
      if (t.start != null) {
        if (((n = t.start), n < 0)) throw new Error("options.start < 0");
        if (n > e.compressedSize)
          throw new Error("options.start > entry.compressedSize");
      }
      if (t.end != null) {
        if (((s = t.end), s < 0)) throw new Error("options.end < 0");
        if (s > e.compressedSize)
          throw new Error("options.end > entry.compressedSize");
        if (s < n) throw new Error("options.end < options.start");
      }
    }
    if (!i.isOpen) return r(new Error("closed"));
    if (e.isEncrypted() && t.decrypt !== !1)
      return r(new Error("entry is encrypted, and options.decrypt !== false"));
    i.reader.ref();
    var a = or(30);
    Jn(i.reader, a, 0, a.length, e.relativeOffsetOfLocalHeader, function (o) {
      try {
        if (o) return r(o);
        var u = a.readUInt32LE(0);
        if (u !== 67324752)
          return r(
            new Error(
              "invalid local file header signature: 0x" + u.toString(16),
            ),
          );
        var l = a.readUInt16LE(26),
          f = a.readUInt16LE(28),
          h = e.relativeOffsetOfLocalHeader + a.length + l + f,
          c;
        if (e.compressionMethod === 0) c = !1;
        else if (e.compressionMethod === 8)
          c = t.decompress != null ? t.decompress : !0;
        else
          return r(
            new Error("unsupported compression method: " + e.compressionMethod),
          );
        var d = h,
          g = d + e.compressedSize;
        if (e.compressedSize !== 0 && g > i.fileSize)
          return r(
            new Error(
              "file data overflows file bounds: " +
                d +
                " + " +
                e.compressedSize +
                " > " +
                i.fileSize,
            ),
          );
        var C = i.reader.createReadStream({ start: d + n, end: d + s }),
          S = C;
        if (c) {
          var O = !1,
            L = b5.createInflateRaw();
          C.on("error", function (D) {
            setImmediate(function () {
              O || L.emit("error", D);
            });
          }),
            C.pipe(L),
            i.validateEntrySizes
              ? ((S = new La(e.uncompressedSize)),
                L.on("error", function (D) {
                  setImmediate(function () {
                    O || S.emit("error", D);
                  });
                }),
                L.pipe(S))
              : (S = L),
            (S.destroy = function () {
              (O = !0), L !== S && L.unpipe(S), C.unpipe(L), C.destroy();
            });
        }
        r(null, S);
      } finally {
        i.reader.unref();
      }
    });
  };
  function Ma() {}
  Ma.prototype.getLastModDate = function () {
    return oD(this.lastModFileDate, this.lastModFileTime);
  };
  Ma.prototype.isEncrypted = function () {
    return (this.generalPurposeBitFlag & 1) !== 0;
  };
  Ma.prototype.isCompressed = function () {
    return this.compressionMethod === 8;
  };
  function oD(e, t) {
    var r = e & 31,
      i = ((e >> 5) & 15) - 1,
      n = ((e >> 9) & 127) + 1980,
      s = 0,
      a = (t & 31) * 2,
      o = (t >> 5) & 63,
      u = (t >> 11) & 31;
    return new Date(n, i, r, u, o, a, s);
  }
  function uD(e) {
    return e.indexOf("\\") !== -1
      ? "invalid characters in fileName: " + e
      : /^[a-zA-Z]:/.test(e) || /^\//.test(e)
      ? "absolute path: " + e
      : e.split("/").indexOf("..") !== -1
      ? "invalid relative path: " + e
      : null;
  }
  function Jn(e, t, r, i, n, s) {
    if (i === 0)
      return setImmediate(function () {
        s(null, or(0));
      });
    e.read(t, r, i, n, function (a, o) {
      if (a) return s(a);
      if (o < i) return s(new Error("unexpected EOF"));
      s();
    });
  }
  nl.inherits(La, nD);
  function La(e) {
    nD.call(this), (this.actualByteCount = 0), (this.expectedByteCount = e);
  }
  La.prototype._transform = function (e, t, r) {
    if (
      ((this.actualByteCount += e.length),
      this.actualByteCount > this.expectedByteCount)
    ) {
      var i =
        "too many bytes in the stream. expected " +
        this.expectedByteCount +
        ". got at least " +
        this.actualByteCount;
      return r(new Error(i));
    }
    r(null, e);
  };
  La.prototype._flush = function (e) {
    if (this.actualByteCount < this.expectedByteCount) {
      var t =
        "not enough bytes in the stream. expected " +
        this.expectedByteCount +
        ". got only " +
        this.actualByteCount;
      return e(new Error(t));
    }
    e();
  };
  nl.inherits(ai, sl);
  function ai() {
    sl.call(this), (this.refCount = 0);
  }
  ai.prototype.ref = function () {
    this.refCount += 1;
  };
  ai.prototype.unref = function () {
    var e = this;
    if (((e.refCount -= 1), e.refCount > 0)) return;
    if (e.refCount < 0) throw new Error("invalid unref");
    e.close(t);
    function t(r) {
      if (r) return e.emit("error", r);
      e.emit("close");
    }
  };
  ai.prototype.createReadStream = function (e) {
    var t = e.start,
      r = e.end;
    if (t === r) {
      var i = new md();
      return (
        setImmediate(function () {
          i.end();
        }),
        i
      );
    }
    var n = this._readStreamForRange(t, r),
      s = !1,
      a = new al(this);
    n.on("error", function (u) {
      setImmediate(function () {
        s || a.emit("error", u);
      });
    }),
      (a.destroy = function () {
        n.unpipe(a), a.unref(), n.destroy();
      });
    var o = new La(r - t);
    return (
      a.on("error", function (u) {
        setImmediate(function () {
          s || o.emit("error", u);
        });
      }),
      (o.destroy = function () {
        (s = !0), a.unpipe(o), a.destroy();
      }),
      n.pipe(a).pipe(o)
    );
  };
  ai.prototype._readStreamForRange = function (e, t) {
    throw new Error("not implemented");
  };
  ai.prototype.read = function (e, t, r, i, n) {
    var s = this.createReadStream({ start: i, end: i + r }),
      a = new _5(),
      o = 0;
    (a._write = function (u, l, f) {
      u.copy(e, t + o, 0, u.length), (o += u.length), f();
    }),
      a.on("finish", n),
      s.on("error", function (u) {
        n(u);
      }),
      s.pipe(a);
  };
  ai.prototype.close = function (e) {
    setImmediate(e);
  };
  nl.inherits(al, md);
  function al(e) {
    md.call(this),
      (this.context = e),
      this.context.ref(),
      (this.unreffedYet = !1);
  }
  al.prototype._flush = function (e) {
    this.unref(), e();
  };
  al.prototype.unref = function (e) {
    this.unreffedYet || ((this.unreffedYet = !0), this.context.unref());
  };
  var C5 =
    "\0\u263A\u263B\u2665\u2666\u2663\u2660\u2022\u25D8\u25CB\u25D9\u2642\u2640\u266A\u266B\u263C\u25BA\u25C4\u2195\u203C\xB6\xA7\u25AC\u21A8\u2191\u2193\u2192\u2190\u221F\u2194\u25B2\u25BC !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u2302\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xA2\xA3\xA5\u20A7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0";
  function rl(e, t, r, i) {
    if (i) return e.toString("utf8", t, r);
    for (var n = "", s = t; s < r; s++) n += C5[e[s]];
    return n;
  }
  function es(e, t) {
    var r = e.readUInt32LE(t),
      i = e.readUInt32LE(t + 4);
    return i * 4294967296 + r;
  }
  var or;
  typeof Buffer.allocUnsafe == "function"
    ? (or = function (e) {
        return Buffer.allocUnsafe(e);
      })
    : (or = function (e) {
        return new Buffer(e);
      });
  function il(e) {
    if (e) throw e;
  }
});
var hD = y((hZ, fD) => {
  var Kt = qw()("extract-zip"),
    { createWriteStream: O5, promises: ts } = require("fs"),
    T5 = Vw(),
    Ki = require("path"),
    { promisify: vd } = require("util"),
    F5 = require("stream"),
    R5 = lD(),
    A5 = vd(R5.open),
    N5 = vd(F5.pipeline),
    yd = class {
      constructor(t, r) {
        (this.zipPath = t), (this.opts = r);
      }
      async extract() {
        return (
          Kt("opening", this.zipPath, "with opts", this.opts),
          (this.zipfile = await A5(this.zipPath, { lazyEntries: !0 })),
          (this.canceled = !1),
          new Promise((t, r) => {
            this.zipfile.on("error", (i) => {
              (this.canceled = !0), r(i);
            }),
              this.zipfile.readEntry(),
              this.zipfile.on("close", () => {
                this.canceled || (Kt("zip extraction complete"), t());
              }),
              this.zipfile.on("entry", async (i) => {
                if (this.canceled) {
                  Kt("skipping entry", i.fileName, {
                    cancelled: this.canceled,
                  });
                  return;
                }
                if (
                  (Kt("zipfile entry", i.fileName),
                  i.fileName.startsWith("__MACOSX/"))
                ) {
                  this.zipfile.readEntry();
                  return;
                }
                let n = Ki.dirname(Ki.join(this.opts.dir, i.fileName));
                try {
                  await ts.mkdir(n, { recursive: !0 });
                  let s = await ts.realpath(n);
                  if (
                    Ki.relative(this.opts.dir, s).split(Ki.sep).includes("..")
                  )
                    throw new Error(
                      `Out of bound path "${s}" found while processing file ${i.fileName}`,
                    );
                  await this.extractEntry(i),
                    Kt("finished processing", i.fileName),
                    this.zipfile.readEntry();
                } catch (s) {
                  (this.canceled = !0), this.zipfile.close(), r(s);
                }
              });
          })
        );
      }
      async extractEntry(t) {
        if (this.canceled) {
          Kt("skipping entry extraction", t.fileName, {
            cancelled: this.canceled,
          });
          return;
        }
        this.opts.onEntry && this.opts.onEntry(t, this.zipfile);
        let r = Ki.join(this.opts.dir, t.fileName),
          i = (t.externalFileAttributes >> 16) & 65535,
          n = 61440,
          s = 16384,
          a = 40960,
          o = (i & n) === a,
          u = (i & n) === s;
        !u && t.fileName.endsWith("/") && (u = !0);
        let l = t.versionMadeBy >> 8;
        u || (u = l === 0 && t.externalFileAttributes === 16),
          Kt("extracting entry", {
            filename: t.fileName,
            isDir: u,
            isSymlink: o,
          });
        let f = this.getExtractedMode(i, u) & 511,
          h = u ? r : Ki.dirname(r),
          c = { recursive: !0 };
        if (
          (u && (c.mode = f),
          Kt("mkdir", { dir: h, ...c }),
          await ts.mkdir(h, c),
          u)
        )
          return;
        Kt("opening read stream", r);
        let d = await vd(this.zipfile.openReadStream.bind(this.zipfile))(t);
        if (o) {
          let g = await T5(d);
          Kt("creating symlink", g, r), await ts.symlink(g, r);
        } else await N5(d, O5(r, { mode: f }));
      }
      getExtractedMode(t, r) {
        let i = t;
        return (
          i === 0 &&
            (r
              ? (this.opts.defaultDirMode &&
                  (i = parseInt(this.opts.defaultDirMode, 10)),
                i || (i = 493))
              : (this.opts.defaultFileMode &&
                  (i = parseInt(this.opts.defaultFileMode, 10)),
                i || (i = 420))),
          i
        );
      }
    };
  fD.exports = async function (e, t) {
    if ((Kt("creating target directory", t.dir), !Ki.isAbsolute(t.dir)))
      throw new Error("Target directory is expected to be absolute");
    return (
      await ts.mkdir(t.dir, { recursive: !0 }),
      (t.dir = await ts.realpath(t.dir)),
      new yd(e, t).extract()
    );
  };
});
var rs = y((cZ, dD) => {
  "use strict";
  var cD = new Map([
    ["C", "cwd"],
    ["f", "file"],
    ["z", "gzip"],
    ["P", "preservePaths"],
    ["U", "unlink"],
    ["strip-components", "strip"],
    ["stripComponents", "strip"],
    ["keep-newer", "newer"],
    ["keepNewer", "newer"],
    ["keep-newer-files", "newer"],
    ["keepNewerFiles", "newer"],
    ["k", "keep"],
    ["keep-existing", "keep"],
    ["keepExisting", "keep"],
    ["m", "noMtime"],
    ["no-mtime", "noMtime"],
    ["p", "preserveOwner"],
    ["L", "follow"],
    ["h", "follow"],
  ]);
  dD.exports = (e) =>
    e
      ? Object.keys(e)
          .map((t) => [cD.has(t) ? cD.get(t) : t, e[t]])
          .reduce((t, r) => ((t[r[0]] = r[1]), t), Object.create(null))
      : {};
});
var ns = y((dZ, ED) => {
  "use strict";
  var pD =
      typeof process == "object" && process
        ? process
        : { stdout: null, stderr: null },
    I5 = require("events"),
    mD = require("stream"),
    gD = require("string_decoder").StringDecoder,
    Fr = Symbol("EOF"),
    Rr = Symbol("maybeEmitEnd"),
    oi = Symbol("emittedEnd"),
    ol = Symbol("emittingEnd"),
    qa = Symbol("emittedError"),
    ul = Symbol("closed"),
    yD = Symbol("read"),
    ll = Symbol("flush"),
    vD = Symbol("flushChunk"),
    gt = Symbol("encoding"),
    Ar = Symbol("decoder"),
    fl = Symbol("flowing"),
    Pa = Symbol("paused"),
    is = Symbol("resume"),
    Ge = Symbol("bufferLength"),
    wd = Symbol("bufferPush"),
    Dd = Symbol("bufferShift"),
    rt = Symbol("objectMode"),
    it = Symbol("destroyed"),
    bd = Symbol("emitData"),
    wD = Symbol("emitEnd"),
    Ed = Symbol("emitEnd2"),
    Nr = Symbol("async"),
    Ba = (e) => Promise.resolve().then(e),
    DD = global._MP_NO_ITERATOR_SYMBOLS_ !== "1",
    M5 =
      (DD && Symbol.asyncIterator) || Symbol("asyncIterator not implemented"),
    L5 = (DD && Symbol.iterator) || Symbol("iterator not implemented"),
    q5 = (e) => e === "end" || e === "finish" || e === "prefinish",
    P5 = (e) =>
      e instanceof ArrayBuffer ||
      (typeof e == "object" &&
        e.constructor &&
        e.constructor.name === "ArrayBuffer" &&
        e.byteLength >= 0),
    B5 = (e) => !Buffer.isBuffer(e) && ArrayBuffer.isView(e),
    hl = class {
      constructor(t, r, i) {
        (this.src = t),
          (this.dest = r),
          (this.opts = i),
          (this.ondrain = () => t[is]()),
          r.on("drain", this.ondrain);
      }
      unpipe() {
        this.dest.removeListener("drain", this.ondrain);
      }
      proxyErrors() {}
      end() {
        this.unpipe(), this.opts.end && this.dest.end();
      }
    },
    _d = class extends hl {
      unpipe() {
        this.src.removeListener("error", this.proxyErrors), super.unpipe();
      }
      constructor(t, r, i) {
        super(t, r, i),
          (this.proxyErrors = (n) => r.emit("error", n)),
          t.on("error", this.proxyErrors);
      }
    };
  ED.exports = class bD extends mD {
    constructor(t) {
      super(),
        (this[fl] = !1),
        (this[Pa] = !1),
        (this.pipes = []),
        (this.buffer = []),
        (this[rt] = (t && t.objectMode) || !1),
        this[rt] ? (this[gt] = null) : (this[gt] = (t && t.encoding) || null),
        this[gt] === "buffer" && (this[gt] = null),
        (this[Nr] = (t && !!t.async) || !1),
        (this[Ar] = this[gt] ? new gD(this[gt]) : null),
        (this[Fr] = !1),
        (this[oi] = !1),
        (this[ol] = !1),
        (this[ul] = !1),
        (this[qa] = null),
        (this.writable = !0),
        (this.readable = !0),
        (this[Ge] = 0),
        (this[it] = !1);
    }
    get bufferLength() {
      return this[Ge];
    }
    get encoding() {
      return this[gt];
    }
    set encoding(t) {
      if (this[rt]) throw new Error("cannot set encoding in objectMode");
      if (
        this[gt] &&
        t !== this[gt] &&
        ((this[Ar] && this[Ar].lastNeed) || this[Ge])
      )
        throw new Error("cannot change encoding");
      this[gt] !== t &&
        ((this[Ar] = t ? new gD(t) : null),
        this.buffer.length &&
          (this.buffer = this.buffer.map((r) => this[Ar].write(r)))),
        (this[gt] = t);
    }
    setEncoding(t) {
      this.encoding = t;
    }
    get objectMode() {
      return this[rt];
    }
    set objectMode(t) {
      this[rt] = this[rt] || !!t;
    }
    get async() {
      return this[Nr];
    }
    set async(t) {
      this[Nr] = this[Nr] || !!t;
    }
    write(t, r, i) {
      if (this[Fr]) throw new Error("write after end");
      if (this[it])
        return (
          this.emit(
            "error",
            Object.assign(
              new Error("Cannot call write after a stream was destroyed"),
              { code: "ERR_STREAM_DESTROYED" },
            ),
          ),
          !0
        );
      typeof r == "function" && ((i = r), (r = "utf8")), r || (r = "utf8");
      let n = this[Nr] ? Ba : (s) => s();
      return (
        !this[rt] &&
          !Buffer.isBuffer(t) &&
          (B5(t)
            ? (t = Buffer.from(t.buffer, t.byteOffset, t.byteLength))
            : P5(t)
            ? (t = Buffer.from(t))
            : typeof t != "string" && (this.objectMode = !0)),
        this[rt]
          ? (this.flowing && this[Ge] !== 0 && this[ll](!0),
            this.flowing ? this.emit("data", t) : this[wd](t),
            this[Ge] !== 0 && this.emit("readable"),
            i && n(i),
            this.flowing)
          : t.length
          ? (typeof t == "string" &&
              !(r === this[gt] && !this[Ar].lastNeed) &&
              (t = Buffer.from(t, r)),
            Buffer.isBuffer(t) && this[gt] && (t = this[Ar].write(t)),
            this.flowing && this[Ge] !== 0 && this[ll](!0),
            this.flowing ? this.emit("data", t) : this[wd](t),
            this[Ge] !== 0 && this.emit("readable"),
            i && n(i),
            this.flowing)
          : (this[Ge] !== 0 && this.emit("readable"), i && n(i), this.flowing)
      );
    }
    read(t) {
      if (this[it]) return null;
      if (this[Ge] === 0 || t === 0 || t > this[Ge]) return this[Rr](), null;
      this[rt] && (t = null),
        this.buffer.length > 1 &&
          !this[rt] &&
          (this.encoding
            ? (this.buffer = [this.buffer.join("")])
            : (this.buffer = [Buffer.concat(this.buffer, this[Ge])]));
      let r = this[yD](t || null, this.buffer[0]);
      return this[Rr](), r;
    }
    [yD](t, r) {
      return (
        t === r.length || t === null
          ? this[Dd]()
          : ((this.buffer[0] = r.slice(t)),
            (r = r.slice(0, t)),
            (this[Ge] -= t)),
        this.emit("data", r),
        !this.buffer.length && !this[Fr] && this.emit("drain"),
        r
      );
    }
    end(t, r, i) {
      return (
        typeof t == "function" && ((i = t), (t = null)),
        typeof r == "function" && ((i = r), (r = "utf8")),
        t && this.write(t, r),
        i && this.once("end", i),
        (this[Fr] = !0),
        (this.writable = !1),
        (this.flowing || !this[Pa]) && this[Rr](),
        this
      );
    }
    [is]() {
      this[it] ||
        ((this[Pa] = !1),
        (this[fl] = !0),
        this.emit("resume"),
        this.buffer.length
          ? this[ll]()
          : this[Fr]
          ? this[Rr]()
          : this.emit("drain"));
    }
    resume() {
      return this[is]();
    }
    pause() {
      (this[fl] = !1), (this[Pa] = !0);
    }
    get destroyed() {
      return this[it];
    }
    get flowing() {
      return this[fl];
    }
    get paused() {
      return this[Pa];
    }
    [wd](t) {
      this[rt] ? (this[Ge] += 1) : (this[Ge] += t.length), this.buffer.push(t);
    }
    [Dd]() {
      return (
        this.buffer.length &&
          (this[rt] ? (this[Ge] -= 1) : (this[Ge] -= this.buffer[0].length)),
        this.buffer.shift()
      );
    }
    [ll](t) {
      do;
      while (this[vD](this[Dd]()));
      !t && !this.buffer.length && !this[Fr] && this.emit("drain");
    }
    [vD](t) {
      return t ? (this.emit("data", t), this.flowing) : !1;
    }
    pipe(t, r) {
      if (this[it]) return;
      let i = this[oi];
      return (
        (r = r || {}),
        t === pD.stdout || t === pD.stderr
          ? (r.end = !1)
          : (r.end = r.end !== !1),
        (r.proxyErrors = !!r.proxyErrors),
        i
          ? r.end && t.end()
          : (this.pipes.push(
              r.proxyErrors ? new _d(this, t, r) : new hl(this, t, r),
            ),
            this[Nr] ? Ba(() => this[is]()) : this[is]()),
        t
      );
    }
    unpipe(t) {
      let r = this.pipes.find((i) => i.dest === t);
      r && (this.pipes.splice(this.pipes.indexOf(r), 1), r.unpipe());
    }
    addListener(t, r) {
      return this.on(t, r);
    }
    on(t, r) {
      let i = super.on(t, r);
      return (
        t === "data" && !this.pipes.length && !this.flowing
          ? this[is]()
          : t === "readable" && this[Ge] !== 0
          ? super.emit("readable")
          : q5(t) && this[oi]
          ? (super.emit(t), this.removeAllListeners(t))
          : t === "error" &&
            this[qa] &&
            (this[Nr]
              ? Ba(() => r.call(this, this[qa]))
              : r.call(this, this[qa])),
        i
      );
    }
    get emittedEnd() {
      return this[oi];
    }
    [Rr]() {
      !this[ol] &&
        !this[oi] &&
        !this[it] &&
        this.buffer.length === 0 &&
        this[Fr] &&
        ((this[ol] = !0),
        this.emit("end"),
        this.emit("prefinish"),
        this.emit("finish"),
        this[ul] && this.emit("close"),
        (this[ol] = !1));
    }
    emit(t, r, ...i) {
      if (t !== "error" && t !== "close" && t !== it && this[it]) return;
      if (t === "data")
        return r ? (this[Nr] ? Ba(() => this[bd](r)) : this[bd](r)) : !1;
      if (t === "end") return this[wD]();
      if (t === "close") {
        if (((this[ul] = !0), !this[oi] && !this[it])) return;
        let s = super.emit("close");
        return this.removeAllListeners("close"), s;
      } else if (t === "error") {
        this[qa] = r;
        let s = super.emit("error", r);
        return this[Rr](), s;
      } else if (t === "resume") {
        let s = super.emit("resume");
        return this[Rr](), s;
      } else if (t === "finish" || t === "prefinish") {
        let s = super.emit(t);
        return this.removeAllListeners(t), s;
      }
      let n = super.emit(t, r, ...i);
      return this[Rr](), n;
    }
    [bd](t) {
      for (let i of this.pipes) i.dest.write(t) === !1 && this.pause();
      let r = super.emit("data", t);
      return this[Rr](), r;
    }
    [wD]() {
      this[oi] ||
        ((this[oi] = !0),
        (this.readable = !1),
        this[Nr] ? Ba(() => this[Ed]()) : this[Ed]());
    }
    [Ed]() {
      if (this[Ar]) {
        let r = this[Ar].end();
        if (r) {
          for (let i of this.pipes) i.dest.write(r);
          super.emit("data", r);
        }
      }
      for (let r of this.pipes) r.end();
      let t = super.emit("end");
      return this.removeAllListeners("end"), t;
    }
    collect() {
      let t = [];
      this[rt] || (t.dataLength = 0);
      let r = this.promise();
      return (
        this.on("data", (i) => {
          t.push(i), this[rt] || (t.dataLength += i.length);
        }),
        r.then(() => t)
      );
    }
    concat() {
      return this[rt]
        ? Promise.reject(new Error("cannot concat in objectMode"))
        : this.collect().then((t) =>
            this[rt]
              ? Promise.reject(new Error("cannot concat in objectMode"))
              : this[gt]
              ? t.join("")
              : Buffer.concat(t, t.dataLength),
          );
    }
    promise() {
      return new Promise((t, r) => {
        this.on(it, () => r(new Error("stream destroyed"))),
          this.on("error", (i) => r(i)),
          this.on("end", () => t());
      });
    }
    [M5]() {
      return {
        next: () => {
          let r = this.read();
          if (r !== null) return Promise.resolve({ done: !1, value: r });
          if (this[Fr]) return Promise.resolve({ done: !0 });
          let i = null,
            n = null,
            s = (l) => {
              this.removeListener("data", a),
                this.removeListener("end", o),
                n(l);
            },
            a = (l) => {
              this.removeListener("error", s),
                this.removeListener("end", o),
                this.pause(),
                i({ value: l, done: !!this[Fr] });
            },
            o = () => {
              this.removeListener("error", s),
                this.removeListener("data", a),
                i({ done: !0 });
            },
            u = () => s(new Error("stream destroyed"));
          return new Promise((l, f) => {
            (n = f),
              (i = l),
              this.once(it, u),
              this.once("error", s),
              this.once("end", o),
              this.once("data", a);
          });
        },
      };
    }
    [L5]() {
      return {
        next: () => {
          let r = this.read();
          return { value: r, done: r === null };
        },
      };
    }
    destroy(t) {
      return this[it]
        ? (t ? this.emit("error", t) : this.emit(it), this)
        : ((this[it] = !0),
          (this.buffer.length = 0),
          (this[Ge] = 0),
          typeof this.close == "function" && !this[ul] && this.close(),
          t ? this.emit("error", t) : this.emit(it),
          this);
    }
    static isStream(t) {
      return (
        !!t &&
        (t instanceof bD ||
          t instanceof mD ||
          (t instanceof I5 &&
            (typeof t.pipe == "function" ||
              (typeof t.write == "function" && typeof t.end == "function"))))
      );
    }
  };
});
var SD = y((pZ, _D) => {
  var k5 = require("zlib").constants || { ZLIB_VERNUM: 4736 };
  _D.exports = Object.freeze(
    Object.assign(
      Object.create(null),
      {
        Z_NO_FLUSH: 0,
        Z_PARTIAL_FLUSH: 1,
        Z_SYNC_FLUSH: 2,
        Z_FULL_FLUSH: 3,
        Z_FINISH: 4,
        Z_BLOCK: 5,
        Z_OK: 0,
        Z_STREAM_END: 1,
        Z_NEED_DICT: 2,
        Z_ERRNO: -1,
        Z_STREAM_ERROR: -2,
        Z_DATA_ERROR: -3,
        Z_MEM_ERROR: -4,
        Z_BUF_ERROR: -5,
        Z_VERSION_ERROR: -6,
        Z_NO_COMPRESSION: 0,
        Z_BEST_SPEED: 1,
        Z_BEST_COMPRESSION: 9,
        Z_DEFAULT_COMPRESSION: -1,
        Z_FILTERED: 1,
        Z_HUFFMAN_ONLY: 2,
        Z_RLE: 3,
        Z_FIXED: 4,
        Z_DEFAULT_STRATEGY: 0,
        DEFLATE: 1,
        INFLATE: 2,
        GZIP: 3,
        GUNZIP: 4,
        DEFLATERAW: 5,
        INFLATERAW: 6,
        UNZIP: 7,
        BROTLI_DECODE: 8,
        BROTLI_ENCODE: 9,
        Z_MIN_WINDOWBITS: 8,
        Z_MAX_WINDOWBITS: 15,
        Z_DEFAULT_WINDOWBITS: 15,
        Z_MIN_CHUNK: 64,
        Z_MAX_CHUNK: 1 / 0,
        Z_DEFAULT_CHUNK: 16384,
        Z_MIN_MEMLEVEL: 1,
        Z_MAX_MEMLEVEL: 9,
        Z_DEFAULT_MEMLEVEL: 8,
        Z_MIN_LEVEL: -1,
        Z_MAX_LEVEL: 9,
        Z_DEFAULT_LEVEL: -1,
        BROTLI_OPERATION_PROCESS: 0,
        BROTLI_OPERATION_FLUSH: 1,
        BROTLI_OPERATION_FINISH: 2,
        BROTLI_OPERATION_EMIT_METADATA: 3,
        BROTLI_MODE_GENERIC: 0,
        BROTLI_MODE_TEXT: 1,
        BROTLI_MODE_FONT: 2,
        BROTLI_DEFAULT_MODE: 0,
        BROTLI_MIN_QUALITY: 0,
        BROTLI_MAX_QUALITY: 11,
        BROTLI_DEFAULT_QUALITY: 11,
        BROTLI_MIN_WINDOW_BITS: 10,
        BROTLI_MAX_WINDOW_BITS: 24,
        BROTLI_LARGE_MAX_WINDOW_BITS: 30,
        BROTLI_DEFAULT_WINDOW: 22,
        BROTLI_MIN_INPUT_BLOCK_BITS: 16,
        BROTLI_MAX_INPUT_BLOCK_BITS: 24,
        BROTLI_PARAM_MODE: 0,
        BROTLI_PARAM_QUALITY: 1,
        BROTLI_PARAM_LGWIN: 2,
        BROTLI_PARAM_LGBLOCK: 3,
        BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING: 4,
        BROTLI_PARAM_SIZE_HINT: 5,
        BROTLI_PARAM_LARGE_WINDOW: 6,
        BROTLI_PARAM_NPOSTFIX: 7,
        BROTLI_PARAM_NDIRECT: 8,
        BROTLI_DECODER_RESULT_ERROR: 0,
        BROTLI_DECODER_RESULT_SUCCESS: 1,
        BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT: 2,
        BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT: 3,
        BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION: 0,
        BROTLI_DECODER_PARAM_LARGE_WINDOW: 1,
        BROTLI_DECODER_NO_ERROR: 0,
        BROTLI_DECODER_SUCCESS: 1,
        BROTLI_DECODER_NEEDS_MORE_INPUT: 2,
        BROTLI_DECODER_NEEDS_MORE_OUTPUT: 3,
        BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_NIBBLE: -1,
        BROTLI_DECODER_ERROR_FORMAT_RESERVED: -2,
        BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_META_NIBBLE: -3,
        BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_ALPHABET: -4,
        BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_SAME: -5,
        BROTLI_DECODER_ERROR_FORMAT_CL_SPACE: -6,
        BROTLI_DECODER_ERROR_FORMAT_HUFFMAN_SPACE: -7,
        BROTLI_DECODER_ERROR_FORMAT_CONTEXT_MAP_REPEAT: -8,
        BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_1: -9,
        BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_2: -10,
        BROTLI_DECODER_ERROR_FORMAT_TRANSFORM: -11,
        BROTLI_DECODER_ERROR_FORMAT_DICTIONARY: -12,
        BROTLI_DECODER_ERROR_FORMAT_WINDOW_BITS: -13,
        BROTLI_DECODER_ERROR_FORMAT_PADDING_1: -14,
        BROTLI_DECODER_ERROR_FORMAT_PADDING_2: -15,
        BROTLI_DECODER_ERROR_FORMAT_DISTANCE: -16,
        BROTLI_DECODER_ERROR_DICTIONARY_NOT_SET: -19,
        BROTLI_DECODER_ERROR_INVALID_ARGUMENTS: -20,
        BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MODES: -21,
        BROTLI_DECODER_ERROR_ALLOC_TREE_GROUPS: -22,
        BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MAP: -25,
        BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_1: -26,
        BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_2: -27,
        BROTLI_DECODER_ERROR_ALLOC_BLOCK_TYPE_TREES: -30,
        BROTLI_DECODER_ERROR_UNREACHABLE: -31,
      },
      k5,
    ),
  );
});
var kd = y((xt) => {
  "use strict";
  var Td = require("assert"),
    ui = require("buffer").Buffer,
    OD = require("zlib"),
    Qi = (xt.constants = SD()),
    j5 = ns(),
    xD = ui.concat,
    Ji = Symbol("_superWrite"),
    as = class extends Error {
      constructor(t) {
        super("zlib: " + t.message),
          (this.code = t.code),
          (this.errno = t.errno),
          this.code || (this.code = "ZLIB_ERROR"),
          (this.message = "zlib: " + t.message),
          Error.captureStackTrace(this, this.constructor);
      }
      get name() {
        return "ZlibError";
      }
    },
    U5 = Symbol("opts"),
    ka = Symbol("flushFlag"),
    CD = Symbol("finishFlushFlag"),
    Bd = Symbol("fullFlushFlag"),
    ve = Symbol("handle"),
    cl = Symbol("onError"),
    ss = Symbol("sawError"),
    Sd = Symbol("level"),
    xd = Symbol("strategy"),
    Cd = Symbol("ended"),
    mZ = Symbol("_defaultFullFlush"),
    dl = class extends j5 {
      constructor(t, r) {
        if (!t || typeof t != "object")
          throw new TypeError("invalid options for ZlibBase constructor");
        super(t),
          (this[ss] = !1),
          (this[Cd] = !1),
          (this[U5] = t),
          (this[ka] = t.flush),
          (this[CD] = t.finishFlush);
        try {
          this[ve] = new OD[r](t);
        } catch (i) {
          throw new as(i);
        }
        (this[cl] = (i) => {
          this[ss] || ((this[ss] = !0), this.close(), this.emit("error", i));
        }),
          this[ve].on("error", (i) => this[cl](new as(i))),
          this.once("end", () => this.close);
      }
      close() {
        this[ve] && (this[ve].close(), (this[ve] = null), this.emit("close"));
      }
      reset() {
        if (!this[ss])
          return Td(this[ve], "zlib binding closed"), this[ve].reset();
      }
      flush(t) {
        this.ended ||
          (typeof t != "number" && (t = this[Bd]),
          this.write(Object.assign(ui.alloc(0), { [ka]: t })));
      }
      end(t, r, i) {
        return (
          t && this.write(t, r),
          this.flush(this[CD]),
          (this[Cd] = !0),
          super.end(null, null, i)
        );
      }
      get ended() {
        return this[Cd];
      }
      write(t, r, i) {
        if (
          (typeof r == "function" && ((i = r), (r = "utf8")),
          typeof t == "string" && (t = ui.from(t, r)),
          this[ss])
        )
          return;
        Td(this[ve], "zlib binding closed");
        let n = this[ve]._handle,
          s = n.close;
        n.close = () => {};
        let a = this[ve].close;
        (this[ve].close = () => {}), (ui.concat = (l) => l);
        let o;
        try {
          let l = typeof t[ka] == "number" ? t[ka] : this[ka];
          (o = this[ve]._processChunk(t, l)), (ui.concat = xD);
        } catch (l) {
          (ui.concat = xD), this[cl](new as(l));
        } finally {
          this[ve] &&
            ((this[ve]._handle = n),
            (n.close = s),
            (this[ve].close = a),
            this[ve].removeAllListeners("error"));
        }
        this[ve] && this[ve].on("error", (l) => this[cl](new as(l)));
        let u;
        if (o)
          if (Array.isArray(o) && o.length > 0) {
            u = this[Ji](ui.from(o[0]));
            for (let l = 1; l < o.length; l++) u = this[Ji](o[l]);
          } else u = this[Ji](ui.from(o));
        return i && i(), u;
      }
      [Ji](t) {
        return super.write(t);
      }
    },
    Ir = class extends dl {
      constructor(t, r) {
        (t = t || {}),
          (t.flush = t.flush || Qi.Z_NO_FLUSH),
          (t.finishFlush = t.finishFlush || Qi.Z_FINISH),
          super(t, r),
          (this[Bd] = Qi.Z_FULL_FLUSH),
          (this[Sd] = t.level),
          (this[xd] = t.strategy);
      }
      params(t, r) {
        if (!this[ss]) {
          if (!this[ve])
            throw new Error("cannot switch params when binding is closed");
          if (!this[ve].params)
            throw new Error("not supported in this implementation");
          if (this[Sd] !== t || this[xd] !== r) {
            this.flush(Qi.Z_SYNC_FLUSH), Td(this[ve], "zlib binding closed");
            let i = this[ve].flush;
            this[ve].flush = (n, s) => {
              this.flush(n), s();
            };
            try {
              this[ve].params(t, r);
            } finally {
              this[ve].flush = i;
            }
            this[ve] && ((this[Sd] = t), (this[xd] = r));
          }
        }
      }
    },
    Fd = class extends Ir {
      constructor(t) {
        super(t, "Deflate");
      }
    },
    Rd = class extends Ir {
      constructor(t) {
        super(t, "Inflate");
      }
    },
    Od = Symbol("_portable"),
    Ad = class extends Ir {
      constructor(t) {
        super(t, "Gzip"), (this[Od] = t && !!t.portable);
      }
      [Ji](t) {
        return this[Od]
          ? ((this[Od] = !1), (t[9] = 255), super[Ji](t))
          : super[Ji](t);
      }
    },
    Nd = class extends Ir {
      constructor(t) {
        super(t, "Gunzip");
      }
    },
    Id = class extends Ir {
      constructor(t) {
        super(t, "DeflateRaw");
      }
    },
    Md = class extends Ir {
      constructor(t) {
        super(t, "InflateRaw");
      }
    },
    Ld = class extends Ir {
      constructor(t) {
        super(t, "Unzip");
      }
    },
    pl = class extends dl {
      constructor(t, r) {
        (t = t || {}),
          (t.flush = t.flush || Qi.BROTLI_OPERATION_PROCESS),
          (t.finishFlush = t.finishFlush || Qi.BROTLI_OPERATION_FINISH),
          super(t, r),
          (this[Bd] = Qi.BROTLI_OPERATION_FLUSH);
      }
    },
    qd = class extends pl {
      constructor(t) {
        super(t, "BrotliCompress");
      }
    },
    Pd = class extends pl {
      constructor(t) {
        super(t, "BrotliDecompress");
      }
    };
  xt.Deflate = Fd;
  xt.Inflate = Rd;
  xt.Gzip = Ad;
  xt.Gunzip = Nd;
  xt.DeflateRaw = Id;
  xt.InflateRaw = Md;
  xt.Unzip = Ld;
  typeof OD.BrotliCompress == "function"
    ? ((xt.BrotliCompress = qd), (xt.BrotliDecompress = Pd))
    : (xt.BrotliCompress = xt.BrotliDecompress =
        class {
          constructor() {
            throw new Error(
              "Brotli is not supported in this version of Node.js",
            );
          }
        });
});
var os = y((vZ, TD) => {
  var z5 = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
  TD.exports = z5 !== "win32" ? (e) => e : (e) => e && e.replace(/\\/g, "/");
});
var ml = y((DZ, FD) => {
  "use strict";
  var $5 = ns(),
    jd = os(),
    Ud = Symbol("slurp");
  FD.exports = class extends $5 {
    constructor(t, r, i) {
      switch (
        (super(),
        this.pause(),
        (this.extended = r),
        (this.globalExtended = i),
        (this.header = t),
        (this.startBlockSize = 512 * Math.ceil(t.size / 512)),
        (this.blockRemain = this.startBlockSize),
        (this.remain = t.size),
        (this.type = t.type),
        (this.meta = !1),
        (this.ignore = !1),
        this.type)
      ) {
        case "File":
        case "OldFile":
        case "Link":
        case "SymbolicLink":
        case "CharacterDevice":
        case "BlockDevice":
        case "Directory":
        case "FIFO":
        case "ContiguousFile":
        case "GNUDumpDir":
          break;
        case "NextFileHasLongLinkpath":
        case "NextFileHasLongPath":
        case "OldGnuLongPath":
        case "GlobalExtendedHeader":
        case "ExtendedHeader":
        case "OldExtendedHeader":
          this.meta = !0;
          break;
        default:
          this.ignore = !0;
      }
      (this.path = jd(t.path)),
        (this.mode = t.mode),
        this.mode && (this.mode = this.mode & 4095),
        (this.uid = t.uid),
        (this.gid = t.gid),
        (this.uname = t.uname),
        (this.gname = t.gname),
        (this.size = t.size),
        (this.mtime = t.mtime),
        (this.atime = t.atime),
        (this.ctime = t.ctime),
        (this.linkpath = jd(t.linkpath)),
        (this.uname = t.uname),
        (this.gname = t.gname),
        r && this[Ud](r),
        i && this[Ud](i, !0);
    }
    write(t) {
      let r = t.length;
      if (r > this.blockRemain)
        throw new Error("writing more to entry than is appropriate");
      let i = this.remain,
        n = this.blockRemain;
      return (
        (this.remain = Math.max(0, i - r)),
        (this.blockRemain = Math.max(0, n - r)),
        this.ignore ? !0 : i >= r ? super.write(t) : super.write(t.slice(0, i))
      );
    }
    [Ud](t, r) {
      for (let i in t)
        t[i] !== null &&
          t[i] !== void 0 &&
          !(r && i === "path") &&
          (this[i] = i === "path" || i === "linkpath" ? jd(t[i]) : t[i]);
    }
  };
});
var zd = y((gl) => {
  "use strict";
  gl.name = new Map([
    ["0", "File"],
    ["", "OldFile"],
    ["1", "Link"],
    ["2", "SymbolicLink"],
    ["3", "CharacterDevice"],
    ["4", "BlockDevice"],
    ["5", "Directory"],
    ["6", "FIFO"],
    ["7", "ContiguousFile"],
    ["g", "GlobalExtendedHeader"],
    ["x", "ExtendedHeader"],
    ["A", "SolarisACL"],
    ["D", "GNUDumpDir"],
    ["I", "Inode"],
    ["K", "NextFileHasLongLinkpath"],
    ["L", "NextFileHasLongPath"],
    ["M", "ContinuationFile"],
    ["N", "OldGnuLongPath"],
    ["S", "SparseFile"],
    ["V", "TapeVolumeHeader"],
    ["X", "OldExtendedHeader"],
  ]);
  gl.code = new Map(Array.from(gl.name).map((e) => [e[1], e[0]]));
});
var ID = y((EZ, ND) => {
  "use strict";
  var W5 = (e, t) => {
      if (Number.isSafeInteger(e)) e < 0 ? H5(e, t) : G5(e, t);
      else
        throw Error(
          "cannot encode number outside of javascript safe integer range",
        );
      return t;
    },
    G5 = (e, t) => {
      t[0] = 128;
      for (var r = t.length; r > 1; r--)
        (t[r - 1] = e & 255), (e = Math.floor(e / 256));
    },
    H5 = (e, t) => {
      t[0] = 255;
      var r = !1;
      e = e * -1;
      for (var i = t.length; i > 1; i--) {
        var n = e & 255;
        (e = Math.floor(e / 256)),
          r
            ? (t[i - 1] = RD(n))
            : n === 0
            ? (t[i - 1] = 0)
            : ((r = !0), (t[i - 1] = AD(n)));
      }
    },
    Y5 = (e) => {
      let t = e[0],
        r = t === 128 ? X5(e.slice(1, e.length)) : t === 255 ? V5(e) : null;
      if (r === null) throw Error("invalid base256 encoding");
      if (!Number.isSafeInteger(r))
        throw Error("parsed number outside of javascript safe integer range");
      return r;
    },
    V5 = (e) => {
      for (var t = e.length, r = 0, i = !1, n = t - 1; n > -1; n--) {
        var s = e[n],
          a;
        i ? (a = RD(s)) : s === 0 ? (a = s) : ((i = !0), (a = AD(s))),
          a !== 0 && (r -= a * Math.pow(256, t - n - 1));
      }
      return r;
    },
    X5 = (e) => {
      for (var t = e.length, r = 0, i = t - 1; i > -1; i--) {
        var n = e[i];
        n !== 0 && (r += n * Math.pow(256, t - i - 1));
      }
      return r;
    },
    RD = (e) => (255 ^ e) & 255,
    AD = (e) => ((255 ^ e) + 1) & 255;
  ND.exports = { encode: W5, parse: Y5 };
});
var ls = y((_Z, LD) => {
  "use strict";
  var $d = zd(),
    us = require("path").posix,
    MD = ID(),
    Wd = Symbol("slurp"),
    Ct = Symbol("type"),
    Yd = class {
      constructor(t, r, i, n) {
        (this.cksumValid = !1),
          (this.needPax = !1),
          (this.nullBlock = !1),
          (this.block = null),
          (this.path = null),
          (this.mode = null),
          (this.uid = null),
          (this.gid = null),
          (this.size = null),
          (this.mtime = null),
          (this.cksum = null),
          (this[Ct] = "0"),
          (this.linkpath = null),
          (this.uname = null),
          (this.gname = null),
          (this.devmaj = 0),
          (this.devmin = 0),
          (this.atime = null),
          (this.ctime = null),
          Buffer.isBuffer(t) ? this.decode(t, r || 0, i, n) : t && this.set(t);
      }
      decode(t, r, i, n) {
        if ((r || (r = 0), !t || !(t.length >= r + 512)))
          throw new Error("need 512 bytes for header");
        if (
          ((this.path = en(t, r, 100)),
          (this.mode = li(t, r + 100, 8)),
          (this.uid = li(t, r + 108, 8)),
          (this.gid = li(t, r + 116, 8)),
          (this.size = li(t, r + 124, 12)),
          (this.mtime = Gd(t, r + 136, 12)),
          (this.cksum = li(t, r + 148, 12)),
          this[Wd](i),
          this[Wd](n, !0),
          (this[Ct] = en(t, r + 156, 1)),
          this[Ct] === "" && (this[Ct] = "0"),
          this[Ct] === "0" && this.path.slice(-1) === "/" && (this[Ct] = "5"),
          this[Ct] === "5" && (this.size = 0),
          (this.linkpath = en(t, r + 157, 100)),
          t.slice(r + 257, r + 265).toString() === "ustar\x0000")
        )
          if (
            ((this.uname = en(t, r + 265, 32)),
            (this.gname = en(t, r + 297, 32)),
            (this.devmaj = li(t, r + 329, 8)),
            (this.devmin = li(t, r + 337, 8)),
            t[r + 475] !== 0)
          ) {
            let a = en(t, r + 345, 155);
            this.path = a + "/" + this.path;
          } else {
            let a = en(t, r + 345, 130);
            a && (this.path = a + "/" + this.path),
              (this.atime = Gd(t, r + 476, 12)),
              (this.ctime = Gd(t, r + 488, 12));
          }
        let s = 8 * 32;
        for (let a = r; a < r + 148; a++) s += t[a];
        for (let a = r + 156; a < r + 512; a++) s += t[a];
        (this.cksumValid = s === this.cksum),
          this.cksum === null && s === 8 * 32 && (this.nullBlock = !0);
      }
      [Wd](t, r) {
        for (let i in t)
          t[i] !== null &&
            t[i] !== void 0 &&
            !(r && i === "path") &&
            (this[i] = t[i]);
      }
      encode(t, r) {
        if (
          (t || ((t = this.block = Buffer.alloc(512)), (r = 0)),
          r || (r = 0),
          !(t.length >= r + 512))
        )
          throw new Error("need 512 bytes for header");
        let i = this.ctime || this.atime ? 130 : 155,
          n = Z5(this.path || "", i),
          s = n[0],
          a = n[1];
        (this.needPax = n[2]),
          (this.needPax = tn(t, r, 100, s) || this.needPax),
          (this.needPax = fi(t, r + 100, 8, this.mode) || this.needPax),
          (this.needPax = fi(t, r + 108, 8, this.uid) || this.needPax),
          (this.needPax = fi(t, r + 116, 8, this.gid) || this.needPax),
          (this.needPax = fi(t, r + 124, 12, this.size) || this.needPax),
          (this.needPax = Hd(t, r + 136, 12, this.mtime) || this.needPax),
          (t[r + 156] = this[Ct].charCodeAt(0)),
          (this.needPax = tn(t, r + 157, 100, this.linkpath) || this.needPax),
          t.write("ustar\x0000", r + 257, 8),
          (this.needPax = tn(t, r + 265, 32, this.uname) || this.needPax),
          (this.needPax = tn(t, r + 297, 32, this.gname) || this.needPax),
          (this.needPax = fi(t, r + 329, 8, this.devmaj) || this.needPax),
          (this.needPax = fi(t, r + 337, 8, this.devmin) || this.needPax),
          (this.needPax = tn(t, r + 345, i, a) || this.needPax),
          t[r + 475] !== 0
            ? (this.needPax = tn(t, r + 345, 155, a) || this.needPax)
            : ((this.needPax = tn(t, r + 345, 130, a) || this.needPax),
              (this.needPax = Hd(t, r + 476, 12, this.atime) || this.needPax),
              (this.needPax = Hd(t, r + 488, 12, this.ctime) || this.needPax));
        let o = 8 * 32;
        for (let u = r; u < r + 148; u++) o += t[u];
        for (let u = r + 156; u < r + 512; u++) o += t[u];
        return (
          (this.cksum = o),
          fi(t, r + 148, 8, this.cksum),
          (this.cksumValid = !0),
          this.needPax
        );
      }
      set(t) {
        for (let r in t) t[r] !== null && t[r] !== void 0 && (this[r] = t[r]);
      }
      get type() {
        return $d.name.get(this[Ct]) || this[Ct];
      }
      get typeKey() {
        return this[Ct];
      }
      set type(t) {
        $d.code.has(t) ? (this[Ct] = $d.code.get(t)) : (this[Ct] = t);
      }
    },
    Z5 = (e, t) => {
      let i = e,
        n = "",
        s,
        a = us.parse(e).root || ".";
      if (Buffer.byteLength(i) < 100) s = [i, n, !1];
      else {
        (n = us.dirname(i)), (i = us.basename(i));
        do
          Buffer.byteLength(i) <= 100 && Buffer.byteLength(n) <= t
            ? (s = [i, n, !1])
            : Buffer.byteLength(i) > 100 && Buffer.byteLength(n) <= t
            ? (s = [i.slice(0, 100 - 1), n, !0])
            : ((i = us.join(us.basename(n), i)), (n = us.dirname(n)));
        while (n !== a && !s);
        s || (s = [e.slice(0, 100 - 1), "", !0]);
      }
      return s;
    },
    en = (e, t, r) =>
      e
        .slice(t, t + r)
        .toString("utf8")
        .replace(/\0.*/, ""),
    Gd = (e, t, r) => K5(li(e, t, r)),
    K5 = (e) => (e === null ? null : new Date(e * 1e3)),
    li = (e, t, r) => (e[t] & 128 ? MD.parse(e.slice(t, t + r)) : J5(e, t, r)),
    Q5 = (e) => (isNaN(e) ? null : e),
    J5 = (e, t, r) =>
      Q5(
        parseInt(
          e
            .slice(t, t + r)
            .toString("utf8")
            .replace(/\0.*$/, "")
            .trim(),
          8,
        ),
      ),
    e6 = { 12: 8589934591, 8: 2097151 },
    fi = (e, t, r, i) =>
      i === null
        ? !1
        : i > e6[r] || i < 0
        ? (MD.encode(i, e.slice(t, t + r)), !0)
        : (t6(e, t, r, i), !1),
    t6 = (e, t, r, i) => e.write(r6(i, r), t, r, "ascii"),
    r6 = (e, t) => i6(Math.floor(e).toString(8), t),
    i6 = (e, t) =>
      (e.length === t - 1
        ? e
        : new Array(t - e.length - 1).join("0") + e + " ") + "\0",
    Hd = (e, t, r, i) => (i === null ? !1 : fi(e, t, r, i.getTime() / 1e3)),
    n6 = new Array(156).join("\0"),
    tn = (e, t, r, i) =>
      i === null
        ? !1
        : (e.write(i + n6, t, r, "utf8"),
          i.length !== Buffer.byteLength(i) || i.length > r);
  LD.exports = Yd;
});
var yl = y((SZ, qD) => {
  "use strict";
  var s6 = ls(),
    a6 = require("path"),
    ja = class {
      constructor(t, r) {
        (this.atime = t.atime || null),
          (this.charset = t.charset || null),
          (this.comment = t.comment || null),
          (this.ctime = t.ctime || null),
          (this.gid = t.gid || null),
          (this.gname = t.gname || null),
          (this.linkpath = t.linkpath || null),
          (this.mtime = t.mtime || null),
          (this.path = t.path || null),
          (this.size = t.size || null),
          (this.uid = t.uid || null),
          (this.uname = t.uname || null),
          (this.dev = t.dev || null),
          (this.ino = t.ino || null),
          (this.nlink = t.nlink || null),
          (this.global = r || !1);
      }
      encode() {
        let t = this.encodeBody();
        if (t === "") return null;
        let r = Buffer.byteLength(t),
          i = 512 * Math.ceil(1 + r / 512),
          n = Buffer.allocUnsafe(i);
        for (let s = 0; s < 512; s++) n[s] = 0;
        new s6({
          path: ("PaxHeader/" + a6.basename(this.path)).slice(0, 99),
          mode: this.mode || 420,
          uid: this.uid || null,
          gid: this.gid || null,
          size: r,
          mtime: this.mtime || null,
          type: this.global ? "GlobalExtendedHeader" : "ExtendedHeader",
          linkpath: "",
          uname: this.uname || "",
          gname: this.gname || "",
          devmaj: 0,
          devmin: 0,
          atime: this.atime || null,
          ctime: this.ctime || null,
        }).encode(n),
          n.write(t, 512, r, "utf8");
        for (let s = r + 512; s < n.length; s++) n[s] = 0;
        return n;
      }
      encodeBody() {
        return (
          this.encodeField("path") +
          this.encodeField("ctime") +
          this.encodeField("atime") +
          this.encodeField("dev") +
          this.encodeField("ino") +
          this.encodeField("nlink") +
          this.encodeField("charset") +
          this.encodeField("comment") +
          this.encodeField("gid") +
          this.encodeField("gname") +
          this.encodeField("linkpath") +
          this.encodeField("mtime") +
          this.encodeField("size") +
          this.encodeField("uid") +
          this.encodeField("uname")
        );
      }
      encodeField(t) {
        if (this[t] === null || this[t] === void 0) return "";
        let r = this[t] instanceof Date ? this[t].getTime() / 1e3 : this[t],
          i =
            " " +
            (t === "dev" || t === "ino" || t === "nlink" ? "SCHILY." : "") +
            t +
            "=" +
            r +
            `
`,
          n = Buffer.byteLength(i),
          s = Math.floor(Math.log(n) / Math.log(10)) + 1;
        return n + s >= Math.pow(10, s) && (s += 1), s + n + i;
      }
    };
  ja.parse = (e, t, r) => new ja(o6(u6(e), t), r);
  var o6 = (e, t) =>
      t ? Object.keys(e).reduce((r, i) => ((r[i] = e[i]), r), t) : e,
    u6 = (e) =>
      e
        .replace(/\n$/, "")
        .split(
          `
`,
        )
        .reduce(l6, Object.create(null)),
    l6 = (e, t) => {
      let r = parseInt(t, 10);
      if (r !== Buffer.byteLength(t) + 1) return e;
      t = t.slice((r + " ").length);
      let i = t.split("="),
        n = i.shift().replace(/^SCHILY\.(dev|ino|nlink)/, "$1");
      if (!n) return e;
      let s = i.join("=");
      return (
        (e[n] = /^([A-Z]+\.)?([mac]|birth|creation)time$/.test(n)
          ? new Date(s * 1e3)
          : /^[0-9]+$/.test(s)
          ? +s
          : s),
        e
      );
    };
  qD.exports = ja;
});
var fs = y((xZ, PD) => {
  PD.exports = (e) => {
    let t = e.length - 1,
      r = -1;
    for (; t > -1 && e.charAt(t) === "/"; ) (r = t), t--;
    return r === -1 ? e : e.slice(0, r);
  };
});
var vl = y((CZ, BD) => {
  "use strict";
  BD.exports = (e) =>
    class extends e {
      warn(t, r, i = {}) {
        this.file && (i.file = this.file),
          this.cwd && (i.cwd = this.cwd),
          (i.code = (r instanceof Error && r.code) || t),
          (i.tarCode = t),
          !this.strict && i.recoverable !== !1
            ? (r instanceof Error &&
                ((i = Object.assign(r, i)), (r = r.message)),
              this.emit("warn", i.tarCode, r, i))
            : r instanceof Error
            ? this.emit("error", Object.assign(r, i))
            : this.emit("error", Object.assign(new Error(`${t}: ${r}`), i));
      }
    };
});
var Xd = y((TZ, kD) => {
  "use strict";
  var wl = ["|", "<", ">", "?", ":"],
    Vd = wl.map((e) => String.fromCharCode(61440 + e.charCodeAt(0))),
    f6 = new Map(wl.map((e, t) => [e, Vd[t]])),
    h6 = new Map(Vd.map((e, t) => [e, wl[t]]));
  kD.exports = {
    encode: (e) => wl.reduce((t, r) => t.split(r).join(f6.get(r)), e),
    decode: (e) => Vd.reduce((t, r) => t.split(r).join(h6.get(r)), e),
  };
});
var Zd = y((FZ, UD) => {
  var { isAbsolute: c6, parse: jD } = require("path").win32;
  UD.exports = (e) => {
    let t = "",
      r = jD(e);
    for (; c6(e) || r.root; ) {
      let i = e.charAt(0) === "/" && e.slice(0, 4) !== "//?/" ? "/" : r.root;
      (e = e.slice(i.length)), (t += i), (r = jD(e));
    }
    return [t, e];
  };
});
var $D = y((RZ, zD) => {
  "use strict";
  zD.exports = (e, t, r) => (
    (e &= 4095),
    r && (e = (e | 384) & -19),
    t && (e & 256 && (e |= 64), e & 32 && (e |= 8), e & 4 && (e |= 1)),
    e
  );
});
var ap = y((IZ, ib) => {
  "use strict";
  var ZD = ns(),
    KD = yl(),
    QD = ls(),
    fr = require("fs"),
    WD = require("path"),
    lr = os(),
    d6 = fs(),
    JD = (e, t) =>
      t ? ((e = lr(e).replace(/^\.(\/|$)/, "")), d6(t) + "/" + e) : lr(e),
    p6 = 16 * 1024 * 1024,
    GD = Symbol("process"),
    HD = Symbol("file"),
    YD = Symbol("directory"),
    Qd = Symbol("symlink"),
    VD = Symbol("hardlink"),
    Ua = Symbol("header"),
    Dl = Symbol("read"),
    Jd = Symbol("lstat"),
    bl = Symbol("onlstat"),
    ep = Symbol("onread"),
    tp = Symbol("onreadlink"),
    rp = Symbol("openfile"),
    ip = Symbol("onopenfile"),
    hi = Symbol("close"),
    El = Symbol("mode"),
    np = Symbol("awaitDrain"),
    Kd = Symbol("ondrain"),
    hr = Symbol("prefix"),
    XD = Symbol("hadError"),
    eb = vl(),
    m6 = Xd(),
    tb = Zd(),
    rb = $D(),
    _l = eb(
      class extends ZD {
        constructor(t, r) {
          if (((r = r || {}), super(r), typeof t != "string"))
            throw new TypeError("path is required");
          (this.path = lr(t)),
            (this.portable = !!r.portable),
            (this.myuid = (process.getuid && process.getuid()) || 0),
            (this.myuser = process.env.USER || ""),
            (this.maxReadSize = r.maxReadSize || p6),
            (this.linkCache = r.linkCache || new Map()),
            (this.statCache = r.statCache || new Map()),
            (this.preservePaths = !!r.preservePaths),
            (this.cwd = lr(r.cwd || process.cwd())),
            (this.strict = !!r.strict),
            (this.noPax = !!r.noPax),
            (this.noMtime = !!r.noMtime),
            (this.mtime = r.mtime || null),
            (this.prefix = r.prefix ? lr(r.prefix) : null),
            (this.fd = null),
            (this.blockLen = null),
            (this.blockRemain = null),
            (this.buf = null),
            (this.offset = null),
            (this.length = null),
            (this.pos = null),
            (this.remain = null),
            typeof r.onwarn == "function" && this.on("warn", r.onwarn);
          let i = !1;
          if (!this.preservePaths) {
            let [n, s] = tb(this.path);
            n && ((this.path = s), (i = n));
          }
          (this.win32 = !!r.win32 || process.platform === "win32"),
            this.win32 &&
              ((this.path = m6.decode(this.path.replace(/\\/g, "/"))),
              (t = t.replace(/\\/g, "/"))),
            (this.absolute = lr(r.absolute || WD.resolve(this.cwd, t))),
            this.path === "" && (this.path = "./"),
            i &&
              this.warn("TAR_ENTRY_INFO", `stripping ${i} from absolute path`, {
                entry: this,
                path: i + this.path,
              }),
            this.statCache.has(this.absolute)
              ? this[bl](this.statCache.get(this.absolute))
              : this[Jd]();
        }
        emit(t, ...r) {
          return t === "error" && (this[XD] = !0), super.emit(t, ...r);
        }
        [Jd]() {
          fr.lstat(this.absolute, (t, r) => {
            if (t) return this.emit("error", t);
            this[bl](r);
          });
        }
        [bl](t) {
          this.statCache.set(this.absolute, t),
            (this.stat = t),
            t.isFile() || (t.size = 0),
            (this.type = y6(t)),
            this.emit("stat", t),
            this[GD]();
        }
        [GD]() {
          switch (this.type) {
            case "File":
              return this[HD]();
            case "Directory":
              return this[YD]();
            case "SymbolicLink":
              return this[Qd]();
            default:
              return this.end();
          }
        }
        [El](t) {
          return rb(t, this.type === "Directory", this.portable);
        }
        [hr](t) {
          return JD(t, this.prefix);
        }
        [Ua]() {
          this.type === "Directory" && this.portable && (this.noMtime = !0),
            (this.header = new QD({
              path: this[hr](this.path),
              linkpath:
                this.type === "Link" ? this[hr](this.linkpath) : this.linkpath,
              mode: this[El](this.stat.mode),
              uid: this.portable ? null : this.stat.uid,
              gid: this.portable ? null : this.stat.gid,
              size: this.stat.size,
              mtime: this.noMtime ? null : this.mtime || this.stat.mtime,
              type: this.type,
              uname: this.portable
                ? null
                : this.stat.uid === this.myuid
                ? this.myuser
                : "",
              atime: this.portable ? null : this.stat.atime,
              ctime: this.portable ? null : this.stat.ctime,
            })),
            this.header.encode() &&
              !this.noPax &&
              super.write(
                new KD({
                  atime: this.portable ? null : this.header.atime,
                  ctime: this.portable ? null : this.header.ctime,
                  gid: this.portable ? null : this.header.gid,
                  mtime: this.noMtime ? null : this.mtime || this.header.mtime,
                  path: this[hr](this.path),
                  linkpath:
                    this.type === "Link"
                      ? this[hr](this.linkpath)
                      : this.linkpath,
                  size: this.header.size,
                  uid: this.portable ? null : this.header.uid,
                  uname: this.portable ? null : this.header.uname,
                  dev: this.portable ? null : this.stat.dev,
                  ino: this.portable ? null : this.stat.ino,
                  nlink: this.portable ? null : this.stat.nlink,
                }).encode(),
              ),
            super.write(this.header.block);
        }
        [YD]() {
          this.path.slice(-1) !== "/" && (this.path += "/"),
            (this.stat.size = 0),
            this[Ua](),
            this.end();
        }
        [Qd]() {
          fr.readlink(this.absolute, (t, r) => {
            if (t) return this.emit("error", t);
            this[tp](r);
          });
        }
        [tp](t) {
          (this.linkpath = lr(t)), this[Ua](), this.end();
        }
        [VD](t) {
          (this.type = "Link"),
            (this.linkpath = lr(WD.relative(this.cwd, t))),
            (this.stat.size = 0),
            this[Ua](),
            this.end();
        }
        [HD]() {
          if (this.stat.nlink > 1) {
            let t = this.stat.dev + ":" + this.stat.ino;
            if (this.linkCache.has(t)) {
              let r = this.linkCache.get(t);
              if (r.indexOf(this.cwd) === 0) return this[VD](r);
            }
            this.linkCache.set(t, this.absolute);
          }
          if ((this[Ua](), this.stat.size === 0)) return this.end();
          this[rp]();
        }
        [rp]() {
          fr.open(this.absolute, "r", (t, r) => {
            if (t) return this.emit("error", t);
            this[ip](r);
          });
        }
        [ip](t) {
          if (((this.fd = t), this[XD])) return this[hi]();
          (this.blockLen = 512 * Math.ceil(this.stat.size / 512)),
            (this.blockRemain = this.blockLen);
          let r = Math.min(this.blockLen, this.maxReadSize);
          (this.buf = Buffer.allocUnsafe(r)),
            (this.offset = 0),
            (this.pos = 0),
            (this.remain = this.stat.size),
            (this.length = this.buf.length),
            this[Dl]();
        }
        [Dl]() {
          let { fd: t, buf: r, offset: i, length: n, pos: s } = this;
          fr.read(t, r, i, n, s, (a, o) => {
            if (a) return this[hi](() => this.emit("error", a));
            this[ep](o);
          });
        }
        [hi](t) {
          fr.close(this.fd, t);
        }
        [ep](t) {
          if (t <= 0 && this.remain > 0) {
            let n = new Error("encountered unexpected EOF");
            return (
              (n.path = this.absolute),
              (n.syscall = "read"),
              (n.code = "EOF"),
              this[hi](() => this.emit("error", n))
            );
          }
          if (t > this.remain) {
            let n = new Error("did not encounter expected EOF");
            return (
              (n.path = this.absolute),
              (n.syscall = "read"),
              (n.code = "EOF"),
              this[hi](() => this.emit("error", n))
            );
          }
          if (t === this.remain)
            for (let n = t; n < this.length && t < this.blockRemain; n++)
              (this.buf[n + this.offset] = 0), t++, this.remain++;
          let r =
            this.offset === 0 && t === this.buf.length
              ? this.buf
              : this.buf.slice(this.offset, this.offset + t);
          this.write(r) ? this[Kd]() : this[np](() => this[Kd]());
        }
        [np](t) {
          this.once("drain", t);
        }
        write(t) {
          if (this.blockRemain < t.length) {
            let r = new Error("writing more data than expected");
            return (r.path = this.absolute), this.emit("error", r);
          }
          return (
            (this.remain -= t.length),
            (this.blockRemain -= t.length),
            (this.pos += t.length),
            (this.offset += t.length),
            super.write(t)
          );
        }
        [Kd]() {
          if (!this.remain)
            return (
              this.blockRemain && super.write(Buffer.alloc(this.blockRemain)),
              this[hi]((t) => (t ? this.emit("error", t) : this.end()))
            );
          this.offset >= this.length &&
            ((this.buf = Buffer.allocUnsafe(
              Math.min(this.blockRemain, this.buf.length),
            )),
            (this.offset = 0)),
            (this.length = this.buf.length - this.offset),
            this[Dl]();
        }
      },
    ),
    sp = class extends _l {
      [Jd]() {
        this[bl](fr.lstatSync(this.absolute));
      }
      [Qd]() {
        this[tp](fr.readlinkSync(this.absolute));
      }
      [rp]() {
        this[ip](fr.openSync(this.absolute, "r"));
      }
      [Dl]() {
        let t = !0;
        try {
          let { fd: r, buf: i, offset: n, length: s, pos: a } = this,
            o = fr.readSync(r, i, n, s, a);
          this[ep](o), (t = !1);
        } finally {
          if (t)
            try {
              this[hi](() => {});
            } catch {}
        }
      }
      [np](t) {
        t();
      }
      [hi](t) {
        fr.closeSync(this.fd), t();
      }
    },
    g6 = eb(
      class extends ZD {
        constructor(t, r) {
          (r = r || {}),
            super(r),
            (this.preservePaths = !!r.preservePaths),
            (this.portable = !!r.portable),
            (this.strict = !!r.strict),
            (this.noPax = !!r.noPax),
            (this.noMtime = !!r.noMtime),
            (this.readEntry = t),
            (this.type = t.type),
            this.type === "Directory" && this.portable && (this.noMtime = !0),
            (this.prefix = r.prefix || null),
            (this.path = lr(t.path)),
            (this.mode = this[El](t.mode)),
            (this.uid = this.portable ? null : t.uid),
            (this.gid = this.portable ? null : t.gid),
            (this.uname = this.portable ? null : t.uname),
            (this.gname = this.portable ? null : t.gname),
            (this.size = t.size),
            (this.mtime = this.noMtime ? null : r.mtime || t.mtime),
            (this.atime = this.portable ? null : t.atime),
            (this.ctime = this.portable ? null : t.ctime),
            (this.linkpath = lr(t.linkpath)),
            typeof r.onwarn == "function" && this.on("warn", r.onwarn);
          let i = !1;
          if (!this.preservePaths) {
            let [n, s] = tb(this.path);
            n && ((this.path = s), (i = n));
          }
          (this.remain = t.size),
            (this.blockRemain = t.startBlockSize),
            (this.header = new QD({
              path: this[hr](this.path),
              linkpath:
                this.type === "Link" ? this[hr](this.linkpath) : this.linkpath,
              mode: this.mode,
              uid: this.portable ? null : this.uid,
              gid: this.portable ? null : this.gid,
              size: this.size,
              mtime: this.noMtime ? null : this.mtime,
              type: this.type,
              uname: this.portable ? null : this.uname,
              atime: this.portable ? null : this.atime,
              ctime: this.portable ? null : this.ctime,
            })),
            i &&
              this.warn("TAR_ENTRY_INFO", `stripping ${i} from absolute path`, {
                entry: this,
                path: i + this.path,
              }),
            this.header.encode() &&
              !this.noPax &&
              super.write(
                new KD({
                  atime: this.portable ? null : this.atime,
                  ctime: this.portable ? null : this.ctime,
                  gid: this.portable ? null : this.gid,
                  mtime: this.noMtime ? null : this.mtime,
                  path: this[hr](this.path),
                  linkpath:
                    this.type === "Link"
                      ? this[hr](this.linkpath)
                      : this.linkpath,
                  size: this.size,
                  uid: this.portable ? null : this.uid,
                  uname: this.portable ? null : this.uname,
                  dev: this.portable ? null : this.readEntry.dev,
                  ino: this.portable ? null : this.readEntry.ino,
                  nlink: this.portable ? null : this.readEntry.nlink,
                }).encode(),
              ),
            super.write(this.header.block),
            t.pipe(this);
        }
        [hr](t) {
          return JD(t, this.prefix);
        }
        [El](t) {
          return rb(t, this.type === "Directory", this.portable);
        }
        write(t) {
          let r = t.length;
          if (r > this.blockRemain)
            throw new Error("writing more to entry than is appropriate");
          return (this.blockRemain -= r), super.write(t);
        }
        end() {
          return (
            this.blockRemain && super.write(Buffer.alloc(this.blockRemain)),
            super.end()
          );
        }
      },
    );
  _l.Sync = sp;
  _l.Tar = g6;
  var y6 = (e) =>
    e.isFile()
      ? "File"
      : e.isDirectory()
      ? "Directory"
      : e.isSymbolicLink()
      ? "SymbolicLink"
      : "Unsupported";
  ib.exports = _l;
});
var sb = y((MZ, nb) => {
  "use strict";
  nb.exports = function (e) {
    e.prototype[Symbol.iterator] = function* () {
      for (let t = this.head; t; t = t.next) yield t.value;
    };
  };
});
var op = y((LZ, ab) => {
  "use strict";
  ab.exports = fe;
  fe.Node = rn;
  fe.create = fe;
  function fe(e) {
    var t = this;
    if (
      (t instanceof fe || (t = new fe()),
      (t.tail = null),
      (t.head = null),
      (t.length = 0),
      e && typeof e.forEach == "function")
    )
      e.forEach(function (n) {
        t.push(n);
      });
    else if (arguments.length > 0)
      for (var r = 0, i = arguments.length; r < i; r++) t.push(arguments[r]);
    return t;
  }
  fe.prototype.removeNode = function (e) {
    if (e.list !== this)
      throw new Error("removing node which does not belong to this list");
    var t = e.next,
      r = e.prev;
    return (
      t && (t.prev = r),
      r && (r.next = t),
      e === this.head && (this.head = t),
      e === this.tail && (this.tail = r),
      e.list.length--,
      (e.next = null),
      (e.prev = null),
      (e.list = null),
      t
    );
  };
  fe.prototype.unshiftNode = function (e) {
    if (e !== this.head) {
      e.list && e.list.removeNode(e);
      var t = this.head;
      (e.list = this),
        (e.next = t),
        t && (t.prev = e),
        (this.head = e),
        this.tail || (this.tail = e),
        this.length++;
    }
  };
  fe.prototype.pushNode = function (e) {
    if (e !== this.tail) {
      e.list && e.list.removeNode(e);
      var t = this.tail;
      (e.list = this),
        (e.prev = t),
        t && (t.next = e),
        (this.tail = e),
        this.head || (this.head = e),
        this.length++;
    }
  };
  fe.prototype.push = function () {
    for (var e = 0, t = arguments.length; e < t; e++) w6(this, arguments[e]);
    return this.length;
  };
  fe.prototype.unshift = function () {
    for (var e = 0, t = arguments.length; e < t; e++) D6(this, arguments[e]);
    return this.length;
  };
  fe.prototype.pop = function () {
    if (!!this.tail) {
      var e = this.tail.value;
      return (
        (this.tail = this.tail.prev),
        this.tail ? (this.tail.next = null) : (this.head = null),
        this.length--,
        e
      );
    }
  };
  fe.prototype.shift = function () {
    if (!!this.head) {
      var e = this.head.value;
      return (
        (this.head = this.head.next),
        this.head ? (this.head.prev = null) : (this.tail = null),
        this.length--,
        e
      );
    }
  };
  fe.prototype.forEach = function (e, t) {
    t = t || this;
    for (var r = this.head, i = 0; r !== null; i++)
      e.call(t, r.value, i, this), (r = r.next);
  };
  fe.prototype.forEachReverse = function (e, t) {
    t = t || this;
    for (var r = this.tail, i = this.length - 1; r !== null; i--)
      e.call(t, r.value, i, this), (r = r.prev);
  };
  fe.prototype.get = function (e) {
    for (var t = 0, r = this.head; r !== null && t < e; t++) r = r.next;
    if (t === e && r !== null) return r.value;
  };
  fe.prototype.getReverse = function (e) {
    for (var t = 0, r = this.tail; r !== null && t < e; t++) r = r.prev;
    if (t === e && r !== null) return r.value;
  };
  fe.prototype.map = function (e, t) {
    t = t || this;
    for (var r = new fe(), i = this.head; i !== null; )
      r.push(e.call(t, i.value, this)), (i = i.next);
    return r;
  };
  fe.prototype.mapReverse = function (e, t) {
    t = t || this;
    for (var r = new fe(), i = this.tail; i !== null; )
      r.push(e.call(t, i.value, this)), (i = i.prev);
    return r;
  };
  fe.prototype.reduce = function (e, t) {
    var r,
      i = this.head;
    if (arguments.length > 1) r = t;
    else if (this.head) (i = this.head.next), (r = this.head.value);
    else throw new TypeError("Reduce of empty list with no initial value");
    for (var n = 0; i !== null; n++) (r = e(r, i.value, n)), (i = i.next);
    return r;
  };
  fe.prototype.reduceReverse = function (e, t) {
    var r,
      i = this.tail;
    if (arguments.length > 1) r = t;
    else if (this.tail) (i = this.tail.prev), (r = this.tail.value);
    else throw new TypeError("Reduce of empty list with no initial value");
    for (var n = this.length - 1; i !== null; n--)
      (r = e(r, i.value, n)), (i = i.prev);
    return r;
  };
  fe.prototype.toArray = function () {
    for (var e = new Array(this.length), t = 0, r = this.head; r !== null; t++)
      (e[t] = r.value), (r = r.next);
    return e;
  };
  fe.prototype.toArrayReverse = function () {
    for (var e = new Array(this.length), t = 0, r = this.tail; r !== null; t++)
      (e[t] = r.value), (r = r.prev);
    return e;
  };
  fe.prototype.slice = function (e, t) {
    (t = t || this.length),
      t < 0 && (t += this.length),
      (e = e || 0),
      e < 0 && (e += this.length);
    var r = new fe();
    if (t < e || t < 0) return r;
    e < 0 && (e = 0), t > this.length && (t = this.length);
    for (var i = 0, n = this.head; n !== null && i < e; i++) n = n.next;
    for (; n !== null && i < t; i++, n = n.next) r.push(n.value);
    return r;
  };
  fe.prototype.sliceReverse = function (e, t) {
    (t = t || this.length),
      t < 0 && (t += this.length),
      (e = e || 0),
      e < 0 && (e += this.length);
    var r = new fe();
    if (t < e || t < 0) return r;
    e < 0 && (e = 0), t > this.length && (t = this.length);
    for (var i = this.length, n = this.tail; n !== null && i > t; i--)
      n = n.prev;
    for (; n !== null && i > e; i--, n = n.prev) r.push(n.value);
    return r;
  };
  fe.prototype.splice = function (e, t, ...r) {
    e > this.length && (e = this.length - 1), e < 0 && (e = this.length + e);
    for (var i = 0, n = this.head; n !== null && i < e; i++) n = n.next;
    for (var s = [], i = 0; n && i < t; i++)
      s.push(n.value), (n = this.removeNode(n));
    n === null && (n = this.tail),
      n !== this.head && n !== this.tail && (n = n.prev);
    for (var i = 0; i < r.length; i++) n = v6(this, n, r[i]);
    return s;
  };
  fe.prototype.reverse = function () {
    for (var e = this.head, t = this.tail, r = e; r !== null; r = r.prev) {
      var i = r.prev;
      (r.prev = r.next), (r.next = i);
    }
    return (this.head = t), (this.tail = e), this;
  };
  function v6(e, t, r) {
    var i = t === e.head ? new rn(r, null, t, e) : new rn(r, t, t.next, e);
    return (
      i.next === null && (e.tail = i),
      i.prev === null && (e.head = i),
      e.length++,
      i
    );
  }
  function w6(e, t) {
    (e.tail = new rn(t, e.tail, null, e)),
      e.head || (e.head = e.tail),
      e.length++;
  }
  function D6(e, t) {
    (e.head = new rn(t, null, e.head, e)),
      e.tail || (e.tail = e.head),
      e.length++;
  }
  function rn(e, t, r, i) {
    if (!(this instanceof rn)) return new rn(e, t, r, i);
    (this.list = i),
      (this.value = e),
      t ? ((t.next = this), (this.prev = t)) : (this.prev = null),
      r ? ((r.prev = this), (this.next = r)) : (this.next = null);
  }
  try {
    sb()(fe);
  } catch {}
});
var Nl = y((PZ, db) => {
  "use strict";
  var Rl = class {
      constructor(t, r) {
        (this.path = t || "./"),
          (this.absolute = r),
          (this.entry = null),
          (this.stat = null),
          (this.readdir = null),
          (this.pending = !1),
          (this.ignore = !1),
          (this.piped = !1);
      }
    },
    b6 = ns(),
    E6 = kd(),
    _6 = ml(),
    gp = ap(),
    S6 = gp.Sync,
    x6 = gp.Tar,
    C6 = op(),
    ob = Buffer.alloc(1024),
    Cl = Symbol("onStat"),
    Sl = Symbol("ended"),
    cr = Symbol("queue"),
    hs = Symbol("current"),
    nn = Symbol("process"),
    xl = Symbol("processing"),
    ub = Symbol("processJob"),
    dr = Symbol("jobs"),
    up = Symbol("jobDone"),
    Ol = Symbol("addFSEntry"),
    lb = Symbol("addTarEntry"),
    cp = Symbol("stat"),
    dp = Symbol("readdir"),
    Tl = Symbol("onreaddir"),
    Fl = Symbol("pipe"),
    fb = Symbol("entry"),
    lp = Symbol("entryOpt"),
    pp = Symbol("writeEntryClass"),
    cb = Symbol("write"),
    fp = Symbol("ondrain"),
    Al = require("fs"),
    hb = require("path"),
    O6 = vl(),
    hp = os(),
    yp = O6(
      class extends b6 {
        constructor(t) {
          super(t),
            (t = t || Object.create(null)),
            (this.opt = t),
            (this.file = t.file || ""),
            (this.cwd = t.cwd || process.cwd()),
            (this.maxReadSize = t.maxReadSize),
            (this.preservePaths = !!t.preservePaths),
            (this.strict = !!t.strict),
            (this.noPax = !!t.noPax),
            (this.prefix = hp(t.prefix || "")),
            (this.linkCache = t.linkCache || new Map()),
            (this.statCache = t.statCache || new Map()),
            (this.readdirCache = t.readdirCache || new Map()),
            (this[pp] = gp),
            typeof t.onwarn == "function" && this.on("warn", t.onwarn),
            (this.portable = !!t.portable),
            (this.zip = null),
            t.gzip
              ? (typeof t.gzip != "object" && (t.gzip = {}),
                this.portable && (t.gzip.portable = !0),
                (this.zip = new E6.Gzip(t.gzip)),
                this.zip.on("data", (r) => super.write(r)),
                this.zip.on("end", (r) => super.end()),
                this.zip.on("drain", (r) => this[fp]()),
                this.on("resume", (r) => this.zip.resume()))
              : this.on("drain", this[fp]),
            (this.noDirRecurse = !!t.noDirRecurse),
            (this.follow = !!t.follow),
            (this.noMtime = !!t.noMtime),
            (this.mtime = t.mtime || null),
            (this.filter =
              typeof t.filter == "function" ? t.filter : (r) => !0),
            (this[cr] = new C6()),
            (this[dr] = 0),
            (this.jobs = +t.jobs || 4),
            (this[xl] = !1),
            (this[Sl] = !1);
        }
        [cb](t) {
          return super.write(t);
        }
        add(t) {
          return this.write(t), this;
        }
        end(t) {
          return t && this.write(t), (this[Sl] = !0), this[nn](), this;
        }
        write(t) {
          if (this[Sl]) throw new Error("write after end");
          return t instanceof _6 ? this[lb](t) : this[Ol](t), this.flowing;
        }
        [lb](t) {
          let r = hp(hb.resolve(this.cwd, t.path));
          if (!this.filter(t.path, t)) t.resume();
          else {
            let i = new Rl(t.path, r, !1);
            (i.entry = new x6(t, this[lp](i))),
              i.entry.on("end", (n) => this[up](i)),
              (this[dr] += 1),
              this[cr].push(i);
          }
          this[nn]();
        }
        [Ol](t) {
          let r = hp(hb.resolve(this.cwd, t));
          this[cr].push(new Rl(t, r)), this[nn]();
        }
        [cp](t) {
          (t.pending = !0), (this[dr] += 1);
          let r = this.follow ? "stat" : "lstat";
          Al[r](t.absolute, (i, n) => {
            (t.pending = !1),
              (this[dr] -= 1),
              i ? this.emit("error", i) : this[Cl](t, n);
          });
        }
        [Cl](t, r) {
          this.statCache.set(t.absolute, r),
            (t.stat = r),
            this.filter(t.path, r) || (t.ignore = !0),
            this[nn]();
        }
        [dp](t) {
          (t.pending = !0),
            (this[dr] += 1),
            Al.readdir(t.absolute, (r, i) => {
              if (((t.pending = !1), (this[dr] -= 1), r))
                return this.emit("error", r);
              this[Tl](t, i);
            });
        }
        [Tl](t, r) {
          this.readdirCache.set(t.absolute, r), (t.readdir = r), this[nn]();
        }
        [nn]() {
          if (!this[xl]) {
            this[xl] = !0;
            for (
              let t = this[cr].head;
              t !== null && this[dr] < this.jobs;
              t = t.next
            )
              if ((this[ub](t.value), t.value.ignore)) {
                let r = t.next;
                this[cr].removeNode(t), (t.next = r);
              }
            (this[xl] = !1),
              this[Sl] &&
                !this[cr].length &&
                this[dr] === 0 &&
                (this.zip ? this.zip.end(ob) : (super.write(ob), super.end()));
          }
        }
        get [hs]() {
          return this[cr] && this[cr].head && this[cr].head.value;
        }
        [up](t) {
          this[cr].shift(), (this[dr] -= 1), this[nn]();
        }
        [ub](t) {
          if (!t.pending) {
            if (t.entry) {
              t === this[hs] && !t.piped && this[Fl](t);
              return;
            }
            if (
              (t.stat ||
                (this.statCache.has(t.absolute)
                  ? this[Cl](t, this.statCache.get(t.absolute))
                  : this[cp](t)),
              !!t.stat &&
                !t.ignore &&
                !(
                  !this.noDirRecurse &&
                  t.stat.isDirectory() &&
                  !t.readdir &&
                  (this.readdirCache.has(t.absolute)
                    ? this[Tl](t, this.readdirCache.get(t.absolute))
                    : this[dp](t),
                  !t.readdir)
                ))
            ) {
              if (((t.entry = this[fb](t)), !t.entry)) {
                t.ignore = !0;
                return;
              }
              t === this[hs] && !t.piped && this[Fl](t);
            }
          }
        }
        [lp](t) {
          return {
            onwarn: (r, i, n) => this.warn(r, i, n),
            noPax: this.noPax,
            cwd: this.cwd,
            absolute: t.absolute,
            preservePaths: this.preservePaths,
            maxReadSize: this.maxReadSize,
            strict: this.strict,
            portable: this.portable,
            linkCache: this.linkCache,
            statCache: this.statCache,
            noMtime: this.noMtime,
            mtime: this.mtime,
            prefix: this.prefix,
          };
        }
        [fb](t) {
          this[dr] += 1;
          try {
            return new this[pp](t.path, this[lp](t))
              .on("end", () => this[up](t))
              .on("error", (r) => this.emit("error", r));
          } catch (r) {
            this.emit("error", r);
          }
        }
        [fp]() {
          this[hs] && this[hs].entry && this[hs].entry.resume();
        }
        [Fl](t) {
          (t.piped = !0),
            t.readdir &&
              t.readdir.forEach((n) => {
                let s = t.path,
                  a = s === "./" ? "" : s.replace(/\/*$/, "/");
                this[Ol](a + n);
              });
          let r = t.entry,
            i = this.zip;
          i
            ? r.on("data", (n) => {
                i.write(n) || r.pause();
              })
            : r.on("data", (n) => {
                super.write(n) || r.pause();
              });
        }
        pause() {
          return this.zip && this.zip.pause(), super.pause();
        }
      },
    ),
    mp = class extends yp {
      constructor(t) {
        super(t), (this[pp] = S6);
      }
      pause() {}
      resume() {}
      [cp](t) {
        let r = this.follow ? "statSync" : "lstatSync";
        this[Cl](t, Al[r](t.absolute));
      }
      [dp](t, r) {
        this[Tl](t, Al.readdirSync(t.absolute));
      }
      [Fl](t) {
        let r = t.entry,
          i = this.zip;
        t.readdir &&
          t.readdir.forEach((n) => {
            let s = t.path,
              a = s === "./" ? "" : s.replace(/\/*$/, "/");
            this[Ol](a + n);
          }),
          i
            ? r.on("data", (n) => {
                i.write(n);
              })
            : r.on("data", (n) => {
                super[cb](n);
              });
      }
    };
  yp.Sync = mp;
  db.exports = yp;
});
var ws = y(($a) => {
  "use strict";
  var T6 = ns(),
    F6 = require("events").EventEmitter,
    yt = require("fs"),
    Dp = yt.writev;
  if (!Dp) {
    let e = process.binding("fs"),
      t = e.FSReqWrap || e.FSReqCallback;
    Dp = (r, i, n, s) => {
      let a = (u, l) => s(u, l, i),
        o = new t();
      (o.oncomplete = a), e.writeBuffers(r, i, n, o);
    };
  }
  var ys = Symbol("_autoClose"),
    Qt = Symbol("_close"),
    za = Symbol("_ended"),
    ye = Symbol("_fd"),
    pb = Symbol("_finished"),
    di = Symbol("_flags"),
    vp = Symbol("_flush"),
    bp = Symbol("_handleChunk"),
    Ep = Symbol("_makeBuf"),
    Pl = Symbol("_mode"),
    Il = Symbol("_needDrain"),
    ms = Symbol("_onerror"),
    vs = Symbol("_onopen"),
    wp = Symbol("_onread"),
    ds = Symbol("_onwrite"),
    pi = Symbol("_open"),
    Mr = Symbol("_path"),
    sn = Symbol("_pos"),
    pr = Symbol("_queue"),
    ps = Symbol("_read"),
    mb = Symbol("_readSize"),
    ci = Symbol("_reading"),
    Ml = Symbol("_remain"),
    gb = Symbol("_size"),
    Ll = Symbol("_write"),
    cs = Symbol("_writing"),
    ql = Symbol("_defaultFlag"),
    gs = Symbol("_errored"),
    Bl = class extends T6 {
      constructor(t, r) {
        if (
          ((r = r || {}),
          super(r),
          (this.readable = !0),
          (this.writable = !1),
          typeof t != "string")
        )
          throw new TypeError("path must be a string");
        (this[gs] = !1),
          (this[ye] = typeof r.fd == "number" ? r.fd : null),
          (this[Mr] = t),
          (this[mb] = r.readSize || 16 * 1024 * 1024),
          (this[ci] = !1),
          (this[gb] = typeof r.size == "number" ? r.size : 1 / 0),
          (this[Ml] = this[gb]),
          (this[ys] = typeof r.autoClose == "boolean" ? r.autoClose : !0),
          typeof this[ye] == "number" ? this[ps]() : this[pi]();
      }
      get fd() {
        return this[ye];
      }
      get path() {
        return this[Mr];
      }
      write() {
        throw new TypeError("this is a readable stream");
      }
      end() {
        throw new TypeError("this is a readable stream");
      }
      [pi]() {
        yt.open(this[Mr], "r", (t, r) => this[vs](t, r));
      }
      [vs](t, r) {
        t ? this[ms](t) : ((this[ye] = r), this.emit("open", r), this[ps]());
      }
      [Ep]() {
        return Buffer.allocUnsafe(Math.min(this[mb], this[Ml]));
      }
      [ps]() {
        if (!this[ci]) {
          this[ci] = !0;
          let t = this[Ep]();
          if (t.length === 0)
            return process.nextTick(() => this[wp](null, 0, t));
          yt.read(this[ye], t, 0, t.length, null, (r, i, n) =>
            this[wp](r, i, n),
          );
        }
      }
      [wp](t, r, i) {
        (this[ci] = !1), t ? this[ms](t) : this[bp](r, i) && this[ps]();
      }
      [Qt]() {
        if (this[ys] && typeof this[ye] == "number") {
          let t = this[ye];
          (this[ye] = null),
            yt.close(t, (r) =>
              r ? this.emit("error", r) : this.emit("close"),
            );
        }
      }
      [ms](t) {
        (this[ci] = !0), this[Qt](), this.emit("error", t);
      }
      [bp](t, r) {
        let i = !1;
        return (
          (this[Ml] -= t),
          t > 0 && (i = super.write(t < r.length ? r.slice(0, t) : r)),
          (t === 0 || this[Ml] <= 0) && ((i = !1), this[Qt](), super.end()),
          i
        );
      }
      emit(t, r) {
        switch (t) {
          case "prefinish":
          case "finish":
            break;
          case "drain":
            typeof this[ye] == "number" && this[ps]();
            break;
          case "error":
            return this[gs] ? void 0 : ((this[gs] = !0), super.emit(t, r));
          default:
            return super.emit(t, r);
        }
      }
    },
    _p = class extends Bl {
      [pi]() {
        let t = !0;
        try {
          this[vs](null, yt.openSync(this[Mr], "r")), (t = !1);
        } finally {
          t && this[Qt]();
        }
      }
      [ps]() {
        let t = !0;
        try {
          if (!this[ci]) {
            this[ci] = !0;
            do {
              let r = this[Ep](),
                i =
                  r.length === 0
                    ? 0
                    : yt.readSync(this[ye], r, 0, r.length, null);
              if (!this[bp](i, r)) break;
            } while (!0);
            this[ci] = !1;
          }
          t = !1;
        } finally {
          t && this[Qt]();
        }
      }
      [Qt]() {
        if (this[ys] && typeof this[ye] == "number") {
          let t = this[ye];
          (this[ye] = null), yt.closeSync(t), this.emit("close");
        }
      }
    },
    kl = class extends F6 {
      constructor(t, r) {
        (r = r || {}),
          super(r),
          (this.readable = !1),
          (this.writable = !0),
          (this[gs] = !1),
          (this[cs] = !1),
          (this[za] = !1),
          (this[Il] = !1),
          (this[pr] = []),
          (this[Mr] = t),
          (this[ye] = typeof r.fd == "number" ? r.fd : null),
          (this[Pl] = r.mode === void 0 ? 438 : r.mode),
          (this[sn] = typeof r.start == "number" ? r.start : null),
          (this[ys] = typeof r.autoClose == "boolean" ? r.autoClose : !0);
        let i = this[sn] !== null ? "r+" : "w";
        (this[ql] = r.flags === void 0),
          (this[di] = this[ql] ? i : r.flags),
          this[ye] === null && this[pi]();
      }
      emit(t, r) {
        if (t === "error") {
          if (this[gs]) return;
          this[gs] = !0;
        }
        return super.emit(t, r);
      }
      get fd() {
        return this[ye];
      }
      get path() {
        return this[Mr];
      }
      [ms](t) {
        this[Qt](), (this[cs] = !0), this.emit("error", t);
      }
      [pi]() {
        yt.open(this[Mr], this[di], this[Pl], (t, r) => this[vs](t, r));
      }
      [vs](t, r) {
        this[ql] && this[di] === "r+" && t && t.code === "ENOENT"
          ? ((this[di] = "w"), this[pi]())
          : t
          ? this[ms](t)
          : ((this[ye] = r), this.emit("open", r), this[vp]());
      }
      end(t, r) {
        return (
          t && this.write(t, r),
          (this[za] = !0),
          !this[cs] &&
            !this[pr].length &&
            typeof this[ye] == "number" &&
            this[ds](null, 0),
          this
        );
      }
      write(t, r) {
        return (
          typeof t == "string" && (t = Buffer.from(t, r)),
          this[za]
            ? (this.emit("error", new Error("write() after end()")), !1)
            : this[ye] === null || this[cs] || this[pr].length
            ? (this[pr].push(t), (this[Il] = !0), !1)
            : ((this[cs] = !0), this[Ll](t), !0)
        );
      }
      [Ll](t) {
        yt.write(this[ye], t, 0, t.length, this[sn], (r, i) => this[ds](r, i));
      }
      [ds](t, r) {
        t
          ? this[ms](t)
          : (this[sn] !== null && (this[sn] += r),
            this[pr].length
              ? this[vp]()
              : ((this[cs] = !1),
                this[za] && !this[pb]
                  ? ((this[pb] = !0), this[Qt](), this.emit("finish"))
                  : this[Il] && ((this[Il] = !1), this.emit("drain"))));
      }
      [vp]() {
        if (this[pr].length === 0) this[za] && this[ds](null, 0);
        else if (this[pr].length === 1) this[Ll](this[pr].pop());
        else {
          let t = this[pr];
          (this[pr] = []), Dp(this[ye], t, this[sn], (r, i) => this[ds](r, i));
        }
      }
      [Qt]() {
        if (this[ys] && typeof this[ye] == "number") {
          let t = this[ye];
          (this[ye] = null),
            yt.close(t, (r) =>
              r ? this.emit("error", r) : this.emit("close"),
            );
        }
      }
    },
    Sp = class extends kl {
      [pi]() {
        let t;
        if (this[ql] && this[di] === "r+")
          try {
            t = yt.openSync(this[Mr], this[di], this[Pl]);
          } catch (r) {
            if (r.code === "ENOENT") return (this[di] = "w"), this[pi]();
            throw r;
          }
        else t = yt.openSync(this[Mr], this[di], this[Pl]);
        this[vs](null, t);
      }
      [Qt]() {
        if (this[ys] && typeof this[ye] == "number") {
          let t = this[ye];
          (this[ye] = null), yt.closeSync(t), this.emit("close");
        }
      }
      [Ll](t) {
        let r = !0;
        try {
          this[ds](null, yt.writeSync(this[ye], t, 0, t.length, this[sn])),
            (r = !1);
        } finally {
          if (r)
            try {
              this[Qt]();
            } catch {}
        }
      }
    };
  $a.ReadStream = Bl;
  $a.ReadStreamSync = _p;
  $a.WriteStream = kl;
  $a.WriteStreamSync = Sp;
});
var Hl = y((jZ, Sb) => {
  "use strict";
  var R6 = vl(),
    A6 = ls(),
    N6 = require("events"),
    I6 = op(),
    M6 = 1024 * 1024,
    L6 = ml(),
    yb = yl(),
    q6 = kd(),
    { nextTick: P6 } = require("process"),
    xp = Buffer.from([31, 139]),
    Ut = Symbol("state"),
    an = Symbol("writeEntry"),
    Lr = Symbol("readEntry"),
    Cp = Symbol("nextEntry"),
    vb = Symbol("processEntry"),
    zt = Symbol("extendedHeader"),
    Wa = Symbol("globalExtendedHeader"),
    mi = Symbol("meta"),
    wb = Symbol("emitMeta"),
    be = Symbol("buffer"),
    qr = Symbol("queue"),
    on = Symbol("ended"),
    Db = Symbol("emittedEnd"),
    un = Symbol("emit"),
    vt = Symbol("unzip"),
    jl = Symbol("consumeChunk"),
    Ul = Symbol("consumeChunkSub"),
    Op = Symbol("consumeBody"),
    bb = Symbol("consumeMeta"),
    Eb = Symbol("consumeHeader"),
    zl = Symbol("consuming"),
    Tp = Symbol("bufferConcat"),
    Fp = Symbol("maybeEnd"),
    Ga = Symbol("writing"),
    gi = Symbol("aborted"),
    $l = Symbol("onDone"),
    ln = Symbol("sawValidEntry"),
    Wl = Symbol("sawNullBlock"),
    Gl = Symbol("sawEOF"),
    _b = Symbol("closeStream"),
    B6 = (e) => !0;
  Sb.exports = R6(
    class extends N6 {
      constructor(t) {
        (t = t || {}),
          super(t),
          (this.file = t.file || ""),
          (this[ln] = null),
          this.on($l, (r) => {
            (this[Ut] === "begin" || this[ln] === !1) &&
              this.warn("TAR_BAD_ARCHIVE", "Unrecognized archive format");
          }),
          t.ondone
            ? this.on($l, t.ondone)
            : this.on($l, (r) => {
                this.emit("prefinish"), this.emit("finish"), this.emit("end");
              }),
          (this.strict = !!t.strict),
          (this.maxMetaEntrySize = t.maxMetaEntrySize || M6),
          (this.filter = typeof t.filter == "function" ? t.filter : B6),
          (this.writable = !0),
          (this.readable = !1),
          (this[qr] = new I6()),
          (this[be] = null),
          (this[Lr] = null),
          (this[an] = null),
          (this[Ut] = "begin"),
          (this[mi] = ""),
          (this[zt] = null),
          (this[Wa] = null),
          (this[on] = !1),
          (this[vt] = null),
          (this[gi] = !1),
          (this[Wl] = !1),
          (this[Gl] = !1),
          this.on("end", () => this[_b]()),
          typeof t.onwarn == "function" && this.on("warn", t.onwarn),
          typeof t.onentry == "function" && this.on("entry", t.onentry);
      }
      [Eb](t, r) {
        this[ln] === null && (this[ln] = !1);
        let i;
        try {
          i = new A6(t, r, this[zt], this[Wa]);
        } catch (n) {
          return this.warn("TAR_ENTRY_INVALID", n);
        }
        if (i.nullBlock)
          this[Wl]
            ? ((this[Gl] = !0),
              this[Ut] === "begin" && (this[Ut] = "header"),
              this[un]("eof"))
            : ((this[Wl] = !0), this[un]("nullBlock"));
        else if (((this[Wl] = !1), !i.cksumValid))
          this.warn("TAR_ENTRY_INVALID", "checksum failure", { header: i });
        else if (!i.path)
          this.warn("TAR_ENTRY_INVALID", "path is required", { header: i });
        else {
          let n = i.type;
          if (/^(Symbolic)?Link$/.test(n) && !i.linkpath)
            this.warn("TAR_ENTRY_INVALID", "linkpath required", { header: i });
          else if (!/^(Symbolic)?Link$/.test(n) && i.linkpath)
            this.warn("TAR_ENTRY_INVALID", "linkpath forbidden", { header: i });
          else {
            let s = (this[an] = new L6(i, this[zt], this[Wa]));
            if (!this[ln])
              if (s.remain) {
                let a = () => {
                  s.invalid || (this[ln] = !0);
                };
                s.on("end", a);
              } else this[ln] = !0;
            s.meta
              ? s.size > this.maxMetaEntrySize
                ? ((s.ignore = !0),
                  this[un]("ignoredEntry", s),
                  (this[Ut] = "ignore"),
                  s.resume())
                : s.size > 0 &&
                  ((this[mi] = ""),
                  s.on("data", (a) => (this[mi] += a)),
                  (this[Ut] = "meta"))
              : ((this[zt] = null),
                (s.ignore = s.ignore || !this.filter(s.path, s)),
                s.ignore
                  ? (this[un]("ignoredEntry", s),
                    (this[Ut] = s.remain ? "ignore" : "header"),
                    s.resume())
                  : (s.remain
                      ? (this[Ut] = "body")
                      : ((this[Ut] = "header"), s.end()),
                    this[Lr]
                      ? this[qr].push(s)
                      : (this[qr].push(s), this[Cp]())));
          }
        }
      }
      [_b]() {
        P6(() => this.emit("close"));
      }
      [vb](t) {
        let r = !0;
        return (
          t
            ? Array.isArray(t)
              ? this.emit.apply(this, t)
              : ((this[Lr] = t),
                this.emit("entry", t),
                t.emittedEnd || (t.on("end", (i) => this[Cp]()), (r = !1)))
            : ((this[Lr] = null), (r = !1)),
          r
        );
      }
      [Cp]() {
        do;
        while (this[vb](this[qr].shift()));
        if (!this[qr].length) {
          let t = this[Lr];
          !t || t.flowing || t.size === t.remain
            ? this[Ga] || this.emit("drain")
            : t.once("drain", (i) => this.emit("drain"));
        }
      }
      [Op](t, r) {
        let i = this[an],
          n = i.blockRemain,
          s = n >= t.length && r === 0 ? t : t.slice(r, r + n);
        return (
          i.write(s),
          i.blockRemain || ((this[Ut] = "header"), (this[an] = null), i.end()),
          s.length
        );
      }
      [bb](t, r) {
        let i = this[an],
          n = this[Op](t, r);
        return this[an] || this[wb](i), n;
      }
      [un](t, r, i) {
        !this[qr].length && !this[Lr]
          ? this.emit(t, r, i)
          : this[qr].push([t, r, i]);
      }
      [wb](t) {
        switch ((this[un]("meta", this[mi]), t.type)) {
          case "ExtendedHeader":
          case "OldExtendedHeader":
            this[zt] = yb.parse(this[mi], this[zt], !1);
            break;
          case "GlobalExtendedHeader":
            this[Wa] = yb.parse(this[mi], this[Wa], !0);
            break;
          case "NextFileHasLongPath":
          case "OldGnuLongPath":
            (this[zt] = this[zt] || Object.create(null)),
              (this[zt].path = this[mi].replace(/\0.*/, ""));
            break;
          case "NextFileHasLongLinkpath":
            (this[zt] = this[zt] || Object.create(null)),
              (this[zt].linkpath = this[mi].replace(/\0.*/, ""));
            break;
          default:
            throw new Error("unknown meta: " + t.type);
        }
      }
      abort(t) {
        (this[gi] = !0),
          this.emit("abort", t),
          this.warn("TAR_ABORT", t, { recoverable: !1 });
      }
      write(t) {
        if (this[gi]) return;
        if (this[vt] === null && t) {
          if (
            (this[be] &&
              ((t = Buffer.concat([this[be], t])), (this[be] = null)),
            t.length < xp.length)
          )
            return (this[be] = t), !0;
          for (let i = 0; this[vt] === null && i < xp.length; i++)
            t[i] !== xp[i] && (this[vt] = !1);
          if (this[vt] === null) {
            let i = this[on];
            (this[on] = !1),
              (this[vt] = new q6.Unzip()),
              this[vt].on("data", (s) => this[jl](s)),
              this[vt].on("error", (s) => this.abort(s)),
              this[vt].on("end", (s) => {
                (this[on] = !0), this[jl]();
              }),
              (this[Ga] = !0);
            let n = this[vt][i ? "end" : "write"](t);
            return (this[Ga] = !1), n;
          }
        }
        (this[Ga] = !0),
          this[vt] ? this[vt].write(t) : this[jl](t),
          (this[Ga] = !1);
        let r = this[qr].length ? !1 : this[Lr] ? this[Lr].flowing : !0;
        return (
          !r &&
            !this[qr].length &&
            this[Lr].once("drain", (i) => this.emit("drain")),
          r
        );
      }
      [Tp](t) {
        t &&
          !this[gi] &&
          (this[be] = this[be] ? Buffer.concat([this[be], t]) : t);
      }
      [Fp]() {
        if (this[on] && !this[Db] && !this[gi] && !this[zl]) {
          this[Db] = !0;
          let t = this[an];
          if (t && t.blockRemain) {
            let r = this[be] ? this[be].length : 0;
            this.warn(
              "TAR_BAD_ARCHIVE",
              `Truncated input (needed ${t.blockRemain} more bytes, only ${r} available)`,
              { entry: t },
            ),
              this[be] && t.write(this[be]),
              t.end();
          }
          this[un]($l);
        }
      }
      [jl](t) {
        if (this[zl]) this[Tp](t);
        else if (!t && !this[be]) this[Fp]();
        else {
          if (((this[zl] = !0), this[be])) {
            this[Tp](t);
            let r = this[be];
            (this[be] = null), this[Ul](r);
          } else this[Ul](t);
          for (
            ;
            this[be] && this[be].length >= 512 && !this[gi] && !this[Gl];

          ) {
            let r = this[be];
            (this[be] = null), this[Ul](r);
          }
          this[zl] = !1;
        }
        (!this[be] || this[on]) && this[Fp]();
      }
      [Ul](t) {
        let r = 0,
          i = t.length;
        for (; r + 512 <= i && !this[gi] && !this[Gl]; )
          switch (this[Ut]) {
            case "begin":
            case "header":
              this[Eb](t, r), (r += 512);
              break;
            case "ignore":
            case "body":
              r += this[Op](t, r);
              break;
            case "meta":
              r += this[bb](t, r);
              break;
            default:
              throw new Error("invalid state: " + this[Ut]);
          }
        r < i &&
          (this[be]
            ? (this[be] = Buffer.concat([t.slice(r), this[be]]))
            : (this[be] = t.slice(r)));
      }
      end(t) {
        this[gi] ||
          (this[vt] ? this[vt].end(t) : ((this[on] = !0), this.write(t)));
      }
    },
  );
});
var Yl = y((UZ, Tb) => {
  "use strict";
  var k6 = rs(),
    Cb = Hl(),
    Ds = require("fs"),
    j6 = ws(),
    xb = require("path"),
    Rp = fs();
  Tb.exports = (e, t, r) => {
    typeof e == "function"
      ? ((r = e), (t = null), (e = {}))
      : Array.isArray(e) && ((t = e), (e = {})),
      typeof t == "function" && ((r = t), (t = null)),
      t ? (t = Array.from(t)) : (t = []);
    let i = k6(e);
    if (i.sync && typeof r == "function")
      throw new TypeError("callback not supported for sync tar functions");
    if (!i.file && typeof r == "function")
      throw new TypeError("callback only supported with file option");
    return (
      t.length && z6(i, t),
      i.noResume || U6(i),
      i.file && i.sync ? $6(i) : i.file ? W6(i, r) : Ob(i)
    );
  };
  var U6 = (e) => {
      let t = e.onentry;
      e.onentry = t
        ? (r) => {
            t(r), r.resume();
          }
        : (r) => r.resume();
    },
    z6 = (e, t) => {
      let r = new Map(t.map((s) => [Rp(s), !0])),
        i = e.filter,
        n = (s, a) => {
          let o = a || xb.parse(s).root || ".",
            u = s === o ? !1 : r.has(s) ? r.get(s) : n(xb.dirname(s), o);
          return r.set(s, u), u;
        };
      e.filter = i ? (s, a) => i(s, a) && n(Rp(s)) : (s) => n(Rp(s));
    },
    $6 = (e) => {
      let t = Ob(e),
        r = e.file,
        i = !0,
        n;
      try {
        let s = Ds.statSync(r),
          a = e.maxReadSize || 16 * 1024 * 1024;
        if (s.size < a) t.end(Ds.readFileSync(r));
        else {
          let o = 0,
            u = Buffer.allocUnsafe(a);
          for (n = Ds.openSync(r, "r"); o < s.size; ) {
            let l = Ds.readSync(n, u, 0, a, o);
            (o += l), t.write(u.slice(0, l));
          }
          t.end();
        }
        i = !1;
      } finally {
        if (i && n)
          try {
            Ds.closeSync(n);
          } catch {}
      }
    },
    W6 = (e, t) => {
      let r = new Cb(e),
        i = e.maxReadSize || 16 * 1024 * 1024,
        n = e.file,
        s = new Promise((a, o) => {
          r.on("error", o),
            r.on("end", a),
            Ds.stat(n, (u, l) => {
              if (u) o(u);
              else {
                let f = new j6.ReadStream(n, { readSize: i, size: l.size });
                f.on("error", o), f.pipe(r);
              }
            });
        });
      return t ? s.then(t, t) : s;
    },
    Ob = (e) => new Cb(e);
});
var Mb = y((zZ, Ib) => {
  "use strict";
  var G6 = rs(),
    Vl = Nl(),
    Fb = ws(),
    Rb = Yl(),
    Ab = require("path");
  Ib.exports = (e, t, r) => {
    if (
      (typeof t == "function" && (r = t),
      Array.isArray(e) && ((t = e), (e = {})),
      !t || !Array.isArray(t) || !t.length)
    )
      throw new TypeError("no files or directories specified");
    t = Array.from(t);
    let i = G6(e);
    if (i.sync && typeof r == "function")
      throw new TypeError("callback not supported for sync tar functions");
    if (!i.file && typeof r == "function")
      throw new TypeError("callback only supported with file option");
    return i.file && i.sync
      ? H6(i, t)
      : i.file
      ? Y6(i, t, r)
      : i.sync
      ? V6(i, t)
      : X6(i, t);
  };
  var H6 = (e, t) => {
      let r = new Vl.Sync(e),
        i = new Fb.WriteStreamSync(e.file, { mode: e.mode || 438 });
      r.pipe(i), Nb(r, t);
    },
    Y6 = (e, t, r) => {
      let i = new Vl(e),
        n = new Fb.WriteStream(e.file, { mode: e.mode || 438 });
      i.pipe(n);
      let s = new Promise((a, o) => {
        n.on("error", o), n.on("close", a), i.on("error", o);
      });
      return Ap(i, t), r ? s.then(r, r) : s;
    },
    Nb = (e, t) => {
      t.forEach((r) => {
        r.charAt(0) === "@"
          ? Rb({
              file: Ab.resolve(e.cwd, r.slice(1)),
              sync: !0,
              noResume: !0,
              onentry: (i) => e.add(i),
            })
          : e.add(r);
      }),
        e.end();
    },
    Ap = (e, t) => {
      for (; t.length; ) {
        let r = t.shift();
        if (r.charAt(0) === "@")
          return Rb({
            file: Ab.resolve(e.cwd, r.slice(1)),
            noResume: !0,
            onentry: (i) => e.add(i),
          }).then((i) => Ap(e, t));
        e.add(r);
      }
      e.end();
    },
    V6 = (e, t) => {
      let r = new Vl.Sync(e);
      return Nb(r, t), r;
    },
    X6 = (e, t) => {
      let r = new Vl(e);
      return Ap(r, t), r;
    };
});
var Np = y(($Z, Ub) => {
  "use strict";
  var Z6 = rs(),
    Lb = Nl(),
    Ot = require("fs"),
    qb = ws(),
    Pb = Yl(),
    Bb = require("path"),
    kb = ls();
  Ub.exports = (e, t, r) => {
    let i = Z6(e);
    if (!i.file) throw new TypeError("file is required");
    if (i.gzip) throw new TypeError("cannot append to compressed archives");
    if (!t || !Array.isArray(t) || !t.length)
      throw new TypeError("no files or directories specified");
    return (t = Array.from(t)), i.sync ? K6(i, t) : J6(i, t, r);
  };
  var K6 = (e, t) => {
      let r = new Lb.Sync(e),
        i = !0,
        n,
        s;
      try {
        try {
          n = Ot.openSync(e.file, "r+");
        } catch (u) {
          if (u.code === "ENOENT") n = Ot.openSync(e.file, "w+");
          else throw u;
        }
        let a = Ot.fstatSync(n),
          o = Buffer.alloc(512);
        e: for (s = 0; s < a.size; s += 512) {
          for (let f = 0, h = 0; f < 512; f += h) {
            if (
              ((h = Ot.readSync(n, o, f, o.length - f, s + f)),
              s === 0 && o[0] === 31 && o[1] === 139)
            )
              throw new Error("cannot append to compressed archives");
            if (!h) break e;
          }
          let u = new kb(o);
          if (!u.cksumValid) break;
          let l = 512 * Math.ceil(u.size / 512);
          if (s + l + 512 > a.size) break;
          (s += l), e.mtimeCache && e.mtimeCache.set(u.path, u.mtime);
        }
        (i = !1), Q6(e, r, s, n, t);
      } finally {
        if (i)
          try {
            Ot.closeSync(n);
          } catch {}
      }
    },
    Q6 = (e, t, r, i, n) => {
      let s = new qb.WriteStreamSync(e.file, { fd: i, start: r });
      t.pipe(s), eq(t, n);
    },
    J6 = (e, t, r) => {
      t = Array.from(t);
      let i = new Lb(e),
        n = (a, o, u) => {
          let l = (g, C) => {
              g ? Ot.close(a, (S) => u(g)) : u(null, C);
            },
            f = 0;
          if (o === 0) return l(null, 0);
          let h = 0,
            c = Buffer.alloc(512),
            d = (g, C) => {
              if (g) return l(g);
              if (((h += C), h < 512 && C))
                return Ot.read(a, c, h, c.length - h, f + h, d);
              if (f === 0 && c[0] === 31 && c[1] === 139)
                return l(new Error("cannot append to compressed archives"));
              if (h < 512) return l(null, f);
              let S = new kb(c);
              if (!S.cksumValid) return l(null, f);
              let O = 512 * Math.ceil(S.size / 512);
              if (f + O + 512 > o || ((f += O + 512), f >= o))
                return l(null, f);
              e.mtimeCache && e.mtimeCache.set(S.path, S.mtime),
                (h = 0),
                Ot.read(a, c, 0, 512, f, d);
            };
          Ot.read(a, c, 0, 512, f, d);
        },
        s = new Promise((a, o) => {
          i.on("error", o);
          let u = "r+",
            l = (f, h) => {
              if (f && f.code === "ENOENT" && u === "r+")
                return (u = "w+"), Ot.open(e.file, u, l);
              if (f) return o(f);
              Ot.fstat(h, (c, d) => {
                if (c) return Ot.close(h, () => o(c));
                n(h, d.size, (g, C) => {
                  if (g) return o(g);
                  let S = new qb.WriteStream(e.file, { fd: h, start: C });
                  i.pipe(S), S.on("error", o), S.on("close", a), jb(i, t);
                });
              });
            };
          Ot.open(e.file, u, l);
        });
      return r ? s.then(r, r) : s;
    },
    eq = (e, t) => {
      t.forEach((r) => {
        r.charAt(0) === "@"
          ? Pb({
              file: Bb.resolve(e.cwd, r.slice(1)),
              sync: !0,
              noResume: !0,
              onentry: (i) => e.add(i),
            })
          : e.add(r);
      }),
        e.end();
    },
    jb = (e, t) => {
      for (; t.length; ) {
        let r = t.shift();
        if (r.charAt(0) === "@")
          return Pb({
            file: Bb.resolve(e.cwd, r.slice(1)),
            noResume: !0,
            onentry: (i) => e.add(i),
          }).then((i) => jb(e, t));
        e.add(r);
      }
      e.end();
    };
});
var $b = y((WZ, zb) => {
  "use strict";
  var tq = rs(),
    rq = Np();
  zb.exports = (e, t, r) => {
    let i = tq(e);
    if (!i.file) throw new TypeError("file is required");
    if (i.gzip) throw new TypeError("cannot append to compressed archives");
    if (!t || !Array.isArray(t) || !t.length)
      throw new TypeError("no files or directories specified");
    return (t = Array.from(t)), iq(i), rq(i, t, r);
  };
  var iq = (e) => {
    let t = e.filter;
    e.mtimeCache || (e.mtimeCache = new Map()),
      (e.filter = t
        ? (r, i) => t(r, i) && !(e.mtimeCache.get(r) > i.mtime)
        : (r, i) => !(e.mtimeCache.get(r) > i.mtime));
  };
});
var Hb = y((GZ, Gb) => {
  var { promisify: Wb } = require("util"),
    yi = require("fs"),
    nq = (e) => {
      if (!e) e = { mode: 511, fs: yi };
      else if (typeof e == "object") e = { mode: 511, fs: yi, ...e };
      else if (typeof e == "number") e = { mode: e, fs: yi };
      else if (typeof e == "string") e = { mode: parseInt(e, 8), fs: yi };
      else throw new TypeError("invalid options argument");
      return (
        (e.mkdir = e.mkdir || e.fs.mkdir || yi.mkdir),
        (e.mkdirAsync = Wb(e.mkdir)),
        (e.stat = e.stat || e.fs.stat || yi.stat),
        (e.statAsync = Wb(e.stat)),
        (e.statSync = e.statSync || e.fs.statSync || yi.statSync),
        (e.mkdirSync = e.mkdirSync || e.fs.mkdirSync || yi.mkdirSync),
        e
      );
    };
  Gb.exports = nq;
});
var Vb = y((HZ, Yb) => {
  var sq = process.env.__TESTING_MKDIRP_PLATFORM__ || process.platform,
    { resolve: aq, parse: oq } = require("path"),
    uq = (e) => {
      if (/\0/.test(e))
        throw Object.assign(
          new TypeError("path must be a string without null bytes"),
          { path: e, code: "ERR_INVALID_ARG_VALUE" },
        );
      if (((e = aq(e)), sq === "win32")) {
        let t = /[*|"<>?:]/,
          { root: r } = oq(e);
        if (t.test(e.substr(r.length)))
          throw Object.assign(new Error("Illegal characters in path."), {
            path: e,
            code: "EINVAL",
          });
      }
      return e;
    };
  Yb.exports = uq;
});
var Jb = y((YZ, Qb) => {
  var { dirname: Xb } = require("path"),
    Zb = (e, t, r = void 0) =>
      r === t
        ? Promise.resolve()
        : e.statAsync(t).then(
            (i) => (i.isDirectory() ? r : void 0),
            (i) => (i.code === "ENOENT" ? Zb(e, Xb(t), t) : void 0),
          ),
    Kb = (e, t, r = void 0) => {
      if (r !== t)
        try {
          return e.statSync(t).isDirectory() ? r : void 0;
        } catch (i) {
          return i.code === "ENOENT" ? Kb(e, Xb(t), t) : void 0;
        }
    };
  Qb.exports = { findMade: Zb, findMadeSync: Kb };
});
var Lp = y((VZ, tE) => {
  var { dirname: eE } = require("path"),
    Ip = (e, t, r) => {
      t.recursive = !1;
      let i = eE(e);
      return i === e
        ? t.mkdirAsync(e, t).catch((n) => {
            if (n.code !== "EISDIR") throw n;
          })
        : t.mkdirAsync(e, t).then(
            () => r || e,
            (n) => {
              if (n.code === "ENOENT") return Ip(i, t).then((s) => Ip(e, t, s));
              if (n.code !== "EEXIST" && n.code !== "EROFS") throw n;
              return t.statAsync(e).then(
                (s) => {
                  if (s.isDirectory()) return r;
                  throw n;
                },
                () => {
                  throw n;
                },
              );
            },
          );
    },
    Mp = (e, t, r) => {
      let i = eE(e);
      if (((t.recursive = !1), i === e))
        try {
          return t.mkdirSync(e, t);
        } catch (n) {
          if (n.code !== "EISDIR") throw n;
          return;
        }
      try {
        return t.mkdirSync(e, t), r || e;
      } catch (n) {
        if (n.code === "ENOENT") return Mp(e, t, Mp(i, t, r));
        if (n.code !== "EEXIST" && n.code !== "EROFS") throw n;
        try {
          if (!t.statSync(e).isDirectory()) throw n;
        } catch {
          throw n;
        }
      }
    };
  tE.exports = { mkdirpManual: Ip, mkdirpManualSync: Mp };
});
var nE = y((XZ, iE) => {
  var { dirname: rE } = require("path"),
    { findMade: lq, findMadeSync: fq } = Jb(),
    { mkdirpManual: hq, mkdirpManualSync: cq } = Lp(),
    dq = (e, t) => (
      (t.recursive = !0),
      rE(e) === e
        ? t.mkdirAsync(e, t)
        : lq(t, e).then((i) =>
            t
              .mkdirAsync(e, t)
              .then(() => i)
              .catch((n) => {
                if (n.code === "ENOENT") return hq(e, t);
                throw n;
              }),
          )
    ),
    pq = (e, t) => {
      if (((t.recursive = !0), rE(e) === e)) return t.mkdirSync(e, t);
      let i = fq(t, e);
      try {
        return t.mkdirSync(e, t), i;
      } catch (n) {
        if (n.code === "ENOENT") return cq(e, t);
        throw n;
      }
    };
  iE.exports = { mkdirpNative: dq, mkdirpNativeSync: pq };
});
var uE = y((ZZ, oE) => {
  var sE = require("fs"),
    mq = process.env.__TESTING_MKDIRP_NODE_VERSION__ || process.version,
    qp = mq.replace(/^v/, "").split("."),
    aE = +qp[0] > 10 || (+qp[0] == 10 && +qp[1] >= 12),
    gq = aE ? (e) => e.mkdir === sE.mkdir : () => !1,
    yq = aE ? (e) => e.mkdirSync === sE.mkdirSync : () => !1;
  oE.exports = { useNative: gq, useNativeSync: yq };
});
var pE = y((KZ, dE) => {
  var bs = Hb(),
    Es = Vb(),
    { mkdirpNative: lE, mkdirpNativeSync: fE } = nE(),
    { mkdirpManual: hE, mkdirpManualSync: cE } = Lp(),
    { useNative: vq, useNativeSync: wq } = uE(),
    _s = (e, t) => ((e = Es(e)), (t = bs(t)), vq(t) ? lE(e, t) : hE(e, t)),
    Dq = (e, t) => ((e = Es(e)), (t = bs(t)), wq(t) ? fE(e, t) : cE(e, t));
  _s.sync = Dq;
  _s.native = (e, t) => lE(Es(e), bs(t));
  _s.manual = (e, t) => hE(Es(e), bs(t));
  _s.nativeSync = (e, t) => fE(Es(e), bs(t));
  _s.manualSync = (e, t) => cE(Es(e), bs(t));
  dE.exports = _s;
});
var bE = y((QZ, DE) => {
  "use strict";
  var $t = require("fs"),
    fn = require("path"),
    bq = $t.lchown ? "lchown" : "chown",
    Eq = $t.lchownSync ? "lchownSync" : "chownSync",
    gE =
      $t.lchown &&
      !process.version.match(/v1[1-9]+\./) &&
      !process.version.match(/v10\.[6-9]/),
    mE = (e, t, r) => {
      try {
        return $t[Eq](e, t, r);
      } catch (i) {
        if (i.code !== "ENOENT") throw i;
      }
    },
    _q = (e, t, r) => {
      try {
        return $t.chownSync(e, t, r);
      } catch (i) {
        if (i.code !== "ENOENT") throw i;
      }
    },
    Sq = gE
      ? (e, t, r, i) => (n) => {
          !n || n.code !== "EISDIR" ? i(n) : $t.chown(e, t, r, i);
        }
      : (e, t, r, i) => i,
    Pp = gE
      ? (e, t, r) => {
          try {
            return mE(e, t, r);
          } catch (i) {
            if (i.code !== "EISDIR") throw i;
            _q(e, t, r);
          }
        }
      : (e, t, r) => mE(e, t, r),
    xq = process.version,
    yE = (e, t, r) => $t.readdir(e, t, r),
    Cq = (e, t) => $t.readdirSync(e, t);
  /^v4\./.test(xq) && (yE = (e, t, r) => $t.readdir(e, r));
  var Xl = (e, t, r, i) => {
      $t[bq](
        e,
        t,
        r,
        Sq(e, t, r, (n) => {
          i(n && n.code !== "ENOENT" ? n : null);
        }),
      );
    },
    vE = (e, t, r, i, n) => {
      if (typeof t == "string")
        return $t.lstat(fn.resolve(e, t), (s, a) => {
          if (s) return n(s.code !== "ENOENT" ? s : null);
          (a.name = t), vE(e, a, r, i, n);
        });
      if (t.isDirectory())
        Bp(fn.resolve(e, t.name), r, i, (s) => {
          if (s) return n(s);
          let a = fn.resolve(e, t.name);
          Xl(a, r, i, n);
        });
      else {
        let s = fn.resolve(e, t.name);
        Xl(s, r, i, n);
      }
    },
    Bp = (e, t, r, i) => {
      yE(e, { withFileTypes: !0 }, (n, s) => {
        if (n) {
          if (n.code === "ENOENT") return i();
          if (n.code !== "ENOTDIR" && n.code !== "ENOTSUP") return i(n);
        }
        if (n || !s.length) return Xl(e, t, r, i);
        let a = s.length,
          o = null,
          u = (l) => {
            if (!o) {
              if (l) return i((o = l));
              if (--a === 0) return Xl(e, t, r, i);
            }
          };
        s.forEach((l) => vE(e, l, t, r, u));
      });
    },
    Oq = (e, t, r, i) => {
      if (typeof t == "string")
        try {
          let n = $t.lstatSync(fn.resolve(e, t));
          (n.name = t), (t = n);
        } catch (n) {
          if (n.code === "ENOENT") return;
          throw n;
        }
      t.isDirectory() && wE(fn.resolve(e, t.name), r, i),
        Pp(fn.resolve(e, t.name), r, i);
    },
    wE = (e, t, r) => {
      let i;
      try {
        i = Cq(e, { withFileTypes: !0 });
      } catch (n) {
        if (n.code === "ENOENT") return;
        if (n.code === "ENOTDIR" || n.code === "ENOTSUP") return Pp(e, t, r);
        throw n;
      }
      return i && i.length && i.forEach((n) => Oq(e, n, t, r)), Pp(e, t, r);
    };
  DE.exports = Bp;
  Bp.sync = wE;
});
var xE = y((JZ, kp) => {
  "use strict";
  var EE = pE(),
    Wt = require("fs"),
    Zl = require("path"),
    _E = bE(),
    Jt = os(),
    Kl = class extends Error {
      constructor(t, r) {
        super("Cannot extract through symbolic link"),
          (this.path = r),
          (this.symlink = t);
      }
      get name() {
        return "SylinkError";
      }
    },
    Ql = class extends Error {
      constructor(t, r) {
        super(r + ": Cannot cd into '" + t + "'"),
          (this.path = t),
          (this.code = r);
      }
      get name() {
        return "CwdError";
      }
    },
    Jl = (e, t) => e.get(Jt(t)),
    Ha = (e, t, r) => e.set(Jt(t), r),
    Tq = (e, t) => {
      Wt.stat(e, (r, i) => {
        (r || !i.isDirectory()) && (r = new Ql(e, (r && r.code) || "ENOTDIR")),
          t(r);
      });
    };
  kp.exports = (e, t, r) => {
    e = Jt(e);
    let i = t.umask,
      n = t.mode | 448,
      s = (n & i) !== 0,
      a = t.uid,
      o = t.gid,
      u =
        typeof a == "number" &&
        typeof o == "number" &&
        (a !== t.processUid || o !== t.processGid),
      l = t.preserve,
      f = t.unlink,
      h = t.cache,
      c = Jt(t.cwd),
      d = (S, O) => {
        S
          ? r(S)
          : (Ha(h, e, !0),
            O && u ? _E(O, a, o, (L) => d(L)) : s ? Wt.chmod(e, n, r) : r());
      };
    if (h && Jl(h, e) === !0) return d();
    if (e === c) return Tq(e, d);
    if (l) return EE(e, { mode: n }).then((S) => d(null, S), d);
    let C = Jt(Zl.relative(c, e)).split("/");
    ef(c, C, n, h, f, c, null, d);
  };
  var ef = (e, t, r, i, n, s, a, o) => {
      if (!t.length) return o(null, a);
      let u = t.shift(),
        l = Jt(Zl.resolve(e + "/" + u));
      if (Jl(i, l)) return ef(l, t, r, i, n, s, a, o);
      Wt.mkdir(l, r, SE(l, t, r, i, n, s, a, o));
    },
    SE = (e, t, r, i, n, s, a, o) => (u) => {
      u
        ? Wt.lstat(e, (l, f) => {
            if (l) (l.path = l.path && Jt(l.path)), o(l);
            else if (f.isDirectory()) ef(e, t, r, i, n, s, a, o);
            else if (n)
              Wt.unlink(e, (h) => {
                if (h) return o(h);
                Wt.mkdir(e, r, SE(e, t, r, i, n, s, a, o));
              });
            else {
              if (f.isSymbolicLink())
                return o(new Kl(e, e + "/" + t.join("/")));
              o(u);
            }
          })
        : ((a = a || e), ef(e, t, r, i, n, s, a, o));
    },
    Fq = (e) => {
      let t = !1,
        r = "ENOTDIR";
      try {
        t = Wt.statSync(e).isDirectory();
      } catch (i) {
        r = i.code;
      } finally {
        if (!t) throw new Ql(e, r);
      }
    };
  kp.exports.sync = (e, t) => {
    e = Jt(e);
    let r = t.umask,
      i = t.mode | 448,
      n = (i & r) !== 0,
      s = t.uid,
      a = t.gid,
      o =
        typeof s == "number" &&
        typeof a == "number" &&
        (s !== t.processUid || a !== t.processGid),
      u = t.preserve,
      l = t.unlink,
      f = t.cache,
      h = Jt(t.cwd),
      c = (S) => {
        Ha(f, e, !0), S && o && _E.sync(S, s, a), n && Wt.chmodSync(e, i);
      };
    if (f && Jl(f, e) === !0) return c();
    if (e === h) return Fq(h), c();
    if (u) return c(EE.sync(e, i));
    let g = Jt(Zl.relative(h, e)).split("/"),
      C = null;
    for (let S = g.shift(), O = h; S && (O += "/" + S); S = g.shift())
      if (((O = Jt(Zl.resolve(O))), !Jl(f, O)))
        try {
          Wt.mkdirSync(O, i), (C = C || O), Ha(f, O, !0);
        } catch {
          let D = Wt.lstatSync(O);
          if (D.isDirectory()) {
            Ha(f, O, !0);
            continue;
          } else if (l) {
            Wt.unlinkSync(O), Wt.mkdirSync(O, i), (C = C || O), Ha(f, O, !0);
            continue;
          } else if (D.isSymbolicLink())
            return new Kl(O, O + "/" + g.join("/"));
        }
    return c(C);
  };
});
var Up = y((eK, CE) => {
  var jp = Object.create(null),
    { hasOwnProperty: Rq } = Object.prototype;
  CE.exports = (e) => (Rq.call(jp, e) || (jp[e] = e.normalize("NFKD")), jp[e]);
});
var RE = y((tK, FE) => {
  var OE = require("assert"),
    Aq = Up(),
    Nq = fs(),
    { join: TE } = require("path"),
    Iq = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform,
    Mq = Iq === "win32";
  FE.exports = () => {
    let e = new Map(),
      t = new Map(),
      r = (l) =>
        l
          .split("/")
          .slice(0, -1)
          .reduce(
            (h, c) => (
              h.length && (c = TE(h[h.length - 1], c)), h.push(c || "/"), h
            ),
            [],
          ),
      i = new Set(),
      n = (l) => {
        let f = t.get(l);
        if (!f) throw new Error("function does not have any path reservations");
        return {
          paths: f.paths.map((h) => e.get(h)),
          dirs: [...f.dirs].map((h) => e.get(h)),
        };
      },
      s = (l) => {
        let { paths: f, dirs: h } = n(l);
        return (
          f.every((c) => c[0] === l) &&
          h.every((c) => c[0] instanceof Set && c[0].has(l))
        );
      },
      a = (l) => (i.has(l) || !s(l) ? !1 : (i.add(l), l(() => o(l)), !0)),
      o = (l) => {
        if (!i.has(l)) return !1;
        let { paths: f, dirs: h } = t.get(l),
          c = new Set();
        return (
          f.forEach((d) => {
            let g = e.get(d);
            OE.equal(g[0], l),
              g.length === 1
                ? e.delete(d)
                : (g.shift(),
                  typeof g[0] == "function"
                    ? c.add(g[0])
                    : g[0].forEach((C) => c.add(C)));
          }),
          h.forEach((d) => {
            let g = e.get(d);
            OE(g[0] instanceof Set),
              g[0].size === 1 && g.length === 1
                ? e.delete(d)
                : g[0].size === 1
                ? (g.shift(), c.add(g[0]))
                : g[0].delete(l);
          }),
          i.delete(l),
          c.forEach((d) => a(d)),
          !0
        );
      };
    return {
      check: s,
      reserve: (l, f) => {
        l = Mq
          ? ["win32 parallelization disabled"]
          : l.map((c) => Aq(Nq(TE(c))).toLowerCase());
        let h = new Set(l.map((c) => r(c)).reduce((c, d) => c.concat(d)));
        return (
          t.set(f, { dirs: h, paths: l }),
          l.forEach((c) => {
            let d = e.get(c);
            d ? d.push(f) : e.set(c, [f]);
          }),
          h.forEach((c) => {
            let d = e.get(c);
            d
              ? d[d.length - 1] instanceof Set
                ? d[d.length - 1].add(f)
                : d.push(new Set([f]))
              : e.set(c, [new Set([f])]);
          }),
          a(f)
        );
      },
    };
  };
});
var IE = y((rK, NE) => {
  var Lq = process.env.__FAKE_PLATFORM__ || process.platform,
    qq = Lq === "win32",
    Pq = global.__FAKE_TESTING_FS__ || require("fs"),
    {
      O_CREAT: Bq,
      O_TRUNC: kq,
      O_WRONLY: jq,
      UV_FS_O_FILEMAP: AE = 0,
    } = Pq.constants,
    Uq = qq && !!AE,
    zq = 512 * 1024,
    $q = AE | kq | Bq | jq;
  NE.exports = Uq ? (e) => (e < zq ? $q : "w") : () => "w";
});
var Zp = y((iK, YE) => {
  "use strict";
  var Wq = require("assert"),
    Gq = Hl(),
    he = require("fs"),
    Hq = ws(),
    Pr = require("path"),
    WE = xE(),
    ME = Xd(),
    Yq = RE(),
    Vq = Zd(),
    Tt = os(),
    Xq = fs(),
    Zq = Up(),
    LE = Symbol("onEntry"),
    Wp = Symbol("checkFs"),
    qE = Symbol("checkFs2"),
    nf = Symbol("pruneCache"),
    Gp = Symbol("isReusable"),
    Gt = Symbol("makeFs"),
    Hp = Symbol("file"),
    Yp = Symbol("directory"),
    sf = Symbol("link"),
    PE = Symbol("symlink"),
    BE = Symbol("hardlink"),
    kE = Symbol("unsupported"),
    jE = Symbol("checkPath"),
    vi = Symbol("mkdir"),
    nt = Symbol("onError"),
    tf = Symbol("pending"),
    UE = Symbol("pend"),
    Ss = Symbol("unpend"),
    zp = Symbol("ended"),
    $p = Symbol("maybeClose"),
    Vp = Symbol("skip"),
    Ya = Symbol("doChown"),
    Va = Symbol("uid"),
    Xa = Symbol("gid"),
    Za = Symbol("checkedCwd"),
    GE = require("crypto"),
    HE = IE(),
    Kq = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform,
    Ka = Kq === "win32",
    Qq = (e, t) => {
      if (!Ka) return he.unlink(e, t);
      let r = e + ".DELETE." + GE.randomBytes(16).toString("hex");
      he.rename(e, r, (i) => {
        if (i) return t(i);
        he.unlink(r, t);
      });
    },
    Jq = (e) => {
      if (!Ka) return he.unlinkSync(e);
      let t = e + ".DELETE." + GE.randomBytes(16).toString("hex");
      he.renameSync(e, t), he.unlinkSync(t);
    },
    zE = (e, t, r) => (e === e >>> 0 ? e : t === t >>> 0 ? t : r),
    $E = (e) => Zq(Xq(Tt(e))).toLowerCase(),
    e8 = (e, t) => {
      t = $E(t);
      for (let r of e.keys()) {
        let i = $E(r);
        (i === t || i.indexOf(t + "/") === 0) && e.delete(r);
      }
    },
    t8 = (e) => {
      for (let t of e.keys()) e.delete(t);
    },
    Qa = class extends Gq {
      constructor(t) {
        if (
          (t || (t = {}),
          (t.ondone = (r) => {
            (this[zp] = !0), this[$p]();
          }),
          super(t),
          (this[Za] = !1),
          (this.reservations = Yq()),
          (this.transform =
            typeof t.transform == "function" ? t.transform : null),
          (this.writable = !0),
          (this.readable = !1),
          (this[tf] = 0),
          (this[zp] = !1),
          (this.dirCache = t.dirCache || new Map()),
          typeof t.uid == "number" || typeof t.gid == "number")
        ) {
          if (typeof t.uid != "number" || typeof t.gid != "number")
            throw new TypeError("cannot set owner without number uid and gid");
          if (t.preserveOwner)
            throw new TypeError(
              "cannot preserve owner in archive and also set owner explicitly",
            );
          (this.uid = t.uid), (this.gid = t.gid), (this.setOwner = !0);
        } else (this.uid = null), (this.gid = null), (this.setOwner = !1);
        t.preserveOwner === void 0 && typeof t.uid != "number"
          ? (this.preserveOwner = process.getuid && process.getuid() === 0)
          : (this.preserveOwner = !!t.preserveOwner),
          (this.processUid =
            (this.preserveOwner || this.setOwner) && process.getuid
              ? process.getuid()
              : null),
          (this.processGid =
            (this.preserveOwner || this.setOwner) && process.getgid
              ? process.getgid()
              : null),
          (this.forceChown = t.forceChown === !0),
          (this.win32 = !!t.win32 || Ka),
          (this.newer = !!t.newer),
          (this.keep = !!t.keep),
          (this.noMtime = !!t.noMtime),
          (this.preservePaths = !!t.preservePaths),
          (this.unlink = !!t.unlink),
          (this.cwd = Tt(Pr.resolve(t.cwd || process.cwd()))),
          (this.strip = +t.strip || 0),
          (this.processUmask = t.noChmod ? 0 : process.umask()),
          (this.umask =
            typeof t.umask == "number" ? t.umask : this.processUmask),
          (this.dmode = t.dmode || 511 & ~this.umask),
          (this.fmode = t.fmode || 438 & ~this.umask),
          this.on("entry", (r) => this[LE](r));
      }
      warn(t, r, i = {}) {
        return (
          (t === "TAR_BAD_ARCHIVE" || t === "TAR_ABORT") &&
            (i.recoverable = !1),
          super.warn(t, r, i)
        );
      }
      [$p]() {
        this[zp] &&
          this[tf] === 0 &&
          (this.emit("prefinish"), this.emit("finish"), this.emit("end"));
      }
      [jE](t) {
        if (this.strip) {
          let r = Tt(t.path).split("/");
          if (r.length < this.strip) return !1;
          if (((t.path = r.slice(this.strip).join("/")), t.type === "Link")) {
            let i = Tt(t.linkpath).split("/");
            if (i.length >= this.strip)
              t.linkpath = i.slice(this.strip).join("/");
            else return !1;
          }
        }
        if (!this.preservePaths) {
          let r = Tt(t.path),
            i = r.split("/");
          if (i.includes("..") || (Ka && /^[a-z]:\.\.$/i.test(i[0])))
            return (
              this.warn("TAR_ENTRY_ERROR", "path contains '..'", {
                entry: t,
                path: r,
              }),
              !1
            );
          let [n, s] = Vq(r);
          n &&
            ((t.path = s),
            this.warn("TAR_ENTRY_INFO", `stripping ${n} from absolute path`, {
              entry: t,
              path: r,
            }));
        }
        if (
          (Pr.isAbsolute(t.path)
            ? (t.absolute = Tt(Pr.resolve(t.path)))
            : (t.absolute = Tt(Pr.resolve(this.cwd, t.path))),
          !this.preservePaths &&
            t.absolute.indexOf(this.cwd + "/") !== 0 &&
            t.absolute !== this.cwd)
        )
          return (
            this.warn("TAR_ENTRY_ERROR", "path escaped extraction target", {
              entry: t,
              path: Tt(t.path),
              resolvedPath: t.absolute,
              cwd: this.cwd,
            }),
            !1
          );
        if (
          t.absolute === this.cwd &&
          t.type !== "Directory" &&
          t.type !== "GNUDumpDir"
        )
          return !1;
        if (this.win32) {
          let { root: r } = Pr.win32.parse(t.absolute);
          t.absolute = r + ME.encode(t.absolute.slice(r.length));
          let { root: i } = Pr.win32.parse(t.path);
          t.path = i + ME.encode(t.path.slice(i.length));
        }
        return !0;
      }
      [LE](t) {
        if (!this[jE](t)) return t.resume();
        switch ((Wq.equal(typeof t.absolute, "string"), t.type)) {
          case "Directory":
          case "GNUDumpDir":
            t.mode && (t.mode = t.mode | 448);
          case "File":
          case "OldFile":
          case "ContiguousFile":
          case "Link":
          case "SymbolicLink":
            return this[Wp](t);
          case "CharacterDevice":
          case "BlockDevice":
          case "FIFO":
          default:
            return this[kE](t);
        }
      }
      [nt](t, r) {
        t.name === "CwdError"
          ? this.emit("error", t)
          : (this.warn("TAR_ENTRY_ERROR", t, { entry: r }),
            this[Ss](),
            r.resume());
      }
      [vi](t, r, i) {
        WE(
          Tt(t),
          {
            uid: this.uid,
            gid: this.gid,
            processUid: this.processUid,
            processGid: this.processGid,
            umask: this.processUmask,
            preserve: this.preservePaths,
            unlink: this.unlink,
            cache: this.dirCache,
            cwd: this.cwd,
            mode: r,
            noChmod: this.noChmod,
          },
          i,
        );
      }
      [Ya](t) {
        return (
          this.forceChown ||
          (this.preserveOwner &&
            ((typeof t.uid == "number" && t.uid !== this.processUid) ||
              (typeof t.gid == "number" && t.gid !== this.processGid))) ||
          (typeof this.uid == "number" && this.uid !== this.processUid) ||
          (typeof this.gid == "number" && this.gid !== this.processGid)
        );
      }
      [Va](t) {
        return zE(this.uid, t.uid, this.processUid);
      }
      [Xa](t) {
        return zE(this.gid, t.gid, this.processGid);
      }
      [Hp](t, r) {
        let i = t.mode & 4095 || this.fmode,
          n = new Hq.WriteStream(t.absolute, {
            flags: HE(t.size),
            mode: i,
            autoClose: !1,
          });
        n.on("error", (u) => {
          n.fd && he.close(n.fd, () => {}),
            (n.write = () => !0),
            this[nt](u, t),
            r();
        });
        let s = 1,
          a = (u) => {
            if (u) {
              n.fd && he.close(n.fd, () => {}), this[nt](u, t), r();
              return;
            }
            --s === 0 &&
              he.close(n.fd, (l) => {
                l ? this[nt](l, t) : this[Ss](), r();
              });
          };
        n.on("finish", (u) => {
          let l = t.absolute,
            f = n.fd;
          if (t.mtime && !this.noMtime) {
            s++;
            let h = t.atime || new Date(),
              c = t.mtime;
            he.futimes(f, h, c, (d) =>
              d ? he.utimes(l, h, c, (g) => a(g && d)) : a(),
            );
          }
          if (this[Ya](t)) {
            s++;
            let h = this[Va](t),
              c = this[Xa](t);
            he.fchown(f, h, c, (d) =>
              d ? he.chown(l, h, c, (g) => a(g && d)) : a(),
            );
          }
          a();
        });
        let o = (this.transform && this.transform(t)) || t;
        o !== t &&
          (o.on("error", (u) => {
            this[nt](u, t), r();
          }),
          t.pipe(o)),
          o.pipe(n);
      }
      [Yp](t, r) {
        let i = t.mode & 4095 || this.dmode;
        this[vi](t.absolute, i, (n) => {
          if (n) {
            this[nt](n, t), r();
            return;
          }
          let s = 1,
            a = (o) => {
              --s === 0 && (r(), this[Ss](), t.resume());
            };
          t.mtime &&
            !this.noMtime &&
            (s++, he.utimes(t.absolute, t.atime || new Date(), t.mtime, a)),
            this[Ya](t) &&
              (s++, he.chown(t.absolute, this[Va](t), this[Xa](t), a)),
            a();
        });
      }
      [kE](t) {
        (t.unsupported = !0),
          this.warn(
            "TAR_ENTRY_UNSUPPORTED",
            `unsupported entry type: ${t.type}`,
            { entry: t },
          ),
          t.resume();
      }
      [PE](t, r) {
        this[sf](t, t.linkpath, "symlink", r);
      }
      [BE](t, r) {
        let i = Tt(Pr.resolve(this.cwd, t.linkpath));
        this[sf](t, i, "link", r);
      }
      [UE]() {
        this[tf]++;
      }
      [Ss]() {
        this[tf]--, this[$p]();
      }
      [Vp](t) {
        this[Ss](), t.resume();
      }
      [Gp](t, r) {
        return (
          t.type === "File" && !this.unlink && r.isFile() && r.nlink <= 1 && !Ka
        );
      }
      [Wp](t) {
        this[UE]();
        let r = [t.path];
        t.linkpath && r.push(t.linkpath),
          this.reservations.reserve(r, (i) => this[qE](t, i));
      }
      [nf](t) {
        t.type === "SymbolicLink"
          ? t8(this.dirCache)
          : t.type !== "Directory" && e8(this.dirCache, t.absolute);
      }
      [qE](t, r) {
        this[nf](t);
        let i = (o) => {
            this[nf](t), r(o);
          },
          n = () => {
            this[vi](this.cwd, this.dmode, (o) => {
              if (o) {
                this[nt](o, t), i();
                return;
              }
              (this[Za] = !0), s();
            });
          },
          s = () => {
            if (t.absolute !== this.cwd) {
              let o = Tt(Pr.dirname(t.absolute));
              if (o !== this.cwd)
                return this[vi](o, this.dmode, (u) => {
                  if (u) {
                    this[nt](u, t), i();
                    return;
                  }
                  a();
                });
            }
            a();
          },
          a = () => {
            he.lstat(t.absolute, (o, u) => {
              if (u && (this.keep || (this.newer && u.mtime > t.mtime))) {
                this[Vp](t), i();
                return;
              }
              if (o || this[Gp](t, u)) return this[Gt](null, t, i);
              if (u.isDirectory()) {
                if (t.type === "Directory") {
                  let l = !this.noChmod && t.mode && (u.mode & 4095) !== t.mode,
                    f = (h) => this[Gt](h, t, i);
                  return l ? he.chmod(t.absolute, t.mode, f) : f();
                }
                if (t.absolute !== this.cwd)
                  return he.rmdir(t.absolute, (l) => this[Gt](l, t, i));
              }
              if (t.absolute === this.cwd) return this[Gt](null, t, i);
              Qq(t.absolute, (l) => this[Gt](l, t, i));
            });
          };
        this[Za] ? s() : n();
      }
      [Gt](t, r, i) {
        if (t) {
          this[nt](t, r), i();
          return;
        }
        switch (r.type) {
          case "File":
          case "OldFile":
          case "ContiguousFile":
            return this[Hp](r, i);
          case "Link":
            return this[BE](r, i);
          case "SymbolicLink":
            return this[PE](r, i);
          case "Directory":
          case "GNUDumpDir":
            return this[Yp](r, i);
        }
      }
      [sf](t, r, i, n) {
        he[i](r, t.absolute, (s) => {
          s ? this[nt](s, t) : (this[Ss](), t.resume()), n();
        });
      }
    },
    rf = (e) => {
      try {
        return [null, e()];
      } catch (t) {
        return [t, null];
      }
    },
    Xp = class extends Qa {
      [Gt](t, r) {
        return super[Gt](t, r, () => {});
      }
      [Wp](t) {
        if ((this[nf](t), !this[Za])) {
          let s = this[vi](this.cwd, this.dmode);
          if (s) return this[nt](s, t);
          this[Za] = !0;
        }
        if (t.absolute !== this.cwd) {
          let s = Tt(Pr.dirname(t.absolute));
          if (s !== this.cwd) {
            let a = this[vi](s, this.dmode);
            if (a) return this[nt](a, t);
          }
        }
        let [r, i] = rf(() => he.lstatSync(t.absolute));
        if (i && (this.keep || (this.newer && i.mtime > t.mtime)))
          return this[Vp](t);
        if (r || this[Gp](t, i)) return this[Gt](null, t);
        if (i.isDirectory()) {
          if (t.type === "Directory") {
            let a = !this.noChmod && t.mode && (i.mode & 4095) !== t.mode,
              [o] = a
                ? rf(() => {
                    he.chmodSync(t.absolute, t.mode);
                  })
                : [];
            return this[Gt](o, t);
          }
          let [s] = rf(() => he.rmdirSync(t.absolute));
          this[Gt](s, t);
        }
        let [n] = t.absolute === this.cwd ? [] : rf(() => Jq(t.absolute));
        this[Gt](n, t);
      }
      [Hp](t, r) {
        let i = t.mode & 4095 || this.fmode,
          n = (o) => {
            let u;
            try {
              he.closeSync(s);
            } catch (l) {
              u = l;
            }
            (o || u) && this[nt](o || u, t), r();
          },
          s;
        try {
          s = he.openSync(t.absolute, HE(t.size), i);
        } catch (o) {
          return n(o);
        }
        let a = (this.transform && this.transform(t)) || t;
        a !== t && (a.on("error", (o) => this[nt](o, t)), t.pipe(a)),
          a.on("data", (o) => {
            try {
              he.writeSync(s, o, 0, o.length);
            } catch (u) {
              n(u);
            }
          }),
          a.on("end", (o) => {
            let u = null;
            if (t.mtime && !this.noMtime) {
              let l = t.atime || new Date(),
                f = t.mtime;
              try {
                he.futimesSync(s, l, f);
              } catch (h) {
                try {
                  he.utimesSync(t.absolute, l, f);
                } catch {
                  u = h;
                }
              }
            }
            if (this[Ya](t)) {
              let l = this[Va](t),
                f = this[Xa](t);
              try {
                he.fchownSync(s, l, f);
              } catch (h) {
                try {
                  he.chownSync(t.absolute, l, f);
                } catch {
                  u = u || h;
                }
              }
            }
            n(u);
          });
      }
      [Yp](t, r) {
        let i = t.mode & 4095 || this.dmode,
          n = this[vi](t.absolute, i);
        if (n) {
          this[nt](n, t), r();
          return;
        }
        if (t.mtime && !this.noMtime)
          try {
            he.utimesSync(t.absolute, t.atime || new Date(), t.mtime);
          } catch {}
        if (this[Ya](t))
          try {
            he.chownSync(t.absolute, this[Va](t), this[Xa](t));
          } catch {}
        r(), t.resume();
      }
      [vi](t, r) {
        try {
          return WE.sync(Tt(t), {
            uid: this.uid,
            gid: this.gid,
            processUid: this.processUid,
            processGid: this.processGid,
            umask: this.processUmask,
            preserve: this.preservePaths,
            unlink: this.unlink,
            cache: this.dirCache,
            cwd: this.cwd,
            mode: r,
          });
        } catch (i) {
          return i;
        }
      }
      [sf](t, r, i, n) {
        try {
          he[i + "Sync"](r, t.absolute), n(), t.resume();
        } catch (s) {
          return this[nt](s, t);
        }
      }
    };
  Qa.Sync = Xp;
  YE.exports = Qa;
});
var QE = y((nK, KE) => {
  "use strict";
  var r8 = rs(),
    af = Zp(),
    XE = require("fs"),
    ZE = ws(),
    VE = require("path"),
    Kp = fs();
  KE.exports = (e, t, r) => {
    typeof e == "function"
      ? ((r = e), (t = null), (e = {}))
      : Array.isArray(e) && ((t = e), (e = {})),
      typeof t == "function" && ((r = t), (t = null)),
      t ? (t = Array.from(t)) : (t = []);
    let i = r8(e);
    if (i.sync && typeof r == "function")
      throw new TypeError("callback not supported for sync tar functions");
    if (!i.file && typeof r == "function")
      throw new TypeError("callback only supported with file option");
    return (
      t.length && i8(i, t),
      i.file && i.sync ? n8(i) : i.file ? s8(i, r) : i.sync ? a8(i) : o8(i)
    );
  };
  var i8 = (e, t) => {
      let r = new Map(t.map((s) => [Kp(s), !0])),
        i = e.filter,
        n = (s, a) => {
          let o = a || VE.parse(s).root || ".",
            u = s === o ? !1 : r.has(s) ? r.get(s) : n(VE.dirname(s), o);
          return r.set(s, u), u;
        };
      e.filter = i ? (s, a) => i(s, a) && n(Kp(s)) : (s) => n(Kp(s));
    },
    n8 = (e) => {
      let t = new af.Sync(e),
        r = e.file,
        i = XE.statSync(r),
        n = e.maxReadSize || 16 * 1024 * 1024;
      new ZE.ReadStreamSync(r, { readSize: n, size: i.size }).pipe(t);
    },
    s8 = (e, t) => {
      let r = new af(e),
        i = e.maxReadSize || 16 * 1024 * 1024,
        n = e.file,
        s = new Promise((a, o) => {
          r.on("error", o),
            r.on("close", a),
            XE.stat(n, (u, l) => {
              if (u) o(u);
              else {
                let f = new ZE.ReadStream(n, { readSize: i, size: l.size });
                f.on("error", o), f.pipe(r);
              }
            });
        });
      return t ? s.then(t, t) : s;
    },
    a8 = (e) => new af.Sync(e),
    o8 = (e) => new af(e);
});
var JE = y((ke) => {
  "use strict";
  ke.c = ke.create = Mb();
  ke.r = ke.replace = Np();
  ke.t = ke.list = Yl();
  ke.u = ke.update = $b();
  ke.x = ke.extract = QE();
  ke.Pack = Nl();
  ke.Unpack = Zp();
  ke.Parse = Hl();
  ke.ReadEntry = ml();
  ke.WriteEntry = ap();
  ke.Header = ls();
  ke.Pax = yl();
  ke.types = zd();
});
var n_ = y((oK, i_) => {
  var Jp = class {
    constructor(t, r, i) {
      (this.etaBufferLength = t || 100),
        (this.valueBuffer = [i]),
        (this.timeBuffer = [r]),
        (this.eta = "0");
    }
    update(t, r, i) {
      this.valueBuffer.push(r), this.timeBuffer.push(t), this.calculate(i - r);
    }
    getTime() {
      return this.eta;
    }
    calculate(t) {
      let r = this.valueBuffer.length,
        i = Math.min(this.etaBufferLength, r),
        n = this.valueBuffer[r - 1] - this.valueBuffer[r - i],
        s = this.timeBuffer[r - 1] - this.timeBuffer[r - i],
        a = n / s;
      (this.valueBuffer = this.valueBuffer.slice(-this.etaBufferLength)),
        (this.timeBuffer = this.timeBuffer.slice(-this.etaBufferLength));
      let o = Math.ceil(t / a / 1e3);
      isNaN(o)
        ? (this.eta = "NULL")
        : isFinite(o)
        ? o > 1e7
          ? (this.eta = "INF")
          : o < 0
          ? (this.eta = 0)
          : (this.eta = o)
        : (this.eta = "INF");
    }
  };
  i_.exports = Jp;
});
var tm = y((uK, s_) => {
  var hn = require("readline"),
    em = class {
      constructor(t) {
        (this.stream = t), (this.linewrap = !0), (this.dy = 0);
      }
      cursorSave() {
        !this.stream.isTTY || this.stream.write("\x1B7");
      }
      cursorRestore() {
        !this.stream.isTTY || this.stream.write("\x1B8");
      }
      cursor(t) {
        !this.stream.isTTY ||
          (t ? this.stream.write("\x1B[?25h") : this.stream.write("\x1B[?25l"));
      }
      cursorTo(t = null, r = null) {
        !this.stream.isTTY || hn.cursorTo(this.stream, t, r);
      }
      cursorRelative(t = null, r = null) {
        !this.stream.isTTY ||
          ((this.dy = this.dy + r), hn.moveCursor(this.stream, t, r));
      }
      cursorRelativeReset() {
        !this.stream.isTTY ||
          (hn.moveCursor(this.stream, 0, -this.dy),
          hn.cursorTo(this.stream, 0, null),
          (this.dy = 0));
      }
      clearRight() {
        !this.stream.isTTY || hn.clearLine(this.stream, 1);
      }
      clearLine() {
        !this.stream.isTTY || hn.clearLine(this.stream, 0);
      }
      clearBottom() {
        !this.stream.isTTY || hn.clearScreenDown(this.stream);
      }
      newline() {
        this.stream.write(`
`),
          this.dy++;
      }
      write(t, r = !1) {
        this.linewrap === !0 && r === !1
          ? this.stream.write(t.substr(0, this.getWidth()))
          : this.stream.write(t);
      }
      lineWrapping(t) {
        !this.stream.isTTY ||
          ((this.linewrap = t),
          t ? this.stream.write("\x1B[?7h") : this.stream.write("\x1B[?7l"));
      }
      isTTY() {
        return this.stream.isTTY === !0;
      }
      getWidth() {
        return this.stream.columns || (this.stream.isTTY ? 80 : 200);
      }
    };
  s_.exports = em;
});
var o_ = y((lK, a_) => {
  "use strict";
  a_.exports = ({ onlyFirst: e = !1 } = {}) => {
    let t = [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
    ].join("|");
    return new RegExp(t, e ? void 0 : "g");
  };
});
var l_ = y((fK, u_) => {
  "use strict";
  var u8 = o_();
  u_.exports = (e) => (typeof e == "string" ? e.replace(u8(), "") : e);
});
var h_ = y((hK, rm) => {
  "use strict";
  var f_ = (e) =>
    Number.isNaN(e)
      ? !1
      : e >= 4352 &&
        (e <= 4447 ||
          e === 9001 ||
          e === 9002 ||
          (11904 <= e && e <= 12871 && e !== 12351) ||
          (12880 <= e && e <= 19903) ||
          (19968 <= e && e <= 42182) ||
          (43360 <= e && e <= 43388) ||
          (44032 <= e && e <= 55203) ||
          (63744 <= e && e <= 64255) ||
          (65040 <= e && e <= 65049) ||
          (65072 <= e && e <= 65131) ||
          (65281 <= e && e <= 65376) ||
          (65504 <= e && e <= 65510) ||
          (110592 <= e && e <= 110593) ||
          (127488 <= e && e <= 127569) ||
          (131072 <= e && e <= 262141));
  rm.exports = f_;
  rm.exports.default = f_;
});
var d_ = y((cK, c_) => {
  "use strict";
  c_.exports = function () {
    return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
  };
});
var m_ = y((dK, im) => {
  "use strict";
  var l8 = l_(),
    f8 = h_(),
    h8 = d_(),
    p_ = (e) => {
      if (
        typeof e != "string" ||
        e.length === 0 ||
        ((e = l8(e)), e.length === 0)
      )
        return 0;
      e = e.replace(h8(), "  ");
      let t = 0;
      for (let r = 0; r < e.length; r++) {
        let i = e.codePointAt(r);
        i <= 31 ||
          (i >= 127 && i <= 159) ||
          (i >= 768 && i <= 879) ||
          (i > 65535 && r++, (t += f8(i) ? 2 : 1));
      }
      return t;
    };
  im.exports = p_;
  im.exports.default = p_;
});
var nm = y((pK, g_) => {
  g_.exports = function (t, r, i) {
    if (r.autopadding !== !0) return t;
    function n(s, a) {
      return (r.autopaddingChar + s).slice(-a);
    }
    switch (i) {
      case "percentage":
        return n(t, 3);
      default:
        return t;
    }
  };
});
var sm = y((mK, y_) => {
  y_.exports = function (t, r) {
    let i = Math.round(t * r.barsize),
      n = r.barsize - i;
    return (
      r.barCompleteString.substr(0, i) +
      r.barGlue +
      r.barIncompleteString.substr(0, n)
    );
  };
});
var am = y((gK, v_) => {
  v_.exports = function (t, r, i) {
    function n(a) {
      return i ? i * Math.round(a / i) : a;
    }
    function s(a) {
      return (r.autopaddingChar + a).slice(-2);
    }
    return t > 3600
      ? s(Math.floor(t / 3600)) + "h" + s(n((t % 3600) / 60)) + "m"
      : t > 60
      ? s(Math.floor(t / 60)) + "m" + s(n(t % 60)) + "s"
      : t > 10
      ? s(n(t)) + "s"
      : s(t) + "s";
  };
});
var om = y((yK, w_) => {
  var c8 = m_(),
    d8 = nm(),
    p8 = sm(),
    m8 = am();
  w_.exports = function (t, r, i) {
    let n = t.format,
      s = t.formatTime || m8,
      a = t.formatValue || d8,
      o = t.formatBar || p8,
      u = Math.floor(r.progress * 100) + "",
      l = r.stopTime || Date.now(),
      f = Math.round((l - r.startTime) / 1e3),
      h = Object.assign({}, i, {
        bar: o(r.progress, t),
        percentage: a(u, t, "percentage"),
        total: a(r.total, t, "total"),
        value: a(r.value, t, "value"),
        eta: a(r.eta, t, "eta"),
        eta_formatted: s(r.eta, t, 5),
        duration: a(f, t, "duration"),
        duration_formatted: s(f, t, 1),
      });
    n = n.replace(/\{(\w+)\}/g, function (g, C) {
      return typeof h[C] < "u" ? h[C] : g;
    });
    let c = Math.max(0, r.maxWidth - c8(n) - 2),
      d = Math.floor(c / 2);
    switch (t.align) {
      case "right":
        n = c > 0 ? " ".repeat(c) + n : n;
        break;
      case "center":
        n = d > 0 ? " ".repeat(d) + n : n;
        break;
      case "left":
      default:
        break;
    }
    return n;
  };
});
var um = y((wK, b_) => {
  var D_ = n_(),
    g8 = tm(),
    y8 = om(),
    v8 = require("events");
  b_.exports = class extends v8 {
    constructor(t) {
      super(),
        (this.options = t),
        (this.terminal = this.options.terminal
          ? this.options.terminal
          : new g8(this.options.stream)),
        (this.value = 0),
        (this.startValue = 0),
        (this.total = 100),
        (this.lastDrawnString = null),
        (this.startTime = null),
        (this.stopTime = null),
        (this.lastRedraw = Date.now()),
        (this.eta = new D_(this.options.etaBufferLength, 0, 0)),
        (this.payload = {}),
        (this.isActive = !1),
        (this.formatter =
          typeof this.options.format == "function" ? this.options.format : y8);
    }
    render(t = !1) {
      let r = {
        progress: this.getProgress(),
        eta: this.eta.getTime(),
        startTime: this.startTime,
        stopTime: this.stopTime,
        total: this.total,
        value: this.value,
        maxWidth: this.terminal.getWidth(),
      };
      this.options.etaAsynchronousUpdate && this.updateETA();
      let i = this.formatter(this.options, r, this.payload);
      (t ||
        this.options.forceRedraw ||
        (this.options.noTTYOutput && !this.terminal.isTTY()) ||
        this.lastDrawnString != i) &&
        (this.emit("redraw-pre"),
        this.terminal.cursorTo(0, null),
        this.terminal.write(i),
        this.terminal.clearRight(),
        (this.lastDrawnString = i),
        (this.lastRedraw = Date.now()),
        this.emit("redraw-post"));
    }
    start(t, r, i) {
      (this.value = r || 0),
        (this.total = typeof t < "u" && t >= 0 ? t : 100),
        (this.startValue = r || 0),
        (this.payload = i || {}),
        (this.startTime = Date.now()),
        (this.stopTime = null),
        (this.lastDrawnString = ""),
        (this.eta = new D_(
          this.options.etaBufferLength,
          this.startTime,
          this.value,
        )),
        (this.isActive = !0),
        this.emit("start", t, r);
    }
    stop() {
      (this.isActive = !1),
        (this.stopTime = Date.now()),
        this.emit("stop", this.total, this.value);
    }
    update(t, r = {}) {
      typeof t == "number" &&
        ((this.value = t), this.eta.update(Date.now(), t, this.total));
      let i = (typeof t == "object" ? t : r) || {};
      this.emit("update", this.total, this.value);
      for (let n in i) this.payload[n] = i[n];
      this.value >= this.getTotal() &&
        this.options.stopOnComplete &&
        this.stop();
    }
    getProgress() {
      let t = this.value / this.total;
      return (
        this.options.progressCalculationRelative &&
          (t = (this.value - this.startValue) / (this.total - this.startValue)),
        isNaN(t) && (t = this.options && this.options.emptyOnZero ? 0 : 1),
        (t = Math.min(Math.max(t, 0), 1)),
        t
      );
    }
    increment(t = 1, r = {}) {
      typeof t == "object"
        ? this.update(this.value + 1, t)
        : this.update(this.value + t, r);
    }
    getTotal() {
      return this.total;
    }
    setTotal(t) {
      typeof t < "u" && t >= 0 && (this.total = t);
    }
    updateETA() {
      this.eta.update(Date.now(), this.value, this.total);
    }
  };
});
var lm = y((DK, E_) => {
  function Ee(e, t) {
    return typeof e > "u" || e === null ? t : e;
  }
  E_.exports = {
    parse: function (t, r) {
      let i = {},
        n = Object.assign({}, r, t);
      return (
        (i.throttleTime = 1e3 / Ee(n.fps, 10)),
        (i.stream = Ee(n.stream, process.stderr)),
        (i.terminal = Ee(n.terminal, null)),
        (i.clearOnComplete = Ee(n.clearOnComplete, !1)),
        (i.stopOnComplete = Ee(n.stopOnComplete, !1)),
        (i.barsize = Ee(n.barsize, 40)),
        (i.align = Ee(n.align, "left")),
        (i.hideCursor = Ee(n.hideCursor, !1)),
        (i.linewrap = Ee(n.linewrap, !1)),
        (i.barCompleteString = new Array(i.barsize + 1).join(
          n.barCompleteChar || "=",
        )),
        (i.barIncompleteString = new Array(i.barsize + 1).join(
          n.barIncompleteChar || "-",
        )),
        (i.barGlue = Ee(n.barGlue, "")),
        (i.format = Ee(
          n.format,
          "progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
        )),
        (i.formatTime = Ee(n.formatTime, null)),
        (i.formatValue = Ee(n.formatValue, null)),
        (i.formatBar = Ee(n.formatBar, null)),
        (i.etaBufferLength = Ee(n.etaBuffer, 10)),
        (i.etaAsynchronousUpdate = Ee(n.etaAsynchronousUpdate, !1)),
        (i.progressCalculationRelative = Ee(n.progressCalculationRelative, !1)),
        (i.synchronousUpdate = Ee(n.synchronousUpdate, !0)),
        (i.noTTYOutput = Ee(n.noTTYOutput, !1)),
        (i.notTTYSchedule = Ee(n.notTTYSchedule, 2e3)),
        (i.emptyOnZero = Ee(n.emptyOnZero, !1)),
        (i.forceRedraw = Ee(n.forceRedraw, !1)),
        (i.autopadding = Ee(n.autopadding, !1)),
        (i.autopaddingChar = i.autopadding ? Ee(n.autopaddingChar, "   ") : ""),
        (i.gracefulExit = Ee(n.gracefulExit, !1)),
        i
      );
    },
  };
});
var S_ = y((EK, __) => {
  var w8 = um(),
    D8 = lm();
  __.exports = class extends w8 {
    constructor(t, r) {
      super(D8.parse(t, r)),
        (this.timer = null),
        this.options.noTTYOutput &&
          this.terminal.isTTY() === !1 &&
          (this.options.synchronousUpdate = !1),
        (this.schedulingRate = this.terminal.isTTY()
          ? this.options.throttleTime
          : this.options.notTTYSchedule),
        (this.sigintCallback = null);
    }
    render() {
      this.timer && (clearTimeout(this.timer), (this.timer = null)),
        super.render(),
        this.options.noTTYOutput &&
          this.terminal.isTTY() === !1 &&
          this.terminal.newline(),
        (this.timer = setTimeout(this.render.bind(this), this.schedulingRate));
    }
    update(t, r) {
      !this.timer ||
        (super.update(t, r),
        this.options.synchronousUpdate &&
          this.lastRedraw + this.options.throttleTime * 2 < Date.now() &&
          this.render());
    }
    start(t, r, i) {
      (this.options.noTTYOutput === !1 && this.terminal.isTTY() === !1) ||
        (this.sigintCallback === null &&
          this.options.gracefulExit &&
          ((this.sigintCallback = this.stop.bind(this)),
          process.once("SIGINT", this.sigintCallback),
          process.once("SIGTERM", this.sigintCallback)),
        this.terminal.cursorSave(),
        this.options.hideCursor === !0 && this.terminal.cursor(!1),
        this.options.linewrap === !1 && this.terminal.lineWrapping(!1),
        super.start(t, r, i),
        this.render());
    }
    stop() {
      !this.timer ||
        (this.sigintCallback &&
          (process.removeListener("SIGINT", this.sigintCallback),
          process.removeListener("SIGTERM", this.sigintCallback),
          (this.sigintCallback = null)),
        this.render(),
        super.stop(),
        clearTimeout(this.timer),
        (this.timer = null),
        this.options.hideCursor === !0 && this.terminal.cursor(!0),
        this.options.linewrap === !1 && this.terminal.lineWrapping(!0),
        this.terminal.cursorRestore(),
        this.options.clearOnComplete
          ? (this.terminal.cursorTo(0, null), this.terminal.clearLine())
          : this.terminal.newline());
    }
  };
});
var C_ = y((SK, x_) => {
  var b8 = tm(),
    E8 = um(),
    _8 = lm(),
    S8 = require("events");
  x_.exports = class extends S8 {
    constructor(t, r) {
      super(),
        (this.bars = []),
        (this.options = _8.parse(t, r)),
        (this.options.synchronousUpdate = !1),
        (this.terminal = this.options.terminal
          ? this.options.terminal
          : new b8(this.options.stream)),
        (this.timer = null),
        (this.isActive = !1),
        (this.schedulingRate = this.terminal.isTTY()
          ? this.options.throttleTime
          : this.options.notTTYSchedule),
        (this.loggingBuffer = []),
        (this.sigintCallback = null);
    }
    create(t, r, i, n = {}) {
      let s = new E8(Object.assign({}, this.options, n));
      return (
        this.bars.push(s),
        (this.options.noTTYOutput === !1 && this.terminal.isTTY() === !1) ||
          (this.sigintCallback === null &&
            this.options.gracefulExit &&
            ((this.sigintCallback = this.stop.bind(this)),
            process.once("SIGINT", this.sigintCallback),
            process.once("SIGTERM", this.sigintCallback)),
          this.isActive ||
            (this.options.hideCursor === !0 && this.terminal.cursor(!1),
            this.options.linewrap === !1 && this.terminal.lineWrapping(!1),
            (this.timer = setTimeout(
              this.update.bind(this),
              this.schedulingRate,
            ))),
          (this.isActive = !0),
          s.start(t, r, i),
          this.emit("start")),
        s
      );
    }
    remove(t) {
      let r = this.bars.indexOf(t);
      return r < 0
        ? !1
        : (this.bars.splice(r, 1),
          this.update(),
          this.terminal.newline(),
          this.terminal.clearBottom(),
          !0);
    }
    update() {
      if (
        (this.timer && (clearTimeout(this.timer), (this.timer = null)),
        this.emit("update-pre"),
        this.terminal.cursorRelativeReset(),
        this.emit("redraw-pre"),
        this.loggingBuffer.length > 0)
      )
        for (this.terminal.clearLine(); this.loggingBuffer.length > 0; )
          this.terminal.write(this.loggingBuffer.shift(), !0);
      for (let t = 0; t < this.bars.length; t++)
        t > 0 && this.terminal.newline(), this.bars[t].render();
      this.emit("redraw-post"),
        this.options.noTTYOutput &&
          this.terminal.isTTY() === !1 &&
          (this.terminal.newline(), this.terminal.newline()),
        (this.timer = setTimeout(this.update.bind(this), this.schedulingRate)),
        this.emit("update-post"),
        this.options.stopOnComplete &&
          !this.bars.find((t) => t.isActive) &&
          this.stop();
    }
    stop() {
      if (
        (clearTimeout(this.timer),
        (this.timer = null),
        this.sigintCallback &&
          (process.removeListener("SIGINT", this.sigintCallback),
          process.removeListener("SIGTERM", this.sigintCallback),
          (this.sigintCallback = null)),
        (this.isActive = !1),
        this.options.hideCursor === !0 && this.terminal.cursor(!0),
        this.options.linewrap === !1 && this.terminal.lineWrapping(!0),
        this.terminal.cursorRelativeReset(),
        this.emit("stop-pre-clear"),
        this.options.clearOnComplete)
      )
        this.terminal.clearBottom();
      else {
        for (let t = 0; t < this.bars.length; t++)
          t > 0 && this.terminal.newline(),
            this.bars[t].render(),
            this.bars[t].stop();
        this.terminal.newline();
      }
      this.emit("stop");
    }
    log(t) {
      this.loggingBuffer.push(t);
    }
  };
});
var T_ = y((xK, O_) => {
  O_.exports = {
    format: "progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
    barCompleteChar: "=",
    barIncompleteChar: "-",
  };
});
var R_ = y((CK, F_) => {
  F_.exports = {
    format: " {bar} {percentage}% | ETA: {eta}s | {value}/{total}",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
  };
});
var N_ = y((OK, A_) => {
  A_.exports = {
    format:
      " \x1B[90m{bar}\x1B[0m {percentage}% | ETA: {eta}s | {value}/{total}",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
  };
});
var M_ = y((TK, I_) => {
  I_.exports = {
    format: " {bar}\u25A0 {percentage}% | ETA: {eta}s | {value}/{total}",
    barCompleteChar: "\u25A0",
    barIncompleteChar: " ",
  };
});
var q_ = y((FK, L_) => {
  var x8 = T_(),
    C8 = R_(),
    O8 = N_(),
    T8 = M_();
  L_.exports = { legacy: x8, shades_classic: C8, shades_grey: O8, rect: T8 };
});
var k_ = y((RK, B_) => {
  var P_ = S_(),
    F8 = C_(),
    R8 = q_(),
    A8 = om(),
    N8 = nm(),
    I8 = sm(),
    M8 = am();
  B_.exports = {
    Bar: P_,
    SingleBar: P_,
    MultiBar: F8,
    Presets: R8,
    Format: { Formatter: A8, BarFormat: I8, ValueFormat: N8, TimeFormat: M8 },
  };
});
var wt = y((NK, z_) => {
  "use strict";
  var Ja = class extends Error {
    constructor(t) {
      super(`Format functions must be synchronous taking a two arguments: (info, opts)
Found: ${
        t.toString().split(`
`)[0]
      }
`),
        Error.captureStackTrace(this, Ja);
    }
  };
  z_.exports = (e) => {
    if (e.length > 2) throw new Ja(e);
    function t(i = {}) {
      this.options = i;
    }
    t.prototype.transform = e;
    function r(i) {
      return new t(i);
    }
    return (r.Format = t), r;
  };
});
var H_ = y((IK, G_) => {
  var W_ = {};
  G_.exports = W_;
  var $_ = {
    reset: [0, 0],
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    gray: [90, 39],
    grey: [90, 39],
    brightRed: [91, 39],
    brightGreen: [92, 39],
    brightYellow: [93, 39],
    brightBlue: [94, 39],
    brightMagenta: [95, 39],
    brightCyan: [96, 39],
    brightWhite: [97, 39],
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    bgGray: [100, 49],
    bgGrey: [100, 49],
    bgBrightRed: [101, 49],
    bgBrightGreen: [102, 49],
    bgBrightYellow: [103, 49],
    bgBrightBlue: [104, 49],
    bgBrightMagenta: [105, 49],
    bgBrightCyan: [106, 49],
    bgBrightWhite: [107, 49],
    blackBG: [40, 49],
    redBG: [41, 49],
    greenBG: [42, 49],
    yellowBG: [43, 49],
    blueBG: [44, 49],
    magentaBG: [45, 49],
    cyanBG: [46, 49],
    whiteBG: [47, 49],
  };
  Object.keys($_).forEach(function (e) {
    var t = $_[e],
      r = (W_[e] = []);
    (r.open = "\x1B[" + t[0] + "m"), (r.close = "\x1B[" + t[1] + "m");
  });
});
var V_ = y((MK, Y_) => {
  "use strict";
  Y_.exports = function (e, t) {
    t = t || process.argv;
    var r = t.indexOf("--"),
      i = /^-{1,2}/.test(e) ? "" : "--",
      n = t.indexOf(i + e);
    return n !== -1 && (r === -1 ? !0 : n < r);
  };
});
var Z_ = y((LK, X_) => {
  "use strict";
  var L8 = require("os"),
    er = V_(),
    ct = process.env,
    xs = void 0;
  er("no-color") || er("no-colors") || er("color=false")
    ? (xs = !1)
    : (er("color") || er("colors") || er("color=true") || er("color=always")) &&
      (xs = !0);
  "FORCE_COLOR" in ct &&
    (xs = ct.FORCE_COLOR.length === 0 || parseInt(ct.FORCE_COLOR, 10) !== 0);
  function q8(e) {
    return e === 0
      ? !1
      : { level: e, hasBasic: !0, has256: e >= 2, has16m: e >= 3 };
  }
  function P8(e) {
    if (xs === !1) return 0;
    if (er("color=16m") || er("color=full") || er("color=truecolor")) return 3;
    if (er("color=256")) return 2;
    if (e && !e.isTTY && xs !== !0) return 0;
    var t = xs ? 1 : 0;
    if (process.platform === "win32") {
      var r = L8.release().split(".");
      return Number(process.versions.node.split(".")[0]) >= 8 &&
        Number(r[0]) >= 10 &&
        Number(r[2]) >= 10586
        ? Number(r[2]) >= 14931
          ? 3
          : 2
        : 1;
    }
    if ("CI" in ct)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some(function (n) {
        return n in ct;
      }) || ct.CI_NAME === "codeship"
        ? 1
        : t;
    if ("TEAMCITY_VERSION" in ct)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(ct.TEAMCITY_VERSION) ? 1 : 0;
    if ("TERM_PROGRAM" in ct) {
      var i = parseInt((ct.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (ct.TERM_PROGRAM) {
        case "iTerm.app":
          return i >= 3 ? 3 : 2;
        case "Hyper":
          return 3;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(ct.TERM)
      ? 2
      : /^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(ct.TERM) ||
        "COLORTERM" in ct
      ? 1
      : (ct.TERM === "dumb", t);
  }
  function cm(e) {
    var t = P8(e);
    return q8(t);
  }
  X_.exports = {
    supportsColor: cm,
    stdout: cm(process.stdout),
    stderr: cm(process.stderr),
  };
});
var Q_ = y((qK, K_) => {
  K_.exports = function (t, r) {
    var i = "";
    (t = t || "Run the trap, drop the bass"), (t = t.split(""));
    var n = {
      a: ["@", "\u0104", "\u023A", "\u0245", "\u0394", "\u039B", "\u0414"],
      b: ["\xDF", "\u0181", "\u0243", "\u026E", "\u03B2", "\u0E3F"],
      c: ["\xA9", "\u023B", "\u03FE"],
      d: ["\xD0", "\u018A", "\u0500", "\u0501", "\u0502", "\u0503"],
      e: [
        "\xCB",
        "\u0115",
        "\u018E",
        "\u0258",
        "\u03A3",
        "\u03BE",
        "\u04BC",
        "\u0A6C",
      ],
      f: ["\u04FA"],
      g: ["\u0262"],
      h: ["\u0126", "\u0195", "\u04A2", "\u04BA", "\u04C7", "\u050A"],
      i: ["\u0F0F"],
      j: ["\u0134"],
      k: ["\u0138", "\u04A0", "\u04C3", "\u051E"],
      l: ["\u0139"],
      m: ["\u028D", "\u04CD", "\u04CE", "\u0520", "\u0521", "\u0D69"],
      n: ["\xD1", "\u014B", "\u019D", "\u0376", "\u03A0", "\u048A"],
      o: [
        "\xD8",
        "\xF5",
        "\xF8",
        "\u01FE",
        "\u0298",
        "\u047A",
        "\u05DD",
        "\u06DD",
        "\u0E4F",
      ],
      p: ["\u01F7", "\u048E"],
      q: ["\u09CD"],
      r: ["\xAE", "\u01A6", "\u0210", "\u024C", "\u0280", "\u042F"],
      s: ["\xA7", "\u03DE", "\u03DF", "\u03E8"],
      t: ["\u0141", "\u0166", "\u0373"],
      u: ["\u01B1", "\u054D"],
      v: ["\u05D8"],
      w: ["\u0428", "\u0460", "\u047C", "\u0D70"],
      x: ["\u04B2", "\u04FE", "\u04FC", "\u04FD"],
      y: ["\xA5", "\u04B0", "\u04CB"],
      z: ["\u01B5", "\u0240"],
    };
    return (
      t.forEach(function (s) {
        s = s.toLowerCase();
        var a = n[s] || [" "],
          o = Math.floor(Math.random() * a.length);
        typeof n[s] < "u" ? (i += n[s][o]) : (i += s);
      }),
      i
    );
  };
});
var e1 = y((PK, J_) => {
  J_.exports = function (t, r) {
    t = t || "   he is here   ";
    var i = {
        up: [
          "\u030D",
          "\u030E",
          "\u0304",
          "\u0305",
          "\u033F",
          "\u0311",
          "\u0306",
          "\u0310",
          "\u0352",
          "\u0357",
          "\u0351",
          "\u0307",
          "\u0308",
          "\u030A",
          "\u0342",
          "\u0313",
          "\u0308",
          "\u034A",
          "\u034B",
          "\u034C",
          "\u0303",
          "\u0302",
          "\u030C",
          "\u0350",
          "\u0300",
          "\u0301",
          "\u030B",
          "\u030F",
          "\u0312",
          "\u0313",
          "\u0314",
          "\u033D",
          "\u0309",
          "\u0363",
          "\u0364",
          "\u0365",
          "\u0366",
          "\u0367",
          "\u0368",
          "\u0369",
          "\u036A",
          "\u036B",
          "\u036C",
          "\u036D",
          "\u036E",
          "\u036F",
          "\u033E",
          "\u035B",
          "\u0346",
          "\u031A",
        ],
        down: [
          "\u0316",
          "\u0317",
          "\u0318",
          "\u0319",
          "\u031C",
          "\u031D",
          "\u031E",
          "\u031F",
          "\u0320",
          "\u0324",
          "\u0325",
          "\u0326",
          "\u0329",
          "\u032A",
          "\u032B",
          "\u032C",
          "\u032D",
          "\u032E",
          "\u032F",
          "\u0330",
          "\u0331",
          "\u0332",
          "\u0333",
          "\u0339",
          "\u033A",
          "\u033B",
          "\u033C",
          "\u0345",
          "\u0347",
          "\u0348",
          "\u0349",
          "\u034D",
          "\u034E",
          "\u0353",
          "\u0354",
          "\u0355",
          "\u0356",
          "\u0359",
          "\u035A",
          "\u0323",
        ],
        mid: [
          "\u0315",
          "\u031B",
          "\u0300",
          "\u0301",
          "\u0358",
          "\u0321",
          "\u0322",
          "\u0327",
          "\u0328",
          "\u0334",
          "\u0335",
          "\u0336",
          "\u035C",
          "\u035D",
          "\u035E",
          "\u035F",
          "\u0360",
          "\u0362",
          "\u0338",
          "\u0337",
          "\u0361",
          " \u0489",
        ],
      },
      n = [].concat(i.up, i.down, i.mid);
    function s(u) {
      var l = Math.floor(Math.random() * u);
      return l;
    }
    function a(u) {
      var l = !1;
      return (
        n.filter(function (f) {
          l = f === u;
        }),
        l
      );
    }
    function o(u, l) {
      var f = "",
        h,
        c;
      (l = l || {}),
        (l.up = typeof l.up < "u" ? l.up : !0),
        (l.mid = typeof l.mid < "u" ? l.mid : !0),
        (l.down = typeof l.down < "u" ? l.down : !0),
        (l.size = typeof l.size < "u" ? l.size : "maxi"),
        (u = u.split(""));
      for (c in u)
        if (!a(c)) {
          switch (((f = f + u[c]), (h = { up: 0, down: 0, mid: 0 }), l.size)) {
            case "mini":
              (h.up = s(8)), (h.mid = s(2)), (h.down = s(8));
              break;
            case "maxi":
              (h.up = s(16) + 3), (h.mid = s(4) + 1), (h.down = s(64) + 3);
              break;
            default:
              (h.up = s(8) + 1), (h.mid = s(6) / 2), (h.down = s(8) + 1);
              break;
          }
          var d = ["up", "mid", "down"];
          for (var g in d)
            for (var C = d[g], S = 0; S <= h[C]; S++)
              l[C] && (f = f + i[C][s(i[C].length)]);
        }
      return f;
    }
    return o(t, r);
  };
});
var r1 = y((BK, t1) => {
  t1.exports = function (e) {
    return function (t, r, i) {
      if (t === " ") return t;
      switch (r % 3) {
        case 0:
          return e.red(t);
        case 1:
          return e.white(t);
        case 2:
          return e.blue(t);
      }
    };
  };
});
var n1 = y((kK, i1) => {
  i1.exports = function (e) {
    return function (t, r, i) {
      return r % 2 === 0 ? t : e.inverse(t);
    };
  };
});
var a1 = y((jK, s1) => {
  s1.exports = function (e) {
    var t = ["red", "yellow", "green", "blue", "magenta"];
    return function (r, i, n) {
      return r === " " ? r : e[t[i++ % t.length]](r);
    };
  };
});
var u1 = y((UK, o1) => {
  o1.exports = function (e) {
    var t = [
      "underline",
      "inverse",
      "grey",
      "yellow",
      "red",
      "green",
      "blue",
      "white",
      "cyan",
      "magenta",
      "brightYellow",
      "brightRed",
      "brightGreen",
      "brightBlue",
      "brightWhite",
      "brightCyan",
      "brightMagenta",
    ];
    return function (r, i, n) {
      return r === " "
        ? r
        : e[t[Math.round(Math.random() * (t.length - 2))]](r);
    };
  };
});
var p1 = y(($K, d1) => {
  var ie = {};
  d1.exports = ie;
  ie.themes = {};
  var B8 = require("util"),
    cn = (ie.styles = H_()),
    f1 = Object.defineProperties,
    k8 = new RegExp(/[\r\n]+/g);
  ie.supportsColor = Z_().supportsColor;
  typeof ie.enabled > "u" && (ie.enabled = ie.supportsColor() !== !1);
  ie.enable = function () {
    ie.enabled = !0;
  };
  ie.disable = function () {
    ie.enabled = !1;
  };
  ie.stripColors = ie.strip = function (e) {
    return ("" + e).replace(/\x1B\[\d+m/g, "");
  };
  var zK = (ie.stylize = function (t, r) {
      if (!ie.enabled) return t + "";
      var i = cn[r];
      return !i && r in ie ? ie[r](t) : i.open + t + i.close;
    }),
    j8 = /[|\\{}()[\]^$+*?.]/g,
    U8 = function (e) {
      if (typeof e != "string") throw new TypeError("Expected a string");
      return e.replace(j8, "\\$&");
    };
  function h1(e) {
    var t = function r() {
      return $8.apply(r, arguments);
    };
    return (t._styles = e), (t.__proto__ = z8), t;
  }
  var c1 = (function () {
      var e = {};
      return (
        (cn.grey = cn.gray),
        Object.keys(cn).forEach(function (t) {
          (cn[t].closeRe = new RegExp(U8(cn[t].close), "g")),
            (e[t] = {
              get: function () {
                return h1(this._styles.concat(t));
              },
            });
        }),
        e
      );
    })(),
    z8 = f1(function () {}, c1);
  function $8() {
    var e = Array.prototype.slice.call(arguments),
      t = e
        .map(function (a) {
          return a != null && a.constructor === String ? a : B8.inspect(a);
        })
        .join(" ");
    if (!ie.enabled || !t) return t;
    for (
      var r =
          t.indexOf(`
`) != -1,
        i = this._styles,
        n = i.length;
      n--;

    ) {
      var s = cn[i[n]];
      (t = s.open + t.replace(s.closeRe, s.open) + s.close),
        r &&
          (t = t.replace(k8, function (a) {
            return s.close + a + s.open;
          }));
    }
    return t;
  }
  ie.setTheme = function (e) {
    if (typeof e == "string") {
      console.log(
        "colors.setTheme now only accepts an object, not a string.  If you are trying to set a theme from a file, it is now your (the caller's) responsibility to require the file.  The old syntax looked like colors.setTheme(__dirname + '/../themes/generic-logging.js'); The new syntax looks like colors.setTheme(require(__dirname + '/../themes/generic-logging.js'));",
      );
      return;
    }
    for (var t in e)
      (function (r) {
        ie[r] = function (i) {
          if (typeof e[r] == "object") {
            var n = i;
            for (var s in e[r]) n = ie[e[r][s]](n);
            return n;
          }
          return ie[e[r]](i);
        };
      })(t);
  };
  function W8() {
    var e = {};
    return (
      Object.keys(c1).forEach(function (t) {
        e[t] = {
          get: function () {
            return h1([t]);
          },
        };
      }),
      e
    );
  }
  var G8 = function (t, r) {
    var i = r.split("");
    return (i = i.map(t)), i.join("");
  };
  ie.trap = Q_();
  ie.zalgo = e1();
  ie.maps = {};
  ie.maps.america = r1()(ie);
  ie.maps.zebra = n1()(ie);
  ie.maps.rainbow = a1()(ie);
  ie.maps.random = u1()(ie);
  for (l1 in ie.maps)
    (function (e) {
      ie[e] = function (t) {
        return G8(ie.maps[e], t);
      };
    })(l1);
  var l1;
  f1(ie, W8());
});
var dm = y((WK, m1) => {
  var H8 = p1();
  m1.exports = H8;
});
var g1 = y((pm) => {
  "use strict";
  pm.levels = {
    error: 0,
    warn: 1,
    help: 2,
    data: 3,
    info: 4,
    debug: 5,
    prompt: 6,
    verbose: 7,
    input: 8,
    silly: 9,
  };
  pm.colors = {
    error: "red",
    warn: "yellow",
    help: "cyan",
    data: "grey",
    info: "green",
    debug: "blue",
    prompt: "grey",
    verbose: "cyan",
    input: "grey",
    silly: "magenta",
  };
});
var y1 = y((mm) => {
  "use strict";
  mm.levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  };
  mm.colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "green",
    verbose: "cyan",
    debug: "blue",
    silly: "magenta",
  };
});
var v1 = y((gm) => {
  "use strict";
  gm.levels = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  };
  gm.colors = {
    emerg: "red",
    alert: "yellow",
    crit: "red",
    error: "red",
    warning: "red",
    notice: "yellow",
    info: "green",
    debug: "blue",
  };
});
var w1 = y((uf) => {
  "use strict";
  Object.defineProperty(uf, "cli", { value: g1() });
  Object.defineProperty(uf, "npm", { value: y1() });
  Object.defineProperty(uf, "syslog", { value: v1() });
});
var Me = y((eo) => {
  "use strict";
  Object.defineProperty(eo, "LEVEL", { value: Symbol.for("level") });
  Object.defineProperty(eo, "MESSAGE", { value: Symbol.for("message") });
  Object.defineProperty(eo, "SPLAT", { value: Symbol.for("splat") });
  Object.defineProperty(eo, "configs", { value: w1() });
});
var ff = y((ZK, lf) => {
  "use strict";
  var wm = dm(),
    { LEVEL: ym, MESSAGE: vm } = Me();
  wm.enabled = !0;
  var D1 = /\s+/,
    Ft = class {
      constructor(t = {}) {
        t.colors && this.addColors(t.colors), (this.options = t);
      }
      static addColors(t) {
        let r = Object.keys(t).reduce(
          (i, n) => ((i[n] = D1.test(t[n]) ? t[n].split(D1) : t[n]), i),
          {},
        );
        return (
          (Ft.allColors = Object.assign({}, Ft.allColors || {}, r)),
          Ft.allColors
        );
      }
      addColors(t) {
        return Ft.addColors(t);
      }
      colorize(t, r, i) {
        if ((typeof i > "u" && (i = r), !Array.isArray(Ft.allColors[t])))
          return wm[Ft.allColors[t]](i);
        for (let n = 0, s = Ft.allColors[t].length; n < s; n++)
          i = wm[Ft.allColors[t][n]](i);
        return i;
      }
      transform(t, r) {
        return (
          r.all &&
            typeof t[vm] == "string" &&
            (t[vm] = this.colorize(t[ym], t.level, t[vm])),
          (r.level || r.all || !r.message) &&
            (t.level = this.colorize(t[ym], t.level)),
          (r.all || r.message) &&
            (t.message = this.colorize(t[ym], t.level, t.message)),
          t
        );
      }
    };
  lf.exports = (e) => new Ft(e);
  lf.exports.Colorizer = lf.exports.Format = Ft;
});
var E1 = y((KK, b1) => {
  "use strict";
  var { Colorizer: Y8 } = ff();
  b1.exports = (e) => (Y8.addColors(e.colors || e), e);
});
var S1 = y((QK, _1) => {
  "use strict";
  var V8 = wt();
  _1.exports = V8((e) => ((e.message = `	${e.message}`), e));
});
var O1 = y((JK, C1) => {
  "use strict";
  var X8 = wt(),
    { LEVEL: x1, MESSAGE: Dm } = Me();
  C1.exports = X8((e, { stack: t }) => {
    if (e instanceof Error) {
      let i = Object.assign({}, e, {
        level: e.level,
        [x1]: e[x1] || e.level,
        message: e.message,
        [Dm]: e[Dm] || e.message,
      });
      return t && (i.stack = e.stack), i;
    }
    if (!(e.message instanceof Error)) return e;
    let r = e.message;
    return (
      Object.assign(e, r),
      (e.message = r.message),
      (e[Dm] = r.message),
      t && (e.stack = r.stack),
      e
    );
  });
});
var Em = y((eQ, hf) => {
  "use strict";
  var { configs: Z8, LEVEL: T1, MESSAGE: bm } = Me(),
    wi = class {
      constructor(t = { levels: Z8.npm.levels }) {
        (this.paddings = wi.paddingForLevels(t.levels, t.filler)),
          (this.options = t);
      }
      static getLongestLevel(t) {
        let r = Object.keys(t).map((i) => i.length);
        return Math.max(...r);
      }
      static paddingForLevel(t, r, i) {
        let n = i + 1 - t.length,
          s = Math.floor(n / r.length);
        return `${r}${r.repeat(s)}`.slice(0, n);
      }
      static paddingForLevels(t, r = " ") {
        let i = wi.getLongestLevel(t);
        return Object.keys(t).reduce(
          (n, s) => ((n[s] = wi.paddingForLevel(s, r, i)), n),
          {},
        );
      }
      transform(t, r) {
        return (
          (t.message = `${this.paddings[t[T1]]}${t.message}`),
          t[bm] && (t[bm] = `${this.paddings[t[T1]]}${t[bm]}`),
          t
        );
      }
    };
  hf.exports = (e) => new wi(e);
  hf.exports.Padder = hf.exports.Format = wi;
});
var F1 = y((tQ, _m) => {
  "use strict";
  var { Colorizer: K8 } = ff(),
    { Padder: Q8 } = Em(),
    { configs: J8, MESSAGE: eP } = Me(),
    cf = class {
      constructor(t = {}) {
        t.levels || (t.levels = J8.cli.levels),
          (this.colorizer = new K8(t)),
          (this.padder = new Q8(t)),
          (this.options = t);
      }
      transform(t, r) {
        return (
          this.colorizer.transform(this.padder.transform(t, r), r),
          (t[eP] = `${t.level}:${t.message}`),
          t
        );
      }
    };
  _m.exports = (e) => new cf(e);
  _m.exports.Format = cf;
});
var A1 = y((rQ, Sm) => {
  "use strict";
  var tP = wt();
  function R1(e) {
    if (!!e.every(rP))
      return (t) => {
        let r = t;
        for (let i = 0; i < e.length; i++)
          if (((r = e[i].transform(r, e[i].options)), !r)) return !1;
        return r;
      };
  }
  function rP(e) {
    if (typeof e.transform != "function")
      throw new Error(
        [
          "No transform function found on format. Did you create a format instance?",
          "const myFormat = format(formatFn);",
          "const instance = myFormat();",
        ].join(`
`),
      );
    return !0;
  }
  Sm.exports = (...e) => {
    let t = tP(R1(e)),
      r = t();
    return (r.Format = t.Format), r;
  };
  Sm.exports.cascade = R1;
});
var to = y((Rm, L1) => {
  "use strict";
  var { hasOwnProperty: df } = Object.prototype,
    pn = Fm();
  pn.configure = Fm;
  pn.stringify = pn;
  pn.default = pn;
  Rm.stringify = pn;
  Rm.configure = Fm;
  L1.exports = pn;
  var M1 =
      /[\u0000-\u001f\u0022\u005c\ud800-\udfff]|[\ud800-\udbff](?![\udc00-\udfff])|(?:[^\ud800-\udbff]|^)[\udc00-\udfff]/,
    iP = new RegExp(M1, "g"),
    Tm = [
      "\\u0000",
      "\\u0001",
      "\\u0002",
      "\\u0003",
      "\\u0004",
      "\\u0005",
      "\\u0006",
      "\\u0007",
      "\\b",
      "\\t",
      "\\n",
      "\\u000b",
      "\\f",
      "\\r",
      "\\u000e",
      "\\u000f",
      "\\u0010",
      "\\u0011",
      "\\u0012",
      "\\u0013",
      "\\u0014",
      "\\u0015",
      "\\u0016",
      "\\u0017",
      "\\u0018",
      "\\u0019",
      "\\u001a",
      "\\u001b",
      "\\u001c",
      "\\u001d",
      "\\u001e",
      "\\u001f",
      "",
      "",
      '\\"',
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "\\\\",
    ];
  function nP(e) {
    if (e.length === 2) {
      let r = e.charCodeAt(1);
      return `${e[0]}\\u${r.toString(16)}`;
    }
    let t = e.charCodeAt(0);
    return Tm.length > t ? Tm[t] : `\\u${t.toString(16)}`;
  }
  function Di(e) {
    if (e.length < 5e3 && !M1.test(e)) return e;
    if (e.length > 100) return e.replace(iP, nP);
    let t = "",
      r = 0;
    for (let i = 0; i < e.length; i++) {
      let n = e.charCodeAt(i);
      if (n === 34 || n === 92 || n < 32)
        (t += `${e.slice(r, i)}${Tm[n]}`), (r = i + 1);
      else if (n >= 55296 && n <= 57343) {
        if (n <= 56319 && i + 1 < e.length) {
          let s = e.charCodeAt(i + 1);
          if (s >= 56320 && s <= 57343) {
            i++;
            continue;
          }
        }
        (t += `${e.slice(r, i)}\\u${n.toString(16)}`), (r = i + 1);
      }
    }
    return (t += e.slice(r)), t;
  }
  function xm(e) {
    if (e.length > 200) return e.sort();
    for (let t = 1; t < e.length; t++) {
      let r = e[t],
        i = t;
      for (; i !== 0 && e[i - 1] > r; ) (e[i] = e[i - 1]), i--;
      e[i] = r;
    }
    return e;
  }
  var sP = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(Object.getPrototypeOf(new Int8Array())),
    Symbol.toStringTag,
  ).get;
  function Cm(e) {
    return sP.call(e) !== void 0 && e.length !== 0;
  }
  function Om(e, t, r) {
    e.length < r && (r = e.length);
    let i = t === "," ? "" : " ",
      n = `"0":${i}${e[0]}`;
    for (let s = 1; s < r; s++) n += `${t}"${s}":${i}${e[s]}`;
    return n;
  }
  function aP(e) {
    if (df.call(e, "circularValue")) {
      let t = e.circularValue;
      if (typeof t == "string") return `"${t}"`;
      if (t == null) return t;
      if (t === Error || t === TypeError)
        return {
          toString() {
            throw new TypeError("Converting circular structure to JSON");
          },
        };
      throw new TypeError(
        'The "circularValue" argument must be of type string or the value null or undefined',
      );
    }
    return '"[Circular]"';
  }
  function N1(e, t) {
    let r;
    if (df.call(e, t) && ((r = e[t]), typeof r != "boolean"))
      throw new TypeError(`The "${t}" argument must be of type boolean`);
    return r === void 0 ? !0 : r;
  }
  function I1(e, t) {
    let r;
    if (df.call(e, t)) {
      if (((r = e[t]), typeof r != "number"))
        throw new TypeError(`The "${t}" argument must be of type number`);
      if (!Number.isInteger(r))
        throw new TypeError(`The "${t}" argument must be an integer`);
      if (r < 1) throw new RangeError(`The "${t}" argument must be >= 1`);
    }
    return r === void 0 ? 1 / 0 : r;
  }
  function dn(e) {
    return e === 1 ? "1 item" : `${e} items`;
  }
  function oP(e) {
    let t = new Set();
    for (let r of e)
      (typeof r == "string" || typeof r == "number") && t.add(String(r));
    return t;
  }
  function uP(e) {
    if (df.call(e, "strict")) {
      let t = e.strict;
      if (typeof t != "boolean")
        throw new TypeError('The "strict" argument must be of type boolean');
      if (t)
        return (r) => {
          let i = `Object can not safely be stringified. Received type ${typeof r}`;
          throw (
            (typeof r != "function" && (i += ` (${r.toString()})`),
            new Error(i))
          );
        };
    }
  }
  function Fm(e) {
    e = { ...e };
    let t = uP(e);
    t &&
      (e.bigint === void 0 && (e.bigint = !1),
      "circularValue" in e || (e.circularValue = Error));
    let r = aP(e),
      i = N1(e, "bigint"),
      n = N1(e, "deterministic"),
      s = I1(e, "maximumDepth"),
      a = I1(e, "maximumBreadth");
    function o(c, d, g, C, S, O) {
      let L = d[c];
      switch (
        (typeof L == "object" &&
          L !== null &&
          typeof L.toJSON == "function" &&
          (L = L.toJSON(c)),
        (L = C.call(d, c, L)),
        typeof L)
      ) {
        case "string":
          return `"${Di(L)}"`;
        case "object": {
          if (L === null) return "null";
          if (g.indexOf(L) !== -1) return r;
          let D = "",
            w = ",",
            F = O;
          if (Array.isArray(L)) {
            if (L.length === 0) return "[]";
            if (s < g.length + 1) return '"[Array]"';
            g.push(L),
              S !== "" &&
                ((O += S),
                (D += `
${O}`),
                (w = `,
${O}`));
            let R = Math.min(L.length, a),
              k = 0;
            for (; k < R - 1; k++) {
              let $ = o(k, L, g, C, S, O);
              (D += $ !== void 0 ? $ : "null"), (D += w);
            }
            let z = o(k, L, g, C, S, O);
            if (((D += z !== void 0 ? z : "null"), L.length - 1 > a)) {
              let $ = L.length - a - 1;
              D += `${w}"... ${dn($)} not stringified"`;
            }
            return (
              S !== "" &&
                (D += `
${F}`),
              g.pop(),
              `[${D}]`
            );
          }
          let m = Object.keys(L),
            x = m.length;
          if (x === 0) return "{}";
          if (s < g.length + 1) return '"[Object]"';
          let A = "",
            p = "";
          S !== "" &&
            ((O += S),
            (w = `,
${O}`),
            (A = " "));
          let T = Math.min(x, a);
          Cm(L) &&
            ((D += Om(L, w, a)),
            (m = m.slice(L.length)),
            (T -= L.length),
            (p = w)),
            n && (m = xm(m)),
            g.push(L);
          for (let R = 0; R < T; R++) {
            let k = m[R],
              z = o(k, L, g, C, S, O);
            z !== void 0 && ((D += `${p}"${Di(k)}":${A}${z}`), (p = w));
          }
          if (x > a) {
            let R = x - a;
            (D += `${p}"...":${A}"${dn(R)} not stringified"`), (p = w);
          }
          return (
            S !== "" &&
              p.length > 1 &&
              (D = `
${O}${D}
${F}`),
            g.pop(),
            `{${D}}`
          );
        }
        case "number":
          return isFinite(L) ? String(L) : t ? t(L) : "null";
        case "boolean":
          return L === !0 ? "true" : "false";
        case "undefined":
          return;
        case "bigint":
          if (i) return String(L);
        default:
          return t ? t(L) : void 0;
      }
    }
    function u(c, d, g, C, S, O) {
      switch (
        (typeof d == "object" &&
          d !== null &&
          typeof d.toJSON == "function" &&
          (d = d.toJSON(c)),
        typeof d)
      ) {
        case "string":
          return `"${Di(d)}"`;
        case "object": {
          if (d === null) return "null";
          if (g.indexOf(d) !== -1) return r;
          let L = O,
            D = "",
            w = ",";
          if (Array.isArray(d)) {
            if (d.length === 0) return "[]";
            if (s < g.length + 1) return '"[Array]"';
            g.push(d),
              S !== "" &&
                ((O += S),
                (D += `
${O}`),
                (w = `,
${O}`));
            let x = Math.min(d.length, a),
              A = 0;
            for (; A < x - 1; A++) {
              let T = u(A, d[A], g, C, S, O);
              (D += T !== void 0 ? T : "null"), (D += w);
            }
            let p = u(A, d[A], g, C, S, O);
            if (((D += p !== void 0 ? p : "null"), d.length - 1 > a)) {
              let T = d.length - a - 1;
              D += `${w}"... ${dn(T)} not stringified"`;
            }
            return (
              S !== "" &&
                (D += `
${L}`),
              g.pop(),
              `[${D}]`
            );
          }
          if (C.size === 0) return "{}";
          g.push(d);
          let F = "";
          S !== "" &&
            ((O += S),
            (w = `,
${O}`),
            (F = " "));
          let m = "";
          for (let x of C) {
            let A = u(x, d[x], g, C, S, O);
            A !== void 0 && ((D += `${m}"${Di(x)}":${F}${A}`), (m = w));
          }
          return (
            S !== "" &&
              m.length > 1 &&
              (D = `
${O}${D}
${L}`),
            g.pop(),
            `{${D}}`
          );
        }
        case "number":
          return isFinite(d) ? String(d) : t ? t(d) : "null";
        case "boolean":
          return d === !0 ? "true" : "false";
        case "undefined":
          return;
        case "bigint":
          if (i) return String(d);
        default:
          return t ? t(d) : void 0;
      }
    }
    function l(c, d, g, C, S) {
      switch (typeof d) {
        case "string":
          return `"${Di(d)}"`;
        case "object": {
          if (d === null) return "null";
          if (typeof d.toJSON == "function") {
            if (((d = d.toJSON(c)), typeof d != "object"))
              return l(c, d, g, C, S);
            if (d === null) return "null";
          }
          if (g.indexOf(d) !== -1) return r;
          let O = S;
          if (Array.isArray(d)) {
            if (d.length === 0) return "[]";
            if (s < g.length + 1) return '"[Array]"';
            g.push(d), (S += C);
            let A = `
${S}`,
              p = `,
${S}`,
              T = Math.min(d.length, a),
              R = 0;
            for (; R < T - 1; R++) {
              let z = l(R, d[R], g, C, S);
              (A += z !== void 0 ? z : "null"), (A += p);
            }
            let k = l(R, d[R], g, C, S);
            if (((A += k !== void 0 ? k : "null"), d.length - 1 > a)) {
              let z = d.length - a - 1;
              A += `${p}"... ${dn(z)} not stringified"`;
            }
            return (
              (A += `
${O}`),
              g.pop(),
              `[${A}]`
            );
          }
          let L = Object.keys(d),
            D = L.length;
          if (D === 0) return "{}";
          if (s < g.length + 1) return '"[Object]"';
          S += C;
          let w = `,
${S}`,
            F = "",
            m = "",
            x = Math.min(D, a);
          Cm(d) &&
            ((F += Om(d, w, a)),
            (L = L.slice(d.length)),
            (x -= d.length),
            (m = w)),
            n && (L = xm(L)),
            g.push(d);
          for (let A = 0; A < x; A++) {
            let p = L[A],
              T = l(p, d[p], g, C, S);
            T !== void 0 && ((F += `${m}"${Di(p)}": ${T}`), (m = w));
          }
          if (D > a) {
            let A = D - a;
            (F += `${m}"...": "${dn(A)} not stringified"`), (m = w);
          }
          return (
            m !== "" &&
              (F = `
${S}${F}
${O}`),
            g.pop(),
            `{${F}}`
          );
        }
        case "number":
          return isFinite(d) ? String(d) : t ? t(d) : "null";
        case "boolean":
          return d === !0 ? "true" : "false";
        case "undefined":
          return;
        case "bigint":
          if (i) return String(d);
        default:
          return t ? t(d) : void 0;
      }
    }
    function f(c, d, g) {
      switch (typeof d) {
        case "string":
          return `"${Di(d)}"`;
        case "object": {
          if (d === null) return "null";
          if (typeof d.toJSON == "function") {
            if (((d = d.toJSON(c)), typeof d != "object")) return f(c, d, g);
            if (d === null) return "null";
          }
          if (g.indexOf(d) !== -1) return r;
          let C = "";
          if (Array.isArray(d)) {
            if (d.length === 0) return "[]";
            if (s < g.length + 1) return '"[Array]"';
            g.push(d);
            let w = Math.min(d.length, a),
              F = 0;
            for (; F < w - 1; F++) {
              let x = f(F, d[F], g);
              (C += x !== void 0 ? x : "null"), (C += ",");
            }
            let m = f(F, d[F], g);
            if (((C += m !== void 0 ? m : "null"), d.length - 1 > a)) {
              let x = d.length - a - 1;
              C += `,"... ${dn(x)} not stringified"`;
            }
            return g.pop(), `[${C}]`;
          }
          let S = Object.keys(d),
            O = S.length;
          if (O === 0) return "{}";
          if (s < g.length + 1) return '"[Object]"';
          let L = "",
            D = Math.min(O, a);
          Cm(d) &&
            ((C += Om(d, ",", a)),
            (S = S.slice(d.length)),
            (D -= d.length),
            (L = ",")),
            n && (S = xm(S)),
            g.push(d);
          for (let w = 0; w < D; w++) {
            let F = S[w],
              m = f(F, d[F], g);
            m !== void 0 && ((C += `${L}"${Di(F)}":${m}`), (L = ","));
          }
          if (O > a) {
            let w = O - a;
            C += `${L}"...":"${dn(w)} not stringified"`;
          }
          return g.pop(), `{${C}}`;
        }
        case "number":
          return isFinite(d) ? String(d) : t ? t(d) : "null";
        case "boolean":
          return d === !0 ? "true" : "false";
        case "undefined":
          return;
        case "bigint":
          if (i) return String(d);
        default:
          return t ? t(d) : void 0;
      }
    }
    function h(c, d, g) {
      if (arguments.length > 1) {
        let C = "";
        if (
          (typeof g == "number"
            ? (C = " ".repeat(Math.min(g, 10)))
            : typeof g == "string" && (C = g.slice(0, 10)),
          d != null)
        ) {
          if (typeof d == "function") return o("", { "": c }, [], d, C, "");
          if (Array.isArray(d)) return u("", c, [], oP(d), C, "");
        }
        if (C.length !== 0) return l("", c, [], C, "");
      }
      return f("", c, []);
    }
    return h;
  }
});
var Am = y((iQ, q1) => {
  "use strict";
  var lP = wt(),
    { MESSAGE: fP } = Me(),
    hP = to();
  function cP(e, t) {
    return typeof t == "bigint" ? t.toString() : t;
  }
  q1.exports = lP((e, t) => {
    let r = hP.configure(t);
    return (e[fP] = r(e, t.replacer || cP, t.space)), e;
  });
});
var B1 = y((nQ, P1) => {
  "use strict";
  var dP = wt();
  P1.exports = dP((e, t) =>
    t.message
      ? ((e.message = `[${t.label}] ${e.message}`), e)
      : ((e.label = t.label), e),
  );
});
var j1 = y((sQ, k1) => {
  "use strict";
  var pP = wt(),
    { MESSAGE: mP } = Me(),
    gP = to();
  k1.exports = pP((e) => {
    let t = {};
    return (
      e.message && ((t["@message"] = e.message), delete e.message),
      e.timestamp && ((t["@timestamp"] = e.timestamp), delete e.timestamp),
      (t["@fields"] = e),
      (e[mP] = gP(t)),
      e
    );
  });
});
var z1 = y((aQ, U1) => {
  "use strict";
  var yP = wt();
  function vP(e, t, r) {
    let i = t.reduce((s, a) => ((s[a] = e[a]), delete e[a], s), {}),
      n = Object.keys(e).reduce((s, a) => ((s[a] = e[a]), delete e[a], s), {});
    return Object.assign(e, i, { [r]: n }), e;
  }
  function wP(e, t, r) {
    return (e[r] = t.reduce((i, n) => ((i[n] = e[n]), delete e[n], i), {})), e;
  }
  U1.exports = yP((e, t = {}) => {
    let r = "metadata";
    t.key && (r = t.key);
    let i = [];
    return (
      !t.fillExcept && !t.fillWith && (i.push("level"), i.push("message")),
      t.fillExcept && (i = t.fillExcept),
      i.length > 0 ? vP(e, i, r) : t.fillWith ? wP(e, t.fillWith, r) : e
    );
  });
});
var W1 = y((ro, $1) => {
  "use strict";
  var DP = wt(),
    bP = ed();
  $1.exports = DP((e) => {
    let t = +new Date();
    return (
      (ro.diff = t - (ro.prevTime || t)),
      (ro.prevTime = t),
      (e.ms = `+${bP(ro.diff)}`),
      e
    );
  });
});
var Y1 = y((oQ, H1) => {
  "use strict";
  var EP = require("util").inspect,
    _P = wt(),
    { LEVEL: SP, MESSAGE: G1, SPLAT: xP } = Me();
  H1.exports = _P((e, t = {}) => {
    let r = Object.assign({}, e);
    return (
      delete r[SP],
      delete r[G1],
      delete r[xP],
      (e[G1] = EP(r, !1, t.depth || null, t.colorize)),
      e
    );
  });
});
var V1 = y((uQ, mf) => {
  "use strict";
  var { MESSAGE: CP } = Me(),
    pf = class {
      constructor(t) {
        this.template = t;
      }
      transform(t) {
        return (t[CP] = this.template(t)), t;
      }
    };
  mf.exports = (e) => new pf(e);
  mf.exports.Printf = mf.exports.Format = pf;
});
var K1 = y((lQ, Z1) => {
  "use strict";
  var OP = wt(),
    { MESSAGE: X1 } = Me(),
    TP = to();
  Z1.exports = OP((e) => {
    let t = TP(
        Object.assign({}, e, { level: void 0, message: void 0, splat: void 0 }),
      ),
      r = (e.padding && e.padding[e.level]) || "";
    return (
      t !== "{}"
        ? (e[X1] = `${e.level}:${r} ${e.message} ${t}`)
        : (e[X1] = `${e.level}:${r} ${e.message}`),
      e
    );
  });
});
var eS = y((fQ, J1) => {
  "use strict";
  var FP = require("util"),
    { SPLAT: Q1 } = Me(),
    RP = /%[scdjifoO%]/g,
    AP = /%%/g,
    Nm = class {
      constructor(t) {
        this.options = t;
      }
      _splat(t, r) {
        let i = t.message,
          n = t[Q1] || t.splat || [],
          s = i.match(AP),
          a = (s && s.length) || 0,
          u = r.length - a - n.length,
          l = u < 0 ? n.splice(u, -1 * u) : [],
          f = l.length;
        if (f) for (let h = 0; h < f; h++) Object.assign(t, l[h]);
        return (t.message = FP.format(i, ...n)), t;
      }
      transform(t) {
        let r = t.message,
          i = t[Q1] || t.splat;
        if (!i || !i.length) return t;
        let n = r && r.match && r.match(RP);
        if (!n && (i || i.length)) {
          let s = i.length > 1 ? i.splice(0) : i,
            a = s.length;
          if (a) for (let o = 0; o < a; o++) Object.assign(t, s[o]);
          return t;
        }
        return n ? this._splat(t, n) : t;
      }
    };
  J1.exports = (e) => new Nm(e);
});
var rS = y((gf, tS) => {
  (function (e, t) {
    typeof gf == "object" && typeof tS < "u"
      ? t(gf)
      : typeof define == "function" && define.amd
      ? define(["exports"], t)
      : t((e.fecha = {}));
  })(gf, function (e) {
    "use strict";
    var t =
        /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,
      r = "\\d\\d?",
      i = "\\d\\d",
      n = "\\d{3}",
      s = "\\d{4}",
      a = "[^\\s]+",
      o = /\[([^]*?)\]/gm;
    function u(I, P) {
      for (var G = [], J = 0, W = I.length; J < W; J++)
        G.push(I[J].substr(0, P));
      return G;
    }
    var l = function (I) {
      return function (P, G) {
        var J = G[I].map(function (Ne) {
            return Ne.toLowerCase();
          }),
          W = J.indexOf(P.toLowerCase());
        return W > -1 ? W : null;
      };
    };
    function f(I) {
      for (var P = [], G = 1; G < arguments.length; G++)
        P[G - 1] = arguments[G];
      for (var J = 0, W = P; J < W.length; J++) {
        var Ne = W[J];
        for (var Ie in Ne) I[Ie] = Ne[Ie];
      }
      return I;
    }
    var h = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      c = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      d = u(c, 3),
      g = u(h, 3),
      C = {
        dayNamesShort: g,
        dayNames: h,
        monthNamesShort: d,
        monthNames: c,
        amPm: ["am", "pm"],
        DoFn: function (I) {
          return (
            I +
            ["th", "st", "nd", "rd"][
              I % 10 > 3 ? 0 : ((I - (I % 10) !== 10 ? 1 : 0) * I) % 10
            ]
          );
        },
      },
      S = f({}, C),
      O = function (I) {
        return (S = f(S, I));
      },
      L = function (I) {
        return I.replace(/[|\\{()[^$+*?.-]/g, "\\$&");
      },
      D = function (I, P) {
        for (P === void 0 && (P = 2), I = String(I); I.length < P; )
          I = "0" + I;
        return I;
      },
      w = {
        D: function (I) {
          return String(I.getDate());
        },
        DD: function (I) {
          return D(I.getDate());
        },
        Do: function (I, P) {
          return P.DoFn(I.getDate());
        },
        d: function (I) {
          return String(I.getDay());
        },
        dd: function (I) {
          return D(I.getDay());
        },
        ddd: function (I, P) {
          return P.dayNamesShort[I.getDay()];
        },
        dddd: function (I, P) {
          return P.dayNames[I.getDay()];
        },
        M: function (I) {
          return String(I.getMonth() + 1);
        },
        MM: function (I) {
          return D(I.getMonth() + 1);
        },
        MMM: function (I, P) {
          return P.monthNamesShort[I.getMonth()];
        },
        MMMM: function (I, P) {
          return P.monthNames[I.getMonth()];
        },
        YY: function (I) {
          return D(String(I.getFullYear()), 4).substr(2);
        },
        YYYY: function (I) {
          return D(I.getFullYear(), 4);
        },
        h: function (I) {
          return String(I.getHours() % 12 || 12);
        },
        hh: function (I) {
          return D(I.getHours() % 12 || 12);
        },
        H: function (I) {
          return String(I.getHours());
        },
        HH: function (I) {
          return D(I.getHours());
        },
        m: function (I) {
          return String(I.getMinutes());
        },
        mm: function (I) {
          return D(I.getMinutes());
        },
        s: function (I) {
          return String(I.getSeconds());
        },
        ss: function (I) {
          return D(I.getSeconds());
        },
        S: function (I) {
          return String(Math.round(I.getMilliseconds() / 100));
        },
        SS: function (I) {
          return D(Math.round(I.getMilliseconds() / 10), 2);
        },
        SSS: function (I) {
          return D(I.getMilliseconds(), 3);
        },
        a: function (I, P) {
          return I.getHours() < 12 ? P.amPm[0] : P.amPm[1];
        },
        A: function (I, P) {
          return I.getHours() < 12
            ? P.amPm[0].toUpperCase()
            : P.amPm[1].toUpperCase();
        },
        ZZ: function (I) {
          var P = I.getTimezoneOffset();
          return (
            (P > 0 ? "-" : "+") +
            D(Math.floor(Math.abs(P) / 60) * 100 + (Math.abs(P) % 60), 4)
          );
        },
        Z: function (I) {
          var P = I.getTimezoneOffset();
          return (
            (P > 0 ? "-" : "+") +
            D(Math.floor(Math.abs(P) / 60), 2) +
            ":" +
            D(Math.abs(P) % 60, 2)
          );
        },
      },
      F = function (I) {
        return +I - 1;
      },
      m = [null, r],
      x = [null, a],
      A = [
        "isPm",
        a,
        function (I, P) {
          var G = I.toLowerCase();
          return G === P.amPm[0] ? 0 : G === P.amPm[1] ? 1 : null;
        },
      ],
      p = [
        "timezoneOffset",
        "[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",
        function (I) {
          var P = (I + "").match(/([+-]|\d\d)/gi);
          if (P) {
            var G = +P[1] * 60 + parseInt(P[2], 10);
            return P[0] === "+" ? G : -G;
          }
          return 0;
        },
      ],
      T = {
        D: ["day", r],
        DD: ["day", i],
        Do: [
          "day",
          r + a,
          function (I) {
            return parseInt(I, 10);
          },
        ],
        M: ["month", r, F],
        MM: ["month", i, F],
        YY: [
          "year",
          i,
          function (I) {
            var P = new Date(),
              G = +("" + P.getFullYear()).substr(0, 2);
            return +("" + (+I > 68 ? G - 1 : G) + I);
          },
        ],
        h: ["hour", r, void 0, "isPm"],
        hh: ["hour", i, void 0, "isPm"],
        H: ["hour", r],
        HH: ["hour", i],
        m: ["minute", r],
        mm: ["minute", i],
        s: ["second", r],
        ss: ["second", i],
        YYYY: ["year", s],
        S: [
          "millisecond",
          "\\d",
          function (I) {
            return +I * 100;
          },
        ],
        SS: [
          "millisecond",
          i,
          function (I) {
            return +I * 10;
          },
        ],
        SSS: ["millisecond", n],
        d: m,
        dd: m,
        ddd: x,
        dddd: x,
        MMM: ["month", a, l("monthNamesShort")],
        MMMM: ["month", a, l("monthNames")],
        a: A,
        A,
        ZZ: p,
        Z: p,
      },
      R = {
        default: "ddd MMM DD YYYY HH:mm:ss",
        shortDate: "M/D/YY",
        mediumDate: "MMM D, YYYY",
        longDate: "MMMM D, YYYY",
        fullDate: "dddd, MMMM D, YYYY",
        isoDate: "YYYY-MM-DD",
        isoDateTime: "YYYY-MM-DDTHH:mm:ssZ",
        shortTime: "HH:mm",
        mediumTime: "HH:mm:ss",
        longTime: "HH:mm:ss.SSS",
      },
      k = function (I) {
        return f(R, I);
      },
      z = function (I, P, G) {
        if (
          (P === void 0 && (P = R.default),
          G === void 0 && (G = {}),
          typeof I == "number" && (I = new Date(I)),
          Object.prototype.toString.call(I) !== "[object Date]" ||
            isNaN(I.getTime()))
        )
          throw new Error("Invalid Date pass to format");
        P = R[P] || P;
        var J = [];
        P = P.replace(o, function (Ne, Ie) {
          return J.push(Ie), "@@@";
        });
        var W = f(f({}, S), G);
        return (
          (P = P.replace(t, function (Ne) {
            return w[Ne](I, W);
          })),
          P.replace(/@@@/g, function () {
            return J.shift();
          })
        );
      };
    function $(I, P, G) {
      if ((G === void 0 && (G = {}), typeof P != "string"))
        throw new Error("Invalid format in fecha parse");
      if (((P = R[P] || P), I.length > 1e3)) return null;
      var J = new Date(),
        W = {
          year: J.getFullYear(),
          month: 0,
          day: 1,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
          isPm: null,
          timezoneOffset: null,
        },
        Ne = [],
        Ie = [],
        Pt = P.replace(o, function (Yi, ti) {
          return Ie.push(L(ti)), "@@@";
        }),
        _t = {},
        Be = {};
      (Pt = L(Pt).replace(t, function (Yi) {
        var ti = T[Yi],
          Gn = ti[0],
          Gc = ti[1],
          Ea = ti[3];
        if (_t[Gn])
          throw new Error(
            "Invalid format. " + Gn + " specified twice in format",
          );
        return (_t[Gn] = !0), Ea && (Be[Ea] = !0), Ne.push(ti), "(" + Gc + ")";
      })),
        Object.keys(Be).forEach(function (Yi) {
          if (!_t[Yi])
            throw new Error(
              "Invalid format. " + Yi + " is required in specified format",
            );
        }),
        (Pt = Pt.replace(/@@@/g, function () {
          return Ie.shift();
        }));
      var Un = I.match(new RegExp(Pt, "i"));
      if (!Un) return null;
      for (var ba = f(f({}, S), G), mt = 1; mt < Un.length; mt++) {
        var xr = Ne[mt - 1],
          ei = xr[0],
          zn = xr[2],
          yu = zn ? zn(Un[mt], ba) : +Un[mt];
        if (yu == null) return null;
        W[ei] = yu;
      }
      W.isPm === 1 && W.hour != null && +W.hour != 12
        ? (W.hour = +W.hour + 12)
        : W.isPm === 0 && +W.hour == 12 && (W.hour = 0);
      var $n;
      if (W.timezoneOffset == null) {
        $n = new Date(
          W.year,
          W.month,
          W.day,
          W.hour,
          W.minute,
          W.second,
          W.millisecond,
        );
        for (
          var Wn = [
              ["month", "getMonth"],
              ["day", "getDate"],
              ["hour", "getHours"],
              ["minute", "getMinutes"],
              ["second", "getSeconds"],
            ],
            mt = 0,
            Wc = Wn.length;
          mt < Wc;
          mt++
        )
          if (_t[Wn[mt][0]] && W[Wn[mt][0]] !== $n[Wn[mt][1]]()) return null;
      } else if ((($n = new Date(Date.UTC(W.year, W.month, W.day, W.hour, W.minute - W.timezoneOffset, W.second, W.millisecond))), W.month > 11 || W.month < 0 || W.day > 31 || W.day < 1 || W.hour > 23 || W.hour < 0 || W.minute > 59 || W.minute < 0 || W.second > 59 || W.second < 0)) return null;
      return $n;
    }
    var X = {
      format: z,
      parse: $,
      defaultI18n: C,
      setGlobalDateI18n: O,
      setGlobalDateMasks: k,
    };
    (e.assign = f),
      (e.default = X),
      (e.format = z),
      (e.parse = $),
      (e.defaultI18n = C),
      (e.setGlobalDateI18n = O),
      (e.setGlobalDateMasks = k),
      Object.defineProperty(e, "__esModule", { value: !0 });
  });
});
var nS = y((hQ, iS) => {
  "use strict";
  var NP = rS(),
    IP = wt();
  iS.exports = IP(
    (e, t = {}) => (
      t.format &&
        (e.timestamp =
          typeof t.format == "function"
            ? t.format()
            : NP.format(new Date(), t.format)),
      e.timestamp || (e.timestamp = new Date().toISOString()),
      t.alias && (e[t.alias] = e.timestamp),
      e
    ),
  );
});
var aS = y((cQ, sS) => {
  "use strict";
  var Im = dm(),
    MP = wt(),
    { MESSAGE: Mm } = Me();
  sS.exports = MP(
    (e, t) => (
      t.level !== !1 && (e.level = Im.strip(e.level)),
      t.message !== !1 && (e.message = Im.strip(String(e.message))),
      t.raw !== !1 && e[Mm] && (e[Mm] = Im.strip(String(e[Mm]))),
      e
    ),
  );
});
var qm = y((Lm) => {
  "use strict";
  var LP = (Lm.format = wt());
  Lm.levels = E1();
  function Xe(e, t) {
    Object.defineProperty(LP, e, {
      get() {
        return t();
      },
      configurable: !0,
    });
  }
  Xe("align", function () {
    return S1();
  });
  Xe("errors", function () {
    return O1();
  });
  Xe("cli", function () {
    return F1();
  });
  Xe("combine", function () {
    return A1();
  });
  Xe("colorize", function () {
    return ff();
  });
  Xe("json", function () {
    return Am();
  });
  Xe("label", function () {
    return B1();
  });
  Xe("logstash", function () {
    return j1();
  });
  Xe("metadata", function () {
    return z1();
  });
  Xe("ms", function () {
    return W1();
  });
  Xe("padLevels", function () {
    return Em();
  });
  Xe("prettyPrint", function () {
    return Y1();
  });
  Xe("printf", function () {
    return V1();
  });
  Xe("simple", function () {
    return K1();
  });
  Xe("splat", function () {
    return eS();
  });
  Xe("timestamp", function () {
    return nS();
  });
  Xe("uncolorize", function () {
    return aS();
  });
});
var Pm = y((vf) => {
  "use strict";
  var { format: yf } = require("util");
  vf.warn = {
    deprecated(e) {
      return () => {
        throw new Error(yf("{ %s } was removed in winston@3.0.0.", e));
      };
    },
    useFormat(e) {
      return () => {
        throw new Error(
          [
            yf("{ %s } was removed in winston@3.0.0.", e),
            "Use a custom winston.format = winston.format(function) instead.",
          ].join(`
`),
        );
      };
    },
    forFunctions(e, t, r) {
      r.forEach((i) => {
        e[i] = vf.warn[t](i);
      });
    },
    moved(e, t, r) {
      function i() {
        return () => {
          throw new Error(
            [
              yf("winston.%s was moved in winston@3.0.0.", r),
              yf("Use a winston.%s instead.", t),
            ].join(`
`),
          );
        };
      }
      Object.defineProperty(e, r, { get: i, set: i });
    },
    forProperties(e, t, r) {
      r.forEach((i) => {
        let n = vf.warn[t](i);
        Object.defineProperty(e, i, { get: n, set: n });
      });
    },
  };
});
var oS = y((mQ, qP) => {
  qP.exports = {
    name: "winston",
    description: "A logger for just about everything.",
    version: "3.8.2",
    author: "Charlie Robbins <charlie.robbins@gmail.com>",
    maintainers: ["David Hyde <dabh@alumni.stanford.edu>"],
    repository: {
      type: "git",
      url: "https://github.com/winstonjs/winston.git",
    },
    keywords: [
      "winston",
      "logger",
      "logging",
      "logs",
      "sysadmin",
      "bunyan",
      "pino",
      "loglevel",
      "tools",
      "json",
      "stream",
    ],
    dependencies: {
      "@dabh/diagnostics": "^2.0.2",
      "@colors/colors": "1.5.0",
      "async": "^3.2.3",
      "is-stream": "^2.0.0",
      "logform": "^2.4.0",
      "one-time": "^1.0.0",
      "readable-stream": "^3.4.0",
      "safe-stable-stringify": "^2.3.1",
      "stack-trace": "0.0.x",
      "triple-beam": "^1.3.0",
      "winston-transport": "^4.5.0",
    },
    devDependencies: {
      "@babel/cli": "^7.17.0",
      "@babel/core": "^7.17.2",
      "@babel/preset-env": "^7.16.7",
      "@dabh/eslint-config-populist": "^5.0.0",
      "@types/node": "^18.0.0",
      "abstract-winston-transport": "^0.5.1",
      "assume": "^2.2.0",
      "cross-spawn-async": "^2.2.5",
      "eslint": "^8.9.0",
      "hock": "^1.4.1",
      "mocha": "8.1.3",
      "nyc": "^15.1.0",
      "rimraf": "^3.0.2",
      "split2": "^4.1.0",
      "std-mocks": "^1.0.1",
      "through2": "^4.0.2",
      "winston-compat": "^0.1.5",
    },
    main: "./lib/winston.js",
    browser: "./dist/winston",
    types: "./index.d.ts",
    scripts: {
      "lint":
        "eslint lib/*.js lib/winston/*.js lib/winston/**/*.js --resolve-plugins-relative-to ./node_modules/@dabh/eslint-config-populist",
      "test": "mocha",
      "test:coverage": "nyc npm run test:unit",
      "test:unit": "mocha test/unit",
      "test:integration": "mocha test/integration",
      "build": "rimraf dist && babel lib -d dist",
      "prepublishOnly": "npm run build",
    },
    engines: { node: ">= 12.0.0" },
    license: "MIT",
  };
});
var wf = y((gQ, uS) => {
  uS.exports = require("util").deprecate;
});
var Bm = y((yQ, lS) => {
  lS.exports = require("stream");
});
var jm = y((vQ, hS) => {
  "use strict";
  function PP(e, t) {
    var r = this,
      i = this._readableState && this._readableState.destroyed,
      n = this._writableState && this._writableState.destroyed;
    return i || n
      ? (t
          ? t(e)
          : e &&
            (this._writableState
              ? this._writableState.errorEmitted ||
                ((this._writableState.errorEmitted = !0),
                process.nextTick(km, this, e))
              : process.nextTick(km, this, e)),
        this)
      : (this._readableState && (this._readableState.destroyed = !0),
        this._writableState && (this._writableState.destroyed = !0),
        this._destroy(e || null, function (s) {
          !t && s
            ? r._writableState
              ? r._writableState.errorEmitted
                ? process.nextTick(Df, r)
                : ((r._writableState.errorEmitted = !0),
                  process.nextTick(fS, r, s))
              : process.nextTick(fS, r, s)
            : t
            ? (process.nextTick(Df, r), t(s))
            : process.nextTick(Df, r);
        }),
        this);
  }
  function fS(e, t) {
    km(e, t), Df(e);
  }
  function Df(e) {
    (e._writableState && !e._writableState.emitClose) ||
      (e._readableState && !e._readableState.emitClose) ||
      e.emit("close");
  }
  function BP() {
    this._readableState &&
      ((this._readableState.destroyed = !1),
      (this._readableState.reading = !1),
      (this._readableState.ended = !1),
      (this._readableState.endEmitted = !1)),
      this._writableState &&
        ((this._writableState.destroyed = !1),
        (this._writableState.ended = !1),
        (this._writableState.ending = !1),
        (this._writableState.finalCalled = !1),
        (this._writableState.prefinished = !1),
        (this._writableState.finished = !1),
        (this._writableState.errorEmitted = !1));
  }
  function km(e, t) {
    e.emit("error", t);
  }
  function kP(e, t) {
    var r = e._readableState,
      i = e._writableState;
    (r && r.autoDestroy) || (i && i.autoDestroy)
      ? e.destroy(t)
      : e.emit("error", t);
  }
  hS.exports = { destroy: PP, undestroy: BP, errorOrDestroy: kP };
});
var bi = y((wQ, pS) => {
  "use strict";
  var dS = {};
  function Ht(e, t, r) {
    r || (r = Error);
    function i(s, a, o) {
      return typeof t == "string" ? t : t(s, a, o);
    }
    class n extends r {
      constructor(a, o, u) {
        super(i(a, o, u));
      }
    }
    (n.prototype.name = r.name), (n.prototype.code = e), (dS[e] = n);
  }
  function cS(e, t) {
    if (Array.isArray(e)) {
      let r = e.length;
      return (
        (e = e.map((i) => String(i))),
        r > 2
          ? `one of ${t} ${e.slice(0, r - 1).join(", ")}, or ` + e[r - 1]
          : r === 2
          ? `one of ${t} ${e[0]} or ${e[1]}`
          : `of ${t} ${e[0]}`
      );
    } else return `of ${t} ${String(e)}`;
  }
  function jP(e, t, r) {
    return e.substr(!r || r < 0 ? 0 : +r, t.length) === t;
  }
  function UP(e, t, r) {
    return (
      (r === void 0 || r > e.length) && (r = e.length),
      e.substring(r - t.length, r) === t
    );
  }
  function zP(e, t, r) {
    return (
      typeof r != "number" && (r = 0),
      r + t.length > e.length ? !1 : e.indexOf(t, r) !== -1
    );
  }
  Ht(
    "ERR_INVALID_OPT_VALUE",
    function (e, t) {
      return 'The value "' + t + '" is invalid for option "' + e + '"';
    },
    TypeError,
  );
  Ht(
    "ERR_INVALID_ARG_TYPE",
    function (e, t, r) {
      let i;
      typeof t == "string" && jP(t, "not ")
        ? ((i = "must not be"), (t = t.replace(/^not /, "")))
        : (i = "must be");
      let n;
      if (UP(e, " argument")) n = `The ${e} ${i} ${cS(t, "type")}`;
      else {
        let s = zP(e, ".") ? "property" : "argument";
        n = `The "${e}" ${s} ${i} ${cS(t, "type")}`;
      }
      return (n += `. Received type ${typeof r}`), n;
    },
    TypeError,
  );
  Ht("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
  Ht("ERR_METHOD_NOT_IMPLEMENTED", function (e) {
    return "The " + e + " method is not implemented";
  });
  Ht("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
  Ht("ERR_STREAM_DESTROYED", function (e) {
    return "Cannot call " + e + " after a stream was destroyed";
  });
  Ht("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
  Ht("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
  Ht("ERR_STREAM_WRITE_AFTER_END", "write after end");
  Ht(
    "ERR_STREAM_NULL_VALUES",
    "May not write null values to stream",
    TypeError,
  );
  Ht(
    "ERR_UNKNOWN_ENCODING",
    function (e) {
      return "Unknown encoding: " + e;
    },
    TypeError,
  );
  Ht("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
  pS.exports.codes = dS;
});
var Um = y((DQ, mS) => {
  "use strict";
  var $P = bi().codes.ERR_INVALID_OPT_VALUE;
  function WP(e, t, r) {
    return e.highWaterMark != null ? e.highWaterMark : t ? e[r] : null;
  }
  function GP(e, t, r, i) {
    var n = WP(t, i, r);
    if (n != null) {
      if (!(isFinite(n) && Math.floor(n) === n) || n < 0) {
        var s = i ? r : "highWaterMark";
        throw new $P(s, n);
      }
      return Math.floor(n);
    }
    return e.objectMode ? 16 : 16 * 1024;
  }
  mS.exports = { getHighWaterMark: GP };
});
var gS = y((bQ, zm) => {
  typeof Object.create == "function"
    ? (zm.exports = function (t, r) {
        r &&
          ((t.super_ = r),
          (t.prototype = Object.create(r.prototype, {
            constructor: {
              value: t,
              enumerable: !1,
              writable: !0,
              configurable: !0,
            },
          })));
      })
    : (zm.exports = function (t, r) {
        if (r) {
          t.super_ = r;
          var i = function () {};
          (i.prototype = r.prototype),
            (t.prototype = new i()),
            (t.prototype.constructor = t);
        }
      });
});
var je = y((EQ, Wm) => {
  try {
    if ((($m = require("util")), typeof $m.inherits != "function")) throw "";
    Wm.exports = $m.inherits;
  } catch {
    Wm.exports = gS();
  }
  var $m;
});
var DS = y((_Q, wS) => {
  "use strict";
  function yS(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      t &&
        (i = i.filter(function (n) {
          return Object.getOwnPropertyDescriptor(e, n).enumerable;
        })),
        r.push.apply(r, i);
    }
    return r;
  }
  function HP(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t] != null ? arguments[t] : {};
      t % 2
        ? yS(Object(r), !0).forEach(function (i) {
            YP(e, i, r[i]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : yS(Object(r)).forEach(function (i) {
            Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(r, i));
          });
    }
    return e;
  }
  function YP(e, t, r) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = r),
      e
    );
  }
  function VP(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function vS(e, t) {
    for (var r = 0; r < t.length; r++) {
      var i = t[r];
      (i.enumerable = i.enumerable || !1),
        (i.configurable = !0),
        "value" in i && (i.writable = !0),
        Object.defineProperty(e, i.key, i);
    }
  }
  function XP(e, t, r) {
    return t && vS(e.prototype, t), r && vS(e, r), e;
  }
  var ZP = require("buffer"),
    bf = ZP.Buffer,
    KP = require("util"),
    Gm = KP.inspect,
    QP = (Gm && Gm.custom) || "inspect";
  function JP(e, t, r) {
    bf.prototype.copy.call(e, t, r);
  }
  wS.exports = (function () {
    function e() {
      VP(this, e), (this.head = null), (this.tail = null), (this.length = 0);
    }
    return (
      XP(e, [
        {
          key: "push",
          value: function (r) {
            var i = { data: r, next: null };
            this.length > 0 ? (this.tail.next = i) : (this.head = i),
              (this.tail = i),
              ++this.length;
          },
        },
        {
          key: "unshift",
          value: function (r) {
            var i = { data: r, next: this.head };
            this.length === 0 && (this.tail = i),
              (this.head = i),
              ++this.length;
          },
        },
        {
          key: "shift",
          value: function () {
            if (this.length !== 0) {
              var r = this.head.data;
              return (
                this.length === 1
                  ? (this.head = this.tail = null)
                  : (this.head = this.head.next),
                --this.length,
                r
              );
            }
          },
        },
        {
          key: "clear",
          value: function () {
            (this.head = this.tail = null), (this.length = 0);
          },
        },
        {
          key: "join",
          value: function (r) {
            if (this.length === 0) return "";
            for (var i = this.head, n = "" + i.data; (i = i.next); )
              n += r + i.data;
            return n;
          },
        },
        {
          key: "concat",
          value: function (r) {
            if (this.length === 0) return bf.alloc(0);
            for (var i = bf.allocUnsafe(r >>> 0), n = this.head, s = 0; n; )
              JP(n.data, i, s), (s += n.data.length), (n = n.next);
            return i;
          },
        },
        {
          key: "consume",
          value: function (r, i) {
            var n;
            return (
              r < this.head.data.length
                ? ((n = this.head.data.slice(0, r)),
                  (this.head.data = this.head.data.slice(r)))
                : r === this.head.data.length
                ? (n = this.shift())
                : (n = i ? this._getString(r) : this._getBuffer(r)),
              n
            );
          },
        },
        {
          key: "first",
          value: function () {
            return this.head.data;
          },
        },
        {
          key: "_getString",
          value: function (r) {
            var i = this.head,
              n = 1,
              s = i.data;
            for (r -= s.length; (i = i.next); ) {
              var a = i.data,
                o = r > a.length ? a.length : r;
              if (
                (o === a.length ? (s += a) : (s += a.slice(0, r)),
                (r -= o),
                r === 0)
              ) {
                o === a.length
                  ? (++n,
                    i.next
                      ? (this.head = i.next)
                      : (this.head = this.tail = null))
                  : ((this.head = i), (i.data = a.slice(o)));
                break;
              }
              ++n;
            }
            return (this.length -= n), s;
          },
        },
        {
          key: "_getBuffer",
          value: function (r) {
            var i = bf.allocUnsafe(r),
              n = this.head,
              s = 1;
            for (n.data.copy(i), r -= n.data.length; (n = n.next); ) {
              var a = n.data,
                o = r > a.length ? a.length : r;
              if ((a.copy(i, i.length - r, 0, o), (r -= o), r === 0)) {
                o === a.length
                  ? (++s,
                    n.next
                      ? (this.head = n.next)
                      : (this.head = this.tail = null))
                  : ((this.head = n), (n.data = a.slice(o)));
                break;
              }
              ++s;
            }
            return (this.length -= s), i;
          },
        },
        {
          key: QP,
          value: function (r, i) {
            return Gm(this, HP({}, i, { depth: 0, customInspect: !1 }));
          },
        },
      ]),
      e
    );
  })();
});
var _S = y((Hm, ES) => {
  /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */ var Ef = require("buffer"),
    mr = Ef.Buffer;
  function bS(e, t) {
    for (var r in e) t[r] = e[r];
  }
  mr.from && mr.alloc && mr.allocUnsafe && mr.allocUnsafeSlow
    ? (ES.exports = Ef)
    : (bS(Ef, Hm), (Hm.Buffer = mn));
  function mn(e, t, r) {
    return mr(e, t, r);
  }
  mn.prototype = Object.create(mr.prototype);
  bS(mr, mn);
  mn.from = function (e, t, r) {
    if (typeof e == "number")
      throw new TypeError("Argument must not be a number");
    return mr(e, t, r);
  };
  mn.alloc = function (e, t, r) {
    if (typeof e != "number") throw new TypeError("Argument must be a number");
    var i = mr(e);
    return (
      t !== void 0
        ? typeof r == "string"
          ? i.fill(t, r)
          : i.fill(t)
        : i.fill(0),
      i
    );
  };
  mn.allocUnsafe = function (e) {
    if (typeof e != "number") throw new TypeError("Argument must be a number");
    return mr(e);
  };
  mn.allocUnsafeSlow = function (e) {
    if (typeof e != "number") throw new TypeError("Argument must be a number");
    return Ef.SlowBuffer(e);
  };
});
var Xm = y((xS) => {
  "use strict";
  var Vm = _S().Buffer,
    SS =
      Vm.isEncoding ||
      function (e) {
        switch (((e = "" + e), e && e.toLowerCase())) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
          case "raw":
            return !0;
          default:
            return !1;
        }
      };
  function eB(e) {
    if (!e) return "utf8";
    for (var t; ; )
      switch (e) {
        case "utf8":
        case "utf-8":
          return "utf8";
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return "utf16le";
        case "latin1":
        case "binary":
          return "latin1";
        case "base64":
        case "ascii":
        case "hex":
          return e;
        default:
          if (t) return;
          (e = ("" + e).toLowerCase()), (t = !0);
      }
  }
  function tB(e) {
    var t = eB(e);
    if (typeof t != "string" && (Vm.isEncoding === SS || !SS(e)))
      throw new Error("Unknown encoding: " + e);
    return t || e;
  }
  xS.StringDecoder = io;
  function io(e) {
    this.encoding = tB(e);
    var t;
    switch (this.encoding) {
      case "utf16le":
        (this.text = oB), (this.end = uB), (t = 4);
        break;
      case "utf8":
        (this.fillLast = nB), (t = 4);
        break;
      case "base64":
        (this.text = lB), (this.end = fB), (t = 3);
        break;
      default:
        (this.write = hB), (this.end = cB);
        return;
    }
    (this.lastNeed = 0),
      (this.lastTotal = 0),
      (this.lastChar = Vm.allocUnsafe(t));
  }
  io.prototype.write = function (e) {
    if (e.length === 0) return "";
    var t, r;
    if (this.lastNeed) {
      if (((t = this.fillLast(e)), t === void 0)) return "";
      (r = this.lastNeed), (this.lastNeed = 0);
    } else r = 0;
    return r < e.length ? (t ? t + this.text(e, r) : this.text(e, r)) : t || "";
  };
  io.prototype.end = aB;
  io.prototype.text = sB;
  io.prototype.fillLast = function (e) {
    if (this.lastNeed <= e.length)
      return (
        e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed),
        this.lastChar.toString(this.encoding, 0, this.lastTotal)
      );
    e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length),
      (this.lastNeed -= e.length);
  };
  function Ym(e) {
    return e <= 127
      ? 0
      : e >> 5 === 6
      ? 2
      : e >> 4 === 14
      ? 3
      : e >> 3 === 30
      ? 4
      : e >> 6 === 2
      ? -1
      : -2;
  }
  function rB(e, t, r) {
    var i = t.length - 1;
    if (i < r) return 0;
    var n = Ym(t[i]);
    return n >= 0
      ? (n > 0 && (e.lastNeed = n - 1), n)
      : --i < r || n === -2
      ? 0
      : ((n = Ym(t[i])),
        n >= 0
          ? (n > 0 && (e.lastNeed = n - 2), n)
          : --i < r || n === -2
          ? 0
          : ((n = Ym(t[i])),
            n >= 0
              ? (n > 0 && (n === 2 ? (n = 0) : (e.lastNeed = n - 3)), n)
              : 0));
  }
  function iB(e, t, r) {
    if ((t[0] & 192) !== 128) return (e.lastNeed = 0), "\uFFFD";
    if (e.lastNeed > 1 && t.length > 1) {
      if ((t[1] & 192) !== 128) return (e.lastNeed = 1), "\uFFFD";
      if (e.lastNeed > 2 && t.length > 2 && (t[2] & 192) !== 128)
        return (e.lastNeed = 2), "\uFFFD";
    }
  }
  function nB(e) {
    var t = this.lastTotal - this.lastNeed,
      r = iB(this, e, t);
    if (r !== void 0) return r;
    if (this.lastNeed <= e.length)
      return (
        e.copy(this.lastChar, t, 0, this.lastNeed),
        this.lastChar.toString(this.encoding, 0, this.lastTotal)
      );
    e.copy(this.lastChar, t, 0, e.length), (this.lastNeed -= e.length);
  }
  function sB(e, t) {
    var r = rB(this, e, t);
    if (!this.lastNeed) return e.toString("utf8", t);
    this.lastTotal = r;
    var i = e.length - (r - this.lastNeed);
    return e.copy(this.lastChar, 0, i), e.toString("utf8", t, i);
  }
  function aB(e) {
    var t = e && e.length ? this.write(e) : "";
    return this.lastNeed ? t + "\uFFFD" : t;
  }
  function oB(e, t) {
    if ((e.length - t) % 2 === 0) {
      var r = e.toString("utf16le", t);
      if (r) {
        var i = r.charCodeAt(r.length - 1);
        if (i >= 55296 && i <= 56319)
          return (
            (this.lastNeed = 2),
            (this.lastTotal = 4),
            (this.lastChar[0] = e[e.length - 2]),
            (this.lastChar[1] = e[e.length - 1]),
            r.slice(0, -1)
          );
      }
      return r;
    }
    return (
      (this.lastNeed = 1),
      (this.lastTotal = 2),
      (this.lastChar[0] = e[e.length - 1]),
      e.toString("utf16le", t, e.length - 1)
    );
  }
  function uB(e) {
    var t = e && e.length ? this.write(e) : "";
    if (this.lastNeed) {
      var r = this.lastTotal - this.lastNeed;
      return t + this.lastChar.toString("utf16le", 0, r);
    }
    return t;
  }
  function lB(e, t) {
    var r = (e.length - t) % 3;
    return r === 0
      ? e.toString("base64", t)
      : ((this.lastNeed = 3 - r),
        (this.lastTotal = 3),
        r === 1
          ? (this.lastChar[0] = e[e.length - 1])
          : ((this.lastChar[0] = e[e.length - 2]),
            (this.lastChar[1] = e[e.length - 1])),
        e.toString("base64", t, e.length - r));
  }
  function fB(e) {
    var t = e && e.length ? this.write(e) : "";
    return this.lastNeed
      ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed)
      : t;
  }
  function hB(e) {
    return e.toString(this.encoding);
  }
  function cB(e) {
    return e && e.length ? this.write(e) : "";
  }
});
var _f = y((xQ, TS) => {
  "use strict";
  var CS = bi().codes.ERR_STREAM_PREMATURE_CLOSE;
  function dB(e) {
    var t = !1;
    return function () {
      if (!t) {
        t = !0;
        for (var r = arguments.length, i = new Array(r), n = 0; n < r; n++)
          i[n] = arguments[n];
        e.apply(this, i);
      }
    };
  }
  function pB() {}
  function mB(e) {
    return e.setHeader && typeof e.abort == "function";
  }
  function OS(e, t, r) {
    if (typeof t == "function") return OS(e, null, t);
    t || (t = {}), (r = dB(r || pB));
    var i = t.readable || (t.readable !== !1 && e.readable),
      n = t.writable || (t.writable !== !1 && e.writable),
      s = function () {
        e.writable || o();
      },
      a = e._writableState && e._writableState.finished,
      o = function () {
        (n = !1), (a = !0), i || r.call(e);
      },
      u = e._readableState && e._readableState.endEmitted,
      l = function () {
        (i = !1), (u = !0), n || r.call(e);
      },
      f = function (g) {
        r.call(e, g);
      },
      h = function () {
        var g;
        if (i && !u)
          return (
            (!e._readableState || !e._readableState.ended) && (g = new CS()),
            r.call(e, g)
          );
        if (n && !a)
          return (
            (!e._writableState || !e._writableState.ended) && (g = new CS()),
            r.call(e, g)
          );
      },
      c = function () {
        e.req.on("finish", o);
      };
    return (
      mB(e)
        ? (e.on("complete", o),
          e.on("abort", h),
          e.req ? c() : e.on("request", c))
        : n && !e._writableState && (e.on("end", s), e.on("close", s)),
      e.on("end", l),
      e.on("finish", o),
      t.error !== !1 && e.on("error", f),
      e.on("close", h),
      function () {
        e.removeListener("complete", o),
          e.removeListener("abort", h),
          e.removeListener("request", c),
          e.req && e.req.removeListener("finish", o),
          e.removeListener("end", s),
          e.removeListener("close", s),
          e.removeListener("finish", o),
          e.removeListener("end", l),
          e.removeListener("error", f),
          e.removeListener("close", h);
      }
    );
  }
  TS.exports = OS;
});
var RS = y((CQ, FS) => {
  "use strict";
  var Sf;
  function Ei(e, t, r) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = r),
      e
    );
  }
  var gB = _f(),
    _i = Symbol("lastResolve"),
    gn = Symbol("lastReject"),
    no = Symbol("error"),
    xf = Symbol("ended"),
    yn = Symbol("lastPromise"),
    Zm = Symbol("handlePromise"),
    vn = Symbol("stream");
  function Si(e, t) {
    return { value: e, done: t };
  }
  function yB(e) {
    var t = e[_i];
    if (t !== null) {
      var r = e[vn].read();
      r !== null &&
        ((e[yn] = null), (e[_i] = null), (e[gn] = null), t(Si(r, !1)));
    }
  }
  function vB(e) {
    process.nextTick(yB, e);
  }
  function wB(e, t) {
    return function (r, i) {
      e.then(function () {
        if (t[xf]) {
          r(Si(void 0, !0));
          return;
        }
        t[Zm](r, i);
      }, i);
    };
  }
  var DB = Object.getPrototypeOf(function () {}),
    bB = Object.setPrototypeOf(
      ((Sf = {
        get stream() {
          return this[vn];
        },
        next: function () {
          var t = this,
            r = this[no];
          if (r !== null) return Promise.reject(r);
          if (this[xf]) return Promise.resolve(Si(void 0, !0));
          if (this[vn].destroyed)
            return new Promise(function (a, o) {
              process.nextTick(function () {
                t[no] ? o(t[no]) : a(Si(void 0, !0));
              });
            });
          var i = this[yn],
            n;
          if (i) n = new Promise(wB(i, this));
          else {
            var s = this[vn].read();
            if (s !== null) return Promise.resolve(Si(s, !1));
            n = new Promise(this[Zm]);
          }
          return (this[yn] = n), n;
        },
      }),
      Ei(Sf, Symbol.asyncIterator, function () {
        return this;
      }),
      Ei(Sf, "return", function () {
        var t = this;
        return new Promise(function (r, i) {
          t[vn].destroy(null, function (n) {
            if (n) {
              i(n);
              return;
            }
            r(Si(void 0, !0));
          });
        });
      }),
      Sf),
      DB,
    ),
    EB = function (t) {
      var r,
        i = Object.create(
          bB,
          ((r = {}),
          Ei(r, vn, { value: t, writable: !0 }),
          Ei(r, _i, { value: null, writable: !0 }),
          Ei(r, gn, { value: null, writable: !0 }),
          Ei(r, no, { value: null, writable: !0 }),
          Ei(r, xf, { value: t._readableState.endEmitted, writable: !0 }),
          Ei(r, Zm, {
            value: function (s, a) {
              var o = i[vn].read();
              o
                ? ((i[yn] = null), (i[_i] = null), (i[gn] = null), s(Si(o, !1)))
                : ((i[_i] = s), (i[gn] = a));
            },
            writable: !0,
          }),
          r),
        );
      return (
        (i[yn] = null),
        gB(t, function (n) {
          if (n && n.code !== "ERR_STREAM_PREMATURE_CLOSE") {
            var s = i[gn];
            s !== null &&
              ((i[yn] = null), (i[_i] = null), (i[gn] = null), s(n)),
              (i[no] = n);
            return;
          }
          var a = i[_i];
          a !== null &&
            ((i[yn] = null), (i[_i] = null), (i[gn] = null), a(Si(void 0, !0))),
            (i[xf] = !0);
        }),
        t.on("readable", vB.bind(null, i)),
        i
      );
    };
  FS.exports = EB;
});
var MS = y((OQ, IS) => {
  "use strict";
  function AS(e, t, r, i, n, s, a) {
    try {
      var o = e[s](a),
        u = o.value;
    } catch (l) {
      r(l);
      return;
    }
    o.done ? t(u) : Promise.resolve(u).then(i, n);
  }
  function _B(e) {
    return function () {
      var t = this,
        r = arguments;
      return new Promise(function (i, n) {
        var s = e.apply(t, r);
        function a(u) {
          AS(s, i, n, a, o, "next", u);
        }
        function o(u) {
          AS(s, i, n, a, o, "throw", u);
        }
        a(void 0);
      });
    };
  }
  function NS(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      t &&
        (i = i.filter(function (n) {
          return Object.getOwnPropertyDescriptor(e, n).enumerable;
        })),
        r.push.apply(r, i);
    }
    return r;
  }
  function SB(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t] != null ? arguments[t] : {};
      t % 2
        ? NS(Object(r), !0).forEach(function (i) {
            xB(e, i, r[i]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : NS(Object(r)).forEach(function (i) {
            Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(r, i));
          });
    }
    return e;
  }
  function xB(e, t, r) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = r),
      e
    );
  }
  var CB = bi().codes.ERR_INVALID_ARG_TYPE;
  function OB(e, t, r) {
    var i;
    if (t && typeof t.next == "function") i = t;
    else if (t && t[Symbol.asyncIterator]) i = t[Symbol.asyncIterator]();
    else if (t && t[Symbol.iterator]) i = t[Symbol.iterator]();
    else throw new CB("iterable", ["Iterable"], t);
    var n = new e(SB({ objectMode: !0 }, r)),
      s = !1;
    n._read = function () {
      s || ((s = !0), a());
    };
    function a() {
      return o.apply(this, arguments);
    }
    function o() {
      return (
        (o = _B(function* () {
          try {
            var u = yield i.next(),
              l = u.value,
              f = u.done;
            f ? n.push(null) : n.push(yield l) ? a() : (s = !1);
          } catch (h) {
            n.destroy(h);
          }
        })),
        o.apply(this, arguments)
      );
    }
    return n;
  }
  IS.exports = OB;
});
var ag = y((FQ, WS) => {
  "use strict";
  WS.exports = oe;
  var Cs;
  oe.ReadableState = BS;
  var TQ = require("events").EventEmitter,
    PS = function (t, r) {
      return t.listeners(r).length;
    },
    ao = Bm(),
    Cf = require("buffer").Buffer,
    TB = global.Uint8Array || function () {};
  function FB(e) {
    return Cf.from(e);
  }
  function RB(e) {
    return Cf.isBuffer(e) || e instanceof TB;
  }
  var Km = require("util"),
    te;
  Km && Km.debuglog ? (te = Km.debuglog("stream")) : (te = function () {});
  var AB = DS(),
    ng = jm(),
    NB = Um(),
    IB = NB.getHighWaterMark,
    Of = bi().codes,
    MB = Of.ERR_INVALID_ARG_TYPE,
    LB = Of.ERR_STREAM_PUSH_AFTER_EOF,
    qB = Of.ERR_METHOD_NOT_IMPLEMENTED,
    PB = Of.ERR_STREAM_UNSHIFT_AFTER_END_EVENT,
    Os,
    Qm,
    Jm;
  je()(oe, ao);
  var so = ng.errorOrDestroy,
    eg = ["error", "close", "destroy", "pause", "resume"];
  function BB(e, t, r) {
    if (typeof e.prependListener == "function") return e.prependListener(t, r);
    !e._events || !e._events[t]
      ? e.on(t, r)
      : Array.isArray(e._events[t])
      ? e._events[t].unshift(r)
      : (e._events[t] = [r, e._events[t]]);
  }
  function BS(e, t, r) {
    (Cs = Cs || wn()),
      (e = e || {}),
      typeof r != "boolean" && (r = t instanceof Cs),
      (this.objectMode = !!e.objectMode),
      r && (this.objectMode = this.objectMode || !!e.readableObjectMode),
      (this.highWaterMark = IB(this, e, "readableHighWaterMark", r)),
      (this.buffer = new AB()),
      (this.length = 0),
      (this.pipes = null),
      (this.pipesCount = 0),
      (this.flowing = null),
      (this.ended = !1),
      (this.endEmitted = !1),
      (this.reading = !1),
      (this.sync = !0),
      (this.needReadable = !1),
      (this.emittedReadable = !1),
      (this.readableListening = !1),
      (this.resumeScheduled = !1),
      (this.paused = !0),
      (this.emitClose = e.emitClose !== !1),
      (this.autoDestroy = !!e.autoDestroy),
      (this.destroyed = !1),
      (this.defaultEncoding = e.defaultEncoding || "utf8"),
      (this.awaitDrain = 0),
      (this.readingMore = !1),
      (this.decoder = null),
      (this.encoding = null),
      e.encoding &&
        (Os || (Os = Xm().StringDecoder),
        (this.decoder = new Os(e.encoding)),
        (this.encoding = e.encoding));
  }
  function oe(e) {
    if (((Cs = Cs || wn()), !(this instanceof oe))) return new oe(e);
    var t = this instanceof Cs;
    (this._readableState = new BS(e, this, t)),
      (this.readable = !0),
      e &&
        (typeof e.read == "function" && (this._read = e.read),
        typeof e.destroy == "function" && (this._destroy = e.destroy)),
      ao.call(this);
  }
  Object.defineProperty(oe.prototype, "destroyed", {
    enumerable: !1,
    get: function () {
      return this._readableState === void 0
        ? !1
        : this._readableState.destroyed;
    },
    set: function (t) {
      !this._readableState || (this._readableState.destroyed = t);
    },
  });
  oe.prototype.destroy = ng.destroy;
  oe.prototype._undestroy = ng.undestroy;
  oe.prototype._destroy = function (e, t) {
    t(e);
  };
  oe.prototype.push = function (e, t) {
    var r = this._readableState,
      i;
    return (
      r.objectMode
        ? (i = !0)
        : typeof e == "string" &&
          ((t = t || r.defaultEncoding),
          t !== r.encoding && ((e = Cf.from(e, t)), (t = "")),
          (i = !0)),
      kS(this, e, t, !1, i)
    );
  };
  oe.prototype.unshift = function (e) {
    return kS(this, e, null, !0, !1);
  };
  function kS(e, t, r, i, n) {
    te("readableAddChunk", t);
    var s = e._readableState;
    if (t === null) (s.reading = !1), UB(e, s);
    else {
      var a;
      if ((n || (a = kB(s, t)), a)) so(e, a);
      else if (s.objectMode || (t && t.length > 0))
        if (
          (typeof t != "string" &&
            !s.objectMode &&
            Object.getPrototypeOf(t) !== Cf.prototype &&
            (t = FB(t)),
          i)
        )
          s.endEmitted ? so(e, new PB()) : tg(e, s, t, !0);
        else if (s.ended) so(e, new LB());
        else {
          if (s.destroyed) return !1;
          (s.reading = !1),
            s.decoder && !r
              ? ((t = s.decoder.write(t)),
                s.objectMode || t.length !== 0 ? tg(e, s, t, !1) : ig(e, s))
              : tg(e, s, t, !1);
        }
      else i || ((s.reading = !1), ig(e, s));
    }
    return !s.ended && (s.length < s.highWaterMark || s.length === 0);
  }
  function tg(e, t, r, i) {
    t.flowing && t.length === 0 && !t.sync
      ? ((t.awaitDrain = 0), e.emit("data", r))
      : ((t.length += t.objectMode ? 1 : r.length),
        i ? t.buffer.unshift(r) : t.buffer.push(r),
        t.needReadable && Tf(e)),
      ig(e, t);
  }
  function kB(e, t) {
    var r;
    return (
      !RB(t) &&
        typeof t != "string" &&
        t !== void 0 &&
        !e.objectMode &&
        (r = new MB("chunk", ["string", "Buffer", "Uint8Array"], t)),
      r
    );
  }
  oe.prototype.isPaused = function () {
    return this._readableState.flowing === !1;
  };
  oe.prototype.setEncoding = function (e) {
    Os || (Os = Xm().StringDecoder);
    var t = new Os(e);
    (this._readableState.decoder = t),
      (this._readableState.encoding = this._readableState.decoder.encoding);
    for (var r = this._readableState.buffer.head, i = ""; r !== null; )
      (i += t.write(r.data)), (r = r.next);
    return (
      this._readableState.buffer.clear(),
      i !== "" && this._readableState.buffer.push(i),
      (this._readableState.length = i.length),
      this
    );
  };
  var LS = 1073741824;
  function jB(e) {
    return (
      e >= LS
        ? (e = LS)
        : (e--,
          (e |= e >>> 1),
          (e |= e >>> 2),
          (e |= e >>> 4),
          (e |= e >>> 8),
          (e |= e >>> 16),
          e++),
      e
    );
  }
  function qS(e, t) {
    return e <= 0 || (t.length === 0 && t.ended)
      ? 0
      : t.objectMode
      ? 1
      : e !== e
      ? t.flowing && t.length
        ? t.buffer.head.data.length
        : t.length
      : (e > t.highWaterMark && (t.highWaterMark = jB(e)),
        e <= t.length ? e : t.ended ? t.length : ((t.needReadable = !0), 0));
  }
  oe.prototype.read = function (e) {
    te("read", e), (e = parseInt(e, 10));
    var t = this._readableState,
      r = e;
    if (
      (e !== 0 && (t.emittedReadable = !1),
      e === 0 &&
        t.needReadable &&
        ((t.highWaterMark !== 0 ? t.length >= t.highWaterMark : t.length > 0) ||
          t.ended))
    )
      return (
        te("read: emitReadable", t.length, t.ended),
        t.length === 0 && t.ended ? rg(this) : Tf(this),
        null
      );
    if (((e = qS(e, t)), e === 0 && t.ended))
      return t.length === 0 && rg(this), null;
    var i = t.needReadable;
    te("need readable", i),
      (t.length === 0 || t.length - e < t.highWaterMark) &&
        ((i = !0), te("length less than watermark", i)),
      t.ended || t.reading
        ? ((i = !1), te("reading or ended", i))
        : i &&
          (te("do read"),
          (t.reading = !0),
          (t.sync = !0),
          t.length === 0 && (t.needReadable = !0),
          this._read(t.highWaterMark),
          (t.sync = !1),
          t.reading || (e = qS(r, t)));
    var n;
    return (
      e > 0 ? (n = zS(e, t)) : (n = null),
      n === null
        ? ((t.needReadable = t.length <= t.highWaterMark), (e = 0))
        : ((t.length -= e), (t.awaitDrain = 0)),
      t.length === 0 &&
        (t.ended || (t.needReadable = !0), r !== e && t.ended && rg(this)),
      n !== null && this.emit("data", n),
      n
    );
  };
  function UB(e, t) {
    if ((te("onEofChunk"), !t.ended)) {
      if (t.decoder) {
        var r = t.decoder.end();
        r &&
          r.length &&
          (t.buffer.push(r), (t.length += t.objectMode ? 1 : r.length));
      }
      (t.ended = !0),
        t.sync
          ? Tf(e)
          : ((t.needReadable = !1),
            t.emittedReadable || ((t.emittedReadable = !0), jS(e)));
    }
  }
  function Tf(e) {
    var t = e._readableState;
    te("emitReadable", t.needReadable, t.emittedReadable),
      (t.needReadable = !1),
      t.emittedReadable ||
        (te("emitReadable", t.flowing),
        (t.emittedReadable = !0),
        process.nextTick(jS, e));
  }
  function jS(e) {
    var t = e._readableState;
    te("emitReadable_", t.destroyed, t.length, t.ended),
      !t.destroyed &&
        (t.length || t.ended) &&
        (e.emit("readable"), (t.emittedReadable = !1)),
      (t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark),
      sg(e);
  }
  function ig(e, t) {
    t.readingMore || ((t.readingMore = !0), process.nextTick(zB, e, t));
  }
  function zB(e, t) {
    for (
      ;
      !t.reading &&
      !t.ended &&
      (t.length < t.highWaterMark || (t.flowing && t.length === 0));

    ) {
      var r = t.length;
      if ((te("maybeReadMore read 0"), e.read(0), r === t.length)) break;
    }
    t.readingMore = !1;
  }
  oe.prototype._read = function (e) {
    so(this, new qB("_read()"));
  };
  oe.prototype.pipe = function (e, t) {
    var r = this,
      i = this._readableState;
    switch (i.pipesCount) {
      case 0:
        i.pipes = e;
        break;
      case 1:
        i.pipes = [i.pipes, e];
        break;
      default:
        i.pipes.push(e);
        break;
    }
    (i.pipesCount += 1), te("pipe count=%d opts=%j", i.pipesCount, t);
    var n =
        (!t || t.end !== !1) && e !== process.stdout && e !== process.stderr,
      s = n ? o : C;
    i.endEmitted ? process.nextTick(s) : r.once("end", s), e.on("unpipe", a);
    function a(S, O) {
      te("onunpipe"),
        S === r && O && O.hasUnpiped === !1 && ((O.hasUnpiped = !0), f());
    }
    function o() {
      te("onend"), e.end();
    }
    var u = $B(r);
    e.on("drain", u);
    var l = !1;
    function f() {
      te("cleanup"),
        e.removeListener("close", d),
        e.removeListener("finish", g),
        e.removeListener("drain", u),
        e.removeListener("error", c),
        e.removeListener("unpipe", a),
        r.removeListener("end", o),
        r.removeListener("end", C),
        r.removeListener("data", h),
        (l = !0),
        i.awaitDrain &&
          (!e._writableState || e._writableState.needDrain) &&
          u();
    }
    r.on("data", h);
    function h(S) {
      te("ondata");
      var O = e.write(S);
      te("dest.write", O),
        O === !1 &&
          (((i.pipesCount === 1 && i.pipes === e) ||
            (i.pipesCount > 1 && $S(i.pipes, e) !== -1)) &&
            !l &&
            (te("false write response, pause", i.awaitDrain), i.awaitDrain++),
          r.pause());
    }
    function c(S) {
      te("onerror", S),
        C(),
        e.removeListener("error", c),
        PS(e, "error") === 0 && so(e, S);
    }
    BB(e, "error", c);
    function d() {
      e.removeListener("finish", g), C();
    }
    e.once("close", d);
    function g() {
      te("onfinish"), e.removeListener("close", d), C();
    }
    e.once("finish", g);
    function C() {
      te("unpipe"), r.unpipe(e);
    }
    return e.emit("pipe", r), i.flowing || (te("pipe resume"), r.resume()), e;
  };
  function $B(e) {
    return function () {
      var r = e._readableState;
      te("pipeOnDrain", r.awaitDrain),
        r.awaitDrain && r.awaitDrain--,
        r.awaitDrain === 0 && PS(e, "data") && ((r.flowing = !0), sg(e));
    };
  }
  oe.prototype.unpipe = function (e) {
    var t = this._readableState,
      r = { hasUnpiped: !1 };
    if (t.pipesCount === 0) return this;
    if (t.pipesCount === 1)
      return e && e !== t.pipes
        ? this
        : (e || (e = t.pipes),
          (t.pipes = null),
          (t.pipesCount = 0),
          (t.flowing = !1),
          e && e.emit("unpipe", this, r),
          this);
    if (!e) {
      var i = t.pipes,
        n = t.pipesCount;
      (t.pipes = null), (t.pipesCount = 0), (t.flowing = !1);
      for (var s = 0; s < n; s++) i[s].emit("unpipe", this, { hasUnpiped: !1 });
      return this;
    }
    var a = $S(t.pipes, e);
    return a === -1
      ? this
      : (t.pipes.splice(a, 1),
        (t.pipesCount -= 1),
        t.pipesCount === 1 && (t.pipes = t.pipes[0]),
        e.emit("unpipe", this, r),
        this);
  };
  oe.prototype.on = function (e, t) {
    var r = ao.prototype.on.call(this, e, t),
      i = this._readableState;
    return (
      e === "data"
        ? ((i.readableListening = this.listenerCount("readable") > 0),
          i.flowing !== !1 && this.resume())
        : e === "readable" &&
          !i.endEmitted &&
          !i.readableListening &&
          ((i.readableListening = i.needReadable = !0),
          (i.flowing = !1),
          (i.emittedReadable = !1),
          te("on readable", i.length, i.reading),
          i.length ? Tf(this) : i.reading || process.nextTick(WB, this)),
      r
    );
  };
  oe.prototype.addListener = oe.prototype.on;
  oe.prototype.removeListener = function (e, t) {
    var r = ao.prototype.removeListener.call(this, e, t);
    return e === "readable" && process.nextTick(US, this), r;
  };
  oe.prototype.removeAllListeners = function (e) {
    var t = ao.prototype.removeAllListeners.apply(this, arguments);
    return (e === "readable" || e === void 0) && process.nextTick(US, this), t;
  };
  function US(e) {
    var t = e._readableState;
    (t.readableListening = e.listenerCount("readable") > 0),
      t.resumeScheduled && !t.paused
        ? (t.flowing = !0)
        : e.listenerCount("data") > 0 && e.resume();
  }
  function WB(e) {
    te("readable nexttick read 0"), e.read(0);
  }
  oe.prototype.resume = function () {
    var e = this._readableState;
    return (
      e.flowing ||
        (te("resume"), (e.flowing = !e.readableListening), GB(this, e)),
      (e.paused = !1),
      this
    );
  };
  function GB(e, t) {
    t.resumeScheduled || ((t.resumeScheduled = !0), process.nextTick(HB, e, t));
  }
  function HB(e, t) {
    te("resume", t.reading),
      t.reading || e.read(0),
      (t.resumeScheduled = !1),
      e.emit("resume"),
      sg(e),
      t.flowing && !t.reading && e.read(0);
  }
  oe.prototype.pause = function () {
    return (
      te("call pause flowing=%j", this._readableState.flowing),
      this._readableState.flowing !== !1 &&
        (te("pause"), (this._readableState.flowing = !1), this.emit("pause")),
      (this._readableState.paused = !0),
      this
    );
  };
  function sg(e) {
    var t = e._readableState;
    for (te("flow", t.flowing); t.flowing && e.read() !== null; );
  }
  oe.prototype.wrap = function (e) {
    var t = this,
      r = this._readableState,
      i = !1;
    e.on("end", function () {
      if ((te("wrapped end"), r.decoder && !r.ended)) {
        var a = r.decoder.end();
        a && a.length && t.push(a);
      }
      t.push(null);
    }),
      e.on("data", function (a) {
        if (
          (te("wrapped data"),
          r.decoder && (a = r.decoder.write(a)),
          !(r.objectMode && a == null) && !(!r.objectMode && (!a || !a.length)))
        ) {
          var o = t.push(a);
          o || ((i = !0), e.pause());
        }
      });
    for (var n in e)
      this[n] === void 0 &&
        typeof e[n] == "function" &&
        (this[n] = (function (o) {
          return function () {
            return e[o].apply(e, arguments);
          };
        })(n));
    for (var s = 0; s < eg.length; s++)
      e.on(eg[s], this.emit.bind(this, eg[s]));
    return (
      (this._read = function (a) {
        te("wrapped _read", a), i && ((i = !1), e.resume());
      }),
      this
    );
  };
  typeof Symbol == "function" &&
    (oe.prototype[Symbol.asyncIterator] = function () {
      return Qm === void 0 && (Qm = RS()), Qm(this);
    });
  Object.defineProperty(oe.prototype, "readableHighWaterMark", {
    enumerable: !1,
    get: function () {
      return this._readableState.highWaterMark;
    },
  });
  Object.defineProperty(oe.prototype, "readableBuffer", {
    enumerable: !1,
    get: function () {
      return this._readableState && this._readableState.buffer;
    },
  });
  Object.defineProperty(oe.prototype, "readableFlowing", {
    enumerable: !1,
    get: function () {
      return this._readableState.flowing;
    },
    set: function (t) {
      this._readableState && (this._readableState.flowing = t);
    },
  });
  oe._fromList = zS;
  Object.defineProperty(oe.prototype, "readableLength", {
    enumerable: !1,
    get: function () {
      return this._readableState.length;
    },
  });
  function zS(e, t) {
    if (t.length === 0) return null;
    var r;
    return (
      t.objectMode
        ? (r = t.buffer.shift())
        : !e || e >= t.length
        ? (t.decoder
            ? (r = t.buffer.join(""))
            : t.buffer.length === 1
            ? (r = t.buffer.first())
            : (r = t.buffer.concat(t.length)),
          t.buffer.clear())
        : (r = t.buffer.consume(e, t.decoder)),
      r
    );
  }
  function rg(e) {
    var t = e._readableState;
    te("endReadable", t.endEmitted),
      t.endEmitted || ((t.ended = !0), process.nextTick(YB, t, e));
  }
  function YB(e, t) {
    if (
      (te("endReadableNT", e.endEmitted, e.length),
      !e.endEmitted &&
        e.length === 0 &&
        ((e.endEmitted = !0), (t.readable = !1), t.emit("end"), e.autoDestroy))
    ) {
      var r = t._writableState;
      (!r || (r.autoDestroy && r.finished)) && t.destroy();
    }
  }
  typeof Symbol == "function" &&
    (oe.from = function (e, t) {
      return Jm === void 0 && (Jm = MS()), Jm(oe, e, t);
    });
  function $S(e, t) {
    for (var r = 0, i = e.length; r < i; r++) if (e[r] === t) return r;
    return -1;
  }
});
var wn = y((RQ, HS) => {
  "use strict";
  var VB =
    Object.keys ||
    function (e) {
      var t = [];
      for (var r in e) t.push(r);
      return t;
    };
  HS.exports = gr;
  var GS = ag(),
    ug = Af();
  je()(gr, GS);
  for (og = VB(ug.prototype), Ff = 0; Ff < og.length; Ff++)
    (Rf = og[Ff]), gr.prototype[Rf] || (gr.prototype[Rf] = ug.prototype[Rf]);
  var og, Rf, Ff;
  function gr(e) {
    if (!(this instanceof gr)) return new gr(e);
    GS.call(this, e),
      ug.call(this, e),
      (this.allowHalfOpen = !0),
      e &&
        (e.readable === !1 && (this.readable = !1),
        e.writable === !1 && (this.writable = !1),
        e.allowHalfOpen === !1 &&
          ((this.allowHalfOpen = !1), this.once("end", XB)));
  }
  Object.defineProperty(gr.prototype, "writableHighWaterMark", {
    enumerable: !1,
    get: function () {
      return this._writableState.highWaterMark;
    },
  });
  Object.defineProperty(gr.prototype, "writableBuffer", {
    enumerable: !1,
    get: function () {
      return this._writableState && this._writableState.getBuffer();
    },
  });
  Object.defineProperty(gr.prototype, "writableLength", {
    enumerable: !1,
    get: function () {
      return this._writableState.length;
    },
  });
  function XB() {
    this._writableState.ended || process.nextTick(ZB, this);
  }
  function ZB(e) {
    e.end();
  }
  Object.defineProperty(gr.prototype, "destroyed", {
    enumerable: !1,
    get: function () {
      return this._readableState === void 0 || this._writableState === void 0
        ? !1
        : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function (t) {
      this._readableState === void 0 ||
        this._writableState === void 0 ||
        ((this._readableState.destroyed = t),
        (this._writableState.destroyed = t));
    },
  });
});
var Af = y((AQ, QS) => {
  "use strict";
  QS.exports = Oe;
  function VS(e) {
    var t = this;
    (this.next = null),
      (this.entry = null),
      (this.finish = function () {
        _4(t, e);
      });
  }
  var Ts;
  Oe.WritableState = uo;
  var KB = { deprecate: wf() },
    XS = Bm(),
    If = require("buffer").Buffer,
    QB = global.Uint8Array || function () {};
  function JB(e) {
    return If.from(e);
  }
  function e4(e) {
    return If.isBuffer(e) || e instanceof QB;
  }
  var fg = jm(),
    t4 = Um(),
    r4 = t4.getHighWaterMark,
    xi = bi().codes,
    i4 = xi.ERR_INVALID_ARG_TYPE,
    n4 = xi.ERR_METHOD_NOT_IMPLEMENTED,
    s4 = xi.ERR_MULTIPLE_CALLBACK,
    a4 = xi.ERR_STREAM_CANNOT_PIPE,
    o4 = xi.ERR_STREAM_DESTROYED,
    u4 = xi.ERR_STREAM_NULL_VALUES,
    l4 = xi.ERR_STREAM_WRITE_AFTER_END,
    f4 = xi.ERR_UNKNOWN_ENCODING,
    Fs = fg.errorOrDestroy;
  je()(Oe, XS);
  function h4() {}
  function uo(e, t, r) {
    (Ts = Ts || wn()),
      (e = e || {}),
      typeof r != "boolean" && (r = t instanceof Ts),
      (this.objectMode = !!e.objectMode),
      r && (this.objectMode = this.objectMode || !!e.writableObjectMode),
      (this.highWaterMark = r4(this, e, "writableHighWaterMark", r)),
      (this.finalCalled = !1),
      (this.needDrain = !1),
      (this.ending = !1),
      (this.ended = !1),
      (this.finished = !1),
      (this.destroyed = !1);
    var i = e.decodeStrings === !1;
    (this.decodeStrings = !i),
      (this.defaultEncoding = e.defaultEncoding || "utf8"),
      (this.length = 0),
      (this.writing = !1),
      (this.corked = 0),
      (this.sync = !0),
      (this.bufferProcessing = !1),
      (this.onwrite = function (n) {
        v4(t, n);
      }),
      (this.writecb = null),
      (this.writelen = 0),
      (this.bufferedRequest = null),
      (this.lastBufferedRequest = null),
      (this.pendingcb = 0),
      (this.prefinished = !1),
      (this.errorEmitted = !1),
      (this.emitClose = e.emitClose !== !1),
      (this.autoDestroy = !!e.autoDestroy),
      (this.bufferedRequestCount = 0),
      (this.corkedRequestsFree = new VS(this));
  }
  uo.prototype.getBuffer = function () {
    for (var t = this.bufferedRequest, r = []; t; ) r.push(t), (t = t.next);
    return r;
  };
  (function () {
    try {
      Object.defineProperty(uo.prototype, "buffer", {
        get: KB.deprecate(
          function () {
            return this.getBuffer();
          },
          "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.",
          "DEP0003",
        ),
      });
    } catch {}
  })();
  var Nf;
  typeof Symbol == "function" &&
  Symbol.hasInstance &&
  typeof Function.prototype[Symbol.hasInstance] == "function"
    ? ((Nf = Function.prototype[Symbol.hasInstance]),
      Object.defineProperty(Oe, Symbol.hasInstance, {
        value: function (t) {
          return Nf.call(this, t)
            ? !0
            : this !== Oe
            ? !1
            : t && t._writableState instanceof uo;
        },
      }))
    : (Nf = function (t) {
        return t instanceof this;
      });
  function Oe(e) {
    Ts = Ts || wn();
    var t = this instanceof Ts;
    if (!t && !Nf.call(Oe, this)) return new Oe(e);
    (this._writableState = new uo(e, this, t)),
      (this.writable = !0),
      e &&
        (typeof e.write == "function" && (this._write = e.write),
        typeof e.writev == "function" && (this._writev = e.writev),
        typeof e.destroy == "function" && (this._destroy = e.destroy),
        typeof e.final == "function" && (this._final = e.final)),
      XS.call(this);
  }
  Oe.prototype.pipe = function () {
    Fs(this, new a4());
  };
  function c4(e, t) {
    var r = new l4();
    Fs(e, r), process.nextTick(t, r);
  }
  function d4(e, t, r, i) {
    var n;
    return (
      r === null
        ? (n = new u4())
        : typeof r != "string" &&
          !t.objectMode &&
          (n = new i4("chunk", ["string", "Buffer"], r)),
      n ? (Fs(e, n), process.nextTick(i, n), !1) : !0
    );
  }
  Oe.prototype.write = function (e, t, r) {
    var i = this._writableState,
      n = !1,
      s = !i.objectMode && e4(e);
    return (
      s && !If.isBuffer(e) && (e = JB(e)),
      typeof t == "function" && ((r = t), (t = null)),
      s ? (t = "buffer") : t || (t = i.defaultEncoding),
      typeof r != "function" && (r = h4),
      i.ending
        ? c4(this, r)
        : (s || d4(this, i, e, r)) &&
          (i.pendingcb++, (n = m4(this, i, s, e, t, r))),
      n
    );
  };
  Oe.prototype.cork = function () {
    this._writableState.corked++;
  };
  Oe.prototype.uncork = function () {
    var e = this._writableState;
    e.corked &&
      (e.corked--,
      !e.writing &&
        !e.corked &&
        !e.bufferProcessing &&
        e.bufferedRequest &&
        ZS(this, e));
  };
  Oe.prototype.setDefaultEncoding = function (t) {
    if (
      (typeof t == "string" && (t = t.toLowerCase()),
      !(
        [
          "hex",
          "utf8",
          "utf-8",
          "ascii",
          "binary",
          "base64",
          "ucs2",
          "ucs-2",
          "utf16le",
          "utf-16le",
          "raw",
        ].indexOf((t + "").toLowerCase()) > -1
      ))
    )
      throw new f4(t);
    return (this._writableState.defaultEncoding = t), this;
  };
  Object.defineProperty(Oe.prototype, "writableBuffer", {
    enumerable: !1,
    get: function () {
      return this._writableState && this._writableState.getBuffer();
    },
  });
  function p4(e, t, r) {
    return (
      !e.objectMode &&
        e.decodeStrings !== !1 &&
        typeof t == "string" &&
        (t = If.from(t, r)),
      t
    );
  }
  Object.defineProperty(Oe.prototype, "writableHighWaterMark", {
    enumerable: !1,
    get: function () {
      return this._writableState.highWaterMark;
    },
  });
  function m4(e, t, r, i, n, s) {
    if (!r) {
      var a = p4(t, i, n);
      i !== a && ((r = !0), (n = "buffer"), (i = a));
    }
    var o = t.objectMode ? 1 : i.length;
    t.length += o;
    var u = t.length < t.highWaterMark;
    if ((u || (t.needDrain = !0), t.writing || t.corked)) {
      var l = t.lastBufferedRequest;
      (t.lastBufferedRequest = {
        chunk: i,
        encoding: n,
        isBuf: r,
        callback: s,
        next: null,
      }),
        l
          ? (l.next = t.lastBufferedRequest)
          : (t.bufferedRequest = t.lastBufferedRequest),
        (t.bufferedRequestCount += 1);
    } else lg(e, t, !1, o, i, n, s);
    return u;
  }
  function lg(e, t, r, i, n, s, a) {
    (t.writelen = i),
      (t.writecb = a),
      (t.writing = !0),
      (t.sync = !0),
      t.destroyed
        ? t.onwrite(new o4("write"))
        : r
        ? e._writev(n, t.onwrite)
        : e._write(n, s, t.onwrite),
      (t.sync = !1);
  }
  function g4(e, t, r, i, n) {
    --t.pendingcb,
      r
        ? (process.nextTick(n, i),
          process.nextTick(oo, e, t),
          (e._writableState.errorEmitted = !0),
          Fs(e, i))
        : (n(i), (e._writableState.errorEmitted = !0), Fs(e, i), oo(e, t));
  }
  function y4(e) {
    (e.writing = !1),
      (e.writecb = null),
      (e.length -= e.writelen),
      (e.writelen = 0);
  }
  function v4(e, t) {
    var r = e._writableState,
      i = r.sync,
      n = r.writecb;
    if (typeof n != "function") throw new s4();
    if ((y4(r), t)) g4(e, r, i, t, n);
    else {
      var s = KS(r) || e.destroyed;
      !s && !r.corked && !r.bufferProcessing && r.bufferedRequest && ZS(e, r),
        i ? process.nextTick(YS, e, r, s, n) : YS(e, r, s, n);
    }
  }
  function YS(e, t, r, i) {
    r || w4(e, t), t.pendingcb--, i(), oo(e, t);
  }
  function w4(e, t) {
    t.length === 0 && t.needDrain && ((t.needDrain = !1), e.emit("drain"));
  }
  function ZS(e, t) {
    t.bufferProcessing = !0;
    var r = t.bufferedRequest;
    if (e._writev && r && r.next) {
      var i = t.bufferedRequestCount,
        n = new Array(i),
        s = t.corkedRequestsFree;
      s.entry = r;
      for (var a = 0, o = !0; r; )
        (n[a] = r), r.isBuf || (o = !1), (r = r.next), (a += 1);
      (n.allBuffers = o),
        lg(e, t, !0, t.length, n, "", s.finish),
        t.pendingcb++,
        (t.lastBufferedRequest = null),
        s.next
          ? ((t.corkedRequestsFree = s.next), (s.next = null))
          : (t.corkedRequestsFree = new VS(t)),
        (t.bufferedRequestCount = 0);
    } else {
      for (; r; ) {
        var u = r.chunk,
          l = r.encoding,
          f = r.callback,
          h = t.objectMode ? 1 : u.length;
        if (
          (lg(e, t, !1, h, u, l, f),
          (r = r.next),
          t.bufferedRequestCount--,
          t.writing)
        )
          break;
      }
      r === null && (t.lastBufferedRequest = null);
    }
    (t.bufferedRequest = r), (t.bufferProcessing = !1);
  }
  Oe.prototype._write = function (e, t, r) {
    r(new n4("_write()"));
  };
  Oe.prototype._writev = null;
  Oe.prototype.end = function (e, t, r) {
    var i = this._writableState;
    return (
      typeof e == "function"
        ? ((r = e), (e = null), (t = null))
        : typeof t == "function" && ((r = t), (t = null)),
      e != null && this.write(e, t),
      i.corked && ((i.corked = 1), this.uncork()),
      i.ending || E4(this, i, r),
      this
    );
  };
  Object.defineProperty(Oe.prototype, "writableLength", {
    enumerable: !1,
    get: function () {
      return this._writableState.length;
    },
  });
  function KS(e) {
    return (
      e.ending &&
      e.length === 0 &&
      e.bufferedRequest === null &&
      !e.finished &&
      !e.writing
    );
  }
  function D4(e, t) {
    e._final(function (r) {
      t.pendingcb--,
        r && Fs(e, r),
        (t.prefinished = !0),
        e.emit("prefinish"),
        oo(e, t);
    });
  }
  function b4(e, t) {
    !t.prefinished &&
      !t.finalCalled &&
      (typeof e._final == "function" && !t.destroyed
        ? (t.pendingcb++, (t.finalCalled = !0), process.nextTick(D4, e, t))
        : ((t.prefinished = !0), e.emit("prefinish")));
  }
  function oo(e, t) {
    var r = KS(t);
    if (
      r &&
      (b4(e, t),
      t.pendingcb === 0 && ((t.finished = !0), e.emit("finish"), t.autoDestroy))
    ) {
      var i = e._readableState;
      (!i || (i.autoDestroy && i.endEmitted)) && e.destroy();
    }
    return r;
  }
  function E4(e, t, r) {
    (t.ending = !0),
      oo(e, t),
      r && (t.finished ? process.nextTick(r) : e.once("finish", r)),
      (t.ended = !0),
      (e.writable = !1);
  }
  function _4(e, t, r) {
    var i = e.entry;
    for (e.entry = null; i; ) {
      var n = i.callback;
      t.pendingcb--, n(r), (i = i.next);
    }
    t.corkedRequestsFree.next = e;
  }
  Object.defineProperty(Oe.prototype, "destroyed", {
    enumerable: !1,
    get: function () {
      return this._writableState === void 0
        ? !1
        : this._writableState.destroyed;
    },
    set: function (t) {
      !this._writableState || (this._writableState.destroyed = t);
    },
  });
  Oe.prototype.destroy = fg.destroy;
  Oe.prototype._undestroy = fg.undestroy;
  Oe.prototype._destroy = function (e, t) {
    t(e);
  };
});
var cg = y((NQ, e2) => {
  "use strict";
  var S4 = require("util"),
    { LEVEL: hg } = Me(),
    JS = Dn(),
    lo = (e2.exports = function (t = {}) {
      if (
        (JS.call(this, t), !t.transport || typeof t.transport.log != "function")
      )
        throw new Error(
          "Invalid transport, must be an object with a log method.",
        );
      (this.transport = t.transport),
        (this.level = this.level || t.transport.level),
        (this.handleExceptions =
          this.handleExceptions || t.transport.handleExceptions),
        this._deprecated();
      function r(i) {
        this.emit("error", i, this.transport);
      }
      this.transport.__winstonError ||
        ((this.transport.__winstonError = r.bind(this)),
        this.transport.on("error", this.transport.__winstonError));
    });
  S4.inherits(lo, JS);
  lo.prototype._write = function (t, r, i) {
    if (this.silent || (t.exception === !0 && !this.handleExceptions))
      return i(null);
    (!this.level || this.levels[this.level] >= this.levels[t[hg]]) &&
      this.transport.log(t[hg], t.message, t, this._nop),
      i(null);
  };
  lo.prototype._writev = function (t, r) {
    for (let i = 0; i < t.length; i++)
      this._accept(t[i]) &&
        (this.transport.log(
          t[i].chunk[hg],
          t[i].chunk.message,
          t[i].chunk,
          this._nop,
        ),
        t[i].callback());
    return r(null);
  };
  lo.prototype._deprecated = function () {
    console.error(
      [
        `${this.transport.name} is a legacy winston transport. Consider upgrading: `,
        "- Upgrade docs: https://github.com/winstonjs/winston/blob/master/UPGRADE-3.0.md",
      ].join(`
`),
    );
  };
  lo.prototype.close = function () {
    this.transport.close && this.transport.close(),
      this.transport.__winstonError &&
        (this.transport.removeListener("error", this.transport.__winstonError),
        (this.transport.__winstonError = null));
  };
});
var Dn = y((IQ, dg) => {
  "use strict";
  var x4 = require("util"),
    t2 = Af(),
    { LEVEL: r2 } = Me(),
    fo = (dg.exports = function (t = {}) {
      t2.call(this, { objectMode: !0, highWaterMark: t.highWaterMark }),
        (this.format = t.format),
        (this.level = t.level),
        (this.handleExceptions = t.handleExceptions),
        (this.handleRejections = t.handleRejections),
        (this.silent = t.silent),
        t.log && (this.log = t.log),
        t.logv && (this.logv = t.logv),
        t.close && (this.close = t.close),
        this.once("pipe", (r) => {
          (this.levels = r.levels), (this.parent = r);
        }),
        this.once("unpipe", (r) => {
          r === this.parent &&
            ((this.parent = null), this.close && this.close());
        });
    });
  x4.inherits(fo, t2);
  fo.prototype._write = function (t, r, i) {
    if (this.silent || (t.exception === !0 && !this.handleExceptions))
      return i(null);
    let n = this.level || (this.parent && this.parent.level);
    if (!n || this.levels[n] >= this.levels[t[r2]]) {
      if (t && !this.format) return this.log(t, i);
      let s, a;
      try {
        a = this.format.transform(Object.assign({}, t), this.format.options);
      } catch (o) {
        s = o;
      }
      if (s || !a) {
        if ((i(), s)) throw s;
        return;
      }
      return this.log(a, i);
    }
    return (this._writableState.sync = !1), i(null);
  };
  fo.prototype._writev = function (t, r) {
    if (this.logv) {
      let i = t.filter(this._accept, this);
      return i.length ? this.logv(i, r) : r(null);
    }
    for (let i = 0; i < t.length; i++) {
      if (!this._accept(t[i])) continue;
      if (t[i].chunk && !this.format) {
        this.log(t[i].chunk, t[i].callback);
        continue;
      }
      let n, s;
      try {
        s = this.format.transform(
          Object.assign({}, t[i].chunk),
          this.format.options,
        );
      } catch (a) {
        n = a;
      }
      if (n || !s) {
        if ((t[i].callback(), n)) throw (r(null), n);
      } else this.log(s, t[i].callback);
    }
    return r(null);
  };
  fo.prototype._accept = function (t) {
    let r = t.chunk;
    if (this.silent) return !1;
    let i = this.level || (this.parent && this.parent.level);
    return !!(
      (r.exception === !0 || !i || this.levels[i] >= this.levels[r[r2]]) &&
      (this.handleExceptions || r.exception !== !0)
    );
  };
  fo.prototype._nop = function () {};
  dg.exports.LegacyTransportStream = cg();
});
var s2 = y((LQ, n2) => {
  "use strict";
  var C4 = require("os"),
    { LEVEL: i2, MESSAGE: Rs } = Me(),
    O4 = Dn();
  n2.exports = class extends O4 {
    constructor(t = {}) {
      super(t),
        (this.name = t.name || "console"),
        (this.stderrLevels = this._stringArrayToSet(t.stderrLevels)),
        (this.consoleWarnLevels = this._stringArrayToSet(t.consoleWarnLevels)),
        (this.eol = typeof t.eol == "string" ? t.eol : C4.EOL),
        this.setMaxListeners(30);
    }
    log(t, r) {
      if (
        (setImmediate(() => this.emit("logged", t)), this.stderrLevels[t[i2]])
      ) {
        console._stderr
          ? console._stderr.write(`${t[Rs]}${this.eol}`)
          : console.error(t[Rs]),
          r && r();
        return;
      } else if (this.consoleWarnLevels[t[i2]]) {
        console._stderr
          ? console._stderr.write(`${t[Rs]}${this.eol}`)
          : console.warn(t[Rs]),
          r && r();
        return;
      }
      console._stdout
        ? console._stdout.write(`${t[Rs]}${this.eol}`)
        : console.log(t[Rs]),
        r && r();
    }
    _stringArrayToSet(t, r) {
      if (!t) return {};
      if (
        ((r =
          r || "Cannot make set from type other than Array of string elements"),
        !Array.isArray(t))
      )
        throw new Error(r);
      return t.reduce((i, n) => {
        if (typeof n != "string") throw new Error(r);
        return (i[n] = !0), i;
      }, {});
    }
  };
});
var Lf = y((Mf, a2) => {
  "use strict";
  Object.defineProperty(Mf, "__esModule", { value: !0 });
  Mf.default = T4;
  function T4(e) {
    return (
      e && typeof e.length == "number" && e.length >= 0 && e.length % 1 === 0
    );
  }
  a2.exports = Mf.default;
});
var u2 = y((qf, o2) => {
  "use strict";
  Object.defineProperty(qf, "__esModule", { value: !0 });
  qf.default = function (e) {
    return function (...t) {
      var r = t.pop();
      return e.call(this, t, r);
    };
  };
  o2.exports = qf.default;
});
var h2 = y((Ci) => {
  "use strict";
  Object.defineProperty(Ci, "__esModule", { value: !0 });
  Ci.fallback = l2;
  Ci.wrap = f2;
  var F4 = (Ci.hasQueueMicrotask =
      typeof queueMicrotask == "function" && queueMicrotask),
    R4 = (Ci.hasSetImmediate =
      typeof setImmediate == "function" && setImmediate),
    A4 = (Ci.hasNextTick =
      typeof process == "object" && typeof process.nextTick == "function");
  function l2(e) {
    setTimeout(e, 0);
  }
  function f2(e) {
    return (t, ...r) => e(() => t(...r));
  }
  var ho;
  F4
    ? (ho = queueMicrotask)
    : R4
    ? (ho = setImmediate)
    : A4
    ? (ho = process.nextTick)
    : (ho = l2);
  Ci.default = f2(ho);
});
var g2 = y((Pf, m2) => {
  "use strict";
  Object.defineProperty(Pf, "__esModule", { value: !0 });
  Pf.default = P4;
  var N4 = u2(),
    I4 = p2(N4),
    M4 = h2(),
    L4 = p2(M4),
    q4 = bn();
  function p2(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function P4(e) {
    return (0, q4.isAsync)(e)
      ? function (...t) {
          let r = t.pop(),
            i = e.apply(this, t);
          return c2(i, r);
        }
      : (0, I4.default)(function (t, r) {
          var i;
          try {
            i = e.apply(this, t);
          } catch (n) {
            return r(n);
          }
          if (i && typeof i.then == "function") return c2(i, r);
          r(null, i);
        });
  }
  function c2(e, t) {
    return e.then(
      (r) => {
        d2(t, null, r);
      },
      (r) => {
        d2(t, r && r.message ? r : new Error(r));
      },
    );
  }
  function d2(e, t, r) {
    try {
      e(t, r);
    } catch (i) {
      (0, L4.default)((n) => {
        throw n;
      }, i);
    }
  }
  m2.exports = Pf.default;
});
var bn = y((Br) => {
  "use strict";
  Object.defineProperty(Br, "__esModule", { value: !0 });
  Br.isAsyncIterable = Br.isAsyncGenerator = Br.isAsync = void 0;
  var B4 = g2(),
    k4 = j4(B4);
  function j4(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function y2(e) {
    return e[Symbol.toStringTag] === "AsyncFunction";
  }
  function U4(e) {
    return e[Symbol.toStringTag] === "AsyncGenerator";
  }
  function z4(e) {
    return typeof e[Symbol.asyncIterator] == "function";
  }
  function $4(e) {
    if (typeof e != "function") throw new Error("expected a function");
    return y2(e) ? (0, k4.default)(e) : e;
  }
  Br.default = $4;
  Br.isAsync = y2;
  Br.isAsyncGenerator = U4;
  Br.isAsyncIterable = z4;
});
var As = y((Bf, v2) => {
  "use strict";
  Object.defineProperty(Bf, "__esModule", { value: !0 });
  Bf.default = W4;
  function W4(e, t = e.length) {
    if (!t) throw new Error("arity is undefined");
    function r(...i) {
      return typeof i[t - 1] == "function"
        ? e.apply(this, i)
        : new Promise((n, s) => {
            (i[t - 1] = (a, ...o) => {
              if (a) return s(a);
              n(o.length > 1 ? o : o[0]);
            }),
              e.apply(this, i);
          });
    }
    return r;
  }
  v2.exports = Bf.default;
});
var D2 = y((kf, w2) => {
  "use strict";
  Object.defineProperty(kf, "__esModule", { value: !0 });
  var G4 = Lf(),
    H4 = pg(G4),
    Y4 = bn(),
    V4 = pg(Y4),
    X4 = As(),
    Z4 = pg(X4);
  function pg(e) {
    return e && e.__esModule ? e : { default: e };
  }
  kf.default = (0, Z4.default)((e, t, r) => {
    var i = (0, H4.default)(t) ? [] : {};
    e(
      t,
      (n, s, a) => {
        (0, V4.default)(n)((o, ...u) => {
          u.length < 2 && ([u] = u), (i[s] = u), a(o);
        });
      },
      (n) => r(n, i),
    );
  }, 3);
  w2.exports = kf.default;
});
var mg = y((jf, b2) => {
  "use strict";
  Object.defineProperty(jf, "__esModule", { value: !0 });
  jf.default = K4;
  function K4(e) {
    function t(...r) {
      if (e !== null) {
        var i = e;
        (e = null), i.apply(this, r);
      }
    }
    return Object.assign(t, e), t;
  }
  b2.exports = jf.default;
});
var _2 = y((Uf, E2) => {
  "use strict";
  Object.defineProperty(Uf, "__esModule", { value: !0 });
  Uf.default = function (e) {
    return e[Symbol.iterator] && e[Symbol.iterator]();
  };
  E2.exports = Uf.default;
});
var C2 = y((zf, x2) => {
  "use strict";
  Object.defineProperty(zf, "__esModule", { value: !0 });
  zf.default = sk;
  var Q4 = Lf(),
    J4 = S2(Q4),
    ek = _2(),
    tk = S2(ek);
  function S2(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function rk(e) {
    var t = -1,
      r = e.length;
    return function () {
      return ++t < r ? { value: e[t], key: t } : null;
    };
  }
  function ik(e) {
    var t = -1;
    return function () {
      var i = e.next();
      return i.done ? null : (t++, { value: i.value, key: t });
    };
  }
  function nk(e) {
    var t = e ? Object.keys(e) : [],
      r = -1,
      i = t.length;
    return function n() {
      var s = t[++r];
      return s === "__proto__" ? n() : r < i ? { value: e[s], key: s } : null;
    };
  }
  function sk(e) {
    if ((0, J4.default)(e)) return rk(e);
    var t = (0, tk.default)(e);
    return t ? ik(t) : nk(e);
  }
  x2.exports = zf.default;
});
var gg = y(($f, O2) => {
  "use strict";
  Object.defineProperty($f, "__esModule", { value: !0 });
  $f.default = ak;
  function ak(e) {
    return function (...t) {
      if (e === null) throw new Error("Callback was already called.");
      var r = e;
      (e = null), r.apply(this, t);
    };
  }
  O2.exports = $f.default;
});
var Gf = y((Wf, T2) => {
  "use strict";
  Object.defineProperty(Wf, "__esModule", { value: !0 });
  var ok = {};
  Wf.default = ok;
  T2.exports = Wf.default;
});
var R2 = y((Hf, F2) => {
  "use strict";
  Object.defineProperty(Hf, "__esModule", { value: !0 });
  Hf.default = hk;
  var uk = Gf(),
    lk = fk(uk);
  function fk(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function hk(e, t, r, i) {
    let n = !1,
      s = !1,
      a = !1,
      o = 0,
      u = 0;
    function l() {
      o >= t ||
        a ||
        n ||
        ((a = !0),
        e
          .next()
          .then(({ value: c, done: d }) => {
            if (!(s || n)) {
              if (((a = !1), d)) {
                (n = !0), o <= 0 && i(null);
                return;
              }
              o++, r(c, u, f), u++, l();
            }
          })
          .catch(h));
    }
    function f(c, d) {
      if (((o -= 1), !s)) {
        if (c) return h(c);
        if (c === !1) {
          (n = !0), (s = !0);
          return;
        }
        if (d === lk.default || (n && o <= 0)) return (n = !0), i(null);
        l();
      }
    }
    function h(c) {
      s || ((a = !1), (n = !0), i(c));
    }
    l();
  }
  F2.exports = Hf.default;
});
var M2 = y((Yf, I2) => {
  "use strict";
  Object.defineProperty(Yf, "__esModule", { value: !0 });
  var ck = mg(),
    dk = co(ck),
    pk = C2(),
    mk = co(pk),
    gk = gg(),
    yk = co(gk),
    A2 = bn(),
    vk = R2(),
    N2 = co(vk),
    wk = Gf(),
    Dk = co(wk);
  function co(e) {
    return e && e.__esModule ? e : { default: e };
  }
  Yf.default = (e) => (t, r, i) => {
    if (((i = (0, dk.default)(i)), e <= 0))
      throw new RangeError("concurrency limit cannot be less than 1");
    if (!t) return i(null);
    if ((0, A2.isAsyncGenerator)(t)) return (0, N2.default)(t, e, r, i);
    if ((0, A2.isAsyncIterable)(t))
      return (0, N2.default)(t[Symbol.asyncIterator](), e, r, i);
    var n = (0, mk.default)(t),
      s = !1,
      a = !1,
      o = 0,
      u = !1;
    function l(h, c) {
      if (!a)
        if (((o -= 1), h)) (s = !0), i(h);
        else if (h === !1) (s = !0), (a = !0);
        else {
          if (c === Dk.default || (s && o <= 0)) return (s = !0), i(null);
          u || f();
        }
    }
    function f() {
      for (u = !0; o < e && !s; ) {
        var h = n();
        if (h === null) {
          (s = !0), o <= 0 && i(null);
          return;
        }
        (o += 1), r(h.value, h.key, (0, yk.default)(l));
      }
      u = !1;
    }
    f();
  };
  I2.exports = Yf.default;
});
var vg = y((Vf, L2) => {
  "use strict";
  Object.defineProperty(Vf, "__esModule", { value: !0 });
  var bk = M2(),
    Ek = yg(bk),
    _k = bn(),
    Sk = yg(_k),
    xk = As(),
    Ck = yg(xk);
  function yg(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function Ok(e, t, r, i) {
    return (0, Ek.default)(t)(e, (0, Sk.default)(r), i);
  }
  Vf.default = (0, Ck.default)(Ok, 4);
  L2.exports = Vf.default;
});
var B2 = y((Xf, P2) => {
  "use strict";
  Object.defineProperty(Xf, "__esModule", { value: !0 });
  var Tk = vg(),
    Fk = q2(Tk),
    Rk = As(),
    Ak = q2(Rk);
  function q2(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function Nk(e, t, r) {
    return (0, Fk.default)(e, 1, t, r);
  }
  Xf.default = (0, Ak.default)(Nk, 3);
  P2.exports = Xf.default;
});
var U2 = y((Zf, j2) => {
  "use strict";
  Object.defineProperty(Zf, "__esModule", { value: !0 });
  Zf.default = Pk;
  var Ik = D2(),
    Mk = k2(Ik),
    Lk = B2(),
    qk = k2(Lk);
  function k2(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function Pk(e, t) {
    return (0, Mk.default)(qk.default, e, t);
  }
  j2.exports = Zf.default;
});
var wg = y((BQ, $2) => {
  "use strict";
  $2.exports = kr;
  var Kf = bi().codes,
    Bk = Kf.ERR_METHOD_NOT_IMPLEMENTED,
    kk = Kf.ERR_MULTIPLE_CALLBACK,
    jk = Kf.ERR_TRANSFORM_ALREADY_TRANSFORMING,
    Uk = Kf.ERR_TRANSFORM_WITH_LENGTH_0,
    Qf = wn();
  je()(kr, Qf);
  function zk(e, t) {
    var r = this._transformState;
    r.transforming = !1;
    var i = r.writecb;
    if (i === null) return this.emit("error", new kk());
    (r.writechunk = null), (r.writecb = null), t != null && this.push(t), i(e);
    var n = this._readableState;
    (n.reading = !1),
      (n.needReadable || n.length < n.highWaterMark) &&
        this._read(n.highWaterMark);
  }
  function kr(e) {
    if (!(this instanceof kr)) return new kr(e);
    Qf.call(this, e),
      (this._transformState = {
        afterTransform: zk.bind(this),
        needTransform: !1,
        transforming: !1,
        writecb: null,
        writechunk: null,
        writeencoding: null,
      }),
      (this._readableState.needReadable = !0),
      (this._readableState.sync = !1),
      e &&
        (typeof e.transform == "function" && (this._transform = e.transform),
        typeof e.flush == "function" && (this._flush = e.flush)),
      this.on("prefinish", $k);
  }
  function $k() {
    var e = this;
    typeof this._flush == "function" && !this._readableState.destroyed
      ? this._flush(function (t, r) {
          z2(e, t, r);
        })
      : z2(this, null, null);
  }
  kr.prototype.push = function (e, t) {
    return (
      (this._transformState.needTransform = !1),
      Qf.prototype.push.call(this, e, t)
    );
  };
  kr.prototype._transform = function (e, t, r) {
    r(new Bk("_transform()"));
  };
  kr.prototype._write = function (e, t, r) {
    var i = this._transformState;
    if (
      ((i.writecb = r),
      (i.writechunk = e),
      (i.writeencoding = t),
      !i.transforming)
    ) {
      var n = this._readableState;
      (i.needTransform || n.needReadable || n.length < n.highWaterMark) &&
        this._read(n.highWaterMark);
    }
  };
  kr.prototype._read = function (e) {
    var t = this._transformState;
    t.writechunk !== null && !t.transforming
      ? ((t.transforming = !0),
        this._transform(t.writechunk, t.writeencoding, t.afterTransform))
      : (t.needTransform = !0);
  };
  kr.prototype._destroy = function (e, t) {
    Qf.prototype._destroy.call(this, e, function (r) {
      t(r);
    });
  };
  function z2(e, t, r) {
    if (t) return e.emit("error", t);
    if ((r != null && e.push(r), e._writableState.length)) throw new Uk();
    if (e._transformState.transforming) throw new jk();
    return e.push(null);
  }
});
var H2 = y((kQ, G2) => {
  "use strict";
  G2.exports = po;
  var W2 = wg();
  je()(po, W2);
  function po(e) {
    if (!(this instanceof po)) return new po(e);
    W2.call(this, e);
  }
  po.prototype._transform = function (e, t, r) {
    r(null, e);
  };
});
var K2 = y((jQ, Z2) => {
  "use strict";
  var Dg;
  function Wk(e) {
    var t = !1;
    return function () {
      t || ((t = !0), e.apply(void 0, arguments));
    };
  }
  var X2 = bi().codes,
    Gk = X2.ERR_MISSING_ARGS,
    Hk = X2.ERR_STREAM_DESTROYED;
  function Y2(e) {
    if (e) throw e;
  }
  function Yk(e) {
    return e.setHeader && typeof e.abort == "function";
  }
  function Vk(e, t, r, i) {
    i = Wk(i);
    var n = !1;
    e.on("close", function () {
      n = !0;
    }),
      Dg === void 0 && (Dg = _f()),
      Dg(e, { readable: t, writable: r }, function (a) {
        if (a) return i(a);
        (n = !0), i();
      });
    var s = !1;
    return function (a) {
      if (!n && !s) {
        if (((s = !0), Yk(e))) return e.abort();
        if (typeof e.destroy == "function") return e.destroy();
        i(a || new Hk("pipe"));
      }
    };
  }
  function V2(e) {
    e();
  }
  function Xk(e, t) {
    return e.pipe(t);
  }
  function Zk(e) {
    return !e.length || typeof e[e.length - 1] != "function" ? Y2 : e.pop();
  }
  function Kk() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
      t[r] = arguments[r];
    var i = Zk(t);
    if ((Array.isArray(t[0]) && (t = t[0]), t.length < 2))
      throw new Gk("streams");
    var n,
      s = t.map(function (a, o) {
        var u = o < t.length - 1,
          l = o > 0;
        return Vk(a, u, l, function (f) {
          n || (n = f), f && s.forEach(V2), !u && (s.forEach(V2), i(n));
        });
      });
    return t.reduce(Xk);
  }
  Z2.exports = Kk;
});
var st = y((Yt, go) => {
  var mo = require("stream");
  process.env.READABLE_STREAM === "disable" && mo
    ? ((go.exports = mo.Readable),
      Object.assign(go.exports, mo),
      (go.exports.Stream = mo))
    : ((Yt = go.exports = ag()),
      (Yt.Stream = mo || Yt),
      (Yt.Readable = Yt),
      (Yt.Writable = Af()),
      (Yt.Duplex = wn()),
      (Yt.Transform = wg()),
      (Yt.PassThrough = H2()),
      (Yt.finished = _f()),
      (Yt.pipeline = K2()));
});
var Og = y((UQ, J2) => {
  var Ns = [],
    yo = [],
    bg = function () {};
  function _g(e) {
    return ~Ns.indexOf(e) ? !1 : (Ns.push(e), !0);
  }
  function Sg(e) {
    bg = e;
  }
  function Qk(e) {
    for (var t = [], r = 0; r < Ns.length; r++) {
      if (Ns[r].async) {
        t.push(Ns[r]);
        continue;
      }
      if (Ns[r](e)) return !0;
    }
    return t.length
      ? new Promise(function (n) {
          Promise.all(
            t.map(function (a) {
              return a(e);
            }),
          ).then(function (a) {
            n(a.some(Boolean));
          });
        })
      : !1;
  }
  function xg(e) {
    return ~yo.indexOf(e) ? !1 : (yo.push(e), !0);
  }
  function Eg() {
    bg.apply(bg, arguments);
  }
  function Q2(e) {
    for (var t = 0; t < yo.length; t++) e = yo[t].apply(yo[t], arguments);
    return e;
  }
  function Cg(e, t) {
    var r = Object.prototype.hasOwnProperty;
    for (var i in t) r.call(t, i) && (e[i] = t[i]);
    return e;
  }
  function Jk(e) {
    return (
      (e.enabled = !1),
      (e.modify = xg),
      (e.set = Sg),
      (e.use = _g),
      Cg(function () {
        return !1;
      }, e)
    );
  }
  function ej(e) {
    function t() {
      var r = Array.prototype.slice.call(arguments, 0);
      return Eg.call(Eg, e, Q2(r, e)), !0;
    }
    return (
      (e.enabled = !0), (e.modify = xg), (e.set = Sg), (e.use = _g), Cg(t, e)
    );
  }
  J2.exports = function (t) {
    return (
      (t.introduce = Cg),
      (t.enabled = Qk),
      (t.process = Q2),
      (t.modify = xg),
      (t.write = Eg),
      (t.nope = Jk),
      (t.yep = ej),
      (t.set = Sg),
      (t.use = _g),
      t
    );
  };
});
var tx = y((zQ, ex) => {
  var tj = Og(),
    rj = tj(function e(t, r) {
      return (
        (r = r || {}),
        (r.namespace = t),
        (r.prod = !0),
        (r.dev = !1),
        r.force || e.force ? e.yep(r) : e.nope(r)
      );
    });
  ex.exports = rj;
});
var ix = y(($Q, rx) => {
  "use strict";
  rx.exports = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50],
  };
});
var sx = y((WQ, nx) => {
  nx.exports = function (t) {
    return !t || typeof t == "string"
      ? !1
      : t instanceof Array ||
          Array.isArray(t) ||
          (t.length >= 0 &&
            (t.splice instanceof Function ||
              (Object.getOwnPropertyDescriptor(t, t.length - 1) &&
                t.constructor.name !== "String")));
  };
});
var ux = y((GQ, ox) => {
  "use strict";
  var ij = sx(),
    nj = Array.prototype.concat,
    sj = Array.prototype.slice,
    ax = (ox.exports = function (t) {
      for (var r = [], i = 0, n = t.length; i < n; i++) {
        var s = t[i];
        ij(s) ? (r = nj.call(r, sj.call(s))) : r.push(s);
      }
      return r;
    });
  ax.wrap = function (e) {
    return function () {
      return e(ax(arguments));
    };
  };
});
var cx = y((HQ, hx) => {
  var vo = ix(),
    wo = ux(),
    lx = Object.hasOwnProperty,
    fx = Object.create(null);
  for (Jf in vo) lx.call(vo, Jf) && (fx[vo[Jf]] = Jf);
  var Jf,
    Rt = (hx.exports = { to: {}, get: {} });
  Rt.get = function (e) {
    var t = e.substring(0, 3).toLowerCase(),
      r,
      i;
    switch (t) {
      case "hsl":
        (r = Rt.get.hsl(e)), (i = "hsl");
        break;
      case "hwb":
        (r = Rt.get.hwb(e)), (i = "hwb");
        break;
      default:
        (r = Rt.get.rgb(e)), (i = "rgb");
        break;
    }
    return r ? { model: i, value: r } : null;
  };
  Rt.get.rgb = function (e) {
    if (!e) return null;
    var t = /^#([a-f0-9]{3,4})$/i,
      r = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i,
      i =
        /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/,
      n =
        /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/,
      s = /^(\w+)$/,
      a = [0, 0, 0, 1],
      o,
      u,
      l;
    if ((o = e.match(r))) {
      for (l = o[2], o = o[1], u = 0; u < 3; u++) {
        var f = u * 2;
        a[u] = parseInt(o.slice(f, f + 2), 16);
      }
      l && (a[3] = parseInt(l, 16) / 255);
    } else if ((o = e.match(t))) {
      for (o = o[1], l = o[3], u = 0; u < 3; u++)
        a[u] = parseInt(o[u] + o[u], 16);
      l && (a[3] = parseInt(l + l, 16) / 255);
    } else if ((o = e.match(i))) {
      for (u = 0; u < 3; u++) a[u] = parseInt(o[u + 1], 0);
      o[4] &&
        (o[5] ? (a[3] = parseFloat(o[4]) * 0.01) : (a[3] = parseFloat(o[4])));
    } else if ((o = e.match(n))) {
      for (u = 0; u < 3; u++) a[u] = Math.round(parseFloat(o[u + 1]) * 2.55);
      o[4] &&
        (o[5] ? (a[3] = parseFloat(o[4]) * 0.01) : (a[3] = parseFloat(o[4])));
    } else
      return (o = e.match(s))
        ? o[1] === "transparent"
          ? [0, 0, 0, 0]
          : lx.call(vo, o[1])
          ? ((a = vo[o[1]]), (a[3] = 1), a)
          : null
        : null;
    for (u = 0; u < 3; u++) a[u] = Oi(a[u], 0, 255);
    return (a[3] = Oi(a[3], 0, 1)), a;
  };
  Rt.get.hsl = function (e) {
    if (!e) return null;
    var t =
        /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/,
      r = e.match(t);
    if (r) {
      var i = parseFloat(r[4]),
        n = ((parseFloat(r[1]) % 360) + 360) % 360,
        s = Oi(parseFloat(r[2]), 0, 100),
        a = Oi(parseFloat(r[3]), 0, 100),
        o = Oi(isNaN(i) ? 1 : i, 0, 1);
      return [n, s, a, o];
    }
    return null;
  };
  Rt.get.hwb = function (e) {
    if (!e) return null;
    var t =
        /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/,
      r = e.match(t);
    if (r) {
      var i = parseFloat(r[4]),
        n = ((parseFloat(r[1]) % 360) + 360) % 360,
        s = Oi(parseFloat(r[2]), 0, 100),
        a = Oi(parseFloat(r[3]), 0, 100),
        o = Oi(isNaN(i) ? 1 : i, 0, 1);
      return [n, s, a, o];
    }
    return null;
  };
  Rt.to.hex = function () {
    var e = wo(arguments);
    return (
      "#" +
      eh(e[0]) +
      eh(e[1]) +
      eh(e[2]) +
      (e[3] < 1 ? eh(Math.round(e[3] * 255)) : "")
    );
  };
  Rt.to.rgb = function () {
    var e = wo(arguments);
    return e.length < 4 || e[3] === 1
      ? "rgb(" +
          Math.round(e[0]) +
          ", " +
          Math.round(e[1]) +
          ", " +
          Math.round(e[2]) +
          ")"
      : "rgba(" +
          Math.round(e[0]) +
          ", " +
          Math.round(e[1]) +
          ", " +
          Math.round(e[2]) +
          ", " +
          e[3] +
          ")";
  };
  Rt.to.rgb.percent = function () {
    var e = wo(arguments),
      t = Math.round((e[0] / 255) * 100),
      r = Math.round((e[1] / 255) * 100),
      i = Math.round((e[2] / 255) * 100);
    return e.length < 4 || e[3] === 1
      ? "rgb(" + t + "%, " + r + "%, " + i + "%)"
      : "rgba(" + t + "%, " + r + "%, " + i + "%, " + e[3] + ")";
  };
  Rt.to.hsl = function () {
    var e = wo(arguments);
    return e.length < 4 || e[3] === 1
      ? "hsl(" + e[0] + ", " + e[1] + "%, " + e[2] + "%)"
      : "hsla(" + e[0] + ", " + e[1] + "%, " + e[2] + "%, " + e[3] + ")";
  };
  Rt.to.hwb = function () {
    var e = wo(arguments),
      t = "";
    return (
      e.length >= 4 && e[3] !== 1 && (t = ", " + e[3]),
      "hwb(" + e[0] + ", " + e[1] + "%, " + e[2] + "%" + t + ")"
    );
  };
  Rt.to.keyword = function (e) {
    return fx[e.slice(0, 3)];
  };
  function Oi(e, t, r) {
    return Math.min(Math.max(t, e), r);
  }
  function eh(e) {
    var t = Math.round(e).toString(16).toUpperCase();
    return t.length < 2 ? "0" + t : t;
  }
});
var px = y((YQ, dx) => {
  "use strict";
  dx.exports = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50],
  };
});
var Tg = y((VQ, vx) => {
  var En = px(),
    yx = {};
  for (th in En) En.hasOwnProperty(th) && (yx[En[th]] = th);
  var th,
    Y = (vx.exports = {
      rgb: { channels: 3, labels: "rgb" },
      hsl: { channels: 3, labels: "hsl" },
      hsv: { channels: 3, labels: "hsv" },
      hwb: { channels: 3, labels: "hwb" },
      cmyk: { channels: 4, labels: "cmyk" },
      xyz: { channels: 3, labels: "xyz" },
      lab: { channels: 3, labels: "lab" },
      lch: { channels: 3, labels: "lch" },
      hex: { channels: 1, labels: ["hex"] },
      keyword: { channels: 1, labels: ["keyword"] },
      ansi16: { channels: 1, labels: ["ansi16"] },
      ansi256: { channels: 1, labels: ["ansi256"] },
      hcg: { channels: 3, labels: ["h", "c", "g"] },
      apple: { channels: 3, labels: ["r16", "g16", "b16"] },
      gray: { channels: 1, labels: ["gray"] },
    });
  for (dt in Y)
    if (Y.hasOwnProperty(dt)) {
      if (!("channels" in Y[dt]))
        throw new Error("missing channels property: " + dt);
      if (!("labels" in Y[dt]))
        throw new Error("missing channel labels property: " + dt);
      if (Y[dt].labels.length !== Y[dt].channels)
        throw new Error("channel and label counts mismatch: " + dt);
      (mx = Y[dt].channels),
        (gx = Y[dt].labels),
        delete Y[dt].channels,
        delete Y[dt].labels,
        Object.defineProperty(Y[dt], "channels", { value: mx }),
        Object.defineProperty(Y[dt], "labels", { value: gx });
    }
  var mx, gx, dt;
  Y.rgb.hsl = function (e) {
    var t = e[0] / 255,
      r = e[1] / 255,
      i = e[2] / 255,
      n = Math.min(t, r, i),
      s = Math.max(t, r, i),
      a = s - n,
      o,
      u,
      l;
    return (
      s === n
        ? (o = 0)
        : t === s
        ? (o = (r - i) / a)
        : r === s
        ? (o = 2 + (i - t) / a)
        : i === s && (o = 4 + (t - r) / a),
      (o = Math.min(o * 60, 360)),
      o < 0 && (o += 360),
      (l = (n + s) / 2),
      s === n ? (u = 0) : l <= 0.5 ? (u = a / (s + n)) : (u = a / (2 - s - n)),
      [o, u * 100, l * 100]
    );
  };
  Y.rgb.hsv = function (e) {
    var t,
      r,
      i,
      n,
      s,
      a = e[0] / 255,
      o = e[1] / 255,
      u = e[2] / 255,
      l = Math.max(a, o, u),
      f = l - Math.min(a, o, u),
      h = function (c) {
        return (l - c) / 6 / f + 1 / 2;
      };
    return (
      f === 0
        ? (n = s = 0)
        : ((s = f / l),
          (t = h(a)),
          (r = h(o)),
          (i = h(u)),
          a === l
            ? (n = i - r)
            : o === l
            ? (n = 1 / 3 + t - i)
            : u === l && (n = 2 / 3 + r - t),
          n < 0 ? (n += 1) : n > 1 && (n -= 1)),
      [n * 360, s * 100, l * 100]
    );
  };
  Y.rgb.hwb = function (e) {
    var t = e[0],
      r = e[1],
      i = e[2],
      n = Y.rgb.hsl(e)[0],
      s = (1 / 255) * Math.min(t, Math.min(r, i));
    return (
      (i = 1 - (1 / 255) * Math.max(t, Math.max(r, i))), [n, s * 100, i * 100]
    );
  };
  Y.rgb.cmyk = function (e) {
    var t = e[0] / 255,
      r = e[1] / 255,
      i = e[2] / 255,
      n,
      s,
      a,
      o;
    return (
      (o = Math.min(1 - t, 1 - r, 1 - i)),
      (n = (1 - t - o) / (1 - o) || 0),
      (s = (1 - r - o) / (1 - o) || 0),
      (a = (1 - i - o) / (1 - o) || 0),
      [n * 100, s * 100, a * 100, o * 100]
    );
  };
  function aj(e, t) {
    return (
      Math.pow(e[0] - t[0], 2) +
      Math.pow(e[1] - t[1], 2) +
      Math.pow(e[2] - t[2], 2)
    );
  }
  Y.rgb.keyword = function (e) {
    var t = yx[e];
    if (t) return t;
    var r = 1 / 0,
      i;
    for (var n in En)
      if (En.hasOwnProperty(n)) {
        var s = En[n],
          a = aj(e, s);
        a < r && ((r = a), (i = n));
      }
    return i;
  };
  Y.keyword.rgb = function (e) {
    return En[e];
  };
  Y.rgb.xyz = function (e) {
    var t = e[0] / 255,
      r = e[1] / 255,
      i = e[2] / 255;
    (t = t > 0.04045 ? Math.pow((t + 0.055) / 1.055, 2.4) : t / 12.92),
      (r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92),
      (i = i > 0.04045 ? Math.pow((i + 0.055) / 1.055, 2.4) : i / 12.92);
    var n = t * 0.4124 + r * 0.3576 + i * 0.1805,
      s = t * 0.2126 + r * 0.7152 + i * 0.0722,
      a = t * 0.0193 + r * 0.1192 + i * 0.9505;
    return [n * 100, s * 100, a * 100];
  };
  Y.rgb.lab = function (e) {
    var t = Y.rgb.xyz(e),
      r = t[0],
      i = t[1],
      n = t[2],
      s,
      a,
      o;
    return (
      (r /= 95.047),
      (i /= 100),
      (n /= 108.883),
      (r = r > 0.008856 ? Math.pow(r, 1 / 3) : 7.787 * r + 16 / 116),
      (i = i > 0.008856 ? Math.pow(i, 1 / 3) : 7.787 * i + 16 / 116),
      (n = n > 0.008856 ? Math.pow(n, 1 / 3) : 7.787 * n + 16 / 116),
      (s = 116 * i - 16),
      (a = 500 * (r - i)),
      (o = 200 * (i - n)),
      [s, a, o]
    );
  };
  Y.hsl.rgb = function (e) {
    var t = e[0] / 360,
      r = e[1] / 100,
      i = e[2] / 100,
      n,
      s,
      a,
      o,
      u;
    if (r === 0) return (u = i * 255), [u, u, u];
    i < 0.5 ? (s = i * (1 + r)) : (s = i + r - i * r),
      (n = 2 * i - s),
      (o = [0, 0, 0]);
    for (var l = 0; l < 3; l++)
      (a = t + (1 / 3) * -(l - 1)),
        a < 0 && a++,
        a > 1 && a--,
        6 * a < 1
          ? (u = n + (s - n) * 6 * a)
          : 2 * a < 1
          ? (u = s)
          : 3 * a < 2
          ? (u = n + (s - n) * (2 / 3 - a) * 6)
          : (u = n),
        (o[l] = u * 255);
    return o;
  };
  Y.hsl.hsv = function (e) {
    var t = e[0],
      r = e[1] / 100,
      i = e[2] / 100,
      n = r,
      s = Math.max(i, 0.01),
      a,
      o;
    return (
      (i *= 2),
      (r *= i <= 1 ? i : 2 - i),
      (n *= s <= 1 ? s : 2 - s),
      (o = (i + r) / 2),
      (a = i === 0 ? (2 * n) / (s + n) : (2 * r) / (i + r)),
      [t, a * 100, o * 100]
    );
  };
  Y.hsv.rgb = function (e) {
    var t = e[0] / 60,
      r = e[1] / 100,
      i = e[2] / 100,
      n = Math.floor(t) % 6,
      s = t - Math.floor(t),
      a = 255 * i * (1 - r),
      o = 255 * i * (1 - r * s),
      u = 255 * i * (1 - r * (1 - s));
    switch (((i *= 255), n)) {
      case 0:
        return [i, u, a];
      case 1:
        return [o, i, a];
      case 2:
        return [a, i, u];
      case 3:
        return [a, o, i];
      case 4:
        return [u, a, i];
      case 5:
        return [i, a, o];
    }
  };
  Y.hsv.hsl = function (e) {
    var t = e[0],
      r = e[1] / 100,
      i = e[2] / 100,
      n = Math.max(i, 0.01),
      s,
      a,
      o;
    return (
      (o = (2 - r) * i),
      (s = (2 - r) * n),
      (a = r * n),
      (a /= s <= 1 ? s : 2 - s),
      (a = a || 0),
      (o /= 2),
      [t, a * 100, o * 100]
    );
  };
  Y.hwb.rgb = function (e) {
    var t = e[0] / 360,
      r = e[1] / 100,
      i = e[2] / 100,
      n = r + i,
      s,
      a,
      o,
      u;
    n > 1 && ((r /= n), (i /= n)),
      (s = Math.floor(6 * t)),
      (a = 1 - i),
      (o = 6 * t - s),
      (s & 1) !== 0 && (o = 1 - o),
      (u = r + o * (a - r));
    var l, f, h;
    switch (s) {
      default:
      case 6:
      case 0:
        (l = a), (f = u), (h = r);
        break;
      case 1:
        (l = u), (f = a), (h = r);
        break;
      case 2:
        (l = r), (f = a), (h = u);
        break;
      case 3:
        (l = r), (f = u), (h = a);
        break;
      case 4:
        (l = u), (f = r), (h = a);
        break;
      case 5:
        (l = a), (f = r), (h = u);
        break;
    }
    return [l * 255, f * 255, h * 255];
  };
  Y.cmyk.rgb = function (e) {
    var t = e[0] / 100,
      r = e[1] / 100,
      i = e[2] / 100,
      n = e[3] / 100,
      s,
      a,
      o;
    return (
      (s = 1 - Math.min(1, t * (1 - n) + n)),
      (a = 1 - Math.min(1, r * (1 - n) + n)),
      (o = 1 - Math.min(1, i * (1 - n) + n)),
      [s * 255, a * 255, o * 255]
    );
  };
  Y.xyz.rgb = function (e) {
    var t = e[0] / 100,
      r = e[1] / 100,
      i = e[2] / 100,
      n,
      s,
      a;
    return (
      (n = t * 3.2406 + r * -1.5372 + i * -0.4986),
      (s = t * -0.9689 + r * 1.8758 + i * 0.0415),
      (a = t * 0.0557 + r * -0.204 + i * 1.057),
      (n = n > 0.0031308 ? 1.055 * Math.pow(n, 1 / 2.4) - 0.055 : n * 12.92),
      (s = s > 0.0031308 ? 1.055 * Math.pow(s, 1 / 2.4) - 0.055 : s * 12.92),
      (a = a > 0.0031308 ? 1.055 * Math.pow(a, 1 / 2.4) - 0.055 : a * 12.92),
      (n = Math.min(Math.max(0, n), 1)),
      (s = Math.min(Math.max(0, s), 1)),
      (a = Math.min(Math.max(0, a), 1)),
      [n * 255, s * 255, a * 255]
    );
  };
  Y.xyz.lab = function (e) {
    var t = e[0],
      r = e[1],
      i = e[2],
      n,
      s,
      a;
    return (
      (t /= 95.047),
      (r /= 100),
      (i /= 108.883),
      (t = t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116),
      (r = r > 0.008856 ? Math.pow(r, 1 / 3) : 7.787 * r + 16 / 116),
      (i = i > 0.008856 ? Math.pow(i, 1 / 3) : 7.787 * i + 16 / 116),
      (n = 116 * r - 16),
      (s = 500 * (t - r)),
      (a = 200 * (r - i)),
      [n, s, a]
    );
  };
  Y.lab.xyz = function (e) {
    var t = e[0],
      r = e[1],
      i = e[2],
      n,
      s,
      a;
    (s = (t + 16) / 116), (n = r / 500 + s), (a = s - i / 200);
    var o = Math.pow(s, 3),
      u = Math.pow(n, 3),
      l = Math.pow(a, 3);
    return (
      (s = o > 0.008856 ? o : (s - 16 / 116) / 7.787),
      (n = u > 0.008856 ? u : (n - 16 / 116) / 7.787),
      (a = l > 0.008856 ? l : (a - 16 / 116) / 7.787),
      (n *= 95.047),
      (s *= 100),
      (a *= 108.883),
      [n, s, a]
    );
  };
  Y.lab.lch = function (e) {
    var t = e[0],
      r = e[1],
      i = e[2],
      n,
      s,
      a;
    return (
      (n = Math.atan2(i, r)),
      (s = (n * 360) / 2 / Math.PI),
      s < 0 && (s += 360),
      (a = Math.sqrt(r * r + i * i)),
      [t, a, s]
    );
  };
  Y.lch.lab = function (e) {
    var t = e[0],
      r = e[1],
      i = e[2],
      n,
      s,
      a;
    return (
      (a = (i / 360) * 2 * Math.PI),
      (n = r * Math.cos(a)),
      (s = r * Math.sin(a)),
      [t, n, s]
    );
  };
  Y.rgb.ansi16 = function (e) {
    var t = e[0],
      r = e[1],
      i = e[2],
      n = 1 in arguments ? arguments[1] : Y.rgb.hsv(e)[2];
    if (((n = Math.round(n / 50)), n === 0)) return 30;
    var s =
      30 +
      ((Math.round(i / 255) << 2) |
        (Math.round(r / 255) << 1) |
        Math.round(t / 255));
    return n === 2 && (s += 60), s;
  };
  Y.hsv.ansi16 = function (e) {
    return Y.rgb.ansi16(Y.hsv.rgb(e), e[2]);
  };
  Y.rgb.ansi256 = function (e) {
    var t = e[0],
      r = e[1],
      i = e[2];
    if (t === r && r === i)
      return t < 8
        ? 16
        : t > 248
        ? 231
        : Math.round(((t - 8) / 247) * 24) + 232;
    var n =
      16 +
      36 * Math.round((t / 255) * 5) +
      6 * Math.round((r / 255) * 5) +
      Math.round((i / 255) * 5);
    return n;
  };
  Y.ansi16.rgb = function (e) {
    var t = e % 10;
    if (t === 0 || t === 7)
      return e > 50 && (t += 3.5), (t = (t / 10.5) * 255), [t, t, t];
    var r = (~~(e > 50) + 1) * 0.5,
      i = (t & 1) * r * 255,
      n = ((t >> 1) & 1) * r * 255,
      s = ((t >> 2) & 1) * r * 255;
    return [i, n, s];
  };
  Y.ansi256.rgb = function (e) {
    if (e >= 232) {
      var t = (e - 232) * 10 + 8;
      return [t, t, t];
    }
    e -= 16;
    var r,
      i = (Math.floor(e / 36) / 5) * 255,
      n = (Math.floor((r = e % 36) / 6) / 5) * 255,
      s = ((r % 6) / 5) * 255;
    return [i, n, s];
  };
  Y.rgb.hex = function (e) {
    var t =
        ((Math.round(e[0]) & 255) << 16) +
        ((Math.round(e[1]) & 255) << 8) +
        (Math.round(e[2]) & 255),
      r = t.toString(16).toUpperCase();
    return "000000".substring(r.length) + r;
  };
  Y.hex.rgb = function (e) {
    var t = e.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!t) return [0, 0, 0];
    var r = t[0];
    t[0].length === 3 &&
      (r = r
        .split("")
        .map(function (o) {
          return o + o;
        })
        .join(""));
    var i = parseInt(r, 16),
      n = (i >> 16) & 255,
      s = (i >> 8) & 255,
      a = i & 255;
    return [n, s, a];
  };
  Y.rgb.hcg = function (e) {
    var t = e[0] / 255,
      r = e[1] / 255,
      i = e[2] / 255,
      n = Math.max(Math.max(t, r), i),
      s = Math.min(Math.min(t, r), i),
      a = n - s,
      o,
      u;
    return (
      a < 1 ? (o = s / (1 - a)) : (o = 0),
      a <= 0
        ? (u = 0)
        : n === t
        ? (u = ((r - i) / a) % 6)
        : n === r
        ? (u = 2 + (i - t) / a)
        : (u = 4 + (t - r) / a + 4),
      (u /= 6),
      (u %= 1),
      [u * 360, a * 100, o * 100]
    );
  };
  Y.hsl.hcg = function (e) {
    var t = e[1] / 100,
      r = e[2] / 100,
      i = 1,
      n = 0;
    return (
      r < 0.5 ? (i = 2 * t * r) : (i = 2 * t * (1 - r)),
      i < 1 && (n = (r - 0.5 * i) / (1 - i)),
      [e[0], i * 100, n * 100]
    );
  };
  Y.hsv.hcg = function (e) {
    var t = e[1] / 100,
      r = e[2] / 100,
      i = t * r,
      n = 0;
    return i < 1 && (n = (r - i) / (1 - i)), [e[0], i * 100, n * 100];
  };
  Y.hcg.rgb = function (e) {
    var t = e[0] / 360,
      r = e[1] / 100,
      i = e[2] / 100;
    if (r === 0) return [i * 255, i * 255, i * 255];
    var n = [0, 0, 0],
      s = (t % 1) * 6,
      a = s % 1,
      o = 1 - a,
      u = 0;
    switch (Math.floor(s)) {
      case 0:
        (n[0] = 1), (n[1] = a), (n[2] = 0);
        break;
      case 1:
        (n[0] = o), (n[1] = 1), (n[2] = 0);
        break;
      case 2:
        (n[0] = 0), (n[1] = 1), (n[2] = a);
        break;
      case 3:
        (n[0] = 0), (n[1] = o), (n[2] = 1);
        break;
      case 4:
        (n[0] = a), (n[1] = 0), (n[2] = 1);
        break;
      default:
        (n[0] = 1), (n[1] = 0), (n[2] = o);
    }
    return (
      (u = (1 - r) * i),
      [(r * n[0] + u) * 255, (r * n[1] + u) * 255, (r * n[2] + u) * 255]
    );
  };
  Y.hcg.hsv = function (e) {
    var t = e[1] / 100,
      r = e[2] / 100,
      i = t + r * (1 - t),
      n = 0;
    return i > 0 && (n = t / i), [e[0], n * 100, i * 100];
  };
  Y.hcg.hsl = function (e) {
    var t = e[1] / 100,
      r = e[2] / 100,
      i = r * (1 - t) + 0.5 * t,
      n = 0;
    return (
      i > 0 && i < 0.5
        ? (n = t / (2 * i))
        : i >= 0.5 && i < 1 && (n = t / (2 * (1 - i))),
      [e[0], n * 100, i * 100]
    );
  };
  Y.hcg.hwb = function (e) {
    var t = e[1] / 100,
      r = e[2] / 100,
      i = t + r * (1 - t);
    return [e[0], (i - t) * 100, (1 - i) * 100];
  };
  Y.hwb.hcg = function (e) {
    var t = e[1] / 100,
      r = e[2] / 100,
      i = 1 - r,
      n = i - t,
      s = 0;
    return n < 1 && (s = (i - n) / (1 - n)), [e[0], n * 100, s * 100];
  };
  Y.apple.rgb = function (e) {
    return [(e[0] / 65535) * 255, (e[1] / 65535) * 255, (e[2] / 65535) * 255];
  };
  Y.rgb.apple = function (e) {
    return [(e[0] / 255) * 65535, (e[1] / 255) * 65535, (e[2] / 255) * 65535];
  };
  Y.gray.rgb = function (e) {
    return [(e[0] / 100) * 255, (e[0] / 100) * 255, (e[0] / 100) * 255];
  };
  Y.gray.hsl = Y.gray.hsv = function (e) {
    return [0, 0, e[0]];
  };
  Y.gray.hwb = function (e) {
    return [0, 100, e[0]];
  };
  Y.gray.cmyk = function (e) {
    return [0, 0, 0, e[0]];
  };
  Y.gray.lab = function (e) {
    return [e[0], 0, 0];
  };
  Y.gray.hex = function (e) {
    var t = Math.round((e[0] / 100) * 255) & 255,
      r = (t << 16) + (t << 8) + t,
      i = r.toString(16).toUpperCase();
    return "000000".substring(i.length) + i;
  };
  Y.rgb.gray = function (e) {
    var t = (e[0] + e[1] + e[2]) / 3;
    return [(t / 255) * 100];
  };
});
var Dx = y((XQ, wx) => {
  var rh = Tg();
  function oj() {
    for (var e = {}, t = Object.keys(rh), r = t.length, i = 0; i < r; i++)
      e[t[i]] = { distance: -1, parent: null };
    return e;
  }
  function uj(e) {
    var t = oj(),
      r = [e];
    for (t[e].distance = 0; r.length; )
      for (
        var i = r.pop(), n = Object.keys(rh[i]), s = n.length, a = 0;
        a < s;
        a++
      ) {
        var o = n[a],
          u = t[o];
        u.distance === -1 &&
          ((u.distance = t[i].distance + 1), (u.parent = i), r.unshift(o));
      }
    return t;
  }
  function lj(e, t) {
    return function (r) {
      return t(e(r));
    };
  }
  function fj(e, t) {
    for (
      var r = [t[e].parent, e], i = rh[t[e].parent][e], n = t[e].parent;
      t[n].parent;

    )
      r.unshift(t[n].parent),
        (i = lj(rh[t[n].parent][n], i)),
        (n = t[n].parent);
    return (i.conversion = r), i;
  }
  wx.exports = function (e) {
    for (
      var t = uj(e), r = {}, i = Object.keys(t), n = i.length, s = 0;
      s < n;
      s++
    ) {
      var a = i[s],
        o = t[a];
      o.parent !== null && (r[a] = fj(a, t));
    }
    return r;
  };
});
var Ex = y((ZQ, bx) => {
  var Fg = Tg(),
    hj = Dx(),
    Is = {},
    cj = Object.keys(Fg);
  function dj(e) {
    var t = function (r) {
      return r == null
        ? r
        : (arguments.length > 1 && (r = Array.prototype.slice.call(arguments)),
          e(r));
    };
    return "conversion" in e && (t.conversion = e.conversion), t;
  }
  function pj(e) {
    var t = function (r) {
      if (r == null) return r;
      arguments.length > 1 && (r = Array.prototype.slice.call(arguments));
      var i = e(r);
      if (typeof i == "object")
        for (var n = i.length, s = 0; s < n; s++) i[s] = Math.round(i[s]);
      return i;
    };
    return "conversion" in e && (t.conversion = e.conversion), t;
  }
  cj.forEach(function (e) {
    (Is[e] = {}),
      Object.defineProperty(Is[e], "channels", { value: Fg[e].channels }),
      Object.defineProperty(Is[e], "labels", { value: Fg[e].labels });
    var t = hj(e),
      r = Object.keys(t);
    r.forEach(function (i) {
      var n = t[i];
      (Is[e][i] = pj(n)), (Is[e][i].raw = dj(n));
    });
  });
  bx.exports = Is;
});
var xx = y((KQ, Sx) => {
  "use strict";
  var Do = cx(),
    At = Ex(),
    Ng = [].slice,
    _x = ["keyword", "gray", "hex"],
    Rg = {};
  Object.keys(At).forEach(function (e) {
    Rg[Ng.call(At[e].labels).sort().join("")] = e;
  });
  var ih = {};
  function Ze(e, t) {
    if (!(this instanceof Ze)) return new Ze(e, t);
    if ((t && t in _x && (t = null), t && !(t in At)))
      throw new Error("Unknown model: " + t);
    var r, i;
    if (e == null)
      (this.model = "rgb"), (this.color = [0, 0, 0]), (this.valpha = 1);
    else if (e instanceof Ze)
      (this.model = e.model),
        (this.color = e.color.slice()),
        (this.valpha = e.valpha);
    else if (typeof e == "string") {
      var n = Do.get(e);
      if (n === null)
        throw new Error("Unable to parse color from string: " + e);
      (this.model = n.model),
        (i = At[this.model].channels),
        (this.color = n.value.slice(0, i)),
        (this.valpha = typeof n.value[i] == "number" ? n.value[i] : 1);
    } else if (e.length) {
      (this.model = t || "rgb"), (i = At[this.model].channels);
      var s = Ng.call(e, 0, i);
      (this.color = Ag(s, i)),
        (this.valpha = typeof e[i] == "number" ? e[i] : 1);
    } else if (typeof e == "number")
      (e &= 16777215),
        (this.model = "rgb"),
        (this.color = [(e >> 16) & 255, (e >> 8) & 255, e & 255]),
        (this.valpha = 1);
    else {
      this.valpha = 1;
      var a = Object.keys(e);
      "alpha" in e &&
        (a.splice(a.indexOf("alpha"), 1),
        (this.valpha = typeof e.alpha == "number" ? e.alpha : 0));
      var o = a.sort().join("");
      if (!(o in Rg))
        throw new Error(
          "Unable to parse color from object: " + JSON.stringify(e),
        );
      this.model = Rg[o];
      var u = At[this.model].labels,
        l = [];
      for (r = 0; r < u.length; r++) l.push(e[u[r]]);
      this.color = Ag(l);
    }
    if (ih[this.model])
      for (i = At[this.model].channels, r = 0; r < i; r++) {
        var f = ih[this.model][r];
        f && (this.color[r] = f(this.color[r]));
      }
    (this.valpha = Math.max(0, Math.min(1, this.valpha))),
      Object.freeze && Object.freeze(this);
  }
  Ze.prototype = {
    toString: function () {
      return this.string();
    },
    toJSON: function () {
      return this[this.model]();
    },
    string: function (e) {
      var t = this.model in Do.to ? this : this.rgb();
      t = t.round(typeof e == "number" ? e : 1);
      var r = t.valpha === 1 ? t.color : t.color.concat(this.valpha);
      return Do.to[t.model](r);
    },
    percentString: function (e) {
      var t = this.rgb().round(typeof e == "number" ? e : 1),
        r = t.valpha === 1 ? t.color : t.color.concat(this.valpha);
      return Do.to.rgb.percent(r);
    },
    array: function () {
      return this.valpha === 1
        ? this.color.slice()
        : this.color.concat(this.valpha);
    },
    object: function () {
      for (
        var e = {},
          t = At[this.model].channels,
          r = At[this.model].labels,
          i = 0;
        i < t;
        i++
      )
        e[r[i]] = this.color[i];
      return this.valpha !== 1 && (e.alpha = this.valpha), e;
    },
    unitArray: function () {
      var e = this.rgb().color;
      return (
        (e[0] /= 255),
        (e[1] /= 255),
        (e[2] /= 255),
        this.valpha !== 1 && e.push(this.valpha),
        e
      );
    },
    unitObject: function () {
      var e = this.rgb().object();
      return (
        (e.r /= 255),
        (e.g /= 255),
        (e.b /= 255),
        this.valpha !== 1 && (e.alpha = this.valpha),
        e
      );
    },
    round: function (e) {
      return (
        (e = Math.max(e || 0, 0)),
        new Ze(this.color.map(gj(e)).concat(this.valpha), this.model)
      );
    },
    alpha: function (e) {
      return arguments.length
        ? new Ze(this.color.concat(Math.max(0, Math.min(1, e))), this.model)
        : this.valpha;
    },
    red: Te("rgb", 0, Ue(255)),
    green: Te("rgb", 1, Ue(255)),
    blue: Te("rgb", 2, Ue(255)),
    hue: Te(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, function (e) {
      return ((e % 360) + 360) % 360;
    }),
    saturationl: Te("hsl", 1, Ue(100)),
    lightness: Te("hsl", 2, Ue(100)),
    saturationv: Te("hsv", 1, Ue(100)),
    value: Te("hsv", 2, Ue(100)),
    chroma: Te("hcg", 1, Ue(100)),
    gray: Te("hcg", 2, Ue(100)),
    white: Te("hwb", 1, Ue(100)),
    wblack: Te("hwb", 2, Ue(100)),
    cyan: Te("cmyk", 0, Ue(100)),
    magenta: Te("cmyk", 1, Ue(100)),
    yellow: Te("cmyk", 2, Ue(100)),
    black: Te("cmyk", 3, Ue(100)),
    x: Te("xyz", 0, Ue(100)),
    y: Te("xyz", 1, Ue(100)),
    z: Te("xyz", 2, Ue(100)),
    l: Te("lab", 0, Ue(100)),
    a: Te("lab", 1),
    b: Te("lab", 2),
    keyword: function (e) {
      return arguments.length ? new Ze(e) : At[this.model].keyword(this.color);
    },
    hex: function (e) {
      return arguments.length ? new Ze(e) : Do.to.hex(this.rgb().round().color);
    },
    rgbNumber: function () {
      var e = this.rgb().color;
      return ((e[0] & 255) << 16) | ((e[1] & 255) << 8) | (e[2] & 255);
    },
    luminosity: function () {
      for (var e = this.rgb().color, t = [], r = 0; r < e.length; r++) {
        var i = e[r] / 255;
        t[r] = i <= 0.03928 ? i / 12.92 : Math.pow((i + 0.055) / 1.055, 2.4);
      }
      return 0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2];
    },
    contrast: function (e) {
      var t = this.luminosity(),
        r = e.luminosity();
      return t > r ? (t + 0.05) / (r + 0.05) : (r + 0.05) / (t + 0.05);
    },
    level: function (e) {
      var t = this.contrast(e);
      return t >= 7.1 ? "AAA" : t >= 4.5 ? "AA" : "";
    },
    isDark: function () {
      var e = this.rgb().color,
        t = (e[0] * 299 + e[1] * 587 + e[2] * 114) / 1e3;
      return t < 128;
    },
    isLight: function () {
      return !this.isDark();
    },
    negate: function () {
      for (var e = this.rgb(), t = 0; t < 3; t++) e.color[t] = 255 - e.color[t];
      return e;
    },
    lighten: function (e) {
      var t = this.hsl();
      return (t.color[2] += t.color[2] * e), t;
    },
    darken: function (e) {
      var t = this.hsl();
      return (t.color[2] -= t.color[2] * e), t;
    },
    saturate: function (e) {
      var t = this.hsl();
      return (t.color[1] += t.color[1] * e), t;
    },
    desaturate: function (e) {
      var t = this.hsl();
      return (t.color[1] -= t.color[1] * e), t;
    },
    whiten: function (e) {
      var t = this.hwb();
      return (t.color[1] += t.color[1] * e), t;
    },
    blacken: function (e) {
      var t = this.hwb();
      return (t.color[2] += t.color[2] * e), t;
    },
    grayscale: function () {
      var e = this.rgb().color,
        t = e[0] * 0.3 + e[1] * 0.59 + e[2] * 0.11;
      return Ze.rgb(t, t, t);
    },
    fade: function (e) {
      return this.alpha(this.valpha - this.valpha * e);
    },
    opaquer: function (e) {
      return this.alpha(this.valpha + this.valpha * e);
    },
    rotate: function (e) {
      var t = this.hsl(),
        r = t.color[0];
      return (
        (r = (r + e) % 360), (r = r < 0 ? 360 + r : r), (t.color[0] = r), t
      );
    },
    mix: function (e, t) {
      if (!e || !e.rgb)
        throw new Error(
          'Argument to "mix" was not a Color instance, but rather an instance of ' +
            typeof e,
        );
      var r = e.rgb(),
        i = this.rgb(),
        n = t === void 0 ? 0.5 : t,
        s = 2 * n - 1,
        a = r.alpha() - i.alpha(),
        o = ((s * a === -1 ? s : (s + a) / (1 + s * a)) + 1) / 2,
        u = 1 - o;
      return Ze.rgb(
        o * r.red() + u * i.red(),
        o * r.green() + u * i.green(),
        o * r.blue() + u * i.blue(),
        r.alpha() * n + i.alpha() * (1 - n),
      );
    },
  };
  Object.keys(At).forEach(function (e) {
    if (_x.indexOf(e) === -1) {
      var t = At[e].channels;
      (Ze.prototype[e] = function () {
        if (this.model === e) return new Ze(this);
        if (arguments.length) return new Ze(arguments, e);
        var r = typeof arguments[t] == "number" ? t : this.valpha;
        return new Ze(yj(At[this.model][e].raw(this.color)).concat(r), e);
      }),
        (Ze[e] = function (r) {
          return (
            typeof r == "number" && (r = Ag(Ng.call(arguments), t)),
            new Ze(r, e)
          );
        });
    }
  });
  function mj(e, t) {
    return Number(e.toFixed(t));
  }
  function gj(e) {
    return function (t) {
      return mj(t, e);
    };
  }
  function Te(e, t, r) {
    return (
      (e = Array.isArray(e) ? e : [e]),
      e.forEach(function (i) {
        (ih[i] || (ih[i] = []))[t] = r;
      }),
      (e = e[0]),
      function (i) {
        var n;
        return arguments.length
          ? (r && (i = r(i)), (n = this[e]()), (n.color[t] = i), n)
          : ((n = this[e]().color[t]), r && (n = r(n)), n);
      }
    );
  }
  function Ue(e) {
    return function (t) {
      return Math.max(0, Math.min(e, t));
    };
  }
  function yj(e) {
    return Array.isArray(e) ? e : [e];
  }
  function Ag(e, t) {
    for (var r = 0; r < t; r++) typeof e[r] != "number" && (e[r] = 0);
    return e;
  }
  Sx.exports = Ze;
});
var Ox = y((QQ, Cx) => {
  "use strict";
  Cx.exports = function (t) {
    for (
      var r = 0, i = 0;
      r < t.length;
      i = t.charCodeAt(r++) + ((i << 5) - i)
    );
    var n = Math.floor(Math.abs(((Math.sin(i) * 1e4) % 1) * 16777216)).toString(
      16,
    );
    return "#" + Array(6 - n.length + 1).join("0") + n;
  };
});
var Ax = y((JQ, Rx) => {
  "use strict";
  var Tx = xx(),
    Fx = Ox();
  Rx.exports = function (t, r) {
    var i = t.split(r || ":"),
      n = Fx(i[0]);
    if (!i.length) return n;
    for (var s = 0, a = i.length - 1; s < a; s++)
      n = Tx(n)
        .mix(Tx(Fx(i[s + 1])))
        .saturate(1)
        .hex();
    return n;
  };
});
var Ix = y((eJ, Nx) => {
  "use strict";
  function tr(e, t) {
    if (t) return new tr(e).style(t);
    if (!(this instanceof tr)) return new tr(e);
    this.text = e;
  }
  tr.prototype.prefix = "\x1B[";
  tr.prototype.suffix = "m";
  tr.prototype.hex = function (t) {
    (t = t[0] === "#" ? t.substring(1) : t),
      t.length === 3 &&
        ((t = t.split("")),
        (t[5] = t[2]),
        (t[4] = t[2]),
        (t[3] = t[1]),
        (t[2] = t[1]),
        (t[1] = t[0]),
        (t = t.join("")));
    var r = t.substring(0, 2),
      i = t.substring(2, 4),
      n = t.substring(4, 6);
    return [parseInt(r, 16), parseInt(i, 16), parseInt(n, 16)];
  };
  tr.prototype.rgb = function (t, r, i) {
    var n = (t / 255) * 5,
      s = (r / 255) * 5,
      a = (i / 255) * 5;
    return this.ansi(n, s, a);
  };
  tr.prototype.ansi = function (t, r, i) {
    var n = Math.round(t),
      s = Math.round(r),
      a = Math.round(i);
    return 16 + n * 36 + s * 6 + a;
  };
  tr.prototype.reset = function () {
    return this.prefix + "39;49" + this.suffix;
  };
  tr.prototype.style = function (t) {
    return (
      this.prefix +
      "38;5;" +
      this.rgb.apply(this, this.hex(t)) +
      this.suffix +
      this.text +
      this.reset()
    );
  };
  Nx.exports = tr;
});
var Lx = y((tJ, Mx) => {
  var vj = Ax(),
    wj = Ix();
  Mx.exports = function (t, r) {
    var i = r.namespace,
      n = r.colors !== !1 ? wj(i + ":", vj(i)) : i + ":";
    return (t[0] = n + " " + t[0]), t;
  };
});
var Px = y((rJ, qx) => {
  "use strict";
  qx.exports = function (t, r) {
    if (!r) return !1;
    for (var i = r.split(/[\s,]+/), n = 0; n < i.length; n++) {
      if (((r = i[n].replace("*", ".*?")), r.charAt(0) === "-")) {
        if (new RegExp("^" + r.substr(1) + "$").test(t)) return !1;
        continue;
      }
      if (new RegExp("^" + r + "$").test(t)) return !0;
    }
    return !1;
  };
});
var kx = y((iJ, Bx) => {
  var Dj = Px();
  Bx.exports = function (t) {
    return function (i) {
      try {
        return Dj(i, t());
      } catch {}
      return !1;
    };
  };
});
var Ux = y((nJ, jx) => {
  var bj = kx();
  jx.exports = bj(function () {
    return process.env.DEBUG || process.env.DIAGNOSTICS;
  });
});
var $x = y((sJ, zx) => {
  zx.exports = function (e, t) {
    try {
      Function.prototype.apply.call(console.log, console, t);
    } catch {}
  };
});
var Gx = y((aJ, Wx) => {
  var Ej = Og(),
    _j = require("tty").isatty(1),
    nh = Ej(function e(t, r) {
      return (
        (r = r || {}),
        (r.colors = "colors" in r ? r.colors : _j),
        (r.namespace = t),
        (r.prod = !1),
        (r.dev = !0),
        !e.enabled(t) && !(r.force || e.force) ? e.nope(r) : e.yep(r)
      );
    });
  nh.modify(Lx());
  nh.use(Ux());
  nh.set($x());
  Wx.exports = nh;
});
var bo = y((oJ, Ig) => {
  process.env.NODE_ENV === "production"
    ? (Ig.exports = tx())
    : (Ig.exports = Gx());
});
var Yx = y((uJ, Hx) => {
  "use strict";
  var Mg = require("fs"),
    { StringDecoder: Sj } = require("string_decoder"),
    { Stream: xj } = st();
  function Cj() {}
  Hx.exports = (e, t) => {
    let r = Buffer.alloc(65536),
      i = new Sj("utf8"),
      n = new xj(),
      s = "",
      a = 0,
      o = 0;
    return (
      e.start === -1 && delete e.start,
      (n.readable = !0),
      (n.destroy = () => {
        (n.destroyed = !0), n.emit("end"), n.emit("close");
      }),
      Mg.open(e.file, "a+", "0644", (u, l) => {
        if (u) {
          t ? t(u) : n.emit("error", u), n.destroy();
          return;
        }
        (function f() {
          if (n.destroyed) {
            Mg.close(l, Cj);
            return;
          }
          return Mg.read(l, r, 0, r.length, a, (h, c) => {
            if (h) {
              t ? t(h) : n.emit("error", h), n.destroy();
              return;
            }
            if (!c)
              return (
                s &&
                  ((e.start == null || o > e.start) &&
                    (t ? t(null, s) : n.emit("line", s)),
                  o++,
                  (s = "")),
                setTimeout(f, 1e3)
              );
            let d = i.write(r.slice(0, c));
            t || n.emit("data", d), (d = (s + d).split(/\n+/));
            let g = d.length - 1,
              C = 0;
            for (; C < g; C++)
              (e.start == null || o > e.start) &&
                (t ? t(null, d[C]) : n.emit("line", d[C])),
                o++;
            return (s = d[g]), (a += c), f();
          });
        })();
      }),
      t ? n.destroy : n
    );
  };
});
var Zx = y((fJ, Xx) => {
  "use strict";
  var jr = require("fs"),
    at = require("path"),
    Oj = U2(),
    Tj = require("zlib"),
    { MESSAGE: Fj } = Me(),
    { Stream: Rj, PassThrough: Vx } = st(),
    Aj = Dn(),
    rr = bo()("winston:file"),
    Nj = require("os"),
    Ij = Yx();
  Xx.exports = class extends Aj {
    constructor(t = {}) {
      super(t), (this.name = t.name || "file");
      function r(i, ...n) {
        n.slice(1).forEach((s) => {
          if (t[s]) throw new Error(`Cannot set ${s} and ${i} together`);
        });
      }
      if (
        ((this._stream = new Vx()),
        this._stream.setMaxListeners(30),
        (this._onError = this._onError.bind(this)),
        t.filename || t.dirname)
      )
        r("filename or dirname", "stream"),
          (this._basename = this.filename =
            t.filename ? at.basename(t.filename) : "winston.log"),
          (this.dirname = t.dirname || at.dirname(t.filename)),
          (this.options = t.options || { flags: "a" });
      else if (t.stream)
        console.warn(
          "options.stream will be removed in winston@4. Use winston.transports.Stream",
        ),
          r("stream", "filename", "maxsize"),
          (this._dest = this._stream.pipe(this._setupStream(t.stream))),
          (this.dirname = at.dirname(this._dest.path));
      else throw new Error("Cannot log to file without filename or stream.");
      (this.maxsize = t.maxsize || null),
        (this.rotationFormat = t.rotationFormat || !1),
        (this.zippedArchive = t.zippedArchive || !1),
        (this.maxFiles = t.maxFiles || null),
        (this.eol = typeof t.eol == "string" ? t.eol : Nj.EOL),
        (this.tailable = t.tailable || !1),
        (this._size = 0),
        (this._pendingSize = 0),
        (this._created = 0),
        (this._drain = !1),
        (this._opening = !1),
        (this._ending = !1),
        this.dirname && this._createLogDirIfNotExist(this.dirname),
        this.open();
    }
    finishIfEnding() {
      this._ending &&
        (this._opening
          ? this.once("open", () => {
              this._stream.once("finish", () => this.emit("finish")),
                setImmediate(() => this._stream.end());
            })
          : (this._stream.once("finish", () => this.emit("finish")),
            setImmediate(() => this._stream.end())));
    }
    log(t, r = () => {}) {
      if (this.silent) return r(), !0;
      if (this._drain) {
        this._stream.once("drain", () => {
          (this._drain = !1), this.log(t, r);
        });
        return;
      }
      if (this._rotate) {
        this._stream.once("rotate", () => {
          (this._rotate = !1), this.log(t, r);
        });
        return;
      }
      let i = `${t[Fj]}${this.eol}`,
        n = Buffer.byteLength(i);
      function s() {
        (this._size += n),
          (this._pendingSize -= n),
          rr("logged %s %s", this._size, i),
          this.emit("logged", t),
          !this._opening &&
            (!this._needsNewFile() ||
              ((this._rotate = !0), this._endStream(() => this._rotateFile())));
      }
      (this._pendingSize += n),
        this._opening &&
          !this.rotatedWhileOpening &&
          this._needsNewFile(this._size + this._pendingSize) &&
          (this.rotatedWhileOpening = !0);
      let a = this._stream.write(i, s.bind(this));
      return (
        a
          ? r()
          : ((this._drain = !0),
            this._stream.once("drain", () => {
              (this._drain = !1), r();
            })),
        rr("written", a, this._drain),
        this.finishIfEnding(),
        a
      );
    }
    query(t, r) {
      typeof t == "function" && ((r = t), (t = {})), (t = h(t));
      let i = at.join(this.dirname, this.filename),
        n = "",
        s = [],
        a = 0,
        o = jr.createReadStream(i, { encoding: "utf8" });
      o.on("error", (c) => {
        if ((o.readable && o.destroy(), !!r))
          return c.code !== "ENOENT" ? r(c) : r(null, s);
      }),
        o.on("data", (c) => {
          c = (n + c).split(/\n+/);
          let d = c.length - 1,
            g = 0;
          for (; g < d; g++) (!t.start || a >= t.start) && u(c[g]), a++;
          n = c[d];
        }),
        o.on("close", () => {
          n && u(n, !0),
            t.order === "desc" && (s = s.reverse()),
            r && r(null, s);
        });
      function u(c, d) {
        try {
          let g = JSON.parse(c);
          f(g) && l(g);
        } catch (g) {
          d || o.emit("error", g);
        }
      }
      function l(c) {
        if (t.rows && s.length >= t.rows && t.order !== "desc") {
          o.readable && o.destroy();
          return;
        }
        t.fields && (c = t.fields.reduce((d, g) => ((d[g] = c[g]), d), {})),
          t.order === "desc" && s.length >= t.rows && s.shift(),
          s.push(c);
      }
      function f(c) {
        if (!c || typeof c != "object") return;
        let d = new Date(c.timestamp);
        if (
          !(
            (t.from && d < t.from) ||
            (t.until && d > t.until) ||
            (t.level && t.level !== c.level)
          )
        )
          return !0;
      }
      function h(c) {
        return (
          (c = c || {}),
          (c.rows = c.rows || c.limit || 10),
          (c.start = c.start || 0),
          (c.until = c.until || new Date()),
          typeof c.until != "object" && (c.until = new Date(c.until)),
          (c.from = c.from || c.until - 24 * 60 * 60 * 1e3),
          typeof c.from != "object" && (c.from = new Date(c.from)),
          (c.order = c.order || "desc"),
          c
        );
      }
    }
    stream(t = {}) {
      let r = at.join(this.dirname, this.filename),
        i = new Rj(),
        n = { file: r, start: t.start };
      return (
        (i.destroy = Ij(n, (s, a) => {
          if (s) return i.emit("error", s);
          try {
            i.emit("data", a), (a = JSON.parse(a)), i.emit("log", a);
          } catch (o) {
            i.emit("error", o);
          }
        })),
        i
      );
    }
    open() {
      !this.filename ||
        this._opening ||
        ((this._opening = !0),
        this.stat((t, r) => {
          if (t) return this.emit("error", t);
          rr("stat done: %s { size: %s }", this.filename, r),
            (this._size = r),
            (this._dest = this._createStream(this._stream)),
            (this._opening = !1),
            this.once("open", () => {
              this._stream.eventNames().includes("rotate")
                ? this._stream.emit("rotate")
                : (this._rotate = !1);
            });
        }));
    }
    stat(t) {
      let r = this._getFile(),
        i = at.join(this.dirname, r);
      jr.stat(i, (n, s) => {
        if (n && n.code === "ENOENT")
          return rr("ENOENT\xA0ok", i), (this.filename = r), t(null, 0);
        if (n) return rr(`err ${n.code} ${i}`), t(n);
        if (!s || this._needsNewFile(s.size))
          return this._incFile(() => this.stat(t));
        (this.filename = r), t(null, s.size);
      });
    }
    close(t) {
      !this._stream ||
        this._stream.end(() => {
          t && t(), this.emit("flush"), this.emit("closed");
        });
    }
    _needsNewFile(t) {
      return (t = t || this._size), this.maxsize && t >= this.maxsize;
    }
    _onError(t) {
      this.emit("error", t);
    }
    _setupStream(t) {
      return t.on("error", this._onError), t;
    }
    _cleanupStream(t) {
      return t.removeListener("error", this._onError), t;
    }
    _rotateFile() {
      this._incFile(() => this.open());
    }
    _endStream(t = () => {}) {
      this._dest
        ? (this._stream.unpipe(this._dest),
          this._dest.end(() => {
            this._cleanupStream(this._dest), t();
          }))
        : t();
    }
    _createStream(t) {
      let r = at.join(this.dirname, this.filename);
      rr("create stream start", r, this.options);
      let i = jr
        .createWriteStream(r, this.options)
        .on("error", (n) => rr(n))
        .on("close", () => rr("close", i.path, i.bytesWritten))
        .on("open", () => {
          rr("file open ok", r),
            this.emit("open", r),
            t.pipe(i),
            this.rotatedWhileOpening &&
              ((this._stream = new Vx()),
              this._stream.setMaxListeners(30),
              this._rotateFile(),
              (this.rotatedWhileOpening = !1),
              this._cleanupStream(i),
              t.end());
        });
      if ((rr("create stream ok", r), this.zippedArchive)) {
        let n = Tj.createGzip();
        return n.pipe(i), n;
      }
      return i;
    }
    _incFile(t) {
      rr("_incFile", this.filename);
      let r = at.extname(this._basename),
        i = at.basename(this._basename, r);
      this.tailable
        ? this._checkMaxFilesTailable(r, i, t)
        : ((this._created += 1), this._checkMaxFilesIncrementing(r, i, t));
    }
    _getFile() {
      let t = at.extname(this._basename),
        r = at.basename(this._basename, t),
        i = this.rotationFormat ? this.rotationFormat() : this._created,
        n = !this.tailable && this._created ? `${r}${i}${t}` : `${r}${t}`;
      return this.zippedArchive && !this.tailable ? `${n}.gz` : n;
    }
    _checkMaxFilesIncrementing(t, r, i) {
      if (!this.maxFiles || this._created < this.maxFiles)
        return setImmediate(i);
      let n = this._created - this.maxFiles,
        s = n !== 0 ? n : "",
        a = this.zippedArchive ? ".gz" : "",
        o = `${r}${s}${t}${a}`,
        u = at.join(this.dirname, o);
      jr.unlink(u, i);
    }
    _checkMaxFilesTailable(t, r, i) {
      let n = [];
      if (!this.maxFiles) return;
      let s = this.zippedArchive ? ".gz" : "";
      for (let a = this.maxFiles - 1; a > 1; a--)
        n.push(
          function (o, u) {
            let l = `${r}${o - 1}${t}${s}`,
              f = at.join(this.dirname, l);
            jr.exists(f, (h) => {
              if (!h) return u(null);
              (l = `${r}${o}${t}${s}`),
                jr.rename(f, at.join(this.dirname, l), u);
            });
          }.bind(this, a),
        );
      Oj(n, () => {
        jr.rename(
          at.join(this.dirname, `${r}${t}`),
          at.join(this.dirname, `${r}1${t}${s}`),
          i,
        );
      });
    }
    _createLogDirIfNotExist(t) {
      jr.existsSync(t) || jr.mkdirSync(t, { recursive: !0 });
    }
  };
});
var Qx = y((cJ, Kx) => {
  "use strict";
  var Mj = require("http"),
    Lj = require("https"),
    { Stream: qj } = st(),
    Pj = Dn(),
    Bj = to();
  Kx.exports = class extends Pj {
    constructor(t = {}) {
      super(t),
        (this.options = t),
        (this.name = t.name || "http"),
        (this.ssl = !!t.ssl),
        (this.host = t.host || "localhost"),
        (this.port = t.port),
        (this.auth = t.auth),
        (this.path = t.path || ""),
        (this.agent = t.agent),
        (this.headers = t.headers || {}),
        (this.headers["content-type"] = "application/json"),
        (this.batch = t.batch || !1),
        (this.batchInterval = t.batchInterval || 5e3),
        (this.batchCount = t.batchCount || 10),
        (this.batchOptions = []),
        (this.batchTimeoutID = -1),
        (this.batchCallback = {}),
        this.port || (this.port = this.ssl ? 443 : 80);
    }
    log(t, r) {
      this._request(t, (i, n) => {
        n &&
          n.statusCode !== 200 &&
          (i = new Error(`Invalid HTTP Status Code: ${n.statusCode}`)),
          i ? this.emit("warn", i) : this.emit("logged", t);
      }),
        r && setImmediate(r);
    }
    query(t, r) {
      typeof t == "function" && ((r = t), (t = {})),
        (t = { method: "query", params: this.normalizeQuery(t) }),
        t.params.path && ((t.path = t.params.path), delete t.params.path),
        t.params.auth && ((t.auth = t.params.auth), delete t.params.auth),
        this._request(t, (i, n, s) => {
          if (
            (n &&
              n.statusCode !== 200 &&
              (i = new Error(`Invalid HTTP Status Code: ${n.statusCode}`)),
            i)
          )
            return r(i);
          if (typeof s == "string")
            try {
              s = JSON.parse(s);
            } catch (a) {
              return r(a);
            }
          r(null, s);
        });
    }
    stream(t = {}) {
      let r = new qj();
      (t = { method: "stream", params: t }),
        t.params.path && ((t.path = t.params.path), delete t.params.path),
        t.params.auth && ((t.auth = t.params.auth), delete t.params.auth);
      let i = "",
        n = this._request(t);
      return (
        (r.destroy = () => n.destroy()),
        n.on("data", (s) => {
          s = (i + s).split(/\n+/);
          let a = s.length - 1,
            o = 0;
          for (; o < a; o++)
            try {
              r.emit("log", JSON.parse(s[o]));
            } catch (u) {
              r.emit("error", u);
            }
          i = s[a];
        }),
        n.on("error", (s) => r.emit("error", s)),
        r
      );
    }
    _request(t, r) {
      t = t || {};
      let i = t.auth || this.auth,
        n = t.path || this.path || "";
      delete t.auth,
        delete t.path,
        this.batch ? this._doBatch(t, r, i, n) : this._doRequest(t, r, i, n);
    }
    _doBatch(t, r, i, n) {
      if ((this.batchOptions.push(t), this.batchOptions.length === 1)) {
        let s = this;
        (this.batchCallback = r),
          (this.batchTimeoutID = setTimeout(function () {
            (s.batchTimeoutID = -1), s._doBatchRequest(s.batchCallback, i, n);
          }, this.batchInterval));
      }
      this.batchOptions.length === this.batchCount &&
        this._doBatchRequest(this.batchCallback, i, n);
    }
    _doBatchRequest(t, r, i) {
      this.batchTimeoutID > 0 &&
        (clearTimeout(this.batchTimeoutID), (this.batchTimeoutID = -1));
      let n = this.batchOptions.slice();
      (this.batchOptions = []), this._doRequest(n, t, r, i);
    }
    _doRequest(t, r, i, n) {
      let s = Object.assign({}, this.headers);
      i && i.bearer && (s.Authorization = `Bearer ${i.bearer}`);
      let a = (this.ssl ? Lj : Mj).request({
        ...this.options,
        method: "POST",
        host: this.host,
        port: this.port,
        path: `/${n.replace(/^\//, "")}`,
        headers: s,
        auth:
          i && i.username && i.password ? `${i.username}:${i.password}` : "",
        agent: this.agent,
      });
      a.on("error", r),
        a.on("response", (o) => o.on("end", () => r(null, o)).resume()),
        a.end(Buffer.from(Bj(t, this.options.replacer), "utf8"));
    }
  };
});
var Lg = y((dJ, Jx) => {
  "use strict";
  var yr = (e) =>
    e !== null && typeof e == "object" && typeof e.pipe == "function";
  yr.writable = (e) =>
    yr(e) &&
    e.writable !== !1 &&
    typeof e._write == "function" &&
    typeof e._writableState == "object";
  yr.readable = (e) =>
    yr(e) &&
    e.readable !== !1 &&
    typeof e._read == "function" &&
    typeof e._readableState == "object";
  yr.duplex = (e) => yr.writable(e) && yr.readable(e);
  yr.transform = (e) => yr.duplex(e) && typeof e._transform == "function";
  Jx.exports = yr;
});
var tC = y((mJ, eC) => {
  "use strict";
  var kj = Lg(),
    { MESSAGE: jj } = Me(),
    Uj = require("os"),
    zj = Dn();
  eC.exports = class extends zj {
    constructor(t = {}) {
      if ((super(t), !t.stream || !kj(t.stream)))
        throw new Error("options.stream is required.");
      (this._stream = t.stream),
        this._stream.setMaxListeners(1 / 0),
        (this.isObjectMode = t.stream._writableState.objectMode),
        (this.eol = typeof t.eol == "string" ? t.eol : Uj.EOL);
    }
    log(t, r) {
      if ((setImmediate(() => this.emit("logged", t)), this.isObjectMode)) {
        this._stream.write(t), r && r();
        return;
      }
      this._stream.write(`${t[jj]}${this.eol}`), r && r();
    }
  };
});
var rC = y((Eo) => {
  "use strict";
  Object.defineProperty(Eo, "Console", {
    configurable: !0,
    enumerable: !0,
    get() {
      return s2();
    },
  });
  Object.defineProperty(Eo, "File", {
    configurable: !0,
    enumerable: !0,
    get() {
      return Zx();
    },
  });
  Object.defineProperty(Eo, "Http", {
    configurable: !0,
    enumerable: !0,
    get() {
      return Qx();
    },
  });
  Object.defineProperty(Eo, "Stream", {
    configurable: !0,
    enumerable: !0,
    get() {
      return tC();
    },
  });
});
var ah = y((_o) => {
  "use strict";
  var sh = qm(),
    { configs: qg } = Me();
  _o.cli = sh.levels(qg.cli);
  _o.npm = sh.levels(qg.npm);
  _o.syslog = sh.levels(qg.syslog);
  _o.addColors = sh.levels;
});
var nC = y((oh, iC) => {
  "use strict";
  Object.defineProperty(oh, "__esModule", { value: !0 });
  var $j = Lf(),
    Wj = _n($j),
    Gj = Gf(),
    Hj = _n(Gj),
    Yj = vg(),
    Vj = _n(Yj),
    Xj = mg(),
    Zj = _n(Xj),
    Kj = gg(),
    Qj = _n(Kj),
    Jj = bn(),
    e7 = _n(Jj),
    t7 = As(),
    r7 = _n(t7);
  function _n(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function i7(e, t, r) {
    r = (0, Zj.default)(r);
    var i = 0,
      n = 0,
      { length: s } = e,
      a = !1;
    s === 0 && r(null);
    function o(u, l) {
      u === !1 && (a = !0),
        a !== !0 && (u ? r(u) : (++n === s || l === Hj.default) && r(null));
    }
    for (; i < s; i++) t(e[i], i, (0, Qj.default)(o));
  }
  function n7(e, t, r) {
    return (0, Vj.default)(e, 1 / 0, t, r);
  }
  function s7(e, t, r) {
    var i = (0, Wj.default)(e) ? i7 : n7;
    return i(e, (0, e7.default)(t), r);
  }
  oh.default = (0, r7.default)(s7, 3);
  iC.exports = oh.default;
});
var aC = y((uh, sC) => {
  "use strict";
  Object.defineProperty(uh, "__esModule", { value: !0 });
  uh.default = a7;
  function a7(e) {
    return (t, r, i) => e(t, i);
  }
  sC.exports = uh.default;
});
var hh = y((fh, oC) => {
  "use strict";
  Object.defineProperty(fh, "__esModule", { value: !0 });
  var o7 = nC(),
    u7 = lh(o7),
    l7 = aC(),
    f7 = lh(l7),
    h7 = bn(),
    c7 = lh(h7),
    d7 = As(),
    p7 = lh(d7);
  function lh(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function m7(e, t, r) {
    return (0, u7.default)(e, (0, f7.default)((0, c7.default)(t)), r);
  }
  fh.default = (0, p7.default)(m7, 3);
  oC.exports = fh.default;
});
var lC = y((vJ, uC) => {
  "use strict";
  var g7 = Object.prototype.toString;
  uC.exports = function (t) {
    if (typeof t.displayName == "string" && t.constructor.name)
      return t.displayName;
    if (typeof t.name == "string" && t.name) return t.name;
    if (
      typeof t == "object" &&
      t.constructor &&
      typeof t.constructor.name == "string"
    )
      return t.constructor.name;
    var r = t.toString(),
      i = g7.call(t).slice(8, -1);
    return (
      i === "Function"
        ? (r = r.substring(r.indexOf("(") + 1, r.indexOf(")")))
        : (r = i),
      r || "anonymous"
    );
  };
});
var Pg = y((wJ, fC) => {
  "use strict";
  var y7 = lC();
  fC.exports = function (t) {
    var r = 0,
      i;
    function n() {
      return r || ((r = 1), (i = t.apply(this, arguments)), (t = null)), i;
    }
    return (n.displayName = y7(t)), n;
  };
});
var Bg = y((xo) => {
  xo.get = function (e) {
    var t = Error.stackTraceLimit;
    Error.stackTraceLimit = 1 / 0;
    var r = {},
      i = Error.prepareStackTrace;
    (Error.prepareStackTrace = function (s, a) {
      return a;
    }),
      Error.captureStackTrace(r, e || xo.get);
    var n = r.stack;
    return (Error.prepareStackTrace = i), (Error.stackTraceLimit = t), n;
  };
  xo.parse = function (e) {
    if (!e.stack) return [];
    var t = this,
      r = e.stack
        .split(
          `
`,
        )
        .slice(1);
    return r
      .map(function (i) {
        if (i.match(/^\s*[-]{4,}$/))
          return t._createParsedCallSite({
            fileName: i,
            lineNumber: null,
            functionName: null,
            typeName: null,
            methodName: null,
            columnNumber: null,
            native: null,
          });
        var n = i.match(
          /at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/,
        );
        if (!!n) {
          var s = null,
            a = null,
            o = null,
            u = null,
            l = null,
            f = n[5] === "native";
          if (n[1]) {
            o = n[1];
            var h = o.lastIndexOf(".");
            if ((o[h - 1] == "." && h--, h > 0)) {
              (s = o.substr(0, h)), (a = o.substr(h + 1));
              var c = s.indexOf(".Module");
              c > 0 && ((o = o.substr(c + 1)), (s = s.substr(0, c)));
            }
            u = null;
          }
          a && ((u = s), (l = a)),
            a === "<anonymous>" && ((l = null), (o = null));
          var d = {
            fileName: n[2] || null,
            lineNumber: parseInt(n[3], 10) || null,
            functionName: o,
            typeName: u,
            methodName: l,
            columnNumber: parseInt(n[4], 10) || null,
            native: f,
          };
          return t._createParsedCallSite(d);
        }
      })
      .filter(function (i) {
        return !!i;
      });
  };
  function So(e) {
    for (var t in e) this[t] = e[t];
  }
  var v7 = [
      "this",
      "typeName",
      "functionName",
      "methodName",
      "fileName",
      "lineNumber",
      "columnNumber",
      "function",
      "evalOrigin",
    ],
    w7 = ["topLevel", "eval", "native", "constructor"];
  v7.forEach(function (e) {
    (So.prototype[e] = null),
      (So.prototype["get" + e[0].toUpperCase() + e.substr(1)] = function () {
        return this[e];
      });
  });
  w7.forEach(function (e) {
    (So.prototype[e] = !1),
      (So.prototype["is" + e[0].toUpperCase() + e.substr(1)] = function () {
        return this[e];
      });
  });
  xo._createParsedCallSite = function (e) {
    return new So(e);
  };
});
var kg = y((EJ, hC) => {
  "use strict";
  var { Writable: D7 } = st();
  hC.exports = class extends D7 {
    constructor(t) {
      if ((super({ objectMode: !0 }), !t))
        throw new Error("ExceptionStream requires a TransportStream instance.");
      (this.handleExceptions = !0), (this.transport = t);
    }
    _write(t, r, i) {
      return t.exception ? this.transport.log(t, i) : (i(), !0);
    }
  };
});
var Ug = y((SJ, pC) => {
  "use strict";
  var cC = require("os"),
    b7 = hh(),
    jg = bo()("winston:exception"),
    E7 = Pg(),
    dC = Bg(),
    _7 = kg();
  pC.exports = class {
    constructor(t) {
      if (!t) throw new Error("Logger is required to handle exceptions");
      (this.logger = t), (this.handlers = new Map());
    }
    handle(...t) {
      t.forEach((r) => {
        if (Array.isArray(r)) return r.forEach((i) => this._addHandler(i));
        this._addHandler(r);
      }),
        this.catcher ||
          ((this.catcher = this._uncaughtException.bind(this)),
          process.on("uncaughtException", this.catcher));
    }
    unhandle() {
      this.catcher &&
        (process.removeListener("uncaughtException", this.catcher),
        (this.catcher = !1),
        Array.from(this.handlers.values()).forEach((t) =>
          this.logger.unpipe(t),
        ));
    }
    getAllInfo(t) {
      let { message: r } = t;
      return (
        !r && typeof t == "string" && (r = t),
        {
          error: t,
          level: "error",
          message: [
            `uncaughtException: ${r || "(no error message)"}`,
            t.stack || "  No stack trace",
          ].join(`
`),
          stack: t.stack,
          exception: !0,
          date: new Date().toString(),
          process: this.getProcessInfo(),
          os: this.getOsInfo(),
          trace: this.getTrace(t),
        }
      );
    }
    getProcessInfo() {
      return {
        pid: process.pid,
        uid: process.getuid ? process.getuid() : null,
        gid: process.getgid ? process.getgid() : null,
        cwd: process.cwd(),
        execPath: process.execPath,
        version: process.version,
        argv: process.argv,
        memoryUsage: process.memoryUsage(),
      };
    }
    getOsInfo() {
      return { loadavg: cC.loadavg(), uptime: cC.uptime() };
    }
    getTrace(t) {
      return (t ? dC.parse(t) : dC.get()).map((i) => ({
        column: i.getColumnNumber(),
        file: i.getFileName(),
        function: i.getFunctionName(),
        line: i.getLineNumber(),
        method: i.getMethodName(),
        native: i.isNative(),
      }));
    }
    _addHandler(t) {
      if (!this.handlers.has(t)) {
        t.handleExceptions = !0;
        let r = new _7(t);
        this.handlers.set(t, r), this.logger.pipe(r);
      }
    }
    _uncaughtException(t) {
      let r = this.getAllInfo(t),
        i = this._getExceptionHandlers(),
        n =
          typeof this.logger.exitOnError == "function"
            ? this.logger.exitOnError(t)
            : this.logger.exitOnError,
        s;
      !i.length &&
        n &&
        (console.warn(
          "winston: exitOnError cannot be true with no exception handlers.",
        ),
        console.warn("winston: not exiting process."),
        (n = !1));
      function a() {
        jg("doExit", n),
          jg("process._exiting", process._exiting),
          n && !process._exiting && (s && clearTimeout(s), process.exit(1));
      }
      if (!i || i.length === 0) return process.nextTick(a);
      b7(
        i,
        (o, u) => {
          let l = E7(u),
            f = o.transport || o;
          function h(c) {
            return () => {
              jg(c), l();
            };
          }
          (f._ending = !0),
            f.once("finish", h("finished")),
            f.once("error", h("error"));
        },
        () => n && a(),
      ),
        this.logger.log(r),
        n && (s = setTimeout(a, 3e3));
    }
    _getExceptionHandlers() {
      return this.logger.transports.filter(
        (t) => (t.transport || t).handleExceptions,
      );
    }
  };
});
var $g = y((CJ, yC) => {
  "use strict";
  var mC = require("os"),
    S7 = hh(),
    zg = bo()("winston:rejection"),
    x7 = Pg(),
    gC = Bg(),
    C7 = kg();
  yC.exports = class {
    constructor(t) {
      if (!t) throw new Error("Logger is required to handle rejections");
      (this.logger = t), (this.handlers = new Map());
    }
    handle(...t) {
      t.forEach((r) => {
        if (Array.isArray(r)) return r.forEach((i) => this._addHandler(i));
        this._addHandler(r);
      }),
        this.catcher ||
          ((this.catcher = this._unhandledRejection.bind(this)),
          process.on("unhandledRejection", this.catcher));
    }
    unhandle() {
      this.catcher &&
        (process.removeListener("unhandledRejection", this.catcher),
        (this.catcher = !1),
        Array.from(this.handlers.values()).forEach((t) =>
          this.logger.unpipe(t),
        ));
    }
    getAllInfo(t) {
      let r = null;
      return (
        t && (r = typeof t == "string" ? t : t.message),
        {
          error: t,
          level: "error",
          message: [
            `unhandledRejection: ${r || "(no error message)"}`,
            (t && t.stack) || "  No stack trace",
          ].join(`
`),
          stack: t && t.stack,
          exception: !0,
          date: new Date().toString(),
          process: this.getProcessInfo(),
          os: this.getOsInfo(),
          trace: this.getTrace(t),
        }
      );
    }
    getProcessInfo() {
      return {
        pid: process.pid,
        uid: process.getuid ? process.getuid() : null,
        gid: process.getgid ? process.getgid() : null,
        cwd: process.cwd(),
        execPath: process.execPath,
        version: process.version,
        argv: process.argv,
        memoryUsage: process.memoryUsage(),
      };
    }
    getOsInfo() {
      return { loadavg: mC.loadavg(), uptime: mC.uptime() };
    }
    getTrace(t) {
      return (t ? gC.parse(t) : gC.get()).map((i) => ({
        column: i.getColumnNumber(),
        file: i.getFileName(),
        function: i.getFunctionName(),
        line: i.getLineNumber(),
        method: i.getMethodName(),
        native: i.isNative(),
      }));
    }
    _addHandler(t) {
      if (!this.handlers.has(t)) {
        t.handleRejections = !0;
        let r = new C7(t);
        this.handlers.set(t, r), this.logger.pipe(r);
      }
    }
    _unhandledRejection(t) {
      let r = this.getAllInfo(t),
        i = this._getRejectionHandlers(),
        n =
          typeof this.logger.exitOnError == "function"
            ? this.logger.exitOnError(t)
            : this.logger.exitOnError,
        s;
      !i.length &&
        n &&
        (console.warn(
          "winston: exitOnError cannot be true with no rejection handlers.",
        ),
        console.warn("winston: not exiting process."),
        (n = !1));
      function a() {
        zg("doExit", n),
          zg("process._exiting", process._exiting),
          n && !process._exiting && (s && clearTimeout(s), process.exit(1));
      }
      if (!i || i.length === 0) return process.nextTick(a);
      S7(
        i,
        (o, u) => {
          let l = x7(u),
            f = o.transport || o;
          function h(c) {
            return () => {
              zg(c), l();
            };
          }
          (f._ending = !0),
            f.once("finish", h("finished")),
            f.once("error", h("error"));
        },
        () => n && a(),
      ),
        this.logger.log(r),
        n && (s = setTimeout(a, 3e3));
    }
    _getRejectionHandlers() {
      return this.logger.transports.filter(
        (t) => (t.transport || t).handleRejections,
      );
    }
  };
});
var wC = y((TJ, vC) => {
  "use strict";
  vC.exports = class {
    constructor(t) {
      if (!t) throw new Error("Logger is required for profiling.");
      (this.logger = t), (this.start = Date.now());
    }
    done(...t) {
      typeof t[t.length - 1] == "function" &&
        (console.warn(
          "Callback function no longer supported as of winston@3.0.0",
        ),
        t.pop());
      let r = typeof t[t.length - 1] == "object" ? t.pop() : {};
      return (
        (r.level = r.level || "info"),
        (r.durationMs = Date.now() - this.start),
        this.logger.write(r)
      );
    }
  };
});
var SC = y((FJ, _C) => {
  "use strict";
  var { Stream: O7, Transform: T7 } = st(),
    DC = hh(),
    { LEVEL: vr, SPLAT: bC } = Me(),
    EC = Lg(),
    F7 = Ug(),
    R7 = $g(),
    A7 = cg(),
    N7 = wC(),
    { warn: I7 } = Pm(),
    M7 = ah(),
    L7 = /%[scdjifoO%]/g,
    ch = class extends T7 {
      constructor(t) {
        super({ objectMode: !0 }), this.configure(t);
      }
      child(t) {
        let r = this;
        return Object.create(r, {
          write: {
            value: function (i) {
              let n = Object.assign({}, t, i);
              i instanceof Error &&
                ((n.stack = i.stack), (n.message = i.message)),
                r.write(n);
            },
          },
        });
      }
      configure({
        silent: t,
        format: r,
        defaultMeta: i,
        levels: n,
        level: s = "info",
        exitOnError: a = !0,
        transports: o,
        colors: u,
        emitErrs: l,
        formatters: f,
        padLevels: h,
        rewriters: c,
        stripColors: d,
        exceptionHandlers: g,
        rejectionHandlers: C,
      } = {}) {
        if (
          (this.transports.length && this.clear(),
          (this.silent = t),
          (this.format = r || this.format || Am()()),
          (this.defaultMeta = i || null),
          (this.levels = n || this.levels || M7.npm.levels),
          (this.level = s),
          this.exceptions && this.exceptions.unhandle(),
          this.rejections && this.rejections.unhandle(),
          (this.exceptions = new F7(this)),
          (this.rejections = new R7(this)),
          (this.profilers = {}),
          (this.exitOnError = a),
          o &&
            ((o = Array.isArray(o) ? o : [o]), o.forEach((S) => this.add(S))),
          u || l || f || h || c || d)
        )
          throw new Error(
            [
              "{ colors, emitErrs, formatters, padLevels, rewriters, stripColors } were removed in winston@3.0.0.",
              "Use a custom winston.format(function) instead.",
              "See: https://github.com/winstonjs/winston/tree/master/UPGRADE-3.0.md",
            ].join(`
`),
          );
        g && this.exceptions.handle(g), C && this.rejections.handle(C);
      }
      isLevelEnabled(t) {
        let r = Wg(this.levels, t);
        if (r === null) return !1;
        let i = Wg(this.levels, this.level);
        return i === null
          ? !1
          : !this.transports || this.transports.length === 0
          ? i >= r
          : this.transports.findIndex((s) => {
              let a = Wg(this.levels, s.level);
              return a === null && (a = i), a >= r;
            }) !== -1;
      }
      log(t, r, ...i) {
        if (arguments.length === 1)
          return (
            (t[vr] = t.level), this._addDefaultMeta(t), this.write(t), this
          );
        if (arguments.length === 2)
          return r && typeof r == "object"
            ? ((r[vr] = r.level = t),
              this._addDefaultMeta(r),
              this.write(r),
              this)
            : ((r = { [vr]: t, level: t, message: r }),
              this._addDefaultMeta(r),
              this.write(r),
              this);
        let [n] = i;
        if (
          typeof n == "object" &&
          n !== null &&
          !(r && r.match && r.match(L7))
        ) {
          let a = Object.assign({}, this.defaultMeta, n, {
            [vr]: t,
            [bC]: i,
            level: t,
            message: r,
          });
          return (
            n.message && (a.message = `${a.message} ${n.message}`),
            n.stack && (a.stack = n.stack),
            this.write(a),
            this
          );
        }
        return (
          this.write(
            Object.assign({}, this.defaultMeta, {
              [vr]: t,
              [bC]: i,
              level: t,
              message: r,
            }),
          ),
          this
        );
      }
      _transform(t, r, i) {
        if (this.silent) return i();
        t[vr] || (t[vr] = t.level),
          !this.levels[t[vr]] &&
            this.levels[t[vr]] !== 0 &&
            console.error("[winston] Unknown logger level: %s", t[vr]),
          this._readableState.pipes ||
            console.error(
              "[winston] Attempt to write logs with no transports, which can increase memory usage: %j",
              t,
            );
        try {
          this.push(this.format.transform(t, this.format.options));
        } finally {
          (this._writableState.sync = !1), i();
        }
      }
      _final(t) {
        let r = this.transports.slice();
        DC(
          r,
          (i, n) => {
            if (!i || i.finished) return setImmediate(n);
            i.once("finish", n), i.end();
          },
          t,
        );
      }
      add(t) {
        let r = !EC(t) || t.log.length > 2 ? new A7({ transport: t }) : t;
        if (!r._writableState || !r._writableState.objectMode)
          throw new Error(
            "Transports must WritableStreams in objectMode. Set { objectMode: true }.",
          );
        return (
          this._onEvent("error", r),
          this._onEvent("warn", r),
          this.pipe(r),
          t.handleExceptions && this.exceptions.handle(),
          t.handleRejections && this.rejections.handle(),
          this
        );
      }
      remove(t) {
        if (!t) return this;
        let r = t;
        return (
          (!EC(t) || t.log.length > 2) &&
            (r = this.transports.filter((i) => i.transport === t)[0]),
          r && this.unpipe(r),
          this
        );
      }
      clear() {
        return this.unpipe(), this;
      }
      close() {
        return (
          this.exceptions.unhandle(),
          this.rejections.unhandle(),
          this.clear(),
          this.emit("close"),
          this
        );
      }
      setLevels() {
        I7.deprecated("setLevels");
      }
      query(t, r) {
        typeof t == "function" && ((r = t), (t = {})), (t = t || {});
        let i = {},
          n = Object.assign({}, t.query || {});
        function s(o, u) {
          t.query &&
            typeof o.formatQuery == "function" &&
            (t.query = o.formatQuery(n)),
            o.query(t, (l, f) => {
              if (l) return u(l);
              typeof o.formatResults == "function" &&
                (f = o.formatResults(f, t.format)),
                u(null, f);
            });
        }
        function a(o, u) {
          s(o, (l, f) => {
            u && ((f = l || f), f && (i[o.name] = f), u()), (u = null);
          });
        }
        DC(
          this.transports.filter((o) => !!o.query),
          a,
          () => r(null, i),
        );
      }
      stream(t = {}) {
        let r = new O7(),
          i = [];
        return (
          (r._streams = i),
          (r.destroy = () => {
            let n = i.length;
            for (; n--; ) i[n].destroy();
          }),
          this.transports
            .filter((n) => !!n.stream)
            .forEach((n) => {
              let s = n.stream(t);
              !s ||
                (i.push(s),
                s.on("log", (a) => {
                  (a.transport = a.transport || []),
                    a.transport.push(n.name),
                    r.emit("log", a);
                }),
                s.on("error", (a) => {
                  (a.transport = a.transport || []),
                    a.transport.push(n.name),
                    r.emit("error", a);
                }));
            }),
          r
        );
      }
      startTimer() {
        return new N7(this);
      }
      profile(t, ...r) {
        let i = Date.now();
        if (this.profilers[t]) {
          let n = this.profilers[t];
          delete this.profilers[t],
            typeof r[r.length - 2] == "function" &&
              (console.warn(
                "Callback function no longer supported as of winston@3.0.0",
              ),
              r.pop());
          let s = typeof r[r.length - 1] == "object" ? r.pop() : {};
          return (
            (s.level = s.level || "info"),
            (s.durationMs = i - n),
            (s.message = s.message || t),
            this.write(s)
          );
        }
        return (this.profilers[t] = i), this;
      }
      handleExceptions(...t) {
        console.warn(
          "Deprecated: .handleExceptions() will be removed in winston@4. Use .exceptions.handle()",
        ),
          this.exceptions.handle(...t);
      }
      unhandleExceptions(...t) {
        console.warn(
          "Deprecated: .unhandleExceptions() will be removed in winston@4. Use .exceptions.unhandle()",
        ),
          this.exceptions.unhandle(...t);
      }
      cli() {
        throw new Error(
          [
            "Logger.cli() was removed in winston@3.0.0",
            "Use a custom winston.formats.cli() instead.",
            "See: https://github.com/winstonjs/winston/tree/master/UPGRADE-3.0.md",
          ].join(`
`),
        );
      }
      _onEvent(t, r) {
        function i(n) {
          t === "error" && !this.transports.includes(r) && this.add(r),
            this.emit(t, n, r);
        }
        r["__winston" + t] ||
          ((r["__winston" + t] = i.bind(this)), r.on(t, r["__winston" + t]));
      }
      _addDefaultMeta(t) {
        this.defaultMeta && Object.assign(t, this.defaultMeta);
      }
    };
  function Wg(e, t) {
    let r = e[t];
    return !r && r !== 0 ? null : r;
  }
  Object.defineProperty(ch.prototype, "transports", {
    configurable: !1,
    enumerable: !0,
    get() {
      let { pipes: e } = this._readableState;
      return Array.isArray(e) ? e : [e].filter(Boolean);
    },
  });
  _C.exports = ch;
});
var Gg = y((RJ, xC) => {
  "use strict";
  var { LEVEL: q7 } = Me(),
    P7 = ah(),
    B7 = SC(),
    k7 = bo()("winston:create-logger");
  function j7(e) {
    return "is" + e.charAt(0).toUpperCase() + e.slice(1) + "Enabled";
  }
  xC.exports = function (e = {}) {
    e.levels = e.levels || P7.npm.levels;
    class t extends B7 {
      constructor(n) {
        super(n);
      }
    }
    let r = new t(e);
    return (
      Object.keys(e.levels).forEach(function (i) {
        if ((k7('Define prototype method for "%s"', i), i === "log")) {
          console.warn(
            'Level "log" not defined: conflicts with the method "log". Use a different level name.',
          );
          return;
        }
        (t.prototype[i] = function (...n) {
          let s = this || r;
          if (n.length === 1) {
            let [a] = n,
              o = (a && a.message && a) || { message: a };
            return (
              (o.level = o[q7] = i), s._addDefaultMeta(o), s.write(o), this || r
            );
          }
          return n.length === 0 ? (s.log(i, ""), s) : s.log(i, ...n);
        }),
          (t.prototype[j7(i)] = function () {
            return (this || r).isLevelEnabled(i);
          });
      }),
      r
    );
  };
});
var OC = y((NJ, CC) => {
  "use strict";
  var U7 = Gg();
  CC.exports = class {
    constructor(t = {}) {
      (this.loggers = new Map()), (this.options = t);
    }
    add(t, r) {
      if (!this.loggers.has(t)) {
        r = Object.assign({}, r || this.options);
        let i = r.transports || this.options.transports;
        r.transports = i ? i.slice() : [];
        let n = U7(r);
        n.on("close", () => this._delete(t)), this.loggers.set(t, n);
      }
      return this.loggers.get(t);
    }
    get(t, r) {
      return this.add(t, r);
    }
    has(t) {
      return !!this.loggers.has(t);
    }
    close(t) {
      if (t) return this._removeLogger(t);
      this.loggers.forEach((r, i) => this._removeLogger(i));
    }
    _removeLogger(t) {
      if (!this.loggers.has(t)) return;
      this.loggers.get(t).close(), this._delete(t);
    }
    _delete(t) {
      this.loggers.delete(t);
    }
  };
});
var FC = y((we) => {
  "use strict";
  var TC = qm(),
    { warn: Ms } = Pm();
  we.version = oS().version;
  we.transports = rC();
  we.config = ah();
  we.addColors = TC.levels;
  we.format = TC.format;
  we.createLogger = Gg();
  we.ExceptionHandler = Ug();
  we.RejectionHandler = $g();
  we.Container = OC();
  we.Transport = Dn();
  we.loggers = new we.Container();
  var Ur = we.createLogger();
  Object.keys(we.config.npm.levels)
    .concat([
      "log",
      "query",
      "stream",
      "add",
      "remove",
      "clear",
      "profile",
      "startTimer",
      "handleExceptions",
      "unhandleExceptions",
      "handleRejections",
      "unhandleRejections",
      "configure",
      "child",
    ])
    .forEach((e) => (we[e] = (...t) => Ur[e](...t)));
  Object.defineProperty(we, "level", {
    get() {
      return Ur.level;
    },
    set(e) {
      Ur.level = e;
    },
  });
  Object.defineProperty(we, "exceptions", {
    get() {
      return Ur.exceptions;
    },
  });
  ["exitOnError"].forEach((e) => {
    Object.defineProperty(we, e, {
      get() {
        return Ur[e];
      },
      set(t) {
        Ur[e] = t;
      },
    });
  });
  Object.defineProperty(we, "default", {
    get() {
      return {
        exceptionHandlers: Ur.exceptionHandlers,
        rejectionHandlers: Ur.rejectionHandlers,
        transports: Ur.transports,
      };
    },
  });
  Ms.deprecated(we, "setLevels");
  Ms.forFunctions(we, "useFormat", ["cli"]);
  Ms.forProperties(we, "useFormat", ["padLevels", "stripColors"]);
  Ms.forFunctions(we, "deprecated", [
    "addRewriter",
    "addFilter",
    "clone",
    "extend",
  ]);
  Ms.forProperties(we, "deprecated", ["emitErrs", "levelLength"]);
  Ms.moved(we, "createLogger", "Logger");
});
var qC = y((UJ, LC) => {
  var H7 =
    typeof process == "object" && process && process.platform === "win32";
  LC.exports = H7 ? { sep: "\\" } : { sep: "/" };
});
var Hg = y((zJ, jC) => {
  "use strict";
  jC.exports = BC;
  function BC(e, t, r) {
    e instanceof RegExp && (e = PC(e, r)),
      t instanceof RegExp && (t = PC(t, r));
    var i = kC(e, t, r);
    return (
      i && {
        start: i[0],
        end: i[1],
        pre: r.slice(0, i[0]),
        body: r.slice(i[0] + e.length, i[1]),
        post: r.slice(i[1] + t.length),
      }
    );
  }
  function PC(e, t) {
    var r = t.match(e);
    return r ? r[0] : null;
  }
  BC.range = kC;
  function kC(e, t, r) {
    var i,
      n,
      s,
      a,
      o,
      u = r.indexOf(e),
      l = r.indexOf(t, u + 1),
      f = u;
    if (u >= 0 && l > 0) {
      if (e === t) return [u, l];
      for (i = [], s = r.length; f >= 0 && !o; )
        f == u
          ? (i.push(f), (u = r.indexOf(e, f + 1)))
          : i.length == 1
          ? (o = [i.pop(), l])
          : ((n = i.pop()),
            n < s && ((s = n), (a = l)),
            (l = r.indexOf(t, f + 1))),
          (f = u < l && u >= 0 ? u : l);
      i.length && (o = [s, a]);
    }
    return o;
  }
});
var VC = y(($J, YC) => {
  var UC = Hg();
  YC.exports = X7;
  var zC = "\0SLASH" + Math.random() + "\0",
    $C = "\0OPEN" + Math.random() + "\0",
    Vg = "\0CLOSE" + Math.random() + "\0",
    WC = "\0COMMA" + Math.random() + "\0",
    GC = "\0PERIOD" + Math.random() + "\0";
  function Yg(e) {
    return parseInt(e, 10) == e ? parseInt(e, 10) : e.charCodeAt(0);
  }
  function Y7(e) {
    return e
      .split("\\\\")
      .join(zC)
      .split("\\{")
      .join($C)
      .split("\\}")
      .join(Vg)
      .split("\\,")
      .join(WC)
      .split("\\.")
      .join(GC);
  }
  function V7(e) {
    return e
      .split(zC)
      .join("\\")
      .split($C)
      .join("{")
      .split(Vg)
      .join("}")
      .split(WC)
      .join(",")
      .split(GC)
      .join(".");
  }
  function HC(e) {
    if (!e) return [""];
    var t = [],
      r = UC("{", "}", e);
    if (!r) return e.split(",");
    var i = r.pre,
      n = r.body,
      s = r.post,
      a = i.split(",");
    a[a.length - 1] += "{" + n + "}";
    var o = HC(s);
    return (
      s.length && ((a[a.length - 1] += o.shift()), a.push.apply(a, o)),
      t.push.apply(t, a),
      t
    );
  }
  function X7(e) {
    return e
      ? (e.substr(0, 2) === "{}" && (e = "\\{\\}" + e.substr(2)),
        Co(Y7(e), !0).map(V7))
      : [];
  }
  function Z7(e) {
    return "{" + e + "}";
  }
  function K7(e) {
    return /^-?0\d/.test(e);
  }
  function Q7(e, t) {
    return e <= t;
  }
  function J7(e, t) {
    return e >= t;
  }
  function Co(e, t) {
    var r = [],
      i = UC("{", "}", e);
    if (!i) return [e];
    var n = i.pre,
      s = i.post.length ? Co(i.post, !1) : [""];
    if (/\$$/.test(i.pre))
      for (var a = 0; a < s.length; a++) {
        var o = n + "{" + i.body + "}" + s[a];
        r.push(o);
      }
    else {
      var u = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(i.body),
        l = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(i.body),
        f = u || l,
        h = i.body.indexOf(",") >= 0;
      if (!f && !h)
        return i.post.match(/,.*\}/)
          ? ((e = i.pre + "{" + i.body + Vg + i.post), Co(e))
          : [e];
      var c;
      if (f) c = i.body.split(/\.\./);
      else if (
        ((c = HC(i.body)),
        c.length === 1 && ((c = Co(c[0], !1).map(Z7)), c.length === 1))
      )
        return s.map(function (T) {
          return i.pre + c[0] + T;
        });
      var d;
      if (f) {
        var g = Yg(c[0]),
          C = Yg(c[1]),
          S = Math.max(c[0].length, c[1].length),
          O = c.length == 3 ? Math.abs(Yg(c[2])) : 1,
          L = Q7,
          D = C < g;
        D && ((O *= -1), (L = J7));
        var w = c.some(K7);
        d = [];
        for (var F = g; L(F, C); F += O) {
          var m;
          if (l) (m = String.fromCharCode(F)), m === "\\" && (m = "");
          else if (((m = String(F)), w)) {
            var x = S - m.length;
            if (x > 0) {
              var A = new Array(x + 1).join("0");
              F < 0 ? (m = "-" + A + m.slice(1)) : (m = A + m);
            }
          }
          d.push(m);
        }
      } else {
        d = [];
        for (var p = 0; p < c.length; p++) d.push.apply(d, Co(c[p], !1));
      }
      for (var p = 0; p < d.length; p++)
        for (var a = 0; a < s.length; a++) {
          var o = n + d[p] + s[a];
          (!t || f || o) && r.push(o);
        }
    }
    return r;
  }
});
var eO = y((GJ, Qg) => {
  var Nt = (Qg.exports = (e, t, r = {}) => (
    ph(t), !r.nocomment && t.charAt(0) === "#" ? !1 : new qs(t, r).match(e)
  ));
  Qg.exports = Nt;
  var Zg = qC();
  Nt.sep = Zg.sep;
  var ir = Symbol("globstar **");
  Nt.GLOBSTAR = ir;
  var e9 = VC(),
    XC = {
      "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
      "?": { open: "(?:", close: ")?" },
      "+": { open: "(?:", close: ")+" },
      "*": { open: "(?:", close: ")*" },
      "@": { open: "(?:", close: ")" },
    },
    Kg = "[^/]",
    Xg = Kg + "*?",
    t9 = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?",
    r9 = "(?:(?!(?:\\/|^)\\.).)*?",
    QC = (e) => e.split("").reduce((t, r) => ((t[r] = !0), t), {}),
    ZC = QC("().*{}+?[]^$\\!"),
    i9 = QC("[.("),
    KC = /\/+/;
  Nt.filter =
    (e, t = {}) =>
    (r, i, n) =>
      Nt(r, e, t);
  var Ti = (e, t = {}) => {
    let r = {};
    return (
      Object.keys(e).forEach((i) => (r[i] = e[i])),
      Object.keys(t).forEach((i) => (r[i] = t[i])),
      r
    );
  };
  Nt.defaults = (e) => {
    if (!e || typeof e != "object" || !Object.keys(e).length) return Nt;
    let t = Nt,
      r = (i, n, s) => t(i, n, Ti(e, s));
    return (
      (r.Minimatch = class extends t.Minimatch {
        constructor(n, s) {
          super(n, Ti(e, s));
        }
      }),
      (r.Minimatch.defaults = (i) => t.defaults(Ti(e, i)).Minimatch),
      (r.filter = (i, n) => t.filter(i, Ti(e, n))),
      (r.defaults = (i) => t.defaults(Ti(e, i))),
      (r.makeRe = (i, n) => t.makeRe(i, Ti(e, n))),
      (r.braceExpand = (i, n) => t.braceExpand(i, Ti(e, n))),
      (r.match = (i, n, s) => t.match(i, n, Ti(e, s))),
      r
    );
  };
  Nt.braceExpand = (e, t) => JC(e, t);
  var JC = (e, t = {}) => (
      ph(e), t.nobrace || !/\{(?:(?!\{).)*\}/.test(e) ? [e] : e9(e)
    ),
    n9 = 1024 * 64,
    ph = (e) => {
      if (typeof e != "string") throw new TypeError("invalid pattern");
      if (e.length > n9) throw new TypeError("pattern is too long");
    },
    dh = Symbol("subparse");
  Nt.makeRe = (e, t) => new qs(e, t || {}).makeRe();
  Nt.match = (e, t, r = {}) => {
    let i = new qs(t, r);
    return (
      (e = e.filter((n) => i.match(n))),
      i.options.nonull && !e.length && e.push(t),
      e
    );
  };
  var s9 = (e) => e.replace(/\\(.)/g, "$1"),
    a9 = (e) => e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
    qs = class {
      constructor(t, r) {
        ph(t),
          r || (r = {}),
          (this.options = r),
          (this.set = []),
          (this.pattern = t),
          (this.windowsPathsNoEscape =
            !!r.windowsPathsNoEscape || r.allowWindowsEscape === !1),
          this.windowsPathsNoEscape &&
            (this.pattern = this.pattern.replace(/\\/g, "/")),
          (this.regexp = null),
          (this.negate = !1),
          (this.comment = !1),
          (this.empty = !1),
          (this.partial = !!r.partial),
          this.make();
      }
      debug() {}
      make() {
        let t = this.pattern,
          r = this.options;
        if (!r.nocomment && t.charAt(0) === "#") {
          this.comment = !0;
          return;
        }
        if (!t) {
          this.empty = !0;
          return;
        }
        this.parseNegate();
        let i = (this.globSet = this.braceExpand());
        r.debug && (this.debug = (...n) => console.error(...n)),
          this.debug(this.pattern, i),
          (i = this.globParts = i.map((n) => n.split(KC))),
          this.debug(this.pattern, i),
          (i = i.map((n, s, a) => n.map(this.parse, this))),
          this.debug(this.pattern, i),
          (i = i.filter((n) => n.indexOf(!1) === -1)),
          this.debug(this.pattern, i),
          (this.set = i);
      }
      parseNegate() {
        if (this.options.nonegate) return;
        let t = this.pattern,
          r = !1,
          i = 0;
        for (let n = 0; n < t.length && t.charAt(n) === "!"; n++) (r = !r), i++;
        i && (this.pattern = t.substr(i)), (this.negate = r);
      }
      matchOne(t, r, i) {
        var n = this.options;
        this.debug("matchOne", { this: this, file: t, pattern: r }),
          this.debug("matchOne", t.length, r.length);
        for (
          var s = 0, a = 0, o = t.length, u = r.length;
          s < o && a < u;
          s++, a++
        ) {
          this.debug("matchOne loop");
          var l = r[a],
            f = t[s];
          if ((this.debug(r, l, f), l === !1)) return !1;
          if (l === ir) {
            this.debug("GLOBSTAR", [r, l, f]);
            var h = s,
              c = a + 1;
            if (c === u) {
              for (this.debug("** at the end"); s < o; s++)
                if (
                  t[s] === "." ||
                  t[s] === ".." ||
                  (!n.dot && t[s].charAt(0) === ".")
                )
                  return !1;
              return !0;
            }
            for (; h < o; ) {
              var d = t[h];
              if (
                (this.debug(
                  `
globstar while`,
                  t,
                  h,
                  r,
                  c,
                  d,
                ),
                this.matchOne(t.slice(h), r.slice(c), i))
              )
                return this.debug("globstar found match!", h, o, d), !0;
              if (d === "." || d === ".." || (!n.dot && d.charAt(0) === ".")) {
                this.debug("dot detected!", t, h, r, c);
                break;
              }
              this.debug("globstar swallow a segment, and continue"), h++;
            }
            return !!(
              i &&
              (this.debug(
                `
>>> no match, partial?`,
                t,
                h,
                r,
                c,
              ),
              h === o)
            );
          }
          var g;
          if (
            (typeof l == "string"
              ? ((g = f === l), this.debug("string match", l, f, g))
              : ((g = f.match(l)), this.debug("pattern match", l, f, g)),
            !g)
          )
            return !1;
        }
        if (s === o && a === u) return !0;
        if (s === o) return i;
        if (a === u) return s === o - 1 && t[s] === "";
        throw new Error("wtf?");
      }
      braceExpand() {
        return JC(this.pattern, this.options);
      }
      parse(t, r) {
        ph(t);
        let i = this.options;
        if (t === "**")
          if (i.noglobstar) t = "*";
          else return ir;
        if (t === "") return "";
        let n = "",
          s = !!i.nocase,
          a = !1,
          o = [],
          u = [],
          l,
          f = !1,
          h = -1,
          c = -1,
          d,
          g,
          C,
          S =
            t.charAt(0) === "."
              ? ""
              : i.dot
              ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))"
              : "(?!\\.)",
          O = () => {
            if (l) {
              switch (l) {
                case "*":
                  (n += Xg), (s = !0);
                  break;
                case "?":
                  (n += Kg), (s = !0);
                  break;
                default:
                  n += "\\" + l;
                  break;
              }
              this.debug("clearStateChar %j %j", l, n), (l = !1);
            }
          };
        for (let w = 0, F; w < t.length && (F = t.charAt(w)); w++) {
          if ((this.debug("%s	%s %s %j", t, w, n, F), a)) {
            if (F === "/") return !1;
            ZC[F] && (n += "\\"), (n += F), (a = !1);
            continue;
          }
          switch (F) {
            case "/":
              return !1;
            case "\\":
              O(), (a = !0);
              continue;
            case "?":
            case "*":
            case "+":
            case "@":
            case "!":
              if ((this.debug("%s	%s %s %j <-- stateChar", t, w, n, F), f)) {
                this.debug("  in class"),
                  F === "!" && w === c + 1 && (F = "^"),
                  (n += F);
                continue;
              }
              this.debug("call clearStateChar %j", l),
                O(),
                (l = F),
                i.noext && O();
              continue;
            case "(":
              if (f) {
                n += "(";
                continue;
              }
              if (!l) {
                n += "\\(";
                continue;
              }
              o.push({
                type: l,
                start: w - 1,
                reStart: n.length,
                open: XC[l].open,
                close: XC[l].close,
              }),
                (n += l === "!" ? "(?:(?!(?:" : "(?:"),
                this.debug("plType %j %j", l, n),
                (l = !1);
              continue;
            case ")":
              if (f || !o.length) {
                n += "\\)";
                continue;
              }
              O(),
                (s = !0),
                (g = o.pop()),
                (n += g.close),
                g.type === "!" && u.push(g),
                (g.reEnd = n.length);
              continue;
            case "|":
              if (f || !o.length) {
                n += "\\|";
                continue;
              }
              O(), (n += "|");
              continue;
            case "[":
              if ((O(), f)) {
                n += "\\" + F;
                continue;
              }
              (f = !0), (c = w), (h = n.length), (n += F);
              continue;
            case "]":
              if (w === c + 1 || !f) {
                n += "\\" + F;
                continue;
              }
              d = t.substring(c + 1, w);
              try {
                RegExp("[" + d + "]");
              } catch {
                (C = this.parse(d, dh)),
                  (n = n.substr(0, h) + "\\[" + C[0] + "\\]"),
                  (s = s || C[1]),
                  (f = !1);
                continue;
              }
              (s = !0), (f = !1), (n += F);
              continue;
            default:
              O(), ZC[F] && !(F === "^" && f) && (n += "\\"), (n += F);
              break;
          }
        }
        for (
          f &&
            ((d = t.substr(c + 1)),
            (C = this.parse(d, dh)),
            (n = n.substr(0, h) + "\\[" + C[0]),
            (s = s || C[1])),
            g = o.pop();
          g;
          g = o.pop()
        ) {
          let w;
          (w = n.slice(g.reStart + g.open.length)),
            this.debug("setting tail", n, g),
            (w = w.replace(
              /((?:\\{2}){0,64})(\\?)\|/g,
              (m, x, A) => (A || (A = "\\"), x + x + A + "|"),
            )),
            this.debug(
              `tail=%j
   %s`,
              w,
              w,
              g,
              n,
            );
          let F = g.type === "*" ? Xg : g.type === "?" ? Kg : "\\" + g.type;
          (s = !0), (n = n.slice(0, g.reStart) + F + "\\(" + w);
        }
        O(), a && (n += "\\\\");
        let L = i9[n.charAt(0)];
        for (let w = u.length - 1; w > -1; w--) {
          let F = u[w],
            m = n.slice(0, F.reStart),
            x = n.slice(F.reStart, F.reEnd - 8),
            A = n.slice(F.reEnd),
            p = n.slice(F.reEnd - 8, F.reEnd) + A,
            T = m.split("(").length - 1,
            R = A;
          for (let z = 0; z < T; z++) R = R.replace(/\)[+*?]?/, "");
          A = R;
          let k = A === "" && r !== dh ? "$" : "";
          n = m + x + A + k + p;
        }
        if ((n !== "" && s && (n = "(?=.)" + n), L && (n = S + n), r === dh))
          return [n, s];
        if (!s) return s9(t);
        let D = i.nocase ? "i" : "";
        try {
          return Object.assign(new RegExp("^" + n + "$", D), {
            _glob: t,
            _src: n,
          });
        } catch {
          return new RegExp("$.");
        }
      }
      makeRe() {
        if (this.regexp || this.regexp === !1) return this.regexp;
        let t = this.set;
        if (!t.length) return (this.regexp = !1), this.regexp;
        let r = this.options,
          i = r.noglobstar ? Xg : r.dot ? t9 : r9,
          n = r.nocase ? "i" : "",
          s = t
            .map(
              (a) => (
                (a = a
                  .map((o) =>
                    typeof o == "string" ? a9(o) : o === ir ? ir : o._src,
                  )
                  .reduce(
                    (o, u) => (
                      (o[o.length - 1] === ir && u === ir) || o.push(u), o
                    ),
                    [],
                  )),
                a.forEach((o, u) => {
                  o !== ir ||
                    a[u - 1] === ir ||
                    (u === 0
                      ? a.length > 1
                        ? (a[u + 1] = "(?:\\/|" + i + "\\/)?" + a[u + 1])
                        : (a[u] = i)
                      : u === a.length - 1
                      ? (a[u - 1] += "(?:\\/|" + i + ")?")
                      : ((a[u - 1] += "(?:\\/|\\/" + i + "\\/)" + a[u + 1]),
                        (a[u + 1] = ir)));
                }),
                a.filter((o) => o !== ir).join("/")
              ),
            )
            .join("|");
        (s = "^(?:" + s + ")$"), this.negate && (s = "^(?!" + s + ").*$");
        try {
          this.regexp = new RegExp(s, n);
        } catch {
          this.regexp = !1;
        }
        return this.regexp;
      }
      match(t, r = this.partial) {
        if ((this.debug("match", t, this.pattern), this.comment)) return !1;
        if (this.empty) return t === "";
        if (t === "/" && r) return !0;
        let i = this.options;
        Zg.sep !== "/" && (t = t.split(Zg.sep).join("/")),
          (t = t.split(KC)),
          this.debug(this.pattern, "split", t);
        let n = this.set;
        this.debug(this.pattern, "set", n);
        let s;
        for (let a = t.length - 1; a >= 0 && ((s = t[a]), !s); a--);
        for (let a = 0; a < n.length; a++) {
          let o = n[a],
            u = t;
          if (
            (i.matchBase && o.length === 1 && (u = [s]), this.matchOne(u, o, r))
          )
            return i.flipNegate ? !0 : !this.negate;
        }
        return i.flipNegate ? !1 : this.negate;
      }
      static defaults(t) {
        return Nt.defaults(t).Minimatch;
      }
    };
  Nt.Minimatch = qs;
});
var sO = y((HJ, nO) => {
  nO.exports = iO;
  var e0 = require("fs"),
    { EventEmitter: o9 } = require("events"),
    { Minimatch: Jg } = eO(),
    { resolve: u9 } = require("path");
  function l9(e, t) {
    return new Promise((r, i) => {
      e0.readdir(e, { withFileTypes: !0 }, (n, s) => {
        if (n)
          switch (n.code) {
            case "ENOTDIR":
              t ? i(n) : r([]);
              break;
            case "ENOTSUP":
            case "ENOENT":
            case "ENAMETOOLONG":
            case "UNKNOWN":
              r([]);
              break;
            case "ELOOP":
            default:
              i(n);
              break;
          }
        else r(s);
      });
    });
  }
  function tO(e, t) {
    return new Promise((r, i) => {
      (t ? e0.stat : e0.lstat)(e, (s, a) => {
        if (s)
          switch (s.code) {
            case "ENOENT":
              r(t ? tO(e, !1) : null);
              break;
            default:
              r(null);
              break;
          }
        else r(a);
      });
    });
  }
  async function* rO(e, t, r, i, n, s) {
    let a = await l9(t + e, s);
    for (let o of a) {
      let u = o.name;
      u === void 0 && ((u = o), (i = !0));
      let l = e + "/" + u,
        f = l.slice(1),
        h = t + "/" + f,
        c = null;
      (i || r) && (c = await tO(h, r)),
        !c && o.name !== void 0 && (c = o),
        c === null && (c = { isDirectory: () => !1 }),
        c.isDirectory()
          ? n(f) ||
            (yield { relative: f, absolute: h, stats: c },
            yield* rO(l, t, r, i, n, !1))
          : yield { relative: f, absolute: h, stats: c };
    }
  }
  async function* f9(e, t, r, i) {
    yield* rO("", e, t, r, i, !0);
  }
  function h9(e) {
    return {
      pattern: e.pattern,
      dot: !!e.dot,
      noglobstar: !!e.noglobstar,
      matchBase: !!e.matchBase,
      nocase: !!e.nocase,
      ignore: e.ignore,
      skip: e.skip,
      follow: !!e.follow,
      stat: !!e.stat,
      nodir: !!e.nodir,
      mark: !!e.mark,
      silent: !!e.silent,
      absolute: !!e.absolute,
    };
  }
  var mh = class extends o9 {
    constructor(t, r, i) {
      if (
        (super(),
        typeof r == "function" && ((i = r), (r = null)),
        (this.options = h9(r || {})),
        (this.matchers = []),
        this.options.pattern)
      ) {
        let n = Array.isArray(this.options.pattern)
          ? this.options.pattern
          : [this.options.pattern];
        this.matchers = n.map(
          (s) =>
            new Jg(s, {
              dot: this.options.dot,
              noglobstar: this.options.noglobstar,
              matchBase: this.options.matchBase,
              nocase: this.options.nocase,
            }),
        );
      }
      if (((this.ignoreMatchers = []), this.options.ignore)) {
        let n = Array.isArray(this.options.ignore)
          ? this.options.ignore
          : [this.options.ignore];
        this.ignoreMatchers = n.map((s) => new Jg(s, { dot: !0 }));
      }
      if (((this.skipMatchers = []), this.options.skip)) {
        let n = Array.isArray(this.options.skip)
          ? this.options.skip
          : [this.options.skip];
        this.skipMatchers = n.map((s) => new Jg(s, { dot: !0 }));
      }
      (this.iterator = f9(
        u9(t || "."),
        this.options.follow,
        this.options.stat,
        this._shouldSkipDirectory.bind(this),
      )),
        (this.paused = !1),
        (this.inactive = !1),
        (this.aborted = !1),
        i &&
          ((this._matches = []),
          this.on("match", (n) =>
            this._matches.push(this.options.absolute ? n.absolute : n.relative),
          ),
          this.on("error", (n) => i(n)),
          this.on("end", () => i(null, this._matches))),
        setTimeout(() => this._next(), 0);
    }
    _shouldSkipDirectory(t) {
      return this.skipMatchers.some((r) => r.match(t));
    }
    _fileMatches(t, r) {
      let i = t + (r ? "/" : "");
      return (
        (this.matchers.length === 0 || this.matchers.some((n) => n.match(i))) &&
        !this.ignoreMatchers.some((n) => n.match(i)) &&
        (!this.options.nodir || !r)
      );
    }
    _next() {
      !this.paused && !this.aborted
        ? this.iterator
            .next()
            .then((t) => {
              if (t.done) this.emit("end");
              else {
                let r = t.value.stats.isDirectory();
                if (this._fileMatches(t.value.relative, r)) {
                  let i = t.value.relative,
                    n = t.value.absolute;
                  this.options.mark && r && ((i += "/"), (n += "/")),
                    this.options.stat
                      ? this.emit("match", {
                          relative: i,
                          absolute: n,
                          stat: t.value.stats,
                        })
                      : this.emit("match", { relative: i, absolute: n });
                }
                this._next(this.iterator);
              }
            })
            .catch((t) => {
              this.abort(),
                this.emit("error", t),
                !t.code && !this.options.silent && console.error(t);
            })
        : (this.inactive = !0);
    }
    abort() {
      this.aborted = !0;
    }
    pause() {
      this.paused = !0;
    }
    resume() {
      (this.paused = !1), this.inactive && ((this.inactive = !1), this._next());
    }
  };
  function iO(e, t, r) {
    return new mh(e, t, r);
  }
  iO.ReaddirGlob = mh;
});
var oO = y((gh, aO) => {
  (function (e, t) {
    typeof gh == "object" && typeof aO < "u"
      ? t(gh)
      : typeof define == "function" && define.amd
      ? define(["exports"], t)
      : t((e.async = {}));
  })(gh, function (e) {
    "use strict";
    function t(b, ...v) {
      return (...E) => b(...v, ...E);
    }
    function r(b) {
      return function (...v) {
        var E = v.pop();
        return b.call(this, v, E);
      };
    }
    var i = typeof queueMicrotask == "function" && queueMicrotask,
      n = typeof setImmediate == "function" && setImmediate,
      s = typeof process == "object" && typeof process.nextTick == "function";
    function a(b) {
      setTimeout(b, 0);
    }
    function o(b) {
      return (v, ...E) => b(() => v(...E));
    }
    var u;
    i
      ? (u = queueMicrotask)
      : n
      ? (u = setImmediate)
      : s
      ? (u = process.nextTick)
      : (u = a);
    var l = o(u);
    function f(b) {
      return d(b)
        ? function (...v) {
            let E = v.pop(),
              N = b.apply(this, v);
            return h(N, E);
          }
        : r(function (v, E) {
            var N;
            try {
              N = b.apply(this, v);
            } catch (M) {
              return E(M);
            }
            if (N && typeof N.then == "function") return h(N, E);
            E(null, N);
          });
    }
    function h(b, v) {
      return b.then(
        (E) => {
          c(v, null, E);
        },
        (E) => {
          c(v, E && E.message ? E : new Error(E));
        },
      );
    }
    function c(b, v, E) {
      try {
        b(v, E);
      } catch (N) {
        l((M) => {
          throw M;
        }, N);
      }
    }
    function d(b) {
      return b[Symbol.toStringTag] === "AsyncFunction";
    }
    function g(b) {
      return b[Symbol.toStringTag] === "AsyncGenerator";
    }
    function C(b) {
      return typeof b[Symbol.asyncIterator] == "function";
    }
    function S(b) {
      if (typeof b != "function") throw new Error("expected a function");
      return d(b) ? f(b) : b;
    }
    function O(b, v = b.length) {
      if (!v) throw new Error("arity is undefined");
      function E(...N) {
        return typeof N[v - 1] == "function"
          ? b.apply(this, N)
          : new Promise((M, q) => {
              (N[v - 1] = (B, ...j) => {
                if (B) return q(B);
                M(j.length > 1 ? j : j[0]);
              }),
                b.apply(this, N);
            });
      }
      return E;
    }
    function L(b) {
      return function (E, ...N) {
        return O(function (q) {
          var B = this;
          return b(
            E,
            (j, U) => {
              S(j).apply(B, N.concat(U));
            },
            q,
          );
        });
      };
    }
    function D(b, v, E, N) {
      v = v || [];
      var M = [],
        q = 0,
        B = S(E);
      return b(
        v,
        (j, U, V) => {
          var ne = q++;
          B(j, (ue, se) => {
            (M[ne] = se), V(ue);
          });
        },
        (j) => {
          N(j, M);
        },
      );
    }
    function w(b) {
      return (
        b && typeof b.length == "number" && b.length >= 0 && b.length % 1 === 0
      );
    }
    let F = {};
    function m(b) {
      function v(...E) {
        if (b !== null) {
          var N = b;
          (b = null), N.apply(this, E);
        }
      }
      return Object.assign(v, b), v;
    }
    function x(b) {
      return b[Symbol.iterator] && b[Symbol.iterator]();
    }
    function A(b) {
      var v = -1,
        E = b.length;
      return function () {
        return ++v < E ? { value: b[v], key: v } : null;
      };
    }
    function p(b) {
      var v = -1;
      return function () {
        var N = b.next();
        return N.done ? null : (v++, { value: N.value, key: v });
      };
    }
    function T(b) {
      var v = b ? Object.keys(b) : [],
        E = -1,
        N = v.length;
      return function M() {
        var q = v[++E];
        return q === "__proto__" ? M() : E < N ? { value: b[q], key: q } : null;
      };
    }
    function R(b) {
      if (w(b)) return A(b);
      var v = x(b);
      return v ? p(v) : T(b);
    }
    function k(b) {
      return function (...v) {
        if (b === null) throw new Error("Callback was already called.");
        var E = b;
        (b = null), E.apply(this, v);
      };
    }
    function z(b, v, E, N) {
      let M = !1,
        q = !1,
        B = !1,
        j = 0,
        U = 0;
      function V() {
        j >= v ||
          B ||
          M ||
          ((B = !0),
          b
            .next()
            .then(({ value: se, done: Bt }) => {
              if (!(q || M)) {
                if (((B = !1), Bt)) {
                  (M = !0), j <= 0 && N(null);
                  return;
                }
                j++, E(se, U, ne), U++, V();
              }
            })
            .catch(ue));
      }
      function ne(se, Bt) {
        if (((j -= 1), !q)) {
          if (se) return ue(se);
          if (se === !1) {
            (M = !0), (q = !0);
            return;
          }
          if (Bt === F || (M && j <= 0)) return (M = !0), N(null);
          V();
        }
      }
      function ue(se) {
        q || ((B = !1), (M = !0), N(se));
      }
      V();
    }
    var $ = (b) => (v, E, N) => {
      if (((N = m(N)), b <= 0))
        throw new RangeError("concurrency limit cannot be less than 1");
      if (!v) return N(null);
      if (g(v)) return z(v, b, E, N);
      if (C(v)) return z(v[Symbol.asyncIterator](), b, E, N);
      var M = R(v),
        q = !1,
        B = !1,
        j = 0,
        U = !1;
      function V(ue, se) {
        if (!B)
          if (((j -= 1), ue)) (q = !0), N(ue);
          else if (ue === !1) (q = !0), (B = !0);
          else {
            if (se === F || (q && j <= 0)) return (q = !0), N(null);
            U || ne();
          }
      }
      function ne() {
        for (U = !0; j < b && !q; ) {
          var ue = M();
          if (ue === null) {
            (q = !0), j <= 0 && N(null);
            return;
          }
          (j += 1), E(ue.value, ue.key, k(V));
        }
        U = !1;
      }
      ne();
    };
    function X(b, v, E, N) {
      return $(v)(b, S(E), N);
    }
    var I = O(X, 4);
    function P(b, v, E) {
      E = m(E);
      var N = 0,
        M = 0,
        { length: q } = b,
        B = !1;
      q === 0 && E(null);
      function j(U, V) {
        U === !1 && (B = !0),
          B !== !0 && (U ? E(U) : (++M === q || V === F) && E(null));
      }
      for (; N < q; N++) v(b[N], N, k(j));
    }
    function G(b, v, E) {
      return I(b, 1 / 0, v, E);
    }
    function J(b, v, E) {
      var N = w(b) ? P : G;
      return N(b, S(v), E);
    }
    var W = O(J, 3);
    function Ne(b, v, E) {
      return D(W, b, v, E);
    }
    var Ie = O(Ne, 3),
      Pt = L(Ie);
    function _t(b, v, E) {
      return I(b, 1, v, E);
    }
    var Be = O(_t, 3);
    function Un(b, v, E) {
      return D(Be, b, v, E);
    }
    var ba = O(Un, 3),
      mt = L(ba);
    let xr = Symbol("promiseCallback");
    function ei() {
      let b, v;
      function E(N, ...M) {
        if (N) return v(N);
        b(M.length > 1 ? M : M[0]);
      }
      return (
        (E[xr] = new Promise((N, M) => {
          (b = N), (v = M);
        })),
        E
      );
    }
    function zn(b, v, E) {
      typeof v != "number" && ((E = v), (v = null)), (E = m(E || ei()));
      var N = Object.keys(b).length;
      if (!N) return E(null);
      v || (v = N);
      var M = {},
        q = 0,
        B = !1,
        j = !1,
        U = Object.create(null),
        V = [],
        ne = [],
        ue = {};
      Object.keys(b).forEach((H) => {
        var Q = b[H];
        if (!Array.isArray(Q)) {
          se(H, [Q]), ne.push(H);
          return;
        }
        var ae = Q.slice(0, Q.length - 1),
          xe = ae.length;
        if (xe === 0) {
          se(H, Q), ne.push(H);
          return;
        }
        (ue[H] = xe),
          ae.forEach(($e) => {
            if (!b[$e])
              throw new Error(
                "async.auto task `" +
                  H +
                  "` has a non-existent dependency `" +
                  $e +
                  "` in " +
                  ae.join(", "),
              );
            Yn($e, () => {
              xe--, xe === 0 && se(H, Q);
            });
          });
      }),
        le(),
        Bt();
      function se(H, Q) {
        V.push(() => Ta(H, Q));
      }
      function Bt() {
        if (!B) {
          if (V.length === 0 && q === 0) return E(null, M);
          for (; V.length && q < v; ) {
            var H = V.shift();
            H();
          }
        }
      }
      function Yn(H, Q) {
        var ae = U[H];
        ae || (ae = U[H] = []), ae.push(Q);
      }
      function Vi(H) {
        var Q = U[H] || [];
        Q.forEach((ae) => ae()), Bt();
      }
      function Ta(H, Q) {
        if (!j) {
          var ae = k(($e, ...kt) => {
            if ((q--, $e === !1)) {
              B = !0;
              return;
            }
            if ((kt.length < 2 && ([kt] = kt), $e)) {
              var Vn = {};
              if (
                (Object.keys(M).forEach((Xi) => {
                  Vn[Xi] = M[Xi];
                }),
                (Vn[H] = kt),
                (j = !0),
                (U = Object.create(null)),
                B)
              )
                return;
              E($e, Vn);
            } else (M[H] = kt), Vi(H);
          });
          q++;
          var xe = S(Q[Q.length - 1]);
          Q.length > 1 ? xe(M, ae) : xe(ae);
        }
      }
      function le() {
        for (var H, Q = 0; ne.length; )
          (H = ne.pop()),
            Q++,
            K(H).forEach((ae) => {
              --ue[ae] === 0 && ne.push(ae);
            });
        if (Q !== N)
          throw new Error(
            "async.auto cannot execute tasks due to a recursive dependency",
          );
      }
      function K(H) {
        var Q = [];
        return (
          Object.keys(b).forEach((ae) => {
            let xe = b[ae];
            Array.isArray(xe) && xe.indexOf(H) >= 0 && Q.push(ae);
          }),
          Q
        );
      }
      return E[xr];
    }
    var yu = /^(?:async\s+)?(?:function)?\s*\w*\s*\(\s*([^)]+)\s*\)(?:\s*{)/,
      $n = /^(?:async\s+)?\(?\s*([^)=]+)\s*\)?(?:\s*=>)/,
      Wn = /,/,
      Wc = /(=.+)?(\s*)$/;
    function Yi(b) {
      let v = "",
        E = 0,
        N = b.indexOf("*/");
      for (; E < b.length; )
        if (b[E] === "/" && b[E + 1] === "/") {
          let M = b.indexOf(
            `
`,
            E,
          );
          E = M === -1 ? b.length : M;
        } else if (N !== -1 && b[E] === "/" && b[E + 1] === "*") {
          let M = b.indexOf("*/", E);
          M !== -1
            ? ((E = M + 2), (N = b.indexOf("*/", E)))
            : ((v += b[E]), E++);
        } else (v += b[E]), E++;
      return v;
    }
    function ti(b) {
      let v = Yi(b.toString()),
        E = v.match(yu);
      if ((E || (E = v.match($n)), !E))
        throw new Error(
          `could not parse args in autoInject
Source:
` + v,
        );
      let [, N] = E;
      return N.replace(/\s/g, "")
        .split(Wn)
        .map((M) => M.replace(Wc, "").trim());
    }
    function Gn(b, v) {
      var E = {};
      return (
        Object.keys(b).forEach((N) => {
          var M = b[N],
            q,
            B = d(M),
            j = (!B && M.length === 1) || (B && M.length === 0);
          if (Array.isArray(M))
            (q = [...M]),
              (M = q.pop()),
              (E[N] = q.concat(q.length > 0 ? U : M));
          else if (j) E[N] = M;
          else {
            if (((q = ti(M)), M.length === 0 && !B && q.length === 0))
              throw new Error(
                "autoInject task functions require explicit parameters.",
              );
            B || q.pop(), (E[N] = q.concat(U));
          }
          function U(V, ne) {
            var ue = q.map((se) => V[se]);
            ue.push(ne), S(M)(...ue);
          }
        }),
        zn(E, v)
      );
    }
    class Gc {
      constructor() {
        (this.head = this.tail = null), (this.length = 0);
      }
      removeLink(v) {
        return (
          v.prev ? (v.prev.next = v.next) : (this.head = v.next),
          v.next ? (v.next.prev = v.prev) : (this.tail = v.prev),
          (v.prev = v.next = null),
          (this.length -= 1),
          v
        );
      }
      empty() {
        for (; this.head; ) this.shift();
        return this;
      }
      insertAfter(v, E) {
        (E.prev = v),
          (E.next = v.next),
          v.next ? (v.next.prev = E) : (this.tail = E),
          (v.next = E),
          (this.length += 1);
      }
      insertBefore(v, E) {
        (E.prev = v.prev),
          (E.next = v),
          v.prev ? (v.prev.next = E) : (this.head = E),
          (v.prev = E),
          (this.length += 1);
      }
      unshift(v) {
        this.head ? this.insertBefore(this.head, v) : Ea(this, v);
      }
      push(v) {
        this.tail ? this.insertAfter(this.tail, v) : Ea(this, v);
      }
      shift() {
        return this.head && this.removeLink(this.head);
      }
      pop() {
        return this.tail && this.removeLink(this.tail);
      }
      toArray() {
        return [...this];
      }
      *[Symbol.iterator]() {
        for (var v = this.head; v; ) yield v.data, (v = v.next);
      }
      remove(v) {
        for (var E = this.head; E; ) {
          var { next: N } = E;
          v(E) && this.removeLink(E), (E = N);
        }
        return this;
      }
    }
    function Ea(b, v) {
      (b.length = 1), (b.head = b.tail = v);
    }
    function Hc(b, v, E) {
      if (v == null) v = 1;
      else if (v === 0) throw new RangeError("Concurrency must not be zero");
      var N = S(b),
        M = 0,
        q = [];
      let B = {
        error: [],
        drain: [],
        saturated: [],
        unsaturated: [],
        empty: [],
      };
      function j(K, H) {
        B[K].push(H);
      }
      function U(K, H) {
        let Q = (...ae) => {
          V(K, Q), H(...ae);
        };
        B[K].push(Q);
      }
      function V(K, H) {
        if (!K) return Object.keys(B).forEach((Q) => (B[Q] = []));
        if (!H) return (B[K] = []);
        B[K] = B[K].filter((Q) => Q !== H);
      }
      function ne(K, ...H) {
        B[K].forEach((Q) => Q(...H));
      }
      var ue = !1;
      function se(K, H, Q, ae) {
        if (ae != null && typeof ae != "function")
          throw new Error("task callback must be a function");
        le.started = !0;
        var xe, $e;
        function kt(Xi, ...Fa) {
          if (Xi) return Q ? $e(Xi) : xe();
          if (Fa.length <= 1) return xe(Fa[0]);
          xe(Fa);
        }
        var Vn = le._createTaskItem(K, Q ? kt : ae || kt);
        if (
          (H ? le._tasks.unshift(Vn) : le._tasks.push(Vn),
          ue ||
            ((ue = !0),
            l(() => {
              (ue = !1), le.process();
            })),
          Q || !ae)
        )
          return new Promise((Xi, Fa) => {
            (xe = Xi), ($e = Fa);
          });
      }
      function Bt(K) {
        return function (H, ...Q) {
          M -= 1;
          for (var ae = 0, xe = K.length; ae < xe; ae++) {
            var $e = K[ae],
              kt = q.indexOf($e);
            kt === 0 ? q.shift() : kt > 0 && q.splice(kt, 1),
              $e.callback(H, ...Q),
              H != null && ne("error", H, $e.data);
          }
          M <= le.concurrency - le.buffer && ne("unsaturated"),
            le.idle() && ne("drain"),
            le.process();
        };
      }
      function Yn(K) {
        return K.length === 0 && le.idle() ? (l(() => ne("drain")), !0) : !1;
      }
      let Vi = (K) => (H) => {
        if (!H)
          return new Promise((Q, ae) => {
            U(K, (xe, $e) => {
              if (xe) return ae(xe);
              Q($e);
            });
          });
        V(K), j(K, H);
      };
      var Ta = !1,
        le = {
          _tasks: new Gc(),
          _createTaskItem(K, H) {
            return { data: K, callback: H };
          },
          *[Symbol.iterator]() {
            yield* le._tasks[Symbol.iterator]();
          },
          concurrency: v,
          payload: E,
          buffer: v / 4,
          started: !1,
          paused: !1,
          push(K, H) {
            return Array.isArray(K)
              ? Yn(K)
                ? void 0
                : K.map((Q) => se(Q, !1, !1, H))
              : se(K, !1, !1, H);
          },
          pushAsync(K, H) {
            return Array.isArray(K)
              ? Yn(K)
                ? void 0
                : K.map((Q) => se(Q, !1, !0, H))
              : se(K, !1, !0, H);
          },
          kill() {
            V(), le._tasks.empty();
          },
          unshift(K, H) {
            return Array.isArray(K)
              ? Yn(K)
                ? void 0
                : K.map((Q) => se(Q, !0, !1, H))
              : se(K, !0, !1, H);
          },
          unshiftAsync(K, H) {
            return Array.isArray(K)
              ? Yn(K)
                ? void 0
                : K.map((Q) => se(Q, !0, !0, H))
              : se(K, !0, !0, H);
          },
          remove(K) {
            le._tasks.remove(K);
          },
          process() {
            if (!Ta) {
              for (
                Ta = !0;
                !le.paused && M < le.concurrency && le._tasks.length;

              ) {
                var K = [],
                  H = [],
                  Q = le._tasks.length;
                le.payload && (Q = Math.min(Q, le.payload));
                for (var ae = 0; ae < Q; ae++) {
                  var xe = le._tasks.shift();
                  K.push(xe), q.push(xe), H.push(xe.data);
                }
                (M += 1),
                  le._tasks.length === 0 && ne("empty"),
                  M === le.concurrency && ne("saturated");
                var $e = k(Bt(K));
                N(H, $e);
              }
              Ta = !1;
            }
          },
          length() {
            return le._tasks.length;
          },
          running() {
            return M;
          },
          workersList() {
            return q;
          },
          idle() {
            return le._tasks.length + M === 0;
          },
          pause() {
            le.paused = !0;
          },
          resume() {
            le.paused !== !1 && ((le.paused = !1), l(le.process));
          },
        };
      return (
        Object.defineProperties(le, {
          saturated: { writable: !1, value: Vi("saturated") },
          unsaturated: { writable: !1, value: Vi("unsaturated") },
          empty: { writable: !1, value: Vi("empty") },
          drain: { writable: !1, value: Vi("drain") },
          error: { writable: !1, value: Vi("error") },
        }),
        le
      );
    }
    function Uv(b, v) {
      return Hc(b, 1, v);
    }
    function zv(b, v, E) {
      return Hc(b, v, E);
    }
    function jL(b, v, E, N) {
      N = m(N);
      var M = S(E);
      return Be(
        b,
        (q, B, j) => {
          M(v, q, (U, V) => {
            (v = V), j(U);
          });
        },
        (q) => N(q, v),
      );
    }
    var ri = O(jL, 4);
    function Yc(...b) {
      var v = b.map(S);
      return function (...E) {
        var N = this,
          M = E[E.length - 1];
        return (
          typeof M == "function" ? E.pop() : (M = ei()),
          ri(
            v,
            E,
            (q, B, j) => {
              B.apply(
                N,
                q.concat((U, ...V) => {
                  j(U, V);
                }),
              );
            },
            (q, B) => M(q, ...B),
          ),
          M[xr]
        );
      };
    }
    function $v(...b) {
      return Yc(...b.reverse());
    }
    function UL(b, v, E, N) {
      return D($(v), b, E, N);
    }
    var _a = O(UL, 4);
    function zL(b, v, E, N) {
      var M = S(E);
      return _a(
        b,
        v,
        (q, B) => {
          M(q, (j, ...U) => (j ? B(j) : B(j, U)));
        },
        (q, B) => {
          for (var j = [], U = 0; U < B.length; U++)
            B[U] && (j = j.concat(...B[U]));
          return N(q, j);
        },
      );
    }
    var Hn = O(zL, 4);
    function $L(b, v, E) {
      return Hn(b, 1 / 0, v, E);
    }
    var vu = O($L, 3);
    function WL(b, v, E) {
      return Hn(b, 1, v, E);
    }
    var wu = O(WL, 3);
    function Wv(...b) {
      return function (...v) {
        var E = v.pop();
        return E(null, ...b);
      };
    }
    function Cr(b, v) {
      return (E, N, M, q) => {
        var B = !1,
          j;
        let U = S(M);
        E(
          N,
          (V, ne, ue) => {
            U(V, (se, Bt) => {
              if (se || se === !1) return ue(se);
              if (b(Bt) && !j) return (B = !0), (j = v(!0, V)), ue(null, F);
              ue();
            });
          },
          (V) => {
            if (V) return q(V);
            q(null, B ? j : v(!1));
          },
        );
      };
    }
    function GL(b, v, E) {
      return Cr(
        (N) => N,
        (N, M) => M,
      )(W, b, v, E);
    }
    var Du = O(GL, 3);
    function HL(b, v, E, N) {
      return Cr(
        (M) => M,
        (M, q) => q,
      )($(v), b, E, N);
    }
    var bu = O(HL, 4);
    function YL(b, v, E) {
      return Cr(
        (N) => N,
        (N, M) => M,
      )($(1), b, v, E);
    }
    var Eu = O(YL, 3);
    function Gv(b) {
      return (v, ...E) =>
        S(v)(...E, (N, ...M) => {
          typeof console == "object" &&
            (N
              ? console.error && console.error(N)
              : console[b] && M.forEach((q) => console[b](q)));
        });
    }
    var Hv = Gv("dir");
    function VL(b, v, E) {
      E = k(E);
      var N = S(b),
        M = S(v),
        q;
      function B(U, ...V) {
        if (U) return E(U);
        U !== !1 && ((q = V), M(...V, j));
      }
      function j(U, V) {
        if (U) return E(U);
        if (U !== !1) {
          if (!V) return E(null, ...q);
          N(B);
        }
      }
      return j(null, !0);
    }
    var Sa = O(VL, 3);
    function Yv(b, v, E) {
      let N = S(v);
      return Sa(
        b,
        (...M) => {
          let q = M.pop();
          N(...M, (B, j) => q(B, !j));
        },
        E,
      );
    }
    function Vv(b) {
      return (v, E, N) => b(v, N);
    }
    function XL(b, v, E) {
      return W(b, Vv(S(v)), E);
    }
    var _u = O(XL, 3);
    function ZL(b, v, E, N) {
      return $(v)(b, Vv(S(E)), N);
    }
    var xa = O(ZL, 4);
    function KL(b, v, E) {
      return xa(b, 1, v, E);
    }
    var Ca = O(KL, 3);
    function Vc(b) {
      return d(b)
        ? b
        : function (...v) {
            var E = v.pop(),
              N = !0;
            v.push((...M) => {
              N ? l(() => E(...M)) : E(...M);
            }),
              b.apply(this, v),
              (N = !1);
          };
    }
    function QL(b, v, E) {
      return Cr(
        (N) => !N,
        (N) => !N,
      )(W, b, v, E);
    }
    var Su = O(QL, 3);
    function JL(b, v, E, N) {
      return Cr(
        (M) => !M,
        (M) => !M,
      )($(v), b, E, N);
    }
    var xu = O(JL, 4);
    function e3(b, v, E) {
      return Cr(
        (N) => !N,
        (N) => !N,
      )(Be, b, v, E);
    }
    var Cu = O(e3, 3);
    function t3(b, v, E, N) {
      var M = new Array(v.length);
      b(
        v,
        (q, B, j) => {
          E(q, (U, V) => {
            (M[B] = !!V), j(U);
          });
        },
        (q) => {
          if (q) return N(q);
          for (var B = [], j = 0; j < v.length; j++) M[j] && B.push(v[j]);
          N(null, B);
        },
      );
    }
    function r3(b, v, E, N) {
      var M = [];
      b(
        v,
        (q, B, j) => {
          E(q, (U, V) => {
            if (U) return j(U);
            V && M.push({ index: B, value: q }), j(U);
          });
        },
        (q) => {
          if (q) return N(q);
          N(
            null,
            M.sort((B, j) => B.index - j.index).map((B) => B.value),
          );
        },
      );
    }
    function Ou(b, v, E, N) {
      var M = w(v) ? t3 : r3;
      return M(b, v, S(E), N);
    }
    function i3(b, v, E) {
      return Ou(W, b, v, E);
    }
    var Tu = O(i3, 3);
    function n3(b, v, E, N) {
      return Ou($(v), b, E, N);
    }
    var Fu = O(n3, 4);
    function s3(b, v, E) {
      return Ou(Be, b, v, E);
    }
    var Ru = O(s3, 3);
    function a3(b, v) {
      var E = k(v),
        N = S(Vc(b));
      function M(q) {
        if (q) return E(q);
        q !== !1 && N(M);
      }
      return M();
    }
    var Xv = O(a3, 2);
    function o3(b, v, E, N) {
      var M = S(E);
      return _a(
        b,
        v,
        (q, B) => {
          M(q, (j, U) => (j ? B(j) : B(j, { key: U, val: q })));
        },
        (q, B) => {
          for (
            var j = {}, { hasOwnProperty: U } = Object.prototype, V = 0;
            V < B.length;
            V++
          )
            if (B[V]) {
              var { key: ne } = B[V],
                { val: ue } = B[V];
              U.call(j, ne) ? j[ne].push(ue) : (j[ne] = [ue]);
            }
          return N(q, j);
        },
      );
    }
    var Au = O(o3, 4);
    function Zv(b, v, E) {
      return Au(b, 1 / 0, v, E);
    }
    function Kv(b, v, E) {
      return Au(b, 1, v, E);
    }
    var Qv = Gv("log");
    function u3(b, v, E, N) {
      N = m(N);
      var M = {},
        q = S(E);
      return $(v)(
        b,
        (B, j, U) => {
          q(B, j, (V, ne) => {
            if (V) return U(V);
            (M[j] = ne), U(V);
          });
        },
        (B) => N(B, M),
      );
    }
    var Nu = O(u3, 4);
    function Jv(b, v, E) {
      return Nu(b, 1 / 0, v, E);
    }
    function ew(b, v, E) {
      return Nu(b, 1, v, E);
    }
    function tw(b, v = (E) => E) {
      var E = Object.create(null),
        N = Object.create(null),
        M = S(b),
        q = r((B, j) => {
          var U = v(...B);
          U in E
            ? l(() => j(null, ...E[U]))
            : U in N
            ? N[U].push(j)
            : ((N[U] = [j]),
              M(...B, (V, ...ne) => {
                V || (E[U] = ne);
                var ue = N[U];
                delete N[U];
                for (var se = 0, Bt = ue.length; se < Bt; se++)
                  ue[se](V, ...ne);
              }));
        });
      return (q.memo = E), (q.unmemoized = b), q;
    }
    var Iu;
    s ? (Iu = process.nextTick) : n ? (Iu = setImmediate) : (Iu = a);
    var rw = o(Iu),
      Xc = O((b, v, E) => {
        var N = w(v) ? [] : {};
        b(
          v,
          (M, q, B) => {
            S(M)((j, ...U) => {
              U.length < 2 && ([U] = U), (N[q] = U), B(j);
            });
          },
          (M) => E(M, N),
        );
      }, 3);
    function iw(b, v) {
      return Xc(W, b, v);
    }
    function nw(b, v, E) {
      return Xc($(v), b, E);
    }
    function Zc(b, v) {
      var E = S(b);
      return Hc(
        (N, M) => {
          E(N[0], M);
        },
        v,
        1,
      );
    }
    class l3 {
      constructor() {
        (this.heap = []), (this.pushCount = Number.MIN_SAFE_INTEGER);
      }
      get length() {
        return this.heap.length;
      }
      empty() {
        return (this.heap = []), this;
      }
      percUp(v) {
        let E;
        for (; v > 0 && Kc(this.heap[v], this.heap[(E = sw(v))]); ) {
          let N = this.heap[v];
          (this.heap[v] = this.heap[E]), (this.heap[E] = N), (v = E);
        }
      }
      percDown(v) {
        let E;
        for (
          ;
          (E = f3(v)) < this.heap.length &&
          (E + 1 < this.heap.length &&
            Kc(this.heap[E + 1], this.heap[E]) &&
            (E = E + 1),
          !Kc(this.heap[v], this.heap[E]));

        ) {
          let N = this.heap[v];
          (this.heap[v] = this.heap[E]), (this.heap[E] = N), (v = E);
        }
      }
      push(v) {
        (v.pushCount = ++this.pushCount),
          this.heap.push(v),
          this.percUp(this.heap.length - 1);
      }
      unshift(v) {
        return this.heap.push(v);
      }
      shift() {
        let [v] = this.heap;
        return (
          (this.heap[0] = this.heap[this.heap.length - 1]),
          this.heap.pop(),
          this.percDown(0),
          v
        );
      }
      toArray() {
        return [...this];
      }
      *[Symbol.iterator]() {
        for (let v = 0; v < this.heap.length; v++) yield this.heap[v].data;
      }
      remove(v) {
        let E = 0;
        for (let N = 0; N < this.heap.length; N++)
          v(this.heap[N]) || ((this.heap[E] = this.heap[N]), E++);
        this.heap.splice(E);
        for (let N = sw(this.heap.length - 1); N >= 0; N--) this.percDown(N);
        return this;
      }
    }
    function f3(b) {
      return (b << 1) + 1;
    }
    function sw(b) {
      return ((b + 1) >> 1) - 1;
    }
    function Kc(b, v) {
      return b.priority !== v.priority
        ? b.priority < v.priority
        : b.pushCount < v.pushCount;
    }
    function aw(b, v) {
      var E = Zc(b, v),
        { push: N, pushAsync: M } = E;
      (E._tasks = new l3()),
        (E._createTaskItem = ({ data: B, priority: j }, U) => ({
          data: B,
          priority: j,
          callback: U,
        }));
      function q(B, j) {
        return Array.isArray(B)
          ? B.map((U) => ({ data: U, priority: j }))
          : { data: B, priority: j };
      }
      return (
        (E.push = function (B, j = 0, U) {
          return N(q(B, j), U);
        }),
        (E.pushAsync = function (B, j = 0, U) {
          return M(q(B, j), U);
        }),
        delete E.unshift,
        delete E.unshiftAsync,
        E
      );
    }
    function h3(b, v) {
      if (((v = m(v)), !Array.isArray(b)))
        return v(
          new TypeError("First argument to race must be an array of functions"),
        );
      if (!b.length) return v();
      for (var E = 0, N = b.length; E < N; E++) S(b[E])(v);
    }
    var ow = O(h3, 2);
    function Mu(b, v, E, N) {
      var M = [...b].reverse();
      return ri(M, v, E, N);
    }
    function Lu(b) {
      var v = S(b);
      return r(function (N, M) {
        return (
          N.push((q, ...B) => {
            let j = {};
            if ((q && (j.error = q), B.length > 0)) {
              var U = B;
              B.length <= 1 && ([U] = B), (j.value = U);
            }
            M(null, j);
          }),
          v.apply(this, N)
        );
      });
    }
    function uw(b) {
      var v;
      return (
        Array.isArray(b)
          ? (v = b.map(Lu))
          : ((v = {}),
            Object.keys(b).forEach((E) => {
              v[E] = Lu.call(this, b[E]);
            })),
        v
      );
    }
    function Qc(b, v, E, N) {
      let M = S(E);
      return Ou(
        b,
        v,
        (q, B) => {
          M(q, (j, U) => {
            B(j, !U);
          });
        },
        N,
      );
    }
    function c3(b, v, E) {
      return Qc(W, b, v, E);
    }
    var lw = O(c3, 3);
    function d3(b, v, E, N) {
      return Qc($(v), b, E, N);
    }
    var fw = O(d3, 4);
    function p3(b, v, E) {
      return Qc(Be, b, v, E);
    }
    var hw = O(p3, 3);
    function cw(b) {
      return function () {
        return b;
      };
    }
    let Jc = 5,
      dw = 0;
    function qu(b, v, E) {
      var N = { times: Jc, intervalFunc: cw(dw) };
      if (
        (arguments.length < 3 && typeof b == "function"
          ? ((E = v || ei()), (v = b))
          : (m3(N, b), (E = E || ei())),
        typeof v != "function")
      )
        throw new Error("Invalid arguments for async.retry");
      var M = S(v),
        q = 1;
      function B() {
        M((j, ...U) => {
          j !== !1 &&
            (j &&
            q++ < N.times &&
            (typeof N.errorFilter != "function" || N.errorFilter(j))
              ? setTimeout(B, N.intervalFunc(q - 1))
              : E(j, ...U));
        });
      }
      return B(), E[xr];
    }
    function m3(b, v) {
      if (typeof v == "object")
        (b.times = +v.times || Jc),
          (b.intervalFunc =
            typeof v.interval == "function"
              ? v.interval
              : cw(+v.interval || dw)),
          (b.errorFilter = v.errorFilter);
      else if (typeof v == "number" || typeof v == "string") b.times = +v || Jc;
      else throw new Error("Invalid arguments for async.retry");
    }
    function pw(b, v) {
      v || ((v = b), (b = null));
      let E = (b && b.arity) || v.length;
      d(v) && (E += 1);
      var N = S(v);
      return r((M, q) => {
        (M.length < E - 1 || q == null) && (M.push(q), (q = ei()));
        function B(j) {
          N(...M, j);
        }
        return b ? qu(b, B, q) : qu(B, q), q[xr];
      });
    }
    function mw(b, v) {
      return Xc(Be, b, v);
    }
    function g3(b, v, E) {
      return Cr(Boolean, (N) => N)(W, b, v, E);
    }
    var Pu = O(g3, 3);
    function y3(b, v, E, N) {
      return Cr(Boolean, (M) => M)($(v), b, E, N);
    }
    var Bu = O(y3, 4);
    function v3(b, v, E) {
      return Cr(Boolean, (N) => N)(Be, b, v, E);
    }
    var ku = O(v3, 3);
    function w3(b, v, E) {
      var N = S(v);
      return Ie(
        b,
        (q, B) => {
          N(q, (j, U) => {
            if (j) return B(j);
            B(j, { value: q, criteria: U });
          });
        },
        (q, B) => {
          if (q) return E(q);
          E(
            null,
            B.sort(M).map((j) => j.value),
          );
        },
      );
      function M(q, B) {
        var j = q.criteria,
          U = B.criteria;
        return j < U ? -1 : j > U ? 1 : 0;
      }
    }
    var gw = O(w3, 3);
    function yw(b, v, E) {
      var N = S(b);
      return r((M, q) => {
        var B = !1,
          j;
        function U() {
          var V = b.name || "anonymous",
            ne = new Error('Callback function "' + V + '" timed out.');
          (ne.code = "ETIMEDOUT"), E && (ne.info = E), (B = !0), q(ne);
        }
        M.push((...V) => {
          B || (q(...V), clearTimeout(j));
        }),
          (j = setTimeout(U, v)),
          N(...M);
      });
    }
    function D3(b) {
      for (var v = Array(b); b--; ) v[b] = b;
      return v;
    }
    function ju(b, v, E, N) {
      var M = S(E);
      return _a(D3(b), v, M, N);
    }
    function vw(b, v, E) {
      return ju(b, 1 / 0, v, E);
    }
    function ww(b, v, E) {
      return ju(b, 1, v, E);
    }
    function Dw(b, v, E, N) {
      arguments.length <= 3 &&
        typeof v == "function" &&
        ((N = E), (E = v), (v = Array.isArray(b) ? [] : {})),
        (N = m(N || ei()));
      var M = S(E);
      return (
        W(
          b,
          (q, B, j) => {
            M(v, q, B, j);
          },
          (q) => N(q, v),
        ),
        N[xr]
      );
    }
    function b3(b, v) {
      var E = null,
        N;
      return Ca(
        b,
        (M, q) => {
          S(M)((B, ...j) => {
            if (B === !1) return q(B);
            j.length < 2 ? ([N] = j) : (N = j), (E = B), q(B ? null : {});
          });
        },
        () => v(E, N),
      );
    }
    var bw = O(b3);
    function Ew(b) {
      return (...v) => (b.unmemoized || b)(...v);
    }
    function E3(b, v, E) {
      E = k(E);
      var N = S(v),
        M = S(b),
        q = [];
      function B(U, ...V) {
        if (U) return E(U);
        (q = V), U !== !1 && M(j);
      }
      function j(U, V) {
        if (U) return E(U);
        if (U !== !1) {
          if (!V) return E(null, ...q);
          N(B);
        }
      }
      return M(j);
    }
    var Oa = O(E3, 3);
    function _w(b, v, E) {
      let N = S(b);
      return Oa((M) => N((q, B) => M(q, !B)), v, E);
    }
    function _3(b, v) {
      if (((v = m(v)), !Array.isArray(b)))
        return v(
          new Error(
            "First argument to waterfall must be an array of functions",
          ),
        );
      if (!b.length) return v();
      var E = 0;
      function N(q) {
        var B = S(b[E++]);
        B(...q, k(M));
      }
      function M(q, ...B) {
        if (q !== !1) {
          if (q || E === b.length) return v(q, ...B);
          N(B);
        }
      }
      N([]);
    }
    var Sw = O(_3),
      S3 = {
        apply: t,
        applyEach: Pt,
        applyEachSeries: mt,
        asyncify: f,
        auto: zn,
        autoInject: Gn,
        cargo: Uv,
        cargoQueue: zv,
        compose: $v,
        concat: vu,
        concatLimit: Hn,
        concatSeries: wu,
        constant: Wv,
        detect: Du,
        detectLimit: bu,
        detectSeries: Eu,
        dir: Hv,
        doUntil: Yv,
        doWhilst: Sa,
        each: _u,
        eachLimit: xa,
        eachOf: W,
        eachOfLimit: I,
        eachOfSeries: Be,
        eachSeries: Ca,
        ensureAsync: Vc,
        every: Su,
        everyLimit: xu,
        everySeries: Cu,
        filter: Tu,
        filterLimit: Fu,
        filterSeries: Ru,
        forever: Xv,
        groupBy: Zv,
        groupByLimit: Au,
        groupBySeries: Kv,
        log: Qv,
        map: Ie,
        mapLimit: _a,
        mapSeries: ba,
        mapValues: Jv,
        mapValuesLimit: Nu,
        mapValuesSeries: ew,
        memoize: tw,
        nextTick: rw,
        parallel: iw,
        parallelLimit: nw,
        priorityQueue: aw,
        queue: Zc,
        race: ow,
        reduce: ri,
        reduceRight: Mu,
        reflect: Lu,
        reflectAll: uw,
        reject: lw,
        rejectLimit: fw,
        rejectSeries: hw,
        retry: qu,
        retryable: pw,
        seq: Yc,
        series: mw,
        setImmediate: l,
        some: Pu,
        someLimit: Bu,
        someSeries: ku,
        sortBy: gw,
        timeout: yw,
        times: vw,
        timesLimit: ju,
        timesSeries: ww,
        transform: Dw,
        tryEach: bw,
        unmemoize: Ew,
        until: _w,
        waterfall: Sw,
        whilst: Oa,
        all: Su,
        allLimit: xu,
        allSeries: Cu,
        any: Pu,
        anyLimit: Bu,
        anySeries: ku,
        find: Du,
        findLimit: bu,
        findSeries: Eu,
        flatMap: vu,
        flatMapLimit: Hn,
        flatMapSeries: wu,
        forEach: _u,
        forEachSeries: Ca,
        forEachLimit: xa,
        forEachOf: W,
        forEachOfSeries: Be,
        forEachOfLimit: I,
        inject: ri,
        foldl: ri,
        foldr: Mu,
        select: Tu,
        selectLimit: Fu,
        selectSeries: Ru,
        wrapSync: f,
        during: Oa,
        doDuring: Sa,
      };
    (e.default = S3),
      (e.apply = t),
      (e.applyEach = Pt),
      (e.applyEachSeries = mt),
      (e.asyncify = f),
      (e.auto = zn),
      (e.autoInject = Gn),
      (e.cargo = Uv),
      (e.cargoQueue = zv),
      (e.compose = $v),
      (e.concat = vu),
      (e.concatLimit = Hn),
      (e.concatSeries = wu),
      (e.constant = Wv),
      (e.detect = Du),
      (e.detectLimit = bu),
      (e.detectSeries = Eu),
      (e.dir = Hv),
      (e.doUntil = Yv),
      (e.doWhilst = Sa),
      (e.each = _u),
      (e.eachLimit = xa),
      (e.eachOf = W),
      (e.eachOfLimit = I),
      (e.eachOfSeries = Be),
      (e.eachSeries = Ca),
      (e.ensureAsync = Vc),
      (e.every = Su),
      (e.everyLimit = xu),
      (e.everySeries = Cu),
      (e.filter = Tu),
      (e.filterLimit = Fu),
      (e.filterSeries = Ru),
      (e.forever = Xv),
      (e.groupBy = Zv),
      (e.groupByLimit = Au),
      (e.groupBySeries = Kv),
      (e.log = Qv),
      (e.map = Ie),
      (e.mapLimit = _a),
      (e.mapSeries = ba),
      (e.mapValues = Jv),
      (e.mapValuesLimit = Nu),
      (e.mapValuesSeries = ew),
      (e.memoize = tw),
      (e.nextTick = rw),
      (e.parallel = iw),
      (e.parallelLimit = nw),
      (e.priorityQueue = aw),
      (e.queue = Zc),
      (e.race = ow),
      (e.reduce = ri),
      (e.reduceRight = Mu),
      (e.reflect = Lu),
      (e.reflectAll = uw),
      (e.reject = lw),
      (e.rejectLimit = fw),
      (e.rejectSeries = hw),
      (e.retry = qu),
      (e.retryable = pw),
      (e.seq = Yc),
      (e.series = mw),
      (e.setImmediate = l),
      (e.some = Pu),
      (e.someLimit = Bu),
      (e.someSeries = ku),
      (e.sortBy = gw),
      (e.timeout = yw),
      (e.times = vw),
      (e.timesLimit = ju),
      (e.timesSeries = ww),
      (e.transform = Dw),
      (e.tryEach = bw),
      (e.unmemoize = Ew),
      (e.until = _w),
      (e.waterfall = Sw),
      (e.whilst = Oa),
      (e.all = Su),
      (e.allLimit = xu),
      (e.allSeries = Cu),
      (e.any = Pu),
      (e.anyLimit = Bu),
      (e.anySeries = ku),
      (e.find = Du),
      (e.findLimit = bu),
      (e.findSeries = Eu),
      (e.flatMap = vu),
      (e.flatMapLimit = Hn),
      (e.flatMapSeries = wu),
      (e.forEach = _u),
      (e.forEachSeries = Ca),
      (e.forEachLimit = xa),
      (e.forEachOf = W),
      (e.forEachOfSeries = Be),
      (e.forEachOfLimit = I),
      (e.inject = ri),
      (e.foldl = ri),
      (e.foldr = Mu),
      (e.select = Tu),
      (e.selectLimit = Fu),
      (e.selectSeries = Ru),
      (e.wrapSync = f),
      (e.during = Oa),
      (e.doDuring = Sa),
      Object.defineProperty(e, "__esModule", { value: !0 });
  });
});
var lO = y((YJ, uO) => {
  var Fi = require("constants"),
    c9 = process.cwd,
    yh = null,
    d9 = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function () {
    return yh || (yh = c9.call(process)), yh;
  };
  try {
    process.cwd();
  } catch {}
  typeof process.chdir == "function" &&
    ((t0 = process.chdir),
    (process.chdir = function (e) {
      (yh = null), t0.call(process, e);
    }),
    Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, t0));
  var t0;
  uO.exports = p9;
  function p9(e) {
    Fi.hasOwnProperty("O_SYMLINK") &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) &&
      t(e),
      e.lutimes || r(e),
      (e.chown = s(e.chown)),
      (e.fchown = s(e.fchown)),
      (e.lchown = s(e.lchown)),
      (e.chmod = i(e.chmod)),
      (e.fchmod = i(e.fchmod)),
      (e.lchmod = i(e.lchmod)),
      (e.chownSync = a(e.chownSync)),
      (e.fchownSync = a(e.fchownSync)),
      (e.lchownSync = a(e.lchownSync)),
      (e.chmodSync = n(e.chmodSync)),
      (e.fchmodSync = n(e.fchmodSync)),
      (e.lchmodSync = n(e.lchmodSync)),
      (e.stat = o(e.stat)),
      (e.fstat = o(e.fstat)),
      (e.lstat = o(e.lstat)),
      (e.statSync = u(e.statSync)),
      (e.fstatSync = u(e.fstatSync)),
      (e.lstatSync = u(e.lstatSync)),
      e.chmod &&
        !e.lchmod &&
        ((e.lchmod = function (f, h, c) {
          c && process.nextTick(c);
        }),
        (e.lchmodSync = function () {})),
      e.chown &&
        !e.lchown &&
        ((e.lchown = function (f, h, c, d) {
          d && process.nextTick(d);
        }),
        (e.lchownSync = function () {})),
      d9 === "win32" &&
        (e.rename =
          typeof e.rename != "function"
            ? e.rename
            : (function (f) {
                function h(c, d, g) {
                  var C = Date.now(),
                    S = 0;
                  f(c, d, function O(L) {
                    if (
                      L &&
                      (L.code === "EACCES" || L.code === "EPERM") &&
                      Date.now() - C < 6e4
                    ) {
                      setTimeout(function () {
                        e.stat(d, function (D, w) {
                          D && D.code === "ENOENT" ? f(c, d, O) : g(L);
                        });
                      }, S),
                        S < 100 && (S += 10);
                      return;
                    }
                    g && g(L);
                  });
                }
                return Object.setPrototypeOf && Object.setPrototypeOf(h, f), h;
              })(e.rename)),
      (e.read =
        typeof e.read != "function"
          ? e.read
          : (function (f) {
              function h(c, d, g, C, S, O) {
                var L;
                if (O && typeof O == "function") {
                  var D = 0;
                  L = function (w, F, m) {
                    if (w && w.code === "EAGAIN" && D < 10)
                      return D++, f.call(e, c, d, g, C, S, L);
                    O.apply(this, arguments);
                  };
                }
                return f.call(e, c, d, g, C, S, L);
              }
              return Object.setPrototypeOf && Object.setPrototypeOf(h, f), h;
            })(e.read)),
      (e.readSync =
        typeof e.readSync != "function"
          ? e.readSync
          : (function (f) {
              return function (h, c, d, g, C) {
                for (var S = 0; ; )
                  try {
                    return f.call(e, h, c, d, g, C);
                  } catch (O) {
                    if (O.code === "EAGAIN" && S < 10) {
                      S++;
                      continue;
                    }
                    throw O;
                  }
              };
            })(e.readSync));
    function t(f) {
      (f.lchmod = function (h, c, d) {
        f.open(h, Fi.O_WRONLY | Fi.O_SYMLINK, c, function (g, C) {
          if (g) {
            d && d(g);
            return;
          }
          f.fchmod(C, c, function (S) {
            f.close(C, function (O) {
              d && d(S || O);
            });
          });
        });
      }),
        (f.lchmodSync = function (h, c) {
          var d = f.openSync(h, Fi.O_WRONLY | Fi.O_SYMLINK, c),
            g = !0,
            C;
          try {
            (C = f.fchmodSync(d, c)), (g = !1);
          } finally {
            if (g)
              try {
                f.closeSync(d);
              } catch {}
            else f.closeSync(d);
          }
          return C;
        });
    }
    function r(f) {
      Fi.hasOwnProperty("O_SYMLINK") && f.futimes
        ? ((f.lutimes = function (h, c, d, g) {
            f.open(h, Fi.O_SYMLINK, function (C, S) {
              if (C) {
                g && g(C);
                return;
              }
              f.futimes(S, c, d, function (O) {
                f.close(S, function (L) {
                  g && g(O || L);
                });
              });
            });
          }),
          (f.lutimesSync = function (h, c, d) {
            var g = f.openSync(h, Fi.O_SYMLINK),
              C,
              S = !0;
            try {
              (C = f.futimesSync(g, c, d)), (S = !1);
            } finally {
              if (S)
                try {
                  f.closeSync(g);
                } catch {}
              else f.closeSync(g);
            }
            return C;
          }))
        : f.futimes &&
          ((f.lutimes = function (h, c, d, g) {
            g && process.nextTick(g);
          }),
          (f.lutimesSync = function () {}));
    }
    function i(f) {
      return (
        f &&
        function (h, c, d) {
          return f.call(e, h, c, function (g) {
            l(g) && (g = null), d && d.apply(this, arguments);
          });
        }
      );
    }
    function n(f) {
      return (
        f &&
        function (h, c) {
          try {
            return f.call(e, h, c);
          } catch (d) {
            if (!l(d)) throw d;
          }
        }
      );
    }
    function s(f) {
      return (
        f &&
        function (h, c, d, g) {
          return f.call(e, h, c, d, function (C) {
            l(C) && (C = null), g && g.apply(this, arguments);
          });
        }
      );
    }
    function a(f) {
      return (
        f &&
        function (h, c, d) {
          try {
            return f.call(e, h, c, d);
          } catch (g) {
            if (!l(g)) throw g;
          }
        }
      );
    }
    function o(f) {
      return (
        f &&
        function (h, c, d) {
          typeof c == "function" && ((d = c), (c = null));
          function g(C, S) {
            S &&
              (S.uid < 0 && (S.uid += 4294967296),
              S.gid < 0 && (S.gid += 4294967296)),
              d && d.apply(this, arguments);
          }
          return c ? f.call(e, h, c, g) : f.call(e, h, g);
        }
      );
    }
    function u(f) {
      return (
        f &&
        function (h, c) {
          var d = c ? f.call(e, h, c) : f.call(e, h);
          return (
            d &&
              (d.uid < 0 && (d.uid += 4294967296),
              d.gid < 0 && (d.gid += 4294967296)),
            d
          );
        }
      );
    }
    function l(f) {
      if (!f || f.code === "ENOSYS") return !0;
      var h = !process.getuid || process.getuid() !== 0;
      return !!(h && (f.code === "EINVAL" || f.code === "EPERM"));
    }
  }
});
var cO = y((VJ, hO) => {
  var fO = require("stream").Stream;
  hO.exports = m9;
  function m9(e) {
    return { ReadStream: t, WriteStream: r };
    function t(i, n) {
      if (!(this instanceof t)) return new t(i, n);
      fO.call(this);
      var s = this;
      (this.path = i),
        (this.fd = null),
        (this.readable = !0),
        (this.paused = !1),
        (this.flags = "r"),
        (this.mode = 438),
        (this.bufferSize = 64 * 1024),
        (n = n || {});
      for (var a = Object.keys(n), o = 0, u = a.length; o < u; o++) {
        var l = a[o];
        this[l] = n[l];
      }
      if (
        (this.encoding && this.setEncoding(this.encoding),
        this.start !== void 0)
      ) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.end === void 0) this.end = 1 / 0;
        else if (typeof this.end != "number")
          throw TypeError("end must be a Number");
        if (this.start > this.end) throw new Error("start must be <= end");
        this.pos = this.start;
      }
      if (this.fd !== null) {
        process.nextTick(function () {
          s._read();
        });
        return;
      }
      e.open(this.path, this.flags, this.mode, function (f, h) {
        if (f) {
          s.emit("error", f), (s.readable = !1);
          return;
        }
        (s.fd = h), s.emit("open", h), s._read();
      });
    }
    function r(i, n) {
      if (!(this instanceof r)) return new r(i, n);
      fO.call(this),
        (this.path = i),
        (this.fd = null),
        (this.writable = !0),
        (this.flags = "w"),
        (this.encoding = "binary"),
        (this.mode = 438),
        (this.bytesWritten = 0),
        (n = n || {});
      for (var s = Object.keys(n), a = 0, o = s.length; a < o; a++) {
        var u = s[a];
        this[u] = n[u];
      }
      if (this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.start < 0) throw new Error("start must be >= zero");
        this.pos = this.start;
      }
      (this.busy = !1),
        (this._queue = []),
        this.fd === null &&
          ((this._open = e.open),
          this._queue.push([
            this._open,
            this.path,
            this.flags,
            this.mode,
            void 0,
          ]),
          this.flush());
    }
  }
});
var pO = y((XJ, dO) => {
  "use strict";
  dO.exports = y9;
  var g9 =
    Object.getPrototypeOf ||
    function (e) {
      return e.__proto__;
    };
  function y9(e) {
    if (e === null || typeof e != "object") return e;
    if (e instanceof Object) var t = { __proto__: g9(e) };
    else var t = Object.create(null);
    return (
      Object.getOwnPropertyNames(e).forEach(function (r) {
        Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
      }),
      t
    );
  }
});
var s0 = y((ZJ, n0) => {
  var Ce = require("fs"),
    v9 = lO(),
    w9 = cO(),
    D9 = pO(),
    vh = require("util"),
    Ke,
    Dh;
  typeof Symbol == "function" && typeof Symbol.for == "function"
    ? ((Ke = Symbol.for("graceful-fs.queue")),
      (Dh = Symbol.for("graceful-fs.previous")))
    : ((Ke = "___graceful-fs.queue"), (Dh = "___graceful-fs.previous"));
  function b9() {}
  function yO(e, t) {
    Object.defineProperty(e, Ke, {
      get: function () {
        return t;
      },
    });
  }
  var xn = b9;
  vh.debuglog
    ? (xn = vh.debuglog("gfs4"))
    : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") &&
      (xn = function () {
        var e = vh.format.apply(vh, arguments);
        (e =
          "GFS4: " +
          e.split(/\n/).join(`
GFS4: `)),
          console.error(e);
      });
  Ce[Ke] ||
    ((mO = global[Ke] || []),
    yO(Ce, mO),
    (Ce.close = (function (e) {
      function t(r, i) {
        return e.call(Ce, r, function (n) {
          n || gO(), typeof i == "function" && i.apply(this, arguments);
        });
      }
      return Object.defineProperty(t, Dh, { value: e }), t;
    })(Ce.close)),
    (Ce.closeSync = (function (e) {
      function t(r) {
        e.apply(Ce, arguments), gO();
      }
      return Object.defineProperty(t, Dh, { value: e }), t;
    })(Ce.closeSync)),
    /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") &&
      process.on("exit", function () {
        xn(Ce[Ke]), require("assert").equal(Ce[Ke].length, 0);
      }));
  var mO;
  global[Ke] || yO(global, Ce[Ke]);
  n0.exports = r0(D9(Ce));
  process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH &&
    !Ce.__patched &&
    ((n0.exports = r0(Ce)), (Ce.__patched = !0));
  function r0(e) {
    v9(e),
      (e.gracefulify = r0),
      (e.createReadStream = F),
      (e.createWriteStream = m);
    var t = e.readFile;
    e.readFile = r;
    function r(p, T, R) {
      return typeof T == "function" && ((R = T), (T = null)), k(p, T, R);
      function k(z, $, X, I) {
        return t(z, $, function (P) {
          P && (P.code === "EMFILE" || P.code === "ENFILE")
            ? Ps([k, [z, $, X], P, I || Date.now(), Date.now()])
            : typeof X == "function" && X.apply(this, arguments);
        });
      }
    }
    var i = e.writeFile;
    e.writeFile = n;
    function n(p, T, R, k) {
      return typeof R == "function" && ((k = R), (R = null)), z(p, T, R, k);
      function z($, X, I, P, G) {
        return i($, X, I, function (J) {
          J && (J.code === "EMFILE" || J.code === "ENFILE")
            ? Ps([z, [$, X, I, P], J, G || Date.now(), Date.now()])
            : typeof P == "function" && P.apply(this, arguments);
        });
      }
    }
    var s = e.appendFile;
    s && (e.appendFile = a);
    function a(p, T, R, k) {
      return typeof R == "function" && ((k = R), (R = null)), z(p, T, R, k);
      function z($, X, I, P, G) {
        return s($, X, I, function (J) {
          J && (J.code === "EMFILE" || J.code === "ENFILE")
            ? Ps([z, [$, X, I, P], J, G || Date.now(), Date.now()])
            : typeof P == "function" && P.apply(this, arguments);
        });
      }
    }
    var o = e.copyFile;
    o && (e.copyFile = u);
    function u(p, T, R, k) {
      return typeof R == "function" && ((k = R), (R = 0)), z(p, T, R, k);
      function z($, X, I, P, G) {
        return o($, X, I, function (J) {
          J && (J.code === "EMFILE" || J.code === "ENFILE")
            ? Ps([z, [$, X, I, P], J, G || Date.now(), Date.now()])
            : typeof P == "function" && P.apply(this, arguments);
        });
      }
    }
    var l = e.readdir;
    e.readdir = h;
    var f = /^v[0-5]\./;
    function h(p, T, R) {
      typeof T == "function" && ((R = T), (T = null));
      var k = f.test(process.version)
        ? function (X, I, P, G) {
            return l(X, z(X, I, P, G));
          }
        : function (X, I, P, G) {
            return l(X, I, z(X, I, P, G));
          };
      return k(p, T, R);
      function z($, X, I, P) {
        return function (G, J) {
          G && (G.code === "EMFILE" || G.code === "ENFILE")
            ? Ps([k, [$, X, I], G, P || Date.now(), Date.now()])
            : (J && J.sort && J.sort(),
              typeof I == "function" && I.call(this, G, J));
        };
      }
    }
    if (process.version.substr(0, 4) === "v0.8") {
      var c = w9(e);
      (O = c.ReadStream), (D = c.WriteStream);
    }
    var d = e.ReadStream;
    d && ((O.prototype = Object.create(d.prototype)), (O.prototype.open = L));
    var g = e.WriteStream;
    g && ((D.prototype = Object.create(g.prototype)), (D.prototype.open = w)),
      Object.defineProperty(e, "ReadStream", {
        get: function () {
          return O;
        },
        set: function (p) {
          O = p;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e, "WriteStream", {
        get: function () {
          return D;
        },
        set: function (p) {
          D = p;
        },
        enumerable: !0,
        configurable: !0,
      });
    var C = O;
    Object.defineProperty(e, "FileReadStream", {
      get: function () {
        return C;
      },
      set: function (p) {
        C = p;
      },
      enumerable: !0,
      configurable: !0,
    });
    var S = D;
    Object.defineProperty(e, "FileWriteStream", {
      get: function () {
        return S;
      },
      set: function (p) {
        S = p;
      },
      enumerable: !0,
      configurable: !0,
    });
    function O(p, T) {
      return this instanceof O
        ? (d.apply(this, arguments), this)
        : O.apply(Object.create(O.prototype), arguments);
    }
    function L() {
      var p = this;
      A(p.path, p.flags, p.mode, function (T, R) {
        T
          ? (p.autoClose && p.destroy(), p.emit("error", T))
          : ((p.fd = R), p.emit("open", R), p.read());
      });
    }
    function D(p, T) {
      return this instanceof D
        ? (g.apply(this, arguments), this)
        : D.apply(Object.create(D.prototype), arguments);
    }
    function w() {
      var p = this;
      A(p.path, p.flags, p.mode, function (T, R) {
        T ? (p.destroy(), p.emit("error", T)) : ((p.fd = R), p.emit("open", R));
      });
    }
    function F(p, T) {
      return new e.ReadStream(p, T);
    }
    function m(p, T) {
      return new e.WriteStream(p, T);
    }
    var x = e.open;
    e.open = A;
    function A(p, T, R, k) {
      return typeof R == "function" && ((k = R), (R = null)), z(p, T, R, k);
      function z($, X, I, P, G) {
        return x($, X, I, function (J, W) {
          J && (J.code === "EMFILE" || J.code === "ENFILE")
            ? Ps([z, [$, X, I, P], J, G || Date.now(), Date.now()])
            : typeof P == "function" && P.apply(this, arguments);
        });
      }
    }
    return e;
  }
  function Ps(e) {
    xn("ENQUEUE", e[0].name, e[1]), Ce[Ke].push(e), i0();
  }
  var wh;
  function gO() {
    for (var e = Date.now(), t = 0; t < Ce[Ke].length; ++t)
      Ce[Ke][t].length > 2 && ((Ce[Ke][t][3] = e), (Ce[Ke][t][4] = e));
    i0();
  }
  function i0() {
    if ((clearTimeout(wh), (wh = void 0), Ce[Ke].length !== 0)) {
      var e = Ce[Ke].shift(),
        t = e[0],
        r = e[1],
        i = e[2],
        n = e[3],
        s = e[4];
      if (n === void 0) xn("RETRY", t.name, r), t.apply(null, r);
      else if (Date.now() - n >= 6e4) {
        xn("TIMEOUT", t.name, r);
        var a = r.pop();
        typeof a == "function" && a.call(null, i);
      } else {
        var o = Date.now() - s,
          u = Math.max(s - n, 1),
          l = Math.min(u * 1.2, 100);
        o >= l
          ? (xn("RETRY", t.name, r), t.apply(null, r.concat([n])))
          : Ce[Ke].push(e);
      }
      wh === void 0 && (wh = setTimeout(i0, 0));
    }
  }
});
var zr = y((KJ, a0) => {
  "use strict";
  typeof process > "u" ||
  !process.version ||
  process.version.indexOf("v0.") === 0 ||
  (process.version.indexOf("v1.") === 0 &&
    process.version.indexOf("v1.8.") !== 0)
    ? (a0.exports = { nextTick: E9 })
    : (a0.exports = process);
  function E9(e, t, r, i) {
    if (typeof e != "function")
      throw new TypeError('"callback" argument must be a function');
    var n = arguments.length,
      s,
      a;
    switch (n) {
      case 0:
      case 1:
        return process.nextTick(e);
      case 2:
        return process.nextTick(function () {
          e.call(null, t);
        });
      case 3:
        return process.nextTick(function () {
          e.call(null, t, r);
        });
      case 4:
        return process.nextTick(function () {
          e.call(null, t, r, i);
        });
      default:
        for (s = new Array(n - 1), a = 0; a < s.length; ) s[a++] = arguments[a];
        return process.nextTick(function () {
          e.apply(null, s);
        });
    }
  }
});
var o0 = y((QJ, vO) => {
  var _9 = {}.toString;
  vO.exports =
    Array.isArray ||
    function (e) {
      return _9.call(e) == "[object Array]";
    };
});
var u0 = y((JJ, wO) => {
  wO.exports = require("stream");
});
var Oo = y((l0, bO) => {
  var bh = require("buffer"),
    $r = bh.Buffer;
  function DO(e, t) {
    for (var r in e) t[r] = e[r];
  }
  $r.from && $r.alloc && $r.allocUnsafe && $r.allocUnsafeSlow
    ? (bO.exports = bh)
    : (DO(bh, l0), (l0.Buffer = Bs));
  function Bs(e, t, r) {
    return $r(e, t, r);
  }
  DO($r, Bs);
  Bs.from = function (e, t, r) {
    if (typeof e == "number")
      throw new TypeError("Argument must not be a number");
    return $r(e, t, r);
  };
  Bs.alloc = function (e, t, r) {
    if (typeof e != "number") throw new TypeError("Argument must be a number");
    var i = $r(e);
    return (
      t !== void 0
        ? typeof r == "string"
          ? i.fill(t, r)
          : i.fill(t)
        : i.fill(0),
      i
    );
  };
  Bs.allocUnsafe = function (e) {
    if (typeof e != "number") throw new TypeError("Argument must be a number");
    return $r(e);
  };
  Bs.allocUnsafeSlow = function (e) {
    if (typeof e != "number") throw new TypeError("Argument must be a number");
    return bh.SlowBuffer(e);
  };
});
var nr = y((ot) => {
  function S9(e) {
    return Array.isArray ? Array.isArray(e) : Eh(e) === "[object Array]";
  }
  ot.isArray = S9;
  function x9(e) {
    return typeof e == "boolean";
  }
  ot.isBoolean = x9;
  function C9(e) {
    return e === null;
  }
  ot.isNull = C9;
  function O9(e) {
    return e == null;
  }
  ot.isNullOrUndefined = O9;
  function T9(e) {
    return typeof e == "number";
  }
  ot.isNumber = T9;
  function F9(e) {
    return typeof e == "string";
  }
  ot.isString = F9;
  function R9(e) {
    return typeof e == "symbol";
  }
  ot.isSymbol = R9;
  function A9(e) {
    return e === void 0;
  }
  ot.isUndefined = A9;
  function N9(e) {
    return Eh(e) === "[object RegExp]";
  }
  ot.isRegExp = N9;
  function I9(e) {
    return typeof e == "object" && e !== null;
  }
  ot.isObject = I9;
  function M9(e) {
    return Eh(e) === "[object Date]";
  }
  ot.isDate = M9;
  function L9(e) {
    return Eh(e) === "[object Error]" || e instanceof Error;
  }
  ot.isError = L9;
  function q9(e) {
    return typeof e == "function";
  }
  ot.isFunction = q9;
  function P9(e) {
    return (
      e === null ||
      typeof e == "boolean" ||
      typeof e == "number" ||
      typeof e == "string" ||
      typeof e == "symbol" ||
      typeof e > "u"
    );
  }
  ot.isPrimitive = P9;
  ot.isBuffer = require("buffer").Buffer.isBuffer;
  function Eh(e) {
    return Object.prototype.toString.call(e);
  }
});
var _O = y((tee, f0) => {
  "use strict";
  function B9(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  var EO = Oo().Buffer,
    To = require("util");
  function k9(e, t, r) {
    e.copy(t, r);
  }
  f0.exports = (function () {
    function e() {
      B9(this, e), (this.head = null), (this.tail = null), (this.length = 0);
    }
    return (
      (e.prototype.push = function (r) {
        var i = { data: r, next: null };
        this.length > 0 ? (this.tail.next = i) : (this.head = i),
          (this.tail = i),
          ++this.length;
      }),
      (e.prototype.unshift = function (r) {
        var i = { data: r, next: this.head };
        this.length === 0 && (this.tail = i), (this.head = i), ++this.length;
      }),
      (e.prototype.shift = function () {
        if (this.length !== 0) {
          var r = this.head.data;
          return (
            this.length === 1
              ? (this.head = this.tail = null)
              : (this.head = this.head.next),
            --this.length,
            r
          );
        }
      }),
      (e.prototype.clear = function () {
        (this.head = this.tail = null), (this.length = 0);
      }),
      (e.prototype.join = function (r) {
        if (this.length === 0) return "";
        for (var i = this.head, n = "" + i.data; (i = i.next); )
          n += r + i.data;
        return n;
      }),
      (e.prototype.concat = function (r) {
        if (this.length === 0) return EO.alloc(0);
        if (this.length === 1) return this.head.data;
        for (var i = EO.allocUnsafe(r >>> 0), n = this.head, s = 0; n; )
          k9(n.data, i, s), (s += n.data.length), (n = n.next);
        return i;
      }),
      e
    );
  })();
  To &&
    To.inspect &&
    To.inspect.custom &&
    (f0.exports.prototype[To.inspect.custom] = function () {
      var e = To.inspect({ length: this.length });
      return this.constructor.name + " " + e;
    });
});
var h0 = y((ree, CO) => {
  "use strict";
  var SO = zr();
  function j9(e, t) {
    var r = this,
      i = this._readableState && this._readableState.destroyed,
      n = this._writableState && this._writableState.destroyed;
    return i || n
      ? (t
          ? t(e)
          : e &&
            (!this._writableState || !this._writableState.errorEmitted) &&
            SO.nextTick(xO, this, e),
        this)
      : (this._readableState && (this._readableState.destroyed = !0),
        this._writableState && (this._writableState.destroyed = !0),
        this._destroy(e || null, function (s) {
          !t && s
            ? (SO.nextTick(xO, r, s),
              r._writableState && (r._writableState.errorEmitted = !0))
            : t && t(s);
        }),
        this);
  }
  function U9() {
    this._readableState &&
      ((this._readableState.destroyed = !1),
      (this._readableState.reading = !1),
      (this._readableState.ended = !1),
      (this._readableState.endEmitted = !1)),
      this._writableState &&
        ((this._writableState.destroyed = !1),
        (this._writableState.ended = !1),
        (this._writableState.ending = !1),
        (this._writableState.finished = !1),
        (this._writableState.errorEmitted = !1));
  }
  function xO(e, t) {
    e.emit("error", t);
  }
  CO.exports = { destroy: j9, undestroy: U9 };
});
var d0 = y((iee, MO) => {
  "use strict";
  var Cn = zr();
  MO.exports = Le;
  function TO(e) {
    var t = this;
    (this.next = null),
      (this.entry = null),
      (this.finish = function () {
        sU(t, e);
      });
  }
  var z9 =
      !process.browser &&
      ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1
        ? setImmediate
        : Cn.nextTick,
    ks;
  Le.WritableState = Ro;
  var FO = Object.create(nr());
  FO.inherits = je();
  var $9 = { deprecate: wf() },
    RO = u0(),
    Sh = Oo().Buffer,
    W9 = global.Uint8Array || function () {};
  function G9(e) {
    return Sh.from(e);
  }
  function H9(e) {
    return Sh.isBuffer(e) || e instanceof W9;
  }
  var AO = h0();
  FO.inherits(Le, RO);
  function Y9() {}
  function Ro(e, t) {
    (ks = ks || On()), (e = e || {});
    var r = t instanceof ks;
    (this.objectMode = !!e.objectMode),
      r && (this.objectMode = this.objectMode || !!e.writableObjectMode);
    var i = e.highWaterMark,
      n = e.writableHighWaterMark,
      s = this.objectMode ? 16 : 16 * 1024;
    i || i === 0
      ? (this.highWaterMark = i)
      : r && (n || n === 0)
      ? (this.highWaterMark = n)
      : (this.highWaterMark = s),
      (this.highWaterMark = Math.floor(this.highWaterMark)),
      (this.finalCalled = !1),
      (this.needDrain = !1),
      (this.ending = !1),
      (this.ended = !1),
      (this.finished = !1),
      (this.destroyed = !1);
    var a = e.decodeStrings === !1;
    (this.decodeStrings = !a),
      (this.defaultEncoding = e.defaultEncoding || "utf8"),
      (this.length = 0),
      (this.writing = !1),
      (this.corked = 0),
      (this.sync = !0),
      (this.bufferProcessing = !1),
      (this.onwrite = function (o) {
        eU(t, o);
      }),
      (this.writecb = null),
      (this.writelen = 0),
      (this.bufferedRequest = null),
      (this.lastBufferedRequest = null),
      (this.pendingcb = 0),
      (this.prefinished = !1),
      (this.errorEmitted = !1),
      (this.bufferedRequestCount = 0),
      (this.corkedRequestsFree = new TO(this));
  }
  Ro.prototype.getBuffer = function () {
    for (var t = this.bufferedRequest, r = []; t; ) r.push(t), (t = t.next);
    return r;
  };
  (function () {
    try {
      Object.defineProperty(Ro.prototype, "buffer", {
        get: $9.deprecate(
          function () {
            return this.getBuffer();
          },
          "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.",
          "DEP0003",
        ),
      });
    } catch {}
  })();
  var _h;
  typeof Symbol == "function" &&
  Symbol.hasInstance &&
  typeof Function.prototype[Symbol.hasInstance] == "function"
    ? ((_h = Function.prototype[Symbol.hasInstance]),
      Object.defineProperty(Le, Symbol.hasInstance, {
        value: function (e) {
          return _h.call(this, e)
            ? !0
            : this !== Le
            ? !1
            : e && e._writableState instanceof Ro;
        },
      }))
    : (_h = function (e) {
        return e instanceof this;
      });
  function Le(e) {
    if (((ks = ks || On()), !_h.call(Le, this) && !(this instanceof ks)))
      return new Le(e);
    (this._writableState = new Ro(e, this)),
      (this.writable = !0),
      e &&
        (typeof e.write == "function" && (this._write = e.write),
        typeof e.writev == "function" && (this._writev = e.writev),
        typeof e.destroy == "function" && (this._destroy = e.destroy),
        typeof e.final == "function" && (this._final = e.final)),
      RO.call(this);
  }
  Le.prototype.pipe = function () {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  function V9(e, t) {
    var r = new Error("write after end");
    e.emit("error", r), Cn.nextTick(t, r);
  }
  function X9(e, t, r, i) {
    var n = !0,
      s = !1;
    return (
      r === null
        ? (s = new TypeError("May not write null values to stream"))
        : typeof r != "string" &&
          r !== void 0 &&
          !t.objectMode &&
          (s = new TypeError("Invalid non-string/buffer chunk")),
      s && (e.emit("error", s), Cn.nextTick(i, s), (n = !1)),
      n
    );
  }
  Le.prototype.write = function (e, t, r) {
    var i = this._writableState,
      n = !1,
      s = !i.objectMode && H9(e);
    return (
      s && !Sh.isBuffer(e) && (e = G9(e)),
      typeof t == "function" && ((r = t), (t = null)),
      s ? (t = "buffer") : t || (t = i.defaultEncoding),
      typeof r != "function" && (r = Y9),
      i.ended
        ? V9(this, r)
        : (s || X9(this, i, e, r)) &&
          (i.pendingcb++, (n = K9(this, i, s, e, t, r))),
      n
    );
  };
  Le.prototype.cork = function () {
    var e = this._writableState;
    e.corked++;
  };
  Le.prototype.uncork = function () {
    var e = this._writableState;
    e.corked &&
      (e.corked--,
      !e.writing &&
        !e.corked &&
        !e.finished &&
        !e.bufferProcessing &&
        e.bufferedRequest &&
        NO(this, e));
  };
  Le.prototype.setDefaultEncoding = function (t) {
    if (
      (typeof t == "string" && (t = t.toLowerCase()),
      !(
        [
          "hex",
          "utf8",
          "utf-8",
          "ascii",
          "binary",
          "base64",
          "ucs2",
          "ucs-2",
          "utf16le",
          "utf-16le",
          "raw",
        ].indexOf((t + "").toLowerCase()) > -1
      ))
    )
      throw new TypeError("Unknown encoding: " + t);
    return (this._writableState.defaultEncoding = t), this;
  };
  function Z9(e, t, r) {
    return (
      !e.objectMode &&
        e.decodeStrings !== !1 &&
        typeof t == "string" &&
        (t = Sh.from(t, r)),
      t
    );
  }
  Object.defineProperty(Le.prototype, "writableHighWaterMark", {
    enumerable: !1,
    get: function () {
      return this._writableState.highWaterMark;
    },
  });
  function K9(e, t, r, i, n, s) {
    if (!r) {
      var a = Z9(t, i, n);
      i !== a && ((r = !0), (n = "buffer"), (i = a));
    }
    var o = t.objectMode ? 1 : i.length;
    t.length += o;
    var u = t.length < t.highWaterMark;
    if ((u || (t.needDrain = !0), t.writing || t.corked)) {
      var l = t.lastBufferedRequest;
      (t.lastBufferedRequest = {
        chunk: i,
        encoding: n,
        isBuf: r,
        callback: s,
        next: null,
      }),
        l
          ? (l.next = t.lastBufferedRequest)
          : (t.bufferedRequest = t.lastBufferedRequest),
        (t.bufferedRequestCount += 1);
    } else c0(e, t, !1, o, i, n, s);
    return u;
  }
  function c0(e, t, r, i, n, s, a) {
    (t.writelen = i),
      (t.writecb = a),
      (t.writing = !0),
      (t.sync = !0),
      r ? e._writev(n, t.onwrite) : e._write(n, s, t.onwrite),
      (t.sync = !1);
  }
  function Q9(e, t, r, i, n) {
    --t.pendingcb,
      r
        ? (Cn.nextTick(n, i),
          Cn.nextTick(Fo, e, t),
          (e._writableState.errorEmitted = !0),
          e.emit("error", i))
        : (n(i),
          (e._writableState.errorEmitted = !0),
          e.emit("error", i),
          Fo(e, t));
  }
  function J9(e) {
    (e.writing = !1),
      (e.writecb = null),
      (e.length -= e.writelen),
      (e.writelen = 0);
  }
  function eU(e, t) {
    var r = e._writableState,
      i = r.sync,
      n = r.writecb;
    if ((J9(r), t)) Q9(e, r, i, t, n);
    else {
      var s = IO(r);
      !s && !r.corked && !r.bufferProcessing && r.bufferedRequest && NO(e, r),
        i ? z9(OO, e, r, s, n) : OO(e, r, s, n);
    }
  }
  function OO(e, t, r, i) {
    r || tU(e, t), t.pendingcb--, i(), Fo(e, t);
  }
  function tU(e, t) {
    t.length === 0 && t.needDrain && ((t.needDrain = !1), e.emit("drain"));
  }
  function NO(e, t) {
    t.bufferProcessing = !0;
    var r = t.bufferedRequest;
    if (e._writev && r && r.next) {
      var i = t.bufferedRequestCount,
        n = new Array(i),
        s = t.corkedRequestsFree;
      s.entry = r;
      for (var a = 0, o = !0; r; )
        (n[a] = r), r.isBuf || (o = !1), (r = r.next), (a += 1);
      (n.allBuffers = o),
        c0(e, t, !0, t.length, n, "", s.finish),
        t.pendingcb++,
        (t.lastBufferedRequest = null),
        s.next
          ? ((t.corkedRequestsFree = s.next), (s.next = null))
          : (t.corkedRequestsFree = new TO(t)),
        (t.bufferedRequestCount = 0);
    } else {
      for (; r; ) {
        var u = r.chunk,
          l = r.encoding,
          f = r.callback,
          h = t.objectMode ? 1 : u.length;
        if (
          (c0(e, t, !1, h, u, l, f),
          (r = r.next),
          t.bufferedRequestCount--,
          t.writing)
        )
          break;
      }
      r === null && (t.lastBufferedRequest = null);
    }
    (t.bufferedRequest = r), (t.bufferProcessing = !1);
  }
  Le.prototype._write = function (e, t, r) {
    r(new Error("_write() is not implemented"));
  };
  Le.prototype._writev = null;
  Le.prototype.end = function (e, t, r) {
    var i = this._writableState;
    typeof e == "function"
      ? ((r = e), (e = null), (t = null))
      : typeof t == "function" && ((r = t), (t = null)),
      e != null && this.write(e, t),
      i.corked && ((i.corked = 1), this.uncork()),
      !i.ending && !i.finished && nU(this, i, r);
  };
  function IO(e) {
    return (
      e.ending &&
      e.length === 0 &&
      e.bufferedRequest === null &&
      !e.finished &&
      !e.writing
    );
  }
  function rU(e, t) {
    e._final(function (r) {
      t.pendingcb--,
        r && e.emit("error", r),
        (t.prefinished = !0),
        e.emit("prefinish"),
        Fo(e, t);
    });
  }
  function iU(e, t) {
    !t.prefinished &&
      !t.finalCalled &&
      (typeof e._final == "function"
        ? (t.pendingcb++, (t.finalCalled = !0), Cn.nextTick(rU, e, t))
        : ((t.prefinished = !0), e.emit("prefinish")));
  }
  function Fo(e, t) {
    var r = IO(t);
    return (
      r &&
        (iU(e, t), t.pendingcb === 0 && ((t.finished = !0), e.emit("finish"))),
      r
    );
  }
  function nU(e, t, r) {
    (t.ending = !0),
      Fo(e, t),
      r && (t.finished ? Cn.nextTick(r) : e.once("finish", r)),
      (t.ended = !0),
      (e.writable = !1);
  }
  function sU(e, t, r) {
    var i = e.entry;
    for (e.entry = null; i; ) {
      var n = i.callback;
      t.pendingcb--, n(r), (i = i.next);
    }
    t.corkedRequestsFree
      ? (t.corkedRequestsFree.next = e)
      : (t.corkedRequestsFree = e);
  }
  Object.defineProperty(Le.prototype, "destroyed", {
    get: function () {
      return this._writableState === void 0
        ? !1
        : this._writableState.destroyed;
    },
    set: function (e) {
      !this._writableState || (this._writableState.destroyed = e);
    },
  });
  Le.prototype.destroy = AO.destroy;
  Le.prototype._undestroy = AO.undestroy;
  Le.prototype._destroy = function (e, t) {
    this.end(), t(e);
  };
});
var On = y((nee, BO) => {
  "use strict";
  var LO = zr(),
    aU =
      Object.keys ||
      function (e) {
        var t = [];
        for (var r in e) t.push(r);
        return t;
      };
  BO.exports = Wr;
  var qO = Object.create(nr());
  qO.inherits = je();
  var PO = g0(),
    m0 = d0();
  qO.inherits(Wr, PO);
  for (p0 = aU(m0.prototype), xh = 0; xh < p0.length; xh++)
    (Ch = p0[xh]), Wr.prototype[Ch] || (Wr.prototype[Ch] = m0.prototype[Ch]);
  var p0, Ch, xh;
  function Wr(e) {
    if (!(this instanceof Wr)) return new Wr(e);
    PO.call(this, e),
      m0.call(this, e),
      e && e.readable === !1 && (this.readable = !1),
      e && e.writable === !1 && (this.writable = !1),
      (this.allowHalfOpen = !0),
      e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1),
      this.once("end", oU);
  }
  Object.defineProperty(Wr.prototype, "writableHighWaterMark", {
    enumerable: !1,
    get: function () {
      return this._writableState.highWaterMark;
    },
  });
  function oU() {
    this.allowHalfOpen || this._writableState.ended || LO.nextTick(uU, this);
  }
  function uU(e) {
    e.end();
  }
  Object.defineProperty(Wr.prototype, "destroyed", {
    get: function () {
      return this._readableState === void 0 || this._writableState === void 0
        ? !1
        : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function (e) {
      this._readableState === void 0 ||
        this._writableState === void 0 ||
        ((this._readableState.destroyed = e),
        (this._writableState.destroyed = e));
    },
  });
  Wr.prototype._destroy = function (e, t) {
    this.push(null), this.end(), LO.nextTick(t, e);
  };
});
var w0 = y((jO) => {
  "use strict";
  var v0 = Oo().Buffer,
    kO =
      v0.isEncoding ||
      function (e) {
        switch (((e = "" + e), e && e.toLowerCase())) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
          case "raw":
            return !0;
          default:
            return !1;
        }
      };
  function lU(e) {
    if (!e) return "utf8";
    for (var t; ; )
      switch (e) {
        case "utf8":
        case "utf-8":
          return "utf8";
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return "utf16le";
        case "latin1":
        case "binary":
          return "latin1";
        case "base64":
        case "ascii":
        case "hex":
          return e;
        default:
          if (t) return;
          (e = ("" + e).toLowerCase()), (t = !0);
      }
  }
  function fU(e) {
    var t = lU(e);
    if (typeof t != "string" && (v0.isEncoding === kO || !kO(e)))
      throw new Error("Unknown encoding: " + e);
    return t || e;
  }
  jO.StringDecoder = Ao;
  function Ao(e) {
    this.encoding = fU(e);
    var t;
    switch (this.encoding) {
      case "utf16le":
        (this.text = gU), (this.end = yU), (t = 4);
        break;
      case "utf8":
        (this.fillLast = dU), (t = 4);
        break;
      case "base64":
        (this.text = vU), (this.end = wU), (t = 3);
        break;
      default:
        (this.write = DU), (this.end = bU);
        return;
    }
    (this.lastNeed = 0),
      (this.lastTotal = 0),
      (this.lastChar = v0.allocUnsafe(t));
  }
  Ao.prototype.write = function (e) {
    if (e.length === 0) return "";
    var t, r;
    if (this.lastNeed) {
      if (((t = this.fillLast(e)), t === void 0)) return "";
      (r = this.lastNeed), (this.lastNeed = 0);
    } else r = 0;
    return r < e.length ? (t ? t + this.text(e, r) : this.text(e, r)) : t || "";
  };
  Ao.prototype.end = mU;
  Ao.prototype.text = pU;
  Ao.prototype.fillLast = function (e) {
    if (this.lastNeed <= e.length)
      return (
        e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed),
        this.lastChar.toString(this.encoding, 0, this.lastTotal)
      );
    e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length),
      (this.lastNeed -= e.length);
  };
  function y0(e) {
    return e <= 127
      ? 0
      : e >> 5 === 6
      ? 2
      : e >> 4 === 14
      ? 3
      : e >> 3 === 30
      ? 4
      : e >> 6 === 2
      ? -1
      : -2;
  }
  function hU(e, t, r) {
    var i = t.length - 1;
    if (i < r) return 0;
    var n = y0(t[i]);
    return n >= 0
      ? (n > 0 && (e.lastNeed = n - 1), n)
      : --i < r || n === -2
      ? 0
      : ((n = y0(t[i])),
        n >= 0
          ? (n > 0 && (e.lastNeed = n - 2), n)
          : --i < r || n === -2
          ? 0
          : ((n = y0(t[i])),
            n >= 0
              ? (n > 0 && (n === 2 ? (n = 0) : (e.lastNeed = n - 3)), n)
              : 0));
  }
  function cU(e, t, r) {
    if ((t[0] & 192) !== 128) return (e.lastNeed = 0), "\uFFFD";
    if (e.lastNeed > 1 && t.length > 1) {
      if ((t[1] & 192) !== 128) return (e.lastNeed = 1), "\uFFFD";
      if (e.lastNeed > 2 && t.length > 2 && (t[2] & 192) !== 128)
        return (e.lastNeed = 2), "\uFFFD";
    }
  }
  function dU(e) {
    var t = this.lastTotal - this.lastNeed,
      r = cU(this, e, t);
    if (r !== void 0) return r;
    if (this.lastNeed <= e.length)
      return (
        e.copy(this.lastChar, t, 0, this.lastNeed),
        this.lastChar.toString(this.encoding, 0, this.lastTotal)
      );
    e.copy(this.lastChar, t, 0, e.length), (this.lastNeed -= e.length);
  }
  function pU(e, t) {
    var r = hU(this, e, t);
    if (!this.lastNeed) return e.toString("utf8", t);
    this.lastTotal = r;
    var i = e.length - (r - this.lastNeed);
    return e.copy(this.lastChar, 0, i), e.toString("utf8", t, i);
  }
  function mU(e) {
    var t = e && e.length ? this.write(e) : "";
    return this.lastNeed ? t + "\uFFFD" : t;
  }
  function gU(e, t) {
    if ((e.length - t) % 2 === 0) {
      var r = e.toString("utf16le", t);
      if (r) {
        var i = r.charCodeAt(r.length - 1);
        if (i >= 55296 && i <= 56319)
          return (
            (this.lastNeed = 2),
            (this.lastTotal = 4),
            (this.lastChar[0] = e[e.length - 2]),
            (this.lastChar[1] = e[e.length - 1]),
            r.slice(0, -1)
          );
      }
      return r;
    }
    return (
      (this.lastNeed = 1),
      (this.lastTotal = 2),
      (this.lastChar[0] = e[e.length - 1]),
      e.toString("utf16le", t, e.length - 1)
    );
  }
  function yU(e) {
    var t = e && e.length ? this.write(e) : "";
    if (this.lastNeed) {
      var r = this.lastTotal - this.lastNeed;
      return t + this.lastChar.toString("utf16le", 0, r);
    }
    return t;
  }
  function vU(e, t) {
    var r = (e.length - t) % 3;
    return r === 0
      ? e.toString("base64", t)
      : ((this.lastNeed = 3 - r),
        (this.lastTotal = 3),
        r === 1
          ? (this.lastChar[0] = e[e.length - 1])
          : ((this.lastChar[0] = e[e.length - 2]),
            (this.lastChar[1] = e[e.length - 1])),
        e.toString("base64", t, e.length - r));
  }
  function wU(e) {
    var t = e && e.length ? this.write(e) : "";
    return this.lastNeed
      ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed)
      : t;
  }
  function DU(e) {
    return e.toString(this.encoding);
  }
  function bU(e) {
    return e && e.length ? this.write(e) : "";
  }
});
var g0 = y((oee, QO) => {
  "use strict";
  var Us = zr();
  QO.exports = _e;
  var EU = o0(),
    No;
  _e.ReadableState = YO;
  var aee = require("events").EventEmitter,
    WO = function (e, t) {
      return e.listeners(t).length;
    },
    S0 = u0(),
    Io = Oo().Buffer,
    _U = global.Uint8Array || function () {};
  function SU(e) {
    return Io.from(e);
  }
  function xU(e) {
    return Io.isBuffer(e) || e instanceof _U;
  }
  var GO = Object.create(nr());
  GO.inherits = je();
  var D0 = require("util"),
    de = void 0;
  D0 && D0.debuglog ? (de = D0.debuglog("stream")) : (de = function () {});
  var CU = _O(),
    HO = h0(),
    js;
  GO.inherits(_e, S0);
  var b0 = ["error", "close", "destroy", "pause", "resume"];
  function OU(e, t, r) {
    if (typeof e.prependListener == "function") return e.prependListener(t, r);
    !e._events || !e._events[t]
      ? e.on(t, r)
      : EU(e._events[t])
      ? e._events[t].unshift(r)
      : (e._events[t] = [r, e._events[t]]);
  }
  function YO(e, t) {
    (No = No || On()), (e = e || {});
    var r = t instanceof No;
    (this.objectMode = !!e.objectMode),
      r && (this.objectMode = this.objectMode || !!e.readableObjectMode);
    var i = e.highWaterMark,
      n = e.readableHighWaterMark,
      s = this.objectMode ? 16 : 16 * 1024;
    i || i === 0
      ? (this.highWaterMark = i)
      : r && (n || n === 0)
      ? (this.highWaterMark = n)
      : (this.highWaterMark = s),
      (this.highWaterMark = Math.floor(this.highWaterMark)),
      (this.buffer = new CU()),
      (this.length = 0),
      (this.pipes = null),
      (this.pipesCount = 0),
      (this.flowing = null),
      (this.ended = !1),
      (this.endEmitted = !1),
      (this.reading = !1),
      (this.sync = !0),
      (this.needReadable = !1),
      (this.emittedReadable = !1),
      (this.readableListening = !1),
      (this.resumeScheduled = !1),
      (this.destroyed = !1),
      (this.defaultEncoding = e.defaultEncoding || "utf8"),
      (this.awaitDrain = 0),
      (this.readingMore = !1),
      (this.decoder = null),
      (this.encoding = null),
      e.encoding &&
        (js || (js = w0().StringDecoder),
        (this.decoder = new js(e.encoding)),
        (this.encoding = e.encoding));
  }
  function _e(e) {
    if (((No = No || On()), !(this instanceof _e))) return new _e(e);
    (this._readableState = new YO(e, this)),
      (this.readable = !0),
      e &&
        (typeof e.read == "function" && (this._read = e.read),
        typeof e.destroy == "function" && (this._destroy = e.destroy)),
      S0.call(this);
  }
  Object.defineProperty(_e.prototype, "destroyed", {
    get: function () {
      return this._readableState === void 0
        ? !1
        : this._readableState.destroyed;
    },
    set: function (e) {
      !this._readableState || (this._readableState.destroyed = e);
    },
  });
  _e.prototype.destroy = HO.destroy;
  _e.prototype._undestroy = HO.undestroy;
  _e.prototype._destroy = function (e, t) {
    this.push(null), t(e);
  };
  _e.prototype.push = function (e, t) {
    var r = this._readableState,
      i;
    return (
      r.objectMode
        ? (i = !0)
        : typeof e == "string" &&
          ((t = t || r.defaultEncoding),
          t !== r.encoding && ((e = Io.from(e, t)), (t = "")),
          (i = !0)),
      VO(this, e, t, !1, i)
    );
  };
  _e.prototype.unshift = function (e) {
    return VO(this, e, null, !0, !1);
  };
  function VO(e, t, r, i, n) {
    var s = e._readableState;
    if (t === null) (s.reading = !1), AU(e, s);
    else {
      var a;
      n || (a = TU(s, t)),
        a
          ? e.emit("error", a)
          : s.objectMode || (t && t.length > 0)
          ? (typeof t != "string" &&
              !s.objectMode &&
              Object.getPrototypeOf(t) !== Io.prototype &&
              (t = SU(t)),
            i
              ? s.endEmitted
                ? e.emit("error", new Error("stream.unshift() after end event"))
                : E0(e, s, t, !0)
              : s.ended
              ? e.emit("error", new Error("stream.push() after EOF"))
              : ((s.reading = !1),
                s.decoder && !r
                  ? ((t = s.decoder.write(t)),
                    s.objectMode || t.length !== 0 ? E0(e, s, t, !1) : XO(e, s))
                  : E0(e, s, t, !1)))
          : i || (s.reading = !1);
    }
    return FU(s);
  }
  function E0(e, t, r, i) {
    t.flowing && t.length === 0 && !t.sync
      ? (e.emit("data", r), e.read(0))
      : ((t.length += t.objectMode ? 1 : r.length),
        i ? t.buffer.unshift(r) : t.buffer.push(r),
        t.needReadable && Oh(e)),
      XO(e, t);
  }
  function TU(e, t) {
    var r;
    return (
      !xU(t) &&
        typeof t != "string" &&
        t !== void 0 &&
        !e.objectMode &&
        (r = new TypeError("Invalid non-string/buffer chunk")),
      r
    );
  }
  function FU(e) {
    return (
      !e.ended &&
      (e.needReadable || e.length < e.highWaterMark || e.length === 0)
    );
  }
  _e.prototype.isPaused = function () {
    return this._readableState.flowing === !1;
  };
  _e.prototype.setEncoding = function (e) {
    return (
      js || (js = w0().StringDecoder),
      (this._readableState.decoder = new js(e)),
      (this._readableState.encoding = e),
      this
    );
  };
  var UO = 8388608;
  function RU(e) {
    return (
      e >= UO
        ? (e = UO)
        : (e--,
          (e |= e >>> 1),
          (e |= e >>> 2),
          (e |= e >>> 4),
          (e |= e >>> 8),
          (e |= e >>> 16),
          e++),
      e
    );
  }
  function zO(e, t) {
    return e <= 0 || (t.length === 0 && t.ended)
      ? 0
      : t.objectMode
      ? 1
      : e !== e
      ? t.flowing && t.length
        ? t.buffer.head.data.length
        : t.length
      : (e > t.highWaterMark && (t.highWaterMark = RU(e)),
        e <= t.length ? e : t.ended ? t.length : ((t.needReadable = !0), 0));
  }
  _e.prototype.read = function (e) {
    de("read", e), (e = parseInt(e, 10));
    var t = this._readableState,
      r = e;
    if (
      (e !== 0 && (t.emittedReadable = !1),
      e === 0 && t.needReadable && (t.length >= t.highWaterMark || t.ended))
    )
      return (
        de("read: emitReadable", t.length, t.ended),
        t.length === 0 && t.ended ? _0(this) : Oh(this),
        null
      );
    if (((e = zO(e, t)), e === 0 && t.ended))
      return t.length === 0 && _0(this), null;
    var i = t.needReadable;
    de("need readable", i),
      (t.length === 0 || t.length - e < t.highWaterMark) &&
        ((i = !0), de("length less than watermark", i)),
      t.ended || t.reading
        ? ((i = !1), de("reading or ended", i))
        : i &&
          (de("do read"),
          (t.reading = !0),
          (t.sync = !0),
          t.length === 0 && (t.needReadable = !0),
          this._read(t.highWaterMark),
          (t.sync = !1),
          t.reading || (e = zO(r, t)));
    var n;
    return (
      e > 0 ? (n = ZO(e, t)) : (n = null),
      n === null ? ((t.needReadable = !0), (e = 0)) : (t.length -= e),
      t.length === 0 &&
        (t.ended || (t.needReadable = !0), r !== e && t.ended && _0(this)),
      n !== null && this.emit("data", n),
      n
    );
  };
  function AU(e, t) {
    if (!t.ended) {
      if (t.decoder) {
        var r = t.decoder.end();
        r &&
          r.length &&
          (t.buffer.push(r), (t.length += t.objectMode ? 1 : r.length));
      }
      (t.ended = !0), Oh(e);
    }
  }
  function Oh(e) {
    var t = e._readableState;
    (t.needReadable = !1),
      t.emittedReadable ||
        (de("emitReadable", t.flowing),
        (t.emittedReadable = !0),
        t.sync ? Us.nextTick($O, e) : $O(e));
  }
  function $O(e) {
    de("emit readable"), e.emit("readable"), x0(e);
  }
  function XO(e, t) {
    t.readingMore || ((t.readingMore = !0), Us.nextTick(NU, e, t));
  }
  function NU(e, t) {
    for (
      var r = t.length;
      !t.reading &&
      !t.flowing &&
      !t.ended &&
      t.length < t.highWaterMark &&
      (de("maybeReadMore read 0"), e.read(0), r !== t.length);

    )
      r = t.length;
    t.readingMore = !1;
  }
  _e.prototype._read = function (e) {
    this.emit("error", new Error("_read() is not implemented"));
  };
  _e.prototype.pipe = function (e, t) {
    var r = this,
      i = this._readableState;
    switch (i.pipesCount) {
      case 0:
        i.pipes = e;
        break;
      case 1:
        i.pipes = [i.pipes, e];
        break;
      default:
        i.pipes.push(e);
        break;
    }
    (i.pipesCount += 1), de("pipe count=%d opts=%j", i.pipesCount, t);
    var n =
        (!t || t.end !== !1) && e !== process.stdout && e !== process.stderr,
      s = n ? o : S;
    i.endEmitted ? Us.nextTick(s) : r.once("end", s), e.on("unpipe", a);
    function a(O, L) {
      de("onunpipe"),
        O === r && L && L.hasUnpiped === !1 && ((L.hasUnpiped = !0), f());
    }
    function o() {
      de("onend"), e.end();
    }
    var u = IU(r);
    e.on("drain", u);
    var l = !1;
    function f() {
      de("cleanup"),
        e.removeListener("close", g),
        e.removeListener("finish", C),
        e.removeListener("drain", u),
        e.removeListener("error", d),
        e.removeListener("unpipe", a),
        r.removeListener("end", o),
        r.removeListener("end", S),
        r.removeListener("data", c),
        (l = !0),
        i.awaitDrain &&
          (!e._writableState || e._writableState.needDrain) &&
          u();
    }
    var h = !1;
    r.on("data", c);
    function c(O) {
      de("ondata"), (h = !1);
      var L = e.write(O);
      L === !1 &&
        !h &&
        (((i.pipesCount === 1 && i.pipes === e) ||
          (i.pipesCount > 1 && KO(i.pipes, e) !== -1)) &&
          !l &&
          (de("false write response, pause", r._readableState.awaitDrain),
          r._readableState.awaitDrain++,
          (h = !0)),
        r.pause());
    }
    function d(O) {
      de("onerror", O),
        S(),
        e.removeListener("error", d),
        WO(e, "error") === 0 && e.emit("error", O);
    }
    OU(e, "error", d);
    function g() {
      e.removeListener("finish", C), S();
    }
    e.once("close", g);
    function C() {
      de("onfinish"), e.removeListener("close", g), S();
    }
    e.once("finish", C);
    function S() {
      de("unpipe"), r.unpipe(e);
    }
    return e.emit("pipe", r), i.flowing || (de("pipe resume"), r.resume()), e;
  };
  function IU(e) {
    return function () {
      var t = e._readableState;
      de("pipeOnDrain", t.awaitDrain),
        t.awaitDrain && t.awaitDrain--,
        t.awaitDrain === 0 && WO(e, "data") && ((t.flowing = !0), x0(e));
    };
  }
  _e.prototype.unpipe = function (e) {
    var t = this._readableState,
      r = { hasUnpiped: !1 };
    if (t.pipesCount === 0) return this;
    if (t.pipesCount === 1)
      return e && e !== t.pipes
        ? this
        : (e || (e = t.pipes),
          (t.pipes = null),
          (t.pipesCount = 0),
          (t.flowing = !1),
          e && e.emit("unpipe", this, r),
          this);
    if (!e) {
      var i = t.pipes,
        n = t.pipesCount;
      (t.pipes = null), (t.pipesCount = 0), (t.flowing = !1);
      for (var s = 0; s < n; s++) i[s].emit("unpipe", this, r);
      return this;
    }
    var a = KO(t.pipes, e);
    return a === -1
      ? this
      : (t.pipes.splice(a, 1),
        (t.pipesCount -= 1),
        t.pipesCount === 1 && (t.pipes = t.pipes[0]),
        e.emit("unpipe", this, r),
        this);
  };
  _e.prototype.on = function (e, t) {
    var r = S0.prototype.on.call(this, e, t);
    if (e === "data") this._readableState.flowing !== !1 && this.resume();
    else if (e === "readable") {
      var i = this._readableState;
      !i.endEmitted &&
        !i.readableListening &&
        ((i.readableListening = i.needReadable = !0),
        (i.emittedReadable = !1),
        i.reading ? i.length && Oh(this) : Us.nextTick(MU, this));
    }
    return r;
  };
  _e.prototype.addListener = _e.prototype.on;
  function MU(e) {
    de("readable nexttick read 0"), e.read(0);
  }
  _e.prototype.resume = function () {
    var e = this._readableState;
    return e.flowing || (de("resume"), (e.flowing = !0), LU(this, e)), this;
  };
  function LU(e, t) {
    t.resumeScheduled || ((t.resumeScheduled = !0), Us.nextTick(qU, e, t));
  }
  function qU(e, t) {
    t.reading || (de("resume read 0"), e.read(0)),
      (t.resumeScheduled = !1),
      (t.awaitDrain = 0),
      e.emit("resume"),
      x0(e),
      t.flowing && !t.reading && e.read(0);
  }
  _e.prototype.pause = function () {
    return (
      de("call pause flowing=%j", this._readableState.flowing),
      this._readableState.flowing !== !1 &&
        (de("pause"), (this._readableState.flowing = !1), this.emit("pause")),
      this
    );
  };
  function x0(e) {
    var t = e._readableState;
    for (de("flow", t.flowing); t.flowing && e.read() !== null; );
  }
  _e.prototype.wrap = function (e) {
    var t = this,
      r = this._readableState,
      i = !1;
    e.on("end", function () {
      if ((de("wrapped end"), r.decoder && !r.ended)) {
        var a = r.decoder.end();
        a && a.length && t.push(a);
      }
      t.push(null);
    }),
      e.on("data", function (a) {
        if (
          (de("wrapped data"),
          r.decoder && (a = r.decoder.write(a)),
          !(r.objectMode && a == null) && !(!r.objectMode && (!a || !a.length)))
        ) {
          var o = t.push(a);
          o || ((i = !0), e.pause());
        }
      });
    for (var n in e)
      this[n] === void 0 &&
        typeof e[n] == "function" &&
        (this[n] = (function (a) {
          return function () {
            return e[a].apply(e, arguments);
          };
        })(n));
    for (var s = 0; s < b0.length; s++)
      e.on(b0[s], this.emit.bind(this, b0[s]));
    return (
      (this._read = function (a) {
        de("wrapped _read", a), i && ((i = !1), e.resume());
      }),
      this
    );
  };
  Object.defineProperty(_e.prototype, "readableHighWaterMark", {
    enumerable: !1,
    get: function () {
      return this._readableState.highWaterMark;
    },
  });
  _e._fromList = ZO;
  function ZO(e, t) {
    if (t.length === 0) return null;
    var r;
    return (
      t.objectMode
        ? (r = t.buffer.shift())
        : !e || e >= t.length
        ? (t.decoder
            ? (r = t.buffer.join(""))
            : t.buffer.length === 1
            ? (r = t.buffer.head.data)
            : (r = t.buffer.concat(t.length)),
          t.buffer.clear())
        : (r = PU(e, t.buffer, t.decoder)),
      r
    );
  }
  function PU(e, t, r) {
    var i;
    return (
      e < t.head.data.length
        ? ((i = t.head.data.slice(0, e)), (t.head.data = t.head.data.slice(e)))
        : e === t.head.data.length
        ? (i = t.shift())
        : (i = r ? BU(e, t) : kU(e, t)),
      i
    );
  }
  function BU(e, t) {
    var r = t.head,
      i = 1,
      n = r.data;
    for (e -= n.length; (r = r.next); ) {
      var s = r.data,
        a = e > s.length ? s.length : e;
      if (
        (a === s.length ? (n += s) : (n += s.slice(0, e)), (e -= a), e === 0)
      ) {
        a === s.length
          ? (++i, r.next ? (t.head = r.next) : (t.head = t.tail = null))
          : ((t.head = r), (r.data = s.slice(a)));
        break;
      }
      ++i;
    }
    return (t.length -= i), n;
  }
  function kU(e, t) {
    var r = Io.allocUnsafe(e),
      i = t.head,
      n = 1;
    for (i.data.copy(r), e -= i.data.length; (i = i.next); ) {
      var s = i.data,
        a = e > s.length ? s.length : e;
      if ((s.copy(r, r.length - e, 0, a), (e -= a), e === 0)) {
        a === s.length
          ? (++n, i.next ? (t.head = i.next) : (t.head = t.tail = null))
          : ((t.head = i), (i.data = s.slice(a)));
        break;
      }
      ++n;
    }
    return (t.length -= n), r;
  }
  function _0(e) {
    var t = e._readableState;
    if (t.length > 0)
      throw new Error('"endReadable()" called on non-empty stream');
    t.endEmitted || ((t.ended = !0), Us.nextTick(jU, t, e));
  }
  function jU(e, t) {
    !e.endEmitted &&
      e.length === 0 &&
      ((e.endEmitted = !0), (t.readable = !1), t.emit("end"));
  }
  function KO(e, t) {
    for (var r = 0, i = e.length; r < i; r++) if (e[r] === t) return r;
    return -1;
  }
});
var C0 = y((uee, tT) => {
  "use strict";
  tT.exports = Gr;
  var Th = On(),
    eT = Object.create(nr());
  eT.inherits = je();
  eT.inherits(Gr, Th);
  function UU(e, t) {
    var r = this._transformState;
    r.transforming = !1;
    var i = r.writecb;
    if (!i)
      return this.emit(
        "error",
        new Error("write callback called multiple times"),
      );
    (r.writechunk = null), (r.writecb = null), t != null && this.push(t), i(e);
    var n = this._readableState;
    (n.reading = !1),
      (n.needReadable || n.length < n.highWaterMark) &&
        this._read(n.highWaterMark);
  }
  function Gr(e) {
    if (!(this instanceof Gr)) return new Gr(e);
    Th.call(this, e),
      (this._transformState = {
        afterTransform: UU.bind(this),
        needTransform: !1,
        transforming: !1,
        writecb: null,
        writechunk: null,
        writeencoding: null,
      }),
      (this._readableState.needReadable = !0),
      (this._readableState.sync = !1),
      e &&
        (typeof e.transform == "function" && (this._transform = e.transform),
        typeof e.flush == "function" && (this._flush = e.flush)),
      this.on("prefinish", zU);
  }
  function zU() {
    var e = this;
    typeof this._flush == "function"
      ? this._flush(function (t, r) {
          JO(e, t, r);
        })
      : JO(this, null, null);
  }
  Gr.prototype.push = function (e, t) {
    return (
      (this._transformState.needTransform = !1),
      Th.prototype.push.call(this, e, t)
    );
  };
  Gr.prototype._transform = function (e, t, r) {
    throw new Error("_transform() is not implemented");
  };
  Gr.prototype._write = function (e, t, r) {
    var i = this._transformState;
    if (
      ((i.writecb = r),
      (i.writechunk = e),
      (i.writeencoding = t),
      !i.transforming)
    ) {
      var n = this._readableState;
      (i.needTransform || n.needReadable || n.length < n.highWaterMark) &&
        this._read(n.highWaterMark);
    }
  };
  Gr.prototype._read = function (e) {
    var t = this._transformState;
    t.writechunk !== null && t.writecb && !t.transforming
      ? ((t.transforming = !0),
        this._transform(t.writechunk, t.writeencoding, t.afterTransform))
      : (t.needTransform = !0);
  };
  Gr.prototype._destroy = function (e, t) {
    var r = this;
    Th.prototype._destroy.call(this, e, function (i) {
      t(i), r.emit("close");
    });
  };
  function JO(e, t, r) {
    if (t) return e.emit("error", t);
    if ((r != null && e.push(r), e._writableState.length))
      throw new Error("Calling transform done when ws.length != 0");
    if (e._transformState.transforming)
      throw new Error("Calling transform done when still transforming");
    return e.push(null);
  }
});
var sT = y((lee, nT) => {
  "use strict";
  nT.exports = Mo;
  var rT = C0(),
    iT = Object.create(nr());
  iT.inherits = je();
  iT.inherits(Mo, rT);
  function Mo(e) {
    if (!(this instanceof Mo)) return new Mo(e);
    rT.call(this, e);
  }
  Mo.prototype._transform = function (e, t, r) {
    r(null, e);
  };
});
var aT = y((Qe, Fh) => {
  var wr = require("stream");
  process.env.READABLE_STREAM === "disable" && wr
    ? ((Fh.exports = wr),
      (Qe = Fh.exports = wr.Readable),
      (Qe.Readable = wr.Readable),
      (Qe.Writable = wr.Writable),
      (Qe.Duplex = wr.Duplex),
      (Qe.Transform = wr.Transform),
      (Qe.PassThrough = wr.PassThrough),
      (Qe.Stream = wr))
    : ((Qe = Fh.exports = g0()),
      (Qe.Stream = wr || Qe),
      (Qe.Readable = Qe),
      (Qe.Writable = d0()),
      (Qe.Duplex = On()),
      (Qe.Transform = C0()),
      (Qe.PassThrough = sT()));
});
var uT = y((fee, oT) => {
  oT.exports = aT().PassThrough;
});
var cT = y((hee, hT) => {
  var lT = require("util"),
    Nh = uT();
  hT.exports = { Readable: Rh, Writable: Ah };
  lT.inherits(Rh, Nh);
  lT.inherits(Ah, Nh);
  function fT(e, t, r) {
    e[t] = function () {
      return (
        delete e[t], r.apply(this, arguments), this[t].apply(this, arguments)
      );
    };
  }
  function Rh(e, t) {
    if (!(this instanceof Rh)) return new Rh(e, t);
    Nh.call(this, t),
      fT(this, "_read", function () {
        var r = e.call(this, t),
          i = this.emit.bind(this, "error");
        r.on("error", i), r.pipe(this);
      }),
      this.emit("readable");
  }
  function Ah(e, t) {
    if (!(this instanceof Ah)) return new Ah(e, t);
    Nh.call(this, t),
      fT(this, "_write", function () {
        var r = e.call(this, t),
          i = this.emit.bind(this, "error");
        r.on("error", i), this.pipe(r);
      }),
      this.emit("writable");
  }
});
var O0 = y((cee, dT) => {
  /*!
   * normalize-path <https://github.com/jonschlinkert/normalize-path>
   *
   * Copyright (c) 2014-2018, Jon Schlinkert.
   * Released under the MIT License.
   */ dT.exports = function (e, t) {
    if (typeof e != "string")
      throw new TypeError("expected path to be a string");
    if (e === "\\" || e === "/") return "/";
    var r = e.length;
    if (r <= 1) return e;
    var i = "";
    if (r > 4 && e[3] === "\\") {
      var n = e[2];
      (n === "?" || n === ".") &&
        e.slice(0, 2) === "\\\\" &&
        ((e = e.slice(2)), (i = "//"));
    }
    var s = e.split(/[/\\]+/);
    return t !== !1 && s[s.length - 1] === "" && s.pop(), i + s.join("/");
  };
});
var bT = y((dee, DT) => {
  var mT = 9007199254740991,
    $U = "[object Arguments]",
    WU = "[object Function]",
    GU = "[object GeneratorFunction]",
    HU = /^(?:0|[1-9]\d*)$/;
  function gT(e, t, r) {
    switch (r.length) {
      case 0:
        return e.call(t);
      case 1:
        return e.call(t, r[0]);
      case 2:
        return e.call(t, r[0], r[1]);
      case 3:
        return e.call(t, r[0], r[1], r[2]);
    }
    return e.apply(t, r);
  }
  function YU(e, t) {
    for (var r = -1, i = Array(e); ++r < e; ) i[r] = t(r);
    return i;
  }
  var Lo = Object.prototype,
    qo = Lo.hasOwnProperty,
    yT = Lo.toString,
    VU = Lo.propertyIsEnumerable,
    pT = Math.max;
  function XU(e, t) {
    var r = sz(e) || nz(e) ? YU(e.length, String) : [],
      i = r.length,
      n = !!i;
    for (var s in e)
      (t || qo.call(e, s)) && !(n && (s == "length" || wT(s, i))) && r.push(s);
    return r;
  }
  function ZU(e, t, r, i) {
    return e === void 0 || (T0(e, Lo[r]) && !qo.call(i, r)) ? t : e;
  }
  function KU(e, t, r) {
    var i = e[t];
    (!(qo.call(e, t) && T0(i, r)) || (r === void 0 && !(t in e))) && (e[t] = r);
  }
  function QU(e) {
    if (!R0(e)) return iz(e);
    var t = rz(e),
      r = [];
    for (var i in e) (i == "constructor" && (t || !qo.call(e, i))) || r.push(i);
    return r;
  }
  function vT(e, t) {
    return (
      (t = pT(t === void 0 ? e.length - 1 : t, 0)),
      function () {
        for (
          var r = arguments, i = -1, n = pT(r.length - t, 0), s = Array(n);
          ++i < n;

        )
          s[i] = r[t + i];
        i = -1;
        for (var a = Array(t + 1); ++i < t; ) a[i] = r[i];
        return (a[t] = s), gT(e, this, a);
      }
    );
  }
  function JU(e, t, r, i) {
    r || (r = {});
    for (var n = -1, s = t.length; ++n < s; ) {
      var a = t[n],
        o = i ? i(r[a], e[a], a, r, e) : void 0;
      KU(r, a, o === void 0 ? e[a] : o);
    }
    return r;
  }
  function ez(e) {
    return vT(function (t, r) {
      var i = -1,
        n = r.length,
        s = n > 1 ? r[n - 1] : void 0,
        a = n > 2 ? r[2] : void 0;
      for (
        s = e.length > 3 && typeof s == "function" ? (n--, s) : void 0,
          a && tz(r[0], r[1], a) && ((s = n < 3 ? void 0 : s), (n = 1)),
          t = Object(t);
        ++i < n;

      ) {
        var o = r[i];
        o && e(t, o, i, s);
      }
      return t;
    });
  }
  function wT(e, t) {
    return (
      (t = t ?? mT),
      !!t &&
        (typeof e == "number" || HU.test(e)) &&
        e > -1 &&
        e % 1 == 0 &&
        e < t
    );
  }
  function tz(e, t, r) {
    if (!R0(r)) return !1;
    var i = typeof t;
    return (i == "number" ? F0(r) && wT(t, r.length) : i == "string" && t in r)
      ? T0(r[t], e)
      : !1;
  }
  function rz(e) {
    var t = e && e.constructor,
      r = (typeof t == "function" && t.prototype) || Lo;
    return e === r;
  }
  function iz(e) {
    var t = [];
    if (e != null) for (var r in Object(e)) t.push(r);
    return t;
  }
  function T0(e, t) {
    return e === t || (e !== e && t !== t);
  }
  function nz(e) {
    return (
      az(e) &&
      qo.call(e, "callee") &&
      (!VU.call(e, "callee") || yT.call(e) == $U)
    );
  }
  var sz = Array.isArray;
  function F0(e) {
    return e != null && uz(e.length) && !oz(e);
  }
  function az(e) {
    return lz(e) && F0(e);
  }
  function oz(e) {
    var t = R0(e) ? yT.call(e) : "";
    return t == WU || t == GU;
  }
  function uz(e) {
    return typeof e == "number" && e > -1 && e % 1 == 0 && e <= mT;
  }
  function R0(e) {
    var t = typeof e;
    return !!e && (t == "object" || t == "function");
  }
  function lz(e) {
    return !!e && typeof e == "object";
  }
  var fz = ez(function (e, t, r, i) {
      JU(t, cz(t), e, i);
    }),
    hz = vT(function (e) {
      return e.push(void 0, ZU), gT(fz, void 0, e);
    });
  function cz(e) {
    return F0(e) ? XU(e, !0) : QU(e);
  }
  DT.exports = hz;
});
var A0 = y((pee, ET) => {
  ET.exports = require("stream");
});
var Po = y((N0, ST) => {
  var Ih = require("buffer"),
    Hr = Ih.Buffer;
  function _T(e, t) {
    for (var r in e) t[r] = e[r];
  }
  Hr.from && Hr.alloc && Hr.allocUnsafe && Hr.allocUnsafeSlow
    ? (ST.exports = Ih)
    : (_T(Ih, N0), (N0.Buffer = zs));
  function zs(e, t, r) {
    return Hr(e, t, r);
  }
  _T(Hr, zs);
  zs.from = function (e, t, r) {
    if (typeof e == "number")
      throw new TypeError("Argument must not be a number");
    return Hr(e, t, r);
  };
  zs.alloc = function (e, t, r) {
    if (typeof e != "number") throw new TypeError("Argument must be a number");
    var i = Hr(e);
    return (
      t !== void 0
        ? typeof r == "string"
          ? i.fill(t, r)
          : i.fill(t)
        : i.fill(0),
      i
    );
  };
  zs.allocUnsafe = function (e) {
    if (typeof e != "number") throw new TypeError("Argument must be a number");
    return Hr(e);
  };
  zs.allocUnsafeSlow = function (e) {
    if (typeof e != "number") throw new TypeError("Argument must be a number");
    return Ih.SlowBuffer(e);
  };
});
var CT = y((mee, I0) => {
  "use strict";
  function dz(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  var xT = Po().Buffer,
    Bo = require("util");
  function pz(e, t, r) {
    e.copy(t, r);
  }
  I0.exports = (function () {
    function e() {
      dz(this, e), (this.head = null), (this.tail = null), (this.length = 0);
    }
    return (
      (e.prototype.push = function (r) {
        var i = { data: r, next: null };
        this.length > 0 ? (this.tail.next = i) : (this.head = i),
          (this.tail = i),
          ++this.length;
      }),
      (e.prototype.unshift = function (r) {
        var i = { data: r, next: this.head };
        this.length === 0 && (this.tail = i), (this.head = i), ++this.length;
      }),
      (e.prototype.shift = function () {
        if (this.length !== 0) {
          var r = this.head.data;
          return (
            this.length === 1
              ? (this.head = this.tail = null)
              : (this.head = this.head.next),
            --this.length,
            r
          );
        }
      }),
      (e.prototype.clear = function () {
        (this.head = this.tail = null), (this.length = 0);
      }),
      (e.prototype.join = function (r) {
        if (this.length === 0) return "";
        for (var i = this.head, n = "" + i.data; (i = i.next); )
          n += r + i.data;
        return n;
      }),
      (e.prototype.concat = function (r) {
        if (this.length === 0) return xT.alloc(0);
        if (this.length === 1) return this.head.data;
        for (var i = xT.allocUnsafe(r >>> 0), n = this.head, s = 0; n; )
          pz(n.data, i, s), (s += n.data.length), (n = n.next);
        return i;
      }),
      e
    );
  })();
  Bo &&
    Bo.inspect &&
    Bo.inspect.custom &&
    (I0.exports.prototype[Bo.inspect.custom] = function () {
      var e = Bo.inspect({ length: this.length });
      return this.constructor.name + " " + e;
    });
});
var M0 = y((gee, FT) => {
  "use strict";
  var OT = zr();
  function mz(e, t) {
    var r = this,
      i = this._readableState && this._readableState.destroyed,
      n = this._writableState && this._writableState.destroyed;
    return i || n
      ? (t
          ? t(e)
          : e &&
            (!this._writableState || !this._writableState.errorEmitted) &&
            OT.nextTick(TT, this, e),
        this)
      : (this._readableState && (this._readableState.destroyed = !0),
        this._writableState && (this._writableState.destroyed = !0),
        this._destroy(e || null, function (s) {
          !t && s
            ? (OT.nextTick(TT, r, s),
              r._writableState && (r._writableState.errorEmitted = !0))
            : t && t(s);
        }),
        this);
  }
  function gz() {
    this._readableState &&
      ((this._readableState.destroyed = !1),
      (this._readableState.reading = !1),
      (this._readableState.ended = !1),
      (this._readableState.endEmitted = !1)),
      this._writableState &&
        ((this._writableState.destroyed = !1),
        (this._writableState.ended = !1),
        (this._writableState.ending = !1),
        (this._writableState.finished = !1),
        (this._writableState.errorEmitted = !1));
  }
  function TT(e, t) {
    e.emit("error", t);
  }
  FT.exports = { destroy: mz, undestroy: gz };
});
var q0 = y((yee, PT) => {
  "use strict";
  var Tn = zr();
  PT.exports = qe;
  function AT(e) {
    var t = this;
    (this.next = null),
      (this.entry = null),
      (this.finish = function () {
        Mz(t, e);
      });
  }
  var yz =
      !process.browser &&
      ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1
        ? setImmediate
        : Tn.nextTick,
    $s;
  qe.WritableState = jo;
  var NT = Object.create(nr());
  NT.inherits = je();
  var vz = { deprecate: wf() },
    IT = A0(),
    Lh = Po().Buffer,
    wz = global.Uint8Array || function () {};
  function Dz(e) {
    return Lh.from(e);
  }
  function bz(e) {
    return Lh.isBuffer(e) || e instanceof wz;
  }
  var MT = M0();
  NT.inherits(qe, IT);
  function Ez() {}
  function jo(e, t) {
    ($s = $s || Fn()), (e = e || {});
    var r = t instanceof $s;
    (this.objectMode = !!e.objectMode),
      r && (this.objectMode = this.objectMode || !!e.writableObjectMode);
    var i = e.highWaterMark,
      n = e.writableHighWaterMark,
      s = this.objectMode ? 16 : 16 * 1024;
    i || i === 0
      ? (this.highWaterMark = i)
      : r && (n || n === 0)
      ? (this.highWaterMark = n)
      : (this.highWaterMark = s),
      (this.highWaterMark = Math.floor(this.highWaterMark)),
      (this.finalCalled = !1),
      (this.needDrain = !1),
      (this.ending = !1),
      (this.ended = !1),
      (this.finished = !1),
      (this.destroyed = !1);
    var a = e.decodeStrings === !1;
    (this.decodeStrings = !a),
      (this.defaultEncoding = e.defaultEncoding || "utf8"),
      (this.length = 0),
      (this.writing = !1),
      (this.corked = 0),
      (this.sync = !0),
      (this.bufferProcessing = !1),
      (this.onwrite = function (o) {
        Fz(t, o);
      }),
      (this.writecb = null),
      (this.writelen = 0),
      (this.bufferedRequest = null),
      (this.lastBufferedRequest = null),
      (this.pendingcb = 0),
      (this.prefinished = !1),
      (this.errorEmitted = !1),
      (this.bufferedRequestCount = 0),
      (this.corkedRequestsFree = new AT(this));
  }
  jo.prototype.getBuffer = function () {
    for (var t = this.bufferedRequest, r = []; t; ) r.push(t), (t = t.next);
    return r;
  };
  (function () {
    try {
      Object.defineProperty(jo.prototype, "buffer", {
        get: vz.deprecate(
          function () {
            return this.getBuffer();
          },
          "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.",
          "DEP0003",
        ),
      });
    } catch {}
  })();
  var Mh;
  typeof Symbol == "function" &&
  Symbol.hasInstance &&
  typeof Function.prototype[Symbol.hasInstance] == "function"
    ? ((Mh = Function.prototype[Symbol.hasInstance]),
      Object.defineProperty(qe, Symbol.hasInstance, {
        value: function (e) {
          return Mh.call(this, e)
            ? !0
            : this !== qe
            ? !1
            : e && e._writableState instanceof jo;
        },
      }))
    : (Mh = function (e) {
        return e instanceof this;
      });
  function qe(e) {
    if ((($s = $s || Fn()), !Mh.call(qe, this) && !(this instanceof $s)))
      return new qe(e);
    (this._writableState = new jo(e, this)),
      (this.writable = !0),
      e &&
        (typeof e.write == "function" && (this._write = e.write),
        typeof e.writev == "function" && (this._writev = e.writev),
        typeof e.destroy == "function" && (this._destroy = e.destroy),
        typeof e.final == "function" && (this._final = e.final)),
      IT.call(this);
  }
  qe.prototype.pipe = function () {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  function _z(e, t) {
    var r = new Error("write after end");
    e.emit("error", r), Tn.nextTick(t, r);
  }
  function Sz(e, t, r, i) {
    var n = !0,
      s = !1;
    return (
      r === null
        ? (s = new TypeError("May not write null values to stream"))
        : typeof r != "string" &&
          r !== void 0 &&
          !t.objectMode &&
          (s = new TypeError("Invalid non-string/buffer chunk")),
      s && (e.emit("error", s), Tn.nextTick(i, s), (n = !1)),
      n
    );
  }
  qe.prototype.write = function (e, t, r) {
    var i = this._writableState,
      n = !1,
      s = !i.objectMode && bz(e);
    return (
      s && !Lh.isBuffer(e) && (e = Dz(e)),
      typeof t == "function" && ((r = t), (t = null)),
      s ? (t = "buffer") : t || (t = i.defaultEncoding),
      typeof r != "function" && (r = Ez),
      i.ended
        ? _z(this, r)
        : (s || Sz(this, i, e, r)) &&
          (i.pendingcb++, (n = Cz(this, i, s, e, t, r))),
      n
    );
  };
  qe.prototype.cork = function () {
    var e = this._writableState;
    e.corked++;
  };
  qe.prototype.uncork = function () {
    var e = this._writableState;
    e.corked &&
      (e.corked--,
      !e.writing &&
        !e.corked &&
        !e.finished &&
        !e.bufferProcessing &&
        e.bufferedRequest &&
        LT(this, e));
  };
  qe.prototype.setDefaultEncoding = function (t) {
    if (
      (typeof t == "string" && (t = t.toLowerCase()),
      !(
        [
          "hex",
          "utf8",
          "utf-8",
          "ascii",
          "binary",
          "base64",
          "ucs2",
          "ucs-2",
          "utf16le",
          "utf-16le",
          "raw",
        ].indexOf((t + "").toLowerCase()) > -1
      ))
    )
      throw new TypeError("Unknown encoding: " + t);
    return (this._writableState.defaultEncoding = t), this;
  };
  function xz(e, t, r) {
    return (
      !e.objectMode &&
        e.decodeStrings !== !1 &&
        typeof t == "string" &&
        (t = Lh.from(t, r)),
      t
    );
  }
  Object.defineProperty(qe.prototype, "writableHighWaterMark", {
    enumerable: !1,
    get: function () {
      return this._writableState.highWaterMark;
    },
  });
  function Cz(e, t, r, i, n, s) {
    if (!r) {
      var a = xz(t, i, n);
      i !== a && ((r = !0), (n = "buffer"), (i = a));
    }
    var o = t.objectMode ? 1 : i.length;
    t.length += o;
    var u = t.length < t.highWaterMark;
    if ((u || (t.needDrain = !0), t.writing || t.corked)) {
      var l = t.lastBufferedRequest;
      (t.lastBufferedRequest = {
        chunk: i,
        encoding: n,
        isBuf: r,
        callback: s,
        next: null,
      }),
        l
          ? (l.next = t.lastBufferedRequest)
          : (t.bufferedRequest = t.lastBufferedRequest),
        (t.bufferedRequestCount += 1);
    } else L0(e, t, !1, o, i, n, s);
    return u;
  }
  function L0(e, t, r, i, n, s, a) {
    (t.writelen = i),
      (t.writecb = a),
      (t.writing = !0),
      (t.sync = !0),
      r ? e._writev(n, t.onwrite) : e._write(n, s, t.onwrite),
      (t.sync = !1);
  }
  function Oz(e, t, r, i, n) {
    --t.pendingcb,
      r
        ? (Tn.nextTick(n, i),
          Tn.nextTick(ko, e, t),
          (e._writableState.errorEmitted = !0),
          e.emit("error", i))
        : (n(i),
          (e._writableState.errorEmitted = !0),
          e.emit("error", i),
          ko(e, t));
  }
  function Tz(e) {
    (e.writing = !1),
      (e.writecb = null),
      (e.length -= e.writelen),
      (e.writelen = 0);
  }
  function Fz(e, t) {
    var r = e._writableState,
      i = r.sync,
      n = r.writecb;
    if ((Tz(r), t)) Oz(e, r, i, t, n);
    else {
      var s = qT(r);
      !s && !r.corked && !r.bufferProcessing && r.bufferedRequest && LT(e, r),
        i ? yz(RT, e, r, s, n) : RT(e, r, s, n);
    }
  }
  function RT(e, t, r, i) {
    r || Rz(e, t), t.pendingcb--, i(), ko(e, t);
  }
  function Rz(e, t) {
    t.length === 0 && t.needDrain && ((t.needDrain = !1), e.emit("drain"));
  }
  function LT(e, t) {
    t.bufferProcessing = !0;
    var r = t.bufferedRequest;
    if (e._writev && r && r.next) {
      var i = t.bufferedRequestCount,
        n = new Array(i),
        s = t.corkedRequestsFree;
      s.entry = r;
      for (var a = 0, o = !0; r; )
        (n[a] = r), r.isBuf || (o = !1), (r = r.next), (a += 1);
      (n.allBuffers = o),
        L0(e, t, !0, t.length, n, "", s.finish),
        t.pendingcb++,
        (t.lastBufferedRequest = null),
        s.next
          ? ((t.corkedRequestsFree = s.next), (s.next = null))
          : (t.corkedRequestsFree = new AT(t)),
        (t.bufferedRequestCount = 0);
    } else {
      for (; r; ) {
        var u = r.chunk,
          l = r.encoding,
          f = r.callback,
          h = t.objectMode ? 1 : u.length;
        if (
          (L0(e, t, !1, h, u, l, f),
          (r = r.next),
          t.bufferedRequestCount--,
          t.writing)
        )
          break;
      }
      r === null && (t.lastBufferedRequest = null);
    }
    (t.bufferedRequest = r), (t.bufferProcessing = !1);
  }
  qe.prototype._write = function (e, t, r) {
    r(new Error("_write() is not implemented"));
  };
  qe.prototype._writev = null;
  qe.prototype.end = function (e, t, r) {
    var i = this._writableState;
    typeof e == "function"
      ? ((r = e), (e = null), (t = null))
      : typeof t == "function" && ((r = t), (t = null)),
      e != null && this.write(e, t),
      i.corked && ((i.corked = 1), this.uncork()),
      !i.ending && !i.finished && Iz(this, i, r);
  };
  function qT(e) {
    return (
      e.ending &&
      e.length === 0 &&
      e.bufferedRequest === null &&
      !e.finished &&
      !e.writing
    );
  }
  function Az(e, t) {
    e._final(function (r) {
      t.pendingcb--,
        r && e.emit("error", r),
        (t.prefinished = !0),
        e.emit("prefinish"),
        ko(e, t);
    });
  }
  function Nz(e, t) {
    !t.prefinished &&
      !t.finalCalled &&
      (typeof e._final == "function"
        ? (t.pendingcb++, (t.finalCalled = !0), Tn.nextTick(Az, e, t))
        : ((t.prefinished = !0), e.emit("prefinish")));
  }
  function ko(e, t) {
    var r = qT(t);
    return (
      r &&
        (Nz(e, t), t.pendingcb === 0 && ((t.finished = !0), e.emit("finish"))),
      r
    );
  }
  function Iz(e, t, r) {
    (t.ending = !0),
      ko(e, t),
      r && (t.finished ? Tn.nextTick(r) : e.once("finish", r)),
      (t.ended = !0),
      (e.writable = !1);
  }
  function Mz(e, t, r) {
    var i = e.entry;
    for (e.entry = null; i; ) {
      var n = i.callback;
      t.pendingcb--, n(r), (i = i.next);
    }
    t.corkedRequestsFree
      ? (t.corkedRequestsFree.next = e)
      : (t.corkedRequestsFree = e);
  }
  Object.defineProperty(qe.prototype, "destroyed", {
    get: function () {
      return this._writableState === void 0
        ? !1
        : this._writableState.destroyed;
    },
    set: function (e) {
      !this._writableState || (this._writableState.destroyed = e);
    },
  });
  qe.prototype.destroy = MT.destroy;
  qe.prototype._undestroy = MT.undestroy;
  qe.prototype._destroy = function (e, t) {
    this.end(), t(e);
  };
});
var Fn = y((vee, UT) => {
  "use strict";
  var BT = zr(),
    Lz =
      Object.keys ||
      function (e) {
        var t = [];
        for (var r in e) t.push(r);
        return t;
      };
  UT.exports = Yr;
  var kT = Object.create(nr());
  kT.inherits = je();
  var jT = k0(),
    B0 = q0();
  kT.inherits(Yr, jT);
  for (P0 = Lz(B0.prototype), qh = 0; qh < P0.length; qh++)
    (Ph = P0[qh]), Yr.prototype[Ph] || (Yr.prototype[Ph] = B0.prototype[Ph]);
  var P0, Ph, qh;
  function Yr(e) {
    if (!(this instanceof Yr)) return new Yr(e);
    jT.call(this, e),
      B0.call(this, e),
      e && e.readable === !1 && (this.readable = !1),
      e && e.writable === !1 && (this.writable = !1),
      (this.allowHalfOpen = !0),
      e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1),
      this.once("end", qz);
  }
  Object.defineProperty(Yr.prototype, "writableHighWaterMark", {
    enumerable: !1,
    get: function () {
      return this._writableState.highWaterMark;
    },
  });
  function qz() {
    this.allowHalfOpen || this._writableState.ended || BT.nextTick(Pz, this);
  }
  function Pz(e) {
    e.end();
  }
  Object.defineProperty(Yr.prototype, "destroyed", {
    get: function () {
      return this._readableState === void 0 || this._writableState === void 0
        ? !1
        : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function (e) {
      this._readableState === void 0 ||
        this._writableState === void 0 ||
        ((this._readableState.destroyed = e),
        (this._writableState.destroyed = e));
    },
  });
  Yr.prototype._destroy = function (e, t) {
    this.push(null), this.end(), BT.nextTick(t, e);
  };
});
var z0 = y(($T) => {
  "use strict";
  var U0 = Po().Buffer,
    zT =
      U0.isEncoding ||
      function (e) {
        switch (((e = "" + e), e && e.toLowerCase())) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
          case "raw":
            return !0;
          default:
            return !1;
        }
      };
  function Bz(e) {
    if (!e) return "utf8";
    for (var t; ; )
      switch (e) {
        case "utf8":
        case "utf-8":
          return "utf8";
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return "utf16le";
        case "latin1":
        case "binary":
          return "latin1";
        case "base64":
        case "ascii":
        case "hex":
          return e;
        default:
          if (t) return;
          (e = ("" + e).toLowerCase()), (t = !0);
      }
  }
  function kz(e) {
    var t = Bz(e);
    if (typeof t != "string" && (U0.isEncoding === zT || !zT(e)))
      throw new Error("Unknown encoding: " + e);
    return t || e;
  }
  $T.StringDecoder = Uo;
  function Uo(e) {
    this.encoding = kz(e);
    var t;
    switch (this.encoding) {
      case "utf16le":
        (this.text = Gz), (this.end = Hz), (t = 4);
        break;
      case "utf8":
        (this.fillLast = zz), (t = 4);
        break;
      case "base64":
        (this.text = Yz), (this.end = Vz), (t = 3);
        break;
      default:
        (this.write = Xz), (this.end = Zz);
        return;
    }
    (this.lastNeed = 0),
      (this.lastTotal = 0),
      (this.lastChar = U0.allocUnsafe(t));
  }
  Uo.prototype.write = function (e) {
    if (e.length === 0) return "";
    var t, r;
    if (this.lastNeed) {
      if (((t = this.fillLast(e)), t === void 0)) return "";
      (r = this.lastNeed), (this.lastNeed = 0);
    } else r = 0;
    return r < e.length ? (t ? t + this.text(e, r) : this.text(e, r)) : t || "";
  };
  Uo.prototype.end = Wz;
  Uo.prototype.text = $z;
  Uo.prototype.fillLast = function (e) {
    if (this.lastNeed <= e.length)
      return (
        e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed),
        this.lastChar.toString(this.encoding, 0, this.lastTotal)
      );
    e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length),
      (this.lastNeed -= e.length);
  };
  function j0(e) {
    return e <= 127
      ? 0
      : e >> 5 === 6
      ? 2
      : e >> 4 === 14
      ? 3
      : e >> 3 === 30
      ? 4
      : e >> 6 === 2
      ? -1
      : -2;
  }
  function jz(e, t, r) {
    var i = t.length - 1;
    if (i < r) return 0;
    var n = j0(t[i]);
    return n >= 0
      ? (n > 0 && (e.lastNeed = n - 1), n)
      : --i < r || n === -2
      ? 0
      : ((n = j0(t[i])),
        n >= 0
          ? (n > 0 && (e.lastNeed = n - 2), n)
          : --i < r || n === -2
          ? 0
          : ((n = j0(t[i])),
            n >= 0
              ? (n > 0 && (n === 2 ? (n = 0) : (e.lastNeed = n - 3)), n)
              : 0));
  }
  function Uz(e, t, r) {
    if ((t[0] & 192) !== 128) return (e.lastNeed = 0), "\uFFFD";
    if (e.lastNeed > 1 && t.length > 1) {
      if ((t[1] & 192) !== 128) return (e.lastNeed = 1), "\uFFFD";
      if (e.lastNeed > 2 && t.length > 2 && (t[2] & 192) !== 128)
        return (e.lastNeed = 2), "\uFFFD";
    }
  }
  function zz(e) {
    var t = this.lastTotal - this.lastNeed,
      r = Uz(this, e, t);
    if (r !== void 0) return r;
    if (this.lastNeed <= e.length)
      return (
        e.copy(this.lastChar, t, 0, this.lastNeed),
        this.lastChar.toString(this.encoding, 0, this.lastTotal)
      );
    e.copy(this.lastChar, t, 0, e.length), (this.lastNeed -= e.length);
  }
  function $z(e, t) {
    var r = jz(this, e, t);
    if (!this.lastNeed) return e.toString("utf8", t);
    this.lastTotal = r;
    var i = e.length - (r - this.lastNeed);
    return e.copy(this.lastChar, 0, i), e.toString("utf8", t, i);
  }
  function Wz(e) {
    var t = e && e.length ? this.write(e) : "";
    return this.lastNeed ? t + "\uFFFD" : t;
  }
  function Gz(e, t) {
    if ((e.length - t) % 2 === 0) {
      var r = e.toString("utf16le", t);
      if (r) {
        var i = r.charCodeAt(r.length - 1);
        if (i >= 55296 && i <= 56319)
          return (
            (this.lastNeed = 2),
            (this.lastTotal = 4),
            (this.lastChar[0] = e[e.length - 2]),
            (this.lastChar[1] = e[e.length - 1]),
            r.slice(0, -1)
          );
      }
      return r;
    }
    return (
      (this.lastNeed = 1),
      (this.lastTotal = 2),
      (this.lastChar[0] = e[e.length - 1]),
      e.toString("utf16le", t, e.length - 1)
    );
  }
  function Hz(e) {
    var t = e && e.length ? this.write(e) : "";
    if (this.lastNeed) {
      var r = this.lastTotal - this.lastNeed;
      return t + this.lastChar.toString("utf16le", 0, r);
    }
    return t;
  }
  function Yz(e, t) {
    var r = (e.length - t) % 3;
    return r === 0
      ? e.toString("base64", t)
      : ((this.lastNeed = 3 - r),
        (this.lastTotal = 3),
        r === 1
          ? (this.lastChar[0] = e[e.length - 1])
          : ((this.lastChar[0] = e[e.length - 2]),
            (this.lastChar[1] = e[e.length - 1])),
        e.toString("base64", t, e.length - r));
  }
  function Vz(e) {
    var t = e && e.length ? this.write(e) : "";
    return this.lastNeed
      ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed)
      : t;
  }
  function Xz(e) {
    return e.toString(this.encoding);
  }
  function Zz(e) {
    return e && e.length ? this.write(e) : "";
  }
});
var k0 = y((bee, tF) => {
  "use strict";
  var Gs = zr();
  tF.exports = Se;
  var Kz = o0(),
    zo;
  Se.ReadableState = ZT;
  var Dee = require("events").EventEmitter,
    YT = function (e, t) {
      return e.listeners(t).length;
    },
    Y0 = A0(),
    $o = Po().Buffer,
    Qz = global.Uint8Array || function () {};
  function Jz(e) {
    return $o.from(e);
  }
  function e$(e) {
    return $o.isBuffer(e) || e instanceof Qz;
  }
  var VT = Object.create(nr());
  VT.inherits = je();
  var $0 = require("util"),
    pe = void 0;
  $0 && $0.debuglog ? (pe = $0.debuglog("stream")) : (pe = function () {});
  var t$ = CT(),
    XT = M0(),
    Ws;
  VT.inherits(Se, Y0);
  var W0 = ["error", "close", "destroy", "pause", "resume"];
  function r$(e, t, r) {
    if (typeof e.prependListener == "function") return e.prependListener(t, r);
    !e._events || !e._events[t]
      ? e.on(t, r)
      : Kz(e._events[t])
      ? e._events[t].unshift(r)
      : (e._events[t] = [r, e._events[t]]);
  }
  function ZT(e, t) {
    (zo = zo || Fn()), (e = e || {});
    var r = t instanceof zo;
    (this.objectMode = !!e.objectMode),
      r && (this.objectMode = this.objectMode || !!e.readableObjectMode);
    var i = e.highWaterMark,
      n = e.readableHighWaterMark,
      s = this.objectMode ? 16 : 16 * 1024;
    i || i === 0
      ? (this.highWaterMark = i)
      : r && (n || n === 0)
      ? (this.highWaterMark = n)
      : (this.highWaterMark = s),
      (this.highWaterMark = Math.floor(this.highWaterMark)),
      (this.buffer = new t$()),
      (this.length = 0),
      (this.pipes = null),
      (this.pipesCount = 0),
      (this.flowing = null),
      (this.ended = !1),
      (this.endEmitted = !1),
      (this.reading = !1),
      (this.sync = !0),
      (this.needReadable = !1),
      (this.emittedReadable = !1),
      (this.readableListening = !1),
      (this.resumeScheduled = !1),
      (this.destroyed = !1),
      (this.defaultEncoding = e.defaultEncoding || "utf8"),
      (this.awaitDrain = 0),
      (this.readingMore = !1),
      (this.decoder = null),
      (this.encoding = null),
      e.encoding &&
        (Ws || (Ws = z0().StringDecoder),
        (this.decoder = new Ws(e.encoding)),
        (this.encoding = e.encoding));
  }
  function Se(e) {
    if (((zo = zo || Fn()), !(this instanceof Se))) return new Se(e);
    (this._readableState = new ZT(e, this)),
      (this.readable = !0),
      e &&
        (typeof e.read == "function" && (this._read = e.read),
        typeof e.destroy == "function" && (this._destroy = e.destroy)),
      Y0.call(this);
  }
  Object.defineProperty(Se.prototype, "destroyed", {
    get: function () {
      return this._readableState === void 0
        ? !1
        : this._readableState.destroyed;
    },
    set: function (e) {
      !this._readableState || (this._readableState.destroyed = e);
    },
  });
  Se.prototype.destroy = XT.destroy;
  Se.prototype._undestroy = XT.undestroy;
  Se.prototype._destroy = function (e, t) {
    this.push(null), t(e);
  };
  Se.prototype.push = function (e, t) {
    var r = this._readableState,
      i;
    return (
      r.objectMode
        ? (i = !0)
        : typeof e == "string" &&
          ((t = t || r.defaultEncoding),
          t !== r.encoding && ((e = $o.from(e, t)), (t = "")),
          (i = !0)),
      KT(this, e, t, !1, i)
    );
  };
  Se.prototype.unshift = function (e) {
    return KT(this, e, null, !0, !1);
  };
  function KT(e, t, r, i, n) {
    var s = e._readableState;
    if (t === null) (s.reading = !1), a$(e, s);
    else {
      var a;
      n || (a = i$(s, t)),
        a
          ? e.emit("error", a)
          : s.objectMode || (t && t.length > 0)
          ? (typeof t != "string" &&
              !s.objectMode &&
              Object.getPrototypeOf(t) !== $o.prototype &&
              (t = Jz(t)),
            i
              ? s.endEmitted
                ? e.emit("error", new Error("stream.unshift() after end event"))
                : G0(e, s, t, !0)
              : s.ended
              ? e.emit("error", new Error("stream.push() after EOF"))
              : ((s.reading = !1),
                s.decoder && !r
                  ? ((t = s.decoder.write(t)),
                    s.objectMode || t.length !== 0 ? G0(e, s, t, !1) : QT(e, s))
                  : G0(e, s, t, !1)))
          : i || (s.reading = !1);
    }
    return n$(s);
  }
  function G0(e, t, r, i) {
    t.flowing && t.length === 0 && !t.sync
      ? (e.emit("data", r), e.read(0))
      : ((t.length += t.objectMode ? 1 : r.length),
        i ? t.buffer.unshift(r) : t.buffer.push(r),
        t.needReadable && Bh(e)),
      QT(e, t);
  }
  function i$(e, t) {
    var r;
    return (
      !e$(t) &&
        typeof t != "string" &&
        t !== void 0 &&
        !e.objectMode &&
        (r = new TypeError("Invalid non-string/buffer chunk")),
      r
    );
  }
  function n$(e) {
    return (
      !e.ended &&
      (e.needReadable || e.length < e.highWaterMark || e.length === 0)
    );
  }
  Se.prototype.isPaused = function () {
    return this._readableState.flowing === !1;
  };
  Se.prototype.setEncoding = function (e) {
    return (
      Ws || (Ws = z0().StringDecoder),
      (this._readableState.decoder = new Ws(e)),
      (this._readableState.encoding = e),
      this
    );
  };
  var WT = 8388608;
  function s$(e) {
    return (
      e >= WT
        ? (e = WT)
        : (e--,
          (e |= e >>> 1),
          (e |= e >>> 2),
          (e |= e >>> 4),
          (e |= e >>> 8),
          (e |= e >>> 16),
          e++),
      e
    );
  }
  function GT(e, t) {
    return e <= 0 || (t.length === 0 && t.ended)
      ? 0
      : t.objectMode
      ? 1
      : e !== e
      ? t.flowing && t.length
        ? t.buffer.head.data.length
        : t.length
      : (e > t.highWaterMark && (t.highWaterMark = s$(e)),
        e <= t.length ? e : t.ended ? t.length : ((t.needReadable = !0), 0));
  }
  Se.prototype.read = function (e) {
    pe("read", e), (e = parseInt(e, 10));
    var t = this._readableState,
      r = e;
    if (
      (e !== 0 && (t.emittedReadable = !1),
      e === 0 && t.needReadable && (t.length >= t.highWaterMark || t.ended))
    )
      return (
        pe("read: emitReadable", t.length, t.ended),
        t.length === 0 && t.ended ? H0(this) : Bh(this),
        null
      );
    if (((e = GT(e, t)), e === 0 && t.ended))
      return t.length === 0 && H0(this), null;
    var i = t.needReadable;
    pe("need readable", i),
      (t.length === 0 || t.length - e < t.highWaterMark) &&
        ((i = !0), pe("length less than watermark", i)),
      t.ended || t.reading
        ? ((i = !1), pe("reading or ended", i))
        : i &&
          (pe("do read"),
          (t.reading = !0),
          (t.sync = !0),
          t.length === 0 && (t.needReadable = !0),
          this._read(t.highWaterMark),
          (t.sync = !1),
          t.reading || (e = GT(r, t)));
    var n;
    return (
      e > 0 ? (n = JT(e, t)) : (n = null),
      n === null ? ((t.needReadable = !0), (e = 0)) : (t.length -= e),
      t.length === 0 &&
        (t.ended || (t.needReadable = !0), r !== e && t.ended && H0(this)),
      n !== null && this.emit("data", n),
      n
    );
  };
  function a$(e, t) {
    if (!t.ended) {
      if (t.decoder) {
        var r = t.decoder.end();
        r &&
          r.length &&
          (t.buffer.push(r), (t.length += t.objectMode ? 1 : r.length));
      }
      (t.ended = !0), Bh(e);
    }
  }
  function Bh(e) {
    var t = e._readableState;
    (t.needReadable = !1),
      t.emittedReadable ||
        (pe("emitReadable", t.flowing),
        (t.emittedReadable = !0),
        t.sync ? Gs.nextTick(HT, e) : HT(e));
  }
  function HT(e) {
    pe("emit readable"), e.emit("readable"), V0(e);
  }
  function QT(e, t) {
    t.readingMore || ((t.readingMore = !0), Gs.nextTick(o$, e, t));
  }
  function o$(e, t) {
    for (
      var r = t.length;
      !t.reading &&
      !t.flowing &&
      !t.ended &&
      t.length < t.highWaterMark &&
      (pe("maybeReadMore read 0"), e.read(0), r !== t.length);

    )
      r = t.length;
    t.readingMore = !1;
  }
  Se.prototype._read = function (e) {
    this.emit("error", new Error("_read() is not implemented"));
  };
  Se.prototype.pipe = function (e, t) {
    var r = this,
      i = this._readableState;
    switch (i.pipesCount) {
      case 0:
        i.pipes = e;
        break;
      case 1:
        i.pipes = [i.pipes, e];
        break;
      default:
        i.pipes.push(e);
        break;
    }
    (i.pipesCount += 1), pe("pipe count=%d opts=%j", i.pipesCount, t);
    var n =
        (!t || t.end !== !1) && e !== process.stdout && e !== process.stderr,
      s = n ? o : S;
    i.endEmitted ? Gs.nextTick(s) : r.once("end", s), e.on("unpipe", a);
    function a(O, L) {
      pe("onunpipe"),
        O === r && L && L.hasUnpiped === !1 && ((L.hasUnpiped = !0), f());
    }
    function o() {
      pe("onend"), e.end();
    }
    var u = u$(r);
    e.on("drain", u);
    var l = !1;
    function f() {
      pe("cleanup"),
        e.removeListener("close", g),
        e.removeListener("finish", C),
        e.removeListener("drain", u),
        e.removeListener("error", d),
        e.removeListener("unpipe", a),
        r.removeListener("end", o),
        r.removeListener("end", S),
        r.removeListener("data", c),
        (l = !0),
        i.awaitDrain &&
          (!e._writableState || e._writableState.needDrain) &&
          u();
    }
    var h = !1;
    r.on("data", c);
    function c(O) {
      pe("ondata"), (h = !1);
      var L = e.write(O);
      L === !1 &&
        !h &&
        (((i.pipesCount === 1 && i.pipes === e) ||
          (i.pipesCount > 1 && eF(i.pipes, e) !== -1)) &&
          !l &&
          (pe("false write response, pause", r._readableState.awaitDrain),
          r._readableState.awaitDrain++,
          (h = !0)),
        r.pause());
    }
    function d(O) {
      pe("onerror", O),
        S(),
        e.removeListener("error", d),
        YT(e, "error") === 0 && e.emit("error", O);
    }
    r$(e, "error", d);
    function g() {
      e.removeListener("finish", C), S();
    }
    e.once("close", g);
    function C() {
      pe("onfinish"), e.removeListener("close", g), S();
    }
    e.once("finish", C);
    function S() {
      pe("unpipe"), r.unpipe(e);
    }
    return e.emit("pipe", r), i.flowing || (pe("pipe resume"), r.resume()), e;
  };
  function u$(e) {
    return function () {
      var t = e._readableState;
      pe("pipeOnDrain", t.awaitDrain),
        t.awaitDrain && t.awaitDrain--,
        t.awaitDrain === 0 && YT(e, "data") && ((t.flowing = !0), V0(e));
    };
  }
  Se.prototype.unpipe = function (e) {
    var t = this._readableState,
      r = { hasUnpiped: !1 };
    if (t.pipesCount === 0) return this;
    if (t.pipesCount === 1)
      return e && e !== t.pipes
        ? this
        : (e || (e = t.pipes),
          (t.pipes = null),
          (t.pipesCount = 0),
          (t.flowing = !1),
          e && e.emit("unpipe", this, r),
          this);
    if (!e) {
      var i = t.pipes,
        n = t.pipesCount;
      (t.pipes = null), (t.pipesCount = 0), (t.flowing = !1);
      for (var s = 0; s < n; s++) i[s].emit("unpipe", this, r);
      return this;
    }
    var a = eF(t.pipes, e);
    return a === -1
      ? this
      : (t.pipes.splice(a, 1),
        (t.pipesCount -= 1),
        t.pipesCount === 1 && (t.pipes = t.pipes[0]),
        e.emit("unpipe", this, r),
        this);
  };
  Se.prototype.on = function (e, t) {
    var r = Y0.prototype.on.call(this, e, t);
    if (e === "data") this._readableState.flowing !== !1 && this.resume();
    else if (e === "readable") {
      var i = this._readableState;
      !i.endEmitted &&
        !i.readableListening &&
        ((i.readableListening = i.needReadable = !0),
        (i.emittedReadable = !1),
        i.reading ? i.length && Bh(this) : Gs.nextTick(l$, this));
    }
    return r;
  };
  Se.prototype.addListener = Se.prototype.on;
  function l$(e) {
    pe("readable nexttick read 0"), e.read(0);
  }
  Se.prototype.resume = function () {
    var e = this._readableState;
    return e.flowing || (pe("resume"), (e.flowing = !0), f$(this, e)), this;
  };
  function f$(e, t) {
    t.resumeScheduled || ((t.resumeScheduled = !0), Gs.nextTick(h$, e, t));
  }
  function h$(e, t) {
    t.reading || (pe("resume read 0"), e.read(0)),
      (t.resumeScheduled = !1),
      (t.awaitDrain = 0),
      e.emit("resume"),
      V0(e),
      t.flowing && !t.reading && e.read(0);
  }
  Se.prototype.pause = function () {
    return (
      pe("call pause flowing=%j", this._readableState.flowing),
      this._readableState.flowing !== !1 &&
        (pe("pause"), (this._readableState.flowing = !1), this.emit("pause")),
      this
    );
  };
  function V0(e) {
    var t = e._readableState;
    for (pe("flow", t.flowing); t.flowing && e.read() !== null; );
  }
  Se.prototype.wrap = function (e) {
    var t = this,
      r = this._readableState,
      i = !1;
    e.on("end", function () {
      if ((pe("wrapped end"), r.decoder && !r.ended)) {
        var a = r.decoder.end();
        a && a.length && t.push(a);
      }
      t.push(null);
    }),
      e.on("data", function (a) {
        if (
          (pe("wrapped data"),
          r.decoder && (a = r.decoder.write(a)),
          !(r.objectMode && a == null) && !(!r.objectMode && (!a || !a.length)))
        ) {
          var o = t.push(a);
          o || ((i = !0), e.pause());
        }
      });
    for (var n in e)
      this[n] === void 0 &&
        typeof e[n] == "function" &&
        (this[n] = (function (a) {
          return function () {
            return e[a].apply(e, arguments);
          };
        })(n));
    for (var s = 0; s < W0.length; s++)
      e.on(W0[s], this.emit.bind(this, W0[s]));
    return (
      (this._read = function (a) {
        pe("wrapped _read", a), i && ((i = !1), e.resume());
      }),
      this
    );
  };
  Object.defineProperty(Se.prototype, "readableHighWaterMark", {
    enumerable: !1,
    get: function () {
      return this._readableState.highWaterMark;
    },
  });
  Se._fromList = JT;
  function JT(e, t) {
    if (t.length === 0) return null;
    var r;
    return (
      t.objectMode
        ? (r = t.buffer.shift())
        : !e || e >= t.length
        ? (t.decoder
            ? (r = t.buffer.join(""))
            : t.buffer.length === 1
            ? (r = t.buffer.head.data)
            : (r = t.buffer.concat(t.length)),
          t.buffer.clear())
        : (r = c$(e, t.buffer, t.decoder)),
      r
    );
  }
  function c$(e, t, r) {
    var i;
    return (
      e < t.head.data.length
        ? ((i = t.head.data.slice(0, e)), (t.head.data = t.head.data.slice(e)))
        : e === t.head.data.length
        ? (i = t.shift())
        : (i = r ? d$(e, t) : p$(e, t)),
      i
    );
  }
  function d$(e, t) {
    var r = t.head,
      i = 1,
      n = r.data;
    for (e -= n.length; (r = r.next); ) {
      var s = r.data,
        a = e > s.length ? s.length : e;
      if (
        (a === s.length ? (n += s) : (n += s.slice(0, e)), (e -= a), e === 0)
      ) {
        a === s.length
          ? (++i, r.next ? (t.head = r.next) : (t.head = t.tail = null))
          : ((t.head = r), (r.data = s.slice(a)));
        break;
      }
      ++i;
    }
    return (t.length -= i), n;
  }
  function p$(e, t) {
    var r = $o.allocUnsafe(e),
      i = t.head,
      n = 1;
    for (i.data.copy(r), e -= i.data.length; (i = i.next); ) {
      var s = i.data,
        a = e > s.length ? s.length : e;
      if ((s.copy(r, r.length - e, 0, a), (e -= a), e === 0)) {
        a === s.length
          ? (++n, i.next ? (t.head = i.next) : (t.head = t.tail = null))
          : ((t.head = i), (i.data = s.slice(a)));
        break;
      }
      ++n;
    }
    return (t.length -= n), r;
  }
  function H0(e) {
    var t = e._readableState;
    if (t.length > 0)
      throw new Error('"endReadable()" called on non-empty stream');
    t.endEmitted || ((t.ended = !0), Gs.nextTick(m$, t, e));
  }
  function m$(e, t) {
    !e.endEmitted &&
      e.length === 0 &&
      ((e.endEmitted = !0), (t.readable = !1), t.emit("end"));
  }
  function eF(e, t) {
    for (var r = 0, i = e.length; r < i; r++) if (e[r] === t) return r;
    return -1;
  }
});
var X0 = y((Eee, nF) => {
  "use strict";
  nF.exports = Vr;
  var kh = Fn(),
    iF = Object.create(nr());
  iF.inherits = je();
  iF.inherits(Vr, kh);
  function g$(e, t) {
    var r = this._transformState;
    r.transforming = !1;
    var i = r.writecb;
    if (!i)
      return this.emit(
        "error",
        new Error("write callback called multiple times"),
      );
    (r.writechunk = null), (r.writecb = null), t != null && this.push(t), i(e);
    var n = this._readableState;
    (n.reading = !1),
      (n.needReadable || n.length < n.highWaterMark) &&
        this._read(n.highWaterMark);
  }
  function Vr(e) {
    if (!(this instanceof Vr)) return new Vr(e);
    kh.call(this, e),
      (this._transformState = {
        afterTransform: g$.bind(this),
        needTransform: !1,
        transforming: !1,
        writecb: null,
        writechunk: null,
        writeencoding: null,
      }),
      (this._readableState.needReadable = !0),
      (this._readableState.sync = !1),
      e &&
        (typeof e.transform == "function" && (this._transform = e.transform),
        typeof e.flush == "function" && (this._flush = e.flush)),
      this.on("prefinish", y$);
  }
  function y$() {
    var e = this;
    typeof this._flush == "function"
      ? this._flush(function (t, r) {
          rF(e, t, r);
        })
      : rF(this, null, null);
  }
  Vr.prototype.push = function (e, t) {
    return (
      (this._transformState.needTransform = !1),
      kh.prototype.push.call(this, e, t)
    );
  };
  Vr.prototype._transform = function (e, t, r) {
    throw new Error("_transform() is not implemented");
  };
  Vr.prototype._write = function (e, t, r) {
    var i = this._transformState;
    if (
      ((i.writecb = r),
      (i.writechunk = e),
      (i.writeencoding = t),
      !i.transforming)
    ) {
      var n = this._readableState;
      (i.needTransform || n.needReadable || n.length < n.highWaterMark) &&
        this._read(n.highWaterMark);
    }
  };
  Vr.prototype._read = function (e) {
    var t = this._transformState;
    t.writechunk !== null && t.writecb && !t.transforming
      ? ((t.transforming = !0),
        this._transform(t.writechunk, t.writeencoding, t.afterTransform))
      : (t.needTransform = !0);
  };
  Vr.prototype._destroy = function (e, t) {
    var r = this;
    kh.prototype._destroy.call(this, e, function (i) {
      t(i), r.emit("close");
    });
  };
  function rF(e, t, r) {
    if (t) return e.emit("error", t);
    if ((r != null && e.push(r), e._writableState.length))
      throw new Error("Calling transform done when ws.length != 0");
    if (e._transformState.transforming)
      throw new Error("Calling transform done when still transforming");
    return e.push(null);
  }
});
var uF = y((_ee, oF) => {
  "use strict";
  oF.exports = Wo;
  var sF = X0(),
    aF = Object.create(nr());
  aF.inherits = je();
  aF.inherits(Wo, sF);
  function Wo(e) {
    if (!(this instanceof Wo)) return new Wo(e);
    sF.call(this, e);
  }
  Wo.prototype._transform = function (e, t, r) {
    r(null, e);
  };
});
var lF = y((Je, jh) => {
  var Dr = require("stream");
  process.env.READABLE_STREAM === "disable" && Dr
    ? ((jh.exports = Dr),
      (Je = jh.exports = Dr.Readable),
      (Je.Readable = Dr.Readable),
      (Je.Writable = Dr.Writable),
      (Je.Duplex = Dr.Duplex),
      (Je.Transform = Dr.Transform),
      (Je.PassThrough = Dr.PassThrough),
      (Je.Stream = Dr))
    : ((Je = jh.exports = k0()),
      (Je.Stream = Dr || Je),
      (Je.Readable = Je),
      (Je.Writable = q0()),
      (Je.Duplex = Fn()),
      (Je.Transform = X0()),
      (Je.PassThrough = uF()));
});
var mF = y((See, pF) => {
  var v$ = 9007199254740991,
    w$ = "[object Arguments]",
    D$ = "[object Function]",
    b$ = "[object GeneratorFunction]",
    E$ =
      typeof global == "object" && global && global.Object === Object && global,
    _$ = typeof self == "object" && self && self.Object === Object && self,
    S$ = E$ || _$ || Function("return this")();
  function x$(e, t) {
    for (var r = -1, i = t.length, n = e.length; ++r < i; ) e[n + r] = t[r];
    return e;
  }
  var Z0 = Object.prototype,
    C$ = Z0.hasOwnProperty,
    cF = Z0.toString,
    fF = S$.Symbol,
    O$ = Z0.propertyIsEnumerable,
    hF = fF ? fF.isConcatSpreadable : void 0;
  function dF(e, t, r, i, n) {
    var s = -1,
      a = e.length;
    for (r || (r = T$), n || (n = []); ++s < a; ) {
      var o = e[s];
      t > 0 && r(o)
        ? t > 1
          ? dF(o, t - 1, r, i, n)
          : x$(n, o)
        : i || (n[n.length] = o);
    }
    return n;
  }
  function T$(e) {
    return A$(e) || R$(e) || !!(hF && e && e[hF]);
  }
  function F$(e) {
    var t = e ? e.length : 0;
    return t ? dF(e, 1) : [];
  }
  function R$(e) {
    return (
      I$(e) &&
      C$.call(e, "callee") &&
      (!O$.call(e, "callee") || cF.call(e) == w$)
    );
  }
  var A$ = Array.isArray;
  function N$(e) {
    return e != null && L$(e.length) && !M$(e);
  }
  function I$(e) {
    return P$(e) && N$(e);
  }
  function M$(e) {
    var t = q$(e) ? cF.call(e) : "";
    return t == D$ || t == b$;
  }
  function L$(e) {
    return typeof e == "number" && e > -1 && e % 1 == 0 && e <= v$;
  }
  function q$(e) {
    var t = typeof e;
    return !!e && (t == "object" || t == "function");
  }
  function P$(e) {
    return !!e && typeof e == "object";
  }
  pF.exports = F$;
});
var OF = y((xee, CF) => {
  var B$ = 200,
    J0 = "__lodash_hash_undefined__",
    k$ = 9007199254740991,
    j$ = "[object Arguments]",
    U$ = "[object Function]",
    z$ = "[object GeneratorFunction]",
    $$ = /[\\^$.*+?()[\]{}|]/g,
    W$ = /^\[object .+?Constructor\]$/,
    G$ =
      typeof global == "object" && global && global.Object === Object && global,
    H$ = typeof self == "object" && self && self.Object === Object && self,
    ey = G$ || H$ || Function("return this")();
  function Y$(e, t, r) {
    switch (r.length) {
      case 0:
        return e.call(t);
      case 1:
        return e.call(t, r[0]);
      case 2:
        return e.call(t, r[0], r[1]);
      case 3:
        return e.call(t, r[0], r[1], r[2]);
    }
    return e.apply(t, r);
  }
  function V$(e, t) {
    var r = e ? e.length : 0;
    return !!r && J$(e, t, 0) > -1;
  }
  function X$(e, t, r) {
    for (var i = -1, n = e ? e.length : 0; ++i < n; ) if (r(t, e[i])) return !0;
    return !1;
  }
  function Z$(e, t) {
    for (var r = -1, i = e ? e.length : 0, n = Array(i); ++r < i; )
      n[r] = t(e[r], r, e);
    return n;
  }
  function K$(e, t) {
    for (var r = -1, i = t.length, n = e.length; ++r < i; ) e[n + r] = t[r];
    return e;
  }
  function Q$(e, t, r, i) {
    for (var n = e.length, s = r + (i ? 1 : -1); i ? s-- : ++s < n; )
      if (t(e[s], s, e)) return s;
    return -1;
  }
  function J$(e, t, r) {
    if (t !== t) return Q$(e, eW, r);
    for (var i = r - 1, n = e.length; ++i < n; ) if (e[i] === t) return i;
    return -1;
  }
  function eW(e) {
    return e !== e;
  }
  function tW(e) {
    return function (t) {
      return e(t);
    };
  }
  function rW(e, t) {
    return e.has(t);
  }
  function iW(e, t) {
    return e?.[t];
  }
  function nW(e) {
    var t = !1;
    if (e != null && typeof e.toString != "function")
      try {
        t = !!(e + "");
      } catch {}
    return t;
  }
  var sW = Array.prototype,
    aW = Function.prototype,
    ty = Object.prototype,
    K0 = ey["__core-js_shared__"],
    gF = (function () {
      var e = /[^.]+$/.exec((K0 && K0.keys && K0.keys.IE_PROTO) || "");
      return e ? "Symbol(src)_1." + e : "";
    })(),
    DF = aW.toString,
    zh = ty.hasOwnProperty,
    bF = ty.toString,
    oW = RegExp(
      "^" +
        DF.call(zh)
          .replace($$, "\\$&")
          .replace(
            /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
            "$1.*?",
          ) +
        "$",
    ),
    yF = ey.Symbol,
    uW = ty.propertyIsEnumerable,
    lW = sW.splice,
    vF = yF ? yF.isConcatSpreadable : void 0,
    wF = Math.max,
    fW = _F(ey, "Map"),
    Go = _F(Object, "create");
  function Rn(e) {
    var t = -1,
      r = e ? e.length : 0;
    for (this.clear(); ++t < r; ) {
      var i = e[t];
      this.set(i[0], i[1]);
    }
  }
  function hW() {
    this.__data__ = Go ? Go(null) : {};
  }
  function cW(e) {
    return this.has(e) && delete this.__data__[e];
  }
  function dW(e) {
    var t = this.__data__;
    if (Go) {
      var r = t[e];
      return r === J0 ? void 0 : r;
    }
    return zh.call(t, e) ? t[e] : void 0;
  }
  function pW(e) {
    var t = this.__data__;
    return Go ? t[e] !== void 0 : zh.call(t, e);
  }
  function mW(e, t) {
    var r = this.__data__;
    return (r[e] = Go && t === void 0 ? J0 : t), this;
  }
  Rn.prototype.clear = hW;
  Rn.prototype.delete = cW;
  Rn.prototype.get = dW;
  Rn.prototype.has = pW;
  Rn.prototype.set = mW;
  function Hs(e) {
    var t = -1,
      r = e ? e.length : 0;
    for (this.clear(); ++t < r; ) {
      var i = e[t];
      this.set(i[0], i[1]);
    }
  }
  function gW() {
    this.__data__ = [];
  }
  function yW(e) {
    var t = this.__data__,
      r = $h(t, e);
    if (r < 0) return !1;
    var i = t.length - 1;
    return r == i ? t.pop() : lW.call(t, r, 1), !0;
  }
  function vW(e) {
    var t = this.__data__,
      r = $h(t, e);
    return r < 0 ? void 0 : t[r][1];
  }
  function wW(e) {
    return $h(this.__data__, e) > -1;
  }
  function DW(e, t) {
    var r = this.__data__,
      i = $h(r, e);
    return i < 0 ? r.push([e, t]) : (r[i][1] = t), this;
  }
  Hs.prototype.clear = gW;
  Hs.prototype.delete = yW;
  Hs.prototype.get = vW;
  Hs.prototype.has = wW;
  Hs.prototype.set = DW;
  function Ys(e) {
    var t = -1,
      r = e ? e.length : 0;
    for (this.clear(); ++t < r; ) {
      var i = e[t];
      this.set(i[0], i[1]);
    }
  }
  function bW() {
    this.__data__ = { hash: new Rn(), map: new (fW || Hs)(), string: new Rn() };
  }
  function EW(e) {
    return Wh(this, e).delete(e);
  }
  function _W(e) {
    return Wh(this, e).get(e);
  }
  function SW(e) {
    return Wh(this, e).has(e);
  }
  function xW(e, t) {
    return Wh(this, e).set(e, t), this;
  }
  Ys.prototype.clear = bW;
  Ys.prototype.delete = EW;
  Ys.prototype.get = _W;
  Ys.prototype.has = SW;
  Ys.prototype.set = xW;
  function Uh(e) {
    var t = -1,
      r = e ? e.length : 0;
    for (this.__data__ = new Ys(); ++t < r; ) this.add(e[t]);
  }
  function CW(e) {
    return this.__data__.set(e, J0), this;
  }
  function OW(e) {
    return this.__data__.has(e);
  }
  Uh.prototype.add = Uh.prototype.push = CW;
  Uh.prototype.has = OW;
  function $h(e, t) {
    for (var r = e.length; r--; ) if (qW(e[r][0], t)) return r;
    return -1;
  }
  function TW(e, t, r, i) {
    var n = -1,
      s = V$,
      a = !0,
      o = e.length,
      u = [],
      l = t.length;
    if (!o) return u;
    r && (t = Z$(t, tW(r))),
      i
        ? ((s = X$), (a = !1))
        : t.length >= B$ && ((s = rW), (a = !1), (t = new Uh(t)));
    e: for (; ++n < o; ) {
      var f = e[n],
        h = r ? r(f) : f;
      if (((f = i || f !== 0 ? f : 0), a && h === h)) {
        for (var c = l; c--; ) if (t[c] === h) continue e;
        u.push(f);
      } else s(t, h, i) || u.push(f);
    }
    return u;
  }
  function EF(e, t, r, i, n) {
    var s = -1,
      a = e.length;
    for (r || (r = AW), n || (n = []); ++s < a; ) {
      var o = e[s];
      t > 0 && r(o)
        ? t > 1
          ? EF(o, t - 1, r, i, n)
          : K$(n, o)
        : i || (n[n.length] = o);
    }
    return n;
  }
  function FW(e) {
    if (!xF(e) || IW(e)) return !1;
    var t = SF(e) || nW(e) ? oW : W$;
    return t.test(MW(e));
  }
  function RW(e, t) {
    return (
      (t = wF(t === void 0 ? e.length - 1 : t, 0)),
      function () {
        for (
          var r = arguments, i = -1, n = wF(r.length - t, 0), s = Array(n);
          ++i < n;

        )
          s[i] = r[t + i];
        i = -1;
        for (var a = Array(t + 1); ++i < t; ) a[i] = r[i];
        return (a[t] = s), Y$(e, this, a);
      }
    );
  }
  function Wh(e, t) {
    var r = e.__data__;
    return NW(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
  }
  function _F(e, t) {
    var r = iW(e, t);
    return FW(r) ? r : void 0;
  }
  function AW(e) {
    return BW(e) || PW(e) || !!(vF && e && e[vF]);
  }
  function NW(e) {
    var t = typeof e;
    return t == "string" || t == "number" || t == "symbol" || t == "boolean"
      ? e !== "__proto__"
      : e === null;
  }
  function IW(e) {
    return !!gF && gF in e;
  }
  function MW(e) {
    if (e != null) {
      try {
        return DF.call(e);
      } catch {}
      try {
        return e + "";
      } catch {}
    }
    return "";
  }
  var LW = RW(function (e, t) {
    return Q0(e) ? TW(e, EF(t, 1, Q0, !0)) : [];
  });
  function qW(e, t) {
    return e === t || (e !== e && t !== t);
  }
  function PW(e) {
    return (
      Q0(e) &&
      zh.call(e, "callee") &&
      (!uW.call(e, "callee") || bF.call(e) == j$)
    );
  }
  var BW = Array.isArray;
  function kW(e) {
    return e != null && jW(e.length) && !SF(e);
  }
  function Q0(e) {
    return UW(e) && kW(e);
  }
  function SF(e) {
    var t = xF(e) ? bF.call(e) : "";
    return t == U$ || t == z$;
  }
  function jW(e) {
    return typeof e == "number" && e > -1 && e % 1 == 0 && e <= k$;
  }
  function xF(e) {
    var t = typeof e;
    return !!e && (t == "object" || t == "function");
  }
  function UW(e) {
    return !!e && typeof e == "object";
  }
  CF.exports = LW;
});
var jF = y((Cee, kF) => {
  var zW = 200,
    ny = "__lodash_hash_undefined__",
    $W = 1 / 0,
    WW = 9007199254740991,
    GW = "[object Arguments]",
    HW = "[object Function]",
    YW = "[object GeneratorFunction]",
    VW = /[\\^$.*+?()[\]{}|]/g,
    XW = /^\[object .+?Constructor\]$/,
    ZW =
      typeof global == "object" && global && global.Object === Object && global,
    KW = typeof self == "object" && self && self.Object === Object && self,
    Hh = ZW || KW || Function("return this")();
  function QW(e, t, r) {
    switch (r.length) {
      case 0:
        return e.call(t);
      case 1:
        return e.call(t, r[0]);
      case 2:
        return e.call(t, r[0], r[1]);
      case 3:
        return e.call(t, r[0], r[1], r[2]);
    }
    return e.apply(t, r);
  }
  function JW(e, t) {
    var r = e ? e.length : 0;
    return !!r && iG(e, t, 0) > -1;
  }
  function eG(e, t, r) {
    for (var i = -1, n = e ? e.length : 0; ++i < n; ) if (r(t, e[i])) return !0;
    return !1;
  }
  function tG(e, t) {
    for (var r = -1, i = t.length, n = e.length; ++r < i; ) e[n + r] = t[r];
    return e;
  }
  function rG(e, t, r, i) {
    for (var n = e.length, s = r + (i ? 1 : -1); i ? s-- : ++s < n; )
      if (t(e[s], s, e)) return s;
    return -1;
  }
  function iG(e, t, r) {
    if (t !== t) return rG(e, nG, r);
    for (var i = r - 1, n = e.length; ++i < n; ) if (e[i] === t) return i;
    return -1;
  }
  function nG(e) {
    return e !== e;
  }
  function sG(e, t) {
    return e.has(t);
  }
  function aG(e, t) {
    return e?.[t];
  }
  function oG(e) {
    var t = !1;
    if (e != null && typeof e.toString != "function")
      try {
        t = !!(e + "");
      } catch {}
    return t;
  }
  function NF(e) {
    var t = -1,
      r = Array(e.size);
    return (
      e.forEach(function (i) {
        r[++t] = i;
      }),
      r
    );
  }
  var uG = Array.prototype,
    lG = Function.prototype,
    sy = Object.prototype,
    ry = Hh["__core-js_shared__"],
    TF = (function () {
      var e = /[^.]+$/.exec((ry && ry.keys && ry.keys.IE_PROTO) || "");
      return e ? "Symbol(src)_1." + e : "";
    })(),
    IF = lG.toString,
    Yh = sy.hasOwnProperty,
    MF = sy.toString,
    fG = RegExp(
      "^" +
        IF.call(Yh)
          .replace(VW, "\\$&")
          .replace(
            /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
            "$1.*?",
          ) +
        "$",
    ),
    FF = Hh.Symbol,
    hG = sy.propertyIsEnumerable,
    cG = uG.splice,
    RF = FF ? FF.isConcatSpreadable : void 0,
    AF = Math.max,
    dG = ay(Hh, "Map"),
    iy = ay(Hh, "Set"),
    Ho = ay(Object, "create");
  function An(e) {
    var t = -1,
      r = e ? e.length : 0;
    for (this.clear(); ++t < r; ) {
      var i = e[t];
      this.set(i[0], i[1]);
    }
  }
  function pG() {
    this.__data__ = Ho ? Ho(null) : {};
  }
  function mG(e) {
    return this.has(e) && delete this.__data__[e];
  }
  function gG(e) {
    var t = this.__data__;
    if (Ho) {
      var r = t[e];
      return r === ny ? void 0 : r;
    }
    return Yh.call(t, e) ? t[e] : void 0;
  }
  function yG(e) {
    var t = this.__data__;
    return Ho ? t[e] !== void 0 : Yh.call(t, e);
  }
  function vG(e, t) {
    var r = this.__data__;
    return (r[e] = Ho && t === void 0 ? ny : t), this;
  }
  An.prototype.clear = pG;
  An.prototype.delete = mG;
  An.prototype.get = gG;
  An.prototype.has = yG;
  An.prototype.set = vG;
  function Vs(e) {
    var t = -1,
      r = e ? e.length : 0;
    for (this.clear(); ++t < r; ) {
      var i = e[t];
      this.set(i[0], i[1]);
    }
  }
  function wG() {
    this.__data__ = [];
  }
  function DG(e) {
    var t = this.__data__,
      r = Vh(t, e);
    if (r < 0) return !1;
    var i = t.length - 1;
    return r == i ? t.pop() : cG.call(t, r, 1), !0;
  }
  function bG(e) {
    var t = this.__data__,
      r = Vh(t, e);
    return r < 0 ? void 0 : t[r][1];
  }
  function EG(e) {
    return Vh(this.__data__, e) > -1;
  }
  function _G(e, t) {
    var r = this.__data__,
      i = Vh(r, e);
    return i < 0 ? r.push([e, t]) : (r[i][1] = t), this;
  }
  Vs.prototype.clear = wG;
  Vs.prototype.delete = DG;
  Vs.prototype.get = bG;
  Vs.prototype.has = EG;
  Vs.prototype.set = _G;
  function Xs(e) {
    var t = -1,
      r = e ? e.length : 0;
    for (this.clear(); ++t < r; ) {
      var i = e[t];
      this.set(i[0], i[1]);
    }
  }
  function SG() {
    this.__data__ = { hash: new An(), map: new (dG || Vs)(), string: new An() };
  }
  function xG(e) {
    return Xh(this, e).delete(e);
  }
  function CG(e) {
    return Xh(this, e).get(e);
  }
  function OG(e) {
    return Xh(this, e).has(e);
  }
  function TG(e, t) {
    return Xh(this, e).set(e, t), this;
  }
  Xs.prototype.clear = SG;
  Xs.prototype.delete = xG;
  Xs.prototype.get = CG;
  Xs.prototype.has = OG;
  Xs.prototype.set = TG;
  function Gh(e) {
    var t = -1,
      r = e ? e.length : 0;
    for (this.__data__ = new Xs(); ++t < r; ) this.add(e[t]);
  }
  function FG(e) {
    return this.__data__.set(e, ny), this;
  }
  function RG(e) {
    return this.__data__.has(e);
  }
  Gh.prototype.add = Gh.prototype.push = FG;
  Gh.prototype.has = RG;
  function Vh(e, t) {
    for (var r = e.length; r--; ) if (jG(e[r][0], t)) return r;
    return -1;
  }
  function LF(e, t, r, i, n) {
    var s = -1,
      a = e.length;
    for (r || (r = LG), n || (n = []); ++s < a; ) {
      var o = e[s];
      t > 0 && r(o)
        ? t > 1
          ? LF(o, t - 1, r, i, n)
          : tG(n, o)
        : i || (n[n.length] = o);
    }
    return n;
  }
  function AG(e) {
    if (!BF(e) || PG(e)) return !1;
    var t = PF(e) || oG(e) ? fG : XW;
    return t.test(BG(e));
  }
  function NG(e, t) {
    return (
      (t = AF(t === void 0 ? e.length - 1 : t, 0)),
      function () {
        for (
          var r = arguments, i = -1, n = AF(r.length - t, 0), s = Array(n);
          ++i < n;

        )
          s[i] = r[t + i];
        i = -1;
        for (var a = Array(t + 1); ++i < t; ) a[i] = r[i];
        return (a[t] = s), QW(e, this, a);
      }
    );
  }
  function IG(e, t, r) {
    var i = -1,
      n = JW,
      s = e.length,
      a = !0,
      o = [],
      u = o;
    if (r) (a = !1), (n = eG);
    else if (s >= zW) {
      var l = t ? null : MG(e);
      if (l) return NF(l);
      (a = !1), (n = sG), (u = new Gh());
    } else u = t ? [] : o;
    e: for (; ++i < s; ) {
      var f = e[i],
        h = t ? t(f) : f;
      if (((f = r || f !== 0 ? f : 0), a && h === h)) {
        for (var c = u.length; c--; ) if (u[c] === h) continue e;
        t && u.push(h), o.push(f);
      } else n(u, h, r) || (u !== o && u.push(h), o.push(f));
    }
    return o;
  }
  var MG =
    iy && 1 / NF(new iy([, -0]))[1] == $W
      ? function (e) {
          return new iy(e);
        }
      : HG;
  function Xh(e, t) {
    var r = e.__data__;
    return qG(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
  }
  function ay(e, t) {
    var r = aG(e, t);
    return AG(r) ? r : void 0;
  }
  function LG(e) {
    return zG(e) || UG(e) || !!(RF && e && e[RF]);
  }
  function qG(e) {
    var t = typeof e;
    return t == "string" || t == "number" || t == "symbol" || t == "boolean"
      ? e !== "__proto__"
      : e === null;
  }
  function PG(e) {
    return !!TF && TF in e;
  }
  function BG(e) {
    if (e != null) {
      try {
        return IF.call(e);
      } catch {}
      try {
        return e + "";
      } catch {}
    }
    return "";
  }
  var kG = NG(function (e) {
    return IG(LF(e, 1, qF, !0));
  });
  function jG(e, t) {
    return e === t || (e !== e && t !== t);
  }
  function UG(e) {
    return (
      qF(e) &&
      Yh.call(e, "callee") &&
      (!hG.call(e, "callee") || MF.call(e) == GW)
    );
  }
  var zG = Array.isArray;
  function $G(e) {
    return e != null && WG(e.length) && !PF(e);
  }
  function qF(e) {
    return GG(e) && $G(e);
  }
  function PF(e) {
    var t = BF(e) ? MF.call(e) : "";
    return t == HW || t == YW;
  }
  function WG(e) {
    return typeof e == "number" && e > -1 && e % 1 == 0 && e <= WW;
  }
  function BF(e) {
    var t = typeof e;
    return !!e && (t == "object" || t == "function");
  }
  function GG(e) {
    return !!e && typeof e == "object";
  }
  function HG() {}
  kF.exports = kG;
});
var WF = y((Oee, $F) => {
  var YG = "[object Object]";
  function VG(e) {
    var t = !1;
    if (e != null && typeof e.toString != "function")
      try {
        t = !!(e + "");
      } catch {}
    return t;
  }
  function XG(e, t) {
    return function (r) {
      return e(t(r));
    };
  }
  var ZG = Function.prototype,
    UF = Object.prototype,
    zF = ZG.toString,
    KG = UF.hasOwnProperty,
    QG = zF.call(Object),
    JG = UF.toString,
    eH = XG(Object.getPrototypeOf, Object);
  function tH(e) {
    return !!e && typeof e == "object";
  }
  function rH(e) {
    if (!tH(e) || JG.call(e) != YG || VG(e)) return !1;
    var t = eH(e);
    if (t === null) return !0;
    var r = KG.call(t, "constructor") && t.constructor;
    return typeof r == "function" && r instanceof r && zF.call(r) == QG;
  }
  $F.exports = rH;
});
var GF = y((oy) => {
  var Nn = require("path"),
    Ai = process.platform === "win32",
    Ri = require("fs"),
    iH = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
  function nH() {
    var e;
    if (iH) {
      var t = new Error();
      e = r;
    } else e = i;
    return e;
    function r(n) {
      n && ((t.message = n.message), (n = t), i(n));
    }
    function i(n) {
      if (n) {
        if (process.throwDeprecation) throw n;
        if (!process.noDeprecation) {
          var s = "fs: missing callback " + (n.stack || n.message);
          process.traceDeprecation ? console.trace(s) : console.error(s);
        }
      }
    }
  }
  function sH(e) {
    return typeof e == "function" ? e : nH();
  }
  var Tee = Nn.normalize;
  Ai ? (Xr = /(.*?)(?:[\/\\]+|$)/g) : (Xr = /(.*?)(?:[\/]+|$)/g);
  var Xr;
  Ai
    ? (Yo = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/)
    : (Yo = /^[\/]*/);
  var Yo;
  oy.realpathSync = function (t, r) {
    if (((t = Nn.resolve(t)), r && Object.prototype.hasOwnProperty.call(r, t)))
      return r[t];
    var i = t,
      n = {},
      s = {},
      a,
      o,
      u,
      l;
    f();
    function f() {
      var S = Yo.exec(t);
      (a = S[0].length),
        (o = S[0]),
        (u = S[0]),
        (l = ""),
        Ai && !s[u] && (Ri.lstatSync(u), (s[u] = !0));
    }
    for (; a < t.length; ) {
      Xr.lastIndex = a;
      var h = Xr.exec(t);
      if (
        ((l = o),
        (o += h[0]),
        (u = l + h[1]),
        (a = Xr.lastIndex),
        !(s[u] || (r && r[u] === u)))
      ) {
        var c;
        if (r && Object.prototype.hasOwnProperty.call(r, u)) c = r[u];
        else {
          var d = Ri.lstatSync(u);
          if (!d.isSymbolicLink()) {
            (s[u] = !0), r && (r[u] = u);
            continue;
          }
          var g = null;
          if (!Ai) {
            var C = d.dev.toString(32) + ":" + d.ino.toString(32);
            n.hasOwnProperty(C) && (g = n[C]);
          }
          g === null && (Ri.statSync(u), (g = Ri.readlinkSync(u))),
            (c = Nn.resolve(l, g)),
            r && (r[u] = c),
            Ai || (n[C] = g);
        }
        (t = Nn.resolve(c, t.slice(a))), f();
      }
    }
    return r && (r[i] = t), t;
  };
  oy.realpath = function (t, r, i) {
    if (
      (typeof i != "function" && ((i = sH(r)), (r = null)),
      (t = Nn.resolve(t)),
      r && Object.prototype.hasOwnProperty.call(r, t))
    )
      return process.nextTick(i.bind(null, null, r[t]));
    var n = t,
      s = {},
      a = {},
      o,
      u,
      l,
      f;
    h();
    function h() {
      var S = Yo.exec(t);
      (o = S[0].length),
        (u = S[0]),
        (l = S[0]),
        (f = ""),
        Ai && !a[l]
          ? Ri.lstat(l, function (O) {
              if (O) return i(O);
              (a[l] = !0), c();
            })
          : process.nextTick(c);
    }
    function c() {
      if (o >= t.length) return r && (r[n] = t), i(null, t);
      Xr.lastIndex = o;
      var S = Xr.exec(t);
      return (
        (f = u),
        (u += S[0]),
        (l = f + S[1]),
        (o = Xr.lastIndex),
        a[l] || (r && r[l] === l)
          ? process.nextTick(c)
          : r && Object.prototype.hasOwnProperty.call(r, l)
          ? C(r[l])
          : Ri.lstat(l, d)
      );
    }
    function d(S, O) {
      if (S) return i(S);
      if (!O.isSymbolicLink())
        return (a[l] = !0), r && (r[l] = l), process.nextTick(c);
      if (!Ai) {
        var L = O.dev.toString(32) + ":" + O.ino.toString(32);
        if (s.hasOwnProperty(L)) return g(null, s[L], l);
      }
      Ri.stat(l, function (D) {
        if (D) return i(D);
        Ri.readlink(l, function (w, F) {
          Ai || (s[L] = F), g(w, F);
        });
      });
    }
    function g(S, O, L) {
      if (S) return i(S);
      var D = Nn.resolve(f, O);
      r && (r[L] = D), C(D);
    }
    function C(S) {
      (t = Nn.resolve(S, t.slice(o))), h();
    }
  };
});
var hy = y((Ree, XF) => {
  XF.exports = Ni;
  Ni.realpath = Ni;
  Ni.sync = fy;
  Ni.realpathSync = fy;
  Ni.monkeypatch = oH;
  Ni.unmonkeypatch = uH;
  var Zs = require("fs"),
    uy = Zs.realpath,
    ly = Zs.realpathSync,
    aH = process.version,
    HF = /^v[0-5]\./.test(aH),
    YF = GF();
  function VF(e) {
    return (
      e &&
      e.syscall === "realpath" &&
      (e.code === "ELOOP" || e.code === "ENOMEM" || e.code === "ENAMETOOLONG")
    );
  }
  function Ni(e, t, r) {
    if (HF) return uy(e, t, r);
    typeof t == "function" && ((r = t), (t = null)),
      uy(e, t, function (i, n) {
        VF(i) ? YF.realpath(e, t, r) : r(i, n);
      });
  }
  function fy(e, t) {
    if (HF) return ly(e, t);
    try {
      return ly(e, t);
    } catch (r) {
      if (VF(r)) return YF.realpathSync(e, t);
      throw r;
    }
  }
  function oH() {
    (Zs.realpath = Ni), (Zs.realpathSync = fy);
  }
  function uH() {
    (Zs.realpath = uy), (Zs.realpathSync = ly);
  }
});
var KF = y((Aee, ZF) => {
  ZF.exports = function (e, t) {
    for (var r = [], i = 0; i < e.length; i++) {
      var n = t(e[i], i);
      lH(n) ? r.push.apply(r, n) : r.push(n);
    }
    return r;
  };
  var lH =
    Array.isArray ||
    function (e) {
      return Object.prototype.toString.call(e) === "[object Array]";
    };
});
var sR = y((Nee, nR) => {
  var fH = KF(),
    QF = Hg();
  nR.exports = dH;
  var JF = "\0SLASH" + Math.random() + "\0",
    eR = "\0OPEN" + Math.random() + "\0",
    dy = "\0CLOSE" + Math.random() + "\0",
    tR = "\0COMMA" + Math.random() + "\0",
    rR = "\0PERIOD" + Math.random() + "\0";
  function cy(e) {
    return parseInt(e, 10) == e ? parseInt(e, 10) : e.charCodeAt(0);
  }
  function hH(e) {
    return e
      .split("\\\\")
      .join(JF)
      .split("\\{")
      .join(eR)
      .split("\\}")
      .join(dy)
      .split("\\,")
      .join(tR)
      .split("\\.")
      .join(rR);
  }
  function cH(e) {
    return e
      .split(JF)
      .join("\\")
      .split(eR)
      .join("{")
      .split(dy)
      .join("}")
      .split(tR)
      .join(",")
      .split(rR)
      .join(".");
  }
  function iR(e) {
    if (!e) return [""];
    var t = [],
      r = QF("{", "}", e);
    if (!r) return e.split(",");
    var i = r.pre,
      n = r.body,
      s = r.post,
      a = i.split(",");
    a[a.length - 1] += "{" + n + "}";
    var o = iR(s);
    return (
      s.length && ((a[a.length - 1] += o.shift()), a.push.apply(a, o)),
      t.push.apply(t, a),
      t
    );
  }
  function dH(e) {
    return e
      ? (e.substr(0, 2) === "{}" && (e = "\\{\\}" + e.substr(2)),
        Ks(hH(e), !0).map(cH))
      : [];
  }
  function pH(e) {
    return "{" + e + "}";
  }
  function mH(e) {
    return /^-?0\d/.test(e);
  }
  function gH(e, t) {
    return e <= t;
  }
  function yH(e, t) {
    return e >= t;
  }
  function Ks(e, t) {
    var r = [],
      i = QF("{", "}", e);
    if (!i || /\$$/.test(i.pre)) return [e];
    var n = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(i.body),
      s = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(i.body),
      a = n || s,
      o = i.body.indexOf(",") >= 0;
    if (!a && !o)
      return i.post.match(/,.*\}/)
        ? ((e = i.pre + "{" + i.body + dy + i.post), Ks(e))
        : [e];
    var u;
    if (a) u = i.body.split(/\.\./);
    else if (
      ((u = iR(i.body)),
      u.length === 1 && ((u = Ks(u[0], !1).map(pH)), u.length === 1))
    ) {
      var f = i.post.length ? Ks(i.post, !1) : [""];
      return f.map(function (R) {
        return i.pre + u[0] + R;
      });
    }
    var l = i.pre,
      f = i.post.length ? Ks(i.post, !1) : [""],
      h;
    if (a) {
      var c = cy(u[0]),
        d = cy(u[1]),
        g = Math.max(u[0].length, u[1].length),
        C = u.length == 3 ? Math.abs(cy(u[2])) : 1,
        S = gH,
        O = d < c;
      O && ((C *= -1), (S = yH));
      var L = u.some(mH);
      h = [];
      for (var D = c; S(D, d); D += C) {
        var w;
        if (s) (w = String.fromCharCode(D)), w === "\\" && (w = "");
        else if (((w = String(D)), L)) {
          var F = g - w.length;
          if (F > 0) {
            var m = new Array(F + 1).join("0");
            D < 0 ? (w = "-" + m + w.slice(1)) : (w = m + w);
          }
        }
        h.push(w);
      }
    } else
      h = fH(u, function (T) {
        return Ks(T, !1);
      });
    for (var x = 0; x < h.length; x++)
      for (var A = 0; A < f.length; A++) {
        var p = l + h[x] + f[A];
        (!t || a || p) && r.push(p);
      }
    return r;
  }
});
var Qh = y((Iee, fR) => {
  fR.exports = It;
  It.Minimatch = et;
  var Vo = (function () {
    try {
      return require("path");
    } catch {}
  })() || { sep: "/" };
  It.sep = Vo.sep;
  var gy = (It.GLOBSTAR = et.GLOBSTAR = {}),
    vH = sR(),
    aR = {
      "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
      "?": { open: "(?:", close: ")?" },
      "+": { open: "(?:", close: ")+" },
      "*": { open: "(?:", close: ")*" },
      "@": { open: "(?:", close: ")" },
    },
    py = "[^/]",
    my = py + "*?",
    wH = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?",
    DH = "(?:(?!(?:\\/|^)\\.).)*?",
    oR = bH("().*{}+?[]^$\\!");
  function bH(e) {
    return e.split("").reduce(function (t, r) {
      return (t[r] = !0), t;
    }, {});
  }
  var uR = /\/+/;
  It.filter = EH;
  function EH(e, t) {
    return (
      (t = t || {}),
      function (r, i, n) {
        return It(r, e, t);
      }
    );
  }
  function Ii(e, t) {
    t = t || {};
    var r = {};
    return (
      Object.keys(e).forEach(function (i) {
        r[i] = e[i];
      }),
      Object.keys(t).forEach(function (i) {
        r[i] = t[i];
      }),
      r
    );
  }
  It.defaults = function (e) {
    if (!e || typeof e != "object" || !Object.keys(e).length) return It;
    var t = It,
      r = function (n, s, a) {
        return t(n, s, Ii(e, a));
      };
    return (
      (r.Minimatch = function (n, s) {
        return new t.Minimatch(n, Ii(e, s));
      }),
      (r.Minimatch.defaults = function (n) {
        return t.defaults(Ii(e, n)).Minimatch;
      }),
      (r.filter = function (n, s) {
        return t.filter(n, Ii(e, s));
      }),
      (r.defaults = function (n) {
        return t.defaults(Ii(e, n));
      }),
      (r.makeRe = function (n, s) {
        return t.makeRe(n, Ii(e, s));
      }),
      (r.braceExpand = function (n, s) {
        return t.braceExpand(n, Ii(e, s));
      }),
      (r.match = function (i, n, s) {
        return t.match(i, n, Ii(e, s));
      }),
      r
    );
  };
  et.defaults = function (e) {
    return It.defaults(e).Minimatch;
  };
  function It(e, t, r) {
    return (
      Kh(t),
      r || (r = {}),
      !r.nocomment && t.charAt(0) === "#" ? !1 : new et(t, r).match(e)
    );
  }
  function et(e, t) {
    if (!(this instanceof et)) return new et(e, t);
    Kh(e),
      t || (t = {}),
      (e = e.trim()),
      !t.allowWindowsEscape &&
        Vo.sep !== "/" &&
        (e = e.split(Vo.sep).join("/")),
      (this.options = t),
      (this.set = []),
      (this.pattern = e),
      (this.regexp = null),
      (this.negate = !1),
      (this.comment = !1),
      (this.empty = !1),
      (this.partial = !!t.partial),
      this.make();
  }
  et.prototype.debug = function () {};
  et.prototype.make = _H;
  function _H() {
    var e = this.pattern,
      t = this.options;
    if (!t.nocomment && e.charAt(0) === "#") {
      this.comment = !0;
      return;
    }
    if (!e) {
      this.empty = !0;
      return;
    }
    this.parseNegate();
    var r = (this.globSet = this.braceExpand());
    t.debug &&
      (this.debug = function () {
        console.error.apply(console, arguments);
      }),
      this.debug(this.pattern, r),
      (r = this.globParts =
        r.map(function (i) {
          return i.split(uR);
        })),
      this.debug(this.pattern, r),
      (r = r.map(function (i, n, s) {
        return i.map(this.parse, this);
      }, this)),
      this.debug(this.pattern, r),
      (r = r.filter(function (i) {
        return i.indexOf(!1) === -1;
      })),
      this.debug(this.pattern, r),
      (this.set = r);
  }
  et.prototype.parseNegate = SH;
  function SH() {
    var e = this.pattern,
      t = !1,
      r = this.options,
      i = 0;
    if (!r.nonegate) {
      for (var n = 0, s = e.length; n < s && e.charAt(n) === "!"; n++)
        (t = !t), i++;
      i && (this.pattern = e.substr(i)), (this.negate = t);
    }
  }
  It.braceExpand = function (e, t) {
    return lR(e, t);
  };
  et.prototype.braceExpand = lR;
  function lR(e, t) {
    return (
      t || (this instanceof et ? (t = this.options) : (t = {})),
      (e = typeof e > "u" ? this.pattern : e),
      Kh(e),
      t.nobrace || !/\{(?:(?!\{).)*\}/.test(e) ? [e] : vH(e)
    );
  }
  var xH = 1024 * 64,
    Kh = function (e) {
      if (typeof e != "string") throw new TypeError("invalid pattern");
      if (e.length > xH) throw new TypeError("pattern is too long");
    };
  et.prototype.parse = CH;
  var Zh = {};
  function CH(e, t) {
    Kh(e);
    var r = this.options;
    if (e === "**")
      if (r.noglobstar) e = "*";
      else return gy;
    if (e === "") return "";
    var i = "",
      n = !!r.nocase,
      s = !1,
      a = [],
      o = [],
      u,
      l = !1,
      f = -1,
      h = -1,
      c =
        e.charAt(0) === "."
          ? ""
          : r.dot
          ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))"
          : "(?!\\.)",
      d = this;
    function g() {
      if (u) {
        switch (u) {
          case "*":
            (i += my), (n = !0);
            break;
          case "?":
            (i += py), (n = !0);
            break;
          default:
            i += "\\" + u;
            break;
        }
        d.debug("clearStateChar %j %j", u, i), (u = !1);
      }
    }
    for (var C = 0, S = e.length, O; C < S && (O = e.charAt(C)); C++) {
      if ((this.debug("%s	%s %s %j", e, C, i, O), s && oR[O])) {
        (i += "\\" + O), (s = !1);
        continue;
      }
      switch (O) {
        case "/":
          return !1;
        case "\\":
          g(), (s = !0);
          continue;
        case "?":
        case "*":
        case "+":
        case "@":
        case "!":
          if ((this.debug("%s	%s %s %j <-- stateChar", e, C, i, O), l)) {
            this.debug("  in class"),
              O === "!" && C === h + 1 && (O = "^"),
              (i += O);
            continue;
          }
          d.debug("call clearStateChar %j", u), g(), (u = O), r.noext && g();
          continue;
        case "(":
          if (l) {
            i += "(";
            continue;
          }
          if (!u) {
            i += "\\(";
            continue;
          }
          a.push({
            type: u,
            start: C - 1,
            reStart: i.length,
            open: aR[u].open,
            close: aR[u].close,
          }),
            (i += u === "!" ? "(?:(?!(?:" : "(?:"),
            this.debug("plType %j %j", u, i),
            (u = !1);
          continue;
        case ")":
          if (l || !a.length) {
            i += "\\)";
            continue;
          }
          g(), (n = !0);
          var L = a.pop();
          (i += L.close), L.type === "!" && o.push(L), (L.reEnd = i.length);
          continue;
        case "|":
          if (l || !a.length || s) {
            (i += "\\|"), (s = !1);
            continue;
          }
          g(), (i += "|");
          continue;
        case "[":
          if ((g(), l)) {
            i += "\\" + O;
            continue;
          }
          (l = !0), (h = C), (f = i.length), (i += O);
          continue;
        case "]":
          if (C === h + 1 || !l) {
            (i += "\\" + O), (s = !1);
            continue;
          }
          var D = e.substring(h + 1, C);
          try {
            RegExp("[" + D + "]");
          } catch {
            var w = this.parse(D, Zh);
            (i = i.substr(0, f) + "\\[" + w[0] + "\\]"),
              (n = n || w[1]),
              (l = !1);
            continue;
          }
          (n = !0), (l = !1), (i += O);
          continue;
        default:
          g(),
            s ? (s = !1) : oR[O] && !(O === "^" && l) && (i += "\\"),
            (i += O);
      }
    }
    for (
      l &&
        ((D = e.substr(h + 1)),
        (w = this.parse(D, Zh)),
        (i = i.substr(0, f) + "\\[" + w[0]),
        (n = n || w[1])),
        L = a.pop();
      L;
      L = a.pop()
    ) {
      var F = i.slice(L.reStart + L.open.length);
      this.debug("setting tail", i, L),
        (F = F.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (W, Ne, Ie) {
          return Ie || (Ie = "\\"), Ne + Ne + Ie + "|";
        })),
        this.debug(
          `tail=%j
   %s`,
          F,
          F,
          L,
          i,
        );
      var m = L.type === "*" ? my : L.type === "?" ? py : "\\" + L.type;
      (n = !0), (i = i.slice(0, L.reStart) + m + "\\(" + F);
    }
    g(), s && (i += "\\\\");
    var x = !1;
    switch (i.charAt(0)) {
      case "[":
      case ".":
      case "(":
        x = !0;
    }
    for (var A = o.length - 1; A > -1; A--) {
      var p = o[A],
        T = i.slice(0, p.reStart),
        R = i.slice(p.reStart, p.reEnd - 8),
        k = i.slice(p.reEnd - 8, p.reEnd),
        z = i.slice(p.reEnd);
      k += z;
      var $ = T.split("(").length - 1,
        X = z;
      for (C = 0; C < $; C++) X = X.replace(/\)[+*?]?/, "");
      z = X;
      var I = "";
      z === "" && t !== Zh && (I = "$");
      var P = T + R + z + I + k;
      i = P;
    }
    if ((i !== "" && n && (i = "(?=.)" + i), x && (i = c + i), t === Zh))
      return [i, n];
    if (!n) return TH(e);
    var G = r.nocase ? "i" : "";
    try {
      var J = new RegExp("^" + i + "$", G);
    } catch {
      return new RegExp("$.");
    }
    return (J._glob = e), (J._src = i), J;
  }
  It.makeRe = function (e, t) {
    return new et(e, t || {}).makeRe();
  };
  et.prototype.makeRe = OH;
  function OH() {
    if (this.regexp || this.regexp === !1) return this.regexp;
    var e = this.set;
    if (!e.length) return (this.regexp = !1), this.regexp;
    var t = this.options,
      r = t.noglobstar ? my : t.dot ? wH : DH,
      i = t.nocase ? "i" : "",
      n = e
        .map(function (s) {
          return s
            .map(function (a) {
              return a === gy ? r : typeof a == "string" ? FH(a) : a._src;
            })
            .join("\\/");
        })
        .join("|");
    (n = "^(?:" + n + ")$"), this.negate && (n = "^(?!" + n + ").*$");
    try {
      this.regexp = new RegExp(n, i);
    } catch {
      this.regexp = !1;
    }
    return this.regexp;
  }
  It.match = function (e, t, r) {
    r = r || {};
    var i = new et(t, r);
    return (
      (e = e.filter(function (n) {
        return i.match(n);
      })),
      i.options.nonull && !e.length && e.push(t),
      e
    );
  };
  et.prototype.match = function (t, r) {
    if (
      (typeof r > "u" && (r = this.partial),
      this.debug("match", t, this.pattern),
      this.comment)
    )
      return !1;
    if (this.empty) return t === "";
    if (t === "/" && r) return !0;
    var i = this.options;
    Vo.sep !== "/" && (t = t.split(Vo.sep).join("/")),
      (t = t.split(uR)),
      this.debug(this.pattern, "split", t);
    var n = this.set;
    this.debug(this.pattern, "set", n);
    var s, a;
    for (a = t.length - 1; a >= 0 && ((s = t[a]), !s); a--);
    for (a = 0; a < n.length; a++) {
      var o = n[a],
        u = t;
      i.matchBase && o.length === 1 && (u = [s]);
      var l = this.matchOne(u, o, r);
      if (l) return i.flipNegate ? !0 : !this.negate;
    }
    return i.flipNegate ? !1 : this.negate;
  };
  et.prototype.matchOne = function (e, t, r) {
    var i = this.options;
    this.debug("matchOne", { this: this, file: e, pattern: t }),
      this.debug("matchOne", e.length, t.length);
    for (
      var n = 0, s = 0, a = e.length, o = t.length;
      n < a && s < o;
      n++, s++
    ) {
      this.debug("matchOne loop");
      var u = t[s],
        l = e[n];
      if ((this.debug(t, u, l), u === !1)) return !1;
      if (u === gy) {
        this.debug("GLOBSTAR", [t, u, l]);
        var f = n,
          h = s + 1;
        if (h === o) {
          for (this.debug("** at the end"); n < a; n++)
            if (
              e[n] === "." ||
              e[n] === ".." ||
              (!i.dot && e[n].charAt(0) === ".")
            )
              return !1;
          return !0;
        }
        for (; f < a; ) {
          var c = e[f];
          if (
            (this.debug(
              `
globstar while`,
              e,
              f,
              t,
              h,
              c,
            ),
            this.matchOne(e.slice(f), t.slice(h), r))
          )
            return this.debug("globstar found match!", f, a, c), !0;
          if (c === "." || c === ".." || (!i.dot && c.charAt(0) === ".")) {
            this.debug("dot detected!", e, f, t, h);
            break;
          }
          this.debug("globstar swallow a segment, and continue"), f++;
        }
        return !!(
          r &&
          (this.debug(
            `
>>> no match, partial?`,
            e,
            f,
            t,
            h,
          ),
          f === a)
        );
      }
      var d;
      if (
        (typeof u == "string"
          ? ((d = l === u), this.debug("string match", u, l, d))
          : ((d = l.match(u)), this.debug("pattern match", u, l, d)),
        !d)
      )
        return !1;
    }
    if (n === a && s === o) return !0;
    if (n === a) return r;
    if (s === o) return n === a - 1 && e[n] === "";
    throw new Error("wtf?");
  };
  function TH(e) {
    return e.replace(/\\(.)/g, "$1");
  }
  function FH(e) {
    return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
});
var ec = y((Mee, Jh) => {
  "use strict";
  function hR(e) {
    return e.charAt(0) === "/";
  }
  function cR(e) {
    var t =
        /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/,
      r = t.exec(e),
      i = r[1] || "",
      n = Boolean(i && i.charAt(1) !== ":");
    return Boolean(r[2] || n);
  }
  Jh.exports = process.platform === "win32" ? cR : hR;
  Jh.exports.posix = hR;
  Jh.exports.win32 = cR;
});
var vy = y((Mi) => {
  Mi.setopts = LH;
  Mi.ownProp = dR;
  Mi.makeAbs = Xo;
  Mi.finish = qH;
  Mi.mark = PH;
  Mi.isIgnored = mR;
  Mi.childrenIgnored = BH;
  function dR(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }
  var RH = require("fs"),
    Qs = require("path"),
    AH = Qh(),
    pR = ec(),
    yy = AH.Minimatch;
  function NH(e, t) {
    return e.localeCompare(t, "en");
  }
  function IH(e, t) {
    (e.ignore = t.ignore || []),
      Array.isArray(e.ignore) || (e.ignore = [e.ignore]),
      e.ignore.length && (e.ignore = e.ignore.map(MH));
  }
  function MH(e) {
    var t = null;
    if (e.slice(-3) === "/**") {
      var r = e.replace(/(\/\*\*)+$/, "");
      t = new yy(r, { dot: !0 });
    }
    return { matcher: new yy(e, { dot: !0 }), gmatcher: t };
  }
  function LH(e, t, r) {
    if ((r || (r = {}), r.matchBase && t.indexOf("/") === -1)) {
      if (r.noglobstar) throw new Error("base matching requires globstar");
      t = "**/" + t;
    }
    (e.silent = !!r.silent),
      (e.pattern = t),
      (e.strict = r.strict !== !1),
      (e.realpath = !!r.realpath),
      (e.realpathCache = r.realpathCache || Object.create(null)),
      (e.follow = !!r.follow),
      (e.dot = !!r.dot),
      (e.mark = !!r.mark),
      (e.nodir = !!r.nodir),
      e.nodir && (e.mark = !0),
      (e.sync = !!r.sync),
      (e.nounique = !!r.nounique),
      (e.nonull = !!r.nonull),
      (e.nosort = !!r.nosort),
      (e.nocase = !!r.nocase),
      (e.stat = !!r.stat),
      (e.noprocess = !!r.noprocess),
      (e.absolute = !!r.absolute),
      (e.fs = r.fs || RH),
      (e.maxLength = r.maxLength || 1 / 0),
      (e.cache = r.cache || Object.create(null)),
      (e.statCache = r.statCache || Object.create(null)),
      (e.symlinks = r.symlinks || Object.create(null)),
      IH(e, r),
      (e.changedCwd = !1);
    var i = process.cwd();
    dR(r, "cwd")
      ? ((e.cwd = Qs.resolve(r.cwd)), (e.changedCwd = e.cwd !== i))
      : (e.cwd = i),
      (e.root = r.root || Qs.resolve(e.cwd, "/")),
      (e.root = Qs.resolve(e.root)),
      process.platform === "win32" && (e.root = e.root.replace(/\\/g, "/")),
      (e.cwdAbs = pR(e.cwd) ? e.cwd : Xo(e, e.cwd)),
      process.platform === "win32" && (e.cwdAbs = e.cwdAbs.replace(/\\/g, "/")),
      (e.nomount = !!r.nomount),
      (r.nonegate = !0),
      (r.nocomment = !0),
      (r.allowWindowsEscape = !1),
      (e.minimatch = new yy(t, r)),
      (e.options = e.minimatch.options);
  }
  function qH(e) {
    for (
      var t = e.nounique,
        r = t ? [] : Object.create(null),
        i = 0,
        n = e.matches.length;
      i < n;
      i++
    ) {
      var s = e.matches[i];
      if (!s || Object.keys(s).length === 0) {
        if (e.nonull) {
          var a = e.minimatch.globSet[i];
          t ? r.push(a) : (r[a] = !0);
        }
      } else {
        var o = Object.keys(s);
        t
          ? r.push.apply(r, o)
          : o.forEach(function (u) {
              r[u] = !0;
            });
      }
    }
    if ((t || (r = Object.keys(r)), e.nosort || (r = r.sort(NH)), e.mark)) {
      for (var i = 0; i < r.length; i++) r[i] = e._mark(r[i]);
      e.nodir &&
        (r = r.filter(function (u) {
          var l = !/\/$/.test(u),
            f = e.cache[u] || e.cache[Xo(e, u)];
          return l && f && (l = f !== "DIR" && !Array.isArray(f)), l;
        }));
    }
    e.ignore.length &&
      (r = r.filter(function (u) {
        return !mR(e, u);
      })),
      (e.found = r);
  }
  function PH(e, t) {
    var r = Xo(e, t),
      i = e.cache[r],
      n = t;
    if (i) {
      var s = i === "DIR" || Array.isArray(i),
        a = t.slice(-1) === "/";
      if ((s && !a ? (n += "/") : !s && a && (n = n.slice(0, -1)), n !== t)) {
        var o = Xo(e, n);
        (e.statCache[o] = e.statCache[r]), (e.cache[o] = e.cache[r]);
      }
    }
    return n;
  }
  function Xo(e, t) {
    var r = t;
    return (
      t.charAt(0) === "/"
        ? (r = Qs.join(e.root, t))
        : pR(t) || t === ""
        ? (r = t)
        : e.changedCwd
        ? (r = Qs.resolve(e.cwd, t))
        : (r = Qs.resolve(t)),
      process.platform === "win32" && (r = r.replace(/\\/g, "/")),
      r
    );
  }
  function mR(e, t) {
    return e.ignore.length
      ? e.ignore.some(function (r) {
          return r.matcher.match(t) || !!(r.gmatcher && r.gmatcher.match(t));
        })
      : !1;
  }
  function BH(e, t) {
    return e.ignore.length
      ? e.ignore.some(function (r) {
          return !!(r.gmatcher && r.gmatcher.match(t));
        })
      : !1;
  }
});
var DR = y((kee, wR) => {
  wR.exports = vR;
  vR.GlobSync = ze;
  var kH = hy(),
    gR = Qh(),
    qee = gR.Minimatch,
    Pee = by().Glob,
    Bee = require("util"),
    wy = require("path"),
    yR = require("assert"),
    tc = ec(),
    In = vy(),
    jH = In.setopts,
    Dy = In.ownProp,
    UH = In.childrenIgnored,
    zH = In.isIgnored;
  function vR(e, t) {
    if (typeof t == "function" || arguments.length === 3)
      throw new TypeError(`callback provided to sync glob
See: https://github.com/isaacs/node-glob/issues/167`);
    return new ze(e, t).found;
  }
  function ze(e, t) {
    if (!e) throw new Error("must provide pattern");
    if (typeof t == "function" || arguments.length === 3)
      throw new TypeError(`callback provided to sync glob
See: https://github.com/isaacs/node-glob/issues/167`);
    if (!(this instanceof ze)) return new ze(e, t);
    if ((jH(this, e, t), this.noprocess)) return this;
    var r = this.minimatch.set.length;
    this.matches = new Array(r);
    for (var i = 0; i < r; i++) this._process(this.minimatch.set[i], i, !1);
    this._finish();
  }
  ze.prototype._finish = function () {
    if ((yR.ok(this instanceof ze), this.realpath)) {
      var e = this;
      this.matches.forEach(function (t, r) {
        var i = (e.matches[r] = Object.create(null));
        for (var n in t)
          try {
            n = e._makeAbs(n);
            var s = kH.realpathSync(n, e.realpathCache);
            i[s] = !0;
          } catch (a) {
            if (a.syscall === "stat") i[e._makeAbs(n)] = !0;
            else throw a;
          }
      });
    }
    In.finish(this);
  };
  ze.prototype._process = function (e, t, r) {
    yR.ok(this instanceof ze);
    for (var i = 0; typeof e[i] == "string"; ) i++;
    var n;
    switch (i) {
      case e.length:
        this._processSimple(e.join("/"), t);
        return;
      case 0:
        n = null;
        break;
      default:
        n = e.slice(0, i).join("/");
        break;
    }
    var s = e.slice(i),
      a;
    n === null
      ? (a = ".")
      : ((tc(n) ||
          tc(
            e
              .map(function (l) {
                return typeof l == "string" ? l : "[*]";
              })
              .join("/"),
          )) &&
          (!n || !tc(n)) &&
          (n = "/" + n),
        (a = n));
    var o = this._makeAbs(a);
    if (!UH(this, a)) {
      var u = s[0] === gR.GLOBSTAR;
      u
        ? this._processGlobStar(n, a, o, s, t, r)
        : this._processReaddir(n, a, o, s, t, r);
    }
  };
  ze.prototype._processReaddir = function (e, t, r, i, n, s) {
    var a = this._readdir(r, s);
    if (!!a) {
      for (
        var o = i[0],
          u = !!this.minimatch.negate,
          l = o._glob,
          f = this.dot || l.charAt(0) === ".",
          h = [],
          c = 0;
        c < a.length;
        c++
      ) {
        var d = a[c];
        if (d.charAt(0) !== "." || f) {
          var g;
          u && !e ? (g = !d.match(o)) : (g = d.match(o)), g && h.push(d);
        }
      }
      var C = h.length;
      if (C !== 0) {
        if (i.length === 1 && !this.mark && !this.stat) {
          this.matches[n] || (this.matches[n] = Object.create(null));
          for (var c = 0; c < C; c++) {
            var d = h[c];
            e && (e.slice(-1) !== "/" ? (d = e + "/" + d) : (d = e + d)),
              d.charAt(0) === "/" &&
                !this.nomount &&
                (d = wy.join(this.root, d)),
              this._emitMatch(n, d);
          }
          return;
        }
        i.shift();
        for (var c = 0; c < C; c++) {
          var d = h[c],
            S;
          e ? (S = [e, d]) : (S = [d]), this._process(S.concat(i), n, s);
        }
      }
    }
  };
  ze.prototype._emitMatch = function (e, t) {
    if (!zH(this, t)) {
      var r = this._makeAbs(t);
      if (
        (this.mark && (t = this._mark(t)),
        this.absolute && (t = r),
        !this.matches[e][t])
      ) {
        if (this.nodir) {
          var i = this.cache[r];
          if (i === "DIR" || Array.isArray(i)) return;
        }
        (this.matches[e][t] = !0), this.stat && this._stat(t);
      }
    }
  };
  ze.prototype._readdirInGlobStar = function (e) {
    if (this.follow) return this._readdir(e, !1);
    var t, r, i;
    try {
      r = this.fs.lstatSync(e);
    } catch (s) {
      if (s.code === "ENOENT") return null;
    }
    var n = r && r.isSymbolicLink();
    return (
      (this.symlinks[e] = n),
      !n && r && !r.isDirectory()
        ? (this.cache[e] = "FILE")
        : (t = this._readdir(e, !1)),
      t
    );
  };
  ze.prototype._readdir = function (e, t) {
    var r;
    if (t && !Dy(this.symlinks, e)) return this._readdirInGlobStar(e);
    if (Dy(this.cache, e)) {
      var i = this.cache[e];
      if (!i || i === "FILE") return null;
      if (Array.isArray(i)) return i;
    }
    try {
      return this._readdirEntries(e, this.fs.readdirSync(e));
    } catch (n) {
      return this._readdirError(e, n), null;
    }
  };
  ze.prototype._readdirEntries = function (e, t) {
    if (!this.mark && !this.stat)
      for (var r = 0; r < t.length; r++) {
        var i = t[r];
        e === "/" ? (i = e + i) : (i = e + "/" + i), (this.cache[i] = !0);
      }
    return (this.cache[e] = t), t;
  };
  ze.prototype._readdirError = function (e, t) {
    switch (t.code) {
      case "ENOTSUP":
      case "ENOTDIR":
        var r = this._makeAbs(e);
        if (((this.cache[r] = "FILE"), r === this.cwdAbs)) {
          var i = new Error(t.code + " invalid cwd " + this.cwd);
          throw ((i.path = this.cwd), (i.code = t.code), i);
        }
        break;
      case "ENOENT":
      case "ELOOP":
      case "ENAMETOOLONG":
      case "UNKNOWN":
        this.cache[this._makeAbs(e)] = !1;
        break;
      default:
        if (((this.cache[this._makeAbs(e)] = !1), this.strict)) throw t;
        this.silent || console.error("glob error", t);
        break;
    }
  };
  ze.prototype._processGlobStar = function (e, t, r, i, n, s) {
    var a = this._readdir(r, s);
    if (!!a) {
      var o = i.slice(1),
        u = e ? [e] : [],
        l = u.concat(o);
      this._process(l, n, !1);
      var f = a.length,
        h = this.symlinks[r];
      if (!(h && s))
        for (var c = 0; c < f; c++) {
          var d = a[c];
          if (!(d.charAt(0) === "." && !this.dot)) {
            var g = u.concat(a[c], o);
            this._process(g, n, !0);
            var C = u.concat(a[c], i);
            this._process(C, n, !0);
          }
        }
    }
  };
  ze.prototype._processSimple = function (e, t) {
    var r = this._stat(e);
    if ((this.matches[t] || (this.matches[t] = Object.create(null)), !!r)) {
      if (e && tc(e) && !this.nomount) {
        var i = /[\/\\]$/.test(e);
        e.charAt(0) === "/"
          ? (e = wy.join(this.root, e))
          : ((e = wy.resolve(this.root, e)), i && (e += "/"));
      }
      process.platform === "win32" && (e = e.replace(/\\/g, "/")),
        this._emitMatch(t, e);
    }
  };
  ze.prototype._stat = function (e) {
    var t = this._makeAbs(e),
      r = e.slice(-1) === "/";
    if (e.length > this.maxLength) return !1;
    if (!this.stat && Dy(this.cache, t)) {
      var a = this.cache[t];
      if ((Array.isArray(a) && (a = "DIR"), !r || a === "DIR")) return a;
      if (r && a === "FILE") return !1;
    }
    var i,
      n = this.statCache[t];
    if (!n) {
      var s;
      try {
        s = this.fs.lstatSync(t);
      } catch (o) {
        if (o && (o.code === "ENOENT" || o.code === "ENOTDIR"))
          return (this.statCache[t] = !1), !1;
      }
      if (s && s.isSymbolicLink())
        try {
          n = this.fs.statSync(t);
        } catch {
          n = s;
        }
      else n = s;
    }
    this.statCache[t] = n;
    var a = !0;
    return (
      n && (a = n.isDirectory() ? "DIR" : "FILE"),
      (this.cache[t] = this.cache[t] || a),
      r && a === "FILE" ? !1 : a
    );
  };
  ze.prototype._mark = function (e) {
    return In.mark(this, e);
  };
  ze.prototype._makeAbs = function (e) {
    return In.makeAbs(this, e);
  };
});
var ER = y((jee, bR) => {
  var $H = sd(),
    Zo = Object.create(null),
    WH = Ra();
  bR.exports = $H(GH);
  function GH(e, t) {
    return Zo[e] ? (Zo[e].push(t), null) : ((Zo[e] = [t]), HH(e));
  }
  function HH(e) {
    return WH(function t() {
      var r = Zo[e],
        i = r.length,
        n = YH(arguments);
      try {
        for (var s = 0; s < i; s++) r[s].apply(null, n);
      } finally {
        r.length > i
          ? (r.splice(0, i),
            process.nextTick(function () {
              t.apply(null, n);
            }))
          : delete Zo[e];
      }
    });
  }
  function YH(e) {
    for (var t = e.length, r = [], i = 0; i < t; i++) r[i] = e[i];
    return r;
  }
});
var by = y(($ee, SR) => {
  SR.exports = Mn;
  var VH = hy(),
    _R = Qh(),
    Uee = _R.Minimatch,
    XH = je(),
    ZH = require("events").EventEmitter,
    Ey = require("path"),
    _y = require("assert"),
    Ko = ec(),
    xy = DR(),
    Ln = vy(),
    KH = Ln.setopts,
    Sy = Ln.ownProp,
    Cy = ER(),
    zee = require("util"),
    QH = Ln.childrenIgnored,
    JH = Ln.isIgnored,
    eY = Ra();
  function Mn(e, t, r) {
    if (
      (typeof t == "function" && ((r = t), (t = {})), t || (t = {}), t.sync)
    ) {
      if (r) throw new TypeError("callback provided to sync glob");
      return xy(e, t);
    }
    return new ge(e, t, r);
  }
  Mn.sync = xy;
  var tY = (Mn.GlobSync = xy.GlobSync);
  Mn.glob = Mn;
  function rY(e, t) {
    if (t === null || typeof t != "object") return e;
    for (var r = Object.keys(t), i = r.length; i--; ) e[r[i]] = t[r[i]];
    return e;
  }
  Mn.hasMagic = function (e, t) {
    var r = rY({}, t);
    r.noprocess = !0;
    var i = new ge(e, r),
      n = i.minimatch.set;
    if (!e) return !1;
    if (n.length > 1) return !0;
    for (var s = 0; s < n[0].length; s++)
      if (typeof n[0][s] != "string") return !0;
    return !1;
  };
  Mn.Glob = ge;
  XH(ge, ZH);
  function ge(e, t, r) {
    if ((typeof t == "function" && ((r = t), (t = null)), t && t.sync)) {
      if (r) throw new TypeError("callback provided to sync glob");
      return new tY(e, t);
    }
    if (!(this instanceof ge)) return new ge(e, t, r);
    KH(this, e, t), (this._didRealPath = !1);
    var i = this.minimatch.set.length;
    (this.matches = new Array(i)),
      typeof r == "function" &&
        ((r = eY(r)),
        this.on("error", r),
        this.on("end", function (u) {
          r(null, u);
        }));
    var n = this;
    if (
      ((this._processing = 0),
      (this._emitQueue = []),
      (this._processQueue = []),
      (this.paused = !1),
      this.noprocess)
    )
      return this;
    if (i === 0) return o();
    for (var s = !0, a = 0; a < i; a++)
      this._process(this.minimatch.set[a], a, !1, o);
    s = !1;
    function o() {
      --n._processing,
        n._processing <= 0 &&
          (s
            ? process.nextTick(function () {
                n._finish();
              })
            : n._finish());
    }
  }
  ge.prototype._finish = function () {
    if ((_y(this instanceof ge), !this.aborted)) {
      if (this.realpath && !this._didRealpath) return this._realpath();
      Ln.finish(this), this.emit("end", this.found);
    }
  };
  ge.prototype._realpath = function () {
    if (this._didRealpath) return;
    this._didRealpath = !0;
    var e = this.matches.length;
    if (e === 0) return this._finish();
    for (var t = this, r = 0; r < this.matches.length; r++)
      this._realpathSet(r, i);
    function i() {
      --e === 0 && t._finish();
    }
  };
  ge.prototype._realpathSet = function (e, t) {
    var r = this.matches[e];
    if (!r) return t();
    var i = Object.keys(r),
      n = this,
      s = i.length;
    if (s === 0) return t();
    var a = (this.matches[e] = Object.create(null));
    i.forEach(function (o, u) {
      (o = n._makeAbs(o)),
        VH.realpath(o, n.realpathCache, function (l, f) {
          l
            ? l.syscall === "stat"
              ? (a[o] = !0)
              : n.emit("error", l)
            : (a[f] = !0),
            --s === 0 && ((n.matches[e] = a), t());
        });
    });
  };
  ge.prototype._mark = function (e) {
    return Ln.mark(this, e);
  };
  ge.prototype._makeAbs = function (e) {
    return Ln.makeAbs(this, e);
  };
  ge.prototype.abort = function () {
    (this.aborted = !0), this.emit("abort");
  };
  ge.prototype.pause = function () {
    this.paused || ((this.paused = !0), this.emit("pause"));
  };
  ge.prototype.resume = function () {
    if (this.paused) {
      if ((this.emit("resume"), (this.paused = !1), this._emitQueue.length)) {
        var e = this._emitQueue.slice(0);
        this._emitQueue.length = 0;
        for (var t = 0; t < e.length; t++) {
          var r = e[t];
          this._emitMatch(r[0], r[1]);
        }
      }
      if (this._processQueue.length) {
        var i = this._processQueue.slice(0);
        this._processQueue.length = 0;
        for (var t = 0; t < i.length; t++) {
          var n = i[t];
          this._processing--, this._process(n[0], n[1], n[2], n[3]);
        }
      }
    }
  };
  ge.prototype._process = function (e, t, r, i) {
    if ((_y(this instanceof ge), _y(typeof i == "function"), !this.aborted)) {
      if ((this._processing++, this.paused)) {
        this._processQueue.push([e, t, r, i]);
        return;
      }
      for (var n = 0; typeof e[n] == "string"; ) n++;
      var s;
      switch (n) {
        case e.length:
          this._processSimple(e.join("/"), t, i);
          return;
        case 0:
          s = null;
          break;
        default:
          s = e.slice(0, n).join("/");
          break;
      }
      var a = e.slice(n),
        o;
      s === null
        ? (o = ".")
        : ((Ko(s) ||
            Ko(
              e
                .map(function (f) {
                  return typeof f == "string" ? f : "[*]";
                })
                .join("/"),
            )) &&
            (!s || !Ko(s)) &&
            (s = "/" + s),
          (o = s));
      var u = this._makeAbs(o);
      if (QH(this, o)) return i();
      var l = a[0] === _R.GLOBSTAR;
      l
        ? this._processGlobStar(s, o, u, a, t, r, i)
        : this._processReaddir(s, o, u, a, t, r, i);
    }
  };
  ge.prototype._processReaddir = function (e, t, r, i, n, s, a) {
    var o = this;
    this._readdir(r, s, function (u, l) {
      return o._processReaddir2(e, t, r, i, n, s, l, a);
    });
  };
  ge.prototype._processReaddir2 = function (e, t, r, i, n, s, a, o) {
    if (!a) return o();
    for (
      var u = i[0],
        l = !!this.minimatch.negate,
        f = u._glob,
        h = this.dot || f.charAt(0) === ".",
        c = [],
        d = 0;
      d < a.length;
      d++
    ) {
      var g = a[d];
      if (g.charAt(0) !== "." || h) {
        var C;
        l && !e ? (C = !g.match(u)) : (C = g.match(u)), C && c.push(g);
      }
    }
    var S = c.length;
    if (S === 0) return o();
    if (i.length === 1 && !this.mark && !this.stat) {
      this.matches[n] || (this.matches[n] = Object.create(null));
      for (var d = 0; d < S; d++) {
        var g = c[d];
        e && (e !== "/" ? (g = e + "/" + g) : (g = e + g)),
          g.charAt(0) === "/" && !this.nomount && (g = Ey.join(this.root, g)),
          this._emitMatch(n, g);
      }
      return o();
    }
    i.shift();
    for (var d = 0; d < S; d++) {
      var g = c[d],
        O;
      e && (e !== "/" ? (g = e + "/" + g) : (g = e + g)),
        this._process([g].concat(i), n, s, o);
    }
    o();
  };
  ge.prototype._emitMatch = function (e, t) {
    if (!this.aborted && !JH(this, t)) {
      if (this.paused) {
        this._emitQueue.push([e, t]);
        return;
      }
      var r = Ko(t) ? t : this._makeAbs(t);
      if (
        (this.mark && (t = this._mark(t)),
        this.absolute && (t = r),
        !this.matches[e][t])
      ) {
        if (this.nodir) {
          var i = this.cache[r];
          if (i === "DIR" || Array.isArray(i)) return;
        }
        this.matches[e][t] = !0;
        var n = this.statCache[r];
        n && this.emit("stat", t, n), this.emit("match", t);
      }
    }
  };
  ge.prototype._readdirInGlobStar = function (e, t) {
    if (this.aborted) return;
    if (this.follow) return this._readdir(e, !1, t);
    var r = "lstat\0" + e,
      i = this,
      n = Cy(r, s);
    n && i.fs.lstat(e, n);
    function s(a, o) {
      if (a && a.code === "ENOENT") return t();
      var u = o && o.isSymbolicLink();
      (i.symlinks[e] = u),
        !u && o && !o.isDirectory()
          ? ((i.cache[e] = "FILE"), t())
          : i._readdir(e, !1, t);
    }
  };
  ge.prototype._readdir = function (e, t, r) {
    if (!this.aborted && ((r = Cy("readdir\0" + e + "\0" + t, r)), !!r)) {
      if (t && !Sy(this.symlinks, e)) return this._readdirInGlobStar(e, r);
      if (Sy(this.cache, e)) {
        var i = this.cache[e];
        if (!i || i === "FILE") return r();
        if (Array.isArray(i)) return r(null, i);
      }
      var n = this;
      n.fs.readdir(e, iY(this, e, r));
    }
  };
  function iY(e, t, r) {
    return function (i, n) {
      i ? e._readdirError(t, i, r) : e._readdirEntries(t, n, r);
    };
  }
  ge.prototype._readdirEntries = function (e, t, r) {
    if (!this.aborted) {
      if (!this.mark && !this.stat)
        for (var i = 0; i < t.length; i++) {
          var n = t[i];
          e === "/" ? (n = e + n) : (n = e + "/" + n), (this.cache[n] = !0);
        }
      return (this.cache[e] = t), r(null, t);
    }
  };
  ge.prototype._readdirError = function (e, t, r) {
    if (!this.aborted) {
      switch (t.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var i = this._makeAbs(e);
          if (((this.cache[i] = "FILE"), i === this.cwdAbs)) {
            var n = new Error(t.code + " invalid cwd " + this.cwd);
            (n.path = this.cwd),
              (n.code = t.code),
              this.emit("error", n),
              this.abort();
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(e)] = !1;
          break;
        default:
          (this.cache[this._makeAbs(e)] = !1),
            this.strict && (this.emit("error", t), this.abort()),
            this.silent || console.error("glob error", t);
          break;
      }
      return r();
    }
  };
  ge.prototype._processGlobStar = function (e, t, r, i, n, s, a) {
    var o = this;
    this._readdir(r, s, function (u, l) {
      o._processGlobStar2(e, t, r, i, n, s, l, a);
    });
  };
  ge.prototype._processGlobStar2 = function (e, t, r, i, n, s, a, o) {
    if (!a) return o();
    var u = i.slice(1),
      l = e ? [e] : [],
      f = l.concat(u);
    this._process(f, n, !1, o);
    var h = this.symlinks[r],
      c = a.length;
    if (h && s) return o();
    for (var d = 0; d < c; d++) {
      var g = a[d];
      if (!(g.charAt(0) === "." && !this.dot)) {
        var C = l.concat(a[d], u);
        this._process(C, n, !0, o);
        var S = l.concat(a[d], i);
        this._process(S, n, !0, o);
      }
    }
    o();
  };
  ge.prototype._processSimple = function (e, t, r) {
    var i = this;
    this._stat(e, function (n, s) {
      i._processSimple2(e, t, n, s, r);
    });
  };
  ge.prototype._processSimple2 = function (e, t, r, i, n) {
    if ((this.matches[t] || (this.matches[t] = Object.create(null)), !i))
      return n();
    if (e && Ko(e) && !this.nomount) {
      var s = /[\/\\]$/.test(e);
      e.charAt(0) === "/"
        ? (e = Ey.join(this.root, e))
        : ((e = Ey.resolve(this.root, e)), s && (e += "/"));
    }
    process.platform === "win32" && (e = e.replace(/\\/g, "/")),
      this._emitMatch(t, e),
      n();
  };
  ge.prototype._stat = function (e, t) {
    var r = this._makeAbs(e),
      i = e.slice(-1) === "/";
    if (e.length > this.maxLength) return t();
    if (!this.stat && Sy(this.cache, r)) {
      var n = this.cache[r];
      if ((Array.isArray(n) && (n = "DIR"), !i || n === "DIR"))
        return t(null, n);
      if (i && n === "FILE") return t();
    }
    var s,
      a = this.statCache[r];
    if (a !== void 0) {
      if (a === !1) return t(null, a);
      var o = a.isDirectory() ? "DIR" : "FILE";
      return i && o === "FILE" ? t() : t(null, o, a);
    }
    var u = this,
      l = Cy("stat\0" + r, f);
    l && u.fs.lstat(r, l);
    function f(h, c) {
      if (c && c.isSymbolicLink())
        return u.fs.stat(r, function (d, g) {
          d ? u._stat2(e, r, null, c, t) : u._stat2(e, r, d, g, t);
        });
      u._stat2(e, r, h, c, t);
    }
  };
  ge.prototype._stat2 = function (e, t, r, i, n) {
    if (r && (r.code === "ENOENT" || r.code === "ENOTDIR"))
      return (this.statCache[t] = !1), n();
    var s = e.slice(-1) === "/";
    if (((this.statCache[t] = i), t.slice(-1) === "/" && i && !i.isDirectory()))
      return n(null, !1, i);
    var a = !0;
    return (
      i && (a = i.isDirectory() ? "DIR" : "FILE"),
      (this.cache[t] = this.cache[t] || a),
      s && a === "FILE" ? n() : n(null, a, i)
    );
  };
});
var TR = y((Wee, OR) => {
  var CR = s0(),
    Js = require("path"),
    Oy = mF(),
    nY = OF(),
    sY = jF(),
    aY = WF(),
    oY = by(),
    qn = (OR.exports = {}),
    xR = /[\/\\]/g,
    uY = function (e, t) {
      var r = [];
      return (
        Oy(e).forEach(function (i) {
          var n = i.indexOf("!") === 0;
          n && (i = i.slice(1));
          var s = t(i);
          n ? (r = nY(r, s)) : (r = sY(r, s));
        }),
        r
      );
    };
  qn.exists = function () {
    var e = Js.join.apply(Js, arguments);
    return CR.existsSync(e);
  };
  qn.expand = function (...e) {
    var t = aY(e[0]) ? e.shift() : {},
      r = Array.isArray(e[0]) ? e[0] : e;
    if (r.length === 0) return [];
    var i = uY(r, function (n) {
      return oY.sync(n, t);
    });
    return (
      t.filter &&
        (i = i.filter(function (n) {
          n = Js.join(t.cwd || "", n);
          try {
            return typeof t.filter == "function"
              ? t.filter(n)
              : CR.statSync(n)[t.filter]();
          } catch {
            return !1;
          }
        })),
      i
    );
  };
  qn.expandMapping = function (e, t, r) {
    r = Object.assign(
      {
        rename: function (s, a) {
          return Js.join(s || "", a);
        },
      },
      r,
    );
    var i = [],
      n = {};
    return (
      qn.expand(r, e).forEach(function (s) {
        var a = s;
        r.flatten && (a = Js.basename(a)),
          r.ext && (a = a.replace(/(\.[^\/]*)?$/, r.ext));
        var o = r.rename(t, a, r);
        r.cwd && (s = Js.join(r.cwd, s)),
          (o = o.replace(xR, "/")),
          (s = s.replace(xR, "/")),
          n[o]
            ? n[o].src.push(s)
            : (i.push({ src: [s], dest: o }), (n[o] = i[i.length - 1]));
      }),
      i
    );
  };
  qn.normalizeFilesArray = function (e) {
    var t = [];
    return (
      e.forEach(function (r) {
        var i;
        ("src" in r || "dest" in r) && t.push(r);
      }),
      t.length === 0
        ? []
        : ((t = _(t)
            .chain()
            .forEach(function (r) {
              !("src" in r) ||
                !r.src ||
                (Array.isArray(r.src)
                  ? (r.src = Oy(r.src))
                  : (r.src = [r.src]));
            })
            .map(function (r) {
              var i = Object.assign({}, r);
              if ((delete i.src, delete i.dest, r.expand))
                return qn.expandMapping(r.src, r.dest, i).map(function (s) {
                  var a = Object.assign({}, r);
                  return (
                    (a.orig = Object.assign({}, r)),
                    (a.src = s.src),
                    (a.dest = s.dest),
                    ["expand", "cwd", "flatten", "rename", "ext"].forEach(
                      function (o) {
                        delete a[o];
                      },
                    ),
                    a
                  );
                });
              var n = Object.assign({}, r);
              return (
                (n.orig = Object.assign({}, r)),
                "src" in n &&
                  Object.defineProperty(n, "src", {
                    enumerable: !0,
                    get: function s() {
                      var a;
                      return (
                        "result" in s ||
                          ((a = r.src),
                          (a = Array.isArray(a) ? Oy(a) : [a]),
                          (s.result = qn.expand(i, a))),
                        s.result
                      );
                    },
                  }),
                "dest" in n && (n.dest = r.dest),
                n
              );
            })
            .flatten()
            .value()),
          t)
    );
  };
});
var ea = y((Hee, AR) => {
  var Ty = s0(),
    FR = require("path"),
    Gee = require("util"),
    lY = cT(),
    RR = O0(),
    fY = bT(),
    hY = require("stream").Stream,
    cY = lF().PassThrough,
    Mt = (AR.exports = {});
  Mt.file = TR();
  Mt.collectStream = function (e, t) {
    var r = [],
      i = 0;
    e.on("error", t),
      e.on("data", function (n) {
        r.push(n), (i += n.length);
      }),
      e.on("end", function () {
        var n = new Buffer(i),
          s = 0;
        r.forEach(function (a) {
          a.copy(n, s), (s += a.length);
        }),
          t(null, n);
      });
  };
  Mt.dateify = function (e) {
    return (
      (e = e || new Date()),
      e instanceof Date
        ? (e = e)
        : typeof e == "string"
        ? (e = new Date(e))
        : (e = new Date()),
      e
    );
  };
  Mt.defaults = function (e, t, r) {
    var i = arguments;
    return (i[0] = i[0] || {}), fY(...i);
  };
  Mt.isStream = function (e) {
    return e instanceof hY;
  };
  Mt.lazyReadStream = function (e) {
    return new lY.Readable(function () {
      return Ty.createReadStream(e);
    });
  };
  Mt.normalizeInputSource = function (e) {
    if (e === null) return new Buffer(0);
    if (typeof e == "string") return new Buffer(e);
    if (Mt.isStream(e) && !e._readableState) {
      var t = new cY();
      return e.pipe(t), t;
    }
    return e;
  };
  Mt.sanitizePath = function (e) {
    return RR(e, !1)
      .replace(/^\w+:/, "")
      .replace(/^(\.\.\/|\/)+/, "");
  };
  Mt.trailingSlashIt = function (e) {
    return e.slice(-1) !== "/" ? e + "/" : e;
  };
  Mt.unixifyPath = function (e) {
    return RR(e, !1).replace(/^\w+:/, "");
  };
  Mt.walkdir = function (e, t, r) {
    var i = [];
    typeof t == "function" && ((r = t), (t = e)),
      Ty.readdir(e, function (n, s) {
        var a = 0,
          o,
          u;
        if (n) return r(n);
        (function l() {
          if (((o = s[a++]), !o)) return r(null, i);
          (u = FR.join(e, o)),
            Ty.stat(u, function (f, h) {
              i.push({
                path: u,
                relative: FR.relative(t, u).replace(/\\/g, "/"),
                stats: h,
              }),
                h && h.isDirectory()
                  ? Mt.walkdir(u, t, function (c, d) {
                      d.forEach(function (g) {
                        i.push(g);
                      }),
                        l();
                    })
                  : l();
            });
        })();
      });
  };
});
var LR = y((IR, MR) => {
  /**
   * Archiver Core
   *
   * @ignore
   * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
   * @copyright (c) 2012-2014 Chris Talkington, contributors.
   */ var dY = require("util"),
    pY = {
      ABORTED: "archive was aborted",
      DIRECTORYDIRPATHREQUIRED:
        "diretory dirpath argument must be a non-empty string value",
      DIRECTORYFUNCTIONINVALIDDATA:
        "invalid data returned by directory custom data function",
      ENTRYNAMEREQUIRED: "entry name must be a non-empty string value",
      FILEFILEPATHREQUIRED:
        "file filepath argument must be a non-empty string value",
      FINALIZING: "archive already finalizing",
      QUEUECLOSED: "queue closed",
      NOENDMETHOD: "no suitable finalize/end method defined by module",
      DIRECTORYNOTSUPPORTED:
        "support for directory entries not defined by module",
      FORMATSET: "archive format already set",
      INPUTSTEAMBUFFERREQUIRED:
        "input source must be valid Stream or Buffer instance",
      MODULESET: "module already set",
      SYMLINKNOTSUPPORTED: "support for symlink entries not defined by module",
      SYMLINKFILEPATHREQUIRED:
        "symlink filepath argument must be a non-empty string value",
      SYMLINKTARGETREQUIRED:
        "symlink target argument must be a non-empty string value",
      ENTRYNOTSUPPORTED: "entry not supported",
    };
  function NR(e, t) {
    Error.captureStackTrace(this, this.constructor),
      (this.message = pY[e] || e),
      (this.code = e),
      (this.data = t);
  }
  dY.inherits(NR, Error);
  IR = MR.exports = NR;
});
var jR = y((Yee, kR) => {
  /**
   * Archiver Core
   *
   * @ignore
   * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
   * @copyright (c) 2012-2014 Chris Talkington, contributors.
   */ var Ay = require("fs"),
    PR = sO(),
    qR = oO(),
    Fy = require("path"),
    br = ea(),
    mY = require("util").inherits,
    Fe = LR(),
    BR = st().Transform,
    Ry = process.platform === "win32",
    ce = function (e, t) {
      if (!(this instanceof ce)) return new ce(e, t);
      typeof e != "string" && ((t = e), (e = "zip")),
        (t = this.options =
          br.defaults(t, { highWaterMark: 1024 * 1024, statConcurrency: 4 })),
        BR.call(this, t),
        (this._format = !1),
        (this._module = !1),
        (this._pending = 0),
        (this._pointer = 0),
        (this._entriesCount = 0),
        (this._entriesProcessedCount = 0),
        (this._fsEntriesTotalBytes = 0),
        (this._fsEntriesProcessedBytes = 0),
        (this._queue = qR.queue(this._onQueueTask.bind(this), 1)),
        this._queue.drain(this._onQueueDrain.bind(this)),
        (this._statQueue = qR.queue(
          this._onStatQueueTask.bind(this),
          t.statConcurrency,
        )),
        this._statQueue.drain(this._onQueueDrain.bind(this)),
        (this._state = {
          aborted: !1,
          finalize: !1,
          finalizing: !1,
          finalized: !1,
          modulePiped: !1,
        }),
        (this._streams = []);
    };
  mY(ce, BR);
  ce.prototype._abort = function () {
    (this._state.aborted = !0),
      this._queue.kill(),
      this._statQueue.kill(),
      this._queue.idle() && this._shutdown();
  };
  ce.prototype._append = function (e, t) {
    t = t || {};
    var r = { source: null, filepath: e };
    t.name || (t.name = e),
      (t.sourcePath = e),
      (r.data = t),
      this._entriesCount++,
      t.stats && t.stats instanceof Ay.Stats
        ? ((r = this._updateQueueTaskWithStats(r, t.stats)),
          r &&
            (t.stats.size && (this._fsEntriesTotalBytes += t.stats.size),
            this._queue.push(r)))
        : this._statQueue.push(r);
  };
  ce.prototype._finalize = function () {
    this._state.finalizing ||
      this._state.finalized ||
      this._state.aborted ||
      ((this._state.finalizing = !0),
      this._moduleFinalize(),
      (this._state.finalizing = !1),
      (this._state.finalized = !0));
  };
  ce.prototype._maybeFinalize = function () {
    return this._state.finalizing ||
      this._state.finalized ||
      this._state.aborted
      ? !1
      : this._state.finalize &&
        this._pending === 0 &&
        this._queue.idle() &&
        this._statQueue.idle()
      ? (this._finalize(), !0)
      : !1;
  };
  ce.prototype._moduleAppend = function (e, t, r) {
    if (this._state.aborted) {
      r();
      return;
    }
    this._module.append(
      e,
      t,
      function (i) {
        if (((this._task = null), this._state.aborted)) {
          this._shutdown();
          return;
        }
        if (i) {
          this.emit("error", i), setImmediate(r);
          return;
        }
        this.emit("entry", t),
          this._entriesProcessedCount++,
          t.stats &&
            t.stats.size &&
            (this._fsEntriesProcessedBytes += t.stats.size),
          this.emit("progress", {
            entries: {
              total: this._entriesCount,
              processed: this._entriesProcessedCount,
            },
            fs: {
              totalBytes: this._fsEntriesTotalBytes,
              processedBytes: this._fsEntriesProcessedBytes,
            },
          }),
          setImmediate(r);
      }.bind(this),
    );
  };
  ce.prototype._moduleFinalize = function () {
    typeof this._module.finalize == "function"
      ? this._module.finalize()
      : typeof this._module.end == "function"
      ? this._module.end()
      : this.emit("error", new Fe("NOENDMETHOD"));
  };
  ce.prototype._modulePipe = function () {
    this._module.on("error", this._onModuleError.bind(this)),
      this._module.pipe(this),
      (this._state.modulePiped = !0);
  };
  ce.prototype._moduleSupports = function (e) {
    return !this._module.supports || !this._module.supports[e]
      ? !1
      : this._module.supports[e];
  };
  ce.prototype._moduleUnpipe = function () {
    this._module.unpipe(this), (this._state.modulePiped = !1);
  };
  ce.prototype._normalizeEntryData = function (e, t) {
    (e = br.defaults(e, {
      type: "file",
      name: null,
      date: null,
      mode: null,
      prefix: null,
      sourcePath: null,
      stats: !1,
    })),
      t && e.stats === !1 && (e.stats = t);
    var r = e.type === "directory";
    return (
      e.name &&
        (typeof e.prefix == "string" &&
          e.prefix !== "" &&
          ((e.name = e.prefix + "/" + e.name), (e.prefix = null)),
        (e.name = br.sanitizePath(e.name)),
        e.type !== "symlink" && e.name.slice(-1) === "/"
          ? ((r = !0), (e.type = "directory"))
          : r && (e.name += "/")),
      typeof e.mode == "number"
        ? Ry
          ? (e.mode &= 511)
          : (e.mode &= 4095)
        : e.stats && e.mode === null
        ? (Ry ? (e.mode = e.stats.mode & 511) : (e.mode = e.stats.mode & 4095),
          Ry && r && (e.mode = 493))
        : e.mode === null && (e.mode = r ? 493 : 420),
      e.stats && e.date === null
        ? (e.date = e.stats.mtime)
        : (e.date = br.dateify(e.date)),
      e
    );
  };
  ce.prototype._onModuleError = function (e) {
    this.emit("error", e);
  };
  ce.prototype._onQueueDrain = function () {
    this._state.finalizing ||
      this._state.finalized ||
      this._state.aborted ||
      (this._state.finalize &&
        this._pending === 0 &&
        this._queue.idle() &&
        this._statQueue.idle() &&
        this._finalize());
  };
  ce.prototype._onQueueTask = function (e, t) {
    var r = () => {
      e.data.callback && e.data.callback(), t();
    };
    if (
      this._state.finalizing ||
      this._state.finalized ||
      this._state.aborted
    ) {
      r();
      return;
    }
    (this._task = e), this._moduleAppend(e.source, e.data, r);
  };
  ce.prototype._onStatQueueTask = function (e, t) {
    if (
      this._state.finalizing ||
      this._state.finalized ||
      this._state.aborted
    ) {
      t();
      return;
    }
    Ay.lstat(
      e.filepath,
      function (r, i) {
        if (this._state.aborted) {
          setImmediate(t);
          return;
        }
        if (r) {
          this._entriesCount--, this.emit("warning", r), setImmediate(t);
          return;
        }
        (e = this._updateQueueTaskWithStats(e, i)),
          e &&
            (i.size && (this._fsEntriesTotalBytes += i.size),
            this._queue.push(e)),
          setImmediate(t);
      }.bind(this),
    );
  };
  ce.prototype._shutdown = function () {
    this._moduleUnpipe(), this.end();
  };
  ce.prototype._transform = function (e, t, r) {
    e && (this._pointer += e.length), r(null, e);
  };
  ce.prototype._updateQueueTaskWithStats = function (e, t) {
    if (t.isFile())
      (e.data.type = "file"),
        (e.data.sourceType = "stream"),
        (e.source = br.lazyReadStream(e.filepath));
    else if (t.isDirectory() && this._moduleSupports("directory"))
      (e.data.name = br.trailingSlashIt(e.data.name)),
        (e.data.type = "directory"),
        (e.data.sourcePath = br.trailingSlashIt(e.filepath)),
        (e.data.sourceType = "buffer"),
        (e.source = Buffer.concat([]));
    else if (t.isSymbolicLink() && this._moduleSupports("symlink")) {
      var r = Ay.readlinkSync(e.filepath),
        i = Fy.dirname(e.filepath);
      (e.data.type = "symlink"),
        (e.data.linkname = Fy.relative(i, Fy.resolve(i, r))),
        (e.data.sourceType = "buffer"),
        (e.source = Buffer.concat([]));
    } else
      return (
        t.isDirectory()
          ? this.emit("warning", new Fe("DIRECTORYNOTSUPPORTED", e.data))
          : t.isSymbolicLink()
          ? this.emit("warning", new Fe("SYMLINKNOTSUPPORTED", e.data))
          : this.emit("warning", new Fe("ENTRYNOTSUPPORTED", e.data)),
        null
      );
    return (e.data = this._normalizeEntryData(e.data, t)), e;
  };
  ce.prototype.abort = function () {
    return this._state.aborted || this._state.finalized
      ? this
      : (this._abort(), this);
  };
  ce.prototype.append = function (e, t) {
    if (this._state.finalize || this._state.aborted)
      return this.emit("error", new Fe("QUEUECLOSED")), this;
    if (
      ((t = this._normalizeEntryData(t)),
      typeof t.name != "string" || t.name.length === 0)
    )
      return this.emit("error", new Fe("ENTRYNAMEREQUIRED")), this;
    if (t.type === "directory" && !this._moduleSupports("directory"))
      return (
        this.emit("error", new Fe("DIRECTORYNOTSUPPORTED", { name: t.name })),
        this
      );
    if (((e = br.normalizeInputSource(e)), Buffer.isBuffer(e)))
      t.sourceType = "buffer";
    else if (br.isStream(e)) t.sourceType = "stream";
    else
      return (
        this.emit(
          "error",
          new Fe("INPUTSTEAMBUFFERREQUIRED", { name: t.name }),
        ),
        this
      );
    return this._entriesCount++, this._queue.push({ data: t, source: e }), this;
  };
  ce.prototype.directory = function (e, t, r) {
    if (this._state.finalize || this._state.aborted)
      return this.emit("error", new Fe("QUEUECLOSED")), this;
    if (typeof e != "string" || e.length === 0)
      return this.emit("error", new Fe("DIRECTORYDIRPATHREQUIRED")), this;
    this._pending++, t === !1 ? (t = "") : typeof t != "string" && (t = e);
    var i = !1;
    typeof r == "function"
      ? ((i = r), (r = {}))
      : typeof r != "object" && (r = {});
    var n = { stat: !0, dot: !0 };
    function s() {
      this._pending--, this._maybeFinalize();
    }
    function a(l) {
      this.emit("error", l);
    }
    function o(l) {
      u.pause();
      var f = !1,
        h = Object.assign({}, r);
      (h.name = l.relative),
        (h.prefix = t),
        (h.stats = l.stat),
        (h.callback = u.resume.bind(u));
      try {
        if (i) {
          if (((h = i(h)), h === !1)) f = !0;
          else if (typeof h != "object")
            throw new Fe("DIRECTORYFUNCTIONINVALIDDATA", { dirpath: e });
        }
      } catch (c) {
        this.emit("error", c);
        return;
      }
      if (f) {
        u.resume();
        return;
      }
      this._append(l.absolute, h);
    }
    var u = PR(e, n);
    return (
      u.on("error", a.bind(this)),
      u.on("match", o.bind(this)),
      u.on("end", s.bind(this)),
      this
    );
  };
  ce.prototype.file = function (e, t) {
    return this._state.finalize || this._state.aborted
      ? (this.emit("error", new Fe("QUEUECLOSED")), this)
      : typeof e != "string" || e.length === 0
      ? (this.emit("error", new Fe("FILEFILEPATHREQUIRED")), this)
      : (this._append(e, t), this);
  };
  ce.prototype.glob = function (e, t, r) {
    this._pending++, (t = br.defaults(t, { stat: !0, pattern: e }));
    function i() {
      this._pending--, this._maybeFinalize();
    }
    function n(o) {
      this.emit("error", o);
    }
    function s(o) {
      a.pause();
      var u = Object.assign({}, r);
      (u.callback = a.resume.bind(a)),
        (u.stats = o.stat),
        (u.name = o.relative),
        this._append(o.absolute, u);
    }
    var a = PR(t.cwd || ".", t);
    return (
      a.on("error", n.bind(this)),
      a.on("match", s.bind(this)),
      a.on("end", i.bind(this)),
      this
    );
  };
  ce.prototype.finalize = function () {
    if (this._state.aborted) {
      var e = new Fe("ABORTED");
      return this.emit("error", e), Promise.reject(e);
    }
    if (this._state.finalize) {
      var t = new Fe("FINALIZING");
      return this.emit("error", t), Promise.reject(t);
    }
    (this._state.finalize = !0),
      this._pending === 0 &&
        this._queue.idle() &&
        this._statQueue.idle() &&
        this._finalize();
    var r = this;
    return new Promise(function (i, n) {
      var s;
      r._module.on("end", function () {
        s || i();
      }),
        r._module.on("error", function (a) {
          (s = !0), n(a);
        });
    });
  };
  ce.prototype.setFormat = function (e) {
    return this._format
      ? (this.emit("error", new Fe("FORMATSET")), this)
      : ((this._format = e), this);
  };
  ce.prototype.setModule = function (e) {
    return this._state.aborted
      ? (this.emit("error", new Fe("ABORTED")), this)
      : this._state.module
      ? (this.emit("error", new Fe("MODULESET")), this)
      : ((this._module = e), this._modulePipe(), this);
  };
  ce.prototype.symlink = function (e, t, r) {
    if (this._state.finalize || this._state.aborted)
      return this.emit("error", new Fe("QUEUECLOSED")), this;
    if (typeof e != "string" || e.length === 0)
      return this.emit("error", new Fe("SYMLINKFILEPATHREQUIRED")), this;
    if (typeof t != "string" || t.length === 0)
      return (
        this.emit("error", new Fe("SYMLINKTARGETREQUIRED", { filepath: e })),
        this
      );
    if (!this._moduleSupports("symlink"))
      return (
        this.emit("error", new Fe("SYMLINKNOTSUPPORTED", { filepath: e })), this
      );
    var i = {};
    return (
      (i.type = "symlink"),
      (i.name = e.replace(/\\/g, "/")),
      (i.linkname = t.replace(/\\/g, "/")),
      (i.sourceType = "buffer"),
      typeof r == "number" && (i.mode = r),
      this._entriesCount++,
      this._queue.push({ data: i, source: Buffer.concat([]) }),
      this
    );
  };
  ce.prototype.pointer = function () {
    return this._pointer;
  };
  ce.prototype.use = function (e) {
    return this._streams.push(e), this;
  };
  kR.exports = ce;
});
var ic = y((Vee, UR) => {
  var rc = (UR.exports = function () {});
  rc.prototype.getName = function () {};
  rc.prototype.getSize = function () {};
  rc.prototype.getLastModifiedDate = function () {};
  rc.prototype.isDirectory = function () {};
});
var nc = y((Xee, zR) => {
  var Vt = (zR.exports = {});
  Vt.dateToDos = function (e, t) {
    t = t || !1;
    var r = t ? e.getFullYear() : e.getUTCFullYear();
    if (r < 1980) return 2162688;
    if (r >= 2044) return 2141175677;
    var i = {
      year: r,
      month: t ? e.getMonth() : e.getUTCMonth(),
      date: t ? e.getDate() : e.getUTCDate(),
      hours: t ? e.getHours() : e.getUTCHours(),
      minutes: t ? e.getMinutes() : e.getUTCMinutes(),
      seconds: t ? e.getSeconds() : e.getUTCSeconds(),
    };
    return (
      ((i.year - 1980) << 25) |
      ((i.month + 1) << 21) |
      (i.date << 16) |
      (i.hours << 11) |
      (i.minutes << 5) |
      (i.seconds / 2)
    );
  };
  Vt.dosToDate = function (e) {
    return new Date(
      ((e >> 25) & 127) + 1980,
      ((e >> 21) & 15) - 1,
      (e >> 16) & 31,
      (e >> 11) & 31,
      (e >> 5) & 63,
      (e & 31) << 1,
    );
  };
  Vt.fromDosTime = function (e) {
    return Vt.dosToDate(e.readUInt32LE(0));
  };
  Vt.getEightBytes = function (e) {
    var t = Buffer.alloc(8);
    return (
      t.writeUInt32LE(e % 4294967296, 0),
      t.writeUInt32LE((e / 4294967296) | 0, 4),
      t
    );
  };
  Vt.getShortBytes = function (e) {
    var t = Buffer.alloc(2);
    return t.writeUInt16LE((e & 65535) >>> 0, 0), t;
  };
  Vt.getShortBytesValue = function (e, t) {
    return e.readUInt16LE(t);
  };
  Vt.getLongBytes = function (e) {
    var t = Buffer.alloc(4);
    return t.writeUInt32LE((e & 4294967295) >>> 0, 0), t;
  };
  Vt.getLongBytesValue = function (e, t) {
    return e.readUInt32LE(t);
  };
  Vt.toDosTime = function (e) {
    return Vt.getLongBytes(Vt.dateToDos(e));
  };
});
var Ny = y((Zee, VR) => {
  var $R = nc(),
    WR = 1 << 3,
    GR = 1 << 0,
    gY = 1 << 2,
    yY = 1 << 1,
    HR = 1 << 6,
    YR = 1 << 11,
    tt = (VR.exports = function () {
      return this instanceof tt
        ? ((this.descriptor = !1),
          (this.encryption = !1),
          (this.utf8 = !1),
          (this.numberOfShannonFanoTrees = 0),
          (this.strongEncryption = !1),
          (this.slidingDictionarySize = 0),
          this)
        : new tt();
    });
  tt.prototype.encode = function () {
    return $R.getShortBytes(
      (this.descriptor ? WR : 0) |
        (this.utf8 ? YR : 0) |
        (this.encryption ? GR : 0) |
        (this.strongEncryption ? HR : 0),
    );
  };
  tt.prototype.parse = function (e, t) {
    var r = $R.getShortBytesValue(e, t),
      i = new tt();
    return (
      i.useDataDescriptor((r & WR) !== 0),
      i.useUTF8ForNames((r & YR) !== 0),
      i.useStrongEncryption((r & HR) !== 0),
      i.useEncryption((r & GR) !== 0),
      i.setSlidingDictionarySize((r & yY) !== 0 ? 8192 : 4096),
      i.setNumberOfShannonFanoTrees((r & gY) !== 0 ? 3 : 2),
      i
    );
  };
  tt.prototype.setNumberOfShannonFanoTrees = function (e) {
    this.numberOfShannonFanoTrees = e;
  };
  tt.prototype.getNumberOfShannonFanoTrees = function () {
    return this.numberOfShannonFanoTrees;
  };
  tt.prototype.setSlidingDictionarySize = function (e) {
    this.slidingDictionarySize = e;
  };
  tt.prototype.getSlidingDictionarySize = function () {
    return this.slidingDictionarySize;
  };
  tt.prototype.useDataDescriptor = function (e) {
    this.descriptor = e;
  };
  tt.prototype.usesDataDescriptor = function () {
    return this.descriptor;
  };
  tt.prototype.useEncryption = function (e) {
    this.encryption = e;
  };
  tt.prototype.usesEncryption = function () {
    return this.encryption;
  };
  tt.prototype.useStrongEncryption = function (e) {
    this.strongEncryption = e;
  };
  tt.prototype.usesStrongEncryption = function () {
    return this.strongEncryption;
  };
  tt.prototype.useUTF8ForNames = function (e) {
    this.utf8 = e;
  };
  tt.prototype.usesUTF8ForNames = function () {
    return this.utf8;
  };
});
var ZR = y((Kee, XR) => {
  XR.exports = {
    PERM_MASK: 4095,
    FILE_TYPE_FLAG: 61440,
    LINK_FLAG: 40960,
    FILE_FLAG: 32768,
    DIR_FLAG: 16384,
    DEFAULT_LINK_PERM: 511,
    DEFAULT_DIR_PERM: 493,
    DEFAULT_FILE_PERM: 420,
  };
});
var Iy = y((Qee, KR) => {
  KR.exports = {
    WORD: 4,
    DWORD: 8,
    EMPTY: Buffer.alloc(0),
    SHORT: 2,
    SHORT_MASK: 65535,
    SHORT_SHIFT: 16,
    SHORT_ZERO: Buffer.from(Array(2)),
    LONG: 4,
    LONG_ZERO: Buffer.from(Array(4)),
    MIN_VERSION_INITIAL: 10,
    MIN_VERSION_DATA_DESCRIPTOR: 20,
    MIN_VERSION_ZIP64: 45,
    VERSION_MADEBY: 45,
    METHOD_STORED: 0,
    METHOD_DEFLATED: 8,
    PLATFORM_UNIX: 3,
    PLATFORM_FAT: 0,
    SIG_LFH: 67324752,
    SIG_DD: 134695760,
    SIG_CFH: 33639248,
    SIG_EOCD: 101010256,
    SIG_ZIP64_EOCD: 101075792,
    SIG_ZIP64_EOCD_LOC: 117853008,
    ZIP64_MAGIC_SHORT: 65535,
    ZIP64_MAGIC: 4294967295,
    ZIP64_EXTRA_ID: 1,
    ZLIB_NO_COMPRESSION: 0,
    ZLIB_BEST_SPEED: 1,
    ZLIB_BEST_COMPRESSION: 9,
    ZLIB_DEFAULT_COMPRESSION: -1,
    MODE_MASK: 4095,
    DEFAULT_FILE_MODE: 33188,
    DEFAULT_DIR_MODE: 16877,
    EXT_FILE_ATTR_DIR: 1106051088,
    EXT_FILE_ATTR_FILE: 2175008800,
    S_IFMT: 61440,
    S_IFIFO: 4096,
    S_IFCHR: 8192,
    S_IFDIR: 16384,
    S_IFBLK: 24576,
    S_IFREG: 32768,
    S_IFLNK: 40960,
    S_IFSOCK: 49152,
    S_DOS_A: 32,
    S_DOS_D: 16,
    S_DOS_V: 8,
    S_DOS_S: 4,
    S_DOS_H: 2,
    S_DOS_R: 1,
  };
});
var My = y((Jee, rA) => {
  var vY = require("util").inherits,
    wY = O0(),
    JR = ic(),
    eA = Ny(),
    QR = ZR(),
    pt = Iy(),
    tA = nc(),
    re = (rA.exports = function (e) {
      if (!(this instanceof re)) return new re(e);
      JR.call(this),
        (this.platform = pt.PLATFORM_FAT),
        (this.method = -1),
        (this.name = null),
        (this.size = 0),
        (this.csize = 0),
        (this.gpb = new eA()),
        (this.crc = 0),
        (this.time = -1),
        (this.minver = pt.MIN_VERSION_INITIAL),
        (this.mode = -1),
        (this.extra = null),
        (this.exattr = 0),
        (this.inattr = 0),
        (this.comment = null),
        e && this.setName(e);
    });
  vY(re, JR);
  re.prototype.getCentralDirectoryExtra = function () {
    return this.getExtra();
  };
  re.prototype.getComment = function () {
    return this.comment !== null ? this.comment : "";
  };
  re.prototype.getCompressedSize = function () {
    return this.csize;
  };
  re.prototype.getCrc = function () {
    return this.crc;
  };
  re.prototype.getExternalAttributes = function () {
    return this.exattr;
  };
  re.prototype.getExtra = function () {
    return this.extra !== null ? this.extra : pt.EMPTY;
  };
  re.prototype.getGeneralPurposeBit = function () {
    return this.gpb;
  };
  re.prototype.getInternalAttributes = function () {
    return this.inattr;
  };
  re.prototype.getLastModifiedDate = function () {
    return this.getTime();
  };
  re.prototype.getLocalFileDataExtra = function () {
    return this.getExtra();
  };
  re.prototype.getMethod = function () {
    return this.method;
  };
  re.prototype.getName = function () {
    return this.name;
  };
  re.prototype.getPlatform = function () {
    return this.platform;
  };
  re.prototype.getSize = function () {
    return this.size;
  };
  re.prototype.getTime = function () {
    return this.time !== -1 ? tA.dosToDate(this.time) : -1;
  };
  re.prototype.getTimeDos = function () {
    return this.time !== -1 ? this.time : 0;
  };
  re.prototype.getUnixMode = function () {
    return this.platform !== pt.PLATFORM_UNIX
      ? 0
      : (this.getExternalAttributes() >> pt.SHORT_SHIFT) & pt.SHORT_MASK;
  };
  re.prototype.getVersionNeededToExtract = function () {
    return this.minver;
  };
  re.prototype.setComment = function (e) {
    Buffer.byteLength(e) !== e.length &&
      this.getGeneralPurposeBit().useUTF8ForNames(!0),
      (this.comment = e);
  };
  re.prototype.setCompressedSize = function (e) {
    if (e < 0) throw new Error("invalid entry compressed size");
    this.csize = e;
  };
  re.prototype.setCrc = function (e) {
    if (e < 0) throw new Error("invalid entry crc32");
    this.crc = e;
  };
  re.prototype.setExternalAttributes = function (e) {
    this.exattr = e >>> 0;
  };
  re.prototype.setExtra = function (e) {
    this.extra = e;
  };
  re.prototype.setGeneralPurposeBit = function (e) {
    if (!(e instanceof eA)) throw new Error("invalid entry GeneralPurposeBit");
    this.gpb = e;
  };
  re.prototype.setInternalAttributes = function (e) {
    this.inattr = e;
  };
  re.prototype.setMethod = function (e) {
    if (e < 0) throw new Error("invalid entry compression method");
    this.method = e;
  };
  re.prototype.setName = function (e, t = !1) {
    (e = wY(e, !1)
      .replace(/^\w+:/, "")
      .replace(/^(\.\.\/|\/)+/, "")),
      t && (e = `/${e}`),
      Buffer.byteLength(e) !== e.length &&
        this.getGeneralPurposeBit().useUTF8ForNames(!0),
      (this.name = e);
  };
  re.prototype.setPlatform = function (e) {
    this.platform = e;
  };
  re.prototype.setSize = function (e) {
    if (e < 0) throw new Error("invalid entry size");
    this.size = e;
  };
  re.prototype.setTime = function (e, t) {
    if (!(e instanceof Date)) throw new Error("invalid entry time");
    this.time = tA.dateToDos(e, t);
  };
  re.prototype.setUnixMode = function (e) {
    e |= this.isDirectory() ? pt.S_IFDIR : pt.S_IFREG;
    var t = 0;
    (t |=
      (e << pt.SHORT_SHIFT) | (this.isDirectory() ? pt.S_DOS_D : pt.S_DOS_A)),
      this.setExternalAttributes(t),
      (this.mode = e & pt.MODE_MASK),
      (this.platform = pt.PLATFORM_UNIX);
  };
  re.prototype.setVersionNeededToExtract = function (e) {
    this.minver = e;
  };
  re.prototype.isDirectory = function () {
    return this.getName().slice(-1) === "/";
  };
  re.prototype.isUnixSymlink = function () {
    return (this.getUnixMode() & QR.FILE_TYPE_FLAG) === QR.LINK_FLAG;
  };
  re.prototype.isZip64 = function () {
    return this.csize > pt.ZIP64_MAGIC || this.size > pt.ZIP64_MAGIC;
  };
});
var qy = y((ete, iA) => {
  var DY = require("stream").Stream,
    bY = st().PassThrough,
    Ly = (iA.exports = {});
  Ly.isStream = function (e) {
    return e instanceof DY;
  };
  Ly.normalizeInputSource = function (e) {
    if (e === null) return Buffer.alloc(0);
    if (typeof e == "string") return Buffer.from(e);
    if (Ly.isStream(e) && !e._readableState) {
      var t = new bY();
      return e.pipe(t), t;
    }
    return e;
  };
});
var By = y((tte, sA) => {
  var EY = require("util").inherits,
    Py = st().Transform,
    _Y = ic(),
    nA = qy(),
    Lt = (sA.exports = function (e) {
      if (!(this instanceof Lt)) return new Lt(e);
      Py.call(this, e),
        (this.offset = 0),
        (this._archive = { finish: !1, finished: !1, processing: !1 });
    });
  EY(Lt, Py);
  Lt.prototype._appendBuffer = function (e, t, r) {};
  Lt.prototype._appendStream = function (e, t, r) {};
  Lt.prototype._emitErrorCallback = function (e) {
    e && this.emit("error", e);
  };
  Lt.prototype._finish = function (e) {};
  Lt.prototype._normalizeEntry = function (e) {};
  Lt.prototype._transform = function (e, t, r) {
    r(null, e);
  };
  Lt.prototype.entry = function (e, t, r) {
    if (
      ((t = t || null),
      typeof r != "function" && (r = this._emitErrorCallback.bind(this)),
      !(e instanceof _Y))
    ) {
      r(new Error("not a valid instance of ArchiveEntry"));
      return;
    }
    if (this._archive.finish || this._archive.finished) {
      r(new Error("unacceptable entry after finish"));
      return;
    }
    if (this._archive.processing) {
      r(new Error("already processing an entry"));
      return;
    }
    if (
      ((this._archive.processing = !0),
      this._normalizeEntry(e),
      (this._entry = e),
      (t = nA.normalizeInputSource(t)),
      Buffer.isBuffer(t))
    )
      this._appendBuffer(e, t, r);
    else if (nA.isStream(t)) this._appendStream(e, t, r);
    else {
      (this._archive.processing = !1),
        r(new Error("input source must be valid Stream or Buffer instance"));
      return;
    }
    return this;
  };
  Lt.prototype.finish = function () {
    if (this._archive.processing) {
      this._archive.finish = !0;
      return;
    }
    this._finish();
  };
  Lt.prototype.getBytesWritten = function () {
    return this.offset;
  };
  Lt.prototype.write = function (e, t) {
    return e && (this.offset += e.length), Py.prototype.write.call(this, e, t);
  };
});
var jy = y((ky) => {
  /*! crc32.js (C) 2014-present SheetJS -- http://sheetjs.com */ var aA;
  (function (e) {
    typeof DO_NOT_EXPORT_CRC > "u"
      ? typeof ky == "object"
        ? e(ky)
        : typeof define == "function" && define.amd
        ? define(function () {
            var t = {};
            return e(t), t;
          })
        : e((aA = {}))
      : e((aA = {}));
  })(function (e) {
    e.version = "1.2.2";
    function t() {
      for (var x = 0, A = new Array(256), p = 0; p != 256; ++p)
        (x = p),
          (x = x & 1 ? -306674912 ^ (x >>> 1) : x >>> 1),
          (x = x & 1 ? -306674912 ^ (x >>> 1) : x >>> 1),
          (x = x & 1 ? -306674912 ^ (x >>> 1) : x >>> 1),
          (x = x & 1 ? -306674912 ^ (x >>> 1) : x >>> 1),
          (x = x & 1 ? -306674912 ^ (x >>> 1) : x >>> 1),
          (x = x & 1 ? -306674912 ^ (x >>> 1) : x >>> 1),
          (x = x & 1 ? -306674912 ^ (x >>> 1) : x >>> 1),
          (x = x & 1 ? -306674912 ^ (x >>> 1) : x >>> 1),
          (A[p] = x);
      return typeof Int32Array < "u" ? new Int32Array(A) : A;
    }
    var r = t();
    function i(x) {
      var A = 0,
        p = 0,
        T = 0,
        R = typeof Int32Array < "u" ? new Int32Array(4096) : new Array(4096);
      for (T = 0; T != 256; ++T) R[T] = x[T];
      for (T = 0; T != 256; ++T)
        for (p = x[T], A = 256 + T; A < 4096; A += 256)
          p = R[A] = (p >>> 8) ^ x[p & 255];
      var k = [];
      for (T = 1; T != 16; ++T)
        k[T - 1] =
          typeof Int32Array < "u"
            ? R.subarray(T * 256, T * 256 + 256)
            : R.slice(T * 256, T * 256 + 256);
      return k;
    }
    var n = i(r),
      s = n[0],
      a = n[1],
      o = n[2],
      u = n[3],
      l = n[4],
      f = n[5],
      h = n[6],
      c = n[7],
      d = n[8],
      g = n[9],
      C = n[10],
      S = n[11],
      O = n[12],
      L = n[13],
      D = n[14];
    function w(x, A) {
      for (var p = A ^ -1, T = 0, R = x.length; T < R; )
        p = (p >>> 8) ^ r[(p ^ x.charCodeAt(T++)) & 255];
      return ~p;
    }
    function F(x, A) {
      for (var p = A ^ -1, T = x.length - 15, R = 0; R < T; )
        p =
          D[x[R++] ^ (p & 255)] ^
          L[x[R++] ^ ((p >> 8) & 255)] ^
          O[x[R++] ^ ((p >> 16) & 255)] ^
          S[x[R++] ^ (p >>> 24)] ^
          C[x[R++]] ^
          g[x[R++]] ^
          d[x[R++]] ^
          c[x[R++]] ^
          h[x[R++]] ^
          f[x[R++]] ^
          l[x[R++]] ^
          u[x[R++]] ^
          o[x[R++]] ^
          a[x[R++]] ^
          s[x[R++]] ^
          r[x[R++]];
      for (T += 15; R < T; ) p = (p >>> 8) ^ r[(p ^ x[R++]) & 255];
      return ~p;
    }
    function m(x, A) {
      for (var p = A ^ -1, T = 0, R = x.length, k = 0, z = 0; T < R; )
        (k = x.charCodeAt(T++)),
          k < 128
            ? (p = (p >>> 8) ^ r[(p ^ k) & 255])
            : k < 2048
            ? ((p = (p >>> 8) ^ r[(p ^ (192 | ((k >> 6) & 31))) & 255]),
              (p = (p >>> 8) ^ r[(p ^ (128 | (k & 63))) & 255]))
            : k >= 55296 && k < 57344
            ? ((k = (k & 1023) + 64),
              (z = x.charCodeAt(T++) & 1023),
              (p = (p >>> 8) ^ r[(p ^ (240 | ((k >> 8) & 7))) & 255]),
              (p = (p >>> 8) ^ r[(p ^ (128 | ((k >> 2) & 63))) & 255]),
              (p =
                (p >>> 8) ^
                r[(p ^ (128 | ((z >> 6) & 15) | ((k & 3) << 4))) & 255]),
              (p = (p >>> 8) ^ r[(p ^ (128 | (z & 63))) & 255]))
            : ((p = (p >>> 8) ^ r[(p ^ (224 | ((k >> 12) & 15))) & 255]),
              (p = (p >>> 8) ^ r[(p ^ (128 | ((k >> 6) & 63))) & 255]),
              (p = (p >>> 8) ^ r[(p ^ (128 | (k & 63))) & 255]));
      return ~p;
    }
    (e.table = r), (e.bstr = w), (e.buf = F), (e.str = m);
  });
});
var uA = y((ite, oA) => {
  "use strict";
  var { Transform: SY } = st(),
    xY = jy(),
    Uy = class extends SY {
      constructor(t) {
        super(t),
          (this.checksum = Buffer.allocUnsafe(4)),
          this.checksum.writeInt32BE(0, 0),
          (this.rawSize = 0);
      }
      _transform(t, r, i) {
        t &&
          ((this.checksum = xY.buf(t, this.checksum) >>> 0),
          (this.rawSize += t.length)),
          i(null, t);
      }
      digest(t) {
        let r = Buffer.allocUnsafe(4);
        return r.writeUInt32BE(this.checksum >>> 0, 0), t ? r.toString(t) : r;
      }
      hex() {
        return this.digest("hex").toUpperCase();
      }
      size() {
        return this.rawSize;
      }
    };
  oA.exports = Uy;
});
var fA = y((nte, lA) => {
  "use strict";
  var { DeflateRaw: CY } = require("zlib"),
    OY = jy(),
    zy = class extends CY {
      constructor(t) {
        super(t),
          (this.checksum = Buffer.allocUnsafe(4)),
          this.checksum.writeInt32BE(0, 0),
          (this.rawSize = 0),
          (this.compressedSize = 0);
      }
      push(t, r) {
        return t && (this.compressedSize += t.length), super.push(t, r);
      }
      _transform(t, r, i) {
        t &&
          ((this.checksum = OY.buf(t, this.checksum) >>> 0),
          (this.rawSize += t.length)),
          super._transform(t, r, i);
      }
      digest(t) {
        let r = Buffer.allocUnsafe(4);
        return r.writeUInt32BE(this.checksum >>> 0, 0), t ? r.toString(t) : r;
      }
      hex() {
        return this.digest("hex").toUpperCase();
      }
      size(t = !1) {
        return t ? this.compressedSize : this.rawSize;
      }
    };
  lA.exports = zy;
});
var $y = y((ste, hA) => {
  "use strict";
  hA.exports = { CRC32Stream: uA(), DeflateCRC32Stream: fA() };
});
var pA = y((lte, dA) => {
  var TY = require("util").inherits,
    FY = tl(),
    { CRC32Stream: RY } = $y(),
    { DeflateCRC32Stream: AY } = $y(),
    cA = By(),
    ate = My(),
    ote = Ny(),
    ee = Iy(),
    ute = qy(),
    Z = nc(),
    He = (dA.exports = function (e) {
      if (!(this instanceof He)) return new He(e);
      (e = this.options = this._defaults(e)),
        cA.call(this, e),
        (this._entry = null),
        (this._entries = []),
        (this._archive = {
          centralLength: 0,
          centralOffset: 0,
          comment: "",
          finish: !1,
          finished: !1,
          processing: !1,
          forceZip64: e.forceZip64,
          forceLocalTime: e.forceLocalTime,
        });
    });
  TY(He, cA);
  He.prototype._afterAppend = function (e) {
    this._entries.push(e),
      e.getGeneralPurposeBit().usesDataDescriptor() &&
        this._writeDataDescriptor(e),
      (this._archive.processing = !1),
      (this._entry = null),
      this._archive.finish && !this._archive.finished && this._finish();
  };
  He.prototype._appendBuffer = function (e, t, r) {
    t.length === 0 && e.setMethod(ee.METHOD_STORED);
    var i = e.getMethod();
    if (
      (i === ee.METHOD_STORED &&
        (e.setSize(t.length),
        e.setCompressedSize(t.length),
        e.setCrc(FY.unsigned(t))),
      this._writeLocalFileHeader(e),
      i === ee.METHOD_STORED)
    ) {
      this.write(t), this._afterAppend(e), r(null, e);
      return;
    } else if (i === ee.METHOD_DEFLATED) {
      this._smartStream(e, r).end(t);
      return;
    } else {
      r(new Error("compression method " + i + " not implemented"));
      return;
    }
  };
  He.prototype._appendStream = function (e, t, r) {
    e.getGeneralPurposeBit().useDataDescriptor(!0),
      e.setVersionNeededToExtract(ee.MIN_VERSION_DATA_DESCRIPTOR),
      this._writeLocalFileHeader(e);
    var i = this._smartStream(e, r);
    t.once("error", function (n) {
      i.emit("error", n), i.end();
    }),
      t.pipe(i);
  };
  He.prototype._defaults = function (e) {
    return (
      typeof e != "object" && (e = {}),
      typeof e.zlib != "object" && (e.zlib = {}),
      typeof e.zlib.level != "number" && (e.zlib.level = ee.ZLIB_BEST_SPEED),
      (e.forceZip64 = !!e.forceZip64),
      (e.forceLocalTime = !!e.forceLocalTime),
      e
    );
  };
  He.prototype._finish = function () {
    (this._archive.centralOffset = this.offset),
      this._entries.forEach(
        function (e) {
          this._writeCentralFileHeader(e);
        }.bind(this),
      ),
      (this._archive.centralLength = this.offset - this._archive.centralOffset),
      this.isZip64() && this._writeCentralDirectoryZip64(),
      this._writeCentralDirectoryEnd(),
      (this._archive.processing = !1),
      (this._archive.finish = !0),
      (this._archive.finished = !0),
      this.end();
  };
  He.prototype._normalizeEntry = function (e) {
    e.getMethod() === -1 && e.setMethod(ee.METHOD_DEFLATED),
      e.getMethod() === ee.METHOD_DEFLATED &&
        (e.getGeneralPurposeBit().useDataDescriptor(!0),
        e.setVersionNeededToExtract(ee.MIN_VERSION_DATA_DESCRIPTOR)),
      e.getTime() === -1 && e.setTime(new Date(), this._archive.forceLocalTime),
      (e._offsets = { file: 0, data: 0, contents: 0 });
  };
  He.prototype._smartStream = function (e, t) {
    var r = e.getMethod() === ee.METHOD_DEFLATED,
      i = r ? new AY(this.options.zlib) : new RY(),
      n = null;
    function s() {
      var a = i.digest().readUInt32BE(0);
      e.setCrc(a),
        e.setSize(i.size()),
        e.setCompressedSize(i.size(!0)),
        this._afterAppend(e),
        t(n, e);
    }
    return (
      i.once("end", s.bind(this)),
      i.once("error", function (a) {
        n = a;
      }),
      i.pipe(this, { end: !1 }),
      i
    );
  };
  He.prototype._writeCentralDirectoryEnd = function () {
    var e = this._entries.length,
      t = this._archive.centralLength,
      r = this._archive.centralOffset;
    this.isZip64() &&
      ((e = ee.ZIP64_MAGIC_SHORT), (t = ee.ZIP64_MAGIC), (r = ee.ZIP64_MAGIC)),
      this.write(Z.getLongBytes(ee.SIG_EOCD)),
      this.write(ee.SHORT_ZERO),
      this.write(ee.SHORT_ZERO),
      this.write(Z.getShortBytes(e)),
      this.write(Z.getShortBytes(e)),
      this.write(Z.getLongBytes(t)),
      this.write(Z.getLongBytes(r));
    var i = this.getComment(),
      n = Buffer.byteLength(i);
    this.write(Z.getShortBytes(n)), this.write(i);
  };
  He.prototype._writeCentralDirectoryZip64 = function () {
    this.write(Z.getLongBytes(ee.SIG_ZIP64_EOCD)),
      this.write(Z.getEightBytes(44)),
      this.write(Z.getShortBytes(ee.MIN_VERSION_ZIP64)),
      this.write(Z.getShortBytes(ee.MIN_VERSION_ZIP64)),
      this.write(ee.LONG_ZERO),
      this.write(ee.LONG_ZERO),
      this.write(Z.getEightBytes(this._entries.length)),
      this.write(Z.getEightBytes(this._entries.length)),
      this.write(Z.getEightBytes(this._archive.centralLength)),
      this.write(Z.getEightBytes(this._archive.centralOffset)),
      this.write(Z.getLongBytes(ee.SIG_ZIP64_EOCD_LOC)),
      this.write(ee.LONG_ZERO),
      this.write(
        Z.getEightBytes(
          this._archive.centralOffset + this._archive.centralLength,
        ),
      ),
      this.write(Z.getLongBytes(1));
  };
  He.prototype._writeCentralFileHeader = function (e) {
    var t = e.getGeneralPurposeBit(),
      r = e.getMethod(),
      i = e._offsets,
      n = e.getSize(),
      s = e.getCompressedSize();
    if (e.isZip64() || i.file > ee.ZIP64_MAGIC) {
      (n = ee.ZIP64_MAGIC),
        (s = ee.ZIP64_MAGIC),
        e.setVersionNeededToExtract(ee.MIN_VERSION_ZIP64);
      var a = Buffer.concat(
        [
          Z.getShortBytes(ee.ZIP64_EXTRA_ID),
          Z.getShortBytes(24),
          Z.getEightBytes(e.getSize()),
          Z.getEightBytes(e.getCompressedSize()),
          Z.getEightBytes(i.file),
        ],
        28,
      );
      e.setExtra(a);
    }
    this.write(Z.getLongBytes(ee.SIG_CFH)),
      this.write(Z.getShortBytes((e.getPlatform() << 8) | ee.VERSION_MADEBY)),
      this.write(Z.getShortBytes(e.getVersionNeededToExtract())),
      this.write(t.encode()),
      this.write(Z.getShortBytes(r)),
      this.write(Z.getLongBytes(e.getTimeDos())),
      this.write(Z.getLongBytes(e.getCrc())),
      this.write(Z.getLongBytes(s)),
      this.write(Z.getLongBytes(n));
    var o = e.getName(),
      u = e.getComment(),
      l = e.getCentralDirectoryExtra();
    t.usesUTF8ForNames() && ((o = Buffer.from(o)), (u = Buffer.from(u))),
      this.write(Z.getShortBytes(o.length)),
      this.write(Z.getShortBytes(l.length)),
      this.write(Z.getShortBytes(u.length)),
      this.write(ee.SHORT_ZERO),
      this.write(Z.getShortBytes(e.getInternalAttributes())),
      this.write(Z.getLongBytes(e.getExternalAttributes())),
      i.file > ee.ZIP64_MAGIC
        ? this.write(Z.getLongBytes(ee.ZIP64_MAGIC))
        : this.write(Z.getLongBytes(i.file)),
      this.write(o),
      this.write(l),
      this.write(u);
  };
  He.prototype._writeDataDescriptor = function (e) {
    this.write(Z.getLongBytes(ee.SIG_DD)),
      this.write(Z.getLongBytes(e.getCrc())),
      e.isZip64()
        ? (this.write(Z.getEightBytes(e.getCompressedSize())),
          this.write(Z.getEightBytes(e.getSize())))
        : (this.write(Z.getLongBytes(e.getCompressedSize())),
          this.write(Z.getLongBytes(e.getSize())));
  };
  He.prototype._writeLocalFileHeader = function (e) {
    var t = e.getGeneralPurposeBit(),
      r = e.getMethod(),
      i = e.getName(),
      n = e.getLocalFileDataExtra();
    e.isZip64() &&
      (t.useDataDescriptor(!0),
      e.setVersionNeededToExtract(ee.MIN_VERSION_ZIP64)),
      t.usesUTF8ForNames() && (i = Buffer.from(i)),
      (e._offsets.file = this.offset),
      this.write(Z.getLongBytes(ee.SIG_LFH)),
      this.write(Z.getShortBytes(e.getVersionNeededToExtract())),
      this.write(t.encode()),
      this.write(Z.getShortBytes(r)),
      this.write(Z.getLongBytes(e.getTimeDos())),
      (e._offsets.data = this.offset),
      t.usesDataDescriptor()
        ? (this.write(ee.LONG_ZERO),
          this.write(ee.LONG_ZERO),
          this.write(ee.LONG_ZERO))
        : (this.write(Z.getLongBytes(e.getCrc())),
          this.write(Z.getLongBytes(e.getCompressedSize())),
          this.write(Z.getLongBytes(e.getSize()))),
      this.write(Z.getShortBytes(i.length)),
      this.write(Z.getShortBytes(n.length)),
      this.write(i),
      this.write(n),
      (e._offsets.contents = this.offset);
  };
  He.prototype.getComment = function (e) {
    return this._archive.comment !== null ? this._archive.comment : "";
  };
  He.prototype.isZip64 = function () {
    return (
      this._archive.forceZip64 ||
      this._entries.length > ee.ZIP64_MAGIC_SHORT ||
      this._archive.centralLength > ee.ZIP64_MAGIC ||
      this._archive.centralOffset > ee.ZIP64_MAGIC
    );
  };
  He.prototype.setComment = function (e) {
    this._archive.comment = e;
  };
});
var Wy = y((fte, mA) => {
  mA.exports = {
    ArchiveEntry: ic(),
    ZipArchiveEntry: My(),
    ArchiveOutputStream: By(),
    ZipArchiveOutputStream: pA(),
  };
});
var yA = y((hte, gA) => {
  /**
   * ZipStream
   *
   * @ignore
   * @license [MIT]{@link https://github.com/archiverjs/node-zip-stream/blob/master/LICENSE}
   * @copyright (c) 2014 Chris Talkington, contributors.
   */ var NY = require("util").inherits,
    Hy = Wy().ZipArchiveOutputStream,
    IY = Wy().ZipArchiveEntry,
    Gy = ea(),
    ta = (gA.exports = function (e) {
      if (!(this instanceof ta)) return new ta(e);
      (e = this.options = e || {}),
        (e.zlib = e.zlib || {}),
        Hy.call(this, e),
        typeof e.level == "number" &&
          e.level >= 0 &&
          ((e.zlib.level = e.level), delete e.level),
        !e.forceZip64 &&
          typeof e.zlib.level == "number" &&
          e.zlib.level === 0 &&
          (e.store = !0),
        (e.namePrependSlash = e.namePrependSlash || !1),
        e.comment && e.comment.length > 0 && this.setComment(e.comment);
    });
  NY(ta, Hy);
  ta.prototype._normalizeFileData = function (e) {
    e = Gy.defaults(e, {
      type: "file",
      name: null,
      namePrependSlash: this.options.namePrependSlash,
      linkname: null,
      date: null,
      mode: null,
      store: this.options.store,
      comment: "",
    });
    var t = e.type === "directory",
      r = e.type === "symlink";
    return (
      e.name &&
        ((e.name = Gy.sanitizePath(e.name)),
        !r && e.name.slice(-1) === "/"
          ? ((t = !0), (e.type = "directory"))
          : t && (e.name += "/")),
      (t || r) && (e.store = !0),
      (e.date = Gy.dateify(e.date)),
      e
    );
  };
  ta.prototype.entry = function (e, t, r) {
    if (
      (typeof r != "function" && (r = this._emitErrorCallback.bind(this)),
      (t = this._normalizeFileData(t)),
      t.type !== "file" && t.type !== "directory" && t.type !== "symlink")
    ) {
      r(new Error(t.type + " entries not currently supported"));
      return;
    }
    if (typeof t.name != "string" || t.name.length === 0) {
      r(new Error("entry name must be a non-empty string value"));
      return;
    }
    if (t.type === "symlink" && typeof t.linkname != "string") {
      r(
        new Error(
          "entry linkname must be a non-empty string value when type equals symlink",
        ),
      );
      return;
    }
    var i = new IY(t.name);
    return (
      i.setTime(t.date, this.options.forceLocalTime),
      t.namePrependSlash && i.setName(t.name, !0),
      t.store && i.setMethod(0),
      t.comment.length > 0 && i.setComment(t.comment),
      t.type === "symlink" && typeof t.mode != "number" && (t.mode = 40960),
      typeof t.mode == "number" &&
        (t.type === "symlink" && (t.mode |= 40960), i.setUnixMode(t.mode)),
      t.type === "symlink" &&
        typeof t.linkname == "string" &&
        (e = Buffer.from(t.linkname)),
      Hy.prototype.entry.call(this, i, e, r)
    );
  };
  ta.prototype.finalize = function () {
    this.finish();
  };
});
var wA = y((cte, vA) => {
  /**
   * ZIP Format Plugin
   *
   * @module plugins/zip
   * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
   * @copyright (c) 2012-2014 Chris Talkington, contributors.
   */ var MY = yA(),
    LY = ea(),
    Li = function (e) {
      if (!(this instanceof Li)) return new Li(e);
      (e = this.options =
        LY.defaults(e, {
          comment: "",
          forceUTC: !1,
          namePrependSlash: !1,
          store: !1,
        })),
        (this.supports = { directory: !0, symlink: !0 }),
        (this.engine = new MY(e));
    };
  Li.prototype.append = function (e, t, r) {
    this.engine.entry(e, t, r);
  };
  Li.prototype.finalize = function () {
    this.engine.finalize();
  };
  Li.prototype.on = function () {
    return this.engine.on.apply(this.engine, arguments);
  };
  Li.prototype.pipe = function () {
    return this.engine.pipe.apply(this.engine, arguments);
  };
  Li.prototype.unpipe = function () {
    return this.engine.unpipe.apply(this.engine, arguments);
  };
  vA.exports = Li;
});
var EA = y((dte, bA) => {
  "use strict";
  var { Buffer: sr } = require("buffer"),
    DA = Symbol.for("BufferList");
  function De(e) {
    if (!(this instanceof De)) return new De(e);
    De._init.call(this, e);
  }
  De._init = function (t) {
    Object.defineProperty(this, DA, { value: !0 }),
      (this._bufs = []),
      (this.length = 0),
      t && this.append(t);
  };
  De.prototype._new = function (t) {
    return new De(t);
  };
  De.prototype._offset = function (t) {
    if (t === 0) return [0, 0];
    let r = 0;
    for (let i = 0; i < this._bufs.length; i++) {
      let n = r + this._bufs[i].length;
      if (t < n || i === this._bufs.length - 1) return [i, t - r];
      r = n;
    }
  };
  De.prototype._reverseOffset = function (e) {
    let t = e[0],
      r = e[1];
    for (let i = 0; i < t; i++) r += this._bufs[i].length;
    return r;
  };
  De.prototype.get = function (t) {
    if (t > this.length || t < 0) return;
    let r = this._offset(t);
    return this._bufs[r[0]][r[1]];
  };
  De.prototype.slice = function (t, r) {
    return (
      typeof t == "number" && t < 0 && (t += this.length),
      typeof r == "number" && r < 0 && (r += this.length),
      this.copy(null, 0, t, r)
    );
  };
  De.prototype.copy = function (t, r, i, n) {
    if (
      ((typeof i != "number" || i < 0) && (i = 0),
      (typeof n != "number" || n > this.length) && (n = this.length),
      i >= this.length || n <= 0)
    )
      return t || sr.alloc(0);
    let s = !!t,
      a = this._offset(i),
      o = n - i,
      u = o,
      l = (s && r) || 0,
      f = a[1];
    if (i === 0 && n === this.length) {
      if (!s)
        return this._bufs.length === 1
          ? this._bufs[0]
          : sr.concat(this._bufs, this.length);
      for (let h = 0; h < this._bufs.length; h++)
        this._bufs[h].copy(t, l), (l += this._bufs[h].length);
      return t;
    }
    if (u <= this._bufs[a[0]].length - f)
      return s
        ? this._bufs[a[0]].copy(t, r, f, f + u)
        : this._bufs[a[0]].slice(f, f + u);
    s || (t = sr.allocUnsafe(o));
    for (let h = a[0]; h < this._bufs.length; h++) {
      let c = this._bufs[h].length - f;
      if (u > c) this._bufs[h].copy(t, l, f), (l += c);
      else {
        this._bufs[h].copy(t, l, f, f + u), (l += c);
        break;
      }
      (u -= c), f && (f = 0);
    }
    return t.length > l ? t.slice(0, l) : t;
  };
  De.prototype.shallowSlice = function (t, r) {
    if (
      ((t = t || 0),
      (r = typeof r != "number" ? this.length : r),
      t < 0 && (t += this.length),
      r < 0 && (r += this.length),
      t === r)
    )
      return this._new();
    let i = this._offset(t),
      n = this._offset(r),
      s = this._bufs.slice(i[0], n[0] + 1);
    return (
      n[1] === 0 ? s.pop() : (s[s.length - 1] = s[s.length - 1].slice(0, n[1])),
      i[1] !== 0 && (s[0] = s[0].slice(i[1])),
      this._new(s)
    );
  };
  De.prototype.toString = function (t, r, i) {
    return this.slice(r, i).toString(t);
  };
  De.prototype.consume = function (t) {
    if (((t = Math.trunc(t)), Number.isNaN(t) || t <= 0)) return this;
    for (; this._bufs.length; )
      if (t >= this._bufs[0].length)
        (t -= this._bufs[0].length),
          (this.length -= this._bufs[0].length),
          this._bufs.shift();
      else {
        (this._bufs[0] = this._bufs[0].slice(t)), (this.length -= t);
        break;
      }
    return this;
  };
  De.prototype.duplicate = function () {
    let t = this._new();
    for (let r = 0; r < this._bufs.length; r++) t.append(this._bufs[r]);
    return t;
  };
  De.prototype.append = function (t) {
    if (t == null) return this;
    if (t.buffer)
      this._appendBuffer(sr.from(t.buffer, t.byteOffset, t.byteLength));
    else if (Array.isArray(t))
      for (let r = 0; r < t.length; r++) this.append(t[r]);
    else if (this._isBufferList(t))
      for (let r = 0; r < t._bufs.length; r++) this.append(t._bufs[r]);
    else
      typeof t == "number" && (t = t.toString()),
        this._appendBuffer(sr.from(t));
    return this;
  };
  De.prototype._appendBuffer = function (t) {
    this._bufs.push(t), (this.length += t.length);
  };
  De.prototype.indexOf = function (e, t, r) {
    if (
      (r === void 0 && typeof t == "string" && ((r = t), (t = void 0)),
      typeof e == "function" || Array.isArray(e))
    )
      throw new TypeError(
        'The "value" argument must be one of type string, Buffer, BufferList, or Uint8Array.',
      );
    if (
      (typeof e == "number"
        ? (e = sr.from([e]))
        : typeof e == "string"
        ? (e = sr.from(e, r))
        : this._isBufferList(e)
        ? (e = e.slice())
        : Array.isArray(e.buffer)
        ? (e = sr.from(e.buffer, e.byteOffset, e.byteLength))
        : sr.isBuffer(e) || (e = sr.from(e)),
      (t = Number(t || 0)),
      isNaN(t) && (t = 0),
      t < 0 && (t = this.length + t),
      t < 0 && (t = 0),
      e.length === 0)
    )
      return t > this.length ? this.length : t;
    let i = this._offset(t),
      n = i[0],
      s = i[1];
    for (; n < this._bufs.length; n++) {
      let a = this._bufs[n];
      for (; s < a.length; )
        if (a.length - s >= e.length) {
          let u = a.indexOf(e, s);
          if (u !== -1) return this._reverseOffset([n, u]);
          s = a.length - e.length + 1;
        } else {
          let u = this._reverseOffset([n, s]);
          if (this._match(u, e)) return u;
          s++;
        }
      s = 0;
    }
    return -1;
  };
  De.prototype._match = function (e, t) {
    if (this.length - e < t.length) return !1;
    for (let r = 0; r < t.length; r++) if (this.get(e + r) !== t[r]) return !1;
    return !0;
  };
  (function () {
    let e = {
      readDoubleBE: 8,
      readDoubleLE: 8,
      readFloatBE: 4,
      readFloatLE: 4,
      readInt32BE: 4,
      readInt32LE: 4,
      readUInt32BE: 4,
      readUInt32LE: 4,
      readInt16BE: 2,
      readInt16LE: 2,
      readUInt16BE: 2,
      readUInt16LE: 2,
      readInt8: 1,
      readUInt8: 1,
      readIntBE: null,
      readIntLE: null,
      readUIntBE: null,
      readUIntLE: null,
    };
    for (let t in e)
      (function (r) {
        e[r] === null
          ? (De.prototype[r] = function (i, n) {
              return this.slice(i, i + n)[r](0, n);
            })
          : (De.prototype[r] = function (i = 0) {
              return this.slice(i, i + e[r])[r](0);
            });
      })(t);
  })();
  De.prototype._isBufferList = function (t) {
    return t instanceof De || De.isBufferList(t);
  };
  De.isBufferList = function (t) {
    return t != null && t[DA];
  };
  bA.exports = De;
});
var _A = y((pte, sc) => {
  "use strict";
  var Yy = st().Duplex,
    qY = je(),
    Qo = EA();
  function ut(e) {
    if (!(this instanceof ut)) return new ut(e);
    if (typeof e == "function") {
      this._callback = e;
      let t = function (i) {
        this._callback && (this._callback(i), (this._callback = null));
      }.bind(this);
      this.on("pipe", function (i) {
        i.on("error", t);
      }),
        this.on("unpipe", function (i) {
          i.removeListener("error", t);
        }),
        (e = null);
    }
    Qo._init.call(this, e), Yy.call(this);
  }
  qY(ut, Yy);
  Object.assign(ut.prototype, Qo.prototype);
  ut.prototype._new = function (t) {
    return new ut(t);
  };
  ut.prototype._write = function (t, r, i) {
    this._appendBuffer(t), typeof i == "function" && i();
  };
  ut.prototype._read = function (t) {
    if (!this.length) return this.push(null);
    (t = Math.min(t, this.length)),
      this.push(this.slice(0, t)),
      this.consume(t);
  };
  ut.prototype.end = function (t) {
    Yy.prototype.end.call(this, t),
      this._callback &&
        (this._callback(null, this.slice()), (this._callback = null));
  };
  ut.prototype._destroy = function (t, r) {
    (this._bufs.length = 0), (this.length = 0), r(t);
  };
  ut.prototype._isBufferList = function (t) {
    return t instanceof ut || t instanceof Qo || ut.isBufferList(t);
  };
  ut.isBufferList = Qo.isBufferList;
  sc.exports = ut;
  sc.exports.BufferListStream = ut;
  sc.exports.BufferList = Qo;
});
var Zy = y((ia) => {
  var PY = Buffer.alloc,
    BY = "0000000000000000000",
    kY = "7777777777777777777",
    SA = "0".charCodeAt(0),
    xA = Buffer.from("ustar\0", "binary"),
    jY = Buffer.from("00", "binary"),
    UY = Buffer.from("ustar ", "binary"),
    zY = Buffer.from(" \0", "binary"),
    $Y = parseInt("7777", 8),
    Jo = 257,
    Xy = 263,
    WY = function (e, t, r) {
      return typeof e != "number"
        ? r
        : ((e = ~~e), e >= t ? t : e >= 0 || ((e += t), e >= 0) ? e : 0);
    },
    GY = function (e) {
      switch (e) {
        case 0:
          return "file";
        case 1:
          return "link";
        case 2:
          return "symlink";
        case 3:
          return "character-device";
        case 4:
          return "block-device";
        case 5:
          return "directory";
        case 6:
          return "fifo";
        case 7:
          return "contiguous-file";
        case 72:
          return "pax-header";
        case 55:
          return "pax-global-header";
        case 27:
          return "gnu-long-link-path";
        case 28:
        case 30:
          return "gnu-long-path";
      }
      return null;
    },
    HY = function (e) {
      switch (e) {
        case "file":
          return 0;
        case "link":
          return 1;
        case "symlink":
          return 2;
        case "character-device":
          return 3;
        case "block-device":
          return 4;
        case "directory":
          return 5;
        case "fifo":
          return 6;
        case "contiguous-file":
          return 7;
        case "pax-header":
          return 72;
      }
      return 0;
    },
    CA = function (e, t, r, i) {
      for (; r < i; r++) if (e[r] === t) return r;
      return i;
    },
    OA = function (e) {
      for (var t = 256, r = 0; r < 148; r++) t += e[r];
      for (var i = 156; i < 512; i++) t += e[i];
      return t;
    },
    qi = function (e, t) {
      return (
        (e = e.toString(8)),
        e.length > t
          ? kY.slice(0, t) + " "
          : BY.slice(0, t - e.length) + e + " "
      );
    };
  function YY(e) {
    var t;
    if (e[0] === 128) t = !0;
    else if (e[0] === 255) t = !1;
    else return null;
    for (var r = [], i = e.length - 1; i > 0; i--) {
      var n = e[i];
      t ? r.push(n) : r.push(255 - n);
    }
    var s = 0,
      a = r.length;
    for (i = 0; i < a; i++) s += r[i] * Math.pow(256, i);
    return t ? s : -1 * s;
  }
  var Pi = function (e, t, r) {
      if (((e = e.slice(t, t + r)), (t = 0), e[t] & 128)) return YY(e);
      for (; t < e.length && e[t] === 32; ) t++;
      for (
        var i = WY(CA(e, 32, t, e.length), e.length, e.length);
        t < i && e[t] === 0;

      )
        t++;
      return i === t ? 0 : parseInt(e.slice(t, i).toString(), 8);
    },
    ra = function (e, t, r, i) {
      return e.slice(t, CA(e, 0, t, t + r)).toString(i);
    },
    Vy = function (e) {
      var t = Buffer.byteLength(e),
        r = Math.floor(Math.log(t) / Math.log(10)) + 1;
      return t + r >= Math.pow(10, r) && r++, t + r + e;
    };
  ia.decodeLongPath = function (e, t) {
    return ra(e, 0, e.length, t);
  };
  ia.encodePax = function (e) {
    var t = "";
    e.name &&
      (t += Vy(
        " path=" +
          e.name +
          `
`,
      )),
      e.linkname &&
        (t += Vy(
          " linkpath=" +
            e.linkname +
            `
`,
        ));
    var r = e.pax;
    if (r)
      for (var i in r)
        t += Vy(
          " " +
            i +
            "=" +
            r[i] +
            `
`,
        );
    return Buffer.from(t);
  };
  ia.decodePax = function (e) {
    for (var t = {}; e.length; ) {
      for (var r = 0; r < e.length && e[r] !== 32; ) r++;
      var i = parseInt(e.slice(0, r).toString(), 10);
      if (!i) return t;
      var n = e.slice(r + 1, i - 1).toString(),
        s = n.indexOf("=");
      if (s === -1) return t;
      (t[n.slice(0, s)] = n.slice(s + 1)), (e = e.slice(i));
    }
    return t;
  };
  ia.encode = function (e) {
    var t = PY(512),
      r = e.name,
      i = "";
    if (
      (e.typeflag === 5 && r[r.length - 1] !== "/" && (r += "/"),
      Buffer.byteLength(r) !== r.length)
    )
      return null;
    for (; Buffer.byteLength(r) > 100; ) {
      var n = r.indexOf("/");
      if (n === -1) return null;
      (i += i ? "/" + r.slice(0, n) : r.slice(0, n)), (r = r.slice(n + 1));
    }
    return Buffer.byteLength(r) > 100 ||
      Buffer.byteLength(i) > 155 ||
      (e.linkname && Buffer.byteLength(e.linkname) > 100)
      ? null
      : (t.write(r),
        t.write(qi(e.mode & $Y, 6), 100),
        t.write(qi(e.uid, 6), 108),
        t.write(qi(e.gid, 6), 116),
        t.write(qi(e.size, 11), 124),
        t.write(qi((e.mtime.getTime() / 1e3) | 0, 11), 136),
        (t[156] = SA + HY(e.type)),
        e.linkname && t.write(e.linkname, 157),
        xA.copy(t, Jo),
        jY.copy(t, Xy),
        e.uname && t.write(e.uname, 265),
        e.gname && t.write(e.gname, 297),
        t.write(qi(e.devmajor || 0, 6), 329),
        t.write(qi(e.devminor || 0, 6), 337),
        i && t.write(i, 345),
        t.write(qi(OA(t), 6), 148),
        t);
  };
  ia.decode = function (e, t, r) {
    var i = e[156] === 0 ? 0 : e[156] - SA,
      n = ra(e, 0, 100, t),
      s = Pi(e, 100, 8),
      a = Pi(e, 108, 8),
      o = Pi(e, 116, 8),
      u = Pi(e, 124, 12),
      l = Pi(e, 136, 12),
      f = GY(i),
      h = e[157] === 0 ? null : ra(e, 157, 100, t),
      c = ra(e, 265, 32),
      d = ra(e, 297, 32),
      g = Pi(e, 329, 8),
      C = Pi(e, 337, 8),
      S = OA(e);
    if (S === 8 * 32) return null;
    if (S !== Pi(e, 148, 8))
      throw new Error(
        "Invalid tar header. Maybe the tar is corrupted or it needs to be gunzipped?",
      );
    if (xA.compare(e, Jo, Jo + 6) === 0)
      e[345] && (n = ra(e, 345, 155, t) + "/" + n);
    else if (
      !(UY.compare(e, Jo, Jo + 6) === 0 && zY.compare(e, Xy, Xy + 2) === 0)
    ) {
      if (!r) throw new Error("Invalid tar header: unknown format.");
    }
    return (
      i === 0 && n && n[n.length - 1] === "/" && (i = 5),
      {
        name: n,
        mode: s,
        uid: a,
        gid: o,
        size: u,
        mtime: new Date(1e3 * l),
        type: f,
        linkname: h,
        uname: c,
        gname: d,
        devmajor: g,
        devminor: C,
      }
    );
  };
});
var MA = y((gte, IA) => {
  var FA = require("util"),
    VY = _A(),
    eu = Zy(),
    RA = st().Writable,
    AA = st().PassThrough,
    NA = function () {},
    TA = function (e) {
      return (e &= 511), e && 512 - e;
    },
    XY = function (e, t) {
      var r = new ac(e, t);
      return r.end(), r;
    },
    ZY = function (e, t) {
      return (
        t.path && (e.name = t.path),
        t.linkpath && (e.linkname = t.linkpath),
        t.size && (e.size = parseInt(t.size, 10)),
        (e.pax = t),
        e
      );
    },
    ac = function (e, t) {
      (this._parent = e), (this.offset = t), AA.call(this, { autoDestroy: !1 });
    };
  FA.inherits(ac, AA);
  ac.prototype.destroy = function (e) {
    this._parent.destroy(e);
  };
  var Zr = function (e) {
    if (!(this instanceof Zr)) return new Zr(e);
    RA.call(this, e),
      (e = e || {}),
      (this._offset = 0),
      (this._buffer = VY()),
      (this._missing = 0),
      (this._partial = !1),
      (this._onparse = NA),
      (this._header = null),
      (this._stream = null),
      (this._overflow = null),
      (this._cb = null),
      (this._locked = !1),
      (this._destroyed = !1),
      (this._pax = null),
      (this._paxGlobal = null),
      (this._gnuLongPath = null),
      (this._gnuLongLinkPath = null);
    var t = this,
      r = t._buffer,
      i = function () {
        t._continue();
      },
      n = function (c) {
        if (((t._locked = !1), c)) return t.destroy(c);
        t._stream || i();
      },
      s = function () {
        t._stream = null;
        var c = TA(t._header.size);
        c ? t._parse(c, a) : t._parse(512, h), t._locked || i();
      },
      a = function () {
        t._buffer.consume(TA(t._header.size)), t._parse(512, h), i();
      },
      o = function () {
        var c = t._header.size;
        (t._paxGlobal = eu.decodePax(r.slice(0, c))), r.consume(c), s();
      },
      u = function () {
        var c = t._header.size;
        (t._pax = eu.decodePax(r.slice(0, c))),
          t._paxGlobal && (t._pax = Object.assign({}, t._paxGlobal, t._pax)),
          r.consume(c),
          s();
      },
      l = function () {
        var c = t._header.size;
        (this._gnuLongPath = eu.decodeLongPath(
          r.slice(0, c),
          e.filenameEncoding,
        )),
          r.consume(c),
          s();
      },
      f = function () {
        var c = t._header.size;
        (this._gnuLongLinkPath = eu.decodeLongPath(
          r.slice(0, c),
          e.filenameEncoding,
        )),
          r.consume(c),
          s();
      },
      h = function () {
        var c = t._offset,
          d;
        try {
          d = t._header = eu.decode(
            r.slice(0, 512),
            e.filenameEncoding,
            e.allowUnknownFormat,
          );
        } catch (g) {
          t.emit("error", g);
        }
        if ((r.consume(512), !d)) {
          t._parse(512, h), i();
          return;
        }
        if (d.type === "gnu-long-path") {
          t._parse(d.size, l), i();
          return;
        }
        if (d.type === "gnu-long-link-path") {
          t._parse(d.size, f), i();
          return;
        }
        if (d.type === "pax-global-header") {
          t._parse(d.size, o), i();
          return;
        }
        if (d.type === "pax-header") {
          t._parse(d.size, u), i();
          return;
        }
        if (
          (t._gnuLongPath &&
            ((d.name = t._gnuLongPath), (t._gnuLongPath = null)),
          t._gnuLongLinkPath &&
            ((d.linkname = t._gnuLongLinkPath), (t._gnuLongLinkPath = null)),
          t._pax && ((t._header = d = ZY(d, t._pax)), (t._pax = null)),
          (t._locked = !0),
          !d.size || d.type === "directory")
        ) {
          t._parse(512, h), t.emit("entry", d, XY(t, c), n);
          return;
        }
        (t._stream = new ac(t, c)),
          t.emit("entry", d, t._stream, n),
          t._parse(d.size, s),
          i();
      };
    (this._onheader = h), this._parse(512, h);
  };
  FA.inherits(Zr, RA);
  Zr.prototype.destroy = function (e) {
    this._destroyed ||
      ((this._destroyed = !0),
      e && this.emit("error", e),
      this.emit("close"),
      this._stream && this._stream.emit("close"));
  };
  Zr.prototype._parse = function (e, t) {
    this._destroyed ||
      ((this._offset += e),
      (this._missing = e),
      t === this._onheader && (this._partial = !1),
      (this._onparse = t));
  };
  Zr.prototype._continue = function () {
    if (!this._destroyed) {
      var e = this._cb;
      (this._cb = NA),
        this._overflow ? this._write(this._overflow, void 0, e) : e();
    }
  };
  Zr.prototype._write = function (e, t, r) {
    if (!this._destroyed) {
      var i = this._stream,
        n = this._buffer,
        s = this._missing;
      if ((e.length && (this._partial = !0), e.length < s))
        return (
          (this._missing -= e.length),
          (this._overflow = null),
          i ? i.write(e, r) : (n.append(e), r())
        );
      (this._cb = r), (this._missing = 0);
      var a = null;
      e.length > s && ((a = e.slice(s)), (e = e.slice(0, s))),
        i ? i.end(e) : n.append(e),
        (this._overflow = a),
        this._onparse();
    }
  };
  Zr.prototype._final = function (e) {
    if (this._partial) return this.destroy(new Error("Unexpected end of data"));
    e();
  };
  IA.exports = Zr;
});
var qA = y((yte, LA) => {
  LA.exports = require("fs").constants || require("constants");
});
var UA = y((vte, jA) => {
  var na = qA(),
    PA = od(),
    uc = je(),
    KY = Buffer.alloc,
    BA = st().Readable,
    sa = st().Writable,
    QY = require("string_decoder").StringDecoder,
    oc = Zy(),
    JY = parseInt("755", 8),
    eV = parseInt("644", 8),
    kA = KY(1024),
    Qy = function () {},
    Ky = function (e, t) {
      (t &= 511), t && e.push(kA.slice(0, 512 - t));
    };
  function tV(e) {
    switch (e & na.S_IFMT) {
      case na.S_IFBLK:
        return "block-device";
      case na.S_IFCHR:
        return "character-device";
      case na.S_IFDIR:
        return "directory";
      case na.S_IFIFO:
        return "fifo";
      case na.S_IFLNK:
        return "symlink";
    }
    return "file";
  }
  var lc = function (e) {
    sa.call(this), (this.written = 0), (this._to = e), (this._destroyed = !1);
  };
  uc(lc, sa);
  lc.prototype._write = function (e, t, r) {
    if (((this.written += e.length), this._to.push(e))) return r();
    this._to._drain = r;
  };
  lc.prototype.destroy = function () {
    this._destroyed || ((this._destroyed = !0), this.emit("close"));
  };
  var fc = function () {
    sa.call(this),
      (this.linkname = ""),
      (this._decoder = new QY("utf-8")),
      (this._destroyed = !1);
  };
  uc(fc, sa);
  fc.prototype._write = function (e, t, r) {
    (this.linkname += this._decoder.write(e)), r();
  };
  fc.prototype.destroy = function () {
    this._destroyed || ((this._destroyed = !0), this.emit("close"));
  };
  var tu = function () {
    sa.call(this), (this._destroyed = !1);
  };
  uc(tu, sa);
  tu.prototype._write = function (e, t, r) {
    r(new Error("No body allowed for this entry"));
  };
  tu.prototype.destroy = function () {
    this._destroyed || ((this._destroyed = !0), this.emit("close"));
  };
  var Er = function (e) {
    if (!(this instanceof Er)) return new Er(e);
    BA.call(this, e),
      (this._drain = Qy),
      (this._finalized = !1),
      (this._finalizing = !1),
      (this._destroyed = !1),
      (this._stream = null);
  };
  uc(Er, BA);
  Er.prototype.entry = function (e, t, r) {
    if (this._stream) throw new Error("already piping an entry");
    if (!(this._finalized || this._destroyed)) {
      typeof t == "function" && ((r = t), (t = null)), r || (r = Qy);
      var i = this;
      if (
        ((!e.size || e.type === "symlink") && (e.size = 0),
        e.type || (e.type = tV(e.mode)),
        e.mode || (e.mode = e.type === "directory" ? JY : eV),
        e.uid || (e.uid = 0),
        e.gid || (e.gid = 0),
        e.mtime || (e.mtime = new Date()),
        typeof t == "string" && (t = Buffer.from(t)),
        Buffer.isBuffer(t))
      ) {
        (e.size = t.length), this._encode(e);
        var n = this.push(t);
        return (
          Ky(i, e.size), n ? process.nextTick(r) : (this._drain = r), new tu()
        );
      }
      if (e.type === "symlink" && !e.linkname) {
        var s = new fc();
        return (
          PA(s, function (o) {
            if (o) return i.destroy(), r(o);
            (e.linkname = s.linkname), i._encode(e), r();
          }),
          s
        );
      }
      if ((this._encode(e), e.type !== "file" && e.type !== "contiguous-file"))
        return process.nextTick(r), new tu();
      var a = new lc(this);
      return (
        (this._stream = a),
        PA(a, function (o) {
          if (((i._stream = null), o)) return i.destroy(), r(o);
          if (a.written !== e.size)
            return i.destroy(), r(new Error("size mismatch"));
          Ky(i, e.size), i._finalizing && i.finalize(), r();
        }),
        a
      );
    }
  };
  Er.prototype.finalize = function () {
    if (this._stream) {
      this._finalizing = !0;
      return;
    }
    this._finalized || ((this._finalized = !0), this.push(kA), this.push(null));
  };
  Er.prototype.destroy = function (e) {
    this._destroyed ||
      ((this._destroyed = !0),
      e && this.emit("error", e),
      this.emit("close"),
      this._stream && this._stream.destroy && this._stream.destroy());
  };
  Er.prototype._encode = function (e) {
    if (!e.pax) {
      var t = oc.encode(e);
      if (t) {
        this.push(t);
        return;
      }
    }
    this._encodePax(e);
  };
  Er.prototype._encodePax = function (e) {
    var t = oc.encodePax({ name: e.name, linkname: e.linkname, pax: e.pax }),
      r = {
        name: "PaxHeader",
        mode: e.mode,
        uid: e.uid,
        gid: e.gid,
        size: t.length,
        mtime: e.mtime,
        type: "pax-header",
        linkname: e.linkname && "PaxHeader",
        uname: e.uname,
        gname: e.gname,
        devmajor: e.devmajor,
        devminor: e.devminor,
      };
    this.push(oc.encode(r)),
      this.push(t),
      Ky(this, t.length),
      (r.size = e.size),
      (r.type = e.type),
      this.push(oc.encode(r));
  };
  Er.prototype._read = function (e) {
    var t = this._drain;
    (this._drain = Qy), t();
  };
  jA.exports = Er;
});
var zA = y((Jy) => {
  Jy.extract = MA();
  Jy.pack = UA();
});
var GA = y((Dte, WA) => {
  /**
   * TAR Format Plugin
   *
   * @module plugins/tar
   * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
   * @copyright (c) 2012-2014 Chris Talkington, contributors.
   */ var rV = require("zlib"),
    iV = zA(),
    $A = ea(),
    Kr = function (e) {
      if (!(this instanceof Kr)) return new Kr(e);
      (e = this.options = $A.defaults(e, { gzip: !1 })),
        typeof e.gzipOptions != "object" && (e.gzipOptions = {}),
        (this.supports = { directory: !0, symlink: !0 }),
        (this.engine = iV.pack(e)),
        (this.compressor = !1),
        e.gzip &&
          ((this.compressor = rV.createGzip(e.gzipOptions)),
          this.compressor.on("error", this._onCompressorError.bind(this)));
    };
  Kr.prototype._onCompressorError = function (e) {
    this.engine.emit("error", e);
  };
  Kr.prototype.append = function (e, t, r) {
    var i = this;
    t.mtime = t.date;
    function n(a, o) {
      if (a) {
        r(a);
        return;
      }
      i.engine.entry(t, o, function (u) {
        r(u, t);
      });
    }
    if (t.sourceType === "buffer") n(null, e);
    else if (t.sourceType === "stream" && t.stats) {
      t.size = t.stats.size;
      var s = i.engine.entry(t, function (a) {
        r(a, t);
      });
      e.pipe(s);
    } else t.sourceType === "stream" && $A.collectStream(e, n);
  };
  Kr.prototype.finalize = function () {
    this.engine.finalize();
  };
  Kr.prototype.on = function () {
    return this.engine.on.apply(this.engine, arguments);
  };
  Kr.prototype.pipe = function (e, t) {
    return this.compressor
      ? this.engine.pipe.apply(this.engine, [this.compressor]).pipe(e, t)
      : this.engine.pipe.apply(this.engine, arguments);
  };
  Kr.prototype.unpipe = function () {
    return this.compressor
      ? this.compressor.unpipe.apply(this.compressor, arguments)
      : this.engine.unpipe.apply(this.engine, arguments);
  };
  WA.exports = Kr;
});
var XA = y((bte, VA) => {
  /**
   * JSON Format Plugin
   *
   * @module plugins/json
   * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
   * @copyright (c) 2012-2014 Chris Talkington, contributors.
   */ var nV = require("util").inherits,
    HA = st().Transform,
    sV = tl(),
    YA = ea(),
    Bi = function (e) {
      if (!(this instanceof Bi)) return new Bi(e);
      (e = this.options = YA.defaults(e, {})),
        HA.call(this, e),
        (this.supports = { directory: !0, symlink: !0 }),
        (this.files = []);
    };
  nV(Bi, HA);
  Bi.prototype._transform = function (e, t, r) {
    r(null, e);
  };
  Bi.prototype._writeStringified = function () {
    var e = JSON.stringify(this.files);
    this.write(e);
  };
  Bi.prototype.append = function (e, t, r) {
    var i = this;
    t.crc32 = 0;
    function n(s, a) {
      if (s) {
        r(s);
        return;
      }
      (t.size = a.length || 0),
        (t.crc32 = sV.unsigned(a)),
        i.files.push(t),
        r(null, t);
    }
    t.sourceType === "buffer"
      ? n(null, e)
      : t.sourceType === "stream" && YA.collectStream(e, n);
  };
  Bi.prototype.finalize = function () {
    this._writeStringified(), this.end();
  };
  VA.exports = Bi;
});
var KA = y((Ete, ZA) => {
  /**
   * Archiver Vending
   *
   * @ignore
   * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
   * @copyright (c) 2012-2014 Chris Talkington, contributors.
   */ var aV = jR(),
    ru = {},
    ki = function (e, t) {
      return ki.create(e, t);
    };
  ki.create = function (e, t) {
    if (ru[e]) {
      var r = new aV(e, t);
      return r.setFormat(e), r.setModule(new ru[e](t)), r;
    } else throw new Error("create(" + e + "): format not registered");
  };
  ki.registerFormat = function (e, t) {
    if (ru[e])
      throw new Error("register(" + e + "): format already registered");
    if (typeof t != "function")
      throw new Error("register(" + e + "): format module invalid");
    if (
      typeof t.prototype.append != "function" ||
      typeof t.prototype.finalize != "function"
    )
      throw new Error("register(" + e + "): format module missing methods");
    ru[e] = t;
  };
  ki.isRegisteredFormat = function (e) {
    return !!ru[e];
  };
  ki.registerFormat("zip", wA());
  ki.registerFormat("tar", GA());
  ki.registerFormat("json", XA());
  ZA.exports = ki;
});
var rN = y((tN) => {
  tN.entityMap = {
    lt: "<",
    gt: ">",
    amp: "&",
    quot: '"',
    apos: "'",
    Agrave: "\xC0",
    Aacute: "\xC1",
    Acirc: "\xC2",
    Atilde: "\xC3",
    Auml: "\xC4",
    Aring: "\xC5",
    AElig: "\xC6",
    Ccedil: "\xC7",
    Egrave: "\xC8",
    Eacute: "\xC9",
    Ecirc: "\xCA",
    Euml: "\xCB",
    Igrave: "\xCC",
    Iacute: "\xCD",
    Icirc: "\xCE",
    Iuml: "\xCF",
    ETH: "\xD0",
    Ntilde: "\xD1",
    Ograve: "\xD2",
    Oacute: "\xD3",
    Ocirc: "\xD4",
    Otilde: "\xD5",
    Ouml: "\xD6",
    Oslash: "\xD8",
    Ugrave: "\xD9",
    Uacute: "\xDA",
    Ucirc: "\xDB",
    Uuml: "\xDC",
    Yacute: "\xDD",
    THORN: "\xDE",
    szlig: "\xDF",
    agrave: "\xE0",
    aacute: "\xE1",
    acirc: "\xE2",
    atilde: "\xE3",
    auml: "\xE4",
    aring: "\xE5",
    aelig: "\xE6",
    ccedil: "\xE7",
    egrave: "\xE8",
    eacute: "\xE9",
    ecirc: "\xEA",
    euml: "\xEB",
    igrave: "\xEC",
    iacute: "\xED",
    icirc: "\xEE",
    iuml: "\xEF",
    eth: "\xF0",
    ntilde: "\xF1",
    ograve: "\xF2",
    oacute: "\xF3",
    ocirc: "\xF4",
    otilde: "\xF5",
    ouml: "\xF6",
    oslash: "\xF8",
    ugrave: "\xF9",
    uacute: "\xFA",
    ucirc: "\xFB",
    uuml: "\xFC",
    yacute: "\xFD",
    thorn: "\xFE",
    yuml: "\xFF",
    nbsp: "\xA0",
    iexcl: "\xA1",
    cent: "\xA2",
    pound: "\xA3",
    curren: "\xA4",
    yen: "\xA5",
    brvbar: "\xA6",
    sect: "\xA7",
    uml: "\xA8",
    copy: "\xA9",
    ordf: "\xAA",
    laquo: "\xAB",
    not: "\xAC",
    shy: "\xAD\xAD",
    reg: "\xAE",
    macr: "\xAF",
    deg: "\xB0",
    plusmn: "\xB1",
    sup2: "\xB2",
    sup3: "\xB3",
    acute: "\xB4",
    micro: "\xB5",
    para: "\xB6",
    middot: "\xB7",
    cedil: "\xB8",
    sup1: "\xB9",
    ordm: "\xBA",
    raquo: "\xBB",
    frac14: "\xBC",
    frac12: "\xBD",
    frac34: "\xBE",
    iquest: "\xBF",
    times: "\xD7",
    divide: "\xF7",
    forall: "\u2200",
    part: "\u2202",
    exist: "\u2203",
    empty: "\u2205",
    nabla: "\u2207",
    isin: "\u2208",
    notin: "\u2209",
    ni: "\u220B",
    prod: "\u220F",
    sum: "\u2211",
    minus: "\u2212",
    lowast: "\u2217",
    radic: "\u221A",
    prop: "\u221D",
    infin: "\u221E",
    ang: "\u2220",
    and: "\u2227",
    or: "\u2228",
    cap: "\u2229",
    cup: "\u222A",
    int: "\u222B",
    there4: "\u2234",
    sim: "\u223C",
    cong: "\u2245",
    asymp: "\u2248",
    ne: "\u2260",
    equiv: "\u2261",
    le: "\u2264",
    ge: "\u2265",
    sub: "\u2282",
    sup: "\u2283",
    nsub: "\u2284",
    sube: "\u2286",
    supe: "\u2287",
    oplus: "\u2295",
    otimes: "\u2297",
    perp: "\u22A5",
    sdot: "\u22C5",
    Alpha: "\u0391",
    Beta: "\u0392",
    Gamma: "\u0393",
    Delta: "\u0394",
    Epsilon: "\u0395",
    Zeta: "\u0396",
    Eta: "\u0397",
    Theta: "\u0398",
    Iota: "\u0399",
    Kappa: "\u039A",
    Lambda: "\u039B",
    Mu: "\u039C",
    Nu: "\u039D",
    Xi: "\u039E",
    Omicron: "\u039F",
    Pi: "\u03A0",
    Rho: "\u03A1",
    Sigma: "\u03A3",
    Tau: "\u03A4",
    Upsilon: "\u03A5",
    Phi: "\u03A6",
    Chi: "\u03A7",
    Psi: "\u03A8",
    Omega: "\u03A9",
    alpha: "\u03B1",
    beta: "\u03B2",
    gamma: "\u03B3",
    delta: "\u03B4",
    epsilon: "\u03B5",
    zeta: "\u03B6",
    eta: "\u03B7",
    theta: "\u03B8",
    iota: "\u03B9",
    kappa: "\u03BA",
    lambda: "\u03BB",
    mu: "\u03BC",
    nu: "\u03BD",
    xi: "\u03BE",
    omicron: "\u03BF",
    pi: "\u03C0",
    rho: "\u03C1",
    sigmaf: "\u03C2",
    sigma: "\u03C3",
    tau: "\u03C4",
    upsilon: "\u03C5",
    phi: "\u03C6",
    chi: "\u03C7",
    psi: "\u03C8",
    omega: "\u03C9",
    thetasym: "\u03D1",
    upsih: "\u03D2",
    piv: "\u03D6",
    OElig: "\u0152",
    oelig: "\u0153",
    Scaron: "\u0160",
    scaron: "\u0161",
    Yuml: "\u0178",
    fnof: "\u0192",
    circ: "\u02C6",
    tilde: "\u02DC",
    ensp: "\u2002",
    emsp: "\u2003",
    thinsp: "\u2009",
    zwnj: "\u200C",
    zwj: "\u200D",
    lrm: "\u200E",
    rlm: "\u200F",
    ndash: "\u2013",
    mdash: "\u2014",
    lsquo: "\u2018",
    rsquo: "\u2019",
    sbquo: "\u201A",
    ldquo: "\u201C",
    rdquo: "\u201D",
    bdquo: "\u201E",
    dagger: "\u2020",
    Dagger: "\u2021",
    bull: "\u2022",
    hellip: "\u2026",
    permil: "\u2030",
    prime: "\u2032",
    Prime: "\u2033",
    lsaquo: "\u2039",
    rsaquo: "\u203A",
    oline: "\u203E",
    euro: "\u20AC",
    trade: "\u2122",
    larr: "\u2190",
    uarr: "\u2191",
    rarr: "\u2192",
    darr: "\u2193",
    harr: "\u2194",
    crarr: "\u21B5",
    lceil: "\u2308",
    rceil: "\u2309",
    lfloor: "\u230A",
    rfloor: "\u230B",
    loz: "\u25CA",
    spades: "\u2660",
    clubs: "\u2663",
    hearts: "\u2665",
    diams: "\u2666",
  };
});
var fN = y((rv) => {
  var tv =
      /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
    iN = new RegExp(
      "[\\-\\.0-9" +
        tv.source.slice(1, -1) +
        "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]",
    ),
    nN = new RegExp(
      "^" + tv.source + iN.source + "*(?::" + tv.source + iN.source + "*)?$",
    ),
    iu = 0,
    ji = 1,
    aa = 2,
    nu = 3,
    oa = 4,
    ua = 5,
    su = 6,
    cc = 7;
  function la(e, t) {
    (this.message = e),
      (this.locator = t),
      Error.captureStackTrace && Error.captureStackTrace(this, la);
  }
  la.prototype = new Error();
  la.prototype.name = la.name;
  function oN() {}
  oN.prototype = {
    parse: function (e, t, r) {
      var i = this.domBuilder;
      i.startDocument(),
        uN(t, (t = {})),
        oV(e, t, r, i, this.errorHandler),
        i.endDocument();
    },
  };
  function oV(e, t, r, i, n) {
    function s(I) {
      if (I > 65535) {
        I -= 65536;
        var P = 55296 + (I >> 10),
          G = 56320 + (I & 1023);
        return String.fromCharCode(P, G);
      } else return String.fromCharCode(I);
    }
    function a(I) {
      var P = I.slice(1, -1);
      return P in r
        ? r[P]
        : P.charAt(0) === "#"
        ? s(parseInt(P.substr(1).replace("x", "0x")))
        : (n.error("entity not found:" + I), I);
    }
    function o(I) {
      if (I > C) {
        var P = e.substring(C, I).replace(/&#?\w+;/g, a);
        c && u(C), i.characters(P, 0, I - C), (C = I);
      }
    }
    function u(I, P) {
      for (; I >= f && (P = h.exec(e)); )
        (l = P.index), (f = l + P[0].length), c.lineNumber++;
      c.columnNumber = I - l + 1;
    }
    for (
      var l = 0,
        f = 0,
        h = /.*(?:\r\n?|\n)|.*$/g,
        c = i.locator,
        d = [{ currentNSMap: t }],
        g = {},
        C = 0;
      ;

    ) {
      try {
        var S = e.indexOf("<", C);
        if (S < 0) {
          if (!e.substr(C).match(/^\s*$/)) {
            var O = i.doc,
              L = O.createTextNode(e.substr(C));
            O.appendChild(L), (i.currentElement = L);
          }
          return;
        }
        switch ((S > C && o(S), e.charAt(S + 1))) {
          case "/":
            var R = e.indexOf(">", S + 3),
              D = e.substring(S + 2, R),
              w = d.pop();
            R < 0
              ? ((D = e.substring(S + 2).replace(/[\s<].*/, "")),
                n.error("end tag name: " + D + " is not complete:" + w.tagName),
                (R = S + 1 + D.length))
              : D.match(/\s</) &&
                ((D = D.replace(/[\s<].*/, "")),
                n.error("end tag name: " + D + " maybe not complete"),
                (R = S + 1 + D.length));
            var F = w.localNSMap,
              m = w.tagName == D,
              x =
                m || (w.tagName && w.tagName.toLowerCase() == D.toLowerCase());
            if (x) {
              if ((i.endElement(w.uri, w.localName, D), F))
                for (var A in F) i.endPrefixMapping(A);
              m ||
                n.fatalError(
                  "end tag name: " +
                    D +
                    " is not match the current start tagName:" +
                    w.tagName,
                );
            } else d.push(w);
            R++;
            break;
          case "?":
            c && u(S), (R = cV(e, S, i));
            break;
          case "!":
            c && u(S), (R = hV(e, S, i, n));
            break;
          default:
            c && u(S);
            var p = new lN(),
              T = d[d.length - 1].currentNSMap,
              R = uV(e, S, p, T, a, n),
              k = p.length;
            if (
              (!p.closed &&
                fV(e, R, p.tagName, g) &&
                ((p.closed = !0),
                r.nbsp || n.warning("unclosed xml attribute")),
              c && k)
            ) {
              for (var z = sN(c, {}), $ = 0; $ < k; $++) {
                var X = p[$];
                u(X.offset), (X.locator = sN(c, {}));
              }
              (i.locator = z), aN(p, i, T) && d.push(p), (i.locator = c);
            } else aN(p, i, T) && d.push(p);
            p.uri === "http://www.w3.org/1999/xhtml" && !p.closed
              ? (R = lV(e, R, p.tagName, a, i))
              : R++;
        }
      } catch (I) {
        if (I instanceof la) throw I;
        n.error("element parse error: " + I), (R = -1);
      }
      R > C ? (C = R) : o(Math.max(S, C) + 1);
    }
  }
  function sN(e, t) {
    return (t.lineNumber = e.lineNumber), (t.columnNumber = e.columnNumber), t;
  }
  function uV(e, t, r, i, n, s) {
    function a(d, g, C) {
      d in r.attributeNames && s.fatalError("Attribute " + d + " redefined"),
        r.addValue(d, g, C);
    }
    for (var o, u, l = ++t, f = iu; ; ) {
      var h = e.charAt(l);
      switch (h) {
        case "=":
          if (f === ji) (o = e.slice(t, l)), (f = nu);
          else if (f === aa) f = nu;
          else throw new Error("attribute equal must after attrName");
          break;
        case "'":
        case '"':
          if (f === nu || f === ji)
            if (
              (f === ji &&
                (s.warning('attribute value must after "="'),
                (o = e.slice(t, l))),
              (t = l + 1),
              (l = e.indexOf(h, t)),
              l > 0)
            )
              (u = e.slice(t, l).replace(/&#?\w+;/g, n)),
                a(o, u, t - 1),
                (f = ua);
            else throw new Error("attribute value no end '" + h + "' match");
          else if (f == oa)
            (u = e.slice(t, l).replace(/&#?\w+;/g, n)),
              a(o, u, t),
              s.warning('attribute "' + o + '" missed start quot(' + h + ")!!"),
              (t = l + 1),
              (f = ua);
          else throw new Error('attribute value must after "="');
          break;
        case "/":
          switch (f) {
            case iu:
              r.setTagName(e.slice(t, l));
            case ua:
            case su:
            case cc:
              (f = cc), (r.closed = !0);
            case oa:
            case ji:
            case aa:
              break;
            default:
              throw new Error("attribute invalid close char('/')");
          }
          break;
        case "":
          return (
            s.error("unexpected end of input"),
            f == iu && r.setTagName(e.slice(t, l)),
            l
          );
        case ">":
          switch (f) {
            case iu:
              r.setTagName(e.slice(t, l));
            case ua:
            case su:
            case cc:
              break;
            case oa:
            case ji:
              (u = e.slice(t, l)),
                u.slice(-1) === "/" && ((r.closed = !0), (u = u.slice(0, -1)));
            case aa:
              f === aa && (u = o),
                f == oa
                  ? (s.warning('attribute "' + u + '" missed quot(")!'),
                    a(o, u.replace(/&#?\w+;/g, n), t))
                  : ((i[""] !== "http://www.w3.org/1999/xhtml" ||
                      !u.match(/^(?:disabled|checked|selected)$/i)) &&
                      s.warning(
                        'attribute "' +
                          u +
                          '" missed value!! "' +
                          u +
                          '" instead!!',
                      ),
                    a(u, u, t));
              break;
            case nu:
              throw new Error("attribute value missed!!");
          }
          return l;
        case "\x80":
          h = " ";
        default:
          if (h <= " ")
            switch (f) {
              case iu:
                r.setTagName(e.slice(t, l)), (f = su);
                break;
              case ji:
                (o = e.slice(t, l)), (f = aa);
                break;
              case oa:
                var u = e.slice(t, l).replace(/&#?\w+;/g, n);
                s.warning('attribute "' + u + '" missed quot(")!!'), a(o, u, t);
              case ua:
                f = su;
                break;
            }
          else
            switch (f) {
              case aa:
                var c = r.tagName;
                (i[""] !== "http://www.w3.org/1999/xhtml" ||
                  !o.match(/^(?:disabled|checked|selected)$/i)) &&
                  s.warning(
                    'attribute "' +
                      o +
                      '" missed value!! "' +
                      o +
                      '" instead2!!',
                  ),
                  a(o, o, t),
                  (t = l),
                  (f = ji);
                break;
              case ua:
                s.warning('attribute space is required"' + o + '"!!');
              case su:
                (f = ji), (t = l);
                break;
              case nu:
                (f = oa), (t = l);
                break;
              case cc:
                throw new Error(
                  "elements closed character '/' and '>' must be connected to",
                );
            }
      }
      l++;
    }
  }
  function aN(e, t, r) {
    for (var i = e.tagName, n = null, h = e.length; h--; ) {
      var s = e[h],
        a = s.qName,
        o = s.value,
        c = a.indexOf(":");
      if (c > 0)
        var u = (s.prefix = a.slice(0, c)),
          l = a.slice(c + 1),
          f = u === "xmlns" && l;
      else (l = a), (u = null), (f = a === "xmlns" && "");
      (s.localName = l),
        f !== !1 &&
          (n == null && ((n = {}), uN(r, (r = {}))),
          (r[f] = n[f] = o),
          (s.uri = "http://www.w3.org/2000/xmlns/"),
          t.startPrefixMapping(f, o));
    }
    for (var h = e.length; h--; ) {
      s = e[h];
      var u = s.prefix;
      u &&
        (u === "xml" && (s.uri = "http://www.w3.org/XML/1998/namespace"),
        u !== "xmlns" && (s.uri = r[u || ""]));
    }
    var c = i.indexOf(":");
    c > 0
      ? ((u = e.prefix = i.slice(0, c)), (l = e.localName = i.slice(c + 1)))
      : ((u = null), (l = e.localName = i));
    var d = (e.uri = r[u || ""]);
    if ((t.startElement(d, l, i, e), e.closed)) {
      if ((t.endElement(d, l, i), n)) for (u in n) t.endPrefixMapping(u);
    } else return (e.currentNSMap = r), (e.localNSMap = n), !0;
  }
  function lV(e, t, r, i, n) {
    if (/^(?:script|textarea)$/i.test(r)) {
      var s = e.indexOf("</" + r + ">", t),
        a = e.substring(t + 1, s);
      if (/[&<]/.test(a))
        return /^script$/i.test(r)
          ? (n.characters(a, 0, a.length), s)
          : ((a = a.replace(/&#?\w+;/g, i)), n.characters(a, 0, a.length), s);
    }
    return t + 1;
  }
  function fV(e, t, r, i) {
    var n = i[r];
    return (
      n == null &&
        ((n = e.lastIndexOf("</" + r + ">")),
        n < t && (n = e.lastIndexOf("</" + r)),
        (i[r] = n)),
      n < t
    );
  }
  function uN(e, t) {
    for (var r in e) t[r] = e[r];
  }
  function hV(e, t, r, i) {
    var n = e.charAt(t + 2);
    switch (n) {
      case "-":
        if (e.charAt(t + 3) === "-") {
          var s = e.indexOf("-->", t + 4);
          return s > t
            ? (r.comment(e, t + 4, s - t - 4), s + 3)
            : (i.error("Unclosed comment"), -1);
        } else return -1;
      default:
        if (e.substr(t + 3, 6) == "CDATA[") {
          var s = e.indexOf("]]>", t + 9);
          return (
            r.startCDATA(),
            r.characters(e, t + 9, s - t - 9),
            r.endCDATA(),
            s + 3
          );
        }
        var a = dV(e, t),
          o = a.length;
        if (o > 1 && /!doctype/i.test(a[0][0])) {
          var u = a[1][0],
            l = !1,
            f = !1;
          o > 3 &&
            (/^public$/i.test(a[2][0])
              ? ((l = a[3][0]), (f = o > 4 && a[4][0]))
              : /^system$/i.test(a[2][0]) && (f = a[3][0]));
          var h = a[o - 1];
          return r.startDTD(u, l, f), r.endDTD(), h.index + h[0].length;
        }
    }
    return -1;
  }
  function cV(e, t, r) {
    var i = e.indexOf("?>", t);
    if (i) {
      var n = e.substring(t, i).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
      if (n) {
        var s = n[0].length;
        return r.processingInstruction(n[1], n[2]), i + 2;
      } else return -1;
    }
    return -1;
  }
  function lN() {
    this.attributeNames = {};
  }
  lN.prototype = {
    setTagName: function (e) {
      if (!nN.test(e)) throw new Error("invalid tagName:" + e);
      this.tagName = e;
    },
    addValue: function (e, t, r) {
      if (!nN.test(e)) throw new Error("invalid attribute:" + e);
      (this.attributeNames[e] = this.length),
        (this[this.length++] = { qName: e, value: t, offset: r });
    },
    length: 0,
    getLocalName: function (e) {
      return this[e].localName;
    },
    getLocator: function (e) {
      return this[e].locator;
    },
    getQName: function (e) {
      return this[e].qName;
    },
    getURI: function (e) {
      return this[e].uri;
    },
    getValue: function (e) {
      return this[e].value;
    },
  };
  function dV(e, t) {
    var r,
      i = [],
      n = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
    for (n.lastIndex = t, n.exec(e); (r = n.exec(e)); )
      if ((i.push(r), r[1])) return i;
  }
  rv.XMLReader = oN;
  rv.ParseError = la;
});
var cv = y((fu) => {
  function ou(e, t) {
    for (var r in e) t[r] = e[r];
  }
  function Dt(e, t) {
    var r = e.prototype;
    if (!(r instanceof t)) {
      let n = function () {};
      var i = n;
      (n.prototype = t.prototype),
        (n = new n()),
        ou(r, n),
        (e.prototype = r = n);
    }
    r.constructor != e &&
      (typeof e != "function" && console.error("unknow Class:" + e),
      (r.constructor = e));
  }
  var pV = "http://www.w3.org/1999/xhtml",
    bt = {},
    ar = (bt.ELEMENT_NODE = 1),
    ha = (bt.ATTRIBUTE_NODE = 2),
    dc = (bt.TEXT_NODE = 3),
    gN = (bt.CDATA_SECTION_NODE = 4),
    yN = (bt.ENTITY_REFERENCE_NODE = 5),
    mV = (bt.ENTITY_NODE = 6),
    vN = (bt.PROCESSING_INSTRUCTION_NODE = 7),
    wN = (bt.COMMENT_NODE = 8),
    DN = (bt.DOCUMENT_NODE = 9),
    bN = (bt.DOCUMENT_TYPE_NODE = 10),
    Qr = (bt.DOCUMENT_FRAGMENT_NODE = 11),
    gV = (bt.NOTATION_NODE = 12),
    lt = {},
    Ye = {},
    Fte = (lt.INDEX_SIZE_ERR = ((Ye[1] = "Index size error"), 1)),
    Rte = (lt.DOMSTRING_SIZE_ERR = ((Ye[2] = "DOMString size error"), 2)),
    yV = (lt.HIERARCHY_REQUEST_ERR = ((Ye[3] = "Hierarchy request error"), 3)),
    Ate = (lt.WRONG_DOCUMENT_ERR = ((Ye[4] = "Wrong document"), 4)),
    Nte = (lt.INVALID_CHARACTER_ERR = ((Ye[5] = "Invalid character"), 5)),
    Ite = (lt.NO_DATA_ALLOWED_ERR = ((Ye[6] = "No data allowed"), 6)),
    Mte = (lt.NO_MODIFICATION_ALLOWED_ERR =
      ((Ye[7] = "No modification allowed"), 7)),
    vV = (lt.NOT_FOUND_ERR = ((Ye[8] = "Not found"), 8)),
    Lte = (lt.NOT_SUPPORTED_ERR = ((Ye[9] = "Not supported"), 9)),
    hN = (lt.INUSE_ATTRIBUTE_ERR = ((Ye[10] = "Attribute in use"), 10)),
    qte = (lt.INVALID_STATE_ERR = ((Ye[11] = "Invalid state"), 11)),
    Pte = (lt.SYNTAX_ERR = ((Ye[12] = "Syntax error"), 12)),
    Bte = (lt.INVALID_MODIFICATION_ERR =
      ((Ye[13] = "Invalid modification"), 13)),
    kte = (lt.NAMESPACE_ERR = ((Ye[14] = "Invalid namespace"), 14)),
    jte = (lt.INVALID_ACCESS_ERR = ((Ye[15] = "Invalid access"), 15));
  function Pn(e, t) {
    if (t instanceof Error) var r = t;
    else
      (r = this),
        Error.call(this, Ye[e]),
        (this.message = Ye[e]),
        Error.captureStackTrace && Error.captureStackTrace(this, Pn);
    return (r.code = e), t && (this.message = this.message + ": " + t), r;
  }
  Pn.prototype = Error.prototype;
  ou(lt, Pn);
  function Ui() {}
  Ui.prototype = {
    length: 0,
    item: function (e) {
      return this[e] || null;
    },
    toString: function (e, t) {
      for (var r = [], i = 0; i < this.length; i++) fa(this[i], r, e, t);
      return r.join("");
    },
  };
  function ca(e, t) {
    (this._node = e), (this._refresh = t), nv(this);
  }
  function nv(e) {
    var t = e._node._inc || e._node.ownerDocument._inc;
    if (e._inc != t) {
      var r = e._refresh(e._node);
      NN(e, "length", r.length), ou(r, e), (e._inc = t);
    }
  }
  ca.prototype.item = function (e) {
    return nv(this), this[e];
  };
  Dt(ca, Ui);
  function pc() {}
  function EN(e, t) {
    for (var r = e.length; r--; ) if (e[r] === t) return r;
  }
  function cN(e, t, r, i) {
    if ((i ? (t[EN(t, i)] = r) : (t[t.length++] = r), e)) {
      r.ownerElement = e;
      var n = e.ownerDocument;
      n && (i && SN(n, e, i), wV(n, e, r));
    }
  }
  function dN(e, t, r) {
    var i = EN(t, r);
    if (i >= 0) {
      for (var n = t.length - 1; i < n; ) t[i] = t[++i];
      if (((t.length = n), e)) {
        var s = e.ownerDocument;
        s && (SN(s, e, r), (r.ownerElement = null));
      }
    } else throw Pn(vV, new Error(e.tagName + "@" + r));
  }
  pc.prototype = {
    length: 0,
    item: Ui.prototype.item,
    getNamedItem: function (e) {
      for (var t = this.length; t--; ) {
        var r = this[t];
        if (r.nodeName == e) return r;
      }
    },
    setNamedItem: function (e) {
      var t = e.ownerElement;
      if (t && t != this._ownerElement) throw new Pn(hN);
      var r = this.getNamedItem(e.nodeName);
      return cN(this._ownerElement, this, e, r), r;
    },
    setNamedItemNS: function (e) {
      var t = e.ownerElement,
        r;
      if (t && t != this._ownerElement) throw new Pn(hN);
      return (
        (r = this.getNamedItemNS(e.namespaceURI, e.localName)),
        cN(this._ownerElement, this, e, r),
        r
      );
    },
    removeNamedItem: function (e) {
      var t = this.getNamedItem(e);
      return dN(this._ownerElement, this, t), t;
    },
    removeNamedItemNS: function (e, t) {
      var r = this.getNamedItemNS(e, t);
      return dN(this._ownerElement, this, r), r;
    },
    getNamedItemNS: function (e, t) {
      for (var r = this.length; r--; ) {
        var i = this[r];
        if (i.localName == t && i.namespaceURI == e) return i;
      }
      return null;
    },
  };
  function _N(e) {
    if (((this._features = {}), e)) for (var t in e) this._features = e[t];
  }
  _N.prototype = {
    hasFeature: function (e, t) {
      var r = this._features[e.toLowerCase()];
      return !!(r && (!t || t in r));
    },
    createDocument: function (e, t, r) {
      var i = new uu();
      if (
        ((i.implementation = this),
        (i.childNodes = new Ui()),
        (i.doctype = r),
        r && i.appendChild(r),
        t)
      ) {
        var n = i.createElementNS(e, t);
        i.appendChild(n);
      }
      return i;
    },
    createDocumentType: function (e, t, r) {
      var i = new lv();
      return (
        (i.name = e), (i.nodeName = e), (i.publicId = t), (i.systemId = r), i
      );
    },
  };
  function ft() {}
  ft.prototype = {
    firstChild: null,
    lastChild: null,
    previousSibling: null,
    nextSibling: null,
    attributes: null,
    parentNode: null,
    childNodes: null,
    ownerDocument: null,
    nodeValue: null,
    namespaceURI: null,
    prefix: null,
    localName: null,
    insertBefore: function (e, t) {
      return CN(this, e, t);
    },
    replaceChild: function (e, t) {
      this.insertBefore(e, t), t && this.removeChild(t);
    },
    removeChild: function (e) {
      return xN(this, e);
    },
    appendChild: function (e) {
      return this.insertBefore(e, null);
    },
    hasChildNodes: function () {
      return this.firstChild != null;
    },
    cloneNode: function (e) {
      return iv(this.ownerDocument || this, this, e);
    },
    normalize: function () {
      for (var e = this.firstChild; e; ) {
        var t = e.nextSibling;
        t && t.nodeType == dc && e.nodeType == dc
          ? (this.removeChild(t), e.appendData(t.data))
          : (e.normalize(), (e = t));
      }
    },
    isSupported: function (e, t) {
      return this.ownerDocument.implementation.hasFeature(e, t);
    },
    hasAttributes: function () {
      return this.attributes.length > 0;
    },
    lookupPrefix: function (e) {
      for (var t = this; t; ) {
        var r = t._nsMap;
        if (r) {
          for (var i in r) if (r[i] == e) return i;
        }
        t = t.nodeType == ha ? t.ownerDocument : t.parentNode;
      }
      return null;
    },
    lookupNamespaceURI: function (e) {
      for (var t = this; t; ) {
        var r = t._nsMap;
        if (r && e in r) return r[e];
        t = t.nodeType == ha ? t.ownerDocument : t.parentNode;
      }
      return null;
    },
    isDefaultNamespace: function (e) {
      var t = this.lookupPrefix(e);
      return t == null;
    },
  };
  function pN(e) {
    return (
      (e == "<" && "&lt;") ||
      (e == ">" && "&gt;") ||
      (e == "&" && "&amp;") ||
      (e == '"' && "&quot;") ||
      "&#" + e.charCodeAt() + ";"
    );
  }
  ou(bt, ft);
  ou(bt, ft.prototype);
  function au(e, t) {
    if (t(e)) return !0;
    if ((e = e.firstChild))
      do if (au(e, t)) return !0;
      while ((e = e.nextSibling));
  }
  function uu() {}
  function wV(e, t, r) {
    e && e._inc++;
    var i = r.namespaceURI;
    i == "http://www.w3.org/2000/xmlns/" &&
      (t._nsMap[r.prefix ? r.localName : ""] = r.value);
  }
  function SN(e, t, r, i) {
    e && e._inc++;
    var n = r.namespaceURI;
    n == "http://www.w3.org/2000/xmlns/" &&
      delete t._nsMap[r.prefix ? r.localName : ""];
  }
  function sv(e, t, r) {
    if (e && e._inc) {
      e._inc++;
      var i = t.childNodes;
      if (r) i[i.length++] = r;
      else {
        for (var n = t.firstChild, s = 0; n; )
          (i[s++] = n), (n = n.nextSibling);
        i.length = s;
      }
    }
  }
  function xN(e, t) {
    var r = t.previousSibling,
      i = t.nextSibling;
    return (
      r ? (r.nextSibling = i) : (e.firstChild = i),
      i ? (i.previousSibling = r) : (e.lastChild = r),
      sv(e.ownerDocument, e),
      t
    );
  }
  function CN(e, t, r) {
    var i = t.parentNode;
    if ((i && i.removeChild(t), t.nodeType === Qr)) {
      var n = t.firstChild;
      if (n == null) return t;
      var s = t.lastChild;
    } else n = s = t;
    var a = r ? r.previousSibling : e.lastChild;
    (n.previousSibling = a),
      (s.nextSibling = r),
      a ? (a.nextSibling = n) : (e.firstChild = n),
      r == null ? (e.lastChild = s) : (r.previousSibling = s);
    do n.parentNode = e;
    while (n !== s && (n = n.nextSibling));
    return (
      sv(e.ownerDocument || e, e),
      t.nodeType == Qr && (t.firstChild = t.lastChild = null),
      t
    );
  }
  function DV(e, t) {
    var r = t.parentNode;
    if (r) {
      var i = e.lastChild;
      r.removeChild(t);
      var i = e.lastChild;
    }
    var i = e.lastChild;
    return (
      (t.parentNode = e),
      (t.previousSibling = i),
      (t.nextSibling = null),
      i ? (i.nextSibling = t) : (e.firstChild = t),
      (e.lastChild = t),
      sv(e.ownerDocument, e, t),
      t
    );
  }
  uu.prototype = {
    nodeName: "#document",
    nodeType: DN,
    doctype: null,
    documentElement: null,
    _inc: 1,
    insertBefore: function (e, t) {
      if (e.nodeType == Qr) {
        for (var r = e.firstChild; r; ) {
          var i = r.nextSibling;
          this.insertBefore(r, t), (r = i);
        }
        return e;
      }
      return (
        this.documentElement == null &&
          e.nodeType == ar &&
          (this.documentElement = e),
        CN(this, e, t),
        (e.ownerDocument = this),
        e
      );
    },
    removeChild: function (e) {
      return (
        this.documentElement == e && (this.documentElement = null), xN(this, e)
      );
    },
    importNode: function (e, t) {
      return AN(this, e, t);
    },
    getElementById: function (e) {
      var t = null;
      return (
        au(this.documentElement, function (r) {
          if (r.nodeType == ar && r.getAttribute("id") == e) return (t = r), !0;
        }),
        t
      );
    },
    getElementsByClassName: function (e) {
      var t = new RegExp("(^|\\s)" + e + "(\\s|$)");
      return new ca(this, function (r) {
        var i = [];
        return (
          au(r.documentElement, function (n) {
            n !== r &&
              n.nodeType == ar &&
              t.test(n.getAttribute("class")) &&
              i.push(n);
          }),
          i
        );
      });
    },
    createElement: function (e) {
      var t = new da();
      (t.ownerDocument = this),
        (t.nodeName = e),
        (t.tagName = e),
        (t.childNodes = new Ui());
      var r = (t.attributes = new pc());
      return (r._ownerElement = t), t;
    },
    createDocumentFragment: function () {
      var e = new gc();
      return (e.ownerDocument = this), (e.childNodes = new Ui()), e;
    },
    createTextNode: function (e) {
      var t = new av();
      return (t.ownerDocument = this), t.appendData(e), t;
    },
    createComment: function (e) {
      var t = new ov();
      return (t.ownerDocument = this), t.appendData(e), t;
    },
    createCDATASection: function (e) {
      var t = new uv();
      return (t.ownerDocument = this), t.appendData(e), t;
    },
    createProcessingInstruction: function (e, t) {
      var r = new hv();
      return (
        (r.ownerDocument = this),
        (r.tagName = r.target = e),
        (r.nodeValue = r.data = t),
        r
      );
    },
    createAttribute: function (e) {
      var t = new mc();
      return (
        (t.ownerDocument = this),
        (t.name = e),
        (t.nodeName = e),
        (t.localName = e),
        (t.specified = !0),
        t
      );
    },
    createEntityReference: function (e) {
      var t = new fv();
      return (t.ownerDocument = this), (t.nodeName = e), t;
    },
    createElementNS: function (e, t) {
      var r = new da(),
        i = t.split(":"),
        n = (r.attributes = new pc());
      return (
        (r.childNodes = new Ui()),
        (r.ownerDocument = this),
        (r.nodeName = t),
        (r.tagName = t),
        (r.namespaceURI = e),
        i.length == 2
          ? ((r.prefix = i[0]), (r.localName = i[1]))
          : (r.localName = t),
        (n._ownerElement = r),
        r
      );
    },
    createAttributeNS: function (e, t) {
      var r = new mc(),
        i = t.split(":");
      return (
        (r.ownerDocument = this),
        (r.nodeName = t),
        (r.name = t),
        (r.namespaceURI = e),
        (r.specified = !0),
        i.length == 2
          ? ((r.prefix = i[0]), (r.localName = i[1]))
          : (r.localName = t),
        r
      );
    },
  };
  Dt(uu, ft);
  function da() {
    this._nsMap = {};
  }
  da.prototype = {
    nodeType: ar,
    hasAttribute: function (e) {
      return this.getAttributeNode(e) != null;
    },
    getAttribute: function (e) {
      var t = this.getAttributeNode(e);
      return (t && t.value) || "";
    },
    getAttributeNode: function (e) {
      return this.attributes.getNamedItem(e);
    },
    setAttribute: function (e, t) {
      var r = this.ownerDocument.createAttribute(e);
      (r.value = r.nodeValue = "" + t), this.setAttributeNode(r);
    },
    removeAttribute: function (e) {
      var t = this.getAttributeNode(e);
      t && this.removeAttributeNode(t);
    },
    appendChild: function (e) {
      return e.nodeType === Qr ? this.insertBefore(e, null) : DV(this, e);
    },
    setAttributeNode: function (e) {
      return this.attributes.setNamedItem(e);
    },
    setAttributeNodeNS: function (e) {
      return this.attributes.setNamedItemNS(e);
    },
    removeAttributeNode: function (e) {
      return this.attributes.removeNamedItem(e.nodeName);
    },
    removeAttributeNS: function (e, t) {
      var r = this.getAttributeNodeNS(e, t);
      r && this.removeAttributeNode(r);
    },
    hasAttributeNS: function (e, t) {
      return this.getAttributeNodeNS(e, t) != null;
    },
    getAttributeNS: function (e, t) {
      var r = this.getAttributeNodeNS(e, t);
      return (r && r.value) || "";
    },
    setAttributeNS: function (e, t, r) {
      var i = this.ownerDocument.createAttributeNS(e, t);
      (i.value = i.nodeValue = "" + r), this.setAttributeNode(i);
    },
    getAttributeNodeNS: function (e, t) {
      return this.attributes.getNamedItemNS(e, t);
    },
    getElementsByTagName: function (e) {
      return new ca(this, function (t) {
        var r = [];
        return (
          au(t, function (i) {
            i !== t &&
              i.nodeType == ar &&
              (e === "*" || i.tagName == e) &&
              r.push(i);
          }),
          r
        );
      });
    },
    getElementsByTagNameNS: function (e, t) {
      return new ca(this, function (r) {
        var i = [];
        return (
          au(r, function (n) {
            n !== r &&
              n.nodeType === ar &&
              (e === "*" || n.namespaceURI === e) &&
              (t === "*" || n.localName == t) &&
              i.push(n);
          }),
          i
        );
      });
    },
  };
  uu.prototype.getElementsByTagName = da.prototype.getElementsByTagName;
  uu.prototype.getElementsByTagNameNS = da.prototype.getElementsByTagNameNS;
  Dt(da, ft);
  function mc() {}
  mc.prototype.nodeType = ha;
  Dt(mc, ft);
  function lu() {}
  lu.prototype = {
    data: "",
    substringData: function (e, t) {
      return this.data.substring(e, e + t);
    },
    appendData: function (e) {
      (e = this.data + e),
        (this.nodeValue = this.data = e),
        (this.length = e.length);
    },
    insertData: function (e, t) {
      this.replaceData(e, 0, t);
    },
    appendChild: function (e) {
      throw new Error(Ye[yV]);
    },
    deleteData: function (e, t) {
      this.replaceData(e, t, "");
    },
    replaceData: function (e, t, r) {
      var i = this.data.substring(0, e),
        n = this.data.substring(e + t);
      (r = i + r + n),
        (this.nodeValue = this.data = r),
        (this.length = r.length);
    },
  };
  Dt(lu, ft);
  function av() {}
  av.prototype = {
    nodeName: "#text",
    nodeType: dc,
    splitText: function (e) {
      var t = this.data,
        r = t.substring(e);
      (t = t.substring(0, e)),
        (this.data = this.nodeValue = t),
        (this.length = t.length);
      var i = this.ownerDocument.createTextNode(r);
      return (
        this.parentNode && this.parentNode.insertBefore(i, this.nextSibling), i
      );
    },
  };
  Dt(av, lu);
  function ov() {}
  ov.prototype = { nodeName: "#comment", nodeType: wN };
  Dt(ov, lu);
  function uv() {}
  uv.prototype = { nodeName: "#cdata-section", nodeType: gN };
  Dt(uv, lu);
  function lv() {}
  lv.prototype.nodeType = bN;
  Dt(lv, ft);
  function ON() {}
  ON.prototype.nodeType = gV;
  Dt(ON, ft);
  function TN() {}
  TN.prototype.nodeType = mV;
  Dt(TN, ft);
  function fv() {}
  fv.prototype.nodeType = yN;
  Dt(fv, ft);
  function gc() {}
  gc.prototype.nodeName = "#document-fragment";
  gc.prototype.nodeType = Qr;
  Dt(gc, ft);
  function hv() {}
  hv.prototype.nodeType = vN;
  Dt(hv, ft);
  function FN() {}
  FN.prototype.serializeToString = function (e, t, r) {
    return RN.call(e, t, r);
  };
  ft.prototype.toString = RN;
  function RN(e, t) {
    var r = [],
      i = (this.nodeType == 9 && this.documentElement) || this,
      n = i.prefix,
      s = i.namespaceURI;
    if (s && n == null) {
      var n = i.lookupPrefix(s);
      if (n == null) var a = [{ namespace: s, prefix: null }];
    }
    return fa(this, r, e, t, a), r.join("");
  }
  function mN(e, t, r) {
    var i = e.prefix || "",
      n = e.namespaceURI;
    if (
      (!i && !n) ||
      (i === "xml" && n === "http://www.w3.org/XML/1998/namespace") ||
      n == "http://www.w3.org/2000/xmlns/"
    )
      return !1;
    for (var s = r.length; s--; ) {
      var a = r[s];
      if (a.prefix == i) return a.namespace != n;
    }
    return !0;
  }
  function fa(e, t, r, i, n) {
    if (i)
      if (((e = i(e)), e)) {
        if (typeof e == "string") {
          t.push(e);
          return;
        }
      } else return;
    switch (e.nodeType) {
      case ar:
        n || (n = []);
        var s = n.length,
          a = e.attributes,
          o = a.length,
          g = e.firstChild,
          u = e.tagName;
        (r = pV === e.namespaceURI || r), t.push("<", u);
        for (var l = 0; l < o; l++) {
          var f = a.item(l);
          f.prefix == "xmlns"
            ? n.push({ prefix: f.localName, namespace: f.value })
            : f.nodeName == "xmlns" &&
              n.push({ prefix: "", namespace: f.value });
        }
        for (var l = 0; l < o; l++) {
          var f = a.item(l);
          if (mN(f, r, n)) {
            var h = f.prefix || "",
              c = f.namespaceURI,
              d = h ? " xmlns:" + h : " xmlns";
            t.push(d, '="', c, '"'), n.push({ prefix: h, namespace: c });
          }
          fa(f, t, r, i, n);
        }
        if (mN(e, r, n)) {
          var h = e.prefix || "",
            c = e.namespaceURI;
          if (c) {
            var d = h ? " xmlns:" + h : " xmlns";
            t.push(d, '="', c, '"'), n.push({ prefix: h, namespace: c });
          }
        }
        if (g || (r && !/^(?:meta|link|img|br|hr|input)$/i.test(u))) {
          if ((t.push(">"), r && /^script$/i.test(u)))
            for (; g; )
              g.data ? t.push(g.data) : fa(g, t, r, i, n), (g = g.nextSibling);
          else for (; g; ) fa(g, t, r, i, n), (g = g.nextSibling);
          t.push("</", u, ">");
        } else t.push("/>");
        return;
      case DN:
      case Qr:
        for (var g = e.firstChild; g; ) fa(g, t, r, i, n), (g = g.nextSibling);
        return;
      case ha:
        return t.push(" ", e.name, '="', e.value.replace(/[<&"]/g, pN), '"');
      case dc:
        return t.push(e.data.replace(/[<&]/g, pN).replace(/]]>/g, "]]&gt;"));
      case gN:
        return t.push("<![CDATA[", e.data, "]]>");
      case wN:
        return t.push("<!--", e.data, "-->");
      case bN:
        var C = e.publicId,
          S = e.systemId;
        if ((t.push("<!DOCTYPE ", e.name), C))
          t.push(" PUBLIC ", C), S && S != "." && t.push(" ", S), t.push(">");
        else if (S && S != ".") t.push(" SYSTEM ", S, ">");
        else {
          var O = e.internalSubset;
          O && t.push(" [", O, "]"), t.push(">");
        }
        return;
      case vN:
        return t.push("<?", e.target, " ", e.data, "?>");
      case yN:
        return t.push("&", e.nodeName, ";");
      default:
        t.push("??", e.nodeName);
    }
  }
  function AN(e, t, r) {
    var i;
    switch (t.nodeType) {
      case ar:
        (i = t.cloneNode(!1)), (i.ownerDocument = e);
      case Qr:
        break;
      case ha:
        r = !0;
        break;
    }
    if (
      (i || (i = t.cloneNode(!1)),
      (i.ownerDocument = e),
      (i.parentNode = null),
      r)
    )
      for (var n = t.firstChild; n; )
        i.appendChild(AN(e, n, r)), (n = n.nextSibling);
    return i;
  }
  function iv(e, t, r) {
    var i = new t.constructor();
    for (var n in t) {
      var s = t[n];
      typeof s != "object" && s != i[n] && (i[n] = s);
    }
    switch (
      (t.childNodes && (i.childNodes = new Ui()),
      (i.ownerDocument = e),
      i.nodeType)
    ) {
      case ar:
        var a = t.attributes,
          o = (i.attributes = new pc()),
          u = a.length;
        o._ownerElement = i;
        for (var l = 0; l < u; l++) i.setAttributeNode(iv(e, a.item(l), !0));
        break;
      case ha:
        r = !0;
    }
    if (r)
      for (var f = t.firstChild; f; )
        i.appendChild(iv(e, f, r)), (f = f.nextSibling);
    return i;
  }
  function NN(e, t, r) {
    e[t] = r;
  }
  try {
    if (Object.defineProperty) {
      let e = function (t) {
        switch (t.nodeType) {
          case ar:
          case Qr:
            var r = [];
            for (t = t.firstChild; t; )
              t.nodeType !== 7 && t.nodeType !== 8 && r.push(e(t)),
                (t = t.nextSibling);
            return r.join("");
          default:
            return t.nodeValue;
        }
      };
      (Ute = e),
        Object.defineProperty(ca.prototype, "length", {
          get: function () {
            return nv(this), this.$$length;
          },
        }),
        Object.defineProperty(ft.prototype, "textContent", {
          get: function () {
            return e(this);
          },
          set: function (t) {
            switch (this.nodeType) {
              case ar:
              case Qr:
                for (; this.firstChild; ) this.removeChild(this.firstChild);
                (t || String(t)) &&
                  this.appendChild(this.ownerDocument.createTextNode(t));
                break;
              default:
                (this.data = t), (this.value = t), (this.nodeValue = t);
            }
          },
        }),
        (NN = function (t, r, i) {
          t["$$" + r] = i;
        });
    }
  } catch {}
  var Ute;
  fu.Node = ft;
  fu.DOMException = Pn;
  fu.DOMImplementation = _N;
  fu.XMLSerializer = FN;
});
var qN = y((cu) => {
  function MN(e) {
    this.options = e || { locator: {} };
  }
  MN.prototype.parseFromString = function (e, t) {
    var r = this.options,
      i = new _V(),
      n = r.domBuilder || new hu(),
      s = r.errorHandler,
      a = r.locator,
      o = r.xmlns || {},
      u = /\/x?html?$/.test(t),
      l = u
        ? EV.entityMap
        : { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'" };
    return (
      a && n.setDocumentLocator(a),
      (i.errorHandler = bV(s, n, a)),
      (i.domBuilder = r.domBuilder || n),
      u && (o[""] = "http://www.w3.org/1999/xhtml"),
      (o.xml = o.xml || "http://www.w3.org/XML/1998/namespace"),
      e && typeof e == "string"
        ? i.parse(e, o, l)
        : i.errorHandler.error("invalid doc source"),
      n.doc
    );
  };
  function bV(e, t, r) {
    if (!e) {
      if (t instanceof hu) return t;
      e = t;
    }
    var i = {},
      n = e instanceof Function;
    r = r || {};
    function s(a) {
      var o = e[a];
      !o &&
        n &&
        (o =
          e.length == 2
            ? function (u) {
                e(a, u);
              }
            : e),
        (i[a] =
          (o &&
            function (u) {
              o("[xmldom " + a + "]	" + u + dv(r));
            }) ||
          function () {});
    }
    return s("warning"), s("error"), s("fatalError"), i;
  }
  function hu() {
    this.cdata = !1;
  }
  function pa(e, t) {
    (t.lineNumber = e.lineNumber), (t.columnNumber = e.columnNumber);
  }
  hu.prototype = {
    startDocument: function () {
      (this.doc = new xV().createDocument(null, null, null)),
        this.locator && (this.doc.documentURI = this.locator.systemId);
    },
    startElement: function (e, t, r, i) {
      var n = this.doc,
        s = n.createElementNS(e, r || t),
        a = i.length;
      yc(this, s),
        (this.currentElement = s),
        this.locator && pa(this.locator, s);
      for (var o = 0; o < a; o++) {
        var e = i.getURI(o),
          u = i.getValue(o),
          r = i.getQName(o),
          l = n.createAttributeNS(e, r);
        this.locator && pa(i.getLocator(o), l),
          (l.value = l.nodeValue = u),
          s.setAttributeNode(l);
      }
    },
    endElement: function (e, t, r) {
      var i = this.currentElement,
        n = i.tagName;
      this.currentElement = i.parentNode;
    },
    startPrefixMapping: function (e, t) {},
    endPrefixMapping: function (e) {},
    processingInstruction: function (e, t) {
      var r = this.doc.createProcessingInstruction(e, t);
      this.locator && pa(this.locator, r), yc(this, r);
    },
    ignorableWhitespace: function (e, t, r) {},
    characters: function (e, t, r) {
      if (((e = IN.apply(this, arguments)), e)) {
        if (this.cdata) var i = this.doc.createCDATASection(e);
        else var i = this.doc.createTextNode(e);
        this.currentElement
          ? this.currentElement.appendChild(i)
          : /^\s*$/.test(e) && this.doc.appendChild(i),
          this.locator && pa(this.locator, i);
      }
    },
    skippedEntity: function (e) {},
    endDocument: function () {
      this.doc.normalize();
    },
    setDocumentLocator: function (e) {
      (this.locator = e) && (e.lineNumber = 0);
    },
    comment: function (e, t, r) {
      e = IN.apply(this, arguments);
      var i = this.doc.createComment(e);
      this.locator && pa(this.locator, i), yc(this, i);
    },
    startCDATA: function () {
      this.cdata = !0;
    },
    endCDATA: function () {
      this.cdata = !1;
    },
    startDTD: function (e, t, r) {
      var i = this.doc.implementation;
      if (i && i.createDocumentType) {
        var n = i.createDocumentType(e, t, r);
        this.locator && pa(this.locator, n), yc(this, n);
      }
    },
    warning: function (e) {
      console.warn("[xmldom warning]	" + e, dv(this.locator));
    },
    error: function (e) {
      console.error("[xmldom error]	" + e, dv(this.locator));
    },
    fatalError: function (e) {
      throw new SV(e, this.locator);
    },
  };
  function dv(e) {
    if (e)
      return (
        `
@` +
        (e.systemId || "") +
        "#[line:" +
        e.lineNumber +
        ",col:" +
        e.columnNumber +
        "]"
      );
  }
  function IN(e, t, r) {
    return typeof e == "string"
      ? e.substr(t, r)
      : e.length >= t + r || t
      ? new java.lang.String(e, t, r) + ""
      : e;
  }
  "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(
    /\w+/g,
    function (e) {
      hu.prototype[e] = function () {
        return null;
      };
    },
  );
  function yc(e, t) {
    e.currentElement ? e.currentElement.appendChild(t) : e.doc.appendChild(t);
  }
  var EV = rN(),
    LN = fN(),
    _V = LN.XMLReader,
    SV = LN.ParseError,
    xV = (cu.DOMImplementation = cv().DOMImplementation);
  cu.XMLSerializer = cv().XMLSerializer;
  cu.DOMParser = MN;
  cu.__DOMHandler = hu;
});
var kN = y((BN) => {
  var CV = qN().DOMParser;
  BN.parse = TV;
  var vc = 3,
    PN = 4,
    OV = 8;
  function pv(e) {
    return e.nodeType === vc || e.nodeType === OV || e.nodeType === PN;
  }
  function Jr(e) {
    return !e.childNodes || e.childNodes.length === 0;
  }
  function Bn(e, t) {
    if (!e) throw new Error(t);
  }
  function TV(e) {
    var t = new CV().parseFromString(e);
    Bn(
      t.documentElement.nodeName === "plist",
      "malformed document. First element should be <plist>",
    );
    var r = ma(t.documentElement);
    return r.length == 1 && (r = r[0]), r;
  }
  function ma(e) {
    var t, r, i, n, s, a, o, u;
    if (!e) return null;
    if (e.nodeName === "plist") {
      if (((s = []), Jr(e))) return s;
      for (t = 0; t < e.childNodes.length; t++)
        pv(e.childNodes[t]) || s.push(ma(e.childNodes[t]));
      return s;
    } else if (e.nodeName === "dict") {
      if (((r = {}), (i = null), (o = 0), Jr(e))) return r;
      for (t = 0; t < e.childNodes.length; t++)
        pv(e.childNodes[t]) ||
          (o % 2 === 0
            ? (Bn(
                e.childNodes[t].nodeName === "key",
                "Missing key while parsing <dict/>.",
              ),
              (i = ma(e.childNodes[t])))
            : (Bn(
                e.childNodes[t].nodeName !== "key",
                'Unexpected key "' +
                  ma(e.childNodes[t]) +
                  '" while parsing <dict/>.',
              ),
              (r[i] = ma(e.childNodes[t]))),
          (o += 1));
      return o % 2 === 1 && (r[i] = ""), r;
    } else if (e.nodeName === "array") {
      if (((s = []), Jr(e))) return s;
      for (t = 0; t < e.childNodes.length; t++)
        pv(e.childNodes[t]) ||
          ((a = ma(e.childNodes[t])), a != null && s.push(a));
      return s;
    } else if (e.nodeName !== "#text") {
      if (e.nodeName === "key")
        return Jr(e)
          ? ""
          : (Bn(
              e.childNodes[0].nodeValue !== "__proto__",
              "__proto__ keys can lead to prototype pollution. More details on CVE-2022-22912",
            ),
            e.childNodes[0].nodeValue);
      if (e.nodeName === "string") {
        if (((a = ""), Jr(e))) return a;
        for (t = 0; t < e.childNodes.length; t++) {
          var u = e.childNodes[t].nodeType;
          (u === vc || u === PN) && (a += e.childNodes[t].nodeValue);
        }
        return a;
      } else {
        if (e.nodeName === "integer")
          return (
            Bn(!Jr(e), 'Cannot parse "" as integer.'),
            parseInt(e.childNodes[0].nodeValue, 10)
          );
        if (e.nodeName === "real") {
          for (
            Bn(!Jr(e), 'Cannot parse "" as real.'), a = "", t = 0;
            t < e.childNodes.length;
            t++
          )
            e.childNodes[t].nodeType === vc && (a += e.childNodes[t].nodeValue);
          return parseFloat(a);
        } else if (e.nodeName === "data") {
          if (((a = ""), Jr(e))) return Buffer.from(a, "base64");
          for (t = 0; t < e.childNodes.length; t++)
            e.childNodes[t].nodeType === vc &&
              (a += e.childNodes[t].nodeValue.replace(/\s+/g, ""));
          return Buffer.from(a, "base64");
        } else {
          if (e.nodeName === "date")
            return (
              Bn(!Jr(e), 'Cannot parse "" as Date.'),
              new Date(e.childNodes[0].nodeValue)
            );
          if (e.nodeName === "null") return null;
          if (e.nodeName === "true") return !0;
          if (e.nodeName === "false") return !1;
          throw new Error("Invalid PLIST tag " + e.nodeName);
        }
      }
    }
  }
});
var zN = y((wc) => {
  "use strict";
  wc.byteLength = RV;
  wc.toByteArray = NV;
  wc.fromByteArray = LV;
  var _r = [],
    Xt = [],
    FV = typeof Uint8Array < "u" ? Uint8Array : Array,
    mv = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (kn = 0, jN = mv.length; kn < jN; ++kn)
    (_r[kn] = mv[kn]), (Xt[mv.charCodeAt(kn)] = kn);
  var kn, jN;
  Xt["-".charCodeAt(0)] = 62;
  Xt["_".charCodeAt(0)] = 63;
  function UN(e) {
    var t = e.length;
    if (t % 4 > 0)
      throw new Error("Invalid string. Length must be a multiple of 4");
    var r = e.indexOf("=");
    r === -1 && (r = t);
    var i = r === t ? 0 : 4 - (r % 4);
    return [r, i];
  }
  function RV(e) {
    var t = UN(e),
      r = t[0],
      i = t[1];
    return ((r + i) * 3) / 4 - i;
  }
  function AV(e, t, r) {
    return ((t + r) * 3) / 4 - r;
  }
  function NV(e) {
    var t,
      r = UN(e),
      i = r[0],
      n = r[1],
      s = new FV(AV(e, i, n)),
      a = 0,
      o = n > 0 ? i - 4 : i,
      u;
    for (u = 0; u < o; u += 4)
      (t =
        (Xt[e.charCodeAt(u)] << 18) |
        (Xt[e.charCodeAt(u + 1)] << 12) |
        (Xt[e.charCodeAt(u + 2)] << 6) |
        Xt[e.charCodeAt(u + 3)]),
        (s[a++] = (t >> 16) & 255),
        (s[a++] = (t >> 8) & 255),
        (s[a++] = t & 255);
    return (
      n === 2 &&
        ((t = (Xt[e.charCodeAt(u)] << 2) | (Xt[e.charCodeAt(u + 1)] >> 4)),
        (s[a++] = t & 255)),
      n === 1 &&
        ((t =
          (Xt[e.charCodeAt(u)] << 10) |
          (Xt[e.charCodeAt(u + 1)] << 4) |
          (Xt[e.charCodeAt(u + 2)] >> 2)),
        (s[a++] = (t >> 8) & 255),
        (s[a++] = t & 255)),
      s
    );
  }
  function IV(e) {
    return (
      _r[(e >> 18) & 63] + _r[(e >> 12) & 63] + _r[(e >> 6) & 63] + _r[e & 63]
    );
  }
  function MV(e, t, r) {
    for (var i, n = [], s = t; s < r; s += 3)
      (i =
        ((e[s] << 16) & 16711680) +
        ((e[s + 1] << 8) & 65280) +
        (e[s + 2] & 255)),
        n.push(IV(i));
    return n.join("");
  }
  function LV(e) {
    for (
      var t, r = e.length, i = r % 3, n = [], s = 16383, a = 0, o = r - i;
      a < o;
      a += s
    )
      n.push(MV(e, a, a + s > o ? o : a + s));
    return (
      i === 1
        ? ((t = e[r - 1]), n.push(_r[t >> 2] + _r[(t << 4) & 63] + "=="))
        : i === 2 &&
          ((t = (e[r - 2] << 8) + e[r - 1]),
          n.push(_r[t >> 10] + _r[(t >> 4) & 63] + _r[(t << 2) & 63] + "=")),
      n.join("")
    );
  }
});
var Sr = y(($N, zi) => {
  (function () {
    var e,
      t,
      r,
      i,
      n,
      s,
      a,
      o = {}.hasOwnProperty;
    (e = function (u, ...l) {
      var f, h, c, d;
      if (n(Object.assign)) Object.assign.apply(null, arguments);
      else
        for (f = 0, c = l.length; f < c; f++)
          if (((d = l[f]), d != null))
            for (h in d) !o.call(d, h) || (u[h] = d[h]);
      return u;
    }),
      (n = function (u) {
        return !!u && Object.prototype.toString.call(u) === "[object Function]";
      }),
      (s = function (u) {
        var l;
        return !!u && ((l = typeof u) == "function" || l === "object");
      }),
      (r = function (u) {
        return n(Array.isArray)
          ? Array.isArray(u)
          : Object.prototype.toString.call(u) === "[object Array]";
      }),
      (i = function (u) {
        var l;
        if (r(u)) return !u.length;
        for (l in u) if (!!o.call(u, l)) return !1;
        return !0;
      }),
      (a = function (u) {
        var l, f;
        return (
          s(u) &&
          (f = Object.getPrototypeOf(u)) &&
          (l = f.constructor) &&
          typeof l == "function" &&
          l instanceof l &&
          Function.prototype.toString.call(l) ===
            Function.prototype.toString.call(Object)
        );
      }),
      (t = function (u) {
        return n(u.valueOf) ? u.valueOf() : u;
      }),
      (zi.exports.assign = e),
      (zi.exports.isFunction = n),
      (zi.exports.isObject = s),
      (zi.exports.isArray = r),
      (zi.exports.isEmpty = i),
      (zi.exports.isPlainObject = a),
      (zi.exports.getValue = t);
  }.call($N));
});
var gv = y((WN, GN) => {
  (function () {
    var e;
    GN.exports = e = class {
      hasFeature(r, i) {
        return !0;
      }
      createDocumentType(r, i, n) {
        throw new Error("This DOM method is not implemented.");
      }
      createDocument(r, i, n) {
        throw new Error("This DOM method is not implemented.");
      }
      createHTMLDocument(r) {
        throw new Error("This DOM method is not implemented.");
      }
      getFeature(r, i) {
        throw new Error("This DOM method is not implemented.");
      }
    };
  }.call(WN));
});
var VN = y((HN, YN) => {
  (function () {
    var e;
    YN.exports = e = class {
      constructor() {}
      handleError(r) {
        throw new Error(r);
      }
    };
  }.call(HN));
});
var KN = y((XN, ZN) => {
  (function () {
    var e;
    ZN.exports = e = function () {
      class t {
        constructor(i) {
          this.arr = i || [];
        }
        item(i) {
          return this.arr[i] || null;
        }
        contains(i) {
          return this.arr.indexOf(i) !== -1;
        }
      }
      return (
        Object.defineProperty(t.prototype, "length", {
          get: function () {
            return this.arr.length;
          },
        }),
        t
      );
    }.call(this);
  }.call(XN));
});
var eI = y((QN, JN) => {
  (function () {
    var e, t, r;
    (t = VN()),
      (r = KN()),
      (JN.exports = e =
        function () {
          class i {
            constructor() {
              var s;
              (this.defaultParams = {
                "canonical-form": !1,
                "cdata-sections": !1,
                "comments": !1,
                "datatype-normalization": !1,
                "element-content-whitespace": !0,
                "entities": !0,
                "error-handler": new t(),
                "infoset": !0,
                "validate-if-schema": !1,
                "namespaces": !0,
                "namespace-declarations": !0,
                "normalize-characters": !1,
                "schema-location": "",
                "schema-type": "",
                "split-cdata-sections": !0,
                "validate": !1,
                "well-formed": !0,
              }),
                (this.params = s = Object.create(this.defaultParams));
            }
            getParameter(s) {
              return this.params.hasOwnProperty(s) ? this.params[s] : null;
            }
            canSetParameter(s, a) {
              return !0;
            }
            setParameter(s, a) {
              return a != null ? (this.params[s] = a) : delete this.params[s];
            }
          }
          return (
            Object.defineProperty(i.prototype, "parameterNames", {
              get: function () {
                return new r(Object.keys(this.defaultParams));
              },
            }),
            i
          );
        }.call(this));
  }.call(QN));
});
var Ae = y((tI, rI) => {
  (function () {
    rI.exports = {
      Element: 1,
      Attribute: 2,
      Text: 3,
      CData: 4,
      EntityReference: 5,
      EntityDeclaration: 6,
      ProcessingInstruction: 7,
      Comment: 8,
      Document: 9,
      DocType: 10,
      DocumentFragment: 11,
      NotationDeclaration: 12,
      Declaration: 201,
      Raw: 202,
      AttributeDeclaration: 203,
      ElementDeclaration: 204,
      Dummy: 205,
    };
  }.call(tI));
});
var yv = y((iI, nI) => {
  (function () {
    var e, t, r;
    (e = Ae()),
      (r = qt()),
      (nI.exports = t =
        function () {
          class i {
            constructor(s, a, o) {
              if (
                ((this.parent = s),
                this.parent &&
                  ((this.options = this.parent.options),
                  (this.stringify = this.parent.stringify)),
                a == null)
              )
                throw new Error("Missing attribute name. " + this.debugInfo(a));
              (this.name = this.stringify.name(a)),
                (this.value = this.stringify.attValue(o)),
                (this.type = e.Attribute),
                (this.isId = !1),
                (this.schemaTypeInfo = null);
            }
            clone() {
              return Object.create(this);
            }
            toString(s) {
              return this.options.writer.attribute(
                this,
                this.options.writer.filterOptions(s),
              );
            }
            debugInfo(s) {
              return (
                (s = s || this.name),
                s == null
                  ? "parent: <" + this.parent.name + ">"
                  : "attribute: {" + s + "}, parent: <" + this.parent.name + ">"
              );
            }
            isEqualNode(s) {
              return !(
                s.namespaceURI !== this.namespaceURI ||
                s.prefix !== this.prefix ||
                s.localName !== this.localName ||
                s.value !== this.value
              );
            }
          }
          return (
            Object.defineProperty(i.prototype, "nodeType", {
              get: function () {
                return this.type;
              },
            }),
            Object.defineProperty(i.prototype, "ownerElement", {
              get: function () {
                return this.parent;
              },
            }),
            Object.defineProperty(i.prototype, "textContent", {
              get: function () {
                return this.value;
              },
              set: function (n) {
                return (this.value = n || "");
              },
            }),
            Object.defineProperty(i.prototype, "namespaceURI", {
              get: function () {
                return "";
              },
            }),
            Object.defineProperty(i.prototype, "prefix", {
              get: function () {
                return "";
              },
            }),
            Object.defineProperty(i.prototype, "localName", {
              get: function () {
                return this.name;
              },
            }),
            Object.defineProperty(i.prototype, "specified", {
              get: function () {
                return !0;
              },
            }),
            i
          );
        }.call(this));
  }.call(iI));
});
var Dc = y((sI, aI) => {
  (function () {
    var e;
    aI.exports = e = function () {
      class t {
        constructor(i) {
          this.nodes = i;
        }
        clone() {
          return (this.nodes = null);
        }
        getNamedItem(i) {
          return this.nodes[i];
        }
        setNamedItem(i) {
          var n;
          return (
            (n = this.nodes[i.nodeName]),
            (this.nodes[i.nodeName] = i),
            n || null
          );
        }
        removeNamedItem(i) {
          var n;
          return (n = this.nodes[i]), delete this.nodes[i], n || null;
        }
        item(i) {
          return this.nodes[Object.keys(this.nodes)[i]] || null;
        }
        getNamedItemNS(i, n) {
          throw new Error("This DOM method is not implemented.");
        }
        setNamedItemNS(i) {
          throw new Error("This DOM method is not implemented.");
        }
        removeNamedItemNS(i, n) {
          throw new Error("This DOM method is not implemented.");
        }
      }
      return (
        Object.defineProperty(t.prototype, "length", {
          get: function () {
            return Object.keys(this.nodes).length || 0;
          },
        }),
        t
      );
    }.call(this);
  }.call(sI));
});
var bc = y((oI, uI) => {
  (function () {
    var e,
      t,
      r,
      i,
      n,
      s,
      a,
      o,
      u = {}.hasOwnProperty;
    ({ isObject: o, isFunction: a, getValue: s } = Sr()),
      (n = qt()),
      (e = Ae()),
      (t = yv()),
      (i = Dc()),
      (uI.exports = r =
        function () {
          class l extends n {
            constructor(h, c, d) {
              var g, C, S, O;
              if ((super(h), c == null))
                throw new Error("Missing element name. " + this.debugInfo());
              if (
                ((this.name = this.stringify.name(c)),
                (this.type = e.Element),
                (this.attribs = {}),
                (this.schemaTypeInfo = null),
                d != null && this.attribute(d),
                h.type === e.Document &&
                  ((this.isRoot = !0),
                  (this.documentObject = h),
                  (h.rootObject = this),
                  h.children))
              ) {
                for (O = h.children, C = 0, S = O.length; C < S; C++)
                  if (((g = O[C]), g.type === e.DocType)) {
                    g.name = this.name;
                    break;
                  }
              }
            }
            clone() {
              var h, c, d, g;
              (d = Object.create(this)),
                d.isRoot && (d.documentObject = null),
                (d.attribs = {}),
                (g = this.attribs);
              for (c in g)
                !u.call(g, c) || ((h = g[c]), (d.attribs[c] = h.clone()));
              return (
                (d.children = []),
                this.children.forEach(function (C) {
                  var S;
                  return (S = C.clone()), (S.parent = d), d.children.push(S);
                }),
                d
              );
            }
            attribute(h, c) {
              var d, g;
              if ((h != null && (h = s(h)), o(h)))
                for (d in h)
                  !u.call(h, d) || ((g = h[d]), this.attribute(d, g));
              else
                a(c) && (c = c.apply()),
                  this.options.keepNullAttributes && c == null
                    ? (this.attribs[h] = new t(this, h, ""))
                    : c != null && (this.attribs[h] = new t(this, h, c));
              return this;
            }
            removeAttribute(h) {
              var c, d, g;
              if (h == null)
                throw new Error("Missing attribute name. " + this.debugInfo());
              if (((h = s(h)), Array.isArray(h)))
                for (d = 0, g = h.length; d < g; d++)
                  (c = h[d]), delete this.attribs[c];
              else delete this.attribs[h];
              return this;
            }
            toString(h) {
              return this.options.writer.element(
                this,
                this.options.writer.filterOptions(h),
              );
            }
            att(h, c) {
              return this.attribute(h, c);
            }
            a(h, c) {
              return this.attribute(h, c);
            }
            getAttribute(h) {
              return this.attribs.hasOwnProperty(h)
                ? this.attribs[h].value
                : null;
            }
            setAttribute(h, c) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            getAttributeNode(h) {
              return this.attribs.hasOwnProperty(h) ? this.attribs[h] : null;
            }
            setAttributeNode(h) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            removeAttributeNode(h) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            getElementsByTagName(h) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            getAttributeNS(h, c) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            setAttributeNS(h, c, d) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            removeAttributeNS(h, c) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            getAttributeNodeNS(h, c) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            setAttributeNodeNS(h) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            getElementsByTagNameNS(h, c) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            hasAttribute(h) {
              return this.attribs.hasOwnProperty(h);
            }
            hasAttributeNS(h, c) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            setIdAttribute(h, c) {
              return this.attribs.hasOwnProperty(h) ? this.attribs[h].isId : c;
            }
            setIdAttributeNS(h, c, d) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            setIdAttributeNode(h, c) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            getElementsByTagName(h) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            getElementsByTagNameNS(h, c) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            getElementsByClassName(h) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            isEqualNode(h) {
              var c, d, g;
              if (
                !super.isEqualNode(h) ||
                h.namespaceURI !== this.namespaceURI ||
                h.prefix !== this.prefix ||
                h.localName !== this.localName ||
                h.attribs.length !== this.attribs.length
              )
                return !1;
              for (
                c = d = 0, g = this.attribs.length - 1;
                0 <= g ? d <= g : d >= g;
                c = 0 <= g ? ++d : --d
              )
                if (!this.attribs[c].isEqualNode(h.attribs[c])) return !1;
              return !0;
            }
          }
          return (
            Object.defineProperty(l.prototype, "tagName", {
              get: function () {
                return this.name;
              },
            }),
            Object.defineProperty(l.prototype, "namespaceURI", {
              get: function () {
                return "";
              },
            }),
            Object.defineProperty(l.prototype, "prefix", {
              get: function () {
                return "";
              },
            }),
            Object.defineProperty(l.prototype, "localName", {
              get: function () {
                return this.name;
              },
            }),
            Object.defineProperty(l.prototype, "id", {
              get: function () {
                throw new Error(
                  "This DOM method is not implemented." + this.debugInfo(),
                );
              },
            }),
            Object.defineProperty(l.prototype, "className", {
              get: function () {
                throw new Error(
                  "This DOM method is not implemented." + this.debugInfo(),
                );
              },
            }),
            Object.defineProperty(l.prototype, "classList", {
              get: function () {
                throw new Error(
                  "This DOM method is not implemented." + this.debugInfo(),
                );
              },
            }),
            Object.defineProperty(l.prototype, "attributes", {
              get: function () {
                return (
                  (!this.attributeMap || !this.attributeMap.nodes) &&
                    (this.attributeMap = new i(this.attribs)),
                  this.attributeMap
                );
              },
            }),
            l
          );
        }.call(this));
  }.call(oI));
});
var du = y((lI, fI) => {
  (function () {
    var e, t;
    (t = qt()),
      (fI.exports = e =
        function () {
          class r extends t {
            constructor(n) {
              super(n), (this.value = "");
            }
            clone() {
              return Object.create(this);
            }
            substringData(n, s) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            appendData(n) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            insertData(n, s) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            deleteData(n, s) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            replaceData(n, s, a) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            isEqualNode(n) {
              return !(!super.isEqualNode(n) || n.data !== this.data);
            }
          }
          return (
            Object.defineProperty(r.prototype, "data", {
              get: function () {
                return this.value;
              },
              set: function (i) {
                return (this.value = i || "");
              },
            }),
            Object.defineProperty(r.prototype, "length", {
              get: function () {
                return this.value.length;
              },
            }),
            Object.defineProperty(r.prototype, "textContent", {
              get: function () {
                return this.value;
              },
              set: function (i) {
                return (this.value = i || "");
              },
            }),
            r
          );
        }.call(this));
  }.call(lI));
});
var Ec = y((hI, cI) => {
  (function () {
    var e, t, r;
    (e = Ae()),
      (r = du()),
      (cI.exports = t =
        class extends r {
          constructor(n, s) {
            if ((super(n), s == null))
              throw new Error("Missing CDATA text. " + this.debugInfo());
            (this.name = "#cdata-section"),
              (this.type = e.CData),
              (this.value = this.stringify.cdata(s));
          }
          clone() {
            return Object.create(this);
          }
          toString(n) {
            return this.options.writer.cdata(
              this,
              this.options.writer.filterOptions(n),
            );
          }
        });
  }.call(hI));
});
var _c = y((dI, pI) => {
  (function () {
    var e, t, r;
    (e = Ae()),
      (t = du()),
      (pI.exports = r =
        class extends t {
          constructor(n, s) {
            if ((super(n), s == null))
              throw new Error("Missing comment text. " + this.debugInfo());
            (this.name = "#comment"),
              (this.type = e.Comment),
              (this.value = this.stringify.comment(s));
          }
          clone() {
            return Object.create(this);
          }
          toString(n) {
            return this.options.writer.comment(
              this,
              this.options.writer.filterOptions(n),
            );
          }
        });
  }.call(dI));
});
var Sc = y((mI, gI) => {
  (function () {
    var e, t, r, i;
    ({ isObject: i } = Sr()),
      (r = qt()),
      (e = Ae()),
      (gI.exports = t =
        class extends r {
          constructor(s, a, o, u) {
            super(s),
              i(a) && ({ version: a, encoding: o, standalone: u } = a),
              a || (a = "1.0"),
              (this.type = e.Declaration),
              (this.version = this.stringify.xmlVersion(a)),
              o != null && (this.encoding = this.stringify.xmlEncoding(o)),
              u != null && (this.standalone = this.stringify.xmlStandalone(u));
          }
          toString(s) {
            return this.options.writer.declaration(
              this,
              this.options.writer.filterOptions(s),
            );
          }
        });
  }.call(mI));
});
var xc = y((yI, vI) => {
  (function () {
    var e, t, r;
    (r = qt()),
      (e = Ae()),
      (vI.exports = t =
        class extends r {
          constructor(n, s, a, o, u, l) {
            if ((super(n), s == null))
              throw new Error("Missing DTD element name. " + this.debugInfo());
            if (a == null)
              throw new Error(
                "Missing DTD attribute name. " + this.debugInfo(s),
              );
            if (!o)
              throw new Error(
                "Missing DTD attribute type. " + this.debugInfo(s),
              );
            if (!u)
              throw new Error(
                "Missing DTD attribute default. " + this.debugInfo(s),
              );
            if (
              (u.indexOf("#") !== 0 && (u = "#" + u),
              !u.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/))
            )
              throw new Error(
                "Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " +
                  this.debugInfo(s),
              );
            if (l && !u.match(/^(#FIXED|#DEFAULT)$/))
              throw new Error(
                "Default value only applies to #FIXED or #DEFAULT. " +
                  this.debugInfo(s),
              );
            (this.elementName = this.stringify.name(s)),
              (this.type = e.AttributeDeclaration),
              (this.attributeName = this.stringify.name(a)),
              (this.attributeType = this.stringify.dtdAttType(o)),
              l && (this.defaultValue = this.stringify.dtdAttDefault(l)),
              (this.defaultValueType = u);
          }
          toString(n) {
            return this.options.writer.dtdAttList(
              this,
              this.options.writer.filterOptions(n),
            );
          }
        });
  }.call(yI));
});
var Cc = y((wI, DI) => {
  (function () {
    var e, t, r, i;
    ({ isObject: i } = Sr()),
      (r = qt()),
      (e = Ae()),
      (DI.exports = t =
        function () {
          class n extends r {
            constructor(a, o, u, l) {
              if ((super(a), u == null))
                throw new Error(
                  "Missing DTD entity name. " + this.debugInfo(u),
                );
              if (l == null)
                throw new Error(
                  "Missing DTD entity value. " + this.debugInfo(u),
                );
              if (
                ((this.pe = !!o),
                (this.name = this.stringify.name(u)),
                (this.type = e.EntityDeclaration),
                !i(l))
              )
                (this.value = this.stringify.dtdEntityValue(l)),
                  (this.internal = !0);
              else {
                if (!l.pubID && !l.sysID)
                  throw new Error(
                    "Public and/or system identifiers are required for an external entity. " +
                      this.debugInfo(u),
                  );
                if (l.pubID && !l.sysID)
                  throw new Error(
                    "System identifier is required for a public external entity. " +
                      this.debugInfo(u),
                  );
                if (
                  ((this.internal = !1),
                  l.pubID != null &&
                    (this.pubID = this.stringify.dtdPubID(l.pubID)),
                  l.sysID != null &&
                    (this.sysID = this.stringify.dtdSysID(l.sysID)),
                  l.nData != null &&
                    (this.nData = this.stringify.dtdNData(l.nData)),
                  this.pe && this.nData)
                )
                  throw new Error(
                    "Notation declaration is not allowed in a parameter entity. " +
                      this.debugInfo(u),
                  );
              }
            }
            toString(a) {
              return this.options.writer.dtdEntity(
                this,
                this.options.writer.filterOptions(a),
              );
            }
          }
          return (
            Object.defineProperty(n.prototype, "publicId", {
              get: function () {
                return this.pubID;
              },
            }),
            Object.defineProperty(n.prototype, "systemId", {
              get: function () {
                return this.sysID;
              },
            }),
            Object.defineProperty(n.prototype, "notationName", {
              get: function () {
                return this.nData || null;
              },
            }),
            Object.defineProperty(n.prototype, "inputEncoding", {
              get: function () {
                return null;
              },
            }),
            Object.defineProperty(n.prototype, "xmlEncoding", {
              get: function () {
                return null;
              },
            }),
            Object.defineProperty(n.prototype, "xmlVersion", {
              get: function () {
                return null;
              },
            }),
            n
          );
        }.call(this));
  }.call(wI));
});
var Oc = y((bI, EI) => {
  (function () {
    var e, t, r;
    (r = qt()),
      (e = Ae()),
      (EI.exports = t =
        class extends r {
          constructor(n, s, a) {
            if ((super(n), s == null))
              throw new Error("Missing DTD element name. " + this.debugInfo());
            a || (a = "(#PCDATA)"),
              Array.isArray(a) && (a = "(" + a.join(",") + ")"),
              (this.name = this.stringify.name(s)),
              (this.type = e.ElementDeclaration),
              (this.value = this.stringify.dtdElementValue(a));
          }
          toString(n) {
            return this.options.writer.dtdElement(
              this,
              this.options.writer.filterOptions(n),
            );
          }
        });
  }.call(bI));
});
var Tc = y((_I, SI) => {
  (function () {
    var e, t, r;
    (r = qt()),
      (e = Ae()),
      (SI.exports = t =
        function () {
          class i extends r {
            constructor(s, a, o) {
              if ((super(s), a == null))
                throw new Error(
                  "Missing DTD notation name. " + this.debugInfo(a),
                );
              if (!o.pubID && !o.sysID)
                throw new Error(
                  "Public or system identifiers are required for an external entity. " +
                    this.debugInfo(a),
                );
              (this.name = this.stringify.name(a)),
                (this.type = e.NotationDeclaration),
                o.pubID != null &&
                  (this.pubID = this.stringify.dtdPubID(o.pubID)),
                o.sysID != null &&
                  (this.sysID = this.stringify.dtdSysID(o.sysID));
            }
            toString(s) {
              return this.options.writer.dtdNotation(
                this,
                this.options.writer.filterOptions(s),
              );
            }
          }
          return (
            Object.defineProperty(i.prototype, "publicId", {
              get: function () {
                return this.pubID;
              },
            }),
            Object.defineProperty(i.prototype, "systemId", {
              get: function () {
                return this.sysID;
              },
            }),
            i
          );
        }.call(this));
  }.call(_I));
});
var Fc = y((xI, CI) => {
  (function () {
    var e, t, r, i, n, s, a, o, u;
    ({ isObject: u } = Sr()),
      (o = qt()),
      (e = Ae()),
      (t = xc()),
      (i = Cc()),
      (r = Oc()),
      (n = Tc()),
      (a = Dc()),
      (CI.exports = s =
        function () {
          class l extends o {
            constructor(h, c, d) {
              var g, C, S, O;
              if ((super(h), (this.type = e.DocType), h.children)) {
                for (O = h.children, C = 0, S = O.length; C < S; C++)
                  if (((g = O[C]), g.type === e.Element)) {
                    this.name = g.name;
                    break;
                  }
              }
              (this.documentObject = h),
                u(c) && ({ pubID: c, sysID: d } = c),
                d == null && ([d, c] = [c, d]),
                c != null && (this.pubID = this.stringify.dtdPubID(c)),
                d != null && (this.sysID = this.stringify.dtdSysID(d));
            }
            element(h, c) {
              var d;
              return (d = new r(this, h, c)), this.children.push(d), this;
            }
            attList(h, c, d, g, C) {
              var S;
              return (
                (S = new t(this, h, c, d, g, C)), this.children.push(S), this
              );
            }
            entity(h, c) {
              var d;
              return (d = new i(this, !1, h, c)), this.children.push(d), this;
            }
            pEntity(h, c) {
              var d;
              return (d = new i(this, !0, h, c)), this.children.push(d), this;
            }
            notation(h, c) {
              var d;
              return (d = new n(this, h, c)), this.children.push(d), this;
            }
            toString(h) {
              return this.options.writer.docType(
                this,
                this.options.writer.filterOptions(h),
              );
            }
            ele(h, c) {
              return this.element(h, c);
            }
            att(h, c, d, g, C) {
              return this.attList(h, c, d, g, C);
            }
            ent(h, c) {
              return this.entity(h, c);
            }
            pent(h, c) {
              return this.pEntity(h, c);
            }
            not(h, c) {
              return this.notation(h, c);
            }
            up() {
              return this.root() || this.documentObject;
            }
            isEqualNode(h) {
              return !(
                !super.isEqualNode(h) ||
                h.name !== this.name ||
                h.publicId !== this.publicId ||
                h.systemId !== this.systemId
              );
            }
          }
          return (
            Object.defineProperty(l.prototype, "entities", {
              get: function () {
                var f, h, c, d, g;
                for (d = {}, g = this.children, h = 0, c = g.length; h < c; h++)
                  (f = g[h]),
                    f.type === e.EntityDeclaration && !f.pe && (d[f.name] = f);
                return new a(d);
              },
            }),
            Object.defineProperty(l.prototype, "notations", {
              get: function () {
                var f, h, c, d, g;
                for (d = {}, g = this.children, h = 0, c = g.length; h < c; h++)
                  (f = g[h]),
                    f.type === e.NotationDeclaration && (d[f.name] = f);
                return new a(d);
              },
            }),
            Object.defineProperty(l.prototype, "publicId", {
              get: function () {
                return this.pubID;
              },
            }),
            Object.defineProperty(l.prototype, "systemId", {
              get: function () {
                return this.sysID;
              },
            }),
            Object.defineProperty(l.prototype, "internalSubset", {
              get: function () {
                throw new Error(
                  "This DOM method is not implemented." + this.debugInfo(),
                );
              },
            }),
            l
          );
        }.call(this));
  }.call(xI));
});
var Rc = y((OI, TI) => {
  (function () {
    var e, t, r;
    (e = Ae()),
      (t = qt()),
      (TI.exports = r =
        class extends t {
          constructor(n, s) {
            if ((super(n), s == null))
              throw new Error("Missing raw text. " + this.debugInfo());
            (this.type = e.Raw), (this.value = this.stringify.raw(s));
          }
          clone() {
            return Object.create(this);
          }
          toString(n) {
            return this.options.writer.raw(
              this,
              this.options.writer.filterOptions(n),
            );
          }
        });
  }.call(OI));
});
var Ac = y((FI, RI) => {
  (function () {
    var e, t, r;
    (e = Ae()),
      (t = du()),
      (RI.exports = r =
        function () {
          class i extends t {
            constructor(s, a) {
              if ((super(s), a == null))
                throw new Error("Missing element text. " + this.debugInfo());
              (this.name = "#text"),
                (this.type = e.Text),
                (this.value = this.stringify.text(a));
            }
            clone() {
              return Object.create(this);
            }
            toString(s) {
              return this.options.writer.text(
                this,
                this.options.writer.filterOptions(s),
              );
            }
            splitText(s) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            replaceWholeText(s) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
          }
          return (
            Object.defineProperty(i.prototype, "isElementContentWhitespace", {
              get: function () {
                throw new Error(
                  "This DOM method is not implemented." + this.debugInfo(),
                );
              },
            }),
            Object.defineProperty(i.prototype, "wholeText", {
              get: function () {
                var n, s, a;
                for (a = "", s = this.previousSibling; s; )
                  (a = s.data + a), (s = s.previousSibling);
                for (a += this.data, n = this.nextSibling; n; )
                  (a = a + n.data), (n = n.nextSibling);
                return a;
              },
            }),
            i
          );
        }.call(this));
  }.call(FI));
});
var Nc = y((AI, NI) => {
  (function () {
    var e, t, r;
    (e = Ae()),
      (t = du()),
      (NI.exports = r =
        class extends t {
          constructor(n, s, a) {
            if ((super(n), s == null))
              throw new Error(
                "Missing instruction target. " + this.debugInfo(),
              );
            (this.type = e.ProcessingInstruction),
              (this.target = this.stringify.insTarget(s)),
              (this.name = this.target),
              a && (this.value = this.stringify.insValue(a));
          }
          clone() {
            return Object.create(this);
          }
          toString(n) {
            return this.options.writer.processingInstruction(
              this,
              this.options.writer.filterOptions(n),
            );
          }
          isEqualNode(n) {
            return !(!super.isEqualNode(n) || n.target !== this.target);
          }
        });
  }.call(AI));
});
var vv = y((II, MI) => {
  (function () {
    var e, t, r;
    (r = qt()),
      (e = Ae()),
      (MI.exports = t =
        class extends r {
          constructor(n) {
            super(n), (this.type = e.Dummy);
          }
          clone() {
            return Object.create(this);
          }
          toString(n) {
            return "";
          }
        });
  }.call(II));
});
var PI = y((LI, qI) => {
  (function () {
    var e;
    qI.exports = e = function () {
      class t {
        constructor(i) {
          this.nodes = i;
        }
        clone() {
          return (this.nodes = null);
        }
        item(i) {
          return this.nodes[i] || null;
        }
      }
      return (
        Object.defineProperty(t.prototype, "length", {
          get: function () {
            return this.nodes.length || 0;
          },
        }),
        t
      );
    }.call(this);
  }.call(LI));
});
var jI = y((BI, kI) => {
  (function () {
    kI.exports = {
      Disconnected: 1,
      Preceding: 2,
      Following: 4,
      Contains: 8,
      ContainedBy: 16,
      ImplementationSpecific: 32,
    };
  }.call(BI));
});
var qt = y((UI, zI) => {
  (function () {
    var e,
      t,
      r,
      i,
      n,
      s,
      a,
      o,
      u,
      l,
      f,
      h,
      c,
      d,
      g,
      C,
      S,
      O,
      L = {}.hasOwnProperty,
      D = [].splice;
    ({ isObject: O, isFunction: S, isEmpty: C, getValue: g } = Sr()),
      (o = null),
      (r = null),
      (i = null),
      (n = null),
      (s = null),
      (c = null),
      (d = null),
      (h = null),
      (a = null),
      (t = null),
      (f = null),
      (u = null),
      (e = null),
      (zI.exports = l =
        function () {
          class w {
            constructor(m) {
              (this.parent = m),
                this.parent &&
                  ((this.options = this.parent.options),
                  (this.stringify = this.parent.stringify)),
                (this.value = null),
                (this.children = []),
                (this.baseURI = null),
                o ||
                  ((o = bc()),
                  (r = Ec()),
                  (i = _c()),
                  (n = Sc()),
                  (s = Fc()),
                  (c = Rc()),
                  (d = Ac()),
                  (h = Nc()),
                  (a = vv()),
                  (t = Ae()),
                  (f = PI()),
                  (u = Dc()),
                  (e = jI()));
            }
            setParent(m) {
              var x, A, p, T, R;
              for (
                this.parent = m,
                  m &&
                    ((this.options = m.options),
                    (this.stringify = m.stringify)),
                  T = this.children,
                  R = [],
                  A = 0,
                  p = T.length;
                A < p;
                A++
              )
                (x = T[A]), R.push(x.setParent(this));
              return R;
            }
            element(m, x, A) {
              var p, T, R, k, z, $, X, I, P;
              if (
                (($ = null),
                x === null && A == null && ([x, A] = [{}, null]),
                x == null && (x = {}),
                (x = g(x)),
                O(x) || ([A, x] = [x, A]),
                m != null && (m = g(m)),
                Array.isArray(m))
              )
                for (R = 0, X = m.length; R < X; R++)
                  (T = m[R]), ($ = this.element(T));
              else if (S(m)) $ = this.element(m.apply());
              else if (O(m)) {
                for (z in m)
                  if (!!L.call(m, z))
                    if (
                      ((P = m[z]),
                      S(P) && (P = P.apply()),
                      !this.options.ignoreDecorators &&
                        this.stringify.convertAttKey &&
                        z.indexOf(this.stringify.convertAttKey) === 0)
                    )
                      $ = this.attribute(
                        z.substr(this.stringify.convertAttKey.length),
                        P,
                      );
                    else if (
                      !this.options.separateArrayItems &&
                      Array.isArray(P) &&
                      C(P)
                    )
                      $ = this.dummy();
                    else if (O(P) && C(P)) $ = this.element(z);
                    else if (!this.options.keepNullNodes && P == null)
                      $ = this.dummy();
                    else if (
                      !this.options.separateArrayItems &&
                      Array.isArray(P)
                    )
                      for (k = 0, I = P.length; k < I; k++)
                        (T = P[k]), (p = {}), (p[z] = T), ($ = this.element(p));
                    else
                      O(P)
                        ? !this.options.ignoreDecorators &&
                          this.stringify.convertTextKey &&
                          z.indexOf(this.stringify.convertTextKey) === 0
                          ? ($ = this.element(P))
                          : (($ = this.element(z)), $.element(P))
                        : ($ = this.element(z, P));
              } else
                !this.options.keepNullNodes && A === null
                  ? ($ = this.dummy())
                  : !this.options.ignoreDecorators &&
                    this.stringify.convertTextKey &&
                    m.indexOf(this.stringify.convertTextKey) === 0
                  ? ($ = this.text(A))
                  : !this.options.ignoreDecorators &&
                    this.stringify.convertCDataKey &&
                    m.indexOf(this.stringify.convertCDataKey) === 0
                  ? ($ = this.cdata(A))
                  : !this.options.ignoreDecorators &&
                    this.stringify.convertCommentKey &&
                    m.indexOf(this.stringify.convertCommentKey) === 0
                  ? ($ = this.comment(A))
                  : !this.options.ignoreDecorators &&
                    this.stringify.convertRawKey &&
                    m.indexOf(this.stringify.convertRawKey) === 0
                  ? ($ = this.raw(A))
                  : !this.options.ignoreDecorators &&
                    this.stringify.convertPIKey &&
                    m.indexOf(this.stringify.convertPIKey) === 0
                  ? ($ = this.instruction(
                      m.substr(this.stringify.convertPIKey.length),
                      A,
                    ))
                  : ($ = this.node(m, x, A));
              if ($ == null)
                throw new Error(
                  "Could not create any elements with: " +
                    m +
                    ". " +
                    this.debugInfo(),
                );
              return $;
            }
            insertBefore(m, x, A) {
              var p, T, R, k, z;
              if (m?.type)
                return (
                  (R = m),
                  (k = x),
                  R.setParent(this),
                  k
                    ? ((T = children.indexOf(k)),
                      (z = children.splice(T)),
                      children.push(R),
                      Array.prototype.push.apply(children, z))
                    : children.push(R),
                  R
                );
              if (this.isRoot)
                throw new Error(
                  "Cannot insert elements at root level. " + this.debugInfo(m),
                );
              return (
                (T = this.parent.children.indexOf(this)),
                (z = this.parent.children.splice(T)),
                (p = this.parent.element(m, x, A)),
                Array.prototype.push.apply(this.parent.children, z),
                p
              );
            }
            insertAfter(m, x, A) {
              var p, T, R;
              if (this.isRoot)
                throw new Error(
                  "Cannot insert elements at root level. " + this.debugInfo(m),
                );
              return (
                (T = this.parent.children.indexOf(this)),
                (R = this.parent.children.splice(T + 1)),
                (p = this.parent.element(m, x, A)),
                Array.prototype.push.apply(this.parent.children, R),
                p
              );
            }
            remove() {
              var m, x;
              if (this.isRoot)
                throw new Error(
                  "Cannot remove the root element. " + this.debugInfo(),
                );
              return (
                (m = this.parent.children.indexOf(this)),
                D.apply(this.parent.children, [m, m - m + 1].concat((x = []))),
                this.parent
              );
            }
            node(m, x, A) {
              var p;
              return (
                m != null && (m = g(m)),
                x || (x = {}),
                (x = g(x)),
                O(x) || ([A, x] = [x, A]),
                (p = new o(this, m, x)),
                A != null && p.text(A),
                this.children.push(p),
                p
              );
            }
            text(m) {
              var x;
              return (
                O(m) && this.element(m),
                (x = new d(this, m)),
                this.children.push(x),
                this
              );
            }
            cdata(m) {
              var x;
              return (x = new r(this, m)), this.children.push(x), this;
            }
            comment(m) {
              var x;
              return (x = new i(this, m)), this.children.push(x), this;
            }
            commentBefore(m) {
              var x, A, p;
              return (
                (A = this.parent.children.indexOf(this)),
                (p = this.parent.children.splice(A)),
                (x = this.parent.comment(m)),
                Array.prototype.push.apply(this.parent.children, p),
                this
              );
            }
            commentAfter(m) {
              var x, A, p;
              return (
                (A = this.parent.children.indexOf(this)),
                (p = this.parent.children.splice(A + 1)),
                (x = this.parent.comment(m)),
                Array.prototype.push.apply(this.parent.children, p),
                this
              );
            }
            raw(m) {
              var x;
              return (x = new c(this, m)), this.children.push(x), this;
            }
            dummy() {
              var m;
              return (m = new a(this)), m;
            }
            instruction(m, x) {
              var A, p, T, R, k;
              if (
                (m != null && (m = g(m)),
                x != null && (x = g(x)),
                Array.isArray(m))
              )
                for (R = 0, k = m.length; R < k; R++)
                  (A = m[R]), this.instruction(A);
              else if (O(m))
                for (A in m)
                  !L.call(m, A) || ((p = m[A]), this.instruction(A, p));
              else
                S(x) && (x = x.apply()),
                  (T = new h(this, m, x)),
                  this.children.push(T);
              return this;
            }
            instructionBefore(m, x) {
              var A, p, T;
              return (
                (p = this.parent.children.indexOf(this)),
                (T = this.parent.children.splice(p)),
                (A = this.parent.instruction(m, x)),
                Array.prototype.push.apply(this.parent.children, T),
                this
              );
            }
            instructionAfter(m, x) {
              var A, p, T;
              return (
                (p = this.parent.children.indexOf(this)),
                (T = this.parent.children.splice(p + 1)),
                (A = this.parent.instruction(m, x)),
                Array.prototype.push.apply(this.parent.children, T),
                this
              );
            }
            declaration(m, x, A) {
              var p, T;
              return (
                (p = this.document()),
                (T = new n(p, m, x, A)),
                p.children.length === 0
                  ? p.children.unshift(T)
                  : p.children[0].type === t.Declaration
                  ? (p.children[0] = T)
                  : p.children.unshift(T),
                p.root() || p
              );
            }
            dtd(m, x) {
              var A, p, T, R, k, z, $, X, I, P;
              for (
                p = this.document(),
                  T = new s(p, m, x),
                  I = p.children,
                  R = k = 0,
                  $ = I.length;
                k < $;
                R = ++k
              )
                if (((A = I[R]), A.type === t.DocType))
                  return (p.children[R] = T), T;
              for (P = p.children, R = z = 0, X = P.length; z < X; R = ++z)
                if (((A = P[R]), A.isRoot))
                  return p.children.splice(R, 0, T), T;
              return p.children.push(T), T;
            }
            up() {
              if (this.isRoot)
                throw new Error(
                  "The root node has no parent. Use doc() if you need to get the document object.",
                );
              return this.parent;
            }
            root() {
              var m;
              for (m = this; m; ) {
                if (m.type === t.Document) return m.rootObject;
                if (m.isRoot) return m;
                m = m.parent;
              }
            }
            document() {
              var m;
              for (m = this; m; ) {
                if (m.type === t.Document) return m;
                m = m.parent;
              }
            }
            end(m) {
              return this.document().end(m);
            }
            prev() {
              var m;
              if (((m = this.parent.children.indexOf(this)), m < 1))
                throw new Error(
                  "Already at the first node. " + this.debugInfo(),
                );
              return this.parent.children[m - 1];
            }
            next() {
              var m;
              if (
                ((m = this.parent.children.indexOf(this)),
                m === -1 || m === this.parent.children.length - 1)
              )
                throw new Error(
                  "Already at the last node. " + this.debugInfo(),
                );
              return this.parent.children[m + 1];
            }
            importDocument(m) {
              var x, A, p, T, R;
              if (
                ((A = m.root().clone()),
                (A.parent = this),
                (A.isRoot = !1),
                this.children.push(A),
                this.type === t.Document &&
                  ((A.isRoot = !0),
                  (A.documentObject = this),
                  (this.rootObject = A),
                  this.children))
              ) {
                for (R = this.children, p = 0, T = R.length; p < T; p++)
                  if (((x = R[p]), x.type === t.DocType)) {
                    x.name = A.name;
                    break;
                  }
              }
              return this;
            }
            debugInfo(m) {
              var x, A;
              return (
                (m = m || this.name),
                m == null && !((x = this.parent) != null && x.name)
                  ? ""
                  : m == null
                  ? "parent: <" + this.parent.name + ">"
                  : (A = this.parent) != null && A.name
                  ? "node: <" + m + ">, parent: <" + this.parent.name + ">"
                  : "node: <" + m + ">"
              );
            }
            ele(m, x, A) {
              return this.element(m, x, A);
            }
            nod(m, x, A) {
              return this.node(m, x, A);
            }
            txt(m) {
              return this.text(m);
            }
            dat(m) {
              return this.cdata(m);
            }
            com(m) {
              return this.comment(m);
            }
            ins(m, x) {
              return this.instruction(m, x);
            }
            doc() {
              return this.document();
            }
            dec(m, x, A) {
              return this.declaration(m, x, A);
            }
            e(m, x, A) {
              return this.element(m, x, A);
            }
            n(m, x, A) {
              return this.node(m, x, A);
            }
            t(m) {
              return this.text(m);
            }
            d(m) {
              return this.cdata(m);
            }
            c(m) {
              return this.comment(m);
            }
            r(m) {
              return this.raw(m);
            }
            i(m, x) {
              return this.instruction(m, x);
            }
            u() {
              return this.up();
            }
            importXMLBuilder(m) {
              return this.importDocument(m);
            }
            attribute(m, x) {
              throw new Error("attribute() applies to element nodes only.");
            }
            att(m, x) {
              return this.attribute(m, x);
            }
            a(m, x) {
              return this.attribute(m, x);
            }
            removeAttribute(m) {
              throw new Error("attribute() applies to element nodes only.");
            }
            replaceChild(m, x) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            removeChild(m) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            appendChild(m) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            hasChildNodes() {
              return this.children.length !== 0;
            }
            cloneNode(m) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            normalize() {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            isSupported(m, x) {
              return !0;
            }
            hasAttributes() {
              return this.attribs.length !== 0;
            }
            compareDocumentPosition(m) {
              var x, A;
              return (
                (x = this),
                x === m
                  ? 0
                  : this.document() !== m.document()
                  ? ((A = e.Disconnected | e.ImplementationSpecific),
                    Math.random() < 0.5
                      ? (A |= e.Preceding)
                      : (A |= e.Following),
                    A)
                  : x.isAncestor(m)
                  ? e.Contains | e.Preceding
                  : x.isDescendant(m)
                  ? e.Contains | e.Following
                  : x.isPreceding(m)
                  ? e.Preceding
                  : e.Following
              );
            }
            isSameNode(m) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            lookupPrefix(m) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            isDefaultNamespace(m) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            lookupNamespaceURI(m) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            isEqualNode(m) {
              var x, A, p;
              if (
                m.nodeType !== this.nodeType ||
                m.children.length !== this.children.length
              )
                return !1;
              for (
                x = A = 0, p = this.children.length - 1;
                0 <= p ? A <= p : A >= p;
                x = 0 <= p ? ++A : --A
              )
                if (!this.children[x].isEqualNode(m.children[x])) return !1;
              return !0;
            }
            getFeature(m, x) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            setUserData(m, x, A) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            getUserData(m) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            contains(m) {
              return m ? m === this || this.isDescendant(m) : !1;
            }
            isDescendant(m) {
              var x, A, p, T, R;
              for (R = this.children, p = 0, T = R.length; p < T; p++)
                if (((x = R[p]), m === x || ((A = x.isDescendant(m)), A)))
                  return !0;
              return !1;
            }
            isAncestor(m) {
              return m.isDescendant(this);
            }
            isPreceding(m) {
              var x, A;
              return (
                (x = this.treePosition(m)),
                (A = this.treePosition(this)),
                x === -1 || A === -1 ? !1 : x < A
              );
            }
            isFollowing(m) {
              var x, A;
              return (
                (x = this.treePosition(m)),
                (A = this.treePosition(this)),
                x === -1 || A === -1 ? !1 : x > A
              );
            }
            treePosition(m) {
              var x, A;
              return (
                (A = 0),
                (x = !1),
                this.foreachTreeNode(this.document(), function (p) {
                  if ((A++, !x && p === m)) return (x = !0);
                }),
                x ? A : -1
              );
            }
            foreachTreeNode(m, x) {
              var A, p, T, R, k;
              for (
                m || (m = this.document()), R = m.children, p = 0, T = R.length;
                p < T;
                p++
              ) {
                if (((A = R[p]), (k = x(A)))) return k;
                if (((k = this.foreachTreeNode(A, x)), k)) return k;
              }
            }
          }
          return (
            Object.defineProperty(w.prototype, "nodeName", {
              get: function () {
                return this.name;
              },
            }),
            Object.defineProperty(w.prototype, "nodeType", {
              get: function () {
                return this.type;
              },
            }),
            Object.defineProperty(w.prototype, "nodeValue", {
              get: function () {
                return this.value;
              },
            }),
            Object.defineProperty(w.prototype, "parentNode", {
              get: function () {
                return this.parent;
              },
            }),
            Object.defineProperty(w.prototype, "childNodes", {
              get: function () {
                return (
                  (!this.childNodeList || !this.childNodeList.nodes) &&
                    (this.childNodeList = new f(this.children)),
                  this.childNodeList
                );
              },
            }),
            Object.defineProperty(w.prototype, "firstChild", {
              get: function () {
                return this.children[0] || null;
              },
            }),
            Object.defineProperty(w.prototype, "lastChild", {
              get: function () {
                return this.children[this.children.length - 1] || null;
              },
            }),
            Object.defineProperty(w.prototype, "previousSibling", {
              get: function () {
                var F;
                return (
                  (F = this.parent.children.indexOf(this)),
                  this.parent.children[F - 1] || null
                );
              },
            }),
            Object.defineProperty(w.prototype, "nextSibling", {
              get: function () {
                var F;
                return (
                  (F = this.parent.children.indexOf(this)),
                  this.parent.children[F + 1] || null
                );
              },
            }),
            Object.defineProperty(w.prototype, "ownerDocument", {
              get: function () {
                return this.document() || null;
              },
            }),
            Object.defineProperty(w.prototype, "textContent", {
              get: function () {
                var F, m, x, A, p;
                if (
                  this.nodeType === t.Element ||
                  this.nodeType === t.DocumentFragment
                ) {
                  for (
                    p = "", A = this.children, m = 0, x = A.length;
                    m < x;
                    m++
                  )
                    (F = A[m]), F.textContent && (p += F.textContent);
                  return p;
                } else return null;
              },
              set: function (F) {
                throw new Error(
                  "This DOM method is not implemented." + this.debugInfo(),
                );
              },
            }),
            w
          );
        }.call(this));
  }.call(UI));
});
var wv = y(($I, WI) => {
  (function () {
    var e,
      t = {}.hasOwnProperty;
    WI.exports = e = function () {
      class r {
        constructor(n) {
          var s, a, o;
          (this.assertLegalChar = this.assertLegalChar.bind(this)),
            (this.assertLegalName = this.assertLegalName.bind(this)),
            n || (n = {}),
            (this.options = n),
            this.options.version || (this.options.version = "1.0"),
            (a = n.stringify || {});
          for (s in a) !t.call(a, s) || ((o = a[s]), (this[s] = o));
        }
        name(n) {
          return this.options.noValidation
            ? n
            : this.assertLegalName("" + n || "");
        }
        text(n) {
          return this.options.noValidation
            ? n
            : this.assertLegalChar(this.textEscape("" + n || ""));
        }
        cdata(n) {
          return this.options.noValidation
            ? n
            : ((n = "" + n || ""),
              (n = n.replace("]]>", "]]]]><![CDATA[>")),
              this.assertLegalChar(n));
        }
        comment(n) {
          if (this.options.noValidation) return n;
          if (((n = "" + n || ""), n.match(/--/)))
            throw new Error("Comment text cannot contain double-hypen: " + n);
          return this.assertLegalChar(n);
        }
        raw(n) {
          return this.options.noValidation ? n : "" + n || "";
        }
        attValue(n) {
          return this.options.noValidation
            ? n
            : this.assertLegalChar(this.attEscape((n = "" + n || "")));
        }
        insTarget(n) {
          return this.options.noValidation
            ? n
            : this.assertLegalChar("" + n || "");
        }
        insValue(n) {
          if (this.options.noValidation) return n;
          if (((n = "" + n || ""), n.match(/\?>/)))
            throw new Error("Invalid processing instruction value: " + n);
          return this.assertLegalChar(n);
        }
        xmlVersion(n) {
          if (this.options.noValidation) return n;
          if (((n = "" + n || ""), !n.match(/1\.[0-9]+/)))
            throw new Error("Invalid version number: " + n);
          return n;
        }
        xmlEncoding(n) {
          if (this.options.noValidation) return n;
          if (((n = "" + n || ""), !n.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)))
            throw new Error("Invalid encoding: " + n);
          return this.assertLegalChar(n);
        }
        xmlStandalone(n) {
          return this.options.noValidation ? n : n ? "yes" : "no";
        }
        dtdPubID(n) {
          return this.options.noValidation
            ? n
            : this.assertLegalChar("" + n || "");
        }
        dtdSysID(n) {
          return this.options.noValidation
            ? n
            : this.assertLegalChar("" + n || "");
        }
        dtdElementValue(n) {
          return this.options.noValidation
            ? n
            : this.assertLegalChar("" + n || "");
        }
        dtdAttType(n) {
          return this.options.noValidation
            ? n
            : this.assertLegalChar("" + n || "");
        }
        dtdAttDefault(n) {
          return this.options.noValidation
            ? n
            : this.assertLegalChar("" + n || "");
        }
        dtdEntityValue(n) {
          return this.options.noValidation
            ? n
            : this.assertLegalChar("" + n || "");
        }
        dtdNData(n) {
          return this.options.noValidation
            ? n
            : this.assertLegalChar("" + n || "");
        }
        assertLegalChar(n) {
          var s, a;
          if (this.options.noValidation) return n;
          if (this.options.version === "1.0") {
            if (
              ((s =
                /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g),
              this.options.invalidCharReplacement !== void 0)
            )
              n = n.replace(s, this.options.invalidCharReplacement);
            else if ((a = n.match(s)))
              throw new Error(
                `Invalid character in string: ${n} at index ${a.index}`,
              );
          } else if (this.options.version === "1.1") {
            if (
              ((s =
                /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g),
              this.options.invalidCharReplacement !== void 0)
            )
              n = n.replace(s, this.options.invalidCharReplacement);
            else if ((a = n.match(s)))
              throw new Error(
                `Invalid character in string: ${n} at index ${a.index}`,
              );
          }
          return n;
        }
        assertLegalName(n) {
          var s;
          if (this.options.noValidation) return n;
          if (
            ((n = this.assertLegalChar(n)),
            (s =
              /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/),
            !n.match(s))
          )
            throw new Error(`Invalid character in name: ${n}`);
          return n;
        }
        textEscape(n) {
          var s;
          return this.options.noValidation
            ? n
            : ((s = this.options.noDoubleEncoding
                ? /(?!&(lt|gt|amp|apos|quot);)&/g
                : /&/g),
              n
                .replace(s, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\r/g, "&#xD;"));
        }
        attEscape(n) {
          var s;
          return this.options.noValidation
            ? n
            : ((s = this.options.noDoubleEncoding
                ? /(?!&(lt|gt|amp|apos|quot);)&/g
                : /&/g),
              n
                .replace(s, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/"/g, "&quot;")
                .replace(/\t/g, "&#x9;")
                .replace(/\n/g, "&#xA;")
                .replace(/\r/g, "&#xD;"));
        }
      }
      return (
        (r.prototype.convertAttKey = "@"),
        (r.prototype.convertPIKey = "?"),
        (r.prototype.convertTextKey = "#text"),
        (r.prototype.convertCDataKey = "#cdata"),
        (r.prototype.convertCommentKey = "#comment"),
        (r.prototype.convertRawKey = "#raw"),
        r
      );
    }.call(this);
  }.call($I));
});
var pu = y((GI, HI) => {
  (function () {
    HI.exports = { None: 0, OpenTag: 1, InsideTag: 2, CloseTag: 3 };
  }.call(GI));
});
var Dv = y((YI, VI) => {
  (function () {
    var e,
      t,
      r,
      i,
      n,
      s,
      a,
      o,
      u,
      l,
      f,
      h,
      c,
      d,
      g,
      C,
      S,
      O = {}.hasOwnProperty;
    ({ assign: S } = Sr()),
      (e = Ae()),
      (u = Sc()),
      (l = Fc()),
      (r = Ec()),
      (i = _c()),
      (h = bc()),
      (d = Rc()),
      (g = Ac()),
      (c = Nc()),
      (f = vv()),
      (n = xc()),
      (s = Oc()),
      (a = Cc()),
      (o = Tc()),
      (t = pu()),
      (VI.exports = C =
        class {
          constructor(D) {
            var w, F, m;
            D || (D = {}), (this.options = D), (F = D.writer || {});
            for (w in F)
              !O.call(F, w) ||
                ((m = F[w]), (this["_" + w] = this[w]), (this[w] = m));
          }
          filterOptions(D) {
            var w, F, m, x, A, p, T, R, k;
            return (
              D || (D = {}),
              (D = S({}, this.options, D)),
              (w = { writer: this }),
              (w.pretty = D.pretty || !1),
              (w.allowEmpty = D.allowEmpty || !1),
              (w.indent = (F = D.indent) != null ? F : "  "),
              (w.newline =
                (m = D.newline) != null
                  ? m
                  : `
`),
              (w.offset = (x = D.offset) != null ? x : 0),
              (w.width = (A = D.width) != null ? A : 0),
              (w.dontPrettyTextNodes =
                (p =
                  (T = D.dontPrettyTextNodes) != null
                    ? T
                    : D.dontprettytextnodes) != null
                  ? p
                  : 0),
              (w.spaceBeforeSlash =
                (R =
                  (k = D.spaceBeforeSlash) != null ? k : D.spacebeforeslash) !=
                null
                  ? R
                  : ""),
              w.spaceBeforeSlash === !0 && (w.spaceBeforeSlash = " "),
              (w.suppressPrettyCount = 0),
              (w.user = {}),
              (w.state = t.None),
              w
            );
          }
          indent(D, w, F) {
            var m;
            return !w.pretty || w.suppressPrettyCount
              ? ""
              : w.pretty && ((m = (F || 0) + w.offset + 1), m > 0)
              ? new Array(m).join(w.indent)
              : "";
          }
          endline(D, w, F) {
            return !w.pretty || w.suppressPrettyCount ? "" : w.newline;
          }
          attribute(D, w, F) {
            var m;
            return (
              this.openAttribute(D, w, F),
              w.pretty && w.width > 0
                ? (m = D.name + '="' + D.value + '"')
                : (m = " " + D.name + '="' + D.value + '"'),
              this.closeAttribute(D, w, F),
              m
            );
          }
          cdata(D, w, F) {
            var m;
            return (
              this.openNode(D, w, F),
              (w.state = t.OpenTag),
              (m = this.indent(D, w, F) + "<![CDATA["),
              (w.state = t.InsideTag),
              (m += D.value),
              (w.state = t.CloseTag),
              (m += "]]>" + this.endline(D, w, F)),
              (w.state = t.None),
              this.closeNode(D, w, F),
              m
            );
          }
          comment(D, w, F) {
            var m;
            return (
              this.openNode(D, w, F),
              (w.state = t.OpenTag),
              (m = this.indent(D, w, F) + "<!-- "),
              (w.state = t.InsideTag),
              (m += D.value),
              (w.state = t.CloseTag),
              (m += " -->" + this.endline(D, w, F)),
              (w.state = t.None),
              this.closeNode(D, w, F),
              m
            );
          }
          declaration(D, w, F) {
            var m;
            return (
              this.openNode(D, w, F),
              (w.state = t.OpenTag),
              (m = this.indent(D, w, F) + "<?xml"),
              (w.state = t.InsideTag),
              (m += ' version="' + D.version + '"'),
              D.encoding != null && (m += ' encoding="' + D.encoding + '"'),
              D.standalone != null &&
                (m += ' standalone="' + D.standalone + '"'),
              (w.state = t.CloseTag),
              (m += w.spaceBeforeSlash + "?>"),
              (m += this.endline(D, w, F)),
              (w.state = t.None),
              this.closeNode(D, w, F),
              m
            );
          }
          docType(D, w, F) {
            var m, x, A, p, T;
            if (
              (F || (F = 0),
              this.openNode(D, w, F),
              (w.state = t.OpenTag),
              (p = this.indent(D, w, F)),
              (p += "<!DOCTYPE " + D.root().name),
              D.pubID && D.sysID
                ? (p += ' PUBLIC "' + D.pubID + '" "' + D.sysID + '"')
                : D.sysID && (p += ' SYSTEM "' + D.sysID + '"'),
              D.children.length > 0)
            ) {
              for (
                p += " [",
                  p += this.endline(D, w, F),
                  w.state = t.InsideTag,
                  T = D.children,
                  x = 0,
                  A = T.length;
                x < A;
                x++
              )
                (m = T[x]), (p += this.writeChildNode(m, w, F + 1));
              (w.state = t.CloseTag), (p += "]");
            }
            return (
              (w.state = t.CloseTag),
              (p += w.spaceBeforeSlash + ">"),
              (p += this.endline(D, w, F)),
              (w.state = t.None),
              this.closeNode(D, w, F),
              p
            );
          }
          element(D, w, F) {
            var m, x, A, p, T, R, k, z, $, X, I, P, G, J, W, Ne, Ie, Pt, _t;
            if (
              (F || (F = 0),
              (P = !1),
              this.openNode(D, w, F),
              (w.state = t.OpenTag),
              (G = this.indent(D, w, F) + "<" + D.name),
              w.pretty && w.width > 0)
            ) {
              (z = G.length), (W = D.attribs);
              for (I in W)
                !O.call(W, I) ||
                  ((m = W[I]),
                  (J = this.attribute(m, w, F)),
                  (x = J.length),
                  z + x > w.width
                    ? ((_t = this.indent(D, w, F + 1) + J),
                      (G += this.endline(D, w, F) + _t),
                      (z = _t.length))
                    : ((_t = " " + J), (G += _t), (z += _t.length)));
            } else {
              Ne = D.attribs;
              for (I in Ne)
                !O.call(Ne, I) || ((m = Ne[I]), (G += this.attribute(m, w, F)));
            }
            if (
              ((p = D.children.length),
              (T = p === 0 ? null : D.children[0]),
              p === 0 ||
                D.children.every(function (Be) {
                  return (
                    (Be.type === e.Text ||
                      Be.type === e.Raw ||
                      Be.type === e.CData) &&
                    Be.value === ""
                  );
                }))
            )
              w.allowEmpty
                ? ((G += ">"),
                  (w.state = t.CloseTag),
                  (G += "</" + D.name + ">" + this.endline(D, w, F)))
                : ((w.state = t.CloseTag),
                  (G += w.spaceBeforeSlash + "/>" + this.endline(D, w, F)));
            else if (
              w.pretty &&
              p === 1 &&
              (T.type === e.Text || T.type === e.Raw || T.type === e.CData) &&
              T.value != null
            )
              (G += ">"),
                (w.state = t.InsideTag),
                w.suppressPrettyCount++,
                (P = !0),
                (G += this.writeChildNode(T, w, F + 1)),
                w.suppressPrettyCount--,
                (P = !1),
                (w.state = t.CloseTag),
                (G += "</" + D.name + ">" + this.endline(D, w, F));
            else {
              if (w.dontPrettyTextNodes) {
                for (Ie = D.children, R = 0, $ = Ie.length; R < $; R++)
                  if (
                    ((A = Ie[R]),
                    (A.type === e.Text ||
                      A.type === e.Raw ||
                      A.type === e.CData) &&
                      A.value != null)
                  ) {
                    w.suppressPrettyCount++, (P = !0);
                    break;
                  }
              }
              for (
                G += ">" + this.endline(D, w, F),
                  w.state = t.InsideTag,
                  Pt = D.children,
                  k = 0,
                  X = Pt.length;
                k < X;
                k++
              )
                (A = Pt[k]), (G += this.writeChildNode(A, w, F + 1));
              (w.state = t.CloseTag),
                (G += this.indent(D, w, F) + "</" + D.name + ">"),
                P && w.suppressPrettyCount--,
                (G += this.endline(D, w, F)),
                (w.state = t.None);
            }
            return this.closeNode(D, w, F), G;
          }
          writeChildNode(D, w, F) {
            switch (D.type) {
              case e.CData:
                return this.cdata(D, w, F);
              case e.Comment:
                return this.comment(D, w, F);
              case e.Element:
                return this.element(D, w, F);
              case e.Raw:
                return this.raw(D, w, F);
              case e.Text:
                return this.text(D, w, F);
              case e.ProcessingInstruction:
                return this.processingInstruction(D, w, F);
              case e.Dummy:
                return "";
              case e.Declaration:
                return this.declaration(D, w, F);
              case e.DocType:
                return this.docType(D, w, F);
              case e.AttributeDeclaration:
                return this.dtdAttList(D, w, F);
              case e.ElementDeclaration:
                return this.dtdElement(D, w, F);
              case e.EntityDeclaration:
                return this.dtdEntity(D, w, F);
              case e.NotationDeclaration:
                return this.dtdNotation(D, w, F);
              default:
                throw new Error("Unknown XML node type: " + D.constructor.name);
            }
          }
          processingInstruction(D, w, F) {
            var m;
            return (
              this.openNode(D, w, F),
              (w.state = t.OpenTag),
              (m = this.indent(D, w, F) + "<?"),
              (w.state = t.InsideTag),
              (m += D.target),
              D.value && (m += " " + D.value),
              (w.state = t.CloseTag),
              (m += w.spaceBeforeSlash + "?>"),
              (m += this.endline(D, w, F)),
              (w.state = t.None),
              this.closeNode(D, w, F),
              m
            );
          }
          raw(D, w, F) {
            var m;
            return (
              this.openNode(D, w, F),
              (w.state = t.OpenTag),
              (m = this.indent(D, w, F)),
              (w.state = t.InsideTag),
              (m += D.value),
              (w.state = t.CloseTag),
              (m += this.endline(D, w, F)),
              (w.state = t.None),
              this.closeNode(D, w, F),
              m
            );
          }
          text(D, w, F) {
            var m;
            return (
              this.openNode(D, w, F),
              (w.state = t.OpenTag),
              (m = this.indent(D, w, F)),
              (w.state = t.InsideTag),
              (m += D.value),
              (w.state = t.CloseTag),
              (m += this.endline(D, w, F)),
              (w.state = t.None),
              this.closeNode(D, w, F),
              m
            );
          }
          dtdAttList(D, w, F) {
            var m;
            return (
              this.openNode(D, w, F),
              (w.state = t.OpenTag),
              (m = this.indent(D, w, F) + "<!ATTLIST"),
              (w.state = t.InsideTag),
              (m +=
                " " +
                D.elementName +
                " " +
                D.attributeName +
                " " +
                D.attributeType),
              D.defaultValueType !== "#DEFAULT" &&
                (m += " " + D.defaultValueType),
              D.defaultValue && (m += ' "' + D.defaultValue + '"'),
              (w.state = t.CloseTag),
              (m += w.spaceBeforeSlash + ">" + this.endline(D, w, F)),
              (w.state = t.None),
              this.closeNode(D, w, F),
              m
            );
          }
          dtdElement(D, w, F) {
            var m;
            return (
              this.openNode(D, w, F),
              (w.state = t.OpenTag),
              (m = this.indent(D, w, F) + "<!ELEMENT"),
              (w.state = t.InsideTag),
              (m += " " + D.name + " " + D.value),
              (w.state = t.CloseTag),
              (m += w.spaceBeforeSlash + ">" + this.endline(D, w, F)),
              (w.state = t.None),
              this.closeNode(D, w, F),
              m
            );
          }
          dtdEntity(D, w, F) {
            var m;
            return (
              this.openNode(D, w, F),
              (w.state = t.OpenTag),
              (m = this.indent(D, w, F) + "<!ENTITY"),
              (w.state = t.InsideTag),
              D.pe && (m += " %"),
              (m += " " + D.name),
              D.value
                ? (m += ' "' + D.value + '"')
                : (D.pubID && D.sysID
                    ? (m += ' PUBLIC "' + D.pubID + '" "' + D.sysID + '"')
                    : D.sysID && (m += ' SYSTEM "' + D.sysID + '"'),
                  D.nData && (m += " NDATA " + D.nData)),
              (w.state = t.CloseTag),
              (m += w.spaceBeforeSlash + ">" + this.endline(D, w, F)),
              (w.state = t.None),
              this.closeNode(D, w, F),
              m
            );
          }
          dtdNotation(D, w, F) {
            var m;
            return (
              this.openNode(D, w, F),
              (w.state = t.OpenTag),
              (m = this.indent(D, w, F) + "<!NOTATION"),
              (w.state = t.InsideTag),
              (m += " " + D.name),
              D.pubID && D.sysID
                ? (m += ' PUBLIC "' + D.pubID + '" "' + D.sysID + '"')
                : D.pubID
                ? (m += ' PUBLIC "' + D.pubID + '"')
                : D.sysID && (m += ' SYSTEM "' + D.sysID + '"'),
              (w.state = t.CloseTag),
              (m += w.spaceBeforeSlash + ">" + this.endline(D, w, F)),
              (w.state = t.None),
              this.closeNode(D, w, F),
              m
            );
          }
          openNode(D, w, F) {}
          closeNode(D, w, F) {}
          openAttribute(D, w, F) {}
          closeAttribute(D, w, F) {}
        });
  }.call(YI));
});
var Ic = y((XI, ZI) => {
  (function () {
    var e, t;
    (t = Dv()),
      (ZI.exports = e =
        class extends t {
          constructor(i) {
            super(i);
          }
          document(i, n) {
            var s, a, o, u, l;
            for (
              n = this.filterOptions(n),
                u = "",
                l = i.children,
                a = 0,
                o = l.length;
              a < o;
              a++
            )
              (s = l[a]), (u += this.writeChildNode(s, n, 0));
            return (
              n.pretty &&
                u.slice(-n.newline.length) === n.newline &&
                (u = u.slice(0, -n.newline.length)),
              u
            );
          }
        });
  }.call(XI));
});
var bv = y((KI, QI) => {
  (function () {
    var e, t, r, i, n, s, a, o;
    ({ isPlainObject: o } = Sr()),
      (r = gv()),
      (t = eI()),
      (n = qt()),
      (e = Ae()),
      (a = wv()),
      (s = Ic()),
      (QI.exports = i =
        function () {
          class u extends n {
            constructor(f) {
              super(null),
                (this.name = "#document"),
                (this.type = e.Document),
                (this.documentURI = null),
                (this.domConfig = new t()),
                f || (f = {}),
                f.writer || (f.writer = new s()),
                (this.options = f),
                (this.stringify = new a(f));
            }
            end(f) {
              var h;
              return (
                (h = {}),
                f
                  ? o(f) && ((h = f), (f = this.options.writer))
                  : (f = this.options.writer),
                f.document(this, f.filterOptions(h))
              );
            }
            toString(f) {
              return this.options.writer.document(
                this,
                this.options.writer.filterOptions(f),
              );
            }
            createElement(f) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            createDocumentFragment() {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            createTextNode(f) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            createComment(f) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            createCDATASection(f) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            createProcessingInstruction(f, h) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            createAttribute(f) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            createEntityReference(f) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            getElementsByTagName(f) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            importNode(f, h) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            createElementNS(f, h) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            createAttributeNS(f, h) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            getElementsByTagNameNS(f, h) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            getElementById(f) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            adoptNode(f) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            normalizeDocument() {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            renameNode(f, h, c) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            getElementsByClassName(f) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            createEvent(f) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            createRange() {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            createNodeIterator(f, h, c) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
            createTreeWalker(f, h, c) {
              throw new Error(
                "This DOM method is not implemented." + this.debugInfo(),
              );
            }
          }
          return (
            Object.defineProperty(u.prototype, "implementation", {
              value: new r(),
            }),
            Object.defineProperty(u.prototype, "doctype", {
              get: function () {
                var l, f, h, c;
                for (c = this.children, f = 0, h = c.length; f < h; f++)
                  if (((l = c[f]), l.type === e.DocType)) return l;
                return null;
              },
            }),
            Object.defineProperty(u.prototype, "documentElement", {
              get: function () {
                return this.rootObject || null;
              },
            }),
            Object.defineProperty(u.prototype, "inputEncoding", {
              get: function () {
                return null;
              },
            }),
            Object.defineProperty(u.prototype, "strictErrorChecking", {
              get: function () {
                return !1;
              },
            }),
            Object.defineProperty(u.prototype, "xmlEncoding", {
              get: function () {
                return this.children.length !== 0 &&
                  this.children[0].type === e.Declaration
                  ? this.children[0].encoding
                  : null;
              },
            }),
            Object.defineProperty(u.prototype, "xmlStandalone", {
              get: function () {
                return this.children.length !== 0 &&
                  this.children[0].type === e.Declaration
                  ? this.children[0].standalone === "yes"
                  : !1;
              },
            }),
            Object.defineProperty(u.prototype, "xmlVersion", {
              get: function () {
                return this.children.length !== 0 &&
                  this.children[0].type === e.Declaration
                  ? this.children[0].version
                  : "1.0";
              },
            }),
            Object.defineProperty(u.prototype, "URL", {
              get: function () {
                return this.documentURI;
              },
            }),
            Object.defineProperty(u.prototype, "origin", {
              get: function () {
                return null;
              },
            }),
            Object.defineProperty(u.prototype, "compatMode", {
              get: function () {
                return null;
              },
            }),
            Object.defineProperty(u.prototype, "characterSet", {
              get: function () {
                return null;
              },
            }),
            Object.defineProperty(u.prototype, "contentType", {
              get: function () {
                return null;
              },
            }),
            u
          );
        }.call(this));
  }.call(KI));
});
var tM = y((JI, eM) => {
  (function () {
    var e,
      t,
      r,
      i,
      n,
      s,
      a,
      o,
      u,
      l,
      f,
      h,
      c,
      d,
      g,
      C,
      S,
      O,
      L,
      D,
      w,
      F,
      m,
      x = {}.hasOwnProperty;
    ({ isObject: F, isFunction: w, isPlainObject: m, getValue: D } = Sr()),
      (e = Ae()),
      (h = bv()),
      (d = bc()),
      (i = Ec()),
      (n = _c()),
      (C = Rc()),
      (L = Ac()),
      (g = Nc()),
      (l = Sc()),
      (f = Fc()),
      (s = xc()),
      (o = Cc()),
      (a = Oc()),
      (u = Tc()),
      (r = yv()),
      (O = wv()),
      (S = Ic()),
      (t = pu()),
      (eM.exports = c =
        class {
          constructor(p, T, R) {
            var k;
            (this.name = "?xml"),
              (this.type = e.Document),
              p || (p = {}),
              (k = {}),
              p.writer
                ? m(p.writer) && ((k = p.writer), (p.writer = new S()))
                : (p.writer = new S()),
              (this.options = p),
              (this.writer = p.writer),
              (this.writerOptions = this.writer.filterOptions(k)),
              (this.stringify = new O(p)),
              (this.onDataCallback = T || function () {}),
              (this.onEndCallback = R || function () {}),
              (this.currentNode = null),
              (this.currentLevel = -1),
              (this.openTags = {}),
              (this.documentStarted = !1),
              (this.documentCompleted = !1),
              (this.root = null);
          }
          createChildNode(p) {
            var T, R, k, z, $, X, I, P;
            switch (p.type) {
              case e.CData:
                this.cdata(p.value);
                break;
              case e.Comment:
                this.comment(p.value);
                break;
              case e.Element:
                (k = {}), (I = p.attribs);
                for (R in I) !x.call(I, R) || ((T = I[R]), (k[R] = T.value));
                this.node(p.name, k);
                break;
              case e.Dummy:
                this.dummy();
                break;
              case e.Raw:
                this.raw(p.value);
                break;
              case e.Text:
                this.text(p.value);
                break;
              case e.ProcessingInstruction:
                this.instruction(p.target, p.value);
                break;
              default:
                throw new Error(
                  "This XML node type is not supported in a JS object: " +
                    p.constructor.name,
                );
            }
            for (P = p.children, $ = 0, X = P.length; $ < X; $++)
              (z = P[$]),
                this.createChildNode(z),
                z.type === e.Element && this.up();
            return this;
          }
          dummy() {
            return this;
          }
          node(p, T, R) {
            if (p == null) throw new Error("Missing node name.");
            if (this.root && this.currentLevel === -1)
              throw new Error(
                "Document can only have one root node. " + this.debugInfo(p),
              );
            return (
              this.openCurrent(),
              (p = D(p)),
              T == null && (T = {}),
              (T = D(T)),
              F(T) || ([R, T] = [T, R]),
              (this.currentNode = new d(this, p, T)),
              (this.currentNode.children = !1),
              this.currentLevel++,
              (this.openTags[this.currentLevel] = this.currentNode),
              R != null && this.text(R),
              this
            );
          }
          element(p, T, R) {
            var k, z, $, X, I, P;
            if (this.currentNode && this.currentNode.type === e.DocType)
              this.dtdElement(...arguments);
            else if (Array.isArray(p) || F(p) || w(p))
              for (
                X = this.options.noValidation,
                  this.options.noValidation = !0,
                  P = new h(this.options).element("TEMP_ROOT"),
                  P.element(p),
                  this.options.noValidation = X,
                  I = P.children,
                  z = 0,
                  $ = I.length;
                z < $;
                z++
              )
                (k = I[z]),
                  this.createChildNode(k),
                  k.type === e.Element && this.up();
            else this.node(p, T, R);
            return this;
          }
          attribute(p, T) {
            var R, k;
            if (!this.currentNode || this.currentNode.children)
              throw new Error(
                "att() can only be used immediately after an ele() call in callback mode. " +
                  this.debugInfo(p),
              );
            if ((p != null && (p = D(p)), F(p)))
              for (R in p) !x.call(p, R) || ((k = p[R]), this.attribute(R, k));
            else
              w(T) && (T = T.apply()),
                this.options.keepNullAttributes && T == null
                  ? (this.currentNode.attribs[p] = new r(this, p, ""))
                  : T != null &&
                    (this.currentNode.attribs[p] = new r(this, p, T));
            return this;
          }
          text(p) {
            var T;
            return (
              this.openCurrent(),
              (T = new L(this, p)),
              this.onData(
                this.writer.text(T, this.writerOptions, this.currentLevel + 1),
                this.currentLevel + 1,
              ),
              this
            );
          }
          cdata(p) {
            var T;
            return (
              this.openCurrent(),
              (T = new i(this, p)),
              this.onData(
                this.writer.cdata(T, this.writerOptions, this.currentLevel + 1),
                this.currentLevel + 1,
              ),
              this
            );
          }
          comment(p) {
            var T;
            return (
              this.openCurrent(),
              (T = new n(this, p)),
              this.onData(
                this.writer.comment(
                  T,
                  this.writerOptions,
                  this.currentLevel + 1,
                ),
                this.currentLevel + 1,
              ),
              this
            );
          }
          raw(p) {
            var T;
            return (
              this.openCurrent(),
              (T = new C(this, p)),
              this.onData(
                this.writer.raw(T, this.writerOptions, this.currentLevel + 1),
                this.currentLevel + 1,
              ),
              this
            );
          }
          instruction(p, T) {
            var R, k, z, $, X;
            if (
              (this.openCurrent(),
              p != null && (p = D(p)),
              T != null && (T = D(T)),
              Array.isArray(p))
            )
              for (R = 0, $ = p.length; R < $; R++)
                (k = p[R]), this.instruction(k);
            else if (F(p))
              for (k in p)
                !x.call(p, k) || ((z = p[k]), this.instruction(k, z));
            else
              w(T) && (T = T.apply()),
                (X = new g(this, p, T)),
                this.onData(
                  this.writer.processingInstruction(
                    X,
                    this.writerOptions,
                    this.currentLevel + 1,
                  ),
                  this.currentLevel + 1,
                );
            return this;
          }
          declaration(p, T, R) {
            var k;
            if ((this.openCurrent(), this.documentStarted))
              throw new Error("declaration() must be the first node.");
            return (
              (k = new l(this, p, T, R)),
              this.onData(
                this.writer.declaration(
                  k,
                  this.writerOptions,
                  this.currentLevel + 1,
                ),
                this.currentLevel + 1,
              ),
              this
            );
          }
          doctype(p, T, R) {
            if ((this.openCurrent(), p == null))
              throw new Error("Missing root node name.");
            if (this.root)
              throw new Error("dtd() must come before the root node.");
            return (
              (this.currentNode = new f(this, T, R)),
              (this.currentNode.rootNodeName = p),
              (this.currentNode.children = !1),
              this.currentLevel++,
              (this.openTags[this.currentLevel] = this.currentNode),
              this
            );
          }
          dtdElement(p, T) {
            var R;
            return (
              this.openCurrent(),
              (R = new a(this, p, T)),
              this.onData(
                this.writer.dtdElement(
                  R,
                  this.writerOptions,
                  this.currentLevel + 1,
                ),
                this.currentLevel + 1,
              ),
              this
            );
          }
          attList(p, T, R, k, z) {
            var $;
            return (
              this.openCurrent(),
              ($ = new s(this, p, T, R, k, z)),
              this.onData(
                this.writer.dtdAttList(
                  $,
                  this.writerOptions,
                  this.currentLevel + 1,
                ),
                this.currentLevel + 1,
              ),
              this
            );
          }
          entity(p, T) {
            var R;
            return (
              this.openCurrent(),
              (R = new o(this, !1, p, T)),
              this.onData(
                this.writer.dtdEntity(
                  R,
                  this.writerOptions,
                  this.currentLevel + 1,
                ),
                this.currentLevel + 1,
              ),
              this
            );
          }
          pEntity(p, T) {
            var R;
            return (
              this.openCurrent(),
              (R = new o(this, !0, p, T)),
              this.onData(
                this.writer.dtdEntity(
                  R,
                  this.writerOptions,
                  this.currentLevel + 1,
                ),
                this.currentLevel + 1,
              ),
              this
            );
          }
          notation(p, T) {
            var R;
            return (
              this.openCurrent(),
              (R = new u(this, p, T)),
              this.onData(
                this.writer.dtdNotation(
                  R,
                  this.writerOptions,
                  this.currentLevel + 1,
                ),
                this.currentLevel + 1,
              ),
              this
            );
          }
          up() {
            if (this.currentLevel < 0)
              throw new Error("The document node has no parent.");
            return (
              this.currentNode
                ? (this.currentNode.children
                    ? this.closeNode(this.currentNode)
                    : this.openNode(this.currentNode),
                  (this.currentNode = null))
                : this.closeNode(this.openTags[this.currentLevel]),
              delete this.openTags[this.currentLevel],
              this.currentLevel--,
              this
            );
          }
          end() {
            for (; this.currentLevel >= 0; ) this.up();
            return this.onEnd();
          }
          openCurrent() {
            if (this.currentNode)
              return (
                (this.currentNode.children = !0),
                this.openNode(this.currentNode)
              );
          }
          openNode(p) {
            var T, R, k, z;
            if (!p.isOpen) {
              if (
                (!this.root &&
                  this.currentLevel === 0 &&
                  p.type === e.Element &&
                  (this.root = p),
                (R = ""),
                p.type === e.Element)
              ) {
                (this.writerOptions.state = t.OpenTag),
                  (R =
                    this.writer.indent(
                      p,
                      this.writerOptions,
                      this.currentLevel,
                    ) +
                    "<" +
                    p.name),
                  (z = p.attribs);
                for (k in z)
                  !x.call(z, k) ||
                    ((T = z[k]),
                    (R += this.writer.attribute(
                      T,
                      this.writerOptions,
                      this.currentLevel,
                    )));
                (R +=
                  (p.children ? ">" : "/>") +
                  this.writer.endline(
                    p,
                    this.writerOptions,
                    this.currentLevel,
                  )),
                  (this.writerOptions.state = t.InsideTag);
              } else
                (this.writerOptions.state = t.OpenTag),
                  (R =
                    this.writer.indent(
                      p,
                      this.writerOptions,
                      this.currentLevel,
                    ) +
                    "<!DOCTYPE " +
                    p.rootNodeName),
                  p.pubID && p.sysID
                    ? (R += ' PUBLIC "' + p.pubID + '" "' + p.sysID + '"')
                    : p.sysID && (R += ' SYSTEM "' + p.sysID + '"'),
                  p.children
                    ? ((R += " ["), (this.writerOptions.state = t.InsideTag))
                    : ((this.writerOptions.state = t.CloseTag), (R += ">")),
                  (R += this.writer.endline(
                    p,
                    this.writerOptions,
                    this.currentLevel,
                  ));
              return this.onData(R, this.currentLevel), (p.isOpen = !0);
            }
          }
          closeNode(p) {
            var T;
            if (!p.isClosed)
              return (
                (T = ""),
                (this.writerOptions.state = t.CloseTag),
                p.type === e.Element
                  ? (T =
                      this.writer.indent(
                        p,
                        this.writerOptions,
                        this.currentLevel,
                      ) +
                      "</" +
                      p.name +
                      ">" +
                      this.writer.endline(
                        p,
                        this.writerOptions,
                        this.currentLevel,
                      ))
                  : (T =
                      this.writer.indent(
                        p,
                        this.writerOptions,
                        this.currentLevel,
                      ) +
                      "]>" +
                      this.writer.endline(
                        p,
                        this.writerOptions,
                        this.currentLevel,
                      )),
                (this.writerOptions.state = t.None),
                this.onData(T, this.currentLevel),
                (p.isClosed = !0)
              );
          }
          onData(p, T) {
            return (this.documentStarted = !0), this.onDataCallback(p, T + 1);
          }
          onEnd() {
            return (this.documentCompleted = !0), this.onEndCallback();
          }
          debugInfo(p) {
            return p == null ? "" : "node: <" + p + ">";
          }
          ele() {
            return this.element(...arguments);
          }
          nod(p, T, R) {
            return this.node(p, T, R);
          }
          txt(p) {
            return this.text(p);
          }
          dat(p) {
            return this.cdata(p);
          }
          com(p) {
            return this.comment(p);
          }
          ins(p, T) {
            return this.instruction(p, T);
          }
          dec(p, T, R) {
            return this.declaration(p, T, R);
          }
          dtd(p, T, R) {
            return this.doctype(p, T, R);
          }
          e(p, T, R) {
            return this.element(p, T, R);
          }
          n(p, T, R) {
            return this.node(p, T, R);
          }
          t(p) {
            return this.text(p);
          }
          d(p) {
            return this.cdata(p);
          }
          c(p) {
            return this.comment(p);
          }
          r(p) {
            return this.raw(p);
          }
          i(p, T) {
            return this.instruction(p, T);
          }
          att() {
            return this.currentNode && this.currentNode.type === e.DocType
              ? this.attList(...arguments)
              : this.attribute(...arguments);
          }
          a() {
            return this.currentNode && this.currentNode.type === e.DocType
              ? this.attList(...arguments)
              : this.attribute(...arguments);
          }
          ent(p, T) {
            return this.entity(p, T);
          }
          pent(p, T) {
            return this.pEntity(p, T);
          }
          not(p, T) {
            return this.notation(p, T);
          }
        });
  }.call(JI));
});
var nM = y((rM, iM) => {
  (function () {
    var e,
      t,
      r,
      i,
      n = {}.hasOwnProperty;
    (e = Ae()),
      (i = Dv()),
      (t = pu()),
      (iM.exports = r =
        class extends i {
          constructor(a, o) {
            super(o), (this.stream = a);
          }
          endline(a, o, u) {
            return a.isLastRootNode && o.state === t.CloseTag
              ? ""
              : super.endline(a, o, u);
          }
          document(a, o) {
            var u, l, f, h, c, d, g, C, S;
            for (g = a.children, l = f = 0, c = g.length; f < c; l = ++f)
              (u = g[l]), (u.isLastRootNode = l === a.children.length - 1);
            for (
              o = this.filterOptions(o),
                C = a.children,
                S = [],
                h = 0,
                d = C.length;
              h < d;
              h++
            )
              (u = C[h]), S.push(this.writeChildNode(u, o, 0));
            return S;
          }
          cdata(a, o, u) {
            return this.stream.write(super.cdata(a, o, u));
          }
          comment(a, o, u) {
            return this.stream.write(super.comment(a, o, u));
          }
          declaration(a, o, u) {
            return this.stream.write(super.declaration(a, o, u));
          }
          docType(a, o, u) {
            var l, f, h, c;
            if (
              (u || (u = 0),
              this.openNode(a, o, u),
              (o.state = t.OpenTag),
              this.stream.write(this.indent(a, o, u)),
              this.stream.write("<!DOCTYPE " + a.root().name),
              a.pubID && a.sysID
                ? this.stream.write(
                    ' PUBLIC "' + a.pubID + '" "' + a.sysID + '"',
                  )
                : a.sysID && this.stream.write(' SYSTEM "' + a.sysID + '"'),
              a.children.length > 0)
            ) {
              for (
                this.stream.write(" ["),
                  this.stream.write(this.endline(a, o, u)),
                  o.state = t.InsideTag,
                  c = a.children,
                  f = 0,
                  h = c.length;
                f < h;
                f++
              )
                (l = c[f]), this.writeChildNode(l, o, u + 1);
              (o.state = t.CloseTag), this.stream.write("]");
            }
            return (
              (o.state = t.CloseTag),
              this.stream.write(o.spaceBeforeSlash + ">"),
              this.stream.write(this.endline(a, o, u)),
              (o.state = t.None),
              this.closeNode(a, o, u)
            );
          }
          element(a, o, u) {
            var l, f, h, c, d, g, C, S, O, L, D, w, F, m, x, A;
            if (
              (u || (u = 0),
              this.openNode(a, o, u),
              (o.state = t.OpenTag),
              (D = this.indent(a, o, u) + "<" + a.name),
              o.pretty && o.width > 0)
            ) {
              (C = D.length), (F = a.attribs);
              for (O in F)
                !n.call(F, O) ||
                  ((l = F[O]),
                  (w = this.attribute(l, o, u)),
                  (f = w.length),
                  C + f > o.width
                    ? ((A = this.indent(a, o, u + 1) + w),
                      (D += this.endline(a, o, u) + A),
                      (C = A.length))
                    : ((A = " " + w), (D += A), (C += A.length)));
            } else {
              m = a.attribs;
              for (O in m)
                !n.call(m, O) || ((l = m[O]), (D += this.attribute(l, o, u)));
            }
            if (
              (this.stream.write(D),
              (c = a.children.length),
              (d = c === 0 ? null : a.children[0]),
              c === 0 ||
                a.children.every(function (p) {
                  return (
                    (p.type === e.Text ||
                      p.type === e.Raw ||
                      p.type === e.CData) &&
                    p.value === ""
                  );
                }))
            )
              o.allowEmpty
                ? (this.stream.write(">"),
                  (o.state = t.CloseTag),
                  this.stream.write("</" + a.name + ">"))
                : ((o.state = t.CloseTag),
                  this.stream.write(o.spaceBeforeSlash + "/>"));
            else if (
              o.pretty &&
              c === 1 &&
              (d.type === e.Text || d.type === e.Raw || d.type === e.CData) &&
              d.value != null
            )
              this.stream.write(">"),
                (o.state = t.InsideTag),
                o.suppressPrettyCount++,
                (L = !0),
                this.writeChildNode(d, o, u + 1),
                o.suppressPrettyCount--,
                (L = !1),
                (o.state = t.CloseTag),
                this.stream.write("</" + a.name + ">");
            else {
              for (
                this.stream.write(">" + this.endline(a, o, u)),
                  o.state = t.InsideTag,
                  x = a.children,
                  g = 0,
                  S = x.length;
                g < S;
                g++
              )
                (h = x[g]), this.writeChildNode(h, o, u + 1);
              (o.state = t.CloseTag),
                this.stream.write(this.indent(a, o, u) + "</" + a.name + ">");
            }
            return (
              this.stream.write(this.endline(a, o, u)),
              (o.state = t.None),
              this.closeNode(a, o, u)
            );
          }
          processingInstruction(a, o, u) {
            return this.stream.write(super.processingInstruction(a, o, u));
          }
          raw(a, o, u) {
            return this.stream.write(super.raw(a, o, u));
          }
          text(a, o, u) {
            return this.stream.write(super.text(a, o, u));
          }
          dtdAttList(a, o, u) {
            return this.stream.write(super.dtdAttList(a, o, u));
          }
          dtdElement(a, o, u) {
            return this.stream.write(super.dtdElement(a, o, u));
          }
          dtdEntity(a, o, u) {
            return this.stream.write(super.dtdEntity(a, o, u));
          }
          dtdNotation(a, o, u) {
            return this.stream.write(super.dtdNotation(a, o, u));
          }
        });
  }.call(rM));
});
var aM = y((sM, $i) => {
  (function () {
    var e, t, r, i, n, s, a, o, u;
    ({ assign: o, isFunction: u } = Sr()),
      (r = gv()),
      (i = bv()),
      (n = tM()),
      (a = Ic()),
      (s = nM()),
      (e = Ae()),
      (t = pu()),
      ($i.exports.create = function (l, f, h, c) {
        var d, g;
        if (l == null) throw new Error("Root element needs a name.");
        return (
          (c = o({}, f, h, c)),
          (d = new i(c)),
          (g = d.element(l)),
          c.headless ||
            (d.declaration(c),
            (c.pubID != null || c.sysID != null) && d.dtd(c)),
          g
        );
      }),
      ($i.exports.begin = function (l, f, h) {
        return (
          u(l) && (([f, h] = [l, f]), (l = {})), f ? new n(l, f, h) : new i(l)
        );
      }),
      ($i.exports.stringWriter = function (l) {
        return new a(l);
      }),
      ($i.exports.streamWriter = function (l, f) {
        return new s(l, f);
      }),
      ($i.exports.implementation = new r()),
      ($i.exports.nodeType = e),
      ($i.exports.writerState = t);
  }.call(sM));
});
var fM = y((lM) => {
  var oM = zN(),
    qV = aM();
  lM.build = kV;
  function PV(e) {
    function t(r) {
      return r < 10 ? "0" + r : r;
    }
    return (
      e.getUTCFullYear() +
      "-" +
      t(e.getUTCMonth() + 1) +
      "-" +
      t(e.getUTCDate()) +
      "T" +
      t(e.getUTCHours()) +
      ":" +
      t(e.getUTCMinutes()) +
      ":" +
      t(e.getUTCSeconds()) +
      "Z"
    );
  }
  var BV = Object.prototype.toString;
  function uM(e) {
    var t = BV.call(e).match(/\[object (.*)\]/);
    return t && t[1];
  }
  function kV(e, t) {
    var r = { version: "1.0", encoding: "UTF-8" },
      i = {
        pubid: "-//Apple//DTD PLIST 1.0//EN",
        sysid: "http://www.apple.com/DTDs/PropertyList-1.0.dtd",
      },
      n = qV.create("plist");
    return (
      n.dec(r.version, r.encoding, r.standalone),
      n.dtd(i.pubid, i.sysid),
      n.att("version", "1.0"),
      Ev(e, n),
      t || (t = {}),
      (t.pretty = t.pretty !== !1),
      n.end(t)
    );
  }
  function Ev(e, t) {
    var r,
      i,
      n,
      s = uM(e);
    if (s != "Undefined")
      if (Array.isArray(e))
        for (t = t.ele("array"), i = 0; i < e.length; i++) Ev(e[i], t);
      else if (Buffer.isBuffer(e)) t.ele("data").raw(e.toString("base64"));
      else if (s == "Object") {
        t = t.ele("dict");
        for (n in e) e.hasOwnProperty(n) && (t.ele("key").txt(n), Ev(e[n], t));
      } else
        s == "Number"
          ? ((r = e % 1 === 0 ? "integer" : "real"), t.ele(r).txt(e.toString()))
          : s == "Date"
          ? t.ele("date").txt(PV(new Date(e)))
          : s == "Boolean"
          ? t.ele(e ? "true" : "false")
          : s == "String"
          ? t.ele("string").txt(e)
          : s == "ArrayBuffer"
          ? t.ele("data").raw(oM.fromByteArray(e))
          : e && e.buffer && uM(e.buffer) == "ArrayBuffer"
          ? t.ele("data").raw(oM.fromByteArray(new Uint8Array(e.buffer), t))
          : s === "Null" && t.ele("null").txt("");
  }
});
var dM = y((_v) => {
  var hM = kN();
  Object.keys(hM).forEach(function (e) {
    _v[e] = hM[e];
  });
  var cM = fM();
  Object.keys(cM).forEach(function (e) {
    _v[e] = cM[e];
  });
});
var wM = y((lre, vM) => {
  vM.exports = yM;
  yM.sync = UV;
  var mM = require("fs");
  function jV(e, t) {
    var r = t.pathExt !== void 0 ? t.pathExt : process.env.PATHEXT;
    if (!r || ((r = r.split(";")), r.indexOf("") !== -1)) return !0;
    for (var i = 0; i < r.length; i++) {
      var n = r[i].toLowerCase();
      if (n && e.substr(-n.length).toLowerCase() === n) return !0;
    }
    return !1;
  }
  function gM(e, t, r) {
    return !e.isSymbolicLink() && !e.isFile() ? !1 : jV(t, r);
  }
  function yM(e, t, r) {
    mM.stat(e, function (i, n) {
      r(i, i ? !1 : gM(n, e, t));
    });
  }
  function UV(e, t) {
    return gM(mM.statSync(e), e, t);
  }
});
var SM = y((fre, _M) => {
  _M.exports = bM;
  bM.sync = zV;
  var DM = require("fs");
  function bM(e, t, r) {
    DM.stat(e, function (i, n) {
      r(i, i ? !1 : EM(n, t));
    });
  }
  function zV(e, t) {
    return EM(DM.statSync(e), t);
  }
  function EM(e, t) {
    return e.isFile() && $V(e, t);
  }
  function $V(e, t) {
    var r = e.mode,
      i = e.uid,
      n = e.gid,
      s = t.uid !== void 0 ? t.uid : process.getuid && process.getuid(),
      a = t.gid !== void 0 ? t.gid : process.getgid && process.getgid(),
      o = parseInt("100", 8),
      u = parseInt("010", 8),
      l = parseInt("001", 8),
      f = o | u,
      h =
        r & l || (r & u && n === a) || (r & o && i === s) || (r & f && s === 0);
    return h;
  }
});
var CM = y((cre, xM) => {
  var hre = require("fs"),
    Mc;
  process.platform === "win32" || global.TESTING_WINDOWS
    ? (Mc = wM())
    : (Mc = SM());
  xM.exports = xv;
  xv.sync = WV;
  function xv(e, t, r) {
    if ((typeof t == "function" && ((r = t), (t = {})), !r)) {
      if (typeof Promise != "function")
        throw new TypeError("callback not provided");
      return new Promise(function (i, n) {
        xv(e, t || {}, function (s, a) {
          s ? n(s) : i(a);
        });
      });
    }
    Mc(e, t || {}, function (i, n) {
      i &&
        (i.code === "EACCES" || (t && t.ignoreErrors)) &&
        ((i = null), (n = !1)),
        r(i, n);
    });
  }
  function WV(e, t) {
    try {
      return Mc.sync(e, t || {});
    } catch (r) {
      if ((t && t.ignoreErrors) || r.code === "EACCES") return !1;
      throw r;
    }
  }
});
var Cv = y((dre, NM) => {
  var ya =
      process.platform === "win32" ||
      process.env.OSTYPE === "cygwin" ||
      process.env.OSTYPE === "msys",
    OM = require("path"),
    GV = ya ? ";" : ":",
    TM = CM(),
    FM = (e) => Object.assign(new Error(`not found: ${e}`), { code: "ENOENT" }),
    RM = (e, t) => {
      let r = t.colon || GV,
        i =
          e.match(/\//) || (ya && e.match(/\\/))
            ? [""]
            : [
                ...(ya ? [process.cwd()] : []),
                ...(t.path || process.env.PATH || "").split(r),
              ],
        n = ya ? t.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "",
        s = ya ? n.split(r) : [""];
      return (
        ya && e.indexOf(".") !== -1 && s[0] !== "" && s.unshift(""),
        { pathEnv: i, pathExt: s, pathExtExe: n }
      );
    },
    AM = (e, t, r) => {
      typeof t == "function" && ((r = t), (t = {})), t || (t = {});
      let { pathEnv: i, pathExt: n, pathExtExe: s } = RM(e, t),
        a = [],
        o = (l) =>
          new Promise((f, h) => {
            if (l === i.length) return t.all && a.length ? f(a) : h(FM(e));
            let c = i[l],
              d = /^".*"$/.test(c) ? c.slice(1, -1) : c,
              g = OM.join(d, e),
              C = !d && /^\.[\\\/]/.test(e) ? e.slice(0, 2) + g : g;
            f(u(C, l, 0));
          }),
        u = (l, f, h) =>
          new Promise((c, d) => {
            if (h === n.length) return c(o(f + 1));
            let g = n[h];
            TM(l + g, { pathExt: s }, (C, S) => {
              if (!C && S)
                if (t.all) a.push(l + g);
                else return c(l + g);
              return c(u(l, f, h + 1));
            });
          });
      return r ? o(0).then((l) => r(null, l), r) : o(0);
    },
    HV = (e, t) => {
      t = t || {};
      let { pathEnv: r, pathExt: i, pathExtExe: n } = RM(e, t),
        s = [];
      for (let a = 0; a < r.length; a++) {
        let o = r[a],
          u = /^".*"$/.test(o) ? o.slice(1, -1) : o,
          l = OM.join(u, e),
          f = !u && /^\.[\\\/]/.test(e) ? e.slice(0, 2) + l : l;
        for (let h = 0; h < i.length; h++) {
          let c = f + i[h];
          try {
            if (TM.sync(c, { pathExt: n }))
              if (t.all) s.push(c);
              else return c;
          } catch {}
        }
      }
      if (t.all && s.length) return s;
      if (t.nothrow) return null;
      throw FM(e);
    };
  NM.exports = AM;
  AM.sync = HV;
});
var MM = y((pre, Ov) => {
  "use strict";
  var IM = (e = {}) => {
    let t = e.env || process.env;
    return (e.platform || process.platform) !== "win32"
      ? "PATH"
      : Object.keys(t)
          .reverse()
          .find((i) => i.toUpperCase() === "PATH") || "Path";
  };
  Ov.exports = IM;
  Ov.exports.default = IM;
});
var BM = y((mre, PM) => {
  "use strict";
  var LM = require("path"),
    YV = Cv(),
    VV = MM();
  function qM(e, t) {
    let r = e.options.env || process.env,
      i = process.cwd(),
      n = e.options.cwd != null,
      s = n && process.chdir !== void 0 && !process.chdir.disabled;
    if (s)
      try {
        process.chdir(e.options.cwd);
      } catch {}
    let a;
    try {
      a = YV.sync(e.command, {
        path: r[VV({ env: r })],
        pathExt: t ? LM.delimiter : void 0,
      });
    } catch {
    } finally {
      s && process.chdir(i);
    }
    return a && (a = LM.resolve(n ? e.options.cwd : "", a)), a;
  }
  function XV(e) {
    return qM(e) || qM(e, !0);
  }
  PM.exports = XV;
});
var kM = y((gre, Fv) => {
  "use strict";
  var Tv = /([()\][%!^"`<>&|;, *?])/g;
  function ZV(e) {
    return (e = e.replace(Tv, "^$1")), e;
  }
  function KV(e, t) {
    return (
      (e = `${e}`),
      (e = e.replace(/(\\*)"/g, '$1$1\\"')),
      (e = e.replace(/(\\*)$/, "$1$1")),
      (e = `"${e}"`),
      (e = e.replace(Tv, "^$1")),
      t && (e = e.replace(Tv, "^$1")),
      e
    );
  }
  Fv.exports.command = ZV;
  Fv.exports.argument = KV;
});
var UM = y((yre, jM) => {
  "use strict";
  jM.exports = /^#!(.*)/;
});
var $M = y((vre, zM) => {
  "use strict";
  var QV = UM();
  zM.exports = (e = "") => {
    let t = e.match(QV);
    if (!t) return null;
    let [r, i] = t[0].replace(/#! ?/, "").split(" "),
      n = r.split("/").pop();
    return n === "env" ? i : i ? `${n} ${i}` : n;
  };
});
var GM = y((wre, WM) => {
  "use strict";
  var Rv = require("fs"),
    JV = $M();
  function eX(e) {
    let r = Buffer.alloc(150),
      i;
    try {
      (i = Rv.openSync(e, "r")), Rv.readSync(i, r, 0, 150, 0), Rv.closeSync(i);
    } catch {}
    return JV(r.toString());
  }
  WM.exports = eX;
});
var XM = y((Dre, VM) => {
  "use strict";
  var tX = require("path"),
    HM = BM(),
    YM = kM(),
    rX = GM(),
    iX = process.platform === "win32",
    nX = /\.(?:com|exe)$/i,
    sX = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
  function aX(e) {
    e.file = HM(e);
    let t = e.file && rX(e.file);
    return t ? (e.args.unshift(e.file), (e.command = t), HM(e)) : e.file;
  }
  function oX(e) {
    if (!iX) return e;
    let t = aX(e),
      r = !nX.test(t);
    if (e.options.forceShell || r) {
      let i = sX.test(t);
      (e.command = tX.normalize(e.command)),
        (e.command = YM.command(e.command)),
        (e.args = e.args.map((s) => YM.argument(s, i)));
      let n = [e.command].concat(e.args).join(" ");
      (e.args = ["/d", "/s", "/c", `"${n}"`]),
        (e.command = process.env.comspec || "cmd.exe"),
        (e.options.windowsVerbatimArguments = !0);
    }
    return e;
  }
  function uX(e, t, r) {
    t && !Array.isArray(t) && ((r = t), (t = null)),
      (t = t ? t.slice(0) : []),
      (r = Object.assign({}, r));
    let i = {
      command: e,
      args: t,
      options: r,
      file: void 0,
      original: { command: e, args: t },
    };
    return r.shell ? i : oX(i);
  }
  VM.exports = uX;
});
var QM = y((bre, KM) => {
  "use strict";
  var Av = process.platform === "win32";
  function Nv(e, t) {
    return Object.assign(new Error(`${t} ${e.command} ENOENT`), {
      code: "ENOENT",
      errno: "ENOENT",
      syscall: `${t} ${e.command}`,
      path: e.command,
      spawnargs: e.args,
    });
  }
  function lX(e, t) {
    if (!Av) return;
    let r = e.emit;
    e.emit = function (i, n) {
      if (i === "exit") {
        let s = ZM(n, t, "spawn");
        if (s) return r.call(e, "error", s);
      }
      return r.apply(e, arguments);
    };
  }
  function ZM(e, t) {
    return Av && e === 1 && !t.file ? Nv(t.original, "spawn") : null;
  }
  function fX(e, t) {
    return Av && e === 1 && !t.file ? Nv(t.original, "spawnSync") : null;
  }
  KM.exports = {
    hookChildProcess: lX,
    verifyENOENT: ZM,
    verifyENOENTSync: fX,
    notFoundError: Nv,
  };
});
var tL = y((Ere, va) => {
  "use strict";
  var JM = require("child_process"),
    Iv = XM(),
    Mv = QM();
  function eL(e, t, r) {
    let i = Iv(e, t, r),
      n = JM.spawn(i.command, i.args, i.options);
    return Mv.hookChildProcess(n, i), n;
  }
  function hX(e, t, r) {
    let i = Iv(e, t, r),
      n = JM.spawnSync(i.command, i.args, i.options);
    return (n.error = n.error || Mv.verifyENOENTSync(n.status, i)), n;
  }
  va.exports = eL;
  va.exports.spawn = eL;
  va.exports.sync = hX;
  va.exports._parse = Iv;
  va.exports._enoent = Mv;
});
var Lv = y((Et) => {
  "use strict";
  var cX =
    (Et && Et.__importDefault) ||
    function (e) {
      return e && e.__esModule ? e : { default: e };
    };
  Object.defineProperty(Et, "__esModule", { value: !0 });
  Et.spawn =
    Et.ExitSignalError =
    Et.ExitCodeError =
    Et.ExitError =
    Et.CrossSpawnError =
      void 0;
  var dX = cX(tL());
  function Bc(e, t) {
    return t && Array.isArray(t) && t.length > 0 ? `${e} ${t.join(" ")}` : e;
  }
  var Lc = class extends Error {
    constructor(t, r, i, n) {
      let s = Bc(t, r),
        a = i.message || i;
      super(
        `Error executing command (${s}):
${a}
${n}`.trim(),
      ),
        (this.originalError = i);
    }
  };
  Et.CrossSpawnError = Lc;
  var gu = class extends Error {
    constructor(t, r, i, n, s) {
      super(i),
        (this.cmd = t),
        (this.args = r),
        (this.stdout = n),
        (this.stderr = s);
    }
  };
  Et.ExitError = gu;
  var qc = class extends gu {
    constructor(t, r, i, n, s) {
      let a = Bc(t, r);
      super(
        t,
        r,
        `Command failed with a non-zero return code (${i}):
${a}
${n}
${s}`.trim(),
        n,
        s,
      ),
        (this.code = i);
    }
  };
  Et.ExitCodeError = qc;
  var Pc = class extends gu {
    constructor(t, r, i, n, s) {
      let a = Bc(t, r);
      super(
        t,
        r,
        `Command terminated via a signal (${i}):
${a}
${n}
${s}`.trim(),
        n,
        s,
      ),
        (this.signal = i);
    }
  };
  Et.ExitSignalError = Pc;
  async function pX(e, t, r) {
    r || (r = {});
    let { logger: i, updateErrorCallback: n, ...s } = r;
    return (
      i && i(`Executing command ${Bc(e, t)}`),
      new Promise((a, o) => {
        let u = "",
          l = "",
          f = dX.default(e, t, s);
        f.stdout &&
          f.stdout.on("data", (h) => {
            u += h.toString();
          }),
          f.stderr &&
            f.stderr.on("data", (h) => {
              l += h.toString();
            }),
          f.on("close", (h, c) => {
            h === 0
              ? a(u)
              : o(h === null ? new Pc(e, t, c, u, l) : new qc(e, t, h, u, l));
          }),
          f.on("error", (h) => {
            n && n(h, !!i), o(new Lc(e, t, h, l));
          });
      })
    );
  }
  Et.spawn = pX;
});
var nL = y((Sre, iL) => {
  "use strict";
  var rL = require("fs"),
    qv;
  function mX() {
    try {
      return rL.statSync("/.dockerenv"), !0;
    } catch {
      return !1;
    }
  }
  function gX() {
    try {
      return rL.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
    } catch {
      return !1;
    }
  }
  iL.exports = () => (qv === void 0 && (qv = mX() || gX()), qv);
});
var Bv = y((xre, Pv) => {
  "use strict";
  var yX = require("os"),
    vX = require("fs"),
    sL = nL(),
    aL = () => {
      if (process.platform !== "linux") return !1;
      if (yX.release().toLowerCase().includes("microsoft")) return !sL();
      try {
        return vX
          .readFileSync("/proc/version", "utf8")
          .toLowerCase()
          .includes("microsoft")
          ? !sL()
          : !1;
      } catch {
        return !1;
      }
    };
  process.env.__IS_WSL_TEST__ ? (Pv.exports = aL) : (Pv.exports = aL());
});
var jc = y((Pe) => {
  "use strict";
  var wX =
      (Pe && Pe.__createBinding) ||
      (Object.create
        ? function (e, t, r, i) {
            i === void 0 && (i = r),
              Object.defineProperty(e, i, {
                enumerable: !0,
                get: function () {
                  return t[r];
                },
              });
          }
        : function (e, t, r, i) {
            i === void 0 && (i = r), (e[i] = t[r]);
          }),
    DX =
      (Pe && Pe.__setModuleDefault) ||
      (Object.create
        ? function (e, t) {
            Object.defineProperty(e, "default", { enumerable: !0, value: t });
          }
        : function (e, t) {
            e.default = t;
          }),
    uL =
      (Pe && Pe.__importStar) ||
      function (e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (e != null)
          for (var r in e)
            r !== "default" &&
              Object.prototype.hasOwnProperty.call(e, r) &&
              wX(t, e, r);
        return DX(t, e), t;
      },
    lL =
      (Pe && Pe.__importDefault) ||
      function (e) {
        return e && e.__esModule ? e : { default: e };
      };
  Object.defineProperty(Pe, "__esModule", { value: !0 });
  Pe.spawnWrapperFromFunction =
    Pe.spawnWrapper =
    Pe.wrapperCommandExists =
    Pe.WrapperError =
    Pe.canRunWindowsExeNatively =
      void 0;
  var oL = Lv(),
    bX = uL(require("fs")),
    EX = lL(Bv()),
    _X = uL(require("path")),
    SX = lL(Cv());
  function fL() {
    return process.platform === "win32" || EX.default;
  }
  Pe.canRunWindowsExeNatively = fL;
  var kc = class extends Error {
    constructor(t, r) {
      let i = `Wrapper command '${t}' not found on the system.${
        r ? " " + r : ""
      }`;
      super(i);
    }
  };
  Pe.WrapperError = kc;
  async function hL(e) {
    if (_X.isAbsolute(e)) return bX.existsSync(e);
    try {
      return await SX.default(e), !0;
    } catch {
      return !1;
    }
  }
  Pe.wrapperCommandExists = hL;
  async function cL(e, t, r) {
    r ?? (r = {});
    let { wrapperCommand: i, wrapperInstructions: n, ...s } = r;
    if (i) {
      if (!(await hL(i))) throw new kc(i, n);
      let a = t ? [e, ...t] : [e];
      return oL.spawn(i, a, s);
    }
    return oL.spawn(e, t, s);
  }
  Pe.spawnWrapper = cL;
  async function xX(e, t, r, i) {
    let n = i;
    if (!fL()) {
      let s = e(i?.wrapperCommand);
      n = i ? { ...i, wrapperCommand: s } : { wrapperCommand: s };
    }
    return cL(t, r, n);
  }
  Pe.spawnWrapperFromFunction = xX;
});
var kv = y((Uc) => {
  "use strict";
  Object.defineProperty(Uc, "__esModule", { value: !0 });
  Uc.is64BitArch = void 0;
  var CX = ["arm64", "x64"];
  function OX(e) {
    return CX.includes(e);
  }
  Uc.is64BitArch = OX;
});
var pL = y((Wi) => {
  "use strict";
  var TX =
    (Wi && Wi.__importDefault) ||
    function (e) {
      return e && e.__esModule ? e : { default: e };
    };
  Object.defineProperty(Wi, "__esModule", { value: !0 });
  Wi.normalizePath = Wi.convertUNIXPathToWindows = void 0;
  var FX = TX(Bv()),
    RX = Lv();
  function AX(e) {
    e.code === "ENOENT" &&
      e.syscall === "spawn wslpath" &&
      (e.message =
        "Could not find 'wslpath' in any of the directories listed in the PATH environment variable, which is needed to convert WSL paths to Windows-style paths.");
  }
  async function dL(e) {
    return (
      await RX.spawn("wslpath", ["-w", e], { updateErrorCallback: AX })
    ).trim();
  }
  Wi.convertUNIXPathToWindows = dL;
  async function NX(e) {
    return FX.default ? dL(e) : e;
  }
  Wi.normalizePath = NX;
});
var yL = y((Gi) => {
  "use strict";
  Object.defineProperty(Gi, "__esModule", { value: !0 });
  Gi.spawnDotNet =
    Gi.determineDotNetWrapper =
    Gi.dotNetDependencyInstallInstructions =
      void 0;
  var IX = jc();
  function mL() {
    switch (process.platform) {
      case "win32":
        return "No wrapper necessary";
      case "darwin":
        return "Run `brew install mono` to install Mono on macOS via Homebrew.";
      case "linux":
        return "Consult your Linux distribution's package manager to determine how to install Mono.";
      default:
        return "Consult your operating system's package manager to determine how to install Mono.";
    }
  }
  Gi.dotNetDependencyInstallInstructions = mL;
  function gL(e) {
    return e || (process.env.MONO_BINARY ? process.env.MONO_BINARY : "mono");
  }
  Gi.determineDotNetWrapper = gL;
  async function MX(e, t, r) {
    var i;
    return (
      r ?? (r = {}),
      ((i = r.wrapperInstructions) !== null && i !== void 0) ||
        (r.wrapperInstructions = mL()),
      IX.spawnWrapperFromFunction(gL, e, t, r)
    );
  }
  Gi.spawnDotNet = MX;
});
var DL = y((Hi) => {
  "use strict";
  Object.defineProperty(Hi, "__esModule", { value: !0 });
  Hi.spawnExe =
    Hi.determineWineWrapper =
    Hi.exeDependencyInstallInstructions =
      void 0;
  var LX = jc(),
    qX = kv();
  function vL() {
    switch (process.platform) {
      case "win32":
        return "No wrapper necessary";
      case "darwin":
        return "Run `brew install --cask wine-stable` to install 64-bit wine on macOS via Homebrew.";
      case "linux":
        return "Consult your Linux distribution's package manager to determine how to install Wine.";
      default:
        return "Consult your operating system's package manager to determine how to install Wine.";
    }
  }
  Hi.exeDependencyInstallInstructions = vL;
  function wL(e) {
    return (
      e ||
      (process.env.WINE_BINARY
        ? process.env.WINE_BINARY
        : qX.is64BitArch(process.arch)
        ? "wine64"
        : "wine")
    );
  }
  Hi.determineWineWrapper = wL;
  async function PX(e, t, r) {
    var i;
    return (
      r ?? (r = {}),
      ((i = r.wrapperInstructions) !== null && i !== void 0) ||
        (r.wrapperInstructions = vL()),
      LX.spawnWrapperFromFunction(wL, e, t, r)
    );
  }
  Hi.spawnExe = PX;
});
var _L = y((Re) => {
  "use strict";
  Object.defineProperty(Re, "__esModule", { value: !0 });
  Re.spawnExe =
    Re.exeDependencyInstallInstructions =
    Re.spawnDotNet =
    Re.dotNetDependencyInstallInstructions =
    Re.normalizePath =
    Re.is64BitArch =
    Re.WrapperError =
    Re.spawnWrapperFromFunction =
    Re.spawn =
    Re.canRunWindowsExeNatively =
      void 0;
  var zc = jc();
  Object.defineProperty(Re, "canRunWindowsExeNatively", {
    enumerable: !0,
    get: function () {
      return zc.canRunWindowsExeNatively;
    },
  });
  Object.defineProperty(Re, "spawn", {
    enumerable: !0,
    get: function () {
      return zc.spawnWrapper;
    },
  });
  Object.defineProperty(Re, "spawnWrapperFromFunction", {
    enumerable: !0,
    get: function () {
      return zc.spawnWrapperFromFunction;
    },
  });
  Object.defineProperty(Re, "WrapperError", {
    enumerable: !0,
    get: function () {
      return zc.WrapperError;
    },
  });
  var BX = kv();
  Object.defineProperty(Re, "is64BitArch", {
    enumerable: !0,
    get: function () {
      return BX.is64BitArch;
    },
  });
  var kX = pL();
  Object.defineProperty(Re, "normalizePath", {
    enumerable: !0,
    get: function () {
      return kX.normalizePath;
    },
  });
  var bL = yL();
  Object.defineProperty(Re, "dotNetDependencyInstallInstructions", {
    enumerable: !0,
    get: function () {
      return bL.dotNetDependencyInstallInstructions;
    },
  });
  Object.defineProperty(Re, "spawnDotNet", {
    enumerable: !0,
    get: function () {
      return bL.spawnDotNet;
    },
  });
  var EL = DL();
  Object.defineProperty(Re, "exeDependencyInstallInstructions", {
    enumerable: !0,
    get: function () {
      return EL.exeDependencyInstallInstructions;
    },
  });
  Object.defineProperty(Re, "spawnExe", {
    enumerable: !0,
    get: function () {
      return EL.spawnExe;
    },
  });
});
var xL = y((Nre, SL) => {
  var { canRunWindowsExeNatively: jX, is64BitArch: UX, spawnExe: zX } = _L(),
    $X = require("path"),
    WX = ["version-string"],
    GX = [
      "file-version",
      "product-version",
      "icon",
      "requested-execution-level",
    ],
    HX = ["application-manifest"];
  SL.exports = async (e, t) => {
    let r = UX(process.arch) ? "rcedit-x64.exe" : "rcedit.exe",
      i = $X.resolve(__dirname, "..", "bin", r),
      n = [e];
    for (let a of WX)
      if (t[a])
        for (let [o, u] of Object.entries(t[a])) n.push(`--set-${a}`, o, u);
    for (let a of GX) t[a] && n.push(`--set-${a}`, t[a]);
    for (let a of HX) t[a] && n.push(`--${a}`, t[a]);
    let s = { env: { ...process.env } };
    jX() || (s.env.WINEDEBUG = "-all"), await zX(i, n, s);
  };
});
var VX = {};
R3(VX, { nwbuild: () => YX });
module.exports = A3(VX);
var wa = require("node:process"),
  Da = require("node:fs/promises");
var Qp = ht(require("node:path"), 1),
  e_ = ht(hD(), 1),
  t_ = ht(JE(), 1),
  r_ = (e, t) =>
    new Promise((r, i) => {
      e === "linux"
        ? t_.default
            .x({ file: `${t}/nw.tar.gz`, C: `${t}` })
            .then(() => {
              r(0);
            })
            .catch(() => {
              i(1);
            })
        : (0, e_.default)(Qp.default.resolve(`${t}/nw.zip`), {
            dir: Qp.default.resolve(`${t}`),
          })
            .then(() => {
              r(0);
            })
            .catch(() => {
              i(1);
            });
    });
var fm = ht(require("node:fs"), 1),
  j_ = ht(require("node:https"), 1),
  hm = ht(k_(), 1),
  of = new hm.default.SingleBar({}, hm.default.Presets.rect),
  U_ = (e, t, r, i, n, s) =>
    new Promise((a, o) => {
      n !== "https://dl.nwjs.io" &&
        (console.log("Invalid download url. Please try again."), o(1));
      let u = `${n}/v${e}/nwjs${t === "sdk" ? "-sdk" : ""}-v${e}-${r}-${i}.${
        r === "linux" ? "tar.gz" : "zip"
      }`;
      j_.default.get(u, (l) => {
        let f = 0;
        of.start(Number(l.headers["content-length"]), 0),
          l.on("data", (c) => {
            (f += c.length), of.increment(), of.update(f);
          }),
          l.on("error", (c) => {
            console.log(c), o(1);
          }),
          l.on("end", () => {
            of.stop(), a(0);
          }),
          fm.default.mkdirSync(s, { recursive: !0 });
        let h = fm.default.createWriteStream(
          `${s}/nw.${r === "linux" ? "tar.gz" : "zip"}`,
        );
        l.pipe(h);
      });
    });
var Ls = require("node:fs/promises");
var Sn = ht(FC(), 1),
  { combine: z7, timestamp: $7, printf: W7 } = Sn.format,
  G7 = W7(
    ({ level: e, message: t, timestamp: r }) =>
      `[ ${e.toUpperCase()} ] ${r} ${t}`,
  ),
  me = (0, Sn.createLogger)({
    format: z7($7(), G7),
    transports: [new Sn.transports.Console({ level: "info" })],
  });
process.env.NODE_ENV !== "production" &&
  me.add(new Sn.transports.Console({ level: "debug" }));
var RC = require("node:https");
var AC = (e) => {
  let t;
  return new Promise((r, i) => {
    (0, RC.get)(e, (n) => {
      n.on("data", (s) => {
        t += s;
      }),
        n.on("error", (s) => {
          me.error(s), i(void 0);
        }),
        n.on("end", () => {
          me.debug("Succesfully cached manifest metadata"), r(t);
        });
    });
  });
};
var NC = async (e, t, r) => {
  let i;
  try {
    await (0, Ls.access)(`${t}/manifest.json`),
      me.debug(`Manifest file already exists locally under ${t}`);
  } catch {
    me.debug("Manifest file does not exist locally"),
      me.debug(`Downloading latest manifest file under ${t}`);
    let s = await AC(r);
    await (0, Ls.writeFile)(`${t}/manifest.json`, s.slice(9));
  } finally {
    me.debug("Store manifest metadata in memory");
    let n = await (0, Ls.readFile)(`${t}/manifest.json`);
    me.debug("Convert manifest data into JSON");
    let s = JSON.parse(n);
    me.debug(`Search for ${e} specific release data`),
      (e === "latest" || e === "lts") && (e = n[e].slice(1)),
      (i = s.versions.find((a) => a.version === `v${e}`));
  }
  return i;
};
var IC = ht(require("node:fs"), 1),
  MC = (e, t) =>
    new Promise((r, i) => {
      IC.default.rm(`${t}/nw.${e === "linux" ? "tar.gz" : "zip"}`, (n) => {
        n && i(1);
      }),
        r(0);
    });
var jn = require("node:fs/promises");
var QA = ht(require("node:fs"), 1),
  JA = ht(KA(), 1);
var ev = (e, t = "zip") => {
  let r = QA.default.createWriteStream(`${e}.${t}`),
    i = (0, JA.default)("zip");
  return new Promise((n, s) => {
    r.on("close", () => {
      n(0);
    }),
      i.on("warning", (a) => {
        a.code === "ENOENT" ? me.debug(a) : s(a);
      }),
      i.on("error", (a) => {
        s(a);
      }),
      i.pipe(r),
      i.directory(e, !1),
      i.finalize();
  });
};
var hc = require("node:fs/promises");
var eN = async (e, t) => {
  let r = { Type: "Application", Name: e.name, Exec: e.name };
  await (0, hc.rename)(`${t}/nw`, `${t}/${e.name}`),
    typeof e.nwbuild?.linuxCfg == "object" &&
      Object.keys(e.nwbuild.linuxCfg).forEach((s) => {
        s !== "Type" && (r[s] = e.nwbuild.linuxCfg[s]);
      });
  let i = `[Desktop Entry]
`;
  Object.keys(r).forEach((s) => {
    (i += `${s}=${r[s]}
`),
      me.debug(`Add ${s}=${r[s]} to Desktop Entry File`);
  });
  let n = `${t}/${e.name}.desktop`;
  await (0, hc.writeFile)(n, i), me.debug("Desktop Entry file generated");
};
var ga = ht(require("node:fs/promises"), 1),
  mu = ht(require("node:path"), 1),
  Sv = ht(dM(), 1),
  pM = async (e, t) => {
    let r = mu.default.resolve(t, `${e.name}.app`);
    await ga.default.rename(mu.default.resolve(t, "nwjs.app"), r);
    let i = mu.default.resolve(r, "Contents/Info.plist"),
      n = Sv.default.parse(await ga.default.readFile(i, "utf-8"));
    n.CFBundleDisplayName = e.name;
    let s = Sv.default.build(n);
    await ga.default.writeFile(i, s);
    let a = mu.default.resolve(
        r,
        "Contents/Resources/en.lproj/InfoPlist.strings",
      ),
      u = (await ga.default.readFile(a, "utf-8")).replace(
        /CFBundleGetInfoString = "nwjs /,
        `CFBundleGetInfoString = "${e.name} `,
      );
    await ga.default.writeFile(a, u);
  };
var CL = require("node:fs/promises"),
  OL = ht(xL(), 1),
  TL = async (e, t) => {
    await (0, CL.rename)(`${t}/nw.exe`, `${t}/${e.name}.exe`),
      await (0, OL.default)(`${t}/${e.name}.exe`, {
        "file-version": e.version,
        "product-version": e.version,
        "icon": e.icon,
        "version-string": {
          FileDescription: e.description,
          LegalCopyright: e.copyright,
          ProductName: e.name,
          OriginalFilename: e.name,
        },
      });
  };
var FL = async (e, t, r, i, n, s) => {
  me.debug(`Remove any files at ${r} directory`),
    await (0, jn.rm)(r, { force: !0, recursive: !0 }),
    me.debug(`Copy ${t} files to ${r} directory`),
    await (0, jn.cp)(t, r, { recursive: !0 }),
    me.debug(`Copy ${e} files to ${r} directory`),
    await (0, jn.cp)(
      e,
      `${r}/${
        i !== "osx" ? "package.nw" : "nwjs.app/Contents/Resources/app.nw"
      }`,
      { recursive: !0 },
    ),
    me.debug("Get NW's package.json as a buffer");
  let a = await (0, jn.readFile)(
    `${r}/${
      i !== "osx" ? "package.nw" : "nwjs.app/Contents/Resources/app.nw"
    }/package.json`,
  );
  me.debug("Convert package.json buffer into JSON");
  let o = JSON.parse(a);
  switch ((me.debug(`Starting platform specific config steps for ${i}`), i)) {
    case "linux":
      eN(o, r);
      break;
    case "win":
      TL(o, r);
      break;
    case "osx":
      pM(o, r, s);
      break;
    default:
      break;
  }
  n === !0 ? await ev(r) : n === "zip" && (await ev(r, n));
};
var RL = ht(require("node:child_process"), 1),
  AL = (e, t) =>
    new Promise((r, i) => {
      let n = RL.default.spawn(t, [e]);
      n.on("close", () => {
        r(0);
      }),
        n.on("error", (s) => {
          console.log(s), i(1);
        });
    });
var jv = (e) => {
  switch (e) {
    case "linux":
      return "nw";
    case "osx":
      return "nwjs.app/Contents/MacOS/nwjs";
    case "win":
      return "nw.exe";
    default:
      return null;
  }
};
var NL = async (e, t, r) =>
  jv(r) === null
    ? (console.log("Unsupported platform."), 1)
    : (await AL(e, `${t}/${jv(r)}`), 0);
var $c = require("node:fs/promises"),
  IL = async (e) => {
    let t = !0;
    try {
      await (0, $c.access)(e, $c.constants.F_OK);
    } catch {
      t = !1;
    }
    return t;
  };
var ML = require("node:fs/promises"),
  LL = require("node:process"),
  qL = async (e) => {
    let t;
    try {
      t = await (0, ML.readFile)(`${e.srcDir}/package.json`);
    } catch {}
    return (
      typeof t?.nwbuild == "object" && (e = { ...t.nwbuild }),
      e.flavor !== void 0 && (e.flavour = e.flavor),
      (e.srcDir = e.srcDir ?? void 0),
      (e.version = e.version ?? void 0),
      (e.flavour = e.flavour ?? void 0),
      (e.platform = e.platform ?? void 0),
      (e.arch = e.arch ?? void 0),
      (e.outDir = e.outDir ?? void 0),
      (e.cacheDir = e.cacheDir ?? `${(0, LL.cwd)()}/cache`),
      (e.downloadUrl = e.downloadUrl ?? "https://dl.nwjs.io"),
      (e.manifestUrl = e.manifestUrl ?? "https://nwjs.io/versions"),
      (e.cache = e.cache ?? !0),
      (e.zip = e.zip ?? !1),
      e
    );
  };
var PL = async (e, t) => !!(e && t);
var BL = async (e) => {
  switch (process.arch) {
    case "ia32":
      return "ia32";
    case "x64":
      return "x64";
    default:
      me.error(`The arch ${e} is not supported`);
      return;
  }
};
var kL = async (e) => {
  switch (e) {
    case "darwin":
      return "osx";
    case "win32":
      return "win";
    case "linux":
      return "linux";
    default:
      me.error(`The platform ${e} is not supported`);
      return;
  }
};
var YX = async (e) => {
  let t = "",
    r = {},
    i = {};
  try {
    if (
      ((r = JSON.parse(await (0, Da.readFile)(`${e.srcDir}/package.json`))),
      r.name === void 0)
    )
      throw new Error(`name property is missing from ${e.srcDir}/package.json`);
    if (r.main === void 0)
      throw new Error(`main property is missing from ${e.srcDir}/package.json`);
    if (
      (typeof r.nwbuild == "object" && (e = { ...r.nwbuild }),
      typeof r.nwbuild > "u")
    )
      me.debug("nwbuild property is not defined in srcDir/package.json");
    else
      throw new Error(
        `nwbuild property in the ${
          e.srcDir
        }/package.json is of type ${typeof r.nwbuild}. Expected type object.`,
      );
    if (
      ((e = await qL(e)),
      await (0, Da.mkdir)(e.cacheDir, { recursive: !0 }),
      (i = await NC(e.version, e.cacheDir, e.manifestUrl)),
      (await PL(e, i)) === !1)
    )
      throw new Error("Some option was invalid.");
    if (e.mode === "run") {
      let a = await kL(wa.platform),
        o = await BL(wa.arch);
      if (a === void 0)
        throw new Error(`Platform ${wa.platform} is not supported. Sorry!`);
      if (o === void 0)
        throw new Error(`Architecture ${wa.arch} is not supported. Sorry!`);
      (e.platform = a), (e.arch = o);
    }
    t = `${e.cacheDir}/nwjs${e.flavour === "sdk" ? "-sdk" : ""}-v${e.version}-${
      e.platform
    }-${e.arch}`;
    let s = await IL(t);
    if (
      ((e?.noCache === !0 || s === !1) &&
        (await (0, Da.rm)(t, { force: !0, recursive: !0 }),
        await U_(
          e.version,
          e.flavour,
          e.platform,
          e.arch,
          e.downloadUrl,
          e.cacheDir,
        ),
        await r_(e.platform, e.cacheDir),
        await MC(e.platform, e.cacheDir)),
      e.mode !== "run" && e.mode !== "build")
    )
      throw new Error("Invalid mode value. Expected run or build.");
    e.mode === "run" && (await NL(e.srcDir, t, e.platform)),
      e.mode === "build" &&
        (await FL(e.srcDir, t, e.outDir, e.platform, e.zip, i));
  } catch (n) {
    return me.error(n), n;
  }
};
0 && (module.exports = { nwbuild });
