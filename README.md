# Peta Kerentanan Fiskal Global

Dashboard analitik fiskal global: indeks early warning, klasterisasi arketipe risiko, deteksi anomali, dan proyeksi lanjutan untuk 196 negara. Dibangun dari data IMF World Economic Outlook (vintage April 2026), dengan sorotan khusus posisi Indonesia dibanding negara ASEAN & emerging market lain.

Dibuat untuk mendukung produk Data & Analitik Fiskal, seleksi JF PKN Terampil.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Build untuk produksi

```bash
npm run build
npm run preview   # cek hasil build lokal
```

Hasil build ada di folder `dist/` — tinggal deploy ke Vercel/Netlify/hosting statis apa pun.

## Struktur data

Semua data dashboard ada di satu file: `public/fiskal_dashboard.json`. File ini dihasilkan oleh notebook `Peta_Kerentanan_Fiskal_Global.ipynb` (lihat folder notebook terpisah). Kalau mau update data, jalankan ulang notebook lalu timpa file JSON ini.

## Halaman

- **Peta Global** — globe 3D interaktif, negara diwarnai sesuai status indeks kerentanan fiskal (Aman/Waspada/Siaga), bisa difilter per benua, klik titik untuk detail.
- **Klaster Risiko** — 4 arketipe risiko fiskal hasil K-Means, sebaran PCA, dan daftar negara anomali (Isolation Forest).
- **Indonesia** — perbandingan Indonesia dengan negara ASEAN & emerging market G20, tren skor kerentanan 2016-2030.
- **Proyeksi** — perpanjangan proyeksi ML (LightGBM) 2031-2035, melanjutkan proyeksi resmi IMF yang berhenti di 2030.
- **Metodologi** — rincian indeks, hasil regresi panel (fiscal reaction function + uji ambang utang), dan batasan model.

## Stack

React + Vite, Chart.js untuk grafik, react-globe.gl (Three.js) untuk globe 3D. Tanpa dependensi ke logo/aset lembaga eksternal — ikon dan globe dibuat sendiri.
