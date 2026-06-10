import { createStore } from 'vuex'

export default createStore({
  state: {
    apiKey: localStorage.getItem('kwanda_api_key') || '',
    theme: localStorage.getItem('kwanda_theme') || 'dark',
    messages: JSON.parse(localStorage.getItem('kwanda_messages')) || [],
    isTyping: false
  },
  mutations: {
    SET_API_KEY(state, key) {
      state.apiKey = key
      localStorage.setItem('kwanda_api_key', key)
    },
    TOGGLE_THEME(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('kwanda_theme', state.theme)
    },
    ADD_MESSAGE(state, message) {
      state.messages.push(message)
      localStorage.setItem('kwanda_messages', JSON.stringify(state.messages))
    },
    CLEAR_HISTORY(state) {
      state.messages = []
      localStorage.removeItem('kwanda_messages')
    },
    SET_TYPING(state, status) {
      state.isTyping = status
    }
  },
  actions: {
    saveApiKey({ commit }, key) {
      commit('SET_API_KEY', key)
    },
    sendMessage({ commit }, text) {
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: text,
        timestamp: new Date().toISOString()
      }
      commit('ADD_MESSAGE', userMessage)
    },
    receiveResponse({ commit }, text) {
      const botMessage = {
        id: Date.now(),
        role: 'assistant',
        content: text,
        timestamp: new Date().toISOString()
      }
      commit('ADD_MESSAGE', botMessage)
    }
  }
})
