<script setup>
import { ref } from 'vue'

const name = ref('')
</script>

<template>
  <input v-model="name" placeholder="輸入你的名字" />
  <p>你好，{{ name || '同學' }}</p>
</template>
