# 智慧家電門市提案系統 - API 文件

**版本：** 1.0  
**最後更新：** 2026/11/17  
**目標讀者：** 開發者

---

## 📖 目錄

1. [概述](#概述)
2. [applianceService](#applianceservice)
3. [proposalService](#proposalservice)
4. [recommendationEngine](#recommendationengine)
5. [seedService](#seedservice)
6. [資料型別](#資料型別)

---

## 概述

本系統採用 **Service Layer** 架構，所有資料存取與業務邏輯都透過 Service 模組進行。

### Service 模組清單

| 模組 | 檔案位置 | 功能 |
|------|----------|------|
| **applianceService** | `src/services/applianceService.ts` | 電器商品 CRUD |
| **proposalService** | `src/services/proposalService.ts` | 提案紀錄 CRUD |
| **recommendationEngine** | `src/services/recommendationEngine.ts` | 推薦演算法 |
| **seedService** | `src/services/seedService.ts` | 資料庫初始化 |

---

## applianceService

電器商品的 CRUD 操作。

### getAllAppliances

取得所有電器商品。

```typescript
function getAllAppliances(): Promise<Appliance[]>
```

**回傳：**
- `Promise<Appliance[]>` - 電器陣列

**範例：**
```typescript
import { getAllAppliances } from '@/services/applianceService';

const appliances = await getAllAppliances();
console.log(`共 ${appliances.length} 件電器`);
```

---

### getApplianceById

根據 ID 取得單一電器。

```typescript
function getApplianceById(id: string): Promise<Appliance | undefined>
```

**參數：**
- `id: string` - 電器 ID

**回傳：**
- `Promise<Appliance | undefined>` - 電器物件，不存在則為 undefined

**範例：**
```typescript
const appliance = await getApplianceById('seed-appliance-01');
if (appliance) {
  console.log(appliance.name);
}
```

---

### getAppliancesByIds

根據 ID 陣列批次取得電器。

```typescript
function getAppliancesByIds(ids: string[]): Promise<Appliance[]>
```

**參數：**
- `ids: string[]` - 電器 ID 陣列

**回傳：**
- `Promise<Appliance[]>` - 電器陣列

**範例：**
```typescript
const ids = ['seed-appliance-01', 'seed-appliance-02'];
const appliances = await getAppliancesByIds(ids);
```

---

### getAppliancesByCategory

根據類別篩選電器。

```typescript
function getAppliancesByCategory(
  category: ApplianceCategory
): Promise<Appliance[]>
```

**參數：**
- `category: 'large' | 'small' | 'smart'` - 電器類別

**回傳：**
- `Promise<Appliance[]>` - 該類別的電器陣列

**範例：**
```typescript
const largeAppliances = await getAppliancesByCategory('large');
console.log(`大型家電：${largeAppliances.length} 件`);
```

---

### createAppliance

新增電器。

```typescript
function createAppliance(
  applianceData: Omit<Appliance, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string>
```

**參數：**
- `applianceData` - 電器資料（不含 id, createdAt, updatedAt）

**回傳：**
- `Promise<string>` - 新建電器的 ID

**範例：**
```typescript
const id = await createAppliance({
  name: 'Samsung 洗衣機',
  brand: 'Samsung',
  category: 'large',
  price: 25900,
  widthCm: 60,
  depthCm: 65,
  heightCm: 85,
  tags: {
    smartMonitoring: 4,
    lifeAssistance: 8,
    emergencyRescue: 0,
    foolproofSafety: 7,
    energySaving: 7,
    healthyAir: 3,
  },
  suitableFor: {
    demographics: ['young_family'],
    layouts: ['2br', '3br'],
  },
  placementType: 'floor',
  suggestedRoom: 'kitchen',
});

console.log(`新建電器 ID: ${id}`);
```

---

### updateAppliance

更新電器資料。

```typescript
function updateAppliance(
  id: string,
  updates: Partial<Appliance>
): Promise<void>
```

**參數：**
- `id: string` - 電器 ID
- `updates: Partial<Appliance>` - 要更新的欄位

**回傳：**
- `Promise<void>`

**範例：**
```typescript
await updateAppliance('seed-appliance-01', {
  price: 55900, // 降價
  updatedAt: new Date(),
});
```

---

### deleteAppliance

刪除電器。

```typescript
function deleteAppliance(id: string): Promise<void>
```

**參數：**
- `id: string` - 電器 ID

**回傳：**
- `Promise<void>`

**範例：**
```typescript
await deleteAppliance('seed-appliance-01');
```

---

### searchAppliances

搜尋電器（名稱、品牌）。

```typescript
function searchAppliances(query: string): Promise<Appliance[]>
```

**參數：**
- `query: string` - 搜尋關鍵字

**回傳：**
- `Promise<Appliance[]>` - 符合的電器陣列

**邏輯：**
- 不區分大小寫
- 搜尋 `name` 和 `brand` 欄位

**範例：**
```typescript
const results = await searchAppliances('Panasonic');
console.log(`找到 ${results.length} 件 Panasonic 電器`);
```

---

## proposalService

提案紀錄的 CRUD 操作。

### getAllProposals

取得所有提案。

```typescript
function getAllProposals(): Promise<Proposal[]>
```

**回傳：**
- `Promise<Proposal[]>` - 提案陣列（依建立時間倒序）

**範例：**
```typescript
import { getAllProposals } from '@/services/proposalService';

const proposals = await getAllProposals();
console.log(`共 ${proposals.length} 筆提案`);
```

---

### getProposalById

根據 ID 取得單一提案。

```typescript
function getProposalById(id: string): Promise<Proposal | undefined>
```

**參數：**
- `id: string` - 提案 ID

**回傳：**
- `Promise<Proposal | undefined>` - 提案物件

**範例：**
```typescript
const proposal = await getProposalById('abc-123');
```

---

### createProposal

建立新提案。

```typescript
function createProposal(
  proposalData: Omit<Proposal, 'id' | 'createdAt'>
): Promise<string>
```

**參數：**
- `proposalData` - 提案資料（不含 id, createdAt）

**回傳：**
- `Promise<string>` - 新建提案的 ID

**範例：**
```typescript
const id = await createProposal({
  customerSelections: {
    demographic: 'young_family',
    layout: '2br',
    lifeNeeds: ['smartMonitoring', 'lifeAssistance'],
    applianceNeeds: ['energySaving'],
  },
  selectedPackage: {
    packageId: 'pkg-001',
    appliances: ['seed-appliance-01', 'seed-appliance-06'],
    finalPrice: 82800,
  },
  recommendedPackages: [],
  qrCodeData: '',
});
```

---

### deleteProposal

刪除提案。

```typescript
function deleteProposal(id: string): Promise<void>
```

**參數：**
- `id: string` - 提案 ID

**回傳：**
- `Promise<void>`

**範例：**
```typescript
await deleteProposal('abc-123');
```

---

### getProposalsByFilter

根據條件篩選提案。

```typescript
function getProposalsByFilter(filter: {
  demographic?: Demographic;
  layout?: Layout;
  startDate?: Date;
  endDate?: Date;
}): Promise<Proposal[]>
```

**參數：**
- `filter` - 篩選條件物件

**回傳：**
- `Promise<Proposal[]>` - 符合條件的提案陣列

**範例：**
```typescript
const proposals = await getProposalsByFilter({
  demographic: 'young_family',
  layout: '2br',
  startDate: new Date('2026-11-01'),
  endDate: new Date('2026-11-30'),
});
```

---

### searchProposals

搜尋提案（提案 ID、電器名稱）。

```typescript
function searchProposals(query: string): Promise<Proposal[]>
```

**參數：**
- `query: string` - 搜尋關鍵字

**回傳：**
- `Promise<Proposal[]>` - 符合的提案陣列

**範例：**
```typescript
const results = await searchProposals('Panasonic');
```

---

### clearAllProposals

清空所有提案。

```typescript
function clearAllProposals(): Promise<void>
```

**回傳：**
- `Promise<void>`

**範例：**
```typescript
await clearAllProposals();
```

---

## recommendationEngine

推薦演算法核心。

### getRecommendations

根據顧客條件推薦套餐。

```typescript
function getRecommendations(
  demographic: Demographic,
  layout: Layout,
  lifeNeeds: string[],
  applianceNeeds: string[]
): Promise<RecommendedPackage[]>
```

**參數：**
- `demographic: Demographic` - 家庭組成
- `layout: Layout` - 房屋格局
- `lifeNeeds: string[]` - 生活需求陣列
- `applianceNeeds: string[]` - 電器需求陣列

**回傳：**
- `Promise<RecommendedPackage[]>` - 3 個推薦套餐（經濟/智慧/旗艦）

**演算法流程：**
1. **階層過濾** - 依族群和格局篩選適合的電器
2. **權重評分** - 計算每件電器與需求的匹配度
3. **品類平衡** - 依套餐配比選擇電器（防重複）

**範例：**
```typescript
import { getRecommendations } from '@/services/recommendationEngine';

const packages = await getRecommendations(
  'young_family',
  '2br',
  ['smartMonitoring', 'lifeAssistance'],
  ['energySaving']
);

packages.forEach(pkg => {
  console.log(`${pkg.packageName}: $${pkg.totalPrice}`);
});
```

---

### calculateApplianceScore

計算單一電器的匹配分數（內部函式）。

```typescript
function calculateApplianceScore(
  appliance: Appliance,
  lifeNeeds: string[],
  applianceNeeds: string[]
): number
```

**參數：**
- `appliance: Appliance` - 電器物件
- `lifeNeeds: string[]` - 生活需求
- `applianceNeeds: string[]` - 電器需求

**回傳：**
- `number` - 匹配分數（0-10）

**邏輯：**
- 查找電器每個需求標籤的分數
- 計算平均值
- 無特定需求時回傳 5 分

---

## seedService

資料庫初始化與重置。

### checkAndInitializeSeedData

檢查並初始化 Seed Data。

```typescript
function checkAndInitializeSeedData(): Promise<void>
```

**回傳：**
- `Promise<void>`

**邏輯：**
1. 檢查 `metadata` 表是否有 `seed_data_version`
2. 如果沒有，執行 `initializeSeedData()`
3. 如果有，跳過初始化

**使用時機：**
- 應用啟動時自動執行（`main.tsx`）

**範例：**
```typescript
import { checkAndInitializeSeedData } from '@/services/seedService';

// 應用啟動時執行
checkAndInitializeSeedData()
  .then(() => console.log('✅ 資料庫已就緒'))
  .catch(err => console.error('❌ 初始化失敗', err));
```

---

### initializeSeedData

初始化 15 款 Seed Data。

```typescript
function initializeSeedData(): Promise<void>
```

**回傳：**
- `Promise<void>`

**邏輯：**
1. 使用 `bulkPut` 寫入 15 款電器（固定 ID）
2. 記錄版本到 `metadata` 表

**防重複機制：**
- 使用固定 ID（`seed-appliance-01` ~ `15`）
- 使用 `bulkPut` 覆蓋式更新
- 使用執行鎖 `isInitializing`

---

### resetDatabase

重置資料庫（刪除所有資料並重新載入 Seed Data）。

```typescript
function resetDatabase(): Promise<void>
```

**回傳：**
- `Promise<void>`

**警告：**
- ⚠️ 會刪除所有手動新增的電器
- ⚠️ 會刪除所有提案紀錄
- ⚠️ 此操作無法復原

**範例：**
```typescript
import { resetDatabase } from '@/services/seedService';

if (confirm('確定要重置資料庫嗎？')) {
  await resetDatabase();
  console.log('✅ 資料庫已重置');
}
```

---

### clearProposals

清空提案紀錄（保留電器資料）。

```typescript
function clearProposals(): Promise<void>
```

**回傳：**
- `Promise<void>`

**範例：**
```typescript
await clearProposals();
console.log('✅ 提案紀錄已清空');
```

---

### getDatabaseStats

取得資料庫統計資訊。

```typescript
function getDatabaseStats(): Promise<{
  appliances: number;
  proposals: number;
  seedVersion: string;
}>
```

**回傳：**
```typescript
{
  appliances: number;   // 電器數量
  proposals: number;    // 提案數量
  seedVersion: string;  // Seed Data 版本
}
```

**範例：**
```typescript
const stats = await getDatabaseStats();
console.log(`電器：${stats.appliances} 件`);
console.log(`提案：${stats.proposals} 筆`);
console.log(`版本：${stats.seedVersion}`);
```

---

## 資料型別

### Appliance

```typescript
interface Appliance {
  // 基本資訊
  id: string;
  name: string;
  brand: string;
  category: 'large' | 'small' | 'smart';
  price: number;
  
  // 3D 尺寸
  widthCm: number;
  depthCm: number;
  heightCm: number;
  
  // 需求標籤（0-10 分）
  tags: {
    smartMonitoring: number;
    lifeAssistance: number;
    emergencyRescue: number;
    foolproofSafety: number;
    energySaving: number;
    healthyAir: number;
  };
  
  // 適用條件
  suitableFor: {
    demographics: Demographic[];
    layouts: Layout[];
  };
  
  // 進階資訊（選填）
  placementType: 'floor' | 'countertop' | 'wall' | 'ceiling';
  suggestedRoom: 'living_room' | 'kitchen' | 'bedroom' | 'entrance';
  clearanceCm?: number;
  themeColor?: string;
  highlights?: string[];
  
  // 系統欄位
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Proposal

```typescript
interface Proposal {
  id: string;
  
  customerSelections: {
    demographic: Demographic;
    layout: Layout;
    lifeNeeds: string[];
    applianceNeeds: string[];
  };
  
  selectedPackage: {
    packageId: string;
    appliances: string[];
    finalPrice: number;
  };
  
  recommendedPackages?: RecommendedPackage[];
  qrCodeData?: string;
  
  createdAt: Date;
}
```

---

### RecommendedPackage

```typescript
interface RecommendedPackage {
  packageId: string;
  packageName: string;
  appliances: string[];
  totalPrice: number;
  monthlyPayment: number;
  matchScore: number;
}
```

---

### Demographic（家庭組成）

```typescript
type Demographic = 
  | 'senior_solo'       // 獨居長輩
  | 'young_family'      // 雙薪小家庭
  | 'multi_generation'  // 三代同堂
  | 'single_renter';    // 單身租屋族
```

---

### Layout（房屋格局）

```typescript
type Layout = 
  | 'studio'  // 套房
  | '2br'     // 兩房一廳
  | '3br'     // 三房兩廳
  | 'house';  // 透天厝
```

---

## 錯誤處理

所有 Service 函式都使用 **try-catch** 包裹，錯誤會：
1. 在 console 顯示錯誤訊息
2. 拋出 Error 供上層處理

**範例：**

```typescript
try {
  const appliances = await getAllAppliances();
} catch (error) {
  console.error('取得電器失敗：', error);
  showToast.error('載入失敗，請稍後再試');
}
```

---

## 效能注意事項

### 1. 批次操作優於單筆操作

```typescript
// ✅ 好的寫法
const appliances = await getAppliancesByIds(['id1', 'id2', 'id3']);

// ❌ 避免多次查詢
const a1 = await getApplianceById('id1');
const a2 = await getApplianceById('id2');
const a3 = await getApplianceById('id3');
```

### 2. 使用索引欄位查詢

```typescript
// ✅ 快速（使用 category 索引）
const appliances = await getAppliancesByCategory('large');

// ❌ 較慢（全表掃描）
const appliances = await getAllAppliances();
const filtered = appliances.filter(a => a.category === 'large');
```

### 3. 避免頻繁的資料庫寫入

```typescript
// ✅ 批次更新
await db.appliances.bulkPut(appliances);

// ❌ 多次單筆更新
for (const appliance of appliances) {
  await updateAppliance(appliance.id, appliance);
}
```

---

## 擴充範例

### 範例 1：新增「依品牌統計」功能

```typescript
// src/services/applianceService.ts
export async function countByBrand(): Promise<Record<string, number>> {
  const appliances = await db.appliances.toArray();
  
  const counts: Record<string, number> = {};
  appliances.forEach(a => {
    counts[a.brand] = (counts[a.brand] || 0) + 1;
  });
  
  return counts;
}
```

**使用：**
```typescript
const brandCounts = await countByBrand();
console.log(brandCounts);
// { Panasonic: 3, LG: 2, Dyson: 1, ... }
```

---

### 範例 2：新增「取得熱門電器」功能

```typescript
// src/services/proposalService.ts
export async function getPopularAppliances(limit: number = 10): Promise<string[]> {
  const proposals = await db.proposals.toArray();
  
  // 統計每件電器出現次數
  const counts: Record<string, number> = {};
  proposals.forEach(p => {
    p.selectedPackage.appliances.forEach(id => {
      counts[id] = (counts[id] || 0) + 1;
    });
  });
  
  // 排序並取前 N 名
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
  
  return sorted;
}
```

**使用：**
```typescript
const popularIds = await getPopularAppliances(5);
const popularAppliances = await getAppliancesByIds(popularIds);
console.log('熱門電器 Top 5:', popularAppliances.map(a => a.name));
```

---

## 單元測試範例

### 測試 applianceService

```typescript
// src/services/__tests__/applianceService.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createAppliance, getApplianceById } from '../applianceService';

describe('applianceService', () => {
  beforeEach(async () => {
    // 清空資料庫
    await db.appliances.clear();
  });
  
  it('應該能新增電器', async () => {
    const id = await createAppliance({
      name: 'Test 電器',
      brand: 'Test',
      category: 'large',
      price: 10000,
      // ... 其他欄位
    });
    
    expect(id).toBeDefined();
    
    const appliance = await getApplianceById(id);
    expect(appliance?.name).toBe('Test 電器');
  });
});
```

---

## 延伸閱讀

- 📖 **開發者文件**（DEVELOPER.md）- 完整架構說明
- 📖 **推薦演算法**（ALGORITHM.md）- 演算法詳細說明
- 📖 **使用手冊**（USER_GUIDE.md）- 功能操作說明

---

**祝開發順利！**
