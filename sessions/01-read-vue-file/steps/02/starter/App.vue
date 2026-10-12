<script setup>
const title = 'Vue 第一步'
const students = 12
// @task-start
// 練習 2：讓畫面會動
//   - 把 students 改成 ref（記得從 'vue' 匯入 ref）
//   - 加一個「加一」按鈕，點一下人數就加 1
// 提示：@click="..." 可以直接寫一句程式；在 template 裡不用寫 .value
// @task-end
</script>

<template>
  <h1>{{ title }}</h1>
  <p>目前人數：{{ students }}</p>
</template>
