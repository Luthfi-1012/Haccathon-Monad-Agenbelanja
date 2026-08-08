# AgenBelanja — Agen Negosiasi Pembelian Berbasis x402 pada Monad

AgenBelanja adalah aplikasi *agentic commerce* yang dirancang untuk hackathon Monad. Aplikasi ini menerima item dan batas anggaran dari pengguna, meminta quote dari 3 vendor simulasi secara paralel (`Promise.all`), melakukan negosiasi 1-round counter-offer tanpa pernah melebihi budget pengguna, lalu menjalankan settlement pembayaran berstandar HTTP 402 (**x402 protocol**) pada Monad Testnet.

---

## 🌟 Fitur Utama (MVP 6 Jam)

1. **Paralel Vendor Quoting**: 3 vendor simulasi (TechStore A, ElectroHub B, DigitalMart C) dihubungi secara bersamaan.
2. **Rule Engine Deterministik (Tanpa LLM/AI)**:
   - **Skenario 1 — Direct Match**: Jika harga awal $\le$ budget, vendor dengan harga terendah langsung dipilih.
   - **Skenario 2 — Negosiasi Sukses**: Jika harga awal $>$ budget, agent mengirim counter-offer sebesar budget. Vendor menerima jika budget $\ge$ *floor price*.
   - **Skenario 3 — No Deal**: Jika semua vendor menolak counter-offer, status diset `NO_DEAL` dan tombol payment dinonaktifkan.
3. **Budget Integrity Guardrail**: Agent **tidak pernah** menawar atau menyetujui harga di atas budget pengguna.
4. **Real-time Negotiation Sequence Timeline**: Log kronologis beranimasi yang memperlihatkan setiap langkah pengambilan keputusan agent.
5. **x402 Protocol Settlement**: Alur pembayaran HTTP 402 standar dengan fallback mode jujur (`DEMO_PAYMENT_MODE=true`).

---

## 🚀 Cara Menjalankan Aplikasi (WSL / Linux / Windows)

### Prasyarat
* Node.js v18+ 
* npm v9+

### Langkah-langkah
```bash
# 1. Masuk ke direktori proyek (WSL / Bash)
cd agenbelanja

# 2. Install dependensi
npm install

# 3. Jalankan pengujian unit test rule engine (3 Skenario & Guardrails)
npm test

# 4. Jalankan mode pengembangan (Dev Server)
npm run dev
```

Buka browser di `http://localhost:3000`.

---

## 🧪 Menguji 3 Skenario Seed Demo

Pada bagian atas formulir input, tersedia tombol preset cepat:

1. **Skenario 1 (Direct Match)**: `Keyboard mekanikal` (Budget: 50 USDC) $\rightarrow$ Vendor A (48 USDC) terpilih tanpa counter-offer.
2. **Skenario 2 (Negosiasi Deal)**: `Headset gaming` (Budget: 50 USDC) $\rightarrow$ Counter-offer 50 USDC diterima oleh Vendor B (Floor: 49 USDC).
3. **Skenario 3 (No Deal)**: `Mouse wireless` (Budget: 35 USDC) $\rightarrow$ Counter-offer 35 USDC ditolak oleh seluruh vendor (Floor A: 42, B: 40, C: 45).

---

## 🌐 Konfigurasi Jaringan Monad Testnet & x402

Variabel lingkungan disimpan pada `.env.local`:
```bash
NEXT_PUBLIC_X402_NETWORK=eip155:10143
NEXT_PUBLIC_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
NEXT_PUBLIC_MONAD_USDC_ADDRESS=0x534b2f3A21130d7a60830c2Df862319e593943A3
NEXT_PUBLIC_X402_FACILITATOR_URL=https://x402-facilitator.molandak.org
DEMO_PAYMENT_MODE=true
```

> **Catatan Transparansi Demo Mode**: `DEMO_PAYMENT_MODE=true` aktif untuk menjamin kelancaran presentasi hackathon tanpa bergantung pada ketersediaan faucet/facilitator testnet saat demo. Alur header `HTTP 402 Payment Required` tetap dijalankan dan diverifikasi secara utuh oleh API server.
