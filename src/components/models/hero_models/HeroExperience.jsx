import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import Particles from "./Particles";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [videoTexture, setVideoTexture] = useState(null);
  const videoRef = useRef(null);
  const interactionListenerAttached = useRef(false);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/images/video1.mp4";
    video.loop = true;
    video.muted = true;
    video.setAttribute('playsinline', 'true');
    video.crossOrigin = 'anonymous';
    videoRef.current = video;

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    setVideoTexture(texture);

    const attemptPlay = () => {
       if (videoRef.current && videoRef.current.paused) {
          videoRef.current.play().catch(error => {
             console.warn("Autoplay/Play prevented:", error);
             if (!interactionListenerAttached.current && error.name === "NotAllowedError") {
                 const handleFirstInteraction = () => {
                     attemptPlay(); // Reintenta reproducir en la primera interacción
                     window.removeEventListener('click', handleFirstInteraction, true);
                     window.removeEventListener('touchstart', handleFirstInteraction, true);
                     interactionListenerAttached.current = false;
                 };
                 window.addEventListener('click', handleFirstInteraction, { once: true, capture: true });
                 window.addEventListener('touchstart', handleFirstInteraction, { once: true, capture: true });
                 interactionListenerAttached.current = true;
             }
          });
       }
    };

    attemptPlay(); // Intento inicial

    video.style.position = 'fixed';
    video.style.top = '-9999px';
    video.style.left = '-9999px';
    document.body.appendChild(video);

    return () => {
        // La limpieza de los listeners con {once: true} es automática en navegadores modernos
        // Si se necesitaran remover manualmente, se haría aquí.
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.removeAttribute('src');
            videoRef.current.load();
            if (document.body.contains(videoRef.current)) {
                document.body.removeChild(videoRef.current);
            }
            videoRef.current = null;
        }
        if (texture) {
            texture.dispose();
        }
        setVideoTexture(null);
        interactionListenerAttached.current = false;
    };
  }, []);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(e => console.error("Error playing on click:", e));
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
      <ambientLight intensity={0.2} color="#FFB84D" />
      <directionalLight intensity={0.4} color="#FF66B2" position={[10, 10, 10]} />

      <Suspense fallback={null}>
        <Particles count={150} color="#FF66B2" size={1.5} position={[0, 0, -15]} />

        {videoTexture && (
          <mesh
            position={isMobile ? [0, -3, -5] : [0, 0, -8]}
            scale={isMobile ? [12, 6, 1] : [20, 12, 1]}
            onClick={handleVideoClick}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={videoTexture} side={THREE.DoubleSide} />
          </mesh>
        )}
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;