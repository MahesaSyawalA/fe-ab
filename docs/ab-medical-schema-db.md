# Dokumentasi Skema Database AB+ Medical

## 1. Gambaran Umum

AB+ Medical Sales Tracker adalah aplikasi Customer Relationship Management (CRM) berbasis Kanban Board yang dirancang untuk memonitor aktivitas tim sales, mengukur durasi siklus penjualan (dari kunjungan awal hingga terbitnya Purchase Order/PO), dan memetakan pelanggan dengan revenue tertinggi. Sistem ini mengeliminasi pencatatan logbook manual berbasis Excel dan memusatkan seluruh riwayat interaksi dalam satu platform pelaporan real-time.

Sistem ini berjalan di atas arsitektur Three-Tier Decoupled Client-Server dengan database relasional MySQL dan dikelola menggunakan Prisma ORM.

## 2. Struktur Tabel dan Relasi (12 Modul Inti)

Struktur database dirancang secara modular dan berelasi erat untuk mendukung 12 entitas utama sistem.

### A. Manajemen Organisasi & Pengguna

- **`squad`**: Mengelompokkan tim sales berdasarkan wilayah operasional dan kode tim. Memiliki satu `supervisor` (berelasi ke `user`).
- **`user`**: Menyimpan kredensial pengguna dan dibagi menjadi 3 peran (role): `sales`, `sales_manager`, dan `director`. Tabel ini memiliki relasi One-to-Many dengan tiket, aktivitas, dan riwayat tahap yang dilakukan pengguna tersebut.

### B. Manajemen Klien (Faskes)

- **`pelanggan`**: Menyimpan data Fasilitas Kesehatan (Faskes) yang menjadi target kunjungan, mencakup titik koordinat (`latitude`, `longitude`) dan `radius_kunjungan` untuk validasi otomatis.
- **`kontak`**: Menyimpan informasi Person in Charge (PIC) dari setiap pelanggan (relasi Many-to-One ke `pelanggan`).

### C. Pipeline Penjualan (Kanban Core)

- **`tahap_kanban`**: Menyimpan daftar tahapan status penjualan (visit, kebutuhan, opportunity, follow_up, quotation, po, revenue).
- **`tiket`**: Entitas utama yang mewakili satu siklus/peluang penjualan (berelasi wajib ke `pelanggan`, `user`, dan `tahap_kanban`). Menyimpan status akhir (`open`, `won`, `lost`) dan estimasi nilai closing.
- **`riwayat_tahap`**: Tabel historis yang mencatat secara otomatis kapan sebuah `tiket` berpindah dari `tahap_asal` ke `tahap_tujuan`. Data ini krusial untuk menghitung metrik durasi penawaran ke PO.

### D. Operasional & Pelacakan Lapangan

- **`aktivitas`**: Catatan riwayat kegiatan sales (kunjungan, follow-up, dll.) yang terhubung ke spesifik `tiket`.
- **`bukti_kunjungan`**: Relasi khusus untuk jenis aktivitas kunjungan yang mencatat koordinat asli sales dan jarak ke klien. Sistem memvalidasi apakah kunjungan tersebut "Dalam Radius" menggunakan rumus Haversine.

### E. Dokumen Transaksi Bisnis

- **`penawaran`**: Mendokumentasikan riwayat quotation harga yang diajukan ke klien, termasuk file URL, total nilai, dan jumlah revisi (berelasi ke `tiket` dan `aktivitas`).
- **`purchase_order`**: Mencatat PO yang terbit bila penawaran disetujui, mencakup nominal PO dan nilai revenue bersih.

### F. Pendukung

- **`notifikasi`**: Modul peringatan sistem otomatis yang menempel pada `tiket`.
