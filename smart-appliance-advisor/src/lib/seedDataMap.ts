/**
 * 內建 Seed Data 映射表（供消費者頁面獨立運作使用）
 * 此映射表確保消費者掃描 QR Code 後，即使沒有 IndexedDB 資料也能正常顯示
 */

import { ApplianceBasicInfo } from '@/types/appliance';

// 與 seedData.ts 同步的電器基本資訊
export const APPLIANCE_MAP: Record<string, ApplianceBasicInfo> = {
  // 注意：實際使用時，ID 會在初始化時動態生成
  // 這裡使用固定 ID 僅供參考，實際會在 QR Code 中使用動態 ID
  
  // 為了讓消費者頁面能獨立運作，我們用商品名稱的 hash 或簡短代碼作為 key
  // 在 QR Code 生成時，會將實際 ID 映射到這些固定的商品代碼
};

/**
 * 從電器 ID 或商品代碼取得電器基本資訊
 * 實際實作會在 Task 7 完成 QR Code 編碼邏輯時補充
 */
export function getApplianceInfo(idOrCode: string): ApplianceBasicInfo | null {
  // 暫時回傳 null，實際邏輯將在 Task 7 實作
  return APPLIANCE_MAP[idOrCode] || null;
}

/**
 * 產生商品代碼（用於 QR Code 精簡編碼）
 * 例如：app1, app2, app3...
 */
export function generateApplianceCode(index: number): string {
  return `app${index + 1}`;
}
