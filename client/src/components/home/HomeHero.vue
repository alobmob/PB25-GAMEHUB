<template>
  <section style="padding:24px;border:1px solid #e5e7eb;border-radius:16px;display:grid;gap:12px">
    <h1 style="margin:0;font-size:24px">GameHub</h1>
    <p style="margin:0;color:#555">
      Przegladaj gry, tworz prywatne listy, oceniaj i komentuj.
    </p>
    <div style="display:flex;gap:8px">
      <router-link to="/games" style="padding:8px 12px;border:1px solid #111;border-radius:10px">Przegladaj gry
      </router-link>
      <router-link to="/login" style="padding:8px 12px;border:1px solid #e5e7eb;border-radius:10px">Zaloguj
      </router-link>
    </div>
  </section>
</template>