import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import SpotDetailsView from '../views/SpotDetailsView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: LoginView
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: RegisterView
    },
    {
      path: '/spot/details/:spotId',
      name: 'spotDetails',
      component: SpotDetailsView
    },
    {
      path: '/favoris/:userId',
      name: 'favoris',
      component: FavoritesView
    },
    {
      path: '/profile/:userId',
      name: 'profile',
      component: ProfileView
    },
    // {
    //   path: '/cgu',
    //   name: 'cgu',
    //   component: CguView
    // },
  ]
})

export default router
