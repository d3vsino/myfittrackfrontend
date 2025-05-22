<template>
    <div>
      <!-- Chat menu button -->
      <button 
        @click="isOpen = !isOpen"
        class="fixed bottom-20 right-4 z-30 bg-blue-600 text-white rounded-full p-3 shadow-lg"
        aria-label="Chat menu"
      >
        <MessageSquare v-if="!isOpen" class="h-6 w-6" />
        <X v-else class="h-6 w-6" />
      </button>
  
      <!-- Chat menu panel -->
      <div 
        v-if="isOpen"
        class="fixed inset-0 z-20 bg-black/5 backdrop-blur-sm"
        @click="isOpen = false"
      ></div>
  
      <div 
        class="fixed bottom-32 right-4 z-30 w-64 bg-white rounded-lg shadow-xl transform transition-all duration-300 max-h-[70vh] overflow-hidden flex flex-col"
        :class="isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'"
      >
        <div class="p-3 border-b flex justify-between items-center">
          <h3 class="font-bold">Chat History</h3>
          <button 
            @click="$emit('new-chat')"
            class="p-1.5 rounded-full hover:bg-gray-100"
            title="New Chat"
          >
            <PlusCircle class="h-5 w-5 text-blue-600" />
          </button>
        </div>
  
        <div v-if="loading" class="p-4 flex justify-center">
          <loading-spinner size="small" />
        </div>
  
        <div v-else-if="sessions.length === 0" class="p-4 text-center text-gray-500">
          No chat history yet
        </div>
  
        <div v-else class="overflow-y-auto">
          <button 
            v-for="session in sessions" 
            :key="session.id" 
            @click="selectSession(session)"
            class="w-full text-left p-3 hover:bg-gray-100 transition-colors border-b"
            :class="selectedSessionId === session.id ? 'bg-blue-50 text-blue-700' : ''"
          >
            <div class="truncate font-medium">{{ session.title }}</div>
            <div class="text-xs text-gray-500">{{ formatDate(session.created_at) }}</div>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { MessageSquare, X, PlusCircle } from 'lucide-vue-next'
  import LoadingSpinner from './LoadingSpinner.vue'
  
  const props = defineProps({
    sessions: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    selectedSessionId: {
      type: [Number, String],
      default: null
    }
  })
  
  const emit = defineEmits(['select-session', 'new-chat'])
  
  const isOpen = ref(false)
  
  const selectSession = (session) => {
    emit('select-session', Number(session.id))
    isOpen.value = false
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    })
  }
  
  // Close menu when selection changes
  watch(() => props.selectedSessionId, () => {
    isOpen.value = false
  })
  </script>
  