<template>
  <div class="row mt-5">
    <div class="col-md-5 m-auto">
      <div class="card card-body text-center">
        <h1>Login</h1>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="email" class="float-left">Email</label>
            <input
              type="email"
              name="email"
              v-model="email"
              class="form-control"
              placeholder="Enter your email address"
              required />
          </div>
          <div class="form-group">
            <label for="password" class="float-left">Password</label>
            <input
              type="password"
              name="password"
              v-model="password"
              class="form-control"
              placeholder="Enter your password"
              required />
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <p class="lead mt-4"></p>
        <p>
          Don’t have an account?
          <router-link to="/registration">Sign up</router-link>.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import { useAuthStore } from '../storage/authStore';

  export default {
    name: 'UserLogin',
    data() {
      return {
        email: '',
        password: '',
      };
    },
    setup() {
      const authStore = useAuthStore();
      return { authStore };
    },
    methods: {
      async login() {
        try {
          axios.defaults.baseURL = 'http://localhost:3001';

          const response = await axios.post('/login', {
            email: this.email,
            password: this.password,
          });

          const token = response.data.token;
          this.authStore.login(token);
          // console.log(token);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Successfully logged in',
          });

          this.$router.push('/');
        } catch (e) {
          console.error('Login error:', e);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text:
              e.response?.data?.message || 'An error occurred while logging in',
          });
        }
      },
    },
  };
</script>
