<script setup>
import { reactive } from 'vue'

const form = reactive({
  title: '',
  priority: 'normal',
  urgent: false,
})
// @task-start
// 練習 3：送出表單
//   - 把三個欄位包進 <form @submit.prevent="submit">，加一個「送出」按鈕（type="submit"）
//   - 再宣告 submittedTitle = ref('')，在畫面用 <p class="result"> 顯示「已送出：XXX」，
//     還沒送出過時顯示「尚未送出」
//   - 寫 submit()：標題是空白（含全空白）就直接結束，什麼都不做；
//     否則把 form.title 存進 submittedTitle，再把 form.title 清成空字串
// 提示：.prevent 會擋掉瀏覽器預設的整頁重新載入；去掉空白用 form.title.trim()
// @task-end
</script>

<template>
  <input v-model="form.title" placeholder="標題" />
  <select v-model="form.priority">
    <option value="low">低</option>
    <option value="normal">普通</option>
    <option value="high">高</option>
  </select>
  <label><input v-model="form.urgent" type="checkbox" />緊急</label>
  <p>標題：{{ form.title }}／優先：{{ form.priority }}／緊急：{{ form.urgent ? '是' : '否' }}</p>
</template>
