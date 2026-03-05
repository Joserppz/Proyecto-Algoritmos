<template>
  <div class="nodos-container">

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
          <span class="panel-label">TIPO CONEXIÓN</span>
          <div class="button-group">
            <button 
              @click="tipoConexion = 'dirigida'" 
              :class="{ active: tipoConexion === 'dirigida' }"
              class="btn-mode btn-tipo">
              ⇢ DIRIGIDA
            </button>
            <button 
              @click="tipoConexion = 'no-dirigida'" 
              :class="{ active: tipoConexion === 'no-dirigida' }"
              class="btn-mode btn-tipo">
              ⇔ NO DIRIGIDA
            </button>
            <button 
              @click="tipoConexion = 'bidireccional-paralela'" 
              :class="{ active: tipoConexion === 'bidireccional-paralela' }"
              class="btn-mode btn-tipo">
              ⤨ BIDIRECCIONAL
            </button>
            <button 
              @click="tipoConexion = 'segmentada'" 
              :class="{ active: tipoConexion === 'segmentada' }"
              class="btn-mode btn-tipo">
              ┄ SEGMENTADA
            </button>
            <button 
              @click="tipoConexion = 'segmentada-no-dirigida'" 
              :class="{ active: tipoConexion === 'segmentada-no-dirigida' }"
              class="btn-mode btn-tipo">
              ⇢ SEGMENTADA SIN DIRECCION
            </button>
          </div>
        </div>

        <div class="panel-group">
          <span class="panel-label">ACCIONES</span>
          <div class="button-group">
            <button @click="abrirModalExportar" class="btn-action btn-export">
              ⭳ EXPORTAR
            </button>
            <button @click="importarDiseño" class="btn-action btn-import">
              ⭱ IMPORTAR
            </button>
            <button @click="limpiarPizarra" class="btn-action btn-danger">
              ⊘ BORRAR TODO
            </button>
            <button @click="abrirGuia" class="btn-action btn-info">
              ❔ GUÍA
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
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ calcularConvergencias }}</span>
            <span class="stat-label">convergencias</span>
          </div>
        </div>
      </div>

      <div class="contenedor-principal">
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
                      <span class="nodo-indicador" :style="{ background: nodo.color }"></span>
                      {{ nodo.nombre || `N${nodo.id}` }}
                    </div>
                  </th>
                  <th class="sum-col">Σ PESOS</th>
                  <th class="count-col"># CONEX</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(fila, i) in matrizAdyacencia" :key="'fila-'+i">
                  <th class="row-header">
                    <div class="row-header-content">
                      <span class="nodo-indicador" :style="{ background: nodos[i].color }"></span>
                      {{ nodos[i].nombre || `N${nodos[i].id}` }}
                    </div>
                  </th>
                  <td v-for="(valor, j) in fila" :key="'celda-'+i+'-'+j" 
                      :class="{ 
                        'celda-con-valor': valor > 0,
                        'celda-convergencia': i !== j && matrizAdyacencia[j] && matrizAdyacencia[j][i] > 0 && valor > 0
                      }">
                    <span class="celda-valor">{{ valor || '' }}</span>
                  </td>
                  <td class="sum-celda">{{ sumaFilas[i] }}</td>
                  <td class="count-celda">{{ contarConexionesPorNodo(i) }}</td>
                </tr>
                <tr class="sum-row">
                  <th class="row-header sum-row-header">Σ</th>
                  <td v-for="(suma, j) in sumaColumnas" :key="'sum-col-'+j" 
                      class="sum-celda">
                    {{ suma }}
                  </td>
                  <td class="total-celda">{{ sumaTotal }}</td>
                  <td class="total-count-celda">{{ totalConexiones }}</td>
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
            <div class="matriz-stat">
              <span class="stat-dot" style="background: #8e44ad;"></span>
              <span>Convergencias: {{ calcularConvergencias }}</span>
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
              <span class="tool-indicator">
                <span class="tool-dot" :style="{ background: getTipoConexionColor }"></span>
                {{ getTipoConexionNombre }}
              </span>
            </div>
            
            <div v-if="mostrarModalPeso" class="modal-peso-overlay" @click="cancelarPeso">
              <div class="modal-peso-content" @click.stop>
                <h3>INGRESAR PESO</h3>
                <p>Define el peso de la conexión (1-10)</p>
                <input 
                  type="number" 
                  ref="inputPeso"
                  v-model.number="pesoTemporal" 
                  min="1" 
                  max="10"
                  class="modal-input"
                  @keyup.enter="confirmarPeso"
                />
                <div class="modal-buttons">
                  <button @click="cancelarPeso" class="modal-btn cancelar">CANCELAR</button>
                  <button @click="confirmarPeso" class="modal-btn confirmar">ACEPTAR</button>
                </div>
              </div>
            </div>

            <div v-if="mostrarModalExportar" class="modal-peso-overlay" @click="cancelarExportacion">
              <div class="modal-peso-content" @click.stop>
                <h3>GUARDAR DISEÑO</h3>
                <p>Ingresa un nombre para tu archivo</p>
                <input 
                  type="text" 
                  ref="inputExportar"
                  v-model="nombreArchivo" 
                  class="modal-input"
                  placeholder="Ej: mi_grafo_1"
                  @keyup.enter="confirmarExportacion"
                />
                <div class="modal-buttons">
                  <button @click="cancelarExportacion" class="modal-btn cancelar">CANCELAR</button>
                  <button @click="confirmarExportacion" class="modal-btn confirmar">GUARDAR</button>
                </div>
              </div>
            </div>

            <div v-if="mostrarModalGuia" class="modal-peso-overlay" @click="cerrarGuia">
              <div class="modal-peso-content modal-guia-content" @click.stop>
                <h3>GUÍA RÁPIDA</h3>
                <div class="guia-pasos">
                  <p><strong>1. Crear Nodos:</strong> Selecciona el modo <b>+ NODO</b> y haz clic en cualquier parte de la pizarra para crearlos.</p>
                  <p><strong>2. Mover Nodos:</strong> Haz clic, mantén presionado y arrastra cualquier nodo para organizarlo libremente.</p>
                  <p><strong>3. Conectar:</strong> Cambia al modo <b>⇢ CONEXIÓN</b>, elige el tipo de línea arriba, haz clic en el nodo origen y luego en el nodo destino. Se te pedirá ingresar el peso.</p>
                  <p><strong>4. Edición:</strong> Usa las tablas de abajo para cambiar nombres, colores, pesos o borrar conexiones específicas.</p>
                  <p><strong>5. Exportar/Importar:</strong> Puedes guardar tu grafo en tu computadora y volverlo a cargar después sin perder nada.</p>
                </div>
                <div class="modal-buttons mt-4">
                  <button @click="cerrarGuia" class="modal-btn confirmar">¡ENTENDIDO!</button>
                </div>
              </div>
            </div>
            
          </div>
          
          <div 
            ref="pizarra"
            class="pizarra"
            @click="handlePizarraClick"
            @mousemove="handleMouseMove"
            @mouseup="detenerArrastre"
            @mouseleave="detenerArrastre"
          >
            <svg class="conexiones-svg">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                  <polygon points="0 0, 10 5, 0 10" fill="#2c3e50" stroke="white" stroke-width="0.8"/>
                </marker>
                <marker id="arrowhead-curve" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                  <polygon points="0 0, 10 5, 0 10" fill="#2c3e50" stroke="white" stroke-width="0.8"/>
                </marker>
              </defs>
              
              <g v-for="(conexion, index) in conexiones" :key="index">
                <template v-if="conexion.origen.id === conexion.destino.id">
                  <path
                    :d="calcularPathCiclo(conexion.origen)"
                    :stroke="conexion.color"
                    stroke-width="3"
                    :stroke-dasharray="conexion.tipo === 'segmentada' || conexion.tipo === 'segmentada-no-dirigida' ? '8,4' : 'none'"
                    fill="none"
                    :marker-end="conexion.tipo === 'dirigida' || conexion.tipo === 'segmentada' ? 'url(#arrowhead-curve)' : ''"
                    class="conexion-line"
                  />
                  <circle
                    :cx="conexion.origen.x"
                    :cy="conexion.origen.y - 65"
                    r="14"
                    fill="white"
                    stroke="#2c3e50"
                    stroke-width="2"
                    class="peso-fondo"
                  />
                  <text
                    :x="conexion.origen.x"
                    :y="conexion.origen.y - 65"
                    class="conexion-peso"
                  >
                    {{ conexion.weight }}
                  </text>
                </template>
                
                <template v-else-if="conexion.tipo === 'bidireccional-paralela'">
                  <path
                    :d="calcularPathParalelo(conexion.origen, conexion.destino, 12, 'ida')"
                    :stroke="conexion.color"
                    stroke-width="3"
                    fill="none"
                    marker-end="url(#arrowhead)"
                    class="conexion-line"
                  />
                  <path
                    :d="calcularPathParalelo(conexion.origen, conexion.destino, 12, 'vuelta')"
                    :stroke="conexion.color"
                    stroke-width="3"
                    fill="none"
                    marker-end="url(#arrowhead)"
                    class="conexion-line"
                  />
                  
                  <circle
                    :cx="calcularPuntoMedioParalelo(conexion.origen, conexion.destino, 12).x"
                    :cy="calcularPuntoMedioParalelo(conexion.origen, conexion.destino, 12).y"
                    r="14"
                    fill="white"
                    stroke="#2c3e50"
                    stroke-width="2"
                    class="peso-fondo"
                  />
                  <text
                    :x="calcularPuntoMedioParalelo(conexion.origen, conexion.destino, 12).x"
                    :y="calcularPuntoMedioParalelo(conexion.origen, conexion.destino, 12).y"
                    class="conexion-peso"
                  >
                    {{ conexion.weight }}
                  </text>

                  <circle
                    :cx="calcularPuntoMedioParalelo(conexion.origen, conexion.destino, -12).x"
                    :cy="calcularPuntoMedioParalelo(conexion.origen, conexion.destino, -12).y"
                    r="14"
                    fill="white"
                    stroke="#2c3e50"
                    stroke-width="2"
                    class="peso-fondo"
                  />
                  <text
                    :x="calcularPuntoMedioParalelo(conexion.origen, conexion.destino, -12).x"
                    :y="calcularPuntoMedioParalelo(conexion.origen, conexion.destino, -12).y"
                    class="conexion-peso"
                  >
                    {{ conexion.weight }}
                  </text>
                </template>
                
                <template v-else>
                  <path
                    :d="calcularPathNormal(conexion.origen, conexion.destino)"
                    :stroke="conexion.color"
                    stroke-width="3"
                    :stroke-dasharray="conexion.tipo === 'segmentada' || conexion.tipo === 'segmentada-no-dirigida' ? '8,4' : 'none'"
                    fill="none"
                    :marker-end="conexion.tipo === 'dirigida' || conexion.tipo === 'segmentada' ? 'url(#arrowhead)' : ''"
                    class="conexion-line"
                  />
                  
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
                </template>
              </g>
              
              <line
                v-if="modo === 'conexion' && nodoSeleccionado && mousePos.x && mousePos.y"
                :x1="calcularPuntoEnBorde(nodoSeleccionado, mousePos).x"
                :y1="calcularPuntoEnBorde(nodoSeleccionado, mousePos).y"
                :x2="mousePos.x"
                :y2="mousePos.y"
                :stroke="getTipoConexionColor"
                stroke-width="3"
                :stroke-dasharray="tipoConexion === 'segmentada' || tipoConexion === 'segmentada-no-dirigida' ? '8,4' : 'none'"
                :marker-end="tipoConexion === 'dirigida' || tipoConexion === 'segmentada' ? 'url(#arrowhead)' : ''"
              />
            </svg>

            <div
              v-for="(nodo, index) in nodos"
              :key="index"
              class="nodo"
              :style="{ left: nodo.x + 'px', top: nodo.y + 'px', background: nodo.color, borderColor: nodo.color }"
              @mousedown.prevent.stop="iniciarArrastre(nodo, $event)"
              @click.stop="handleNodoClick(nodo, $event)"
              @mouseup="detenerArrastre"
              :class="{ 
                seleccionado: nodoSeleccionado === nodo,
                destino: modo === 'conexion' && nodoSeleccionado && nodoSeleccionado !== nodo,
                arrastrando: nodoArrastrado === nodo
              }"
            >
              <div class="nodo-contenido">
                <span class="nodo-id">{{ nodo.nombre || nodo.id }}</span>
              </div>
            </div>

            <div class="instrucciones" v-if="nodos.length === 0">
              <div class="instrucciones-content">
                <span class="instrucciones-icon">⌾</span>
                <p>HAZ CLIC EN LA PIZARRA PARA CREAR NODOS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                <th>TIPO</th>
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
                  <select v-model="conexion.tipo" class="select-tipo" @change="actualizarConexion(index)">
                    <option value="dirigida">Dirigida</option>
                    <option value="no-dirigida">No Dirigida</option>
                    <option value="bidireccional-paralela">Bidireccional Paralela</option>
                    <option value="segmentada">Segmentada (con dirección)</option>
                    <option value="segmentada-no-dirigida">Segmentada (sin dirección)</option>
                  </select>
                </td>
                <td>
                  <button @click="eliminarConexion(index)" class="btn-delete">×</button>
                </td>
              </tr>
              <tr v-if="conexiones.length === 0">
                <td colspan="6" class="text-center empty-state">
                  <span class="empty-icon">⇢</span>
                  <p>NO HAY CONEXIONES</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

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
                <th>COLOR</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(nodo, index) in nodos" :key="index">
                <td>
                  <div class="nodo-id-badge" :style="{ background: nodo.color }">{{ nodo.id }}</div>
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
                  <div class="color-picker-wrapper">
                    <input 
                      type="color" 
                      v-model="nodo.color"
                      @change="actualizarNodo"
                    />
                  </div>
                </td>
                <td>
                  <button @click="eliminarNodo(index)" class="btn-delete">×</button>
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

    <input 
      type="file" 
      ref="fileInput" 
      style="display: none" 
      accept=".json"
      @change="handleFileImport"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'

