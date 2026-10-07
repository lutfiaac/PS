# Posgram — revisi dashboard Kesiapan TKA

Prototipe React berdasarkan screenshot dashboard existing dan 12 poin revisi. Tidak tersambung ke aplikasi produksi atau API Posgram.

## Jalankan

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 4173
```

Filter tahap, paket, tahun ajaran, mapel untuk submateri, pengurutan kelas, detail mapel/submateri, dan pemetaan murid dapat digunakan. Pemetaan disimpan selama sesi tampilan, bukan di server.

Status pelaksanaan asesmen mempertahankan empat summary card dan menampilkan accordion tertutup untuk sesi aktif/mendatang. Tanggal fixture mengacu pada 7 Oktober 2026; sesi aktif ditampilkan sebelum sesi mendatang yang diurutkan menurut tanggal terdekat. Filter paket/tahun ajaran berlaku, termasuk empty state pada tahun ajaran 2025/2026. Tombol “Lihat Detail” membuka route lokal `#/asesmen` yang memuat seluruh riwayat, termasuk sesi selesai dan belum dijadwalkan; tombol kembali mengembalikan dashboard.

## Logika pengukuran

Paket soal → kompetensi per murid → murid → kelas/sekolah. Nilai murid mendapat bobot setara. Kompetensi yang belum terukur dikecualikan. Murid belum dipetakan tetap masuk sekolah, tidak masuk kelas. Pretest dan post-test terpisah.

Populasi sasaran sekolah belum dapat dipastikan. Tidak ada denominator total murid atau persentase coverage. Readiness menjelaskan murid terukur saja. Urutan dashboard: kondisi murid terukur → data yang tersedia → kelas/kelompok belum memiliki kelas → mapel → submateri yang difilter per mapel → status pelaksanaan asesmen.

Asumsi simulasi: 0 murid terukur = “Belum ada data” dan nilai —; 1–2 murid = “Data terbatas”; ≥3 murid = “Ada data”. Submateri dengan data terbatas ditampilkan tanpa peringkat prioritas. Tabel kelas menampilkan total murid yang benar-benar tercatat di kelompok, bukan denominator target sekolah atau coverage. Angka sesi adalah fixture operasional terpisah.

Kategori status: Pendampingan <65, Penguatan 65–84 (hingga kurang dari 85 untuk nilai desimal), Pengayaan ≥85. Sesuai pilihan pengguna, status memakai `assessmentScore` sebagai simulasi nilai asesmen terpisah agar default tetap 5/6/0; `score` tetap nilai kesiapan berbasis kompetensi, sehingga gauge tetap 44% dan kelas tetap 42%/58%/—. Keduanya difilter menurut tahap, paket, dan periode. Persentase/progress status selalu berasal dari jumlah murid dengan nilai asesmen, bukan rentang nilai. Perbedaan sumber simulasi ini dijelaskan di dialog info status.

## Validasi

```sh
node --test tests/readiness.test.mjs
node --test tests/sessions.test.mjs
npm run build
```

The measured-readiness card classifies its competency-based average independently of the pupil assessment-score distribution: below 65% is Kesiapan Rendah, 65% to below 85% is Siap dengan Penguatan, and 85% or above is Sangat Siap. Continuous intervals include fractional averages without overlaps or gaps. The title info icon provides category explanations on hover/focus and click; the footer calculation link retains the aggregation explanation. Empty measurements show an em dash and no readiness category; a valid zero remains a measured value. Run `node scripts/check-measured-readiness.mjs` with the same `POSGRAM_BROWSER_PATH` setup as the dashboard browser checks to verify categories, tooltip interaction, responsive layout, and empty/zero states.

## Filter bertingkat dan periode custom

Toolbar existing memakai Kategori → Mata Pelajaran → Paket → Periode. Katalog `assessmentPackages` menyediakan paket unik per kategori/mapel; opsi turunan dihasilkan dari katalog dan pilihan yang tidak lagi valid direset ke Semua. Nilai default tetap readiness 44%, 11 murid, distribusi 5/6/0, 12 asesmen dianalisis, serta summary operasional 13/1/4/10.

