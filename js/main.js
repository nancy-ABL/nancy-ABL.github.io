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
const LOGO_V = '4'; // bump when the logo sprites change, so browsers fetch the new ones
// motion on/off: starts off for reduced-motion users, remembered per visitor
let PAUSED = REDUCED;
try { const s = localStorage.getItem('nancy-motion'); if (s) PAUSED = s === 'off'; } catch (e) {}
const motionSubs = new Set();
const setPaused = v => {
  PAUSED = v;
  try { localStorage.setItem('nancy-motion', v ? 'off' : 'on'); } catch (e) {}
  document.documentElement.classList.toggle('still', v);
  motionSubs.forEach(f => f(v));
};
document.documentElement.classList.toggle('still', PAUSED);

/* ── content ─────────────────────────────────────────── */
// ar = width / height of the video
const P = 9 / 16, F = 4 / 5;
// anim: the brand's animated logo as a sprite sheet (media/logo/<id>-anim.webp); fit 'cover' fills the tile
const CLIENTS = [
  { id: 'raha', name: 'Raha', sub: 'KSA', tile: '#ffffff', anim: true, items: [
    ['raha-home', 'Home management', P], ['raha-pink', 'Pink October', 16 / 9], ['raha-late', 'Late shift', .75],
    ['raha-school', 'Back to school', P], ['raha-reel6', 'Reel 6', F], ['raha-1', 'Invest', .789], ['raha-post0', 'Post', P],
    ['raha-tiktok', 'TikTok', P], ['raha-cook', 'Cook & fridge', P], ['raha-2', 'Post 2', .566], ['raha-tt', 'TikTok 2', P]] },
  { id: 'ph', name: 'Pizza Hut', sub: 'KSA', tile: '#ffffff', anim: true, items: [
    ['ph-day', 'Animation day', P], ['ph-4', 'Rerouting', P], ['ph-anim7', 'Made with love', P], ['ph-12', '30% off', P],
    ['ph-mybox', 'My box', F], ['ph-17', 'Saudi vs Morocco', P], ['ph-5', 'Half & half', P], ['ph-anim2', '30% in the app', F],
    ['ph-p13', 'Notifications', P], ['ph-4x4', '4×4 deal', .566], ['ph-2', 'Personality', P], ['ph-jump', 'Jump game', .789],
    ['ph-26', 'The body', P], ['ph-post7', 'Varieties', P], ['ph-ksa-iraq', 'Saudi vs Iraq', P]] },
  { id: 'bk', name: 'Burger King', tile: '#ffffff', anim: true, items: [
    ['bk-whopper', 'Whopper', F], ['bk-reel', 'Reel', P], ['bk-maze', 'Maze', F],
    ['bk-99', 'Whopper for 99', F], ['bk-eid', 'Eid greeting', P], ['bk-post2', 'Iftar menu', P]] },
  { id: 'domty', name: 'Domty', tile: '#ffffff', anim: true, items: [
    ['domty-anim', 'Toast animation', P], ['domty-1', 'Pool day', F], ['domty-candy', 'Candy crush', F], ['domty-story', 'Story', P]] },
  { id: 'larch', name: 'Larch', tile: '#3d2a73', anim: true, fit: 'cover', items: [
    ['larch-kv', 'Key visual', 2.15], ['larch-1', 'Post 1', P], ['larch-1b', 'Playground', P], ['larch-2', 'Post 2', P],
    ['larch-3', 'Croissant', P], ['larch-4', 'Summer', P], ['larch-11', 'Mini', P], ['larch-3b', 'Chocolate', P]] },
  { id: 'lindo', name: 'Lindo', tile: '#ffffff', anim: true, items: [
    ['lindo-anim1', 'Animation 1', P], ['lindo-anim2', 'Animation 2', P], ['lindo-02', 'Laundry', P],
    ['lindo-dish', 'Dish wash', P], ['lindo-post2', 'Post 2', P]] },
  { id: 'brika', name: 'Brika', tile: '#ffffff', items: [
    ['brika-1', 'Post 1', P], ['brika-2', 'Post 2', P], ['brika-3', 'Post 3', P]] },
];
const TYPO = [
  { k: 'typo-chopstix', t: 'Chopstix', bg: '#000' },
  { k: 'typo-fetar', t: 'Fetar 3nd Meen', bg: '#010002' },
  { k: 'typo-jazzeel', t: 'Jazzeel', bg: '#bdfee6', fit: 'contain' },
  { k: 'typo-larch', t: 'Larch', bg: '#3b0f71', fit: 'contain' },
  { k: 'typo-mylo', t: 'Mylo', bg: '#def6ee', fit: 'contain', img: true },
];
const VO = [
  { k: 'vo-kidzania', t: 'KidZania Cairo', d: 18 },
  { k: 'vo-wholewheat', t: 'Domty Whole Wheat', d: 20, tall: true },
  { k: 'vo-kelloggs', t: 'Kellogg’s', d: 65 },
  { k: 'vo-cooks', t: 'Cook’s', d: 31 },
  { k: 'vo-atyab', t: 'Atyab', d: 28, tall: true },
];
const EDITS = [
  { k: 'edit-handmaid', t: 'The Handmaid’s Tale — unofficial promo', d: 45 },
  { k: 'edit-exxon', t: 'ExxonMobil', d: 147 },
  { k: 'edit-saudi2030', t: 'Saudi 2030', d: 58, tall: true },
  { k: 'edit-cotton', t: 'Cotton Association', d: 26 },
  { k: 'edit-rawaq', t: 'Rawaq App', d: 15 },
  { k: 'vo-bam', t: 'BAM!', d: 28 },
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
  ticks.forEach(f => f.read && f.read());
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

/* ── letters that react (slogans) ─────────────────────── */
const splitLetters = (el, w0) => {
  const text = el.textContent.trim();
  el.textContent = '';
  const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = text;
  el.appendChild(sr);
  const L = [];
  text.split(' ').forEach(w => {
    const wd = document.createElement('span'); wd.className = 'wd'; wd.setAttribute('aria-hidden', 'true');
    [...w].forEach(c => { const s = document.createElement('span'); s.className = 'lt'; s.textContent = c; wd.appendChild(s); L.push({ s, w: w0, y: 0, sw: -1, sy: -1, sc: '', r: null }); });
    el.appendChild(wd);
  });
  return L;
};
// measure letters only when the cursor is close enough to matter
const readLetters = (el, L, reach) => {
  const b = el.getBoundingClientRect();
  const near = FINE && ptr.active && ptr.y > b.top - reach && ptr.y < b.bottom + reach;
  L.forEach(l => l.r = near ? l.s.getBoundingClientRect() : null);
};
const nearness = (l, reach) => l.r ? clamp(1 - Math.hypot(ptr.x - (l.r.left + l.r.width / 2), ptr.y - (l.r.top + l.r.height / 2)) / reach) : 0;
const writeLetter = (l, colour) => {
  if (Math.abs(l.w - l.sw) >= 1) { l.sw = l.w; l.s.style.setProperty('--w', l.w.toFixed(0)); }
  if (Math.abs(l.y - l.sy) >= .2) { l.sy = l.y; l.s.style.setProperty('--y', l.y.toFixed(1) + 'px'); }
  if (colour !== l.sc) { l.sc = colour; l.s.style.setProperty('--lc', colour); }
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
  let sx = null;
  dlg.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  dlg.addEventListener('touchend', e => { if (sx !== null && list.length > 1) { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1); } sx = null; });
  return { open(l, at = 0) { list = l; i = at; dlg.showModal(); show(); } };
})();

