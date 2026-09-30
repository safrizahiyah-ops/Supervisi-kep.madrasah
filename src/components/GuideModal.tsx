import React, { useState } from 'react';
import { 
  HelpCircle, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  MessageSquare,
  Sparkles,
  Award
} from 'lucide-react';
import { DEFAULT_RUBRIK_6_CIRI } from '../data/initialData';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'etika' | 'rubrik' | 'evidence' | 'grow'>('etika');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#1F3A5F] text-white p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A227] text-[#1F3A5F] flex items-center justify-center font-bold shadow">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Buku Panduan & Kode Etik Supervisi Madrasah
              </h2>
              <p className="text-xs text-slate-300">
                Prinsip, rubrik acuan, dan standar pelaksanaan supervisi yang memanusiakan guru.
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

        {/* Tab Controls */}
        <div className="bg-slate-100 px-6 py-2 border-b flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab('etika')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'etika'
                ? 'bg-[#1F3A5F] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#E0C068]" />
            <span>6 Butir Etika Supervisi</span>
          </button>

          <button
            onClick={() => setActiveTab('rubrik')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rubrik'
                ? 'bg-[#1F3A5F] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#E0C068]" />
            <span>Rubrik 6 Ciri Pembelajaran</span>
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'evidence'
                ? 'bg-[#1F3A5F] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E0C068]" />
            <span>Panduan Evidence Obyektif</span>
          </button>

          <button
            onClick={() => setActiveTab('grow')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'grow'
                ? 'bg-[#1F3A5F] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#E0C068]" />
            <span>Panduan Percakapan GROW (45 Mnt)</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          {/* TAB 1: 6 BUTIR ETIKA SUPERVISI */}
          {activeTab === 'etika' && (
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <h3 className="font-bold text-amber-950 text-sm mb-1">
                  Enam Prinsip Kode Etik Supervisi Akademik Madrasah
                </h3>
                <p className="text-amber-900 text-xs">
                  Kepala Madrasah dan seluruh Tim Supervisor wajib memegang teguh 6 prinsip ini demi menjaga rasa aman psikologis guru.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    num: '1',
                    title: 'Kerahasiaan Dokumen & Data Profesional',
                    desc: 'Semua catatan observasi, skor, dan percakapan coaching adalah dokumen rahasia antara guru dan supervisor. Tidak boleh dijadikan bahan obrolan informal di ruang guru atau diperbandingkan antar-guru secara terbuka.'
                  },
                  {
                    num: '2',
                    title: 'Bukan Alat Hukuman atau Penilaian Kinerja Punitif',
                    desc: 'Supervisi adalah instrumen pertumbuhan dan kemitraan pedagogis, bukan inspeksi kepatuhan atau dasar pemberian sanksi/pemotongan tunjangan. Fokus pada "apa yang bisa kita kembangkan bersama", bukan "apa kesalahanmu".'
                  },
                  {
                    num: '3',
                    title: 'Anonimisasi Data pada Penggunaan Asisten AI',
                    desc: 'Saat memanfaatkan teknologi AI untuk menyintesis data observasi (Instrumen 7), nama guru, nama siswa, dan identitas madrasah WAJIB dianonimkan demi menjamin privasi serta keamanan data pribadi pendidik.'
                  },
                  {
                    num: '4',
                    title: 'Izin Dokumentasi Foto & Perekaman',
                    desc: 'Pengambilan foto atau dokumentasi proses KBM hanya dilakukan atas persetujuan guru yang bersangkutan dan semata-mata untuk portofolio praktik baik, tanpa mengorbankan kenyamanan belajar santri.'
                  },
                  {
                    num: '5',
                    title: 'Kepala Madrasah Juga Siap Disupervisi',
                    desc: 'Kepemimpinan yang berwibawa lahir dari kerendahan hati. Kepala Madrasah membuka diri untuk disupervisi oleh Pengawas Kemenag dan siap menerima umpan balik profesional demi kemajuan madrasah.'
                  },
                  {
                    num: '6',
                    title: 'Dialog Profesional di Atas Pengisian Formulir',
                    desc: '"Instrumen adalah alat bantu navigasi, bukan tujuan akhir. Jangan biarkan pengisian formulir mengalahkan dialog profesional." Waktu tatap muka harus didominasi oleh perbincangan memberdayakan, bukan sekadar mengisi centang kertas.'
                  }
                ].map((item) => (
                  <div key={item.num} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#1F3A5F] text-[#E0C068] font-bold text-xs flex items-center justify-center">
                        {item.num}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: RUBRIK 6 CIRI PEMBELAJARAN */}
          {activeTab === 'rubrik' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Rubrik acuan penilaian terstruktur KBM (Instrumen 6 & 13) yang memetakan perkembangan pembelajaran dari Level 1 (Kurang) hingga Level 4 (Sangat Baik).
              </p>

              <div className="space-y-4">
                {DEFAULT_RUBRIK_6_CIRI.map((rubrik) => (
                  <div key={rubrik.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div>
                      <h4 className="font-bold text-sm text-[#1F3A5F]">{rubrik.namaCiri}</h4>
                      <p className="text-slate-500 text-xs">{rubrik.deskripsi}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                      {[1, 2, 3, 4].map(lvl => (
                        <div key={lvl} className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                          <span className="font-bold text-[#1F3A5F] block text-[10px] uppercase">Level {lvl}</span>
                          <p className="text-[11px] text-slate-700 leading-relaxed">
                            {rubrik.deskriptorLevel[lvl as 1 | 2 | 3 | 4]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PANDUAN EVIDENCE OBYEKTIF */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-blue-900 text-xs leading-relaxed">
                <strong>Prinsip Evidence Faktual:</strong> Menuliskan apa yang dilihat dan didengar (fakta empiris bertanda waktu) tanpa menyisipkan prasangka, asumsi batin, atau label kualitatif subjektif.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2">
                  <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    TULIS SEPERTI INI (Faktual, Obyektif, Terukur):
                  </h4>
                  <ul className="space-y-2 text-slate-700 text-[11px]">
                    <li className="p-2 bg-white rounded border border-emerald-200">
                      <strong>08:05:</strong> Guru menayangkan video animasi 2 menit tentang siklus air dan meminta siswa mencatat 3 kata kunci.
                    </li>
                    <li className="p-2 bg-white rounded border border-emerald-200">
                      <strong>08:18:</strong> Siswa duduk dalam 5 kelompok (5-6 siswa), masing-masing memegang kartu peran (pencatat, juru bicara, penanya).
                    </li>
                    <li className="p-2 bg-white rounded border border-emerald-200">
                      <strong>08:32:</strong> Guru mendatangi kelompok 2, berjongkok sejajar meja siswa, dan bertanya: &ldquo;Di bagian mana percobaan ini yang airnya tidak mengendap?&rdquo;
                    </li>
                    <li className="p-2 bg-white rounded border border-emerald-200">
                      <strong>08:48:</strong> Dua puluh delapan siswa mengangkat kartu jawaban hijau, empat siswa mengangkat kartu kuning.
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 space-y-2">
                  <h4 className="font-bold text-rose-950 flex items-center gap-1.5 text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    BUKAN SEPERTI INI (Opini, Asumsi, Menghakimi):
                  </h4>
                  <ul className="space-y-2 text-slate-700 text-[11px]">
                    <li className="p-2 bg-white rounded border border-rose-200">
                      &ldquo;Apersepsi guru sangat bagus dan sangat memotivasi siswa.&rdquo; (Opini umum tanpa bukti nyata)
                    </li>
                    <li className="p-2 bg-white rounded border border-rose-200">
                      &ldquo;Siswa kelas terlihat bosan dan mengantuk karena materi sulit.&rdquo; (Asumsi pikiran orang lain tanpa data menit/tindakan)
                    </li>
                    <li className="p-2 bg-white rounded border border-rose-200">
                      &ldquo;Guru kurang menguasai kelas saat diskusi kelompok.&rdquo; (Pelabelan negatif tanpa rincian peristiwa yang memicu)
                    </li>
                    <li className="p-2 bg-white rounded border border-rose-200">
                      &ldquo;Semua siswa pintar memahami pelajaran.&rdquo; (Generalisasi tanpa bukti formatif)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PANDUAN PERCAKAPAN GROW */}
          {activeTab === 'grow' && (
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 text-purple-950 text-xs">
                <strong>Alur Coaching GROW (Durasi 45 Menit):</strong> Memandu guru merefleksikan praktiknya secara mandiri, bukan menasehati atau menggurui dari atas ke bawah.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 font-extrabold text-xs flex items-center justify-center">
                    G
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs">GOAL (Tujuan Percakapan ~5 Menit)</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Menyepakati fokus yang ingin dicapai dalam sesi coaching ini.
                  </p>
                  <div className="text-[11px] text-blue-900 bg-blue-50 p-2 rounded border border-blue-200 italic">
                    Contoh: &ldquo;Dari proses KBM kemarin, apa aspek yang paling ingin Ibu jadikan sasaran peningkatan diri ke depan?&rdquo;
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-extrabold text-xs flex items-center justify-center">
                    R
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs">REALITY (Kenyataan Lapangan ~10 Menit)</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Menyajikan data fakta evidence observasi dan mendengarkan refleksi jujur guru.
                  </p>
                  <div className="text-[11px] text-emerald-900 bg-emerald-50 p-2 rounded border border-emerald-200 italic">
                    Contoh: &ldquo;Berdasarkan catatan waktu kemarin, apa yang Ibu cermati mengenai pembagian bicara antara guru dan siswa?&rdquo;
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center justify-center">
                    O
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs">OPTIONS (Pilihan Solusi ~15 Menit)</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Mendorong guru memikirkan beberapa alternatif cara baru secara bebas.
                  </p>
                  <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded border border-amber-200 italic">
                    Contoh: &ldquo;Strategi apa saja yang terlintas di benak Ibu untuk mengatasi siswa yang masih pasif saat kerja kelompok?&rdquo;
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-900 font-extrabold text-xs flex items-center justify-center">
                    W
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs">WILL (Komitmen Tindakan ~15 Menit)</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Mengunci 4 unsur: Tindakan, Kelas, Tanggal Mulai, dan Ukuran Keberhasilan.
                  </p>
                  <div className="text-[11px] text-purple-900 bg-purple-50 p-2 rounded border border-purple-200 italic">
                    Contoh: &ldquo;Dari pilihan tadi, mana langkah konkret yang akan Ibu uji cobakan pertama kali minggu depan?&rdquo;
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
