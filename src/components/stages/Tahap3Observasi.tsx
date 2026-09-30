import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Save, 
  Award,
  AlertTriangle,
  Info,
  Mic,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AppState, CatatanEvidence, Instrument5_Evidence, Instrument6_ObservasiTerstruktur, RubrikCiri } from '../../types';
import { DEFAULT_RUBRIK_6_CIRI } from '../../data/initialData';
import { formatDateIndo } from '../../utils/formatters';

interface Tahap3Props {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
  selectedGuruId: string;
  onSelectGuru: (id: string) => void;
}

export const Tahap3Observasi: React.FC<Tahap3Props> = ({
  state,
  onUpdateState,
  selectedGuruId,
  onSelectGuru
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inst5' | 'inst6'>('inst5');
  const [showTooltip, setShowTooltip] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const currentGuru = state.gurus.find(g => g.id === selectedGuruId) || state.gurus[0];
  const jadwal = currentGuru ? state.jadwals[currentGuru.id] : undefined;

  // Instrumen 5 data
  const rawInst5 = currentGuru ? state.instrument5[currentGuru.id] : undefined;
  const inst5: Instrument5_Evidence = rawInst5 || {
    guruId: currentGuru?.id || '',
    tanggalObservasi: jadwal?.tanggalObservasi || '2026-11-04',
    mapelMateri: currentGuru ? `${currentGuru.mapel} / Pembelajaran Inti` : '',
    catatanList: [],
    totalMenitGuruBicara: 30,
    totalMenitSiswaAktif: 50,
    perkiraanSiswaTerlibat: 85,
    suasanaKelas: 'Aktif, tertib, dan partisipatif',
    status: 'sedang'
  };

  // Instrumen 6 data
  const rawInst6 = currentGuru ? state.instrument6[currentGuru.id] : undefined;
  const inst6: Instrument6_ObservasiTerstruktur = rawInst6 || {
    guruId: currentGuru?.id || '',
    tanggalObservasi: jadwal?.tanggalObservasi || '2026-11-04',
    rubrik: DEFAULT_RUBRIK_6_CIRI.map(c => ({
      ...c,
      skor: 3,
      rujukanCatatanWaktu: '',
      catatanSupervisor: ''
    })),
    skorTotal: 18,
    status: 'sedang',
    catatanRangkuman: ''
  };

  // Form for adding evidence item
  const getCurrentTimeString = () => {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  const [newTime, setNewTime] = useState(getCurrentTimeString());
  const [newEvent, setNewEvent] = useState('');
  const [newGuruBicara, setNewGuruBicara] = useState(false);
  const [newSiswaAktif, setNewSiswaAktif] = useState(true);
  const [newSiswaCount, setNewSiswaCount] = useState(30);

  if (!currentGuru) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
        Belum ada data guru. Silakan tambahkan guru di Tahap 1.
      </div>
    );
  }

  const showToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const saveInst5 = (data: Instrument5_Evidence) => {
    onUpdateState({
      ...state,
      instrument5: {
        ...state.instrument5,
        [currentGuru.id]: {
          ...data,
          status: 'selesai'
        }
      }
    });
    showToast();
  };

  const saveInst6 = (data: Instrument6_ObservasiTerstruktur) => {
    // calculate total score
    const total = data.rubrik.reduce((acc, curr) => acc + (curr.skor || 0), 0);
    onUpdateState({
      ...state,
      instrument6: {
        ...state.instrument6,
        [currentGuru.id]: {
          ...data,
          skorTotal: total,
          status: 'selesai'
        }
      }
    });
    showToast();
  };

  const handleAddCatatan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.trim()) return;

    const newRecord: CatatanEvidence = {
      id: `ev_${Date.now()}`,
      waktu: newTime || getCurrentTimeString(),
      faktaPeristiwa: newEvent.trim(),
      guruBicara: newGuruBicara,
      siswaAktif: newSiswaAktif,
      jumlahSiswaTerlibat: newSiswaCount
    };

    const updatedList = [...inst5.catatanList, newRecord];
    const updated = {
      ...inst5,
      catatanList: updatedList
    };
    saveInst5(updated);
    setNewEvent('');
    setNewTime(getCurrentTimeString());
  };

  const handleRemoveCatatan = (id: string) => {
    const updated = {
      ...inst5,
      catatanList: inst5.catatanList.filter(c => c.id !== id)
    };
    saveInst5(updated);
  };

  // Rubrik update handlers
  const handleUpdateRubrikSkor = (rubrikId: string, skor: number) => {
    const updatedRubrik = inst6.rubrik.map(r => r.id === rubrikId ? { ...r, skor } : r);
    saveInst6({ ...inst6, rubrik: updatedRubrik });
  };

  const handleUpdateRubrikRujukan = (rubrikId: string, rujukan: string) => {
    const updatedRubrik = inst6.rubrik.map(r => r.id === rubrikId ? { ...r, rujukanCatatanWaktu: rujukan } : r);
    saveInst6({ ...inst6, rubrik: updatedRubrik });
  };

  const handleUpdateRubrikCatatan = (rubrikId: string, catatan: string) => {
    const updatedRubrik = inst6.rubrik.map(r => r.id === rubrikId ? { ...r, catatanSupervisor: catatan } : r);
    saveInst6({ ...inst6, rubrik: updatedRubrik });
  };

  // Helper to quickly insert timestamp from Instrumen 5 into Instrumen 6
  const availableTimestamps = inst5.catatanList.map(c => c.waktu);

  // Talk ratio calculation
  const totalMenit = inst5.totalMenitGuruBicara + inst5.totalMenitSiswaAktif;
  const persenGuru = totalMenit > 0 ? Math.round((inst5.totalMenitGuruBicara / totalMenit) * 100) : 50;
  const persenSiswa = totalMenit > 0 ? Math.round((inst5.totalMenitSiswaAktif / totalMenit) * 100) : 50;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Guru Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#1F3A5F] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                Tahap 3
              </span>
              <span className="text-xs text-slate-500 font-semibold">2 Nov – 4 Des 2026</span>
            </div>
            <h1 className="text-xl font-bold text-[#1F3A5F] mt-1">
              Tahap 3: Pelaksanaan Observasi Pembelajaran
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Merekam fakta obyektif bertanda waktu tanpa asumsi subjektif, dan menilai 6 ciri pembelajaran berbasis bukti nyata.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 shrink-0">
            <Users className="w-4 h-4 text-[#1F3A5F] ml-1" />
            <div className="text-xs">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Pilih Guru:</div>
              <select
                value={currentGuru.id}
                onChange={e => onSelectGuru(e.target.value)}
                className="font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer pr-2"
              >
                {state.gurus.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.nama} ({g.mapel})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Selected Guru Info & Sub-Tabs */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">{currentGuru.nama}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">{currentGuru.mapel} ({currentGuru.kelas})</span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
              Skor Total: {inst6.skorTotal}/24 Poin
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('inst5')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'inst5'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Instrumen 5: Evidence Obyektif ({inst5.catatanList.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('inst6')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'inst6'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Instrumen 6: Rubrik 6 Ciri KBM</span>
            </button>
          </div>
        </div>
      </div>

      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F3A5F] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold border border-[#C9A227]">
          <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
          <span>Data observasi tersimpan secara otomatis!</span>
        </div>
      )}

      {/* SUB-TAB 1: INSTRUMEN 5 LEMBAR EVIDENCE OBYEKTIF */}
      {activeSubTab === 'inst5' && (
        <div className="space-y-6">
          {/* Top Guidelines & Tooltip / Info Card */}
          <div className="bg-blue-50/70 rounded-2xl p-5 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-700" />
                <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Panduan Penulisan Bukti Obyektif (Evidence-Based Observation)
                </h3>
              </div>
              <button
                onClick={() => setShowTooltip(!showTooltip)}
                className="text-xs font-semibold text-blue-800 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                {showTooltip ? 'Sembunyikan Contoh' : 'Lihat Contoh "Tulis Seperti Ini vs Bukan Seperti Ini"'}
              </button>
            </div>

            {showTooltip && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-300">
                  <div className="font-bold text-emerald-900 flex items-center gap-1 mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    TULIS SEPERTI INI (Fakta Perilaku Faktual):
                  </div>
                  <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
                    <li>&ldquo;08:14 Siswa dibagi menjadi 6 kelompok beranggotakan 5 anak dengan LKPD kasus jual beli COD.&rdquo;</li>
                    <li>&ldquo;08:22 Guru mendatangi kelompok 3 dan bertanya: &lsquo;Apa syarat sah akad yang belum terpenuhi?&rsquo;&rdquo;</li>
                    <li>&ldquo;08:35 Empat siswa mengacungkan tangan; 2 siswa perempuan menyampaikan sanggahan.&rdquo;</li>
                  </ul>
                </div>

                <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-300">
                  <div className="font-bold text-rose-900 flex items-center gap-1 mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    BUKAN SEPERTI INI (Opini & Label Subjektif):
                  </div>
                  <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
                    <li>&ldquo;Guru mengajar dengan sangat baik dan penuh semangat.&rdquo; (Opini subjektif)</li>
                    <li>&ldquo;Siswa terlihat malas dan bosan mendengarkan.&rdquo; (Asumsi mental tanpa fakta menit/tindakan)</li>
                    <li>&ldquo;Metode diskusi berjalan kacau.&rdquo; (Penghakiman tanpa rincian peristiwa riil)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Counters: Teacher Talk vs Student Active & Student Engagement */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-[#1F3A5F] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#C9A227]" />
              Dua Penghitung Waktu & Keterlibatan Siswa
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Counter 1: Menit Guru Bicara */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-600 mb-1">
                    <span className="font-semibold flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5 text-blue-600" /> Guru Berbicara
                    </span>
                    <span className="font-bold text-blue-900">{persenGuru}% waktu</span>
                  </div>
                  <div className="text-2xl font-bold text-[#1F3A5F]">
                    {inst5.totalMenitGuruBicara} <span className="text-xs font-normal text-slate-500">menit</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => saveInst5({ ...inst5, totalMenitGuruBicara: Math.max(0, inst5.totalMenitGuruBicara - 5) })}
                    className="px-2 py-1 bg-white border rounded font-bold hover:bg-slate-100"
                  >
                    -5 mnt
                  </button>
                  <button
                    onClick={() => saveInst5({ ...inst5, totalMenitGuruBicara: inst5.totalMenitGuruBicara + 5 })}
                    className="px-2 py-1 bg-white border rounded font-bold hover:bg-slate-100"
                  >
                    +5 mnt
                  </button>
                </div>
              </div>

              {/* Counter 2: Menit Siswa Aktif */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-600 mb-1">
                    <span className="font-semibold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-600" /> Siswa Aktif / Kolaborasi
                    </span>
                    <span className="font-bold text-emerald-800">{persenSiswa}% waktu</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {inst5.totalMenitSiswaAktif} <span className="text-xs font-normal text-slate-500">menit</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => saveInst5({ ...inst5, totalMenitSiswaAktif: Math.max(0, inst5.totalMenitSiswaAktif - 5) })}
                    className="px-2 py-1 bg-white border rounded font-bold hover:bg-slate-100"
                  >
                    -5 mnt
                  </button>
                  <button
                    onClick={() => saveInst5({ ...inst5, totalMenitSiswaAktif: inst5.totalMenitSiswaAktif + 5 })}
                    className="px-2 py-1 bg-white border rounded font-bold hover:bg-slate-100"
                  >
                    +5 mnt
                  </button>
                </div>
              </div>

              {/* Counter 3: Estimasi Siswa Terlibat */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-600 mb-1">
                    <span className="font-semibold">Estimasi Siswa Terlibat</span>
                    <span className="font-bold text-purple-800">{inst5.perkiraanSiswaTerlibat}%</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {inst5.perkiraanSiswaTerlibat}% <span className="text-xs font-normal text-slate-500">partisipasi</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => saveInst5({ ...inst5, perkiraanSiswaTerlibat: Math.max(10, inst5.perkiraanSiswaTerlibat - 5) })}
                    className="px-2 py-1 bg-white border rounded font-bold hover:bg-slate-100"
                  >
                    -5%
                  </button>
                  <button
                    onClick={() => saveInst5({ ...inst5, perkiraanSiswaTerlibat: Math.min(100, inst5.perkiraanSiswaTerlibat + 5) })}
                    className="px-2 py-1 bg-white border rounded font-bold hover:bg-slate-100"
                  >
                    +5%
                  </button>
                </div>
              </div>
            </div>

            {/* Visual Ratio Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-600">
                <span>Guru Bicara ({persenGuru}%)</span>
                <span>Siswa Aktif ({persenSiswa}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${persenGuru}%` }} className="bg-[#1F3A5F] h-full transition-all duration-300" />
                <div style={{ width: `${persenSiswa}%` }} className="bg-emerald-500 h-full transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* Input Form: Tambah Catatan Evidence (Auto Timestamp) */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-[#1F3A5F] uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#C9A227]" />
              Rekam Catatan Evidence Baru
            </h3>

            <form onSubmit={handleAddCatatan} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Jam / Waktu (Otomatis)
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                      placeholder="08:15"
                      className="w-full px-3 py-2 border rounded-lg font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setNewTime(getCurrentTimeString())}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold shrink-0 cursor-pointer"
                    >
                      Sekarang
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-slate-600 font-semibold mb-1">
                    Fakta Peristiwa yang Diamati (Spesifik & Faktual)
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent}
                    onChange={e => setNewEvent(e.target.value)}
                    placeholder="Contoh: Guru membagikan lembar studi kasus dan meminta setiap kelompok menunjuk juru bicara..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#1F3A5F]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newGuruBicara}
                      onChange={e => setNewGuruBicara(e.target.checked)}
                      className="rounded text-[#1F3A5F]"
                    />
                    <span>Guru Bicara</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newSiswaAktif}
                      onChange={e => setNewSiswaAktif(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Siswa Aktif</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Siswa Terlibat:</span>
                    <input
                      type="number"
                      value={newSiswaCount}
                      onChange={e => setNewSiswaCount(parseInt(e.target.value, 10) || 0)}
                      className="w-14 px-2 py-1 border rounded text-center"
                    />
                    <span className="text-slate-500">anak</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1F3A5F] hover:bg-[#2B4E7E] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E0C068]" />
                  <span>Tambah Catatan Evidence</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Evidence Records */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Log Catatan Evidence Bertanda Waktu ({inst5.catatanList.length})
              </h3>
              <span className="text-xs text-slate-500">
                Data ini akan menjadi dasar rujukan rubrik Instrumen 6 dan analisis AI di Tahap 4.
              </span>
            </div>

            {inst5.catatanList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Belum ada catatan evidence yang direkam. Klik &quot;Tambah Catatan Evidence&quot; di atas untuk mulai mencatat alur KBM.
              </div>
            ) : (
              <div className="space-y-2">
                {inst5.catatanList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <span className="px-2 py-1 rounded bg-[#1F3A5F] text-[#E0C068] font-mono font-bold text-[11px] shrink-0 mt-0.5">
                        {item.waktu}
                      </span>
                      <div className="space-y-1">
                        <p className="text-slate-900 leading-relaxed font-medium">
                          {item.faktaPeristiwa}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500">
                          {item.guruBicara && <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">🎙️ Guru Bicara</span>}
                          {item.siswaAktif && <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">👥 Siswa Aktif</span>}
                          <span>Keterlibatan: ~{item.jumlahSiswaTerlibat} siswa</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveCatatan(item.id)}
                      className="text-slate-400 hover:text-red-600 transition cursor-pointer p-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INSTRUMEN 6 LEMBAR OBSERVASI TERSTRUKTUR */}
      {activeSubTab === 'inst6' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
                  Rubrik Penilaian 6 Ciri Pembelajaran
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Instrumen 6: Lembar Observasi Terstruktur KBM
                </h2>
                <p className="text-xs text-slate-500">
                  Setiap skor 1–4 wajib menyertakan rujukan minimal 1 catatan waktu dari Instrumen 5 sebagai bukti otentik.
                </p>
              </div>

              {/* Score Badge */}
              <div className="bg-[#1F3A5F] text-white px-4 py-2.5 rounded-xl shadow text-right shrink-0">
                <div className="text-[10px] text-[#E0C068] font-bold uppercase">Skor Total Akumulasi</div>
                <div className="text-2xl font-black text-white">
                  {inst6.skorTotal} <span className="text-xs font-normal text-slate-300">/ 24</span>
                </div>
              </div>
            </div>

            {/* Rubric Items */}
            <div className="space-y-6">
              {inst6.rubrik.map((ciri, idx) => {
                const hasTimestampRef = ciri.rujukanCatatanWaktu && ciri.rujukanCatatanWaktu.trim().length > 0;

                return (
                  <div
                    key={ciri.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50/70 transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-[#1F3A5F]">
                          {ciri.namaCiri}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {ciri.deskripsi}
                        </p>
                      </div>

                      {/* Score Selector (1-4) */}
                      <div className="flex items-center gap-1.5 self-start sm:self-center">
                        <span className="text-xs text-slate-500 font-semibold mr-1">Skor Level:</span>
                        {[1, 2, 3, 4].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleUpdateRubrikSkor(ciri.id, val)}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                              ciri.skor === val
                                ? 'bg-[#1F3A5F] text-[#E0C068] shadow-md ring-2 ring-[#C9A227]'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Descriptor Grid for Level 1 - 4 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                      {[1, 2, 3, 4].map(lvl => (
                        <div
                          key={lvl}
                          onClick={() => handleUpdateRubrikSkor(ciri.id, lvl)}
                          className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                            ciri.skor === lvl
                              ? 'bg-amber-50/80 border-[#C9A227] text-slate-900 shadow-xs ring-1 ring-[#C9A227]'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              ciri.skor === lvl ? 'bg-[#C9A227] text-[#1F3A5F]' : 'bg-slate-100 text-slate-600'
                            }`}>
                              Level {lvl}
                            </span>
                            <p className="text-[11px] mt-1.5 leading-relaxed">
                              {ciri.deskriptorLevel[lvl as 1 | 2 | 3 | 4]}
                            </p>
                          </div>
                          {ciri.skor === lvl && (
                            <div className="text-[10px] font-bold text-amber-800 mt-2 flex items-center gap-1">
                              ✓ Terpilih
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Mandatory Validation: Rujukan Catatan Waktu dari Instrumen 5 */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#1F3A5F]" />
                          <span>Rujukan Catatan Waktu Instrumen 5 (Wajib):</span>
                          {!hasTimestampRef && (
                            <span className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded font-semibold border border-red-200">
                              *Wajib diisi minimal 1 rujukan waktu
                            </span>
                          )}
                        </label>
                        {availableTimestamps.length > 0 && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <span>Pilih cepat:</span>
                            {availableTimestamps.slice(0, 4).map(ts => (
                              <button
                                key={ts}
                                type="button"
                                onClick={() => {
                                  const currentVal = ciri.rujukanCatatanWaktu ? `${ciri.rujukanCatatanWaktu}, ${ts}` : ts;
                                  handleUpdateRubrikRujukan(ciri.id, currentVal);
                                }}
                                className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[10px] rounded cursor-pointer"
                              >
                                {ts}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Contoh: 08:16, 08:25 (Siswa aktif berdialog pada kelompok 3)"
                        value={ciri.rujukanCatatanWaktu}
                        onChange={e => handleUpdateRubrikRujukan(ciri.id, e.target.value)}
                        className={`w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none ${
                          hasTimestampRef ? 'border-slate-300' : 'border-red-300 bg-red-50/20'
                        }`}
                      />

                      <textarea
                        rows={2}
                        placeholder="Catatan kualitatif supervisor untuk ciri ini..."
                        value={ciri.catatanSupervisor}
                        onChange={e => handleUpdateRubrikCatatan(ciri.id, e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
