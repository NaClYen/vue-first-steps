# S0　課前準備（約 20 分鐘）

請在**上課要用的那台電腦、那個網路**（公司筆電、公司網路）完成，不要用手機或家裡電腦。目的是讓問題在上課前就浮現，不要到課堂上才發現打不開。

做完請回報：三個連結的截圖，加上小測驗的答案。

## 一、開三個連結（約 10 分鐘）

每個連結開起來之後，截一張圖（要看得到網址列）。**打不開也要截圖，並寫下畫面上的訊息**，這是我們想知道的。

### 連結 1：play.vuejs.org

下面這個連結會開啟一個練習用的範例。成功的樣子：左邊有程式碼，右邊預覽區有一個「按我」按鈕，按下去數字會加一。

@play standalone

### 連結 2：StackBlitz

打開 <https://vite.new/vue>。成功的樣子：幾十秒內載入完成，右邊出現一個 Vue 的範例畫面。第一次開會比較慢，請等一下。

### 連結 3：單檔 HTML

講師會給你一個 `check.html` 檔案（和這份文件放在一起）。直接用瀏覽器打開它（雙擊，或拖到瀏覽器上）。成功的樣子：看到「單檔 HTML 檢查」，按鈕會動。這個檔案不需要網路。

## 二、JavaScript 小測驗（約 10 分鐘）

這不是考試，目的是讓講師知道哪些地方要多帶一點。不要查資料，不確定就寫「不確定」。解答由講師保管。

**1.** 下面印出什麼？

```js
const a = [1, 2, 3]
console.log(a.map((n) => n * 2))
```

**2.** 下面印出什麼？

```js
const nums = [1, 2, 3, 4]
console.log(nums.filter((n) => n % 2 === 0))
```

**3.** `let` 和 `const` 差在哪裡？

**4.** 下面印出什麼？

```js
const user = { name: '小明', age: 20 }
const { name } = user
console.log(`${name} 今年 ${user.age} 歲`)
```

**5.** 下面印出什麼？

```js
const user = { name: '小明' }
user.name = '小華'
console.log(user.name)
```

這段程式會不會出錯？為什麼？

**6.** 下面印出什麼？

```js
console.log(1 === '1', 1 == '1')
```

**7.** 下面的 `console.log` 會印出什麼？

```js
function add(a, b = 10) {
  return a + b
}
console.log(add(1))
```

**8.** 下面印出什麼？

```js
const items = [{ id: 1 }, { id: 2 }]
console.log(items.find((item) => item.id === 2))
console.log(items.find((item) => item.id === 3))
```

**9.** 下面的程式，三行 `console.log` 會以什麼順序印出？

```js
console.log('A')
setTimeout(() => console.log('B'), 0)
console.log('C')
```

**10.** 用自己的話說說看：`async` / `await` 是拿來做什麼的？沒用過也可以寫「沒用過」。
