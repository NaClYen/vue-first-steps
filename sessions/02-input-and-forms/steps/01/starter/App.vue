<script setup>
import { ref } from 'vue'

const name = ref('')
// @task-start
// 練習 1：v-model
//   - 讓輸入框和 name 連在一起：打字時 name 跟著變
//   - 下面的問候語顯示「你好，XXX」；name 是空的時候顯示「你好，同學」
// 提示：<input v-model="name" />；空字串是 falsy，可以用 name || '同學'
// @task-end
</script>

<template>
  <input placeholder="輸入你的名字" />
  <p>你好，同學</p>
</template>
