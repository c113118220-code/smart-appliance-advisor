# 作業 4：UML 類別圖、循序圖與活動圖 (hw4.md)

## 一、 UML 類別圖 (Class Diagram)

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#FFF0F7", "primaryTextColor": "#1E293B", "primaryBorderColor": "#E6007E", "lineColor": "#64748B"}}}%%
classDiagram
    class CustomerProfile {
        +string customerName
        +string layoutType
        +string[] familyMembers
        +string[] painPoints
        +number budgetLimit
        +validateInput() boolean
    }

    class Appliance {
        +string id
        +string name
        +string brand
        +string category
        +number price
        +number widthCm
        +number depthCm
        +number heightCm
        +string[] tags
        +getDimensionsString() string
    }

    class ProposalPackage {
        +string tierName
        +Appliance[] items
        +number totalPrice
        +number matchScore
        +isWithinBudget(budget: number) boolean
    }

    class Proposal {
        +string id
        +CustomerProfile customer
        +ProposalPackage selectedPackage
        +string createdAt
        +toEncodedUrl() string
    }

    class RecommendationEngine {
        +filterByLayout(appliances: Appliance[], layout: string) Appliance[]
        +calculateScore(appliance: Appliance, profile: CustomerProfile) number
        +generateThreeTiers(profile: CustomerProfile, appliances: Appliance[]) ProposalPackage[]
    }

    class ApplianceService {
        +getAllAppliances() Promise~Appliance[]~
        +addAppliance(item: Appliance) Promise~void~
        +updateAppliance(id: string, item: Appliance) Promise~void~
        +deleteAppliance(id: string) Promise~void~
    }

    class ProposalService {
        +saveProposal(proposal: Proposal) Promise~void~
        +getHistoryProposals() Promise~Proposal[]~
        +decodeFromUrl(queryString: string) Proposal
    }

    CustomerProfile "1" --> "1..*" Proposal : "產生"
    Proposal "1" *-- "1" ProposalPackage : "包含選定方案"
    ProposalPackage "1" o-- "1..*" Appliance : "組合多款家電"
    RecommendationEngine ..> CustomerProfile : "讀取需求"
    RecommendationEngine ..> Appliance : "篩選與評分"
```
## 二、 循序圖(Sequence Diagrams)
針對 UC-01：填寫需求問卷與智慧推薦運算
```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#FFF0F7", "primaryTextColor": "#1E293B", "primaryBorderColor": "#E6007E", "actorBorder": "#E6007E", "actorBkg": "#FFF0F7", "signalColor": "#334155"}}}%%
sequenceDiagram
    actor Advisor as 門市銷售顧問
    participant WizardUI as 4步驟問卷介面 (WizardPage)
    participant Store as 狀態管理 (Zustand Store)
    participant AppSvc as 商品服務 (ApplianceService)
    participant Engine as 推薦演算法 (RecommendationEngine)
    participant DB as 本地資料庫 (IndexedDB)

    Advisor->>WizardUI: 1. 輸入格局、成員、痛點與預算
    WizardUI->>WizardUI: 2. 驗證必填欄位與預算範圍
    Advisor->>WizardUI: 3. 點擊「生成智慧推薦方案」
    WizardUI->>Store: 4. 儲存顧客需求條件 (CustomerProfile)
    WizardUI->>AppSvc: 5. 請求取得所有可用家電清單
    AppSvc->>DB: 6. 查詢 appliances 資料表
    DB-->>AppSvc: 7. 回傳家電清單 (Appliance[])
    AppSvc-->>WizardUI: 8. 回傳商品資料
    WizardUI->>Engine: 9. 傳入顧客需求與家電清單進行運算
    Engine->>Engine: 10. 空間尺寸過濾 & 痛點標籤加權計分
    Engine-->>WizardUI: 11. 回傳三階套餐 (經濟/智慧/旗艦)
    WizardUI-->>Advisor: 12. 渲染三階推薦套餐比較卡片
