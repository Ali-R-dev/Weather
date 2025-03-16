import "./WeatherEffects.css";

interface CloudyEffectProps {
  isDay: boolean;
}

const CloudyEffect = ({ isDay }: CloudyEffectProps) => {
  return (
    <div className={`cloudy-container ${isDay ? "day" : "night"}`}>
      <div className="cloud cloud1"></div>
      <div className="cloud cloud2"></div>
      <div className="cloud cloud3"></div>
      <div className="cloud cloud4"></div>
    </div>
  );
};

export default CloudyEffect;
