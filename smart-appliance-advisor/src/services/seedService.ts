/**
 * Seed Data 初始化與重置服務
 */

import { db } from '@/db/database';
import { generateSeedAppliances } from '@/db/seedData';
import { Metadata } from '@/types/proposal';

const SEED_DATA_VERSION = '1.0.0';

/**
 * 初始化執行鎖，防止 React StrictMode 雙重執行
 */
let isInitializing = false;

/**
 * 檢查是否需要初始化 Seed Data
 */
export async function checkAndInitializeSeedData(): Promise<void> {
  // 防止重複執行
  if (isInitializing) {
    console.log('⏳ 初始化正在進行中，跳過重複執行');
    return;
  }

  try {
    isInitializing = true;
    
    // 檢查 metadata 表中是否有 seed_data_version
    const seedVersion = await db.metadata.get('seed_data_version');
    
    if (!seedVersion) {
      console.log('🌱 首次啟動，開始載入 Seed Data...');
      await initializeSeedData();
      console.log('✅ Seed Data 載入完成！');
    } else {
      console.log(`✅ Seed Data 已存在（版本 ${seedVersion.value}）`);
    }
  } catch (error) {
    console.error('❌ 檢查 Seed Data 時發生錯誤：', error);
    throw error;
  } finally {
    isInitializing = false;
  }
}

/**
 * 初始化 Seed Data（載入 15 款家電）
 * 使用 bulkPut 覆蓋式更新，確保固定 ID 不會重複
 */
export async function initializeSeedData(): Promise<void> {
  try {
    const appliances = generateSeedAppliances();
    
    // 使用 bulkPut 取代 bulkAdd，基於固定 ID 覆蓋更新
    await db.appliances.bulkPut(appliances);
    
    // 記錄 Seed Data 版本
    const metadata: Metadata = {
      key: 'seed_data_version',
      value: SEED_DATA_VERSION,
      updatedAt: new Date(),
    };
    await db.metadata.put(metadata); // 使用 put 確保可覆蓋
    
    console.log(`✅ 成功載入 ${appliances.length} 款智慧家電（使用固定 ID）`);
  } catch (error) {
    console.error('❌ 初始化 Seed Data 失敗：', error);
    throw error;
  }
}

/**
 * 重置資料庫（刪除所有資料並重新載入 Seed Data）
 * 強化版：確保先清空再寫入
 */
export async function resetDatabase(): Promise<void> {
  // 防止重複執行
  if (isInitializing) {
    console.log('⏳ 初始化正在進行中，無法重置');
    return;
  }

  try {
    isInitializing = true;
    console.log('🔄 開始重置資料庫...');
    
    // 1. 先清空所有表格
    await db.appliances.clear();
    await db.proposals.clear();
    await db.metadata.clear();
    console.log('✅ 資料表已清空');
    
    // 2. 重新載入 Seed Data（使用 bulkPut）
    const appliances = generateSeedAppliances();
    await db.appliances.bulkPut(appliances);
    
    // 3. 記錄版本
    const metadata: Metadata = {
      key: 'seed_data_version',
      value: SEED_DATA_VERSION,
      updatedAt: new Date(),
    };
    await db.metadata.put(metadata);
    
    console.log(`✅ 資料庫重置完成！重新載入 ${appliances.length} 款電器`);
  } catch (error) {
    console.error('❌ 重置資料庫失敗：', error);
    throw error;
  } finally {
    isInitializing = false;
  }
}

/**
 * 清空提案紀錄（保留電器資料）
 */
export async function clearProposals(): Promise<void> {
  try {
    console.log('🗑️ 清空提案紀錄...');
    await db.proposals.clear();
    console.log('✅ 提案紀錄已清空');
  } catch (error) {
    console.error('❌ 清空提案紀錄失敗：', error);
    throw error;
  }
}

/**
 * 取得資料庫統計資訊
 */
export async function getDatabaseStats() {
  try {
    const applianceCount = await db.appliances.count();
    const proposalCount = await db.proposals.count();
    const seedVersion = await db.metadata.get('seed_data_version');
    
    return {
      appliances: applianceCount,
      proposals: proposalCount,
      seedVersion: seedVersion?.value || 'N/A',
    };
  } catch (error) {
    console.error('❌ 取得資料庫統計資訊失敗：', error);
    throw error;
  }
}
