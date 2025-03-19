import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";
import { useWeather } from "../../context/WeatherContext";
import { getWeatherInfo } from "../../utils/weatherCodeMap";

const PremiumWeatherScene = () => {
  const mountRef = useRef(null);
  const { currentTheme } = useTheme();
  const { weatherData } = useWeather();
  const [sceneReady, setSceneReady] = useState(false);

  // Animation frame reference
  const requestIDRef = useRef(null);

  // Scene references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  // Weather elements - limit the number of objects for better performance
  const cloudsRef = useRef([]);
  const raindropsRef = useRef([]);
  const snowflakesRef = useRef([]);
  const sunRef = useRef(null);
  const moonRef = useRef(null);
  const starsRef = useRef([]);
  const lightningRef = useRef(null);

  // Setup and cleanup the scene
  useEffect(() => {
    if (!mountRef.current || !weatherData) return;

    // Initialize scene with proper background color
    const scene = new THREE.Scene();

    // Use perspective camera with better field of view for weather effects
    const camera = new THREE.PerspectiveCamera(
      75, // Wider field of view to see more effects
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance", // Optimize for performance
    });

    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);

    // Position camera to better view the effects
    camera.position.z = 7; // Move camera further back
    camera.position.y = 1; // Slightly higher position to see rain falling

    // Store references
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Create weather scene based on current weather
    createWeatherScene();

    // Animation loop with performance optimization
    const animate = () => {
      requestIDRef.current = requestAnimationFrame(animate);
      updateWeatherElements();
      renderer.render(scene, camera);
    };

    animate();
    setSceneReady(true);

    // Handle window resize
    const handleResize = () => {
      if (mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };

    window.addEventListener("resize", handleResize);

    // Thorough cleanup
    return () => {
      if (requestIDRef.current) {
        cancelAnimationFrame(requestIDRef.current);
      }

      if (mountRef.current && renderer.domElement) {
        try {
          mountRef.current.removeChild(renderer.domElement);
        } catch (e) {
          console.warn("Error removing renderer:", e);
        }
      }

      window.removeEventListener("resize", handleResize);

      // Clean up all geometries and materials
      cleanupScene();

      // Dispose of renderer to prevent memory leaks
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [weatherData]);

  // Update scene when theme or weather data changes
  useEffect(() => {
    if (sceneReady && weatherData) {
      cleanupScene();
      createWeatherScene();
    }
  }, [
    currentTheme,
    weatherData?.current.weather_code,
    weatherData?.current.is_day,
    sceneReady,
  ]);

  // Create weather elements based on current weather
  const createWeatherScene = () => {
    if (!sceneRef.current || !weatherData) return;

    const scene = sceneRef.current;
    const weatherCode = weatherData.current.weather_code;
    const isDay = weatherData.current.is_day === 1;
    const weatherInfo = getWeatherInfo(weatherCode);

    // Set scene fog based on weather
    if ([45, 48].includes(weatherCode)) {
      // Fog
      scene.fog = new THREE.FogExp2(isDay ? 0xcfd8dc : 0x455a64, 0.1);
    } else if (isDay) {
      scene.fog = null;
    } else {
      scene.fog = new THREE.FogExp2(0x1a1a2e, 0.03);
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(
      isDay ? 0xffffff : 0x3d4e81,
      isDay ? 0.6 : 0.2
    );
    scene.add(ambientLight);

    // Add directional light (sun/moon)
    const directionalLight = new THREE.DirectionalLight(
      isDay ? 0xffff99 : 0xafcdff,
      isDay ? 1 : 0.3
    );
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Create celestial bodies
    if (isDay && [0, 1].includes(weatherCode)) {
      createSun();
    } else if (!isDay) {
      createMoon();
      createStars();
    }

    // Create cloud cover based on weather code
    if (![0, 1].includes(weatherCode) || !isDay) {
      createClouds(weatherCode);
    }

    // Create precipitation
    if (
      [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)
    ) {
      createRain(weatherCode);
    } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
      createSnow(weatherCode);
    }

    // Create lightning for storm conditions
    if ([95, 96, 99].includes(weatherCode)) {
      createLightning();
    }
  };

  // Update weather elements for animation
  const updateWeatherElements = () => {
    if (!sceneRef.current) return;

    // Animate clouds with slow movement
    cloudsRef.current.forEach((cloud) => {
      cloud.rotation.y += 0.0005;
      cloud.position.x += 0.003;

      // Reset cloud position if it moves too far
      if (cloud.position.x > 15) {
        cloud.position.x = -15;
      }
    });

    // Animate raindrops with faster movement for visibility
    raindropsRef.current.forEach((raindrop) => {
      raindrop.position.y -= 0.2; // Faster falling rain

      // Reset raindrop position if it falls below view
      if (raindrop.position.y < -10) {
        raindrop.position.y = 15;
        raindrop.position.x = Math.random() * 20 - 10;
        raindrop.position.z = Math.random() * 10 - 15;
      }
    });

    // Animate snowflakes
    snowflakesRef.current.forEach((snowflake) => {
      snowflake.position.y -= 0.02;
      snowflake.position.x +=
        Math.sin(Date.now() * 0.001 + snowflake.position.z) * 0.01;
      snowflake.rotation.z += 0.01;

      // Reset snowflake position if it falls below view
      if (snowflake.position.y < -5) {
        snowflake.position.y = 5;
        snowflake.position.x = Math.random() * 10 - 5;
        snowflake.position.z = Math.random() * 5 - 2.5;
      }
    });

    // Animate sun
    if (sunRef.current) {
      sunRef.current.rotation.z += 0.001;
    }

    // Animate moon
    if (moonRef.current) {
      moonRef.current.rotation.y += 0.0005;
    }

    // Animate stars
    starsRef.current.forEach((star) => {
      star.material.opacity =
        0.5 + Math.sin(Date.now() * 0.001 + star.position.x) * 0.5;
    });

    // Animate lightning
    if (lightningRef.current) {
      if (Math.random() < 0.005) {
        lightningRef.current.material.opacity = 0.8;
        setTimeout(() => {
          if (lightningRef.current) {
            lightningRef.current.material.opacity = 0;
          }
        }, 100);
      }
    }
  };

  // Create a stylized sun
  const createSun = () => {
    if (!sceneRef.current) return;

    const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xfff4d6,
      transparent: true,
      opacity: 0.9,
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(3, 2, -3);
    sceneRef.current.add(sun);

    // Add sun glow
    const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffeeb0,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide,
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sun.add(glow);

    sunRef.current = sun;
  };

  // Create a stylized moon
  const createMoon = () => {
    if (!sceneRef.current) return;

    const moonGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: 0xe8f3ff,
      roughness: 0.85,
      metalness: 0.1,
      emissive: 0x404f74,
      emissiveIntensity: 0.2,
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(3, 2, -3);
    sceneRef.current.add(moon);

    // Create some craters
    for (let i = 0; i < 5; i++) {
      const craterSize = Math.random() * 0.2 + 0.05;
      const craterGeometry = new THREE.CircleGeometry(craterSize, 16);
      const craterMaterial = new THREE.MeshStandardMaterial({
        color: 0xc1cddb,
        roughness: 0.9,
        metalness: 0.1,
        side: THREE.DoubleSide,
      });

      const crater = new THREE.Mesh(craterGeometry, craterMaterial);

      // Position crater on moon surface
      const phi = Math.random() * Math.PI;
      const theta = Math.random() * Math.PI * 2;

      crater.position.x = 0.8 * Math.sin(phi) * Math.cos(theta);
      crater.position.y = 0.8 * Math.sin(phi) * Math.sin(theta);
      crater.position.z = 0.8 * Math.cos(phi);

      // Orient crater to face outward
      crater.lookAt(0, 0, 0);

      moon.add(crater);
    }

    moonRef.current = moon;
  };

  // Create stars
  const createStars = () => {
    if (!sceneRef.current) return;

    const stars = [];

    for (let i = 0; i < 200; i++) {
      const size = Math.random() * 0.05 + 0.02;
      const starGeometry = new THREE.SphereGeometry(size, 8, 8);
      const starMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: Math.random() * 0.5 + 0.5,
      });

      const star = new THREE.Mesh(starGeometry, starMaterial);

      // Position stars in a dome around the camera
      const phi = Math.acos(Math.random() * 2 - 1);
      const theta = Math.random() * Math.PI * 2;
      const radius = 20;

      star.position.x = radius * Math.sin(phi) * Math.cos(theta);
      star.position.y = radius * Math.sin(phi) * Math.sin(theta);
      star.position.z = radius * Math.cos(phi) - 15; // Push back from camera

      sceneRef.current.add(star);
      stars.push(star);
    }

    starsRef.current = stars;
  };

  // Create stylized clouds
  const createClouds = (weatherCode) => {
    if (!sceneRef.current) return;

    const clouds = [];
    // Determine cloud density based on weather code
    const cloudCount = [2].includes(weatherCode)
      ? 5
      : [3].includes(weatherCode)
      ? 12
      : [45, 48].includes(weatherCode)
      ? 18
      : 8;

    for (let i = 0; i < cloudCount; i++) {
      // Create cloud group
      const cloud = new THREE.Group();

      // Create multiple spheres to form a cloud
      const segments = Math.floor(Math.random() * 3) + 3;
      const cloudSize = Math.random() * 1.5 + 0.5;

      for (let j = 0; j < segments; j++) {
        const size = Math.random() * 0.6 + 0.4;
        const sphereGeometry = new THREE.SphereGeometry(
          size * cloudSize,
          16,
          16
        );

        // Different color based on day/night and weather
        const isDay = weatherData.current.is_day === 1;
        let cloudColor;

        if ([45, 48].includes(weatherCode)) {
          // Fog
          cloudColor = isDay ? 0xcfd8dc : 0x455a64;
        } else if (isDay) {
          cloudColor = 0xffffff;
        } else {
          cloudColor = 0x9fafc4;
        }

        const sphereMaterial = new THREE.MeshStandardMaterial({
          color: cloudColor,
          roughness: 1,
          metalness: 0,
          transparent: true,
          opacity: 0.9,
        });

        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // Position spheres to form cloud shape
        sphere.position.x = j * 0.4 * cloudSize;
        sphere.position.y = Math.random() * 0.2;
        sphere.position.z = Math.random() * 0.5 - 0.25;

        cloud.add(sphere);
      }

      // Position cloud in the scene
      cloud.position.x = Math.random() * 20 - 10;
      cloud.position.y = Math.random() * 2 + 1;
      cloud.position.z = Math.random() * 5 - 7;

      sceneRef.current.add(cloud);
      clouds.push(cloud);
    }

    cloudsRef.current = clouds;
  };

  // Create rain with better visibility
  const createRain = (weatherCode) => {
    if (!sceneRef.current) return;

    const raindrops = [];

    // Determine rain intensity based on weather code - reduced for performance
    const intensity = [51, 56, 61, 80].includes(weatherCode)
      ? 30
      : [53, 57, 63, 66, 81].includes(weatherCode)
      ? 60
      : 100;

    for (let i = 0; i < intensity; i++) {
      const height = Math.random() * 0.3 + 0.2; // Longer raindrops
      const raindropGeometry = new THREE.CylinderGeometry(
        0.02, // Thicker raindrops for visibility
        0.02,
        height,
        6 // Reduced segment count for performance
      );

      const raindropMaterial = new THREE.MeshBasicMaterial({
        // Use basic material instead of standard for performance
        color: 0x88ccff, // Brighter blue color
        transparent: true,
        opacity: 0.7, // Higher opacity for visibility
      });

      const raindrop = new THREE.Mesh(raindropGeometry, raindropMaterial);

      // Tilt the raindrop slightly
      raindrop.rotation.x = Math.PI / 4;

      // Position raindrops in front of camera for better visibility
      raindrop.position.x = Math.random() * 20 - 10;
      raindrop.position.y = Math.random() * 15 + 5; // Position higher up
      raindrop.position.z = Math.random() * 10 - 15; // Position in front of camera

      sceneRef.current.add(raindrop);
      raindrops.push(raindrop);
    }

    raindropsRef.current = raindrops;
  };

  // Create snow
  const createSnow = (weatherCode) => {
    if (!sceneRef.current) return;

    const snowflakes = [];

    // Determine snow intensity based on weather code
    const intensity = [71, 85].includes(weatherCode) ? 50 : 100;

    for (let i = 0; i < intensity; i++) {
      const size = Math.random() * 0.05 + 0.02;
      const snowflakeGeometry = new THREE.OctahedronGeometry(size, 0);
      const snowflakeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
      });

      const snowflake = new THREE.Mesh(snowflakeGeometry, snowflakeMaterial);

      // Position snowflake
      snowflake.position.x = Math.random() * 10 - 5;
      snowflake.position.y = Math.random() * 10 - 5;
      snowflake.position.z = Math.random() * 5 - 2.5;

      sceneRef.current.add(snowflake);
      snowflakes.push(snowflake);
    }

    snowflakesRef.current = snowflakes;
  };

  // Create lightning
  const createLightning = () => {
    if (!sceneRef.current) return;

    // Create a lightning flash plane
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffcc,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });

    const lightning = new THREE.Mesh(planeGeometry, planeMaterial);
    lightning.position.z = -5;

    sceneRef.current.add(lightning);
    lightningRef.current = lightning;

    // Also create rain for storms
    createRain(65); // Heavy rain
  };

  // Clean up scene
  const cleanupScene = () => {
    if (!sceneRef.current) return;

    // Dispose of all scene objects
    while (sceneRef.current.children.length > 0) {
      const object = sceneRef.current.children[0];

      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }

      sceneRef.current.remove(object);
    }

    // Clear references
    cloudsRef.current = [];
    raindropsRef.current = [];
    snowflakesRef.current = [];
    sunRef.current = null;
    moonRef.current = null;
    starsRef.current = [];
    lightningRef.current = null;
  };

  return (
    <div
      ref={mountRef}
      className="premium-3d-scene opacity-90" // Increased opacity for visibility
      style={{ pointerEvents: "none" }}
    />
  );
};

export default PremiumWeatherScene;
