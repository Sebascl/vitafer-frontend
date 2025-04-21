import * as THREE from "three";

const HeroLights = () => (
  <>
    {/* Soft warm spot light, more sensual feel */}
    <spotLight
      position={[2, 5, 6]}
      angle={0.15}
      penumbra={0.3}
      intensity={80}
      color="#FFB84D" // Warm golden light
    />
    {/* Soft pinkish overhead light */}
    <spotLight
      position={[4, 5, 4]}
      angle={0.3}
      penumbra={0.5}
      intensity={50}
      color="#FF66B2" // Romantic pinkish hue
    />
    {/* Purple side fill for moody atmosphere */}
    <spotLight
      position={[-3, 5, 5]}
      angle={0.4}
      penumbra={1}
      intensity={40}
      color="#9D4EDD" // Deep purple for a sensual, seductive vibe
    />
    {/* Area light with a soft lavender glow */}
    <primitive
      object={new THREE.RectAreaLight("#D5A6EB", 8, 3, 2)} // Lavender color for a gentle soft touch
      position={[1, 3, 4]}
      rotation={[-Math.PI / 4, Math.PI / 4, 0]}
      intensity={20}
    />
    {/* Subtle point light with a deep sensual purple tone */}
    <pointLight position={[0, 1, 0]} intensity={8} color="#7209B7" />
    {/* Another soft point light with a deep blue tone for atmosphere */}
    <pointLight position={[1, 2, -2]} intensity={8} color="#0D00A4" />
  </>
);

export default HeroLights;
