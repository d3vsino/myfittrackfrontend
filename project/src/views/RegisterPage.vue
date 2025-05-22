<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-blue-600">MyFitLife</h1>
        <p class="text-gray-600 mt-2">Start your fitness journey today</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-center mb-6">Create Account</h2>
        
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error }}
        </div>
        
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                v-model="formData.first_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div class="space-y-2">
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                v-model="formData.last_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div class="space-y-2">
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div class="space-y-2">
            <label for="age" class="block text-sm font-medium text-gray-700">Age</label>
            <input
              id="age"
              v-model.number="formData.age"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div class="space-y-2">
            <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
            <select
              id="gender"
              v-model="formData.gender"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select gender</option>
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
                required
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
                required
              />
            </div>
          </div>
          
          <div class="space-y-2">
            <label for="activity" class="block text-sm font-medium text-gray-700">Activity Level</label>
            <select
              id="activity"
              v-model="formData.activity_level"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly active</option>
              <option value="moderate">Moderately active</option>
              <option value="active">Very active</option>
              <option value="super">Super active</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label for="goalType" class="block text-sm font-medium text-gray-700">Fitness Goal</label>
            <select
              id="goalType"
              v-model="formData.calorie_goal_type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select goal</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Weight</option>
              <option value="lose">Lose Weight</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            :disabled="loading"
          >
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Already have an account? 
            <router-link to="/login" class="text-blue-600 hover:text-blue-800">Login</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { register, login } from '../services/auth'

const router = useRouter()
const isAuthenticated = inject('isAuthenticated')

const formData = ref({
  first_name: '',
  last_name: '',
  email: '',
  username: '',
  password: '',
  age: null,
  gender: '',
  height_cm: null,
  weight_kg: null,
  activity_level: '',
  calorie_goal_type: ''
})

const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  error.value = ''
  loading.value = true
  
  try {
    // Register the user
    await register(formData.value)
    
    // Log in the user automatically
    const success = await login(formData.value.email, formData.value.password)
    
    if (success) {
      isAuthenticated.value = true
      router.push('/')
    } else {
      error.value = 'Registration successful, but login failed. Please try logging in.'
      router.push('/login')
    }
  } catch (err) {
    if (err.response && err.response.data) {
      // Format Django validation errors
      const errors = err.response.data
      const errorMessages = []
      
      for (const field in errors) {
        errorMessages.push(`${field}: ${errors[field].join(' ')}`)
      }
      
      error.value = errorMessages.join('. ')
    } else {
      error.value = 'An error occurred during registration'
    }
    console.error('Registration error:', err)
  } finally {
    loading.value = false
  }
}
</script>
