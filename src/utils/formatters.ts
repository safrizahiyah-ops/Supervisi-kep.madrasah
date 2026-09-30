import { AppState, Guru, JadwalGuru } from '../types';

export function formatDateIndo(dateStr?: string): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  if (monthIdx < 0 || monthIdx > 11) return dateStr;
  return `${day} ${months[monthIdx]} ${year}`;
}

export function formatDayAndDate(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return `${days[d.getDay()]}, ${formatDateIndo(dateStr)}`;
  } catch {
    return formatDateIndo(dateStr);
  }
}

export interface JadwalConflict {
  tanggal: string;
  jenis: 'observasi' | 'telaah' | 'coaching';
  guruList: { id: string; nama: string; waktu?: string }[];
  keterangan: string;
}

export function detectScheduleConflicts(gurus: Guru[], jadwals: Record<string, JadwalGuru>): JadwalConflict[] {
  const conflicts: JadwalConflict[] = [];

  // Group by observation date
  const obsMap: Record<string, { id: string; nama: string; waktu?: string }[]> = {};
  gurus.forEach(g => {
    const j = jadwals[g.id];
    if (j?.tanggalObservasi) {
      if (!obsMap[j.tanggalObservasi]) obsMap[j.tanggalObservasi] = [];
      obsMap[j.tanggalObservasi].push({ id: g.id, nama: g.nama, waktu: j.waktuObservasi });
    }
  });

  Object.entries(obsMap).forEach(([tgl, list]) => {
    if (list.length > 1) {
      conflicts.push({
        tanggal: tgl,
        jenis: 'observasi',
        guruList: list,
        keterangan: `${list.length} guru dijadwalkan observasi pada tanggal yang sama (${formatDateIndo(tgl)}): ${list.map(l => l.nama).join(', ')}. Pastikan jam tidak tumpang tindih!`
      });
    }
  });

  return conflicts;
}

export interface SystemAlert {
  id: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  description: string;
  guruId?: string;
  guruNama?: string;
  targetTab?: string;
  linkText?: string;
}

