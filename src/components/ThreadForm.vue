<template>
    <form @submit.prevent="submitThread">
      <input v-model="title" placeholder="Thread title" required />
      <textarea v-model="content" placeholder="What's on your mind?" required />
  
      <CategorySelect v-model="selectedCategoryId" />
  
      <TagInput v-model="tags" />
  
      <button type="submit">Post Thread</button>
    </form>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import CategorySelect from './CategorySelect.vue'
  import TagInput from './TagInput.vue'
  
  const title = ref('')
  const content = ref('')
  const selectedCategoryId = ref<number | null>(null)
  const tags = ref<string[]>([])
  
  async function submitThread() {
    const res = await fetch('/api/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.value,
        content: content.value,
        categoryId: selectedCategoryId.value,
        tags: tags.value,
        userId: 1, // Replace with actual logged-in user ID
      }),
    })
    const data = await res.json()
    console.log('Thread created:', data)
  }
  </script>
  
