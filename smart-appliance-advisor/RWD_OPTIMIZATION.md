# RWD 響應式設計優化指南

## 📱 支援裝置與斷點

### Tailwind 斷點設定
```
xs:  475px   (小型手機橫向模式)
sm:  640px   (手機橫向 / 小平板直向)
md:  768px   (iPad 直向)
lg:  1024px  (iPad 橫向 / 小筆電)
xl:  1280px  (桌面螢幕)
2xl: 1536px  (大螢幕)
```

### 目標裝置
- **手機** (320px - 640px): iPhone SE, iPhone 13/14, Android 手機
- **iPad** (768px - 1024px): iPad, iPad Air, iPad Pro
- **桌面** (1280px+): MacBook, Windows 筆電/桌機

---

## 🎨 全域 RWD 優化項目

### 1. 觸控友善設計
- ✅ 手機版按鈕最小尺寸 **48×48px** (WCAG 2.1 AA 標準)
- ✅ 平板版按鈕最小尺寸 **44×44px**
- ✅ 表單輸入框 `font-size: 16px` (防止 iOS 自動縮放)
- ✅ 水平滑動使用 `-webkit-overflow-scrolling: touch`

### 2. 響應式內距
```css
手機版 (sm):  px-4 py-4   (16px)
平板版 (md):  px-6 py-6   (24px)
桌面版 (lg):  px-8 py-8   (32px)
```

### 3. 響應式字體大小
```css
手機版:
  h1: 1.875rem (30px)
  h2: 1.5rem   (24px)
  h3: 1.25rem  (20px)

桌面版:
  h1: 2.25rem  (36px)
  h2: 1.875rem (30px)
  h3: 1.5rem   (24px)
```

### 4. 響應式網格佈局
```css
手機版:  grid-cols-1
平板版:  grid-cols-2 (md:grid-cols-2)
桌面版:  grid-cols-3 (lg:grid-cols-3)
```

---

## 📄 各頁面 RWD 檢查清單

### ✅ 智慧提案頁面 (ProposalWizardPage)
- [x] 步驟指示器：手機版垂直排列
- [x] 選項卡片：手機版 1 欄，平板 2 欄，桌面 2-4 欄
- [x] 按鈕：手機版全寬 (w-full)
- [x] 多選標籤：自動換行 (flex-wrap)

### ✅ 推薦結果頁面 (ProposalRecommendationPage)
- [x] 套餐卡片：手機版 1 欄，平板 2 欄，桌面 3 欄
- [x] 價格資訊：手機版堆疊，桌面版水平排列
- [x] 底部按鈕：手機版堆疊，桌面版水平排列

### ✅ QR Code 頁面 (QRCodeGenerationPage)
- [x] 雙欄佈局：手機版堆疊 (grid-cols-1)，桌面版並排 (lg:grid-cols-2)
- [x] QR Code 尺寸：手機版 240px，桌面版 280px
- [x] 按鈕：手機版全寬 (w-full)

### ✅ 消費者提案頁面 (ConsumerProposalPage)
- [x] 全螢幕設計 (min-h-screen)
- [x] 手機優先：最大寬度 max-w-2xl
- [x] 電器卡片：自適應高度
- [x] CTA 按鈕：固定底部 (手機版)

### ✅ 商品管理頁面 (ApplianceManagementPage)
- [x] 搜尋列：手機版堆疊，桌面版水平排列
- [x] 表格：水平滾動 (overflow-x-auto)
- [x] Modal：手機版全屏 (w-full h-full)，桌面版置中 (max-w-4xl)
- [x] 表單網格：手機版 1 欄，桌面版 2 欄 (md:grid-cols-2)

### ✅ 歷史紀錄頁面 (ProposalHistoryPage)
- [x] 篩選列：手機版堆疊 (flex-wrap)，桌面版水平排列
- [x] 提案卡片：手機版 1 欄，平板 2 欄，桌面 3 欄
- [x] Modal：手機版全屏，桌面版置中

---

## 🎯 RWD 測試檢查點

### 手機版測試 (375px - iPhone 13)
- [ ] 所有文字清晰可讀 (最小 14px)
- [ ] 按鈕易於點擊 (最小 48×48px)
- [ ] 沒有水平滾動條 (除了表格)
- [ ] 表單輸入框不會觸發縮放
- [ ] 底部導覽列不遮擋內容
- [ ] Modal 可正常關閉

