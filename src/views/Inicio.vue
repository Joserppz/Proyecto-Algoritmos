<template>
  <div class="inicio-container">

    <nav class="navbar">
      <div class="nav-content">
        <div class="logo">
          ANÁLISIS DE ALGORITMOS
        </div>

        <ul class="nav-links">
          <li><router-link to="/">INICIO</router-link></li>
          <li class="dropdown">
            <router-link to="/algoritmos" class="dropbtn">ALGORITMOS</router-link>
            <div class="dropdown-content">
              <router-link :to="{ path: '/algoritmos', hash: '#algoritmo' }">¿Qué es?</router-link>
              <router-link :to="{ path: '/algoritmos', hash: '#utilizan' }">¿Para qué se utilizan?</router-link>
              <router-link :to="{ path: '/algoritmos', hash: '#tipos' }">Tipos</router-link>
              <router-link :to="{ path: '/algoritmos', hash: '#abeliano' }">Abeliano</router-link>
              <router-link :to="{ path: '/algoritmos', hash: '#videos' }">Videos</router-link>
            </div>
          </li>
          <li><router-link to="/nodos">NODOS</router-link></li>
        </ul>
      </div>
    </nav>

    <section class="hero">
      <div class="hero-content">
        <div class="hero-center">
          <img 
            src="@/assets/img/escudoucb.png"
            alt="Escudo UCB"
            class="hero-img floating"
          />
          <div class="hero-text">
            <h1>Análisis de Algoritmos</h1>
            <h2>Primer Semestre - 2026</h2>
          </div>
        </div>
      </div>
    </section>

    <footer>
      <p>Análisis de Algoritmos - Primer Semestre 2026</p>
    </footer>

  </div>
</template>

<script setup>
</script>

<style scoped>

.inicio-container {
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f4f4f4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* NAVBAR */
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
}

.logo {
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
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
}

.nav-links a:hover {
  color: #3498db;
}

/* DROPDOWN MENU */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #34495e;
  min-width: 200px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  border-radius: 5px;
  z-index: 1;
  top: 100%;
  left: 0;
}

.dropdown-content a {
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  font-weight: normal;
  border-bottom: 1px solid #3d566e;
}

.dropdown-content a:last-child {
  border-bottom: none;
}

.dropdown-content a:hover {
  background-color: #3498db;
  color: white;
}

.dropdown:hover .dropdown-content {
  display: block;
}

/* HERO - CENTRADO PERFECTO */
.hero {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 8% 20px 8%; 
  margin-top: 0;
}

.hero-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.hero-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 30px;
  max-width: 800px;
  width: 100%;
}

/* ESCUDO CON ANIMACIÓN */
.hero-img {
  width: 350px;
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

.floating {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

.hero-text {
  width: 100%;
}

.hero-text h1 {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #333;
}

.hero-text h2 {
  font-weight: normal;
  font-size: 1.5rem;
  color: #555;
  margin: 0;
}

/* FOOTER */
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
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .hero-img {
    width: 250px;
  }

  .hero-text h1 {
    font-size: 2.2rem;
  }
  
  .hero-text h2 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 80px 5% 10px 5%;
  }
  
  .hero-img {
    width: 200px;
  }
  
  .hero-text h1 {
    font-size: 1.8rem;
  }
  
  .dropdown-content {
    min-width: 180px;
  }
}

/* Ajuste para pantallas muy pequeñas */
@media (max-height: 600px) {
  .hero-center {
    gap: 15px;
  }
  
  .hero-img {
    width: 150px;
  }
  
  .hero-text h1 {
    font-size: 1.5rem;
    margin-bottom: 5px;
  }
}

</style>