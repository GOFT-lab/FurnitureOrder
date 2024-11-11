<template>
  <div class="containerShadow">
    <AppHeader />
    <div class="main-content">
      <router-view />
    </div>
    <AppFooter />
  </div>
</template>

<script>
  import AppHeader from './components/AppHeader.vue';
  import AppFooter from './components/AppFooter.vue';

  export default {
    name: 'App',
    components: {
      AppHeader,
      AppFooter,
    },
  };
</script>

<style>
  .main-content {
    flex: 1;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
