"use client";

import React, { useRef } from "react";
import { Carousel } from "antd";
import Image from "next/image";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const LostItemCarousel = ({ images = [] }: { images?: string[] }) => {
  const carouselRef = useRef<any>(null);

  if (!images || images.length === 0) return null;

  const showButtons = images.length > 1;

  return (
    <div className="lost-item-carousel relative w-full h-40">
      <Carousel
        ref={carouselRef}
        autoplay
        dots
        arrows={false}
        className="h-full"
      >
        {images.map((src, index) => (
          <div key={index} className="relative w-full h-40">
            <Image
              src={src}
              alt={`Lost item ${index}`}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        ))}
      </Carousel>

      {showButtons && (
        <>
          <button
            onClick={() => carouselRef.current.prev()}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/40 hover:bg-white/70 p-2 rounded-full"
          >
            <LeftOutlined />
          </button>
          <button
            onClick={() => carouselRef.current.next()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/40 hover:bg-white/70 p-2 rounded-full"
          >
            <RightOutlined />
          </button>
        </>
      )}

      {/* Dot styling override */}
      <style jsx global>{`
        /* Dot wrapper (small pill) */
        .lost-item-carousel .slick-dots {
          background: rgba(0, 0, 0, 0.35); /* transparent black */
          padding: 4px 12px;
          border-radius: 9999px; /* fully rounded */
          width: fit-content !important;
          left: 50% !important;
          transform: translateX(-50%); /* center the pill */
          bottom: 6px !important;
        }

        /* Dot colors */
        .lost-item-carousel .slick-dots li button {
          background: white !important;
        }

        .lost-item-carousel .slick-dots li.slick-active button {
          background: white !important;
          width: 18px !important; /* small stretch */
        }
      `}</style>
    </div>
  );
};

export default LostItemCarousel;
