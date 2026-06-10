<template>
  <div :class="['app-wrapper', theme]">
    <nav class="navbar navbar-expand-lg border-bottom shadow-sm">
      <div class="container">
        <router-link to="/" class="navbar-brand fw-bold d-flex align-items-center">
          <i class="bi bi-chat-dots-fill me-2 text-primary"></i>
          KWANDA CHAT
        </router-link>
        
        <div class="d-flex align-items-center">
          <button @click="toggleTheme" class="btn btn-link text-decoration-none me-3 theme-toggle">
            <i :class="theme === 'dark' ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-stars-fill text-primary'"></i>
          </button>
          <router-link to="/settings" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-gear-fill"></i>
          </router-link>
        </div>
      </div>
    </nav>

    <main class="container py-4 flex-grow-1 d-flex flex-column overflow-hidden">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <footer class="text-center py-3 border-top mt-auto opacity-50 small">
      &copy; 2026 Kwanda Chat • Hamed Hussein
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const theme = computed(() => store.state.theme)

const toggleTheme = () => {
  store.commit('TOGGLE_THEME')
}
</script>

<style>
:root {
  --bg-dark: #0f172a;
  --card-dark: #1e293b;
  --text-dark: #f8fafc;
  --border-dark: #334155;
  
  --bg-light: #f8fafc;
  --card-light: #ffffff;
  --text-light: #0f172a;
  --border-light: #e2e8f0;
}

html, body, #app, .app-wrapper {
  height: 100%;
  margin: 0;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s, color 0.3s;
}

.app-wrapper.dark {
  background-color: var(--bg-dark);
  color: var(--text-dark);
}

.app-wrapper.light {
  background-color: var(--bg-light);
  color: var(--text-light);
}

.dark .navbar { background-color: var(--card-dark); border-color: var(--border-dark) !important; }
.light .navbar { background-color: var(--card-light); border-color: var(--border-light) !important; }

.dark .navbar-brand { color: var(--text-dark); }
.light .navbar-brand { color: var(--text-light); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.theme-toggle i { font-size: 1.2rem; }
</style>
