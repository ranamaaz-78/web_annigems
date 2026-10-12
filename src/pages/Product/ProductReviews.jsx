import Stars from '../../components/common/Stars';
import { RATING_DISTRIBUTION } from '../../data/products';
import { PRODUCT_REVIEWS } from '../../data/testimonials';

export default function ProductReviews({ product }) {
  return (
    <section className="pd-section" id="pd-reviews">
      <h2 className="pd-section-title">Client Reviews</h2>
      <div className="reviews-layout">
        <div className="rs">
          <div className="rs-score">{product.rating}</div>
          <Stars rating={product.rating} className="rs-stars" />
          <p className="rs-count">{product.reviews} reviews</p>
          <div className="rs-bars">
            {RATING_DISTRIBUTION.map(({ stars, percent }) => (
              <div className="rs-bar-row" key={stars}>
                <span>{stars}★</span>
                <div className="rs-track">
                  <div className="rs-fill" style={{ width: `${percent}%` }} />
                </div>
                <span>{percent}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rev-list">
          {PRODUCT_REVIEWS.map((r) => (
            <div className="rev" key={r.name}>
              <div className="rev-hdr">
                <div className="rev-av">{r.initials}</div>
                <div>
                  <p className="rev-name">{r.name}</p>
                  <p className="rev-loc">{r.location}</p>
                </div>
                <span className="rev-stars">★★★★★</span>
              </div>
              <p className="rev-text">&ldquo;{r.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
