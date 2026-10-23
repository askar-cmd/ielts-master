# IELTS Master 🎯

Aplikasi web untuk **simulasi IELTS lengkap** dan **belajar IELTS dari level dasar hingga expert**, berjalan langsung di browser tanpa perlu menginstal apa pun.

## Cara Menjalankan

1. Buka folder ini di File Explorer.
2. Klik dua kali file **`index.html`** untuk membukanya di browser (Chrome/Edge/Firefox).
3. Selesai — tidak perlu server, koneksi internet, atau instalasi.

> 💡 Semua progress (pelajaran selesai, skor kuis, kata yang dipelajari) tersimpan otomatis di browser (localStorage).

## Fitur

- **Jalur Belajar berjenjang** — Kurikulum 4 level: Beginner → Intermediate → Advanced → Expert, dengan pelajaran campuran semua skill.
- **Listening** (88 latihan) — Audio simulasi memakai Text-to-Speech (TTS) bawaan browser + soal pilihan ganda, True/False, isian singkat. (8 asli + 80 baru: 20 per level Beginner–Expert)
- **Reading** (10 passage) — Passage + berbagai tipe soal: pilihan ganda, **True/False/Not Given**, **Matching headings**, melengkapi kalimat, dan jawaban singkat.
- **Writing** (8 task) — Task 1 & Task 2 lengkap dengan prompt, contoh jawaban band tinggi, timer (20/40 menit), dan checklist evaluasi diri.
- **Speaking** (8 topik) — Part 1–3 dengan pertanyaan, contoh band 5/7/9, dan timer (persiapan 1 menit, berbicara 2 menit).
- **Vocabulary** — 6 set kosakata per topik/level, mode belajar kartu + kuis.
- **Grammar** — 6 pelajaran tata bahasa dengan kuis singkat.
- **Tes Simulasi** — Simulasi penuh Listening → Reading → Writing → Speaking dengan timer dan estimasi band.
- **Ujian per Level 🎓** — Ujian per skill di setiap level dengan **skor band (1–9)** per skill, rapor nilai, dan saran peningkatan.
- **Bank Latihan 🏦** — ≥100 item latihan per komponen (Listening 112, Reading 112, Writing 115, Speaking 110, Grammar 124, Vocabulary 450) untuk drill mandiri dengan penilaian otomatis.
- **Mode Campuran 🎲** — Soal acak dari semua komponen dalam satu sesi (10/20/30 soal) dengan skor & estimasi band.
- **Pelacakan Skor di Dasbor** — Statistik terbaik/terakhir & jumlah sesi per komponen ditampilkan di dasbor.
- **Pembahasan setelah kuis/simulasi 📋** — Setelah selesai, ditampilkan review per soal: jawaban Anda, jawaban benar, dan penjelasan (sumber/passage/audio, kategori aturan grammar, arti kosakata).
- **Progress & Skor** — Dasbor menampilkan progress total, level aktif, hasil latihan terakhir, dan streak harian 🔥.

## Struktur File

```
D:\IELTS\
├── index.html           ← halaman utama aplikasi
├── css/
│   └── style.css        ← gaya/tema
├── js/
│   ├── data-core.js     ← level, jalur belajar, writing, speaking, grammar
│   ├── data-reading.js  ← konten passage & soal Reading
│   ├── data-listening.js← konten script & soal Listening
│   ├── data-vocab.js    ← kosakata
│   └── app.js           ← mesin aplikasi (router, kuis, penilaian, TTS, progress)
└── README.md
```

## Cara Menambah Konten Baru

Mudah untuk menambah soal atau pelajaran baru:

- **Reading baru**: tambahkan objek ke `READING_LIST` di `js/data-reading.js`.
- **Listening baru**: tambahkan objek ke `LISTENING_LIST` di `js/data-listening.js` (isi `script` akan dibacakan via TTS).
- **Topik Writing/Speaking**: tambahkan ke `WRITING_TASKS` / `SPEAKING_TOPICS` di `js/data-core.js`.
- **Set kosakata**: tambahkan ke `VOCAB_SETS` di `js/data-vocab.js`.
- **Pelajaran jalur belajar**: tambahkan ke `LESSONS` di `js/data-core.js`.

### Tipe Soal yang Didukung

| Tipe | Keterangan |
|------|-------------|
| `mcq` | Pilihan ganda (satu jawaban) |
| `tfng` | TRUE / FALSE / NOT GIVEN |
| `match` | Mencocokkan paragraf dengan judul |
| `fill` | Melengkapi kalimat (tanda `_____`) |
| `short` | Jawaban singkat |

## Catatan

- Fitur audio memakai **SpeechSynthesis** bawaan browser. Suara bisa bervariasi tergantung sistem/browser.
- Untuk pengalaman terbaik, gunakan **Chrome atau Edge** terbaru.