export function getSystemAlerts(state: AppState, currentDate: string = '2026-11-15'): SystemAlert[] {
  const alerts: SystemAlert[] = [];

  state.gurus.forEach(guru => {
    const jadwal = state.jadwals[guru.id];
    const inst6 = state.instrument6[guru.id];
    const inst8 = state.instrument8[guru.id];
    const inst9 = state.instrument9[guru.id];
    const inst11 = state.instrument11[guru.id];
    const inst12 = state.instrument12[guru.id];

    // 1. Coaching gap > 7 days warning
    if (jadwal?.tanggalObservasi && jadwal?.tanggalCoaching) {
      const dObs = new Date(jadwal.tanggalObservasi + 'T00:00:00');
      const dCoach = new Date(jadwal.tanggalCoaching + 'T00:00:00');
      const diffDays = Math.round((dCoach.getTime() - dObs.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays > 7) {
        alerts.push({
          id: `coach_gap_${guru.id}`,
          type: 'warning',
          title: 'Jarak Observasi & Coaching Melebihi 7 Hari',
          description: `Jadwal coaching untuk ${guru.nama} berjarak ${diffDays} hari dari tanggal observasi. Buku manual merekomendasikan coaching maksimal 7 hari setelah observasi agar data ingatan masih segar.`,
          guruId: guru.id,
          guruNama: guru.nama,
          targetTab: 'tahap4',
          linkText: 'Sesuaikan Jadwal / Buka Coaching'
        });
      }
    }

    // 2. Monitoring visits < 2 warning (for Tahap 5)
    const visits = inst11?.kunjunganList?.length || 0;
    if (visits < 2) {
      alerts.push({
        id: `mon_visit_${guru.id}`,
        type: 'danger',
        title: 'Kunjungan Monitoring Belum Mencapai Target Minimal (2 Kunjungan)',
        description: `${guru.nama} baru menerima ${visits} kunjungan singkat (10-15 menit). Buku manual mewajibkan minimal 2 kunjungan tindak lanjut.`,
        guruId: guru.id,
        guruNama: guru.nama,
        targetTab: 'tahap5',
        linkText: 'Catat Kunjungan Monitoring'
      });
    }

    // 3. Jurnal guru pending reply > 3 days
    if (inst12?.entries) {
      inst12.entries.forEach(entry => {
        if (entry.statusBalasan === 'menunggu') {
          alerts.push({
            id: `jrn_reply_${guru.id}_${entry.id}`,
            type: 'warning',
            title: 'Jurnal Refleksi Guru Menunggu Tanggapan Kepala Madrasah',
            description: `Jurnal refleksi dari ${guru.nama} (${entry.mingguKe}, dikirim ${formatDateIndo(entry.tanggalKirim)}) belum dibalas. Berikan penguatan dalam batas maksimal 3 hari kerja.`,
            guruId: guru.id,
            guruNama: guru.nama,
            targetTab: 'tahap5',
            linkText: 'Beri Tanggapan Jurnal'
          });
        }
      });
    }
  });

  return alerts;
}

export function getCurrentStageIndex(state: AppState, dateStr: string = '2026-11-15'): number {
  const dates = state.settings.tahapDates;
  const current = new Date(dateStr).getTime();

  if (current <= new Date(dates.tahap1.end).getTime()) return 1;
  if (current <= new Date(dates.tahap2.end).getTime()) return 2;
  if (current <= new Date(dates.tahap3.end).getTime()) return 3;
  if (current <= new Date(dates.tahap4.end).getTime()) return 4;
  if (current <= new Date(dates.tahap5.end).getTime()) return 5;
  return 6;
}

// Generates tasks for current week following the rhythm:
// Senin: Telaah, Selasa–Kamis: Observasi, Jumat: Coaching, Sabtu: Jurnal Kamad
export interface WeeklyTask {
  hari: string;
  jenis: 'Telaah' | 'Observasi' | 'Coaching' | 'Jurnal Kamad';
  guruNama?: string;
  guruId?: string;
  mapel?: string;
  waktu?: string;
  tanggal: string;
  selesai: boolean;
}

export function generateWeeklyTasks(state: AppState): WeeklyTask[] {
  const tasks: WeeklyTask[] = [];

  state.gurus.forEach(guru => {
    const jadwal = state.jadwals[guru.id];
    if (!jadwal) return;

    if (jadwal.tanggalTelaah) {
      tasks.push({
        hari: 'Senin / Hari Telaah',
        jenis: 'Telaah',
        guruNama: guru.nama,
        guruId: guru.id,
        mapel: guru.mapel,
        waktu: '10:00 - 11:00',
        tanggal: jadwal.tanggalTelaah,
        selesai: state.instrument3[guru.id]?.status === 'selesai'
      });
    }

    if (jadwal.tanggalObservasi) {
      tasks.push({
        hari: 'Selasa–Kamis (KBM)',
        jenis: 'Observasi',
        guruNama: guru.nama,
        guruId: guru.id,
        mapel: guru.mapel,
        waktu: jadwal.waktuObservasi || '08:00 - 09:20',
        tanggal: jadwal.tanggalObservasi,
        selesai: state.instrument6[guru.id]?.status === 'selesai'
      });
    }

    if (jadwal.tanggalCoaching) {
      tasks.push({
        hari: 'Jumat / Sesi Refleksi',
        jenis: 'Coaching',
        guruNama: guru.nama,
        guruId: guru.id,
        mapel: guru.mapel,
        waktu: '13:30 - 14:15 (45 Menit)',
        tanggal: jadwal.tanggalCoaching,
        selesai: state.instrument9[guru.id]?.status === 'selesai'
      });
    }
  });

  // Sabtu task: Jurnal Kamad
  tasks.push({
    hari: 'Sabtu / Evaluasi Pekan',
    jenis: 'Jurnal Kamad',
    guruNama: 'Kepala Madrasah & Tim Supervisor',
    mapel: 'Refleksi Mingguan 5 Butir',
    waktu: '09:00 - 10:00',
    tanggal: 'Setiap Sabtu Siklus',
    selesai: state.jurnalSabtu?.length > 0
  });

  return tasks;
}
