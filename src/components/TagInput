<template>
    <div>
      <input v-model="input" @keyup.enter="addTag" placeholder="Enter tags and hit enter" />
      <div class="tags">
        <span v-for="(tag, index) in modelValue" :key="index" class="tag">
          {{ tag }}
          <button @click="removeTag(index)">x</button>
        </span>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  
  const props = defineProps<{ modelValue: string[] }>()
  const emit = defineEmits(['update:modelValue'])
  
  const input = ref('')
  
  function addTag() {
    const tag = input.value.trim()
    if (tag && !props.modelValue.includes(tag)) {
      emit('update:modelValue', [...props.modelValue, tag])
    }
    input.value = ''
  }
  
  function removeTag(index: number) {
    const updated = [...props.modelValue]
    updated.splice(index, 1)
    emit('update:modelValue', updated)
  }
  </script>
  
