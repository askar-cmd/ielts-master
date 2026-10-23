/* ============================================================
   data-core.js — levels, learning path, writing, speaking, grammar
   ============================================================ */

/* ---------- LEVELS ---------- */
const LEVELS = [
  {
    id: "beginner", name: "Beginner", band: "Band 0 – 4.0",
    color: "#2fb86e", icon: "🌱",
    desc: "Kenali format tes IELTS, bangun pondasi kosakata dan grammar dasar, serta biasakan diri dengan jenis-jenis soal.",
    goals: ["Pahami format & skala skor IELTS", "Pelajari grammar dasar (tenses)", "Perluas kosakata harian", "Kuasai teknik dasar skimming & scanning"],
  },
  {
    id: "intermediate", name: "Intermediate", band: "Band 4.5 – 6.0",
    color: "#f2a93b", icon: "📘",
    desc: "Bangun strategi mengerjakan soal, perkuat struktur menulis, dan mulai bicara dengan percaya diri.",
    goals: ["Kuasai teknik True/False/Not Given", "Pelajari struktur essay Task 2", "Latih Part 2 Speaking (cue card)", "Perluas kosakata pendidikan & kerja"],
  },
  {
    id: "advanced", name: "Advanced", band: "Band 6.5 – 7.5",
    color: "#4a8ff7", icon: "🚀",
    desc: "Tangani soal-soal sulit, tingkatkan koherensi tulisan, dan kuasai kosakata akademik.",
    goals: ["Kalahkan distraktor Listening", "Kuasai matching headings & inference", "Tulis essay koheren & padu", "Perluas kosakata lingkungan & teknologi"],
  },
  {
    id: "expert", name: "Expert", band: "Band 8 – 9.0",
    color: "#9b6bf3", icon: "👑",
    desc: "Simulasi tes penuh, refine gaya bahasa, dan capai keakuratan tinggi di semua skill.",
    goals: ["Simulasi tes penuh dengan waktu", "Gunakan variasi kalimat kompleks", "Kuasai kosakata idiomatik", "Jaga kefasihan & naturalitas"],
  },
];

