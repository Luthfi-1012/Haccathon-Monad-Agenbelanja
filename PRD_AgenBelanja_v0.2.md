# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## AgenBelanja — Agen Negosiasi Pembelian Berbasis x402

**STATUS: DRAFT SEMENTARA**

| | |
| --- | --- |
| **Nama Produk** | AgenBelanja — Agen Negosiasi Pembelian Berbasis x402 |
| **Versi Dokumen** | v0.2 |
| **Disusun oleh** | Belum ditentukan (Pengembang) |
| **Untuk** | Belum ditentukan (Klien) |
| **Tanggal** | 7 Agustus 2026 |
| **Dokumen Terkait** | Ide Proyek AgenBelanja — hasil brainstorming; PRD AgenBelanja v0.1 |

---

# 1. Ringkasan Produk (Overview)

Proses pembelian dari beberapa vendor dapat membutuhkan perbandingan harga, pengecekan anggaran, dan negosiasi berulang yang umumnya dilakukan secara manual. Perbandingan quote statis belum membantu pengguna mendapatkan harga terbaik ketika penawaran awal vendor melebihi anggaran, serta belum memberikan transparansi atas proses pengambilan keputusan pembelian.

AgenBelanja adalah agen pembelian yang menerima kebutuhan serta batas anggaran pengguna, meminta quote dari beberapa vendor, lalu melakukan negosiasi harga otomatis hingga memperoleh kesepakatan yang sesuai. Produk ini dirancang sebagai demonstrasi **agentic commerce**: agen tidak hanya menampilkan perbandingan harga, tetapi mengambil tindakan berdasarkan respons vendor dan batas anggaran pengguna. AgenBelanja memanfaatkan Parallel Execution Monad untuk mengirim serta memproses permintaan quote dan negosiasi dari beberapa vendor secara bersamaan, sedangkan x402 digunakan untuk settlement pembayaran setelah kesepakatan tercapai. Riwayat negosiasi real-time memperlihatkan proses, keputusan, dan hasil agen kepada pengguna maupun juri hackathon.

# 2. Tujuan & Sasaran (Goals)

- Mendemonstrasikan konsep **agentic commerce** melalui agen yang dapat membandingkan quote, melakukan negosiasi, dan memilih vendor sesuai batas anggaran pengguna.
- Memanfaatkan Parallel Execution Monad secara nyata untuk memproses interaksi dengan beberapa vendor secara paralel.
- Memperlihatkan penggunaan x402 untuk settlement pembayaran setelah penawaran vendor disetujui.
- Memudahkan pengguna memperoleh penawaran vendor yang sesuai dengan batas anggaran yang ditentukan.
- Menyediakan transparansi proses pengambilan keputusan agen melalui riwayat quote, negosiasi, respons vendor, dan hasil akhir.
- Mendemonstrasikan pengalaman transaksi cepat serta biaya rendah yang relevan bagi proses negosiasi dan pembayaran bernilai kecil.

# 3. Pengguna & Peran (Users & Roles)

- **Pengguna :** memasukkan kebutuhan pembelian dan batas anggaran, memulai pencarian penawaran, menghubungkan wallet, serta melihat proses dan hasil negosiasi agen.
- **Agen Belanja :** meminta quote kepada vendor, mengevaluasi harga terhadap anggaran, mengajukan penawaran balik, dan memilih vendor dengan penawaran yang diterima.
- **Vendor :** menyediakan harga awal serta harga minimum (*floor price*), kemudian menerima atau menolak penawaran agen sesuai aturan harga yang ditetapkan.
- **Pengembang/Demo Operator :** menyiapkan endpoint vendor simulasi, konfigurasi demo, serta memantau proses negosiasi dan settlement selama demonstrasi.

# 4. Ruang Lingkup (Scope)

## 4.1 Termasuk (MVP)

