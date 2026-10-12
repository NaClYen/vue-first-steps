<script setup>
import { ref } from 'vue'

const title = 'Vue 第一步'
const students = ref(12)

function add() {
  students.value++
}

function minus() {
  if (students.value > 0) {
    students.value--
  }
}
</script>

<template>
  <h1>{{ title }}</h1>
  <p>目前人數：{{ students }}</p>
  <button @click="add">加一</button>
  <button @click="minus">減一</button>
</template>
