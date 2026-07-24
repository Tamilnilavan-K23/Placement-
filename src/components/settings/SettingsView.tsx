import React, { useState } from 'react';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { useTrackerStore } from '../../store/useTrackerStore';

export const SettingsView: React.FC = () => {
  const { exportUserData, importUserData, resetAllProgress } = useTrackerStore();
  const [importJson, setImportJson] = useState('');
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleExport = () => {
    const dataStr = exportUserData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg({ text: 'Data exported successfully!', isError: false });
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    const ok = importUserData(importJson);
    if (ok) {
      setMsg({ text: 'Data imported successfully!', isError: false });
      setImportJson('');
    } else {
      setMsg({ text: 'Failed to parse JSON backup. Please check format.', isError: true });
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all solved progress, notes, and timers? This action cannot be undone.')) {
      resetAllProgress();
      setMsg({ text: 'All progress has been reset.', isError: false });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Settings & Local Data Portability
        </h1>
        <p className="text-xs text-slate-400">
          All your progress, notes, and timers are stored 100% locally offline in your browser.
        </p>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold ${
          msg.isError ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
        }`}>
          {msg.text}
        </div>
      )}

      <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-4">
        <div className="flex items-center space-x-2 text-slate-100 font-bold">
          <Download className="w-5 h-5 text-brand-400" />
          <h3>Export JSON Backup</h3>
        </div>
        <p className="text-xs text-slate-400">
          Download a complete backup file containing all your solved problems, markdown notes, custom status, and timers.
        </p>
        <button
          onClick={handleExport}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20"
        >
          Download JSON Backup
        </button>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-4">
        <div className="flex items-center space-x-2 text-slate-100 font-bold">
          <Upload className="w-5 h-5 text-indigo-400" />
          <h3>Restore from JSON Backup</h3>
        </div>
        <textarea
          rows={4}
          value={importJson}
          onChange={(e) => setImportJson(e.target.value)}
          placeholder="Paste your JSON backup string here..."
          className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-brand-500"
        />
        <button
          onClick={handleImport}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20"
        >
          Restore Backup
        </button>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-rose-500/20 bg-rose-500/5 space-y-4">
        <div className="flex items-center space-x-2 text-rose-400 font-bold">
          <RotateCcw className="w-5 h-5" />
          <h3>Danger Zone: Reset Progress</h3>
        </div>
        <p className="text-xs text-slate-400">
          Resets all problem status, clear all solved marks, timer records, and markdown notes.
        </p>
        <button
          onClick={handleReset}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-500/20"
        >
          Reset All Progress
        </button>
      </div>
    </div>
  );
};
