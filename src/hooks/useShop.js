import { useContext } from 'react';
import { ShopContext } from '../context/contexts';

export const useShop = () => useContext(ShopContext);
