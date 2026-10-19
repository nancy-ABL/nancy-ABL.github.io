/* Nancy Abdelaal — portfolio interactions */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[(Math.random() * a.length) | 0];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
const M = 'media/';

/* ── content ─────────────────────────────────────────── */
// ar = width / height of the video
const P = 9 / 16, F = 4 / 5, W = 16 / 9;
const CLIENTS = [
  { id: 'bk', name: 'Burger King', tile: '#def6ee', items: [
    ['bk-whopper', 'Whopper', F], ['bk-reel', 'Reel', P], ['bk-maze', 'Maze', F],
    ['bk-99', 'Whopper for 99', F], ['bk-eid', 'Eid greeting', P], ['bk-post2', 'Iftar menu', P]] },
  { id: 'domty', name: 'Domty', tile: '#def6ee', items: [
    ['domty-anim', 'Toast animation', P], ['domty-1', 'Pool day', F], ['domty-candy', 'Candy crush', F], ['domty-story', 'Story', P]] },
  { id: 'larch', name: 'Larch', tile: '#320007', items: [
    ['larch-kv', 'Key visual', 2.15], ['larch-1', 'Post 1', P], ['larch-1b', 'Playground', P], ['larch-2', 'Post 2', P],
    ['larch-3', 'Croissant', P], ['larch-4', 'Summer', P], ['larch-11', 'Mini', P], ['larch-3b', 'Chocolate', P]] },
  { id: 'lindo', name: 'Lindo', tile: '#def6ee', items: [
    ['lindo-anim1', 'Animation 1', P], ['lindo-anim2', 'Animation 2', P], ['lindo-02', 'Laundry', P],
    ['lindo-dish', 'Dish wash', P], ['lindo-post2', 'Post 2', P]] },
  { id: 'brika', name: 'Brika', tile: '#def6ee', items: [
    ['brika-1', 'Post 1', P], ['brika-2', 'Post 2', P], ['brika-3', 'Post 3', P]] },
  { id: 'cotton', name: 'Egyptian Cotton', tile: '#def6ee', items: [
    ['cotton-1', 'Lasts longer', W]] },
];
const TYPO = [
  { k: 'typo-chopstix', t: 'Chopstix', bg: '#000' },
  { k: 'typo-fetar', t: 'Fetar 3nd Meen', bg: '#010002' },
  { k: 'typo-jazzeel', t: 'Jazzeel', bg: '#bdfee6', fit: 'contain' },
  { k: 'typo-larch', t: 'Larch', bg: '#3b0f71', fit: 'contain' },
  { k: 'typo-mylo', t: 'Mylo', bg: '#def6ee', fit: 'contain', img: true },
];
const VO = [
  { k: 'vo-kelloggs', t: "Kellogg's", d: 65 },
  { k: 'vo-cooks', t: "Cook's", d: 31 },
  { k: 'vo-bam', t: 'BAM!', d: 28 },
  { k: 'vo-atyab', t: 'Atyab', d: 28, tall: true },
  { k: 'vo-wholewheat', t: 'Domty Whole Wheat', d: 20, tall: true },
];
const EDITS = [
  { k: 'edit-promo', t: 'Promo — Vol. 02' },
  { k: 'edit-gov', t: 'Gov — Vol. 2' },
  { k: 'edit-test', t: 'Animation test' },
];

/* ── shared pointer ──────────────────────────────────── */
const ptr = { x: -9999, y: -9999, active: false, t: 0 };
const setPtr = (x, y) => { ptr.x = x; ptr.y = y; ptr.active = true; ptr.t = performance.now(); };
addEventListener('pointermove', e => setPtr(e.clientX, e.clientY), { passive: true });
addEventListener('pointerdown', e => setPtr(e.clientX, e.clientY), { passive: true });
addEventListener('touchmove', e => { const t = e.touches[0]; if (t) setPtr(t.clientX, t.clientY); }, { passive: true });
document.addEventListener('pointerleave', () => { ptr.active = false; ptr.x = ptr.y = -9999; });

// one frame loop for everything
const ticks = new Set();
let last = performance.now();
const loop = now => {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  ticks.forEach(f => f(dt, now));
  requestAnimationFrame(loop);
};
requestAnimationFrame(loop);

// run a tick only while its element is on screen
const whenVisible = (el, fn, margin = '100px') => {
  let on = false;
  new IntersectionObserver(([e]) => {
    on = e.isIntersecting;
    on ? ticks.add(fn) : ticks.delete(fn);
    fn.visible && fn.visible(on);
  }, { rootMargin: margin }).observe(el);
};

