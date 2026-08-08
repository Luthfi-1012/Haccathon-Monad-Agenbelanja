# AgenBelanja — Demo Script Hackathon

## Tujuan Presentasi

Membuktikan dalam 2–3 menit bahwa AgenBelanja adalah aplikasi agentic commerce yang bukan hanya membandingkan harga: agent meminta quote ke beberapa vendor secara paralel, menegosiasikan sesuai batas budget, lalu mengarahkan settlement x402 pada Monad.

## Setup Sebelum Presentasi

- Aplikasi sudah terbuka pada halaman utama.
- Wallet sudah terhubung ke Monad Testnet jika menggunakan payment nyata.
- Browser console ditutup atau disembunyikan.
- Gunakan jaringan yang stabil.
- Siapkan seed scenario `negotiation_success`.
- Tab explorer atau receipt transaksi sudah siap jika transaction hash nyata tersedia.
- Siapkan scenario `all_vendors_reject` sebagai backup.
- Pastikan tidak ada modal wallet tertunda sebelum presentasi dimulai.

## Pitch Satu Kalimat

> AgenBelanja adalah autonomous purchasing agent yang meminta quote dari beberapa vendor secara paralel, menegosiasikan harga tanpa melampaui budget pengguna, dan menyelesaikan pembelian melalui x402 di Monad.

## Script Demo 2 Menit 30 Detik

### 0:00–0:20 — Masalah

> Membandingkan beberapa vendor itu mudah, tetapi mendapatkan harga terbaik sering masih membutuhkan negosiasi manual. Pengguna harus mengecek quote, menawar, menunggu respons, lalu melakukan pembayaran sendiri.

> AgenBelanja mengubah proses tersebut menjadi agentic commerce: pengguna hanya memberi kebutuhan dan budget, lalu agent bertindak dalam batas yang diberikan.

### 0:20–0:40 — Input Pengguna

Tindakan:

1. Tunjukkan field item dan budget.
2. Isi `Headset gaming`.
3. Isi budget `50 USDC`.
4. Klik `Cari & Negosiasikan Harga`.

Narasi:

> Saya mencari headset gaming dengan batas maksimum 50 USDC. Budget ini adalah hard limit: agent tidak dapat membuat penawaran di atas nilai tersebut.

### 0:40–1:10 — Parallel Quote dan Negosiasi

Tindakan:

1. Tunjukkan tiga kartu vendor dan timeline yang diperbarui.
2. Tunggu quote muncul.
3. Soroti bahwa seluruh harga awal berada di atas budget.
4. Tunjukkan counter-offer agent.

Narasi:

> Agent mengirim permintaan quote ke tiga vendor secara paralel, bukan satu per satu. Ketika tidak ada harga awal yang masuk budget, agent otomatis mengirim counter-offer sebesar 50 USDC kepada seluruh vendor.

> Ini menunjukkan penggunaan Parallel Execution Monad secara relevan: banyak interaksi vendor dapat diproses bersamaan untuk workflow commerce yang cepat.

### 1:10–1:35 — Keputusan Agent

Tindakan:

1. Tunjukkan Vendor A dan C ditolak.
2. Tunjukkan Vendor B menerima 50 USDC.
3. Soroti kartu hasil dan final price.

Narasi:

> Vendor A dan C menolak karena harga minimum mereka di atas budget. Vendor B menerima 50 USDC, sehingga agent memilih Vendor B. Keputusan ini transparan: seluruh langkahnya terlihat di timeline, dan harga akhir tetap tidak melebihi budget pengguna.

### 1:35–2:05 — x402 dan Monad Settlement

Tindakan:

1. Klik `Bayar dengan x402`.
2. Jika memakai payment nyata, lakukan approval wallet.
3. Tampilkan loading serta receipt sukses.
4. Tunjukkan transaction hash jika ada.

Narasi untuk payment nyata:

> Setelah kesepakatan terbentuk, payment dilakukan melalui x402. Endpoint pembayaran meminta otorisasi payment, lalu settlement diproses pada Monad Testnet. Dengan finality cepat dan biaya rendah, workflow agent dapat berakhir dalam satu alur yang ringkas.

