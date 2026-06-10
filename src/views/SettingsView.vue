<template>
  <div class="settings-container mx-auto w-100" style="max-width: 600px;">
    <div class="card border-0 shadow-sm p-4">
      <h2 class="h4 mb-4 d-flex align-items-center">
        <i class="bi bi-gear-fill me-2 text-secondary"></i>
        Settings
      </h2>
      
      <div class="mb-4">
        <label class="form-label fw-bold">OpenAI API Key</label>
        <div class="input-group">
          <input 
            :type="showKey ? 'text' : 'password'" 
            v-model="apiKey" 
            class="form-control bg-transparent" 
            placeholder="sk-..."
          >
          <button @click="showKey = !showKey" class="btn btn-outline-secondary">
            <i :class="showKey ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
        <div class="form-text mt-2">
          Your API key is stored locally in your browser and never sent to our servers.
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-5 pt-3 border-top">
        <button @click="clearHistory" class="btn btn-outline-danger btn-sm">
          <i class="bi bi-trash3 me-1"></i> Clear Chat History
        </button>
        <button @click="saveSettings" class="btn btn-primary px-4">
          Save Changes
        </button>
      </div>

      <div v-if="saved" class="alert alert-success mt-3 py-2 text-center small">
        Settings saved successfully!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const apiKey = ref('')
const showKey = ref(false)
const saved = ref(false)

onMounted(() => {
  apiKey.value = store.state.apiKey
})

const saveSettings = () => {
  store.dispatch('saveApiKey', apiKey.value)
  saved.value = true
  setTimeout(() => saved.value = false, 3000)
}

const clearHistory = () => {
  if (confirm('Are you sure you want to clear all chat messages?')) {
    store.commit('CLEAR_HISTORY')
  }
}
</script>

<style scoped>
.dark .card { background-color: var(--card-dark); color: var(--text-dark); border: 1px solid var(--border-dark) !important; }
.light .card { background-color: var(--card-light); color: var(--text-light); border: 1px solid var(--border-light) !important; }

.dark .form-control { color: white; border-color: var(--border-dark); }
.dark .form-control:focus { background-color: rgba(255,255,255,0.05); color: white; }
</style>
