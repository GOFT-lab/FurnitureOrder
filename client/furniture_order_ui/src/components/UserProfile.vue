<template>
  <div class="containerShadow">
    <header class="app-header bg-light p-3">
      <h1 class="text-center">Особиста інформація</h1>
    </header>

    <main class="container my-4">
      <div v-for="section in sections" :key="section.title" class="card mb-3">
        <div class="card-header bg-light font-weight-bold">
          {{ section.title }}
        </div>
        <div class="card-body">
          <div
            v-for="field in section.fields"
            :key="field.label"
            class="d-flex justify-content-between mb-2">
            <label class="font-weight-bold">{{ field.label }}</label>
            <span>
              <template
                v-if="field.label === 'Email (Login)' && !isEmailVerified">
                <button
                  @click="sendEmailVerification"
                  class="text-danger"
                  title="Click to verify your email">
                  {{ field.value }} (Unverified)
                </button>
              </template>
              <template v-else>
                {{ field.value }}
              </template>
            </span>
          </div>
          <button class="btn btn-dark w-100">Редагувати</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../storage/authStore';
  import { useProfileStore } from '../storage/profileStore';

  const profileStore = useProfileStore();
  const router = useRouter();

  const isEmailVerified = ref(false);
  const sections = ref([
    {
      title: 'Мій акаунт',
      fields: [
        { label: 'Email (Login)', value: '' },
        { label: 'Прізвище', value: '' },
        { label: "Ім'я", value: '' },
        { label: 'Роль', value: '' },
      ],
    },
    {
      title: 'Дані для доставки',
      fields: [
        { label: 'Країна', value: '' },
        { label: 'Місто', value: '' },
        { label: 'Адреса', value: '' },
        { label: 'Поштовий індекс', value: '' },
      ],
    },
    {
      title: 'Редагувати пароль',
      fields: [{ label: 'Пароль', value: '**************' }],
    },
  ]);

  const updateSections = (userData) => {
    sections.value[0].fields[0].value = userData.email || 'Не вказано';
    sections.value[0].fields[1].value = userData.last_name || 'Не вказано';
    sections.value[0].fields[2].value = userData.first_name || 'Не вказано';
    sections.value[0].fields[3].value = userData.role || 'Не вказано';

    isEmailVerified.value =
      String(userData.email_verification_status) === 'VERIFIED';

    sections.value[1].fields[0].value = userData.country || 'Не вказано';
    sections.value[1].fields[1].value = userData.city || 'Не вказано';
    sections.value[1].fields[2].value = userData.address || 'Не вказано';
    sections.value[1].fields[3].value = userData.delivery_index || 'Не вказано';
  };

  const fetchUserProfile = async () => {
    const authStore = useAuthStore();
    const token = authStore.token;

    try {
      const response = await axios.get('http://localhost:3001/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data.user;

      profileStore.setUserProfile(userData);
      updateSections(userData);
    } catch (error) {
      console.error('Не вдалося отримати профіль користувача:', error);
      alert('Профіль користувача не знайдено');
    }
  };

  onMounted(() => {
    profileStore.loadUserProfile();

    if (profileStore.userProfile) {
      updateSections(profileStore.userProfile);
    } else {
      fetchUserProfile();
    }
  });

  const sendEmailVerification = async () => {
    const userData = profileStore.userProfile;

    try {
      await axios.post('http://localhost:3001/send_email_verification_token', {
        email: userData.email,
        name: `${userData.first_name} ${userData.last_name}`,
      });
      alert('Лист для підтвердження було надіслано!');
      router.push('/verify-email');
    } catch (error) {
      console.error('Не вдалося надіслати лист для підтвердження:', error);
      alert('Не вдалося надіслати лист для підтвердження.');
    }
  };
</script>