```
針對 UC-02 & UC-05：生成 QR Code 與顧客手機掃碼檢視
```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#FFF0F7", "primaryTextColor": "#1E293B", "primaryBorderColor": "#E6007E", "actorBorder": "#E6007E", "actorBkg": "#FFF0F7", "signalColor": "#334155"}}}%%
sequenceDiagram
    actor Advisor as 門市銷售顧問
    participant ResultUI as 套餐推薦介面 (ResultPage)
    participant PropSvc as 提案服務 (ProposalService)
    participant DB as 本地資料庫 (IndexedDB)
    actor Customer as 門市顧客 (手機端)
    participant MobileUI as 顧客提案頁面 (ConsumerProposalPage)

    Advisor->>ResultUI: 1. 點擊選定套餐之「生成 QR Code」
    ResultUI->>PropSvc: 2. 建立提案物件並請求儲存
    PropSvc->>DB: 3. 寫入 proposals 歷史紀錄資料表
    DB-->>PropSvc: 4. 確認儲存成功
    PropSvc->>PropSvc: 5. 將提案明細壓縮編碼為 URL 參數
    PropSvc-->>ResultUI: 6. 回傳分享網址字串
    ResultUI-->>Advisor: 7. 畫面渲染專屬 QR Code 圖碼
    Customer->>ResultUI: 8. 使用手機相機掃描螢幕 QR Code
    Customer->>MobileUI: 9. 開啟帶有壓縮參數的提案網址
    MobileUI->>PropSvc: 10. 請求解析 URL 參數 (decodeFromUrl)
    PropSvc-->>MobileUI: 11. 還原完整提案單與家電尺寸明細
    MobileUI-->>Customer: 12. 顯示手機版專屬智慧家電提案報表
```
針對 UC-03：家電商品新增與維護 (CRUD)
```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#FFF0F7", "primaryTextColor": "#1E293B", "primaryBorderColor": "#E6007E", "actorBorder": "#E6007E", "actorBkg": "#FFF0F7", "signalColor": "#334155"}}}%%
sequenceDiagram
    actor Advisor as 門市銷售顧問
    participant MgmtUI as 商品管理介面 (ManagementPage)
    participant ModalUI as 商品表單視窗 (ApplianceFormModal)
    participant AppSvc as 商品服務 (ApplianceService)
    participant DB as 本地資料庫 (IndexedDB)

    Advisor->>MgmtUI: 1. 點擊「新增家電商品」按鈕
    MgmtUI->>ModalUI: 2. 開啟新增商品輸入視窗
    Advisor->>ModalUI: 3. 輸入名稱、品牌、價格、寬深高尺寸與標籤
    Advisor->>ModalUI: 4. 點擊「確認儲存」
    ModalUI->>ModalUI: 5. 檢查字串非空與價格/尺寸大於 0
    alt 驗證失敗
        ModalUI-->>Advisor: 顯示欄位錯誤提示訊息
    else 驗證通過
        ModalUI->>AppSvc: 6. 呼叫 addAppliance(newAppliance)
        AppSvc->>DB: 7. 寫入 IndexedDB appliances 資料表
        DB-->>AppSvc: 8. 回傳寫入成功
        AppSvc-->>MgmtUI: 9. 通知重新載入最新商品列表
        MgmtUI-->>Advisor: 10. 關閉視窗並顯示最新家電清單
    end
