import { Metric, onCLS, onFID, onLCP, onFCP, onTTFB } from "web-vitals";

// Store measurements
const measurements: Record<string, number> = {};

// Performance monitoring functions
export const initPerformanceMonitoring = () => {
  // Core Web Vitals
  onCLS((metric: Metric) => {
    console.log("CLS:", metric.value);
    measurements["CLS"] = metric.value;
  });

  onFID((metric: Metric) => {
    console.log("FID:", metric.value);
    measurements["FID"] = metric.value;
  });

  onLCP((metric: Metric) => {
    console.log("LCP:", metric.value);
    measurements["LCP"] = metric.value;
  });

  onFCP((metric: Metric) => {
    console.log("FCP:", metric.value);
    measurements["FCP"] = metric.value;
  });

  onTTFB((metric: Metric) => {
    console.log("TTFB:", metric.value);
    measurements["TTFB"] = metric.value;
  });

  // Custom performance marks
  if (performance.mark) {
    performance.mark("app-init");
  }
};

// Measure component render time
export const measureRender = (componentName: string, startTime: number) => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  console.log(`${componentName} render time:`, duration.toFixed(2), "ms");
  measurements[`${componentName}-render`] = duration;
};

// Measure data fetching
export const measureDataFetch = (operation: string, startTime: number) => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  console.log(`${operation} duration:`, duration.toFixed(2), "ms");
  measurements[`${operation}`] = duration;
};

// Get all measurements
export const getMeasurements = () => {
  return measurements;
};

// Clear measurements
export const clearMeasurements = () => {
  Object.keys(measurements).forEach((key) => {
    delete measurements[key];
  });
};

// Create a performance mark
export const markPerformance = (markName: string) => {
  if (performance.mark) {
    performance.mark(markName);
  }
};

// Measure between two marks
export const measureBetweenMarks = (
  startMark: string,
  endMark: string,
  label: string
) => {
  if (performance.measure) {
    try {
      performance.measure(label, startMark, endMark);
      const entries = performance.getEntriesByName(label);
      if (entries.length > 0) {
        console.log(`${label}:`, entries[0].duration.toFixed(2), "ms");
        measurements[label] = entries[0].duration;
      }
    } catch (e) {
      console.warn("Error measuring performance:", e);
    }
  }
};

// Log long tasks
export const observeLongTasks = () => {
  if ("PerformanceObserver" in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.warn("Long Task detected:", {
          duration: entry.duration,
          startTime: entry.startTime,
          name: entry.name,
        });
      });
    });

    observer.observe({ entryTypes: ["longtask"] });
    return () => observer.disconnect();
  }
  return () => {};
};

// Initialize all performance monitoring
export const initializeAllMonitoring = () => {
  initPerformanceMonitoring();
  observeLongTasks();

  // Log memory usage if available (Chrome only)
  const performance = window.performance as any;
  if (performance?.memory) {
    setInterval(() => {
      console.log("Memory usage:", {
        usedJSHeapSize:
          (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + " MB",
        totalJSHeapSize:
          (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + " MB",
      });
    }, 5000);
  }
};
