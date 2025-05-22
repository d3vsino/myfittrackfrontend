<template>
  <div 
    class="fixed inset-y-0 left-0 w-72 bg-white shadow-lg transform transition-transform duration-300 z-20"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex flex-col h-full">
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="text-lg font-bold">Chat History</h2>
        <button 
          @click="$emit('close')" 
          class="p-2 rounded-full hover:bg-gray-100"
        >
          <X class="h-5 w-5" />
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <div class="p-4">
          <button 
            @click="$emit('new-chat')" 
            class="w-full flex items-center gap-2 p-3 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <PlusCircle class="h-5 w-5" />
            <span class="font-medium">New Chat</span>
          </button>
        </div>
        
        <div v-if="loading" class="flex justify-center py-8">
          <loading-spinner size="small" />
        </div>
        
        <div v-else-if="chats.length === 0" class="p-4 text-center text-gray-500">
          No chat history yet
        </div>
        
        <div v-else class="space-y-1 p-2">
          <button 
            v-for="chat in groupedChats" 
            :key="chat.id" 
            @click="$emit('select-chat', chat.id)"
            class="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
            :class="selectedChatId === chat.id ? 'bg-blue-50 text-blue-700' : ''"
          >
            <div class="truncate font-medium">{{ chat.message }}</div>
            <div class="text-xs text-gray-500">{{ formatDate(chat.timestamp) }}</div>
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Backdrop with blur effect -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black/5 backdrop-blur-sm z-10"
    @click="$emit('close')"
  ></div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X, PlusCircle } from 'lucide-vue-next'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
  chats: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  selectedChatId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['close', 'new-chat', 'select-chat'])

// Group chats by ID to show only the first message of each conversation
const groupedChats = computed(() => {
  const uniqueChats = new Map();
  
  // Process in reverse to get the most recent chats first
  for (const chat of [...props.chats].reverse()) {
    if (!uniqueChats.has(chat.id)) {
      uniqueChats.set(chat.id, chat);
    }
  }
  
  return Array.from(uniqueChats.values());
})

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  });
}
</script>
