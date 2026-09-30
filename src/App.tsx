/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppState } from './types';
import { loadAppState, saveAppState } from './utils/storage';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Tahap1Persiapan } from './components/stages/Tahap1Persiapan';
import { Tahap2PraPelaksanaan } from './components/stages/Tahap2PraPelaksanaan';
import { Tahap3Observasi } from './components/stages/Tahap3Observasi';
import { Tahap4RefleksiCoaching } from './components/stages/Tahap4RefleksiCoaching';
import { Tahap5TindakLanjut } from './components/stages/Tahap5TindakLanjut';
import { Tahap6SiklusLanjutan } from './components/stages/Tahap6SiklusLanjutan';
import { ChecklistModal } from './components/ChecklistModal';
import { GuideModal } from './components/GuideModal';
import { PrintModal } from './components/PrintModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedGuruId, setSelectedGuruId] = useState<string>(() => {
    return state.gurus[0]?.id || 'guru_1';
  });

  // Modal open states
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  const handleUpdateState = (newState: AppState) => {
    setState(newState);
    saveAppState(newState);
  };

  const handleNavigateTab = (tab: string, guruId?: string) => {
    setActiveTab(tab);
    if (guruId) {
      setSelectedGuruId(guruId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Header & Navigation */}
      <Header
        state={state}
        onUpdateState={handleUpdateState}
        onOpenChecklist={() => setIsChecklistOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenPrint={() => setIsPrintOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            state={state}
            onNavigateTab={handleNavigateTab}
            onSelectGuru={setSelectedGuruId}
          />
        )}

        {activeTab === 'tahap1' && (
          <Tahap1Persiapan
            state={state}
            onUpdateState={handleUpdateState}
            onSelectGuru={setSelectedGuruId}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'tahap2' && (
          <Tahap2PraPelaksanaan
            state={state}
            onUpdateState={handleUpdateState}
            selectedGuruId={selectedGuruId}
            onSelectGuru={setSelectedGuruId}
          />
        )}

        {activeTab === 'tahap3' && (
          <Tahap3Observasi
            state={state}
            onUpdateState={handleUpdateState}
            selectedGuruId={selectedGuruId}
            onSelectGuru={setSelectedGuruId}
          />
        )}

        {activeTab === 'tahap4' && (
          <Tahap4RefleksiCoaching
            state={state}
            onUpdateState={handleUpdateState}
            selectedGuruId={selectedGuruId}
            onSelectGuru={setSelectedGuruId}
          />
        )}

        {activeTab === 'tahap5' && (
          <Tahap5TindakLanjut
            state={state}
            onUpdateState={handleUpdateState}
            selectedGuruId={selectedGuruId}
            onSelectGuru={setSelectedGuruId}
          />
        )}

        {activeTab === 'tahap6' && (
          <Tahap6SiklusLanjutan
            state={state}
            onUpdateState={handleUpdateState}
            selectedGuruId={selectedGuruId}
            onSelectGuru={setSelectedGuruId}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-[#1F3A5F]">
            SupervisiKu – Toolkit Supervisi Kepala Madrasah
          </p>
          <p>
            Buku Manual Pegangan Kepala Madrasah dalam Menyukseskan Supervisi Guru • Siklus 1 Oktober 2026 – 31 Maret 2027
          </p>
          <p className="text-[11px] text-slate-400 italic">
            &ldquo;Instrumen adalah alat bantu navigasi, bukan tujuan akhir. Jangan biarkan pengisian formulir mengalahkan dialog profesional.&rdquo;
          </p>
        </div>
      </footer>

      {/* Modals */}
      <ChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        state={state}
        onUpdateState={handleUpdateState}
        selectedGuruId={selectedGuruId}
        onSelectGuru={setSelectedGuruId}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <PrintModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        state={state}
        selectedGuruId={selectedGuruId}
        onSelectGuru={setSelectedGuruId}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        state={state}
        onUpdateState={handleUpdateState}
      />
    </div>
  );
}