/* ---------- LEARNING PATH ---------- */
/* Mencampur semua skill tiap level. kind: 'lesson' | 'exercise' | 'grammar' | 'vocab' */
const LESSONS = [
  /* ===== BEGINNER ===== */
  { id: "g1", level: "beginner", skill: "guide",   kind: "lesson", icon: "ℹ️", title: "Pengenalan IELTS & Skala Skor",
    body: `
    <p>IELTS (International English Language Testing System) mengukur kemampuan berbahasa Inggris Anda dalam 4 skill: <strong>Listening</strong>, <strong>Reading</strong>, <strong>Writing</strong>, dan <strong>Speaking</strong>.</p>
    <p>Skor berkisar dari <strong>1 s.d. 9</strong>. Mayoritas universitas meminta band <strong>6.5–7.5</strong>.</p>
    <div class="info-box">
      <strong>Jenis tes:</strong> Academic (untuk studi) atau General Training (untuk migrasi/kerja).<br/>
      <strong>Durasi total:</strong> ± 2 jam 45 menit. Listening (40 menit), Reading (60 menit), Writing (60 menit), Speaking (11–14 menit).
    </div>
    <h4>Skala skor cepat</h4>
    <ul>
      <li><strong>9</strong> — Pengguna ahli (Expert user)</li>
      <li><strong>7</strong> — Pengguna baik (Good user)</li>
      <li><strong>6</strong> — Pengguna kompeten (Competent user)</li>
      <li><strong>5</strong> — Pengguna sederhana (Modest user)</li>
      <li><strong>4</strong> — Pengguna terbatas (Limited user)</li>
    </ul>
    <p class="tip">💡 Cek <a href="#/learn">Jalur Belajar</a> untuk langkah pertama Anda hari ini.</p>` },

  { id: "b1", level: "beginner", skill: "listening", kind: "exercise", icon: "🎧", title: "Listening: Angka, Tanggal & Nama",
    ref: { type: "listening", id: "le1" } },

  { id: "b2", level: "beginner", skill: "reading", kind: "lesson", icon: "📖", title: "Reading: Skimming & Scanning",
    body: `
    <p><strong>Skimming</strong> = membaca cepat untuk memahami <em>ide utama</em> satu paragraf. Gerakkan mata cepat melewati teks tanpa membaca tiap kata.</p>
    <p><strong>Scanning</strong> = mencari <em>informasi spesifik</em> (nama, angka, tanggal, kata kunci) dengan memindai teks.</p>
    <div class="info-box">
      <strong>Jenis soal Reading yang utama:</strong>
      <ul>
        <li>Multiple choice (pilihan ganda)</li>
        <li>True / False / Not Given</li>
        <li>Matching headings (pasangkan judul)</li>
        <li>Completion: melengkapi kalimat/ringkasan/tabel</li>
      </ul>
    </div>
    <h4>Strategi dasar</h4>
    <ol>
      <li>Baca pertanyaan <em>sebelum</em> membaca teks.</li>
      <li>Tandai kata kunci di pertanyaan.</li>
      <li>Gunakan scanning untuk menemukan lokasi jawaban.</li>
      <li>Jangan habiskan waktu lama di satu soal.</li>
    </ol>` },

  { id: "b3", level: "beginner", skill: "grammar", kind: "lesson", icon: "🔤", title: "Grammar: Simple Tenses",
    body: `
    <h4>Present Simple</h4>
    <p>Fakta, rutinitas, jadwal tetap.</p>
    <p class="example">Subject + V1 (+s/es). <em>She <u>works</u> in a hospital.</em></p>
    <h4>Past Simple</h4>
    <p>Aksi yang selesai di waktu lampau.</p>
    <p class="example">Subject + V2. <em>He <u>visited</u> Jakarta last year.</em></p>
    <h4>Future Simple</h4>
    <p>Rencana / prediksi dengan will atau going to.</p>
    <p class="example"><em>I <u>will take</u> the test next month. → I <u>am going to</u> apply soon.</em></p>
    <div class="info-box">
      <strong>Kesalahan umum:</strong> lupa <em>s/es</em> pada he/she/it di present simple, dan mengubah V2 saat bercerita.
    </div>` },

  { id: "b4", level: "beginner", skill: "vocab", kind: "lesson", icon: "📚", title: "Vocabulary: Keluarga & Kehidupan Sehari-hari",
    body: `
    <p>Pelajari kosa kata topik keluarga dan rutinitas harian. Ini topik favorit di Part 1 Speaking.</p>
    <h4>Keluarga</h4>
    <ul>
      <li><strong>immediate family</strong> — keluarga inti (orang tua + anak)</li>
      <li><strong>extended family</strong> — keluarga besar</li>
      <li><strong>only child</strong> — anak tunggal</li>
      <li><strong>relative / kin</strong> — kerabat</li>
    </ul>
    <h4>Kehidupan harian</h4>
    <ul>
      <li><strong>commute</strong> — perjalanan pulang-pergi kerja</li>
      <li><strong>household chores</strong> — pekerjaan rumah tangga</li>
      <li><strong>spare time</strong> — waktu luang</li>
      <li><strong>catch up with</strong> — berkabar dengan</li>
    </ul>
    <p class="tip">💡 Latih di <a href="#/vocab">Vocabulary</a> dengan kuis kartu.</p>` },

  { id: "w1", level: "beginner", skill: "writing", kind: "exercise", icon: "✍️", title: "Writing Task 1: Menggambarkan Tren Dasar",
    ref: { type: "writing", id: "wt1" } },

  { id: "s1", level: "beginner", skill: "speaking", kind: "exercise", icon: "🗣️", title: "Speaking Part 1: Pertanyaan Dasar",
    ref: { type: "speaking", id: "sp1" } },

  /* ===== INTERMEDIATE ===== */
  { id: "g2", level: "intermediate", skill: "guide", kind: "lesson", icon: "ℹ️", title: "Strategi Manajemen Waktu",
    body: `
    <p>Manajemen waktu adalah kunci. Di Reading & Listening, Anda tidak mendapat waktu tambahan untuk memindahkan jawaban.</p>
    <div class="info-box">
      <strong>Tidak waktu khas:</strong>
      <ul>
        <li>Listening: 40 soal / ± 30 menit audio</li>
        <li>Reading: 40 soal / 60 menit (3 passage)</li>
        <li>Writing: Task 1 = 20 menit, Task 2 = 40 menit</li>
        <li>Speaking: Part 1 (4–5 mnt), Part 2 (3–4 mnt), Part 3 (4–5 mnt)</li>
      </ul>
    </div>
    <h4>Tips</h4>
    <ol>
      <li>Di Reading, kerjakan passage yang paling mudah dulu.</li>
      <li>Jangan biarkan satu soal menguras waktu Anda.</li>
      <li>Untuk Writing, sisihkan 5 menit terakhir untuk mengecek.</li>
    </ol>` },

  { id: "b5", level: "intermediate", skill: "reading", kind: "exercise", icon: "📖", title: "Reading: True / False / Not Given",
    ref: { type: "reading", id: "re1" } },

  { id: "b6", level: "intermediate", skill: "listening", kind: "lesson", icon: "🎧", title: "Listening: Strategi Section 1 & 2",
    body: `
    <p>Section 1 biasanya percakapan (form filling): nama, nomor telepon, tanggal, alamat.</p>
    <p>Section 2 biasanya monolog/tur panduan (teks singkat/tabel).</p>
    <h4>Tips</h4>
    <ol>
      <li>Baca instruksi & perkirakan <em>jenis kata</em> yang dibutuhkan (angka, huruf, kata).</li>
      <li>Perhatikan <em>jumlah kata maksimum</em> untuk diisi.</li>
      <li>Waspada distraktor: pembicara sering menyebut jawaban lalu mengoreksinya.</li>
    </ol>
    <div class="info-box"><strong>Contoh distraktor:</strong> "The class starts at 10... actually, no, it's been moved to 11." Jawaban: <strong>11</strong>.</div>` },

  { id: "b7", level: "intermediate", skill: "writing", kind: "lesson", icon: "✍️", title: "Writing Task 2: Struktur Essay",
    body: `
    <p>Task 2 bernilai <strong>2× lebih besar</strong> daripada Task 1. Tulis minimal <strong>250 kata</strong>.</p>
    <h4>Struktur 4 paragraf</h4>
    <ol>
      <li><strong>Introduction</strong> — parafrasa pertanyaan + thesis statement.</li>
      <li><strong>Body 1</strong> — ide utama pertama + penjelasan + contoh.</li>
      <li><strong>Body 2</strong> — ide utama kedua + penjelasan + contoh.</li>
      <li><strong>Conclusion</strong> — ringkasan & penutup.</li>
    </ol>
    <h4>Frasa bermanfaat</h4>
    <ul>
      <li>Introduction: <em>"This essay will discuss..." "It is argued that..."</em></li>
      <li>Memberi contoh: <em>"For instance..." "To illustrate..."</em></li>
      <li>Conclusion: <em>"In conclusion..." "To sum up..."</em></li>
    </ul>` },

  { id: "b8", level: "intermediate", skill: "vocab", kind: "lesson", icon: "📚", title: "Vocabulary: Pendidikan & Pekerjaan",
    body: `
    <h4>Pendidikan</h4>
    <ul>
      <li><strong>tertiary education</strong> — pendidikan tinggi</li>
      <li><strong>curriculum</strong> — kurikulum</li>
      <li><strong>tuition fees</strong> — biaya kuliah</li>
      <li><strong>scholarship</strong> — beasiswa</li>
    </ul>
    <h4>Pekerjaan</h4>
    <ul>
      <li><strong>employment prospects</strong> — prospek kerja</li>
      <li><strong>job satisfaction</strong> — kepuasan kerja</li>
      <li><strong>work-life balance</strong> — keseimbangan kerja-hidup</li>
      <li><strong>remuneration</strong> — imbalan/gaji</li>
    </ul>` },

  { id: "s2", level: "intermediate", skill: "speaking", kind: "exercise", icon: "🗣️", title: "Speaking Part 2: Cue Card",
    ref: { type: "speaking", id: "sp2" } },

  /* ===== ADVANCED ===== */
  { id: "b9", level: "advanced", skill: "listening", kind: "exercise", icon: "🎧", title: "Listening: Distraktor & Inference",
    ref: { type: "listening", id: "le2" } },

  { id: "b10", level: "advanced", skill: "reading", kind: "exercise", icon: "📖", title: "Reading: Matching Headings",
    ref: { type: "reading", id: "re2" } },

  { id: "b11", level: "advanced", skill: "writing", kind: "lesson", icon: "✍️", title: "Writing: Koherensi & Kohesi",
    body: `
    <p>Koherensi = ide mengalir logis. Kohesi = penggunaan kata penghubung (linking words) yang tepat.</p>
    <h4>Kata penghubung penting</h4>
    <table class="tbl">
      <tr><th>Fungsi</th><th>Frasa</th></tr>
      <tr><td>Menambah ide</td><td>Moreover, Furthermore, In addition</td></tr>
      <tr><td>Kontras</td><td>However, On the other hand, Although</td></tr>
      <tr><td>Sebab-akibat</td><td>Therefore, Consequently, As a result</td></tr>
      <tr><td>Memberi contoh</td><td>For instance, For example, Such as</td></tr>
      <tr><td>Kesimpulan</td><td>In conclusion, To sum up, Overall</td></tr>
    </table>
    <div class="info-box">
      <strong>Tips:</strong> Jangan menjejalkan linking words. Gunakan secara alami, 1–2 per kalimat kompleks.
    </div>` },

  { id: "b12", level: "advanced", skill: "vocab", kind: "lesson", icon: "📚", title: "Vocabulary: Lingkungan & Teknologi",
    body: `
    <h4>Lingkungan</h4>
    <ul>
      <li><strong>sustainable development</strong> — pembangunan berkelanjutan</li>
      <li><strong>carbon footprint</strong> — jejak karbon</li>
      <li><strong>renewable energy</strong> — energi terbarukan</li>
      <li><strong>environmental degradation</strong> — kerusakan lingkungan</li>
    </ul>
    <h4>Teknologi</h4>
    <ul>
      <li><strong>artificial intelligence</strong> — kecerdasan buatan</li>
      <li><strong>digital literacy</strong> — literasi digital</li>
      <li><strong>automation</strong> — otomatisasi</li>
      <li><strong>data privacy</strong> — privasi data</li>
    </ul>` },

  { id: "s3", level: "advanced", skill: "speaking", kind: "exercise", icon: "🗣️", title: "Speaking Part 3: Diskusi",
    ref: { type: "speaking", id: "sp3" } },

  { id: "w2", level: "advanced", skill: "writing", kind: "exercise", icon: "✍️", title: "Writing Task 2: Essay Penuh",
    ref: { type: "writing", id: "wt2" } },

  /* ===== EXPERT ===== */
  { id: "b13", level: "expert", skill: "listening", kind: "exercise", icon: "🎧", title: "Listening: Full Test Simulation",
    ref: { type: "listening", id: "le3" } },

  { id: "b14", level: "expert", skill: "reading", kind: "exercise", icon: "📖", title: "Reading: Full Passage & Inference",
    ref: { type: "reading", id: "re3" } },

  { id: "b15", level: "expert", skill: "writing", kind: "lesson", icon: "✍️", title: "Writing: Nada Akademik & Variasi Kalimat",
    body: `
    <p>Di level expert, tulis dengan <strong>nada akademik</strong> & variasi struktur kalimat.</p>
    <h4>Hindari</h4>
    <ul>
      <li>Kata informal: <em>a lot of</em> → <em>a significant number of</em></li>
      <li>Singkatan: <em>can't</em> → <em>cannot</em></li>
      <li>Kata ganti informal: <em>you</em> → <em>individuals / people</em></li>
    </ul>
    <h4>Variasi kalimat</h4>
    <ul>
      <li>Gunakan passive voice sesekali: <em>It is widely believed that...</em></li>
      <li>Gunakan conditional: <em>If the trend continues...</em></li>
      <li>Gunakan noun phrases: <em>The implementation of stricter laws...</em></li>
    </ul>` },

  { id: "b16", level: "expert", skill: "vocab", kind: "lesson", icon: "📚", title: "Vocabulary: Idiomatik & Presisi",
    body: `
    <p>Di band 8+ anda diharapkan memakai kosakata <strong>fleksibel & tepat</strong>, termasuk frasa idiomatik alami.</p>
    <ul>
      <li><strong>a double-edged sword</strong> — pisau bermata dua (punya sisi baik & buruk)</li>
      <li><strong>the tip of the iceberg</strong> — hanya sebagian kecil dari masalah besar</li>
      <li><strong>strike a balance</strong> — menjaga keseimbangan</li>
      <li><strong>in the long run</strong> — dalam jangka panjang</li>
    </ul>
    <div class="info-box"><strong>Catatan:</strong> gunakan idiom secara alami — jangan memaksakan di setiap kalimat.</div>` },

  { id: "s4", level: "expert", skill: "speaking", kind: "exercise", icon: "🗣️", title: "Speaking: Fluency & Naturalness",
    ref: { type: "speaking", id: "sp4" } },
];

