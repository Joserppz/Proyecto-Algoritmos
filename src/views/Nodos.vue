<template>
  <div class="nodos-container">

    <!-- NAVBAR SIMÉTRICA (SIN CAMBIOS) -->
    <nav class="navbar">
      <div class="nav-content">
        <div class="logo">
          ANÁLISIS DE ALGORITMOS
        </div>

        <ul class="nav-links">
          <li><router-link to="/">INICIO</router-link></li>
          <li><router-link to="/algoritmos">ALGORITMOS</router-link></li>
          <li><router-link to="/nodos">NODOS</router-link></li>
        </ul>
      </div>
    </nav>

    <main class="nodos-main">
      <!-- PANEL DE CONTROL - REDISEÑADO -->
      <div class="control-panel">
        <div class="panel-group">
          <span class="panel-label">MODO</span>
          <div class="button-group">
            <button 
              @click="modo = 'nodo'" 
              :class="{ active: modo === 'nodo' }"
              class="btn-mode">
              + NODO
            </button>
            <button 
              @click="modo = 'conexion'" 
              :class="{ active: modo === 'conexion' }"
              class="btn-mode">
              ⇢ CONEXIÓN
            </button>
          </div>
        </div>

        <div class="panel-group">
          <span class="panel-label">ACCIONES</span>
          <div class="button-group">
            <button @click="limpiarPizarra" class="btn-action btn-danger">
              ⊘ BORRAR TODO
            </button>
          </div>
        </div>

        <div class="stats-group">
          <div class="stat-item">
            <span class="stat-value">{{ nodos.length }}</span>
            <span class="stat-label">nodos</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ conexiones.length }}</span>
            <span class="stat-label">conexiones</span>
          </div>
        </div>
      </div>

      <!-- CONTENEDOR PRINCIPAL CON MATRIZ Y PIZARRA - NUEVO DISEÑO -->
      <div class="contenedor-principal">
        <!-- MATRIZ DE ADYACENCIA - NUEVO DISEÑO -->
        <div class="matriz-container" v-if="nodos.length > 0">
          <div class="matriz-header">
            <h3>MATRIZ DE ADYACENCIA</h3>
            <span class="matriz-badge">{{ nodos.length }}×{{ nodos.length }}</span>
          </div>
          <div class="matriz-tabla-container">
            <table class="matriz-tabla">
              <thead>
                <tr>
                  <th class="corner-cell"></th>
                  <th v-for="nodo in nodos" :key="'col-'+nodo.id" class="col-header">
                    <div class="col-header-content">
                      <span class="nodo-indicador"></span>
                      {{ nodo.nombre || `N${nodo.id}` }}
                    </div>
                  </th>
                  <th class="sum-col">Σ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(fila, i) in matrizAdyacencia" :key="'fila-'+i">
                  <th class="row-header">
                    <div class="row-header-content">
                      <span class="nodo-indicador"></span>
                      {{ nodos[i].nombre || `N${nodos[i].id}` }}
                    </div>
                  </th>
                  <td v-for="(valor, j) in fila" :key="'celda-'+i+'-'+j" 
                      :class="{ 'celda-con-valor': valor > 0 }">
                    <span class="celda-valor">{{ valor || '' }}</span>
                  </td>
                  <td class="sum-celda">{{ sumaFilas[i] }}</td>
                </tr>
                <tr class="sum-row">
                  <th class="row-header sum-row-header">Σ</th>
                  <td v-for="(suma, j) in sumaColumnas" :key="'sum-col-'+j" 
                      class="sum-celda">
                    {{ suma }}
                  </td>
                  <td class="total-celda">{{ sumaTotal }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="matriz-footer">
            <div class="matriz-stat">
              <span class="stat-dot" style="background: #3498db;"></span>
              <span>Conexiones: {{ conexiones.length }}</span>
            </div>
            <div class="matriz-stat">
              <span class="stat-dot" style="background: #f39c12;"></span>
              <span>Peso total: {{ sumaTotalPesos }}</span>
            </div>
          </div>
        </div>
        <div class="matriz-container matriz-vacia" v-else>
          <div class="matriz-empty-state">
            <span class="empty-icon">⎔</span>
            <h3>MATRIZ DE ADYACENCIA</h3>
            <p>CREA NODOS PARA VER LA MATRIZ</p>
          </div>
        </div>

        <!-- PIZARRA INTERACTIVA - NUEVO DISEÑO -->
        <div class="pizarra-container">
          <div class="pizarra-header">
            <div class="pizarra-tools">
              <span class="tool-indicator" :class="{ active: modo === 'nodo' }">
                <span class="tool-dot" style="background: #3498db;"></span>
                Modo Nodo
              </span>
              <span class="tool-indicator" :class="{ active: modo === 'conexion' }">
                <span class="tool-dot" style="background: #e67e22;"></span>
                Modo Conexión
              </span>
            </div>
          </div>
          <div 
            ref="pizarra"
            class="pizarra"
            @click="handlePizarraClick"
            @mousemove="handleMouseMove"
          >
            <!-- Líneas de conexiones -->
            <svg class="conexiones-svg">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="16" refY="5" orient="auto">
                  <polygon points="0 0, 10 5, 0 10" fill="#2c3e50" />
                </marker>
              </defs>
              <g v-for="(conexion, index) in conexiones" :key="index">
                <line
                  :x1="conexion.origen.x"
                  :y1="conexion.origen.y"
                  :x2="conexion.destino.x"
                  :y2="conexion.destino.y"
                  :stroke="conexion.color"
                  stroke-width="3"
                  :marker-end="'url(#arrowhead)'"
                  class="conexion-line"
                />
                <!-- Círculo de fondo para el texto del peso -->
                <circle
                  :cx="(conexion.origen.x + conexion.destino.x) / 2"
                  :cy="(conexion.origen.y + conexion.destino.y) / 2 - 15"
                  r="14"
                  fill="white"
                  stroke="#2c3e50"
                  stroke-width="2"
                  class="peso-fondo"
                />
                <text
                  :x="(conexion.origen.x + conexion.destino.x) / 2"
                  :y="(conexion.origen.y + conexion.destino.y) / 2 - 15"
                  class="conexion-peso"
                >
                  {{ conexion.weight }}
                </text>
              </g>
              
              <!-- Línea temporal para nueva conexión -->
              <line
                v-if="modo === 'conexion' && nodoSeleccionado && mousePos.x && mousePos.y"
                :x1="nodoSeleccionado.x"
                :y1="nodoSeleccionado.y"
                :x2="mousePos.x"
                :y2="mousePos.y"
                stroke="#e67e22"
                stroke-width="3"
                stroke-dasharray="6,6"
                :marker-end="'url(#arrowhead)'"
              />
            </svg>

            <!-- Nodos -->
            <div
              v-for="(nodo, index) in nodos"
              :key="index"
              class="nodo"
              :style="{ left: nodo.x + 'px', top: nodo.y + 'px' }"
              @click.stop="handleNodoClick(nodo, $event)"
              :class="{ 
                seleccionado: nodoSeleccionado === nodo,
                destino: modo === 'conexion' && nodoSeleccionado && nodoSeleccionado !== nodo
              }"
            >
              <div class="nodo-contenido">
                <span class="nodo-id">{{ nodo.nombre || nodo.id }}</span>
              </div>
            </div>

            <!-- Instrucciones -->
            <div class="instrucciones" v-if="nodos.length === 0">
              <div class="instrucciones-content">
                <span class="instrucciones-icon">⌾</span>
                <p>HAZ CLIC EN LA PIZARRA PARA CREAR NODOS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TABLA DE EDICIÓN DE CONEXIONES - NUEVO DISEÑO -->
      <div class="tabla-edicion" v-if="nodos.length > 0">
        <div class="tabla-header">
          <h3>CONEXIONES</h3>
          <span class="tabla-badge">{{ conexiones.length }} conexiones</span>
        </div>
        <div class="tabla-container">
          <table>
            <thead>
              <tr>
                <th>ORIGEN</th>
                <th>DESTINO</th>
                <th>PESO</th>
                <th>COLOR</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(conexion, index) in conexiones" :key="index">
                <td>
                  <div class="nodo-tag">{{ obtenerNombreNodo(conexion.origen) }}</div>
                </td>
                <td>
                  <div class="nodo-tag">{{ obtenerNombreNodo(conexion.destino) }}</div>
                </td>
                <td>
                  <input 
                    type="number" 
                    v-model.number="conexion.weight" 
                    min="1" 
                    max="10"
                    class="input-peso"
                    @change="actualizarConexion(index)"
                  />
                </td>
                <td>
                  <div class="color-picker-wrapper">
                    <input 
                      type="color" 
                      v-model="conexion.color"
                      @change="actualizarConexion(index)"
                    />
                  </div>
                </td>
                <td>
                  <button @click="eliminarConexion(index)" class="btn-delete" title="Eliminar conexión">×</button>
                </td>
              </tr>
              <tr v-if="conexiones.length === 0">
                <td colspan="5" class="text-center empty-state">
                  <span class="empty-icon">⇢</span>
                  <p>NO HAY CONEXIONES</p>
                  <span class="empty-hint">USA EL MODO CONEXIÓN PARA CREAR</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TABLA DE NODOS - NUEVO DISEÑO -->
      <div class="tabla-nodos" v-if="nodos.length > 0">
        <div class="tabla-header">
          <h3>NODOS</h3>
          <span class="tabla-badge">{{ nodos.length }} nodos</span>
        </div>
        <div class="tabla-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NOMBRE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(nodo, index) in nodos" :key="index">
                <td>
                  <div class="nodo-id-badge">{{ nodo.id }}</div>
                </td>
                <td>
                  <input 
                    type="text" 
                    v-model="nodo.nombre" 
                    :placeholder="`Nodo ${nodo.id}`"
                    class="input-nombre"
                    @input="actualizarNodo"
                  />
                </td>
                <td>
                  <button @click="eliminarNodo(index)" class="btn-delete" title="Eliminar nodo">×</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <footer>
      <p>Análisis de Algoritmos - Primer Semestre 2026</p>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// Estado de la aplicación