- Input kebutuhan pembelian dan batas anggaran oleh pengguna.
- Koneksi wallet pengguna melalui wallet provider.
- Simulasi minimal tiga vendor dengan harga awal dan harga minimum masing-masing.
- Permintaan quote secara paralel kepada vendor.
- Orkestrasi agen untuk membandingkan quote dan menegosiasikan harga dalam batas anggaran pengguna.
- Aturan vendor untuk menerima atau menolak penawaran berdasarkan harga minimum.
- Tampilan riwayat quote, negosiasi, respons vendor, dan status proses secara real-time.
- Pemilihan penawaran vendor yang diterima.
- Settlement pembayaran melalui x402 setelah terdapat kesepakatan.
- Penanganan status pembayaran berhasil atau gagal.
- Penggunaan jaringan Monad untuk transaksi cepat, berbiaya rendah, dan pemrosesan proses vendor secara paralel.

## 4.2 Di Luar Lingkup Awal / Fase Lanjutan

Fitur integrasi vendor nyata, katalog produk, preferensi pembelian, riwayat sesi belanja, reputasi vendor, serta konfigurasi negosiasi lanjutan berada di luar cakupan MVP dan dijelaskan pada Bab 11.

# 5. Asumsi & Batasan (Assumptions & Constraints)

- **(Asumsi)** MVP menggunakan minimal tiga endpoint vendor simulasi untuk memperlihatkan variasi harga awal, harga minimum, dan respons negosiasi.
- **(Asumsi)** Setiap vendor memiliki aturan sederhana: menerima penawaran apabila nilainya sama dengan atau lebih tinggi dari harga minimum vendor, serta menolak penawaran yang berada di bawah harga tersebut.
- **(Asumsi)** Agen dapat menaikkan nilai penawaran setelah penolakan, selama nilai tersebut tidak melampaui batas anggaran pengguna.
- **(Asumsi)** Sistem hanya menjalankan pembayaran setelah terdapat penawaran vendor yang diterima.
- Batas anggaran pengguna merupakan nilai maksimum yang tidak boleh dilampaui oleh Agen Belanja.
- Cakupan MVP berfokus pada demonstrasi alur negosiasi dan payment settlement, bukan operasional marketplace penuh.
- Detail aset pembayaran, konfigurasi x402, jaringan Monad, serta lingkungan deployment belum ditetapkan.
- Vendor pada MVP merupakan endpoint simulasi; ketersediaan produk, stok, pengiriman, dan pemenuhan pesanan nyata tidak termasuk dalam demonstrasi awal.
- Koneksi wallet memerlukan wallet provider yang kompatibel; mekanisme onboarding pengguna yang belum memiliki wallet belum ditentukan.

# 6. Kebutuhan Fungsional (Functional Requirements)

## 6.1 Pengguna — Permintaan Pembelian

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **USR-1** | Pengguna dapat menghubungkan wallet ke sistem sebelum memulai proses pembelian. | **Wajib** |
| **USR-2** | Pengguna dapat memasukkan kebutuhan atau item yang ingin dibeli. | **Wajib** |
| **USR-3** | Pengguna dapat memasukkan batas anggaran maksimum untuk suatu permintaan pembelian. | **Wajib** |
| **USR-4** | Pengguna dapat memulai proses pencarian penawaran dan negosiasi oleh Agen Belanja. | **Wajib** |
| **USR-5** | Pengguna dapat melihat status akhir permintaan pembelian, termasuk vendor terpilih atau informasi apabila tidak ada penawaran yang disetujui. | **Penting** |
| **USR-6** | Pengguna dapat melihat riwayat sesi pembelian sebelumnya. | **Fase 2** |

