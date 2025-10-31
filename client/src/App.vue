<template>
  <header style="padding:12px;border-bottom:1px solid #ddd;display:flex;gap:12px">
    <router-link to="/">GameHub</router-link>
    <router-link to="/games">Gry</router-link>
    <div style="margin-left:auto;display:flex;gap:12px">
      <router-link to="/login">Logowanie</router-link>
      <router-link to="/register">Rejestracja</router-link>
    </div>
  </header>
  <main style="padding:16px">
    <router-view/>
  </main>
</template>