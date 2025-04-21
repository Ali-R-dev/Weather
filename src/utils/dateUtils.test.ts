import { formatDate, formatTime, timeAgo } from './dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats a date string to long format', () => {
      const dateStr = '2020-01-15T00:00:00Z';
      const formatted = formatDate(dateStr);
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
    });
  });

  describe('formatTime', () => {
    it('formats a time string to 12h format', () => {
      const dateStr = '2020-01-15T13:45:00Z';
      const formatted = formatTime(dateStr);
      expect(formatted).toMatch(/1?(:)?45/);
      expect(/AM|PM/i.test(formatted)).toBe(true);
    });
  });

  describe('timeAgo', () => {
    it('returns "just now" for dates less than a minute ago', () => {
      const now = new Date();
      const result = timeAgo(new Date(now.getTime() - 30 * 1000));
      expect(result).toBe('just now');
    });

    it('returns minutes ago correctly', () => {
      const now = new Date();
      const result1 = timeAgo(new Date(now.getTime() - 60 * 1000));
      expect(result1).toBe('1 minute ago');

      const result2 = timeAgo(new Date(now.getTime() - 5 * 60 * 1000));
      expect(result2).toBe('5 minutes ago');
    });

    it('returns hours ago correctly', () => {
      const now = new Date();
      const result1 = timeAgo(new Date(now.getTime() - 60 * 60 * 1000));
      expect(result1).toBe('1 hour ago');

      const result2 = timeAgo(new Date(now.getTime() - 3 * 60 * 60 * 1000));
      expect(result2).toBe('3 hours ago');
    });

    it('returns days ago correctly', () => {
      const now = new Date();
      const result1 = timeAgo(new Date(now.getTime() - 24 * 60 * 60 * 1000));
      expect(result1).toBe('1 day ago');

      const result2 = timeAgo(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000));
      expect(result2).toBe('2 days ago');
    });

    it('falls back to full date for older than 7 days', () => {
      const now = new Date();
      const old = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
      const result = timeAgo(old);
      // Should match formatDate output
      expect(result).toBe(formatDate(old.toISOString()));
    });

    it('returns loading when date is null', () => {
      expect(timeAgo(null)).toBe('Loading...');
    });
  });
});
