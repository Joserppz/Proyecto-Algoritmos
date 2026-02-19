import { createRouter, createWebHistory } from 'vue-router'

import Inicio from '../views/Inicio.vue'
import Algoritmos from '../views/Algoritmos.vue'
import Nodos from '../views/Nodos.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: Inicio
    },
    {
      path: '/algoritmos',
      name: 'algoritmos',
      component: Algoritmos
    },
    {
      path: '/nodos',
      name: 'nodos',
      component: Nodos
    }
  ]
})

export default router
