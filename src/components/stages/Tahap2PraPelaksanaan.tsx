import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Save, 
  Users, 
  Compass, 
  HelpCircle, 
  Sparkles, 
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  PenTool
} from 'lucide-react';
import { AppState, Guru, Instrument3_Telaah, Instrument4_PraObservasi } from '../../types';
import { DEFAULT_ASPEK_TELAAH } from '../../data/initialData';
import { formatDateIndo } from '../../utils/formatters';

interface Tahap2Props {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
  selectedGuruId: string;
  onSelectGuru: (id: string) => void;
}

export const Tahap2PraPelaksanaan: React.FC<Tahap2Props> = ({
  state,
  onUpdateState,
  selectedGuruId,
  onSelectGuru
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inst3' | 'inst4'>('inst3');
  const [saveToast, setSaveToast] = useState(false);

  const currentGuru = state.gurus.find(g => g.id === selectedGuruId) || state.gurus[0];
  const jadwal = currentGuru ? state.jadwals[currentGuru.id] : undefined;

  // Initialize or fetch Instrumen 3
  const rawInst3 = currentGuru ? state.instrument3[currentGuru.id] : undefined;
  const inst3: Instrument3_Telaah = rawInst3 || {
    guruId: currentGuru?.id || '',
    tanggalTelaah: jadwal?.tanggalTelaah || '2026-10-20',
    aspek: DEFAULT_ASPEK_TELAAH.map(a => ({ ...a, skor: 3, catatan: '' })),
    penguatan: ['Kesesuaian tujuan pembelajaran dengan capaian kurikulum'],
    saran: ['Tingkatkan variasi scaffolding diferensiasi'],
    status: 'sedang'
  };

  // Initialize or fetch Instrumen 4
  const rawInst4 = currentGuru ? state.instrument4[currentGuru.id] : undefined;
  const inst4: Instrument4_PraObservasi = rawInst4 || {
    guruId: currentGuru?.id || '',
    tanggal: jadwal?.tanggalTelaah || '2026-10-22',
    fokusObservasiDisepakati: [
      'Pelibatan aktif siswa dalam berdiskusi kelompok',
      'Pemberian umpan balik formatif langsung'
    ],
    posisiDudukSupervisor: 'Di bagian belakang ruang kelas sejajar pandangan baris siswa',
    caraPerkenalan: 'Hadir senyap sebagai pengamat tanpa interupsi KBM',
    catatanKesiapanGuru: 'Guru siap dengan modul ajar dan lembar aktivitas siswa',
    tandaTanganGuru: {
      nama: currentGuru?.nama || '',
      tanggal: '2026-10-22',
      disetujui: true
    },
    tandaTanganSupervisor: {
      nama: currentGuru?.supervisorNama || 'Kepala Madrasah',
      tanggal: '2026-10-22',
      disetujui: true
    },
    status: 'sedang'
  };

  // Temporary input for new penguatan / saran
  const [newPenguatanInput, setNewPenguatanInput] = useState('');
  const [newSaranInput, setNewSaranInput] = useState('');
  const [newFokusInput, setNewFokusInput] = useState('');

  if (!currentGuru) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
        Belum ada data guru. Silakan tambahkan guru di Tahap 1.
      </div>
    );
  }

  const handleUpdateAspekSkor = (aspekId: string, skor: number) => {
    const updatedAspek = inst3.aspek.map(a => a.id === aspekId ? { ...a, skor } : a);
    const updated = { ...inst3, aspek: updatedAspek };
    saveInst3ToState(updated);
  };

  const handleUpdateAspekCatatan = (aspekId: string, catatan: string) => {
    const updatedAspek = inst3.aspek.map(a => a.id === aspekId ? { ...a, catatan } : a);
    const updated = { ...inst3, aspek: updatedAspek };
    saveInst3ToState(updated);
  };

  const handleAddPenguatan = () => {
    if (!newPenguatanInput.trim()) return;
    if (inst3.penguatan.length >= 3) {
      alert('Sesuai aturan buku manual: maksimal 3 butir penguatan agar fokus guru terjaga!');
      return;
    }
    const updated = {
      ...inst3,
      penguatan: [...inst3.penguatan, newPenguatanInput.trim()]
    };
    saveInst3ToState(updated);
    setNewPenguatanInput('');
  };

  const handleRemovePenguatan = (index: number) => {
    const updated = {
      ...inst3,
      penguatan: inst3.penguatan.filter((_, i) => i !== index)
    };
    saveInst3ToState(updated);
  };

  const handleAddSaran = () => {
    if (!newSaranInput.trim()) return;
    if (inst3.saran.length >= 2) {
      alert('Sesuai aturan buku manual: batasi maksimal 2 saran terarah agar guru tidak terbebani!');
      return;
    }
    const updated = {
      ...inst3,
      saran: [...inst3.saran, newSaranInput.trim()]
    };
    saveInst3ToState(updated);
    setNewSaranInput('');
  };

  const handleRemoveSaran = (index: number) => {
    const updated = {
      ...inst3,
      saran: inst3.saran.filter((_, i) => i !== index)
    };
    saveInst3ToState(updated);
  };

  const saveInst3ToState = (data: Instrument3_Telaah) => {
    onUpdateState({
      ...state,
      instrument3: {
        ...state.instrument3,
        [currentGuru.id]: {
          ...data,
          status: 'selesai'
        }
      }
    });
    showToast();
  };

  const saveInst4ToState = (data: Instrument4_PraObservasi) => {
    onUpdateState({
      ...state,
      instrument4: {
        ...state.instrument4,
        [currentGuru.id]: {
          ...data,
          status: 'selesai'
        }
      }
    });
    showToast();
  };

  const handleAddFokus = () => {
    if (!newFokusInput.trim()) return;
    const updated = {
      ...inst4,
      fokusObservasiDisepakati: [...inst4.fokusObservasiDisepakati, newFokusInput.trim()]
    };
    saveInst4ToState(updated);
    setNewFokusInput('');
  };

  const handleRemoveFokus = (idx: number) => {
    const updated = {
      ...inst4,
      fokusObservasiDisepakati: inst4.fokusObservasiDisepakati.filter((_, i) => i !== idx)
    };
    saveInst4ToState(updated);
  };

  const showToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Guru Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#1F3A5F] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                Tahap 2
              </span>
              <span className="text-xs text-slate-500 font-semibold">15 – 31 Oktober 2026</span>
            </div>
            <h1 className="text-xl font-bold text-[#1F3A5F] mt-1">
              Tahap 2: Pra-Pelaksanaan Supervisi
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Menelaah dokumen perencanaan pembelajaran (RPP/Modul Ajar) dan menyepakati fokus observasi dalam dialog pra-observasi yang bersahabat.
            </p>
          </div>

          {/* Guru Picker */}
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

        {/* Selected Guru Info Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">{currentGuru.nama}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">{currentGuru.mapel} ({currentGuru.kelas})</span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
              Fokus: {currentGuru.fokusPengembangan}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('inst3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'inst3'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Instrumen 3: Telaah Perencanaan</span>
            </button>
            <button
              onClick={() => setActiveSubTab('inst4')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'inst4'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Instrumen 4: Pra-Observasi</span>
            </button>
          </div>
        </div>
      </div>

      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F3A5F] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold border border-[#C9A227]">
          <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
          <span>Data tersimpan otomatis ke sistem!</span>
        </div>
      )}

      {/* SUB-TAB 1: INSTRUMEN 3 TELAAH PERENCANAAN */}
      {activeSubTab === 'inst3' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
                  Analisis Dokumen RPP / Modul Ajar
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Instrumen 3: Lembar Telaah Perencanaan Pembelajaran
                </h2>
                <p className="text-xs text-slate-500">
                  Skor 1: Kurang | 2: Cukup | 3: Baik | 4: Sangat Baik
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Tanggal Telaah:</span>
                <input
                  type="date"
                  value={inst3.tanggalTelaah}
                  onChange={e => saveInst3ToState({ ...inst3, tanggalTelaah: e.target.value })}
                  className="px-2.5 py-1 text-xs border rounded-lg bg-white"
                />
              </div>
            </div>

            {/* 7 Aspek Telaah Table */}
            <div className="space-y-4">
              {inst3.aspek.map((asp, idx) => (
                <div
                  key={asp.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-800">
                      {asp.nama}
                    </span>
                    {/* Score Buttons (1-4) */}
                    <div className="flex items-center gap-1.5 self-start sm:self-center">
                      <span className="text-[11px] text-slate-500 mr-1 font-semibold">Skor:</span>
                      {[1, 2, 3, 4].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleUpdateAspekSkor(asp.id, val)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                            asp.skor === val
                              ? 'bg-[#1F3A5F] text-[#E0C068] shadow-sm ring-2 ring-[#C9A227]/40'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Catatan telaah aspek ini..."
                    value={asp.catatan}
                    onChange={e => handleUpdateAspekCatatan(asp.id, e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-[#1F3A5F] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Golden Rule: Max 3 Penguatan & Max 2 Saran */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Penguatan (Maks 3) */}
            <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Catatan Penguatan (Maksimal 3 Butir)
                  </h3>
                  <p className="text-[11px] text-emerald-800">
                    Apresiasi kekuatan nyata yang ditemukan pada modul ajar.
                  </p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  {inst3.penguatan.length} / 3
                </span>
              </div>

              <div className="space-y-2">
                {inst3.penguatan.map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-white border border-emerald-200 text-xs">
                    <span className="text-slate-800 leading-relaxed font-medium">
                      {i + 1}. {item}
                    </span>
                    <button
                      onClick={() => handleRemovePenguatan(i)}
                      className="text-slate-400 hover:text-red-600 transition cursor-pointer shrink-0 mt-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {inst3.penguatan.length < 3 && (
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Tuliskan butir penguatan..."
                    value={newPenguatanInput}
                    onChange={e => setNewPenguatanInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddPenguatan()}
                    className="flex-1 px-3 py-1.5 text-xs border border-emerald-300 rounded-lg bg-white"
                  />
                  <button
                    onClick={handleAddPenguatan}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
              )}
            </div>

            {/* Saran Terarah (Maks 2) */}
            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-600" />
                    Saran Perbaikan Terarah (Maksimal 2 Butir)
                  </h3>
                  <p className="text-[11px] text-amber-800">
                    Buku manual membatasi maksimal 2 saran agar tidak membebani guru.
                  </p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  {inst3.saran.length} / 2
                </span>
              </div>

              <div className="space-y-2">
                {inst3.saran.map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-white border border-amber-200 text-xs">
                    <span className="text-slate-800 leading-relaxed font-medium">
                      {i + 1}. {item}
                    </span>
                    <button
                      onClick={() => handleRemoveSaran(i)}
                      className="text-slate-400 hover:text-red-600 transition cursor-pointer shrink-0 mt-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {inst3.saran.length < 2 && (
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Tuliskan saran perbaikan terarah..."
                    value={newSaranInput}
                    onChange={e => setNewSaranInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddSaran()}
                    className="flex-1 px-3 py-1.5 text-xs border border-amber-300 rounded-lg bg-white"
                  />
                  <button
                    onClick={handleAddSaran}
                    className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INSTRUMEN 4 PRA-OBSERVASI */}
      {activeSubTab === 'inst4' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
              Kesepakatan Kemitraan Pra-Observasi
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Instrumen 4: Lembar Kesepakatan Pra-Observasi KBM
            </h2>
            <p className="text-xs text-slate-500">
              Menghilangkan ketegangan sebelum masuk kelas: menyepakati fokus observasi, posisi duduk yang nyaman, dan adab perkenalan di depan siswa.
            </p>
          </div>

          {/* Fokus Observasi yang Disepakati */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Fokus Observasi yang Disepakati Bersama Guru
            </label>
            <div className="space-y-2">
              {inst4.fokusObservasiDisepakati.map((fokus, i) => (
                <div key={i} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1F3A5F] text-[#E0C068] font-bold text-[10px] flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{fokus}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveFokus(i)}
                    className="text-slate-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tambahkan fokus observasi spesifik..."
                value={newFokusInput}
                onChange={e => setNewFokusInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddFokus()}
                className="flex-1 px-3 py-2 text-xs border rounded-lg focus:ring-1 focus:ring-[#1F3A5F]"
              />
              <button
                onClick={handleAddFokus}
                className="px-3.5 py-2 rounded-lg bg-[#1F3A5F] text-white text-xs font-bold hover:bg-[#2B4E7E] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Fokus
              </button>
            </div>
          </div>

          {/* Posisi Duduk & Cara Perkenalan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                2. Posisi Duduk Supervisor di Ruang Kelas
              </label>
              <textarea
                rows={3}
                value={inst4.posisiDudukSupervisor}
                onChange={e => saveInst4ToState({ ...inst4, posisiDudukSupervisor: e.target.value })}
                placeholder="Contoh: Di sudut belakang kanan kelas sejajar pandangan siswa agar tidak menghalangi konsentrasi..."
                className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-1 focus:ring-[#1F3A5F]"
              />
              <span className="text-[10px] text-slate-500 block">
                *Pilih posisi di mana pengamat bisa mendengar dialog siswa tanpa menjadi pusat perhatian.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                3. Cara Perkenalan Singkat di Depan Kelas
              </label>
              <textarea
                rows={3}
                value={inst4.caraPerkenalan}
                onChange={e => saveInst4ToState({ ...inst4, caraPerkenalan: e.target.value })}
                placeholder="Contoh: Hadir senyap; guru cukup menyapa ramah 30 detik tanpa menginterupsi alur pembelajaran..."
                className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-1 focus:ring-[#1F3A5F]"
              />
              <span className="text-[10px] text-slate-500 block">
                *Hindari sambutan panjang yang membuat siswa merasa sedang diuji.
              </span>
            </div>
          </div>

          {/* Tanda Tangan Digital Kesepakatan (Nama + Tanggal) */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-[#1F3A5F] uppercase tracking-wider flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-[#C9A227]" />
              Pengesahan & Tanda Tangan Digital Kemitraan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Guru */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-[11px] text-slate-500 font-semibold">Guru yang Disupervisi:</div>
                <div className="font-bold text-slate-900 text-xs">{inst4.tandaTanganGuru.nama}</div>
                <div className="text-[11px] text-slate-500">
                  Tanggal Kesepakatan: {formatDateIndo(inst4.tandaTanganGuru.tanggal)}
                </div>
                <label className="flex items-center gap-2 pt-2 border-t text-xs font-semibold text-emerald-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inst4.tandaTanganGuru.disetujui}
                    onChange={e => {
                      saveInst4ToState({
                        ...inst4,
                        tandaTanganGuru: {
                          ...inst4.tandaTanganGuru,
                          disetujui: e.target.checked
                        }
                      });
                    }}
                    className="rounded text-emerald-600"
                  />
                  <span>✓ Telah Menyetujui Fokus Pra-Observasi</span>
                </label>
              </div>

              {/* Supervisor */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-[11px] text-slate-500 font-semibold">Kepala Madrasah / Supervisor:</div>
                <div className="font-bold text-slate-900 text-xs">{inst4.tandaTanganSupervisor.nama}</div>
                <div className="text-[11px] text-slate-500">
                  Tanggal Kesepakatan: {formatDateIndo(inst4.tandaTanganSupervisor.tanggal)}
                </div>
                <label className="flex items-center gap-2 pt-2 border-t text-xs font-semibold text-emerald-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inst4.tandaTanganSupervisor.disetujui}
                    onChange={e => {
                      saveInst4ToState({
                        ...inst4,
                        tandaTanganSupervisor: {
                          ...inst4.tandaTanganSupervisor,
                          disetujui: e.target.checked
                        }
                      });
                    }}
                    className="rounded text-emerald-600"
                  />
                  <span>✓ Telah Menyetujui Fokus Pra-Observasi</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
