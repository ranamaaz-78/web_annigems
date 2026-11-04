import { useEffect, useState } from 'react';
import { api, errorText } from '../../api/client';
import { major } from '../../api/mappers';
import { GOLD_RATE } from '../../data/site';
import { useB2B } from '../../hooks/useB2B';
import { usePricing } from '../../hooks/usePricing';
import { formatPrice, formatPriceRounded } from '../../utils/format';
import { configuratorTotal, goldValue, ruleLabel } from '../../utils/pricing';
import PanelHeader from './PanelHeader';

export default function PreviewStep({ ring, size, stone, onAddToCart, onRestart }) {
  const { isB2B, configPrice } = usePricing();
  const { pricing } = useB2B();
  // Live price from POST /configurator/price (gold rate of the moment); the catalogue values show meanwhile.
  const [live, setLive] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setError('');
    api('configurator/price', { method: 'POST', body: { ring_id: ring.id, stone_id: stone.id, size: String(size) } })
      .then((res) => {
        if (cancelled) return;
        const d = res.data;
        setLive({
          gold: major(d.gold_value),
          craft: major(d.craft_fee),
          stone: major(d.stone_price),
          total: major(d.total),
          perOz: d.gold_rate?.per_oz ? major(d.gold_rate.per_oz) : null,
          image: d.image,
          delivery: d.delivery_text,
        });
      })
      .catch((err) => !cancelled && setError(errorText(err)));
    return () => {
      cancelled = true;
    };
  }, [ring.id, stone.id, size]);

  const gold = live?.gold ?? goldValue(ring);
  const craft = live?.craft ?? ring.craftFee;
  const gemPrice = live?.stone ?? stone.gemPrice;
  const retailTotal = live?.total ?? configuratorTotal(ring, stone);
  const total = configPrice(retailTotal);
  const perOz = live?.perOz ?? GOLD_RATE.perOz;
  const image = live?.image ?? stone.images[ring.id] ?? ring.image;

  const summary = [
    ['Setting', ring.name],
    ['Gemstone', stone.name],
    ['Ring Size', `US Size ${size}`],
    ['Gold Weight', `${ring.goldWeightG}g (${ring.karat}K)`],
    ['Delivery', live?.delivery || ring.deliveryText],
  ];

  return (
    <div className="conf-panel active">
      <PanelHeader title="Your Bespoke Creation" subtitle="Your ring as it will be crafted, priced on today's gold rate." />
      <div className="conf-prev-layout">
        <div>
          <div className="conf-showcase">
            <img src={image} alt={`${ring.name} with ${stone.name}`} />
            <div className="conf-glow" style={{ background: `radial-gradient(ellipse at 50% 80%,${stone.glow} 0%,transparent 65%)` }} />
          </div>
          <p className="conf-caption">Final product - handcrafted to order</p>
          <div className="conf-ql-badges">
            <span>✦ GIA Certified</span>
            <span>✦ {ring.karat}K Gold</span>
            <span>✦ Ethically Sourced</span>
          </div>
        </div>

        <div>
          <div className="conf-ready">✓ Ready to Order</div>
          <h3 className="conf-prev-title">
            {ring.name} + {stone.name}
          </h3>
          <div className="conf-summary">
            {summary.map(([label, value]) => (
              <div className="cs2-row" key={label}>
                <span>{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>

          <div className="price-card">
            <div className="pc-title">
              <span>Price Breakdown</span>
              <div className="pc-live">
                <span className="live-dot" />
                <span>Gold: {formatPrice(perOz)}/oz</span>
              </div>
            </div>
            <div className="pc-rows">
              <div className="pc-row">
                <span>Gold value ({ring.goldWeightG}g x {ring.karat}K purity x spot)</span>
                <span>{formatPrice(gold)}</span>
              </div>
              <div className="pc-row">
                <span>Craftsmanship &amp; setting</span>
                <span>{formatPriceRounded(craft)}</span>
              </div>
              <div className="pc-row">
                <span>Gemstone ({stone.name})</span>
                <span>{formatPriceRounded(gemPrice)}</span>
              </div>
              {isB2B && (
                <div className="pc-row b2b-disc">
                  <span>Business pricing ({ruleLabel(pricing.config, true)})</span>
                  <span>−{formatPrice(retailTotal - total)}</span>
                </div>
              )}
            </div>
            <div className="pc-total-row">
              <span>Total Price</span>
              <span className="pc-total-val">{formatPrice(total)}</span>
            </div>
            <p className="pc-note">
              * Gold priced at spot: <strong>{formatPrice(perOz)}</strong>/oz.
            </p>
          </div>

          {error && <p className="field-error">{error}</p>}
          <div className="conf-acts">
            <button className="btn-gold" onClick={onAddToCart} disabled={Boolean(error)}>
              Add to Cart
            </button>
            <button className="btn-outline" onClick={onRestart}>
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