/* ---------- WRITING TASKS ---------- */
const WRITING_TASKS = [
  {
    id: "wt1", level: "beginner", taskType: "1",
    title: "Task 1 — Bar Chart Dasar",
    promptHTML: `
      <p>The chart below shows the number of students who studied English abroad from 2015 to 2020.</p>
      <div class="chart-placeholder">
        <strong>📊 Bar Chart</strong>
        <div class="bars">
          <div class="bar" style="--h:40%"><span>2015</span><i>400</i></div>
          <div class="bar" style="--h:52%"><span>2016</span><i>520</i></div>
          <div class="bar" style="--h:48%"><span>2017</span><i>480</i></div>
          <div class="bar" style="--h:65%"><span>2018</span><i>650</i></div>
          <div class="bar" style="--h:78%"><span>2019</span><i>780</i></div>
          <div class="bar" style="--h:88%"><span>2020</span><i>880</i></div>
        </div>
      </div>
      <p><em>Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</em></p>`,
    sample: `
      <p>The bar chart illustrates the changes in the number of students who went abroad to study English between 2015 and 2020.</p>
      <p>Overall, the figure rose considerably over the period, with the most significant growth occurring in the final three years.</p>
      <p>In 2015, roughly 400 students studied English abroad. This number climbed to 520 the following year before dipping slightly to 480 in 2017. However, from 2018 onwards, the trend turned sharply upward, reaching 650, then 780 in 2019, and peaking at 880 in 2020.</p>
      <p>In summary, although there was a minor fluctuation in 2017, the overall number of students more than doubled across the six-year period.</p>`,
    checklist: [
      "Sudahkah Anda menyebutkan 'overall' (tren utama)?",
      "Apakah Anda membandingkan angka (comparison)?",
      "Apakah Anda menulis minimal 150 kata?",
      "Apakah Anda memakai bahasa (past tense) dengan benar?",
      "Apakah Anda tidak menyalin kata dari pertanyaan (gunakan parafrasa)?",
    ],
    tips: [
      "Mulai dengan parafrasa pertanyaan.",
      "Laporkan 2–3 fitur utama, bukan semua data.",
      "Gunakan vocabulary untuk tren: rise, climb, increase, peak, dip, decline.",
    ],
  },
  {
    id: "wt2", level: "advanced", taskType: "2",
    title: "Task 2 — Opinion Essay",
    promptHTML: `
      <p>Some people believe that universities should focus on preparing students for employment, while others think the purpose of higher education is to provide knowledge for its own sake.</p>
      <p><em>Discuss both views and give your own opinion.</em></p>`,
    sample: `
      <p>Higher education has long been a subject of debate, with some arguing that its primary role is job preparation, while others value knowledge for its own sake. This essay will discuss both perspectives before presenting my own view.</p>
      <p>On the one hand, many contend that universities should be career-oriented. In an increasingly competitive job market, graduates need practical skills and industry connections to secure employment. Consequently, curricula tailored to employer demands help reduce youth unemployment and increase productivity.</p>
      <p>On the other hand, others maintain that education is inherently valuable. The pursuit of knowledge cultivates critical thinking, cultural awareness, and intellectual curiosity — qualities that benefit society beyond the workplace. Furthermore, not all disciplines, such as philosophy or pure science, have immediate vocational applications, yet they advance human understanding.</p>
      <p>In my view, the two purposes are not mutually exclusive. Universities should equip students with employable skills while also fostering a broad, critical education. A balanced approach prepares graduates for both a career and a meaningful intellectual life.</p>
      <p>In conclusion, although the debate is understandable, I believe higher education should serve both pragmatic and intellectual goals.</p>`,
    checklist: [
      "Apakah Anda mendiskusikan KEDUA sudut pandang?",
      "Apakah Anda menyatakan opini pribadi dengan jelas?",
      "Apakah ada introduction, body, dan conclusion yang jelas?",
      "Apakah Anda menulis minimal 250 kata?",
      "Apakah Anda menggunakan kata penghubung (linking words)?",
    ],
    tips: [
      "Gunakan struktur 'Discuss both views + opinion'.",
      "Sisipkan contoh konkret untuk memperkuat argumen.",
      "Jaga keseimbangan — diskusikan kedua sisi secara adil.",
    ],
  },
  {
    id: "wt3", level: "intermediate", taskType: "2",
    title: "Task 2 — Agree / Disagree",
    promptHTML: `
      <p>Governments should spend more money on public transport rather than building new roads.</p>
      <p><em>To what extent do you agree or disagree?</em></p>`,
    sample: `
      <p>As cities grow, governments must decide how to invest in transport. Some argue that public transport deserves more funding than new roads. I largely agree with this view, for reasons of efficiency, environment, and long-term planning.</p>
      <p>Firstly, public transport moves far more people per unit of space than private cars. A single train can replace hundreds of vehicles, easing congestion and saving commuters time. Spending on buses and railways therefore delivers better value for crowded urban areas.</p>
      <p>Secondly, expanding public transport supports environmental goals. Trains and electric buses produce far fewer emissions per passenger than cars, helping cities reduce air pollution and meet climate targets.</p>
      <p>Admittedly, roads are still necessary, especially in rural areas where public transport is impractical. However, governments can focus on maintaining existing roads rather than building new ones.</p>
      <p>In conclusion, I strongly agree that public transport should take priority, since it is more efficient and sustainable in the long run.</p>`,
    checklist: [
      "Apakah Anda menyatakan opini dengan jelas (agree/disagree)?",
      "Apakah setiap paragraf punya ide utama (topic sentence)?",
      "Apakah Anda menulis minimal 250 kata?",
      "Apakah Anda menggunakan kata penghubung yang alami?",
      "Apakah Anda menyertakan contoh atau alasan pendukung?",
    ],
    tips: [
      "Untuk agree/disagree, pilih posisi yang jelas sejak awal.",
      "Gunakan 'To what extent' — Anda boleh setuju sebagian.",
      "Sisipkan satu paragraf yang mengakui sisi lain (concession) agar seimbang.",
    ],
  },
  {
    id: "wt4", level: "expert", taskType: "1",
    title: "Task 1 — Proses (Process Diagram)",
    promptHTML: `
      <p>The diagram below shows the process of recycling glass bottles.</p>
      <div class="chart-placeholder">
        <strong>🔄 Process: Glass Bottle Recycling</strong>
        <div class="process-flow">
          <span>Collection</span> → <span>Sorting</span> → <span>Crushing</span> → <span>Melting</span> → <span>Moulding</span> → <span>New bottles</span>
        </div>
      </div>
      <p><em>Summarise the information by selecting and reporting the main features.</em></p>`,
    sample: `
      <p>The flow chart illustrates the stages involved in recycling glass bottles, from collection to the production of new bottles.</p>
      <p>Overall, the process is entirely linear and involves six main stages, beginning with the gathering of used bottles and ending with the creation of new ones.</p>
      <p>First, used bottles are collected, typically from households and recycling points, before being taken to a facility where they are sorted by colour and quality. Any unsuitable items are removed at this stage.</p>
      <p>Next, the selected glass is crushed into small fragments, known as cullet, which are then melted in a furnace at a very high temperature. The molten glass is finally poured into moulds and shaped into new bottles, ready for reuse.</p>
      <p>In summary, the recycling process transforms waste glass into new bottles through a sequence of collection, sorting, crushing, melting, and moulding.</p>`,
    checklist: [
      "Apakah Anda menyebutkan 'overall' (gambaran umum proses)?",
      "Apakah Anda menggunakan passive voice dan sequencing words (first, next, then)?",
      "Apakah Anda menulis minimal 150 kata?",
      "Apakah Anda tidak sekedar menyalin seluruh diagram?",
      "Apakah Anda menggunakan kosakata yang tepat (collect, sort, crush, melt, mould)?",
    ],
    tips: [
      "Untuk diagram proses, gunakan keterangan urutan: first, then, next, subsequently, finally.",
      "Gunakan passive voice: 'the glass is melted'.",
      "Jangan menebak informasi yang tidak ada di diagram.",
    ],
  },
  {
    id: "wt5", level: "beginner", taskType: "1",
    title: "Task 1 — Pie Chart",
    promptHTML: `
      <p>The pie charts below show the percentage of energy used by households in a city in 2010 and 2020.</p>
      <div class="chart-placeholder">
        <strong>📊 Pie Charts — Household Energy Use</strong>
        <div class="process-flow" style="margin-top:10px">
          <span>2010: ⚡ Electricity 40% · 🏠 Heating 30% · 🚗 Transport 20% · ✳️ Other 10%</span>
          <span>2020: ⚡ Electricity 45% · 🏠 Heating 25% · 🚗 Transport 20% · ✳️ Other 10%</span>
        </div>
      </div>
      <p><em>Summarise the information by selecting and reporting the main features.</em></p>`,
    sample: `
      <p>The pie charts compare the proportions of household energy use in a city in 2010 and 2020.</p>
      <p>Overall, electricity accounted for the largest share in both years, while heating declined notably over the decade.</p>
      <p>In 2010, electricity made up 40% of household energy, rising to 45% in 2020. By contrast, heating fell from 30% in 2010 to 25% in 2020.</p>
      <p>Transport remained stable at 20% in both years, and the 'other' category stayed constant at 10%.</p>
      <p>In summary, the most significant change was a shift away from heating towards electricity consumption.</p>`,
    checklist: [
      "Apakah Anda menyebutkan 'overall' (fitur utama)?",
      "Apakah Anda membandingkan data antar tahun?",
      "Apakah Anda menulis minimal 150 kata?",
      "Apakah Anda menggunakan bahasa yang tepat untuk melihat (account for, make up)?",
      "Apakah Anda tidak menyalin kata dari pertanyaan?",
    ],
    tips: [
      "Untuk pie chart, laporkan bagian terbesar & perubahan terbesar.",
      "Gunakan frasa seperti 'accounted for', 'made up', 'remained constant'.",
      "Bandingkan antar tahun, bukan hanya menyebutkan angka.",
    ],
  },
  {
    id: "wt6", level: "intermediate", taskType: "1",
    title: "Task 1 — Line Graph",
    promptHTML: `
      <p>The line graph below shows the number of visitors to three museums in a city from 2010 to 2020.</p>
      <div class="chart-placeholder">
        <strong>📈 Line Graph — Museum Visitors (thousands)</strong>
        <div class="process-flow" style="margin-top:10px">
          <span>2010: History 50 · Art 80 · Science 60</span>
          <span>2015: History 70 · Art 90 · Science 75</span>
          <span>2020: History 95 · Art 85 · Science 110</span>
        </div>
      </div>
      <p><em>Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</em></p>`,
    sample: `
      <p>The line graph illustrates changes in the number of visitors to three museums between 2010 and 2020.</p>
      <p>Overall, the History and Science museums saw growth, while the Art museum experienced a slight decline at the end of the period.</p>
      <p>The History museum attracted 50,000 visitors in 2010, rising steadily to 70,000 by 2015 and reaching 95,000 in 2020.</p>
      <p>The Science museum began at 60,000, increased to 75,000 in 2015, and then rose sharply to 110,000 in 2020, becoming the most popular. In contrast, the Art museum, which started with the highest figure of 80,000, peaked at 90,000 in 2015 before falling to 85,000.</p>
      <p>In summary, while Art remained relatively stable, History and Science both grew considerably.</p>`,
    checklist: [
      "Apakah Anda menyebutkan tren 'overall'?",
      "Apakah Anda membandingkan antar museum?",
      "Apakah Anda menulis minimal 150 kata?",
      "Apakah Anda menggunakan vocabulary tren (rise, grow, peak, decline)?",
      "Apakah Anda menyebutkan angka pendukung?",
    ],
    tips: [
      "Gunakan past tense (rose, declined) karena data sudah lampau.",
      "Deskripsikan arah tren, bukan tiap titik data.",
      "Bandingkan garis yang menonjol.",
    ],
  },
  {
    id: "wt7", level: "advanced", taskType: "2",
    title: "Task 2 — Cause / Solution",
    promptHTML: `
      <p>In many countries, the proportion of young people who are overweight is increasing.</p>
      <p><em>What are the causes of this problem, and what solutions can you suggest?</em></p>`,
    sample: `
      <p>Rising levels of obesity among young people have become a serious concern in many nations. This essay will examine the main causes before suggesting workable solutions.</p>
      <p>The primary cause is a sedentary lifestyle. Many young people spend long hours on screens, leaving little time for physical activity. In addition, the widespread availability of cheap, processed food high in sugar and fat promotes unhealthy eating habits.</p>
      <p>Another contributing factor is the decline of physical education in schools, often squeezed out by academic priorities. As a result, many children do not develop regular exercise habits.</p>
      <p>To address this, governments could fund public campaigns that promote healthy eating and exercise, and restrict advertising of junk food aimed at children. Schools could also reintroduce compulsory daily sports and provide healthier cafeteria options.</p>
      <p>In conclusion, although the causes are rooted in modern lifestyles, a combination of policy, education, and school-based initiatives can significantly reduce childhood obesity.</p>`,
    checklist: [
      "Apakah Anda membahas penyebab (causes)?",
      "Apakah Anda memberikan solusi (solutions) yang realistis?",
      "Apakah Anda menulis minimal 250 kata?",
      "Apakah ada introduction, body, dan conclusion?",
      "Apakah Anda menggunakan kata penghubung?",
    ],
    tips: [
      "Bagi menjadi dua paragraf: penyebab lalu solusi.",
      "Gunakan kata seperti 'due to', 'as a result', 'to address this'.",
      "Beri contoh konkret untuk tiap solusi.",
    ],
  },
  {
    id: "wt8", level: "expert", taskType: "2",
    title: "Task 2 — Discuss Both Views (Space Exploration)",
    promptHTML: `
      <p>Some people believe that space exploration is a waste of money and should be spent on solving problems on Earth. Others argue that it is essential for human progress.</p>
      <p><em>Discuss both views and give your own opinion.</em></p>`,
    sample: `
      <p>Whether public funds should be directed towards space exploration or terrestrial problems is a source of ongoing debate. This essay will weigh both arguments before offering a personal view.</p>
      <p>Those who oppose space spending argue that billions could instead combat poverty, disease, and climate change. They point to the urgent, measurable needs on Earth, arguing that a single exploration mission can cost more than entire health programmes in developing nations.</p>
      <p>Conversely, supporters contend that space exploration drives scientific and technological breakthroughs that benefit everyone — from satellite-based weather forecasting to medical innovations. They also argue that it inspires education and long-term survival beyond our planet.</p>
      <p>In my opinion, the two goals are not mutually exclusive. Governments can invest wisely in space while also addressing domestic challenges, provided budgets are balanced and outcomes are scrutinised.</p>
      <p>In conclusion, although the criticism has merit, I believe a measured commitment to space exploration remains worthwhile alongside solving earthly problems.</p>`,
    checklist: [
      "Apakah Anda mendiskusikan KEDUA sudut pandang?",
      "Apakah Anda menyatakan opini pribadi?",
      "Apakah Anda menggunakan nada akademik & kosakata presisi?",
      "Apakah Anda menulis minimal 250 kata?",
      "Apakah semua paragraf terhubung dengan baik?",
    ],
    tips: [
      "Gunakan struktur 'discuss both views + opinion'.",
      "Variasi kalimat: passive, conditional, complex clauses.",
      "Hindari kata informal; gunakan 'conversely', 'nonetheless'.",
    ],
  },
];

