import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,

  addItem: (product) => {
    const { items } = get();
    const existingItem = items.find(item => item.id === product.id);

    let newItems;
    if (existingItem) {
      newItems = items.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [...items, { ...product, quantity: 1 }];
    }

    set({
      items: newItems,
      total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      itemCount: newItems.reduce((count, item) => count + item.quantity, 0)
    });
  },

  removeItem: (productId) => {
    const { items } = get();
    const newItems = items.filter(item => item.id !== productId);

    set({
      items: newItems,
      total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      itemCount: newItems.reduce((count, item) => count + item.quantity, 0)
    });
  },

  updateQuantity: (productId, quantity) => {
    const { items } = get();
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    const newItems = items.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );

    set({
      items: newItems,
      total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      itemCount: newItems.reduce((count, item) => count + item.quantity, 0)
    });
  },

  clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
}));
