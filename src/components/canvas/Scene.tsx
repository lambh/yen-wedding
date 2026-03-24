"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import InfiniteCanvas from "./InfiniteCanvas";
import { Loader } from "@react-three/drei";
import FallbackExperience from "../ui/FallbackExperience";

export default function Scene() {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) setWebglSupported(false);
  }, []);

  if (!webglSupported) return <FallbackExperience />;

  return (
    <div className="canvas-container" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0a0a0c"]} />
        <fogExp2 attach="fog" args={["#0a0a0c", 0.03]} />
        
        <ambientLight intensity={0.4} color="#ffffff" />
        <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <spotLight position={[-10, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} color="#ffd4a3" />
        
        <Suspense fallback={null}>
          <InfiniteCanvas />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}
