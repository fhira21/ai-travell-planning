---

# 🧳 **AI Travel Planner**

Smart Trip Planning Powered by AI — Built with Next.js, TailwindCSS & Groq LLaMA 3.1

AI Travel Planner adalah aplikasi web yang membantu pengguna merencanakan perjalanan secara cerdas hanya dengan mengisi beberapa informasi penting. Sistem akan menghasilkan itinerary lengkap, mulai dari transportasi, penginapan, aktivitas wisata, hingga estimasi biaya — semuanya menggunakan AI.

Aplikasi ini dibuat untuk memberikan pengalaman perencanaan perjalanan yang cepat, personal, dan efisien.

---

## ✨ **Fitur Utama**

### 🗺️ 1. Perencanaan Perjalanan Berbasis AI

Aplikasi menghasilkan itinerary lengkap berdasarkan input pengguna, seperti:

* Destinasi & durasi
* Preferensi aktivitas (alam, kuliner, budaya, belanja, dll.)
* Budget perjalanan
* Jenis transportasi (darat, laut, udara, atau kendaraan pribadi)
* Preferensi penginapan (pusat kota, hemat, atau premium)

### 🚗 2. Rekomendasi Transportasi

Sistem memberikan:

* Opsi transportasi terbaik
* Estimasi biaya
* Waktu tempuh
* Alternatif lain bila budget terbatas

### 🏨 3. Rekomendasi Penginapan

AI menyesuaikan dengan:

* Budget pengguna
* Lokasi strategis (dekat pusat kota / objek wisata)
* Tipe penginapan (hotel, guesthouse, hostel, dll.)

### 🎒 4. Rekomendasi Aktivitas & Tempat Wisata

AI memberikan saran itinerary yang realistis:

* Aktivitas harian
* Wisata terkenal & hidden gems
* Estimasi biaya
* Estimasi waktu kunjungan

### 🎨 5. UI Modern dengan Sunset Gradient

Aplikasi dibuat dengan desain full-screen yang responsif dan modern, menggunakan:

* TailwindCSS
* Glassmorphism
* Sunset gradient theme

### ⚡ 6. Dibangun Menggunakan Teknologi Terbaru

* **Next.js 14 App Router**
* **Groq API** (Model: `llama-3.1-8b-instant`)
* **Tailwind CSS**
* API route server-side untuk komunikasi aman dengan model AI

---

## 📁 **Struktur Folder Utama**

```
src/
│── app/
│   ├── page.tsx                 # Halaman input form
│   ├── itinerary/page.tsx       # Halaman output itinerary AI
│   └── api/ai/route.js          # API untuk request AI
│── lib/
│   └── getItinerary.js          # Logic pemanggilan AI
```

---

## 🚀 **Cara Menjalankan Project**

### 1. Clone repo

```bash
git clone https://github.com/fhira21/ai-travell-planning.git
cd ai-travell-planner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Tambahkan environment variable

Buat `.env.local`:

```
GROQ_API_KEY=your_api_key_here
```

### 4. Jalankan aplikasi

```bash
npm run dev
```

Akses melalui:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧠 **Teknologi AI**

Aplikasi menggunakan model:

```
llama-3.1-8b-instant
```

yang dijalankan melalui layanan **Groq**, memberikan:

* Latensi super cepat
* Biaya lebih murah
* Output stabil untuk task reasoning seperti itinerary

---

## 📸 **Preview UI**

*(Tambahkan screenshot UI di sini ketika sudah ada)*

---

## 🧑‍💻 **Pengembang**

**Fhira**
Mobile & Web Developer
Universitas Ahmad Dahlan

GitHub: [https://github.com/fhira21](https://github.com/fhira21)

---