/* ── SHUFFLE: letters swap fonts & shapes near the cursor (the name, the contact line) ─ */
const SHUFFLE_FONTS = [
  ['"Bungee Shade"', 'normal', 400, 1], ['Monoton', 'normal', 400, .95], ['"Rubik Mono One"', 'normal', 400, .9],
  ['Shrikhand', 'normal', 400, 1], ['"Major Mono Display"', 'normal', 400, 1.05], ['"Climate Crisis"', 'normal', 400, .9],
  ['"Bodoni Moda"', 'italic', 900, 1.1], ['Syne', 'normal', 800, 1], ['"Bagel Fat One"', 'normal', 400, 1],
  ['"Rubik Puddles"', 'normal', 400, 1], ['Silkscreen', 'normal', 400, .9], ['Unbounded', 'normal', 900, .9],
  ['"Instrument Serif"', 'italic', 400, 1.25], ['"Rampart One"', 'normal', 400, 1], ['Fascinate', 'normal', 400, 1],
  ['Fraunces', 'italic', 200, 1.05],
];
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
// root: the heading. groups: elements whose data-word gets split into letters. inks: colours that read on this ground
const shuffleText = (root, groups, inks) => {
  const letters = [];
  groups.forEach(gr => {
    [...gr.dataset.word].forEach(ch => {
      if (ch === ' ') { gr.appendChild(document.createTextNode(' ')); return; }
      const s = document.createElement('span'); s.className = 'ch';
      const g = document.createElement('span'); g.className = 'g'; g.textContent = ch;
      s.appendChild(g); gr.appendChild(s);
      letters.push({ s, g, ch, next: 0, dirty: false, settle: 0, r: null });
    });
  });
  let fs = 100;
  // lock each letter's width (in em) to its base glyph so the line never reflows
  const lock = () => {
    fs = parseFloat(getComputedStyle(root).fontSize);
    letters.forEach(L => { L.s.style.width = ''; });
    const ws = letters.map(L => L.g.getBoundingClientRect().width);
    letters.forEach((L, i) => { L.s.style.width = (ws[i] / fs) + 'em'; });
  };
  const reset = L => { L.g.className = 'g'; L.g.textContent = L.ch; L.g.removeAttribute('style'); L.dirty = false; };
  const shuffle = L => {
    L.dirty = true;
    const g = L.g, r = Math.random();
    g.removeAttribute('style'); g.className = 'g';
    if (r < .14) {
      g.className = 'g shape';
      g.innerHTML = `<svg viewBox="0 0 100 100">${pick(SHAPES)(pick(inks))}</svg>`;
      g.style.transform = `rotate(${rand(-40, 40)}deg) scale(${rand(.8, 1.05)})`;
      return;
    }
    g.textContent = L.ch;
    const [f, st, w, sc] = pick(SHUFFLE_FONTS);
    g.style.fontFamily = f; g.style.fontStyle = st; g.style.fontWeight = w;
    g.style.fontVariationSettings = 'normal';
    const c = pick(inks);
    if (r < .30) { g.style.color = 'transparent'; g.style.webkitTextStroke = `.028em ${c}`; }
    else if (r < .40) { g.className = 'g chip'; }
    else g.style.color = c;
    g.style.transform = `rotate(${REDUCED ? 0 : rand(-12, 12)}deg) scale(${sc * rand(.88, 1.08)})`;
  };
  // sweep: a wave of shuffles that runs across the letters, then settles
  const sweep = (gap = 55, n = 5) => letters.forEach((L, i) => {
    for (let k = 0; k < n; k++) setTimeout(() => shuffle(L), i * gap + k * 85);
    setTimeout(() => reset(L), i * gap + n * 85 + 120);
  });
  document.fonts.ready.then(lock);
  addEventListener('resize', () => { letters.forEach(reset); lock(); });
  root.addEventListener('touchstart', () => sweep(30, 4), { passive: true });

  let idle = 0;
  const tick = (dt, now) => {
    const R = fs * .85;
    let anyHot = false;
    for (const L of letters) {
      const b = L.r;
      const d = b ? Math.hypot(ptr.x - (b.left + b.width / 2), ptr.y - (b.top + b.height / 2)) : 1e9;
      if (d < R) {
        anyHot = true;
        if (now > L.next) { shuffle(L); L.next = now + rand(70, 170) + (d / R) * 120; }
        L.settle = now + 260;
      } else if (L.dirty && now > L.settle) reset(L);
    }
    // nobody near for a while: a small sweep to show it is alive
    idle = anyHot ? 0 : idle + dt;
    if (!PAUSED && idle > 9) { idle = 0; sweep(45, 3); }
  };
  // read phase: only measure the letters when the pointer is near
  tick.read = () => {
    const box = root.getBoundingClientRect();
    const near = ptr.active && ptr.y > box.top - fs && ptr.y < box.bottom + fs;
    letters.forEach(L => L.r = near ? L.s.getBoundingClientRect() : null);
  };
  whenVisible(root, tick);
  return { sweep };
};

