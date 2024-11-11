import { defineStore } from 'pinia';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    userProfile: null,
  }),
  actions: {
    setUserProfile(userData) {
      this.userProfile = userData;
      localStorage.setItem('userProfile', JSON.stringify(userData));
    },
    loadUserProfile() {
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        this.userProfile = JSON.parse(userProfile);
      }
    },
    clearUserProfile() {
      this.userProfile = null;
      localStorage.removeItem('userProfile');
    },
    updateVerificationStatus(status) {
      if (this.userProfile) {
        this.userProfile.email_verification_status = status;
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
      }
    },
  },
});