/* ── lightbox ────────────────────────────────────────── */
const lb = (() => {
  const dlg = $('[data-lb]'), vid = $('[data-lb-video]'), title = $('[data-lb-title]'), count = $('[data-lb-count]');
  let list = [], i = 0;
  const show = () => {
    const it = list[i];
    title.textContent = it.t;
    count.textContent = list.length > 1 ? `${i + 1} / ${list.length}` : '';
    $('[data-lb-prev]').hidden = $('[data-lb-next]').hidden = list.length < 2;
    if (it.img) { vid.removeAttribute('src'); vid.poster = M + it.k + '.png'; }
    else { vid.poster = M + it.k + '.jpg'; vid.src = M + it.k + '.mp4'; vid.play().catch(() => {}); }
  };
  const go = d => { i = (i + d + list.length) % list.length; show(); };
  $('[data-lb-prev]').onclick = () => go(-1);
  $('[data-lb-next]').onclick = () => go(1);
  $('[data-lb-close]').onclick = () => dlg.close();
  dlg.addEventListener('click', e => { if (e.target === dlg || e.target.classList.contains('lb-in')) dlg.close(); });
  dlg.addEventListener('close', () => { vid.pause(); vid.removeAttribute('src'); vid.load(); });
  dlg.addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); });
  return { open(l, at = 0) { list = l; i = at; dlg.showModal(); show(); } };
})();

/* ── NAME: letters shuffle fonts & shapes near the cursor ─ */
(() => {
  const name = $('.name');
  const FONTS = [
    ['"Bungee Shade"', 'normal', 400, 1], ['Monoton', 'normal', 400, .95], ['"Rubik Mono One"', 'normal', 400, .9],
    ['Shrikhand', 'normal', 400, 1], ['"Major Mono Display"', 'normal', 400, 1.05], ['"Climate Crisis"', 'normal', 400, .9],
    ['"Bodoni Moda"', 'italic', 900, 1.1], ['Syne', 'normal', 800, 1], ['"Bagel Fat One"', 'normal', 400, 1],
    ['"Rubik Puddles"', 'normal', 400, 1], ['Silkscreen', 'normal', 400, .9], ['Unbounded', 'normal', 900, .9],
    ['"Instrument Serif"', 'italic', 400, 1.25], ['"Rampart One"', 'normal', 400, 1], ['Fascinate', 'normal', 400, 1],
    ['Fraunces', 'italic', 200, 1.05],
  ];
  const INK = ['#def6ee', '#46ffc7', '#ffce1d'];
  const SHAPES = [
    c => `<circle cx="50" cy="50" r="48" fill="${c}"/>`,
    c => `<path d="M50 0l12 34 36-2-29 21 12 35-31-21-31 21 12-35L2 32l36 2z" fill="${c}"/>`,
    c => `<path d="M50 4l48 88H2z" fill="${c}"/>`,
    c => `<rect x="4" y="4" width="92" height="92" rx="30" fill="${c}"/>`,
    c => `<path d="M50 0c8 18 8 18 26 8-6 19-6 19 16 18-16 13-16 13 0 26-22-1-22-1-16 18-18-10-18-10-26 8-8-18-8-18-26-8 6-19 6-19-16-18 16-13 16-13 0-26 22 1 22 1 16-18 18 10 18 10 26-8z" fill="${c}"/>`,
    c => `<path d="M2 98V50a48 48 0 0 1 96 0v48z" fill="${c}"/>`,
    c => `<path d="M36 2h28v34h34v28H64v34H36V64H2V36h34z" fill="${c}"/>`,
    c => `<circle cx="50" cy="50" r="40" fill="none" stroke="${c}" stroke-width="16"/>`,
  ];
  const letters = [];
  $$('.name-line', name).forEach(line => {
    [...line.dataset.word].forEach(ch => {
      const s = document.createElement('span'); s.className = 'ch'; s.setAttribute('aria-hidden', 'true');
      const g = document.createElement('span'); g.className = 'g'; g.textContent = ch;
      s.appendChild(g); line.appendChild(s);
      letters.push({ s, g, ch, next: 0, dirty: false, settle: 0, hot: false });
    });
  });
  // lock each letter's width (in em) to its base glyph so the line never reflows
  const lock = () => letters.forEach(L => {
    const fs = parseFloat(getComputedStyle(name).fontSize);
    L.s.style.width = ''; L.s.style.width = (L.g.getBoundingClientRect().width / fs) + 'em';
  });
  const reset = L => {
    L.g.className = 'g'; L.g.textContent = L.ch; L.g.removeAttribute('style'); L.dirty = false;
  };
  const shuffle = L => {
    L.dirty = true;
    const g = L.g, r = Math.random();
    g.removeAttribute('style'); g.className = 'g';
    if (r < .14) {
      g.className = 'g shape';
      g.innerHTML = `<svg viewBox="0 0 100 100">${pick(SHAPES)(pick(INK))}</svg>`;
      g.style.transform = `rotate(${rand(-40, 40)}deg) scale(${rand(.8, 1.05)})`;
      return;
    }
    g.textContent = L.ch;
    const [f, st, w, sc] = pick(FONTS);
    g.style.fontFamily = f; g.style.fontStyle = st; g.style.fontWeight = w;
    g.style.fontVariationSettings = 'normal';
    const c = pick(INK);
    if (r < .30) { g.style.color = 'transparent'; g.style.webkitTextStroke = `.028em ${c}`; }
    else if (r < .40) { g.className = 'g chip'; }
    else g.style.color = c;
    g.style.transform = `rotate(${REDUCED ? 0 : rand(-12, 12)}deg) scale(${sc * rand(.88, 1.08)})`;
  };
  // sweep: a wave of shuffles that runs across the name, then settles
  const sweep = (gap = 55, n = 5) => letters.forEach((L, i) => {
    for (let k = 0; k < n; k++) setTimeout(() => shuffle(L), i * gap + k * 85);
    setTimeout(() => reset(L), i * gap + n * 85 + 120);
  });
  document.fonts.ready.then(() => {
    lock();
    if (!REDUCED) setTimeout(() => sweep(), 500);
  });
  addEventListener('resize', () => { letters.forEach(reset); lock(); });
  name.addEventListener('touchstart', () => sweep(30, 4), { passive: true });

  let idle = 0;
  const tick = (dt, now) => {
    const fs = parseFloat(getComputedStyle(name).fontSize);
    const R = fs * .85;
    let anyHot = false;
    for (const L of letters) {
      const b = L.s.getBoundingClientRect();
      const d = Math.hypot(ptr.x - (b.left + b.width / 2), ptr.y - (b.top + b.height / 2));
      const hot = d < R;
      if (hot) {
        anyHot = true;
        if (now > L.next) { shuffle(L); L.next = now + rand(70, 170) + (d / R) * 120; }
        L.settle = now + 260;
      } else if (L.dirty && now > L.settle) reset(L);
    }
    // nobody near for a while: a small sweep to show it is alive
    idle = anyHot ? 0 : idle + dt;
    if (!REDUCED && idle > 9) { idle = 0; sweep(45, 3); }
  };
  whenVisible(name, tick);
})();

