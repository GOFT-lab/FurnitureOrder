<template>
  <div class="row mt-5">
    <div class="col-md-5 m-auto">
      <div class="card card-body text-center">
        <h1>Sign Up</h1>
        <form @submit.prevent="registration">
          <div class="form-group">
            <label for="firstName" class="float-left">First name</label>
            <input
              type="text"
              name="firstName"
              v-model="firstName"
              class="form-control"
              placeholder="Enter your first name" />
          </div>
          <div class="form-group">
            <label for="lastName" class="float-left">Last name</label>
            <input
              type="text"
              name="lastName"
              v-model="lastName"
              class="form-control"
              placeholder="Enter your last name" />
          </div>
          <div class="form-group">
            <label for="email" class="float-left">Email</label>
            <input
              type="email"
              name="email"
              v-model="email"
              class="form-control"
              placeholder="Enter your email address" />
          </div>
          <div class="form-group">
            <label for="password" class="float-left">Password</label>
            <input
              type="password"
              name="password"
              v-model="password"
              class="form-control"
              placeholder="Enter your password"
              @input="checkPasswordsMatch" />
          </div>
          <div class="form-group">
            <label for="confirmPassword" class="float-left"
              >Confirm password</label
            >
            <input
              type="password"
              name="confirmPassword"
              v-model="confirmPassword"
              class="form-control"
              placeholder="Confirm your password"
              @input="
                touchedConfirmPassword = true;
                checkPasswordsMatch();
              " />
            <small
              v-if="passwordError && touchedConfirmPassword"
              class="text-danger">
              {{ passwordError }}
            </small>
          </div>
          <button type="submit" class="btn btn-primary">Sign up</button>
        </form>
        <p class="lead mt-4"></p>
        <p>
          Already have an account?
          <abbr title="attribute">
            <router-link to="/login">Login</router-link>.
          </abbr>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import { useAuthStore } from '@/storage/authStore';
  import { useRouter } from 'vue-router';

  export default {
    name: 'UserSignUp',
    data() {
      return {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        touchedConfirmPassword: false,
        passwordError: '',
      };
    },
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
      return { authStore, router };
    },
    methods: {
      checkPasswordsMatch() {
        if (!this.password || !this.confirmPassword) {
          this.passwordError = '';
          return;
        }
        this.passwordError =
          this.password !== this.confirmPassword
            ? 'Passwords do not match.'
            : '';
      },
      async registration() {
        this.touchedConfirmPassword = true;
        this.checkPasswordsMatch();

        if (this.passwordError) return;
        try {
          await axios.post('http://localhost:3001/register', {
            user: {
              first_name: this.firstName,
              last_name: this.lastName,
              email: this.email,
              password: this.password,
              confirm_password: this.confirmPassword,
            },
          });
          const loginResponse = await axios.post(
            'http://localhost:3001/login',
            {
              email: this.email,
              password: this.password,
            }
          );
          this.authStore.token = loginResponse.data.token;
          this.authStore.isAuthenticated = true;

          this.router.push('/');

          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Successfully signed up and logged in',
          });
        } catch (e) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text:
              e.response?.data?.message ||
              'An error occurred during registration',
          });
        }
      },
    },
  };
</script>
