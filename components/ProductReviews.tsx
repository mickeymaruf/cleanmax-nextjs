"use client";

import { useState } from "react";
import Image from "next/image";

interface ReviewImage {
  src: string;
  alt?: string;
}

interface Review {
  image: ReviewImage;
  rating?: number;
  verifiedLabel?: string;
  title: string;
  /** Rich text body, rendered as HTML (merchant-editable) */
  text: string;
  author: string;
  date: string;
}

export interface ProductReviewsProps {
  /** Badge text shown above the heading (merchant-editable) */
  badgeText: string;
  /** Heading (merchant-editable) */
  heading: string;
  /** Subheading (merchant-editable) */
  subheading?: string;
  /** Reviews (merchant-editable blocks) */
  reviews: Review[];
  /** Reviews shown before "Cargar Más" is clicked */
  initialCount?: number;
  /** Reviews revealed per click */
  step?: number;
}

function StarBadgeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 640 640" aria-hidden="true">
      <path
        fill="#001e50"
        d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z"
      />
    </svg>
  );
}

function ReviewStars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5 text-xl" style={{ color: "#001e50" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "" : "opacity-25"}>
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="review-card-item bg-white rounded-2xl p-3 shadow-xs border border-gray-100 flex flex-col sm:flex-row gap-6 transition-all">
      <div className="w-full sm:w-[40%] flex-shrink-0 rounded-xl overflow-hidden aspect-square bg-gray-50">
        <Image
          src={review.image.src}
          alt={review.image.alt ?? review.title}
          width={500}
          height={500}
          sizes="(min-width: 640px) 40vw, 100vw"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <ReviewStars rating={review.rating} />
            <div className="inline-flex items-center gap-1 bg-[#E6F7ED] text-[#15803D] font-bold text-[11px] px-2.5 py-1 rounded-full tracking-wide">
              {review.verifiedLabel ?? "Compra Verificada"}
            </div>
          </div>

          <h3 className="text-gray-900 font-bold text-lg md:text-xl leading-tight mb-2">
            {review.title}
          </h3>
          <div
            className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: review.text }}
          />
        </div>

        <div className="border-t border-gray-100 pt-3">
          <p className="text-gray-900 font-bold text-sm md:text-base leading-none mb-1">
            {review.author}
          </p>
          <p className="text-gray-400 text-xs md:text-sm">{review.date}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProductReviews({
  badgeText,
  heading,
  subheading,
  reviews,
  initialCount = 4,
  step = 2,
}: ProductReviewsProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const hasMore = visibleCount < reviews.length;

  return (
    <section className="px-6 py-20 bg-[#F4F8FB]">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-xs border border-gray-100">
            <StarBadgeIcon />
            <span className="text-sm font-bold text-[#001e50]">{badgeText}</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-[#000080] font-black text-3xl md:text-5xl tracking-tight mb-4">
            {heading}
          </h2>
          {subheading && (
            <p className="text-gray-600 text-base md:text-lg max-w-[600px] mx-auto leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reviews.slice(0, visibleCount).map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => Math.min(count + step, reviews.length))}
              className="bg-[#000080] text-white font-bold tracking-wider text-sm md:text-base uppercase px-8 py-3.5 transition-colors duration-200 hover:bg-blue-900"
            >
              Cargar Más
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
