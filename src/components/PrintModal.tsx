import React, { useState } from 'react';
import { 
  Printer, 
  FileText, 
  Users, 
  CheckCircle2, 
  Award, 
  Layers, 
  Download,
  Building,
  Calendar
} from 'lucide-react';
import { AppState, Guru } from '../types';
import { formatDateIndo } from '../utils/formatters';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppState;
  selectedGuruId: string;
  onSelectGuru: (id: string) => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  state,
  selectedGuruId,
  onSelectGuru
}) => {
  const [printMode, setPrintMode] = useState<'berkasGuru' | 'laporanPengawas'>('berkasGuru');

  if (!isOpen) return null;

  const currentGuru = state.gurus.find(g => g.id === selectedGuruId) || state.gurus[0];
  const jadwal = currentGuru ? state.jadwals[currentGuru.id] : undefined;
  const inst3 = currentGuru ? state.instrument3[currentGuru.id] : undefined;
  const inst4 = currentGuru ? state.instrument4[currentGuru.id] : undefined;
  const inst5 = currentGuru ? state.instrument5[currentGuru.id] : undefined;
  const inst6 = currentGuru ? state.instrument6[currentGuru.id] : undefined;
  const inst8 = currentGuru ? state.instrument8[currentGuru.id] : undefined;
  const inst9 = currentGuru ? state.instrument9[currentGuru.id] : undefined;
  const inst11 = currentGuru ? state.instrument11[currentGuru.id] : undefined;
  const inst12 = currentGuru ? state.instrument12[currentGuru.id] : undefined;
  const inst13 = currentGuru ? state.instrument13[currentGuru.id] : undefined;
  const inst14Item = currentGuru ? state.instrument14.rekapList.find(r => r.guruId === currentGuru.id) : undefined;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Controls Bar (Hidden during Print) */}
        <div className="no-print bg-[#1F3A5F] text-white p-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <Printer className="w-5 h-5 text-[#E0C068]" />
            <div>
              <h2 className="text-base font-bold text-white">
                Pratinjau Cetak / Ekspor PDF Dokumen Supervisi
              </h2>
              <p className="text-xs text-slate-300">
                Pilih format dokumen resmi untuk dicetak atau disimpan sebagai PDF.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-black/20 p-1 rounded-xl text-xs">
              <button
                onClick={() => setPrintMode('berkasGuru')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  printMode === 'berkasGuru'
                    ? 'bg-[#C9A227] text-[#1F3A5F]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Berkas Lengkap Guru
              </button>
              <button
                onClick={() => setPrintMode('laporanPengawas')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  printMode === 'laporanPengawas'
                    ? 'bg-[#C9A227] text-[#1F3A5F]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Laporan Ringkas Pengawas Kemenag
              </button>
            </div>

            {printMode === 'berkasGuru' && (
              <select
                value={currentGuru?.id}
                onChange={e => onSelectGuru(e.target.value)}
                className="bg-white text-slate-800 text-xs font-bold px-2 py-1.5 rounded-lg"
              >
                {state.gurus.map(g => (
                  <option key={g.id} value={g.id}>{g.nama}</option>
                ))}
              </select>
            )}

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Cetak PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-8 overflow-y-auto flex-1 bg-white font-sans text-slate-900 leading-normal printable-content">
          {/* MODE 1: BERKAS LENGKAP GURU (INST 3 - 14) */}
          {printMode === 'berkasGuru' && currentGuru && (
            <div className="space-y-8 max-w-4xl mx-auto">
              {/* Kop Madrasah */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <h2 className="text-xs uppercase tracking-widest font-bold text-slate-600">
                  KEMENTERIAN AGAMA REPUBLIK INDONESIA
                </h2>
                <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                  {state.settings.madrasahName}
                </h1>
                <p className="text-xs text-slate-600">
                  {state.settings.madrasahNsmNpsn} • Tahun Pelajaran {state.settings.tahunPelajaran} {state.settings.semester}
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-0.5 border border-slate-900 text-xs font-bold uppercase tracking-wider">
                    BERKAS PORTOFOLIO SUPERVISI AKADEMIK GURU
                  </span>
                </div>
              </div>

              {/* Biodata Guru */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 border border-slate-300 rounded-lg">
                <div>
                  <div className="mb-1"><span className="w-32 inline-block font-semibold">Nama Guru</span>: <strong>{currentGuru.nama}</strong></div>
                  <div className="mb-1"><span className="w-32 inline-block font-semibold">NIP</span>: {currentGuru.nip}</div>
                  <div><span className="w-32 inline-block font-semibold">Mata Pelajaran</span>: {currentGuru.mapel} ({currentGuru.kelas})</div>
                </div>
                <div>
                  <div className="mb-1"><span className="w-36 inline-block font-semibold">Supervisor</span>: {currentGuru.supervisorNama}</div>
                  <div className="mb-1"><span className="w-36 inline-block font-semibold">Tgl Observasi KBM</span>: {formatDateIndo(jadwal?.tanggalObservasi)}</div>
                  <div><span className="w-36 inline-block font-semibold">Fokus Sasaran</span>: {currentGuru.fokusPengembangan}</div>
                </div>
              </div>

              {/* 1. Telaah Perencanaan (Inst 3) */}
              <div className="space-y-3 break-inside-avoid">
                <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-1">
                  I. Instrumen 3: Telaah Perencanaan Pembelajaran (Modul Ajar)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold block text-slate-800">Catatan Penguatan:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                      {inst3?.penguatan.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold block text-slate-800">Saran Terarah:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                      {inst3?.saran.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. Lembar Observasi & Rubrik 6 Ciri (Inst 5 & 6) */}
              <div className="space-y-3 break-inside-avoid">
                <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-1 flex justify-between">
                  <span>II. Instrumen 5 & 6: Hasil Observasi KBM Berbasis Bukti</span>
                  <span>Skor Total: <strong>{inst6?.skorTotal || 0} / 24 Poin</strong></span>
                </h3>

                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-r">Ciri Pembelajaran</th>
                      <th className="p-2 border-r text-center w-16">Skor (1-4)</th>
                      <th className="p-2 border-r">Bukti Waktu Instrumen 5</th>
                      <th className="p-2">Catatan Supervisor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {inst6?.rubrik.map((r) => (
                      <tr key={r.id}>
                        <td className="p-2 border-r font-semibold">{r.namaCiri}</td>
                        <td className="p-2 border-r text-center font-bold">{r.skor}</td>
                        <td className="p-2 border-r font-mono text-[11px]">{r.rujukanCatatanWaktu}</td>
                        <td className="p-2 text-slate-700">{r.catatanSupervisor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 3. Komitmen Sesi Coaching (Inst 9) */}
              <div className="space-y-3 break-inside-avoid">
                <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-1">
                  III. Instrumen 9: Komitmen Aksi Tindak Lanjut Coaching GROW
                </h3>
                <div className="border border-slate-300 p-4 rounded-lg text-xs space-y-2 bg-slate-50/50">
                  <div><strong>1. Tindakan Konkret:</strong> {inst9?.tindakan || '-'}</div>
                  <div><strong>2. Kelas Sasaran:</strong> {inst9?.kelas || '-'}</div>
                  <div><strong>3. Tanggal Mulai:</strong> {formatDateIndo(inst9?.tanggalMulai)}</div>
                  <div><strong>4. Ukuran Keberhasilan:</strong> {inst9?.ukuranKeberhasilan || '-'}</div>
                  <div><strong>Dukungan Madrasah:</strong> {inst9?.catatanDukungan || '-'}</div>
                </div>
              </div>

              {/* 4. Monitoring & Supervisi Ulang (Inst 11 & 14) */}
              <div className="space-y-3 break-inside-avoid">
                <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-1">
                  IV. Instrumen 11 & 14: Rekap Monitoring & Supervisi Ulang
                </h3>
                <div className="text-xs space-y-2">
                  <div className="flex gap-4">
                    <span>Skor Observasi I: <strong>{inst14Item?.skorAwal || inst6?.skorTotal || 0} Poin</strong></span>
                    <span>➔</span>
                    <span>Skor Supervisi Ulang (Maret): <strong>{inst14Item?.skorUlang || inst13?.observasiTerstruktur.skorTotal || 0} Poin</strong></span>
                    <span>➔</span>
                    <span>Kategori Perkembangan: <strong>{inst14Item?.kategori || 'Berkembang'}</strong></span>
                  </div>
                  <div><strong>Ciri Paling Berkembang:</strong> {inst14Item?.ciriPalingBerkembang || '-'}</div>
                  <div><strong>Bukti Konkret:</strong> {inst14Item?.buktiKonkret || '-'}</div>
                </div>
              </div>

              {/* Tanda Tangan Pengesahan */}
              <div className="pt-8 grid grid-cols-2 text-center text-xs break-inside-avoid">
                <div className="space-y-16">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-semibold">Guru yang Disupervisi</p>
                  </div>
                  <div>
                    <p className="font-bold underline">{currentGuru.nama}</p>
                    <p className="text-slate-600">NIP. {currentGuru.nip}</p>
                  </div>
                </div>

                <div className="space-y-16">
                  <div>
                    <p>Ditetapkan di: {state.settings.madrasahName.split(' ')[0] || 'Madrasah'}</p>
                    <p className="font-semibold">Kepala Madrasah / Supervisor</p>
                  </div>
                  <div>
                    <p className="font-bold underline">{state.settings.kamadName}</p>
                    <p className="text-slate-600">NIP. {state.settings.kamadNip}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: LAPORAN RINGKAS PENGAWAS KEMENAG */}
          {printMode === 'laporanPengawas' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <h2 className="text-xs uppercase tracking-widest font-bold text-slate-600">
                  KEMENTERIAN AGAMA REPUBLIK INDONESIA
                </h2>
                <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                  LAPORAN RINGKAS PELAKSANAAN SUPERVISI AKADEMIK
                </h1>
                <p className="text-xs text-slate-600">
                  Disampaikan kepada Pengawas Pembina Madrasah • {state.settings.madrasahName}
                </p>
                <p className="text-[11px] text-slate-500">
                  Periode Siklus: 1 Oktober 2026 – 31 Maret 2027
                </p>
              </div>

              {/* 1. Ringkasan Eksekutif */}
              <div className="space-y-2 text-xs">
                <h3 className="font-bold uppercase tracking-wider border-b pb-1">
                  I. Gambaran Umum & Sasaran Madrasah
                </h3>
                <p className="leading-relaxed text-slate-700">
                  Program Supervisi Akademik di {state.settings.madrasahName} telah dilaksanakan secara penuh melalui 6 tahap dan 15 instrumen berlandaskan Buku Manual Supervisi Kemenag. Pendekatan difokuskan pada dialog kolegial memberdayakan (Coaching GROW 45 menit) guna menumbuhkan pembelajaran bermakna, inovatif, berdiferensiasi, dan berpusat pada siswa.
                </p>
              </div>

              {/* 2. Matriks Rekapitulasi Perkembangan Seluruh Guru (Inst 14) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1">
                  II. Matriks Hasil Perkembangan Guru (Instrumen 14)
                </h3>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 font-bold border-b">
                    <tr>
                      <th className="p-2 border-r">No</th>
                      <th className="p-2 border-r">Nama Guru & Mapel</th>
                      <th className="p-2 border-r text-center">Skor Awal</th>
                      <th className="p-2 border-r text-center">Skor Ulang</th>
                      <th className="p-2 border-r text-center">Selisih</th>
                      <th className="p-2 border-r text-center">Kategori</th>
                      <th className="p-2">Ciri Paling Berkembang</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {state.instrument14.rekapList.map((item, idx) => (
                      <tr key={item.guruId}>
                        <td className="p-2 border-r text-center">{idx + 1}</td>
                        <td className="p-2 border-r font-bold">{item.namaGuru}</td>
                        <td className="p-2 border-r text-center">{item.skorAwal}</td>
                        <td className="p-2 border-r text-center font-bold text-emerald-700">{item.skorUlang}</td>
                        <td className="p-2 border-r text-center font-bold">+{item.selisih}</td>
                        <td className="p-2 border-r text-center">{item.kategori}</td>
                        <td className="p-2">{item.ciriPalingBerkembang}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 3. RTL Madrasah Teragregasi (Inst 10) */}
              <div className="space-y-3 break-inside-avoid">
                <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1">
                  III. Rencana Tindak Lanjut (RTL) Madrasah (Instrumen 10)
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {state.instrument10.items.map((rtl, i) => (
                    <div key={rtl.id} className="p-2.5 border rounded bg-slate-50 text-[11px] space-y-1">
                      <div className="font-bold text-slate-900">{i + 1}. {rtl.guruNama} ({rtl.kategori})</div>
                      <div>Dukungan: {rtl.bentukDukungan}</div>
                      <div className="text-slate-500">PJ: {rtl.penanggungJawab} • Status: {rtl.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Evaluasi Makro (Inst 15) */}
              <div className="space-y-2 text-xs break-inside-avoid">
                <h3 className="font-bold uppercase tracking-wider border-b pb-1">
                  IV. Rekomendasi & Evaluasi Makro Madrasah (Instrumen 15)
                </h3>
                <p className="leading-relaxed text-slate-700 italic">
                  &ldquo;{state.instrument15.rekomendasiUmum}&rdquo;
                </p>
              </div>

              {/* Tanda Tangan Kepala Madrasah & Pengawas */}
              <div className="pt-10 grid grid-cols-2 text-center text-xs break-inside-avoid">
                <div className="space-y-16">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-semibold">Pengawas Pembina Madrasah</p>
                  </div>
                  <div>
                    <p className="font-bold underline">(........................................................)</p>
                    <p className="text-slate-600">NIP.</p>
                  </div>
                </div>

                <div className="space-y-16">
                  <div>
                    <p>Dibuat pada: 31 Maret 2027</p>
                    <p className="font-semibold">Kepala {state.settings.madrasahName}</p>
                  </div>
                  <div>
                    <p className="font-bold underline">{state.settings.kamadName}</p>
                    <p className="text-slate-600">NIP. {state.settings.kamadNip}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
