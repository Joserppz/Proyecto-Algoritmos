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
  ],
  // Agregamos el comportamiento de scroll para que funcionen los anclajes (#)
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth', // Hace que el deslizamiento sea animado y suave
      }
    }
    // Si no hay hash, siempre carga la página desde arriba
    return { top: 0 }
  }
})

export default router