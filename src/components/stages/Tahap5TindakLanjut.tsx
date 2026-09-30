import React, { useState } from 'react';
import { 
  FileText, 
  Footprints, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Save, 
  Clock, 
  RefreshCw,
  Send,
  MessageCircle,
  HelpCircle,
  Layers
} from 'lucide-react';
import { AppState, Instrument10_RTL, ItemRTL, LogKunjungan, EntryJurnalGuru } from '../../types';
import { formatDateIndo } from '../../utils/formatters';

interface Tahap5Props {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
  selectedGuruId: string;
  onSelectGuru: (id: string) => void;
}

export const Tahap5TindakLanjut: React.FC<Tahap5Props> = ({
  state,
  onUpdateState,
  selectedGuruId,
  onSelectGuru
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inst10' | 'inst11' | 'inst12'>('inst10');
  const [saveToast, setSaveToast] = useState(false);

  const currentGuru = state.gurus.find(g => g.id === selectedGuruId) || state.gurus[0];

  // Instrumen 10 Data (Tingkat Madrasah)
  const inst10 = state.instrument10;

  // Instrumen 11 Data (Per Guru)
  const rawInst11 = currentGuru ? state.instrument11[currentGuru.id] : undefined;
  const inst11 = rawInst11 || {
    guruId: currentGuru?.id || '',
    kunjunganList: [],
    status: 'sedang'
  };

  // Instrumen 12 Data (Per Guru)
  const rawInst12 = currentGuru ? state.instrument12[currentGuru.id] : undefined;
  const inst12 = rawInst12 || {
    guruId: currentGuru?.id || '',
    entries: [],
    status: 'sedang'
  };

  // Form states for adding items
  const [newRtlItem, setNewRtlItem] = useState<Partial<ItemRTL>>({
    guruId: currentGuru?.id || '',
    guruNama: currentGuru?.nama || '',
    kategori: 'Pelatihan',
    komitmenAsal: '',
    bentukDukungan: '',
    penanggungJawab: 'Waka Kurikulum',
    waktuPelaksanaan: 'Januari 2027',
    buktiKeberhasilan: '',
    status: 'Direncanakan'
  });
  const [isAddingRtl, setIsAddingRtl] = useState(false);

  const [newKunjungan, setNewKunjungan] = useState<Partial<LogKunjungan>>({
    tanggal: new Date().toISOString().slice(0, 10),
    durasiMenit: 15,
    fokusDiamati: '',
    umpanBalikSingkat: '',
    tindakLanjutTambahan: ''
  });
  const [isAddingKunjungan, setIsAddingKunjungan] = useState(false);

  const [newJurnal, setNewJurnal] = useState<Partial<EntryJurnalGuru>>({
    tanggalKirim: new Date().toISOString().slice(0, 10),
    mingguKe: 'Minggu ke-3 Januari',
    q1_keberhasilan: '',
    q2_tantangan: '',
    q3_solusi: '',
    q4_rencanaBerikut: '',
    balasanKamad: '',
    statusBalasan: 'menunggu'
  });
  const [isAddingJurnal, setIsAddingJurnal] = useState(false);

  // Kamad reply draft state per journal entry id
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const showToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // Auto-sync RTL from Instrument 9 commitments
  const handleSyncCommitmentsToRtl = () => {
    const existingGuruIds = new Set(inst10.items.map(i => i.guruId));
    const newItems: ItemRTL[] = [];

    state.gurus.forEach(guru => {
      const c9 = state.instrument9[guru.id];
      if (c9 && c9.tindakan && !existingGuruIds.has(guru.id)) {
        newItems.push({
          id: `rtl_sync_${guru.id}_${Date.now()}`,
          guruId: guru.id,
          guruNama: guru.nama,
          kategori: 'Pelatihan',
          komitmenAsal: c9.tindakan,
          bentukDukungan: c9.catatanDukungan || 'Fasilitasi madrasah dan pendampingan MGMP',
          penanggungJawab: 'Kepala Madrasah & Tim Supervisor',
          waktuPelaksanaan: `Mulai ${formatDateIndo(c9.tanggalMulai)}`,
          buktiKeberhasilan: c9.ukuranKeberhasilan || 'Ketercapaian indikator unjuk kerja siswa',
          status: 'Berjalan'
        });
      }
    });

    if (newItems.length === 0) {
      alert('Semua komitmen guru dari Instrumen 9 sudah tersinkronisasi ke RTL.');
      return;
    }

    onUpdateState({
      ...state,
      instrument10: {
        ...inst10,
        items: [...inst10.items, ...newItems],
        status: 'sedang'
      }
    });
    alert(`Berhasil menarik ${newItems.length} komitmen guru baru ke dalam RTL Madrasah!`);
  };

  const handleAddRtl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRtlItem.komitmenAsal || !newRtlItem.bentukDukungan) {
      alert('Komitmen dan bentuk dukungan wajib diisi!');
      return;
    }
    const item: ItemRTL = {
      id: `rtl_${Date.now()}`,
      guruId: newRtlItem.guruId || currentGuru.id,
      guruNama: newRtlItem.guruNama || currentGuru.nama,
      kategori: newRtlItem.kategori as any || 'Pelatihan',
      komitmenAsal: newRtlItem.komitmenAsal || '',
      bentukDukungan: newRtlItem.bentukDukungan || '',
      penanggungJawab: newRtlItem.penanggungJawab || 'Waka Kurikulum',
      waktuPelaksanaan: newRtlItem.waktuPelaksanaan || 'Januari 2027',
      buktiKeberhasilan: newRtlItem.buktiKeberhasilan || '',
      status: newRtlItem.status as any || 'Direncanakan'
    };

    onUpdateState({
      ...state,
      instrument10: {
        ...inst10,
        items: [...inst10.items, item]
      }
    });
    setIsAddingRtl(false);
    showToast();
  };

  const handleDeleteRtl = (id: string) => {
    if (confirm('Hapus butir RTL ini?')) {
      onUpdateState({
        ...state,
        instrument10: {
          ...inst10,
          items: inst10.items.filter(i => i.id !== id)
        }
      });
      showToast();
    }
  };

  // Add Monitoring Visit
  const handleAddKunjungan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKunjungan.fokusDiamati) return;

    const log: LogKunjungan = {
      id: `kj_${Date.now()}`,
      tanggal: newKunjungan.tanggal || new Date().toISOString().slice(0, 10),
      durasiMenit: newKunjungan.durasiMenit || 15,
      fokusDiamati: newKunjungan.fokusDiamati || '',
      umpanBalikSingkat: newKunjungan.umpanBalikSingkat || '',
      tindakLanjutTambahan: newKunjungan.tindakLanjutTambahan || ''
    };

    const nextList = [...inst11.kunjunganList, log];
    onUpdateState({
      ...state,
      instrument11: {
        ...state.instrument11,
        [currentGuru.id]: {
          guruId: currentGuru.id,
          kunjunganList: nextList,
          status: nextList.length >= 2 ? 'selesai' : 'sedang'
        }
      }
    });

    setIsAddingKunjungan(false);
    setNewKunjungan({
      tanggal: new Date().toISOString().slice(0, 10),
      durasiMenit: 15,
      fokusDiamati: '',
      umpanBalikSingkat: '',
      tindakLanjutTambahan: ''
    });
    showToast();
  };

  const handleDeleteKunjungan = (id: string) => {
    const nextList = inst11.kunjunganList.filter(k => k.id !== id);
    onUpdateState({
      ...state,
      instrument11: {
        ...state.instrument11,
        [currentGuru.id]: {
          ...inst11,
          kunjunganList: nextList,
          status: nextList.length >= 2 ? 'selesai' : 'sedang'
        }
      }
    });
    showToast();
  };

  // Jurnal Refleksi Handlers
  const handleAddJurnal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJurnal.q1_keberhasilan) return;

    const entry: EntryJurnalGuru = {
      id: `jrn_${Date.now()}`,
      tanggalKirim: newJurnal.tanggalKirim || new Date().toISOString().slice(0, 10),
      mingguKe: newJurnal.mingguKe || 'Dua Mingguan',
      q1_keberhasilan: newJurnal.q1_keberhasilan || '',
      q2_tantangan: newJurnal.q2_tantangan || '',
      q3_solusi: newJurnal.q3_solusi || '',
      q4_rencanaBerikut: newJurnal.q4_rencanaBerikut || '',
      balasanKamad: '',
      statusBalasan: 'menunggu'
    };

    const nextEntries = [...inst12.entries, entry];
    onUpdateState({
      ...state,
      instrument12: {
        ...state.instrument12,
        [currentGuru.id]: {
          guruId: currentGuru.id,
          entries: nextEntries,
          status: 'sedang'
        }
      }
    });

    setIsAddingJurnal(false);
    showToast();
  };

  const handleSaveBalasanKamad = (entryId: string) => {
    const text = replyDrafts[entryId];
    if (!text || !text.trim()) return;

    const nextEntries = inst12.entries.map(e => {
      if (e.id === entryId) {
        return {
          ...e,
          balasanKamad: text.trim(),
          tanggalBalasan: new Date().toISOString().slice(0, 10),
          statusBalasan: 'dibalas' as const
        };
      }
      return e;
    });

    onUpdateState({
      ...state,
      instrument12: {
        ...state.instrument12,
        [currentGuru.id]: {
          ...inst12,
          entries: nextEntries
        }
      }
    });
    showToast();
  };

  const visitCount = inst11.kunjunganList.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Tahap 5 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#1F3A5F] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                Tahap 5
              </span>
              <span className="text-xs text-slate-500 font-semibold">4 Jan – 26 Feb 2027</span>
            </div>
            <h1 className="text-xl font-bold text-[#1F3A5F] mt-1">
              Tahap 5: Tindak Lanjut & Pendampingan Berkelanjutan
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Mengawal pelaksanaan komitmen: Rencana Tindak Lanjut (RTL) madrasah, kunjungan monitoring singkat 10-15 menit, dan jurnal refleksi dua mingguan.
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

        {/* Sub-Tabs */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">{currentGuru.nama}</span>
            <span className="text-slate-400">•</span>
            <span className={`px-2 py-0.5 rounded font-bold ${
              visitCount >= 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              Monitoring: {visitCount} / 2 Kunjungan
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('inst10')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'inst10'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Inst. 10: RTL Madrasah ({inst10.items.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('inst11')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'inst11'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Footprints className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Inst. 11: Monitoring RTL ({visitCount})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('inst12')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'inst12'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Inst. 12: Jurnal Refleksi Guru ({inst12.entries.length})</span>
            </button>
          </div>
        </div>
      </div>

      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F3A5F] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold border border-[#C9A227]">
          <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
          <span>Perubahan berhasil disimpan!</span>
        </div>
      )}

      {/* SUB-TAB 1: INSTRUMEN 10 RTL MADRASAH */}
      {activeSubTab === 'inst10' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
                Rekap Agregasi Komitmen Tingkat Madrasah
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Instrumen 10: Rencana Tindak Lanjut (RTL) Madrasah
              </h2>
              <p className="text-xs text-slate-500">
                Merekap seluruh komitmen guru dari Instrumen 9 dan mengelompokkan bentuk dukungan (Pelatihan, Media/Fasilitas, MGMP, Kebijakan).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSyncCommitmentsToRtl}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                <span>Sinkronkan dari Komitmen Inst. 9</span>
              </button>
              <button
                onClick={() => setIsAddingRtl(true)}
                className="px-3.5 py-2 rounded-xl bg-[#1F3A5F] hover:bg-[#2B4E7E] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#E0C068]" />
                <span>Tambah Butir RTL</span>
              </button>
            </div>
          </div>

          {/* Grouping Overview Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {['Pelatihan', 'Fasilitas & Media', 'MGMP & Rekan Sejawat', 'Kebijakan Madrasah'].map((kat) => {
              const count = inst10.items.filter(i => i.kategori === kat).length;
              return (
                <div key={kat} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-semibold">{kat}</div>
                  <div className="text-lg font-bold text-[#1F3A5F] mt-0.5">{count} Program</div>
                </div>
              );
            })}
          </div>

          {/* RTL Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1F3A5F] text-white font-semibold">
                <tr>
                  <th className="py-2.5 px-3 rounded-tl-lg">Guru</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Komitmen Asal (Inst 9)</th>
                  <th className="py-2.5 px-3">Bentuk Dukungan Madrasah</th>
                  <th className="py-2.5 px-3">PJ & Waktu</th>
                  <th className="py-2.5 px-3">Bukti Keberhasilan</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-center rounded-tr-lg">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 border border-slate-200">
                {inst10.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {item.guruNama}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-xs text-slate-700">
                      {item.komitmenAsal}
                    </td>
                    <td className="py-3 px-3 max-w-xs font-medium text-slate-800">
                      {item.bentukDukungan}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                      <div>{item.penanggungJawab}</div>
                      <div className="text-[10px] text-slate-400">{item.waktuPelaksanaan}</div>
                    </td>
                    <td className="py-3 px-3 max-w-xs text-slate-600">
                      {item.buktiKeberhasilan}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'Tercapai' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'Berjalan' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleDeleteRtl(item.id)}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INSTRUMEN 11 MONITORING RTL (LOG 10-15 MENIT) */}
      {activeSubTab === 'inst11' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
                Kunjungan Singkat 10–15 Menit
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Instrumen 11: Lembar Monitoring Pelaksanaan RTL
              </h2>
              <p className="text-xs text-slate-500">
                Memantau secara nyata penerapan komitmen di kelas. Target buku manual: <strong>minimal 2 kunjungan singkat</strong> per guru.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {visitCount < 2 ? (
                <div className="bg-rose-50 border border-rose-300 px-3 py-1.5 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Target Belum Tercapai ({visitCount}/2 Kunjungan)</span>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Target Terpenuhi ({visitCount} Kunjungan)</span>
                </div>
              )}

              <button
                onClick={() => setIsAddingKunjungan(true)}
                className="px-3.5 py-2 rounded-xl bg-[#1F3A5F] hover:bg-[#2B4E7E] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#E0C068]" />
                <span>Catat Kunjungan Baru</span>
              </button>
            </div>
          </div>

          {/* List of Visits */}
          {inst11.kunjunganList.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2">
              <Footprints className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600 font-medium">
                Belum ada log kunjungan singkat untuk {currentGuru.nama}.
              </p>
              <button
                onClick={() => setIsAddingKunjungan(true)}
                className="px-3 py-1.5 rounded-lg bg-[#1F3A5F] text-white text-xs font-bold"
              >
                Catat Kunjungan Pertama (10–15 Menit)
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {inst11.kunjunganList.map((log, idx) => (
                <div
                  key={log.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#1F3A5F] text-[#E0C068] font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        Kunjungan Singkat ke-{idx + 1}
                      </span>
                      <span className="text-slate-500 font-medium">
                        • {formatDateIndo(log.tanggal)} (Durasi: {log.durasiMenit} Menit)
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteKunjungan(log.id)}
                      className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-700 block">Fokus yang Diamati:</span>
                      <p className="text-slate-800 leading-relaxed">{log.fokusDiamati}</p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-700 block">Umpan Balik Singkat Supervisor:</span>
                      <p className="text-slate-800 leading-relaxed italic">&ldquo;{log.umpanBalikSingkat}&rdquo;</p>
                    </div>
                  </div>

                  {log.tindakLanjutTambahan && (
                    <div className="text-[11px] text-slate-600 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200">
                      <strong>Tindak Lanjut Tambahan:</strong> {log.tindakLanjutTambahan}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: INSTRUMEN 12 JURNAL REFLEKSI GURU & BALASAN KAMAD */}
      {activeSubTab === 'inst12' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
                Refleksi Mandiri Dua Mingguan
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Instrumen 12: Jurnal Refleksi Berkala Guru & Respon Kepala Madrasah
              </h2>
              <p className="text-xs text-slate-500">
                Guru menjawab 4 pertanyaan tetap. Kepala Madrasah wajib memberikan balasan penguatan dalam tempo maksimal <strong>3 hari kerja</strong>.
              </p>
            </div>

            <button
              onClick={() => setIsAddingJurnal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#1F3A5F] hover:bg-[#2B4E7E] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-center"
            >
              <Plus className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Kirim Entri Jurnal Guru</span>
            </button>
          </div>

          {inst12.entries.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2 text-xs text-slate-500">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <div>Belum ada entri jurnal refleksi dari {currentGuru.nama}.</div>
            </div>
          ) : (
            <div className="space-y-6">
              {inst12.entries.map((entry) => {
                const isPending = entry.statusBalasan === 'menunggu';

                return (
                  <div
                    key={entry.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">
                          Refleksi Guru: {entry.mingguKe}
                        </span>
                        <span className="text-slate-500 ml-2">
                          (Dikirim: {formatDateIndo(entry.tanggalKirim)})
                        </span>
                      </div>

                      <div>
                        {isPending ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-700" /> Menunggu Balasan Kamad (Maks 3 Hari)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Dibalas pada {formatDateIndo(entry.tanggalBalasan)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 4 Pertanyaan Tetap */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-[#1F3A5F] block">1. Keberhasilan apa yang dialami dua pekan ini?</span>
                        <p className="text-slate-800 leading-relaxed">{entry.q1_keberhasilan}</p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-[#1F3A5F] block">2. Tantangan / kendala apa yang dihadapi?</span>
                        <p className="text-slate-800 leading-relaxed">{entry.q2_tantangan}</p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-[#1F3A5F] block">3. Solusi alternatif apa yang telah dicoba?</span>
                        <p className="text-slate-800 leading-relaxed">{entry.q3_solusi}</p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-[#1F3A5F] block">4. Rencana perbaikan dua pekan ke depan?</span>
                        <p className="text-slate-800 leading-relaxed">{entry.q4_rencanaBerikut}</p>
                      </div>
                    </div>

                    {/* Respon Balasan Kepala Madrasah */}
                    <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-950 flex items-center gap-1.5">
                          <MessageCircle className="w-4 h-4 text-blue-700" />
                          Respon & Penguatan Kepala Madrasah:
                        </span>
                        <span className="text-[10px] text-blue-800">Tenggat Regulasi: 3 Hari Kerja</span>
                      </div>

                      {entry.balasanKamad ? (
                        <div className="bg-white p-3 rounded-lg border border-blue-200 text-slate-800 leading-relaxed italic">
                          &ldquo;{entry.balasanKamad}&rdquo;
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            placeholder="Tuliskan umpan balik suportif, apresiasi atas usaha guru, dan bantuan yang siap diberikan..."
                            value={replyDrafts[entry.id] ?? ''}
                            onChange={e => setReplyDrafts({ ...replyDrafts, [entry.id]: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-1 focus:ring-[#1F3A5F]"
                          />
                          <button
                            onClick={() => handleSaveBalasanKamad(entry.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#1F3A5F] text-white font-bold text-xs hover:bg-[#2B4E7E] transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 text-[#E0C068]" />
                            <span>Kirim Balasan Kepala Madrasah</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL: Tambah RTL */}
      {isAddingRtl && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-[#1F3A5F]">
                Tambah Butir Rencana Tindak Lanjut (RTL) Madrasah
              </h3>
              <button onClick={() => setIsAddingRtl(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddRtl} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Guru Sasaran</label>
                <select
                  value={newRtlItem.guruId}
                  onChange={e => {
                    const g = state.gurus.find(x => x.id === e.target.value);
                    setNewRtlItem({
                      ...newRtlItem,
                      guruId: e.target.value,
                      guruNama: g ? g.nama : ''
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {state.gurus.map(g => (
                    <option key={g.id} value={g.id}>{g.nama} ({g.mapel})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Kebutuhan Dukungan</label>
                <select
                  value={newRtlItem.kategori}
                  onChange={e => setNewRtlItem({ ...newRtlItem, kategori: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Pelatihan">Pelatihan / Workshop</option>
                  <option value="Fasilitas & Media">Fasilitas & Media Belajar</option>
                  <option value="MGMP & Rekan Sejawat">MGMP & Pendampingan Rekan Sejawat</option>
                  <option value="Kebijakan Madrasah">Kebijakan Madrasah / Kurikulum</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Komitmen Asal Guru (Instrumen 9)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penerapan diferensiasi proses dan produk Canva..."
                  value={newRtlItem.komitmenAsal}
                  onChange={e => setNewRtlItem({ ...newRtlItem, komitmenAsal: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bentuk Dukungan Konkret dari Madrasah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penyediaan kuota lab komputer dan pendampingan guru TIK..."
                  value={newRtlItem.bentukDukungan}
                  onChange={e => setNewRtlItem({ ...newRtlItem, bentukDukungan: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Penanggung Jawab</label>
                  <input
                    type="text"
                    value={newRtlItem.penanggungJawab}
                    onChange={e => setNewRtlItem({ ...newRtlItem, penanggungJawab: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu Pelaksanaan</label>
                  <input
                    type="text"
                    placeholder="Contoh: 15–30 Jan 2027"
                    value={newRtlItem.waktuPelaksanaan}
                    onChange={e => setNewRtlItem({ ...newRtlItem, waktuPelaksanaan: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bukti Keberhasilan</label>
                <input
                  type="text"
                  placeholder="Contoh: Karya poster siswa terkumpul di Google Drive madrasah..."
                  value={newRtlItem.buktiKeberhasilan}
                  onChange={e => setNewRtlItem({ ...newRtlItem, buktiKeberhasilan: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingRtl(false)}
                  className="px-3 py-2 border rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1F3A5F] text-white font-bold rounded-lg hover:bg-[#2B4E7E]"
                >
                  Simpan RTL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tambah Kunjungan Monitoring */}
      {isAddingKunjungan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-[#1F3A5F]">
                Catat Kunjungan Singkat Monitoring (10–15 Menit)
              </h3>
              <button onClick={() => setIsAddingKunjungan(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddKunjungan} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Kunjungan</label>
                  <input
                    type="date"
                    required
                    value={newKunjungan.tanggal}
                    onChange={e => setNewKunjungan({ ...newKunjungan, tanggal: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Durasi Kunjungan</label>
                  <select
                    value={newKunjungan.durasiMenit}
                    onChange={e => setNewKunjungan({ ...newKunjungan, durasiMenit: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value={10}>10 Menit</option>
                    <option value={15}>15 Menit</option>
                    <option value={20}>20 Menit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fokus yang Diamati</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Penerapan kartu peran kelompok dan pembagian tugas Canva..."
                  value={newKunjungan.fokusDiamati}
                  onChange={e => setNewKunjungan({ ...newKunjungan, fokusDiamati: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Umpan Balik Singkat Supervisor</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Pengelolaan waktu kelompok sudah rapi, siswa antusias..."
                  value={newKunjungan.umpanBalikSingkat}
                  onChange={e => setNewKunjungan({ ...newKunjungan, umpanBalikSingkat: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Tindak Lanjut Tambahan</label>
                <input
                  type="text"
                  placeholder="Contoh: Siapkan pameran galeri karya pekan depan..."
                  value={newKunjungan.tindakLanjutTambahan}
                  onChange={e => setNewKunjungan({ ...newKunjungan, tindakLanjutTambahan: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingKunjungan(false)}
                  className="px-3 py-2 border rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1F3A5F] text-white font-bold rounded-lg hover:bg-[#2B4E7E]"
                >
                  Simpan Log Kunjungan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tambah Jurnal Refleksi Guru */}
      {isAddingJurnal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-[#1F3A5F]">
                Formulir Jurnal Refleksi Dua Mingguan Guru
              </h3>
              <button onClick={() => setIsAddingJurnal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddJurnal} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Periode Minggu Ke</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Minggu ke-1 Februari"
                    value={newJurnal.mingguKe}
                    onChange={e => setNewJurnal({ ...newJurnal, mingguKe: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Kirim</label>
                  <input
                    type="date"
                    required
                    value={newJurnal.tanggalKirim}
                    onChange={e => setNewJurnal({ ...newJurnal, tanggalKirim: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">1. Keberhasilan apa yang dialami?</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ceritakan momen berhasil yang memuaskan..."
                  value={newJurnal.q1_keberhasilan}
                  onChange={e => setNewJurnal({ ...newJurnal, q1_keberhasilan: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">2. Tantangan / kendala apa yang dihadapi?</label>
                <textarea
                  rows={2}
                  placeholder="Hambatan yang ditemui saat menerapkan komitmen..."
                  value={newJurnal.q2_tantangan}
                  onChange={e => setNewJurnal({ ...newJurnal, q2_tantangan: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">3. Solusi alternatif apa yang dicoba?</label>
                <textarea
                  rows={2}
                  placeholder="Langkah penyesuaian yang diambil..."
                  value={newJurnal.q3_solusi}
                  onChange={e => setNewJurnal({ ...newJurnal, q3_solusi: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">4. Rencana perbaikan dua pekan ke depan?</label>
                <textarea
                  rows={2}
                  placeholder="Target fokus perbaikan berikutnya..."
                  value={newJurnal.q4_rencanaBerikut}
                  onChange={e => setNewJurnal({ ...newJurnal, q4_rencanaBerikut: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingJurnal(false)}
                  className="px-3 py-2 border rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1F3A5F] text-white font-bold rounded-lg hover:bg-[#2B4E7E]"
                >
                  Kirim Jurnal Refleksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