/* ── hero reel: cycles a few reels ───────────────────── */
(() => {
  const v = $('.hero-reel video'); if (!v) return;
  const list = ['domty-anim', 'larch-1b', 'bk-reel', 'lindo-anim2', 'brika-2'];
  let i = 0;
  v.loop = false;
  const load = () => { v.poster = M + list[i] + '.jpg'; v.src = M + list[i] + '.mp4'; v.play().catch(() => {}); };
  v.addEventListener('ended', () => { i = (i + 1) % list.length; load(); });
  if (!REDUCED) load();
})();

/* ── INDEX BANDS: swell + thicken by cursor distance ─── */
(() => {
  const box = $('[data-bands]'); if (!box) return;
  const bands = $$('.band', box).map(el => ({ el, w: 300, g: 1 }));
  const tick = () => {
    const r = box.getBoundingClientRect();
    const touch = !FINE;
    // fine pointer: the cursor. touch: the middle of the screen while scrolling through
    const inside = ptr.active && ptr.x >= r.left && ptr.x <= r.right && ptr.y >= r.top && ptr.y <= r.bottom;
    const y = touch ? innerHeight * .5 : ptr.y;
    for (const b of bands) {
      const br = b.el.getBoundingClientRect();
      const base = r.height / bands.length;
      const d = Math.abs(y - (br.top + br.height / 2)) / base;
      const on = touch || inside;
      const p = on ? Math.pow(clamp(1 - d / 1.5), 1.6) : 0;
      b.w = lerp(b.w, 160 + p * 740, .14);
      b.g = lerp(b.g, 1 + p * 2.2, .12);
      b.el.style.setProperty('--w', b.w.toFixed(0));
      if (!touch) b.el.style.setProperty('--g', b.g.toFixed(3));
    }
  };
  whenVisible(box, tick);
})();

