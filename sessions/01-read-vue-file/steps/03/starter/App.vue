<script setup>
import { ref } from 'vue'

const title = 'Vue 第一步'
const students = ref(12)
// @task-start
// 練習 3：把動作寫成函式（這裡要用 .value）
//   - 在 script 裡寫 add()：人數加 1；按鈕改成 @click="add"
//   - 再加一個「減一」按鈕，寫成 minus()：人數減 1，但不能小於 0
// 提示：在 script 裡，ref 的值要用 students.value 讀寫
// @task-end
</script>

<template>
  <h1>{{ title }}</h1>
  <p>目前人數：{{ students }}</p>
  <button @click="students++">加一</button>
</template>
