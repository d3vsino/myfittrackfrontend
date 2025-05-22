<template>
  <div class="min-h-screen bg-gray-50">
    <app-header v-if="isAuthenticated" />
    <main class="pt-16 pb-20">
      <page-transition>
        <router-view :key="$route.fullPath" />
      </page-transition>
    </main>
    <mobile-navbar v-if="isAuthenticated" />
    <floating-action-button v-if="isAuthenticated" @add-food="handleAddFood" />
  </div>
</template>

<script setup>
import { onMounted, provide, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import MobileNavbar from './components/MobileNavbar.vue'
import PageTransition from './components/PageTransition.vue'
import FloatingActionButton from './components/FloatingActionButton.vue'
import { checkAuth, refreshToken, logout } from './services/auth'
import { createCalorieLog, updateCalorieLog, getCalorieLogs } from './services/api'

const isAuthenticated = ref(false)
const router = useRouter()

// Provide authentication state to all components
provide('isAuthenticated', isAuthenticated)

// Provide logout function to all components
const handleLogout = () => {
  logout()
  isAuthenticated.value = false
  router.push('/login')
}
provide('logout', handleLogout)

// Handle adding food from the floating action button
const handleAddFood = async (foodData) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]
    
    // Get current logs
    const logs = await getCalorieLogs()
    const todayLog = logs.find(log => log.date === today)
    
    if (todayLog) {
      // Update existing log
      const updatedLog = {
        ...todayLog,
        calories: todayLog.calories + foodData.calories,
        protein: (todayLog.protein || 0) + (foodData.protein || 0),
        carbs: (todayLog.carbs || 0) + (foodData.carbs || 0),
        fat: (todayLog.fat || 0) + (foodData.fat || 0),
        notes: foodData.notes ? `${todayLog.notes || ''}\n${foodData.notes}`.trim() : todayLog.notes
      }
      
      await updateCalorieLog(todayLog.id, updatedLog)
    } else {
      // Create new log
      await createCalorieLog(foodData)
    }
    
    // Refresh the current page
    if (router.currentRoute.value.path === '/') {
      router.go(0)
    }
  } catch (error) {
    console.error('Failed to add food', error)
  }
}

// Check if user is authenticated on app load
const checkAuthentication = async () => {
  const authenticated = await checkAuth()
  isAuthenticated.value = authenticated

  if (router.currentRoute.value.meta.requiresAuth && !isAuthenticated.value) {
    router.push('/login')
  }
}

// Set up token refresh interval
const setupTokenRefresh = () => {
  setInterval(async () => {
    if (isAuthenticated.value) {
      const success = await refreshToken()
      if (!success) {
        isAuthenticated.value = false
        router.push('/login')
      }
    }
  }, 1000 * 60 * 4) // Refresh token every 4 minutes
}

onMounted(async () => {
  await checkAuthentication()
  setupTokenRefresh()
})
</script>
