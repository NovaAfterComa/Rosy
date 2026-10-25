(() => {
  "use strict";
  const C = window.INVITO_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const st = $("stage");
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = Object.assign({ messaggio: 4.5, bottiglia: 6.5, foto: 7.5, luna: 7, finale: 6 }, C.durate);
  const T = Object.assign({}, C.testi);
  let timers = [], music = null, waves = null, muted = false, rampId = 0;

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
  const open = $("b-open"), hint = $("hint");
  const ready = () => { open.disabled = false; hint.textContent = "Tocca per iniziare"; };
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

  /* ---------- Sequenza ---------- */
  const wipe = $("wipe");
  const sweep = () => { wipe.classList.remove("go"); void wipe.offsetWidth; wipe.classList.add("go"); };
  const reflow = () => void st.offsetWidth;

  function reset() {
    clearAll();
    wipe.classList.remove("go");
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
    at(t, () => { st.classList.add("s4"); sweep(); ramp(waves, 0.15, 3); });
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
    st.classList.add("jump", "s1", "s2", "s3", "s4", "s5");
    reflow();
    st.classList.remove("jump");
    ramp(music, 1, 2);
    ramp(waves, 0.1, 2);
  }

  open.addEventListener("click", () => {
    $("start").classList.add("gone");
    $("ui").hidden = false;
    startAudio();
    run();
  });
  $("b-skip").addEventListener("click", skipToEnd);
  $("b-replay").addEventListener("click", () => {
    if (music) music.volume = 0.55;
    if (waves) { waves.volume = 0.5; if (!muted) play(waves); }
    if (music && music.paused && !muted) play(music);
    run();
  });
  document.addEventListener("visibilitychange", () => {
    const started = $("start").classList.contains("gone");
    [music, waves].forEach((a) => { if (a) { if (document.hidden) a.pause(); else if (started && !muted) play(a); } });
  });
})();
