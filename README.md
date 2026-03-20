🎓 Portal SD Tabalong

Portal Layanan Terpadu Bidang Pembinaan SD - Dinas Pendidikan dan Kebudayaan Kabupaten Tabalong. Website ini dirancang sebagai pusat akses (portal) untuk berbagai aplikasi layanan pendidikan dasar, direktori website sekolah, dan pusat informasi Bidang Pembinaan SD.

✨ Fitur Utama

Integrasi Layanan: Akses terpusat ke aplikasi seperti Si Pandu, Saraba, dan Simpeka.

Direktori Website SD: Daftar lengkap website resmi Sekolah Dasar Negeri di Kabupaten Tabalong yang dapat difilter berdasarkan kecamatan.

Statistik Kunjungan: Tampilan dashboard statistik kunjungan portal secara real-time.

Form Interaktif: Formulir untuk pengajuan kritik & saran, serta usulan penambahan website sekolah baru.

Desain Modern & Responsif: Dibangun dengan antarmuka glassmorphism, animasi smooth (Framer Motion), dan sepenuhnya responsif untuk desktop maupun mobile.

🛠️ Teknologi yang Digunakan

Project ini dibangun dengan stack modern untuk performa yang cepat:

React 19: Library UI

Vite 6: Build tool super cepat

Tailwind CSS v4: Framework utility-first CSS

Motion: Library animasi untuk React

Lucide React: Kumpulan ikon yang indah

Google Apps Script: Backend serverless untuk form dan database ringan

🚀 Panduan Instalasi Lokal (Local Development)

Jika kamu ingin menjalankan project ini di komputer lokal, ikuti langkah-langkah berikut:

Prasyarat

Pastikan kamu sudah menginstal Node.js (versi 18 atau terbaru) di komputermu.

Langkah-langkah

Clone repository ini

git clone [https://github.com/username-kamu/portalpsd.git](https://github.com/username-kamu/portalpsd.git)
cd portalpsd


Install dependensi

npm install


Jalankan server lokal (Development)

npm run dev


Buka di Browser
Aplikasi akan berjalan di http://localhost:5173/ (atau port lain yang ditampilkan di terminal).

📂 Struktur Folder Utama

Pastikan struktur folder kamu terlihat seperti ini agar proses build berjalan lancar:

📁 portalpsd/
├── 📁 src/
│   ├── App.tsx       # Komponen utama aplikasi
│   ├── index.css     # Konfigurasi Tailwind & Global CSS
│   └── main.tsx      # Entry point React
├── .gitignore        # Daftar file yang diabaikan Git
├── index.html        # Template utama HTML
├── package.json      # Konfigurasi project & dependensi npm
└── vite.config.ts    # Konfigurasi Vite & Plugin Tailwind


☁️ Panduan Deployment (Vercel)

Project ini sudah dikonfigurasi untuk siap di-deploy ke Vercel.

Pastikan semua perubahan sudah di-push ke GitHub.

Login ke dashboard Vercel.

Klik "Add New..." > "Project".

Import repository GitHub portalpsd kamu.

Vercel akan otomatis mendeteksi project ini sebagai Vite.

Biarkan pengaturan default (Build command: npm run build, Output directory: dist).

Klik Deploy.

📞 Kontak & Dukungan

Jika ada kendala terkait portal ini, silakan hubungi:

Email: disdik@tabalongkab.go.id

Alamat: Jl. Tanjung Baru RT. 01, Murung Pudak, Tabalong, Kalsel 71513

Instagram: @disdikbud_tabalong

Dibuat untuk memajukan pendidikan dasar di Bumi Saraba Kawa.
