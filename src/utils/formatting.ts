import { TimeFormat } from "../context/SettingsContext";
import { AppConfig } from "../config/appConfig";

// Define the type for time format options that matches DateTimeFormatOptions
type TimeFormatOptions = {
  hour: "numeric" | "2-digit";
  minute: "2-digit";
  hour12: boolean;
  timeZone?: string;
};

// Define fallback formats in case AppConfig isn't loaded correctly
const FALLBACK_TIME_FORMATS: Record<TimeFormat, TimeFormatOptions> = {
  "12h": {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  },
  "24h": {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  },
};

// Improve the getTimeFormat function to be more robust
const getTimeFormat = (format: TimeFormat): TimeFormatOptions => {
  if (!AppConfig?.timeFormats?.[format]) {
    console.warn(
      "AppConfig not available or invalid format, using fallback formats"
    );
    return FALLBACK_TIME_FORMATS[format];
  }

  const configFormat = AppConfig.timeFormats[format];

  // Validate that the config format matches our expected type
  if (
    typeof configFormat === "object" &&
    (configFormat.hour === "numeric" || configFormat.hour === "2-digit") &&
    configFormat.minute === "2-digit" &&
    typeof configFormat.hour12 === "boolean"
  ) {
    return configFormat as TimeFormatOptions;
  }

  console.warn("Invalid time format in config, using fallback format");
  return FALLBACK_TIME_FORMATS[format];
};

/**
 * Format a time string to 12-hour format
 * @deprecated Use formatTimeWithFormat with user's preferred format instead
 */
export const formatTime = (timeString: string): string => {
  try {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", getTimeFormat("12h"));
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeString || "";
  }
};

/**
 * Format a time string to show only hour in preferred format
 */
export const formatHour = (
  timeString: string,
  format: TimeFormat = "12h"
): string => {
  try {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: format === "12h",
    });
  } catch (error) {
    console.error("Error formatting hour:", error, timeString);
    return "";
  }
};

/**
 * Format a time string with user's preferred format
 */
export const formatTimeWithFormat = (
  timeString: string,
  format: TimeFormat
): string => {
  try {
    if (!timeString) return "";

    const date = new Date(timeString);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("en-US", getTimeFormat(format));
  } catch (error) {
    console.error("Error formatting time with format:", error);
    return timeString || "";
  }
};

/**
 * Format time for a specific timezone with user's preferred format
 */
export const formatLocalTime = (
  timezone?: string,
  format: TimeFormat = "12h"
): string => {
  try {
    if (!timezone) return "";

    const options: TimeFormatOptions = {
      ...getTimeFormat(format),
      timeZone: timezone,
    };

    return new Date().toLocaleTimeString("en-US", options);
  } catch (error) {
    // Common error: invalid timezone - fallback to local time
    try {
      console.warn(`Invalid timezone: ${timezone}, using local time`);
      return new Date().toLocaleTimeString("en-US", getTimeFormat(format));
    } catch (innerError) {
      console.error("Error formatting local time:", innerError);
      return "";
    }
  }
};

/**
 * Format date to show only weekday name
 */
export const formatDay = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { weekday: "short" });
  } catch (error) {
    console.error("Error formatting day:", error);
    return "";
  }
};

/**
 * Format date to show month and day
 */
export const formatDate = (dateString: string): string => {
  try {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString || "";
  }
};

/**
 * Check if a time is during daytime hours
 */
export const isDaytime = (timeString: string): boolean => {
  try {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return true; // Default to daytime on error

    const hour = date.getHours();
    return hour >= 6 && hour < 18;
  } catch (error) {
    console.error("Error checking if daytime:", error);
    return true; // Default to daytime on error
  }
};

/**
 * Group hours by day for UI organization
 */
export const groupHoursByDay = (
  hours: string[]
): { [key: string]: string[] } => {
  try {
    const days: { [key: string]: string[] } = {};

    if (!hours || !Array.isArray(hours)) {
      return days;
    }

    hours.forEach((time) => {
      if (!time) return;

      try {
        const date = new Date(time);
        if (isNaN(date.getTime())) return;

        const day = date.toLocaleDateString();
        if (!days[day]) {
          days[day] = [];
        }
        days[day].push(time);
      } catch (e) {
        // Skip invalid dates silently
      }
    });

    return days;
  } catch (error) {
    console.error("Error grouping hours by day:", error);
    return {};
  }
};

/**
 * Find index of closest time to current time
 */
export const findCurrentTimeIndex = (times: string[]): number => {
  try {
    if (!times || !times.length) return 0;

    const now = new Date().getTime();

    // First validate all times to avoid errors in reduce
    const validTimes = times
      .map((t, idx) => {
        try {
          const time = new Date(t).getTime();
          return { idx, time, valid: !isNaN(time) };
        } catch (e) {
          return { idx, time: 0, valid: false };
        }
      })
      .filter((t) => t.valid);

    if (!validTimes.length) return 0;

    // Find closest time
    const closest = validTimes.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.time - now);
      const currDiff = Math.abs(curr.time - now);
      return currDiff < prevDiff ? curr : prev;
    }, validTimes[0]);

    return closest.idx;
  } catch (error) {
    console.error("Error finding current time index:", error);
    return 0;
  }
};
