# Daftar Teknologi Kavi

Kavi dibangun menggunakan gabungan beberapa kerangka kerja dan layanan modern untuk mendukung pelaporan publik yang cepat, terstruktur, dan hemat sumber daya.

## 1. Kerangka Kerja Utama & Antarmuka

1. **Next.js (v16.4.3 - App Router)**
   Next.js digunakan sebagai kerangka kerja fullstack untuk menangani sisi antarmuka pengguna maupun logika server dalam satu repositori terpadu. Sistem perutean berbasis direktori (`app/`) memudahkan pemisahan halaman utama (`/`) dan halaman informasi tim (`/about`).

2. **React (v19.3.0) & React Dom**
   React 19 digunakan untuk membangun komponen interaktif berbasis state, seperti kanvas simulasi alur laporan di Hero, penggeser peta perbandingan sebelum dan sesudah di bagian jaringan warga, serta pengelolaan kolom komentar dan penutupan laporan.

3. **TypeScript (v5)**
   Seluruh kode sumber ditulis dengan TypeScript untuk menjaga keamanan tipe data pada setiap properti komponen (`CardViewProps`, `PostPageViewProps`, `SolvedPostPageViewProps`, `CrewMember`, dan konfigurasi tema).

## 2. Sistem Desain & Tipografi

1. **Token Desain Terpusat (`app/config/theme.ts` & `app/config/tagColors.ts`)**
   Kavi menggunakan sistem token desain terpusat yang menyimpan seluruh palet warna (`#0f8b8d` sebagai warna utama, `#f9f9f9` sebagai permukaan terang, `#14ae5c` untuk lencana pemerintah, `#dc2626` untuk lencana internal), ukuran huruf, jarak ruang, radius sudut, hingga warna deterministik untuk label topik laporan.

2. **Arsitektur Komponen Bertingkat (`app/components/`)**
   Komponen dibagi ke dalam empat tingkat agar mudah digunakan ulang:
   - `small/`: Komponen dasar seperti `Button`, `Avatar`, `FormalPhoto`, `Badge`, dan `TagPill`.
   - `medium/`: Komponen gabungan seperti `AuthorMetadata`, `ActionsButton`, `InputToolbar`, `SelectionToolbar`, `InputComment`, `ClosedThread`, dan `CommentItem`.
   - `large/`: Tampilan utuh seperti `CardView`, `PostCreateModal`, `PostPageView`, dan `SolvedPostPageView`.
   - `land/`: Bagian halaman utama dan halaman profil seperti `Navbar`, `Hero`, `NetworkSection`, `CtaSection`, `AboutContent`, dan `Footer`.

3. **Lucide React & Grafik Vektor Terukur**
   Ikon antarmuka menggunakan pustaka `lucide-react` yang dipadukan dengan ilustrasi vektor kustom untuk peta jaringan laporan warga dan diagram alur penyelesaian masalah.

4. **Tipografi (`Dm Sans` & `Joti One`)**
   Menggunakan `next/font/google` untuk memuat huruf `Dm Sans` sebagai huruf bacaan utama yang bersih dan mudah dibaca, serta `Joti One` khusus untuk identitas merek Kavi.

## 3. Basis Data & Penyimpanan Sesi

1. **Turso (Berbasis Sqlite)**
   Turso digunakan sebagai layanan basis data utama berbasis Sqlite di tepi jaringan (edge) untuk menyimpan laporan warga, lokasi provinsi, komentar dukungan, serta status penyelesaian laporan dengan latensi rendah.

2. **Upstash**
   Upstash digunakan untuk menangani kejadian singkat (seperti antrean pemungutan suara, pembatasan laju permintaan, dan penyimpanan sementara) yang memerlukan fleksibilitas koneksi tinggi, sehingga menghemat pemakaian kuota koneksi basis data utama.

## 4. Perkakas Pengembang & Repositori

1. **Pnpm (v11.17.0)**
   Digunakan sebagai pengelola paket yang cepat dan hemat ruang penyimpanan.

2. **GitHub**
   Digunakan sebagai tempat penyimpanan kode sumber di awan serta pengelolaan versi kolaboratif tim pengembang.
