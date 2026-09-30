import { AppState } from '../types';
import { getInitialAppState } from '../data/initialData';

const STORAGE_KEY = 'supervisiku_madrasah_data_v1';

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialAppState();
      saveAppState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    // basic sanity check
    if (!parsed.gurus || !parsed.settings) {
      return getInitialAppState();
    }
    return parsed;
  } catch (err) {
    console.error('Gagal memuat data dari localStorage, menggunakan data inisial:', err);
    return getInitialAppState();
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Gagal menyimpan data ke localStorage:', err);
  }
}

export function exportAppStateToJson(state: AppState, fileName?: string): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const name = fileName || `SupervisiKu_Backup_${state.settings.madrasahName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
  downloadAnchor.setAttribute('download', name);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function parseJsonBackup(jsonString: string): AppState {
  const parsed = JSON.parse(jsonString);
  if (!parsed.gurus || !parsed.settings || !parsed.ceklisTahap) {
    throw new Error('Format file backup tidak valid untuk SupervisiKu.');
  }
  return parsed as AppState;
}