(() => {
  const name = $('.name');
  const s = shuffleText(name, $$('.name-line', name), ['#0a0a0a', '#ff6b1b', '#81b7fb']);
  document.fonts.ready.then(() => { if (!PAUSED) setTimeout(() => s.sweep(), 500); });
  const contact = $('[data-shuffle]');
  if (contact) {
    const words = contact.dataset.word.split(' ');
    contact.dataset.word = '';
    const groups = words.map(w => { const sp = document.createElement('span'); sp.className = 'sh-word'; sp.setAttribute('aria-hidden', 'true'); sp.dataset.word = w; contact.appendChild(sp); contact.appendChild(document.createTextNode(' ')); return sp; });
    // on the ink ground: bright inks
    const cs = shuffleText(contact, groups, ['#fedb08', '#ff6b1b', '#81b7fb']);
    let done = false;
    new IntersectionObserver(([e]) => { if (e.isIntersecting && !done && !PAUSED) { done = true; setTimeout(() => cs.sweep(40, 4), 300); } }, { threshold: .6 }).observe(contact);
  }
})();

/* ── INDEX BANDS: swell + thicken by cursor distance ─── */
(() => {
  const box = $('[data-bands]'); if (!box) return;
  const bands = $$('.band', box).map(el => ({ el, word: $('.band-word', el), w: 300, g: 1, sw: 0, sg: 0, c: 0 }));
  const touch = !FINE;
  let r = null;
  const tick = () => {
    // fine pointer: the cursor. touch: the middle of the screen while scrolling through
    const inside = ptr.active && ptr.x >= r.left && ptr.x <= r.right && ptr.y >= r.top && ptr.y <= r.bottom;
    const y = touch ? innerHeight * .5 : ptr.y;
    const base = r.height / bands.length;
    for (const b of bands) {
      const d = Math.abs(y - b.c) / base;
      const p = touch || inside ? Math.pow(clamp(1 - d / 1.5), 1.6) : 0;
      b.w = lerp(b.w, 160 + p * 740, .14);
      b.g = lerp(b.g, 1 + p * 3, .12);
      // write only what changed
      if (Math.abs(b.w - b.sw) >= 1) { b.sw = b.w; b.word.style.setProperty('--w', b.w.toFixed(0)); }
      if (!touch && Math.abs(b.g - b.sg) >= .004) { b.sg = b.g; b.el.style.flexGrow = b.g.toFixed(3); }
    }
  };
  tick.read = () => {
    r = box.getBoundingClientRect();
    bands.forEach(b => { b.c = r.top + b.el.offsetTop + b.el.offsetHeight / 2; });
  };
  whenVisible(box, tick);
})();

