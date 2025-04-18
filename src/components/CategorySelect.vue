<template>
    <select v-model="modelValue">
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.name }}
      </option>
    </select>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  
  const props = defineProps<{ modelValue: number | null }>()
  const emit = defineEmits(['update:modelValue'])
  
  const categories = ref<{ id: number; name: string }[]>([])
  
  onMounted(async () => {
    const res = await fetch('/api/categories')
    categories.value = await res.json()
  })
  </script>
  
