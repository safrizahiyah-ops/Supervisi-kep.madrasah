import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Save, 
  Download,
  AlertTriangle,
  Clock,
  Edit2
} from 'lucide-react';
import { AppState, Guru, JadwalGuru, Instrument1_Program } from '../../types';
import { formatDateIndo, detectScheduleConflicts } from '../../utils/formatters';

interface Tahap1Props {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
  onSelectGuru: (guruId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const Tahap1Persiapan: React.FC<Tahap1Props> = ({
  state,
  onUpdateState,
  onSelectGuru,
  onNavigateTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inst1' | 'inst2'>('inst1');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state for Instrument 1
  const [inst1, setInst1] = useState<Instrument1_Program>(state.instrument1);

  // New Guru Modal / Add form
  const [isAddingGuru, setIsAddingGuru] = useState(false);
  const [newGuru, setNewGuru] = useState<Partial<Guru>>({
    nama: '',
    nip: '',
    mapel: '',
    kelas: '',
    fokusPengembangan: '',
    supervisorId: state.settings.supervisors[0]?.id || 'sup_1',
    supervisorNama: state.settings.supervisors[0]?.nama || 'Kepala Madrasah'
  });
  const [newJadwal, setNewJadwal] = useState<JadwalGuru>({
    tanggalTelaah: '2026-10-20',
    tanggalObservasi: '2026-11-12',
    tanggalCoaching: '2026-11-16',
    tanggalSupervisiUlang: '2027-03-12',
    waktuObservasi: '08:00 - 09:20 (Jam 1-2)'
  });

  // Editing Guru Jadwal
  const [editingGuruId, setEditingGuruId] = useState<string | null>(null);
  const [editJadwalForm, setEditJadwalForm] = useState<JadwalGuru>({
    tanggalTelaah: '',
    tanggalObservasi: '',
    tanggalCoaching: '',
    tanggalSupervisiUlang: '',
    waktuObservasi: ''
  });

  const conflicts = detectScheduleConflicts(state.gurus, state.jadwals);

  const handleSaveInst1 = () => {
    onUpdateState({
      ...state,
      instrument1: {
        ...inst1,
        status: 'selesai',
        terakhirDiperbarui: new Date().toISOString().slice(0, 10)
      }
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddGuru = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuru.nama || !newGuru.mapel) {
      alert('Nama guru dan mata pelajaran wajib diisi!');
      return;
    }

    const id = `guru_${Date.now()}`;
    const sup = state.settings.supervisors.find(s => s.id === newGuru.supervisorId);
    const createdGuru: Guru = {
      id,
      nama: newGuru.nama || '',
      nip: newGuru.nip || '-',
      mapel: newGuru.mapel || '',
      kelas: newGuru.kelas || 'Kelas VII',
      fokusPengembangan: newGuru.fokusPengembangan || 'Peningkatan pelibatan aktif siswa',
      supervisorId: newGuru.supervisorId || 'sup_1',
      supervisorNama: sup ? sup.nama : 'Kepala Madrasah'
    };

    onUpdateState({
      ...state,
      gurus: [...state.gurus, createdGuru],
      jadwals: {
        ...state.jadwals,
        [id]: newJadwal
      }
    });

    setIsAddingGuru(false);
    setNewGuru({
      nama: '',
      nip: '',
      mapel: '',
      kelas: '',
      fokusPengembangan: '',
      supervisorId: state.settings.supervisors[0]?.id || 'sup_1',
      supervisorNama: state.settings.supervisors[0]?.nama || 'Kepala Madrasah'
    });
  };

  const handleDeleteGuru = (id: string, nama: string) => {
    if (confirm(`Hapus data guru ${nama} beserta jadwalnya?`)) {
      const nextGurus = state.gurus.filter(g => g.id !== id);
      const nextJadwals = { ...state.jadwals };
      delete nextJadwals[id];
      onUpdateState({
        ...state,
        gurus: nextGurus,
        jadwals: nextJadwals
      });
    }
  };

  const handleOpenEditJadwal = (guru: Guru) => {
    setEditingGuruId(guru.id);
    const j = state.jadwals[guru.id] || {
      tanggalTelaah: '',
      tanggalObservasi: '',
      tanggalCoaching: '',
      tanggalSupervisiUlang: '',
      waktuObservasi: ''
    };
    setEditJadwalForm(j);
  };

  const handleSaveEditJadwal = () => {
    if (!editingGuruId) return;
    onUpdateState({
      ...state,
      jadwals: {
        ...state.jadwals,
        [editingGuruId]: editJadwalForm
      }
    });
    setEditingGuruId(null);
  };

  const handleExportJadwalCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'No,Nama Guru,NIP,Mata Pelajaran,Kelas,Supervisor,Tanggal Telaah,Tanggal Observasi,Waktu KBM,Tanggal Coaching,Supervisi Ulang\n';
    
    state.gurus.forEach((g, i) => {
      const j = state.jadwals[g.id] || { tanggalTelaah: '', tanggalObservasi: '', waktuObservasi: '', tanggalCoaching: '', tanggalSupervisiUlang: '' };
      const row = [
        i + 1,
        `"${g.nama}"`,
        `"${g.nip}"`,
        `"${g.mapel}"`,
        `"${g.kelas}"`,
        `"${g.supervisorNama}"`,
        `"${j.tanggalTelaah}"`,
        `"${j.tanggalObservasi}"`,
        `"${j.waktuObservasi || ''}"`,
        `"${j.tanggalCoaching}"`,
        `"${j.tanggalSupervisiUlang}"`
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Jadwal_Supervisi_${state.settings.madrasahName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Tahap */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#1F3A5F] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                Tahap 1
              </span>
              <span className="text-xs text-slate-500 font-semibold">1 – 14 Oktober 2026</span>
            </div>
            <h1 className="text-xl font-bold text-[#1F3A5F] mt-1">
              Tahap 1: Persiapan Supervisi Akademik
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Pondasi keberhasilan supervisi: merumuskan program madrasah, menetapkan 6 fokus ciri pembelajaran, membentuk tim penilai, serta menyusun jadwal supervisi tanpa bentrok.
            </p>
          </div>

          {/* Sub-Tabs: Instrumen 1 vs Instrumen 2 */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-center border border-slate-200">
            <button
              onClick={() => setActiveSubTab('inst1')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'inst1'
                  ? 'bg-[#1F3A5F] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Instrumen 1: Program Supervisi</span>
            </button>
            <button
              onClick={() => setActiveSubTab('inst2')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'inst2'
                  ? 'bg-[#1F3A5F] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Instrumen 2: Jadwal Supervisi ({state.gurus.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: INSTRUMEN 1 PROGRAM SUPERVISI */}
      {activeSubTab === 'inst1' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
                Dokumen Resmi Tingkat Madrasah
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Instrumen 1: Program Supervisi Akademik Madrasah
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {saveSuccess && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" /> Tersimpan!
                </span>
              )}
              <button
                onClick={handleSaveInst1}
                className="px-4 py-2 rounded-xl bg-[#1F3A5F] hover:bg-[#2B4E7E] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Save className="w-3.5 h-3.5 text-[#E0C068]" />
                <span>Simpan Dokumen Program</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Madrasah
              </label>
              <input
                type="text"
                value={inst1.madrasahName}
                onChange={e => setInst1({ ...inst1, madrasahName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1F3A5F] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tahun Pelajaran
                </label>
                <input
                  type="text"
                  value={inst1.tahunPelajaran}
                  onChange={e => setInst1({ ...inst1, tahunPelajaran: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1F3A5F] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Semester
                </label>
                <input
                  type="text"
                  value={inst1.semester}
                  onChange={e => setInst1({ ...inst1, semester: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1F3A5F] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Tujuan & Sasaran */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tujuan Supervisi Akademik
              </label>
              <textarea
                rows={3}
                value={inst1.tujuan}
                onChange={e => setInst1({ ...inst1, tujuan: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1F3A5F] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sasaran Program (Target Guru & Kelas)
              </label>
              <textarea
                rows={3}
                value={inst1.sasaran}
                onChange={e => setInst1({ ...inst1, sasaran: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1F3A5F] focus:outline-none"
              />
            </div>
          </div>

          {/* Fokus Siklus: 6 Ciri Pembelajaran */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1F3A5F] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
                Fokus Siklus: 6 Ciri Pembelajaran yang Dikuatkan
              </label>
              <span className="text-[11px] text-slate-500">Buku Manual Pegangan Supervisi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                { key: 'bermakna', label: '1. Pembelajaran Bermakna', desc: 'Kontekstual, studi kasus nyata, adab islami' },
                { key: 'inovatif', label: '2. Pembelajaran Inovatif', desc: 'Metode adaptif, integrasi media & ragam sumber' },
                { key: 'berdiferensiasi', label: '3. Berdiferensiasi', desc: 'Mengakomodasi kesiapan, minat & profil belajar' },
                { key: 'berpusatSiswa', label: '4. Berpusat pada Siswa', desc: 'Siswa aktif bernalar & proporsi aktif >60%' },
                { key: 'reflektif', label: '5. Pembelajaran Reflektif', desc: 'Jeda perenungan pemahaman & tiket keluar' },
                { key: 'asesmenAutentik', label: '6. Asesmen Autentik', desc: 'Asesmen formatif & umpan balik deskriptif' },
              ].map(ciri => (
                <label
                  key={ciri.key}
                  className={`p-3 rounded-lg border flex items-start gap-2.5 cursor-pointer transition ${
                    inst1.fokusSiklusCiri[ciri.key as keyof typeof inst1.fokusSiklusCiri]
                      ? 'bg-white border-[#C9A227] shadow-xs'
                      : 'bg-slate-100/60 border-slate-200 opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={inst1.fokusSiklusCiri[ciri.key as keyof typeof inst1.fokusSiklusCiri]}
                    onChange={e => {
                      setInst1({
                        ...inst1,
                        fokusSiklusCiri: {
                          ...inst1.fokusSiklusCiri,
                          [ciri.key]: e.target.checked
                        }
                      });
                    }}
                    className="mt-0.5 rounded text-[#1F3A5F] focus:ring-[#1F3A5F]"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-900">{ciri.label}</div>
                    <div className="text-[11px] text-slate-500">{ciri.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mt-2 mb-1">
                Catatan Penekanan Khusus Siklus Ini:
              </label>
              <textarea
                rows={2}
                value={inst1.catatanFokus}
                onChange={e => setInst1({ ...inst1, catatanFokus: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1F3A5F] focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Tim Supervisor & Indikator Keberhasilan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#1F3A5F]" />
                  Tim Supervisor Madrasah
                </h3>
              </div>
              <div className="space-y-2">
                {inst1.timSupervisor.map((sup, idx) => (
                  <div key={sup.id} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{sup.nama}</div>
                      <div className="text-[11px] text-slate-500">{sup.jabatan}</div>
                    </div>
                    <span className="text-[10px] bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded">
                      {sup.jumlahGuruBinaan} Guru Binaan
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Indikator Keberhasilan Siklus
                </h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {inst1.indikatorKeberhasilan.map((ind, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-[11px] leading-relaxed">{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INSTRUMEN 2 JADWAL SUPERVISI */}
      {activeSubTab === 'inst2' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
                Perencanaan Waktu KBM & Refleksi
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Instrumen 2: Jadwal Supervisi Akademik Guru
              </h2>
              <p className="text-xs text-slate-500">
                Setiap guru memiliki 3 tanggal utama: Tanggal Telaah, Tanggal Observasi, dan Tanggal Coaching (serta jadwal Supervisi Ulang di Siklus Maret).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportJadwalCsv}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 border border-slate-200"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Ekspor Jadwal (CSV)</span>
              </button>
              <button
                onClick={() => setIsAddingGuru(true)}
                className="px-3 py-2 rounded-xl bg-[#1F3A5F] hover:bg-[#2B4E7E] text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#E0C068]" />
                <span>Tambah Guru & Jadwal</span>
              </button>
            </div>
          </div>

          {/* Schedule Conflict Alert Box */}
          {conflicts.length > 0 ? (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Deteksi Potensi Bentrok Jadwal Observasi ({conflicts.length})
              </div>
              <div className="space-y-1">
                {conflicts.map((c, idx) => (
                  <div key={idx} className="text-xs text-amber-800 bg-white p-2.5 rounded-lg border border-amber-200">
                    {c.keterangan}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Semua jadwal observasi terdistribusi baik, tidak ada bentrok tanggal yang tumpang tindih.</span>
            </div>
          )}

          {/* Table of Teachers and Schedules */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1F3A5F] text-white font-semibold">
                <tr>
                  <th className="py-2.5 px-3 rounded-tl-lg">No</th>
                  <th className="py-2.5 px-3">Guru & Mapel</th>
                  <th className="py-2.5 px-3">Supervisor</th>
                  <th className="py-2.5 px-3">1. Tgl Telaah</th>
                  <th className="py-2.5 px-3">2. Tgl Observasi</th>
                  <th className="py-2.5 px-3">3. Tgl Coaching</th>
                  <th className="py-2.5 px-3">Supervisi Ulang</th>
                  <th className="py-2.5 px-3 text-center rounded-tr-lg">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 border border-slate-200">
                {state.gurus.map((guru, index) => {
                  const j = state.jadwals[guru.id] || {
                    tanggalTelaah: '-',
                    tanggalObservasi: '-',
                    tanggalCoaching: '-',
                    tanggalSupervisiUlang: '-',
                    waktuObservasi: ''
                  };

                  return (
                    <tr key={guru.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 text-slate-400 font-mono">{index + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{guru.nama}</div>
                        <div className="text-[11px] text-slate-500">
                          {guru.mapel} • {guru.kelas}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          NIP: {guru.nip}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {guru.supervisorNama}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {formatDateIndo(j.tanggalTelaah)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {formatDateIndo(j.tanggalObservasi)}
                          </span>
                          {j.waktuObservasi && (
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {j.waktuObservasi}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          {formatDateIndo(j.tanggalCoaching)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {formatDateIndo(j.tanggalSupervisiUlang)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditJadwal(guru)}
                            title="Ubah Jadwal"
                            className="p-1.5 rounded hover:bg-slate-100 text-blue-600 transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGuru(guru.id, guru.nama)}
                            title="Hapus Guru"
                            className="p-1.5 rounded hover:bg-red-50 text-red-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Tambah Guru Baru */}
      {isAddingGuru && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-[#1F3A5F]">
                Tambah Guru & Jadwal Supervisi
              </h3>
              <button
                onClick={() => setIsAddingGuru(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGuru} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Guru (dengan Gelar)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ustadz M. Farhan, M.Pd"
                  value={newGuru.nama}
                  onChange={e => setNewGuru({ ...newGuru, nama: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F3A5F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIP</label>
                  <input
                    type="text"
                    placeholder="19800101..."
                    value={newGuru.nip}
                    onChange={e => setNewGuru({ ...newGuru, nip: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Akidah Akhlak"
                    value={newGuru.mapel}
                    onChange={e => setNewGuru({ ...newGuru, mapel: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas yang Diajar</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kelas VIII-B"
                    value={newGuru.kelas}
                    onChange={e => setNewGuru({ ...newGuru, kelas: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Supervisor yang Ditugaskan</label>
                  <select
                    value={newGuru.supervisorId}
                    onChange={e => {
                      const sup = state.settings.supervisors.find(s => s.id === e.target.value);
                      setNewGuru({
                        ...newGuru,
                        supervisorId: e.target.value,
                        supervisorNama: sup ? sup.nama : 'Kepala Madrasah'
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {state.settings.supervisors.map(s => (
                      <option key={s.id} value={s.id}>{s.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fokus Pengembangan Pribadi</label>
                <input
                  type="text"
                  placeholder="Contoh: Peningkatan diferensiasi & asesmen formatif"
                  value={newGuru.fokusPengembangan}
                  onChange={e => setNewGuru({ ...newGuru, fokusPengembangan: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* 3 Jadwal Utama */}
              <div className="bg-slate-50 p-3 rounded-xl border space-y-2 mt-2">
                <span className="font-bold text-[#1F3A5F] block">Penetapan 3 Tanggal Siklus</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">1. Tanggal Telaah RPP</label>
                    <input
                      type="date"
                      value={newJadwal.tanggalTelaah}
                      onChange={e => setNewJadwal({ ...newJadwal, tanggalTelaah: e.target.value })}
                      className="w-full px-2 py-1.5 border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">2. Tanggal Observasi KBM</label>
                    <input
                      type="date"
                      value={newJadwal.tanggalObservasi}
                      onChange={e => setNewJadwal({ ...newJadwal, tanggalObservasi: e.target.value })}
                      className="w-full px-2 py-1.5 border rounded bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Jam Observasi KBM</label>
                    <input
                      type="text"
                      placeholder="08:00 - 09:20 (Jam 1-2)"
                      value={newJadwal.waktuObservasi}
                      onChange={e => setNewJadwal({ ...newJadwal, waktuObservasi: e.target.value })}
                      className="w-full px-2 py-1.5 border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">3. Tanggal Coaching GROW</label>
                    <input
                      type="date"
                      value={newJadwal.tanggalCoaching}
                      onChange={e => setNewJadwal({ ...newJadwal, tanggalCoaching: e.target.value })}
                      className="w-full px-2 py-1.5 border rounded bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 mb-0.5">Supervisi Ulang (Maret 2027)</label>
                  <input
                    type="date"
                    value={newJadwal.tanggalSupervisiUlang}
                    onChange={e => setNewJadwal({ ...newJadwal, tanggalSupervisiUlang: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingGuru(false)}
                  className="px-3 py-2 rounded-lg border text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#1F3A5F] text-white font-bold hover:bg-[#2B4E7E]"
                >
                  Simpan Guru & Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Jadwal Guru */}
      {editingGuruId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-[#1F3A5F]">
                Ubah Jadwal Supervisi Guru
              </h3>
              <button
                onClick={() => setEditingGuruId(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">1. Tanggal Telaah Modul (Tahap 2)</label>
                <input
                  type="date"
                  value={editJadwalForm.tanggalTelaah}
                  onChange={e => setEditJadwalForm({ ...editJadwalForm, tanggalTelaah: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">2. Tanggal Observasi KBM (Tahap 3)</label>
                <input
                  type="date"
                  value={editJadwalForm.tanggalObservasi}
                  onChange={e => setEditJadwalForm({ ...editJadwalForm, tanggalObservasi: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Waktu Observasi (Jam Pelajaran)</label>
                <input
                  type="text"
                  placeholder="08:00 - 09:20 (Jam 1-2)"
                  value={editJadwalForm.waktuObservasi || ''}
                  onChange={e => setEditJadwalForm({ ...editJadwalForm, waktuObservasi: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">3. Tanggal Sesi Coaching GROW (Tahap 4)</label>
                <input
                  type="date"
                  value={editJadwalForm.tanggalCoaching}
                  onChange={e => setEditJadwalForm({ ...editJadwalForm, tanggalCoaching: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <span className="text-[10px] text-amber-700 mt-0.5 block">
                  *Buku manual merekomendasikan jarak maksimal 7 hari dari tanggal observasi.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Supervisi Ulang (Tahap 6 - Maret 2027)</label>
                <input
                  type="date"
                  value={editJadwalForm.tanggalSupervisiUlang}
                  onChange={e => setEditJadwalForm({ ...editJadwalForm, tanggalSupervisiUlang: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingGuruId(null)}
                  className="px-3 py-2 rounded-lg border text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditJadwal}
                  className="px-4 py-2 rounded-lg bg-[#1F3A5F] text-white font-bold hover:bg-[#2B4E7E]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
