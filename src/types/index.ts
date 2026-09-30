export interface Guru {
  id: string;
  nama: string;
  nip: string;
  mapel: string;
  kelas: string;
  fokusPengembangan: string;
  supervisorId: string;
  supervisorNama: string;
  foto?: string;
}

export interface JadwalGuru {
  tanggalTelaah: string; // YYYY-MM-DD
  tanggalObservasi: string;
  tanggalCoaching: string;
  tanggalSupervisiUlang: string;
  waktuObservasi?: string; // e.g. "08:00 - 09:20"
}

export type StatusInstrumen = 'belum' | 'sedang' | 'selesai';

// Instrumen 1: Program Supervisi Akademik (Tingkat Madrasah)
export interface Instrument1_Program {
  tahunPelajaran: string;
  semester: string;
  madrasahName: string;
  tujuan: string;
  sasaran: string;
  fokusSiklusCiri: {
    bermakna: boolean;
    inovatif: boolean;
    berdiferensiasi: boolean;
    berpusatSiswa: boolean;
    reflektif: boolean;
    asesmenAutentik: boolean;
  };
  catatanFokus: string;
  timSupervisor: Array<{ id: string; nama: string; jabatan: string; jumlahGuruBinaan: number }>;
  indikatorKeberhasilan: string[];
  status: StatusInstrumen;
  terakhirDiperbarui: string;
}

// Instrumen 3: Telaah Perencanaan
export interface AspekTelaah {
  id: string;
  nama: string;
  skor: number; // 1-4
  catatan: string;
}

export interface Instrument3_Telaah {
  guruId: string;
  tanggalTelaah: string;
  aspek: AspekTelaah[];
  penguatan: string[]; // max 3
  saran: string[]; // max 2
  status: StatusInstrumen;
  catatanUmum?: string;
}

// Instrumen 4: Pra-Observasi
export interface Instrument4_PraObservasi {
  guruId: string;
  tanggal: string;
  fokusObservasiDisepakati: string[];
  posisiDudukSupervisor: string; // e.g. "Di sudut belakang kanan kelas sejajar pandangan siswa"
  caraPerkenalan: string; // e.g. "Hadir senyap sebagai pengamat tanpa interupsi pembelajaran"
  catatanKesiapanGuru: string;
  tandaTanganGuru: {
    nama: string;
    tanggal: string;
    disetujui: boolean;
  };
  tandaTanganSupervisor: {
    nama: string;
    tanggal: string;
    disetujui: boolean;
  };
  status: StatusInstrumen;
}

// Instrumen 5: Lembar Evidence Obyektif
export interface CatatanEvidence {
  id: string;
  waktu: string; // "08:15"
  faktaPeristiwa: string; // what actually happened (objective)
  guruBicara: boolean; // teacher talk
  siswaAktif: boolean; // student active
  jumlahSiswaTerlibat: number; // count
}

export interface Instrument5_Evidence {
  guruId: string;
  tanggalObservasi: string;
  mapelMateri: string;
  catatanList: CatatanEvidence[];
  totalMenitGuruBicara: number;
  totalMenitSiswaAktif: number;
  perkiraanSiswaTerlibat: number; // percentage or count
  suasanaKelas: string;
  status: StatusInstrumen;
}

// Instrumen 6: Lembar Observasi Terstruktur
export interface RubrikCiri {
  id: string;
  namaCiri: string;
  deskripsi: string;
  skor: number; // 1-4
  deskriptorLevel: {
    1: string;
    2: string;
    3: string;
    4: string;
  };
  rujukanCatatanWaktu: string; // e.g. "08:15, 08:32" (wajib ada minimal 1 rujukan dari instrumen 5)
  catatanSupervisor: string;
}

export interface Instrument6_ObservasiTerstruktur {
  guruId: string;
  tanggalObservasi: string;
  rubrik: RubrikCiri[];
  skorTotal: number; // Max 24
  status: StatusInstrumen;
  catatanRangkuman: string;
}

