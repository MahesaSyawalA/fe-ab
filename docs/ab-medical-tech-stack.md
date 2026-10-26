# Dokumentasi Tech Stack & Arsitektur Frontend AB+ Medical

## 1. Arsitektur Utama (Core Architecture)

Proyek ini menggunakan pendekatan **Decoupled with Feature-Based Layered Architecture**. _Frontend_ sepenuhnya terpisah dari _backend_ dan berkomunikasi secara eksklusif melalui REST API. Struktur kode diorganisasikan berdasarkan fitur bisnis (misal: `/components/features/auth`, `/components/features/kanban`), yang didukung oleh lapisan pengelolaan _state_ dan jaringan yang terisolasi.

- **Framework:** Next.js 16.3.8 (App Router)
- **Engine:** React 19.2.8
- **Language:** TypeScript 5

## 2. Manajemen State & Sinkronisasi Data (Layer 2)

Pemisahan tegas antara _Client State_ (UI) dan _Server State_ (Data API) untuk memastikan performa yang optimal dan pencegahan _re-render_ yang tidak perlu.

- **Server State (Caching & Fetching):** `@tanstack/react-query` v5. Digunakan untuk mengambil data dari _backend_, melakukan _caching_, sinkronisasi _background_, dan menangani status _loading/error_ secara otomatis.
- **Client State (Global UI State):** `zustand` v5. Menyimpan _state_ lokal yang ringan seperti status _sidebar_, preferensi filter _dashboard_, atau _toggle modal_.

## 3. Antarmuka Pengguna & Styling (Layer 1)

Menggunakan pendekatan komponen modular (UI Components) yang tidak memiliki logika bisnis bawaan, dirancang dengan sistem utilitas CSS modern.

- **CSS Framework:** Tailwind CSS v4 terintegrasi dengan `@tailwindcss/postcss`.
- **Komponen UI Utama:** `@heroui/react` v3.2.6 dan `@base-ui/react`.
- **Komponen UI Tambahan:** `shadcn` v4.21.1 dikombinasikan dengan `class-variance-authority` (CVA) dan utilitas penggabungan _class_ `cn`.
- **Ikonografi:** `lucide-react` dan `@gravity-ui/icons`.
- **Animasi CSS:** `tw-animate-css`.

## 4. Formulir & Validasi

Manajemen formulir yang kompleks (seperti pembuatan tiket, penawaran, dan pencatatan aktivitas) dikelola sepenuhnya di sisi _client_ sebelum dikirim ke _backend_.

- **Form Manager:** `react-hook-form` v7.90. Mengontrol _state_ formulir dan meminimalkan _re-render_.
- **Schema Validation:** `zod` v4.6.6. Memastikan seluruh data _input_ (_email, password_, nominal PO) sesuai dengan skema tipe data yang ketat.
- **Resolver:** `@hookform/resolvers`. Menjembatani Zod dengan React Hook Form.

## 5. Autentikasi & Jaringan (Layer 3)

Infrastruktur keamanan dan komunikasi _client-server_.

- **Authentication Engine:** `next-auth` v5.0.0-beta.32 (Auth.js). Menangani _session management_ dan pengamanan _JSON Web Token_ (JWT) melalui mekanisme _HttpOnly Cookies_.
- **HTTP Client:** `axios` v1.20.0. Dilengkapi dengan _Interceptors_ untuk menyematkan _Bearer Token_ secara otomatis pada setiap _request_ dan menavigasi pengguna saat token _expired_ (status 401).

## 6. Kanban Board & Drag-and-Drop

Fondasi utama untuk interaksi tiket penjualan yang mengandalkan pemindahan status secara _fluid_ dan aksesibilitas tinggi.

- **Drag-and-Drop Engine:** `@dnd-kit/core`, `@dnd-kit/sortable`, dan `@dnd-kit/utilities`. Membangun papan Kanban yang responsif, modular, dan mendeteksi perpindahan kartu antar kolom tahap penjualan.

## 7. Pemetaan & Geo-tagging

Fitur pelacakan lokasi _sales_ lapangan untuk memvalidasi radius kunjungan ke Fasilitas Kesehatan.

- **Map Rendering:** `react-leaflet` v5 dan `leaflet` v1.9.4. Menampilkan _basemap_ gratis (OpenStreetMap), merender _marker_ lokasi _sales_, dan membuat area radius titik Faskes tanpa membutuhkan API Key berbayar.

## 8. Real-time & Utilitas Tanggal

- **WebSockets/Real-time:** `pusher-js` v8.6.0. Disiapkan untuk menerima notifikasi sistem secara instan (misal: _update_ tiket atau persetujuan PO).
- **Date Manipulation:** `date-fns` v4.4.0. Memanipulasi dan memformat tanggal (seperti menghitung durasi siklus penjualan atau masa berlaku penawaran).
- **Date Picker UI:** `react-day-picker` v10.0.2. Komponen kalender interaktif untuk pemilihan tanggal target _closing_ dan tenggat waktu.
