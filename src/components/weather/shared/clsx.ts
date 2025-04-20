// Minimal clsx utility for combining class names (no dependency needed)
export function clsx(...args: (string | undefined | false | null)[]) {
  return args.filter(Boolean).join(' ');
}
