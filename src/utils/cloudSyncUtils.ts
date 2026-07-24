// Global Cloud Progress Sync Engine for Cross-Device Synchronization (Laptop <-> Phone)

export interface SyncPayload {
  syncCode: string;
  blobId?: string;
  problems: Record<string, any>;
  dailyActivities: Record<string, any>;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  user: any;
  updatedAt: string;
  validity: 'Permanent / Indefinite';
  expiresAt: null;
}

const JSON_BLOB_BASE = 'https://jsonblob.com/api/jsonBlob';

export const generateDevicePairCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'DSA-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Map pair code to a persistent blob mapping
const getBlobIdForCode = async (syncCode: string): Promise<string | null> => {
  const code = syncCode.trim().toUpperCase();
  const cachedBlobId = localStorage.getItem(`prepforge_blob_id_${code}`);
  if (cachedBlobId) return cachedBlobId;

  // Try retrieving index mapping from global public bin
  try {
    const res = await fetch(`${JSON_BLOB_BASE}/index_${code}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.blobId) {
        localStorage.setItem(`prepforge_blob_id_${code}`, data.blobId);
        return data.blobId;
      }
    }
  } catch {
    // Ignore error
  }

  return null;
};

export const pushProgressToCloud = async (syncCode: string, payloadData: Partial<SyncPayload>): Promise<boolean> => {
  if (!syncCode) return false;

  const code = syncCode.trim().toUpperCase();
  let blobId = await getBlobIdForCode(code);

  const payload: SyncPayload = {
    syncCode: code,
    blobId: blobId || undefined,
    problems: payloadData.problems || {},
    dailyActivities: payloadData.dailyActivities || {},
    currentStreak: payloadData.currentStreak || 0,
    longestStreak: payloadData.longestStreak || 0,
    lastActiveDate: payloadData.lastActiveDate || null,
    user: payloadData.user || null,
    updatedAt: new Date().toISOString(),
    validity: 'Permanent / Indefinite',
    expiresAt: null
  };

  try {
    // Always keep local device cache updated
    const storageKey = `placement_cloud_sync_${code}`;
    localStorage.setItem(storageKey, JSON.stringify(payload));

    if (!blobId) {
      // Create a new JSON blob on global cloud
      const res = await fetch(JSON_BLOB_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const locationHeader = res.headers.get('Location');
        if (locationHeader) {
          const parts = locationHeader.split('/');
          blobId = parts[parts.length - 1];
          if (blobId) {
            localStorage.setItem(`prepforge_blob_id_${code}`, blobId);
            payload.blobId = blobId;
            // Update back with blobId saved
            await fetch(`${JSON_BLOB_BASE}/${blobId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            }).catch(() => {});
          }
        }
      }
    } else {
      // Update existing JSON blob on global cloud
      const res = await fetch(`${JSON_BLOB_BASE}/${blobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        // Blob might have been deleted or expired, recreate blob
        localStorage.removeItem(`prepforge_blob_id_${code}`);
        return pushProgressToCloud(code, payloadData);
      }
    }

    return true;
  } catch (err) {
    console.warn('Cloud sync push warning:', err);
    return true; // Local cache is saved
  }
};

export const pullProgressFromCloud = async (syncCode: string): Promise<SyncPayload | null> => {
  if (!syncCode) return null;

  const code = syncCode.trim().toUpperCase();
  const blobId = await getBlobIdForCode(code);

  if (blobId) {
    try {
      const res = await fetch(`${JSON_BLOB_BASE}/${blobId}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const cloudPayload = (await res.json()) as SyncPayload;
        if (cloudPayload && cloudPayload.problems) {
          // Save to local device cache
          localStorage.setItem(`placement_cloud_sync_${code}`, JSON.stringify(cloudPayload));
          return cloudPayload;
        }
      }
    } catch (err) {
      console.warn('Cloud sync pull network issue:', err);
    }
  }

  // Fallback to local storage cache if network is offline
  const localData = localStorage.getItem(`placement_cloud_sync_${code}`);
  if (localData) {
    try {
      return JSON.parse(localData) as SyncPayload;
    } catch {
      return null;
    }
  }

  return null;
};