## 6.2 Agen Belanja — Orkestrasi Quote dan Negosiasi

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **AGN-1** | Sistem dapat mengirim permintaan quote untuk kebutuhan pembelian kepada minimal tiga vendor. | **Wajib** |
| **AGN-2** | Sistem dapat memproses permintaan quote dari beberapa vendor secara paralel. | **Wajib** |
| **AGN-3** | Sistem dapat menerima harga awal dari setiap vendor. | **Wajib** |
| **AGN-4** | Sistem dapat membandingkan harga awal vendor terhadap batas anggaran pengguna. | **Wajib** |
| **AGN-5** | Sistem dapat memilih penawaran yang sudah sesuai anggaran tanpa negosiasi tambahan. | **Penting** |
| **AGN-6** | Sistem dapat mengajukan penawaran balik kepada vendor apabila harga awal melebihi batas anggaran pengguna. | **Wajib** |
| **AGN-7** | Sistem dapat mengirim penawaran ulang dengan nilai lebih tinggi setelah penawaran sebelumnya ditolak. | **Penting** |
| **AGN-8** | Sistem tidak dapat mengirim penawaran yang nilainya melebihi batas anggaran pengguna. | **Wajib** |
| **AGN-9** | Sistem dapat menghentikan negosiasi apabila seluruh vendor menolak penawaran hingga batas anggaran pengguna tercapai. | **Penting** |
| **AGN-10** | Sistem dapat memilih vendor dengan penawaran yang diterima dan sesuai batas anggaran pengguna. | **Wajib** |

## 6.3 Vendor — Pengelolaan Penawaran

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **VND-1** | Vendor dapat menyediakan harga awal untuk suatu permintaan pembelian. | **Wajib** |
| **VND-2** | Vendor dapat memiliki harga minimum sebagai batas penerimaan negosiasi. | **Wajib** |
| **VND-3** | Vendor dapat menerima penawaran agen apabila harga yang ditawarkan memenuhi atau melebihi harga minimum vendor. | **Wajib** |
| **VND-4** | Vendor dapat menolak penawaran agen apabila harga yang ditawarkan berada di bawah harga minimum vendor. | **Wajib** |
| **VND-5** | Sistem dapat mencatat respons vendor terhadap setiap penawaran negosiasi. | **Penting** |
| **VND-6** | Vendor dapat memperbarui harga minimum secara mandiri. | **Fase 2** |

## 6.4 Pembayaran — Settlement x402

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **PAY-1** | Sistem dapat memulai pembayaran melalui x402 kepada vendor terpilih setelah penawaran diterima. | **Wajib** |
| **PAY-2** | Sistem tidak dapat memproses pembayaran apabila belum ada penawaran vendor yang diterima. | **Wajib** |
| **PAY-3** | Sistem dapat mencatat nilai pembayaran akhir berdasarkan harga penawaran yang disetujui. | **Wajib** |
| **PAY-4** | Sistem dapat menampilkan status settlement pembayaran. | **Penting** |
| **PAY-5** | Sistem dapat menyimpan referensi transaksi settlement yang berhasil. | **Penting** |
| **PAY-6** | Sistem dapat mencoba ulang settlement pembayaran yang gagal. | **Fase 2** |

## 6.5 Antarmuka — Riwayat Negosiasi dan Hasil

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **UIX-1** | Sistem menampilkan quote awal dari setiap vendor. | **Wajib** |
| **UIX-2** | Sistem menampilkan riwayat negosiasi antara Agen Belanja dan setiap vendor secara berurutan. | **Wajib** |
| **UIX-3** | Sistem menampilkan status proses negosiasi, termasuk sedang diproses, diterima, ditolak, atau tidak ada kesepakatan. | **Penting** |
| **UIX-4** | Sistem menampilkan vendor terpilih dan harga akhir setelah proses negosiasi selesai. | **Wajib** |
| **UIX-5** | Sistem menampilkan status pembayaran setelah settlement diproses. | **Penting** |
| **UIX-6** | Sistem menampilkan alasan keputusan agen secara ringkas, seperti harga sesuai anggaran, penawaran diterima, atau seluruh vendor menolak. | **Penting** |
| **UIX-7** | Pengguna dapat mengatur preferensi tampilan riwayat negosiasi. | **Fase 2** |

# 7. Alur Pengguna Utama (Key User Flows)

## 7.1 Pembelian dengan Penawaran Langsung Sesuai Anggaran

