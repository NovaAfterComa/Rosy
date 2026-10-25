(() => {
  "use strict";
  const C = window.INVITO_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const st = $("stage");
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = Object.assign({ messaggio: 4.5, bottiglia: 8, foto: 7.5, luna: 7, finale: 6 }, C.durate);
  const T = Object.assign({}, C.testi);
  let timers = [], music = null, waves = null, muted = false, rampId = 0;

  let begun = false;
  const later = (fn, s) => timers.push(setTimeout(fn, s * 1000));
  const clearAll = () => { timers.forEach(clearTimeout); timers = []; clearInterval(rampId); };
  const fill = (s, v) => String(s || "").replace(/\{(\w+)\}/g, (_, k) => C[k] || "");

  /* ---------- Contenuti dalla configurazione ---------- */
  $("t1").textContent = T.scena1 || "";
  $("t2").textContent = T.scena2 || "";
  $("quote").textContent = T.scena4 || "";
  $("f-title").textContent = T.finale || "";
  $("f-name").textContent = C.nome || "";
  $("f-age").textContent = C.eta ? C.eta + " anni" : "";
  $("f-data").textContent = C.data || "";
  $("f-ora").textContent = C.orario ? "ore " + String(C.orario).replace(/^ore\s*/i, "") : "";
  $("f-locale").textContent = C.locale || "";
  $("f-addr").textContent = C.indirizzo || "";
  if (C.mappa) { const a = $("b-map"); a.href = C.mappa; a.hidden = false; }
  const num = String(C.whatsapp || "").replace(/\D/g, "");
  if (num) {
    const a = $("b-wa");
    a.href = "https://wa.me/" + num + "?text=" + encodeURIComponent(fill(C.messaggioConferma));
    a.hidden = false;
  }

  document.querySelectorAll(".mimg").forEach((im) => {
    if (!C.monogramma) return im.remove();
    im.setAttribute("href", C.monogramma);
    im.addEventListener("error", () => im.remove());
  });

  /* ---------- Stelle ---------- */
  const stars = $("stars");
  for (let i = 0; i < 46; i++) {
    const s = document.createElement("i");
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${(Math.random() * 4).toFixed(2)}s;transform:scale(${(0.6 + Math.random()).toFixed(2)})`;
    stars.appendChild(s);
  }

  /* ---------- Polaroid con segnaposto grafici ---------- */
  const GL = [
    '<path d="M0 150q34-26 68 0t68 0 68 0 68 0V270H0z" fill="#fff" opacity=".45"/><path d="M0 185q34-26 68 0t68 0 68 0 68 0" stroke="#fff" fill="none" stroke-width="6"/><circle cx="200" cy="70" r="26" fill="#fff" opacity=".8"/>',
    '<circle cx="95" cy="105" r="32" fill="#fff" opacity=".85"/><circle cx="178" cy="115" r="32" fill="#fff" opacity=".65"/><path d="M45 225q50-76 100 0zM130 225q50-76 100 0z" fill="#fff" opacity=".7"/>',
    '<circle cx="135" cy="165" r="44" fill="#fff" opacity=".8"/><circle cx="82" cy="108" r="17" fill="#fff"/><circle cx="188" cy="108" r="17" fill="#fff"/><circle cx="108" cy="75" r="15" fill="#fff"/><circle cx="162" cy="75" r="15" fill="#fff"/>',
    '<circle cx="135" cy="110" r="60" fill="#fff" opacity=".85"/><circle cx="113" cy="96" r="7" fill="#1b5e84"/><circle cx="157" cy="96" r="7" fill="#1b5e84"/><path d="M105 128q30 32 60 0" stroke="#1b5e84" stroke-width="6" fill="none" stroke-linecap="round"/>'
  ];
  const COL = [["#7cc3dd", "#1d6a96"], ["#f0d9a8", "#c79a5a"], ["#a9d6e4", "#4f8fb0"], ["#cfe3ef", "#6d9fc2"]];
  const ph = (i, label) => {
    const [a, b] = COL[i % 4];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 270"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="270" height="270" fill="url(#g)"/>${GL[i % 4]}<text x="135" y="256" text-anchor="middle" font-family="Georgia,serif" font-size="15" fill="#fff" opacity=".95">${(label || "Inserisci foto").replace(/[<&]/g, "")}</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  };
  const ROT = [-4, 3, 2.5, -3];
  const pols = $("pols");
  (C.foto || []).slice(0, 4).forEach((f, i) => {
    const fig = document.createElement("figure");
    fig.className = "pol";
    const sx = i % 2 ? -1 : 1, sy = i < 2 ? 1 : -1;
    fig.style.cssText = `--i:${i};--r:${ROT[i]}deg;--fx:calc(${sx} * min(20vw,100px));--fy:calc(${sy} * min(22vh,140px))`;
    const img = new Image();
    img.alt = f.didascalia || "";
    img.decoding = "async";
    img.src = f.src || ph(i, f.etichetta);
    img.onerror = () => { img.onerror = null; img.src = ph(i, f.etichetta); };
    const cap = document.createElement("figcaption");
    cap.textContent = f.didascalia || "";
    fig.append(img, cap);
    pols.appendChild(fig);
  });

  /* ---------- Precaricamento (mai bloccante) ---------- */
  const loadImg = (src) => new Promise((res) => {
    if (!src) return res();
    const im = new Image();
    im.onload = im.onerror = () => res();
    im.src = src;
  });
  const mono = $("mono");
  if (C.monogramma) {
    mono.onload = () => { mono.hidden = false; };
    mono.onerror = () => { mono.hidden = true; };
    mono.src = C.monogramma;
  }
  const ready = () => { $("bottle").disabled = false; $("b-open").disabled = false; };
  Promise.race([
    Promise.all((C.foto || []).map((f) => loadImg(f.src))),
    new Promise((r) => setTimeout(r, 5000))
  ]).then(ready, ready);

  /* ---------- Audio ---------- */
  const mk = (src, loop, vol) => {
    if (!src) return null;
    try { const a = new Audio(src); a.loop = loop; a.volume = vol; a.preload = "auto"; a.onerror = () => {}; return a; } catch (e) { return null; }
  };
  const play = (a) => { if (a) { const p = a.play(); if (p && p.catch) p.catch(() => {}); } };
  const ramp = (a, to, sec) => {
    if (!a) return; clearInterval(rampId);
    const from = a.volume, n = 20; let k = 0;
    rampId = setInterval(() => { k++; a.volume = Math.max(0, Math.min(1, from + (to - from) * k / n)); if (k >= n) clearInterval(rampId); }, sec * 1000 / n);
  };
  const setMuted = (m) => {
    muted = m;
    [music, waves].forEach((a) => { if (a) a.muted = m; });
    $("b-sound").setAttribute("aria-pressed", String(m));
  };
  $("b-sound").addEventListener("click", () => setMuted(!muted));

  /* ---------- Cielo, mare e spiaggia (canvas) ---------- */
  const cv = $("scene"), cx = cv.getContext("2d");
  let W = 0, H = 0, nightAt = Infinity, grain = null, last = 0;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const rgb = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  const hash = (k) => { const v = Math.sin(k * 127.1) * 43758.5453; return v - Math.floor(v); };
  function makeGrain() {
    const g = document.createElement("canvas"); g.width = g.height = 160;
    const x = g.getContext("2d"), d = x.createImageData(160, 160);
    for (let i = 0; i < d.data.length; i += 4) { const v = 150 + Math.random() * 90; d.data[i] = v; d.data[i + 1] = v * 0.9; d.data[i + 2] = v * 0.7; d.data[i + 3] = Math.random() * 95; }
    x.putImageData(d, 0, 0); grain = cx.createPattern(g, "repeat");
  }
  function size() {
    const r = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight; cv.width = W * r; cv.height = H * r;
    cx.setTransform(r, 0, 0, r, 0, 0); makeGrain();
  }
  function frame(ts) {
    requestAnimationFrame(frame);
    if (RM && ts - last < 800) return;
    last = ts;
    const t = ts / 1000, n0 = clamp((ts - nightAt) / 3200), N = n0 * n0 * (3 - 2 * n0), day = 1 - N;
    const hz = H * 0.55, sh = H * 0.87;
    let g = cx.createLinearGradient(0, 0, 0, hz);
    g.addColorStop(0, rgb(mix([88, 162, 210], [4, 12, 34], N)));
    g.addColorStop(0.65, rgb(mix([184, 221, 238], [10, 32, 70], N)));
    g.addColorStop(1, rgb(mix([248, 234, 206], [24, 60, 100], N)));
    cx.fillStyle = g; cx.fillRect(0, 0, W, hz + 1);
    const ys = [0.18, 0.3, 0.12, 0.42, 0.26];
    for (let k = 0; k < 5; k++) {
      const x = ((k * 0.31 + t * 0.003 * (1 + k * 0.3)) % 1.5 - 0.25) * W, y = hz * ys[k], r = W * (0.16 + 0.04 * (k % 3));
      const c = cx.createRadialGradient(x, y, 0, x, y, r);
      c.addColorStop(0, `rgba(255,255,255,${0.5 * day + 0.06 * N})`); c.addColorStop(1, "rgba(255,255,255,0)");
      cx.save(); cx.translate(x, y); cx.scale(1, 0.28); cx.translate(-x, -y); cx.fillStyle = c; cx.fillRect(x - r, y - r, 2 * r, 2 * r); cx.restore();
    }
    g = cx.createLinearGradient(0, hz, 0, sh);
    g.addColorStop(0, rgb(mix([150, 206, 226], [14, 42, 78], N)));
    g.addColorStop(0.5, rgb(mix([52, 141, 178], [8, 28, 58], N)));
    g.addColorStop(1, rgb(mix([18, 92, 132], [4, 16, 36], N)));
    cx.fillStyle = g; cx.fillRect(0, hz, W, H - hz);
    g = cx.createLinearGradient(0, hz - 6, 0, hz + 40);
    g.addColorStop(0, `rgba(255,250,235,${0.55 * day})`); g.addColorStop(1, "rgba(255,250,235,0)");
    cx.fillStyle = g; cx.fillRect(0, hz - 6, W, 46);
    for (let i = 0; i < 34; i++) {
      const p = i / 33, y0 = hz + 8 + Math.pow(p, 1.7) * (sh - hz - 8), a = 0.6 + p * 5.5, f = 0.012 / (0.35 + p);
      cx.beginPath();
      for (let x = 0; x <= W + 12; x += 12) {
        const y = y0 + a * Math.sin(x * f + t * (0.5 + p * 0.6) + i * 1.7) + a * 0.5 * Math.sin(x * f * 2.3 - t * 0.7 + i);
        x ? cx.lineTo(x, y) : cx.moveTo(x, y);
      }
      cx.strokeStyle = `rgba(${N > 0.5 ? "170,200,235" : "255,255,255"},${(0.07 + 0.2 * p) * (1 - N * 0.6)})`;
      cx.lineWidth = 0.6 + p * 1.8; cx.stroke();
    }
    for (let k = 0; k < 46; k++) {
      const p = Math.pow(hash(k + 1), 1.5), y = hz + 6 + p * (sh - hz - 20), x = hash(k + 77) * W, s = Math.sin(t * 2 + k * 3.1) * 0.5 + 0.5;
      cx.fillStyle = `rgba(255,255,255,${0.5 * s * day * (0.3 + p)})`; cx.fillRect(x, y, 3 + p * 14, 1 + p * 1.2);
    }
    if (N > 0.01) {
      const mx = W * (W >= 900 ? 0.62 : 0.68);
      for (let j = 0; j < 70; j++) {
        const p = j / 70, y = hz + 4 + p * (sh - hz) * 0.9, w = (8 + p * 70) * (0.6 + 0.4 * Math.sin(t * 2.2 + j * 1.3)), x = mx + Math.sin(t * 1.4 + j * 0.8) * (2 + p * 10);
        cx.fillStyle = `rgba(236,243,255,${(0.8 - p * 0.7) * N * (0.45 + 0.55 * Math.pow(Math.sin(t * 3 + j * 2.1), 2))})`;
        cx.fillRect(x - w / 2, y, w, 1.3 + p * 1.6);
      }
    }
    const edge = (x) => sh + 9 * Math.sin(x * 0.011 + t * 0.5) + 5 * Math.sin(x * 0.027 - t * 0.8) + Math.sin(t * 0.4) * 7;
    cx.beginPath(); cx.moveTo(0, H);
    for (let x = 0; x <= W + 10; x += 10) cx.lineTo(x, edge(x));
    cx.lineTo(W, H); cx.closePath();
    g = cx.createLinearGradient(0, sh, 0, H);
    g.addColorStop(0, rgb(mix([196, 176, 134], [30, 38, 56], N))); g.addColorStop(0.25, rgb(mix([230, 213, 172], [44, 54, 74], N))); g.addColorStop(1, rgb(mix([240, 226, 190], [52, 62, 82], N)));
    cx.fillStyle = g; cx.fill();
    cx.save(); cx.globalAlpha = 0.6 * (1 - N * 0.65); cx.fillStyle = grain; cx.fill(); cx.restore();
    [[0, 3.5, 0.85 - N * 0.35], [-6, 1.5, 0.45]].forEach(([o, w, al]) => {
      cx.beginPath();
      for (let x = 0; x <= W + 10; x += 10) { const y = edge(x) + o; x ? cx.lineTo(x, y) : cx.moveTo(x, y); }
      cx.strokeStyle = `rgba(255,255,255,${al})`; cx.lineWidth = w; cx.stroke();
    });
    g = cx.createRadialGradient(W / 2, H * 0.5, Math.min(W, H) * 0.35, W / 2, H * 0.5, Math.max(W, H) * 0.75);
    g.addColorStop(0, "rgba(0,10,30,0)"); g.addColorStop(1, `rgba(0,10,30,${0.28 + 0.12 * N})`);
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
  }
  size(); addEventListener("resize", size); requestAnimationFrame(frame);

  /* ---------- Sequenza ---------- */
  const wipe = $("wipe");
  const sweep = () => { wipe.classList.remove("go"); void wipe.offsetWidth; wipe.classList.add("go"); };
  const reflow = () => void st.offsetWidth;

  function reset() {
    clearAll();
    wipe.classList.remove("go");
    nightAt = Infinity;
    st.className = "stage reset";
    reflow();
    st.classList.remove("reset");
    reflow();
  }

  function startAudio() {
    if (!music) music = mk(C.musica, true, 0.55);
    if (!waves) waves = mk(C.onde, true, 0.5);
    [music, waves].forEach((a) => { if (a) { a.muted = muted; a.currentTime = 0; play(a); } });
    if (music) music.volume = 0.55;
    if (waves) waves.volume = 0.5;
    $("b-sound").hidden = !(music || waves);
  }

  function run() {
    reset();
    let t = 0;
    const at = (s, fn) => later(fn, s);
    st.classList.add("s1");
    t += D.messaggio;
    at(t, () => st.classList.add("s2"));
    t += D.bottiglia;
    at(t, () => st.classList.add("s3"));
    t += D.foto;
    at(t, () => { st.classList.add("s4"); nightAt = performance.now() + (RM ? 0 : 1100); sweep(); ramp(waves, 0.15, 3); });
    t += D.luna;
    at(t, () => {
      sweep();
      later(() => { st.classList.add("s5"); }, RM ? 0 : 1.5);
      ramp(music, 1, 2.5);
    });
  }

  function skipToEnd() {
    clearAll();
    wipe.classList.remove("go");
    nightAt = -1e9;
    st.classList.add("jump", "s1", "s2", "s3", "s4", "s5");
    reflow();
    st.classList.remove("jump");
    ramp(music, 1, 2);
    ramp(waves, 0.1, 2);
  }

  const begin = () => { if (begun) return; begun = true; $("ui").hidden = false; startAudio(); run(); };
  $("bottle").addEventListener("click", begin);
  $("b-open").addEventListener("click", begin);
  $("b-skip").addEventListener("click", skipToEnd);
  $("b-replay").addEventListener("click", () => {
    if (music) music.volume = 0.55;
    if (waves) { waves.volume = 0.5; if (!muted) play(waves); }
    if (music && music.paused && !muted) play(music);
    run();
  });
  document.addEventListener("visibilitychange", () => {
    const started = begun;
    [music, waves].forEach((a) => { if (a) { if (document.hidden) a.pause(); else if (started && !muted) play(a); } });
  });
})();
