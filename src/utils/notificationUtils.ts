// Notification Utility for Placement Tracker PWA

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notifications.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendTestPushNotification = async (): Promise<boolean> => {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    alert('Please allow notification permissions in your browser settings to receive daily reminders.');
    return false;
  }

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('Placement Tracker Daily Reminder 🚀', {
        body: '🔥 Test Notification Active! Keep your daily 10 DSA questions streak going.',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [200, 100, 200],
        tag: 'daily-reminder-test'
      } as any);
      return true;
    } catch {
      // Fallback to standard web Notification
      new Notification('Placement Tracker Daily Reminder 🚀', {
        body: '🔥 Test Notification Active! Keep your daily 10 DSA questions streak going.',
        icon: '/favicon.svg'
      });
      return true;
    }
  } else {
    new Notification('Placement Tracker Daily Reminder 🚀', {
      body: '🔥 Test Notification Active! Keep your daily 10 DSA questions streak going.',
      icon: '/favicon.svg'
    });
    return true;
  }
};

export const checkAndTriggerDailyReminder = (reminderTime: string, lastSentDate: string | null): boolean => {
  if (Notification.permission !== 'granted') return false;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  if (lastSentDate === todayStr) return false; // Already sent today

  const [hours, minutes] = reminderTime.split(':').map(Number);
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  if (currentHours > hours || (currentHours === hours && currentMinutes >= minutes)) {
    sendTestPushNotification();
    return true;
  }

  return false;
};