const nodos = ref([])
const conexiones = ref([])
const modo = ref('nodo')
const nodoSeleccionado = ref(null)
const mousePos = ref({ x: null, y: null })
const pizarra = ref(null)

// Contador para IDs de nodos
let nextId = 1

// Colores más fuertes y oscuros
const colores = {
  rojoOscuro: '#c0392b',
  azulOscuro: '#2980b9',
  verdeOscuro: '#27ae60',
  naranjaOscuro: '#d35400',
  purpuraOscuro: '#8e44ad'
}

// Computed para la matriz de adyacencia
const matrizAdyacencia = computed(() => {
  const n = nodos.value.length
  const matriz = Array(n).fill().map(() => Array(n).fill(0))
  
  conexiones.value.forEach(conexion => {
    const origenIndex = nodos.value.findIndex(n => n.id === conexion.origen.id)
    const destinoIndex = nodos.value.findIndex(n => n.id === conexion.destino.id)
    if (origenIndex !== -1 && destinoIndex !== -1) {
      matriz[origenIndex][destinoIndex] = conexion.weight
    }
  })
  
  return matriz
})

// Suma de filas
const sumaFilas = computed(() => {
  return matrizAdyacencia.value.map(fila => 
    fila.reduce((sum, val) => sum + val, 0)
  )
})