// Instrumen 7: Analisis Berbantuan AI
export interface Instrument7_AIAnalisis {
  guruId: string;
  anonymizedPrompt: string;
  hasilAnalisis: string;
  sudahDiverifikasi: boolean; // Kotak centang "Sudah diverifikasi terhadap catatan asli"
  tanggalAnalisis: string;
  status: StatusInstrumen;
}

// Instrumen 8: Panduan GROW
export interface Instrument8_GROW {
  guruId: string;
  tanggalCoaching: string;
  goal: {
    tujuan: string;
    pertanyaanPemantik: string;
    jawabanGuru: string;
  };
  reality: {
    faktaObservasi: string;
    pertanyaanPemantik: string;
    jawabanGuru: string;
  };
  options: {
    pilihanStrategi: string;
    pertanyaanPemantik: string;
    jawabanGuru: string;
  };
  will: {
    langkahNyata: string;
    pertanyaanPemantik: string;
    jawabanGuru: string;
  };
  timerMinutes: number; // 45
  status: StatusInstrumen;
}

// Instrumen 9: Catatan Sesi Coaching
export interface Instrument9_CatatanCoaching {
  guruId: string;
  tanggalCoaching: string;
  // 4 unsur validasi komitmen guru
  tindakan: string; // Apa yang akan dilakukan
  kelas: string; // Di kelas mana
  tanggalMulai: string; // Kapan mulai
  ukuranKeberhasilan: string; // Bagaimana mengukurnya
  catatanDukungan: string;
  tandaTanganGuru: {
    nama: string;
    tanggal: string;
    disetujui: boolean;
  };
  tandaTanganSaksi: {
    nama: string;
    peran: string; // e.g. "Kepala Madrasah / Supervisor"
    tanggal: string;
    disetujui: boolean;
  };
  status: StatusInstrumen;
}

// Instrumen 10: RTL Madrasah (Tingkat Madrasah)
export interface ItemRTL {
  id: string;
  guruId: string;
  guruNama: string;
  kategori: 'Pelatihan' | 'Fasilitas & Media' | 'MGMP & Rekan Sejawat' | 'Kebijakan Madrasah';
  komitmenAsal: string;
  bentukDukungan: string;
  penanggungJawab: string;
  waktuPelaksanaan: string;
  buktiKeberhasilan: string;
  status: 'Direncanakan' | 'Berjalan' | 'Tercapai';
}

export interface Instrument10_RTL {
  tahunPelajaran: string;
  items: ItemRTL[];
  status: StatusInstrumen;
}

// Instrumen 11: Monitoring RTL
export interface LogKunjungan {
  id: string;
  tanggal: string;
  durasiMenit: number; // 10-15 menit
  fokusDiamati: string;
  umpanBalikSingkat: string;
  tindakLanjutTambahan: string;
}

export interface Instrument11_Monitoring {
  guruId: string;
  kunjunganList: LogKunjungan[]; // Minimal 2 kunjungan
  status: StatusInstrumen;
}

// Instrumen 12: Jurnal Refleksi Guru
export interface EntryJurnalGuru {
  id: string;
  tanggalKirim: string;
  mingguKe: string;
  q1_keberhasilan: string;
  q2_tantangan: string;
  q3_solusi: string;
  q4_rencanaBerikut: string;
  balasanKamad: string;
  tanggalBalasan?: string;
  statusBalasan: 'menunggu' | 'dibalas';
}

export interface Instrument12_JurnalGuru {
  guruId: string;
  entries: EntryJurnalGuru[];
  status: StatusInstrumen;
}

// Instrumen 13: Supervisi Ulang
export interface Instrument13_SupervisiUlang {
  guruId: string;
  tanggalSupervisiUlang: string;
  evidence: Instrument5_Evidence;
  observasiTerstruktur: Instrument6_ObservasiTerstruktur;
  status: StatusInstrumen;
}

