interface StarRatingProps {
  /** Decimal 0-5 */
  rating: number;
  color?: string;
  sizeClass?: string;
}

const STAR_PATH =
  "M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 7.1-1.01L12 2z";

function Star() {
  return (
    <svg
      width="0.9em"
      height="0.9em"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="shrink-0"
      aria-hidden="true"
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

export default function StarRating({
  rating,
  color = "#fb923c",
  sizeClass = "text-xl lg:text-2xl",
}: StarRatingProps) {
  const pct = rating * 20;

  return (
    <span
      className={`relative inline-block leading-none ${sizeClass}`}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      <span className="flex text-gray-200">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} />
        ))}
      </span>
      <span
        className="absolute top-0 left-0 flex overflow-hidden"
        style={{ width: `${pct}%`, color }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} />
        ))}
      </span>
    </span>
  );
}