/* ── SECTION BANDS: the title thickens as you come near ─ */
$$('[data-band]').forEach(el => {
  let w = 200, sw = 0, o = 0, so = -1, r = null, wr = null;
  const word = $('.sec-word', el);
  const tick = () => {
    let p;
    if (FINE) {
      const dx = Math.max(r.left - ptr.x, 0, ptr.x - r.right), dy = Math.max(r.top - ptr.y, 0, ptr.y - r.bottom);
      p = ptr.active ? clamp(1 - Math.hypot(dx, dy) / 340) : 0;
      // inside the band: weight follows how close you are to the word
      if (p === 1) {
        const dw = Math.hypot(Math.max(wr.left - ptr.x, 0, ptr.x - wr.right), Math.max(wr.top - ptr.y, 0, ptr.y - wr.bottom));
        p = .55 + .45 * clamp(1 - dw / 260);
      }
    } else {
      p = clamp(1 - Math.abs(r.top + r.height / 2 - innerHeight * .4) / (innerHeight * .45));
    }
    w = lerp(w, 140 + p * 760, .12);
    o = lerp(o, p, .1);
    if (Math.abs(w - sw) >= 1) { sw = w; word.style.setProperty('--w', w.toFixed(0)); }
    if (Math.abs(o - so) >= .003) { so = o; el.style.setProperty('--o', o.toFixed(3)); }
  };
  tick.read = () => { r = el.getBoundingClientRect(); wr = word.getBoundingClientRect(); };
  whenVisible(el, tick);
});

/* ── SOCIAL SLOGAN: letters thicken near the cursor ───── */
$$('[data-slogan-near]').forEach(sl => {
  const L = splitLetters(sl, 160);
  const tick = () => L.forEach(l => {
    const p = .9 * nearness(l, 240);
    l.w = lerp(l.w, 120 + p * 780, .12);
    writeLetter(l, p > .6 ? 'var(--orange)' : 'var(--ink)');
  });
  tick.read = () => readLetters(sl, L, 260);
  whenVisible(sl, tick);
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
        c.removeAttribute('aria-hidden'); $('.card-go', c).tabIndex = 0;
        if (seen && !PAUSED) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); }
      } else {
        const s = k === 1 ? 1 : -1;
        c.style.transform = `translateX(${s * 62}%) scale(.8) rotate(${s * 5}deg)`; c.style.zIndex = k === 1 ? 2 : 1; c.dataset.pos = 'side';
        c.setAttribute('aria-hidden', 'true'); $('.card-go', c).tabIndex = -1;
        v.pause();
      }
    });
    num.textContent = a + 1;
  };
  const go = d => { a = (a + d + n) % n; place(); restart(); };
  const restart = () => { clearInterval(timer); timer = setInterval(() => { if (!hover && seen && !PAUSED) go(1); }, 5200); };
  motionSubs.add(p => { const v = $('video', cards[a]); if (p) v.pause(); else if (seen) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } });
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
    if (seen && !PAUSED) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause();
  }, { threshold: .3 }).observe(box);
  box.addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); });
  place(); restart();
})();

