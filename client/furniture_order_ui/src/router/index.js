import { createWebHistory, createRouter } from 'vue-router';
import MyHome from '../components/MyHome.vue';
import UserRegistration from '../components/UserRegistration.vue';
import UserLogin from '../components/UserLogin.vue';
import UserProfile from '@/components/UserProfile.vue';
import EmailVerification from '@/components/EmailVerification.vue';
import FurnitureItem from '../components/FurnitureItem.vue';
import FurnitureCart from '../components/FurnitureCart.vue';

const routes = [
  {
    name: 'Home',
    path: '/',
    component: MyHome,
  },
  {
    name: 'Login',
    path: '/login',
    component: UserLogin,
  },
  {
    name: 'Registration',
    path: '/registration',
    component: UserRegistration,
  },
  {
    name: 'Profile',
    path: '/profile',
    component: UserProfile,
  },
  {
    name: 'Email Verification',
    path: '/verify-email',
    component: EmailVerification,
  },
  {
    name: 'Email Verification',
    path: '/verify-email',
    component: EmailVerification,
  },
  {
    path: '/furniture/:id',
    name: 'FurnitureItem',
    component: FurnitureItem,
    props: true,
  },
  {
    name: 'Cart',
    path: '/cart',
    component: FurnitureCart,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