1. Pengguna menghubungkan wallet ke sistem.
2. Pengguna memasukkan kebutuhan pembelian dan batas anggaran.
3. Pengguna memulai proses pencarian penawaran.
4. Sistem membuat permintaan pembelian dengan status “Mencari Penawaran”.
5. Agen Belanja meminta quote dari tiga vendor secara paralel.
6. Vendor mengirimkan harga awal kepada sistem.
7. Agen Belanja membandingkan seluruh quote dengan batas anggaran pengguna.
8. Sistem memilih penawaran yang sesuai anggaran dengan status “Penawaran Disetujui”.
9. Sistem memulai settlement pembayaran x402 kepada vendor terpilih dengan status “Menunggu Settlement”.
10. Sistem menampilkan hasil pembelian dengan status “Selesai” setelah settlement berhasil.

## 7.2 Negosiasi Harga hingga Kesepakatan

1. Pengguna menghubungkan wallet, memasukkan kebutuhan pembelian, dan menentukan batas anggaran.
2. Pengguna memulai proses pencarian penawaran.
3. Agen Belanja menerima harga awal dari vendor yang berada di atas batas anggaran.
4. Sistem membuat penawaran balik kepada vendor dengan nilai yang tidak melebihi batas anggaran pengguna.
5. Vendor mengevaluasi penawaran berdasarkan harga minimum yang dimilikinya.
6. Jika vendor menolak, Agen Belanja dapat mengirim penawaran berikutnya dengan nilai lebih tinggi selama masih dalam batas anggaran.
7. Jika salah satu vendor menerima, sistem memperbarui status menjadi “Penawaran Disetujui”.
8. Sistem melakukan settlement pembayaran x402 kepada vendor yang menerima penawaran.
9. Sistem menampilkan vendor terpilih, harga akhir, dan riwayat negosiasi dengan status “Selesai”.

## 7.3 Seluruh Vendor Menolak Penawaran

1. Pengguna menghubungkan wallet, memasukkan kebutuhan pembelian, dan menetapkan batas anggaran.
2. Agen Belanja meminta quote dari seluruh vendor dan mengajukan penawaran balik apabila diperlukan.
3. Vendor menolak penawaran karena nilai yang diajukan berada di bawah harga minimum masing-masing.
4. Agen Belanja menaikkan penawaran secara bertahap hingga mencapai batas anggaran pengguna.
5. Seluruh vendor tetap menolak atau tidak ada vendor yang memberikan harga sesuai batas anggaran.
6. Sistem menghentikan proses negosiasi dengan status “Tidak Ada Kesepakatan”.
7. Sistem menampilkan riwayat penolakan dan tidak memproses pembayaran.

## 7.4 Settlement Pembayaran Gagal

1. Agen Belanja memilih vendor yang telah menerima penawaran.
2. Sistem memulai settlement pembayaran melalui x402 dengan status “Menunggu Settlement”.
3. Settlement pembayaran tidak berhasil dikonfirmasi.
4. Sistem memperbarui status menjadi “Settlement Gagal”.
5. Sistem menampilkan kegagalan tersebut pada hasil pembelian dan riwayat negosiasi.
6. Tindakan setelah settlement gagal belum ditentukan dan dicatat sebagai TBD.

# 8. Model Data (High-Level)

| **Entitas** | **Field Utama** | **Keterangan** |
| --- | --- | --- |
| **purchase_request** | request_id, user_id, wallet_address, item_description, budget_amount, status, created_at | Permintaan pembelian yang dibuat oleh pengguna beserta batas anggaran dan wallet yang terhubung. |
| **vendor** | vendor_id, vendor_name, endpoint_url, [reputation_score], created_at | Data vendor atau endpoint vendor yang berpartisipasi dalam proses quote dan negosiasi. Field `reputation_score` merupakan fitur Fase Lanjutan. |
| **vendor_offer** | offer_id, request_id, vendor_id, initial_price, final_price, offer_status, created_at | Penawaran harga vendor untuk suatu permintaan pembelian. |
| **negotiation_log** | negotiation_id, request_id, vendor_id, offer_amount, response_type, sequence_number, created_at | Riwayat penawaran Agen Belanja dan respons vendor selama proses negosiasi. |
| **payment_settlement** | settlement_id, request_id, vendor_id, payment_amount, payment_status, transaction_reference, created_at | Catatan settlement pembayaran x402 kepada vendor terpilih. |
| **[shopping_session]** | [session_id], [user_id], [request_id], [started_at], [completed_at] | Riwayat sesi belanja pengguna yang direncanakan untuk Fase Lanjutan. |