/* ── SECTION BANDS: the title thickens as you come near ─ */
$$('[data-band]').forEach(el => {
  let w = 200;
  const word = $('.sec-word', el);
  const tick = () => {
    const r = el.getBoundingClientRect();
    let p;
    if (FINE) {
      const dx = Math.max(r.left - ptr.x, 0, ptr.x - r.right), dy = Math.max(r.top - ptr.y, 0, ptr.y - r.bottom);
      p = ptr.active ? clamp(1 - Math.hypot(dx, dy) / 340) : 0;
      // inside the band: weight follows how close you are to the word
      if (p === 1) {
        const wr = word.getBoundingClientRect();
        const dw = Math.hypot(Math.max(wr.left - ptr.x, 0, ptr.x - wr.right), Math.max(wr.top - ptr.y, 0, ptr.y - wr.bottom));
        p = .55 + .45 * clamp(1 - dw / 260);
      }
    } else {
      p = clamp(1 - Math.abs(r.top + r.height / 2 - innerHeight * .4) / (innerHeight * .45));
    }
    w = lerp(w, 140 + p * 760, .12);
    el.style.setProperty('--w', w.toFixed(0));
  };
  whenVisible(el, tick);
});

/* ── SERVICES: stacked cards ─────────────────────────── */
(() => {
  const box = $('[data-stack]'); if (!box) return;
  const cards = $$('.card', box), n = cards.length, num = $('[data-stack-n]');
  let a = 0, timer = 0, hover = false, seen = false;
  const place = () => {
    cards.forEach((c, i) => {
      const k = (i - a + n) % n;
      const v = $('video', c);
      if (k === 0) {
        c.style.transform = 'translateX(0) scale(1) rotate(0)'; c.style.zIndex = 3; c.dataset.pos = 'front';
        c.removeAttribute('aria-hidden'); c.inert = false;
        if (seen) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); }
      } else {
        const s = k === 1 ? 1 : -1;
        c.style.transform = `translateX(${s * 62}%) scale(.8) rotate(${s * 5}deg)`; c.style.zIndex = k === 1 ? 2 : 1; c.dataset.pos = 'side';
        c.setAttribute('aria-hidden', 'true'); c.inert = true;
        v.pause();
      }
    });
    num.textContent = a + 1;
  };
  const go = d => { a = (a + d + n) % n; place(); restart(); };
  const restart = () => { clearInterval(timer); if (!REDUCED) timer = setInterval(() => { if (!hover && seen) go(1); }, 5200); };
  $('[data-stack-next]').onclick = () => go(1);
  $('[data-stack-prev]').onclick = () => go(-1);
  cards.forEach((c, i) => c.addEventListener('click', e => {
    if (e.target.closest('.card-go')) return;
    const k = (i - a + n) % n; if (k) go(k === 1 ? 1 : -1);
  }));
  box.addEventListener('pointerenter', () => hover = true);
  box.addEventListener('pointerleave', () => hover = false);
  // swipe
  let sx = null;
  box.addEventListener('pointerdown', e => sx = e.clientX);
  box.addEventListener('pointerup', e => { if (sx !== null && Math.abs(e.clientX - sx) > 50) go(e.clientX < sx ? 1 : -1); sx = null; });
  new IntersectionObserver(([e]) => {
    seen = e.isIntersecting;
    const v = $('video', cards[a]);
    if (seen) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause();
  }, { threshold: .3 }).observe(box);
  $('[data-playlist="edits"]').addEventListener('click', () => lb.open(EDITS, 0));
  place(); restart();
})();

