# 作業 3：系統需求規格與使用案例分析 (hw3.md)

## 一、 系統需求規格

### 1. 功能性需求 (Functional Requirements)
* **FR-01 情境式顧客需求引導問卷**：系統必須提供 4 步驟漸進式表單（Stepper UI），讓門市顧問依序輸入顧客稱呼、居住空間格局、家庭成員組成、居家生活痛點及預算上限，並具備即時欄位防呆驗證機制。
* **FR-02 階層式智慧家電推薦運算**：系統必須依據顧客輸入的空間格局進行硬性條件過濾，並結合生活痛點標籤權重進行動態計分，自動生成「經濟實惠型」、「智慧升級型」與「旗艦頂規型」三種不同預算與配置等級的推薦套餐。
* **FR-03 跨裝置 QR Code 提案單生成與檢視**：系統必須將顧客選定的推薦套餐明細、機身三維尺寸與總金額壓縮編碼為 URL 參數並生成專屬 QR Code，使顧客透過手機掃描後無需下載安裝任何 App 即可檢視與列印專屬提案單。
* **FR-04 家電商品庫存與提案歷史紀錄管理 (CRUD)**：系統必須提供門市管理介面，支援家電商品的新增、查詢、修改與刪除（CRUD），以及歷史提案紀錄的關鍵字搜尋與明細檢視功能。

### 2. 非功能性需求 (Non-Functional Requirements)
* **NFR-01 效能與離線可用性 (Performance & Offline-First)**：系統採用瀏覽器本地資料庫（IndexedDB / Dexie.js）架構，推薦演算法運算與頁面切換回應時間須在 **0.5 秒內**完成，確保門市在網路訊號不穩時仍能流暢進行銷售諮詢。
* **NFR-02 跨裝置響應式介面設計 (RWD Usability)**：系統介面須全面支援響應式網頁設計（Responsive Web Design），在門市人員使用的桌面電腦（1920×1080）、平板電腦（iPad 橫向）與顧客掃碼後的智慧型手機（375px 寬度）皆能正常排版且無破版。
* **NFR-03 品牌視覺一致性與資料防呆 (Maintainability & Reliability)**：系統整體視覺須符合全國電子品牌識別規範（主色調 `#E6007E`），且所有表單輸入皆須具備前端型別檢查與數值範圍防呆（如價格與尺寸不可為負數），避免錯誤資料寫入資料庫。

---

## 二、 使用案例圖 (Use Case Diagram)

```mermaid
flowchart LR
    Advisor(["👨‍💼 門市銷售顧問"])
    Customer(["🙋‍♂️ 門市顧客"])

    subgraph System ["全國電子智慧家電銷售顧問系統"]
        UC1(["UC-01: 填寫顧客需求問卷並生成推薦套餐"])
        UC2(["UC-02: 產生並分享專屬 QR Code 提案單"])
        UC3(["UC-03: 管理門市家電商品資料庫 (CRUD)"])
        UC4(["UC-04: 查詢與檢視歷史提案紀錄"])
        UC5(["UC-05: 手機掃描檢視專屬智慧提案單"])
    end

    Advisor --> UC1
    Advisor --> UC2
    Advisor --> UC3
    Advisor --> UC4
    Customer --> UC5
    UC2 -.->|"<<include>>"| UC5

    style System fill:#FFF0F7,stroke:#E6007E,stroke-width:2px
    style UC1 fill:#FFFFFF,stroke:#E6007E,stroke-width:1.5px
    style UC2 fill:#FFFFFF,stroke:#E6007E,stroke-width:1.5px
    style UC3 fill:#FFFFFF,stroke:#E6007E,stroke-width:1.5px
    style UC4 fill:#FFFFFF,stroke:#E6007E,stroke-width:1.5px
    style UC5 fill:#FFFFFF,stroke:#E6007E,stroke-width:1.5px