// Suma de columnas
const sumaColumnas = computed(() => {
  if (nodos.value.length === 0) return []
  const n = nodos.value.length
  return Array(n).fill().map((_, j) => 
    matrizAdyacencia.value.reduce((sum, fila) => sum + fila[j], 0)
  )
})

// Suma total de la matriz
const sumaTotal = computed(() => {
  return sumaFilas.value.reduce((sum, val) => sum + val, 0)
})

// Suma total de pesos
const sumaTotalPesos = computed(() => sumaTotal.value)

// Obtener nombre del nodo para mostrar
const obtenerNombreNodo = (nodo) => {
  return nodo.nombre || `N${nodo.id}`
}

// Manejar clic en la pizarra
const handlePizarraClick = (event) => {
  if (modo.value === 'nodo') {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    crearNodo(x, y)
  }
}

// Crear un nuevo nodo
const crearNodo = (x, y) => {
  nodos.value.push({
    id: nextId++,
    nombre: '',
    x,
    y
  })
}

// Manejar clic en un nodo
const handleNodoClick = (nodo, event) => {
  event.stopPropagation()
  
  if (modo.value === 'conexion') {
    if (!nodoSeleccionado.value) {
      nodoSeleccionado.value = nodo
    } else {
      // Permitir conexión al mismo nodo (ciclo)
      crearConexion(nodoSeleccionado.value, nodo)
      nodoSeleccionado.value = null
    }
  }
}

