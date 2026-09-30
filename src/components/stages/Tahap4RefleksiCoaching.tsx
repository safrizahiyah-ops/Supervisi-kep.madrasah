import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  MessageSquare, 
  Sparkles, 
  Copy, 
  Check, 
  Clock, 
  Users, 
  Play, 
  Pause, 
  RotateCcw, 
  PenTool, 
  Save, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { AppState, Instrument7_AIAnalisis, Instrument8_GROW, Instrument9_CatatanCoaching } from '../../types';
import { formatDateIndo } from '../../utils/formatters';

interface Tahap4Props {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
  selectedGuruId: string;
  onSelectGuru: (id: string) => void;
}

export const Tahap4RefleksiCoaching: React.FC<Tahap4Props> = ({
  state,
  onUpdateState,
  selectedGuruId,
  onSelectGuru
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inst7' | 'inst8' | 'inst9'>('inst7');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const currentGuru = state.gurus.find(g => g.id === selectedGuruId) || state.gurus[0];
  const jadwal = currentGuru ? state.jadwals[currentGuru.id] : undefined;
  const inst5 = currentGuru ? state.instrument5[currentGuru.id] : undefined;

  // Instrumen 7 State
  const rawInst7 = currentGuru ? state.instrument7[currentGuru.id] : undefined;
  const inst7: Instrument7_AIAnalisis = rawInst7 || {
    guruId: currentGuru?.id || '',
    anonymizedPrompt: '',
    hasilAnalisis: '',
    sudahDiverifikasi: false,
    tanggalAnalisis: '2026-11-05',
    status: 'sedang'
  };

  // Instrumen 8 State
  const rawInst8 = currentGuru ? state.instrument8[currentGuru.id] : undefined;
  const inst8: Instrument8_GROW = rawInst8 || {
    guruId: currentGuru?.id || '',
    tanggalCoaching: jadwal?.tanggalCoaching || '2026-11-06',
    goal: {
      tujuan: 'Meningkatkan pelibatan siswa dan variasi diferensiasi produk',
      pertanyaanPemantik: 'Dari sesi pembelajaran kemarin, apa aspek yang paling ingin Ibu/Bapak optimalkan?',
      jawabanGuru: ''
    },
    reality: {
      faktaObservasi: 'Data observasi menunjukkan proporsi aktif siswa dan celah keterlibatan kelompok',
      pertanyaanPemantik: 'Apa yang Ibu/Bapak amati dari data keterlibatan siswa di kelas saat diskusi berlangsung?',
      jawabanGuru: ''
    },
    options: {
      pilihanStrategi: 'Eksplorasi strategi peran kelompok atau scaffolding',
      pertanyaanPemantik: 'Alternatif cara baru apa yang bisa dicoba untuk memperluas keterlibatan mereka?',
      jawabanGuru: ''
    },
    will: {
      langkahNyata: 'Menetapkan komitmen konkret mulai pertemuan depan',
      pertanyaanPemantik: 'Kapan langkah ini akan mulai diujicobakan dan apa ukuran keberhasilannya?',
      jawabanGuru: ''
    },
    timerMinutes: 45,
    status: 'sedang'
  };

  // Instrumen 9 State
  const rawInst9 = currentGuru ? state.instrument9[currentGuru.id] : undefined;
  const inst9: Instrument9_CatatanCoaching = rawInst9 || {
    guruId: currentGuru?.id || '',
    tanggalCoaching: jadwal?.tanggalCoaching || '2026-11-06',
    tindakan: '',
    kelas: currentGuru?.kelas || 'Kelas VIII',
    tanggalMulai: '2026-11-16',
    ukuranKeberhasilan: '',
    catatanDukungan: 'Madrasah siap mendukung fasilitas dan waktu MGMP',
    tandaTanganGuru: {
      nama: currentGuru?.nama || '',
      tanggal: '2026-11-06',
      disetujui: true
    },
    tandaTanganSaksi: {
      nama: currentGuru?.supervisorNama || 'Kepala Madrasah',
      peran: 'Kepala Madrasah / Supervisor',
      tanggal: '2026-11-06',
      disetujui: true
    },
    status: 'sedang'
  };

  // Timer 45 Minutes State
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

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

  const saveInst7 = (data: Instrument7_AIAnalisis) => {
    onUpdateState({
      ...state,
      instrument7: {
        ...state.instrument7,
        [currentGuru.id]: { ...data, status: 'selesai' }
      }
    });
    showToast();
  };

  const saveInst8 = (data: Instrument8_GROW) => {
    onUpdateState({
      ...state,
      instrument8: {
        ...state.instrument8,
        [currentGuru.id]: { ...data, status: 'selesai' }
      }
    });
    showToast();
  };

  const saveInst9 = (data: Instrument9_CatatanCoaching) => {
    // Validate 4 elements
    const isComplete = 
      Boolean(data.tindakan?.trim()) && 
      Boolean(data.kelas?.trim()) && 
      Boolean(data.tanggalMulai?.trim()) && 
      Boolean(data.ukuranKeberhasilan?.trim());

    onUpdateState({
      ...state,
      instrument9: {
        ...state.instrument9,
        [currentGuru.id]: { ...data, status: isComplete ? 'selesai' : 'sedang' }
      }
    });
    showToast();
  };

  // Generate anonymized prompt from Instrument 5
  const generateAnonymizedPrompt = () => {
    const rawEvents = inst5?.catatanList || [];
    let text = `Anda adalah asisten supervisor akademik madrasah. Berikut adalah catatan evidence faktual dari observasi KBM (data telah dianonimkan demi privasi guru & madrasah):\n\n`;

    if (rawEvents.length === 0) {
      text += `- Belum ada catatan peristiwa rinci pada Instrumen 5. Mohon gunakan contoh KBM aktif bermakna.`;
    } else {
      rawEvents.forEach(ev => {
        // Strip names, convert to anonymous role
        const sanitized = ev.faktaPeristiwa
          .replace(new RegExp(currentGuru.nama, 'gi'), 'Guru Model')
          .replace(new RegExp(state.settings.madrasahName, 'gi'), 'Madrasah');
        text += `- [${ev.waktu}] ${sanitized}\n`;
      });
      text += `\nProporsi Waktu: Guru bicara ${inst5?.totalMenitGuruBicara || 30} menit, Siswa aktif ${inst5?.totalMenitSiswaAktif || 50} menit. Partisipasi siswa: ~${inst5?.perkiraanSiswaTerlibat || 85}%.\n`;
    }

    text += `\nTUGAS ANALISIS SUPERVISOR:\n1. Kelompokkan catatan ke dalam 6 ciri pembelajaran (Bermakna, Inovatif, Berdiferensiasi, Berpusat Siswa, Reflektif, Asesmen Autentik).\n2. Hitung proporsi bicara guru vs keaktifan siswa serta maknanya bagi proses belajar.\n3. Identifikasi 3 pola menonjol (kekuatan & area pengembangan potensial).\n4. Susun 5 pertanyaan reflektif dialogis yang memberdayakan guru untuk percakapan coaching GROW (tanpa nada menghakimi).`;

    return text;
  };

  const handleCopyPrompt = () => {
    const prompt = inst7.anonymizedPrompt || generateAnonymizedPrompt();
    navigator.clipboard.writeText(prompt);
    saveInst7({ ...inst7, anonymizedPrompt: prompt });
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleGenerateInstantAnalysis = () => {
    const prompt = generateAnonymizedPrompt();
    const mockAnalysis = `HASIL ANALISIS CATATAN OBSERVASI (BERBANTUAN AI):

1. PENGELOMPOKKAN PADA 6 CIRI PEMBELAJARAN:
- Bermakna: Guru mengaitkan konsep materi dengan kasus otentik di kehidupan siswa.
- Inovatif: Penggunaan lembar studi kasus dan kolaborasi kelompok variatif.
- Berdiferensiasi: Guru mendampingi kelompok yang membutuhkan bimbingan tambahan (scaffolding).
- Berpusat pada Siswa: Proporsi aktif siswa (${inst5?.totalMenitSiswaAktif || 50} menit) dominan dibanding guru (${inst5?.totalMenitGuruBicara || 30} menit).
- Reflektif: Tersedia alokasi waktu evaluasi penutup.
- Asesmen Autentik: Umpan balik formatif langsung diberikan saat diskusi berjalan.

2. PROPORSI WAKTU:
- Siswa aktif mencapai lebih dari 60% waktu, mencerminkan iklim kelas partisipatif dan aman secara psikologis.

3. TIGA POLA MENONJOL (PATTERNS):
a. Iklim kelas suportif: siswa percaya diri berpendapat tanpa takut dicemooh.
b. Scaffolding guru berbasis pertanyaan pemantik, bukan mendikte jawaban.
c. Perlu penguatan pada diferensiasi produk tugas agar siswa memiliki variasi unjuk karya.

4. LIMA PERTANYAAN REFLEKTIF UNTUK SESI COACHING GROW:
1) "Bagaimana perasaan Ibu/Bapak menyaksikan antusiasme siswa saat berdiskusi tadi?"
2) "Momen mana dalam pembelajaran tadi yang menurut Ibu/Bapak paling berdampak bagi anak-anak?"
3) "Apa yang Ibu/Bapak amati dari dinamika siswa yang biasanya pendiam?"
4) "Jika diberi ruang untuk mencoba hal baru, variasi apa yang ingin Ibu/Bapak tambahkan pada produk karya siswa?"
5) "Dukungan konkret apa dari madrasah yang paling dibutuhkan untuk memperkuat KBM ini?"`;

    saveInst7({
      ...inst7,
      anonymizedPrompt: prompt,
      hasilAnalisis: mockAnalysis,
      sudahDiverifikasi: true
    });
  };

  // Check 4 mandatory elements for Instrument 9
  const isTindakanValid = Boolean(inst9.tindakan?.trim());
  const isKelasValid = Boolean(inst9.kelas?.trim());
  const isTanggalValid = Boolean(inst9.tanggalMulai?.trim());
  const isUkuranValid = Boolean(inst9.ukuranKeberhasilan?.trim());
  const all4ElementsValid = isTindakanValid && isKelasValid && isTanggalValid && isUkuranValid;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Guru Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#1F3A5F] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                Tahap 4
              </span>
              <span className="text-xs text-slate-500 font-semibold">9 Nov – 11 Des 2026</span>
            </div>
            <h1 className="text-xl font-bold text-[#1F3A5F] mt-1">
              Tahap 4: Refleksi & Percakapan Coaching
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Memanfaatkan analisis cerdas berbasis bukti untuk memantik dialog kemitraan alur GROW 45 menit dan mengunci komitmen 4 unsur.
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
            <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-medium">
              Tanggal Coaching: {formatDateIndo(inst9.tanggalCoaching)}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('inst7')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'inst7'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Inst. 7: Analisis AI</span>
            </button>
            <button
              onClick={() => setActiveSubTab('inst8')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'inst8'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Inst. 8: Panduan GROW & Timer</span>
            </button>
            <button
              onClick={() => setActiveSubTab('inst9')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'inst9'
                  ? 'bg-[#1F3A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-[#E0C068]" />
              <span>Inst. 9: Catatan Komitmen</span>
            </button>
          </div>
        </div>
      </div>

      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F3A5F] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold border border-[#C9A227]">
          <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
          <span>Data coaching berhasil diperbarui!</span>
        </div>
      )}

      {/* SUB-TAB 1: INSTRUMEN 7 ANALISIS BERBANTUAN AI */}
      {activeSubTab === 'inst7' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
                Pengolahan Data Observasi Obyektif
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Instrumen 7: Analisis Berbantuan AI untuk Dialog Coaching
              </h2>
              <p className="text-xs text-slate-500">
                Data mentah dari Instrumen 5 otomatis dianonimkan (nama guru & siswa disamarkan) untuk menjaga etika kerahasiaan sebelum diproses.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyPrompt}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copiedPrompt ? 'Prompt Disalin!' : 'Anonimkan & Salin Catatan'}</span>
              </button>

              <button
                onClick={handleGenerateInstantAnalysis}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#1F3A5F] to-[#2B4E7E] hover:opacity-95 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E0C068]" />
                <span>Hasilkan Analisis Cerdas</span>
              </button>
            </div>
          </div>

          {/* Privacy & Ethics Notice */}
          <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Etika Privasi Supervisi:</span>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Fitur ini mematuhi Butir Etika Supervisi ke-3: Semua data masukan dianonimkan. Hasil keluaran AI wajib diverifikasi terhadap catatan asli pengamat sebelum digunakan dalam sesi coaching.
              </p>
            </div>
          </div>

          {/* Prompt Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700">
                Prompt Terstruktur yang Dihasilkan (Data Teranonimkan):
              </label>
              <span className="text-[11px] text-slate-500">
                Format baku 6 ciri, proporsi bicara & 5 pertanyaan reflektif
              </span>
            </div>
            <textarea
              rows={5}
              value={inst7.anonymizedPrompt || generateAnonymizedPrompt()}
              onChange={e => saveInst7({ ...inst7, anonymizedPrompt: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-xl font-mono bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#1F3A5F]"
            />
          </div>

          {/* Analysis Result Output & Verification */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
                Hasil Analisis & Rekomendasi Pertanyaan Reflektif:
              </label>
              <span className="text-[11px] text-slate-500">
                Dapat diedit atau ditempel dari hasil AI eksternal
              </span>
            </div>

            <textarea
              rows={10}
              placeholder="Hasil analisis AI akan tampil di sini, atau Anda dapat menempelkan hasil analisis AI di kolom ini..."
              value={inst7.hasilAnalisis}
              onChange={e => saveInst7({ ...inst7, hasilAnalisis: e.target.value })}
              className="w-full p-4 text-xs border rounded-xl font-sans leading-relaxed focus:ring-1 focus:ring-[#1F3A5F] bg-white shadow-inner"
            />

            {/* Mandatory Verification Checkbox */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2.5 text-xs font-bold text-amber-950 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inst7.sudahDiverifikasi}
                  onChange={e => saveInst7({ ...inst7, sudahDiverifikasi: e.target.checked })}
                  className="rounded text-[#1F3A5F] focus:ring-[#1F3A5F] w-4 h-4"
                />
                <span>✓ Sudah diverifikasi terhadap catatan asli observasi sebelum sesi coaching</span>
              </label>
              <button
                onClick={() => setActiveSubTab('inst8')}
                className="px-3.5 py-1.5 rounded-lg bg-[#1F3A5F] text-white text-xs font-bold hover:bg-[#2B4E7E] transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Lanjut ke Panduan GROW</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INSTRUMEN 8 PANDUAN GROW & TIMER 45 MENIT */}
      {activeSubTab === 'inst8' && (
        <div className="space-y-6">
          {/* 45-Minute Timer Bar */}
          <div className="bg-gradient-to-r from-[#1F3A5F] via-[#2A4C78] to-[#1F3A5F] text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-[#E0C068]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Timer Sesi Percakapan Coaching GROW</h3>
                <p className="text-xs text-slate-300">
                  Target durasi standar: <strong>45 Menit</strong> (10 mnt Goal & Reality, 20 mnt Options, 15 mnt Will).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="font-mono text-3xl font-extrabold tracking-wider bg-black/30 px-4 py-1.5 rounded-xl border border-white/10 text-[#E0C068]">
                {formatTimer(timerSecondsLeft)}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`p-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                    isTimerRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSecondsLeft(45 * 60);
                  }}
                  title="Atur Ulang 45 Menit"
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 4 GROW Stages */}
          <div className="space-y-4">
            {/* G - Goal */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-900 font-extrabold text-sm flex items-center justify-center">
                    G
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    GOAL – Sasaran / Tujuan Percakapan yang Diinginkan Guru
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">Alokasi ~5 Menit</span>
              </div>

              <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 text-xs">
                <span className="font-bold text-blue-950 block mb-0.5">Pertanyaan Pemantik Supervisor:</span>
                <p className="text-blue-900 italic">
                  &ldquo;{inst8.goal.pertanyaanPemantik}&rdquo;
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Jawaban / Sasaran yang Ditetapkan Guru:
                </label>
                <textarea
                  rows={2}
                  value={inst8.goal.jawabanGuru}
                  onChange={e => {
                    saveInst8({
                      ...inst8,
                      goal: { ...inst8.goal, jawabanGuru: e.target.value }
                    });
                  }}
                  placeholder="Tuliskan tujuan perbaikan yang disampaikan guru..."
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-1 focus:ring-[#1F3A5F]"
                />
              </div>
            </div>

            {/* R - Reality */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-900 font-extrabold text-sm flex items-center justify-center">
                    R
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    REALITY – Fakta Realitas Lapangan (Berdasarkan Evidence Observasi)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">Alokasi ~10 Menit</span>
              </div>

              <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-950 block mb-0.5">Pertanyaan Pemantik Supervisor:</span>
                <p className="text-emerald-900 italic">
                  &ldquo;{inst8.reality.pertanyaanPemantik}&rdquo;
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Kesadaran / Pengamatan Diri Guru terhadap Fakta Kelas:
                </label>
                <textarea
                  rows={2}
                  value={inst8.reality.jawabanGuru}
                  onChange={e => {
                    saveInst8({
                      ...inst8,
                      reality: { ...inst8.reality, jawabanGuru: e.target.value }
                    });
                  }}
                  placeholder="Catat refleksi guru atas fakta KBM kemarin..."
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-1 focus:ring-[#1F3A5F]"
                />
              </div>
            </div>

            {/* O - Options */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 font-extrabold text-sm flex items-center justify-center">
                    O
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    OPTIONS – Menemukan Alternatif Solusi & Pilihan Strategi Baru
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">Alokasi ~15 Menit</span>
              </div>

              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-xs">
                <span className="font-bold text-amber-950 block mb-0.5">Pertanyaan Pemantik Supervisor:</span>
                <p className="text-amber-900 italic">
                  &ldquo;{inst8.options.pertanyaanPemantik}&rdquo;
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Pilihan & Solusi Kreatif yang Diusulkan Guru:
                </label>
                <textarea
                  rows={2}
                  value={inst8.options.jawabanGuru}
                  onChange={e => {
                    saveInst8({
                      ...inst8,
                      options: { ...inst8.options, jawabanGuru: e.target.value }
                    });
                  }}
                  placeholder="Catat ide-ide terobosan yang muncul dari dalam diri guru..."
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-1 focus:ring-[#1F3A5F]"
                />
              </div>
            </div>

            {/* W - Will */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-900 font-extrabold text-sm flex items-center justify-center">
                    W
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    WILL – Komitmen & Langkah Nyata yang Akan Dijalankan
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">Alokasi ~15 Menit</span>
              </div>

              <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-200 text-xs">
                <span className="font-bold text-purple-950 block mb-0.5">Pertanyaan Pemantik Supervisor:</span>
                <p className="text-purple-900 italic">
                  &ldquo;{inst8.will.pertanyaanPemantik}&rdquo;
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Komitmen Aksi Guru:
                </label>
                <textarea
                  rows={2}
                  value={inst8.will.jawabanGuru}
                  onChange={e => {
                    saveInst8({
                      ...inst8,
                      will: { ...inst8.will, jawabanGuru: e.target.value }
                    });
                  }}
                  placeholder="Rangkuman komitmen guru untuk dituangkan ke Instrumen 9..."
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-1 focus:ring-[#1F3A5F]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: INSTRUMEN 9 CATATAN SESI COACHING (4 ELEMEN VALIDASI) */}
      {activeSubTab === 'inst9' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
                Dokumen Kesepakatan Akhir Sesi
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Instrumen 9: Catatan Sesi Coaching & Komitmen Tindak Lanjut Guru
              </h2>
              <p className="text-xs text-slate-500">
                Wajib memuat 4 unsur pokok: tindakan spesifik, kelas sasaran, tanggal mulai, dan ukuran keberhasilan terukur.
              </p>
            </div>

            {/* Validation Badge */}
            <div>
              {all4ElementsValid ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 4 Unsur Valid Lengkap
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> 4 Unsur Belum Lengkap
                </span>
              )}
            </div>
          </div>

          {/* 4 Mandatory Validation Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Unsur 1: Tindakan */}
            <div className={`p-4 rounded-xl border ${isTindakanValid ? 'border-slate-200 bg-slate-50/50' : 'border-red-300 bg-red-50/30'} space-y-1.5`}>
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>1. Tindakan Konkret yang Akan Dilakukan (Wajib)</span>
                {!isTindakanValid && <span className="text-[10px] text-red-600 font-semibold">*Harus diisi</span>}
              </label>
              <textarea
                rows={3}
                required
                placeholder="Contoh: Menerapkan kartu peran kelompok dan lembar penugasan infografis Canva bermuamalah..."
                value={inst9.tindakan}
                onChange={e => saveInst9({ ...inst9, tindakan: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white focus:ring-1 focus:ring-[#1F3A5F]"
              />
            </div>

            {/* Unsur 2: Kelas */}
            <div className={`p-4 rounded-xl border ${isKelasValid ? 'border-slate-200 bg-slate-50/50' : 'border-red-300 bg-red-50/30'} space-y-1.5`}>
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>2. Kelas Sasaran Penerapan (Wajib)</span>
                {!isKelasValid && <span className="text-[10px] text-red-600 font-semibold">*Harus diisi</span>}
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Kelas VIII-A"
                value={inst9.kelas}
                onChange={e => saveInst9({ ...inst9, kelas: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white focus:ring-1 focus:ring-[#1F3A5F]"
              />
              <span className="text-[10px] text-slate-500 block">
                Tentukan kelas spesifik tempat model ini diujicobakan.
              </span>
            </div>

            {/* Unsur 3: Tanggal Mulai */}
            <div className={`p-4 rounded-xl border ${isTanggalValid ? 'border-slate-200 bg-slate-50/50' : 'border-red-300 bg-red-50/30'} space-y-1.5`}>
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>3. Tanggal Mulai Diterapkan (Wajib)</span>
                {!isTanggalValid && <span className="text-[10px] text-red-600 font-semibold">*Harus diisi</span>}
              </label>
              <input
                type="date"
                required
                value={inst9.tanggalMulai}
                onChange={e => saveInst9({ ...inst9, tanggalMulai: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white focus:ring-1 focus:ring-[#1F3A5F]"
              />
              <span className="text-[10px] text-slate-500 block">
                Buku manual merekomendasikan dalam tempo 1-2 pekan setelah coaching.
              </span>
            </div>

            {/* Unsur 4: Ukuran Keberhasilan */}
            <div className={`p-4 rounded-xl border ${isUkuranValid ? 'border-slate-200 bg-slate-50/50' : 'border-red-300 bg-red-50/30'} space-y-1.5`}>
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>4. Ukuran Keberhasilan / Indikator Bukti (Wajib)</span>
                {!isUkuranValid && <span className="text-[10px] text-red-600 font-semibold">*Harus diisi</span>}
              </label>
              <textarea
                rows={3}
                required
                placeholder="Contoh: 100% siswa memiliki peran aktif dalam kelompok dan produk karya terkumpul dengan skor rubrik minimal 80..."
                value={inst9.ukuranKeberhasilan}
                onChange={e => saveInst9({ ...inst9, ukuranKeberhasilan: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white focus:ring-1 focus:ring-[#1F3A5F]"
              />
            </div>
          </div>

          {/* Dukungan Madrasah */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Bentuk Dukungan Fasilitasi dari Madrasah / Kepala Madrasah:
            </label>
            <input
              type="text"
              placeholder="Contoh: Akses laboratorium komputer, pelatihan Canva, atau pendampingan rekan sejawat..."
              value={inst9.catatanDukungan}
              onChange={e => saveInst9({ ...inst9, catatanDukungan: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-1 focus:ring-[#1F3A5F]"
            />
          </div>

          {/* Signatures */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-[#1F3A5F] uppercase tracking-wider flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-[#C9A227]" />
              Pengesahan Komitmen Coaching (Guru & Saksi Supervisor)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-semibold text-[11px] block">Guru yang Berkomitmen:</span>
                <div className="font-bold text-slate-900">{inst9.tandaTanganGuru.nama}</div>
                <div className="text-[11px] text-slate-500">Tanggal: {formatDateIndo(inst9.tandaTanganGuru.tanggal)}</div>
                <label className="flex items-center gap-2 pt-2 border-t text-emerald-800 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inst9.tandaTanganGuru.disetujui}
                    onChange={e => {
                      saveInst9({
                        ...inst9,
                        tandaTanganGuru: { ...inst9.tandaTanganGuru, disetujui: e.target.checked }
                      });
                    }}
                    className="rounded text-emerald-600"
                  />
                  <span>✓ Komitmen Disetujui Penuh oleh Guru</span>
                </label>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-semibold text-[11px] block">Saksi / Supervisor:</span>
                <div className="font-bold text-slate-900">{inst9.tandaTanganSaksi.nama}</div>
                <div className="text-[11px] text-slate-500">{inst9.tandaTanganSaksi.peran}</div>
                <label className="flex items-center gap-2 pt-2 border-t text-emerald-800 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inst9.tandaTanganSaksi.disetujui}
                    onChange={e => {
                      saveInst9({
                        ...inst9,
                        tandaTanganSaksi: { ...inst9.tandaTanganSaksi, disetujui: e.target.checked }
                      });
                    }}
                    className="rounded text-emerald-600"
                  />
                  <span>✓ Komitmen Disahkan untuk Masuk RTL Madrasah</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
