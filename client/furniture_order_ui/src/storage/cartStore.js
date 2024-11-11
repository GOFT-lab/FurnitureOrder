import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cartItems')) || [], // Завантажуємо з localStorage або використовуємо порожній масив
  }),

  getters: {
    // Обчислює загальну кількість товарів у кошику
    totalItems(state) {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    // Обчислює загальну вартість товарів у кошику
    totalPrice(state) {
      return state.items
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2);
    },
    // Перевіряє, чи кошик порожній
    isEmpty(state) {
      return state.items.length === 0;
    },
  },

  actions: {
    // Додає товар у кошик
    addToCart(item) {
      const existingItem = this.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity++; // Якщо товар вже є, збільшуємо кількість
      } else {
        this.items.push(item); // Якщо товару немає, додаємо його в масив
      }
      this.saveCart(); // Зберігаємо оновлений кошик у localStorage
    },

    // Видаляє товар з кошика
    removeFromCart(itemId) {
      this.items = this.items.filter((item) => item.id !== itemId); // Фільтруємо масив без цього товару
      this.saveCart(); // Зберігаємо оновлений кошик у localStorage
    },

    // Очищає весь кошик
    clearCart() {
      this.items = []; // Очищаємо масив
      this.saveCart(); // Зберігаємо порожній кошик у localStorage
    },

    // Зберігає поточний стан кошика в localStorage
    saveCart() {
      localStorage.setItem('cartItems', JSON.stringify(this.items)); // Перетворюємо масив в JSON і зберігаємо
    },
  },
});
