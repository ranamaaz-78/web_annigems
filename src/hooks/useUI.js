import { useContext } from 'react';
import { UIContext } from '../context/contexts';

export const useUI = () => useContext(UIContext);
