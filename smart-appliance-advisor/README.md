# 智慧家電門市提案系統（全國電子 Digital City）

## 專案簡介

專為實體門市顧問在 iPad 上使用的智慧家電提案系統，透過引導式問卷快速配對最適合顧客的家電套餐，並產生 QR Code 供顧客掃描查看互動式提案單。

## 功能特色

- ✅ 4 步驟引導式問卷（族群、格局、生活需求、電器需求）
- ✅ 智慧套餐推薦（階層式過濾 + 權重評分 + 品類平衡）
- ✅ QR Code 提案分享（精簡編碼 + 模擬手機視角）
- ✅ 商品資料庫管理（CRUD + 搜尋篩選）
- ✅ 歷史提案紀錄查詢
- ✅ 完整 RWD 支援（電腦/iPad/手機）
- 🚧 3D 空間擬真模組（第二階段開發中）

## 技術棧

- **前端框架**: React 18 + TypeScript + Vite
- **樣式方案**: Tailwind CSS（品牌主色 #E6007E）
- **狀態管理**: Zustand
- **資料持久化**: Dexie.js (IndexedDB)
- **路由**: React Router v6
- **圖示庫**: lucide-react
- **QR Code**: qrcode.react

## 安裝與執行

```bash
# 安裝相依套件
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 專案結構

```
src/
├── components/          # UI 元件
│   ├── Layout/         # 佈局元件（導覽列、頁尾）
│   ├── UI/             # 共用 UI 元件（按鈕、卡片、Modal）
│   ├── Proposal/       # 提案相關元件
│   └── Appliance/      # 商品管理元件
├── pages/              # 頁面元件
├── services/           # 資料存取與推薦演算法
├── stores/             # Zustand 狀態管理
├── db/                 # Dexie 資料庫設定
├── types/              # TypeScript 型別定義
└── lib/                # 工具函式與常數
```

## 開發進度

- [x] Task 1: 專案初始化與基礎架構建置
- [x] Task 2: 建立 IndexedDB 資料庫與 Seed Data
- [x] Task 3: 建立 Service Layer 與推薦演算法
- [x] Task 4: 建立 Zustand 狀態管理與路由系統
- [x] Task 5: 實作引導式問卷系統（4 步驟表單）
- [x] Task 6: 實作套餐推薦結果頁與卡片展示
- [x] Task 7: 實作 QR Code 生成與消費者提案單頁面
- [x] Task 8: 實作商品資料庫管理頁面（CRUD）
- [x] Task 9: 實作歷史提案紀錄查詢頁面
- [x] Task 10: 優化 RWD 體驗與全域樣式精修
- [x] Task 11: 資料庫重置功能與 Demo 情境準備
- [x] Task 12: 文件撰寫與專案交付準備

**開發狀態：** ✅ **已完成並交付**

## 品牌色彩規範

- **主品牌色**: #E6007E（全國電子洋紅）
- **主品牌色 Hover**: #C00069
- **背景色**: #FFFFFF（白色）、#F8FAFC（淺灰）
- **文字色**: #1E293B（深炭灰）

## 📚 完整文件

### 使用者文件
- 📖 [使用手冊](./USER_GUIDE.md) - 門市顧問操作指南
- 📖 [Demo 指南](./DEMO_GUIDE.md) - 完整展示腳本

### 技術文件
- 📖 [開發者文件](./DEVELOPER.md) - 架構與技術說明
- 📖 [API 文件](./API.md) - Service Layer 介面
- 📖 [推薦演算法](./ALGORITHM.md) - 演算法詳細說明
- 📖 [RWD 優化](./RWD_OPTIMIZATION.md) - 響應式設計說明

### 部署文件
- 📖 [部署指南](./DEPLOYMENT.md) - 生產環境部署步驟
- 📖 [測試報告](./TEST_REPORT.md) - 功能與效能測試結果

### 專案文件
- 📖 [需求規格](./requirements.md) - 專案需求定義
- 📖 [交付清單](./HANDOVER_CHECKLIST.md) - 專案交付確認

## 瀏覽器支援

- Chrome 90+
- Safari 15+ (iOS)
- Edge 90+

## 授權

MIT License

## 聯絡資訊

全國電子 Digital City 智慧家電館
