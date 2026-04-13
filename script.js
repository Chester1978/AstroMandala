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
;const n = new Map(), da = n.delete.bind(n), ea = new BroadcastChannel("ib");
ea.onmessage = a => {
  a = a.data;
  a.m === 1 && (n.get(a.n)?.close(), da(a.n));
};
n.delete = a => {
  ea.postMessage({m:1, n:a});
  return da(a);
};
async function q(a, b) {
  var c = n.get(a);
  if (c && !b) {
    return c;
  }
  let d;
  b && (c = await q(a), d = c.version + 1, c.close());
  return new Promise((f, e) => {
    let g = !1, h = !1;
    setTimeout(() => {
      g || e(Error(`indexedDB timeout: bloqueado: ${h ? "essa aba" : "outra"} (${a})`));
    }, 100);
    const k = indexedDB.open(a, d);
    k.onsuccess = p => {
      g = !0;
      p = p.target.result;
      n.set(a, p);
      f(p);
    };
    k.onerror = p => {
      g = !0;
      e(p.target.error);
    };
    k.onupgradeneeded = p => {
      g = !0;
      p = p.target.result;
      b && b(p);
    };
    k.onblocked = () => {
      h = !0;
    };
  });
}
async function fa(a, b) {
  let c = await q(a);
  c.objectStoreNames.contains(b) || (c.close(), c = await q(a, d => {
    d.createObjectStore(b);
  }));
  return c;
}
async function ha(a, b) {
  let c = await q(a);
  c.objectStoreNames.contains(b) && (c.close(), c = await q(a, d => {
    d.deleteObjectStore(b);
    console.log("apagado");
  }));
  return c;
}
async function t(a, b, c, ...d) {
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
class ia {
  constructor(a) {
    const [b, c] = a.split(".");
    this.g = b;
    this.h = c;
  }
  get i() {
    return n.get(this.g);
  }
  async init() {
    return await fa(this.g, this.h);
  }
  async get(a) {
    return await t(this, "readonly", "get", a);
  }
  async set(a, b) {
    await t(this, "readwrite", "put", b, a);
  }
  async j(a) {
    await t(this, "readwrite", "delete", a);
  }
  async l() {
    await t(this, "readwrite", "clear");
  }
  async o() {
    return await t(this, "readwrite", "getAllKeys");
  }
  async A() {
    await ha(this.g, this.h);
  }
  async v() {
    this.i.close();
    n.delete(this.g);
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
function ja(a) {
  a = new ia(a);
  const b = [];
  b[0] = a.init.bind(a);
  b[1] = a.get.bind(a);
  b[2] = a.set.bind(a);
  b[3] = a.j.bind(a);
  b[4] = a.l.bind(a);
  b[5] = a.o.bind(a);
  b[6] = a.A.bind(a);
  b[7] = a.v.bind(a);
  return b;
}
;async function ka(a = null) {
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
async function la(a) {
  try {
    return await a.queryPermission() === "granted" || await a.requestPermission() === "granted";
  } catch (b) {
    return !1;
  }
}
var ma = {description:"ZIP Files", accept:{"application/zip":[".zip"]}}, na = {description:"WASM Files", accept:{"application/wasm":[".wasm"]}};
function oa(a) {
  if (a <= 20) {
    return 20;
  }
  const b = Math.pow(10, Math.floor(Math.log10(a))), c = Math.ceil(a / b) * b;
  return c > a ? c : c + b;
}
;async function pa(a, b) {
  a = new qa(a, b);
  await ra(a);
  return a;
}
async function ra(a) {
  if (a.handle.kind === "file") {
    a.g = await a.handle.getFile();
    a.size = a.g.size;
    a.mimeType = a.g.type;
    var b = new Date(a.g.lastModified);
    a.modifiedTime = `${(b.getMonth() + 1).toString().padStart(2, "0")}-${b.getDate().toString().padStart(2, "0")}-${b.getFullYear()} ${b.getHours().toString().padStart(2, "0")}:${b.getMinutes().toString().padStart(2, "0")}:${b.getSeconds().toString().padStart(2, "0")}`;
  }
}
class qa {
  constructor(a, b) {
    this.folder = a;
    this.name = b.name;
    this.handle = b;
    b.kind === "file" ? this.isfile = !0 : b.kind === "directory" && (this.isfile = !1);
  }
}
async function sa(a, b = !0, c = "") {
  let d = [];
  if (!a) {
    return d;
  }
  for await (const e of a.values()) {
    var f = e;
    a = await pa(c, f);
    if (f.kind === "file") {
      a.isfile = !0, d.push(a);
    } else if (f.kind === "directory") {
      a.isfile = !1;
      f = await sa(f, b, c ? `${c}/${f.name}` : f.name);
      if (b) {
        for (let g of f) {
          d.push(g);
        }
      } else {
        a.h = f;
      }
      d.push(a);
    }
  }
  return d;
}
async function ta(a, b, c = !1) {
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
;async function ua(a) {
  let b;
  if (a.La) {
    b = a.La;
  } else if (a.Ha) {
    b = new ia(a.Ha), await b.init();
  } else {
    if (a.throw) {
      throw Error("no storage passed");
    }
    return {persisted:!1, handle:null};
  }
  a.reload && await b.j(a.key);
  var c = await b.get(a.key);
  let d = await la(c);
  if ((c = d ? c : await ka(c || a.key)) && await la(c)) {
    await b.set(a.key, c);
  } else {
    if (a.throw) {
      throw Error("dir handle not  aquired");
    }
    return {persisted:!1, handle:null};
  }
  return {persisted:d, handle:c};
}
async function va(a, b, c) {
  if (a.h && (c = await ta(a.h, c), c = await sa(c, !0), c.length)) {
    var d = r => r < 6 ? !0 : r === 10 || r === 16, f = r => d(r) ? a.g.view.getInt32(b + r * 4, !0) : a.g.view.getFloat64(b + r * 4, !0), e = (r, w) => {
      d(r) ? a.g.view.setInt32(b + r * 4, w, !0) : a.g.view.setFloat64(b + r * 4, w, !0);
    }, g = f(0), h = {D:f(2), cap:400}, k = {D:f(3), cap:400}, p = {D:f(4), cap:400}, l = {D:f(10), cap:f(12)}, m = f(16), u = async(r, w) => {
      r === 1 ? (r = await w.g.text(), r = a.g.A(r, l), e(10, l.D), e(12, l.cap), e(14, r)) : r === 2 ? w.handle instanceof FileSystemFileHandle && (r = await w.handle.createWritable(), w = (w = f(14)) ? a.g.i(m, m + w) : "", await r.write(w), await r.close()) : r == 3 ? (r = await w.g.arrayBuffer(), w = f(18), r.byteLength > w && (m && a.g.C(m), w = r.byteLength, m = a.g.o(w), e(16, m), e(18, w)), e(20, r.byteLength), a.g.h.set(new Uint8Array(r), m)) : r === 4 && w.handle instanceof FileSystemFileHandle && 
      (r = await w.handle.createWritable(), w = f(20), await r.write(a.g.h.subarray(m, m + w)), await r.close());
    };
    for (let r = 0; r < c.length; r++) {
      const w = c[r];
      a.g.A(w.name, h);
      a.g.A(w.folder, k);
      a.g.A(w.mimeType, p);
      w.isfile ? (e(6, w.size), e(8, w.g.lastModified)) : (e(6, 0), e(8, 0));
      e(1, 0);
      a.g.v(g, 2);
      const z = f(1);
      z && (await u(z, w), a.g.v(g, 2));
    }
  }
}
async function wa(a, b, c, d) {
  a.h && (a = await (await ta(a.h, b, !0))?.getFileHandle(c, {create:!0})) && (a = await a.createWritable(), await a.write(d), await a.close());
}
function xa() {
  console.log("m3");
}
class Ba {
}
var Ca = async(a, b) => {
  const c = new Ba();
  c.g = a;
  var d = Array(6).fill(0).map((g, h) => a.view.getInt32(b + 4 * h, !0)), f = a.i(d[0], d[1]);
  const e = a.i(d[2], d[3]);
  d = await ua({Ha:f, key:e, reload:d[4], throw:!0});
  d.handle && (c.h = d.handle);
  f = a.view.getInt32(b + 20, !0);
  a.view.setInt32(f, c.h ? d.persisted ? 1 : 2 : 3, !0);
  return (g, ...h) => {
    switch(g) {
      case 1:
        return va(c, ...h);
      case 2:
        return wa(c, ...h);
      case 3:
        return xa(...h);
    }
  };
};
function Da(a) {
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
;function x(a, b, c) {
  return d => {
    const f = a[d ?? ""];
    f === void 0 && typeof d === "string" && console.error(`${c} ${d}`);
    return f ?? b;
  };
}
function A(a) {
  const b = Object.fromEntries(Object.entries(a).map(([c, d]) => [d, c]));
  return c => b[c];
}
var Ea = A({arc:1, arcTo:2, bezierCurveTo:3, closePath:4, ellipse:5, lineTo:6, moveTo:7, quadraticCurveTo:8, rect:9, roundRect:10, addPath:11, clearRect:12, fillRect:13, strokeRect:14, getTransform:15, resetTransform:16, rotate:17, scale:18, setTransform:19, transform:20, translate:21, beginPath:22, clip:23, fill:24, isPointInPath:25, isPointInStroke:26, stroke:27, lineCap:28, lineDashOffset:29, lineJoin:30, lineWidth:31, miterLimit:32, getLineDash:33, setLineDash:34, drawImage:35, createImageData:36, 
getImageData:37, putImageData:38, isContextLost:39, reset:40, restore:41, save:42, fillStyle:43, strokeStyle:44, createConicGradient:45, createLinearGradient:46, createPattern:47, createRadialGradient:48, filter:49, globalAlpha:50, globalCompositeOperation:51, imageSmoothingEnabled:52, imageSmoothingQuality:53, getContextAttributes:54, shadowBlur:55, shadowColor:56, shadowOffsetX:57, shadowOffsetY:58, fillText:59, measureText:60, strokeText:61, direction:62, font:63, fontKerning:64, fontStretch:65, 
fontVariantCaps:66, letterSpacing:67, textAlign:68, textBaseline:69, textRendering:70, wordSpacing:71, drawFocusIfNeeded:72, Da:80, clip_path:81, Ua:82, ab:83, Ta:84, $a:85, Oa:100, Ra:101, Ma:102, Na:103, Qa:104, Pa:105});
const Fa = {copy:1, "source-over":2, "source-in":3, "source-out":4, "source-atop":5, "destination-over":7, "destination-in":8, "destination-out":9, "destination-atop":10, xor:11, lighter:12, multiply:14, screen:15, overlay:16, darken:17, lighten:18, "color-dodge":19, "color-burn":20, "hard-light":21, "soft-light":22, difference:23, exclusion:24, hue:25, saturation:26, color:27, luminosity:28};
var Ga = x(Fa, Fa["source-over"], "eglobalCompositeOperation"), Ha = A(Fa);
const Ia = {butt:0, round:1, square:2};
var Ja = x(Ia, Ia.butt, "eLineCap"), Ka = A(Ia);
const La = {miter:0, bevel:1, round:2};
var Ma = x(La, La.miter, "eLineJoin"), Na = A(La);
A({repeat:0, "repeat-x":1, "repeat-y":2, "no-repeat":3});
const Oa = {nonzero:0, evenodd:1};
var Pa = x(Oa, Oa.nonzero, "eFillRule"), Qa = A(Oa);
const Ra = {[1]:{m:3, P:1, W:2}, [2]:{m:5}, [3]:{m:6}, [4]:{}, [5]:{m:4, P:1, W:3}, [6]:{m:2}, [7]:{m:2}, [8]:{m:4}, [9]:{m:4}, [10]:{m:4, ga:3}, [11]:{ref:1, ga:3}, [12]:{m:4}, [13]:{m:4}, [14]:{m:4}, [16]:{}, [17]:{W:1}, [18]:{W:2}, [19]:{m:6}, [20]:{m:6}, [21]:{m:2}, [22]:{}, [23]:{P:1}, [24]:{P:1}, [27]:{}, [28]:{P:2}, [29]:{oa:1}, [30]:{P:2}, [31]:{W:1}, [32]:{W:1}, [34]:{ua:8}, [38]:{m:2, ga:3, ref:1}, [40]:{}, [41]:{}, [42]:{}, [43]:{oa:4}, [44]:{oa:4}, [50]:{oa:1}, [51]:{P:5}, [55]:{W:1}, 
[56]:{oa:4}, [57]:{W:1}, [58]:{W:1}, [59]:{}, [61]:{}, [62]:{}, [63]:{}, [64]:{}, [65]:{}, [66]:{}, [67]:{}, [68]:{}, [69]:{}, [70]:{}, [71]:{}, [80]:{}, [81]:{P:1, ref:1}, [82]:{P:1, ref:1}, [83]:{ref:1}, [100]:{size:1}, [101]:{ref:1, size:1}, [102]:{}, [103]:{}};
function Sa() {
  return Da(a => `import  * as _ from '${"https://cdn.jsdelivr.net/npm/canvg@4.0.3/+esm"}'; window['${a}'](_.Canvg);`);
}
function B(a) {
  const b = a.getContext("2d");
  b.Da = () => {
    b.fillRect(0, 0, b.canvas.width, b.canvas.height);
  };
  return b;
}
async function Ta(a) {
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
function Ua(a) {
  if (a instanceof OffscreenCanvas || a instanceof HTMLCanvasElement) {
    return a = a.getContext("2d").getImageData(0, 0, a.width, a.height), {width:a.width, height:a.height, data:a.data};
  }
  if (a instanceof ImageBitmap) {
    var b = new OffscreenCanvas(a.width, a.height);
    b.getContext("2d").drawImage(a, 0, 0);
    return Ua(b);
  }
  let c;
  a instanceof HTMLImageElement ? (b = a.naturalWidth, c = a.naturalHeight) : a instanceof HTMLVideoElement ? (b = a.videoWidth, c = a.videoHeight) : (b = a.width, c = a.height);
  b = new OffscreenCanvas(b, c);
  b.getContext("2d").drawImage(a, 0, 0);
  return Ua(b);
}
function Va(a) {
  a = [...a.trim().replace(/^#/, "")].map(b => parseInt(b, 16));
  return [a[0] * 16 + a[1], a[2] * 16 + a[3], a[4] * 16 + a[5], 255];
}
function C(a) {
  if (a.indexOf("#") > -1) {
    a = Va(a);
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
function Wa(a) {
  return `rgba(${a >> 24 & 255}, ${a >> 16 & 255}, ${a >> 8 & 255}, ${((a & 255) / 255).toFixed(3)})`;
}
function Xa(a) {
  return ((a[0] ?? 0) & 255) << 24 | ((a[1] ?? 0) & 255) << 16 | ((a[2] ?? 0) & 255) << 8 | (a[0] ?? 1) & 255;
}
;function D(a, b, c) {
  a.h.view.setFloat64(a.D + b * 8, c, !0);
  b >= a.i && (a.i = b + 1);
}
function E(a, b) {
  a.h.ea(b, a.D, a.j);
  a.i = 0;
}
function Ya(a) {
  a.h.C(a.D);
  a.D = 0;
  a.g.D && (a.h.C(a.g.D), a.g.D = 0);
}
class Za {
  constructor(a, b, c, d) {
    this.h = a;
    this.j = b;
    this.D = a.o(72);
    this.canvas = {width:c, height:d};
    this.g = {D:a.o(256), cap:256};
    this.i = 0;
  }
  arc(a, b, c, d, f, e) {
    D(this, 0, a);
    D(this, 1, b);
    D(this, 2, c);
    D(this, 3, d);
    D(this, 4, f);
    D(this, 5, e ? 1 : 0);
    E(this, 1);
  }
  arcTo(a, b, c, d, f) {
    D(this, 0, a);
    D(this, 1, b);
    D(this, 2, c);
    D(this, 3, d);
    D(this, 4, f);
    E(this, 2);
  }
  bezierCurveTo(a, b, c, d, f, e) {
    D(this, 0, a);
    D(this, 1, b);
    D(this, 2, c);
    D(this, 3, d);
    D(this, 4, f);
    D(this, 5, e);
    E(this, 3);
  }
  closePath() {
    E(this, 4);
  }
  ellipse(a, b, c, d, f, e, g, h) {
    D(this, 0, a);
    D(this, 1, b);
    D(this, 2, c);
    D(this, 3, d);
    D(this, 4, f);
    D(this, 5, e);
    D(this, 6, g);
    D(this, 7, h ? 1 : 0);
    E(this, 5);
  }
  lineTo(a, b) {
    D(this, 0, a);
    D(this, 1, b);
    E(this, 6);
  }
  moveTo(a, b) {
    D(this, 0, a);
    D(this, 1, b);
    E(this, 7);
  }
  quadraticCurveTo(a, b, c, d) {
    D(this, 0, a);
    D(this, 1, b);
    D(this, 2, c);
    D(this, 3, d);
    E(this, 8);
  }
  rect(a, b, c, d) {
    D(this, 0, a);
    D(this, 1, b);
    D(this, 2, c);
    D(this, 3, d);
    E(this, 9);
  }
  clearRect(a, b, c, d) {
    D(this, 0, a);
    D(this, 1, b);
    D(this, 2, c);
    D(this, 3, d);
    E(this, 12);
  }
  fillRect(a, b, c, d) {
    D(this, 0, a);
    D(this, 1, b);
    D(this, 2, c);
    D(this, 3, d);
    E(this, 13);
  }
  strokeRect(a, b, c, d) {
    D(this, 0, a);
    D(this, 1, b);
    D(this, 2, c);
    D(this, 3, d);
    E(this, 14);
  }
  resetTransform() {
    E(this, 16);
  }
  rotate(a) {
    D(this, 0, a);
    E(this, 17);
  }
  scale(a, b) {
    D(this, 0, a);
    D(this, 1, b);
    E(this, 18);
  }
  setTransform(a, b, c, d, f, e) {
    typeof a !== "number" && (b = a.b, c = a.c, d = a.d, f = a.e, e = a.f, a = a.a);
    D(this, 0, a ?? 0);
    D(this, 1, b ?? 0);
    D(this, 2, c ?? 0);
    D(this, 3, d ?? 0);
    D(this, 4, f ?? 0);
    D(this, 5, e ?? 0);
    E(this, 19);
  }
  transform(a, b, c, d, f, e) {
    D(this, 0, a);
    D(this, 1, b);
    D(this, 2, c);
    D(this, 3, d);
    D(this, 4, f);
    D(this, 5, e);
    E(this, 20);
  }
  translate(a, b) {
    D(this, 0, a);
    D(this, 1, b);
    E(this, 21);
  }
  beginPath() {
    E(this, 22);
  }
  clip(a, b) {
    typeof a === "string" && (b = a);
    D(this, 0, b === "evenodd" ? 1 : 0);
    E(this, 23);
  }
  fill(a, b) {
    typeof a === "string" && (b = a);
    D(this, 0, b === "evenodd" ? 1 : 0);
    E(this, 24);
  }
  stroke() {
    E(this, 27);
  }
  get lineCap() {
    return "butt";
  }
  set lineCap(a) {
    D(this, 0, Ja(a));
    E(this, 28);
  }
  get lineDashOffset() {
    return 0;
  }
  set lineDashOffset(a) {
    D(this, 0, a);
    E(this, 29);
  }
  get lineJoin() {
    return "miter";
  }
  set lineJoin(a) {
    D(this, 0, Ma(a));
    E(this, 30);
  }
  get lineWidth() {
    return 1;
  }
  set lineWidth(a) {
    D(this, 0, a);
    E(this, 31);
  }
  get miterLimit() {
    return 10;
  }
  set miterLimit(a) {
    D(this, 0, a);
    E(this, 32);
  }
  getLineDash() {
    return [];
  }
  setLineDash(a) {
    const b = a ? a.length : 0;
    if (b) {
      var c = b * 8;
      c > this.g.cap && (this.h.C(this.g.D), this.g.cap = c, this.g.D = this.h.o(c));
      for (c = 0; c < b; c++) {
        this.h.view.setFloat64(this.g.D + c * 8, a[c], !0);
      }
      D(this, 0, this.g.D);
      D(this, 1, b);
    } else {
      D(this, 0, 0), D(this, 1, 0);
    }
    E(this, 34);
  }
  reset() {
    E(this, 40);
  }
  restore() {
    E(this, 41);
  }
  save() {
    E(this, 42);
  }
  get fillStyle() {
    return "#000000";
  }
  set fillStyle(a) {
    typeof a === "string" && (D(this, 0, Xa(C(a))), E(this, 43));
  }
  get strokeStyle() {
    return "#000000";
  }
  set strokeStyle(a) {
    typeof a === "string" && (D(this, 0, Xa(C(a))), E(this, 44));
  }
  get globalAlpha() {
    return 1;
  }
  set globalAlpha(a) {
    D(this, 0, a);
    E(this, 50);
  }
  get globalCompositeOperation() {
    return "source-over";
  }
  set globalCompositeOperation(a) {
    D(this, 0, Ga(a));
    E(this, 51);
  }
  Da() {
    this.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
    a = this.h.A(a, this.g);
    D(this, 0, b);
    D(this, 1, c);
    D(this, 2, d || 0);
    D(this, 3, this.g.D);
    D(this, 4, a);
    E(this, 59);
  }
  strokeText(a, b, c, d) {
    a = this.h.A(a, this.g);
    D(this, 0, b);
    D(this, 1, c);
    D(this, 2, d || 0);
    D(this, 3, this.g.D);
    D(this, 4, a);
    E(this, 61);
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
    a = this.h.A(a, this.g);
    D(this, 0, this.g.D);
    D(this, 1, a);
    E(this, 63);
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
;async function $a(a, b) {
  var c = new Int32Array(a.buffer, b, 7), d = c[5], f = c[6];
  if (d === 0) {
    b = await Sa(), f > 0 && (a.g[f] = b);
  } else {
    b = a.i(c[0], c[1]);
    var e = c[2], g = c[3];
    c = c[4];
    if (d === 1) {
      d = f > 0 ? a.g[f] : null;
      if (!d) {
        throw Error("CanvgMode.SYNC: canvg n\u00e3o carregado (canvg_ix=" + f + ")");
      }
      a = new Za(a, e, g, c);
      try {
        d.fromString(a, b).start({enableRedraw:!0, ignoreAnimation:!0, ignoreMouse:!0});
      } finally {
        Ya(a);
      }
    } else if (d === 2) {
      (f = f > 0 ? a.g[f] : null) || (f = await Sa());
      a = new Za(a, e, g, c);
      try {
        await f.fromString(a, b).render();
      } finally {
        Ya(a);
      }
    }
  }
}
async function ab(a, b) {
  var c = new Int32Array(a.buffer, b, 7);
  b = a.i(c[0], c[1]);
  const d = c[2], f = c[3], e = c[4], g = c[5];
  c = c[6];
  a.g[e] = new OffscreenCanvas(d, f);
  try {
    if (g === 0) {
      const k = await Ta(b);
      a.g[e] = k;
    } else if (g === 1) {
      const k = c > 0 ? a.g[c] : null;
      if (!k) {
        throw Error("SvgImageMode.SYNC_CANVG: canvg n\u00e3o carregado (canvg_ix=" + c + ")");
      }
      var h = a.g;
      const p = new OffscreenCanvas(d, f), l = B(p);
      k.fromString(l, b).start({ignoreAnimation:!0});
      h[e] = p;
    } else if (g === 2) {
      let k = c > 0 ? a.g[c] : null;
      k ||= await Sa();
      const p = new OffscreenCanvas(d, f), l = B(p);
      await k.fromString(l, b).render();
      a.g[e] = p;
    }
  } catch (k) {
    console.error("js_svg_image_dispatch ERRO:", k, "\nsvg:", b);
  }
}
;function bb(a, b) {
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
;class cb {
  constructor() {
    this.h = new WeakMap();
    this.g = null;
    this.l = [document.body];
    this.j = [];
  }
  get i() {
    return !!this.g;
  }
  set i(a) {
    a !== !!this.g && (a ? (this.g = new MutationObserver(b => {
      b.forEach(c => {
        this.j.forEach(d => d(c));
      });
    }), this.l.forEach(b => this.g.observe(b, {childList:!0, subtree:!0}))) : (this.g.disconnect(), this.g = null));
  }
}
var F = new cb();
const db = {[6]:1, [5]:1, [7]:1, [1]:10, [4]:1, [3]:1, [2]:10, [8]:1, [9]:1, [10]:-100.11, [11]:-100.33, [12]:0, [13]:2, [14]:8, [15]:0};
function eb(a) {
  function b(e) {
    if (d.currentNode.childNodes.length !== e.i.length) {
      return d.firstChild(), new fb(d.currentNode, e);
    }
    if (d.nextSibling()) {
      return new fb(d.currentNode, e.parent);
    }
    d.parentNode();
    if (d.currentNode && e.parent) {
      return e.parent;
    }
  }
  function c(e) {
    e.i = e.i.filter(g => {
      let h = g.g instanceof Text ? g.g.textContent.trim().length > 0 : !0;
      h || e.g.removeChild(g.g);
      return h;
    });
    e.i.forEach(g => c(g));
  }
  let d = document.createTreeWalker(a, NodeFilter.SHOW_ALL), f = a = new fb(a);
  for (; f = b(f), f !== void 0;) {
  }
  c(a);
  return a;
}
function gb(a) {
  let b = [];
  var c = [];
  if (a.g instanceof HTMLElement || a.g instanceof SVGElement) {
    a = a.g.attributes;
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
function hb(a, b) {
  for (let c = 0; c < a.Z.length; c++) {
    if (b === a.Z[c].key) {
      return a.Z[c].value;
    }
  }
}
function ib(a, b) {
  return b ? a.Z.reduce((c, d) => c || d.key === b, !1) : a.g instanceof HTMLElement ? !0 : !1;
}
class fb {
  constructor(a, b) {
    b && (this.parent = b);
    this.g = a;
    this.i = [];
    b && b.i.push(this);
    this.o = null;
    this.Z = gb(this);
    this.l = [];
    a instanceof HTMLElement || a instanceof SVGElement ? (this.h = a, this.j = this.h.localName, a instanceof HTMLInputElement ? (this.l.push({key:"value", value:a.value}), this.l.push({key:"checked", value:a.checked})) : a instanceof HTMLSelectElement && this.l.push({key:"value", value:a.value})) : a instanceof Text ? (this.j = "-Text", this.o = a.textContent) : a instanceof ShadowRoot ? this.j = "div" : a instanceof Comment ? this.j = "!--" : (this.j = a.constructor.name, console.log("TYPE", a, 
    this.j));
  }
  get id() {
    return hb(this, "id") ?? "";
  }
  get lid() {
    return hb(this, "lid") ?? "";
  }
  toString(a = 0) {
    const b = "    ".repeat(a);
    let c = `${b}<${this.j}>\n`;
    this.i.forEach(d => {
      c += `${d.toString(a + 1)}`;
    });
    return c += `${b}</${this.j}>\n`;
  }
}
;function jb(a) {
  let b = document.createElement("div");
  if (a.Z) {
    for (let [c, d] of Object.entries(a.Z)) {
      c.startsWith("_") || b.setAttribute(c.replace("_", "-"), d);
    }
  }
  a.parent && a.parent.appendChild(b);
  a.B && a.B(b);
  return b;
}
;const lb = "default alias all-scroll auto cell col-resize context-menu copy crosshair e-resize ew-resize grab grabbing help move n-resize ne-resize nesw-resize ns-resize nw-resize nwse-resize no-drop none not-allowed pointer progress row-resize s-resize se-resize sw-resize text url w-resize wait zoom-in zoom-out".split(" ");
var I = ["lt_cursor$$module$2023$ploft$js_dev$src$frontend$0$domedit"], J = aa;
I[0] in J || typeof J.execScript == "undefined" || J.execScript("var " + I[0]);
for (var K; I.length && (K = I.shift());) {
  I.length || lb === void 0 ? J[K] && J[K] !== Object.prototype[K] ? J = J[K] : J = J[K] = {} : J[K] = lb;
}
;var mb = new WeakMap(), nb = new WeakMap();
const ob = new WeakMap();
function pb(a, b, c) {
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
var qb = (a, b, c, d) => {
  let f = [];
  const e = [];
  c.Z.forEach(k => {
    ib(b, k.key) || f.push(k.key);
  });
  let g = !1, h = [];
  if (d.Ia) {
    const k = (hb(c, "class") ?? "").trim().split(/\s+/);
    d.Ia.class.trim().split(/\s+/).every(p => k.includes(p)) && (g = !0, h = d.Ia.keys);
  }
  g && (f = f.filter(k => !h.includes(k)));
  b.Z.forEach(k => {
    const p = hb(c, k.key);
    g && h.includes(k.key) || (k.key === "class" ? pb(k.value, p ?? "", d.Ya ?? []) || e.push(k) : p !== k.value && e.push(k));
  });
  f.length && a.g.push({step:6, R:f.length, B:() => f.forEach(k => c.h.removeAttribute(k))});
  e.length && a.g.push({step:5, R:e.length, B:() => e.forEach(k => c.h.setAttribute(k.key, k.value))});
};
function rb(a, b, c, d) {
  b.j !== c.j && (a.status = 1);
  a.status !== 1 && (qb(a, b, c, d), sb(a, b, c), tb(a, b, c), ub(a, b, c));
}
function vb(a, b, c, d) {
  let f = mb.get(b.h);
  if (f) {
    var e = mb.get(c.h);
    e ? a.g.push({step:13, R:1, B:() => {
      wb(f, e, d);
    }}) : a.g.push({step:14, R:1, B:() => {
      e = c.h.attachShadow({mode:f.mode});
      mb.set(c.h, e);
      wb(f, e, d);
    }});
  }
}
function xb(a, b, c, d) {
  let f = b.i.map(() => !1), e = c.i.map(() => !1), g = [], h = [];
  b.i.forEach((l, m) => {
    c.i.forEach((u, r) => {
      f[m] || e[r] || (u = new yb(l, u, d), u.status !== 1 && (u.status === 4 || u.h === 0 ? (f[m] = !0, e[r] = !0, g.push({Y:m, ra:r, ia:r}), u.status === 4 ? a.l++ : a.j++, a.i.push(u)) : h.push({Ea:m, xa:r, sa:u, Va:u.h, selected:!1})));
    });
  });
  h.length > 0 && (h = h.sort((l, m) => l.sa.h < m.sa.h ? -1 : l.sa.h === m.sa.h ? 0 : 1), h.forEach(l => {
    f[l.Ea] || e[l.xa] || (f[l.Ea] = !0, e[l.xa] = !0, l.selected = !0, g.push({Y:l.Ea, ra:l.xa, ia:l.xa}), a.i.push(l.sa));
  }));
  let k = e.reduce((l, m, u) => m ? l : [...l, u], []);
  k.length && (a.g.push({step:2, R:k.length, B:() => k.forEach(l => {
    c.g.removeChild(c.i[l].g);
  })}), k.forEach(l => {
    g = g.map(m => l > m.ra ? m : {Y:m.Y, ra:m.ra, ia:m.ia - 1});
  }));
  let p = f.reduce((l, m, u) => m ? l : [...l, u], []);
  p.length && (a.g.push({step:1, R:p.length, B:() => p.forEach(l => {
    l = b.i[l].g;
    c.g.appendChild(l);
    F.i || zb(l);
  })}), p.forEach(l => g.push({Y:l, ra:Number.NaN, ia:g.length})));
  if (g.reduce((l, m) => l || m.ia !== m.Y, !1)) {
    let l = g.sort((m, u) => m.Y < u.Y ? -1 : m.Y === u.Y ? 0 : 1).map(m => m.ia);
    a.g.push({step:3, R:1, B:() => {
      for (let m = 0; m < l.length; m++) {
        if (m != l[m]) {
          let u = l[m];
          if (c.g instanceof HTMLElement || c.g instanceof SVGElement) {
            let r = c.g.childNodes[m], w = c.g.childNodes[u];
            l.splice(m, 1, m);
            l = l.map(z => z + (z >= m && z < u ? 1 : 0));
            c.g.insertBefore(w, r);
          }
        }
      }
    }});
  }
}
function Ab(a) {
  if (a.status === 1) {
    return 0;
  }
  let b = 0;
  a.g.forEach(c => b += db[c.step] * c.R);
  b += db[10] * a.j;
  b += db[11] * a.l;
  a.i.forEach(c => b += c.h);
  return b;
}
function sb(a, b, c) {
  let d = b.l.reduce((f, e) => {
    var g;
    a: {
      for (g = 0; g < c.l.length; g++) {
        if (e.key === c.l[g].key) {
          g = c.l[g].value;
          break a;
        }
      }
      g = void 0;
    }
    g !== e.value && f.push(e);
    return f;
  }, []);
  d.length && a.g.push({step:7, R:d.length, B:() => d.forEach(f => {
    c.g instanceof HTMLInputElement && (f.key === "value" && (c.g.value = f.value), f.key === "checked" && (c.g.checked = f.value));
    c.g instanceof HTMLSelectElement && f.key === "value" && (c.g.value = f.value);
  })});
}
function tb(a, b, c) {
  b.o !== c.o && a.g.push({step:4, R:1, B:() => {
    c.g.textContent = b.o;
  }});
}
function ub(a, b, c) {
  let d = F.h.get(b.g) ?? [], f = F.h.get(c.g) ?? [], e = [], g = [];
  f.forEach((h, k) => {
    let p = !0;
    d.forEach(l => {
      h.event === l.event && (h.hash !== void 0 || l.hash !== void 0 ? h.hash === l.hash && (p = !1) : h.B === l.B && (p = !1));
    });
    p && e.push(k);
  });
  d.forEach((h, k) => {
    let p = !0;
    f.forEach(l => {
      l.event === h.event && (l.hash !== void 0 || h.hash !== void 0 ? l.hash === h.hash && (p = !1) : l.B === h.B && (p = !1));
    });
    p && g.push(k);
  });
  e.length && a.g.push({step:9, R:e.length, B:() => {
    e.forEach(h => c.g.removeEventListener(f[h].event, f[h].B));
    e.sort((h, k) => h < k ? 1 : k < h ? -1 : 0).forEach(h => f.splice(h, 1));
    F.h.set(c.g, f);
  }});
  g.length && a.g.push({step:8, R:g.length, B:() => {
    g.forEach(h => {
      c.g.addEventListener(d[h].event, d[h].B);
      f.push({event:d[h].event, B:d[h].B, hash:d[h].hash});
      F.h.set(c.g, f);
    });
  }});
}
function Bb(a) {
  a.i.forEach(b => {
    Bb(b);
  });
  a.g.forEach(b => {
    try {
      b.B();
    } catch (c) {
      console.error(b.step, c);
    }
  });
}
class yb {
  constructor(a, b, c) {
    this.g = [];
    this.status = 2;
    this.i = [];
    this.h = Number.NaN;
    this.l = this.j = 0;
    this.g.push({step:15, B:() => {
      const d = a.h, f = b.h;
      d && f && ob.set(d, f);
    }, R:1});
    if (c.va !== !0) {
      if (a.id) {
        if (a.id === b.id) {
          if (this.status = 4, ob.set(a.h, b.h), (c.Wa ?? []).includes(a.id)) {
            return;
          }
        } else {
          this.status = 1;
          return;
        }
      } else if (a.lid) {
        if (a.lid === b.lid) {
          this.status = 4, ob.set(a.h, b.h);
        } else {
          this.status = 1;
          return;
        }
      } else if (b.id || b.lid) {
        this.status = 1;
        return;
      }
      rb(this, a, b, c);
      if (this.status === 1) {
        return;
      }
    }
    vb(this, a, b, {...c, va:!0});
    this.status !== 1 && (xb(this, a, b, {...c, va:!1}), this.h = Ab(this));
  }
}
function zb(a) {
  let b = nb.get(a);
  b && (b(a), nb.delete(a));
  a.childNodes.forEach(zb);
}
function wb(a, b, c) {
  let d = typeof a !== "string" ? a : jb({B:e => e.innerHTML = a});
  b instanceof ShadowRoot && d instanceof HTMLElement && d.attributes.length && (d = jb({B:e => e.appendChild(d)}));
  let f = eb(d);
  b = eb(b);
  Bb(new yb(f, b, c));
}
;const Cb = new Set("svg path symbol circle ellipse line polyline polygon rect g defs use clipPath mask pattern linearGradient radialGradient stop text tspan textPath image foreignObject marker filter feBlend feColorMatrix feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDropShadow feFlood feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset feSpecularLighting feTile feTurbulence animate animateMotion animateTransform set desc title metadata".split(" ")), Db = new WeakMap(), 
Eb = new WeakMap();
function Fb(a) {
  if (!a) {
    return null;
  }
  if (document.body.contains(a)) {
    return a;
  }
  for (; a;) {
    let b = ob.get(a);
    if (b && document.body.contains(b)) {
      return b;
    }
    if (b === a) {
      break;
    }
    a = b;
  }
  return null;
}
async function Gb(a) {
  a = a.H;
  let b = a.length;
  for (let c = 0; c < b; c++) {
    const d = a[c].Fa;
    d && (await d(), a[c].ya.forEach(f => {
      (f = f.g) && Eb.set(f, !0);
    }));
  }
  a.length = 0;
}
async function Hb(a, b, c) {
  if (typeof b === "string" || typeof b === "number") {
    return c && c.appendChild(document.createTextNode(String(b))), null;
  }
  if (!b) {
    return null;
  }
  a.H.push(b);
  b.H = a.H;
  a = await b.U(c);
  Db.set(b, {parent:c ?? null, qa:a});
  return a;
}
async function Ib(a, b) {
  var c = a.G;
  var d = c?.[0];
  c = (c?.length ?? 0) === 1 && typeof d === "function" ? d() : c ?? [];
  d = c.length;
  for (let f = 0; f < d; f++) {
    await Hb(a, c[f], b);
  }
}
class Jb {
  constructor(a) {
    this.g = a ?? {};
    this.G = [];
    this.za = {};
    this.ya = [];
  }
  async refresh() {
    const a = Db.get(this);
    a && (a.qa = Fb(a.qa), a.parent = Fb(a.parent));
    if (!a || !a.qa) {
      throw Error("no root to update");
    }
    var b = a.parent ? a.parent.cloneNode(!1) : null;
    this.H = [];
    (b = await this.U(b ?? void 0)) && wb(b, a.qa, {va:!1, ...this.za});
    await Gb(this);
  }
  render() {
    return null;
  }
  async U(a) {
    const b = await this.render();
    return b ? Hb(this, b, a) : null;
  }
}
class Kb extends Jb {
  create(a) {
    if (!this.h) {
      return null;
    }
    const b = Cb.has(this.h) ? document.createElementNS("http://www.w3.org/2000/svg", this.h) : document.createElement(this.h);
    for (let [f, e] of Object.entries(this.g ?? {})) {
      if (f === "className" && (f = "class"), f === "style") {
        var c = [], d = e;
        for (let [g, h] of Object.entries(d)) {
          c.push(`${Lb(g)}:${h}`);
        }
        b.setAttribute(f, c.join(";"));
      } else if (f.startsWith("on")) {
        d = f.substring(2).toLowerCase();
        const g = e;
        b.addEventListener(d, g);
        c = F;
        let h = c.h.get(b);
        h || (h = [], c.h.set(b, h));
        h.push({event:d, B:g, hash:void 0});
      } else {
        f === "ref" ? e.h = b : b.setAttribute(String(f), String(e));
      }
    }
    a && a.appendChild(b);
    return b;
  }
  async U(a) {
    (a = this.create(a)) && await Ib(this, a);
    return a;
  }
}
function Lb(a) {
  return a.replace(/[A-Z]/g, b => `-${b.toLowerCase()}`);
}
function Mb(a) {
  var b = [];
  a.G ? b.length && a.G.push(...b) : a.G = b;
  return a;
}
function L(a, b, ...c) {
  b = new Kb(b);
  b.h = a;
  c && (b.G = ca(c));
  return b;
}
class Nb {
  static get g() {
    return Jb;
  }
}
;async function Ob(a, b) {
  const c = b.cloneNode(!1);
  a.H = [];
  const d = await a.U(c);
  Db.set(a, {parent:c, qa:d});
  wb(c, b, {va:!1});
  await Gb(a);
}
;const Pb = new Map(), Qb = new Map();
function Rb(a, b) {
  return a.g.view.getInt32(a.h + b, !0);
}
function M(a, b) {
  a.g.view.setInt32(a.h + 4, b, !0);
}
function N(a, b) {
  a.g.view.setFloat64(a.h + 8, b, !0);
}
class Sb {
  constructor(a, b, c) {
    this.g = a;
    this.i = b;
    this.h = c;
  }
  notify(a) {
    this.g.v(this.i, a);
  }
}
class Tb extends Jb {
  constructor() {
    super(void 0);
  }
  na() {
  }
}
async function Ub(a, b, c) {
  var d = a.view, f = d.getInt32(b, !0);
  const e = d.getInt32(b + 4, !0);
  d = d.getInt32(b + 8, !0);
  b = Pb.get(f);
  if (!b) {
    return console.error("jsx_dispatch: componente nao registrado, id=" + f), null;
  }
  f = new Sb(a, e, d);
  a = c ? a.g[c] : {};
  c = document.getElementById("dpanel");
  if (!c) {
    return console.error("jsx_dispatch: #dpanel nao encontrado"), null;
  }
  const g = document.createElement("div");
  g.style.pointerEvents = "auto";
  c.appendChild(g);
  const h = new b(a);
  h.u = f;
  h.na();
  let k = !1, p = !1;
  await Ob(h, g).then(() => {
    k = !0;
    p && h.refresh();
  });
  Qb.set(e, {Sa:h, container:g});
  return [() => {
    g.remove();
    Qb.delete(e);
  }, () => {
    k ? h.refresh() : p = !0;
  }];
}
;const Vb = "fd_advise fd_allocate fd_datasync fd_fdstat_set_flags fd_fdstat_set_rights fd_filestat_get fd_filestat_set_size fd_filestat_set_times fd_pread fd_pwrite fd_read fd_readdir fd_renumber fd_sync fd_tell path_create_directory path_filestat_get path_filestat_set_times path_link path_open path_readlink path_remove_directory path_rename path_symlink path_unlink_file poll_oneoff sched_yield sock_accept sock_recv sock_send sock_shutdown __wasm_longjmp __wasm_setjmp_test args_get args_sizes_get clock_res_get fd_close fd_prestat_get fd_prestat_dir_name fd_seek proc_exit".split(" ");
async function Wb(a, b = {}) {
  a = new Response(new Blob([a], {type:"application/wasm"}));
  return await WebAssembly.instantiateStreaming(a, b);
}
console.log("DEV MODE", !0);
function O(a, b) {
  window.exp = a.L.instance.exports;
  return a.L.instance.exports[b];
}
async function Xb(a, b) {
  let c = 0;
  const d = async() => {
    var f = {wasi_snapshot_preview1:a.K, env:a.K};
    try {
      a.L = await Wb(b, f);
    } catch (e) {
      return (f = String(e).match(/"(.*?)"\s*"(.*?)"/)) ? f[2] : null;
    }
    return null;
  };
  for (; c < 100;) {
    let f = await d();
    if (f) {
      Vb.push(f), c++;
    } else {
      break;
    }
  }
  c > 0 && (console.log("new imports demmand", c), console.log(Vb));
  a.da.forEach(f => f());
  a.O();
}
async function Yb(a) {
  if (!a.L) {
    var b = await fetch("teste.wasm?v=9916317d");
    b.ok && (b = await b.arrayBuffer(), await Xb(a, b));
  }
}
class Zb {
  constructor() {
    this.da = [() => {
      this.G = O(this, "memory");
      this.l = this.G.buffer;
      this.I = new Uint8Array(this.l);
      this.J = new DataView(this.l);
    }, () => this.o = O(this, "c01"), () => this.C = O(this, "c02"), () => this.O = O(this, "_start")];
  }
  get buffer() {
    return this.G.buffer;
  }
  get h() {
    this.G.buffer !== this.l && (this.l = this.G.buffer, this.I = new Uint8Array(this.l), this.J = new DataView(this.l));
    return this.I;
  }
  get view() {
    this.G.buffer !== this.l && (this.l = this.G.buffer, this.I = new Uint8Array(this.l), this.J = new DataView(this.l));
    return this.J;
  }
  o() {
    throw Error("Not initialized");
  }
  C() {
    throw Error("Not initialized");
  }
  O() {
    throw Error("Not initialized");
  }
  get K() {
    return this.ba;
  }
  get ba() {
    const a = {fd_write:(c, d, f, e) => {
      let g = 0;
      for (let p = 0; p < f; p++) {
        var h = d + p * 8, k = this.view.getUint32(h, !0);
        h = this.view.getUint32(h + 4, !0);
        k = this.h.slice(k, k + h);
        k.every(l => l === 0 || l === 10 || l === 13) || (k = (new TextDecoder()).decode(k), console[c === 1 ? "log" : "error"](k));
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
      c = this.h.subarray(c, c + d);
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
    Vb.forEach(c => {
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
function P(a, b, c, d, f) {
  if (b == 33) {
    return {X:a.g, key:c};
  }
  if (b === 34) {
    return {X:a.g[c], key:f};
  }
  if (b === 35) {
    let e = a.g[c];
    a = a.i(d, d + f).split(".");
    b = a.pop();
    a.forEach(g => e = e[g]);
    return {X:e, key:b};
  }
  return null;
}
function R(a, b, c, d, f) {
  if (b & 2048) {
    return R(a, b - 2048, c, d, f) ? 1 : 0;
  }
  if (b & 4096) {
    return Number(R(a, b - 4096, c, d, f));
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
    return a.g[c];
  }
  if (b === 34) {
    return a.g[c][f];
  }
  if (b === 35) {
    let e = a.g[c];
    a.i(d, d + f).split(".").forEach(g => e = e[g]);
    return e;
  }
  if (b === 38) {
    let e = a.g[c];
    a.i(d, d + f).split(".").forEach(g => {
      e = e[g].bind(e);
    });
    return e;
  }
  if (b === 37) {
    return window.mem = a.g;
  }
  if (b === 1025) {
    return ja(a.i(d, d + c));
  }
  if (b === 1026) {
    return () => Ca(a, d);
  }
  if (b === 1027) {
    return ba;
  }
  if (b === 1028) {
    return () => $a(a, d);
  }
  if (b === 1029) {
    return () => ab(a, d);
  }
  if (b === 1030) {
    return bb(a, d);
  }
  if (b === 1031) {
    return async e => {
      const g = [() => ({description:"Raster", accept:{"image/svg":[".svg"]}}), () => ({description:"Image", accept:{"image/png":[".png"], "image/jpeg":[".jpg", ".jpeg"], "image/gif":[".gif"]}}), () => ({description:"Document", accept:{"application/pdf":[".pdf"]}}), () => ma, () => na], h = [];
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
    return () => Ub(a, d, c);
  }
}
function $b(a) {
  let b;
  return (new Promise((c, d) => {
    b = a.H();
    a.g[b] = [c, d];
    a.N(b, 0, 0, 0, 0, 0);
  })).finally(() => {
    delete a.g[b];
    a.ca(b);
  });
}
class ac extends Zb {
  constructor() {
    super();
    this.da.push(() => this.H = O(this, "c03"), () => this.ca = O(this, "c04"), () => this.N = O(this, "c05"), () => this.v = O(this, "c06"), () => this.j = O(this, "c07"), () => this.F = O(this, "c08"), () => this.ea = O(this, "c09"));
    this.g = [];
    this.U = new TextDecoder();
    this.$ = new TextEncoder();
    this.A = (a, b) => {
      a = this.$.encode(a);
      a.length >= b.cap && (this.C(b.D), b.cap = a.length + 1, b.D = this.o(b.cap));
      this.h.set(a, b.D);
      this.view.setUint8(b.D + a.length, 0);
      return a.length;
    };
    this.i = (a, b) => this.U.decode(this.h.subarray(a, b));
    this.g[0] = window;
  }
  get K() {
    return {...this.ba, ...this.ka};
  }
  get ka() {
    return {j01:this.la.bind(this), j02:this.ta.bind(this), j03:this.ma.bind(this), j04:this.Ba.bind(this), j05:this.Aa.bind(this), j06:this.ya.bind(this), j07:this.write.bind(this), j08:this.za.bind(this), j09:this.Fa.bind(this), j10:this.ja.bind(this), j11:this.na.bind(this)};
  }
  H() {
    throw Error("Not initialized");
  }
  ca() {
    throw Error("Not initialized");
  }
  v() {
    throw Error("Not initialized");
  }
  ea() {
    throw Error("Not initialized");
  }
  j() {
    throw Error("Not initialized");
  }
  F() {
    throw Error("Not initialized");
  }
  la(a, b, c, d) {
    (a = P(this, a, b, c, d)) && delete a.X[a.key];
  }
  N() {
    throw Error("Not initialized");
  }
  ta(a, b, c, d) {
    (a = P(this, a, b, c, d)) && (a.X[a.key] = {});
  }
  ma(a, b, c, d) {
    (a = P(this, a, b, c, d)) && (a.X[a.key] = []);
  }
  Ba(a, b, c, d) {
    return R(this, a, b, c, d);
  }
  Aa(a, b, c, d) {
    return R(this, a, b, c, d);
  }
  ya(a, b, c, d, f, e) {
    a = R(this, a, b, c, d);
    a = this.$.encode(a);
    b = 0;
    a.length >= e && (b = f = this.o(a.length + 1));
    this.h.set(a, f);
    this.h[f + a.length] = 0;
    return b;
  }
  za(a, b, c, d, f) {
    a = R(this, a, b, c, d);
    f && this.view.setInt32(f, a?.byteLength ?? 0, !0);
    if (!a) {
      return 0;
    }
    f = this.o(a.byteLength);
    this.h.set(new Uint8Array(a), f);
    return f;
  }
  write(a, b, c, d, f, e, g, h) {
    (a = P(this, a, b, c, d)) && (a.X[a.key] = R(this, f, e, g, h));
  }
  Fa(a, b, c, d, f, e, g, h, k, p, l, m, u) {
    a = R(this, a, b, c, d);
    f == 0 ? u = a() : (f = R(this, f, e, g, h), u = u && Array.isArray(f) ? a(...f) : a(f));
    (k = P(this, k, p, l, m)) && (k.X[k.key] = u);
  }
  ja(a, b, c, d, f, e, g, h, k, p, l, m, u, r, w, z, Q, v, y) {
    const G = W => {
      const H = P(this, u, r, w, z);
      H && (H.X[H.key] = W);
      this.v(Q, 0);
    };
    (async() => {
      try {
        let H = !1, kb = 0;
        v && (kb = setTimeout(() => {
          H = !0;
          G("timeout");
        }, v));
        const ya = R(this, a, b, c, d);
        let za;
        if (f == 0) {
          za = await ya();
        } else {
          const Aa = R(this, f, e, g, h);
          za = y && Array.isArray(Aa) ? await ya(...Aa) : await ya(Aa);
        }
        if (!H) {
          v && clearTimeout(kb);
          var W = P(this, k, p, l, m);
          W && (W.X[W.key] = za);
          this.v(Q, 1);
        }
      } catch (H) {
        G(H.name + ": " + H.message);
      }
    })();
  }
  na(a, b, c, d, f, e) {
    a = new (R(this, a, b, c, d))(...(f ? this.g[f] : []));
    e && (this.g[e] = a);
  }
}
;class bc extends DataView {
  constructor(a, b, c) {
    super(a, b, c);
    this.i = new Uint8Array(this.buffer);
  }
  getFloat16(a, b) {
    a: {
      var c = this.i, d = b ?? !1;
      b = -7;
      let f = d ? 1 : 0;
      d = d ? -1 : 1;
      let e = c[a + f];
      f += d;
      let g = e & (1 << -b) - 1;
      e >>= -b;
      for (b += 5; b > 0;) {
        g = g * 256 + c[a + f], f += d, b -= 8;
      }
      let h = g & (1 << -b) - 1;
      g >>= -b;
      for (b += 10; b > 0;) {
        h = h * 256 + c[a + f], f += d, b -= 8;
      }
      if (g === 0) {
        g = -14;
      } else {
        if (g === 31) {
          a = h ? NaN : (e ? -1 : 1) * Infinity;
          break a;
        }
        h += 1024;
        g -= 15;
      }
      a = (e ? -1 : 1) * h * Math.pow(2, g - 10);
    }
    return a;
  }
  setFloat16(a, b, c) {
    var d = this.i, f = c ?? !1;
    c = 10;
    let e, g = 16 - c - 1;
    const h = (1 << g) - 1, k = h >> 1, p = c === 23 ? 5.960464477539062E-8 : 0;
    let l = f ? 0 : 1;
    const m = f ? 1 : -1, u = b < 0 || b === 0 && 1 / b < 0 ? 1 : 0;
    b = Math.abs(b);
    isNaN(b) || b === Infinity ? (b = isNaN(b) ? 1 : 0, f = h) : (f = Math.floor(Math.log(b) / Math.LN2), b * (e = Math.pow(2, -f)) < 1 && (f--, e *= 2), b = f + k >= 1 ? b + p / e : b + p * Math.pow(2, 1 - k), b * e >= 2 && (f++, e /= 2), f + k >= h ? (b = 0, f = h) : f + k >= 1 ? (b = (b * e - 1) * Math.pow(2, c), f += k) : (b = b * Math.pow(2, k - 1) * Math.pow(2, c), f = 0));
    for (; c >= 8;) {
      d[a + l] = b & 255, l += m, b /= 256, c -= 8;
    }
    f = f << c | b;
    for (g += c; g > 0;) {
      d[a + l] = f & 255, l += m, f /= 256, g -= 8;
    }
    d[a + l - m] |= u * 128;
  }
}
function cc(a, b, c = 0, d = b.byteLength) {
  if (b !== a.h || c !== a.g.byteOffset || d !== a.g.byteLength) {
    a.h = b, a.g = new bc(b, c, d), a.j = !0;
  }
}
function S(a, b, c) {
  b += c;
  if (b >= a.g.byteLength) {
    if (a.j) {
      throw Error("Buffer overflow");
    }
    c = new Uint8Array(a.g.buffer);
    a.h = new ArrayBuffer(Math.max(a.g.byteLength + 500, b));
    a.g = new bc(a.h);
    (new Uint8Array(a.h)).set(c);
  }
}
class dc {
  constructor() {
    this.h = new ArrayBuffer(500);
    this.g = new bc(this.h);
    this.j = !1;
  }
  get buffer() {
    return this.g.buffer;
  }
  get byteLength() {
    return this.g.byteLength;
  }
  get byteOffset() {
    return this.g.byteOffset;
  }
  getFloat16(a, b) {
    return this.g.getFloat16(a, b);
  }
  setFloat16(a, b, c) {
    this.g.setFloat16(a, b, c);
  }
  getFloat32(a, b) {
    return this.g.getFloat32(a, b);
  }
  setFloat32(a, b, c) {
    S(this, a, 4);
    this.g.setFloat32(a, b, c);
  }
  getFloat64(a, b) {
    return this.g.getFloat64(a, b);
  }
  setFloat64(a, b, c) {
    S(this, a, 8);
    this.g.setFloat64(a, b, c);
  }
  getUint8(a) {
    return this.g.getUint8(a);
  }
  setUint8(a, b) {
    S(this, a, 1);
    this.g.setUint8(a, b);
  }
  getUint16(a, b) {
    return this.g.getUint16(a, b);
  }
  setUint16(a, b, c) {
    S(this, a, 2);
    this.g.setUint16(a, b, c);
  }
  getUint32(a, b) {
    return this.g.getUint32(a, b);
  }
  setUint32(a, b, c) {
    S(this, a, 4);
    this.g.setUint32(a, b, c);
  }
  getInt8(a) {
    return this.g.getInt8(a);
  }
  setInt8(a, b) {
    S(this, a, 1);
    this.g.setInt8(a, b);
  }
  getInt16(a, b) {
    return this.g.getInt16(a, b);
  }
  setInt16(a, b, c) {
    S(this, a, 2);
    this.g.setInt16(a, b, c);
  }
  getInt32(a, b) {
    return this.g.getInt32(a, b);
  }
  setInt32(a, b, c) {
    S(this, a, 4);
    this.g.setInt32(a, b, c);
  }
  getBigInt64(a, b) {
    return this.g.getBigInt64(a, b);
  }
  setBigInt64(a, b, c) {
    S(this, a, 8);
    this.g.setBigInt64(a, b, c);
  }
  getBigUint64(a, b) {
    return this.g.getBigUint64(a, b);
  }
  setBigUint64(a, b, c) {
    S(this, a, 8);
    this.g.setBigUint64(a, b, c);
  }
}
;class T {
  constructor(a) {
    this.g = a;
    this.h = [];
    const b = a.addColorStop.bind(a);
    a.addColorStop = (c, d) => {
      this.addColorStop(c, d);
      b(c, d);
    };
    a._ = this;
  }
  addColorStop(a, b) {
    this.h.push({offset:a, color:b});
    this.g.addColorStop(a, b);
  }
}
class ec {
  constructor(a) {
    this.g = a;
    this.data = null;
    this.h = [];
    const b = a.setTransform.bind(a);
    a.setTransform = c => {
      this.setTransform(c);
      b(c);
    };
    a._ = this;
  }
  setTransform(a) {
    this.g.setTransform(a);
    a && this.h.push(a);
  }
}
function U(a) {
  if (!a) {
    return -1;
  }
  console.log("ref index", a);
  if (a instanceof Path2D) {
    throw Error("not a Path2DArray");
  }
  return -1;
}
class fc {
}
;function V(a, b, c) {
  b = (1 << b) - 1;
  if ((a | b) !== b) {
    throw Error(`${a} > ${b}`);
  }
  return (b & a) << c;
}
function X(a) {
  a.C++;
  let b = a.size;
  a.h.setUint8(b, a.e);
  b++;
  const c = b, d = Ra[a.e];
  d || console.log(a.e);
  const f = Math.ceil(((d.m ?? 0) * 2 + (d.ua ?? 0) + (d.ga ?? 0) + +(d.P ?? 0)) / 8);
  b += f;
  let e = 0, g = 0;
  for (var h = 0; h < (d.m ?? 0); h++) {
    var k = a.g[h] ?? 0;
    if (Number.isInteger(k)) {
      if (Math.abs(k) < 256) {
        k > 0 ? (a.h.setUint8(b, k), k = V(0, 2, g), g += 2, e |= k) : (a.h.setUint8(b, -k), k = V(1, 2, g), g += 2, e |= k);
        b += 1;
        continue;
      } else if (Math.abs(k) < 32768) {
        a.h.setInt16(b, k, !0);
        k = V(2, 2, g);
        g += 2;
        e |= k;
        b += 2;
        continue;
      }
    }
    a.h.setFloat32(b, k, !0);
    k = V(3, 2, g);
    g += 2;
    e |= k;
    b += 4;
  }
  a.g.length = 0;
  for (h = 0; h < (d.W ?? 0); h++) {
    a.h.setFloat16(b, a.i[h] ?? 0, !0), b += 2;
  }
  a.i.length = 0;
  for (h = 0; h < (d.oa ?? 0); h++) {
    a.h.setUint8(b, a.v[h] ?? 0), b += 1;
  }
  a.v.length = 0;
  for (h = 0; h < (d.ref ?? 0); h++) {
    a.h.setUint16(b, a.l[h] ?? 0, !0), b += 2;
  }
  a.l.length = 0;
  for (h = 0; h < (d.size ?? 0); h++) {
    b += 4;
  }
  d.ua && (e |= V(a.A.length, d.ua, g), g += d.ua, a.A.forEach(p => {
    a.h.setUint8(b, p);
    b += 1;
  }), a.A.length = 0);
  d.ga && (e |= V(a.j.length, d.ga, g), g += d.ga, a.j.forEach(p => {
    a.h.setFloat32(b, p, !0);
    b += 4;
  }), a.j.length = 0);
  d.P && (e |= V(a.o, d.P, g), g += d.P, a.o = 0);
  if (f != 0) {
    if (f == 1) {
      a.h.setUint8(c, e);
    } else if (f == 2) {
      a.h.setUint16(c, e, !0);
    } else if (f <= 4) {
      a.h.setUint32(c, e, !0);
    } else {
      throw Error();
    }
  }
  a.size = b;
}
class hc {
  constructor(a) {
    this.h = new dc();
    this.ref = new fc();
    if (a instanceof ArrayBuffer) {
      var b = this.h, c;
      if (!d) {
        var d = a.byteLength;
      }
      c ||= 0;
      S(b, 0, d);
      b = new Uint8Array(b.h);
      a = new Uint8Array(a, c, d);
      b.set(a, 0);
    } else {
      typeof a === "number" && (this.h.setUint8(0, a), this.size = 5);
    }
    this.g = [];
    this.v = [];
    this.l = [];
    this.A = [];
    this.j = [];
    this.i = [];
    this.C = 0;
  }
  get size() {
    return this.h.getUint32(1, !0);
  }
  set size(a) {
    this.h.setUint32(1, a, !0);
  }
}
;class ic {
  constructor() {
    this.h = new hc(100);
    this.g = B(new OffscreenCanvas(200, 200));
    this.canvas = this.g.canvas;
  }
  arc(a, b, c, d, f, e) {
    const g = this.h;
    g.e = 1;
    g.g[0] = a;
    g.g[1] = b;
    g.g[2] = c;
    g.i[0] = d;
    g.i[1] = f;
    g.o = e ? 1 : 0;
    X(g);
    this.g.arc(a, b, c, d, f, e);
  }
  arcTo(a, b, c, d, f) {
    const e = this.h;
    e.e = 2;
    e.g[0] = a;
    e.g[1] = b;
    e.g[2] = c;
    e.g[3] = d;
    e.g[4] = f;
    X(e);
    this.g.arcTo(a, b, c, d, f);
  }
  bezierCurveTo(a, b, c, d, f, e) {
    const g = this.h;
    g.e = 3;
    g.g[0] = a;
    g.g[1] = b;
    g.g[2] = c;
    g.g[3] = d;
    g.g[4] = f;
    g.g[5] = e;
    X(g);
    this.g.bezierCurveTo(a, b, c, d, f, e);
  }
  closePath() {
    const a = this.h;
    a.e = 4;
    X(a);
    this.g.closePath();
  }
  ellipse(a, b, c, d, f, e, g, h) {
    const k = this.h;
    k.e = 5;
    k.g[0] = a;
    k.g[1] = b;
    k.g[2] = c;
    k.g[3] = d;
    k.i[0] = f;
    k.i[1] = e;
    k.i[2] = g;
    k.o = h ? 1 : 0;
    X(k);
    this.g.ellipse(a, b, c, d, f, e, g, h);
  }
  lineTo(a, b) {
    const c = this.h;
    c.e = 6;
    c.g[0] = a;
    c.g[1] = b;
    X(c);
    this.g.lineTo(a, b);
  }
  moveTo(a, b) {
    const c = this.h;
    c.e = 7;
    c.g[0] = a;
    c.g[1] = b;
    X(c);
    this.g.moveTo(a, b);
  }
  quadraticCurveTo(a, b, c, d) {
    const f = this.h;
    f.e = 8;
    f.g[0] = a;
    f.g[1] = b;
    f.g[2] = c;
    f.g[3] = d;
    X(f);
    this.g.quadraticCurveTo(a, b, c, d);
  }
  rect(a, b, c, d) {
    const f = this.h;
    f.e = 9;
    f.g[0] = a;
    f.g[1] = b;
    f.g[2] = c;
    f.g[3] = d;
    X(f);
    this.g.rect(a, b, c, d);
  }
  roundRect(a, b, c, d, f) {
    const e = this.h;
    e.e = 10;
    e.g[0] = a;
    e.g[1] = b;
    e.g[2] = c;
    e.g[3] = d;
    const g = [], h = k => {
      typeof k.x === "number" && g.push(k.x);
      typeof k.y === "number" && g.push(k.y);
    };
    typeof f === "number" ? g.push(f) : Array.isArray(f) ? f.forEach(k => {
      typeof k === "number" ? g.push(k) : h(k);
    }) : f && h(f);
    g.forEach((k, p) => e.j[p] = k);
    X(e);
    this.g.roundRect(a, b, c, d, f);
  }
  addPath(a, b) {
    const c = this.h;
    c.e = 11;
    a = U(a);
    a > -1 ? (c.l[0] = a, b && (c.j[0] = b.a, c.j[1] = b.b, c.j[2] = b.c, c.j[3] = b.d, c.j[4] = b.e, c.j[5] = b.f), X(c)) : console.error(this.addPath.name);
  }
  clearRect(a, b, c, d) {
    const f = this.h;
    f.e = 12;
    f.g[0] = a;
    f.g[1] = b;
    f.g[2] = c;
    f.g[3] = d;
    X(f);
    this.g.clearRect(a, b, c, d);
  }
  fillRect(a, b, c, d) {
    const f = this.h;
    f.e = 13;
    f.g[0] = a;
    f.g[1] = b;
    f.g[2] = c;
    f.g[3] = d;
    X(f);
    this.g.fillRect(a, b, c, d);
  }
  strokeRect(a, b, c, d) {
    const f = this.h;
    f.e = 14;
    f.g[0] = a;
    f.g[1] = b;
    f.g[2] = c;
    f.g[3] = d;
    X(f);
    this.g.strokeRect(a, b, c, d);
  }
  getTransform() {
    return this.g.getTransform();
  }
  resetTransform() {
    const a = this.h;
    a.e = 16;
    X(a);
    this.g.resetTransform();
  }
  rotate(a) {
    const b = this.h;
    b.e = 17;
    b.i[0] = a;
    X(b);
    this.g.rotate(a);
  }
  scale(a, b) {
    const c = this.h;
    c.e = 18;
    c.i[0] = a;
    c.i[1] = b;
    X(c);
    this.g.scale(a, b);
  }
  setTransform(a, b, c, d, f, e) {
    const g = this.h;
    g.e = 19;
    typeof a !== "number" && (b = a.b, c = a.c, d = a.d, f = a.e, e = a.f, a = a.a);
    g.g[0] = a ?? 0;
    g.g[1] = b ?? 0;
    g.g[2] = c ?? 0;
    g.g[3] = d ?? 0;
    g.g[4] = f ?? 0;
    g.g[5] = e ?? 0;
    X(g);
    this.g.setTransform(a, b, c, d, f, e);
  }
  transform(a, b, c, d, f, e) {
    const g = this.h;
    g.e = 20;
    g.g[0] = a;
    g.g[1] = b;
    g.g[2] = c;
    g.g[3] = d;
    g.g[4] = f;
    g.g[5] = e;
    X(g);
    this.g.transform(a, b, c, d, f, e);
  }
  translate(a, b) {
    const c = this.h;
    c.e = 21;
    c.g[0] = a;
    c.g[1] = b;
    X(c);
    this.g.translate(a, b);
  }
  beginPath() {
    const a = this.h;
    a.e = 22;
    X(a);
    this.g.beginPath();
  }
  clip(a, b) {
    const c = this.h;
    c.e = 23;
    let d = U(a);
    d > -1 ? (c.l[0] = d, c.e = 81) : typeof a === "string" && (b = a, a = void 0);
    c.o = Pa(b);
    X(c);
    a && b ? this.g.clip(a, b) : a ? this.g.clip(a) : b ? this.g.clip(b) : this.g.clip();
  }
  fill(a, b) {
    const c = this.h;
    c.e = 24;
    let d = U(a);
    d > -1 ? (console.log("fillpath"), c.l[0] = d, c.e = 82) : typeof a === "string" && (b = a, a = void 0);
    c.o = Pa(b);
    X(c);
    a && b ? this.g.fill(a, b) : a ? this.g.fill(a) : b ? this.g.fill(b) : this.g.fill();
  }
  isPointInPath(a, b, c, d) {
    return a instanceof Path2D ? this.g.isPointInPath(a, b, c, d) : this.g.isPointInPath(a, b, c);
  }
  isPointInStroke(a, b, c) {
    return a instanceof Path2D ? this.g.isPointInStroke(a, b, c) : this.g.isPointInStroke(a, b);
  }
  stroke(a) {
    const b = this.h;
    b.e = 27;
    let c = U(a);
    c > -1 && (b.l[0] = c, b.e = 83);
    X(b);
    a ? this.g.stroke(a) : this.g.stroke();
  }
  get lineCap() {
    return this.g.lineCap;
  }
  set lineCap(a) {
    const b = this.h;
    b.e = 28;
    b.o = Ja(a);
    X(b);
    this.g.lineCap = a;
  }
  get lineDashOffset() {
    return this.g.lineDashOffset;
  }
  set lineDashOffset(a) {
    const b = this.h;
    b.e = 29;
    b.g[0] = a;
    X(b);
    this.g.lineDashOffset = a;
  }
  get lineJoin() {
    return this.g.lineJoin;
  }
  set lineJoin(a) {
    const b = this.h;
    b.e = 30;
    b.o = Ma(a);
    X(b);
    this.g.lineJoin = a;
  }
  get lineWidth() {
    return this.g.lineWidth;
  }
  set lineWidth(a) {
    const b = this.h;
    b.e = 31;
    b.i[0] = a;
    X(b);
    this.g.lineWidth = a;
  }
  get miterLimit() {
    return this.g.miterLimit;
  }
  set miterLimit(a) {
    const b = this.h;
    b.e = 32;
    b.g[0] = a;
    X(b);
    this.g.miterLimit = a;
  }
  getLineDash() {
    return this.g.getLineDash();
  }
  setLineDash(a) {
    const b = this.h;
    b.e = 34;
    this.g.setLineDash(a);
    if (a && a.length) {
      const c = Math.max(...a);
      if (a.length < 256 && c < 256) {
        a.forEach((d, f) => b.v[f] = Math.trunc(d));
      } else {
        throw Error();
      }
    }
    X(b);
    this.g.setLineDash(a);
  }
  drawImage(a, b, c, d, f, e, g, h, k) {
    const p = this.h;
    p.e = 35;
    X(p);
    typeof e === "number" ? this.g.drawImage(a, b, c, d, f, e, g, h, k) : typeof d === "number" ? this.g.drawImage(a, b, c, d, f) : this.g.drawImage(a, b, c);
  }
  createImageData(a, b) {
    return this.g.createImageData(a, b);
  }
  getImageData(a, b, c, d) {
    return this.g.getImageData(a, b, c, d);
  }
  putImageData(a, b, c, d, f, e, g) {
    a = this.h;
    a.e = 38;
    a.g[0] = b;
    a.g[1] = c;
    b = [d, f, e, g];
    for (c = 0; c < b.length; c++) {
      d = b[c];
      if (d === void 0) {
        break;
      }
      a.j[c] = d;
    }
    throw Error();
  }
  isContextLost() {
    return this.g.isContextLost();
  }
  reset() {
    const a = this.h;
    a.e = 40;
    X(a);
    this.g.reset();
  }
  restore() {
    const a = this.h;
    a.e = 41;
    X(a);
    this.g.restore();
  }
  save() {
    const a = this.h;
    a.e = 42;
    X(a);
    this.g.save();
  }
  get fillStyle() {
    return this.g.fillStyle;
  }
  set fillStyle(a) {
    const b = this.h;
    b.e = 43;
    if (typeof a === "string") {
      this.g.fillStyle = a, b.v = C(this.g.fillStyle);
    } else {
      b.e = 84;
      let c = U(a);
      c > -1 && (b.l[0] = c);
      if (a instanceof T || a instanceof ec) {
        this.g.fillStyle = a.g;
      } else {
        throw Error();
      }
    }
    X(b);
  }
  get strokeStyle() {
    return this.g.strokeStyle;
  }
  set strokeStyle(a) {
    const b = this.h;
    b.e = 44;
    if (typeof a === "string") {
      this.g.strokeStyle = a, b.v = C(this.g.strokeStyle);
    } else {
      b.e = 85;
      let c = U(a);
      c >= 0 && (b.l[0] = c);
      if (a instanceof T || a instanceof ec) {
        this.g.fillStyle = a.g;
      } else {
        throw Error();
      }
    }
    X(b);
  }
  createConicGradient(a, b, c) {
    const d = this.g.createConicGradient(a, b, c);
    let f = new T(d);
    f.v = b;
    f.A = c;
    f.F = a;
    return d;
  }
  createLinearGradient(a, b, c, d) {
    const f = this.g.createLinearGradient(a, b, c, d);
    let e = new T(f);
    e.i = a;
    e.j = c;
    e.l = b;
    e.o = d;
    return f;
  }
  createPattern(a, b) {
    var c = this.g.createPattern(a, b ?? "");
    c = new ec(c);
    if (a) {
      a instanceof VideoFrame && console.error("async toImageBuffer VideoFrame");
      a = Ua(a);
      c.data = a.data;
      c.height = a.height;
      c.width = a.width;
      if (b) {
        throw Error();
      }
      c.i = 0;
    }
    return c;
  }
  createRadialGradient(a, b, c, d, f, e) {
    var g = this.g.createRadialGradient(a, b, c, d, f, e);
    g = new T(g);
    g.i = a;
    g.j = d;
    g.l = b;
    g.o = f;
    g.C = c;
    g.G = e;
    return g;
  }
  get filter() {
    return this.g.filter;
  }
  set filter(a) {
    const b = this.h;
    b.e = 49;
    console.error("implemntar filter", a);
    X(b);
    this.g.filter = a;
  }
  get globalAlpha() {
    return this.g.globalAlpha;
  }
  set globalAlpha(a) {
    const b = this.h;
    b.e = 50;
    b.v[0] = Math.trunc(a * 255);
    X(b);
    this.g.globalAlpha = a;
  }
  get globalCompositeOperation() {
    return this.g.globalCompositeOperation;
  }
  set globalCompositeOperation(a) {
    const b = this.h;
    b.e = 51;
    b.o = Ga(a);
    X(b);
    this.g.globalCompositeOperation = a;
  }
  get shadowBlur() {
    return this.g.shadowBlur;
  }
  set shadowBlur(a) {
    const b = this.h;
    b.e = 55;
    b.g[0] = a;
    X(b);
    this.g.shadowBlur = a;
  }
  get shadowColor() {
    return this.g.shadowColor;
  }
  set shadowColor(a) {
    const b = this.h;
    b.e = 57;
    this.g.shadowColor = a;
    b.v = C(this.g.shadowColor);
    X(b);
  }
  get shadowOffsetX() {
    return this.g.shadowOffsetX;
  }
  set shadowOffsetX(a) {
    const b = this.h;
    b.e = 57;
    b.g[0] = a;
    X(b);
    this.g.shadowOffsetX = a;
  }
  get shadowOffsetY() {
    return this.g.shadowOffsetY;
  }
  set shadowOffsetY(a) {
    const b = this.h;
    b.e = 58;
    b.g[0] = a;
    X(b);
    this.g.shadowOffsetY = a;
  }
  fillText(a, b, c, d) {
    const f = this.h;
    f.e = 59;
    X(f);
    this.g.fillText(a, b, c, d);
  }
  strokeText(a, b, c, d) {
    const f = this.h;
    f.e = 61;
    X(f);
    this.g.strokeText(a, b, c, d);
  }
  measureText(a) {
    return this.g.measureText(a);
  }
  get direction() {
    return this.g.direction;
  }
  set direction(a) {
    const b = this.h;
    b.e = 62;
    X(b);
    this.g.direction = a;
  }
  get font() {
    return this.g.font;
  }
  set font(a) {
    const b = this.h;
    b.e = 63;
    X(b);
    this.g.font = a;
  }
  get fontKerning() {
    return this.g.fontKerning;
  }
  set fontKerning(a) {
    const b = this.h;
    b.e = 64;
    X(b);
    this.g.fontKerning = a;
  }
  get fontStretch() {
    return this.g.fontStretch;
  }
  set fontStretch(a) {
    const b = this.h;
    b.e = 65;
    X(b);
    this.g.fontStretch = a;
  }
  get fontVariantCaps() {
    return this.g.fontVariantCaps;
  }
  set fontVariantCaps(a) {
    const b = this.h;
    b.e = 66;
    X(b);
    this.g.fontVariantCaps = a;
  }
  get letterSpacing() {
    return this.g.letterSpacing;
  }
  set letterSpacing(a) {
    const b = this.h;
    b.e = 67;
    X(b);
    this.g.letterSpacing = a;
  }
  get textAlign() {
    return this.g.textAlign;
  }
  set textAlign(a) {
    const b = this.h;
    b.e = 68;
    X(b);
    this.g.textAlign = a;
  }
  get textBaseline() {
    return this.g.textBaseline;
  }
  set textBaseline(a) {
    const b = this.h;
    b.e = 69;
    X(b);
    this.g.textBaseline = a;
  }
  get textRendering() {
    return this.g.textRendering;
  }
  set textRendering(a) {
    const b = this.h;
    b.e = 70;
    X(b);
    this.g.textRendering = a;
  }
  get wordSpacing() {
    return this.g.wordSpacing;
  }
  set wordSpacing(a) {
    const b = this.h;
    b.e = 71;
    X(b);
    this.g.wordSpacing = a;
  }
  Da() {
    const a = this.h;
    a.e = 80;
    X(a);
  }
}
;function jc(a, b, c, d, f, e, g) {
  var h = kc ||= {}, k = lc ||= {}, p = mc ||= {}, l = nc ||= {}, m = oc ||= {}, u = pc ||= {}, r = qc ||= {};
  const w = rc ||= {};
  Y ||= 1;
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
      return e = d.getFloat64(c, !0) | 0, c = g(d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0), d = a.createShader(e), a.shaderSource(d, c), a.compileShader(d), a.getShaderParameter(d, a.COMPILE_STATUS) || console.error("[egl] shader:", a.getShaderInfoLog(d)), a = Y++, h[a] = d, a;
    case 11:
      return e = h[d.getFloat64(c, !0) | 0], d = h[d.getFloat64(c + 8, !0) | 0], c = a.createProgram(), a.attachShader(c, e), a.attachShader(c, d), a.linkProgram(c), a.getProgramParameter(c, a.LINK_STATUS) || console.error("[egl] link:", a.getProgramInfoLog(c)), a = Y++, k[a] = c, a;
    case 12:
      a.useProgram(k[d.getFloat64(c, !0) | 0] || null);
      break;
    case 13:
      return e = k[d.getFloat64(c, !0) | 0], c = g(d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0), a.getAttribLocation(e, c);
    case 14:
      return e = k[d.getFloat64(c, !0) | 0], c = g(d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0), a = a.getUniformLocation(e, c), c = Y++, m[c] = a, c;
    case 20:
      return a = a.createVertexArray(), c = Y++, p[c] = a, c;
    case 21:
      a.bindVertexArray(d.getFloat64(c, !0) ? p[d.getFloat64(c, !0) | 0] : null);
      break;
    case 22:
      return a = a.createBuffer(), c = Y++, l[c] = a, c;
    case 23:
      a.bindBuffer(d.getFloat64(c, !0) | 0, l[d.getFloat64(c + 8, !0) | 0] || null);
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
      a.uniform1f(m[d.getFloat64(c, !0) | 0], d.getFloat64(c + 8, !0));
      break;
    case 33:
      a.uniform2f(m[d.getFloat64(c, !0) | 0], d.getFloat64(c + 8, !0), d.getFloat64(c + 16, !0));
      break;
    case 34:
      a.uniform3f(m[d.getFloat64(c, !0) | 0], d.getFloat64(c + 8, !0), d.getFloat64(c + 16, !0), d.getFloat64(c + 24, !0));
      break;
    case 35:
      a.uniform4f(m[d.getFloat64(c, !0) | 0], d.getFloat64(c + 8, !0), d.getFloat64(c + 16, !0), d.getFloat64(c + 24, !0), d.getFloat64(c + 32, !0));
      break;
    case 36:
      a.uniform1i(m[d.getFloat64(c, !0) | 0], d.getFloat64(c + 8, !0) | 0);
      break;
    case 30:
      a.uniformMatrix3fv(m[d.getFloat64(c, !0) | 0], !1, f, (d.getFloat64(c + 8, !0) | 0) >> 2, 9);
      break;
    case 37:
      a.uniformMatrix4fv(m[d.getFloat64(c, !0) | 0], !1, f, (d.getFloat64(c + 8, !0) | 0) >> 2, 16);
      break;
    case 31:
      a.uniform4fv(m[d.getFloat64(c, !0) | 0], f, (d.getFloat64(c + 8, !0) | 0) >> 2, 4);
      break;
    case 46:
      a.uniform1fv(m[d.getFloat64(c, !0) | 0], f, (d.getFloat64(c + 8, !0) | 0) >> 2, d.getFloat64(c + 16, !0) | 0);
      break;
    case 47:
      a.uniform2fv(m[d.getFloat64(c, !0) | 0], f, (d.getFloat64(c + 8, !0) | 0) >> 2, d.getFloat64(c + 16, !0) | 0);
      break;
    case 56:
      a.uniform3fv(m[d.getFloat64(c, !0) | 0], f, (d.getFloat64(c + 8, !0) | 0) >> 2, d.getFloat64(c + 16, !0) | 0);
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
      return a = a.createTexture(), c = Y++, u[c] = a, c;
    case 51:
      a.bindTexture(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) ? u[d.getFloat64(c + 8, !0) | 0] : null);
      break;
    case 52:
      a.texParameteri(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0);
      break;
    case 53:
      h = d.getFloat64(c, !0) | 0;
      k = d.getFloat64(c + 8, !0) | 0;
      m = d.getFloat64(c + 16, !0) | 0;
      g = d.getFloat64(c + 24, !0) | 0;
      p = d.getFloat64(c + 32, !0) | 0;
      l = d.getFloat64(c + 40, !0) | 0;
      u = d.getFloat64(c + 48, !0) | 0;
      r = d.getFloat64(c + 56, !0) | 0;
      (c = d.getFloat64(c + 64, !0) | 0) ? a.texImage2D(h, k, m, g, p, l, u, r, e, c) : a.texImage2D(h, k, m, g, p, l, u, r, null);
      break;
    case 54:
      h = d.getFloat64(c, !0) | 0;
      k = d.getFloat64(c + 8, !0) | 0;
      m = d.getFloat64(c + 16, !0) | 0;
      g = d.getFloat64(c + 24, !0) | 0;
      p = d.getFloat64(c + 32, !0) | 0;
      l = d.getFloat64(c + 40, !0) | 0;
      u = d.getFloat64(c + 48, !0) | 0;
      r = d.getFloat64(c + 56, !0) | 0;
      c = d.getFloat64(c + 64, !0) | 0;
      a.texSubImage2D(h, k, m, g, p, l, u, r, e, c);
      break;
    case 55:
      a.activeTexture(d.getFloat64(c, !0) | 0);
      break;
    case 57:
      a.generateMipmap(d.getFloat64(c, !0) | 0);
      break;
    case 60:
      return a = a.createFramebuffer(), c = Y++, r[c] = a, c;
    case 61:
      a.bindFramebuffer(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) ? r[d.getFloat64(c + 8, !0) | 0] : null);
      break;
    case 62:
      a.framebufferTexture2D(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, u[d.getFloat64(c + 24, !0) | 0], d.getFloat64(c + 32, !0) | 0);
      break;
    case 63:
      return a = a.createRenderbuffer(), c = Y++, w[c] = a, c;
    case 64:
      a.bindRenderbuffer(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) ? w[d.getFloat64(c + 8, !0) | 0] : null);
      break;
    case 65:
      a.renderbufferStorage(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, d.getFloat64(c + 24, !0) | 0);
      break;
    case 66:
      a.framebufferRenderbuffer(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, w[d.getFloat64(c + 24, !0) | 0]);
      break;
    case 70:
      if (e = l[d.getFloat64(c, !0) | 0]) {
        a.deleteBuffer(e), delete l[d.getFloat64(c, !0) | 0];
      }
      break;
    case 71:
      if (e = p[d.getFloat64(c, !0) | 0]) {
        a.deleteVertexArray(e), delete p[d.getFloat64(c, !0) | 0];
      }
      break;
    case 72:
      if (e = u[d.getFloat64(c, !0) | 0]) {
        a.deleteTexture(e), delete u[d.getFloat64(c, !0) | 0];
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
      if (e = r[d.getFloat64(c, !0) | 0]) {
        a.deleteFramebuffer(e), delete r[d.getFloat64(c, !0) | 0];
      }
      break;
    case 76:
      if (e = w[d.getFloat64(c, !0) | 0]) {
        a.deleteRenderbuffer(e), delete w[d.getFloat64(c, !0) | 0];
      }
      break;
    default:
      console.warn("[egl] unknown cmd", b);
  }
  return 0;
}
var kc, lc, mc, nc, oc, pc, qc, rc, Y;
function sc(a, b, c) {
  a.g.g[a.i] = [b, ...c];
  a.g.F(a.j(), 4, a.i, a.h);
}
class tc {
  constructor(a, b, c, d) {
    this.g = a;
    this.i = b;
    this.h = c;
    this.j = d;
  }
  create(a, b, c) {
    sc(this, 0, [a, b, c || ""]);
    return this.g.g[this.h];
  }
  close(a) {
    sc(this, 3, [a]);
  }
  read(a, b, c) {
    sc(this, 4, [a, b, c]);
    return this.g.g[this.h];
  }
  info(a) {
    sc(this, 12, [a]);
    return this.g.g[this.h];
  }
}
;function uc(a, b) {
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
        for (let d = 0; d < b; d++) {
          c === 0 ? a += d : c === 1 ? a -= d : c === 2 ? a *= 1.001 : c === 3 ? a = Math.sqrt(Math.abs(a)) + d : c === 4 ? a = Math.sin(d) + a : c === 5 && (a = a % 1000000 + d);
        }
      }
      return a;
    case 3:
      a = 0;
      for (c = 0; c < b; c++) {
        a += c, a -= c, a *= 1.001, a = Math.sqrt(Math.abs(a)) + c, a = Math.sin(c) + a, a = a % 1000000 + c;
      }
      return a;
    default:
      return 0;
  }
}
;var vc = A({Xa:1, cb:2, Za:3, sheet:4, bb:5});
function wc(a) {
  a.width = a.h.width = a.h.offsetWidth;
  a.height = a.h.height = a.h.offsetHeight;
}
function xc(a, b, c) {
  a.size = b;
  a.G = c;
  a.A = a.g.h;
  b && (a.o = a.g.h.subarray(c, c + a.size), b = new Uint8ClampedArray(a.o), a.J = new ImageData(b, a.width, a.height));
}
function yc(a, b) {
  if (a.g.h != a.A || a.G !== b) {
    a.A = a.g.h, a.o = a.g.h.subarray(b, b + a.size);
  }
  a.J.data.set(a.o);
  a.H.putImageData(a.J, 0, 0);
}
function zc(a, b, c, d, f, e, g) {
  (async() => {
    try {
      let h = new Uint8ClampedArray(a.g.h.subarray(b, b + c)), k = new ImageData(h, d, f);
      a.g.g[e] = await createImageBitmap(k);
      a.g.v(g, 1);
    } catch (h) {
      a.g.g[e] = h, a.g.v(g, 0);
    }
  })();
}
class Ac {
  constructor(a, b, c, d) {
    this.g = a;
    this.i = c;
    this.F = d || 0;
    this.h = b;
    this.F === 2 ? this.I = b.getContext("webgl2", {alpha:!0, premultipliedAlpha:!1, antialias:!0, preserveDrawingBuffer:!0}) : this.H = B(b);
    this.G = this.size = 0;
    a = b.offsetWidth;
    c = b.offsetHeight;
    b.width = a;
    b.height = c;
    this.width = a;
    this.height = c;
    wc(this);
    const f = (e, g) => this.g.U.decode(this.g.h.subarray(e, e + g));
    this.L = [(e, g) => xc(this, e, g), () => {
      window.requestAnimationFrame(this.v.bind(this));
    }, e => {
      (this.h ?? document.body).style.cursor = lb[e] ?? "default";
    }, e => yc(this, e), (e, g) => {
      cc(this.O.h, this.g.buffer, e, g);
      throw Error("DESATUALIZADO");
    }, (...e) => {
      var g = this.H, h = e[e.length - 1];
      e = e.slice(0, -1);
      var k = this.g.g;
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
          (e = Qa(e[0])) ? g.clip(e) : g.clip();
          break;
        case 81:
          console.warn("play clip path");
          break;
        case 24:
          (e = Qa(e[0])) ? g.fill(e) : g.fill();
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
          g.lineCap = Ka(e[0]);
          break;
        case 29:
          g.lineDashOffset = e[0];
          break;
        case 30:
          g.lineJoin = Na(e[0]);
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
          (h = k?.[e[0] | 0]) && g.drawImage(h, e[1], e[2]);
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
          g.fillStyle = Wa(e[0]);
          break;
        case 84:
          break;
        case 44:
          g.strokeStyle = Wa(e[0]);
          break;
        case 85:
          console.warn("play strokeStyle2");
          break;
        case 50:
          g.globalAlpha = e[0];
          break;
        case 51:
          g.globalCompositeOperation = Ha(e[0]);
          break;
        case 55:
          g.shadowBlur = e[0];
          break;
        case 56:
          g.shadowColor = Wa(e[0]);
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
          console.warn(e, "FALTA FAZER", Ea(h), h);
      }
    }, (e, g, h, k, p, l) => zc(this, e, g, h, k, p, l), (e, g) => jc(this.I, g, e, this.g.view, this.N, this.g.h, f)];
    this.K = this.g.H();
    this.g.g[this.K] = this.L;
    this.O = new hc();
    window.addEventListener("resize", this.C.bind(this));
    this.C();
    b.style.pointerEvents !== "none" && (window.requestAnimationFrame(this.v.bind(this)), Bc(this), Cc(this));
  }
  C() {
    wc(this);
    this.j = this.g.j(6, this.i, this.width, this.height, this.F, this.K);
    let a = this.g.view.getInt32(this.j, !0), b = this.g.view.getInt32(this.j + 4, !0);
    xc(this, a, b);
  }
  get U() {
    return !!this.g.view.getInt32(this.j + 8, !0);
  }
  get N() {
    this.l && this.l.buffer === this.g.buffer || (this.l = new Float32Array(this.g.buffer));
    return this.l;
  }
  v(a) {
    (a = this.g.j(7, this.i, 0, 0, 0, a)) && yc(this, a);
    this.U && window.requestAnimationFrame(this.v.bind(this));
  }
}
var Bc = a => {
  function b(c) {
    let d = c.buttons ?? (c.button !== void 0 ? 1 << c.button : 0);
    c.ctrlKey && (d |= 256);
    c.shiftKey && (d |= 512);
    c.altKey && (d |= 1024);
    return d;
  }
  a.h.addEventListener("mousedown", c => {
    a.g.j(0, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  a.h.addEventListener("mouseup", c => {
    a.g.j(1, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  a.h.addEventListener("mousemove", c => {
    a.g.j(2, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  a.h.addEventListener("wheel", c => {
    a.g.j(3, a.i, c.offsetX, c.offsetY, b(c), c.deltaY);
  }, {passive:!0});
  a.h.addEventListener("contextmenu", c => {
    c.preventDefault();
    a.g.j(12, a.i, c.offsetX, c.offsetY, b(c), Math.round(c.clientX) * 100000 + Math.round(c.clientY));
  });
  a.h.addEventListener("mouseenter", c => {
    a.g.j(4, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  a.h.addEventListener("mouseleave", c => {
    a.g.j(5, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  document.addEventListener("keydown", c => {
    let d = 0;
    c.ctrlKey && (d |= 256);
    c.shiftKey && (d |= 512);
    c.altKey && (d |= 1024);
    a.g.j(9, a.i, 0, 0, c.keyCode | d, 0);
  });
}, Cc = a => {
  const b = a.g.H(), c = a.g.H(), d = a.g, f = d.view.getInt32(a.j + 20, !0);
  a = {};
  a[vc(1)] = () => {
    d.F(f, 1, b, c);
    return d.g[c];
  };
  a[vc(2)] = e => {
    d.g[b] = e;
    d.F(f, 2, b, c);
    return d.g[c];
  };
  a[vc(3)] = (e, g, h) => {
    d.g[b] = [e, g, h];
    d.F(f, 3, b, c);
    (g = d.g[c]) && g !== 0 && (e = g[0], g = new Uint8Array(d.h.slice(e, e + g[1])), g = URL.createObjectURL(new Blob([g], {type:"application/pdf"})), h = document.createElement("a"), h.href = g, h.download = "render.pdf", h.click(), URL.revokeObjectURL(g), d.C(e));
  };
  a.sheet = new tc(d, b, c, () => f);
  a.testp = (e, g) => {
    d.g[b] = [g, e];
    const h = performance.now();
    d.F(f, 5, b, c);
    console.log(({1:"Linear", 2:"If-chain", 3:"Vtable"}[g] || "test_" + g) + "  rep=" + e + "  WASM=" + (performance.now() - h).toFixed(2) + "ms  JS=" + (performance.now() - performance.now()).toFixed(2) + "ms  chk_w=" + d.g[c] + "  chk_j=" + uc(g, e));
  };
  window.wasm_fn = a;
};
async function Dc(a, b, c, d) {
  if (c) {
    var f = B(b), e = B(c);
    await (new ia("stg.mandala")).init();
    c.width = b.width = b.offsetWidth;
    c.height = b.height = b.offsetHeight;
    new ic();
    await $b(a);
    var g = 0;
    new Ac(a, b, g++);
    new Ac(a, c, g++);
    d && (c = new Ac(a, d, g++, 2), window.glctx = c.I);
    window.ctx1 = f;
    window.canvas = b;
    window.ctx2 = e;
    window.mem = a.g;
  }
}
;const Ec = {[0]:"RECT", [1]:"ELLIPSE", [2]:"LINE", [3]:"SHAPE"};
function Fc(a) {
  return new Gc(a.g, a.i, a.h);
}
function Z(a) {
  const b = a.g.view;
  var c = a.h;
  a = b.getInt32(c + 16, !0);
  c = b.getInt32(c + 20, !0);
  const d = [];
  for (let f = 0; f < c; f++) {
    const e = a + f * 72;
    d.push({origin:b.getInt32(e, !0), selected:b.getInt32(e + 4, !0), Ja:b.getInt32(e + 8, !0), box:[b.getFloat64(e + 16, !0), b.getFloat64(e + 16 + 8, !0), b.getFloat64(e + 16 + 16, !0), b.getFloat64(e + 16 + 24, !0)], fill:b.getInt32(e + 48, !0), stroke:b.getInt32(e + 52, !0), lineWidth:b.getFloat32(e + 56, !0), flags:b.getInt32(e + 60, !0), Ca:b.getInt32(e + 12, !0), depth:b.getInt16(e + 64, !0), Ga:b.getInt16(e + 66, !0)});
  }
  return d;
}
function Hc(a, b, c) {
  M(a, b);
  N(a, c);
  a.notify(9);
}
class Gc extends Sb {
}
;function Ic(a) {
  return a.replace(/[A-Z]/g, b => "-" + b.toLowerCase());
}
class Jc {
  constructor() {
    this.g = [];
  }
  add(a, b) {
    b = Object.entries(b);
    let c = "";
    for (let d = 0; d < b.length; d++) {
      c += Ic(b[d][0]) + ":" + b[d][1] + ";";
    }
    this.g.push(a + "{" + c + "}");
    return this;
  }
  toString() {
    return this.g.join("");
  }
}
;const Kc = (new Jc()).add(".sidebar-scroll::-webkit-scrollbar", {width:"12px"}).add(".sidebar-scroll::-webkit-scrollbar-track", {background:"transparent"}).add(".sidebar-scroll::-webkit-scrollbar-thumb", {background:"rgba(255,255,255,0.2)"}).add(".sidebar-scroll::-webkit-scrollbar-thumb:hover", {background:"rgba(255,255,255,0.4)"}).add(".section-sash", {background:"transparent", transition:"background 0.15s"}).add(".section-sash:hover", {background:"#007fd4"}).add("input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button", 
{WebkitAppearance:"none", margin:"0"}).add("input[type=number]", {MozAppearance:"textfield"}).toString(), Lc = {backgroundColor:"#2a2a2a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", padding:"2px 4px", fontSize:"11px", outline:"none", fontFamily:"monospace", width:"0"}, Mc = {backgroundColor:"#2a2a2a", color:"#aaa", border:"1px solid #555", borderRadius:"2px", padding:"1px 2px", fontSize:"9px", outline:"none", cursor:"pointer", flexShrink:"0"};
function Nc(a) {
  const b = a.g.state, c = b.wa.trim();
  c && !b.M.some(d => d.name === c) && (b.M.push({name:c, value:"", type:"text"}), b.wa = "", a.g.refresh());
}
function Oc(a, b, c, d) {
  a = a.g.state.M[b];
  d = d.currentTarget.value;
  var f = a.value.split(" ");
  b = f[0] || "";
  var e = (f[1] || "00:00").split(":");
  f = e[0] || "00";
  e = e[1] || "00";
  c === "h" ? f = d.padStart(2, "0") : e = d.padStart(2, "0");
  a.value = b + " " + f + ":" + e;
}
function Pc(a, b) {
  var c = a.g.state;
  const d = c.ha, f = c.T;
  var e = (new Date(d, f, 1)).getDay(), g = (new Date(d, f + 1, 0)).getDate();
  c = c.M[b];
  var h = -1;
  if (c.value) {
    var k = c.value.split("-");
    if (k.length >= 3) {
      var p = parseInt(k[1], 10) - 1, l = parseInt(k[2], 10);
      parseInt(k[0], 10) === d && p === f && (h = l);
    }
  }
  k = [];
  p = [];
  for (l = 0; l < e; l++) {
    p.push(L("td", {style:{width:"22px", height:"20px"}}));
  }
  for (l = 1; l <= g; l++) {
    const m = l, u = m === h;
    p.push(L("td", {onClick:() => {
      var r = a.g.state;
      const w = r.ha + "-" + String(r.T + 1).padStart(2, "0") + "-" + String(m).padStart(2, "0");
      r = r.M[b];
      if (r.type === "datetime") {
        const z = r.value;
        r.value = w + (z && z.indexOf(" ") >= 0 ? z.substring(z.indexOf(" ")) : " 00:00");
      } else {
        r.value = w;
      }
      a.g.refresh();
    }, style:{width:"22px", height:"20px", textAlign:"center", cursor:"pointer", backgroundColor:u ? "#007fd4" : "transparent", color:u ? "#fff" : "#ccc", borderRadius:"2px", fontSize:"11px"}}, String(m)));
    (e + l) % 7 === 0 && (k.push(L("tr", null, p)), p = []);
  }
  if (p.length > 0) {
    for (; p.length < 7;) {
      p.push(L("td", {style:{width:"22px", height:"20px"}}));
    }
    k.push(L("tr", null, p));
  }
  e = c.type === "datetime";
  g = c.value && c.value.indexOf(" ") >= 0 ? c.value.split(" ")[1].split(":") : ["00", "00"];
  c = {cursor:"pointer", padding:"0 4px", color:"#6af", userSelect:"none"};
  h = {width:"30px", textAlign:"center", backgroundColor:"#2a2a2a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", padding:"1px 2px", fontSize:"11px", outline:"none"};
  return L("div", {style:{backgroundColor:"#252526", border:"1px solid #555", borderRadius:"4px", padding:"6px", marginTop:"4px", marginBottom:"4px"}}, L("div", {style:{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"4px", fontSize:"11px", color:"#e0e0e0"}}, L("span", {onClick:() => {
    const m = a.g.state;
    m.T--;
    m.T < 0 && (m.T = 11, m.ha--);
    a.g.refresh();
  }, style:c}, "\u25c0"), L("span", null, "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ")[f] + " " + d), L("span", {onClick:() => {
    const m = a.g.state;
    m.T++;
    m.T > 11 && (m.T = 0, m.ha++);
    a.g.refresh();
  }, style:c}, "\u25b6")), L("table", {style:{borderCollapse:"collapse", width:"100%"}}, L("thead", null, L("tr", null, "Su Mo Tu We Th Fr Sa".split(" ").map(m => L("th", {style:{width:"22px", fontSize:"10px", color:"#888", fontWeight:"normal", textAlign:"center", paddingBottom:"2px"}}, m)))), L("tbody", null, k)), e ? L("div", {style:{display:"flex", alignItems:"center", gap:"4px", marginTop:"6px", justifyContent:"center"}}, L("input", {type:"number", min:"0", max:"23", value:g[0], onInput:m => 
  Oc(a, b, "h", m), style:h}), L("span", {style:{color:"#888"}}, ":"), L("input", {type:"number", min:"0", max:"59", value:g[1], onInput:m => Oc(a, b, "m", m), style:h})) : null);
}
class Qc extends Nb.g {
  constructor(a) {
    super(a);
    this.g = a;
  }
  render() {
    const a = this.g.state;
    return L("div", {style:{fontSize:"11px"}}, L("div", {style:{display:"flex", gap:"4px", marginBottom:"6px", paddingLeft:"4px"}}, L("input", {type:"text", value:a.wa, onInput:b => {
      this.g.state.wa = b.currentTarget.value;
    }, onKeyDown:b => {
      b.key === "Enter" && Nc(this);
    }, placeholder:"name", style:{...Lc, flex:"1"}}), L("button", {onClick:() => Nc(this), style:{padding:"2px 8px", fontSize:"13px", cursor:"pointer", backgroundColor:"#3a3a3a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", lineHeight:"1"}}, "+")), a.M.map((b, c) => L("div", null, L("div", {style:{display:"flex", alignItems:"center", gap:"4px", marginBottom:"2px", paddingLeft:"4px"}}, L("span", {style:{color:"#9cdcfe", fontFamily:"monospace", fontSize:"11px", width:"20ch", minWidth:"20ch", 
    overflow:"hidden", textOverflow:"ellipsis", flexShrink:"0"}}, b.name), L("select", {onInput:d => {
      const f = this.g.state;
      f.M[c].type = d.currentTarget.value;
      f.M[c].value = "";
      f.S === c && (f.S = -1);
      this.g.refresh();
    }, style:Mc}, L("option", {value:"text", selected:b.type === "text"}, "text"), L("option", {value:"int", selected:b.type === "int"}, "int"), L("option", {value:"double", selected:b.type === "double"}, "double"), L("option", {value:"date", selected:b.type === "date"}, "date"), L("option", {value:"datetime", selected:b.type === "datetime"}, "datetime")), b.type === "int" || b.type === "double" ? L("input", {type:"number", step:b.type === "int" ? "1" : "any", value:b.value, onInput:d => {
      this.g.state.M[c].value = d.currentTarget.value;
    }, style:{...Lc, width:"55px", flex:"0 0 auto"}}) : b.type === "date" || b.type === "datetime" ? L("span", {onClick:() => {
      const d = this.g.state;
      if (d.S === c) {
        d.S = -1;
      } else {
        d.S = c;
        var f = d.M[c].value;
        f ? (f = f.split("-"), f.length >= 3 && (d.ha = parseInt(f[0], 10) || (new Date()).getFullYear(), d.T = (parseInt(f[1], 10) || 1) - 1)) : (d.ha = (new Date()).getFullYear(), d.T = (new Date()).getMonth());
      }
      this.g.refresh();
    }, style:{cursor:"pointer", color:b.value ? "#e0e0e0" : "#666", fontFamily:"monospace", fontSize:"10px", padding:"1px 4px", backgroundColor:"#2a2a2a", border:"1px solid #555", borderRadius:"2px", flex:"1", textAlign:"center", minWidth:"0", overflow:"hidden", textOverflow:"ellipsis"}}, b.value || (b.type === "date" ? "select date" : "select date/time")) : L("input", {type:"text", value:b.value, onInput:d => {
      this.g.state.M[c].value = d.currentTarget.value;
    }, style:{...Lc, flex:"1"}}), L("span", {onClick:() => {
      const d = this.g.state;
      d.S === c ? d.S = -1 : d.S > c && d.S--;
      d.M.splice(c, 1);
      this.g.refresh();
    }, style:{cursor:"pointer", color:"#888", fontSize:"13px", padding:"0 2px", flexShrink:"0"}}, "\u00d7")), a.S === c ? Pc(this, c) : null)));
  }
}
;function Rc(a) {
  const b = a.g.state;
  b.fa = -1;
  b.aa = -1;
  b.V = null;
  a.g.refresh();
}
function Sc(a, b, c) {
  const d = a.g.state, f = Ec[b.Ja] || "SHAPE", e = Math.round(b.box[0]), g = Math.round(b.box[1]), h = Math.round(b.box[2] - b.box[0]), k = Math.round(b.box[3] - b.box[1]), p = d.aa === c, l = p && d.V === "inside";
  return L("div", {draggable:"true", onDragStart:m => a.onDragStart(m, c), onDragOver:m => a.onDragOver(m, c), onDrop:m => a.onDrop(m, c), onDragEnd:() => a.onDragEnd(), onClick:m => {
    var u = a.g.u;
    m = m.ctrlKey ? 1 : 0;
    M(u, c);
    N(u, m);
    u.notify(3);
  }, onContextMenu:m => a.onContextMenu(c, m), style:{padding:"3px 6px", paddingLeft:(b.depth || 0) * 16 + 6 + "px", cursor:"grab", backgroundColor:b.selected ? "#3a5f8a" : l ? "#2a3a4a" : "transparent", borderRadius:"2px", marginBottom:"1px", borderTop:p && d.V === "above" ? "2px solid #6af" : "2px solid transparent", borderBottom:p && d.V === "below" ? "2px solid #6af" : "2px solid transparent"}}, (b.Ga || 0) > 0 ? L("span", {style:{color:"#8cf"}}, "<" + f + "> [" + b.Ga + "]") : "<" + f + " x:" + 
  e + ",y:" + g + ",w:" + h + ",h:" + k + ">");
}
class Tc extends Nb.g {
  constructor(a) {
    super(a);
    this.g = a;
  }
  onDragStart(a, b) {
    this.g.state.fa = b;
    a.dataTransfer.effectAllowed = "move";
  }
  onDragOver(a, b) {
    a.preventDefault();
    const c = this.g.state;
    var d = a.currentTarget.getBoundingClientRect();
    a = a.clientY - d.top;
    d = d.height;
    d = a < d * 0.25 ? "above" : a > d * 0.75 ? "below" : "inside";
    if (c.aa !== b || c.V !== d) {
      c.aa = b, c.V = d, this.g.refresh();
    }
  }
  onDrop(a, b) {
    a.preventDefault();
    a = this.g.state;
    if (a.fa >= 0 && a.fa !== b) {
      if (a.V === "inside") {
        var c = this.g.u;
        M(c, a.fa);
        N(c, b);
        c.notify(16);
      } else {
        c = this.g.u;
        var d = a.V === "below";
        M(c, a.fa);
        N(c, b + (d ? 0.5 : 0));
        c.notify(4);
        a = this.g.u;
        M(a, b);
        N(a, 0);
        a.notify(3);
      }
    }
    Rc(this);
  }
  onDragEnd() {
    Rc(this);
  }
  onContextMenu(a, b) {
    b.preventDefault();
    b.stopPropagation();
    M(this.g.u, a);
    N(this.g.u, Math.round(b.clientX) * 100000 + Math.round(b.clientY));
    this.g.u.notify(11);
  }
  render() {
    const a = this.g.state, b = this.g.Ka, c = b.length, d = [], f = [];
    for (var e = 0; e < c;) {
      var g = e;
      const h = b[e].depth || 0;
      for (e++; e < c && (b[e].depth || 0) > h;) {
        e++;
      }
      f.push([g, e]);
    }
    for (e = f.length - 1; e >= 0; e--) {
      for (g = f[e][0]; g < f[e][1]; g++) {
        d.push(g);
      }
    }
    return L("div", {style:{fontFamily:"monospace", fontSize:"12px"}}, d.map(h => Sc(this, b[h], h)), c > 0 ? L("div", {onDragOver:h => {
      h.preventDefault();
      a.aa !== -2 && (a.aa = -2, a.V = "below", this.g.refresh());
    }, onDrop:h => this.onDrop(h, 0), style:{height:"12px", borderTop:a.aa === -2 ? "2px solid #6af" : "2px solid transparent"}}) : null);
  }
}
;class Uc extends Nb.g {
  constructor(a) {
    super(a);
    this.g = a;
  }
  onClick() {
    this.g.state.count++;
    this.g.refresh();
  }
  render() {
    const a = this.g.state;
    return L("div", null, L("button", {onClick:() => this.onClick(), style:{padding:"6px 12px", fontSize:"12px", cursor:"pointer", backgroundColor:"#4CAF50", color:"white", border:"none", borderRadius:"3px"}}, "HELLO WORLD"), L("div", {style:{marginTop:"8px", fontSize:"12px", fontWeight:"bold", color:"#e0e0e0"}}, "COUNT : " + a.count));
  }
}
;function Vc(a, b) {
  return a.h.find(c => c.key === b) || null;
}
function Wc(a, b) {
  a.i && (b.preventDefault(), a.da = b.clientX, a.ea = b.clientY, a.ba = a.o, a.ca = a.$, a.I = c => {
    const d = c.clientX - a.da;
    c = c.clientY - a.ea;
    const f = document.getElementById("ploft-sidebar");
    f && (f.style.left = a.ba + d + "px", f.style.top = a.ca + c + "px");
  }, a.J = c => {
    a.o = a.ba + (c.clientX - a.da);
    a.$ = a.ca + (c.clientY - a.ea);
    document.removeEventListener("mousemove", a.I);
    document.removeEventListener("mouseup", a.J);
    a.I = null;
    a.J = null;
    a.refresh();
  }, document.addEventListener("mousemove", a.I), document.addEventListener("mouseup", a.J));
}
function Xc(a, b, c) {
  b.preventDefault();
  b.stopPropagation();
  a.ja = c;
  a.la = b.clientX;
  a.ma = b.clientY;
  a.j = a.C;
  a.F = a.A;
  a.ka = a.o;
  a.K = d => {
    var f = d.clientX - a.la;
    const e = d.clientY - a.ma;
    if (d = document.getElementById("ploft-sidebar")) {
      var g = a.ja;
      g === "left" ? (f = Math.max(200, a.j - f), d.style.width = f + "px", a.i && (d.style.left = a.ka + (a.j - f) + "px")) : g === "right" ? d.style.width = Math.max(200, a.j + f) + "px" : g === "bottom" ? d.style.height = Math.max(150, a.F + e) + "px" : g === "corner-br" && (d.style.width = Math.max(200, a.j + f) + "px", d.style.height = Math.max(150, a.F + e) + "px");
    }
  };
  a.L = d => {
    var f = d.clientX - a.la;
    d = d.clientY - a.ma;
    const e = a.ja;
    e === "left" ? (f = Math.max(200, a.j - f), a.C = f, a.i && (a.o = a.ka + (a.j - f))) : e === "right" ? a.C = Math.max(200, a.j + f) : e === "bottom" ? a.A = Math.max(150, a.F + d) : e === "corner-br" && (a.C = Math.max(200, a.j + f), a.A = Math.max(150, a.F + d));
    document.removeEventListener("mousemove", a.K);
    document.removeEventListener("mouseup", a.L);
    a.K = null;
    a.L = null;
    a.refresh();
  };
  document.addEventListener("mousemove", a.K);
  document.addEventListener("mouseup", a.L);
}
function Yc(a, b, c) {
  c.preventDefault();
  const d = a.h[b], f = c.clientY, e = d.height, g = d.pa;
  let h = null;
  for (b += 1; b < a.h.length; b++) {
    if (a.h[b].visible && !a.h[b].collapsed) {
      h = a.h[b];
      break;
    }
  }
  const k = h ? h.pa : "", p = (b = h ? document.getElementById(k) : null) ? b.clientHeight : 0;
  a.N = l => {
    l = l.clientY - f;
    if (h && p > 0) {
      l = Math.max(-(e - 30), Math.min(p - 30, l));
      var m = document.getElementById(g);
      const u = document.getElementById(k);
      m && (m.style.height = e + l + "px");
      u && (u.style.height = p - l + "px");
    } else {
      if (l = Math.max(30, e + l), m = document.getElementById(g)) {
        m.style.height = l + "px";
      }
    }
  };
  a.O = l => {
    l = l.clientY - f;
    h && p > 0 ? (l = Math.max(-(e - 30), Math.min(p - 30, l)), d.height = e + l, h.height = p - l) : d.height = Math.max(30, e + l);
    document.removeEventListener("mousemove", a.N);
    document.removeEventListener("mouseup", a.O);
    a.N = null;
    a.O = null;
    a.refresh();
  };
  document.addEventListener("mousemove", a.N);
  document.addEventListener("mouseup", a.O);
}
function Zc(a) {
  return L("div", {onDblClick:() => {
    if (a.i) {
      a.i = !1;
    } else {
      const b = window.innerWidth;
      a.o = a.l === "right" ? Math.max(0, b - a.C - 40) : 40;
      a.$ = 50;
      a.A = Math.min(500, window.innerHeight - 100);
      a.i = !0;
    }
    a.refresh();
  }, onMouseDown:b => Wc(a, b), style:{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 10px", backgroundColor:"#1e1e1e", borderBottom:"1px solid #444", fontSize:"11px", fontWeight:"bold", letterSpacing:"0.5px", color:"#aaa", cursor:a.i ? "grab" : "default", userSelect:"none"}}, "PANEL", L("div", {onClick:b => {
    b.stopPropagation();
    a.v = !a.v;
    a.refresh();
  }, onMouseDown:b => b.stopPropagation(), onDblClick:b => b.stopPropagation(), style:{cursor:"pointer", padding:"2px 6px", borderRadius:"3px", fontSize:"14px", lineHeight:"1", color:"#aaa"}}, "\u00b7\u00b7\u00b7"));
}
function $c(a) {
  const b = {display:"flex", alignItems:"center", gap:"6px", padding:"4px 10px", cursor:"pointer", fontSize:"12px", color:"#e0e0e0"}, c = {width:"14px", textAlign:"center", fontSize:"11px", color:"#6af"};
  return L("div", null, L("div", {onClick:() => {
    a.v = !1;
    a.refresh();
  }, style:{position:"fixed", top:"0", left:"0", right:"0", bottom:"0", zIndex:"100"}}), L("div", {style:{position:"absolute", right:"6px", top:"28px", backgroundColor:"#252526", border:"1px solid #555", borderRadius:"4px", padding:"4px 0", zIndex:"101", boxShadow:"0 4px 12px rgba(0,0,0,0.5)", minWidth:"140px"}}, a.h.map(d => L("div", {onClick:() => {
    const f = Vc(a, d.key);
    f && (f.visible = !f.visible, a.refresh());
  }, style:b}, L("span", {style:c}, d.visible ? "\u2713" : ""), d.label)), L("div", {style:{borderTop:"1px solid #444", margin:"4px 0"}}), L("div", {onClick:() => {
    a.l = "left";
    a.i = !1;
    a.v = !1;
    a.refresh();
  }, style:b}, L("span", {style:c}, a.i || a.l !== "left" ? "" : "\u2713"), "Dock Left"), L("div", {onClick:() => {
    a.l = "right";
    a.i = !1;
    a.v = !1;
    a.refresh();
  }, style:b}, L("span", {style:c}, a.i || a.l !== "right" ? "" : "\u2713"), "Dock Right")));
}
function ad(a, b, c, d, f, e, g) {
  return L("div", null, L("div", {onClick:c, style:{display:"flex", alignItems:"center", gap:"4px", padding:"4px 10px", backgroundColor:"#2d2d2d", cursor:"pointer", fontSize:"11px", fontWeight:"bold", letterSpacing:"0.3px", color:"#e0e0e0", borderTop:"1px solid #444", userSelect:"none"}}, L("span", {style:{color:"#aaa", fontSize:"10px", width:"10px"}}, b ? "\u25b8" : "\u25be"), a), b ? null : L("div", null, L("div", {id:e, className:"sidebar-scroll", style:{overflowY:"auto", height:f + "px", padding:"6px 8px"}}, 
  d), L("div", {className:g ? "section-sash" : "", onMouseDown:g, style:{height:"4px", cursor:g ? "ns-resize" : "default", flexShrink:"0"}})));
}
function bd(a) {
  const b = {position:"absolute", zIndex:"10"}, c = [];
  (a.i || a.l === "right") && c.push(L("div", {onMouseDown:d => Xc(a, d, "left"), style:{...b, left:"0", top:"0", width:"5px", height:"100%", cursor:"ew-resize"}}));
  (a.i || a.l === "left") && c.push(L("div", {onMouseDown:d => Xc(a, d, "right"), style:{...b, right:"0", top:"0", width:"5px", height:"100%", cursor:"ew-resize"}}));
  a.i && (c.push(L("div", {onMouseDown:d => Xc(a, d, "bottom"), style:{...b, left:"0", bottom:"0", width:"100%", height:"5px", cursor:"ns-resize"}})), c.push(L("div", {onMouseDown:d => Xc(a, d, "corner-br"), style:{...b, right:"0", bottom:"0", width:"10px", height:"10px", cursor:"nwse-resize"}})));
  return c.length > 0 ? L("div", null, c) : null;
}
function cd(a) {
  let b = (a.i ? a.A : window.innerHeight) - 33;
  for (var c of a.h) {
    c.visible && (b -= 23, c.collapsed || (b -= 4));
  }
  c = null;
  for (var d = a.h.length - 1; d >= 0; d--) {
    if (a.h[d].visible && !a.h[d].collapsed) {
      c = a.h[d].key;
      break;
    }
  }
  d = new Map();
  for (const f of a.h) {
    f.visible && !f.collapsed && (f.key === c ? d.set(f.key, Math.max(30, b)) : (a = Math.max(30, Math.min(f.height, b)), d.set(f.key, a), b -= a));
  }
  return d;
}
class dd extends Tb {
  constructor() {
    super();
    this.h = [{key:"vars", label:"VARIABLES", visible:!0, collapsed:!1, height:200, pa:"section-vars-content"}, {key:"shapes", label:"SHAPES", visible:!0, collapsed:!1, height:300, pa:"section-shapes-content"}, {key:"hello", label:"HELLO WORLD", visible:!0, collapsed:!1, height:0, pa:"section-hello-content"}];
    this.ta = {M:[], wa:"", S:-1, ha:(new Date()).getFullYear(), T:(new Date()).getMonth()};
    this.Ba = {fa:-1, aa:-1, V:null};
    this.Aa = {count:0};
    this.i = this.v = !1;
    this.l = "right";
    this.C = 280;
    this.A = 500;
    this.o = 200;
    this.$ = 50;
    this.ca = this.ba = this.ea = this.da = 0;
    this.J = this.I = null;
    this.ja = "";
    this.ka = this.F = this.j = this.ma = this.la = 0;
    this.O = this.N = this.L = this.K = null;
  }
  na() {
    this.u = Fc(this.u);
  }
  async render() {
    var a = this.u ? Z(this.u) : [], b = () => this.refresh();
    const c = {vars:Mb(new Qc({state:this.ta, refresh:b})), shapes:Mb(new Tc({state:this.Ba, u:this.u, Ka:a, refresh:b})), hello:Mb(new Uc({state:this.Aa, refresh:b}))}, d = {vars:"VARIABLES (" + this.ta.M.length + ")", shapes:"SHAPES (" + a.length + ")", hello:"HELLO WORLD"}, f = cd(this);
    a = {position:"fixed", width:this.C + "px", backgroundColor:"#1e1e1e", color:"#e0e0e0", fontFamily:"sans-serif", fontSize:"12px", pointerEvents:"auto", display:"flex", flexDirection:"column", whiteSpace:"nowrap", overflow:"hidden"};
    this.i ? (a.left = this.o + "px", a.top = this.$ + "px", a.height = this.A + "px", a.borderRadius = "6px", a.boxShadow = "0 6px 20px rgba(0,0,0,0.6)", a.border = "1px solid #555") : (a.top = "0", a.height = "100vh", this.l === "right" ? (a.right = "0", a.borderLeft = "1px solid #444") : (a.left = "0", a.borderRight = "1px solid #444"));
    let e = -1;
    for (b = this.h.length - 1; b >= 0; b--) {
      if (this.h[b].visible && !this.h[b].collapsed) {
        e = b;
        break;
      }
    }
    return L("div", {id:"ploft-sidebar", style:a}, L("style", null, Kc), Zc(this), this.v ? $c(this) : null, this.h.map((g, h) => {
      if (!g.visible) {
        return null;
      }
      const k = h === e ? null : p => Yc(this, h, p);
      return ad(d[g.key] || g.label, g.collapsed, () => {
        const p = Vc(this, g.key);
        p && (p.collapsed = !p.collapsed, this.refresh());
      }, c[g.key], f.get(g.key) || 30, g.pa, k);
    }), bd(this));
  }
}
;function ed(a) {
  return "#" + (16777216 | (a >>> 24 & 255) << 16 | (a >>> 16 & 255) << 8 | a >>> 8 & 255).toString(16).slice(1);
}
function fd(a) {
  const b = a & 2 || a & 32;
  return a & 1 && b ? 2 : b ? 1 : 0;
}
function gd(a) {
  const b = a & 8 || a & 64;
  return a & 4 && b ? 2 : b ? 1 : 0;
}
function hd(a, b) {
  const c = a.O.getBoundingClientRect(), d = a.N;
  return Math.round(Math.max(0, Math.min(1, (b - c.left) / c.width)) * a.v * d) / d;
}
function id(a, b) {
  a.N = Math.pow(10, Math.min(a.F, 2));
  a.O = b.currentTarget;
  a.A = !0;
  b = hd(a, b.clientX);
  Hc(a.u, a.h, b);
  a.l = c => {
    a.A && (c = hd(a, c.clientX), Hc(a.u, a.h, c));
  };
  a.o = () => {
    a.A = !1;
    document.removeEventListener("mousemove", a.l);
    document.removeEventListener("mouseup", a.o);
    a.l = null;
    a.o = null;
  };
  document.addEventListener("mousemove", a.l);
  document.addEventListener("mouseup", a.o);
}
function jd(a, b) {
  a = a.L.getBoundingClientRect();
  return Math.round(Math.max(0, Math.min(1, (b - a.left) / a.width)) * 255);
}
function kd(a, b) {
  const c = Z(a.u)[a.h];
  if (c) {
    if (a.K === "fill") {
      var d = a.u;
      b |= c.fill & -256;
      M(d, a.h);
      N(d, b);
      d.notify(7);
    } else {
      d = a.u, b |= c.stroke & -256, M(d, a.h), N(d, b), d.notify(8);
    }
  }
}
function ld(a, b, c) {
  a.K = c;
  a.L = b.currentTarget;
  a.C = !0;
  kd(a, jd(a, b.clientX));
  a.i = d => {
    a.C && kd(a, jd(a, d.clientX));
  };
  a.j = () => {
    a.C = !1;
    document.removeEventListener("mousemove", a.i);
    document.removeEventListener("mouseup", a.j);
    a.i = null;
    a.j = null;
  };
  document.addEventListener("mousemove", a.i);
  document.addEventListener("mouseup", a.j);
}
function md(a, b) {
  let c = null;
  a === 1 ? c = L("div", {style:{width:"6px", height:"2px", backgroundColor:"#aaa"}}) : a === 2 && (c = L("div", {style:{width:"6px", height:"6px", backgroundColor:"#6af"}}));
  return L("div", {onClick:b, style:{width:"12px", height:"12px", border:"1px solid #888", borderRadius:"2px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:"0"}}, c);
}
function nd(a, b, c, d) {
  d = Math.round(d / 255 * 100) + "%";
  return L("div", {onMouseDown:f => ld(a, f, b), style:{position:"relative", width:"50px", height:"10px", cursor:"pointer", userSelect:"none"}}, L("div", {style:{position:"absolute", top:"0", left:"0", width:"100%", height:"100%", backgroundColor:"#444", borderRadius:"2px"}}), L("div", {style:{position:"absolute", top:"0", left:"0", height:"100%", width:d, backgroundColor:c, borderRadius:"2px"}}), L("div", {style:{position:"absolute", pointerEvents:"none", left:d, top:"0", height:"100%", width:"2px", 
  backgroundColor:"#fff", transform:"translateX(-1px)"}}));
}
function od(a, b, c) {
  return (a || 0) === b ? L("option", {value:String(b), selected:!0}, c) : L("option", {value:String(b)}, c);
}
class pd extends Tb {
  constructor() {
    super();
    this.h = -1;
    this.J = this.I = 0;
    this.A = !1;
    this.o = this.l = this.O = null;
    this.F = this.N = 1;
    this.v = 20;
    this.C = !1;
    this.j = this.i = this.L = null;
    this.K = "";
  }
  na() {
    this.u = Fc(this.u);
    this.h = Rb(this.u, 0);
    this.I = Rb(this.u, 4);
    var a = this.u;
    this.J = a.g.view.getFloat64(a.h + 8, !0);
  }
  async render() {
    const a = (this.u ? Z(this.u) : [])[this.h];
    if (!a) {
      return L("div", null);
    }
    const b = a.origin === 1, c = a.flags || 0, d = fd(c), f = gd(c), e = c & 16 ? 2 : c & 128 ? 1 : 0, g = a.fill ? ed(a.fill) : "#000000", h = a.stroke ? ed(a.stroke) : "#000000", k = a.fill & 255, p = a.stroke & 255, l = a.lineWidth >= 0 ? a.lineWidth : 1;
    var m = this.A ? this.v : this.v = oa(l);
    m = Math.max(0, Math.min(1, (l - 0) / m)) * 100 + "%";
    const u = {position:"fixed", left:this.I + "px", top:this.J + "px", backgroundColor:"#1e1e1e", border:"1px solid #555", borderRadius:"4px", padding:"6px", zIndex:"9999", fontFamily:"sans-serif", fontSize:"12px", color:"#e0e0e0", minWidth:"160px", boxShadow:"0 4px 12px rgba(0,0,0,0.5)"}, r = {display:"block", width:"100%", padding:"4px 8px", marginBottom:"2px", backgroundColor:"transparent", color:"#e0e0e0", border:"none", borderRadius:"2px", cursor:"pointer", textAlign:"left", fontSize:"12px"}, 
    w = {display:"flex", alignItems:"center", justifyContent:"space-between", padding:"3px 8px", marginBottom:"2px"}, z = {opacity:"0.3", pointerEvents:"none"}, Q = {opacity:"1"};
    return L("div", null, L("div", {onClick:() => {
      this.u.notify(10);
    }, onContextMenu:v => {
      v.preventDefault();
      this.u.notify(10);
    }, style:{position:"fixed", top:0, left:0, right:0, bottom:0, zIndex:"9998"}}), L("div", {style:u}, L("button", {onClick:() => {
      var v = this.u;
      M(v, this.h);
      v.notify(5);
      this.u.notify(10);
    }, style:r}, "Apagar"), L("button", {onClick:() => {
      var v = this.u;
      M(v, this.h);
      v.notify(6);
      this.u.notify(10);
    }, style:r}, "Copiar JSON"), b ? L("div", null, L("div", {style:{borderTop:"1px solid #444", margin:"4px 0"}}), L("div", {style:w}, md(d, () => {
      const v = fd(c);
      var y = this.u;
      M(y, this.h);
      N(y, v === 0 ? 1 : v === 1 ? 2 : 0);
      y.notify(12);
    }), L("span", {style:{marginLeft:"4px", minWidth:"26px"}}, "Fill"), L("div", {style:d === 2 ? Q : z}, L("div", {style:{display:"flex", alignItems:"center", gap:"6px"}}, L("span", {style:{fontSize:"10px", minWidth:"20px", textAlign:"right"}}, Math.round(k / 255 * 100)), nd(this, "fill", g, k), L("input", {type:"color", value:g, onInput:v => {
      const y = Z(this.u)[this.h];
      var G = this.u;
      v = parseInt(v.target.value.slice(1), 16) << 8 | (y ? y.fill & 255 : 255);
      M(G, this.h);
      N(G, v);
      G.notify(7);
    }, style:{width:"32px", height:"20px", border:"none", cursor:"pointer"}})))), L("div", {style:w}, md(f, () => {
      const v = gd(c);
      var y = this.u;
      M(y, this.h);
      N(y, v === 0 ? 1 : v === 1 ? 2 : 0);
      y.notify(13);
    }), L("span", {style:{marginLeft:"4px", minWidth:"26px"}}, "Stroke"), L("div", {style:f === 2 ? Q : z}, L("div", {style:{display:"flex", alignItems:"center", gap:"6px"}}, L("span", {style:{fontSize:"10px", minWidth:"20px", textAlign:"right"}}, Math.round(p / 255 * 100)), nd(this, "stroke", h, p), L("input", {type:"color", value:h, onInput:v => {
      const y = Z(this.u)[this.h];
      var G = this.u;
      v = parseInt(v.target.value.slice(1), 16) << 8 | (y ? y.stroke & 255 : 255);
      M(G, this.h);
      N(G, v);
      G.notify(8);
    }, style:{width:"32px", height:"20px", border:"none", cursor:"pointer"}})))), L("div", {style:w}, md(e, () => {
      const v = c & 16 ? 2 : c & 128 ? 1 : 0;
      var y = this.u;
      M(y, this.h);
      N(y, v === 0 ? 1 : v === 1 ? 2 : 0);
      y.notify(14);
    }), L("span", {style:{marginLeft:"4px", minWidth:"26px"}}, "Width"), L("div", {style:e === 2 ? Q : z}, L("div", {style:{display:"flex", alignItems:"center", gap:"4px"}}, L("div", {onMouseDown:v => id(this, v), style:{position:"relative", width:"70px", height:"12px", cursor:"pointer", userSelect:"none"}}, L("div", {style:{position:"absolute", top:"0", left:"0", width:"100%", height:"100%", backgroundColor:"#444", clipPath:"polygon(0% 100%, 100% 0%, 100% 100%)"}}), L("div", {style:{position:"absolute", 
    top:"0", left:"0", overflow:"hidden", height:"100%", width:m}}, L("div", {style:{width:"70px", height:"100%", backgroundColor:"#6af", clipPath:"polygon(0% 100%, 100% 0%, 100% 100%)"}})), L("div", {style:{position:"absolute", pointerEvents:"none", left:m, top:"0", height:"100%", width:"2px", backgroundColor:"#fff", transform:"translateX(-1px)"}})), L("input", {type:"text", value:l.toFixed(this.F), onInput:v => {
      v = v.target.value.trim();
      if (v !== "" && !v.endsWith(".")) {
        var y = v.indexOf(".");
        this.F = y < 0 ? 0 : v.length - y - 1;
        v = parseFloat(v);
        !isNaN(v) && v >= 0 && (this.v = oa(v), Hc(this.u, this.h, v));
      }
    }, onKeyDown:v => v.stopPropagation(), style:{width:"30px", height:"18px", backgroundColor:"#333", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", textAlign:"right", fontSize:"11px", padding:"0 2px"}}))))) : L("div", null, L("div", {style:{borderTop:"1px solid #444", margin:"4px 0"}}), L("div", {style:w}, L("span", {style:{minWidth:"26px"}}, "Fit"), L("select", {onChange:v => {
      var y = this.u;
      v = parseInt(v.target.value, 10);
      M(y, this.h);
      N(y, v);
      y.notify(15);
    }, style:{backgroundColor:"#333", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", fontSize:"11px", padding:"2px 4px", cursor:"pointer"}}, od(a.Ca, 0, "Meet"), od(a.Ca, 1, "Slice"), od(a.Ca, 2, "Stretch"))))));
  }
}
;Pb.set(1, dd);
Pb.set(2, pd);
document.addEventListener("DOMContentLoaded", async function() {
  let a = new ac();
  await Yb(a);
  var b = f => {
    const e = document.createElement("canvas");
    e.style.position = "fixed";
    e.style.top = "0";
    e.style.left = "0";
    e.style.height = "100vh";
    e.style.width = "100vw";
    e.style.zIndex = f;
    document.getElementById("dmain")?.appendChild(e);
    return e;
  };
  const c = b("1"), d = b("2");
  d.style.pointerEvents = "none";
  b = b("3");
  b.style.pointerEvents = "none";
  Dc(a, c, b, d);
});
}).call(this);
