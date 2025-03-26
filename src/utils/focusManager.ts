import { useEffect, useRef } from "react";

/**
 * Trap focus within a specific container (for modals, dialogs, etc.)
 *
 * @param active Whether the focus trap is active
 * @param ref A ref to the container element
 */
export const useFocusTrap = (
  active: boolean
): React.RefObject<HTMLDivElement> => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    // Find all focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    // Focus the first element when trap is activated
    firstElement.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      // If Shift+Tab on first element, wrap to last
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }

      // If Tab on last element, wrap to first
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Store previously focused element to restore later
    const previousFocus = document.activeElement as HTMLElement;

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus when trap is deactivated
      previousFocus?.focus();
    };
  }, [active]);

  return containerRef;
};

/**
 * Announce messages to screen readers
 */
export const announce = (
  message: string,
  priority: "polite" | "assertive" = "polite"
): void => {
  // Create announcement element if it doesn't exist
  let announcer = document.getElementById("sr-announcer");

  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "sr-announcer";
    announcer.setAttribute("aria-live", priority);
    announcer.setAttribute("aria-atomic", "true");
    announcer.style.position = "absolute";
    announcer.style.width = "1px";
    announcer.style.height = "1px";
    announcer.style.padding = "0";
    announcer.style.margin = "-1px";
    announcer.style.overflow = "hidden";
    announcer.style.clip = "rect(0, 0, 0, 0)";
    announcer.style.whiteSpace = "nowrap";
    announcer.style.border = "0";
    document.body.appendChild(announcer);
  }

  // Set the announcement text
  announcer.textContent = message;
};

/**
 * Handle Escape key press for UI elements like modals, dropdowns, etc.
 */
export const useEscapeKey = (callback: () => void): void => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        callback();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [callback]);
};
