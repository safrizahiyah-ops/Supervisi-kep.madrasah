import { AppState, Guru, CeklisPerTahap, ButirCeklisGuru, RubrikCiri, AspekTelaah } from '../types';

export const DEFAULT_ASPEK_TELAAH: Omit<AspekTelaah, 'skor' | 'catatan'>[] = [
  { id: 'asp1', nama: '1. Kejelasan Tujuan Pembelajaran (Spesifik, Terukur, Relevan)' },
  { id: 'asp2', nama: '2. Kebermaknaan Materi & Kontekstualisasi Kehidupan Nyata' },
  { id: 'asp3', nama: '3. Inovasi & Variasi Metode / Pendekatan Pembelajaran' },
  { id: 'asp4', nama: '4. Desain Pembelajaran Berdiferensiasi (Konten, Proses, atau Produk)' },
  { id: 'asp5', nama: '5. Rencana Pelibatan Aktif Siswa (Student-Centered & Diskusi)' },
  { id: 'asp6', nama: '6. Asesmen Autentik (Formatif, LKPD, Rubrik Kinerja)' },
  { id: 'asp7', nama: '7. Alokasi Waktu Refleksi Terbimbing di Akhir Pembelajaran' },
];

export const DEFAULT_RUBRIK_6_CIRI: Omit<RubrikCiri, 'skor' | 'rujukanCatatanWaktu' | 'catatanSupervisor'>[] = [
  {
    id: 'ciri_bermakna',
    namaCiri: '1. Pembelajaran Bermakna',
    deskripsi: 'Menghubungkan materi dengan realitas siswa, konteks keislaman/sosial, dan pemecahan masalah otentik.',
    deskriptorLevel: {
      1: 'Materi disampaikan abstrak, hafalan rumus/teks tanpa kaitan dengan pengalaman hidup siswa.',
      2: 'Guru memberikan contoh kontekstual di awal namun tidak dieksplorasi lebih lanjut oleh siswa.',
      3: 'Siswa diajak mengaitkan materi dengan kasus nyata di lingkungan sekitar dan relevansi kehidupannya.',
      4: 'Siswa secara mandiri menganalisis solusi masalah nyata berdasarkan konsep materi yang dipelajari.'
    }
  },
  {
    id: 'ciri_inovatif',
    namaCiri: '2. Pembelajaran Inovatif',
    deskripsi: 'Menggunakan strategi baru, media adaptif, atau integrasi teknologi yang memicu rasa ingin tahu.',
    deskriptorLevel: {
      1: 'Metode monoton ceramah searah tanpa variasi media penunjang.',
      2: 'Menggunakan slide/media namun hanya untuk menampilkan teks buku tanpa interaktivitas.',
      3: 'Memadukan metode interaktif (games edukatif, simulasi, media digital) yang memikat atensi siswa.',
      4: 'Inovasi pembelajaran memberi ruang luas eksplorasi, eksperimen kreatif, atau kolaborasi kelompok dinamis.'
    }
  },
  {
    id: 'ciri_berdiferensiasi',
    namaCiri: '3. Pembelajaran Berdiferensiasi',
    deskripsi: 'Mengakomodasi kesiapan belajar, minat, dan profil belajar siswa secara bertahap.',
    deskriptorLevel: {
      1: 'Semua siswa diberi instruksi, bahan bacaan, dan tugas yang seragam tanpa scaffolding.',
      2: 'Guru menyadari keragaman siswa namun diferensiasi baru sebatas perlakuan spontan saat ada yang tertinggal.',
      3: 'Tersedia variasi materi/tingkat kesulitan tugas (scaffolding berjenjang) sesuai kelompok kesiapan siswa.',
      4: 'Diferensiasi terencana matang (proses & produk belajar) dengan bimbingan terfokus bagi yang membutuhkan.'
    }
  },
  {
    id: 'ciri_berpusat_siswa',
    namaCiri: '4. Berpusat pada Siswa (Student-Centered)',
    deskripsi: 'Siswa menjadi subjek aktif penyelidikan, berdiskusi, bernalar, dan guru berperan sebagai fasilitator.',
    deskriptorLevel: {
      1: 'Guru mendominasi waktu bicara (>75%), siswa pasif mencatat atau mendengarkan.',
      2: 'Ada tanya jawab namun hanya menyasar siswa tertentu yang aktif dan bersifat satu kata/hafalan.',
      3: 'Siswa aktif berkolaborasi dalam kelompok kecil, berdialog argumentatif, dan mempresentasikan ide.',
      4: 'Siswa memimpin jalannya diskusi, saling menanggapi, menguji hipotesis, dengan proporsi aktif siswa >65% waktu.'
    }
  },
  {
    id: 'ciri_reflektif',
    namaCiri: '5. Pembelajaran Reflektif',
    deskripsi: 'Memfasilitasi siswa menyadari apa yang dipahami, apa yang belum dipahami, dan strategi belajarnya.',
    deskriptorLevel: {
      1: 'Pelajaran ditutup terburu-buru bel berbunyi tanpa ada jeda refleksi pemahaman siswa.',
      2: 'Guru menanyakan "Apakah ada pertanyaan?" secara klasikal tanpa respon bermakna dari siswa.',
      3: 'Guru memberikan lembar atau pertanyaan refleksi terstruktur (apa yang dipelajari, hal paling menantang).',
      4: 'Siswa mengevaluasi sendiri proses belajarnya, merumuskan target perbaikan diri, dan saling memberi masukan konstruktif.'
    }
  },
  {
    id: 'ciri_asesmen_autentik',
    namaCiri: '6. Asesmen Autentik & Umpan Balik',
    deskripsi: 'Asesmen formatif yang memantau proses belajar secara langsung disertai umpan balik deskriptif seketika.',
    deskriptorLevel: {
      1: 'Hanya asesmen tertulis di akhir bab tanpa asesmen formatif saat proses KBM berlangsung.',
      2: 'Menilai lembar kerja siswa hanya dengan benar/salah atau nilai angka tanpa penjelasan perbaikan.',
      3: 'Guru berkeliling memeriksa pemahaman, menggunakan rubrik observasi singkat, dan memberi umpan balik langsung.',
      4: 'Asesmen formatif berkelanjutan menjadi dasar penyesuaian laju mengajar secara real-time di kelas.'
    }
  }
];

export const CEKLIS_PENDAMPINGAN_TEMPLATE: { kelompok: ButirCeklisGuru['kelompok']; kelompokNama: string; deskripsi: string }[] = [
  // A: Bermakna
  { kelompok: 'A', kelompokNama: 'A. Pembelajaran Bermakna', deskripsi: 'A1. Mengaitkan topik dengan pengalaman sehari-hari / lingkungan madrasah' },
  { kelompok: 'A', kelompokNama: 'A. Pembelajaran Bermakna', deskripsi: 'A2. Menjelaskan "mengapa materi ini penting dipelajari" (orientasi tujuan hidup/ibadah)' },
  { kelompok: 'A', kelompokNama: 'A. Pembelajaran Bermakna', deskripsi: 'A3. Menyajikan studi kasus / permasalahan nyata yang relevan' },
  // B: Inovatif
  { kelompok: 'B', kelompokNama: 'B. Pembelajaran Inovatif', deskripsi: 'B1. Menggunakan variasi metode pembelajaran (tidak hanya ceramah)' },
  { kelompok: 'B', kelompokNama: 'B. Pembelajaran Inovatif', deskripsi: 'B2. Memanfaatkan media pembelajaran konkret / digital secara tepat guna' },
  { kelompok: 'B', kelompokNama: 'B. Pembelajaran Inovatif', deskripsi: 'B3. Mendorong rasa ingin tahu dan eksplorasi kreatif siswa' },
  // C: Berdiferensiasi
  { kelompok: 'C', kelompokNama: 'C. Pembelajaran Berdiferensiasi', deskripsi: 'C1. Mengetahui profil & kesiapan belajar siswa sebelumnya (asesmen awal)' },
  { kelompok: 'C', kelompokNama: 'C. Pembelajaran Berdiferensiasi', deskripsi: 'C2. Menyediakan scaffolding / bantuan bertingkat bagi siswa yang kesulitan' },
  { kelompok: 'C', kelompokNama: 'C. Pembelajaran Berdiferensiasi', deskripsi: 'C3. Memberikan pilihan tugas / produk akhir sesuai minat dan kapasitas siswa' },
  // D: Berpusat pada Siswa
  { kelompok: 'D', kelompokNama: 'D. Berpusat pada Siswa', deskripsi: 'D1. Proporsi aktivitas siswa lebih dominan dibanding ceramah guru' },
  { kelompok: 'D', kelompokNama: 'D. Berpusat pada Siswa', deskripsi: 'D2. Memfasilitasi kerja kolaboratif / diskusi kelompok yang aktif dan terarah' },
  { kelompok: 'D', kelompokNama: 'D. Berpusat pada Siswa', deskripsi: 'D3. Mengajukan pertanyaan pemantik tingkat tinggi (HOTS: mengapa, bagaimana jika)' },
  // E: Reflektif
  { kelompok: 'E', kelompokNama: 'E. Pembelajaran Reflektif', deskripsi: 'E1. Menyediakan alokasi waktu khusus untuk refleksi di akhir pembelajaran' },
  { kelompok: 'E', kelompokNama: 'E. Pembelajaran Reflektif', deskripsi: 'E2. Menggunakan instrumen refleksi (tiket keluar, jurnal belajar, emoticon check)' },
  { kelompok: 'E', kelompokNama: 'E. Pembelajaran Reflektif', deskripsi: 'E3. Meminta siswa merumuskan rencana tindak lanjut belajarnya sendiri' },
  // F: Asesmen Autentik
  { kelompok: 'F', kelompokNama: 'F. Asesmen Autentik', deskripsi: 'F1. Melakukan observasi penilaian formatif selama proses pembelajaran berlangsung' },
  { kelompok: 'F', kelompokNama: 'F. Asesmen Autentik', deskripsi: 'F2. Memberikan umpan balik deskriptif spesifik (bukan sekadar "bagus" atau "salah")' },
  { kelompok: 'F', kelompokNama: 'F. Asesmen Autentik', deskripsi: 'F3. Melibatkan penilaian diri (self-assessment) atau antar-teman (peer-assessment)' },
  // G: Iklim Kelas & Karakter
  { kelompok: 'G', kelompokNama: 'G. Iklim Kelas & Karakter', deskripsi: 'G1. Membangun kesepakatan / keyakinan kelas yang ditegakkan secara positif' },
  { kelompok: 'G', kelompokNama: 'G. Iklim Kelas & Karakter', deskripsi: 'G2. Menciptakan rasa aman psikologis (tidak mempermalukan siswa yang salah)' },
  { kelompok: 'G', kelompokNama: 'G. Iklim Kelas & Karakter', deskripsi: 'G3. Mengintegrasikan penanaman nilai adab Islami dan Profil Pelajar Rahmatan lil Alamin' },
];

