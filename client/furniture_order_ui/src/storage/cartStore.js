import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cartItems')) || [],
  }),

  getters: {
    totalItems(state) {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    totalPrice(state) {
      return state.items
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2);
    },
    isEmpty(state) {
      return state.items.length === 0;
    },
  },

  actions: {
    addToCart(item) {
      const existingItem = this.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push(item);
      }
      this.saveCart();
    },
    removeFromCart(itemId) {
      this.items = this.items.filter((item) => item.id !== itemId);
      this.saveCart();
    },
    clearCart() {
      this.items = [];
      this.saveCart();
    },
    saveCart() {
      localStorage.setItem('cartItems', JSON.stringify(this.items));
    },
  },
});
