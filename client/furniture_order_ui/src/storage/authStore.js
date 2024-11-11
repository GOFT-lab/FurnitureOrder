import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || null,
    isAuthenticated: !!localStorage.getItem('authToken'),
  }),
  actions: {
    login(token) {
      localStorage.setItem('authToken', token);
      this.token = token;
      this.isAuthenticated = true;
    },
    logout() {
      localStorage.removeItem('authToken');
      this.token = null;
      this.isAuthenticated = false;
    },
    loadToken() {
      this.token = localStorage.getItem('authToken');
      this.isAuthenticated = !!this.token;
    },
  },
});
