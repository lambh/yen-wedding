"use client";

import { motion, useTransform } from "framer-motion";
import { ReactNode } from "react";
import { useCanvas } from "./DraggableCanvas";

interface ParallaxLayerProps {
  children: ReactNode;
  depth: number;
  className?: string;
}

export function ParallaxLayer({ children, depth, className = "" }: ParallaxLayerProps) {
  const { x: globalX, y: globalY } = useCanvas();

  const x = useTransform(globalX, (v) => v * depth);
  const y = useTransform(globalY, (v) => v * depth);

  return (
    <motion.div
      style={{ x, y }}
      className={`absolute top-0 left-0 w-full h-full pointer-events-none ${className}`}
    >
      {children}
    </motion.div>
  );
}
