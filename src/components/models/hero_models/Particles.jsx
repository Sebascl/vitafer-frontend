import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

const Particles = ({ count = 200 }) => {
  const mesh = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          Math.random() * 10 + 5,
          (Math.random() - 0.5) * 10,
        ],
        speed: 0.003 + Math.random() * 0.002,
        offset: Math.random() * 100,
      });
    }
    return temp;
  }, [count]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const positions = mesh.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      let p = particles[i];

      p.position[1] -= p.speed;
      if (p.position[1] < -2) {
        p.position[1] = Math.random() * 10 + 5;
      }

      const x = p.position[0] + Math.sin(time * 0.5 + i) * 0.05;
      const y = p.position[1];
      const z = p.position[2] + Math.cos(time * 0.5 + i) * 0.05;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;

    // Rotación sexy lenta
    mesh.current.rotation.y += 0.0005;
    mesh.current.rotation.x += 0.0003;
  });

  const positions = new Float32Array(count * 3);
  particles.forEach((p, i) => {
    positions[i * 3] = p.position[0];
    positions[i * 3 + 1] = p.position[1];
    positions[i * 3 + 2] = p.position[2];
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        transparent
        opacity={0.85}
        depthWrite={false}
        vertexColors={false}
        color="#ff4da6" // rosado fucsia sensual 🔥
      />
    </points>
  );
};

export default Particles;
