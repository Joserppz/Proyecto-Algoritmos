<template>
  <div class="nodos-container">

    <!-- NAVBAR SIMÉTRICA -->
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
      <!-- PANEL DE CONTROL -->
      <div class="control-panel">
        <div class="panel-group">
          <h3>MODO:</h3>
          <div class="button-group">
            <button 
              @click="modo = 'nodo'" 
              :class="{ active: modo === 'nodo' }"
              class="btn-mode">
              AGREGAR NODOS
            </button>
            <button 
              @click="modo = 'conexion'" 
              :class="{ active: modo === 'conexion' }"
              class="btn-mode">
              CREAR CONEXIONES
            </button>
          </div>
        </div>

        <div class="panel-group">
          <h3>ACCIÓN:</h3>
          <div class="button-group">
            <button @click="limpiarPizarra" class="btn-action btn-danger">
              BORRAR TODO
            </button>
            <!-- ELIMINADO EL BOTÓN CARGAR EJEMPLO -->
          </div>
        </div>

        <div class="panel-group">
          <h3>ESTADO: {{ nodos.length }} nodos | {{ conexiones.length }} conexiones</h3>
        </div>
      </div>

      <!-- PIZARRA INTERACTIVA -->
      <div class="pizarra-container">
        <div 
          ref="pizarra"
          class="pizarra"
          @click="handlePizarraClick"
          @mousemove="handleMouseMove"
        >
          <!-- Líneas de conexiones -->
          <svg class="conexiones-svg">
            <defs>
              <marker id="arrowhead" markerWidth="12" markerHeight="12" refX="18" refY="6" orient="auto">
                <polygon points="0 0, 12 6, 0 12" fill="#c0392b" />
              </marker>
            </defs>
            <g v-for="(conexion, index) in conexiones" :key="index">
              <line
                :x1="conexion.origen.x"
                :y1="conexion.origen.y"
                :x2="conexion.destino.x"
                :y2="conexion.destino.y"
                :stroke="conexion.color"
                stroke-width="4"  
                :marker-end="'url(#arrowhead)'"
                class="conexion-line"
              />
              <!-- Círculo de fondo para el texto del peso -->
              <circle
                :cx="(conexion.origen.x + conexion.destino.x) / 2"
                :cy="(conexion.origen.y + conexion.destino.y) / 2 - 15"
                r="14"
                fill="#2c3e50"
                stroke="white"
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
              stroke="#2980b9"
              stroke-width="4"
              stroke-dasharray="8,8"
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
              <span class="nodo-id">{{ nodo.id }}</span>
            </div>
          </div>

          <!-- Instrucciones -->
          <div class="instrucciones" v-if="nodos.length === 0">
            <p>HAZ CLIC EN LA PIZARRA PARA CREAR NODOS</p>
          </div>
        </div>
      </div>

      <!-- TABLA DE EDICIÓN -->
      <div class="tabla-edicion" v-if="nodos.length > 0">
        <h3>TABLA DE CONEXIONES</h3>
        <div class="tabla-container">
          <table>
            <thead>
              <tr>
                <th>ORIGEN</th>
                <th>DESTINO</th>
                <th>PESO</th>
                <th>COLOR</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(conexion, index) in conexiones" :key="index">
                <td>{{ conexion.origen.id }}</td>
                <td>{{ conexion.destino.id }}</td>
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
                  <input 
                    type="color" 
                    v-model="conexion.color"
                    @change="actualizarConexion(index)"
                  />
                </td>
                <td>
                  <button @click="eliminarConexion(index)" class="btn-delete">BORRAR</button>
                </td>
              </tr>
              <tr v-if="conexiones.length === 0">
                <td colspan="5" class="text-center">NO HAY CONEXIONES. USA EL MODO CONEXIÓN PARA CREAR.</td>
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
import { ref, onMounted } from 'vue'

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
    } else if (nodoSeleccionado.value !== nodo) {
      crearConexion(nodoSeleccionado.value, nodo)
      nodoSeleccionado.value = null
    } else {
      nodoSeleccionado.value = null
    }
  }
}

