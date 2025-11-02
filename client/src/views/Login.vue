<script setup>
import {ref, computed} from 'vue';
import axios from 'axios';

const email = ref('');
const password = ref('');
const show = ref(false);
const loading = ref(false);
const touched = ref({email: false, password: false});

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
const passValid = computed(() => password.value.length >= 6);
const formValid = computed(() => emailValid.value && passValid.value);

function blurField(k) {
  touched.value[k] = true;
}

async function onSubmit() {
  touched.value = {email: true, password: true};
  if (!formValid.value) return;
  loading.value = true;
  try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
          email: email.value,
          password: password.value
      });

      //logowanie sie powiod³o
      console.log('Zalogowano:', res.data);

      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert(`Witaj ${res.data.user.nick || res.data.user.email}!`);

      //przekierowanie na stronê g³ówn¹
      window.location.href = '/';
  } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Nie uda³o siê zalogowaæ.');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-wrap">
    <div class="card auth-card">
      <h1>Logowanie</h1>

      <form class="form" @submit.prevent="onSubmit">
        <div class="field">
          <label class="label" for="email">Email</label>
          <input id="email" class="input" type="email" v-model.trim="email" @blur="blurField('email')"
                 placeholder="name@example.com"/>
          <p v-if="touched.email && !emailValid" class="error">Podaj prawidlowy email</p>
        </div>

        <div class="field">
          <div class="row">
            <label class="label" for="password">Haslo</label>
            <button type="button" class="link" @click="show=!show">{{ show ? 'ukryj' : 'pokaz' }}</button>
          </div>
          <input id="password" class="input" :type="show ? 'text' : 'password'" v-model="password"
                 @blur="blurField('password')" placeholder="co najmniej 6 znakow"/>
          <p v-if="touched.password && !passValid" class="error">Haslo musi miec min. 6 znakow</p>
        </div>

        <div class="actions">
          <router-link to="/register" class="link">Nie masz konta? Rejestracja</router-link>
          <button class="btn btn-primary" :disabled="!formValid || loading" type="submit">
            {{ loading ? 'Logowanie...' : 'Zaloguj' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>