/* ── SOCIAL: client rows, reactive logos, lens marquees ── */
(() => {
  const host = $('[data-clients]'); if (!host) return;
  CLIENTS.forEach((c, ci) => {
    const row = document.createElement('article');
    row.className = 'client';
    row.setAttribute('aria-label', c.name);
    const list = c.items.map(([k, t, ar]) => ({ k, t: `${c.name} — ${t}`, ar }));
    row.innerHTML = `
      <div class="client-id">
        <button class="logo" type="button" style="--tile:${c.tile}" aria-label="Watch ${c.name} work">
          <span class="logo-in"></span>
        </button>
        <div><h3 class="client-name">${c.name}</h3>
        <p class="client-count">${list.length} ${list.length === 1 ? 'piece' : 'reels & posts'}</p></div>
      </div>
      <div class="reel" data-cursor="drag"><div class="track base"></div><div class="track lens"></div><div class="lens-frame"></div></div>`;
    host.appendChild(row);
    $('.logo', row).addEventListener('click', () => lb.open(list, 0));
    logo($('.logo', row), M + 'logo/' + c.id + '.png');
    marquee($('.reel', row), list, ci % 2 ? 1 : -1);
  });

  // logo: sliced into strips that ripple, tilt and pop as the cursor comes near
  function logo(tile, src) {
    const inner = $('.logo-in', tile), N = 7, strips = [];
    const img = new Image();
    img.onload = () => {
      const ar = img.naturalWidth / img.naturalHeight;
      const fit = () => {
        const tw = tile.clientWidth * .72, th = tile.clientHeight * .62;
        const w = Math.min(tw, th * ar), h = w / ar;
        inner.style.width = w + 'px'; inner.style.height = h + 'px';
        strips.forEach((s, i) => { s.style.top = (i * h / N) + 'px'; s.style.height = (h / N + .6) + 'px'; s.firstChild.style.top = (-i * h / N) + 'px'; });
      };
      for (let i = 0; i < N; i++) {
        const s = document.createElement('span'); s.className = 'logo-sl';
        const im = document.createElement('img'); im.src = src; im.alt = ''; im.draggable = false;
        s.appendChild(im); inner.appendChild(s); strips.push(s);
      }
      fit(); addEventListener('resize', fit);
    };
    img.src = src;
    let p = 0, popped = false, rx = 0, ry = 0;
    const tick = (dt, now) => {
      const r = tile.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const d = Math.hypot(ptr.x - cx, ptr.y - cy);
      const target = ptr.active ? clamp(1 - d / (r.width * 1.25)) : 0;
      p = lerp(p, target, .1);
      if (p > .72 && !popped) { popped = true; tile.classList.remove('pop'); void tile.offsetWidth; tile.classList.add('pop'); }
      if (p < .3) popped = false;
      const nx = clamp((ptr.x - cx) / r.width, -1, 1), ny = clamp((ptr.y - cy) / r.height, -1, 1);
      rx = lerp(rx, ptr.active ? nx : 0, .1); ry = lerp(ry, ptr.active ? ny : 0, .1);
      const t = now / 1000;
      inner.style.transform = `rotateY(${rx * p * 22}deg) rotateX(${-ry * p * 22}deg) scale(${1 + p * .12})`;
      strips.forEach((s, i) => {
        const o = REDUCED ? 0 : Math.sin(t * 9 + i * 1.15) * p * 11;
        s.style.transform = `translateX(${o.toFixed(2)}px)`;
      });
    };
    if (FINE) whenVisible(tile, tick);
    else {
      // touch: ripple once when the row scrolls into view
      new IntersectionObserver(([e]) => { if (e.isIntersecting) { tile.classList.remove('pop'); void tile.offsetWidth; tile.classList.add('pop'); } }, { threshold: .8 }).observe(tile);
    }
  }

  // marquee: a dimmed base track, a full-colour "lens" track clipped to the frame in the middle
  function marquee(reel, list, dir) {
    const base = $('.track.base', reel), lens = $('.track.lens', reel), frame = $('.lens-frame', reel);
    let H = 0, Wc = 0, LW = 0, setW = 0, x = 0, speed = 1, vids = [], offs = [], gap = 14;
    const build = () => {
      H = reel.clientHeight; Wc = reel.clientWidth;
      LW = Math.round(H * P + 24);
      reel.style.setProperty('--lw', LW + 'px');
      lens.style.setProperty('--cut', ((Wc - LW) / 2 + 3) + 'px');
      // repeat the client's pieces until a set is wider than the reel
      let seq = [], w = 0;
      while (w < Wc + LW || seq.length < 2) { list.forEach(it => { seq.push(it); w += H * it.ar + gap; }); }
      setW = w;
      const html = (withVideo) => [...seq, ...seq].map((it, i) => {
        const wd = Math.round(H * it.ar);
        const ix = list.indexOf(it);
        return `<div class="it" style="width:${wd}px" data-i="${ix}">${withVideo
          ? `<video muted playsinline loop preload="none" poster="${M + it.k}.jpg" data-src="${M + it.k}.mp4"></video>`
          : `<img src="${M + it.k}.jpg" alt="${it.t}" loading="lazy" decoding="async">`}</div>`;
      }).join('');
      base.innerHTML = html(false); lens.innerHTML = html(true);
      vids = $$('video', lens); offs = [];
      let o = 0; $$('.it', lens).forEach(el => { const wd = parseFloat(el.style.width); offs.push([o, o + wd]); o += wd + gap; });
      x = dir < 0 ? 0 : -setW;
    };
    build();
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });

    // pointer: hover slows, drag scrubs, a click without drag opens the piece
    let hover = false, drag = null, moved = 0;
    reel.addEventListener('pointerenter', () => hover = true);
    reel.addEventListener('pointerleave', () => { hover = false; });
    reel.addEventListener('pointerdown', e => { drag = { x: e.clientX, x0: x }; moved = 0; reel.setPointerCapture(e.pointerId); reel.classList.add('drag'); });
    reel.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x; moved = Math.max(moved, Math.abs(dx)); x = drag.x0 + dx; });
    const end = e => {
      if (!drag) return;
      reel.classList.remove('drag');
      if (moved < 6) {
        // which piece is under the pointer?
        const rx = e.clientX - reel.getBoundingClientRect().left - x;
        let hit = -1;
        offs.forEach(([a, b], i) => { if (rx >= a && rx <= b) hit = i; });
        const el = hit >= 0 ? $$('.it', lens)[hit] : null;
        if (el) lb.open(list, +el.dataset.i);
      }
      drag = null;
    };
    reel.addEventListener('pointerup', end);
    reel.addEventListener('pointercancel', () => { drag = null; reel.classList.remove('drag'); });
    reel.addEventListener('keydown', e => { if (e.key === 'Enter') lb.open(list, 0); });
    reel.tabIndex = 0; reel.setAttribute('role', 'button'); reel.setAttribute('aria-label', 'Open the reels in the player');

    const playing = new Set();
    const tick = dt => {
      const target = drag ? 0 : REDUCED ? 0 : hover ? .22 : 1;
      speed = lerp(speed, target, .08);
      if (!drag) x += dir * 46 * speed * dt;
      // keep x inside one set width
      while (x <= -setW) x += setW;
      while (x > 0) x -= setW;
      const tf = `translate3d(${x.toFixed(2)}px,0,0)`;
      base.style.transform = lens.style.transform = tf;
      // play only the videos inside the lens
      const l0 = (Wc - LW) / 2 - x, l1 = l0 + LW;
      offs.forEach(([a, b], i) => {
        const v = vids[i], inLens = b > l0 && a < l1;
        if (inLens && !playing.has(v)) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); playing.add(v); }
        else if (!inLens && playing.has(v)) { v.pause(); playing.delete(v); }
      });
    };
    tick.visible = on => { if (!on) { playing.forEach(v => v.pause()); playing.clear(); } };
    whenVisible(reel, tick);
  }
})();

