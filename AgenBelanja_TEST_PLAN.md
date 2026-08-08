# AgenBelanja — MVP Test Plan

## Tujuan

Memastikan demo dapat berjalan berulang dari browser refresh dan semua guardrail utama bekerja: agent tidak boleh melebihi budget, payment hanya dapat dimulai setelah deal, serta setiap hasil memiliki status yang jelas.

## Cara Menggunakan

- Jalankan test setelah setiap integrasi besar.
- Catat hasil `Pass`, `Fail`, atau `Blocked`.
- Perbaiki seluruh test kategori P0 sebelum menambah fitur/polish.
- Gunakan seed scenario agar hasil konsisten saat demo.

## P0 — Blocking Demo

| ID | Skenario | Langkah | Hasil Diharapkan | Status |
| --- | --- | --- | --- | --- |
| P0-01 | Input valid | Isi item dan budget positif, lalu submit | Negosiasi dimulai dan status menjadi `NEGOTIATING` |  |
| P0-02 | Input item kosong | Kosongkan item, klik submit | Validasi tampil; negosiasi tidak dimulai |  |
| P0-03 | Budget tidak valid | Isi budget 0, negatif, atau teks | Validasi tampil; negosiasi tidak dimulai |  |
| P0-04 | Parallel quote | Jalankan scenario sukses | Tiga vendor menerima request quote dan UI menunjukkan tiga respons |  |
| P0-05 | Harga langsung cocok | Jalankan scenario harga langsung sesuai | Agent memilih vendor dengan harga terendah yang <= budget |  |
| P0-06 | Negosiasi berhasil | Jalankan scenario negotiation_success | Agent mengirim counter-offer, satu vendor menerima, dan harga akhir <= budget |  |
| P0-07 | Semua vendor menolak | Jalankan scenario all_vendors_reject | Status `NO_DEAL`; tidak ada vendor terpilih |  |
| P0-08 | Guardrail budget | Gunakan scenario di mana semua harga > budget | Tidak ada offer atau final price > budget |  |
| P0-09 | Payment gate | Coba akses confirm sebelum deal | Endpoint menolak request; payment tidak diproses |  |
| P0-10 | Payment tersedia setelah deal | Jalankan negosiasi sukses | Tombol payment tampil hanya setelah `NEGOTIATION_COMPLETE` |  |
| P0-11 | Payment sukses | Jalankan payment real atau demo mode | Status akhir `SETTLEMENT_SUCCESS`; receipt tampil |  |
| P0-12 | Refresh dan reset | Refresh browser/reset app | Aplikasi kembali ke state yang dapat menjalankan demo baru |  |

## P1 — Penting untuk Kualitas Demo

| ID | Skenario | Langkah | Hasil Diharapkan | Status |
| --- | --- | --- | --- | --- |
| P1-01 | Timeline | Jalankan scenario negotiation_success | Timeline berurutan, mudah dibaca, dan memuat quote/offer/respons |  |
| P1-02 | Vendor cards | Jalankan semua scenario | Badge dan harga setiap vendor sesuai state sebenarnya |  |
| P1-03 | Tie-break | Buat dua vendor menerima harga yang sama | Sistem memilih vendor berdasarkan urutan ID yang ditetapkan |  |
| P1-04 | Wallet belum connect | Klik payment tanpa wallet | Tampil pesan untuk menghubungkan wallet, tanpa crash |  |
| P1-05 | User cancel wallet | Tolak approval wallet | Status/alert menjelaskan otorisasi dibatalkan |  |
| P1-06 | Settlement failed | Aktifkan controlled error atau response gagal | Status `SETTLEMENT_FAILED`; tidak menampilkan receipt sukses |  |
| P1-07 | Loading state | Lambatkan respons simulator | UI menunjukkan loading/processing, tombol mencegah klik ganda |  |
| P1-08 | Mobile layout | Buka di viewport mobile | Form, vendor cards, timeline, dan CTA tetap terbaca |  |

## P2 — Jika Ada Waktu

| ID | Skenario | Langkah | Hasil Diharapkan | Status |
| --- | --- | --- | --- | --- |
| P2-01 | Transaction reference | Jalankan x402 settlement nyata | Transaction hash/reference tampil dan dapat disalin |  |
| P2-02 | Wrong network | Hubungkan wallet di jaringan selain Monad Testnet | UI memberi instruksi pindah jaringan |  |
| P2-03 | Insufficient funds | Gunakan wallet tanpa saldo test token cukup | UI menjelaskan saldo tidak cukup tanpa error mentah |  |
| P2-04 | Accessibility | Navigasi dengan keyboard | Input dan CTA dapat difokuskan serta dibaca |  |

## Test API Minimum

### Negotiate Endpoint

```text
POST /api/orders/negotiate
```

- Request valid menghasilkan `orderId` dan status akhir yang benar.
- `budgetAmount` tidak valid menghasilkan error 400.
- Response menyertakan timeline.
- Harga akhir tidak melebihi budget.

### Confirm Endpoint

```text
POST /api/orders/:orderId/confirm
```

- Order tidak ditemukan menghasilkan error yang aman.
- Order dengan status selain `NEGOTIATION_COMPLETE` tidak dapat dibayar.
- Tanpa bukti payment, respons mengikuti flow `402 Payment Required` bila x402 nyata aktif.
- Payment sukses menghasilkan `SETTLEMENT_SUCCESS`.
- Payment gagal menghasilkan `SETTLEMENT_FAILED` dan tidak ada success receipt.

## Regression Checklist Akhir

- [ ] Tidak ada API key/private key di frontend atau Git.
- [ ] Tidak ada data floor price di UI pengguna.
- [ ] Tidak ada harga final yang melebihi budget.
- [ ] Tidak ada tombol payment dalam no-deal state.
- [ ] Tidak ada console error saat happy path.
- [ ] Tidak ada build error atau type error.
- [ ] UI tidak menampilkan status sukses sebelum respons settlement diterima.
- [ ] Mode payment nyata dan demo mode memiliki badge/copy yang jelas berbeda.
- [ ] Semua content demo menggunakan test data, bukan data transaksi nyata.
