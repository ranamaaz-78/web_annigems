import { useShop } from './useShop';
import { useUI } from './useUI';

// Toggle a product in the wishlist and confirm with a toast.
export function useWishlistToggle() {
  const { toggleWishlist } = useShop();
  const { showToast } = useUI();
  return (id) => {
    const added = toggleWishlist(id);
    showToast(added ? 'Added to wishlist ♥' : 'Removed from wishlist');
  };
}
