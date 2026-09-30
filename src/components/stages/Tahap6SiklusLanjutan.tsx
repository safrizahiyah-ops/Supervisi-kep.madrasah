import React, { useState } from 'react';
import { 
  FileText, 
  TrendingUp, 
  Award, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  Edit2,
  PieChart,
  HelpCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { AppState, Instrument13_SupervisiUlang, Instrument14_RekapPerkembangan, Instrument15_EvaluasiMakro, PerkembanganPerGuru } from '../../types';
import { DEFAULT_RUBRIK_6_CIRI } from '../../data/initialData';
import { formatDateIndo } from '../../utils/formatters';

interface Tahap6Props {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
  selectedGuruId: string;
  onSelectGuru: (id: string) => void;
}

export const Tahap6SiklusLanjutan: React.FC<Tahap6Props> = ({
  state,
  onUpdateState,
  selectedGuruId,
  onSelectGuru
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inst13' | 'inst14' | 'inst15'>('inst13');
  const [saveToast, setSaveToast] = useState(false);

  const currentGuru = state.gurus.find(g => g.id === selectedGuruId) || state.gurus[0];
  const jadwal = currentGuru ? state.jadwals[currentGuru.id] : undefined;
  const inst6Awal = currentGuru ? state.instrument6[currentGuru.id] : undefined;

  // Instrumen 13 State
  const rawInst13 = currentGuru ? state.instrument13[currentGuru.id] : undefined;
  const inst13: Instrument13_SupervisiUlang = rawInst13 || {
    guruId: currentGuru?.id || '',
    tanggalSupervisiUlang: jadwal?.tanggalSupervisiUlang || '2027-03-08',
    evidence: {
      guruId: currentGuru?.id || '',
      tanggalObservasi: jadwal?.tanggalSupervisiUlang || '2027-03-08',
      mapelMateri: `${currentGuru?.mapel || ''} / Supervisi Ulang`,
      catatanList: [],
      totalMenitGuruBicara: 20,
      totalMenitSiswaAktif: 60,
      perkiraanSiswaTerlibat: 95,
      suasanaKelas: 'Sangat kondusif dan partisipatif',
      status: 'sedang'
    },
    observasiTerstruktur: {
      guruId: currentGuru?.id || '',
      tanggalObservasi: jadwal?.tanggalSupervisiUlang || '2027-03-08',
      rubrik: DEFAULT_RUBRIK_6_CIRI.map(c => ({
        ...c,
        skor: 4,
        rujukanCatatanWaktu: '08:15, 08:35',
        catatanSupervisor: 'Peningkatan signifikan'
      })),
      skorTotal: 24,
      status: 'sedang',
      catatanRangkuman: ''
    },
    status: 'sedang'
  };

  // Instrumen 14 State
  const inst14: Instrument14_RekapPerkembangan = state.instrument14;

  // Instrumen 15 State
  const inst15: Instrument15_EvaluasiMakro = state.instrument15;

  const showToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const saveInst13 = (data: Instrument13_SupervisiUlang) => {
    const total = data.observasiTerstruktur.rubrik.reduce((acc, curr) => acc + (curr.skor || 0), 0);
    const updated = {
      ...data,
      observasiTerstruktur: {
        ...data.observasiTerstruktur,
        skorTotal: total,
        status: 'selesai' as const
      },
      status: 'selesai' as const
    };

    // Auto-update Instrument 14 for this teacher!
    const skorAwal = state.instrument6[currentGuru.id]?.skorTotal || 18;
    const skorUlang = total;
    const diff = skorUlang - skorAwal;
    let kat: 'Berkembang' | 'Stabil' | 'Perlu Pendampingan Intensif' = 'Stabil';
    if (diff >= 3) kat = 'Berkembang';
    else if (diff < 0 || total < 12) kat = 'Perlu Pendampingan Intensif';

    const existingIdx = inst14.rekapList.findIndex(r => r.guruId === currentGuru.id);
    let newRekapList = [...inst14.rekapList];
    const newEntry: PerkembanganPerGuru = {
      guruId: currentGuru.id,
      namaGuru: currentGuru.nama,
      skorAwal,
      skorUlang,
      selisih: diff,
      kategori: kat,
      ciriPalingBerkembang: 'Berdiferensiasi & Berpusat pada Siswa',
      buktiKonkret: 'Peningkatan proporsi aktivitas siswa dan penerapan rubrik asesmen formatif otentik',
      fokusSiklusBerikut: 'Pengembangan proyek KBM terpadu (P5-PPRA)'
    };

    if (existingIdx >= 0) {
      newRekapList[existingIdx] = { ...newRekapList[existingIdx], skorAwal, skorUlang, selisih: diff, kategori: kat };
    } else {
      newRekapList.push(newEntry);
    }

    onUpdateState({
      ...state,
      instrument13: {
        ...state.instrument13,
        [currentGuru.id]: updated
      },
      instrument14: {
        ...inst14,
        rekapList: newRekapList,
        status: 'selesai'
      }
    });
    showToast();
  };

  const handleUpdateRubrikUlangSkor = (rubrikId: string, skor: number) => {
    const updatedRubrik = inst13.observasiTerstruktur.rubrik.map(r => r.id === rubrikId ? { ...r, skor } : r);
    saveInst13({
      ...inst13,
      observasiTerstruktur: {
        ...inst13.observasiTerstruktur,
        rubrik: updatedRubrik
      }
    });
  };

  const handleUpdateDimensiSkor = (dimensiId: string, nilaiSkala: number) => {
    const nextDim = inst15.dimensiList.map(d => d.id === dimensiId ? { ...d, nilaiSkala } : d);
    onUpdateState({
      ...state,
      instrument15: {
        ...inst15,
        dimensiList: nextDim
      }
    });
    showToast();
  };

  const handleUpdateDimensiTemuan = (dimensiId: string, temuanUtama: string) => {
    const nextDim = inst15.dimensiList.map(d => d.id === dimensiId ? { ...d, temuanUtama } : d);
    onUpdateState({
      ...state,
      instrument15: {
        ...inst15,
        dimensiList: nextDim
      }
    });
  };

  // Simplified instruments list
  const [newSimpText, setNewSimpText] = useState('');
  const handleAddSimplified = () => {
    if (!newSimpText.trim()) return;
    onUpdateState({
      ...state,
      instrument15: {
        ...inst15,
        daftarInstrumenDisederhanakan: [...inst15.daftarInstrumenDisederhanakan, newSimpText.trim()]
      }
    });
    setNewSimpText('');
    showToast();
  };

  const handleRemoveSimplified = (idx: number) => {
    onUpdateState({
      ...state,
      instrument15: {
        ...inst15,
        daftarInstrumenDisederhanakan: inst15.daftarInstrumenDisederhanakan.filter((_, i) => i !== idx)
      }
    });
    showToast();
  };

  if (!currentGuru) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
        Belum ada data guru. Silakan tambahkan guru di Tahap 1.
      </div>
    );
  }

  const skorAwal = inst6Awal?.skorTotal || 0;
  const skorUlang = inst13.observasiTerstruktur.skorTotal || 0;
  const selisihTotal = skorUlang - skorAwal;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Tahap 6 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#1F3A5F] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                Tahap 6
              </span>
              <span className="text-xs text-slate-500 font-semibold">1 – 31 Maret 2027</span>
            </div>
            <h1 className="text-xl font-bold text-[#1F3A5F] mt-1">
              Tahap 6: Siklus Lanjutan, Rekap Perkembangan & Evaluasi Makro
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Mengukur lonjakan kemajuan guru melalui supervisi ulang, pemetaan kategori perkembangan otomatis, dan evaluasi makro madrasah.
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
            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
              Skor Awal: {skorAwal}/24
            </span>
            <span className="text-slate-400">➔</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              Skor Ulang: {skorUlang}/24
            </span>
            <span className={`px-2 py-0.5 rounded font-black ${selisihTotal >= 0 ? 'text-emerald-800 bg-emerald-100' : 'text-red-800 bg-red-100'}`}>
              {selisihTotal >= 0 ? `+${selisihTotal}` : selisihTotal} Poin
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('inst13')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'inst13'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Inst. 13: Supervisi Ulang & Grafik</span>
            </button>
            <button
              onClick={() => setActiveSubTab('inst14')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'inst14'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Inst. 14: Rekap Perkembangan Guru</span>
            </button>
            <button
              onClick={() => setActiveSubTab('inst15')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'inst15'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Inst. 15: Evaluasi Makro Madrasah</span>
            </button>
          </div>
        </div>
      </div>

      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F3A5F] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold border border-[#C9A227]">
          <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
          <span>Hasil evaluasi tersimpan ke database!</span>
        </div>
      )}

      {/* SUB-TAB 1: INSTRUMEN 13 SUPERVISI ULANG & GRAFIK PERBANDINGAN */}
      {activeSubTab === 'inst13' && (
        <div className="space-y-6">
          {/* Comparison Bar Chart (SVG) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
                  Visualisasi Perkembangan 6 Ciri Pembelajaran
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Grafik Perbandingan: Observasi I (Okt–Nov 2026) vs Observasi II (Maret 2027)
                </h2>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-blue-600 inline-block"></span>
                  <span className="text-slate-700">Observasi I</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#C9A227] inline-block"></span>
                  <span className="text-slate-700">Observasi II (Ulang)</span>
                </div>
              </div>
            </div>

            {/* Interactive Bar Chart for 6 Features */}
            <div className="space-y-4 pt-2">
              {DEFAULT_RUBRIK_6_CIRI.map((ciri, idx) => {
                const s1 = inst6Awal?.rubrik.find(r => r.id === ciri.id)?.skor || 3;
                const s2 = inst13.observasiTerstruktur.rubrik.find(r => r.id === ciri.id)?.skor || 4;
                const diff = s2 - s1;

                return (
                  <div key={ciri.id} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span>{ciri.namaCiri}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-700 font-mono">I: {s1}/4</span>
                        <span className="text-slate-400">➔</span>
                        <span className="text-amber-700 font-mono">II: {s2}/4</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          diff > 0 ? 'bg-emerald-100 text-emerald-800' :
                          diff === 0 ? 'bg-slate-100 text-slate-600' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {diff > 0 ? `+${diff}` : diff}
                        </span>
                      </div>
                    </div>

                    {/* Comparative Dual Bar */}
                    <div className="space-y-1">
                      {/* Bar 1: Obs 1 */}
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(s1 / 4) * 100}%` }}
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        />
                      </div>
                      {/* Bar 2: Obs 2 */}
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(s2 / 4) * 100}%` }}
                          className="h-full bg-[#C9A227] rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Skor Supervisi Ulang (Rubrik 6 Ciri) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Formulir Penilaian Rubrik Supervisi Ulang (Maret 2027)
                </h3>
                <p className="text-xs text-slate-500">
                  Gunakan standar rubrik yang identik dengan Instrumen 6 untuk menjaga validitas komparasi.
                </p>
              </div>

              <div className="bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs">
                Total: {skorUlang} / 24 Poin
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inst13.observasiTerstruktur.rubrik.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{r.namaCiri}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleUpdateRubrikUlangSkor(r.id, val)}
                          className={`w-7 h-7 rounded-lg font-bold text-xs cursor-pointer ${
                            r.skor === val
                              ? 'bg-[#1F3A5F] text-[#E0C068] ring-2 ring-[#C9A227]'
                              : 'bg-white border text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Rujukan waktu & bukti KBM kedua..."
                    value={r.rujukanCatatanWaktu}
                    onChange={e => {
                      const updated = inst13.observasiTerstruktur.rubrik.map(x => x.id === r.id ? { ...x, rujukanCatatanWaktu: e.target.value } : x);
                      saveInst13({ ...inst13, observasiTerstruktur: { ...inst13.observasiTerstruktur, rubrik: updated } });
                    }}
                    className="w-full px-2.5 py-1 border rounded bg-white text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INSTRUMEN 14 REKAP PERKEMBANGAN GURU (KLASIFIKASI OTOMATIS) */}
      {activeSubTab === 'inst14' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
                Akuntabilitas & Klasifikasi Kemajuan Guru
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Instrumen 14: Rekapitulasi Perkembangan Guru Madrasah
              </h2>
              <p className="text-xs text-slate-500">
                Kategori Otomatis: <strong>Berkembang</strong> (Naik ≥3 Poin) | <strong>Stabil</strong> (Selisih &lt;3) | <strong>Perlu Pendampingan Intensif</strong> (Turun atau Skor &lt;12).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1F3A5F] text-white font-semibold">
                <tr>
                  <th className="py-2.5 px-3 rounded-tl-lg">Guru</th>
                  <th className="py-2.5 px-3 text-center">Skor Okt-Nov</th>
                  <th className="py-2.5 px-3 text-center">Skor Maret</th>
                  <th className="py-2.5 px-3 text-center">Selisih</th>
                  <th className="py-2.5 px-3 text-center">Kategori Otomatis</th>
                  <th className="py-2.5 px-3">Ciri Paling Berkembang</th>
                  <th className="py-2.5 px-3">Bukti Konkret</th>
                  <th className="py-2.5 px-3 rounded-tr-lg">Fokus Siklus Berikutnya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 border border-slate-200">
                {inst14.rekapList.map((item) => (
                  <tr key={item.guruId} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {item.namaGuru}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                      {item.skorAwal}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700">
                      {item.skorUlang}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded font-black text-[11px] ${
                        item.selisih >= 3 ? 'bg-emerald-100 text-emerald-800' :
                        item.selisih >= 0 ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.selisih > 0 ? `+${item.selisih}` : item.selisih}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.kategori === 'Berkembang' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        item.kategori === 'Stabil' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                        'bg-rose-100 text-rose-900 border border-rose-300'
                      }`}>
                        {item.kategori === 'Berkembang' && '🚀 '}
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-xs text-slate-800 font-medium">
                      {item.ciriPalingBerkembang}
                    </td>
                    <td className="py-3 px-3 max-w-xs text-slate-600">
                      {item.buktiKonkret}
                    </td>
                    <td className="py-3 px-3 max-w-xs text-slate-600 italic">
                      {item.fokusSiklusBerikut}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: INSTRUMEN 15 EVALUASI MAKRO TINGKAT MADRASAH */}
      {activeSubTab === 'inst15' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
              Tinjauan Sistemik & Penjaminan Mutu
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Instrumen 15: Evaluasi Makro Program Supervisi Madrasah
            </h2>
            <p className="text-xs text-slate-500">
              Mengevaluasi 6 dimensi supervisi secara agregat tanpa nama guru, serta mengidentifikasi instrumen yang perlu disederhanakan untuk siklus depan.
            </p>
          </div>

          {/* 6 Macro Dimensions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#1F3A5F] uppercase tracking-wider">
              Enam Dimensi Evaluasi Makro Supervisi (Skala 1–5):
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inst15.dimensiList.map((dim) => (
                <div
                  key={dim.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{dim.namaDimensi}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleUpdateDimensiSkor(dim.id, val)}
                          className={`w-6 h-6 rounded-md font-bold text-[11px] transition cursor-pointer ${
                            dim.nilaiSkala === val
                              ? 'bg-[#1F3A5F] text-[#E0C068]'
                              : 'bg-white text-slate-600 border'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      Temuan Utama Madrasah:
                    </label>
                    <textarea
                      rows={2}
                      value={dim.temuanUtama}
                      onChange={e => handleUpdateDimensiTemuan(dim.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 border rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      Rencana Tindak Lanjut Siklus Tahun Depan:
                    </label>
                    <input
                      type="text"
                      value={dim.tindakLanjutSiklusDepan}
                      onChange={e => {
                        const nextDim = inst15.dimensiList.map(d => d.id === dim.id ? { ...d, tindakLanjutSiklusDepan: e.target.value } : d);
                        onUpdateState({ ...state, instrument15: { ...inst15, dimensiList: nextDim } });
                      }}
                      className="w-full px-2.5 py-1.5 border rounded-lg bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daftar Instrumen yang Disederhanakan */}
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Daftar Instrumen yang Diusulkan Disederhanakan untuk Siklus Berikutnya:
              </h3>
              <span className="text-[11px] text-amber-800">
                Anti-birokrasi / meringankan beban guru
              </span>
            </div>

            <div className="space-y-2">
              {inst15.daftarInstrumenDisederhanakan.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-white border border-amber-200 text-slate-800 font-medium">
                  <span>{item}</span>
                  <button onClick={() => handleRemoveSimplified(idx)} className="text-slate-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Usulan penyederhanaan format instrumen..."
                value={newSimpText}
                onChange={e => setNewSimpText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSimplified()}
                className="flex-1 px-3 py-1.5 border border-amber-300 rounded-lg bg-white"
              />
              <button
                onClick={handleAddSimplified}
                className="px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold"
              >
                Tambah Usulan
              </button>
            </div>
          </div>

          {/* Rekomendasi Umum Siklus Depan */}
          <div className="space-y-2 text-xs">
            <label className="font-bold text-slate-800 block">
              Rekomendasi Kebijakan & Komitmen Kepala Madrasah untuk Siklus Berikutnya:
            </label>
            <textarea
              rows={3}
              value={inst15.rekomendasiUmum}
              onChange={e => onUpdateState({ ...state, instrument15: { ...inst15, rekomendasiUmum: e.target.value } })}
              className="w-full p-3 border rounded-xl leading-relaxed focus:ring-1 focus:ring-[#1F3A5F]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
