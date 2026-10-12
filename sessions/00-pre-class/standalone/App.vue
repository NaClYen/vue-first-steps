<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <h1>單檔 HTML 檢查</h1>
  <p>如果你看得到這一頁，而且按鈕會動，這個檔案就可以用。</p>
  <button @click="count++">按我：{{ count }}</button>
</template>
