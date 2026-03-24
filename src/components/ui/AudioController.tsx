"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Montserrat } from "next/font/google";

const sans = Montserrat({ subsets: ["latin"], weight: ["300", "400"] });

const TRACKS = [
  "Em Đồng Ý (I Do).mp3",
  "Một Nhà.mp3",
  "Ngày Ta Có Nhau.mp3",
  "Trăm năm hạnh phúc.mp3",
] as const;

const trackUrl = (name: string) =>
  `/api/audio/${encodeURIComponent(name)}`;

const shortName = (name: string) => name.replace(/\.mp3$/i, "");

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasInteracted = useRef(false);

  const goTo = useCallback((index: number) => {
    const next = ((index % TRACKS.length) + TRACKS.length) % TRACKS.length;
    setTrackIndex(next);
    if (audioRef.current) {
      audioRef.current.src = trackUrl(TRACKS[next]);
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!hasInteracted.current) {
      audio.src = trackUrl(TRACKS[trackIndex]);
      hasInteracted.current = true;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying, trackIndex]);

  const onEnded = useCallback(() => {
    goTo(trackIndex + 1);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [trackIndex, goTo]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [onEnded]);

  // Autoplay on mount — browser may block until first user interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = trackUrl(TRACKS[0]);
    audio.volume = 0.55;
    hasInteracted.current = true;
    audio.play().catch(() => {
      // Autoplay blocked by browser policy — user must tap play manually
      setIsPlaying(false);
    });
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        preload="none"
      />

      <div
        className={`fixed bottom-6 left-5 z-30 flex items-center gap-2 rounded-full border border-[#c0a47a]/60 bg-[#fffaf0]/90 px-3 py-2 shadow-[0_8px_24px_rgba(69,51,34,0.18)] backdrop-blur-sm transition-all duration-300 md:left-7 ${sans.className}`}
      >
        {/* Prev */}
        <button
          type="button"
          aria-label="Bài trước"
          onClick={() => goTo(trackIndex - 1)}
          className="flex h-6 w-6 items-center justify-center text-[#7a5c38] transition hover:text-[#5a3e22]"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M3 2h1.5v5.3L13 2v12L4.5 8.7V14H3z" />
          </svg>
        </button>

        {/* Play / Pause */}
        <button
          type="button"
          aria-label={isPlaying ? "Tạm dừng" : "Phát nhạc"}
          onClick={togglePlay}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8a6840] text-white shadow-sm transition hover:bg-[#6d5030]"
        >
          {isPlaying ? (
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
              <path d="M4 2h2v12H4zM10 2h2v12h-2z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
              <path d="M4 2l10 6-10 6z" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button
          type="button"
          aria-label="Bài tiếp"
          onClick={() => goTo(trackIndex + 1)}
          className="flex h-6 w-6 items-center justify-center text-[#7a5c38] transition hover:text-[#5a3e22]"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M13 2h-1.5v5.3L3 2v12l8.5-5.3V14H13z" />
          </svg>
        </button>

        {/* Track name — toggle expand */}
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className={`overflow-hidden text-left transition-all duration-300 ${isExpanded ? "max-w-[160px] opacity-100" : "max-w-0 opacity-0"}`}
          aria-label="Tên bài hát"
        >
          <span className="block truncate text-[10px] uppercase tracking-[0.12em] text-[#7a5c38]">
            {shortName(TRACKS[trackIndex])}
          </span>
        </button>

        {/* Music note — toggle show name */}
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          aria-label="Hiện tên bài"
          className="text-[#9a7a50] transition hover:text-[#7a5c38]"
        >
          {isPlaying ? (
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M9 4l8-2v3L9 7V16a3 3 0 1 1-2-2.83V4zm6 2V5l-4 1v1l4-1z" />
              <circle cx="6" cy="17" r="2" />
              <circle cx="17" cy="15" r="2" opacity=".5" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 opacity-40" fill="currentColor">
              <path d="M9 4l8-2v3L9 7V16a3 3 0 1 1-2-2.83V4zm6 2V5l-4 1v1l4-1z" />
              <circle cx="6" cy="17" r="2" />
            </svg>
          )}
        </button>

        {/* Animated equalizer bars when playing */}
        {isPlaying && (
          <span className="flex items-end gap-[2px]" aria-hidden>
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className="w-[2px] rounded-full bg-[#8a6840]"
                style={{
                  height: `${6 + n * 3}px`,
                  animation: `eq-bar ${0.5 + n * 0.15}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </span>
        )}
      </div>
    </>
  );
}
