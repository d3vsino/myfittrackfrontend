<template>
  <div class="container max-w-md mx-auto px-4 py-2 pb-20">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-blue-600">Statistics</h1>
      <select 
        v-model="timePeriod" 
        class="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option v-for="period in timePeriods" :key="period.value" :value="period.value">
          {{ period.label }}
        </option>
      </select>
    </div>
    
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <template v-else>
      <div class="space-y-6">
        <!-- Macronutrient Section -->
        <div class="bg-white shadow-md rounded-lg">
          <div class="p-4 border-b">
            <h2 class="text-lg font-medium">Macronutrient Breakdown</h2>
          </div>
          <div class="p-4">
            <macronutrient-chart :logs="filteredLogs" />
            
            <div class="mt-6 space-y-4">
              <div class="grid grid-cols-4 text-sm font-medium text-gray-500 border-b pb-2">
                <div>Date</div>
                <div class="text-center">Protein</div>
                <div class="text-center">Carbs</div>
                <div class="text-center">Fat</div>
              </div>
              
              <div 
                v-for="log in filteredLogs" 
                :key="log.id" 
                class="grid grid-cols-4 text-sm py-2 border-b border-gray-100"
              >
                <div class="font-medium">{{ formatDate(log.date) }}</div>
                <div class="text-center">{{ log.protein || 0 }}g</div>
                <div class="text-center">{{ log.carbs || 0 }}g</div>
                <div class="text-center">{{ log.fat || 0 }}g</div>
              </div>
              
              <div v-if="filteredLogs.length === 0" class="text-center py-4 text-gray-500">
                No data for this period
              </div>
            </div>
          </div>
        </div>

        <!-- User Stats Section -->
        <div v-if="userProfile" class="bg-white shadow-md rounded-lg">
          <div class="p-4 border-b">
            <h2 class="text-lg font-medium">Your Stats</h2>
          </div>
          <div class="p-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <p class="text-sm text-gray-500">Height</p>
                <p class="font-medium">{{ userProfile.height_cm }} cm</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm text-gray-500">Weight</p>
                <p class="font-medium">{{ userProfile.weight_kg }} kg</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm text-gray-500">BMI</p>
                <p class="font-medium">{{ calculateBMI(userProfile.weight_kg, userProfile.height_cm) }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm text-gray-500">Age</p>
                <p class="font-medium">{{ userProfile.age }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Nutrition Goals Section -->
        <div v-if="userProfile" class="bg-white shadow-md rounded-lg">
          <div class="p-4 border-b">
            <h2 class="text-lg font-medium">Nutrition Goals</h2>
          </div>
          <div class="p-4">
            <div class="space-y-4">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <p class="text-sm text-gray-500">Daily Calories</p>
                  <p class="font-medium">{{ userProfile.current_calorie_goal }} kcal</p>
                </div>
                <div class="w-full h-2 bg-gray-100 rounded-full">
                  <div 
                    class="h-full bg-blue-500 rounded-full" 
                    :style="{ width: `${calculateProgress(todayCalories, userProfile.current_calorie_goal)}%` }"
                  ></div>
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex justify-between">
                  <p class="text-sm text-gray-500">Protein Goal</p>
                  <p class="font-medium">
                    {{ todayProtein }}g / {{ userProfile.current_protein_goal }}g
                  </p>
                </div>
                <div class="w-full h-2 bg-gray-100 rounded-full">
                  <div 
                    class="h-full bg-blue-500 rounded-full" 
                    :style="{ width: `${calculateProgress(todayProtein, userProfile.current_protein_goal)}%` }"
                  ></div>
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex justify-between">
                  <p class="text-sm text-gray-500">Carbs Goal</p>
                  <p class="font-medium">
                    {{ todayCarbs }}g / {{ userProfile.current_carbs_goal }}g
                  </p>
                </div>
                <div class="w-full h-2 bg-gray-100 rounded-full">
                  <div 
                    class="h-full bg-green-500 rounded-full" 
                    :style="{ width: `${calculateProgress(todayCarbs, userProfile.current_carbs_goal)}%` }"
                  ></div>
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex justify-between">
                  <p class="text-sm text-gray-500">Fat Goal</p>
                  <p class="font-medium">
                    {{ todayFat }}g / {{ userProfile.current_fat_goal }}g
                  </p>
                </div>
                <div class="w-full h-2 bg-gray-100 rounded-full">
                  <div 
                    class="h-full bg-amber-500 rounded-full" 
                    :style="{ width: `${calculateProgress(todayFat, userProfile.current_fat_goal)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MacronutrientChart from '../components/MacronutrientChart.vue'
import { getUserProfile, getCalorieLogs } from '../services/api'

// Time period options
const timePeriods = [
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
  { value: "1m", label: "1 Month" },
  { value: "3m", label: "3 Months" },
  { value: "6m", label: "6 Months" },
  { value: "1y", label: "1 Year" },
]

const timePeriod = ref("1w")
const userProfile = ref(null)
const calorieLogs = ref([])
const loading = ref(true)

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0]

const todayLog = computed(() => {
  return calorieLogs.value.find(log => log.date === today)
})

const todayCalories = computed(() => {
  return todayLog.value ? todayLog.value.calories : 0
})

const todayProtein = computed(() => {
  return todayLog.value ? todayLog.value.protein || 0 : 0
})

const todayCarbs = computed(() => {
  return todayLog.value ? todayLog.value.carbs || 0 : 0
})

const todayFat = computed(() => {
  return todayLog.value ? todayLog.value.fat || 0 : 0
})

const filteredLogs = computed(() => {
  if (!calorieLogs.value.length) return []
  
  const now = new Date()
  let startDate = new Date()
  
  switch (timePeriod.value) {
    case '1d':
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 1)
      break
    case '1w':
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
      break
    case '1m':
      startDate = new Date(now)
      startDate.setMonth(now.getMonth() - 1)
      break
    case '3m':
      startDate = new Date(now)
      startDate.setMonth(now.getMonth() - 3)
      break
    case '6m':
      startDate = new Date(now)
      startDate.setMonth(now.getMonth() - 6)
      break
    case '1y':
      startDate = new Date(now)
      startDate.setFullYear(now.getFullYear() - 1)
      break
  }
  
  return calorieLogs.value.filter(log => {
    const logDate = new Date(log.date)
    return logDate >= startDate && logDate <= now
  })
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

const formatDate = (dateString) => {
  const options = { month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const calculateBMI = (weight, height) => {
  if (!weight || !height) return 'N/A'
  
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)
  return bmi.toFixed(1)
}

const calculateProgress = (current, goal) => {
  if (!goal) return 0
  return Math.min(Math.round((current / goal) * 100), 100)
}

onMounted(() => {
  fetchData()
})
</script>
