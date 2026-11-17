(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var ca = this || self;
async function da(a) {
  return new Promise(b => setTimeout(b, a));
}
function fa(a) {
  if (!Array.isArray(a)) {
    return a;
  }
  const b = [];
  a.forEach(c => {
    Array.isArray(c) ? b.push(...fa(c)) : b.push(c);
  });
  return b;
}
;const ha = "perf comp evt data init net srv lib".split(" "), ia = {"[perf]":1, "[comp]":6, "[data]":8, "[init]":16, "[net]":32, "[srv]":64, "[lib]":128};
let ja = 1;
function ka() {
  var a = /[?&]log=([^&]*)/.exec(window.location.search || "");
  if (a) {
    var b = 0;
    for (const c of decodeURIComponent(a[1]).split(",")) {
      a = c.trim().toLowerCase();
      if (!a) {
        continue;
      }
      if (a === "all") {
        b = (1 << ha.length) - 1;
        continue;
      }
      if (a === "none") {
        b = 0;
        continue;
      }
      const d = a.charAt(0) === "-", e = ha.indexOf(d ? a.slice(1) : a);
      e < 0 ? console.warn("[log] canal desconhecido:", a, "\u2014 canais:", ha.join(",")) : b = d ? b & ~(1 << e) : b | 1 << e;
    }
    ja = b;
  } else {
    ja = 1;
  }
}
function la(a) {
  a = /^\[[a-z]+\]/.exec(a);
  if (!a) {
    return !0;
  }
  a = ia[a[0]];
  return a === void 0 || (ja & a) !== 0;
}
;const ma = new Map(), oa = ma.delete.bind(ma), pa = new Map(), qa = new Map(), ra = new BroadcastChannel("ib");
ra.onmessage = a => {
  a = a.data;
  a.m === 1 && (ma.get(a.n)?.close(), oa(a.n));
};
ma.delete = a => {
  ra.postMessage({m:1, n:a});
  return oa(a);
};
function sa(a, b) {
  if (!b) {
    return ta(a);
  }
  var c = () => ta(a, b);
  c = (qa.get(a) || Promise.resolve()).then(c, c);
  qa.set(a, c.then(() => {
  }, () => {
  }));
  return c;
}
async function ta(a, b) {
  var c = ma.get(a);
  if (c && !b) {
    return c;
  }
  if ((c = pa.get(a)) && !b) {
    return c;
  }
  let d;
  b && (c = await sa(a), d = c.version + 1, c.close(), ma.delete(a));
  c = new Promise((f, g) => {
    let h = !1, k = !1;
    setTimeout(() => {
      h || g(Error(`indexedDB timeout: bloqueado: ${k ? "essa aba" : "outra"} (${a})`));
    }, 3000);
    const m = indexedDB.open(a, d);
    m.onsuccess = l => {
      h = !0;
      l = l.target.result;
      ma.set(a, l);
      f(l);
    };
    m.onerror = l => {
      h = !0;
      g(l.target.error);
    };
    m.onupgradeneeded = l => {
      h = !0;
      l = l.target.result;
      b && b(l);
    };
    m.onblocked = () => {
      k = !0;
    };
  });
  pa.set(a, c);
  const e = () => {
    pa.delete(a);
  };
  c.then(e, e);
  return c;
}
async function ua(a, b) {
  let c = await sa(a);
  c.objectStoreNames.contains(b) || (c = await sa(a, d => {
    d.objectStoreNames.contains(b) || d.createObjectStore(b);
  }));
  return c;
}
async function va(a, b) {
  let c = await sa(a);
  c.objectStoreNames.contains(b) && (c = await sa(a, d => {
    d.objectStoreNames.contains(b) && d.deleteObjectStore(b);
    console.log("apagado");
  }));
  return c;
}
async function wa(a, b, c, ...d) {
  let e = a.o;
  e && e.objectStoreNames.contains(a.i) || (e = await ua(a.h, a.i));
  const f = e.transaction([a.i], b).objectStore(a.i)[c](...d);
  return new Promise((g, h) => {
    f.onsuccess = k => {
      g(k.target.result);
    };
    f.onerror = k => {
      h(k.target.error);
    };
  });
}
class xa {
  constructor(a) {
    const [b, c] = a.split(".");
    this.h = b;
    this.i = c;
  }
  get o() {
    return ma.get(this.h);
  }
  async init() {
    return await ua(this.h, this.i);
  }
  async get(a) {
    return await wa(this, "readonly", "get", a);
  }
  async set(a, b) {
    await wa(this, "readwrite", "put", b, a);
  }
  async g(a) {
    await wa(this, "readwrite", "delete", a);
  }
  async clear() {
    await wa(this, "readwrite", "clear");
  }
  async j() {
    return await wa(this, "readwrite", "getAllKeys");
  }
  async D() {
    await va(this.h, this.i);
  }
  async C() {
    this.o.close();
    ma.delete(this.h);
    return new Promise((a, b) => {
      const c = indexedDB.deleteDatabase(this.h);
      c.onsuccess = () => {
        a();
      };
      c.onerror = d => {
        b(d.target.error);
      };
    });
  }
}
function ya(a) {
  a = new xa(a);
  const b = [];
  b[0] = a.init.bind(a);
  b[1] = a.get.bind(a);
  b[2] = a.set.bind(a);
  b[3] = a.g.bind(a);
  b[4] = a.clear.bind(a);
  b[5] = a.j.bind(a);
  b[6] = a.D.bind(a);
  b[7] = a.C.bind(a);
  return b;
}
;function za(a) {
  return !!a && a.name === "NotFoundError";
}
function Aa(a) {
  return a === null || typeof a !== "object";
}
function Ba(a) {
  return Array.isArray(a) ? a.every(Aa) : Object.keys(a).every(b => Aa(a[b]));
}
function Ca(a, b) {
  b = b || "";
  if (Aa(a) || Ba(a)) {
    return JSON.stringify(a);
  }
  const c = b + " ";
  return Array.isArray(a) ? "[\n" + a.map(d => c + Ca(d, c)).join(",\n") + "\n" + b + "]" : "{\n" + Object.keys(a).map(d => c + JSON.stringify(d) + ": " + Ca(a[d], c)).join(",\n") + "\n" + b + "}";
}
function Da(a) {
  try {
    return JSON.parse(a);
  } catch (b) {
    return console.warn("artifacts: artefato nao e JSON \u2014 gravado como texto", b), a;
  }
}
function Ea(a, b) {
  b = a.j.then(b, b);
  a.j = b.then(() => {
  }, () => {
  });
  return b;
}
function Fa(a) {
  a.Xa || (a.Xa = a.g.init());
  return a.Xa;
}
async function Ga(a, b) {
  if (a.i) {
    return a.i;
  }
  let c = a.o;
  try {
    for (const d of a.D) {
      c = await c.getDirectoryHandle(d, {create:b});
    }
  } catch (d) {
    if (za(d)) {
      return null;
    }
    throw d;
  }
  return a.i = c;
}
async function Ha(a, b) {
  try {
    return await (await (await a.getFileHandle(b)).getFile()).text();
  } catch (c) {
    if (za(c)) {
      return null;
    }
    throw c;
  }
}
async function Ia(a, b, c) {
  await Ha(a, b) !== c && (a = await (await a.getFileHandle(b, {create:!0})).createWritable(), await a.write(c), await a.close());
}
function Ja(a, b) {
  if (a === null) {
    return null;
  }
  try {
    const c = JSON.parse(a);
    if (!c || typeof c !== "object") {
      throw Error("nao e objeto");
    }
    a = {name:"", type:"", tb:{}};
    typeof c.name === "string" && (a.name = c.name);
    typeof c.type === "string" && (a.type = c.type);
    const d = c.tables;
    d && typeof d === "object" && !Array.isArray(d) && (a.tb = d);
    return a;
  } catch (c) {
    return console.warn("artifacts: entidade ilegivel \u2014", b, c), null;
  }
}
async function Ka(a, b) {
  return (a = await Ga(a, !1)) ? Ja(await Ha(a, encodeURIComponent(b) + ".json"), b) : null;
}
async function Ma(a, b, c) {
  const d = {};
  c.name && (d.name = c.name);
  c.type && (d.type = c.type);
  d.tables = c.tb;
  a = await Ga(a, !0);
  await Ia(a, encodeURIComponent(b) + ".json", Ca(d));
}
async function Na(a, b) {
  return await Ka(a, b) || {name:"", type:"", tb:{}};
}
async function Oa(a, b, c) {
  var d = await Ga(a, !1);
  if (!d) {
    return 0;
  }
  if (c) {
    d = await Ka(a, b);
    if (!(d && c in d.tb)) {
      return 0;
    }
    delete d.tb[c];
    await Ma(a, b, d);
    return 1;
  }
  c = 0;
  try {
    await d.removeEntry(encodeURIComponent(b) + ".json"), c = 1;
  } catch (e) {
    if (!za(e)) {
      throw e;
    }
  }
  await Fa(a);
  await a.g.g(b);
  return c;
}
function Pa(a, b, c) {
  return Ea(a, async() => Oa(a, b, c));
}
function Qa(a, b) {
  return Ea(a, async() => {
    await Fa(a);
    const c = await Ga(a, !1), d = [];
    if (!c) {
      return d;
    }
    const e = [], f = [], g = [];
    for await (const h of c.values()) {
      h.kind === "directory" ? f.push(h.name) : h.name.endsWith(".json") ? e.push(decodeURIComponent(h.name.slice(0, -5))) : g.push(h.name);
    }
    for (const h of g) {
      try {
        await c.removeEntry(h), d.push(h);
      } catch (k) {
        if (!za(k)) {
          throw k;
        }
      }
    }
    for (const h of f) {
      try {
        await c.removeEntry(h, {recursive:!0}), d.push(h + "/");
      } catch (k) {
        if (!za(k)) {
          throw k;
        }
      }
    }
    for (const h of e) {
      b(h) || await Oa(a, h) && d.push(h);
    }
    return d;
  });
}
function Ra(a, b, c) {
  return Ea(a, async() => {
    const d = await Na(a, b);
    typeof c.name === "string" && c.name && (d.name = c.name);
    typeof c.type === "string" && c.type && (d.type = c.type);
    const e = c.artifacts;
    if (e && typeof e === "object") {
      for (const f in e) {
        typeof e[f] === "string" && (d.tb[f] = Da(e[f]));
      }
    }
    await Ma(a, b, d);
  });
}
async function Sa(a, b, c) {
  await Fa(a);
  c && await a.g.set(b, c);
}
class Ta {
  constructor(a) {
    this.o = Ua();
    this.D = ["internal", "artifacts"].filter(b => !!b);
    this.g = new xa(a);
    this.i = this.Xa = null;
    this.j = Promise.resolve();
  }
  async init() {
    await Fa(this);
  }
  has(a) {
    return Ea(this, async() => await Ka(this, a) !== null);
  }
  get(a, b) {
    return Ea(this, async() => {
      var c = await Ka(this, a);
      c && b in c.tb ? (c = c.tb[b], c = typeof c === "string" ? c : JSON.stringify(c)) : c = null;
      return c;
    });
  }
  set(a, b, c) {
    return Ea(this, async() => {
      const d = await Na(this, a);
      d.tb[b] = Da(String(c));
      await Ma(this, a, d);
    });
  }
  keys() {
    return Ea(this, async() => {
      await Fa(this);
      const a = await Ga(this, !1), b = [];
      if (!a) {
        return b;
      }
      for await (const c of a.values()) {
        c.kind === "file" && c.name.endsWith(".json") && b.push(decodeURIComponent(c.name.slice(0, -5)));
      }
      return b;
    });
  }
  async handle(a) {
    await Fa(this);
    return (a = await this.g.get(a)) && typeof a === "object" ? a : null;
  }
  C(a, b, c) {
    return Ea(this, async() => {
      await Sa(this, a, c);
      if (b) {
        const d = await Na(this, a);
        d.name = b;
        await Ma(this, a, d);
      }
    });
  }
  H(a) {
    return Ea(this, async() => {
      const b = await Ka(this, a);
      return b && (b.name || b.type) ? JSON.stringify({name:b.name, type:b.type}) : null;
    });
  }
  O(a, b, c) {
    return Ea(this, async() => {
      const d = await Na(this, a);
      b && (d.name = b);
      c && (d.type = c);
      await Ma(this, a, d);
    });
  }
  h(a) {
    return Ea(this, async() => {
      var b = await Ga(this, !1);
      const c = [];
      if (b && a) {
        for await (const d of b.values()) {
          if (d.kind !== "file" || !d.name.endsWith(".json")) {
            continue;
          }
          b = decodeURIComponent(d.name.slice(0, -5));
          const e = await d.getFile(), f = Ja(await e.text(), b);
          f && f.type === a && c.push({key:b, name:f.name, modified:e.lastModified || 0});
        }
      }
      return JSON.stringify(c);
    });
  }
}
const Va = new Map(), Wa = new Map();
function Xa(a) {
  Va.set("artifacts", a);
  Wa.delete("artifacts");
}
function Ya(a) {
  var b = Wa.get(a);
  if (!b) {
    b = Va.get(a);
    if (!b) {
      throw Error("artifacts: deposito nao registrado: " + a + " (reg-boot[art-store] supply no boot da aplicacao)");
    }
    b = b();
    Wa.set(a, b);
  }
  return b;
}
function Za(a) {
  const b = Ya(a);
  a = [];
  a[0] = b.init.bind(b);
  a[1] = b.get.bind(b);
  a[2] = b.set.bind(b);
  a[3] = b.C.bind(b);
  a[4] = b.handle.bind(b);
  a[5] = (c, d) => Pa(b, c, d || void 0);
  a[6] = b.H.bind(b);
  a[7] = b.O.bind(b);
  a[8] = b.h.bind(b);
  return a;
}
;const $a = new Map();
function ab(a) {
  const b = $a.get(a);
  if (!b) {
    throw Error("js_service: servico nao registrado: " + a + " (reg-boot[js-service] supply no boot da aplicacao)");
  }
  return b;
}
;async function bb(a = null) {
  let b = {};
  if (a !== null) {
    let c = "desktop documents downloads music pictures videos".split(" ");
    (a?.constructor.name ?? "") === "FileSystemDirectoryHandle" || c.includes(a) ? b.startIn = a : typeof a === "string" && (b.id = a);
  }
  try {
    return await window.showDirectoryPicker(b);
  } catch (c) {
    return console.warn("[fs] showDirectoryPicker recusou:", c && c.name, "-", c && c.message, JSON.stringify(b)), null;
  }
}
async function cb(a, b) {
  try {
    return await a.queryPermission() === "granted" ? !0 : b ? !1 : await a.requestPermission() === "granted";
  } catch (c) {
    return !1;
  }
}
var db = () => ({description:"Document", accept:{"application/pdf":[".pdf"]}}), eb = {description:"ZIP Files", accept:{"application/zip":[".zip"]}}, fb = {description:"WASM Files", accept:{"application/wasm":[".wasm"]}};
function gb(a) {
  if (a <= 20) {
    return 20;
  }
  const b = Math.pow(10, Math.floor(Math.log10(a))), c = Math.ceil(a / b) * b;
  return c > a ? c : c + b;
}
;async function hb(a) {
  if (a.handle.kind === "file") {
    a.file = await a.handle.getFile();
    a.size = a.file.size;
    a.mimeType = a.file.type;
    var b = new Date(a.file.lastModified);
    a.modifiedTime = `${(b.getMonth() + 1).toString().padStart(2, "0")}-${b.getDate().toString().padStart(2, "0")}-${b.getFullYear()} ${b.getHours().toString().padStart(2, "0")}:${b.getMinutes().toString().padStart(2, "0")}:${b.getSeconds().toString().padStart(2, "0")}`;
  }
}
class ib {
  constructor(a, b) {
    this.folder = a;
    this.name = b.name;
    this.handle = b;
    b.kind === "file" ? this.isfile = !0 : b.kind === "directory" && (this.isfile = !1);
  }
}
async function jb(a, b = !0, c = "") {
  let d = [];
  if (!a) {
    return d;
  }
  const e = [];
  for await (const g of a.values()) {
    var f = g;
    a = new ib(c, f);
    if (f.kind === "file") {
      a.isfile = !0, e.push(a), d.push(a);
    } else if (f.kind === "directory") {
      a.isfile = !1;
      f = await jb(f, b, c ? `${c}/${f.name}` : f.name);
      if (b) {
        for (let h of f) {
          d.push(h);
        }
      } else {
        a.g = f;
      }
      d.push(a);
    }
  }
  for (b = 0; b < e.length; b += 50) {
    await Promise.all(e.slice(b, b + 50).map(g => hb(g)));
  }
  return d;
}
async function lb(a, b, c = !1) {
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
;const mb = new Map(), nb = new Map(), ob = new Map();
function pb(a, b) {
  return (a = b.Pa ? a.get((b.Pa || "") + "|" + b.key) : void 0) ? a(b) : null;
}
async function qb(a) {
  var b = pb(nb, a);
  if (b) {
    return {persisted:!0, handle:b};
  }
  if (a.Ai) {
    b = a.Ai;
  } else if (a.Pa) {
    b = new xa(a.Pa), await b.init();
  } else {
    if (a.throw) {
      throw Error("no storage passed");
    }
    return {persisted:!1, handle:null};
  }
  a.reload && await b.g(a.key);
  var c = mb.get(a.Pa + "|" + a.key);
  if (!c) {
    var d = await b.get(a.key);
    d && typeof d.queryPermission === "function" && (c = d);
  }
  d = await cb(c, a.ld);
  if (!d && a.ld) {
    return (a = pb(ob, a)) ? {persisted:!0, handle:a} : {persisted:!1, handle:null};
  }
  if ((c = d ? c : await bb(c || a.key)) && await cb(c, a.ld)) {
    typeof FileSystemDirectoryHandle !== "undefined" && c instanceof FileSystemDirectoryHandle ? await b.set(a.key, c) : mb.set(a.Pa + "|" + a.key, c);
  } else {
    if (b = pb(ob, a)) {
      return {persisted:!0, handle:b};
    }
    if (a.throw) {
      throw Error("dir handle not  aquired");
    }
    return {persisted:!1, handle:null};
  }
  return {persisted:d, handle:c};
}
async function rb(a, b, c) {
  if (a.h && (c = await lb(a.h, c), c = await jb(c, !0), c.length)) {
    var d = q => q < 6 ? !0 : q === 10 || q === 16, e = q => d(q) ? a.g.view.getInt32(b + q * 4, !0) : a.g.view.getFloat64(b + q * 4, !0), f = (q, v) => {
      d(q) ? a.g.view.setInt32(b + q * 4, v, !0) : a.g.view.setFloat64(b + q * 4, v, !0);
    }, g = e(0), h = {F:e(2), cap:400}, k = {F:e(3), cap:400}, m = {F:e(4), cap:400}, l = {F:e(10), cap:e(12)}, p = e(16), r = async(q, v) => {
      q === 1 ? (q = await v.file.text(), q = a.g.h(q, l), f(10, l.F), f(12, l.cap), f(14, q)) : q === 2 ? v.handle && typeof v.handle.createWritable === "function" && (q = await v.handle.createWritable(), v = (v = e(14)) ? a.g.i(p, p + v) : "", await q.write(v), await q.close()) : q == 3 ? (q = await v.file.arrayBuffer(), v = e(18), q.byteLength > v && (p && a.g.o(p), v = q.byteLength, p = a.g.j(v), f(16, p), f(18, v)), f(20, q.byteLength), a.g.g.set(new Uint8Array(q), p)) : q === 4 && v.handle && 
      typeof v.handle.createWritable === "function" && (q = await v.handle.createWritable(), v = e(20), await q.write(a.g.g.subarray(p, p + v)), await q.close());
    };
    for (let q = 0; q < c.length; q++) {
      const v = c[q];
      a.g.h(v.name, h);
      a.g.h(v.folder, k);
      a.g.h(v.mimeType, m);
      v.isfile ? (f(6, v.size), f(8, v.file.lastModified)) : (f(6, 0), f(8, 0));
      f(1, 0);
      a.g.P(g, 2);
      const t = e(1);
      t && (await r(t, v), a.g.P(g, 2));
    }
  }
}
async function sb(a, b, c, d) {
  a.h && (a = await (await lb(a.h, b, !0))?.getFileHandle(c, {create:!0})) && (a = await a.createWritable(), await a.write(d), await a.close());
}
async function tb(a, b, c, d, e) {
  a.h && (b = await (await lb(a.h, b, !0))?.getFileHandle(c, {create:!0})) && (a = a.g.g.slice(d, d + e), d = await b.createWritable(), await d.write(a), await d.close());
}
async function ub(a, b) {
  if (a.h && b) {
    var c = a.h, d = b, e = b.lastIndexOf("/");
    if (e >= 0 && (c = await lb(a.h, b.slice(0, e)), d = b.slice(e + 1), !c || !d)) {
      return;
    }
    try {
      await c.removeEntry(d);
    } catch (f) {
      console.warn("file_remove", b, f);
    }
  }
}
class vb {
}
var wb = async(a, b) => {
  const c = new vb();
  c.g = a;
  var d = Array(7).fill(0).map((h, k) => a.view.getInt32(b + 4 * k, !0)), e = a.i(d[0], d[1]);
  const f = a.i(d[2], d[3]), g = !!d[6];
  d = await qb({Pa:e, key:f, reload:d[4], ld:g, throw:!g});
  d.handle && (c.h = d.handle);
  e = a.view.getInt32(b + 20, !0);
  a.view.setInt32(e, c.h ? d.persisted ? 1 : 2 : 3, !0);
  return (h, ...k) => {
    switch(h) {
      case 1:
        return rb(c, ...k);
      case 2:
        return sb(c, ...k);
      case 3:
        return tb(c, ...k);
      case 4:
        return ub(c, ...k);
    }
  };
};
function xb() {
  var a = {Wb:document.documentElement};
  let b = a.Wb;
  !b && a.id && (b = document.getElementById(a.id));
  if (!b) {
    throw Error("request_fullscreen with no el");
  }
  b.requestFullscreen();
  const c = d => {
    d = a.ci ? a.ci(d) : !1;
    document.fullscreenElement || d || (document.removeEventListener("fullscreenchange", c), a.di && a.di());
  };
  document.addEventListener("fullscreenchange", c);
}
function yb() {
  const a = document;
  a.exitFullscreen ? a.exitFullscreen() : a.webkitExitFullscreen ? a.webkitExitFullscreen() : a.mozCancelFullScreen ? a.mozCancelFullScreen() : a.msExitFullscreen && a.msExitFullscreen();
}
function zb(a) {
  return new Promise((b, c) => {
    const d = document.createElement("script"), e = (new Date()).toISOString();
    window[e] = f => {
      delete window[e];
      b(f);
    };
    d.type = "module";
    d.textContent = a(e);
    d.onerror = () => {
      c(void 0);
    };
    document.head.appendChild(d);
    document.head.removeChild(d);
  });
}
;function Bb(a, b, c) {
  return d => {
    const e = a[d ?? ""];
    e === void 0 && typeof d === "string" && console.error(`${c} ${d}`);
    return e ?? b;
  };
}
function Cb(a) {
  const b = Object.fromEntries(Object.entries(a).map(([c, d]) => [d, c]));
  return c => b[c];
}
var Db = Cb({arc:1, arcTo:2, bezierCurveTo:3, closePath:4, ellipse:5, lineTo:6, moveTo:7, quadraticCurveTo:8, rect:9, roundRect:10, addPath:11, clearRect:12, fillRect:13, strokeRect:14, getTransform:15, resetTransform:16, rotate:17, scale:18, setTransform:19, transform:20, translate:21, beginPath:22, clip:23, fill:24, isPointInPath:25, isPointInStroke:26, stroke:27, lineCap:28, lineDashOffset:29, lineJoin:30, lineWidth:31, miterLimit:32, getLineDash:33, setLineDash:34, drawImage:35, createImageData:36, 
getImageData:37, putImageData:38, isContextLost:39, reset:40, restore:41, save:42, fillStyle:43, strokeStyle:44, createConicGradient:45, createLinearGradient:46, createPattern:47, createRadialGradient:48, filter:49, globalAlpha:50, globalCompositeOperation:51, imageSmoothingEnabled:52, imageSmoothingQuality:53, getContextAttributes:54, shadowBlur:55, shadowColor:56, shadowOffsetX:57, shadowOffsetY:58, fillText:59, measureText:60, strokeText:61, direction:62, font:63, fontKerning:64, fontStretch:65, 
fontVariantCaps:66, letterSpacing:67, textAlign:68, textBaseline:69, textRendering:70, wordSpacing:71, drawFocusIfNeeded:72, Dc:80, clip_path:81, $i:82, uj:83, Yi:84, tj:85, addColorStop:86, kj:87, Ji:100, Mi:101, Hi:102, Ii:103, Li:104, Ki:105});
const Eb = {copy:1, "source-over":2, "source-in":3, "source-out":4, "source-atop":5, "destination-over":7, "destination-in":8, "destination-out":9, "destination-atop":10, xor:11, lighter:12, multiply:14, screen:15, overlay:16, darken:17, lighten:18, "color-dodge":19, "color-burn":20, "hard-light":21, "soft-light":22, difference:23, exclusion:24, hue:25, saturation:26, color:27, luminosity:28};
var Fb = Bb(Eb, Eb["source-over"], "eglobalCompositeOperation"), Gb = Cb(Eb);
const Hb = {butt:0, round:1, square:2};
var Ib = Bb(Hb, Hb.butt, "eLineCap"), Jb = Cb(Hb);
const Kb = {miter:0, bevel:1, round:2};
var Lb = Bb(Kb, Kb.miter, "eLineJoin"), Mb = Cb(Kb);
Cb({repeat:0, "repeat-x":1, "repeat-y":2, "no-repeat":3});
var Nb = Cb({nonzero:0, evenodd:1});
function Ob() {
  return zb(a => `import  * as _ from '${"https://cdn.jsdelivr.net/npm/canvg@4.0.3/+esm"}'; window['${a}'](_.Canvg);`);
}
function Pb(a) {
  const b = a.getContext("2d");
  b.Dc = () => {
    b.fillRect(0, 0, b.canvas.width, b.canvas.height);
  };
  return b;
}
async function Qb(a, b, c) {
  a = Rb(a, b, c).Tg;
  b = URL.createObjectURL(new Blob([a], {type:"image/svg+xml"}));
  const d = new Image();
  d.src = b;
  await new Promise((e, f) => {
    d.onload = e;
    d.onerror = g => {
      console.error("svgToImage ERRO:", g, "\nsvg:", a);
      f(g);
    };
  });
  return d;
}
function Rb(a, b, c) {
  var d = a.match(/<svg[^>]*\bwidth\s*=\s*["']([^"']+)["']/i), e = a.match(/<svg[^>]*\bheight\s*=\s*["']([^"']+)["']/i);
  d = d ? parseFloat(d[1]) : void 0;
  e = e ? parseFloat(e[1]) : void 0;
  var f = a.match(/viewBox\s*=\s*["'](\d+)\s+(\d+)\s+(\d+)\s+(\d+)["']/);
  const g = f ? parseFloat(f[3]) : void 0;
  f = f ? parseFloat(f[4]) : void 0;
  b = d ?? g ?? b;
  c = e ?? f ?? c;
  return d !== void 0 && e !== void 0 ? {Tg:a, width:b, height:c} : {Tg:a.replace(/<svg\b([^>]*)>/i, `<svg width="${b}" height="${c}"$1>`), width:b, height:c};
}
function Sb(a) {
  a = a.trim().replace(/^#/, "");
  if (a.length === 3 || a.length === 4) {
    var b = [...a].map(c => parseInt(c, 16) * 17);
    return [b[0], b[1], b[2], a.length === 4 ? b[3] : 255];
  }
  b = [...a].map(c => parseInt(c, 16));
  return [b[0] * 16 + b[1], b[2] * 16 + b[3], b[4] * 16 + b[5], a.length >= 8 ? b[6] * 16 + b[7] : 255];
}
function Tb(a) {
  if (a.indexOf("#") > -1) {
    a = Sb(a);
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
function Ub(a) {
  return `rgba(${a >> 24 & 255}, ${a >> 16 & 255}, ${a >> 8 & 255}, ${((a & 255) / 255).toFixed(3)})`;
}
function Vb(a) {
  return ((a[0] ?? 0) & 255) << 24 | ((a[1] ?? 0) & 255) << 16 | ((a[2] ?? 0) & 255) << 8 | (a[3] ?? 255) & 255;
}
;class Wb {
  constructor(a) {
    this.j = a;
    this.C = 0;
    this.i = {F:a.j(256), cap:256};
  }
  g() {
  }
  h() {
  }
  D() {
    this.i.F && (this.j.o(this.i.F), this.i.F = 0);
  }
  arc(a, b, c, d, e, f) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.g(4, e);
    this.g(5, f ? 1 : 0);
    this.h(1);
  }
  arcTo(a, b, c, d, e) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.g(4, e);
    this.h(2);
  }
  bezierCurveTo(a, b, c, d, e, f) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.g(4, e);
    this.g(5, f);
    this.h(3);
  }
  closePath() {
    this.h(4);
  }
  ellipse(a, b, c, d, e, f, g, h) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.g(4, e);
    this.g(5, f);
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
  setTransform(a, b, c, d, e, f) {
    typeof a !== "number" && (b = a.b, c = a.c, d = a.d, e = a.e, f = a.f, a = a.a);
    this.g(0, a ?? 0);
    this.g(1, b ?? 0);
    this.g(2, c ?? 0);
    this.g(3, d ?? 0);
    this.g(4, e ?? 0);
    this.g(5, f ?? 0);
    this.h(19);
  }
  transform(a, b, c, d, e, f) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.g(4, e);
    this.g(5, f);
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
    this.g(0, Ib(a));
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
    this.g(0, Lb(a));
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
      c > this.i.cap && (this.j.o(this.i.F), this.i.cap = c, this.i.F = this.j.j(c));
      for (c = 0; c < b; c++) {
        this.j.view.setFloat64(this.i.F + c * 8, a[c], !0);
      }
      this.g(0, this.i.F);
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
    typeof a === "number" ? (this.g(0, a), this.h(43)) : typeof a === "string" && (this.g(0, Vb(Tb(a))), this.h(43));
  }
  get strokeStyle() {
    return "#000000";
  }
  set strokeStyle(a) {
    typeof a === "number" ? (this.g(0, a), this.h(44)) : typeof a === "string" && (this.g(0, Vb(Tb(a))), this.h(44));
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
    this.g(0, Fb(a));
    this.h(51);
  }
  Dc() {
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
  drawImage(a, b, c, d, e) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.g(4, e);
    this.h(35);
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
    a = this.j.h(a, this.i);
    this.g(0, b);
    this.g(1, c);
    this.g(2, d || 0);
    this.g(3, this.i.F);
    this.g(4, a);
    this.h(59);
  }
  strokeText(a, b, c, d) {
    a = this.j.h(a, this.i);
    this.g(0, b);
    this.g(1, c);
    this.g(2, d || 0);
    this.g(3, this.i.F);
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
    a = this.j.h(a, this.i);
    this.g(0, this.i.F);
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
class Xb extends Wb {
  constructor(a, b, c, d) {
    super(a);
    this.o = b;
    this.F = a.j(72);
    this.canvas = {width:c, height:d};
  }
  g(a, b) {
    this.j.view.setFloat64(this.F + a * 8, b, !0);
    a >= this.C && (this.C = a + 1);
  }
  h(a) {
    this.j.uf(a, this.F, this.o);
    this.C = 0;
  }
  D() {
    this.j.o(this.F);
    this.F = 0;
    super.D();
  }
}
;async function Yb(a, b) {
  var c = new Int32Array(a.buffer, b, 7), d = c[5], e = c[6];
  if (d === 0) {
    b = await Ob(), e > 0 && (a.K[e] = b);
  } else {
    b = a.i(c[0], c[1]);
    var f = c[4], g = c[2];
    c = c[3];
    if (d === 1) {
      d = e > 0 ? a.K[e] : null;
      if (!d) {
        throw Error("CanvgMode.SYNC: canvg n\u00e3o carregado (canvg_ix=" + e + ")");
      }
      a = new Xb(a, f, g, c);
      try {
        d.fromString(a, b).start({enableRedraw:!0, ignoreAnimation:!0, ignoreMouse:!0});
      } finally {
        a.D();
      }
    } else if (d === 2) {
      (e = e > 0 ? a.K[e] : null) || (e = await Ob());
      a = new Xb(a, f, g, c);
      try {
        await e.fromString(a, b).render();
      } finally {
        a.D();
      }
    }
  }
}
async function Zb(a, b) {
  var c = new Int32Array(a.buffer, b, 7);
  b = a.i(c[0], c[1]);
  const d = c[2], e = c[3], f = c[4], g = c[5];
  c = c[6];
  a.K[f] = new OffscreenCanvas(d, e);
  try {
    if (g === 0) {
      const k = await Qb(b, d, e);
      a.K[f] = k;
    } else if (g === 1) {
      const k = c > 0 ? a.K[c] : null;
      if (!k) {
        throw Error("SvgImageMode.SYNC_CANVG: canvg n\u00e3o carregado (canvg_ix=" + c + ")");
      }
      var h = a.K;
      const m = new OffscreenCanvas(d, e), l = Pb(m);
      k.fromString(l, b).start({ignoreAnimation:!0});
      h[f] = m;
    } else if (g === 2) {
      let k = c > 0 ? a.K[c] : null;
      k ||= await Ob();
      const m = new OffscreenCanvas(d, e), l = Pb(m);
      await k.fromString(l, b).render();
      a.K[f] = m;
    }
  } catch (k) {
    console.error("js_svg_image_dispatch ERRO:", k, "\nsvg:", b);
  }
}
;function $b(a, b) {
  var c = new Int32Array(a.buffer, b, 8);
  b = c[0];
  const d = a.i(c[1], c[2]), e = a.i(c[3], c[4]);
  a = c[5] ? a.i(c[5], c[6]) : "";
  c = c[7] & 1 ? "i" : "";
  switch(b) {
    case 0:
      return d.replace(new RegExp(e, "g" + c), a);
    case 1:
      return (new RegExp(e, c)).test(d) ? 1 : 0;
    case 2:
      return (new RegExp(e.startsWith("^") ? e : "^(?:" + e + ")$", c)).test(d) ? 1 : 0;
    case 3:
      return d.match(new RegExp(e, c));
    case 4:
      return d.match(new RegExp(e.startsWith("^") ? e : "^(?:" + e + ")$", c));
    case 5:
      return [...d.matchAll(new RegExp(e, "g" + c))].map(f => f[0]);
    case 6:
      return d.split(new RegExp(e, c));
    default:
      return null;
  }
}
;class ac {
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
var bc = new WeakMap(), cc = new ac();
const dc = {[6]:1, [5]:1, [7]:1, [1]:10, [4]:1, [3]:1, [2]:10, [8]:1, [9]:1, [16]:0, [10]:-100.11, [11]:-100.33, [12]:0, [13]:2, [14]:8, [15]:0};
function ec(a) {
  function b(f) {
    if (d.currentNode.childNodes.length !== f.h.length) {
      return d.firstChild(), new fc(d.currentNode, f);
    }
    if (d.nextSibling()) {
      return new fc(d.currentNode, f.parent);
    }
    d.parentNode();
    if (d.currentNode && f.parent) {
      return f.parent;
    }
  }
  function c(f) {
    f.h = f.h.filter(g => {
      let h = g.node instanceof Text ? g.node.textContent.trim().length > 0 : !0;
      h || f.node.removeChild(g.node);
      return h;
    });
    f.h.forEach(g => c(g));
  }
  let d = document.createTreeWalker(a, NodeFilter.SHOW_ALL), e = a = new fc(a);
  for (; e = b(e), e !== void 0;) {
  }
  c(a);
  return a;
}
function hc(a) {
  let b = [];
  var c = [];
  if (a.node instanceof HTMLElement || a.node instanceof SVGElement) {
    a = a.node.attributes;
    for (c = 0; c < a.length; c++) {
      b.push(a[c]);
    }
    c = b.reduce((d, e) => {
      d.push({key:e.localName, value:e.value});
      return d;
    }, []);
  }
  return c;
}
function ic(a, b) {
  for (let c = 0; c < a.zb.length; c++) {
    if (b === a.zb[c].key) {
      return a.zb[c].value;
    }
  }
}
function jc(a, b) {
  return b ? a.zb.reduce((c, d) => c || d.key === b, !1) : a.node instanceof HTMLElement ? !0 : !1;
}
class fc {
  constructor(a, b) {
    b && (this.parent = b);
    this.node = a;
    this.h = [];
    b && b.h.push(this);
    this.o = null;
    this.zb = hc(this);
    this.j = [];
    a instanceof HTMLElement || a instanceof SVGElement ? (this.g = a, this.i = this.g.localName, a instanceof HTMLInputElement ? (this.j.push({key:"value", value:a.value}), this.j.push({key:"checked", value:a.checked})) : a instanceof HTMLSelectElement ? this.j.push({key:"value", value:a.value}) : a instanceof HTMLTextAreaElement && this.j.push({key:"value", value:a.value})) : a instanceof Text ? (this.i = "-Text", this.o = a.textContent) : a instanceof ShadowRoot ? this.i = "div" : a instanceof 
    Comment ? this.i = "!--" : (this.i = a.constructor.name, console.log("TYPE", a, this.i));
  }
  get id() {
    return ic(this, "id") ?? "";
  }
  get lid() {
    return ic(this, "lid") ?? "";
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
;function kc(a) {
  let b = document.createElement("div");
  if (a.zb) {
    for (let [c, d] of Object.entries(a.zb)) {
      c.startsWith("_") || b.setAttribute(c.replace("_", "-"), d);
    }
  }
  a.parent && a.parent.appendChild(b);
  a.S && a.S(b);
  return b;
}
;const lc = new WeakMap(), mc = new WeakMap();
const nc = "default alias all-scroll auto cell col-resize context-menu copy crosshair e-resize ew-resize grab grabbing help move n-resize ne-resize nesw-resize ns-resize nw-resize nwse-resize no-drop none not-allowed pointer progress row-resize s-resize se-resize sw-resize text url w-resize wait zoom-in zoom-out".split(" ");
var oc = ["lt_cursor$$module$2023$ploft$js_dev$src$frontend$0$domedit"], pc = ca;
oc[0] in pc || typeof pc.execScript == "undefined" || pc.execScript("var " + oc[0]);
for (var qc; oc.length && (qc = oc.shift());) {
  oc.length || nc === void 0 ? pc[qc] && pc[qc] !== Object.prototype[qc] ? pc = pc[qc] : pc = pc[qc] = {} : pc[qc] = nc;
}
;const rc = new WeakMap();
function sc(a, b, c) {
  b = b.trim().split(/\s+/);
  const d = e => !c.includes(e);
  a = a.trim().split(/\s+/).filter(d);
  b = b.filter(d);
  a = new Set(a);
  b = new Set(b);
  if (a.size !== b.size) {
    return !1;
  }
  for (const e of a) {
    if (!b.has(e)) {
      return !1;
    }
  }
  return !0;
}
var tc = (a, b, c, d) => {
  let e = [];
  const f = [];
  c.zb.forEach(k => {
    jc(b, k.key) || e.push(k.key);
  });
  let g = !1, h = [];
  if (d.kg) {
    const k = (ic(c, "class") ?? "").trim().split(/\s+/);
    d.kg.class.trim().split(/\s+/).every(m => k.includes(m)) && (g = !0, h = d.kg.keys);
  }
  g && (e = e.filter(k => !h.includes(k)));
  b.zb.forEach(k => {
    const m = ic(c, k.key);
    g && h.includes(k.key) || (k.key === "class" ? sc(k.value, m ?? "", d.ij ?? []) || f.push(k) : m !== k.value && f.push(k));
  });
  e.length && a.g.push({step:6, Da:e.length, S:() => e.forEach(k => c.g.removeAttribute(k))});
  f.length && a.g.push({step:5, Da:f.length, S:() => f.forEach(k => c.g.setAttribute(k.key, k.value))});
};
function uc(a, b, c, d) {
  b.i !== c.i && (a.status = 1);
  a.status !== 1 && (tc(a, b, c, d), vc(a, b, c), wc(a, b, c), xc(a, b, c));
}
function yc(a, b, c, d) {
  let e = lc.get(b.g);
  if (e) {
    var f = lc.get(c.g);
    f ? a.g.push({step:13, Da:1, S:() => {
      zc(e, f, d);
    }}) : a.g.push({step:14, Da:1, S:() => {
      f = c.g.attachShadow({mode:e.mode});
      lc.set(c.g, f);
      zc(e, f, d);
    }});
  }
}
function Ac(a, b, c, d) {
  let e = b.h.map(() => !1), f = c.h.map(() => !1), g = [], h = [];
  b.h.forEach((l, p) => {
    e[p] || c.h.forEach((r, q) => {
      e[p] || f[q] || (r = new Bc(l, r, d), r.status !== 1 && (r.status === 4 || r.h === 0 ? (e[p] = !0, f[q] = !0, g.push({qb:p, qd:q, Hc:q}), r.status === 4 ? a.o++ : a.j++, a.i.push(r)) : h.push({hf:p, se:q, wd:r, bj:r.h, selected:!1})));
    });
  });
  h.length > 0 && (h = h.sort((l, p) => l.wd.h < p.wd.h ? -1 : l.wd.h === p.wd.h ? 0 : 1), h.forEach(l => {
    e[l.hf] || f[l.se] || (e[l.hf] = !0, f[l.se] = !0, l.selected = !0, g.push({qb:l.hf, qd:l.se, Hc:l.se}), a.i.push(l.wd));
  }));
  let k = f.reduce((l, p, r) => p ? l : [...l, r], []);
  k.length && (a.g.push({step:2, Da:k.length, S:() => k.forEach(l => {
    c.node.removeChild(c.h[l].node);
  })}), k.forEach(l => {
    g = g.map(p => l > p.qd ? p : {qb:p.qb, qd:p.qd, Hc:p.Hc - 1});
  }));
  let m = e.reduce((l, p, r) => p ? l : [...l, r], []);
  m.length && (a.g.push({step:1, Da:m.length, S:() => m.forEach(l => {
    l = b.h[l].node;
    c.node.appendChild(l);
    cc.i || Cc(l);
  })}), m.forEach(l => g.push({qb:l, qd:Number.NaN, Hc:g.length})));
  if (g.reduce((l, p) => l || p.Hc !== p.qb, !1)) {
    let l = g.sort((p, r) => p.qb < r.qb ? -1 : p.qb === r.qb ? 0 : 1).map(p => p.Hc);
    a.g.push({step:3, Da:1, S:() => {
      for (let p = 0; p < l.length; p++) {
        if (p != l[p]) {
          let r = l[p];
          if (c.node instanceof HTMLElement || c.node instanceof SVGElement) {
            let q = c.node.childNodes[p], v = c.node.childNodes[r];
            l.splice(p, 1, p);
            l = l.map(t => t + (t >= p && t < r ? 1 : 0));
            c.node.insertBefore(v, q);
          }
        }
      }
    }});
  }
}
function Dc(a) {
  if (a.status === 1) {
    return 0;
  }
  let b = 0;
  a.g.forEach(c => b += dc[c.step] * c.Da);
  b += dc[10] * a.j;
  b += dc[11] * a.o;
  a.i.forEach(c => b += c.h);
  return b;
}
function vc(a, b, c) {
  let d = b.j.reduce((e, f) => {
    var g;
    a: {
      for (g = 0; g < c.j.length; g++) {
        if (f.key === c.j[g].key) {
          g = c.j[g].value;
          break a;
        }
      }
      g = void 0;
    }
    g !== f.value && e.push(f);
    return e;
  }, []);
  d.length && a.g.push({step:7, Da:d.length, S:() => d.forEach(e => {
    c.node instanceof HTMLInputElement && (e.key === "value" && (c.node.value = e.value), e.key === "checked" && (c.node.checked = e.value));
    c.node instanceof HTMLSelectElement && e.key === "value" && (c.node.value = e.value);
    c.node instanceof HTMLTextAreaElement && e.key === "value" && (c.node.value = e.value);
  })});
}
function wc(a, b, c) {
  b.o !== c.o && a.g.push({step:4, Da:1, S:() => {
    c.node.textContent = b.o;
  }});
}
function xc(a, b, c) {
  let d = cc.g.get(b.node) ?? [], e = cc.g.get(c.node) ?? [], f = [], g = [], h = [];
  e.forEach((k, m) => {
    let l = !0;
    d.forEach((p, r) => {
      k.event === p.event && (k.hash !== void 0 || p.hash !== void 0 ? k.hash === p.hash && (l = !1, k.S !== p.S && h.push({Ci:m, yi:r})) : k.S === p.S && (l = !1));
    });
    l && f.push(m);
  });
  d.forEach((k, m) => {
    let l = !0;
    e.forEach(p => {
      p.event === k.event && (p.hash !== void 0 || k.hash !== void 0 ? p.hash === k.hash && (l = !1) : p.S === k.S && (l = !1));
    });
    l && g.push(m);
  });
  f.length && a.g.push({step:9, Da:f.length, S:() => {
    f.forEach(k => c.node.removeEventListener(e[k].event, e[k].S));
    f.sort((k, m) => k < m ? 1 : m < k ? -1 : 0).forEach(k => e.splice(k, 1));
    cc.g.set(c.node, e);
  }});
  g.length && a.g.push({step:8, Da:g.length, S:() => {
    g.forEach(k => {
      c.node.addEventListener(d[k].event, d[k].S);
      e.push({event:d[k].event, S:d[k].S, hash:d[k].hash});
      cc.g.set(c.node, e);
    });
  }});
  h.length && a.g.push({step:16, Da:h.length, S:() => {
    h.forEach(k => {
      const m = e[k.Ci];
      k = d[k.yi];
      c.node.removeEventListener(m.event, m.S);
      c.node.addEventListener(k.event, k.S);
      m.S = k.S;
    });
    cc.g.set(c.node, e);
  }});
}
function Ec(a) {
  a.i.forEach(b => {
    Ec(b);
  });
  a.g.forEach(b => {
    try {
      b.S();
    } catch (c) {
      console.error(b.step, c);
    }
  });
}
class Bc {
  constructor(a, b, c) {
    this.g = [];
    this.status = 2;
    this.i = [];
    this.h = Number.NaN;
    this.o = this.j = 0;
    this.g.push({step:15, S:() => {
      const d = a.g, e = b.g;
      d && e && rc.set(d, e);
    }, Da:1});
    if (c.Od !== !0) {
      if (a.id) {
        if (a.id === b.id) {
          if (this.status = 4, rc.set(a.g, b.g), (c.cj ?? []).includes(a.id)) {
            return;
          }
        } else {
          this.status = 1;
          return;
        }
      } else if (a.lid) {
        if (a.lid === b.lid) {
          this.status = 4, rc.set(a.g, b.g);
        } else {
          this.status = 1;
          return;
        }
      } else if (b.id || b.lid) {
        this.status = 1;
        return;
      }
      uc(this, a, b, c);
      if (this.status === 1) {
        return;
      }
    }
    yc(this, a, b, {...c, Od:!0});
    this.status !== 1 && (Ac(this, a, b, {...c, Od:!1}), this.h = Dc(this));
  }
}
function Cc(a) {
  let b = mc.get(a);
  b && (b(a), mc.delete(a));
  a.childNodes.forEach(Cc);
}
function zc(a, b, c) {
  let d = typeof a !== "string" ? a : kc({S:f => f.innerHTML = a});
  b instanceof ShadowRoot && d instanceof HTMLElement && d.attributes.length && (d = kc({S:f => f.appendChild(d)}));
  let e = ec(d);
  b = ec(b);
  Ec(new Bc(e, b, c));
}
;const Fc = new Set("svg path symbol circle ellipse line polyline polygon rect g defs use clipPath mask pattern linearGradient radialGradient stop text tspan textPath image foreignObject marker filter feBlend feColorMatrix feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDropShadow feFlood feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset feSpecularLighting feTile feTurbulence animate animateMotion animateTransform set desc title metadata".split(" ")), Gc = new WeakMap(), 
Hc = new WeakMap();
function Ic(a) {
  if (!a) {
    return null;
  }
  if (a.isConnected) {
    return a;
  }
  for (; a;) {
    let b = rc.get(a);
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
async function Jc(a) {
  a = a.o;
  let b = a.length;
  for (let c = 0; c < b; c++) {
    const d = a[c].Ba;
    d && await d();
    a[c].ua.forEach(e => {
      (e = e.g) && Hc.set(e, !0);
    });
  }
  a.length = 0;
}
async function Kc(a, b, c) {
  if (typeof b === "string" || typeof b === "number") {
    return c && c.appendChild(document.createTextNode(String(b))), null;
  }
  if (!b) {
    return null;
  }
  a.o?.push(b);
  b.o = a.o;
  a = await b.P(c);
  Gc.set(b, {parent:c ?? null, Wb:a});
  return a;
}
async function Lc(a, b) {
  var c = a.j;
  var d = c?.[0];
  c = (c?.length ?? 0) === 1 && typeof d === "function" ? d() : c ?? [];
  d = c.length;
  for (let e = 0; e < d; e++) {
    await Kc(a, c[e], b);
  }
}
class Mc {
  constructor(a) {
    this.va = a ?? {};
    this.j = [];
    this.ta = {};
    this.ua = [];
    this.T = this.da = !1;
  }
  async refresh() {
    if (!this.da) {
      var a = Gc.get(this);
      if (a) {
        a.Wb = Ic(a.Wb);
        a.parent = Ic(a.parent);
        if (!a.Wb) {
          throw Error("no root to update");
        }
        var b = a.parent ? a.parent.cloneNode(!1) : null;
        this.o = [this];
        (b = await this.P(b ?? void 0)) && zc(b, a.Wb, {Od:!1, ...this.ta});
        await Jc(this);
      } else {
        this.T = !0;
      }
    }
  }
  render() {
    return null;
  }
  async P(a) {
    const b = await this.render();
    return b ? Kc(this, b, a) : null;
  }
}
class Nc extends Mc {
  create(a) {
    if (!this.g) {
      return null;
    }
    const b = Fc.has(this.g) ? document.createElementNS("http://www.w3.org/2000/svg", this.g) : document.createElement(this.g);
    for (let [f, g] of Object.entries(this.va ?? {})) {
      if (f === "className" && (f = "class"), f === "style") {
        var c = [], d = g;
        for (let [h, k] of Object.entries(d)) {
          c.push(`${Oc(h)}:${k}`);
        }
        b.setAttribute(f, c.join(";"));
      } else if (f.startsWith("on")) {
        c = f.substring(2).toLowerCase();
        d = g;
        b.addEventListener(c, d);
        var e = cc;
        let h = e.g.get(b);
        h || (h = [], e.g.set(b, h));
        if (!bc.has(d)) {
          e = d.toString();
          let k = 0;
          for (let m = 0; m < e.length; m++) {
            k = (k << 5) - k + e.charCodeAt(m), k |= 0;
          }
          bc.set(d, k);
        }
        e = bc.get(d);
        h.push({event:c, S:d, hash:e});
      } else {
        f === "ref" ? g.h = b : g !== null && g !== void 0 && (g !== !1 || f.startsWith("aria-") || f.startsWith("data-")) && b.setAttribute(String(f), String(g));
      }
    }
    a && a.appendChild(b);
    return b;
  }
  async P(a) {
    (a = this.create(a)) && await Lc(this, a);
    return a;
  }
}
function Oc(a) {
  return a.replace(/[A-Z]/g, b => `-${b.toLowerCase()}`);
}
function Pc(a) {
  const b = fa([]);
  a.j ? b.length && a.j.push(...b) : a.j = b;
  return a;
}
function n(a, b, ...c) {
  b = new Nc(b);
  b.g = a;
  c && (b.j = fa(c));
  return b;
}
class Qc {
  static get g() {
    return Mc;
  }
}
;async function Rc(a, b) {
  const c = b.cloneNode(!1);
  a.o = [a];
  const d = await a.P(c);
  Gc.set(a, {parent:c, Wb:d});
  zc(c, b, {Od:!1});
  await Jc(a);
  a.T && (a.T = !1, await a.refresh());
}
;const Sc = new Map();
async function Tc(a, b, c) {
  const d = Sc.get(b);
  return d ? d(a, c) : (console.error("jsx_dispatch: componente nao registrado, id=" + b), null);
}
;const Uc = [1];
function Vc(a) {
  return a.g === 2 && Uc.indexOf(a.m) !== -1;
}
const Wc = new ArrayBuffer(8), Xc = new Float64Array(Wc), Yc = new Uint32Array(Wc);
function u(a) {
  Yc[0] = a;
  Yc[1] = 2146959360;
  return Xc[0];
}
function Zc(a) {
  if (!Number.isNaN(a)) {
    return -1;
  }
  Xc[0] = a;
  return Yc[1] !== 2146959360 ? -1 : Yc[0];
}
function w(a) {
  const b = arguments.length, c = [null];
  c.length = b;
  for (let d = 0; d < b; d++) {
    c[d] = arguments[d];
  }
  return c;
}
class $c {
  constructor(a) {
    this.Ja = a;
  }
}
class y {
  constructor(a, b, c, d, e) {
    this.g = a;
    this.i = b;
    this.m = c;
    this.a = d;
    this.h = e;
  }
}
;class ad {
  constructor(a, b) {
    this.t = a;
    this.m = b === void 0 ? -1 : b;
  }
}
;function bd(a, b) {
  if (b === b) {
    return 0;
  }
  a.o[0] = b;
  return (a.j[1] & 2146959360) !== 2146959360 ? 0 : a.j[0];
}
function cd(a, b) {
  const c = bd(a, b);
  c && (a.g.add(c), a.h.add(c));
  return b;
}
class dd {
  constructor() {
    this.i = new ArrayBuffer(8);
    this.o = new Float64Array(this.i);
    this.j = new Uint32Array(this.i);
    this.g = new Set();
    this.h = new Set();
  }
  track(a) {
    const b = bd(this, a);
    b && b < 8192 && this.g.add(b);
    return a;
  }
  clear() {
    this.g.clear();
    this.h.clear();
  }
}
;function ed(a, b, c, d) {
  a = a.g;
  C(a, b, c ?? 0, d ?? 0);
  return cd(a.o, D(a));
}
class fd {
  constructor(a) {
    this.g = a;
  }
  V(a, b) {
    return ed(this, 207, a, b);
  }
  hd(a, b) {
    return ed(this, 206, a, b);
  }
  Gb(a) {
    const b = this.g;
    C(b, 208, a ?? 0);
    return new gd(b, D(b));
  }
  table(a) {
    const b = this.g;
    C(b, 212, a ?? 0);
    return new hd(b, D(b));
  }
  local(a, b) {
    const c = this.g;
    b ? (b = c.j.h(b, c.i), c.g(0, a ?? 0), c.g(1, c.i.F), c.g(2, b), c.h(205)) : a !== void 0 ? (c.g(0, a), c.h(202)) : c.h(204);
    return cd(c.o, D(c));
  }
  text(a, b) {
    const c = this.g;
    a = c.j.h(a ?? "", c.i);
    c.g(0, b ?? 0);
    c.g(1, c.i.F);
    c.g(2, a);
    c.h(216);
    return new ad(-1, G(c, 0));
  }
  map(a) {
    const b = this.g;
    C(b, 213, a ?? 0);
    return new id(b, D(b));
  }
  Ma(a) {
    const b = this.g;
    C(b, 214, a ?? 0);
    return new jd(b, D(b));
  }
  Na(a) {
    const b = this.g;
    C(b, 215, a);
    return new kd(b, G(b, 0), G(b, 1));
  }
}
class ld {
  constructor(a) {
    this.g = a;
  }
  map(a) {
    a && console.error("create.map: catalogo nao tem access_key");
    this.g.h(130);
    return new id(this.g, D(this.g));
  }
  table(a) {
    a && console.error("create.table: catalogo nao tem access_key");
    this.g.h(136);
    return new hd(this.g, D(this.g));
  }
  Ma(a) {
    a && console.error("create.array: catalogo nao tem access_key");
    this.g.h(530);
    return new jd(this.g, D(this.g));
  }
}
class md {
  constructor(a) {
    this.g = a;
    this.Y = new fd(a);
  }
  i(a, b) {
    const c = this.g;
    a = a || [];
    a.length > 18 && console.error(`alloc_array: ${a.length} valores excede o maximo ${18} da ponte`);
    const d = Math.min(a.length, 18);
    c.g(0, b ?? 0);
    c.g(1, d);
    for (b = 0; b < d; b++) {
      c.g(2 + b, a[b]);
    }
    c.h(203);
    return cd(c.o, D(c));
  }
  add(a, b) {
    const c = this.g;
    c.g(0, a);
    c.g(1, b);
    c.h(220);
    return c.o.track(D(c));
  }
  sub(a, b) {
    const c = this.g;
    c.g(0, a);
    c.g(1, b);
    c.h(221);
    return c.o.track(D(c));
  }
  h(a, b) {
    const c = this.g;
    c.g(0, a);
    c.g(1, b);
    c.h(222);
    return c.o.track(D(c));
  }
  j(a, b) {
    const c = this.g;
    c.g(0, a);
    c.g(1, b);
    c.h(223);
    return c.o.track(D(c));
  }
  o(a, b) {
    const c = this.g;
    c.g(0, a);
    c.g(1, b);
    c.h(224);
    return c.o.track(D(c));
  }
  set(a, b) {
    const c = this.g;
    c.g(0, a);
    c.g(1, b);
    c.h(210);
  }
  D(a, b, c, d) {
    const e = this.g;
    e.g(0, a);
    e.g(1, b);
    e.g(2, c);
    e.g(3, d);
    e.h(211);
  }
  sin(a) {
    const b = this.g;
    b.g(0, a);
    b.h(240);
    return b.o.track(D(b));
  }
  cos(a) {
    const b = this.g;
    b.g(0, a);
    b.h(241);
    return b.o.track(D(b));
  }
  C(a, b) {
    const c = this.g;
    a = c.j.h(a, c.i);
    c.g(0, c.i.F);
    c.g(1, a);
    c.g(2, b);
    c.h(230);
  }
  H(a) {
    return cd(this.g.o, a);
  }
}
class nd {
  constructor(a) {
    this.g = a;
  }
  fd(a, b, c) {
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
  $c(a, b, c) {
    const d = this.g;
    d.g(0, a);
    d.g(1, b);
    d.g(2, c);
    d.h(302);
  }
  Zc() {
    this.g.h(303);
  }
  bd() {
    this.g.h(304);
  }
  dd(a, b, c) {
    const d = this.g;
    d.g(0, a);
    d.g(1, b);
    d.g(2, c);
    d.h(310);
    return cd(d.o, D(d));
  }
  ad() {
    this.g.h(311);
  }
  Sc() {
    this.g.h(312);
  }
  Yc() {
    this.g.h(313);
  }
}
class gd {
  constructor(a, b) {
    this.g = a;
    this.slot = b;
  }
  data(a, b) {
    const c = this.g;
    c.g(0, this.slot);
    c.g(1, a);
    c.g(2, b ?? 0);
    c.h(209);
    return c.o.track(D(c));
  }
}
function od(a, b, c, d, e, f) {
  const g = a.h, h = e ? g.j.h(e, g.i) : 0;
  g.g(0, a.g);
  g.g(1, b);
  g.g(2, c);
  g.g(3, d);
  g.g(4, e ? g.i.F : 0);
  g.g(5, h);
  g.g(6, f);
  g.h(514);
  return a;
}
class id {
  constructor(a, b) {
    this.h = a;
    this.g = b;
  }
  get ref() {
    return this.g;
  }
  create(a) {
    const b = this.h;
    a ? (a = b.j.h(a, b.i), b.g(0, this.g), b.g(1, 1), b.g(2, b.i.F), b.g(3, a)) : (b.g(0, this.g), b.g(1, 2), b.g(2, 0), b.g(3, 0));
    b.g(4, 12);
    b.h(131);
  }
  get(a, b) {
    const c = this.h;
    c.g(0, this.g);
    c.g(1, a);
    c.g(2, b ?? 0);
    c.h(500);
    return cd(c.o, D(c));
  }
  set(a, b) {
    const c = this.h;
    c.g(0, this.g);
    c.g(1, a);
    c.g(2, b);
    c.h(501);
  }
  qg(a, b, c) {
    return od(this, a, 2, b ?? 0, "", c ?? 0);
  }
  ng(a, b, c) {
    return od(this, a, 1, b ?? 0, "", c ?? 0);
  }
  rg(a, b, c) {
    return od(this, a, 3, 0, b ?? "", c ?? 0);
  }
  Na(a) {
    const b = this.h;
    C(b, 538, this.g, a);
    return new pd(D(b));
  }
}
class jd {
  constructor(a, b) {
    this.h = a;
    this.g = b;
  }
  get ref() {
    return this.g;
  }
  create(a) {
    const b = this.h;
    this.g < 0 ? console.error("array.create: membro nao tem entrada de catalogo") : (a ? (a = b.j.h(a, b.i), b.g(0, this.g), b.g(1, 1), b.g(2, b.i.F), b.g(3, a)) : (b.g(0, this.g), b.g(1, 2), b.g(2, 0), b.g(3, 0)), b.g(4, 13), b.h(131));
  }
  get(a, b) {
    const c = this.h;
    C(c, 531, this.g, a, b ?? 0);
    return cd(c.o, D(c));
  }
  set(a, b) {
    C(this.h, 532, this.g, a, b);
  }
  size() {
    const a = this.h;
    C(a, 533, this.g);
    return cd(a.o, D(a));
  }
  resize(a) {
    C(this.h, 534, this.g, a);
  }
  push(a) {
    C(this.h, 535, this.g, a);
  }
  clear() {
    C(this.h, 536, this.g);
  }
  Na(a) {
    const b = this.h;
    C(b, 537, this.g, a);
    return new pd(D(b));
  }
}
class kd {
  constructor(a, b, c) {
    this.g = a;
    this.id = b;
    this.h = c;
  }
  get slot() {
    return this.h;
  }
  table() {
    const a = this.g;
    C(a, 539, this.id);
    return new hd(a, D(a));
  }
  Ma() {
    const a = this.g;
    C(a, 540, this.id);
    return new jd(a, D(a));
  }
  map() {
    const a = this.g;
    C(a, 541, this.id);
    return new id(a, D(a));
  }
}
class pd {
  constructor(a) {
    this.g = a;
  }
  get id() {
    return this.g;
  }
}
class hd {
  constructor(a, b) {
    this.h = a;
    this.g = b;
  }
  get ref() {
    return this.g;
  }
  create(a) {
    const b = this.h;
    this.g < 0 ? console.error("PTable.create: alca de membro") : (a ? (a = b.j.h(a, b.i), b.g(0, this.g), b.g(1, 1), b.g(2, b.i.F), b.g(3, a)) : (b.g(0, this.g), b.g(1, 2), b.g(2, 0), b.g(3, 0)), b.g(4, 4), b.h(131));
  }
  text(a, b, c) {
    const d = this.h;
    d.g(0, this.g);
    d.g(1, a);
    d.g(2, b);
    d.g(3, c ?? 0);
    d.h(505);
    return new ad(G(d, 0));
  }
  Xc(a) {
    const b = this.h;
    b.g(0, this.g);
    b.g(1, a);
    b.h(515);
    return new ad(G(b, 0));
  }
  V(a, b) {
    const c = this.h;
    c.g(0, this.g);
    c.g(1, a);
    c.g(2, b);
    c.h(506);
    return cd(c.o, D(c));
  }
  rows() {
    const a = this.h;
    a.g(0, this.g);
    a.g(1, 0);
    a.h(507);
    return cd(a.o, D(a));
  }
  cols() {
    const a = this.h;
    a.g(0, this.g);
    a.g(1, 1);
    a.h(507);
    return cd(a.o, D(a));
  }
  init(a, b) {
    const c = this.h;
    c.g(0, this.g);
    c.g(1, a);
    c.g(2, b);
    c.h(513);
  }
  lc(a, b, c) {
    const d = this.h;
    d.g(0, this.g);
    d.g(1, a);
    d.g(2, b);
    d.g(3, c);
    d.h(508);
  }
  La(a, b, c) {
    const d = this.h;
    d.g(0, this.g);
    d.g(1, a);
    d.g(2, b);
    d.g(3, c.t);
    d.h(509);
  }
}
class qd {
  constructor(a) {
    this.g = a;
  }
  h() {
    this.g.h(136);
    return new hd(this.g, D(this.g));
  }
}
function rd(a) {
  var b = a.g, c = a.src;
  b.g.g(0, a.slot);
  b.g.g(1, c);
  H(b, 870);
}
function sd(a, b, c, d) {
  const e = a.g.g;
  e.g(0, b);
  e.g(1, c);
  e.g(2, d);
  e.g(3, 0);
  H(a.g, 952);
  return G(e, 0);
}
class td {
  constructor(a, b, c) {
    this.g = a;
    this.slot = b;
    this.src = c;
  }
  init(a, b) {
    rd(this);
    var c = this.g;
    c.g.g(0, a);
    c.g.g(1, b);
    H(c, 871);
  }
  lc(a, b, c) {
    rd(this);
    var d = this.g;
    d.g.g(0, a);
    d.g.g(1, b);
    d.g.g(2, c);
    H(d, 872);
  }
  La(a, b, c) {
    rd(this);
    var d = this.g;
    const e = d.g;
    e.g(0, a);
    e.g(1, b);
    typeof c === "string" ? (a = e.j.h(c, e.i), e.g(2, 1), e.g(3, e.i.F), e.g(4, a)) : (e.g(2, 0), e.g(3, c), e.g(4, 0));
    H(d, 873);
  }
  Kg(a, b) {
    rd(this);
    var c = this.g;
    c.g.g(0, a);
    c.g.g(1, b);
    H(c, 878);
    return G(c.g, 0);
  }
  dc(a, b, c) {
    rd(this);
    var d = this.g;
    d.g.g(0, a);
    d.g.g(1, b);
    d.g.g(2, c ?? 0);
    d.g.g(3, c === void 0 ? 0 : 1);
    H(d, 879);
    return G(d.g, 0);
  }
  rows() {
    rd(this);
    return ud(this.g, 0);
  }
  cols() {
    rd(this);
    return ud(this.g, 1);
  }
  Xc(a) {
    rd(this);
    var b = this.g;
    b.g.g(0, a);
    H(b, 894);
    return G(b.g, 0);
  }
  apply(a, b, c) {
    rd(this);
    b = b || {};
    var d = b.G || null, e = b.src || null, f = b.env || null, g = b.Vi || null;
    b = this.g;
    var h = d ? d.slot : -1;
    d = d ? d.src : 0;
    var k = e ? e.slot : -1;
    e = e ? e.src : 0;
    var m = f ? f.slot : -1;
    f = f ? f.src : 0;
    c = c !== void 0 ? c : 0;
    var l = g ? g.slot : -1;
    g = g ? g.src : 0;
    const p = b.g;
    p.g(0, a);
    p.g(1, h);
    p.g(2, d);
    p.g(3, k);
    p.g(4, e);
    p.g(5, m);
    p.g(6, f);
    p.g(8, l);
    p.g(9, g);
    p.g(10, c);
    H(b, 928);
  }
  jg(a) {
    rd(this);
    var b = this.g;
    const c = b.g;
    typeof a === "string" ? (a = c.j.h(a, c.i), c.g(0, 1), c.g(1, c.i.F), c.g(2, a)) : (c.g(0, 0), c.g(1, a), c.g(2, 0));
    H(b, 895);
    return G(c, 0);
  }
  Wf(a) {
    rd(this);
    return vd(this.g, a, 0);
  }
  Vf(a) {
    rd(this);
    return vd(this.g, a, 1);
  }
  open(a) {
    wd(this.g, this.slot, this.src, a);
  }
  status() {
    return xd(this.g, this.slot, this.src);
  }
  Cc() {
    return yd(this.g, this.slot, this.src);
  }
  index() {
    this.src !== 0 && console.error("act.table.index: so catalogo (membro: leia o slot por read_data)");
    var a = this.g;
    a.g.g(0, this.slot);
    H(a, 888);
    return G(a.g, 0);
  }
  find(a, b) {
    rd(this);
    return sd(this, 134, a, b);
  }
  count(a, b) {
    rd(this);
    return sd(this, 135, a, b);
  }
}
class zd {
  constructor(a, b, c) {
    this.g = a;
    this.slot = b;
    this.src = c;
  }
  get(a, b) {
    var c = this.g, d = this.src;
    c.g.g(0, this.slot);
    c.g.g(1, d);
    H(c, 877);
    return this.g.$e(a, b);
  }
  set(a, b) {
    var c = this.g, d = this.src;
    c.g.g(0, this.slot);
    c.g.g(1, d);
    H(c, 877);
    this.g.af(a, b);
  }
}
function Ad(a) {
  var b = a.g, c = a.src;
  b.g.g(0, a.slot);
  b.g.g(1, c);
  H(b, 903);
}
class Bd {
  constructor(a, b, c) {
    this.g = a;
    this.slot = b;
    this.src = c;
  }
  open(a) {
    wd(this.g, this.slot, this.src, a);
  }
  h(a) {
    var b = this.g, c = this.slot, d = this.src;
    const e = b.g;
    a = e.j.h(a, e.i);
    e.g(0, c);
    e.g(1, d);
    e.g(2, e.i.F);
    e.g(3, a);
    e.g(4, 1);
    e.g(5, 0);
    H(b, 897);
  }
  status() {
    return xd(this.g, this.slot, this.src);
  }
  Cc() {
    return yd(this.g, this.slot, this.src);
  }
  get(a, b) {
    Ad(this);
    var c = this.g;
    b = b ?? 0;
    c.g.g(0, a);
    c.g.g(1, b);
    H(c, 904);
    return G(c.g, 0);
  }
  set(a, b) {
    Ad(this);
    var c = this.g;
    c.g.g(0, a);
    c.g.g(1, b);
    H(c, 905);
  }
  size() {
    Ad(this);
    return Cd(this.g, 1);
  }
  resize(a) {
    Ad(this);
    Dd(this.g, 2, a);
  }
  push(a) {
    Ad(this);
    Dd(this.g, 3, a);
  }
  clear() {
    Ad(this);
    Dd(this.g, 4, 0);
  }
  fill(a) {
    Ad(this);
    Dd(this.g, 6, a);
  }
  find(a) {
    Ad(this);
    return Cd(this.g, 8, a);
  }
}
class Ed {
  constructor(a, b) {
    this.g = a;
    this.h = b;
    this.create = {table:() => new td(a, Fd(a, b, 4), 2), Ma:() => new Bd(a, Fd(a, b, 13), 2), map:() => new zd(a, Fd(a, b, 12), 2)};
  }
  get slot() {
    return this.h;
  }
  V() {
    return Gd(this.g, this.h, 0);
  }
  text() {
    return Gd(this.g, this.h, 1);
  }
  type() {
    return Gd(this.g, this.h, 2);
  }
  Ob() {
    return Gd(this.g, this.h, 3);
  }
  set(a) {
    var b = this.g;
    b.g.g(0, this.h);
    b.g.g(1, 0);
    b.g.g(2, a);
    H(b, 910);
  }
  xi(a) {
    a = typeof a === "string" ? this.g.kf(a) : a;
    var b = this.g;
    b.g.g(0, this.h);
    b.g.g(1, 1);
    b.g.g(2, a);
    H(b, 910);
  }
}
class Hd {
  constructor(a, b) {
    this.g = a;
    this.h = b;
  }
  get(a) {
    var b = this.g;
    b.g.g(0, this.h);
    b.g.g(1, a);
    H(b, 890);
    return G(b.g, 0);
  }
  write(a, b) {
    var c = this.g;
    c.g.g(0, this.h);
    c.g.g(1, a);
    c.g.g(2, b);
    H(c, 891);
  }
  i(a, b) {
    var c = this.g;
    c.g.g(0, this.h);
    c.g.g(1, a);
    c.g.g(2, b);
    H(c, 892);
  }
  La(a, b) {
    var c = this.g;
    c.g.g(0, this.h);
    c.g.g(1, a);
    c.g.g(2, b);
    H(c, 926);
  }
  dc(a) {
    var b = this.g;
    b.g.g(0, this.h);
    b.g.g(1, a);
    H(b, 930);
    return G(b.g, 0);
  }
}
function ud(a, b) {
  a.g.g(0, b);
  H(a, 880);
  return G(a.g, 0);
}
function vd(a, b, c) {
  a.g.g(0, b);
  a.g.g(1, c);
  H(a, 896);
  return G(a.g, 0);
}
function wd(a, b, c, d) {
  const e = a.g;
  d = e.j.h(d, e.i);
  e.g(0, b);
  e.g(1, c);
  e.g(2, e.i.F);
  e.g(3, d);
  e.g(4, 0);
  e.g(5, 0);
  H(a, 897);
}
function xd(a, b, c) {
  a.g.g(0, b);
  a.g.g(1, c);
  H(a, 898);
  return G(a.g, 0);
}
function yd(a, b, c) {
  a.g.g(0, b);
  a.g.g(1, c);
  H(a, 899);
  return G(a.g, 0);
}
function H(a, b) {
  a.g.g(7, a.h);
  a.g.h(b);
}
function Cd(a, b, c) {
  a.g.g(0, b);
  a.g.g(1, c === void 0 ? 0 : c);
  H(a, 907);
  return G(a.g, 0);
}
function Dd(a, b, c) {
  a.g.g(0, b);
  a.g.g(1, c);
  H(a, 906);
}
function Fd(a, b, c) {
  a.g.g(0, b);
  a.g.g(1, c);
  H(a, 911);
  return G(a.g, 0);
}
function Gd(a, b, c) {
  a.g.g(0, b);
  a.g.g(1, c);
  H(a, 909);
  return G(a.g, 0);
}
function Id(a, b) {
  a = a.g;
  typeof b === "string" ? (b = a.j.h(b, a.i), a.g(0, 1), a.g(1, a.i.F), a.g(2, b)) : (a.g(0, 0), a.g(1, b), a.g(2, 0));
}
function Jd(a, b, c) {
  a.g.g(0, c);
  H(a, b);
  return [G(a.g, 0), G(a.g, 1)];
}
class Kd {
  constructor(a, b) {
    this.g = a;
    this.h = b;
    this.Y = {local:c => {
      a.g(0, c !== void 0 ? c : 0);
      H(this, 801);
      return G(a, 0);
    }, V:(c, d, e) => a.M.Y.V(c, d, e), hd:(c, d, e) => a.M.Y.hd(c, d, e), text:(c, d) => a.M.Y.text(c, d), table:c => a.M.Y.table(c), map:c => a.M.Y.map(c), Ma:c => a.M.Y.Ma(c), Gb:(c, d) => a.M.Y.Gb(c, d), Na:c => a.M.Y.Na(c)};
  }
  Ig(a) {
    this.g.g(0, a);
    H(this, 810);
    return G(this.g, 0);
  }
  sh(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 811);
  }
  $e(a, b) {
    this.g.g(0, a);
    this.g.g(1, b ?? 0);
    this.g.g(2, b === void 0 ? 0 : 1);
    H(this, 812);
    return G(this.g, 0);
  }
  af(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 813);
  }
  Hg(a) {
    this.g.g(0, a);
    H(this, 818);
    return G(this.g, 0);
  }
  Mf(a, b, c) {
    this.g.g(0, a);
    this.g.g(1, b);
    this.g.g(2, c);
    H(this, 820);
    return G(this.g, 0);
  }
  Lf(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 821);
    return G(this.g, 0);
  }
  oh(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 823);
    return G(this.g, 0);
  }
  ph(a, b, c) {
    this.g.g(0, a);
    this.g.g(1, b);
    this.g.g(2, c);
    H(this, 824);
  }
  log(a, b) {
    const c = this.g;
    a = c.j.h(a, c.i);
    c.g(0, c.i.F);
    c.g(1, a);
    c.g(2, b !== void 0 ? 1 : 0);
    c.g(3, b !== void 0 ? b : 0);
    H(this, 825);
  }
  set(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 829);
  }
  fd(a, b, c) {
    this.g.g(0, a);
    this.g.g(1, b);
    this.g.g(2, c);
    H(this, 830);
  }
  $c(a, b, c) {
    this.g.g(0, a);
    this.g.g(1, b);
    this.g.g(2, c);
    H(this, 831);
  }
  Zc() {
    H(this, 832);
  }
  bd() {
    H(this, 833);
  }
  dd(a, b, c) {
    this.g.g(0, a);
    this.g.g(1, b);
    this.g.g(2, c);
    H(this, 840);
    return G(this.g, 0);
  }
  ad() {
    H(this, 841);
  }
  Sc() {
    H(this, 842);
  }
  Yc() {
    H(this, 843);
  }
  ag() {
    H(this, 850);
  }
  Oe(a, b) {
    this.g.g(0, a);
    this.g.g(1, b !== void 0 ? 1 : 0);
    this.g.g(2, b !== void 0 ? b : 0);
    H(this, 851);
  }
  ig(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 860);
  }
  gg(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 884);
  }
  Tf() {
    H(this, 885);
  }
  Zf(a, b) {
    const c = this.g;
    a = c.j.h(a, c.i);
    c.g(0, c.i.F);
    c.g(1, a);
    c.g(2, b === void 0 ? 0 : b);
    H(this, 920);
    return G(c, 0);
  }
  close(a) {
    a = typeof a === "number" ? a === a ? a : bd(this.g.o, a) : a.slot;
    this.g.g(0, a);
    H(this, 921);
  }
  Pg(a) {
    this.g.g(0, a);
    H(this, 886);
  }
  Og(a) {
    this.g.g(0, a);
    H(this, 887);
  }
  fg(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 863);
  }
  table(a) {
    return a instanceof hd ? (a = Jd(this, 900, a.ref), new td(this, a[0], a[1])) : new td(this, a.slot, 1);
  }
  map(a) {
    return a instanceof id ? (a = Jd(this, 901, a.ref), new zd(this, a[0], a[1])) : new zd(this, a.slot, 1);
  }
  Ma(a) {
    return a instanceof jd ? (a = Jd(this, 902, a.ref), new Bd(this, a[0], a[1])) : typeof a === "number" ? (a = a === a ? -1 : bd(this.g.o, a), a < 0 && console.error("act.array(valor): literal nao endereca array \u2014 degrada"), new Bd(this, a, 2)) : new Bd(this, a.slot, 1);
  }
  Na(a) {
    return new Ed(this, a.slot);
  }
  Gb(a) {
    a = typeof a === "number" ? a === a ? a : bd(this.g.o, a) : a.slot;
    return new Hd(this, a);
  }
  open(a, b) {
    wd(this, a, -1, b);
  }
  status(a) {
    return xd(this, a, -1);
  }
  Cc(a) {
    return yd(this, a, -1);
  }
  kf(a) {
    const b = this.g;
    a = b.j.h(a, b.i);
    b.g(0, b.i.F);
    b.g(1, a);
    H(this, 874);
    return G(b, 0);
  }
  eh(a, b) {
    this.g.g(0, a);
    this.g.g(1, b !== void 0 ? b : 0);
    H(this, 875);
    return G(this.g, 0);
  }
  Zg(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 876);
    return G(this.g, 0);
  }
  wg(a) {
    this.g.g(0, a);
    H(this, 927);
    return G(this.g, 0);
  }
  La(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 925);
  }
  dc(a) {
    this.g.g(0, a);
    H(this, 929);
    return G(this.g, 0);
  }
  dh(a) {
    this.g.g(0, a);
    H(this, 931);
    return G(this.g, 0);
  }
  $g(a) {
    this.g.g(0, a);
    H(this, 932);
    return G(this.g, 0);
  }
  gh(a) {
    this.g.g(0, a);
    H(this, 933);
    return G(this.g, 0);
  }
  mh(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 949);
    return G(this.g, 0);
  }
  kh(a, b, c) {
    this.g.g(0, a);
    this.g.g(1, b);
    this.g.g(2, c);
    H(this, 936);
    return G(this.g, 0);
  }
  fh(a, b, c) {
    this.g.g(0, a);
    this.g.g(1, b);
    this.g.g(2, c);
    H(this, 937);
    return G(this.g, 0);
  }
  hh(a, b, c) {
    this.g.g(0, a);
    this.g.g(1, b);
    this.g.g(2, c);
    H(this, 938);
    return G(this.g, 0);
  }
  Yg(a) {
    this.g.g(0, a);
    H(this, 939);
    return G(this.g, 0);
  }
  Xg(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 940);
    return G(this.g, 0);
  }
  ah(a, b, c) {
    this.g.g(0, a);
    this.g.g(1, b);
    this.g.g(2, c);
    H(this, 941);
    return G(this.g, 0);
  }
  bh(a) {
    this.g.g(0, a);
    H(this, 942);
  }
  nh(a) {
    this.g.g(0, a);
    H(this, 943);
    return G(this.g, 0);
  }
  jh(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 945);
    return G(this.g, 0);
  }
  ih(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 946);
    return G(this.g, 0);
  }
  Rf(a) {
    this.g.g(0, a);
    H(this, 947);
  }
  Sf(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 948);
  }
}
class Ld extends Kd {
  constructor(a) {
    super(a, 1);
  }
  Ic(a) {
    this.g.g(0, a);
    H(this, 819);
    return G(this.g, 0);
  }
  Jg(a) {
    this.g.g(0, a);
    H(this, 883);
    return G(this.g, 0);
  }
  Sg() {
    H(this, 852);
  }
  Xf() {
    H(this, 853);
  }
  capture() {
    H(this, 826);
  }
  claim() {
    H(this, 828);
  }
  cursor(a) {
    this.g.g(0, a);
    H(this, 914);
  }
  ae(a) {
    Id(this, a);
    H(this, 862);
  }
}
class Md extends Kd {
  constructor(a) {
    super(a, 2);
  }
  Ic(a) {
    this.g.g(0, a);
    H(this, 819);
    return G(this.g, 0);
  }
  dg() {
    H(this, 827);
  }
  claim() {
    H(this, 828);
  }
  cursor(a) {
    this.g.g(0, a);
    H(this, 914);
  }
  ae(a) {
    Id(this, a);
    H(this, 862);
  }
}
class Nd extends Kd {
  constructor(a) {
    super(a, 3);
  }
  xc(a) {
    Id(this, a);
    H(this, 800);
  }
  hg(a) {
    this.g.g(0, a);
    H(this, 861);
    return G(this.g, 0);
  }
  Ic(a) {
    this.g.g(0, a);
    H(this, 819);
    return G(this.g, 0);
  }
}
class Od extends Kd {
  constructor(a) {
    super(a, 4);
  }
  xc(a) {
    Id(this, a);
    H(this, 800);
  }
  Qg(a) {
    this.g.g(0, a);
    H(this, 882);
  }
}
class Pd extends Kd {
  constructor(a) {
    super(a, 0);
  }
  xc(a) {
    Id(this, a);
    H(this, 800);
  }
  Mg() {
    H(this, 816);
    return G(this.g, 0);
  }
  Lg(a, b) {
    this.g.g(0, a);
    this.g.g(1, b);
    H(this, 817);
    return G(this.g, 0);
  }
}
class Qd {
  constructor(a, b) {
    this.h = a;
    this.g = b;
  }
  ya(a, b) {
    const c = this.h;
    c.g(0, this.g);
    c.g(1, a);
    c.g(2, b);
    c.h(141);
    return this;
  }
}
class Rd {
  constructor(a, b) {
    this.h = a;
    this.g = b;
  }
  og(a, b) {
    const c = this.h;
    c.g(0, this.g);
    c.g(1, a);
    c.g(2, b);
    c.h(120);
  }
  pg(a, b) {
    const c = this.h;
    b = c.j.h(b, c.i);
    c.g(0, this.g);
    c.g(1, a);
    c.g(2, c.i.F);
    c.g(3, b);
    c.h(121);
  }
  ya(a, b) {
    const c = this.h;
    c.g(0, this.g);
    c.g(1, a);
    c.g(2, b);
    c.h(122);
    return this;
  }
  Tb(a) {
    const b = this.h;
    b.g(0, this.g);
    b.g(1, a);
    b.h(140);
    return new Qd(b, D(b));
  }
  label() {
    return this;
  }
}
class Sd {
  constructor(a, b, c) {
    this.i = a;
    this.g = b;
    this.h = c;
  }
  yg(a) {
    const b = this.i;
    this.h ? (b.g(0, this.g), b.g(1, a.g), b.h(111)) : (b.g(0, this.g), b.g(1, a.g), b.h(110));
    return new Rd(b, D(b));
  }
}
class Td {
  constructor(a, b, c) {
    this.g = a;
    this.i = b;
    this.h = c;
    a.h(160);
    this.self = new Rd(a, D(a));
  }
  end() {
    Ud(this.g);
    this.g.h(102);
    const a = this.h ? this.i : D(this.g);
    return new Sd(this.g, a, this.h);
  }
}
function C(a, b, ...c) {
  for (let d = 0; d < c.length; d++) {
    a.g(d, c[d]);
  }
  a.h(b);
}
function D(a) {
  return a.j.view.getFloat64(a.F, !0);
}
function G(a, b) {
  return a.j.view.getFloat64(a.F + b * 8, !0);
}
function Ud(a) {
  var b = a.o;
  const c = [];
  for (const d of b.g) {
    d < 8192 && !b.h.has(d) && c.push(d);
  }
  for (b = 0; b < c.length; b++) {
    Vd(a, c[b]);
  }
  a.o.clear();
}
function Vd(a, b) {
  if (!(b >= 8192)) {
    var c = a.j.view, d = a.T;
    c.setUint32(d, b, !0);
    c.setUint32(d + 4, 2146959360, !0);
    a.j.Fa(a.P, 250, a.T, 0);
  }
}
class Wd extends Wb {
  constructor(a, b) {
    super(a);
    this.F = a.j(160);
    this.P = b;
    this.o = new dd();
    this.H = [];
    this.T = a.j(8);
    this.W = new md(this);
    this.create = new ld(this);
    this.ta = new nd(this);
    this.wb = new qd(this);
    this.da = new Ld(this);
    this.ua = new Pd(this);
    this.gb = new Md(this);
    this.va = new Nd(this);
    this.Ba = new Od(this);
    this.O = new Map();
  }
  get R() {
    return this;
  }
  get M() {
    return this.W;
  }
  get mb() {
    return this.ta;
  }
  get table() {
    return this.wb;
  }
  get Yb() {
    return this.da;
  }
  get action() {
    return this.ua;
  }
  get run() {
    return this.gb;
  }
  get $d() {
    return this.va;
  }
  get get() {
    return this.Ba;
  }
  g(a, b) {
    this.j.view.setFloat64(this.F + a * 8, b, !0);
    a >= this.C && (this.C = a + 1);
    a = this.o;
    (b = (b = bd(a, b)) && b < 8192 && a.g.has(b) && !a.h.has(b) ? b : 0) && this.H.push(b);
  }
  h(a) {
    this.j.Fa(this.P, a, this.F, 0);
    this.C = 0;
    a = this.H;
    if (a.length > 0) {
      this.H = [];
      for (let b = 0; b < a.length; b++) {
        this.o.g.delete(a[b]), Vd(this, a[b]);
      }
    }
  }
  Bb(a, b) {
    a = this.j.h(a, this.i);
    this.g(0, this.i.F);
    this.g(1, a);
    this.g(2, b || 0);
    this.h(100);
    return new Td(this, 0, !1);
  }
  Sd() {
    this.h(101);
    return new Td(this, D(this), !0);
  }
  Pd(a) {
    a = this.j.h(a, this.i);
    this.g(0, this.i.F);
    this.g(1, a);
    this.h(112);
    return new Sd(this, D(this), !1);
  }
  Ld(a) {
    a = this.j.h(a, this.i);
    this.g(0, this.i.F);
    this.g(1, a);
    this.h(113);
    return D(this);
  }
  Ub(a) {
    a = this.j.h(a, this.i);
    this.g(0, this.i.F);
    this.g(1, a);
    this.h(103);
  }
  root() {
    this.h(150);
    return new Rd(this, D(this));
  }
  segment(a) {
    this.g(0, a);
    this.h(400);
  }
  Nb(a) {
    this.target(0, 0, a, 0);
  }
  target(a, b, c, d) {
    this.g(0, a);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.h(401);
  }
  yc() {
    this.h(402);
  }
  Ac() {
    this.h(403);
  }
  Bc(a) {
    this.g(0, a.ref);
    this.h(408);
  }
  rc() {
    this.h(406);
  }
  Lb() {
    this.h(404);
  }
  Kb() {
    this.h(405);
  }
  pb(a, b, c, d, e, f) {
    a = this.j.h(a, this.i);
    this.g(0, this.i.F);
    this.g(1, a);
    this.g(2, b);
    this.g(3, c);
    this.g(4, d);
    this.g(5, e);
    this.g(6, f);
    this.h(407);
  }
  vc(a, b, c) {
    this.g(0, a.t);
    this.g(1, b);
    this.g(2, c);
    this.g(3, a.m);
    this.h(512);
  }
  Jc(a, b, c, d) {
    this.g(0, a.t);
    this.g(1, b);
    this.g(2, c);
    this.g(3, d);
    this.g(4, a.m);
    this.h(516);
  }
  Fc(a) {
    this.g(0, a.t);
    this.g(1, a.m);
    this.h(517);
  }
  oe(a, b, c, d) {
    c = this.j.h(c + (d || ""), this.i);
    this.g(0, a);
    this.g(1, b);
    this.g(2, this.i.F);
    this.g(3, c);
    this.h(700);
    b = G(this, 0);
    this.O.set(b, a);
    c = [];
    for (d = 0; d < a; d++) {
      c.push(cd(this.o, G(this, 1 + d)));
    }
    return {handle:b, df:c};
  }
  ff() {
    Ud(this);
    this.h(701);
  }
  jb(a, b) {
    b = b.map(d => {
      typeof d !== "number" && (C(this, 217, d.ref, d instanceof hd ? 4 : 13), d = cd(this.o, D(this)));
      return d;
    });
    if (typeof a === "string") {
      a = this.j.h(a, this.i);
      this.g(0, this.i.F);
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
;class Xd {
  constructor(a, b) {
    this.g = new Wd(a, b);
    this.h = !1;
  }
  get table() {
    return this.g.table;
  }
  get create() {
    return this.g.create;
  }
  root() {
    return this.g.root();
  }
  Pd(a) {
    return this.g.Pd(a);
  }
  Ld(a) {
    return this.g.Ld(a);
  }
  Bb(a, b) {
    if (this.h) {
      throw Error("RecorderScope: overlapping context");
    }
    this.h = !0;
    a = this.g.Bb(a, b);
    return new Yd(this.g, a, () => {
      this.h = !1;
    });
  }
  Sd(a) {
    if (this.h) {
      throw Error("RecorderScope: overlapping context");
    }
    this.h = !0;
    a = this.g.Sd(a);
    return new Yd(this.g, a, () => {
      this.h = !1;
    });
  }
  Ub(a) {
    this.g.Ub(a);
  }
  oe(a, b, c, d) {
    if (this.h) {
      throw Error("RecorderScope: overlapping context");
    }
    this.h = !0;
    a = this.g.oe(a, b, c, d);
    return new Zd(this.g, a.handle, a.df, () => {
      this.h = !1;
    });
  }
}
class Yd {
  constructor(a, b, c) {
    this.g = a;
    this.i = b;
    this.h = c || null;
  }
  get R() {
    return this.g.R;
  }
  get M() {
    return this.g.M;
  }
  get mb() {
    return this.g.mb;
  }
  get Yb() {
    return this.g.Yb;
  }
  get action() {
    return this.g.action;
  }
  get run() {
    return this.g.run;
  }
  get $d() {
    return this.g.$d;
  }
  get get() {
    return this.g.get;
  }
  get self() {
    return this.i.self;
  }
  name(a) {
    this.g.Ub(a);
  }
  segment(a) {
    this.g.segment(a);
  }
  Nb(a) {
    this.g.Nb(a);
  }
  target(a, b, c, d) {
    this.g.target(a, b, c, d);
  }
  yc() {
    this.g.yc();
  }
  Ac() {
    this.g.Ac();
  }
  Bc(a) {
    this.g.Bc(a);
  }
  rc() {
    this.g.rc();
  }
  Lb() {
    this.g.Lb();
  }
  Kb() {
    this.g.Kb();
  }
  jb(a, b) {
    this.g.jb(a, b);
  }
  pb(a, b, c, d, e, f) {
    this.g.pb(a, b, c, d, e, f);
  }
  vc(a, b, c) {
    this.g.vc(a, b, c);
  }
  Jc(a, b, c, d) {
    this.g.Jc(a, b, c, d);
  }
  Fc(a) {
    this.g.Fc(a);
  }
  end() {
    this.h && this.h();
    return this.i.end();
  }
}
function $d(a) {
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
class Zd {
  constructor(a, b, c, d) {
    this.g = a;
    this.h = b;
    this.df = $d(c);
    this.i = d || null;
  }
  get handle() {
    return this.h;
  }
  get R() {
    return this.g.R;
  }
  get M() {
    return this.g.M;
  }
  get mb() {
    return this.g.mb;
  }
  segment(a) {
    this.g.segment(a);
  }
  Nb(a) {
    this.g.Nb(a);
  }
  target(a, b, c, d) {
    this.g.target(a, b, c, d);
  }
  Lb() {
    this.g.Lb();
  }
  Kb() {
    this.g.Kb();
  }
  jb(a, b) {
    this.g.jb(a, b);
  }
  pb(a, b, c, d, e, f) {
    this.g.pb(a, b, c, d, e, f);
  }
  vc(a, b, c) {
    this.g.vc(a, b, c);
  }
  Jc(a, b, c, d) {
    this.g.Jc(a, b, c, d);
  }
  Fc(a) {
    this.g.Fc(a);
  }
  end() {
    this.g.ff(this.h instanceof $c ? this.h.Ja : -1);
    this.i && this.i();
    return this.h;
  }
}
;const ae = {};
const be = "fd_advise fd_allocate fd_datasync fd_fdstat_set_flags fd_fdstat_set_rights fd_filestat_get fd_filestat_set_size fd_filestat_set_times fd_pread fd_pwrite fd_read fd_readdir fd_renumber fd_sync fd_tell path_create_directory path_filestat_get path_filestat_set_times path_link path_open path_readlink path_remove_directory path_rename path_symlink path_unlink_file poll_oneoff sched_yield sock_accept sock_recv sock_send sock_shutdown __wasm_longjmp __wasm_setjmp_test args_get args_sizes_get clock_res_get fd_close fd_prestat_get fd_prestat_dir_name fd_seek proc_exit".split(" ");
async function ce(a, b = {}) {
  a = new Response(new Blob([a], {type:"application/wasm"}));
  return await WebAssembly.instantiateStreaming(a, b);
}
console.log("DEV MODE", !0);
function de(a, b) {
  return a.Ad.instance.exports[b];
}
async function ee(a, b) {
  let c = 0;
  const d = async() => {
    var e = {wasi_snapshot_preview1:a.ua, env:a.ua};
    try {
      a.Ad = await ce(b, e);
    } catch (f) {
      return (e = String(f).match(/"(.*?)"\s*"(.*?)"/)) ? e[2] : null;
    }
    return null;
  };
  for (; c < 100;) {
    let e = await d();
    if (e) {
      be.push(e), c++;
    } else {
      break;
    }
  }
  c > 0 && (console.log("new imports demmand", c), console.log(be));
  a.tf.forEach(e => e());
  a.gb();
}
async function fe(a) {
  if (!a.Ad) {
    var b = await fetch("teste.wasm?v=f14d06c5");
    b.ok && (b = await b.arrayBuffer(), await ee(a, b));
  }
}
class ge {
  constructor() {
    this.tf = [() => {
      this.T = de(this, "memory");
      this.C = this.T.buffer;
      this.ta = new Uint8Array(this.C);
      this.va = new DataView(this.C);
    }, () => this.j = de(this, "c01"), () => this.o = de(this, "c02"), () => this.gb = de(this, "_start")];
  }
  get buffer() {
    return this.T.buffer;
  }
  get g() {
    this.T.buffer !== this.C && (this.C = this.T.buffer, this.ta = new Uint8Array(this.C), this.va = new DataView(this.C));
    return this.ta;
  }
  get view() {
    this.T.buffer !== this.C && (this.C = this.T.buffer, this.ta = new Uint8Array(this.C), this.va = new DataView(this.C));
    return this.va;
  }
  j() {
    throw Error("Not initialized");
  }
  o() {
    throw Error("Not initialized");
  }
  gb() {
    throw Error("Not initialized");
  }
  get ua() {
    return this.Oc;
  }
  get Oc() {
    const a = {fd_write:(c, d, e, f) => {
      let g = 0;
      for (let m = 0; m < e; m++) {
        var h = d + m * 8, k = this.view.getUint32(h, !0);
        h = this.view.getUint32(h + 4, !0);
        k = this.g.slice(k, k + h);
        if (!k.every(l => l === 0 || l === 10 || l === 13) && (k = (new TextDecoder()).decode(k), c !== 1 || la(k))) {
          console[c === 1 ? "log" : "error"](k);
        }
        g += h;
      }
      this.view.setUint32(f, g, !0);
    }, fd_fdstat_get:(c, d) => {
      this.view.setUint8(d, 0);
      this.view.setUint8(d + 1, 0);
      this.view.setBigUint64(d + 8 >>> 3, 0xffffffffffffffffn, !0);
      this.view.setBigUint64(d + 16 >>> 3, 0xffffffffffffffffn, !0);
      return 0;
    }, clock_time_get:(c, d, e) => {
      c === 0 ? this.view.setBigUint64(e, BigInt(Date.now()) * 1000000n, !0) : c === 1 ? this.view.setBigUint64(e, BigInt(Math.floor(performance.now() * 1E6)), !0) : this.view.setBigUint64(e, 0n, !0);
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
        for (let e = 0; e < d; e++) {
          c[e] = Math.random() * 256 | 0;
        }
      }
      return 0;
    }, __wasm_setjmp:() => {
    }}, b = new Map();
    be.forEach(c => {
      a[c] = (d, e, f, g) => {
        b.has(c) || b.set(c, 0);
        const h = b.get(c);
        if (h > 10) {
          throw Error("limite " + c);
        }
        b.set(c, h + 1);
        console.log(c, d, e, f, g);
      };
    });
    return a;
  }
}
function he(a, b, c, d, e) {
  if (b == 33) {
    return {ob:a.K, key:c};
  }
  if (b === 34) {
    return {ob:a.K[c], key:e};
  }
  if (b === 35) {
    let f = a.K[c];
    a = a.i(d, d + e).split(".");
    b = a.pop();
    a.forEach(g => f = f[g]);
    return {ob:f, key:b};
  }
  return null;
}
function ie(a, b, c, d, e) {
  if (b & 2048) {
    return ie(a, b - 2048, c, d, e) ? 1 : 0;
  }
  if (b & 4096) {
    return Number(ie(a, b - 4096, c, d, e));
  }
  if (b === 2) {
    return c;
  }
  if (b === 3) {
    return e;
  }
  if (b === 4) {
    return a.i(d, d + c);
  }
  if (b === 9) {
    b = [];
    e = a.view;
    for (var f = 0; f < c; f++) {
      b.push(e.getFloat64(d, !0)), d += 8;
    }
    return b;
  }
  if (b === 11) {
    b = [];
    e = a.view;
    for (f = 0; f < c; f++) {
      b.push(e.getFloat64(d + 8, !0)), d += 16;
    }
    return b;
  }
  if (b === 10) {
    return e = [0, 1, 2, 3].map(g => a.view.getInt32(d + 4 * g, !0)), b = a.i(e[0], e[1]), e = a.i(e[2], e[3]), [...b.matchAll(new RegExp(e, "g"))][0];
  }
  if (b == 33) {
    return a.K[c];
  }
  if (b === 34) {
    return a.K[c][e];
  }
  if (b === 35) {
    let g = a.K[c];
    a.i(d, d + e).split(".").forEach(h => g = g[h]);
    return g;
  }
  if (b === 38) {
    let g = a.K[c];
    a.i(d, d + e).split(".").forEach(h => {
      g = g[h].bind(g);
    });
    return g;
  }
  if (b === 37) {
    return a.K;
  }
  if (b === 1025) {
    return ya(a.i(d, d + c));
  }
  if (b === 1034) {
    return Za(a.i(d, d + c));
  }
  if (b === 1036) {
    return ab(a.i(d, d + c));
  }
  if (b === 1026) {
    return () => wb(a, d);
  }
  if (b === 1027) {
    return da;
  }
  if (b === 1028) {
    return () => Yb(a, d);
  }
  if (b === 1029) {
    return () => Zb(a, d);
  }
  if (b === 1030) {
    return $b(a, d);
  }
  if (b === 1035) {
    return async g => {
      if (!g || typeof g.queryPermission !== "function") {
        return !1;
      }
      const h = {mode:"readwrite"};
      let k = await g.queryPermission(h);
      k !== "granted" && (k = await g.requestPermission(h));
      return k === "granted";
    };
  }
  if (b === 1031) {
    return async(g, h) => {
      var k = [() => ({description:"Raster", accept:{"image/svg":[".svg"]}}), () => ({description:"Image", accept:{"image/png":[".png"], "image/jpeg":[".jpg", ".jpeg"], "image/gif":[".gif"]}}), () => db(), () => eb, () => fb, () => ({description:"JSON", accept:{"application/json":[".json"]}}), () => ({description:"SFcht", accept:{"application/octet-stream":[".SFcht"]}}), () => ({description:"XML", accept:{"text/xml":[".xml"]}})];
      g = Array.isArray(g) ? g : typeof g === "number" ? [g] : [];
      const m = [];
      for (const l of g) {
        l >= 0 && l < k.length && m.push(k[l]());
      }
      [k] = await window.showOpenFilePicker(m.length ? {types:m} : {});
      return h ? k : (await k.getFile()).text();
    };
  }
  if (b === 1032) {
    return () => Tc(a, c, d);
  }
  if (b === 1033) {
    return g => {
      if (g) {
        var h = a.view.getInt32(g + 0, !0);
        if (h && (g = (g = a.view.getInt32(g + 4, !0)) ? a.Ba.decode(a.g.subarray(g, g + 36)) : null)) {
          var k = ae[g];
          k && k(new Xd(a, h), g);
        }
      }
    };
  }
}
function je(a) {
  let b;
  return (new Promise((c, d) => {
    b = a.D();
    a.K[b] = [c, d];
    a.wb(b, 0, 0, 0, 0, 0);
  })).finally(() => {
    delete a.K[b];
    a.da(b);
  });
}
class ke extends ge {
  constructor() {
    super();
    this.tf.push(() => this.D = de(this, "c03"), () => this.da = de(this, "c04"), () => this.wb = de(this, "c05"), () => this.P = de(this, "c06"), () => this.ka = de(this, "c07"), () => this.Fa = de(this, "c08"), () => this.uf = de(this, "c09"), () => this.O = de(this, "c10"));
    this.mg = 0;
    this.W = null;
    this.Kh = 0;
    this.K = [];
    this.Ba = new TextDecoder();
    this.H = new TextEncoder();
    this.h = (a, b) => {
      a = this.H.encode(a);
      a.length >= b.cap && (this.o(b.F), b.cap = a.length + 1, b.F = this.j(b.cap));
      this.g.set(a, b.F);
      this.view.setUint8(b.F + a.length, 0);
      return a.length;
    };
    this.i = (a, b) => this.Ba.decode(this.g.subarray(a, b));
    this.K[0] = window;
  }
  get ua() {
    return {...this.Oc, ...this.Mh};
  }
  get Mh() {
    return {j01:this.Nh.bind(this), j02:this.Rh.bind(this), j03:this.th.bind(this), j04:this.ai.bind(this), j05:this.Zh.bind(this), j06:this.Xh.bind(this), j07:this.write.bind(this), j08:this.Th.bind(this), j09:this.ei.bind(this), j10:this.Lh.bind(this), j11:this.Ph.bind(this)};
  }
  D() {
    throw Error("Not initialized");
  }
  da() {
    throw Error("Not initialized");
  }
  P() {
    throw Error("Not initialized");
  }
  uf() {
    throw Error("Not initialized");
  }
  ka() {
    throw Error("Not initialized");
  }
  Fa() {
    throw Error("Not initialized");
  }
  O() {
    throw Error("Not initialized");
  }
  Nh(a, b, c, d) {
    (a = he(this, a, b, c, d)) && delete a.ob[a.key];
  }
  wb() {
    throw Error("Not initialized");
  }
  Rh(a, b, c, d) {
    (a = he(this, a, b, c, d)) && (a.ob[a.key] = {});
  }
  th(a, b, c, d) {
    (a = he(this, a, b, c, d)) && (a.ob[a.key] = []);
  }
  ai(a, b, c, d) {
    return ie(this, a, b, c, d);
  }
  Zh(a, b, c, d) {
    return ie(this, a, b, c, d);
  }
  Xh(a, b, c, d, e, f) {
    a = ie(this, a, b, c, d);
    a = this.H.encode(a);
    b = 0;
    a.length >= f && (b = e = this.j(a.length + 1));
    this.g.set(a, e);
    this.g[e + a.length] = 0;
    return b;
  }
  Th(a, b, c, d, e) {
    a = ie(this, a, b, c, d);
    e && this.view.setInt32(e, a?.byteLength ?? 0, !0);
    if (!a) {
      return 0;
    }
    e = this.j(a.byteLength);
    this.g.set(new Uint8Array(a), e);
    return e;
  }
  write(a, b, c, d, e, f, g, h) {
    (a = he(this, a, b, c, d)) && (a.ob[a.key] = ie(this, e, f, g, h));
  }
  ei(a, b, c, d, e, f, g, h, k, m, l, p, r) {
    a = ie(this, a, b, c, d);
    e == 0 ? r = a() : (e = ie(this, e, f, g, h), r = r && Array.isArray(e) ? a(...e) : a(e));
    (k = he(this, k, m, l, p)) && (k.ob[k.key] = r);
  }
  Lh(a, b, c, d, e, f, g, h, k, m, l, p, r, q, v, t, x, A, B) {
    const F = E => {
      const M = he(this, r, q, v, t);
      M && (M.ob[M.key] = E);
      this.P(x, 0);
    };
    let I = !1, z = 0;
    (async() => {
      try {
        A && (z = setTimeout(() => {
          I = !0;
          F("timeout");
        }, A));
        const M = ie(this, a, b, c, d);
        let ba;
        if (e == 0) {
          ba = await M();
        } else {
          const ea = ie(this, e, f, g, h);
          ba = B && Array.isArray(ea) ? await M(...ea) : await M(ea);
        }
        if (!I) {
          A && clearTimeout(z);
          var E = he(this, k, m, l, p);
          E && (E.ob[E.key] = ba);
          this.P(x, 1);
        }
      } catch (M) {
        I || (A && clearTimeout(z), F(M.name + ": " + M.message));
      }
    })();
  }
  Ph(a, b, c, d, e, f) {
    a = new (ie(this, a, b, c, d))(...(e ? this.K[e] : []));
    f && (this.K[f] = a);
  }
}
;let le = null;
function me(a, b, c, d, e, f, g) {
  var h = ne ||= {}, k = oe ||= {}, m = pe ||= {}, l = qe ||= {}, p = re ||= {}, r = se ||= {}, q = te ||= {};
  const v = ue ||= {};
  ve ||= 1;
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
      return f = d.getFloat64(c, !0) | 0, c = g(d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0), d = a.createShader(f), a.shaderSource(d, c), a.compileShader(d), a.getShaderParameter(d, a.COMPILE_STATUS) || console.error("[egl] shader:", a.getShaderInfoLog(d)), a = ve++, h[a] = d, a;
    case 11:
      return f = h[d.getFloat64(c, !0) | 0], d = h[d.getFloat64(c + 8, !0) | 0], c = a.createProgram(), a.attachShader(c, f), a.attachShader(c, d), a.linkProgram(c), a.getProgramParameter(c, a.LINK_STATUS) || console.error("[egl] link:", a.getProgramInfoLog(c)), a = ve++, k[a] = c, a;
    case 12:
      a.useProgram(k[d.getFloat64(c, !0) | 0] || null);
      break;
    case 13:
      return f = k[d.getFloat64(c, !0) | 0], c = g(d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0), a.getAttribLocation(f, c);
    case 14:
      return f = k[d.getFloat64(c, !0) | 0], c = g(d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0), a = a.getUniformLocation(f, c), c = ve++, p[c] = a, c;
    case 20:
      return a = a.createVertexArray(), c = ve++, m[c] = a, c;
    case 21:
      a.bindVertexArray(d.getFloat64(c, !0) ? m[d.getFloat64(c, !0) | 0] : null);
      break;
    case 22:
      return a = a.createBuffer(), c = ve++, l[c] = a, c;
    case 23:
      a.bindBuffer(d.getFloat64(c, !0) | 0, l[d.getFloat64(c + 8, !0) | 0] || null);
      break;
    case 24:
      a.bufferData(d.getFloat64(c, !0) | 0, e, d.getFloat64(c + 24, !0) | 0, (d.getFloat64(c + 8, !0) | 0) >> 2, (d.getFloat64(c + 16, !0) | 0) >> 2);
      break;
    case 38:
      a.bufferSubData(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, e, (d.getFloat64(c + 16, !0) | 0) >> 2, (d.getFloat64(c + 24, !0) | 0) >> 2);
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
      a.uniformMatrix3fv(p[d.getFloat64(c, !0) | 0], !1, e, (d.getFloat64(c + 8, !0) | 0) >> 2, 9);
      break;
    case 37:
      a.uniformMatrix4fv(p[d.getFloat64(c, !0) | 0], !1, e, (d.getFloat64(c + 8, !0) | 0) >> 2, 16);
      break;
    case 31:
      a.uniform4fv(p[d.getFloat64(c, !0) | 0], e, (d.getFloat64(c + 8, !0) | 0) >> 2, 4);
      break;
    case 46:
      a.uniform1fv(p[d.getFloat64(c, !0) | 0], e, (d.getFloat64(c + 8, !0) | 0) >> 2, d.getFloat64(c + 16, !0) | 0);
      break;
    case 47:
      a.uniform2fv(p[d.getFloat64(c, !0) | 0], e, (d.getFloat64(c + 8, !0) | 0) >> 2, d.getFloat64(c + 16, !0) | 0);
      break;
    case 56:
      a.uniform3fv(p[d.getFloat64(c, !0) | 0], e, (d.getFloat64(c + 8, !0) | 0) >> 2, d.getFloat64(c + 16, !0) | 0);
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
      return a = a.createTexture(), c = ve++, r[c] = a, c;
    case 51:
      a.bindTexture(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) ? r[d.getFloat64(c + 8, !0) | 0] : null);
      break;
    case 52:
      a.texParameteri(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0);
      break;
    case 53:
      h = d.getFloat64(c, !0) | 0;
      k = d.getFloat64(c + 8, !0) | 0;
      p = d.getFloat64(c + 16, !0) | 0;
      g = d.getFloat64(c + 24, !0) | 0;
      m = d.getFloat64(c + 32, !0) | 0;
      l = d.getFloat64(c + 40, !0) | 0;
      r = d.getFloat64(c + 48, !0) | 0;
      q = d.getFloat64(c + 56, !0) | 0;
      (c = d.getFloat64(c + 64, !0) | 0) ? a.texImage2D(h, k, p, g, m, l, r, q, f, c) : a.texImage2D(h, k, p, g, m, l, r, q, null);
      break;
    case 54:
      h = d.getFloat64(c, !0) | 0;
      k = d.getFloat64(c + 8, !0) | 0;
      p = d.getFloat64(c + 16, !0) | 0;
      g = d.getFloat64(c + 24, !0) | 0;
      m = d.getFloat64(c + 32, !0) | 0;
      l = d.getFloat64(c + 40, !0) | 0;
      r = d.getFloat64(c + 48, !0) | 0;
      q = d.getFloat64(c + 56, !0) | 0;
      c = d.getFloat64(c + 64, !0) | 0;
      a.texSubImage2D(h, k, p, g, m, l, r, q, f, c);
      break;
    case 55:
      a.activeTexture(d.getFloat64(c, !0) | 0);
      break;
    case 57:
      a.generateMipmap(d.getFloat64(c, !0) | 0);
      break;
    case 60:
      return a = a.createFramebuffer(), c = ve++, q[c] = a, c;
    case 61:
      a.bindFramebuffer(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) ? q[d.getFloat64(c + 8, !0) | 0] : null);
      break;
    case 62:
      a.framebufferTexture2D(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, r[d.getFloat64(c + 24, !0) | 0], d.getFloat64(c + 32, !0) | 0);
      break;
    case 63:
      return a = a.createRenderbuffer(), c = ve++, v[c] = a, c;
    case 64:
      a.bindRenderbuffer(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) ? v[d.getFloat64(c + 8, !0) | 0] : null);
      break;
    case 65:
      a.renderbufferStorage(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, d.getFloat64(c + 24, !0) | 0);
      break;
    case 66:
      a.framebufferRenderbuffer(d.getFloat64(c, !0) | 0, d.getFloat64(c + 8, !0) | 0, d.getFloat64(c + 16, !0) | 0, v[d.getFloat64(c + 24, !0) | 0]);
      break;
    case 70:
      if (f = l[d.getFloat64(c, !0) | 0]) {
        a.deleteBuffer(f), delete l[d.getFloat64(c, !0) | 0];
      }
      break;
    case 71:
      if (f = m[d.getFloat64(c, !0) | 0]) {
        a.deleteVertexArray(f), delete m[d.getFloat64(c, !0) | 0];
      }
      break;
    case 72:
      if (f = r[d.getFloat64(c, !0) | 0]) {
        a.deleteTexture(f), delete r[d.getFloat64(c, !0) | 0];
      }
      break;
    case 73:
      if (f = k[d.getFloat64(c, !0) | 0]) {
        a.deleteProgram(f), delete k[d.getFloat64(c, !0) | 0];
      }
      break;
    case 74:
      if (f = h[d.getFloat64(c, !0) | 0]) {
        a.deleteShader(f), delete h[d.getFloat64(c, !0) | 0];
      }
      break;
    case 75:
      if (f = q[d.getFloat64(c, !0) | 0]) {
        a.deleteFramebuffer(f), delete q[d.getFloat64(c, !0) | 0];
      }
      break;
    case 76:
      if (f = v[d.getFloat64(c, !0) | 0]) {
        a.deleteRenderbuffer(f), delete v[d.getFloat64(c, !0) | 0];
      }
      break;
    default:
      console.warn("[egl] unknown cmd", b);
  }
  return 0;
}
var ne, oe, pe, qe, re, se, te, ue, ve;
class we {
  M(a, b) {
    return a + b;
  }
}
class xe {
  M(a, b) {
    return a - b;
  }
}
class ye {
  M(a) {
    return a * 1.001;
  }
}
class ze {
  M(a, b) {
    return Math.sqrt(Math.abs(a)) + b;
  }
}
class Ae {
  M(a, b) {
    return Math.sin(b) + a;
  }
}
class Be {
  M(a, b) {
    return a % 1000000 + b;
  }
}
function Ce(a, b) {
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
      a = new we();
      c = new xe();
      d = new ye();
      const e = new ze(), f = new Ae(), g = new Be();
      let h = 0;
      for (let k = 0; k < b; k++) {
        h = a.M(h, k), h = c.M(h, k), h = d.M(h, k), h = e.M(h, k), h = f.M(h, k), h = g.M(h, k);
      }
      return h;
    default:
      return 0;
  }
}
;var De = Cb({fj:1, Bj:2, lj:3, wj:5, Ti:6});
function Ee(a, b, c, d) {
  const e = a.h.view;
  e.setInt32(a.g, b, !0);
  e.setInt32(a.g + 4, c, !0);
  e.setInt32(a.g + 8, d, !0);
  a.h.Fa(a.i, 1, a.g, 0);
}
function Fe(a, b, c) {
  const d = a.h.view;
  d.setInt32(a.g, b, !0);
  d.setInt32(a.g + 4, c, !0);
  return a.h.Fa(a.i, 2, a.g, 0);
}
function Ge(a, b, c, d, e) {
  const f = a.h.view;
  f.setInt32(a.g, b, !0);
  f.setInt32(a.g + 4, c, !0);
  for (b = 0; b < d.length; b++) {
    f.setInt32(a.g + 8 + b * 4, d[b], !0);
  }
  for (d = 0; d < e.length; d++) {
    f.setFloat64(a.g + 20 + d * 8, e[d], !0);
  }
  return a.h.Fa(a.i, 7, a.g, 0);
}
class He {
  constructor(a, b) {
    this.h = a;
    this.i = b;
    this.g = a.j(36);
  }
}
;function Ie(a) {
  a.width = a.h.offsetWidth;
  a.height = a.h.offsetHeight;
  a.h.width = Math.round(a.width * Je);
  a.h.height = Math.round(a.height * Je);
}
function Ke(a, b, c) {
  a.size = b;
  a.P = c;
  a.O = a.g.g;
  b && (a.D = a.g.g.subarray(c, c + a.size), b = new Uint8ClampedArray(a.D), a.H = new ImageData(b, a.h.width, a.h.height));
}
function Le(a) {
  a.C || (a.C = !0, window.requestAnimationFrame(a.Ba.bind(a)));
}
function Me(a, b) {
  if (a.g.g != a.O || a.P !== b) {
    a.O = a.g.g, a.D = a.g.g.subarray(b, b + a.size);
  }
  a.H.data.set(a.D);
  b = a.g.view;
  const c = a.j, d = c ? b.getInt32(c + 32, !0) : 0;
  d > 0 ? a.R.putImageData(a.H, 0, 0, b.getInt32(c + 24, !0), b.getInt32(c + 28, !0), d, b.getInt32(c + 36, !0)) : a.R.putImageData(a.H, 0, 0);
}
function Ne(a, b, c, d, e, f, g) {
  (async() => {
    try {
      let h = new Uint8ClampedArray(a.g.g.subarray(b, b + c)), k = new ImageData(h, d, e);
      a.g.K[f] = await createImageBitmap(k);
      a.g.P(g, 1);
    } catch (h) {
      a.g.K[f] = h, a.g.P(g, 0);
    }
  })();
}
class Oe {
  constructor(a, b, c, d) {
    this.g = a;
    this.i = c;
    this.T = d || 0;
    this.h = b;
    this.T === 2 ? (this.W = b.getContext("webgl2", {alpha:!0, premultipliedAlpha:!0, antialias:!1, preserveDrawingBuffer:!1}), b.addEventListener("webglcontextlost", f => {
      f.preventDefault();
      console.warn("[compositor] contexto WebGL perdido");
      this.g.ka(112, this.i, this.width, this.height, 0, 0);
    }), b.addEventListener("webglcontextrestored", () => {
      console.warn("[compositor] contexto WebGL de volta");
      ne = {};
      oe = {};
      pe = {};
      qe = {};
      re = {};
      se = {};
      te = {};
      ue = {};
      ve = 1;
      this.g.ka(112, this.i, this.width, this.height, 1, 0);
    })) : this.R = Pb(b);
    this.P = this.size = 0;
    this.C = !1;
    a = Je;
    c = b.offsetWidth;
    d = b.offsetHeight;
    b.width = Math.round(c * a);
    b.height = Math.round(d * a);
    this.width = c;
    this.height = d;
    Ie(this);
    const e = (f, g) => this.g.Ba.decode(this.g.g.subarray(f, f + g));
    this.ta = [(f, g) => Ke(this, f, g), () => Le(this), f => {
      (this.h ?? document.body).style.cursor = nc[f] ?? "default";
    }, f => Me(this, f), () => {
    }, (...f) => {
      var g = this.R, h = f[f.length - 1];
      f = f.slice(0, -1);
      var k = this.g.K;
      switch(h) {
        case 1:
          g.arc(f[0], f[1], f[2], f[3], f[4], f[5] ? !0 : !1);
          break;
        case 2:
          g.arcTo(f[0], f[1], f[2], f[3], f[4]);
          break;
        case 3:
          g.bezierCurveTo(f[0], f[1], f[2], f[3], f[4], f[5]);
          break;
        case 4:
          g.closePath();
          break;
        case 5:
          g.ellipse(f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7] ? !0 : !1);
          break;
        case 6:
          g.lineTo(f[0], f[1]);
          break;
        case 7:
          g.moveTo(f[0], f[1]);
          break;
        case 8:
          g.quadraticCurveTo(f[0], f[1], f[2], f[3]);
          break;
        case 9:
          g.rect(f[0], f[1], f[2], f[3]);
          break;
        case 10:
          f.length > 4 ? g.roundRect(f[0], f[1], f[2], f[3], f.slice(4)) : g.roundRect(f[0], f[1], f[2], f[3]);
          break;
        case 12:
          g.clearRect(f[0], f[1], f[2], f[3]);
          break;
        case 13:
          g.fillRect(f[0], f[1], f[2], f[3]);
          break;
        case 14:
          g.strokeRect(f[0], f[1], f[2], f[3]);
          break;
        case 16:
          g.resetTransform();
          break;
        case 17:
          g.rotate(f[0]);
          break;
        case 18:
          g.scale(f[0], f[1]);
          break;
        case 19:
          g.setTransform(f[0], f[1], f[2], f[3], f[4], f[5]);
          break;
        case 20:
          g.transform(f[0], f[1], f[2], f[3], f[4], f[5]);
          break;
        case 21:
          g.translate(f[0], f[1]);
          break;
        case 22:
          g.beginPath();
          break;
        case 23:
          (f = Nb(f[0])) ? g.clip(f) : g.clip();
          break;
        case 81:
          console.warn("play clip path");
          break;
        case 24:
          (f = Nb(f[0])) ? g.fill(f) : g.fill();
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
          g.lineCap = Jb(f[0]);
          break;
        case 29:
          g.lineDashOffset = f[0];
          break;
        case 30:
          g.lineJoin = Mb(f[0]);
          break;
        case 31:
          g.lineWidth = f[0];
          break;
        case 32:
          g.miterLimit = f[0];
          break;
        case 34:
          g.setLineDash(f);
          break;
        case 35:
          (h = k?.[f[0] | 0]) && h.width > 0 && h.height > 0 && g.drawImage(h, f[1], f[2]);
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
          g.fillStyle = Ub(f[0]);
          break;
        case 44:
          g.strokeStyle = Ub(f[0]);
          break;
        case 46:
          le = g.createLinearGradient(f[0], f[1], f[2], f[3]);
          break;
        case 48:
          le = g.createRadialGradient(f[0], f[1], f[2], f[3], f[4], f[5]);
          break;
        case 45:
          le = g.createConicGradient ? g.createConicGradient(f[0], f[1], f[2]) : null;
          break;
        case 86:
          le && le.addColorStop(f[0], Ub(f[1]));
          break;
        case 87:
          break;
        case 84:
          le && (g.fillStyle = le);
          break;
        case 85:
          le && (g.strokeStyle = le);
          break;
        case 50:
          g.globalAlpha = f[0];
          break;
        case 51:
          g.globalCompositeOperation = Gb(f[0]);
          break;
        case 55:
          g.shadowBlur = f[0];
          break;
        case 56:
          g.shadowColor = Ub(f[0]);
          break;
        case 57:
          g.shadowOffsetX = f[0];
          break;
        case 58:
          g.shadowOffsetY = f[0];
          break;
        case 49:
          console.warn("play filter");
          break;
        case 59:
          h = e(f[3], f[4]);
          f[2] ? g.fillText(h, f[0], f[1], f[2]) : g.fillText(h, f[0], f[1]);
          break;
        case 61:
          h = e(f[3], f[4]);
          f[2] ? g.strokeText(h, f[0], f[1], f[2]) : g.strokeText(h, f[0], f[1]);
          break;
        case 63:
          f = e(f[0], f[1]);
          g.font = f;
          g.font.replace(/["']/g, "") !== f.replace(/["']/g, "") && console.warn("n\u00e3o aceitou", f, "ficou", g.font);
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
          console.warn(f, "FALTA FAZER", Db(h), h);
      }
    }, (f, g, h, k, m, l) => Ne(this, f, g, h, k, m, l), (f, g) => me(this.W, g, f, this.g.view, this.ua, this.g.g, e), () => Pe ? Pe() : 0];
    this.da = this.g.D();
    this.g.K[this.da] = this.ta;
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    b.style.pointerEvents !== "none" && (Le(this), Qe(this), Re(this));
  }
  resize() {
    Ie(this);
    this.i === 0 && Je !== 1 && this.g.ka(113, 0, 0, 0, 0, Je);
    this.j = this.g.ka(100, this.i, this.width, this.height, this.T, this.da);
    let a = this.g.view.getInt32(this.j, !0), b = this.g.view.getInt32(this.j + 4, !0);
    /[?&]fullframe=1\b/.test(window.location.search) && this.g.view.setInt32(this.j + 40, 1, !0);
    Ke(this, a, b);
  }
  get va() {
    return !!this.g.view.getInt32(this.j + 8, !0);
  }
  get ua() {
    this.o && this.o.buffer === this.g.buffer || (this.o = new Float32Array(this.g.buffer));
    return this.o;
  }
  Ba(a) {
    this.C = !1;
    (a = this.g.ka(101, this.i, 0, 0, 0, a)) && Me(this, a);
    this.va && Le(this);
  }
}
var Je = 1, Qe = a => {
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
    a.g.ka(0, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  a.h.addEventListener("pointerup", c => {
    a.g.ka(1, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  a.h.addEventListener("pointermove", c => {
    a.g.ka(2, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  a.h.addEventListener("pointerenter", c => {
    a.g.ka(4, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  a.h.addEventListener("pointerleave", c => {
    a.g.ka(5, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  a.h.addEventListener("wheel", c => {
    c.ctrlKey && c.preventDefault();
    a.g.ka(3, a.i, c.offsetX, c.offsetY, b(c), c.deltaY);
  }, {passive:!1});
  a.h.addEventListener("contextmenu", c => {
    c.preventDefault();
    a.g.ka(6, a.i, c.offsetX, c.offsetY, b(c), c.timeStamp);
  });
  document.addEventListener("keydown", c => {
    var d = 0;
    c.ctrlKey && (d |= 256);
    c.shiftKey && (d |= 512);
    c.altKey && (d |= 1024);
    c.metaKey && (d |= 2048);
    a.g.ka(103, a.i, 0, 0, c.keyCode | d, 0) && c.preventDefault();
    d = c.key;
    d.length !== 1 || c.ctrlKey || c.altKey || c.metaKey || a.g.ka(111, a.i, 0, 0, d.codePointAt(0), 0);
  });
}, Se = null, Te = null, Ue = null, Pe = null, Re = a => {
  const b = a.g.D(), c = a.g.D(), d = a.g, e = d.view.getInt32(a.j + 12, !0);
  d.mg = e;
  const f = {}, g = k => {
    d.K[b] = [k];
    d.Fa(e, 1, b, c);
    return d.K[c];
  };
  f.new_uuid_class = () => g(262);
  f.new_uuid_fn = () => g(513);
  Se = () => String(g(1289));
  Te = () => String(g(1027));
  Ue = () => String(g(262));
  f.test_text = (k, m) => {
    m = (new TextEncoder()).encode(m);
    const l = d.j(m.length);
    d.g.set(m, l);
    d.O(5, k, l, m.length, 0);
    d.o(l);
  };
  f.test_read = k => {
    d.O(5, 305, k, 0, 0);
  };
  f[De(2)] = k => {
    d.K[b] = [k];
    d.Fa(e, 2, b, c);
    return d.K[c];
  };
  f[De(3)] = (k, m, l) => {
    d.K[b] = [k, m, l];
    d.Fa(e, 3, b, c);
    (m = d.K[c]) && m !== 0 && (k = m[0], m = new Uint8Array(d.g.slice(k, k + m[1])), m = URL.createObjectURL(new Blob([m], {type:"application/pdf"})), l = document.createElement("a"), l.href = m, l.download = "render.pdf", l.click(), URL.revokeObjectURL(m), d.o(k));
  };
  f[De(6)] = (k, m, l, p, r) => {
    d.K[b] = [k, p || 0, r || 0];
    d.Fa(e, 6, b, c);
    d.ka(7, 0, m, l, 1, performance.now());
  };
  f.testp = (k, m) => {
    d.K[b] = [m, k];
    const l = performance.now();
    d.Fa(e, 5, b, c);
    const p = performance.now(), r = d.K[c], q = performance.now(), v = Ce(m, k);
    console.log(({1:"Linear", 2:"If-chain", 3:"Vtable"}[m] || "test_" + m) + "  rep=" + k + "  WASM=" + (p - l).toFixed(2) + "ms  JS=" + (performance.now() - q).toFixed(2) + "ms  chk_w=" + r + "  chk_j=" + v);
  };
  const h = d.view.getInt32(a.j + 16, !0);
  a.Gb = new He(d, h);
  d.W = a.Gb;
  d.Kh = a.j;
  window.wasm_fn = f;
};
async function Ve(a, b, c, d) {
  if (c) {
    var e = Pb(b), f = Pb(c);
    await (new xa("stg.mandala")).init();
    c.width = b.width = b.offsetWidth;
    c.height = b.height = b.offsetHeight;
    await je(a);
    Je = document.createElement("canvas").getContext("webgl2") && d ? window.devicePixelRatio || 1 : 1;
    var g = 0;
    new Oe(a, b, g++);
    new Oe(a, c, g++);
    d && (c = new Oe(a, d, g++, 2), window.glctx = c.W);
    window.ctx1 = e;
    window.canvas = b;
    window.ctx2 = f;
    window.mem = a.K;
  }
}
;const We = {[1]:"cursor", [2]:"move", [3]:"click_set_data", [4]:"hover_prop", [5]:"temporal", [7]:"handle_uuid", [8]:"selection", [13]:"resize", [14]:"click_feedback", [15]:"dbl_click"};
class Xe {
  constructor(a) {
    this.g = a;
  }
  arc(a, b, c, d, e, f) {
    J(this.g, 1, 1, w(a, b, c, d, e, f ? 1 : 0));
  }
  arcTo(a, b, c, d, e) {
    J(this.g, 1, 2, w(a, b, c, d, e));
  }
  bezierCurveTo(a, b, c, d, e, f) {
    J(this.g, 1, 3, w(a, b, c, d, e, f));
  }
  closePath() {
    J(this.g, 1, 4, []);
  }
  ellipse(a, b, c, d, e, f, g, h) {
    J(this.g, 1, 5, w(a, b, c, d, e, f, g, h ? 1 : 0));
  }
  lineTo(a, b) {
    J(this.g, 1, 6, w(a, b));
  }
  moveTo(a, b) {
    J(this.g, 1, 7, w(a, b));
  }
  quadraticCurveTo(a, b, c, d) {
    J(this.g, 1, 8, w(a, b, c, d));
  }
  rect(a, b, c, d) {
    J(this.g, 1, 9, w(a, b, c, d));
  }
  clearRect(a, b, c, d) {
    J(this.g, 1, 12, w(a, b, c, d));
  }
  fillRect(a, b, c, d) {
    J(this.g, 1, 13, w(a, b, c, d));
  }
  strokeRect(a, b, c, d) {
    J(this.g, 1, 14, w(a, b, c, d));
  }
  resetTransform() {
    J(this.g, 1, 16, []);
  }
  rotate(a) {
    J(this.g, 1, 17, w(a));
  }
  scale(a, b) {
    J(this.g, 1, 18, w(a, b));
  }
  setTransform(a, b, c, d, e, f) {
    J(this.g, 1, 19, w(a, b, c, d, e, f));
  }
  transform(a, b, c, d, e, f) {
    J(this.g, 1, 20, w(a, b, c, d, e, f));
  }
  translate(a, b) {
    J(this.g, 1, 21, w(a, b));
  }
  beginPath() {
    J(this.g, 1, 22, []);
  }
  clip(a, b) {
    J(this.g, 1, 23, [a, b]);
  }
  fill(a, b) {
    J(this.g, 1, 24, [a, b]);
  }
  stroke() {
    J(this.g, 1, 27, []);
  }
  reset() {
    J(this.g, 1, 40, []);
  }
  restore() {
    J(this.g, 1, 41, []);
  }
  save() {
    J(this.g, 1, 42, []);
  }
  Dc() {
    J(this.g, 1, 80, []);
  }
  set fillStyle(a) {
    Ye(this.g, 43, typeof a !== "string" ? a : Vb(Tb(a)));
  }
  set strokeStyle(a) {
    Ye(this.g, 44, typeof a !== "string" ? a : Vb(Tb(a)));
  }
  set lineWidth(a) {
    Ye(this.g, 31, a);
  }
  set lineCap(a) {
    Ye(this.g, 28, a);
  }
  set lineJoin(a) {
    Ye(this.g, 30, a);
  }
  set lineDashOffset(a) {
    Ye(this.g, 29, a);
  }
  set miterLimit(a) {
    Ye(this.g, 32, a);
  }
  set globalAlpha(a) {
    Ye(this.g, 50, a);
  }
  set globalCompositeOperation(a) {
    Ye(this.g, 51, a);
  }
  setLineDash(a) {
    J(this.g, 1, 34, [a ? a.slice() : []]);
  }
  set font(a) {
    Ye(this.g, 63, a);
  }
  fillText(a, b, c, d) {
    J(this.g, 1, 59, w(a, b, c, d));
  }
  strokeText(a, b, c, d) {
    J(this.g, 1, 61, w(a, b, c, d));
  }
}
class Ze {
  constructor(a) {
    this.g = a;
    this.Y = {V:(b, c, d) => $e(this.g, 15, w(b ?? 0, c ?? 0), d), hd:(b, c, d) => $e(this.g, 14, w(b ?? 0, c ?? 0), d), local:(b, c) => $e(this.g, 1, b !== void 0 ? w(b) : [], c), Gb:() => {
      console.error("sessao: alloc.gralm ainda nao suportado (F2b)");
      return {slot:-1, data:(b, c) => c ?? 0};
    }, Na:() => {
      console.error("sessao: alloc.cell sem suporte (fatia 2b: so C++)");
      return -1;
    }, table:() => {
      console.error("sessao: alloc.table ainda nao suportado (F2b)");
      return {ref:-1, create:() => {
      }, text:() => new ad(-1), V:() => 0, rows:() => 0, cols:() => 0, init:() => {
      }, lc:() => {
      }, La:() => {
      }, index:() => 0};
    }, text:() => {
      console.error("sessao: alloc.text sem suporte (espelho pendente)");
      return new ad(-1);
    }, map:() => {
      console.error("sessao: alloc.map sem suporte (espelho pendente)");
      return {};
    }, Ma:() => {
      console.error("sessao: alloc.array(key) sem suporte (a forma LITERAL e calc.alloc_array([...]))");
      return -1;
    }};
  }
  i(a, b) {
    return $e(this.g, 2, [b ?? 0].concat(a || []));
  }
  add(a, b) {
    return af(this.g, 3, w(a, b));
  }
  sub(a, b) {
    return af(this.g, 4, w(a, b));
  }
  h(a, b) {
    return af(this.g, 5, w(a, b));
  }
  j(a, b) {
    return af(this.g, 6, w(a, b));
  }
  o(a, b) {
    return af(this.g, 7, w(a, b));
  }
  sin(a) {
    return af(this.g, 8, w(a));
  }
  cos(a) {
    return af(this.g, 9, w(a));
  }
  H(a) {
    return $e(this.g, 10, w(a));
  }
  set(a, b) {
    J(this.g, 2, 11, w(a, b));
  }
  D(a, b, c, d) {
    J(this.g, 2, 12, w(a, b, c, d));
  }
  C(a, b) {
    J(this.g, 2, 13, w(a, b));
  }
}
class bf {
  constructor(a) {
    this.g = a;
  }
  fd(a, b, c) {
    J(this.g, 3, 0, w(a, b, c));
  }
  h(a) {
    J(this.g, 3, 1, w(a));
  }
  $c(a, b, c) {
    J(this.g, 3, 2, w(a, b, c));
  }
  Zc() {
    J(this.g, 3, 3, []);
  }
  bd() {
    J(this.g, 3, 4, []);
  }
  dd(a, b, c) {
    const d = K(this.g);
    this.g.g.push(new y(3, -1, 5, w(a, b, c), d));
    return u(d);
  }
  ad() {
    J(this.g, 3, 6, []);
  }
  Sc() {
    J(this.g, 3, 7, []);
  }
  Yc() {
    J(this.g, 3, 8, []);
  }
}
function cf() {
  console.error("sessao: act.cell sem suporte (fatia 3: so bridge)");
  return {slot:-1, V:() => 0, text:() => -1, type:() => 0, Ob:() => 0, set:() => {
  }, xi:() => {
  }, create:{table:() => ({}), Ma:() => ({}), map:() => ({})}};
}
function L(a, b, c) {
  const d = K(a.g);
  a.g.g.push(new y(a.h, -1, b, c, d));
  return u(d);
}
class df {
  constructor(a, b) {
    this.g = a;
    this.h = b;
    this.Y = {local:c => L(this, 1, w(c !== void 0 ? c : 0)), V:() => {
      console.error("sessao: act.alloc.num sem suporte");
      return 0;
    }, hd:() => {
      console.error("sessao: act.alloc.integer sem suporte");
      return 0;
    }, text:() => {
      console.error("sessao: act.alloc.text sem suporte");
      return new ad(-1);
    }, table:() => {
      console.error("sessao: act.alloc.table sem suporte");
      return {ref:-1, create:() => {
      }, text:() => new ad(-1), V:() => 0, rows:() => 0, cols:() => 0, init:() => {
      }, lc:() => {
      }, La:() => {
      }};
    }, map:() => {
      console.error("sessao: act.alloc.map sem suporte");
      return {};
    }, Ma:() => {
      console.error("sessao: act.alloc.array sem suporte");
      return -1;
    }, Gb:() => {
      console.error("sessao: act.alloc.gralm sem suporte");
      return {slot:-1, data:(c, d) => d ?? 0};
    }, Na:() => {
      console.error("sessao: act.alloc.cell sem suporte");
      return -1;
    }};
  }
  Gb() {
    console.error("sessao: act.gralm ainda nao suportado (F2b)");
    return {get:() => 0, write:() => {
    }, i:() => {
    }, La:() => {
    }, dc:() => 0};
  }
  open() {
    console.error("sessao: act.open (escalar) sem suporte");
  }
  status() {
    console.error("sessao: act.status (escalar) sem suporte");
    return 0;
  }
  Cc() {
    console.error("sessao: act.loc (escalar) sem suporte");
    return 0;
  }
  Ig(a) {
    return L(this, 2, w(a));
  }
  sh(a, b) {
    J(this.g, this.h, 3, w(a, b));
  }
  $e(a, b) {
    return L(this, 4, b === void 0 ? w(a) : w(a, b));
  }
  af(a, b) {
    J(this.g, this.h, 5, w(a, b));
  }
  Hg(a) {
    return L(this, 19, w(a));
  }
  Mf(a, b, c) {
    return L(this, 8, w(a, b, c));
  }
  fd(a, b, c) {
    J(this.g, this.h, 9, w(a, b, c));
  }
  $c(a, b, c) {
    J(this.g, this.h, 10, w(a, b, c));
  }
  Zc() {
    J(this.g, this.h, 11, []);
  }
  bd() {
    J(this.g, this.h, 12, []);
  }
  dd(a, b, c) {
    return L(this, 13, w(a, b, c));
  }
  ad() {
    J(this.g, this.h, 14, []);
  }
  Sc() {
    J(this.g, this.h, 15, []);
  }
  Yc() {
    J(this.g, this.h, 16, []);
  }
  ag() {
    J(this.g, this.h, 17, []);
  }
  Oe(a, b) {
    J(this.g, this.h, 18, b !== void 0 ? w(a, b) : w(a));
  }
  Lf(a, b) {
    return L(this, 25, w(a, b));
  }
  oh(a, b) {
    return L(this, 27, w(a, b));
  }
  ph(a, b, c) {
    J(this.g, this.h, 28, w(a, b, c));
  }
  log(a, b) {
    J(this.g, this.h, 29, b !== void 0 ? [a, b] : [a]);
  }
  set(a, b) {
    J(this.g, this.h, 33, w(a, b));
  }
  ig(a, b) {
    J(this.g, this.h, 34, w(a, b));
  }
  gg(a, b) {
    J(this.g, this.h, 50, w(a, b));
  }
  Tf() {
    J(this.g, this.h, 51, []);
  }
  Zf() {
    console.error("sessao: act.create_child sem suporte");
    return 0;
  }
  close() {
    console.error("sessao: act.close sem suporte");
  }
  Pg(a) {
    J(this.g, this.h, 52, w(a));
  }
  Og(a) {
    J(this.g, this.h, 53, w(a));
  }
  fg(a, b) {
    J(this.g, this.h, 37, w(a, b));
  }
  table(a) {
    const b = K(this.g);
    this.g.g.push(new y(this.h, -1, 45, [new $c(a.J)], b));
    return new ef(this.g, b);
  }
  map(a) {
    const b = K(this.g);
    this.g.g.push(new y(this.h, -1, 46, [new $c(a.J)], b));
    return new ff(this.g, b);
  }
  Ma() {
    console.error("sessao: act.array sem suporte (fatia 3: so bridge)");
    return {get:() => 0, set:() => {
    }, size:() => 0, resize:() => {
    }, push:() => {
    }, clear:() => {
    }, fill:() => {
    }, open:() => {
    }, h:() => {
    }, status:() => 0, Cc:() => 0};
  }
  Na() {
    return cf();
  }
  kf(a) {
    return L(this, 42, [a]);
  }
  eh(a, b) {
    return L(this, 43, w(a, b !== void 0 ? b : 0));
  }
  Zg(a, b) {
    return L(this, 44, w(a, b));
  }
  wg(a) {
    return L(this, 57, w(a));
  }
  La(a, b) {
    J(this.g, this.h, 56, w(a, b));
  }
  dc(a) {
    return L(this, 58, w(a));
  }
  dh(a) {
    return L(this, 59, w(a));
  }
  $g(a) {
    return L(this, 60, w(a));
  }
  gh(a) {
    return L(this, 61, w(a));
  }
  mh(a, b) {
    return L(this, 74, w(a, b));
  }
  kh(a, b, c) {
    return L(this, 62, w(a, b, c));
  }
  fh(a, b, c) {
    return L(this, 63, w(a, b, c));
  }
  hh(a, b, c) {
    return L(this, 64, w(a, b, c));
  }
  Yg(a) {
    return L(this, 65, w(a));
  }
  Xg(a, b) {
    return L(this, 66, w(a, b));
  }
  ah(a, b, c) {
    return L(this, 67, w(a, b, c));
  }
  bh(a) {
    J(this.g, this.h, 68, w(a));
  }
  nh(a) {
    return L(this, 69, w(a));
  }
  jh(a, b) {
    return L(this, 70, w(a, b));
  }
  ih(a, b) {
    return L(this, 71, w(a, b));
  }
  Rf(a) {
    J(this.g, this.h, 72, w(a));
  }
  Sf(a, b) {
    J(this.g, this.h, 73, w(a, b));
  }
}
class gf extends df {
  constructor(a) {
    super(a, 4);
  }
  Ic(a) {
    return L(this, 22, w(a));
  }
  Jg(a) {
    return L(this, 49, w(a));
  }
  Sg() {
    J(this.g, this.h, 23, []);
  }
  Xf() {
    J(this.g, this.h, 24, []);
  }
  capture() {
    J(this.g, this.h, 30, []);
  }
  claim() {
    J(this.g, this.h, 32, []);
  }
  cursor() {
    console.error("sessao: cursor sem suporte (so bridge)");
  }
  ae(a) {
    J(this.g, this.h, 36, w(a));
  }
}
class hf extends df {
  constructor(a) {
    super(a, 8);
  }
  Ic(a) {
    return L(this, 22, w(a));
  }
  dg() {
    J(this.g, this.h, 31, []);
  }
  claim() {
    J(this.g, this.h, 32, []);
  }
  cursor() {
    console.error("sessao: cursor sem suporte (so bridge)");
  }
  ae(a) {
    J(this.g, this.h, 36, w(a));
  }
}
class jf extends df {
  constructor(a) {
    super(a, 9);
  }
  xc(a) {
    J(this.g, this.h, 0, w(a));
  }
  hg(a) {
    return L(this, 35, w(a));
  }
  Ic(a) {
    return L(this, 22, w(a));
  }
}
class kf extends df {
  constructor(a) {
    super(a, 10);
  }
  xc(a) {
    J(this.g, this.h, 0, w(a));
  }
  Qg(a) {
    J(this.g, this.h, 48, w(a));
  }
}
class lf extends df {
  constructor(a) {
    super(a, 7);
  }
  xc(a) {
    J(this.g, this.h, 0, w(a));
  }
  Mg() {
    return L(this, 20, []);
  }
  Lg(a, b) {
    return L(this, 21, w(a, b));
  }
}
class mf {
  constructor(a, b) {
    this.g = a;
    this.J = b;
    this.h = void 0;
  }
  get ref() {
    if (this.h === void 0) {
      const a = K(this.g);
      this.g.g.push(new y(6, this.J, 12, [], a));
      this.h = u(a);
    }
    return this.h;
  }
  create(a) {
    N(this.g, this.J, 0, w(a));
  }
  get(a, b) {
    const c = K(this.g);
    this.g.g.push(new y(6, this.J, 1, w(a, b ?? 0), c));
    return u(c);
  }
  set(a, b) {
    N(this.g, this.J, 2, w(a, b));
  }
  qg(a, b, c) {
    N(this.g, this.J, 36, w(a, b ?? 0, c ?? 0));
    return this;
  }
  ng(a, b, c) {
    N(this.g, this.J, 37, w(a, b ?? 0, c ?? 0));
    return this;
  }
  rg(a, b, c) {
    N(this.g, this.J, 38, w(a, b ?? "", c ?? 0));
    return this;
  }
  Na() {
    console.error("sessao: map.cell(key) sem suporte (fatia 3: so bridge)");
    return {id:-1};
  }
}
class nf {
  constructor(a, b) {
    this.g = a;
    this.J = b;
  }
  get ref() {
    const a = K(this.g);
    this.g.g.push(new y(6, this.J, 12, [], a));
    return u(a);
  }
  create(a) {
    N(this.g, this.J, 0, w(a));
  }
  text(a, b, c) {
    const d = K(this.g);
    this.g.g.push(new y(6, this.J, 15, c === void 0 ? w(a, b) : w(a, b, c), d));
    return new ad(u(d));
  }
  V(a, b) {
    const c = K(this.g);
    this.g.g.push(new y(6, this.J, 16, w(a, b), c));
    return u(c);
  }
  Xc(a) {
    const b = K(this.g);
    this.g.g.push(new y(6, this.J, 39, w(a), b));
    return new ad(u(b));
  }
  rows() {
    const a = K(this.g);
    this.g.g.push(new y(6, this.J, 17, [], a));
    return u(a);
  }
  cols() {
    const a = K(this.g);
    this.g.g.push(new y(6, this.J, 18, [], a));
    return u(a);
  }
  init(a, b) {
    N(this.g, this.J, 19, w(a, b));
  }
  lc(a, b, c) {
    N(this.g, this.J, 20, w(a, b, c));
  }
  La(a, b, c) {
    N(this.g, this.J, 21, w(a, b, c.t));
  }
}
class ef {
  constructor(a, b) {
    this.g = a;
    this.J = b;
  }
  init(a, b) {
    N(this.g, this.J, 22, w(a, b));
  }
  lc(a, b, c) {
    N(this.g, this.J, 23, w(a, b, c));
  }
  La(a, b, c) {
    N(this.g, this.J, 24, [a, b, c]);
  }
  Kg(a, b) {
    const c = K(this.g);
    this.g.g.push(new y(6, this.J, 25, w(a, b), c));
    return u(c);
  }
  dc(a, b, c) {
    const d = K(this.g);
    this.g.g.push(new y(6, this.J, 26, c === void 0 ? w(a, b) : w(a, b, c), d));
    return u(d);
  }
  rows() {
    const a = K(this.g);
    this.g.g.push(new y(6, this.J, 27, [], a));
    return u(a);
  }
  cols() {
    const a = K(this.g);
    this.g.g.push(new y(6, this.J, 28, [], a));
    return u(a);
  }
  index() {
    const a = K(this.g);
    this.g.g.push(new y(6, this.J, 32, [], a));
    return u(a);
  }
  find() {
    console.error("sessao: find sem suporte (plano tabelas: so bridge)");
    return 0;
  }
  count() {
    console.error("sessao: count sem suporte (plano tabelas: so bridge)");
    return 0;
  }
  apply() {
    console.error("sessao: apply sem suporte (plano calc K1: so bridge)");
  }
  Xc(a) {
    const b = K(this.g);
    this.g.g.push(new y(6, this.J, 40, w(a), b));
    return u(b);
  }
  jg(a) {
    const b = K(this.g);
    this.g.g.push(new y(6, this.J, 41, [a], b));
    return u(b);
  }
  Wf(a) {
    const b = K(this.g);
    this.g.g.push(new y(6, this.J, 42, w(a), b));
    return u(b);
  }
  Vf(a) {
    const b = K(this.g);
    this.g.g.push(new y(6, this.J, 43, w(a), b));
    return u(b);
  }
  open(a) {
    N(this.g, this.J, 44, [a]);
  }
  status() {
    const a = K(this.g);
    this.g.g.push(new y(6, this.J, 45, [], a));
    return u(a);
  }
  Cc() {
    const a = K(this.g);
    this.g.g.push(new y(6, this.J, 46, [], a));
    return u(a);
  }
}
class ff {
  constructor(a, b) {
    this.g = a;
    this.J = b;
  }
  get(a, b) {
    const c = K(this.g);
    this.g.g.push(new y(6, this.J, 29, b === void 0 ? w(a) : w(a, b), c));
    return u(c);
  }
  set(a, b) {
    N(this.g, this.J, 30, w(a, b));
  }
}
class of {
  constructor(a) {
    this.g = a;
  }
  h() {
    const a = K(this.g);
    this.g.g.push(new y(0, -1, 16, [], a));
    return new nf(this.g, a);
  }
}
class pf {
  constructor(a, b) {
    this.g = a;
    this.J = b;
  }
  ya(a, b) {
    N(this.g, this.J, 6, w(a, b));
    return this;
  }
}
class qf {
  constructor(a, b) {
    this.g = a;
    this.J = b;
  }
  og(a, b) {
    N(this.g, this.J, 7, w(a, b));
  }
  pg(a, b) {
    N(this.g, this.J, 8, w(a, b));
  }
  ya(a, b) {
    N(this.g, this.J, 6, w(a, b));
    return this;
  }
  Tb(a) {
    const b = K(this.g);
    this.g.g.push(new y(6, this.J, 9, w(a), b));
    return new pf(this.g, b);
  }
  label(a) {
    const b = this.g.g;
    for (let c = b.length - 1; c >= 0; c--) {
      if (b[c].h === this.J) {
        b[c].name = a;
        break;
      }
    }
    return this;
  }
}
class rf {
  constructor(a, b) {
    this.g = a;
    this.J = b;
  }
  yg(a) {
    const b = K(this.g);
    this.g.g.push(new y(6, this.J, 10, [new $c(a.J)], b));
    return new qf(this.g, b);
  }
}
class sf {
  constructor(a, b, c) {
    this.g = a;
    this.h = b;
    this.self = new qf(a, c);
  }
  end() {
    const a = K(this.g);
    this.g.g.push(new y(6, this.h, 11, [], a));
    return new rf(this.g, a);
  }
}
;function tf(a, b, c, d) {
  switch(b) {
    case 0:
      return c.length > 1 ? a.Y.V(c[1], c[0], d) : a.Y.V(void 0, c[0], d);
    case 1:
      return c.length ? a.Y.local(c[0], d) : a.Y.local(void 0, d);
    case 2:
      return a.i(c.slice(1), c[0]);
    case 14:
      return a.Y.hd(c[0], c[1], d);
    case 15:
      return a.Y.V(c[0], c[1], d);
    case 3:
      return a.add(c[0], c[1]);
    case 4:
      return a.sub(c[0], c[1]);
    case 5:
      return a.h(c[0], c[1]);
    case 6:
      return a.j(c[0], c[1]);
    case 7:
      return a.o(c[0], c[1]);
    case 8:
      return a.sin(c[0]);
    case 9:
      return a.cos(c[0]);
    case 10:
      return a.H(c[0]);
    case 11:
      a.set(c[0], c[1]);
      break;
    case 12:
      a.D(c[0], c[1], c[2], c[3]);
      break;
    case 13:
      a.C(c[0], c[1]);
  }
  return 0;
}
function uf(a, b, c) {
  switch(b) {
    case 0:
      a.xc(c[0]);
      break;
    case 48:
      a.Qg(c[0]);
      break;
    case 49:
      return a.Jg(c[0]);
    case 1:
      return a.Y.local(c[0]);
    case 2:
      return a.Ig(c[0]);
    case 3:
      a.sh(c[0], c[1]);
      break;
    case 4:
      return a.$e(c[0], c[1]);
    case 5:
      a.af(c[0], c[1]);
      break;
    case 8:
      return a.Mf(c[0], c[1], c[2]);
    case 9:
      a.fd(c[0], c[1], c[2]);
      break;
    case 10:
      a.$c(c[0], c[1], c[2]);
      break;
    case 11:
      a.Zc();
      break;
    case 12:
      a.bd();
      break;
    case 13:
      return a.dd(c[0], c[1], c[2]);
    case 14:
      a.ad();
      break;
    case 15:
      a.Sc();
      break;
    case 16:
      a.Yc();
      break;
    case 17:
      a.ag();
      break;
    case 18:
      c.length > 1 ? a.Oe(c[0], c[1]) : a.Oe(c[0]);
      break;
    case 19:
      return a.Hg(c[0]);
    case 20:
      return a.Mg();
    case 21:
      return a.Lg(c[0], c[1]);
    case 22:
      return a.Ic(c[0]);
    case 23:
      a.Sg();
      break;
    case 24:
      a.Xf();
      break;
    case 25:
      return a.Lf(c[0], c[1]);
    case 27:
      return a.oh(c[0], c[1]);
    case 28:
      a.ph(c[0], c[1], c[2]);
      break;
    case 29:
      c.length > 1 ? a.log(c[0], c[1]) : a.log(c[0]);
      break;
    case 30:
      a.capture();
      break;
    case 31:
      a.dg();
      break;
    case 32:
      a.claim();
      break;
    case 33:
      a.set(c[0], c[1]);
      break;
    case 34:
      a.ig(c[0], c[1]);
      break;
    case 50:
      a.gg(c[0], c[1]);
      break;
    case 51:
      a.Tf();
      break;
    case 54:
      return a.Zf(c[0], c[1]);
    case 55:
      a.close(c[0]);
      break;
    case 52:
      a.Pg(c[0]);
      break;
    case 53:
      a.Og(c[0]);
      break;
    case 35:
      return a.hg(c[0]);
    case 36:
      a.ae(c[0]);
      break;
    case 37:
      a.fg(c[0], c[1]);
      break;
    case 45:
      return a.table(c[0]);
    case 46:
      return a.map(c[0]);
    case 42:
      return a.kf(c[0]);
    case 43:
      return a.eh(c[0], c[1]);
    case 44:
      return a.Zg(c[0], c[1]);
    case 57:
      return a.wg(c[0]);
    case 58:
      return a.dc(c[0]);
    case 59:
      return a.dh(c[0]);
    case 60:
      return a.$g(c[0]);
    case 61:
      return a.gh(c[0]);
    case 74:
      return a.mh(c[0], c[1]);
    case 62:
      return a.kh(c[0], c[1], c[2]);
    case 63:
      return a.fh(c[0], c[1], c[2]);
    case 64:
      return a.hh(c[0], c[1], c[2]);
    case 65:
      return a.Yg(c[0]);
    case 66:
      return a.Xg(c[0], c[1]);
    case 67:
      return a.ah(c[0], c[1], c[2]);
    case 68:
      a.bh(c[0]);
      break;
    case 69:
      return a.nh(c[0]);
    case 70:
      return a.jh(c[0], c[1]);
    case 71:
      return a.ih(c[0], c[1]);
    case 72:
      a.Rf(c[0]);
      break;
    case 73:
      a.Sf(c[0], c[1]);
      break;
    case 56:
      a.La(c[0], c[1]);
  }
  return 0;
}
function vf(a, b, c) {
  switch(b) {
    case 0:
      return a.Bb(c[0], c[1]);
    case 1:
      return a.Sd(c[0]);
    case 2:
      return a.root();
    case 3:
      a.segment(c[0]);
      break;
    case 4:
      a.Nb(c[0]);
      break;
    case 22:
      a.target(c[0], c[1], c[2], c[3]);
      break;
    case 5:
      a.yc();
      break;
    case 6:
      a.Ac();
      break;
    case 21:
      a.Bc(c[0]);
      break;
    case 12:
      a.rc();
      break;
    case 7:
      a.Lb();
      break;
    case 8:
      a.Kb();
      break;
    case 9:
      return a.oe(c[0], c[1], c[2], c[3]);
    case 10:
      a.ff();
      break;
    case 11:
      a.jb(c[0], c[1]);
      break;
    case 13:
      a.pb(c[0], c[1], c[2], c[3], c[4], c[5]);
      break;
    case 14:
      return a.Pd(c[0]);
    case 18:
      return a.Ld(c[0]);
    case 16:
      return a.table.h();
    case 17:
      return a.create.map();
    case 15:
      a.vc(new ad(c[0]), c[1], c[2]);
      break;
    case 19:
      a.Jc(new ad(c[0]), c[1], c[2], c[3]);
      break;
    case 20:
      a.Fc(new ad(c[0]));
  }
}
function wf(a, b, c) {
  switch(b) {
    case 0:
      a.create(c[0]);
      break;
    case 1:
      return a.get(c[0], c[1]);
    case 2:
      a.set(c[0], c[1]);
      break;
    case 36:
      return a.qg(c[0], c[1], c[2]);
    case 37:
      return a.ng(c[0], c[1], c[2]);
    case 38:
      return a.rg(c[0], c[1], c[2]);
    case 6:
      a.ya(c[0], c[1]);
      break;
    case 7:
      a.og(c[0], c[1]);
      break;
    case 8:
      a.pg(c[0], c[1]);
      break;
    case 9:
      return a.Tb(c[0]);
    case 10:
      return a.yg(c[0]);
    case 11:
      return a.end();
    case 12:
      return a.ref;
    case 13:
      return a[c[0]];
    case 15:
      return a.text(c[0], c[1], c[2]).t;
    case 39:
      return a.Xc(c[0]).t;
    case 16:
      return a.V(c[0], c[1]);
    case 17:
      return a.rows();
    case 18:
      return a.cols();
    case 19:
      a.init(c[0], c[1]);
      break;
    case 20:
      a.lc(c[0], c[1], c[2]);
      break;
    case 21:
      a.La(c[0], c[1], new ad(c[2]));
      break;
    case 22:
      a.init(c[0], c[1]);
      break;
    case 23:
      a.lc(c[0], c[1], c[2]);
      break;
    case 24:
      a.La(c[0], c[1], c[2]);
      break;
    case 25:
      return a.Kg(c[0], c[1]);
    case 26:
      return a.dc(c[0], c[1], c[2]);
    case 27:
      return a.rows();
    case 28:
      return a.cols();
    case 32:
      return a.index();
    case 40:
      return a.Xc(c[0]);
    case 41:
      return a.jg(c[0]);
    case 42:
      return a.Wf(c[0]);
    case 43:
      return a.Vf(c[0]);
    case 44:
      a.open(c[0]);
      break;
    case 45:
      return a.status();
    case 46:
      return a.Cc();
    case 29:
      return a.get(c[0], c[1]);
    case 30:
      a.set(c[0], c[1]);
      break;
    default:
      console.error("_play_slot: op " + b + " ignorado (extinto?)");
  }
}
;function xf(a, b, c, d) {
  const e = [null];
  e.length = a.length;
  for (let f = 0; f < a.length; f++) {
    const g = a[f];
    if (g instanceof $c) {
      e[f] = c[g.Ja];
      continue;
    }
    if (Array.isArray(g)) {
      e[f] = xf(g, b, c, d);
      continue;
    }
    const h = Zc(g);
    e[f] = h > 0 ? d[h] : g;
  }
  return e;
}
function J(a, b, c, d) {
  a.g.push(new y(b, -1, c, d, -1));
}
function Ye(a, b, c) {
  b = new y(1, -1, b, w(c), -1);
  b.set = !0;
  a.g.push(b);
}
function $e(a, b, c, d) {
  const e = K(a);
  b = new y(2, -1, b, c, e);
  d && (b.name = d, a.h.set(d, u(e)));
  a.g.push(b);
  return u(e);
}
function af(a, b, c) {
  const d = 8192 + a.j++;
  a.g.push(new y(2, -1, b, c, d));
  return u(d);
}
function K(a) {
  return a.i++;
}
function N(a, b, c, d) {
  a.g.push(new y(6, b, c, d, -1));
}
class yf {
  constructor() {
    this.L = [];
    this.i = 1;
    this.j = 0;
    this.h = new Map();
    this.g = this.L;
    this.C = new Xe(this);
    this.o = new Ze(this);
    this.H = new bf(this);
    this.D = new gf(this);
    this.O = new lf(this);
    this.W = new hf(this);
    this.P = new jf(this);
    this.T = new kf(this);
    this.da = new of(this);
  }
  get R() {
    return this.C;
  }
  get M() {
    return this.o;
  }
  get mb() {
    return this.H;
  }
  get table() {
    return this.da;
  }
  get Yb() {
    return this.D;
  }
  get action() {
    return this.O;
  }
  get run() {
    return this.W;
  }
  get $d() {
    return this.P;
  }
  get get() {
    return this.T;
  }
  segment(a) {
    J(this, 0, 3, w(a));
  }
  Nb(a) {
    J(this, 0, 4, w(a));
  }
  target(a, b, c, d) {
    J(this, 0, 22, w(a, b, c, d));
  }
  yc() {
    J(this, 0, 5, []);
  }
  Ac() {
    J(this, 0, 6, []);
  }
  Bc(a) {
    J(this, 0, 21, [a]);
  }
  rc() {
    J(this, 0, 12, []);
  }
  Ub(a) {
    const b = this.g;
    for (let c = b.length - 1; c >= 0; c--) {
      const d = b[c];
      if (d.g === 0 && (d.m === 0 || d.m === 1)) {
        d.name = a || "";
        break;
      }
    }
  }
  Lb() {
    J(this, 0, 7, []);
  }
  Kb() {
    J(this, 0, 8, []);
  }
  jb(a, b) {
    J(this, 0, 11, [a, b]);
  }
  pb(a, b, c, d, e, f) {
    J(this, 0, 13, w(a, b, c, d, e, f));
  }
  vc(a, b, c) {
    J(this, 0, 15, w(a.t, b, c));
  }
  Fc(a) {
    J(this, 0, 20, w(a.t));
  }
  Jc(a, b, c, d) {
    J(this, 0, 19, w(a.t, b, c, d));
  }
  ff(a) {
    this.g.push(new y(0, a !== void 0 ? a : -1, 10, [], -1));
  }
}
class zf {
  constructor() {
    this.g = new yf();
  }
  get L() {
    return this.g.L;
  }
  get table() {
    return this.g.table;
  }
  get create() {
    return {map:() => {
      const a = K(this.g);
      this.g.g.push(new y(0, -1, 17, [], a));
      return new mf(this.g, a);
    }, table:() => this.g.table.h(), Ma:() => {
      console.error("sessao: create.array sem suporte (espelho parray pendente)");
      return -1;
    }};
  }
  Bb(a) {
    var b = this.g, c = this.g;
    const d = K(c), e = K(c);
    a = new y(0, -1, 0, [a], d);
    a.o = 1;
    a.j = e;
    c.g.push(a);
    return new Yd(b, new sf(c, d, e));
  }
  Sd(a) {
    var b = this.g, c = this.g;
    const d = K(c), e = K(c);
    a = new y(0, -1, 1, a !== void 0 ? [a] : [], d);
    a.o = 1;
    a.j = e;
    c.g.push(a);
    return new Yd(b, new sf(c, d, e));
  }
  Ub(a) {
    this.g.Ub(a);
  }
  root() {
    var a = this.g;
    const b = K(a);
    a.g.push(new y(0, -1, 2, [], b));
    return new qf(a, b);
  }
  Pd(a) {
    var b = this.g;
    const c = K(b);
    b.g.push(new y(0, -1, 14, [a], c));
    return new rf(b, c);
  }
  Ld(a) {
    var b = this.g;
    const c = K(b);
    b.g.push(new y(0, -1, 18, [a], c));
    return u(c);
  }
  oe(a, b, c, d) {
    var e = this.g;
    const f = K(e), g = K(e);
    b = new y(0, -1, 9, [a, b, c, d || ""], f);
    b.o = 2;
    b.j = g;
    e.g.push(b);
    b = [];
    for (c = 0; c < a; c++) {
      d = K(e), e.g.push(new y(6, g, 13, [c], d)), b.push(u(d));
    }
    return new Zd(this.g, new $c(f), b);
  }
}
;const Af = {pj:1, rj:2, qj:3, yj:4, sj:5, gj:6, hj:7, Zi:8, Si:9, aj:11}, Bf = {nj:1, zj:2, Pi:3, Ri:4, Qi:5};
function Cf(a, b) {
  return a.h.view.getFloat64(a.g + b * 8, !0);
}
class Df {
  constructor(a) {
    this.h = a;
    this.g = 0;
  }
  x() {
    return Cf(this, 1);
  }
  y() {
    return Cf(this, 2);
  }
  buttons() {
    return Cf(this, 3) | 0;
  }
  id() {
    return Cf(this, 4) | 0;
  }
}
function Ef(a, b) {
  return a.g.view.getFloat64(a.h + b * 8, !0);
}
class Ff {
  constructor(a) {
    this.g = a;
    this.h = 0;
  }
  id() {
    return Ef(this, 0) | 0;
  }
  F() {
    return Ef(this, 1) | 0;
  }
  uuid() {
    const a = Ef(this, 4) | 0;
    if (!a) {
      return "";
    }
    const b = this.g.g;
    let c = a;
    for (; c < a + 64 && b[c] !== 0;) {
      c++;
    }
    return c > a ? this.g.i(a, c) : "";
  }
  Ob(a, b) {
    const c = Ef(this, 2) | 0, d = Ef(this, 3) | 0;
    if (c) {
      const e = this.g.view;
      for (let f = 0; f < d; f++) {
        if ((e.getFloat64(c + f * 16, !0) | 0) === a) {
          return e.getFloat64(c + f * 16 + 8, !0);
        }
      }
    }
    return b !== void 0 ? b : 0;
  }
  has(a) {
    const b = Ef(this, 2) | 0, c = Ef(this, 3) | 0;
    if (!b) {
      return !1;
    }
    const d = this.g.view;
    for (let e = 0; e < c; e++) {
      if ((d.getFloat64(b + e * 16, !0) | 0) === a) {
        return !0;
      }
    }
    return !1;
  }
}
function Gf(a, b, c) {
  const d = a.W, e = a.D(), f = [], g = new Df(a), h = new Ff(a);
  let k = null;
  if (c.bc) {
    const m = c.bc;
    f[0] = l => {
      try {
        k ||= new Xb(a, l, 0, 0), k.o = l, m(k);
      } catch (p) {
        console.error("editorHook onRender:", p);
      }
    };
  }
  if (c.$b) {
    const m = c.$b;
    f[1] = l => {
      try {
        g.g = l, m(g) && g.h.view.setFloat64(g.g + 40, 1.0, !0);
      } catch (p) {
        console.error("editorHook onEvent:", p);
      }
    };
  }
  if (c.ac) {
    const m = c.ac;
    f[2] = l => {
      try {
        g.g = l, m(g) && g.h.view.setFloat64(g.g + 40, 1.0, !0);
      } catch (p) {
        console.error("editorHook onKeep:", p);
      }
    };
  }
  if (c.Jb) {
    const m = c.Jb;
    f[4] = (l, p) => {
      try {
        m(l, p);
      } catch (r) {
        console.error("editorHook onSetData:", r);
      }
    };
  }
  if (c.Ib) {
    const m = c.Ib;
    f[7] = l => {
      try {
        h.h = l, m(h);
      } catch (p) {
        console.error("editorHook onFeedback:", p);
      }
    };
  }
  a.K[e] = f;
  Ee(d, b, 15, e);
  return {slot:e, unregister() {
    Ee(d, b, 16, e);
    a.K[e] = 0;
    k && (k.D(), k = null);
  }};
}
;class Hf {
  constructor(a, b) {
    this.g = a;
    this.ra = b.ra;
    this.depth = b.depth;
    this.uuid = b.uuid || "";
    this.ga = b.ga;
    this.Ab = b.Ab;
    this.kc = b.kc;
    this.B = b.B;
    this.Cb = b.Cb;
    this.Mb = b.Mb;
    this.i = this.C();
    this.G = this.o();
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
function If(a) {
  return a.i(Jf(a.h));
}
class Kf {
  D() {
    return [];
  }
  i(a) {
    return new Hf(this, {ra:0, depth:0, ga:0, Ab:0, kc:0, B:a, Cb:0, Mb:0});
  }
  refresh() {
  }
  gb() {
  }
  o() {
  }
  Oc(a) {
    return a.map(b => new Hf(this, b));
  }
}
;function Lf(a) {
  const b = new Map();
  for (let c = 0; c < a.length; c++) {
    a[c].h >= 0 && b.set(a[c].h, c);
  }
  return b;
}
function Mf(a, b) {
  for (let d = 0; d < a.length; d++) {
    var c = a[d];
    if (Array.isArray(c)) {
      Mf(c, b);
      continue;
    }
    c = Zc(c);
    c > 0 && b.push(c);
  }
}
function Nf(a) {
  const b = [];
  Mf(a.a, b);
  return b;
}
function Of(a, b, c, d, e) {
  b = Nf(a[b]);
  for (let g = 0; g < b.length; g++) {
    var f = b[g];
    if (!(f >= 8192)) {
      continue;
    }
    f = c.get(f);
    f === void 0 || d.has(f) || (d.add(f), Of(a, f, c, d, e), e.push(f));
  }
}
function Pf(a, b, c) {
  c ||= Lf(a);
  const d = [];
  Of(a, b, c, new Set(), d);
  return d;
}
function Qf(a, b, c) {
  if (b !== c) {
    var d = Pf(a, b), e = new Set(d);
    e.add(b);
    var f = [];
    for (let g = 0; g < d.length; g++) {
      f.push(a[d[g]]);
    }
    f.push(a[b]);
    b = Array.from(e);
    b.sort((g, h) => h - g);
    for (d = 0; d < b.length; d++) {
      a.splice(b[d], 1);
    }
    d = c;
    for (e = 0; e < b.length; e++) {
      b[e] < c && d--;
    }
    for (c = 0; c < f.length; c++) {
      a.splice(d + c, 0, f[c]);
    }
  }
}
;function Rf(a) {
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
function Sf(a) {
  const b = [];
  let c = 0;
  const d = a.length;
  for (; c < d;) {
    var e = a[c];
    if (e === " " || e === "\t" || e === "\r" || e === "\n") {
      c++;
    } else {
      if (e >= "0" && e <= "9" || e === ".") {
        var f = c;
        e = e === ".";
        for (c++; c < d;) {
          const g = a[c];
          if (g >= "0" && g <= "9") {
            c++;
          } else if (g !== "." || e) {
            break;
          } else {
            e = !0, c++;
          }
        }
        f = a.substring(f, c);
        e = parseFloat(f);
        if (isNaN(e)) {
          return "Invalid number: " + f;
        }
        b.push({t:0, $:e});
      } else {
        if (e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_") {
          f = c;
          for (c++; c < d;) {
            if (e = a[c], e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e >= "0" && e <= "9" || e === "_") {
              c++;
            } else {
              break;
            }
          }
          b.push({t:1, $:a.substring(f, c)});
        } else {
          if (e === "+" || e === "-" || e === "*" || e === "/" || e === "%") {
            b.push({t:2, $:e}), c++;
          } else {
            if (e === "(") {
              b.push({t:3, $:"("}), c++;
            } else {
              if (e === ")") {
                b.push({t:4, $:")"}), c++;
              } else {
                return "Unexpected character: " + e;
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
function Tf(a) {
  function b() {
    return a[k];
  }
  function c() {
    return a[k++];
  }
  function d() {
    let l = e();
    if (typeof l === "string") {
      return l;
    }
    for (; b().t === 2 && (b().$ === "+" || b().$ === "-");) {
      const p = Rf(c().$), r = e();
      if (typeof r === "string") {
        return r;
      }
      l = {Ka:p, Hb:l, r};
    }
    return l;
  }
  function e() {
    let l = f();
    if (typeof l === "string") {
      return l;
    }
    for (; b().t === 2 && (b().$ === "*" || b().$ === "/" || b().$ === "%");) {
      const p = Rf(c().$), r = f();
      if (typeof r === "string") {
        return r;
      }
      l = {Ka:p, Hb:l, r};
    }
    return l;
  }
  function f() {
    if (b().t === 2 && b().$ === "-") {
      c();
      const l = f();
      return typeof l === "string" ? l : l.Ka === 0 ? {Ka:0, $:-l.$} : {Ka:7, a:l};
    }
    return g();
  }
  function g() {
    if (b().t === 1 && (b().$ === "sin" || b().$ === "cos")) {
      const l = c().$;
      if (b().t !== 3) {
        return "Expected ( after " + l;
      }
      c();
      const p = d();
      if (typeof p === "string") {
        return p;
      }
      if (b().t !== 4) {
        return "Expected ) after " + l + " argument";
      }
      c();
      return {Ka:l === "sin" ? 8 : 9, a:p};
    }
    return h();
  }
  function h() {
    var l = b();
    if (l.t === 0) {
      return c(), {Ka:0, $:l.$};
    }
    if (l.t === 1) {
      return c(), {Ka:1, name:l.$};
    }
    if (l.t === 3) {
      c();
      l = d();
      if (typeof l === "string") {
        return l;
      }
      if (b().t !== 4) {
        return "Expected )";
      }
      c();
      return l;
    }
    return "Unexpected token: " + (l.$ !== null ? l.$ : "end of expression");
  }
  let k = 0;
  const m = d();
  return typeof m === "string" ? m : b().t !== 5 ? "Unexpected token after expression: " + b().$ : m;
}
function Uf(a, b) {
  a.Ka === 1 ? b.add(a.name) : (a.Hb && Uf(a.Hb, b), a.r && Uf(a.r, b), a.a && Uf(a.a, b));
}
function Vf(a, b, c) {
  switch(a.Ka) {
    case 0:
      return a.$;
    case 1:
      return c.get(a.name);
    case 2:
      return b.add(Vf(a.Hb, b, c), Vf(a.r, b, c));
    case 3:
      return b.sub(Vf(a.Hb, b, c), Vf(a.r, b, c));
    case 4:
      return b.h(Vf(a.Hb, b, c), Vf(a.r, b, c));
    case 5:
      return b.j(Vf(a.Hb, b, c), Vf(a.r, b, c));
    case 6:
      return b.o(Vf(a.Hb, b, c), Vf(a.r, b, c));
    case 7:
      return b.sub(0, Vf(a.a, b, c));
    case 8:
      return b.sin(Vf(a.a, b, c));
    case 9:
      return b.cos(Vf(a.a, b, c));
  }
  return 0;
}
function Wf(a, b) {
  b = Sf(b);
  if (typeof b === "string") {
    return {error:b};
  }
  b = Tf(b);
  if (typeof b === "string") {
    return {error:b};
  }
  const c = new Set();
  Uf(b, c);
  const d = new Map(), e = [];
  c.forEach(function(f) {
    const g = a.g.h.get(f);
    g !== void 0 ? d.set(f, g) : e.push(f);
  });
  return e.length > 0 ? {error:"Unknown variable" + (e.length > 1 ? "s" : "") + ": " + e.join(", ")} : {value:Vf(b, a.g.M, d)};
}
;const Xf = {[0]:"epar (legado)", [14]:"alloc_int", [15]:"alloc_double", [1]:"alloc", [2]:"alloc_array", [3]:"add", [4]:"sub", [5]:"mul", [6]:"div", [7]:"mod", [8]:"sin", [9]:"cos", [10]:"keep", [11]:"set", [12]:"comp", [13]:"print"}, Yf = {[0]:"if_comp", [1]:"if_bool", [2]:"else_if_comp", [3]:"else", [4]:"end_if", [5]:"for", [6]:"end_for", [7]:"break", [8]:"continue"}, Zf = {[0]:"define_gralm", [1]:"define_gralm_internal", [2]:"root", [3]:"segment", [4]:"targetLayer", [22]:"target", [5]:"hit_area", 
[6]:"latch_matrix", [21]:"line_dash", [12]:"disable_next", [7]:"scope_push", [8]:"scope_pop", [9]:"record_func_begin", [10]:"record_func_end", [11]:"call_func", [13]:"plot_svg", [14]:"class_ref", [15]:"fill_ptext", [20]:"pfont", [16]:"declare_table", [17]:"declare_map", [18]:"atom"}, $f = {[0]:"create", [1]:"get", [2]:"set", [14]:"peer_data", [3]:"register_peer", [5]:"bind_peer", [6]:"init_data", [7]:"init_edata", [8]:"init_edata_text", [9]:"add_coded_event", [10]:"new_instance", [11]:"end", [12]:"read_ref", 
[13]:"read_param", [15]:"text", [16]:"num", [17]:"rows", [18]:"cols", [19]:"init", [20]:"write_num", [21]:"write_text", [22]:"init", [23]:"write_num", [24]:"write_text", [25]:"read_num", [26]:"read_text", [27]:"rows", [28]:"cols", [32]:"index", [39]:"col_name", [40]:"col_name", [41]:"find_col", [42]:"col_type", [43]:"col_flags", [44]:"open", [45]:"status", [46]:"loc", [29]:"get", [30]:"set", [31]:"borrow (extinto)"}, ag = {[0]:"handler", [1]:"alloc", [2]:"read_data", [3]:"write_data", [4]:"map_get", 
[5]:"map_set", [45]:"table", [46]:"map", [8]:"calc_op", [9]:"if_comp", [10]:"else_if_comp", [11]:"else_", [12]:"end_if", [13]:"for_", [14]:"end_for", [15]:"break_", [16]:"continue_", [17]:"dirty", [18]:"call_native", [19]:"read_box", [20]:"read_value", [21]:"read_par", [22]:"read_event", [23]:"skip", [24]:"consume", [25]:"calc1", [48]:"ret", [49]:"read_kv", [27]:"up_get", [28]:"up_set", [29]:"log", [30]:"capture", [31]:"end_gesture", [32]:"claim", [33]:"set", [34]:"fb_set", [50]:"evt_emit_root", 
[51]:"close_self", [54]:"create_child", [55]:"close", [52]:"res_hold", [53]:"res_drop", [35]:"fb_get", [36]:"fb_emit", [37]:"evt_emit", [42]:"txt_lit", [43]:"txt_from_num", [44]:"txt_concat", [57]:"loc_name", [58]:"read_text", [59]:"txt_from_char", [60]:"txt_drop_last", [61]:"txt_len", [62]:"txt_sub", [63]:"txt_insert_at", [64]:"txt_remove", [65]:"txt_chars", [66]:"txt_char_at", [67]:"txt_find", [68]:"txt_font", [69]:"txt_width", [70]:"txt_rich_w", [71]:"txt_rich_h", [72]:"clip_copy", [73]:"clip_paste", 
[56]:"write_text"}, bg = a => ag[a], cg = "rec ctx calc flow evt state slot action run fb".split(" "), dg = [a => Zf[a]];
dg[1] = Db;
dg[2] = a => Xf[a];
dg[3] = a => Yf[a];
dg[4] = bg;
dg[6] = a => $f[a];
dg[7] = bg;
dg[8] = bg;
dg[9] = bg;
dg[10] = bg;
const eg = [32, 1, 2, 4, 8, , 64, 256, 8, 256, 256];
function fg(a, b) {
  const c = eg[a.g];
  return !(c && b & c) || a.g === 0 && a.m === 12 || Vc(a) ? !1 : a.h >= 8192 ? (b & 128) !== 0 : !0;
}
function gg(a, b, c, d) {
  if (a < 8192) {
    return c.get(a) || "[hid " + a + "]";
  }
  var e = d.get(a);
  if (e === void 0) {
    return "[hid " + a + "]";
  }
  e = b[e];
  switch(e.m) {
    case 3:
      return "(" + hg(e.a[0], b, c, d) + " + " + hg(e.a[1], b, c, d) + ")";
    case 4:
      return a = e.a[0], typeof a !== "number" || Number.isNaN(a) || a !== 0 ? "(" + hg(a, b, c, d) + " - " + hg(e.a[1], b, c, d) + ")" : "-(" + hg(e.a[1], b, c, d) + ")";
    case 5:
      return "(" + hg(e.a[0], b, c, d) + " * " + hg(e.a[1], b, c, d) + ")";
    case 6:
      return "(" + hg(e.a[0], b, c, d) + " / " + hg(e.a[1], b, c, d) + ")";
    case 7:
      return "(" + hg(e.a[0], b, c, d) + " % " + hg(e.a[1], b, c, d) + ")";
    case 8:
      return "sin(" + hg(e.a[0], b, c, d) + ")";
    case 9:
      return "cos(" + hg(e.a[0], b, c, d) + ")";
  }
  return "[temp " + a + "]";
}
function hg(a, b, c, d) {
  if (typeof a !== "number") {
    return String(a);
  }
  const e = Zc(a);
  return e <= 0 ? !isFinite(a) || Number.isInteger(a) ? String(a) : a.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") : gg(e, b, c, d);
}
function ig(a, b, c, d) {
  b = Zc(a[b].a[c]);
  if (b <= 0 || b < 8192) {
    return [];
  }
  b = d.get(b);
  if (b === void 0) {
    return [];
  }
  c = [];
  jg(a, b, d, new Set(), c);
  c.push(b);
  return c;
}
function jg(a, b, c, d, e) {
  b = Nf(a[b]);
  for (let g = 0; g < b.length; g++) {
    var f = b[g];
    if (f < 8192) {
      continue;
    }
    f = c.get(f);
    f === void 0 || d.has(f) || (d.add(f), jg(a, f, c, d, e), e.push(f));
  }
}
function kg(a, b, c) {
  if (b.length === 0) {
    return [];
  }
  var d = new Set();
  for (var e = 0; e < b.length; e++) {
    var f = a[b[e]].h;
    f >= 0 && d.add(f);
  }
  f = new Set(b);
  e = new Set();
  for (let g = 0; g < a.length; g++) {
    if (g === c || f.has(g)) {
      continue;
    }
    const h = Nf(a[g]);
    for (let k = 0; k < h.length; k++) {
      d.has(h[k]) && e.add(h[k]);
    }
  }
  c = [];
  for (d = 0; d < b.length; d++) {
    f = a[b[d]].h, f >= 0 && !e.has(f) && c.push(b[d]);
  }
  return c;
}
function lg(a, b, c, d, e, f) {
  if (a instanceof $c) {
    a: {
      a = a.Ja;
      d = d.get(a);
      if (d !== void 0) {
        d = b[d];
        if (d.name) {
          b = d.name;
          break a;
        }
        if (d.g === 0 && (c = e.get(d.h))) {
          b = c;
          break a;
        }
        if (d.g === 6 && d.m === 10 && (f = f.get(a))) {
          b = f;
          break a;
        }
      }
      for (f = 0; f < b.length; f++) {
        if (b[f].j === a) {
          b = (b = e.get(b[f].h)) ? "self:" + b : "self:" + a;
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
      g.push(lg(a[h], b, c, d, e, f));
    }
    return "[" + g.join(", ") + "]";
  }
  if (typeof a !== "number") {
    return String(a);
  }
  e = Zc(a);
  return e <= 0 ? !isFinite(a) || Number.isInteger(a) ? String(a) : a.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") : e >= 8192 ? gg(e, b, c, d) : (b = c.get(e)) ? b : "[hid " + e + "]";
}
function mg(a) {
  const b = a.j, c = cg[b.g] || "tgt" + b.g;
  var d = dg[b.g];
  d = d ? d(b.m) : "m" + b.m;
  ng(a.i);
  const e = a.i.g.L, f = a.i.C, g = a.i.i, h = a.i.j;
  a = a.i.o;
  if (b.set) {
    return c + "." + d + " = " + lg(b.a[0], e, f, g, h, a);
  }
  const k = [];
  for (let m = 0; m < b.a.length; m++) {
    k.push(lg(b.a[m], e, f, g, h, a));
  }
  return c + "." + d + "(" + k.join(", ") + ")";
}
class og {
  constructor(a, b, c, d, e) {
    this.j = a;
    this.P = b;
    this.i = c;
    this.D = d || null;
    this.O = e !== void 0 ? e : -1;
    this.C = this.o = null;
  }
  get oc() {
    return this.j;
  }
  get Pe() {
    return this.P;
  }
  get g() {
    const a = this.j;
    return a.g === 1 ? a.m : -(a.g * 100 + a.m);
  }
  get T() {
    return this.j.a.length;
  }
  get name() {
    var a = this.j;
    const b = dg[a.g];
    if (a.g === 1) {
      return b ? b(a.m) : "CMD_" + a.m;
    }
    const c = cg[a.g] || "tgt" + a.g;
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
    const a = this.i.g.L[this.P - 1];
    return a && a.g === 0 && a.m === 12 ? 1 : 0;
  }
  get W() {
    if (!this.C) {
      const a = this.j.a, b = [];
      for (let c = 0; c < a.length; c++) {
        if (typeof a[c] === "number") {
          const d = Zc(a[c]);
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
    this.j.a[a] = u(b);
    this.C = this.o = null;
    this.i.h++;
  }
}
class pg {
  constructor(a, b, c, d) {
    this.g = a;
    this.i = b;
    this.h = c;
    this.j = d;
    this.o = b.length;
  }
  get R() {
    return this.g.R;
  }
  get M() {
    return this.g.M;
  }
  get mb() {
    return this.g.mb;
  }
  get Yb() {
    return this.g.Yb;
  }
  get action() {
    return this.g.action;
  }
  segment(a) {
    this.g.segment(a);
  }
  Nb(a) {
    this.g.Nb(a);
  }
  target(a, b, c, d) {
    this.g.target(a, b, c, d);
  }
  yc() {
    this.g.yc();
  }
  Ac() {
    this.g.Ac();
  }
  Bc(a) {
    this.g.Bc(a);
  }
  rc() {
    this.g.rc();
  }
  Lb() {
    this.g.Lb();
  }
  Kb() {
    this.g.Kb();
  }
  jb(a, b) {
    this.g.jb(a, b);
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
function qg(a, b, c, d) {
  var e;
  e === void 0 && (e = a.g.filter());
  e = rg(a, e, b);
  if (e === -1) {
    return {error:"Invalid visible index"};
  }
  ng(a.g);
  b = a.g.g.L;
  var f = ig(b, e, c, a.g.i), g = kg(b, f, e);
  f = b.length;
  d = Wf(a.g.g, d);
  if (d.error) {
    return d;
  }
  d = d.value;
  f = b.splice(f);
  g = g.slice();
  g.sort((k, m) => m - k);
  for (var h = 0; h < g.length; h++) {
    b.splice(g[h], 1);
  }
  h = e;
  for (let k = 0; k < g.length; k++) {
    g[k] < e && h--;
  }
  for (e = 0; e < f.length; e++) {
    b.splice(h + e, 0, f[e]);
  }
  b[h + f.length].a[c] = d;
  a.h += f.length - g.length;
  a.g.h++;
  return {value:d};
}
function sg(a, b) {
  var c;
  c === void 0 && (c = a.g.filter());
  c = rg(a, c, b);
  if (c !== -1) {
    ng(a.g);
    b = a.g.g.L;
    var d = Pf(b, c, a.g.i);
    d = kg(b, d, c).slice();
    d.push(c);
    d.sort((e, f) => f - e);
    for (c = 0; c < d.length; c++) {
      b.splice(d[c], 1);
    }
    a.h -= d.length;
    a.g.h++;
  }
}
function tg(a, b) {
  b === void 0 && (b = a.g.filter());
  ng(a.g);
  const c = a.g.g.L, d = a.g.i, e = [];
  let f = 0;
  for (let g = a.i + 1; g < a.h; g++) {
    if (!fg(c[g], b)) {
      continue;
    }
    const h = Pf(c, g, d), k = [];
    for (let m = 0; m < h.length; m++) {
      k.push({oc:c[h[m]], Pe:h[m]});
    }
    e.push(new og(c[g], g, a.g, a, f));
    f++;
  }
  return e;
}
function rg(a, b, c) {
  const d = a.g.g.L;
  let e = 0;
  for (let f = a.i + 1; f < a.h; f++) {
    if (fg(d[f], b)) {
      if (e === c) {
        return f;
      }
      e++;
    }
  }
  return -1;
}
function ug(a, b) {
  const c = a.g.g;
  if (b !== void 0) {
    b = a.i + 1 + b;
  } else {
    a: {
      b = a.g.g.L;
      for (let e = a.i + 1; e < a.h; e++) {
        var d = b[e];
        if (d.g !== 0 || d.m !== 3) {
          continue;
        }
        d = d.a[0] | 0;
        if (d === 5 || d === 2 || d === 4) {
          b = e;
          break a;
        }
      }
      b = a.h;
    }
  }
  return new pg(c.g, c.L, a, b);
}
class vg {
  constructor(a, b, c, d, e, f) {
    this.g = a;
    this.o = b;
    this.C = c;
    this.i = d;
    this.h = e;
    this.j = f;
  }
  get type() {
    return this.o;
  }
  get uuid() {
    return this.C;
  }
  get label() {
    ng(this.g);
    return this.g.j.get(this.j) || "scope";
  }
  count(a) {
    a === void 0 && (a = this.g.filter());
    const b = this.g.g.L;
    let c = 0;
    for (let d = this.i + 1; d < this.h; d++) {
      fg(b[d], a) && c++;
    }
    return c;
  }
  read(a, b) {
    b === void 0 && (b = this.g.filter());
    ng(this.g);
    const c = this.g.g.L;
    var d = this.g.i, e = 0;
    for (let f = this.i + 1; f < this.h; f++) {
      if (fg(c[f], b)) {
        if (e === a) {
          b = Pf(c, f, d);
          d = [];
          for (e = 0; e < b.length; e++) {
            d.push({oc:c[b[e]], Pe:b[e]});
          }
          return new og(c[f], f, this.g, this, a);
        }
        e++;
      }
    }
    return null;
  }
}
function ng(a) {
  if (a.D !== a.h) {
    var b = a.g.L, c = new Map();
    for (var d = 0; d < b.length; d++) {
      var e = b[d];
      e.name && e.h >= 0 && c.set(e.h, e.name);
    }
    a.C = c;
    a.i = Lf(a.g.L);
    b = a.g.L;
    c = new Map();
    d = 0;
    for (e = 0; e < b.length; e++) {
      var f = b[e];
      f.g === 0 && (f.m === 1 ? f.a[0] ? c.set(f.h, f.a[0]) : (c.set(f.h, "internal#" + d), d++) : f.m === 0 && c.set(f.h, f.a[0]));
    }
    for (d = 0; d < b.length; d++) {
      e = b[d], e.g === 6 && e.m === 11 && e.h >= 0 && (f = c.get(e.i)) && c.set(e.h, f);
    }
    a.j = c;
    b = a.g.L;
    c = a.j;
    d = new Map();
    e = new Map();
    for (f = 0; f < b.length; f++) {
      const g = b[f];
      if (g.g === 6 && g.m === 10 && g.h >= 0) {
        const h = c.get(g.i);
        if (!h) {
          continue;
        }
        const k = e.get(g.i) || 0;
        e.set(g.i, k + 1);
        d.set(g.h, h + " #" + k);
      }
    }
    a.o = d;
    a.D = a.h;
  }
}
class wg {
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
    a.R !== !1 && (b |= 1);
    a.M !== !1 && (b |= 2);
    a.mb !== !1 && (b |= 4);
    a.Yb !== !1 && (b |= 8);
    a.state !== !1 && (b |= 16);
    a.rd !== !1 && (b |= 32);
    a.slot !== !1 && (b |= 64);
    a.vj === !0 && (b |= 128);
    return b;
  }
}
;const xg = ["butt", "round", "square"], yg = ["miter", "bevel", "round"], zg = new Set([28, 29, 30, 31, 32, 43, 44, 50, 51]);
function Ag(a, b, c) {
  if (!b || c <= 0) {
    return "";
  }
  a = new Uint8Array(a.buffer, b, c);
  return (new TextDecoder()).decode(a);
}
function Bg(a, b, c) {
  function d(t) {
    return t & 1048576 ? v.length ? v[v.length - 1].rb : m.get(0) : m.get(t);
  }
  const e = c.g, f = t => a.view.getFloat64(b + t * 8, !0), g = (t, x) => a.view.setFloat64(b + t * 8, x, !0), h = (t, x, A) => {
    const B = K(e);
    e.g.push(new y(t, -1, x, A, B));
    return u(B);
  }, k = () => {
    const t = f(7) | 0;
    return t === 1 ? 4 : t === 2 ? 8 : 7;
  }, m = new Map(), l = new Map(), p = new Map(), r = new Map(), q = new Map(), v = [];
  return function(t) {
    if (t >= 1 && t <= 85) {
      if (t === 63) {
        t = Ag(a.view, f(0), f(1)), Ye(e, 63, t);
      } else {
        if (t === 59 || t === 61) {
          var x = Ag(a.view, f(0), f(1)), A = f(2), B = f(3), F = f(4);
          J(e, 1, t, w(x, A, B, F > 0 ? F : void 0));
        } else {
          if (x = f(9) | 0, t === 34) {
            t = [];
            for (A = 0; A < x; A++) {
              t.push(f(A));
            }
            J(e, 1, 34, [t]);
          } else {
            if (zg.has(t)) {
              x = f(0);
              switch(t) {
                case 50:
                  x /= 255.0;
                  break;
                case 28:
                  x = xg[x | 0] || "butt";
                  break;
                case 30:
                  x = yg[x | 0] || "miter";
                  break;
                case 51:
                  x = Gb(x | 0) || "source-over";
              }
              Ye(e, t, x);
            } else {
              if (t === 24 || t === 23) {
                x = x > 0 ? f(0) | 0 : 0, J(e, 1, t, x ? w("evenodd") : []);
              } else {
                if (x === 0) {
                  J(e, 1, t, []);
                } else {
                  A = [null];
                  A.length = x;
                  for (B = 0; B < x; B++) {
                    A[B] = f(B);
                  }
                  J(e, 1, t, A);
                }
              }
            }
          }
        }
      }
    } else {
      switch(t) {
        case 206:
          g(0, $e(e, 14, w(f(0), f(1))));
          break;
        case 207:
          g(0, $e(e, 15, w(f(0), f(1))));
          break;
        case 202:
          g(0, $e(e, 1, w(f(0))));
          break;
        case 205:
          t = f(0);
          x = Ag(a.view, f(1), f(2));
          g(0, $e(e, 1, w(t), x));
          break;
        case 210:
          J(e, 2, 11, w(f(0), f(1)));
          break;
        case 211:
          J(e, 2, 12, w(f(0), f(1), f(2), f(3)));
          break;
        case 220:
          g(0, af(e, 3, w(f(0), f(1))));
          break;
        case 221:
          g(0, af(e, 4, w(f(0), f(1))));
          break;
        case 222:
          g(0, af(e, 5, w(f(0), f(1))));
          break;
        case 223:
          g(0, af(e, 6, w(f(0), f(1))));
          break;
        case 224:
          g(0, af(e, 7, w(f(0), f(1))));
          break;
        case 240:
          g(0, af(e, 8, w(f(0))));
          break;
        case 241:
          g(0, af(e, 9, w(f(0))));
          break;
        case 230:
          t = Ag(a.view, f(0), f(1));
          J(e, 2, 13, w(t, f(2)));
          break;
        case 300:
          J(e, 3, 0, w(f(0), f(1), f(2)));
          break;
        case 301:
          J(e, 3, 1, w(f(0)));
          break;
        case 302:
          J(e, 3, 2, w(f(0), f(1), f(2)));
          break;
        case 303:
          J(e, 3, 3, []);
          break;
        case 304:
          J(e, 3, 4, []);
          break;
        case 310:
          t = K(e);
          e.g.push(new y(3, -1, 5, w(f(0), f(1), f(2)), t));
          g(0, u(t));
          break;
        case 311:
          J(e, 3, 6, []);
          break;
        case 312:
          J(e, 3, 7, []);
          break;
        case 313:
          J(e, 3, 8, []);
          break;
        case 400:
          J(e, 0, 3, w(f(0)));
          break;
        case 401:
          (f(0) | 0) === 0 ? J(e, 0, 4, w(f(2))) : J(e, 0, 22, w(f(0), f(1), f(2), f(3)));
          break;
        case 402:
          J(e, 0, 5, []);
          break;
        case 403:
          J(e, 0, 6, []);
          break;
        case 406:
          J(e, 0, 12, []);
          break;
        case 404:
          J(e, 0, 7, []);
          break;
        case 405:
          J(e, 0, 8, []);
          break;
        case 500:
          t = p.get(f(0) | 0);
          x = K(e);
          e.g.push(new y(6, t, 1, w(f(1), f(2)), x));
          g(0, u(x));
          break;
        case 501:
          t = p.get(f(0) | 0);
          N(e, t, 2, w(f(1), f(2)));
          break;
        case 502:
          t = p.get(f(0) | 0);
          x = K(e);
          e.g.push(new y(6, t, 14, w(f(1), f(2), f(3)), x));
          g(0, u(x));
          break;
        case 100:
          t = Ag(a.view, f(0), f(1));
          x = K(e);
          A = K(e);
          B = new y(0, -1, 0, w(t), x);
          B.o = 1;
          B.j = A;
          e.g.push(B);
          v.push({Md:x, rb:A, uuid:t});
          m.set(0, A);
          break;
        case 101:
          t = f(0) | 0;
          x = m.get(0);
          A = K(e);
          B = K(e);
          F = new y(0, -1, 1, w(), A);
          F.o = 1;
          F.j = B;
          e.g.push(F);
          v.push({Md:A, rb:B, Of:t, Fg:x});
          m.set(0, B);
          break;
        case 103:
          t = Ag(a.view, f(0), f(1));
          if (x = v.length ? v[v.length - 1] : null) {
            for (A = e.g.length - 1; A >= 0; A--) {
              if (B = e.g[A], B.g === 0 && B.h === x.Md && (B.m === 0 || B.m === 1)) {
                B.name = t;
                break;
              }
            }
          }
          break;
        case 104:
          t = f(0) | 0;
          if ((x = v.length ? v[v.length - 1] : null) && t) {
            for (A = e.g.length - 1; A >= 0; A--) {
              if (B = e.g[A], B.g === 0 && B.h === x.Md && (B.m === 0 || B.m === 1)) {
                B.a[1] = t;
                break;
              }
            }
          }
          break;
        case 102:
          t = v.pop();
          x = K(e);
          e.g.push(new y(6, t.Md, 11, [], x));
          t.Of !== void 0 && r.set(t.Of, x);
          t.uuid && q.set(t.uuid, x);
          t.Fg !== void 0 && m.set(0, t.Fg);
          break;
        case 110:
          x = Ag(a.view, f(0), f(1));
          A = f(2) | 0;
          t = f(3) | 0;
          x = q.get(x);
          A = d(A);
          B = K(e);
          e.g.push(new y(6, x, 10, w(new $c(A)), B));
          m.set(t, B);
          break;
        case 111:
          x = f(0) | 0;
          A = f(1) | 0;
          t = f(2) | 0;
          x = r.get(x);
          A = d(A);
          B = K(e);
          e.g.push(new y(6, x, 10, w(new $c(A)), B));
          m.set(t, B);
          break;
        case 120:
          t = d(f(0) | 0);
          N(e, t, 7, w(f(1), f(2)));
          break;
        case 121:
          t = d(f(0) | 0);
          x = Ag(a.view, f(2), f(3));
          N(e, t, 8, w(f(1), x));
          break;
        case 122:
          t = d(f(0) | 0);
          N(e, t, 6, w(f(1), f(2)));
          break;
        case 131:
          t = f(0) | 0;
          A = f(1) | 0;
          x = f(4) | 0;
          A = A === 2 ? void 0 : Ag(a.view, f(2), f(3));
          B = K(e);
          x === 4 ? e.g.push(new y(0, -1, 16, [], B)) : e.g.push(new y(0, -1, 17, [], B));
          N(e, B, 0, w(A));
          p.set(t, B);
          break;
        case 133:
          t = p.get(f(0) | 0);
          x = f(1);
          A = d(f(2) | 0);
          N(e, t, 3, w(x, new $c(A)));
          break;
        case 140:
          t = d(f(0) | 0);
          x = f(1);
          A = f(2) | 0;
          B = K(e);
          e.g.push(new y(6, t, 9, w(x), B));
          l.set(A, B);
          break;
        case 141:
          t = l.get(f(0) | 0);
          N(e, t, 6, w(f(1), f(2)));
          break;
        case 800:
          J(e, k(), 0, w(f(0)));
          break;
        case 801:
          g(0, h(k(), 1, w(f(0))));
          break;
        case 810:
          g(0, h(k(), 2, w(f(0))));
          break;
        case 811:
          J(e, k(), 3, w(f(0), f(1)));
          break;
        case 812:
          g(0, h(k(), 4, w(f(0))));
          break;
        case 813:
          J(e, k(), 5, w(f(0), f(1)));
          break;
        case 816:
          g(0, h(k(), 20, []));
          break;
        case 817:
          g(0, h(k(), 21, w(f(0), f(1))));
          break;
        case 818:
          g(0, h(k(), 19, w(f(0))));
          break;
        case 819:
          g(0, h(k(), 22, w(f(0))));
          break;
        case 820:
          g(0, h(k(), 8, w(f(0), f(1), f(2))));
          break;
        case 830:
          J(e, k(), 9, w(f(0), f(1), f(2)));
          break;
        case 831:
          J(e, k(), 10, w(f(0), f(1), f(2)));
          break;
        case 832:
          J(e, k(), 11, []);
          break;
        case 833:
          J(e, k(), 12, []);
          break;
        case 840:
          g(0, h(k(), 13, w(f(0), f(1), f(2))));
          break;
        case 841:
          J(e, k(), 14, []);
          break;
        case 842:
          J(e, k(), 15, []);
          break;
        case 843:
          J(e, k(), 16, []);
          break;
        case 850:
          J(e, k(), 17, []);
          break;
        case 852:
          J(e, k(), 23, []);
          break;
        case 853:
          J(e, k(), 24, []);
          break;
        case 851:
          J(e, k(), 18, f(1) | 0 ? w(f(0), f(2)) : w(f(0)));
          break;
        case 874:
          g(0, h(k(), 42, [Ag(a.view, f(0), f(1))]));
          break;
        case 875:
          g(0, h(k(), 43, w(f(0), f(1))));
          break;
        case 876:
          g(0, h(k(), 44, w(f(0), f(1))));
          break;
        case 927:
          g(0, h(k(), 57, w(f(0))));
          break;
        case 929:
          g(0, h(k(), 58, w(f(0))));
          break;
        case 931:
          g(0, h(k(), 59, w(f(0))));
          break;
        case 932:
          g(0, h(k(), 60, w(f(0))));
          break;
        case 933:
          g(0, h(k(), 61, w(f(0))));
          break;
        case 936:
          g(0, h(k(), 62, w(f(0), f(1), f(2))));
          break;
        case 937:
          g(0, h(k(), 63, w(f(0), f(1), f(2))));
          break;
        case 938:
          g(0, h(k(), 64, w(f(0), f(1), f(2))));
          break;
        case 939:
          g(0, h(k(), 65, w(f(0))));
          break;
        case 940:
          g(0, h(k(), 66, w(f(0), f(1))));
          break;
        case 941:
          g(0, h(k(), 67, w(f(0), f(1), f(2))));
          break;
        case 942:
          J(e, k(), 68, w(f(0)));
          break;
        case 943:
          g(0, h(k(), 69, w(f(0))));
          break;
        case 945:
          g(0, h(k(), 70, w(f(0), f(1))));
          break;
        case 946:
          g(0, h(k(), 71, w(f(0), f(1))));
          break;
        case 947:
          J(e, k(), 72, w(f(0)));
          break;
        case 948:
          J(e, k(), 73, w(f(0), f(1)));
          break;
        case 925:
          J(e, k(), 56, w(f(0), f(1)));
          break;
        case 150:
          t = K(e), e.g.push(new y(0, -1, 2, [], t)), m.set(0, t);
      }
    }
  };
}
function Cg(a, b, c, d) {
  const e = new zf(), f = a.j(160), g = Bg(a, f, e), h = a.D();
  a.K[h] = [b, g, function(k) {
    a.o(f);
    a.da(h);
    k !== 0 && console.error("export_buffer failed, status:", k);
  }, f];
  Ee(c, d, 12, h);
  return e;
}
function Dg(a, b, c, d) {
  const e = new zf(), f = a.j(160), g = Bg(a, f, e), h = a.D();
  a.K[h] = [b, g, function(k) {
    a.o(f);
    a.da(h);
    k !== 0 && console.error("export_gralm failed, status:", k);
  }, f];
  Ee(c, d, 14, h);
  return e;
}
;function Eg(a, b) {
  var c = a.D.get(b);
  if (c !== void 0) {
    return c;
  }
  if (a.h) {
    {
      c = a.h;
      c.h.view.setInt32(c.g, b, !0);
      const f = c.h.Fa(c.i, 8, c.g, 0);
      if (f) {
        for (var d = c.h.g, e = f; e < f + 36 && d[e] !== 0;) {
          e++;
        }
        c = e > f ? c.h.i(f, e) : "";
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
function Fg(a) {
  return a.charAt(0) === "u" ? a.slice(2) : "";
}
function Gg(a, b) {
  if (a.i && a.h) {
    var c = Ge(a.h, a.o, 26, [], []);
    c = (new Xd(a.i, c)).g;
    var d = b.g, e = Math.max(d.i, 8192 + d.j);
    b = [null];
    b.length = e;
    e = new Float64Array(e);
    d = d.L;
    for (let k = 0; k < d.length; k++) {
      const m = d[k];
      var f = m.a.length ? xf(m.a, c, b, e) : m.a, g = void 0;
      switch(m.g) {
        case 1:
          var h = c.R;
          switch(m.m) {
            case 1:
              h.arc(f[0], f[1], f[2], f[3], f[4], f[5]);
              break;
            case 2:
              h.arcTo(f[0], f[1], f[2], f[3], f[4]);
              break;
            case 3:
              h.bezierCurveTo(f[0], f[1], f[2], f[3], f[4], f[5]);
              break;
            case 4:
              h.closePath();
              break;
            case 5:
              h.ellipse(f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7]);
              break;
            case 6:
              h.lineTo(f[0], f[1]);
              break;
            case 7:
              h.moveTo(f[0], f[1]);
              break;
            case 8:
              h.quadraticCurveTo(f[0], f[1], f[2], f[3]);
              break;
            case 9:
              h.rect(f[0], f[1], f[2], f[3]);
              break;
            case 12:
              h.clearRect(f[0], f[1], f[2], f[3]);
              break;
            case 13:
              h.fillRect(f[0], f[1], f[2], f[3]);
              break;
            case 14:
              h.strokeRect(f[0], f[1], f[2], f[3]);
              break;
            case 16:
              h.resetTransform();
              break;
            case 17:
              h.rotate(f[0]);
              break;
            case 18:
              h.scale(f[0], f[1]);
              break;
            case 19:
              h.setTransform(f[0], f[1], f[2], f[3], f[4], f[5]);
              break;
            case 20:
              h.transform(f[0], f[1], f[2], f[3], f[4], f[5]);
              break;
            case 21:
              h.translate(f[0], f[1]);
              break;
            case 22:
              h.beginPath();
              break;
            case 23:
              h.clip(f[0], f[1]);
              break;
            case 24:
              h.fill(f[0], f[1]);
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
              h.Dc();
              break;
            case 43:
              h.fillStyle = f[0];
              break;
            case 44:
              h.strokeStyle = f[0];
              break;
            case 31:
              h.lineWidth = f[0];
              break;
            case 28:
              h.lineCap = f[0];
              break;
            case 30:
              h.lineJoin = f[0];
              break;
            case 29:
              h.lineDashOffset = f[0];
              break;
            case 32:
              h.miterLimit = f[0];
              break;
            case 50:
              h.globalAlpha = f[0];
              break;
            case 51:
              h.globalCompositeOperation = f[0];
              break;
            case 34:
              h.setLineDash(f[0]);
              break;
            case 63:
              h.font = f[0];
              break;
            case 59:
              h.fillText(f[0], f[1], f[2], f[3]);
              break;
            case 61:
              h.strokeText(f[0], f[1], f[2], f[3]);
          }break;
        case 2:
          g = tf(c.M, m.m, f, m.name);
          break;
        case 3:
          a: {
            g = c.mb;
            switch(m.m) {
              case 0:
                g.fd(f[0], f[1], f[2]);
                break;
              case 1:
                g.h(f[0]);
                break;
              case 2:
                g.$c(f[0], f[1], f[2]);
                break;
              case 3:
                g.Zc();
                break;
              case 4:
                g.bd();
                break;
              case 5:
                g = g.dd(f[0], f[1], f[2]);
                break a;
              case 6:
                g.ad();
                break;
              case 7:
                g.Sc();
                break;
              case 8:
                g.Yc();
            }
            g = 0;
          }
          break;
        case 4:
          g = uf(c.Yb, m.m, f);
          break;
        case 7:
          g = uf(c.action, m.m, f);
          break;
        case 8:
          g = uf(c.run, m.m, f);
          break;
        case 9:
          g = uf(c.$d, m.m, f);
          break;
        case 10:
          g = uf(c.get, m.m, f);
          break;
        case 0:
          g = vf(c, m.m, f);
          break;
        case 6:
          g = wf(b[m.i], m.m, f);
      }
      m.h >= 0 && !m.o && (b[m.h] = g, typeof g === "number" && (e[m.h] = g));
      m.name && m.g === 6 && m.m === 10 && g && g.label(m.name);
      !m.name || m.g !== 0 || m.m !== 0 && m.m !== 1 || c.Ub(m.name);
      m.o === 1 ? (f = m.j, b[m.h] = g, b[f] = g.self) : m.o === 2 && (f = m.j, b[m.h] = g.handle, b[f] = g.df, e[m.h] = g.handle);
    }
    a.H = !0;
    Ge(a.h, a.o, 27, [], []);
    a.H = !1;
  }
}
function Hg(a, b, c) {
  b = "u:" + b;
  a.j.set(b, c);
  a.g.delete(b);
  Gg(a, c);
}
function Ig(a, b) {
  const c = "u:" + b;
  let d = a.j.get(c);
  if (d) {
    return d;
  }
  if (!a.i || !a.h) {
    return null;
  }
  d = Cg(a.i, b, a.h, a.o);
  if (!d) {
    return null;
  }
  a.j.set(c, d);
  a.g.delete(c);
  return d;
}
function Jg(a) {
  a = a.L;
  for (let b = 0; b < a.length; b++) {
    const c = a[b];
    if (c.g === 0 && (c.m === 0 || c.m === 1)) {
      return c;
    }
  }
  return null;
}
function Kg(a, b) {
  var c = a.C.get(b);
  if (c !== void 0) {
    return c;
  }
  c = Ig(a, b);
  if (!c) {
    return "";
  }
  c = (c = Jg(c)) && c.name || "";
  a.C.set(b, c);
  return c;
}
function Lg(a, b, c) {
  b = Ig(a, b);
  if (!b) {
    return !1;
  }
  const d = Jg(b);
  if (!d) {
    return !1;
  }
  d.name = c || "";
  Gg(a, b);
  return !0;
}
function Mg(a, b) {
  var c = a.g.get(b);
  if (c) {
    return c;
  }
  c = a.j.get(b);
  if (!c) {
    return null;
  }
  c = new wg(c);
  a.g.set(b, c);
  return c;
}
function Ng(a) {
  const b = a.g.L, c = [];
  for (let g = 0; g < b.length; g++) {
    const h = b[g];
    if (h.g === 0) {
      if (h.m === 0 || h.m === 1) {
        var d = h.m === 1, e = h.h, f = -1;
        for (let k = g + 1; k < b.length; k++) {
          if (b[k].g === 6 && b[k].m === 11 && b[k].i === e) {
            f = k;
            break;
          }
        }
        f !== -1 && c.push(new vg(a, d ? 0 : 1, d ? void 0 : h.a[0], g, f, e));
      } else {
        if (h.m === 9) {
          d = h.h;
          e = -1;
          for (f = g + 1; f < b.length; f++) {
            if (b[f].g === 0 && b[f].m === 10 && b[f].i === d) {
              e = f;
              break;
            }
          }
          e !== -1 && c.push(new vg(a, 2, h.a[2], g, e, d));
        }
      }
    }
  }
  return c.length > 0 ? c[0] : null;
}
function S(a, b) {
  if (!a.j.has(b) && a.i && a.h) {
    var c = b.charAt(0) === "u" ? Cg(a.i, b.slice(2), a.h, a.o) : Dg(a.i, parseInt(b.slice(2), 10), a.h, a.o);
    a.j.set(b, c);
    a.g.delete(b);
  }
}
function Og(a, b) {
  S(a, b);
  a = Mg(a, b);
  return a ? (b = Ng(a)) ? tg(b, a.filter({slot:!1})) : [] : [];
}
function Pg(a) {
  a = a.L;
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
    for (let e = c + 1; e < a.length; e++) {
      if (a[e].g === 6 && a[e].m === 11 && a[e].i === d) {
        return {rb:b, zi:c, cg:e};
      }
    }
  }
  return null;
}
function Qg(a, b) {
  b = R(a, b);
  if (!b) {
    return [];
  }
  a = Pg(b);
  if (!a) {
    return [];
  }
  b = b.L;
  const c = [];
  for (let d = a.zi + 1; d < a.cg; d++) {
    Vc(b[d]) && c.push(d);
  }
  return c;
}
function Rg(a, b) {
  (b = R(a, b)) && Gg(a, b);
}
function Sg(a, b) {
  a.H || (b = "u:" + b, a.j.delete(b), a.g.delete(b));
}
function Tg(a) {
  if (!a.i || !a.h) {
    return [];
  }
  const b = a.i, c = b.view;
  var d = Fe(a.h, a.o, 35);
  if (!d) {
    return [];
  }
  const e = c.getInt32(d, !0);
  d = c.getInt32(d + 4, !0);
  const f = (h, k) => {
    if (!h) {
      return "";
    }
    const m = b.g;
    let l = h;
    for (; l < h + k && m[l] !== 0;) {
      l++;
    }
    return b.i(h, l);
  }, g = [];
  for (let h = 0; h < e; h++) {
    const k = d + h * 20, m = f(c.getInt32(k, !0), 36), l = a.C.get(m);
    g.push({uuid:m, name:l !== void 0 ? l : f(c.getInt32(k + 4, !0), 256), sg:c.getInt32(k + 8, !0), loaded:c.getInt16(k + 12, !0) !== 0, Ne:c.getInt16(k + 14, !0), Oi:c.getInt32(k + 16, !0)});
  }
  return g;
}
function Ug(a, b) {
  if (!a.i || !a.h) {
    return !1;
  }
  var c = a.i, d = c.H.encode(b);
  const e = c.j(d.length + 1);
  c.g.set(d, e);
  c.g[e + d.length] = 0;
  d = Ge(a.h, a.o, 36, [e], []);
  c.o(e);
  d && (c = "u:" + b, a.j.delete(c), a.g.delete(c), a.C.delete(b));
  return !!d;
}
class Vg {
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
  G(a) {
    return new Wg(this, Eg(this, a));
  }
}
function Xg(a) {
  var b = a.h;
  S(b, a.g);
  a = R(b, a.g);
  if (!a) {
    return [];
  }
  b = Pg(a);
  if (!b) {
    return [];
  }
  a = a.L;
  b = b.rb;
  const c = new Map();
  for (var d = 0; d < a.length; d++) {
    var e = a[d];
    if (e.g !== 2) {
      continue;
    }
    let k, m;
    if (e.m === 15 || e.m === 14) {
      if (m = e.a[0] || 0, k = e.a.length > 1 ? e.a[1] | 0 : 0, !k) {
        continue;
      }
    } else if (e.m === 0) {
      k = e.a[0] | 0, m = e.a.length > 1 ? e.a[1] : 0;
    } else {
      continue;
    }
    c.set(k, {slot:e.h, name:e.name || "", G:m});
  }
  const f = new Map();
  for (d = 0; d < a.length; d++) {
    e = a[d], e.g === 6 && e.i === b && e.m === 7 && f.set(e.a[0] | 0, e.a[1]);
  }
  const g = [];
  c.forEach(function(k, m) {
    k = {key:m, slot:k.slot, value:f.has(m) ? f.get(m) : k.G, name:k.name};
    g.push(k);
  });
  let h = 20000;
  f.forEach(function(k, m) {
    c.has(m) || g.push({key:h++, slot:-1, value:k, name:""});
  });
  return g;
}
function Yg(a) {
  var b = a.h;
  S(b, a.g);
  const c = R(b, a.g);
  if (!c) {
    return [];
  }
  a = Qg(b, a.g);
  b = [];
  for (let d = 0; d < a.length; d++) {
    const e = c.L[a[d]];
    b.push({name:e.name || "", value:e.a.length ? e.a[0] : 0, Ja:e.h});
  }
  return b;
}
function Zg(a, b, c) {
  const d = a.h;
  S(d, a.g);
  const e = R(d, a.g);
  if (e) {
    var f = Qg(d, a.g);
    b === c || b < 0 || b >= f.length || c < 0 || c >= f.length || (b = e.L.splice(f[b], 1)[0], e.L.splice(f[c], 0, b), d.g.delete(a.g), Rg(d, a.g));
  }
}
function $g(a) {
  var b = a.h;
  if (!b.i || !b.h) {
    return null;
  }
  S(b, a.g);
  a = R(b, a.g);
  if (!a) {
    return null;
  }
  b = a.L;
  let c = "";
  for (let d = 0; d < b.length; d++) {
    if (b[d].g === 0 && b[d].m === 0) {
      c = b[d].a[0] || "";
      break;
    }
  }
  return {rd:a, uuid:c};
}
function ah(a) {
  const b = a.h, c = Fg(a.g);
  if (c) {
    return Kg(b, c);
  }
  S(b, a.g);
  a = R(b, a.g);
  return a ? (a = Jg(a)) && a.name || "" : "";
}
function bh(a, b) {
  const c = a.h;
  S(c, a.g);
  var d = R(c, a.g);
  d && (d = Jg(d)) && (d.name = b || "", Rg(c, a.g), (a = Fg(a.g)) && c.C.set(a, d.name || ""));
}
function ch(a) {
  return Og(a.h, a.g);
}
function dh(a, b, c, d) {
  const e = a.h;
  b = Og(e, a.g)[b];
  if (!b) {
    return {error:"No command"};
  }
  !b.D || b.O < 0 ? c = {error:"No scope context"} : (c = qg(b.D, b.O, c, String(d)), b.o = null, b.C = null, b.i.h++);
  c.error || Rg(e, a.g);
  return c;
}
function eh(a, b) {
  const c = a.h;
  if (b = Og(c, a.g)[b]) {
    !b.D || b.O < 0 || sg(b.D, b.O), Rg(c, a.g);
  }
}
function fh(a, b) {
  const c = a.h;
  var d = Mg(c, a.g);
  d = d ? Ng(d) : null;
  if (!d) {
    throw Error("CmdArrayNodeDef.beginInsert: no scope");
  }
  b = ug(d, b);
  const e = a.g, f = b.end.bind(b);
  b.end = () => {
    f();
    c.g.delete(e);
    Rg(c, e);
  };
  return b;
}
function gh(a, b) {
  var c = a.h;
  S(c, a.g);
  c = Mg(c, a.g);
  if (!c || !Ng(c)) {
    return !1;
  }
  a = fh(a);
  b(a.R);
  a.end();
  return !0;
}
function hh(a) {
  var b = a.h;
  S(b, a.g);
  a = R(b, a.g);
  if (!a) {
    return [];
  }
  b = Pg(a);
  if (!b) {
    return [];
  }
  a = a.L;
  b = b.rb;
  const c = [];
  for (let e = 0; e < a.length; e++) {
    var d = a[e];
    if (d.g !== 6 || d.i !== b || d.m !== 9) {
      continue;
    }
    const f = d.a[0] | 0;
    d = d.h;
    let g = 0, h = 0;
    for (let k = e + 1; k < a.length; k++) {
      const m = a[k];
      if (m.g !== 6 || m.i !== d || m.m !== 6) {
        continue;
      }
      const l = m.a[0] | 0;
      l === 0 ? g = m.a[1] : l === 1 && (h = m.a[1]);
    }
    c.push({jc:f, name:We[f] || "event_" + f, ui:g, wi:h});
  }
  return c;
}
function ih(a, b) {
  const c = a.h;
  S(c, a.g);
  var d = R(c, a.g);
  if (d) {
    var e = Pg(d);
    if (e) {
      d = d.L;
      var f = e.rb, g = 0, h = e = -1;
      for (let k = 0; k < d.length; k++) {
        const m = d[k];
        if (m.g === 6 && m.i === f && m.m === 9) {
          if (g === b) {
            e = k;
            h = m.h;
            break;
          }
          g++;
        }
      }
      if (e !== -1) {
        b = [e];
        for (f = 0; f < d.length; f++) {
          f !== e && d[f].g === 6 && d[f].i === h && d[f].m === 6 && b.push(f);
        }
        b.sort((k, m) => m - k);
        for (e = 0; e < b.length; e++) {
          d.splice(b[e], 1);
        }
        c.g.delete(a.g);
        Rg(c, a.g);
      }
    }
  }
}
function jh(a, b, c, d) {
  const e = a.h;
  S(e, a.g);
  var f = R(e, a.g);
  if (f) {
    var g = Pg(f);
    if (g) {
      f = f.L;
      var h = g.rb, k = 0, m = g = -1;
      for (let l = 0; l < f.length; l++) {
        const p = f[l];
        if (p.g === 6 && p.i === h && p.m === 9) {
          if (k === b) {
            g = l;
            m = p.h;
            break;
          }
          k++;
        }
      }
      if (g !== -1) {
        b = !1;
        for (h = 0; h < f.length; h++) {
          if (k = f[h], k.g === 6 && k.i === m && k.m === 6 && (k.a[0] | 0) === c) {
            k.a[1] = d;
            b = !0;
            break;
          }
        }
        b || f.splice(g + 1, 0, new y(6, m, 6, w(c, d), -1));
        e.g.delete(a.g);
        Rg(e, a.g);
      }
    }
  }
}
class Wg {
  constructor(a, b) {
    this.h = a;
    this.g = b;
  }
}
;function kh(a, b) {
  const c = a.view, d = c.getInt32(b + 8, !0);
  var e = "";
  if (d) {
    e = a.g;
    let f = d;
    for (; f < d + 36 && e[f] !== 0;) {
      f++;
    }
    e = a.i(d, f);
  }
  return {ra:c.getInt32(b, !0), depth:0, uuid:e, ga:c.getInt16(b + 12, !0), Ab:c.getInt16(b + 14, !0), kc:c.getInt16(b + 16, !0), B:c.getInt32(b + 4, !0), Cb:c.getInt16(b + 18, !0), Mb:c.getInt16(b + 20, !0)};
}
function Jf(a) {
  return a.g ? Fe(a.g, a.i, 18) : 0;
}
function lh(a, b, c, d, e) {
  if (!a.h || !a.g) {
    return 0;
  }
  const f = a.h, g = f.H.encode(b);
  b = f.j(g.length + 1);
  f.g.set(g, b);
  f.g[b + g.length] = 0;
  e = e ?? 0;
  const h = [b];
  h[1] = g.length;
  h[2] = c;
  h[3] = d !== void 0 ? d + 1 : 0;
  h[4] = e ? 1 : 0;
  h[5] = e;
  a = Ge(a.g, a.i, 90003, h, []);
  f.o(b);
  return a;
}
function mh(a, b, c, d) {
  if (!a.h || !a.g) {
    return 0;
  }
  const e = a.h;
  var f = e.H.encode(b);
  b = e.j(f.length + 1);
  e.g.set(f, b);
  f = e.g[b + f.length] = 0;
  c && (c = e.H.encode(c), f = e.j(c.length + 1), e.g.set(c, f), e.g[f + c.length] = 0);
  d = d === void 0 ? Date.now() : d;
  c = [b];
  c[1] = f;
  a = Ge(a.g, a.i, 33, c, [d]);
  e.o(b);
  f && e.o(f);
  return a;
}
function nh(a) {
  a.g && Ge(a.g, a.i, 37, [], []);
}
function oh(a, b) {
  const c = a.h;
  a = c.view;
  const d = a.getInt32(b, !0);
  b = a.getInt32(b + 4, !0);
  const e = (g, h) => {
    if (!g) {
      return "";
    }
    const k = c.g;
    let m = g;
    for (; m < g + h && k[m] !== 0;) {
      m++;
    }
    return c.i(g, m);
  }, f = [];
  for (let g = 0; g < d; g++) {
    const h = b + g * 24;
    f.push({uuid:e(a.getInt32(h, !0), 36), name:e(a.getInt32(h + 4, !0), 256), td:a.getFloat64(h + 8, !0), size:a.getFloat64(h + 16, !0)});
  }
  return f;
}
class ph {
  constructor(a, b, c, d) {
    this.h = a;
    this.g = b;
    this.i = c;
    this.j = d;
  }
}
function qh(a, b) {
  const c = a.g;
  if (c.g) {
    if (b < 0) {
      b = -1;
    } else {
      var d = a.h;
      d = Og(d, Eg(d, a.B));
      var e = d[b];
      if (e && e.oc.g === 1) {
        e = 0;
        for (let f = 0; f < b; f++) {
          const g = d[f];
          g && g.oc.g === 1 && e++;
        }
        b = e;
      } else {
        b = -1;
      }
    }
    Ge(c.g, c.i, 22, [], [b, a.B]);
  }
}
class rh {
  constructor(a, b, c) {
    this.g = a;
    this.h = b;
    this.B = c;
  }
}
;function sh(a, b, c) {
  return [a[0] * b + a[2] * c + a[4], a[1] * b + a[3] * c + a[5]];
}
function th(a) {
  var b = a[0], c = a[1], d = a[2], e = a[3];
  const f = a[4];
  a = a[5];
  const g = b * e - c * d;
  if (Math.abs(g) < 1e-12) {
    return [1, 0, 0, 1, 0, 0];
  }
  e /= g;
  c = -c / g;
  d = -d / g;
  b /= g;
  return [e, c, d, b, -(e * f + d * a), -(c * f + b * a)];
}
;function uh(a) {
  if (!a.g) {
    return {Yd:0, Zd:0};
  }
  const b = a.g;
  a = a.h;
  return {Yd:Fe(b, a, 1), Zd:Fe(b, a, 2)};
}
function vh(a, b, c) {
  if (a.g) {
    const d = [];
    d[0] = b;
    d[1] = c;
    Ge(a.g, a.h, 5, d, []);
  }
}
function wh(a, b) {
  const c = a.i;
  if (!c || !a.g) {
    return [1, 0, 0, 1, 0, 0];
  }
  const d = c.j(56);
  c.view.setInt32(d, b, !0);
  Ge(a.g, a.h, 28, [d], []);
  a = c.view;
  b = [];
  for (let e = 0; e < 6; e++) {
    b.push(a.getFloat64(d + 8 + e * 8, !0));
  }
  c.o(d);
  return b;
}
function xh(a) {
  if (!a.g) {
    return {enabled:0, color:0};
  }
  const b = a.g;
  a = a.h;
  return {enabled:Fe(b, a, 30), color:Fe(b, a, 31)};
}
class yh {
  constructor(a, b, c) {
    this.i = a;
    this.g = b;
    this.h = c;
  }
}
;class zh {
  constructor(a, b, c) {
    this.ba = new Set();
    this.o = Fe(a, b, 3);
    this.C = Fe(a, b, 4);
    this.g = c || function() {
    };
    this.h = null;
  }
  D(a) {
    if (a.uuid() === "ad63103a-f305-48f6-b78c-1489905b045b") {
      var b = a.Ob(1), c = a.Ob(2);
      switch(a.Ob(0)) {
        case 1:
          this.ba.add(b);
          this.g();
          break;
        case 2:
          this.ba.delete(b);
          this.g();
          break;
        case 3:
          this.ba.clear();
          this.g();
          break;
        case 4:
          this.o = c;
          (this.h || this.g)();
          break;
        case 5:
          this.C = c, (this.h || this.g)();
      }
    }
  }
  get j() {
    return this.o;
  }
  get i() {
    return this.C;
  }
  has(a) {
    return this.ba.has(a);
  }
  H() {
    return Array.from(this.ba);
  }
  get size() {
    return this.ba.size;
  }
}
;let Ah = null;
function Bh() {
  if (!Ah) {
    const a = new xa("ploft.libcatalog");
    Ah = a.init().then(() => a);
    Ah.catch(() => {
      Ah = null;
    });
  }
  return Ah;
}
function Ch() {
  return Bh().then(a => a.get("entries")).then(a => a || []);
}
function Dh(a) {
  const b = a.map(c => ({uuid:c.uuid, name:c.name, td:c.td, size:c.size || 0}));
  Bh().then(c => c.set("entries", b)).then(() => {
  });
}
function Eh(a, b, c) {
  Ch().then(d => {
    const e = d.findIndex(g => g.uuid === a), f = {uuid:a, name:b, td:c, size:e >= 0 ? d[e].size : 0};
    e >= 0 ? d[e] = f : d.push(f);
    return Bh().then(g => g.set("entries", d)).then(() => {
    });
  });
}
function Fh(a) {
  Ch().then(b => {
    const c = b.filter(d => d.uuid !== a);
    if (c.length !== b.length) {
      return Bh().then(d => d.set("entries", c)).then(() => {
      });
    }
  });
}
;class Gh extends Hf {
  C() {
    var a = this.g.h;
    return new rh(a, a.j, this.B);
  }
  o() {
    return this.g.g.G(this.B);
  }
  j() {
    const a = this.g, b = a.T;
    if (b.g) {
      var c = [];
      c[0] = this.B;
      Ge(b.g, b.i, 90004, c, []);
      a.P.D.delete(this.B);
    }
  }
  h() {
    const a = this.g, b = a.T;
    if (!b.h || !b.g) {
      return 0;
    }
    const c = Ue(), d = new zf();
    d.Bb(c).end();
    Hg(a.P, c, d);
    return lh(b, c, this.B);
  }
  D() {
    const a = this.g.T;
    if (a.h && a.g && this.uuid && this.ra) {
      var b = this.uuid, c = this.ra, d = this.Mb;
      this.j();
      lh(a, b, c, d);
    }
  }
}
function Hh(a) {
  const b = a.j;
  if (!b) {
    return {has:function() {
      return !1;
    }, H:function() {
      return [];
    }, D:function() {
    }, j:0, i:0, h:null};
  }
  const c = new zh(a.da, a.H, () => a.refresh());
  a.ta = Gf(b, a.H, {Ib:d => {
    if (d.id() === 1) {
      var e = d.F();
      if (e && a.j) {
        var f = a.j.view;
        d = f.getInt32(e, !0);
        var g = f.getInt32(e + 4, !0);
        f = f.getInt32(e + 8, !0);
        if (e = a.wb.get(d)) {
          a.wb.delete(d), e(g, f);
        }
      }
    } else {
      if (d.uuid() === "ad63103a-f305-48f6-b78c-1489905b045b") {
        switch(d.Ob(0)) {
          case 6:
            if (g = a.j) {
              a.W || Ih(a, kh(g, d.F())), a.refresh();
            }
            break;
          case 7:
            a.W || Jh(a, d.Ob(1));
            a.refresh();
            break;
          case 9:
            Kh(a, d);
            break;
          case 11:
            d = d.F() ? oh(a.h, d.F()) : [];
            d.length && Dh(d);
            g = a.va.slice();
            for (f = 0; f < g.length; f++) {
              g[f](d);
            }
            break;
          default:
            c.D(d);
        }
      }
    }
  }});
  return c;
}
function Kh(a, b) {
  const c = a.j;
  if (c) {
    var d = b.F();
    if (d) {
      var e = c.view;
      b = e.getInt32(d, !0);
      d = e.getInt32(d + 4, !0);
      e = (f, g) => {
        if (!f) {
          return "";
        }
        const h = c.g;
        let k = f;
        for (; k < f + g && h[k] !== 0;) {
          k++;
        }
        return c.i(f, k);
      };
      if (b = e(b, 36)) {
        Sg(a.g, b);
        d = e(d, 256);
        a.g.C.set(b, d || "");
        e = a.Ad.slice();
        for (let f = 0; f < e.length; f++) {
          e[f](b, d);
        }
      }
    }
    a.refresh();
  }
}
function Ih(a, b) {
  a = a.Ba;
  var c = a.findIndex(e => e.B === b.ra);
  if (c >= 0) {
    b.depth = a[c].depth + 1;
    c += 1;
    let e = 0;
    for (; e < b.Mb && c < a.length && a[c].ra === b.ra;) {
      c += 1 + a[c].ga, e++;
    }
  } else {
    b.depth = 0, c = a.length;
  }
  a.splice(c, 0, b);
  let d = b.ra;
  for (;;) {
    c = a.findIndex(e => e.B === d);
    if (c < 0) {
      break;
    }
    a[c].ga += 1;
    d = a[c].ra;
  }
}
function Jh(a, b) {
  a = a.Ba;
  var c = a.findIndex(g => g.B === b);
  if (!(c < 0)) {
    var d = 1 + a[c].ga, e = a[c].ra;
    a.splice(c, d);
    for (var f = e;;) {
      c = a.findIndex(g => g.B === f);
      if (c < 0) {
        break;
      }
      a[c].ga -= d;
      f = a[c].ra;
    }
  }
}
class Lh extends Kf {
  constructor(a, b) {
    super();
    this.j = a || null;
    this.H = a && b !== void 0 ? a.K[b][5] : 0;
    this.da = a ? a.W : null;
    this.P = new Vg(this.j, this.da, this.H);
    this.h = this.T = new ph(this.j, this.da, this.H, this.P);
    this.g = this.P;
    this.C = new yh(this.j, this.da, this.H);
    this.ua = null;
    this.va = [];
    this.Ad = [];
    this.wb = new Map();
    this.Ba = [];
    this.W = !0;
    this.ta = null;
    this.j && Ch().then(c => {
      if (c.length) {
        for (let m = 0; m < c.length; m++) {
          var d = c[m], e = this.h, f = d.uuid, g = d.name;
          d = d.td;
          if (e.h && e.g) {
            var h = e.h, k = h.H.encode(f);
            f = h.j(k.length + 1);
            h.g.set(k, f);
            k = h.g[f + k.length] = 0;
            g && (g = h.H.encode(g), k = h.j(g.length + 1), h.g.set(g, k), h.g[k + g.length] = 0);
            g = [f];
            g[1] = k;
            Ge(e.g, e.i, 38, g, [d]);
            h.o(f);
            k && h.o(k);
          }
        }
        this.refresh();
      }
    });
    this.O = Hh(this);
  }
  D() {
    if (this.W) {
      var a = this.T;
      if (a.h && a.g) {
        var b = a.h.view;
        var c = Fe(a.g, a.i, 17);
        if (c) {
          var d = b.getInt32(c, !0);
          c = b.getInt32(c + 4, !0);
          b = [];
          for (var e = 0; e < d; e++) {
            b.push(kh(a.h, c + e * 24));
          }
          a = new Map();
          for (d = 0; d < b.length; d++) {
            c = b[d], c.depth = a.has(c.ra) ? a.get(c.ra) + 1 : 0, a.set(c.B, c.depth);
          }
        } else {
          b = [];
        }
      } else {
        b = [];
      }
      this.Ba = b;
      this.W = !1;
    }
    b = this.Ba;
    for (d = 0; d < b.length; d++) {
      if (a = b[d], e = this.P, a.uuid && S(e, Eg(e, a.B)), e.j.has(Eg(e, a.B))) {
        c = Eg(e, a.B);
        a: {
          var f = R(e, c);
          if (!f) {
            var g = -1;
            break a;
          }
          g = Pg(f);
          if (!g) {
            g = -1;
            break a;
          }
          f = f.L;
          let h = 0;
          for (let k = 0; k < f.length; k++) {
            f[k].g === 6 && f[k].i === g.rb && f[k].m === 9 && h++;
          }
          g = h;
        }
        g >= 0 && (a.Cb = g);
        a: {
          g = Mg(e, c);
          if (!g) {
            g = -1;
            break a;
          }
          g = (f = Ng(g)) ? tg(f, g.filter({slot:!1})).length : -1;
        }
        g >= 0 && (a.Ab = g);
        c = R(e, c) ? Qg(e, c).length : -1;
        c >= 0 && (a.kc = c);
      }
    }
    return this.Oc(b);
  }
  gb(a) {
    this.va.push(a);
    return () => {
      const b = this.va.indexOf(a);
      b >= 0 && this.va.splice(b, 1);
    };
  }
  o(a, b) {
    a && this.wb.set(a, b);
  }
  refresh() {
    this.ua && this.ua();
  }
  Oc(a) {
    return a.map(b => new Gh(this, b));
  }
  i(a) {
    return new Gh(this, {ra:0, depth:0, ga:0, Ab:0, kc:0, B:a, Cb:0, Mb:0});
  }
}
;function Mh(a) {
  return a.replace(/[A-Z]/g, b => "-" + b.toLowerCase());
}
class Nh {
  constructor() {
    this.g = [];
  }
  add(a, b) {
    b = Object.entries(b);
    let c = "";
    for (let d = 0; d < b.length; d++) {
      c += Mh(b[d][0]) + ":" + b[d][1] + ";";
    }
    this.g.push(a + "{" + c + "}");
    return this;
  }
  toString() {
    return this.g.join("");
  }
}
;function Oh(a, b, c) {
  return {x:Math.min(Math.max(a, 60 - c), window.innerWidth - 60), y:Math.min(Math.max(b, 0), window.innerHeight - 23)};
}
const Ph = (new Nh()).add(".sidebar-scroll::-webkit-scrollbar", {width:"12px"}).add(".sidebar-scroll::-webkit-scrollbar-track", {background:"transparent"}).add(".sidebar-scroll::-webkit-scrollbar-thumb", {background:"rgba(255,255,255,0.2)"}).add(".sidebar-scroll::-webkit-scrollbar-thumb:hover", {background:"rgba(255,255,255,0.4)"}).add(".section-sash", {background:"transparent", transition:"background 0.15s"}).add(".section-sash:hover", {background:"#007fd4"}).add("input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button", 
{WebkitAppearance:"none", margin:"0"}).add("input[type=number]", {MozAppearance:"textfield"}).toString(), Qh = {backgroundColor:"#2a2a2a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", padding:"2px 4px", fontSize:"11px", outline:"none", fontFamily:"monospace", width:"0"}, Rh = {backgroundColor:"#2a2a2a", color:"#aaa", border:"1px solid #555", borderRadius:"2px", padding:"1px 2px", fontSize:"9px", outline:"none", cursor:"pointer", flexShrink:"0"};
function Sh(a) {
  return "section-" + a + "-content";
}
;async function Th(a) {
  if (a.wa) {
    var b = await a.wa.get("sections");
    if (b && b.length > 0) {
      var c = {};
      for (var d of a.ea) {
        c[d.v.key] = d;
      }
      d = [];
      const e = {};
      for (const f of b) {
        b = c[f.key];
        if (!b) {
          continue;
        }
        const g = b.v;
        g.visible = f.visible ?? g.visible;
        g.collapsed = f.collapsed ?? g.collapsed;
        g.height = f.height ?? g.height;
        g.floating = f.floating ?? g.floating;
        g.floatX = f.floatX ?? g.floatX;
        g.floatY = f.floatY ?? g.floatY;
        g.floatW = f.floatW ?? g.floatW;
        g.floatH = f.floatH ?? g.floatH;
        d.push(b);
        e[f.key] = !0;
      }
      for (const f of a.ea) {
        e[f.v.key] || d.push(f);
      }
      a.ea = d;
    }
    if (c = await a.wa.get("panel")) {
      a = a.I, a.floating = c.floating ?? a.floating, a.dockSide = c.dockSide ?? a.dockSide, a.panelWidth = c.panelWidth ?? a.panelWidth, a.panelHeight = c.panelHeight ?? a.panelHeight, a.floatX = c.floatX ?? a.floatX, a.floatY = c.floatY ?? a.floatY;
    }
  }
}
async function Uh(a) {
  try {
    a.wa = new xa("ploft.panel");
    await a.wa.init();
    await Th(a);
    for (const b of a.Be) {
      b.nd && await b.nd(a.wa);
    }
  } catch (b) {
    console.error("panel storage init failed", b);
  }
  a.Df = !0;
  a.refresh();
}
function Vh(a) {
  if (a.wa && a.Df) {
    a.wa.set("sections", a.ea.map(b => b.v));
    a.wa.set("panel", a.I);
    for (const b of a.Be) {
      b.od && b.od(a.wa);
    }
  }
}
;function Wh(a) {
  a.Pc && (document.removeEventListener("dragover", a.Pc), a.Pc = null);
  const b = a.Kc;
  b.Ud = null;
  b.Vd = null;
  b.tc = null;
  Xh(a);
}
function Yh(a, b, c) {
  b.dataTransfer.setData("application/x-ploft-section", c);
  b.dataTransfer.effectAllowed = "move";
  a.Kc.Ud = c;
  a.Pc = d => {
    d.preventDefault();
  };
  document.addEventListener("dragover", a.Pc);
}
function Zh(a, b, c) {
  if (b.dataTransfer.types.includes("application/x-ploft-section")) {
    b.preventDefault();
    b = a.Kc;
    var d = b.Ud;
    if (d && d !== c) {
      var e = a.ea.findIndex(f => f.v.key === d);
      if (e >= 0) {
        e = a.ea.splice(e, 1)[0];
        let f = a.ea.findIndex(g => g.v.key === c);
        f >= 0 && a.ea.splice(b.tc === "below" ? f + 1 : f, 0, e);
      }
    }
    Wh(a);
  }
}
function $h(a, b) {
  a.I.floating && (b.preventDefault(), a.xf = !0, a.Ge = b.clientX, a.He = b.clientY, a.Ee = a.I.floatX, a.Fe = a.I.floatY, a.Bd = c => {
    var d = c.clientX - a.Ge;
    const e = c.clientY - a.He;
    if (c = document.getElementById("ploft-sidebar")) {
      d = Oh(a.Ee + d, a.Fe + e, a.I.panelWidth), c.style.left = d.x + "px", c.style.top = d.y + "px";
    }
  }, a.Cd = c => {
    a.xf = !1;
    c = Oh(a.Ee + (c.clientX - a.Ge), a.Fe + (c.clientY - a.He), a.I.panelWidth);
    a.I.floatX = c.x;
    a.I.floatY = c.y;
    document.removeEventListener("mousemove", a.Bd);
    document.removeEventListener("mouseup", a.Cd);
    a.Bd = null;
    a.Cd = null;
    Xh(a);
  }, document.addEventListener("mousemove", a.Bd), document.addEventListener("mouseup", a.Cd));
}
function ai(a, b, c) {
  b.preventDefault();
  b.stopPropagation();
  a.Cf = !0;
  a.yf = c;
  a.Af = b.clientX;
  a.Bf = b.clientY;
  a.Rc = a.I.panelWidth;
  a.Je = a.I.panelHeight;
  a.zf = a.I.floatX;
  a.Dd = d => {
    var e = d.clientX - a.Af;
    d = d.clientY - a.Bf;
    const f = a.yf;
    f === "left" ? (e = Math.max(200, a.Rc - e), a.I.panelWidth = e, a.I.floating && (a.I.floatX = a.zf + (a.Rc - e))) : f === "right" ? a.I.panelWidth = Math.max(200, a.Rc + e) : f === "bottom" ? a.I.panelHeight = Math.max(150, a.Je + d) : f === "corner-br" && (a.I.panelWidth = Math.max(200, a.Rc + e), a.I.panelHeight = Math.max(150, a.Je + d));
    a.nc || (a.nc = requestAnimationFrame(() => {
      a.nc = 0;
      a.refresh();
    }));
  };
  a.Ed = () => {
    a.Cf = !1;
    a.nc && (cancelAnimationFrame(a.nc), a.nc = 0);
    document.removeEventListener("mousemove", a.Dd);
    document.removeEventListener("mouseup", a.Ed);
    a.Dd = null;
    a.Ed = null;
    Xh(a);
  };
  document.addEventListener("mousemove", a.Dd);
  document.addEventListener("mouseup", a.Ed);
}
function bi(a, b, c) {
  c.preventDefault();
  const d = a.ea[b], e = c.clientY, f = d.v.height, g = Sh(d.v.key);
  a.Fd = h => {
    h = Math.max(30, f + (h.clientY - e));
    const k = document.getElementById(g);
    k && (k.style.height = h + "px");
  };
  a.Gd = h => {
    d.v.height = Math.max(30, f + (h.clientY - e));
    document.removeEventListener("mousemove", a.Fd);
    document.removeEventListener("mouseup", a.Gd);
    a.Fd = null;
    a.Gd = null;
    Xh(a);
  };
  document.addEventListener("mousemove", a.Fd);
  document.addEventListener("mouseup", a.Gd);
}
;function ci(a) {
  return n("div", {onDblClick:() => {
    if (a.I.floating) {
      a.I.floating = !1;
    } else {
      const b = window.innerWidth;
      a.I.floatX = a.I.dockSide === "right" ? Math.max(0, b - a.I.panelWidth - 40) : 40;
      a.I.floatY = 50;
      a.I.panelHeight = Math.min(500, window.innerHeight - 100);
      a.I.floating = !0;
    }
    Xh(a);
  }, onMouseDown:b => $h(a, b), style:{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 10px", backgroundColor:"#1e1e1e", borderBottom:"1px solid #444", fontSize:"11px", fontWeight:"bold", letterSpacing:"0.5px", color:"#aaa", cursor:a.I.floating ? "grab" : "default", userSelect:"none"}}, "PANEL", n("div", {onClick:b => {
    b.stopPropagation();
    a.Ra = !a.Ra;
    Xh(a);
  }, onMouseDown:b => b.stopPropagation(), onDblClick:b => b.stopPropagation(), style:{cursor:"pointer", padding:"2px 6px", borderRadius:"3px", fontSize:"14px", lineHeight:"1", color:"#aaa"}}, "\u00b7\u00b7\u00b7"));
}
function di(a) {
  const b = {display:"flex", alignItems:"center", gap:"6px", padding:"4px 10px", cursor:"pointer", fontSize:"12px", color:"#e0e0e0"}, c = {width:"14px", textAlign:"center", fontSize:"11px", color:"#6af"};
  return n("div", null, n("div", {onClick:() => a.Uc(), style:{position:"fixed", top:"0", left:"0", right:"0", bottom:"0", zIndex:"100"}}), n("div", {style:{position:"absolute", right:"6px", top:"28px", backgroundColor:"#252526", border:"1px solid #555", borderRadius:"4px", padding:"4px 0", zIndex:"101", boxShadow:"0 4px 12px rgba(0,0,0,0.5)", minWidth:"140px"}}, a.ea.map(d => n("div", {onClick:() => ei(a, d.v.key), style:b}, n("span", {style:c}, d.v.visible ? "\u2713" : ""), d.state.label)), n("div", 
  {style:{borderTop:"1px solid #444", margin:"4px 0"}}), n("div", {onClick:() => {
    a.I.dockSide = "left";
    a.I.floating = !1;
    a.Ra = !1;
    Xh(a);
  }, style:b}, n("span", {style:c}, a.I.floating || a.I.dockSide !== "left" ? "" : "\u2713"), "Dock Left"), n("div", {onClick:() => {
    a.I.dockSide = "right";
    a.I.floating = !1;
    a.Ra = !1;
    Xh(a);
  }, style:b}, n("span", {style:c}, a.I.floating || a.I.dockSide !== "right" ? "" : "\u2713"), "Dock Right")));
}
function fi(a) {
  const b = {position:"absolute", zIndex:"10"}, c = [];
  (a.I.floating || a.I.dockSide === "right") && c.push(n("div", {onMouseDown:d => ai(a, d, "left"), style:{...b, left:"0", top:"0", width:"5px", height:"100%", cursor:"ew-resize"}}));
  (a.I.floating || a.I.dockSide === "left") && c.push(n("div", {onMouseDown:d => ai(a, d, "right"), style:{...b, right:"0", top:"0", width:"5px", height:"100%", cursor:"ew-resize"}}));
  a.I.floating && (c.push(n("div", {onMouseDown:d => ai(a, d, "bottom"), style:{...b, left:"0", bottom:"0", width:"100%", height:"5px", cursor:"ns-resize"}})), c.push(n("div", {onMouseDown:d => ai(a, d, "corner-br"), style:{...b, right:"0", bottom:"0", width:"10px", height:"10px", cursor:"nwse-resize"}})));
  return c.length > 0 ? n("div", null, c) : null;
}
;function Xh(a) {
  a.refresh();
  Vh(a);
}
function gi(a, b) {
  return a.ea.find(c => c.v.key === b) || null;
}
function ei(a, b) {
  if (b = gi(a, b)) {
    b.v.visible = !b.v.visible, Xh(a);
  }
}
async function hi(a) {
  Uh(a);
}
function ii(a, b, c, d) {
  var e = a.ea.findIndex(g => g.v.key === b);
  if (!(e < 0)) {
    e = a.ea.splice(e, 1)[0];
    e.v.floating = !1;
    var f = a.ea.findIndex(g => g.v.key === c);
    f >= 0 ? a.ea.splice(d === "below" ? f + 1 : f, 0, e) : a.ea.push(e);
    Xh(a);
  }
}
function ji(a) {
  for (var b of a.ea) {
  }
  b = new Map();
  for (const c of a.ea) {
    !c.v.visible || c.v.collapsed || c.v.floating || b.set(c.v.key, Math.max(30, c.v.height));
  }
  return b;
}
function ki(a, b, c, d, e, f) {
  return {sa:b, title:c, Yh:a.Kc, height:d, cf:e, ri:() => {
    const g = gi(a, b.v.key);
    g && (g.v.collapsed = !g.v.collapsed, Xh(a));
  }, si:() => {
    const g = gi(a, b.v.key);
    g && (g.v.floating ? g.v.floating = !1 : (g.v.floating = !0, g.v.floatX = g.v.floatX || 200, g.v.floatY = g.v.floatY || 100, g.v.floatW = a.I.panelWidth, g.v.floatH = g.v.height || 200), Xh(a));
  }, ki:(g, h) => ii(a, b.v.key, g, h), ni:g => Yh(a, g, b.v.key), mi:g => {
    var h = b.v.key;
    if (g.dataTransfer.types.includes("application/x-ploft-section")) {
      g.preventDefault();
      var k = g.currentTarget.getBoundingClientRect();
      g = g.clientY - k.top < k.height / 2 ? "above" : "below";
      k = a.Kc;
      if (k.Vd !== h || k.tc !== g) {
        k.Vd = h, k.tc = g, a.refresh();
      }
    }
  }, oi:g => Zh(a, g, b.v.key), li:g => {
    var h = a.Kc.Ud;
    if (h && g.clientX !== 0 && g.clientY !== 0) {
      var k = document.getElementById("ploft-sidebar");
      k && (k = k.getBoundingClientRect(), (g.clientX < k.left || g.clientX > k.right || g.clientY < k.top || g.clientY > k.bottom) && (h = gi(a, h)) && !h.v.floating && (h.v.floating = !0, h.v.floatW = a.I.panelWidth, h.v.floatH = h.v.height || 200, g = Oh(g.clientX - 100, g.clientY - 15, h.v.floatW), h.v.floatX = g.x, h.v.floatY = g.y));
    }
    Wh(a);
  }, Bg:() => ei(a, b.v.key), refresh:f};
}
class li extends Mc {
  constructor() {
    super();
    this.Be = [];
    this.g = {};
    this.ea = [];
    this.Kc = {Ud:null, Vd:null, tc:null};
    this.Pc = null;
    this.Ra = !1;
    this.I = {floating:!1, dockSide:"right", panelWidth:280, panelHeight:500, floatX:200, floatY:50};
    this.xf = !1;
    this.Fe = this.Ee = this.He = this.Ge = 0;
    this.Cd = this.Bd = null;
    this.Cf = !1;
    this.yf = "";
    this.zf = this.Je = this.Rc = this.Bf = this.Af = 0;
    this.Ed = this.Dd = null;
    this.nc = 0;
    this.wa = this.Gd = this.Fd = null;
    this.Df = !1;
  }
  register(a) {
    this.Be.push(a);
    this.g[a.key] = a;
    this.ea.push({v:{key:a.key, visible:a.visible, height:a.height}, state:{label:a.label, Ra:!1}});
  }
  Uc() {
    this.Ra = !1;
    Xh(this);
  }
  async render() {
    const a = () => Xh(this), b = ji(this), c = (e, f) => {
      e = this.g[e.v.key];
      if (!e) {
        return null;
      }
      f = e.create(f);
      return Pc(f);
    }, d = {position:"fixed", width:this.I.panelWidth + "px", backgroundColor:"#1e1e1e", color:"#e0e0e0", fontFamily:"sans-serif", fontSize:"12px", pointerEvents:"auto", display:"flex", flexDirection:"column", whiteSpace:"nowrap", overflow:"hidden"};
    if (this.I.floating) {
      const e = Oh(this.I.floatX, this.I.floatY, this.I.panelWidth);
      this.I.floatX = e.x;
      this.I.floatY = e.y;
      d.left = e.x + "px";
      d.top = e.y + "px";
      d.height = this.I.panelHeight + "px";
      d.borderRadius = "6px";
      d.boxShadow = "0 6px 20px rgba(0,0,0,0.6)";
      d.border = "1px solid #555";
    } else {
      d.top = "0", d.height = "100vh", this.I.dockSide === "right" ? (d.right = "0", d.borderLeft = "1px solid #444") : (d.left = "0", d.borderRight = "1px solid #444");
    }
    return n("div", null, n("div", {id:"ploft-sidebar", style:d}, n("style", null, Ph), ci(this), this.Ra ? di(this) : null, n("div", {className:"sidebar-scroll", style:{flex:"1", overflowY:"auto"}}, this.ea.map((e, f) => {
      if (!e.v.visible || e.v.floating) {
        return null;
      }
      var g = this.g[e.v.key];
      g = g && g.fb ? g.fb() : e.state.label;
      g = ki(this, e, g, b.get(e.v.key) || 30, h => bi(this, f, h), a);
      return c(e, g);
    }), n("div", {style:{height:"6px", backgroundColor:"#2d2d2d", flexShrink:"0"}})), fi(this)), this.ea.filter(e => e.v.visible && e.v.floating).map(e => {
      var f = this.g[e.v.key];
      f = f && f.fb ? f.fb() : e.state.label;
      return c(e, ki(this, e, f, 0, null, a));
    }));
  }
}
;const mi = {1:"x", 2:"y", 3:"w", 4:"h", 5:"scale_x", 6:"scale_y", 7:"x2", 8:"y2", 9:"geom", 10:"orig_w", 11:"orig_h", 12:"fit_mode", 13:"el_cmd_start", 14:"el_cmd_end", 15:"fill_color", 16:"stroke_color", 17:"stroke_width_val", 18:"tool_id", 19:"swatch_color", 20:"fill_enabled", 21:"stroke_enabled", 22:"label_id", 23:"dash_offset", 24:"current_tool(morto)", 25:"outline_mode", 26:"jsx_enabled", 27:"leg_enabled", 28:"cft_enabled", 29:"cursor_is_over", 30:"start_x", 31:"start_y", 32:"state_ref", 33:"temporal_elapsed", 
34:"target_layer", 35:"gralm_id", 36:"event_defined", 37:"name", 38:"font", 39:"text"}, ni = [{jc:1, name:"cursor"}, {jc:2, name:"move"}], oi = {1:[{key:0, name:"cursor", type:"select", options:nc}], 2:[{key:0, name:"var x", type:"var_picker", options:null}, {key:1, name:"var y", type:"var_picker", options:null}]};
function pi(a, b, c) {
  if (a.g[b]) {
    return a.g[b];
  }
  const d = a.h[b] || {}, e = {};
  let f = 1;
  for (let h = 0; h < c.length; h++) {
    const k = c[h];
    if (k.key < 20000) {
      var g = k.key;
      e[k.slot] = mi[g] || String(g);
      continue;
    }
    g = d[k.key];
    const m = k.name && k.name !== String(k.key) ? k.name : "";
    g || m ? e[k.slot] = g || m : (e[k.slot] = "v" + String(f).padStart(2, "0"), f++);
  }
  return a.g[b] = e;
}
function qi(a, b, c, d) {
  const e = a.h[b];
  return e && e[c] ? e[c] : (a = a.g[b]) && a[d] ? a[d] : mi[c] || String(c);
}
class ri {
  constructor(a) {
    this.h = a;
    this.g = {};
  }
}
;function si(a, b) {
  b.preventDefault();
  b.stopPropagation();
  a.l.sa.state.Ra = !a.l.sa.state.Ra;
  a.l.refresh();
}
function ti(a) {
  const b = {display:"flex", alignItems:"center", gap:"6px", padding:"4px 10px", cursor:"pointer", fontSize:"12px", color:"#e0e0e0", whiteSpace:"nowrap"}, c = {width:"14px", textAlign:"center", fontSize:"11px", color:"#6af"};
  return n("div", null, n("div", {onClick:() => a.Uc(), style:{position:"fixed", top:"0", left:"0", right:"0", bottom:"0", zIndex:"100"}}), n("div", {style:{position:"absolute", left:"10px", marginTop:"1px", backgroundColor:"#252526", border:"1px solid #555", borderRadius:"4px", padding:"4px 0", zIndex:"101", boxShadow:"0 4px 12px rgba(0,0,0,0.5)", minWidth:"120px"}}, n("div", {onClick:() => {
    a.Uc();
    a.l.si();
  }, style:b}, n("span", {style:c}, "\u29c9"), "Float"), n("div", {onClick:() => {
    a.Uc();
    a.l.Bg();
  }, style:b}, n("span", {style:c}, "\u00d7"), "Close")));
}
function ui(a, b) {
  b.preventDefault();
  const c = a.l.sa, d = b.clientX, e = b.clientY, f = c.v.floatX, g = c.v.floatY, h = "ploft-float-" + c.v.key;
  let k = null, m = null, l = null, p = null;
  const r = () => {
    l && (l.style.borderTop = "", l.style.borderBottom = "", p = l = null);
  };
  a.C = q => {
    var v = document.getElementById(h);
    if (v) {
      var t = Oh(f + q.clientX - d, g + q.clientY - e, c.v.floatW);
      v.style.left = t.x + "px";
      v.style.top = t.y + "px";
    }
    v = q.clientX;
    q = q.clientY;
    if (t = document.getElementById("ploft-sidebar")) {
      t = t.querySelectorAll("[data-section-key]");
      var x = null, A = null, B = null;
      for (let F = 0; F < t.length; F++) {
        const I = t[F], z = I.getBoundingClientRect();
        if (v >= z.left && v <= z.right && q >= z.top && q <= z.bottom) {
          x = I;
          A = I.getAttribute("data-section-key");
          B = q - z.top < z.height / 2 ? "above" : "below";
          break;
        }
      }
      if (x && A) {
        if (x !== l || B !== p) {
          r(), B === "above" ? x.style.borderTop = "2px solid #6af" : x.style.borderBottom = "2px solid #6af", l = x, p = B;
        }
        k = A;
        m = B;
      } else {
        r(), m = k = null;
      }
    } else {
      r(), k = null;
    }
  };
  a.O = q => {
    r();
    document.removeEventListener("mousemove", a.C);
    document.removeEventListener("mouseup", a.O);
    a.C = null;
    a.O = null;
    k && m ? a.l.ki(k, m) : (q = Oh(f + q.clientX - d, g + q.clientY - e, c.v.floatW), c.v.floatX = q.x, c.v.floatY = q.y, a.l.refresh());
  };
  document.addEventListener("mousemove", a.C);
  document.addEventListener("mouseup", a.O);
}
function vi(a, b, c) {
  b.preventDefault();
  b.stopPropagation();
  const d = a.l.sa, e = b.clientX, f = b.clientY, g = d.v.floatW, h = d.v.floatH, k = d.v.floatX;
  a.D = m => {
    var l = m.clientX - e;
    m = m.clientY - f;
    c === "left" ? (l = Math.max(200, g - l), d.v.floatW = l, d.v.floatX = k + (g - l)) : c === "right" ? d.v.floatW = Math.max(200, g + l) : c === "bottom" ? d.v.floatH = Math.max(150, h + m) : c === "corner-br" && (d.v.floatW = Math.max(200, g + l), d.v.floatH = Math.max(150, h + m));
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
function wi(a) {
  const b = a.l.sa, c = a.l.Yh, d = c.Vd === b.v.key;
  return n("div", {"data-section-key":b.v.key, style:{position:"relative"}}, n("div", {draggable:"true", onDragStart:e => a.l.ni(e), onDragOver:e => a.l.mi(e), onDrop:e => a.l.oi(e), onDragEnd:e => a.l.li(e), onClick:() => a.l.ri(), onContextMenu:e => si(a, e), style:{display:"flex", alignItems:"center", gap:"4px", padding:"4px 10px", backgroundColor:"#2d2d2d", cursor:"grab", fontSize:"11px", fontWeight:"bold", letterSpacing:"0.3px", color:"#e0e0e0", borderTop:d && c.tc === "above" ? "2px solid #6af" : 
  "1px solid #444", borderBottom:d && c.tc === "below" ? "2px solid #6af" : "2px solid transparent", userSelect:"none"}}, n("span", {style:{color:"#aaa", fontSize:"9px", width:"10px"}}, b.v.collapsed ? "\u25b6" : "\u25bc"), a.l.title), a.l.sa.state.Ra ? ti(a) : null, b.v.collapsed ? null : n("div", null, n("div", {id:Sh(b.v.key), className:"sidebar-scroll", style:{overflowY:"auto", height:a.l.height + "px", padding:"6px 8px"}}, a.g()), n("div", {className:a.l.cf ? "section-sash" : "", onMouseDown:a.l.cf, 
  style:{height:"4px", cursor:a.l.cf ? "ns-resize" : "default", flexShrink:"0"}})));
}
function xi(a) {
  const b = a.l.sa, c = {position:"absolute", zIndex:"10"}, d = Oh(b.v.floatX, b.v.floatY, b.v.floatW);
  b.v.floatX = d.x;
  b.v.floatY = d.y;
  return n("div", {id:"ploft-float-" + b.v.key, style:{position:"fixed", left:d.x + "px", top:d.y + "px", width:b.v.floatW + "px", height:b.v.floatH + "px", backgroundColor:"#1e1e1e", border:"1px solid #555", borderRadius:"6px", boxShadow:"0 6px 20px rgba(0,0,0,0.6)", display:"flex", flexDirection:"column", overflow:"hidden", zIndex:"50", pointerEvents:"auto", fontFamily:"sans-serif", fontSize:"12px", color:"#e0e0e0"}}, n("div", {onMouseDown:e => ui(a, e), onContextMenu:e => si(a, e), style:{display:"flex", 
  alignItems:"center", justifyContent:"space-between", padding:"4px 10px", backgroundColor:"#2d2d2d", borderBottom:"1px solid #444", cursor:"grab", fontSize:"11px", fontWeight:"bold", letterSpacing:"0.3px", color:"#e0e0e0", userSelect:"none", flexShrink:"0"}}, a.l.title, n("span", {onClick:() => a.l.Bg(), onMouseDown:e => e.stopPropagation(), style:{cursor:"pointer", color:"#888", fontSize:"13px", padding:"0 2px"}}, "\u00d7")), n("div", {className:"sidebar-scroll", style:{flex:"1", overflowY:"auto", 
  padding:"6px 8px"}}, a.g()), n("div", {onMouseDown:e => vi(a, e, "left"), style:{...c, left:"0", top:"0", width:"5px", height:"100%", cursor:"ew-resize"}}), n("div", {onMouseDown:e => vi(a, e, "right"), style:{...c, right:"0", top:"0", width:"5px", height:"100%", cursor:"ew-resize"}}), n("div", {onMouseDown:e => vi(a, e, "bottom"), style:{...c, left:"0", bottom:"0", width:"100%", height:"5px", cursor:"ns-resize"}}), n("div", {onMouseDown:e => vi(a, e, "corner-br"), style:{...c, right:"0", bottom:"0", 
  width:"10px", height:"10px", cursor:"nwse-resize"}}));
}
class yi extends Qc.g {
  constructor(a) {
    super();
    this.l = a;
    this.H = this.D = this.O = this.C = null;
    this.i = 0;
  }
  Uc() {
    this.l.sa.state.Ra = !1;
    this.l.refresh();
  }
  g() {
    return null;
  }
  render() {
    return this.l.sa.v.floating ? xi(this) : wi(this);
  }
}
;function zi(a) {
  const b = a.data.state, c = b.de.trim();
  c && !b.Ea.some(d => d.name === c) && (b.Ea.push({name:c, value:"", type:"text"}), b.de = "", a.l.refresh());
}
function Ai(a, b, c, d) {
  a = a.data.state.Ea[b];
  d = d.currentTarget.value;
  var e = a.value.split(" ");
  b = e[0] || "";
  var f = (e[1] || "00:00").split(":");
  e = f[0] || "00";
  f = f[1] || "00";
  c === "h" ? e = d.padStart(2, "0") : f = d.padStart(2, "0");
  a.value = b + " " + e + ":" + f;
}
;function Bi(a, b) {
  var c = a.data.state;
  const d = c.Gc, e = c.bb;
  var f = (new Date(d, e, 1)).getDay(), g = (new Date(d, e + 1, 0)).getDate();
  c = c.Ea[b];
  var h = -1;
  if (c.value) {
    var k = c.value.split("-");
    if (k.length >= 3) {
      var m = parseInt(k[1], 10) - 1, l = parseInt(k[2], 10);
      parseInt(k[0], 10) === d && m === e && (h = l);
    }
  }
  k = [];
  m = [];
  for (l = 0; l < f; l++) {
    m.push(n("td", {style:{width:"22px", height:"20px"}}));
  }
  for (l = 1; l <= g; l++) {
    const p = l, r = p === h;
    m.push(n("td", {onClick:() => {
      var q = a.data.state;
      const v = q.Gc + "-" + String(q.bb + 1).padStart(2, "0") + "-" + String(p).padStart(2, "0");
      q = q.Ea[b];
      if (q.type === "datetime") {
        const t = q.value;
        q.value = v + (t && t.indexOf(" ") >= 0 ? t.substring(t.indexOf(" ")) : " 00:00");
      } else {
        q.value = v;
      }
      a.l.refresh();
    }, style:{width:"22px", height:"20px", textAlign:"center", cursor:"pointer", backgroundColor:r ? "#007fd4" : "transparent", color:r ? "#fff" : "#ccc", borderRadius:"2px", fontSize:"11px"}}, String(p)));
    (f + l) % 7 === 0 && (k.push(n("tr", null, m)), m = []);
  }
  if (m.length > 0) {
    for (; m.length < 7;) {
      m.push(n("td", {style:{width:"22px", height:"20px"}}));
    }
    k.push(n("tr", null, m));
  }
  f = c.type === "datetime";
  g = c.value && c.value.indexOf(" ") >= 0 ? c.value.split(" ")[1].split(":") : ["00", "00"];
  c = {cursor:"pointer", padding:"0 4px", color:"#6af", userSelect:"none"};
  h = {width:"30px", textAlign:"center", backgroundColor:"#2a2a2a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", padding:"1px 2px", fontSize:"11px", outline:"none"};
  return n("div", {style:{backgroundColor:"#252526", border:"1px solid #555", borderRadius:"4px", padding:"6px", marginTop:"4px", marginBottom:"4px"}}, n("div", {style:{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"4px", fontSize:"11px", color:"#e0e0e0"}}, n("span", {onClick:() => {
    const p = a.data.state;
    p.bb--;
    p.bb < 0 && (p.bb = 11, p.Gc--);
    a.l.refresh();
  }, style:c}, "\u25c0"), n("span", null, "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ")[e] + " " + d), n("span", {onClick:() => {
    const p = a.data.state;
    p.bb++;
    p.bb > 11 && (p.bb = 0, p.Gc++);
    a.l.refresh();
  }, style:c}, "\u25b6")), n("table", {style:{borderCollapse:"collapse", width:"100%"}}, n("thead", null, n("tr", null, "Su Mo Tu We Th Fr Sa".split(" ").map(p => n("th", {style:{width:"22px", fontSize:"10px", color:"#888", fontWeight:"normal", textAlign:"center", paddingBottom:"2px"}}, p)))), n("tbody", null, k)), f ? n("div", {style:{display:"flex", alignItems:"center", gap:"4px", marginTop:"6px", justifyContent:"center"}}, n("input", {type:"number", min:"0", max:"23", value:g[0], onInput:p => 
  Ai(a, b, "h", p), style:h}), n("span", {style:{color:"#888"}}, ":"), n("input", {type:"number", min:"0", max:"59", value:g[1], onInput:p => Ai(a, b, "m", p), style:h})) : null);
}
;class Ci extends yi {
  constructor(a, b) {
    super(a);
    this.data = b;
  }
  g() {
    const a = this.data.state;
    return n("div", {style:{fontSize:"11px"}}, n("div", {style:{display:"flex", gap:"4px", marginBottom:"6px", paddingLeft:"4px"}}, n("input", {type:"text", value:a.de, onInput:b => {
      this.data.state.de = b.currentTarget.value;
    }, onKeyDown:b => {
      b.key === "Enter" && zi(this);
    }, placeholder:"name", style:{...Qh, flex:"1"}}), n("button", {onClick:() => zi(this), style:{padding:"2px 8px", fontSize:"13px", cursor:"pointer", backgroundColor:"#3a3a3a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", lineHeight:"1"}}, "+")), a.Ea.map((b, c) => n("div", null, n("div", {style:{display:"flex", alignItems:"center", gap:"4px", marginBottom:"2px", paddingLeft:"4px"}}, n("span", {style:{color:"#9cdcfe", fontFamily:"monospace", fontSize:"11px", width:"20ch", minWidth:"20ch", 
    overflow:"hidden", textOverflow:"ellipsis", flexShrink:"0"}}, b.name), n("select", {onInput:d => {
      const e = this.data.state;
      e.Ea[c].type = d.currentTarget.value;
      e.Ea[c].value = "";
      e.ab === c && (e.ab = -1);
      this.l.refresh();
    }, style:Rh}, n("option", {value:"text", selected:b.type === "text"}, "text"), n("option", {value:"int", selected:b.type === "int"}, "int"), n("option", {value:"double", selected:b.type === "double"}, "double"), n("option", {value:"date", selected:b.type === "date"}, "date"), n("option", {value:"datetime", selected:b.type === "datetime"}, "datetime")), b.type === "int" || b.type === "double" ? n("input", {type:"number", step:b.type === "int" ? "1" : "any", value:b.value, onInput:d => {
      this.data.state.Ea[c].value = d.currentTarget.value;
    }, style:{...Qh, width:"55px", flex:"0 0 auto"}}) : b.type === "date" || b.type === "datetime" ? n("span", {onClick:() => {
      const d = this.data.state;
      if (d.ab === c) {
        d.ab = -1;
      } else {
        d.ab = c;
        var e = d.Ea[c].value;
        e ? (e = e.split("-"), e.length >= 3 && (d.Gc = parseInt(e[0], 10) || (new Date()).getFullYear(), d.bb = (parseInt(e[1], 10) || 1) - 1)) : (d.Gc = (new Date()).getFullYear(), d.bb = (new Date()).getMonth());
      }
      this.l.refresh();
    }, style:{cursor:"pointer", color:b.value ? "#e0e0e0" : "#666", fontFamily:"monospace", fontSize:"10px", padding:"1px 4px", backgroundColor:"#2a2a2a", border:"1px solid #555", borderRadius:"2px", flex:"1", textAlign:"center", minWidth:"0", overflow:"hidden", textOverflow:"ellipsis"}}, b.value || (b.type === "date" ? "select date" : "select date/time")) : n("input", {type:"text", value:b.value, onInput:d => {
      this.data.state.Ea[c].value = d.currentTarget.value;
    }, style:{...Qh, flex:"1"}}), n("span", {onClick:() => {
      const d = this.data.state;
      d.ab === c ? d.ab = -1 : d.ab > c && d.ab--;
      d.Ea.splice(c, 1);
      this.l.refresh();
    }, style:{cursor:"pointer", color:"#888", fontSize:"13px", padding:"0 2px", flexShrink:"0"}}, "\u00d7")), a.ab === c ? Bi(this, c) : null)));
  }
}
;class Di extends yi {
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
    return n("div", null, n("button", {onClick:() => this.onClick(), style:{padding:"6px 12px", fontSize:"12px", cursor:"pointer", backgroundColor:"#4CAF50", color:"white", border:"none", borderRadius:"3px"}}, "HELLO WORLD"), n("div", {style:{marginTop:"8px", fontSize:"12px", fontWeight:"bold", color:"#e0e0e0"}}, "COUNT : " + a.A.count));
  }
}
;function T(a, b) {
  return a.name + "/" + b.name;
}
;const Ei = {cursor:"pointer", padding:"2px 4px", backgroundColor:"#3a3a3a", border:"1px solid #555", borderRadius:"3px", fontSize:"10px", color:"#ccc", flexShrink:"0"}, Fi = {display:"flex", alignItems:"center", gap:"4px", padding:"4px 0", marginBottom:"4px", borderBottom:"1px solid #444", flexShrink:"0"}, Gi = {cursor:"pointer", padding:"2px 6px", backgroundColor:"#3a3a3a", border:"1px solid #555", borderRadius:"3px", fontSize:"10px", color:"#ccc"}, Hi = {color:"#666", fontSize:"11px", padding:"8px 0", 
textAlign:"center"}, Ii = {margin:"0", padding:"4px 6px", fontSize:"10px", fontFamily:"monospace", color:"#aaa", overflowY:"auto", overflowX:"hidden", whiteSpace:"pre", flex:"1", minHeight:"0"};
function Ji() {
  return {categories:[], assign:{}, names:{}, collapsed:{}, seq:1};
}
;function Ki(a, b) {
  for (let c = 0; c < a.categories.length; c++) {
    if (a.categories[c].id === b) {
      return !0;
    }
  }
  return !1;
}
function Li(a) {
  if (!a) {
    return Ji();
  }
  a.categories || (a.categories = []);
  a.assign || (a.assign = {});
  a.names || (a.names = {});
  a.collapsed || (a.collapsed = {});
  a.seq || (a.seq = 1);
  return a;
}
function Mi(a, b, c) {
  const d = "c" + a.seq++;
  a.categories.push({id:d, name:c || "nova categoria", Ta:b || "__all__"});
  return d;
}
function Ni(a, b, c) {
  for (let d = 0; d < a.categories.length; d++) {
    if (a.categories[d].id === b) {
      a.categories[d].name = c;
      break;
    }
  }
}
function Oi(a, b) {
  let c = "__all__";
  for (var d = 0; d < a.categories.length; d++) {
    if (a.categories[d].id === b) {
      c = a.categories[d].Ta;
      break;
    }
  }
  for (d = 0; d < a.categories.length; d++) {
    a.categories[d].Ta === b && (a.categories[d].Ta = c);
  }
  for (const e in a.assign) {
    a.assign[e] === b && (c === "__all__" ? delete a.assign[e] : a.assign[e] = c);
  }
  a.categories = a.categories.filter(e => e.id !== b);
  delete a.collapsed[b];
}
function Pi(a, b, c) {
  c && c !== "__all__" && c !== "__unclassified__" && Ki(a, c) ? a.assign[b] = c : delete a.assign[b];
}
function Qi(a, b, c) {
  if (b !== c) {
    c = c === "__unclassified__" ? "__all__" : c;
    a: {
      var d = c;
      var e = {};
      for (let f = 0; f < a.categories.length; f++) {
        e[a.categories[f].id] = a.categories[f];
      }
      for (; d && d !== "__all__";) {
        if (d === b) {
          e = !0;
          break a;
        }
        d = (d = e[d]) ? d.Ta : null;
      }
      e = b === "__all__";
    }
    if (!e) {
      for (e = 0; e < a.categories.length; e++) {
        if (a.categories[e].id === b) {
          a.categories[e].Ta = c;
          break;
        }
      }
    }
  }
}
function Ri(a, b) {
  const c = {};
  for (b = c[b] = !0; b;) {
    b = !1;
    for (let d = 0; d < a.categories.length; d++) {
      const e = a.categories[d];
      c[e.Ta] && !c[e.id] && (b = c[e.id] = !0);
    }
  }
  b = [];
  for (const d in a.assign) {
    c[a.assign[d]] && b.push(d);
  }
  return b;
}
function Si(a, b, c) {
  var d = {};
  for (var e = 0; e < b.length; e++) {
    d[b[e]] = !0;
  }
  for (const q in a.assign) {
    d[q] = !0;
  }
  for (const q in a.names) {
    d[q] = !0;
  }
  const f = {};
  for (b = 0; b < a.categories.length; b++) {
    e = a.categories[b], (f[e.Ta] = f[e.Ta] || []).push(e);
  }
  const g = {}, h = [];
  for (const q in d) {
    (d = a.assign[q]) && Ki(a, d) ? (g[d] = g[d] || []).push(q) : h.push(q);
  }
  const k = [], m = c || {}, l = (q, v) => {
    if (q === "item") {
      return [];
    }
    if (q === "unclassified") {
      return h.map(x => ({kind:"item", id:x}));
    }
    var t = (f[v] || []).map(x => ({kind:"cat", id:x.id}));
    v = (q === "cat" ? g[v] || [] : []).map(x => ({kind:"item", id:x}));
    t = t.concat(v);
    q === "all" && t.push({kind:"unclassified", id:"__unclassified__"});
    return t;
  }, p = (q, v) => {
    if (q === "all") {
      return "Todos";
    }
    if (q === "unclassified") {
      return "Nao classificados";
    }
    if (q === "item") {
      return m[v] || a.names[v] || v;
    }
    for (q = 0; q < a.categories.length; q++) {
      if (a.categories[q].id === v) {
        return a.categories[q].name;
      }
    }
    return v;
  }, r = (q, v, t, x, A) => {
    const B = a.collapsed[v] ? [] : l(q, v), F = l(q, v);
    k.push({key:q + ":" + v, kind:q, id:v, uuid:q === "item" ? v : "", name:p(q, v), depth:t, fi:A, Qh:x.slice(), Xe:F.length > 0, count:(g[v] || []).length});
    q = x.concat([A]);
    for (v = 0; v < B.length; v++) {
      r(B[v].kind, B[v].id, t + 1, q, v === B.length - 1);
    }
  };
  r("all", "__all__", 0, [], !0);
  return k;
}
;function Ti(a) {
  a = Li(a);
  a.folders || (a.folders = {});
  return a;
}
async function Ui(a) {
  const b = a.u.Rd;
  a = a.data.state.Ha;
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
function Vi(a) {
  const b = a.data.state.Ha;
  if (!b) {
    return [];
  }
  const c = [], d = (e, f) => {
    for (let g = 0; g < b.categories.length; g++) {
      const h = b.categories[g];
      if (h.Ta !== e) {
        continue;
      }
      const k = b.categories.some(m => m.Ta === h.id);
      c.push({id:h.id, name:h.name, depth:f, Xe:k, open:!b.collapsed[h.id], count:Wi(a, h.id)});
      b.collapsed[h.id] || d(h.id, f + 1);
    }
  };
  d("__all__", 0);
  return c;
}
function Xi(a, b) {
  a = a.data.state;
  const c = a.Ha, d = [], e = [];
  if (!c) {
    return {folders:d, files:e};
  }
  const f = {};
  for (var g = 0; g < a.folders.length; g++) {
    f[a.folders[g].name] = g;
  }
  for (var h in c.folders) {
    if (c.folders[h] !== b) {
      continue;
    }
    g = f[h];
    var k = 0;
    if (g !== void 0) {
      var m = a.folders[g];
      for (let l = 0; l < m.files.length; l++) {
        c.assign[T(m, m.files[l])] || k++;
      }
    }
    d.push({name:h, ca:g !== void 0 ? g : -1, count:k});
  }
  d.sort((l, p) => l.name < p.name ? -1 : 1);
  for (const l in c.assign) {
    if (c.assign[l] !== b) {
      continue;
    }
    g = l.lastIndexOf("/");
    h = f[l.slice(0, g)];
    if (h === void 0) {
      continue;
    }
    g = l.slice(g + 1);
    k = a.folders[h];
    for (m = 0; m < k.files.length; m++) {
      if (k.files[m].name === g) {
        e.push({ca:h, bi:m});
        break;
      }
    }
  }
  return {folders:d, files:e};
}
function Wi(a, b) {
  a = Xi(a, b);
  b = a.files.length;
  for (let c = 0; c < a.folders.length; c++) {
    b += a.folders[c].count;
  }
  return b;
}
function Yi(a, b) {
  var c = a.data.state;
  a = c.Ha;
  b = c.folders[b];
  c = [];
  if (!b) {
    return c;
  }
  for (let d = 0; d < b.files.length; d++) {
    a && a.assign[T(b, b.files[d])] || c.push(d);
  }
  return c;
}
function Zi(a, b) {
  var c = a.data.state.Ha;
  return c ? (c = c.categories.find(d => d.id === b)) ? {id:c.id, name:c.name, depth:0, Xe:!1, open:!0, count:Wi(a, b)} : null : null;
}
async function $i(a) {
  try {
    const b = await (await a.getFileHandle("ploft_classify.json")).getFile();
    return Ti(JSON.parse(await b.text()));
  } catch (b) {
    return Ti(null);
  }
}
function aj(a, b) {
  const c = a.data.state, d = c.Ha;
  d && (b(d), c.Ae++, a.u.layout = null, Ui(a), a.l.refresh());
}
function bj(a, b) {
  return (a = a.data.state.Ha) && a.names[b] || b;
}
function cj(a) {
  a = a.data.state;
  const b = a.Ha, c = [];
  for (let d = 0; d < a.folders.length; d++) {
    const e = a.folders[d], f = [];
    if (!b || !b.folders[e.name]) {
      for (let g = 0; g < e.files.length; g++) {
        b && b.assign[T(e, e.files[g])] || f.push(g);
      }
    }
    c.push(f);
  }
  return c;
}
var dj = Xi;
function ej(a) {
  a = a.data.state;
  const b = a.Ha;
  if (!b) {
    return 0;
  }
  let c = 0;
  for (const d in a.yb) {
    a.yb[d] && b.folders[d] && c++;
  }
  for (const d in a.ba) {
    a.ba[d] && b.assign[d] && c++;
  }
  return c;
}
;function fj(a) {
  a.u.sd || (a.u.jd > 8 ? (a.u.sd = 1, setTimeout(() => {
    a.u.sd = 0;
    a.l.refresh();
  }, 150)) : a.u.sd = requestAnimationFrame(() => {
    a.u.sd = 0;
    a.l.refresh();
  }));
}
function gj() {
  return new Promise(a => setTimeout(a, 0));
}
async function hj(a) {
  if (!a.u.We) {
    const b = new xa("ploft.gallery");
    await b.init();
    a.u.We = b;
  }
  return a.u.We;
}
function ij(a, b) {
  a = T(a, b);
  b.zc = performance.now();
  return a;
}
async function jj(a, b, c) {
  var d = a.u.Ve.get(c);
  if (d) {
    return d;
  }
  d = b;
  if (c !== b.name) {
    b = b.name + "/";
    b = (c.indexOf(b) === 0 ? c.substring(b.length) : c).split("/").filter(Boolean);
    try {
      for (const e of b) {
        d = await d.getDirectoryHandle(e);
      }
    } catch (e) {
      return console.warn("[gallery] folder missing", c, e), null;
    }
  }
  a.u.Ve.set(c, d);
  return d;
}
async function kj(a, b, c) {
  if (c.handle) {
    return c.handle;
  }
  if (!a.u.Rd) {
    return null;
  }
  a = await jj(a, a.u.Rd, b.name);
  if (!a) {
    return null;
  }
  try {
    return c.handle = await a.getFileHandle(c.name), c.handle;
  } catch (d) {
    return null;
  }
}
async function lj(a, b, c) {
  const d = ij(b, c);
  if (c.url) {
    return a.u.ub.set(d, c), c.url;
  }
  if (a.u.xd.has(d)) {
    return null;
  }
  a.u.xd.add(d);
  try {
    if (!c.handle && !await kj(a, b, c) || a.u.yd && !a.u.yd.has(d)) {
      return null;
    }
    const e = await c.handle.getFile();
    c.url = URL.createObjectURL(e);
    a.u.ub.set(d, c);
    a.u.wc && a.u.wc.has(d) && (a.u.wc.delete(d), !a.u.wc || a.u.wc.size > 0 || (a.u.wc = null));
    a.u.yd && !a.u.yd.has(d) || fj(a);
    return c.url;
  } catch (e) {
    return console.warn("[gallery] thumb load failed", d, e), null;
  } finally {
    a.u.xd.delete(d);
  }
}
function mj(a) {
  for (const b of a.u.ub.values()) {
    b.url && URL.revokeObjectURL(b.url), b.url = null;
  }
  a.u.ub.clear();
  a.u.xd.clear();
  a.u.Ve.clear();
  a.u.jd = 0;
}
function nj(a, b) {
  a = a.data.state;
  const c = a.Ie;
  if (c) {
    for (var d of b) {
      c.indexOf(d.name) >= 0 && (d.open = !0);
    }
    a.Ie = null;
  } else {
    d = {};
    for (const e of a.folders) {
      e.open && (d[e.name] = !0);
    }
    for (const e of b) {
      d[e.name] && (e.open = !0);
    }
  }
}
async function oj(a, b, c) {
  var d = 0, e = 0, f = 0;
  const g = [], h = async(k, m) => {
    if (c === a.u.Ca) {
      d++;
      var l = [];
      for await (const p of k.values()) {
        if (c !== a.u.Ca) {
          return;
        }
        e++;
        if (p.kind === "file") {
          p.name.toLowerCase().endsWith(".svg") && (f++, l.push({name:p.name, url:null, handle:p, zc:0}));
        } else {
          if (await h(p, m + "/" + p.name), c !== a.u.Ca) {
            return;
          }
        }
        if ((e & 15) === 0 && (await gj(), c !== a.u.Ca)) {
          return;
        }
      }
      l.length > 0 && g.push({name:m, open:!1, files:l});
    }
  };
  await h(b, b.name);
  return c !== a.u.Ca ? null : g;
}
async function pj(a, b, c) {
  await (await hj(a)).set("catalog_v1", {root:b.name, folders:c.map(d => ({name:d.name, files:d.files.map(e => e.name)}))});
}
async function qj(a, b) {
  a = await (await hj(a)).get("catalog_v1");
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
      a.push({name:d, url:null, handle:null, zc:0});
    }
    b.push({name:c.name, open:!1, files:a});
  }
  return b;
}
async function rj(a) {
  const b = await (await hj(a)).get("view_v1");
  if (b) {
    var c = a.data.state;
    typeof b.scrollTop === "number" && (c.pa = Math.max(0, b.scrollTop), a.u.cc = c.pa);
    if (Array.isArray(b.openFolders)) {
      for (const d of c.folders) {
        d.open = b.openFolders.indexOf(d.name) >= 0;
      }
    }
  }
}
async function sj(a) {
  const b = a.data.state, c = b.folders.filter(d => d.open).map(d => d.name);
  await (await hj(a)).set("view_v1", {scrollTop:b.pa, openFolders:c});
}
async function tj(a, b) {
  a.u.Ca++;
  const c = a.u.Ca;
  a.u.Rd = b;
  mj(a);
  $i(b).then(h => {
    c === a.u.Ca && (a.data.state.Ha = h, a.data.state.Ae++, a.u.layout = null, a.l.refresh());
  });
  const d = await qj(a, b);
  if (c === a.u.Ca) {
    if (d && d.length > 0) {
      nj(a, d);
      a.data.state.folders = d;
      a.data.state.ze++;
      a.u.layout = null;
      await rj(a);
      if (c !== a.u.Ca) {
        return;
      }
      d.reduce((h, k) => h + k.files.length, 0);
      a.l.refresh();
    }
    a.u.Ec.scanStart = performance.now();
    var e = await oj(a, b, c);
    if (e && c === a.u.Ca) {
      e.reduce((h, k) => h + k.files.length, 0);
      if (d) {
        const h = new Map();
        for (var f of d) {
          for (var g of f.files) {
            g.url && h.set(T(f, g), g);
          }
        }
        for (const k of e) {
          for (const m of k.files) {
            f = T(k, m), (g = h.get(f)) && g.url && (m.url = g.url, m.zc = g.zc, a.u.ub.set(f, m));
          }
        }
      }
      nj(a, e);
      a.data.state.folders = e;
      a.data.state.ze++;
      a.u.layout = null;
      await pj(a, b, e);
      c === a.u.Ca && (d || await rj(a), c === a.u.Ca && a.l.refresh());
    }
  }
}
function uj(a, b, c) {
  return {type:a, y:b, ja:c, ca:-1, gf:-1, eb:0, Xb:0, catId:"", xa:"", name:"", count:0, depth:0, open:!1};
}
function vj(a, b, c, d, e, f) {
  const g = Math.ceil(c / d);
  for (let h = 0; h < g; h++) {
    const k = h < g - 1 ? e.grid : e.Na, m = uj(1, b, k);
    m.eb = h * d;
    m.Xb = Math.min(m.eb + d, c);
    m.gf = h;
    f(m, h);
    a.push(m);
    b += k;
  }
  g > 0 && (b += 8);
  return b;
}
function wj(a, b, c, d, e, f, g) {
  const h = a.data.state, k = m => {
    var l = uj(3, c, 22);
    l.catId = m.id;
    l.name = m.name;
    l.depth = m.depth;
    l.open = m.open;
    l.count = m.count;
    b.push(l);
    c += 22;
    if (m.open) {
      l = dj(a, m.id);
      for (const q of l.folders) {
        const v = m.id + "|" + q.name;
        var p = !!h.xb[v], r = uj(4, c, 22);
        r.catId = m.id;
        r.xa = v;
        r.name = q.name;
        r.ca = q.ca;
        r.count = q.count;
        r.open = p;
        r.depth = m.depth + 1;
        b.push(r);
        c += 22;
        p && q.ca >= 0 && (p = Yi(a, q.ca).map(t => ({f:q.ca, Zb:t})), f[v] = p, c = vj(b, c, p.length, d, e, t => {
          t.catId = m.id;
          t.xa = v;
          t.depth = m.depth + 1;
        }));
      }
      if (l.files.length) {
        const q = m.id + "|*files";
        p = !!h.xb[q];
        r = uj(4, c, 22);
        r.catId = m.id;
        r.xa = q;
        r.name = "(arquivos)";
        r.count = l.files.length;
        r.open = p;
        r.depth = m.depth + 1;
        b.push(r);
        c += 22;
        p && (l = l.files.map(v => ({f:v.ca, Zb:v.bi})), f[q] = l, c = vj(b, c, l.length, d, e, v => {
          v.catId = m.id;
          v.xa = q;
          v.depth = m.depth + 1;
        }));
      }
    }
  };
  if (g) {
    return (g = Zi(a, g)) && k(g), c;
  }
  b.push(uj(2, c, 23));
  c += 23;
  if (h.Qb) {
    for (const m of Vi(a)) {
      k(m);
    }
  }
  return c;
}
function xj(a, b, c, d, e, f) {
  a = a.data.state;
  var g = 0;
  for (var h = 0; h < f.length; h++) {
    g += f[h].length;
  }
  h = uj(5, c, 27);
  h.count = g;
  b.push(h);
  c += 27;
  if (!a.Sb) {
    return c;
  }
  for (let k = 0; k < a.folders.length; k++) {
    g = f[k].length;
    if (!g) {
      continue;
    }
    h = uj(0, c, e.folder);
    h.ca = k;
    h.count = g;
    b.push(h);
    c += e.folder;
    a.folders[k].open && (c = vj(b, c, g, d, e, m => {
      m.ca = k;
    }));
  }
  return c;
}
function yj(a, b, c) {
  var d = a.data.state, e = d.A.thumbSize + 2 + Math.ceil(d.A.fileFontSize * 1.2) + 2;
  e = {Na:e, grid:e + d.A.thumbGap, folder:Math.ceil(d.A.folderFontSize * 1.2) + 6 + 2};
  b = Math.max(1, Math.floor((b + d.A.thumbGap) / (d.A.thumbSize + d.A.thumbGap)));
  d = cj(a);
  const f = [], g = {};
  let h = 0;
  c === "full" || c === "class" ? h = wj(a, f, h, b, e, g, "") : c.indexOf("pinned:") === 0 && (h = wj(a, f, h, b, e, g, c.slice(7)));
  if (c === "full" || c === "unclass") {
    h = xj(a, f, h, b, e, d);
  }
  a = 0;
  for (c = 0; c < d.length; c++) {
    a += d[c].length;
  }
  return {rows:f, Wg:h, ej:b, ve:d, lg:g, Aj:a};
}
function zj(a, b, c) {
  const d = T(b, c);
  c.url || a.u.xd.has(d) || (a.u.jd >= 50 ? fj(a) : (a.u.jd++, lj(a, b, c).finally(() => {
    a.u.jd--;
  })));
}
function Aj(a, b) {
  var c = Math.max(300, b.size + 200);
  if (!(a.u.ub.size <= c)) {
    var d = [];
    a.u.ub.forEach((f, g) => {
      b.has(g) || d.push({key:g, file:f});
    });
    d.sort((f, g) => f.file.zc - g.file.zc);
    c = a.u.ub.size - c;
    var e = 0;
    for (const f of d) {
      if (c <= 0) {
        break;
      }
      f.file.url && URL.revokeObjectURL(f.file.url);
      f.file.url = null;
      a.u.ub.delete(f.key);
      c--;
      e++;
    }
  }
}
async function Bj(a) {
  a.data.state.If = !0;
  a.u.Ec.open || (a.u.Ec.open = performance.now(), a.u.be = !0);
  var b = new xa("ploft.gallery");
  await b.init();
  (b = await b.get("pictures")) && await cb(b) && await tj(a, b);
}
function Cj(a) {
  a.u.ue && clearTimeout(a.u.ue);
  a.u.ue = setTimeout(() => {
    a.u.ue = 0;
    sj(a);
  }, 300);
}
function Dj(a, b, c) {
  const d = a.data.state;
  c = c || "full";
  const e = c + "|" + d.A.thumbSize + "," + d.A.thumbGap + "," + d.A.folderFontSize + "," + d.A.fileFontSize + "," + b + "," + d.ze + "," + d.Ae + "," + (d.Qb ? "C" : "c") + (d.Sb ? "U" : "u") + "," + Object.keys(d.xb).filter(h => d.xb[h]).join(";") + "," + d.folders.map(h => h.files.length + (h.open ? "o" : "c")).join(",");
  a.u.layout || (a.u.Ze = {});
  const f = a.u.Ze || (a.u.Ze = {}), g = f[c];
  g && g.key === e || (f[c] = {key:e, layout:yj(a, b, c)});
  c !== "class" && (a.u.layout = f[c].layout, a.u.gi = e);
  return f[c].layout;
}
;function Ej(a) {
  return a.data.state.A.pinned === "*unclass" ? "unclass" : "full";
}
function Fj(a) {
  var b = a.data.state;
  const c = new Set(), d = e => {
    if (e && e.open) {
      var f = dj(a, e.id);
      for (const g of f.folders) {
        c.add(e.id + "|" + g.name);
      }
      f.files.length && c.add(e.id + "|*files");
    }
  };
  for (const e of Vi(a)) {
    d(e);
  }
  (b = b.A.pinned) && b !== "*unclass" && d(Zi(a, b));
  return Array.from(c);
}
function Gj(a) {
  const b = a.data.state, c = cj(a);
  for (let d = 0; d < b.folders.length; d++) {
    if (c[d].length && !b.folders[d].open) {
      return !1;
    }
  }
  return Fj(a).every(d => !!b.xb[d]);
}
async function Hj(a) {
  const b = await qb({Pa:"ploft.gallery", key:"pictures", reload:!0});
  b.handle && (a.u.Ec = {}, a.u.Ec.open = performance.now(), a.u.be = !0, await tj(a, b.handle));
}
async function Ij(a, b, c, d) {
  const e = a.data.state;
  e.aa = {fileName:d.name, cd:c.name, url:d.url, x:b.clientX, y:b.clientY, w:280, ja:200, pinned:!1, hc:null};
  a.l.refresh();
  const f = await lj(a, c, d);
  f && e.aa && e.aa.fileName === d.name && e.aa.cd === c.name && (e.aa.url = f, a.l.refresh(), fetch(f).then(g => g.text()).then(g => {
    e.aa && e.aa.url === f && (e.aa.hc = g, a.l.refresh());
  }));
}
function Jj(a) {
  a.data.state.aa = null;
  a.l.refresh();
}
function Kj(a, b) {
  const c = a.data.state.aa;
  if (c && c.pinned) {
    b.preventDefault();
    var d = b.clientX, e = b.clientY, f = c.x, g = c.y, h = document.getElementById("gallery-ctx-menu"), k = l => {
      h && (h.style.left = f + l.clientX - d + "px", h.style.top = g + l.clientY - e + "px");
    }, m = l => {
      c.x = f + l.clientX - d;
      c.y = g + l.clientY - e;
      document.removeEventListener("mousemove", k);
      document.removeEventListener("mouseup", m);
      a.l.refresh();
    };
    document.addEventListener("mousemove", k);
    document.addEventListener("mouseup", m);
  }
}
function Lj(a, b) {
  const c = a.data.state.aa;
  if (c) {
    b.preventDefault();
    b.stopPropagation();
    var d = b.clientX, e = b.clientY, f = c.w, g = c.ja, h = document.getElementById("gallery-ctx-menu"), k = l => {
      h && (h.style.width = Math.max(200, f + l.clientX - d) + "px", h.style.height = Math.max(100, g + l.clientY - e) + "px");
    }, m = l => {
      c.w = Math.max(200, f + l.clientX - d);
      c.ja = Math.max(100, g + l.clientY - e);
      document.removeEventListener("mousemove", k);
      document.removeEventListener("mouseup", m);
      a.l.refresh();
    };
    document.addEventListener("mousemove", k);
    document.addEventListener("mouseup", m);
  }
}
function Mj(a) {
  aj(a, b => {
    Mi(b, "__all__", "novo classificador");
  });
}
function Nj(a, b, c) {
  c.trim() && aj(a, d => {
    Ni(d, b, c.trim());
  });
}
function Oj(a, b) {
  a.data.state.A.pinned === b && (a.data.state.A.pinned = "");
  aj(a, c => {
    let d = "__all__";
    for (let e = 0; e < c.categories.length; e++) {
      if (c.categories[e].id === b) {
        d = c.categories[e].Ta;
        break;
      }
    }
    Oi(c, b);
    for (const e in c.folders) {
      c.folders[e] === b && (d === "__all__" ? delete c.folders[e] : c.folders[e] = d);
    }
  });
}
function Pj(a, b) {
  aj(a, c => {
    c.collapsed[b] = !c.collapsed[b];
  });
}
function Qj(a, b) {
  const c = a.data.state, d = c.Rb, e = c.Wa, f = c.Va;
  c.Rb = "";
  c.Wa = "";
  c.Va = null;
  aj(a, g => {
    if (d && d !== b) {
      Qi(g, d, b);
    } else if (e) {
      g.folders[e] = b;
    } else if (f) {
      for (const h of f) {
        g.assign[h] = b;
      }
    }
  });
}
function Rj(a) {
  const b = a.data.state, c = b.Wa, d = b.Va;
  b.Rb = "";
  b.Wa = "";
  b.Va = null;
  (c || d) && aj(a, e => {
    c && delete e.folders[c];
    if (d) {
      for (const f of d) {
        delete e.assign[f];
      }
    }
  });
}
function Sj(a) {
  const b = a.data.state, c = b.ba, d = b.yb;
  aj(a, e => {
    for (const f in d) {
      d[f] && delete e.folders[f];
    }
    for (const f in c) {
      c[f] && e.assign[f] && delete e.assign[f];
    }
  });
  b.ba = {};
  b.yb = {};
}
function Tj(a, b) {
  const c = a.data.state.A;
  c.pinned = c.pinned === b ? "" : b;
  a.l.refresh();
}
function Uj(a, b) {
  b.preventDefault();
  const c = a.data.state.A, d = b.clientY, e = c.splitH, f = document.getElementById("gallery-pane-bot-" + a.l.sa.v.key), g = f && f.parentElement ? Math.max(80, f.parentElement.clientHeight - 80) : 600, h = m => {
    f && (f.style.height = Math.min(g, Math.max(60, e + (d - m.clientY))) + "px");
  }, k = m => {
    c.splitH = Math.min(g, Math.max(60, e + (d - m.clientY)));
    document.removeEventListener("mousemove", h);
    document.removeEventListener("mouseup", k);
    a.l.refresh();
  };
  document.addEventListener("mousemove", h);
  document.addEventListener("mouseup", k);
}
function Vj(a, b, c) {
  aj(a, d => {
    const e = c.trim();
    e && e !== b ? d.names[b] = e : delete d.names[b];
  });
}
function Wj(a) {
  a = a.data.state;
  if (!a.Ha || !a.aa) {
    return null;
  }
  const b = a.Ha;
  return {$f:(b.assign || {})[a.aa.cd + "/" + a.aa.fileName] || "", Vh:b.categories || []};
}
function Xj(a, b) {
  const c = a.data.state;
  if (c.aa) {
    var d = c.aa.cd + "/" + c.aa.fileName;
    aj(a, e => {
      Pi(e, d, b || "__unclassified__");
    });
  }
}
function Yj(a, b) {
  b = b.currentTarget;
  const c = b.value.trim(), d = a.data.state;
  if (c && d.aa) {
    b.value = "";
    var e = d.aa.cd + "/" + d.aa.fileName;
    aj(a, f => {
      const g = Mi(f, "__all__", c);
      Pi(f, e, g);
    });
  }
}
function Zj(a, b, c) {
  b = b.currentTarget;
  const d = a.data.state;
  c ? (d.Id = b.scrollTop, d.Ke = b.clientHeight) : (d.pa = b.scrollTop, d.Jd = b.clientHeight, a.u.cc = -1, Cj(a));
  a.u.ef || (a.u.ef = requestAnimationFrame(() => {
    a.u.ef = 0;
    a.l.refresh();
  }));
}
;class ak {
  constructor(a, b, c) {
    this.kind = 1;
    this.g = a;
    this.h = b;
    this.data = c;
  }
}
var bk = null;
const ck = {};
function dk(a, b, c) {
  return a === c ? n("option", {value:a, selected:!0}, b) : n("option", {value:a}, b);
}
function ek(a, b) {
  const c = a.data.state, d = c.folders[b.ca], e = b.ca;
  b = b.count;
  return n("div", {lid:"fh-" + e, draggable:"true", onDragStart:() => {
    c.Wa = d.name;
  }, onDragEnd:() => {
    c.Wa = "";
  }, onClick:() => {
    const f = a.data.state, g = a.u.layout;
    let h = 0;
    if (g) {
      for (var k of g.rows) {
        if (k.type === 0 && k.ca === e) {
          h = k.y;
          break;
        }
      }
    }
    f.folders[e].open = !f.folders[e].open;
    a.u.layout = null;
    k = document.getElementById("gallery-vscroll-" + a.l.sa.v.key);
    const m = Dj(a, k ? k.clientWidth : f.Hd || 200, Ej(a));
    let l = 0;
    for (const p of m.rows) {
      if (p.type === 0 && p.ca === e) {
        l = p.y;
        break;
      }
    }
    g && h < f.pa && (f.pa += l - h, k && (k.scrollTop = f.pa));
    Cj(a);
    a.l.refresh();
  }, style:{display:"flex", alignItems:"center", gap:"4px", padding:"3px 4px", cursor:"pointer", fontSize:c.A.folderFontSize + "px", color:"#ccc", backgroundColor:"#2a2a2a", borderRadius:"2px", userSelect:"none", marginBottom:"2px"}}, n("span", {style:{color:"#888", fontSize:"10px", width:"10px"}}, d.open ? "\u25be" : "\u25b8"), n("input", {lid:"nm", value:bj(a, d.name), title:d.name, onChange:f => Vj(a, d.name, f.currentTarget.value), onMouseDown:f => f.stopPropagation(), onClick:f => f.stopPropagation(), 
  style:{background:"transparent", border:"1px solid transparent", color:"#ccc", fontSize:c.A.folderFontSize + "px", flex:"1", minWidth:"0", outline:"none", padding:"0 2px"}}), n("span", {style:{color:"#666", fontSize:"10px"}}, String(b)));
}
function fk(a, b, c, d, e, f) {
  const g = b.url, h = !!g;
  return n("div", {lid:"gt-" + b.name, draggable:h ? "true" : "false", onDragStart:k => {
    if (b.url) {
      var m = k.currentTarget.querySelector("img");
      if (m) {
        var l = m.getBoundingClientRect();
        m = Math.max(0, Math.min(l.width, k.clientX - l.left));
        var p = Math.max(0, Math.min(l.height, k.clientY - l.top));
        l = {url:b.url, w:l.width, ja:l.height};
        k.dataTransfer.setData("application/x-ploft", JSON.stringify(l));
        k.dataTransfer.effectAllowed = "copy";
        bk = new ak(m, p, l);
        var r = a.data.state;
        k = T(d, b);
        r.Va = r.ba[k] ? Object.keys(r.ba).filter(q => r.ba[q]) : [k];
      } else {
        k.preventDefault();
      }
    } else {
      k.preventDefault(), zj(a, d, b);
    }
  }, onDragEnd:() => {
    bk = null;
    a.data.state.Va = null;
  }, onClick:k => {
    a: {
      var m = a.data.state;
      const p = T(d, b);
      if (k.shiftKey && m.mc && m.mc.substring(0, m.mc.lastIndexOf("/")) === d.name) {
        const r = m.mc.substring(m.mc.lastIndexOf("/") + 1);
        var l = -1;
        for (let q = 0; q < d.files.length; q++) {
          if (d.files[q].name === r) {
            l = q;
            break;
          }
        }
        if (l >= 0) {
          k.ctrlKey || (m.ba = {});
          k = Math.min(l, f);
          for (l = Math.max(l, f); k <= l; k++) {
            m.ba[T(d, d.files[k])] = !0;
          }
          a.l.refresh();
          m = void 0;
          break a;
        }
      }
      k.ctrlKey ? m.ba[p] ? delete m.ba[p] : m.ba[p] = !0 : (m.ba = {}, m.ba[p] = !0);
      m.mc = p;
      a.l.refresh();
      m = void 0;
    }
    return m;
  }, onContextMenu:k => {
    k.preventDefault();
    k.stopPropagation();
    Ij(a, k, d, b);
  }, style:{display:"flex", flexDirection:"column", alignItems:"center", cursor:h ? "grab" : "default"}}, n("div", {style:{width:c + "px", height:c + "px", backgroundColor:a.data.state.A.thumbBg, border:e ? "2px solid #4a9eff" : "1px solid #444", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden"}}, g ? n("img", {src:g, style:{maxWidth:"100%", maxHeight:"100%", objectFit:"contain"}}) : n("span", {style:{fontSize:"10px", color:"#555", fontFamily:"monospace"}}, 
  "\u2026")), n("span", {style:{fontSize:a.data.state.A.fileFontSize + "px", color:"#888", maxWidth:c + "px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", textAlign:"center", marginTop:"2px"}}, b.name.replace(/\.svg$/i, "")));
}
const gk = {display:"flex", alignItems:"center", gap:"4px", height:"22px", whiteSpace:"nowrap"}, hk = {width:"14px", textAlign:"center", cursor:"pointer", color:"#888", fontSize:"10px", flexShrink:"0"}, ik = {color:"#888", fontSize:"10px", flexShrink:"0"}, jk = {width:"14px", textAlign:"center", cursor:"pointer", color:"#a66", fontSize:"11px", flexShrink:"0"};
function kk(a) {
  const b = a.data.state, c = ej(a), d = Vi(a).length;
  return n("div", {lid:"ct", style:{...gk, borderBottom:"1px solid #333"}}, n("span", {onClick:() => {
    b.Qb = !b.Qb;
    a.l.refresh();
  }, style:{...hk, color:"#6af", width:"auto"}}, b.Qb ? "[\u2212]" : "[+]"), n("span", {onClick:() => {
    b.Qb = !b.Qb;
    a.l.refresh();
  }, style:{color:"#7fd1e0", fontSize:"11px", fontWeight:"bold", letterSpacing:"0.3px", cursor:"pointer"}}, "CLASSIFICAR"), n("span", {style:ik}, "(" + d + ")"), c ? n("button", {onClick:() => Sj(a), style:{...Gi, marginLeft:"auto", background:"#5a2a2a", color:"#f0c0c0"}}, "remover classificacao (" + c + ")") : null, n("button", {onClick:() => Mj(a), title:"novo classificador", style:{...Gi, marginLeft:c ? "0" : "auto"}}, "+"));
}
function lk(a, b) {
  const c = a.data.state;
  return n("div", {lid:"c-" + b.catId, draggable:"true", onDragStart:() => {
    c.Rb = b.catId;
  }, onDragEnd:() => {
    c.Rb = "";
  }, onDragOver:d => {
    (c.Wa || c.Va && c.Va.length || c.Rb && c.Rb !== b.catId) && d.preventDefault();
  }, onDrop:d => {
    d.preventDefault();
    Qj(a, b.catId);
  }, style:{...gk, marginLeft:b.depth * 14 + "px"}}, n("span", {style:hk, onClick:() => Pj(a, b.catId)}, b.open ? "\u2212" : "+"), n("input", {value:b.name, onChange:d => Nj(a, b.catId, d.currentTarget.value), onMouseDown:d => d.stopPropagation(), style:{background:"transparent", border:"1px solid transparent", color:"#7fd1e0", fontWeight:"bold", fontSize:"11px", flex:"1", minWidth:"0", outline:"none", padding:"1px 3px"}}), n("span", {style:ik}, "(" + b.count + ")"), n("span", {title:c.A.pinned === 
  b.catId ? "desfixar" : "fixar embaixo", onClick:() => Tj(a, b.catId), style:{cursor:"pointer", fontSize:"10px", flexShrink:"0", opacity:c.A.pinned === b.catId ? "1" : "0.35"}}, "\ud83d\udccc"), n("span", {title:"apagar classificador", style:jk, onClick:() => Oj(a, b.catId)}, "\u00d7"));
}
function mk(a, b) {
  const c = a.data.state, d = b.xa.slice(-7) === "|*files";
  return n("div", {lid:"g-" + b.xa, draggable:d ? "false" : "true", onDragStart:d ? null : () => {
    c.Wa = b.name;
  }, onDragEnd:d ? null : () => {
    c.Wa = "";
  }, style:{...gk, marginLeft:b.depth * 14 + "px", background:!d && c.yb[b.name] ? "#2d3a44" : "transparent"}}, n("span", {style:hk, onClick:() => {
    var e = b.xa;
    const f = a.data.state;
    f.xb[e] = !f.xb[e];
    a.l.refresh();
  }}, b.open ? "\u2212" : "+"), d ? n("span", {style:{color:"#aac", fontSize:"11px", flex:"1"}}, "(arquivos)") : n("span", {lid:"ic", onClick:() => {
    var e = b.name;
    const f = a.data.state;
    f.yb[e] ? delete f.yb[e] : f.yb[e] = !0;
    a.l.refresh();
  }, title:"selecionar (p/ remover classificacao)", style:{cursor:"pointer", fontSize:"11px", flexShrink:"0"}}, "\ud83d\udcc1"), d ? null : n("input", {lid:"nm", value:bj(a, b.name), title:b.name, onChange:e => Vj(a, b.name, e.currentTarget.value), onMouseDown:e => e.stopPropagation(), style:{background:"transparent", border:"1px solid transparent", color:"#cba", fontSize:"11px", flex:"1", minWidth:"0", outline:"none", padding:"1px 3px"}}), n("span", {style:ik}, String(b.count)));
}
function nk(a, b) {
  const c = a.data.state;
  return n("div", {lid:"uh", onDragOver:d => {
    (c.Wa || c.Va && c.Va.length) && d.preventDefault();
  }, onDrop:d => {
    d.preventDefault();
    Rj(a);
  }, style:{...gk, borderBottom:"1px solid #333", marginTop:"4px"}}, n("span", {style:{...hk, color:"#6af", width:"auto"}, onClick:() => {
    c.Sb = !c.Sb;
    a.l.refresh();
  }}, c.Sb ? "[\u2212]" : "[+]"), n("span", {onClick:() => {
    c.Sb = !c.Sb;
    a.l.refresh();
  }, style:{color:"#999", fontSize:"11px", fontWeight:"bold", letterSpacing:"0.3px", cursor:"pointer"}}, "(nao classificado)"), n("span", {style:ik}, "(" + b.count + ")"), n("span", {title:c.A.pinned === "*unclass" ? "desfixar" : "fixar embaixo", onClick:() => Tj(a, "*unclass"), style:{cursor:"pointer", fontSize:"10px", marginLeft:"auto", opacity:c.A.pinned === "*unclass" ? "1" : "0.35"}}, "\ud83d\udccc"));
}
function ok(a) {
  if (!a.data.state.aa) {
    return null;
  }
  const b = Wj(a);
  return b ? n("div", {style:{display:"flex", gap:"4px", alignItems:"center", padding:"4px 6px", borderBottom:"1px solid #444", flexShrink:"0"}}, n("span", {style:{fontSize:"10px", color:"#888", flexShrink:"0"}}, "cat:"), n("select", {onChange:c => Xj(a, c.currentTarget.value), style:{...Rh, flex:"1", width:"auto"}}, dk("", "(sem categoria)", b.$f), b.Vh.map(c => dk(c.id, c.name, b.$f))), n("input", {placeholder:"nova...", onChange:c => Yj(a, c), style:{...Qh, width:"70px", flexShrink:"0"}})) : null;
}
function pk(a) {
  const b = a.data.state, c = b.A.toolbarMode, d = c !== "bg";
  let e = 40, f = 200, g = b.A.thumbSize, h = b.A.thumbSize + "px";
  c === "gap" ? (e = 0, f = 24, g = b.A.thumbGap, h = b.A.thumbGap + "px") : c === "folder" ? (e = 6, f = 20, g = b.A.folderFontSize, h = b.A.folderFontSize + "px") : c === "file" && (e = 6, f = 16, g = b.A.fileFontSize, h = b.A.fileFontSize + "px");
  return n("div", {style:Fi}, n("div", {onClick:() => Hj(a), style:{...Ei, padding:"2px 6px", fontSize:"11px", whiteSpace:"nowrap"}}, "\ud83d\udcc2"), n("select", {onChange:k => {
    a.data.state.A.toolbarMode = k.target.value;
    a.l.refresh();
  }, style:{...Rh, width:"62px"}}, dk("size", "image", c), dk("gap", "spacing", c), dk("folder", "folder", c), dk("file", "file", c), dk("bg", "bg color", c)), d ? n("input", {type:"range", min:String(e), max:String(f), value:String(g), onInput:k => {
    const m = a.data.state, l = document.getElementById("gallery-vscroll-" + a.l.sa.v.key);
    var p = null;
    let r = 0;
    if (a.u.layout && l) {
      var q = a.u.layout;
      for (const t of q.rows) {
        if (t.type === 1 && !t.xa && t.y + t.ja > m.pa) {
          p = m.folders[t.ca];
          p = T(p, p.files[q.ve[t.ca][t.eb]]);
          r = t.y - m.pa;
          break;
        }
      }
    }
    k = parseInt(k.target.value, 10);
    m.A.toolbarMode === "size" ? m.A.thumbSize = k : m.A.toolbarMode === "gap" ? m.A.thumbGap = k : m.A.toolbarMode === "folder" ? m.A.folderFontSize = k : m.A.toolbarMode === "file" && (m.A.fileFontSize = k);
    a.u.layout = null;
    if (p && l) {
      k = Dj(a, l.clientWidth, Ej(a));
      for (var v of k.rows) {
        if (v.type === 1 && !v.xa && (q = m.folders[v.ca], T(q, q.files[k.ve[v.ca][v.eb]]) === p)) {
          v = Math.max(0, v.y - r);
          m.pa = v;
          l.scrollTop = v;
          break;
        }
      }
    }
    a.l.refresh();
  }, style:{flex:"1", height:"14px", cursor:"pointer"}}) : null, d ? n("span", {style:{fontSize:"10px", color:"#888", minWidth:"28px"}}, h) : null, d ? null : n("input", {type:"color", value:b.A.thumbBg, onInput:k => {
    a.data.state.A.thumbBg = k.target.value;
    a.l.refresh();
  }, style:{flex:"1", height:"24px", border:"none", cursor:"pointer"}}), n("div", {onClick:() => {
    const k = a.data.state, m = !Gj(a);
    for (const l of k.folders) {
      l.open = m;
    }
    for (const l of Fj(a)) {
      k.xb[l] = m;
    }
    a.u.layout = null;
    Cj(a);
    a.l.refresh();
  }, title:b.folders.length && Gj(a) ? "Close all" : "Open all", style:Ei}, b.folders.length && Gj(a) ? "\u25b8\u25b8" : "\u25be\u25be"));
}
function qk(a, b, c) {
  switch(b.type) {
    case 2:
      return kk(a);
    case 3:
      return lk(a, b);
    case 4:
      return mk(a, b);
    case 5:
      return nk(a, b);
    case 0:
      return ek(a, b);
    case 1:
      if (b.xa) {
        var d = a.data.state, e = d.A.thumbSize, f = c.lg[b.xa];
        c = [];
        for (var g = b.eb; g < b.Xb; g++) {
          var h = f[g], k = d.folders[h.f];
          const m = k.files[h.Zb];
          ij(k, m);
          m.url || zj(a, k, m);
          c.push(fk(a, m, e, k, !!d.ba[T(k, m)], h.Zb));
        }
        a = n("div", {lid:"gc-" + b.xa + "-" + b.gf, style:{display:"grid", gridTemplateColumns:"repeat(" + (b.Xb - b.eb) + ", " + e + "px)", gap:d.A.thumbGap + "px", paddingLeft:(b.depth + 1) * 14 + "px"}}, c);
      } else {
        d = a.data.state;
        e = d.folders[b.ca];
        f = d.A.thumbSize;
        c = c.ve[b.ca];
        g = [];
        for (h = b.eb; h < b.Xb; h++) {
          k = e.files[c[h]], ij(e, k), k.url || zj(a, e, k), g.push(fk(a, k, f, e, !!d.ba[T(e, k)], c[h]));
        }
        a = n("div", {lid:"gr-" + b.ca + "-" + b.gf, style:{display:"grid", gridTemplateColumns:"repeat(" + (b.Xb - b.eb) + ", " + f + "px)", gap:d.A.thumbGap + "px", justifyContent:"center"}}, g);
      }
      return a;
  }
  return null;
}
function rk(a) {
  const b = a.data.state.aa;
  if (!b) {
    return null;
  }
  const c = b.pinned, d = b.cd + "/" + b.fileName, e = n("div", {id:"gallery-ctx-menu", style:{position:"fixed", left:b.x + "px", top:b.y + "px", width:b.w + "px", height:b.ja + "px", backgroundColor:"#1e1e1e", border:"1px solid #555", borderRadius:"4px", boxShadow:"0 4px 12px rgba(0,0,0,0.5)", zIndex:"9999", display:"flex", flexDirection:"column", overflow:"hidden"}}, n("div", {style:{display:"flex", alignItems:"center", padding:"4px 6px", borderBottom:"1px solid #444", cursor:c ? "move" : "default", 
  flexShrink:"0"}, onMouseDown:c ? f => Kj(a, f) : null}, n("span", {onClick:() => {
    const f = a.data.state.aa;
    f && (f.pinned = !f.pinned, a.l.refresh());
  }, style:{cursor:"pointer", fontSize:"12px", opacity:c ? 1 : 0.4}, title:c ? "Unpin" : "Pin"}, "\ud83d\udccc"), n("span", {style:{flex:"1", marginLeft:"6px", fontSize:"11px", color:"#ccc", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}, d), n("span", {onClick:() => Jj(a), style:{cursor:"pointer", fontSize:"14px", color:"#888", paddingLeft:"8px"}}, "\u2715")), n("div", {style:{padding:"4px 6px", borderBottom:"1px solid #444", flexShrink:"0", display:"flex", gap:"4px"}}, n("button", 
  {onClick:() => {
    navigator.clipboard.writeText(d);
  }, style:Gi}, "Copy Name"), n("button", {onClick:() => {
    b.hc && navigator.clipboard.writeText(b.hc);
  }, style:Gi}, "Copy Text"), n("button", {onClick:() => {
    const f = a.data.state.aa;
    if (f && f.hc) {
      let h = f.hc.replace(/>\s+</g, "><").trim();
      const k = [];
      let m = 0;
      const l = /(<\/[^>]+>|<[^>]*\/\s*>|<[^>]+>|[^<]+)/g;
      for (var g; (g = l.exec(h)) !== null;) {
        g = g[1], g.charAt(0) !== "<" ? k.push("  ".repeat(m) + g.trim()) : g.substring(0, 2) === "</" ? (m = Math.max(0, m - 1), k.push("  ".repeat(m) + g)) : g.charAt(g.length - 2) === "/" || g.substring(0, 4) === "\x3c!--" ? k.push("  ".repeat(m) + g) : (k.push("  ".repeat(m) + g), m++);
      }
      f.hc = k.join("\n");
      a.l.refresh();
    }
  }, style:Gi}, "Parse")), ok(a), n("pre", {style:Ii}, b.hc || "Loading..."), n("div", {onMouseDown:f => Lj(a, f), style:{position:"absolute", right:"0", bottom:"0", width:"8px", height:"8px", cursor:"nwse-resize", background:"linear-gradient(135deg, transparent 50%, #888 50%)"}}));
  return c ? e : n("div", null, n("div", {onClick:() => Jj(a), onContextMenu:f => {
    f.preventDefault();
    Jj(a);
  }, style:{position:"fixed", top:"0", left:"0", right:"0", bottom:"0", zIndex:"9998"}}), e);
}
;function sk(a, b, c, d, e, f) {
  const g = a.data.state;
  var h = Math.max(0, b.Wg - d);
  c > h && (c = h, e && (e.scrollTop = h));
  d = c + d + 200;
  var k;
  e = b.rows;
  h = 0;
  for (var m = e.length; h < m;) {
    var l = h + m >>> 1;
    e[l].y + e[l].ja <= Math.max(0, c - 200) ? h = l + 1 : m = l;
  }
  for (e = k = h; e < b.rows.length && b.rows[e].y < d;) {
    e++;
  }
  d = e;
  e = b.rows;
  h = k > 0 ? e[k].y : 0;
  m = d > 0 ? e[d - 1] : null;
  m = Math.max(0, b.Wg - (m ? m.y + m.ja : 0));
  for (l = []; k < d; k++) {
    const v = e[k];
    if (v.type === 1) {
      if (v.xa) {
        var p = b.lg[v.xa];
        for (var r = v.eb; r < v.Xb; r++) {
          var q = g.folders[p[r].f];
          f.add(T(q, q.files[p[r].Zb]));
        }
      } else {
        for (p = g.folders[v.ca], r = b.ve[v.ca], q = v.eb; q < v.Xb; q++) {
          f.add(T(p, p.files[r[q]]));
        }
      }
    }
    l.push(qk(a, v, b));
  }
  return {$h:l, Vg:h, Kf:m, Nf:c};
}
class tk extends yi {
  constructor(a, b) {
    super(a);
    this.data = b;
    b.state.u || (b.state.u = {ub:new Map(), xd:new Set(), jd:0, sd:0, We:null, Rd:null, Ve:new Map(), Ca:0, cc:-1, ue:0, Ec:{}, wc:null, be:!1, layout:null, gi:"", ef:0, yd:null, Ze:null});
    this.u = b.state.u;
  }
  render() {
    const a = this.data.state;
    !a.If && a.Xa && Bj(this);
    return super.render();
  }
  g() {
    const a = this.data.state;
    var b = this.l.sa.v.key;
    const c = "gallery-vscroll-" + b;
    var d = "gallery-vscroll2-" + b;
    const e = "gallery-pane-bot-" + b;
    if (a.folders.length === 0) {
      return n("div", {style:{display:"flex", flexDirection:"column", height:"100%"}}, pk(this), n("div", {style:Hi}, "Click \ud83d\udcc2 to select a folder"));
    }
    var f = document.getElementById(c);
    f && (a.Hd = f.clientWidth, a.Jd = f.clientHeight, this.u.cc >= 0 ? (Math.abs(f.scrollTop - this.u.cc) > 1 && (f.scrollTop = this.u.cc), a.pa = this.u.cc, this.u.cc = -1) : a.pa = f.scrollTop);
    var g = document.getElementById(d);
    g && (a.Ke = g.clientHeight, a.Id = g.scrollTop);
    var h = a.Hd || 200;
    this.u.be && (this.u.be = !1, this.u.Ec.firstRenderStart = performance.now());
    const k = a.A.pinned;
    var m = "full";
    let l = "";
    k === "*unclass" ? (m = "unclass", l = "class") : k && (l = "pinned:" + k);
    b = new Set();
    this.u.yd = b;
    m = Dj(this, h, m);
    m = sk(this, m, a.pa, a.Jd || 400, f, b);
    a.pa = m.Nf;
    f || setTimeout(() => {
      const r = document.getElementById(c);
      r && (a.Hd = r.clientWidth, a.Jd = r.clientHeight, this.u.layout = null, this.l.refresh());
    }, 0);
    const p = (r, q, v) => n("div", {lid:"vp-" + q, id:q, className:"sidebar-scroll", jj:t => Zj(this, t, v), style:{flex:"1", overflowY:"auto"}}, r.Vg > 0 ? n("div", {lid:"vs-top", style:{height:r.Vg + "px"}}) : null, r.$h, r.Kf > 0 ? n("div", {lid:"vs-bot", style:{height:r.Kf + "px"}}) : null);
    f = n("div", {lid:"gallery-split", className:"section-sash", onMouseDown:r => Uj(this, r), style:{height:"4px", cursor:"ns-resize", flexShrink:"0", borderTop:"1px solid #444"}});
    l ? (h = Dj(this, h, l), h = sk(this, h, a.Id, a.Ke || a.A.splitH, g, b), a.Id = h.Nf, g = k === "*unclass" ? p(h, d, !0) : p(m, c, !1), d = k === "*unclass" ? p(m, c, !1) : p(h, d, !0), d = n("div", {lid:"panes", style:{flex:"1", minHeight:"0", display:"flex", flexDirection:"column"}}, g, f, n("div", {lid:"pane-bot", id:e, style:{height:a.A.splitH + "px", flexShrink:"0", display:"flex", flexDirection:"column"}}, d))) : d = n("div", {lid:"panes", style:{flex:"1", minHeight:"0", display:"flex", 
    flexDirection:"column"}}, p(m, c, !1));
    Aj(this, b);
    return n("div", {style:{display:"flex", flexDirection:"column", height:"100%"}}, pk(this), d, rk(this));
  }
}
;const uk = {1:"x y radius startAngle endAngle ccw".split(" "), 2:["x1", "y1", "x2", "y2", "radius"], 3:"cp1x cp1y cp2x cp2y x y".split(" "), 5:"x y radiusX radiusY rotation startAngle endAngle ccw".split(" "), 6:["x", "y"], 7:["x", "y"], 8:["cpx", "cpy", "x", "y"], 9:["x", "y", "w", "h"], 10:["x", "y", "w", "h"], 12:["x", "y", "w", "h"], 13:["x", "y", "w", "h"], 14:["x", "y", "w", "h"], 17:["angle"], 18:["x", "y"], 19:"abcdef".split(""), 20:"abcdef".split(""), 21:["x", "y"], 23:["fillRule"], 24:["fillRule"], 
28:["cap"], 29:["offset"], 30:["join"], 31:["width"], 32:["limit"], 35:["img", "dx", "dy", "dw", "dh"], 50:["alpha"], 55:["blur"], 57:["x"], 58:["y"], 59:["x", "y", "maxWidth"], 61:["x", "y", "maxWidth"], 150:["segment"], 151:["layer"]}, vk = {1:"arc", 2:"arcTo", 3:"bezierCurveTo", 4:"closePath", 5:"ellipse", 6:"lineTo", 7:"moveTo", 8:"quadraticCurveTo", 9:"rect", 10:"roundRect", 11:"addPath", 12:"clearRect", 13:"fillRect", 14:"strokeRect", 16:"resetTransform", 17:"rotate", 18:"scale", 19:"setTransform", 
20:"transform", 21:"translate", 22:"beginPath", 23:"clip", 24:"fill", 27:"stroke", 28:"lineCap", 29:"lineDashOffset", 30:"lineJoin", 31:"lineWidth", 32:"miterLimit", 33:"getLineDash", 34:"setLineDash", 35:"drawImage", 40:"reset", 41:"restore", 42:"save", 43:"fillStyle", 44:"strokeStyle", 50:"globalAlpha", 51:"globalCompositeOperation", 55:"shadowBlur", 56:"shadowColor", 57:"shadowOffsetX", 58:"shadowOffsetY", 59:"fillText", 61:"strokeText", 63:"font", 68:"textAlign", 69:"textBaseline", 80:"paint", 
150:"segment", 151:"targetLayer", 153:"scope_push", 154:"scope_pop", 155:"scope_reset"}, wk = {[0]:"draw", [1]:"def_begin", [2]:"def_end", [3]:"exec_begin", [4]:"exec_end", [5]:"draw_after", [6]:"group_start", [7]:"group_end", [8]:"el_next", [10]:"webgl_start", [11]:"webgl_finish", [12]:"webgl_dirty", [13]:"webgl_delete"};
function xk(a) {
  return "#" + (16777216 | (a >>> 24 & 255) << 16 | (a >>> 16 & 255) << 8 | a >>> 8 & 255).toString(16).slice(1);
}
;function yk(a, b, c) {
  (c = c.currentTarget.value.trim()) ? (c = dh(a.node.G, a.data.ia, b, c), c.error ? a.hb = {ti:b, msg:c.error} : (a.hb = null, a.Qc = -1)) : (a.hb = null, a.Qc = -1);
  a.refresh();
}
function zk(a, b, c) {
  const d = a.data.entries;
  !d || b < 0 || b >= d.length || (dh(a.node.G, b, 0, c), d[b].h[0] = c, a.refresh());
}
function Ak(a, b) {
  dh(a.node.G, a.data.ia, 0, b);
  a.data.entry.h[0] = b;
  a.refresh();
}
function Bk(a, b, c, d, e) {
  c ? (eh(a.node.G, d), a.data.he && d < a.data.ia && (a.data.he.ia = a.data.ia - 1)) : (c = fh(a.node.G, a.data.ia), b === 43 ? c.R.fillStyle = e : b === 44 ? c.R.strokeStyle = e : b === 31 && (c.R.lineWidth = e), c.end(), a.data.he && (a.data.he.ia = a.data.ia + 1));
  a.data.refresh();
}
function Ck(a, b, c) {
  const d = a.data.entries;
  !d || b < 0 || b >= d.length || zk(a, b, parseInt(c.target.value.slice(1), 16) << 8 | (d[b].h[0] | 0) & 255);
}
function Dk(a, b, c) {
  const d = c.currentTarget, e = k => {
    const m = d.getBoundingClientRect();
    return Math.round(Math.max(0, Math.min(1, (k - m.left) / m.width)) * 255);
  }, f = k => {
    const m = a.data.entries;
    !m || b < 0 || b >= m.length || zk(a, b, (m[b].h[0] | 0) & -256 | k);
  };
  f(e(c.clientX));
  const g = k => {
    f(e(k.clientX));
  }, h = () => {
    document.removeEventListener("mousemove", g);
    document.removeEventListener("mouseup", h);
  };
  document.addEventListener("mousemove", g);
  document.addEventListener("mouseup", h);
}
function Ek(a, b, c) {
  const d = Math.pow(10, Math.min(a.Ce, 2)), e = c.currentTarget, f = a.De, g = m => {
    const l = e.getBoundingClientRect();
    return Math.round(Math.max(0, Math.min(1, (m - l.left) / l.width)) * f * d) / d;
  };
  (m => {
    zk(a, b, m);
  })(g(c.clientX));
  const h = m => {
    m = g(m.clientX);
    zk(a, b, m);
  }, k = () => {
    document.removeEventListener("mousemove", h);
    document.removeEventListener("mouseup", k);
  };
  document.addEventListener("mousemove", h);
  document.addEventListener("mouseup", k);
}
function Fk(a, b) {
  const c = b.currentTarget;
  a.Oh = c;
  const d = h => {
    const k = c.getBoundingClientRect();
    return Math.round(Math.max(0, Math.min(1, (h - k.left) / k.width)) * 255);
  }, e = h => {
    Ak(a, (a.data.entry.h[0] | 0) & -256 | h);
  };
  e(d(b.clientX));
  const f = h => {
    e(d(h.clientX));
  }, g = () => {
    document.removeEventListener("mousemove", f);
    document.removeEventListener("mouseup", g);
  };
  document.addEventListener("mousemove", f);
  document.addEventListener("mouseup", g);
}
;function Gk(a, b) {
  return n("div", {onClick:c => {
    c.stopPropagation();
    b();
  }, style:{width:"12px", height:"12px", border:"1px solid #888", borderRadius:"2px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:"0"}}, a ? n("div", {style:{width:"6px", height:"6px", backgroundColor:"#6af"}}) : null);
}
function Hk(a, b, c) {
  const d = xk(c);
  c = Math.round((c & 255) / 255 * 100) + "%";
  return n("div", {onMouseDown:e => Dk(a, b, e), style:{position:"relative", width:"50px", height:"10px", cursor:"pointer", userSelect:"none"}}, n("div", {style:{position:"absolute", top:"0", left:"0", width:"100%", height:"100%", backgroundColor:"#444", borderRadius:"2px"}}), n("div", {style:{position:"absolute", top:"0", left:"0", height:"100%", width:c, backgroundColor:d, borderRadius:"2px"}}), n("div", {style:{position:"absolute", pointerEvents:"none", left:c, top:"0", height:"100%", width:"2px", 
  backgroundColor:"#fff", transform:"translateX(-1px)"}}));
}
function Ik(a, b, c) {
  var d = a.De = gb(c);
  d = Math.max(0, Math.min(1, c / d)) * 100 + "%";
  return n("div", {style:{display:"flex", alignItems:"center", gap:"4px"}}, n("div", {onMouseDown:e => Ek(a, b, e), style:{position:"relative", width:"60px", height:"12px", cursor:"pointer", userSelect:"none"}}, n("div", {style:{position:"absolute", top:"0", left:"0", width:"100%", height:"100%", backgroundColor:"#444", clipPath:"polygon(0% 100%, 100% 0%, 100% 100%)"}}), n("div", {style:{position:"absolute", top:"0", left:"0", overflow:"hidden", height:"100%", width:d}}, n("div", {style:{width:"60px", 
  height:"100%", backgroundColor:"#6af", clipPath:"polygon(0% 100%, 100% 0%, 100% 100%)"}})), n("div", {style:{position:"absolute", pointerEvents:"none", left:d, top:"0", height:"100%", width:"2px", backgroundColor:"#fff", transform:"translateX(-1px)"}})), n("input", {type:"text", value:c.toFixed(a.Ce), onInput:e => {
    e = e.target.value.trim();
    if (e !== "" && !e.endsWith(".")) {
      var f = e.indexOf(".");
      a.Ce = f < 0 ? 0 : e.length - f - 1;
      e = parseFloat(e);
      !isNaN(e) && e >= 0 && (a.De = gb(e), zk(a, b, e));
    }
  }, onKeyDown:e => e.stopPropagation(), style:{width:"30px", height:"18px", backgroundColor:"#333", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", textAlign:"right", fontSize:"11px", padding:"0 2px"}}));
}
function Jk(a, b, c, d) {
  var e = a.data.entry.W;
  e = e ? e[d] : -1;
  var f = e >= 0;
  const g = f ? a.data.Pb[e] || "v" + String(e).padStart(2, "0") : null;
  e = {display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1px 6px", gap:"8px"};
  const h = {color:"#888", fontSize:"11px", fontFamily:"monospace", minWidth:"60px", flexShrink:"0"};
  if (a.Qc === d) {
    c = f ? g || "" : String(c);
    f = Object.assign({}, Qh, {width:"80px", textAlign:"right", fontSize:"11px"});
    var k = a.hb && a.hb.ti === d ? a.hb.msg : null;
    return n("div", {style:{padding:"1px 6px"}}, n("div", {style:e}, n("span", {style:h}, b), n("input", {type:"text", value:c, Ag:m => yk(a, d, m), onKeyDown:m => {
      m.stopPropagation();
      const l = m.key;
      l === "Enter" ? yk(a, d, m) : l === "Escape" && (a.Qc = -1, a.refresh());
    }, style:f})), k ? n("div", {style:{color:"#e55", fontSize:"10px", textAlign:"right"}}, k) : null);
  }
  k = {color:f ? "#4ec9b0" : "#ccc", fontSize:"11px", fontFamily:"monospace", cursor:"pointer", textAlign:"right", padding:"1px 4px", borderRadius:"2px", minWidth:"50px"};
  c = f ? g : Number.isInteger(c) ? String(c) : c.toFixed(2);
  return n("div", {style:e}, n("span", {style:h}, b), n("span", {onClick:() => {
    a.hb = null;
    a.Qc = d;
    a.refresh();
  }, style:k}, c));
}
function Kk(a, b) {
  b |= 0;
  const c = Object.entries(wk).map(([d, e]) => [e, Number(d)]);
  return n("div", {style:{padding:"2px 0"}}, n("div", {style:{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1px 6px", gap:"8px"}}, n("span", {style:{color:"#888", fontSize:"11px", fontFamily:"monospace", minWidth:"60px", flexShrink:"0"}}, "segment"), n("select", {value:String(b), onChange:d => {
    d = Number(d.target.value);
    dh(a.node.G, a.data.ia, 0, d);
    a.data.entry.h[0] = d;
    a.refresh();
  }, style:{backgroundColor:"#2a2a2a", color:"#ccc", border:"1px solid #555", borderRadius:"2px", fontSize:"11px", fontFamily:"monospace", padding:"1px 4px", cursor:"pointer"}}, c.map(([d, e]) => n("option", {lid:e, value:String(e)}, d)))));
}
function Lk(a, b) {
  const c = xk(b);
  b &= 255;
  const d = Math.round(b / 255 * 100) + "%";
  return n("div", {style:{display:"flex", alignItems:"center", gap:"6px", padding:"3px 6px"}}, n("span", {style:{fontSize:"10px", minWidth:"20px", textAlign:"right", color:"#aaa"}}, Math.round(b / 255 * 100)), n("div", {onMouseDown:e => Fk(a, e), style:{position:"relative", width:"50px", height:"10px", cursor:"pointer", userSelect:"none"}}, n("div", {style:{position:"absolute", top:"0", left:"0", width:"100%", height:"100%", backgroundColor:"#444", borderRadius:"2px"}}), n("div", {style:{position:"absolute", 
  top:"0", left:"0", height:"100%", width:d, backgroundColor:c, borderRadius:"2px"}}), n("div", {style:{position:"absolute", pointerEvents:"none", left:d, top:"0", height:"100%", width:"2px", backgroundColor:"#fff", transform:"translateX(-1px)"}})), n("input", {type:"color", value:c, onInput:e => {
    Ak(a, parseInt(e.target.value.slice(1), 16) << 8 | (a.data.entry.h[0] | 0) & 255);
  }, style:{width:"32px", height:"20px", border:"none", cursor:"pointer"}}));
}
;class Mk extends Mc {
  constructor(a) {
    super();
    this.data = a;
    this.node = a.node;
    this.Qc = -1;
    this.hb = this.Oh = null;
    this.De = 20;
    this.Ce = 1;
  }
  async render() {
    const a = this.data.entry;
    if (!a) {
      return n("div", null);
    }
    const b = uk[a.g] || [], c = Math.min(a.T, a.h.length), d = (a.H & 1) !== 0, e = a.g === 43 || a.g === 44, f = a.g === 24 || a.g === 13, g = a.g === 27 || a.g === 14;
    var h = f || g;
    let k = !1, m = -1, l = !1, p = -1, r = !1, q = -1;
    if (h && this.data.entries) {
      var v = this.data.entries, t = this.data.ia;
      for (--t; t >= 0; t--) {
        var x = v[t].g;
        if (x !== 43 && x !== 44 && x !== 31) {
          break;
        }
        x === 43 && f && !k && (k = !0, m = t);
        x === 44 && g && !l && (l = !0, p = t);
        x === 31 && g && !r && (r = !0, q = t);
      }
    }
    t = v = 255;
    x = 1.0;
    h && this.data.entries && (h = this.data.entries, k && m >= 0 && m < h.length && (v = h[m].h[0] | 0), l && p >= 0 && p < h.length && (t = h[p].h[0] | 0), r && q >= 0 && q < h.length && (x = h[q].h[0]));
    h = this.data.x;
    let A = this.data.y;
    const B = 80 + c * 22;
    h + 220 > window.innerWidth && (h = window.innerWidth - 220 - 8);
    A + B > window.innerHeight && (A = window.innerHeight - B - 8);
    h < 4 && (h = 4);
    A < 4 && (A = 4);
    h = {position:"fixed", left:h + "px", top:A + "px", backgroundColor:"#1e1e1e", border:"1px solid #555", borderRadius:"4px", padding:"4px 0", zIndex:"9999", fontFamily:"sans-serif", fontSize:"12px", color:"#e0e0e0", minWidth:"180px", maxWidth:"300px", boxShadow:"0 4px 12px rgba(0,0,0,0.5)"};
    return n("div", null, n("div", {onClick:() => this.data.md(), onContextMenu:F => {
      F.preventDefault();
      this.data.md();
    }, style:{position:"fixed", top:0, left:0, right:0, bottom:0, zIndex:"9998"}}), n("div", {style:h, onContextMenu:F => F.preventDefault()}, n("div", {style:{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"2px 6px 4px", borderBottom:"1px solid #444", marginBottom:"2px"}}, n("span", {style:{fontWeight:"bold", fontSize:"12px", color:d ? "#666" : "#8cf"}}, a.name), n("span", {onClick:() => this.data.md(), style:{cursor:"pointer", color:"#888", fontSize:"14px", padding:"0 4px", 
    lineHeight:"1"}}, "x")), n("div", {onClick:() => {
      this.hb = null;
      var F = this.node.G, I = this.data.ia;
      const z = F.h;
      var E = Og(z, F.g)[I];
      if (E && (I = R(z, F.g))) {
        E = E.Pe;
        var M = I.L[E - 1];
        M && M.g === 0 && M.m === 12 ? I.L.splice(E - 1, 1) : I.L.splice(E, 0, new y(0, -1, 12, [], -1));
        z.g.delete(F.g);
        Rg(z, F.g);
      }
      this.data.md();
    }, style:{display:"flex", alignItems:"center", gap:"6px", padding:"3px 6px", cursor:"pointer", fontSize:"11px"}}, n("div", {style:{width:"12px", height:"12px", border:"1px solid #888", borderRadius:"2px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:"0"}}, d ? n("div", {style:{width:"6px", height:"6px", backgroundColor:"#e93"}}) : null), n("span", {style:{color:d ? "#e93" : "#999"}}, "disabled")), f ? n("div", {style:{display:"flex", alignItems:"center", gap:"4px", 
    padding:"3px 6px"}}, Gk(k, () => Bk(this, 43, k, m, 255)), n("span", {style:{color:"#999", fontSize:"11px", minWidth:"26px"}}, "Fill"), n("div", {style:k ? {display:"flex", alignItems:"center", gap:"4px"} : {display:"flex", alignItems:"center", gap:"4px", opacity:"0.3", pointerEvents:"none"}}, n("span", {style:{fontSize:"10px", minWidth:"18px", textAlign:"right", color:"#aaa"}}, Math.round((v & 255) / 255 * 100)), Hk(this, m, v), n("input", {type:"color", value:xk(v), onInput:F => Ck(this, m, 
    F), style:{width:"24px", height:"16px", border:"none", cursor:"pointer", padding:"0"}}))) : null, g ? n("div", null, n("div", {style:{display:"flex", alignItems:"center", gap:"4px", padding:"3px 6px"}}, Gk(l, () => Bk(this, 44, l, p, 255)), n("span", {style:{color:"#999", fontSize:"11px", minWidth:"26px"}}, "Stroke"), n("div", {style:l ? {display:"flex", alignItems:"center", gap:"4px"} : {display:"flex", alignItems:"center", gap:"4px", opacity:"0.3", pointerEvents:"none"}}, n("span", {style:{fontSize:"10px", 
    minWidth:"18px", textAlign:"right", color:"#aaa"}}, Math.round((t & 255) / 255 * 100)), Hk(this, p, t), n("input", {type:"color", value:xk(t), onInput:F => Ck(this, p, F), style:{width:"24px", height:"16px", border:"none", cursor:"pointer", padding:"0"}}))), n("div", {style:{display:"flex", alignItems:"center", gap:"4px", padding:"3px 6px"}}, Gk(r, () => Bk(this, 31, r, q, 1.0)), n("span", {style:{color:"#999", fontSize:"11px", minWidth:"26px"}}, "Width"), n("div", {style:r ? {display:"flex", 
    alignItems:"center", gap:"4px"} : {display:"flex", alignItems:"center", gap:"4px", opacity:"0.3", pointerEvents:"none"}}, Ik(this, q, x)))) : null, e ? n("div", {style:{padding:"2px 0", opacity:d ? "0.5" : "1"}}, Lk(this, a.h.length > 0 ? a.h[0] | 0 : 255)) : a.g === 150 && c > 0 ? n("div", {style:{opacity:d ? "0.5" : "1"}}, Kk(this, a.h[0])) : c > 0 ? n("div", {style:{padding:"2px 0", opacity:d ? "0.5" : "1"}}, a.h.slice(0, c).map((F, I) => Jk(this, I < b.length ? b[I] : "[" + I + "]", F, I))) : 
    n("div", {style:{padding:"4px 6px", color:"#666", fontSize:"10px", fontStyle:"italic"}}, "sem parametros"), n("div", {style:{borderTop:"1px solid #444", marginTop:"2px", padding:"3px 6px"}}, n("span", {onClick:() => {
      this.hb = null;
      eh(this.node.G, this.data.ia);
      this.data.md();
    }, style:{cursor:"pointer", color:"#e55", fontSize:"11px", padding:"2px 8px", border:"1px solid #a33", borderRadius:"3px", backgroundColor:"transparent"}}, "Delete"))));
  }
}
;const Nk = {["e563103a-0e05-42f6-b28c-1431905b045b"]:"image_container"}, Ok = ["none", "selection", "rect", "ellipse", "line"], Pk = ["outline", "resize_h8", "focus"];
function Qk(a, b) {
  const c = a[b].depth, d = b + 1 + a[b].ga;
  let e = 0;
  for (b += 1; b < d; b++) {
    a[b].depth === c + 1 && e++;
  }
  return e;
}
function Rk(a, b, c, d) {
  b = b.displayMap;
  return b[a] ? b[a] : d || a === 0 || a === c ? {oa:!1, ma:!1, na:!1} : {oa:!0, ma:!0, na:!0};
}
function Sk(a, b, c) {
  for (let d = 0; d < b.length; d++) {
    const e = b[d];
    e.key >= 20000 && e.name && e.name !== String(e.key) && (c.Pb[a] || (c.Pb[a] = {}), c.Pb[a][e.key] || (c.Pb[a][e.key] = e.name));
  }
}
function Tk(a) {
  let b = 0;
  const c = /^Untitled (\d+)$/;
  for (let e = 0; e < a.length; e++) {
    var d = c.exec(a[e].name);
    d && (d = parseInt(d[1], 10), d > b && (b = d));
  }
  return "Untitled " + (b + 1);
}
;let Uk = null;
function Vk() {
  if (!Uk) {
    const a = new xa("ploft.objects");
    Uk = a.init().then(() => a);
  }
  return Uk;
}
function Wk() {
  return Vk().then(a => a.clear()).then(() => {
    console.log("Cleared all saved objects");
  });
}
;async function Xk(a, b) {
  const c = b.lastIndexOf("/");
  a = c >= 0 ? await lb(a, b.slice(0, c)) : a;
  if (!a) {
    return null;
  }
  try {
    return await (await (await a.getFileHandle(b.slice(c + 1))).getFile()).text();
  } catch (d) {
    return null;
  }
}
async function Yk(a, b, c) {
  const d = b.lastIndexOf("/");
  a = d >= 0 ? await lb(a, b.slice(0, d), !0) : a;
  if (!a) {
    return !1;
  }
  b = await (await a.getFileHandle(b.slice(d + 1), {create:!0})).createWritable();
  await b.write(c);
  await b.close();
  return !0;
}
async function Zk() {
  return (await qb({Pa:"ploft.user_root", key:"root", ld:!0})).handle;
}
async function $k() {
  return (await qb({Pa:"ploft.user_root", key:"mirror", ld:!0})).handle;
}
async function al(a) {
  await lb(a, "gdef", !0);
  await lb(a, "svg/collections", !0);
}
async function bl(a, b) {
  a = await Xk(a, b);
  if (a === null) {
    return null;
  }
  try {
    return JSON.parse(a);
  } catch (c) {
    return console.warn("user_root: json invalido", b, c), null;
  }
}
async function cl(a, b, c) {
  return Yk(a, b, JSON.stringify(c, null, 2));
}
async function dl(a) {
  const b = [];
  a = await lb(a, "svg/collections");
  if (!a) {
    return b;
  }
  for await (const c of a.values()) {
    c.kind === "directory" && b.push(c.name);
  }
  return b;
}
async function el(a, b) {
  const c = b.lastIndexOf("/");
  if (a = c >= 0 ? await lb(a, b.slice(0, c)) : a) {
    try {
      await a.removeEntry(b.slice(c + 1));
    } catch (d) {
      console.warn("user_root: removeFile", b, d);
    }
  }
}
async function fl(a, b) {
  const c = b.lastIndexOf("/");
  if (a = c >= 0 ? await lb(a, b.slice(0, c)) : a) {
    try {
      await a.removeEntry(b.slice(c + 1), {recursive:!0});
    } catch (d) {
      console.warn("user_root: removeDir", b, d);
    }
  }
}
;function gl(a, b) {
  switch(a) {
    case 1:
    case 2:
    case 3:
    case 5:
    case 6:
    case 7:
      return [1];
    case 4:
      return b && b.loaded ? [] : [1];
    case 8:
      return [2];
  }
  return [];
}
const hl = {1:async function() {
  const a = await qb({Pa:"ploft.user_root", key:"root"});
  a.handle && al(a.handle);
  return !!a.handle;
}, 2:async function() {
  return !!(await qb({Pa:"ploft.user_root", key:"mirror"})).handle;
}};
var il = {rf:1, Ch:2, Dh:3, we:4, zh:5, sf:6, yh:7, Ih:8};
function jl(a, b, c) {
  a = gl(a, b);
  a.length ? Promise.all(a.map(d => hl[d]())).then(d => c(d.every(Boolean)), () => c(!1)) : c(!0);
}
;function kl(a, b) {
  const c = a[b].depth;
  let d = 0;
  for (b += 1; b < a.length && !(a[b].g === -2 && a[b].depth <= c); b++) {
    a[b].g >= 0 && d++;
  }
  return d;
}
function ll(a, b) {
  qh(a.i, -1);
  const c = a.B + ":";
  b.fa.forEach(d => {
    d.startsWith(c) && qh(a.i, parseInt(d.substring(c.length), 10));
  });
}
function ml(a, b, c) {
  if (a.key !== "ArrowUp" && a.key !== "ArrowDown") {
    return null;
  }
  a.preventDefault();
  if (!b.Qa) {
    return null;
  }
  var d = b.Qa.split(":");
  const e = parseInt(d[0], 10);
  var f = parseInt(d[1], 10);
  if (e <= 0 || e !== c.B) {
    return null;
  }
  const g = ch(c.G);
  if (!g.length) {
    return null;
  }
  var h = b.collapsed[e] || {};
  d = [];
  let k = -1;
  for (let m = 0; m < g.length; m++) {
    const l = g[m];
    k >= 0 ? l.g === -2 && l.depth <= k && (k = -1) : l.g !== -2 && (l.g === -1 ? h[m] || (k = l.depth) : d.push(m));
  }
  f = d.indexOf(f);
  if (f < 0) {
    return null;
  }
  a = f + (a.key === "ArrowDown" ? 1 : -1);
  if (a < 0 || a >= d.length) {
    return null;
  }
  a = d[a];
  b.fa.clear();
  b.fa.add(e + ":" + a);
  b.Qa = e + ":" + a;
  ll(c, b);
  return {B:e, next:a};
}
;function nl(a) {
  const b = a.data.qa;
  if (b.fa.size > 0) {
    if (b.Qa) {
      const c = parseInt(b.Qa.split(":")[0], 10);
      c > 0 && (a = a.N.h, qh(new rh(a, a.j, c), -1));
    }
    b.fa.clear();
    b.Qa = "";
  }
  b.ha && (b.ha = null);
}
function ol(a, b) {
  a.data.state.pe = b;
  nl(a);
}
function U(a) {
  a.data.state.Oa = null;
  a.l.refresh();
}
function pl(a, b, c, d) {
  d = parseFloat(d.currentTarget.value);
  if (!isNaN(d)) {
    b = a.N.i(b).G;
    const f = b.h;
    S(f, b.g);
    const g = R(f, b.g);
    if (g) {
      var e = Qg(f, b.g);
      c < 0 || c >= e.length || (c = g.L[e[c]], c.a.length ? c.a[0] = d : c.a = w(d), f.g.delete(b.g), Rg(f, b.g));
    }
  }
  a.data.state.Wd = null;
  a.l.refresh();
}
function ql(a, b, c, d) {
  if (d = d.currentTarget.value.trim()) {
    b = a.N.i(b).G;
    const g = b.h;
    S(g, b.g);
    var e = R(g, b.g);
    if (e) {
      var f = Qg(g, b.g);
      c < 0 || c >= f.length || (c = e.L[f[c]], c.name && e.g.h.delete(c.name), c.name = d, c = u(c.h), e.g.h.set(d, c), g.g.delete(b.g), Rg(g, b.g));
    }
  }
  a.data.state.Xd = null;
  a.l.refresh();
}
function rl(a) {
  const b = a.data.state, c = Tg(a.N.g);
  b.Rg = c.map(d => ({uuid:d.uuid, name:d.name || d.uuid}));
  a.l.refresh();
}
function sl(a, b, c, d) {
  b.preventDefault();
  b.stopPropagation();
  a.data.state.Oa = {Sa:c, B:d.B, node:d, x:b.clientX, y:b.clientY};
  rl(a);
  a.l.refresh();
}
function tl(a, b, c) {
  var d;
  if (d = c && c.trim()) {
    d = a.N.i(b).G;
    var e = c.trim();
    c = d.h;
    S(c, d.g);
    var f = Mg(c, d.g);
    if (f = f ? Ng(f) : null) {
      const h = f.g.g.L;
      var g = h.length;
      f.g.g.g.M.Y.local(0, e);
      if (h.length > g) {
        e = h.pop();
        for (g = f.i + 1; g < f.h && h[g].g === 2 && (h[g].m === 1 || h[g].m === 0 || h[g].m === 15 || h[g].m === 14);) {
          g++;
        }
        h.splice(g, 0, e);
        f.h++;
      }
      f.g.h++;
      Rg(c, d.g);
      d = !0;
    } else {
      d = !1;
    }
  }
  d && (a.data.state.lb[b] = !0, a.l.refresh());
}
function ul(a, b) {
  const c = a.data.state;
  b = a.N.i(b);
  let d = ah(b.G);
  d || (d = Tk(c.Rg || []), bh(b.G, d));
  const e = $g(b.G);
  if (e && e.uuid) {
    var f = a.N;
    jl(il.rf, void 0, g => {
      g ? (g = Date.now(), mh(f.h, e.uuid, d, g) ? Eh(e.uuid, d, g) : console.warn("save: filestore recusou")) : console.warn("save: pasta nao autorizada");
    });
  } else {
    console.error("save: buffer vazio ou sem uuid");
  }
  U(a);
}
function vl(a, b, c) {
  const d = a.N, e = Tg(d.g).find(f => f.uuid === c);
  jl(il.we, {loaded:!(!e || !e.loaded)}, f => {
    f ? (f = lh(d.h, c, b), d.o(f, (g, h) => {
      g === 1 && h || console.warn("addClassChild: falhou para", c);
    })) : console.warn("addClassChild: pasta nao autorizada");
  });
  U(a);
}
function wl(a) {
  Wk().then(() => {
    rl(a);
  });
  U(a);
}
function xl(a, b) {
  const c = a.data.qa;
  if (c.Qa) {
    var d = parseInt(c.Qa.split(":")[0], 10);
    if (!(d <= 0)) {
      d = a.N.i(d);
      var e = ml(b, c, d);
      e && (a.l.refresh(), setTimeout(() => {
        var f = e.next;
        const g = document.getElementById(Sh(a.l.sa.v.key));
        g && (f = g.querySelector('[lid="' + f + '"]')) && f.scrollIntoView({block:"nearest"});
      }, 0));
    }
  }
}
;const yl = {width:"18px", display:"inline-block", textAlign:"center", color:"#555", fontSize:"12px", flexShrink:"0"}, zl = {display:"inline-block", width:"4px", color:"#555", fontSize:"12px", flexShrink:"0"};
function Al(a) {
  const b = [], c = [], d = a[0].depth;
  for (var e = 0; e < a.length;) {
    const f = e;
    for (e++; e < a.length && a[e].depth > d;) {
      e++;
    }
    c.push([f, e]);
  }
  for (a = c.length - 1; a >= 0; a--) {
    for (e = c[a][0]; e < c[a][1]; e++) {
      b.push(e);
    }
  }
  return {bg:b, xg:d};
}
function Bl(a, b) {
  const c = Array(b.length);
  for (let e = 0; e < b.length; e++) {
    var d = b[e];
    const f = a[d].depth;
    d = e + 1 + a[d].ga;
    c[e] = d >= b.length ? !0 : a[b[d]].depth < f;
  }
  return c;
}
function Cl(a, b, c) {
  const d = [];
  for (let e = 0; e < b; e++) {
    d.push(n("span", {lid:"a" + e, style:yl}, a[e] ? "" : "\u2502"));
  }
  d.push(n("span", {lid:"cv", style:yl}, c ? "\u2514" : "\u251c"));
  d.push(n("span", {lid:"cd", style:zl}, "\u2500"));
  return d;
}
function Dl(a, b, c, d) {
  const e = [];
  for (let f = 0; f < b; f++) {
    e.push(n("span", {lid:"a" + f, style:yl}, a[f] ? "" : "\u2502"));
  }
  e.push(n("span", {lid:"o", style:yl}, c ? "" : "\u2502"));
  e.push(n("span", {lid:"h", style:yl}, d ? "\u2502" : ""));
  return e;
}
;function El(a) {
  const b = a.data.qa;
  b.Wc = -1;
  b.Vc = -1;
  b.Qd = -1;
  b.qc = null;
  a.data.refresh();
}
function Fl(a, b, c) {
  const d = a.data.qa, e = a.data.X;
  if (a.data.X > 0 && a.data.pi && (a.data.pi(a.data.Uh, 0), a.data.X > 0)) {
    var f = a.data.qa, g = a.data.entries, h = a.data.X + ":";
    for (let k = 0; k < g.length; k++) {
      const m = h + k;
      (g[k].H & 2) !== 0 ? f.fa.has(m) || f.fa.add(m) : f.fa.delete(m);
    }
  }
  f = e + ":" + b;
  if (c.ctrlKey) {
    d.fa.has(f) ? d.fa.delete(f) : d.fa.add(f);
  } else if (c.shiftKey && d.Qa !== "") {
    if (c = d.Qa.split(":"), g = parseInt(c[1], 10), parseInt(c[0], 10) === e) {
      for (c = Math.min(g, b), b = Math.max(g, b), g = a.data.entries; c <= b; c++) {
        c < g.length && g[c].g >= 0 && d.fa.add(e + ":" + c);
      }
    } else {
      d.fa.clear(), d.fa.add(f);
    }
  } else {
    d.fa.size === 1 && d.fa.has(f) ? d.fa.clear() : (d.fa.clear(), d.fa.add(f));
  }
  d.Qa = f;
  a.data.X > 0 && ll(a.node, a.data.qa);
  a.data.refresh();
}
function Gl(a, b, c) {
  if (a.data.X > 0) {
    var d = a.data.qa;
    d.Wc = a.data.X;
    d.Vc = c;
    b.dataTransfer.setData("application/x-ploft-command", a.data.X + ":" + c);
    b.dataTransfer.effectAllowed = "move";
    b.stopPropagation();
  }
}
function Hl(a, b, c) {
  const d = a.data.qa;
  if (d.Wc === a.data.X && b.dataTransfer.types.includes("application/x-ploft-command")) {
    b.preventDefault();
    b.stopPropagation();
    var e = b.currentTarget.getBoundingClientRect();
    b = b.clientY - e.top < e.height * 0.5 ? "above" : "below";
    if (d.Qd !== c || d.qc !== b) {
      d.Qd = c, d.qc = b, a.data.refresh();
    }
  }
}
function Il(a, b, c) {
  b.preventDefault();
  b.stopPropagation();
  var d = a.data.qa;
  if (a.data.X > 0 && d.Wc === a.data.X && d.Vc >= 0 && d.Vc !== c) {
    b = a.node.G;
    var e = d.Vc;
    d = c + (d.qc === "below" ? 1 : 0);
    c = b.h;
    var f = Mg(c, b.g);
    if (f && (f = Ng(f))) {
      var g;
      g === void 0 && (g = f.g.filter());
      e !== d && (e = rg(f, g, e), g = rg(f, g, d), e !== -1 && g !== -1 && (Qf(f.g.g.L, e, g), f.g.h++));
      Rg(c, b.g);
    }
  }
  El(a);
}
function Jl(a, b, c) {
  if (a.data.X > 0) {
    c.preventDefault();
    c.stopPropagation();
    var d = a.data.qa;
    d.ha && d.ha.X === a.data.X && d.ha.ia === b ? d.ha = null : d.ha = {X:a.data.X, ia:b, x:Math.round(c.clientX), y:Math.round(c.clientY)};
    a.data.refresh();
  }
}
;class Kl extends Qc.g {
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
    const b = this.data.qa, c = this.data.X, d = this.data.X > 0, e = b.collapsed[c] || {};
    let f = -1;
    const g = b.ha && b.ha.X === this.data.X ? b.ha.ia : -1, h = this.data.Di || null, k = (this.data.Ei || 0) + "px";
    let m = !1;
    return n("div", {style:{fontFamily:"monospace", fontSize:"11px", paddingTop:"1px"}}, a.map((l, p) => {
      if (f >= 0) {
        return l.g === -2 && l.depth <= f && (f = -1), null;
      }
      if (l.g === -2) {
        return null;
      }
      var r = l.depth * 12 + (this.data.Sh || 16);
      if (l.g === -1) {
        var q = !e[p];
        q && (f = l.depth);
        return n("div", {lid:p, style:h ? {display:"flex", alignItems:"center", paddingLeft:k} : {}, onClick:() => {
          const z = this.data.qa.collapsed, E = this.data.X;
          z[E] || (z[E] = {});
          z[E][p] ? delete z[E][p] : z[E][p] = !0;
          this.data.refresh();
        }}, h, n("div", {style:{padding:"0px 4px", paddingLeft:r + "px", cursor:"pointer", color:"#8cf", userSelect:"none", fontSize:"10px", flex:h ? "1" : void 0}}, (q ? "[+] " : "[-] ") + l.name + " (" + kl(a, p) + ")"));
      }
      l.g === 22 && (m = !0);
      if (l.g === 24 || l.g === 27 || l.g === 23) {
        m = !1;
      }
      q = m ? 10 : 0;
      const v = l.g === 22;
      var t = l.g === 4;
      const x = v || t;
      t = (l.H & 2) !== 0;
      t = b.fa.has(c + ":" + p) || t;
      const A = g === p, B = (l.H & 1) !== 0;
      var F = b.Qd === p && b.Wc === c;
      const I = F && b.qc === "above";
      F = F && b.qc === "below";
      if (x) {
        return n("div", {lid:p, draggable:d ? "true" : "false", onDragStart:z => Gl(this, z, p), onDragOver:z => Hl(this, z, p), onDrop:z => Il(this, z, p), onDragEnd:() => {
          El(this);
        }, style:h ? {display:"flex", alignItems:"center", paddingLeft:k} : {}}, h, n("div", {onClick:z => Fl(this, p, z), onContextMenu:z => Jl(this, p, z), style:{display:"flex", alignItems:"center", height:"3px", paddingLeft:r + 5 + "px", paddingRight:"4px", cursor:d ? "grab" : "default", userSelect:"none", backgroundColor:t ? "#1a4a6a" : "transparent", borderLeft:t ? "2px solid #0cf" : "2px solid transparent", borderTop:I ? "2px solid #6af" : "2px solid transparent", borderBottom:F ? "2px solid #6af" : 
        "2px solid transparent", opacity:B ? "0.3" : "1", flex:h ? "1" : void 0}}, n("span", {style:{width:"50px", height:"0", borderTop:v ? "1px dashed #556" : "1px solid #556"}})));
      }
      r += q;
      if ((l.g === 43 || l.g === 44) && d) {
        const z = l.h.length > 0 ? l.h[0] | 0 : 255;
        q = xk(z);
        return n("div", {lid:p, draggable:"true", onDragStart:E => Gl(this, E, p), onDragOver:E => Hl(this, E, p), onDrop:E => Il(this, E, p), onDragEnd:() => {
          El(this);
        }, style:h ? {display:"flex", alignItems:"center", paddingLeft:k} : {}}, h, n("div", {onClick:E => Fl(this, p, E), onContextMenu:E => Jl(this, p, E), style:{padding:"1px 4px", paddingLeft:r + "px", display:"flex", alignItems:"center", gap:"6px", cursor:"grab", userSelect:"none", color:t ? "#fff" : B ? "#665" : A ? "#ccc" : "#999", backgroundColor:t ? "#1a4a6a" : A ? "#2a3a4a" : "transparent", borderLeft:t ? "2px solid #0cf" : "2px solid transparent", borderTop:I ? "2px solid #6af" : "2px solid transparent", 
        borderBottom:F ? "2px solid #6af" : "2px solid transparent", textDecoration:B ? "line-through" : "none", fontStyle:B ? "italic" : "normal", opacity:B ? "0.3" : "1", flex:h ? "1" : void 0}}, n("span", null, l.name), n("input", {type:"color", value:q, onMouseDown:E => E.stopPropagation(), onInput:E => {
          this.data.X > 0 && dh(this.node.G, p, 0, parseInt(E.target.value.slice(1), 16) << 8 | z & 255);
        }, style:{width:"20px", height:"16px", padding:"0", border:"none", cursor:"pointer"}})));
      }
      return n("div", {lid:p, draggable:d ? "true" : "false", onDragStart:z => Gl(this, z, p), onDragOver:z => Hl(this, z, p), onDrop:z => Il(this, z, p), onDragEnd:() => {
        El(this);
      }, style:h ? {display:"flex", alignItems:"center", paddingLeft:k} : {}}, h, n("div", {onClick:z => Fl(this, p, z), onContextMenu:z => Jl(this, p, z), style:{padding:"1px 4px", paddingLeft:r + "px", cursor:d ? "grab" : "default", userSelect:"none", color:t ? "#fff" : B ? "#665" : A ? "#ccc" : "#999", backgroundColor:t ? "#1a4a6a" : A ? "#2a3a4a" : "transparent", borderLeft:t ? "2px solid #0cf" : "2px solid transparent", borderTop:I ? "2px solid #6af" : "2px solid transparent", borderBottom:F ? 
      "2px solid #6af" : "2px solid transparent", textDecoration:B ? "line-through" : "none", fontStyle:B ? "italic" : "normal", flex:h ? "1" : void 0}}, l.g === 150 && l.T > 0 ? l.name + ": " + (wk[l.h[0]] || String(l.h[0])) : l.name));
    }));
  }
}
;function Ll(a, b, c, d, e, f) {
  const g = b.B;
  f = [n("div", {lid:"v" + c, onContextMenu:h => {
    h.preventDefault();
    h.stopPropagation();
    a.data.state.Oa = {Sa:-2, B:g, node:null, x:h.clientX, y:h.clientY, target:1, rh:0};
    a.l.refresh();
  }, style:{display:"flex", alignItems:"center", paddingLeft:"6px", height:"20px", cursor:"pointer", fontSize:"11px", userSelect:"none"}}, e, n("span", {onClick:h => {
    h.stopPropagation();
    ol(a, c);
    h = a.data.state;
    h.lb[g] ? delete h.lb[g] : h.lb[g] = !0;
    a.l.refresh();
  }, style:{color:d ? "#c8a" : "#888", paddingLeft:"4px"}}, (d ? "[-] " : "[+] ") + "vars" + (f !== void 0 ? " (" + f + ")" : "")))];
  if (d) {
    try {
      const h = a.data.state, k = Yg(b.G);
      if (k.length > 0) {
        const m = h.Wd, l = h.Xd;
        f.push(n("div", {style:{fontFamily:"monospace", fontSize:"11px"}}, k.map((p, r) => {
          const q = p.name || "v" + String(r + 1).padStart(2, "0"), v = m && m.B === g && m.key === r;
          return n("div", {lid:r, style:{height:"18px", display:"flex", paddingLeft:"6px", alignItems:"center", color:"#ccc"}, onContextMenu:t => {
            t.preventDefault();
            t.stopPropagation();
            a.data.state.Oa = {Sa:-2, B:g, node:null, x:t.clientX, y:t.clientY, target:2, rh:r};
            a.l.refresh();
          }}, e, l && l.B === g && l.key === r ? n("input", {type:"text", value:q, Ag:t => ql(a, g, r, t), onKeyDown:t => {
            t.stopPropagation();
            t.key === "Enter" ? ql(a, g, r, t) : t.key === "Escape" && (a.data.state.Xd = null, a.l.refresh());
          }, style:Object.assign({}, Qh, {width:"80px", marginLeft:"16px"})}) : n("span", {onClick:() => {
            ol(a, c);
            a.data.state.Xd = {B:g, key:r};
            a.l.refresh();
          }, style:{paddingLeft:"16px", color:"#9cdcfe", cursor:"pointer"}}, q), n("span", {style:{color:"#666", margin:"0 4px"}}, "="), v ? n("input", {type:"text", value:String(p.value), Ag:t => pl(a, g, r, t), onKeyDown:t => {
            t.stopPropagation();
            t.key === "Enter" ? pl(a, g, r, t) : t.key === "Escape" && (a.data.state.Wd = null, a.l.refresh());
          }, style:Object.assign({}, Qh, {width:"80px", textAlign:"right", fontSize:"11px"})}) : n("span", {onClick:() => {
            ol(a, c);
            a.data.state.Wd = {B:g, key:r};
            a.l.refresh();
          }, style:{color:"#b5cea8", cursor:"pointer", padding:"1px 4px", borderRadius:"2px"}}, Number.isInteger(p.value) ? String(p.value) : p.value.toFixed(2)));
        })));
      }
    } catch (h) {
    }
  }
  return f;
}
function Ml(a, b, c, d, e, f) {
  const g = b.B;
  f = [n("div", {lid:"c" + c, style:{display:"flex", alignItems:"center", paddingLeft:"6px", height:"20px", cursor:"pointer", fontSize:"11px", userSelect:"none"}}, e, n("span", {onClick:h => {
    h.stopPropagation();
    ol(a, c);
    h = a.data.state;
    h.Eb[g] ? delete h.Eb[g] : h.Eb[g] = !0;
    a.l.refresh();
  }, style:{color:d ? "#6af" : "#888", paddingLeft:"4px"}}, (d ? "[-] " : "[+] ") + "cmds" + (f !== void 0 ? " (" + f + ")" : "")))];
  if (d) {
    try {
      const h = ch(b.G);
      h.length > 0 && f.push(Pc(new Kl({X:g, Uh:-1, entries:h, qa:a.data.qa, node:b, Di:e, Ei:6, Sh:16, refresh:() => a.l.refresh()})));
    } catch (h) {
    }
  }
  return f;
}
function Nl(a, b, c, d, e, f) {
  const g = b.B;
  f = [n("div", {lid:"e" + c, style:{display:"flex", alignItems:"center", paddingLeft:"6px", height:"20px", cursor:"pointer", fontSize:"11px", userSelect:"none"}}, e, n("span", {onClick:h => {
    h.stopPropagation();
    ol(a, c);
    h = a.data.state;
    h.Fb[g] ? delete h.Fb[g] : h.Fb[g] = !0;
    a.l.refresh();
  }, onContextMenu:h => {
    h.preventDefault();
    h.stopPropagation();
    a.data.state.Oa = {Sa:-2, B:g, node:b, x:h.clientX, y:h.clientY, target:3};
    a.l.refresh();
  }, style:{color:d ? "#e8a" : "#888", paddingLeft:"4px"}}, (d ? "[-] " : "[+] ") + "events" + (f !== void 0 ? " (" + f + ")" : "")))];
  if (d) {
    try {
      const h = hh(b.G);
      h.length > 0 && f.push(n("div", {style:{fontFamily:"monospace", fontSize:"11px"}}, h.map((k, m) => n("div", {lid:m, style:{height:"18px", display:"flex", paddingLeft:"6px", alignItems:"center", color:"#ccc", cursor:"context-menu"}, onContextMenu:l => {
        var p = k.jc, r = k.ui, q = k.wi;
        l.preventDefault();
        l.stopPropagation();
        a.data.state.Oa = {Sa:-2, B:g, node:b, x:l.clientX, y:l.clientY, target:4, kb:m, Db:p, Ia:r, Za:q};
        a.l.refresh();
      }}, e, n("span", {style:{paddingLeft:"16px", color:We[k.jc] ? "#ce9178" : "#999"}}, k.name), n("span", {style:{color:"#555", marginLeft:"6px", fontSize:"9px"}}, "(" + k.jc + ")")))));
    } catch (h) {
    }
  }
  return f;
}
function Ol(a, b) {
  const c = uh(a.N.C), d = a.N.O, e = {backgroundColor:"#1e1e1e", color:"#ccc", border:"1px solid #555", fontSize:"10px", padding:"0 2px", outline:"none", cursor:"pointer"};
  return n("div", {style:{paddingLeft:"24px", fontSize:"11px", fontFamily:"monospace", color:"#aaa"}}, n("div", {style:{display:"flex", alignItems:"center", height:"20px"}}, n("span", {style:{cursor:"pointer", marginRight:"12px", color:c.Yd ? "#4ec9b0" : "#666"}, onClick:() => {
    var f = a.N.C;
    f.g && Ee(f.g, b.B, 1, c.Yd ? 0 : 1);
    a.l.refresh();
  }}, (c.Yd ? "\u2611" : "\u2610") + " events"), n("span", {style:{cursor:"pointer", color:c.Zd ? "#4ec9b0" : "#666"}, onClick:() => {
    var f = a.N.C;
    f.g && Ee(f.g, b.B, 2, c.Zd ? 0 : 1);
    a.l.refresh();
  }}, (c.Zd ? "\u2611" : "\u2610") + " propagate")), n("div", {style:{display:"flex", alignItems:"center", height:"20px"}}, n("span", {style:{color:"#888", marginRight:"4px"}}, "tool"), n("select", {lid:"ed-tool", style:e, onChange:f => {
    var g = a.N.C;
    g.g && Ee(g.g, b.B, 3, parseInt(f.target.value, 10));
  }}, Ok.map((f, g) => d.j === g ? n("option", {value:g, selected:!0}, f) : n("option", {value:g}, f))), n("span", {style:{color:"#888", marginLeft:"12px", marginRight:"4px"}}, "style"), n("select", {lid:"ed-style", style:e, onChange:f => {
    var g = a.N.C;
    g.g && Ee(g.g, b.B, 4, parseInt(f.target.value, 10));
  }}, Pk.map((f, g) => d.i === g ? n("option", {value:g, selected:!0}, f) : n("option", {value:g}, f)))), n("div", {style:{display:"flex", alignItems:"center", height:"20px", gap:"4px"}}, n("span", {onClick:() => {
    const f = a.data.state.Kd || "", g = a.N, h = (m, l) => {
      if (m === 1 && l) {
        m = g.D();
        for (let p = 0; p < m.length; p++) {
          if (m[p].B === l) {
            ol(a, p);
            (l = m[p]) && vh(a.N.C, l.B, 0);
            break;
          }
        }
        g.refresh();
      }
    };
    if (f) {
      var k = Tg(g.g).find(m => m.uuid === f);
      jl(il.we, {loaded:!(!k || !k.loaded)}, m => {
        m && g.o(lh(g.h, f, b.B), h);
      });
    } else {
      g.o(b.h(), h);
    }
  }, style:{cursor:"pointer", color:"#4ec9b0", fontSize:"11px"}}, a.data.state.Kd ? "+ add instance" : "+ add element"), n("select", {lid:"add-class", onChange:f => {
    a.data.state.Kd = f.target.value;
    a.l.refresh();
  }, style:{backgroundColor:"#1e1e1e", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", fontSize:"10px", padding:"1px 2px", maxWidth:"150px"}}, [n("option", {value:""}, "(novo elemento)")].concat(Tg(a.N.g).map(f => f.uuid === a.data.state.Kd ? n("option", {value:f.uuid, selected:!0}, f.name || f.uuid) : n("option", {value:f.uuid}, f.name || f.uuid))))));
}
;function Pl(a, b, c, d) {
  const e = Zc(d);
  if (e > 0 && b) {
    a = Yg(b.G);
    for (b = 0; b < a.length; b++) {
      if (a[b].Ja === e) {
        return a[b].name || "v" + String(b + 1).padStart(2, "0");
      }
    }
    return "(?)";
  }
  return Number.isNaN(d) || d < 0 ? "(not set)" : qi(a.data.te, c, d, -1);
}
const V = {display:"flex", alignItems:"center", gap:"6px", padding:"4px 10px", cursor:"pointer", fontSize:"12px", color:"#e0e0e0", whiteSpace:"nowrap"}, Ql = {width:"14px", textAlign:"center", fontSize:"11px", color:"#6af"}, Rl = {width:"14px", textAlign:"center", fontSize:"13px"};
function Sl(a) {
  return n("div", {onClick:() => U(a), style:{position:"fixed", top:"0", left:"0", right:"0", bottom:"0", zIndex:"100"}});
}
function Tl(a, b, c, d) {
  const e = b.B;
  return n("div", null, c, n("div", {style:{...d, padding:"6px 8px"}}, n("div", {style:{display:"flex", alignItems:"center", gap:"4px"}}, n("input", {type:"text", placeholder:"name", onKeyDown:f => {
    f.stopPropagation();
    f.key === "Enter" ? (tl(a, e, f.currentTarget.value), U(a)) : f.key === "Escape" && U(a);
  }, style:{...Qh, width:"100px", flex:"1"}}), n("div", {onClick:f => {
    if (f = f.currentTarget.parentElement) {
      if (f = f.querySelector("input")) {
        tl(a, e, f.value), U(a);
      }
    }
  }, style:{padding:"2px 8px", cursor:"pointer", fontSize:"11px", color:"#e0e0e0", backgroundColor:"#3a3a3a", border:"1px solid #555", borderRadius:"2px", whiteSpace:"nowrap"}}, "+ Add"))));
}
function Ul(a, b, c, d) {
  const e = b.rh || 0;
  return n("div", null, c, n("div", {style:d}, n("div", {onClick:() => {
    Zg(a.N.i(b.B).G, e, e + -1);
    a.l.refresh();
    U(a);
  }, style:V}, n("span", {style:Ql}, "\u2191"), "Move up"), n("div", {onClick:() => {
    Zg(a.N.i(b.B).G, e, e + 1);
    a.l.refresh();
    U(a);
  }, style:V}, n("span", {style:Ql}, "\u2193"), "Move down"), n("div", {onClick:() => {
    var f = a.N.i(b.B).G;
    const g = f.h;
    S(g, f.g);
    const h = R(g, f.g);
    if (h) {
      var k = Qg(g, f.g);
      e < 0 || e >= k.length || (k = h.L.splice(k[e], 1)[0], k.name && h.g.h.delete(k.name), g.g.delete(f.g), Rg(g, f.g));
    }
    a.l.refresh();
    U(a);
  }, style:V}, n("span", {style:{...Ql, color:"#f44"}}, "\u00d7"), "Delete")));
}
function Vl(a, b, c, d) {
  const e = b.node;
  return n("div", null, c, n("div", {style:d}, ni.map((f, g) => n("div", {lid:g, onClick:() => {
    var h = e.G, k = f.jc;
    const m = h.h;
    S(m, h.g);
    const l = R(m, h.g);
    if (l) {
      var p = Pg(l);
      if (p) {
        var r = K(l.g);
        l.L.splice(p.cg, 0, new y(6, p.rb, 9, w(k), r));
        m.g.delete(h.g);
        Rg(m, h.g);
      }
    }
    U(a);
    a.l.refresh();
  }, style:V}, n("span", {style:Ql}, "+"), f.name))));
}
function Wl(a, b, c, d) {
  const e = b.node;
  var f = b.Db || 0, g = oi[f];
  const h = b.Ia || 0, k = [];
  f === 1 ? (f = g && g[0] && g[0].options ? g[0].options[h] || "default" : "") && k.push(n("div", {onClick:() => {
    a.data.state.Oa = {Sa:b.Sa, B:b.B, node:e, x:b.x, y:b.y, target:5, kb:b.kb, Db:b.Db, Ia:b.Ia, Za:b.Za};
    a.l.refresh();
  }, style:V}, n("span", {style:Ql}, "\u25b6"), "cursor: " + f)) : f === 2 && (g = b.Za !== void 0 ? b.Za : -1, f = Pl(a, e, b.B, b.Ia !== void 0 ? b.Ia : -1), g = Pl(a, e, b.B, g), k.push(n("div", {onClick:() => {
    a.data.state.Oa = {Sa:b.Sa, B:b.B, node:e, x:b.x, y:b.y, target:6, kb:b.kb, Db:b.Db, Ia:b.Ia, Za:b.Za, eg:0};
    a.l.refresh();
  }, style:V}, n("span", {style:Ql}, "\u25b6"), "var x: " + f)), k.push(n("div", {onClick:() => {
    a.data.state.Oa = {Sa:b.Sa, B:b.B, node:e, x:b.x, y:b.y, target:6, kb:b.kb, Db:b.Db, Ia:b.Ia, Za:b.Za, eg:1};
    a.l.refresh();
  }, style:V}, n("span", {style:Ql}, "\u25b6"), "var y: " + g)));
  return n("div", null, c, n("div", {style:d}, k, k.length > 0 ? n("div", {style:{borderTop:"1px solid #444", margin:"2px 0"}}) : null, n("div", {onClick:() => {
    ih(e.G, b.kb || 0);
    U(a);
    a.l.refresh();
  }, style:V}, n("span", {style:{...Ql, color:"#f44"}}, "\u00d7"), "Delete event")));
}
function Xl(a, b, c, d) {
  const e = b.node;
  var f = oi[b.Db || 0];
  f = f ? f[0] : null;
  const g = b.Ia || 0, h = f ? f.key : 0, k = b.kb || 0;
  return n("div", null, c, n("div", {style:{...d, maxHeight:"152px", overflowY:"auto"}}, (f && f.options ? f.options : []).map((m, l) => n("div", {lid:l, onClick:() => {
    jh(e.G, k, h, l);
    U(a);
    a.l.refresh();
  }, style:{...V, height:"24px", backgroundColor:l === g ? "#2a4a6a" : "transparent"}}, n("span", {style:{...Rl, color:l === g ? "#6af" : "#555"}}, l === g ? "\u2022" : " "), m))));
}
function Yl(a, b, c, d) {
  const e = b.node, f = b.kb || 0, g = b.eg || 0, h = g === 0 ? b.Ia !== void 0 ? b.Ia : -1 : b.Za !== void 0 ? b.Za : -1, k = Zc(h);
  b = [];
  try {
    var m = Yg(e.G);
    for (let l = 0; l < m.length; l++) {
      b.push({Ja:m[l].Ja, name:m[l].name || "v" + String(l + 1).padStart(2, "0")});
    }
  } catch (l) {
  }
  m = !Number.isNaN(h) && h < 0;
  return n("div", null, c, n("div", {style:{...d, maxHeight:"200px", overflowY:"auto"}}, n("div", {lid:"none", onClick:() => {
    jh(e.G, f, g, -1);
    U(a);
    a.l.refresh();
  }, style:{...V, height:"24px", backgroundColor:m ? "#2a4a6a" : "transparent"}}, n("span", {style:{...Rl, color:m ? "#6af" : "#555"}}, m ? "\u2022" : " "), "(none)"), b.map((l, p) => n("div", {lid:p, onClick:() => {
    jh(e.G, f, g, u(l.Ja));
    U(a);
    a.l.refresh();
  }, style:{...V, height:"24px", backgroundColor:l.Ja === k ? "#2a4a6a" : "transparent"}}, n("span", {style:{...Rl, color:l.Ja === k ? "#6af" : "#555"}}, l.Ja === k ? "\u2022" : " "), l.name))));
}
function Zl(a, b, c, d, e, f) {
  const g = b.node, h = Jf(a.N.h), k = Rk(b.B, a.data.state.A, h), m = ah(g.G), l = Tg(a.N.g);
  return n("div", null, e, n("div", {style:f}, n("div", {style:{padding:"4px 10px"}}, n("input", {type:"text", placeholder:"name", value:m, onClick:p => p.stopPropagation(), onChange:p => {
    bh(g.G, p.currentTarget.value);
    a.l.refresh();
  }, onKeyDown:p => {
    p.stopPropagation();
    p.key === "Escape" && U(a);
  }, style:{...Qh, width:"100%", boxSizing:"border-box"}})), n("div", {onClick:() => {
    var p = b.Sa;
    U(a);
    a: {
      var r = a.data.state;
      var q = If(a.N), v = a.data.te;
      const P = [], na = q.B;
      var t = na || 0;
      const La = [];
      var x = [];
      for (var A = 0; A < c.length;) {
        var B = A;
        for (A++; A < c.length && c[A].depth > d;) {
          A++;
        }
        x.push([B, A]);
      }
      for (A = x.length - 1; A >= 0; A--) {
        for (B = x[A][0]; B < x[A][1]; B++) {
          La.push(B);
        }
      }
      x = Array(La.length);
      for (A = 0; A < La.length; A++) {
        var F = La[A];
        B = c[F].depth;
        F = A + 1 + c[F].ga;
        x[A] = F >= La.length ? !0 : c[La[F]].depth < B;
      }
      var I = 0;
      A = La.length;
      B = d;
      if (F = p < 0) {
        var z = !!r.collapsed[-1];
        p = Rk(t, r.A, na, !0);
        P.push((z ? "\u25b6" : "\u25bc") + "root");
        if (!z) {
          if (p.oa && (z = !!r.lb[t], P.push("\u2502 " + (z ? "[-] " : "[+] ") + "vars"), z)) {
            try {
              var E = Xg(q.G);
              pi(v, t, E);
              for (z = 0; z < E.length; z++) {
                var M = E[z];
                P.push("\u2502     " + (M.name || qi(v, t, M.key, M.slot)) + " = " + (Number.isInteger(M.value) ? String(M.value) : M.value.toFixed(2)) + " [" + M.slot + "]");
              }
            } catch (aa) {
            }
          }
          if (p.ma && (E = !!r.Eb[t], P.push("\u2502 " + (E ? "[-] " : "[+] ") + "cmds"), E)) {
            try {
              var ba = ch(q.G);
              for (E = 0; E < ba.length; E++) {
                P.push("\u2502     " + ba[E].name);
              }
            } catch (aa) {
            }
          }
          if (p.na && (t = !!r.Fb[t], P.push("\u2502 " + (t ? "[-] " : "[+] ") + "events"), t)) {
            try {
              var ea = hh(q.G);
              for (q = 0; q < ea.length; q++) {
                P.push("\u2502     " + ea[q].name + " (" + ea[q].jc + ")");
              }
            } catch (aa) {
            }
          }
        }
      } else {
        I = La.indexOf(p);
        if (I < 0) {
          r = "";
          break a;
        }
        A = I + 1 + c[p].ga;
        B = c[p].depth;
      }
      ea = [];
      for (q = I; q < A;) {
        var kb = La[q];
        t = c[kb];
        ba = t.depth - B;
        E = t.ga > 0;
        M = !!r.collapsed[kb];
        z = t.uuid && Nk[t.uuid] || "gralm";
        var O = M ? "\u25b6" : "\u25bc";
        I = Rk(t.B, r.A, na);
        p = !!x[q];
        let aa = "";
        for (let Q = 0; Q < ba; Q++) {
          aa += ea[Q] ? "    " : "\u2502   ";
        }
        if (ba > 0 || F) {
          aa += p ? "\u2514\u2500\u2500 " : "\u251c\u2500\u2500 ";
        }
        kb = E ? Qk(c, kb) : 0;
        P.push(aa + O + z + " [" + t.Mb + "]" + (kb > 0 ? " (" + kb + ")" : ""));
        z = "";
        for (O = 0; O < ba; O++) {
          z += ea[O] ? "    " : "\u2502   ";
        }
        if (ba > 0 || F) {
          z += p ? "    " : "\u2502   ";
        }
        z = E ? z + "\u2502 " : z + "  ";
        if (!M) {
          if (I.oa && (O = !!r.lb[t.B], P.push(z + ((O ? "[-] " : "[+] ") + "vars(" + t.kc + ")")), O)) {
            try {
              const Q = Xg(t.G);
              pi(v, t.B, Q);
              for (O = 0; O < Q.length; O++) {
                const Ab = Q[O];
                P.push(z + "    " + (Ab.name || qi(v, t.B, Ab.key, Ab.slot)) + " = " + (Number.isInteger(Ab.value) ? String(Ab.value) : Ab.value.toFixed(2)) + " [" + Ab.slot + "]");
              }
            } catch (Q) {
            }
          }
          if (I.ma && (O = !!r.Eb[t.B], P.push(z + ((O ? "[-] " : "[+] ") + "cmds(" + t.Ab + ")")), O)) {
            try {
              const Q = ch(t.G);
              for (O = 0; O < Q.length; O++) {
                P.push(z + "    " + Q[O].name);
              }
            } catch (Q) {
            }
          }
          if (I.na && (I = !!r.Fb[t.B], P.push(z + ((I ? "[-] " : "[+] ") + "events(" + t.Cb + ")")), I)) {
            try {
              const Q = hh(t.G);
              for (I = 0; I < Q.length; I++) {
                P.push(z + "    " + Q[I].name);
              }
            } catch (Q) {
            }
          }
        }
        ea.length = ba + 1;
        ea[ba] = p;
        M && E ? q += 1 + t.ga : q++;
      }
      r = P.join("\n");
    }
    navigator.clipboard.writeText(r);
  }, style:V}, n("span", {style:Ql}, "\u2398"), "Inspect"), n("div", {onClick:() => {
    U(a);
    var p = g.i;
    const r = p.g;
    r.g && Ee(r.g, p.B, 90001, 0);
  }, style:V}, n("span", {style:Ql}, "{"), "Copy JSON"), n("div", {onClick:() => wl(a), style:V}, n("span", {style:Ql}, "\u2716"), "Clear Saved"), n("div", {onClick:() => ul(a, b.B), style:V}, n("span", {style:Ql}, "\ud83d\udcbe"), "Save"), g && g.uuid && b.B !== h ? n("div", {onClick:() => {
    U(a);
    g && (ol(a, -1), g.D(), a.l.refresh());
  }, style:V}, n("span", {style:Ql}, "\u21bb"), "Restart") : null, n("div", {style:{borderTop:"1px solid #444", margin:"2px 0"}}), n("div", {onClick:() => {
    var p = b.B;
    const r = a.data.state.A.displayMap;
    if (!r[p]) {
      var q = Jf(a.N.h);
      q = Rk(p, a.data.state.A, q);
      r[p] = {oa:q.oa, ma:q.ma, na:q.na};
    }
    r[p].oa = !r[p].oa;
    a.l.refresh();
    a.data.Ue();
  }, style:V}, n("span", {style:{...Rl, color:k.oa ? "#6af" : "#666"}}, k.oa ? "\u2611" : "\u2610"), "Variables"), n("div", {onClick:() => {
    var p = b.B;
    const r = a.data.state.A.displayMap;
    if (!r[p]) {
      var q = Jf(a.N.h);
      q = Rk(p, a.data.state.A, q);
      r[p] = {oa:q.oa, ma:q.ma, na:q.na};
    }
    r[p].ma = !r[p].ma;
    a.l.refresh();
    a.data.Ue();
  }, style:V}, n("span", {style:{...Rl, color:k.ma ? "#6af" : "#666"}}, k.ma ? "\u2611" : "\u2610"), "Commands"), n("div", {onClick:() => {
    var p = b.B;
    const r = a.data.state.A.displayMap;
    if (!r[p]) {
      var q = Jf(a.N.h);
      q = Rk(p, a.data.state.A, q);
      r[p] = {oa:q.oa, ma:q.ma, na:q.na};
    }
    r[p].na = !r[p].na;
    a.l.refresh();
    a.data.Ue();
  }, style:V}, n("span", {style:{...Rl, color:k.na ? "#6af" : "#666"}}, k.na ? "\u2611" : "\u2610"), "Events"), n("div", {style:{borderTop:"1px solid #444", margin:"2px 0"}}), n("div", {style:{padding:"4px 10px", display:"flex", alignItems:"center", gap:"4px"}}, n("select", {lid:"sel", onClick:p => p.stopPropagation(), style:{flex:"1", backgroundColor:"#1e1e1e", color:"#e0e0e0", border:"1px solid #555", borderRadius:"2px", fontSize:"11px", padding:"2px 4px"}}, l.length === 0 ? n("option", {value:""}, 
  "(nenhuma classe)") : l.map((p, r) => n("option", {lid:r, value:p.uuid}, p.name || p.uuid))), n("div", {onClick:p => {
    (p = p.currentTarget.parentElement) && (p = p.querySelector("select")) && p.value && vl(a, b.B, p.value);
  }, style:{padding:"2px 8px", cursor:"pointer", fontSize:"11px", color:"#e0e0e0", backgroundColor:"#3a3a3a", border:"1px solid #555", borderRadius:"2px", whiteSpace:"nowrap"}}, "Add Child")), (() => {
    const p = b.B === h;
    return n("div", {onClick:() => {
      p || (g.j(), U(a));
    }, style:{...V, ...(p ? {opacity:0.35, cursor:"default"} : {color:"#f66"})}}, n("span", {style:Ql}, "\u2716"), "Delete");
  })()));
}
function $l(a, b, c) {
  const d = a.data.state.Oa;
  if (!d) {
    return null;
  }
  const e = {position:"fixed", left:d.x + "px", top:d.y + "px", backgroundColor:"#252526", border:"1px solid #555", borderRadius:"4px", padding:"4px 0", zIndex:"101", boxShadow:"0 4px 12px rgba(0,0,0,0.5)", minWidth:"140px"}, f = Sl(a);
  return d.target === 1 ? Tl(a, d, f, e) : d.target === 2 ? Ul(a, d, f, e) : d.target === 3 ? Vl(a, d, f, e) : d.target === 4 ? Wl(a, d, f, e) : d.target === 5 ? Xl(a, d, f, e) : d.target === 6 ? Yl(a, d, f, e) : Zl(a, d, b, c, f, e);
}
;class am extends yi {
  constructor(a, b, c) {
    super(a);
    this.N = c;
    this.data = b;
    c.O.h = () => {
      var d = document.getElementById(Sh(this.l.sa.v.key));
      if (d) {
        var e = this.N.O, f = d.querySelector('[lid="ed-tool"]');
        f && (f.value = String(e.j));
        if (d = d.querySelector('[lid="ed-style"]')) {
          d.value = String(e.i);
        }
      }
    };
    a = b.state;
    a.ed || (a.ed = !0, a.lf = c.gb(() => c.refresh()), nh(c.h));
  }
  g() {
    const a = this.data.state;
    this.data.te.g = {};
    const b = this.N.D();
    var c = Jf(this.N.h);
    const d = If(this.N), e = new Set();
    for (var f = 0; f < b.length; f++) {
      e.add(b[f].B);
    }
    f = z => {
      for (const E in z) {
        e.has(parseInt(E, 10)) || delete z[E];
      }
    };
    f(a.Eb);
    f(a.lb);
    f(a.Fb);
    f(a.Pb);
    f = null;
    let g = [], h = {}, k = null;
    const m = this.data.qa;
    if (m.ha) {
      var l = m.ha;
      for (var p = 0; p < b.length; p++) {
        if (b[p].B === l.X) {
          k = b[p];
          break;
        }
      }
      k || l.X !== c && l.X !== (c || 0) || (k = d);
      if (k) {
        try {
          g = ch(k.G);
          l.ia >= 0 && l.ia < g.length && (f = g[l.ia]);
          var r = Xg(k.G);
          Sk(l.X, r, a);
          h = Object.assign({}, pi(this.data.te, l.X, r));
          var q = Yg(k.G);
          for (r = 0; r < q.length; r++) {
            q[r].name && (h[q[r].Ja] = q[r].name);
          }
        } catch (z) {
        }
      }
      f || (m.ha = null);
    }
    q = b.length ? Al(b) : {bg:[], xg:0};
    l = q.bg;
    q = q.xg;
    p = b.length ? Bl(b, l) : [];
    r = [];
    var v = [];
    const t = this;
    for (var x = 0; x < l.length;) {
      var A = l[x];
      const z = b[A];
      var B = z.depth - q, F = z.ga > 0;
      const E = !!a.collapsed[A], M = !(!t.N.O || !t.N.O.has(z.B));
      var I = !!p[x];
      const ba = z.uuid && Nk[z.uuid] || "gralm", ea = E ? "\u25b6" : "\u25bc", kb = Cl(v, B, I), O = Dl(v, B, I, F), P = Rk(z.B, a.A, c), na = A;
      v.length = B + 1;
      v[B] = I;
      B = !E && P.oa && !!a.lb[z.B];
      I = !E && P.ma && !!a.Eb[z.B];
      const La = !E && P.na && !!a.Fb[z.B];
      r.push(n("div", {lid:A}, n("div", {style:{display:"flex", alignItems:"center", paddingLeft:"6px", paddingRight:"4px", height:"20px", cursor:"pointer", backgroundColor:M ? "#094771" : "transparent", fontSize:"11px", whiteSpace:"nowrap"}, onClick:aa => {
        var Q = t.data.state;
        Q.pe = Q.pe === na ? -1 : na;
        nl(t);
        t.l.refresh();
        (Q = b[na]) && vh(t.N.C, Q.B, aa && aa.ctrlKey ? 3 : 0);
      }, onContextMenu:aa => sl(t, aa, na, z)}, kb, n("span", {style:{width:"14px", flexShrink:"0", textAlign:"center", color:"#888", fontSize:"9px", cursor:"pointer", userSelect:"none"}, onClick:aa => {
        aa.stopPropagation();
        aa = t.data.state;
        aa.collapsed[na] = !aa.collapsed[na];
        t.l.refresh();
      }}, ea), n("span", {style:{color:"#4ec9b0", overflow:"hidden", textOverflow:"ellipsis"}}, ba), n("span", {style:{color:"#888", marginLeft:"6px", fontSize:"9px"}}, "[" + z.Mb + "]"), F ? n("span", {style:{color:"#555", marginLeft:"4px", fontSize:"9px"}}, "(" + Qk(b, A) + ")") : null), E ? null : n("div", {onMouseDown:() => ol(t, na)}, null, P.oa ? Ll(t, z, na, B, O, z.kc) : null, P.ma ? Ml(t, z, na, I, O, z.Ab) : null, P.na ? Nl(t, z, na, La, O, z.Cb) : null)));
      E && F ? x += 1 + z.ga : x++;
    }
    x = c || 0;
    c = Rk(x, a.A, c, !0);
    l = !!a.collapsed[-1];
    p = !l && c.oa && !!a.lb[x];
    v = !l && c.ma && !!a.Eb[x];
    x = !l && c.na && !!a.Fb[x];
    A = l ? "\u25b6" : "\u25bc";
    F = [n("span", {lid:"rc", style:yl}, "\u2502")];
    c = n("div", null, n("div", {style:{display:"flex", alignItems:"center", height:"20px", paddingLeft:"6px", fontSize:"11px", color:"#9cdcfe", userSelect:"none", cursor:"pointer"}, onClick:() => {
      a.collapsed[-1] = !a.collapsed[-1];
      this.l.refresh();
    }, onContextMenu:z => sl(t, z, -1, d)}, n("span", {style:{width:"14px", flexShrink:"0", textAlign:"center", color:"#888", fontSize:"9px", cursor:"pointer", userSelect:"none"}, onClick:z => {
      z.stopPropagation();
      a.collapsed[-1] = !a.collapsed[-1];
      this.l.refresh();
    }}, A), n("span", {style:{color:"#9cdcfe"}}, "root")), l ? null : n("div", {onMouseDown:() => ol(t, -1)}, Ol(t, d), c.oa ? Ll(t, d, -1, p, F) : null, c.ma ? Ml(t, d, -1, v, F) : null, c.na ? Nl(t, d, -1, x, F) : null));
    return n("div", {tabIndex:"0", onKeyDown:z => xl(t, z), style:{overflowY:"auto", overflowX:"hidden", outline:"none"}}, c, a.collapsed[-1] ? null : r, a.Oa ? $l(t, b, q) : null, m.ha && f && k ? Pc(new Mk({entry:f, entries:g, ia:m.ha.ia, x:m.ha.x, y:m.ha.y, node:k, md:() => {
      m.ha = null;
      this.l.refresh();
    }, refresh:() => this.l.refresh(), Pb:h, he:m.ha})) : null);
  }
}
;const bm = {[0]:"#6af", [1]:"#8d8", [2]:"#fa6", [3]:"#c8a", [4]:"#cc8", [5]:"#aaa"};
const cm = [{U:9, label:"rect", group:0}, {U:13, label:"fRect", group:0}, {U:14, label:"sRect", group:0}, {U:10, label:"rRect", group:0}, {U:1, label:"arc", group:0}, {U:5, label:"ellip", group:0}, {U:22, label:"begin", group:1}, {U:7, label:"move", group:1}, {U:6, label:"line", group:1}, {U:4, label:"close", group:1}, {U:3, label:"bezir", group:1}, {U:8, label:"quad", group:1}, {U:2, label:"arcTo", group:1}, {U:24, label:"fill", group:2}, {U:27, label:"strk", group:2}, {U:23, label:"clip", group:2}, 
{U:43, label:"fClr", group:3}, {U:44, label:"sClr", group:3}, {U:31, label:"lnW", group:3}, {U:28, label:"lnCap", group:3}, {U:30, label:"lnJn", group:3}, {U:50, label:"alpha", group:3}, {U:59, label:"fText", group:4}, {U:63, label:"font", group:4}, {U:42, label:"save", group:5}, {U:41, label:"rest", group:5}, {U:21, label:"trnsl", group:5}, {U:17, label:"rot", group:5}, {U:18, label:"scale", group:5}];
function dm(a) {
  const b = a.data.ji.pe;
  if (b < 0) {
    return -1;
  }
  a = a.N.D();
  return b >= a.length ? -1 : a[b].B;
}
class em extends yi {
  constructor(a, b, c) {
    super(a);
    this.data = b;
    this.N = c;
  }
  g() {
    const a = dm(this) > 0, b = {width:"40px", height:"28px", display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#333", border:"1px solid #555", borderRadius:"3px", cursor:a ? "pointer" : "default", fontSize:"9px", color:"#ccc", userSelect:"none", flexShrink:"0"};
    let c = -1;
    return n("div", {style:{fontFamily:"monospace", fontSize:"11px", padding:"4px", opacity:a ? "1" : "0.3", pointerEvents:a ? "auto" : "none"}}, a ? null : n("div", {style:{color:"#666", fontSize:"10px", padding:"4px"}}, "select an element in Object Tree"), n("div", {style:{display:"flex", flexWrap:"wrap", gap:"2px", alignItems:"center"}}, cm.map((d, e) => {
      const f = d.group !== c && c >= 0;
      c = d.group;
      var g = bm[d.group] || "#ccc";
      g = n("div", {lid:d.U, onClick:() => {
        var h = d.U, k = dm(this);
        if (!(k <= 0)) {
          k = fh(this.N.g.G(k));
          var m = k.R;
          switch(h) {
            case 22:
              m.beginPath();
              break;
            case 4:
              m.closePath();
              break;
            case 24:
              m.fill();
              break;
            case 27:
              m.stroke();
              break;
            case 42:
              m.save();
              break;
            case 41:
              m.restore();
              break;
            case 23:
              m.clip();
              break;
            case 9:
              m.rect(0, 0, 100, 100);
              break;
            case 13:
              m.fillRect(0, 0, 100, 100);
              break;
            case 14:
              m.strokeRect(0, 0, 100, 100);
              break;
            case 12:
              m.clearRect(0, 0, 100, 100);
              break;
            case 7:
              m.moveTo(0, 0);
              break;
            case 6:
              m.lineTo(100, 100);
              break;
            case 1:
              m.arc(50, 50, 50, 0, 2 * Math.PI, !1);
              break;
            case 5:
              m.ellipse(50, 50, 50, 30, 0, 0, 2 * Math.PI, !1);
              break;
            case 21:
              m.translate(0, 0);
              break;
            case 17:
              m.rotate(0);
              break;
            case 18:
              m.scale(1, 1);
              break;
            case 19:
              m.setTransform(1, 0, 0, 1, 0, 0);
              break;
            case 16:
              m.resetTransform();
              break;
            case 31:
              m.lineWidth = 1;
              break;
            case 43:
              m.fillStyle = 0;
              break;
            case 44:
              m.strokeStyle = 0;
              break;
            case 50:
              m.globalAlpha = 1;
          }
          k.end();
        }
      }, title:vk[d.U] || "", style:Object.assign({}, b, {borderColor:g + "44"})}, n("span", {style:{color:g}}, d.label));
      return f ? n("div", {lid:"g" + e, style:{display:"contents"}}, n("div", {style:{width:"1px", height:"20px", backgroundColor:"#444", margin:"0 2px", flexShrink:"0"}}), g) : g;
    })));
  }
}
;const fm = {display:"flex", alignItems:"center", height:"22px", whiteSpace:"nowrap"}, gm = {width:"14px", textAlign:"center", cursor:"pointer", color:"#888", fontSize:"9px", flexShrink:"0"}, hm = {width:"16px", textAlign:"center", cursor:"pointer", color:"#6af", fontSize:"12px", flexShrink:"0"}, im = {color:"#888", fontSize:"10px", flexShrink:"0"}, jm = {width:"16px", textAlign:"center", cursor:"pointer", color:"#8aa", fontSize:"11px", flexShrink:"0"}, km = {padding:"3px 8px", fontSize:"11px", cursor:"pointer", 
background:"#5a2a2a", color:"#f0c0c0", border:"1px solid #844", borderRadius:"3px"}, lm = {padding:"3px 8px", fontSize:"11px", cursor:"pointer", background:"#3a3a3a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"3px"};
function mm(a) {
  a.data.flush();
  a.l.refresh();
}
function nm(a, b) {
  Mi(a.data.state.A, b, "nova categoria");
  mm(a);
}
function om(a) {
  a = a.data.state.ud || {};
  const b = [];
  for (const c in a) {
    a[c] && b.push(c);
  }
  return b;
}
function pm(a) {
  const b = a.data.state.A;
  var c = om(a);
  if (c.length && a.h) {
    var d = [], e = [];
    for (var f = 0; f < c.length; f++) {
      var g = c[f];
      const p = g.indexOf(":"), r = g.slice(0, p);
      g = g.slice(p + 1);
      r === "cat" && d.push(g);
      r === "item" && e.push(g);
    }
    var h = e.slice();
    for (c = 0; c < d.length; c++) {
      for (e = Ri(b, d[c]), f = 0; f < e.length; f++) {
        h.indexOf(e[f]) < 0 && h.push(e[f]);
      }
    }
    var k = a.h, m = a.data.state, l = () => {
      for (let p = 0; p < d.length; p++) {
        Oi(b, d[p]);
      }
      m.ud = {};
      a.data.flush();
      k.refresh();
    };
    h.length ? jl(il.zh, void 0, p => {
      if (p) {
        for (let q = 0; q < h.length; q++) {
          if (Ug(k.g, h[q])) {
            p = b;
            var r = h[q];
            delete p.assign[r];
            delete p.names[r];
            Fh(h[q]);
          }
        }
        l();
      } else {
        console.warn("excluir: pasta nao autorizada \u2014 nada foi apagado");
      }
    }) : l();
  }
}
function qm(a, b) {
  var c = a.data.state.A;
  const d = Cl(b.Qh, b.depth, b.fi);
  c = b.Xe ? n("span", {lid:"ca", style:gm, onClick:() => {
    var l = a.data.state.A, p = b.id;
    l.collapsed[p] = !l.collapsed[p];
    mm(a);
  }}, c.collapsed[b.id] ? "\u25b6" : "\u25bc") : n("span", {lid:"ca", style:gm}, "");
  var e = b.kind === "cat", f = b.kind === "item" && a.W[b.uuid] === 513, g = e || b.kind === "item" && !f;
  e = e ? {background:"transparent", border:"1px solid transparent", color:"#7fd1e0", fontWeight:"bold", fontSize:"13px", letterSpacing:"0.4px", textTransform:"uppercase", padding:"1px 3px", flex:"1", minWidth:"0", outline:"none"} : {background:"transparent", border:"1px solid transparent", color:"#d0d0d0", fontWeight:"normal", fontSize:"11px", fontFamily:"monospace", padding:"1px 3px", flex:"1", minWidth:"0", outline:"none"};
  f = g ? n("input", {lid:"nm", value:b.name, onInput:l => {
    b.kind === "cat" && Ni(a.data.state.A, b.id, l.currentTarget.value);
  }, onChange:l => {
    b.kind === "cat" ? mm(a) : a.h && (l = l.currentTarget.value, l !== b.name && (Lg(a.h.g, b.uuid, l), delete a.data.state.A.names[b.uuid], mm(a)));
  }, onMouseDown:l => l.stopPropagation(), style:e}) : f ? n("span", {lid:"nm", title:"funcao de buffer", style:{fontWeight:"normal", color:"#d9b06a", flex:"1", fontSize:"11px", fontFamily:"monospace", padding:"1px 3px"}}, "\u0192 " + b.name) : n("span", {lid:"nm", style:{fontWeight:"bold", color:"#9ab", flex:"1", fontSize:"13px", letterSpacing:"0.4px"}}, b.name);
  g = g ? n("span", {lid:"sel", title:"selecionar", style:jm, onClick:() => {
    const l = a.data.state.ud;
    l[b.key] ? delete l[b.key] : l[b.key] = !0;
    a.l.refresh();
  }}, a.data.state.ud[b.key] ? "\u2611" : "\u2610") : n("span", {lid:"sel", style:jm}, "");
  e = [];
  b.kind !== "all" && b.kind !== "cat" || e.push(n("span", {lid:"add", title:"nova subcategoria", style:hm, onClick:() => nm(a, b.id)}, "+"));
  b.kind === "cat" && e.push(n("span", {lid:"del", title:"remover categoria", style:hm, onClick:() => {
    Oi(a.data.state.A, b.id);
    mm(a);
  }}, "\u00d7"));
  const h = b.count > 0 ? n("span", {lid:"cnt", style:im}, "(" + b.count + ")") : null, k = b.kind === "item" || b.kind === "cat" ? "true" : "false", m = a.data.state.ud[b.key] ? Object.assign({}, fm, {background:"#2d3a44"}) : fm;
  return n("div", {lid:b.key, draggable:k, onDragStart:l => a.onDragStart(l, b), onDragOver:l => a.onDragOver(l), onDrop:l => a.onDrop(l, b), style:m}, d, c, g, f, h, e);
}
class rm extends yi {
  constructor(a, b, c) {
    super(a);
    this.data = b;
    this.h = c;
    this.W = {};
    a = b.state;
    c && !a.ed && (a.ed = !0, a.lf = c.gb(() => c.refresh()), nh(c.h));
  }
  onDragStart(a, b) {
    this.data.state.Se = {kind:b.kind, id:b.id};
  }
  onDragOver(a) {
    a.preventDefault();
  }
  onDrop(a, b) {
    a.preventDefault();
    if (b.kind !== "item" && (a = this.data.state.Se)) {
      var c = this.data.state.A;
      a.kind === "item" ? Pi(c, a.id, b.kind === "cat" ? b.id : "__unclassified__") : a.kind === "cat" && Qi(c, a.id, b.id);
      this.data.state.Se = null;
      mm(this);
    }
  }
  g() {
    var a = this.data.state, b = Li(a.A);
    a.A = b;
    var c = this.h ? Tg(this.h.g) : [];
    a = [];
    const d = {}, e = {};
    for (let f = 0; f < c.length; f++) {
      a.push(c[f].uuid), c[f].name && (d[c[f].uuid] = c[f].name), e[c[f].uuid] = c[f].Ne;
    }
    this.W = e;
    b = Si(b, a, d);
    c = om(this).length;
    return n("div", {style:{fontSize:"12px", color:"#e0e0e0"}}, n("div", {style:{display:"flex", gap:"6px", alignItems:"center", marginBottom:"6px"}}, n("button", {onClick:() => nm(this, "__all__"), style:lm}, "+ categoria"), n("span", {style:{color:"#888", fontSize:"11px"}}, a.length + " classes"), c ? n("div", {style:{marginLeft:"auto", display:"flex", gap:"6px", alignItems:"center"}}, n("span", {style:{color:"#888", fontSize:"11px"}}, c + " sel."), n("button", {onClick:() => pm(this), style:km}, 
    "excluir")) : null), n("div", null, b.map(f => qm(this, f))));
  }
}
;function sm(a) {
  const b = a.uuid();
  if (b === "ad63103a-f305-48f6-b78c-1489905b045b") {
    var c = a.Ob(0);
    for (var d in Af) {
      if (Af[d] === c) {
        return "editor." + d;
      }
    }
    return "editor.tipo=" + c;
  }
  if (b) {
    return b;
  }
  d = a.id();
  for (c in Bf) {
    if (Bf[c] === d) {
      return c;
    }
  }
  return "id=" + d;
}
function tm(a, b) {
  const c = a.g;
  let d = null;
  const e = {za:b.name, uuid:b.uuid, fe:b.sg, Nd:b.loaded, Gf:b.Ne, get G() {
    d ||= new Wg(c.g, "u:" + e.uuid);
    return d;
  }, info() {
    const f = Tg(c.g).find(g => g.uuid === e.uuid);
    if (!f) {
      return console.warn("[ploftDev] classe nao esta mais no catalogo:", e.uuid), e;
    }
    e.za = f.name;
    e.fe = f.sg;
    e.Nd = f.loaded;
    e.Gf = f.Ne;
    console.log("[ploftDev]", e.za || "(sem nome)", "\u00b7 uuid", e.uuid, "\u00b7 instancias:", e.fe, "\u00b7 carregada:", e.Nd);
    return e;
  }, Qe() {
    const f = ch(e.G);
    f.length ? console.table(f.map((g, h) => ({Zb:h, oc:g.name, Bi:mg(g)}))) : console.log("[ploftDev] buffer sem comandos");
  }, Ye(f, g) {
    if (typeof f !== "function") {
      return !1;
    }
    g === void 0 ? f = gh(e.G, f) : (g = fh(e.G, g), f(g.R), g.end(), f = !0);
    c.refresh();
    return f;
  }, mj(f) {
    const g = Lg(c.g, e.uuid, f || "");
    g && (e.za = f || "", c.refresh());
    return g;
  }, ee(f) {
    a.ee(e.uuid, f);
  }, oj() {
    jl(il.rf, void 0, f => {
      if (f) {
        f = ah(e.G);
        var g = Date.now();
        mh(c.h, e.uuid, f, g) ? (Eh(e.uuid, f, g), console.log("[ploftDev] salvo", f || e.uuid, "\u2192 " + e.uuid + ".gbuf")) : console.warn("[ploftDev] salvar: filestore recusou");
      } else {
        console.warn("[ploftDev] salvar: pasta nao autorizada");
      }
    });
    return !0;
  }, flush() {
    const f = $g(e.G);
    if (!f) {
      return console.warn("[ploftDev] flush: sem buffer"), !1;
    }
    Hg(c.g, e.uuid, f.rd);
    c.refresh();
    console.log("[ploftDev] definicao re-publicada:", e.za || e.uuid);
    return !0;
  }, Ni() {
    const f = Ug(c.g, e.uuid);
    console.log("[ploftDev] apagar", e.za || e.uuid, "\u2192", f);
    f && c.refresh();
    return f;
  }};
  return e;
}
function um(a, b) {
  const c = a.g.D();
  let d = null;
  if (typeof b === "number") {
    d = c.find(e => e.B === b) || null;
  } else {
    const e = String(b);
    d = c.find(f => f.uuid && (f.uuid === e || Kg(a.g.g, f.uuid) === e)) || c.find(f => f.uuid && f.uuid.lastIndexOf(e, 0) === 0) || null;
  }
  d || console.warn("[ploftDev] instancia nao encontrada:", b, "\u2014 veja ploftDev.listar()");
  return d;
}
class vm {
  constructor(a, b) {
    this.g = a;
    this.h = b;
  }
  Ef() {
    console.log("[ploftDev] console da INTEGRA do sistema:\n\n\u2500\u2500 DEFINICOES (classes) \u2014 def e inst separados, como no codigo \u2500\u2500\n  const b = ploftDev.classe('estrela')   -> abre a definicao (ScopedBuild)\n      b.ctx.fillStyle='#fa0'; b.ctx.fillRect(0,0,50,50)   (Canvas2D-like)\n      b.calc.alloc.local(40, \"px\")             -> variavel ([]vars, ref NaN)\n      b.self.add_coded_event(...)        -> eventos (ver dev_gralm_cmds.js)\n      b.end()                            -> fecha a definicao\n  ploftDev.publicar()                    -> registra a classe (defineClass)\n  ploftDev.instanciar('estrela')         -> poe na cena (createInstance)\n\n\u2500\u2500 CATALOGO (classes como ITENS \u2014 explorar/editar/salvar) \u2500\u2500\n  ploftDev.classes()                     -> tabela + Array<item>\n  const c = ploftDev.pegarClasse('estrela')   (nome, uuid ou prefixo)\n      c.info()          -> atualiza/mostra (instancias, carregada...)\n      c.def.*           -> BUFFER da classe (readCmds/readVars/setCmdParam...)\n      c.comandos()      / c.inserir(ctx=>{...}, pos?)\n          (editar via def.* JA propaga ao WASM a cada operacao)\n      c.renomear('n')   / c.instanciar()  / c.apagar()\n      c.salvar()        -> grava <uuid>.gbuf na pasta (gate; 1a vez pede pasta)\n      c.flush()         -> re-publica o buffer (so apos edicao crua no rec)\n\n\u2500\u2500 INSTANCIAS VIVAS (cena) \u2500\u2500\n  ploftDev.listar()                      -> tabela das instancias rodando\n  const n = ploftDev.pegar('estrela')    -> TreeNode (ou por gralmPtr/uuid)\n      n.def.*  -> BUFFER da classe (readCmds/readVars/readName/insert...)\n      n.inst.* -> instancia viva (focus/selectCmd/copyTreeJson...)\n  ploftDev.comandos(n_ou_sel)            -> lista os comandos do buffer\n  ploftDev.inserir(sel, ctx=>{...}, pos?) -> insere desenho (fim ou pos)\n\n\u2500\u2500 atalhos \u2500\u2500\n  ploftDev.exemplo() / novoElemento() / addRetangulo(ref,x,y,w,h,cor)");
  }
  Pf(a) {
    this.h.pd && console.warn('[ploftDev] ja ha uma definicao aberta ("' + this.h.pd.za + '") \u2014 publique-a (ploftDev.publicar()) ou descarte com ploftDev.publicar() apos b.end().');
    const b = Ue(), c = new zf(), d = c.Bb(b);
    a && d.name(a);
    this.h.pd = {uuid:b, za:a || "", rd:c};
    console.log("[ploftDev] definicao aberta", a || b, "\u2014 desenhe em b.ctx / b.calc / b.evt / b.self, feche com b.end() e registre com ploftDev.publicar()");
    return d;
  }
  Gg() {
    const a = this.h.pd;
    if (!a) {
      return console.warn("[ploftDev] nada aberto \u2014 comece com ploftDev.classe()"), !1;
    }
    if (!a.rd.L.some(b => b.g === 6 && b.m === 11)) {
      return console.warn("[ploftDev] faltou b.end() \u2014 feche a definicao antes de publicar"), !1;
    }
    Hg(this.g.g, a.uuid, a.rd);
    this.h.pd = null;
    console.log("[ploftDev] classe publicada:", a.za || a.uuid, "\u2014 instancie com ploftDev.instanciar('" + (a.za || a.uuid) + "')");
    this.g.refresh();
    return !0;
  }
  Qf() {
    const a = Tg(this.g.g).map(b => tm(this, b));
    console.table(a.map(b => ({za:b.za || "(sem nome)", xj:b.Gf === 513 ? "\u0192 funcao" : "classe", uuid:b.uuid, fe:b.fe, Nd:b.Nd})));
    a.length && console.log("[ploftDev] itens no retorno \u2014 ex: const c = ploftDev.pegarClasse('" + (a[0].za || a[0].uuid) + "'); c.info() / c.def.* / c.comandos() / c.inserir(fn) / c.salvar()");
    return a;
  }
  Eg(a) {
    const b = String(a);
    var c = Tg(this.g.g);
    c = c.find(d => d.uuid === b || d.name === b) || c.find(d => d.uuid.lastIndexOf(b, 0) === 0) || null;
    if (!c) {
      return console.warn("[ploftDev] classe nao encontrada:", a, "\u2014 veja ploftDev.classes()"), null;
    }
    a = tm(this, c);
    console.log("[ploftDev]", a.za || a.uuid, "\u2014 c.def.* (buffer) \u00b7 comandos() \u00b7 inserir(fn,pos?) \u00b7 renomear(n) \u00b7 instanciar() \u00b7 salvar() \u00b7 flush() \u00b7 apagar() \u00b7 info() atualiza");
    return a;
  }
  ee(a, b) {
    const c = Tg(this.g.g).find(d => d.uuid === a || d.name === a);
    c ? (b = lh(this.g.h, c.uuid, b || Jf(this.g.h)), this.g.o(b, (d, e) => {
      d === 1 && e ? console.log("[ploftDev] instanciado", c.name || c.uuid, "\u2192 gralmPtr", e) : console.warn("[ploftDev] instanciar falhou:", a);
    })) : console.warn("[ploftDev] classe nao encontrada:", a, "\u2014 veja ploftDev.classes()");
  }
  ug() {
    const a = this.g.D();
    console.table(a.map((b, c) => ({Zb:c, B:b.B, za:b.uuid ? Kg(this.g.g, b.uuid) || "" : "(internal)", uuid:b.uuid, L:b.Ab, Xi:b.ga, Wi:b.Cb})));
  }
  Dg(a) {
    (a = um(this, a)) && console.log("[ploftDev] n.def.* = buffer da classe (readCmds/readVars/readName/insert/beginInsert...); n.inst.* = instancia viva (focus/selectCmd...)");
    return a;
  }
  Qe(a) {
    if (a = um(this, a)) {
      a = ch(a.G), a.length ? console.table(a.map((b, c) => ({Zb:c, oc:b.name, Bi:mg(b)}))) : console.log("[ploftDev] buffer sem comandos");
    }
  }
  Ye(a, b, c) {
    a = um(this, a);
    if (!a || typeof b !== "function") {
      return !1;
    }
    c === void 0 ? b = gh(a.G, b) : (a = fh(a.G, c), b(a.R), a.end(), b = !0);
    this.g.refresh();
    console.log("[ploftDev] inserir", c === void 0 ? "(fim)" : "@" + c, "\u2192", b);
    return b;
  }
  zg() {
    const a = If(this.g).h();
    if (!a) {
      return console.warn("[ploftDev] novoElemento falhou (editor ativo?)"), null;
    }
    const b = "e" + this.h.seq++, c = this.h;
    c.ec[b] = 0;
    this.g.o(a, (d, e) => {
      d === 1 && e ? (c.ec[b] = e, console.log("[ploftDev] novo elemento " + b + " (gralmPtr " + e + ")")) : (console.warn("[ploftDev] novoElemento falhou:", b), delete c.ec[b]);
    });
    return b;
  }
  Le(a, b) {
    const c = this.h.ec[a];
    if (!c) {
      return console.warn("[ploftDev] ref sem ptr ainda (a criacao e assincrona) ou desconhecida: " + a), !1;
    }
    b = gh(this.g.i(c).G, b);
    this.g.refresh();
    console.log("[ploftDev] comando adicionado a " + a + ":", b);
    return b;
  }
  Me(a, b, c, d, e, f) {
    return this.Le(a, g => {
      g.fillStyle = f || "#e33";
      g.fillRect(b, c, d, e);
    });
  }
  Te() {
    const a = If(this.g).h(), b = "e" + this.h.seq++, c = this.h;
    c.ec[b] = 0;
    const d = this;
    this.g.o(a, (e, f) => {
      e === 1 && f && (c.ec[b] = f, d.Me(b, 0, 0, 60, 40, "#e33"));
    });
    return b;
  }
}
function wm(a) {
  return {Ef:() => a.Ef(), Pf:b => a.Pf(b), Gg:() => a.Gg(), Qf:() => a.Qf(), Eg:b => a.Eg(b), ee:(b, c) => a.ee(b, c), ug:() => a.ug(), Dg:b => a.Dg(b), Qe:b => a.Qe(b), Ye:(b, c, d) => a.Ye(b, c, d), zg:() => a.zg(), Le:(b, c) => a.Le(b, c), Me:(b, c, d, e, f, g) => a.Me(b, c, d, e, f, g), Te:() => a.Te()};
}
function xm(a, b) {
  if (b.N !== a) {
    b.ce && (b.ce.unregister(), b.ce = null);
    b.N = a;
    b.ec = {};
    var c = a.j, d = a.H;
    c && d && (b.ce = Gf(c, d, {Ib:e => {
      b.bf++;
      b.ge = sm(e) + " (ptr " + e.F() + ")";
      console.log("[ploftDev] notificacao:", b.ge);
      a.refresh();
    }, Jb:(e, f) => {
      console.log("[ploftDev] set_data", e, "=", f);
    }}));
    c = new vm(a, b);
    b.Ff = c;
    window.ploftDev = wm(c);
    console.log("%c[ploftDev] pronto \u2014 digite ploftDev.ajuda()", "color:#6af;font-weight:bold");
  }
}
;const ym = {padding:"4px 10px", fontSize:"11px", cursor:"pointer", background:"#3a3a3a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"3px"};
class zm extends yi {
  constructor(a, b, c) {
    super(a);
    this.data = b;
    c && xm(c, this.data.state);
  }
  g() {
    const a = this.data.state;
    return n("div", {style:{fontSize:"12px", color:"#e0e0e0", lineHeight:"1.5"}}, n("div", {style:{marginBottom:"4px"}}, n("span", {style:{color:"#6af"}}, "\u25cf"), " controle-modelo vivo"), n("div", {style:{fontSize:"11px", color:"#aaa", marginBottom:"6px"}}, "API no console: ", n("span", {style:{color:"#cd9", fontFamily:"monospace"}}, "ploftDev.ajuda()")), n("button", {onClick:() => {
      const b = this.data.state.Ff;
      b && b.Te();
      this.l.refresh();
    }, style:ym}, "criar exemplo"), n("div", {style:{marginTop:"8px", fontSize:"11px", color:"#888"}}, "notificacoes recebidas: " + a.bf), a.ge ? n("div", {style:{fontSize:"10px", color:"#666"}}, "ultima: " + a.ge) : null);
  }
}
;const Am = {padding:"3px 8px", fontSize:"11px", cursor:"pointer", background:"#3a3a3a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"3px"}, Bm = {display:"flex", alignItems:"center", gap:"6px", height:"22px", whiteSpace:"nowrap"}, Cm = {flex:"1", minWidth:"0", overflow:"hidden", textOverflow:"ellipsis", color:"#e0e0e0", fontSize:"12px"}, Dm = {flex:"1", minWidth:"0", overflow:"hidden", textOverflow:"ellipsis", color:"#888", fontSize:"10px", fontFamily:"monospace"}, Em = {color:"#777", 
fontSize:"10px", flexShrink:"0"}, Fm = {cursor:"pointer", color:"#6af", fontSize:"11px", flexShrink:"0"};
function Gm(a) {
  if (a.h) {
    var b = a.h, c = a.data.state;
    c.loading = !0;
    c.msg = "";
    b.refresh();
    jl(il.Ch, void 0, d => {
      d ? nh(b.h) : (c.loading = !1, c.msg = "pasta nao autorizada", b.refresh());
    });
  }
}
function Hm(a, b) {
  if (a.h) {
    var c = a.h, d = a.data.state;
    d.msg = "carregando " + (b.name || b.uuid) + "...";
    c.refresh();
    jl(il.Dh, void 0, e => {
      if (e) {
        if (e = c.h, e.h && e.g) {
          var f = e.h, g = f.H.encode(b.uuid), h = f.j(g.length + 1);
          f.g.set(g, h);
          f.g[h + g.length] = 0;
          Ge(e.g, e.i, 34, [h], []);
          f.o(h);
        }
      } else {
        d.msg = "pasta nao autorizada", c.refresh();
      }
    });
  }
}
function Im(a, b) {
  if (a.h) {
    var c = a.h, d = a.data.state;
    a = Tg(c.g).find(e => e.uuid === b.uuid);
    d.msg = "criando " + (b.name || b.uuid) + "...";
    c.refresh();
    jl(il.we, {loaded:!(!a || !a.loaded)}, e => {
      e ? (e = lh(c.h, b.uuid, Jf(c.h)), c.o(e, (f, g) => {
        d.msg = f === 1 && g ? "instanciado: " + (b.name || b.uuid) : "falhou: " + (b.name || b.uuid);
        c.refresh();
      })) : (d.msg = "pasta nao autorizada", c.refresh());
    });
  }
}
function Jm(a) {
  if (!a) {
    return "";
  }
  a = new Date(a);
  const b = c => c < 10 ? "0" + c : "" + c;
  return b(a.getDate()) + "/" + b(a.getMonth() + 1) + " " + b(a.getHours()) + ":" + b(a.getMinutes());
}
function Km(a, b) {
  const c = b.name ? n("span", {lid:"nm", style:Cm, title:b.uuid}, b.name) : n("span", {lid:"nm", style:Dm}, b.uuid);
  return n("div", {lid:b.uuid, style:Bm}, c, n("span", {style:Em}, Jm(b.td)), n("span", {onClick:() => Hm(a, b), style:Fm, title:"registra a definicao (nao instancia)"}, "carregar"), n("span", {onClick:() => Im(a, b), style:Fm, title:"carrega e instancia na raiz"}, "+ cena"));
}
class Lm extends yi {
  constructor(a, b, c) {
    super(a);
    this.data = b;
    this.h = c;
    const d = this.data.state;
    c && !d.vg && (d.vg = !0, d.Fi = c.gb(e => {
      d.loading = !1;
      d.files = e;
      d.msg = e.length ? "" : "pasta vazia (ou nao conectada)";
      c.refresh();
    }));
  }
  g() {
    const a = this.data.state;
    return n("div", {style:{fontSize:"12px", color:"#e0e0e0"}}, n("div", {style:{display:"flex", gap:"6px", alignItems:"center", marginBottom:"6px"}}, n("button", {onClick:() => Gm(this), style:Am}, a.files.length ? "atualizar" : "abrir pasta"), n("span", {style:{color:"#888", fontSize:"11px"}}, a.loading ? "lendo..." : a.files.length + " arquivo(s)")), a.msg ? n("div", {style:{color:"#997", fontSize:"11px", marginBottom:"4px"}}, a.msg) : null, n("div", null, a.files.map(b => Km(this, b))));
  }
}
;function Mm(a) {
  return "svg/collections/" + a;
}
function Nm(a, b) {
  a = Om(a, b.id);
  b = 0;
  for (const c in a) {
    b = Math.max(b, parseInt(c, 10));
  }
  return b + 1;
}
function Om(a, b) {
  const c = {}, d = new Set(), e = f => {
    if (!d.has(f)) {
      d.add(f);
      var g = a.find(h => h.id === f);
      if (g) {
        for (const h of g.includes || []) {
          e(h);
        }
        for (const h in g.slots) {
          c[h] = g.slots[h];
        }
      }
    }
  };
  e(b);
  return c;
}
async function Pm(a, b) {
  return (a = await bl(a, Mm(b) + "/manifest.json")) && a.uuid === b ? a : null;
}
async function Qm(a, b) {
  return cl(a, Mm(b.uuid) + "/manifest.json", b);
}
async function Rm(a) {
  return (a = await bl(a, "svg/schemas.json")) ? a.schemas || [] : [];
}
async function Sm(a, b) {
  return cl(a, "svg/schemas.json", {schemas:b});
}
function Tm(a, b) {
  return (a = a.find(c => c.id === b)) ? a.name || a.id : "";
}
var Um = Om;
function Vm(a, b, c) {
  a = Nm(a, b);
  b.slots[String(a)] = c;
}
function Wm(a, b, c, d) {
  if (c === d || d < 1) {
    return !1;
  }
  c = String(c);
  d = String(d);
  if (!(c in b.slots)) {
    return !1;
  }
  const e = b.slots[c];
  if (d in b.slots) {
    return b.slots[c] = b.slots[d], b.slots[d] = e, !0;
  }
  for (const f of b.includes || []) {
    if (d in Om(a, f)) {
      return !1;
    }
  }
  delete b.slots[c];
  b.slots[d] = e;
  return !0;
}
function Xm(a, b, c) {
  if (c === b.id) {
    return !1;
  }
  b.includes || (b.includes = []);
  if (b.includes.indexOf(c) >= 0) {
    return !1;
  }
  const d = new Set(), e = f => {
    if (f === b.id) {
      return !0;
    }
    if (d.has(f)) {
      return !1;
    }
    d.add(f);
    const g = a.find(h => h.id === f);
    if (!g) {
      return !1;
    }
    for (const h of g.includes || []) {
      if (e(h)) {
        return !0;
      }
    }
    return !1;
  };
  if (e(c)) {
    return !1;
  }
  b.includes.push(c);
  return !0;
}
function Ym(a, b) {
  a = a.filter(c => c.id !== b);
  for (const c of a) {
    c.includes && (c.includes = c.includes.filter(d => d !== b));
  }
  return a;
}
function Zm(a, b, c) {
  const d = new Set(), e = f => {
    if (f === c) {
      return !0;
    }
    if (d.has(f)) {
      return !1;
    }
    d.add(f);
    const g = a.find(h => h.id === f);
    if (!g) {
      return !1;
    }
    for (const h of g.includes || []) {
      if (e(h)) {
        return !0;
      }
    }
    return !1;
  };
  return e(b);
}
async function $m(a) {
  const b = [];
  var c = await dl(a);
  for (const d of c) {
    (c = await Pm(a, d)) && b.push(c);
  }
  return b;
}
async function an(a, b, c, d) {
  if (!b) {
    return null;
  }
  b = {uuid:b, name:c, schemaId:d, catId:"", slots:{}};
  return await Qm(a, b) ? b : null;
}
async function bn(a, b) {
  await fl(a, Mm(b));
}
async function cn(a, b, c, d) {
  const e = "slot_" + c + ".svg";
  if (!await Yk(a, Mm(b.uuid) + "/slots/" + e, d)) {
    return !1;
  }
  b.slots[String(c)] = e;
  return Qm(a, b);
}
async function dn(a, b, c) {
  const d = b.slots[String(c)];
  d && (await el(a, Mm(b.uuid) + "/slots/" + d), delete b.slots[String(c)]);
  return Qm(a, b);
}
async function en(a, b, c) {
  return (c = b.slots[String(c)]) ? Xk(a, Mm(b.uuid) + "/slots/" + c) : null;
}
;function fn(a) {
  return typeof a.stat === "function" ? a : null;
}
async function gn(a, b) {
  let c = 0;
  const d = async() => {
    for (; c < a.length;) {
      await b(a[c++]);
    }
  }, e = [];
  for (let f = 0; f < Math.min(6, a.length); f++) {
    e.push(d());
  }
  await Promise.all(e);
}
async function hn(a) {
  const b = new Map(), c = new Map(), d = async(e, f) => {
    for await (const g of e.values()) {
      if (e = f + g.name, g.kind === "directory") {
        const h = g;
        c.set(e, h);
        await d(h, e + "/");
      } else {
        b.set(e, g);
      }
    }
  };
  await d(a, "");
  return {files:b, Td:c};
}
async function jn(a, b) {
  if (!b) {
    return a;
  }
  for (const c of b.split("/")) {
    a = await a.getDirectoryHandle(c, {create:!0});
  }
  return a;
}
function kn(a) {
  const b = a.lastIndexOf("/");
  return b >= 0 ? a.slice(0, b) : "";
}
function ln(a) {
  const b = a.lastIndexOf("/");
  return b >= 0 ? a.slice(b + 1) : a;
}
async function mn(a, b) {
  var c = fn(a), d = fn(b);
  if (c && d && (c = await c.stat(), d = await d.stat(), c && d)) {
    return c.size === d.size && c.hash === d.hash;
  }
  a = await a.getFile();
  d = await b.getFile();
  if (a.size !== d.size) {
    return !1;
  }
  b = new Uint8Array(await a.arrayBuffer());
  a = new Uint8Array(await d.arrayBuffer());
  for (d = 0; d < b.length; d++) {
    if (b[d] !== a[d]) {
      return !1;
    }
  }
  return !0;
}
async function nn(a) {
  const b = fn(a);
  return b ? (a = await b.stat()) ? a.size + "/" + (a.hash >>> 0).toString(16).padStart(8, "0") : "(nao existe)" : (await a.getFile()).size + "/?";
}
async function on(a, b) {
  a = await a.getFile();
  a = new Uint8Array(await a.arrayBuffer());
  b = await b.createWritable();
  await b.write(a);
  await b.close();
}
async function pn(a, b, c, d, e) {
  const f = {Yf:0, qh:0, Re:0, cb:0, errors:[], items:[]};
  d && d("listando...");
  const g = await hn(a), h = await hn(b);
  for (const p of g.Td.keys()) {
    if (!h.Td.has(p)) {
      try {
        await jn(b, p);
      } catch (r) {
        f.errors.push(p + ": " + (r && r.message || r));
      }
    }
  }
  a = [];
  for (const p of g.files.keys()) {
    e && !e(p) || a.push(p);
  }
  let k = 0;
  const m = a.length;
  await gn(a, async p => {
    const r = g.files.get(p);
    var q = ++k + "/" + m + " " + p;
    d && d(q);
    try {
      const v = h.files.get(p);
      if (v) {
        await mn(r, v) ? f.cb++ : (f.items.push("atualizado " + p + ": destino " + await nn(v) + " != origem " + await nn(r)), await on(r, v), f.qh++);
      } else {
        f.items.push("copiado " + p + ": so na origem");
        const t = await (await jn(b, kn(p))).getFileHandle(ln(p), {create:!0});
        await on(r, t);
        f.Yf++;
      }
    } catch (v) {
      f.errors.push(p + ": " + (v && v.message || v));
    }
  });
  if (c === 2) {
    c = [];
    for (var l of h.Td.keys()) {
      g.Td.has(l) || c.push(l);
    }
    c.sort();
    l = [];
    for (const p of c) {
      l.some(r => p.startsWith(r + "/")) || l.push(p);
    }
    for (const p of h.files.keys()) {
      if (!g.files.has(p) && !l.some(r => p.startsWith(r + "/"))) {
        d && d("apagando " + p);
        f.items.push("apagado " + p + ": so no destino");
        try {
          await (await jn(b, kn(p))).removeEntry(ln(p)), f.Re++;
        } catch (r) {
          f.errors.push(p + ": " + (r && r.message || r));
        }
      }
    }
    for (const p of l) {
      d && d("apagando " + p + "/");
      f.items.push("apagado " + p + "/: so no destino");
      try {
        await (await jn(b, kn(p))).removeEntry(ln(p), {recursive:!0}), f.Re++;
      } catch (r) {
        f.errors.push(p + "/: " + (r && r.message || r));
      }
    }
  }
  d && d("");
  return f;
}
function qn(a) {
  let b = a.Yf + " copiados, " + a.qh + " atualizados, " + a.Re + " apagados, " + a.cb + " iguais";
  a.errors.length && (b += ", " + a.errors.length + " erros");
  return b;
}
;const rn = {zd:"ploft.vfs", Nc:"/", Eh:"local"}, sn = {svg:"image/svg+xml", json:"application/json", txt:"text/plain", png:"image/png", jpg:"image/jpeg", jpeg:"image/jpeg", gif:"image/gif", webp:"image/webp", db:"application/octet-stream", gbuf:"application/octet-stream", csv:"text/csv", html:"text/html", js:"text/javascript"};
function tn(a) {
  const b = a.lastIndexOf(".");
  return sn[b >= 0 ? a.slice(b + 1).toLowerCase() : ""] || "application/octet-stream";
}
function un(a) {
  const b = a.lastIndexOf("/");
  return b >= 0 ? a.slice(b + 1) : a;
}
function vn(a) {
  let b = 2166136261;
  for (let c = 0; c < a.length; c++) {
    b ^= a[c], b = Math.imul(b, 16777619) >>> 0;
  }
  return b >>> 0;
}
async function wn(a) {
  a.Xa || (a.Xa = a.h.init());
  await a.Xa;
}
async function xn(a, b) {
  await wn(a);
  await a.h.g(b);
  a.g && (a.g = a.g.filter(c => c !== b));
}
class yn {
  constructor() {
    this.h = new xa(zn ? rn.zd + "-" + zn : rn.zd);
    this.i = this.g = this.Xa = null;
  }
  $a(a, b) {
    this.i && this.i(a, b);
  }
  async keys() {
    await wn(this);
    this.g || (this.g = await this.h.j() || []);
    return this.g;
  }
  async get(a) {
    await wn(this);
    return (a = await this.h.get(a)) && typeof a === "object" ? a : null;
  }
  async set(a, b) {
    await wn(this);
    await this.h.set(a, b);
    this.g && this.g.indexOf(a) < 0 && this.g.push(a);
  }
  async clear() {
    await wn(this);
    await this.h.clear();
    this.g = [];
  }
}
class An {
  constructor(a, b) {
    this.kind = "file";
    this.name = un(b);
    this.h = a;
    this.g = b;
  }
  async getFile() {
    const a = await this.h.get(this.g);
    if (!a || a.kind !== "file") {
      throw new DOMException("vfs: arquivo nao encontrado: " + this.g, "NotFoundError");
    }
    return new File([a.data], this.name, {type:tn(this.name), lastModified:a.mtime || 0});
  }
  async stat() {
    const a = await this.h.get(this.g);
    return a && a.kind === "file" ? {size:a.size || 0, hash:a.hash || 0} : null;
  }
  async createWritable() {
    const a = [], b = this.h, c = this.g;
    return {write:async d => {
      !d || typeof d !== "object" || d instanceof Blob || d instanceof ArrayBuffer || ArrayBuffer.isView(d) || d.type !== "write" || (d = d.data);
      a.push(d);
    }, close:async() => {
      const d = new Blob(a, {type:tn(un(c))}), e = new Uint8Array(await d.arrayBuffer());
      await b.set(c, {kind:"file", data:d, size:d.size, mtime:Date.now(), hash:vn(e)});
      b.$a(1, c);
    }, abort:async() => {
      a.length = 0;
    }};
  }
  async queryPermission() {
    return "granted";
  }
  async requestPermission() {
    return "granted";
  }
  async isSameEntry(a) {
    return !!a && a.kind === "file" && a.path === this.g;
  }
  async createSyncAccessHandle() {
    throw new DOMException("vfs: createSyncAccessHandle nao suportado", "NotSupportedError");
  }
  async getUniqueId() {
    return "vfs:" + this.g;
  }
}
function Bn(a, b) {
  return a.h ? a.h + "/" + b : b;
}
async function Cn(a, b) {
  a = await a.g.keys();
  const c = b + "/";
  return a.some(d => d.startsWith(c));
}
async function Dn(a) {
  var b = await a.g.keys();
  a = a.h ? a.h + "/" : "";
  const c = new Map();
  for (const d of b) {
    if (a && !d.startsWith(a)) {
      continue;
    }
    b = d.slice(a.length);
    if (!b) {
      continue;
    }
    const e = b.indexOf("/");
    e < 0 ? c.set(b, "file") : e > 0 && (b = b.slice(0, e), c.has(b) || c.set(b, "directory"));
  }
  return c;
}
class En {
  constructor(a, b) {
    this.kind = "directory";
    this.name = un(b);
    this.g = a;
    this.h = b;
  }
  async getDirectoryHandle(a, b) {
    a = Bn(this, a);
    if ((await this.g.keys()).indexOf(a) >= 0) {
      throw new DOMException("vfs: e um arquivo: " + a, "TypeMismatchError");
    }
    if (!await Cn(this, a)) {
      if (!b || !b.create) {
        throw new DOMException("vfs: pasta nao encontrada: " + a, "NotFoundError");
      }
      await this.g.set(a + rn.Nc, {kind:"dir", mtime:Date.now()});
      this.g.$a(3, a);
    }
    return new En(this.g, a);
  }
  async getFileHandle(a, b) {
    const c = Bn(this, a);
    if ((await this.g.keys()).indexOf(c) < 0) {
      if (await Cn(this, c)) {
        throw new DOMException("vfs: e uma pasta: " + c, "TypeMismatchError");
      }
      if (!b || !b.create) {
        throw new DOMException("vfs: arquivo nao encontrado: " + c, "NotFoundError");
      }
      await this.g.set(c, {kind:"file", data:new Blob([], {type:tn(a)}), size:0, mtime:Date.now(), hash:vn(new Uint8Array(0))});
      this.g.$a(1, c);
    }
    return new An(this.g, c);
  }
  async *values() {
    const a = await Dn(this);
    for (const [b, c] of a) {
      yield c === "file" ? new An(this.g, Bn(this, b)) : new En(this.g, Bn(this, b));
    }
  }
  async *keys() {
    const a = await Dn(this);
    for (const b of a.keys()) {
      yield b;
    }
  }
  async *entries() {
    for await (const a of this.values()) {
      yield [a.name, a];
    }
  }
  async removeEntry(a, b) {
    a = Bn(this, a);
    var c = await this.g.keys();
    if (c.indexOf(a) >= 0) {
      await xn(this.g, a), this.g.$a(2, a);
    } else {
      var d = a + "/";
      c = c.filter(e => e.startsWith(d));
      if (!c.length) {
        throw new DOMException("vfs: nao encontrado: " + a, "NotFoundError");
      }
      if (c.some(e => e !== d) && (!b || !b.recursive)) {
        throw new DOMException("vfs: pasta nao vazia: " + a, "InvalidModificationError");
      }
      for (const e of c) {
        await xn(this.g, e);
      }
      this.g.$a(4, a);
    }
  }
  async queryPermission() {
    return "granted";
  }
  async requestPermission() {
    return "granted";
  }
  async isSameEntry(a) {
    return !!a && a.kind === "directory" && a.path === this.h;
  }
  async resolve(a) {
    if (!a || a._store !== this.g) {
      return null;
    }
    a = String(a.path);
    if (a === this.h) {
      return [];
    }
    const b = this.h ? this.h + "/" : "";
    return a.startsWith(b) ? a.slice(b.length).split("/") : null;
  }
  [Symbol.asyncIterator]() {
    return this.entries();
  }
}
let Fn = null, Gn = null, zn = "";
function Ua() {
  Gn || (Fn = new yn(), Gn = new En(Fn, ""));
  return Gn;
}
async function Hn(a) {
  Ua();
  const b = Fn;
  a = a.replace(/\/+$/, "");
  return a ? await b.get(a) ? (await xn(b, a), b.$a(2, a), !0) : await b.get(a + rn.Nc) ? (await xn(b, a + rn.Nc), b.$a(4, a), !0) : !1 : !1;
}
async function In(a) {
  Ua();
  return Fn.get(a);
}
async function Jn() {
  Ua();
  return Fn.keys();
}
function Kn(a) {
  Ua();
  Fn.i = a;
}
;async function Ln() {
  return (await Ya("artifacts").keys()).length;
}
async function Mn(a, b, c) {
  const d = Ua();
  a = await pn(d, a, b, c);
  b = await Ln();
  return {Ng:a, Hf:b};
}
async function Nn(a, b, c) {
  const d = Ua();
  a = await pn(a, d, b, c);
  b = await Ln();
  c && c("");
  return {Ng:a, Hf:b};
}
;function W(a, b) {
  return new DOMException(a, b);
}
function On(a, b, c) {
  b = "remote: " + (a || "error") + (c ? " (" + c + ")" : "") + ": " + b;
  switch(a) {
    case "not_found":
    case "user":
    case "route":
      return W(b, "NotFoundError");
    case "read_only":
      return W(b, "NotAllowedError");
    case "is_dir":
    case "is_file":
      return W(b, "TypeMismatchError");
    case "not_empty":
      return W(b, "InvalidModificationError");
    case "auth":
    case "token":
    case "attempts":
    case "role":
      return W(b, "SecurityError");
    case "path":
    case "op":
    case "too_big":
    case "invite":
    case "quota":
      return W(b, "InvalidStateError");
  }
  return c === 404 ? W(b, "NotFoundError") : c === 405 ? W(b, "NotAllowedError") : c === 409 ? W(b, "TypeMismatchError") : c === 401 || c === 403 ? W(b, "SecurityError") : W(b, "NetworkError");
}
function Pn(a) {
  return W("remote: montagem somente leitura: " + a, "NotAllowedError");
}
;var Qn = /^[A-Za-z]([A-Za-z0-9._-]{0,30}[A-Za-z0-9_-])?$/;
async function Rn(a, b, c, d) {
  let e;
  try {
    a = fetch;
    const f = "";
    e = await a(b, c);
  } catch (f) {
    throw W("remote: sem servidor: " + (f && f.message || f), "NetworkError");
  }
  if (e.ok) {
    return e;
  }
  b = "";
  try {
    const f = await e.json();
    b = String(f.error || "");
  } catch (f) {
  }
  throw On(b, d, e.status);
}
class Sn {
  constructor(a, b, c, d) {
    this.ib = a.replace(/\/+$/, "");
    this.C = "/" + b.replace(/^\/+|\/+$/g, "");
    this.Aa = c;
    this.readonly = d;
    this.name = "rest";
  }
  url(a, b, c) {
    a = this.ib + this.C + "/" + a;
    b && (a += "/" + b.split("/").map(encodeURIComponent).join("/"));
    a += "?user=" + encodeURIComponent(this.Aa);
    c && (a += c);
    return a;
  }
  async g(a) {
    const b = {method:"GET", cache:"no-store"};
    a && (b.signal = a);
    return await (await Rn(this, this.url("manifest", ""), b, "manifest")).json();
  }
  async read(a) {
    return (await Rn(this, this.url("file", a), {method:"GET", cache:"no-store"}, a)).arrayBuffer();
  }
  async write(a, b) {
    if (this.readonly) {
      throw Pn(a);
    }
    return await (await Rn(this, this.url("file", a), {method:"POST", body:b, headers:{"Content-Type":"application/octet-stream"}}, a)).json();
  }
  async h(a) {
    if (this.readonly) {
      throw Pn(a);
    }
    await Rn(this, this.url("dir", a), {method:"POST"}, a);
  }
  async i(a, b, c) {
    if (this.readonly) {
      throw Pn(a);
    }
    await Rn(this, this.url(b ? "dir" : "file", a, b && c ? "&recursive=1" : ""), {method:"DELETE"}, a);
  }
  o() {
    return null;
  }
  async j(a) {
    let b;
    return !0;
  }
}
;const Tn = {zd:"ploft.session", ye:"current", qf:"user", wf:20000, vf:300000};
function Un(a) {
  return Array.isArray(a) ? a.map(b => String(b)) : [];
}
function Vn(a) {
  a = a && typeof a === "object" ? a : {};
  return {Tc:String(a.bundle || ""), Mc:Un(a.uuids), kd:Un(a.modules)};
}
function Wn(a) {
  if (X && a && typeof a === "object") {
    a.uid !== void 0 && (X.uid = Number(a.uid || 0));
    if (a.role !== void 0) {
      const b = String(a.role || "").toLowerCase();
      X.role = b === "owner" ? 2 : b === "admin" ? 1 : 0;
    }
    a.display !== void 0 && (X.display = String(a.display || ""));
    a.perm !== void 0 && (X.Ua = Vn(a.perm));
  }
}
let X = null, Xn = 0, Yn = null;
const Zn = [];
let $n = null, ao = !1;
async function bo() {
  Yn || (Yn = new xa(Tn.zd), await Yn.init());
  return Yn;
}
function co(a) {
  if (a !== Xn) {
    Xn = a;
    for (const b of Zn) {
      try {
        b(a);
      } catch (c) {
        console.warn("[session] listener", c);
      }
    }
  }
}
async function eo() {
  const a = await bo();
  X ? await a.set(Tn.ye, {user:X.Aa, uid:X.uid, base:X.ib, token:X.la, expires:X.expires, last:X.nb, role:X.role, display:X.display, perm:{bundle:X.Ua.Tc, uuids:X.Ua.Mc.slice(), modules:X.Ua.kd.slice()}}) : await a.g(Tn.ye);
}
async function fo() {
  go();
  X && (X.la = "", X.expires = 0, X.nb = 5, await eo());
  co(X ? 5 : 0);
}
async function ho(a, b) {
  if (!X || !X.la) {
    return Xn;
  }
  const c = new AbortController();
  b = setTimeout(() => c.abort(), b || Tn.wf);
  let d = 4;
  try {
    await a.j(c.signal), d = 3;
  } catch (e) {
    e && e.name === "SecurityError" ? d = 5 : console.warn("[session] verificacao sem resposta:", e && e.message || e);
  } finally {
    clearTimeout(b);
  }
  if (d === 5) {
    return await fo(), Xn;
  }
  d === 3 && Wn(a.o());
  X && (X.nb = d, await eo());
  co(d);
  return d;
}
function go() {
  $n !== null && (clearTimeout($n), $n = null);
}
async function io() {
  var a = new URLSearchParams(typeof location !== "undefined" ? location.search : ""), b = await bo();
  if (a.has(Tn.qf)) {
    a = (a.get(Tn.qf) || "").trim();
    if (!a) {
      return X = null, await eo(), co(0), null;
    }
    if (Qn.test(a)) {
      return X = {Aa:a.toLowerCase(), uid:0, ib:"", la:"", expires:0, nb:0, role:0, display:"", Ua:{Tc:"", Mc:[], kd:[]}}, await eo(), co(2), X;
    }
    console.warn("[session] usuario invalido na URL, ignorado:", a);
  }
  if ((b = await b.get(Tn.ye)) && typeof b.user === "string" && b.user) {
    a = Number(b.last || 0);
    var c = Number(b.role || 0);
    X = {Aa:String(b.user), uid:Number(b.uid || 0), ib:String(b.base || ""), la:String(b.token || ""), expires:Number(b.expires || 0), nb:a === 3 || a === 4 || a === 5 ? a : 0, role:c === 1 || c === 2 ? c : 0, display:String(b.display || ""), Ua:Vn(b.perm)};
  } else {
    X = null;
  }
  b = X;
  co(b ? b.la ? b.nb === 3 ? 2 : 1 : b.nb === 5 ? 5 : 2 : 0);
  return X;
}
function jo() {
  return X ? X.la : "";
}
async function ko(a, b, c, d) {
  X = {Aa:a.toLowerCase(), uid:0, ib:"", la:b, expires:c, nb:3, role:0, display:"", Ua:{Tc:"", Mc:[], kd:[]}};
  Wn(d || null);
  await eo();
  co(3);
  return X;
}
function lo(a) {
  const b = () => {
    go();
    Xn !== 4 && Xn !== 1 || ho(a).then(() => {
      Xn === 4 && (go(), $n = setTimeout(b, Tn.vf));
    });
  };
  if (Xn === 4 || Xn === 1) {
    go(), $n = setTimeout(b, Tn.vf);
  }
  !ao && typeof self !== "undefined" && self.addEventListener && (ao = !0, self.addEventListener("online", b));
}
;async function mo(a, b) {
  const c = a.data.state, d = await Zk();
  d ? (c.empty = !X && await Xk(d, "svg/schemas.json") === null, c.Z = await Rm(d), c.Ya = await $m(d), c.loaded = !0, c.loading = !1, c.msg = "") : (c.loading = !1, c.msg = b ? "" : "pasta nao autorizada");
  a.l.refresh();
}
function no(a, b) {
  const c = a.data.state;
  if (!c.vd) {
    c.vd = !0;
    c.msg = b ? "exportando..." : "importando...";
    a.l.refresh();
    var d = e => {
      c.vd = !1;
      c.msg = e;
      a.l.refresh();
    };
    jl(il.Ih, void 0, async e => {
      if (e) {
        if (e = await $k()) {
          var f = g => {
            g && (c.msg = g, a.l.refresh());
          };
          e = b ? await Mn(e, c.re, f) : await Nn(e, c.re, f);
          e = (b ? "exportado: " : "importado: ") + qn(e.Ng) + " \u00b7 " + e.Hf + " artefatos";
          if (!b) {
            for (const g in c.sb) {
              URL.revokeObjectURL(c.sb[g]);
            }
            c.sb = {};
            c.qe = {};
            await mo(a, !0);
          }
          c.vd = !1;
          c.msg = e;
          a.l.refresh();
        } else {
          d("pasta espelho nao autorizada");
        }
      } else {
        d("pasta espelho nao autorizada");
      }
    });
  }
}
function oo(a, b) {
  const c = a.data.state;
  jl(il.sf, void 0, async d => {
    d ? (d = await Zk()) && await b(d) : c.msg = "pasta nao autorizada";
    a.l.refresh();
  });
}
async function po(a, b) {
  await Sm(b, a.data.state.Z);
}
function qo(a, b, c) {
  const d = a.data.state;
  delete b.slots[String(c)];
  d.msg = "";
  oo(a, async e => {
    await po(a, e);
    for (const f of d.Ya) {
      if (!f.schemaId || !f.slots[String(c)]) {
        continue;
      }
      if (!Zm(d.Z, f.schemaId, b.id)) {
        continue;
      }
      const g = Um(d.Z, f.schemaId);
      String(c) in g || (await dn(e, f, c), ro(a, f.uuid, c));
    }
  });
}
function so(a, b) {
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
function ro(a, b, c) {
  a = a.data.state;
  b = b + ":" + c;
  a.sb[b] && (URL.revokeObjectURL(a.sb[b]), delete a.sb[b]);
}
function to(a, b, c, d) {
  const e = a.data.state;
  oo(a, async f => {
    const g = await fetch(d).then(h => h.text());
    await cn(f, b, c, g) ? (ro(a, b.uuid, c), e.msg = "") : e.msg = "falha ao gravar slot " + c;
  });
}
function uo(a, b) {
  a = b.schemaId ? Um(a.data.state.Z, b.schemaId) : {};
  const c = {};
  for (const d in a) {
    c[d] = a[d];
  }
  for (const d in b.slots) {
    d in c || (c[d] = "");
  }
  return Object.keys(c).map(d => ({V:parseInt(d, 10), name:c[d]})).sort((d, e) => d.V - e.V);
}
function vo(a) {
  const b = a.data.state;
  b.loading || (b.loading = !0, b.msg = "carregando...", a.l.refresh(), jl(il.sf, void 0, c => {
    c ? mo(a, !1) : (b.loading = !1, b.msg = "pasta nao autorizada", a.l.refresh());
  }));
}
function wo(a) {
  const b = a.data.state, c = Te ? Te() : "";
  c ? oo(a, async d => {
    b.Z.push({id:c, name:"novo tipo", includes:[], slots:{}});
    b.ne[c] = !0;
    await po(a, d);
  }) : (b.msg = "wasm indisponivel (uuid)", a.l.refresh());
}
function xo(a, b, c) {
  c.trim() && c !== b.name && (b.name = c.trim(), oo(a, d => po(a, d)));
}
function yo(a, b) {
  const c = a.data.state;
  c.Z = Ym(c.Z, b.id);
  delete c.ne[b.id];
  oo(a, d => po(a, d));
}
function zo(a, b) {
  const c = a.data.state, d = {}, e = {}, f = [], g = new Set(), h = k => {
    if (!g.has(k)) {
      g.add(k);
      var m = c.Z.find(l => l.id === k);
      if (m) {
        for (const l of m.includes || []) {
          h(l);
        }
        f.push(k);
        for (const l in m.slots) {
          e[l] = m.slots[l], d[l] = k;
        }
      }
    }
  };
  h(b.id);
  a = [];
  a.push("/** @enum {number} " + (b.name || "tipo") + " \u2014 tipo SVG_SCHEMA " + b.id + " */");
  a.push("const e" + so(b.name || "Tipo", !0) + " = {");
  for (const k of f) {
    const m = Object.keys(e).filter(l => d[l] === k).map(l => parseInt(l, 10)).sort((l, p) => l - p);
    if (m.length) {
      if (f.length > 1) {
        const l = c.Z.find(p => p.id === k);
        a.push("    // " + (k === b.id ? "proprios" : "de " + (l && l.name || k)));
      }
      for (const l of m) {
        a.push("    " + so(e[String(l)], !1) + " : " + l + ",");
      }
    }
  }
  a.push("};");
  navigator.clipboard.writeText(a.join("\n"));
}
function Ao(a, b, c) {
  c.trim() && (Vm(a.data.state.Z, b, c.trim()), oo(a, d => po(a, d)));
}
function Bo(a, b, c, d) {
  d.trim() === "" ? qo(a, b, c) : b.slots[String(c)] !== d && (b.slots[String(c)] = d, oo(a, e => po(a, e)));
}
function Co(a, b, c, d) {
  const e = a.data.state;
  d.trim() === "" ? qo(a, b, c) : (d = parseInt(d, 10), isNaN(d) || d === c ? a.l.refresh() : Wm(e.Z, b, c, d) ? (e.msg = "", oo(a, f => po(a, f))) : (e.msg = "numero " + d + " ja em uso", a.l.refresh()));
}
function Do(a, b, c) {
  const d = a.data.state;
  Xm(d.Z, b, c) ? oo(a, e => po(a, e)) : (d.msg = "inclusao recusada (self/duplicado/ciclo)", a.l.refresh());
}
function Eo(a) {
  const b = a.data.state, c = b.ie.trim(), d = Se ? Se() : "";
  d ? oo(a, async e => {
    (e = await an(e, d, c, b.je)) ? (b.Ya.push(e), b.ie = "", b.fc = e.uuid, b.msg = "") : b.msg = "falha ao criar colecao";
  }) : (b.msg = "wasm indisponivel (uuid)", a.l.refresh());
}
function Fo(a, b, c) {
  c.trim() !== b.name && (b.name = c.trim(), oo(a, async d => {
    await Qm(d, b);
  }));
}
function Go(a, b) {
  const c = a.data.state;
  oo(a, async d => {
    await bn(d, b.uuid);
    for (const e in b.slots) {
      ro(a, b.uuid, parseInt(e, 10));
    }
    c.Ya = c.Ya.filter(e => e.uuid !== b.uuid);
    c.fc === b.uuid && (c.fc = "");
  });
}
function Ho(a, b) {
  var c = a.data.state;
  a = b.name || b.uuid.slice(0, 8);
  c = b.schemaId ? Tm(c.Z, b.schemaId) || b.schemaId : "";
  c = "colecao " + a + (b.schemaId ? " \u2014 tipo " + c + " (SVG_SCHEMA " + b.schemaId + ")" : " \u2014 livre");
  b = "/** @const {string} */ const UUID_" + so(a, !1) + " = '" + b.uuid + "'; //" + c;
  navigator.clipboard.writeText(b);
}
function Io(a, b, c) {
  const d = a.data.state, e = b.uuid + ":" + c;
  if (d.sb[e]) {
    return d.sb[e];
  }
  if (!b.slots[String(c)] || d.qe[e]) {
    return null;
  }
  d.qe[e] = !0;
  (async() => {
    var f = await Zk();
    f = f ? await en(f, b, c) : null;
    delete d.qe[e];
    f && (d.sb[e] = URL.createObjectURL(new Blob([f], {type:"image/svg+xml"})), a.l.refresh());
  })();
  return null;
}
function Jo(a, b, c) {
  oo(a, async d => {
    await dn(d, b, c);
    ro(a, b.uuid, c);
  });
}
function Ko(a) {
  return Object.keys(a.slots).map(b => ({V:parseInt(b, 10), name:a.slots[b]})).sort((b, c) => b.V - c.V);
}
function Lo(a, b) {
  const c = Um(a.data.state.Z, b);
  return Object.keys(c).map(d => ({V:parseInt(d, 10), name:c[d]})).sort((d, e) => d.V - e.V);
}
function Mo(a, b) {
  a = uo(a, b).map(c => c.V);
  return a.length ? Math.max.apply(null, a) + 1 : 1;
}
;const No = {padding:"3px 8px", fontSize:"11px", cursor:"pointer", background:"#3a3a3a", color:"#e0e0e0", border:"1px solid #555", borderRadius:"3px"}, Oo = {display:"flex", alignItems:"center", gap:"6px", height:"24px", whiteSpace:"nowrap", cursor:"pointer"}, Po = {color:"#888", fontSize:"10px"}, Qo = {width:"16px", textAlign:"center", cursor:"pointer", color:"#a66", fontSize:"12px", flexShrink:"0"}, Ro = {width:"14px", textAlign:"center", cursor:"pointer", color:"#888", fontSize:"9px", flexShrink:"0"}, 
So = {...Qh, width:"30px", textAlign:"right", flexShrink:"0"}, To = {borderTop:"1px solid #3a3a3a", margin:"8px 0"};
function Uo(a, b, c) {
  const d = a.data.state, e = b.id + ":" + c, f = !!d.Cg[e];
  b = f ? Lo(a, c) : [];
  return n("div", {lid:"inc-" + e, style:{marginLeft:"20px"}}, n("div", {style:Oo, onClick:() => {
    d.Cg[e] = !f;
    a.l.refresh();
  }}, n("span", {style:Ro}, f ? "\u2212" : "+"), n("span", {style:{color:"#b09ad9", fontSize:"11px"}}, Tm(d.Z, c) || c), n("span", {style:Po}, "(incluido)")), f ? b.map(g => n("div", {lid:"incel-" + e + "-" + g.V, style:{...Oo, marginLeft:"20px", cursor:"default"}}, n("span", {style:{...Po, width:"30px", textAlign:"right"}}, String(g.V)), n("span", {style:{color:"#999", fontSize:"11px"}}, g.name))) : null);
}
function Vo(a, b) {
  const c = a.data.state, d = !!c.ne[b.id], e = Ko(b), f = Lo(a, b.id).length;
  return n("div", {lid:"sch-" + b.id}, n("div", {draggable:"true", onDragStart:g => {
    c.Vb = b.id;
    g.dataTransfer.setData("application/x-ploft-svg-schema", b.id);
    g.dataTransfer.effectAllowed = "link";
  }, onDragEnd:() => {
    c.Vb = "";
  }, onDragOver:g => {
    c.Vb && c.Vb !== b.id && g.preventDefault();
  }, onDrop:g => {
    g.preventDefault();
    c.Vb && Do(a, b, c.Vb);
    c.Vb = "";
  }, style:Oo}, n("span", {style:Ro, onClick:() => {
    c.ne[b.id] = !d;
    a.l.refresh();
  }}, d ? "\u25bc" : "\u25b6"), n("input", {value:b.name, onChange:g => xo(a, b, g.currentTarget.value), onMouseDown:g => g.stopPropagation(), style:{background:"transparent", border:"1px solid transparent", color:"#7fd1e0", fontWeight:"bold", fontSize:"12px", flex:"1", minWidth:"0", outline:"none", padding:"1px 3px"}}), n("span", {style:Po}, "(" + f + ")"), n("span", {title:"copiar enum JS (com heranca por secao)", style:{cursor:"pointer", fontSize:"11px", color:"#6af", flexShrink:"0"}, onClick:g => 
  {
    g.stopPropagation();
    zo(a, b);
  }, onMouseDown:g => g.stopPropagation()}, "\u29c9"), n("span", {title:"apagar tipo", style:Qo, onClick:g => {
    g.stopPropagation();
    yo(a, b);
  }, onMouseDown:g => g.stopPropagation()}, "\u00d7")), d ? n("div", {style:{marginLeft:"14px"}}, (b.includes || []).map(g => Uo(a, b, g)), e.map(g => n("div", {lid:"el-" + b.id + "-" + g.V, style:{...Oo, cursor:"default"}}, n("input", {value:String(g.V), title:"vazio = apaga o elemento (e o arquivo ocioso do slot)", onChange:h => Co(a, b, g.V, h.currentTarget.value), style:So}), n("input", {value:g.name, title:"vazio = apaga o elemento (e o arquivo ocioso do slot)", onChange:h => Bo(a, b, g.V, h.currentTarget.value), 
  style:{...Qh, flex:"1"}}))), n("div", {style:{...Oo, cursor:"default"}}, n("span", {style:{...Po, width:"30px", textAlign:"right"}}, String(Nm(c.Z, b))), n("input", {placeholder:"novo elemento...", onChange:g => {
    g = g.currentTarget;
    Ao(a, b, g.value);
    g.value = "";
  }, style:{...Qh, flex:"1"}}))) : null);
}
function Wo(a) {
  const b = a.data.state;
  return n("div", null, n("div", {style:{display:"flex", gap:"6px", alignItems:"center", marginBottom:"4px"}}, n("span", {onClick:() => {
    b.Lc = !b.Lc;
    a.l.refresh();
  }, style:{...Ro, fontSize:"11px", color:"#6af", width:"auto"}}, b.Lc ? "[\u2212]" : "[+]"), n("span", {onClick:() => {
    b.Lc = !b.Lc;
    a.l.refresh();
  }, style:{color:"#7fd1e0", fontSize:"11px", fontWeight:"bold", letterSpacing:"0.4px", cursor:"pointer"}}, "TIPOS"), n("span", {style:Po}, "(" + b.Z.length + ")"), n("button", {onClick:() => wo(a), style:{...No, marginLeft:"auto"}}, "adicionar")), b.Lc ? b.Z.map(c => Vo(a, c)) : null);
}
function Xo(a, b) {
  const c = a.data.state, d = Object.keys(b.slots).length, e = uo(a, b).length;
  return n("div", {lid:"col-" + b.uuid, style:{...Oo, marginLeft:"14px"}, onClick:() => {
    c.fc = b.uuid;
    a.l.refresh();
  }}, n("span", {style:{color:"#6af", fontSize:"12px"}}, "\u25b8"), b.name ? n("span", {style:{color:"#d0e0d0", fontSize:"12px", fontWeight:"bold", flex:"1", overflow:"hidden", textOverflow:"ellipsis"}}, b.name) : n("span", {style:{...Po, fontFamily:"monospace", flex:"1", overflow:"hidden", textOverflow:"ellipsis"}}, b.uuid), n("span", {title:"copiar uuid (const JS com descricao)", style:{cursor:"pointer", fontSize:"11px", color:"#6af", flexShrink:"0"}, onClick:f => {
    f.stopPropagation();
    Ho(a, b);
  }}, "\u29c9"), n("span", {style:Po}, d + "/" + e), n("span", {title:"apagar colecao (definitivo)", style:Qo, onClick:f => {
    f.stopPropagation();
    Go(a, b);
  }}, "\u00d7"));
}
function Yo(a, b, c) {
  return a === c ? n("option", {value:a, selected:!0}, b) : n("option", {value:a}, b);
}
function Zo(a) {
  const b = a.data.state, c = [];
  for (var d = 0; d < b.Z.length; d++) {
    const f = b.Z[d], g = b.Ya.filter(h => h.schemaId === f.id);
    g.length && c.push({label:f.name || f.id, cols:g});
  }
  const e = {};
  for (d = 0; d < b.Z.length; d++) {
    e[b.Z[d].id] = !0;
  }
  d = b.Ya.filter(f => !f.schemaId || !e[f.schemaId]);
  d.length && c.push({label:"(livre)", cols:d});
  return n("div", null, n("div", {style:{display:"flex", gap:"4px", alignItems:"center", marginBottom:"6px"}}, n("input", {placeholder:"nova colecao (nome opcional)...", value:b.ie, onInput:f => {
    b.ie = f.currentTarget.value;
  }, style:{...Qh, flex:"1"}}), n("select", {onChange:f => {
    b.je = f.currentTarget.value;
  }, style:Rh}, Yo("", "(livre)", b.je), b.Z.map(f => Yo(f.id, f.name || f.id, b.je))), n("button", {onClick:() => Eo(a), style:No}, "criar")), c.map(f => n("div", {lid:"grp-" + f.label}, n("div", {style:{...Po, fontWeight:"bold", letterSpacing:"0.3px", padding:"2px 0"}}, f.label + " (" + f.cols.length + ")"), f.cols.map(g => Xo(a, g)))), b.Ya.length ? null : n("div", {style:{...Po, padding:"8px 0"}}, "nenhuma colecao \u2014 crie acima ou copie para svg/collections/"));
}
function $o(a, b, c, d, e) {
  const f = a.data.state, g = !e && !!b.slots[String(c)], h = g ? Io(a, b, c) : null, k = b.uuid + ":" + c, m = {width:"72px", height:"72px", backgroundColor:g ? "#ffffff" : "#252526", border:f.sc === k ? "2px solid #4a9eff" : g ? "1px solid #444" : "1px dashed #555", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", position:"relative", cursor:g ? "grab" : "default"};
  d = b.schemaId && !e ? n("span", {style:{color:"#aaa", fontSize:"9px", maxWidth:"72px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}, d) : n("span", {style:{color:"#777", fontSize:"9px"}}, e ? "+ proximo" : "");
  return n("div", {lid:"slot-" + k, style:{display:"flex", flexDirection:"column", alignItems:"center"}, onDragOver:l => {
    const p = bk;
    p && p.kind === 1 && (l.preventDefault(), l.dataTransfer.dropEffect = "copy", f.sc !== k && (f.sc = k, a.l.refresh()));
  }, onDragLeave:() => {
    f.sc === k && (f.sc = "", a.l.refresh());
  }, onDrop:l => {
    l.preventDefault();
    f.sc = "";
    (l = bk) && l.kind === 1 && to(a, b, c, l.data.url);
  }}, n("div", {draggable:h ? "true" : "false", onDragStart:l => {
    if (h) {
      var p = {url:h, w:72, ja:72};
      l.dataTransfer.setData("application/x-ploft", JSON.stringify(p));
      l.dataTransfer.effectAllowed = "copy";
      bk = new ak(36, 36, p);
    } else {
      l.preventDefault();
    }
  }, onDragEnd:() => {
    bk = null;
  }, style:m}, n("span", {style:{position:"absolute", left:"2px", top:"1px", fontSize:"9px", color:"#6af"}}, String(c)), g && h ? n("img", {src:h, style:{maxWidth:"100%", maxHeight:"100%", objectFit:"contain"}}) : n("span", {style:{color:"#555", fontSize:"10px"}}, g ? "\u2026" : ""), g ? n("span", {title:"esvaziar slot", onClick:l => {
    l.stopPropagation();
    Jo(a, b, c);
  }, onMouseDown:l => l.stopPropagation(), style:{position:"absolute", right:"2px", top:"0", cursor:"pointer", color:"#888", fontSize:"11px"}}, "\u00d7") : null), d);
}
function ap(a, b) {
  const c = a.data.state, d = uo(a, b).map(f => $o(a, b, f.V, f.name, !1));
  b.schemaId || d.push($o(a, b, Mo(a, b), "", !0));
  const e = b.schemaId ? Tm(c.Z, b.schemaId) || b.schemaId : "(livre)";
  return n("div", null, n("div", {style:{display:"flex", gap:"6px", alignItems:"center", marginBottom:"6px"}}, n("button", {onClick:() => {
    c.fc = "";
    a.l.refresh();
  }, style:No}, "\u25c2"), n("input", {value:b.name, placeholder:"(sem nome)", onChange:f => Fo(a, b, f.currentTarget.value), style:{...Qh, flex:"1", fontWeight:"bold", fontSize:"12px"}}), n("span", {style:Po}, e)), n("div", {style:{...Po, marginBottom:"6px", fontFamily:"monospace", display:"flex", alignItems:"center", gap:"6px"}}, n("span", {style:{overflow:"hidden", textOverflow:"ellipsis"}}, b.uuid), n("span", {title:"copiar uuid (const JS com descricao)", style:{cursor:"pointer", fontSize:"11px", 
  color:"#6af", flexShrink:"0"}, onClick:() => Ho(a, b)}, "\u29c9")), n("div", {style:{display:"flex", flexWrap:"wrap", gap:"6px"}}, d));
}
function bp(a) {
  const b = a.data.state, c = String(b.re);
  return n("div", {lid:"sync"}, n("div", {style:{display:"flex", gap:"6px", alignItems:"center", marginBottom:"6px"}}, n("select", {onChange:d => {
    a.data.state.re = parseInt(d.currentTarget.value, 10);
    a.l.refresh();
  }, title:"update: copia/atualiza, nunca apaga \u00b7 mirror: destino vira copia fiel", style:Rh}, Yo("1", "update", c), Yo("2", "mirror", c)), n("button", {onClick:() => {
    no(a, !0);
  }, style:No, title:"raiz virtual \u2192 pasta fisica (espelho)"}, "\u21e7 exportar"), n("button", {onClick:() => {
    no(a, !1);
  }, style:No, title:"pasta fisica (espelho) \u2192 raiz virtual"}, "\u21e9 importar"), n("span", {style:Po}, b.vd ? "..." : "espelho")), b.empty ? n("div", {style:{color:"#d9b06a", fontSize:"11px", marginBottom:"6px"}}, "Raiz vazia \u2014 importe a sua pasta (\u21e9 importar)") : null);
}
class cp extends yi {
  constructor(a, b) {
    super(a);
    this.data = b;
    a = this.data.state;
    a.Jf || a.loading || (a.Jf = !0, a.loading = !0, mo(this, !0));
  }
  g() {
    const a = this.data.state, b = this, c = a.fc ? a.Ya.find(d => d.uuid === a.fc) || null : null;
    return n("div", {style:{fontSize:"12px", color:"#e0e0e0"}}, a.loaded && !c ? bp(this) : null, a.loaded ? c ? ap(this, c) : n("div", null, Wo(this), n("div", {style:To}), Zo(this)) : n("div", {style:{display:"flex", gap:"6px", alignItems:"center"}}, n("button", {onClick:() => vo(b), style:No}, a.loading ? "..." : "\ud83d\udcc2 conectar pasta"), n("span", {style:Po}, a.msg || "raiz de dados do usuario (svg/)")), a.loaded && a.msg ? n("div", {style:{color:"#d9b06a", fontSize:"10px", marginTop:"4px"}}, 
    a.msg) : null);
  }
}
;function dp(a, b) {
  const c = {collapsed:{}, fa:new Set(), Qa:"", ha:null, Wc:-1, Vc:-1, Qd:-1, qc:null}, d = {collapsed:{}, pe:-1, Eb:{}, lb:{}, Fb:{}, A:{displayMap:{}}, Oa:null, Pb:{}, Wd:null, Xd:null, dj:{}, Rg:[], Kd:"", ed:!1, lf:null}, e = new ri(d.Pb), f = {Ea:[], de:"", ab:-1, Gc:(new Date()).getFullYear(), bb:(new Date()).getMonth()}, g = {A:{count:0}}, h = {A:{thumbSize:80, thumbGap:4, folderFontSize:11, fileFontSize:9, thumbBg:"#ffffff", toolbarMode:"size", pinned:"*unclass", splitH:200}, folders:[], 
  If:!1, Xa:!1, pa:0, Jd:0, Id:0, Ke:0, Hd:0, ba:{}, mc:null, Ie:null, aa:null, ze:0, u:null, Ha:null, Ae:0, Qb:!0, Sb:!0, Va:null, Wa:"", Rb:"", yb:{}, xb:{}}, k = {}, m = {A:Ji(), Se:null, ud:{}, ed:!1, lf:null}, l = {files:[], loading:!1, msg:"", vg:!1, Fi:null}, p = {N:null, ce:null, Ff:null, pd:null, ec:{}, seq:1, bf:0, ge:""}, r = {Z:[], Ya:[], loaded:!1, loading:!1, Jf:!1, msg:"", fc:"", sb:{}, qe:{}, ie:"", je:"", sc:"", Lc:!0, ne:{}, Cg:{}, Vb:"", empty:!1, re:1, vd:!1};
  a.register({key:"objtree", label:"OBJECT TREE", visible:!0, height:300, create:q => new am(q, {state:d, qa:c, te:e, Ue:() => {
    a.wa && a.wa.set("objtree_display", d.A);
  }}, b), fb:() => "OBJECT TREE (" + (b ? b.D().length : 0) + ")", nd:async q => {
    (q = await q.get("objtree_display")) && q.displayMap && (d.A.displayMap = q.displayMap);
  }, od:q => {
    q.set("objtree_display", d.A);
  }});
  a.register({key:"drawing", label:"DRAWING", visible:!0, height:120, create:q => new em(q, {state:k, ji:d}, b)});
  a.register({key:"gallery", label:"GALLERY", visible:!0, height:250, create:q => new tk(q, {state:h}), fb:() => "GALLERY (" + h.folders.reduce((q, v) => q + v.files.length, 0) + ")", nd:async q => {
    if (q = await q.get("gallery_prefs")) {
      const v = h.A;
      v.thumbSize = q.thumbSize ?? v.thumbSize;
      v.thumbGap = q.thumbGap ?? v.thumbGap;
      v.folderFontSize = q.folderFontSize ?? v.folderFontSize;
      v.fileFontSize = q.fileFontSize ?? v.fileFontSize;
      v.thumbBg = q.thumbBg ?? v.thumbBg;
      v.toolbarMode = q.toolbarMode ?? v.toolbarMode;
      v.pinned = q.pinned ?? v.pinned;
      v.splitH = q.splitH ?? v.splitH;
      q.openFolders && (h.Ie = q.openFolders);
    }
    h.Xa = !0;
  }, od:q => {
    const v = h.A;
    q.set("gallery_prefs", {thumbSize:v.thumbSize, thumbGap:v.thumbGap, folderFontSize:v.folderFontSize, fileFontSize:v.fileFontSize, thumbBg:v.thumbBg, toolbarMode:v.toolbarMode, pinned:v.pinned, splitH:v.splitH, openFolders:h.folders.filter(t => t.open).map(t => t.name)});
  }});
  a.register({key:"classify", label:"CLASSIFICATION", visible:!0, height:300, create:q => new rm(q, {state:m, flush:() => {
    a.wa && a.wa.set("classify_model", m.A);
  }}, b), fb:() => "CLASSIFICATION (" + m.A.categories.length + " cat)", nd:async q => {
    if (q = await q.get("classify_model")) {
      m.A = q;
    }
  }, od:q => {
    q.set("classify_model", m.A);
  }});
  a.register({key:"library", label:"LIBRARY (pasta)", visible:!0, height:200, create:q => new Lm(q, {state:l}, b), fb:() => "LIBRARY (" + l.files.length + ")"});
  a.register({key:"svgcol", label:"SVG COLLECTIONS", visible:!0, height:250, create:q => new cp(q, {state:r}), fb:() => "SVG COLLECTIONS (" + r.Ya.length + ")"});
  a.register({key:"devsample", label:"DEV SAMPLE", visible:!0, height:140, create:q => new zm(q, {state:p}, b), fb:() => "DEV SAMPLE (" + p.bf + ")"});
  a.register({key:"vars", label:"VARIABLES", visible:!1, height:200, create:q => new Ci(q, {state:f}), fb:() => "VARIABLES (" + f.Ea.length + ")"});
  a.register({key:"hello", label:"HELLO WORLD", visible:!1, height:100, create:q => new Di(q, {state:g}), nd:async q => {
    if (q = await q.get("hello_prefs")) {
      g.A.count = q.count;
    }
  }, od:q => {
    q.set("hello_prefs", g.A);
  }});
}
;function ep(a) {
  a.i || (a.i = Gf(a.da, a.O, {$b:a.$b !== fp.prototype.$b ? b => a.$b(b) : void 0, ac:a.ac !== fp.prototype.ac ? b => a.ac(b) : void 0, bc:a.bc !== fp.prototype.bc ? b => a.bc(b) : void 0, ke:a.ke !== fp.prototype.ke ? (b, c) => a.ke(b, c) : void 0, Jb:a.Jb !== fp.prototype.Jb ? (b, c) => a.Jb(b, c) : void 0, le:a.le !== fp.prototype.le ? b => a.le(b) : void 0, me:a.me !== fp.prototype.me ? (b, c) => a.me(b, c) : void 0, Ib:a.Ib !== fp.prototype.Ib ? b => a.Ib(b) : void 0}));
}
class fp {
  constructor(a, b) {
    this.da = a;
    this.O = b;
    this.W = a.W;
    this.i = null;
  }
  $b() {
    return !1;
  }
  ac() {
    return !1;
  }
  bc() {
  }
  ke() {
    return !1;
  }
  Jb() {
  }
  le() {
    return 0;
  }
  me() {
    return 0;
  }
  Ib() {
  }
  P() {
    this.i && (this.i.unregister(), this.i = null);
  }
}
;function gp(a, b) {
  const c = a.g;
  a = a.h;
  c.save();
  c.transform(a[0], a[1], a[2], a[3], a[4], a[5]);
  b();
  c.restore();
}
function hp(a, b, c, d, e, f) {
  if ((a.i & 1) !== 0) {
    gp(a, () => b(c, d, e, f));
  } else {
    var g = sh(a.h, c, d);
    b(g[0], g[1], e * a.h[0], f * a.h[3]);
  }
}
class ip {
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
  arc(a, b, c, d, e, f) {
    if ((this.i & 3) !== 0) {
      gp(this, () => this.g.arc(a, b, c, d, e, f));
    } else {
      var g = sh(this.h, a, b);
      this.g.arc(g[0], g[1], c * this.j, d, e, f);
    }
  }
  arcTo(a, b, c, d, e) {
    if ((this.i & 3) !== 0) {
      gp(this, () => this.g.arcTo(a, b, c, d, e));
    } else {
      var f = sh(this.h, a, b), g = sh(this.h, c, d);
      this.g.arcTo(f[0], f[1], g[0], g[1], e * this.j);
    }
  }
  bezierCurveTo(a, b, c, d, e, f) {
    a = sh(this.h, a, b);
    c = sh(this.h, c, d);
    e = sh(this.h, e, f);
    this.g.bezierCurveTo(a[0], a[1], c[0], c[1], e[0], e[1]);
  }
  closePath() {
    this.g.closePath();
  }
  ellipse(a, b, c, d, e, f, g, h) {
    if ((this.i & 1) !== 0) {
      gp(this, () => this.g.ellipse(a, b, c, d, e, f, g, h));
    } else {
      var k = sh(this.h, a, b);
      this.g.ellipse(k[0], k[1], c * this.h[0], d * this.h[3], e, f, g, h);
    }
  }
  lineTo(a, b) {
    a = sh(this.h, a, b);
    this.g.lineTo(a[0], a[1]);
  }
  moveTo(a, b) {
    a = sh(this.h, a, b);
    this.g.moveTo(a[0], a[1]);
  }
  quadraticCurveTo(a, b, c, d) {
    a = sh(this.h, a, b);
    c = sh(this.h, c, d);
    this.g.quadraticCurveTo(a[0], a[1], c[0], c[1]);
  }
  rect(a, b, c, d) {
    hp(this, (e, f, g, h) => this.g.rect(e, f, g, h), a, b, c, d);
  }
  clearRect(a, b, c, d) {
    hp(this, (e, f, g, h) => this.g.clearRect(e, f, g, h), a, b, c, d);
  }
  fillRect(a, b, c, d) {
    hp(this, (e, f, g, h) => this.g.fillRect(e, f, g, h), a, b, c, d);
  }
  strokeRect(a, b, c, d) {
    hp(this, (e, f, g, h) => this.g.strokeRect(e, f, g, h), a, b, c, d);
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
  setTransform(a, b, c, d, e, f) {
    this.g.setTransform(a, b, c, d, e, f);
  }
  transform(a, b, c, d, e, f) {
    this.g.transform(a, b, c, d, e, f);
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
  Dc() {
    this.g.Dc();
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
    b = sh(this.h, b, c);
    this.g.fillText(a, b[0], b[1], d === void 0 ? void 0 : d * this.h[0]);
  }
  strokeText(a, b, c, d) {
    b = sh(this.h, b, c);
    this.g.strokeText(a, b[0], b[1], d === void 0 ? void 0 : d * this.h[0]);
  }
}
;function jp(a) {
  const b = kp(a);
  if (a.H === 4 || !(b.w < 2 || b.ja < 2)) {
    var c = a.H, d = a.o, e = a.C, f = a.g, g = a.h, h = th(wh(a.D.C, a.T)), k = xh(a.D.C), m = k.enabled && c !== 4;
    gh(a.D.g.G(a.T), l => {
      const p = new ip(l, h);
      m && (l.fillStyle = k.color);
      switch(c) {
        case 2:
          p.fillRect(b.x, b.y, b.w, b.ja);
          p.strokeRect(b.x, b.y, b.w, b.ja);
          break;
        case 3:
          p.beginPath();
          p.ellipse(b.x + b.w * 0.5, b.y + b.ja * 0.5, b.w * 0.5, b.ja * 0.5, 0, 0, 2 * Math.PI, !1);
          p.fill();
          p.stroke();
          break;
        case 4:
          p.beginPath(), p.moveTo(d, e), p.lineTo(f, g), p.stroke();
      }
    });
    a.D.refresh();
  }
}
function kp(a) {
  return {x:Math.min(a.o, a.g), y:Math.min(a.C, a.h), w:Math.abs(a.g - a.o), ja:Math.abs(a.h - a.C)};
}
class lp extends fp {
  constructor(a, b, c) {
    super(a, b);
    this.D = c;
    this.j = !1;
    this.h = this.g = this.C = this.o = this.T = this.H = 0;
  }
  P() {
    super.P();
    this.j = !1;
  }
  $b(a) {
    Cf(a, 0);
    if ((Cf(a, 0) | 0) !== 0 || (a.buttons() & 1) === 0) {
      return !1;
    }
    const b = Fe(this.W, this.O, 3);
    if (b !== 2 && b !== 3 && b !== 4) {
      return !1;
    }
    const c = Fe(this.W, this.O, 19);
    if (!c) {
      return !1;
    }
    this.H = b;
    this.T = c;
    this.o = this.g = a.x();
    this.C = this.h = a.y();
    return this.j = !0;
  }
  ac(a) {
    switch(Cf(a, 0) | 0) {
      case 2:
        this.g = a.x();
        this.h = a.y();
        break;
      case 1:
        return jp(this), this.j = !1;
      case 5:
        return this.j = !1;
    }
    return !0;
  }
  bc(a) {
    if (this.j) {
      var b = kp(this);
      a.strokeStyle = "#808080";
      a.lineWidth = 1;
      switch(this.H) {
        case 2:
          a.strokeRect(b.x, b.y, b.w, b.ja);
          break;
        case 3:
          a.beginPath();
          a.ellipse(b.x + b.w * 0.5, b.y + b.ja * 0.5, b.w * 0.5, b.ja * 0.5, 0, 0, 2 * Math.PI, !1);
          a.stroke();
          break;
        case 4:
          a.beginPath(), a.moveTo(this.o, this.C), a.lineTo(this.g, this.h), a.stroke();
      }
    }
  }
}
;const mp = {svg:"image/svg+xml", json:"application/json", txt:"text/plain", png:"image/png", jpg:"image/jpeg", jpeg:"image/jpeg", gif:"image/gif", webp:"image/webp", db:"application/octet-stream", gbuf:"application/octet-stream", csv:"text/csv", html:"text/html", js:"text/javascript", se1:"application/octet-stream"};
function np(a) {
  const b = a.lastIndexOf(".");
  return mp[b >= 0 ? a.slice(b + 1).toLowerCase() : ""] || "application/octet-stream";
}
function op(a) {
  const b = a.lastIndexOf("/");
  return b >= 0 ? a.slice(b + 1) : a;
}
async function pp(a, b, c, d, e) {
  const f = Date.now();
  try {
    const l = await d();
    if ((ja >> 5 & 1) === 1) {
      d = console;
      var g = d.log, h = a.name;
      if (e) {
        var k = e(l);
        var m = (k < 1024 ? k + " B" : (k / 1024).toFixed(1) + " KB") + " ";
      } else {
        m = "";
      }
      g.call(d, "[net]", b, h, c, m + (Date.now() - f) + " ms");
    }
    return l;
  } catch (l) {
    throw (ja >> 5 & 1) === 1 && console.log("[net]", b, a.name, c, "FALHOU", l && l.name || l, Date.now() - f + " ms"), l;
  }
}
function qp(a, b, c) {
  if (!a.h || b) {
    const d = pp(a.g, "MANIFEST", b ? "(recarga)" : "", () => a.g.g(c), e => JSON.stringify(e).length);
    a.h = d;
    d.catch(() => {
      a.h === d && (a.h = null);
    });
  }
  return a.h;
}
async function rp(a, b) {
  a = await qp(a);
  b += "/";
  if (a.dirs.indexOf(b) >= 0) {
    return !0;
  }
  for (const c in a.files) {
    if (c.startsWith(b)) {
      return !0;
    }
  }
  return !1;
}
function sp(a, b) {
  b = b.split("/");
  let c = "";
  for (let d = 0; d < b.length - 1; d++) {
    c += b[d] + "/", a.dirs.indexOf(c) < 0 && a.dirs.push(c);
  }
}
async function tp(a, b) {
  if (a.readonly) {
    throw Pn(b);
  }
  await pp(a.g, "MKDIR", b, () => a.g.h(b));
  if (a.h) {
    const c = await a.h;
    sp(c, b + "/x");
  }
}
async function up(a, b, c, d) {
  if (a.readonly) {
    throw Pn(b);
  }
  await pp(a.g, "DEL", b + (c ? "/" : ""), () => a.g.i(b, c, d));
  if (a.h) {
    const e = await a.h;
    if (c) {
      const f = b + "/";
      for (const g of Object.keys(e.files)) {
        g.startsWith(f) && delete e.files[g];
      }
      e.dirs = e.dirs.filter(g => g !== f && !g.startsWith(f));
    } else {
      delete e.files[b];
    }
  }
}
class vp {
  constructor(a) {
    this.g = a;
    this.h = null;
  }
  get readonly() {
    return this.g.readonly;
  }
  async entry(a) {
    return (a = (await qp(this)).files[a]) ? a : null;
  }
  read(a) {
    return pp(this.g, "GET", a, () => this.g.read(a), b => b.byteLength);
  }
  async write(a, b) {
    if (this.readonly) {
      throw Pn(a);
    }
    const c = await pp(this.g, "PUT", a, () => this.g.write(a, b), () => b.size);
    if (this.h) {
      const d = await this.h;
      d.files[a] = c;
      sp(d, a);
    }
    return c;
  }
}
class wp {
  constructor(a, b, c) {
    this.h = a;
    this.i = b;
    this.name = op(b);
    this.size = c.size || 0;
    this.type = np(this.name);
    this.lastModified = c.mtime || 0;
    this.g = null;
  }
  arrayBuffer() {
    this.g || (this.g = this.h.read(this.i));
    return this.g;
  }
  async text() {
    return (new TextDecoder()).decode(new Uint8Array(await this.arrayBuffer()));
  }
}
class xp {
  constructor(a, b) {
    this.kind = "file";
    this.name = op(b);
    this.h = a;
    this.g = b;
  }
  async getFile() {
    const a = await this.h.entry(this.g);
    if (!a) {
      throw W("remote: arquivo nao encontrado: " + this.g, "NotFoundError");
    }
    return new wp(this.h, this.g, a);
  }
  async stat() {
    const a = await this.h.entry(this.g);
    return a ? {size:a.size || 0, hash:a.hash || 0} : null;
  }
  async createWritable() {
    if (this.h.readonly) {
      throw Pn(this.g);
    }
    const a = [], b = this.h, c = this.g;
    return {write:async d => {
      !d || typeof d !== "object" || d instanceof Blob || d instanceof ArrayBuffer || ArrayBuffer.isView(d) || d.type !== "write" || (d = d.data);
      a.push(d);
    }, close:async() => {
      await b.write(c, new Blob(a, {type:np(op(c))}));
    }, abort:async() => {
      a.length = 0;
    }};
  }
  async queryPermission() {
    return "granted";
  }
  async requestPermission() {
    return "granted";
  }
  async isSameEntry(a) {
    return !!a && a.kind === "file" && a.path === this.g && a._root === this.h;
  }
  async createSyncAccessHandle() {
    throw W("remote: createSyncAccessHandle nao suportado", "NotSupportedError");
  }
  async getUniqueId() {
    return "remote:" + this.g;
  }
}
function yp(a, b) {
  return a.h ? a.h + "/" + b : b;
}
async function zp(a) {
  const b = await qp(a.g), c = a.h ? a.h + "/" : "", d = new Map();
  a = (e, f) => {
    if (!c || e.startsWith(c)) {
      if (e = e.slice(c.length)) {
        var g = e.indexOf("/");
        g < 0 ? f || d.set(e, "file") : g > 0 && (f = e.slice(0, g), d.has(f) || d.set(f, "directory"));
      }
    }
  };
  for (const e in b.files) {
    a(e, !1);
  }
  for (const e of b.dirs) {
    a(e, !0);
  }
  return d;
}
class Ap {
  constructor(a, b) {
    this.kind = "directory";
    this.name = op(b);
    this.g = a;
    this.h = b;
  }
  get i() {
    return this.g.g;
  }
  get readonly() {
    return this.g.readonly;
  }
  async getDirectoryHandle(a, b) {
    a = yp(this, a);
    if (await this.g.entry(a)) {
      throw W("remote: e um arquivo: " + a, "TypeMismatchError");
    }
    if (!await rp(this.g, a)) {
      if (!b || !b.create) {
        throw W("remote: pasta nao encontrada: " + a, "NotFoundError");
      }
      await tp(this.g, a);
    }
    return new Ap(this.g, a);
  }
  async getFileHandle(a, b) {
    const c = yp(this, a);
    if (!await this.g.entry(c)) {
      if (await rp(this.g, c)) {
        throw W("remote: e uma pasta: " + c, "TypeMismatchError");
      }
      if (!b || !b.create) {
        throw W("remote: arquivo nao encontrado: " + c, "NotFoundError");
      }
      await this.g.write(c, new Blob([], {type:np(a)}));
    }
    return new xp(this.g, c);
  }
  async *values() {
    const a = await zp(this);
    for (const [b, c] of a) {
      yield c === "file" ? new xp(this.g, yp(this, b)) : new Ap(this.g, yp(this, b));
    }
  }
  async *keys() {
    const a = await zp(this);
    for (const b of a.keys()) {
      yield b;
    }
  }
  async *entries() {
    for await (const a of this.values()) {
      yield [a.name, a];
    }
  }
  async removeEntry(a, b) {
    a = yp(this, a);
    if (await this.g.entry(a)) {
      await up(this.g, a, !1, !1);
    } else {
      if (!await rp(this.g, a)) {
        throw W("remote: nao encontrado: " + a, "NotFoundError");
      }
      await up(this.g, a, !0, !(!b || !b.recursive));
    }
  }
  async stat(a) {
    return (a = await this.g.entry(yp(this, a))) ? {size:a.size || 0, hash:a.hash || 0} : null;
  }
  async queryPermission() {
    return "granted";
  }
  async requestPermission() {
    return "granted";
  }
  async isSameEntry(a) {
    return !!a && a.kind === "directory" && a.path === this.h && a._root === this.g;
  }
  async resolve(a) {
    if (!a || a._root !== this.g) {
      return null;
    }
    a = String(a.path);
    if (a === this.h) {
      return [];
    }
    const b = this.h ? this.h + "/" : "";
    return a.startsWith(b) ? a.slice(b.length).split("/") : null;
  }
  [Symbol.asyncIterator]() {
    return this.entries();
  }
}
function Bp(a) {
  return new Ap(new vp(a), "");
}
;const Cp = {Fh:"manifest.json"};
async function Dp(a, b, c) {
  let d;
  try {
    d = await fetch(a.url(b), c);
  } catch (e) {
    throw W("static: sem servidor: " + (e && e.message || e), "NetworkError");
  }
  if (d.ok) {
    return d;
  }
  throw On("", b, d.status);
}
class Ep {
  constructor(a) {
    this.ib = a.endsWith("/") ? a : a + "/";
    this.readonly = !0;
    this.name = "static";
  }
  url(a) {
    return this.ib + a.split("/").map(encodeURIComponent).join("/");
  }
  async g(a) {
    const b = {method:"GET", cache:"no-store"};
    a && (b.signal = a);
    return await (await Dp(this, Cp.Fh, b)).json();
  }
  async read(a) {
    return (await Dp(this, a, {method:"GET"})).arrayBuffer();
  }
  async write(a) {
    throw Pn(a);
  }
  async h(a) {
    throw Pn(a);
  }
  async i(a) {
    throw Pn(a);
  }
  async j() {
    return !0;
  }
  o() {
    return null;
  }
}
;const Fp = {xh:"text/plain", Jh:20000};
function Gp(a) {
  return new DOMException(a, "NetworkError");
}
async function Hp(a, b, c, d) {
  const e = new AbortController();
  c = setTimeout(() => e.abort(), c || Fp.Jh);
  d && d.addEventListener("abort", () => e.abort(), {once:!0});
  let f;
  try {
    f = await fetch(a, {method:"POST", mode:"cors", redirect:"follow", cache:"no-store", headers:{"Content-Type":Fp.xh}, body:JSON.stringify(b), signal:e.signal});
  } catch (g) {
    throw clearTimeout(c), Gp("gas: " + (e.signal.aborted ? "timeout" : g && g.message || g));
  }
  clearTimeout(c);
  if (!f.ok) {
    throw Gp("gas: http " + f.status);
  }
  a = await f.text();
  try {
    return JSON.parse(a);
  } catch (g) {
    throw Gp("gas: bad json");
  }
}
;async function Ip(a, b, c, d, e) {
  a = await Hp(a, b, d, e);
  if (!a.ok) {
    throw On(String(a.error || ""), c + (a.msg ? " (" + a.msg + ")" : ""), 0);
  }
  return a.data;
}
function Jp(a, b, c) {
  b = {op:b};
  (a = a.la()) && (b.t = a);
  if (c) {
    for (const d of Object.keys(c)) {
      b[d] = c[d];
    }
  }
  return b;
}
class Kp {
  constructor() {
    this.url = "https://script.google.com/macros/s/AKfycbz8kvZBqee545Q7d9yebhOuDfH7JYvLqaN_sZxSSK1Mi9Q23us-MvgSUsCkbNooyKy61A/exec";
    this.readonly = !1;
    this.name = "gas";
    this.C = jo || null;
    this.D = null;
  }
  la() {
    return this.C ? this.C() || "" : "";
  }
  async g(a) {
    return await Ip(this.url, Jp(this, "manifest"), "manifest", void 0, a);
  }
  async read(a) {
    a = await Ip(this.url, Jp(this, "read", {path:a}), a);
    a = atob(String(a.b64 || ""));
    const b = new Uint8Array(a.length);
    for (let c = 0; c < a.length; c++) {
      b[c] = a.charCodeAt(c);
    }
    return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
  }
  async write(a, b) {
    if (this.readonly) {
      throw Pn(a);
    }
    b = await b.arrayBuffer();
    var c = new Uint8Array(b);
    const d = Array(c.length);
    for (let e = 0; e < c.length; e++) {
      d[e] = String.fromCharCode(c[e]);
    }
    b = {path:a, b64:btoa(d.join("")), hash:vn(new Uint8Array(b)), mtime:Date.now()};
    return await Ip(this.url, Jp(this, "write", b), a);
  }
  async h(a) {
    if (this.readonly) {
      throw Pn(a);
    }
    await Ip(this.url, Jp(this, "mkdir", {path:a}), a);
  }
  async i(a, b, c) {
    if (this.readonly) {
      throw Pn(a);
    }
    b ? await Ip(this.url, Jp(this, "rmdir", {path:a, recursive:!!c}), a) : await Ip(this.url, Jp(this, "remove", {path:a}), a);
  }
  async j(a) {
    if (!this.la()) {
      return !0;
    }
    this.D = await Ip(this.url, Jp(this, "verify"), "verify", void 0, a) || null;
    return !0;
  }
  o() {
    return this.D;
  }
}
;function Lp(...a) {
  (ja >> 6 & 1) === 1 && console.log(Y.Ga, ...a);
}
const Y = {xe:"ploft.dirty", nf:8000, wh:1500, Ga:"[srv]"};
let Mp = null, Np = Y.xe, Op = null, Pp = [], Qp = !1, Rp = Promise.resolve();
const Sp = new Map();
let Tp = 0, Up = Promise.resolve(), Vp = null;
async function Wp() {
  Mp || (Mp = new xa(Np), await Mp.init());
  return Mp;
}
function Xp(a) {
  return Pp.some(b => a.startsWith(b));
}
function Yp(a) {
  return ["?", "PUT", "DEL", "MKDIR", "RMDIR"][a] || String(a);
}
async function Zp(a, b, c, d) {
  var e = c.lastIndexOf("/");
  const f = e >= 0 ? c.slice(0, e) : "";
  e = e >= 0 ? c.slice(e + 1) : c;
  try {
    if (b === 1) {
      const h = await In(c);
      if (h && h.kind === "file") {
        var g = await a.stat(c);
        g && g.size === h.size && g.hash === h.hash ? Lp("igual no servidor, nao sobe", c, "(" + d + ")") : (Lp("sobe PUT", c, h.size + " B (" + d + ")"), await a.g.write(yp(a, c), h.data));
      } else {
        Lp("descartado PUT", c, "(ja nao existe localmente)");
      }
    } else if (b === 3) {
      Lp("sobe MKDIR", c, "(" + d + ")"), await jn(a, c);
    } else if (b === 2 || b === 4) {
      Lp("sobe", Yp(b), c, "(" + d + ")"), await (await jn(a, f)).removeEntry(e, {recursive:b === 4});
    }
  } catch (h) {
    a = h && h.name;
    if (a === "NetworkError" || a === "SecurityError") {
      throw h;
    }
    (a !== "NotFoundError" || b !== 2 && b !== 4) && console.warn(Y.Ga, "nao subiu (definitivo):", b, c, h && h.message || h);
  }
}
function $p(a, b) {
  const c = ++Tp, d = async() => {
    try {
      await (await Wp()).set(a, {op:b, seq:c});
    } catch (e) {
      console.error(Y.Ga, "dirty store", e);
    }
  };
  Up = Up.then(d, d);
  return c;
}
function aq(a, b) {
  const c = async() => {
    try {
      const d = await Wp(), e = await d.get(a);
      e && typeof e === "object" && Number(e.seq) === b && await d.g(a);
    } catch (d) {
      console.error(Y.Ga, "dirty store", d);
    }
  };
  return Up = Up.then(c, c);
}
function bq(a, b, c) {
  const d = Op, e = async() => {
    if (d) {
      try {
        await Zp(d, a, b, "journal"), await aq(b, c), Lp("confirmado", b, "#" + c);
      } catch (f) {
        console.warn(Y.Ga, "offline \u2014 fica marcado:", Yp(a), b, "#" + c);
      }
    } else {
      Lp("sem fonte \u2014 fica marcado", Yp(a), b, "#" + c);
    }
  };
  Rp = Rp.then(e, e);
}
function cq(a, b) {
  var c = Sp.get(b);
  c && clearTimeout(c.Ug);
  c = $p(b, a);
  const d = setTimeout(() => dq(b), Y.wh);
  Sp.set(b, {Ka:a, seq:c, Ug:d});
}
function dq(a) {
  const b = Sp.get(a);
  b && (Sp.delete(a), Qp ? Lp("hold", Yp(b.Ka), a, "#" + b.seq, "(sessao nao confirmada \u2014 fica marcado)") : bq(b.Ka, a, b.seq));
}
function eq() {
  for (const a of Array.from(Sp.keys())) {
    const b = Sp.get(a);
    b && clearTimeout(b.Ug);
    dq(a);
  }
}
async function fq(a) {
  const b = await Wp();
  await Up;
  var c = await b.j() || [];
  c.sort();
  let d = 0;
  for (const f of c) {
    var e = await b.get(f);
    if (!e || typeof e !== "object") {
      await b.g(f);
      continue;
    }
    c = Number(e.op);
    e = Number(e.seq);
    try {
      await Zp(a, c, f, "marcado");
    } catch (g) {
      console.warn(Y.Ga, "marcado: servidor fora do ar em", f);
      break;
    }
    await aq(f, e);
    d++;
  }
  return d;
}
function gq(a, b) {
  const c = new AbortController(), d = setTimeout(() => c.abort(), b);
  return qp(a.g, !0, c.signal).finally(() => clearTimeout(d));
}
async function hq(a, b) {
  const c = h => b.some(k => h.startsWith(k));
  var d = (await Jn()).slice(), e = d.filter(h => h.endsWith(rn.Nc));
  d = d.filter(h => !h.endsWith(rn.Nc));
  const f = [];
  for (var g of d) {
    a.has(g) || c(g) || await Hn(g) && f.push(g);
  }
  g = new Set(d.filter(h => f.indexOf(h) < 0));
  for (const h of e.sort().reverse()) {
    if (c(h)) {
      continue;
    }
    e = !1;
    for (const k of g) {
      if (k.startsWith(h)) {
        e = !0;
        break;
      }
    }
    if (!e) {
      for (const k of a.keys()) {
        if (k.startsWith(h)) {
          e = !0;
          break;
        }
      }
      e || await Hn(h) && f.push(h);
    }
  }
  Lp("espelho: " + f.length + " apagados" + (f.length ? " \u2014 " + f.join(", ") : ""));
}
var iq = Y;
function jq(a) {
  Mp ? console.error(Y.Ga, "select depois do store de marcas aberto \u2014 ignorado:", a) : Np = (a = String(a || "").toLowerCase()) ? Y.xe + "-" + a : Y.xe;
}
async function kq(a, b, c) {
  const d = l => {
    b && b(l);
  };
  var e = iq.nf || Y.nf;
  const f = [], g = new Set();
  Lp("boot: fontes", a.map(l => l.root.i.name + (l.writable ? " (gravavel)" : "")).join(", "));
  const h = a.find(l => l.writable);
  if (h) {
    try {
      b && b("servidor\u2026");
      await gq(h.root, e);
      g.add(h.root);
      const l = await fq(h.root);
      l && (await qp(h.root.g, !0), Lp(l + " subiram"));
    } catch (l) {
      console.warn(Y.Ga, "fonte gravavel fora do ar \u2014 seguindo com o cache:", l && l.message || l);
    }
  }
  const k = [];
  for (const l of a) {
    try {
      g.has(l.root) || (b && b((l.root.i.name || "fonte") + "\u2026"), await gq(l.root, e), g.add(l.root)), k.push(await qp(l.root.g));
    } catch (p) {
      console.warn(Y.Ga, (l.root.i.name || "fonte") + " fora do ar \u2014 seguindo com o cache:", p && p.message || p), k.push(null);
    }
  }
  const m = new Map();
  a.forEach((l, p) => {
    if (p = k[p]) {
      for (const r in p.files) {
        m.set(r, l);
      }
    }
  });
  for (e = 0; e < a.length; e++) {
    const l = a[e];
    if (k[e]) {
      try {
        const p = await pn(l.root, Ua(), 1, d, r => m.get(r) === l);
        Lp(l.root.i.name + ":", qn(p));
        for (const r of p.items) {
          Lp(l.root.i.name, r);
        }
        p.errors.length && console.warn(Y.Ga, l.root.i.name + ": erros (primeiros): " + p.errors.slice(0, 3).join(" | "));
        f.push(p);
      } catch (p) {
        console.warn(Y.Ga, (l.root.i.name || "fonte") + ": falhou a copia \u2014 seguindo com o cache:", p && p.message || p), f.push(null);
      }
    } else {
      f.push(null);
    }
  }
  if (c && a.length) {
    if (g.size < a.length || f.some(l => !l)) {
      Lp("espelho: fonte fora do ar ou copia falhou \u2014 nada apagado");
    } else {
      try {
        await hq(m, c);
      } catch (l) {
        console.warn(Y.Ga, "espelho: falhou \u2014", l && l.message || l);
      }
    }
  }
  return f;
}
function lq(a, b) {
  var c = mq;
  Op = a;
  Pp = (c || []).slice();
  Qp = !!b;
  Kn((d, e) => {
    Xp(e) || cq(d, e);
  });
  Vp || typeof self === "undefined" || (Vp = () => eq(), self.addEventListener("pagehide", Vp));
}
function nq() {
  Kn(null);
  eq();
  Op = null;
  Vp && (self.removeEventListener("pagehide", Vp), Vp = null);
}
;const mq = ["internal/ephe/", "internal/artifacts/8e631086-cd02-498d-928c-1411905b575e.json", "internal/books/"];
let oq = null;
async function pq() {
  var a = X, b = {profile:0, sources:[], writable:null, uc:null};
  if (a && !a.la && a.nb !== 5) {
    b = Bp(new Sn(a.ib, "/ploft/user", a.Aa, !1)), b = {profile:1, sources:[{root:b, writable:!0}], writable:b, uc:Bp(new Sn(a.ib, "/ploft/ephe", a.Aa, !0))};
  } else {
    const c = typeof location !== "undefined" ? (new URL(".", location.href)).href : "";
    if (c) {
      const d = Bp(new Ep(c + "shared/")), e = new AbortController(), f = setTimeout(() => e.abort(), 3000);
      try {
        await qp(d.g, !0, e.signal), b = {profile:2, sources:[{root:d, writable:!1}], writable:null, uc:Bp(new Ep(c + "ephe/"))};
      } catch (g) {
      } finally {
        clearTimeout(f);
      }
    }
    a && a.la && (a = Bp(new Kp()), b = {profile:3, sources:b.sources.concat([{root:a, writable:!0}]), writable:a, uc:b.uc});
  }
  oq = b;
  console.log("[io] perfil", ["LOCAL", "LAB", "PAGES", "GAS"][b.profile] || b.profile);
  return b;
}
function qq() {
  var a = X;
  return a && (a.la || a.nb !== 5) ? a.Aa.toLowerCase() : rn.Eh;
}
let rq = !1, sq = !1;
async function tq(a, b) {
  const c = Xn !== 1, d = c ? a.sources : a.sources.filter(f => !f.writable), e = c && a.writable ? mq : null;
  d.length && await kq(d, b, e);
  a.writable && (rq = !c, lq(a.writable, rq), uq(a));
}
function uq(a) {
  const b = X;
  if (b && b.la && a.writable) {
    var c = a.writable.i;
    sq || (sq = !0, Zn.push(d => {
      console.log("[session]", "NONE UNVERIFIED TRUSTED VERIFIED OFFLINE REVOKED".split(" ")[d] || d);
      d === 5 ? (nq(), rq = !1) : d === 3 && rq && oq && vq();
    }));
    ho(c, Tn.wf).then(() => lo(c));
  }
}
async function wq() {
  nq();
  rq = !1;
  xq();
}
function xq() {
  typeof location !== "undefined" && setTimeout(() => location.reload(), 0);
}
async function vq() {
  var a = oq;
  rq = !1;
  nq();
  eq();
  await Rp;
  try {
    await kq(a.sources.filter(b => b.writable));
  } catch (b) {
    console.warn("[io] carga da raiz do usuario apos confirmar a sessao:", b);
  }
  lq(a.writable, !1);
}
function yq(a) {
  nb.set("ploft.user_root|root", () => Ua());
  ob.set("ploft.user_root|ephe", () => oq && oq.uc ? oq.uc : null);
  const b = a ? "ploft.art_handles-" + a : "ploft.art_handles";
  Xa(() => new Ta(b));
}
;function zq(a) {
  return Array.isArray(a) ? a.map(b => String(b)) : [];
}
function Aq(a) {
  a = a || {};
  const b = a.perm && typeof a.perm === "object" ? a.perm : {};
  return {la:String(a.token || ""), expires:Number(a.expires || 0), Aa:String(a.user || ""), uid:Number(a.uid || 0), role:String(a.role || ""), state:String(a.state || ""), display:String(a.display || ""), Ua:{Tc:String(b.bundle || ""), Mc:zq(b.uuids), kd:zq(b.modules)}, quota:a.quota && typeof a.quota === "object" ? a.quota : null};
}
async function Bq(a, b) {
  return Aq(await Ip("https://script.google.com/macros/s/AKfycbz8kvZBqee545Q7d9yebhOuDfH7JYvLqaN_sZxSSK1Mi9Q23us-MvgSUsCkbNooyKy61A/exec", {op:"login", user:a, password:b}, "login"));
}
async function Cq(a) {
  await Ip("https://script.google.com/macros/s/AKfycbz8kvZBqee545Q7d9yebhOuDfH7JYvLqaN_sZxSSK1Mi9Q23us-MvgSUsCkbNooyKy61A/exec", {op:"logout", t:a}, "logout");
}
async function Dq(a, b, c) {
  var d = {version:"v1", at:Date.now()};
  a = {op:"create_request", user:a, email:b};
  c && (a.invite = c);
  d && (a.consent = d);
  await Ip("https://script.google.com/macros/s/AKfycbz8kvZBqee545Q7d9yebhOuDfH7JYvLqaN_sZxSSK1Mi9Q23us-MvgSUsCkbNooyKy61A/exec", a, "create_request");
}
async function Eq(a, b, c) {
  return Aq(await Ip("https://script.google.com/macros/s/AKfycbz8kvZBqee545Q7d9yebhOuDfH7JYvLqaN_sZxSSK1Mi9Q23us-MvgSUsCkbNooyKy61A/exec", {op:"create_confirm", user:a, code:b, password:c}, "create_confirm"));
}
async function Fq() {
  const a = await Ip("https://script.google.com/macros/s/AKfycbz8kvZBqee545Q7d9yebhOuDfH7JYvLqaN_sZxSSK1Mi9Q23us-MvgSUsCkbNooyKy61A/exec", {op:"invite_check", token:Gq}, "invite_check") || {};
  return {valid:!!a.valid, $a:String(a.note || ""), Ui:!!a.email_locked, expires:Number(a.expires || 0)};
}
;const Hq = "sem sessao;conectado \u2014 sessao por confirmar;conectado (confirmando em segundo plano);conectado;conectado \u2014 sem resposta do servidor;sessao encerrada \u2014 entre de novo".split(";");
function Iq(a) {
  const b = Xn, c = X;
  return [b, c ? c.Aa : "", a !== void 0 ? a : Hq[b] || ""];
}
function Jq(a) {
  const b = a && a.name || "";
  var c = /^remote: (\w+)(?: \(([^)]*)\))?/.exec(String(a && a.message || ""));
  const d = c ? c[1] : "";
  c = c ? c[2] || "" : "";
  return d === "invite" ? c === "required" ? "informe o convite (o cadastro e por convite)" : c === "used" ? "esse convite ja foi usado" : c === "expired" ? "esse convite venceu" : c === "revoked" ? "esse convite foi cancelado" : c === "email" ? "o convite e para outro e-mail" : "convite desconhecido" : d === "user" ? c === "exists" ? "esse usuario ja existe" : c === "reserved" ? "esse usuario esta reservado" : "usuario nao existe" : d === "attempts" ? "muitas tentativas \u2014 aguarde um pouco" : 
  d === "auth" ? c === "bad code" ? "codigo errado" : "usuario ou senha recusados" : d === "op" ? c === "bad email" ? "e-mail invalido" : c === "empty password" ? "informe a senha" : "o servidor recusou a operacao" + (c ? " (" + c + ")" : "") : d === "quota" ? "cota de convites esgotada" : d === "role" ? "sem permissao para isso" : b === "SecurityError" ? "usuario ou senha recusados" : b === "NotFoundError" ? "usuario nao existe" : b === "NetworkError" || b === "TimeoutError" || b === "AbortError" ? 
  "sem conexao com o servidor" : b === "InvalidStateError" ? "o servidor recusou a operacao" : "falha: " + (a && a.message || String(a));
}
function Kq(a) {
  return {role:a.role, display:a.display, perm:{bundle:a.Ua.Tc, uuids:a.Ua.Mc, modules:a.Ua.kd}};
}
let Gq = "";
function Lq() {
  var a = (new URLSearchParams(window.location.search)).get("invite") || "";
  Gq = String(a || "").trim();
}
const Mq = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
async function Nq(a, b, c, d) {
  a = String(a || "").trim();
  b = String(b || "").trim();
  c = String(c || "").trim();
  if (!Qn.test(a)) {
    return [0, a, "usuario invalido: 1 a 32 letras, digitos, ponto, traco; comeca com letra"];
  }
  if (!Mq.test(b)) {
    return [0, a, "e-mail invalido"];
  }
  if (Number(d) !== 1) {
    return [0, a, "aceite os termos para continuar"];
  }
  try {
    await Dq(a, b, c);
  } catch (e) {
    return [0, a, Jq(e)];
  }
  return [1, a.toLowerCase(), "codigo enviado para " + b + " \u2014 digite-o abaixo e clique em Criar conta"];
}
async function Oq(a, b, c, d) {
  a = String(a || "").trim();
  b = String(b || "").trim();
  if (!b) {
    return Iq("informe o codigo recebido por e-mail");
  }
  if (!c) {
    return Iq("informe a senha");
  }
  if (String(c) !== String(d)) {
    return Iq("as senhas nao conferem");
  }
  let e;
  try {
    e = await Eq(a, b, String(c));
  } catch (f) {
    return Iq(Jq(f));
  }
  await ko(e.Aa, e.la, e.expires, Kq(e));
  await wq();
  return Iq("conta criada \u2014 entrando como " + e.Aa);
}
async function Pq() {
  if (!Gq) {
    return [0, "", ""];
  }
  try {
    const a = await Fq();
    return [a.valid ? 1 : 0, Gq, a.$a ? "convite: " + a.$a : "convite valido"];
  } catch (a) {
    return [0, Gq, Jq(a)];
  }
}
async function Qq(a, b) {
  a = String(a || "").trim();
  if (!a || !b) {
    return Iq("informe usuario e senha");
  }
  let c;
  try {
    c = await Bq(a, String(b));
  } catch (d) {
    return Iq(Jq(d));
  }
  await ko(c.Aa, c.la, c.expires, Kq(c));
  await wq();
  return Iq("conectado como " + c.Aa + " \u2014 recarregando");
}
async function Rq() {
  const a = jo();
  if (a) {
    try {
      await Cq(a);
    } catch (b) {
      console.warn("[account] logout no servidor:", b && b.message || b);
    }
  }
  await fo();
  nq();
  rq = !1;
  xq();
  return Iq("sessao encerrada \u2014 recarregando");
}
async function Sq() {
  return Iq();
}
const Tq = [];
function Uq() {
  return new Promise(a => {
    Tq.push(a);
  });
}
function Vq(a) {
  if (X) {
    var b = X.Ua.Mc;
    a = !b.length || b.includes("*") ? !0 : b.includes(a);
  } else {
    a = !0;
  }
  return a ? 1 : 0;
}
function Wq() {
  const a = Xn;
  return !Gq || a !== 0 && a !== 5 ? 0 : 1;
}
function Xq() {
  return "<#6a6f7a>versao do aplicativo: 2026-11-17 16:44 \u00b7 motor: f14d06c5";
}
;let Yq = null;
function Zq() {
  Yq || (console.log("[pdf] carregando pdf.js 4.10.38"), Yq = zb(a => `import * as _ from '${"https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs"}'; window['${a}'](_);`).then(a => {
    a.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
    return a;
  }).catch(a => {
    Yq = null;
    throw a;
  }));
  return Yq;
}
const $q = new Map();
let ar = 1;
async function br(a) {
  try {
    const b = new Uint8Array(await crypto.subtle.digest("SHA-256", a));
    a = "";
    for (let c = 0; c < b.length; c++) {
      a += (b[c] < 16 ? "0" : "") + b[c].toString(16);
    }
    return a;
  } catch (b) {
    return console.warn("[pdf] sha256:", b), "";
  }
}
function cr(a, b) {
  if (!b) {
    return "";
  }
  try {
    const c = a.PDFDateString.toDateObject(String(b));
    if (!c) {
      return "";
    }
    a = d => (d < 10 ? "0" : "") + d;
    return c.getFullYear() + "-" + a(c.getMonth() + 1) + "-" + a(c.getDate()) + " " + a(c.getHours()) + ":" + a(c.getMinutes());
  } catch (c) {
    return "";
  }
}
async function dr(a, b) {
  const c = [];
  for (let d = 0; d < 9; d++) {
    c.push("");
  }
  try {
    const d = await b.getMetadata(), e = d && d.info ? d.info : {};
    b = f => {
      f = e[f];
      return f == null ? "" : String(f);
    };
    c[0] = b("Title");
    c[1] = b("Author");
    c[2] = b("Subject");
    c[3] = b("Keywords");
    c[4] = b("Creator");
    c[5] = b("Producer");
    c[6] = cr(a, e.CreationDate);
    c[7] = cr(a, e.ModDate);
    c[8] = b("PDFFormatVersion");
  } catch (d) {
    console.warn("[pdf] metadata:", d);
  }
  return c;
}
;const er = {pf:180000, mf:32768};
function fr(a) {
  switch(a) {
    case "too_big":
      return "too_big";
    case "storage":
      return "storage";
    case "hash":
      return "hash";
    case "not_found":
      return "not_found";
    case "auth":
    case "token":
      return "auth";
    default:
      return "error";
  }
}
async function gr(a, b, c, d) {
  var e = a.h() || "";
  if (!e) {
    return {result:"auth", data:{}};
  }
  e = {op:b, t:e};
  for (const f of Object.keys(c)) {
    e[f] = c[f];
  }
  c = null;
  try {
    c = await Hp(a.url, e, d);
  } catch (f) {
    return {result:"offline", data:{}};
  }
  return c.ok ? {result:"ok", data:c.data || {}} : (console.warn("[shared]", b, c.error, c.msg || ""), {result:fr(String(c.error || "")), data:{}});
}
async function hr(a) {
  a = await gr(a, a.g.Bh, {});
  const b = [];
  for (const c of a.data.files || []) {
    b.push({key:String(c.key), size:Number(c.size) || 0, name:String(c.name || "")});
  }
  return {result:a.result, files:b, Gi:Number(a.data.used) || 0, ii:Number(a.data.max_user) || 0, hi:Number(a.data.max_file) || 0};
}
async function ir(a, b, c, d) {
  d = await gr(a, a.g.uh, {sha:b, size:c.size, name:d});
  if (d.result !== "ok") {
    return d.result;
  }
  if (d.data.state === "have") {
    return "have";
  }
  b = String(d.data.up || "");
  d = Number(d.data.part) || 0;
  if (!(b && d > 0)) {
    return "error";
  }
  for (let f = 0; f < c.size;) {
    const g = new Uint8Array(await c.slice(f, f + d).arrayBuffer());
    var e = "";
    for (let h = 0; h < g.length; h += er.mf) {
      e += String.fromCharCode.apply(null, g.subarray(h, h + er.mf));
    }
    e = await gr(a, a.g.Gh, {up:b, offset:f, b64:btoa(e)}, er.pf);
    if (e.result !== "ok") {
      return e.result;
    }
    f += g.length;
    if (e.data.state === "done") {
      return f === c.size ? "done" : "error";
    }
  }
  return "error";
}
async function jr(a, b) {
  a = await gr(a, a.g.Ah, {sha:b});
  return a.result !== "ok" ? a.result : a.data.released ? "ok" : "not_found";
}
class kr {
  constructor() {
    this.url = "https://script.google.com/macros/s/AKfycbz8kvZBqee545Q7d9yebhOuDfH7JYvLqaN_sZxSSK1Mi9Q23us-MvgSUsCkbNooyKy61A/exec";
    this.h = jo;
    this.g = {Bh:"pdf_list", uh:"pdf_begin", Gh:"pdf_part", Hh:"pdf_read", Ah:"pdf_drop"};
  }
  async get(a, b) {
    let c = null, d = 0;
    do {
      var e = await gr(this, this.g.Hh, {sha:a, offset:d}, er.pf);
      if (e.result !== "ok") {
        return {result:e.result, bytes:null};
      }
      var f = atob(String(e.data.b64 || ""));
      const g = new Uint8Array(f.length);
      for (let h = 0; h < f.length; h++) {
        g[h] = f.charCodeAt(h);
      }
      f = g;
      e = Number(e.data.size) || 0;
      c ||= new Uint8Array(e);
      if (!f.length || d + f.length > e) {
        return {result:"error", bytes:null};
      }
      c.set(f, d);
      d += f.length;
      b && b(d, e);
    } while (d < e);
    return {result:"ok", bytes:c ? c.buffer : null};
  }
}
;const lr = {ok:0, have:1, done:2, too_big:3, storage:4, hash:5, not_found:6, auth:7, offline:8};
function mr(a) {
  a = lr[String(a)];
  return a === void 0 ? 9 : a;
}
const nr = new Map();
let or = "", pr = "", qr = null, rr = null, sr = null, tr = null, ur = null, vr = null, wr = null, xr = "";
const yr = new Map(), zr = new Map();
async function Ar() {
  if (!wr) {
    const a = new xa(xr);
    await a.init();
    wr = a;
  }
  return wr;
}
async function Br(a, b) {
  if (typeof FileSystemHandle !== "undefined" && b instanceof FileSystemHandle) {
    try {
      await (await Ar()).set(a, b);
      yr.delete(a);
      return;
    } catch (c) {
      console.warn("[library] o handle da fonte NAO foi gravado no IndexedDB (vale so nesta sessao: o vinculo se perde no reload):", c);
    }
  }
  yr.set(a, b);
}
async function Cr(a) {
  var b = nr.get(a);
  return b ? await b() : (b = yr.get(a)) ? b : (a = await (await Ar()).get(a)) && typeof a.queryPermission === "function" ? a : null;
}
const Dr = /[\\/:*?"<>|]/g;
async function Er() {
  let a = [];
  try {
    a = (await (await Ar()).j() || []).map(String);
  } catch (b) {
    a = [];
  }
  for (const b of yr.keys()) {
    a.indexOf(b) < 0 && a.push(b);
  }
  return a;
}
async function Fr(a) {
  const b = [];
  for (const c of await Er()) {
    let d = null;
    try {
      d = await Cr(c);
    } catch (e) {
      d = null;
    }
    if (d && typeof d.isSameEntry === "function" && typeof a.isSameEntry === "function") {
      try {
        if (await d.isSameEntry(a)) {
          return {cb:c, exact:!0, gd:[]};
        }
        if (d.kind === "directory" && await d.resolve(a) !== null) {
          return {cb:c, exact:!1, gd:[]};
        }
        a.kind === "directory" && await a.resolve(d) !== null && b.push(c);
      } catch (e) {
      }
    }
  }
  return {cb:"", exact:!1, gd:b};
}
function Gr(...a) {
  (ja >> 7 & 1) === 1 && console.log("[lib]", ...a);
}
async function Hr(a, b) {
  const c = await Fr(b);
  Gr("settle", a, "escolhido=" + (b.name || ""), "kind=" + b.kind, "ja coberto por=" + (c.cb || "-"), "exato=" + c.exact, "contem=" + c.gd.join("|"));
  if (c.cb) {
    return c.exact && (await Br(c.cb, b), zr.set(c.cb, 0)), [2, b.name || "", c.cb, ""];
  }
  for (const d of c.gd) {
    await Ir(d);
  }
  await Br(a, b);
  zr.set(a, 0);
  return [1, b.name || "", "", c.gd.join("|")];
}
function Jr(a) {
  if (a === or && or) {
    return qr && qr() ? 0 : 1;
  }
  if (nr.has(a)) {
    return 0;
  }
  a = zr.get(a);
  return a === void 0 ? 2 : a;
}
function Kr(a) {
  return JSON.stringify(String(a == null ? "" : a));
}
async function Lr(a, b) {
  Gr("open_path", a, b);
  var c = await Cr(a);
  if (!c) {
    throw Error("library.open_path: fonte sem handle: " + a);
  }
  if (!await cb(c, !1)) {
    throw Error("library.open_path: sem permissao: " + a);
  }
  if (c.kind === "file") {
    return c;
  }
  b = String(b || "");
  const d = b.lastIndexOf("/");
  a = d < 0 ? "" : b.slice(0, d);
  b = d < 0 ? b : b.slice(d + 1);
  c = a ? await lb(c, a) : c;
  if (!c) {
    throw Error("library.open_path: pasta nao existe: " + a);
  }
  return await c.getFileHandle(b);
}
async function Mr(a) {
  a = new Uint8Array(await crypto.subtle.digest("SHA-256", a));
  let b = "";
  for (let c = 0; c < a.length; c++) {
    b += (a[c] < 16 ? "0" : "") + a[c].toString(16);
  }
  return b;
}
async function Ir(a) {
  for (const b of String(a).split("|")) {
    if (b && !nr.has(b) && b !== or) {
      yr.delete(b);
      zr.delete(b);
      try {
        await (await Ar()).g(b);
      } catch (c) {
      }
    }
  }
  return [1];
}
async function Nr() {
  if (!qr || !qr() || !rr) {
    throw Error("library.list: sem servidor de arquivos");
  }
  const a = await rr();
  if (mr(a[0]) !== 0) {
    throw Error("library.list: servidor: " + a[0]);
  }
  vr = [Number(a[2]) || 0, Number(a[3]) || 0, Number(a[4]) || 0];
  const b = [];
  for (const c of a[1] || []) {
    b.push('{"id":' + (b.length + 1) + ',"path":' + Kr(c[0]) + ',"name":' + Kr(c[2]) + ',"size":' + Math.round(Number(c[1]) || 0) + ',"mtime":0}');
  }
  Gr("servidor:", b.length, "arquivo(s)");
  return "[" + b.join(",") + "]";
}
function Or(a, b, c, d) {
  var e = Pr;
  or = "@server";
  pr = "@browser";
  qr = e;
  rr = a;
  sr = b;
  tr = c;
  ur = d;
  vr = null;
}
;async function Qr() {
  try {
    let a = Ua();
    for (const b of ["internal", "books", ""]) {
      b && (a = await a.getDirectoryHandle(b, {create:!0}));
    }
    return a;
  } catch (a) {
    return console.warn("[library] a pasta dos livros neste navegador:", a), null;
  }
}
function Pr() {
  const a = oq;
  return !!a && a.profile === 3 && !!jo();
}
;async function Rr() {
  var a = Ya("artifacts");
  const b = new xa("artifacts");
  await b.init();
  if (await b.get("__migrated__")) {
    return {n:0, total:0};
  }
  await a.init();
  var c = await b.j() || [];
  let d = 0, e = 0;
  for (const f of c) {
    if (f === "__migrated__") {
      continue;
    }
    (c = await b.get(f)) && typeof c === "object" && (e++, c.handle && await Sa(a, f, c.handle), await a.has(f) || (await Ra(a, f, {name:c.name || "", artifacts:c.artifacts || {}}), d++));
  }
  await b.set("__migrated__", Date.now());
  e && console.log("artifacts: migrados", d, "de", e, "registros do store antigo", "artifacts");
  return {n:d, total:e};
}
;async function Sr(a) {
  try {
    const b = ["internal", "docs", "index.json"].filter(c => !!c);
    for (let c = 0; c + 1 < b.length; c++) {
      a = await a.getDirectoryHandle(b[c]);
    }
    return await (await (await a.getFileHandle(b[b.length - 1])).getFile()).text();
  } catch (b) {
    return null;
  }
}
async function Tr() {
  var a = Ya("artifacts"), b = Ua();
  await a.init();
  let c = null;
  b = await Sr(b);
  if (b !== null) {
    try {
      var d = JSON.parse(b);
      Array.isArray(d) && (c = new Set(d.map(l => String(l && l.key || "")).filter(l => !!l)));
    } catch (l) {
      console.warn("art_prune: registro de documentos ilegivel \u2014 pick: nao podado", l);
    }
  }
  let e = null;
  d = await a.get("f263103a-fd02-46f6-848c-149c905b055e", "e063103a-8f02-4ff6-a78c-143e905b055e");
  if (d !== null) {
    try {
      var f = JSON.parse(d);
      e = new Set((f && Array.isArray(f.rows) ? f.rows : []).filter(l => (Number(l[0]) || 0) > 0).map(l => typeof l[24] === "string" ? l[24] : "").filter(l => !!l));
    } catch (l) {
      console.warn("art_prune: PANELS ilegivel \u2014 painel nao podado", l);
    }
  }
  const g = new Set();
  try {
    const l = JSON.parse(await a.h("d863103a-9201-4cf6-a38c-14e6905b065e"));
    Array.isArray(l) && l.forEach(p => {
      (p = String(p && p.key || "")) && g.add(p);
    });
  } catch (l) {
    console.warn("art_prune: catalogo de paineis ilegivel \u2014 painel nao podado", l);
  }
  let h = 7;
  f = await a.get("f263103a-fd02-46f6-848c-149c905b055e", "646310fe-a802-4797-838c-1475905be35e");
  if (f !== null) {
    try {
      const l = JSON.parse(f), p = l && Array.isArray(l.rows) ? l.rows : [];
      p.length && typeof p[0][0] === "number" && (h = p[0][0]);
    } catch (l) {
      console.warn("art_prune: WORK_CFG ilegivel \u2014 retencao padrao", l);
    }
  }
  const k = new Map();
  try {
    const l = JSON.parse(await a.h("f66310fe-4c01-4f97-b78c-14f5905be35e"));
    Array.isArray(l) && l.forEach(p => {
      const r = String(p && p.key || "");
      r && k.set(r, Number(p.modified) || 0);
    });
  } catch (l) {
    console.warn("art_prune: catalogo de paineis fechados ilegivel \u2014 nao podado", l);
  }
  const m = Date.now();
  a = await Qa(a, l => l.startsWith("pick:") ? c === null || c.has(l.slice(5)) : g.has(l) ? e === null || e.has(l) : k.has(l) ? !(h >= 0 && m - k.get(l) > h * 86400e3) : !0);
  a.length && console.log("artifacts: poda \u2014", a.length, "registro(s) orfao(s) removido(s):", a.join(", "));
  return a;
}
;[2, 3, 4, 6, 8, 10].map(a => ({name:String(a), code:a}));
[-12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(a => ({name:a === 0 ? "UTC" : "UTC" + (a > 0 ? "+" : "") + a, code:a}));
Array.from({length:12}, (a, b) => ({name:String(b + 1), code:b + 1}));
const Z = a => typeof a === "number" ? a : 0;
async function Ur(a, b, c) {
  a = await a.get(b, c);
  if (a === null) {
    return null;
  }
  try {
    const d = JSON.parse(a);
    if (d && d.kind === "table" && Array.isArray(d.rows) && Array.isArray(d.schema)) {
      return d;
    }
  } catch (d) {
    console.warn("desk_boot: artefato ilegivel", b, c, d);
  }
  return null;
}
async function Vr(a, b, c, d) {
  await a.set(b, c, JSON.stringify(d));
}
const Wr = [8, 14, 24], Xr = [1, 2, 4, 6];
function Yr(a, b, c) {
  const d = a.length + b.length + c.length;
  let e = !1;
  a = a.filter(k => Z(k[0]) > 0);
  let f = new Set(a.map(k => Z(k[24])));
  a = a.filter(k => Wr.indexOf(Z(k[1])) < 0 || f.has(Z(k[8])));
  f = new Set(a.map(k => Z(k[24])));
  const g = [];
  for (const k of b) {
    b = k.slice();
    if (Z(b[3]) === 0) {
      continue;
    }
    if (Z(b[0]) === 0 && !f.has(Z(b[2]))) {
      continue;
    }
    const m = Z(b[5]);
    if (m >= 0 && !f.has(m)) {
      if (Xr.indexOf(Z(b[3])) < 0) {
        continue;
      }
      b[5] = -1;
      e = !0;
    }
    g.push(b);
  }
  const h = new Set(a.filter(k => Z(k[1]) === 12).map(k => Z(k[8])));
  c = c.filter(k => Z(k[0]) > 0 && h.has(Z(k[0])));
  a.length + g.length + c.length !== d && (e = !0);
  return {tg:a, Uf:g, jf:c, Wh:e};
}
async function Zr() {
  var a = Ya("artifacts");
  await a.init();
  const b = [], c = await Ur(a, "f263103a-fd02-46f6-848c-149c905b055e", "e063103a-8f02-4ff6-a78c-143e905b055e");
  var d = [];
  const e = new Set();
  if (c) {
    var f = c.rows.length, g = c.rows.filter(k => Z(k[0]) > 0 && !(typeof k[24] !== "string" || !k[24]));
    for (var h of g) {
      d.push(typeof h[24] === "string" ? h[24] : ""), e.add(Z(h[0]));
    }
    g.length !== f && (await Vr(a, "f263103a-fd02-46f6-848c-149c905b055e", "e063103a-8f02-4ff6-a78c-143e905b055e", Object.assign({}, c, {rows:g})), b.push("PANELS " + f + " \u2192 " + g.length));
  }
  if (f = await Ur(a, "f263103a-fd02-46f6-848c-149c905b055e", "2f63103a-a102-4ff6-b58c-148b905b055e")) {
    g = f.rows.length, h = f.rows.filter(k => Z(k[0]) !== 0 && (Z(k[0]) !== 2 || !c || e.has(Z(k[2])))), h.length !== g && (await Vr(a, "f263103a-fd02-46f6-848c-149c905b055e", "2f63103a-a102-4ff6-b58c-148b905b055e", Object.assign({}, f, {rows:h})), b.push("WINDOWS " + g + " \u2192 " + h.length));
  }
  for (const k of d) {
    d = k;
    f = await Ur(a, d, "a563103a-4e02-48f6-898c-14bb905b055e");
    if (!f) {
      continue;
    }
    g = await Ur(a, d, "9863103a-f802-41f6-bb8c-1475905b055e");
    h = await Ur(a, d, "b263103a-8a02-42f6-868c-142e905b055e");
    const m = Yr(f.rows, g ? g.rows : [], h ? h.rows : []);
    m.Wh && (m.tg.length !== f.rows.length && await Vr(a, d, "a563103a-4e02-48f6-898c-14bb905b055e", Object.assign({}, f, {rows:m.tg})), g && (m.Uf.length ? await Vr(a, d, "9863103a-f802-41f6-bb8c-1475905b055e", Object.assign({}, g, {rows:m.Uf})) : await Pa(a, d, "9863103a-f802-41f6-bb8c-1475905b055e")), h && m.jf.length !== h.rows.length && (m.jf.length ? await Vr(a, d, "b263103a-8a02-42f6-868c-142e905b055e", Object.assign({}, h, {rows:m.jf})) : await Pa(a, d, "b263103a-8a02-42f6-868c-142e905b055e")), 
    b.push("painel " + k + ": GC"));
  }
  b.length && console.log("desk_boot:", b.join("; "));
  return b;
}
;function $r(a) {
  const b = Ue();
  var c = new zf();
  const d = c.Bb(b);
  d.name("RECS");
  const e = d.M.Y.local(40, "px"), f = d.M.Y.local(40, "py"), g = d.M.Y.local(1.0, "pw"), h = d.M.Y.local(1.0, "ph");
  d.segment(1);
  d.R.save();
  d.R.translate(e, f);
  d.segment(0);
  d.R.fillStyle = "#e33";
  const k = d.M.h(g, 60), m = d.M.h(h, 40);
  d.R.fillRect(0, 0, k, m);
  d.R.fillStyle = "#36c";
  d.R.fillRect(30, 20, k, m);
  d.pb("0f63102f-5309-4df6-ba8c-149e905b1f5f", 1, 0, 0, k, m);
  d.self.Tb(1).ya(0, 8);
  d.self.Tb(13).ya(0, e).ya(1, f).ya(2, g).ya(3, h);
  d.self.Tb(2).ya(0, e).ya(1, f);
  d.segment(2);
  d.R.restore();
  d.end();
  Hg(a.g, b, c);
  c = lh(a.h, b, Jf(a.h));
  a.o(c, (l, p) => {
    console.log("[dev_gralm_cmds] seedMoveElement uuid:", b, "\u2192 ptr", p, "status", l);
  });
}
function as(a) {
  const b = Ue();
  var c = new zf();
  const d = c.Bb(b);
  d.name("MANDALA");
  const e = d.M.Y.local(50, "px"), f = d.M.Y.local(100, "py");
  d.segment(1);
  d.R.save();
  d.R.translate(e, f);
  d.segment(0);
  const g = Math.PI / 180;
  d.R.fillStyle = "#efe6d8";
  d.R.strokeStyle = "#6b4a86";
  d.R.lineWidth = 1;
  var h = [];
  for (var k = 0; k < 12; k++) {
    h.push(k * 30);
  }
  h = d.M.i(h);
  d.jb("d963103a-7601-4df6-8b8c-14e9905b0058", [h, 200, 400, 110, 30]);
  h = 75 * g;
  d.pb("0f63102f-5309-4df6-ba8c-149e905b1f5f", 1, 200 + 77 * Math.cos(h) - 16.5, 400 + 77 * Math.sin(h) - 16.5, 33, 33);
  for (h = 0; h < 12; h++) {
    k = (180 - (h * 30 + 15)) * g, d.pb("3963102f-2309-4df6-968c-1455905b1f5f", 100 + h, 200 + 125 * Math.cos(k) - 11, 400 + 125 * Math.sin(k) - 11, 22, 22);
  }
  d.self.Tb(1).ya(0, 8);
  d.self.Tb(2).ya(0, e).ya(1, f);
  d.segment(2);
  d.R.restore();
  d.end();
  Hg(a.g, b, c);
  c = lh(a.h, b, Jf(a.h), void 0, 800);
  a.o(c, (m, l) => {
    console.log("[dev_gralm_cmds] seedMandala uuid:", b, "\u2192 ptr", l, "status", m, "feito");
  });
}
function bs(a, b) {
  return Gf(a, b, {Jb:(c, d) => {
    console.log("hook js set_data", c, d);
  }});
}
;Sc.set(1, async(a, b) => {
  a.W || await new Promise(p => {
    const r = () => a.W ? p() : setTimeout(r, 1);
    r();
  });
  const c = a.K[b], d = new Lh(a, b);
  if (b = document.getElementById("dpanel")) {
    var e = document.createElement("div");
    e.style.pointerEvents = "auto";
    b.appendChild(e);
    var f = new li();
    dp(f, d);
    hi(f);
    var g = !1, h = !1;
    await Rc(f, e).then(() => {
      g = !0;
      h && f.refresh();
    });
    b = c[5];
    var k = new lp(a, b, d);
    ep(k);
    var m = bs(a, b), l = () => {
      g ? f.refresh() : h = !0;
    };
    c[1] = () => {
      d.W = !0;
      l();
    };
    c[2] = () => {
      f.da = !0;
      d.ta && (d.ta.unregister(), d.ta = null);
      d.ua = null;
      k.P();
      m.unregister();
      e.remove();
    };
    d.ua = l;
    $r(d);
    as(d);
  } else {
    console.error("factory: #dpanel nao encontrado");
  }
});
yq();
(function() {
  Zn.push(() => {
    const b = Tq.splice(0);
    if (b.length) {
      var c = Iq();
      for (const d of b) {
        d(c);
      }
    }
  });
  const a = [];
  a[0] = Qq;
  a[1] = Rq;
  a[2] = Sq;
  a[3] = Uq;
  a[4] = Nq;
  a[5] = Oq;
  a[6] = Pq;
  a[7] = Vq;
  a[8] = Wq;
  a[9] = Xq;
  $a.set("account", a);
})();
$a.set("pdf", [async function(a) {
  var b = await Zq();
  a = await a.getFile();
  var c = new Uint8Array(await a.arrayBuffer());
  const d = await br(c);
  c = await b.getDocument({data:c}).promise;
  const e = ar++;
  $q.set(e, c);
  console.log("[pdf] open", a.name, c.numPages, "pagina(s)", d.slice(0, 12));
  const f = (await c.getPage(1)).getViewport({scale:1});
  var g = c.fingerprints;
  g = g && g[0] ? String(g[0]) : "";
  b = await dr(b, c);
  return [e, c.numPages, f.width, f.height, a.size, a.name, d, g].concat(b);
}, async function(a, b, c, d, e, f, g) {
  var h = $q.get(a);
  if (!h) {
    throw Error("pdf.render: documento " + a + " nao esta aberto");
  }
  a = Math.max(1, Math.round(f));
  g = Math.max(1, Math.round(g));
  b = await h.getPage(b);
  c = b.getViewport({scale:c});
  h = (new OffscreenCanvas(a, g)).getContext("2d");
  h.translate(-d, -e);
  await b.render({canvasContext:h, viewport:c, background:"rgb(255,255,255)"}).promise;
  return h.getImageData(0, 0, a, g).data.buffer;
}, async function(a) {
  const b = $q.get(a);
  if (!b) {
    return [0];
  }
  $q.delete(a);
  try {
    await b.destroy();
  } catch (c) {
    console.warn("[pdf] close:", c);
  }
  return [1];
}, async function(a) {
  const b = $q.get(a);
  if (!b) {
    throw Error("pdf.pages: documento " + a + " nao esta aberto");
  }
  a = b.numPages;
  const c = [];
  for (let d = 1; d <= a; d++) {
    const e = (await b.getPage(d)).getViewport({scale:1});
    c.push('{"id":' + d + ',"page":' + d + ',"w":' + e.width + ',"h":' + e.height + "}");
  }
  return "[" + c.join(",") + "]";
}, async function(a) {
  const b = !!document.fullscreenElement;
  a === 2 && (a = b ? 0 : 1);
  try {
    a && !b ? xb() : !a && b && yb();
  } catch (c) {
    console.warn("[pdf] fullscreen:", c);
  }
  await new Promise(c => setTimeout(c, 150));
  return [document.fullscreenElement ? 1 : 0];
}, async function(a, b) {
  var c = $q.get(a);
  if (!c) {
    throw Error("pdf.text: documento " + a + " nao esta aberto");
  }
  a = await Zq();
  c = await c.getPage(b);
  b = c.getViewport({scale:1});
  c = (await c.getTextContent()).items;
  const d = [];
  let e = 0;
  for (let f = 0; f < c.length; f++) {
    const g = c[f], h = g.str == null ? "" : String(g.str);
    if (h.trim() === "") {
      g.hasEOL && d.length && (d[d.length - 1] = d[d.length - 1].replace('"eol":0', '"eol":1'));
      continue;
    }
    const k = a.Util.transform(b.transform, g.transform), m = Math.hypot(k[2], k[3]) || g.height || 0;
    d.push('{"idx":' + e + ',"x":' + k[4].toFixed(2) + ',"y":' + (k[5] - m).toFixed(2) + ',"w":' + (g.width || 0).toFixed(2) + ',"h":' + m.toFixed(2) + ',"eol":' + (g.hasEOL ? 1 : 0) + ',"str":' + JSON.stringify(h) + "}");
    e++;
  }
  return "[" + d.join(",") + "]";
}]);
xr = "ploft.lib_sources";
const cs = [async function(a) {
  let b = null;
  const c = performance.now();
  Gr("pick_folder: pedido", a, "foco=" + document.hasFocus(), "gesto ativo=" + (navigator.userActivation ? navigator.userActivation.isActive : "?"));
  try {
    b = await bb("ploft_library");
  } catch (d) {
    console.warn("[library] pick_folder: o seletor nao abriu / foi cancelado:", d), b = null;
  }
  Gr("pick_folder: o seletor devolveu", b ? b.name || "(sem nome)" : "NADA", "ms=" + Math.round(performance.now() - c), "foco=" + document.hasFocus(), "visivel=" + document.visibilityState, "tela cheia=" + !!document.fullscreenElement);
  if (!b) {
    return [0, "", "", ""];
  }
  if (!await cb(b, !1)) {
    return console.warn("[library] pick_folder: pasta escolhida sem permissao de leitura"), [0, "", "", ""];
  }
  try {
    return await Hr(a, b);
  } catch (d) {
    return console.warn("[library] pick_folder: nao guardou a pasta:", d), [0, "", "", ""];
  }
}, async function(a, b) {
  let c = null;
  const d = performance.now();
  Gr("pick_file: pedido", a, b, "foco=" + document.hasFocus(), "gesto ativo=" + (navigator.userActivation ? navigator.userActivation.isActive : "?"));
  try {
    const e = b === ".pdf" ? [db()] : [], f = await window.showOpenFilePicker(e.length ? {types:e} : {});
    c = f && f[0] ? f[0] : null;
  } catch (e) {
    console.warn("[library] pick_file: o seletor nao abriu / foi cancelado:", e), c = null;
  }
  Gr("pick_file: o seletor devolveu", c ? c.name || "(sem nome)" : "NADA", "ms=" + Math.round(performance.now() - d), "foco=" + document.hasFocus(), "visivel=" + document.visibilityState, "tela cheia=" + !!document.fullscreenElement);
  if (!c) {
    return [0, "", "", ""];
  }
  try {
    return await Hr(a, c);
  } catch (e) {
    return console.warn("[library] pick_file: nao guardou o arquivo:", e), [0, "", "", ""];
  }
}];
cs[2] = Jr;
cs[3] = async function(a) {
  if (a === or && or) {
    return [Jr(a)];
  }
  const b = await Cr(a);
  let c = 1;
  b && (c = await cb(b, !1) ? 0 : 2);
  zr.set(a, c);
  return [c];
};
cs[4] = async function(a, b) {
  if (a === or && or) {
    return await Nr();
  }
  var c = await Cr(a);
  if (!c) {
    throw zr.set(a, 1), Error("library.list: fonte sem handle: " + a);
  }
  if (!await cb(c, !0)) {
    throw zr.set(a, 2), Error("library.list: sem permissao: " + a);
  }
  const d = String(b || "").toLowerCase(), e = [];
  b = (g, h, k, m) => {
    e.push('{"id":' + (e.length + 1) + ',"path":' + Kr(g) + ',"name":' + Kr(h) + ',"size":' + Math.round(k || 0) + ',"mtime":' + Math.round(m || 0) + "}");
  };
  if (c.kind === "file") {
    var f = await c.getFile();
    b("", c.name, f.size, f.lastModified);
  } else {
    c = await jb(c, !0);
    for (f of c) {
      f.isfile && (!d || String(f.name).toLowerCase().endsWith(d)) && b(f.folder ? f.folder + "/" + f.name : f.name, f.name, f.size, f.file ? f.file.lastModified : 0);
    }
  }
  zr.set(a, 0);
  Gr("list", a, e.length, "arquivo(s)");
  return "[" + e.join(",") + "]";
};
cs[5] = Lr;
cs[6] = Ir;
cs[7] = async function(a, b) {
  a = await (await Lr(a, b)).getFile();
  return [await a.text(), a.size];
};
cs[8] = async function() {
  const a = await Er(), b = new Map();
  for (var c of a) {
    var d = null;
    try {
      d = await Cr(c);
    } catch (f) {
      d = null;
    }
    var e = 1;
    d && (e = await cb(d, !0) ? 0 : 2, b.set(c, d));
    zr.set(c, e);
  }
  c = [];
  d = Array.from(b.keys());
  for (const f of d) {
    if (c.indexOf(f) >= 0) {
      continue;
    }
    if ((e = b.get(f)) && typeof e.isSameEntry === "function") {
      for (const g of d) {
        if (f === g || c.indexOf(g) >= 0) {
          continue;
        }
        const h = b.get(g);
        if (h && typeof h.isSameEntry === "function") {
          try {
            const k = await e.isSameEntry(h), m = !k && e.kind === "directory" && await e.resolve(h) !== null;
            (k || m) && c.push(g);
          } catch (k) {
          }
        }
      }
    }
  }
  for (const f of c) {
    await Ir(f);
  }
  return [a.length, c.join("|")];
};
cs[9] = async function(a, b) {
  try {
    const c = await (await Lr(a, b)).getFile();
    return [await Mr(await c.arrayBuffer())];
  } catch (c) {
    return console.warn("[library] hash:", b, c), [""];
  }
};
cs[10] = async function() {
  if (!qr || !qr() || !rr) {
    return [10, 0, 0, 0];
  }
  if (!vr) {
    const a = await rr(), b = mr(a[0]);
    if (b !== 0) {
      return [b, 0, 0, 0];
    }
    vr = [Number(a[2]) || 0, Number(a[3]) || 0, Number(a[4]) || 0];
  }
  return [0, vr[0], vr[1], vr[2]];
};
cs[11] = async function(a, b) {
  if (!qr || !qr() || !sr) {
    return [10, "", 0];
  }
  let c = null, d = "";
  try {
    c = await (await Lr(a, b)).getFile(), d = await Mr(await c.arrayBuffer());
  } catch (e) {
    return console.warn("[library] remote_put: nao leu", b, e), [11, "", 0];
  }
  if (!c) {
    return [11, "", 0];
  }
  a = mr(await sr(d, c, c.name));
  if (a === 1 || a === 2) {
    vr = null;
  }
  return [a, d, c.size];
};
cs[12] = async function(a, b) {
  if (!qr || !qr() || !tr) {
    return [10, ""];
  }
  let c = null;
  try {
    c = pr ? await Cr(pr) : null;
  } catch (f) {
    c = null;
  }
  if (!c) {
    return [11, ""];
  }
  b = String(b || "").replace(Dr, "_") || a + ".pdf";
  try {
    var d = await (await c.getFileHandle(b)).getFile();
    if (await Mr(await d.arrayBuffer()) === a) {
      return [0, b];
    }
    var e = b.lastIndexOf(".");
    const f = " (" + a.slice(0, 8) + ")";
    b = e > 0 ? b.slice(0, e) + f + b.slice(e) : b + f;
  } catch (f) {
  }
  e = await tr(a);
  d = mr(e[0]);
  e = e[1] || null;
  if (d !== 0 || !e) {
    return [d === 0 ? 9 : d, ""];
  }
  if (await Mr(e) !== a) {
    return [5, ""];
  }
  try {
    const f = await (await c.getFileHandle(b, {create:!0})).createWritable();
    await f.write(e);
    await f.close();
  } catch (f) {
    return console.warn("[library] remote_get: nao gravou", b, f), [11, ""];
  }
  return [0, b];
};
cs[13] = async function(a) {
  if (!qr || !qr() || !ur) {
    return [10];
  }
  a = mr(await ur(a));
  a === 0 && (vr = null);
  return [a];
};
$a.set("library", cs);
(function() {
  const a = new kr();
  nr.set("@browser", Qr);
  Or(async() => {
    const b = await hr(a);
    return [b.result, b.files.map(c => [c.key, c.size, c.name]), b.Gi, b.ii, b.hi];
  }, (b, c, d) => ir(a, b, c, d), async b => {
    b = await a.get(b);
    return [b.result, b.bytes];
  }, b => jr(a, b));
})();
async function ds(a) {
  if ((new URLSearchParams(window.location.search)).get("pack") !== "off") {
    var b = await fetch("pscript.pack?v=c48ea34b");
    console.log("[boot] wasm=f14d06c5", "pack=c48ea34b" + (b.ok ? "" : " (NAO CARREGOU)"), "app=2026-11-17 16:44");
    if (b.ok) {
      b = new Uint8Array(await b.arrayBuffer());
      var c = a.j(b.length);
      a.g.set(b, c);
      a.O(9, c, b.length, 0, 0);
      a.o(c);
    }
  }
}
async function es(a) {
  const b = oq;
  if (b && (b.profile === 2 || b.profile === 3)) {
    try {
      const d = await fetch("version.json", {cache:"no-store"});
      if (d.ok) {
        var c = await d.json();
        c.wasm === "f14d06c5" && c.pack === "c48ea34b" && c.app === "2026-11-17 16:44" || a.O(10, 0, 0, 0, 0);
      }
    } catch (d) {
    }
  }
}
;document.addEventListener("DOMContentLoaded", async function() {
  ka();
  Lq();
  const a = document.createElement("div");
  a.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f0f0f0;z-index:9999;cursor:wait;font-family:system-ui,sans-serif;color:#444";
  a.innerHTML = '<div style="font-size:clamp(28px,5vw,48px);font-weight:600">Ploft</div><div style="font-size:clamp(14px,2.5vw,20px);margin-top:12px;color:#888">Loading\u2026</div><div style="font-size:clamp(12px,2vw,16px);margin-top:8px;color:#aaa;min-height:1.2em"></div>';
  document.body.appendChild(a);
  const b = a.lastElementChild;
  await io();
  var c = qq();
  Gn ? console.error("[vfs] select depois da raiz aberta \u2014 ignorado:", c) : zn = String(c || "").toLowerCase();
  jq(c);
  yq(c);
  console.log("[io] escopo", c);
  c = await pq();
  await tq(c, m => {
    b.textContent = m;
  });
  b.textContent = "";
  try {
    await Rr();
  } catch (m) {
    console.warn("artifacts: migracao do store antigo falhou", m);
  }
  try {
    await Zr();
  } catch (m) {
    console.warn("desk_boot: falhou", m);
  }
  try {
    await Tr();
  } catch (m) {
    console.warn("artifacts: poda falhou", m);
  }
  let d = new ke();
  await fe(d);
  d.O(7, ja, 0, 0, 0);
  es(d);
  await ds(d);
  const e = () => {
    const m = oq;
    d.O(8, Xn, X ? X.role : 0, !m || m.profile !== 2 && m.profile !== 3 ? 0 : 1, (X && X.la ? X.uid : 0) || 1000);
  };
  e();
  Zn.push(() => e());
  var f = m => {
    const l = document.createElement("canvas");
    l.style.position = "fixed";
    l.style.top = "0";
    l.style.left = "0";
    l.style.height = "100vh";
    l.style.width = "100vw";
    l.style.zIndex = m;
    document.getElementById("dmain")?.appendChild(l);
    return l;
  };
  c = f("1");
  const g = f("2");
  g.style.pointerEvents = "none";
  f = f("3");
  f.style.pointerEvents = "none";
  Ve(d, c, f, g);
  Pe = () => {
    const m = navigator.userActivation;
    if (!m || !m.isActive) {
      return 0;
    }
    jl(il.yh, void 0, l => {
      l && d.O(6, 0, 0, 0, 0);
    });
    return 1;
  };
  a.remove();
  const h = d.D(), k = d.D();
  ck[1] = (m, l, p) => {
    fetch(l.url).then(r => r.text()).then(r => {
      p.K[h] = [r, l.w || 0, l.ja || 0];
      p.Fa(p.mg, 6, h, k);
      p.ka(7, 0, m.x, m.y, 1, performance.now());
    });
  };
  c.addEventListener("dragover", m => {
    const l = bk;
    l && ck[l.kind] && (d.ka(8, 0, m.offsetX - l.g, m.offsetY - l.h, l.kind, m.timeStamp) ? (m.preventDefault(), m.dataTransfer.dropEffect = "copy") : m.dataTransfer.dropEffect = "none");
  });
  c.addEventListener("drop", m => {
    const l = bk, p = l ? ck[l.kind] || null : null;
    l && p && (m.preventDefault(), p({x:m.offsetX - l.g, y:m.offsetY - l.h}, l.data, d));
  });
});
}).call(this);