const nodos = ref([])
const conexiones = ref([])
const modo = ref('nodo')
const tipoConexion = ref('dirigida')
const nodoSeleccionado = ref(null)
const mousePos = ref({ x: null, y: null })
const pizarra = ref(null)
const fileInput = ref(null)
const mostrarModalPeso = ref(false)
const pesoTemporal = ref(3)
const conexionPendiente = ref(null)
const inputPeso = ref(null)

// Variables para modales extra
const mostrarModalExportar = ref(false)
const nombreArchivo = ref('')
const inputExportar = ref(null)

const mostrarModalGuia = ref(false)

// --- VARIABLES PARA EL ARRASTRE (DRAG & DROP) ---
const nodoArrastrado = ref(null)
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

let nextId = 1

const coloresNodo = [
  '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', 
  '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b'
]

const calcularPuntoEnBorde = (nodo, mousePos) => {
  const dx = mousePos.x - nodo.x
  const dy = mousePos.y - nodo.y
  const distancia = Math.sqrt(dx * dx + dy * dy)
  
  if (distancia === 0) return { x: nodo.x, y: nodo.y }
  
  const radio = 24 
  return {
    x: nodo.x + (dx / distancia) * radio,
    y: nodo.y + (dy / distancia) * radio
  }
}

const calcularPathNormal = (origen, destino) => {
  const dx = destino.x - origen.x
  const dy = destino.y - origen.y
  const distancia = Math.sqrt(dx * dx + dy * dy)
  
  if (distancia === 0) return `M ${origen.x} ${origen.y} L ${destino.x} ${destino.y}`
  
  const radio = 24
  const angulo = Math.atan2(dy, dx)
  
  const inicioX = origen.x + Math.cos(angulo) * radio
  const inicioY = origen.y + Math.sin(angulo) * radio
  
  const finX = destino.x - Math.cos(angulo) * radio
  const finY = destino.y - Math.sin(angulo) * radio
  
  return `M ${inicioX} ${inicioY} L ${finX} ${finY}`
}