/* ── SOCIAL: brand rows, animated logos, endless reel rows ─ */
(() => {
  const host = $('[data-clients]'); if (!host) return;
  const animMeta = fetch(M + 'logo/anim.json?v=' + LOGO_V).then(r => r.json()).catch(() => ({}));
  // focus: the reel under the cursor plays; every other reel pauses, shrinks and fades
  const focus = { el: null, video: null };
  const setFocus = (el) => {
    if (focus.el === el) return;
    if (focus.el) focus.el.classList.remove('focus');
    focus.el = el; focus.video = el ? $('video', el) : null;
    if (el) el.classList.add('focus');
    host.classList.toggle('focusing', !!el);
  };
  CLIENTS.forEach((c, ci) => {
    const row = document.createElement('article');
    row.className = 'client';
    row.setAttribute('aria-label', c.name);
    // the brand name is the title of every piece
    const list = c.items.map(([k, , ar]) => ({ k, t: c.name, ar }));
    row.innerHTML = `
      <div class="client-id">
        <button class="logo" type="button" style="--tile:${c.tile}" aria-label="Watch ${c.name} work">
          <span class="logo-in"></span>
        </button>${c.sub ? `<p class="client-sub">${c.sub}</p>` : ''}
      </div>
      <div class="reel" data-cursor="drag"><div class="track"></div></div>`;
    host.appendChild(row);
    $('.logo', row).addEventListener('click', () => lb.open(list, 0));
    logo($('.logo', row), c);
    marquee($('.reel', row), list, ci % 2 ? 1 : -1);
  });

  // logo: the brand's own logo animation loops for as long as the cursor stays near it
  function logo(tile, c) {
    const inner = $('.logo-in', tile);
    let start = () => {}, stop = () => {};
    if (c.anim) {
      const cv = document.createElement('canvas'), g = cv.getContext('2d');
      inner.appendChild(cv);
      const img = new Image();
      let S = null, f = 0, running = false, looping = false, t0 = 0;
      const draw = () => {
        if (!S) return;
        g.clearRect(0, 0, cv.width, cv.height);
        g.drawImage(img, (f % S.cols) * S.w, Math.floor(f / S.cols) * S.h, S.w, S.h, 0, 0, cv.width, cv.height);
      };
      // size by the FINISHED logo, so every brand looks the same size and sits in the centre
      const size = () => {
        if (!S) return;
        const dpr = Math.min(2, devicePixelRatio || 1);
        const side = tile.clientWidth;
        const k = Math.min(side * .66 / (S.w * (S.fw || 1)), side * .58 / (S.h * (S.fh || 1)));
        const w = S.w * k, h = S.h * k;
        cv.style.width = w + 'px'; cv.style.height = h + 'px';
        cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
        draw();
      };
      Promise.all([animMeta, new Promise(r => { img.onload = r; img.src = M + 'logo/' + c.id + '-anim.webp?v=' + LOGO_V; })]).then(([m]) => {
        S = m[c.id]; if (!S) return;
        f = S.n - 1; size(); addEventListener('resize', size);
        new IntersectionObserver(([e], o) => { if (e.isIntersecting) { play(false); o.disconnect(); } }, { threshold: .7 }).observe(tile);
      });
      const play = loop => { if (!S) return; looping = loop; if (!running) { running = true; t0 = performance.now(); } };
      start = () => play(true);
      stop = () => { looping = false; };  // finishes the current pass, then rests on the full logo
      ticks.add((dt, now) => {
        if (!running) return;
        const total = S.n + 12;             // a short hold on the finished logo between loops
        let k = Math.floor((now - t0) / 1000 * S.fps);
        if (k >= total) { if (looping) { t0 = now; k = 0; } else { running = false; k = S.n - 1; } }
        f = Math.min(S.n - 1, k);
        draw();
      });
    } else {
      const im = document.createElement('img'); im.src = M + 'logo/' + c.id + '.png'; im.alt = ''; im.draggable = false;
      inner.appendChild(im);
      let timer = 0;
      const pop = () => { tile.classList.remove('pop'); void tile.offsetWidth; tile.classList.add('pop'); };
      start = () => { if (!timer) { pop(); timer = setInterval(pop, 1100); } };
      stop = () => { clearInterval(timer); timer = 0; };
    }
    let p = 0, near = false, rx = 0, ry = 0, r = null, st = '';
    const tick = () => {
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const target = ptr.active ? clamp(1 - Math.hypot(ptr.x - cx, ptr.y - cy) / (r.width * 1.8)) : 0;
      p = lerp(p, target, .12);
      if (target > .2 && !near) { near = true; start(); }
      if (target <= .2 && near) { near = false; stop(); }
      const nx = clamp((ptr.x - cx) / r.width, -1, 1), ny = clamp((ptr.y - cy) / r.height, -1, 1);
      rx = lerp(rx, ptr.active ? nx : 0, .1); ry = lerp(ry, ptr.active ? ny : 0, .1);
      const t = p < .002 ? '' : `perspective(600px) rotateY(${(rx * p * 16).toFixed(2)}deg) rotateX(${(-ry * p * 16).toFixed(2)}deg) scale(${(1 + p * .08).toFixed(4)})`;
      if (t !== st) { st = t; tile.style.transform = t; }
    };
    tick.read = () => { r = tile.getBoundingClientRect(); };
    tick.visible = on => { if (!on && near) { near = false; stop(); } };
    if (FINE) whenVisible(tile, tick);
    else tile.addEventListener('pointerdown', () => { start(); setTimeout(stop, 2500); });
  }

  // an endless row of the brand's reels, all playing, drifting sideways
  function marquee(reel, list, dir) {
    const track = $('.track', reel);
    let H = 0, Wc = 0, setW = 0, x = 0, speed = 1, vids = [], cards = [], offs = [];
    const playing = new Set();
    const build = () => {
      H = reel.clientHeight; Wc = reel.clientWidth;
      const gap = Math.round(clamp(H * .08, 16, 30));
      track.style.gap = gap + 'px';
      let seq = [], w = 0;
      while (w < Wc + 200 || seq.length < 2) list.forEach(it => { seq.push(it); w += Math.round(H * it.ar) + gap; });
      setW = w;
      track.innerHTML = [...seq, ...seq].map(it => {
        const ix = list.indexOf(it);
        return `<div class="it" style="width:${Math.round(H * it.ar)}px" data-i="${ix}">` +
          `<video muted playsinline loop preload="none" poster="${M + it.k}.jpg" data-src="${M + it.k}.mp4" aria-hidden="true"></video></div>`;
      }).join('');
      vids = $$('video', track); cards = $$('.it', track); offs = [];
      let o = 0; cards.forEach(el => { const wd = parseFloat(el.style.width); offs.push([o, o + wd]); o += wd + gap; });
      x = dir < 0 ? 0 : -setW;
      playing.clear();
    };
    build();
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });

    let hover = false, drag = null, moved = 0, rr = null;
    const cardAt = clientX => {
      const rx = clientX - rr.left - x;
      const hit = offs.findIndex(([a, b]) => rx >= a - 10 && rx <= b + 10);
      return hit >= 0 ? cards[hit] : null;
    };
    reel.addEventListener('pointerenter', () => hover = true);
    reel.addEventListener('pointerleave', () => { hover = false; if (focus.el && reel.contains(focus.el)) setFocus(null); });
    reel.addEventListener('pointerdown', e => { drag = { x: e.clientX, x0: x }; moved = 0; reel.setPointerCapture(e.pointerId); reel.classList.add('drag'); });
    reel.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x; moved = Math.max(moved, Math.abs(dx)); x = drag.x0 + dx; });
    reel.addEventListener('pointerup', e => {
      if (!drag) return;
      reel.classList.remove('drag');
      if (moved < 6) { const el = cardAt(e.clientX); if (el) lb.open(list, +el.dataset.i); }
      drag = null;
    });
    reel.addEventListener('pointercancel', () => { drag = null; reel.classList.remove('drag'); });
    reel.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lb.open(list, 0); } });
    reel.tabIndex = 0; reel.setAttribute('role', 'button');
    reel.setAttribute('aria-label', `Watch the ${list[0].t} reels in the player`);

    const tick = dt => {
      // the row stops while you look at one of its reels
      const focused = focus.el && reel.contains(focus.el);
      speed = lerp(speed, drag || PAUSED || focused ? 0 : hover ? .2 : 1, .1);
      if (!drag) x += dir * 38 * speed * dt;
      while (x <= -setW) x += setW;
      while (x > 0) x -= setW;
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      // which card is under the cursor (fine pointers only)
      if (FINE && hover && !drag && ptr.y >= rr.top && ptr.y <= rr.bottom) setFocus(cardAt(ptr.x));
      const l0 = -x - 40, l1 = -x + Wc + 40;
      offs.forEach(([a, b], i) => {
        const v = vids[i];
        // paused switch: everything holds still. focus: only the focused reel plays
        const on = !PAUSED && b > l0 && a < l1 && (!focus.video || focus.video === v);
        if (on && !playing.has(v)) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); playing.add(v); }
        else if (!on && playing.has(v)) { v.pause(); playing.delete(v); }
      });
    };
    tick.read = () => { rr = reel.getBoundingClientRect(); };
    tick.visible = on => { if (!on) { playing.forEach(v => v.pause()); playing.clear(); } };
    whenVisible(reel, tick);
  }
})();