export const INITIAL_GURUS: Guru[] = [
  {
    id: 'guru_1',
    nama: 'Ustadzah Siti Aminah, S.Pd.I',
    nip: '198504122009122004',
    mapel: 'Fikih',
    kelas: 'Kelas VIII-A',
    fokusPengembangan: 'Diferensiasi proses dan asesmen formatif otentik pada materi muamalah',
    supervisorId: 'sup_1',
    supervisorNama: 'Dr. H. Ahmad Dahlan, M.Pd (Kepala Madrasah)',
  },
  {
    id: 'guru_2',
    nama: 'Pak Ahmad Fauzi, M.Pd',
    nip: '198809212011011003',
    mapel: 'Matematika',
    kelas: 'Kelas IX-B',
    fokusPengembangan: 'Meningkatkan pelibatan siswa aktif bernalar & mengurangi ceramah guru',
    supervisorId: 'sup_1',
    supervisorNama: 'Dr. H. Ahmad Dahlan, M.Pd (Kepala Madrasah)',
  },
  {
    id: 'guru_3',
    nama: 'Bu Nurul Hidayah, S.Si',
    nip: '199201152019032011',
    mapel: 'Ilmu Pengetahuan Alam (IPA)',
    kelas: 'Kelas VII-C',
    fokusPengembangan: 'Penerapan metode eksperimen inkuiri kontekstual dan refleksi terbimbing',
    supervisorId: 'sup_2',
    supervisorNama: 'Dra. Hj. Maryam, M.Pd (Wakil Bidang Kurikulum)',
  },
  {
    id: 'guru_4',
    nama: 'Pak Muhammad Rizky, S.Pd',
    nip: '199406082020121008',
    mapel: 'Bahasa Arab',
    kelas: 'Kelas VIII-C',
    fokusPengembangan: 'Pembelajaran inovatif berbasis media interaktif game muhadatsah',
    supervisorId: 'sup_2',
    supervisorNama: 'Dra. Hj. Maryam, M.Pd (Wakil Bidang Kurikulum)',
  },
  {
    id: 'guru_5',
    nama: 'Bu Dewi Sartika, M.Pd',
    nip: '198711032010012007',
    mapel: 'Bahasa Indonesia',
    kelas: 'Kelas VII-A',
    fokusPengembangan: 'Penyusunan rubrik asesmen autentik teks deskripsi & umpan balik sejawat',
    supervisorId: 'sup_1',
    supervisorNama: 'Dr. H. Ahmad Dahlan, M.Pd (Kepala Madrasah)',
  },
];

