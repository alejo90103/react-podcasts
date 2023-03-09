import { useContext } from 'react';
import { LoadingContext } from '../contexts/loadingContext';

export default function useLoadingContext() {
  return useContext(LoadingContext);
}