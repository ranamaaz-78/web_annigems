import { Link } from 'react-router-dom';
import SectionHeader from '../../../components/common/SectionHeader';
import { PRODUCTS } from '../../../data/products';
import GemIcon from '../../Configurator/GemIcon';

// The four signature stones, each opening the shop filtered by that stone.
const STONES = [
  { id: 'ruby', name: 'Ruby', filter: 'Ruby', color: '#d32f2f', note: 'Fiery passion' },
  { id: 'sapphire', name: 'Sapphire', filter: 'Sapphire', color: '#1e5bc6', note: 'Royal elegance' },
  { id: 'emerald', name: 'Emerald', filter: 'Emerald', color: '#0a8f6a', note: 'The finest green' },
  { id: 'diamond', name: 'Diamond', filter: 'Diamond', color: '#b9d7f2', note: 'The eternal classic', isDiamond: true },
];

const countFor = (filter) => PRODUCTS.filter((p) => (p.stone ?? '').toLowerCase().includes(filter.toLowerCase())).length;

export default function ShopByStone() {
  return (
    <section className="section stones-sec">
      <SectionHeader eyebrow="Signature gemstones" title="Shop by Stone" subtitle="Every piece starts with a stone. Choose yours." />
      <div className="stones-grid" data-stagger=".stone-card">
        {STONES.map((s) => {
          const n = countFor(s.filter);
          return (
            <Link key={s.id} className="stone-card" to={`/shop?stone=${encodeURIComponent(s.filter)}`} style={{ '--stone': s.color }}>
              <span className="stone-glow" aria-hidden="true" />
              <GemIcon stone={s} size={96} />
              <span className="stone-name">{s.name}</span>
              <span className="stone-note">{s.note}</span>
              <span className="stone-count">
                {n} {n === 1 ? 'piece' : 'pieces'} →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
