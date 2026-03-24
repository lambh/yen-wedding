"use client";

import { motion, useTransform, Variants } from "framer-motion";
import { useState } from "react";
import { useCanvas } from "./DraggableCanvas";
import { Playfair_Display, Inter } from "next/font/google";

const serif = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"] });
const sans = Inter({ subsets: ["latin"] });

interface EventAnchorProps {
  x: number;
  y: number;
  title: string;
  venueName: string;
  address: string;
  time: string;
  lunarDate?: string;
}

export default function EventAnchor({ x: initialX, y: initialY, title, venueName, address, time, lunarDate }: EventAnchorProps) {
  const { x: globalX, y: globalY, focusOn } = useCanvas();

  // Anchors live in the base parallax layer (depth = 1.0)
  const depth = 1.0;
  const parallaxX = useTransform(globalX, (v) => v * depth + initialX);
  const parallaxY = useTransform(globalY, (v) => v * depth + initialY);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    focusOn(initialX, initialY, depth);
  };

  return (
    <motion.div
      style={{
        x: parallaxX,
        y: parallaxY,
      }}
      className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer z-40"
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
      whileHover={{ y: -10 }}
    >
      <div className="w-80 p-8 bg-[#faf9f6]/95 backdrop-blur-sm border border-[#4a3f35]/10 shadow-[20px_20px_60px_rgba(74,63,53,0.08)] relative overflow-hidden group">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/silk-paper.png')]" />
        
        {/* Card corner accents */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#8c3327]/30" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#8c3327]/30" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#8c3327]/30" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#8c3327]/30" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <span className={`${sans.className} tracking-[0.3em] text-[#8c3327] text-[0.65rem] uppercase font-semibold mb-6`}>
            {title}
          </span>
          
          <h2 className={`${serif.className} text-[#4a3f35] text-2xl mb-2 leading-tight group-hover:text-[#8c3327] transition-colors duration-500`}>
            {venueName}
          </h2>
          
          <div className="w-8 h-[1px] bg-[#4a3f35]/20 my-6" />
          
          <p className={`${sans.className} text-[#4a3f35]/60 text-xs tracking-wider mb-6 leading-relaxed uppercase`}>
            {address}
          </p>
          
          <div className="space-y-1">
            <p className={`${serif.className} text-[#4a3f35]/90 text-lg italic`}>
              {time}
            </p>
            {lunarDate && (
              <p className={`${serif.className} text-[#4a3f35]/40 text-sm`}>
                ({lunarDate})
              </p>
            )}
          </div>
        </div>

        {/* Decorative Wax Seal (miniature) */}
        <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-[#8c3327]/10 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity duration-700">
           <span className={`${serif.className} text-[#8c3327] text-sm`}>{title.charAt(0)}</span>
        </div>
      </div>
    </motion.div>
  );
}
