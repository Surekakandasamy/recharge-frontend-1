import { useState, useEffect } from 'react';
import { store } from '../store';

export const useStore = () => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(setState);
    return unsubscribe;
  }, []);

  return [state, store.setState.bind(store)];
};