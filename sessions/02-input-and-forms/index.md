# S2　輸入框與表單

今天結束時，你能做出一個會記住輸入內容的表單，而且看到紅字錯誤時知道往哪裡找原因。

## 今天的做法

和上一場一樣：講師示範你只看，示範完自己點連結做練習。題目在檔案最上面的註解。

## v-model：輸入框和資料連在一起

`v-model="name"` 做兩件事：

- 你打字，`name` 跟著變。
- `name` 變了，輸入框的內容也跟著變。

這叫雙向綁定。上一場的 `{{ }}` 只是「資料 → 畫面」，`v-model` 多了「畫面 → 資料」。

## 練習 1　讓輸入框和資料連起來

@play steps/01 starter

做完的差異：

@diff steps/01

## reactive：一次管理好幾個欄位

欄位多了，每個都寫一個 `ref` 很囉嗦。可以用 `reactive` 放進同一個物件：

- `ref`：包一個值，在 script 裡用 `.value`。
- `reactive`：包一個物件，直接用 `form.title`，**不用** `.value`。

文字框、下拉選單、勾選框都用 `v-model`，勾選框綁出來的是 `true` 或 `false`。

## 練習 2　一個物件、三種欄位

@play steps/02 starter

做完的差異：

@diff steps/02

## @submit.prevent：送出表單

`<form>` 預設送出時瀏覽器會整頁重新載入，畫面上的資料就沒了。`@submit.prevent="submit"` 的 `.prevent` 就是先擋掉這個預設行為，再執行 `submit`。

這一步也處理一個真實會遇到的情況：空白或全空白的標題不能送出。

## 練習 3　送出表單

@play steps/03 starter

做完的差異：

@diff steps/03

## 怎麼讀錯誤訊息

寫 Vue 一定會出錯，重點是看得懂訊息在說什麼。錯誤會出現在兩個地方：

- play.vuejs.org 預覽區**下方**的方框（橘色是警告，紅色是錯誤）。方框右上角的 × 可以關掉。
- 瀏覽器的主控台：按 `F12`，切到「Console」（主控台）分頁，同樣的訊息會在這裡，前面可能多一個 `[Vue warn]:`。

下面三種是今天最常遇到的，訊息都是在 play.vuejs.org 實際執行得到的。

### 1. 名字打錯

template 裡寫了 `{{ mesage }}`，但 script 裡宣告的是 `message`。

```text
Property "mesage" was accessed during render but is not defined on instance.
```

意思：「畫面在顯示時用到 `mesage`，但我找不到這個名字」。回去檢查拼字，兩邊要一模一樣。這是橘色警告，畫面不會壞，只是那裡是空的。

### 2. 讀取 undefined 的屬性

template 裡寫了 `{{ items.length }}`，但 `items` 還沒有值（`undefined`）。

```text
Cannot read properties of undefined (reading 'length')
```

意思：「你叫我讀 `.length`，但前面的東西是 undefined」。訊息括號裡的 `length` 是你想讀的屬性，往前找「誰是 undefined」。

### 3. script 裡忘記 .value

```js
const count = ref(0)
function add() {
  count++ // 少了 .value
}
```

```text
Assignment to constant variable.
```

這個錯誤要按下按鈕、執行到 `add` 才會出現。意思：「`count` 是 `const`，不能被重新指定」。`count` 是整個 ref 物件，要改裡面的值得寫 `count.value++`。如果是 `console.log(count)`，你會看到一個物件而不是數字，同樣是少了 `.value`。

### 讀訊息的順序

1. 先看第一行，不用看完整個堆疊。
2. 找訊息裡被引號或括號框起來的名字（`mesage`、`length`），那就是線索。
3. 回到程式碼，搜尋那個名字。

## 自我檢查

- [ ] 我說得出 `v-model` 比 `{{ }}` 多做了什麼
- [ ] 我知道 `ref` 和 `reactive` 在 script 裡的寫法差在哪
- [ ] 我知道 `.prevent` 擋掉的是什麼
- [ ] 看到紅字，我知道先看第一行、找被框起來的名字

## 今天的重點

1. `v-model` = 輸入框和資料雙向連動。
2. 多個欄位用 `reactive` 物件，不用 `.value`。
3. `@submit.prevent` 擋掉整頁重載。
4. 錯誤訊息先看第一行，找名字。

下一場：條件顯示與清單（`v-if`、`v-for`、`computed`）。
