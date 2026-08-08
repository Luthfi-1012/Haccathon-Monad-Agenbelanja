# AgenBelanja — MVP 6 Jam

## Tujuan Demo

Mendemonstrasikan agentic commerce: pengguna memasukkan item dan batas anggaran, AgenBelanja meminta quote dari tiga vendor simulasi secara paralel, melakukan satu counter-offer bila perlu, memilih vendor yang menerima harga, lalu menjalankan settlement x402 pada Monad Testnet atau fallback flow HTTP 402 yang jelas.

## Definition of Done

Demo dianggap selesai apabila pengguna dapat:

1. Menghubungkan wallet atau melihat mode demo wallet yang aktif.
2. Memasukkan nama item dan batas anggaran.
3. Menjalankan negosiasi dengan tiga vendor simulasi secara bersamaan.
4. Melihat quote, counter-offer, dan respons accept/reject dalam timeline.
5. Melihat vendor terpilih serta harga akhir yang tidak melebihi budget.
6. Menjalankan satu alur payment setelah negosiasi berhasil.
7. Melihat status settlement berhasil atau gagal.

## Scope Wajib

- Satu halaman aplikasi responsif.
- Form `item_description` dan `budget_amount`.
- Tiga vendor simulasi dengan `initial_price` dan `floor_price` yang sudah ditetapkan dalam seed data.
- Rule engine deterministik untuk evaluasi budget dan negosiasi.
- Pengiriman quote ke tiga vendor secara paralel.
- Maksimal satu counter-offer per vendor.
- Larangan membuat offer di atas budget.
- Status vendor: `WAITING`, `QUOTED`, `NEGOTIATING`, `ACCEPTED`, `REJECTED`.
- Timeline negosiasi yang menampilkan kejadian secara berurutan.
- Hasil akhir: vendor terpilih, harga awal, harga akhir, dan estimasi penghematan.
- Skenario `NEGOTIATION_COMPLETE` dan `NO_DEAL`.
- Tombol payment hanya muncul bila vendor terpilih.
- Satu endpoint payment-protected x402 atau fallback demonstrasi HTTP 402.
- Status `PAYMENT_REQUIRED`, `PAYMENT_PROCESSING`, `SETTLEMENT_SUCCESS`, dan `SETTLEMENT_FAILED`.

## Scope Penting Jika Waktu Tersisa

- Koneksi MetaMask nyata.
- Validasi pengguna berada di Monad Testnet.
- x402 settlement nyata melalui facilitator.
- Receipt dengan transaction hash.
- Pesan alasan keputusan agent yang mudah dibaca.
- Animasi singkat saat quote dan respons vendor diterima.

## Dilarang Dikerjakan

- API AI atau LLM.
- Login, akun pengguna, dan database produksi.
- Katalog atau pencarian produk nyata.
- Integrasi marketplace atau vendor nyata.
- Smart contract custom.
- Negosiasi lebih dari satu counter-offer per vendor.
- Riwayat transaksi atau sesi belanja.
- Reputasi vendor.
- Admin dashboard.
- Preferensi pengiriman, lokasi, rating, atau metode pemenuhan pesanan.
- Retry payment otomatis.

## Skenario Seed Demo

### Skenario 1 — Harga langsung sesuai budget

- Item: Keyboard mekanikal
- Budget: 50 USDC
- Vendor A: harga awal 48 USDC, floor price 45 USDC
- Vendor B: harga awal 55 USDC, floor price 50 USDC
- Vendor C: harga awal 62 USDC, floor price 56 USDC
- Hasil: AgenBelanja memilih Vendor A tanpa counter-offer.

### Skenario 2 — Negosiasi berhasil

- Item: Headset gaming
- Budget: 50 USDC
- Vendor A: harga awal 58 USDC, floor price 52 USDC
- Vendor B: harga awal 60 USDC, floor price 49 USDC
- Vendor C: harga awal 64 USDC, floor price 57 USDC
- Counter-offer agent: 50 USDC
- Hasil: Vendor B menerima; agent memilih Vendor B pada harga 50 USDC.

### Skenario 3 — Semua vendor menolak

- Item: Mouse wireless
- Budget: 35 USDC
- Vendor A: harga awal 48 USDC, floor price 42 USDC
- Vendor B: harga awal 45 USDC, floor price 40 USDC
- Vendor C: harga awal 52 USDC, floor price 45 USDC
- Counter-offer agent: 35 USDC
- Hasil: Semua vendor menolak; payment tidak tersedia.

## Aturan Agent

```text
1. Kirim permintaan quote ke Vendor A, B, dan C secara paralel.
2. Jika ada harga awal <= budget, pilih harga terendah di antara offer yang sesuai.
3. Jika tidak ada harga awal <= budget, kirim satu counter-offer sebesar budget ke setiap vendor.
4. Vendor menerima jika counter-offer >= floor_price; selain itu vendor menolak.
5. Jika satu atau lebih vendor menerima, pilih harga terendah. Jika harga sama, pilih vendor dengan urutan ID alfabetis untuk demo.
6. Jika tidak ada vendor menerima, set status menjadi NO_DEAL dan jangan tampilkan tombol payment.
7. Jangan pernah mengirim offer > budget.
```

## Timebox 6 Jam

| Waktu | Target | Exit Criteria |
| --- | --- | --- |
| 00:00–00:20 | Setup proyek dan struktur | Aplikasi kosong berjalan, repository dibuat setelah hackathon dimulai |
| 00:20–01:20 | Vendor simulator dan rule engine | Tiga skenario seed berhasil melalui test lokal |
| 01:20–02:20 | UI inti dan state | Form, tiga kartu vendor, timeline, hasil akhir tampil |
| 02:20–03:15 | Integrasi frontend-backend | Skenario 1–3 dapat dijalankan dari UI |
| 03:15–04:15 | x402 + Monad | Timebox 60 menit untuk satu flow payment nyata |
| 04:15–05:00 | Fallback dan error state | 402/demo fallback, no-deal, dan payment failed tampil baik |
| 05:00–05:35 | Polish dan testing | Tidak ada error blocking pada happy path |
| 05:35–06:00 | README, submission, dan latihan demo | Demo dapat dijalankan ulang dari awal |

## Aturan Fallback x402

- Mulai x402 nyata hanya setelah core negotiation berfungsi.
- Batasi debugging x402 maksimal 60 menit.
- Jika belum ada settlement nyata yang berhasil pada akhir timebox, aktifkan `DEMO_PAYMENT_MODE=true`.
- Pada demo mode, endpoint harus tetap memperlihatkan urutan status `402 Payment Required` → `Payment Authorized` → `Settlement Success` atau `Settlement Failed`.
- Jelaskan secara jujur pada README bahwa demo mode adalah fallback; jangan mengklaim transaction hash nyata bila tidak ada.