/* ---------- SPEAKING ---------- */
const SPEAKING_TOPICS = [
  {
    id: "sp1", level: "beginner", part: "1",
    title: "Part 1 — Pertanyaan Pribadi",
    intro: "Part 1 berlangsung 4–5 menit. Examiner bertanya tentang hal-hal umum: rumah, pekerjaan, hobi, keluarga.",
    questions: [
      "Can you tell me about your hometown?",
      "What do you do in your free time?",
      "Do you prefer living in a house or an apartment? Why?",
      "What is your favourite food and why?",
      "Tell me about your family.",
    ],
    sampleBand: {
      5: "Jawaban pendek & sederhana: 'My hometown is Bandung. It is a big city. I like it because it is cool.'",
      7: "Jawaban jelas dengan alasan: 'I come from Bandung, a city known for its cool climate and culinary scene. Although it is crowded, I appreciate its vibrant lifestyle and friendly people.'",
      9: "Jawaban natural, detail, dan fleksibel dengan variasi kosakata.",
    },
    tips: [
      "Jawab dengan 2–3 kalimat — jangan hanya 'yes/no'.",
      "Tambahkan alasan atau contoh.",
      "Santai dan tersenyum; ini bukan wawancara formal.",
    ],
  },
  {
    id: "sp2", level: "intermediate", part: "2",
    title: "Part 2 — Cue Card",
    intro: "Part 2: Anda mendapat kartu berisi topik. Anda punya 1 menit menyiapkan dan berbicara 1–2 menit.",
    cueCard: {
      topic: "Describe a book you have read that you really enjoyed.",
      bullets: ["What the book was", "When and where you read it", "What it was about", "And explain why you enjoyed it so much"],
    },
    sampleBand: {
      5: "Sederhana, pengulangan: 'I read a book. It is interesting. I like it very much.'",
      7: "Struktur jelas + detail: 'I would like to talk about a novel called... I read it last year during my holiday. It tells the story of... What fascinated me most was the character development, because...'",
      9: "Alur lancar, kosakata kaya, dan kedalaman diskusi.",
    },
    tips: [
      "Gunakan 1 menit untuk mencatat poin kecil di kertas catatan.",
      "Struktur: apa → kapan/di mana → isi → kenapa menikmatinya.",
      "Berbicaralah terus sampai examiner meminta berhenti.",
    ],
  },
  {
    id: "sp3", level: "advanced", part: "3",
    title: "Part 3 — Diskusi & Opini",
    intro: "Part 3 berlangsung 4–5 menit. Examiner bertanya pertanyaan abstrak terkait topik Part 2.",
    questions: [
      "Why do you think reading is important for young people?",
      "Do you believe printed books will disappear in the future? Why / why not?",
      "How can governments encourage more people to read?",
      "Is there a difference between reading for education and reading for pleasure?",
    ],
    sampleBand: {
      5: "Pendek, pengulangan, sedikit pengembangan.",
      7: "Opini jelas + alasan + contoh: 'In my view, reading builds empathy and critical thinking. For example, fiction allows readers to experience other perspectives...'",
      9: "Jawaban bernuansa, membahas beberapa sisi, dan kosakata akademik.",
    },
    tips: [
      "Kembangkan jawaban dengan 'reason + example + consequence'.",
      "Gunakan kata seperti 'in my view', 'it depends', 'arguably'.",
      "Jangan takut untuk menunjukkan nuansa ('well, it depends...').",
    ],
  },
  {
    id: "sp4", level: "expert", part: "3",
    title: "Speaking — Fluency & Naturalness (Gabungan)",
    intro: "Latihan menyeluruh untuk menguji kefasihan, koherensi, dan naturalitas. Gunakan timer bicara.",
    questions: [
      "How has technology changed the way people communicate?",
      "Do you think online education will completely replace traditional classrooms? Why or why not?",
      "What are the benefits and drawbacks of living in a big city?",
      "How can people strike a balance between work and personal life?",
    ],
    sampleBand: {
      5: "Berhenti lama, banyak pengulangan, kalimat pendek.",
      7: "Fasih dengan jeda alami, sedikit keraguan yang wajar.",
      9: "Fasih sepanjang waktu, jeda hanya untuk konten, kosakata dan idiom tepat.",
    },
    tips: [
      "Berlatih dengan timer: berbicara 1–2 menit nonstop.",
      "Rekam diri Anda dan dengarkan kembali.",
      "Hindari 'um'/'uh' — ganti dengan jeda singkat.",
    ],
  },
  {
    id: "sp5", level: "beginner", part: "1",
    title: "Part 1 — Makanan & Memasak",
    intro: "Part 1 berlangsung 4–5 menit. Jawab dengan 2–3 kalimat per pertanyaan.",
    questions: [
      "Do you like cooking? Why or why not?",
      "What is your favourite food?",
      "Do you prefer eating at home or eating out?",
      "What foods are popular in your country?",
    ],
    sampleBand: {
      5: "Jawaban pendek: 'I like cooking. I cook noodles. It is easy.'",
      7: "Jawaban jelas dengan alasan: 'Yes, I enjoy cooking, especially on weekends, because it helps me relax and eat more healthily.'",
      9: "Jawaban natural & detail dengan kosakata kaya.",
    },
    tips: [
      "Tambahkan alasan ('because...') dan contoh.",
      "Jangan menjawab hanya 'yes/no'.",
      "Gunakan kosakata makanan: homemade, spicy, healthy, recipe.",
    ],
  },
  {
    id: "sp6", level: "intermediate", part: "2",
    title: "Part 2 — Cue Card (Tempat)",
    intro: "Part 2: Anda mendapat kartu topik, 1 menit persiapan, lalu berbicara 1–2 menit.",
    cueCard: {
      topic: "Describe a place you like to visit.",
      bullets: ["Where it is", "How often you go there", "What you do there", "And explain why you enjoy visiting it"],
    },
    sampleBand: {
      5: "Sederhana & pengulangan.",
      7: "Struktur jelas + detail + alasan.",
      9: "Alur lancar, kosakata deskriptif kaya.",
    },
    tips: [
      "Catat 3–4 poin kecil saat persiapan.",
      "Gunakan kata sifat deskriptif: peaceful, lively, scenic.",
      "Hubungkan tiap poin dengan alasan.",
    ],
  },
  {
    id: "sp7", level: "advanced", part: "3",
    title: "Part 3 — Teknologi & Pendidikan",
    intro: "Part 3: diskusi abstrak. Kembangkan jawaban dengan alasan + contoh.",
    questions: [
      "How has technology changed the way students learn?",
      "Do you think online learning will ever fully replace traditional classrooms? Why / why not?",
      "What are the disadvantages of children using technology too much?",
      "How can governments ensure everyone has access to digital education?",
    ],
    sampleBand: {
      5: "Pendek, sedikit pengembangan.",
      7: "Opini + alasan + contoh: 'In my view, technology has made learning more flexible, for example through online libraries and video lessons.'",
      9: "Bernuansa, membahas beberapa sisi, kosakata akademik.",
    },
    tips: [
      "Gunakan 'in my view', 'arguably', 'it depends'.",
      "Kembangkan: reason → example → consequence.",
      "Jangan takut menunjukkan nuansa.",
    ],
  },
  {
    id: "sp8", level: "expert", part: "3",
    title: "Speaking — Isu Global & Kesehatan",
    intro: "Latihan tingkat expert untuk kefasihan & kedalaman. Gunakan timer bicara.",
    questions: [
      "Why do you think some people ignore health advice?",
      "How can societies encourage healthier lifestyles?",
      "What role should governments play in public health?",
      "Is individual responsibility or government action more important for a healthy society?",
    ],
    sampleBand: {
      5: "Berhenti lama, pengulangan.",
      7: "Fasih dengan jeda alami.",
      9: "Fasih, kosakata tepat, argumen bernuansa.",
    },
    tips: [
      "Berbicara nonstop 1–2 menit dengan timer.",
      "Gunakan idiom alami (mis. 'a double-edged sword').",
      "Rekam & dengarkan ulang untuk perbaikan.",
    ],
  },
];