/* ── VIDEO EDIT: one big screen and the list of edits ─── */
(() => {
  const list = $('[data-ed-list]'), vid = $('[data-ed-video]'), frame = $('[data-ed-frame]');
  if (!list) return;
  const title = $('[data-ed-title]'), len = $('[data-ed-len]');
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const select = (i, go) => {
    const it = EDITS[i];
    $$('button', list).forEach((b, k) => b.classList.toggle('on', k === i));
    frame.classList.toggle('tall', !!it.tall);
    vid.poster = M + it.k + '.jpg'; vid.src = M + it.k + '.mp4';
    title.textContent = it.t; len.textContent = fmt(it.d);
    if (go) vid.play().catch(() => {});
  };
  EDITS.forEach((it, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button"><span class="ed-th"><video muted playsinline loop preload="none" poster="${M + it.k}.jpg"></video></span>` +
      `<span class="ed-t">${it.t}</span><span class="ed-d">${fmt(it.d)}</span></button>`;
    const b = li.firstChild, pv = $('video', b);
    b.onclick = () => { select(i, true); if (innerWidth < 900) frame.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
    // hover: a muted preview of the edit
    b.onpointerenter = () => { if (!FINE) return; if (!pv.src) pv.src = M + it.k + '.mp4'; pv.play().catch(() => {}); };
    b.onpointerleave = () => pv.pause();
    list.appendChild(li);
  });
  select(0, false);
  new IntersectionObserver(([e]) => { if (!e.isIntersecting) vid.pause(); }).observe(frame);

  // the slogan: letters thicken near the cursor, and a cut runs across it on the beat while an edit plays
  const sl = $('[data-slogan-cursor]');
  const L = splitLetters(sl, 160);
  const tick = (dt, now) => {
    const live = !vid.paused && !vid.ended;
    const beat = (now / 1000) * 2; // 120 bpm
    L.forEach((l, i) => {
      let p = 0;
      if (live && !PAUSED) {
        const ph = ((beat - i / L.length) % 1 + 1) % 1;
        p = Math.max(0, 1 - ph * 4);
      } else p = .85 * nearness(l, 240);
      l.w = lerp(l.w, 120 + p * 780, live ? .4 : .12);
      writeLetter(l, p > .6 ? 'var(--orange)' : 'var(--ink)');
    });
  };
  tick.read = () => readLetters(sl, L, 260);
  whenVisible(sl, tick);
})();

/* ── TYPO & LOGO: square pieces on a big turning wheel, drag to spin it ─ */
(() => {
  const stage = $('[data-ring]'), wheel = $('[data-ring-inner]'), ul = $('[data-typo-list]');
  if (!stage) return;
  let tiles = [], W = 0, H = 0, S = 0, R = 0, N = 0, step = 0;
  let angle = 0, vel = 0, target = null, hot = null;
  const playing = new Set();
  const build = () => {
    W = stage.clientWidth; H = stage.clientHeight;
    S = Math.round(clamp(W * .16, 132, 230));
    R = Math.max(W * .78, 560);
    // as many squares as fit round the wheel, in whole sets of the five pieces
    N = Math.max(TYPO.length * 2, Math.round(2 * Math.PI * R / (S * 1.45) / TYPO.length) * TYPO.length);
    step = 2 * Math.PI / N;
    playing.forEach(v => v.pause()); playing.clear();
    wheel.innerHTML = '';
    tiles = Array.from({ length: N }, (_, i) => {
      const it = TYPO[i % TYPO.length];
      const p = document.createElement('div');
      p.className = 'panel';
      p.style.cssText = `--pbg:${it.bg};width:${S}px;height:${S}px;visibility:hidden`;
      p.innerHTML = it.img
        ? `<img src="${M + it.k}.png" alt="" draggable="false">`
        : `<video muted playsinline loop preload="none" poster="${M + it.k}.jpg" data-src="${M + it.k}.mp4" aria-hidden="true"></video>`;
      p.dataset.i = i % TYPO.length;
      wheel.appendChild(p);
      return { p, v: $('video', p), st: '', on: false };
    });
  };
  TYPO.forEach((it, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button">${it.t}</button>`;
    li.firstChild.onclick = () => { spinTo(i); lb.open(TYPO, i); };
    li.firstChild.onmouseenter = () => spinTo(i);
    ul.appendChild(li);
  });
  // turn the nearest copy of piece i to the top of the wheel
  const spinTo = i => {
    let best = 0, bd = 1e9;
    for (let k = i; k < N; k += TYPO.length) {
      const d = Math.atan2(Math.sin(k * step + angle), Math.cos(k * step + angle));
      if (Math.abs(d) < bd) { bd = Math.abs(d); best = angle - d; }
    }
    target = best;
  };
  build();
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });

  // drag: the squares follow your hand round the wheel, then glide on
  let drag = null, moved = 0;
  stage.addEventListener('pointerdown', e => {
    drag = { x: e.clientX, a: angle, lx: e.clientX, lt: performance.now() }; moved = 0; vel = 0; target = null;
    stage.setPointerCapture(e.pointerId); stage.classList.add('drag');
  });
  stage.addEventListener('pointermove', e => {
    // hover: the square under the cursor comes forward, the wheel stops
    if (FINE && !drag) {
      const p = e.target.closest('.panel');
      if (p !== hot) { if (hot) hot.classList.remove('focus'); hot = p; if (p) p.classList.add('focus'); wheel.classList.toggle('focusing', !!p); }
    }
    if (!drag) return;
    const dx = e.clientX - drag.x; moved = Math.max(moved, Math.abs(dx));
    const now = performance.now();
    const na = drag.a + dx / R;
    vel = lerp(vel, (e.clientX - drag.lx) / R / Math.max(.008, (now - drag.lt) / 1000), .5);
    drag.lx = e.clientX; drag.lt = now;
    angle = na;
  });
  const end = e => {
    if (!drag) return;
    stage.classList.remove('drag');
    if (moved < 6) {
      const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('.panel');
      if (el) lb.open(TYPO, +el.dataset.i);
      vel = 0;
    }
    drag = null;
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  stage.addEventListener('pointerleave', () => { if (hot) hot.classList.remove('focus'); hot = null; wheel.classList.remove('focusing'); });
  stage.setAttribute('data-cursor', 'drag');

  const CRUISE = -.07; // radians a second, a slow drift to the left
  const tick = dt => {
    if (target !== null) { angle = lerp(angle, target, .09); vel = 0; if (Math.abs(angle - target) < .0005) target = null; }
    else if (!drag) {
      vel = lerp(vel, PAUSED || hot ? 0 : CRUISE, hot ? .2 : .03);
      angle += vel * dt;
    }
    // the wheel's centre sits below the stage, so its top arc runs across it
    const cx = W / 2, cy = S * .95 + R;
    const reach = Math.asin(clamp((W / 2 + S) / R, 0, 1)) + step;
    tiles.forEach((t, i) => {
      const a = Math.atan2(Math.sin(i * step + angle), Math.cos(i * step + angle));
      const vis = Math.abs(a) < reach;
      if (vis) {
        const x = cx + R * Math.sin(a) - S / 2, y = cy - R * Math.cos(a) - S / 2;
        const tr = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${(a * 180 / Math.PI).toFixed(2)}deg)`;
        if (tr !== t.st) { t.st = tr; t.p.style.transform = tr; }
      }
      if (vis !== t.on) { t.on = vis; t.p.style.visibility = vis ? '' : 'hidden'; }
      // play what is on screen; while you point at one, only that one
      const v = t.v; if (!v) return;
      const go = vis && !PAUSED && (!hot || hot === t.p);
      if (go && !playing.has(v)) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); playing.add(v); }
      else if (!go && playing.has(v)) { v.pause(); playing.delete(v); }
    });
    // light up the piece at the top
    let best = 0, bd = 9;
    tiles.forEach((t, i) => { const d = Math.abs(Math.atan2(Math.sin(i * step + angle), Math.cos(i * step + angle))); if (d < bd) { bd = d; best = i % TYPO.length; } });
    $$('button', ul).forEach((b, i) => b.classList.toggle('on', i === best));
  };
  tick.visible = on => { if (!on) { playing.forEach(v => v.pause()); playing.clear(); } };
  whenVisible(stage, tick);
  // keyboard: arrow keys turn the wheel a square at a time
  stage.tabIndex = 0; stage.setAttribute('role', 'group');
  stage.setAttribute('aria-label', 'Typo and logo pieces. Use the left and right arrow keys to turn the wheel, Enter to watch the piece at the top.');
  stage.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const top = $$('button', ul).findIndex(b => b.classList.contains('on'));
      lb.open(TYPO, Math.max(0, top)); return;
    }
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const base = target ?? Math.round(angle / step) * step;
    target = base + (e.key === 'ArrowLeft' ? step : -step);
  });
})();

/* ── VOICE OVER: the slogan takes its weight from the voice ─ */
(() => {
  const sl = $('[data-slogan]'), list = $('[data-vo-list]'), frame = $('[data-vo-frame]');
  const vid = $('[data-vo-video]'), playBtn = $('[data-vo-play]'), tEl = $('[data-vo-title]'), timeEl = $('[data-vo-time]');
  if (!sl) return;
  const L = splitLetters(sl, 200);
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
      p = amps ? amps[i] : .8 * nearness(l, 260);
      l.w = lerp(l.w, 120 + p * 780, amps ? .35 : .12);
      l.y = lerp(l.y, amps && !PAUSED ? -p * 10 : 0, .3);
      writeLetter(l, p > .62 ? 'var(--orange)' : 'var(--ink)');
    });
  };
  tick.read = () => readLetters(sl, L, 280);
  whenVisible($('#voice'), tick);
  new IntersectionObserver(([e]) => { if (!e.isIntersecting) vid.pause(); }).observe(frame);
})();

/* ── pause-motion switch ─────────────────────────────── */
(() => {
  const btn = $('[data-motion]'); if (!btn) return;
  const show = p => { btn.setAttribute('aria-pressed', String(p)); $('span', btn).textContent = p ? 'Play Motion' : 'Pause Motion'; };
  show(PAUSED);
  btn.addEventListener('click', () => { setPaused(!PAUSED); show(PAUSED); });
})();

/* ── phone menu ──────────────────────────────────────── */
(() => {
  const btn = $('[data-menu]'), nav = $('#mnav'); if (!btn || !nav) return;
  const set = open => {
    btn.setAttribute('aria-expanded', String(open));
    btn.firstChild.textContent = open ? 'Close' : 'Menu';
    nav.hidden = !open;
    document.documentElement.classList.toggle('menu-open', open);
    if (open) $('a', nav).focus();
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach(a => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !nav.hidden) { set(false); btn.focus(); } });
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
  const groups = ['.hero-foot > *', '.ed-list li', '.ed-stage', '.services-head > *', '.client-id', '.slogan', '.typo-hint', '.vo-list li', '.vo-stage', '.contact > *', '.typo-list'];
  groups.forEach(sel => $$(sel).forEach((el, i) => { el.classList.add('rise'); el.style.setProperty('--d', (i % 6) * 75 + 'ms'); }));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.rise').forEach(el => io.observe(el));

  const links = $$('.top-nav a');
  const nio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['social', 'edit', 'typo', 'voice', 'contact'].forEach(id => nio.observe(document.getElementById(id)));

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
