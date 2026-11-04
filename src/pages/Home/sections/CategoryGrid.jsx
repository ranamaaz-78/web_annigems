import { Link } from 'react-router-dom';
import SectionHeader from '../../../components/common/SectionHeader';
import { CATEGORIES } from '../../../data/catalog';
import { HOME } from '../../../data/site';

export default function CategoryGrid() {
  return (
    <section className="section">
      <SectionHeader
        title={HOME.categorySection?.title || 'Shop by Category'}
        subtitle={HOME.categorySection?.subtitle || 'From everyday elegance to once-in-a-lifetime pieces'}
      />
      <div className="cats-grid" data-stagger=".cat-card">
        {CATEGORIES.map((cat) => (
          <Link className="cat-card" key={cat.id} to={`/shop?cat=${cat.id}`}>
            <div className="cat-img-wrap">
              <img className="cat-img" src={cat.image} alt={cat.label} loading="lazy" />
              <div className="cat-overlay" />
            </div>
            <div className="cat-body">
              <h3 className="cat-name">{cat.label}</h3>
              <p className="cat-count">{cat.count} pieces</p>
              <span className="cat-link">Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
