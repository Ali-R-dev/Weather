/**
 * A utility for monitoring performance in the weather app
 */

interface PerformanceMarks {
  [key: string]: number;
}

// Store performance marks
const marks: PerformanceMarks = {};

// Is performance monitoring enabled
let isEnabled = import.meta.env.DEV; // Using Vite's import.meta.env instead of process.env

/**
 * Enable or disable performance monitoring
 */
export const enablePerformanceMonitoring = (enable: boolean): void => {
  isEnabled = enable;
};

/**
 * Mark a performance checkpoint
 */
export const mark = (name: string): void => {
  if (!isEnabled) return;

  marks[name] = performance.now();
  // Also use the built-in performance mark if available
  if (performance.mark) {
    performance.mark(name);
  }
};

/**
 * Measure time between two marks
 */
export const measure = (from: string, to: string, label: string): number | null => {
  if (!isEnabled) return null;

  if (marks[from] && marks[to]) {
    const duration = marks[to] - marks[from];
    console.info(`${label}: ${duration.toFixed(2)}ms`);

    // Use the built-in performance measure if available
    if (performance.measure) {
      try {
        performance.measure(label, from, to);
      } catch (e) {
        // Some browsers throw if marks don't exist or have been cleared
      }
    }

    return duration;
  }

  return null;
};

/**
 * Start tracking a recurring event (like React renders)
 */
export const startRecurringMeasurement = (name: string): (() => void) => {
  if (!isEnabled) return () => {};

  const startTime = performance.now();
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.info(`${name}: ${duration.toFixed(2)}ms`);
  };
};

/**
 * Monitor component render time with React useEffect
 */
export const useComponentPerformance = (componentName: string): (() => void) => {
  if (!isEnabled || typeof window === 'undefined') return () => {}; // Return empty function instead of void

  mark(`${componentName}-render-start`);

  // The cleanup function will be called before the next render or unmount
  return () => {
    mark(`${componentName}-render-end`);
    measure(
      `${componentName}-render-start`,
      `${componentName}-render-end`,
      `${componentName} render time`
    );
  };
};

/**
 * Clear all performance marks
 */
export const clearMarks = (): void => {
  Object.keys(marks).forEach((key) => delete marks[key]);
  if (performance.clearMarks) {
    performance.clearMarks();
  }
};

/**
 * Monitor network requests by weather data type
 */
export const monitorWeatherDataFetch = (type: string): (() => void) => {
  if (!isEnabled) return () => {};

  const startTime = performance.now();
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.info(`Weather data fetch (${type}): ${duration.toFixed(2)}ms`);
  };
};