// Crear una nueva conexión
const crearConexion = (origen, destino) => {
  const existe = conexiones.value.some(
    c => c.origen === origen && c.destino === destino
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

// Limpiar toda la pizarra
const limpiarPizarra = () => {
  if (confirm('¿ESTÁS SEGURO DE LIMPIAR TODA LA PIZARRA?')) {
    nodos.value = []
    conexiones.value = []
    nodoSeleccionado.value = null
    nextId = 1
  }
}

// ELIMINADA LA FUNCIÓN generarEjemplo

onMounted(() => {
  const actualizarDimensiones = () => {
    if (pizarra.value) {
      // Forzar actualización
    }
  }
  
  window.addEventListener('resize', actualizarDimensiones)
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

/* NAVBAR - SIMÉTRICA COMO EN INICIO */
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

/* PANEL DE CONTROL */
.control-panel {
  background: white;
  border-radius: 8px;
  padding: 20px 25px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  align-items: center;
  border: 1px solid #bdc3c7;
}

.panel-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.panel-group h3 {
  margin: 0;
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.button-group {
  display: flex;
  gap: 8px;
}

.btn-mode, .btn-action {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.btn-mode {
  background: #bdc3c7;
  color: #2c3e50;
}

.btn-mode.active {
  background: #2980b9;
  color: white;
}

.btn-mode:hover {
  background: #3498db;
  color: white;
}

.btn-action {
  background: #7f8c8d;
  color: white;
}

.btn-danger {
  background: #c0392b;
}

.btn-danger:hover {
  background: #e74c3c;
}

/* ELIMINADA LA CLASE .btn-info ya que no se usa */

/* PIZARRA */
.pizarra-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #bdc3c7;
}

.pizarra {
  position: relative;
  width: 100%;
  height: 550px;
  background: #2c3e50;
  background-image: 
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  border-radius: 6px;
  overflow: hidden;
  cursor: crosshair;
  border: 1px solid #34495e;
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
  transition: stroke 0.3s ease;
  stroke-linecap: round;
}

.peso-fondo {
  pointer-events: none;
}

.conexion-peso {
  font-size: 16px;
  font-weight: bold;
  fill: white;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
  font-family: 'Segoe UI', Roboto, sans-serif;
}

.nodo {
  position: absolute;
  width: 60px;
  height: 60px;
  background: #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  z-index: 10;
  border: 3px solid #2980b9;
}

.nodo:hover {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 6px 15px rgba(0,0,0,0.4);
  border-color: white;
}

.nodo.seleccionado {
  background: #c0392b;
  border-color: #e74c3c;
  box-shadow: 0 0 0 4px rgba(192, 57, 43, 0.3);
}

.nodo.destino {
  background: #27ae60;
  border-color: #2ecc71;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.5);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(39, 174, 96, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(39, 174, 96, 0);
  }
}

.nodo-contenido {
  text-align: center;
}

.nodo-id {
  font-size: 20px;
  font-weight: bold;
}

.instrucciones {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: rgba(255,255,255,0.5);
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 1px;
  pointer-events: none;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* TABLA DE EDICIÓN */
.tabla-edicion {
  background: white;
  border-radius: 8px;
  padding: 20px 25px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #bdc3c7;
}

.tabla-edicion h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.tabla-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th {
  background: #34495e;
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-weight: bold;
  letter-spacing: 0.5px;
}

td {
  padding: 12px 15px;
  border-bottom: 1px solid #bdc3c7;
  color: #2c3e50;
}

tr:hover {
  background: #f8f9fa;
}

.input-peso {
  width: 70px;
  padding: 6px 8px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-weight: bold;
  background: white;
}

input[type="color"] {
  width: 50px;
  height: 35px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  cursor: pointer;
  background: white;
}

.btn-delete {
  background: #c0392b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  background: #e74c3c;
}

.text-center {
  text-align: center;
  color: #7f8c8d;
  padding: 20px;
  font-style: italic;
}

/* FOOTER - UNIFICADO CON LAS OTRAS PÁGINAS */
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
    align-items: stretch;
    gap: 20px;
  }
  
  .panel-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .button-group {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .btn-mode, .btn-action {
    flex: 1;
    text-align: center;
  }
  
  .pizarra {
    height: 450px;
  }
}

@media (max-width: 480px) {
  .pizarra {
    height: 350px;
  }
  
  .nodo {
    width: 50px;
    height: 50px;
  }
  
  .nodo-id {
    font-size: 18px;
  }
}
</style>