// Crear una nueva conexión
const crearConexion = (origen, destino) => {
  const existe = conexiones.value.some(
    c => c.origen.id === origen.id && c.destino.id === destino.id
  )
  
  if (!existe) {
    conexiones.value.push({
      origen,
      destino,
      weight: 3,
      color: colores.azulOscuro
    })
  }
}

// Manejar movimiento del mouse
const handleMouseMove = (event) => {
  if (modo.value === 'conexion' && nodoSeleccionado.value) {
    const rect = event.currentTarget.getBoundingClientRect()
    mousePos.value = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }
}

// Actualizar una conexión
const actualizarConexion = (index) => {
  conexiones.value = [...conexiones.value]
}

// Eliminar una conexión
const eliminarConexion = (index) => {
  conexiones.value.splice(index, 1)
}

// Eliminar un nodo y sus conexiones
const eliminarNodo = (index) => {
  const nodoEliminado = nodos.value[index]
  
  // Eliminar conexiones asociadas
  conexiones.value = conexiones.value.filter(c => 
    c.origen.id !== nodoEliminado.id && c.destino.id !== nodoEliminado.id
  )
  
  // Eliminar el nodo
  nodos.value.splice(index, 1)
  
  // Si el nodo seleccionado fue eliminado, limpiar selección
  if (nodoSeleccionado.value && nodoSeleccionado.value.id === nodoEliminado.id) {
    nodoSeleccionado.value = null
  }
}

// Actualizar nodos (forzar reactividad)
const actualizarNodo = () => {
  nodos.value = [...nodos.value]
}

// Limpiar toda la pizarra
const limpiarPizarra = () => {
  if (confirm('¿ESTÁS SEGURO DE LIMPIAR TODA LA PIZARRA?')) {
    nodos.value = []
    conexiones.value = []
    nodoSeleccionado.value = null
    nextId = 1
  }
}

onMounted(() => {
  window.addEventListener('resize', () => {})
})
</script>

