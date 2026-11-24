/**
 * 電器商品型別定義
 */

export type ApplianceCategory = 'large' | 'small' | 'smart';
export type PlacementType = 'floor' | 'countertop' | 'wall';
export type SuggestedRoom = 'living_room' | 'kitchen' | 'bedroom' | 'entrance';

export interface ApplianceTags {
  smartMonitoring: number;      // 智慧監控 (0-10)
  lifeAssistance: number;        // 生活輔助 (0-10)
  emergencyRescue: number;       // 緊急救援 (0-10)
  foolproofSafety: number;       // 防呆安全 (0-10)
  energySaving: number;          // 節能省電 (0-10)
  healthyAir: number;            // 健康空淨 (0-10)
}

export interface SuitableFor {
  demographics: string[];        // 適用族群
  layouts: string[];             // 適用格局
}

export interface Appliance {
  id: string;                    // UUID
  name: string;                  // 商品名稱
  brand: string;                 // 品牌
  category: ApplianceCategory;   // 類別
  price: number;                 // 價格（台幣）
  
  // 尺寸資訊
  widthCm: number;               // 寬度（cm）
  depthCm: number;               // 深度（cm）
  heightCm: number;              // 高度（cm）
  
  // 標籤權重
  tags: ApplianceTags;
  
  // 族群與格局適配度
  suitableFor: SuitableFor;
  
  // 3D 系統預留欄位
  placementType: PlacementType;
  suggestedRoom: SuggestedRoom;
  clearanceCm: number;           // 安全距離
  themeColor: string;            // Hex 顏色
  
  // 展示資訊
  highlights: string[];          // 核心亮點
  icon?: string;                 // Emoji 圖示（選填，自動生成）
  imageUrl?: string;             // 商品圖片（選填）
  
  createdAt: Date;
  updatedAt: Date;
}

// 用於消費者頁面的精簡版電器資訊（內建映射表）
export interface ApplianceBasicInfo {
  name: string;
  brand: string;
  price: number;
  widthCm: number;
  depthCm: number;
  heightCm: number;
  category: ApplianceCategory;
}
