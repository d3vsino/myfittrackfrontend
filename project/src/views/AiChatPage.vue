<template>
  <div class="container max-w-md mx-auto px-0 py-2 pb-20">
    <!-- Header with menu button -->
    <div class="flex items-center justify-between px-4 py-2 border-b">
      <button 
        @click="sidebarOpen = !sidebarOpen"
        class="p-2 rounded-md hover:bg-gray-100"
        aria-label="Toggle menu"
      >
        <Menu class="h-5 w-5" />
      </button>
      <h1 class="text-xl font-bold text-blue-600">AI Nutritionist</h1>
      <div class="w-9"></div> <!-- Empty div for balance -->
    </div>

    <div class="flex h-[calc(100vh-180px)] relative">
      <!-- Chat sidebar -->
      <div 
        class="absolute w-64 bg-white border-r border-gray-200 h-full z-40 transition-all duration-300 flex flex-col"
        :class="sidebarOpen ? 'left-0' : '-left-64'"
      >
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="font-bold text-gray-800">Chat History</h2>
          <div class="flex items-center gap-1">
            <button 
              @click="startNewChat"
              class="p-2 rounded-md hover:bg-gray-200 text-gray-600"
              title="New Chat"
            >
              <PlusCircle class="h-5 w-5" />
            </button>
            <button 
              @click="sidebarOpen = false"
              class="p-2 rounded-md hover:bg-gray-200 text-gray-600"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div v-if="loadingSessions" class="flex-1 flex justify-center items-center">
          <loading-spinner size="small" />
        </div>
        
        <div v-else-if="chatSessions.length === 0" class="flex-1 flex flex-col items-center justify-center text-gray-500 p-4">
          <MessageSquare class="h-8 w-8 mb-2 text-gray-400" />
          <p class="text-center">No chat history yet</p>
        </div>
        
        <div v-else class="flex-1 overflow-y-auto">
          <div class="space-y-1 p-2">
            <button 
              v-for="chat in chatSessions" 
              :key="chat.id" 
              @click="selectSession(chat.id)"
              class="w-full text-left p-3 rounded-lg hover:bg-gray-200 transition-colors flex items-start"
              :class="currentSessionId === chat.id ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''"
            >
              <MessageSquare class="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
              <div class="overflow-hidden">
                <div class="truncate font-medium">{{ chat.title || 'New Conversation' }}</div>
                <div class="text-xs text-gray-500 truncate">{{ formatDate(chat.created_at) }}</div>
              </div>
            </button>
          </div>
        </div>
        
        <div class="p-3 border-t border-gray-200">
          <button 
            @click="startNewChat"
            class="w-full flex items-center justify-center gap-2 p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            <PlusCircle class="h-4 w-4" />
            <span class="text-sm font-medium">New Chat</span>
          </button>
        </div>
      </div>
      
      <!-- Main chat area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Loading state -->
        <div v-if="initialLoading" class="flex-1 flex justify-center items-center">
          <loading-spinner containerClass="p-0" />
        </div>
        
        <!-- Welcome page or chat -->
        <div v-else class="flex-1 flex flex-col overflow-hidden">
          <ai-welcome-page 
            v-if="showWelcome" 
            @ask-question="askQuestion"
            class="flex-1 overflow-y-auto"
          />
          
          <div v-else class="flex-1 flex flex-col overflow-hidden">
            <!-- Chat messages -->
            <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
              <div 
                v-for="(message, index) in currentSessionMessages" 
                :key="index" 
                class="flex"
                :class="message.is_user ? 'justify-end' : 'justify-start'"
              >
                <div 
                  :class="[
                    'rounded-lg p-3 max-w-[80%]', 
                    message.is_user ? 'bg-blue-100' : 'bg-white border'
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
              </div>
              
              <div v-if="loading" class="flex justify-start">
                <div class="bg-white border rounded-lg p-3 max-w-[80%]">
                  <loading-spinner size="small" containerClass="py-1" />
                </div>
              </div>

              <div v-if="error" class="flex justify-start">
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-[80%]">
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
            </div>
            
            <!-- Message input -->
            <div class="p-4 border-t border-gray-200">
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
                  <Send class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
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
import AiWelcomePage from '../components/AiWelcomePage.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { MessageSquare, PlusCircle, Menu, X, Send } from 'lucide-vue-next'

// State
const showWelcome = ref(true)
const newMessage = ref('')
const loading = ref(false)
const initialLoading = ref(true)
const error = ref(null)
const chatContainer = ref(null)
const chatSessions = ref([])
const loadingSessions = ref(false)
const currentSessionId = ref(null)
const currentSessionMessages = ref([])
const sidebarOpen = ref(false)

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
  sidebarOpen.value = false
}

// Select a chat from history
const selectSession = (sessionId) => {
  currentSessionId.value = sessionId
  showWelcome.value = false
  error.value = null
  sidebarOpen.value = false
  
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

// Format date for chat history
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  });
}

// Watch messages to scroll to bottom when new messages are added
watch(currentSessionMessages, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

// Initialize
onMounted(async () => {
  initialLoading.value = true
  await fetchChatSessions()
  initialLoading.value = false
})
</script>
