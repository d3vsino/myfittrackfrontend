<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <div class="flex flex-col items-center">
      <div class="relative w-48 h-48 flex items-center justify-center">
        <!-- Background circle -->
        <svg class="w-full h-full" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#e6e6e6" stroke-width="12" />
          <!-- Progress circle with animation -->
          <circle
            ref="progressCircle"
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#3b82f6"
            stroke-width="12"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="initialStrokeDashoffset"
            transform="rotate(-90 80 80)"
          />
        </svg>

        <!-- Text in the middle -->
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span ref="calorieText" class="text-4xl font-bold text-blue-600">{{ displayedCalories }}</span>
          <span class="text-sm text-gray-500">of {{ goal }} kcal</span>
        </div>
      </div>

      <div class="mt-4 w-full">
        <div class="flex justify-between text-sm text-gray-600 mb-1">
          <span>Consumed</span>
          <span>Goal</span>
        </div>
        <div class="flex justify-between font-medium">
          <span>{{ displayedCalories }} kcal</span>
          <span>{{ goal }} kcal</span>
        </div>

        <div class="mt-4 text-center">
          <span class="text-lg font-medium" :class="remaining > 0 ? 'text-green-600' : 'text-red-500'">
            {{ remaining > 0 ? `${remaining} kcal remaining` : 'Goal reached' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  current: {
    type: Number,
    required: true
  },
  goal: {
    type: Number,
    required: true
  }
})

const progressCircle = ref(null)
const calorieText = ref(null)
const displayedCalories = ref(0)
const previousCurrent = ref(0)

const percentage = computed(() => Math.min(Math.round((props.current / props.goal) * 100), 100))
const remaining = computed(() => props.goal - displayedCalories.value)

// Calculate the stroke dash offset for the progress circle
const radius = 70
const circumference = computed(() => 2 * Math.PI * radius)
const strokeDashoffset = computed(() => circumference.value - (percentage.value / 100) * circumference.value)
const initialStrokeDashoffset = ref(circumference.value)

// Define the animateProgress function before it's used in the watch
const animateProgress = (from, to) => {
  // Animate the number
  gsap.to(displayedCalories, {
    value: to,
    duration: 1,
    ease: "power2.out",
    onUpdate: () => {
      displayedCalories.value = Math.round(displayedCalories.value)
    }
  })
  
  // Animate the circle
  if (progressCircle.value) {
    const fromOffset = circumference.value - (from / props.goal) * circumference.value
    const toOffset = circumference.value - (to / props.goal) * circumference.value
    
    gsap.fromTo(progressCircle.value, 
      { strokeDashoffset: fromOffset },
      { 
        strokeDashoffset: toOffset, 
        duration: 1, 
        ease: "power2.out" 
      }
    )
  }
}

// Animate the progress circle when current changes
watch(() => props.current, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    previousCurrent.value = oldValue
    animateProgress(oldValue, newValue)
  }
}, { immediate: true })


onMounted(() => {
  displayedCalories.value = props.current
  initialStrokeDashoffset.value = strokeDashoffset.value
  
  // Initial animation on mount
  if (props.current > 0) {
    animateProgress(0, props.current)
  }
})
</script>
