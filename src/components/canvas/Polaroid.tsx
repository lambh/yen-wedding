"use client";

import { motion, useTransform, useMotionValue } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useCanvas } from "./DraggableCanvas";

interface PolaroidProps {
  id: string;
  x: number;
  y: number;
  url: string;
  rotation?: number;
  caption?: string;
  depth?: number; // E.g., 1.5 for foreground, 1.0 for midground
}

export default function Polaroid({ id, x: initialX, y: initialY, url, rotation = 0, caption, depth = 1 }: PolaroidProps) {
  // Tap into global panning state & focus state
  const { 
    x: globalX, 
    y: globalY, 
    hoveredPhotoId, setHoveredPhotoId, 
    focusedPhotoId, setFocusedPhotoId, 
    focusOn 
  } = useCanvas();

  // Determine State
  const isHovered = hoveredPhotoId === id;
  const isFocused = focusedPhotoId === id;
  
  // If ANY photo is focused, others fade to 0.
  // If ANY photo is hovered, others dim to 0.5 and blur.
  const isAnotherFocused = focusedPhotoId !== null && !isFocused;
  const isAnotherHovered = hoveredPhotoId !== null && !isHovered;

  const targetOpacity = isAnotherFocused ? 0 : isAnotherHovered ? 0.5 : 1;
  const targetFilter = isAnotherHovered && !isAnotherFocused ? "blur(4px)" : "blur(0px)";

  // Calculate parallax offset based on depth. 
  const parallaxX = useTransform(globalX, (v) => v * depth + initialX);
  const parallaxY = useTransform(globalY, (v) => v * depth + initialY);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent background drag click
    
    if (isFocused) {
      // Unfocus if already focused
      setFocusedPhotoId(null);
    } else {
      // Focus this photo
      setFocusedPhotoId(id);
      focusOn(initialX, initialY, depth);
    }
  };

  return (
    <motion.div
      style={{
        x: parallaxX,
        y: parallaxY,
        width: "300px",
      }}
      initial={{ rotate: rotation, scale: 1, opacity: 1, filter: "blur(0px)" }}
      animate={{ 
        rotate: isHovered || isFocused ? 0 : rotation,
        scale: isHovered || isFocused ? 1.05 : 1,
        z: isHovered || isFocused ? 50 : 0,
        opacity: targetOpacity,
        filter: targetFilter
      }}
      onHoverStart={() => {
        if (!focusedPhotoId) setHoveredPhotoId(id);
      }}
      onHoverEnd={() => {
        if (hoveredPhotoId === id) setHoveredPhotoId(null);
      }}
      onClick={handleClick}
      transition={{ type: "spring", stiffness: 300, damping: isFocused ? 25 : 20 }}
      className={`absolute top-0 left-0 bg-white p-4 pb-12 shadow-xl shadow-stone-300/40 cursor-pointer pointer-events-auto ${
        isHovered || isFocused ? "z-50" : "z-40"
      }`}
    >
      <div 
        className="relative bg-stone-100 overflow-hidden" 
        style={{ aspectRatio: "4/5" }}
      >
        <Image
          src={url}
          alt={caption || "Wedding memory"}
          fill
          className="object-cover transition-transform duration-700 hover:scale-110"
          sizes="300px"
        />
        {/* Subtle texture on photo */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
      
      {caption && (
        <div className="mt-4 text-center">
          <span className="font-serif text-stone-600 italic text-lg">{caption}</span>
        </div>
      )}
    </motion.div>
  );
}
