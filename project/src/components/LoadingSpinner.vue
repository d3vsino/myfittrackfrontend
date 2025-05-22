<template>
  <div class="flex justify-center items-center" :class="containerClass">
    <div class="relative flex flex-col items-center">
      <!-- Spinner -->
      <div class="w-12 h-12 rounded-full border-4 border-blue-200 animate-spin" 
           :class="size === 'small' ? 'w-8 h-8 border-2' : 'w-12 h-12 border-4'">
        <div class="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-blue-600 animate-spin"
             :class="size === 'small' ? 'border-t-2' : 'border-t-4'"></div>
      </div>
      
      <!-- Optional text -->
      <p v-if="text" class="text-center mt-3 text-gray-600">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'normal' // 'small' or 'normal'
  },
  containerClass: {
    type: String,
    default: 'py-8'
  }
})
</script>
