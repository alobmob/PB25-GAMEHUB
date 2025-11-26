<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const user = ref(null);

    onMounted(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) user.value = JSON.parse(storedUser);
    });

    function logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        user.value = null;
        router.push('/'); 
    }
</script>

<template>
    <header class="site-header">
        <div class="container nav-container">
            <router-link to="/" class="nav-logo">gamehub</router-link>
            <div class="nav-spacer"></div>
            <div class="nav-actions">
                <div v-if="user">
                    <span>Zalogowany: {{ user.nick || user.email }}</span>
                    <button class="btn btn-secondary" @click="logout">Wyloguj</button>
                </div>
                <div v-else>
                    <router-link class="btn" to="/login">Logowanie</router-link>
                    <router-link class="btn btn-primary" to="/register">Rejestracja</router-link>
                </div>
            </div>
        </div>
    </header>

    <main class="container">
        <router-view />
    </main>
</template>
