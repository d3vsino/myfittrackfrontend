<template>
  <div class="container max-w-md mx-auto px-4 py-2 pb-20 h-[calc(100vh-120px)]">
    <h1 class="text-2xl font-bold text-blue-600 mb-4">AI Nutritionist</h1>
    
    <!-- Chat menu -->
    <chat-menu 
      :sessions="chatSessions" 
      :loading="loadingSessions"
      :selected-session-id="currentSessionId"
      @select-session="selectSession"
      @new-chat="startNewChat"
    />
    
    <!-- Welcome page or chat -->
    <div class="h-full">
      <ai-welcome-page 
        v-if="showWelcome" 
        @ask-question="askQuestion"
      />
      
      <div v-else class="flex flex-col h-full">
        <!-- Chat messages -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto space-y-4 mb-4">
          <div 
            v-for="(message, index) in currentSessionMessages" 
            :key="index" 
            :class="[
              'rounded-lg p-3 max-w-[80%]', 
              message.is_user ? 'bg-blue-100 ml-auto' : 'bg-white border'
            ]"
          >
            <p class="text-sm whitespace-pre-wrap">
              <template v-if="message.is_user">{{ message.message }}</template>
              <template v-else-if="message.isNew">
                <typewriter-text :text="message.message" :speed="20" :parse-markdown="true" />
              </template>
              <template v-else>
                <markdown-text :text="message.message" />
              </template>
            </p>
          </div>
          
          <div v-if="loading" class="bg-white border rounded-lg p-3 max-w-[80%]">
            <loading-spinner size="small" containerClass="py-1" />
          </div>

          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-[80%]">
            <p class="font-bold">Error:</p>
            <p>{{ error }}</p>
            <button 
              @click="error = null" 
              class="mt-2 text-xs underline"
            >
              Dismiss
            </button>
          </div>
        </div>
        
        <!-- Message input -->
        <div class="flex gap-2">
          <input 
            v-model="newMessage" 
            type="text" 
            placeholder="Ask about nutrition or fitness..." 
            class="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keydown.enter="sendMessage"
            :disabled="loading"
          />
          <button 
            @click="sendMessage" 
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            :disabled="loading"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { getAiResponse, getChatSessions } from '../services/api'
import TypewriterText from '../components/TypewriterText.vue'
import MarkdownText from '../components/MarkdownText.vue'
import ChatMenu from '../components/ChatMenu.vue'
import AiWelcomePage from '../components/AiWelcomePage.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

// State
const showWelcome = ref(true)
const newMessage = ref('')
const loading = ref(false)
const error = ref(null)
const chatContainer = ref(null)
const chatSessions = ref([])
const loadingSessions = ref(false)
const currentSessionId = ref(null)
const currentSessionMessages = ref([])

// Ask a question from welcome page
const askQuestion = (question) => {
  showWelcome.value = false
  newMessage.value = question
  nextTick(() => {
    sendMessage()
  })
}

// Start a new chat
const startNewChat = () => {
  currentSessionId.value = null
  currentSessionMessages.value = []
  showWelcome.value = true
  error.value = null
}

// Select a chat from history
const selectSession = (sessionId) => {
  currentSessionId.value = sessionId
  showWelcome.value = false
  error.value = null
  
  // Find the session
  const session = chatSessions.value.find(s => s.id === sessionId)
  
  if (session && session.messages) {
    // Convert to the format our UI expects
    currentSessionMessages.value = session.messages.map(msg => ({
      message: msg.message,
      is_user: msg.is_user,
      isNew: false // Not new, from history
    }))
  } else {
    currentSessionMessages.value = []
  }
  
  nextTick(() => {
    scrollToBottom()
  })
}

// Send a message
const sendMessage = async () => {
  if (!newMessage.value.trim() || loading.value) return
  
  const userMessage = newMessage.value
  newMessage.value = ''
  error.value = null
  
  // Add user message
  currentSessionMessages.value.push({
    message: userMessage,
    is_user: true,
    isNew: true
  })
  
  // Scroll to bottom
  await nextTick()
  scrollToBottom()
  
  // Get AI response
  loading.value = true
  try {
    console.log("Sending message:", userMessage)
    console.log("Current session ID:", currentSessionId.value)
    
    const response = await getAiResponse(userMessage, currentSessionId.value)
    
    console.log("Received response:", response)
    
    currentSessionMessages.value.push({
      message: response.reply,
      is_user: false,
      isNew: true // New message, use typewriter
    })
    
    // Update selected chat ID if this is a new conversation
    if (!currentSessionId.value && response.session_id) {
      currentSessionId.value = Number(response.session_id)
      console.log("Updated session ID:", currentSessionId.value)
    }
    
    // Refresh chat sessions
    fetchChatSessions()
  } catch (err) {
    console.error('Failed to get AI response', err)
    
    let errorMessage = "I'm sorry, I couldn't process your request. Please try again later."
    
    if (err.response) {
      console.log("Error response:", err.response)
      
      if (err.response.data) {
        if (err.response.data.error) {
          errorMessage = `${err.response.data.error}`
          
          if (err.response.data.detail) {
            try {
              // Try to parse the detail if it's a JSON string
              const detailObj = typeof err.response.data.detail === 'string' 
                ? JSON.parse(err.response.data.detail) 
                : err.response.data.detail
                
              if (detailObj.text) {
                errorMessage += `: ${detailObj.text}`
              } else {
                errorMessage += `: ${JSON.stringify(err.response.data.detail)}`
              }
            } catch (e) {
              errorMessage += `: ${err.response.data.detail}`
            }
          }
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data
        }
      }
    }
    
    error.value = errorMessage
  } finally {
    loading.value = false
    
    // Scroll to bottom after response
    await nextTick()
    scrollToBottom()
  }
}

// Fetch chat sessions
const fetchChatSessions = async () => {
  loadingSessions.value = true
  try {
    chatSessions.value = await getChatSessions()
  } catch (error) {
    console.error('Failed to fetch chat sessions', error)
  } finally {
    loadingSessions.value = false
  }
}

// Scroll to bottom of chat
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// Watch messages to scroll to bottom when new messages are added
watch(currentSessionMessages, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

// Initialize
onMounted(async () => {
  await fetchChatSessions()
})
</script>
