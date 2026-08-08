# AgenBelanja — Design Specification

## Tujuan Desain

Membuat satu halaman aplikasi yang membuat proses agentic commerce dapat dipahami dalam beberapa detik: pengguna memasukkan budget, tiga vendor memberi quote, agent bernegosiasi, vendor dipilih, dan payment diselesaikan.

Prinsip utama desain:

- **Progressive disclosure:** tampilkan informasi sesuai tahap proses, jangan menampilkan semua detail sejak awal.
- **Demo-first:** setiap perubahan status harus mudah terlihat dari jarak presentasi.
- **Trust through transparency:** keputusan agent harus dapat ditelusuri melalui timeline.
- **Low cognitive load:** satu CTA utama per tahap.
- **Dark-first:** tampilan gelap dengan aksen Monad agar cocok untuk demo Web3.

## Struktur Halaman

```text
┌──────────────────────────────────────────────────────────────┐
│ Logo AgenBelanja                    Wallet Status / Connect  │
├──────────────────────────────────────────────────────────────┤
│ Hero: “Your Autonomous Purchasing Agent”                     │
│ Subjudul: Compare, negotiate, and settle within your budget. │
├──────────────────────────────────────────────────────────────┤
│ Purchase Request Card                                         │
│ [Item yang ingin dibeli                 ]                    │
│ [Budget maksimum (USDC)                 ]                    │
│ [Cari & Negosiasikan Harga]                                  │
├──────────────────────────────────────────────────────────────┤
│ Vendor Arena                                                  │
│ [Vendor A]       [Vendor B]       [Vendor C]                 │
│ price/status      price/status      price/status              │
├──────────────────────────────────────────────────────────────┤
│ Agent Negotiation Timeline                                    │
│ ● Quote requested                                             │
│ ● Vendor B counter-offer accepted                              │
├──────────────────────────────────────────────────────────────┤
│ Result Card                                                   │
│ Vendor selected | Final price | Savings                       │
│ [Bayar dengan x402]                                           │
├──────────────────────────────────────────────────────────────┤
│ Payment Receipt / Error State                                 │
└──────────────────────────────────────────────────────────────┘
```

## Komponen Utama

### 1. Header

- Logo/wordmark: `AgenBelanja`.
- Badge kecil: `Powered by Monad + x402`.
- Wallet button di kanan atas.
- State wallet:
  - `Connect Wallet`
  - `0x12ab...34cd`
  - `Wrong Network`
  - `Demo Mode`

### 2. Purchase Request Card

**Tujuan:** menjadi titik awal yang jelas bagi pengguna.

Field:

- `Item yang ingin dibeli` — text input.
- `Budget maksimum` — numeric input dengan suffix `USDC`.
- Tombol utama: `Cari & Negosiasikan Harga`.

Validasi:

- Item tidak boleh kosong.
- Budget harus lebih besar dari nol.
- Saat proses berjalan, tombol berubah menjadi `Agent sedang bernegosiasi...` dan dinonaktifkan.

### 3. Vendor Arena

Tampilkan tiga kartu vendor dalam grid tiga kolom pada desktop dan satu kolom pada layar kecil.

Setiap kartu memuat:

- Initial/avatar berbasis huruf: A, B, atau C.
- Nama vendor.
- Harga awal; gunakan `—` sebelum quote tersedia.
- Harga counter-offer saat agent melakukan negosiasi.
- Badge status.
- Highlight visual jika vendor terpilih.

Status vendor:

| Status | Label UI | Warna | Keterangan |
| --- | --- | --- | --- |
| `WAITING` | Menunggu quote | Abu-abu | Belum ada respons |
| `QUOTED` | Quote diterima | Biru | Harga awal tersedia |
| `NEGOTIATING` | Sedang dinegosiasikan | Kuning | Agent mengirim counter-offer |
| `ACCEPTED` | Offer diterima | Hijau | Vendor menerima harga |
| `REJECTED` | Offer ditolak | Merah | Vendor menolak harga |
| `SELECTED` | Vendor terpilih | Ungu/hijau | Dipilih untuk settlement |

### 4. Agent Negotiation Timeline

**Tujuan:** menjadi bagian paling penting dalam demo karena memperlihatkan agent benar-benar mengambil tindakan.

Setiap event menampilkan:

- Ikon status.
- Timestamp relatif, misalnya `+0.8s`.
- Nama aktor: `AgenBelanja` atau nama vendor.
- Pesan tindakan.
- Nilai harga jika relevan.

Contoh event:

