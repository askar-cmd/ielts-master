/* ============================================================
   app.js — mesin aplikasi IELTS Master
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ---------- Storage ---------- */
  const KEY = "ielts_master";
  const S = {
    load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } },
    save(d) { localStorage.setItem(KEY, JSON.stringify(d || S.data())); },
    data() {
      const d = JSON.parse(localStorage.getItem(KEY)) || {};
      if (!d.lessons) d.lessons = {};
      if (!d.vocab) d.vocab = {};
      if (!d.grammar) d.grammar = {};
      if (!d.results) d.results = {};
      if (!d.exams) d.exams = {};
      if (!d.practiceStats) d.practiceStats = {};
      if (!d.streak) d.streak = { count: 0, date: "" };
      return d;
    },
    record(update) {
      const d = S.data();
      const merged = typeof update === "function" ? update(d) : Object.assign(d, update);
      S.save(merged);
      return S.data();
    },
  };

  /* ---------- Helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => "id" + Math.random().toString(36).slice(2, 9);

  const LEVEL_MAP = {};
  LEVELS.forEach((lv) => (LEVEL_MAP[lv.id] = lv));

  const lessonsByLevel = (lv) => LESSONS.filter((l) => l.level === lv);
  const lessonById = (id) => LESSONS.find((l) => l.id === id);
  const readingById = (id) => READING_LIST.find((r) => r.id === id);
  const listeningById = (id) => LISTENING_LIST.find((l) => l.id === id);
  const writingById = (id) => WRITING_TASKS.find((w) => w.id === id);
  const speakingById = (id) => SPEAKING_TOPICS.find((s) => s.id === id);
  const vocabById = (id) => VOCAB_SETS.find((v) => v.id === id);
  const grammarById = (id) => GRAMMAR_LESSONS.find((g) => g.id === id);

  /* ---------- Exam mode ---------- */
  const EXAM_SKILLS = ["listening", "reading", "writing", "speaking"];
  const EXAM_LABELS = { listening: "🎧 Listening", reading: "📖 Reading", writing: "✍️ Writing", speaking: "🗣️ Speaking" };
  const EXAMS = {
    beginner: { listening: "le1", reading: "re1", writing: "wt1", speaking: "sp1" },
    intermediate: { listening: "le4", reading: "re4", writing: "wt3", speaking: "sp2" },
    advanced: { listening: "le2", reading: "re5", writing: "wt2", speaking: "sp3" },
    expert: { listening: "le3", reading: "re6", writing: "wt4", speaking: "sp4" },
  };
  function bandScore(pct) {
    const t = [[95, 9], [88, 8.5], [80, 8], [72, 7.5], [64, 7], [56, 6.5], [48, 6], [40, 5.5], [33, 5], [26, 4.5], [19, 4], [12, 3.5], [0, 3]];
    for (const [p, b] of t) { if (pct >= p) return b; }
    return 2;
  }
  const fmtBand = (b) => Number.isInteger(b) ? String(b) : b.toFixed(1);
  function getExam(level, skill) { const e = S.data().exams[level]; return e && e[skill]; }
  function saveExam(level, skill, obj) {
    S.record((d) => { if (!d.exams[level]) d.exams[level] = {}; d.exams[level][skill] = obj; return d; });
    syncSidebar();
  }
  function overallBand(level) {
    const res = EXAM_SKILLS.map((s) => getExam(level, s)).filter(Boolean);
    if (!res.length) return null;
    const avg = res.reduce((a, b) => a + b.band, 0) / res.length;
    return Math.round(avg * 10) / 10;
  }

  /* ---------- Premium / aktivasi ---------- */
  function hasPremium() {
    const v = S.data().vip;
    return !!(v && v.code && verifyVipCode(v.code));
  }
  function isPaidLevel(levelId) {
    return (APP_CONFIG.paidLevels || []).includes(levelId);
  }
  function isLocked(levelId) {
    return isPaidLevel(levelId) && !hasPremium();
  }
  function activateVip(code) {
    code = String(code).trim();
    if (!verifyVipCode(code)) return false;
    S.record((d) => { d.vip = { code, at: Date.now() }; return d; });
    syncSidebar();
    return true;
  }
  function premiumGate(levelId) {
    if (isLocked(levelId)) {
      renderUpgrade(levelId);
      return true;
    }
    return false;
  }
  function renderUpgrade(levelId) {
    const lv = LEVEL_MAP[levelId];
    $("#topbarTitle").textContent = "Premium";
    $("#view").innerHTML = `
      <div class="card" style="text-align:center">
        <div style="font-size:52px">🔒</div>
        <h1>Level ${esc(lv ? lv.name : "")} adalah Premium</h1>
        <p class="muted">Untuk membuka level <strong>${esc(lv ? lv.name : "")}</strong> dan semua fitur lanjutan, aktivasi premium dengan kode yang Anda terima.</p>
        <a class="btn primary lg" href="#/premium">⭐ Aktivasi Premium</a>
        <a class="btn" href="#/dashboard" style="margin-left:8px">Ke Dasbor</a>
      </div>`;
  }

  const isDone = (id) => !!(S.data().lessons[id]);
  const markDone = (id) => { S.record((d) => { d.lessons[id] = true; return d; }); syncSidebar(); };

  function lessonProgress() {
    const done = Object.keys(S.data().lessons).filter((k) => S.data().lessons[k]).length;
    const total = LESSONS.length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }
  function levelPct(levelId) {
    const ls = lessonsByLevel(levelId);
    if (!ls.length) return 0;
    const done = ls.filter((l) => isDone(l.id)).length;
    return Math.round((done / ls.length) * 100);
  }
  function currentLevel() {
    for (const lv of LEVELS) { if (levelPct(lv.id) < 100) return lv; }
    return LEVELS[LEVELS.length - 1];
  }

  function bandFromPct(pct) {
    if (pct >= 90) return "8.5–9.0";
    if (pct >= 80) return "7.5–8.0";
    if (pct >= 70) return "7.0";
    if (pct >= 60) return "6.5";
    if (pct >= 50) return "6.0";
    if (pct >= 40) return "5.5";
    if (pct >= 30) return "5.0";
    if (pct >= 20) return "4.5";
    return "4.0 atau lebih rendah";
  }

  /* ---------- TTS (Text-to-Speech) ---------- */
  const tts = {
    speaking: false,
    voice: null,
    init() {
      if (!("speechSynthesis" in window)) return;
      const setVoice = () => {
        const voices = speechSynthesis.getVoices();
        this.voice = voices.find((v) => /en-GB/i.test(v.lang)) || voices.find((v) => /^en/i.test(v.lang)) || null;
      };
      setVoice();
      speechSynthesis.onvoiceschanged = setVoice;
    },
    speak(text) {
      if (!("speechSynthesis" in window)) { toast("Browser Anda tidak mendukung TTS"); return; }
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/[_—–-]/g, " "));
      u.lang = "en-GB";
      if (this.voice) u.voice = this.voice;
      u.rate = 0.95;
      this.speaking = true;
      u.onend = () => { this.speaking = false; document.querySelectorAll(".tts-btn").forEach(b => b.classList.remove("speaking")); };
      u.onerror = () => { this.speaking = false; };
      speechSynthesis.speak(u);
      document.querySelectorAll(".tts-btn").forEach(b => b.classList.add("speaking"));
    },
    stop() { if ("speechSynthesis" in window) { speechSynthesis.cancel(); this.speaking = false; document.querySelectorAll(".tts-btn").forEach(b => b.classList.remove("speaking")); } },
  };

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- Router ---------- */
  const routes = {};
  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    return { name: parts[0] || "dashboard", params: parts.slice(1) };
  }
  function go(route) { location.hash = "#/" + route; }

  window.addEventListener("hashchange", render);
  function render() {
    const { name, params } = parseHash();
    let fn;
    if (name === "vocab" && params.length) fn = routes.vocabSet;
    else if (name === "grammar" && params.length) fn = routes.grammarLesson;
    else if (name === "practice" && params.length) fn = routes.practiceComp;
    else if (name === "exam" && params.length === 2 && params[1] === "result") fn = routes.examResult;
    else if (name === "exam" && params.length === 2) fn = routes.examSkill;
    else if (name === "exam" && params.length === 1) fn = routes.examLevel;
    else fn = routes[name] || routes.dashboard;
    $("#view").innerHTML = "<div class='card'>Memuat…</div>";
    syncSidebar();
    fn(params);
  }

  function syncSidebar() {
    const { name, params } = parseHash();
    $$("#nav .nav-link").forEach((a) => {
      const r = a.dataset.route;
      const active = (r === "dashboard" && name === "dashboard") ||
        (r === "learn" && name === "learn") ||
        (r === name && ["listening", "reading", "writing", "speaking"].includes(name)) ||
        (name === "skill" && r === params[0] && ["listening", "reading", "writing", "speaking"].includes(r)) ||
        (name === "exercise" && r === params[0] && ["listening", "reading", "writing", "speaking"].includes(r)) ||
        (r === "vocab" && name === "vocab") ||
        (r === "grammar" && name === "grammar") ||
        (r === "mock" && name === "mock") ||
        (r === "exam" && name === "exam") ||
        (r === "practice" && name === "practice") ||
        (r === "mixed" && name === "mixed");
      a.classList.toggle("active", active);
    });
    const lv = currentLevel();
    $("#sideLevel").textContent = "Level: " + lv.name;
    $("#sideLevel").style.color = lv.color;
    const p = lessonProgress();
    $("#sideProgress").style.width = p.pct + "%";
    $("#sideProgressText").textContent = p.pct + "%";
    /* streak */
    touchStreak();
  }

  function touchStreak() {
    const d = S.data();
    const today = new Date().toDateString();
    if (d.streak.date === today) { $("#streak").textContent = "🔥 " + d.streak.count; return; }
    const yesterday = new Date(Date.now() - 864e5).toDateString();
    let count = d.streak.date === yesterday ? d.streak.count : 0;
    count += 1;
    S.record((dd) => { dd.streak = { count, date: today }; return dd; });
    $("#streak").textContent = "🔥 " + count;
  }

  /* ============================================================
     DASHBOARD
     ============================================================ */
  routes.dashboard = () => {
    const d = S.data();
    const p = lessonProgress();
    const lv = currentLevel();
    const vocabWords = Object.values(d.vocab).reduce((a, b) => a + (Array.isArray(b) ? b.length : 0), 0);
    /* last result */
    const last = Object.values(d.results).sort((a, b) => b.at - a.at)[0];

    $("#topbarTitle").textContent = "Dasbor";

    let lastHtml = `<p class="muted">Belum ada hasil latihan. Mulai dari <a href="#/learn">Jalur Belajar</a>.</p>`;
    if (last) {
      lastHtml = `
        <div class="grid cols-2">
          <div class="card">
            <h3>Latihan Terakhir</h3>
            <div class="result-score" style="color:var(--accent)">${last.pct}%</div>
            <div class="muted">${esc(last.title)} — ${esc(last.skill)}</div>
            <div style="margin-top:10px"><span class="level-chip" style="background:var(--accent)">Estimasi band: ${bandFromPct(last.pct)}</span></div>
          </div>
          <div class="card">
            <h3>Lanjutkan</h3>
            ${nextLessonCard()}
          </div>
        </div>`;
    }

    $("#view").innerHTML = `
      <div class="card hero">
        <div>
          <h1>Halo! Selamat datang di IELTS Master 🎯</h1>
          <p class="muted">Belajar IELTS dari dasar hingga level expert, lengkap dengan simulasi tes.</p>
        </div>
        <a class="btn primary lg" href="#/learn">🛤️ Mulai Belajar</a>
      </div>

      <div class="stat-grid" style="margin-top:16px">
        <div class="stat"><div class="ico">📈</div><div class="num">${p.pct}%</div><div class="lbl">Progress total</div></div>
        <div class="stat"><div class="ico">✅</div><div class="num">${p.done}/${p.total}</div><div class="lbl">Pelajaran selesai</div></div>
        <div class="stat"><div class="ico">📚</div><div class="num">${vocabWords}</div><div class="lbl">Kata dipelajari</div></div>
        <div class="stat"><div class="ico">${lv.icon}</div><div class="num" style="font-size:20px">${lv.name}</div><div class="lbl">${lv.band}</div></div>
      </div>

      <div style="margin-top:16px" class="card">
        <h2>Level Belajar Anda</h2>
        <div class="muted" style="margin-bottom:12px">Level aktif: <strong style="color:${lv.color}">${lv.name} (${lv.band})</strong></div>
        ${LEVELS.map((lv2) => {
          const pct = levelPct(lv2.id);
          return `
            <div style="margin-bottom:14px">
              <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                <span>${lv2.icon} <strong>${lv2.name}</strong> <span class="muted">(${lv2.band})</span></span>
                <span class="muted">${pct}%</span>
              </div>
              <div class="progress-mini-track"><div class="progress-mini-fill" style="width:${pct}%;background:${lv2.color}"></div></div>
            </div>`;
        }).join("")}
        <div style="margin-top:14px">${lastHtml}</div>
      </div>
      ${practiceStatsCard(d)}
      <div class="card" style="margin-top:16px">
        <h2>Simulasi Tes Singkat</h2>
        <p class="muted">Coba tes simulasi penuh untuk mengukur kemampuan Anda.</p>
        <a class="btn primary" href="#/mock">⏱️ Mulai Tes Simulasi</a>
      </div>`;
  };

  function practiceStatsCard(d) {
    const pc = [
      { k: "listening", i: "🎧", l: "Listening" },
      { k: "reading", i: "📖", l: "Reading" },
      { k: "writing", i: "✍️", l: "Writing" },
      { k: "speaking", i: "🗣️", l: "Speaking" },
      { k: "grammar", i: "🔤", l: "Grammar" },
      { k: "vocabulary", i: "📚", l: "Vocabulary" },
      { k: "mixed", i: "🎲", l: "Mode Campuran" },
    ];
    const totalAttempts = pc.reduce((a, c) => a + ((d.practiceStats[c.k] || {}).attempts || 0), 0);
    return `
      <div class="card" style="margin-top:16px">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <h2 style="margin:0;flex:1">Statistik Bank Latihan</h2>
          <span class="muted">${totalAttempts} sesi selesai</span>
        </div>
        <div class="grid cols-4" style="margin-top:12px">
          ${pc.map((c) => {
            const s = d.practiceStats[c.k];
            return `
            <div class="stat" style="margin:0;padding:14px">
              <div class="ico">${c.i}</div>
              <div class="num" style="font-size:20px;color:${s ? "var(--green)" : "var(--muted)"}">${s ? s.best + "%" : "—"}</div>
              <div class="lbl">${c.l} · terbaik</div>
              <div class="muted" style="font-size:12px">${s ? s.last + "% terakhir · " + s.attempts + "x" : "belum ada"}</div>
            </div>`;
          }).join("")}
        </div>
        <div style="margin-top:10px"><a class="btn sm" href="#/practice">Ke Bank Latihan →</a> <a class="btn sm" href="#/mixed">🎲 Mode Campuran</a></div>
      </div>`;
  }

  function nextLessonCard() {
    for (const lv of LEVELS) {
      const ls = lessonsByLevel(lv.id);
      const next = ls.find((l) => !isDone(l.id));
      if (next) {
        const skillIcon = { listening: "🎧", reading: "📖", writing: "✍️", speaking: "🗣️", grammar: "🔤", vocab: "📚", guide: "ℹ️" }[next.skill] || "";
        return `<p class="muted">Pelajaran berikutnya di level <strong>${lv.name}</strong>:</p>
          <div class="lesson-row" onclick="location.hash='#/${exerciseRoute(next)}'">
            <span class="l-ico">${skillIcon}</span>
            <span class="l-title">${esc(next.title)}</span>
            <span class="l-status">→</span>
          </div>`;
      }
    }
    return `<p class="muted">🎉 Semua pelajaran selesai! Coba <a href="#/mock">tes simulasi</a>.</p>`;
  }

  function exerciseRoute(lesson) {
    if (lesson.kind === "exercise" && lesson.ref) return "exercise/" + lesson.ref.type + "/" + lesson.ref.id;
    if (lesson.kind === "lesson") return "lesson/" + lesson.id;
    return "learn";
  }

  /* ============================================================
     LESSON VIEWER (untuk pelajaran panduan/grammar/vocab)
     ============================================================ */
  routes.lesson = (params) => {
    const l = lessonById(params[0]);
    if (!l) { go("learn"); return; }
    const lv = LEVEL_MAP[l.level];
    $("#topbarTitle").textContent = l.title;
    const done = isDone(l.id);
    const skillIcon = { listening: "🎧", reading: "📖", writing: "✍️", speaking: "🗣️", grammar: "🔤", vocab: "📚", guide: "ℹ️" }[l.skill] || "";

    $("#view").innerHTML = `
      <div class="card">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="level-chip" style="background:${lv.color}">${lv.icon} ${lv.name}</span>
          <span style="font-size:22px">${skillIcon}</span>
          <h2 style="margin:0;flex:1">${esc(l.title)}</h2>
          <button class="btn" onclick="location.hash='#/learn'">← Jalur Belajar</button>
        </div>
        <div style="margin-top:16px">${l.body}</div>
        <div style="margin-top:20px">
          <button class="btn green lg" id="markLesson">${done ? "Selesai ✓" : "Tandai Selesai"}</button>
          <a class="btn" href="#/learn" style="margin-left:8px">Kembali ke Jalur Belajar</a>
        </div>
      </div>`;
    $("#markLesson").onclick = () => {
      markDone(l.id);
      toast("✅ Pelajaran ditandai selesai!");
      $("#markLesson").textContent = "Selesai ✓";
    };
  };

  /* ============================================================
     LEARNING PATH
     ============================================================ */
  routes.learn = () => {
    $("#topbarTitle").textContent = "Jalur Belajar";
    $("#view").innerHTML = `
      <h1>Jalur Belajar</h1>
      <p class="muted">Ikuti kurikulum berjenjang dari Dasar sampai Expert. Selesaikan pelajaran untuk membuka level berikutnya.</p>
      ${LEVELS.map((lv) => {
        const pct = levelPct(lv.id);
        const ls = lessonsByLevel(lv.id);
        const unlocked = true; // semua terbuka, tapi beri penanda
        return `
          <div class="path-level">
            <div class="path-level-head" style="border-left:5px solid ${lv.color}">
              <span class="icon">${lv.icon}</span>
              <div style="flex:1">
                <div style="font-size:18px;font-weight:800">${lv.name}</div>
                <div class="muted" style="font-size:13px">${lv.band}</div>
              </div>
              <div style="text-align:right">
                <div class="progress-mini" style="width:160px">
                  <div class="progress-mini-track"><div class="progress-mini-fill" style="width:${pct}%;background:${lv.color}"></div></div>
                  <span class="progress-mini-text">${pct}%</span>
                </div>
              </div>
            </div>
            <div class="path-level-body">
              <p class="muted" style="margin-top:0">${esc(lv.desc)}</p>
              ${ls.map((l) => {
                const skillIcon = { listening: "🎧", reading: "📖", writing: "✍️", speaking: "🗣️", grammar: "🔤", vocab: "📚", guide: "ℹ️" }[l.skill] || "";
                const done = isDone(l.id);
                return `
                  <div class="lesson-row ${done ? "done" : ""}" onclick="location.hash='#/${exerciseRoute(l)}'">
                    <span class="l-ico">${skillIcon}</span>
                    <span class="l-title">${esc(l.title)}</span>
                    <span class="l-skill">${ucfirst(l.skill)}</span>
                    <span class="l-status">${done ? "✅" : "○"}</span>
                  </div>`;
              }).join("")}
              ${pct >= 100 ? `<div class="tip" style="margin-top:8px">🎉 Level ${lv.name} selesai! Lanjut ke level berikutnya.</div>` : ""}
            </div>
          </div>`;
      }).join("")}`;
    highlightLevels();
  };

  function highlightLevels() {
    $$(".path-level").forEach((el, i) => {
      const lv = LEVELS[i];
      const pct = levelPct(lv.id);
      const prevDone = i === 0 || levelPct(LEVELS[i - 1].id) >= 100;
      if (!prevDone) el.style.opacity = "0.6";
    });
  }

  const ucfirst = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* ============================================================
     SKILL INDEX
     ============================================================ */
  routes.skill = (params) => {
    const type = params[0];
    const skills = {
      listening: { icon: "🎧", name: "Listening", tag: "Dengarkan audio (TTS) & jawab soal" },
      reading: { icon: "📖", name: "Reading", tag: "Baca passage & jawab berbagai tipe soal" },
      writing: { icon: "✍️", name: "Writing", tag: "Task 1 & Task 2 dengan contoh jawaban" },
      speaking: { icon: "🗣️", name: "Speaking", tag: "Part 1–3 dengan contoh & tips band tinggi" },
    }[type];
    if (!skills) { go("dashboard"); return; }

    $("#topbarTitle").textContent = skills.name;

    const list = {
      listening: LISTENING_LIST, reading: READING_LIST, writing: WRITING_TASKS, speaking: SPEAKING_TOPICS,
    }[type];

    /* Urutkan Writing: Task 1 di atas, lalu Task 2 di bawah; tiap grup diurutkan per level. */
    let displayList = list;
    if (type === "writing") {
      const lvlIdx = {};
      LEVELS.forEach((l, i) => { lvlIdx[l.id] = i; });
      displayList = list.slice().sort((a, b) => {
        if (a.taskType !== b.taskType) return String(a.taskType) < String(b.taskType) ? -1 : 1;
        return (lvlIdx[a.level] ?? 99) - (lvlIdx[b.level] ?? 99);
      });
    }

    $("#view").innerHTML = `
      <h1>${skills.icon} ${skills.name}</h1>
      <p class="muted">${skills.tag}</p>
      <div class="grid cols-4" style="margin-top:8px">
        ${LEVELS.map((lv) => `
          <div class="card" style="padding:14px;text-align:center;margin:0">
            <div style="font-size:24px">${lv.icon}</div>
            <strong>${lv.name}</strong><br/>
            <span class="muted" style="font-size:12px">${lv.band}</span>
          </div>`).join("")}
      </div>
      <div style="margin-top:18px">
        ${displayList.map((item) => {
          const lv = LEVEL_MAP[item.level];
          const done = isDone("@" + type + "/" + item.id);
          const nq = item.questions ? item.questions.length : 0;
          let meta = "";
          if (type === "listening") meta = `<span class="muted">🎧 audio · ${nq} soal</span>`;
          else if (type === "reading") meta = `<span class="muted">📄 passage · ${nq} soal</span>`;
          else if (type === "writing") meta = `<span class="muted">Task ${item.taskType}</span>`;
          else if (type === "speaking") meta = `<span class="muted">Part ${item.part}</span>`;
          return `
            <div class="lesson-row" onclick="location.hash='#/exercise/${type}/${item.id}'">
              <span class="l-ico">${lv.icon}</span>
              <span style="flex:1">
                <div class="l-title">${esc(item.title)}</div>
                <div style="font-size:12px;color:var(--muted)">${esc(lv.name)} · ${meta}</div>
              </span>
              <span class="l-status">${done ? "✅" : "→"}</span>
            </div>`;
        }).join("")}
      </div>
      <p class="tip" style="margin-top:20px">💡 Kembali ke <a href="#/learn">Jalur Belajar</a> untuk urutan yang disarankan.</p>`;
  };

  function markSkillDone(type, id) {
    S.record((d) => { d.lessons["@" + type + "/" + id] = true; return d; });
    syncSidebar();
  }
  function isSkillDone(type, id) { return !!S.data().lessons["@" + type + "/" + id]; }

  /* ============================================================
     EXERCISE DISPATCH
     ============================================================ */
  routes.exercise = (params) => {
    const [type, id] = params;
    let levelId = null;
    if (type === "listening") { const x = listeningById(id); if (x) levelId = x.level; }
    else if (type === "reading") { const x = readingById(id); if (x) levelId = x.level; }
    else if (type === "writing") { const x = writingById(id); if (x) levelId = x.level; }
    else if (type === "speaking") { const x = speakingById(id); if (x) levelId = x.level; }
    if (levelId && premiumGate(levelId)) return;
    if (type === "listening") renderListening(id);
    else if (type === "reading") renderReading(id);
    else if (type === "writing") renderWriting(id);
    else if (type === "speaking") renderSpeaking(id);
    else go("dashboard");
  };

  /* ---------- Reading ---------- */
  function renderReading(id) {
    const ex = readingById(id);
    if (!ex) { go("skill/reading"); return; }
    const lv = LEVEL_MAP[ex.level];
    $("#topbarTitle").textContent = "Reading — " + ex.title;
    const hasMatch = ex.questions.some((q) => q.type === "match");
    const hasFill = ex.questions.some((q) => q.type === "fill");

    $("#view").innerHTML = `
      <div class="card">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="level-chip" style="background:${lv.color}">${lv.icon} ${lv.name}</span>
          <h2 style="margin:0;flex:1">${esc(ex.title)}</h2>
          <span class="muted" style="font-size:13px">📌 Bacaan tetap di sisi kanan</span>
        </div>
        <div class="source">${esc(ex.source || "")}</div>
      </div>
      <div class="read-split">
        <div class="read-questions">
          <div class="card">
            <h3>❓ Pertanyaan</h3>
            ${ex.questions.map((q, qi) => qBlock(q, qi, ex)).join("")}
            <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn primary lg" id="checkReading">Periksa Jawaban</button>
              <button class="btn" id="resetReading">Reset</button>
            </div>
            <div id="readResult"></div>
          </div>
        </div>
        <div class="read-passage">
          <div class="card">
            <h3>📄 Passage</h3>
            <div class="passage">${ex.passageHTML}</div>
          </div>
        </div>
      </div>`;

    $("#checkReading").onclick = () => gradeReading(ex);
    $("#resetReading").onclick = () => renderReading(id);
  }

  function qBlock(q, qi, ex) {
    const n = qi + 1;
    if (q.type === "mcq") {
      return `
        <div class="qblock" data-q="${qi}">
          <div class="qleading">${n}. ${esc(q.q)}</div>
          ${q.options.map((o, oi) => `
            <div class="option"><label>
              <input type="radio" name="q${qi}" value="${oi}"> <span>${esc(o)}</span>
            </label></div>`).join("")}
        </div>`;
    }
    if (q.type === "tfng") {
      return `
        <div class="qblock" data-q="${qi}">
          <div class="qleading">${n}. ${esc(q.q)}</div>
          <div class="option"><label><input type="radio" name="q${qi}" value="true"> <span><strong>TRUE</strong> — sesuai dengan teks</span></label></div>
          <div class="option"><label><input type="radio" name="q${qi}" value="false"> <span><strong>FALSE</strong> — bertentangan dengan teks</span></label></div>
          <div class="option"><label><input type="radio" name="q${qi}" value="notgiven"> <span><strong>NOT GIVEN</strong> — tidak disebutkan</span></label></div>
        </div>`;
    }
    if (q.type === "match") {
      return `
        <div class="qblock" data-q="${qi}">
          <div class="qleading">${esc(q.q)}</div>
          <div class="info-box" style="margin-bottom:12px"><strong>Pilihan judul (headings):</strong>
            ${ex.headings.map((h, hi) => `<div style="font-size:13px">${roman(hi + 1)}. ${esc(h)}</div>`).join("")}
          </div>
          ${q.items.map((it, ii) => `
            <div class="option">
              <span style="width:110px;font-weight:600">${esc(it.label)}</span>
              <select data-match="${ii}">
                <option value="">— pilih heading —</option>
                ${ex.headings.map((h, hi) => `<option value="${hi}">${roman(hi + 1)}</option>`).join("")}
              </select>
            </div>`).join("")}
        </div>`;
    }
    if (q.type === "fill") {
      return `
        <div class="qblock" data-q="${qi}">
          <div class="qleading">${n}. Lengkapi kalimat berikut (satu kata atau satu angka per titik kosong — <strong>${q.blanks.length} titik</strong>).</div>
          <div class="fillbox">${fillText(q.text)}</div>
        </div>`;
    }
    if (q.type === "short") {
      return `
        <div class="qblock" data-q="${qi}">
          <div class="qleading">${n}. ${esc(q.q)}</div>
          <div class="option"><input type="text" data-short="${qi}" placeholder="Ketik jawaban Anda…" style="flex:1;max-width:420px"></div>
        </div>`;
    }
    return "";
  }

  function fillText(text) {
    const parts = text.split("_____");
    let out = parts[0];
    for (let i = 1; i < parts.length; i++) {
      out += `<input type="text" data-fill="${i - 1}" placeholder="…">` + parts[i];
    }
    return out;
  }

  const roman = (n) => "​".length && ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n - 1] || n;

  function gradeReading(ex) {
    let total = 0, correct = 0;
    const details = [];
    ex.questions.forEach((q, qi) => {
      let ok = false, given = 0;
      if (q.type === "mcq") {
        const sel = $(`input[name="q${qi}"]:checked`);
        given = sel ? parseInt(sel.value, 10) : -1;
        ok = given === q.answer;
        total++;
        if (ok) correct++;
        details.push({ q: q.q, ok, given: given >= 0 ? q.options[given] : "—", correct: q.options[q.answer], correctAnswer: true });
      } else if (q.type === "tfng") {
        const sel = $(`input[name="q${qi}"]:checked`);
        given = sel ? sel.value : "";
        ok = given === q.answer;
        total++;
        if (ok) correct++;
        details.push({ q: q.q, ok, given: given ? given.toUpperCase() : "—", correct: q.answer.toUpperCase(), correctAnswer: true });
      } else if (q.type === "match") {
        const sels = $$(`[data-match]`);
        q.items.forEach((it, ii) => {
          const v = parseInt(sels[ii].value, 10);
          const okk = v === it.correct;
          total++;
          if (okk) correct++;
          details.push({ q: it.label + " → heading", ok: okk, given: v >= 0 ? roman(v + 1) : "—", correct: roman(it.correct + 1), correctAnswer: true });
        });
      } else if (q.type === "fill") {
        const inputs = $$(`[data-fill]`);
        q.blanks.forEach((b, bi) => {
          const val = (inputs[bi].value || "").trim().toLowerCase();
          const okk = val === b.answer.toLowerCase() || (b.alt || []).some((a) => val === a.toLowerCase());
          total++;
          if (okk) correct++;
          details.push({ q: "Titik kosong ke-" + (bi + 1), ok: okk, given: inputs[bi].value || "—", correct: b.answer, correctAnswer: true });
        });
      } else if (q.type === "short") {
        const inp = $(`[data-short="${qi}"]`);
        const val = (inp.value || "").trim().toLowerCase();
        const okk = val === q.answer.toLowerCase() || (q.alt || []).some((a) => val === a.toLowerCase() || val.includes(a.toLowerCase()));
        total++;
        if (okk) correct++;
        details.push({ q: q.q, ok: okk, given: inp.value || "—", correct: q.answer, correctAnswer: true });
      }
    });

    const pct = Math.round((correct / total) * 100);
    saveResult("reading", ex.title, pct, correct, total);
    renderResult($("#readResult"), pct, correct, total, details, "reading", ex.id, ex.level);
  }

  /* ---------- Listening ---------- */
  function renderListening(id) {
    const ex = listeningById(id);
    if (!ex) { go("skill/listening"); return; }
    const lv = LEVEL_MAP[ex.level];
    $("#topbarTitle").textContent = "Listening — " + ex.title;

    $("#view").innerHTML = `
      <div class="card">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="level-chip" style="background:${lv.color}">${lv.icon} ${lv.name}</span>
          <h2 style="margin:0;flex:1">${esc(ex.title)}</h2>
        </div>
        <p class="muted">${esc(ex.intro)}</p>
      </div>
      <div class="card" style="margin-top:16px">
        <div class="audio-bar">
          <button class="tts-btn" id="playBtn" title="Putar audio">▶</button>
          <div style="flex:1">
            <strong>Audio simulasi (TTS)</strong>
            <div class="muted" style="font-size:13px">Tekan ▶ untuk mendengarkan. Dengarkan sekali, lalu jawab soal.</div>
          </div>
          <button class="btn sm" id="transcriptBtn">Lihat Transkrip</button>
        </div>
        <div id="transcript" class="passage" style="margin-top:14px;display:none;white-space:pre-line">${esc(ex.script.trim())}</div>
      </div>
      <div class="card" style="margin-top:16px">
        <h3>❓ Pertanyaan</h3>
        ${ex.questions.map((q, qi) => qBlock(q, qi, ex)).join("")}
        <div style="margin-top:20px;display:flex;gap:10px">
          <button class="btn primary lg" id="checkListening">Periksa Jawaban</button>
          <button class="btn" id="resetListening">Reset</button>
        </div>
        <div id="listenResult"></div>
      </div>`;

    $("#playBtn").onclick = () => tts.speaking ? tts.stop() : tts.speak(ex.script);
    $("#transcriptBtn").onclick = () => {
      const btn = $("#transcriptBtn");
      const t = $("#transcript");
      const show = t.style.display === "none";
      t.style.display = show ? "block" : "none";
      btn.textContent = show ? "Sembunyikan Transkrip" : "Lihat Transkrip";
    };
    $("#checkListening").onclick = () => gradeListening(ex);
    $("#resetListening").onclick = () => renderListening(id);
  }

  function gradeListening(ex) {
    let total = 0, correct = 0;
    const details = [];
    ex.questions.forEach((q, qi) => {
      if (q.type === "mcq") {
        const sel = $(`input[name="q${qi}"]:checked`);
        const given = sel ? parseInt(sel.value, 10) : -1;
        const ok = given === q.answer;
        total++;
        if (ok) correct++;
        details.push({ q: q.q, ok, given: given >= 0 ? q.options[given] : "—", correct: q.options[q.answer], correctAnswer: true });
      } else if (q.type === "tfng") {
        const sel = $(`input[name="q${qi}"]:checked`);
        const given = sel ? sel.value : "";
        const ok = given === q.answer;
        total++;
        if (ok) correct++;
        details.push({ q: q.q, ok, given: given ? given.toUpperCase() : "—", correct: q.answer.toUpperCase(), correctAnswer: true });
      } else if (q.type === "fill") {
        const inputs = $$(`[data-fill]`);
        q.blanks.forEach((b, bi) => {
          const val = (inputs[bi].value || "").trim().toLowerCase();
          const okk = val === b.answer.toLowerCase() || (b.alt || []).some((a) => val === a.toLowerCase());
          total++;
          if (okk) correct++;
          details.push({ q: "Titik kosong ke-" + (bi + 1), ok: okk, given: inputs[bi].value || "—", correct: b.answer, correctAnswer: true });
        });
      } else if (q.type === "short") {
        const inp = $(`[data-short="${qi}"]`);
        const val = (inp.value || "").trim().toLowerCase();
        const okk = val === q.answer.toLowerCase() || (q.alt || []).some((a) => val === a.toLowerCase() || val.includes(a.toLowerCase()));
        total++;
        if (okk) correct++;
        details.push({ q: q.q, ok: okk, given: inp.value || "—", correct: q.answer, correctAnswer: true });
      }
    });
    const pct = Math.round((correct / total) * 100);
    saveResult("listening", ex.title, pct, correct, total);
    renderResult($("#listenResult"), pct, correct, total, details, "listening", ex.id, ex.level);
  }

  function saveResult(skill, title, pct, correct, total) {
    S.record((d) => {
      d.results[skill + "/" + Date.now()] = { skill, title, pct, correct, total, at: Date.now() };
      return d;
    });
  }

  function recordPractice(comp, pct, correct, total) {
    S.record((d) => {
      const st = d.practiceStats[comp] || { attempts: 0, best: 0, last: 0, correct: 0, total: 0 };
      st.attempts++;
      st.last = pct;
      if (pct > st.best) st.best = pct;
      st.correct += correct;
      st.total += total;
      d.practiceStats[comp] = st;
      return d;
    });
    syncSidebar();
  }

  function renderResult(container, pct, correct, total, details, type, id, level) {
    const band = bandFromPct(pct);
    const passed = pct >= 50;
    if (passed) markSkillDone(type, id);
    container.innerHTML = `
      <div class="result-summary card" style="margin-top:18px">
        <div class="result-score" style="color:${passed ? "var(--green)" : "var(--red)"}">${pct}%</div>
        <div class="muted">Benar ${correct} dari ${total} soal</div>
        <div style="margin:8px 0"><span class="level-chip" style="background:var(--accent)">Estimasi band: ${band}</span></div>
        <div class="muted">${passed ? "🎉 Bagus! Latihan ditandai selesai." : "Terus berlatih — coba lagi untuk hasil lebih baik."}</div>
        <div style="margin-top:14px">
          <button class="btn sm primary" onclick="location.hash='#/exercise/${type}/${id}'">Coba Lagi</button>
          <button class="btn sm" onclick="location.hash='#/skill/${type}'">Latihan Lain</button>
        </div>
      </div>
      <div class="card" style="margin-top:16px">
        <h3>Review Jawaban</h3>
        ${details.map((dl) => `
          <div class="review-row">
            <div style="font-weight:600">${esc(dl.q)}</div>
            <div class="${dl.ok ? "feedback-correct" : "feedback-wrong"}">${dl.ok ? "✓ Benar" : "✗ Salah"} — Jawaban Anda: ${esc(dl.given)}</div>
            ${!dl.ok ? `<div class="muted">Jawaban benar: ${esc(dl.correct)}</div>` : ""}
          </div>`).join("")}
      </div>`;

    /* highlight wrong question blocks */
    details.forEach((dl, i) => {
      if (!dl.ok) {
        const q = container.querySelector(`[data-q]`);
        /* no-op: tetap tampil di review */
      }
    });
    container.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ---------- Writing ---------- */
  function renderWriting(id) {
    const ex = writingById(id);
    if (!ex) { go("skill/writing"); return; }
    const lv = LEVEL_MAP[ex.level];
    $("#topbarTitle").textContent = "Writing Task " + ex.taskType;
    const done = isSkillDone("writing", ex.id);

    $("#view").innerHTML = `
      <div class="card">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="level-chip" style="background:${lv.color}">${lv.icon} ${lv.name}</span>
          <h2 style="margin:0;flex:1">${esc(ex.title)}</h2>
          <span class="muted">${ex.taskType === "1" ? "150 kata · 20 menit" : "250 kata · 40 menit"}</span>
        </div>
        <div style="margin-top:14px" class="info-box">${ex.promptHTML}</div>
      </div>

      <div class="card" style="margin-top:16px">
        <h3>✍️ Tulis Draf Anda</h3>
        <textarea id="draft" rows="12" style="width:100%;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:12px;padding:14px;font-size:15px;line-height:1.6" placeholder="Tulis jawaban Anda di sini…"></textarea>
        <div id="wc" class="muted" style="margin-top:8px"></div>
        <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn" id="timerBtn">⏱️ Mulai Timer (${ex.taskType === "1" ? "20" : "40"} menit)</button>
          <button class="btn primary" id="sampleBtn">Lihat Contoh Jawaban</button>
          <button class="btn green" id="doneWriting">${done ? "Selesai ✓" : "Tandai Selesai"}</button>
        </div>
        <div id="timerWrap"></div>
      </div>

      <div class="card" style="margin-top:16px;display:none" id="sampleCard">
        <h3>📝 Contoh Jawaban (Band Tinggi)</h3>
        <div class="passage">${ex.sample}</div>
      </div>

      <div class="card" style="margin-top:16px">
        <h3>✅ Checklist Evaluasi Diri</h3>
        ${ex.checklist.map((c, i) => `
          <div class="option"><label><input type="checkbox" class="check-item" data-i="${i}"> <span>${esc(c)}</span></label></div>`).join("")}
        <div id="checkScore" style="margin-top:12px"></div>
      </div>

      <div class="card" style="margin-top:16px">
        <h3>💡 Tips</h3>
        <ul>${ex.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </div>`;

    let timerInt = null;
    $("#timerBtn").onclick = () => {
      const mins = ex.taskType === "1" ? 20 : 40;
      let sec = mins * 60;
      if (timerInt) clearInterval(timerInt);
      $("#timerWrap").innerHTML = `<div class="timer-wrap card" style="margin-top:14px"><div class="timer-disp" id="clock">${fmt(sec)}</div><div class="muted">Sisa waktu</div></div>`;
      timerInt = setInterval(() => {
        sec--;
        const cl = $("#clock");
        if (!cl) { clearInterval(timerInt); return; }
        cl.textContent = fmt(sec);
        if (sec <= 0) { clearInterval(timerInt); cl.textContent = "Waktu habis!"; }
      }, 1000);
    };
    $("#sampleBtn").onclick = () => {
      const c = $("#sampleCard");
      c.style.display = c.style.display === "none" ? "block" : "none";
    };
    $("#doneWriting").onclick = () => {
      markSkillDone("writing", ex.id);
      toast("✅ Ditandai selesai!");
      $("#doneWriting").textContent = "Selesai ✓";
    };
    $$(".check-item").forEach((cb) => {
      cb.onchange = () => {
        const n = $$(".check-item:checked").length;
        const totalItems = $$(".check-item").length;
        $("#checkScore").innerHTML = `<div class="result-score" style="font-size:30px;color:var(--accent)">${n}/${totalItems}</div><div class="muted">Centang checklist untuk mengecek struktur tulisan Anda.</div>`;
      };
    });
    attachWc("#draft", "#wc", ex.taskType === "1" ? 150 : 250);
  }

  function fmt(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  /* Penghitung kata untuk area menulis */
  function attachWc(inputSel, outSel, minWords) {
    const inp = $(inputSel), out = $(outSel);
    if (!inp || !out) return;
    const update = () => {
      const n = (inp.value.trim().match(/\S+/g) || []).length;
      const ok = n >= minWords;
      out.innerHTML = `Kata: <strong style="color:${ok ? "var(--green)" : "var(--amber)"}">${n}</strong> <span class="muted">/ minimal ${minWords}</span>` + (ok ? " ✅" : "");
    };
    inp.addEventListener("input", update);
    update();
  }

  /* ---------- Speaking ---------- */
  function renderSpeaking(id) {
    const ex = speakingById(id);
    if (!ex) { go("skill/speaking"); return; }
    const lv = LEVEL_MAP[ex.level];
    $("#topbarTitle").textContent = "Speaking Part " + ex.part;
    const done = isSkillDone("speaking", ex.id);

    $("#view").innerHTML = `
      <div class="card">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="level-chip" style="background:${lv.color}">${lv.icon} ${lv.name}</span>
          <h2 style="margin:0;flex:1">${esc(ex.title)}</h2>
        </div>
        <p class="muted">${esc(ex.intro)}</p>
      </div>

      ${ex.cueCard ? `
      <div class="card" style="margin-top:16px">
        <div class="cuecard">
          <div class="cue-topic">${esc(ex.cueCard.topic)}</div>
          <div class="muted">Anda harus membahas:</div>
          <ul>${ex.cueCard.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        </div>
        <div style="margin-top:12px;display:flex;gap:10px">
          <button class="btn" id="cueTimer">⏱️ Timer Persiapan (1 menit)</button>
          <button class="btn primary" id="speakTimer">🗣️ Timer Berbicara (2 menit)</button>
        </div>
        <div id="cueTimerWrap" style="margin-top:12px"></div>
      </div>` : ""}

      ${ex.questions ? `
      <div class="card" style="margin-top:16px">
        <h3>❓ Pertanyaan</h3>
        ${ex.questions.map((q, i) => `<div class="qa-item"><div class="q">${i + 1}. ${esc(q)}</div></div>`).join("")}
        <div style="margin-top:12px;display:flex;gap:10px">
          <button class="btn" id="qTimer">⏱️ Timer Jawab (1 menit/soal)</button>
        </div>
        <div id="qTimerWrap" style="margin-top:12px"></div>
      </div>` : ""}

      <div class="card" style="margin-top:16px">
        <h3>🎯 Contoh Band Tinggi</h3>
        ${Object.entries(ex.sampleBand).map(([band, txt]) => `
          <div class="review-row">
            <span class="level-chip" style="background:${band === "9" ? "var(--purple)" : band === "7" ? "var(--accent)" : "var(--muted)"};margin-bottom:6px">Band ${band}</span>
            <div class="muted" style="margin-top:6px">${esc(txt)}</div>
          </div>`).join("")}
      </div>

      <div class="card" style="margin-top:16px">
        <h3>💡 Tips</h3>
        <ul>${ex.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        <button class="btn green" id="doneSpeaking" style="margin-top:8px">${done ? "Selesai ✓" : "Tandai Selesai"}</button>
      </div>`;

    const attachTimer = (btnId, wrapId, seconds, label) => {
      $(btnId).onclick = () => {
        let sec = seconds;
        $(wrapId).innerHTML = `<div class="timer-wrap card"><div class="timer-disp" id="clockX">${fmt(sec)}</div><div class="muted">${label}</div></div>`;
        const int = setInterval(() => {
          sec--;
          const cl = $("#clockX");
          if (!cl) { clearInterval(int); return; }
          cl.textContent = fmt(sec);
          if (sec <= 0) { clearInterval(int); cl.textContent = "⏰ Waktu habis!"; }
        }, 1000);
      };
    };
    if ($("#cueTimer")) attachTimer("#cueTimer", "#cueTimerWrap", 60, "Persiapan");
    if ($("#speakTimer")) attachTimer("#speakTimer", "#cueTimerWrap", 120, "Berbicara");
    if ($("#qTimer")) attachTimer("#qTimer", "#qTimerWrap", 60, "Jawab");
    $("#doneSpeaking").onclick = () => { markSkillDone("speaking", ex.id); toast("✅ Ditandai selesai!"); $("#doneSpeaking").textContent = "Selesai ✓"; };

    /* Fitur rekam + interpretasi */
    const refText = ex.cueCard ? ex.cueCard.topic : (ex.questions || []).join(" ");
    appendRecorder(ex.questions || [], ex.cueCard ? ex.cueCard.topic : "");
    if (ex.questions && ex.questions.length) appendGuided(ex.questions);
  }

  /* ============================================================
     Fitur Rekam + Speech-to-Text + Interpretasi (Speaking)
     ============================================================ */
  function appendRecorder(questions, cueTopic) {
    const view = $("#view");
    if (!view) return;
    const card = document.createElement("div");
    card.className = "card";
    card.style.marginTop = "16px";
    card.style.marginBottom = "16px";
    card.innerHTML = `
      <h3>🎙️ Simulasi Bicara & Analisis</h3>
      <p class="muted">Tekan rekam, bicaralah, dan aplikasi akan menyalin ucapan Anda lalu memberi analisis indikatif.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <button class="btn primary" id="recBtn">🎙️ Mulai Rekam</button>
        <button class="btn" id="playRec" disabled>▶ Putar Rekaman</button>
        <button class="btn" id="stopRec" disabled>⏹ Berhenti</button>
        <button class="btn ghost" id="clearRec">✖ Bersihkan</button>
      </div>
      <div class="muted" style="margin-top:10px;font-size:13px" id="recStatus">Status: siap.</div>
      <div class="info-box" style="margin-top:12px">
        <label class="muted" style="display:block;margin-bottom:6px">📝 Transkrip ucapan Anda:</label>
        <textarea id="recTranscript" rows="5" style="width:100%;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:10px;padding:10px" placeholder="Jawaban Anda akan muncul di sini secara otomatis (Chrome/Edge) atau bisa diketik manual."></textarea>
      </div>
      <div id="recAnalysis" style="margin-top:12px"></div>
    `;
    view.appendChild(card);

    const recBtn = card.querySelector("#recBtn");
    const playRec = card.querySelector("#playRec");
    const stopRecBtn = card.querySelector("#stopRec");
    const clearRec = card.querySelector("#clearRec");
    const status = card.querySelector("#recStatus");
    const transcript = card.querySelector("#recTranscript");
    const analysis = card.querySelector("#recAnalysis");

    let mediaRecorder = null, chunks = [], recordedBlob = null, recordedUrl = null;
    let recognition = null, finalTranscript = "", interimTranscript = "";
    let startTime = 0, recMs = 0;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const hasSTT = !!SR;

    /* --- Analisis --- */
    function analyze(text, durMs) {
      const words = text.trim().split(/\s+/).filter(Boolean);
      const wc = words.length;
      const fillers = ["um", "uh", "erm", "hmm", "you know", "like", "er"];
      let fillerCount = 0;
      const lower = text.toLowerCase();
      fillers.forEach((f) => { const re = new RegExp("\\b" + f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "g"); const m = lower.match(re); if (m) fillerCount += m.length; });
      const unique = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z']/g, "")));
      const minutes = durMs ? durMs / 60000 : (wc ? wc / 120 : 0.5);
      const wpm = Math.round(wc / Math.max(minutes, 0.01));

      /* kesesuaian topik: berapa kata kunci dari pertanyaan muncul? */
      let kwHits = 0;
      const kw = [];
      const refText = (cueTopic || "") + " " + (questions || []).join(" ");
      refText.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length > 3).forEach((w) => { if (lower.includes(w)) kw.push(w); });
      kwHits = new Set(kw).size;

      /* polanya kesalahan umum grammar */
      let errors = [];
      const gs = [
        [/ I am agree /g, "I agree"],
        [/ she go /g, "she goes"],
        [/ he go /g, "he goes"],
        [/ they is /g, "they are"],
        [/ we is /g, "we are"],
        [/ it are /g, "it is"],
        [/ I doesn't /g, "I don't"],
        [/ I don't knows /g, "I don't know"],
        [/ more better /g, "better"],
        [/ more easier /g, "easier"],
      ];
      gs.forEach(([re, fix]) => { if (re.test(lower)) errors.push(fix); });

      /* Skor indikatif 0-100 */
      let score = 20;
      if (wc >= 5) score += 15;
      if (wc >= 20) score += 10;
      if (wc >= 40) score += 10;
      if (wpm >= 90 && wpm <= 160) score += 15; else if (wpm > 0) score += 6;
      if (fillerCount <= 1) score += 10; else if (fillerCount <= 3) score += 5;
      if (kwHits >= 2) score += 10; else if (kwHits >= 1) score += 5;
      if (errors.length === 0 && wc >= 20) score += 10; else if (errors.length === 0) score += 4;
      score = Math.min(100, Math.max(0, score));

      const band = bandFromPct(score);
      analysis.innerHTML = `
        <h4 style="margin-bottom:10px">📊 Analisis Indikatif</h4>
        <div class="grid cols-3">
          <div class="stat" style="margin:0;padding:12px"><div class="num" style="font-size:22px">${wc}</div><div class="lbl">Total kata</div></div>
          <div class="stat" style="margin:0;padding:12px"><div class="num" style="font-size:22px">${wpm}</div><div class="lbl">Kata/menit</div></div>
          <div class="stat" style="margin:0;padding:12px"><div class="num" style="font-size:22px;color:${score>=60?"var(--green)":"var(--amber)"}">${score}</div><div class="lbl">Skor indikatif</div></div>
        </div>
        <div style="margin-top:12px">
          <span class="level-chip" style="background:var(--accent)">Estimasi band: ${band}</span>
        </div>
        <ul style="margin-top:12px">
          <li>Jumlah kata unik: <strong>${unique.size}</strong></li>
          <li>Kata pengisi (um/uh): <strong>${fillerCount}</strong> ${fillerCount <= 1 ? "✅ bagus" : "— usahakan kurangi"}</li>
          <li>Kecocokan kata kunci topik: <strong>${kwHits}</strong> ${kwHits >= 2 ? "✅ sesuai topik" : "— usahakan sebutkan istilah topik"}</li>
          ${errors.length ? `<li>Pola yang perlu diperbaiki: <strong>${errors.slice(0,4).join(", ")}</strong></li>` : `<li>✅ Tidak terdeteksi pola kesalahan umum.</li>`}
        </ul>
        <div class="tip" style="margin-top:10px">💡 Analisis ini bersifat indikatif (panjang, kelancaran, kosakata, kecocokan topik). Untuk penilaian konten yang mendalam dibutuhkan AI berbasis server.</div>
      `;
    }

    /* --- MediaRecorder --- */
    function startRecording() {
      chunks = [];
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { status.textContent = "Status: browser tidak mendukung rekaman."; return; }
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        mediaRecorder.onstop = () => {
          recordedBlob = new Blob(chunks, { type: "audio/webm" });
          if (recordedUrl) URL.revokeObjectURL(recordedUrl);
          recordedUrl = URL.createObjectURL(recordedBlob);
          playRec.disabled = false;
          stream.getTracks().forEach((t) => t.stop());
        };
        mediaRecorder.start();
        startTime = Date.now();
        recBtn.disabled = true;
        stopRecBtn.disabled = false;
        status.textContent = "Status: merekam... bicaralah.";
      }).catch(() => { status.textContent = "Status: mikrofon ditolak / tidak tersedia."; });
    }

    function stopRecording() {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        recMs = Date.now() - startTime;
        recBtn.disabled = false;
        stopRecBtn.disabled = true;
        status.textContent = "Status: rekaman selesai.";
      }
    }

    function startSTT() {
      if (!hasSTT) return;
      recognition = new SR();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = true;
      finalTranscript = ""; interimTranscript = "";
      recognition.onresult = (e) => {
        interimTranscript = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) finalTranscript += r[0].transcript + " ";
          else interimTranscript += r[0].transcript;
        }
        transcript.value = (finalTranscript + interimTranscript).trim();
      };
      recognition.onend = () => { /* otomatis berhenti */ };
      recognition.start();
    }

    function stopSTT() { if (recognition) { try { recognition.stop(); } catch (e) {} } }

    recBtn.onclick = () => {
      if (!hasSTT) status.textContent = "Status: Speech-to-Text tidak didukung di browser ini (gunakan Chrome/Edge).";
      startRecording();
      startSTT();
    };
    stopRecBtn.onclick = () => { stopRecording(); stopSTT(); if (transcript.value.trim()) analyze(transcript.value, recMs); };
    playRec.onclick = () => { if (recordedUrl) { const a = new Audio(recordedUrl); a.play(); } };
    clearRec.onclick = () => { transcript.value = ""; analysis.innerHTML = ""; finalTranscript = ""; status.textContent = "Status: siap."; };

    transcript.addEventListener("input", () => {
      if (transcript.value.trim() && !mediaRecorder) analyze(transcript.value, recMs);
    });

    status.textContent = hasSTT ? "Status: siap. Gunakan Chrome/Edge untuk transkrip otomatis." : "Status: siap (transkrip manual di Chrome/Edge otomatis).";
  }

  /* ============================================================
     Guided Speaking: pertanyaan audio muncul bertahap
     (pernyaan → jawab/rekam → pertanyaan berikutnya)
     ============================================================ */
  function appendGuided(questions) {
    const view = $("#view");
    if (!view) return;
    const card = document.createElement("div");
    card.className = "card";
    card.style.marginTop = "16px";
    card.style.marginBottom = "16px";
    card.innerHTML = `
      <h3>🧭 Latihan Terpandu (Berkesinambungan)</h3>
      <p class="muted">Masing-masing pertanyaan dibacakan (audio). Jawab/rekam, lalu lanjut ke pertanyaan berikutnya.</p>
      <div class="qblock">
        <div class="qleading" id="gqCount">Pertanyaan 1 / ${questions.length}</div>
        <div class="info-box" id="gqText" style="font-size:16px"></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
          <button class="tts-btn" id="gqPlay" title="Dengar pertanyaan">▶</button>
          <button class="btn primary" id="gRecBtn">🎙️ Mulai Rekam</button>
          <button class="btn" id="gStopBtn" disabled>⏹ Berhenti</button>
          <button class="btn" id="gNextBtn" disabled>Soal Berikutnya →</button>
        </div>
        <div class="muted" style="margin-top:8px;font-size:13px" id="gStatus">Status: siap.</div>
        <div style="margin-top:10px">
          <label class="muted" style="display:block;margin-bottom:4px">📝 Jawaban Anda (transkrip):</label>
          <textarea id="gTranscript" rows="4" style="width:100%;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:10px;padding:10px" placeholder="Jawaban Anda akan muncul di sini (Chrome/Edge) atau bisa diketik manual."></textarea>
        </div>
        <div id="gAnalysis" style="margin-top:10px"></div>
      </div>
    `;
    view.appendChild(card);

    let qi = 0;
    const gqText = card.querySelector("#gqText");
    const gqCount = card.querySelector("#gqCount");
    const gqPlay = card.querySelector("#gqPlay");
    const gRecBtn = card.querySelector("#gRecBtn");
    const gStopBtn = card.querySelector("#gStopBtn");
    const gNextBtn = card.querySelector("#gNextBtn");
    const gStatus = card.querySelector("#gStatus");
    const gTranscript = card.querySelector("#gTranscript");
    const gAnalysis = card.querySelector("#gAnalysis");

    let mediaRecorder = null, chunks = [], recordedUrl = null;
    let recognition = null, finalT = "";
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const hasSTT = !!SR;

    function showQ() {
      const q = questions[qi];
      gqCount.textContent = "Pertanyaan " + (qi + 1) + " / " + questions.length + (qi === questions.length - 1 ? " (terakhir)" : "");
      gqText.innerHTML = esc(q);
      gTranscript.value = ""; finalT = "";
      gAnalysis.innerHTML = "";
      gNextBtn.disabled = true;
      gStatus.textContent = "Status: siap. Tekan ▶ untuk mendengar pertanyaan.";
    }

    function analyzeGuided() {
      const text = gTranscript.value.trim();
      if (!text) return;
      const words = text.split(/\s+/).filter(Boolean);
      const wc = words.length;
      const wpm = Math.round(wc / Math.max((wc ? wc / 120 : 0.5), 0.01));
      let score = 20;
      if (wc >= 5) score += 15;
      if (wc >= 20) score += 15;
      if (wpm >= 90 && wpm <= 160) score += 15; else if (wpm > 0) score += 6;
      if (wc >= 20) score += 10;
      score = Math.min(100, Math.max(0, score));
      gAnalysis.innerHTML = `
        <div class="grid cols-3">
          <div class="stat" style="margin:0;padding:12px"><div class="num" style="font-size:20px">${wc}</div><div class="lbl">Kata</div></div>
          <div class="stat" style="margin:0;padding:12px"><div class="num" style="font-size:20px">${wpm}</div><div class="lbl">Kata/menit</div></div>
          <div class="stat" style="margin:0;padding:12px"><div class="num" style="font-size:20px;color:var(--accent)">${score}</div><div class="lbl">Skor indikatif</div></div>
        </div>
        <div style="margin-top:8px"><span class="level-chip" style="background:var(--accent)">Estimasi band: ${bandFromPct(score)}</span></div>`;
    }

    function startGRec() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { gStatus.textContent = "Status: rekaman tidak didukung."; return; }
      chunks = [];
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        mediaRecorder.onstop = () => { stream.getTracks().forEach((t) => t.stop()); };
        mediaRecorder.start();
        gRecBtn.disabled = true;
        gStopBtn.disabled = false;
        gStatus.textContent = "Status: merekam...";
        if (hasSTT) {
          recognition = new SR();
          recognition.lang = "en-US";
          recognition.interimResults = true;
          recognition.continuous = true;
          finalT = "";
          recognition.onresult = (e) => {
            let inter = "";
            for (let i = e.resultIndex; i < e.results.length; i++) {
              const r = e.results[i];
              if (r.isFinal) finalT += r[0].transcript + " ";
              else inter += r[0].transcript;
            }
            gTranscript.value = (finalT + inter).trim();
          };
          recognition.start();
        }
      }).catch(() => { gStatus.textContent = "Status: mikrofon ditolak."; });
    }

    function stopGRec() {
      if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
      if (recognition) { try { recognition.stop(); } catch (e) {} }
      gRecBtn.disabled = false;
      gStopBtn.disabled = true;
      gStatus.textContent = "Status: rekaman selesai. Bisa lanjut ke soal berikutnya.";
      analyzeGuided();
      gNextBtn.disabled = false;
    }

    gqPlay.onclick = () => tts.speak(questions[qi] + ". Please answer this question.");
    gRecBtn.onclick = startGRec;
    gStopBtn.onclick = stopGRec;
    gNextBtn.onclick = () => { if (qi < questions.length - 1) { qi++; showQ(); } else { gNextBtn.disabled = true; gStatus.textContent = "Status: semua pertanyaan selesai. 🎉"; } };
    gTranscript.addEventListener("input", () => { if (gTranscript.value.trim()) { gNextBtn.disabled = false; } });

    showQ();
  }

  /* ============================================================
     VOCABULARY
     ============================================================ */
  routes.vocab = () => {
    $("#topbarTitle").textContent = "Vocabulary";
    $("#view").innerHTML = `
      <h1>📚 Vocabulary</h1>
      <p class="muted">Pelajari kosakata per topik & level. Setiap set punya mode belajar (kartu) dan kuis.</p>
      ${LEVELS.map((lv) => {
        const sets = VOCAB_SETS.filter((v) => v.level === lv.id);
        if (!sets.length) return "";
        return `
          <h2 style="margin-top:22px">${lv.icon} ${lv.name} <span class="muted" style="font-size:14px">(${lv.band})</span></h2>
          <div class="grid cols-2">
            ${sets.map((set) => {
              const learned = (S.data().vocab[set.id] || []).length;
              return `
                <div class="card set-card" onclick="location.hash='#/vocab/${set.id}'">
                  <div style="display:flex;align-items:center;gap:10px">
                    <span style="font-size:26px">📘</span>
                    <div style="flex:1">
                      <div style="font-weight:700">${esc(set.topic)}</div>
                      <div class="muted" style="font-size:13px">${set.words.length} kata · ${learned}/${set.words.length} dipelajari</div>
                    </div>
                    <span>→</span>
                  </div>
                </div>`;
            }).join("")}
          </div>`;
      }).join("")}
      <p class="tip" style="margin-top:20px">💡 Klik sebuah set untuk membuka kartu belajar & kuis.</p>`;
  };

  routes.vocabSet = (params) => {
    const set = vocabById(params[0]);
    if (!set) { go("vocab"); return; }
    const lv = LEVEL_MAP[set.level];
    $("#topbarTitle").textContent = set.topic;

    $("#view").innerHTML = `
      <div class="card">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="level-chip" style="background:${lv.color}">${lv.icon} ${lv.name}</span>
          <h2 style="margin:0;flex:1">${esc(set.topic)}</h2>
          <button class="btn" onclick="location.hash='#/vocab'">← Semua Set</button>
        </div>
        <p class="muted">${set.words.length} kata. Gunakan kartu untuk belajar, lalu uji diri dengan kuis.</p>
        <div style="margin-top:12px;display:flex;gap:10px">
          <button class="btn primary" id="studyBtn">🃏 Belajar dengan Kartu</button>
          <button class="btn green" id="quizBtn">⚡ Mulai Kuis</button>
        </div>
      </div>
      <div id="vocabArea" style="margin-top:16px"></div>`;

    $("#studyBtn").onclick = () => studyMode(set);
    $("#quizBtn").onclick = () => quizMode(set);
  };

  function studyMode(set) {
    const area = $("#vocabArea");
    let idx = 0, flipped = false;
    area.innerHTML = `
      <div class="card">
        <div class="flashcard" id="fc">
          <div class="fc-hint">Klik kartu untuk membalik</div>
          <div id="fcFront" class="fc-word">${esc(set.words[0].w)}</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:18px">
          <button class="btn" id="prevK">← Sebelumnya</button>
          <span class="muted" id="fcProg">${idx + 1} / ${set.words.length}</span>
          <button class="btn primary" id="nextK">Berikutnya →</button>
        </div>
        <div style="display:flex;justify-content:center;gap:10px;margin-top:14px">
          <button class="btn sm primary" id="saveLearned">💾 Simpan</button>
          <button class="btn sm" id="goQuiz">⚡ Kuis</button>
        </div>
      </div>`;

    const fc = $("#fc");

    const isLearned = () => (S.data().vocab[set.id] || []).includes(idx);

    const setLearned = (val) => {
      S.record((d) => {
        if (!d.vocab[set.id]) d.vocab[set.id] = [];
        if (val) {
          if (!d.vocab[set.id].includes(idx)) d.vocab[set.id].push(idx);
        } else {
          d.vocab[set.id] = d.vocab[set.id].filter((i) => i !== idx);
        }
        return d;
      });
      toast(val ? "✅ Ditandai sudah dipahami" : "Batal tandai");
    };

    const renderCard = () => {
      const w = set.words[idx];
      const checkMark = `<label class="fc-learn" title="Tandai sudah dipahami"><input type="checkbox" id="mkLearned"></label>`;
      if (!flipped) {
        fc.innerHTML = `
          <div class="fc-hint">Klik kartu untuk membalik</div>
          ${checkMark}
          <div class="fc-word">${esc(w.w)}</div>`;
      } else {
        fc.innerHTML = `
          ${checkMark}
          <div class="fc-back">
            <div style="font-weight:800;font-size:20px;color:var(--accent)">${esc(w.w)}</div>
            <div style="margin-top:10px">${esc(w.meaning)}</div>
            <div class="fc-ex">"${esc(w.example)}"</div>
          </div>`;
      }
      $("#fcProg").textContent = (idx + 1) + " / " + set.words.length;
      const cb = $("#mkLearned");
      if (cb) {
        cb.checked = isLearned();
        cb.onclick = (e) => { e.stopPropagation(); };
        cb.onchange = () => setLearned(cb.checked);
      }
    };

    fc.onclick = () => { flipped = !flipped; renderCard(); };
    $("#nextK").onclick = () => { if (idx < set.words.length - 1) { idx++; flipped = false; renderCard(); } };
    $("#prevK").onclick = () => { if (idx > 0) { idx--; flipped = false; renderCard(); } };
    $("#saveLearned").onclick = () => {
      const cb = $("#mkLearned");
      if (cb) setLearned(cb.checked);
      toast("💾 Progress tersimpan");
    };
    $("#goQuiz").onclick = () => quizMode(set);
    renderCard();
  }

  function quizMode(set) {
    const area = $("#vocabArea");
    const n = Math.min(6, set.words.length);
    const pool = set.words.slice();
    // acak & ambil n
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, n);
    const allWords = set.words.map((w) => w.w);
    let qi = 0, correct = 0;
    const answers = [];
    const log = [];

    const renderQ = () => {
      if (qi >= shuffled.length) {
        const pct = Math.round((correct / shuffled.length) * 100);
        const reviewHtml = log.map((r, ix) => `
          <div class="review-row">
            <div style="font-weight:600">${ix + 1}. ${esc(r.w)} — ${esc(r.meaning)}</div>
            <div class="${r.ok ? "feedback-correct" : "feedback-wrong"}">${r.ok ? "✓ Benar" : "✗ Salah"} ${r.got ? "— pilihan Anda: " + esc(r.got) : ""}</div>
          </div>`).join("");
        area.innerHTML = `
          <div class="card">
            <div class="result-summary">
              <div class="result-score" style="color:var(--green)">${correct}/${shuffled.length}</div>
              <div class="muted">Skor kuis: ${pct}%</div>
              <div style="margin-top:12px">
                <button class="btn primary sm" id="again">Ulangi Kuis</button>
                <button class="btn sm" id="back">Kembali</button>
              </div>
            </div>
            <div style="border-top:1px solid var(--border);margin-top:14px;padding-top:6px">
              <h3>📋 Review & Pembahasan</h3>
              ${reviewHtml}
            </div>
          </div>`;
        $("#again").onclick = () => quizMode(set);
        $("#back").onclick = () => { $("#vocabArea").innerHTML = ""; };
        S.record((d) => { d.vocabQuiz[set.id] = pct; return d; });
        return;
      }
      const w = shuffled[qi];
      const options = shuffleArr([w.w, ...shuffleArr(allWords.filter((x) => x !== w.w)).slice(0, 3)]);
      area.innerHTML = `
        <div class="card">
          <div class="muted">Kuis ${set.topic} — soal ${qi + 1}/${shuffled.length}</div>
          <div style="font-size:20px;font-weight:700;margin:14px 0">Apa kata yang tepat untuk definisi berikut?</div>
          <div class="info-box" style="font-size:16px">"${esc(w.meaning)}"</div>
          <div style="margin-top:16px">
            ${options.map((o, oi) => `
              <div class="option"><label>
                <input type="radio" name="qz" value="${oi}"> <span>${esc(o)}</span>
              </label></div>`).join("")}
          </div>
          <div style="margin-top:14px;display:flex;gap:10px">
            <button class="btn primary" id="qzCheck">Jawab</button>
            <button class="btn" id="qzSkip">Lewati</button>
          </div>
          <div id="qzFeed" style="margin-top:12px"></div>
        </div>`;
      $("#qzCheck").onclick = () => {
        const sel = $('input[name="qz"]:checked');
        const feed = $("#qzFeed");
        if (!sel) { feed.innerHTML = `<span class="feedback-wrong">Pilih satu jawaban dulu.</span>`; return; }
        const got = options[parseInt(sel.value, 10)];
        const ok = got === w.w;
        if (ok) { correct++; feed.innerHTML = `<span class="feedback-correct">✓ Benar! "${esc(w.w)}"</span>`; }
        else feed.innerHTML = `<span class="feedback-wrong">✗ Salah. Jawaban: "${esc(w.w)}"</span>`;
        answers.push(ok);
        log.push({ w: w.w, meaning: w.meaning, got, ok });
        setTimeout(() => { qi++; renderQ(); }, 900);
        $("#qzCheck").disabled = true;
      };
      $("#qzSkip").onclick = () => { answers.push(false); log.push({ w: w.w, meaning: w.meaning, got: null, ok: false }); qi++; renderQ(); };
    };
    renderQ();
  }

  /* ============================================================
     GRAMMAR
     ============================================================ */
  routes.grammar = () => {
    $("#topbarTitle").textContent = "Grammar";
    $("#view").innerHTML = `
      <h1>🔤 Grammar</h1>
      <p class="muted">Pelajaran grammar relevan untuk IELTS, dikelompokkan per level.</p>
      ${LEVELS.map((lv) => {
        const lessons = GRAMMAR_LESSONS.filter((g) => g.level === lv.id);
        if (!lessons.length) return "";
        return `
          <h2 style="margin-top:20px">${lv.icon} ${lv.name}</h2>
          ${lessons.map((g) => `
            <div class="lesson-row" onclick="location.hash='#/grammar/${g.id}'">
              <span class="l-ico">🔤</span>
              <span class="l-title">${esc(g.title)}</span>
              <span class="l-status">→</span>
            </div>`).join("")}`;
      }).join("")}`;
  };

  routes.grammarLesson = (params) => {
    const g = grammarById(params[0]);
    if (!g) { go("grammar"); return; }
    const lv = LEVEL_MAP[g.level];
    $("#topbarTitle").textContent = g.title;

    $("#view").innerHTML = `
      <div class="card">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="level-chip" style="background:${lv.color}">${lv.icon} ${lv.name}</span>
          <h2 style="margin:0;flex:1">${esc(g.title)}</h2>
          <button class="btn" onclick="location.hash='#/grammar'">← Semua</button>
        </div>
        <div style="margin-top:14px">${g.body}</div>
      </div>
      ${g.quiz ? `
      <div class="card" style="margin-top:16px">
        <h3>⚡ Kuis Singkat</h3>
        ${g.quiz.map((q, qi) => `
          <div class="qblock">
            <div class="qleading">${qi + 1}. ${esc(q.q)}</div>
            ${q.options.map((o, oi) => `
              <div class="option"><label><input type="radio" name="gq${qi}" value="${oi}"> <span>${esc(o)}</span></label></div>`).join("")}
          </div>`).join("")}
        <button class="btn primary" id="checkGrammar">Periksa</button>
        <div id="grammarResult" style="margin-top:14px"></div>
      </div>` : ""}`;

    if (g.quiz) {
      $("#checkGrammar").onclick = () => {
        let correct = 0, total = g.quiz.length;
        let html = "";
        g.quiz.forEach((q, qi) => {
          const sel = $(`input[name="gq${qi}"]:checked`);
          const got = sel ? parseInt(sel.value, 10) : -1;
          const ok = got === q.answer;
          if (ok) correct++;
          html += `<div class="review-row">
            <div style="font-weight:600">${esc(q.q)}</div>
            <div class="${ok ? "feedback-correct" : "feedback-wrong"}">${ok ? "✓ Benar" : "✗ Salah — Jawaban benar: " + esc(q.options[q.answer])}</div>
          </div>`;
        });
        $("#grammarResult").innerHTML = `
          <div class="result-summary" style="border-top:1px solid var(--border);margin-top:14px;padding-top:14px">
            <div class="result-score" style="font-size:30px;color:var(--accent)">${correct}/${total}</div>
          </div>${html}`;
        S.record((d) => { d.grammar[g.id] = correct; return d; });
      };
    }
  };

  /* ============================================================
     PREMIUM / AKTIVASI
     ============================================================ */
  routes.premium = () => {
    $("#topbarTitle").textContent = "Premium";
    const active = hasPremium();
    $("#view").innerHTML = `
      <div class="card">
        <div style="text-align:center">
          <div style="font-size:48px">⭐</div>
          <h1>Premium IELTS Master</h1>
          <p class="muted">Buka semua level: Intermediate, Advanced & Expert — plus seluruh fitur lanjutan.</p>
          ${active ? `<div class="tip" style="display:inline-block">✅ Premium aktif. Terima kasih!</div>` : ""}
        </div>
        <div class="grid cols-4" style="margin-top:18px">
          ${APP_CONFIG.paidLevels.map((lvId) => {
            const lv = LEVEL_MAP[lvId];
            return `<div class="card" style="margin:0;text-align:center;padding:14px">
              <div style="font-size:26px">${lv.icon}</div>
              <div style="font-weight:800">${esc(lv.name)}</div>
              <div class="muted" style="font-size:12px">${lv.band}</div>
              <div style="margin-top:6px;font-size:18px">${active ? "✅" : "🔒"}</div>
            </div>`;
          }).join("")}
        </div>

        ${active ? "" : `
        <div style="margin-top:22px;border-top:1px solid var(--border);padding-top:18px">
          <h3>💳 Cara Aktivasi & Pembayaran</h3>
          <div class="info-box" style="margin-top:10px">
            <div style="font-size:26px;font-weight:800;color:var(--accent)">Rp 99.000</div>
            <div class="muted">Sekali bayar · berlaku selamanya (lifetime) · unlock semua level</div>
          </div>
          <ol style="margin-top:14px;line-height:2">
            <li>Transfer <strong>Rp 99.000</strong> ke rekening <strong>BNI 0317096975</strong> a.n. <strong>M. Askar</strong>.</li>
            <li>Kirim <strong>bukti transfer</strong> (screenshot/nomor referensi) ke email <strong><a href="mailto:askarnh@gmail.com">askarnh@gmail.com</a></strong> cc <strong><a href="mailto:askarnh@ymail.com">askarnh@ymail.com</a></strong>.</li>
            <li>Kode aktivasi akan dikirim balik ke email Anda.</li>
            <li>Masukkan kode di kolom di bawah untuk membuka premium.</li>
          </ol>
        </div>`}

        <div style="margin-top:22px;border-top:1px solid var(--border);padding-top:18px">
          <h3>Masukkan Kode Aktivasi</h3>
          ${active ? "" : `
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
            <input type="text" id="vipInput" placeholder="Mis. IELTSTS-XXXXXXXX-1" style="flex:1;min-width:220px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:10px;padding:10px 14px">
            <button class="btn primary" id="vipBtn">Aktivasi</button>
          </div>
          <div id="vipMsg" style="margin-top:8px"></div>`}
          <div class="muted" style="margin-top:12px;font-size:13px"><Bum punya kode? Hubungi pemilik aplikasi.</div>
        </div>
      </div>
      <div class="card" style="margin-top:16px">
        <h3>Admin — Generator Kode</h3>
        <p class="muted" style="font-size:13px">Khusus pemilik. Masukkan kata sandi admin untuk membuat kode aktivasi.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <input type="password" id="adminPass" placeholder="Kata sandi admin" style="flex:1;min-width:180px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:10px;padding:10px 14px">
          <button class="btn" id="adminLogin">Masuk</button>
        </div>
        <div id="adminArea" style="margin-top:14px"></div>
      </div>`;

    $("#vipBtn").onclick = () => {
      const code = $("#vipInput").value;
      const msg = $("#vipMsg");
      if (activateVip(code)) {
        msg.innerHTML = `<span class="feedback-correct">✅ Aktivasi berhasil! Semua level premium terbuka.</span>`;
        setTimeout(() => render(), 1200);
      } else {
        msg.innerHTML = `<span class="feedback-wrong">✗ Kode tidak valid. Periksa kembali.</span>`;
      }
    };

    $("#adminLogin").onclick = () => {
      const pass = $("#adminPass").value;
      const area = $("#adminArea");
      if (pass === APP_CONFIG.ADMIN_PASSWORD) {
        const codes = [];
        for (let i = 1; i <= 20; i++) codes.push(generateVipCode(i));
        area.innerHTML = `
          <div class="info-box">
            <div style="font-weight:700;margin-bottom:8px">20 kode siap dibagikan:</div>
            <div style="max-height:220px;overflow:auto;font-family:monospace;font-size:13px;line-height:1.7">${codes.map((c) => `<div>${c}</div>`).join("")}</div>
            <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn sm primary" id="copyCodes">📋 Salin Semua</button>
              <button class="btn sm" id="moreCodes">Generate 20 lagi</button>
            </div>
          </div>`;
        area._codes = codes;
        $("#copyCodes").onclick = () => {
          navigator.clipboard.writeText(codes.join("\n")).then(() => toast("✅ Kode disalin!")).catch(() => toast("Gagal menyalin"));
        };
        $("#moreCodes").onclick = () => {
          const start = area._codes.length + 1;
          const add = [];
          for (let i = start; i < start + 20; i++) add.push(generateVipCode(i));
          area._codes = area._codes.concat(add);
          const box = area.querySelector(".info-box div[style*='max-height']");
          box.innerHTML += add.map((c) => `<div>${c}</div>`).join("");
          $("#copyCodes").onclick = () => { navigator.clipboard.writeText(area._codes.join("\n")).then(() => toast("✅ Kode disalin!")).catch(() => toast("Gagal menyalin")); };
          toast("✅ 20 kode lagi ditambahkan");
        };
      } else {
        area.innerHTML = `<span class="feedback-wrong">✗ Kata sandi salah.</span>`;
      }
    };
  };

  /* ============================================================
     MOCK TEST (Simulasi)
     ============================================================ */
  const MOCK = {
    stage: 0,
    stages: ["listening", "reading", "writing", "speaking"],
    results: {},
    timers: [],
  };

  routes.mock = (params) => {
    if (params.length && params[0] === "start") { startMock(); return; }
    $("#topbarTitle").textContent = "Tes Simulasi";
    $("#view").innerHTML = `
      <div class="card hero">
        <div>
          <h1>⏱️ Tes Simulasi</h1>
          <p class="muted">Simulasi penuh: Listening → Reading → Writing → Speaking, dengan timer & estimasi band.</p>
        </div>
        <a class="btn primary lg" href="#/mock/start">Mulai Tes</a>
      </div>
      <div class="grid cols-4" style="margin-top:16px">
        ${MOCK.stages.map((s) => `
          <div class="card" style="margin:0;text-align:center">
            <div style="font-size:28px">${s === "listening" ? "🎧" : s === "reading" ? "📖" : s === "writing" ? "✍️" : "🗣️"}</div>
            <div class="lbl">${ucfirst(s)}</div>
          </div>`).join("")}
      </div>
      <div class="card" style="margin-top:16px">
        <h3>Informasi</h3>
        <ul>
          <li>Anda akan diberi ukuran waktu untuk Reading & Writing.</li>
          <li>Listening & Reading dinilai otomatis; Writing & Speaking dievaluasi mandiri.</li>
          <li>Estimasi band dihitung dari Listening + Reading.</li>
        </ul>
      </div>`;
  };

  function startMock() {
    MOCK.stage = 0;
    MOCK.results = {};
    MOCK.timers.forEach(clearInterval);
    MOCK.timers = [];
    mockRun();
  }

  function mockRun() {
    const stage = MOCK.stages[MOCK.stage];
    if (!stage) { mockResult(); return; }
    $("#topbarTitle").textContent = "Simulasi — " + ucfirst(stage);
    const prog = MOCK.stages.map((s, i) => `<span style="padding:6px 12px;border-radius:99px;background:${i < MOCK.stage ? "var(--green)" : i === MOCK.stage ? "var(--accent)" : "var(--card2)"};color:#06203a;font-weight:700">${i + 1}</span>`).join("<span style='margin:0 4px;color:var(--muted)'>→</span>");
    $("#view").innerHTML = `<div class="card" style="margin-bottom:16px"><div style="text-align:center">${prog}</div></div><div id="mockStage"></div>`;

    if (stage === "listening") {
      const ex = listeningById("le3");
      const lv = LEVEL_MAP[ex.level];
      $("#mockStage").innerHTML = `
        <div class="card">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
            <h3 style="margin:0">🎧 Listening</h3>
            <span class="level-chip" style="background:${lv.color}">${lv.name}</span>
          </div>
          <div class="audio-bar" style="margin-top:12px">
            <button class="tts-btn" id="mp">▶</button>
            <div class="muted">Dengarkan audio, lalu jawab soal di bawah.</div>
          </div>
        </div>
        <div class="card" style="margin-top:14px">
          ${ex.questions.map((q, qi) => qBlock(q, qi, ex)).join("")}
          <button class="btn primary lg" id="mNext" style="margin-top:14px">Lanjut → Reading</button>
        </div>`;
      $("#mp").onclick = () => tts.speaking ? tts.stop() : tts.speak(ex.script);
      $("#mNext").onclick = () => {
        /* grade listening via same logic */
        const res = gradeGeneric(ex, "listening");
        MOCK.results.listening = res;
        MOCK.stage++;
        mockRun();
      };
    } else if (stage === "reading") {
      const ex = readingById("re3");
      const lv = LEVEL_MAP[ex.level];
      let sec = 20 * 60;
      $("#mockStage").innerHTML = `
        <div class="card">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
            <h3 style="margin:0">📖 Reading</h3>
            <span class="level-chip" style="background:${lv.color}">${lv.name}</span>
            <span class="timer-disp" style="font-size:22px" id="rClock">20:00</span>
          </div>
        </div>
        <div class="read-split">
          <div class="read-questions">
            <div class="card">
              ${ex.questions.map((q, qi) => qBlock(q, qi, ex)).join("")}
              <button class="btn primary lg" id="mNext" style="margin-top:14px">Selesai & Lanjut → Writing</button>
            </div>
          </div>
          <div class="read-passage">
            <div class="card">
              <h3>📄 Passage</h3>
              <div class="passage">${ex.passageHTML}</div>
            </div>
          </div>
        </div>`;
      const int = setInterval(() => {
        sec--;
        const cl = $("#rClock");
        if (!cl) { clearInterval(int); return; }
        cl.textContent = fmt(sec);
        if (sec <= 0) { clearInterval(int); cl.textContent = "Habis"; }
      }, 1000);
      MOCK.timers.push(int);
      $("#mNext").onclick = () => {
        clearInterval(int);
        const res = gradeGeneric(ex, "reading");
        MOCK.results.reading = res;
        MOCK.stage++;
        mockRun();
      };
    } else if (stage === "writing") {
      const ex = WRITING_TASKS[1]; // task 2
      let sec = 40 * 60;
      $("#mockStage").innerHTML = `
        <div class="card">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
            <h3 style="margin:0">✍️ Writing Task 2</h3>
            <span class="timer-disp" style="font-size:22px" id="wClock">40:00</span>
          </div>
          <div style="margin-top:12px" class="info-box">${ex.promptHTML}</div>
        </div>
        <div class="card" style="margin-top:14px">
          <textarea id="draft" rows="12" style="width:100%;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:12px;padding:14px" placeholder="Tulis essay Anda di sini…"></textarea>
          <div style="margin-top:12px">
            <p class="muted">Evaluasi mandiri — centang yang sudah Anda lakukan:</p>
            ${ex.checklist.map((c, i) => `<div class="option"><label><input type="checkbox" class="wc"> <span>${esc(c)}</span></label></div>`).join("")}
          </div>
          <button class="btn primary lg" id="mNext" style="margin-top:14px">Lanjut → Speaking</button>
        </div>`;
      const int = setInterval(() => {
        sec--;
        const cl = $("#wClock");
        if (!cl) { clearInterval(int); return; }
        cl.textContent = fmt(sec);
        if (sec <= 0) { clearInterval(int); cl.textContent = "Habis"; }
      }, 1000);
      MOCK.timers.push(int);
      $("#mNext").onclick = () => {
        clearInterval(int);
        const nCheck = $$(".wc:checked").length;
        MOCK.results.writing = { pct: Math.round((nCheck / ex.checklist.length) * 100), correct: nCheck, total: ex.checklist.length };
        MOCK.stage++;
        mockRun();
      };
    } else if (stage === "speaking") {
      const ex = speakingById("sp4");
      $("#mockStage").innerHTML = `
        <div class="card">
          <h3>🗣️ Speaking</h3>
          <p class="muted">Pilih satu pertanyaan & berbicara 1–2 menit. Gunakan timer. Evaluasi kefasihan Anda sendiri.</p>
          ${ex.questions.map((q, i) => `<div class="qa-item"><div class="q">${i + 1}. ${esc(q)}</div></div>`).join("")}
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
            <button class="btn primary" id="spTimer">🗣️ Timer Berbicara (2 menit)</button>
          </div>
          <div id="spWrap" style="margin-top:12px"></div>
          <div style="margin-top:16px">
            <p class="muted">Seberapa fasih menurut Anda?</p>
            <select id="selfBand" style="background:var(--card);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:8px">
              <option value="6">Band 6 — cukup fasih</option>
              <option value="7" selected>Band 7 — fasih & jelas</option>
              <option value="8">Band 8 — sangat fasih</option>
              <option value="9">Band 9 — natural & lancar</option>
            </select>
          </div>
          <button class="btn primary lg" id="mNext" style="margin-top:14px">Lihat Hasil Simulasi</button>
        </div>`;
      $("#spTimer").onclick = () => {
        let sec = 120;
        $("#spWrap").innerHTML = `<div class="timer-wrap card"><div class="timer-disp" id="spClock">02:00</div></div>`;
        const int = setInterval(() => {
          sec--;
          const cl = $("#spClock");
          if (!cl) { clearInterval(int); return; }
          cl.textContent = fmt(sec);
          if (sec <= 0) { clearInterval(int); cl.textContent = "⏰ Habis"; }
        }, 1000);
        MOCK.timers.push(int);
      };
      $("#mNext").onclick = () => {
        const band = parseInt($("#selfBand").value, 10);
        MOCK.results.speaking = { pct: (band / 9) * 100, band };
        MOCK.stage++;
        mockRun();
      };
    }
  }

  function gradeGeneric(ex, type) {
    let total = 0, correct = 0;
    ex.questions.forEach((q, qi) => {
      if (q.type === "mcq") {
        const sel = $(`input[name="q${qi}"]:checked`);
        const got = sel ? parseInt(sel.value, 10) : -1;
        total++; if (got === q.answer) correct++;
      } else if (q.type === "tfng") {
        const sel = $(`input[name="q${qi}"]:checked`);
        const got = sel ? sel.value : "";
        total++; if (got === q.answer) correct++;
      } else if (q.type === "match") {
        const sels = $$(`[data-match]`);
        q.items.forEach((it, ii) => {
          const v = parseInt(sels[ii] ? sels[ii].value : "-1", 10);
          total++; if (v === it.correct) correct++;
        });
      } else if (q.type === "fill") {
        const inputs = $$(`[data-fill]`);
        q.blanks.forEach((b, bi) => {
          const val = (inputs[bi] ? inputs[bi].value : "").trim().toLowerCase();
          const okk = val === b.answer.toLowerCase() || (b.alt || []).some((a) => val === a.toLowerCase());
          total++; if (okk) correct++;
        });
      } else if (q.type === "short") {
        const inp = $(`[data-short="${qi}"]`);
        const val = (inp ? inp.value : "").trim().toLowerCase();
        const okk = val === q.answer.toLowerCase() || (q.alt || []).some((a) => val === a.toLowerCase() || val.includes(a.toLowerCase()));
        total++; if (okk) correct++;
      }
    });
    return { pct: Math.round((correct / total) * 100), correct, total };
  }

  function mockResult() {
    $("#topbarTitle").textContent = "Hasil Simulasi";
    MOCK.timers.forEach(clearInterval);
    const lr = MOCK.results.listening || { pct: 0 };
    const rr = MOCK.results.reading || { pct: 0 };
    const wr = MOCK.results.writing || { pct: 0 };
    const sr = MOCK.results.speaking || { pct: 0 };
    const langPct = Math.round((lr.pct + rr.pct) / 2);
    const band = bandFromPct(langPct);

    $("#view").innerHTML = `
      <div class="card">
        <div class="result-summary">
          <h1>📊 Hasil Simulasi</h1>
          <div class="result-score" style="color:var(--accent)">${band}</div>
          <div class="muted">Estimasi band (dari Listening + Reading)</div>
          <div style="margin-top:12px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="btn primary" onclick="location.hash='#/mock/start'">Ulangi Tes</button>
            <button class="btn" onclick="location.hash='#/dashboard'">Ke Dasbor</button>
          </div>
        </div>
        <div class="grid cols-2" style="margin-top:16px">
          <div class="card" style="margin:0"><div class="num" style="font-size:26px;font-weight:800">${lr.pct}%</div><div class="muted">Listening</div></div>
          <div class="card" style="margin:0"><div class="num" style="font-size:26px;font-weight:800">${rr.pct}%</div><div class="muted">Reading</div></div>
          <div class="card" style="margin:0"><div class="num" style="font-size:26px;font-weight:800">${wr.pct}%</div><div class="muted">Writing (self-check)</div></div>
          <div class="card" style="margin:0"><div class="num" style="font-size:26px;font-weight:800">${sr.band ? "Band " + sr.band : sr.pct + "%"}</div><div class="muted">Speaking (self-assess)</div></div>
        </div>
      </div>
      <div class="card" style="margin-top:16px">
        <h3>Saran</h3>
        <ul>
          <li>Jika Listening/Reading &lt; 70%, ulangi pelajaran di level Advanced.</li>
          <li>Jika Writing self-check rendah, pelajari koherensi & struktur essay.</li>
          <li>Berlatih Speaking secara teratur dengan timer untuk kefasihan.</li>
        </ul>
        <a class="btn" href="#/learn">🛤️ Lanjutkan Belajar</a>
      </div>`;
  }

  /* ============================================================
     EXAM MODE (Ujian per Level)
     ============================================================ */
  routes.exam = () => {
    $("#topbarTitle").textContent = "Ujian per Level";
    $("#view").innerHTML = `
      <h1>🎓 Ujian per Level</h1>
      <p class="muted">Uji kemampuan Anda di tiap level dengan ujian per skill. Skor disimpan sebagai band (1–9) dan dirangkum dalam rapor.</p>
      ${LEVELS.map((lv) => {
        const ob = overallBand(lv.id);
        const started = EXAM_SKILLS.some((s) => getExam(lv.id, s));
        return `
          <div class="card" style="margin-bottom:16px">
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
              <span style="font-size:28px">${lv.icon}</span>
              <div style="flex:1">
                <div style="font-weight:800;font-size:18px">${lv.name} <span class="muted" style="font-size:13px;font-weight:400">(${lv.band})</span></div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">
                  ${EXAM_SKILLS.map((s) => {
                    const r = getExam(lv.id, s);
                    return `<span style="padding:4px 10px;border-radius:99px;font-size:12px;font-weight:600;background:${r ? "rgba(47,184,110,.15)" : "var(--card2)"};border:1px solid var(--border)">${EXAM_LABELS[s].split(" ")[1]}${r ? " · " + fmtBand(r.band) : ""}</span>`;
                  }).join("")}
                </div>
              </div>
              <div style="text-align:right">
                ${ob !== null ? `<div style="font-size:26px;font-weight:800;color:var(--accent)">${fmtBand(ob)}</div><div class="muted" style="font-size:12px">band rata-rata</div>` : `<div class="muted">belum ada skor</div>`}
                <a class="btn sm primary" href="#/exam/${lv.id}" style="margin-top:8px">${started ? "Lanjutkan" : "Mulai Ujian"}</a>
              </div>
            </div>
          </div>`;
      }).join("")}`;
  };

  routes.examLevel = (params) => {
    const level = params[0];
    const lv = LEVEL_MAP[level];
    if (!lv) { go("exam"); return; }
    $("#topbarTitle").textContent = "Ujian — " + lv.name;
    const ob = overallBand(level);
    $("#view").innerHTML = `
      <div class="card hero">
        <div>
          <h1>${lv.icon} Ujian Level ${lv.name}</h1>
          <p class="muted">${lv.band} — ${esc(lv.desc)}</p>
        </div>
        ${ob !== null ? `<div style="text-align:center"><div class="result-score" style="color:var(--accent)">${fmtBand(ob)}</div><div class="muted">band rata-rata</div></div>` : ""}
      </div>
      <div class="grid cols-2" style="margin-top:16px">
        ${EXAM_SKILLS.map((s) => {
          const id = EXAMS[level][s];
          const r = getExam(level, s);
          return `
          <div class="card" style="margin:0">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:24px">${EXAM_LABELS[s].split(" ")[0]}</span>
              <span style="flex:1;font-weight:700">${EXAM_LABELS[s].split(" ")[1]}</span>
              ${r ? `<span style="background:rgba(47,184,110,.15);padding:4px 10px;border-radius:99px;font-weight:700">Band ${fmtBand(r.band)}</span>` : ""}
            </div>
            ${r ? `<div class="muted" style="margin-top:6px;font-size:13px">Skor: ${r.pct}% — ${r.correct}/${r.total}</div>` : `<div class="muted" style="margin-top:6px;font-size:13px">Belum dikerjakan</div>`}
            <a class="btn ${r ? "" : "primary"} sm" href="#/exam/${level}/${s}" style="margin-top:10px">${r ? "Ulangi" : "Kerjakan"}</a>
          </div>`;
        }).join("")}
      </div>
      <div class="card" style="margin-top:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
          <span><strong>Lihat rapor lengkap level ini:</strong></span>
          <a class="btn primary" href="#/exam/${level}/result">📋 Rapor & Nilai</a>
        </div>
      </div>`;
  };

  routes.examSkill = (params) => {
    const level = params[0], skill = params[1];
    const id = EXAMS[level] && EXAMS[level][skill];
    if (!id) { go("exam/" + level); return; }
    const lv = LEVEL_MAP[level];
    $("#topbarTitle").textContent = "Ujian — " + lv.name + " · " + EXAM_LABELS[skill].split(" ")[1];
    if (skill === "listening") renderExamListening(level, skill, id);
    else if (skill === "reading") renderExamReading(level, skill, id);
    else if (skill === "writing") renderExamWriting(level, skill, id);
    else if (skill === "speaking") renderExamSpeaking(level, skill, id);
    else go("exam/" + level);
  };

  function examHeader(level, skill) {
    const lv = LEVEL_MAP[level];
    return `
      <div class="card" style="margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="level-chip" style="background:${lv.color}">${lv.icon} ${lv.name}</span>
          <strong style="font-size:17px">Ujian ${lv.name}</strong>
          <a class="btn sm" href="#/exam/${level}" style="margin-left:auto">← Overview</a>
        </div>
        <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
          ${EXAM_SKILLS.map((s) => {
            const r = getExam(level, s);
            const cur = s === skill;
            const bg = cur ? "linear-gradient(90deg,var(--accent),var(--accent2));color:#06203a" : (r ? "rgba(47,184,110,.15)" : "var(--card2)");
            return `<span style="padding:6px 12px;border-radius:99px;border:1px solid var(--border);font-weight:600;background:${bg}">${EXAM_LABELS[s]}${r ? " · " + fmtBand(r.band) : ""}</span>`;
          }).join("")}
        </div>
      </div>`;
  }

  function showExamResult(sel, level, skill, res, band, title) {
    const next = EXAM_SKILLS[EXAM_SKILLS.indexOf(skill) + 1];
    const nextHref = next ? "#/exam/" + level + "/" + next : "#/exam/" + level + "/result";
    const nextLabel = next ? "Lanjut → " + EXAM_LABELS[next].split(" ")[1] : "Lihat Rapor 🎉";
    $(sel).innerHTML = `
      <div class="result-summary card" style="margin-top:18px">
        <div class="muted">Hasil: ${esc(title)}</div>
        <div class="result-score" style="color:var(--accent)">Band ${fmtBand(band)}</div>
        <div class="muted">Skor: ${res.pct}% (${res.correct}/${res.total})</div>
        <div style="margin-top:12px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <a class="btn primary" href="${nextHref}">${nextLabel}</a>
          <a class="btn" href="#/exam/${level}">Ke Overview</a>
        </div>
      </div>`;
    $(sel).scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function renderExamListening(level, skill, id) {
    const ex = listeningById(id);
    const lv = LEVEL_MAP[level];
    $("#view").innerHTML = `
      ${examHeader(level, skill)}
      <div class="card">
        <div style="display:flex;align-items:center;gap:10px">
          <h3 style="margin:0;flex:1">🎧 Listening Exam</h3>
          <span class="level-chip" style="background:${lv.color}">${lv.name}</span>
        </div>
        <div class="audio-bar" style="margin-top:12px">
          <button class="tts-btn" id="ep">▶</button>
          <div class="muted">Dengarkan audio sekali, lalu jawab soal di bawah.</div>
        </div>
      </div>
      <div class="card" style="margin-top:14px">
        ${ex.questions.map((q, qi) => qBlock(q, qi, ex)).join("")}
        <button class="btn primary lg" id="eSubmit" style="margin-top:14px">Kumpulkan Jawaban</button>
        <div id="eResult"></div>
      </div>`;
    $("#ep").onclick = () => tts.speaking ? tts.stop() : tts.speak(ex.script);
    $("#eSubmit").onclick = () => {
      const res = gradeGeneric(ex, "listening");
      const band = bandScore(res.pct);
      saveExam(level, skill, { band, pct: res.pct, correct: res.correct, total: res.total, at: Date.now() });
      showExamResult("#eResult", level, skill, res, band, ex.title);
    };
  }

  function renderExamReading(level, skill, id) {
    const ex = readingById(id);
    const lv = LEVEL_MAP[level];
    let sec = 20 * 60;
    $("#view").innerHTML = `
      ${examHeader(level, skill)}
      <div class="card">
        <div style="display:flex;align-items:center;gap:10px">
          <h3 style="margin:0;flex:1">📖 Reading Exam</h3>
          <span class="timer-disp" style="font-size:22px" id="eClock">20:00</span>
        </div>
      </div>
      <div class="read-split">
        <div class="read-questions">
          <div class="card">
            ${ex.questions.map((q, qi) => qBlock(q, qi, ex)).join("")}
            <button class="btn primary lg" id="eSubmit" style="margin-top:14px">Kumpulkan Jawaban</button>
            <div id="eResult"></div>
          </div>
        </div>
        <div class="read-passage">
          <div class="card">
            <h3>📄 Passage</h3>
            <div class="passage">${ex.passageHTML}</div>
          </div>
        </div>
      </div>`;
    const int = setInterval(() => { sec--; const cl = $("#eClock"); if (!cl) { clearInterval(int); return; } cl.textContent = fmt(sec); if (sec <= 0) clearInterval(int); }, 1000);
    $("#eSubmit").onclick = () => {
      clearInterval(int);
      const res = gradeGeneric(ex, "reading");
      const band = bandScore(res.pct);
      saveExam(level, skill, { band, pct: res.pct, correct: res.correct, total: res.total, at: Date.now() });
      showExamResult("#eResult", level, skill, res, band, ex.title);
    };
  }

  function renderExamWriting(level, skill, id) {
    const ex = writingById(id);
    const lv = LEVEL_MAP[level];
    let sec = ex.taskType === "1" ? 20 * 60 : 40 * 60;
    $("#view").innerHTML = `
      ${examHeader(level, skill)}
      <div class="card">
        <div style="display:flex;align-items:center;gap:10px">
          <h3 style="margin:0;flex:1">✍️ Writing Task ${ex.taskType} Exam</h3>
          <span class="timer-disp" style="font-size:22px" id="eClock">${fmt(sec)}</span>
        </div>
        <div style="margin-top:12px" class="info-box">${ex.promptHTML}</div>
      </div>
      <div class="card" style="margin-top:14px">
        <textarea id="draft" rows="12" style="width:100%;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:12px;padding:14px" placeholder="Tulis jawaban di sini…"></textarea>
        <div id="wc" class="muted" style="margin-top:8px"></div>
        <p class="muted" style="margin-top:12px">Evaluasi mandiri — centang yang berlaku pada tulisan Anda:</p>
        ${ex.checklist.map((c) => `<div class="option"><label><input type="checkbox" class="wc"> <span>${esc(c)}</span></label></div>`).join("")}
        <button class="btn primary lg" id="eSubmit" style="margin-top:14px">Kumpulkan & Nilai</button>
        <div id="eResult"></div>
      </div>`;
    const int = setInterval(() => { sec--; const cl = $("#eClock"); if (!cl) { clearInterval(int); return; } cl.textContent = fmt(sec); if (sec <= 0) clearInterval(int); }, 1000);
    attachWc("#draft", "#wc", ex.taskType === "1" ? 150 : 250);
    $("#eSubmit").onclick = () => {
      clearInterval(int);
      const n = $$(".wc:checked").length;
      const pct = Math.round((n / ex.checklist.length) * 100);
      const band = bandScore(pct);
      saveExam(level, skill, { band, pct, correct: n, total: ex.checklist.length, at: Date.now() });
      showExamResult("#eResult", level, skill, { pct, correct: n, total: ex.checklist.length }, band, ex.title);
    };
  }

  function renderExamSpeaking(level, skill, id) {
    const ex = speakingById(id);
    const lv = LEVEL_MAP[level];
    $("#view").innerHTML = `
      ${examHeader(level, skill)}
      <div class="card">
        <div style="display:flex;align-items:center;gap:10px">
          <h3 style="margin:0;flex:1">🗣️ Speaking Exam</h3>
          <span class="level-chip" style="background:${lv.color}">${lv.name}</span>
        </div>
        <p class="muted">Jawab pertanyaan selama 1–2 menit, lalu nilai kefasihan Anda sendiri.</p>
        ${ex.questions.map((q, i) => `<div class="qa-item"><div class="q">${i + 1}. ${esc(q)}</div></div>`).join("")}
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
          <button class="btn primary" id="spTimer">🗣️ Timer Berbicara (2 menit)</button>
        </div>
        <div id="spWrap" style="margin-top:12px"></div>
        <div style="margin-top:16px">
          <p class="muted">Nilai kefasihan & kejelasan Anda (skala IELTS):</p>
          <select id="selfBand" style="background:var(--card);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:8px">
            <option value="4">4 — terbatas</option>
            <option value="5">5 — sederhana</option>
            <option value="6">6 — kompeten</option>
            <option value="7" selected>7 — baik</option>
            <option value="8">8 — sangat baik</option>
            <option value="9">9 — ahli</option>
          </select>
        </div>
        <button class="btn primary lg" id="eSubmit" style="margin-top:14px">Simpan Nilai</button>
        <div id="eResult"></div>
      </div>`;
    $("#spTimer").onclick = () => {
      let sec = 120;
      $("#spWrap").innerHTML = `<div class="timer-wrap card"><div class="timer-disp" id="spClock">02:00</div></div>`;
      const int = setInterval(() => { sec--; const cl = $("#spClock"); if (!cl) { clearInterval(int); return; } cl.textContent = fmt(sec); if (sec <= 0) { clearInterval(int); cl.textContent = "⏰ Habis"; } }, 1000);
    };
    $("#eSubmit").onclick = () => {
      const band = parseFloat($("#selfBand").value);
      saveExam(level, skill, { band, pct: Math.round((band / 9) * 100), correct: band, total: 9, at: Date.now() });
      const next = EXAM_SKILLS[EXAM_SKILLS.indexOf(skill) + 1];
      const nextHref = next ? "#/exam/" + level + "/" + next : "#/exam/" + level + "/result";
      $("#eResult").innerHTML = `
        <div class="result-summary card" style="margin-top:16px">
          <div class="result-score" style="color:var(--accent)">Band ${fmtBand(band)}</div>
          <div class="muted">Nilai berbicara tersimpan.</div>
          <div style="margin-top:12px">
            <a class="btn primary" href="${nextHref}">${next ? "Lanjut → " + EXAM_LABELS[next].split(" ")[1] : "Lihat Rapor 🎉"}</a>
          </div>
        </div>`;
      $("#eResult").scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    /* Fitur rekam + interpretasi di ujian speaking */
    appendRecorder(ex.questions || [], "");
    if (ex.questions && ex.questions.length) appendGuided(ex.questions);
  }

  routes.examResult = (params) => {
    const level = params[0];
    const lv = LEVEL_MAP[level];
    if (!lv) { go("exam"); return; }
    $("#topbarTitle").textContent = "Rapor — " + lv.name;
    const results = EXAM_SKILLS.map((s) => ({ skill: s, r: getExam(level, s) }));
    const ob = overallBand(level);
    const weak = results.filter((x) => x.r && x.r.band < 6);
    $("#view").innerHTML = `
      <div class="card">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <span style="font-size:30px">${lv.icon}</span>
          <div style="flex:1">
            <h1 style="margin:0">Rapor Level ${lv.name}</h1>
            <div class="muted">${lv.band}</div>
          </div>
          ${ob !== null ? `<div style="text-align:center"><div class="result-score" style="color:var(--accent)">${fmtBand(ob)}</div><div class="muted">band rata-rata</div></div>` : ""}
        </div>
      </div>
      <div class="card" style="margin-top:16px">
        <h3>Nilai per Skill</h3>
        ${results.map(({ skill, r }) => `
          <div class="review-row" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <span style="font-size:22px">${EXAM_LABELS[skill].split(" ")[0]}</span>
            <span style="font-weight:700;flex:1">${EXAM_LABELS[skill].split(" ")[1]}</span>
            ${r ? `<span style="background:rgba(47,184,110,.15);padding:6px 14px;border-radius:99px;font-weight:800;font-size:18px">${fmtBand(r.band)}</span>
                   <span class="muted" style="font-size:13px">Skor ${r.pct}% (${r.correct}/${r.total})</span>
                   <a class="btn sm" href="#/exam/${level}/${skill}">Ulangi</a>`
               : `<span style="color:var(--muted)">belum dikerjakan</span>
                  <a class="btn sm primary" href="#/exam/${level}/${skill}">Kerjakan</a>`}
          </div>`).join("")}
      </div>
      <div class="card" style="margin-top:16px">
        <h3>Saran Peningkatan</h3>
        <ul>
          ${weak.length ? weak.map((x) => `<li>Latih <strong>${EXAM_LABELS[x.skill].split(" ")[1]}</strong> lebih banyak (band saat ini ${fmtBand(x.r.band)}).</li>`).join("") : "<li>Semua skill yang sudah dikerjakan ≥ band 6 👍 Lanjutkan ke level berikutnya!</li>"}
          ${results.some((x) => !x.r) ? "<li>Beberapa skill belum dikerjakan — selesaikan untuk mendapat nilai lengkap.</li>" : ""}
        </ul>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">
          <a class="btn" href="#/exam/${level}">← Overview Ujian</a>
          <a class="btn primary" href="#/learn">🛤️ Lanjutkan Belajar</a>
        </div>
      </div>`;
  };

  /* ============================================================
     PRACTICE BANK (Bank Latihan ≥100 per komponen)
     ============================================================ */
  const shuffleArr = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  routes.practice = () => {
    $("#topbarTitle").textContent = "Bank Latihan";
    const comps = [
      { key: "listening", icon: "🎧", label: "Listening" },
      { key: "reading", icon: "📖", label: "Reading" },
      { key: "writing", icon: "✍️", label: "Writing" },
      { key: "speaking", icon: "🗣️", label: "Speaking" },
      { key: "grammar", icon: "🔤", label: "Grammar" },
      { key: "vocabulary", icon: "📚", label: "Vocabulary" },
    ];
    const vocabCount = VOCAB_SETS.reduce((a, s) => a + s.words.length, 0);
    $("#view").innerHTML = `
      <h1>🏦 Bank Latihan</h1>
      <p class="muted">100+ soal latihan per komponen. Pilih untuk mulai berlatih.</p>
      <div class="card" style="margin-bottom:16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        <span style="font-size:34px">🎲</span>
        <div style="flex:1">
          <div style="font-weight:800;font-size:17px">Mode Campuran Acak</div>
          <div class="muted">Soal dari semua komponen sekaligus (Listening, Reading, Grammar, Vocabulary).</div>
        </div>
        <a class="btn primary" href="#/mixed">Mulai →</a>
      </div>
      <div class="grid cols-3">
        ${comps.map((c) => {
          const n = c.key === "vocabulary" ? vocabCount : (PRACTICE.counts[c.key] || 0);
          return `
          <div class="card" style="margin:0;cursor:pointer" onclick="location.hash='#/practice/${c.key}'">
            <div style="font-size:32px">${c.icon}</div>
            <div style="font-weight:800;font-size:18px">${c.label}</div>
            <div class="muted">${n} item latihan</div>
            <div style="margin-top:10px"><span class="level-chip" style="background:var(--green)">Mulai →</span></div>
          </div>`;
        }).join("")}
      </div>
      <p class="tip" style="margin-top:18px">💡 Reading/Listening/Grammar/Vocabulary dinilai otomatis; Writing & Speaking berisi prompt + panduan.</p>`;
  };

  routes.practiceComp = (params) => {
    const comp = params[0];
    const meta = {
      listening: { label: "Listening", icon: "🎧" },
      reading: { label: "Reading", icon: "📖" },
      writing: { label: "Writing", icon: "✍️" },
      speaking: { label: "Speaking", icon: "🗣️" },
      grammar: { label: "Grammar", icon: "🔤" },
      vocabulary: { label: "Vocabulary", icon: "📚" },
    }[comp];
    if (!meta) { go("practice"); return; }
    startDrill(comp, meta);
  };

  function startDrill(comp, meta) {
    let items, total;
    if (comp === "vocabulary") {
      const all = [];
      VOCAB_SETS.forEach((s) => s.words.forEach((w) => all.push({ w: w.w, meaning: w.meaning, set: s.topic })));
      items = all.map((o, i) => ({ id: "v" + i, kind: "mcq", answer: o.w, meaning: o.meaning, set: o.set }));
    } else {
      items = PRACTICE[comp] || [];
    }
    total = items.length;
    if (!total) { $("#view").innerHTML = `<div class="card"><p class="muted">Belum ada bahan.</p><a class="btn" href="#/practice">← Kembali</a></div>`; return; }

    let idx = 0, correct = 0, curOpts = [], recorded = false, curItem = null, history = [];

    const renderHeader = () => `
      <div class="card" style="margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span style="font-size:26px">${meta.icon}</span>
          <strong style="font-size:18px">${meta.label} — Bank Latihan</strong>
          <span class="muted" id="drillCount">Soal ${idx + 1}/${total}</span>
          <span style="margin-left:auto;font-weight:700" id="drillScore">✓ 0</span>
        </div>
        <div class="progress-mini-track" style="margin-top:10px"><div class="progress-mini-fill" id="drillBar" style="width:0%"></div></div>
      </div>`;

    const draw = () => {
      const it = items[idx];
      curItem = it;
      recorded = false;
      let card = "";
      if (comp === "writing") {
        card = `
          <div class="card">
            <div class="passage"><strong>Task ${it.type}:</strong><p style="margin-top:6px">${esc(it.task)}</p></div>
            <div class="muted" style="margin-top:8px">💡 ${esc(it.hint)}</div>
            <textarea id="draft" rows="10" style="width:100%;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:12px;padding:14px;margin-top:12px" placeholder="Tulis draf di sini…"></textarea>
            <div id="wc" class="muted" style="margin-top:8px"></div>
            <div style="margin-top:14px"><button class="btn primary" id="skipBtn">Lanjut →</button></div>
          </div>`;
      } else if (comp === "speaking") {
        const cue = it.cue ? `<div class="cuecard" style="margin-top:10px"><div class="cue-topic">${esc(it.q)}</div></div>` : "";
        card = `
          <div class="card">
            <div class="muted">Part ${it.part} · Speaking</div>
            <div style="font-size:19px;font-weight:700;margin-top:6px">${esc(it.q)}</div>
            ${cue}
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
              <button class="btn" id="spTimer">⏱️ Timer (2 menit)</button>
              <button class="btn primary" id="skipBtn">Lanjut →</button>
            </div>
            <div id="spWrap" style="margin-top:10px"></div>
          </div>`;
      } else if (it.kind === "mcq" || comp === "vocabulary") {
        let opts;
        if (comp === "vocabulary") {
          const allWords = items.map((x) => x.answer);
          opts = shuffleArr([it.answer, ...shuffleArr(allWords.filter((w) => w !== it.answer)).slice(0, 3)]);
        } else {
          opts = it.options;
        }
        curOpts = opts;
        const promptHTML = comp === "vocabulary"
          ? `<p><strong>Definisi:</strong> "${esc(it.meaning)}"</p><p><em>Apa kata yang tepat?</em></p>`
          : it.prompt;
        card = `
          <div class="card">
            <div class="passage">${promptHTML}</div>
            <div style="margin-top:12px">
              ${opts.map((o, i) => `<div class="option"><label><input type="radio" name="dp" value="${i}"> <span>${esc(o)}</span></label></div>`).join("")}
            </div>
            <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn primary" id="checkBtn">Periksa</button>
              <button class="btn" id="skipBtn" style="display:none">Lanjut →</button>
            </div>
            <div id="fb" style="margin-top:12px"></div>
          </div>`;
      } else if (comp === "reading") {
        card = `
          <div class="read-split" style="margin-top:0">
            <div class="read-questions">
              <div class="card">
                <h3>❓ Pertanyaan</h3>
                <div class="passage"><p><em>${esc(it.q || "")}</em></p></div>
                <div class="option" style="margin-top:12px"><input type="text" id="ansIn" placeholder="Ketik jawaban Anda…" style="width:100%;max-width:420px"></div>
                <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">
                  <button class="btn primary" id="checkBtn">Periksa</button>
                  <button class="btn" id="skipBtn" style="display:none">Lanjut →</button>
                </div>
                <div id="fb" style="margin-top:12px"></div>
              </div>
            </div>
            <div class="read-passage">
              <div class="card">
                <h3>📄 Bacaan</h3>
                <div class="passage"><p>${esc(it.passage || "")}</p></div>
              </div>
            </div>
          </div>`;
      } else {
        // short answer (listening)
        const listenBtn = `<div style="margin-top:10px;display:flex;align-items:center;gap:10px">
            <button class="tts-btn" id="playDrill">▶</button>
            <span class="muted">Dengarkan audio (TTS)</span>
          </div>`;
        card = `
          <div class="card">
            <div class="passage">${it.prompt}</div>
            ${listenBtn}
            <div class="option" style="margin-top:12px"><input type="text" id="ansIn" placeholder="Ketik jawaban Anda…" style="width:100%;max-width:420px"></div>
            <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn primary" id="checkBtn">Periksa</button>
              <button class="btn" id="skipBtn" style="display:none">Lanjut →</button>
            </div>
            <div id="fb" style="margin-top:12px"></div>
          </div>`;
      }
      $("#view").innerHTML = renderHeader() + card;
      $("#drillBar").style.width = Math.round((idx / total) * 100) + "%";
      if (comp === "writing") attachWc("#draft", "#wc", it.type === "1" ? 150 : 250);
      if ($("#checkBtn")) $("#checkBtn").onclick = () => check(it);
      if ($("#skipBtn")) $("#skipBtn").onclick = () => next();
      if ($("#playDrill")) $("#playDrill").onclick = () => tts.speaking ? tts.stop() : tts.speak(it.script);
      if ($("#spTimer")) $("#spTimer").onclick = () => {
        let sec = 120;
        $("#spWrap").innerHTML = `<div class="timer-wrap card"><div class="timer-disp" id="spClock">02:00</div></div>`;
        const int = setInterval(() => { sec--; const cl = $("#spClock"); if (!cl) { clearInterval(int); return; } cl.textContent = fmt(sec); if (sec <= 0) { clearInterval(int); cl.textContent = "⏰ Habis"; } }, 1000);
      };
    };

    const check = (it) => {
      let ok = false, given = "";
      if (it.kind === "mcq" || comp === "vocabulary") {
        const sel = $('input[name="dp"]:checked');
        if (!sel) { $("#fb").innerHTML = `<span class="feedback-wrong">Pilih satu jawaban dulu.</span>`; return; }
        const chosenIdx = parseInt(sel.value, 10);
        given = curOpts[chosenIdx];
        ok = (comp === "vocabulary")
          ? given.toLowerCase() === String(it.answer).toLowerCase()
          : chosenIdx === it.answer;
      } else {
        given = ($("#ansIn").value || "").trim();
        const v = given.toLowerCase();
        ok = v === String(it.answer).toLowerCase() || (it.alt || []).some((a) => v === String(a).toLowerCase());
      }
      if (ok) { correct++; $("#drillScore").textContent = "✓ " + correct; }
      recorded = true;
      const correctText = it.kind === "mcq"
        ? (comp === "vocabulary" ? String(it.answer) : String(it.options[it.answer]))
        : String(it.answer);
      const why = it.why || (comp === "vocabulary" ? it.meaning : "");
      history.push({ prompt: comp === "vocabulary" ? 'Definisi: "' + it.meaning + '"' : (it.prompt || ""), given, correct: correctText, ok, why });
      $("#fb").innerHTML = ok
        ? `<span class="feedback-correct">✓ Benar!</span>`
        : `<span class="feedback-wrong">✗ Jawaban benar: ${esc(String(it.answer))}</span>`;
      $("#checkBtn").disabled = true;
      $("#skipBtn").style.display = "inline-flex";
    };

    const next = () => {
      if (!recorded && curItem && (curItem.kind === "mcq" || comp === "vocabulary" || curItem.kind === "short")) {
        const correctText = curItem.kind === "mcq"
          ? (comp === "vocabulary" ? String(curItem.answer) : String(curItem.options[curItem.answer]))
          : String(curItem.answer);
        history.push({ prompt: comp === "vocabulary" ? 'Definisi: "' + curItem.meaning + '"' : (curItem.prompt || ""), given: null, correct: correctText, ok: false, why: curItem.why || "" });
      }
      idx++;
      if (idx >= total) { finish(); return; }
      draw();
    };

    const finish = () => {
      const pct = Math.round((correct / total) * 100);
      recordPractice(comp, pct, correct, total);
      saveResult(comp, meta.label + " (Bank Latihan)", pct, correct, total);
      const review = history.map((h, ix) => `
        <div class="review-row">
          <div style="font-weight:600">${ix + 1}. ${h.prompt || ""}</div>
          <div class="${h.ok ? "feedback-correct" : "feedback-wrong"}">${h.ok ? "✓ Benar" : "✗ Salah"} — Jawaban Anda: ${h.given ? esc(String(h.given)) : "—"}</div>
          <div class="muted">Jawaban benar: ${esc(String(h.correct))}</div>
          ${h.why ? `<div class="tip" style="margin-top:6px">💡 Pembahasan: ${esc(String(h.why))}</div>` : ""}
        </div>`).join("");
      $("#view").innerHTML = `
        <div class="card">
          <div class="result-summary">
            <div style="font-size:26px">${meta.icon}</div>
            <h1>Selesai!</h1>
            <div class="result-score" style="color:var(--accent)">${correct}/${total}</div>
            <div class="muted">Skor: ${pct}%</div>
            <div style="margin-top:14px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
              <button class="btn primary" id="again">Ulangi</button>
              <a class="btn" href="#/practice">Ke Bank Latihan</a>
            </div>
          </div>
        </div>
        ${review ? `<div class="card" style="margin-top:16px"><h3>📋 Review & Pembahasan</h3>${review}</div>` : ""}`;
      $("#again").onclick = () => startDrill(comp, meta);
    };

    draw();
  }

  /* ============================================================
     MIXED MODE (Campuran Acak dari semua komponen)
     ============================================================ */
  routes.mixed = () => {
    $("#topbarTitle").textContent = "Mode Campuran";
    $("#view").innerHTML = `
      <h1>🎲 Mode Campuran</h1>
      <p class="muted">Ambil soal acak dari semua komponen (Listening, Reading, Grammar, Vocabulary) dalam satu sesi latihan.</p>
      <div class="card">
        <h3>Pilih jumlah soal</h3>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
          ${[10, 20, 30].map((n) => `<button class="btn primary" data-n="${n}">${n} soal</button>`).join("")}
        </div>
        <div class="muted" style="margin-top:12px">Skor & estimasi band dihitung otomatis dan tersimpan ke dasbor.</div>
      </div>
      <a class="btn" href="#/practice" style="margin-top:12px">← Kembali ke Bank Latihan</a>`;
    $$('[data-n]').forEach((b) => { b.onclick = () => startMixed(parseInt(b.dataset.n, 10)); });
  };

  function startMixed(count) {
    const pool = [];
    PRACTICE.reading.forEach((it) => pool.push(Object.assign({}, it, { comp: "reading", compLabel: "Reading", icon: "📖" })));
    PRACTICE.listening.forEach((it) => pool.push(Object.assign({}, it, { comp: "listening", compLabel: "Listening", icon: "🎧" })));
    PRACTICE.grammar.forEach((it) => pool.push(Object.assign({}, it, { comp: "grammar", compLabel: "Grammar", icon: "🔤" })));
    VOCAB_SETS.forEach((s) => s.words.forEach((w) => pool.push({ kind: "mcq", comp: "vocabulary", compLabel: "Vocabulary", icon: "📚", answer: w.w, meaning: w.meaning })));

    const items = shuffleArr(pool).slice(0, count);
    const total = items.length;
    const allWords = pool.filter((x) => x.comp === "vocabulary").map((x) => x.answer);
    let idx = 0, correct = 0, curOpts = [], recorded = false, curItem = null, history = [];

    const header = () => `
      <div class="card" style="margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span style="font-size:26px">🎲</span>
          <strong style="font-size:18px">Mode Campuran</strong>
          <span class="muted" id="mCount">Soal ${idx + 1}/${total}</span>
          <span style="margin-left:auto;font-weight:700" id="mScore">✓ 0</span>
        </div>
        <div class="progress-mini-track" style="margin-top:10px"><div class="progress-mini-fill" id="mBar" style="width:0%"></div></div>
      </div>`;

    const draw = () => {
      const it = items[idx];
      curItem = it;
      recorded = false;
      const badge = `<span class="level-chip" style="background:var(--accent);font-size:12px">${it.icon} ${it.compLabel}</span>`;
      let card = "";
      if (it.kind === "mcq") {
        let opts;
        if (it.comp === "vocabulary") {
          opts = shuffleArr([it.answer, ...shuffleArr(allWords.filter((w) => w !== it.answer)).slice(0, 3)]);
        } else {
          opts = it.options;
        }
        curOpts = opts;
        const promptHTML = it.comp === "vocabulary"
          ? `<p><strong>Definisi:</strong> "${esc(it.meaning)}"</p><p><em>Apa kata yang tepat?</em></p>`
          : `<p><em>${esc(it.q || it.prompt)}</em></p>`;
        card = `
          <div class="card">
            <div style="margin-bottom:10px">${badge}</div>
            <div class="passage">${promptHTML}</div>
            <div style="margin-top:10px">
              ${opts.map((o, i) => `<div class="option"><label><input type="radio" name="dp" value="${i}"> <span>${esc(o)}</span></label></div>`).join("")}
            </div>
            <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn primary" id="checkBtn">Periksa</button>
              <button class="btn" id="skipBtn" style="display:none">Lanjut →</button>
            </div>
            <div id="fb" style="margin-top:12px"></div>
          </div>`;
      } else if (it.comp === "reading") {
        card = `
          <div class="read-split" style="margin-top:0">
            <div class="read-questions">
              <div class="card">
                <div style="margin-bottom:10px">${badge}</div>
                <h3>❓ Pertanyaan</h3>
                <div class="passage"><p><em>${esc(it.q || "")}</em></p></div>
                <div class="option" style="margin-top:12px"><input type="text" id="ansIn" placeholder="Ketik jawaban Anda…" style="width:100%;max-width:420px"></div>
                <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">
                  <button class="btn primary" id="checkBtn">Periksa</button>
                  <button class="btn" id="skipBtn" style="display:none">Lanjut →</button>
                </div>
                <div id="fb" style="margin-top:12px"></div>
              </div>
            </div>
            <div class="read-passage">
              <div class="card">
                <h3>📄 Bacaan</h3>
                <div class="passage"><p>${esc(it.passage || "")}</p></div>
              </div>
            </div>
          </div>`;
      } else {
        const playBtn = `<div style="margin-top:10px;display:flex;align-items:center;gap:10px">
            <button class="tts-btn" id="playDrill">▶</button>
            <span class="muted">Dengarkan audio (TTS)</span>
          </div>`;
        card = `
          <div class="card">
            <div style="margin-bottom:10px">${badge}</div>
            <div class="passage">${it.prompt}</div>
            ${playBtn}
            <div class="option" style="margin-top:12px"><input type="text" id="ansIn" placeholder="Ketik jawaban Anda…" style="width:100%;max-width:420px"></div>
            <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn primary" id="checkBtn">Periksa</button>
              <button class="btn" id="skipBtn" style="display:none">Lanjut →</button>
            </div>
            <div id="fb" style="margin-top:12px"></div>
          </div>`;
      }
      $("#view").innerHTML = header() + card;
      $("#mBar").style.width = Math.round((idx / total) * 100) + "%";
      if ($("#checkBtn")) $("#checkBtn").onclick = () => check(it);
      if ($("#skipBtn")) $("#skipBtn").onclick = () => next();
      if ($("#playDrill")) $("#playDrill").onclick = () => tts.speaking ? tts.stop() : tts.speak(it.script);
    };

    const check = (it) => {
      let ok = false, given = "";
      if (it.kind === "mcq") {
        const sel = $('input[name="dp"]:checked');
        if (!sel) { $("#fb").innerHTML = `<span class="feedback-wrong">Pilih satu jawaban dulu.</span>`; return; }
        const chosenIdx = parseInt(sel.value, 10);
        given = curOpts[chosenIdx];
        ok = (it.comp === "vocabulary") ? given.toLowerCase() === String(it.answer).toLowerCase() : chosenIdx === it.answer;
      } else {
        given = ($("#ansIn").value || "").trim();
        const v = given.toLowerCase();
        ok = v === String(it.answer).toLowerCase() || (it.alt || []).some((a) => v === String(a).toLowerCase());
      }
      if (ok) { correct++; $("#mScore").textContent = "✓ " + correct; }
      recorded = true;
      const correctText = it.kind === "mcq"
        ? (it.comp === "vocabulary" ? String(it.answer) : String(it.options[it.answer]))
        : String(it.answer);
      const why = it.why || (it.comp === "vocabulary" ? it.meaning : "");
      history.push({ prompt: it.comp === "vocabulary" ? 'Definisi: "' + it.meaning + '"' : (it.prompt || ""), given, correct: correctText, ok, why });
      $("#fb").innerHTML = ok
        ? `<span class="feedback-correct">✓ Benar!</span>`
        : `<span class="feedback-wrong">✗ Jawaban benar: ${esc(String(it.answer))}</span>`;
      $("#checkBtn").disabled = true;
      $("#skipBtn").style.display = "inline-flex";
    };

    const next = () => {
      if (!recorded && curItem && (curItem.kind === "mcq" || curItem.kind === "short")) {
        const correctText = curItem.kind === "mcq"
          ? (curItem.comp === "vocabulary" ? String(curItem.answer) : String(curItem.options[curItem.answer]))
          : String(curItem.answer);
        history.push({ prompt: curItem.comp === "vocabulary" ? 'Definisi: "' + curItem.meaning + '"' : (curItem.prompt || ""), given: null, correct: correctText, ok: false, why: curItem.why || "" });
      }
      idx++;
      if (idx >= total) { finish(); return; }
      draw();
    };

    const finish = () => {
      const pct = Math.round((correct / total) * 100);
      recordPractice("mixed", pct, correct, total);
      saveResult("mixed", "Mode Campuran (acak)", pct, correct, total);
      const band = bandFromPct(pct);
      const review = history.map((h, ix) => `
        <div class="review-row">
          <div style="font-weight:600">${ix + 1}. ${h.prompt || ""}</div>
          <div class="${h.ok ? "feedback-correct" : "feedback-wrong"}">${h.ok ? "✓ Benar" : "✗ Salah"} — Jawaban Anda: ${h.given ? esc(String(h.given)) : "—"}</div>
          <div class="muted">Jawaban benar: ${esc(String(h.correct))}</div>
          ${h.why ? `<div class="tip" style="margin-top:6px">💡 Pembahasan: ${esc(String(h.why))}</div>` : ""}
        </div>`).join("");
      $("#view").innerHTML = `
        <div class="card">
          <div class="result-summary">
            <div style="font-size:28px">🎲</div>
            <h1>Selesai!</h1>
            <div class="result-score" style="color:var(--accent)">${correct}/${total}</div>
            <div class="muted">Skor: ${pct}% · Estimasi band: ${band}</div>
            <div style="margin-top:14px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
              <button class="btn primary" id="again">Ulangi (${count} soal)</button>
              <a class="btn" href="#/practice">Ke Bank Latihan</a>
            </div>
          </div>
        </div>
        ${review ? `<div class="card" style="margin-top:16px"><h3>📋 Review & Pembahasan</h3>${review}</div>` : ""}`;
      $("#again").onclick = () => startMixed(count);
    };

    draw();
  }

  /* ============================================================
     BOOT
     ============================================================ */
  window.addEventListener("DOMContentLoaded", () => {
    tts.init();
    render();
  });
})();
