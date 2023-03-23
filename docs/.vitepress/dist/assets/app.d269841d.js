import {
  d as p,
  I as s,
  a1 as i,
  u,
  h as c,
  l,
  a2 as d,
  a3 as f,
  a4 as m,
  a5 as h,
  a6 as A,
  a7 as g,
  a8 as P,
  a9 as v,
  aa as y,
  ab as C,
  ac as w,
  ad as _,
  ae as b,
  af as E,
} from "./chunks/framework.cd9250a1.js";
import { t as R } from "./chunks/theme.dbe7d54b.js";
function r(e) {
  if (e.extends) {
    const a = r(e.extends);
    return {
      ...a,
      ...e,
      async enhanceApp(t) {
        a.enhanceApp && (await a.enhanceApp(t)),
          e.enhanceApp && (await e.enhanceApp(t));
      },
    };
  }
  return e;
}
const n = r(R),
  D = p({
    name: "VitePressApp",
    setup() {
      const { site: e } = u();
      return (
        c(() => {
          l(() => {
            (document.documentElement.lang = e.value.lang),
              (document.documentElement.dir = e.value.dir);
          });
        }),
        d(),
        f(),
        m(),
        n.setup && n.setup(),
        () => h(n.Layout)
      );
    },
  });
async function O() {
  const e = T(),
    a = S();
  a.provide(A, e);
  const t = g(e.route);
  return (
    a.provide(P, t),
    a.component("Content", v),
    a.component("ClientOnly", y),
    Object.defineProperties(a.config.globalProperties, {
      $frontmatter: {
        get() {
          return t.frontmatter.value;
        },
      },
      $params: {
        get() {
          return t.page.value.params;
        },
      },
    }),
    n.enhanceApp && (await n.enhanceApp({ app: a, router: e, siteData: C })),
    { app: a, router: e, data: t }
  );
}
function S() {
  return w(D);
}
function T() {
  let e = s,
    a;
  return _((t) => {
    let o = b(t);
    return (
      e && (a = o),
      (e || a === o) && (o = o.replace(/\.js$/, ".lean.js")),
      s && (e = !1),
      E(() => import(o), [])
    );
  }, n.NotFound);
}
s &&
  O().then(({ app: e, router: a, data: t }) => {
    a.go().then(() => {
      i(a.route, t.site), e.mount("#app");
    });
  });
export { O as createApp };
