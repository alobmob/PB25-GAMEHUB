import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Games from '../views/Games.vue';
import GameDetails from '../views/GameDetails.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/games', name: 'games', component: Games },
    { path: '/games/:id', name: 'game-details', component: GameDetails, props: true },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register }
];

export default createRouter({ history: createWebHistory(), routes });