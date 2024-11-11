<template>
  <nav class="app-header navbar navbar-expand-lg navbar-dark bg-primary">
    <!-- Назва бренду -->
    <router-link class="navbar-brand" to="/">Furniture Order</router-link>

    <!-- Кнопка для мобільного меню -->
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarColor01"
      aria-controls="navbarColor01"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Меню навігації -->
    <div class="collapse navbar-collapse" id="navbarColor01">
      <ul class="navbar-nav ml-auto">
        <!-- Авторизація або Профіль -->
        <li v-if="!authStore.isAuthenticated" class="nav-item dropdown">
          <div
            class="nav-link dropdown-toggle"
            data-toggle="dropdown"
            role="button"
            aria-haspopup="true"
            aria-expanded="false">
            Sign In
          </div>
          <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
            <router-link to="/login" class="dropdown-item">Login</router-link>
            <router-link to="/registration" class="dropdown-item"
              >Sign Up</router-link
            >
          </div>
        </li>

        <li v-else class="nav-item dropdown">
          <div
            class="nav-link dropdown-toggle"
            data-toggle="dropdown"
            role="button"
            aria-haspopup="true"
            aria-expanded="false">
            Profile
          </div>
          <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
            <router-link to="/profile" class="dropdown-item"
              >Profile</router-link
            >
            <button class="dropdown-item" @click="logout">Logout</button>
          </div>
        </li>

        <!-- Іконка кошика з показником кількості товарів -->
        <li class="nav-item position-relative">
          <router-link to="/cart" class="nav-link">
            <i class="fas fa-shopping-cart cart-icon"></i>
            <span class="badge badge-light cart-badge" v-if="cartItemCount > 0">
              {{ cartItemCount }}
            </span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  import { computed } from 'vue';
  import { useAuthStore } from '../storage/authStore';
  import { useCartStore } from '../storage/cartStore';

  export default {
    name: 'AppHeader',
    setup() {
      const authStore = useAuthStore();
      const cartStore = useCartStore();

      const logout = () => {
        authStore.logout();
        window.location.href = '/login';
      };

      // Підрахунок кількості товарів у кошику
      const cartItemCount = computed(() => {
        return cartStore.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
      });

      return {
        authStore,
        logout,
        cartItemCount,
      };
    },
  };
</script>

<style scoped>
  /* Стиль для іконки кошика */
  .cart-icon {
    font-size: 1.5rem;
    position: relative;
  }

  /* Стиль для показника кількості товарів у кошику */
  .cart-badge {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    position: absolute;
    top: -5px;
    left: -10px;
    border-radius: 50%;
  }
</style>
