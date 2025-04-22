import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import Particles from "./Particles";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [videoTexture, setVideoTexture] = useState(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/images/video1.mp4";
    video.loop = true;
    video.muted = true;
    video.play();

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    setVideoTexture(texture);

    return () => {
      video.src = "";
    };
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
      <ambientLight intensity={0.2} color="#FFB84D" />
      <directionalLight intensity={0.4} color="#FF66B2" position={[10, 10, 10]} />

      <Suspense fallback={null}>
        {/* Partículas de fondo */}
        <Particles count={150} color="#FF66B2" size={1.5} position={[0, 0, -15]} />

        {/* Video de fondo inmóvil */}
        {videoTexture && (
          <mesh
            position={isMobile ? [0, -3, -5] : [0, 0, -8]}
            scale={isMobile ? [12, 6, 1] : [20, 12, 1]}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={videoTexture} />
          </mesh>
        )}
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