export const INITIAL_CEKLIS_TAHAP: CeklisPerTahap[] = [
  {
    tahapId: 1,
    namaTahap: 'Tahap 1: Persiapan (1–14 Okt 2026)',
    items: [
      { id: 't1_1', nomor: 1, kegiatan: 'Membentuk Tim Supervisor Madrasah dan menyusun SK Kepengurusan', selesai: true, tanggalSelesai: '2026-10-02' },
      { id: 't1_2', nomor: 2, kegiatan: 'Mengisi Instrumen 1 Program Supervisi Akademik dengan 6 fokus ciri pembelajaran', selesai: true, tanggalSelesai: '2026-10-04' },
      { id: 't1_3', nomor: 3, kegiatan: 'Melakukan pemetaan awal kebutuhan pengembangan guru berdasarkan data supervisi lalu', selesai: true, tanggalSelesai: '2026-10-05' },
      { id: 't1_4', nomor: 4, kegiatan: 'Menyusun draf Jadwal Supervisi (Instrumen 2) untuk seluruh guru', selesai: true, tanggalSelesai: '2026-10-07' },
      { id: 't1_5', nomor: 5, kegiatan: 'Memeriksa dan menyelesaikan bentrok jadwal observasi dengan KBM madrasah', selesai: true, tanggalSelesai: '2026-10-08' },
      { id: 't1_6', nomor: 6, kegiatan: 'Rapat koordinasi sosialisasi supervisi akademik kepada seluruh dewan guru', selesai: true, tanggalSelesai: '2026-10-10' },
      { id: 't1_7', nomor: 7, kegiatan: 'Menjelaskan prinsip dialog kolegial: supervisi sebagai cermin bukan vonis', selesai: true, tanggalSelesai: '2026-10-10' },
      { id: 't1_8', nomor: 8, kegiatan: 'Membagikan rubrik dan instrumen observasi kepada guru secara transparan', selesai: true, tanggalSelesai: '2026-10-11' },
      { id: 't1_9', nomor: 9, kegiatan: 'Memastikan ruang coaching yang nyaman dan terjaga kerahasiaannya telah siap', selesai: true, tanggalSelesai: '2026-10-12' },
      { id: 't1_10', nomor: 10, kegiatan: 'Mengunggah dan mengesahkan jadwal supervisi definitif di papan informasi/portal guru', selesai: true, tanggalSelesai: '2026-10-14' },
    ]
  },
  {
    tahapId: 2,
    namaTahap: 'Tahap 2: Pra-Pelaksanaan (15–31 Okt 2026)',
    items: [
      { id: 't2_1', nomor: 1, kegiatan: 'Mengumpulkan modul ajar / RPP guru yang akan disupervisi minimal H-3', selesai: true, tanggalSelesai: '2026-10-18' },
      { id: 't2_2', nomor: 2, kegiatan: 'Menelaah perencanaan pembelajaran menggunakan Instrumen 3 (7 aspek telaah)', selesai: true, tanggalSelesai: '2026-10-20' },
      { id: 't2_3', nomor: 3, kegiatan: 'Membatasi catatan telaah perencanaan: maksimal 3 penguatan dan 2 saran terarah', selesai: true, tanggalSelesai: '2026-10-20' },
      { id: 't2_4', nomor: 4, kegiatan: 'Melakukan dialog pra-observasi santai (15–20 menit) berlandaskan kemitraan', selesai: true, tanggalSelesai: '2026-10-22' },
      { id: 't2_5', nomor: 5, kegiatan: 'Menyepakati fokus utama observasi yang ingin dikembangkan oleh guru', selesai: true, tanggalSelesai: '2026-10-22' },
      { id: 't2_6', nomor: 6, kegiatan: 'Mengisi Ceklis Pendampingan kolom "Direncanakan Guru" bersama-sama', selesai: true, tanggalSelesai: '2026-10-23' },
      { id: 't2_7', nomor: 7, kegiatan: 'Menentukan posisi duduk supervisor di kelas yang tidak mengganggu alur KBM', selesai: true, tanggalSelesai: '2026-10-25' },
      { id: 't2_8', nomor: 8, kegiatan: 'Menyepakati cara perkenalan singkat supervisor di awal pembelajaran', selesai: true, tanggalSelesai: '2026-10-25' },
      { id: 't2_9', nomor: 9, kegiatan: 'Menandatangani lembar persetujuan Pra-Observasi (Instrumen 4)', selesai: true, tanggalSelesai: '2026-10-28' },
      { id: 't2_10', nomor: 10, kegiatan: 'Menyiapkan lembar catatan observasi evidence faktual untuk hari pelaksanaan', selesai: true, tanggalSelesai: '2026-10-30' },
    ]
  },
  {
    tahapId: 3,
    namaTahap: 'Tahap 3: Observasi (2 Nov – 4 Des 2026)',
    items: [
      { id: 't3_1', nomor: 1, kegiatan: 'Tiba di kelas 5 menit sebelum KBM dimulai dan duduk di posisi yang disepakati', selesai: true, tanggalSelesai: '2026-11-04' },
      { id: 't3_2', nomor: 2, kegiatan: 'Mencatat fakta peristiwa secara obyektif bertanda waktu pada Instrumen 5', selesai: true, tanggalSelesai: '2026-11-04' },
      { id: 't3_3', nomor: 3, kegiatan: 'Menghindari bahasa menghakimi/asumsi subjektif ("guru malas", "siswa bosan")', selesai: true, tanggalSelesai: '2026-11-04' },
      { id: 't3_4', nomor: 4, kegiatan: 'Menghitung estimasi menit guru berbicara vs menit siswa aktif beraktivitas', selesai: true, tanggalSelesai: '2026-11-04' },
      { id: 't3_5', nomor: 5, kegiatan: 'Mencatat jumlah siswa yang terlibat secara aktif dalam diskusi/tugas', selesai: true, tanggalSelesai: '2026-11-04' },
      { id: 't3_6', nomor: 6, kegiatan: 'Mengisi Ceklis Pendampingan kolom "Terlihat Supervisor" berdasarkan fakta KBM', selesai: true, tanggalSelesai: '2026-11-04' },
      { id: 't3_7', nomor: 7, kegiatan: 'Mengisi Rubrik 6 Ciri Pembelajaran pada Instrumen 6 dengan deskriptor objektif', selesai: true, tanggalSelesai: '2026-11-04' },
      { id: 't3_8', nomor: 8, kegiatan: 'Memastikan setiap skor 1–4 pada Instrumen 6 merujuk ke minimal satu bukti waktu Instrumen 5', selesai: true, tanggalSelesai: '2026-11-04' },
      { id: 't3_9', nomor: 9, kegiatan: 'Tidak menginterupsi jalannya KBM di kelas kecuali terjadi bahaya fisik', selesai: true, tanggalSelesai: '2026-11-04' },
      { id: 't3_10', nomor: 10, kegiatan: 'Menyampaikan apresiasi singkat kepada guru dan siswa saat jam pelajaran usai', selesai: true, tanggalSelesai: '2026-11-04' },
    ]
  },
  {
    tahapId: 4,
    namaTahap: 'Tahap 4: Refleksi & Coaching (9 Nov – 11 Des 2026)',
    items: [
      { id: 't4_1', nomor: 1, kegiatan: 'Melakukan anonimisasi catatan Instrumen 5 sebelum dianalisis dengan AI (Instrumen 7)', selesai: true, tanggalSelesai: '2026-11-05' },
      { id: 't4_2', nomor: 2, kegiatan: 'Meninjau hasil ringkasan pola interaksi dan 5 draf pertanyaan reflektif AI', selesai: true, tanggalSelesai: '2026-11-05' },
      { id: 't4_3', nomor: 3, kegiatan: 'Memverifikasi hasil AI terhadap fakta asli observasi sebelum sesi coaching', selesai: true, tanggalSelesai: '2026-11-05' },
      { id: 't4_4', nomor: 4, kegiatan: 'Menyelenggarakan sesi coaching maksimal dalam 7 hari setelah observasi', selesai: true, tanggalSelesai: '2026-11-06' },
      { id: 't4_5', nomor: 5, kegiatan: 'Mengatur timer 45 menit untuk menjaga fokus dan efektivitas percakapan GROW', selesai: true, tanggalSelesai: '2026-11-06' },
      { id: 't4_6', nomor: 6, kegiatan: 'Memfasilitasi GOAL: membiarkan guru menetapkan fokus perbaikan yang diinginkan', selesai: true, tanggalSelesai: '2026-11-06' },
      { id: 't4_7', nomor: 7, kegiatan: 'Membahas REALITY: menyajikan data selisih Ceklis Direncanakan vs Terlihat', selesai: true, tanggalSelesai: '2026-11-06' },
      { id: 't4_8', nomor: 8, kegiatan: 'Mengeksplorasi OPTIONS: memancing alternatif solusi kreatif dari dalam diri guru', selesai: true, tanggalSelesai: '2026-11-06' },
      { id: 't4_9', nomor: 9, kegiatan: 'Mengukuhkan WILL: menyusun komitmen 4 unsur (tindakan, kelas, waktu, ukuran keberhasilan)', selesai: true, tanggalSelesai: '2026-11-06' },
      { id: 't4_10', nomor: 10, kegiatan: 'Menandatangani Catatan Sesi Coaching (Instrumen 9) bersama guru dan saksi', selesai: true, tanggalSelesai: '2026-11-06' },
    ]
  },
  {
    tahapId: 5,
    namaTahap: 'Tahap 5: Tindak Lanjut (4 Jan – 26 Feb 2027)',
    items: [
      { id: 't5_1', nomor: 1, kegiatan: 'Merekap seluruh komitmen guru dari Instrumen 9 ke dalam RTL Madrasah (Instrumen 10)', selesai: true, tanggalSelesai: '2027-01-08' },
      { id: 't5_2', nomor: 2, kegiatan: 'Mengelompokkan kebutuhan dukungan: Pelatihan, Media, MGMP, Kebijakan', selesai: true, tanggalSelesai: '2027-01-10' },
      { id: 't5_3', nomor: 3, kegiatan: 'Menugaskan pendamping sejawat atau fasilitator pelatihan sesuai kebutuhan', selesai: true, tanggalSelesai: '2027-01-12' },
      { id: 't5_4', nomor: 4, kegiatan: 'Melaksanakan Kunjungan Singkat 1 (10–15 menit) untuk memantau penerapan komitmen', selesai: true, tanggalSelesai: '2027-01-20' },
      { id: 't5_5', nomor: 5, kegiatan: 'Memberikan umpan balik lisan/tertulis singkat segera setelah Kunjungan 1', selesai: true, tanggalSelesai: '2027-01-20' },
      { id: 't5_6', nomor: 6, kegiatan: 'Memeriksa jurnal refleksi berkala dua mingguan yang dikirim guru (Instrumen 12)', selesai: true, tanggalSelesai: '2027-01-25' },
      { id: 't5_7', nomor: 7, kegiatan: 'Memberikan respon/balasan penguatan Kepala Madrasah dalam tempo maksimal 3 hari', selesai: true, tanggalSelesai: '2027-01-27' },
      { id: 't5_8', nomor: 8, kegiatan: 'Melaksanakan Kunjungan Singkat 2 (10–15 menit) memastikan progres berkelanjutan', selesai: false },
      { id: 't5_9', nomor: 9, kegiatan: 'Memvalidasi bahwa setiap guru binaan telah menerima minimal 2 kunjungan monitoring', selesai: false },
      { id: 't5_10', nomor: 10, kegiatan: 'Menyiapkan berkas dan jadwal untuk pelaksanaan supervisi ulang di siklus Maret', selesai: false },
    ]
  },
  {
    tahapId: 6,
    namaTahap: 'Tahap 6: Siklus Lanjutan (1–31 Mar 2027)',
    items: [
      { id: 't6_1', nomor: 1, kegiatan: 'Melaksanakan observasi KBM kedua (Supervisi Ulang - Instrumen 13)', selesai: false },
      { id: 't6_2', nomor: 2, kegiatan: 'Mencatat evidence objektif dan mengisi rubrik 6 ciri menggunakan standar yang sama', selesai: false },
      { id: 't6_3', nomor: 3, kegiatan: 'Membandingkan grafik skor observasi pertama (Okt-Nov) vs observasi kedua (Maret)', selesai: false },
      { id: 't6_4', nomor: 4, kegiatan: 'Mengisi tabel Rekap Perkembangan Guru (Instrumen 14) secara otomatis', selesai: false },
      { id: 't6_5', nomor: 5, kegiatan: 'Menentukan kategori perkembangan guru (Berkembang, Stabil, Perlu Pendampingan Khusus)', selesai: false },
      { id: 't6_6', nomor: 6, kegiatan: 'Mengidentifikasi ciri pembelajaran yang paling berkembang dan bukti konkretnya', selesai: false },
      { id: 't6_7', nomor: 7, kegiatan: 'Menyelenggarakan dialog refleksi akhir tahun dan merumuskan sasaran siklus tahun depan', selesai: false },
      { id: 't6_8', nomor: 8, kegiatan: 'Mengisi Instrumen 15 Evaluasi Makro Supervisi Madrasah (6 dimensi)', selesai: false },
      { id: 't6_9', nomor: 9, kegiatan: 'Menginventarisasi instrumen yang perlu disederhanakan/diadaptasi untuk tahun depan', selesai: false },
      { id: 't6_10', nomor: 10, kegiatan: 'Mencetak Berkas Supervisi Guru & menyusun Laporan Ringkas Pengawas Madrasah Kemenag', selesai: false },
    ]
  },
];

