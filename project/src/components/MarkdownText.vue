<template>
  <div v-html="renderedText"></div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps({
  text: {
    type: String,
    required: true
  }
})

// Configure marked options
marked.setOptions({
  breaks: true,  // Add line breaks
  gfm: true      // GitHub Flavored Markdown
})

// Render markdown and sanitize HTML
const renderedText = computed(() => {
  return DOMPurify.sanitize(marked.parse(props.text))
})
</script>

<style scoped>
:deep(strong) {
  font-weight: bold;
}

:deep(em) {
  font-style: italic;
}

:deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

:deep(ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

:deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

:deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  font-style: italic;
  color: #6b7280;
  margin: 0.5rem 0;
}

:deep(code) {
  background-color: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: monospace;
}

:deep(pre) {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}

:deep(pre code) {
  background-color: transparent;
  padding: 0;
}

:deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

:deep(h1) {
  font-size: 1.5rem;
}

:deep(h2) {
  font-size: 1.25rem;
}

:deep(h3) {
  font-size: 1.125rem;
}

:deep(p) {
  margin-bottom: 0.5rem;
}

:deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5rem 0;
}

:deep(th), :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: left;
}

:deep(th) {
  background-color: #f3f4f6;
}
</style>
