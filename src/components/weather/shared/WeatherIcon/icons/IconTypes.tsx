export type WeatherIconType =
  | 'sun'
  | 'clear-day'
  | 'moon'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy'
  | 'partly-cloudy-night'
  | 'cloud'
  | 'cloudy'
  | 'cloud-rain'
  | 'rain'
  | 'cloud-snow'
  | 'snow'
  | 'cloud-lightning'
  | 'thunderstorm'
  | 'cloud-fog'
  | 'fog'
  | 'drizzle'
  | 'heavy-rain'
  | 'sleet'
  | 'wind'
  | 'hail';

export type IconSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface WeatherIconProps {
  type: string;
  size?: IconSize;
  className?: string;
  animated?: boolean;
  withGlow?: boolean;
  role?: string;
  'aria-label'?: string;
}

export const getIconColorClass = (type: string): string => {
  if (type.includes('sun')) return 'text-yellow-300';
  if (type.includes('cloud') && !type.includes('night')) return 'text-gray-100';
  if (type.includes('rain')) return 'text-blue-300';
  if (type.includes('snow')) return 'text-blue-100';
  if (type.includes('thunder') || type.includes('lightning')) return 'text-yellow-300';
  if (type.includes('fog')) return 'text-gray-300';
  if (type.includes('night') || type.includes('moon')) return 'text-indigo-200';
  if (type === 'partly-cloudy-day') return 'text-gray-100';
  if (type === 'partly-cloudy-night') return 'text-indigo-100';
  return 'text-white/80';
};

export const getGlowColor = (type: string, enabled: boolean) => {
  if (!enabled) return 'none';

  if (type.includes('sun')) return '0 0 20px rgba(250, 204, 21, 0.5)';
  if (type.includes('cloud-rain')) return '0 0 20px rgba(96, 165, 250, 0.3)';
  if (type.includes('cloud-snow')) return '0 0 20px rgba(226, 232, 240, 0.3)';
  if (type.includes('cloud-lightning')) return '0 0 20px rgba(250, 204, 21, 0.4)';
  if (type.includes('cloud')) return '0 0 20px rgba(203, 213, 225, 0.3)';

  return '0 0 20px rgba(255, 255, 255, 0.3)';
};