const calcularPathCiclo = (nodo) => {
  const x = nodo.x
  const y = nodo.y
  const radio = 24
  
  const anguloInicio = -Math.PI * 0.75
  const anguloFin = -Math.PI * 0.25
  
  const startX = x + Math.cos(anguloInicio) * radio
  const startY = y + Math.sin(anguloInicio) * radio
  
  const endX = x + Math.cos(anguloFin) * radio
  const endY = y + Math.sin(anguloFin) * radio
  
  const cp1X = x - 50
  const cp1Y = y - 80
  const cp2X = x + 50
  const cp2Y = y - 80
  
  return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`
}

const calcularPathParalelo = (origen, destino, offset, direccion) => {
  const dx = destino.x - origen.x
  const dy = destino.y - origen.y
  const distancia = Math.sqrt(dx * dx + dy * dy)
  
  if (distancia === 0) return `M ${origen.x} ${origen.y} L ${destino.x} ${destino.y}`
  
  const radio = 24
  
  if (direccion === 'ida') {
    const perpX = -dy / distancia
    const perpY = dx / distancia
    const angulo = Math.atan2(dy, dx)
    
    const bordeX1 = origen.x + Math.cos(angulo) * radio
    const bordeY1 = origen.y + Math.sin(angulo) * radio
    const bordeX2 = destino.x - Math.cos(angulo) * radio
    const bordeY2 = destino.y - Math.sin(angulo) * radio
    
    const inicioX = bordeX1 + perpX * offset
    const inicioY = bordeY1 + perpY * offset
    const finX = bordeX2 + perpX * offset
    const finY = bordeY2 + perpY * offset
    
    return `M ${inicioX} ${inicioY} L ${finX} ${finY}`
  } else {
    const dxInv = origen.x - destino.x
    const dyInv = origen.y - destino.y
    const perpXInv = -dyInv / distancia
    const perpYInv = dxInv / distancia
    const anguloInv = Math.atan2(dyInv, dxInv)
    
    const bordeX1 = destino.x + Math.cos(anguloInv) * radio
    const bordeY1 = destino.y + Math.sin(anguloInv) * radio
    const bordeX2 = origen.x - Math.cos(anguloInv) * radio
    const bordeY2 = origen.y - Math.sin(anguloInv) * radio
    
    const inicioX = bordeX1 + perpXInv * offset
    const inicioY = bordeY1 + perpYInv * offset
    const finX = bordeX2 + perpXInv * offset
    const finY = bordeY2 + perpYInv * offset
    
    return `M ${inicioX} ${inicioY} L ${finX} ${finY}`
  }
}

const calcularPuntoMedioParalelo = (origen, destino, offset) => {
  const midX = (origen.x + destino.x) / 2
  const midY = (origen.y + destino.y) / 2
  
  const dx = destino.x - origen.x
  const dy = destino.y - origen.y
  const distancia = Math.sqrt(dx * dx + dy * dy)
  
  if (distancia === 0) return { x: midX, y: midY }
  
  const perpX = -dy / distancia
  const perpY = dx / distancia
  
  return {
    x: midX + perpX * offset,
    y: midY + perpY * offset
  }
}

const getTipoConexionColor = computed(() => {
  switch(tipoConexion.value) {
    case 'dirigida': return '#3498db'
    case 'no-dirigida': return '#2ecc71'
    case 'bidireccional-paralela': return '#e74c3c'
    case 'segmentada': return '#f39c12'
    case 'segmentada-no-dirigida': return '#95a5a6'
    default: return '#3498db'
  }
})

const getTipoConexionNombre = computed(() => {
  switch(tipoConexion.value) {
    case 'dirigida': return 'Dirigida'
    case 'no-dirigida': return 'No Dirigida'
    case 'bidireccional-paralela': return 'Bidireccional'
    case 'segmentada': return 'Segmentada'
    case 'segmentada-no-dirigida': return 'Segmentada S/D'
    default: return 'Dirigida'
  }
})

const calcularConvergencias = computed(() => {
  let convergencias = 0
  const n = nodos.value.length
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const hayIda = matrizAdyacencia.value[i]?.[j] > 0
        const hayVuelta = matrizAdyacencia.value[j]?.[i] > 0
        
        if (hayIda && hayVuelta) {
          convergencias++
        }
      }
    }
  }
  
  return convergencias / 2
})

const matrizAdyacencia = computed(() => {
  const n = nodos.value.length
  const matriz = Array(n).fill().map(() => Array(n).fill(0))
  
  conexiones.value.forEach(conexion => {
    const origenIndex = nodos.value.findIndex(n => n.id === conexion.origen.id)
    const destinoIndex = nodos.value.findIndex(n => n.id === conexion.destino.id)
    
    if (origenIndex !== -1 && destinoIndex !== -1) {
      matriz[origenIndex][destinoIndex] = conexion.weight
      
      if (conexion.tipo === 'no-dirigida' || conexion.tipo === 'segmentada-no-dirigida') {
        matriz[destinoIndex][origenIndex] = conexion.weight
      }
    }
  })
  
  return matriz
})

const sumaFilas = computed(() => {
  return matrizAdyacencia.value.map(fila => 
    fila.reduce((sum, val) => sum + val, 0)
  )
})

const sumaColumnas = computed(() => {
  if (nodos.value.length === 0) return []
  const n = nodos.value.length
  return Array(n).fill().map((_, j) => 
    matrizAdyacencia.value.reduce((sum, fila) => sum + fila[j], 0)
  )
})

const sumaTotal = computed(() => {
  return sumaFilas.value.reduce((sum, val) => sum + val, 0)
})

const sumaTotalPesos = computed(() => sumaTotal.value)

const contarConexionesPorNodo = (indiceNodo) => {
  return matrizAdyacencia.value[indiceNodo].filter(valor => valor > 0).length
}

const totalConexiones = computed(() => {
  let total = 0
  for (let i = 0; i < nodos.value.length; i++) {
    total += contarConexionesPorNodo(i)
  }
  return total
})

const obtenerNombreNodo = (nodo) => {
  return nodo.nombre || `N${nodo.id}`
}

const crearNodo = (x, y) => {
  const colorIndex = (nextId - 1) % coloresNodo.length
  nodos.value.push({
    id: nextId++,
    nombre: '',
    x,
    y,
    color: coloresNodo[colorIndex]
  })
}

// ---- LOGICA DE ARRASTRE Y CLIC ----

const iniciarArrastre = (nodo, event) => {
  nodoArrastrado.value = nodo
  isDragging.value = false 
  const rect = pizarra.value.getBoundingClientRect()
  
  dragOffset.value = {
    x: (event.clientX - rect.left) - nodo.x,
    y: (event.clientY - rect.top) - nodo.y
  }
}

const detenerArrastre = () => {
  if (nodoArrastrado.value) {
    nodoArrastrado.value = null
    setTimeout(() => {
      isDragging.value = false
    }, 50)
  }
}

const handleMouseMove = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  
  if (modo.value === 'conexion' && nodoSeleccionado.value) {
    mousePos.value = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }

  if (nodoArrastrado.value) {
    isDragging.value = true
    
    let nuevoX = (event.clientX - rect.left) - dragOffset.value.x
    let nuevoY = (event.clientY - rect.top) - dragOffset.value.y
    
    if(nuevoX < 24) nuevoX = 24
    if(nuevoX > rect.width - 24) nuevoX = rect.width - 24
    if(nuevoY < 24) nuevoY = 24
    if(nuevoY > rect.height - 24) nuevoY = rect.height - 24

    nodoArrastrado.value.x = nuevoX
    nodoArrastrado.value.y = nuevoY
  } 
}

const handlePizarraClick = (event) => {
  if (isDragging.value) return; 

  if (modo.value === 'nodo') {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    crearNodo(x, y)
  }
}

const handleNodoClick = (nodo, event) => {
  event.stopPropagation()
  
  if (isDragging.value) return;
  
  if (modo.value === 'conexion') {
    if (!nodoSeleccionado.value) {
      nodoSeleccionado.value = nodo
    } else {
      conexionPendiente.value = {
        origen: nodoSeleccionado.value,
        destino: nodo
      }
      pesoTemporal.value = 3
      mostrarModalPeso.value = true
      
      nextTick(() => {
        if (inputPeso.value) {
          inputPeso.value.focus()
        }
      })
    }
  }
}

// ------------------------------------

const confirmarPeso = () => {
  if (pesoTemporal.value >= 1 && pesoTemporal.value <= 10) {
    if (conexionPendiente.value) {
      crearConexion(
        conexionPendiente.value.origen, 
        conexionPendiente.value.destino, 
        pesoTemporal.value
      )
    }
    cerrarModal()
  } else {
    alert('El peso debe estar entre 1 y 10')
  }
}

const cancelarPeso = () => {
  cerrarModal()
}

const cerrarModal = () => {
  mostrarModalPeso.value = false
  conexionPendiente.value = null
  nodoSeleccionado.value = null
  pesoTemporal.value = 3
}

const crearConexion = (origen, destino, peso) => {
  const existeSimilar = conexiones.value.some(c => 
    c.origen.id === origen.id && c.destino.id === destino.id
  )
  
  if (tipoConexion.value !== 'bidireccional-paralela' && existeSimilar) {
    alert('Ya existe una conexión similar')
    return
  }
  
  if (tipoConexion.value === 'no-dirigida' || tipoConexion.value === 'segmentada-no-dirigida') {
    const existeEnAmbas = conexiones.value.some(c => 
      (c.origen.id === origen.id && c.destino.id === destino.id) ||
      (c.origen.id === destino.id && c.destino.id === origen.id)
    )
    
    if (existeEnAmbas) {
      alert('Ya existe una conexión no dirigida entre estos nodos')
      return
    }
  }
  
  conexiones.value.push({
    origen,
    destino,
    weight: peso,
    color: getTipoConexionColor.value,
    tipo: tipoConexion.value
  })
}

const actualizarConexion = (index) => {
  conexiones.value = [...conexiones.value]
}

const eliminarConexion = (index) => {
  conexiones.value.splice(index, 1)
}

const eliminarNodo = (index) => {
  const nodoEliminado = nodos.value[index]
  
  conexiones.value = conexiones.value.filter(c => 
    c.origen.id !== nodoEliminado.id && c.destino.id !== nodoEliminado.id
  )
  
  nodos.value.splice(index, 1)
  
  if (nodoSeleccionado.value?.id === nodoEliminado.id) {
    nodoSeleccionado.value = null
  }
}

const actualizarNodo = () => {
  nodos.value = [...nodos.value]
}

const limpiarPizarra = () => {
  if (confirm('¿ESTÁS SEGURO?')) {
    nodos.value = []
    conexiones.value = []
    nodoSeleccionado.value = null
    nextId = 1
  }
}

// ---- LOGICA DE EXPORTACIÓN ----
const abrirModalExportar = () => {
  nombreArchivo.value = `diseño-${new Date().toISOString().slice(0,10)}`
  mostrarModalExportar.value = true
  
  nextTick(() => {
    if (inputExportar.value) {
      inputExportar.value.select()
    }
  })
}

const cancelarExportacion = () => {
  mostrarModalExportar.value = false
}

const confirmarExportacion = () => {
  if (!nombreArchivo.value.trim()) {
    alert('Por favor, ingresa un nombre válido para el archivo.')
    return
  }

  const diseño = {
    nodos: nodos.value,
    conexiones: conexiones.value.map(c => ({
      origenId: c.origen.id,
      destinoId: c.destino.id,
      weight: c.weight,
      color: c.color,
      tipo: c.tipo
    })),
    nextId
  }
  
  const dataStr = JSON.stringify(diseño, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  
  let finalName = nombreArchivo.value.trim()
  if (!finalName.endsWith('.json')) {
    finalName += '.json'
  }
  
  const link = document.createElement('a')
  link.href = dataUri
  link.download = finalName
  link.click()

  mostrarModalExportar.value = false
}

// ---- LOGICA DE IMPORTACIÓN ----
const importarDiseño = () => {
  fileInput.value.click()
}

const handleFileImport = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const diseño = JSON.parse(e.target.result)
      
      nodos.value = diseño.nodos
      
      conexiones.value = diseño.conexiones.map(c => {
        const origen = nodos.value.find(n => n.id === c.origenId)
        const destino = nodos.value.find(n => n.id === c.destinoId)
        return {
          origen,
          destino,
          weight: c.weight,
          color: c.color,
          tipo: c.tipo
        }
      })
      
      nextId = diseño.nextId
      alert('Diseño importado correctamente')
    } catch (error) {
      alert('Error al importar')
      console.error(error)
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

// ---- LÓGICA DE LA GUÍA ----
const abrirGuia = () => {
  mostrarModalGuia.value = true
}

const cerrarGuia = () => {
  mostrarModalGuia.value = false
}

onMounted(() => {})
</script>

<style scoped>
.nodos-container {
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #ecf0f1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

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

.nodos-main {
  margin-top: 80px;
  padding: 20px;
  flex: 1;
}

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
  flex-wrap: wrap;
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

.btn-tipo.active {
  background: #e67e22;
  border-color: #e67e22;
  color: white;
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

.btn-export {
  color: #27ae60;
  border-color: #a3e4d7;
}

.btn-export:hover {
  background: #27ae60;
  border-color: #27ae60;
  color: white;
}

.btn-import {
  color: #3498db;
  border-color: #a9cce3;
}

.btn-import:hover {
  background: #3498db;
  border-color: #3498db;
  color: white;
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

/* Nuevo estilo para el botón Guía */
.btn-info {
  color: #8e44ad;
  border-color: #d2b4de;
}

.btn-info:hover {
  background: #8e44ad;
  border-color: #8e44ad;
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

.contenedor-principal {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.matriz-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e0e7e9;
  flex: 0 0 350px;
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
  padding: 8px 4px;
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
  font-size: 0.7rem;
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
  border-radius: 50%;
  display: inline-block;
}

.matriz-tabla .row-header {
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.7rem;
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

.matriz-tabla .celda-convergencia {
  background: #8e44ad30;
  position: relative;
}

.matriz-tabla .celda-convergencia::after {
  content: "⇄";
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 0.6rem;
  color: #8e44ad;
}

.matriz-tabla .celda-con-valor .celda-valor {
  background: #3498db;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  display: inline-block;
  min-width: 18px;
  font-size: 0.75rem;
}

.matriz-tabla .sum-col, .matriz-tabla .sum-celda {
  background: #f39c1220;
  color: #2c3e50;
  font-weight: 600;
}

.matriz-tabla .count-col, .matriz-tabla .count-celda {
  background: #27ae6020;
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

.matriz-tabla .total-count-celda {
  background: #27ae60;
  color: white;
  font-weight: 600;
}

.matriz-footer {
  display: flex;
  gap: 16px;
  border-top: 1px solid #e0e7e9;
  padding-top: 12px;
  flex-wrap: wrap;
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

.pizarra-container {
  background: white;
  border-radius: 16px;
  border: 1px solid #e0e7e9;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  position: relative;
}

.pizarra-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e7e9;
  background: #f8f9fa;
  position: relative;
}

.pizarra-tools {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
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

.modal-peso-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-peso-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  min-width: 300px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.modal-peso-content h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.modal-peso-content p {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0 0 16px 0;
}

/* Nuevos estilos para la Guía */
.modal-guia-content {
  min-width: 450px;
  max-width: 90vw;
  text-align: left;
}

.modal-guia-content h3 {
  text-align: center;
  margin-bottom: 20px;
}

.guia-pasos {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guia-pasos p {
  color: #34495e;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

.guia-pasos b {
  color: #2c3e50;
}

.mt-4 {
  margin-top: 20px;
}

.modal-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e7e9;
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.modal-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52,152,219,0.1);
}

.modal-buttons {
  display: flex;
  gap: 10px;
}

.modal-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.modal-btn.cancelar {
  background: #ecf0f1;
  color: #7f8c8d;
}

.modal-btn.cancelar:hover {
  background: #bdc3c7;
  color: #2c3e50;
}

.modal-btn.confirmar {
  background: #3498db;
  color: white;
}

.modal-btn.confirmar:hover {
  background: #2980b9;
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
  font-size: 11px;
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
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: grab;
  transform: translate(-50%, -50%);
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  z-index: 10;
}

.nodo:active {
  cursor: grabbing;
}

.nodo:hover, .nodo.arrastrando {
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  filter: brightness(1.1);
}

.nodo.arrastrando {
  z-index: 100;
  transform: translate(-50%, -50%) scale(1.1);
}

.nodo.seleccionado {
  filter: brightness(0.8);
  box-shadow: 0 0 0 4px rgba(0,0,0,0.2);
}

.nodo.destino {
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
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.8rem;
  color: white;
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

.input-nombre:focus,
.input-peso:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52,152,219,0.1);
}

.select-tipo {
  padding: 6px 8px;
  border: 1px solid #e0e7e9;
  border-radius: 8px;
  background: white;
  font-size: 0.8rem;
  color: #2c3e50;
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
  margin: 0;
}

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
  
  .modal-peso-content {
    min-width: 260px;
    padding: 20px;
  }
  
  .modal-guia-content {
    min-width: 280px;
  }
}
</style>