```text
00:00  AgenBelanja mengirim permintaan quote ke 3 vendor secara paralel.
00:01  Vendor A menawarkan 58 USDC.
00:01  Vendor B menawarkan 60 USDC.
00:01  Vendor C menawarkan 64 USDC.
00:02  Tidak ada harga dalam budget 50 USDC. Agent mengirim counter-offer.
00:03  Vendor A menolak 50 USDC.
00:03  Vendor B menerima 50 USDC.
00:03  Vendor C menolak 50 USDC.
00:04  AgenBelanja memilih Vendor B: harga akhir 50 USDC.
```

### 5. Result Card

Tampilkan hanya bila status adalah `NEGOTIATION_COMPLETE` atau `NO_DEAL`.

Untuk `NEGOTIATION_COMPLETE`:

- Judul: `Deal ditemukan`.
- Vendor terpilih.
- Harga awal vendor.
- Harga akhir.
- Penghematan; tampilkan hanya jika harga akhir lebih rendah dari harga awal.
- Badge: `Within Budget`.
- Tombol utama: `Bayar dengan x402`.

Untuk `NO_DEAL`:

- Judul: `Belum ada penawaran yang sesuai`.
- Penjelasan singkat bahwa semua vendor menolak budget saat ini.
- Tombol: `Coba Budget Lain`.
- Jangan tampilkan tombol payment.

### 6. Payment Receipt

Tampilkan setelah pengguna menekan tombol payment.

State:

- `PAYMENT_REQUIRED`: `Payment required — authorize via your wallet.`
- `PAYMENT_PROCESSING`: `Memverifikasi settlement di Monad...`.
- `SETTLEMENT_SUCCESS`: `Settlement berhasil`.
- `SETTLEMENT_FAILED`: `Settlement belum berhasil`.

Untuk payment sukses, tampilkan:

- Vendor.
- Final price.
- Wallet address versi pendek.
- Transaction hash dalam format pendek jika tersedia.
- Network: `Monad Testnet`.
- Badge `x402 Settled`.

## Visual Direction

### Warna

| Token | Nilai contoh | Penggunaan |
| --- | --- | --- |
| `bg-primary` | `#0B0B12` | Latar utama |
| `bg-surface` | `#151522` | Card dan panel |
| `border-subtle` | `#29293A` | Border card |
| `text-primary` | `#F8F7FF` | Teks utama |
| `text-muted` | `#A4A2B8` | Teks sekunder |
| `accent-primary` | `#836EF9` | CTA dan highlight Monad |
| `success` | `#35D07F` | Accepted dan sukses |
| `warning` | `#F6C453` | Negosiasi/pending |
| `danger` | `#F25F5C` | Penolakan dan gagal |
| `info` | `#5BA8FF` | Quote dan informasi |

### Tipografi

- Heading: sans-serif modern, bobot 600–700.
- Body: sans-serif yang mudah dibaca, bobot 400–500.
- Harga dan status teknis: gunakan angka tabular bila tersedia.
- Hindari ukuran teks di bawah 12px.

### Interaksi

- Gunakan transisi 150–250 ms untuk badge dan card state.
- Quote vendor muncul berurutan dalam jeda pendek agar efek paralel mudah dilihat.
- Jangan memakai animasi berat yang dapat mengganggu demo.
- Gunakan `prefers-reduced-motion` bila tersedia.

## Responsivitas

- Desktop: vendor tampil dalam tiga kolom.
- Tablet: vendor tampil dua kolom, kartu ketiga memenuhi baris berikutnya.
- Mobile: semua komponen satu kolom.
- CTA utama harus selalu lebar penuh pada mobile.
- Timeline harus dapat dibaca tanpa horizontal scroll.

## Copy UI yang Disarankan

| Kondisi | Copy |
| --- | --- |
| Empty state | `Masukkan kebutuhan dan budget. AgenBelanja akan mencari harga terbaik.` |
| Quote diminta | `Meminta quote dari 3 vendor secara paralel...` |
| Negosiasi | `Harga awal belum sesuai. Agent sedang menegosiasikan harga terbaik.` |
| Deal | `Deal ditemukan dalam budget Anda.` |
| No deal | `Belum ada vendor yang dapat memenuhi budget ini.` |
| Wallet belum terhubung | `Hubungkan wallet untuk melanjutkan pembayaran.` |
| Payment processing | `Memverifikasi payment x402 di Monad...` |
| Payment sukses | `Settlement berhasil. Pesanan siap dikonfirmasi.` |
| Payment gagal | `Settlement belum berhasil. Periksa wallet lalu coba kembali.` |

## Larangan Desain

- Jangan membuat banyak halaman.
- Jangan membuat tabel marketplace atau daftar produk panjang.
- Jangan menampilkan `floor_price` kepada pengguna.
- Jangan menampilkan detail teknis x402 sebelum proses payment dimulai.
- Jangan menampilkan dashboard, chart, atau fitur admin.
- Jangan memakai istilah teknis tanpa penjelasan pada UI pengguna.