Records memiliki category, subject, packageKey/packageName, assessmentDate, academicYear, dan assessmentId. Sesi operasional memiliki relasi katalog serta tanggal mulai/akhir. Semua section, modal detail, dan riwayat menggunakan fungsi scope yang sama. Jumlah asesmen dianalisis dihitung dari assessmentId unik pada records terpilih; jumlah sesi/status dihitung dari ledger operasional terpilih. Keduanya merupakan fixture simulasi, bukan koneksi backend.

Periode custom memakai input tanggal native di popover toolbar, validasi tanggal akhir, tombol Terapkan/Batal, dan label range Indonesia. Range inklusif dapat melintasi tahun ajaran. Sesi bertanggal yang beririsan dengan range disertakan; sesi belum dijadwalkan tanpa tanggal tidak masuk custom range. Bila tidak ada hasil analisis, dashboard menampilkan pesan kosong global serta nilai kesiapan —.

Validasi tambahan: `node --test --test-isolation=none tests/readiness.test.mjs tests/sessions.test.mjs tests/filters.test.mjs` dan `node scripts/check-filters.mjs` (gunakan POSGRAM_BROWSER_PATH seperti browser checks existing). Script memeriksa enam viewport, parent/child reset, seluruh section/riwayat, custom range, validasi, dan empty result.

## Kesiapan Kelas

Klik nama kelas atau chevron pada Kondisi per Kelas untuk membuka halaman Kesiapan Kelas di `#/kelas/6A` (sesuai kelas yang dipilih). Halaman ini memakai top bar/sidebar yang sama, memiliki tombol Kembali ke dashboard, dan mendukung navigasi browser serta reload URL langsung. Detail kelas kini mencakup ringkasan agregat, Kondisi Kesiapan Murid, dan tabel Kondisi per Murid dengan filter status, sorting, serta aksi detail murid. Filter global yang dipilih tetap berlaku.

Pada drill-down kelas, status murid memakai nilai kesiapan per murid yang sudah dihitung dari kompetensi terukur: Pendampingan <64, Penguatan 64 hingga kurang dari 85, Pengayaan ≥85. Mapping ini dipakai bersama oleh tabel dan distribusi kelas. Label agregat seperti Kesiapan Rendah tetap hanya muncul di ringkasan kelas; batas agregat/dashboard sebelumnya tetap 65/85. Data contoh tidak diubah untuk memaksakan angka distribusi ilustratif.

Murid tanpa nilai valid berstatus Belum Terukur, dengan readiness dan jumlah asesmen —. Mereka tidak masuk rata-rata atau denominator distribusi. Nilai nol yang valid tetap terukur. Asesmen dihitung dari assessmentId unik, bukan jumlah observasi kompetensi. Murid belum terukur ditempatkan terakhir pada semua urutan. Filter/sorting tabel tidak mengubah ringkasan kelas dan bertahan saat kembali dari detail murid. Nilai desimal dekat threshold ditampilkan dengan presisi yang cukup agar pembulatan angka tidak mengesankan status yang berbeda.

Validasi: `tests/class-readiness.test.mjs` dan `scripts/check-class-readiness.mjs` menguji batas 64/85, distribusi, denominator, jumlah asesmen unik, sorting/filter, keadaan kosong/nol, tooltip, aksi detail murid, kesesuaian agregat dengan kelas di dashboard, serta layout desktop/mobile.

Halaman kelas mempertahankan filter global selama navigasi dari/ke dashboard. Chevron ditempatkan di sel Kesiapan sehingga empat kolom data kelas tetap utuh. Kelompok belum memiliki kelas tetap memakai aksi pemetaan. Filter/sorting murid serta aksi detail murid menggunakan komponen kelas yang sama; kelas tidak lagi dibuka dalam modal.
