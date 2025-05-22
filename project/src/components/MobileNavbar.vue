<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 z-10">
    <div class="container max-w-md mx-auto">
      <nav class="flex justify-around">
        <router-link 
          v-for="item in navItems" 
          :key="item.name" 
          :to="item.path"
          class="flex flex-col items-center justify-center p-2 rounded-lg"
          :class="route.path === item.path ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'"
        >
          <component :is="item.icon" size="20" />
          <span class="text-xs font-medium mt-1">{{ item.name }}</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router'
import { Home, BarChart3, MessageSquare, User } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  {
    name: 'Home',
    path: '/',
    icon: Home
  },
  {
    name: 'Statistics',
    path: '/statistics',
    icon: BarChart3
  },
  {
    name: 'AI Coach',
    path: '/ai-chat',
    icon: MessageSquare
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: User
  }
]
</script>
