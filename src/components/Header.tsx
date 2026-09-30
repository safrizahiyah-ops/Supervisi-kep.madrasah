import React from 'react';
import { 
  Compass, 
  Download, 
  Upload, 
  RotateCcw, 
  Printer, 
  HelpCircle, 
  Settings, 
  CheckSquare, 
  Calendar,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { AppState } from '../types';
import { exportAppStateToJson, parseJsonBackup } from '../utils/storage';
import { getInitialAppState } from '../data/initialData';

interface HeaderProps {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
  onOpenChecklist: () => void;
  onOpenGuide: () => void;
  onOpenPrint: () => void;
  onOpenSettings: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  onUpdateState,
  onOpenChecklist,
  onOpenGuide,
  onOpenPrint,
  onOpenSettings,
  activeTab,
  setActiveTab
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportAppStateToJson(state);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = parseJsonBackup(content);
        onUpdateState(parsed);
        alert('Data supervisi berhasil diimpor dari file JSON!');
      } catch (err: any) {
        alert('Gagal mengimpor file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleLoadSample = () => {
    if (confirm('Muat ulang data contoh (5 guru lengkap dengan instrumen dan jadwal)? Data saat ini akan diperbarui dengan data contoh.')) {
      const sample = getInitialAppState();
      onUpdateState(sample);
    }
  };

  return (
    <header className="bg-[#1F3A5F] text-white shadow-lg sticky top-0 z-40">
      {/* Top Banner / Announcement */}
      <div className="bg-[#172D4A] border-b border-white/10 px-4 py-1.5 text-xs text-slate-300 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-[#C9A227]/20 text-[#E0C068] px-2 py-0.5 rounded font-semibold text-[11px] border border-[#C9A227]/30">
            <ShieldCheck className="w-3 h-3" /> Siklus Supervisi 2026/2027
          </span>
          <span className="hidden sm:inline text-slate-300">
            1 Oktober 2026 – 31 Maret 2027 • {state.settings.madrasahName}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-300 hidden md:inline">Kamad: <strong className="text-white">{state.settings.kamadName}</strong></span>
          <button 
            onClick={handleLoadSample}
            className="text-[#E0C068] hover:text-white underline transition flex items-center gap-1 cursor-pointer"
            title="Muat 5 data guru contoh untuk mencoba seluruh instrumen"
          >
            <Sparkles className="w-3 h-3 text-[#C9A227]" /> Mode Tamu (Muat Data Contoh)
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#997715] flex items-center justify-center shadow-md shadow-black/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 text-[#1F3A5F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                SupervisiKu
              </h1>
              <span className="bg-[#C9A227] text-[#1F3A5F] text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded">
                Toolkit
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Manual Pegangan Kepala Madrasah dalam Menyukseskan Supervisi Guru
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ceklis & Jurnal */}
          <button
            onClick={onOpenChecklist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition cursor-pointer border border-white/10"
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#E0C068]" />
            <span>Ceklis & Jurnal Sabtu</span>
          </button>

          {/* Panduan */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition cursor-pointer border border-white/10"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#E0C068]" />
            <span>Panduan & Etika</span>
          </button>

          {/* Cetak */}
          <button
            onClick={onOpenPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition cursor-pointer border border-white/10"
          >
            <Printer className="w-3.5 h-3.5 text-blue-200" />
            <span>Cetak / Ekspor</span>
          </button>

          {/* Data Backup Actions */}
          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/10">
            <button
              onClick={handleExport}
              title="Cadangkan data ke file JSON"
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#E0C068]" />
              <span className="hidden sm:inline">Ekspor JSON</span>
            </button>
            <button
              onClick={handleImportClick}
              title="Pulihkan data dari file JSON"
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs"
            >
              <Upload className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Impor JSON</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>

          {/* Pengaturan */}
          <button
            onClick={onOpenSettings}
            title="Pengaturan Madrasah & Jadwal"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <nav className="border-t border-white/10 bg-[#162B46] px-4 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 text-xs font-medium whitespace-nowrap">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#C9A227] text-[#1F3A5F] font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Beranda
          </button>

          <span className="text-white/20">|</span>

          <button
            onClick={() => setActiveTab('tahap1')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tahap1'
                ? 'bg-[#C9A227] text-[#1F3A5F] font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] flex items-center justify-center font-bold">1</span>
            <span>Tahap 1: Persiapan</span>
          </button>

          <button
            onClick={() => setActiveTab('tahap2')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tahap2'
                ? 'bg-[#C9A227] text-[#1F3A5F] font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] flex items-center justify-center font-bold">2</span>
            <span>Tahap 2: Pra-Pelaksanaan</span>
          </button>

          <button
            onClick={() => setActiveTab('tahap3')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tahap3'
                ? 'bg-[#C9A227] text-[#1F3A5F] font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] flex items-center justify-center font-bold">3</span>
            <span>Tahap 3: Observasi</span>
          </button>

          <button
            onClick={() => setActiveTab('tahap4')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tahap4'
                ? 'bg-[#C9A227] text-[#1F3A5F] font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] flex items-center justify-center font-bold">4</span>
            <span>Tahap 4: Refleksi & Coaching</span>
          </button>

          <button
            onClick={() => setActiveTab('tahap5')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tahap5'
                ? 'bg-[#C9A227] text-[#1F3A5F] font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] flex items-center justify-center font-bold">5</span>
            <span>Tahap 5: Tindak Lanjut</span>
          </button>

          <button
            onClick={() => setActiveTab('tahap6')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tahap6'
                ? 'bg-[#C9A227] text-[#1F3A5F] font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] flex items-center justify-center font-bold">6</span>
            <span>Tahap 6: Siklus Lanjutan</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
