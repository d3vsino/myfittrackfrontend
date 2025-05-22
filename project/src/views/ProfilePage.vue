<template>
  <div class="container max-w-md mx-auto px-4 py-2 pb-20">
    <h1 class="text-2xl font-bold text-blue-600 mb-6">Profile</h1>
    
    <div v-if="loading" class="flex justify-center items-center" style="min-height: 200px;">
      <loading-spinner containerClass="p-0" />
    </div>
    
    <template v-else-if="userProfile">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="bg-blue-600 p-6 text-white">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
              {{ userProfile.first_name ? userProfile.first_name[0] : '' }}{{ userProfile.last_name ? userProfile.last_name[0] : '' }}
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ userProfile.first_name }} {{ userProfile.last_name }}</h2>
              <p class="text-blue-100">{{ userProfile.email }}</p>
            </div>
          </div>
        </div>
        
        <div class="p-6 space-y-6">
          <div>
            <h3 class="text-lg font-medium mb-3">Personal Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <p class="text-sm text-gray-500">Age</p>
                <p class="font-medium">{{ userProfile.age }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm text-gray-500">Gender</p>
                <p class="font-medium capitalize">{{ userProfile.gender }}</p>
              </div>
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
                <p class="text-sm text-gray-500">Activity Level</p>
                <p class="font-medium capitalize">{{ formatActivityLevel(userProfile.activity_level) }}</p>
              </div>
            </div>
          </div>
          
          <div class="border-t pt-6">
            <h3 class="text-lg font-medium mb-3">Nutrition Goals</h3>
            
            <div class="space-y-4">
              <div class="p-4 bg-blue-50 rounded-lg">
                <h4 class="font-medium text-blue-800 mb-2">Current Calorie Goal</h4>
                <p class="text-2xl font-bold text-blue-600">{{ userProfile.current_calorie_goal }} kcal</p>
              </div>
              
              <div class="grid grid-cols-3 gap-4">
                <div class="p-3 bg-blue-50 rounded-lg text-center">
                  <p class="text-sm text-gray-600">Protein</p>
                  <p class="font-bold text-blue-600">
                    {{ userProfile.current_protein_goal }}g
                  </p>
                </div>
                <div class="p-3 bg-green-50 rounded-lg text-center">
                  <p class="text-sm text-gray-600">Carbs</p>
                  <p class="font-bold text-green-600">
                    {{ userProfile.current_carbs_goal }}g
                  </p>
                </div>
                <div class="p-3 bg-amber-50 rounded-lg text-center">
                  <p class="text-sm text-gray-600">Fat</p>
                  <p class="font-bold text-amber-600">
                    {{ userProfile.current_fat_goal }}g
                  </p>
                </div>
              </div>
              
              <div class="pt-2">
                <p class="text-sm text-gray-500 mb-2">Macronutrient Ratio</p>
                <div class="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div class="flex h-full">
                    <div class="bg-blue-500 h-full" :style="{ width: `${proteinPercent}%` }"></div>
                    <div class="bg-green-500 h-full" :style="{ width: `${carbsPercent}%` }"></div>
                    <div class="bg-amber-500 h-full" :style="{ width: `${fatPercent}%` }"></div>
                  </div>
                </div>
                <div class="flex justify-between text-xs mt-1">
                  <span class="text-blue-600">Protein {{ proteinPercent }}%</span>
                  <span class="text-green-600">Carbs {{ carbsPercent }}%</span>
                  <span class="text-amber-600">Fat {{ fatPercent }}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="border-t pt-6">
            <h3 class="text-lg font-medium mb-3">Other Calorie Targets</h3>
            
            <div class="grid grid-cols-3 gap-4">
              <div class="p-3 bg-gray-50 rounded-lg text-center">
                <p class="text-sm text-gray-600">Maintenance</p>
                <p class="font-bold text-gray-700">
                  {{ userProfile.maintenance_calories }} kcal
                </p>
              </div>
              <div class="p-3 bg-gray-50 rounded-lg text-center">
                <p class="text-sm text-gray-600">Weight Gain</p>
                <p class="font-bold text-gray-700">
                  {{ userProfile.gain_calories }} kcal
                </p>
              </div>
              <div class="p-3 bg-gray-50 rounded-lg text-center">
                <p class="text-sm text-gray-600">Weight Loss</p>
                <p class="font-bold text-gray-700">
                  {{ userProfile.loss_calories }} kcal
                </p>
              </div>
            </div>
          </div>
          
          <div class="pt-4 flex justify-center">
            <button 
              @click="showSettings = true"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      
      <profile-settings 
        v-if="showSettings" 
        :user-profile="userProfile" 
        @close="showSettings = false"
        @update="fetchUserProfile"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProfileSettings from '../components/ProfileSettings.vue'
import { getUserProfile } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const userProfile = ref(null)
const loading = ref(true)
const showSettings = ref(false)

// Calculate percentages for the ratio bar
const totalMacros = computed(() => {
  if (!userProfile.value) return 100
  
  return (
    userProfile.value.current_protein_goal + 
    userProfile.value.current_carbs_goal + 
    userProfile.value.current_fat_goal
  )
})

const proteinPercent = computed(() => {
  if (!userProfile.value) return 30
  return Math.round((userProfile.value.current_protein_goal / totalMacros.value) * 100)
})

const carbsPercent = computed(() => {
  if (!userProfile.value) return 45
  return Math.round((userProfile.value.current_carbs_goal / totalMacros.value) * 100)
})

const fatPercent = computed(() => {
  if (!userProfile.value) return 25
  return Math.round((userProfile.value.current_fat_goal / totalMacros.value) * 100)
})

const fetchUserProfile = async () => {
  loading.value = true
  try {
    userProfile.value = await getUserProfile()
  } catch (error) {
    console.error('Failed to fetch user profile', error)
  } finally {
    loading.value = false
  }
}

const calculateBMI = (weight, height) => {
  if (!weight || !height) return 'N/A'
  
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)
  return bmi.toFixed(1)
}

const formatActivityLevel = (level) => {
  if (!level) return 'Not set'
  
  const activityMap = {
    'sedentary': 'Sedentary',
    'light': 'Lightly active',
    'moderate': 'Moderately active',
    'active': 'Very active',
    'super': 'Super active'
  }
  
  return activityMap[level] || level
}

onMounted(() => {
  fetchUserProfile()
})
</script>
