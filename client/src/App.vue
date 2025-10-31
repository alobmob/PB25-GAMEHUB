<template>
  <header class="site-header">
    <div class="container nav-container">
      <router-link to="/" class="nav-logo">gamehub</router-link>
      <div class="nav-spacer"></div>
      <div class="nav-actions">
        <router-link class="btn" to="/login">Logowanie</router-link>
        <router-link class="btn btn-primary" to="/register">Rejestracja</router-link>
      </div>
    </div>
  </header>

  <main class="container">
    <router-view />
  </main>
</template>