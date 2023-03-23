import { _ as s, c as a, o as n, N as l } from "./chunks/framework.cd9250a1.js";
const u = JSON.parse(
    '{"title":"Basic Usage","description":"","frontmatter":{},"headers":[],"relativePath":"usage-basic.md"}',
  ),
  o = { name: "usage-basic.md" },
  e = l(
    `<h1 id="basic-usage" tabindex="-1">Basic Usage <a class="header-anchor" href="#basic-usage" aria-label="Permalink to &quot;Basic Usage&quot;">​</a></h1><p>Depending on your needs, <code>nw-builder</code> can be used via a JavaScript module, via command line interface or via <code>package.json</code>. Please note that if <code>package.json</code> is used, it will override the module or CLI configuration. A single function is exported which performs a single build using a specific <a href="https://nwjs.readthedocs.io/en/latest/For%20Users/Advanced/Build%20Flavors/" target="_blank" rel="noreferrer">build flavor</a> for a specific platform and architecture.</p><p>ESM usage:</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> nwbuild </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">nw-builder</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><p>CJS usage:</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">let</span><span style="color:#A6ACCD;"> nwbuild </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">undefined;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">try</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">nwbuild</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">import</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">nw-builder</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">catch</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">error</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">error</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">error</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div>`,
    6,
  ),
  p = [e];
function t(c, r, i, F, y, D) {
  return n(), a("div", null, p);
}
const C = s(o, [["render", t]]);
export { u as __pageData, C as default };
