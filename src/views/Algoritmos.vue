<template>
  <div class="algoritmos-container">

    <!-- NAVBAR CON BOTÓN DE INICIO Y BOTÓN DE NODOS -->
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="home-button" title="Volver al inicio">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 3L2 12h3v8h6v-6h4v6h6v-8h3L12 3z"/>
          </svg>
        </router-link>
        
        <ul>
          <li><a href="#algoritmo">¿Qué es?</a></li>
          <li><a href="#utilizan">¿Para qué se utilizan?</a></li>
          <li><a href="#tipos">Tipos</a></li>
          <li><a href="#abeliano">Abeliano</a></li>
          <li><a href="#videos">Videos</a></li>
        </ul>

        <!-- Botón a la derecha para Nodos -->
        <router-link to="/nodos" class="nodos-button" title="Ir a Nodos">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <circle cx="12" cy="12" r="4" fill="white"/>
            <circle cx="6" cy="6" r="2.5" fill="white"/>
            <circle cx="18" cy="6" r="2.5" fill="white"/>
            <circle cx="6" cy="18" r="2.5" fill="white"/>
            <circle cx="18" cy="18" r="2.5" fill="white"/>
            <line x1="8.5" y1="7.5" x2="10.5" y2="10.5" stroke="white" stroke-width="1.5"/>
            <line x1="13.5" y1="10.5" x2="15.5" y2="7.5" stroke="white" stroke-width="1.5"/>
            <line x1="8.5" y1="16.5" x2="10.5" y2="13.5" stroke="white" stroke-width="1.5"/>
            <line x1="13.5" y1="13.5" x2="15.5" y2="16.5" stroke="white" stroke-width="1.5"/>
          </svg>
        </router-link>
      </div>
    </nav>

    <main>

      <!-- SECCIÓN 1 -->
      <section id="algoritmo" class="section">
        <div class="contenido">
          <img src="@/assets/img/algoritmo.jpeg" class="img-seccion" />
          <div class="texto">
            <h1>¿Qué es un algoritmo?</h1>
            <p>
              Un algoritmo es un conjunto de instrucciones ordenadas, precisas y finitas que indican paso a paso cómo resolver un problema o realizar una tarea.
            </p>
          </div>
        </div>
      </section>

      <!-- SECCIÓN 2 -->
      <section id="utilizan" class="section">
        <div class="contenido">
          <img src="@/assets/img/utilizacion.png" class="img-seccion" />
          <div class="texto">
            <h1>¿Para qué se utilizan los algoritmos?</h1>
            <p>
              Los algoritmos permiten organizar y automatizar la solución de problemas de manera eficiente en programación, matemáticas e ingeniería.
            </p>
          </div>
        </div>
      </section>

      <!-- SECCIÓN 3 -->
      <section id="tipos" class="section">
        <div class="contenido">
          <img src="@/assets/img/tipos.jpg" class="img-seccion" />
          <div class="texto">
            <h1>Tipos de algoritmos</h1>
            <p>
              Existen algoritmos secuenciales, condicionales y repetitivos según su estructura y forma de ejecución.
            </p>
          </div>
        </div>
      </section>

      <!-- SECCIÓN 4 -->
      <section id="abeliano" class="section">
        <div class="contenido">
          <img src="@/assets/img/abeliano.jpg" class="img-seccion" />
          <div class="texto">
            <h1>Grupo Abeliano</h1>
            <p>
              Un grupo abeliano es una estructura algebraica con elemento neutro, inverso, asociatividad y conmutatividad.
            </p>
          </div>
        </div>
      </section>

      <!-- SECCIÓN 5: VIDEOS -->
      <section id="videos" class="section videos-section">
        <div class="videos-container">
          <h1>Videos Explicativos</h1>

          <div class="video-grid">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/UPDjjuz1Hkw"
              title="Video 1"
              frameborder="0"
              allowfullscreen>
            </iframe>

            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/IZgOEC0NIbw"
              title="Video 2"
              frameborder="0"
              allowfullscreen>
            </iframe>
          </div>
        </div>
      </section>

    </main>

    <footer>
      <p>Análisis de Algoritmos - Primer Semestre 2026</p>
    </footer>

  </div>
</template>

<script setup>
</script>

<style>

html {
  scroll-behavior: smooth;
}

.algoritmos-container {
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f4f4f4;
}

/* NAVBAR CON BOTÓN DE INICIO Y BOTÓN DE NODOS */
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

.nav-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
}

.home-button, .nodos-button {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
}

.home-button {
  left: 0;
}

.nodos-button {
  right: 0;
}

.home-button:hover, .nodos-button:hover {
  background-color: #3498db;
  transform: scale(1.1);
}

.home-button svg, .nodos-button svg {
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

.home-button:hover svg, .nodos-button:hover svg {
  fill: white;
}

.navbar ul {
  list-style: none;
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;
}

.navbar li {
  margin: 0 20px;
}

.navbar a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: 0.3s;
}

.navbar a:not(.home-button):not(.nodos-button):hover {
  color: #3498db;
}

/* SECCIONES */
.section {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 10% 60px 10%;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
}

.contenido {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  gap: 80px;
}

section:nth-of-type(even) .contenido {
  flex-direction: row-reverse;
}

.texto {
  flex: 1.2;
}

h1 {
  font-size: 2.8rem;
  margin-bottom: 25px;
}

p {
  font-size: 1.35rem;
  text-align: justify;
}

.img-seccion {
  flex: 1;
  max-width: 45%;
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  transition: 0.3s;
}

.img-seccion:hover {
  transform: scale(1.03);
}

/* VIDEOS */
.videos-section {
  background-color: #ffffff;
  flex-direction: column;
}

.videos-container {
  text-align: center;
  width: 100%;
}

.video-grid {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

/* FOOTER */
footer {
  background: #2c3e50;
  padding: 10px 0;
}

footer p {
  color: white;
  font-size: 0.85rem;
  text-align: center;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .nav-container {
    flex-direction: column;
    gap: 15px;
  }
  
  .home-button, .nodos-button {
    position: static;
    margin-bottom: 5px;
  }
  
  .navbar ul {
    flex-wrap: wrap;
  }
  
  .navbar li {
    margin: 5px 10px;
  }

  .contenido,
  section:nth-of-type(even) .contenido {
    flex-direction: column !important;
    text-align: center;
    gap: 40px;
  }

  .img-seccion {
    max-width: 80%;
  }

  p {
    text-align: center;
  }

  .video-grid {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .navbar li {
    margin: 5px 8px;
  }
  
  .navbar a {
    font-size: 0.9rem;
  }
}

</style>