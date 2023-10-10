import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: LoginView
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: RegisterView
    },
    {
      path: '/spot/détails/:spotId',
      name: 'spotDetails',
      component: SpotDetailsView
    },
    {
      path: '/favoris/:userId',
      name: 'favoris',
      component: FavoriteView
    },
    {
      path: '/profile/:userId',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/cgu',
      name: 'cgu',
      component: CguView
    },
  ]
})

export default router
