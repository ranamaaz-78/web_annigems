import Breadcrumb from '../../components/common/Breadcrumb';
import EmptyState from '../../components/common/EmptyState';
import SectionHeader from '../../components/common/SectionHeader';
import ProductGrid from '../../components/product/ProductGrid';
import { PRODUCTS } from '../../data/products';
import { useShop } from '../../hooks/useShop';

export default function WishlistPage() {
  const { wishlist } = useShop();
  const products = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="page-wrap">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
      <SectionHeader as="h1" title="Your Wishlist" />
      {products.length ? (
        <ProductGrid products={products} showCategory />
      ) : (
        <EmptyState
          icon="♥"
          title="Your wishlist is empty"
          text="Save pieces you love and come back to them anytime."
          actionLabel="Browse Collection"
          actionTo="/shop"
        />
      )}
    </div>
  );
}
