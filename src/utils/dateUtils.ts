import i18next from 'i18next';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const locale = i18next.language || 'en';
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const locale = i18next.language || 'en';
  return date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Returns a string representing how long ago the date was
 * @param date The date to calculate time ago from
 * @returns A formatted string like "2 minutes ago" or "just now"
 */
export function timeAgo(date: Date | null): string {
  const locale = i18next.language || 'en';
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (!date) {
    return rtf.format(0, 'seconds');
  }
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) {
    return rtf.format(0, 'seconds');
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return rtf.format(-minutes, 'minutes');
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return rtf.format(-hours, 'hours');
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return rtf.format(-days, 'days');
  }
  return formatDate(date.toISOString());
}
