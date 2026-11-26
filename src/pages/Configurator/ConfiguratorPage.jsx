import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, errorText } from '../../api/client';
import { major } from '../../api/mappers';
import { CONFIG_RINGS, CONFIG_SIZES, stonesForRing, CONFIG_STONES } from '../../data/configurator';
import { GOLD_RATE } from '../../data/site';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { usePricing } from '../../hooks/usePricing';
import { useShop } from '../../hooks/useShop';
import { useUI } from '../../hooks/useUI';
import { formatPrice } from '../../utils/format';
import { configuratorTotal } from '../../utils/pricing';
import MobileStudio from './MobileStudio';
import { PriceBreakdown, RingOptions, SizeGuide, SizeOptions, StoneOptions } from './Options';
import Section from './Section';
import Stage from './Stage';

const TRUST = ['GIA certified stones', 'Ethically sourced', 'Free resize within 60 days', 'Handcrafted to order'];

// Design Your Ring: one screen. The photo updates live, the three choices fold away as they are made,
// and the price + add-to-bag bar is always in view. Choices live in the URL so a design can be shared.
export default function ConfiguratorPage() {
  const { addToCart } = useShop();
  const { showToast, openCart } = useUI();
  const { isB2B, configPrice, ringPercent } = usePricing();
  const [params, setParams] = useSearchParams();

  const ring = CONFIG_RINGS.find((r) => r.slug === params.get('ring')) ?? null;
  const stones = ring ? stonesForRing(ring) : CONFIG_STONES;
  const stone = (ring && stones.find((s) => s.slug === params.get('stone'))) || null;
  const sizes = ring?.sizes?.length ? ring.sizes : CONFIG_SIZES;
  const sizeParam = params.get('size');
  const size = sizeParam && sizes.map(String).includes(sizeParam) ? sizeParam : null;

  const firstOpen = !ring ? 'ring' : !stone ? 'stone' : !size ? 'size' : null;
  const [open, setOpen] = useState(firstOpen);
  const [guide, setGuide] = useState(false);
  const [breakdown, setBreakdown] = useState(false);
  const [added, setAdded] = useState(false);
  const phone = useMediaQuery('(max-width: 960px)');

  const update = (next) => {
    setAdded(false);
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
        return p;
      },
      { replace: true, state: { keepScroll: true } },
    );
  };

  const chooseRing = (r) => {
    const keepStone = stone && stonesForRing(r).some((s) => s.id === stone.id);
    const keepSize = size && r.sizes.map(String).includes(size);
    update({ ring: r.slug, stone: keepStone ? stone.slug : null, size: keepSize ? size : null });
    setOpen(!keepStone ? 'stone' : !keepSize ? 'size' : null);
  };
  const chooseStone = (s) => {
    update({ stone: s.slug });
    setOpen(size ? null : 'size');
  };
  const chooseSize = (v) => {
    update({ size: String(v) });
    setOpen(null);
  };

  // Live price (today's gold rate) as soon as ring + stone are known. Size never changes the price,
  // so the first offered size is sent until the customer picks one.
  const [live, setLive] = useState(null);
  const [error, setError] = useState('');
  const priceSize = size ?? ring?.sizes?.[0];
  useEffect(() => {
    if (!ring || !stone || !priceSize) return undefined;
    let cancelled = false;
    setError('');
    api('configurator/price', { method: 'POST', body: { ring_id: ring.id, stone_id: stone.id, size: String(priceSize) } })
      .then(({ data: d }) => {
        if (cancelled) return;
        setLive({
          key: `${ring.id}-${stone.id}`,
          gold: major(d.gold_value),
          craft: major(d.craft_fee),
          stone: major(d.stone_price),
          total: major(d.total),
          retailTotal: d.retail_total ? major(d.retail_total) : major(d.total),
          perOz: d.gold_rate?.per_oz ? major(d.gold_rate.per_oz) : null,
          delivery: d.delivery_text,
        });
      })
      .catch((err) => !cancelled && setError(errorText(err)));
    return () => {
      cancelled = true;
    };
  }, [ring?.id, stone?.id, priceSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const fresh = live && ring && stone && live.key === `${ring.id}-${stone.id}` ? live : null;
  const price = useMemo(() => {
    if (!ring) return null;
    const gold = fresh?.gold ?? ring.goldValue;
    const craft = fresh?.craft ?? ring.craftFee;
    const gem = stone ? fresh?.stone ?? stone.gemPrice : 0;
    const retail = fresh?.retailTotal ?? (stone ? configuratorTotal(ring, stone) : gold + craft);
    return { gold, craft, gem, retail, total: fresh?.total ?? configPrice(retail) };
  }, [ring, stone, fresh, configPrice]);
  const perOz = fresh?.perOz ?? GOLD_RATE.perOz;

  const ready = Boolean(ring && stone && size && !error);
  const cta = !ring ? 'Choose a setting' : !stone ? 'Choose a gemstone' : !size ? 'Select your ring size' : added ? '✓ Added · View bag' : 'Add to Bag';

  const onCta = () => {
    if (added) return openCart();
    if (!ring) return setOpen('ring');
    if (!stone) return setOpen('stone');
    if (!size) return setOpen('size');
    const key = `conf-${ring.id}-${stone.id}-${size}`;
    addToCart({
      key,
      id: key,
      kind: 'config',
      ringId: ring.id,
      stoneId: stone.id,
      name: `${ring.name} x ${stone.name}`,
      subtitle: `Custom ${ring.setting} + ${stone.name}`,
      price: price.total,
      image: stone.images[ring.id] ?? ring.image,
      meta: { size, stone: stone.name, ring: ring.name },
    });
    setAdded(true);
    // Phones show the confirmation on the fixed button itself; a toast would cover it.
    if (!phone) showToast(`${ring.name} with ${stone.name} added to your bag`);
  };

  const restart = () => {
    setAdded(false);
    setParams({}, { replace: true });
    setOpen('ring');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (phone) {
    const s = { ring, stone, size, stones, sizes, price, perOz, fresh, added, ready, error, open, setOpen, chooseRing, chooseStone, chooseSize, onCta, restart, configPrice, isB2B, ringPercent, trust: TRUST };
    return <MobileStudio s={s} />;
  }

  return (
    <div className="dyr">
      <header className="dyr-head">
        <div>
          <p className="dyr-eyebrow">Bespoke atelier</p>
          <h1 className="dyr-title">
            Design your <em>own ring</em>
          </h1>
        </div>
        <p className="dyr-head-note">
          Three choices, one minute. Priced live on today&apos;s gold rate
          {perOz ? <strong> · {formatPrice(perOz)}/oz</strong> : null}
        </p>
      </header>

      <div className="dyr-grid">
        <Stage ring={ring} stone={stone} stones={CONFIG_STONES} />

        <div className="dyr-panel">
          <Section n={1} title="Setting" value={ring?.name} open={open === 'ring'} onOpen={() => setOpen(open === 'ring' ? null : 'ring')}>
            <RingOptions rings={CONFIG_RINGS} selected={ring} onChoose={chooseRing} configPrice={configPrice} />
          </Section>

          <Section
            n={2}
            title="Gemstone"
            value={stone?.name}
            open={open === 'stone'}
            locked={!ring}
            onOpen={() => setOpen(open === 'stone' ? null : 'stone')}
          >
            <StoneOptions stones={stones} ring={ring} selected={stone} onChoose={chooseStone} configPrice={configPrice} />
          </Section>

          <Section n={3} title="Ring size" value={size && `US ${size}`} open={open === 'size'} locked={!ring} onOpen={() => setOpen(open === 'size' ? null : 'size')}>
            <SizeOptions sizes={sizes} selected={size} onChoose={chooseSize} />
            <div className="dyr-size-foot">
              <span>Not sure? Order your best guess, we resize free within 60 days.</span>
              <button type="button" className="dyr-link" onClick={() => setGuide((g) => !g)} aria-expanded={guide}>
                {guide ? 'Hide size guide' : 'Size guide'}
              </button>
            </div>
            {guide && <SizeGuide />}
          </Section>

          <div className={`dyr-buy${ready ? ' ready' : ''}`}>
            <div className="dyr-buy-top">
              <div>
                <p className="dyr-buy-lbl">{stone ? 'Your ring' : ring ? 'Setting from' : 'Starting from'}</p>
                <p className="dyr-buy-price">
                  {isB2B && price && price.retail > price.total && <s>{formatPrice(price.retail)}</s>}
                  {price ? formatPrice(price.total) : formatPrice(configPrice(Math.min(...CONFIG_RINGS.map((r) => r.goldValue + r.craftFee))))}
                </p>
              </div>
              {ring && (
                <button type="button" className="dyr-link" onClick={() => setBreakdown((b) => !b)} aria-expanded={breakdown}>
                  {breakdown ? 'Hide breakdown' : 'Price breakdown'}
                </button>
              )}
            </div>
            {breakdown && price && <PriceBreakdown ring={ring} stone={stone} price={price} perOz={perOz} isB2B={isB2B} ringPercent={ringPercent} />}
            {error && <p className="field-error">{error}</p>}
            <button type="button" className="btn-gold dyr-cta" onClick={onCta} disabled={Boolean(error)}>
              {cta}
              {ready && !added && price ? ` · ${formatPrice(price.total)}` : ''}
            </button>
            <p className="dyr-buy-note">
              {ring ? `Handcrafted in ${fresh?.delivery || ring.deliveryText}` : 'Handcrafted to order'} · Secure insured delivery
              {added && (
                <>
                  {' · '}
                  <button type="button" className="dyr-link" onClick={restart}>
                    Design another
                  </button>
                </>
              )}
            </p>
          </div>

          <ul className="dyr-trust">
            {TRUST.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