### 平板版測試 (768px - iPad)
- [ ] 雙欄/三欄佈局正常顯示
- [ ] 觸控操作流暢
- [ ] 表格可水平滾動
- [ ] Modal 大小適中 (不會太小或太大)

### 桌面版測試 (1280px+)
- [ ] 內容不會過寬 (max-w 限制)
- [ ] 滑鼠懸停效果正常
- [ ] 所有功能可用鍵盤操作
- [ ] 視覺層次清晰

### 橫向模式測試
- [ ] 手機橫向 (667×375): 導覽列不遮擋內容
- [ ] 平板橫向 (1024×768): 佈局切換正確

---

## 🔧 常用 RWD 類別組合

### 響應式容器
```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
```

### 響應式網格
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
```

### 響應式字體
```tsx
<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
```

### 響應式按鈕
```tsx
<button className="w-full sm:w-auto px-6 py-3">
```

### 響應式堆疊 → 水平
```tsx
<div className="flex flex-col sm:flex-row gap-4">
```

### 響應式顯示/隱藏
```tsx
<div className="hidden md:block">桌面版內容</div>
<div className="md:hidden">手機版內容</div>
```

---

## ♿ 無障礙 (Accessibility) 改進

### 已實作項目
- ✅ 焦點可見性 (focus-visible outline)
- ✅ 鍵盤導航支援
- ✅ ARIA 標籤 (待補強)
- ✅ 顏色對比度符合 WCAG AA 標準
- ✅ 觸控目標大小符合 WCAG 2.1

### 待改進項目
- [ ] 添加跳過導航連結 (Skip to main content)
- [ ] 螢幕閱讀器優化 (aria-label, role)
- [ ] 鍵盤快捷鍵提示
- [ ] 表單錯誤訊息朗讀

---

## 🎨 視覺優化項目

### 已完成
- ✅ 全國電子品牌色 (#E6007E) 一致性
- ✅ 卡片懸停效果 (hover:shadow-xl)
- ✅ 平滑動畫過渡 (transition-all duration-200)
- ✅ 載入狀態指示器 (spinner)
- ✅ Toast 通知系統
- ✅ 選中狀態視覺回饋

### 微調項目
- ✅ 滾動條美化 (webkit-scrollbar)
- ✅ 安全區域支持 (iOS notch)
- ✅ 防止水平滾動 (overflow-x: hidden)
- ✅ 觸控高亮顏色 (tap-highlight-color)

---

## 📊 效能優化

### 圖片優化
- 使用 Emoji 圖示 (無需載入圖片)
- SVG 圖示 (lucide-react)

### CSS 優化
- Tailwind JIT 模式 (按需生成)
- PurgeCSS 自動移除未使用樣式

### JavaScript 優化
- React.lazy() 動態載入 (未來可加入)
- 避免不必要的 re-render (React.memo)

---

## 🧪 測試工具建議

### 瀏覽器 DevTools
- Chrome DevTools Device Toolbar
- Firefox Responsive Design Mode
- Safari Web Inspector

### 線上工具
- [Responsive Design Checker](https://responsivedesignchecker.com/)
- [BrowserStack](https://www.browserstack.com/) (跨裝置測試)
- [PageSpeed Insights](https://pagespeed.web.dev/) (效能測試)

### 無障礙測試
- [WAVE](https://wave.webaim.org/) (WebAIM)
- [axe DevTools](https://www.deque.com/axe/devtools/) (Chrome Extension)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) (Chrome 內建)

---

## 📝 開發者備註

### 重要原則
1. **手機優先** (Mobile-first approach)
2. **漸進增強** (Progressive enhancement)
3. **觸控優先** (Touch-first design)
4. **效能優先** (Performance matters)

### 常見陷阱
- ❌ 不要用固定寬度 (width: 500px)
- ❌ 不要用絕對定位破壞流動佈局
- ❌ 不要忘記測試橫向模式
- ❌ 不要假設使用者有滑鼠 (可能是觸控)

### 最佳實踐
- ✅ 使用相對單位 (%, rem, em)
- ✅ 使用 Flexbox / Grid 佈局
- ✅ 提供視覺回饋 (hover, active, focus)
- ✅ 保持一致的間距系統

---

**最後更新**: 2026/11/17  
**版本**: 1.0  
**負責人**: 全國電子 Digital City 開發團隊
