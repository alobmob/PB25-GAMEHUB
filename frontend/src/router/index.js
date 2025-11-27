import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import GameDetails from '../views/GameDetails.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Rankings from '../views/Rankings.vue'
import Profile from '../views/Profile.vue'

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/game/:id', name: 'game-details', component: GameDetails, props: true },
    { path: '/rankings', name: 'rankings', component: Rankings },
    { path: '/profile', name: 'profile', component: Profile },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register }
]

export default createRouter({
    history: createWebHistory(),
    routes
})