```
## 三、 活動圖 (Activity Diagrams)
針對 UC-01：情境導向智慧推薦業務流程
```mermaid
flowchart TD
    Start([開始：進入智慧顧問系統]) --> Step1[步驟 1：勾選家庭成員組成]
    Step1 --> Step2[步驟 2：選擇居住空間格局]
    Step2 --> Step3[步驟 3：勾選居家生活核心需求]
    Step3 --> Step4[步驟 4：選擇重視的電器特性]
    Step4 --> CheckValid{欄位驗證是否通過?}
    
    CheckValid -- 否 --> ShowErr[顯示紅色防呆提示訊息]
    ShowErr --> Step1
    
    CheckValid -- 是 --> FilterSpace[演算法階段 1：依據空間格局過濾不適用家電]
    FilterSpace --> ScoreTags[演算法階段 2：依據成員與痛點標籤計算權重總分]
    ScoreTags --> GroupTiers[演算法階段 3：依預算與類別平衡組合三階套餐]
    GroupTiers --> DisplayCards[畫面呈現：經濟實惠 / 智慧升級 / 旗艦頂規卡片]
    DisplayCards --> End([結束])

    style Start fill:#E6007E,color:#FFFFFF,stroke:#B30062
    style End fill:#E6007E,color:#FFFFFF,stroke:#B30062
    style CheckValid fill:#FFF0F7,stroke:#E6007E,stroke-width:2px
```
針對 UC-02 & UC-05：B2B2C 跨裝置提案分享流程
```mermaid
flowchart TD
    Start([開始：顧問與顧客檢視推薦套餐]) --> SelectTier[選定其中一組最適合的套餐方案]
    SelectTier --> SaveHistory[系統自動將提案寫入本地歷史紀錄]
    SaveHistory --> EncodeURL[將提案明細與價格壓縮編碼為 URL 參數]
    EncodeURL --> GenQR[畫面生成並顯示專屬 QR Code]
    GenQR --> CanScan{顧客是否方便使用手機掃碼?}
    
    CanScan -- 是 --> ScanQR[顧客以手機相機掃描 QR Code]
    ScanQR --> OpenMobile[手機瀏覽器自動解析參數並載入行動版提案單]
    
    CanScan -- 否 --> ClickPreview[顧問點擊「模擬手機預覽」按鈕]
    ClickPreview --> OpenMobile
    
    OpenMobile --> ViewDetail[檢視推薦家電明細、寬深高尺寸與總報價]
    ViewDetail --> End([結束：完成門市提案諮詢])

    style Start fill:#E6007E,color:#FFFFFF,stroke:#B30062
    style End fill:#E6007E,color:#FFFFFF,stroke:#B30062
    style CanScan fill:#FFF0F7,stroke:#E6007E,stroke-width:2px
```
針對 UC-03：門市家電商品資料庫維護流程
```mermaid
flowchart TD
    Start([開始：進入商品管理頁面]) --> LoadList[載入 IndexedDB 現有家電清單]
    LoadList --> ChooseAction{選擇操作類型}
    
    ChooseAction -- 查詢/篩選 --> FilterSearch[輸入關鍵字或選擇家電類別過濾]
    FilterSearch --> ShowFiltered[顯示符合條件之商品卡片]
    ShowFiltered --> End([結束])
    
    ChooseAction -- 新增/編輯 --> OpenForm[開啟家電資料表單視窗]
    OpenForm --> InputFields[填寫或修改品牌、售價、三維尺寸與權重標籤]
    InputFields --> ValidateData{數值與必填欄位是否合法?}
    ValidateData -- 否 --> AlertError[提示修正錯誤欄位]
    AlertError --> InputFields
    ValidateData -- 是 --> WriteDB[寫入更新至 IndexedDB 資料庫]
    WriteDB --> RefreshUI[刷新商品列表並顯示成功通知]
    RefreshUI --> End
    
    ChooseAction -- 刪除 --> ConfirmDel{確認是否刪除此商品?}
    ConfirmDel -- 否 --> End
    ConfirmDel -- 是 --> DeleteDB[從資料庫移除該筆家電紀錄]
    DeleteDB --> RefreshUI

    style Start fill:#E6007E,color:#FFFFFF,stroke:#B30062
    style End fill:#E6007E,color:#FFFFFF,stroke:#B30062
    style ChooseAction fill:#FFF0F7,stroke:#E6007E,stroke-width:2px
    style ValidateData fill:#FFF0F7,stroke:#E6007E,stroke-width:2px
    style ConfirmDel fill:#FFF0F7,stroke:#E6007E,stroke-width:2px
```
