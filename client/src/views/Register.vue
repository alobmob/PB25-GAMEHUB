<script setup>

import { ref, computed} from 'vue';
import axios from 'axios';

const name = ref('');
const surname = ref('');
const nick = ref('');
const email = ref('');
const password = ref('');
const confirm = ref('');
const show = ref(false);
const loading = ref(false);
const touched = ref({ name: false, surname: false, nick: false,email: false, password: false, confirm: false});


const emailValid = computed(()=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
const nickValid = computed(()=> nick.value.trim().length>=3);
const passValid = computed(()=> password.value.length>=6);
const confirmValid = computed(()=> password.value==confirm.value);
const formValid = computed(() => name.value.trim() && surname.value.trim() &&
        nick.value && email.value && password.value && confirm.value);

function blurField(k) {
    touched.value[k] = true;
 }

    async function onSubmit() {
        if (!formValid.value) return;
        loading.value = true;
        try {
            const res = await axios.post('http://localhost:3000/api/auth/register', {
                name: name.value,
                surname: surname.value,
                nick: nick.value,
                email: email.value,
                password: password.value

            });
            alert(res.data.message);
            window.location.href = '/login';
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
            <h1>Rejestracja</h1>

            <form class="form" @submit.prevent="onSubmit">
                <div class="name">
                    <label class="label" for="name">Name</label>
                    <input id="name" class="input" v-model.trim="name" @blur="blurField('name')"
                           placeholder="np.'Chuck'" />
                </div>
                <div class="field">
                    <label class="label" for="surname">Surname</label>
                    <input id="surname" class="input" v-model.trim="surname" @blur="blurField('surname')"
                           placeholder="np.'Norris'" />
                </div>
                <div class="field">
                    <label class="label" for="nick">Nick</label>
                    <input id="nick" class="input" v-model.trim="nick" @blur="blurField('nick')"
                           placeholder="np. 'ChuckNorris1940'" />
                    <p v-if="touched.nick && !nickValid" class="error">Podaj prawidlowy nick</p>
                </div>
                <div class="field">
                    <label class="label" for="email">Email</label>
                    <input id="email" class="input" type="email" v-model.trim="email" @blur="blurField('email')"
                           placeholder="name@example.com" />
                    <p v-if="touched.email && !emailValid" class="error">Podaj prawidlowy email</p>
                </div>

                <div class="field">
                    <div class="row">
                        <label class="label" for="password">Haslo</label>
                        <button type="button" class="link" @click="show=!show">{{ show ? 'ukryj' : 'pokaz' }}</button>
                    </div>
                    <input id="password" class="input" :type="show ? 'text' : 'password'" v-model="password"
                           @blur="blurField('password')" placeholder="co najmniej 6 znakow" />
                    <p v-if="touched.password && !passValid" class="error">Haslo musi miec min. 6 znakow</p>
                </div>
                <div class="field">
                    <div class="row">
                        <label class="label" for="confirm">Powtórz has³o</label>
                    </div>
                    <input id="confirm" class="input" :type="show ? 'text' : 'password'" v-model="confirm"
                           @blur="blurField('confirm')" />
                    <p v-if="touched.confirm && !confirmValid" class="error">Has³a musz¹ byæ takie same.</p>
                </div>


                <div class="actions">
                    <router-link to="/login" class="link">Masz konto? Zaloguj siê!</router-link>
                    <button class="btn btn-primary" :disabled="!formValid || loading" type="submit">
                        {{ loading ? 'Rejestracja...' : 'Zarejestruj' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>