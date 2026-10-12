<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  title: '',
  priority: 'normal',
  urgent: false,
})
const submittedTitle = ref('')

function submit() {
  if (form.title.trim() === '') {
    return
  }
  submittedTitle.value = form.title
  form.title = ''
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="form.title" placeholder="標題" />
    <select v-model="form.priority">
      <option value="low">低</option>
      <option value="normal">普通</option>
      <option value="high">高</option>
    </select>
    <label><input v-model="form.urgent" type="checkbox" />緊急</label>
    <button type="submit">送出</button>
  </form>
  <p>標題：{{ form.title }}／優先：{{ form.priority }}／緊急：{{ form.urgent ? '是' : '否' }}</p>
  <p class="result">已送出：{{ submittedTitle || '尚未送出' }}</p>
</template>
