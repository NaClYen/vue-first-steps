<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">count: {{ count }}</button>
  <button class="reset" @click="count = 0">reset</button>
</template>
