"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Cormorant_Garamond, Montserrat } from "next/font/google";
import { WEDDING_PHOTO_NAMES } from "@/lib/weddingPhotoSource";
import AudioController from "@/components/ui/AudioController";

const serifHeading = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const serifBody = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sansLabel = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400"],
});

type PhotoItem = {
  id: string;
  src: string;
  x: number;
  y: number;
  rotate: number;
  z: number;
  scale: number;
  frameClass: string;
};

type WishItem = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

const CLOUD_WIDTH = 2400;
const CLOUD_HEIGHT = 1700;

const seeded = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const PHOTOS: PhotoItem[] = Array.from({ length: 32 }).map((_, index) => {
  const theta = index * 1.9;
  const ring = index % 4;
  const radius = 150 + Math.sqrt(index + 1) * 148;
  const wobbleX = Math.sin(index * 3.1) * 62;
  const wobbleY = Math.cos(index * 2.3) * 56;
  const fileName = WEDDING_PHOTO_NAMES[index % WEDDING_PHOTO_NAMES.length];
  const r = seeded(index + 1);
  const isHero = r > 0.8 || index % 11 === 0;
  const scale = isHero ? 1.18 + seeded(index + 9) * 0.14 : 0.9 + r * 0.25;
  const frameClass =
    r < 0.2
      ? "h-[188px] w-[136px] md:h-[258px] md:w-[188px]"
      : r < 0.4
        ? "h-[206px] w-[150px] md:h-[286px] md:w-[208px]"
        : r < 0.6
          ? "h-[222px] w-[162px] md:h-[312px] md:w-[228px]"
          : r < 0.8
            ? "h-[238px] w-[172px] md:h-[332px] md:w-[242px]"
            : "h-[254px] w-[184px] md:h-[352px] md:w-[256px]";
  const encoded = encodeURIComponent(fileName);

  return {
    id: `photo-${index + 1}`,
    src: `/api/wedding-photos/${encoded}?s=thumb`,
    x: Math.cos(theta) * radius + wobbleX,
    y: Math.sin(theta) * radius + wobbleY,
    rotate: (index % 10) * 2.4 - 11 + (seeded(index + 6) - 0.5) * 4,
    z: isHero ? 30 + (index % 3) : 14 + (index % 8) + ring,
    scale,
    frameClass,
  };
});