Narasi untuk demo fallback:

> Pada versi demo ini, kami menampilkan flow protocol `402 Payment Required` hingga settlement result. Core negotiation dan aturan budget berjalan penuh; integrasi settlement nyata sedang menggunakan konfigurasi testnet.

### 2:05–2:30 — Penutup

> AgenBelanja bukan chatbot belanja. Ini adalah agent yang mengambil tindakan terukur: membandingkan vendor, bernegosiasi dengan batas aman, memilih hasil terbaik, dan mengeksekusi payment flow.

> Ke depan, sistem ini dapat dikembangkan dengan vendor nyata, katalog produk, reputasi vendor, dan preferensi seperti waktu pengiriman atau kualitas layanan.

## Demo Cadangan: Semua Vendor Menolak

Gunakan jika skenario utama bermasalah atau juri bertanya tentang risiko agent membuat transaksi yang tidak sesuai.

Tindakan:

1. Reset aplikasi.
2. Pilih scenario `all_vendors_reject` atau isi `Mouse wireless` dengan budget `35 USDC`.
3. Jalankan negosiasi.
4. Tunjukkan semua vendor menolak.

Narasi:

> Agent juga memiliki guardrail. Ketika tidak ada vendor yang menerima harga dalam batas budget, status berubah menjadi `Tidak Ada Kesepakatan` dan tombol payment tidak muncul. Jadi agent tidak memaksa pembelian dan tidak dapat melampaui batas pengguna.

## Jawaban Cepat untuk Juri

### “Apakah ini hanya price comparison?”

> Tidak. Price comparison berhenti setelah menampilkan harga. AgenBelanja mengevaluasi quote, mengirim counter-offer, merespons accept/reject, memilih vendor, dan memulai payment setelah ada kesepakatan.

### “Di mana penggunaan Monad?”

> Monad relevan pada workflow yang memiliki beberapa interaksi kecil: quote, negosiasi, dan settlement. Kami menunjukkan quote vendor diproses paralel dan menggunakan Monad sebagai target settlement x402.

### “Apakah agent ini memakai AI?”

> Untuk MVP, keputusan transaksi bersifat rule-based agar budget enforcement deterministik dan dapat diaudit. AI dapat ditambahkan nanti untuk memahami kebutuhan natural language atau menjelaskan keputusan, tetapi tidak kami gunakan untuk menentukan atau menyetujui harga.

### “Apa yang mencegah agent membayar terlalu mahal?”

> Budget pengguna merupakan hard limit pada rule engine. Agent tidak bisa mengirim counter-offer di atas budget, dan payment hanya tersedia sesudah vendor menerima harga yang sesuai.

### “Bagaimana bila payment gagal?”

> Sistem memperbarui status menjadi `Settlement Gagal`, menampilkan error yang jelas, dan order tidak dinyatakan selesai. Mekanisme retry otomatis merupakan pengembangan Fase Lanjutan.

### “Mengapa memakai x402?”

> x402 memungkinkan payment flow berbasis HTTP 402 yang cocok untuk agent-to-service payment. Dalam produk ini, payment baru tersedia setelah agent menyelesaikan negosiasi dengan vendor.

## Checklist Sebelum Submission

- [ ] Happy path negotiation berjalan dari browser refresh.
- [ ] No-deal scenario berjalan.
- [ ] Budget tidak dapat diisi nol atau negatif.
- [ ] Agent tidak pernah memilih harga di atas budget.
- [ ] Tombol payment tidak tampil saat `NO_DEAL`.
- [ ] Wallet/error state terlihat jelas.
- [ ] Payment real atau fallback ditandai jujur.
- [ ] README menjelaskan setup dan known limitations.
- [ ] Screenshot UI sudah diambil.
- [ ] Diagram arsitektur sudah dimasukkan ke README/submission.
- [ ] Repository dapat dijalankan dengan langkah setup yang tertulis.
- [ ] Demo sudah dilatih minimal dua kali tanpa membaca naskah penuh.
