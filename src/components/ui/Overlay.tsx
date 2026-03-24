"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Overlay() {
  const [started, setStarted] = useState(false);

  return (
    <div className="ui-overlay">
      <AnimatePresence>
        {!started && (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="landing-state"
            onClick={() => setStarted(true)}
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#0a0a0a",
              zIndex: 100,
              cursor: "pointer",
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ fontSize: "5vw", color: "#f5f5f0", textAlign: "center" }}
            >
              Phuong Nam <br /> & <br /> Pham Yen
            </motion.h1>
            <motion.p
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ marginTop: "2rem", letterSpacing: "0.3em", fontSize: "0.8rem" }}
            >
              TOUCH TO START
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: started ? 1 : 0 }}
        transition={{ duration: 2 }}
        style={{
          position: "fixed",
          top: "40%",
          left: "5%",
          transform: "translateY(-50%)",
          maxWidth: "40vw",
        }}
      >
        <h2 style={{ fontSize: "3rem", lineHeight: 1.1 }}>
          THE INFINITE <br /> MEMORY <br /> CANVAS
        </h2>
        <p style={{ marginTop: "2rem", opacity: 0.7, fontSize: "0.9rem" }}>
          Explore our journey through space and time. <br />
          Drag to pan, explore the clusters of memories.
        </p>
      </motion.div>

      {/* Floating Typography Bits */}
      <motion.div
        animate={{ opacity: started ? 0.3 : 0 }}
        style={{
          position: "fixed",
          bottom: "10%",
          right: "10%",
          fontSize: "10vw",
          lineHeight: 0.8,
          pointerEvents: "none",
          textAlign: "right",
        }}
        className="serif"
      >
        11.04 <br /> 2026
      </motion.div>
    </div>
  );
}
