# 智慧家電門市提案系統（全國電子 Digital City）

> 🔗 **系統線上展示網址**：[(https://nkust-smart-home-appliance.netlify.app/)]((https://nkust-smart-home-appliance.netlify.app/))

## 專案簡介

本專題為大學資訊管理／軟體工程課程之實務專案，專為實體門市顧問在平板或電腦上使用的智慧家電銷售提案系統（B2B2C）。透過 4 步驟引導式問卷快速配對最適合顧客的家電套餐，並即時產生專屬 QR Code 供顧客用手機掃描查看互動式提案單與家電尺寸報價。

---

## 📋 作業 2：專案人員分工與時程規劃

### 1. 小組成員與任務分配（一人小組）

| 組員 | 角色定位 | 負責工作項目 | 產出交付物 |
| :--- | :--- | :--- | :--- |
| **本專題作者**<br>*(C113118220林余柔)* | **專題開發者（一人獨立完成）** | • 系統需求訪談、問題分析與資料庫 ERD 正規化設計<br>• 前端介面設計（RWD 響應式版面與全國電子品牌識別色系）<br>• 4 步驟引導式問卷、商品 CRUD 管理與歷史提案查詢開發<br>• 階層式權重推薦演算法與 IndexedDB 本地資料庫建置<br>• B2C 跨裝置 QR Code 網址壓縮功能、系統測試與雲端部署<br>• 撰寫系統分析設計文件（UML 圖表、甘特圖、PERT/CPM 圖） | • 完整可運作之 Web 系統原始碼<br>• Netlify 線上展示網站<br>• `README.md`、`hw3.md`、`hw4.md` |

### 2. 專題開發甘特圖（Gantt Chart）
```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#E6007E", "primaryTextColor": "#FFFFFF", "primaryBorderColor": "#B30062", "sectionBkgColor": "#FFF0F7", "altSectionBkgColor": "#FFFFFF", "taskBkgColor": "#E6007E", "taskTextColor": "#FFFFFF", "taskTextOutsideColor": "#1E293B", "taskBorderColor": "#B30062", "gridColor": "#E2E8F0"}}}%%
gantt
    title 智慧家電門市提案系統 - 專題開發甘特圖
    dateFormat YYYY-MM-DD
    axisFormat %m/%d

    section 第一階段：規劃與設計
    A. 需求訪談與分析         :a1, 2026-09-01, 7d
    B. UI 分鏡與 ERD 設計     :a2, after a1, 7d

    section 第二階段：核心開發
    C. 前端架構與問卷 UI      :b1, after a2, 10d
    D. IndexedDB 資料庫建置   :b2, after a2, 8d
    E. 推薦演算法實作         :b3, after b2, 7d

    section 第三階段：功能整合
    F. 套餐卡片與 QR Code     :c1, after b1, 7d
    G. 商品 CRUD 與歷史紀錄   :c2, after b3, 7d

    section 第四階段：測試部署
    H. 跨裝置整合測試         :d1, after c1, 5d
    I. 雲端部署與文件撰寫     :d2, after d1, 5d
```

   
   



