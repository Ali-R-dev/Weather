interface SunnyEffectProps {
  isDay: boolean;
}

const SunnyEffect = ({ isDay }: SunnyEffectProps) => {
  if (!isDay) {
    // Night clear sky with stars
    return (
      <div className="night-clear-container">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${1 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    );
  }

  // Day sunny effect with subtle sun rays
  return (
    <div className="sunny-container">
      <div className="sun-rays" />
    </div>
  );
};

export default SunnyEffect;
