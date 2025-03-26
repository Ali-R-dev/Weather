import React, { memo, useRef, useEffect, useState } from "react";
import { useComponentPerformance } from "../../utils/performanceMonitor";

interface OptimizedRenderProps {
  children: React.ReactNode;
  name: string;
  enableLogging?: boolean;
  skipIfOffscreen?: boolean;
}

/**
 * A component wrapper that optimizes rendering with React.memo and
 * provides performance monitoring for wrapped components.
 */
const OptimizedRender: React.FC<OptimizedRenderProps> = ({
  children,
  name,
  enableLogging = import.meta.env.DEV, // Using Vite's import.meta.env instead of process.env
  skipIfOffscreen = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!skipIfOffscreen);

  // Track component rendering performance if logging is enabled
  if (enableLogging) {
    useComponentPerformance(`OptimizedRender(${name})`);
  }

  // Set up intersection observer to skip rendering if component is offscreen
  useEffect(() => {
    if (!skipIfOffscreen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { rootMargin: "200px" } // Load when within 200px of viewport
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [skipIfOffscreen]);

  return (
    <div ref={ref} style={{ willChange: "transform", contain: "content" }}>
      {isVisible && children}
    </div>
  );
};

export default memo(OptimizedRender);
