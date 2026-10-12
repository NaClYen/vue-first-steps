<script setup>
import { reactive } from 'vue'

const form = reactive({
  title: '',
  priority: 'normal',
  urgent: false,
})
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
