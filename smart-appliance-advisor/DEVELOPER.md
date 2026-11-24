# 智慧家電門市提案系統 - 開發者文件

**版本：** 1.0  
**最後更新：** 2026/11/17  
**目標讀者：** 開發者、系統維護人員

---

## 📖 目錄

1. [專案架構](#專案架構)
2. [技術棧](#技術棧)
3. [資料庫結構](#資料庫結構)
4. [推薦演算法](#推薦演算法)
5. [狀態管理](#狀態管理)
6. [元件庫](#元件庫)
7. [擴充指南](#擴充指南)
8. [程式碼風格](#程式碼風格)

---

## 專案架構

### 整體架構圖

```
┌─────────────────────────────────────────────────┐
│                   使用者介面層                    │
│  (Pages + Components + React Router)           │
├─────────────────────────────────────────────────┤
│                   狀態管理層                      │
│         (Zustand Stores: Proposal, App)        │
├─────────────────────────────────────────────────┤
│                   業務邏輯層                      │
│  (Services: Appliance, Proposal, Recommendation)│
├─────────────────────────────────────────────────┤
│                   資料持久層                      │
│         (Dexie.js + IndexedDB Browser)         │
└─────────────────────────────────────────────────┘
```

### 目錄結構

```
src/
├── components/              # UI 元件
│   ├── Layout/             # 佈局元件
│   │   ├── AppLayout.tsx         # 主應用佈局（導覽列）
│   │   └── TabNavigation.tsx     # 底部標籤導覽
│   ├── UI/                 # 通用 UI 元件
│   │   ├── Button.tsx            # 按鈕元件
│   │   ├── Card.tsx              # 卡片元件
│   │   ├── Modal.tsx             # 彈窗元件
│   │   └── Toast.tsx             # 通知元件
│   ├── Proposal/           # 提案相關元件
│   │   ├── ProposalCard.tsx      # 提案卡片
│   │   ├── ProposalDetailModal.tsx  # 提案詳情彈窗
│   │   ├── PackageCard.tsx       # 套餐卡片
│   │   ├── OptionCard.tsx        # 選項卡片
│   │   └── StepIndicator.tsx     # 步驟指示器
│   └── Appliance/          # 商品管理元件
│       ├── ApplianceTable.tsx    # 商品表格
│       ├── ApplianceFormModal.tsx  # 商品表單彈窗
│       └── SearchBar.tsx         # 搜尋列
├── pages/                  # 頁面元件
│   ├── ProposalWizardPage.tsx    # 問卷頁面（4 步驟）
│   ├── ProposalRecommendationPage.tsx  # 推薦結果頁面
│   ├── QRCodeGenerationPage.tsx  # QR Code 生成頁面
│   ├── ConsumerProposalPage.tsx  # 消費者提案頁面
│   ├── ApplianceManagementPage.tsx  # 商品管理頁面
│   ├── ProposalHistoryPage.tsx   # 歷史紀錄頁面
│   └── DatabaseManagementPage.tsx  # 資料庫管理頁面
├── services/               # 業務邏輯層
│   ├── applianceService.ts       # 商品 CRUD 服務
│   ├── proposalService.ts        # 提案 CRUD 服務
│   ├── recommendationEngine.ts   # 推薦演算法核心
│   └── seedService.ts            # Seed Data 初始化服務
├── stores/                 # Zustand 狀態管理
│   ├── proposalStore.ts          # 提案流程狀態
│   └── appStore.ts               # 全域應用狀態
├── db/                     # 資料庫層
│   ├── database.ts               # Dexie 資料庫定義
│   └── seedData.ts               # 15 款初始電器資料
├── types/                  # TypeScript 型別定義
│   ├── appliance.ts              # 電器型別
│   ├── proposal.ts               # 提案型別
│   └── recommendation.ts         # 推薦型別
├── lib/                    # 工具函式
│   └── proposalEncoder.ts        # 提案編碼/解碼工具
├── App.tsx                 # 主應用元件
├── main.tsx                # 應用進入點
└── index.css               # 全域樣式
```

---

## 技術棧

### 核心框架

| 技術 | 版本 | 用途 |
|------|------|------|
| **React** | 18.3.1 | UI 框架 |
| **TypeScript** | 5.5.3 | 型別安全 |
| **Vite** | 5.4.2 | 建置工具 |

### UI 與樣式

| 技術 | 版本 | 用途 |
|------|------|------|
| **Tailwind CSS** | 3.4.15 | CSS 框架 |
| **lucide-react** | 0.468.0 | 圖示庫 |
| **qrcode.react** | 4.1.0 | QR Code 生成 |

### 狀態與路由

| 技術 | 版本 | 用途 |
|------|------|------|
| **Zustand** | 5.0.2 | 狀態管理 |
| **React Router** | 7.1.1 | 路由管理 |

### 資料持久化

| 技術 | 版本 | 用途 |
|------|------|------|
| **Dexie.js** | 4.0.10 | IndexedDB 封裝 |

---

## 資料庫結構

### IndexedDB Schema

使用 **Dexie.js** 管理三張資料表：

#### 1. appliances（電器商品表）

```typescript
interface Appliance {
  id: string;                    // Primary Key (UUID 或固定 ID)
  name: string;                  // 商品名稱（品牌 + 型號）
  brand: string;                 // 品牌
  category: 'large' | 'small' | 'smart';  // 類別
  price: number;                 // 價格（新台幣）
  
  // 3D 尺寸資訊
  widthCm: number;               // 寬度（公分）
  depthCm: number;               // 深度（公分）
  heightCm: number;              // 高度（公分）
  
  // 標籤權重（0-10 分）
  tags: {
    smartMonitoring: number;     // 智慧監控
    lifeAssistance: number;      // 生活輔助
    emergencyRescue: number;     // 緊急救援
    foolproofSafety: number;     // 防呆安全
    energySaving: number;        // 節能省電
    healthyAir: number;          // 健康空淨
  };
  
  // 適用條件
  suitableFor: {
    demographics: Demographic[]; // 適合族群（陣列）
    layouts: Layout[];           // 適合格局（陣列）
  };
  
  // 進階資訊（選填）
  placementType: 'floor' | 'countertop' | 'wall' | 'ceiling';  // 放置方式
  suggestedRoom: 'living_room' | 'kitchen' | 'bedroom' | 'entrance';  // 建議房間
  clearanceCm?: number;          // 間隙距離（公分）
  themeColor?: string;           // 主題色彩（#RRGGBB）
  highlights?: string[];         // 產品亮點（陣列）
  
  // 系統欄位
  createdAt: Date;               // 建立時間
  updatedAt: Date;               // 更新時間
}
```

**索引：**
```typescript
db.appliances.id             // Primary Key
db.appliances.category       // 類別索引
db.appliances.brand          // 品牌索引
```

#### 2. proposals（提案紀錄表）

```typescript
interface Proposal {
  id: string;                    // Primary Key (UUID)
  
  // 顧客選擇條件
  customerSelections: {
    demographic: Demographic;    // 家庭組成
    layout: Layout;              // 房屋格局
    lifeNeeds: string[];         // 生活需求（陣列）
    applianceNeeds: string[];    // 電器需求（陣列）
  };
  
  // 選中的套餐
  selectedPackage: {
    packageId: string;           // 套餐 ID（UUID）
    appliances: string[];        // 電器 ID 陣列
    finalPrice: number;          // 最終總價
  };
  
  // 推薦的套餐（選填，用於分析）
  recommendedPackages?: RecommendedPackage[];
  
  // QR Code 資料（選填）
  qrCodeData?: string;
  
  // 系統欄位
  createdAt: Date;               // 建立時間
}
```

**索引：**
```typescript
db.proposals.id                           // Primary Key
db.proposals.customerSelections.demographic  // 族群索引
db.proposals.customerSelections.layout       // 格局索引
db.proposals.createdAt                    // 時間索引
```

#### 3. metadata（系統元資料表）

```typescript
interface Metadata {
  key: string;                   // Primary Key (唯一鍵)
  value: string;                 // 值
  updatedAt: Date;               // 更新時間
}
```

**用途：**
- `seed_data_version`: 紀錄 Seed Data 版本，避免重複初始化

---

### 資料庫初始化流程

```typescript
// 1. 應用啟動時自動檢查
checkAndInitializeSeedData()
  ↓
// 2. 檢查 metadata 是否有 seed_data_version
metadata.get('seed_data_version')
  ↓
// 3. 如果沒有，執行初始化
initializeSeedData()
  ↓
// 4. 寫入 15 款 Seed Data（使用固定 ID）
bulkPut(SEED_APPLIANCES)
  ↓
// 5. 記錄版本到 metadata
metadata.put({ key: 'seed_data_version', value: '1.0.0' })
```

**防重複機制：**
- 使用 `useRef` 防止 React StrictMode 雙重執行
- 使用 `bulkPut` 覆蓋式更新（基於固定 ID）
- 使用模組級別執行鎖 `isInitializing`

---

## 推薦演算法

### 核心邏輯：三層機制

推薦演算法位於 `src/services/recommendationEngine.ts`，採用三層過濾與評分機制：

#### Layer 1: 階層式過濾（Hierarchical Filtering）

根據顧客的**族群**和**格局**進行第一層篩選：

```typescript
function filterByDemographicAndLayout(
  allAppliances: Appliance[],
  demographic: Demographic,
  layout: Layout
): Appliance[] {
  return allAppliances.filter(appliance => 
    appliance.suitableFor.demographics.includes(demographic) &&
    appliance.suitableFor.layouts.includes(layout)
  );
}
```

**目的：** 排除完全不適合的電器（例如：套房不推薦大型冰箱）

#### Layer 2: 權重評分（Weighted Scoring）

針對篩選後的電器，計算與顧客需求的匹配度：

```typescript
function calculateApplianceScore(
  appliance: Appliance,
  lifeNeeds: string[],
  applianceNeeds: string[]
): number {
  const allNeeds = [...new Set([...lifeNeeds, ...applianceNeeds])];
  
  if (allNeeds.length === 0) {
    return 5; // 無特定需求，給予中等分數
  }
  
  let totalScore = 0;
  allNeeds.forEach(need => {
    const score = appliance.tags[need as keyof typeof appliance.tags] || 0;
    totalScore += score;
  });
  
  return totalScore / allNeeds.length;  // 平均分數
}
```

**評分邏輯：**
- 顧客選擇的每個需求，查找電器對應的標籤分數（0-10）
- 將所有分數加總後取平均值
- 分數越高，代表該電器越符合顧客需求

#### Layer 3: 品類平衡（Category Balancing）

根據套餐配比規則，組合電器：

```typescript
const PACKAGE_TIERS = {
  經濟安心版: { large: 1, small: 2, smart: 1 },  // 1-2-1
  智慧生活版: { large: 2, small: 3, smart: 2 },  // 2-3-2
  全屋旗艦版: { large: 2, small: 4, smart: 3 },  // 2-4-3
};
```

**選擇邏輯：**
1. 將電器依類別分組（large/small/smart）
2. 依分數排序（高 → 低）
3. 依套餐配比選擇對應數量
4. **防重複機制：** 使用 `Set<string>` 確保同一電器不會在多個套餐中重複

```typescript
function selectUniqueAppliances(
  appliances: Appliance[],
  count: number,
  usedIds: Set<string>
): Appliance[] {
  const available = appliances.filter(a => !usedIds.has(a.id));
  const selected = available.slice(0, count);
  selected.forEach(a => usedIds.add(a.id));
  return selected;
}
```

### 完整推薦流程圖

```
顧客條件（族群、格局、需求）
        ↓
[Layer 1] 階層過濾
   → 篩選適合的電器
        ↓
[Layer 2] 權重評分
   → 計算每件電器的匹配分數
        ↓
依類別分組 + 排序（large/small/smart）
        ↓
[Layer 3] 品類平衡
   → 依套餐配比選擇電器（防重複）
        ↓
生成 3 個套餐（經濟/智慧/旗艦）
        ↓
計算總價與月付金額
        ↓
回傳推薦結果
```

### 推薦結果結構

```typescript
interface RecommendedPackage {
  packageId: string;              // 套餐 ID (UUID)
  packageName: string;            // 套餐名稱
  appliances: string[];           // 電器 ID 陣列
  totalPrice: number;             // 總價
  monthlyPayment: number;         // 月付（24 期）
  matchScore: number;             // 整體匹配度（0-10）
}
```

---

## 狀態管理

使用 **Zustand** 管理全域狀態，分為兩個 Store：

### 1. proposalStore（提案流程狀態）

位於 `src/stores/proposalStore.ts`

**管理的狀態：**

```typescript
interface ProposalState {
  // 當前步驟
  currentStep: number;            // 1-4
  
  // 顧客選擇
  selections: {
    demographic: Demographic | null;
    layout: Layout | null;
    lifeNeeds: string[];
    applianceNeeds: string[];
  };
  
  // 推薦結果
  recommendedPackages: RecommendedPackage[];
  
  // 選中的套餐
  selectedPackage: RecommendedPackage | null;
  
  // Actions
  setDemographic: (demographic: Demographic) => void;
  setLayout: (layout: Layout) => void;
  setLifeNeeds: (needs: string[]) => void;
  setApplianceNeeds: (needs: string[]) => void;
  setRecommendedPackages: (packages: RecommendedPackage[]) => void;
  selectPackage: (pkg: RecommendedPackage) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetProposal: () => void;
}
```

**使用範例：**

```typescript
// 在元件中使用
import { useProposalStore } from '@/stores/proposalStore';

function QuestionnaireStep1() {
  const { selections, setDemographic, nextStep } = useProposalStore();
  
  const handleSelect = (value: Demographic) => {
    setDemographic(value);
    nextStep();
  };
  
  // ...
}
```

### 2. appStore（全域應用狀態）

位於 `src/stores/appStore.ts`

**管理的狀態：**

```typescript
interface AppState {
  // Toast 通知
  toasts: Toast[];
  
  // Actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
```

**快捷函式：**

```typescript
// 直接呼叫 showToast
import { showToast } from '@/stores/appStore';

showToast.success('提案已儲存');
showToast.error('儲存失敗');
showToast.warning('請填寫必填欄位');
showToast.info('正在載入資料');
```

---

## 元件庫

### Layout 元件

#### AppLayout.tsx
主應用佈局，包含頂部導覽列與開發者選單。

**Props：**
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
}
```

**使用範例：**
```tsx
<AppLayout>
  <YourPageContent />
</AppLayout>
```

### UI 元件

#### Toast.tsx
通知訊息元件，自動顯示與隱藏。

**特性：**
- 4 種類型：success, error, warning, info
- 自動消失（預設 3 秒）
- 堆疊顯示（多個 toast）
- 手動關閉功能

**觸發方式：**
```typescript
showToast.success('操作成功');
showToast.error('操作失敗');
```

### Proposal 元件

#### PackageCard.tsx
套餐卡片，顯示推薦套餐資訊。

**Props：**
```typescript
interface PackageCardProps {
  package: RecommendedPackage;
  appliances: Appliance[];
  onSelect: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}
```

#### ProposalCard.tsx
歷史提案卡片。

**Props：**
```typescript
interface ProposalCardProps {
  proposal: Proposal;
  onView: (proposal: Proposal) => void;
  onDelete: (proposal: Proposal) => void;
}
```

**特性：**
- 中文標籤對照（族群、格局、需求）
- 藍色/綠色標籤區分（生活需求/電器需求）

#### ProposalDetailModal.tsx
提案詳情彈窗。

**Props：**
```typescript
interface ProposalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: Proposal | null;
}
```

### Appliance 元件

#### ApplianceTable.tsx
商品表格，支援搜尋與篩選。

**Props：**
```typescript
interface ApplianceTableProps {
  appliances: Appliance[];
  onEdit: (appliance: Appliance) => void;
  onDelete: (appliance: Appliance) => void;
}
```

#### ApplianceFormModal.tsx
商品表單彈窗，用於新增/編輯。

**Props：**
```typescript
interface ApplianceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  appliance?: Appliance | null;
  onSave: (data: Partial<Appliance>) => Promise<void>;
}
```

---

## 擴充指南

### 如何新增電器到 Seed Data

1. 開啟 `src/db/seedData.ts`
2. 在 `SEED_APPLIANCES` 陣列中新增物件：

```typescript
{
  id: 'seed-appliance-16',  // 固定 ID（遞增編號）
  name: 'Sony 65吋 4K 電視',
  brand: 'Sony',
  category: 'large',
  price: 45900,
  widthCm: 145,
  depthCm: 8,
  heightCm: 85,
  tags: {
    smartMonitoring: 5,
    lifeAssistance: 7,
    emergencyRescue: 0,
    foolproofSafety: 6,
    energySaving: 7,
    healthyAir: 0,
  },
  suitableFor: {
    demographics: ['young_family', 'multi_generation'],
    layouts: ['2br', '3br', 'house'],
  },
  placementType: 'floor',
  suggestedRoom: 'living_room',
  themeColor: '#000000',
  highlights: ['4K HDR', '智慧連網', 'Google TV'],
},
```

3. 執行「開發者選單」→「重置資料庫」載入新資料

---

### 如何修改推薦邏輯

#### 1. 調整套餐配比

編輯 `src/services/recommendationEngine.ts` 中的 `PACKAGE_TIERS`：

```typescript
const PACKAGE_TIERS = {
  經濟安心版: { large: 1, small: 2, smart: 1 },  // 修改這裡
  智慧生活版: { large: 2, small: 3, smart: 2 },
  全屋旗艦版: { large: 3, small: 5, smart: 4 },  // 例如：增加數量
};
```

#### 2. 新增套餐方案

```typescript
const PACKAGE_TIERS = {
  經濟安心版: { large: 1, small: 2, smart: 1 },
  智慧生活版: { large: 2, small: 3, smart: 2 },
  全屋旗艦版: { large: 2, small: 4, smart: 3 },
  // 新增第四個套餐
  尊榮頂級版: { large: 3, small: 6, smart: 5 },
};
```

#### 3. 調整評分權重

如果想讓某些需求更重要，可以在計算分數時加權：

```typescript
function calculateApplianceScore(
  appliance: Appliance,
  lifeNeeds: string[],
  applianceNeeds: string[]
): number {
  const allNeeds = [...new Set([...lifeNeeds, ...applianceNeeds])];
  
  let totalScore = 0;
  allNeeds.forEach(need => {
    const score = appliance.tags[need as keyof typeof appliance.tags] || 0;
    
    // 特定需求加權（例如：緊急救援權重 x2）
    const weight = need === 'emergencyRescue' ? 2 : 1;
    totalScore += score * weight;
  });
  
  return totalScore / allNeeds.length;
}
```

---

### 如何新增一個頁面

#### 步驟 1：建立頁面元件

在 `src/pages/` 新增 `MyNewPage.tsx`：

```typescript
function MyNewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">我的新頁面</h1>
      {/* 頁面內容 */}
    </div>
  );
}

export default MyNewPage;
```

#### 步驟 2：加入路由

編輯 `src/App.tsx`：

```typescript
import MyNewPage from '@/pages/MyNewPage';

// 在 Routes 中新增
<Route path="/my-new-page" element={<MyNewPage />} />
```

#### 步驟 3：加入導覽連結

編輯 `src/components/Layout/AppLayout.tsx`：

```typescript
<Link to="/my-new-page" className="...">
  <Settings className="w-5 h-5 mr-2" />
  我的新頁面
</Link>
```

---

### 如何新增一個 Service 函式

#### 範例：新增「取得最貴的 N 件電器」功能

編輯 `src/services/applianceService.ts`：

```typescript
/**
 * 取得最貴的 N 件電器
 */
export async function getTopNExpensiveAppliances(n: number): Promise<Appliance[]> {
  try {
    const appliances = await db.appliances.toArray();
    
    // 依價格排序（高 → 低）
    const sorted = appliances.sort((a, b) => b.price - a.price);
    
    // 取前 N 件
    return sorted.slice(0, n);
  } catch (error) {
    console.error('取得最貴電器失敗：', error);
    throw error;
  }
}
```

使用範例：

```typescript
import { getTopNExpensiveAppliances } from '@/services/applianceService';

const top5 = await getTopNExpensiveAppliances(5);
console.log(top5);
```

---

## 程式碼風格

### TypeScript 規範

#### 1. 明確型別標註

```typescript
// ✅ 好的寫法
function calculateTotal(items: Appliance[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ 避免使用 any
function calculateTotal(items: any): any {
  // ...
}
```

#### 2. 使用 Interface 定義物件結構

```typescript
// ✅ 好的寫法
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// ❌ 避免使用匿名物件
function updateProfile(profile: { id: string; name: string; email: string }) {
  // ...
}
```

#### 3. 使用 Optional Chaining

```typescript
// ✅ 好的寫法
const userName = user?.profile?.name ?? 'Guest';

// ❌ 避免過多的 null 檢查
const userName = user && user.profile && user.profile.name || 'Guest';
```

---

### React 規範

#### 1. 函式元件優於 Class 元件

```typescript
// ✅ 好的寫法
function MyComponent() {
  return <div>Hello</div>;
}

// ❌ 避免使用 Class
class MyComponent extends React.Component {
  render() {
    return <div>Hello</div>;
  }
}
```

#### 2. 使用 Hooks

```typescript
// ✅ 好的寫法
const [count, setCount] = useState(0);
useEffect(() => {
  // ...
}, [count]);

// ❌ 避免在條件內使用 Hook
if (condition) {
  const [count, setCount] = useState(0); // 錯誤！
}
```

#### 3. Props 型別定義

```typescript
// ✅ 好的寫法
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}
```

---

### 命名規範

#### 1. 元件命名：PascalCase

```typescript
// ✅
function UserProfile() { }
function ApplianceCard() { }

// ❌
function userProfile() { }
function appliance_card() { }
```

#### 2. 函式與變數：camelCase

```typescript
// ✅
const userName = 'John';
function getUserName() { }

// ❌
const UserName = 'John';
function GetUserName() { }
```

#### 3. 常數：UPPER_SNAKE_CASE

```typescript
// ✅
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// ❌
const maxRetryCount = 3;
const apiBaseUrl = 'https://api.example.com';
```

#### 4. 型別與介面：PascalCase

```typescript
// ✅
interface UserProfile { }
type ApplianceCategory = 'large' | 'small' | 'smart';

// ❌
interface user_profile { }
type appliance_category = 'large' | 'small' | 'smart';
```

---

### 註解規範

#### 1. JSDoc 函式註解

```typescript
/**
 * 計算套餐總價
 * @param appliances - 電器陣列
 * @returns 總價（新台幣）
 */
function calculatePackagePrice(appliances: Appliance[]): number {
  return appliances.reduce((sum, a) => sum + a.price, 0);
}
```

#### 2. 區塊註解

```typescript
// ==================== 大型家電（5 款） ====================
const largeAppliances = [
  // ...
];
```

#### 3. 行內註解

```typescript
const sorted = appliances.sort((a, b) => b.price - a.price); // 依價格排序（高 → 低）
```

---

### 檔案組織規範

#### 1. Import 順序

```typescript
// 1. React 與第三方庫
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. 本地元件
import AppLayout from '@/components/Layout/AppLayout';
import PackageCard from '@/components/Proposal/PackageCard';

// 3. Services 與工具
import { getRecommendations } from '@/services/recommendationEngine';
import { formatPrice } from '@/lib/proposalEncoder';

// 4. 型別定義
import { Appliance } from '@/types/appliance';
import { Proposal } from '@/types/proposal';

// 5. 樣式（如果有）
import './styles.css';
```

#### 2. 檔案長度限制

- **頁面元件**：建議 < 500 行
- **一般元件**：建議 < 300 行
- **Service 檔案**：建議 < 400 行

超過限制時，考慮拆分成多個檔案。

---

## 常見問題

### Q: 為什麼使用 IndexedDB 而不是 LocalStorage？

**A:** 
- LocalStorage 只能存 5-10MB 字串
- IndexedDB 可存 50MB+ 結構化資料
- IndexedDB 支援索引與複雜查詢
- IndexedDB 非同步操作，不會阻塞 UI

---

### Q: 為什麼使用 Zustand 而不是 Redux？

**A:** 
- Zustand 更輕量（1KB vs 6KB）
- API 更簡單，無需 actions/reducers
- 原生 TypeScript 支援
- 適合中小型專案（本專案需求）

---

### Q: 如何除錯 Dexie 資料庫？

**A:**
1. 開啟 Chrome DevTools → Application → IndexedDB
2. 展開 `SmartApplianceDB`
3. 查看 `appliances`, `proposals`, `metadata` 表

---

### Q: 如何重置開發環境？

**A:**
```bash
# 1. 刪除 node_modules
rm -rf node_modules

# 2. 清除 npm cache
npm cache clean --force

# 3. 重新安裝
npm install

# 4. 重啟開發伺服器
npm run dev
```

---

## 延伸閱讀

- 📖 **使用手冊**（USER_GUIDE.md）- 功能操作說明
- 📖 **推薦演算法**（ALGORITHM.md）- 演算法詳細說明
- 📖 **部署指南**（DEPLOYMENT.md）- 生產環境部署
- 📖 **API 文件**（API.md）- Service Layer 介面

---

**開發愉快！有任何問題歡迎聯絡開發團隊。**
