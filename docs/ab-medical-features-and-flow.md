# Dokumentasi Fitur dan Alur Sistem AB+ Medical

## 1. Daftar Fitur Utama Sistem

Sistem CRM AB+ Medical dibangun dengan pendekatan modul berbasis fitur untuk memastikan pengelolaan aktivitas _sales_ berjalan efektif dan terstruktur.

### A. Modul Autentikasi & Pengguna

- **Login Role-Based:** Akses sistem yang diarahkan secara otomatis berdasarkan peran pengguna (Sales, Sales Manager, Direktur).
- **Manajemen Squad:** Pengelompokkan _sales_ ke dalam tim (squad) berdasarkan wilayah dengan satu supervisor, untuk memudahkan _filtering_ dan pelaporan kinerja.

### B. Modul Klien (Pelanggan)

- **Manajemen Outlet & PIC:** Pencatatan data Outlet beserta titik koordinat peta (Latitude/Longitude), radius toleransi kunjungan, dan daftar Kontak (Person in Charge).
- **Peta Frekuensi Kunjungan:** Rekap otomatis frekuensi kunjungan per pelanggan untuk mengidentifikasi klien yang paling sering dikunjungi.

### C. Modul Kanban & Tiket Penjualan

- **Manajemen Tiket (Peluang):** Pembuatan tiket penjualan yang memuat pelanggan, estimasi nilai, dan prioritas.
- **Papan Kanban Interaktif:** Pemindahan tiket antar tahap penjualan menggunakan sistem _drag-and-drop_.
- **Tracker Durasi (SLA):** Pencatatan waktu otomatis setiap kali tiket berpindah tahap, memungkinkan sistem menghitung durasi dari kunjungan awal hingga terbitnya Purchase Order (PO).

### D. Modul Aktivitas & Validasi Kunjungan

- **Log Aktivitas Terpadu:** Pencatatan setiap kegiatan _sales_ (kunjungan, _follow-up_, penawaran) langsung ke dalam tiket terkait.
- **Validasi Kunjungan (Geo-tagging):** Perekaman lokasi GPS _sales_ beserta foto bukti saat melakukan kunjungan. Sistem memvalidasi jarak _sales_ dengan titik outlet menggunakan rumus Haversine (Dalam/Luar Radius).

### E. Modul Dokumen Transaksi

- **Manajemen Penawaran (Quotation):** Pencatatan riwayat penawaran, unggah dokumen PDF, status persetujuan, dan pelacakan masa berlaku penawaran (maksimal 1 bulan).
- **Manajemen Purchase Order (PO):** Pencatatan PO yang diterima, nilai _revenue_ aktual, dan dokumen lampiran PO dari klien.

### F. Modul Pelaporan (Dashboard)

- **Dashboard Sales Manager:** Tampilan filter Kanban, peta lokasi kunjungan _sales_, dan kinerja per _squad_.
- **Dashboard Eksekutif (Direktur):** Metrik ringkasan kinerja perusahaan yang mencakup total _revenue_, rasio keberhasilan (_win rate_), dan peringkat pelanggan dengan nilai PO terbesar (_Top Spender_).

---

## 2. Alur Kerja Sistem (System Flow)

Berikut adalah siklus hidup operasional dari CRM AB+ Medical, dirancang untuk mengeliminasi pencatatan manual dan meningkatkan visibilitas _pipeline_ penjualan.

### Tahap 1: Inisiasi Peluang Penjualan

1. **Login:** _Sales_ masuk ke dalam sistem. Sistem memvalidasi kredensial dan menampilkan antarmuka _Kanban Board_.
2. **Buat Tiket:** _Sales_ membuat tiket baru untuk peluang penjualan. _Sales_ memilih Klien (Outlet) dan PIC, serta mengisi detail kebutuhan dan estimasi nilai.
3. **Status Awal:** Tiket secara otomatis masuk ke kolom tahap pertama dengan status **OPEN**.

### Tahap 2: Kunjungan Lapangan & Pencatatan Aktivitas

1. **Kunjungan:** _Sales_ mendatangi Outlet dan menekan tombol tambah aktivitas pada tiket tersebut.
2. **Geo-Validation:** _Sales_ mengunggah foto kunjungan. Sistem secara _background_ menangkap koordinat GPS perangkat _sales_ dan menghitung jaraknya terhadap koordinat Outlet terdaftar.
3. **Penyimpanan Bukti:** Jika masuk radius, status dicatat valid. Jika di luar radius, sistem menyimpannya dengan flag peringatan/catatan tambahan. Aktivitas ini menggantikan _logbook_ Excel manual.

### Tahap 3: Progres Pipeline & Follow-Up

1. **Perpindahan Tahap:** Seiring berjalannya proses negosiasi, _sales_ menggeser tiket ke kolom tahap berikutnya di papan Kanban (_drag-and-drop_).
2. **Pencatatan Riwayat Otomatis:** Setiap pergeseran memicu _backend_ untuk mencatat waktu perpindahan, tahap asal, tahap tujuan, dan _user_ yang memindahkan. Hal ini memungkinkan sistem mengukur seberapa lama tiket "nyangkut" di satu tahap.
3. **Follow-Up Rutin:** _Sales_ terus mencatatkan aktivitas _follow-up_ ke dalam tiket selama belum mencapai tahap akhir. Sistem menandai penawaran yang sudah mendekati batas masa berlaku (1 bulan).

### Tahap 4: Pengajuan Penawaran (Quotation)

1. **Upload Penawaran:** Ketika mencapai tahap penawaran, _sales_ mengirim dokumen asli ke klien (di luar sistem), lalu mencatatkan detail nominal, tanggal, dan _file_ penawaran ke dalam sistem.
2. **Revisi:** Jika ada negosiasi harga, _sales_ dapat menambahkan revisi penawaran di dalam sistem.

### Tahap 5: Keputusan Klien & Closing

Klien meninjau penawaran dan memberikan keputusan:

- **Skenario A (Ditolak):** _Sales_ mengubah status tiket menjadi **LOST** dan diwajibkan mengisi alasan penolakan. Proses tiket berhenti.
- **Skenario B (Disetujui):** Klien menerbitkan dokumen Purchase Order (PO).
  1. _Sales_ menerima PO dan melakukan verifikasi terhadap penawaran terakhir.
  2. Jika **TIDAK SESUAI**, status PO ditandai sebagai **DIBATALKAN**.
  3. Jika **SESUAI**, _sales_ memasukkan data PO beserta _revenue_ bersih ke dalam tiket.
  4. Tiket ditutup dengan status **WON**.

### Tahap 6: Pemantauan & Pelaporan (Real-Time)

Data dari siklus di atas mengalir secara _real-time_ ke tingkat manajemen tanpa perlu rekapitulasi manual:

- **Sales Manager:** Memantau pergerakan Kanban seluruh tim, memvalidasi bukti kunjungan GPS, dan memantau tiket mana yang lambat di-_follow-up_.
- **Direktur (Owner):** Membuka _Dashboard_ Eksekutif untuk melihat total _revenue_ yang masuk, mengidentifikasi klien penyumbang PO terbesar, dan melihat grafik perbandingan antara jumlah kunjungan dengan _revenue_ yang dihasilkan.
