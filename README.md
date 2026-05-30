# 🎛️ Virtual Stream Deck

**Virtual Stream Deck** adalah platform berbasis web yang memungkinkan konten kreator dan streamer untuk mengontrol aset multimedia mereka secara *real-time* tanpa perlu perangkat keras tambahan yang mahal. Cukup gunakan perangkat apa pun (HP, Tablet, atau Laptop) sebagai remote kontrol untuk memicu overlay dan suara langsung di OBS atau software streaming lainnya.

---

## ✨ Fitur Utama

- **🚀 Pemicu Real-time**: Menggunakan teknologi **Socket.io** untuk memastikan aset visual dan suara muncul seketika tanpa jeda.
- **📁 Dukungan Multi-Aset**: Kelola berbagai jenis aset mulai dari **Gambar, GIF, Video, hingga Audio** (Soundboard).
- **🎨 Integrasi OBS Overlay**: Cukup masukkan URL unik ke dalam *Browser Source* di OBS, dan semua aset akan sinkron secara otomatis.
- **🖱️ Manajemen Drag & Drop**: Atur urutan tombol deck Anda dengan mudah menggunakan antarmuka seret-dan-lepas yang intuitif.
- **⚙️ Konfigurasi Aset Kustom**: Atur skala, durasi, volume, hingga animasi keluar untuk setiap aset secara individual.
- **🔒 Autentikasi Aman**: Didukung oleh NextAuth.js untuk memastikan deck dan aset Anda tetap pribadi.

---

## 🛠️ Teknologi yang Digunakan

- **Core**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Real-time**: [Socket.io](https://socket.io/)
- **Database**: [MySQL](https://www.mysql.com/) / [MariaDB](https://mariadb.org/) dengan [Prisma ORM](https://www.prisma.io/)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animasi**: Framer Motion & GSAP (untuk interaksi tingkat tinggi)
- **Smooth Scroll**: Lenis

---

## 🚀 Memulai (Getting Started)

### Prasyarat
- Node.js 20+
- MySQL atau MariaDB

### Instalasi

1. **Clone repository**:
   ```bash
   git clone https://github.com/username/virtual-stream-deck.git
   cd virtual-project
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Buat file `.env` di root direktori dan isi dengan variabel berikut:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/db_name"
   NEXTAUTH_SECRET="your_secret_key"
   NEXTAUTH_URL="http://localhost:3001"
   ```

4. **Setup Database**:
   ```bash
   npx prisma migrate dev
   ```

5. **Jalankan Aplikasi**:
   Gunakan dua terminal:
   
   **Terminal 1 (Next.js):**
   ```bash
   npm run dev
   ```
   
   **Terminal 2 (Socket Server):**
   ```bash
   npm run dev:socket
   ```

---

## 🏗️ Arsitektur & Database

Untuk informasi teknis lebih mendalam mengenai skema database, diagram ERD, dan alur proses sistem, silakan lihat dokumen berikut:
👉 [**Arsitektur Sistem & Desain Database**](file:///C:/Users/ASUS/.gemini/antigravity/brain/9f49ace4-643d-4da6-9d71-2ba83a3eeb31/database_design.md)

---

## 📱 Cara Penggunaan

1. **Login** ke dashboard.
2. **Unggah aset** multimedia Anda.
3. **Salin Overlay URL** dari pengaturan profil Anda.
4. **Tempel di OBS** sebagai *Browser Source*.
5. **Klik tombol** di dashboard Anda, dan lihat keajaibannya muncul di stream!

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan pengembangan kreator. Silakan gunakan dan modifikasi sesuai kebutuhan Anda.
