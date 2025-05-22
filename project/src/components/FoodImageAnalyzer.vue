<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="p-4 border-b">
      <h2 class="text-lg font-medium">Analyze Food with Image</h2>
      <p class="text-sm text-gray-500 mt-1">
        Upload a photo of your meal to get estimated macros
      </p>
    </div>
    
    <div class="p-4">
      <div v-if="!imagePreview && !analyzing && !result" class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
        <Camera class="h-12 w-12 text-gray-400 mb-2" />
        <p class="text-sm text-gray-500 mb-4">Take a photo or upload an image of your food</p>
        <div class="flex gap-2">
          <label class="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
            Upload Image
            <input 
              type="file" 
              accept="image/*" 
              class="hidden" 
              @change="handleImageUpload"
            />
          </label>
          <label v-if="hasCamera" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md cursor-pointer hover:bg-gray-300">
            Take Photo
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              class="hidden" 
              @change="handleImageUpload"
            />
          </label>
        </div>
      </div>
      
      <div v-if="imagePreview && !analyzing && !result" class="space-y-4">
        <div class="relative">
          <img 
            :src="imagePreview" 
            alt="Food preview" 
            class="w-full h-48 object-cover rounded-lg"
          />
          <button 
            @click="cancelImage" 
            class="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
          >
            <X class="h-5 w-5 text-gray-700" />
          </button>
        </div>
        
        <button 
          @click="analyzeImage" 
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Analyze Food
        </button>
      </div>
      
      <div v-if="analyzing" class="py-8 flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-gray-600">Analyzing your food...</p>
      </div>
      
      <div v-if="result" class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="w-24 h-24 flex-shrink-0">
            <img 
              :src="imagePreview" 
              alt="Food" 
              class="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <h3 class="font-medium">Analysis Results</h3>
            <p class="text-sm text-gray-500">Estimated macros for your meal</p>
          </div>
        </div>
        
        <div class="p-4 bg-gray-50 rounded-lg">
          <pre class="text-sm whitespace-pre-wrap">{{ result.macros }}</pre>
        </div>
        
        <div class="space-y-4 pt-2">
          <h4 class="font-medium">Add to Food Log</h4>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="calories" class="block text-sm font-medium text-gray-700">Calories</label>
              <input
                id="calories"
                v-model.number="foodEntry.calories"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div class="space-y-2">
              <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
              <input
                id="date"
                v-model="foodEntry.date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-4">
            <div class="space-y-2">
              <label for="protein" class="block text-sm font-medium text-gray-700">Protein (g)</label>
              <input
                id="protein"
                v-model.number="foodEntry.protein"
                type="number"
                step="0.1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="space-y-2">
              <label for="carbs" class="block text-sm font-medium text-gray-700">Carbs (g)</label>
              <input
                id="carbs"
                v-model.number="foodEntry.carbs"
                type="number"
                step="0.1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="space-y-2">
              <label for="fat" class="block text-sm font-medium text-gray-700">Fat (g)</label>
              <input
                id="fat"
                v-model.number="foodEntry.fat"
                type="number"
                step="0.1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div class="space-y-2">
            <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              id="notes"
              v-model="foodEntry.notes"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add notes about this meal"
            ></textarea>
          </div>
          
          <div class="flex gap-2">
            <button 
              @click="addToLog" 
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Add to Log
            </button>
            <button 
              @click="resetAnalysis" 
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
        <p class="font-medium">Error</p>
        <p class="text-sm">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Camera, X } from 'lucide-vue-next'
import { analyzeFoodImage } from '../services/api'

const emit = defineEmits(['add-food'])

const imagePreview = ref(null)
const imageFile = ref(null)
const analyzing = ref(false)
const result = ref(null)
const error = ref(null)
const hasCamera = ref(false)

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0]

const foodEntry = ref({
  date: today,
  calories: null,
  protein: null,
  carbs: null,
  fat: null,
  notes: ''
})

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Reset states
  error.value = null
  result.value = null
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    error.value = 'Please upload an image file'
    return
  }
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Image size should be less than 5MB'
    return
  }
  
  imageFile.value = file
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const cancelImage = () => {
  imagePreview.value = null
  imageFile.value = null
  error.value = null
}

const analyzeImage = async () => {
  if (!imageFile.value) return
  
  analyzing.value = true
  error.value = null
  
  try {
    result.value = await analyzeFoodImage(imageFile.value)
    
    // Try to extract macros from the AI response
    const macrosText = result.value.macros
    
    // Simple regex patterns to find macros
    const proteinMatch = macrosText.match(/protein:?\s*(\d+\.?\d*)/i) || 
                         macrosText.match(/(\d+\.?\d*)\s*g(?:rams)?\s*(?:of)?\s*protein/i)
    const carbsMatch = macrosText.match(/carbs?:?\s*(\d+\.?\d*)/i) || 
                       macrosText.match(/(\d+\.?\d*)\s*g(?:rams)?\s*(?:of)?\s*carbs?/i)
    const fatMatch = macrosText.match(/fat:?\s*(\d+\.?\d*)/i) || 
                     macrosText.match(/(\d+\.?\d*)\s*g(?:rams)?\s*(?:of)?\s*fat/i)
    const caloriesMatch = macrosText.match(/calories:?\s*(\d+\.?\d*)/i) || 
                          macrosText.match(/(\d+\.?\d*)\s*calories/i)
    
    // Update food entry with extracted values
    if (proteinMatch) foodEntry.value.protein = parseFloat(proteinMatch[1])
    if (carbsMatch) foodEntry.value.carbs = parseFloat(carbsMatch[1])
    if (fatMatch) foodEntry.value.fat = parseFloat(fatMatch[1])
    if (caloriesMatch) foodEntry.value.calories = parseInt(caloriesMatch[1])
    
    // If no calories but we have macros, estimate calories
    if (!foodEntry.value.calories && (foodEntry.value.protein || foodEntry.value.carbs || foodEntry.value.fat)) {
      const protein = foodEntry.value.protein || 0
      const carbs = foodEntry.value.carbs || 0
      const fat = foodEntry.value.fat || 0
      
      // Calculate calories (4 cal/g for protein and carbs, 9 cal/g for fat)
      foodEntry.value.calories = Math.round((protein * 4) + (carbs * 4) + (fat * 9))
    }
    
    // Add a default note
    foodEntry.value.notes = 'Food analyzed from image'
    
  } catch (err) {
    console.error('Image analysis failed', err)
    error.value = err.response?.data?.error || 'Failed to analyze image. Please try again.'
  } finally {
    analyzing.value = false
  }
}

const addToLog = () => {
  if (!foodEntry.value.calories) {
    error.value = 'Please enter at least the calories for this food'
    return
  }
  
  emit('add-food', { ...foodEntry.value })
  resetAnalysis()
}

const resetAnalysis = () => {
  imagePreview.value = null
  imageFile.value = null
  result.value = null
  error.value = null
  
  // Reset food entry
  foodEntry.value = {
    date: today,
    calories: null,
    protein: null,
    carbs: null,
    fat: null,
    notes: ''
  }
}

onMounted(() => {
  // Check if device has a camera
  hasCamera.value = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
})
</script>
