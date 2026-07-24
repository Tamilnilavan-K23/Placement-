import React, { useState, useEffect } from 'react';
import { X, QrCode, Copy, Check, Smartphone, ShieldCheck } from 'lucide-react';
import { useTrackerStore } from '../../store/useTrackerStore';
import { generateQrPayloadDataUrl } from '../../utils/qrSyncUtils';

interface QrSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrSyncModal: React.FC<QrSyncModalProps> = ({ isOpen, onClose }) => {
  const store = useTrackerStore();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      generateQrPayloadDataUrl(store).then(dataUrl => {
        setQrCodeUrl(dataUrl);
        setLoading(false);
      });
    }
  }, [isOpen, store]);

  if (!isOpen) return null;

  const syncUrl = window.location.origin + window.location.pathname + '#qrSync=' + (qrCodeUrl ? 'ACTIVE' : '');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(syncUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md my-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-800 bg-gradient-to-b from-brand-600/20 via-slate-900 to-slate-900 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center shadow-lg shadow-brand-500/20 mb-2">
            <QrCode className="w-6 h-6 text-brand-400" />
          </div>

          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Mobile QR Code Sync
          </h2>
          <p className="text-xs text-brand-300 font-semibold mt-0.5">
            Instant Camera Scan • Zero Server Needed
          </p>
        </div>

        <div className="p-6 space-y-5 text-center">
          {/* QR Code Canvas */}
          <div className="p-4 bg-white rounded-2xl shadow-inner inline-block border-4 border-slate-800 relative">
            {loading ? (
              <div className="w-64 h-64 flex items-center justify-center text-slate-900 font-bold text-xs">
                Generating QR Code...
              </div>
            ) : qrCodeUrl ? (
              <img src={qrCodeUrl} alt="PrepForge Sync QR Code" className="w-64 h-64 object-contain mx-auto" />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-slate-900 font-bold text-xs">
                Failed to generate QR Code
              </div>
            )}
          </div>

          <div className="space-y-2 text-left bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center space-x-2 text-slate-200 font-bold">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>How to Scan on Mobile:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li>Open your phone's <b>Camera app</b> or <b>Web Browser</b>.</li>
              <li>Point the camera at this QR Code.</li>
              <li>Tap the pop-up notification link to automatically load & sync your laptop's solved progress!</li>
            </ol>
          </div>

          <div className="pt-1 flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Copy Direct Link'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20"
            >
              Done
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 text-[10px] text-slate-500 flex items-center space-x-2 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>100% offline & encrypted. No data sent to third-party servers.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