<style scoped>
.nodos-container {
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #ecf0f1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* NAVBAR - SIN CAMBIOS (IGUAL QUE EN INICIO) */
.navbar {
  background: #2c3e50;
  padding: 1rem 5%;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  box-sizing: border-box;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  letter-spacing: 1px;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 30px;
  align-items: center;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: 0.3s;
  font-size: 1rem;
  letter-spacing: 0.5px;
}

.nav-links a:hover {
  color: #3498db;
}

/* MAIN CONTENT */
.nodos-main {
  margin-top: 80px;
  padding: 20px;
  flex: 1;
}

/* PANEL DE CONTROL - NUEVO DISEÑO */
.control-panel {
  background: white;
  border-radius: 16px;
  padding: 16px 24px;
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  align-items: center;
  border: 1px solid #e0e7e9;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.panel-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.panel-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #7f8c8d;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.button-group {
  display: flex;
  gap: 8px;
}

.btn-mode {
  padding: 8px 16px;
  border: 1px solid #e0e7e9;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  background: white;
  color: #2c3e50;
  transition: all 0.2s ease;
}

.btn-mode.active {
  background: #2c3e50;
  border-color: #2c3e50;
  color: white;
}

.btn-mode:hover:not(.active) {
  background: #f8f9fa;
  border-color: #bdc3c7;
}

.btn-action {
  padding: 8px 16px;
  border: 1px solid #e0e7e9;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  background: white;
  color: #2c3e50;
  transition: all 0.2s ease;
}

.btn-danger {
  color: #c0392b;
  border-color: #f5c6cb;
}

.btn-danger:hover {
  background: #c0392b;
  border-color: #c0392b;
  color: white;
}

.stats-group {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
  background: #f8f9fa;
  padding: 8px 16px;
  border-radius: 30px;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.75rem;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: #e0e7e9;
}

/* CONTENEDOR PRINCIPAL CON MATRIZ Y PIZARRA */
.contenedor-principal {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

/* MATRIZ DE ADYACENCIA - NUEVO DISEÑO */
.matriz-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e0e7e9;
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.matriz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.matriz-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.matriz-badge {
  background: #ecf0f1;
  color: #2c3e50;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.matriz-vacia {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.matriz-empty-state {
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  color: #bdc3c7;
  margin-bottom: 16px;
  display: block;
}

.matriz-empty-state h3 {
  color: #2c3e50;
  font-size: 1rem;
  margin: 0 0 8px 0;
}

.matriz-empty-state p {
  color: #95a5a6;
  font-size: 0.85rem;
  margin: 0;
}

.matriz-tabla-container {
  overflow-x: auto;
  margin-bottom: 16px;
}

.matriz-tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  text-align: center;
}

.matriz-tabla th, .matriz-tabla td {
  padding: 10px 6px;
  border: 1px solid #e0e7e9;
}

.matriz-tabla .corner-cell {
  background: #f8f9fa;
  border: none;
}

.matriz-tabla .col-header {
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.75rem;
}

.col-header-content, .row-header-content {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.nodo-indicador {
  width: 8px;
  height: 8px;
  background: #3498db;
  border-radius: 50%;
  display: inline-block;
}

.matriz-tabla .row-header {
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.75rem;
  text-align: right;
}

.matriz-tabla td {
  background: white;
  color: #2c3e50;
}

.celda-valor {
  font-weight: 500;
}

.matriz-tabla .celda-con-valor {
  background: #3498db20;
  color: #2c3e50;
  font-weight: 600;
}

.matriz-tabla .celda-con-valor .celda-valor {
  background: #3498db;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-block;
  min-width: 20px;
}

.matriz-tabla .sum-col, .matriz-tabla .sum-celda {
  background: #f39c1220;
  color: #2c3e50;
  font-weight: 600;
}

.matriz-tabla .sum-row .row-header {
  background: #f39c12;
  color: white;
}

.matriz-tabla .total-celda {
  background: #c0392b;
  color: white;
  font-weight: 600;
}

.matriz-footer {
  display: flex;
  gap: 16px;
  border-top: 1px solid #e0e7e9;
  padding-top: 12px;
}

.matriz-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #2c3e50;
}

.stat-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

/* PIZARRA - NUEVO DISEÑO */
.pizarra-container {
  background: white;
  border-radius: 16px;
  border: 1px solid #e0e7e9;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.pizarra-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e7e9;
  background: #f8f9fa;
}

.pizarra-tools {
  display: flex;
  gap: 16px;
}

.tool-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #95a5a6;
}

.tool-indicator.active {
  color: #2c3e50;
  font-weight: 500;
}

