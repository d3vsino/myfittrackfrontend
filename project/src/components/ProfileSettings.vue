<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-xl font-bold">Profile Settings</h2>
        <button 
          class="p-2 rounded-full hover:bg-gray-100"
          @click="$emit('close')"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <div class="p-4">
        <div class="flex space-x-2 mb-4">
          <button 
            @click="activeTab = 'personal'" 
            class="px-3 py-1 rounded-md"
            :class="activeTab === 'personal' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
          >
            Personal Info
          </button>
          <button 
            @click="activeTab = 'goals'" 
            class="px-3 py-1 rounded-md"
            :class="activeTab === 'goals' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
          >
            Nutrition Goals
          </button>
        </div>

        <form @submit.prevent="saveChanges">
          <!-- Personal Info Tab -->
          <div v-if="activeTab === 'personal'" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  id="firstName"
                  v-model="formData.first_name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div class="space-y-2">
                <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  id="lastName"
                  v-model="formData.last_name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="age" class="block text-sm font-medium text-gray-700">Age</label>
              <input
                id="age"
                v-model.number="formData.age"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div class="space-y-2">
              <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
              <select
                id="gender"
                v-model="formData.gender"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="height" class="block text-sm font-medium text-gray-700">Height (cm)</label>
                <input
                  id="height"
                  v-model.number="formData.height_cm"
                  type="number"
                  step="0.1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div class="space-y-2">
                <label for="weight" class="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  id="weight"
                  v-model.number="formData.weight_kg"
                  type="number"
                  step="0.1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="activity" class="block text-sm font-medium text-gray-700">Activity Level</label>
              <select
                id="activity"
                v-model="formData.activity_level"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Lightly active</option>
                <option value="moderate">Moderately active</option>
                <option value="active">Very active</option>
                <option value="super">Super active</option>
              </select>
            </div>
          </div>

          <!-- Nutrition Goals Tab -->
          <div v-if="activeTab === 'goals'" class="space-y-4">
            <div class="space-y-2">
              <label for="goalType" class="block text-sm font-medium text-gray-700">Calorie Goal Type</label>
              <select
                id="goalType"
                v-model="formData.calorie_goal_type"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
                <option value="lose">Lose Weight</option>
              </select>
            </div>

            <div v-if="userProfile" class="mt-6 space-y-4">
              <div class="p-4 bg-blue-50 rounded-lg">
                <h3 class="font-medium text-blue-800 mb-2">Current Calorie Goal</h3>
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

          <div class="mt-6 flex justify-end gap-2">
            <button 
              type="button"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import { updateUserProfile } from '../services/api'

const props = defineProps({
  userProfile: Object
})

const emit = defineEmits(['close', 'update'])

const activeTab = ref('personal')
const formData = ref({
  first_name: '',
  last_name: '',
  age: null,
  gender: '',
  height_cm: null,
  weight_kg: null,
  activity_level: '',
  calorie_goal_type: 'maintain'
})

// Calculate percentages for the ratio bar
const totalMacros = computed(() => {
  if (!props.userProfile) return 100
  
  return (
    props.userProfile.current_protein_goal + 
    props.userProfile.current_carbs_goal + 
    props.userProfile.current_fat_goal
  )
})

const proteinPercent = computed(() => {
  if (!props.userProfile) return 30
  return Math.round((props.userProfile.current_protein_goal / totalMacros.value) * 100)
})

const carbsPercent = computed(() => {
  if (!props.userProfile) return 45
  return Math.round((props.userProfile.current_carbs_goal / totalMacros.value) * 100)
})

const fatPercent = computed(() => {
  if (!props.userProfile) return 25
  return Math.round((props.userProfile.current_fat_goal / totalMacros.value) * 100)
})

onMounted(() => {
  if (props.userProfile) {
    formData.value = {
      first_name: props.userProfile.first_name || '',
      last_name: props.userProfile.last_name || '',
      age: props.userProfile.age || null,
      gender: props.userProfile.gender || '',
      height_cm: props.userProfile.height_cm || null,
      weight_kg: props.userProfile.weight_kg || null,
      activity_level: props.userProfile.activity_level || '',
      calorie_goal_type: 'maintain' // Default
    }
  }
})

const saveChanges = async () => {
  try {
    await updateUserProfile(formData.value)
    emit('update')
    emit('close')
  } catch (error) {
    console.error('Failed to save changes', error)
    // Handle error (show error message)
  }
}
</script>
