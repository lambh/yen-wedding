"use client";

import { createContext, useContext, useState } from "react";
import { useSpring, useMotionValue, MotionValue } from "framer-motion";
import { useGesture } from "@use-gesture/react";

interface CanvasContextType {
  x: MotionValue<number>;
  y: MotionValue<number>;
  isGrabbing: boolean;
  hoveredPhotoId: string | null;
  setHoveredPhotoId: (id: string | null) => void;
  focusedPhotoId: string | null;
  setFocusedPhotoId: (id: string | null) => void;
  focusOn: (targetX: number, targetY: number, depth: number) => void;
}

const CanvasContext = createContext<CanvasContextType | null>(null);

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a DraggableCanvasProvider");
  }
  return context;
}

export default function DraggableCanvas({ children }: { children?: React.ReactNode }) {
  // Global motion values for the coordinate plane
  const x = useSpring(0, { stiffness: 80, damping: 25, restDelta: 0.001 });
  const y = useSpring(0, { stiffness: 80, damping: 25, restDelta: 0.001 });

  const [isGrabbing, setIsGrabbing] = useState(false);
  
  // Deep Dive State
  const [hoveredPhotoId, setHoveredPhotoId] = useState<string | null>(null);
  const [focusedPhotoId, setFocusedPhotoId] = useState<string | null>(null);

  // Focus Animation Logic
  const focusOn = (targetX: number, targetY: number, depth: number) => {
    // To center a child that translates by `v * depth + target`, 
    // the global motion value `v` must be `-target / depth`.
    x.set(-targetX / depth);
    y.set(-targetY / depth);
  };

  // Inertia panning logic
  const bind = useGesture(
    {
      onDrag: ({ offset: [ox, oy], active }) => {
        // Only allow dragging if we aren't "Deep Diving" locked into a photo,
        // or dragging breaks the focus
        if (active && focusedPhotoId) {
          setFocusedPhotoId(null); // break focus on drag
        }
        x.set(ox);
        y.set(oy);
        setIsGrabbing(active);
      },
    },
    {
      drag: {
        from: () => [x.get(), y.get()],
      },
    }
  );

  return (
    <CanvasContext.Provider value={{ 
      x, y, isGrabbing, 
      hoveredPhotoId, setHoveredPhotoId, 
      focusedPhotoId, setFocusedPhotoId,
      focusOn 
    }}>
      <div 
        {...bind()} 
        className={`fixed inset-0 w-full h-full overflow-hidden touch-none select-none ${
          isGrabbing ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* Origin Center Point. The children will tap into context to translate themselves */}
        <div className="absolute top-1/2 left-1/2 w-0 h-0 pointer-events-none">
          {children}
        </div>
      </div>
    </CanvasContext.Provider>
  );
}