.tool-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.pizarra {
  position: relative;
  width: 100%;
  height: 450px;
  background: #f8f9fa;
  background-image: 
    linear-gradient(#e0e7e9 1px, transparent 1px),
    linear-gradient(90deg, #e0e7e9 1px, transparent 1px);
  background-size: 25px 25px;
  overflow: hidden;
  cursor: crosshair;
}

.conexiones-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.conexion-line {
  transition: stroke 0.2s ease;
  stroke-linecap: round;
}

.peso-fondo {
  pointer-events: none;
}

.conexion-peso {
  font-size: 12px;
  font-weight: 600;
  fill: #2c3e50;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
}

.nodo {
  position: absolute;
  width: 48px;
  height: 48px;
  background: white;
  border: 3px solid #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  z-index: 10;
}

.nodo:hover {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  border-color: #2c3e50;
  background: #f8f9fa;
}

.nodo.seleccionado {
  background: #c0392b;
  border-color: #c0392b;
  color: white;
}

.nodo.destino {
  background: #27ae60;
  border-color: #27ae60;
  color: white;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(39, 174, 96, 0); }
  100% { box-shadow: 0 0 0 0 rgba(39, 174, 96, 0); }
}

.nodo-contenido {
  text-align: center;
}

.nodo-id {
  font-size: 16px;
  font-weight: 600;
}

.instrucciones {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.instrucciones-content {
  background: white;
  padding: 16px 24px;
  border-radius: 40px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #e0e7e9;
}

.instrucciones-icon {
  font-size: 1.5rem;
  color: #95a5a6;
  display: block;
  margin-bottom: 8px;
}

.instrucciones p {
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.5px;
}

/* TABLAS DE EDICIÓN - NUEVO DISEÑO */
.tabla-edicion,
.tabla-nodos {
  background: white;
  border-radius: 16px;
  border: 1px solid #e0e7e9;
  margin-top: 24px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.tabla-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e7e9;
}

.tabla-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.tabla-badge {
  background: #ecf0f1;
  color: #2c3e50;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.tabla-container {
  overflow-x: auto;
  padding: 0 20px 20px 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

th {
  text-align: left;
  padding: 16px 12px 12px 12px;
  color: #7f8c8d;
  font-weight: 600;
  font-size: 0.7rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-bottom: 1px solid #e0e7e9;
}

td {
  padding: 12px;
  border-bottom: 1px solid #f0f3f5;
  color: #2c3e50;
}

tr:last-child td {
  border-bottom: none;
}

.nodo-tag {
  background: #ecf0f1;
  padding: 4px 12px;
  border-radius: 20px;
  display: inline-block;
  font-weight: 500;
  font-size: 0.8rem;
}

.nodo-id-badge {
  background: #2c3e50;
  color: white;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.8rem;
}

.input-peso {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #e0e7e9;
  border-radius: 8px;
  font-weight: 500;
  background: white;
  font-size: 0.85rem;
}

.input-nombre {
  width: 150px;
  padding: 8px 12px;
  border: 1px solid #e0e7e9;
  border-radius: 8px;
  background: white;
  font-size: 0.85rem;
}

.input-nombre:focus {
  outline: none;
  border-color: #3498db;
}

.color-picker-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e7e9;
}

input[type="color"] {
  width: 100%;
  height: 100%;
  border: none;
  cursor: pointer;
  background: white;
}

.btn-delete {
  background: none;
  color: #95a5a6;
  border: 1px solid #e0e7e9;
  border-radius: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background: #c0392b;
  border-color: #c0392b;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 40px !important;
}

.empty-state .empty-icon {
  font-size: 2rem;
  color: #bdc3c7;
  margin-bottom: 8px;
}

.empty-state p {
  color: #2c3e50;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.empty-hint {
  color: #95a5a6;
  font-size: 0.75rem;
}

/* FOOTER - SIN CAMBIOS */
footer {
  background: #2c3e50;
  padding: 10px 0;
  width: 100%;
  flex-shrink: 0;
  margin-top: auto;
  box-sizing: border-box;
}

footer p {
  color: white;
  font-size: 0.85rem;
  text-align: center;
  margin: 0;
}

/* RESPONSIVE */
@media (max-width: 1100px) {
  .contenedor-principal {
    flex-direction: column;
  }
  
  .matriz-container {
    max-width: 100%;
    flex: auto;
  }
  
  .pizarra {
    height: 400px;
  }
}

@media (max-width: 900px) {
  .nav-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav-links {
    gap: 20px;
  }
  
  .control-panel {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .stats-group {
    margin-left: 0;
    width: 100%;
    justify-content: space-around;
  }
  
  .pizarra {
    height: 350px;
  }
}

@media (max-width: 480px) {
  .pizarra {
    height: 300px;
  }
  
  .nodo {
    width: 40px;
    height: 40px;
  }
  
  .nodo-id {
    font-size: 14px;
  }
  
  .input-nombre {
    width: 100px;
  }
  
  .button-group {
    flex-wrap: wrap;
  }
  
  .btn-mode, .btn-action {
    flex: 1;
  }
}
</style>