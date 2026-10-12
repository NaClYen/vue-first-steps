<script setup>
import { ref } from 'vue'

const title = 'Vue 第一步'
const students = ref(12)
</script>

<template>
  <h1>{{ title }}</h1>
  <p>目前人數：{{ students }}</p>
  <button @click="students++">加一</button>
</template>
