const {
  Cam, circ, clamp, facing, fillet, fit, lerp, poly, proj, seg, rings, rrect, prism, unproj,
  tween, tset, tval, tdone, mk, solid, put, flatDot, place, pointer, register, disposer,
} = HL;

const H = 4, TOP = 1, LIFT = 12, FIX_LIFT = 5, STEP = 3;
const R = { 11: 4.2, 9: 3.9, 6: 3.4 };
const T = (pax, pts) => pts.map(([x, y]) => ({ x, y, R: R[pax], pax, name: pax + " pax" }));
const TABLES = [
  ...T(6, [[10, 44.5], [10, 58], [10, 72.5]]),
  ...T(11, [[37, 27], [35.5, 42], [35, 55.5], [34, 71.5], [59, 55.5], [74.5, 55.5], [59, 70], [74, 69.5]]),
  ...T(11, [[130, 42], [130, 54.5], [130, 67], [149, 39], [149, 50], [149, 61.5], [149, 71.5], [166, 23.5], [171, 35.5], [172, 48], [172, 59], [172, 71.5]]),
  ...T(9, [[190, 30.5], [190, 43], [190.5, 55.5], [191, 66]]),
];
const BRIDAL = { x: 67, y: 42, w: 16, h: 10, pax: 2, name: "bridal" };
const BERKAT = [{ x: 9.5, y: 90.5, w: 5, h: 9, pax: 0, name: "berkat" }, { x: 192, y: 80, w: 5, h: 8, pax: 0, name: "berkat" }];
const FIXTURES = [
  { name: "pelamin", x: 98, y: 24.5, k: 0, hit: [52, 3, 132, 32], dots: [], drums: [[124, 27, 2.2, 2.5, 5], [124, 27, 1.4, 5, 7]],
    boxes: [[64, 17, 132, 32, 0, 2.5, 1.5, 1], [80, 17.5, 116, 19.5, 2.5, 16, 0.8, 0.6], [92, 21, 104, 25, 2.5, 5.5, 1, 0.6]] },
  { name: "beverage", x: 65, y: 112, hit: [57, 110, 73, 114], boxes: [[57, 110, 73, 114, 0, 4]], drums: [], dots: [[[61, 112], [65, 112], [69, 112]], 4, 0.9] },
  { name: "buffet", x: 98, y: 111.5, hit: [92, 109, 104, 114], boxes: [[92, 109, 104, 114, 0, 4]], drums: [], dots: [[[95.5, 111.5], [100.5, 111.5]], 4, 1.3] },
  { name: "dessert", x: 137.5, y: 112, hit: [125, 110, 150, 114], boxes: [[125, 110, 150, 114, 0, 4]], drums: [], dots: [[[129, 112], [134, 112], [139, 112], [144, 112]], 4, 0.9] },
];
const ITEMS = [...TABLES, BRIDAL, ...BERKAT, ...FIXTURES];
const DOORS = [
  { k: 30 + 99, hinges: [[30, 99, 0.6, -0.8], [46, 99, -0.6, -0.8]], leaf: 7, flow: [38, 96, 0, -1] },
  { k: 201 + 91, hinges: [[201, 86, -0.8, 0.6], [201, 96, -0.8, -0.6]], leaf: 4.5, flow: [198, 91, -1, 0] },
];
const FLOOR = [[0, 33], [27, 33], [27, 15], [178, 15], [178, 23], [201, 23], [201, 99], [158, 99], [158, 117], [50, 117], [50, 99], [0, 99]];
const at = (ring, cx, cy) => ring.map((q) => ({ ...q, u: q.u + cx, v: q.v + cy }));
const turn = (ring, hx, hy, dx, dy) => ring.map((q) => ({
  ...q, u: hx + q.u * dx - q.v * dy, v: hy + q.u * dy + q.v * dx, nu: q.nu * dx - q.nv * dy, nv: q.nu * dy + q.nv * dx,
}));
function floor(P, g, pts, z0, z1) {
  const n = pts.length, at = (z) => (p) => P(p[0], p[1], z), k = (p) => p[0] - p[1];
  const edges = pts.map((a, i) => [a, pts[(i + 1) % n]]), faces = ([a, b]) => b[1] - a[1] + a[0] - b[0] > 0;
  const segs = (list, z) => list.map(([a, b]) => seg(at(z)(a), at(z)(b))).join("");
  const fr = edges.filter(faces), bk = edges.filter((e) => !faces(e));
  const ends = [pts.reduce((m, p) => (k(p) < k(m) ? p : m)), pts.reduce((m, p) => (k(p) > k(m) ? p : m))];
  for (const [a, b] of fr) mk("path", { d: poly([at(z0)(a), at(z0)(b), at(z1)(b), at(z1)(a)]), class: "fo" }, g);
  mk("path", { d: segs(fr, z0) + ends.map((p) => seg(at(z0)(p), at(z1)(p))).join(""), class: "nf sil" }, g);
  mk("path", { d: poly(pts.map(at(z1))), class: "fo" }, g);
  mk("path", { d: segs(fr, z1), class: "nf lo" }, g);
  mk("path", { d: segs(bk, z1), class: "nf sil" }, g);
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[0, 15, -3], [201, 23, -3], [0, 99, -3], [201, 99, -3], [80, 17.5, 16 + FIX_LIFT], [27, 15, H + LIFT], [202, 96, 11], [46, 100, 11], [50, 117, -3], [158, 117, -3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 1.2, b = 0.8) => {
    const [o, i] = rings(x0, y0, x1, y1, r, b), s = solid(g);
    put(s, prism(P, front, o, i, z0, z1));
    return s;
  };
  const dots = (pts, z, r, cls) => pts.forEach(([x, y]) => place(flatDot(g, C, r, cls), P(x, y, z)));
  floor(P, g, fillet(FLOOR, FLOOR.map(() => 2.5)), -3, 0);
  box(90, 35, 106, 82, 0, 0.4, 1, 0.5);
  for (const { flow: [x, y, dx, dy] } of DOORS) {
    const arrow = [[0, -0.9], [11, -0.9], [11, -3], [16, 0], [11, 3], [11, 0.9], [0, 0.9]];
    const pts = fillet(arrow, arrow.map(() => 0.5)).map(([a, b]) => P(x + a * dx - b * dy, y + a * dy + b * dx, 0));
    mk("path", { d: poly(pts), class: "nf sil" }, g);
  }
  const statics = [
    { k: 137 + 26, draw: () => { box(137, 26, 153, 33, 0, 5); dots([[142, 29.5], [148, 29.5]], 5, 1.6, "dot off"); } },
    ...DOORS.map(({ k, hinges: [a, b], leaf }) => ({ k, draw: () => {
      for (const [hx, hy, dx, dy] of [a, b]) put(solid(g), prism(P, front, turn(rrect(0, -0.3, leaf, 0.3, 0.3, 3), hx, hy, dx, dy), turn(rrect(0.15, -0.15, leaf - 0.15, 0.15, 0.15, 3), hx, hy, dx, dy), 0, 9));
      const x0 = Math.min(a[0], b[0]), x1 = Math.max(a[0], b[0]), y0 = Math.min(a[1], b[1]), y1 = Math.max(a[1], b[1]);
      for (const [hx, hy] of [a, b]) box(hx - 0.6, hy - 0.6, hx + 0.6, hy + 0.6, 0, 10, 0.4, 0.25);
      box(x0 - 0.6, y0 - 0.6, x1 + 0.6, y1 + 0.6, 10, 11, 0.4, 0.25);
    } })),
  ];
  const order = [...statics.map((s) => ({ k: s.k, s })), ...ITEMS.map((it) => ({ k: it.k ?? it.x + it.y, it }))].sort((a, b) => a.k - b.k);
  for (const o of order) {
    if (o.s) { o.s.draw(); continue; }
    const it = o.it;
    if (it.boxes) {
      it.parts = [
        ...it.boxes.map(([x0, y0, x1, y1, z0, z1, r = 1.2, b = 0.8]) => [...rings(x0, y0, x1, y1, r, b), z0, z1]),
        ...it.drums.map(([cx, cy, r, z0, z1]) => [at(circ(r, 16), cx, cy), at(circ(r - 0.5, 16), cx, cy), z0, z1]),
      ].map((q) => [...q, solid(g)]);
      it.dishes = it.dots.length ? it.dots[0].map(([x, y]) => [x, y, flatDot(g, C, it.dots[2], "dot m")]) : [];
      it.seats = [];
      it.lift = tween(0); it.out = tween(0); it.last = [NaN, NaN];
      continue;
    }
    const grp = mk("g", {}, g), far = mk("g", {}, grp);
    it.base = solid(grp); it.top = solid(grp);
    const nearG = mk("g", {}, grp);
    if (it.R) {
      it.ring = at(circ(it.R, 16), it.x, it.y); it.inner = at(circ(it.R - 0.8, 16), it.x, it.y);
      it.bring = at(circ(1.1, 12), it.x, it.y); it.binner = at(circ(0.6, 12), it.x, it.y);
      it.seats = Array.from({ length: it.pax }, (_, i) => {
        const a = (2 * Math.PI * i) / it.pax + 0.3, c = Math.cos(a), s = Math.sin(a);
        return { c, s, el: flatDot(c + s > 0 ? nearG : far, C, 0.9, "dot off") };
      });
    } else {
      const x0 = it.x - it.w / 2, y0 = it.y - it.h / 2, x1 = it.x + it.w / 2, y1 = it.y + it.h / 2, m = Math.min(it.w, it.h) / 2 - 1;
      [it.ring, it.inner] = rings(x0, y0, x1, y1, 1.2, 0.8);
      [it.bring, it.binner] = rings(x0 + m, y0 + m * 0.6, x1 - m, y1 - m * 0.6, 0.8, 0.5);
      it.seats = [-3, 3].slice(0, it.pax).map((dx) => ({ dx, el: flatDot(far, C, 0.9, "dot off") }));
    }
    it.lift = tween(0); it.out = tween(0); it.last = [NaN, NaN];
  }
  function draw(it, lift, out) {
    if (lift === it.last[0] && out === it.last[1]) return;
    it.last = [lift, out];
    if (it.parts) {
      for (const [o, i, z0, z1, s] of it.parts) put(s, prism(P, front, o, i, z0 + lift, z1 + lift));
      for (const [x, y, el] of it.dishes) place(el, P(x, y, it.dots[1] + lift));
      return;
    }
    put(it.top, prism(P, front, it.ring, it.inner, H - TOP + lift, H + lift));
    put(it.base, prism(P, front, it.bring, it.binner, 0, H - TOP + lift));
    for (const s of it.seats) {
      if (it.R) { const r = lerp(it.R - 0.6, it.R + 3.4, out); place(s.el, P(it.x + s.c * r, it.y + s.s * r, 0)); }
      else place(s.el, P(it.x + s.dx, it.y - it.h / 2 - lerp(-1.5, 2.4, out), 0));
    }
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of ITEMS) {
      draw(it, tval(it.lift, now), tval(it.out, now));
      if (!tdone(it.lift, now) || !tdone(it.out, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);
  const box2 = ([x0, y0, x1, y1], x, y) => Math.hypot(Math.max(x0 - x, 0, x - x1), Math.max(y0 - y, 0, y - y1));
  const gap = (it, [x, y]) => (it.R
    ? Math.hypot(x - it.x, y - it.y) - it.R
    : it.hit ? box2(it.hit, x, y)
    : box2([it.x - it.w / 2, it.y - it.h / 2, it.x + it.w / 2, it.y + it.h / 2], x, y));
  function hit(p) {
    const w = unproj(C, p[0], p[1], H);
    let best = null, d = 3.5;
    for (const it of ITEMS) { const e = gap(it, w); if (e < d) { d = e; best = it; } }
    return best;
  }

  let act = null;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a || act;
    act = a;
    for (const it of ITEMS) {
      const d = Math.hypot(it.x - from.x, it.y - from.y), delay = d * STEP, on = it === a;
      const fall = reach > 0 && a && !it.parts ? clamp(1 - d / reach, 0, 1) : 0;
      tset(it.lift, on ? (it.parts ? FIX_LIFT : LIFT) : LIFT * 0.5 * fall, now, delay);
      tset(it.out, on ? 1 : 0, now, delay);
      if (it.parts) it.parts.forEach((q) => q[4].sil.classList.toggle("hi", on));
      else it.top.sil.classList.toggle("hi", on);
      it.seats.forEach((s) => s.el.setAttribute("class", "dot " + (on ? "m" : "off")));
    }
    read.textContent = a ? a.name : "";
    B.wake();
  }
  read.textContent = "";

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { reach = v; },
    destroy: bag.dispose,
  };
}

hairline({
  name: "seating",
  means: "A wedding hall from its door: what is under the pointer lifts; a table pulls out its chairs and its neighbours rise a little.",
  rules: [1, 2, 3, 5],
  range: [0, 30, 56],
  tour: [[238, 144], [267, 185], [140, 191], null],
  mount,
});