export default function WeddingInvitationScene() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [isWishOpen, setIsWishOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [selectedQr, setSelectedQr] = useState<{ src: string; title: string } | null>(null);
  const [wishName, setWishName] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [wishError, setWishError] = useState("");
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dragBounds, setDragBounds] = useState({
    left: -1000,
    right: 1000,
    top: -700,
    bottom: 700,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
        setSelectedQr(null);
        setIsGiftOpen(false);
        setIsWishOpen(false);
        setIsOverlayOpen(false);
        setIsCardOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const updateBounds = () => {
      const viewW = window.innerWidth;
      const viewH = window.innerHeight;
      setIsMobile(viewW < 768);

      const horizontalSpan = Math.max((CLOUD_WIDTH - viewW) / 2, 0);
      const verticalSpan = Math.max((CLOUD_HEIGHT - viewH) / 2, 0);

      setDragBounds({
        left: -horizontalSpan,
        right: horizontalSpan,
        top: -verticalSpan,
        bottom: verticalSpan,
      });
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);

    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchWishes = async () => {
      try {
        const response = await fetch("/api/wishes", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Cannot load wishes");
        }
        const data = (await response.json()) as { wishes: WishItem[] };
        setWishes(data.wishes ?? []);
      } catch {
        setWishError("Không tải được lời chúc. Vui lòng thử lại.");
      }
    };

    void fetchWishes();
  }, [isMounted]);

  const mapLinks = useMemo(
    () => ({
      groom:
        "https://www.google.com/maps/search/?api=1&query=NH%C3%80+H%C3%80NG+MI%E1%BA%BEN+H%C6%AF%C6%A0NG%2C+61+ph%E1%BB%91+Th%E1%BB%91ng+Nh%E1%BA%A5t%2C+P.+L%C3%AA+Thanh+Ngh%E1%BB%8B%2C+TP.+H%E1%BA%A3i+Ph%C3%B2ng",
      bride:
        "https://www.google.com/maps/search/?api=1&query=Nh%C3%A0+h%C3%A0ng+Th%C3%A0nh+Trung%2C+967+Tr%E1%BA%A7n+Ph%C3%BA%2C+C%E1%BA%A9m+T%C3%A2y%2C+C%E1%BA%A9m+Ph%E1%BA%A3%2C+Qu%E1%BA%A3ng+Ninh",
    }),
    [],
  );

  const submitWish = async () => {
    const name = wishName.trim();
    const message = wishMessage.trim();

    if (!name || !message) {
      setWishError("Vui lòng nhập tên và lời chúc.");
      return;
    }

    try {
      setIsSubmittingWish(true);
      setWishError("");

      const response = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });

      if (!response.ok) {
        const errData = (await response.json()) as { error?: string };
        throw new Error(errData.error ?? "Cannot submit wish");
      }

      const data = (await response.json()) as { wish: WishItem };
      setWishes((prev) => [data.wish, ...prev].slice(0, 100));
      setWishName("");
      setWishMessage("");
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : "Không thể gửi lời chúc.";
      setWishError(messageText);
    } finally {
      setIsSubmittingWish(false);
    }
  };

  return (
    <main
      className={`relative h-screen w-screen overflow-hidden bg-[#FAF9F6] text-[#4a3f35] ${serifBody.className}`}
    >
      <motion.div
        animate={{ filter: isOverlayOpen ? "blur(4px)" : "blur(0px)", scale: isOverlayOpen ? 1.02 : 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(161,122,71,0.06),transparent_40%),radial-gradient(circle_at_80%_75%,rgba(120,90,50,0.08),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* CSS marquee — compositor thread only, zero JS cost */}
          <div className="absolute left-0 top-[8%] -rotate-[12deg]">
            <span className="marquee-left text-[50px] font-semibold tracking-[0.2em] text-[#7f6548]/[0.13] md:text-[94px]">
              Phương Nam &amp; Phạm Yến Wedding &nbsp;&nbsp;&nbsp; Phương Nam &amp; Phạm Yến Wedding &nbsp;&nbsp;&nbsp; Phương Nam &amp; Phạm Yến Wedding &nbsp;&nbsp;&nbsp; Phương Nam &amp; Phạm Yến Wedding &nbsp;&nbsp;&nbsp;
            </span>
          </div>
          <div className="absolute left-0 top-[38%] rotate-[6deg]">
            <span className="marquee-right text-[42px] italic tracking-[0.16em] text-[#8b7153]/[0.11] md:text-[78px]">
              Phương Nam &amp; Phạm Yến Wedding &nbsp;&nbsp;&nbsp; Phương Nam &amp; Phạm Yến Wedding &nbsp;&nbsp;&nbsp; Phương Nam &amp; Phạm Yến Wedding &nbsp;&nbsp;&nbsp; Phương Nam &amp; Phạm Yến Wedding &nbsp;&nbsp;&nbsp;
            </span>
          </div>
          <div className="absolute left-0 top-[69%] -rotate-[9deg]">
            <span className="marquee-left2 text-[44px] tracking-[0.17em] text-[#6f563c]/[0.12] md:text-[82px]">
              Phương Nam &amp; Phạm Yến Wedding &nbsp;&nbsp;&nbsp; Phương Nam &amp; Phạm Yến Wedding &nbsp;&nbsp;&nbsp; Phương Nam &amp; Phạm Yến Wedding &nbsp;&nbsp;&nbsp; Phương Nam &amp; Phạm Yến Wedding &nbsp;&nbsp;&nbsp;
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="select-none text-center text-[44px] font-semibold tracking-[0.14em] text-[#6f563c]/[0.12] md:text-[108px]">
              Phương Nam &amp; Phạm Yến Wedding
            </p>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_52%,rgba(250,249,246,0.28)_100%)]" />
        </div>

        <div className="relative h-full w-full overflow-hidden">
          <motion.div
            drag
            dragConstraints={dragBounds}
            dragElastic={0.06}
            dragMomentum={false}
            className="absolute left-1/2 top-1/2 h-[1700px] w-[2400px] -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
            style={{ willChange: "transform" }}
          >
            {isMounted
              ? PHOTOS.map((photo, i) => (
                  <div
                    key={photo.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Xem ảnh ${i + 1}`}
                    className={`photo-card absolute overflow-hidden rounded-[3px] bg-[#fffdfa] p-[5px] shadow-[0_16px_34px_rgba(79,58,40,0.18)] ${photo.frameClass}`}
                    style={{
                      left: `calc(50% + ${photo.x}px)`,
                      top: `calc(50% + ${photo.y}px)`,
                      transform: `rotate(${photo.rotate}deg) scale(${photo.scale})`,
                      zIndex: photo.z,
                    }}
                    onClick={() => setSelectedPhoto(photo)}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedPhoto(photo)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={`Memory ${i + 1}`}
                      className="h-full w-full object-cover"
                      loading={i < 10 ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                      fetchPriority={i < 6 ? "high" : "low"}
                    />
                  </div>
                ))
              : null}
          </motion.div>
        </div>
      </motion.div>

      <AudioController />

      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 md:bottom-9">
          <button
            type="button"
            onClick={() => {
              setIsOverlayOpen(true);
              setIsCardOpen(false);
            }}
            className={`${serifHeading.className} rounded-full border border-[#8f7652] bg-[#fffaf0]/95 px-8 py-3 text-sm uppercase tracking-[0.18em] text-[#6a5138] shadow-[0_16px_36px_rgba(70,52,35,0.18)] transition hover:-translate-y-0.5 hover:bg-[#fff5e7]`}
          >
            Mở thiệp
          </button>
          <button
            type="button"
            onClick={() => setIsGiftOpen(true)}
            className={`rounded-full border border-[#b58e60]/65 bg-[#fff9ef]/90 px-5 py-2 text-[11px] uppercase tracking-[0.18em] text-[#74593a] shadow-[0_12px_28px_rgba(69,51,34,0.18)] transition hover:-translate-y-0.5 hover:bg-[#fff5e8] ${sansLabel.className}`}
          >
            Mừng cưới
          </button>
          <button
            type="button"
            onClick={() => setIsWishOpen(true)}
            className={`rounded-full border border-[#b58e60]/65 bg-[#fff9ef]/90 px-5 py-2 text-[11px] uppercase tracking-[0.18em] text-[#74593a] shadow-[0_12px_28px_rgba(69,51,34,0.18)] transition hover:-translate-y-0.5 hover:bg-[#fff5e8] ${sansLabel.className}`}
          >
            Gửi lời chúc
          </button>
        </div>
      </div>

      {isOverlayOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#d9c8ab]/30 backdrop-blur-[2px] px-4 py-6"
          onClick={() => {
            setIsOverlayOpen(false);
            setIsCardOpen(false);
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsOverlayOpen(false);
              setIsCardOpen(false);
            }}
            className="absolute right-5 top-5 z-50 rounded-full border border-[#8f7652]/70 bg-white/85 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#6a5138] transition hover:bg-white"
          >
            Đóng
          </button>

          <div className="[perspective:1800px]" onClick={(event) => event.stopPropagation()}>
            <motion.div
              onClick={() => setIsCardOpen((prev) => !prev)}
              animate={
                isMobile
                  ? { rotateY: isCardOpen ? -175 : 0, rotateX: 0, scale: isCardOpen ? 0.86 : 0.86 }
                  : { rotateY: isCardOpen ? -175 : 0, rotateX: 0, scale: isCardOpen ? 1.01 : 1 }
              }
              transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
              className="relative h-[470px] w-[320px] [transform-style:preserve-3d] md:h-[540px] md:w-[370px]"
            >
              <div className="absolute inset-0 flex [backface-visibility:hidden] flex-col items-center justify-center rounded-[6px] border border-[#c8b59b] bg-gradient-to-br from-[#fff9ef] via-[#f7ebd8] to-[#eedcc1] text-center shadow-[0_30px_60px_rgba(69,51,34,0.22)]">
                <p className={`text-sm uppercase tracking-[0.22em] text-[#7b6244] ${serifHeading.className}`}>Wedding Invitation</p>
                <h2 className={`mt-6 text-4xl text-[#5a4028] ${serifBody.className}`}>11 . 04 . 2026</h2>
                <p className="mt-8 text-xs uppercase tracking-[0.22em] text-[#8a7358]">Chạm để mở thiệp</p>
              </div>

              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden rounded-[6px] border border-[#c6b092] bg-[#fffdf8] p-5 text-[#4f3d2a] shadow-[0_30px_60px_rgba(69,51,34,0.18)] md:p-7">
                <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-[0.18]" />
                <div className="pointer-events-none absolute left-3 top-3 h-12 w-12 border-l border-t border-[#b8860b]/35" />
                <div className="pointer-events-none absolute bottom-3 right-3 h-12 w-12 border-b border-r border-[#b8860b]/35" />

                <div className="relative flex h-full flex-col">
                  <div className="text-center">
                    <p className={`text-[10px] uppercase tracking-[0.32em] text-[#7e6344]/80 ${sansLabel.className}`}>Trân Trọng Kính Mời</p>
                    <h3 className={`mt-2 text-[44px] leading-none text-[#4f3824] ${serifBody.className}`}>Lễ Thành Hôn</h3>
                    <p className={`mt-2 text-[17px] uppercase tracking-[0.08em] ${serifHeading.className}`}>Thứ Bảy, Ngày 11 Tháng 04 Năm 2026</p>
                    <p className="mt-1 text-[14px] italic text-[#81674a]">(Tức ngày 24 tháng 02 năm Bính Ngọ)</p>
                  </div>

                  <div className="my-4 flex items-center justify-center">
                    <div className="h-px w-10 bg-[#b8860b]/40" />
                    <p className={`mx-3 text-[10px] uppercase tracking-[0.36em] text-[#7e6344]/75 ${sansLabel.className}`}>Wedding Day</p>
                    <div className="h-px w-10 bg-[#b8860b]/40" />
                  </div>

                  <div className="relative grid flex-1 grid-cols-2 gap-4 px-1">
                    <div className="pointer-events-none absolute bottom-1 left-1/2 top-1 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#b8860b]/35 to-transparent md:block" />

                    <section className="text-center">
                      <p className={`text-[11px] uppercase tracking-[0.2em] text-[#7e6344]/75 ${sansLabel.className}`}>Nhà Trai</p>
                      <h4 className="mt-1 text-[26px] font-semibold leading-[1.08]">Nhà hàng Miến Hương</h4>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[#7e6344]/75">Địa điểm</p>
                      <a
                        href={mapLinks.groom}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Xem bản đồ địa chỉ Nhà Trai trên Google Maps"
                        className="mt-1 inline-block text-[20px] leading-tight underline decoration-[#a28158] underline-offset-2 transition hover:text-[#7a5c3c]"
                      >
                        61 phố Thống Nhất
                        <br />
                        P. Lê Thanh Nghị
                        <br />
                        TP. Hải Phòng
                      </a>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[#7e6344]/75">Thời gian</p>
                      <p className="text-[28px] leading-none">10:30</p>
                    </section>

                    <section className="text-center">
                      <p className={`text-[11px] uppercase tracking-[0.2em] text-[#7e6344]/75 ${sansLabel.className}`}>Nhà Gái</p>
                      <h4 className="mt-1 text-[26px] font-semibold leading-[1.08]">Nhà hàng Thành Trung</h4>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[#7e6344]/75">Địa điểm</p>
                      <a
                        href={mapLinks.bride}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Xem bản đồ địa chỉ Nhà Gái trên Google Maps"
                        className="mt-1 inline-block text-[20px] leading-tight underline decoration-[#a28158] underline-offset-2 transition hover:text-[#7a5c3c]"
                      >
                        967 Trần Phú
                        <br />
                        Cẩm Tây
                        <br />
                        Cẩm Phả, Quảng Ninh
                      </a>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[#7e6344]/75">Thời gian</p>
                      <p className="text-[28px] leading-none">17:00</p>
                    </section>
                  </div>

                  <div className="mt-3 border-t border-[#b8860b]/15 pt-2">
                    <p className="text-center text-[13px] italic text-[#7e6344]/95">
                      Sự hiện diện của Quý khách là niềm vinh hạnh cho gia đình chúng tôi.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute right-5 top-5 rounded-full border border-white/60 bg-white/15 px-4 py-2 text-xs uppercase tracking-[0.16em] text-white transition hover:bg-white/25"
          >
            Đóng ảnh
          </button>
          <motion.div
            initial={{ scale: 0.94, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative max-h-[90vh] w-full max-w-[900px] overflow-hidden rounded-md border border-white/20 bg-white p-2 shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto.src.replace("?s=thumb", "?s=full")}
              alt={`Expanded ${selectedPhoto.id}`}
              className="max-h-[84vh] w-full rounded-sm object-contain"
              decoding="async"
              draggable={false}
            />
          </motion.div>
        </motion.div>
      )}

      {selectedQr && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedQr(null)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full max-w-[430px] rounded-xl border border-[#d7be9f] bg-[#fffaf2] p-3 shadow-[0_28px_70px_rgba(0,0,0,0.38)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className={`text-xs uppercase tracking-[0.18em] text-[#7a5d3f] ${sansLabel.className}`}>{selectedQr.title}</p>
              <button
                type="button"
                onClick={() => setSelectedQr(null)}
                className="rounded-full border border-[#b58e60]/60 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#7b5f3f] transition hover:bg-[#f5ead8]"
              >
                Đóng
              </button>
            </div>
            <div className="rounded-lg border border-[#d7be9f]/80 bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedQr.src}
                alt={selectedQr.title}
                className="mx-auto max-h-[72vh] w-full rounded-md object-contain"
                draggable={false}
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {isGiftOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] flex items-center justify-center bg-[#2d2318]/45 p-4 backdrop-blur-[2px]"
          onClick={() => setIsGiftOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="w-full max-w-[760px] overflow-hidden rounded-2xl border border-[#d4b894] bg-[#fffaf1] shadow-[0_28px_70px_rgba(0,0,0,0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-[#d6c1a5]/70 px-4 py-3">
              <p className={`text-center text-xs uppercase tracking-[0.22em] text-[#7c6142] ${sansLabel.className}`}>Mừng Cưới</p>
            </div>
            <div className="grid grid-cols-2 gap-4 p-5 md:gap-6 md:p-6">
              <button
                type="button"
                onClick={() => setSelectedQr({ src: "/api/gift-qr/groom", title: "QR Mừng Cưới Chú Rể" })}
                className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-[#d3b58d]/65 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:shadow-sm md:min-h-[340px] md:p-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/api/gift-qr/groom"
                  alt="QR mừng cưới chú rể"
                  className="h-40 w-40 rounded-md object-contain md:h-52 md:w-52"
                />
                <p className={`mt-3 text-[10px] uppercase tracking-[0.15em] text-[#785d3d] ${sansLabel.className}`}>Chú Rể</p>
              </button>
              <button
                type="button"
                onClick={() => setSelectedQr({ src: "/api/gift-qr/bride", title: "QR Mừng Cưới Cô Dâu" })}
                className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-[#d3b58d]/65 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:shadow-sm md:min-h-[340px] md:p-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/api/gift-qr/bride"
                  alt="QR mừng cưới cô dâu"
                  className="h-40 w-40 rounded-md object-contain md:h-52 md:w-52"
                />
                <p className={`mt-3 text-[10px] uppercase tracking-[0.15em] text-[#785d3d] ${sansLabel.className}`}>Cô Dâu</p>
              </button>
            </div>
            <div className="border-t border-[#d6c1a5]/70 px-4 py-3 text-center">
              <button
                type="button"
                onClick={() => setIsGiftOpen(false)}
                className="rounded-full border border-[#b58e60]/65 px-4 py-1 text-[10px] uppercase tracking-[0.14em] text-[#735739] transition hover:bg-[#f5ead8]"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {isWishOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[58] flex items-center justify-center bg-[#2d2318]/45 p-4 backdrop-blur-[2px]"
          onClick={() => setIsWishOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="w-full max-w-[760px] overflow-hidden rounded-2xl border border-[#d4b894] bg-[#fffaf1] shadow-[0_28px_70px_rgba(0,0,0,0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-[#d6c1a5]/70 px-4 py-3">
              <p className={`text-center text-xs uppercase tracking-[0.22em] text-[#7c6142] ${sansLabel.className}`}>Sổ Lưu Bút Chúc Mừng</p>
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-[1.1fr_1fr] md:p-6">
              <div className="rounded-xl border border-[#d3b58d]/65 bg-[linear-gradient(160deg,#fffdf8,#fff6ea)] p-4 shadow-[0_12px_24px_rgba(84,61,38,0.08)]">
                <p className={`mb-3 text-[10px] uppercase tracking-[0.2em] text-[#7d6140] ${sansLabel.className}`}>Để lại lời chúc</p>
                <label className={`text-[10px] uppercase tracking-[0.15em] text-[#7e6344]/75 ${sansLabel.className}`}>Tên của bạn</label>
                <input
                  value={wishName}
                  onChange={(event) => setWishName(event.target.value)}
                  placeholder="Nhập tên..."
                  className="mt-1 w-full rounded-md border border-[#d8c3a6] bg-[#fffdf9] px-3 py-2 text-sm outline-none transition focus:border-[#b58e60]"
                />
                <label className={`mt-3 block text-[10px] uppercase tracking-[0.15em] text-[#7e6344]/75 ${sansLabel.className}`}>Lời chúc</label>
                <textarea
                  value={wishMessage}
                  onChange={(event) => setWishMessage(event.target.value)}
                  placeholder="Chúc hai bạn trăm năm hạnh phúc..."
                  className="mt-1 h-32 w-full resize-none rounded-md border border-[#d8c3a6] bg-[#fffdf9] px-3 py-2 text-sm outline-none transition focus:border-[#b58e60]"
                />
                <button
                  type="button"
                  onClick={() => void submitWish()}
                  disabled={isSubmittingWish}
                  className={`mt-3 rounded-full border border-[#b58e60]/65 bg-[#fff5e8] px-5 py-2 text-[11px] uppercase tracking-[0.15em] text-[#715536] transition hover:bg-[#f7ead8] disabled:cursor-not-allowed disabled:opacity-60 ${sansLabel.className}`}
                >
                  {isSubmittingWish ? "Đang gửi..." : "Gửi lời chúc"}
                </button>
                {wishError ? <p className="mt-2 text-xs text-[#9b4a3e]">{wishError}</p> : null}
              </div>

              <div className="rounded-xl border border-[#d3b58d]/65 bg-[#fffdfa] p-3">
                <p className={`mb-2 text-[10px] uppercase tracking-[0.16em] text-[#7e6344]/75 ${sansLabel.className}`}>Lời chúc gần đây</p>
                <div className="max-h-[290px] space-y-2 overflow-y-auto pr-1">
                  {wishes.length === 0 ? (
                    <p className="text-sm italic text-[#8e7558]">Chưa có lời chúc nào, bạn là người đầu tiên nhé.</p>
                  ) : (
                    wishes.map((wish) => (
                      <div key={wish.id} className="rounded-md border border-[#ecdcc8] bg-[#fffdf8] p-2 shadow-[0_6px_14px_rgba(84,61,38,0.05)]">
                        <p className="text-sm font-semibold text-[#5a4028]">{wish.name}</p>
                        <p className="mt-1 text-sm leading-snug text-[#6b5034]">{wish.message}</p>
                        <p className="mt-1 text-[11px] text-[#9a8063]">
                          {new Date(wish.createdAt).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-[#d6c1a5]/70 px-4 py-3 text-center">
              <button
                type="button"
                onClick={() => setIsWishOpen(false)}
                className="rounded-full border border-[#b58e60]/65 px-4 py-1 text-[10px] uppercase tracking-[0.14em] text-[#735739] transition hover:bg-[#f5ead8]"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
