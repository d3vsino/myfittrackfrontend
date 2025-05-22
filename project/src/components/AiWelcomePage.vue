<template>
  <div class="flex flex-col items-center justify-center h-full py-8 px-4">
    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
      <MessageSquare class="h-8 w-8 text-blue-600" />
    </div>
    
    <h1 class="text-3xl font-bold text-center mb-2">AI Nutritionist</h1>
    <p class="text-gray-600 text-center mb-8 max-w-xs">
      Your personal nutrition and fitness assistant powered by AI
    </p>
    
    <div class="w-full max-w-md space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <button 
          v-for="(example, index) in exampleQuestions" 
          :key="index"
          @click="$emit('ask-question', example)"
          class="p-4 bg-white border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
        >
          <p class="font-medium">{{ example }}</p>
        </button>
      </div>
      
      <div class="relative mt-8">
        <input 
          v-model="message" 
          type="text" 
          placeholder="Ask a nutrition question..." 
          class="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @keydown.enter="sendMessage"
        />
        <button 
          @click="sendMessage" 
          class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-full"
        >
          <SendHorizontal class="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MessageSquare, SendHorizontal } from 'lucide-vue-next'

const emit = defineEmits(['ask-question'])

const message = ref('')
const exampleQuestions = [
  "How many calories should I eat daily?",
  "What's a good post-workout meal?",
  "How can I increase my protein intake?",
  "What foods help reduce inflammation?"
]

const sendMessage = () => {
  if (message.value.trim()) {
    emit('ask-question', message.value)
    message.value = ''
  }
}
</script>
