<template>
  <div class="bg-white shadow-md rounded-lg">
    <div class="p-4 border-b">
      <h2 class="text-lg font-medium">Add Food</h2>
    </div>
    <div class="p-4">
      <form @submit.prevent="handleSubmit" class="space-y-4">

        
        <div class="space-y-2">
          <label for="calories" class="block text-sm font-medium text-gray-700">Calories</label>
          <input
            id="calories"
            v-model.number="formData.calories"
            type="number"
            placeholder="Enter calories"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div class="grid grid-cols-3 gap-4">
          <div class="space-y-2">
            <label for="protein" class="block text-sm font-medium text-gray-700">Protein (g)</label>
            <input
              id="protein"
              v-model.number="formData.protein"
              type="number"
              step="0.1"
              placeholder="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="space-y-2">
            <label for="carbs" class="block text-sm font-medium text-gray-700">Carbs (g)</label>
            <input
              id="carbs"
              v-model.number="formData.carbs"
              type="number"
              step="0.1"
              placeholder="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="space-y-2">
            <label for="fat" class="block text-sm font-medium text-gray-700">Fat (g)</label>
            <input
              id="fat"
              v-model.number="formData.fat"
              type="number"
              step="0.1"
              placeholder="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div class="space-y-2">
          <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            id="notes"
            v-model="formData.notes"
            placeholder="Add notes about this meal"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows="2"
          ></textarea>
        </div>

        <button 
          type="submit" 
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Food
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add-food'])

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0]

const formData = ref({
  calories: null,
  protein: null,
  carbs: null,
  fat: null,
  notes: ''
})

const handleSubmit = () => {
  // Always use today's date
  const today = new Date().toISOString().split('T')[0]
  emit('add-food', { ...formData.value, date: today })
  
  // Reset form
  formData.value = {
    calories: null,
    protein: null,
    carbs: null,
    fat: null,
    notes: ''
  }
}
</script>
