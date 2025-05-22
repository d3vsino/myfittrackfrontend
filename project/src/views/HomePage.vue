<template>
  <div class="container max-w-md mx-auto px-4 py-2 pb-20">
    <h1 class="text-2xl font-bold text-blue-600 mb-6">Dashboard</h1>
    
    <loading-spinner v-if="loading" text="Loading your data..." />
    
    <template v-else>
      <calorie-tracker 
        :current="todayCalories" 
        :goal="userProfile ? userProfile.current_calorie_goal : 2000" 
      />
      
      <div class="mt-8 space-y-6">
        <!-- Food Image Analyzer -->
        <food-image-analyzer @add-food="addFood" />
        
        <!-- Quick Add Food Entry -->
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
          <div class="p-4 border-b flex justify-between items-center">
            <h2 class="text-lg font-medium">Quick Add Food</h2>
            <button 
              @click="showFoodEntry = !showFoodEntry"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {{ showFoodEntry ? 'Hide' : 'Show' }}
            </button>
          </div>
          <div v-if="showFoodEntry">
            <food-entry @add-food="addFood" />
          </div>
        </div>
        
        <div v-if="todayLog" class="bg-white shadow-md rounded-lg p-4">
          <h2 class="text-lg font-medium mb-4">Today's Log</h2>
          
          <div class="space-y-4">
            <div class="grid grid-cols-4 text-sm font-medium text-gray-500 border-b pb-2">
              <div>Calories</div>
              <div class="text-center">Protein</div>
              <div class="text-center">Carbs</div>
              <div class="text-center">Fat</div>
            </div>
            
            <div class="grid grid-cols-4 text-sm py-2">
              <div class="font-medium">{{ todayLog.calories }} kcal</div>
              <div class="text-center">{{ todayLog.protein || 0 }}g</div>
              <div class="text-center">{{ todayLog.carbs || 0 }}g</div>
              <div class="text-center">{{ todayLog.fat || 0 }}g</div>
            </div>
            
            <div v-if="todayLog.notes" class="text-sm text-gray-600 border-t pt-2">
              <p class="font-medium">Notes:</p>
              <p class="whitespace-pre-line">{{ todayLog.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CalorieTracker from '../components/CalorieTracker.vue'
import FoodEntry from '../components/FoodEntry.vue'
import FoodImageAnalyzer from '../components/FoodImageAnalyzer.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { getUserProfile, getCalorieLogs, createCalorieLog, updateCalorieLog } from '../services/api'

const userProfile = ref(null)
const calorieLogs = ref([])
const loading = ref(true)
const showFoodEntry = ref(false)


// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0]

const todayLog = computed(() => {
  return calorieLogs.value.find(log => log.date === today)
})

const todayCalories = computed(() => {
  return todayLog.value ? todayLog.value.calories : 0
})

const fetchData = async () => {
  loading.value = true
  try {
    const [profile, logs] = await Promise.all([
      getUserProfile(),
      getCalorieLogs()
    ])
    
    userProfile.value = profile
    calorieLogs.value = logs
  } catch (error) {
    console.error('Failed to fetch data', error)
  } finally {
    loading.value = false
  }
}

const addFood = async (foodData) => {
  try {
    if (todayLog.value) {
      // Update existing log
      const updatedLog = {
        ...todayLog.value,
        calories: todayLog.value.calories + foodData.calories,
        protein: (todayLog.value.protein || 0) + (foodData.protein || 0),
        carbs: (todayLog.value.carbs || 0) + (foodData.carbs || 0),
        fat: (todayLog.value.fat || 0) + (foodData.fat || 0),
        notes: foodData.notes ? `${todayLog.value.notes || ''}\n${foodData.notes}`.trim() : todayLog.value.notes
      }
      
      await updateCalorieLog(todayLog.value.id, updatedLog)
    } else {
      // Create new log
      await createCalorieLog(foodData)
    }
    
    // Refresh data
    await fetchData()
  } catch (error) {
    console.error('Failed to add food', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>
