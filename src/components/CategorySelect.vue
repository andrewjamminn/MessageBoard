<template>
    <select v-model="modelValue">
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.name }}
      </option>
    </select>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  
  type Props = {
    modelValue: number | null
  };
  defineProps<Props>();
  const emit = defineEmits(['update:modelValue'])
  
  const categories = ref<{ id: number; name: string }[]>([])
  
  onMounted(async () => {
    const res = await fetch('/api/categories')
    categories.value = await res.json()
  })
  </script>
  
