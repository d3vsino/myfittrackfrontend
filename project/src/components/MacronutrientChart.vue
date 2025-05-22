<template>
  <div class="bg-white p-4 rounded-lg">
    <div class="h-[300px] w-full flex items-center justify-center">
      <!-- Pie chart visualization -->
      <div class="relative w-48 h-48">
        <svg viewBox="0 0 100 100" class="w-full h-full">
          <!-- Protein slice -->
          <path 
            :d="getSlicePath(0, proteinPercent)" 
            fill="#3b82f6" 
            stroke="white" 
            stroke-width="1"
          />
          <!-- Carbs slice -->
          <path 
            :d="getSlicePath(proteinPercent, proteinPercent + carbsPercent)" 
            fill="#22c55e" 
            stroke="white" 
            stroke-width="1"
          />
          <!-- Fat slice -->
          <path 
            :d="getSlicePath(proteinPercent + carbsPercent, 100)" 
            fill="#f59e0b" 
            stroke="white" 
            stroke-width="1"
          />
          <!-- Center circle (donut hole) -->
          <circle cx="50" cy="50" r="30" fill="white" />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-sm font-medium">Total</span>
          <span class="text-lg font-bold">{{ totalProtein + totalCarbs + totalFat }}g</span>
        </div>
      </div>
    </div>
    
    <div class="flex justify-center gap-4 mt-4">
      <div class="flex items-center gap-1">
        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
        <span class="text-xs">Protein ({{ proteinPercent }}%)</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <span class="text-xs">Carbs ({{ carbsPercent }}%)</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-3 h-3 rounded-full bg-amber-500"></div>
        <span class="text-xs">Fat ({{ fatPercent }}%)</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  logs: {
    type: Array,
    required: true
  }
})

// Calculate total macros from logs
const totalProtein = computed(() => {
  return props.logs.reduce((sum, log) => sum + (log.protein || 0), 0)
})

const totalCarbs = computed(() => {
  return props.logs.reduce((sum, log) => sum + (log.carbs || 0), 0)
})

const totalFat = computed(() => {
  return props.logs.reduce((sum, log) => sum + (log.fat || 0), 0)
})

const totalMacros = computed(() => totalProtein.value + totalCarbs.value + totalFat.value)

// Calculate percentages
const proteinPercent = computed(() => {
  if (totalMacros.value === 0) return 0
  return Math.round((totalProtein.value / totalMacros.value) * 100)
})

const carbsPercent = computed(() => {
  if (totalMacros.value === 0) return 0
  return Math.round((totalCarbs.value / totalMacros.value) * 100)
})

const fatPercent = computed(() => {
  if (totalMacros.value === 0) return 0
  return Math.round((totalFat.value / totalMacros.value) * 100)
})

// Function to generate SVG path for pie chart slices
const getSlicePath = (startPercent, endPercent) => {
  const start = startPercent / 100
  const end = endPercent / 100
  
  const startAngle = start * Math.PI * 2 - Math.PI / 2
  const endAngle = end * Math.PI * 2 - Math.PI / 2
  
  const x1 = 50 + 40 * Math.cos(startAngle)
  const y1 = 50 + 40 * Math.sin(startAngle)
  const x2 = 50 + 40 * Math.cos(endAngle)
  const y2 = 50 + 40 * Math.sin(endAngle)
  
  const largeArcFlag = end - start > 0.5 ? 1 : 0
  
  return `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
}
</script>
