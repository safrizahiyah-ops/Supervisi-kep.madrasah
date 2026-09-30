import React, { useState } from 'react';
import { 
  Settings, 
  Building, 
  Users, 
  Calendar, 
  Save, 
  Download, 
  Trash2, 
  RotateCcw, 
  Plus, 
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { AppState, AppSettings } from '../types';
import { getInitialAppState, getEmptyAppState } from '../data/initialData';
import { exportAppStateToJson } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppState;
  onUpdateState: (newState: AppState) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateState
}) => {
  const [settingsForm, setSettingsForm] = useState<AppSettings>(state.settings);
  const [saveToast, setSaveToast] = useState(false);

  // New supervisor input
  const [newSupNama, setNewSupNama] = useState('');
  const [newSupNip, setNewSupNip] = useState('');
  const [newSupJabatan, setNewSupJabatan] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateState({
      ...state,
      settings: settingsForm
    });
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 1200);
  };

  const handleAddSupervisor = () => {
    if (!newSupNama.trim()) return;
    const sup = {
      id: `sup_${Date.now()}`,
      nama: newSupNama.trim(),
      nip: newSupNip.trim() || '-',
      jabatan: newSupJabatan.trim() || 'Tim Supervisor'
    };
    setSettingsForm({
      ...settingsForm,
      supervisors: [...settingsForm.supervisors, sup]
    });
    setNewSupNama('');
    setNewSupNip('');
    setNewSupJabatan('');
  };

  const handleRemoveSupervisor = (id: string) => {
    if (settingsForm.supervisors.length <= 1) {
      alert('Minimal harus ada 1 orang supervisor madrasah.');
      return;
    }
    setSettingsForm({
      ...settingsForm,
      supervisors: settingsForm.supervisors.filter(s => s.id !== id)
    });
  };

  const handleResetToSample = () => {
    if (confirm('Muat ulang data contoh (5 guru lengkap dengan seluruh instrumen 1–15)? Perubahan yang belum dicadangkan akan tertimpa.')) {
      const sample = getInitialAppState();
      onUpdateState(sample);
      setSettingsForm(sample.settings);
      alert('Data contoh berhasil dimuat!');
      onClose();
    }
  };

  const handleResetToEmpty = () => {
    if (confirm('PERINGATAN: Kosongkan seluruh data guru dan instrumen supervisi? Anda akan memulai lembar kerja baru dari awal.')) {
      const empty = getEmptyAppState();
      onUpdateState(empty);
      setSettingsForm(empty.settings);
      alert('Data telah dikosongkan.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#1F3A5F] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#E0C068]" />
            <div>
              <h2 className="text-base font-bold text-white">
                Pengaturan Madrasah & Siklus Supervisi
              </h2>
              <p className="text-xs text-slate-300">
                Sesuaikan identitas madrasah, tim supervisor, dan kalender tahapan.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-xs font-bold"
          >
            ✕ Tutup
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          {saveToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pengaturan berhasil disimpan!</span>
            </div>
          )}

          {/* Section 1: Profil Madrasah */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-[#1F3A5F] uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#C9A227]" />
              Identitas Satuan Pendidikan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Madrasah</label>
                <input
                  type="text"
                  required
                  value={settingsForm.madrasahName}
                  onChange={e => setSettingsForm({ ...settingsForm, madrasahName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#1F3A5F]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">NSM / NPSN</label>
                <input
                  type="text"
                  value={settingsForm.madrasahNsmNpsn}
                  onChange={e => setSettingsForm({ ...settingsForm, madrasahNsmNpsn: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#1F3A5F]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kepala Madrasah (dengan Gelar)</label>
                <input
                  type="text"
                  required
                  value={settingsForm.kamadName}
                  onChange={e => setSettingsForm({ ...settingsForm, kamadName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#1F3A5F]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">NIP Kepala Madrasah</label>
                <input
                  type="text"
                  value={settingsForm.kamadNip}
                  onChange={e => setSettingsForm({ ...settingsForm, kamadNip: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#1F3A5F]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tahun Pelajaran</label>
                <input
                  type="text"
                  value={settingsForm.tahunPelajaran}
                  onChange={e => setSettingsForm({ ...settingsForm, tahunPelajaran: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Semester</label>
                <input
                  type="text"
                  value={settingsForm.semester}
                  onChange={e => setSettingsForm({ ...settingsForm, semester: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Tim Supervisor */}
          <div className="space-y-3 pt-3 border-t">
            <h3 className="font-bold text-xs text-[#1F3A5F] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#C9A227]" />
              Daftar Tim Supervisor Madrasah
            </h3>

            <div className="space-y-2">
              {settingsForm.supervisors.map(s => (
                <div key={s.id} className="p-2.5 rounded-lg border bg-slate-50 flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900">{s.nama}</span>
                    <span className="text-[11px] text-slate-500 ml-2">NIP: {s.nip} • {s.jabatan}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSupervisor(s.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <input
                type="text"
                placeholder="Nama Supervisor Baru..."
                value={newSupNama}
                onChange={e => setNewSupNama(e.target.value)}
                className="px-2.5 py-1.5 border rounded-lg"
              />
              <input
                type="text"
                placeholder="NIP..."
                value={newSupNip}
                onChange={e => setNewSupNip(e.target.value)}
                className="px-2.5 py-1.5 border rounded-lg"
              />
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="Jabatan..."
                  value={newSupJabatan}
                  onChange={e => setNewSupJabatan(e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleAddSupervisor}
                  className="px-3 py-1.5 bg-[#1F3A5F] text-white font-bold rounded-lg shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Data Management & Reset */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 pt-3">
            <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Pencadangan & Pengaturan Ulang Data
            </h3>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => exportAppStateToJson(state)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Unduh Cadangan JSON</span>
              </button>

              <button
                type="button"
                onClick={handleResetToSample}
                className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Muat Data Contoh (5 Guru)</span>
              </button>

              <button
                type="button"
                onClick={handleResetToEmpty}
                className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-900 hover:bg-rose-100 font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Kosongkan Semua Data</span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1F3A5F] hover:bg-[#2B4E7E] text-white font-bold rounded-lg flex items-center gap-1.5 shadow"
            >
              <Save className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