**Catatan:** field dan entitas dalam [tanda kurung siku] merupakan bagian dari fitur usulan/Fase Lanjutan pada Bab 11.

# 9. Kebutuhan Non-Fungsional (Non-Functional Requirements)

- **Performa :** Sistem perlu mendukung pengiriman permintaan quote dan pemrosesan respons dari beberapa vendor secara paralel agar demonstrasi berlangsung responsif.
- **Finalitas transaksi :** Status penawaran dan settlement pembayaran perlu diperbarui sesegera mungkin setelah transaksi dikonfirmasi agar proses negosiasi terasa real-time.
- **Keamanan anggaran :** Agen tidak boleh membuat atau menyetujui penawaran yang melebihi batas anggaran pengguna.
- **Keamanan wallet :** Sistem tidak boleh menyimpan private key pengguna; persetujuan transaksi dilakukan melalui wallet provider.
- **Transparansi :** Riwayat quote, penawaran, penolakan, penerimaan, harga akhir, dan status settlement harus dapat dilihat pada antarmuka.
- **Hak akses :** Hanya pihak yang menjalankan endpoint vendor dapat memberikan quote dan respons negosiasi atas nama vendor tersebut.
- **Biaya transaksi :** Desain transaksi perlu mempertimbangkan biaya rendah karena satu proses pembelian dapat menghasilkan beberapa interaksi negosiasi dan settlement.
- **Skalabilitas :** Target jumlah pengguna, vendor, serta transaksi bersamaan belum dibahas dan perlu ditentukan setelah MVP.

# 10. Integrasi Pihak Ketiga

| **Layanan** | **Fungsi** | **Catatan** |
| --- | --- | --- |
| **x402** | Mendukung proses pembayaran dan settlement kepada vendor setelah terdapat kesepakatan harga. | Detail implementasi, aset pembayaran, dan konfigurasi layanan belum ditetapkan. |
| **Jaringan Monad** | Mendukung transaksi cepat, biaya rendah, dan pemrosesan proses vendor secara paralel. | Pemilihan jaringan, lingkungan pengembangan, dan konfigurasi smart contract belum ditetapkan. |
| **Wallet Provider** | Menghubungkan wallet pengguna, menampilkan permintaan persetujuan transaksi, dan mendukung otorisasi pembayaran. | Contoh wallet provider adalah MetaMask; pilihan provider final belum ditentukan. |
| **Endpoint Vendor Simulasi** | Menyediakan quote awal serta menerima atau menolak penawaran agen berdasarkan harga minimum vendor. | Digunakan untuk cakupan MVP dan demonstrasi; integrasi vendor nyata berada pada Fase Lanjutan. |

# 11. Fitur Usulan / Fase Lanjutan

- **Integrasi Vendor Nyata.** Sistem dapat terhubung dengan vendor atau marketplace nyata untuk memperoleh quote, ketersediaan produk, dan proses pemesanan dari sumber operasional.
- **Katalog Produk.** Pengguna dapat mencari serta memilih produk dari katalog sebelum Agen Belanja meminta quote kepada vendor.
- **Preferensi Pengguna.** Pengguna dapat menentukan kriteria selain harga, seperti vendor favorit, batas waktu pengiriman, atau kualitas layanan, yang dipertimbangkan oleh Agen Belanja.
- **Negosiasi Multi-Round yang Dapat Dikonfigurasi.** Pengguna atau operator dapat menentukan jumlah maksimum putaran negosiasi serta strategi kenaikan penawaran agen.
- **Riwayat Pembelian dan Sesi Belanja.** Sistem dapat menyimpan serta menampilkan riwayat permintaan, vendor terpilih, harga akhir, status settlement, dan sesi pembelian pengguna.
- **Reputasi Vendor.** Sistem dapat menyimpan skor reputasi vendor untuk menjadi pertimbangan tambahan dalam pemilihan vendor, terutama apabila terdapat harga penawaran yang setara.
- **Coba Ulang Settlement.** Sistem dapat mencoba ulang settlement pembayaran yang gagal berdasarkan aturan yang ditentukan.
- **Preferensi Tampilan Riwayat Negosiasi.** Pengguna dapat menyesuaikan tampilan atau tingkat detail riwayat negosiasi.

