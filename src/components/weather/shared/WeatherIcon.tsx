import React from "react";
import { motion } from "framer-motion";

type IconSize = "sm" | "md" | "lg" | "xl" | "xxl";

interface WeatherIconProps {
  type: string;
  size?: IconSize;
  className?: string;
  animated?: boolean;
  withGlow?: boolean;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({
  type,
  size = "md",
  className = "",
  animated = false,
  withGlow = false,
}) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
    xxl: "w-24 h-24",
  };

  const baseClass = `${sizeClasses[size]} ${className}`;

  // Determine glow color based on weather type
  const getGlowColor = () => {
    if (!withGlow) return "none";

    if (type.includes("sun")) return "0 0 20px rgba(250, 204, 21, 0.5)";
    if (type.includes("cloud-rain")) return "0 0 20px rgba(96, 165, 250, 0.3)";
    if (type.includes("cloud-snow")) return "0 0 20px rgba(226, 232, 240, 0.3)";
    if (type.includes("cloud-lightning"))
      return "0 0 20px rgba(250, 204, 21, 0.4)";
    if (type.includes("cloud")) return "0 0 20px rgba(203, 213, 225, 0.3)";

    return "0 0 20px rgba(255, 255, 255, 0.3)";
  };

  // Get animation variants based on weather type
  const getAnimationProps = () => {
    if (!animated) return {};

    if (type.includes("sun")) {
      return {
        animate: {
          rotate: 360,
          scale: [1, 1.05, 1],
        },
        transition: {
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, repeatType: "reverse" },
        },
      };
    }

    if (type.includes("cloud")) {
      return {
        animate: {
          x: [0, 5, 0, -5, 0],
        },
        transition: {
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        },
      };
    }

    if (type.includes("lightning")) {
      return {
        animate: {
          opacity: [1, 0.7, 1, 0.9, 1],
          scale: [1, 1.02, 1, 1.01, 1],
        },
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        },
      };
    }

    return {
      animate: { scale: [1, 1.03, 1] },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      },
    };
  };

  // Wrap icon in motion.div if animated
  const IconWrapper = ({ children }: { children: React.ReactNode }) => {
    if (animated || withGlow) {
      return (
        <motion.div
          style={{
            display: "inline-block",
            filter: getGlowColor(),
          }}
          {...getAnimationProps()}
        >
          {children}
        </motion.div>
      );
    }

    return <>{children}</>;
  };

  // Render the appropriate icon based on the type
  const renderIcon = () => {
    switch (type) {
      case "sun":
      case "clear-day":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${baseClass} text-yellow-300`}
          >
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        );

      case "moon":
      case "clear-night":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${baseClass} text-indigo-200`}
          >
            <path
              fillRule="evenodd"
              d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
              clipRule="evenodd"
            />
          </svg>
        );

      case "partly-cloudy-day":
      case "partly-cloudy":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${baseClass} text-gray-100`}
          >
            <path d="M4.5 10.5c-.83 0-1.573.38-2.068.986A.75.75 0 011.5 10.5H1a.75.75 0 01-.75-.75A8.25 8.25 0 018.5 1h.75a.75.75 0 01.75.75v.25a.75.75 0 01-.75.75h-1A6.75 6.75 0 002.5 9v1.5z" />
            <path
              fillRule="evenodd"
              d="M3.75 16.5a3.75 3.75 0 013.75-3.75h6a3.75 3.75 0 013.75 3.75v1.5a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-1.5zM9 12a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 019 12zm3.75-.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zm3.75.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        );

      case "partly-cloudy-night":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${baseClass} text-indigo-100`}
          >
            <path
              d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M7.5 9.75a3 3 0 0 0-3 3v4.5a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-9Z"
              clipRule="evenodd"
            />
          </svg>
        );

      case "cloud":
      case "cloudy":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${baseClass} text-gray-100`}
          >
            <path
              fillRule="evenodd"
              d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
              clipRule="evenodd"
            />
          </svg>
        );

      case "cloud-rain":
      case "rain":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${baseClass} text-blue-300`}
          >
            <path
              fillRule="evenodd"
              d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
              clipRule="evenodd"
            />
            <path d="M3.75 14.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75z" />
          </svg>
        );

      case "cloud-snow":
      case "snow":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${baseClass} text-blue-100`}
          >
            <path
              fillRule="evenodd"
              d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
              clipRule="evenodd"
            />
            <path d="M3.75 15.75a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H4.5a.75.75 0 00-.75.75v.008zm2.25-3a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75v-.008zm3 3a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H9.75a.75.75 0 00-.75.75v.008z" />
          </svg>
        );

      case "cloud-lightning":
      case "thunderstorm":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${baseClass} text-yellow-300`}
          >
            <path
              fillRule="evenodd"
              d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
              clipRule="evenodd"
            />
          </svg>
        );

      case "cloud-fog":
      case "fog":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${baseClass} text-gray-300`}
          >
            <path
              fillRule="evenodd"
              d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
              clipRule="evenodd"
            />
            <path
              d="M3.75 12h16.5M3.75 16.5h16.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        );

      case "drizzle":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${baseClass} text-blue-200`}
          >
            <path
              fillRule="evenodd"
              d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
              clipRule="evenodd"
            />
            <path d="M3.75 14.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-1.5zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-1.5zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-1.5z" />
          </svg>
        );

      case "heavy-rain":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${baseClass} text-blue-400`}
          >
            <path
              fillRule="evenodd"
              d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
              clipRule="evenodd"
            />
            <path d="M3.75 14.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-4.5zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-4.5zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-4.5z" />
          </svg>
        );

      case "sleet":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${baseClass} text-blue-200`}
          >
            <path
              fillRule="evenodd"
              d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
              clipRule="evenodd"
            />
            <path d="M3.75 14.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-2.25zm4.5-3a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75h-.008zM9 16.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v-.008zm-2.25-4.5a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V12.75a.75.75 0 00-.75-.75h-.008z" />
          </svg>
        );

      case "wind":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${baseClass} text-gray-200`}
          >
            <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
            <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
          </svg>
        );

      case "hail":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${baseClass} text-blue-100`}
          >
            <path
              fillRule="evenodd"
              d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
              clipRule="evenodd"
            />
            <circle cx="6" cy="16" r="1" fill="currentColor" />
            <circle cx="10" cy="16" r="1" fill="currentColor" />
            <circle cx="14" cy="16" r="1" fill="currentColor" />
            <circle cx="8" cy="20" r="1" fill="currentColor" />
            <circle cx="12" cy="20" r="1" fill="currentColor" />
          </svg>
        );

      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${baseClass} text-white/80`}
          >
            <path
              fillRule="evenodd"
              d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return <IconWrapper>{renderIcon()}</IconWrapper>;
};

export default WeatherIcon;
