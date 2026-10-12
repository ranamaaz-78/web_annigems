// Five-star rating display (rounded to the nearest whole star).
export default function Stars({ rating, className }) {
  const filled = Math.round(rating);
  return (
    <span className={className} aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(filled)}
      {'☆'.repeat(5 - filled)}
    </span>
  );
}
