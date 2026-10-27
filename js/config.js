/* ============================================================
   config.js — Konfigurasi & sistem Aktivasi Premium
   ============================================================

   ⚠️ CATATAN PENTING (jujur):
   Aplikasi ini STATIS murni (tanpa server/database). Semua
   validasi kode terjadi di browser. Ini cukup untuk menjual kode
   kepada pengguna umum, TETAPI seseorang yang paham teknis bisa
   membongkar file ini. Untuk keamanan penuh, Anda perlu memindahkan
   validasi ke server (backend) di masa depan.

   -----------------  CARA PAKAI  --------------------------
   1. Ganti MASTER_SECRET dengan string rahasia Anda sendiri.
   2. Pilih ADMIN_PASSWORD untuk membuka generator kode.
   3. Buka aplikasi → menu "⭐ Premium" → login sebagai admin
      → Generate kode → bagikan kode ke pembeli.
   4. Pembeli memasukkan kode di halaman Premium → level
      Intermediate/Advanced/Expert terbuka.
   ============================================================ */

const APP_CONFIG = {
  /* Level yang gratis */
  freeLevels: ["beginner"],
  /* Level premium (terkunci sampai aktivasi) */
  paidLevels: ["intermediate", "advanced", "expert"],

  /* GANTI dengan string rahasia Anda (acak, panjang). */
  MASTER_SECRET: "IELTS-MASTER-x8Kq2f7Lm4d9Np3Rv6Bt1Yw5Hs0ZcAe-8f2c7b4a-2026-SECRET",

  /* Kata sandi admin untuk membuka generator kode. GANTI juga. */
  ADMIN_PASSWORD: "AskarLet9f2c7b4a!",

  /* Awalan kode */
  CODE_PREFIX: "IELTS",
};

/* ---------- Hash ringan (cyrb53) ---------- */
function cyrb53(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function toBase36(num) {
  return Math.abs(num).toString(36).toUpperCase().slice(0, 8).padStart(8, "0");
}

/* ---------- Generate & verifikasi kode ---------- */
/* Format: PREFIX-XXXXXXXX-<index>   (8 digit base36 + indeks) */
function generateVipCode(index) {
  const h = cyrb53(APP_CONFIG.MASTER_SECRET + ":" + index);
  return APP_CONFIG.CODE_PREFIX + "-" + toBase36(h) + "-" + Math.abs(index);
}

function verifyVipCode(code) {
  if (!code) return false;
  const s = String(code).trim().toUpperCase();
  const re = new RegExp("^" + APP_CONFIG.CODE_PREFIX + "-([A-Z0-9]{8})-(\\d+)$");
  const m = s.match(re);
  if (!m) return false;
  const index = parseInt(m[2], 10);
  const expected = generateVipCode(index);
  return expected === s;
}
