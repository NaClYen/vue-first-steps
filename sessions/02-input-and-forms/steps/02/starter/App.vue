<script setup>
import { ref } from 'vue'

const name = ref('')
// @task-start
// 練習 2：reactive 與多種 v-model
//   - 把 name 換成一個 reactive 物件 form：{ title: '', priority: 'normal', urgent: false }
//   - 表單三個欄位：
//       文字框綁 form.title
//       下拉選單綁 form.priority（選項：low「低」、normal「普通」、high「高」）
//       勾選框綁 form.urgent，文字是「緊急」
//   - 下面的 p 顯示摘要：「標題：XXX／優先：normal／緊急：是」（urgent 為 false 時顯示「否」）
// 提示：reactive 要從 'vue' 匯入；物件的屬性直接讀寫，不用 .value
// @task-end
</script>

<template>
  <input v-model="name" placeholder="輸入你的名字" />
  <p>你好，{{ name || '同學' }}</p>
</template>