/* ── TYPO & LOGO: the ring ───────────────────────────── */
(() => {
  const stage = $('[data-ring]'), ring = $('[data-ring-inner]'), ul = $('[data-typo-list]');
  if (!stage) return;
  const items = [...TYPO, ...TYPO]; // ten panels around the ring
  const N = items.length, step = 360 / N;
  let R = 0, angle = 0, vel = 0, tilt = 0, target = null;
  const panels = items.map((it, i) => {
    const p = document.createElement('div');
    p.className = 'panel';
    p.style.setProperty('--pbg', it.bg); if (it.fit) p.style.setProperty('--fit', it.fit);
    p.innerHTML = (it.img
      ? `<img src="${M + it.k}.png" alt="${it.t}" loading="lazy">`
      : `<video muted playsinline loop preload="none" poster="${M + it.k}.jpg" data-src="${M + it.k}.mp4" aria-label="${it.t}"></video>`)
      + `<span class="panel-tag">${it.t}</span>`;
    p.dataset.i = i % TYPO.length;
    ring.appendChild(p);
    return p;
  });
  TYPO.forEach((it, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button">${it.t}</button>`;
    li.firstChild.onclick = () => { target = -i * step; lb.open(TYPO, i); };
    li.firstChild.onmouseenter = () => { target = -i * step; };
    ul.appendChild(li);
  });
  const size = () => {
    const pw = Math.round(clamp(innerWidth * .19, 150, 270));
    stage.style.setProperty('--pw', pw + 'px');
    R = Math.round(pw / 2 / Math.tan(Math.PI / N) + pw * .16);
    panels.forEach((p, i) => p.style.transform = `rotateY(${i * step}deg) translateZ(${R}px)`);
  };
  size(); addEventListener('resize', size);

  let drag = null, moved = 0;
  stage.addEventListener('pointerdown', e => { drag = { x: e.clientX, a: angle, t: performance.now() }; moved = 0; vel = 0; target = null; stage.setPointerCapture(e.pointerId); stage.classList.add('drag'); });
  stage.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x; moved = Math.max(moved, Math.abs(dx));
    const na = drag.a + dx * .35; vel = (na - angle) * 60; angle = na;
  });
  stage.addEventListener('pointerup', e => {
    stage.classList.remove('drag');
    if (drag && moved < 6) {
      stage.releasePointerCapture(e.pointerId);
      const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('.panel');
      if (el) lb.open(TYPO, +el.dataset.i);
    }
    drag = null;
  });
  stage.setAttribute('data-cursor', 'drag');

  const playing = new Set();
  const tick = dt => {
    if (target !== null) { angle = lerp(angle, target + Math.round((angle - target) / 360) * 360, .08); vel = 0; }
    else if (!drag) { vel = lerp(vel, REDUCED ? 0 : -9, .02); angle += vel * dt; }
    const r = stage.getBoundingClientRect();
    const ny = FINE && ptr.active ? clamp((ptr.y - (r.top + r.height / 2)) / r.height, -.5, .5) : 0;
    tilt = lerp(tilt, -6 - ny * 14, .06);
    ring.style.transform = `translateZ(${-R}px) rotateX(${tilt.toFixed(2)}deg) rotateY(${angle.toFixed(2)}deg)`;
    // play the panels that face us
    let best = null, bestA = 999;
    panels.forEach((p, i) => {
      let a = ((i * step + angle) % 360 + 540) % 360 - 180;
      const v = $('video', p);
      if (Math.abs(a) < bestA) { bestA = Math.abs(a); best = +p.dataset.i; }
      if (!v) return;
      const front = Math.abs(a) < 75;
      if (front && !playing.has(v)) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); playing.add(v); }
      else if (!front && playing.has(v)) { v.pause(); playing.delete(v); }
    });
    $$('button', ul).forEach((b, i) => b.classList.toggle('on', i === best));
  };
  tick.visible = on => { if (!on) { playing.forEach(v => v.pause()); playing.clear(); } };
  whenVisible(stage, tick);
  stage.addEventListener('pointerleave', () => { if (target !== null) setTimeout(() => target = null, 1600); });
})();

