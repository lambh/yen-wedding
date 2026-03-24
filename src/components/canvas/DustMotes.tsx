"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCanvas } from "./DraggableCanvas";

interface Mote {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export default function DustMotes({ count = 100 }: { count?: number }) {
  const [motes, setMotes] = useState<Mote[]>([]);
  const requestRef = useRef<number>(0);
  
  // We can tie these to panning, but keeping them screen-fixed adds to the atmosphere
  // The user requested them to wrap across the canvas to add life.
  
  useEffect(() => {
    const initialMotes: Mote[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100,
      size: Math.random() * 3 + 1, // 1px to 4px
      speedX: (Math.random() - 0.5) * 0.05,
      speedY: (Math.random() - 0.5) * 0.05 - 0.02, // slight upward drift
      opacity: Math.random() * 0.6 + 0.1,
    }));
    setMotes(initialMotes);

    const animate = () => {
      setMotes((prevMotes) =>
        prevMotes.map((mote) => {
          let nx = mote.x + mote.speedX;
          let ny = mote.y + mote.speedY;

          // Wrap around screen
          if (nx > 100) nx = 0;
          if (nx < 0) nx = 100;
          if (ny > 100) ny = 0;
          if (ny < 0) ny = 100;

          return { ...mote, x: nx, y: ny };
        })
      );
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden mix-blend-multiply">
      {motes.map((mote) => (
        <div
          key={mote.id}
          className="absolute rounded-full bg-stone-400"
          style={{
            left: `${mote.x}%`,
            top: `${mote.y}%`,
            width: `${mote.size}px`,
            height: `${mote.size}px`,
            opacity: mote.opacity,
            filter: "blur(1px)"
          }}
        />
      ))}
    </div>
  );
}
