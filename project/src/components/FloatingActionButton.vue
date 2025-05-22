<template>
  <div class="fixed bottom-24 right-4 z-20">
    <button 
      @click="showModal = true"
      class="bg-blue-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
      aria-label="Add food with image"
    >
      <Camera class="h-6 w-6" />
    </button>
    
    <!-- Modal -->
    <div 
      v-if="showModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-bold">Add Food with Image</h2>
          <button 
            @click="showModal = false"
            class="p-1 rounded-full hover:bg-gray-100"
          >
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <div class="p-4">
          <food-image-analyzer @add-food="handleAddFood" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Camera, X } from 'lucide-vue-next'
import FoodImageAnalyzer from './FoodImageAnalyzer.vue'

const emit = defineEmits(['add-food'])
const showModal = ref(false)

const handleAddFood = (foodData) => {
  emit('add-food', foodData)
  showModal.value = false
}
</script>
