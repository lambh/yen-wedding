"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { LiquidShader } from "../../shaders/liquid";

interface InteractivePhotoProps {
  position: [number, number, number];
  url: string;
}

export default function InteractivePhoto({ position, url }: InteractivePhotoProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useTexture(url);
  const [hovered, setHovered] = useState(false);
  const targetHover = useRef(0);
  const currentHover = useRef(0);

  // Shader material setup
  const materialParams = {
    ...LiquidShader,
    uniforms: {
      ...THREE.UniformsUtils.clone(LiquidShader.uniforms),
      tDiffuse: { value: texture },
    },
  };

  useFrame((state, delta) => {
    // Smooth transition for hover effect
    targetHover.current = hovered ? 1 : 0;
    currentHover.current = THREE.MathUtils.lerp(currentHover.current, targetHover.current, 0.1);
    
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uHover.value = currentHover.current;
    material.uniforms.uTime.value = state.clock.getElapsedTime();
    
    // Update mouse position in local UV space
    if (hovered) {
      material.uniforms.uMouse.value.set(
        (state.pointer.x + 1) / 2, // Map -1,1 to 0,1
        (state.pointer.y + 1) / 2
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[3, 4, 32, 32]} />
      <shaderMaterial attach="material" {...materialParams} transparent />
    </mesh>
  );
}
