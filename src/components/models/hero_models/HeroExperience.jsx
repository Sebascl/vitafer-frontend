import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [videoTexture, setVideoTexture] = useState(null);
  const videoRef = useRef(null);
  const interactionListenerAttached = useRef(false);

  const videoSources = [
    "/images/video1.mp4",
    "/images/video2.mp4",
    "/images/video3.mp4",
    "/images/video4.mp4",
    "/images/video5.mp4",
    "/images/video6.mp4",
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = videoSources[currentVideoIndex];
    video.muted = true;
    video.setAttribute('playsinline', 'true');
    video.crossOrigin = 'anonymous';
    videoRef.current = video;

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    texture.colorSpace = THREE.SRGBColorSpace;
    setVideoTexture(texture);
    
    const playNextVideo = () => {
        setCurrentVideoIndex(prevIndex => (prevIndex + 1) % videoSources.length);
    };
    
    video.addEventListener('ended', playNextVideo);

    const attemptPlay = () => {
       if (videoRef.current && videoRef.current.paused) {
         videoRef.current.play().catch(error => {
           if (error.name === "NotAllowedError" && !interactionListenerAttached.current) {
               const handleFirstInteraction = () => {
                   attemptPlay();
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

    attemptPlay();

    video.style.position = 'fixed';
    video.style.top = '-9999px';
    video.style.left = '-9999px';
    document.body.appendChild(video);

    return () => {
        if (videoRef.current) {
            videoRef.current.removeEventListener('ended', playNextVideo);
            videoRef.current.pause();
            if (document.body.contains(videoRef.current)) {
                document.body.removeChild(videoRef.current);
            }
        }
        if (texture) {
            texture.dispose();
        }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = videoSources[currentVideoIndex];
      videoRef.current.load();
      videoRef.current.play().catch(e => console.warn("Play after src change was prevented.", e));
    }
  }, [currentVideoIndex, videoSources]);

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
    <Canvas camera={{ position: [0, 0, 15], fov: 45 }} flat>
      <Suspense fallback={null}>
        {videoTexture && (
          <mesh
            position={isMobile ? [0, -3, -5] : [0, 0, -8]}
            scale={isMobile ? [12, 6, 1] : [20, 12, 1]}
            onClick={handleVideoClick}
          >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial 
              emissive="#ffffff"
              emissiveMap={videoTexture}
              side={THREE.DoubleSide} 
            />
          </mesh>
        )}
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;