# 12. Pertanyaan Terbuka / TBD

- Siapa nama pengembang, nama klien, dan nama brand final untuk produk ini?
- Jenis produk atau kategori kebutuhan pembelian apa yang akan digunakan dalam demonstrasi?
- Apakah pengguna akan menggunakan aset nyata, test token, atau metode simulasi untuk pembayaran x402?
- Jaringan Monad dan lingkungan yang akan digunakan untuk pengembangan serta demonstrasi belum ditentukan.
- Apakah settlement x402 akan dilakukan sepenuhnya on-chain, melalui layanan perantara, atau dalam bentuk simulasi pada MVP?
- Bagaimana penanganan lanjutan apabila settlement pembayaran gagal setelah vendor menerima penawaran?
- Apakah vendor pada MVP hanya berupa endpoint simulasi atau terdapat calon vendor nyata yang akan diintegrasikan?
- Apa aturan *tie-break* apabila lebih dari satu vendor menerima penawaran dengan harga yang sama?
- Apakah pengguna perlu mengonfirmasi vendor terpilih sebelum settlement dieksekusi, atau Agen Belanja dapat langsung melakukan settlement?
- Ketentuan batas minimum dan maksimum anggaran serta nominal penawaran belum ditetapkan.
- Wallet provider apa yang akan digunakan pada MVP?
- Bagaimana mekanisme onboarding bagi pengguna awam yang belum memiliki wallet?
- Timeline pengembangan, target tanggal demo, serta biaya operasional belum ditentukan.
- Target jumlah vendor, pengguna, dan transaksi simultan yang perlu didukung belum ditentukan.

# 13. Glosarium

- **Agen Belanja :** komponen sistem yang mengotomatisasi permintaan quote, perbandingan harga, negosiasi, dan pemilihan vendor sesuai batas anggaran pengguna.
- **Agentic Commerce :** pendekatan perdagangan digital ketika agen dapat mengambil tindakan, seperti membandingkan penawaran, menegosiasikan harga, dan memilih opsi pembelian berdasarkan aturan yang diberikan pengguna.
- **Quote :** penawaran harga awal yang diberikan vendor untuk memenuhi kebutuhan pembelian pengguna.
- **Negosiasi :** proses penawaran balik antara Agen Belanja dan vendor untuk mencapai harga yang dapat diterima.
- **Floor Price :** harga minimum yang dapat diterima vendor dalam proses negosiasi.
- **x402 :** protokol atau mekanisme pembayaran yang digunakan untuk settlement micropayment setelah kesepakatan tercapai.
- **Settlement :** proses penyelesaian atau konfirmasi pembayaran kepada vendor terpilih.
- **Wallet Provider :** layanan atau aplikasi yang menghubungkan wallet pengguna ke sistem dan meminta persetujuan transaksi, misalnya MetaMask.
- **Monad :** jaringan blockchain yang digunakan sebagai dasar teknis untuk mendukung transaksi cepat, berbiaya rendah, dan pemrosesan paralel.
- **Parallel Execution :** kemampuan memproses beberapa transaksi atau operasi yang tidak saling bergantung secara bersamaan.
- **Fast Finality :** kemampuan jaringan untuk memberikan kepastian status transaksi dalam waktu singkat setelah transaksi diproses.

---

*Dokumen ini merupakan draft sementara dan dapat berubah seiring pembahasan lebih lanjut dengan klien.*