/**
 * 提案紀錄型別定義
 */

export interface CustomerSelections {
  demographic: string;           // 使用者族群
  layout: string;                // 房屋格局
  lifeNeeds: string[];           // 核心生活需求（多選）
  applianceNeeds: string[];      // 核心電器需求（多選）
}

export interface Package {
  packageId: string;
  packageName: string;           // 例如：經濟安心版
  reason: string;                // 推薦理由
  appliances: string[];          // 電器 ID 陣列
  totalPrice: number;
}

export interface CustomerAdjustments {
  addedAppliances: string[];
  removedAppliances: string[];
  adjustedAt: Date;
}

export interface Proposal {
  id: string;                    // UUID
  
  // 顧客選擇條件
  customerSelections: CustomerSelections;
  
  // 系統推薦的 3 組套餐
  recommendedPackages: Package[];
  
  // 顧客最終選定的套餐
  selectedPackage: {
    packageId: string;
    appliances: string[];        // 電器 ID 陣列（可能被消費者調整過）
    finalPrice: number;
  };
  
  // 消費者調整紀錄（掃碼後的互動）
  customerAdjustments?: CustomerAdjustments;
  
  qrCodeData: string;            // QR Code 編碼內容
  createdAt: Date;
  updatedAt: Date;
}

export interface Metadata {
  key: string;                   // 'seed_data_version' | 'last_sync' | ...
  value: any;
  updatedAt: Date;
}