/* ---------- GRAMMAR LESSONS ---------- */
const GRAMMAR_LESSONS = [
  {
    id: "gr1", level: "beginner", title: "Tenses Dasar",
    body: `
      <p>Present, past, dan future simple adalah fondasi kalimat.</p>
      <table class="tbl">
        <tr><th>Tense</th><th>Bentuk</th><th>Contoh</th></tr>
        <tr><td>Present Simple</td><td>V1 (+s/es)</td><td>She <em>works</em> daily.</td></tr>
        <tr><td>Past Simple</td><td>V2</td><td>They <em>visited</em> last year.</td></tr>
        <tr><td>Future Simple</td><td>will + V1</td><td>I <em>will apply</em> soon.</td></tr>
      </table>`,
    quiz: [
      { q: "She ___ (work) in a bank.", options: ["work", "works", "working"], answer: 1 },
      { q: "We ___ (go) to Bali last summer.", options: ["go", "went", "gone"], answer: 1 },
      { q: "I ___ (call) you tomorrow.", options: ["will call", "called", "call"], answer: 0 },
    ],
  },
  {
    id: "gr2", level: "beginner", title: "Article: a / an / the",
    body: `
      <p>Gunakan <em>a/an</em> untuk benda yang belum spesifik, dan <em>the</em> untuk yang sudah diketahui.</p>
      <ul>
        <li>a + konsonan: <em>a university</em> (bunyi /juː/)</li>
        <li>an + vokal: <em>an hour</em> (bunyi /ˈaʊər/)</li>
        <li>the + spesifik: <em>the government announced...</em></li>
      </ul>`,
    quiz: [
      { q: "She adopted ___ cat from the shelter.", options: ["a", "an", "the"], answer: 0 },
      { q: "He is ___ honest man.", options: ["a", "an", "the"], answer: 1 },
      { q: "___ sun rises in the east.", options: ["A", "An", "The"], answer: 2 },
    ],
  },
  {
    id: "gr3", level: "intermediate", title: "Conditionals (Jika-Maka)",
    body: `
      <p>Conditional dipakai untuk situasi kondisi & hasil.</p>
      <table class="tbl">
        <tr><th>Jenis</th><th>Bentuk</th><th>Contoh</th></tr>
        <tr><td>Zero</td><td>If + present, present</td><td>If you heat ice, it melts.</td></tr>
        <tr><td>First</td><td>If + present, will</td><td>If I study, I will pass.</td></tr>
        <tr><td>Second</td><td>If + past, would</td><td>If I had time, I would travel.</td></tr>
        <tr><td>Third</td><td>If + past perfect, would have</td><td>If I had known, I would have gone.</td></tr>
      </table>`,
    quiz: [
      { q: "If it rains, the match ___ cancelled.", options: ["is", "was", "would be"], answer: 0 },
      { q: "If I were rich, I ___ a big house.", options: ["will buy", "would buy", "bought"], answer: 1 },
      { q: "If she had studied, she ___ the exam.", options: ["would pass", "would have passed", "passed"], answer: 1 },
    ],
  },
  {
    id: "gr4", level: "intermediate", title: "Passive Voice",
    body: `
      <p>Passive menekankan aksi/orang yang menerima, bukan pelaku.</p>
      <p class="example">Bentuk: <strong>be + V3 (past participle)</strong> — <em>The test was taken by thousands of students.</em></p>
      <p>Gunakan passive dalam Writing akademik untuk tone yang lebih formal.</p>`,
    quiz: [
      { q: "A new bridge ___ in 2020.", options: ["built", "was built", "is building"], answer: 1 },
      { q: "The report ___ by the manager every week.", options: ["is written", "writes", "was writing"], answer: 0 },
      { q: "Rice ___ in many countries.", options: ["grows", "is grown", "grew"], answer: 1 },
    ],
  },
  {
    id: "gr5", level: "advanced", title: "Nominalization & Kalimat Kompleks",
    body: `
      <p>Nominalization = mengubah kata kerja menjadi kata benda untuk membuat tulisan lebih formal & padat.</p>
      <table class="tbl">
        <tr><th>Kalimat</th><th>Dengan nominalization</th></tr>
        <tr><td>The economy improved.</td><td>There was a significant improvement in the economy.</td></tr>
        <tr><td>People invest more.</td><td>The increase in investment is notable.</td></tr>
      </table>
      <p>Kalimat kompleks = klausa utama + klausa bawahan (because, although, which, that).</p>`,
    quiz: [
      { q: "Pilih kalimat dengan nominalization:", options: ["Prices went up.", "There was a sharp rise in prices."], answer: 1 },
      { q: "Manakah klausa bawahan yang benar?", options: ["The book which I read it was great.", "The book which I read was great."], answer: 1 },
    ],
  },
  {
    id: "gr6", level: "expert", title: "Variasi Struktur & Nuansa",
    body: `
      <p>Di level expert, targetkan keragaman struktur tanpa mengorbankan kejelasan.</p>
      <ul>
        <li>Gunakan <em>cleft sentences</em>: "What matters most is..."</li>
        <li>Gunakan <em>inversion</em> formal: "Not only does it save money, but also..."</li>
        <li>Gunakan <em>participle clauses</em>: "Having reviewed the data, I concluded..."</li>
      </ul>`,
    quiz: [
      { q: "Pilih yang BENAR menurut kaidah formal:", options: ["Not only he saved money but also time.", "Not only did he save money but also time."], answer: 1 },
      { q: "Pilih kalimat alami:", options: ["Having finished the test, she felt relieved.", "Having finished she the test felt relieved."], answer: 0 },
    ],
  },
];
