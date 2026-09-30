import React, { useState } from 'react';
import { 
  CheckSquare, 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Plus, 
  Trash2,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { AppState, Guru, ButirCeklisGuru, JurnalSabtuKamad } from '../types';
import { formatDateIndo } from '../utils/formatters';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppState;
  onUpdateState: (newState: AppState) => void;
  selectedGuruId: string;
  onSelectGuru: (id: string) => void;
}

export const ChecklistModal: React.FC<ChecklistModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateState,
  selectedGuruId,
  onSelectGuru
}) => {
  const [activeTab, setActiveTab] = useState<'tahap' | 'pendampingan' | 'jurnalSabtu'>('tahap');
  const [selectedTahapId, setSelectedTahapId] = useState<number>(1);

  const currentGuru = state.gurus.find(g => g.id === selectedGuruId) || state.gurus[0];

  // Jurnal Sabtu Form
  const [newJurnalSabtu, setNewJurnalSabtu] = useState<Partial<JurnalSabtuKamad>>({
    tanggal: new Date().toISOString().slice(0, 10),
    mingguKe: (state.jurnalSabtu?.length || 0) + 1,
    q1_pencapaianMingguIni: '',
    q2_momenBermaknaDialog: '',
    q3_kendalaDanHambatan: '',
    q4_guruPerluDukunganKhusus: '',
    q5_fokusPrioritasMingguDepan: ''
  });
  const [isAddingJurnalSabtu, setIsAddingJurnalSabtu] = useState(false);

  if (!isOpen) return null;

  // Toggle stage checklist item
  const handleToggleTahapItem = (tahapId: number, itemId: string) => {
    const nextCeklisTahap = state.ceklisTahap.map(tahap => {
      if (tahap.tahapId === tahapId) {
        const nextItems = tahap.items.map(item => {
          if (item.id === itemId) {
            const nextDone = !item.selesai;
            return {
              ...item,
              selesai: nextDone,
              tanggalSelesai: nextDone ? new Date().toISOString().slice(0, 10) : undefined
            };
          }
          return item;
        });
        return { ...tahap, items: nextItems };
      }
      return tahap;
    });

    onUpdateState({
      ...state,
      ceklisTahap: nextCeklisTahap
    });
  };

  // Toggle teacher checklist item (Direncanakan vs Terlihat)
  const handleTogglePendampingan = (guruId: string, itemId: string, field: 'direncanakanGuru' | 'terlihatSupervisor') => {
    const rec = state.ceklisPendampingan[guruId];
    if (!rec) return;

    const nextItems = rec.items.map(it => {
      if (it.id === itemId) {
        return {
          ...it,
          [field]: !it[field]
        };
      }
      return it;
    });

    onUpdateState({
      ...state,
      ceklisPendampingan: {
        ...state.ceklisPendampingan,
        [guruId]: {
          ...rec,
          items: nextItems
        }
      }
    });
  };

  // Handle Add Jurnal Sabtu
  const handleAddJurnalSabtu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJurnalSabtu.q1_pencapaianMingguIni) return;

    const entry: JurnalSabtuKamad = {
      id: `sabtu_${Date.now()}`,
      tanggal: newJurnalSabtu.tanggal || new Date().toISOString().slice(0, 10),
      mingguKe: newJurnalSabtu.mingguKe || 1,
      q1_pencapaianMingguIni: newJurnalSabtu.q1_pencapaianMingguIni || '',
      q2_momenBermaknaDialog: newJurnalSabtu.q2_momenBermaknaDialog || '',
      q3_kendalaDanHambatan: newJurnalSabtu.q3_kendalaDanHambatan || '',
      q4_guruPerluDukunganKhusus: newJurnalSabtu.q4_guruPerluDukunganKhusus || '',
      q5_fokusPrioritasMingguDepan: newJurnalSabtu.q5_fokusPrioritasMingguDepan || ''
    };

    onUpdateState({
      ...state,
      jurnalSabtu: [entry, ...state.jurnalSabtu]
    });

    setIsAddingJurnalSabtu(false);
    setNewJurnalSabtu({
      tanggal: new Date().toISOString().slice(0, 10),
      mingguKe: (state.jurnalSabtu?.length || 0) + 2,
      q1_pencapaianMingguIni: '',
      q2_momenBermaknaDialog: '',
      q3_kendalaDanHambatan: '',
      q4_guruPerluDukunganKhusus: '',
      q5_fokusPrioritasMingguDepan: ''
    });
  };

  // Compute progress for current selected stage
  const curTahapObj = state.ceklisTahap.find(t => t.tahapId === selectedTahapId);
  const doneCount = curTahapObj?.items.filter(i => i.selesai).length || 0;
  const totalCount = curTahapObj?.items.length || 1;
  const stageProgress = Math.round((doneCount / totalCount) * 100);

  // Compute discrepancy count for current teacher
  const teacherChecklist = currentGuru ? state.ceklisPendampingan[currentGuru.id]?.items || [] : [];
  const discrepancyItems = teacherChecklist.filter(item => item.direncanakanGuru !== item.terlihatSupervisor);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-[#1F3A5F] text-white p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A227] text-[#1F3A5F] flex items-center justify-center font-bold shadow">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Ceklis Pelaksanaan & Jurnal Sabtu Kepala Madrasah
              </h2>
              <p className="text-xs text-slate-300">
                Memastikan tidak ada langkah penting yang terlewat sepanjang siklus 6 tahap.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-xs font-bold"
            >
              ✕ Tutup
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="bg-slate-100 px-6 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('tahap')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tahap'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>1. Ceklis 6 Tahap (10–12 Butir/Tahap)</span>
            </button>

            <button
              onClick={() => setActiveTab('pendampingan')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pendampingan'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>2. Ceklis Pendampingan Guru (7 Kelompok)</span>
            </button>

            <button
              onClick={() => setActiveTab('jurnalSabtu')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'jurnalSabtu'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>3. Jurnal Refleksi Sabtu Kamad ({state.jurnalSabtu.length})</span>
            </button>
          </div>

          {activeTab === 'pendampingan' && currentGuru && (
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border text-xs">
              <span className="text-slate-500 font-semibold">Guru:</span>
              <select
                value={currentGuru.id}
                onChange={e => onSelectGuru(e.target.value)}
                className="font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                {state.gurus.map(g => (
                  <option key={g.id} value={g.id}>{g.nama}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: CEKLIS 6 TAHAP */}
          {activeTab === 'tahap' && (
            <div className="space-y-5">
              {/* Stage Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                {state.ceklisTahap.map(t => {
                  const done = t.items.filter(i => i.selesai).length;
                  const pct = Math.round((done / t.items.length) * 100);
                  const isSelected = t.tahapId === selectedTahapId;

                  return (
                    <button
                      key={t.tahapId}
                      onClick={() => setSelectedTahapId(t.tahapId)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#1F3A5F] text-white border-[#C9A227] shadow'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="text-[10px] font-bold text-[#E0C068]">Tahap {t.tahapId}</div>
                        <div className="font-bold text-xs line-clamp-1">{t.namaTahap.split(':')[1]?.trim() || t.namaTahap}</div>
                      </div>
                      <div className="mt-2 text-[10px] font-semibold flex items-center justify-between">
                        <span>{done}/{t.items.length} selesai</span>
                        <span className={pct === 100 ? 'text-emerald-400' : ''}>{pct}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Stage Detail & Progress Bar */}
              {curTahapObj && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-[#1F3A5F]">
                        {curTahapObj.namaTahap}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Centang butir kegiatan begitu selesai dilaksanakan untuk merekam jejak audit supervisi.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-700">
                        Kemajuan: {doneCount} / {totalCount} Butir ({stageProgress}%)
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${stageProgress}%` }}
                      className="h-full bg-gradient-to-r from-[#1F3A5F] to-[#C9A227] rounded-full transition-all duration-300"
                    />
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2 pt-1 text-xs">
                    {curTahapObj.items.map((item) => (
                      <label
                        key={item.id}
                        className={`p-3 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition ${
                          item.selesai
                            ? 'bg-white border-emerald-200 text-slate-800 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={item.selesai}
                            onChange={() => handleToggleTahapItem(curTahapObj.tahapId, item.id)}
                            className="mt-0.5 rounded text-[#1F3A5F] w-4 h-4 cursor-pointer"
                          />
                          <div>
                            <span className={`font-semibold ${item.selesai ? 'text-slate-900 line-through decoration-emerald-500/50' : 'text-slate-800'}`}>
                              {item.nomor}. {item.kegiatan}
                            </span>
                          </div>
                        </div>

                        {item.selesai && item.tanggalSelesai && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono shrink-0">
                            ✓ {item.tanggalSelesai}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CEKLIS PENDAMPINGAN GURU (7 KELOMPOK & GAP GROW) */}
          {activeTab === 'pendampingan' && (
            <div className="space-y-5">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Bahan Utama Dialog Reflektif Coaching GROW:
                  </span>
                  <p className="text-amber-900 leading-relaxed text-[11px]">
                    Kolom <strong>Direncanakan Guru</strong> diisi saat Pra-Pelaksanaan (Tahap 2). Kolom <strong>Terlihat Supervisor</strong> diisi saat Observasi KBM (Tahap 3). Butir yang memiliki selisih (gap) otomatis disorot sebagai pemantik dialog <em>Reality</em> pada sesi coaching GROW!
                  </p>
                </div>
                {discrepancyItems.length > 0 && (
                  <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 font-bold text-xs shrink-0">
                    {discrepancyItems.length} Celah Selisih
                  </span>
                )}
              </div>

              {/* 7 Groups (A to G) */}
              <div className="space-y-6 text-xs">
                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((grp) => {
                  const grpItems = teacherChecklist.filter(i => i.kelompok === grp);
                  const grpName = grpItems[0]?.kelompokNama || `Kelompok ${grp}`;

                  return (
                    <div key={grp} className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="font-bold text-xs text-[#1F3A5F] uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#1F3A5F] text-[#E0C068] text-[10px] flex items-center justify-center font-bold">
                          {grp}
                        </span>
                        {grpName}
                      </h4>

                      <div className="space-y-2">
                        {grpItems.map(item => {
                          const isGap = item.direncanakanGuru !== item.terlihatSupervisor;

                          return (
                            <div
                              key={item.id}
                              className={`p-3 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                isGap
                                  ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-300/60'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="space-y-0.5 max-w-lg">
                                <span className="font-semibold text-slate-800">{item.deskripsi}</span>
                                {item.catatan && (
                                  <div className="text-[10px] text-amber-800 italic">
                                    Catatan: {item.catatan}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-4 shrink-0 text-xs">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={item.direncanakanGuru}
                                    onChange={() => handleTogglePendampingan(currentGuru.id, item.id, 'direncanakanGuru')}
                                    className="rounded text-blue-600"
                                  />
                                  <span className="text-[11px] text-blue-900 font-medium">Direncanakan (T2)</span>
                                </label>

                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={item.terlihatSupervisor}
                                    onChange={() => handleTogglePendampingan(currentGuru.id, item.id, 'terlihatSupervisor')}
                                    className="rounded text-emerald-600"
                                  />
                                  <span className="text-[11px] text-emerald-900 font-medium">Terlihat (T3)</span>
                                </label>

                                {isGap && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                                    ⚠️ Bahas di GROW
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: JURNAL SABTU KEPALA MADRASAH */}
          {activeTab === 'jurnalSabtu' && (
            <div className="space-y-5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Jurnal Refleksi Mingguan Kepala Madrasah (Setiap Sabtu)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    5 butir refleksi pekanan untuk mengevaluasi iklim supervisi, pencapaian dialog, dan guru yang butuh pendampingan khusus.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingJurnalSabtu(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#1F3A5F] hover:bg-[#2B4E7E] text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-center"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E0C068]" />
                  <span>Tulis Jurnal Sabtu Baru</span>
                </button>
              </div>

              {/* Form Input Modal / Collapsible */}
              {isAddingJurnalSabtu && (
                <form onSubmit={handleAddJurnalSabtu} className="bg-slate-50 p-5 rounded-2xl border border-slate-300 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-slate-800">Tulis Catatan Refleksi Sabtu Ini</span>
                    <button type="button" onClick={() => setIsAddingJurnalSabtu(false)} className="text-slate-400 font-bold">✕ Batal</button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tanggal (Hari Sabtu)</label>
                      <input
                        type="date"
                        required
                        value={newJurnalSabtu.tanggal}
                        onChange={e => setNewJurnalSabtu({ ...newJurnalSabtu, tanggal: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Pekan Supervisi Ke</label>
                      <input
                        type="number"
                        value={newJurnalSabtu.mingguKe}
                        onChange={e => setNewJurnalSabtu({ ...newJurnalSabtu, mingguKe: parseInt(e.target.value, 10) })}
                        className="w-full px-3 py-1.5 border rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">1. Pencapaian paling memuaskan minggu ini?</label>
                    <textarea
                      rows={2}
                      required
                      value={newJurnalSabtu.q1_pencapaianMingguIni}
                      onChange={e => setNewJurnalSabtu({ ...newJurnalSabtu, q1_pencapaianMingguIni: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">2. Momen dialog bermakna dengan guru yang membekas?</label>
                    <textarea
                      rows={2}
                      value={newJurnalSabtu.q2_momenBermaknaDialog}
                      onChange={e => setNewJurnalSabtu({ ...newJurnalSabtu, q2_momenBermaknaDialog: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">3. Kendala atau resistensi yang masih dirasakan?</label>
                    <textarea
                      rows={2}
                      value={newJurnalSabtu.q3_kendalaDanHambatan}
                      onChange={e => setNewJurnalSabtu({ ...newJurnalSabtu, q3_kendalaDanHambatan: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">4. Siapa guru yang memerlukan dukungan / afirmasi khusus pekan depan?</label>
                    <textarea
                      rows={2}
                      value={newJurnalSabtu.q4_guruPerluDukunganKhusus}
                      onChange={e => setNewJurnalSabtu({ ...newJurnalSabtu, q4_guruPerluDukunganKhusus: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">5. Apa satu fokus prioritas Kepala Madrasah untuk minggu depan?</label>
                    <textarea
                      rows={2}
                      value={newJurnalSabtu.q5_fokusPrioritasMingguDepan}
                      onChange={e => setNewJurnalSabtu({ ...newJurnalSabtu, q5_fokusPrioritasMingguDepan: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button type="submit" className="px-4 py-2 bg-[#1F3A5F] text-white font-bold rounded-lg hover:bg-[#2B4E7E]">
                      Simpan Catatan Sabtu
                    </button>
                  </div>
                </form>
              )}

              {/* History of Saturday Reflections */}
              <div className="space-y-4">
                {state.jurnalSabtu.map((js, idx) => (
                  <div key={js.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-bold text-[#1F3A5F] text-xs">
                        Pekan ke-{js.mingguKe} • {formatDateIndo(js.tanggal)}
                      </span>
                      <span className="text-[10px] text-slate-400">Sabtu Refleksi</span>
                    </div>

                    <div className="space-y-1.5 text-slate-800 leading-relaxed text-[11px]">
                      <p><strong>1. Pencapaian:</strong> {js.q1_pencapaianMingguIni}</p>
                      <p><strong>2. Momen Dialog:</strong> {js.q2_momenBermaknaDialog}</p>
                      <p><strong>3. Kendala:</strong> {js.q3_kendalaDanHambatan}</p>
                      <p><strong>4. Guru Butuh Dukungan:</strong> {js.q4_guruPerluDukunganKhusus}</p>
                      <p><strong>5. Fokus Prioritas Pekan Depan:</strong> {js.q5_fokusPrioritasMingguDepan}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