export const INITIAL_JURNAL_SABTU: AppState['jurnalSabtu'] = [
  {
    id: 'sabtu_1',
    tanggal: '2026-10-10',
    mingguKe: 2,
    q1_pencapaianMingguIni: 'Sosialisasi program supervisi selesai disambut positif oleh dewan guru, persepsi supervisi sebagai ujian nilai mulai berganti menjadi kemitraan.',
    q2_momenBermaknaDialog: 'Percakapan informal saat istirahat dengan Pak Ahmad Fauzi tentang kecemasannya menghadapi siswa yang pasif di matematika kelas IX.',
    q3_kendalaDanHambatan: 'Beberapa guru senior sempat khawatir instrumen akan membebani jam mengajar mereka.',
    q4_guruPerluDukunganKhusus: 'Ustadzah Siti Aminah memerlukan contoh rubrik diferensiasi asesmen untuk fikih muamalah.',
    q5_fokusPrioritasMingguDepan: 'Memulai telaah perencanaan (modul ajar) dan menjadwalkan dialog pra-observasi tahap 2.'
  },
  {
    id: 'sabtu_2',
    tanggal: '2026-11-07',
    mingguKe: 6,
    q1_pencapaianMingguIni: 'Menuntaskan observasi KBM dan sesi coaching perdana untuk Ustadzah Siti Aminah.',
    q2_momenBermaknaDialog: 'Saat coaching GROW, beliau sendiri yang menyadari bahwa pembagian kelompok belajar sebelumnya belum berbasis kesiapan membaca siswa.',
    q3_kendalaDanHambatan: 'Menjaga timer coaching tetap 45 menit cukup menantang karena antusiasme refleksi guru sangat tinggi.',
    q4_guruPerluDukunganKhusus: 'Pak Ahmad Fauzi perlu simulasi ice-breaking dan teknik bertanya HOTS sebelum observasi Selasa depan.',
    q5_fokusPrioritasMingguDepan: 'Observasi kelas IX Matematika Pak Ahmad Fauzi dan kelas VII IPA Bu Nurul Hidayah.'
  }
];

