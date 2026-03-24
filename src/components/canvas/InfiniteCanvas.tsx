"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll, Html } from "@react-three/drei";
import { motion } from "framer-motion";
import InteractivePhoto from "./InteractivePhoto";

export default function InfiniteCanvas() {
  const { camera, viewport, pointer } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 10));
  const currentPos = useRef(new THREE.Vector3(0, 0, 10));
  const [mounted, setMounted] = useState(false);

  useMemo(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
    }
  }, []);
  
  // Drag state
  const isDragging = useRef(false);
  const startPointer = useRef(new THREE.Vector2());
  const startCameraPos = useRef(new THREE.Vector3());
  
  // Random phase offsets for auto-pan
  const phaseOffsets = useRef({
    x: Math.random() * 100,
    y: Math.random() * 100,
    x2: Math.random() * 100,
    y2: Math.random() * 100,
  });

  // Smooth mouse parallax
  const smoothPointer = useRef(new THREE.Vector2());

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    // Smoothly interpolate the pointer for parallax
    smoothPointer.current.lerp(pointer, 0.1);
    
    // Continuous organic auto-panning when not dragging
    if (!isDragging.current && mounted) {
      // Create a messy, non-linear path using randomized phase offsets
      const px = phaseOffsets.current;
      const driftX = 
        Math.cos(time * 0.013 + px.x) * 0.6 + 
        Math.cos(time * 0.057 + px.x2) * 0.4 + 
        Math.sin(time * 0.123 + px.y) * 0.2; // High freq jitter
        
      const driftY = 
        Math.sin(time * 0.017 + px.y) * 0.6 + 
        Math.sin(time * 0.061 + px.y2) * 0.4 + 
        Math.cos(time * 0.137 + px.x) * 0.2; // High freq jitter

      // Apply the organic drift to the target position
      targetPos.current.x += driftX * delta * 1.2;
      targetPos.current.y += driftY * delta * 1.2;
      
      // Strong Steering logic: Pull back towards center if drifting out of the photo spread
      const limit = 15; // Tightened limit for better visibility
      const pullForce = 3.0 * delta; // Stronger than max possible drift (~1.5)
      
      if (targetPos.current.x > limit) targetPos.current.x -= pullForce;
      if (targetPos.current.x < -limit) targetPos.current.x += pullForce;
      if (targetPos.current.y > limit) targetPos.current.y -= pullForce;
      if (targetPos.current.y < -limit) targetPos.current.y += pullForce;
      
      // Safety snap: If somehow escaped far (e.g. 50+), drift it back faster
      if (Math.abs(targetPos.current.x) > 50) targetPos.current.x *= 0.95;
      if (Math.abs(targetPos.current.y) > 50) targetPos.current.y *= 0.95;
    }

    // Final smoothed camera update
    // We combine the world target position with the smoothed mouse parallax
    const finalTargetX = targetPos.current.x + smoothPointer.current.x * 2.0;
    const finalTargetY = targetPos.current.y + smoothPointer.current.y * 2.0;
    
    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, finalTargetX, 0.05);
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, finalTargetY, 0.05);
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, targetPos.current.z, 0.05);
    
    camera.position.copy(currentPos.current);
  });

  const handlePointerDown = (e: any) => {
    isDragging.current = true;
    startPointer.current.set(e.clientX, e.clientY);
    startCameraPos.current.copy(targetPos.current);
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current) return;
    
    const deltaX = (e.clientX - startPointer.current.x) * 0.01;
    const deltaY = (e.clientY - startPointer.current.y) * 0.01;
    
    targetPos.current.x = startCameraPos.current.x - deltaX;
    targetPos.current.y = startCameraPos.current.y + deltaY;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  useMemo(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("mousedown", handlePointerDown);
      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("mouseup", handlePointerUp);
      
      return () => {
        window.removeEventListener("mousedown", handlePointerDown);
        window.removeEventListener("mousemove", handlePointerMove);
        window.removeEventListener("mouseup", handlePointerUp);
      };
    }
  }, []);

  // Use all 31 wedding photos from public/photos
  const photos = useMemo(() => {
    const photoFiles = [
      "DVH03172_(2).jpg", "DVH03193_(2).jpg", "DVH03276_(2).jpg",
      "DVH03284_(2).jpg", "DVH03292_(2).jpg", "DVH03306_(2).jpg",
      "DVH03327_(2).jpg", "DVH03349_(2).jpg", "DVH03374_(2).jpg",
      "DVH03440_(2).jpg", "DVH03465_(2).jpg", "DVH03474_(2).jpg",
      "DVH03480_(2).jpg", "DVH03514_(2).jpg", "DVH03531_(2).jpg",
      "DVH03578_(2).jpg", "DVH03757_(2).jpg", "DVH03763_(2).jpg",
      "DVH03787_(2).jpg", "DVH03846_(2).jpg", "DVH03929_(2).jpg",
      "DVH03995.jpg", "DVH03997.jpg", "DVH04052.jpg",
      "DVH04083.jpg", "DVH04097.jpg", "DVH04136.jpg",
      "DVH04158.jpg", "DVH04177.jpg", "DVH04178.jpg",
      "DVH04208.jpg"
    ];

    return photoFiles.map((file, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 40, // Increased spread area
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      url: `/photos/${file}`,
    }));
  }, []);

  if (!mounted) return null;

  return (
    <>
      {photos.map((photo) => (
        <InteractivePhoto key={photo.id} position={photo.position} url={photo.url} />
      ))}
    </>
  );
}
