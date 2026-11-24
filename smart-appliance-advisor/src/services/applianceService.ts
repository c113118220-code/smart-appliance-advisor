/**
 * 電器商品資料存取服務
 * Service Layer 設計：封裝所有 IndexedDB 操作，方便未來替換為 REST API
 */

import { db } from '@/db/database';
import { Appliance } from '@/types/appliance';
import { v4 as uuidv4 } from 'uuid';

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
}

/**
 * 取得所有電器
 */
export async function getAllAppliances(): Promise<Appliance[]> {
  try {
    return await db.appliances.toArray();
  } catch (error) {
    console.error('取得所有電器失敗：', error);
    throw error;
  }
}

/**
 * 根據 ID 取得單一電器
 */
export async function getApplianceById(id: string): Promise<Appliance | undefined> {
  try {
    return await db.appliances.get(id);
  } catch (error) {
    console.error(`取得電器 ${id} 失敗：`, error);
    throw error;
  }
}

/**
 * 根據多個 ID 批次取得電器
 */
export async function getAppliancesByIds(ids: string[]): Promise<Appliance[]> {
  try {
    const appliances = await db.appliances.bulkGet(ids);
    return appliances.filter((a): a is Appliance => a !== undefined);
  } catch (error) {
    console.error('批次取得電器失敗：', error);
    throw error;
  }
}

/**
 * 新增電器
 */
export async function createAppliance(
  data: Omit<Appliance, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const now = new Date();
    const newAppliance: Appliance = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    await db.appliances.add(newAppliance);
    console.log('✅ 新增電器成功：', newAppliance.name);
    return newAppliance.id;
  } catch (error) {
    console.error('新增電器失敗：', error);
    throw error;
  }
}

/**
 * 更新電器
 */
export async function updateAppliance(
  id: string,
  data: Partial<Omit<Appliance, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  try {
    const existing = await db.appliances.get(id);
    if (!existing) {
      throw new Error(`電器 ${id} 不存在`);
    }
    
    const updated: Appliance = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    
    await db.appliances.put(updated);
    console.log('✅ 更新電器成功：', updated.name);
  } catch (error) {
    console.error('更新電器失敗：', error);
    throw error;
  }
}

/**
 * 刪除電器
 */
export async function deleteAppliance(id: string): Promise<void> {
  try {
    await db.appliances.delete(id);
    console.log('✅ 刪除電器成功：', id);
  } catch (error) {
    console.error('刪除電器失敗：', error);
    throw error;
  }
}

/**
 * 搜尋與篩選電器
 */
export async function searchAppliances(
  query: string,
  filters?: SearchFilters
): Promise<Appliance[]> {
  try {
    let appliances = await db.appliances.toArray();
    
    // 關鍵字搜尋（名稱或品牌）
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      appliances = appliances.filter(
        (a) =>
          a.name.toLowerCase().includes(lowerQuery) ||
          a.brand.toLowerCase().includes(lowerQuery)
      );
    }
    
    // 類別篩選
    if (filters?.category) {
      appliances = appliances.filter((a) => a.category === filters.category);
    }
    
    // 價格範圍篩選
    if (filters?.minPrice !== undefined) {
      appliances = appliances.filter((a) => a.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      appliances = appliances.filter((a) => a.price <= filters.maxPrice!);
    }
    
    // 品牌篩選
    if (filters?.brand) {
      appliances = appliances.filter((a) => a.brand === filters.brand);
    }
    
    return appliances;
  } catch (error) {
    console.error('搜尋電器失敗：', error);
    throw error;
  }
}

/**
 * 根據類別取得電器
 */
export async function getAppliancesByCategory(
  category: 'large' | 'small' | 'smart'
): Promise<Appliance[]> {
  try {
    return await db.appliances.where('category').equals(category).toArray();
  } catch (error) {
    console.error(`取得類別 ${category} 電器失敗：`, error);
    throw error;
  }
}

/**
 * 取得所有品牌（用於篩選器）
 */
export async function getAllBrands(): Promise<string[]> {
  try {
    const appliances = await db.appliances.toArray();
    const brands = new Set(appliances.map((a) => a.brand));
    return Array.from(brands).sort();
  } catch (error) {
    console.error('取得品牌列表失敗：', error);
    throw error;
  }
}
