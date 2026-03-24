"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Terminal } from "lucide-react";

export default function RSVPWhisper() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="rsvp-whisper" style={{ position: "fixed", bottom: "30px", left: "30px", zIndex: 50 }}>
      {/* Breathing Button */}
      <motion.button
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => setIsOpen(true)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(10px)",
        }}
      >
        <Terminal size={20} color="white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: "fixed",
              bottom: "100px",
              left: "30px",
              width: "350px",
              background: "rgba(10, 10, 10, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "2rem",
              borderRadius: "1rem",
              backdropFilter: "blur(20px)",
            }}
          >
            <p className="serif" style={{ marginBottom: "1rem", color: "#d4af37" }}>
              WILL YOU BE THERE?
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>&gt;</span>
              <input
                autoFocus
                type="text"
                placeholder="Type your name and a wish..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "white",
                  width: "100%",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-sans)",
                }}
              />
            </div>
            <p style={{ marginTop: "1rem", fontSize: "0.7rem", opacity: 0.4 }}>
              Press Enter to send your message into the void.
            </p>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                opacity: 0.5,
              }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
