<template>
  <div class="chat-container d-flex flex-column flex-grow-1 overflow-hidden">
    <!-- Chat Messages -->
    <div class="messages-list flex-grow-1 overflow-auto p-3" ref="messageBox">
      <div v-if="messages.length === 0" class="empty-state text-center my-auto opacity-50">
        <i class="bi bi-robot display-1 mb-3"></i>
        <h3>Baza Icyo Aricyo Cyose</h3>
        <p>Tangira uganire na Kwanda Chat</p>
        <div v-if="!apiKey" class="alert alert-warning d-inline-block mt-3 px-4">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Please set your API key in <router-link to="/settings">Settings</router-link>
        </div>
      </div>

      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        :class="['message-bubble mb-3 d-flex', msg.role === 'user' ? 'justify-content-end' : 'justify-content-start']"
      >
        <div :class="['bubble p-3 rounded-4 shadow-sm', msg.role === 'user' ? 'user-bubble' : 'bot-bubble']">
          <div class="content mb-1">{{ msg.content }}</div>
          <div class="timestamp x-small opacity-50 text-end">
            {{ formatTime(msg.timestamp) }}
          </div>
        </div>
      </div>

      <div v-if="isTyping" class="message-bubble mb-3 d-flex justify-content-start">
        <div class="bubble p-3 rounded-4 bot-bubble typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-area p-3 border-top">
      <form @submit.prevent="handleSend" class="input-group">
        <input 
          v-model="userInput" 
          type="text" 
          class="form-control rounded-pill-start py-2 px-4" 
          placeholder="Andika ubutumwa hano..."
          :disabled="!apiKey || isTyping"
        >
        <button 
          class="btn btn-primary rounded-pill-end px-4" 
          type="submit"
          :disabled="!userInput.trim() || !apiKey || isTyping"
        >
          <i class="bi bi-send-fill"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

const store = useStore()
const userInput = ref('')
const messageBox = ref(null)

const messages = computed(() => store.state.messages)
const apiKey = computed(() => store.state.apiKey)
const isTyping = computed(() => store.state.isTyping)

const scrollToBottom = async () => {
  await nextTick()
  if (messageBox.value) {
    messageBox.value.scrollTop = messageBox.value.scrollHeight
  }
}

onMounted(scrollToBottom)
watch(messages, scrollToBottom, { deep: true })

const formatTime = (isoString) => {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const handleSend = async () => {
  if (!userInput.value.trim() || !apiKey.value) return
  
  const text = userInput.value
  userInput.value = ''
  
  store.dispatch('sendMessage', text)
  store.commit('SET_TYPING', true)
  
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Kwanda Chat, a helpful and professional AI assistant. Respond concisely." },
        ...store.state.messages.map(m => ({ role: m.role, content: m.content }))
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    const reply = response.data.choices[0].message.content
    store.dispatch('receiveResponse', reply)
  } catch (error) {
    console.error(error)
    const errorMsg = error.response?.data?.error?.message || "Kugera kuri AI byanze. Reba API Key yawe."
    store.dispatch('receiveResponse', `Error: ${errorMsg}`)
  } finally {
    store.commit('SET_TYPING', false)
  }
}
</script>

<style scoped>
.messages-list {
  scrollbar-width: thin;
}

.bubble {
  max-width: 80%;
  position: relative;
  word-wrap: break-word;
}

.user-bubble {
  background-color: #0d6efd;
  color: white;
  border-bottom-right-radius: 4px !important;
}

.dark .bot-bubble {
  background-color: var(--card-dark);
  color: var(--text-dark);
  border: 1px solid var(--border-dark);
  border-bottom-left-radius: 4px !important;
}

.light .bot-bubble {
  background-color: #e9ecef;
  color: var(--text-light);
  border-bottom-left-radius: 4px !important;
}

.x-small { font-size: 0.7rem; }

.typing-indicator span {
  height: 8px;
  width: 8px;
  float: left;
  margin: 0 1px;
  background-color: #9E9E9E;
  display: block;
  border-radius: 50%;
  opacity: 0.4;
}

.typing-indicator span:nth-of-type(1) { animation: 1s blink infinite 0.3333s; }
.typing-indicator span:nth-of-type(2) { animation: 1s blink infinite 0.6666s; }
.typing-indicator span:nth-of-type(3) { animation: 1s blink infinite 0.9999s; }

@keyframes blink {
  50% { opacity: 1; }
}

.dark .form-control {
  background-color: var(--card-dark);
  border-color: var(--border-dark);
  color: white;
}
.dark .form-control:focus {
  background-color: #2d3748;
  color: white;
}
</style>
