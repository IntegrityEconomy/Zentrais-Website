export function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(n: number) {
  return `$${Math.round(n)}`;
}

export function parseTimeAgoToMinutes(timeAgo: string): number {
  const s = timeAgo.trim().toLowerCase();
  if (s.includes('yesterday')) return 24 * 60;

  const m = s.match(/(\d+)\s*(min|m|hour|h|day|d)/i);
  if (!m) return Number.MAX_SAFE_INTEGER;

  const value = Number(m[1]);
  const unit = m[2].toLowerCase();

  if (unit === 'min' || unit === 'm') return value;
  if (unit === 'hour' || unit === 'h') return value * 60;
  if (unit === 'day' || unit === 'd') return value * 24 * 60;

  return Number.MAX_SAFE_INTEGER;
}

export const getCurrentTimeString = () => {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

export const getCurrentTimeStringWithAmPm = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};