"use client";

import { motion } from "framer-motion";

export default function FallbackExperience() {
  const photos = [
    "DVH03172_(2).jpg", "DVH03193_(2).jpg", "DVH03276_(2).jpg",
    "DVH03284_(2).jpg", "DVH03292_(2).jpg", "DVH03306_(2).jpg",
    "DVH03327_(2).jpg", "DVH03349_(2).jpg", "DVH03374_(2).jpg",
    "DVH03440_(2).jpg", "DVH03465_(2).jpg", "DVH03474_(2).jpg",
    "DVH03480_(2).jpg", "DVH03514_(2).jpg", "DVH03531_(2).jpg",
    "DVH03578_(2).jpg", "DVH03757_(2).jpg", "DVH03763_(2).jpg",
    "DVH03787_(2).jpg", "DVH03846_(2).jpg", "DVH03929_(2).jpg",
    "DVH03995.jpg", "DVH03997.jpg", "DVH04052.jpg",
    "DVH04083.jpg", "DVH04097.jpg", "DVH04136.jpg",
    "DVH04158.jpg", "DVH04177.jpg", "DVH04178.jpg",
    "DVH04208.jpg"
  ].map((file, i) => ({
    id: i,
    url: `/photos/${file}`,
  }));

  return (
    <div style={{ padding: "100px 20px", display: "flex", flexDirection: "column", gap: "100px", alignItems: "center" }}>
      <motion.h1
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        style={{ fontSize: "10vw", textAlign: "center" }}
        className="serif"
      >
        Phuong Nam & Pham Yen
      </motion.h1>
      

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "2rem",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{ width: "100%" }}
          >
            <img
              src={photo.url}
              alt="Wedding Memory"
              style={{ width: "100%", height: "auto", borderRadius: "10px", filter: "grayscale(100%)" }}
            />
          </motion.div>
        ))}
      </div>

      <div style={{ height: "200px" }} />
    </div>
  );
}
