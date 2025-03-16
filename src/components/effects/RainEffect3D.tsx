import { useEffect, useRef } from "react";
import * as THREE from "three";

interface RainEffect3DProps {
  intensity: "light" | "medium" | "heavy";
}

export default function RainEffect3D({ intensity }: RainEffect3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const raindropsRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 200;
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Create raindrops
    const particleCount =
      intensity === "light" ? 1500 : intensity === "medium" ? 3000 : 5000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      // Position raindrops randomly
      positions[i * 3] = Math.random() * 400 - 200; // x
      positions[i * 3 + 1] = Math.random() * 500 - 150; // y
      positions[i * 3 + 2] = Math.random() * 400 - 200; // z

      // Raindrop velocity
      velocities.push({
        x: -1 - Math.random(),
        y: -10 - Math.random() * 10,
        z: 0,
      });
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Create raindrop material with custom shader for elongated drops
    const material = new THREE.PointsMaterial({
      color: 0xaaaaff,
      size: 1.5,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    // Create the particle system
    const raindrops = new THREE.Points(particles, material);
    scene.add(raindrops);
    raindropsRef.current = raindrops;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (!raindrops) return;

      const positions = raindrops.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Update positions based on velocity
        positions[i * 3] += velocities[i].x;
        positions[i * 3 + 1] += velocities[i].y;
        positions[i * 3 + 2] += velocities[i].z;

        // Respawn raindrops that fall below the view
        if (positions[i * 3 + 1] < -200) {
          positions[i * 3] = Math.random() * 400 - 200;
          positions[i * 3 + 1] = 200;
          positions[i * 3 + 2] = Math.random() * 400 - 200;
        }
      }

      raindrops.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      if (renderer && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      // Dispose of Three.js objects
      if (raindrops) {
        raindrops.geometry.dispose();
        (raindrops.material as THREE.Material).dispose();
      }
      renderer?.dispose();
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}
