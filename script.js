(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var aa = this || self;
async function ba(a) {
  console.log("sleep", a);
  return new Promise(b => setTimeout(b, a));
}
function ca(a) {
  if (!Array.isArray(a)) {
    return a;
  }
  const b = [];
  a.forEach(c => {
    Array.isArray(c) ? b.push(...ca(c)) : b.push(c);
  });
  return b;
}
;const da = new Map(), fa = da.delete.bind(da), ha = new Map(), ia = new BroadcastChannel("ib");
ia.onmessage = a => {
  a = a.data;
  a.m === 1 && (da.get(a.n)?.close(), fa(a.n));
};
da.delete = a => {
  ia.postMessage({m:1, n:a});
  return fa(a);
};
async function ja(a, b) {
  var c = da.get(a);
  if (c && !b) {
    return c;
  }
  if ((c = ha.get(a)) && !b) {
    return c;
  }
  let d;
  b && (c = await ja(a), d = c.version + 1, c.close(), da.delete(a));
  c = new Promise((e, g) => {
    let h = !1, k = !1;
    setTimeout(() => {
      h || g(Error(`indexedDB timeout: bloqueado: ${k ? "essa aba" : "outra"} (${a})`));
    }, 100);
    const l = indexedDB.open(a, d);
    l.onsuccess = m => {
      h = !0;
      m = m.target.result;
      da.set(a, m);
      e(m);
    };
    l.onerror = m => {
      h = !0;
      g(m.target.error);
    };
    l.onupgradeneeded = m => {
      h = !0;
      m = m.target.result;
      b && b(m);
    };
    l.onblocked = () => {
      k = !0;
    };
  });
  ha.set(a, c);
  const f = () => {
    ha.delete(a);
  };
  c.then(f, f);
  return c;
}
async function ka(a, b) {
  let c = await ja(a);
  c.objectStoreNames.contains(b) || (c = await ja(a, d => {
    d.createObjectStore(b);
  }));
  return c;
}
async function la(a, b) {
  let c = await ja(a);
  c.objectStoreNames.contains(b) && (c = await ja(a, d => {
    d.deleteObjectStore(b);
    console.log("apagado");
  }));
  return c;
}
async function ma(a, b, c, ...d) {
  const f = a.i.transaction([a.h], b).objectStore(a.h)[c](...d);
  return new Promise((e, g) => {
    f.onsuccess = h => {
      e(h.target.result);
    };
    f.onerror = h => {
      g(h.target.error);
    };
  });
}
class na {
  constructor(a) {
    const [b, c] = a.split(".");
    this.g = b;
    this.h = c;
  }
  get i() {
    return da.get(this.g);
  }
  async init() {
    return await ka(this.g, this.h);
  }
  async get(a) {
    return await ma(this, "readonly", "get", a);
  }
  async set(a, b) {
    await ma(this, "readwrite", "put", b, a);
  }
  async j(a) {
    await ma(this, "readwrite", "delete", a);
  }
  async clear() {
    await ma(this, "readwrite", "clear");
  }
  async o() {
    return await ma(this, "readwrite", "getAllKeys");
  }
  async D() {
    await la(this.g, this.h);
  }
  async C() {
    this.i.close();
    da.delete(this.g);
    return new Promise((a, b) => {
      const c = indexedDB.deleteDatabase(this.g);
      c.onsuccess = () => {
        a();
      };
      c.onerror = d => {
        b(d.target.error);
      };
    });
  }
}
function oa(a) {
  a = new na(a);
  const b = [];
  b[0] = a.init.bind(a);
  b[1] = a.get.bind(a);
  b[2] = a.set.bind(a);
  b[3] = a.j.bind(a);
  b[4] = a.clear.bind(a);
  b[5] = a.o.bind(a);
  b[6] = a.D.bind(a);
  b[7] = a.C.bind(a);
  return b;
}
;async function pa(a = null) {
  let b = {};
  if (a !== null) {
    let c = "desktop documents downloads music pictures videos".split(" ");
    (a?.constructor.name ?? "") === "FileSystemDirectoryHandle" || c.includes(a) ? b.startIn = a : typeof a === "string" && (b.id = a);
  }
  try {
    return await window.showDirectoryPicker(b);
  } catch (c) {
    return null;
  }
}
async function qa(a, b) {
  try {
    return await a.queryPermission() === "granted" ? !0 : b ? !1 : await a.requestPermission() === "granted";
  } catch (c) {
    return !1;
  }
}
var ra = {description:"ZIP Files", accept:{"application/zip":[".zip"]}}, ua = {description:"WASM Files", accept:{"application/wasm":[".wasm"]}};
function va(a) {
  if (a <= 20) {
    return 20;
  }
  const b = Math.pow(10, Math.floor(Math.log10(a))), c = Math.ceil(a / b) * b;
  return c > a ? c : c + b;
}
;async function wa(a) {
  if (a.handle.kind === "file") {
    a.file = await a.handle.getFile();
    a.size = a.file.size;
    a.mimeType = a.file.type;
    var b = new Date(a.file.lastModified);
    a.modifiedTime = `${(b.getMonth() + 1).toString().padStart(2, "0")}-${b.getDate().toString().padStart(2, "0")}-${b.getFullYear()} ${b.getHours().toString().padStart(2, "0")}:${b.getMinutes().toString().padStart(2, "0")}:${b.getSeconds().toString().padStart(2, "0")}`;
  }
}
class xa {
  constructor(a, b) {
    this.folder = a;
    this.name = b.name;
    this.handle = b;
    b.kind === "file" ? this.isfile = !0 : b.kind === "directory" && (this.isfile = !1);
  }
}
async function ya(a, b = !0, c = "") {
  let d = [];
  if (!a) {
    return d;
  }
  const f = [];
  for await (const g of a.values()) {
    var e = g;
    a = new xa(c, e);
    if (e.kind === "file") {
      a.isfile = !0, f.push(a), d.push(a);
    } else if (e.kind === "directory") {
      a.isfile = !1;
      e = await ya(e, b, c ? `${c}/${e.name}` : e.name);
      if (b) {
        for (let h of e) {
          d.push(h);
        }
      } else {
        a.g = e;
      }
      d.push(a);
    }
  }
  for (b = 0; b < f.length; b += 50) {
    await Promise.all(f.slice(b, b + 50).map(g => wa(g)));
  }
  return d;
}
async function za(a, b, c = !1) {
  if (!a || !b) {
    return a;
  }
  b = b.split("/").filter(Boolean);
  try {
    for (const d of b) {
      a = await a.getDirectoryHandle(d, {create:c});
    }
    return a;
  } catch (d) {
    if (d.name === "NotFoundError") {
      return null;
    }
    throw d;
  }
}
;async function Aa(a) {
  let b;
  if (a.ug) {
    b = a.ug;
  } else if (a.Gc) {
    b = new na(a.Gc), await b.init();
  } else {
    if (a.throw) {
      throw Error("no storage passed");
    }
    return {persisted:!1, handle:null};
  }
  a.reload && await b.j(a.key);
  var c = await b.get(a.key);
  let d = await qa(c, a.Gd);
  if (!d && a.Gd) {
    return {persisted:!1, handle:null};
  }
  if ((c = d ? c : await pa(c || a.key)) && await qa(c, a.Gd)) {
    await b.set(a.key, c);
  } else {
    if (a.throw) {
      throw Error("dir handle not  aquired");
    }
    return {persisted:!1, handle:null};
  }
  return {persisted:d, handle:c};
}
async function Ba(a, b, c) {
  if (a.h && (c = await za(a.h, c), c = await ya(c, !0), c.length)) {
    var d = q => q < 6 ? !0 : q === 10 || q === 16, f = q => d(q) ? a.g.view.getInt32(b + q * 4, !0) : a.g.view.getFloat64(b + q * 4, !0), e = (q, u) => {
      d(q) ? a.g.view.setInt32(b + q * 4, u, !0) : a.g.view.setFloat64(b + q * 4, u, !0);
    }, g = f(0), h = {J:f(2), cap:400}, k = {J:f(3), cap:400}, l = {J:f(4), cap:400}, m = {J:f(10), cap:f(12)}, p = f(16), t = async(q, u) => {
      q === 1 ? (q = await u.file.text(), q = a.g.o(q, m), e(10, m.J), e(12, m.cap), e(14, q)) : q === 2 ? u.handle instanceof FileSystemFileHandle && (q = await u.handle.createWritable(), u = (u = f(14)) ? a.g.i(p, p + u) : "", await q.write(u), await q.close()) : q == 3 ? (q = await u.file.arrayBuffer(), u = f(18), q.byteLength > u && (p && a.g.j(p), u = q.byteLength, p = a.g.h(u), e(16, p), e(18, u)), e(20, q.byteLength), a.g.g.set(new Uint8Array(q), p)) : q === 4 && u.handle instanceof FileSystemFileHandle && 
      (q = await u.handle.createWritable(), u = f(20), await q.write(a.g.g.subarray(p, p + u)), await q.close());
    };
    for (let q = 0; q < c.length; q++) {
      const u = c[q];
      a.g.o(u.name, h);
      a.g.o(u.folder, k);
      a.g.o(u.mimeType, l);
      u.isfile ? (e(6, u.size), e(8, u.file.lastModified)) : (e(6, 0), e(8, 0));
      e(1, 0);
      a.g.O(g, 2);
      const r = f(1);
      r && (await t(r, u), a.g.O(g, 2));
    }
  }
}
async function Ca(a, b, c, d) {
  a.h && (a = await (await za(a.h, b, !0))?.getFileHandle(c, {create:!0})) && (a = await a.createWritable(), await a.write(d), await a.close());
}
async function Da(a, b, c, d, f) {
  a.h && (b = await (await za(a.h, b, !0))?.getFileHandle(c, {create:!0})) && (a = a.g.g.slice(d, d + f), d = await b.createWritable(), await d.write(a), await d.close());
}
async function Ea(a, b) {
  if (a.h && b) {
    var c = a.h, d = b, f = b.lastIndexOf("/");
    if (f >= 0 && (c = await za(a.h, b.slice(0, f)), d = b.slice(f + 1), !c || !d)) {
      return;
    }
    try {
      await c.removeEntry(d);
    } catch (e) {
      console.warn("file_remove", b, e);
    }
  }
}
class Fa {
}
var Ga = async(a, b) => {
  const c = new Fa();
  c.g = a;
  var d = Array(7).fill(0).map((h, k) => a.view.getInt32(b + 4 * k, !0)), f = a.i(d[0], d[1]);
  const e = a.i(d[2], d[3]), g = !!d[6];
  d = await Aa({Gc:f, key:e, reload:d[4], Gd:g, throw:!g});
  d.handle && (c.h = d.handle);
  f = a.view.getInt32(b + 20, !0);
  a.view.setInt32(f, c.h ? d.persisted ? 1 : 2 : 3, !0);
  return (h, ...k) => {
    switch(h) {
      case 1:
        return Ba(c, ...k);
      case 2:
        return Ca(c, ...k);
      case 3:
        return Da(c, ...k);
      case 4:
        return Ea(c, ...k);
    }
  };
};
function Ha(a) {
  return new Promise((b, c) => {
    const d = document.createElement("script"), f = (new Date()).toISOString();
    window[f] = e => {
      delete window[f];
      b(e);
    };
    d.type = "module";
    d.textContent = a(f);
    d.onerror = () => {
      c(void 0);
    };
    document.head.appendChild(d);
    document.head.removeChild(d);
  });
}
;function Ia(a, b, c) {
  return d => {
    const f = a[d ?? ""];
    f === void 0 && typeof d === "string" && console.error(`${c} ${d}`);
    return f ?? b;
  };
}
function Ja(a) {
  const b = Object.fromEntries(Object.entries(a).map(([c, d]) => [d, c]));
  return c => b[c];
}
var Ka = Ja({arc:1, arcTo:2, bezierCurveTo:3, closePath:4, ellipse:5, lineTo:6, moveTo:7, quadraticCurveTo:8, rect:9, roundRect:10, addPath:11, clearRect:12, fillRect:13, strokeRect:14, getTransform:15, resetTransform:16, rotate:17, scale:18, setTransform:19, transform:20, translate:21, beginPath:22, clip:23, fill:24, isPointInPath:25, isPointInStroke:26, stroke:27, lineCap:28, lineDashOffset:29, lineJoin:30, lineWidth:31, miterLimit:32, getLineDash:33, setLineDash:34, drawImage:35, createImageData:36, 
getImageData:37, putImageData:38, isContextLost:39, reset:40, restore:41, save:42, fillStyle:43, strokeStyle:44, createConicGradient:45, createLinearGradient:46, createPattern:47, createRadialGradient:48, filter:49, globalAlpha:50, globalCompositeOperation:51, imageSmoothingEnabled:52, imageSmoothingQuality:53, getContextAttributes:54, shadowBlur:55, shadowColor:56, shadowOffsetX:57, shadowOffsetY:58, fillText:59, measureText:60, strokeText:61, direction:62, font:63, fontKerning:64, fontStretch:65, 
fontVariantCaps:66, letterSpacing:67, textAlign:68, textBaseline:69, textRendering:70, wordSpacing:71, drawFocusIfNeeded:72, mc:80, clip_path:81, Og:82, ih:83, Mg:84, hh:85, Cg:100, Fg:101, Ag:102, Bg:103, Eg:104, Dg:105});
const La = {copy:1, "source-over":2, "source-in":3, "source-out":4, "source-atop":5, "destination-over":7, "destination-in":8, "destination-out":9, "destination-atop":10, xor:11, lighter:12, multiply:14, screen:15, overlay:16, darken:17, lighten:18, "color-dodge":19, "color-burn":20, "hard-light":21, "soft-light":22, difference:23, exclusion:24, hue:25, saturation:26, color:27, luminosity:28};
var Ma = Ia(La, La["source-over"], "eglobalCompositeOperation"), Na = Ja(La);
const Oa = {butt:0, round:1, square:2};
var Qa = Ia(Oa, Oa.butt, "eLineCap"), Ra = Ja(Oa);
const Sa = {miter:0, bevel:1, round:2};
var Ta = Ia(Sa, Sa.miter, "eLineJoin"), Ua = Ja(Sa);
Ja({repeat:0, "repeat-x":1, "repeat-y":2, "no-repeat":3});
var Va = Ja({nonzero:0, evenodd:1});
function Wa() {
  return Ha(a => `import  * as _ from '${"https://cdn.jsdelivr.net/npm/canvg@4.0.3/+esm"}'; window['${a}'](_.Canvg);`);
}
function Xa(a) {
  const b = a.getContext("2d");
  b.mc = () => {
    b.fillRect(0, 0, b.canvas.width, b.canvas.height);
  };
  return b;
}
async function Ya(a) {
  const b = URL.createObjectURL(new Blob([a], {type:"image/svg+xml"})), c = new Image();
  c.src = b;
  await new Promise((d, f) => {
    c.onload = d;
    c.onerror = e => {
      console.error("svgToImage ERRO:", e, "\nsvg:", a);
      f(e);
    };
  });
  return c;
}
function Za(a) {
  a = a.trim().replace(/^#/, "");
  if (a.length === 3 || a.length === 4) {
    var b = [...a].map(c => parseInt(c, 16) * 17);
    return [b[0], b[1], b[2], a.length === 4 ? b[3] : 255];
  }
  b = [...a].map(c => parseInt(c, 16));
  return [b[0] * 16 + b[1], b[2] * 16 + b[3], b[4] * 16 + b[5], a.length >= 8 ? b[6] * 16 + b[7] : 255];
}
function $a(a) {
  if (a.indexOf("#") > -1) {
    a = Za(a);
  } else {
    a: {
      const b = a.match(/[\d.]+/g)?.map(Number) ?? [];
      switch(b.length) {
        case 3:
          b[3] = 1.0;
        case 4:
          /%/.test(a) && (b[3] /= 100);
          b[3] = parseInt(b[3] * 255, 10);
          a = b;
          break a;
      }
      throw Error("invalid rgba", a);
    }
  }
  return a;
}
function n(a, b, c) {
  var d;
  d === void 0 && (d = 255);
  return (a & 255) << 24 | (b & 255) << 16 | (c & 255) << 8 | d & 255;
}
function ab(a) {
  return `rgba(${a >> 24 & 255}, ${a >> 16 & 255}, ${a >> 8 & 255}, ${((a & 255) / 255).toFixed(3)})`;
}
function bb(a) {
  return ((a[0] ?? 0) & 255) << 24 | ((a[1] ?? 0) & 255) << 16 | ((a[2] ?? 0) & 255) << 8 | (a[3] ?? 255) & 255;
}
;class cb {
  constructor(a) {
    this.j = a;
    this.C = 0;
    this.i = {J:a.h(256), cap:256};
  }
  g() {
  }
  h() {
  }
  D() {
    this.i.J && (this.j.j(this.i.J), this.i.J = 0);
  }
  arc(a, b, c, d, f, e) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.g(4, f);
    this.g(5, e ? 1 : 0);
    this.h(1);
  }
  arcTo(a, b, c, d, f) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.g(4, f);
    this.h(2);
  }
  bezierCurveTo(a, b, c, d, f, e) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.g(4, f);
    this.g(5, e);
    this.h(3);
  }
  closePath() {
    this.h(4);
  }
  ellipse(a, b, c, d, f, e, g, h) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.g(4, f);
    this.g(5, e);
    this.g(6, g);
    this.g(7, h ? 1 : 0);
    this.h(5);
  }
  lineTo(a, b) {
    this.g(0, a);
    this.g(1, b);
    this.h(6);
  }
  moveTo(a, b) {
    this.g(0, a);
    this.g(1, b);
    this.h(7);
  }
  quadraticCurveTo(a, b, c, d) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.h(8);
  }
  rect(a, b, c, d) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.h(9);
  }
  clearRect(a, b, c, d) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.h(12);
  }
  fillRect(a, b, c, d) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.h(13);
  }
  strokeRect(a, b, c, d) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.h(14);
  }
  resetTransform() {
    this.h(16);
  }
  rotate(a) {
    this.g(0, a);
    this.h(17);
  }
  scale(a, b) {
    this.g(0, a);
    this.g(1, b);
    this.h(18);
  }
  setTransform(a, b, c, d, f, e) {
    typeof a !== "number" && (b = a.b, c = a.c, d = a.d, f = a.e, e = a.f, a = a.a);
    this.g(0, a ?? 0);
    this.g(1, b ?? 0);
    this.g(2, c ?? 0);
    this.g(3, d ?? 0);
    this.g(4, f ?? 0);
    this.g(5, e ?? 0);
    this.h(19);
  }
  transform(a, b, c, d, f, e) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.g(4, f);
    this.g(5, e);
    this.h(20);
  }
  translate(a, b) {
    this.g(0, a);
    this.g(1, b);
    this.h(21);
  }
  beginPath() {
    this.h(22);
  }
  clip(a, b) {
    typeof a === "string" && (b = a);
    this.g(0, b === "evenodd" ? 1 : 0);
    this.h(23);
  }
  fill(a, b) {
    typeof a === "string" && (b = a);
    this.g(0, b === "evenodd" ? 1 : 0);
    this.h(24);
  }
  stroke() {
    this.h(27);
  }
  get lineCap() {
    return "butt";
  }
  set lineCap(a) {
    this.g(0, Qa(a));
    this.h(28);
  }
  get lineDashOffset() {
    return 0;
  }
  set lineDashOffset(a) {
    this.g(0, a);
    this.h(29);
  }
  get lineJoin() {
    return "miter";
  }
  set lineJoin(a) {
    this.g(0, Ta(a));
    this.h(30);
  }
  get lineWidth() {
    return 1;
  }
  set lineWidth(a) {
    this.g(0, a);
    this.h(31);
  }
  get miterLimit() {
    return 10;
  }
  set miterLimit(a) {
    this.g(0, a);
    this.h(32);
  }
  getLineDash() {
    return [];
  }
  setLineDash(a) {
    const b = a ? a.length : 0;
    if (b) {
      var c = b * 8;
      c > this.i.cap && (this.j.j(this.i.J), this.i.cap = c, this.i.J = this.j.h(c));
      for (c = 0; c < b; c++) {
        this.j.view.setFloat64(this.i.J + c * 8, a[c], !0);
      }
      this.g(0, this.i.J);
      this.g(1, b);
    } else {
      this.g(0, 0), this.g(1, 0);
    }
    this.h(34);
  }
  reset() {
    this.h(40);
  }
  restore() {
    this.h(41);
  }
  save() {
    this.h(42);
  }
  get fillStyle() {
    return "#000000";
  }
  set fillStyle(a) {
    typeof a === "number" ? (this.g(0, a), this.h(43)) : typeof a === "string" && (this.g(0, bb($a(a))), this.h(43));
  }
  get strokeStyle() {
    return "#000000";
  }
  set strokeStyle(a) {
    typeof a === "number" ? (this.g(0, a), this.h(44)) : typeof a === "string" && (this.g(0, bb($a(a))), this.h(44));
  }
  get globalAlpha() {
    return 1;
  }
  set globalAlpha(a) {
    this.g(0, a);
    this.h(50);
  }
  get globalCompositeOperation() {
    return "source-over";
  }
  set globalCompositeOperation(a) {
    this.g(0, Ma(a));
    this.h(51);
  }
  mc() {
    this.h(80);
  }
  roundRect() {
    console.warn("ctx_bridge: not implemented", "roundRect");
  }
  addPath() {
    console.warn("ctx_bridge: not implemented", "addPath");
  }
  getTransform() {
    return {a:1, b:0, c:0, d:1, e:0, f:0};
  }
  isPointInPath() {
    return !1;
  }
  isPointInStroke() {
    return !1;
  }
  drawImage() {
    console.warn("ctx_bridge: not implemented", "drawImage");
  }
  createImageData() {
    console.warn("ctx_bridge: not implemented", "createImageData");
    return new ImageData(1, 1);
  }
  getImageData() {
    console.warn("ctx_bridge: not implemented", "getImageData");
    return new ImageData(1, 1);
  }
  putImageData() {
    console.warn("ctx_bridge: not implemented", "putImageData");
  }
  isContextLost() {
    return !1;
  }
  createConicGradient() {
    console.warn("ctx_bridge: not implemented", "createConicGradient");
    return {};
  }
  createLinearGradient() {
    console.warn("ctx_bridge: not implemented", "createLinearGradient");
    return {};
  }
  createPattern() {
    console.warn("ctx_bridge: not implemented", "createPattern");
    return null;
  }
  createRadialGradient() {
    console.warn("ctx_bridge: not implemented", "createRadialGradient");
    return {};
  }
  get filter() {
    return "none";
  }
  set filter(a) {
    console.warn("ctx_bridge: not implemented", "filter set");
  }
  get imageSmoothingEnabled() {
    return !0;
  }
  set imageSmoothingEnabled(a) {
    console.warn("ctx_bridge: not implemented", "imageSmoothingEnabled set");
  }
  get imageSmoothingQuality() {
    return "";
  }
  set imageSmoothingQuality(a) {
    console.warn("ctx_bridge: not implemented", "imageSmoothingQuality set");
  }
  get shadowBlur() {
    return 0;
  }
  set shadowBlur(a) {
    console.warn("ctx_bridge: not implemented", "shadowBlur set");
  }
  get shadowColor() {
    return "rgba(0,0,0,0)";
  }
  set shadowColor(a) {
    console.warn("ctx_bridge: not implemented", "shadowColor set");
  }
  get shadowOffsetX() {
    return 0;
  }
  set shadowOffsetX(a) {
    console.warn("ctx_bridge: not implemented", "shadowOffsetX set");
  }
  get shadowOffsetY() {
    return 0;
  }
  set shadowOffsetY(a) {
    console.warn("ctx_bridge: not implemented", "shadowOffsetY set");
  }
  fillText(a, b, c, d) {
    a = this.j.o(a, this.i);
    this.g(0, b);
    this.g(1, c);
    this.g(2, d || 0);
    this.g(3, this.i.J);
    this.g(4, a);
    this.h(59);
  }
  strokeText(a, b, c, d) {
    a = this.j.o(a, this.i);
    this.g(0, b);
    this.g(1, c);
    this.g(2, d || 0);
    this.g(3, this.i.J);
    this.g(4, a);
    this.h(61);
  }
  measureText() {
    return {width:0};
  }
  get direction() {
    return "";
  }
  set direction(a) {
    console.warn("ctx_bridge: not implemented", "direction set");
  }
  get font() {
    return "10px sans-serif";
  }
  set font(a) {
    a = this.j.o(a, this.i);
    this.g(0, this.i.J);
    this.g(1, a);
    this.h(63);
  }
  get fontKerning() {
    return "";
  }
  set fontKerning(a) {
    console.warn("ctx_bridge: not implemented", "fontKerning set");
  }
  get fontStretch() {
    return "";
  }
  set fontStretch(a) {
    console.warn("ctx_bridge: not implemented", "fontStretch set");
  }
  get fontVariantCaps() {
    return "";
  }
  set fontVariantCaps(a) {
    console.warn("ctx_bridge: not implemented", "fontVariantCaps set");
  }
  get letterSpacing() {
    return "";
  }
  set letterSpacing(a) {
    console.warn("ctx_bridge: not implemented", "letterSpacing set");
  }
  get textAlign() {
    return "start";
  }
  set textAlign(a) {
    console.warn("ctx_bridge: not implemented", "textAlign set");
  }
  get textBaseline() {
    return "alphabetic";
  }
  set textBaseline(a) {
    console.warn("ctx_bridge: not implemented", "textBaseline set");
  }
  get textRendering() {
    return "";
  }
  set textRendering(a) {
    console.warn("ctx_bridge: not implemented", "textRendering set");
  }
  get wordSpacing() {
    return "";
  }
  set wordSpacing(a) {
    console.warn("ctx_bridge: not implemented", "wordSpacing set");
  }
  drawFocusIfNeeded() {
    console.warn("ctx_bridge: not implemented", "drawFocusIfNeeded");
  }
}
class db extends cb {
  constructor(a, b, c, d) {
    super(a);
    this.o = b;
    this.J = a.h(72);
    this.canvas = {width:c, height:d};
  }
  g(a, b) {
    this.j.view.setFloat64(this.J + a * 8, b, !0);
    a >= this.C && (this.C = a + 1);
  }
  h(a) {
    this.j.Ce(a, this.J, this.o);
    this.C = 0;
  }
  D() {
    this.j.j(this.J);
    this.J = 0;
    super.D();
  }
}
;async function eb(a, b) {
  var c = new Int32Array(a.buffer, b, 7), d = c[5], f = c[6];
  if (d === 0) {
    b = await Wa(), f > 0 && (a.I[f] = b);
  } else {
    b = a.i(c[0], c[1]);
    var e = c[2], g = c[3];
    c = c[4];
    if (d === 1) {
      d = f > 0 ? a.I[f] : null;
      if (!d) {
        throw Error("CanvgMode.SYNC: canvg n\u00e3o carregado (canvg_ix=" + f + ")");
      }
      a = new db(a, e, g, c);
      try {
        d.fromString(a, b).start({enableRedraw:!0, ignoreAnimation:!0, ignoreMouse:!0});
      } finally {
        a.D();
      }
    } else if (d === 2) {
      (f = f > 0 ? a.I[f] : null) || (f = await Wa());
      a = new db(a, e, g, c);
      try {
        await f.fromString(a, b).render();
      } finally {
        a.D();
      }
    }
  }
}
async function fb(a, b) {
  var c = new Int32Array(a.buffer, b, 7);
  b = a.i(c[0], c[1]);
  const d = c[2], f = c[3], e = c[4], g = c[5];
  c = c[6];
  a.I[e] = new OffscreenCanvas(d, f);
  try {
    if (g === 0) {
      const k = await Ya(b);
      a.I[e] = k;
    } else if (g === 1) {
      const k = c > 0 ? a.I[c] : null;
      if (!k) {
        throw Error("SvgImageMode.SYNC_CANVG: canvg n\u00e3o carregado (canvg_ix=" + c + ")");
      }
      var h = a.I;
      const l = new OffscreenCanvas(d, f), m = Xa(l);
      k.fromString(m, b).start({ignoreAnimation:!0});
      h[e] = l;
    } else if (g === 2) {
      let k = c > 0 ? a.I[c] : null;
      k ||= await Wa();
      const l = new OffscreenCanvas(d, f), m = Xa(l);
      await k.fromString(m, b).render();
      a.I[e] = l;
    }
  } catch (k) {
    console.error("js_svg_image_dispatch ERRO:", k, "\nsvg:", b);
  }
}
;function gb(a, b) {
  var c = new Int32Array(a.buffer, b, 8);
  b = c[0];
  const d = a.i(c[1], c[2]), f = a.i(c[3], c[4]);
  a = c[5] ? a.i(c[5], c[6]) : "";
  c = c[7] & 1 ? "i" : "";
  switch(b) {
    case 0:
      return d.replace(new RegExp(f, "g" + c), a);
    case 1:
      return (new RegExp(f, c)).test(d) ? 1 : 0;
    case 2:
      return (new RegExp(f.startsWith("^") ? f : "^(?:" + f + ")$", c)).test(d) ? 1 : 0;
    case 3:
      return d.match(new RegExp(f, c));
    case 4:
      return d.match(new RegExp(f.startsWith("^") ? f : "^(?:" + f + ")$", c));
    case 5:
      return [...d.matchAll(new RegExp(f, "g" + c))].map(e => e[0]);
    case 6:
      return d.split(new RegExp(f, c));
    default:
      return null;
  }
}
;class hb {
  constructor() {
    this.g = new WeakMap();
    this.h = null;
    this.o = typeof document !== "undefined" ? [document.body] : [];
    this.j = [];
  }
  get i() {
    return !!this.h;
  }
  set i(a) {
    a !== !!this.h && (a ? (this.h = new MutationObserver(b => {
      b.forEach(c => {
        this.j.forEach(d => d(c));
      });
    }), this.o.forEach(b => this.h.observe(b, {childList:!0, subtree:!0}))) : (this.h.disconnect(), this.h = null));
  }
}
var ib = new WeakMap(), jb = new hb();
const kb = {[6]:1, [5]:1, [7]:1, [1]:10, [4]:1, [3]:1, [2]:10, [8]:1, [9]:1, [16]:0, [10]:-100.11, [11]:-100.33, [12]:0, [13]:2, [14]:8, [15]:0};
function lb(a) {
  function b(e) {
    if (d.currentNode.childNodes.length !== e.h.length) {
      return d.firstChild(), new mb(d.currentNode, e);
    }
    if (d.nextSibling()) {
      return new mb(d.currentNode, e.parent);
    }
    d.parentNode();
    if (d.currentNode && e.parent) {
      return e.parent;
    }
  }
  function c(e) {
    e.h = e.h.filter(g => {
      let h = g.node instanceof Text ? g.node.textContent.trim().length > 0 : !0;
      h || e.node.removeChild(g.node);
      return h;
    });
    e.h.forEach(g => c(g));
  }
  let d = document.createTreeWalker(a, NodeFilter.SHOW_ALL), f = a = new mb(a);
  for (; f = b(f), f !== void 0;) {
  }
  c(a);
  return a;
}
function nb(a) {
  let b = [];
  var c = [];
  if (a.node instanceof HTMLElement || a.node instanceof SVGElement) {
    a = a.node.attributes;
    for (c = 0; c < a.length; c++) {
      b.push(a[c]);
    }
    c = b.reduce((d, f) => {
      d.push({key:f.localName, value:f.value});
      return d;
    }, []);
  }
  return c;
}
function ob(a, b) {
  for (let c = 0; c < a.wb.length; c++) {
    if (b === a.wb[c].key) {
      return a.wb[c].value;
    }
  }
}
function pb(a, b) {
  return b ? a.wb.reduce((c, d) => c || d.key === b, !1) : a.node instanceof HTMLElement ? !0 : !1;
}
class mb {
  constructor(a, b) {
    b && (this.parent = b);
    this.node = a;
    this.h = [];
    b && b.h.push(this);
    this.o = null;
    this.wb = nb(this);
    this.j = [];
    a instanceof HTMLElement || a instanceof SVGElement ? (this.g = a, this.i = this.g.localName, a instanceof HTMLInputElement ? (this.j.push({key:"value", value:a.value}), this.j.push({key:"checked", value:a.checked})) : a instanceof HTMLSelectElement ? this.j.push({key:"value", value:a.value}) : a instanceof HTMLTextAreaElement && this.j.push({key:"value", value:a.value})) : a instanceof Text ? (this.i = "-Text", this.o = a.textContent) : a instanceof ShadowRoot ? this.i = "div" : a instanceof 
    Comment ? this.i = "!--" : (this.i = a.constructor.name, console.log("TYPE", a, this.i));
  }
  get id() {
    return ob(this, "id") ?? "";
  }
  get lid() {
    return ob(this, "lid") ?? "";
  }
  toString(a = 0) {
    const b = "    ".repeat(a);
    let c = `${b}<${this.i}>\n`;
    this.h.forEach(d => {
      c += `${d.toString(a + 1)}`;
    });
    return c += `${b}</${this.i}>\n`;
  }
}
;function qb(a) {
  let b = document.createElement("div");
  if (a.wb) {
    for (let [c, d] of Object.entries(a.wb)) {
      c.startsWith("_") || b.setAttribute(c.replace("_", "-"), d);
    }
  }
  a.parent && a.parent.appendChild(b);
  a.S && a.S(b);
  return b;
}
;const rb = new WeakMap(), sb = new WeakMap();
const tb = "default alias all-scroll auto cell col-resize context-menu copy crosshair e-resize ew-resize grab grabbing help move n-resize ne-resize nesw-resize ns-resize nw-resize nwse-resize no-drop none not-allowed pointer progress row-resize s-resize se-resize sw-resize text url w-resize wait zoom-in zoom-out".split(" ");
var ub = ["lt_cursor$$module$2023$ploft$js_dev$src$frontend$0$domedit"], vb = aa;
ub[0] in vb || typeof vb.execScript == "undefined" || vb.execScript("var " + ub[0]);
for (var wb; ub.length && (wb = ub.shift());) {
  ub.length || tb === void 0 ? vb[wb] && vb[wb] !== Object.prototype[wb] ? vb = vb[wb] : vb = vb[wb] = {} : vb[wb] = tb;
}
;const xb = new WeakMap();
function yb(a, b, c) {
  b = b.trim().split(/\s+/);
  const d = f => !c.includes(f);
  a = a.trim().split(/\s+/).filter(d);
  b = b.filter(d);
  a = new Set(a);
  b = new Set(b);
  if (a.size !== b.size) {
    return !1;
  }
  for (const f of a) {
    if (!b.has(f)) {
      return !1;
    }
  }
  return !0;
}
var zb = (a, b, c, d) => {
  let f = [];
  const e = [];
  c.wb.forEach(k => {
    pb(b, k.key) || f.push(k.key);
  });
  let g = !1, h = [];
  if (d.bf) {
    const k = (ob(c, "class") ?? "").trim().split(/\s+/);
    d.bf.class.trim().split(/\s+/).every(l => k.includes(l)) && (g = !0, h = d.bf.keys);
  }
  g && (f = f.filter(k => !h.includes(k)));
  b.wb.forEach(k => {
    const l = ob(c, k.key);
    g && h.includes(k.key) || (k.key === "class" ? yb(k.value, l ?? "", d.Xg ?? []) || e.push(k) : l !== k.value && e.push(k));
  });
  f.length && a.g.push({step:6, Ja:f.length, S:() => f.forEach(k => c.g.removeAttribute(k))});
  e.length && a.g.push({step:5, Ja:e.length, S:() => e.forEach(k => c.g.setAttribute(k.key, k.value))});
};
function Ab(a, b, c, d) {
  b.i !== c.i && (a.status = 1);
  a.status !== 1 && (zb(a, b, c, d), Bb(a, b, c), Cb(a, b, c), Db(a, b, c));
}
function Eb(a, b, c, d) {
  let f = rb.get(b.g);
  if (f) {
    var e = rb.get(c.g);
    e ? a.g.push({step:13, Ja:1, S:() => {
      Fb(f, e, d);
    }}) : a.g.push({step:14, Ja:1, S:() => {
      e = c.g.attachShadow({mode:f.mode});
      rb.set(c.g, e);
      Fb(f, e, d);
    }});
  }
}
function Gb(a, b, c, d) {
  let f = b.h.map(() => !1), e = c.h.map(() => !1), g = [], h = [];
  b.h.forEach((m, p) => {
    f[p] || c.h.forEach((t, q) => {
      f[p] || e[q] || (t = new Hb(m, t, d), t.status !== 1 && (t.status === 4 || t.h === 0 ? (f[p] = !0, e[q] = !0, g.push({ob:p, Rc:q, qc:q}), t.status === 4 ? a.o++ : a.j++, a.i.push(t)) : h.push({ye:p, Od:q, Yc:t, Qg:t.h, selected:!1})));
    });
  });
  h.length > 0 && (h = h.sort((m, p) => m.Yc.h < p.Yc.h ? -1 : m.Yc.h === p.Yc.h ? 0 : 1), h.forEach(m => {
    f[m.ye] || e[m.Od] || (f[m.ye] = !0, e[m.Od] = !0, m.selected = !0, g.push({ob:m.ye, Rc:m.Od, qc:m.Od}), a.i.push(m.Yc));
  }));
  let k = e.reduce((m, p, t) => p ? m : [...m, t], []);
  k.length && (a.g.push({step:2, Ja:k.length, S:() => k.forEach(m => {
    c.node.removeChild(c.h[m].node);
  })}), k.forEach(m => {
    g = g.map(p => m > p.Rc ? p : {ob:p.ob, Rc:p.Rc, qc:p.qc - 1});
  }));
  let l = f.reduce((m, p, t) => p ? m : [...m, t], []);
  l.length && (a.g.push({step:1, Ja:l.length, S:() => l.forEach(m => {
    m = b.h[m].node;
    c.node.appendChild(m);
    jb.i || Ib(m);
  })}), l.forEach(m => g.push({ob:m, Rc:Number.NaN, qc:g.length})));
  if (g.reduce((m, p) => m || p.qc !== p.ob, !1)) {
    let m = g.sort((p, t) => p.ob < t.ob ? -1 : p.ob === t.ob ? 0 : 1).map(p => p.qc);
    a.g.push({step:3, Ja:1, S:() => {
      for (let p = 0; p < m.length; p++) {
        if (p != m[p]) {
          let t = m[p];
          if (c.node instanceof HTMLElement || c.node instanceof SVGElement) {
            let q = c.node.childNodes[p], u = c.node.childNodes[t];
            m.splice(p, 1, p);
            m = m.map(r => r + (r >= p && r < t ? 1 : 0));
            c.node.insertBefore(u, q);
          }
        }
      }
    }});
  }
}
function Jb(a) {
  if (a.status === 1) {
    return 0;
  }
  let b = 0;
  a.g.forEach(c => b += kb[c.step] * c.Ja);
  b += kb[10] * a.j;
  b += kb[11] * a.o;
  a.i.forEach(c => b += c.h);
  return b;
}
function Bb(a, b, c) {
  let d = b.j.reduce((f, e) => {
    var g;
    a: {
      for (g = 0; g < c.j.length; g++) {
        if (e.key === c.j[g].key) {
          g = c.j[g].value;
          break a;
        }
      }
      g = void 0;
    }
    g !== e.value && f.push(e);
    return f;
  }, []);
  d.length && a.g.push({step:7, Ja:d.length, S:() => d.forEach(f => {
    c.node instanceof HTMLInputElement && (f.key === "value" && (c.node.value = f.value), f.key === "checked" && (c.node.checked = f.value));
    c.node instanceof HTMLSelectElement && f.key === "value" && (c.node.value = f.value);
    c.node instanceof HTMLTextAreaElement && f.key === "value" && (c.node.value = f.value);
  })});
}
function Cb(a, b, c) {
  b.o !== c.o && a.g.push({step:4, Ja:1, S:() => {
    c.node.textContent = b.o;
  }});
}
function Db(a, b, c) {
  let d = jb.g.get(b.node) ?? [], f = jb.g.get(c.node) ?? [], e = [], g = [], h = [];
  f.forEach((k, l) => {
    let m = !0;
    d.forEach((p, t) => {
      k.event === p.event && (k.hash !== void 0 || p.hash !== void 0 ? k.hash === p.hash && (m = !1, k.S !== p.S && h.push({wg:l, sg:t})) : k.S === p.S && (m = !1));
    });
    m && e.push(l);
  });
  d.forEach((k, l) => {
    let m = !0;
    f.forEach(p => {
      p.event === k.event && (p.hash !== void 0 || k.hash !== void 0 ? p.hash === k.hash && (m = !1) : p.S === k.S && (m = !1));
    });
    m && g.push(l);
  });
  e.length && a.g.push({step:9, Ja:e.length, S:() => {
    e.forEach(k => c.node.removeEventListener(f[k].event, f[k].S));
    e.sort((k, l) => k < l ? 1 : l < k ? -1 : 0).forEach(k => f.splice(k, 1));
    jb.g.set(c.node, f);
  }});
  g.length && a.g.push({step:8, Ja:g.length, S:() => {
    g.forEach(k => {
      c.node.addEventListener(d[k].event, d[k].S);
      f.push({event:d[k].event, S:d[k].S, hash:d[k].hash});
      jb.g.set(c.node, f);
    });
  }});
  h.length && a.g.push({step:16, Ja:h.length, S:() => {
    h.forEach(k => {
      const l = f[k.wg];
      k = d[k.sg];
      c.node.removeEventListener(l.event, l.S);
      c.node.addEventListener(k.event, k.S);
      l.S = k.S;
    });
    jb.g.set(c.node, f);
  }});
}
function Kb(a) {
  a.i.forEach(b => {
    Kb(b);
  });
  a.g.forEach(b => {
    try {
      b.S();
    } catch (c) {
      console.error(b.step, c);
    }
  });
}
class Hb {
  constructor(a, b, c) {
    this.g = [];
    this.status = 2;
    this.i = [];
    this.h = Number.NaN;
    this.o = this.j = 0;
    this.g.push({step:15, S:() => {
      const d = a.g, f = b.g;
      d && f && xb.set(d, f);
    }, Ja:1});
    if (c.od !== !0) {
      if (a.id) {
        if (a.id === b.id) {
          if (this.status = 4, xb.set(a.g, b.g), (c.Rg ?? []).includes(a.id)) {
            return;
          }
        } else {
          this.status = 1;
          return;
        }
      } else if (a.lid) {
        if (a.lid === b.lid) {
          this.status = 4, xb.set(a.g, b.g);
        } else {
          this.status = 1;
          return;
        }
      } else if (b.id || b.lid) {
        this.status = 1;
        return;
      }
      Ab(this, a, b, c);
      if (this.status === 1) {
        return;
      }
    }
    Eb(this, a, b, {...c, od:!0});
    this.status !== 1 && (Gb(this, a, b, {...c, od:!1}), this.h = Jb(this));
  }
}
function Ib(a) {
  let b = sb.get(a);
  b && (b(a), sb.delete(a));
  a.childNodes.forEach(Ib);
}
function Fb(a, b, c) {
  let d = typeof a !== "string" ? a : qb({S:e => e.innerHTML = a});
  b instanceof ShadowRoot && d instanceof HTMLElement && d.attributes.length && (d = qb({S:e => e.appendChild(d)}));
  let f = lb(d);
  b = lb(b);
  Kb(new Hb(f, b, c));
}
;const Lb = new Set("svg path symbol circle ellipse line polyline polygon rect g defs use clipPath mask pattern linearGradient radialGradient stop text tspan textPath image foreignObject marker filter feBlend feColorMatrix feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDropShadow feFlood feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset feSpecularLighting feTile feTurbulence animate animateMotion animateTransform set desc title metadata".split(" ")), Mb = new WeakMap(), 
Nb = new WeakMap();
function Ob(a) {
  if (!a) {
    return null;
  }
  if (a.isConnected) {
    return a;
  }
  for (; a;) {
    let b = xb.get(a);
    if (b && b.isConnected) {
      return b;
    }
    if (b === a) {
      break;
    }
    a = b;
  }
  return null;
}
async function Pb(a) {
  a = a.o;
  let b = a.length;
  for (let c = 0; c < b; c++) {
    const d = a[c].Ha;
    d && await d();
    a[c].Aa.forEach(f => {
      (f = f.g) && Nb.set(f, !0);
    });
  }
  a.length = 0;
}
async function Qb(a, b, c) {
  if (typeof b === "string" || typeof b === "number") {
    return c && c.appendChild(document.createTextNode(String(b))), null;
  }
  if (!b) {
    return null;
  }
  a.o?.push(b);
  b.o = a.o;
  a = await b.R(c);
  Mb.set(b, {parent:c ?? null, Hc:a});
  return a;
}
async function Rb(a, b) {
  var c = a.j;
  var d = c?.[0];
  c = (c?.length ?? 0) === 1 && typeof d === "function" ? d() : c ?? [];
  d = c.length;
  for (let f = 0; f < d; f++) {
    await Qb(a, c[f], b);
  }
}
class Sb {
  constructor(a) {
    this.Ba = a ?? {};
    this.j = [];
    this.oa = {};
    this.Aa = [];
    this.ba = !1;
  }
  async refresh() {
    if (!this.ba) {
      var a = Mb.get(this);
      a && (a.Hc = Ob(a.Hc), a.parent = Ob(a.parent));
      if (!a || !a.Hc) {
        throw Error("no root to update");
      }
      var b = a.parent ? a.parent.cloneNode(!1) : null;
      this.o = [this];
      (b = await this.R(b ?? void 0)) && Fb(b, a.Hc, {od:!1, ...this.oa});
      await Pb(this);
    }
  }
  render() {
    return null;
  }
  async R(a) {
    const b = await this.render();
    return b ? Qb(this, b, a) : null;
  }
}
class Tb extends Sb {
  create(a) {
    if (!this.g) {
      return null;
    }
    const b = Lb.has(this.g) ? document.createElementNS("http://www.w3.org/2000/svg", this.g) : document.createElement(this.g);
    for (let [e, g] of Object.entries(this.Ba ?? {})) {
      if (e === "className" && (e = "class"), e === "style") {
        var c = [], d = g;
        for (let [h, k] of Object.entries(d)) {
          c.push(`${Ub(h)}:${k}`);
        }
        b.setAttribute(e, c.join(";"));
      } else if (e.startsWith("on")) {
        c = e.substring(2).toLowerCase();
        d = g;
        b.addEventListener(c, d);
        var f = jb;
        let h = f.g.get(b);
        h || (h = [], f.g.set(b, h));
        if (!ib.has(d)) {
          f = d.toString();
          let k = 0;
          for (let l = 0; l < f.length; l++) {
            k = (k << 5) - k + f.charCodeAt(l), k |= 0;
          }
          ib.set(d, k);
        }
        f = ib.get(d);
        h.push({event:c, S:d, hash:f});
      } else {
        e === "ref" ? g.h = b : g !== null && g !== void 0 && (g !== !1 || e.startsWith("aria-") || e.startsWith("data-")) && b.setAttribute(String(e), String(g));
      }
    }
    a && a.appendChild(b);
    return b;
  }
  async R(a) {
    (a = this.create(a)) && await Rb(this, a);
    return a;
  }
}
function Ub(a) {
  return a.replace(/[A-Z]/g, b => `-${b.toLowerCase()}`);
}
function Vb(a) {
  const b = ca([]);
  a.j ? b.length && a.j.push(...b) : a.j = b;
  return a;
}
function v(a, b, ...c) {
  b = new Tb(b);
  b.g = a;
  c && (b.j = ca(c));
  return b;
}
class Wb {
  static get g() {
    return Sb;
  }
}
;async function Xb(a, b) {
  const c = b.cloneNode(!1);
  a.o = [a];
  const d = await a.R(c);
  Mb.set(a, {parent:c, Hc:d});
  Fb(c, b, {od:!1});
  await Pb(a);
}
;const Yb = new Map();
async function Zb(a, b, c) {
  const d = Yb.get(b);
  return d ? d(a, c) : (console.error("jsx_dispatch: componente nao registrado, id=" + b), null);
}
;const $b = [1];
function ac(a) {
  return a.g === 2 && $b.indexOf(a.m) !== -1;
}
const bc = new ArrayBuffer(8), cc = new Float64Array(bc), dc = new Uint32Array(bc);
function y(a) {
  dc[0] = a;
  dc[1] = 2146959360;
  return cc[0];
}
function ec(a) {
  if (!Number.isNaN(a)) {
    return -1;
  }
  cc[0] = a;
  return dc[1] !== 2146959360 ? -1 : dc[0];
}
function E(a) {
  const b = arguments.length, c = [null];
  c.length = b;
  for (let d = 0; d < b; d++) {
    c[d] = arguments[d];
  }
  return c;
}
class fc {
  constructor(a) {
    this.Oa = a;
  }
}
class F {
  constructor(a, b, c, d, f) {
    this.g = a;
    this.i = b;
    this.m = c;
    this.a = d;
    this.h = f;
  }
}
;function hc(a, b) {
  if (b === b) {
    return 0;
  }
  a.o[0] = b;
  return (a.j[1] & 2146959360) !== 2146959360 ? 0 : a.j[0];
}
function ic(a, b) {
  const c = hc(a, b);
  c && (a.g.add(c), a.h.add(c));
  return b;
}
class jc {
  constructor() {
    this.i = new ArrayBuffer(8);
    this.o = new Float64Array(this.i);
    this.j = new Uint32Array(this.i);
    this.g = new Set();
    this.h = new Set();
  }
  track(a) {
    const b = hc(this, a);
    b && b < 8192 && this.g.add(b);
    return a;
  }
  clear() {
    this.g.clear();
    this.h.clear();
  }
}
;class kc {
  constructor(a) {
    this.h = a;
  }
  g(a, b) {
    const c = this.h;
    b !== void 0 ? (c.g(0, a), c.g(1, b), c.h(200)) : (c.g(0, a), c.h(201));
    return ic(c.o, G(c));
  }
  ea(a, b) {
    const c = this.h;
    b ? (b = c.j.o(b, c.i), c.g(0, a ?? 0), c.g(1, c.i.J), c.g(2, b), c.h(205)) : a !== void 0 ? (c.g(0, a), c.h(202)) : c.h(204);
    return ic(c.o, G(c));
  }
  O(a) {
    const b = this.h;
    b.g(0, a);
    b.h(203);
    return ic(b.o, G(b));
  }
  add(a, b) {
    const c = this.h;
    c.g(0, a);
    c.g(1, b);
    c.h(220);
    return c.o.track(G(c));
  }
  sub(a, b) {
    const c = this.h;
    c.g(0, a);
    c.g(1, b);
    c.h(221);
    return c.o.track(G(c));
  }
  i(a, b) {
    const c = this.h;
    c.g(0, a);
    c.g(1, b);
    c.h(222);
    return c.o.track(G(c));
  }
  j(a, b) {
    const c = this.h;
    c.g(0, a);
    c.g(1, b);
    c.h(223);
    return c.o.track(G(c));
  }
  H(a, b) {
    const c = this.h;
    c.g(0, a);
    c.g(1, b);
    c.h(224);
    return c.o.track(G(c));
  }
  set(a, b) {
    const c = this.h;
    c.g(0, a);
    c.g(1, b);
    c.h(210);
  }
  D(a, b, c, d) {
    const f = this.h;
    f.g(0, a);
    f.g(1, b);
    f.g(2, c);
    f.g(3, d);
    f.h(211);
  }
  sin(a) {
    const b = this.h;
    b.g(0, a);
    b.h(240);
    return b.o.track(G(b));
  }
  cos(a) {
    const b = this.h;
    b.g(0, a);
    b.h(241);
    return b.o.track(G(b));
  }
  o(a, b) {
    const c = this.h;
    a = c.j.o(a, c.i);
    c.g(0, c.i.J);
    c.g(1, a);
    c.g(2, b);
    c.h(230);
  }
  C(a) {
    return ic(this.h.o, a);
  }
}
class lc {
  constructor(a) {
    this.g = a;
  }
  Y(a, b, c) {
    const d = this.g;
    d.g(0, a);
    d.g(1, b);
    d.g(2, c);
    d.h(300);
  }
  h(a) {
    this.g.g(0, a);
    this.g.h(301);
  }
  Sa(a, b, c) {
    const d = this.g;
    d.g(0, a);
    d.g(1, b);
    d.g(2, c);
    d.h(302);
  }
  sa() {
    this.g.h(303);
  }
  X() {
    this.g.h(304);
  }
  Kc(a, b, c) {
    const d = this.g;
    d.g(0, a);
    d.g(1, b);
    d.g(2, c);
    d.h(310);
    return ic(d.o, G(d));
  }
  Ic() {
    this.g.h(311);
  }
  Bc() {
    this.g.h(312);
  }
  Fc() {
    this.g.h(313);
  }
}
class mc {
  constructor(a, b) {
    this.h = a;
    this.g = b;
  }
  get ref() {
    return this.g;
  }
  create(a) {
    const b = this.h;
    a ? (a = b.j.o(a, b.i), b.g(0, this.g), b.g(1, b.i.J), b.g(2, a), b.h(132)) : (b.g(0, this.g), b.h(131));
  }
  get(a, b) {
    const c = this.h;
    c.g(0, this.g);
    c.g(1, a);
    c.g(2, b ?? 0);
    c.h(500);
    return ic(c.o, G(c));
  }
  set(a, b) {
    const c = this.h;
    c.g(0, this.g);
    c.g(1, a);
    c.g(2, b);
    c.h(501);
  }
  Md(a, b, c) {
    const d = this.h;
    d.g(0, this.g);
    d.g(1, a);
    d.g(2, b);
    d.g(3, c ?? 0);
    d.h(502);
    return ic(d.o, G(d));
  }
  yf(a, b) {
    const c = this.h;
    c.g(0, this.g);
    c.g(1, a);
    c.g(2, b.ua);
    c.h(133);
    return this;
  }
  Ac(a, b) {
    const c = this.h;
    c.g(0, this.g);
    c.g(1, a);
    c.g(2, b.ua);
    c.h(135);
    return this;
  }
}
class nc {
  constructor(a) {
    this.g = a;
  }
  h() {
    this.g.h(130);
    return new mc(this.g, G(this.g));
  }
}
function H(a, b) {
  a.g.g(7, a.h);
  a.g.h(b);
}
class oc {
  constructor(a, b) {
    this.g = a;
    this.h = b;
  }
  ea(a) {
    this.g.g(0, a !== void 0 ? a : 0);
    H(this, 801);
    return pc(this.g, 0);
  }
  vf(a) {
    this.g.g(0, a);
    H(this, 810);
    return pc(this.g, 0);
  }
  Gf(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 811);
  }
  Bf(a) {
    this.g.g(0, a);
    H(this, 812);
    return pc(this.g, 0);
  }
  Cf(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 813);
  }
  cf(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 814);
    return pc(this.g, 0);
  }
  Af(a, b, c) {
    this.g.g(0, a);
    this.g.g(1, b);
    this.g.g(2, c);
    H(this, 815);
  }
  rc(a) {
    this.g.g(0, a);
    H(this, 818);
    return pc(this.g, 0);
  }
  Re(a, b, c) {
    this.g.g(0, a);
    this.g.g(1, b);
    this.g.g(2, c);
    H(this, 820);
    return pc(this.g, 0);
  }
  Y(a, b, c) {
    this.g.g(0, a);
    this.g.g(1, b);
    this.g.g(2, c);
    H(this, 830);
  }
  Sa(a, b, c) {
    this.g.g(0, a);
    this.g.g(1, b);
    this.g.g(2, c);
    H(this, 831);
  }
  sa() {
    H(this, 832);
  }
  X() {
    H(this, 833);
  }
  Kc(a, b, c) {
    this.g.g(0, a);
    this.g.g(1, b);
    this.g.g(2, c);
    H(this, 840);
    return pc(this.g, 0);
  }
  Ic() {
    H(this, 841);
  }
  Bc() {
    H(this, 842);
  }
  Fc() {
    H(this, 843);
  }
  Ye() {
    H(this, 850);
  }
  he(a, b) {
    this.g.g(0, a);
    this.g.g(1, b !== void 0 ? 1 : 0);
    this.g.g(2, b !== void 0 ? b : 0);
    H(this, 851);
  }
}
class qc extends oc {
  constructor(a) {
    super(a, 1);
  }
  Sc(a) {
    this.g.g(0, a);
    H(this, 819);
    return pc(this.g, 0);
  }
  tc() {
    H(this, 852);
  }
  We() {
    H(this, 853);
  }
}
class rc extends oc {
  constructor(a) {
    super(a, 0);
  }
  ef(a) {
    this.g.g(0, a);
    H(this, 800);
  }
  xf() {
    H(this, 816);
    return pc(this.g, 0);
  }
  wf(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 817);
    return pc(this.g, 0);
  }
}
class sc {
  constructor(a, b) {
    this.g = a;
    this.ua = b;
  }
  P(a, b) {
    const c = this.g;
    c.g(0, this.ua);
    c.g(1, a);
    c.g(2, b);
    c.h(141);
    return this;
  }
}
class tc {
  constructor(a, b) {
    this.g = a;
    this.ua = b;
  }
  na(a, b) {
    const c = this.g;
    c.g(0, this.ua);
    c.g(1, a);
    c.g(2, b);
    c.h(120);
    return this;
  }
  gf(a, b) {
    const c = this.g;
    b = c.j.o(b, c.i);
    c.g(0, this.ua);
    c.g(1, a);
    c.g(2, c.i.J);
    c.g(3, b);
    c.h(121);
  }
  P(a, b) {
    const c = this.g;
    c.g(0, this.ua);
    c.g(1, a);
    c.g(2, b);
    c.h(122);
    return this;
  }
  da(a) {
    const b = this.g;
    b.g(0, this.ua);
    b.g(1, a);
    b.h(140);
    return new sc(b, G(b));
  }
  label() {
    return this;
  }
}
class uc {
  constructor(a, b, c) {
    this.h = a;
    this.ua = b;
    this.g = c;
  }
  Pa(a) {
    const b = this.h;
    this.g ? (b.g(0, this.ua), b.g(1, a.ua), b.h(111)) : (b.g(0, this.ua), b.g(1, a.ua), b.h(110));
    return new tc(b, G(b));
  }
}
class vc {
  constructor(a, b, c) {
    this.g = a;
    this.ua = b;
    this.h = c;
    a.h(160);
    this.self = new tc(a, G(a));
  }
  end() {
    wc(this.g);
    this.g.h(102);
    const a = this.h ? this.ua : G(this.g);
    return new uc(this.g, a, this.h);
  }
}
function G(a) {
  return a.j.view.getFloat64(a.J, !0);
}
function pc(a, b) {
  return a.j.view.getFloat64(a.J + b * 8, !0);
}
function wc(a) {
  var b = a.o;
  const c = [];
  for (const d of b.g) {
    d < 8192 && !b.h.has(d) && c.push(d);
  }
  for (b = 0; b < c.length; b++) {
    xc(a, c[b]);
  }
  a.o.clear();
}
function xc(a, b) {
  if (!(b >= 8192)) {
    var c = a.j.view, d = a.V;
    c.setUint32(d, b, !0);
    c.setUint32(d + 4, 2146959360, !0);
    a.j.Ga(a.R, 250, a.V, 0);
  }
}
class yc extends cb {
  constructor(a, b) {
    super(a);
    this.J = a.h(160);
    this.R = b;
    this.o = new jc();
    this.H = [];
    this.V = a.h(8);
    this.ba = new kc(this);
    this.Aa = new lc(this);
    this.Ha = new nc(this);
    this.oa = new qc(this);
    this.Ba = new rc(this);
    this.O = new Map();
  }
  get L() {
    return this;
  }
  get M() {
    return this.ba;
  }
  get xa() {
    return this.Aa;
  }
  get state() {
    return this.Ha;
  }
  get Ab() {
    return this.oa;
  }
  get action() {
    return this.Ba;
  }
  g(a, b) {
    this.j.view.setFloat64(this.J + a * 8, b, !0);
    a >= this.C && (this.C = a + 1);
    a = this.o;
    (b = (b = hc(a, b)) && b < 8192 && a.g.has(b) && !a.h.has(b) ? b : 0) && this.H.push(b);
  }
  h(a) {
    this.j.Ga(this.R, a, this.J, 0);
    this.C = 0;
    a = this.H;
    if (a.length > 0) {
      this.H = [];
      for (let b = 0; b < a.length; b++) {
        this.o.g.delete(a[b]), xc(this, a[b]);
      }
    }
  }
  Ma(a, b) {
    a = this.j.o(a, this.i);
    this.g(0, this.i.J);
    this.g(1, a);
    this.g(2, b || 0);
    this.h(100);
    return new vc(this, 0, !1);
  }
  Ra() {
    this.h(101);
    return new vc(this, G(this), !0);
  }
  Mb(a) {
    a = this.j.o(a, this.i);
    this.g(0, this.i.J);
    this.g(1, a);
    this.h(103);
  }
  root() {
    this.h(150);
    return new tc(this, G(this));
  }
  segment(a) {
    this.g(0, a);
    this.h(400);
  }
  fb(a) {
    this.g(0, a);
    this.h(401);
  }
  Pb() {
    this.h(402);
  }
  lc() {
    this.h(403);
  }
  ec() {
    this.h(406);
  }
  qb() {
    this.h(404);
  }
  pb() {
    this.h(405);
  }
  nb(a, b, c, d, f, e) {
    a = this.j.o(a, this.i);
    this.g(0, this.i.J);
    this.g(1, a);
    this.g(2, b);
    this.g(3, c);
    this.g(4, d);
    this.g(5, f);
    this.g(6, e);
    this.h(407);
  }
  Uc(a, b, c, d) {
    c = this.j.o(c + (d || ""), this.i);
    this.g(0, a);
    this.g(1, b);
    this.g(2, this.i.J);
    this.g(3, c);
    this.h(700);
    b = pc(this, 0);
    this.O.set(b, a);
    c = [];
    for (d = 0; d < a; d++) {
      c.push(ic(this.o, pc(this, 1 + d)));
    }
    return {handle:b, Ld:c};
  }
  ve() {
    wc(this);
    this.h(701);
  }
  Za(a, b) {
    if (typeof a === "string") {
      a = this.j.o(a, this.i);
      this.g(0, this.i.J);
      this.g(1, a);
      this.g(2, b.length);
      for (a = 0; a < b.length; a++) {
        this.g(3 + a, b[a]);
      }
      this.h(711);
    } else {
      var c = this.O.get(a);
      c !== void 0 && b.length !== c && console.warn("call_func: " + b.length + " args para funcao de " + c + " parametros (faltantes viram NaN; excedentes descartados)");
      this.g(0, a);
      this.g(1, b.length);
      for (a = 0; a < b.length; a++) {
        this.g(2 + a, b[a]);
      }
      this.h(710);
    }
  }
}
;class zc {
  constructor(a, b) {
    this.g = new yc(a, b);
    this.h = !1;
  }
  get state() {
    return this.g.state;
  }
  root() {
    return this.g.root();
  }
  Ma(a, b) {
    if (this.h) {
      throw Error("RecorderScope: overlapping context");
    }
    this.h = !0;
    a = this.g.Ma(a, b);
    return new Ac(this.g, a, () => {
      this.h = !1;
    });
  }
  Ra(a) {
    if (this.h) {
      throw Error("RecorderScope: overlapping context");
    }
    this.h = !0;
    a = this.g.Ra(a);
    return new Ac(this.g, a, () => {
      this.h = !1;
    });
  }
  Mb(a) {
    this.g.Mb(a);
  }
  Uc(a, b, c, d) {
    if (this.h) {
      throw Error("RecorderScope: overlapping context");
    }
    this.h = !0;
    a = this.g.Uc(a, b, c, d);
    return new Bc(this.g, a.handle, a.Ld, () => {
      this.h = !1;
    });
  }
}
class Ac {
  constructor(a, b, c) {
    this.g = a;
    this.i = b;
    this.h = c || null;
  }
  get L() {
    return this.g.L;
  }
  get M() {
    return this.g.M;
  }
  get xa() {
    return this.g.xa;
  }
  get Ab() {
    return this.g.Ab;
  }
  get action() {
    return this.g.action;
  }
  get self() {
    return this.i.self;
  }
  name(a) {
    this.g.Mb(a);
  }
  segment(a) {
    this.g.segment(a);
  }
  fb(a) {
    this.g.fb(a);
  }
  Pb() {
    this.g.Pb();
  }
  lc() {
    this.g.lc();
  }
  ec() {
    this.g.ec();
  }
  qb() {
    this.g.qb();
  }
  pb() {
    this.g.pb();
  }
  Za(a, b) {
    this.g.Za(a, b);
  }
  nb(a, b, c, d, f, e) {
    this.g.nb(a, b, c, d, f, e);
  }
  end() {
    this.h && this.h();
    return this.i.end();
  }
}
function Cc(a) {
  return new Proxy(a, {get(b, c) {
    if (typeof c === "string") {
      const d = Number(c);
      if (Number.isInteger(d) && (d < 0 || d >= b.length)) {
        return console.warn("func params: indice " + d + " fora dos " + b.length + " parametros registrados (rende NaN)"), NaN;
      }
    }
    return b[c];
  }});
}
class Bc {
  constructor(a, b, c, d) {
    this.g = a;
    this.h = b;
    this.Ld = Cc(c);
    this.i = d || null;
  }
  get handle() {
    return this.h;
  }
  get L() {
    return this.g.L;
  }
  get M() {
    return this.g.M;
  }
  get xa() {
    return this.g.xa;
  }
  segment(a) {
    this.g.segment(a);
  }
  fb(a) {
    this.g.fb(a);
  }
  qb() {
    this.g.qb();
  }
  pb() {
    this.g.pb();
  }
  Za(a, b) {
    this.g.Za(a, b);
  }
  nb(a, b, c, d, f, e) {
    this.g.nb(a, b, c, d, f, e);
  }
  end() {
    this.g.ve(this.h instanceof fc ? this.h.Oa : -1);
    this.i && this.i();
    return this.h;
  }
}
;const Dc = {};
const Ec = "fd_advise fd_allocate fd_datasync fd_fdstat_set_flags fd_fdstat_set_rights fd_filestat_get fd_filestat_set_size fd_filestat_set_times fd_pread fd_pwrite fd_read fd_readdir fd_renumber fd_sync fd_tell path_create_directory path_filestat_get path_filestat_set_times path_link path_open path_readlink path_remove_directory path_rename path_symlink path_unlink_file poll_oneoff sched_yield sock_accept sock_recv sock_send sock_shutdown __wasm_longjmp __wasm_setjmp_test args_get args_sizes_get clock_res_get fd_close fd_prestat_get fd_prestat_dir_name fd_seek proc_exit".split(" ");
async function Fc(a, b = {}) {
  a = new Response(new Blob([a], {type:"application/wasm"}));
  return await WebAssembly.instantiateStreaming(a, b);
}
console.log("DEV MODE", !0);
function Gc(a, b) {
  return a.wc.instance.exports[b];
}
async function Hc(a, b) {
  let c = 0;
  const d = async() => {
    var f = {wasi_snapshot_preview1:a.Aa, env:a.Aa};
    try {
      a.wc = await Fc(b, f);
    } catch (e) {
      return (f = String(e).match(/"(.*?)"\s*"(.*?)"/)) ? f[2] : null;
    }
    return null;
  };
  for (; c < 100;) {
    let f = await d();
    if (f) {
      Ec.push(f), c++;
    } else {
      break;
    }
  }
  c > 0 && (console.log("new imports demmand", c), console.log(Ec));
  a.ad.forEach(f => f());
  a.hb();
}
async function Ic(a) {
  if (!a.wc) {
    var b = await fetch("teste.wasm?v=37a92c4c");
    b.ok && (b = await b.arrayBuffer(), await Hc(a, b));
  }
}
class Jc {
  constructor() {
    this.ad = [() => {
      this.R = Gc(this, "memory");
      this.C = this.R.buffer;
      this.oa = new Uint8Array(this.C);
      this.Ba = new DataView(this.C);
    }, () => this.h = Gc(this, "c01"), () => this.j = Gc(this, "c02"), () => this.hb = Gc(this, "_start")];
  }
  get buffer() {
    return this.R.buffer;
  }
  get g() {
    this.R.buffer !== this.C && (this.C = this.R.buffer, this.oa = new Uint8Array(this.C), this.Ba = new DataView(this.C));
    return this.oa;
  }
  get view() {
    this.R.buffer !== this.C && (this.C = this.R.buffer, this.oa = new Uint8Array(this.C), this.Ba = new DataView(this.C));
    return this.Ba;
  }
  h() {
    throw Error("Not initialized");
  }
  j() {
    throw Error("Not initialized");
  }
  hb() {
    throw Error("Not initialized");
  }
  get Aa() {
    return this.$b;
  }
  get $b() {
    const a = {fd_write:(c, d, f, e) => {
      let g = 0;
      for (let l = 0; l < f; l++) {
        var h = d + l * 8, k = this.view.getUint32(h, !0);
        h = this.view.getUint32(h + 4, !0);
        k = this.g.slice(k, k + h);
        k.every(m => m === 0 || m === 10 || m === 13) || (k = (new TextDecoder()).decode(k), console[c === 1 ? "log" : "error"](k));
        g += h;
      }
      this.view.setUint32(e, g, !0);
    }, fd_fdstat_get:(c, d) => {
      this.view.setUint8(d, 0);
      this.view.setUint8(d + 1, 0);
      this.view.setBigUint64(d + 8 >>> 3, 0xffffffffffffffffn, !0);
      this.view.setBigUint64(d + 16 >>> 3, 0xffffffffffffffffn, !0);
      return 0;
    }, clock_time_get:(c, d, f) => {
      c === 0 ? this.view.setBigUint64(f, BigInt(Date.now()) * 1000000n, !0) : c === 1 ? this.view.setBigUint64(f, BigInt(Math.floor(performance.now() * 1E6)), !0) : this.view.setBigUint64(f, 0n, !0);
      return 0;
    }, environ_get:(c, d) => {
      console.log("environ_get", c, d);
      return 0;
    }, environ_sizes_get:(c, d) => {
      this.view.setUint32(c, 0, !0);
      this.view.setUint32(d, 0, !0);
      return 0;
    }, random_get:(c, d) => {
      c = this.g.subarray(c, c + d);
      if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
        crypto.getRandomValues(c);
      } else {
        for (let f = 0; f < d; f++) {
          c[f] = Math.random() * 256 | 0;
        }
      }
      return 0;
    }, __wasm_setjmp:() => {
    }}, b = new Map();
    Ec.forEach(c => {
      a[c] = (d, f, e, g) => {
        b.has(c) || b.set(c, 0);
        const h = b.get(c);
        if (h > 10) {
          throw Error("limite " + c);
        }
        b.set(c, h + 1);
        console.log(c, d, f, e, g);
      };
    });
    return a;
  }
}
function Kc(a, b, c, d, f) {
  if (b == 33) {
    return {lb:a.I, key:c};
  }
  if (b === 34) {
    return {lb:a.I[c], key:f};
  }
  if (b === 35) {
    let e = a.I[c];
    a = a.i(d, d + f).split(".");
    b = a.pop();
    a.forEach(g => e = e[g]);
    return {lb:e, key:b};
  }
  return null;
}
function Lc(a, b, c, d, f) {
  if (b & 2048) {
    return Lc(a, b - 2048, c, d, f) ? 1 : 0;
  }
  if (b & 4096) {
    return Number(Lc(a, b - 4096, c, d, f));
  }
  if (b === 2) {
    return c;
  }
  if (b === 3) {
    return f;
  }
  if (b === 4) {
    return a.i(d, d + c);
  }
  if (b === 9) {
    b = [];
    f = a.view;
    for (let e = 0; e < c; e++) {
      b.push(f.getFloat64(d, !0)), d += 8;
    }
    return b;
  }
  if (b === 10) {
    return f = [0, 1, 2, 3].map(e => a.view.getInt32(d + 4 * e, !0)), b = a.i(f[0], f[1]), f = a.i(f[2], f[3]), [...b.matchAll(new RegExp(f, "g"))][0];
  }
  if (b == 33) {
    return a.I[c];
  }
  if (b === 34) {
    return a.I[c][f];
  }
  if (b === 35) {
    let e = a.I[c];
    a.i(d, d + f).split(".").forEach(g => e = e[g]);
    return e;
  }
  if (b === 38) {
    let e = a.I[c];
    a.i(d, d + f).split(".").forEach(g => {
      e = e[g].bind(e);
    });
    return e;
  }
  if (b === 37) {
    return a.I;
  }
  if (b === 1025) {
    return oa(a.i(d, d + c));
  }
  if (b === 1026) {
    return () => Ga(a, d);
  }
  if (b === 1027) {
    return ba;
  }
  if (b === 1028) {
    return () => eb(a, d);
  }
  if (b === 1029) {
    return () => fb(a, d);
  }
  if (b === 1030) {
    return gb(a, d);
  }
  if (b === 1031) {
    return async e => {
      const g = [() => ({description:"Raster", accept:{"image/svg":[".svg"]}}), () => ({description:"Image", accept:{"image/png":[".png"], "image/jpeg":[".jpg", ".jpeg"], "image/gif":[".gif"]}}), () => ({description:"Document", accept:{"application/pdf":[".pdf"]}}), () => ra, () => ua], h = [];
      if (Array.isArray(e)) {
        for (const k of e) {
          k >= 0 && k < g.length && h.push(g[k]());
        }
      }
      [e] = await window.showOpenFilePicker(h.length ? {types:h} : {});
      return (await e.getFile()).text();
    };
  }
  if (b === 1032) {
    return () => Zb(a, c, d);
  }
  if (b === 1033) {
    return e => {
      if (e) {
        var g = a.view.getInt32(e + 0, !0);
        if (g && (e = (e = a.view.getInt32(e + 4, !0)) ? a.Ha.decode(a.g.subarray(e, e + 36)) : null)) {
          var h = Dc[e];
          h && h(new zc(a, g), e);
        }
      }
    };
  }
}
function Mc(a) {
  let b;
  return (new Promise((c, d) => {
    b = a.D();
    a.I[b] = [c, d];
    a.Ib(b, 0, 0, 0, 0, 0);
  })).finally(() => {
    delete a.I[b];
    a.ba(b);
  });
}
class Nc extends Jc {
  constructor() {
    super();
    this.ad.push(() => this.D = Gc(this, "c03"), () => this.ba = Gc(this, "c04"), () => this.Ib = Gc(this, "c05"), () => this.O = Gc(this, "c06"), () => this.Da = Gc(this, "c07"), () => this.Ga = Gc(this, "c08"), () => this.Ce = Gc(this, "c09"));
    this.ff = 0;
    this.V = null;
    this.Lf = 0;
    this.I = [];
    this.Ha = new TextDecoder();
    this.H = new TextEncoder();
    this.o = (a, b) => {
      a = this.H.encode(a);
      a.length >= b.cap && (this.j(b.J), b.cap = a.length + 1, b.J = this.h(b.cap));
      this.g.set(a, b.J);
      this.view.setUint8(b.J + a.length, 0);
      return a.length;
    };
    this.i = (a, b) => this.Ha.decode(this.g.subarray(a, b));
    this.I[0] = window;
  }
  get Aa() {
    return {...this.$b, ...this.Nf};
  }
  get Nf() {
    return {j01:this.Of.bind(this), j02:this.Rf.bind(this), j03:this.Pf.bind(this), j04:this.ag.bind(this), j05:this.Zf.bind(this), j06:this.Vf.bind(this), j07:this.write.bind(this), j08:this.Tf.bind(this), j09:this.cg.bind(this), j10:this.Mf.bind(this), j11:this.Hf.bind(this)};
  }
  D() {
    throw Error("Not initialized");
  }
  ba() {
    throw Error("Not initialized");
  }
  O() {
    throw Error("Not initialized");
  }
  Ce() {
    throw Error("Not initialized");
  }
  Da() {
    throw Error("Not initialized");
  }
  Ga() {
    throw Error("Not initialized");
  }
  Of(a, b, c, d) {
    (a = Kc(this, a, b, c, d)) && delete a.lb[a.key];
  }
  Ib() {
    throw Error("Not initialized");
  }
  Rf(a, b, c, d) {
    (a = Kc(this, a, b, c, d)) && (a.lb[a.key] = {});
  }
  Pf(a, b, c, d) {
    (a = Kc(this, a, b, c, d)) && (a.lb[a.key] = []);
  }
  ag(a, b, c, d) {
    return Lc(this, a, b, c, d);
  }
  Zf(a, b, c, d) {
    return Lc(this, a, b, c, d);
  }
  Vf(a, b, c, d, f, e) {
    a = Lc(this, a, b, c, d);
    a = this.H.encode(a);
    b = 0;
    a.length >= e && (b = f = this.h(a.length + 1));
    this.g.set(a, f);
    this.g[f + a.length] = 0;
    return b;
  }
  Tf(a, b, c, d, f) {
    a = Lc(this, a, b, c, d);
    f && this.view.setInt32(f, a?.byteLength ?? 0, !0);
    if (!a) {
      return 0;
    }
    f = this.h(a.byteLength);
    this.g.set(new Uint8Array(a), f);
    return f;
  }
  write(a, b, c, d, f, e, g, h) {
    (a = Kc(this, a, b, c, d)) && (a.lb[a.key] = Lc(this, f, e, g, h));
  }
  cg(a, b, c, d, f, e, g, h, k, l, m, p, t) {
    a = Lc(this, a, b, c, d);
    f == 0 ? t = a() : (f = Lc(this, f, e, g, h), t = t && Array.isArray(f) ? a(...f) : a(f));
    (k = Kc(this, k, l, m, p)) && (k.lb[k.key] = t);
  }
  Mf(a, b, c, d, f, e, g, h, k, l, m, p, t, q, u, r, w, z, A) {
    const B = D => {
      const x = Kc(this, t, q, u, r);
      x && (x.lb[x.key] = D);
      this.O(w, 0);
    };
    (async() => {
      try {
        let x = !1, C = 0;
        z && (C = setTimeout(() => {
          x = !0;
          B("timeout");
        }, z));
        const K = Lc(this, a, b, c, d);
        let V;
        if (f == 0) {
          V = await K();
        } else {
          const W = Lc(this, f, e, g, h);
          V = A && Array.isArray(W) ? await K(...W) : await K(W);
        }
        if (!x) {
          z && clearTimeout(C);
          var D = Kc(this, k, l, m, p);
          D && (D.lb[D.key] = V);
          this.O(w, 1);
        }
      } catch (x) {
        B(x.name + ": " + x.message);
      }
    })();
  }
  Hf(a, b, c, d, f, e) {
    a = new (Lc(this, a, b, c, d))(...(f ? this.I[f] : []));
    e && (this.I[e] = a);
  }
}
;function Oc(a, b, c, d, f, e, g) {
  var h = Pc ||= {}, k = Qc ||= {}, l = Rc ||= {}, m = Sc ||= {}, p = Tc ||= {}, t = Uc ||= {}, q = Vc ||= {};
  const u = Wc ||= {};
  Xc ||= 1;
  switch(b) {
    case 1:
      a.clear(d.getFloat64(c, !0) | 0);
      break;
    case 2:
      a.clearColor(d.getFloat64(c, !0), d.getFloat64(c + 8, !0), d.getFloat64(c + 16, !0), d.getFloat64(c + 24, !0));
      break;
    case 3:
      a.viewport(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, d.getFloat64(c + 24, !0) | 0);
      break;
    case 4:
      a.enable(d.getFloat64(c, !0) | 0);
      break;
    case 5:
      a.disable(d.getFloat64(c, !0) | 0);
      break;
    case 6:
      a.blendFunc(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0);
      break;
    case 7:
      a.lineWidth(d.getFloat64(c, !0));
      break;
    case 8:
      a.depthFunc(d.getFloat64(c, !0) | 0);
      break;
    case 9:
      a.depthMask(!!d.getFloat64(c, !0));
      break;
    case 15:
      a.colorMask(!!d.getFloat64(c, !0), !!d.getFloat64(c + 8, !0), !!d.getFloat64(c + 16, !0), !!d.getFloat64(c + 24, !0));
      break;
    case 16:
      a.blendFuncSeparate(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, d.getFloat64(c + 24, !0) | 0);
      break;
    case 17:
      a.blendEquation(d.getFloat64(c, !0) | 0);
      break;
    case 18:
      a.cullFace(d.getFloat64(c, !0) | 0);
      break;
    case 19:
      a.frontFace(d.getFloat64(c, !0) | 0);
      break;
    case 27:
      a.scissor(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, d.getFloat64(c + 24, !0) | 0);
      break;
    case 28:
      a.stencilFunc(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0);
      break;
    case 29:
      a.stencilOp(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0);
      break;
    case 39:
      a.stencilMask(d.getFloat64(c, !0) | 0);
      break;
    case 49:
      a.pixelStorei(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0);
      break;
    case 10:
      return e = d.getFloat64(c, !0) | 0, c = g(d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0), d = a.createShader(e), a.shaderSource(d, c), a.compileShader(d), a.getShaderParameter(d, a.COMPILE_STATUS) || console.error("[egl] shader:", a.getShaderInfoLog(d)), a = Xc++, h[a] = d, a;
    case 11:
      return e = h[d.getFloat64(c, !0) | 0], d = h[d.getFloat64(c + 8, !0) | 0], c = a.createProgram(), a.attachShader(c, e), a.attachShader(c, d), a.linkProgram(c), a.getProgramParameter(c, a.LINK_STATUS) || console.error("[egl] link:", a.getProgramInfoLog(c)), a = Xc++, k[a] = c, a;
    case 12:
      a.useProgram(k[d.getFloat64(c, !0) | 0] || null);
      break;
    case 13:
      return e = k[d.getFloat64(c, !0) | 0], c = g(d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0), a.getAttribLocation(e, c);
    case 14:
      return e = k[d.getFloat64(c, !0) | 0], c = g(d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0), a = a.getUniformLocation(e, c), c = Xc++, p[c] = a, c;
    case 20:
      return a = a.createVertexArray(), c = Xc++, l[c] = a, c;
    case 21:
      a.bindVertexArray(d.getFloat64(c, !0) ? l[d.getFloat64(c, !0) | 0] : null);
      break;
    case 22:
      return a = a.createBuffer(), c = Xc++, m[c] = a, c;
    case 23:
      a.bindBuffer(d.getFloat64(c, !0) | 0, m[d.getFloat64(c + 8, !0) | 0] || null);
      break;
    case 24:
      a.bufferData(d.getFloat64(c, !0) | 0, f, d.getFloat64(c + 24, !0) | 0, (d.getFloat64(c + 8, !0) | 0) >> 2, (d.getFloat64(c + 16, !0) | 0) >> 2);
      break;
    case 38:
      a.bufferSubData(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, f, (d.getFloat64(c + 16, !0) | 0) >> 2, (d.getFloat64(c + 24, !0) | 0) >> 2);
      break;
    case 25:
      a.enableVertexAttribArray(d.getFloat64(c, !0) | 0);
      break;
    case 48:
      a.disableVertexAttribArray(d.getFloat64(c, !0) | 0);
      break;
    case 26:
      a.vertexAttribPointer(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, !!d.getFloat64(c + 24, !0), d.getFloat64(c + 32, !0) | 0, d.getFloat64(c + 40, !0) | 0);
      break;
    case 32:
      a.uniform1f(p[d.getFloat64(c, !0) | 0], d.getFloat64(c + 8, !0));
      break;
    case 33:
      a.uniform2f(p[d.getFloat64(c, !0) | 0], d.getFloat64(c + 8, !0), d.getFloat64(c + 16, !0));
      break;
    case 34:
      a.uniform3f(p[d.getFloat64(c, !0) | 0], d.getFloat64(c + 8, !0), d.getFloat64(c + 16, !0), d.getFloat64(c + 24, !0));
      break;
    case 35:
      a.uniform4f(p[d.getFloat64(c, !0) | 0], d.getFloat64(c + 8, !0), d.getFloat64(c + 16, !0), d.getFloat64(c + 24, !0), d.getFloat64(c + 32, !0));
      break;
    case 36:
      a.uniform1i(p[d.getFloat64(c, !0) | 0], d.getFloat64(c + 8, !0) | 0);
      break;
    case 30:
      a.uniformMatrix3fv(p[d.getFloat64(c, !0) | 0], !1, f, (d.getFloat64(c + 8, !0) | 0) >> 2, 9);
      break;
    case 37:
      a.uniformMatrix4fv(p[d.getFloat64(c, !0) | 0], !1, f, (d.getFloat64(c + 8, !0) | 0) >> 2, 16);
      break;
    case 31:
      a.uniform4fv(p[d.getFloat64(c, !0) | 0], f, (d.getFloat64(c + 8, !0) | 0) >> 2, 4);
      break;
    case 46:
      a.uniform1fv(p[d.getFloat64(c, !0) | 0], f, (d.getFloat64(c + 8, !0) | 0) >> 2, d.getFloat64(c + 16, !0) | 0);
      break;
    case 47:
      a.uniform2fv(p[d.getFloat64(c, !0) | 0], f, (d.getFloat64(c + 8, !0) | 0) >> 2, d.getFloat64(c + 16, !0) | 0);
      break;
    case 56:
      a.uniform3fv(p[d.getFloat64(c, !0) | 0], f, (d.getFloat64(c + 8, !0) | 0) >> 2, d.getFloat64(c + 16, !0) | 0);
      break;
    case 40:
      a.drawArrays(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0);
      break;
    case 41:
      a.drawElements(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, d.getFloat64(c + 24, !0) | 0);
      break;
    case 42:
      a.drawArraysInstanced(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, d.getFloat64(c + 24, !0) | 0);
      break;
    case 43:
      a.drawElementsInstanced(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, d.getFloat64(c + 24, !0) | 0, d.getFloat64(c + 32, !0) | 0);
      break;
    case 50:
      return a = a.createTexture(), c = Xc++, t[c] = a, c;
    case 51:
      a.bindTexture(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) ? t[d.getFloat64(c + 8, !0) | 0] : null);
      break;
    case 52:
      a.texParameteri(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0);
      break;
    case 53:
      h = d.getFloat64(c, !0) | 0;
      k = d.getFloat64(c + 8, !0) | 0;
      p = d.getFloat64(c + 16, !0) | 0;
      g = d.getFloat64(c + 24, !0) | 0;
      l = d.getFloat64(c + 32, !0) | 0;
      m = d.getFloat64(c + 40, !0) | 0;
      t = d.getFloat64(c + 48, !0) | 0;
      q = d.getFloat64(c + 56, !0) | 0;
      (c = d.getFloat64(c + 64, !0) | 0) ? a.texImage2D(h, k, p, g, l, m, t, q, e, c) : a.texImage2D(h, k, p, g, l, m, t, q, null);
      break;
    case 54:
      h = d.getFloat64(c, !0) | 0;
      k = d.getFloat64(c + 8, !0) | 0;
      p = d.getFloat64(c + 16, !0) | 0;
      g = d.getFloat64(c + 24, !0) | 0;
      l = d.getFloat64(c + 32, !0) | 0;
      m = d.getFloat64(c + 40, !0) | 0;
      t = d.getFloat64(c + 48, !0) | 0;
      q = d.getFloat64(c + 56, !0) | 0;
      c = d.getFloat64(c + 64, !0) | 0;
      a.texSubImage2D(h, k, p, g, l, m, t, q, e, c);
      break;
    case 55:
      a.activeTexture(d.getFloat64(c, !0) | 0);
      break;
    case 57:
      a.generateMipmap(d.getFloat64(c, !0) | 0);
      break;
    case 60:
      return a = a.createFramebuffer(), c = Xc++, q[c] = a, c;
    case 61:
      a.bindFramebuffer(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) ? q[d.getFloat64(c + 8, !0) | 0] : null);
      break;
    case 62:
      a.framebufferTexture2D(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, t[d.getFloat64(c + 24, !0) | 0], d.getFloat64(c + 32, !0) | 0);
      break;
    case 63:
      return a = a.createRenderbuffer(), c = Xc++, u[c] = a, c;
    case 64:
      a.bindRenderbuffer(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) ? u[d.getFloat64(c + 8, !0) | 0] : null);
      break;
    case 65:
      a.renderbufferStorage(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, d.getFloat64(c + 24, !0) | 0);
      break;
    case 66:
      a.framebufferRenderbuffer(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, u[d.getFloat64(c + 24, !0) | 0]);
      break;
    case 70:
      if (e = m[d.getFloat64(c, !0) | 0]) {
        a.deleteBuffer(e), delete m[d.getFloat64(c, !0) | 0];
      }
      break;
    case 71:
      if (e = l[d.getFloat64(c, !0) | 0]) {
        a.deleteVertexArray(e), delete l[d.getFloat64(c, !0) | 0];
      }
      break;
    case 72:
      if (e = t[d.getFloat64(c, !0) | 0]) {
        a.deleteTexture(e), delete t[d.getFloat64(c, !0) | 0];
      }
      break;
    case 73:
      if (e = k[d.getFloat64(c, !0) | 0]) {
        a.deleteProgram(e), delete k[d.getFloat64(c, !0) | 0];
      }
      break;
    case 74:
      if (e = h[d.getFloat64(c, !0) | 0]) {
        a.deleteShader(e), delete h[d.getFloat64(c, !0) | 0];
      }
      break;
    case 75:
      if (e = q[d.getFloat64(c, !0) | 0]) {
        a.deleteFramebuffer(e), delete q[d.getFloat64(c, !0) | 0];
      }
      break;
    case 76:
      if (e = u[d.getFloat64(c, !0) | 0]) {
        a.deleteRenderbuffer(e), delete u[d.getFloat64(c, !0) | 0];
      }
      break;
    default:
      console.warn("[egl] unknown cmd", b);
  }
  return 0;
}
var Pc, Qc, Rc, Sc, Tc, Uc, Vc, Wc, Xc;
function Yc(a, b, c) {
  a.g.I[a.i] = [b, ...c];
  a.g.Ga(a.j(), 4, a.i, a.h);
}
class Zc {
  constructor(a, b, c, d) {
    this.g = a;
    this.i = b;
    this.h = c;
    this.j = d;
  }
  create(a, b, c) {
    Yc(this, 0, [a, b, c || ""]);
    return this.g.I[this.h];
  }
  open(a, b) {
    Yc(this, 1, [a, b || null]);
    return this.g.I[this.h];
  }
  close(a) {
    Yc(this, 3, [a]);
  }
  read(a, b, c) {
    Yc(this, 4, [a, b, c]);
    return this.g.I[this.h];
  }
  info(a) {
    Yc(this, 12, [a]);
    return this.g.I[this.h];
  }
  clear(a, b, c) {
    Yc(this, 10, [a, b, c]);
  }
  resize(a, b, c) {
    Yc(this, 11, [a, b, c]);
  }
}
;class $c {
  M(a, b) {
    return a + b;
  }
}
class ad {
  M(a, b) {
    return a - b;
  }
}
class bd {
  M(a) {
    return a * 1.001;
  }
}
class cd {
  M(a, b) {
    return Math.sqrt(Math.abs(a)) + b;
  }
}
class dd {
  M(a, b) {
    return Math.sin(b) + a;
  }
}
class ed {
  M(a, b) {
    return a % 1000000 + b;
  }
}
function fd(a, b) {
  switch(a) {
    case 1:
      a = 0;
      for (var c = 0; c < b; c++) {
        a += c;
      }
      for (c = 0; c < b; c++) {
        a -= c;
      }
      for (c = 0; c < b; c++) {
        a *= 1.001;
      }
      for (c = 0; c < b; c++) {
        a = Math.sqrt(Math.abs(a)) + c;
      }
      for (c = 0; c < b; c++) {
        a = Math.sin(c) + a;
      }
      for (c = 0; c < b; c++) {
        a = a % 1000000 + c;
      }
      return a;
    case 2:
      a = 0;
      for (c = 0; c < 6; c++) {
        for (var d = 0; d < b; d++) {
          c === 0 ? a += d : c === 1 ? a -= d : c === 2 ? a *= 1.001 : c === 3 ? a = Math.sqrt(Math.abs(a)) + d : c === 4 ? a = Math.sin(d) + a : c === 5 && (a = a % 1000000 + d);
        }
      }
      return a;
    case 3:
      a = new $c();
      c = new ad();
      d = new bd();
      const f = new cd(), e = new dd(), g = new ed();
      let h = 0;
      for (let k = 0; k < b; k++) {
        h = a.M(h, k), h = c.M(h, k), h = d.M(h, k), h = f.M(h, k), h = e.M(h, k), h = g.M(h, k);
      }
      return h;
    default:
      return 0;
  }
}
;var gd = Ja({Ug:1, qh:2, Zg:3, sheet:4, kh:5, Jg:6});
function hd(a, b, c, d) {
  const f = a.h.view;
  f.setInt32(a.g, b, !0);
  f.setInt32(a.g + 4, c, !0);
  f.setInt32(a.g + 8, d, !0);
  a.h.Ga(a.i, 1, a.g, 0);
}
function id(a, b, c) {
  const d = a.h.view;
  d.setInt32(a.g, b, !0);
  d.setInt32(a.g + 4, c, !0);
  return a.h.Ga(a.i, 2, a.g, 0);
}
function jd(a, b, c, d, f) {
  const e = a.h.view;
  e.setInt32(a.g, b, !0);
  e.setInt32(a.g + 4, c, !0);
  for (b = 0; b < d.length; b++) {
    e.setInt32(a.g + 8 + b * 4, d[b], !0);
  }
  for (d = 0; d < f.length; d++) {
    e.setFloat64(a.g + 20 + d * 8, f[d], !0);
  }
  return a.h.Ga(a.i, 7, a.g, 0);
}
class kd {
  constructor(a, b) {
    this.h = a;
    this.i = b;
    this.g = a.h(36);
  }
}
;function ld(a) {
  a.width = a.h.width = a.h.offsetWidth;
  a.height = a.h.height = a.h.offsetHeight;
}
function md(a, b, c) {
  a.size = b;
  a.O = c;
  a.H = a.g.g;
  b && (a.C = a.g.g.subarray(c, c + a.size), b = new Uint8ClampedArray(a.C), a.ba = new ImageData(b, a.width, a.height));
}
function nd(a, b) {
  if (a.g.g != a.H || a.O !== b) {
    a.H = a.g.g, a.C = a.g.g.subarray(b, b + a.size);
  }
  a.ba.data.set(a.C);
  a.L.putImageData(a.ba, 0, 0);
}
function od(a, b, c, d, f, e, g) {
  (async() => {
    try {
      let h = new Uint8ClampedArray(a.g.g.subarray(b, b + c)), k = new ImageData(h, d, f);
      a.g.I[e] = await createImageBitmap(k);
      a.g.O(g, 1);
    } catch (h) {
      a.g.I[e] = h, a.g.O(g, 0);
    }
  })();
}
class pd {
  constructor(a, b, c, d) {
    this.g = a;
    this.i = c;
    this.R = d || 0;
    this.h = b;
    this.R === 2 ? this.V = b.getContext("webgl2", {alpha:!0, premultipliedAlpha:!1, antialias:!0, preserveDrawingBuffer:!0}) : this.L = Xa(b);
    this.O = this.size = 0;
    a = b.offsetWidth;
    c = b.offsetHeight;
    b.width = a;
    b.height = c;
    this.width = a;
    this.height = c;
    ld(this);
    const f = (e, g) => this.g.Ha.decode(this.g.g.subarray(e, e + g));
    this.Aa = [(e, g) => md(this, e, g), () => {
      window.requestAnimationFrame(this.D.bind(this));
    }, e => {
      (this.h ?? document.body).style.cursor = tb[e] ?? "default";
    }, e => nd(this, e), () => {
    }, (...e) => {
      var g = this.L, h = e[e.length - 1];
      e = e.slice(0, -1);
      var k = this.g.I;
      switch(h) {
        case 1:
          g.arc(e[0], e[1], e[2], e[3], e[4], e[5] ? !0 : !1);
          break;
        case 2:
          g.arcTo(e[0], e[1], e[2], e[3], e[4]);
          break;
        case 3:
          g.bezierCurveTo(e[0], e[1], e[2], e[3], e[4], e[5]);
          break;
        case 4:
          g.closePath();
          break;
        case 5:
          g.ellipse(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7] ? !0 : !1);
          break;
        case 6:
          g.lineTo(e[0], e[1]);
          break;
        case 7:
          g.moveTo(e[0], e[1]);
          break;
        case 8:
          g.quadraticCurveTo(e[0], e[1], e[2], e[3]);
          break;
        case 9:
          g.rect(e[0], e[1], e[2], e[3]);
          break;
        case 10:
          e.length > 4 ? g.roundRect(e[0], e[1], e[2], e[3], e.slice(4)) : g.roundRect(e[0], e[1], e[2], e[3]);
          break;
        case 12:
          g.clearRect(e[0], e[1], e[2], e[3]);
          break;
        case 13:
          g.fillRect(e[0], e[1], e[2], e[3]);
          break;
        case 14:
          g.strokeRect(e[0], e[1], e[2], e[3]);
          break;
        case 16:
          g.resetTransform();
          break;
        case 17:
          g.rotate(e[0]);
          break;
        case 18:
          g.scale(e[0], e[1]);
          break;
        case 19:
          g.setTransform(e[0], e[1], e[2], e[3], e[4], e[5]);
          break;
        case 20:
          g.transform(e[0], e[1], e[2], e[3], e[4], e[5]);
          break;
        case 21:
          g.translate(e[0], e[1]);
          break;
        case 22:
          g.beginPath();
          break;
        case 23:
          (e = Va(e[0])) ? g.clip(e) : g.clip();
          break;
        case 81:
          console.warn("play clip path");
          break;
        case 24:
          (e = Va(e[0])) ? g.fill(e) : g.fill();
          break;
        case 82:
          console.warn("play fill path");
          break;
        case 27:
          g.stroke();
          break;
        case 83:
          console.warn("play stroke path");
          break;
        case 28:
          g.lineCap = Ra(e[0]);
          break;
        case 29:
          g.lineDashOffset = e[0];
          break;
        case 30:
          g.lineJoin = Ua(e[0]);
          break;
        case 31:
          g.lineWidth = e[0];
          break;
        case 32:
          g.miterLimit = e[0];
          break;
        case 34:
          g.setLineDash(e);
          break;
        case 35:
          (h = k?.[e[0] | 0]) && h.width > 0 && h.height > 0 && g.drawImage(h, e[1], e[2]);
          break;
        case 38:
          console.warn("play putImageData");
          break;
        case 40:
          g.reset();
          break;
        case 41:
          g.restore();
          break;
        case 42:
          g.save();
          break;
        case 43:
          g.fillStyle = ab(e[0]);
          break;
        case 84:
          break;
        case 44:
          g.strokeStyle = ab(e[0]);
          break;
        case 85:
          console.warn("play strokeStyle2");
          break;
        case 50:
          g.globalAlpha = e[0];
          break;
        case 51:
          g.globalCompositeOperation = Na(e[0]);
          break;
        case 55:
          g.shadowBlur = e[0];
          break;
        case 56:
          g.shadowColor = ab(e[0]);
          break;
        case 57:
          g.shadowOffsetX = e[0];
          break;
        case 58:
          g.shadowOffsetY = e[0];
          break;
        case 49:
          console.warn("play filter");
          break;
        case 59:
          h = f(e[3], e[4]);
          e[2] ? g.fillText(h, e[0], e[1], e[2]) : g.fillText(h, e[0], e[1]);
          break;
        case 61:
          h = f(e[3], e[4]);
          e[2] ? g.strokeText(h, e[0], e[1], e[2]) : g.strokeText(h, e[0], e[1]);
          break;
        case 63:
          e = f(e[0], e[1]);
          g.font = e;
          g.font.replace(/["']/g, "") !== e.replace(/["']/g, "") && console.warn("n\u00e3o aceitou", e, "ficou", g.font);
          break;
        case 80:
          g.fillRect(0, 0, g.canvas.width, g.canvas.height);
          break;
        case 62:
          console.warn("play direction");
          break;
        case 64:
          console.warn("play fontKerning");
          break;
        case 65:
          console.warn("play fontStrech");
          break;
        case 66:
          console.warn("play fontVariantCaps");
          break;
        case 67:
          console.warn("play letterSpacing");
          break;
        case 68:
          console.warn("play textAlign");
          break;
        case 69:
          console.warn("play textBaseline");
          break;
        case 70:
          console.warn("play textRendering");
          break;
        case 71:
          console.warn("play wordSpacing");
          break;
        case 100:
          break;
        default:
          console.warn(e, "FALTA FAZER", Ka(h), h);
      }
    }, (e, g, h, k, l, m) => od(this, e, g, h, k, l, m), (e, g) => Oc(this.V, g, e, this.g.view, this.Ha, this.g.g, f)];
    this.oa = this.g.D();
    this.g.I[this.oa] = this.Aa;
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    b.style.pointerEvents !== "none" && (window.requestAnimationFrame(this.D.bind(this)), qd(this), rd(this));
  }
  resize() {
    ld(this);
    this.j = this.g.Da(100, this.i, this.width, this.height, this.R, this.oa);
    let a = this.g.view.getInt32(this.j, !0), b = this.g.view.getInt32(this.j + 4, !0);
    md(this, a, b);
  }
  get hb() {
    return !!this.g.view.getInt32(this.j + 8, !0);
  }
  get Ha() {
    this.o && this.o.buffer === this.g.buffer || (this.o = new Float32Array(this.g.buffer));
    return this.o;
  }
  D(a) {
    (a = this.g.Da(101, this.i, 0, 0, 0, a)) && nd(this, a);
    this.hb && window.requestAnimationFrame(this.D.bind(this));
  }
}
var qd = a => {
  function b(c) {
    let d = c.buttons ?? (c.button !== void 0 ? 1 << c.button : 0);
    c.ctrlKey && (d |= 256);
    c.shiftKey && (d |= 512);
    c.altKey && (d |= 1024);
    return d;
  }
  a.h.style.touchAction = "none";
  a.h.addEventListener("pointerdown", c => {
    a.h.setPointerCapture(c.pointerId);
    a.g.Da(0, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  a.h.addEventListener("pointerup", c => {
    a.g.Da(1, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  a.h.addEventListener("pointermove", c => {
    a.g.Da(2, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  a.h.addEventListener("pointerenter", c => {
    a.g.Da(4, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  a.h.addEventListener("pointerleave", c => {
    a.g.Da(5, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  a.h.addEventListener("wheel", c => {
    a.g.Da(3, a.i, c.offsetX, c.offsetY, b(c), c.deltaY);
  }, {passive:!0});
  a.h.addEventListener("contextmenu", c => {
    c.preventDefault();
    a.g.Da(6, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  document.addEventListener("keydown", c => {
    let d = 0;
    c.ctrlKey && (d |= 256);
    c.shiftKey && (d |= 512);
    c.altKey && (d |= 1024);
    c.metaKey && (d |= 2048);
    a.g.Da(103, a.i, 0, 0, c.keyCode | d, 0);
  });
}, sd = null, td = null, rd = a => {
  const b = a.g.D(), c = a.g.D(), d = a.g, f = d.view.getInt32(a.j + 12, !0);
  d.ff = f;
  const e = {}, g = k => {
    d.I[b] = [1, k];
    d.Ga(f, 1, b, c);
    return d.I[c];
  };
  e.new_uuid_class = () => g(1);
  e.new_uuid_fn = () => g(2);
  sd = () => String(g(3));
  td = () => String(g(4));
  e[gd(2)] = k => {
    d.I[b] = k;
    d.Ga(f, 2, b, c);
    return d.I[c];
  };
  e[gd(3)] = (k, l, m) => {
    d.I[b] = [k, l, m];
    d.Ga(f, 3, b, c);
    (l = d.I[c]) && l !== 0 && (k = l[0], l = new Uint8Array(d.g.slice(k, k + l[1])), l = URL.createObjectURL(new Blob([l], {type:"application/pdf"})), m = document.createElement("a"), m.href = l, m.download = "render.pdf", m.click(), URL.revokeObjectURL(l), d.j(k));
  };
  e[gd(6)] = (k, l, m, p, t) => {
    d.I[b] = [k, p || 0, t || 0];
    d.Ga(f, 6, b, c);
    d.Da(7, 0, l, m, 1, performance.now());
  };
  e.sheet = new Zc(d, b, c, () => f);
  e.testp = (k, l) => {
    d.I[b] = [l, k];
    const m = performance.now();
    d.Ga(f, 5, b, c);
    const p = performance.now(), t = d.I[c], q = performance.now(), u = fd(l, k);
    console.log(({1:"Linear", 2:"If-chain", 3:"Vtable"}[l] || "test_" + l) + "  rep=" + k + "  WASM=" + (p - m).toFixed(2) + "ms  JS=" + (performance.now() - q).toFixed(2) + "ms  chk_w=" + t + "  chk_j=" + u);
  };
  const h = d.view.getInt32(a.j + 16, !0);
  a.Ba = new kd(d, h);
  d.V = a.Ba;
  d.Lf = a.j;
  window.wasm_fn = e;
};
async function ud(a, b, c, d) {
  if (c) {
    var f = Xa(b), e = Xa(c);
    await (new na("stg.mandala")).init();
    c.width = b.width = b.offsetWidth;
    c.height = b.height = b.offsetHeight;
    await Mc(a);
    var g = 0;
    new pd(a, b, g++);
    new pd(a, c, g++);
    d && (c = new pd(a, d, g++, 2), window.glctx = c.V);
    window.ctx1 = f;
    window.canvas = b;
    window.ctx2 = e;
    window.mem = a.I;
  }
}
;const vd = {[1]:"cursor", [2]:"move", [3]:"click_set_data", [4]:"hover_prop", [5]:"temporal", [6]:"click_set_shared", [7]:"handle_uuid", [8]:"selection", [11]:"planilha_nav", [12]:"planilha_save", [13]:"resize", [14]:"click_feedback"};
class wd {
  constructor(a) {
    this.g = a;
  }
  arc(a, b, c, d, f, e) {
    M(this.g, 1, 1, E(a, b, c, d, f, e ? 1 : 0));
  }
  arcTo(a, b, c, d, f) {
    M(this.g, 1, 2, E(a, b, c, d, f));
  }
  bezierCurveTo(a, b, c, d, f, e) {
    M(this.g, 1, 3, E(a, b, c, d, f, e));
  }
  closePath() {
    M(this.g, 1, 4, []);
  }
  ellipse(a, b, c, d, f, e, g, h) {
    M(this.g, 1, 5, E(a, b, c, d, f, e, g, h ? 1 : 0));
  }
  lineTo(a, b) {
    M(this.g, 1, 6, E(a, b));
  }
  moveTo(a, b) {
    M(this.g, 1, 7, E(a, b));
  }
  quadraticCurveTo(a, b, c, d) {
    M(this.g, 1, 8, E(a, b, c, d));
  }
  rect(a, b, c, d) {
    M(this.g, 1, 9, E(a, b, c, d));
  }
  clearRect(a, b, c, d) {
    M(this.g, 1, 12, E(a, b, c, d));
  }
  fillRect(a, b, c, d) {
    M(this.g, 1, 13, E(a, b, c, d));
  }
  strokeRect(a, b, c, d) {
    M(this.g, 1, 14, E(a, b, c, d));
  }
  resetTransform() {
    M(this.g, 1, 16, []);
  }
  rotate(a) {
    M(this.g, 1, 17, E(a));
  }
  scale(a, b) {
    M(this.g, 1, 18, E(a, b));
  }
  setTransform(a, b, c, d, f, e) {
    M(this.g, 1, 19, E(a, b, c, d, f, e));
  }
  transform(a, b, c, d, f, e) {
    M(this.g, 1, 20, E(a, b, c, d, f, e));
  }
  translate(a, b) {
    M(this.g, 1, 21, E(a, b));
  }
  beginPath() {
    M(this.g, 1, 22, []);
  }
  clip(a, b) {
    M(this.g, 1, 23, [a, b]);
  }
  fill(a, b) {
    M(this.g, 1, 24, [a, b]);
  }
  stroke() {
    M(this.g, 1, 27, []);
  }
  reset() {
    M(this.g, 1, 40, []);
  }
  restore() {
    M(this.g, 1, 41, []);
  }
  save() {
    M(this.g, 1, 42, []);
  }
  mc() {
    M(this.g, 1, 80, []);
  }
  set fillStyle(a) {
    xd(this.g, 43, typeof a !== "string" ? a : bb($a(a)));
  }
  set strokeStyle(a) {
    xd(this.g, 44, typeof a !== "string" ? a : bb($a(a)));
  }
  set lineWidth(a) {
    xd(this.g, 31, a);
  }
  set lineCap(a) {
    xd(this.g, 28, a);
  }
  set lineJoin(a) {
    xd(this.g, 30, a);
  }
  set lineDashOffset(a) {
    xd(this.g, 29, a);
  }
  set miterLimit(a) {
    xd(this.g, 32, a);
  }
  set globalAlpha(a) {
    xd(this.g, 50, a);
  }
  set globalCompositeOperation(a) {
    xd(this.g, 51, a);
  }
  setLineDash(a) {
    M(this.g, 1, 34, [a ? a.slice() : []]);
  }
  set font(a) {
    xd(this.g, 63, a);
  }
  fillText(a, b, c, d) {
    M(this.g, 1, 59, E(a, b, c, d));
  }
  strokeText(a, b, c, d) {
    M(this.g, 1, 61, E(a, b, c, d));
  }
}
class yd {
  constructor(a) {
    this.h = a;
  }
  g(a, b, c) {
    return zd(this.h, 0, b !== void 0 ? E(a, b) : E(a), c);
  }
  ea(a, b) {
    return zd(this.h, 1, a !== void 0 ? E(a) : [], b);
  }
  O(a) {
    return zd(this.h, 2, E(a));
  }
  add(a, b) {
    return N(this.h, 3, E(a, b));
  }
  sub(a, b) {
    return N(this.h, 4, E(a, b));
  }
  i(a, b) {
    return N(this.h, 5, E(a, b));
  }
  j(a, b) {
    return N(this.h, 6, E(a, b));
  }
  H(a, b) {
    return N(this.h, 7, E(a, b));
  }
  sin(a) {
    return N(this.h, 8, E(a));
  }
  cos(a) {
    return N(this.h, 9, E(a));
  }
  C(a) {
    return zd(this.h, 10, E(a));
  }
  set(a, b) {
    M(this.h, 2, 11, E(a, b));
  }
  D(a, b, c, d) {
    M(this.h, 2, 12, E(a, b, c, d));
  }
  o(a, b) {
    M(this.h, 2, 13, E(a, b));
  }
}
class Ad {
  constructor(a) {
    this.g = a;
  }
  Y(a, b, c) {
    M(this.g, 3, 0, E(a, b, c));
  }
  h(a) {
    M(this.g, 3, 1, E(a));
  }
  Sa(a, b, c) {
    M(this.g, 3, 2, E(a, b, c));
  }
  sa() {
    M(this.g, 3, 3, []);
  }
  X() {
    M(this.g, 3, 4, []);
  }
  Kc(a, b, c) {
    const d = O(this.g);
    this.g.g.push(new F(3, -1, 5, E(a, b, c), d));
    return y(d);
  }
  Ic() {
    M(this.g, 3, 6, []);
  }
  Bc() {
    M(this.g, 3, 7, []);
  }
  Fc() {
    M(this.g, 3, 8, []);
  }
}
function Bd(a, b, c) {
  const d = O(a.g);
  a.g.g.push(new F(a.h, -1, b, c, d));
  return y(d);
}
class Cd {
  constructor(a, b) {
    this.g = a;
    this.h = b;
  }
  ea(a) {
    return Bd(this, 1, E(a !== void 0 ? a : 0));
  }
  vf(a) {
    return Bd(this, 2, E(a));
  }
  Gf(a, b) {
    M(this.g, this.h, 3, E(a, b));
  }
  Bf(a) {
    return Bd(this, 4, E(a));
  }
  Cf(a, b) {
    M(this.g, this.h, 5, E(a, b));
  }
  cf(a, b) {
    return Bd(this, 6, E(a, b));
  }
  Af(a, b, c) {
    M(this.g, this.h, 7, E(a, b, c));
  }
  rc(a) {
    return Bd(this, 19, E(a));
  }
  Re(a, b, c) {
    return Bd(this, 8, E(a, b, c));
  }
  Y(a, b, c) {
    M(this.g, this.h, 9, E(a, b, c));
  }
  Sa(a, b, c) {
    M(this.g, this.h, 10, E(a, b, c));
  }
  sa() {
    M(this.g, this.h, 11, []);
  }
  X() {
    M(this.g, this.h, 12, []);
  }
  Kc(a, b, c) {
    return Bd(this, 13, E(a, b, c));
  }
  Ic() {
    M(this.g, this.h, 14, []);
  }
  Bc() {
    M(this.g, this.h, 15, []);
  }
  Fc() {
    M(this.g, this.h, 16, []);
  }
  Ye() {
    M(this.g, this.h, 17, []);
  }
  he(a, b) {
    M(this.g, this.h, 18, b !== void 0 ? E(a, b) : E(a));
  }
}
class Dd extends Cd {
  constructor(a) {
    super(a, 4);
  }
  Sc(a) {
    return Bd(this, 22, E(a));
  }
  tc() {
    M(this.g, this.h, 23, []);
  }
  We() {
    M(this.g, this.h, 24, []);
  }
}
class Ed extends Cd {
  constructor(a) {
    super(a, 7);
  }
  ef(a) {
    M(this.g, this.h, 0, E(a));
  }
  xf() {
    return Bd(this, 20, []);
  }
  wf(a, b) {
    return Bd(this, 21, E(a, b));
  }
}
class Fd {
  constructor(a, b) {
    this.g = a;
    this.ha = b;
    this.h = void 0;
  }
  get ref() {
    if (this.h === void 0) {
      const a = O(this.g);
      this.g.g.push(new F(6, this.ha, 12, [], a));
      this.h = y(a);
    }
    return this.h;
  }
  create() {
    P(this.g, this.ha, 0, []);
  }
  get(a, b) {
    const c = O(this.g);
    this.g.g.push(new F(6, this.ha, 1, E(a, b ?? 0), c));
    return y(c);
  }
  Md(a, b, c) {
    const d = O(this.g);
    this.g.g.push(new F(6, this.ha, 14, E(a, b, c ?? 0), d));
    return y(d);
  }
  set(a, b) {
    P(this.g, this.ha, 2, E(a, b));
  }
  yf(a, b) {
    P(this.g, this.ha, 3, [a, new fc(b.ha)]);
    return this;
  }
  Ac(a, b) {
    P(this.g, this.ha, 5, [a, new fc(b.ha)]);
    return this;
  }
}
class Gd {
  constructor(a) {
    this.g = a;
  }
  h() {
    const a = O(this.g);
    this.g.g.push(new F(5, -1, 0, [], a));
    return new Fd(this.g, a);
  }
}
class Hd {
  constructor(a, b) {
    this.g = a;
    this.ha = b;
  }
  P(a, b) {
    P(this.g, this.ha, 6, E(a, b));
    return this;
  }
}
class Id {
  constructor(a, b) {
    this.g = a;
    this.ha = b;
  }
  na(a, b) {
    P(this.g, this.ha, 7, E(a, b));
    return this;
  }
  gf(a, b) {
    P(this.g, this.ha, 8, E(a, b));
  }
  P(a, b) {
    P(this.g, this.ha, 6, E(a, b));
    return this;
  }
  da(a) {
    const b = O(this.g);
    this.g.g.push(new F(6, this.ha, 9, E(a), b));
    return new Hd(this.g, b);
  }
  label(a) {
    const b = this.g.g;
    for (let c = b.length - 1; c >= 0; c--) {
      if (b[c].h === this.ha) {
        b[c].name = a;
        break;
      }
    }
    return this;
  }
}
class Jd {
  constructor(a, b) {
    this.g = a;
    this.ha = b;
  }
  Pa(a) {
    const b = O(this.g);
    this.g.g.push(new F(6, this.ha, 10, [new fc(a.ha)], b));
    return new Id(this.g, b);
  }
}
class Kd {
  constructor(a, b, c) {
    this.g = a;
    this.h = b;
    this.self = new Id(a, c);
  }
  end() {
    const a = O(this.g);
    this.g.g.push(new F(6, this.h, 11, [], a));
    return new Jd(this.g, a);
  }
}
;function Ld(a, b, c, d) {
  switch(b) {
    case 0:
      return c.length > 1 ? a.g(c[0], c[1], d) : a.g(c[0], void 0, d);
    case 1:
      return c.length ? a.ea(c[0], d) : a.ea(void 0, d);
    case 2:
      return a.O(c[0]);
    case 3:
      return a.add(c[0], c[1]);
    case 4:
      return a.sub(c[0], c[1]);
    case 5:
      return a.i(c[0], c[1]);
    case 6:
      return a.j(c[0], c[1]);
    case 7:
      return a.H(c[0], c[1]);
    case 8:
      return a.sin(c[0]);
    case 9:
      return a.cos(c[0]);
    case 10:
      return a.C(c[0]);
    case 11:
      a.set(c[0], c[1]);
      break;
    case 12:
      a.D(c[0], c[1], c[2], c[3]);
      break;
    case 13:
      a.o(c[0], c[1]);
  }
  return 0;
}
function Md(a, b, c) {
  switch(b) {
    case 0:
      a.ef(c[0]);
      break;
    case 1:
      return a.ea(c[0]);
    case 2:
      return a.vf(c[0]);
    case 3:
      a.Gf(c[0], c[1]);
      break;
    case 4:
      return a.Bf(c[0]);
    case 5:
      a.Cf(c[0], c[1]);
      break;
    case 6:
      return a.cf(c[0], c[1]);
    case 7:
      a.Af(c[0], c[1], c[2]);
      break;
    case 8:
      return a.Re(c[0], c[1], c[2]);
    case 9:
      a.Y(c[0], c[1], c[2]);
      break;
    case 10:
      a.Sa(c[0], c[1], c[2]);
      break;
    case 11:
      a.sa();
      break;
    case 12:
      a.X();
      break;
    case 13:
      return a.Kc(c[0], c[1], c[2]);
    case 14:
      a.Ic();
      break;
    case 15:
      a.Bc();
      break;
    case 16:
      a.Fc();
      break;
    case 17:
      a.Ye();
      break;
    case 18:
      c.length > 1 ? a.he(c[0], c[1]) : a.he(c[0]);
      break;
    case 19:
      return a.rc(c[0]);
    case 20:
      return a.xf();
    case 21:
      return a.wf(c[0], c[1]);
    case 22:
      return a.Sc(c[0]);
    case 23:
      a.tc();
      break;
    case 24:
      a.We();
  }
  return 0;
}
function Nd(a, b, c) {
  switch(b) {
    case 0:
      a.create();
      break;
    case 1:
      return a.get(c[0], c[1]);
    case 2:
      a.set(c[0], c[1]);
      break;
    case 14:
      return a.Md(c[0], c[1], c[2]);
    case 3:
      return a.yf(c[0], c[1]);
    case 5:
      return a.Ac(c[0], c[1]);
    case 6:
      a.P(c[0], c[1]);
      break;
    case 7:
      a.na(c[0], c[1]);
      break;
    case 8:
      a.gf(c[0], c[1]);
      break;
    case 9:
      return a.da(c[0]);
    case 10:
      return a.Pa(c[0]);
    case 11:
      return a.end();
    case 12:
      return a.ref;
    case 13:
      return a[c[0]];
  }
}
;function Od(a, b, c, d) {
  const f = [null];
  f.length = a.length;
  for (let e = 0; e < a.length; e++) {
    const g = a[e];
    if (g instanceof fc) {
      f[e] = c[g.Oa];
      continue;
    }
    if (Array.isArray(g)) {
      f[e] = Od(g, b, c, d);
      continue;
    }
    const h = ec(g);
    f[e] = h > 0 ? d[h] : g;
  }
  return f;
}
function M(a, b, c, d) {
  a.g.push(new F(b, -1, c, d, -1));
}
function xd(a, b, c) {
  b = new F(1, -1, b, E(c), -1);
  b.set = !0;
  a.g.push(b);
}
function zd(a, b, c, d) {
  const f = O(a);
  b = new F(2, -1, b, c, f);
  d && (b.name = d, a.h.set(d, y(f)));
  a.g.push(b);
  return y(f);
}
function N(a, b, c) {
  const d = 8192 + a.j++;
  a.g.push(new F(2, -1, b, c, d));
  return y(d);
}
function O(a) {
  return a.i++;
}
function P(a, b, c, d) {
  a.g.push(new F(6, b, c, d, -1));
}
class Pd {
  constructor() {
    this.K = [];
    this.i = 1;
    this.j = 0;
    this.h = new Map();
    this.g = this.K;
    this.C = new wd(this);
    this.o = new yd(this);
    this.H = new Ad(this);
    this.D = new Dd(this);
    this.O = new Ed(this);
    this.R = new Gd(this);
  }
  get L() {
    return this.C;
  }
  get M() {
    return this.o;
  }
  get xa() {
    return this.H;
  }
  get state() {
    return this.R;
  }
  get Ab() {
    return this.D;
  }
  get action() {
    return this.O;
  }
  segment(a) {
    M(this, 0, 3, E(a));
  }
  fb(a) {
    M(this, 0, 4, E(a));
  }
  Pb() {
    M(this, 0, 5, []);
  }
  lc() {
    M(this, 0, 6, []);
  }
  ec() {
    M(this, 0, 12, []);
  }
  Mb(a) {
    const b = this.g;
    for (let c = b.length - 1; c >= 0; c--) {
      const d = b[c];
      if (d.g === 0 && (d.m === 0 || d.m === 1)) {
        d.name = a || "";
        break;
      }
    }
  }
  qb() {
    M(this, 0, 7, []);
  }
  pb() {
    M(this, 0, 8, []);
  }
  Za(a, b) {
    M(this, 0, 11, [a, b]);
  }
  nb(a, b, c, d, f, e) {
    M(this, 0, 13, E(a, b, c, d, f, e));
  }
  ve(a) {
    this.g.push(new F(0, a !== void 0 ? a : -1, 10, [], -1));
  }
}
class Qd {
  constructor() {
    this.g = new Pd();
  }
  get K() {
    return this.g.K;
  }
  get state() {
    return this.g.state;
  }
  Ma(a) {
    var b = this.g, c = this.g;
    const d = O(c), f = O(c);
    a = new F(0, -1, 0, [a], d);
    a.o = 1;
    a.j = f;
    c.g.push(a);
    return new Ac(b, new Kd(c, d, f));
  }
  Ra(a) {
    var b = this.g, c = this.g;
    const d = O(c), f = O(c);
    a = new F(0, -1, 1, a !== void 0 ? [a] : [], d);
    a.o = 1;
    a.j = f;
    c.g.push(a);
    return new Ac(b, new Kd(c, d, f));
  }
  Mb(a) {
    this.g.Mb(a);
  }
  root() {
    var a = this.g;
    const b = O(a);
    a.g.push(new F(0, -1, 2, [], b));
    return new Id(a, b);
  }
  Uc(a, b, c, d) {
    var f = this.g;
    const e = O(f), g = O(f);
    b = new F(0, -1, 9, [a, b, c, d || ""], e);
    b.o = 2;
    b.j = g;
    f.g.push(b);
    b = [];
    for (c = 0; c < a; c++) {
      d = O(f), f.g.push(new F(6, g, 13, [c], d)), b.push(y(d));
    }
    return new Bc(this.g, new fc(e), b);
  }
}
;const Rd = {dh:1, fh:2, eh:3, nh:4, gh:5, Vg:6, Wg:7, Ng:8, Ig:9, Pg:11, oh:100, ah:101};
function Sd(a, b) {
  return a.h.view.getFloat64(a.g + b * 8, !0);
}
class Td {
  constructor(a) {
    this.h = a;
    this.g = 0;
  }
  x() {
    return Sd(this, 1);
  }
  y() {
    return Sd(this, 2);
  }
  buttons() {
    return Sd(this, 3) | 0;
  }
  id() {
    return Sd(this, 4) | 0;
  }
}
class Ud {
  constructor(a) {
    this.h = a;
    this.g = 0;
  }
  id() {
    return this.h.view.getFloat64(this.g, !0) | 0;
  }
  J() {
    return this.h.view.getFloat64(this.g + 8, !0) | 0;
  }
}
function Vd(a, b, c) {
  const d = a.V, f = a.D(), e = [], g = new Td(a), h = new Ud(a);
  let k = null;
  if (c.Tb) {
    const l = c.Tb;
    e[0] = m => {
      try {
        k ||= new db(a, m, 0, 0), k.o = m, l(k);
      } catch (p) {
        console.error("editorHook onRender:", p);
      }
    };
  }
  if (c.Rb) {
    const l = c.Rb;
    e[1] = m => {
      try {
        g.g = m, l(g) && g.h.view.setFloat64(g.g + 40, 1.0, !0);
      } catch (p) {
        console.error("editorHook onEvent:", p);
      }
    };
  }
  if (c.Sb) {
    const l = c.Sb;
    e[2] = m => {
      try {
        g.g = m, l(g) && g.h.view.setFloat64(g.g + 40, 1.0, !0);
      } catch (p) {
        console.error("editorHook onKeep:", p);
      }
    };
  }
  if (c.Fb) {
    const l = c.Fb;
    e[4] = (m, p) => {
      try {
        l(m, p);
      } catch (t) {
        console.error("editorHook onSetData:", t);
      }
    };
  }
  if (c.Eb) {
    const l = c.Eb;
    e[7] = m => {
      try {
        h.g = m, l(h);
      } catch (p) {
        console.error("editorHook onFeedback:", p);
      }
    };
  }
  a.I[f] = e;
  hd(d, b, 15, f);
  return {slot:f, unregister() {
    hd(d, b, 16, f);
    a.I[f] = 0;
    k && (k.D(), k = null);
  }};
}
;class Wd {
  constructor(a, b) {
    this.g = a;
    this.ya = b.ya;
    this.depth = b.depth;
    this.uuid = b.uuid || "";
    this.ja = b.ja;
    this.xb = b.xb;
    this.Zb = b.Zb;
    this.B = b.B;
    this.yb = b.yb;
    this.Gb = b.Gb;
    this.i = this.C();
    this.F = this.o();
  }
  C() {
    throw Error("TreeNode._makeInst is abstract");
  }
  o() {
    throw Error("TreeNode._makeDef is abstract");
  }
  j() {
  }
  h() {
    return 0;
  }
  D() {
  }
}
function Xd(a) {
  return a.i(Yd(a.h));
}
class Zd {
  D() {
    return [];
  }
  i(a) {
    return new Wd(this, {ya:0, depth:0, ja:0, xb:0, Zb:0, B:a, yb:0, Gb:0});
  }
  refresh() {
  }
  Ib() {
  }
  o() {
  }
  wc(a) {
    return a.map(b => new Wd(this, b));
  }
}
;function $d(a) {
  const b = new Map();
  for (let c = 0; c < a.length; c++) {
    a[c].h >= 0 && b.set(a[c].h, c);
  }
  return b;
}
function ae(a, b) {
  for (let d = 0; d < a.length; d++) {
    var c = a[d];
    if (Array.isArray(c)) {
      ae(c, b);
      continue;
    }
    c = ec(c);
    c > 0 && b.push(c);
  }
}
function be(a) {
  const b = [];
  ae(a.a, b);
  return b;
}
function ce(a, b, c, d, f) {
  b = be(a[b]);
  for (let g = 0; g < b.length; g++) {
    var e = b[g];
    if (!(e >= 8192)) {
      continue;
    }
    e = c.get(e);
    e === void 0 || d.has(e) || (d.add(e), ce(a, e, c, d, f), f.push(e));
  }
}
function de(a, b, c) {
  c ||= $d(a);
  const d = [];
  ce(a, b, c, new Set(), d);
  return d;
}
function ee(a, b, c) {
  if (b !== c) {
    var d = de(a, b), f = new Set(d);
    f.add(b);
    var e = [];
    for (let g = 0; g < d.length; g++) {
      e.push(a[d[g]]);
    }
    e.push(a[b]);
    b = Array.from(f);
    b.sort((g, h) => h - g);
    for (d = 0; d < b.length; d++) {
      a.splice(b[d], 1);
    }
    d = c;
    for (f = 0; f < b.length; f++) {
      b[f] < c && d--;
    }
    for (c = 0; c < e.length; c++) {
      a.splice(d + c, 0, e[c]);
    }
  }
}
;function fe(a) {
  switch(a) {
    case "-":
      return 3;
    case "*":
      return 4;
    case "/":
      return 5;
    case "%":
      return 6;
  }
  return 2;
}
function ge(a) {
  const b = [];
  let c = 0;
  const d = a.length;
  for (; c < d;) {
    var f = a[c];
    if (f === " " || f === "\t" || f === "\r" || f === "\n") {
      c++;
    } else {
      if (f >= "0" && f <= "9" || f === ".") {
        var e = c;
        f = f === ".";
        for (c++; c < d;) {
          const g = a[c];
          if (g >= "0" && g <= "9") {
            c++;
          } else if (g !== "." || f) {
            break;
          } else {
            f = !0, c++;
          }
        }
        e = a.substring(e, c);
        f = parseFloat(e);
        if (isNaN(f)) {
          return "Invalid number: " + e;
        }
        b.push({t:0, $:f});
      } else {
        if (f >= "a" && f <= "z" || f >= "A" && f <= "Z" || f === "_") {
          e = c;
          for (c++; c < d;) {
            if (f = a[c], f >= "a" && f <= "z" || f >= "A" && f <= "Z" || f >= "0" && f <= "9" || f === "_") {
              c++;
            } else {
              break;
            }
          }
          b.push({t:1, $:a.substring(e, c)});
        } else {
          if (f === "+" || f === "-" || f === "*" || f === "/" || f === "%") {
            b.push({t:2, $:f}), c++;
          } else {
            if (f === "(") {
              b.push({t:3, $:"("}), c++;
            } else {
              if (f === ")") {
                b.push({t:4, $:")"}), c++;
              } else {
                return "Unexpected character: " + f;
              }
            }
          }
        }
      }
    }
  }
  b.push({t:5, $:null});
  return b;
}
function he(a) {
  function b() {
    return a[k];
  }
  function c() {
    return a[k++];
  }
  function d() {
    let m = f();
    if (typeof m === "string") {
      return m;
    }
    for (; b().t === 2 && (b().$ === "+" || b().$ === "-");) {
      const p = fe(c().$), t = f();
      if (typeof t === "string") {
        return t;
      }
      m = {mb:p, Db:m, r:t};
    }
    return m;
  }
  function f() {
    let m = e();
    if (typeof m === "string") {
      return m;
    }
    for (; b().t === 2 && (b().$ === "*" || b().$ === "/" || b().$ === "%");) {
      const p = fe(c().$), t = e();
      if (typeof t === "string") {
        return t;
      }
      m = {mb:p, Db:m, r:t};
    }
    return m;
  }
  function e() {
    if (b().t === 2 && b().$ === "-") {
      c();
      const m = e();
      return typeof m === "string" ? m : m.mb === 0 ? {mb:0, $:-m.$} : {mb:7, a:m};
    }
    return g();
  }
  function g() {
    if (b().t === 1 && (b().$ === "sin" || b().$ === "cos")) {
      const m = c().$;
      if (b().t !== 3) {
        return "Expected ( after " + m;
      }
      c();
      const p = d();
      if (typeof p === "string") {
        return p;
      }
      if (b().t !== 4) {
        return "Expected ) after " + m + " argument";
      }
      c();
      return {mb:m === "sin" ? 8 : 9, a:p};
    }
    return h();
  }
  function h() {
    var m = b();
    if (m.t === 0) {
      return c(), {mb:0, $:m.$};
    }
    if (m.t === 1) {
      return c(), {mb:1, name:m.$};
    }
    if (m.t === 3) {
      c();
      m = d();
      if (typeof m === "string") {
        return m;
      }
      if (b().t !== 4) {
        return "Expected )";
      }
      c();
      return m;
    }
    return "Unexpected token: " + (m.$ !== null ? m.$ : "end of expression");
  }
  let k = 0;
  const l = d();
  return typeof l === "string" ? l : b().t !== 5 ? "Unexpected token after expression: " + b().$ : l;
}
function ie(a, b) {
  a.mb === 1 ? b.add(a.name) : (a.Db && ie(a.Db, b), a.r && ie(a.r, b), a.a && ie(a.a, b));
}
function Q(a, b, c) {
  switch(a.mb) {
    case 0:
      return a.$;
    case 1:
      return c.get(a.name);
    case 2:
      return b.add(Q(a.Db, b, c), Q(a.r, b, c));
    case 3:
      return b.sub(Q(a.Db, b, c), Q(a.r, b, c));
    case 4:
      return b.i(Q(a.Db, b, c), Q(a.r, b, c));
    case 5:
      return b.j(Q(a.Db, b, c), Q(a.r, b, c));
    case 6:
      return b.H(Q(a.Db, b, c), Q(a.r, b, c));
    case 7:
      return b.sub(0, Q(a.a, b, c));
    case 8:
      return b.sin(Q(a.a, b, c));
    case 9:
      return b.cos(Q(a.a, b, c));
  }
  return 0;
}
function je(a, b) {
  b = ge(b);
  if (typeof b === "string") {
    return {error:b};
  }
  b = he(b);
  if (typeof b === "string") {
    return {error:b};
  }
  const c = new Set();
  ie(b, c);
  const d = new Map(), f = [];
  c.forEach(function(e) {
    const g = a.g.h.get(e);
    g !== void 0 ? d.set(e, g) : f.push(e);
  });
  return f.length > 0 ? {error:"Unknown variable" + (f.length > 1 ? "s" : "") + ": " + f.join(", ")} : {value:Q(b, a.g.M, d)};
}
;const ke = {[0]:"epar", [1]:"alloc", [2]:"alloc_array", [3]:"add", [4]:"sub", [5]:"mul", [6]:"div", [7]:"mod", [8]:"sin", [9]:"cos", [10]:"keep", [11]:"set", [12]:"comp", [13]:"print"}, le = {[0]:"if_comp", [1]:"if_bool", [2]:"else_if_comp", [3]:"else", [4]:"end_if", [5]:"for", [6]:"end_for", [7]:"break", [8]:"continue"}, me = {[0]:"declare"}, ne = {[0]:"define_gralm", [1]:"define_gralm_internal", [2]:"root", [3]:"segment", [4]:"targetLayer", [5]:"hit_area", [6]:"latch_matrix", [12]:"disable_next", 
[7]:"scope_push", [8]:"scope_pop", [9]:"record_func_begin", [10]:"record_func_end", [11]:"call_func", [13]:"plot_svg"}, oe = {[0]:"create", [1]:"get", [2]:"set", [14]:"peer_data", [3]:"register_peer", [5]:"bind_peer", [6]:"init_data", [7]:"init_edata", [8]:"init_edata_text", [9]:"add_coded_event", [10]:"new_instance", [11]:"end", [12]:"read_ref", [13]:"read_param"}, pe = {[0]:"handler", [1]:"alloc", [2]:"read_data", [3]:"write_data", [4]:"state_get", [5]:"state_set", [6]:"get_peer", [7]:"set_peer", 
[8]:"calc_op", [9]:"if_comp", [10]:"else_if_comp", [11]:"else_", [12]:"end_if", [13]:"for_", [14]:"end_for", [15]:"break_", [16]:"continue_", [17]:"dirty", [18]:"call_native", [19]:"read_box", [20]:"read_value", [21]:"read_par", [22]:"read_event", [23]:"skip", [24]:"consume"}, qe = a => pe[a], re = "rec ctx calc flow evt state slot action".split(" "), se = [a => ne[a]];
se[1] = Ka;
se[2] = a => ke[a];
se[3] = a => le[a];
se[4] = qe;
se[5] = a => me[a];
se[6] = a => oe[a];
se[7] = qe;
const te = [32, 1, 2, 4, 8, 16, 64, 256];
function ue(a, b) {
  const c = te[a.g];
  return !(c && b & c) || a.g === 0 && a.m === 12 || ac(a) ? !1 : a.h >= 8192 ? (b & 128) !== 0 : !0;
}
function ve(a, b, c, d) {
  if (a < 8192) {
    return c.get(a) || "[hid " + a + "]";
  }
  var f = d.get(a);
  if (f === void 0) {
    return "[hid " + a + "]";
  }
  f = b[f];
  switch(f.m) {
    case 3:
      return "(" + we(f.a[0], b, c, d) + " + " + we(f.a[1], b, c, d) + ")";
    case 4:
      return a = f.a[0], typeof a !== "number" || Number.isNaN(a) || a !== 0 ? "(" + we(a, b, c, d) + " - " + we(f.a[1], b, c, d) + ")" : "-(" + we(f.a[1], b, c, d) + ")";
    case 5:
      return "(" + we(f.a[0], b, c, d) + " * " + we(f.a[1], b, c, d) + ")";
    case 6:
      return "(" + we(f.a[0], b, c, d) + " / " + we(f.a[1], b, c, d) + ")";
    case 7:
      return "(" + we(f.a[0], b, c, d) + " % " + we(f.a[1], b, c, d) + ")";
    case 8:
      return "sin(" + we(f.a[0], b, c, d) + ")";
    case 9:
      return "cos(" + we(f.a[0], b, c, d) + ")";
  }
  return "[temp " + a + "]";
}
function we(a, b, c, d) {
  if (typeof a !== "number") {
    return String(a);
  }
  const f = ec(a);
  return f <= 0 ? !isFinite(a) || Number.isInteger(a) ? String(a) : a.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") : ve(f, b, c, d);
}
function xe(a, b, c, d) {
  b = ec(a[b].a[c]);
  if (b <= 0 || b < 8192) {
    return [];
  }
  b = d.get(b);
  if (b === void 0) {
    return [];
  }
  c = [];
  ye(a, b, d, new Set(), c);
  c.push(b);
  return c;
}
function ye(a, b, c, d, f) {
  b = be(a[b]);
  for (let g = 0; g < b.length; g++) {
    var e = b[g];
    if (e < 8192) {
      continue;
    }
    e = c.get(e);
    e === void 0 || d.has(e) || (d.add(e), ye(a, e, c, d, f), f.push(e));
  }
}
function ze(a, b, c) {
  if (b.length === 0) {
    return [];
  }
  var d = new Set();
  for (var f = 0; f < b.length; f++) {
    var e = a[b[f]].h;
    e >= 0 && d.add(e);
  }
  e = new Set(b);
  f = new Set();
  for (let g = 0; g < a.length; g++) {
    if (g === c || e.has(g)) {
      continue;
    }
    const h = be(a[g]);
    for (let k = 0; k < h.length; k++) {
      d.has(h[k]) && f.add(h[k]);
    }
  }
  c = [];
  for (d = 0; d < b.length; d++) {
    e = a[b[d]].h, e >= 0 && !f.has(e) && c.push(b[d]);
  }
  return c;
}
function Ae(a, b, c, d, f, e) {
  if (a instanceof fc) {
    a: {
      a = a.Oa;
      d = d.get(a);
      if (d !== void 0) {
        d = b[d];
        if (d.name) {
          b = d.name;
          break a;
        }
        if (d.g === 0 && (c = f.get(d.h))) {
          b = c;
          break a;
        }
        if (d.g === 6 && d.m === 10 && (e = e.get(a))) {
          b = e;
          break a;
        }
      }
      for (e = 0; e < b.length; e++) {
        if (b[e].j === a) {
          b = (b = f.get(b[e].h)) ? "self:" + b : "self:" + a;
          break a;
        }
      }
      b = "handle " + a;
    }
    return "[" + b + "]";
  }
  if (typeof a === "string") {
    return '"' + a + '"';
  }
  if (Array.isArray(a)) {
    const g = [];
    for (let h = 0; h < a.length; h++) {
      g.push(Ae(a[h], b, c, d, f, e));
    }
    return "[" + g.join(", ") + "]";
  }
  if (typeof a !== "number") {
    return String(a);
  }
  f = ec(a);
  return f <= 0 ? !isFinite(a) || Number.isInteger(a) ? String(a) : a.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") : f >= 8192 ? ve(f, b, c, d) : (b = c.get(f)) ? b : "[hid " + f + "]";
}
function Be(a) {
  const b = a.j, c = re[b.g] || "tgt" + b.g;
  var d = se[b.g];
  d = d ? d(b.m) : "m" + b.m;
  Ce(a.i);
  const f = a.i.g.K, e = a.i.C, g = a.i.i, h = a.i.j;
  a = a.i.o;
  if (b.set) {
    return c + "." + d + " = " + Ae(b.a[0], f, e, g, h, a);
  }
  const k = [];
  for (let l = 0; l < b.a.length; l++) {
    k.push(Ae(b.a[l], f, e, g, h, a));
  }
  return c + "." + d + "(" + k.join(", ") + ")";
}
class De {
  constructor(a, b, c, d, f) {
    this.j = a;
    this.R = b;
    this.i = c;
    this.D = d || null;
    this.O = f !== void 0 ? f : -1;
    this.C = this.o = null;
  }
  get cc() {
    return this.j;
  }
  get ie() {
    return this.R;
  }
  get g() {
    const a = this.j;
    return a.g === 1 ? a.m : -(a.g * 100 + a.m);
  }
  get V() {
    return this.j.a.length;
  }
  get name() {
    var a = this.j;
    const b = se[a.g];
    if (a.g === 1) {
      return b ? b(a.m) : "CMD_" + a.m;
    }
    const c = re[a.g] || "tgt" + a.g;
    a = b ? b(a.m) : "m" + a.m;
    return c + "." + a;
  }
  get depth() {
    return 0;
  }
  get h() {
    if (!this.o) {
      const a = this.j.a, b = [];
      for (let c = 0; c < a.length; c++) {
        b.push(typeof a[c] === "number" ? a[c] : 0);
      }
      this.o = b;
    }
    return this.o;
  }
  get H() {
    const a = this.i.g.K[this.R - 1];
    return a && a.g === 0 && a.m === 12 ? 1 : 0;
  }
  get ba() {
    if (!this.C) {
      const a = this.j.a, b = [];
      for (let c = 0; c < a.length; c++) {
        if (typeof a[c] === "number") {
          const d = ec(a[c]);
          b.push(d > 0 ? d : -1);
        } else {
          b.push(-1);
        }
      }
      this.C = b;
    }
    return this.C;
  }
  bind(a, b) {
    this.j.a[a] = y(b);
    this.C = this.o = null;
    this.i.h++;
  }
}
class Ee {
  constructor(a, b, c, d) {
    this.g = a;
    this.i = b;
    this.h = c;
    this.j = d;
    this.o = b.length;
  }
  get L() {
    return this.g.L;
  }
  get M() {
    return this.g.M;
  }
  get xa() {
    return this.g.xa;
  }
  get Ab() {
    return this.g.Ab;
  }
  get action() {
    return this.g.action;
  }
  get state() {
    return this.g.state;
  }
  segment(a) {
    this.g.segment(a);
  }
  fb(a) {
    this.g.fb(a);
  }
  Pb() {
    this.g.Pb();
  }
  lc() {
    this.g.lc();
  }
  ec() {
    this.g.ec();
  }
  qb() {
    this.g.qb();
  }
  pb() {
    this.g.pb();
  }
  Za(a, b) {
    this.g.Za(a, b);
  }
  end() {
    const a = this.i, b = a.splice(this.o);
    for (let c = 0; c < b.length; c++) {
      a.splice(this.j + c, 0, b[c]);
    }
    this.h.h += b.length;
    this.h.g.h++;
  }
}
function Fe(a, b, c, d) {
  var f;
  f === void 0 && (f = a.g.filter());
  f = Ge(a, f, b);
  if (f === -1) {
    return {error:"Invalid visible index"};
  }
  Ce(a.g);
  b = a.g.g.K;
  var e = xe(b, f, c, a.g.i), g = ze(b, e, f);
  e = b.length;
  d = je(a.g.g, d);
  if (d.error) {
    return d;
  }
  d = d.value;
  e = b.splice(e);
  g = g.slice();
  g.sort((k, l) => l - k);
  for (var h = 0; h < g.length; h++) {
    b.splice(g[h], 1);
  }
  h = f;
  for (let k = 0; k < g.length; k++) {
    g[k] < f && h--;
  }
  for (f = 0; f < e.length; f++) {
    b.splice(h + f, 0, e[f]);
  }
  b[h + e.length].a[c] = d;
  a.h += e.length - g.length;
  a.g.h++;
  return {value:d};
}
function He(a, b) {
  var c;
  c === void 0 && (c = a.g.filter());
  c = Ge(a, c, b);
  if (c !== -1) {
    Ce(a.g);
    b = a.g.g.K;
    var d = de(b, c, a.g.i);
    d = ze(b, d, c).slice();
    d.push(c);
    d.sort((f, e) => e - f);
    for (c = 0; c < d.length; c++) {
      b.splice(d[c], 1);
    }
    a.h -= d.length;
    a.g.h++;
  }
}
function Ie(a, b) {
  b === void 0 && (b = a.g.filter());
  Ce(a.g);
  const c = a.g.g.K, d = a.g.i, f = [];
  let e = 0;
  for (let g = a.i + 1; g < a.h; g++) {
    if (!ue(c[g], b)) {
      continue;
    }
    const h = de(c, g, d), k = [];
    for (let l = 0; l < h.length; l++) {
      k.push({cc:c[h[l]], ie:h[l]});
    }
    f.push(new De(c[g], g, a.g, a, e));
    e++;
  }
  return f;
}
function Ge(a, b, c) {
  const d = a.g.g.K;
  let f = 0;
  for (let e = a.i + 1; e < a.h; e++) {
    if (ue(d[e], b)) {
      if (f === c) {
        return e;
      }
      f++;
    }
  }
  return -1;
}
function Je(a, b) {
  const c = a.g.g;
  if (b !== void 0) {
    b = a.i + 1 + b;
  } else {
    a: {
      b = a.g.g.K;
      for (let f = a.i + 1; f < a.h; f++) {
        var d = b[f];
        if (d.g !== 0 || d.m !== 3) {
          continue;
        }
        d = d.a[0] | 0;
        if (d === 5 || d === 2 || d === 4) {
          b = f;
          break a;
        }
      }
      b = a.h;
    }
  }
  return new Ee(c.g, c.K, a, b);
}
class Ke {
  constructor(a, b, c, d, f, e) {
    this.g = a;
    this.o = b;
    this.C = c;
    this.i = d;
    this.h = f;
    this.j = e;
  }
  get type() {
    return this.o;
  }
  get uuid() {
    return this.C;
  }
  get label() {
    Ce(this.g);
    return this.g.j.get(this.j) || "scope";
  }
  count(a) {
    a === void 0 && (a = this.g.filter());
    const b = this.g.g.K;
    let c = 0;
    for (let d = this.i + 1; d < this.h; d++) {
      ue(b[d], a) && c++;
    }
    return c;
  }
  read(a, b) {
    b === void 0 && (b = this.g.filter());
    Ce(this.g);
    const c = this.g.g.K;
    var d = this.g.i, f = 0;
    for (let e = this.i + 1; e < this.h; e++) {
      if (ue(c[e], b)) {
        if (f === a) {
          b = de(c, e, d);
          d = [];
          for (f = 0; f < b.length; f++) {
            d.push({cc:c[b[f]], ie:b[f]});
          }
          return new De(c[e], e, this.g, this, a);
        }
        f++;
      }
    }
    return null;
  }
}
function Le() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, a => {
    const b = Math.random() * 16 | 0;
    return (a === "x" ? b : b & 3 | 8).toString(16);
  });
}
function Ce(a) {
  if (a.D !== a.h) {
    var b = a.g.K, c = new Map();
    for (var d = 0; d < b.length; d++) {
      var f = b[d];
      f.name && f.h >= 0 && c.set(f.h, f.name);
    }
    a.C = c;
    a.i = $d(a.g.K);
    b = a.g.K;
    c = new Map();
    d = 0;
    for (f = 0; f < b.length; f++) {
      var e = b[f];
      e.g === 0 && (e.m === 1 ? e.a[0] ? c.set(e.h, e.a[0]) : (c.set(e.h, "internal#" + d), d++) : e.m === 0 && c.set(e.h, e.a[0]));
    }
    for (d = 0; d < b.length; d++) {
      f = b[d], f.g === 6 && f.m === 11 && f.h >= 0 && (e = c.get(f.i)) && c.set(f.h, e);
    }
    a.j = c;
    b = a.g.K;
    c = a.j;
    d = new Map();
    f = new Map();
    for (e = 0; e < b.length; e++) {
      const g = b[e];
      if (g.g === 6 && g.m === 10 && g.h >= 0) {
        const h = c.get(g.i);
        if (!h) {
          continue;
        }
        const k = f.get(g.i) || 0;
        f.set(g.i, k + 1);
        d.set(g.h, h + " #" + k);
      }
    }
    a.o = d;
    a.D = a.h;
  }
}
class Me {
  constructor(a) {
    this.g = a;
    this.C = new Map();
    this.i = new Map();
    this.j = new Map();
    this.o = new Map();
    this.h = 0;
    this.D = -1;
  }
  filter(a) {
    if (!a) {
      return 383;
    }
    let b = 0;
    a.L !== !1 && (b |= 1);
    a.M !== !1 && (b |= 2);
    a.xa !== !1 && (b |= 4);
    a.Ab !== !1 && (b |= 8);
    a.state !== !1 && (b |= 16);
    a.Tc !== !1 && (b |= 32);
    a.slot !== !1 && (b |= 64);
    a.jh === !0 && (b |= 128);
    return b;
  }
}
;const Ne = ["butt", "round", "square"], Oe = ["miter", "bevel", "round"], Pe = new Set([28, 29, 30, 31, 32, 43, 44, 50, 51]);
function Qe(a, b, c) {
  if (!b || c <= 0) {
    return "";
  }
  a = new Uint8Array(a.buffer, b, c);
  return (new TextDecoder()).decode(a);
}
function Re(a, b, c) {
  function d(r) {
    return r & 1048576 ? u.length ? u[u.length - 1].rb : l.get(0) : l.get(r);
  }
  const f = c.g, e = r => a.view.getFloat64(b + r * 8, !0), g = (r, w) => a.view.setFloat64(b + r * 8, w, !0), h = (r, w, z) => {
    const A = O(f);
    f.g.push(new F(r, -1, w, z, A));
    return y(A);
  }, k = () => (e(7) | 0) === 1 ? 4 : 7, l = new Map(), m = new Map(), p = new Map(), t = new Map(), q = new Map(), u = [];
  return function(r) {
    if (r >= 1 && r <= 85) {
      if (r === 63) {
        r = Qe(a.view, e(0), e(1)), xd(f, 63, r);
      } else {
        if (r === 59 || r === 61) {
          var w = Qe(a.view, e(0), e(1)), z = e(2), A = e(3), B = e(4);
          M(f, 1, r, E(w, z, A, B > 0 ? B : void 0));
        } else {
          if (w = e(9) | 0, r === 34) {
            r = [];
            for (z = 0; z < w; z++) {
              r.push(e(z));
            }
            M(f, 1, 34, [r]);
          } else {
            if (Pe.has(r)) {
              w = e(0);
              switch(r) {
                case 50:
                  w /= 255.0;
                  break;
                case 28:
                  w = Ne[w | 0] || "butt";
                  break;
                case 30:
                  w = Oe[w | 0] || "miter";
                  break;
                case 51:
                  w = Na(w | 0) || "source-over";
              }
              xd(f, r, w);
            } else {
              if (r === 24 || r === 23) {
                w = w > 0 ? e(0) | 0 : 0, M(f, 1, r, w ? E("evenodd") : []);
              } else {
                if (w === 0) {
                  M(f, 1, r, []);
                } else {
                  z = [null];
                  z.length = w;
                  for (A = 0; A < w; A++) {
                    z[A] = e(A);
                  }
                  M(f, 1, r, z);
                }
              }
            }
          }
        }
      }
    } else {
      switch(r) {
        case 200:
          r = e(0);
          w = e(1);
          g(0, zd(f, 0, E(r, w)));
          break;
        case 201:
          r = e(0);
          g(0, zd(f, 0, E(r)));
          break;
        case 202:
          g(0, zd(f, 1, E(e(0))));
          break;
        case 203:
          g(0, zd(f, 2, E(e(0))));
          break;
        case 205:
          r = e(0);
          w = Qe(a.view, e(1), e(2));
          g(0, zd(f, 1, E(r), w));
          break;
        case 210:
          M(f, 2, 11, E(e(0), e(1)));
          break;
        case 211:
          M(f, 2, 12, E(e(0), e(1), e(2), e(3)));
          break;
        case 220:
          g(0, N(f, 3, E(e(0), e(1))));
          break;
        case 221:
          g(0, N(f, 4, E(e(0), e(1))));
          break;
        case 222:
          g(0, N(f, 5, E(e(0), e(1))));
          break;
        case 223:
          g(0, N(f, 6, E(e(0), e(1))));
          break;
        case 224:
          g(0, N(f, 7, E(e(0), e(1))));
          break;
        case 240:
          g(0, N(f, 8, E(e(0))));
          break;
        case 241:
          g(0, N(f, 9, E(e(0))));
          break;
        case 230:
          r = Qe(a.view, e(0), e(1));
          M(f, 2, 13, E(r, e(2)));
          break;
        case 300:
          M(f, 3, 0, E(e(0), e(1), e(2)));
          break;
        case 301:
          M(f, 3, 1, E(e(0)));
          break;
        case 302:
          M(f, 3, 2, E(e(0), e(1), e(2)));
          break;
        case 303:
          M(f, 3, 3, []);
          break;
        case 304:
          M(f, 3, 4, []);
          break;
        case 310:
          r = O(f);
          f.g.push(new F(3, -1, 5, E(e(0), e(1), e(2)), r));
          g(0, y(r));
          break;
        case 311:
          M(f, 3, 6, []);
          break;
        case 312:
          M(f, 3, 7, []);
          break;
        case 313:
          M(f, 3, 8, []);
          break;
        case 400:
          M(f, 0, 3, E(e(0)));
          break;
        case 401:
          M(f, 0, 4, E(e(0)));
          break;
        case 402:
          M(f, 0, 5, []);
          break;
        case 403:
          M(f, 0, 6, []);
          break;
        case 406:
          M(f, 0, 12, []);
          break;
        case 404:
          M(f, 0, 7, []);
          break;
        case 405:
          M(f, 0, 8, []);
          break;
        case 500:
          r = p.get(e(0) | 0);
          w = O(f);
          f.g.push(new F(6, r, 1, E(e(1), e(2)), w));
          g(0, y(w));
          break;
        case 501:
          r = p.get(e(0) | 0);
          P(f, r, 2, E(e(1), e(2)));
          break;
        case 502:
          r = p.get(e(0) | 0);
          w = O(f);
          f.g.push(new F(6, r, 14, E(e(1), e(2), e(3)), w));
          g(0, y(w));
          break;
        case 100:
          r = Qe(a.view, e(0), e(1));
          w = O(f);
          z = O(f);
          A = new F(0, -1, 0, E(r), w);
          A.o = 1;
          A.j = z;
          f.g.push(A);
          u.push({md:w, rb:z, uuid:r});
          l.set(0, z);
          break;
        case 101:
          r = e(0) | 0;
          w = l.get(0);
          z = O(f);
          A = O(f);
          B = new F(0, -1, 1, E(), z);
          B.o = 1;
          B.j = A;
          f.g.push(B);
          u.push({md:z, rb:A, Te:r, tf:w});
          l.set(0, A);
          break;
        case 103:
          r = Qe(a.view, e(0), e(1));
          if (w = u.length ? u[u.length - 1] : null) {
            for (z = f.g.length - 1; z >= 0; z--) {
              if (A = f.g[z], A.g === 0 && A.h === w.md && (A.m === 0 || A.m === 1)) {
                A.name = r;
                break;
              }
            }
          }
          break;
        case 104:
          r = e(0) | 0;
          if ((w = u.length ? u[u.length - 1] : null) && r) {
            for (z = f.g.length - 1; z >= 0; z--) {
              if (A = f.g[z], A.g === 0 && A.h === w.md && (A.m === 0 || A.m === 1)) {
                A.a[1] = r;
                break;
              }
            }
          }
          break;
        case 102:
          r = u.pop();
          w = O(f);
          f.g.push(new F(6, r.md, 11, [], w));
          r.Te !== void 0 && t.set(r.Te, w);
          r.uuid && q.set(r.uuid, w);
          r.tf !== void 0 && l.set(0, r.tf);
          break;
        case 110:
          w = Qe(a.view, e(0), e(1));
          z = e(2) | 0;
          r = e(3) | 0;
          w = q.get(w);
          z = d(z);
          A = O(f);
          f.g.push(new F(6, w, 10, E(new fc(z)), A));
          l.set(r, A);
          break;
        case 111:
          w = e(0) | 0;
          z = e(1) | 0;
          r = e(2) | 0;
          w = t.get(w);
          z = d(z);
          A = O(f);
          f.g.push(new F(6, w, 10, E(new fc(z)), A));
          l.set(r, A);
          break;
        case 120:
          r = d(e(0) | 0);
          P(f, r, 7, E(e(1), e(2)));
          break;
        case 121:
          r = d(e(0) | 0);
          w = Qe(a.view, e(2), e(3));
          P(f, r, 8, E(e(1), w));
          break;
        case 122:
          r = d(e(0) | 0);
          P(f, r, 6, E(e(1), e(2)));
          break;
        case 131:
          r = e(0) | 0;
          w = O(f);
          f.g.push(new F(5, -1, 0, [], w));
          P(f, w, 0, []);
          p.set(r, w);
          break;
        case 132:
          r = e(0) | 0;
          Qe(a.view, e(1), e(2));
          w = O(f);
          f.g.push(new F(5, -1, 0, [], w));
          P(f, w, 0, []);
          p.set(r, w);
          break;
        case 133:
          r = p.get(e(0) | 0);
          w = e(1);
          z = d(e(2) | 0);
          P(f, r, 3, E(w, new fc(z)));
          break;
        case 140:
          r = d(e(0) | 0);
          w = e(1);
          z = e(2) | 0;
          A = O(f);
          f.g.push(new F(6, r, 9, E(w), A));
          m.set(z, A);
          break;
        case 141:
          r = m.get(e(0) | 0);
          P(f, r, 6, E(e(1), e(2)));
          break;
        case 800:
          M(f, k(), 0, E(e(0)));
          break;
        case 801:
          g(0, h(k(), 1, E(e(0))));
          break;
        case 810:
          g(0, h(k(), 2, E(e(0))));
          break;
        case 811:
          M(f, k(), 3, E(e(0), e(1)));
          break;
        case 812:
          g(0, h(k(), 4, E(e(0))));
          break;
        case 813:
          M(f, k(), 5, E(e(0), e(1)));
          break;
        case 814:
          g(0, h(k(), 6, E(e(0), e(1))));
          break;
        case 815:
          M(f, k(), 7, E(e(0), e(1), e(2)));
          break;
        case 816:
          g(0, h(k(), 20, []));
          break;
        case 817:
          g(0, h(k(), 21, E(e(0), e(1))));
          break;
        case 818:
          g(0, h(k(), 19, E(e(0))));
          break;
        case 819:
          g(0, h(k(), 22, E(e(0))));
          break;
        case 820:
          g(0, h(k(), 8, E(e(0), e(1), e(2))));
          break;
        case 830:
          M(f, k(), 9, E(e(0), e(1), e(2)));
          break;
        case 831:
          M(f, k(), 10, E(e(0), e(1), e(2)));
          break;
        case 832:
          M(f, k(), 11, []);
          break;
        case 833:
          M(f, k(), 12, []);
          break;
        case 840:
          g(0, h(k(), 13, E(e(0), e(1), e(2))));
          break;
        case 841:
          M(f, k(), 14, []);
          break;
        case 842:
          M(f, k(), 15, []);
          break;
        case 843:
          M(f, k(), 16, []);
          break;
        case 850:
          M(f, k(), 17, []);
          break;
        case 852:
          M(f, k(), 23, []);
          break;
        case 853:
          M(f, k(), 24, []);
          break;
        case 851:
          M(f, k(), 18, e(1) | 0 ? E(e(0), e(2)) : E(e(0)));
          break;
        case 150:
          r = O(f), f.g.push(new F(0, -1, 2, [], r)), l.set(0, r);
      }
    }
  };
}
function Se(a, b, c, d) {
  const f = new Qd(), e = a.h(160), g = Re(a, e, f), h = a.D();
  a.I[h] = [b, g, function(k) {
    a.j(e);
    a.ba(h);
    k !== 0 && console.error("export_buffer failed, status:", k);
  }, e];
  hd(c, d, 12, h);
  return f;
}
function Te(a, b, c, d) {
  const f = new Qd(), e = a.h(160), g = Re(a, e, f), h = a.D();
  a.I[h] = [b, g, function(k) {
    a.j(e);
    a.ba(h);
    k !== 0 && console.error("export_gralm failed, status:", k);
  }, e];
  hd(c, d, 14, h);
  return f;
}
;function Ue(a, b) {
  var c = a.D.get(b);
  if (c !== void 0) {
    return c;
  }
  if (a.h) {
    {
      c = a.h;
      c.h.view.setInt32(c.g, b, !0);
      const e = c.h.Ga(c.i, 8, c.g, 0);
      if (e) {
        for (var d = c.h.g, f = e; f < e + 36 && d[f] !== 0;) {
          f++;
        }
        c = f > e ? c.h.i(e, f) : "";
      } else {
        c = "";
      }
    }
  } else {
    c = "";
  }
  c = c ? "u:" + c : "p:" + b;
  a.D.set(b, c);
  return c;
}
function R(a, b) {
  return a.j.get(b) || null;
}
function Ve(a) {
  return a.charAt(0) === "u" ? a.slice(2) : "";
}
function We(a, b) {
  if (a.i && a.h) {
    var c = jd(a.h, a.o, 26, [], []);
    c = (new zc(a.i, c)).g;
    var d = b.g, f = Math.max(d.i, 8192 + d.j);
    b = [null];
    b.length = f;
    f = new Float64Array(f);
    d = d.K;
    for (let k = 0; k < d.length; k++) {
      const l = d[k];
      var e = l.a.length ? Od(l.a, c, b, f) : l.a, g = void 0;
      switch(l.g) {
        case 1:
          var h = c.L;
          switch(l.m) {
            case 1:
              h.arc(e[0], e[1], e[2], e[3], e[4], e[5]);
              break;
            case 2:
              h.arcTo(e[0], e[1], e[2], e[3], e[4]);
              break;
            case 3:
              h.bezierCurveTo(e[0], e[1], e[2], e[3], e[4], e[5]);
              break;
            case 4:
              h.closePath();
              break;
            case 5:
              h.ellipse(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7]);
              break;
            case 6:
              h.lineTo(e[0], e[1]);
              break;
            case 7:
              h.moveTo(e[0], e[1]);
              break;
            case 8:
              h.quadraticCurveTo(e[0], e[1], e[2], e[3]);
              break;
            case 9:
              h.rect(e[0], e[1], e[2], e[3]);
              break;
            case 12:
              h.clearRect(e[0], e[1], e[2], e[3]);
              break;
            case 13:
              h.fillRect(e[0], e[1], e[2], e[3]);
              break;
            case 14:
              h.strokeRect(e[0], e[1], e[2], e[3]);
              break;
            case 16:
              h.resetTransform();
              break;
            case 17:
              h.rotate(e[0]);
              break;
            case 18:
              h.scale(e[0], e[1]);
              break;
            case 19:
              h.setTransform(e[0], e[1], e[2], e[3], e[4], e[5]);
              break;
            case 20:
              h.transform(e[0], e[1], e[2], e[3], e[4], e[5]);
              break;
            case 21:
              h.translate(e[0], e[1]);
              break;
            case 22:
              h.beginPath();
              break;
            case 23:
              h.clip(e[0], e[1]);
              break;
            case 24:
              h.fill(e[0], e[1]);
              break;
            case 27:
              h.stroke();
              break;
            case 40:
              h.reset();
              break;
            case 41:
              h.restore();
              break;
            case 42:
              h.save();
              break;
            case 80:
              h.mc();
              break;
            case 43:
              h.fillStyle = e[0];
              break;
            case 44:
              h.strokeStyle = e[0];
              break;
            case 31:
              h.lineWidth = e[0];
              break;
            case 28:
              h.lineCap = e[0];
              break;
            case 30:
              h.lineJoin = e[0];
              break;
            case 29:
              h.lineDashOffset = e[0];
              break;
            case 32:
              h.miterLimit = e[0];
              break;
            case 50:
              h.globalAlpha = e[0];
              break;
            case 51:
              h.globalCompositeOperation = e[0];
              break;
            case 34:
              h.setLineDash(e[0]);
              break;
            case 63:
              h.font = e[0];
              break;
            case 59:
              h.fillText(e[0], e[1], e[2], e[3]);
              break;
            case 61:
              h.strokeText(e[0], e[1], e[2], e[3]);
          }break;
        case 2:
          g = Ld(c.M, l.m, e, l.name);
          break;
        case 3:
          a: {
            g = c.xa;
            switch(l.m) {
              case 0:
                g.Y(e[0], e[1], e[2]);
                break;
              case 1:
                g.h(e[0]);
                break;
              case 2:
                g.Sa(e[0], e[1], e[2]);
                break;
              case 3:
                g.sa();
                break;
              case 4:
                g.X();
                break;
              case 5:
                g = g.Kc(e[0], e[1], e[2]);
                break a;
              case 6:
                g.Ic();
                break;
              case 7:
                g.Bc();
                break;
              case 8:
                g.Fc();
            }
            g = 0;
          }
          break;
        case 4:
          g = Md(c.Ab, l.m, e);
          break;
        case 7:
          g = Md(c.action, l.m, e);
          break;
        case 5:
          a: {
            switch(l.m) {
              case 0:
                g = c.state.h();
                break a;
            }
            g = void 0;
          }
          break;
        case 0:
          a: {
            switch(l.m) {
              case 0:
                g = c.Ma(e[0], e[1]);
                break a;
              case 1:
                g = c.Ra(e[0]);
                break a;
              case 2:
                g = c.root();
                break a;
              case 3:
                c.segment(e[0]);
                break;
              case 4:
                c.fb(e[0]);
                break;
              case 5:
                c.Pb();
                break;
              case 6:
                c.lc();
                break;
              case 12:
                c.ec();
                break;
              case 7:
                c.qb();
                break;
              case 8:
                c.pb();
                break;
              case 9:
                g = c.Uc(e[0], e[1], e[2], e[3]);
                break a;
              case 10:
                c.ve();
                break;
              case 11:
                c.Za(e[0], e[1]);
                break;
              case 13:
                c.nb(e[0], e[1], e[2], e[3], e[4], e[5]);
            }
            g = void 0;
          }
          break;
        case 6:
          g = Nd(b[l.i], l.m, e);
      }
      l.h >= 0 && !l.o && (b[l.h] = g, typeof g === "number" && (f[l.h] = g));
      l.name && l.g === 6 && l.m === 10 && g && g.label(l.name);
      !l.name || l.g !== 0 || l.m !== 0 && l.m !== 1 || c.Mb(l.name);
      l.o === 1 ? (e = l.j, b[l.h] = g, b[e] = g.self) : l.o === 2 && (e = l.j, b[l.h] = g.handle, b[e] = g.Ld, f[l.h] = g.handle);
    }
    a.H = !0;
    jd(a.h, a.o, 27, [], []);
    a.H = !1;
  }
}
function Xe(a, b, c) {
  b = "u:" + b;
  a.j.set(b, c);
  a.g.delete(b);
  We(a, c);
}
function Ye(a, b) {
  const c = "u:" + b;
  let d = a.j.get(c);
  if (d) {
    return d;
  }
  if (!a.i || !a.h) {
    return null;
  }
  d = Se(a.i, b, a.h, a.o);
  if (!d) {
    return null;
  }
  a.j.set(c, d);
  a.g.delete(c);
  return d;
}
function Ze(a) {
  a = a.K;
  for (let b = 0; b < a.length; b++) {
    const c = a[b];
    if (c.g === 0 && (c.m === 0 || c.m === 1)) {
      return c;
    }
  }
  return null;
}
function $e(a, b) {
  var c = a.C.get(b);
  if (c !== void 0) {
    return c;
  }
  c = Ye(a, b);
  if (!c) {
    return "";
  }
  c = (c = Ze(c)) && c.name || "";
  a.C.set(b, c);
  return c;
}
function af(a, b, c) {
  b = Ye(a, b);
  if (!b) {
    return !1;
  }
  const d = Ze(b);
  if (!d) {
    return !1;
  }
  d.name = c || "";
  We(a, b);
  return !0;
}
function bf(a, b) {
  var c = a.g.get(b);
  if (c) {
    return c;
  }
  c = a.j.get(b);
  if (!c) {
    return null;
  }
  c = new Me(c);
  a.g.set(b, c);
  return c;
}
function cf(a) {
  const b = a.g.K, c = [];
  for (let g = 0; g < b.length; g++) {
    const h = b[g];
    if (h.g === 0) {
      if (h.m === 0 || h.m === 1) {
        var d = h.m === 1, f = h.h, e = -1;
        for (let k = g + 1; k < b.length; k++) {
          if (b[k].g === 6 && b[k].m === 11 && b[k].i === f) {
            e = k;
            break;
          }
        }
        e !== -1 && c.push(new Ke(a, d ? 0 : 1, d ? void 0 : h.a[0], g, e, f));
      } else {
        if (h.m === 9) {
          d = h.h;
          f = -1;
          for (e = g + 1; e < b.length; e++) {
            if (b[e].g === 0 && b[e].m === 10 && b[e].i === d) {
              f = e;
              break;
            }
          }
          f !== -1 && c.push(new Ke(a, 2, h.a[2], g, f, d));
        }
      }
    }
  }
  return c.length > 0 ? c[0] : null;
}
function S(a, b) {
  if (!a.j.has(b) && a.i && a.h) {
    var c = b.charAt(0) === "u" ? Se(a.i, b.slice(2), a.h, a.o) : Te(a.i, parseInt(b.slice(2), 10), a.h, a.o);
    a.j.set(b, c);
    a.g.delete(b);
  }
}
function df(a, b) {
  S(a, b);
  a = bf(a, b);
  return a ? (b = cf(a)) ? Ie(b, a.filter({slot:!1})) : [] : [];
}
function ef(a) {
  a = a.K;
  for (let c = 0; c < a.length; c++) {
    var b = a[c];
    if (b.g !== 0) {
      continue;
    }
    if (b.m !== 0 && b.m !== 1) {
      continue;
    }
    const d = b.h;
    b = b.j;
    for (let f = c + 1; f < a.length; f++) {
      if (a[f].g === 6 && a[f].m === 11 && a[f].i === d) {
        return {rb:b, tg:c, $e:f};
      }
    }
  }
  return null;
}
function ff(a, b) {
  b = R(a, b);
  if (!b) {
    return [];
  }
  a = ef(b);
  if (!a) {
    return [];
  }
  b = b.K;
  const c = [];
  for (let d = a.tg + 1; d < a.$e; d++) {
    ac(b[d]) && c.push(d);
  }
  return c;
}
function T(a, b) {
  (b = R(a, b)) && We(a, b);
}
function gf(a, b) {
  a.H || (b = "u:" + b, a.j.delete(b), a.g.delete(b));
}
function hf(a) {
  if (!a.i || !a.h) {
    return [];
  }
  const b = a.i, c = b.view;
  var d = id(a.h, a.o, 35);
  if (!d) {
    return [];
  }
  const f = c.getInt32(d, !0);
  d = c.getInt32(d + 4, !0);
  const e = (h, k) => {
    if (!h) {
      return "";
    }
    const l = b.g;
    let m = h;
    for (; m < h + k && l[m] !== 0;) {
      m++;
    }
    return b.i(h, m);
  }, g = [];
  for (let h = 0; h < f; h++) {
    const k = d + h * 20, l = e(c.getInt32(k, !0), 36), m = a.C.get(l);
    g.push({uuid:l, name:m !== void 0 ? m : e(c.getInt32(k + 4, !0), 256), hf:c.getInt32(k + 8, !0), loaded:c.getInt16(k + 12, !0) !== 0, ge:c.getInt16(k + 14, !0), Hg:c.getInt32(k + 16, !0)});
  }
  return g;
}
function jf(a, b) {
  if (!a.i || !a.h) {
    return !1;
  }
  var c = a.i, d = c.H.encode(b);
  const f = c.h(d.length + 1);
  c.g.set(d, f);
  c.g[f + d.length] = 0;
  d = jd(a.h, a.o, 36, [f], []);
  c.j(f);
  d && (c = "u:" + b, a.j.delete(c), a.g.delete(c), a.C.delete(b));
  return !!d;
}
class kf {
  constructor(a, b, c) {
    this.i = a;
    this.h = b;
    this.o = c;
    this.j = new Map();
    this.g = new Map();
    this.D = new Map();
    this.H = !1;
    this.C = new Map();
  }
  F(a) {
    return new lf(this, Ue(this, a));
  }
}
function mf(a) {
  var b = a.h;
  S(b, a.g);
  a = R(b, a.g);
  if (!a) {
    return [];
  }
  b = ef(a);
  if (!b) {
    return [];
  }
  a = a.K;
  b = b.rb;
  const c = new Map();
  for (var d = 0; d < a.length; d++) {
    var f = a[d];
    f.g === 2 && f.m === 0 && c.set(f.a[0] | 0, {slot:f.h, name:f.name || "", F:f.a.length > 1 ? f.a[1] : 0});
  }
  const e = new Map();
  for (d = 0; d < a.length; d++) {
    f = a[d], f.g === 6 && f.i === b && f.m === 7 && e.set(f.a[0] | 0, f.a[1]);
  }
  const g = [];
  c.forEach(function(k, l) {
    k = {key:l, slot:k.slot, value:e.has(l) ? e.get(l) : k.F, name:k.name};
    g.push(k);
  });
  let h = 20000;
  e.forEach(function(k, l) {
    c.has(l) || g.push({key:h++, slot:-1, value:k, name:""});
  });
  return g;
}
function nf(a) {
  var b = a.h;
  S(b, a.g);
  const c = R(b, a.g);
  if (!c) {
    return [];
  }
  a = ff(b, a.g);
  b = [];
  for (let d = 0; d < a.length; d++) {
    const f = c.K[a[d]];
    b.push({name:f.name || "", value:f.a.length ? f.a[0] : 0, Oa:f.h});
  }
  return b;
}
function of(a, b, c) {
  const d = a.h;
  S(d, a.g);
  const f = R(d, a.g);
  if (f) {
    var e = ff(d, a.g);
    b === c || b < 0 || b >= e.length || c < 0 || c >= e.length || (b = f.K.splice(e[b], 1)[0], f.K.splice(e[c], 0, b), d.g.delete(a.g), T(d, a.g));
  }
}
function pf(a) {
  var b = a.h;
  if (!b.i || !b.h) {
    return null;
  }
  S(b, a.g);
  a = R(b, a.g);
  if (!a) {
    return null;
  }
  b = a.K;
  let c = "";
  for (let d = 0; d < b.length; d++) {
    if (b[d].g === 0 && b[d].m === 0) {
      c = b[d].a[0] || "";
      break;
    }
  }
  return {Tc:a, uuid:c};
}
function qf(a) {
  const b = a.h, c = Ve(a.g);
  if (c) {
    return $e(b, c);
  }
  S(b, a.g);
  a = R(b, a.g);
  return a ? (a = Ze(a)) && a.name || "" : "";
}
function rf(a, b) {
  const c = a.h;
  S(c, a.g);
  var d = R(c, a.g);
  d && (d = Ze(d)) && (d.name = b || "", T(c, a.g), (a = Ve(a.g)) && c.C.set(a, d.name || ""));
}
function sf(a) {
  return df(a.h, a.g);
}
function tf(a, b, c, d) {
  const f = a.h;
  b = df(f, a.g)[b];
  if (!b) {
    return {error:"No command"};
  }
  !b.D || b.O < 0 ? c = {error:"No scope context"} : (c = Fe(b.D, b.O, c, String(d)), b.o = null, b.C = null, b.i.h++);
  c.error || T(f, a.g);
  return c;
}
function uf(a, b) {
  const c = a.h;
  if (b = df(c, a.g)[b]) {
    !b.D || b.O < 0 || He(b.D, b.O), T(c, a.g);
  }
}
function vf(a, b) {
  const c = a.h;
  var d = bf(c, a.g);
  d = d ? cf(d) : null;
  if (!d) {
    throw Error("CmdArrayNodeDef.beginInsert: no scope");
  }
  b = Je(d, b);
  const f = a.g, e = b.end.bind(b);
  b.end = () => {
    e();
    c.g.delete(f);
    T(c, f);
  };
  return b;
}
function wf(a, b) {
  var c = a.h;
  S(c, a.g);
  c = bf(c, a.g);
  if (!c || !cf(c)) {
    return !1;
  }
  a = vf(a);
  b(a.L);
  a.end();
  return !0;
}
function xf(a) {
  var b = a.h;
  S(b, a.g);
  a = R(b, a.g);
  if (!a) {
    return [];
  }
  b = ef(a);
  if (!b) {
    return [];
  }
  a = a.K;
  b = b.rb;
  const c = [];
  for (let f = 0; f < a.length; f++) {
    var d = a[f];
    if (d.g !== 6 || d.i !== b || d.m !== 9) {
      continue;
    }
    const e = d.a[0] | 0;
    d = d.h;
    let g = 0, h = 0;
    for (let k = f + 1; k < a.length; k++) {
      const l = a[k];
      if (l.g !== 6 || l.i !== d || l.m !== 6) {
        continue;
      }
      const m = l.a[0] | 0;
      m === 0 ? g = l.a[1] : m === 1 && (h = l.a[1]);
    }
    c.push({Yb:e, name:vd[e] || "event_" + e, qg:g, rg:h});
  }
  return c;
}
function yf(a, b) {
  const c = a.h;
  S(c, a.g);
  var d = R(c, a.g);
  if (d) {
    var f = ef(d);
    if (f) {
      d = d.K;
      var e = f.rb, g = 0, h = f = -1;
      for (let k = 0; k < d.length; k++) {
        const l = d[k];
        if (l.g === 6 && l.i === e && l.m === 9) {
          if (g === b) {
            f = k;
            h = l.h;
            break;
          }
          g++;
        }
      }
      if (f !== -1) {
        b = [f];
        for (e = 0; e < d.length; e++) {
          e !== f && d[e].g === 6 && d[e].i === h && d[e].m === 6 && b.push(e);
        }
        b.sort((k, l) => l - k);
        for (f = 0; f < b.length; f++) {
          d.splice(b[f], 1);
        }
        c.g.delete(a.g);
        T(c, a.g);
      }
    }
  }
}
function zf(a, b, c, d) {
  const f = a.h;
  S(f, a.g);
  var e = R(f, a.g);
  if (e) {
    var g = ef(e);
    if (g) {
      e = e.K;
      var h = g.rb, k = 0, l = g = -1;
      for (let m = 0; m < e.length; m++) {
        const p = e[m];
        if (p.g === 6 && p.i === h && p.m === 9) {
          if (k === b) {
            g = m;
            l = p.h;
            break;
          }
          k++;
        }
      }
      if (g !== -1) {
        b = !1;
        for (h = 0; h < e.length; h++) {
          if (k = e[h], k.g === 6 && k.i === l && k.m === 6 && (k.a[0] | 0) === c) {
            k.a[1] = d;
            b = !0;
            break;
          }
        }
        b || e.splice(g + 1, 0, new F(6, l, 6, E(c, d), -1));
        f.g.delete(a.g);
        T(f, a.g);
      }
    }
  }
}
class lf {
  constructor(a, b) {
    this.h = a;
    this.g = b;
  }
}
;function Af(a, b) {
  const c = a.view, d = c.getInt32(b + 8, !0);
  var f = "";
  if (d) {
    f = a.g;
    let e = d;
    for (; e < d + 36 && f[e] !== 0;) {
      e++;
    }
    f = a.i(d, e);
  }
  return {ya:c.getInt32(b, !0), depth:0, uuid:f, ja:c.getInt16(b + 12, !0), xb:c.getInt16(b + 14, !0), Zb:c.getInt16(b + 16, !0), B:c.getInt32(b + 4, !0), yb:c.getInt16(b + 18, !0), Gb:c.getInt16(b + 20, !0)};
}
function Yd(a) {
  return a.g ? id(a.g, a.i, 18) : 0;
}
function Bf(a, b, c, d) {
  if (!a.h || !a.g) {
    return 0;
  }
  const f = a.h, e = f.H.encode(b);
  b = f.h(e.length + 1);
  f.g.set(e, b);
  f.g[b + e.length] = 0;
  a = jd(a.g, a.i, 25, [b, e.length, c, d !== void 0 ? d + 1 : 0], []);
  f.j(b);
  return a;
}
function Cf(a, b, c, d) {
  if (!a.h || !a.g) {
    return 0;
  }
  const f = a.h;
  var e = f.H.encode(b);
  b = f.h(e.length + 1);
  f.g.set(e, b);
  e = f.g[b + e.length] = 0;
  c && (c = f.H.encode(c), e = f.h(c.length + 1), f.g.set(c, e), f.g[e + c.length] = 0);
  a = jd(a.g, a.i, 33, [b, e], [d === void 0 ? Date.now() : d]);
  f.j(b);
  e && f.j(e);
  return a;
}
function Df(a) {
  a.g && jd(a.g, a.i, 37, [], []);
}
function Ef(a, b) {
  const c = a.h;
  a = c.view;
  const d = a.getInt32(b, !0);
  b = a.getInt32(b + 4, !0);
  const f = (g, h) => {
    if (!g) {
      return "";
    }
    const k = c.g;
    let l = g;
    for (; l < g + h && k[l] !== 0;) {
      l++;
    }
    return c.i(g, l);
  }, e = [];
  for (let g = 0; g < d; g++) {
    const h = b + g * 24;
    e.push({uuid:f(a.getInt32(h, !0), 36), name:f(a.getInt32(h + 4, !0), 256), Wc:a.getFloat64(h + 8, !0), size:a.getFloat64(h + 16, !0)});
  }
  return e;
}
class Ff {
  constructor(a, b, c, d) {
    this.h = a;
    this.g = b;
    this.i = c;
    this.j = d;
  }
}
function Gf(a, b) {
  const c = a.g;
  if (c.g) {
    if (b < 0) {
      b = -1;
    } else {
      var d = a.h;
      d = df(d, Ue(d, a.B));
      var f = d[b];
      if (f && f.cc.g === 1) {
        f = 0;
        for (let e = 0; e < b; e++) {
          const g = d[e];
          g && g.cc.g === 1 && f++;
        }
        b = f;
      } else {
        b = -1;
      }
    }
    jd(c.g, c.i, 22, [], [b, a.B]);
  }
}
class Hf {
  constructor(a, b, c) {
    this.g = a;
    this.h = b;
    this.B = c;
  }
}
;function If(a, b, c) {
  return [a[0] * b + a[2] * c + a[4], a[1] * b + a[3] * c + a[5]];
}
function Jf(a) {
  var b = a[0], c = a[1], d = a[2], f = a[3];
  const e = a[4];
  a = a[5];
  const g = b * f - c * d;
  if (Math.abs(g) < 1e-12) {
    return [1, 0, 0, 1, 0, 0];
  }
  f /= g;
  c = -c / g;
  d = -d / g;
  b /= g;
  return [f, c, d, b, -(f * e + d * a), -(c * e + b * a)];
}
;function Kf(a) {
  if (!a.g) {
    return {vd:0, wd:0};
  }
  const b = a.g;
  a = a.h;
  return {vd:id(b, a, 1), wd:id(b, a, 2)};
}
function Lf(a, b) {
  const c = a.i;
  if (!c || !a.g) {
    return [1, 0, 0, 1, 0, 0];
  }
  const d = c.h(56);
  c.view.setInt32(d, b, !0);
  jd(a.g, a.h, 28, [d], []);
  a = c.view;
  b = [];
  for (let f = 0; f < 6; f++) {
    b.push(a.getFloat64(d + 8 + f * 8, !0));
  }
  c.j(d);
  return b;
}
function Mf(a) {
  if (!a.g) {
    return {enabled:0, color:0};
  }
  const b = a.g;
  a = a.h;
  return {enabled:id(b, a, 30), color:id(b, a, 31)};
}
class Nf {
  constructor(a, b, c) {
    this.i = a;
    this.g = b;
    this.h = c;
  }
}
;class Of {
  constructor(a, b, c) {
    this.ca = new Set();
    this.o = id(a, b, 3);
    this.C = id(a, b, 4);
    this.g = c || function() {
    };
    this.h = null;
  }
  D(a) {
    const b = a.J();
    switch(a.id()) {
      case 1:
        this.ca.add(b);
        this.g();
        break;
      case 2:
        this.ca.delete(b);
        this.g();
        break;
      case 3:
        this.ca.clear();
        this.g();
        break;
      case 4:
        this.o = b;
        (this.h || this.g)();
        break;
      case 5:
        this.C = b, (this.h || this.g)();
    }
  }
  get j() {
    return this.o;
  }
  get i() {
    return this.C;
  }
  has(a) {
    return this.ca.has(a);
  }
  H() {
    return Array.from(this.ca);
  }
  get size() {
    return this.ca.size;
  }
}
;let Pf = null;
function Qf() {
  if (!Pf) {
    const a = new na("ploft.libcatalog");
    Pf = a.init().then(() => a);
    Pf.catch(() => {
      Pf = null;
    });
  }
  return Pf;
}
function Rf() {
  return Qf().then(a => a.get("entries")).then(a => a || []);
}
function Sf(a) {
  const b = a.map(c => ({uuid:c.uuid, name:c.name, Wc:c.Wc, size:c.size || 0}));
  Qf().then(c => c.set("entries", b)).then(() => {
  });
}
function Tf(a, b, c) {
  Rf().then(d => {
    const f = d.findIndex(g => g.uuid === a), e = {uuid:a, name:b, Wc:c, size:f >= 0 ? d[f].size : 0};
    f >= 0 ? d[f] = e : d.push(e);
    return Qf().then(g => g.set("entries", d)).then(() => {
    });
  });
}
function Uf(a) {
  Rf().then(b => {
    const c = b.filter(d => d.uuid !== a);
    if (c.length !== b.length) {
      return Qf().then(d => d.set("entries", c)).then(() => {
      });
    }
  });
}
;class Vf extends Wd {
  C() {
    var a = this.g.h;
    return new Hf(a, a.j, this.B);
  }
  o() {
    return this.g.g.F(this.B);
  }
  j() {
    const a = this.g, b = a.V;
    if (b.g) {
      var c = Yd(b);
      jd(b.g, b.i, 23, [c], [0, this.B]);
      a.R.D.delete(this.B);
    }
  }
  h() {
    const a = this.g, b = a.V;
    if (!b.h || !b.g) {
      return 0;
    }
    const c = Le(), d = new Qd();
    d.Ma(c).end();
    Xe(a.R, c, d);
    return Bf(b, c, this.B);
  }
  D() {
    const a = this.g.V;
    if (a.h && a.g && this.uuid && this.ya) {
      var b = this.uuid, c = this.ya, d = this.Gb;
      this.j();
      Bf(a, b, c, d);
    }
  }
}
function Wf(a) {
  const b = a.j;
  if (!b) {
    return {has:function() {
      return !1;
    }, H:function() {
      return [];
    }, D:function() {
    }, j:0, i:0, h:null};
  }
  const c = new Of(a.oa, a.H, () => a.refresh());
  a.Aa = Vd(b, a.H, {Eb:d => {
    switch(d.id()) {
      case 6:
        var f = a.j;
        f && (a.ba || Xf(a, Af(f, d.J())), a.refresh());
        break;
      case 7:
        a.ba || Yf(a, d.J());
        a.refresh();
        break;
      case 9:
        Zf(a, d);
        break;
      case 101:
        var e = d.J();
        if (!e || !a.j) {
          break;
        }
        var g = a.j.view;
        d = g.getInt32(e, !0);
        f = g.getInt32(e + 4, !0);
        e = g.getInt32(e + 8, !0);
        if (g = a.$b.get(d)) {
          a.$b.delete(d), g(f, e);
        }
        break;
      case 11:
        d = d.J() ? Ef(a.h, d.J()) : [];
        d.length && Sf(d);
        f = a.Ha.slice();
        for (e = 0; e < f.length; e++) {
          f[e](d);
        }
        break;
      default:
        c.D(d);
    }
  }});
  return c;
}
function Zf(a, b) {
  const c = a.j;
  if (c) {
    var d = b.J();
    if (d) {
      var f = c.view;
      b = f.getInt32(d, !0);
      d = f.getInt32(d + 4, !0);
      f = (e, g) => {
        if (!e) {
          return "";
        }
        const h = c.g;
        let k = e;
        for (; k < e + g && h[k] !== 0;) {
          k++;
        }
        return c.i(e, k);
      };
      if (b = f(b, 36)) {
        gf(a.g, b);
        d = f(d, 256);
        a.g.C.set(b, d || "");
        f = a.ad.slice();
        for (let e = 0; e < f.length; e++) {
          f[e](b, d);
        }
      }
    }
    a.refresh();
  }
}
function Xf(a, b) {
  a = a.hb;
  var c = a.findIndex(f => f.B === b.ya);
  if (c >= 0) {
    b.depth = a[c].depth + 1;
    c += 1;
    let f = 0;
    for (; f < b.Gb && c < a.length && a[c].ya === b.ya;) {
      c += 1 + a[c].ja, f++;
    }
  } else {
    b.depth = 0, c = a.length;
  }
  a.splice(c, 0, b);
  let d = b.ya;
  for (;;) {
    c = a.findIndex(f => f.B === d);
    if (c < 0) {
      break;
    }
    a[c].ja += 1;
    d = a[c].ya;
  }
}
function Yf(a, b) {
  a = a.hb;
  var c = a.findIndex(g => g.B === b);
  if (!(c < 0)) {
    var d = 1 + a[c].ja, f = a[c].ya;
    a.splice(c, d);
    for (var e = f;;) {
      c = a.findIndex(g => g.B === e);
      if (c < 0) {
        break;
      }
      a[c].ja -= d;
      e = a[c].ya;
    }
  }
}
class $f extends Zd {
  constructor(a, b) {
    super();
    this.j = a || null;
    this.H = a && b !== void 0 ? a.I[b][5] : 0;
    this.oa = a ? a.V : null;
    this.R = new kf(this.j, this.oa, this.H);
    this.h = this.V = new Ff(this.j, this.oa, this.H, this.R);
    this.g = this.R;
    this.C = new Nf(this.j, this.oa, this.H);
    this.Ba = null;
    this.Ha = [];
    this.ad = [];
    this.$b = new Map();
    this.hb = [];
    this.ba = !0;
    this.Aa = null;
    this.j && Rf().then(c => {
      if (c.length) {
        for (let l = 0; l < c.length; l++) {
          var d = c[l], f = this.h, e = d.uuid, g = d.name;
          d = d.Wc;
          if (f.h && f.g) {
            var h = f.h, k = h.H.encode(e);
            e = h.h(k.length + 1);
            h.g.set(k, e);
            k = h.g[e + k.length] = 0;
            g && (g = h.H.encode(g), k = h.h(g.length + 1), h.g.set(g, k), h.g[k + g.length] = 0);
            jd(f.g, f.i, 38, [e, k], [d]);
            h.j(e);
            k && h.j(k);
          }
        }
        this.refresh();
      }
    });
    this.O = Wf(this);
  }
  D() {
    if (this.ba) {
      var a = this.V;
      if (a.h && a.g) {
        var b = a.h.view;
        var c = id(a.g, a.i, 17);
        if (c) {
          var d = b.getInt32(c, !0);
          c = b.getInt32(c + 4, !0);
          b = [];
          for (var f = 0; f < d; f++) {
            b.push(Af(a.h, c + f * 24));
          }
          a = new Map();
          for (d = 0; d < b.length; d++) {
            c = b[d], c.depth = a.has(c.ya) ? a.get(c.ya) + 1 : 0, a.set(c.B, c.depth);
          }
        } else {
          b = [];
        }
      } else {
        b = [];
      }
      this.hb = b;
      this.ba = !1;
    }
    b = this.hb;
    for (d = 0; d < b.length; d++) {
      if (a = b[d], f = this.R, a.uuid && S(f, Ue(f, a.B)), f.j.has(Ue(f, a.B))) {
        c = Ue(f, a.B);
        a: {
          var e = R(f, c);
          if (!e) {
            var g = -1;
            break a;
          }
          g = ef(e);
          if (!g) {
            g = -1;
            break a;
          }
          e = e.K;
          let h = 0;
          for (let k = 0; k < e.length; k++) {
            e[k].g === 6 && e[k].i === g.rb && e[k].m === 9 && h++;
          }
          g = h;
        }
        g >= 0 && (a.yb = g);
        a: {
          g = bf(f, c);
          if (!g) {
            g = -1;
            break a;
          }
          g = (e = cf(g)) ? Ie(e, g.filter({slot:!1})).length : -1;
        }
        g >= 0 && (a.xb = g);
        c = R(f, c) ? ff(f, c).length : -1;
        c >= 0 && (a.Zb = c);
      }
    }
    return this.wc(b);
  }
  Ib(a) {
    this.Ha.push(a);
    return () => {
      const b = this.Ha.indexOf(a);
      b >= 0 && this.Ha.splice(b, 1);
    };
  }
  o(a, b) {
    a && this.$b.set(a, b);
  }
  refresh() {
    this.Ba && this.Ba();
  }
  wc(a) {
    return a.map(b => new Vf(this, b));
  }
  i(a) {
    return new Vf(this, {ya:0, depth:0, ja:0, xb:0, Zb:0, B:a, yb:0, Gb:0});
  }
}
;function ag(a) {
  return a.replace(/[A-Z]/g, b => "-" + b.toLowerCase());
}
class bg {
  constructor() {
    this.g = [];
  }
  add(a, b) {
    b = Object.entries(b);
    let c = "";
    for (let d = 0; d < b.length; d++) {
      c += ag(b[d][0]) + ":" + b[d][1] + ";";
    }
    this.g.push(a + "{" + c + "}");
    return this;
  }
  toString() {
    return this.g.join("");
  }
}
;function cg(a, b, c) {
  return {x:Math.min(Math.max(a, 60 - c), window.innerWidth - 60), y:Math.min(Math.max(b, 0), window.innerHeight - 23)};
}
const dg = (new bg()).add(".sidebar-scroll::-webkit-scrollbar", {width:"12px"}).add(".sidebar-scroll::-webkit-scrollbar-track", {background:"transparent"}).add(".sidebar-scroll::-webkit-scrollbar-thumb", {background:"rgba(255,255,255,0.2)"}).add(".sidebar-scroll::-webkit-scrollbar-thumb:hover", {background:"rgba(255,255,255,0.4)"}).add(".section-sash", {background:"transparent", transition:"background 0.15s"}).add(".section-sash:hover", {background:"#007fd4"}).add("input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button", 
{WebkitAppearance:"none", margin:"0"}).add("input[type=number]", {MozAppearance:"textfield"}).toString(), eg = {backgroundColor:"#2a2a2a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", padding:"2px 4px", fontSize:"11px", outline:"none", fontFamily:"monospace", width:"0"}, fg = {backgroundColor:"#2a2a2a", color:"#aaa", border:"1px solid #555", borderRadius:"2px", padding:"1px 2px", fontSize:"9px", outline:"none", cursor:"pointer", flexShrink:"0"};
function gg(a) {
  return "section-" + a + "-content";
}
;async function hg(a) {
  if (a.Ca) {
    var b = await a.Ca.get("sections");
    if (b && b.length > 0) {
      var c = {};
      for (var d of a.ga) {
        c[d.v.key] = d;
      }
      d = [];
      const f = {};
      for (const e of b) {
        b = c[e.key];
        if (!b) {
          continue;
        }
        const g = b.v;
        g.visible = e.visible ?? g.visible;
        g.collapsed = e.collapsed ?? g.collapsed;
        g.height = e.height ?? g.height;
        g.floating = e.floating ?? g.floating;
        g.floatX = e.floatX ?? g.floatX;
        g.floatY = e.floatY ?? g.floatY;
        g.floatW = e.floatW ?? g.floatW;
        g.floatH = e.floatH ?? g.floatH;
        d.push(b);
        f[e.key] = !0;
      }
      for (const e of a.ga) {
        f[e.v.key] || d.push(e);
      }
      a.ga = d;
    }
    if (c = await a.Ca.get("panel")) {
      a = a.G, a.floating = c.floating ?? a.floating, a.dockSide = c.dockSide ?? a.dockSide, a.panelWidth = c.panelWidth ?? a.panelWidth, a.panelHeight = c.panelHeight ?? a.panelHeight, a.floatX = c.floatX ?? a.floatX, a.floatY = c.floatY ?? a.floatY;
    }
  }
}
async function ig(a) {
  try {
    a.Ca = new na("ploft.panel");
    await a.Ca.init();
    await hg(a);
    for (const b of a.Vd) {
      b.Oc && await b.Oc(a.Ca);
    }
  } catch (b) {
    console.error("panel storage init failed", b);
  }
  a.Ke = !0;
  a.refresh();
}
function jg(a) {
  if (a.Ca && a.Ke) {
    a.Ca.set("sections", a.ga.map(b => b.v));
    a.Ca.set("panel", a.G);
    for (const b of a.Vd) {
      b.Pc && b.Pc(a.Ca);
    }
  }
}
;function kg(a) {
  a.xc && (document.removeEventListener("dragover", a.xc), a.xc = null);
  const b = a.sc;
  b.rd = null;
  b.sd = null;
  b.hc = null;
  lg(a);
}
function mg(a, b, c) {
  b.dataTransfer.setData("application/x-ploft-section", c);
  b.dataTransfer.effectAllowed = "move";
  a.sc.rd = c;
  a.xc = d => {
    d.preventDefault();
  };
  document.addEventListener("dragover", a.xc);
}
function ng(a, b, c) {
  if (b.dataTransfer.types.includes("application/x-ploft-section")) {
    b.preventDefault();
    b = a.sc;
    var d = b.rd;
    if (d && d !== c) {
      var f = a.ga.findIndex(e => e.v.key === d);
      if (f >= 0) {
        f = a.ga.splice(f, 1)[0];
        let e = a.ga.findIndex(g => g.v.key === c);
        e >= 0 && a.ga.splice(b.hc === "below" ? e + 1 : e, 0, f);
      }
    }
    kg(a);
  }
}
function og(a, b) {
  a.G.floating && (b.preventDefault(), a.De = !0, a.$d = b.clientX, a.ae = b.clientY, a.Yd = a.G.floatX, a.Zd = a.G.floatY, a.bd = c => {
    var d = c.clientX - a.$d;
    const f = c.clientY - a.ae;
    if (c = document.getElementById("ploft-sidebar")) {
      d = cg(a.Yd + d, a.Zd + f, a.G.panelWidth), c.style.left = d.x + "px", c.style.top = d.y + "px";
    }
  }, a.cd = c => {
    a.De = !1;
    c = cg(a.Yd + (c.clientX - a.$d), a.Zd + (c.clientY - a.ae), a.G.panelWidth);
    a.G.floatX = c.x;
    a.G.floatY = c.y;
    document.removeEventListener("mousemove", a.bd);
    document.removeEventListener("mouseup", a.cd);
    a.bd = null;
    a.cd = null;
    lg(a);
  }, document.addEventListener("mousemove", a.bd), document.addEventListener("mouseup", a.cd));
}
function pg(a, b, c) {
  b.preventDefault();
  b.stopPropagation();
  a.Je = !0;
  a.Fe = c;
  a.He = b.clientX;
  a.Ie = b.clientY;
  a.zc = a.G.panelWidth;
  a.ce = a.G.panelHeight;
  a.Ge = a.G.floatX;
  a.dd = d => {
    var f = d.clientX - a.He;
    d = d.clientY - a.Ie;
    const e = a.Fe;
    e === "left" ? (f = Math.max(200, a.zc - f), a.G.panelWidth = f, a.G.floating && (a.G.floatX = a.Ge + (a.zc - f))) : e === "right" ? a.G.panelWidth = Math.max(200, a.zc + f) : e === "bottom" ? a.G.panelHeight = Math.max(150, a.ce + d) : e === "corner-br" && (a.G.panelWidth = Math.max(200, a.zc + f), a.G.panelHeight = Math.max(150, a.ce + d));
    a.bc || (a.bc = requestAnimationFrame(() => {
      a.bc = 0;
      a.refresh();
    }));
  };
  a.ed = () => {
    a.Je = !1;
    a.bc && (cancelAnimationFrame(a.bc), a.bc = 0);
    document.removeEventListener("mousemove", a.dd);
    document.removeEventListener("mouseup", a.ed);
    a.dd = null;
    a.ed = null;
    lg(a);
  };
  document.addEventListener("mousemove", a.dd);
  document.addEventListener("mouseup", a.ed);
}
function qg(a, b, c) {
  c.preventDefault();
  const d = a.ga[b], f = c.clientY, e = d.v.height, g = gg(d.v.key);
  a.fd = h => {
    h = Math.max(30, e + (h.clientY - f));
    const k = document.getElementById(g);
    k && (k.style.height = h + "px");
  };
  a.gd = h => {
    d.v.height = Math.max(30, e + (h.clientY - f));
    document.removeEventListener("mousemove", a.fd);
    document.removeEventListener("mouseup", a.gd);
    a.fd = null;
    a.gd = null;
    lg(a);
  };
  document.addEventListener("mousemove", a.fd);
  document.addEventListener("mouseup", a.gd);
}
;function rg(a) {
  return v("div", {onDblClick:() => {
    if (a.G.floating) {
      a.G.floating = !1;
    } else {
      const b = window.innerWidth;
      a.G.floatX = a.G.dockSide === "right" ? Math.max(0, b - a.G.panelWidth - 40) : 40;
      a.G.floatY = 50;
      a.G.panelHeight = Math.min(500, window.innerHeight - 100);
      a.G.floating = !0;
    }
    lg(a);
  }, onMouseDown:b => og(a, b), style:{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 10px", backgroundColor:"#1e1e1e", borderBottom:"1px solid #444", fontSize:"11px", fontWeight:"bold", letterSpacing:"0.5px", color:"#aaa", cursor:a.G.floating ? "grab" : "default", userSelect:"none"}}, "PANEL", v("div", {onClick:b => {
    b.stopPropagation();
    a.Ua = !a.Ua;
    lg(a);
  }, onMouseDown:b => b.stopPropagation(), onDblClick:b => b.stopPropagation(), style:{cursor:"pointer", padding:"2px 6px", borderRadius:"3px", fontSize:"14px", lineHeight:"1", color:"#aaa"}}, "\u00b7\u00b7\u00b7"));
}
function sg(a) {
  const b = {display:"flex", alignItems:"center", gap:"6px", padding:"4px 10px", cursor:"pointer", fontSize:"12px", color:"#e0e0e0"}, c = {width:"14px", textAlign:"center", fontSize:"11px", color:"#6af"};
  return v("div", null, v("div", {onClick:() => a.Cc(), style:{position:"fixed", top:"0", left:"0", right:"0", bottom:"0", zIndex:"100"}}), v("div", {style:{position:"absolute", right:"6px", top:"28px", backgroundColor:"#252526", border:"1px solid #555", borderRadius:"4px", padding:"4px 0", zIndex:"101", boxShadow:"0 4px 12px rgba(0,0,0,0.5)", minWidth:"140px"}}, a.ga.map(d => v("div", {onClick:() => tg(a, d.v.key), style:b}, v("span", {style:c}, d.v.visible ? "\u2713" : ""), d.state.label)), v("div", 
  {style:{borderTop:"1px solid #444", margin:"4px 0"}}), v("div", {onClick:() => {
    a.G.dockSide = "left";
    a.G.floating = !1;
    a.Ua = !1;
    lg(a);
  }, style:b}, v("span", {style:c}, a.G.floating || a.G.dockSide !== "left" ? "" : "\u2713"), "Dock Left"), v("div", {onClick:() => {
    a.G.dockSide = "right";
    a.G.floating = !1;
    a.Ua = !1;
    lg(a);
  }, style:b}, v("span", {style:c}, a.G.floating || a.G.dockSide !== "right" ? "" : "\u2713"), "Dock Right")));
}
function ug(a) {
  const b = {position:"absolute", zIndex:"10"}, c = [];
  (a.G.floating || a.G.dockSide === "right") && c.push(v("div", {onMouseDown:d => pg(a, d, "left"), style:{...b, left:"0", top:"0", width:"5px", height:"100%", cursor:"ew-resize"}}));
  (a.G.floating || a.G.dockSide === "left") && c.push(v("div", {onMouseDown:d => pg(a, d, "right"), style:{...b, right:"0", top:"0", width:"5px", height:"100%", cursor:"ew-resize"}}));
  a.G.floating && (c.push(v("div", {onMouseDown:d => pg(a, d, "bottom"), style:{...b, left:"0", bottom:"0", width:"100%", height:"5px", cursor:"ns-resize"}})), c.push(v("div", {onMouseDown:d => pg(a, d, "corner-br"), style:{...b, right:"0", bottom:"0", width:"10px", height:"10px", cursor:"nwse-resize"}})));
  return c.length > 0 ? v("div", null, c) : null;
}
;function lg(a) {
  a.refresh();
  jg(a);
}
function vg(a, b) {
  return a.ga.find(c => c.v.key === b) || null;
}
function tg(a, b) {
  if (b = vg(a, b)) {
    b.v.visible = !b.v.visible, lg(a);
  }
}
async function wg(a) {
  ig(a);
}
function xg(a, b, c, d) {
  var f = a.ga.findIndex(g => g.v.key === b);
  if (!(f < 0)) {
    f = a.ga.splice(f, 1)[0];
    f.v.floating = !1;
    var e = a.ga.findIndex(g => g.v.key === c);
    e >= 0 ? a.ga.splice(d === "below" ? e + 1 : e, 0, f) : a.ga.push(f);
    lg(a);
  }
}
function yg(a) {
  for (var b of a.ga) {
  }
  b = new Map();
  for (const c of a.ga) {
    !c.v.visible || c.v.collapsed || c.v.floating || b.set(c.v.key, Math.max(30, c.v.height));
  }
  return b;
}
function zg(a, b, c, d, f, e) {
  return {za:b, title:c, $f:a.sc, height:d, te:f, ng:() => {
    const g = vg(a, b.v.key);
    g && (g.v.collapsed = !g.v.collapsed, lg(a));
  }, og:() => {
    const g = vg(a, b.v.key);
    g && (g.v.floating ? g.v.floating = !1 : (g.v.floating = !0, g.v.floatX = g.v.floatX || 200, g.v.floatY = g.v.floatY || 100, g.v.floatW = a.G.panelWidth, g.v.floatH = g.v.height || 200), lg(a));
  }, hg:(g, h) => xg(a, b.v.key, g, h), kg:g => mg(a, g, b.v.key), jg:g => {
    var h = b.v.key;
    if (g.dataTransfer.types.includes("application/x-ploft-section")) {
      g.preventDefault();
      var k = g.currentTarget.getBoundingClientRect();
      g = g.clientY - k.top < k.height / 2 ? "above" : "below";
      k = a.sc;
      if (k.sd !== h || k.hc !== g) {
        k.sd = h, k.hc = g, a.refresh();
      }
    }
  }, lg:g => ng(a, g, b.v.key), ig:g => {
    var h = a.sc.rd;
    if (h && g.clientX !== 0 && g.clientY !== 0) {
      var k = document.getElementById("ploft-sidebar");
      k && (k = k.getBoundingClientRect(), (g.clientX < k.left || g.clientX > k.right || g.clientY < k.top || g.clientY > k.bottom) && (h = vg(a, h)) && !h.v.floating && (h.v.floating = !0, h.v.floatW = a.G.panelWidth, h.v.floatH = h.v.height || 200, g = cg(g.clientX - 100, g.clientY - 15, h.v.floatW), h.v.floatX = g.x, h.v.floatY = g.y));
    }
    kg(a);
  }, pf:() => tg(a, b.v.key), refresh:e};
}
class Ag extends Sb {
  constructor() {
    super();
    this.Vd = [];
    this.g = {};
    this.ga = [];
    this.sc = {rd:null, sd:null, hc:null};
    this.xc = null;
    this.Ua = !1;
    this.G = {floating:!1, dockSide:"right", panelWidth:280, panelHeight:500, floatX:200, floatY:50};
    this.De = !1;
    this.Zd = this.Yd = this.ae = this.$d = 0;
    this.cd = this.bd = null;
    this.Je = !1;
    this.Fe = "";
    this.Ge = this.ce = this.zc = this.Ie = this.He = 0;
    this.ed = this.dd = null;
    this.bc = 0;
    this.Ca = this.gd = this.fd = null;
    this.Ke = !1;
  }
  register(a) {
    this.Vd.push(a);
    this.g[a.key] = a;
    this.ga.push({v:{key:a.key, visible:a.visible, height:a.height}, state:{label:a.label, Ua:!1}});
  }
  Cc() {
    this.Ua = !1;
    lg(this);
  }
  async render() {
    const a = () => lg(this), b = yg(this), c = (f, e) => {
      f = this.g[f.v.key];
      if (!f) {
        return null;
      }
      e = f.create(e);
      return Vb(e);
    }, d = {position:"fixed", width:this.G.panelWidth + "px", backgroundColor:"#1e1e1e", color:"#e0e0e0", fontFamily:"sans-serif", fontSize:"12px", pointerEvents:"auto", display:"flex", flexDirection:"column", whiteSpace:"nowrap", overflow:"hidden"};
    if (this.G.floating) {
      const f = cg(this.G.floatX, this.G.floatY, this.G.panelWidth);
      this.G.floatX = f.x;
      this.G.floatY = f.y;
      d.left = f.x + "px";
      d.top = f.y + "px";
      d.height = this.G.panelHeight + "px";
      d.borderRadius = "6px";
      d.boxShadow = "0 6px 20px rgba(0,0,0,0.6)";
      d.border = "1px solid #555";
    } else {
      d.top = "0", d.height = "100vh", this.G.dockSide === "right" ? (d.right = "0", d.borderLeft = "1px solid #444") : (d.left = "0", d.borderRight = "1px solid #444");
    }
    return v("div", null, v("div", {id:"ploft-sidebar", style:d}, v("style", null, dg), rg(this), this.Ua ? sg(this) : null, v("div", {className:"sidebar-scroll", style:{flex:"1", overflowY:"auto"}}, this.ga.map((f, e) => {
      if (!f.v.visible || f.v.floating) {
        return null;
      }
      var g = this.g[f.v.key];
      g = g && g.gb ? g.gb() : f.state.label;
      g = zg(this, f, g, b.get(f.v.key) || 30, h => qg(this, e, h), a);
      return c(f, g);
    }), v("div", {style:{height:"6px", backgroundColor:"#2d2d2d", flexShrink:"0"}})), ug(this)), this.ga.filter(f => f.v.visible && f.v.floating).map(f => {
      var e = this.g[f.v.key];
      e = e && e.gb ? e.gb() : f.state.label;
      return c(f, zg(this, f, e, 0, null, a));
    }));
  }
}
;const Bg = {1:"x", 2:"y", 3:"w", 4:"h", 5:"scale_x", 6:"scale_y", 7:"x2", 8:"y2", 9:"geom", 10:"orig_w", 11:"orig_h", 12:"fit_mode", 13:"el_cmd_start", 14:"el_cmd_end", 15:"fill_color", 16:"stroke_color", 17:"stroke_width_val", 18:"tool_id", 19:"swatch_color", 20:"fill_enabled", 21:"stroke_enabled", 22:"label_id", 23:"dash_offset", 24:"current_tool(morto)", 25:"outline_mode", 26:"jsx_enabled", 27:"leg_enabled", 28:"cft_enabled", 29:"cursor_is_over", 30:"start_x", 31:"start_y", 32:"state_ref", 33:"temporal_elapsed", 
34:"target_layer", 35:"gralm_id", 36:"event_defined", 37:"name", 38:"font", 39:"text"}, Cg = [{Yb:1, name:"cursor"}, {Yb:2, name:"move"}], Dg = {1:[{key:0, name:"cursor", type:"select", options:tb}], 2:[{key:0, name:"var x", type:"var_picker", options:null}, {key:1, name:"var y", type:"var_picker", options:null}]};
function Eg(a, b, c) {
  if (a.g[b]) {
    return a.g[b];
  }
  const d = a.h[b] || {}, f = {};
  let e = 1;
  for (let h = 0; h < c.length; h++) {
    const k = c[h];
    if (k.key < 20000) {
      var g = k.key;
      f[k.slot] = Bg[g] || String(g);
      continue;
    }
    g = d[k.key];
    const l = k.name && k.name !== String(k.key) ? k.name : "";
    g || l ? f[k.slot] = g || l : (f[k.slot] = "v" + String(e).padStart(2, "0"), e++);
  }
  return a.g[b] = f;
}
function Fg(a, b, c, d) {
  const f = a.h[b];
  return f && f[c] ? f[c] : (a = a.g[b]) && a[d] ? a[d] : Bg[c] || String(c);
}
class Gg {
  constructor(a) {
    this.h = a;
    this.g = {};
  }
}
;function Hg(a, b) {
  b.preventDefault();
  b.stopPropagation();
  a.l.za.state.Ua = !a.l.za.state.Ua;
  a.l.refresh();
}
function Ig(a) {
  const b = {display:"flex", alignItems:"center", gap:"6px", padding:"4px 10px", cursor:"pointer", fontSize:"12px", color:"#e0e0e0", whiteSpace:"nowrap"}, c = {width:"14px", textAlign:"center", fontSize:"11px", color:"#6af"};
  return v("div", null, v("div", {onClick:() => a.Cc(), style:{position:"fixed", top:"0", left:"0", right:"0", bottom:"0", zIndex:"100"}}), v("div", {style:{position:"absolute", left:"10px", marginTop:"1px", backgroundColor:"#252526", border:"1px solid #555", borderRadius:"4px", padding:"4px 0", zIndex:"101", boxShadow:"0 4px 12px rgba(0,0,0,0.5)", minWidth:"120px"}}, v("div", {onClick:() => {
    a.Cc();
    a.l.og();
  }, style:b}, v("span", {style:c}, "\u29c9"), "Float"), v("div", {onClick:() => {
    a.Cc();
    a.l.pf();
  }, style:b}, v("span", {style:c}, "\u00d7"), "Close")));
}
function Jg(a, b) {
  b.preventDefault();
  const c = a.l.za, d = b.clientX, f = b.clientY, e = c.v.floatX, g = c.v.floatY, h = "ploft-float-" + c.v.key;
  let k = null, l = null, m = null, p = null;
  const t = () => {
    m && (m.style.borderTop = "", m.style.borderBottom = "", p = m = null);
  };
  a.C = q => {
    var u = document.getElementById(h);
    if (u) {
      var r = cg(e + q.clientX - d, g + q.clientY - f, c.v.floatW);
      u.style.left = r.x + "px";
      u.style.top = r.y + "px";
    }
    u = q.clientX;
    q = q.clientY;
    if (r = document.getElementById("ploft-sidebar")) {
      r = r.querySelectorAll("[data-section-key]");
      var w = null, z = null, A = null;
      for (let B = 0; B < r.length; B++) {
        const D = r[B], x = D.getBoundingClientRect();
        if (u >= x.left && u <= x.right && q >= x.top && q <= x.bottom) {
          w = D;
          z = D.getAttribute("data-section-key");
          A = q - x.top < x.height / 2 ? "above" : "below";
          break;
        }
      }
      if (w && z) {
        if (w !== m || A !== p) {
          t(), A === "above" ? w.style.borderTop = "2px solid #6af" : w.style.borderBottom = "2px solid #6af", m = w, p = A;
        }
        k = z;
        l = A;
      } else {
        t(), l = k = null;
      }
    } else {
      t(), k = null;
    }
  };
  a.O = q => {
    t();
    document.removeEventListener("mousemove", a.C);
    document.removeEventListener("mouseup", a.O);
    a.C = null;
    a.O = null;
    k && l ? a.l.hg(k, l) : (q = cg(e + q.clientX - d, g + q.clientY - f, c.v.floatW), c.v.floatX = q.x, c.v.floatY = q.y, a.l.refresh());
  };
  document.addEventListener("mousemove", a.C);
  document.addEventListener("mouseup", a.O);
}
function Kg(a, b, c) {
  b.preventDefault();
  b.stopPropagation();
  const d = a.l.za, f = b.clientX, e = b.clientY, g = d.v.floatW, h = d.v.floatH, k = d.v.floatX;
  a.D = l => {
    var m = l.clientX - f;
    l = l.clientY - e;
    c === "left" ? (m = Math.max(200, g - m), d.v.floatW = m, d.v.floatX = k + (g - m)) : c === "right" ? d.v.floatW = Math.max(200, g + m) : c === "bottom" ? d.v.floatH = Math.max(150, h + l) : c === "corner-br" && (d.v.floatW = Math.max(200, g + m), d.v.floatH = Math.max(150, h + l));
    a.i || (a.i = requestAnimationFrame(() => {
      a.i = 0;
      a.l.refresh();
    }));
  };
  a.H = () => {
    a.i && (cancelAnimationFrame(a.i), a.i = 0);
    document.removeEventListener("mousemove", a.D);
    document.removeEventListener("mouseup", a.H);
    a.D = null;
    a.H = null;
    a.l.refresh();
  };
  document.addEventListener("mousemove", a.D);
  document.addEventListener("mouseup", a.H);
}
function Lg(a) {
  const b = a.l.za, c = a.l.$f, d = c.sd === b.v.key;
  return v("div", {"data-section-key":b.v.key, style:{position:"relative"}}, v("div", {draggable:"true", onDragStart:f => a.l.kg(f), onDragOver:f => a.l.jg(f), onDrop:f => a.l.lg(f), onDragEnd:f => a.l.ig(f), onClick:() => a.l.ng(), onContextMenu:f => Hg(a, f), style:{display:"flex", alignItems:"center", gap:"4px", padding:"4px 10px", backgroundColor:"#2d2d2d", cursor:"grab", fontSize:"11px", fontWeight:"bold", letterSpacing:"0.3px", color:"#e0e0e0", borderTop:d && c.hc === "above" ? "2px solid #6af" : 
  "1px solid #444", borderBottom:d && c.hc === "below" ? "2px solid #6af" : "2px solid transparent", userSelect:"none"}}, v("span", {style:{color:"#aaa", fontSize:"9px", width:"10px"}}, b.v.collapsed ? "\u25b6" : "\u25bc"), a.l.title), a.l.za.state.Ua ? Ig(a) : null, b.v.collapsed ? null : v("div", null, v("div", {id:gg(b.v.key), className:"sidebar-scroll", style:{overflowY:"auto", height:a.l.height + "px", padding:"6px 8px"}}, a.g()), v("div", {className:a.l.te ? "section-sash" : "", onMouseDown:a.l.te, 
  style:{height:"4px", cursor:a.l.te ? "ns-resize" : "default", flexShrink:"0"}})));
}
function Mg(a) {
  const b = a.l.za, c = {position:"absolute", zIndex:"10"}, d = cg(b.v.floatX, b.v.floatY, b.v.floatW);
  b.v.floatX = d.x;
  b.v.floatY = d.y;
  return v("div", {id:"ploft-float-" + b.v.key, style:{position:"fixed", left:d.x + "px", top:d.y + "px", width:b.v.floatW + "px", height:b.v.floatH + "px", backgroundColor:"#1e1e1e", border:"1px solid #555", borderRadius:"6px", boxShadow:"0 6px 20px rgba(0,0,0,0.6)", display:"flex", flexDirection:"column", overflow:"hidden", zIndex:"50", pointerEvents:"auto", fontFamily:"sans-serif", fontSize:"12px", color:"#e0e0e0"}}, v("div", {onMouseDown:f => Jg(a, f), onContextMenu:f => Hg(a, f), style:{display:"flex", 
  alignItems:"center", justifyContent:"space-between", padding:"4px 10px", backgroundColor:"#2d2d2d", borderBottom:"1px solid #444", cursor:"grab", fontSize:"11px", fontWeight:"bold", letterSpacing:"0.3px", color:"#e0e0e0", userSelect:"none", flexShrink:"0"}}, a.l.title, v("span", {onClick:() => a.l.pf(), onMouseDown:f => f.stopPropagation(), style:{cursor:"pointer", color:"#888", fontSize:"13px", padding:"0 2px"}}, "\u00d7")), v("div", {className:"sidebar-scroll", style:{flex:"1", overflowY:"auto", 
  padding:"6px 8px"}}, a.g()), v("div", {onMouseDown:f => Kg(a, f, "left"), style:{...c, left:"0", top:"0", width:"5px", height:"100%", cursor:"ew-resize"}}), v("div", {onMouseDown:f => Kg(a, f, "right"), style:{...c, right:"0", top:"0", width:"5px", height:"100%", cursor:"ew-resize"}}), v("div", {onMouseDown:f => Kg(a, f, "bottom"), style:{...c, left:"0", bottom:"0", width:"100%", height:"5px", cursor:"ns-resize"}}), v("div", {onMouseDown:f => Kg(a, f, "corner-br"), style:{...c, right:"0", bottom:"0", 
  width:"10px", height:"10px", cursor:"nwse-resize"}}));
}
class Ng extends Wb.g {
  constructor(a) {
    super();
    this.l = a;
    this.H = this.D = this.O = this.C = null;
    this.i = 0;
  }
  Cc() {
    this.l.za.state.Ua = !1;
    this.l.refresh();
  }
  g() {
    return null;
  }
  render() {
    return this.l.za.v.floating ? Mg(this) : Lg(this);
  }
}
;function Og(a) {
  const b = a.data.state, c = b.zd.trim();
  c && !b.Ka.some(d => d.name === c) && (b.Ka.push({name:c, value:"", type:"text"}), b.zd = "", a.l.refresh());
}
function Pg(a, b, c, d) {
  a = a.data.state.Ka[b];
  d = d.currentTarget.value;
  var f = a.value.split(" ");
  b = f[0] || "";
  var e = (f[1] || "00:00").split(":");
  f = e[0] || "00";
  e = e[1] || "00";
  c === "h" ? f = d.padStart(2, "0") : e = d.padStart(2, "0");
  a.value = b + " " + f + ":" + e;
}
;function Qg(a, b) {
  var c = a.data.state;
  const d = c.oc, f = c.cb;
  var e = (new Date(d, f, 1)).getDay(), g = (new Date(d, f + 1, 0)).getDate();
  c = c.Ka[b];
  var h = -1;
  if (c.value) {
    var k = c.value.split("-");
    if (k.length >= 3) {
      var l = parseInt(k[1], 10) - 1, m = parseInt(k[2], 10);
      parseInt(k[0], 10) === d && l === f && (h = m);
    }
  }
  k = [];
  l = [];
  for (m = 0; m < e; m++) {
    l.push(v("td", {style:{width:"22px", height:"20px"}}));
  }
  for (m = 1; m <= g; m++) {
    const p = m, t = p === h;
    l.push(v("td", {onClick:() => {
      var q = a.data.state;
      const u = q.oc + "-" + String(q.cb + 1).padStart(2, "0") + "-" + String(p).padStart(2, "0");
      q = q.Ka[b];
      if (q.type === "datetime") {
        const r = q.value;
        q.value = u + (r && r.indexOf(" ") >= 0 ? r.substring(r.indexOf(" ")) : " 00:00");
      } else {
        q.value = u;
      }
      a.l.refresh();
    }, style:{width:"22px", height:"20px", textAlign:"center", cursor:"pointer", backgroundColor:t ? "#007fd4" : "transparent", color:t ? "#fff" : "#ccc", borderRadius:"2px", fontSize:"11px"}}, String(p)));
    (e + m) % 7 === 0 && (k.push(v("tr", null, l)), l = []);
  }
  if (l.length > 0) {
    for (; l.length < 7;) {
      l.push(v("td", {style:{width:"22px", height:"20px"}}));
    }
    k.push(v("tr", null, l));
  }
  e = c.type === "datetime";
  g = c.value && c.value.indexOf(" ") >= 0 ? c.value.split(" ")[1].split(":") : ["00", "00"];
  c = {cursor:"pointer", padding:"0 4px", color:"#6af", userSelect:"none"};
  h = {width:"30px", textAlign:"center", backgroundColor:"#2a2a2a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", padding:"1px 2px", fontSize:"11px", outline:"none"};
  return v("div", {style:{backgroundColor:"#252526", border:"1px solid #555", borderRadius:"4px", padding:"6px", marginTop:"4px", marginBottom:"4px"}}, v("div", {style:{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"4px", fontSize:"11px", color:"#e0e0e0"}}, v("span", {onClick:() => {
    const p = a.data.state;
    p.cb--;
    p.cb < 0 && (p.cb = 11, p.oc--);
    a.l.refresh();
  }, style:c}, "\u25c0"), v("span", null, "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ")[f] + " " + d), v("span", {onClick:() => {
    const p = a.data.state;
    p.cb++;
    p.cb > 11 && (p.cb = 0, p.oc++);
    a.l.refresh();
  }, style:c}, "\u25b6")), v("table", {style:{borderCollapse:"collapse", width:"100%"}}, v("thead", null, v("tr", null, "Su Mo Tu We Th Fr Sa".split(" ").map(p => v("th", {style:{width:"22px", fontSize:"10px", color:"#888", fontWeight:"normal", textAlign:"center", paddingBottom:"2px"}}, p)))), v("tbody", null, k)), e ? v("div", {style:{display:"flex", alignItems:"center", gap:"4px", marginTop:"6px", justifyContent:"center"}}, v("input", {type:"number", min:"0", max:"23", value:g[0], onInput:p => 
  Pg(a, b, "h", p), style:h}), v("span", {style:{color:"#888"}}, ":"), v("input", {type:"number", min:"0", max:"59", value:g[1], onInput:p => Pg(a, b, "m", p), style:h})) : null);
}
;class Rg extends Ng {
  constructor(a, b) {
    super(a);
    this.data = b;
  }
  g() {
    const a = this.data.state;
    return v("div", {style:{fontSize:"11px"}}, v("div", {style:{display:"flex", gap:"4px", marginBottom:"6px", paddingLeft:"4px"}}, v("input", {type:"text", value:a.zd, onInput:b => {
      this.data.state.zd = b.currentTarget.value;
    }, onKeyDown:b => {
      b.key === "Enter" && Og(this);
    }, placeholder:"name", style:{...eg, flex:"1"}}), v("button", {onClick:() => Og(this), style:{padding:"2px 8px", fontSize:"13px", cursor:"pointer", backgroundColor:"#3a3a3a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", lineHeight:"1"}}, "+")), a.Ka.map((b, c) => v("div", null, v("div", {style:{display:"flex", alignItems:"center", gap:"4px", marginBottom:"2px", paddingLeft:"4px"}}, v("span", {style:{color:"#9cdcfe", fontFamily:"monospace", fontSize:"11px", width:"20ch", minWidth:"20ch", 
    overflow:"hidden", textOverflow:"ellipsis", flexShrink:"0"}}, b.name), v("select", {onInput:d => {
      const f = this.data.state;
      f.Ka[c].type = d.currentTarget.value;
      f.Ka[c].value = "";
      f.bb === c && (f.bb = -1);
      this.l.refresh();
    }, style:fg}, v("option", {value:"text", selected:b.type === "text"}, "text"), v("option", {value:"int", selected:b.type === "int"}, "int"), v("option", {value:"double", selected:b.type === "double"}, "double"), v("option", {value:"date", selected:b.type === "date"}, "date"), v("option", {value:"datetime", selected:b.type === "datetime"}, "datetime")), b.type === "int" || b.type === "double" ? v("input", {type:"number", step:b.type === "int" ? "1" : "any", value:b.value, onInput:d => {
      this.data.state.Ka[c].value = d.currentTarget.value;
    }, style:{...eg, width:"55px", flex:"0 0 auto"}}) : b.type === "date" || b.type === "datetime" ? v("span", {onClick:() => {
      const d = this.data.state;
      if (d.bb === c) {
        d.bb = -1;
      } else {
        d.bb = c;
        var f = d.Ka[c].value;
        f ? (f = f.split("-"), f.length >= 3 && (d.oc = parseInt(f[0], 10) || (new Date()).getFullYear(), d.cb = (parseInt(f[1], 10) || 1) - 1)) : (d.oc = (new Date()).getFullYear(), d.cb = (new Date()).getMonth());
      }
      this.l.refresh();
    }, style:{cursor:"pointer", color:b.value ? "#e0e0e0" : "#666", fontFamily:"monospace", fontSize:"10px", padding:"1px 4px", backgroundColor:"#2a2a2a", border:"1px solid #555", borderRadius:"2px", flex:"1", textAlign:"center", minWidth:"0", overflow:"hidden", textOverflow:"ellipsis"}}, b.value || (b.type === "date" ? "select date" : "select date/time")) : v("input", {type:"text", value:b.value, onInput:d => {
      this.data.state.Ka[c].value = d.currentTarget.value;
    }, style:{...eg, flex:"1"}}), v("span", {onClick:() => {
      const d = this.data.state;
      d.bb === c ? d.bb = -1 : d.bb > c && d.bb--;
      d.Ka.splice(c, 1);
      this.l.refresh();
    }, style:{cursor:"pointer", color:"#888", fontSize:"13px", padding:"0 2px", flexShrink:"0"}}, "\u00d7")), a.bb === c ? Qg(this, c) : null)));
  }
}
;class Sg extends Ng {
  constructor(a, b) {
    super(a);
    this.data = b;
  }
  onClick() {
    this.data.state.A.count++;
    this.l.refresh();
  }
  g() {
    const a = this.data.state;
    return v("div", null, v("button", {onClick:() => this.onClick(), style:{padding:"6px 12px", fontSize:"12px", cursor:"pointer", backgroundColor:"#4CAF50", color:"white", border:"none", borderRadius:"3px"}}, "HELLO WORLD"), v("div", {style:{marginTop:"8px", fontSize:"12px", fontWeight:"bold", color:"#e0e0e0"}}, "COUNT : " + a.A.count));
  }
}
;function X(a, b) {
  return a.name + "/" + b.name;
}
;const Tg = {cursor:"pointer", padding:"2px 4px", backgroundColor:"#3a3a3a", border:"1px solid #555", borderRadius:"3px", fontSize:"10px", color:"#ccc", flexShrink:"0"}, Ug = {display:"flex", alignItems:"center", gap:"4px", padding:"4px 0", marginBottom:"4px", borderBottom:"1px solid #444", flexShrink:"0"}, Vg = {cursor:"pointer", padding:"2px 6px", backgroundColor:"#3a3a3a", border:"1px solid #555", borderRadius:"3px", fontSize:"10px", color:"#ccc"}, Wg = {color:"#666", fontSize:"11px", padding:"8px 0", 
textAlign:"center"}, Xg = {margin:"0", padding:"4px 6px", fontSize:"10px", fontFamily:"monospace", color:"#aaa", overflowY:"auto", overflowX:"hidden", whiteSpace:"pre", flex:"1", minHeight:"0"};
function Yg() {
  return {categories:[], assign:{}, names:{}, collapsed:{}, seq:1};
}
;function Zg(a, b) {
  for (let c = 0; c < a.categories.length; c++) {
    if (a.categories[c].id === b) {
      return !0;
    }
  }
  return !1;
}
function $g(a) {
  if (!a) {
    return Yg();
  }
  a.categories || (a.categories = []);
  a.assign || (a.assign = {});
  a.names || (a.names = {});
  a.collapsed || (a.collapsed = {});
  a.seq || (a.seq = 1);
  return a;
}
function ah(a, b, c) {
  const d = "c" + a.seq++;
  a.categories.push({id:d, name:c || "nova categoria", Wa:b || "__all__"});
  return d;
}
function bh(a, b, c) {
  for (let d = 0; d < a.categories.length; d++) {
    if (a.categories[d].id === b) {
      a.categories[d].name = c;
      break;
    }
  }
}
function ch(a, b) {
  let c = "__all__";
  for (var d = 0; d < a.categories.length; d++) {
    if (a.categories[d].id === b) {
      c = a.categories[d].Wa;
      break;
    }
  }
  for (d = 0; d < a.categories.length; d++) {
    a.categories[d].Wa === b && (a.categories[d].Wa = c);
  }
  for (const f in a.assign) {
    a.assign[f] === b && (c === "__all__" ? delete a.assign[f] : a.assign[f] = c);
  }
  a.categories = a.categories.filter(f => f.id !== b);
  delete a.collapsed[b];
}
function dh(a, b, c) {
  c && c !== "__all__" && c !== "__unclassified__" && Zg(a, c) ? a.assign[b] = c : delete a.assign[b];
}
function eh(a, b, c) {
  if (b !== c) {
    c = c === "__unclassified__" ? "__all__" : c;
    a: {
      var d = c;
      var f = {};
      for (let e = 0; e < a.categories.length; e++) {
        f[a.categories[e].id] = a.categories[e];
      }
      for (; d && d !== "__all__";) {
        if (d === b) {
          f = !0;
          break a;
        }
        d = (d = f[d]) ? d.Wa : null;
      }
      f = b === "__all__";
    }
    if (!f) {
      for (f = 0; f < a.categories.length; f++) {
        if (a.categories[f].id === b) {
          a.categories[f].Wa = c;
          break;
        }
      }
    }
  }
}
function fh(a, b) {
  const c = {};
  for (b = c[b] = !0; b;) {
    b = !1;
    for (let d = 0; d < a.categories.length; d++) {
      const f = a.categories[d];
      c[f.Wa] && !c[f.id] && (b = c[f.id] = !0);
    }
  }
  b = [];
  for (const d in a.assign) {
    c[a.assign[d]] && b.push(d);
  }
  return b;
}
function gh(a, b, c) {
  var d = {};
  for (var f = 0; f < b.length; f++) {
    d[b[f]] = !0;
  }
  for (const q in a.assign) {
    d[q] = !0;
  }
  for (const q in a.names) {
    d[q] = !0;
  }
  const e = {};
  for (b = 0; b < a.categories.length; b++) {
    f = a.categories[b], (e[f.Wa] = e[f.Wa] || []).push(f);
  }
  const g = {}, h = [];
  for (const q in d) {
    (d = a.assign[q]) && Zg(a, d) ? (g[d] = g[d] || []).push(q) : h.push(q);
  }
  const k = [], l = c || {}, m = (q, u) => {
    if (q === "item") {
      return [];
    }
    if (q === "unclassified") {
      return h.map(w => ({kind:"item", id:w}));
    }
    var r = (e[u] || []).map(w => ({kind:"cat", id:w.id}));
    u = (q === "cat" ? g[u] || [] : []).map(w => ({kind:"item", id:w}));
    r = r.concat(u);
    q === "all" && r.push({kind:"unclassified", id:"__unclassified__"});
    return r;
  }, p = (q, u) => {
    if (q === "all") {
      return "Todos";
    }
    if (q === "unclassified") {
      return "Nao classificados";
    }
    if (q === "item") {
      return l[u] || a.names[u] || u;
    }
    for (q = 0; q < a.categories.length; q++) {
      if (a.categories[q].id === u) {
        return a.categories[q].name;
      }
    }
    return u;
  }, t = (q, u, r, w, z) => {
    const A = a.collapsed[u] ? [] : m(q, u), B = m(q, u);
    k.push({key:q + ":" + u, kind:q, id:u, uuid:q === "item" ? u : "", name:p(q, u), depth:r, eg:z, Sf:w.slice(), pe:B.length > 0, count:(g[u] || []).length});
    q = w.concat([z]);
    for (u = 0; u < A.length; u++) {
      t(A[u].kind, A[u].id, r + 1, q, u === A.length - 1);
    }
  };
  t("all", "__all__", 0, [], !0);
  return k;
}
;function hh(a) {
  a = $g(a);
  a.folders || (a.folders = {});
  return a;
}
async function ih(a) {
  const b = a.u.qd;
  a = a.data.state.La;
  if (b && a) {
    try {
      if (await b.queryPermission({mode:"readwrite"}) !== "granted" && await b.requestPermission({mode:"readwrite"}) !== "granted") {
        console.warn("[gallery] classificacao: pasta sem permissao de escrita");
      } else {
        var c = await (await b.getFileHandle("ploft_classify.json", {create:!0})).createWritable();
        await c.write(JSON.stringify(a, null, 2));
        await c.close();
      }
    } catch (d) {
      console.warn("[gallery] classificacao: falha ao gravar", d);
    }
  }
}
function jh(a) {
  const b = a.data.state.La;
  if (!b) {
    return [];
  }
  const c = [], d = (f, e) => {
    for (let g = 0; g < b.categories.length; g++) {
      const h = b.categories[g];
      if (h.Wa !== f) {
        continue;
      }
      const k = b.categories.some(l => l.Wa === h.id);
      c.push({id:h.id, name:h.name, depth:e, pe:k, open:!b.collapsed[h.id], count:kh(a, h.id)});
      b.collapsed[h.id] || d(h.id, e + 1);
    }
  };
  d("__all__", 0);
  return c;
}
function lh(a, b) {
  a = a.data.state;
  const c = a.La, d = [], f = [];
  if (!c) {
    return {folders:d, files:f};
  }
  const e = {};
  for (var g = 0; g < a.folders.length; g++) {
    e[a.folders[g].name] = g;
  }
  for (var h in c.folders) {
    if (c.folders[h] !== b) {
      continue;
    }
    g = e[h];
    var k = 0;
    if (g !== void 0) {
      var l = a.folders[g];
      for (let m = 0; m < l.files.length; m++) {
        c.assign[X(l, l.files[m])] || k++;
      }
    }
    d.push({name:h, fa:g !== void 0 ? g : -1, count:k});
  }
  d.sort((m, p) => m.name < p.name ? -1 : 1);
  for (const m in c.assign) {
    if (c.assign[m] !== b) {
      continue;
    }
    g = m.lastIndexOf("/");
    h = e[m.slice(0, g)];
    if (h === void 0) {
      continue;
    }
    g = m.slice(g + 1);
    k = a.folders[h];
    for (l = 0; l < k.files.length; l++) {
      if (k.files[l].name === g) {
        f.push({fa:h, dg:l});
        break;
      }
    }
  }
  return {folders:d, files:f};
}
function kh(a, b) {
  a = lh(a, b);
  b = a.files.length;
  for (let c = 0; c < a.folders.length; c++) {
    b += a.folders[c].count;
  }
  return b;
}
function mh(a, b) {
  var c = a.data.state;
  a = c.La;
  b = c.folders[b];
  c = [];
  if (!b) {
    return c;
  }
  for (let d = 0; d < b.files.length; d++) {
    a && a.assign[X(b, b.files[d])] || c.push(d);
  }
  return c;
}
function nh(a, b) {
  var c = a.data.state.La;
  return c ? (c = c.categories.find(d => d.id === b)) ? {id:c.id, name:c.name, depth:0, pe:!1, open:!0, count:kh(a, b)} : null : null;
}
async function oh(a) {
  try {
    const b = await (await a.getFileHandle("ploft_classify.json")).getFile();
    return hh(JSON.parse(await b.text()));
  } catch (b) {
    return hh(null);
  }
}
function ph(a, b) {
  const c = a.data.state, d = c.La;
  d && (b(d), c.Ud++, a.u.layout = null, ih(a), a.l.refresh());
}
function qh(a, b) {
  return (a = a.data.state.La) && a.names[b] || b;
}
function rh(a) {
  a = a.data.state;
  const b = a.La, c = [];
  for (let d = 0; d < a.folders.length; d++) {
    const f = a.folders[d], e = [];
    if (!b || !b.folders[f.name]) {
      for (let g = 0; g < f.files.length; g++) {
        b && b.assign[X(f, f.files[g])] || e.push(g);
      }
    }
    c.push(e);
  }
  return c;
}
var sh = lh;
function th(a) {
  a = a.data.state;
  const b = a.La;
  if (!b) {
    return 0;
  }
  let c = 0;
  for (const d in a.ub) {
    a.ub[d] && b.folders[d] && c++;
  }
  for (const d in a.ca) {
    a.ca[d] && b.assign[d] && c++;
  }
  return c;
}
;function uh(a) {
  a.u.Vc || (a.u.Mc > 8 ? (a.u.Vc = 1, setTimeout(() => {
    a.u.Vc = 0;
    a.l.refresh();
  }, 150)) : a.u.Vc = requestAnimationFrame(() => {
    a.u.Vc = 0;
    a.l.refresh();
  }));
}
function vh() {
  return new Promise(a => setTimeout(a, 0));
}
async function wh(a) {
  if (!a.u.oe) {
    const b = new na("ploft.gallery");
    await b.init();
    a.u.oe = b;
  }
  return a.u.oe;
}
function xh(a, b) {
  a = X(a, b);
  b.kc = performance.now();
  return a;
}
async function yh(a, b, c) {
  var d = a.u.ne.get(c);
  if (d) {
    return d;
  }
  d = b;
  if (c !== b.name) {
    b = b.name + "/";
    b = (c.indexOf(b) === 0 ? c.substring(b.length) : c).split("/").filter(Boolean);
    try {
      for (const f of b) {
        d = await d.getDirectoryHandle(f);
      }
    } catch (f) {
      return console.warn("[gallery] folder missing", c, f), null;
    }
  }
  a.u.ne.set(c, d);
  return d;
}
async function zh(a, b, c) {
  if (c.handle) {
    return c.handle;
  }
  if (!a.u.qd) {
    return null;
  }
  a = await yh(a, a.u.qd, b.name);
  if (!a) {
    return null;
  }
  try {
    return c.handle = await a.getFileHandle(c.name), c.handle;
  } catch (d) {
    return null;
  }
}
async function Ah(a, b, c) {
  const d = xh(b, c);
  if (c.url) {
    return a.u.sb.set(d, c), c.url;
  }
  if (a.u.Zc.has(d)) {
    return null;
  }
  a.u.Zc.add(d);
  try {
    if (!c.handle && !await zh(a, b, c) || a.u.$c && !a.u.$c.has(d)) {
      return null;
    }
    const f = await c.handle.getFile();
    c.url = URL.createObjectURL(f);
    a.u.sb.set(d, c);
    a.u.jc && a.u.jc.has(d) && (a.u.jc.delete(d), !a.u.jc || a.u.jc.size > 0 || (a.u.jc = null));
    a.u.$c && !a.u.$c.has(d) || uh(a);
    return c.url;
  } catch (f) {
    return console.warn("[gallery] thumb load failed", d, f), null;
  } finally {
    a.u.Zc.delete(d);
  }
}
function Bh(a) {
  for (const b of a.u.sb.values()) {
    b.url && URL.revokeObjectURL(b.url), b.url = null;
  }
  a.u.sb.clear();
  a.u.Zc.clear();
  a.u.ne.clear();
  a.u.Mc = 0;
}
function Ch(a, b) {
  a = a.data.state;
  const c = a.be;
  if (c) {
    for (var d of b) {
      c.indexOf(d.name) >= 0 && (d.open = !0);
    }
    a.be = null;
  } else {
    d = {};
    for (const f of a.folders) {
      f.open && (d[f.name] = !0);
    }
    for (const f of b) {
      d[f.name] && (f.open = !0);
    }
  }
}
async function Dh(a, b, c) {
  var d = 0, f = 0, e = 0;
  const g = [], h = async(k, l) => {
    if (c === a.u.Ia) {
      d++;
      var m = [];
      for await (const p of k.values()) {
        if (c !== a.u.Ia) {
          return;
        }
        f++;
        if (p.kind === "file") {
          p.name.toLowerCase().endsWith(".svg") && (e++, m.push({name:p.name, url:null, handle:p, kc:0}));
        } else {
          if (await h(p, l + "/" + p.name), c !== a.u.Ia) {
            return;
          }
        }
        if ((f & 15) === 0 && (await vh(), c !== a.u.Ia)) {
          return;
        }
      }
      m.length > 0 && g.push({name:l, open:!1, files:m});
    }
  };
  await h(b, b.name);
  return c !== a.u.Ia ? null : g;
}
async function Eh(a, b, c) {
  await (await wh(a)).set("catalog_v1", {root:b.name, folders:c.map(d => ({name:d.name, files:d.files.map(f => f.name)}))});
}
async function Fh(a, b) {
  a = await (await wh(a)).get("catalog_v1");
  if (!a || a.root !== b.name || !Array.isArray(a.folders)) {
    return null;
  }
  b = [];
  for (const c of a.folders) {
    if (!c || !Array.isArray(c.files)) {
      continue;
    }
    a = [];
    for (const d of c.files) {
      a.push({name:d, url:null, handle:null, kc:0});
    }
    b.push({name:c.name, open:!1, files:a});
  }
  return b;
}
async function Gh(a) {
  const b = await (await wh(a)).get("view_v1");
  if (b) {
    var c = a.data.state;
    typeof b.scrollTop === "number" && (c.va = Math.max(0, b.scrollTop), a.u.Ub = c.va);
    if (Array.isArray(b.openFolders)) {
      for (const d of c.folders) {
        d.open = b.openFolders.indexOf(d.name) >= 0;
      }
    }
  }
}
async function Hh(a) {
  const b = a.data.state, c = b.folders.filter(d => d.open).map(d => d.name);
  await (await wh(a)).set("view_v1", {scrollTop:b.va, openFolders:c});
}
async function Ih(a, b) {
  a.u.Ia++;
  const c = a.u.Ia;
  a.u.qd = b;
  Bh(a);
  oh(b).then(h => {
    c === a.u.Ia && (a.data.state.La = h, a.data.state.Ud++, a.u.layout = null, a.l.refresh());
  });
  const d = await Fh(a, b);
  if (c === a.u.Ia) {
    if (d && d.length > 0) {
      Ch(a, d);
      a.data.state.folders = d;
      a.data.state.Td++;
      a.u.layout = null;
      await Gh(a);
      if (c !== a.u.Ia) {
        return;
      }
      d.reduce((h, k) => h + k.files.length, 0);
      a.l.refresh();
    }
    a.u.nc.scanStart = performance.now();
    var f = await Dh(a, b, c);
    if (f && c === a.u.Ia) {
      f.reduce((h, k) => h + k.files.length, 0);
      if (d) {
        const h = new Map();
        for (var e of d) {
          for (var g of e.files) {
            g.url && h.set(X(e, g), g);
          }
        }
        for (const k of f) {
          for (const l of k.files) {
            e = X(k, l), (g = h.get(e)) && g.url && (l.url = g.url, l.kc = g.kc, a.u.sb.set(e, l));
          }
        }
      }
      Ch(a, f);
      a.data.state.folders = f;
      a.data.state.Td++;
      a.u.layout = null;
      await Eh(a, b, f);
      c === a.u.Ia && (d || await Gh(a), c === a.u.Ia && a.l.refresh());
    }
  }
}
function Jh(a, b, c) {
  return {type:a, y:b, ma:c, fa:-1, we:-1, eb:0, Ob:0, catId:"", Ea:"", name:"", count:0, depth:0, open:!1};
}
function Kh(a, b, c, d, f, e) {
  const g = Math.ceil(c / d);
  for (let h = 0; h < g; h++) {
    const k = h < g - 1 ? f.grid : f.Yf, l = Jh(1, b, k);
    l.eb = h * d;
    l.Ob = Math.min(l.eb + d, c);
    l.we = h;
    e(l, h);
    a.push(l);
    b += k;
  }
  g > 0 && (b += 8);
  return b;
}
function Lh(a, b, c, d, f, e, g) {
  const h = a.data.state, k = l => {
    var m = Jh(3, c, 22);
    m.catId = l.id;
    m.name = l.name;
    m.depth = l.depth;
    m.open = l.open;
    m.count = l.count;
    b.push(m);
    c += 22;
    if (l.open) {
      m = sh(a, l.id);
      for (const q of m.folders) {
        const u = l.id + "|" + q.name;
        var p = !!h.tb[u], t = Jh(4, c, 22);
        t.catId = l.id;
        t.Ea = u;
        t.name = q.name;
        t.fa = q.fa;
        t.count = q.count;
        t.open = p;
        t.depth = l.depth + 1;
        b.push(t);
        c += 22;
        p && q.fa >= 0 && (p = mh(a, q.fa).map(r => ({f:q.fa, Qb:r})), e[u] = p, c = Kh(b, c, p.length, d, f, r => {
          r.catId = l.id;
          r.Ea = u;
          r.depth = l.depth + 1;
        }));
      }
      if (m.files.length) {
        const q = l.id + "|*files";
        p = !!h.tb[q];
        t = Jh(4, c, 22);
        t.catId = l.id;
        t.Ea = q;
        t.name = "(arquivos)";
        t.count = m.files.length;
        t.open = p;
        t.depth = l.depth + 1;
        b.push(t);
        c += 22;
        p && (m = m.files.map(u => ({f:u.fa, Qb:u.dg})), e[q] = m, c = Kh(b, c, m.length, d, f, u => {
          u.catId = l.id;
          u.Ea = q;
          u.depth = l.depth + 1;
        }));
      }
    }
  };
  if (g) {
    return (g = nh(a, g)) && k(g), c;
  }
  b.push(Jh(2, c, 23));
  c += 23;
  if (h.Jb) {
    for (const l of jh(a)) {
      k(l);
    }
  }
  return c;
}
function Mh(a, b, c, d, f, e) {
  a = a.data.state;
  var g = 0;
  for (var h = 0; h < e.length; h++) {
    g += e[h].length;
  }
  h = Jh(5, c, 27);
  h.count = g;
  b.push(h);
  c += 27;
  if (!a.Lb) {
    return c;
  }
  for (let k = 0; k < a.folders.length; k++) {
    g = e[k].length;
    if (!g) {
      continue;
    }
    h = Jh(0, c, f.folder);
    h.fa = k;
    h.count = g;
    b.push(h);
    c += f.folder;
    a.folders[k].open && (c = Kh(b, c, g, d, f, l => {
      l.fa = k;
    }));
  }
  return c;
}
function Nh(a, b, c) {
  var d = a.data.state, f = d.A.thumbSize + 2 + Math.ceil(d.A.fileFontSize * 1.2) + 2;
  f = {Yf:f, grid:f + d.A.thumbGap, folder:Math.ceil(d.A.folderFontSize * 1.2) + 6 + 2};
  b = Math.max(1, Math.floor((b + d.A.thumbGap) / (d.A.thumbSize + d.A.thumbGap)));
  d = rh(a);
  const e = [], g = {};
  let h = 0;
  c === "full" || c === "class" ? h = Lh(a, e, h, b, f, g, "") : c.indexOf("pinned:") === 0 && (h = Lh(a, e, h, b, f, g, c.slice(7)));
  if (c === "full" || c === "unclass") {
    h = Mh(a, e, h, b, f, d);
  }
  a = 0;
  for (c = 0; c < d.length; c++) {
    a += d[c].length;
  }
  return {rows:e, Ef:h, Tg:b, Rd:d, df:g, ph:a};
}
function Oh(a, b, c) {
  const d = X(b, c);
  c.url || a.u.Zc.has(d) || (a.u.Mc >= 50 ? uh(a) : (a.u.Mc++, Ah(a, b, c).finally(() => {
    a.u.Mc--;
  })));
}
function Ph(a, b) {
  var c = Math.max(300, b.size + 200);
  if (!(a.u.sb.size <= c)) {
    var d = [];
    a.u.sb.forEach((e, g) => {
      b.has(g) || d.push({key:g, file:e});
    });
    d.sort((e, g) => e.file.kc - g.file.kc);
    c = a.u.sb.size - c;
    var f = 0;
    for (const e of d) {
      if (c <= 0) {
        break;
      }
      e.file.url && URL.revokeObjectURL(e.file.url);
      e.file.url = null;
      a.u.sb.delete(e.key);
      c--;
      f++;
    }
  }
}
async function Qh(a) {
  a.data.state.Oe = !0;
  a.u.nc.open || (a.u.nc.open = performance.now(), a.u.xd = !0);
  var b = new na("ploft.gallery");
  await b.init();
  (b = await b.get("pictures")) && await qa(b) && await Ih(a, b);
}
function Rh(a) {
  a.u.Qd && clearTimeout(a.u.Qd);
  a.u.Qd = setTimeout(() => {
    a.u.Qd = 0;
    Hh(a);
  }, 300);
}
function Sh(a, b, c) {
  const d = a.data.state;
  c = c || "full";
  const f = c + "|" + d.A.thumbSize + "," + d.A.thumbGap + "," + d.A.folderFontSize + "," + d.A.fileFontSize + "," + b + "," + d.Td + "," + d.Ud + "," + (d.Jb ? "C" : "c") + (d.Lb ? "U" : "u") + "," + Object.keys(d.tb).filter(h => d.tb[h]).join(";") + "," + d.folders.map(h => h.files.length + (h.open ? "o" : "c")).join(",");
  a.u.layout || (a.u.re = {});
  const e = a.u.re || (a.u.re = {}), g = e[c];
  g && g.key === f || (e[c] = {key:f, layout:Nh(a, b, c)});
  c !== "class" && (a.u.layout = e[c].layout, a.u.fg = f);
  return e[c].layout;
}
;function Th(a) {
  return a.data.state.A.pinned === "*unclass" ? "unclass" : "full";
}
function Uh(a) {
  var b = a.data.state;
  const c = new Set(), d = f => {
    if (f && f.open) {
      var e = sh(a, f.id);
      for (const g of e.folders) {
        c.add(f.id + "|" + g.name);
      }
      e.files.length && c.add(f.id + "|*files");
    }
  };
  for (const f of jh(a)) {
    d(f);
  }
  (b = b.A.pinned) && b !== "*unclass" && d(nh(a, b));
  return Array.from(c);
}
function Vh(a) {
  const b = a.data.state, c = rh(a);
  for (let d = 0; d < b.folders.length; d++) {
    if (c[d].length && !b.folders[d].open) {
      return !1;
    }
  }
  return Uh(a).every(d => !!b.tb[d]);
}
async function Wh(a) {
  const b = await Aa({Gc:"ploft.gallery", key:"pictures", reload:!0});
  b.handle && (a.u.nc = {}, a.u.nc.open = performance.now(), a.u.xd = !0, await Ih(a, b.handle));
}
async function Xh(a, b, c, d) {
  const f = a.data.state;
  f.aa = {fileName:d.name, Jc:c.name, url:d.url, x:b.clientX, y:b.clientY, w:280, ma:200, pinned:!1, Xb:null};
  a.l.refresh();
  const e = await Ah(a, c, d);
  e && f.aa && f.aa.fileName === d.name && f.aa.Jc === c.name && (f.aa.url = e, a.l.refresh(), fetch(e).then(g => g.text()).then(g => {
    f.aa && f.aa.url === e && (f.aa.Xb = g, a.l.refresh());
  }));
}
function Yh(a) {
  a.data.state.aa = null;
  a.l.refresh();
}
function Zh(a, b) {
  const c = a.data.state.aa;
  if (c && c.pinned) {
    b.preventDefault();
    var d = b.clientX, f = b.clientY, e = c.x, g = c.y, h = document.getElementById("gallery-ctx-menu"), k = m => {
      h && (h.style.left = e + m.clientX - d + "px", h.style.top = g + m.clientY - f + "px");
    }, l = m => {
      c.x = e + m.clientX - d;
      c.y = g + m.clientY - f;
      document.removeEventListener("mousemove", k);
      document.removeEventListener("mouseup", l);
      a.l.refresh();
    };
    document.addEventListener("mousemove", k);
    document.addEventListener("mouseup", l);
  }
}
function $h(a, b) {
  const c = a.data.state.aa;
  if (c) {
    b.preventDefault();
    b.stopPropagation();
    var d = b.clientX, f = b.clientY, e = c.w, g = c.ma, h = document.getElementById("gallery-ctx-menu"), k = m => {
      h && (h.style.width = Math.max(200, e + m.clientX - d) + "px", h.style.height = Math.max(100, g + m.clientY - f) + "px");
    }, l = m => {
      c.w = Math.max(200, e + m.clientX - d);
      c.ma = Math.max(100, g + m.clientY - f);
      document.removeEventListener("mousemove", k);
      document.removeEventListener("mouseup", l);
      a.l.refresh();
    };
    document.addEventListener("mousemove", k);
    document.addEventListener("mouseup", l);
  }
}
function ai(a) {
  ph(a, b => {
    ah(b, "__all__", "novo classificador");
  });
}
function bi(a, b, c) {
  c.trim() && ph(a, d => {
    bh(d, b, c.trim());
  });
}
function ci(a, b) {
  a.data.state.A.pinned === b && (a.data.state.A.pinned = "");
  ph(a, c => {
    let d = "__all__";
    for (let f = 0; f < c.categories.length; f++) {
      if (c.categories[f].id === b) {
        d = c.categories[f].Wa;
        break;
      }
    }
    ch(c, b);
    for (const f in c.folders) {
      c.folders[f] === b && (d === "__all__" ? delete c.folders[f] : c.folders[f] = d);
    }
  });
}
function di(a, b) {
  ph(a, c => {
    c.collapsed[b] = !c.collapsed[b];
  });
}
function ei(a, b) {
  const c = a.data.state, d = c.Kb, f = c.Ya, e = c.Xa;
  c.Kb = "";
  c.Ya = "";
  c.Xa = null;
  ph(a, g => {
    if (d && d !== b) {
      eh(g, d, b);
    } else if (f) {
      g.folders[f] = b;
    } else if (e) {
      for (const h of e) {
        g.assign[h] = b;
      }
    }
  });
}
function fi(a) {
  const b = a.data.state, c = b.Ya, d = b.Xa;
  b.Kb = "";
  b.Ya = "";
  b.Xa = null;
  (c || d) && ph(a, f => {
    c && delete f.folders[c];
    if (d) {
      for (const e of d) {
        delete f.assign[e];
      }
    }
  });
}
function gi(a) {
  const b = a.data.state, c = b.ca, d = b.ub;
  ph(a, f => {
    for (const e in d) {
      d[e] && delete f.folders[e];
    }
    for (const e in c) {
      c[e] && f.assign[e] && delete f.assign[e];
    }
  });
  b.ca = {};
  b.ub = {};
}
function hi(a, b) {
  const c = a.data.state.A;
  c.pinned = c.pinned === b ? "" : b;
  a.l.refresh();
}
function ii(a, b) {
  b.preventDefault();
  const c = a.data.state.A, d = b.clientY, f = c.splitH, e = document.getElementById("gallery-pane-bot-" + a.l.za.v.key), g = e && e.parentElement ? Math.max(80, e.parentElement.clientHeight - 80) : 600, h = l => {
    e && (e.style.height = Math.min(g, Math.max(60, f + (d - l.clientY))) + "px");
  }, k = l => {
    c.splitH = Math.min(g, Math.max(60, f + (d - l.clientY)));
    document.removeEventListener("mousemove", h);
    document.removeEventListener("mouseup", k);
    a.l.refresh();
  };
  document.addEventListener("mousemove", h);
  document.addEventListener("mouseup", k);
}
function ji(a, b, c) {
  ph(a, d => {
    const f = c.trim();
    f && f !== b ? d.names[b] = f : delete d.names[b];
  });
}
function ki(a) {
  a = a.data.state;
  if (!a.La || !a.aa) {
    return null;
  }
  const b = a.La;
  return {Xe:(b.assign || {})[a.aa.Jc + "/" + a.aa.fileName] || "", Xf:b.categories || []};
}
function li(a, b) {
  const c = a.data.state;
  if (c.aa) {
    var d = c.aa.Jc + "/" + c.aa.fileName;
    ph(a, f => {
      dh(f, d, b || "__unclassified__");
    });
  }
}
function mi(a, b) {
  b = b.currentTarget;
  const c = b.value.trim(), d = a.data.state;
  if (c && d.aa) {
    b.value = "";
    var f = d.aa.Jc + "/" + d.aa.fileName;
    ph(a, e => {
      const g = ah(e, "__all__", c);
      dh(e, f, g);
    });
  }
}
function ni(a, b, c) {
  b = b.currentTarget;
  const d = a.data.state;
  c ? (d.jd = b.scrollTop, d.de = b.clientHeight) : (d.va = b.scrollTop, d.kd = b.clientHeight, a.u.Ub = -1, Rh(a));
  a.u.ue || (a.u.ue = requestAnimationFrame(() => {
    a.u.ue = 0;
    a.l.refresh();
  }));
}
;class oi {
  constructor(a, b, c) {
    this.kind = 1;
    this.g = a;
    this.h = b;
    this.data = c;
  }
}
var pi = null;
const qi = {};
function ri(a, b, c) {
  return a === c ? v("option", {value:a, selected:!0}, b) : v("option", {value:a}, b);
}
function si(a, b) {
  const c = a.data.state, d = c.folders[b.fa], f = b.fa;
  b = b.count;
  return v("div", {lid:"fh-" + f, draggable:"true", onDragStart:() => {
    c.Ya = d.name;
  }, onDragEnd:() => {
    c.Ya = "";
  }, onClick:() => {
    const e = a.data.state, g = a.u.layout;
    let h = 0;
    if (g) {
      for (var k of g.rows) {
        if (k.type === 0 && k.fa === f) {
          h = k.y;
          break;
        }
      }
    }
    e.folders[f].open = !e.folders[f].open;
    a.u.layout = null;
    k = document.getElementById("gallery-vscroll-" + a.l.za.v.key);
    const l = Sh(a, k ? k.clientWidth : e.hd || 200, Th(a));
    let m = 0;
    for (const p of l.rows) {
      if (p.type === 0 && p.fa === f) {
        m = p.y;
        break;
      }
    }
    g && h < e.va && (e.va += m - h, k && (k.scrollTop = e.va));
    Rh(a);
    a.l.refresh();
  }, style:{display:"flex", alignItems:"center", gap:"4px", padding:"3px 4px", cursor:"pointer", fontSize:c.A.folderFontSize + "px", color:"#ccc", backgroundColor:"#2a2a2a", borderRadius:"2px", userSelect:"none", marginBottom:"2px"}}, v("span", {style:{color:"#888", fontSize:"10px", width:"10px"}}, d.open ? "\u25be" : "\u25b8"), v("input", {lid:"nm", value:qh(a, d.name), title:d.name, onChange:e => ji(a, d.name, e.currentTarget.value), onMouseDown:e => e.stopPropagation(), onClick:e => e.stopPropagation(), 
  style:{background:"transparent", border:"1px solid transparent", color:"#ccc", fontSize:c.A.folderFontSize + "px", flex:"1", minWidth:"0", outline:"none", padding:"0 2px"}}), v("span", {style:{color:"#666", fontSize:"10px"}}, String(b)));
}
function ti(a, b, c, d, f, e) {
  const g = b.url, h = !!g;
  return v("div", {lid:"gt-" + b.name, draggable:h ? "true" : "false", onDragStart:k => {
    if (b.url) {
      var l = k.currentTarget.querySelector("img");
      if (l) {
        var m = l.getBoundingClientRect();
        l = Math.max(0, Math.min(m.width, k.clientX - m.left));
        var p = Math.max(0, Math.min(m.height, k.clientY - m.top));
        m = {url:b.url, w:m.width, ma:m.height};
        k.dataTransfer.setData("application/x-ploft", JSON.stringify(m));
        k.dataTransfer.effectAllowed = "copy";
        pi = new oi(l, p, m);
        var t = a.data.state;
        k = X(d, b);
        t.Xa = t.ca[k] ? Object.keys(t.ca).filter(q => t.ca[q]) : [k];
      } else {
        k.preventDefault();
      }
    } else {
      k.preventDefault(), Oh(a, d, b);
    }
  }, onDragEnd:() => {
    pi = null;
    a.data.state.Xa = null;
  }, onClick:k => {
    a: {
      var l = a.data.state;
      const p = X(d, b);
      if (k.shiftKey && l.ac && l.ac.substring(0, l.ac.lastIndexOf("/")) === d.name) {
        const t = l.ac.substring(l.ac.lastIndexOf("/") + 1);
        var m = -1;
        for (let q = 0; q < d.files.length; q++) {
          if (d.files[q].name === t) {
            m = q;
            break;
          }
        }
        if (m >= 0) {
          k.ctrlKey || (l.ca = {});
          k = Math.min(m, e);
          for (m = Math.max(m, e); k <= m; k++) {
            l.ca[X(d, d.files[k])] = !0;
          }
          a.l.refresh();
          l = void 0;
          break a;
        }
      }
      k.ctrlKey ? l.ca[p] ? delete l.ca[p] : l.ca[p] = !0 : (l.ca = {}, l.ca[p] = !0);
      l.ac = p;
      a.l.refresh();
      l = void 0;
    }
    return l;
  }, onContextMenu:k => {
    k.preventDefault();
    k.stopPropagation();
    Xh(a, k, d, b);
  }, style:{display:"flex", flexDirection:"column", alignItems:"center", cursor:h ? "grab" : "default"}}, v("div", {style:{width:c + "px", height:c + "px", backgroundColor:a.data.state.A.thumbBg, border:f ? "2px solid #4a9eff" : "1px solid #444", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden"}}, g ? v("img", {src:g, style:{maxWidth:"100%", maxHeight:"100%", objectFit:"contain"}}) : v("span", {style:{fontSize:"10px", color:"#555", fontFamily:"monospace"}}, 
  "\u2026")), v("span", {style:{fontSize:a.data.state.A.fileFontSize + "px", color:"#888", maxWidth:c + "px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", textAlign:"center", marginTop:"2px"}}, b.name.replace(/\.svg$/i, "")));
}
const ui = {display:"flex", alignItems:"center", gap:"4px", height:"22px", whiteSpace:"nowrap"}, vi = {width:"14px", textAlign:"center", cursor:"pointer", color:"#888", fontSize:"10px", flexShrink:"0"}, wi = {color:"#888", fontSize:"10px", flexShrink:"0"}, xi = {width:"14px", textAlign:"center", cursor:"pointer", color:"#a66", fontSize:"11px", flexShrink:"0"};
function yi(a) {
  const b = a.data.state, c = th(a), d = jh(a).length;
  return v("div", {lid:"ct", style:{...ui, borderBottom:"1px solid #333"}}, v("span", {onClick:() => {
    b.Jb = !b.Jb;
    a.l.refresh();
  }, style:{...vi, color:"#6af", width:"auto"}}, b.Jb ? "[\u2212]" : "[+]"), v("span", {onClick:() => {
    b.Jb = !b.Jb;
    a.l.refresh();
  }, style:{color:"#7fd1e0", fontSize:"11px", fontWeight:"bold", letterSpacing:"0.3px", cursor:"pointer"}}, "CLASSIFICAR"), v("span", {style:wi}, "(" + d + ")"), c ? v("button", {onClick:() => gi(a), style:{...Vg, marginLeft:"auto", background:"#5a2a2a", color:"#f0c0c0"}}, "remover classificacao (" + c + ")") : null, v("button", {onClick:() => ai(a), title:"novo classificador", style:{...Vg, marginLeft:c ? "0" : "auto"}}, "+"));
}
function zi(a, b) {
  const c = a.data.state;
  return v("div", {lid:"c-" + b.catId, draggable:"true", onDragStart:() => {
    c.Kb = b.catId;
  }, onDragEnd:() => {
    c.Kb = "";
  }, onDragOver:d => {
    (c.Ya || c.Xa && c.Xa.length || c.Kb && c.Kb !== b.catId) && d.preventDefault();
  }, onDrop:d => {
    d.preventDefault();
    ei(a, b.catId);
  }, style:{...ui, marginLeft:b.depth * 14 + "px"}}, v("span", {style:vi, onClick:() => di(a, b.catId)}, b.open ? "\u2212" : "+"), v("input", {value:b.name, onChange:d => bi(a, b.catId, d.currentTarget.value), onMouseDown:d => d.stopPropagation(), style:{background:"transparent", border:"1px solid transparent", color:"#7fd1e0", fontWeight:"bold", fontSize:"11px", flex:"1", minWidth:"0", outline:"none", padding:"1px 3px"}}), v("span", {style:wi}, "(" + b.count + ")"), v("span", {title:c.A.pinned === 
  b.catId ? "desfixar" : "fixar embaixo", onClick:() => hi(a, b.catId), style:{cursor:"pointer", fontSize:"10px", flexShrink:"0", opacity:c.A.pinned === b.catId ? "1" : "0.35"}}, "\ud83d\udccc"), v("span", {title:"apagar classificador", style:xi, onClick:() => ci(a, b.catId)}, "\u00d7"));
}
function Ai(a, b) {
  const c = a.data.state, d = b.Ea.slice(-7) === "|*files";
  return v("div", {lid:"g-" + b.Ea, draggable:d ? "false" : "true", onDragStart:d ? null : () => {
    c.Ya = b.name;
  }, onDragEnd:d ? null : () => {
    c.Ya = "";
  }, style:{...ui, marginLeft:b.depth * 14 + "px", background:!d && c.ub[b.name] ? "#2d3a44" : "transparent"}}, v("span", {style:vi, onClick:() => {
    var f = b.Ea;
    const e = a.data.state;
    e.tb[f] = !e.tb[f];
    a.l.refresh();
  }}, b.open ? "\u2212" : "+"), d ? v("span", {style:{color:"#aac", fontSize:"11px", flex:"1"}}, "(arquivos)") : v("span", {lid:"ic", onClick:() => {
    var f = b.name;
    const e = a.data.state;
    e.ub[f] ? delete e.ub[f] : e.ub[f] = !0;
    a.l.refresh();
  }, title:"selecionar (p/ remover classificacao)", style:{cursor:"pointer", fontSize:"11px", flexShrink:"0"}}, "\ud83d\udcc1"), d ? null : v("input", {lid:"nm", value:qh(a, b.name), title:b.name, onChange:f => ji(a, b.name, f.currentTarget.value), onMouseDown:f => f.stopPropagation(), style:{background:"transparent", border:"1px solid transparent", color:"#cba", fontSize:"11px", flex:"1", minWidth:"0", outline:"none", padding:"1px 3px"}}), v("span", {style:wi}, String(b.count)));
}
function Bi(a, b) {
  const c = a.data.state;
  return v("div", {lid:"uh", onDragOver:d => {
    (c.Ya || c.Xa && c.Xa.length) && d.preventDefault();
  }, onDrop:d => {
    d.preventDefault();
    fi(a);
  }, style:{...ui, borderBottom:"1px solid #333", marginTop:"4px"}}, v("span", {style:{...vi, color:"#6af", width:"auto"}, onClick:() => {
    c.Lb = !c.Lb;
    a.l.refresh();
  }}, c.Lb ? "[\u2212]" : "[+]"), v("span", {onClick:() => {
    c.Lb = !c.Lb;
    a.l.refresh();
  }, style:{color:"#999", fontSize:"11px", fontWeight:"bold", letterSpacing:"0.3px", cursor:"pointer"}}, "(nao classificado)"), v("span", {style:wi}, "(" + b.count + ")"), v("span", {title:c.A.pinned === "*unclass" ? "desfixar" : "fixar embaixo", onClick:() => hi(a, "*unclass"), style:{cursor:"pointer", fontSize:"10px", marginLeft:"auto", opacity:c.A.pinned === "*unclass" ? "1" : "0.35"}}, "\ud83d\udccc"));
}
function Ci(a) {
  if (!a.data.state.aa) {
    return null;
  }
  const b = ki(a);
  return b ? v("div", {style:{display:"flex", gap:"4px", alignItems:"center", padding:"4px 6px", borderBottom:"1px solid #444", flexShrink:"0"}}, v("span", {style:{fontSize:"10px", color:"#888", flexShrink:"0"}}, "cat:"), v("select", {onChange:c => li(a, c.currentTarget.value), style:{...fg, flex:"1", width:"auto"}}, ri("", "(sem categoria)", b.Xe), b.Xf.map(c => ri(c.id, c.name, b.Xe))), v("input", {placeholder:"nova...", onChange:c => mi(a, c), style:{...eg, width:"70px", flexShrink:"0"}})) : null;
}
function Di(a) {
  const b = a.data.state, c = b.A.toolbarMode, d = c !== "bg";
  let f = 40, e = 200, g = b.A.thumbSize, h = b.A.thumbSize + "px";
  c === "gap" ? (f = 0, e = 24, g = b.A.thumbGap, h = b.A.thumbGap + "px") : c === "folder" ? (f = 6, e = 20, g = b.A.folderFontSize, h = b.A.folderFontSize + "px") : c === "file" && (f = 6, e = 16, g = b.A.fileFontSize, h = b.A.fileFontSize + "px");
  return v("div", {style:Ug}, v("div", {onClick:() => Wh(a), style:{...Tg, padding:"2px 6px", fontSize:"11px", whiteSpace:"nowrap"}}, "\ud83d\udcc2"), v("select", {onChange:k => {
    a.data.state.A.toolbarMode = k.target.value;
    a.l.refresh();
  }, style:{...fg, width:"62px"}}, ri("size", "image", c), ri("gap", "spacing", c), ri("folder", "folder", c), ri("file", "file", c), ri("bg", "bg color", c)), d ? v("input", {type:"range", min:String(f), max:String(e), value:String(g), onInput:k => {
    const l = a.data.state, m = document.getElementById("gallery-vscroll-" + a.l.za.v.key);
    var p = null;
    let t = 0;
    if (a.u.layout && m) {
      var q = a.u.layout;
      for (const r of q.rows) {
        if (r.type === 1 && !r.Ea && r.y + r.ma > l.va) {
          p = l.folders[r.fa];
          p = X(p, p.files[q.Rd[r.fa][r.eb]]);
          t = r.y - l.va;
          break;
        }
      }
    }
    k = parseInt(k.target.value, 10);
    l.A.toolbarMode === "size" ? l.A.thumbSize = k : l.A.toolbarMode === "gap" ? l.A.thumbGap = k : l.A.toolbarMode === "folder" ? l.A.folderFontSize = k : l.A.toolbarMode === "file" && (l.A.fileFontSize = k);
    a.u.layout = null;
    if (p && m) {
      k = Sh(a, m.clientWidth, Th(a));
      for (var u of k.rows) {
        if (u.type === 1 && !u.Ea && (q = l.folders[u.fa], X(q, q.files[k.Rd[u.fa][u.eb]]) === p)) {
          u = Math.max(0, u.y - t);
          l.va = u;
          m.scrollTop = u;
          break;
        }
      }
    }
    a.l.refresh();
  }, style:{flex:"1", height:"14px", cursor:"pointer"}}) : null, d ? v("span", {style:{fontSize:"10px", color:"#888", minWidth:"28px"}}, h) : null, d ? null : v("input", {type:"color", value:b.A.thumbBg, onInput:k => {
    a.data.state.A.thumbBg = k.target.value;
    a.l.refresh();
  }, style:{flex:"1", height:"24px", border:"none", cursor:"pointer"}}), v("div", {onClick:() => {
    const k = a.data.state, l = !Vh(a);
    for (const m of k.folders) {
      m.open = l;
    }
    for (const m of Uh(a)) {
      k.tb[m] = l;
    }
    a.u.layout = null;
    Rh(a);
    a.l.refresh();
  }, title:b.folders.length && Vh(a) ? "Close all" : "Open all", style:Tg}, b.folders.length && Vh(a) ? "\u25b8\u25b8" : "\u25be\u25be"));
}
function Ei(a, b, c) {
  switch(b.type) {
    case 2:
      return yi(a);
    case 3:
      return zi(a, b);
    case 4:
      return Ai(a, b);
    case 5:
      return Bi(a, b);
    case 0:
      return si(a, b);
    case 1:
      if (b.Ea) {
        var d = a.data.state, f = d.A.thumbSize, e = c.df[b.Ea];
        c = [];
        for (var g = b.eb; g < b.Ob; g++) {
          var h = e[g], k = d.folders[h.f];
          const l = k.files[h.Qb];
          xh(k, l);
          l.url || Oh(a, k, l);
          c.push(ti(a, l, f, k, !!d.ca[X(k, l)], h.Qb));
        }
        a = v("div", {lid:"gc-" + b.Ea + "-" + b.we, style:{display:"grid", gridTemplateColumns:"repeat(" + (b.Ob - b.eb) + ", " + f + "px)", gap:d.A.thumbGap + "px", paddingLeft:(b.depth + 1) * 14 + "px"}}, c);
      } else {
        d = a.data.state;
        f = d.folders[b.fa];
        e = d.A.thumbSize;
        c = c.Rd[b.fa];
        g = [];
        for (h = b.eb; h < b.Ob; h++) {
          k = f.files[c[h]], xh(f, k), k.url || Oh(a, f, k), g.push(ti(a, k, e, f, !!d.ca[X(f, k)], c[h]));
        }
        a = v("div", {lid:"gr-" + b.fa + "-" + b.we, style:{display:"grid", gridTemplateColumns:"repeat(" + (b.Ob - b.eb) + ", " + e + "px)", gap:d.A.thumbGap + "px", justifyContent:"center"}}, g);
      }
      return a;
  }
  return null;
}
function Fi(a) {
  const b = a.data.state.aa;
  if (!b) {
    return null;
  }
  const c = b.pinned, d = b.Jc + "/" + b.fileName, f = v("div", {id:"gallery-ctx-menu", style:{position:"fixed", left:b.x + "px", top:b.y + "px", width:b.w + "px", height:b.ma + "px", backgroundColor:"#1e1e1e", border:"1px solid #555", borderRadius:"4px", boxShadow:"0 4px 12px rgba(0,0,0,0.5)", zIndex:"9999", display:"flex", flexDirection:"column", overflow:"hidden"}}, v("div", {style:{display:"flex", alignItems:"center", padding:"4px 6px", borderBottom:"1px solid #444", cursor:c ? "move" : "default", 
  flexShrink:"0"}, onMouseDown:c ? e => Zh(a, e) : null}, v("span", {onClick:() => {
    const e = a.data.state.aa;
    e && (e.pinned = !e.pinned, a.l.refresh());
  }, style:{cursor:"pointer", fontSize:"12px", opacity:c ? 1 : 0.4}, title:c ? "Unpin" : "Pin"}, "\ud83d\udccc"), v("span", {style:{flex:"1", marginLeft:"6px", fontSize:"11px", color:"#ccc", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}, d), v("span", {onClick:() => Yh(a), style:{cursor:"pointer", fontSize:"14px", color:"#888", paddingLeft:"8px"}}, "\u2715")), v("div", {style:{padding:"4px 6px", borderBottom:"1px solid #444", flexShrink:"0", display:"flex", gap:"4px"}}, v("button", 
  {onClick:() => {
    navigator.clipboard.writeText(d);
  }, style:Vg}, "Copy Name"), v("button", {onClick:() => {
    b.Xb && navigator.clipboard.writeText(b.Xb);
  }, style:Vg}, "Copy Text"), v("button", {onClick:() => {
    const e = a.data.state.aa;
    if (e && e.Xb) {
      let h = e.Xb.replace(/>\s+</g, "><").trim();
      const k = [];
      let l = 0;
      const m = /(<\/[^>]+>|<[^>]*\/\s*>|<[^>]+>|[^<]+)/g;
      for (var g; (g = m.exec(h)) !== null;) {
        g = g[1], g.charAt(0) !== "<" ? k.push("  ".repeat(l) + g.trim()) : g.substring(0, 2) === "</" ? (l = Math.max(0, l - 1), k.push("  ".repeat(l) + g)) : g.charAt(g.length - 2) === "/" || g.substring(0, 4) === "\x3c!--" ? k.push("  ".repeat(l) + g) : (k.push("  ".repeat(l) + g), l++);
      }
      e.Xb = k.join("\n");
      a.l.refresh();
    }
  }, style:Vg}, "Parse")), Ci(a), v("pre", {style:Xg}, b.Xb || "Loading..."), v("div", {onMouseDown:e => $h(a, e), style:{position:"absolute", right:"0", bottom:"0", width:"8px", height:"8px", cursor:"nwse-resize", background:"linear-gradient(135deg, transparent 50%, #888 50%)"}}));
  return c ? f : v("div", null, v("div", {onClick:() => Yh(a), onContextMenu:e => {
    e.preventDefault();
    Yh(a);
  }, style:{position:"fixed", top:"0", left:"0", right:"0", bottom:"0", zIndex:"9998"}}), f);
}
;function Gi(a, b, c, d, f, e) {
  const g = a.data.state;
  var h = Math.max(0, b.Ef - d);
  c > h && (c = h, f && (f.scrollTop = h));
  d = c + d + 200;
  var k;
  f = b.rows;
  h = 0;
  for (var l = f.length; h < l;) {
    var m = h + l >>> 1;
    f[m].y + f[m].ma <= Math.max(0, c - 200) ? h = m + 1 : l = m;
  }
  for (f = k = h; f < b.rows.length && b.rows[f].y < d;) {
    f++;
  }
  d = f;
  f = b.rows;
  h = k > 0 ? f[k].y : 0;
  l = d > 0 ? f[d - 1] : null;
  l = Math.max(0, b.Ef - (l ? l.y + l.ma : 0));
  for (m = []; k < d; k++) {
    const u = f[k];
    if (u.type === 1) {
      if (u.Ea) {
        var p = b.df[u.Ea];
        for (var t = u.eb; t < u.Ob; t++) {
          var q = g.folders[p[t].f];
          e.add(X(q, q.files[p[t].Qb]));
        }
      } else {
        for (p = g.folders[u.fa], t = b.Rd[u.fa], q = u.eb; q < u.Ob; q++) {
          e.add(X(p, p.files[t[q]]));
        }
      }
    }
    m.push(Ei(a, u, b));
  }
  return {bg:m, Df:h, Qe:l, Se:c};
}
class Hi extends Ng {
  constructor(a, b) {
    super(a);
    this.data = b;
    b.state.u || (b.state.u = {sb:new Map(), Zc:new Set(), Mc:0, Vc:0, oe:null, qd:null, ne:new Map(), Ia:0, Ub:-1, Qd:0, nc:{}, jc:null, xd:!1, layout:null, fg:"", ue:0, $c:null, re:null});
    this.u = b.state.u;
  }
  render() {
    const a = this.data.state;
    !a.Oe && a.Ee && Qh(this);
    return super.render();
  }
  g() {
    const a = this.data.state;
    var b = this.l.za.v.key;
    const c = "gallery-vscroll-" + b;
    var d = "gallery-vscroll2-" + b;
    const f = "gallery-pane-bot-" + b;
    if (a.folders.length === 0) {
      return v("div", {style:{display:"flex", flexDirection:"column", height:"100%"}}, Di(this), v("div", {style:Wg}, "Click \ud83d\udcc2 to select a folder"));
    }
    var e = document.getElementById(c);
    e && (a.hd = e.clientWidth, a.kd = e.clientHeight, this.u.Ub >= 0 ? (Math.abs(e.scrollTop - this.u.Ub) > 1 && (e.scrollTop = this.u.Ub), a.va = this.u.Ub, this.u.Ub = -1) : a.va = e.scrollTop);
    var g = document.getElementById(d);
    g && (a.de = g.clientHeight, a.jd = g.scrollTop);
    var h = a.hd || 200;
    this.u.xd && (this.u.xd = !1, this.u.nc.firstRenderStart = performance.now());
    const k = a.A.pinned;
    var l = "full";
    let m = "";
    k === "*unclass" ? (l = "unclass", m = "class") : k && (m = "pinned:" + k);
    b = new Set();
    this.u.$c = b;
    l = Sh(this, h, l);
    l = Gi(this, l, a.va, a.kd || 400, e, b);
    a.va = l.Se;
    e || setTimeout(() => {
      const t = document.getElementById(c);
      t && (a.hd = t.clientWidth, a.kd = t.clientHeight, this.u.layout = null, this.l.refresh());
    }, 0);
    const p = (t, q, u) => v("div", {lid:"vp-" + q, id:q, className:"sidebar-scroll", Yg:r => ni(this, r, u), style:{flex:"1", overflowY:"auto"}}, t.Df > 0 ? v("div", {lid:"vs-top", style:{height:t.Df + "px"}}) : null, t.bg, t.Qe > 0 ? v("div", {lid:"vs-bot", style:{height:t.Qe + "px"}}) : null);
    e = v("div", {lid:"gallery-split", className:"section-sash", onMouseDown:t => ii(this, t), style:{height:"4px", cursor:"ns-resize", flexShrink:"0", borderTop:"1px solid #444"}});
    m ? (h = Sh(this, h, m), h = Gi(this, h, a.jd, a.de || a.A.splitH, g, b), a.jd = h.Se, g = k === "*unclass" ? p(h, d, !0) : p(l, c, !1), d = k === "*unclass" ? p(l, c, !1) : p(h, d, !0), d = v("div", {lid:"panes", style:{flex:"1", minHeight:"0", display:"flex", flexDirection:"column"}}, g, e, v("div", {lid:"pane-bot", id:f, style:{height:a.A.splitH + "px", flexShrink:"0", display:"flex", flexDirection:"column"}}, d))) : d = v("div", {lid:"panes", style:{flex:"1", minHeight:"0", display:"flex", 
    flexDirection:"column"}}, p(l, c, !1));
    Ph(this, b);
    return v("div", {style:{display:"flex", flexDirection:"column", height:"100%"}}, Di(this), d, Fi(this));
  }
}
;const Ii = {1:"x y radius startAngle endAngle ccw".split(" "), 2:["x1", "y1", "x2", "y2", "radius"], 3:"cp1x cp1y cp2x cp2y x y".split(" "), 5:"x y radiusX radiusY rotation startAngle endAngle ccw".split(" "), 6:["x", "y"], 7:["x", "y"], 8:["cpx", "cpy", "x", "y"], 9:["x", "y", "w", "h"], 10:["x", "y", "w", "h"], 12:["x", "y", "w", "h"], 13:["x", "y", "w", "h"], 14:["x", "y", "w", "h"], 17:["angle"], 18:["x", "y"], 19:"abcdef".split(""), 20:"abcdef".split(""), 21:["x", "y"], 23:["fillRule"], 24:["fillRule"], 
28:["cap"], 29:["offset"], 30:["join"], 31:["width"], 32:["limit"], 35:["img", "dx", "dy", "dw", "dh"], 50:["alpha"], 55:["blur"], 57:["x"], 58:["y"], 59:["x", "y", "maxWidth"], 61:["x", "y", "maxWidth"], 150:["segment"], 151:["layer"]}, Ji = {1:"arc", 2:"arcTo", 3:"bezierCurveTo", 4:"closePath", 5:"ellipse", 6:"lineTo", 7:"moveTo", 8:"quadraticCurveTo", 9:"rect", 10:"roundRect", 11:"addPath", 12:"clearRect", 13:"fillRect", 14:"strokeRect", 16:"resetTransform", 17:"rotate", 18:"scale", 19:"setTransform", 
20:"transform", 21:"translate", 22:"beginPath", 23:"clip", 24:"fill", 27:"stroke", 28:"lineCap", 29:"lineDashOffset", 30:"lineJoin", 31:"lineWidth", 32:"miterLimit", 33:"getLineDash", 34:"setLineDash", 35:"drawImage", 40:"reset", 41:"restore", 42:"save", 43:"fillStyle", 44:"strokeStyle", 50:"globalAlpha", 51:"globalCompositeOperation", 55:"shadowBlur", 56:"shadowColor", 57:"shadowOffsetX", 58:"shadowOffsetY", 59:"fillText", 61:"strokeText", 63:"font", 68:"textAlign", 69:"textBaseline", 80:"paint", 
150:"segment", 151:"targetLayer", 153:"scope_push", 154:"scope_pop", 155:"scope_reset"}, Ki = {[0]:"draw", [1]:"def_begin", [2]:"def_end", [3]:"exec_begin", [4]:"exec_end", [5]:"draw_after", [6]:"group_start", [7]:"group_end", [8]:"el_next", [10]:"webgl_start", [11]:"webgl_finish", [12]:"webgl_dirty", [13]:"webgl_delete"};
function Li(a) {
  return "#" + (16777216 | (a >>> 24 & 255) << 16 | (a >>> 16 & 255) << 8 | a >>> 8 & 255).toString(16).slice(1);
}
;function Mi(a, b, c) {
  (c = c.currentTarget.value.trim()) ? (c = tf(a.node.F, a.data.la, b, c), c.error ? a.ib = {pg:b, U:c.error} : (a.ib = null, a.yc = -1)) : (a.ib = null, a.yc = -1);
  a.refresh();
}
function Ni(a, b, c) {
  const d = a.data.entries;
  !d || b < 0 || b >= d.length || (tf(a.node.F, b, 0, c), d[b].h[0] = c, a.refresh());
}
function Oi(a, b) {
  tf(a.node.F, a.data.la, 0, b);
  a.data.entry.h[0] = b;
  a.refresh();
}
function Pi(a, b, c, d, f) {
  c ? (uf(a.node.F, d), a.data.Dd && d < a.data.la && (a.data.Dd.la = a.data.la - 1)) : (c = vf(a.node.F, a.data.la), b === 43 ? c.L.fillStyle = f : b === 44 ? c.L.strokeStyle = f : b === 31 && (c.L.lineWidth = f), c.end(), a.data.Dd && (a.data.Dd.la = a.data.la + 1));
  a.data.refresh();
}
function Qi(a, b, c) {
  const d = a.data.entries;
  !d || b < 0 || b >= d.length || Ni(a, b, parseInt(c.target.value.slice(1), 16) << 8 | (d[b].h[0] | 0) & 255);
}
function Ri(a, b, c) {
  const d = c.currentTarget, f = k => {
    const l = d.getBoundingClientRect();
    return Math.round(Math.max(0, Math.min(1, (k - l.left) / l.width)) * 255);
  }, e = k => {
    const l = a.data.entries;
    !l || b < 0 || b >= l.length || Ni(a, b, (l[b].h[0] | 0) & -256 | k);
  };
  e(f(c.clientX));
  const g = k => {
    e(f(k.clientX));
  }, h = () => {
    document.removeEventListener("mousemove", g);
    document.removeEventListener("mouseup", h);
  };
  document.addEventListener("mousemove", g);
  document.addEventListener("mouseup", h);
}
function Si(a, b, c) {
  const d = Math.pow(10, Math.min(a.Wd, 2)), f = c.currentTarget, e = a.Xd, g = l => {
    const m = f.getBoundingClientRect();
    return Math.round(Math.max(0, Math.min(1, (l - m.left) / m.width)) * e * d) / d;
  };
  (l => {
    Ni(a, b, l);
  })(g(c.clientX));
  const h = l => {
    l = g(l.clientX);
    Ni(a, b, l);
  }, k = () => {
    document.removeEventListener("mousemove", h);
    document.removeEventListener("mouseup", k);
  };
  document.addEventListener("mousemove", h);
  document.addEventListener("mouseup", k);
}
function Ti(a, b) {
  const c = b.currentTarget;
  a.Qf = c;
  const d = h => {
    const k = c.getBoundingClientRect();
    return Math.round(Math.max(0, Math.min(1, (h - k.left) / k.width)) * 255);
  }, f = h => {
    Oi(a, (a.data.entry.h[0] | 0) & -256 | h);
  };
  f(d(b.clientX));
  const e = h => {
    f(d(h.clientX));
  }, g = () => {
    document.removeEventListener("mousemove", e);
    document.removeEventListener("mouseup", g);
  };
  document.addEventListener("mousemove", e);
  document.addEventListener("mouseup", g);
}
;function Ui(a, b) {
  return v("div", {onClick:c => {
    c.stopPropagation();
    b();
  }, style:{width:"12px", height:"12px", border:"1px solid #888", borderRadius:"2px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:"0"}}, a ? v("div", {style:{width:"6px", height:"6px", backgroundColor:"#6af"}}) : null);
}
function Vi(a, b, c) {
  const d = Li(c);
  c = Math.round((c & 255) / 255 * 100) + "%";
  return v("div", {onMouseDown:f => Ri(a, b, f), style:{position:"relative", width:"50px", height:"10px", cursor:"pointer", userSelect:"none"}}, v("div", {style:{position:"absolute", top:"0", left:"0", width:"100%", height:"100%", backgroundColor:"#444", borderRadius:"2px"}}), v("div", {style:{position:"absolute", top:"0", left:"0", height:"100%", width:c, backgroundColor:d, borderRadius:"2px"}}), v("div", {style:{position:"absolute", pointerEvents:"none", left:c, top:"0", height:"100%", width:"2px", 
  backgroundColor:"#fff", transform:"translateX(-1px)"}}));
}
function Wi(a, b, c) {
  var d = a.Xd = va(c);
  d = Math.max(0, Math.min(1, c / d)) * 100 + "%";
  return v("div", {style:{display:"flex", alignItems:"center", gap:"4px"}}, v("div", {onMouseDown:f => Si(a, b, f), style:{position:"relative", width:"60px", height:"12px", cursor:"pointer", userSelect:"none"}}, v("div", {style:{position:"absolute", top:"0", left:"0", width:"100%", height:"100%", backgroundColor:"#444", clipPath:"polygon(0% 100%, 100% 0%, 100% 100%)"}}), v("div", {style:{position:"absolute", top:"0", left:"0", overflow:"hidden", height:"100%", width:d}}, v("div", {style:{width:"60px", 
  height:"100%", backgroundColor:"#6af", clipPath:"polygon(0% 100%, 100% 0%, 100% 100%)"}})), v("div", {style:{position:"absolute", pointerEvents:"none", left:d, top:"0", height:"100%", width:"2px", backgroundColor:"#fff", transform:"translateX(-1px)"}})), v("input", {type:"text", value:c.toFixed(a.Wd), onInput:f => {
    f = f.target.value.trim();
    if (f !== "" && !f.endsWith(".")) {
      var e = f.indexOf(".");
      a.Wd = e < 0 ? 0 : f.length - e - 1;
      f = parseFloat(f);
      !isNaN(f) && f >= 0 && (a.Xd = va(f), Ni(a, b, f));
    }
  }, onKeyDown:f => f.stopPropagation(), style:{width:"30px", height:"18px", backgroundColor:"#333", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", textAlign:"right", fontSize:"11px", padding:"0 2px"}}));
}
function Xi(a, b, c, d) {
  var f = a.data.entry.ba;
  f = f ? f[d] : -1;
  var e = f >= 0;
  const g = e ? a.data.Hb[f] || "v" + String(f).padStart(2, "0") : null;
  f = {display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1px 6px", gap:"8px"};
  const h = {color:"#888", fontSize:"11px", fontFamily:"monospace", minWidth:"60px", flexShrink:"0"};
  if (a.yc === d) {
    c = e ? g || "" : String(c);
    e = Object.assign({}, eg, {width:"80px", textAlign:"right", fontSize:"11px"});
    var k = a.ib && a.ib.pg === d ? a.ib.U : null;
    return v("div", {style:{padding:"1px 6px"}}, v("div", {style:f}, v("span", {style:h}, b), v("input", {type:"text", value:c, nf:l => Mi(a, d, l), onKeyDown:l => {
      l.stopPropagation();
      const m = l.key;
      m === "Enter" ? Mi(a, d, l) : m === "Escape" && (a.yc = -1, a.refresh());
    }, style:e})), k ? v("div", {style:{color:"#e55", fontSize:"10px", textAlign:"right"}}, k) : null);
  }
  k = {color:e ? "#4ec9b0" : "#ccc", fontSize:"11px", fontFamily:"monospace", cursor:"pointer", textAlign:"right", padding:"1px 4px", borderRadius:"2px", minWidth:"50px"};
  c = e ? g : Number.isInteger(c) ? String(c) : c.toFixed(2);
  return v("div", {style:f}, v("span", {style:h}, b), v("span", {onClick:() => {
    a.ib = null;
    a.yc = d;
    a.refresh();
  }, style:k}, c));
}
function Yi(a, b) {
  b |= 0;
  const c = Object.entries(Ki).map(([d, f]) => [f, Number(d)]);
  return v("div", {style:{padding:"2px 0"}}, v("div", {style:{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1px 6px", gap:"8px"}}, v("span", {style:{color:"#888", fontSize:"11px", fontFamily:"monospace", minWidth:"60px", flexShrink:"0"}}, "segment"), v("select", {value:String(b), onChange:d => {
    d = Number(d.target.value);
    tf(a.node.F, a.data.la, 0, d);
    a.data.entry.h[0] = d;
    a.refresh();
  }, style:{backgroundColor:"#2a2a2a", color:"#ccc", border:"1px solid #555", borderRadius:"2px", fontSize:"11px", fontFamily:"monospace", padding:"1px 4px", cursor:"pointer"}}, c.map(([d, f]) => v("option", {lid:f, value:String(f)}, d)))));
}
function Zi(a, b) {
  const c = Li(b);
  b &= 255;
  const d = Math.round(b / 255 * 100) + "%";
  return v("div", {style:{display:"flex", alignItems:"center", gap:"6px", padding:"3px 6px"}}, v("span", {style:{fontSize:"10px", minWidth:"20px", textAlign:"right", color:"#aaa"}}, Math.round(b / 255 * 100)), v("div", {onMouseDown:f => Ti(a, f), style:{position:"relative", width:"50px", height:"10px", cursor:"pointer", userSelect:"none"}}, v("div", {style:{position:"absolute", top:"0", left:"0", width:"100%", height:"100%", backgroundColor:"#444", borderRadius:"2px"}}), v("div", {style:{position:"absolute", 
  top:"0", left:"0", height:"100%", width:d, backgroundColor:c, borderRadius:"2px"}}), v("div", {style:{position:"absolute", pointerEvents:"none", left:d, top:"0", height:"100%", width:"2px", backgroundColor:"#fff", transform:"translateX(-1px)"}})), v("input", {type:"color", value:c, onInput:f => {
    Oi(a, parseInt(f.target.value.slice(1), 16) << 8 | (a.data.entry.h[0] | 0) & 255);
  }, style:{width:"32px", height:"20px", border:"none", cursor:"pointer"}}));
}
;class $i extends Sb {
  constructor(a) {
    super();
    this.data = a;
    this.node = a.node;
    this.yc = -1;
    this.ib = this.Qf = null;
    this.Xd = 20;
    this.Wd = 1;
  }
  async render() {
    const a = this.data.entry;
    if (!a) {
      return v("div", null);
    }
    const b = Ii[a.g] || [], c = Math.min(a.V, a.h.length), d = (a.H & 1) !== 0, f = a.g === 43 || a.g === 44, e = a.g === 24 || a.g === 13, g = a.g === 27 || a.g === 14;
    var h = e || g;
    let k = !1, l = -1, m = !1, p = -1, t = !1, q = -1;
    if (h && this.data.entries) {
      var u = this.data.entries, r = this.data.la;
      for (--r; r >= 0; r--) {
        var w = u[r].g;
        if (w !== 43 && w !== 44 && w !== 31) {
          break;
        }
        w === 43 && e && !k && (k = !0, l = r);
        w === 44 && g && !m && (m = !0, p = r);
        w === 31 && g && !t && (t = !0, q = r);
      }
    }
    r = u = 255;
    w = 1.0;
    h && this.data.entries && (h = this.data.entries, k && l >= 0 && l < h.length && (u = h[l].h[0] | 0), m && p >= 0 && p < h.length && (r = h[p].h[0] | 0), t && q >= 0 && q < h.length && (w = h[q].h[0]));
    h = this.data.x;
    let z = this.data.y;
    const A = 80 + c * 22;
    h + 220 > window.innerWidth && (h = window.innerWidth - 220 - 8);
    z + A > window.innerHeight && (z = window.innerHeight - A - 8);
    h < 4 && (h = 4);
    z < 4 && (z = 4);
    h = {position:"fixed", left:h + "px", top:z + "px", backgroundColor:"#1e1e1e", border:"1px solid #555", borderRadius:"4px", padding:"4px 0", zIndex:"9999", fontFamily:"sans-serif", fontSize:"12px", color:"#e0e0e0", minWidth:"180px", maxWidth:"300px", boxShadow:"0 4px 12px rgba(0,0,0,0.5)"};
    return v("div", null, v("div", {onClick:() => this.data.Nc(), onContextMenu:B => {
      B.preventDefault();
      this.data.Nc();
    }, style:{position:"fixed", top:0, left:0, right:0, bottom:0, zIndex:"9998"}}), v("div", {style:h, onContextMenu:B => B.preventDefault()}, v("div", {style:{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"2px 6px 4px", borderBottom:"1px solid #444", marginBottom:"2px"}}, v("span", {style:{fontWeight:"bold", fontSize:"12px", color:d ? "#666" : "#8cf"}}, a.name), v("span", {onClick:() => this.data.Nc(), style:{cursor:"pointer", color:"#888", fontSize:"14px", padding:"0 4px", 
    lineHeight:"1"}}, "x")), v("div", {onClick:() => {
      this.ib = null;
      var B = this.node.F, D = this.data.la;
      const x = B.h;
      var C = df(x, B.g)[D];
      if (C && (D = R(x, B.g))) {
        C = C.ie;
        var K = D.K[C - 1];
        K && K.g === 0 && K.m === 12 ? D.K.splice(C - 1, 1) : D.K.splice(C, 0, new F(0, -1, 12, [], -1));
        x.g.delete(B.g);
        T(x, B.g);
      }
      this.data.Nc();
    }, style:{display:"flex", alignItems:"center", gap:"6px", padding:"3px 6px", cursor:"pointer", fontSize:"11px"}}, v("div", {style:{width:"12px", height:"12px", border:"1px solid #888", borderRadius:"2px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:"0"}}, d ? v("div", {style:{width:"6px", height:"6px", backgroundColor:"#e93"}}) : null), v("span", {style:{color:d ? "#e93" : "#999"}}, "disabled")), e ? v("div", {style:{display:"flex", alignItems:"center", gap:"4px", 
    padding:"3px 6px"}}, Ui(k, () => Pi(this, 43, k, l, 255)), v("span", {style:{color:"#999", fontSize:"11px", minWidth:"26px"}}, "Fill"), v("div", {style:k ? {display:"flex", alignItems:"center", gap:"4px"} : {display:"flex", alignItems:"center", gap:"4px", opacity:"0.3", pointerEvents:"none"}}, v("span", {style:{fontSize:"10px", minWidth:"18px", textAlign:"right", color:"#aaa"}}, Math.round((u & 255) / 255 * 100)), Vi(this, l, u), v("input", {type:"color", value:Li(u), onInput:B => Qi(this, l, 
    B), style:{width:"24px", height:"16px", border:"none", cursor:"pointer", padding:"0"}}))) : null, g ? v("div", null, v("div", {style:{display:"flex", alignItems:"center", gap:"4px", padding:"3px 6px"}}, Ui(m, () => Pi(this, 44, m, p, 255)), v("span", {style:{color:"#999", fontSize:"11px", minWidth:"26px"}}, "Stroke"), v("div", {style:m ? {display:"flex", alignItems:"center", gap:"4px"} : {display:"flex", alignItems:"center", gap:"4px", opacity:"0.3", pointerEvents:"none"}}, v("span", {style:{fontSize:"10px", 
    minWidth:"18px", textAlign:"right", color:"#aaa"}}, Math.round((r & 255) / 255 * 100)), Vi(this, p, r), v("input", {type:"color", value:Li(r), onInput:B => Qi(this, p, B), style:{width:"24px", height:"16px", border:"none", cursor:"pointer", padding:"0"}}))), v("div", {style:{display:"flex", alignItems:"center", gap:"4px", padding:"3px 6px"}}, Ui(t, () => Pi(this, 31, t, q, 1.0)), v("span", {style:{color:"#999", fontSize:"11px", minWidth:"26px"}}, "Width"), v("div", {style:t ? {display:"flex", 
    alignItems:"center", gap:"4px"} : {display:"flex", alignItems:"center", gap:"4px", opacity:"0.3", pointerEvents:"none"}}, Wi(this, q, w)))) : null, f ? v("div", {style:{padding:"2px 0", opacity:d ? "0.5" : "1"}}, Zi(this, a.h.length > 0 ? a.h[0] | 0 : 255)) : a.g === 150 && c > 0 ? v("div", {style:{opacity:d ? "0.5" : "1"}}, Yi(this, a.h[0])) : c > 0 ? v("div", {style:{padding:"2px 0", opacity:d ? "0.5" : "1"}}, a.h.slice(0, c).map((B, D) => Xi(this, D < b.length ? b[D] : "[" + D + "]", B, D))) : 
    v("div", {style:{padding:"4px 6px", color:"#666", fontSize:"10px", fontStyle:"italic"}}, "sem parametros"), v("div", {style:{borderTop:"1px solid #444", marginTop:"2px", padding:"3px 6px"}}, v("span", {onClick:() => {
      this.ib = null;
      uf(this.node.F, this.data.la);
      this.data.Nc();
    }, style:{cursor:"pointer", color:"#e55", fontSize:"11px", padding:"2px 8px", border:"1px solid #a33", borderRadius:"3px", backgroundColor:"transparent"}}, "Delete"))));
  }
}
;const aj = {["c6631139-ac01-4e46-beb0-143890100001"]:"image_container"}, bj = ["none", "selection", "rect", "ellipse", "line"], cj = ["outline", "resize_h8", "focus"];
function dj(a, b) {
  const c = a[b].depth, d = b + 1 + a[b].ja;
  let f = 0;
  for (b += 1; b < d; b++) {
    a[b].depth === c + 1 && f++;
  }
  return f;
}
function ej(a, b, c, d) {
  b = b.displayMap;
  return b[a] ? b[a] : d || a === 0 || a === c ? {ra:!1, pa:!1, qa:!1} : {ra:!0, pa:!0, qa:!0};
}
function fj(a, b, c) {
  for (let d = 0; d < b.length; d++) {
    const f = b[d];
    f.key >= 20000 && f.name && f.name !== String(f.key) && (c.Hb[a] || (c.Hb[a] = {}), c.Hb[a][f.key] || (c.Hb[a][f.key] = f.name));
  }
}
function gj(a) {
  let b = 0;
  const c = /^Untitled (\d+)$/;
  for (let f = 0; f < a.length; f++) {
    var d = c.exec(a[f].name);
    d && (d = parseInt(d[1], 10), d > b && (b = d));
  }
  return "Untitled " + (b + 1);
}
;let hj = null;
function ij() {
  if (!hj) {
    const a = new na("ploft.objects");
    hj = a.init().then(() => a);
  }
  return hj;
}
function jj() {
  return ij().then(a => a.clear()).then(() => {
    console.log("Cleared all saved objects");
  });
}
;async function kj(a, b) {
  const c = b.lastIndexOf("/");
  a = c >= 0 ? await za(a, b.slice(0, c)) : a;
  if (!a) {
    return null;
  }
  try {
    return await (await (await a.getFileHandle(b.slice(c + 1))).getFile()).text();
  } catch (d) {
    return null;
  }
}
async function lj(a, b, c) {
  const d = b.lastIndexOf("/");
  a = d >= 0 ? await za(a, b.slice(0, d), !0) : a;
  if (!a) {
    return !1;
  }
  b = await (await a.getFileHandle(b.slice(d + 1), {create:!0})).createWritable();
  await b.write(c);
  await b.close();
  return !0;
}
async function mj() {
  return (await Aa({Gc:"ploft.user_root", key:"root", Gd:!0})).handle;
}
async function nj(a) {
  await za(a, "gdef", !0);
  await za(a, "svg/collections", !0);
}
async function oj(a, b) {
  a = await kj(a, b);
  if (a === null) {
    return null;
  }
  try {
    return JSON.parse(a);
  } catch (c) {
    return console.warn("user_root: json invalido", b, c), null;
  }
}
async function pj(a, b, c) {
  return lj(a, b, JSON.stringify(c, null, 2));
}
async function qj(a) {
  const b = [];
  a = await za(a, "svg/collections");
  if (!a) {
    return b;
  }
  for await (const c of a.values()) {
    c.kind === "directory" && b.push(c.name);
  }
  return b;
}
async function rj(a, b) {
  const c = b.lastIndexOf("/");
  if (a = c >= 0 ? await za(a, b.slice(0, c)) : a) {
    try {
      await a.removeEntry(b.slice(c + 1));
    } catch (d) {
      console.warn("user_root: removeFile", b, d);
    }
  }
}
async function sj(a, b) {
  const c = b.lastIndexOf("/");
  if (a = c >= 0 ? await za(a, b.slice(0, c)) : a) {
    try {
      await a.removeEntry(b.slice(c + 1), {recursive:!0});
    } catch (d) {
      console.warn("user_root: removeDir", b, d);
    }
  }
}
;const tj = {1:async function() {
  const a = await Aa({Gc:"ploft.user_root", key:"root"});
  a.handle && nj(a.handle);
  return !!a.handle;
}};
var uj = {Ae:1, Jf:2, Kf:3, Sd:4, If:5, Be:6};
function vj(a, b, c) {
  a: {
    switch(a) {
      case 1:
      case 2:
      case 3:
      case 5:
      case 6:
        a = [1];
        break a;
      case 4:
        a = b && b.loaded ? [] : [1];
        break a;
    }
    a = [];
  }
  a.length ? Promise.all(a.map(d => tj[d]())).then(d => c(d.every(Boolean)), () => c(!1)) : c(!0);
}
;function wj(a, b) {
  const c = a[b].depth;
  let d = 0;
  for (b += 1; b < a.length && !(a[b].g === -2 && a[b].depth <= c); b++) {
    a[b].g >= 0 && d++;
  }
  return d;
}
function xj(a, b) {
  Gf(a.i, -1);
  const c = a.B + ":";
  b.ia.forEach(d => {
    d.startsWith(c) && Gf(a.i, parseInt(d.substring(c.length), 10));
  });
}
function yj(a, b, c) {
  if (a.key !== "ArrowUp" && a.key !== "ArrowDown") {
    return null;
  }
  a.preventDefault();
  if (!b.Ta) {
    return null;
  }
  var d = b.Ta.split(":");
  const f = parseInt(d[0], 10);
  var e = parseInt(d[1], 10);
  if (f <= 0 || f !== c.B) {
    return null;
  }
  const g = sf(c.F);
  if (!g.length) {
    return null;
  }
  var h = b.collapsed[f] || {};
  d = [];
  let k = -1;
  for (let l = 0; l < g.length; l++) {
    const m = g[l];
    k >= 0 ? m.g === -2 && m.depth <= k && (k = -1) : m.g !== -2 && (m.g === -1 ? h[l] || (k = m.depth) : d.push(l));
  }
  e = d.indexOf(e);
  if (e < 0) {
    return null;
  }
  a = e + (a.key === "ArrowDown" ? 1 : -1);
  if (a < 0 || a >= d.length) {
    return null;
  }
  a = d[a];
  b.ia.clear();
  b.ia.add(f + ":" + a);
  b.Ta = f + ":" + a;
  xj(c, b);
  return {B:f, next:a};
}
;function zj(a) {
  const b = a.data.wa;
  if (b.ia.size > 0) {
    if (b.Ta) {
      const c = parseInt(b.Ta.split(":")[0], 10);
      c > 0 && (a = a.N.h, Gf(new Hf(a, a.j, c), -1));
    }
    b.ia.clear();
    b.Ta = "";
  }
  b.ka && (b.ka = null);
}
function Aj(a, b) {
  a.data.state.Nd = b;
  zj(a);
}
function Y(a) {
  a.data.state.Qa = null;
  a.l.refresh();
}
function Bj(a, b, c, d) {
  d = parseFloat(d.currentTarget.value);
  if (!isNaN(d)) {
    b = a.N.i(b).F;
    const e = b.h;
    S(e, b.g);
    const g = R(e, b.g);
    if (g) {
      var f = ff(e, b.g);
      c < 0 || c >= f.length || (c = g.K[f[c]], c.a.length ? c.a[0] = d : c.a = E(d), e.g.delete(b.g), T(e, b.g));
    }
  }
  a.data.state.td = null;
  a.l.refresh();
}
function Cj(a, b, c, d) {
  if (d = d.currentTarget.value.trim()) {
    b = a.N.i(b).F;
    const g = b.h;
    S(g, b.g);
    var f = R(g, b.g);
    if (f) {
      var e = ff(g, b.g);
      c < 0 || c >= e.length || (c = f.K[e[c]], c.name && f.g.h.delete(c.name), c.name = d, c = y(c.h), f.g.h.set(d, c), g.g.delete(b.g), T(g, b.g));
    }
  }
  a.data.state.ud = null;
  a.l.refresh();
}
function Dj(a) {
  const b = a.data.state, c = hf(a.N.g);
  b.zf = c.map(d => ({uuid:d.uuid, name:d.name || d.uuid}));
  a.l.refresh();
}
function Ej(a, b, c, d) {
  b.preventDefault();
  b.stopPropagation();
  a.data.state.Qa = {Va:c, B:d.B, node:d, x:b.clientX, y:b.clientY};
  Dj(a);
  a.l.refresh();
}
function Fj(a, b, c) {
  var d;
  if (d = c && c.trim()) {
    d = a.N.i(b).F;
    var f = c.trim();
    c = d.h;
    S(c, d.g);
    var e = bf(c, d.g);
    if (e = e ? cf(e) : null) {
      const h = e.g.g.K;
      var g = h.length;
      e.g.g.g.M.ea(0, f);
      if (h.length > g) {
        f = h.pop();
        for (g = e.i + 1; g < e.h && h[g].g === 2 && (h[g].m === 1 || h[g].m === 0);) {
          g++;
        }
        h.splice(g, 0, f);
        e.h++;
      }
      e.g.h++;
      T(c, d.g);
      d = !0;
    } else {
      d = !1;
    }
  }
  d && (a.data.state.kb[b] = !0, a.l.refresh());
}
function Gj(a, b) {
  const c = a.data.state;
  b = a.N.i(b);
  let d = qf(b.F);
  d || (d = gj(c.zf || []), rf(b.F, d));
  const f = pf(b.F);
  if (f && f.uuid) {
    var e = a.N;
    vj(uj.Ae, void 0, g => {
      g ? (g = Date.now(), Cf(e.h, f.uuid, d, g) ? Tf(f.uuid, d, g) : console.warn("save: filestore recusou")) : console.warn("save: pasta nao autorizada");
    });
  } else {
    console.error("save: buffer vazio ou sem uuid");
  }
  Y(a);
}
function Hj(a, b, c) {
  const d = a.N, f = hf(d.g).find(e => e.uuid === c);
  vj(uj.Sd, {loaded:!(!f || !f.loaded)}, e => {
    e ? (e = Bf(d.h, c, b), d.o(e, (g, h) => {
      g === 1 && h || console.warn("addClassChild: falhou para", c);
    })) : console.warn("addClassChild: pasta nao autorizada");
  });
  Y(a);
}
function Ij(a) {
  jj().then(() => {
    Dj(a);
  });
  Y(a);
}
function Jj(a, b) {
  const c = a.data.wa;
  if (c.Ta) {
    var d = parseInt(c.Ta.split(":")[0], 10);
    if (!(d <= 0)) {
      d = a.N.i(d);
      var f = yj(b, c, d);
      f && (a.l.refresh(), setTimeout(() => {
        var e = f.next;
        const g = document.getElementById(gg(a.l.za.v.key));
        g && (e = g.querySelector('[lid="' + e + '"]')) && e.scrollIntoView({block:"nearest"});
      }, 0));
    }
  }
}
;const Kj = {width:"18px", display:"inline-block", textAlign:"center", color:"#555", fontSize:"12px", flexShrink:"0"}, Lj = {display:"inline-block", width:"4px", color:"#555", fontSize:"12px", flexShrink:"0"};
function Mj(a) {
  const b = [], c = [], d = a[0].depth;
  for (var f = 0; f < a.length;) {
    const e = f;
    for (f++; f < a.length && a[f].depth > d;) {
      f++;
    }
    c.push([e, f]);
  }
  for (a = c.length - 1; a >= 0; a--) {
    for (f = c[a][0]; f < c[a][1]; f++) {
      b.push(f);
    }
  }
  return {Ze:b, lf:d};
}
function Nj(a, b) {
  const c = Array(b.length);
  for (let f = 0; f < b.length; f++) {
    var d = b[f];
    const e = a[d].depth;
    d = f + 1 + a[d].ja;
    c[f] = d >= b.length ? !0 : a[b[d]].depth < e;
  }
  return c;
}
function Oj(a, b, c) {
  const d = [];
  for (let f = 0; f < b; f++) {
    d.push(v("span", {lid:"a" + f, style:Kj}, a[f] ? "" : "\u2502"));
  }
  d.push(v("span", {lid:"cv", style:Kj}, c ? "\u2514" : "\u251c"));
  d.push(v("span", {lid:"cd", style:Lj}, "\u2500"));
  return d;
}
function Pj(a, b, c, d) {
  const f = [];
  for (let e = 0; e < b; e++) {
    f.push(v("span", {lid:"a" + e, style:Kj}, a[e] ? "" : "\u2502"));
  }
  f.push(v("span", {lid:"o", style:Kj}, c ? "" : "\u2502"));
  f.push(v("span", {lid:"h", style:Kj}, d ? "\u2502" : ""));
  return f;
}
;function Qj(a) {
  const b = a.data.wa;
  b.Ec = -1;
  b.Dc = -1;
  b.pd = -1;
  b.dc = null;
  a.data.refresh();
}
function Rj(a, b, c) {
  const d = a.data.wa, f = a.data.W;
  if (a.data.W > 0 && a.data.mg && (a.data.mg(a.data.Wf, 0), a.data.W > 0)) {
    var e = a.data.wa, g = a.data.entries, h = a.data.W + ":";
    for (let k = 0; k < g.length; k++) {
      const l = h + k;
      (g[k].H & 2) !== 0 ? e.ia.has(l) || e.ia.add(l) : e.ia.delete(l);
    }
  }
  e = f + ":" + b;
  if (c.ctrlKey) {
    d.ia.has(e) ? d.ia.delete(e) : d.ia.add(e);
  } else if (c.shiftKey && d.Ta !== "") {
    if (c = d.Ta.split(":"), g = parseInt(c[1], 10), parseInt(c[0], 10) === f) {
      for (c = Math.min(g, b), b = Math.max(g, b), g = a.data.entries; c <= b; c++) {
        c < g.length && g[c].g >= 0 && d.ia.add(f + ":" + c);
      }
    } else {
      d.ia.clear(), d.ia.add(e);
    }
  } else {
    d.ia.size === 1 && d.ia.has(e) ? d.ia.clear() : (d.ia.clear(), d.ia.add(e));
  }
  d.Ta = e;
  a.data.W > 0 && xj(a.node, a.data.wa);
  a.data.refresh();
}
function Sj(a, b, c) {
  if (a.data.W > 0) {
    var d = a.data.wa;
    d.Ec = a.data.W;
    d.Dc = c;
    b.dataTransfer.setData("application/x-ploft-command", a.data.W + ":" + c);
    b.dataTransfer.effectAllowed = "move";
    b.stopPropagation();
  }
}
function Tj(a, b, c) {
  const d = a.data.wa;
  if (d.Ec === a.data.W && b.dataTransfer.types.includes("application/x-ploft-command")) {
    b.preventDefault();
    b.stopPropagation();
    var f = b.currentTarget.getBoundingClientRect();
    b = b.clientY - f.top < f.height * 0.5 ? "above" : "below";
    if (d.pd !== c || d.dc !== b) {
      d.pd = c, d.dc = b, a.data.refresh();
    }
  }
}
function Uj(a, b, c) {
  b.preventDefault();
  b.stopPropagation();
  var d = a.data.wa;
  if (a.data.W > 0 && d.Ec === a.data.W && d.Dc >= 0 && d.Dc !== c) {
    b = a.node.F;
    var f = d.Dc;
    d = c + (d.dc === "below" ? 1 : 0);
    c = b.h;
    var e = bf(c, b.g);
    if (e && (e = cf(e))) {
      var g;
      g === void 0 && (g = e.g.filter());
      f !== d && (f = Ge(e, g, f), g = Ge(e, g, d), f !== -1 && g !== -1 && (ee(e.g.g.K, f, g), e.g.h++));
      T(c, b.g);
    }
  }
  Qj(a);
}
function Vj(a, b, c) {
  if (a.data.W > 0) {
    c.preventDefault();
    c.stopPropagation();
    var d = a.data.wa;
    d.ka && d.ka.W === a.data.W && d.ka.la === b ? d.ka = null : d.ka = {W:a.data.W, la:b, x:Math.round(c.clientX), y:Math.round(c.clientY)};
    a.data.refresh();
  }
}
;class Wj extends Wb.g {
  constructor(a) {
    super();
    this.data = a;
    this.node = a.node;
  }
  render() {
    const a = this.data.entries;
    if (!a.length) {
      return null;
    }
    const b = this.data.wa, c = this.data.W, d = this.data.W > 0, f = b.collapsed[c] || {};
    let e = -1;
    const g = b.ka && b.ka.W === this.data.W ? b.ka.la : -1, h = this.data.xg || null, k = (this.data.yg || 0) + "px";
    let l = !1;
    return v("div", {style:{fontFamily:"monospace", fontSize:"11px", paddingTop:"1px"}}, a.map((m, p) => {
      if (e >= 0) {
        return m.g === -2 && m.depth <= e && (e = -1), null;
      }
      if (m.g === -2) {
        return null;
      }
      var t = m.depth * 12 + (this.data.Uf || 16);
      if (m.g === -1) {
        var q = !f[p];
        q && (e = m.depth);
        return v("div", {lid:p, style:h ? {display:"flex", alignItems:"center", paddingLeft:k} : {}, onClick:() => {
          const x = this.data.wa.collapsed, C = this.data.W;
          x[C] || (x[C] = {});
          x[C][p] ? delete x[C][p] : x[C][p] = !0;
          this.data.refresh();
        }}, h, v("div", {style:{padding:"0px 4px", paddingLeft:t + "px", cursor:"pointer", color:"#8cf", userSelect:"none", fontSize:"10px", flex:h ? "1" : void 0}}, (q ? "[+] " : "[-] ") + m.name + " (" + wj(a, p) + ")"));
      }
      m.g === 22 && (l = !0);
      if (m.g === 24 || m.g === 27 || m.g === 23) {
        l = !1;
      }
      q = l ? 10 : 0;
      const u = m.g === 22;
      var r = m.g === 4;
      const w = u || r;
      r = (m.H & 2) !== 0;
      r = b.ia.has(c + ":" + p) || r;
      const z = g === p, A = (m.H & 1) !== 0;
      var B = b.pd === p && b.Ec === c;
      const D = B && b.dc === "above";
      B = B && b.dc === "below";
      if (w) {
        return v("div", {lid:p, draggable:d ? "true" : "false", onDragStart:x => Sj(this, x, p), onDragOver:x => Tj(this, x, p), onDrop:x => Uj(this, x, p), onDragEnd:() => {
          Qj(this);
        }, style:h ? {display:"flex", alignItems:"center", paddingLeft:k} : {}}, h, v("div", {onClick:x => Rj(this, p, x), onContextMenu:x => Vj(this, p, x), style:{display:"flex", alignItems:"center", height:"3px", paddingLeft:t + 5 + "px", paddingRight:"4px", cursor:d ? "grab" : "default", userSelect:"none", backgroundColor:r ? "#1a4a6a" : "transparent", borderLeft:r ? "2px solid #0cf" : "2px solid transparent", borderTop:D ? "2px solid #6af" : "2px solid transparent", borderBottom:B ? "2px solid #6af" : 
        "2px solid transparent", opacity:A ? "0.3" : "1", flex:h ? "1" : void 0}}, v("span", {style:{width:"50px", height:"0", borderTop:u ? "1px dashed #556" : "1px solid #556"}})));
      }
      t += q;
      if ((m.g === 43 || m.g === 44) && d) {
        const x = m.h.length > 0 ? m.h[0] | 0 : 255;
        q = Li(x);
        return v("div", {lid:p, draggable:"true", onDragStart:C => Sj(this, C, p), onDragOver:C => Tj(this, C, p), onDrop:C => Uj(this, C, p), onDragEnd:() => {
          Qj(this);
        }, style:h ? {display:"flex", alignItems:"center", paddingLeft:k} : {}}, h, v("div", {onClick:C => Rj(this, p, C), onContextMenu:C => Vj(this, p, C), style:{padding:"1px 4px", paddingLeft:t + "px", display:"flex", alignItems:"center", gap:"6px", cursor:"grab", userSelect:"none", color:r ? "#fff" : A ? "#665" : z ? "#ccc" : "#999", backgroundColor:r ? "#1a4a6a" : z ? "#2a3a4a" : "transparent", borderLeft:r ? "2px solid #0cf" : "2px solid transparent", borderTop:D ? "2px solid #6af" : "2px solid transparent", 
        borderBottom:B ? "2px solid #6af" : "2px solid transparent", textDecoration:A ? "line-through" : "none", fontStyle:A ? "italic" : "normal", opacity:A ? "0.3" : "1", flex:h ? "1" : void 0}}, v("span", null, m.name), v("input", {type:"color", value:q, onMouseDown:C => C.stopPropagation(), onInput:C => {
          this.data.W > 0 && tf(this.node.F, p, 0, parseInt(C.target.value.slice(1), 16) << 8 | x & 255);
        }, style:{width:"20px", height:"16px", padding:"0", border:"none", cursor:"pointer"}})));
      }
      return v("div", {lid:p, draggable:d ? "true" : "false", onDragStart:x => Sj(this, x, p), onDragOver:x => Tj(this, x, p), onDrop:x => Uj(this, x, p), onDragEnd:() => {
        Qj(this);
      }, style:h ? {display:"flex", alignItems:"center", paddingLeft:k} : {}}, h, v("div", {onClick:x => Rj(this, p, x), onContextMenu:x => Vj(this, p, x), style:{padding:"1px 4px", paddingLeft:t + "px", cursor:d ? "grab" : "default", userSelect:"none", color:r ? "#fff" : A ? "#665" : z ? "#ccc" : "#999", backgroundColor:r ? "#1a4a6a" : z ? "#2a3a4a" : "transparent", borderLeft:r ? "2px solid #0cf" : "2px solid transparent", borderTop:D ? "2px solid #6af" : "2px solid transparent", borderBottom:B ? 
      "2px solid #6af" : "2px solid transparent", textDecoration:A ? "line-through" : "none", fontStyle:A ? "italic" : "normal", flex:h ? "1" : void 0}}, m.g === 150 && m.V > 0 ? m.name + ": " + (Ki[m.h[0]] || String(m.h[0])) : m.name));
    }));
  }
}
;function Xj(a, b, c, d, f, e) {
  const g = b.B;
  e = [v("div", {lid:"v" + c, onContextMenu:h => {
    h.preventDefault();
    h.stopPropagation();
    a.data.state.Qa = {Va:-2, B:g, node:null, x:h.clientX, y:h.clientY, target:1, Ff:0};
    a.l.refresh();
  }, style:{display:"flex", alignItems:"center", paddingLeft:"6px", height:"20px", cursor:"pointer", fontSize:"11px", userSelect:"none"}}, f, v("span", {onClick:h => {
    h.stopPropagation();
    Aj(a, c);
    h = a.data.state;
    h.kb[g] ? delete h.kb[g] : h.kb[g] = !0;
    a.l.refresh();
  }, style:{color:d ? "#c8a" : "#888", paddingLeft:"4px"}}, (d ? "[-] " : "[+] ") + "vars" + (e !== void 0 ? " (" + e + ")" : "")))];
  if (d) {
    try {
      const h = a.data.state, k = nf(b.F);
      if (k.length > 0) {
        const l = h.td, m = h.ud;
        e.push(v("div", {style:{fontFamily:"monospace", fontSize:"11px"}}, k.map((p, t) => {
          const q = p.name || "v" + String(t + 1).padStart(2, "0"), u = l && l.B === g && l.key === t;
          return v("div", {lid:t, style:{height:"18px", display:"flex", paddingLeft:"6px", alignItems:"center", color:"#ccc"}, onContextMenu:r => {
            r.preventDefault();
            r.stopPropagation();
            a.data.state.Qa = {Va:-2, B:g, node:null, x:r.clientX, y:r.clientY, target:2, Ff:t};
            a.l.refresh();
          }}, f, m && m.B === g && m.key === t ? v("input", {type:"text", value:q, nf:r => Cj(a, g, t, r), onKeyDown:r => {
            r.stopPropagation();
            r.key === "Enter" ? Cj(a, g, t, r) : r.key === "Escape" && (a.data.state.ud = null, a.l.refresh());
          }, style:Object.assign({}, eg, {width:"80px", marginLeft:"16px"})}) : v("span", {onClick:() => {
            Aj(a, c);
            a.data.state.ud = {B:g, key:t};
            a.l.refresh();
          }, style:{paddingLeft:"16px", color:"#9cdcfe", cursor:"pointer"}}, q), v("span", {style:{color:"#666", margin:"0 4px"}}, "="), u ? v("input", {type:"text", value:String(p.value), nf:r => Bj(a, g, t, r), onKeyDown:r => {
            r.stopPropagation();
            r.key === "Enter" ? Bj(a, g, t, r) : r.key === "Escape" && (a.data.state.td = null, a.l.refresh());
          }, style:Object.assign({}, eg, {width:"80px", textAlign:"right", fontSize:"11px"})}) : v("span", {onClick:() => {
            Aj(a, c);
            a.data.state.td = {B:g, key:t};
            a.l.refresh();
          }, style:{color:"#b5cea8", cursor:"pointer", padding:"1px 4px", borderRadius:"2px"}}, Number.isInteger(p.value) ? String(p.value) : p.value.toFixed(2)));
        })));
      }
    } catch (h) {
    }
  }
  return e;
}
function Yj(a, b, c, d, f, e) {
  const g = b.B;
  e = [v("div", {lid:"c" + c, style:{display:"flex", alignItems:"center", paddingLeft:"6px", height:"20px", cursor:"pointer", fontSize:"11px", userSelect:"none"}}, f, v("span", {onClick:h => {
    h.stopPropagation();
    Aj(a, c);
    h = a.data.state;
    h.Bb[g] ? delete h.Bb[g] : h.Bb[g] = !0;
    a.l.refresh();
  }, style:{color:d ? "#6af" : "#888", paddingLeft:"4px"}}, (d ? "[-] " : "[+] ") + "cmds" + (e !== void 0 ? " (" + e + ")" : "")))];
  if (d) {
    try {
      const h = sf(b.F);
      h.length > 0 && e.push(Vb(new Wj({W:g, Wf:-1, entries:h, wa:a.data.wa, node:b, xg:f, yg:6, Uf:16, refresh:() => a.l.refresh()})));
    } catch (h) {
    }
  }
  return e;
}
function Zj(a, b, c, d, f, e) {
  const g = b.B;
  e = [v("div", {lid:"e" + c, style:{display:"flex", alignItems:"center", paddingLeft:"6px", height:"20px", cursor:"pointer", fontSize:"11px", userSelect:"none"}}, f, v("span", {onClick:h => {
    h.stopPropagation();
    Aj(a, c);
    h = a.data.state;
    h.Cb[g] ? delete h.Cb[g] : h.Cb[g] = !0;
    a.l.refresh();
  }, onContextMenu:h => {
    h.preventDefault();
    h.stopPropagation();
    a.data.state.Qa = {Va:-2, B:g, node:b, x:h.clientX, y:h.clientY, target:3};
    a.l.refresh();
  }, style:{color:d ? "#e8a" : "#888", paddingLeft:"4px"}}, (d ? "[-] " : "[+] ") + "events" + (e !== void 0 ? " (" + e + ")" : "")))];
  if (d) {
    try {
      const h = xf(b.F);
      h.length > 0 && e.push(v("div", {style:{fontFamily:"monospace", fontSize:"11px"}}, h.map((k, l) => v("div", {lid:l, style:{height:"18px", display:"flex", paddingLeft:"6px", alignItems:"center", color:"#ccc", cursor:"context-menu"}, onContextMenu:m => {
        var p = k.Yb, t = k.qg, q = k.rg;
        m.preventDefault();
        m.stopPropagation();
        a.data.state.Qa = {Va:-2, B:g, node:b, x:m.clientX, y:m.clientY, target:4, jb:l, zb:p, Na:t, ab:q};
        a.l.refresh();
      }}, f, v("span", {style:{paddingLeft:"16px", color:vd[k.Yb] ? "#ce9178" : "#999"}}, k.name), v("span", {style:{color:"#555", marginLeft:"6px", fontSize:"9px"}}, "(" + k.Yb + ")")))));
    } catch (h) {
    }
  }
  return e;
}
function ak(a, b) {
  const c = Kf(a.N.C), d = a.N.O, f = {backgroundColor:"#1e1e1e", color:"#ccc", border:"1px solid #555", fontSize:"10px", padding:"0 2px", outline:"none", cursor:"pointer"};
  return v("div", {style:{paddingLeft:"24px", fontSize:"11px", fontFamily:"monospace", color:"#aaa"}}, v("div", {style:{display:"flex", alignItems:"center", height:"20px"}}, v("span", {style:{cursor:"pointer", marginRight:"12px", color:c.vd ? "#4ec9b0" : "#666"}, onClick:() => {
    var e = a.N.C;
    e.g && hd(e.g, b.B, 1, c.vd ? 0 : 1);
    a.l.refresh();
  }}, (c.vd ? "\u2611" : "\u2610") + " events"), v("span", {style:{cursor:"pointer", color:c.wd ? "#4ec9b0" : "#666"}, onClick:() => {
    var e = a.N.C;
    e.g && hd(e.g, b.B, 2, c.wd ? 0 : 1);
    a.l.refresh();
  }}, (c.wd ? "\u2611" : "\u2610") + " propagate")), v("div", {style:{display:"flex", alignItems:"center", height:"20px"}}, v("span", {style:{color:"#888", marginRight:"4px"}}, "tool"), v("select", {lid:"ed-tool", style:f, onChange:e => {
    var g = a.N.C;
    g.g && hd(g.g, b.B, 3, parseInt(e.target.value, 10));
  }}, bj.map((e, g) => d.j === g ? v("option", {value:g, selected:!0}, e) : v("option", {value:g}, e))), v("span", {style:{color:"#888", marginLeft:"12px", marginRight:"4px"}}, "style"), v("select", {lid:"ed-style", style:f, onChange:e => {
    var g = a.N.C;
    g.g && hd(g.g, b.B, 4, parseInt(e.target.value, 10));
  }}, cj.map((e, g) => d.i === g ? v("option", {value:g, selected:!0}, e) : v("option", {value:g}, e)))), v("div", {style:{display:"flex", alignItems:"center", height:"20px", gap:"4px"}}, v("span", {onClick:() => {
    const e = a.data.state.ld || "", g = a.N, h = (l, m) => {
      if (l === 1 && m) {
        l = g.D();
        for (let p = 0; p < l.length; p++) {
          if (l[p].B === m) {
            Aj(a, p);
            if (l = l[p]) {
              m = a.N.C, m.g && jd(m.g, m.h, 5, [l.B, 0], []);
            }
            break;
          }
        }
        g.refresh();
      }
    };
    if (e) {
      var k = hf(g.g).find(l => l.uuid === e);
      vj(uj.Sd, {loaded:!(!k || !k.loaded)}, l => {
        l && g.o(Bf(g.h, e, b.B), h);
      });
    } else {
      g.o(b.h(), h);
    }
  }, style:{cursor:"pointer", color:"#4ec9b0", fontSize:"11px"}}, a.data.state.ld ? "+ add instance" : "+ add element"), v("select", {lid:"add-class", onChange:e => {
    a.data.state.ld = e.target.value;
    a.l.refresh();
  }, style:{backgroundColor:"#1e1e1e", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", fontSize:"10px", padding:"1px 2px", maxWidth:"150px"}}, [v("option", {value:""}, "(novo elemento)")].concat(hf(a.N.g).map(e => e.uuid === a.data.state.ld ? v("option", {value:e.uuid, selected:!0}, e.name || e.uuid) : v("option", {value:e.uuid}, e.name || e.uuid))))));
}
;function bk(a, b, c, d) {
  const f = ec(d);
  if (f > 0 && b) {
    a = nf(b.F);
    for (b = 0; b < a.length; b++) {
      if (a[b].Oa === f) {
        return a[b].name || "v" + String(b + 1).padStart(2, "0");
      }
    }
    return "(?)";
  }
  return Number.isNaN(d) || d < 0 ? "(not set)" : Fg(a.data.Pd, c, d, -1);
}
const Z = {display:"flex", alignItems:"center", gap:"6px", padding:"4px 10px", cursor:"pointer", fontSize:"12px", color:"#e0e0e0", whiteSpace:"nowrap"}, ck = {width:"14px", textAlign:"center", fontSize:"11px", color:"#6af"}, dk = {width:"14px", textAlign:"center", fontSize:"13px"};
function ek(a) {
  return v("div", {onClick:() => Y(a), style:{position:"fixed", top:"0", left:"0", right:"0", bottom:"0", zIndex:"100"}});
}
function fk(a, b, c, d) {
  const f = b.B;
  return v("div", null, c, v("div", {style:{...d, padding:"6px 8px"}}, v("div", {style:{display:"flex", alignItems:"center", gap:"4px"}}, v("input", {type:"text", placeholder:"name", onKeyDown:e => {
    e.stopPropagation();
    e.key === "Enter" ? (Fj(a, f, e.currentTarget.value), Y(a)) : e.key === "Escape" && Y(a);
  }, style:{...eg, width:"100px", flex:"1"}}), v("div", {onClick:e => {
    if (e = e.currentTarget.parentElement) {
      if (e = e.querySelector("input")) {
        Fj(a, f, e.value), Y(a);
      }
    }
  }, style:{padding:"2px 8px", cursor:"pointer", fontSize:"11px", color:"#e0e0e0", backgroundColor:"#3a3a3a", border:"1px solid #555", borderRadius:"2px", whiteSpace:"nowrap"}}, "+ Add"))));
}
function gk(a, b, c, d) {
  const f = b.Ff || 0;
  return v("div", null, c, v("div", {style:d}, v("div", {onClick:() => {
    of(a.N.i(b.B).F, f, f + -1);
    a.l.refresh();
    Y(a);
  }, style:Z}, v("span", {style:ck}, "\u2191"), "Move up"), v("div", {onClick:() => {
    of(a.N.i(b.B).F, f, f + 1);
    a.l.refresh();
    Y(a);
  }, style:Z}, v("span", {style:ck}, "\u2193"), "Move down"), v("div", {onClick:() => {
    var e = a.N.i(b.B).F;
    const g = e.h;
    S(g, e.g);
    const h = R(g, e.g);
    if (h) {
      var k = ff(g, e.g);
      f < 0 || f >= k.length || (k = h.K.splice(k[f], 1)[0], k.name && h.g.h.delete(k.name), g.g.delete(e.g), T(g, e.g));
    }
    a.l.refresh();
    Y(a);
  }, style:Z}, v("span", {style:{...ck, color:"#f44"}}, "\u00d7"), "Delete")));
}
function hk(a, b, c, d) {
  const f = b.node;
  return v("div", null, c, v("div", {style:d}, Cg.map((e, g) => v("div", {lid:g, onClick:() => {
    var h = f.F, k = e.Yb;
    const l = h.h;
    S(l, h.g);
    const m = R(l, h.g);
    if (m) {
      var p = ef(m);
      if (p) {
        var t = O(m.g);
        m.K.splice(p.$e, 0, new F(6, p.rb, 9, E(k), t));
        l.g.delete(h.g);
        T(l, h.g);
      }
    }
    Y(a);
    a.l.refresh();
  }, style:Z}, v("span", {style:ck}, "+"), e.name))));
}
function ik(a, b, c, d) {
  const f = b.node;
  var e = b.zb || 0, g = Dg[e];
  const h = b.Na || 0, k = [];
  e === 1 ? (e = g && g[0] && g[0].options ? g[0].options[h] || "default" : "") && k.push(v("div", {onClick:() => {
    a.data.state.Qa = {Va:b.Va, B:b.B, node:f, x:b.x, y:b.y, target:5, jb:b.jb, zb:b.zb, Na:b.Na, ab:b.ab};
    a.l.refresh();
  }, style:Z}, v("span", {style:ck}, "\u25b6"), "cursor: " + e)) : e === 2 && (g = b.ab !== void 0 ? b.ab : -1, e = bk(a, f, b.B, b.Na !== void 0 ? b.Na : -1), g = bk(a, f, b.B, g), k.push(v("div", {onClick:() => {
    a.data.state.Qa = {Va:b.Va, B:b.B, node:f, x:b.x, y:b.y, target:6, jb:b.jb, zb:b.zb, Na:b.Na, ab:b.ab, af:0};
    a.l.refresh();
  }, style:Z}, v("span", {style:ck}, "\u25b6"), "var x: " + e)), k.push(v("div", {onClick:() => {
    a.data.state.Qa = {Va:b.Va, B:b.B, node:f, x:b.x, y:b.y, target:6, jb:b.jb, zb:b.zb, Na:b.Na, ab:b.ab, af:1};
    a.l.refresh();
  }, style:Z}, v("span", {style:ck}, "\u25b6"), "var y: " + g)));
  return v("div", null, c, v("div", {style:d}, k, k.length > 0 ? v("div", {style:{borderTop:"1px solid #444", margin:"2px 0"}}) : null, v("div", {onClick:() => {
    yf(f.F, b.jb || 0);
    Y(a);
    a.l.refresh();
  }, style:Z}, v("span", {style:{...ck, color:"#f44"}}, "\u00d7"), "Delete event")));
}
function jk(a, b, c, d) {
  const f = b.node;
  var e = Dg[b.zb || 0];
  e = e ? e[0] : null;
  const g = b.Na || 0, h = e ? e.key : 0, k = b.jb || 0;
  return v("div", null, c, v("div", {style:{...d, maxHeight:"152px", overflowY:"auto"}}, (e && e.options ? e.options : []).map((l, m) => v("div", {lid:m, onClick:() => {
    zf(f.F, k, h, m);
    Y(a);
    a.l.refresh();
  }, style:{...Z, height:"24px", backgroundColor:m === g ? "#2a4a6a" : "transparent"}}, v("span", {style:{...dk, color:m === g ? "#6af" : "#555"}}, m === g ? "\u2022" : " "), l))));
}
function kk(a, b, c, d) {
  const f = b.node, e = b.jb || 0, g = b.af || 0, h = g === 0 ? b.Na !== void 0 ? b.Na : -1 : b.ab !== void 0 ? b.ab : -1, k = ec(h);
  b = [];
  try {
    var l = nf(f.F);
    for (let m = 0; m < l.length; m++) {
      b.push({Oa:l[m].Oa, name:l[m].name || "v" + String(m + 1).padStart(2, "0")});
    }
  } catch (m) {
  }
  l = !Number.isNaN(h) && h < 0;
  return v("div", null, c, v("div", {style:{...d, maxHeight:"200px", overflowY:"auto"}}, v("div", {lid:"none", onClick:() => {
    zf(f.F, e, g, -1);
    Y(a);
    a.l.refresh();
  }, style:{...Z, height:"24px", backgroundColor:l ? "#2a4a6a" : "transparent"}}, v("span", {style:{...dk, color:l ? "#6af" : "#555"}}, l ? "\u2022" : " "), "(none)"), b.map((m, p) => v("div", {lid:p, onClick:() => {
    zf(f.F, e, g, y(m.Oa));
    Y(a);
    a.l.refresh();
  }, style:{...Z, height:"24px", backgroundColor:m.Oa === k ? "#2a4a6a" : "transparent"}}, v("span", {style:{...dk, color:m.Oa === k ? "#6af" : "#555"}}, m.Oa === k ? "\u2022" : " "), m.name))));
}
function lk(a, b, c, d, f, e) {
  const g = b.node, h = Yd(a.N.h), k = ej(b.B, a.data.state.A, h), l = qf(g.F), m = hf(a.N.g);
  return v("div", null, f, v("div", {style:e}, v("div", {style:{padding:"4px 10px"}}, v("input", {type:"text", placeholder:"name", value:l, onClick:p => p.stopPropagation(), onChange:p => {
    rf(g.F, p.currentTarget.value);
    a.l.refresh();
  }, onKeyDown:p => {
    p.stopPropagation();
    p.key === "Escape" && Y(a);
  }, style:{...eg, width:"100%", boxSizing:"border-box"}})), v("div", {onClick:() => {
    var p = b.Va;
    Y(a);
    a: {
      var t = a.data.state;
      var q = Xd(a.N), u = a.data.Pd;
      const J = [], ea = q.B;
      var r = ea || 0;
      const sa = [];
      var w = [];
      for (var z = 0; z < c.length;) {
        var A = z;
        for (z++; z < c.length && c[z].depth > d;) {
          z++;
        }
        w.push([A, z]);
      }
      for (z = w.length - 1; z >= 0; z--) {
        for (A = w[z][0]; A < w[z][1]; A++) {
          sa.push(A);
        }
      }
      w = Array(sa.length);
      for (z = 0; z < sa.length; z++) {
        var B = sa[z];
        A = c[B].depth;
        B = z + 1 + c[B].ja;
        w[z] = B >= sa.length ? !0 : c[sa[B]].depth < A;
      }
      var D = 0;
      z = sa.length;
      A = d;
      if (B = p < 0) {
        var x = !!t.collapsed[-1];
        p = ej(r, t.A, ea, !0);
        J.push((x ? "\u25b6" : "\u25bc") + "root");
        if (!x) {
          if (p.ra && (x = !!t.kb[r], J.push("\u2502 " + (x ? "[-] " : "[+] ") + "vars"), x)) {
            try {
              var C = mf(q.F);
              Eg(u, r, C);
              for (x = 0; x < C.length; x++) {
                var K = C[x];
                J.push("\u2502     " + (K.name || Fg(u, r, K.key, K.slot)) + " = " + (Number.isInteger(K.value) ? String(K.value) : K.value.toFixed(2)) + " [" + K.slot + "]");
              }
            } catch (U) {
            }
          }
          if (p.pa && (C = !!t.Bb[r], J.push("\u2502 " + (C ? "[-] " : "[+] ") + "cmds"), C)) {
            try {
              var V = sf(q.F);
              for (C = 0; C < V.length; C++) {
                J.push("\u2502     " + V[C].name);
              }
            } catch (U) {
            }
          }
          if (p.qa && (r = !!t.Cb[r], J.push("\u2502 " + (r ? "[-] " : "[+] ") + "events"), r)) {
            try {
              var W = xf(q.F);
              for (q = 0; q < W.length; q++) {
                J.push("\u2502     " + W[q].name + " (" + W[q].Yb + ")");
              }
            } catch (U) {
            }
          }
        }
      } else {
        D = sa.indexOf(p);
        if (D < 0) {
          t = "";
          break a;
        }
        z = D + 1 + c[p].ja;
        A = c[p].depth;
      }
      W = [];
      for (q = D; q < z;) {
        var Pa = sa[q];
        r = c[Pa];
        V = r.depth - A;
        C = r.ja > 0;
        K = !!t.collapsed[Pa];
        x = r.uuid && aj[r.uuid] || "gralm";
        var I = K ? "\u25b6" : "\u25bc";
        D = ej(r.B, t.A, ea);
        p = !!w[q];
        let U = "";
        for (let L = 0; L < V; L++) {
          U += W[L] ? "    " : "\u2502   ";
        }
        if (V > 0 || B) {
          U += p ? "\u2514\u2500\u2500 " : "\u251c\u2500\u2500 ";
        }
        Pa = C ? dj(c, Pa) : 0;
        J.push(U + I + x + " [" + r.Gb + "]" + (Pa > 0 ? " (" + Pa + ")" : ""));
        x = "";
        for (I = 0; I < V; I++) {
          x += W[I] ? "    " : "\u2502   ";
        }
        if (V > 0 || B) {
          x += p ? "    " : "\u2502   ";
        }
        x = C ? x + "\u2502 " : x + "  ";
        if (!K) {
          if (D.ra && (I = !!t.kb[r.B], J.push(x + ((I ? "[-] " : "[+] ") + "vars(" + r.Zb + ")")), I)) {
            try {
              const L = mf(r.F);
              Eg(u, r.B, L);
              for (I = 0; I < L.length; I++) {
                const ta = L[I];
                J.push(x + "    " + (ta.name || Fg(u, r.B, ta.key, ta.slot)) + " = " + (Number.isInteger(ta.value) ? String(ta.value) : ta.value.toFixed(2)) + " [" + ta.slot + "]");
              }
            } catch (L) {
            }
          }
          if (D.pa && (I = !!t.Bb[r.B], J.push(x + ((I ? "[-] " : "[+] ") + "cmds(" + r.xb + ")")), I)) {
            try {
              const L = sf(r.F);
              for (I = 0; I < L.length; I++) {
                J.push(x + "    " + L[I].name);
              }
            } catch (L) {
            }
          }
          if (D.qa && (D = !!t.Cb[r.B], J.push(x + ((D ? "[-] " : "[+] ") + "events(" + r.yb + ")")), D)) {
            try {
              const L = xf(r.F);
              for (D = 0; D < L.length; D++) {
                J.push(x + "    " + L[D].name);
              }
            } catch (L) {
            }
          }
        }
        W.length = V + 1;
        W[V] = p;
        K && C ? q += 1 + r.ja : q++;
      }
      t = J.join("\n");
    }
    navigator.clipboard.writeText(t);
  }, style:Z}, v("span", {style:ck}, "\u2398"), "Inspect"), v("div", {onClick:() => {
    Y(a);
    var p = g.i;
    const t = p.g;
    t.g && hd(t.g, p.B, 90001, 0);
  }, style:Z}, v("span", {style:ck}, "{"), "Copy JSON"), v("div", {onClick:() => Ij(a), style:Z}, v("span", {style:ck}, "\u2716"), "Clear Saved"), v("div", {onClick:() => Gj(a, b.B), style:Z}, v("span", {style:ck}, "\ud83d\udcbe"), "Save"), g && g.uuid && b.B !== h ? v("div", {onClick:() => {
    Y(a);
    g && (Aj(a, -1), g.D(), a.l.refresh());
  }, style:Z}, v("span", {style:ck}, "\u21bb"), "Restart") : null, v("div", {style:{borderTop:"1px solid #444", margin:"2px 0"}}), v("div", {onClick:() => {
    var p = b.B;
    const t = a.data.state.A.displayMap;
    if (!t[p]) {
      var q = Yd(a.N.h);
      q = ej(p, a.data.state.A, q);
      t[p] = {ra:q.ra, pa:q.pa, qa:q.qa};
    }
    t[p].ra = !t[p].ra;
    a.l.refresh();
    a.data.me();
  }, style:Z}, v("span", {style:{...dk, color:k.ra ? "#6af" : "#666"}}, k.ra ? "\u2611" : "\u2610"), "Variables"), v("div", {onClick:() => {
    var p = b.B;
    const t = a.data.state.A.displayMap;
    if (!t[p]) {
      var q = Yd(a.N.h);
      q = ej(p, a.data.state.A, q);
      t[p] = {ra:q.ra, pa:q.pa, qa:q.qa};
    }
    t[p].pa = !t[p].pa;
    a.l.refresh();
    a.data.me();
  }, style:Z}, v("span", {style:{...dk, color:k.pa ? "#6af" : "#666"}}, k.pa ? "\u2611" : "\u2610"), "Commands"), v("div", {onClick:() => {
    var p = b.B;
    const t = a.data.state.A.displayMap;
    if (!t[p]) {
      var q = Yd(a.N.h);
      q = ej(p, a.data.state.A, q);
      t[p] = {ra:q.ra, pa:q.pa, qa:q.qa};
    }
    t[p].qa = !t[p].qa;
    a.l.refresh();
    a.data.me();
  }, style:Z}, v("span", {style:{...dk, color:k.qa ? "#6af" : "#666"}}, k.qa ? "\u2611" : "\u2610"), "Events"), v("div", {style:{borderTop:"1px solid #444", margin:"2px 0"}}), v("div", {style:{padding:"4px 10px", display:"flex", alignItems:"center", gap:"4px"}}, v("select", {lid:"sel", onClick:p => p.stopPropagation(), style:{flex:"1", backgroundColor:"#1e1e1e", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", fontSize:"11px", padding:"2px 4px"}}, m.length === 0 ? v("option", {value:""}, 
  "(nenhuma classe)") : m.map((p, t) => v("option", {lid:t, value:p.uuid}, p.name || p.uuid))), v("div", {onClick:p => {
    (p = p.currentTarget.parentElement) && (p = p.querySelector("select")) && p.value && Hj(a, b.B, p.value);
  }, style:{padding:"2px 8px", cursor:"pointer", fontSize:"11px", color:"#e0e0e0", backgroundColor:"#3a3a3a", border:"1px solid #555", borderRadius:"2px", whiteSpace:"nowrap"}}, "Add Child")), (() => {
    const p = b.B === h;
    return v("div", {onClick:() => {
      p || (g.j(), Y(a));
    }, style:{...Z, ...(p ? {opacity:0.35, cursor:"default"} : {color:"#f66"})}}, v("span", {style:ck}, "\u2716"), "Delete");
  })()));
}
function mk(a, b, c) {
  const d = a.data.state.Qa;
  if (!d) {
    return null;
  }
  const f = {position:"fixed", left:d.x + "px", top:d.y + "px", backgroundColor:"#252526", border:"1px solid #555", borderRadius:"4px", padding:"4px 0", zIndex:"101", boxShadow:"0 4px 12px rgba(0,0,0,0.5)", minWidth:"140px"}, e = ek(a);
  return d.target === 1 ? fk(a, d, e, f) : d.target === 2 ? gk(a, d, e, f) : d.target === 3 ? hk(a, d, e, f) : d.target === 4 ? ik(a, d, e, f) : d.target === 5 ? jk(a, d, e, f) : d.target === 6 ? kk(a, d, e, f) : lk(a, d, b, c, e, f);
}
;class nk extends Ng {
  constructor(a, b, c) {
    super(a);
    this.N = c;
    this.data = b;
    c.O.h = () => {
      var d = document.getElementById(gg(this.l.za.v.key));
      if (d) {
        var f = this.N.O, e = d.querySelector('[lid="ed-tool"]');
        e && (e.value = String(f.j));
        if (d = d.querySelector('[lid="ed-style"]')) {
          d.value = String(f.i);
        }
      }
    };
    a = b.state;
    a.Lc || (a.Lc = !0, a.ze = c.Ib(() => c.refresh()), Df(c.h));
  }
  g() {
    const a = this.data.state;
    this.data.Pd.g = {};
    const b = this.N.D();
    var c = Yd(this.N.h);
    const d = Xd(this.N), f = new Set();
    for (var e = 0; e < b.length; e++) {
      f.add(b[e].B);
    }
    e = x => {
      for (const C in x) {
        f.has(parseInt(C, 10)) || delete x[C];
      }
    };
    e(a.Bb);
    e(a.kb);
    e(a.Cb);
    e(a.Hb);
    e = null;
    let g = [], h = {}, k = null;
    const l = this.data.wa;
    if (l.ka) {
      var m = l.ka;
      for (var p = 0; p < b.length; p++) {
        if (b[p].B === m.W) {
          k = b[p];
          break;
        }
      }
      k || m.W !== c && m.W !== (c || 0) || (k = d);
      if (k) {
        try {
          g = sf(k.F);
          m.la >= 0 && m.la < g.length && (e = g[m.la]);
          var t = mf(k.F);
          fj(m.W, t, a);
          h = Object.assign({}, Eg(this.data.Pd, m.W, t));
          var q = nf(k.F);
          for (t = 0; t < q.length; t++) {
            q[t].name && (h[q[t].Oa] = q[t].name);
          }
        } catch (x) {
        }
      }
      e || (l.ka = null);
    }
    q = b.length ? Mj(b) : {Ze:[], lf:0};
    m = q.Ze;
    q = q.lf;
    p = b.length ? Nj(b, m) : [];
    t = [];
    var u = [];
    const r = this;
    for (var w = 0; w < m.length;) {
      var z = m[w];
      const x = b[z];
      var A = x.depth - q, B = x.ja > 0;
      const C = !!a.collapsed[z], K = !(!r.N.O || !r.N.O.has(x.B));
      var D = !!p[w];
      const V = x.uuid && aj[x.uuid] || "gralm", W = C ? "\u25b6" : "\u25bc", Pa = Oj(u, A, D), I = Pj(u, A, D, B), J = ej(x.B, a.A, c), ea = z;
      u.length = A + 1;
      u[A] = D;
      A = !C && J.ra && !!a.kb[x.B];
      D = !C && J.pa && !!a.Bb[x.B];
      const sa = !C && J.qa && !!a.Cb[x.B];
      t.push(v("div", {lid:z}, v("div", {style:{display:"flex", alignItems:"center", paddingLeft:"6px", paddingRight:"4px", height:"20px", cursor:"pointer", backgroundColor:K ? "#094771" : "transparent", fontSize:"11px", whiteSpace:"nowrap"}, onClick:U => {
        var L = r.data.state;
        L.Nd = L.Nd === ea ? -1 : ea;
        zj(r);
        r.l.refresh();
        if (L = b[ea]) {
          var ta = r.N.C;
          ta.g && jd(ta.g, ta.h, 5, [L.B, U && U.ctrlKey ? 3 : 0], []);
        }
      }, onContextMenu:U => Ej(r, U, ea, x)}, Pa, v("span", {style:{width:"14px", flexShrink:"0", textAlign:"center", color:"#888", fontSize:"9px", cursor:"pointer", userSelect:"none"}, onClick:U => {
        U.stopPropagation();
        U = r.data.state;
        U.collapsed[ea] = !U.collapsed[ea];
        r.l.refresh();
      }}, W), v("span", {style:{color:"#4ec9b0", overflow:"hidden", textOverflow:"ellipsis"}}, V), v("span", {style:{color:"#888", marginLeft:"6px", fontSize:"9px"}}, "[" + x.Gb + "]"), B ? v("span", {style:{color:"#555", marginLeft:"4px", fontSize:"9px"}}, "(" + dj(b, z) + ")") : null), C ? null : v("div", {onMouseDown:() => Aj(r, ea)}, null, J.ra ? Xj(r, x, ea, A, I, x.Zb) : null, J.pa ? Yj(r, x, ea, D, I, x.xb) : null, J.qa ? Zj(r, x, ea, sa, I, x.yb) : null)));
      C && B ? w += 1 + x.ja : w++;
    }
    w = c || 0;
    c = ej(w, a.A, c, !0);
    m = !!a.collapsed[-1];
    p = !m && c.ra && !!a.kb[w];
    u = !m && c.pa && !!a.Bb[w];
    w = !m && c.qa && !!a.Cb[w];
    z = m ? "\u25b6" : "\u25bc";
    B = [v("span", {lid:"rc", style:Kj}, "\u2502")];
    c = v("div", null, v("div", {style:{display:"flex", alignItems:"center", height:"20px", paddingLeft:"6px", fontSize:"11px", color:"#9cdcfe", userSelect:"none", cursor:"pointer"}, onClick:() => {
      a.collapsed[-1] = !a.collapsed[-1];
      this.l.refresh();
    }, onContextMenu:x => Ej(r, x, -1, d)}, v("span", {style:{width:"14px", flexShrink:"0", textAlign:"center", color:"#888", fontSize:"9px", cursor:"pointer", userSelect:"none"}, onClick:x => {
      x.stopPropagation();
      a.collapsed[-1] = !a.collapsed[-1];
      this.l.refresh();
    }}, z), v("span", {style:{color:"#9cdcfe"}}, "root")), m ? null : v("div", {onMouseDown:() => Aj(r, -1)}, ak(r, d), c.ra ? Xj(r, d, -1, p, B) : null, c.pa ? Yj(r, d, -1, u, B) : null, c.qa ? Zj(r, d, -1, w, B) : null));
    return v("div", {tabIndex:"0", onKeyDown:x => Jj(r, x), style:{overflowY:"auto", overflowX:"hidden", outline:"none"}}, c, a.collapsed[-1] ? null : t, a.Qa ? mk(r, b, q) : null, l.ka && e && k ? Vb(new $i({entry:e, entries:g, la:l.ka.la, x:l.ka.x, y:l.ka.y, node:k, Nc:() => {
      l.ka = null;
      this.l.refresh();
    }, refresh:() => this.l.refresh(), Hb:h, Dd:l.ka})) : null);
  }
}
;const ok = {[0]:"#6af", [1]:"#8d8", [2]:"#fa6", [3]:"#c8a", [4]:"#cc8", [5]:"#aaa"};
const pk = [{T:9, label:"rect", group:0}, {T:13, label:"fRect", group:0}, {T:14, label:"sRect", group:0}, {T:10, label:"rRect", group:0}, {T:1, label:"arc", group:0}, {T:5, label:"ellip", group:0}, {T:22, label:"begin", group:1}, {T:7, label:"move", group:1}, {T:6, label:"line", group:1}, {T:4, label:"close", group:1}, {T:3, label:"bezir", group:1}, {T:8, label:"quad", group:1}, {T:2, label:"arcTo", group:1}, {T:24, label:"fill", group:2}, {T:27, label:"strk", group:2}, {T:23, label:"clip", group:2}, 
{T:43, label:"fClr", group:3}, {T:44, label:"sClr", group:3}, {T:31, label:"lnW", group:3}, {T:28, label:"lnCap", group:3}, {T:30, label:"lnJn", group:3}, {T:50, label:"alpha", group:3}, {T:59, label:"fText", group:4}, {T:63, label:"font", group:4}, {T:42, label:"save", group:5}, {T:41, label:"rest", group:5}, {T:21, label:"trnsl", group:5}, {T:17, label:"rot", group:5}, {T:18, label:"scale", group:5}];
function qk(a) {
  const b = a.data.gg.Nd;
  if (b < 0) {
    return -1;
  }
  a = a.N.D();
  return b >= a.length ? -1 : a[b].B;
}
class rk extends Ng {
  constructor(a, b, c) {
    super(a);
    this.data = b;
    this.N = c;
  }
  g() {
    const a = qk(this) > 0, b = {width:"40px", height:"28px", display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#333", border:"1px solid #555", borderRadius:"3px", cursor:a ? "pointer" : "default", fontSize:"9px", color:"#ccc", userSelect:"none", flexShrink:"0"};
    let c = -1;
    return v("div", {style:{fontFamily:"monospace", fontSize:"11px", padding:"4px", opacity:a ? "1" : "0.3", pointerEvents:a ? "auto" : "none"}}, a ? null : v("div", {style:{color:"#666", fontSize:"10px", padding:"4px"}}, "select an element in Object Tree"), v("div", {style:{display:"flex", flexWrap:"wrap", gap:"2px", alignItems:"center"}}, pk.map((d, f) => {
      const e = d.group !== c && c >= 0;
      c = d.group;
      var g = ok[d.group] || "#ccc";
      g = v("div", {lid:d.T, onClick:() => {
        var h = d.T, k = qk(this);
        if (!(k <= 0)) {
          k = vf(this.N.g.F(k));
          var l = k.L;
          switch(h) {
            case 22:
              l.beginPath();
              break;
            case 4:
              l.closePath();
              break;
            case 24:
              l.fill();
              break;
            case 27:
              l.stroke();
              break;
            case 42:
              l.save();
              break;
            case 41:
              l.restore();
              break;
            case 23:
              l.clip();
              break;
            case 9:
              l.rect(0, 0, 100, 100);
              break;
            case 13:
              l.fillRect(0, 0, 100, 100);
              break;
            case 14:
              l.strokeRect(0, 0, 100, 100);
              break;
            case 12:
              l.clearRect(0, 0, 100, 100);
              break;
            case 7:
              l.moveTo(0, 0);
              break;
            case 6:
              l.lineTo(100, 100);
              break;
            case 1:
              l.arc(50, 50, 50, 0, 2 * Math.PI, !1);
              break;
            case 5:
              l.ellipse(50, 50, 50, 30, 0, 0, 2 * Math.PI, !1);
              break;
            case 21:
              l.translate(0, 0);
              break;
            case 17:
              l.rotate(0);
              break;
            case 18:
              l.scale(1, 1);
              break;
            case 19:
              l.setTransform(1, 0, 0, 1, 0, 0);
              break;
            case 16:
              l.resetTransform();
              break;
            case 31:
              l.lineWidth = 1;
              break;
            case 43:
              l.fillStyle = 0;
              break;
            case 44:
              l.strokeStyle = 0;
              break;
            case 50:
              l.globalAlpha = 1;
          }
          k.end();
        }
      }, title:Ji[d.T] || "", style:Object.assign({}, b, {borderColor:g + "44"})}, v("span", {style:{color:g}}, d.label));
      return e ? v("div", {lid:"g" + f, style:{display:"contents"}}, v("div", {style:{width:"1px", height:"20px", backgroundColor:"#444", margin:"0 2px", flexShrink:"0"}}), g) : g;
    })));
  }
}
;const sk = {display:"flex", alignItems:"center", height:"22px", whiteSpace:"nowrap"}, tk = {width:"14px", textAlign:"center", cursor:"pointer", color:"#888", fontSize:"9px", flexShrink:"0"}, uk = {width:"16px", textAlign:"center", cursor:"pointer", color:"#6af", fontSize:"12px", flexShrink:"0"}, vk = {color:"#888", fontSize:"10px", flexShrink:"0"}, wk = {width:"16px", textAlign:"center", cursor:"pointer", color:"#8aa", fontSize:"11px", flexShrink:"0"}, xk = {padding:"3px 8px", fontSize:"11px", cursor:"pointer", 
background:"#5a2a2a", color:"#f0c0c0", border:"1px solid #844", borderRadius:"3px"}, yk = {padding:"3px 8px", fontSize:"11px", cursor:"pointer", background:"#3a3a3a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"3px"};
function zk(a) {
  a.data.flush();
  a.l.refresh();
}
function Ak(a, b) {
  ah(a.data.state.A, b, "nova categoria");
  zk(a);
}
function Bk(a) {
  a = a.data.state.Xc || {};
  const b = [];
  for (const c in a) {
    a[c] && b.push(c);
  }
  return b;
}
function Ck(a) {
  const b = a.data.state.A;
  var c = Bk(a);
  if (c.length && a.h) {
    var d = [], f = [];
    for (var e = 0; e < c.length; e++) {
      var g = c[e];
      const p = g.indexOf(":"), t = g.slice(0, p);
      g = g.slice(p + 1);
      t === "cat" && d.push(g);
      t === "item" && f.push(g);
    }
    var h = f.slice();
    for (c = 0; c < d.length; c++) {
      for (f = fh(b, d[c]), e = 0; e < f.length; e++) {
        h.indexOf(f[e]) < 0 && h.push(f[e]);
      }
    }
    var k = a.h, l = a.data.state, m = () => {
      for (let p = 0; p < d.length; p++) {
        ch(b, d[p]);
      }
      l.Xc = {};
      a.data.flush();
      k.refresh();
    };
    h.length ? vj(uj.If, void 0, p => {
      if (p) {
        for (let q = 0; q < h.length; q++) {
          if (jf(k.g, h[q])) {
            p = b;
            var t = h[q];
            delete p.assign[t];
            delete p.names[t];
            Uf(h[q]);
          }
        }
        m();
      } else {
        console.warn("excluir: pasta nao autorizada \u2014 nada foi apagado");
      }
    }) : m();
  }
}
function Dk(a, b) {
  var c = a.data.state.A;
  const d = Oj(b.Sf, b.depth, b.eg);
  c = b.pe ? v("span", {lid:"ca", style:tk, onClick:() => {
    var m = a.data.state.A, p = b.id;
    m.collapsed[p] = !m.collapsed[p];
    zk(a);
  }}, c.collapsed[b.id] ? "\u25b6" : "\u25bc") : v("span", {lid:"ca", style:tk}, "");
  var f = b.kind === "cat", e = b.kind === "item" && a.V[b.uuid] === 2, g = f || b.kind === "item" && !e;
  f = f ? {background:"transparent", border:"1px solid transparent", color:"#7fd1e0", fontWeight:"bold", fontSize:"13px", letterSpacing:"0.4px", textTransform:"uppercase", padding:"1px 3px", flex:"1", minWidth:"0", outline:"none"} : {background:"transparent", border:"1px solid transparent", color:"#d0d0d0", fontWeight:"normal", fontSize:"11px", fontFamily:"monospace", padding:"1px 3px", flex:"1", minWidth:"0", outline:"none"};
  e = g ? v("input", {lid:"nm", value:b.name, onInput:m => {
    b.kind === "cat" && bh(a.data.state.A, b.id, m.currentTarget.value);
  }, onChange:m => {
    b.kind === "cat" ? zk(a) : a.h && (m = m.currentTarget.value, m !== b.name && (af(a.h.g, b.uuid, m), delete a.data.state.A.names[b.uuid], zk(a)));
  }, onMouseDown:m => m.stopPropagation(), style:f}) : e ? v("span", {lid:"nm", title:"funcao de buffer", style:{fontWeight:"normal", color:"#d9b06a", flex:"1", fontSize:"11px", fontFamily:"monospace", padding:"1px 3px"}}, "\u0192 " + b.name) : v("span", {lid:"nm", style:{fontWeight:"bold", color:"#9ab", flex:"1", fontSize:"13px", letterSpacing:"0.4px"}}, b.name);
  g = g ? v("span", {lid:"sel", title:"selecionar", style:wk, onClick:() => {
    const m = a.data.state.Xc;
    m[b.key] ? delete m[b.key] : m[b.key] = !0;
    a.l.refresh();
  }}, a.data.state.Xc[b.key] ? "\u2611" : "\u2610") : v("span", {lid:"sel", style:wk}, "");
  f = [];
  b.kind !== "all" && b.kind !== "cat" || f.push(v("span", {lid:"add", title:"nova subcategoria", style:uk, onClick:() => Ak(a, b.id)}, "+"));
  b.kind === "cat" && f.push(v("span", {lid:"del", title:"remover categoria", style:uk, onClick:() => {
    ch(a.data.state.A, b.id);
    zk(a);
  }}, "\u00d7"));
  const h = b.count > 0 ? v("span", {lid:"cnt", style:vk}, "(" + b.count + ")") : null, k = b.kind === "item" || b.kind === "cat" ? "true" : "false", l = a.data.state.Xc[b.key] ? Object.assign({}, sk, {background:"#2d3a44"}) : sk;
  return v("div", {lid:b.key, draggable:k, onDragStart:m => a.onDragStart(m, b), onDragOver:m => a.onDragOver(m), onDrop:m => a.onDrop(m, b), style:l}, d, c, g, e, h, f);
}
class Ek extends Ng {
  constructor(a, b, c) {
    super(a);
    this.data = b;
    this.h = c;
    this.V = {};
    a = b.state;
    c && !a.Lc && (a.Lc = !0, a.ze = c.Ib(() => c.refresh()), Df(c.h));
  }
  onDragStart(a, b) {
    this.data.state.ke = {kind:b.kind, id:b.id};
  }
  onDragOver(a) {
    a.preventDefault();
  }
  onDrop(a, b) {
    a.preventDefault();
    if (b.kind !== "item" && (a = this.data.state.ke)) {
      var c = this.data.state.A;
      a.kind === "item" ? dh(c, a.id, b.kind === "cat" ? b.id : "__unclassified__") : a.kind === "cat" && eh(c, a.id, b.id);
      this.data.state.ke = null;
      zk(this);
    }
  }
  g() {
    var a = this.data.state, b = $g(a.A);
    a.A = b;
    var c = this.h ? hf(this.h.g) : [];
    a = [];
    const d = {}, f = {};
    for (let e = 0; e < c.length; e++) {
      a.push(c[e].uuid), c[e].name && (d[c[e].uuid] = c[e].name), f[c[e].uuid] = c[e].ge;
    }
    this.V = f;
    b = gh(b, a, d);
    c = Bk(this).length;
    return v("div", {style:{fontSize:"12px", color:"#e0e0e0"}}, v("div", {style:{display:"flex", gap:"6px", alignItems:"center", marginBottom:"6px"}}, v("button", {onClick:() => Ak(this, "__all__"), style:yk}, "+ categoria"), v("span", {style:{color:"#888", fontSize:"11px"}}, a.length + " classes"), c ? v("div", {style:{marginLeft:"auto", display:"flex", gap:"6px", alignItems:"center"}}, v("span", {style:{color:"#888", fontSize:"11px"}}, c + " sel."), v("button", {onClick:() => Ck(this), style:xk}, 
    "excluir")) : null), v("div", null, b.map(e => Dk(this, e))));
  }
}
;function Fk(a, b) {
  const c = a.g;
  let d = null;
  const f = {Fa:b.name, uuid:b.uuid, Bd:b.hf, nd:b.loaded, Ne:b.ge, get F() {
    d ||= new lf(c.g, "u:" + f.uuid);
    return d;
  }, info() {
    const e = hf(c.g).find(g => g.uuid === f.uuid);
    if (!e) {
      return console.warn("[ploftDev] classe nao esta mais no catalogo:", f.uuid), f;
    }
    f.Fa = e.name;
    f.Bd = e.hf;
    f.nd = e.loaded;
    f.Ne = e.ge;
    console.log("[ploftDev]", f.Fa || "(sem nome)", "\u00b7 uuid", f.uuid, "\u00b7 instancias:", f.Bd, "\u00b7 carregada:", f.nd);
    return f;
  }, je() {
    const e = sf(f.F);
    e.length ? console.table(e.map((g, h) => ({Qb:h, cc:g.name, vg:Be(g)}))) : console.log("[ploftDev] buffer sem comandos");
  }, qe(e, g) {
    if (typeof e !== "function") {
      return !1;
    }
    g === void 0 ? e = wf(f.F, e) : (g = vf(f.F, g), e(g.L), g.end(), e = !0);
    c.refresh();
    return e;
  }, $g(e) {
    const g = af(c.g, f.uuid, e || "");
    g && (f.Fa = e || "", c.refresh());
    return g;
  }, Ad(e) {
    a.Ad(f.uuid, e);
  }, bh() {
    vj(uj.Ae, void 0, e => {
      if (e) {
        e = qf(f.F);
        var g = Date.now();
        Cf(c.h, f.uuid, e, g) ? (Tf(f.uuid, e, g), console.log("[ploftDev] salvo", e || f.uuid, "\u2192 " + f.uuid + ".gbuf")) : console.warn("[ploftDev] salvar: filestore recusou");
      } else {
        console.warn("[ploftDev] salvar: pasta nao autorizada");
      }
    });
    return !0;
  }, flush() {
    const e = pf(f.F);
    if (!e) {
      return console.warn("[ploftDev] flush: sem buffer"), !1;
    }
    Xe(c.g, f.uuid, e.Tc);
    c.refresh();
    console.log("[ploftDev] definicao re-publicada:", f.Fa || f.uuid);
    return !0;
  }, Gg() {
    const e = jf(c.g, f.uuid);
    console.log("[ploftDev] apagar", f.Fa || f.uuid, "\u2192", e);
    e && c.refresh();
    return e;
  }};
  return f;
}
function Gk(a, b) {
  const c = a.g.D();
  let d = null;
  if (typeof b === "number") {
    d = c.find(f => f.B === b) || null;
  } else {
    const f = String(b);
    d = c.find(e => e.uuid && (e.uuid === f || $e(a.g.g, e.uuid) === f)) || c.find(e => e.uuid && e.uuid.lastIndexOf(f, 0) === 0) || null;
  }
  d || console.warn("[ploftDev] instancia nao encontrada:", b, "\u2014 veja ploftDev.listar()");
  return d;
}
class Hk {
  constructor(a, b) {
    this.g = a;
    this.h = b;
  }
  Le() {
    console.log("[ploftDev] console da INTEGRA do sistema:\n\n\u2500\u2500 DEFINICOES (classes) \u2014 def e inst separados, como no codigo \u2500\u2500\n  const b = ploftDev.classe('estrela')   -> abre a definicao (ScopedBuild)\n      b.ctx.fillStyle='#fa0'; b.ctx.fillRect(0,0,50,50)   (Canvas2D-like)\n      b.calc.alloc(40, \"px\")             -> variavel ([]vars, ref NaN)\n      b.self.add_coded_event(...)        -> eventos (ver dev_gralm_cmds.js)\n      b.end()                            -> fecha a definicao\n  ploftDev.publicar()                    -> registra a classe (defineClass)\n  ploftDev.instanciar('estrela')         -> poe na cena (createInstance)\n\n\u2500\u2500 CATALOGO (classes como ITENS \u2014 explorar/editar/salvar) \u2500\u2500\n  ploftDev.classes()                     -> tabela + Array<item>\n  const c = ploftDev.pegarClasse('estrela')   (nome, uuid ou prefixo)\n      c.info()          -> atualiza/mostra (instancias, carregada...)\n      c.def.*           -> BUFFER da classe (readCmds/readVars/setCmdParam...)\n      c.comandos()      / c.inserir(ctx=>{...}, pos?)\n          (editar via def.* JA propaga ao WASM a cada operacao)\n      c.renomear('n')   / c.instanciar()  / c.apagar()\n      c.salvar()        -> grava <uuid>.gbuf na pasta (gate; 1a vez pede pasta)\n      c.flush()         -> re-publica o buffer (so apos edicao crua no rec)\n\n\u2500\u2500 INSTANCIAS VIVAS (cena) \u2500\u2500\n  ploftDev.listar()                      -> tabela das instancias rodando\n  const n = ploftDev.pegar('estrela')    -> TreeNode (ou por gralmPtr/uuid)\n      n.def.*  -> BUFFER da classe (readCmds/readVars/readName/insert...)\n      n.inst.* -> instancia viva (focus/selectCmd/copyTreeJson...)\n  ploftDev.comandos(n_ou_sel)            -> lista os comandos do buffer\n  ploftDev.inserir(sel, ctx=>{...}, pos?) -> insere desenho (fim ou pos)\n\n\u2500\u2500 atalhos \u2500\u2500\n  ploftDev.exemplo() / novoElemento() / addRetangulo(ref,x,y,w,h,cor)");
  }
  Ue(a) {
    this.h.Qc && console.warn('[ploftDev] ja ha uma definicao aberta ("' + this.h.Qc.Fa + '") \u2014 publique-a (ploftDev.publicar()) ou descarte com ploftDev.publicar() apos b.end().');
    const b = Le(), c = new Qd(), d = c.Ma(b);
    a && d.name(a);
    this.h.Qc = {uuid:b, Fa:a || "", Tc:c};
    console.log("[ploftDev] definicao aberta", a || b, "\u2014 desenhe em b.ctx / b.calc / b.evt / b.self, feche com b.end() e registre com ploftDev.publicar()");
    return d;
  }
  uf() {
    const a = this.h.Qc;
    if (!a) {
      return console.warn("[ploftDev] nada aberto \u2014 comece com ploftDev.classe()"), !1;
    }
    if (!a.Tc.K.some(b => b.g === 6 && b.m === 11)) {
      return console.warn("[ploftDev] faltou b.end() \u2014 feche a definicao antes de publicar"), !1;
    }
    Xe(this.g.g, a.uuid, a.Tc);
    this.h.Qc = null;
    console.log("[ploftDev] classe publicada:", a.Fa || a.uuid, "\u2014 instancie com ploftDev.instanciar('" + (a.Fa || a.uuid) + "')");
    this.g.refresh();
    return !0;
  }
  Ve() {
    const a = hf(this.g.g).map(b => Fk(this, b));
    console.table(a.map(b => ({Fa:b.Fa || "(sem nome)", mh:b.Ne === 2 ? "\u0192 funcao" : "classe", uuid:b.uuid, Bd:b.Bd, nd:b.nd})));
    a.length && console.log("[ploftDev] itens no retorno \u2014 ex: const c = ploftDev.pegarClasse('" + (a[0].Fa || a[0].uuid) + "'); c.info() / c.def.* / c.comandos() / c.inserir(fn) / c.salvar()");
    return a;
  }
  sf(a) {
    const b = String(a);
    var c = hf(this.g.g);
    c = c.find(d => d.uuid === b || d.name === b) || c.find(d => d.uuid.lastIndexOf(b, 0) === 0) || null;
    if (!c) {
      return console.warn("[ploftDev] classe nao encontrada:", a, "\u2014 veja ploftDev.classes()"), null;
    }
    a = Fk(this, c);
    console.log("[ploftDev]", a.Fa || a.uuid, "\u2014 c.def.* (buffer) \u00b7 comandos() \u00b7 inserir(fn,pos?) \u00b7 renomear(n) \u00b7 instanciar() \u00b7 salvar() \u00b7 flush() \u00b7 apagar() \u00b7 info() atualiza");
    return a;
  }
  Ad(a, b) {
    const c = hf(this.g.g).find(d => d.uuid === a || d.name === a);
    c ? (b = Bf(this.g.h, c.uuid, b || Yd(this.g.h)), this.g.o(b, (d, f) => {
      d === 1 && f ? console.log("[ploftDev] instanciado", c.name || c.uuid, "\u2192 gralmPtr", f) : console.warn("[ploftDev] instanciar falhou:", a);
    })) : console.warn("[ploftDev] classe nao encontrada:", a, "\u2014 veja ploftDev.classes()");
  }
  jf() {
    const a = this.g.D();
    console.table(a.map((b, c) => ({Qb:c, B:b.B, Fa:b.uuid ? $e(this.g.g, b.uuid) || "" : "(internal)", uuid:b.uuid, K:b.xb, Lg:b.ja, Kg:b.yb})));
  }
  rf(a) {
    (a = Gk(this, a)) && console.log("[ploftDev] n.def.* = buffer da classe (readCmds/readVars/readName/insert/beginInsert...); n.inst.* = instancia viva (focus/selectCmd...)");
    return a;
  }
  je(a) {
    if (a = Gk(this, a)) {
      a = sf(a.F), a.length ? console.table(a.map((b, c) => ({Qb:c, cc:b.name, vg:Be(b)}))) : console.log("[ploftDev] buffer sem comandos");
    }
  }
  qe(a, b, c) {
    a = Gk(this, a);
    if (!a || typeof b !== "function") {
      return !1;
    }
    c === void 0 ? b = wf(a.F, b) : (a = vf(a.F, c), b(a.L), a.end(), b = !0);
    this.g.refresh();
    console.log("[ploftDev] inserir", c === void 0 ? "(fim)" : "@" + c, "\u2192", b);
    return b;
  }
  mf() {
    const a = Xd(this.g).h();
    if (!a) {
      return console.warn("[ploftDev] novoElemento falhou (editor ativo?)"), null;
    }
    const b = "e" + this.h.seq++, c = this.h;
    c.Vb[b] = 0;
    this.g.o(a, (d, f) => {
      d === 1 && f ? (c.Vb[b] = f, console.log("[ploftDev] novo elemento " + b + " (gralmPtr " + f + ")")) : (console.warn("[ploftDev] novoElemento falhou:", b), delete c.Vb[b]);
    });
    return b;
  }
  ee(a, b) {
    const c = this.h.Vb[a];
    if (!c) {
      return console.warn("[ploftDev] ref sem ptr ainda (a criacao e assincrona) ou desconhecida: " + a), !1;
    }
    b = wf(this.g.i(c).F, b);
    this.g.refresh();
    console.log("[ploftDev] comando adicionado a " + a + ":", b);
    return b;
  }
  fe(a, b, c, d, f, e) {
    return this.ee(a, g => {
      g.fillStyle = e || "#e33";
      g.fillRect(b, c, d, f);
    });
  }
  le() {
    const a = Xd(this.g).h(), b = "e" + this.h.seq++, c = this.h;
    c.Vb[b] = 0;
    const d = this;
    this.g.o(a, (f, e) => {
      f === 1 && e && (c.Vb[b] = e, d.fe(b, 0, 0, 60, 40, "#e33"));
    });
    return b;
  }
}
function Ik(a) {
  return {Le:() => a.Le(), Ue:b => a.Ue(b), uf:() => a.uf(), Ve:() => a.Ve(), sf:b => a.sf(b), Ad:(b, c) => a.Ad(b, c), jf:() => a.jf(), rf:b => a.rf(b), je:b => a.je(b), qe:(b, c, d) => a.qe(b, c, d), mf:() => a.mf(), ee:(b, c) => a.ee(b, c), fe:(b, c, d, f, e, g) => a.fe(b, c, d, f, e, g), le:() => a.le()};
}
function Jk(a, b) {
  if (b.N !== a) {
    b.yd && (b.yd.unregister(), b.yd = null);
    b.N = a;
    b.Vb = {};
    var c = a.j, d = a.H;
    c && d && (b.yd = Vd(c, d, {Eb:f => {
      b.se++;
      a: {
        var e = f.id();
        for (const g in Rd) {
          if (Rd[g] === e) {
            e = g;
            break a;
          }
        }
        e = "id=" + e;
      }
      b.Cd = e + " (ptr " + f.J() + ")";
      console.log("[ploftDev] notificacao:", b.Cd);
      a.refresh();
    }, Fb:(f, e) => {
      console.log("[ploftDev] set_data", f, "=", e);
    }}));
    c = new Hk(a, b);
    b.Me = c;
    window.ploftDev = Ik(c);
    console.log("%c[ploftDev] pronto \u2014 digite ploftDev.ajuda()", "color:#6af;font-weight:bold");
  }
}
;const Kk = {padding:"4px 10px", fontSize:"11px", cursor:"pointer", background:"#3a3a3a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"3px"};
class Lk extends Ng {
  constructor(a, b, c) {
    super(a);
    this.data = b;
    c && Jk(c, this.data.state);
  }
  g() {
    const a = this.data.state;
    return v("div", {style:{fontSize:"12px", color:"#e0e0e0", lineHeight:"1.5"}}, v("div", {style:{marginBottom:"4px"}}, v("span", {style:{color:"#6af"}}, "\u25cf"), " controle-modelo vivo"), v("div", {style:{fontSize:"11px", color:"#aaa", marginBottom:"6px"}}, "API no console: ", v("span", {style:{color:"#cd9", fontFamily:"monospace"}}, "ploftDev.ajuda()")), v("button", {onClick:() => {
      const b = this.data.state.Me;
      b && b.le();
      this.l.refresh();
    }, style:Kk}, "criar exemplo"), v("div", {style:{marginTop:"8px", fontSize:"11px", color:"#888"}}, "notificacoes recebidas: " + a.se), a.Cd ? v("div", {style:{fontSize:"10px", color:"#666"}}, "ultima: " + a.Cd) : null);
  }
}
;const Mk = {padding:"3px 8px", fontSize:"11px", cursor:"pointer", background:"#3a3a3a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"3px"}, Nk = {display:"flex", alignItems:"center", gap:"6px", height:"22px", whiteSpace:"nowrap"}, Ok = {flex:"1", minWidth:"0", overflow:"hidden", textOverflow:"ellipsis", color:"#e0e0e0", fontSize:"12px"}, Pk = {flex:"1", minWidth:"0", overflow:"hidden", textOverflow:"ellipsis", color:"#888", fontSize:"10px", fontFamily:"monospace"}, Qk = {color:"#777", 
fontSize:"10px", flexShrink:"0"}, Rk = {cursor:"pointer", color:"#6af", fontSize:"11px", flexShrink:"0"};
function Sk(a) {
  if (a.h) {
    var b = a.h, c = a.data.state;
    c.loading = !0;
    c.U = "";
    b.refresh();
    vj(uj.Jf, void 0, d => {
      d ? Df(b.h) : (c.loading = !1, c.U = "pasta nao autorizada", b.refresh());
    });
  }
}
function Tk(a, b) {
  if (a.h) {
    var c = a.h, d = a.data.state;
    d.U = "carregando " + (b.name || b.uuid) + "...";
    c.refresh();
    vj(uj.Kf, void 0, f => {
      if (f) {
        if (f = c.h, f.h && f.g) {
          var e = f.h, g = e.H.encode(b.uuid), h = e.h(g.length + 1);
          e.g.set(g, h);
          e.g[h + g.length] = 0;
          jd(f.g, f.i, 34, [h], []);
          e.j(h);
        }
      } else {
        d.U = "pasta nao autorizada", c.refresh();
      }
    });
  }
}
function Uk(a, b) {
  if (a.h) {
    var c = a.h, d = a.data.state;
    a = hf(c.g).find(f => f.uuid === b.uuid);
    d.U = "criando " + (b.name || b.uuid) + "...";
    c.refresh();
    vj(uj.Sd, {loaded:!(!a || !a.loaded)}, f => {
      f ? (f = Bf(c.h, b.uuid, Yd(c.h)), c.o(f, (e, g) => {
        d.U = e === 1 && g ? "instanciado: " + (b.name || b.uuid) : "falhou: " + (b.name || b.uuid);
        c.refresh();
      })) : (d.U = "pasta nao autorizada", c.refresh());
    });
  }
}
function Vk(a) {
  if (!a) {
    return "";
  }
  a = new Date(a);
  const b = c => c < 10 ? "0" + c : "" + c;
  return b(a.getDate()) + "/" + b(a.getMonth() + 1) + " " + b(a.getHours()) + ":" + b(a.getMinutes());
}
function Wk(a, b) {
  const c = b.name ? v("span", {lid:"nm", style:Ok, title:b.uuid}, b.name) : v("span", {lid:"nm", style:Pk}, b.uuid);
  return v("div", {lid:b.uuid, style:Nk}, c, v("span", {style:Qk}, Vk(b.Wc)), v("span", {onClick:() => Tk(a, b), style:Rk, title:"registra a definicao (nao instancia)"}, "carregar"), v("span", {onClick:() => Uk(a, b), style:Rk, title:"carrega e instancia na raiz"}, "+ cena"));
}
class Xk extends Ng {
  constructor(a, b, c) {
    super(a);
    this.data = b;
    this.h = c;
    const d = this.data.state;
    c && !d.kf && (d.kf = !0, d.zg = c.Ib(f => {
      d.loading = !1;
      d.files = f;
      d.U = f.length ? "" : "pasta vazia (ou nao conectada)";
      c.refresh();
    }));
  }
  g() {
    const a = this.data.state;
    return v("div", {style:{fontSize:"12px", color:"#e0e0e0"}}, v("div", {style:{display:"flex", gap:"6px", alignItems:"center", marginBottom:"6px"}}, v("button", {onClick:() => Sk(this), style:Mk}, a.files.length ? "atualizar" : "abrir pasta"), v("span", {style:{color:"#888", fontSize:"11px"}}, a.loading ? "lendo..." : a.files.length + " arquivo(s)")), a.U ? v("div", {style:{color:"#997", fontSize:"11px", marginBottom:"4px"}}, a.U) : null, v("div", null, a.files.map(b => Wk(this, b))));
  }
}
;function Yk(a) {
  return "svg/collections/" + a;
}
function Zk(a, b) {
  a = $k(a, b.id);
  b = 0;
  for (const c in a) {
    b = Math.max(b, parseInt(c, 10));
  }
  return b + 1;
}
function $k(a, b) {
  const c = {}, d = new Set(), f = e => {
    if (!d.has(e)) {
      d.add(e);
      var g = a.find(h => h.id === e);
      if (g) {
        for (const h of g.includes || []) {
          f(h);
        }
        for (const h in g.slots) {
          c[h] = g.slots[h];
        }
      }
    }
  };
  f(b);
  return c;
}
async function al(a, b) {
  return (a = await oj(a, Yk(b) + "/manifest.json")) && a.uuid === b ? a : null;
}
async function bl(a, b) {
  return pj(a, Yk(b.uuid) + "/manifest.json", b);
}
async function cl(a) {
  return (a = await oj(a, "svg/schemas.json")) ? a.schemas || [] : [];
}
async function dl(a, b) {
  return pj(a, "svg/schemas.json", {schemas:b});
}
function el(a, b) {
  return (a = a.find(c => c.id === b)) ? a.name || a.id : "";
}
var fl = $k;
function gl(a, b, c) {
  a = Zk(a, b);
  b.slots[String(a)] = c;
}
function hl(a, b, c, d) {
  if (c === d || d < 1) {
    return !1;
  }
  c = String(c);
  d = String(d);
  if (!(c in b.slots)) {
    return !1;
  }
  const f = b.slots[c];
  if (d in b.slots) {
    return b.slots[c] = b.slots[d], b.slots[d] = f, !0;
  }
  for (const e of b.includes || []) {
    if (d in $k(a, e)) {
      return !1;
    }
  }
  delete b.slots[c];
  b.slots[d] = f;
  return !0;
}
function il(a, b, c) {
  if (c === b.id) {
    return !1;
  }
  b.includes || (b.includes = []);
  if (b.includes.indexOf(c) >= 0) {
    return !1;
  }
  const d = new Set(), f = e => {
    if (e === b.id) {
      return !0;
    }
    if (d.has(e)) {
      return !1;
    }
    d.add(e);
    const g = a.find(h => h.id === e);
    if (!g) {
      return !1;
    }
    for (const h of g.includes || []) {
      if (f(h)) {
        return !0;
      }
    }
    return !1;
  };
  if (f(c)) {
    return !1;
  }
  b.includes.push(c);
  return !0;
}
function jl(a, b) {
  a = a.filter(c => c.id !== b);
  for (const c of a) {
    c.includes && (c.includes = c.includes.filter(d => d !== b));
  }
  return a;
}
function kl(a, b, c) {
  const d = new Set(), f = e => {
    if (e === c) {
      return !0;
    }
    if (d.has(e)) {
      return !1;
    }
    d.add(e);
    const g = a.find(h => h.id === e);
    if (!g) {
      return !1;
    }
    for (const h of g.includes || []) {
      if (f(h)) {
        return !0;
      }
    }
    return !1;
  };
  return f(b);
}
async function ll(a) {
  const b = [];
  var c = await qj(a);
  for (const d of c) {
    (c = await al(a, d)) && b.push(c);
  }
  return b;
}
async function ml(a, b, c, d) {
  if (!b) {
    return null;
  }
  b = {uuid:b, name:c, schemaId:d, catId:"", slots:{}};
  return await bl(a, b) ? b : null;
}
async function nl(a, b) {
  await sj(a, Yk(b));
}
async function ol(a, b, c, d) {
  const f = "slot_" + c + ".svg";
  if (!await lj(a, Yk(b.uuid) + "/slots/" + f, d)) {
    return !1;
  }
  b.slots[String(c)] = f;
  return bl(a, b);
}
async function pl(a, b, c) {
  const d = b.slots[String(c)];
  d && (await rj(a, Yk(b.uuid) + "/slots/" + d), delete b.slots[String(c)]);
  return bl(a, b);
}
async function ql(a, b, c) {
  return (c = b.slots[String(c)]) ? kj(a, Yk(b.uuid) + "/slots/" + c) : null;
}
;async function rl(a, b) {
  const c = a.data.state, d = await mj();
  d ? (c.Z = await cl(d), c.$a = await ll(d), c.loaded = !0, c.loading = !1, c.U = "") : (c.loading = !1, c.U = b ? "" : "pasta nao autorizada");
  a.l.refresh();
}
function sl(a, b) {
  const c = a.data.state;
  vj(uj.Be, void 0, async d => {
    d ? (d = await mj()) && await b(d) : c.U = "pasta nao autorizada";
    a.l.refresh();
  });
}
async function tl(a, b) {
  await dl(b, a.data.state.Z);
}
function ul(a, b, c) {
  const d = a.data.state;
  delete b.slots[String(c)];
  d.U = "";
  sl(a, async f => {
    await tl(a, f);
    for (const e of d.$a) {
      if (!e.schemaId || !e.slots[String(c)]) {
        continue;
      }
      if (!kl(d.Z, e.schemaId, b.id)) {
        continue;
      }
      const g = fl(d.Z, e.schemaId);
      String(c) in g || (await pl(f, e, c), vl(a, e.uuid, c));
    }
  });
}
function wl(a, b) {
  a = a.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9]+/g, " ").trim();
  if (!a) {
    return b ? "Tipo" : "ITEM";
  }
  a = a.split(" ");
  if (b) {
    return a.map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()).join("");
  }
  b = a.join("_").toUpperCase();
  return /^[0-9]/.test(b) ? "_" + b : b;
}
function vl(a, b, c) {
  a = a.data.state;
  b = b + ":" + c;
  a.uc[b] && (URL.revokeObjectURL(a.uc[b]), delete a.uc[b]);
}
function xl(a, b, c, d) {
  const f = a.data.state;
  sl(a, async e => {
    const g = await fetch(d).then(h => h.text());
    await ol(e, b, c, g) ? (vl(a, b.uuid, c), f.U = "") : f.U = "falha ao gravar slot " + c;
  });
}
function yl(a, b) {
  a = b.schemaId ? fl(a.data.state.Z, b.schemaId) : {};
  const c = {};
  for (const d in a) {
    c[d] = a[d];
  }
  for (const d in b.slots) {
    d in c || (c[d] = "");
  }
  return Object.keys(c).map(d => ({ta:parseInt(d, 10), name:c[d]})).sort((d, f) => d.ta - f.ta);
}
function zl(a) {
  const b = a.data.state;
  b.loading || (b.loading = !0, b.U = "carregando...", a.l.refresh(), vj(uj.Be, void 0, c => {
    c ? rl(a, !1) : (b.loading = !1, b.U = "pasta nao autorizada", a.l.refresh());
  }));
}
function Al(a) {
  const b = a.data.state, c = td ? td() : "";
  c ? sl(a, async d => {
    b.Z.push({id:c, name:"novo tipo", includes:[], slots:{}});
    b.Kd[c] = !0;
    await tl(a, d);
  }) : (b.U = "wasm indisponivel (uuid)", a.l.refresh());
}
function Bl(a, b, c) {
  c.trim() && c !== b.name && (b.name = c.trim(), sl(a, d => tl(a, d)));
}
function Cl(a, b) {
  const c = a.data.state;
  c.Z = jl(c.Z, b.id);
  delete c.Kd[b.id];
  sl(a, d => tl(a, d));
}
function Dl(a, b) {
  const c = a.data.state, d = {}, f = {}, e = [], g = new Set(), h = k => {
    if (!g.has(k)) {
      g.add(k);
      var l = c.Z.find(m => m.id === k);
      if (l) {
        for (const m of l.includes || []) {
          h(m);
        }
        e.push(k);
        for (const m in l.slots) {
          f[m] = l.slots[m], d[m] = k;
        }
      }
    }
  };
  h(b.id);
  a = [];
  a.push("/** @enum {number} " + (b.name || "tipo") + " \u2014 tipo SVG_SCHEMA " + b.id + " */");
  a.push("const e" + wl(b.name || "Tipo", !0) + " = {");
  for (const k of e) {
    const l = Object.keys(f).filter(m => d[m] === k).map(m => parseInt(m, 10)).sort((m, p) => m - p);
    if (l.length) {
      if (e.length > 1) {
        const m = c.Z.find(p => p.id === k);
        a.push("    // " + (k === b.id ? "proprios" : "de " + (m && m.name || k)));
      }
      for (const m of l) {
        a.push("    " + wl(f[String(m)], !1) + " : " + m + ",");
      }
    }
  }
  a.push("};");
  navigator.clipboard.writeText(a.join("\n"));
}
function El(a, b, c) {
  c.trim() && (gl(a.data.state.Z, b, c.trim()), sl(a, d => tl(a, d)));
}
function Fl(a, b, c, d) {
  d.trim() === "" ? ul(a, b, c) : b.slots[String(c)] !== d && (b.slots[String(c)] = d, sl(a, f => tl(a, f)));
}
function Gl(a, b, c, d) {
  const f = a.data.state;
  d.trim() === "" ? ul(a, b, c) : (d = parseInt(d, 10), isNaN(d) || d === c ? a.l.refresh() : hl(f.Z, b, c, d) ? (f.U = "", sl(a, e => tl(a, e))) : (f.U = "numero " + d + " ja em uso", a.l.refresh()));
}
function Hl(a, b, c) {
  const d = a.data.state;
  il(d.Z, b, c) ? sl(a, f => tl(a, f)) : (d.U = "inclusao recusada (self/duplicado/ciclo)", a.l.refresh());
}
function Il(a) {
  const b = a.data.state, c = b.Ed.trim(), d = sd ? sd() : "";
  d ? sl(a, async f => {
    (f = await ml(f, d, c, b.Fd)) ? (b.$a.push(f), b.Ed = "", b.Wb = f.uuid, b.U = "") : b.U = "falha ao criar colecao";
  }) : (b.U = "wasm indisponivel (uuid)", a.l.refresh());
}
function Jl(a, b, c) {
  c.trim() !== b.name && (b.name = c.trim(), sl(a, async d => {
    await bl(d, b);
  }));
}
function Kl(a, b) {
  const c = a.data.state;
  sl(a, async d => {
    await nl(d, b.uuid);
    for (const f in b.slots) {
      vl(a, b.uuid, parseInt(f, 10));
    }
    c.$a = c.$a.filter(f => f.uuid !== b.uuid);
    c.Wb === b.uuid && (c.Wb = "");
  });
}
function Ll(a, b) {
  var c = a.data.state;
  a = b.name || b.uuid.slice(0, 8);
  c = b.schemaId ? el(c.Z, b.schemaId) || b.schemaId : "";
  c = "colecao " + a + (b.schemaId ? " \u2014 tipo " + c + " (SVG_SCHEMA " + b.schemaId + ")" : " \u2014 livre");
  b = "/** @const {string} */ const UUID_" + wl(a, !1) + " = '" + b.uuid + "'; //" + c;
  navigator.clipboard.writeText(b);
}
function Ml(a, b, c) {
  const d = a.data.state, f = b.uuid + ":" + c;
  if (d.uc[f]) {
    return d.uc[f];
  }
  if (!b.slots[String(c)] || d.xe[f]) {
    return null;
  }
  d.xe[f] = !0;
  (async() => {
    var e = await mj();
    e = e ? await ql(e, b, c) : null;
    delete d.xe[f];
    e && (d.uc[f] = URL.createObjectURL(new Blob([e], {type:"image/svg+xml"})), a.l.refresh());
  })();
  return null;
}
function Nl(a, b, c) {
  sl(a, async d => {
    await pl(d, b, c);
    vl(a, b.uuid, c);
  });
}
function Ol(a) {
  return Object.keys(a.slots).map(b => ({ta:parseInt(b, 10), name:a.slots[b]})).sort((b, c) => b.ta - c.ta);
}
function Pl(a, b) {
  const c = fl(a.data.state.Z, b);
  return Object.keys(c).map(d => ({ta:parseInt(d, 10), name:c[d]})).sort((d, f) => d.ta - f.ta);
}
function Ql(a, b) {
  a = yl(a, b).map(c => c.ta);
  return a.length ? Math.max.apply(null, a) + 1 : 1;
}
;const Rl = {padding:"3px 8px", fontSize:"11px", cursor:"pointer", background:"#3a3a3a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"3px"}, Sl = {display:"flex", alignItems:"center", gap:"6px", height:"24px", whiteSpace:"nowrap", cursor:"pointer"}, Tl = {color:"#888", fontSize:"10px"}, Ul = {width:"16px", textAlign:"center", cursor:"pointer", color:"#a66", fontSize:"12px", flexShrink:"0"}, Vl = {width:"14px", textAlign:"center", cursor:"pointer", color:"#888", fontSize:"9px", flexShrink:"0"}, 
Wl = {...eg, width:"30px", textAlign:"right", flexShrink:"0"}, Xl = {borderTop:"1px solid #3a3a3a", margin:"8px 0"};
function Yl(a, b, c) {
  const d = a.data.state, f = b.id + ":" + c, e = !!d.qf[f];
  b = e ? Pl(a, c) : [];
  return v("div", {lid:"inc-" + f, style:{marginLeft:"20px"}}, v("div", {style:Sl, onClick:() => {
    d.qf[f] = !e;
    a.l.refresh();
  }}, v("span", {style:Vl}, e ? "\u2212" : "+"), v("span", {style:{color:"#b09ad9", fontSize:"11px"}}, el(d.Z, c) || c), v("span", {style:Tl}, "(incluido)")), e ? b.map(g => v("div", {lid:"incel-" + f + "-" + g.ta, style:{...Sl, marginLeft:"20px", cursor:"default"}}, v("span", {style:{...Tl, width:"30px", textAlign:"right"}}, String(g.ta)), v("span", {style:{color:"#999", fontSize:"11px"}}, g.name))) : null);
}
function Zl(a, b) {
  const c = a.data.state, d = !!c.Kd[b.id], f = Ol(b), e = Pl(a, b.id).length;
  return v("div", {lid:"sch-" + b.id}, v("div", {draggable:"true", onDragStart:g => {
    c.Nb = b.id;
    g.dataTransfer.setData("application/x-ploft-svg-schema", b.id);
    g.dataTransfer.effectAllowed = "link";
  }, onDragEnd:() => {
    c.Nb = "";
  }, onDragOver:g => {
    c.Nb && c.Nb !== b.id && g.preventDefault();
  }, onDrop:g => {
    g.preventDefault();
    c.Nb && Hl(a, b, c.Nb);
    c.Nb = "";
  }, style:Sl}, v("span", {style:Vl, onClick:() => {
    c.Kd[b.id] = !d;
    a.l.refresh();
  }}, d ? "\u25bc" : "\u25b6"), v("input", {value:b.name, onChange:g => Bl(a, b, g.currentTarget.value), onMouseDown:g => g.stopPropagation(), style:{background:"transparent", border:"1px solid transparent", color:"#7fd1e0", fontWeight:"bold", fontSize:"12px", flex:"1", minWidth:"0", outline:"none", padding:"1px 3px"}}), v("span", {style:Tl}, "(" + e + ")"), v("span", {title:"copiar enum JS (com heranca por secao)", style:{cursor:"pointer", fontSize:"11px", color:"#6af", flexShrink:"0"}, onClick:g => 
  {
    g.stopPropagation();
    Dl(a, b);
  }, onMouseDown:g => g.stopPropagation()}, "\u29c9"), v("span", {title:"apagar tipo", style:Ul, onClick:g => {
    g.stopPropagation();
    Cl(a, b);
  }, onMouseDown:g => g.stopPropagation()}, "\u00d7")), d ? v("div", {style:{marginLeft:"14px"}}, (b.includes || []).map(g => Yl(a, b, g)), f.map(g => v("div", {lid:"el-" + b.id + "-" + g.ta, style:{...Sl, cursor:"default"}}, v("input", {value:String(g.ta), title:"vazio = apaga o elemento (e o arquivo ocioso do slot)", onChange:h => Gl(a, b, g.ta, h.currentTarget.value), style:Wl}), v("input", {value:g.name, title:"vazio = apaga o elemento (e o arquivo ocioso do slot)", onChange:h => Fl(a, b, g.ta, 
  h.currentTarget.value), style:{...eg, flex:"1"}}))), v("div", {style:{...Sl, cursor:"default"}}, v("span", {style:{...Tl, width:"30px", textAlign:"right"}}, String(Zk(c.Z, b))), v("input", {placeholder:"novo elemento...", onChange:g => {
    g = g.currentTarget;
    El(a, b, g.value);
    g.value = "";
  }, style:{...eg, flex:"1"}}))) : null);
}
function $l(a) {
  const b = a.data.state;
  return v("div", null, v("div", {style:{display:"flex", gap:"6px", alignItems:"center", marginBottom:"4px"}}, v("span", {onClick:() => {
    b.vc = !b.vc;
    a.l.refresh();
  }, style:{...Vl, fontSize:"11px", color:"#6af", width:"auto"}}, b.vc ? "[\u2212]" : "[+]"), v("span", {onClick:() => {
    b.vc = !b.vc;
    a.l.refresh();
  }, style:{color:"#7fd1e0", fontSize:"11px", fontWeight:"bold", letterSpacing:"0.4px", cursor:"pointer"}}, "TIPOS"), v("span", {style:Tl}, "(" + b.Z.length + ")"), v("button", {onClick:() => Al(a), style:{...Rl, marginLeft:"auto"}}, "adicionar")), b.vc ? b.Z.map(c => Zl(a, c)) : null);
}
function am(a, b) {
  const c = a.data.state, d = Object.keys(b.slots).length, f = yl(a, b).length;
  return v("div", {lid:"col-" + b.uuid, style:{...Sl, marginLeft:"14px"}, onClick:() => {
    c.Wb = b.uuid;
    a.l.refresh();
  }}, v("span", {style:{color:"#6af", fontSize:"12px"}}, "\u25b8"), b.name ? v("span", {style:{color:"#d0e0d0", fontSize:"12px", fontWeight:"bold", flex:"1", overflow:"hidden", textOverflow:"ellipsis"}}, b.name) : v("span", {style:{...Tl, fontFamily:"monospace", flex:"1", overflow:"hidden", textOverflow:"ellipsis"}}, b.uuid), v("span", {title:"copiar uuid (const JS com descricao)", style:{cursor:"pointer", fontSize:"11px", color:"#6af", flexShrink:"0"}, onClick:e => {
    e.stopPropagation();
    Ll(a, b);
  }}, "\u29c9"), v("span", {style:Tl}, d + "/" + f), v("span", {title:"apagar colecao (definitivo)", style:Ul, onClick:e => {
    e.stopPropagation();
    Kl(a, b);
  }}, "\u00d7"));
}
function bm(a, b, c) {
  return a === c ? v("option", {value:a, selected:!0}, b) : v("option", {value:a}, b);
}
function cm(a) {
  const b = a.data.state, c = [];
  for (var d = 0; d < b.Z.length; d++) {
    const e = b.Z[d], g = b.$a.filter(h => h.schemaId === e.id);
    g.length && c.push({label:e.name || e.id, cols:g});
  }
  const f = {};
  for (d = 0; d < b.Z.length; d++) {
    f[b.Z[d].id] = !0;
  }
  d = b.$a.filter(e => !e.schemaId || !f[e.schemaId]);
  d.length && c.push({label:"(livre)", cols:d});
  return v("div", null, v("div", {style:{display:"flex", gap:"4px", alignItems:"center", marginBottom:"6px"}}, v("input", {placeholder:"nova colecao (nome opcional)...", value:b.Ed, onInput:e => {
    b.Ed = e.currentTarget.value;
  }, style:{...eg, flex:"1"}}), v("select", {onChange:e => {
    b.Fd = e.currentTarget.value;
  }, style:fg}, bm("", "(livre)", b.Fd), b.Z.map(e => bm(e.id, e.name || e.id, b.Fd))), v("button", {onClick:() => Il(a), style:Rl}, "criar")), c.map(e => v("div", {lid:"grp-" + e.label}, v("div", {style:{...Tl, fontWeight:"bold", letterSpacing:"0.3px", padding:"2px 0"}}, e.label + " (" + e.cols.length + ")"), e.cols.map(g => am(a, g)))), b.$a.length ? null : v("div", {style:{...Tl, padding:"8px 0"}}, "nenhuma colecao \u2014 crie acima ou copie para svg/collections/"));
}
function dm(a, b, c, d, f) {
  const e = a.data.state, g = !f && !!b.slots[String(c)], h = g ? Ml(a, b, c) : null, k = b.uuid + ":" + c, l = {width:"72px", height:"72px", backgroundColor:g ? "#ffffff" : "#252526", border:e.fc === k ? "2px solid #4a9eff" : g ? "1px solid #444" : "1px dashed #555", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", position:"relative", cursor:g ? "grab" : "default"};
  d = b.schemaId && !f ? v("span", {style:{color:"#aaa", fontSize:"9px", maxWidth:"72px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}, d) : v("span", {style:{color:"#777", fontSize:"9px"}}, f ? "+ proximo" : "");
  return v("div", {lid:"slot-" + k, style:{display:"flex", flexDirection:"column", alignItems:"center"}, onDragOver:m => {
    const p = pi;
    p && p.kind === 1 && (m.preventDefault(), m.dataTransfer.dropEffect = "copy", e.fc !== k && (e.fc = k, a.l.refresh()));
  }, onDragLeave:() => {
    e.fc === k && (e.fc = "", a.l.refresh());
  }, onDrop:m => {
    m.preventDefault();
    e.fc = "";
    (m = pi) && m.kind === 1 && xl(a, b, c, m.data.url);
  }}, v("div", {draggable:h ? "true" : "false", onDragStart:m => {
    if (h) {
      var p = {url:h, w:72, ma:72};
      m.dataTransfer.setData("application/x-ploft", JSON.stringify(p));
      m.dataTransfer.effectAllowed = "copy";
      pi = new oi(36, 36, p);
    } else {
      m.preventDefault();
    }
  }, onDragEnd:() => {
    pi = null;
  }, style:l}, v("span", {style:{position:"absolute", left:"2px", top:"1px", fontSize:"9px", color:"#6af"}}, String(c)), g && h ? v("img", {src:h, style:{maxWidth:"100%", maxHeight:"100%", objectFit:"contain"}}) : v("span", {style:{color:"#555", fontSize:"10px"}}, g ? "\u2026" : ""), g ? v("span", {title:"esvaziar slot", onClick:m => {
    m.stopPropagation();
    Nl(a, b, c);
  }, onMouseDown:m => m.stopPropagation(), style:{position:"absolute", right:"2px", top:"0", cursor:"pointer", color:"#888", fontSize:"11px"}}, "\u00d7") : null), d);
}
function em(a, b) {
  const c = a.data.state, d = yl(a, b).map(e => dm(a, b, e.ta, e.name, !1));
  b.schemaId || d.push(dm(a, b, Ql(a, b), "", !0));
  const f = b.schemaId ? el(c.Z, b.schemaId) || b.schemaId : "(livre)";
  return v("div", null, v("div", {style:{display:"flex", gap:"6px", alignItems:"center", marginBottom:"6px"}}, v("button", {onClick:() => {
    c.Wb = "";
    a.l.refresh();
  }, style:Rl}, "\u25c2"), v("input", {value:b.name, placeholder:"(sem nome)", onChange:e => Jl(a, b, e.currentTarget.value), style:{...eg, flex:"1", fontWeight:"bold", fontSize:"12px"}}), v("span", {style:Tl}, f)), v("div", {style:{...Tl, marginBottom:"6px", fontFamily:"monospace", display:"flex", alignItems:"center", gap:"6px"}}, v("span", {style:{overflow:"hidden", textOverflow:"ellipsis"}}, b.uuid), v("span", {title:"copiar uuid (const JS com descricao)", style:{cursor:"pointer", fontSize:"11px", 
  color:"#6af", flexShrink:"0"}, onClick:() => Ll(a, b)}, "\u29c9")), v("div", {style:{display:"flex", flexWrap:"wrap", gap:"6px"}}, d));
}
class fm extends Ng {
  constructor(a, b) {
    super(a);
    this.data = b;
    a = this.data.state;
    a.Pe || a.loading || (a.Pe = !0, a.loading = !0, rl(this, !0));
  }
  g() {
    const a = this.data.state, b = this, c = a.Wb ? a.$a.find(d => d.uuid === a.Wb) || null : null;
    return v("div", {style:{fontSize:"12px", color:"#e0e0e0"}}, a.loaded ? c ? em(this, c) : v("div", null, $l(this), v("div", {style:Xl}), cm(this)) : v("div", {style:{display:"flex", gap:"6px", alignItems:"center"}}, v("button", {onClick:() => zl(b), style:Rl}, a.loading ? "..." : "\ud83d\udcc2 conectar pasta"), v("span", {style:Tl}, a.U || "raiz de dados do usuario (svg/)")), a.loaded && a.U ? v("div", {style:{color:"#d9b06a", fontSize:"10px", marginTop:"4px"}}, a.U) : null);
  }
}
;function gm(a, b) {
  const c = {collapsed:{}, ia:new Set(), Ta:"", ka:null, Ec:-1, Dc:-1, pd:-1, dc:null}, d = {collapsed:{}, Nd:-1, Bb:{}, kb:{}, Cb:{}, A:{displayMap:{}}, Qa:null, Hb:{}, td:null, ud:null, Sg:{}, zf:[], ld:"", Lc:!1, ze:null}, f = new Gg(d.Hb), e = {Ka:[], zd:"", bb:-1, oc:(new Date()).getFullYear(), cb:(new Date()).getMonth()}, g = {A:{count:0}}, h = {A:{thumbSize:80, thumbGap:4, folderFontSize:11, fileFontSize:9, thumbBg:"#ffffff", toolbarMode:"size", pinned:"*unclass", splitH:200}, folders:[], 
  Oe:!1, Ee:!1, va:0, kd:0, jd:0, de:0, hd:0, ca:{}, ac:null, be:null, aa:null, Td:0, u:null, La:null, Ud:0, Jb:!0, Lb:!0, Xa:null, Ya:"", Kb:"", ub:{}, tb:{}}, k = {}, l = {A:Yg(), ke:null, Xc:{}, Lc:!1, ze:null}, m = {files:[], loading:!1, U:"", kf:!1, zg:null}, p = {N:null, yd:null, Me:null, Qc:null, Vb:{}, seq:1, se:0, Cd:""}, t = {Z:[], $a:[], loaded:!1, loading:!1, Pe:!1, U:"", Wb:"", uc:{}, xe:{}, Ed:"", Fd:"", fc:"", vc:!0, Kd:{}, qf:{}, Nb:""};
  a.register({key:"objtree", label:"OBJECT TREE", visible:!0, height:300, create:q => new nk(q, {state:d, wa:c, Pd:f, me:() => {
    a.Ca && a.Ca.set("objtree_display", d.A);
  }}, b), gb:() => "OBJECT TREE (" + (b ? b.D().length : 0) + ")", Oc:async q => {
    (q = await q.get("objtree_display")) && q.displayMap && (d.A.displayMap = q.displayMap);
  }, Pc:q => {
    q.set("objtree_display", d.A);
  }});
  a.register({key:"drawing", label:"DRAWING", visible:!0, height:120, create:q => new rk(q, {state:k, gg:d}, b)});
  a.register({key:"gallery", label:"GALLERY", visible:!0, height:250, create:q => new Hi(q, {state:h}), gb:() => "GALLERY (" + h.folders.reduce((q, u) => q + u.files.length, 0) + ")", Oc:async q => {
    if (q = await q.get("gallery_prefs")) {
      const u = h.A;
      u.thumbSize = q.thumbSize ?? u.thumbSize;
      u.thumbGap = q.thumbGap ?? u.thumbGap;
      u.folderFontSize = q.folderFontSize ?? u.folderFontSize;
      u.fileFontSize = q.fileFontSize ?? u.fileFontSize;
      u.thumbBg = q.thumbBg ?? u.thumbBg;
      u.toolbarMode = q.toolbarMode ?? u.toolbarMode;
      u.pinned = q.pinned ?? u.pinned;
      u.splitH = q.splitH ?? u.splitH;
      q.openFolders && (h.be = q.openFolders);
    }
    h.Ee = !0;
  }, Pc:q => {
    const u = h.A;
    q.set("gallery_prefs", {thumbSize:u.thumbSize, thumbGap:u.thumbGap, folderFontSize:u.folderFontSize, fileFontSize:u.fileFontSize, thumbBg:u.thumbBg, toolbarMode:u.toolbarMode, pinned:u.pinned, splitH:u.splitH, openFolders:h.folders.filter(r => r.open).map(r => r.name)});
  }});
  a.register({key:"classify", label:"CLASSIFICATION", visible:!0, height:300, create:q => new Ek(q, {state:l, flush:() => {
    a.Ca && a.Ca.set("classify_model", l.A);
  }}, b), gb:() => "CLASSIFICATION (" + l.A.categories.length + " cat)", Oc:async q => {
    if (q = await q.get("classify_model")) {
      l.A = q;
    }
  }, Pc:q => {
    q.set("classify_model", l.A);
  }});
  a.register({key:"library", label:"LIBRARY (pasta)", visible:!0, height:200, create:q => new Xk(q, {state:m}, b), gb:() => "LIBRARY (" + m.files.length + ")"});
  a.register({key:"svgcol", label:"SVG COLLECTIONS", visible:!0, height:250, create:q => new fm(q, {state:t}), gb:() => "SVG COLLECTIONS (" + t.$a.length + ")"});
  a.register({key:"devsample", label:"DEV SAMPLE", visible:!0, height:140, create:q => new Lk(q, {state:p}, b), gb:() => "DEV SAMPLE (" + p.se + ")"});
  a.register({key:"vars", label:"VARIABLES", visible:!1, height:200, create:q => new Rg(q, {state:e}), gb:() => "VARIABLES (" + e.Ka.length + ")"});
  a.register({key:"hello", label:"HELLO WORLD", visible:!1, height:100, create:q => new Sg(q, {state:g}), Oc:async q => {
    if (q = await q.get("hello_prefs")) {
      g.A.count = q.count;
    }
  }, Pc:q => {
    q.set("hello_prefs", g.A);
  }});
}
;function hm(a) {
  a.i || (a.i = Vd(a.oa, a.O, {Rb:a.Rb !== im.prototype.Rb ? b => a.Rb(b) : void 0, Sb:a.Sb !== im.prototype.Sb ? b => a.Sb(b) : void 0, Tb:a.Tb !== im.prototype.Tb ? b => a.Tb(b) : void 0, Hd:a.Hd !== im.prototype.Hd ? (b, c) => a.Hd(b, c) : void 0, Fb:a.Fb !== im.prototype.Fb ? (b, c) => a.Fb(b, c) : void 0, Id:a.Id !== im.prototype.Id ? b => a.Id(b) : void 0, Jd:a.Jd !== im.prototype.Jd ? (b, c) => a.Jd(b, c) : void 0, Eb:a.Eb !== im.prototype.Eb ? b => a.Eb(b) : void 0}));
}
class im {
  constructor(a, b) {
    this.oa = a;
    this.O = b;
    this.ba = a.V;
    this.i = null;
  }
  Rb() {
    return !1;
  }
  Sb() {
    return !1;
  }
  Tb() {
  }
  Hd() {
    return !1;
  }
  Fb() {
  }
  Id() {
    return 0;
  }
  Jd() {
    return 0;
  }
  Eb() {
  }
  R() {
    this.i && (this.i.unregister(), this.i = null);
  }
}
;function jm(a, b) {
  const c = a.g;
  a = a.h;
  c.save();
  c.transform(a[0], a[1], a[2], a[3], a[4], a[5]);
  b();
  c.restore();
}
function km(a, b, c, d, f, e) {
  if ((a.i & 1) !== 0) {
    jm(a, () => b(c, d, f, e));
  } else {
    var g = If(a.h, c, d);
    b(g[0], g[1], f * a.h[0], e * a.h[3]);
  }
}
class lm {
  constructor(a, b) {
    this.g = a;
    this.h = b;
    a = 0;
    if (b[1] !== 0 || b[2] !== 0) {
      a |= 1;
    }
    Math.abs(Math.hypot(b[0], b[1]) - Math.hypot(b[2], b[3])) > 1e-9 && (a |= 2);
    this.i = a;
  }
  get j() {
    var a = this.h;
    return Math.sqrt(Math.abs(a[0] * a[3] - a[1] * a[2]));
  }
  arc(a, b, c, d, f, e) {
    if ((this.i & 3) !== 0) {
      jm(this, () => this.g.arc(a, b, c, d, f, e));
    } else {
      var g = If(this.h, a, b);
      this.g.arc(g[0], g[1], c * this.j, d, f, e);
    }
  }
  arcTo(a, b, c, d, f) {
    if ((this.i & 3) !== 0) {
      jm(this, () => this.g.arcTo(a, b, c, d, f));
    } else {
      var e = If(this.h, a, b), g = If(this.h, c, d);
      this.g.arcTo(e[0], e[1], g[0], g[1], f * this.j);
    }
  }
  bezierCurveTo(a, b, c, d, f, e) {
    a = If(this.h, a, b);
    c = If(this.h, c, d);
    f = If(this.h, f, e);
    this.g.bezierCurveTo(a[0], a[1], c[0], c[1], f[0], f[1]);
  }
  closePath() {
    this.g.closePath();
  }
  ellipse(a, b, c, d, f, e, g, h) {
    if ((this.i & 1) !== 0) {
      jm(this, () => this.g.ellipse(a, b, c, d, f, e, g, h));
    } else {
      var k = If(this.h, a, b);
      this.g.ellipse(k[0], k[1], c * this.h[0], d * this.h[3], f, e, g, h);
    }
  }
  lineTo(a, b) {
    a = If(this.h, a, b);
    this.g.lineTo(a[0], a[1]);
  }
  moveTo(a, b) {
    a = If(this.h, a, b);
    this.g.moveTo(a[0], a[1]);
  }
  quadraticCurveTo(a, b, c, d) {
    a = If(this.h, a, b);
    c = If(this.h, c, d);
    this.g.quadraticCurveTo(a[0], a[1], c[0], c[1]);
  }
  rect(a, b, c, d) {
    km(this, (f, e, g, h) => this.g.rect(f, e, g, h), a, b, c, d);
  }
  clearRect(a, b, c, d) {
    km(this, (f, e, g, h) => this.g.clearRect(f, e, g, h), a, b, c, d);
  }
  fillRect(a, b, c, d) {
    km(this, (f, e, g, h) => this.g.fillRect(f, e, g, h), a, b, c, d);
  }
  strokeRect(a, b, c, d) {
    km(this, (f, e, g, h) => this.g.strokeRect(f, e, g, h), a, b, c, d);
  }
  resetTransform() {
    this.g.resetTransform();
  }
  rotate(a) {
    this.g.rotate(a);
  }
  scale(a, b) {
    this.g.scale(a, b);
  }
  setTransform(a, b, c, d, f, e) {
    this.g.setTransform(a, b, c, d, f, e);
  }
  transform(a, b, c, d, f, e) {
    this.g.transform(a, b, c, d, f, e);
  }
  translate(a, b) {
    this.g.translate(a, b);
  }
  beginPath() {
    this.g.beginPath();
  }
  clip(a, b) {
    this.g.clip(a, b);
  }
  fill(a, b) {
    this.g.fill(a, b);
  }
  stroke() {
    this.g.stroke();
  }
  reset() {
    this.g.reset();
  }
  restore() {
    this.g.restore();
  }
  save() {
    this.g.save();
  }
  mc() {
    this.g.mc();
  }
  set fillStyle(a) {
    this.g.fillStyle = a;
  }
  set strokeStyle(a) {
    this.g.strokeStyle = a;
  }
  set lineWidth(a) {
    this.g.lineWidth = a;
  }
  set lineCap(a) {
    this.g.lineCap = a;
  }
  set lineJoin(a) {
    this.g.lineJoin = a;
  }
  set lineDashOffset(a) {
    this.g.lineDashOffset = a;
  }
  set miterLimit(a) {
    this.g.miterLimit = a;
  }
  set globalAlpha(a) {
    this.g.globalAlpha = a;
  }
  set globalCompositeOperation(a) {
    this.g.globalCompositeOperation = a;
  }
  setLineDash(a) {
    this.g.setLineDash(a);
  }
  set font(a) {
    this.g.font = a;
  }
  fillText(a, b, c, d) {
    b = If(this.h, b, c);
    this.g.fillText(a, b[0], b[1], d === void 0 ? void 0 : d * this.h[0]);
  }
  strokeText(a, b, c, d) {
    b = If(this.h, b, c);
    this.g.strokeText(a, b[0], b[1], d === void 0 ? void 0 : d * this.h[0]);
  }
}
;function mm(a) {
  const b = nm(a);
  if (a.H === 4 || !(b.w < 2 || b.ma < 2)) {
    var c = a.H, d = a.o, f = a.C, e = a.g, g = a.h, h = Jf(Lf(a.D.C, a.V)), k = Mf(a.D.C), l = k.enabled && c !== 4;
    wf(a.D.g.F(a.V), m => {
      const p = new lm(m, h);
      l && (m.fillStyle = k.color);
      switch(c) {
        case 2:
          p.fillRect(b.x, b.y, b.w, b.ma);
          p.strokeRect(b.x, b.y, b.w, b.ma);
          break;
        case 3:
          p.beginPath();
          p.ellipse(b.x + b.w * 0.5, b.y + b.ma * 0.5, b.w * 0.5, b.ma * 0.5, 0, 0, 2 * Math.PI, !1);
          p.fill();
          p.stroke();
          break;
        case 4:
          p.beginPath(), p.moveTo(d, f), p.lineTo(e, g), p.stroke();
      }
    });
    a.D.refresh();
  }
}
function nm(a) {
  return {x:Math.min(a.o, a.g), y:Math.min(a.C, a.h), w:Math.abs(a.g - a.o), ma:Math.abs(a.h - a.C)};
}
class om extends im {
  constructor(a, b, c) {
    super(a, b);
    this.D = c;
    this.j = !1;
    this.h = this.g = this.C = this.o = this.V = this.H = 0;
  }
  R() {
    super.R();
    this.j = !1;
  }
  Rb(a) {
    Sd(a, 0);
    if ((Sd(a, 0) | 0) !== 0 || (a.buttons() & 1) === 0) {
      return !1;
    }
    const b = id(this.ba, this.O, 3);
    if (b !== 2 && b !== 3 && b !== 4) {
      return !1;
    }
    const c = id(this.ba, this.O, 19);
    if (!c) {
      return !1;
    }
    this.H = b;
    this.V = c;
    this.o = this.g = a.x();
    this.C = this.h = a.y();
    return this.j = !0;
  }
  Sb(a) {
    switch(Sd(a, 0) | 0) {
      case 2:
        this.g = a.x();
        this.h = a.y();
        break;
      case 1:
        return mm(this), this.j = !1;
      case 5:
        return this.j = !1;
    }
    return !0;
  }
  Tb(a) {
    if (this.j) {
      var b = nm(this);
      a.strokeStyle = "#808080";
      a.lineWidth = 1;
      switch(this.H) {
        case 2:
          a.strokeRect(b.x, b.y, b.w, b.ma);
          break;
        case 3:
          a.beginPath();
          a.ellipse(b.x + b.w * 0.5, b.y + b.ma * 0.5, b.w * 0.5, b.ma * 0.5, 0, 0, 2 * Math.PI, !1);
          a.stroke();
          break;
        case 4:
          a.beginPath(), a.moveTo(this.o, this.C), a.lineTo(this.g, this.h), a.stroke();
      }
    }
  }
}
;function pm(a) {
  a = a.Ra("toolbar_class");
  const b = a.L;
  b.fillStyle = n(255, 255, 255);
  b.fillRect(0, 0, 60, 400);
  return a.end();
}
function qm(a) {
  a = a.Ra();
  var b = a.L, c = a.M;
  const d = a.Ab;
  var f = c.g(1, 65);
  c = c.g(2, 5);
  a.segment(1);
  b.translate(f, c);
  a.qb();
  b.beginPath();
  b.rect(0, 0, 900, 800);
  b.fillStyle = n(240, 240, 240);
  b.strokeStyle = n(80, 80, 80);
  b.stroke();
  b.fill();
  b.clip();
  a.segment(2);
  a.pb();
  b = d.Sc(2);
  d.Y(3, b, 100);
  b = d.Sc(0);
  f = d.Sc(1);
  c = d.rc(0);
  const e = d.rc(1), g = d.rc(2), h = d.rc(3);
  d.Y(3, b, c);
  d.tc();
  d.X();
  d.Y(3, f, e);
  d.tc();
  d.X();
  d.Y(5, b, g);
  d.tc();
  d.X();
  d.Y(5, f, h);
  d.tc();
  d.X();
  d.X();
  return a.end();
}
function rm(a, b) {
  a = a.Ra();
  const c = a.L, d = a.M, f = a.xa, e = a.self, g = d.g(2, 0), h = b.Md(2, 3);
  var k = d.g(29, 0);
  const l = d.g(18, 0);
  f.Y(5, k, 0.5);
  c.fillStyle = n(210, 215, 225);
  f.sa();
  c.fillStyle = n(230, 232, 236);
  f.X();
  c.fillRect(4, d.add(g, 4), 52, 30);
  k = d.ea();
  d.D(k, 1, h, l);
  f.h(k);
  c.strokeStyle = n(40, 120, 255);
  c.lineWidth = 2;
  f.sa();
  c.strokeStyle = n(190, 190, 195);
  c.lineWidth = 1;
  f.X();
  c.strokeRect(4, d.add(g, 2), 52, 36);
  c.fillStyle = n(50, 50, 60);
  c.font = "14px monospace";
  f.Y(1, l, 1);
  c.fillText("S", 24, d.add(g, 25));
  f.Sa(1, l, 2);
  c.fillText("R", 24, d.add(g, 25));
  f.Sa(1, l, 3);
  c.fillText("E", 24, d.add(g, 25));
  f.Sa(1, l, 4);
  c.fillText("L", 24, d.add(g, 25));
  f.X();
  e.na(32, b.ref);
  e.da(1).P(0, 24);
  e.da(3).P(0, 3).P(2, 18).P(32, b.ref);
  e.da(4);
  return a.end();
}
function sm(a, b) {
  a = a.Ra();
  const c = a.L;
  var d = a.M;
  const f = a.xa, e = a.self, g = b.get(15), h = b.get(20);
  c.fillStyle = g;
  d = d.g(2, 175);
  c.fillRect(5, d, 50, 25);
  f.Y(5, h, 0.5);
  c.strokeStyle = n(40, 120, 255);
  c.lineWidth = 2;
  f.sa();
  c.strokeStyle = n(170, 170, 175);
  c.lineWidth = 1;
  f.X();
  c.strokeRect(5, d, 50, 25);
  e.na(32, b.ref);
  e.da(1).P(0, 24);
  e.da(3).P(0, 29).P(1, 0).P(32, b.ref);
  return a.end();
}
function tm(a, b) {
  a = a.Ra();
  const c = a.L;
  var d = a.M;
  const f = a.self, e = d.g(1, 5), g = d.g(2, 0);
  d = d.g(19, n(0, 200, 0));
  c.fillStyle = d;
  c.fillRect(e, g, 22, 22);
  c.strokeStyle = n(180, 180, 185);
  c.strokeRect(e, g, 22, 22);
  f.da(1).P(0, 24);
  f.da(6).P(0, 19).P(1, 15).P(32, b.ref);
  return a.end();
}
function um(a, b, c, d, f) {
  a = a.Ra();
  const e = a.L, g = a.M, h = a.xa, k = a.self, l = g.g(2, 0), m = f ? f(b) : 0, p = g.g(29, 0);
  h.Y(5, p, 0.5);
  e.fillStyle = n(210, 215, 225);
  h.sa();
  e.fillStyle = n(230, 232, 236);
  h.X();
  e.fillRect(4, g.add(l, 4), 52, 30);
  f ? (h.Y(5, m, 0.5), e.strokeStyle = n(40, 120, 255), e.lineWidth = 2, h.sa(), e.strokeStyle = n(190, 190, 195), e.lineWidth = 1, h.X()) : (e.strokeStyle = n(190, 190, 195), e.lineWidth = 1);
  e.strokeRect(4, g.add(l, 2), 52, 36);
  e.fillStyle = n(50, 50, 60);
  e.font = "12px monospace";
  e.fillText(c, 14, g.add(l, 25));
  k.na(32, b.ref);
  k.da(1).P(0, 24);
  k.da(3).P(0, d).P(1, 0).P(32, b.ref);
  k.da(4);
  return a.end();
}
function vm(a, b) {
  a = a.Ra();
  const c = a.L, d = a.M, f = a.xa, e = a.self, g = d.g(2, 0), h = b.Md(2, 4), k = d.g(29, 0);
  f.Y(5, k, 0.5);
  c.fillStyle = n(210, 215, 225);
  f.sa();
  c.fillStyle = n(230, 232, 236);
  f.X();
  c.fillRect(4, d.add(g, 4), 52, 30);
  f.Y(1, h, 1);
  c.strokeStyle = n(40, 120, 255);
  c.lineWidth = 2;
  f.sa();
  c.strokeStyle = n(190, 190, 195);
  c.lineWidth = 1;
  f.X();
  c.strokeRect(4, d.add(g, 2), 52, 36);
  c.fillStyle = n(50, 50, 60);
  c.font = "12px monospace";
  f.Y(1, h, 1);
  c.fillText("RH8", 14, d.add(g, 25));
  f.Sa(1, h, 2);
  c.fillText("FOC", 14, d.add(g, 25));
  f.sa();
  c.fillText("OUT", 14, d.add(g, 25));
  f.X();
  e.na(32, b.ref);
  e.da(1).P(0, 24);
  e.da(3).P(0, 9).P(1, 0).P(32, b.ref);
  e.da(4);
  return a.end();
}
function wm(a) {
  a = a.Uc(9, 4, "c6631139-ac01-4e46-beb0-143890200001", "fn_viewbox_fit_js");
  const b = a.L, c = a.M, d = a.xa, f = a.Ld, e = f[4], g = f[5], h = f[6], k = f[7], l = f[8], m = c.C(c.j(h, e)), p = c.C(c.j(k, g)), t = c.ea(1.0), q = c.ea(1.0), u = c.ea(0.0), r = c.ea(0.0);
  c.set(u, 0.0);
  c.set(r, 0.0);
  d.Y(1, l, 2);
  c.set(t, m);
  c.set(q, p);
  d.Sa(1, l, 0);
  d.Y(3, m, p);
  c.set(t, m);
  c.set(q, m);
  c.set(r, c.i(c.sub(k, c.i(g, m)), 0.5));
  d.sa();
  c.set(t, p);
  c.set(q, p);
  c.set(u, c.i(c.sub(h, c.i(e, p)), 0.5));
  d.X();
  d.Sa(1, l, 1);
  d.Y(5, m, p);
  c.set(t, m);
  c.set(q, m);
  c.set(r, c.i(c.sub(k, c.i(g, m)), 0.5));
  d.sa();
  c.set(t, p);
  c.set(q, p);
  c.set(u, c.i(c.sub(h, c.i(e, p)), 0.5));
  d.X();
  d.sa();
  c.o("erro fit mode", l);
  d.X();
  d.Y(3, t, 0.001);
  c.o("guard fsx", t);
  c.set(t, 0.001);
  d.X();
  d.Y(3, q, 0.001);
  c.o("guard fsy", q);
  c.set(q, 0.001);
  d.X();
  d.Y(1, l, 1);
  b.beginPath();
  b.rect(0, 0, h, k);
  b.clip();
  d.X();
  b.translate(u, r);
  b.scale(t, q);
  c.set(f[0], c.j(c.sub(0, u), t));
  c.set(f[1], c.j(c.sub(0, r), q));
  c.set(f[2], c.j(h, t));
  c.set(f[3], c.j(k, q));
  return a.end();
}
function xm(a, b) {
  a = a.Ma("c6631139-ac01-4e46-beb0-143890100001");
  a.name("image-container");
  const c = a.L;
  var d = a.M;
  const f = d.g(1, 0), e = d.g(2, 0), g = d.g(3, 100), h = d.g(4, 100), k = d.g(10, 100), l = d.g(11, 100), m = d.g(12, 0), p = d.ea(0, "hx"), t = d.ea(0, "hy"), q = d.ea(0, "hw");
  d = d.ea(0, "hh");
  a.segment(1);
  c.save();
  c.translate(f, e);
  a.Za(b, [p, t, q, d, k, l, g, h, m]);
  a.segment(0);
  c.rect(p, t, q, d);
  a.Pb();
  a.segment(2);
  c.restore();
  b = a.self;
  b.da(13);
  b.da(2).P(3, 1);
  b.da(1).P(0, 8);
  a.end();
}
function ym(a) {
  a = a.Ma("c6631139-ac01-4e46-beb0-143890400001");
  a.name("editor-selection");
  const b = a.L;
  var c = a.M;
  const d = c.g(1, 0), f = c.g(2, 0), e = c.g(3, 0), g = c.g(4, 0);
  c = c.g(23, 0);
  a.fb(0);
  b.save();
  b.beginPath();
  b.rect(d, f, e, g);
  b.setLineDash([4, 3]);
  b.lineDashOffset = c;
  b.strokeStyle = n(128, 128, 128);
  b.lineWidth = 1;
  b.stroke();
  b.restore();
  a.end();
}
;function zm(a) {
  const b = Le();
  var c = new Qd();
  const d = c.Ma(b);
  d.name("RECS");
  const f = d.M.ea(40, "px"), e = d.M.ea(40, "py"), g = d.M.ea(1.0, "pw"), h = d.M.ea(1.0, "ph");
  d.segment(1);
  d.L.save();
  d.L.translate(f, e);
  d.segment(0);
  d.L.fillStyle = "#e33";
  const k = d.M.i(g, 60), l = d.M.i(h, 40);
  d.L.fillRect(0, 0, k, l);
  d.L.fillStyle = "#36c";
  d.L.fillRect(30, 20, k, l);
  d.nb("5e6311f4-9603-4589-8cb2-1491905b315a", 1, 0, 0, k, l);
  d.self.da(1).P(0, 8);
  d.self.da(13).P(0, f).P(1, e).P(2, g).P(3, h);
  d.self.da(2).P(0, f).P(1, e);
  d.segment(2);
  d.L.restore();
  d.end();
  Xe(a.g, b, c);
  c = Bf(a.h, b, Yd(a.h));
  a.o(c, (m, p) => {
    console.log("[dev_gralm_cmds] seedMoveElement uuid:", b, "\u2192 ptr", p, "status", m);
  });
}
function Am(a) {
  const b = Le();
  var c = new Qd();
  const d = c.Ma(b);
  d.name("MANDALA");
  const f = d.M.ea(50, "px"), e = d.M.ea(100, "py");
  d.segment(1);
  d.L.save();
  d.L.translate(f, e);
  d.segment(0);
  const g = Math.PI / 180;
  d.L.fillStyle = "#efe6d8";
  d.L.strokeStyle = "#6b4a86";
  d.L.lineWidth = 1;
  var h = [];
  for (var k = 0; k < 12; k++) {
    h.push(k * 30);
  }
  d.Za("da6311ab-4a02-4be5-84b2-142b905bd85a", h.concat([200, 400, 110, 30]));
  h = 75 * g;
  d.nb("5e6311f4-9603-4589-8cb2-1491905b315a", 1, 200 + 77 * Math.cos(h) - 16.5, 400 + 77 * Math.sin(h) - 16.5, 33, 33);
  for (h = 0; h < 12; h++) {
    k = (180 - (h * 30 + 15)) * g, d.nb("7c63110e-f903-4888-99b2-1462905b135a", 100 + h, 200 + 125 * Math.cos(k) - 11, 400 + 125 * Math.sin(k) - 11, 22, 22);
  }
  d.self.da(1).P(0, 8);
  d.self.da(2).P(0, f).P(1, e);
  d.segment(2);
  d.L.restore();
  d.end();
  Xe(a.g, b, c);
  c = Bf(a.h, b, Yd(a.h));
  a.o(c, (l, m) => {
    console.log("[dev_gralm_cmds] seedMandala uuid:", b, "\u2192 ptr", m, "status", l);
  });
}
function Bm(a, b) {
  return Vd(a, b, {Fb:(c, d) => {
    console.log("hook js set_data", c, d);
  }});
}
;Yb.set(1, async(a, b) => {
  a.V || await new Promise(p => {
    const t = () => a.V ? p() : setTimeout(t, 1);
    t();
  });
  const c = a.I[b], d = new $f(a, b);
  if (b = document.getElementById("dpanel")) {
    var f = document.createElement("div");
    f.style.pointerEvents = "auto";
    b.appendChild(f);
    var e = new Ag();
    gm(e, d);
    wg(e);
    var g = !1, h = !1;
    await Xb(e, f).then(() => {
      g = !0;
      h && e.refresh();
    });
    b = c[5];
    var k = new om(a, b, d);
    hm(k);
    var l = Bm(a, b), m = () => {
      g ? e.refresh() : h = !0;
    };
    c[1] = () => {
      d.ba = !0;
      m();
    };
    c[2] = () => {
      e.ba = !0;
      d.Aa && (d.Aa.unregister(), d.Aa = null);
      d.Ba = null;
      k.R();
      l.unregister();
      f.remove();
    };
    d.Ba = m;
    zm(d);
    Am(d);
  } else {
    console.error("factory: #dpanel nao encontrado");
  }
});
Dc["c6631139-ac01-4e46-beb0-1438905b315a"] = function(a) {
  var b = a.state.h(), c = pm(a), d = qm(a), f = rm(a, b), e = sm(a, b);
  const g = tm(a, b), h = vm(a, b), k = um(a, b, "DBG", 10, null), l = um(a, b, "OPN", 11, null), m = um(a, b, "JSX", 7, w => w.get(26));
  var p = wm(a);
  xm(a, p);
  p = a.Ma("c6631139-ac01-4e46-beb0-143890300001");
  p.name("editor-board");
  p = p.end();
  ym(a);
  a = a.Ma("c6631139-ac01-4e46-beb0-1438905b315a");
  a.name("editor-app");
  const t = a.self, q = a.M, u = a.xa;
  b.create();
  b.Ac(3, t);
  a.fb(0);
  const r = q.ea(0);
  u.Y(1, r, 0);
  q.set(r, 1);
  b.set(15, n(255, 255, 255));
  b.set(16, n(0, 0, 0));
  b.set(28, 1);
  b.set(25, 0);
  u.X();
  c = c.Pa(t);
  d = d.Pa(t);
  d = p.Pa(d).P(1, 1);
  b.Ac(0, d);
  b.Ac(2, d);
  b = 10;
  d = [1, 2, 3, 4];
  for (p = 0; p < d.length; p++) {
    f.Pa(c).na(2, b).na(18, d[p]), b += 45;
  }
  b += 5;
  e.Pa(c).na(2, b);
  b += 30;
  f = [n(30, 30, 30), n(255, 60, 60), n(60, 180, 60), n(60, 100, 255), n(255, 200, 40), n(255, 130, 40), n(160, 60, 220), n(255, 255, 255)];
  for (e = 0; e < f.length; e++) {
    d = e % 2 === 0 ? 5 : 33, g.Pa(c).na(1, d).na(2, b).na(19, f[e]), e % 2 === 1 && (b += 27);
  }
  b += 10;
  h.Pa(c).na(2, b).na(18, 1);
  b += 40;
  l.Pa(c).na(2, b);
  b += 40;
  m.Pa(c).na(2, b).na(18, 1);
  b += 55;
  k.Pa(c).na(2, b);
  a.end();
};
document.addEventListener("DOMContentLoaded", async function() {
  const a = document.createElement("div");
  a.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f0f0f0;z-index:9999;cursor:wait;font-family:system-ui,sans-serif;color:#444";
  a.innerHTML = '<div style="font-size:clamp(28px,5vw,48px);font-weight:600">Ploft</div><div style="font-size:clamp(14px,2.5vw,20px);margin-top:12px;color:#888">Loading\u2026</div>';
  document.body.appendChild(a);
  let b = new Nc();
  await Ic(b);
  var c = h => {
    const k = document.createElement("canvas");
    k.style.position = "fixed";
    k.style.top = "0";
    k.style.left = "0";
    k.style.height = "100vh";
    k.style.width = "100vw";
    k.style.zIndex = h;
    document.getElementById("dmain")?.appendChild(k);
    return k;
  };
  const d = c("1"), f = c("2");
  f.style.pointerEvents = "none";
  c = c("3");
  c.style.pointerEvents = "none";
  ud(b, d, c, f);
  a.remove();
  const e = b.D(), g = b.D();
  qi[1] = (h, k, l) => {
    fetch(k.url).then(m => m.text()).then(m => {
      l.I[e] = [m, k.w || 0, k.ma || 0];
      l.Ga(l.ff, 6, e, g);
      l.Da(7, 0, h.x, h.y, 1, performance.now());
    });
  };
  d.addEventListener("dragover", h => {
    const k = pi;
    k && qi[k.kind] && (b.Da(8, 0, h.offsetX - k.g, h.offsetY - k.h, k.kind, h.timeStamp) ? (h.preventDefault(), h.dataTransfer.dropEffect = "copy") : h.dataTransfer.dropEffect = "none");
  });
  d.addEventListener("drop", h => {
    const k = pi, l = k ? qi[k.kind] || null : null;
    k && l && (h.preventDefault(), l({x:h.offsetX - k.g, y:h.offsetY - k.h}, k.data, b));
  });
});
}).call(this);
