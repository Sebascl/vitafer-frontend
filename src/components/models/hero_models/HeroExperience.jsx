import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import Particles from "./Particles";
import { Suspense, useEffect, useState, useRef } from "react";
import * as THREE from "three";

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [videoTexture, setVideoTexture] = useState(null);

  // Crear y configurar la textura de video
  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/images/video1.mp4";  // Ruta del video
    video.loop = true;  // Aseguramos que el video esté en loop
    video.muted = true;
    video.play();

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    setVideoTexture(texture); // Establece la textura del video

    return () => {
      // No pausar el video al desmontar el componente
      video.src = "";
    };
  }, []);

  // Referencia para OrbitControls
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enableZoom = false; // Deshabilitar zoom
    }
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
      <ambientLight intensity={0.2} color="#FFB84D" />
      <directionalLight intensity={0.4} color="#FF66B2" position={[10, 10, 10]} />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}  // Esto deshabilita el zoom por completo
        maxDistance={20}
        minDistance={5}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 10}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2.2}
      />

      <Suspense fallback={null}>
        {/* Partículas, asegurándonos de que estén detrás del video (ajustar el valor Z a algo más grande) */}
        <Particles count={150} color="#FF66B2" size={1.5} position={[0, 0, -15]} />

        {/* Video fondo */}
        {videoTexture && (
          <mesh position={isMobile ? [0, 0, -5] : [0, 0, -8]} scale={isMobile ? [10, 6, 1] : [17, 10, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={videoTexture} />
          </mesh>
        )}
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
