export default function LoadingSpinner({
  size = 'medium',
}: {
  size?: 'small' | 'medium' | 'large';
}) {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-6 w-6 border-2',
    large: 'h-10 w-10 border-4',
  };

  return (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-primary border-t-transparent`}
    ></div>
  );
}