/* ── VOICE OVER: the slogan takes its weight from the voice ─ */
(() => {
  const sl = $('[data-slogan]'), list = $('[data-vo-list]'), frame = $('[data-vo-frame]');
  const vid = $('[data-vo-video]'), playBtn = $('[data-vo-play]'), tEl = $('[data-vo-title]'), timeEl = $('[data-vo-time]');
  if (!sl) return;
  // split slogan into words → letters
  const words = sl.textContent.trim().split(' ');
  sl.textContent = '';
  const L = [];
  words.forEach(w => {
    const wd = document.createElement('span'); wd.className = 'wd'; wd.setAttribute('aria-hidden', 'true');
    [...w].forEach(c => { const s = document.createElement('span'); s.className = 'lt'; s.textContent = c; wd.appendChild(s); L.push({ s, w: 200, y: 0 }); });
    sl.appendChild(wd);
  });
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  let cur = 0;
  VO.forEach((it, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button"><span class="t">${it.t}</span><span class="d">${fmt(it.d)}</span></button>`;
    li.firstChild.onclick = () => { select(i); play(); };
    list.appendChild(li);
  });
  const select = i => {
    cur = i; const it = VO[i];
    $$('button', list).forEach((b, k) => b.classList.toggle('on', k === i));
    frame.classList.toggle('tall', !!it.tall);
    vid.poster = M + it.k + '.jpg'; vid.src = M + it.k + '.mp4';
    tEl.textContent = it.t; timeEl.textContent = '0:00 / ' + fmt(it.d);
    frame.classList.remove('playing');
  };
  // audio analysis (same-origin only; opened from disk we fake an envelope instead)
  let ctx = null, an = null, data = null;
  const canAnalyse = location.protocol.startsWith('http');
  const play = () => {
    if (canAnalyse && !ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        const src = ctx.createMediaElementSource(vid);
        an = ctx.createAnalyser(); an.fftSize = 1024; an.smoothingTimeConstant = .6;
        src.connect(an); an.connect(ctx.destination);
        data = new Uint8Array(an.frequencyBinCount);
      } catch (e) { an = null; }
    }
    ctx && ctx.resume();
    vid.play().catch(() => {});
  };
  playBtn.onclick = play;
  vid.addEventListener('click', () => vid.paused ? play() : vid.pause());
  vid.addEventListener('play', () => frame.classList.add('playing'));
  vid.addEventListener('pause', () => frame.classList.remove('playing'));
  vid.addEventListener('timeupdate', () => timeEl.textContent = fmt(vid.currentTime) + ' / ' + fmt(VO[cur].d));
  vid.addEventListener('ended', () => { select((cur + 1) % VO.length); });
  vid.controls = false;
  select(0);

  let silent = 0;
  const tick = (dt, now) => {
    const live = !vid.paused && !vid.ended;
    let amps = null;
    if (live && an) {
      an.getByteFrequencyData(data);
      // voice lives roughly between 90 Hz and 4 kHz
      const hz = ctx.sampleRate / an.fftSize, lo = Math.max(1, Math.round(90 / hz)), hi = Math.round(4000 / hz);
      let sum = 0;
      amps = L.map((_, i) => {
        const a = Math.round(lo * Math.pow(hi / lo, i / L.length)), b = Math.max(a + 1, Math.round(lo * Math.pow(hi / lo, (i + 1) / L.length)));
        let s = 0; for (let k = a; k < b; k++) s += data[k]; s /= (b - a) * 255; sum += s; return clamp(s * 1.35);
      });
      // mix loudness with each letter's share, so the word gets a shape and not just a weight
      const mx = Math.max(...amps, .05);
      amps = amps.map(v => clamp(.35 * v + .65 * Math.pow(v / mx, 1.6)));
      silent = sum < .01 ? silent + 1 : 0;
      if (silent > 30) amps = null;
    }
    if (live && !amps) {
      // fallback envelope so the slogan still speaks
      const t = now / 1000;
      amps = L.map((_, i) => clamp(.25 + .4 * Math.sin(t * 7 + i * .7) * Math.sin(t * 2.3 + i * .21) + .25 * Math.sin(t * 13 + i * 1.9)));
    }
    L.forEach((l, i) => {
      let p;
      if (amps) p = amps[i];
      else if (FINE && ptr.active) {
        const b = l.s.getBoundingClientRect();
        p = .8 * clamp(1 - Math.hypot(ptr.x - (b.left + b.width / 2), ptr.y - (b.top + b.height / 2)) / 260);
      } else p = 0;
      l.w = lerp(l.w, 120 + p * 780, amps ? .35 : .12);
      l.y = lerp(l.y, amps && !REDUCED ? -p * 10 : 0, .3);
      l.s.style.setProperty('--w', l.w.toFixed(0));
      l.s.style.setProperty('--y', l.y.toFixed(1) + 'px');
      l.s.style.setProperty('--lc', p > .62 ? 'var(--mint)' : 'var(--ink)');
    });
  };
  whenVisible($('#voice'), tick);
  new IntersectionObserver(([e]) => { if (!e.isIntersecting) vid.pause(); }).observe(frame);
})();