// Instrumen 14: Rekap Perkembangan Guru
export interface PerkembanganPerGuru {
  guruId: string;
  namaGuru: string;
  skorAwal: number; // Dari Instrumen 6
  skorUlang: number; // Dari Instrumen 13
  selisih: number;
  kategori: 'Berkembang' | 'Stabil' | 'Perlu Pendampingan Intensif'; // Naik >=3, <3, turun / <12
  ciriPalingBerkembang: string;
  buktiKonkret: string;
  fokusSiklusBerikut: string;
}

export interface Instrument14_RekapPerkembangan {
  rekapList: PerkembanganPerGuru[];
  status: StatusInstrumen;
}

// Instrumen 15: Evaluasi Makro (Tingkat Madrasah)
export interface DimensiEvaluasi {
  id: string;
  namaDimensi: string;
  nilaiSkala: number; // 1-5
  temuanUtama: string;
  tindakLanjutSiklusDepan: string;
}

export interface Instrument15_EvaluasiMakro {
  dimensiList: DimensiEvaluasi[];
  daftarInstrumenDisederhanakan: string[];
  rekomendasiUmum: string;
  status: StatusInstrumen;
}

// Ceklis Tahap (10-12 butir per tahap)
export interface ItemCeklisTahap {
  id: string;
  nomor: number;
  kegiatan: string;
  selesai: boolean;
  tanggalSelesai?: string;
}

export interface CeklisPerTahap {
  tahapId: number; // 1-6
  namaTahap: string;
  items: ItemCeklisTahap[];
}

// Ceklis Pendampingan Guru (7 kelompok A-G)
export interface ButirCeklisGuru {
  id: string;
  kelompok: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  kelompokNama: string;
  deskripsi: string;
  direncanakanGuru: boolean; // Tahap 2
  terlihatSupervisor: boolean; // Tahap 3
  catatan?: string;
}

export interface CeklisPendampinganGuruRecord {
  guruId: string;
  items: ButirCeklisGuru[];
}

// Jurnal Refleksi Sabtu Kepala Madrasah
export interface JurnalSabtuKamad {
  id: string;
  tanggal: string; // Sabtu
  mingguKe: number;
  q1_pencapaianMingguIni: string;
  q2_momenBermaknaDialog: string;
  q3_kendalaDanHambatan: string;
  q4_guruPerluDukunganKhusus: string;
  q5_fokusPrioritasMingguDepan: string;
}

// Pengaturan
export interface AppSettings {
  madrasahName: string;
  madrasahNsmNpsn: string;
  kamadName: string;
  kamadNip: string;
  tahunPelajaran: string;
  semester: string;
  supervisors: Array<{ id: string; nama: string; nip: string; jabatan: string }>;
  tahapDates: {
    tahap1: { start: string; end: string; nama: string };
    tahap2: { start: string; end: string; nama: string };
    tahap3: { start: string; end: string; nama: string };
    tahap4: { start: string; end: string; nama: string };
    tahap5: { start: string; end: string; nama: string };
    tahap6: { start: string; end: string; nama: string };
  };
}

// Master State
export interface AppState {
  settings: AppSettings;
  gurus: Guru[];
  jadwals: Record<string, JadwalGuru>; // key: guruId
  instrument1: Instrument1_Program;
  instrument3: Record<string, Instrument3_Telaah>;
  instrument4: Record<string, Instrument4_PraObservasi>;
  instrument5: Record<string, Instrument5_Evidence>;
  instrument6: Record<string, Instrument6_ObservasiTerstruktur>;
  instrument7: Record<string, Instrument7_AIAnalisis>;
  instrument8: Record<string, Instrument8_GROW>;
  instrument9: Record<string, Instrument9_CatatanCoaching>;
  instrument10: Instrument10_RTL;
  instrument11: Record<string, Instrument11_Monitoring>;
  instrument12: Record<string, Instrument12_JurnalGuru>;
  instrument13: Record<string, Instrument13_SupervisiUlang>;
  instrument14: Instrument14_RekapPerkembangan;
  instrument15: Instrument15_EvaluasiMakro;
  ceklisTahap: CeklisPerTahap[];
  ceklisPendampingan: Record<string, CeklisPendampinganGuruRecord>;
  jurnalSabtu: JurnalSabtuKamad[];
}
