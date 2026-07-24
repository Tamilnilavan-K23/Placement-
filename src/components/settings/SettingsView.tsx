import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Bell, 
  Cloud, 
  RefreshCw, 
  Copy, 
  Check, 
  Clock, 
  Send,
  Smartphone
} from 'lucide-react';
import { useTrackerStore } from '../../store/useTrackerStore';

export const SettingsView: React.FC = () => {
  const { 
    exportUserData, 
    importUserData, 
    resetAllProgress,
    notificationsEnabled,
    setNotificationsEnabled,
    reminderTime,
    setReminderTime,
    sendTestNotification,
    syncCode,
    generateNewSyncCode,
    pushCloudSync,
    pullCloudSync,
    isSyncing,
    lastSyncedAt
  } = useTrackerStore();

  const [importJson, setImportJson] = useState('');
  const [inputSyncCode, setInputSyncCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleToggleNotifications = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    const ok = await setNotificationsEnabled(enabled);
    if (ok) {
      setMsg({ text: 'Push notifications enabled successfully! You will receive daily DSA study reminders.', isError: false });
    } else if (enabled) {
      setMsg({ text: 'Notification permission was denied in your browser settings.', isError: true });
    } else {
      setMsg({ text: 'Push notifications disabled.', isError: false });
    }
  };

  const handleTestNotification = async () => {
    const ok = await sendTestNotification();
    if (ok) {
      setMsg({ text: 'Test push notification sent! Check your desktop/mobile notifications.', isError: false });
    } else {
      setMsg({ text: 'Unable to send notification. Please enable notification permissions.', isError: true });
    }
  };

  const handlePushSync = async () => {
    const ok = await pushCloudSync();
    if (ok) {
      setMsg({ text: 'Progress synced to cloud successfully!', isError: false });
    } else {
      setMsg({ text: 'Cloud sync failed. Please check network connection.', isError: true });
    }
  };

  const handlePullSync = async () => {
    if (!inputSyncCode.trim()) return;
    const ok = await pullCloudSync(inputSyncCode);
    if (ok) {
      setMsg({ text: `Successfully synced progress from code ${inputSyncCode.toUpperCase()}!`, isError: false });
      setInputSyncCode('');
    } else {
      setMsg({ text: `No cloud progress found for pair code "${inputSyncCode}".`, isError: true });
    }
  };

  const handleCopyCode = () => {
    if (!syncCode) return;
    navigator.clipboard.writeText(syncCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

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
          Settings & Cloud Synchronization
        </h1>
        <p className="text-xs text-slate-400">
          Manage daily reminder notifications, sync progress across devices, or export JSON backups.
        </p>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold ${
          msg.isError ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
        }`}>
          {msg.text}
        </div>
      )}

      {/* Push Notifications & Daily Reminders */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-100">
                Push Notifications & Daily Reminders
              </h3>
              <p className="text-xs text-slate-400">
                Receive daily PWA push reminders to complete your 10 DSA questions and keep your streak alive.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleToggleNotifications}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
          </label>
        </div>

        {notificationsEnabled && (
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-slate-300">Set Daily Reminder Time:</span>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="px-3 py-1 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <button
                onClick={handleTestNotification}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold border border-amber-500/30 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Test Notification</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sync Progress Across All Devices */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100">
              Cross-Device Cloud Progress Sync
            </h3>
            <p className="text-xs text-slate-400">
              Sync your solved DSA questions, custom notes, and active streak across any laptop or mobile phone.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Pairing Code Card */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Device Pairing Code:</span>
              {lastSyncedAt && (
                <span className="text-[10px] text-emerald-400 font-semibold">Synced at {lastSyncedAt}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-center font-mono text-base font-extrabold text-brand-400 tracking-wider">
                {syncCode || 'No Code Yet'}
              </div>

              {syncCode ? (
                <button
                  onClick={handleCopyCode}
                  className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  title="Copy Pair Code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              ) : (
                <button
                  onClick={() => generateNewSyncCode()}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700"
                >
                  Generate Code
                </button>
              )}
            </div>

            <button
              onClick={handlePushSync}
              disabled={isSyncing}
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Current Device to Cloud'}</span>
            </button>
          </div>

          {/* Pull Code Card */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">
              Pair & Load Progress from Another Device:
            </span>

            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Smartphone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={inputSyncCode}
                  onChange={(e) => setInputSyncCode(e.target.value)}
                  placeholder="Enter pairing code (e.g. DSA-89X2)"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-brand-500 uppercase"
                />
              </div>

              <button
                onClick={handlePullSync}
                disabled={isSyncing || !inputSyncCode.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                Pull Progress
              </button>
            </div>

            <p className="text-[10px] text-slate-500">
              Enter the 6-digit pair code from your second device to instantly merge and sync your DSA solved state.
            </p>
          </div>
        </div>
      </div>

      {/* Backup JSON */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-4">
        <div className="flex items-center space-x-2 text-slate-100 font-bold">
          <Download className="w-5 h-5 text-brand-400" />
          <h3>Export JSON Backup File</h3>
        </div>
        <p className="text-xs text-slate-400">
          Download a complete offline backup file containing all your solved problems, markdown notes, custom status, and timers.
        </p>
        <button
          onClick={handleExport}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
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

      {/* Danger Zone */}
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
