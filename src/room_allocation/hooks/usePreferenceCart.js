import { useState } from 'react';

const MAX_PREFERENCES = 5;

export function usePreferenceCart() {
  const [cart, setCart] = useState([]);

  const add = (roomId) => {
    setCart(prev => {
      if (prev.includes(roomId) || prev.length >= MAX_PREFERENCES) return prev;
      return [...prev, roomId];
    });
  };

  const remove = (roomId) => setCart(prev => prev.filter(id => id !== roomId));

  const moveUp = (index) => {
    if (index === 0) return;
    setCart(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index) => {
    setCart(prev => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const clear = () => setCart([]);
  const isInCart = (roomId) => cart.includes(roomId);
  const isFull = cart.length >= MAX_PREFERENCES;

  return { cart, add, remove, moveUp, moveDown, clear, isInCart, isFull, MAX_PREFERENCES };
}
