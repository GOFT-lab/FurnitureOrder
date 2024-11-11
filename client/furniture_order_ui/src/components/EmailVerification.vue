<template>
  <div class="row mt-5">
    <div class="col-md-5 m-auto">
      <div class="card card-body text-center">
        <h1>Email Verification</h1>
        <form @submit.prevent="verifyEmail">
          <div class="form-group">
            <label for="token" class="float-left">Token</label>
            <input
              type="text"
              name="token"
              v-model="token"
              class="form-control"
              placeholder="Enter your token from your email address" />
          </div>
          <button type="submit" class="btn btn-primary">Verify Email</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { useProfileStore } from '@/storage/profileStore';
  import { ref } from 'vue';

  export default {
    name: 'EmailVerification',
    setup() {
      const token = ref('');
      const profileStore = useProfileStore();
      const email = ref(
        localStorage.getItem('userProfile')
          ? JSON.parse(localStorage.getItem('userProfile')).email
          : ''
      );

      const verifyEmail = async () => {
        try {
          const response = await axios.post(
            'http://localhost:3001/email_verification',
            {
              email: email.value,
              token: token.value,
            }
          );

          console.log('Response data:', response.data);
          if (response.data.ok) {
            alert('Email verified successfully!');
            await profileStore.updateVerificationStatus('VERIFIED');
          } else {
            alert(
              'Verification failed. Please check your token and try again.'
            );
          }
        } catch (error) {
          console.error('Verification error:', error);
          alert('Verification failed. Please check your token and try again.');
        }
      };

      return {
        token,
        email,
        verifyEmail,
      };
    },
  };
</script>
