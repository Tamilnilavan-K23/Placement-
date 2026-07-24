import QRCode from 'qrcode';

export interface QrSyncPayload {
  version: string;
  problems: Record<string, { c?: number; f?: number; s?: string; n?: string; completed?: boolean; favorite?: boolean; notes?: string; status?: string }>;
  streak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  dailyActivities: Record<string, any>;
  exportedAt: string;
}

export const generateQrPayloadDataUrl = async (state: any): Promise<string> => {
  // Compress problem payload to include only essential progress fields
  const slimProblems: Record<string, any> = {};
  if (state.problems) {
    Object.keys(state.problems).forEach(pid => {
      const p = state.problems[pid];
      if (p.completed || p.favorite || (p.notes && p.notes.trim()) || (p.status && p.status !== 'pending')) {
        slimProblems[pid] = {
          c: p.completed ? 1 : 0,
          f: p.favorite ? 1 : 0,
          s: p.status || 'pending',
          n: p.notes || undefined
        };
      }
    });
  }

  const payload: QrSyncPayload = {
    version: '1.0',
    problems: slimProblems,
    streak: state.currentStreak || 0,
    longestStreak: state.longestStreak || 0,
    lastActiveDate: state.lastActiveDate || null,
    dailyActivities: state.dailyActivities || {},
    exportedAt: new Date().toISOString()
  };

  const jsonStr = JSON.stringify(payload);
  const base64Data = btoa(encodeURIComponent(jsonStr));

  // Build the target sync URL that opens PrepForge with auto-import hash
  const baseUrl = window.location.origin + window.location.pathname;
  const fullSyncUrl = `${baseUrl}#qrSync=${base64Data}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(fullSyncUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
    return qrDataUrl;
  } catch (err) {
    console.error('QR generation error:', err);
    return '';
  }
};

export const parseQrSyncData = (base64Str: string): QrSyncPayload | null => {
  try {
    const jsonStr = decodeURIComponent(atob(base64Str));
    const parsed = JSON.parse(jsonStr) as QrSyncPayload;
    if (parsed && parsed.problems) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};
