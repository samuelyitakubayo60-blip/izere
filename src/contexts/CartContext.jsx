import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'izere_shop_cart';
const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);
    setItems((prev) => {
      const index = prev.findIndex((row) => row.id === product.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...next[index], quantity: next[index].quantity + qty };
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          category: product.category,
          name_en: product.name_en,
          name_rw: product.name_rw,
          price_rwf: product.price_rwf,
          image_url: product.image_url,
          unit_en: product.unit_en,
          unit_rw: product.unit_rw,
          quantity: qty,
        },
      ];
    });
  };

  const setQuantity = (productId, quantity) => {
    const qty = Math.max(0, Number(quantity) || 0);
    setItems((prev) => {
      if (qty <= 0) return prev.filter((row) => row.id !== productId);
      return prev.map((row) => (row.id === productId ? { ...row, quantity: qty } : row));
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((row) => row.id !== productId));
  };

  const clearCart = () => setItems([]);

  const count = useMemo(() => items.reduce((sum, row) => sum + row.quantity, 0), [items]);
  const totalRwf = useMemo(
    () => items.reduce((sum, row) => sum + row.price_rwf * row.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, setQuantity, removeItem, clearCart, count, totalRwf }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
