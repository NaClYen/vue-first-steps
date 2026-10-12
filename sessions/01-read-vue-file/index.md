# S1　看懂 .vue 檔

今天結束時，你看到一個 `.vue` 檔，能說出「資料在哪、畫面在哪、按下去會發生什麼」。

## 今天的做法

- 講師示範時你只看，不用跟著打。
- 示範完，點「在 play.vuejs.org 開啟」的連結，自己做那一步的練習。題目寫在檔案最上面的註解裡。
- 做完先自己看畫面對不對，卡住就看下一段的「差異」。
- **複製網址列就是存檔**。想留住自己的版本，把網址貼到記事本。關掉分頁不會幫你存。

## 一個 .vue 檔長什麼樣子

先看今天做完的樣子，不用全懂，找出三個區塊就好。

@code steps/03/solution/App.vue

- `<script setup>`：放資料和動作（JavaScript）。
- `<template>`：放畫面（長得像 HTML）。
- 還有一個 `<style>` 放樣式，今天用不到。

`<template>` 裡可以直接用 `<script setup>` 裡宣告的名字，不用匯出、不用傳遞。

## 練習 1　用 {{ }} 把資料放進畫面

`{{ title }}` 的意思是「這裡顯示 title 現在的值」。

@play steps/01 starter

做完的差異：

@diff steps/01

## 練習 2　ref 與 @click：讓畫面會動

只是 `const` 宣告的變數，改了值畫面也不會更新。用 `ref(...)` 包起來，Vue 才會在值改變時重畫畫面。

`@click="students++"` 的意思是「按下去時執行這一句」。

@play steps/02 starter

做完的差異：

@diff steps/02

## 練習 3　在 script 裡讀寫 ref 要用 .value

規則只有一條：

- 在 `<template>` 裡直接寫 `students`。
- 在 `<script>` 裡要寫 `students.value`。

忘記寫 `.value` 是最常見的錯，下一場會教怎麼從訊息看出來。

@play steps/03 starter

做完的差異：

@diff steps/03

## 自我檢查

- [ ] 我說得出 `<script setup>` 和 `<template>` 各放什麼
- [ ] 我知道 `{{ }}` 做什麼
- [ ] 我知道什麼時候要用 `ref`
- [ ] 我記得「script 要 `.value`，template 不用」

## 今天的重點

1. `.vue` 檔 = 資料與動作（script）＋畫面（template）。
2. `{{ }}` 顯示資料；`@click` 綁動作。
3. 會變的資料用 `ref`；在 script 裡用 `.value`。

下一場：輸入框與表單（`v-model`、`reactive`、`@submit.prevent`），還有怎麼讀錯誤訊息。
