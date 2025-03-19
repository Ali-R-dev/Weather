/**
 * Format a time string to 12-hour format
 */
export const formatTime = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Format a time string to show only hour in 12-hour format
 */
export const formatHour = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
};

/**
 * Format time for a specific timezone
 */
export const formatLocalTime = (timezone?: string) => {
  try {
    if (!timezone) return "";

    return new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "";
  }
};

/**
 * Format date to show only weekday name
 */
export const formatDay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

/**
 * Format date to show month and day
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/**
 * Check if a time is during daytime hours
 */
export const isDaytime = (timeString: string): boolean => {
  const date = new Date(timeString);
  const hour = date.getHours();
  return hour >= 6 && hour < 18;
};

/**
 * Group hours by day for UI organization
 */
export const groupHoursByDay = (
  hours: string[]
): { [key: string]: string[] } => {
  const days: { [key: string]: string[] } = {};

  hours.forEach((time) => {
    const day = new Date(time).toLocaleDateString();
    if (!days[day]) {
      days[day] = [];
    }
    days[day].push(time);
  });

  return days;
};

/**
 * Find index of closest time to current time
 */
export const findCurrentTimeIndex = (times: string[]): number => {
  const now = new Date();
  let closestIndex = 0;
  let smallestDiff = Infinity;

  times.forEach((timeStr, idx) => {
    const timeDate = new Date(timeStr);
    const diff = Math.abs(timeDate.getTime() - now.getTime());
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestIndex = idx;
    }
  });

  return closestIndex;
};
