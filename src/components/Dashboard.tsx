import React from 'react';
import { 
  Users, 
  Eye, 
  MessageSquare, 
  FileCheck2, 
  Footprints, 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Sparkles,
  Award,
  ChevronRight,
  BookOpen,
  Filter
} from 'lucide-react';
import { AppState, Guru } from '../types';
import { formatDateIndo, getSystemAlerts, getCurrentStageIndex, generateWeeklyTasks } from '../utils/formatters';

interface DashboardProps {
  state: AppState;
  onNavigateTab: (tab: string, selectedGuruId?: string) => void;
  onSelectGuru: (guruId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  state,
  onNavigateTab,
  onSelectGuru
}) => {
  // Current active stage
  const currentStage = getCurrentStageIndex(state);
  const alerts = getSystemAlerts(state);
  const weeklyTasks = generateWeeklyTasks(state);

  // Metrics computation
  const totalGuru = state.gurus.length;
  const sudahDiobservasi = Object.values(state.instrument6).filter(i => i.status === 'selesai').length;
  const sudahDicoaching = Object.values(state.instrument9).filter(i => i.status === 'selesai').length;
  const totalKomitmen = Object.values(state.instrument9).filter(i => i.tindakan && i.tindakan.trim().length > 0).length;
  
  let totalKunjungan = 0;
  Object.values(state.instrument11).forEach(m => {
    totalKunjungan += m.kunjunganList?.length || 0;
  });

  const scores = Object.values(state.instrument6)
    .filter(i => i.skorTotal > 0)
    .map(i => i.skorTotal);
  const avgSkor = scores.length > 0 
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : '0';

  const stagesInfo = [
    {
      id: 1,
      tab: 'tahap1',
      title: 'Tahap 1: Persiapan',
      range: '1–14 Okt 2026',
      instruments: 'Inst. 1 & 2',
      desc: 'Program supervisi & jadwal'
    },
    {
      id: 2,
      tab: 'tahap2',
      title: 'Tahap 2: Pra-Pelaksanaan',
      range: '15–31 Okt 2026',
      instruments: 'Inst. 3 & 4',
      desc: 'Telaah modul & pra-observasi'
    },
    {
      id: 3,
      tab: 'tahap3',
      title: 'Tahap 3: Observasi',
      range: '2 Nov – 4 Des 2026',
      instruments: 'Inst. 5 & 6',
      desc: 'Evidence faktual & rubrik 6 ciri'
    },
    {
      id: 4,
      tab: 'tahap4',
      title: 'Tahap 4: Refleksi & Coaching',
      range: '9 Nov – 11 Des 2026',
      instruments: 'Inst. 7, 8, 9',
      desc: 'Analisis AI, alur GROW & komitmen'
    },
    {
      id: 5,
      tab: 'tahap5',
      title: 'Tahap 5: Tindak Lanjut',
      range: '4 Jan – 26 Feb 2027',
      instruments: 'Inst. 10, 11, 12',
      desc: 'RTL madrasah, monitoring & jurnal'
    },
    {
      id: 6,
      tab: 'tahap6',
      title: 'Tahap 6: Siklus Lanjutan',
      range: '1–31 Mar 2027',
      instruments: 'Inst. 13, 14, 15',
      desc: 'Supervisi ulang & evaluasi makro'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Principal Philosophy Quote Banner */}
      <div className="bg-gradient-to-r from-[#1F3A5F] via-[#264875] to-[#1F3A5F] rounded-2xl p-6 text-white shadow-md border-l-8 border-[#C9A227] relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-[#C9A227]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="bg-[#C9A227] text-[#1F3A5F] text-[11px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                Prinsip Utama Supervisi Madrasah
              </span>
              <span className="text-xs text-slate-300">Buku Manual Pegangan Kepala Madrasah</span>
            </div>
            <p className="text-lg md:text-xl font-serif italic text-amber-100 font-medium leading-relaxed">
              &ldquo;Instrumen adalah alat bantu navigasi, bukan tujuan akhir. Jangan biarkan pengisian formulir mengalahkan dialog profesional.&rdquo;
            </p>
            <p className="text-xs text-slate-300">
              Setiap skor harus bersumber dari dialog bermakna, observasi obyektif, dan komitmen kemitraan yang memanusiakan guru.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('tahap1')}
            className="px-4 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#d9b236] text-[#1F3A5F] font-bold text-xs transition shadow flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Mulai Alur Tahap 1</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6-Stage Timeline Navigator */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#1F3A5F] uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C9A227]" />
              Peta Navigasi 6 Tahap Siklus Supervisi (1 Okt 2026 – 31 Mar 2027)
            </h2>
            <p className="text-xs text-slate-500">
              Klik pada tahap manapun untuk langsung membuka instrumen dan checklist terkait.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            Tahap Saat Ini: Tahap {currentStage}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stagesInfo.map((st) => {
            const isCurrent = st.id === currentStage;
            const isPast = st.id < currentStage;
            return (
              <button
                key={st.id}
                onClick={() => onNavigateTab(st.tab)}
                className={`text-left p-3.5 rounded-xl transition-all border flex flex-col justify-between cursor-pointer relative group ${
                  isCurrent
                    ? 'bg-gradient-to-b from-[#1F3A5F] to-[#172D4A] text-white border-[#C9A227] shadow-md ring-2 ring-[#C9A227]/40 scale-[1.02]'
                    : isPast
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2.5 right-2 bg-[#C9A227] text-[#1F3A5F] text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                    BERJALAN
                  </span>
                )}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isCurrent 
                        ? 'bg-white/20 text-white' 
                        : isPast 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isPast ? '✓ Selesai' : `Tahap ${st.id}`}
                    </span>
                    <span className={`text-[10px] font-semibold ${isCurrent ? 'text-[#E0C068]' : 'text-slate-500'}`}>
                      {st.instruments}
                    </span>
                  </div>
                  <h3 className={`text-xs font-bold leading-snug line-clamp-1 ${isCurrent ? 'text-white' : 'text-slate-800'}`}>
                    {st.title.replace(`Tahap ${st.id}: `, '')}
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                    {st.range}
                  </p>
                </div>
                <div className={`mt-3 pt-2 text-[10px] border-t flex items-center justify-between ${
                  isCurrent ? 'border-white/10 text-[#E0C068]' : 'border-slate-200 text-slate-400 group-hover:text-[#1F3A5F]'
                }`}>
                  <span>Buka Tahap</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Total Guru */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Guru</span>
            <Users className="w-4 h-4 text-[#1F3A5F]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#1F3A5F]">{totalGuru}</span>
            <span className="text-xs text-slate-500 ml-1">orang</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Sasaran siklus ini</div>
        </div>

        {/* Metric 2: Sudah Diobservasi */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Diobservasi</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-blue-700">{sudahDiobservasi}</span>
            <span className="text-xs text-slate-500 ml-1">/ {totalGuru}</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">
            {totalGuru > 0 ? Math.round((sudahDiobservasi / totalGuru) * 100) : 0}% terlaksana
          </div>
        </div>

        {/* Metric 3: Sudah Dicoaching */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Dicoaching</span>
            <MessageSquare className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-purple-700">{sudahDicoaching}</span>
            <span className="text-xs text-slate-500 ml-1">/ {totalGuru}</span>
          </div>
          <div className="text-[10px] text-purple-600 font-medium mt-1">Alur GROW 45 menit</div>
        </div>

        {/* Metric 4: Komitmen Tercatat */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Komitmen Guru</span>
            <FileCheck2 className="w-4 h-4 text-[#C9A227]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#A37E15]">{totalKomitmen}</span>
            <span className="text-xs text-slate-500 ml-1">butir</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">4 Unsur tervalidasi</div>
        </div>

        {/* Metric 5: Kunjungan Monitoring */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Monitoring</span>
            <Footprints className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-amber-700">{totalKunjungan}</span>
            <span className="text-xs text-slate-500 ml-1">kali</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Log 10–15 menit</div>
        </div>

        {/* Metric 6: Rata-rata Skor KBM */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Rata-rata Skor</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-emerald-700">{avgSkor}</span>
            <span className="text-xs text-slate-500 ml-1">/ 24</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Rubrik 6 Ciri KBM</div>
        </div>
      </div>

      {/* Warning Alerts Section (Coaching > 7 days, Journal waiting > 3 days, Monitoring < 2) */}
      {alerts.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <h3 className="text-sm font-bold text-amber-900">
                Peringatan Operasional & Kepatuhan Prosedur ({alerts.length})
              </h3>
            </div>
            <span className="text-xs text-amber-700 font-medium">Berdasarkan Regulasi Buku Manual</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white p-3 rounded-xl border border-amber-200 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    {alert.title}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {alert.description}
                  </p>
                </div>
                {alert.targetTab && (
                  <button
                    onClick={() => {
                      if (alert.guruId) onSelectGuru(alert.guruId);
                      onNavigateTab(alert.targetTab!);
                    }}
                    className="shrink-0 px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-[11px] transition cursor-pointer flex items-center gap-1"
                  >
                    <span>Buka</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Columns: Weekly Rhythm Tasks vs Guru Supervision Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Weekly Rhythm Tasks */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#1F3A5F] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C9A227]" />
                Ritme Mingguan Kepala Madrasah
              </h3>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                Pola Standar
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Ritme ideal supervisi: <strong>Senin</strong> telaah RPP, <strong>Selasa–Kamis</strong> observasi KBM, <strong>Jumat</strong> dialog coaching, dan <strong>Sabtu</strong> refleksi jurnal.
            </p>

            <div className="space-y-2.5">
              {weeklyTasks.slice(0, 6).map((task, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-2 ${
                    task.selesai
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-700'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        task.jenis === 'Telaah' ? 'bg-blue-100 text-blue-800' :
                        task.jenis === 'Observasi' ? 'bg-emerald-100 text-emerald-800' :
                        task.jenis === 'Coaching' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {task.jenis}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">{task.hari}</span>
                    </div>
                    <div className="font-semibold text-slate-800">
                      {task.guruNama}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {task.mapel} • {formatDateIndo(task.tanggal)} ({task.waktu})
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 mt-1">
                    {task.selesai ? (
                      <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Selesai
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (task.guruId) onSelectGuru(task.guruId);
                          if (task.jenis === 'Telaah') onNavigateTab('tahap2');
                          else if (task.jenis === 'Observasi') onNavigateTab('tahap3');
                          else if (task.jenis === 'Coaching') onNavigateTab('tahap4');
                        }}
                        className="px-2 py-1 rounded bg-[#1F3A5F] hover:bg-[#162B46] text-white text-[10px] font-semibold transition cursor-pointer"
                      >
                        Laksanakan
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Sabtu: Jurnal Refleksi Kamad</span>
            <button
              onClick={() => onNavigateTab('tahap1')}
              className="text-[#1F3A5F] font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              Lihat Kalender Lengkap <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Column (2 cols wide): Matriks Supervisi Per Guru */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#1F3A5F] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C9A227]" />
                Daftar Guru Binaan & Status Instrumen
              </h3>
              <p className="text-xs text-slate-500">
                Pantau progres tahapan supervisi setiap guru secara transparan.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('tahap1')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Kelola Jadwal & Tim (Inst. 2)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Guru & Mapel</th>
                  <th className="py-2.5 px-3 text-center">Telaah (Inst 3)</th>
                  <th className="py-2.5 px-3 text-center">Observasi (Inst 6)</th>
                  <th className="py-2.5 px-3 text-center">GROW (Inst 8/9)</th>
                  <th className="py-2.5 px-3 text-center">Monitoring (Inst 11)</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.gurus.map((guru) => {
                  const inst3 = state.instrument3[guru.id];
                  const inst6 = state.instrument6[guru.id];
                  const inst9 = state.instrument9[guru.id];
                  const inst11 = state.instrument11[guru.id];
                  const visits = inst11?.kunjunganList?.length || 0;

                  return (
                    <tr key={guru.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{guru.nama}</div>
                        <div className="text-[11px] text-slate-500">
                          {guru.mapel} • {guru.kelas}
                        </div>
                        <div className="text-[10px] text-[#C9A227] font-medium truncate max-w-xs mt-0.5">
                          Fokus: {guru.fokusPengembangan}
                        </div>
                      </td>

                      {/* Inst 3 Telaah */}
                      <td className="py-3 px-3 text-center">
                        {inst3?.status === 'selesai' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            ✓ Selesai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px]">
                            Belum
                          </span>
                        )}
                      </td>

                      {/* Inst 6 Observasi */}
                      <td className="py-3 px-3 text-center">
                        {inst6?.status === 'selesai' ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                              {inst6.skorTotal}/24 Poin
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px]">
                            Belum
                          </span>
                        )}
                      </td>

                      {/* Inst 8/9 Coaching */}
                      <td className="py-3 px-3 text-center">
                        {inst9?.status === 'selesai' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                            ✓ Komitmen Ada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px]">
                            Belum
                          </span>
                        )}
                      </td>

                      {/* Inst 11 Monitoring */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          visits >= 2 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : visits === 1
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {visits} / 2 Kunjungan
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => {
                            onSelectGuru(guru.id);
                            // Jump to appropriate stage based on progress
                            if (!inst3 || inst3.status !== 'selesai') {
                              onNavigateTab('tahap2');
                            } else if (!inst6 || inst6.status !== 'selesai') {
                              onNavigateTab('tahap3');
                            } else if (!inst9 || inst9.status !== 'selesai') {
                              onNavigateTab('tahap4');
                            } else {
                              onNavigateTab('tahap5');
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-[#1F3A5F] hover:bg-[#2B4E7E] text-white text-[11px] font-medium transition cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Buka Berkas</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
