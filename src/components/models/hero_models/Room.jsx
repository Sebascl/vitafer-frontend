import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function Room(props) {
  const { nodes, materials } = useGLTF("/models/optimized-room.glb");
  const screensRef = useRef();

  return (
    <group {...props} dispose={null}>
      <EffectComposer>
        <SelectiveBloom
          selection={screensRef}
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
      </EffectComposer>

      {/* Mesa */}
      <mesh geometry={nodes.table_blinn1_0.geometry} material={materials.blinn1} />

      {/* Monitores */}
      <mesh
        geometry={nodes.monitor2_blinn1_0.geometry}
        material={materials.blinn1}
        ref={screensRef}
      />
      <mesh
        geometry={nodes.monitor3_blinn1_0.geometry}
        material={materials.blinn1}
      />
    </group>
  );
}

useGLTF.preload("/models/optimized-room.glb");
