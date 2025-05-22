<template>
  <header class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
    <div class="container max-w-md mx-auto px-4 py-3 flex justify-between items-center">
      <h1 class="text-xl font-extrabold text-blue-600">MyFitTrack</h1>
      <div class="flex items-center gap-2">
        <span v-if="userProfile" class="text-sm text-gray-600">
          {{ userProfile.first_name }}
        </span>
        <div class="relative">
          <button 
            class="p-2 rounded-full hover:bg-gray-100"
            @click="showMenu = !showMenu"
          >
            <User class="h-5 w-5" />
          </button>
          
          <!-- Dropdown menu -->
          <div 
            v-if="showMenu" 
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
          >
            <router-link 
              to="/profile" 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="showMenu = false"
            >
              Profile
            </router-link>
            <button 
              @click="handleLogout" 
              class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Backdrop for dropdown -->
    <div 
      v-if="showMenu" 
      class="fixed inset-0 z-10"
      @click="showMenu = false"
    ></div>
    
    <profile-settings 
      v-if="showSettings" 
      :user-profile="userProfile" 
      @close="showSettings = false"
      @update="fetchUserProfile"
    />
  </header>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { User } from 'lucide-vue-next'
import ProfileSettings from './ProfileSettings.vue'
import { getUserProfile } from '../services/api'

const showSettings = ref(false)
const showMenu = ref(false)
const userProfile = ref(null)
const logout = inject('logout')

const fetchUserProfile = async () => {
  try {
    userProfile.value = await getUserProfile()
  } catch (error) {
    console.error('Failed to fetch user profile', error)
  }
}

const handleLogout = () => {
  showMenu.value = false
  logout()
}

onMounted(() => {
  fetchUserProfile()
})
</script>
