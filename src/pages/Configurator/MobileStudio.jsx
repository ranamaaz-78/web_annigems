import { useCallback, useEffect, useRef, useState } from 'react';
import BottomSheet from '../../components/overlays/BottomSheet';
import { CONFIG_RINGS, CONFIG_STONES } from '../../data/configurator';
import { formatPrice } from '../../utils/format';
import { PriceBreakdown, RingOptions, SizeGuide, SizeOptions, StoneOptions } from './Options';
import Stage from './Stage';

// Phones and tablets: everything on one screen, no page scrolling.
// Photo on top (always visible), three tabs, the options of the active tab, and a slim price + button bar.
// Secondary detail (price breakdown, size guide) opens in bottom sheets.
export default function MobileStudio({ s }) {
  const { ring, stone, size, stones, sizes, price, perOz, fresh, added, ready, error } = s;
  const tab = s.open ?? (!ring ? 'ring' : !stone ? 'stone' : 'size');
  const [sheet, setSheet] = useState(null); // 'details' | 'guide' | null
  const closeSheet = useCallback(() => setSheet(null), []);
  const panel = useRef(null);

  // Keep the selected card of a swipe row in view when its tab opens.
  useEffect(() => {
    const row = panel.current?.querySelector('.dyr-rings, .dyr-stones');
    const sel = row?.querySelector('.sel');
    if (row && sel) row.scrollTo({ left: sel.offsetLeft - (row.clientWidth - sel.clientWidth) / 2, behavior: 'smooth' });
  }, [tab]);

  const tabs = [
    { id: 'ring', label: 'Setting', value: ring?.name },
    { id: 'stone', label: 'Stone', value: stone?.name, locked: !ring },
    { id: 'size', label: 'Size', value: size && `US ${size}`, locked: !ring },
  ];

  const cta = added ? '✓ View bag' : !ring ? 'Choose a setting' : !stone ? 'Choose a stone' : !size ? 'Choose your size' : 'Add to Bag';
  const fromPrice = formatPrice(s.configPrice(Math.min(...CONFIG_RINGS.map((r) => r.goldValue + r.craftFee))));

  return (
    <div className="dym">
      <h1 className="visually-hidden">Design your own ring</h1>
      <Stage ring={ring} stone={stone} stones={CONFIG_STONES} />

      <div className="dym-tabs" role="tablist" aria-label="Design steps">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            disabled={t.locked}
            className={`dym-tab${tab === t.id ? ' on' : ''}${t.value ? ' done' : ''}`}
            onClick={() => s.setOpen(t.id)}
          >
            <span className="dym-tab-k">
              <b>{t.value ? '✓' : i + 1}</b> {t.label}
            </span>
            <span className="dym-tab-v">{t.value || (t.locked ? '—' : 'Choose')}</span>
          </button>
        ))}
      </div>

      <div className="dym-panel" ref={panel} role="tabpanel" key={tab}>
        {tab === 'ring' && <RingOptions rings={CONFIG_RINGS} selected={ring} onChoose={s.chooseRing} configPrice={s.configPrice} />}
        {tab === 'stone' && <StoneOptions stones={stones} ring={ring} selected={stone} onChoose={s.chooseStone} configPrice={s.configPrice} />}
        {tab === 'size' && (
          <>
            <SizeOptions sizes={sizes} selected={size} onChoose={s.chooseSize} />
            <p className="dym-size-help">
              Free resize within 60 days.
              <button type="button" className="dyr-link" onClick={() => setSheet('guide')}>
                Find your size
              </button>
            </p>
          </>
        )}
      </div>

      <div className={`dym-bar${ready ? ' ready' : ''}`}>
        <button type="button" className="dym-price" onClick={() => setSheet('details')} disabled={!ring} aria-label="Show price details">
          <span className="dym-price-k">{stone ? 'Total' : 'From'}</span>
          <span className="dym-price-v">{price ? formatPrice(price.total) : fromPrice}</span>
          {ring && <span className="dym-price-more">Details ▴</span>}
        </button>
        <button type="button" className="btn-gold dym-cta" onClick={s.onCta} disabled={Boolean(error)}>
          {cta}
        </button>
      </div>

      <BottomSheet open={sheet === 'details'} onClose={closeSheet} title="Your ring">
        {ring && price && (
          <>
            <ul className="dym-sum">
              <li>
                <span>Setting</span>
                <b>{ring.name}</b>
              </li>
              <li>
                <span>Stone</span>
                <b>{stone?.name ?? 'Not chosen yet'}</b>
              </li>
              <li>
                <span>Size</span>
                <b>{size ? `US ${size}` : 'Not chosen yet'}</b>
              </li>
              <li>
                <span>Delivery</span>
                <b>Handcrafted in {fresh?.delivery || ring.deliveryText}</b>
              </li>
            </ul>
            <PriceBreakdown ring={ring} stone={stone} price={price} perOz={perOz} isB2B={s.isB2B} ringPercent={s.ringPercent} />
            <div className="dym-total">
              <span>Total</span>
              <b>{formatPrice(price.total)}</b>
            </div>
            {error && <p className="field-error">{error}</p>}
            <ul className="dyr-trust">
              {s.trust.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <div className="dym-sheet-acts">
              {ready && (
                <button
                  type="button"
                  className="btn-gold"
                  onClick={() => {
                    closeSheet();
                    s.onCta();
                  }}
                >
                  {added ? '✓ View bag' : `Add to Bag · ${formatPrice(price.total)}`}
                </button>
              )}
              <button
                type="button"
                className="btn-outline"
                onClick={() => {
                  closeSheet();
                  s.restart();
                }}
              >
                Start a new design
              </button>
            </div>
          </>
        )}
      </BottomSheet>

      <BottomSheet open={sheet === 'guide'} onClose={closeSheet} title="Find your size">
        <SizeGuide />
        <p className="dym-size-help">Between two sizes? Choose the larger one. We resize free within 60 days.</p>
      </BottomSheet>
    </div>
  );
}
