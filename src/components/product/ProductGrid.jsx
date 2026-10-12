import ProductCard from './ProductCard';

// variant: undefined (4 cols) | 'cols3' | 'cols5'
export default function ProductGrid({ products, variant, showCategory = false, children }) {
  return (
    <div className={`prod-grid${variant ? ` ${variant}` : ''}`} data-stagger=".pc">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} showCategory={showCategory} />
      ))}
      {children}
    </div>
  );
}