/* ── cursor follower with labels ─────────────────────── */
(() => {
  if (!FINE) return;
  const c = $('.cursor'), label = $('span', c);
  let x = innerWidth / 2, y = innerHeight / 2;
  ticks.add(() => {
    x = lerp(x, ptr.x, .22); y = lerp(y, ptr.y, .22);
    c.style.transform = `translate3d(${x}px,${y}px,0)`;
    c.style.opacity = ptr.active ? 1 : 0;
  });
  document.addEventListener('pointerover', e => {
    const t = e.target.closest('[data-cursor]');
    c.classList.toggle('big', !!t);
    if (t) label.textContent = t.dataset.cursor;
  });
})();

/* ── entrances, nav state, clock ─────────────────────── */
(() => {
  const groups = ['.hero-foot > *', '.services-head > *', '.client-id', '.sec-note', '.slogan', '.vo-list li', '.vo-stage', '.contact > *', '.typo-list'];
  groups.forEach(sel => $$(sel).forEach((el, i) => { el.classList.add('rise'); el.style.setProperty('--d', (i % 6) * 75 + 'ms'); }));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.rise').forEach(el => io.observe(el));

  const links = $$('.top-nav a');
  const nio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['social', 'typo', 'voice', 'contact'].forEach(id => nio.observe(document.getElementById(id)));

  const clock = $('[data-clock]');
  const tickClock = () => {
    try {
      const t = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Cairo' }).format(new Date());
      clock.textContent = `it’s ${t} here`;
    } catch (e) {}
  };
  tickClock(); setInterval(tickClock, 30000);
  $('[data-year]').textContent = new Date().getFullYear();
})();
})();