export function getInitialAppState(): AppState {
  const gurus = INITIAL_GURUS;

  // Jadwal
  const jadwals: Record<string, any> = {
    guru_1: {
      tanggalTelaah: '2026-10-19',
      tanggalObservasi: '2026-11-04',
      tanggalCoaching: '2026-11-06',
      tanggalSupervisiUlang: '2027-03-08',
      waktuObservasi: '08:00 - 09:20 (Jam 1-2)'
    },
    guru_2: {
      tanggalTelaah: '2026-10-21',
      tanggalObservasi: '2026-11-10',
      tanggalCoaching: '2026-11-13',
      tanggalSupervisiUlang: '2027-03-10',
      waktuObservasi: '09:40 - 11:00 (Jam 3-4)'
    },
    guru_3: {
      tanggalTelaah: '2026-10-23',
      tanggalObservasi: '2026-11-17',
      tanggalCoaching: '2026-11-20',
      tanggalSupervisiUlang: '2027-03-15',
      waktuObservasi: '07:30 - 08:50 (Jam 1-2)'
    },
    guru_4: {
      tanggalTelaah: '2026-10-26',
      tanggalObservasi: '2026-11-24',
      tanggalCoaching: '2026-11-27',
      tanggalSupervisiUlang: '2027-03-18',
      waktuObservasi: '10:00 - 11:20 (Jam 4-5)'
    },
    guru_5: {
      tanggalTelaah: '2026-10-28',
      tanggalObservasi: '2026-12-01',
      tanggalCoaching: '2026-12-04',
      tanggalSupervisiUlang: '2027-03-22',
      waktuObservasi: '08:00 - 09:20 (Jam 1-2)'
    }
  };

  // Ceklis Pendampingan per guru
  const ceklisPendampingan: Record<string, any> = {};
  gurus.forEach((g, idx) => {
    ceklisPendampingan[g.id] = {
      guruId: g.id,
      items: CEKLIS_PENDAMPINGAN_TEMPLATE.map((t, bIdx) => ({
        id: `chk_${g.id}_${bIdx}`,
        kelompok: t.kelompok,
        kelompokNama: t.kelompokNama,
        deskripsi: t.deskripsi,
        // Preset sample data
        direncanakanGuru: idx === 0 ? [0, 1, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16, 18, 19, 20].includes(bIdx) : true,
        terlihatSupervisor: idx === 0 ? [0, 1, 3, 4, 9, 10, 15, 18, 19, 20].includes(bIdx) : (bIdx % 2 === 0),
        catatan: idx === 0 && bIdx === 6 ? 'Direncanakan variasi tugas namun saat observasi lembar kerja masih seragam' : ''
      }))
    };
  });

  // Instrumen 3 Telaah
  const instrument3: Record<string, any> = {
    guru_1: {
      guruId: 'guru_1',
      tanggalTelaah: '2026-10-19',
      aspek: DEFAULT_ASPEK_TELAAH.map((asp, i) => ({
        ...asp,
        skor: [4, 4, 3, 3, 4, 3, 4][i],
        catatan: [
          'Tujuan pembelajaran SMART memuat capaian analisis hukum jual beli online.',
          'Kontekstualisasi e-commerce / marketplace sangat dekat dengan rutinitas siswa.',
          'Rencana kolaborasi berbasis jigsaw sudah bagus.',
          'Perlu penegasan diferensiasi materi untuk siswa yang lambat membaca literatur fikih.',
          'Aktivitas siswa terencana dengan lembar kasus bergambar.',
          'Rubrik penilaian unjuk kerja sudah ada, perlu panduan penskoran yang lebih spesifik.',
          'Sesi refleksi 10 menit dialokasikan di akhir pertemuan.'
        ][i]
      })),
      penguatan: [
        'Kesesuaian tujuan fikih muamalah dengan fenomena riil jual beli digital siswa sangat kontekstual.',
        'Desain alur kerja kelompok mendorong komunikasi aktif dan penanaman adab bermuamalah.',
        'Instrumen refleksi penutup terstruktur dengan baik menggunakan pertanyaan panduan.'
      ],
      saran: [
        'Sediakan bahan bacaan fikih versi ringkas/infografis untuk kelompok siswa yang butuh bantuan membaca.',
        'Sertakan rubrik deskriptif pada lembar penilaian diskusi kelompok.'
      ],
      status: 'selesai',
      catatanUmum: 'Modul ajar sangat matang dan siap dilaksanakan pada observasi KBM.'
    },
    guru_2: {
      guruId: 'guru_2',
      tanggalTelaah: '2026-10-21',
      aspek: DEFAULT_ASPEK_TELAAH.map((asp, i) => ({
        ...asp,
        skor: [4, 3, 3, 2, 3, 3, 3][i],
        catatan: 'Perencanaan sistem persamaan linear dua variabel terstruktur baik.'
      })),
      penguatan: [
        'Masalah kontekstual jual-beli kantin madrasah sangat relevan untuk mengenalkan konsep SPLDV.',
        'Rencana kerja kelompok sudah membagi peran antar-anggota.'
      ],
      saran: [
        'Siapkan latihan berjenjang (scaffolding) untuk siswa yang belum tuntas aljabar dasar.',
        'Tingkatkan porsi penemuan konsep mandiri daripada pemberian rumus langsung.'
      ],
      status: 'selesai'
    }
  };

  // Instrumen 4 Pra Observasi
  const instrument4: Record<string, any> = {
    guru_1: {
      guruId: 'guru_1',
      tanggal: '2026-10-22',
      fokusObservasiDisepakati: [
        'Pemberian bimbingan berjenjang (diferensiasi proses) pada kelompok siswa berkemampuan berbeda',
        'Pelibatan seluruh siswa aktif berpendapat dalam analisis kasus jual beli online',
        'Asesmen formatif unjuk kerja dengan umpan balik langsung'
      ],
      posisiDudukSupervisor: 'Di sudut kanan belakang ruang kelas VIII-A, sejajar pandangan baris meja siswa agar tidak mengalihkan perhatian.',
      caraPerkenalan: 'Hadir senyap saat bel berbunyi; guru cukup menyapa "Hari ini ada Kepala Madrasah yang ikut belajar bersama kita" selama 30 detik tanpa menghentikan kegiatan.',
      catatanKesiapanGuru: 'Guru siap dengan media infografis dan LKPD kasus jual beli.',
      tandaTanganGuru: {
        nama: 'Ustadzah Siti Aminah, S.Pd.I',
        tanggal: '2026-10-22',
        disetujui: true
      },
      tandaTanganSupervisor: {
        nama: 'Dr. H. Ahmad Dahlan, M.Pd',
        tanggal: '2026-10-22',
        disetujui: true
      },
      status: 'selesai'
    },
    guru_2: {
      guruId: 'guru_2',
      tanggal: '2026-10-25',
      fokusObservasiDisepakati: [
        'Proporsi waktu bicara guru (menekan ceramah di bawah 40%)',
        'Interaksi tanya jawab bernalar kritis siswa'
      ],
      posisiDudukSupervisor: 'Di baris belakang tengah kelas IX-B.',
      caraPerkenalan: 'Masuk bersama guru, mengangguk ramah pada siswa.',
      catatanKesiapanGuru: 'LKPD SPLDV kantin siap digandakan.',
      tandaTanganGuru: { nama: 'Pak Ahmad Fauzi, M.Pd', tanggal: '2026-10-25', disetujui: true },
      tandaTanganSupervisor: { nama: 'Dr. H. Ahmad Dahlan, M.Pd', tanggal: '2026-10-25', disetujui: true },
      status: 'selesai'
    }
  };

  // Instrumen 5 Evidence Obyektif
  const instrument5: Record<string, any> = {
    guru_1: {
      guruId: 'guru_1',
      tanggalObservasi: '2026-11-04',
      mapelMateri: 'Fikih / Hukum Jual Beli Salam & Muamalah Modern',
      catatanList: [
        {
          id: 'ev_1',
          waktu: '08:02',
          faktaPeristiwa: 'Guru membuka kelas dengan salam, menanyakan kabar, dan meminta ketua kelas memimpin doa. Guru menayangkan video berdurasi 90 detik tentang transaksi COD paket online yang dibatalkan sepihak.',
          guruBicara: true,
          siswaAktif: false,
          jumlahSiswaTerlibat: 32
        },
        {
          id: 'ev_2',
          waktu: '08:08',
          faktaPeristiwa: 'Guru bertanya: "Siapa di sini yang pernah beli barang online tapi barangnya beda dengan foto? Bagaimana hukumnya dalam Islam?". Tiga siswa (Faris, Naila, Dimas) mengacungkan tangan dan bergiliran menceritakan pengalamannya.',
          guruBicara: false,
          siswaAktif: true,
          jumlahSiswaTerlibat: 15
        },
        {
          id: 'ev_3',
          waktu: '08:16',
          faktaPeristiwa: 'Guru membagi siswa ke dalam 6 kelompok majelis fikih (masing-masing 5-6 anak) dan membagikan kartu studi kasus transaksi jual beli. Kelompok A & B mendapat teks fikih klasik ringkas, kelompok C & D infografis, kelompok E & F artikel berita.',
          guruBicara: true,
          siswaAktif: true,
          jumlahSiswaTerlibat: 32
        },
        {
          id: 'ev_4',
          waktu: '08:25',
          faktaPeristiwa: 'Siswa berdiskusi intensif menentukan rukun dan syarat jual beli yang dilanggar pada kasus masing-masing. Guru berkeliling ke meja kelompok 3 yang tampak kebingungan, memberi pertanyaan pancingan: "Apa yang disepakati pembeli dan penjual saat akad?".',
          guruBicara: false,
          siswaAktif: true,
          jumlahSiswaTerlibat: 30
        },
        {
          id: 'ev_5',
          waktu: '08:39',
          faktaPeristiwa: 'Dua kelompok mempresentasikan hasil telaah kasus di depan kelas. Anggota kelompok lain mengajukan sanggahan dan pertanyaan terkait khiyar cacat.',
          guruBicara: false,
          siswaAktif: true,
          jumlahSiswaTerlibat: 28
        },
        {
          id: 'ev_6',
          waktu: '08:52',
          faktaPeristiwa: 'Guru membagikan tiket keluar (exit ticket) selembar memo warna-warni: "Tuliskan 1 hal yang haram dilakukan saat berjualan online dan 1 pertanyaan yang masih membuatmu penasaran."',
          guruBicara: true,
          siswaAktif: true,
          jumlahSiswaTerlibat: 32
        }
      ],
      totalMenitGuruBicara: 28,
      totalMenitSiswaAktif: 52,
      perkiraanSiswaTerlibat: 94,
      suasanaKelas: 'Dinamis, tertib, santun, siswa berani berpendapat tanpa takut salah.',
      status: 'selesai'
    }
  };

  // Instrumen 6 Observasi Terstruktur
  const instrument6: Record<string, any> = {
    guru_1: {
      guruId: 'guru_1',
      tanggalObservasi: '2026-11-04',
      rubrik: DEFAULT_RUBRIK_6_CIRI.map((ciri, i) => ({
        ...ciri,
        skor: [4, 3, 3, 4, 4, 3][i],
        rujukanCatatanWaktu: [
          '08:02, 08:08 (Analisis kasus nyata video COD)',
          '08:16 (Penggunaan media infografis dan teks variatif)',
          '08:16, 08:25 (Diferensiasi bahan kasus & bimbingan kelompok 3)',
          '08:25, 08:39 (Siswa aktif berdialog proporsi aktif 52 menit vs guru bicara 28 menit)',
          '08:52 (Pemberian exit ticket 1 hal haram & 1 penasaran)',
          '08:25, 08:52 (Asesmen proses diskusi dan tiket keluar formatif)'
        ][i],
        catatanSupervisor: [
          'Pengaitan hukum fikih dengan realitas belanja online santri sangat relevan.',
          'Media kontekstual berjalan baik, ke depan bisa ditambah simulasi peran akad.',
          'Diferensiasi proses terlihat nyata saat guru mendampingi kelompok yang membutuhkan.',
          'Dominasi berbicara siswa sangat baik, iklim berdialog santun terwujud.',
          'Alokasi waktu refleksi dipatuhi dengan baik melalui memo tiket keluar.',
          'Umpan balik lisan diberikan tepat waktu saat guru berkeliling meja.'
        ][i]
      })),
      skorTotal: 21, // Maks 24
      status: 'selesai',
      catatanRangkuman: 'Pembelajaran bermakna dan berpusat pada siswa terwujud dengan sangat baik. Skor 21/24 (Kategori Sangat Baik).'
    }
  };

  // Instrumen 7 AI Analisis
  const instrument7: Record<string, any> = {
    guru_1: {
      guruId: 'guru_1',
      anonymizedPrompt: `Anda adalah asisten supervisor akademik madrasah. Berikut adalah catatan evidence obyektif dari observasi KBM:
- 08:02 Guru menayangkan video 90 detik tentang pembatalan transaksi COD.
- 08:08 Guru menanyakan pengalaman siswa terkait barang beda spesifikasi; 3 siswa bergantian berpendapat.
- 08:16 Siswa dibagi 6 kelompok dengan bahan diferensiasi (klasik, infografis, berita).
- 08:25 Siswa diskusi rukun syarat akad; guru mendampingi kelompok yang kesulitan dengan pertanyaan pemantik.
- 08:39 Presentasi 2 kelompok dan tanya jawab sanggahan antar-siswa.
- 08:52 Penulisan exit ticket refleksi mandiri di akhir sesi.
Proporsi waktu: Guru bicara 28 menit (35%), Siswa aktif 52 menit (65%). Siswa terlibat: 94%.

Tolong kelompokkan ke dalam 6 ciri pembelajaran, identifikasi 3 pola menonjol, dan susun 5 pertanyaan reflektif untuk dialog coaching.`,
      hasilAnalisis: `HASIL ANALISIS CATATAN OBSERVASI (BERBANTUAN AI):

1. PENGELOMPOKKAN 6 CIRI PEMBELAJARAN:
- Bermakna: Sangat kuat (mengangkat isu COD online yang dialami remaja madrasah).
- Inovatif: Baik (perpaduan studi kasus multimodal: video, infografis, teks).
- Berdiferensiasi: Cukup baik (bahan bacaan bervariasi, scaffolding bertingkat pada kelompok 3).
- Berpusat pada Siswa: Sangat kuat (siswa aktif 65% waktu, dialog antar-teman hidup).
- Reflektif: Terstruktur (penggunaan exit ticket tertulis di penutup).
- Asesmen Autentik: Baik (observasi unjuk kerja dan tiket pemahaman).

2. TIGA POLA MENONJOL (PATTERNS):
a. Proporsi bicara siswa tinggi (65%), menandakan kepercayaan psikologis di kelas terbangun.
b. Scaffolding guru berupa pertanyaan pemantik, bukan langsung memberikan jawaban final.
c. Variasi produk akhir belum terlihat (semua kelompok mempresentasikan format lisan yang sama).

3. LIMA PERTANYAAN REFLEKTIF UNTUK PERCAKAPAN COACHING:
1) "Bagaimana perasaan Ibu setelah melihat antusiasme anak-anak mendebat kasus COD tadi?"
2) "Apa yang Ibu amati saat mendampingi meja kelompok 3 yang awalnya tampak ragu?"
3) "Bagaimana respon anak-anak terhadap perbedaan bahan ajar infografis vs teks klasik?"
4) "Jika diberi kesempatan mengulang sesi ini, bagian mana yang ingin Ibu beri ruang eksplorasi lebih luas bagi siswa?"
5) "Dukungan apa dari madrasah yang Ibu perlukan agar model KBM seperti ini dapat terus berkelanjutan?"`,
      sudahDiverifikasi: true,
      tanggalAnalisis: '2026-11-05',
      status: 'selesai'
    }
  };

  // Instrumen 8 GROW
  const instrument8: Record<string, any> = {
    guru_1: {
      guruId: 'guru_1',
      tanggalCoaching: '2026-11-06',
      goal: {
        tujuan: 'Mengoptimalkan diferensiasi produk tugas dan memastikan semua anggota kelompok terlibat setara.',
        pertanyaanPemantik: 'Dari sesi pembelajaran fikih muamalah kemarin, apa yang ingin Ibu tingkatkan dalam pertemuan mendatang?',
        jawabanGuru: 'Saya ingin anak-anak tidak hanya presentasi lisan, tapi bisa membuat produk kreatif seperti poster digital atau podcast mini adab jual beli sesuai minat mereka, dan memastikan siswa pendiam juga punya peran aktif.'
      },
      reality: {
        faktaObservasi: 'Siswa aktif 65% waktu, namun saat presentasi hanya 2 dari 5 anggota kelompok yang berbicara aktif.',
        pertanyaanPemantik: 'Berdasarkan data observasi, apa yang Ibu perhatikan mengenai pembagian peran di dalam kelompok?',
        jawabanGuru: 'Betul, siswa yang vokal cenderung mendominasi panggung. Kelompok belum membagi peran tegas seperti pencatat, presenter, dan penanggap.'
      },
      options: {
        pilihanStrategi: 'Menerapkan teknik peran bergilir (role-card) dan memberikan opsi pilihan produk laporan (infografis Canva / rekaman suara / komik fikih).',
        pertanyaanPemantik: 'Ide atau strategi apa yang terlintas untuk mengatasi dominasi siswa tertentu dan memberi ruang bagi minat berbeda?',
        jawabanGuru: 'Saya bisa membuat kartu peran di setiap meja kelompok, serta menyediakan rubrik pilihan produk tugas akhir.'
      },
      will: {
        langkahNyata: 'Mulai menyusun kartu peran kelompok dan rubrik diferensiasi produk untuk pertemuan bab Khiyar pekan depan.',
        pertanyaanPemantik: 'Kapan komitmen ini akan mulai diujicobakan dan apa indikator keberhasilannya?',
        jawabanGuru: 'Mulai Senin pekan depan di kelas VIII-A. Indikatornya 100% siswa memegang peran nyata dalam kelompok dan menghasilkan karya sesuai minatnya.'
      },
      timerMinutes: 45,
      status: 'selesai'
    }
  };

  // Instrumen 9 Catatan Coaching
  const instrument9: Record<string, any> = {
    guru_1: {
      guruId: 'guru_1',
      tanggalCoaching: '2026-11-06',
      tindakan: 'Menerapkan kartu peran kelompok (role-card) dan pilihan diferensiasi produk (infografis Canva atau komik fikih mini) pada materi Khiyar.',
      kelas: 'Kelas VIII-A',
      tanggalMulai: '2026-11-16',
      ukuranKeberhasilan: 'Seluruh siswa (100%) memiliki peran terdokumentasi dalam kelompok dan menghasilkan produk kreatif dengan skor rubrik minimal 80.',
      catatanDukungan: 'Madrasah menyediakan akses chromebook/lab komputer untuk pembuatan infografis saat jam KBM.',
      tandaTanganGuru: {
        nama: 'Ustadzah Siti Aminah, S.Pd.I',
        tanggal: '2026-11-06',
        disetujui: true
      },
      tandaTanganSaksi: {
        nama: 'Dr. H. Ahmad Dahlan, M.Pd (Kepala Madrasah)',
        peran: 'Kepala Madrasah & Supervisor',
        tanggal: '2026-11-06',
        disetujui: true
      },
      status: 'selesai'
    }
  };

  // Instrumen 10 RTL Madrasah
  const instrument10: AppState['instrument10'] = {
    tahunPelajaran: '2026/2027',
    items: [
      {
        id: 'rtl_1',
        guruId: 'guru_1',
        guruNama: 'Ustadzah Siti Aminah, S.Pd.I',
        kategori: 'Fasilitas & Media',
        komitmenAsal: 'Menerapkan kartu peran kelompok dan pilihan diferensiasi produk tugas digital Canva/komik.',
        bentukDukungan: 'Penjadwalan prioritas penggunaan Lab Komputer Madrasah dan akun Canva for Education untuk guru & siswa.',
        penanggungJawab: 'Kepala Lab Komputer & Waka Sarpras',
        waktuPelaksanaan: '16 Nov – 15 Des 2026',
        buktiKeberhasilan: 'Portofolio digital siswa tersimpan di Google Drive madrasah dan pameran karya kelas.',
        status: 'Berjalan'
      },
      {
        id: 'rtl_2',
        guruId: 'guru_2',
        guruNama: 'Pak Ahmad Fauzi, M.Pd',
        kategori: 'Pelatihan',
        komitmenAsal: 'Mengurangi ceramah dan meningkatkan keterampilan bertanya produktif berlevel HOTS.',
        bentukDukungan: 'Mengikutsertakan guru dalam Workshop Kemitraan Pedagogi Konstruktivistik Matematika di MGMP Kemenag.',
        penanggungJawab: 'Waka Bidang Kurikulum',
        waktuPelaksanaan: '25 Nov – 10 Des 2026',
        buktiKeberhasilan: 'Sertifikat workshop dan modul ajar matematika berbasis inkuiri tersusun.',
        status: 'Berjalan'
      },
      {
        id: 'rtl_3',
        guruId: 'guru_3',
        guruNama: 'Bu Nurul Hidayah, S.Si',
        kategori: 'Fasilitas & Media',
        komitmenAsal: 'Melakukan praktikum inkuiri sederhana secara rutin setiap pokok bahasan IPA.',
        bentukDukungan: 'Pengadaan bahan habis pakai praktikum sains mikroskop dan kit fotosintesis madrasah.',
        penanggungJawab: 'Kepala Laboratorium IPA',
        waktuPelaksanaan: 'Januari 2027',
        buktiKeberhasilan: 'Logbook praktikum siswa dan laporan eksperimen mandiri.',
        status: 'Direncanakan'
      },
      {
        id: 'rtl_4',
        guruId: 'guru_4',
        guruNama: 'Pak Muhammad Rizky, S.Pd',
        kategori: 'MGMP & Rekan Sejawat',
        komitmenAsal: 'Mengembangkan media game interaktif kosa kata muhadatsah bahasa Arab.',
        bentukDukungan: 'Sesi peer-coaching bersama guru informatika untuk pembuatan game Quizizz / Wordwall bahasa Arab.',
        penanggungJawab: 'Ketua Rumpun Bahasa & Guru TIK',
        waktuPelaksanaan: 'Desember 2026',
        buktiKeberhasilan: 'Tersedianya 5 set media interaktif kosa kata daring.',
        status: 'Berjalan'
      },
      {
        id: 'rtl_5',
        guruId: 'guru_5',
        guruNama: 'Bu Dewi Sartika, M.Pd',
        kategori: 'Kebijakan Madrasah',
        komitmenAsal: 'Menerapkan peer-assessment asesmen autentik penulisan teks deskripsi antarsiswa.',
        bentukDukungan: 'Penerbitan buku antologi tulisan deskripsi santri madrasah ber-ISBN sebagai wadah publikasi.',
        penanggungJawab: 'Tim Literasi Madrasah',
        waktuPelaksanaan: 'Januari – Februari 2027',
        buktiKeberhasilan: 'Buku antologi karya siswa terbit dan dibagikan saat milad madrasah.',
        status: 'Direncanakan'
      }
    ],
    status: 'sedang'
  };

  // Instrumen 11 Monitoring RTL
  const instrument11: Record<string, any> = {
    guru_1: {
      guruId: 'guru_1',
      kunjunganList: [
        {
          id: 'kj_1',
          tanggal: '2027-01-18',
          durasiMenit: 15,
          fokusDiamati: 'Penggunaan kartu peran kelompok saat diskusi fikih mawaris.',
          umpanBalikSingkat: 'Bagus sekali! Semua siswa di kelompok 2 terlihat fokus menjalankan perannya masing-masing.',
          tindakLanjutTambahan: 'Lanjutkan pembiasaan rotasi peran presenter di minggu depan.'
        }
        // Note: Currently 1 visit for guru_1 to intentionally demonstrate the "Kunjungan < 2" warning alert!
      ],
      status: 'sedang'
    },
    guru_2: {
      guruId: 'guru_2',
      kunjunganList: [
        {
          id: 'kj_2_1',
          tanggal: '2027-01-15',
          durasiMenit: 12,
          fokusDiamati: 'Variasi pertanyaan pembuka sebelum materi phytagoras.',
          umpanBalikSingkat: 'Pertanyaan pemantik berhasil memancing respon rasa ingin tahu siswa.',
          tindakLanjutTambahan: 'Beri waktu tunggu (wait-time) 5 detik setelah bertanya sebelum menunjuk siswa.'
        },
        {
          id: 'kj_2_2',
          tanggal: '2027-02-05',
          durasiMenit: 15,
          fokusDiamati: 'Aktivitas eksplorasi mandiri siswa dengan media puzzle luas bidang.',
          umpanBalikSingkat: 'Porsi ceramah guru terpantau turun drastis, siswa antusias merangkai puzzle.',
          tindakLanjutTambahan: 'Siapkan soal tantangan ekstra untuk siswa yang selesai lebih cepat.'
        }
      ],
      status: 'selesai'
    }
  };

  // Instrumen 12 Jurnal Refleksi Guru
  const instrument12: Record<string, any> = {
    guru_1: {
      guruId: 'guru_1',
      entries: [
        {
          id: 'jrn_1_1',
          tanggalKirim: '2027-01-22',
          mingguKe: 'Minggu ke-3 Januari',
          q1_keberhasilan: 'Penerapan kartu peran kelompok di kelas VIII-A berhasil membuat siswa yang biasanya pendiam kini berani mencatat hasil diskusi dan menyampaikan rangkuman.',
          q2_tantangan: 'Waktu KBM terasa cepat sekali, beberapa kelompok belum sempat menyelesaikan desain Canva mereka di lab.',
          q3_solusi: 'Saya memperbolehkan penyelesaian dilanjutkan saat jam literasi mandiri di perpustakaan madrasah.',
          q4_rencanaBerikut: 'Akan mencoba pameran galeri berjalan (gallery walk) agar antar-kelompok saling memberi bintang apresiasi.',
          balasanKamad: 'Alhamdulillah, langkah Ibu Siti sangat menginspirasi! Ide pameran galeri berjalan sangat kami dukung, madrasah akan menyiapkan papan pameran khusus di koridor kelas.',
          tanggalBalasan: '2027-01-24',
          statusBalasan: 'dibalas'
        },
        {
          id: 'jrn_1_2',
          tanggalKirim: '2027-02-06',
          mingguKe: 'Minggu ke-1 Februari',
          q1_keberhasilan: 'Gallery walk terlaksana meriah, setiap siswa memberikan stiker catatan bintang kepada karya teman.',
          q2_tantangan: 'Masih ada 2 siswa yang kurang teliti saat membaca rubrik penilaian kawan sejawat.',
          q3_solusi: 'Memberikan contoh pemodelan telaah bersama sebelum penilaian dimulai.',
          q4_rencanaBerikut: 'Menyiapkan modul ajar untuk supervisi ulang siklus Maret.',
          balasanKamad: '', // Pending reply to trigger the alert mechanism!
          statusBalasan: 'menunggu'
        }
      ],
      status: 'sedang'
    }
  };

  // Instrumen 13 Supervisi Ulang
  const instrument13: Record<string, any> = {
    guru_1: {
      guruId: 'guru_1',
      tanggalSupervisiUlang: '2027-03-08',
      evidence: {
        guruId: 'guru_1',
        tanggalObservasi: '2027-03-08',
        mapelMateri: 'Fikih / Riba & Praktik Keuangan Syariah Kontemporer',
        catatanList: [
          {
            id: 'ev_u_1',
            waktu: '08:00',
            faktaPeristiwa: 'Guru membuka kelas dengan kuis interaktif apersepsi menggunakan polling cepat.',
            guruBicara: true,
            siswaAktif: true,
            jumlahSiswaTerlibat: 32
          },
          {
            id: 'ev_u_2',
            waktu: '08:12',
            faktaPeristiwa: 'Siswa langsung duduk di pos peran masing-masing, kartu peran berfungsi efektif.',
            guruBicara: false,
            siswaAktif: true,
            jumlahSiswaTerlibat: 32
          },
          {
            id: 'ev_u_3',
            waktu: '08:30',
            faktaPeristiwa: 'Dua siswa yang sebelumnya pasif tampil percaya diri mempresentasikan komik fikih karyanya.',
            guruBicara: false,
            siswaAktif: true,
            jumlahSiswaTerlibat: 31
          },
          {
            id: 'ev_u_4',
            waktu: '08:48',
            faktaPeristiwa: 'Siswa melakukan asesmen sejawat dengan rubrik checklist dan refleksi terarah.',
            guruBicara: false,
            siswaAktif: true,
            jumlahSiswaTerlibat: 32
          }
        ],
        totalMenitGuruBicara: 18,
        totalMenitSiswaAktif: 62,
        perkiraanSiswaTerlibat: 98,
        suasanaKelas: 'Sangat hidup, kolaboratif, mandiri dan penuh percaya diri.',
        status: 'selesai'
      },
      observasiTerstruktur: {
        guruId: 'guru_1',
        tanggalObservasi: '2027-03-08',
        rubrik: DEFAULT_RUBRIK_6_CIRI.map((ciri, i) => ({
          ...ciri,
          skor: [4, 4, 4, 4, 4, 4][i],
          rujukanCatatanWaktu: '08:12, 08:30, 08:48',
          catatanSupervisor: 'Peningkatan signifikan terlihat di seluruh aspek. Pembelajaran sangat matang dan berdampak.'
        })),
        skorTotal: 24, // Naik dari 21 ke 24 (+3 poin) -> Berkembang!
        status: 'selesai',
        catatanRangkuman: 'Luar biasa! Skor sempurna 24/24. Kategori: Berkembang Pesat.'
      },
      status: 'selesai'
    }
  };

  // Instrumen 14 Rekap Perkembangan
  const instrument14: AppState['instrument14'] = {
    rekapList: [
      {
        guruId: 'guru_1',
        namaGuru: 'Ustadzah Siti Aminah, S.Pd.I',
        skorAwal: 21,
        skorUlang: 24,
        selisih: 3,
        kategori: 'Berkembang', // naik >= 3 poin
        ciriPalingBerkembang: 'Pembelajaran Berdiferensiasi & Berpusat pada Siswa (Produk beragam & peran aktif merata)',
        buktiKonkret: 'Penerapan kartu peran berhasil mengaktifkan 100% siswa; portofolio komik fikih mini terlaksana dengan rubrik autentik.',
        fokusSiklusBerikut: 'Menjadi guru pengimbas/model madrasah untuk penyusunan modul diferensiasi bagi guru rumpun PAI.'
      },
      {
        guruId: 'guru_2',
        namaGuru: 'Pak Ahmad Fauzi, M.Pd',
        skorAwal: 17,
        skorUlang: 21,
        selisih: 4,
        kategori: 'Berkembang',
        ciriPalingBerkembang: 'Berpusat pada Siswa & Inovatif (Penurunan drastis waktu ceramah)',
        buktiKonkret: 'Proporsi bicara siswa melonjak dari 30% menjadi 65%; KBM berbasis manipulatif puzzle aljabar berjalan efektif.',
        fokusSiklusBerikut: 'Mengintegrasikan asesmen diagnostik berkala untuk pemetaan kelompok kesiapan belajar.'
      },
      {
        guruId: 'guru_3',
        namaGuru: 'Bu Nurul Hidayah, S.Si',
        skorAwal: 19,
        skorUlang: 21,
        selisih: 2,
        kategori: 'Stabil', // perubahan < 3
        ciriPalingBerkembang: 'Reflektif & Asesmen Autentik',
        buktiKonkret: 'Logbook praktikum siswa rutin terisi dan jurnal refleksi mingguan konsisten dibahas.',
        fokusSiklusBerikut: 'Mendorong diferensiasi proses eksperimen berdasarkan kecepatan kerja siswa.'
      },
      {
        guruId: 'guru_4',
        namaGuru: 'Pak Muhammad Rizky, S.Pd',
        skorAwal: 16,
        skorUlang: 20,
        selisih: 4,
        kategori: 'Berkembang',
        ciriPalingBerkembang: 'Inovatif & Bermakna (Media game interaktif)',
        buktiKonkret: 'Siswa aktif berdialog bahasa Arab menggunakan media kartu kosa kata kontekstual.',
        fokusSiklusBerikut: 'Meningkatkan penulisan kalimat mandiri (insya muwajjah).'
      },
      {
        guruId: 'guru_5',
        namaGuru: 'Bu Dewi Sartika, M.Pd',
        skorAwal: 18,
        skorUlang: 20,
        selisih: 2,
        kategori: 'Stabil',
        ciriPalingBerkembang: 'Asesmen Autentik & Iklim Kelas Positif',
        buktiKonkret: 'Penerbitan buku antologi tulisan siswa terlaksana dengan rubrik koreksi sejawat yang jelas.',
        fokusSiklusBerikut: 'Pemanfaatan media audio visual podcast sastra remaja.'
      }
    ],
    status: 'selesai'
  };

  // Instrumen 15 Evaluasi Makro
  const instrument15: AppState['instrument15'] = {
    dimensiList: [
      {
        id: 'dim_1',
        namaDimensi: '1. Hasil & Dampak Pembelajaran',
        nilaiSkala: 4,
        temuanUtama: 'Rata-rata keterlibatan aktif siswa madrasah naik dari 50% menjadi 78%; suasana kelas lebih partisipatif dan bermakna.',
        tindakLanjutSiklusDepan: 'Memperluas praktik baik diferensiasi ke seluruh tingkatan kelas VII-IX.'
      },
      {
        id: 'dim_2',
        namaDimensi: '2. Keterlibatan & Karakter Siswa (Profil Pelajar Rahmatan lil Alamin)',
        nilaiSkala: 5,
        temuanUtama: 'Iklim saling menghargai pendapat saat kerja kelompok meningkat signifikan, adab islami terjaga.',
        tindakLanjutSiklusDepan: 'Membuat jurnal pembiasaan karakter terintegrasi pada lembar kerja siswa.'
      },
      {
        id: 'dim_3',
        namaDimensi: '3. Proses Pelaksanaan Supervisi',
        nilaiSkala: 4,
        temuanUtama: 'Kemitraan profesional terjalin baik, stigma supervisi sebagai "inspeksi menakutkan" berhasil dihilangkan.',
        tindakLanjutSiklusDepan: 'Menjaga ketepatan jadwal temu coaching agar tidak bergeser dari batas 7 hari.'
      },
      {
        id: 'dim_4',
        namaDimensi: '4. Kualitas Coaching & Hubungan Kolegial',
        nilaiSkala: 4,
        temuanUtama: 'Alur GROW sangat membantu guru menemukan solusi dari dalam dirinya sendiri tanpa merasa digurui.',
        tindakLanjutSiklusDepan: 'Menyelenggarakan penyegaran teknik active listening bagi seluruh tim supervisor.'
      },
      {
        id: 'dim_5',
        namaDimensi: '5. Beban Administrasi Guru',
        nilaiSkala: 4,
        temuanUtama: 'Aplikasi digital SupervisiKu memangkas pengetikan manual dan mempercepat akses data bukti supervisi.',
        tindakLanjutSiklusDepan: 'Menyederhanakan lembar telaah perencanaan agar lebih ringkas.'
      },
      {
        id: 'dim_6',
        namaDimensi: '6. Keberlanjutan & Budaya Refleksi Madrasah',
        nilaiSkala: 5,
        temuanUtama: 'Jurnal refleksi berkala mulai menjadi kebiasaan profesional yang dirasakan manfaatnya oleh dewan guru.',
        tindakLanjutSiklusDepan: 'Membentuk komunitas praktisi madrasah (KomBel) mingguan berbasis rumpun mapel.'
      }
    ],
    daftarInstrumenDisederhanakan: [
      'Instrumen 3 (Telaah Perencanaan): Disatukan dengan checklist ringkas modul ajar agar telaah selesai dalam 15 menit.',
      'Instrumen 4 (Pra-Observasi): Bagian format persetujuan diintegrasikan langsung dalam aplikasi digital.',
      'Instrumen 12 (Jurnal Refleksi Guru): Disederhanakan menjadi 3 pertanyaan cepat melalui aplikasi seluler.'
    ],
    rekomendasiUmum: 'Siklus supervisi tahun 2026/2027 sukses membangun kultur belajar kolegial yang aman secara psikologis. Madrasah siap melanjutkan siklus tahun berikutnya dengan fokus pada penguatan pembelajaran berbasis proyek (P5-PPRA).',
    status: 'selesai'
  };

  // Program Supervisi Akademik (Instrumen 1)
  const instrument1: AppState['instrument1'] = {
    tahunPelajaran: '2026/2027',
    semester: 'Ganjil & Genap',
    madrasahName: 'MTs Negeri 1 Teladan',
    tujuan: 'Meningkatkan mutu proses pembelajaran yang bermakna, berdiferensiasi, dan berpusat pada siswa melalui pendampingan kolegial berbasis dialog reflektif yang memberdayakan guru.',
    sasaran: 'Seluruh guru mata pelajaran (32 guru) jenjang Kelas VII, VIII, dan IX MTs Negeri 1 Teladan.',
    fokusSiklusCiri: {
      bermakna: true,
      inovatif: true,
      berdiferensiasi: true,
      berpusatSiswa: true,
      reflektif: true,
      asesmenAutentik: true
    },
    catatanFokus: 'Fokus prioritas siklus 2026/2027 diarahkan pada peningkatan pembelajaran berdiferensiasi dan student-centered learning agar proporsi aktif siswa melebihi 60% waktu KBM.',
    timSupervisor: [
      { id: 'sup_1', nama: 'Dr. H. Ahmad Dahlan, M.Pd', jabatan: 'Kepala Madrasah (Ketua Tim)', jumlahGuruBinaan: 16 },
      { id: 'sup_2', nama: 'Dra. Hj. Maryam, M.Pd', jabatan: 'Waka Kurikulum (Sekretaris Tim)', jumlahGuruBinaan: 10 },
      { id: 'sup_3', nama: 'H. Suherman, M.Si', jabatan: 'Guru Senior / Koordinator Penjaminan Mutu', jumlahGuruBinaan: 6 }
    ],
    indikatorKeberhasilan: [
      '100% guru tersupervisi lengkap dari Tahap 1 hingga Tahap 6 sesuai kalender.',
      'Minimal 80% guru mengalami peningkatan skor observasi pada supervisi ulang Maret 2027.',
      'Terwujudnya iklim kelas di mana proporsi aktif siswa rata-rata di atas 60% waktu pelajaran.',
      'Setiap guru memiliki minimal 1 komitmen tindak lanjut yang terfasilitasi oleh RTL Madrasah.',
      'Kultur saling merefleksikan proses KBM berjalan rutin melalui jurnal refleksi dua mingguan.'
    ],
    status: 'selesai',
    terakhirDiperbarui: '2026-10-04'
  };

  const settings: AppState['settings'] = {
    madrasahName: 'MTs Negeri 1 Teladan',
    madrasahNsmNpsn: 'NSM: 121232010001 / NPSN: 20278910',
    kamadName: 'Dr. H. Ahmad Dahlan, M.Pd',
    kamadNip: '197608142003121002',
    tahunPelajaran: '2026/2027',
    semester: 'Ganjil - Genap',
    supervisors: [
      { id: 'sup_1', nama: 'Dr. H. Ahmad Dahlan, M.Pd', nip: '197608142003121002', jabatan: 'Kepala Madrasah' },
      { id: 'sup_2', nama: 'Dra. Hj. Maryam, M.Pd', nip: '197805122005012006', jabatan: 'Wakil Kepala Bidang Kurikulum' },
      { id: 'sup_3', nama: 'H. Suherman, M.Si', nip: '197203101998031003', jabatan: 'Koordinator Penjaminan Mutu' }
    ],
    tahapDates: {
      tahap1: { start: '2026-10-01', end: '2026-10-14', nama: 'Tahap 1: Persiapan' },
      tahap2: { start: '2026-10-15', end: '2026-10-31', nama: 'Tahap 2: Pra-Pelaksanaan' },
      tahap3: { start: '2026-11-02', end: '2026-12-04', nama: 'Tahap 3: Observasi' },
      tahap4: { start: '2026-11-09', end: '2026-12-11', nama: 'Tahap 4: Refleksi & Coaching' },
      tahap5: { start: '2027-01-04', end: '2027-02-26', nama: 'Tahap 5: Tindak Lanjut' },
      tahap6: { start: '2027-03-01', end: '2027-03-31', nama: 'Tahap 6: Siklus Lanjutan' }
    }
  };

  return {
    settings,
    gurus,
    jadwals,
    instrument1,
    instrument3,
    instrument4,
    instrument5,
    instrument6,
    instrument7,
    instrument8,
    instrument9,
    instrument10,
    instrument11,
    instrument12,
    instrument13,
    instrument14,
    instrument15,
    ceklisTahap: INITIAL_CEKLIS_TAHAP,
    ceklisPendampingan,
    jurnalSabtu: INITIAL_JURNAL_SABTU
  };
}

export function getEmptyAppState(): AppState {
  const initial = getInitialAppState();
  return {
    ...initial,
    gurus: [],
    jadwals: {},
    instrument3: {},
    instrument4: {},
    instrument5: {},
    instrument6: {},
    instrument7: {},
    instrument8: {},
    instrument9: {},
    instrument10: {
      tahunPelajaran: initial.settings.tahunPelajaran,
      items: [],
      status: 'belum'
    },
    instrument11: {},
    instrument12: {},
    instrument13: {},
    instrument14: {
      rekapList: [],
      status: 'belum'
    },
    ceklisPendampingan: {},
    jurnalSabtu: []
  };
}
