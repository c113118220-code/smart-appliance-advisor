/**
 * 提案紀錄資料存取服務
 */

import { db } from '@/db/database';
import { Proposal, CustomerAdjustments } from '@/types/proposal';
import { v4 as uuidv4 } from 'uuid';

/**
 * 建立提案
 */
export async function createProposal(
  data: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const now = new Date();
    const newProposal: Proposal = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    await db.proposals.add(newProposal);
    console.log('✅ 建立提案成功：', newProposal.id);
    return newProposal.id;
  } catch (error) {
    console.error('建立提案失敗：', error);
    throw error;
  }
}

/**
 * 取得所有提案（依時間倒序）
 */
export async function getAllProposals(): Promise<Proposal[]> {
  try {
    return await db.proposals.orderBy('createdAt').reverse().toArray();
  } catch (error) {
    console.error('取得所有提案失敗：', error);
    throw error;
  }
}

/**
 * 根據 ID 取得單一提案
 */
export async function getProposalById(id: string): Promise<Proposal | undefined> {
  try {
    return await db.proposals.get(id);
  } catch (error) {
    console.error(`取得提案 ${id} 失敗：`, error);
    throw error;
  }
}

/**
 * 更新消費者調整紀錄
 */
export async function updateProposalAdjustments(
  id: string,
  adjustments: CustomerAdjustments
): Promise<void> {
  try {
    const existing = await db.proposals.get(id);
    if (!existing) {
      throw new Error(`提案 ${id} 不存在`);
    }
    
    const updated: Proposal = {
      ...existing,
      customerAdjustments: adjustments,
      updatedAt: new Date(),
    };
    
    await db.proposals.put(updated);
    console.log('✅ 更新提案調整紀錄成功：', id);
  } catch (error) {
    console.error('更新提案調整紀錄失敗：', error);
    throw error;
  }
}

/**
 * 更新選定套餐（消費者調整後）
 */
export async function updateSelectedPackage(
  id: string,
  appliances: string[],
  finalPrice: number
): Promise<void> {
  try {
    const existing = await db.proposals.get(id);
    if (!existing) {
      throw new Error(`提案 ${id} 不存在`);
    }
    
    const updated: Proposal = {
      ...existing,
      selectedPackage: {
        ...existing.selectedPackage,
        appliances,
        finalPrice,
      },
      updatedAt: new Date(),
    };
    
    await db.proposals.put(updated);
    console.log('✅ 更新選定套餐成功：', id);
  } catch (error) {
    console.error('更新選定套餐失敗：', error);
    throw error;
  }
}

/**
 * 刪除提案
 */
export async function deleteProposal(id: string): Promise<void> {
  try {
    await db.proposals.delete(id);
    console.log('✅ 刪除提案成功：', id);
  } catch (error) {
    console.error('刪除提案失敗：', error);
    throw error;
  }
}

/**
 * 搜尋提案（依條件篩選）
 */
export async function searchProposals(filters: {
  demographic?: string;
  layout?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<Proposal[]> {
  try {
    let proposals = await db.proposals.orderBy('createdAt').reverse().toArray();
    
    // 族群篩選
    if (filters.demographic) {
      proposals = proposals.filter(
        (p) => p.customerSelections.demographic === filters.demographic
      );
    }
    
    // 格局篩選
    if (filters.layout) {
      proposals = proposals.filter(
        (p) => p.customerSelections.layout === filters.layout
      );
    }
    
    // 日期範圍篩選
    if (filters.startDate) {
      proposals = proposals.filter(
        (p) => p.createdAt >= filters.startDate!
      );
    }
    if (filters.endDate) {
      proposals = proposals.filter(
        (p) => p.createdAt <= filters.endDate!
      );
    }
    
    return proposals;
  } catch (error) {
    console.error('搜尋提案失敗：', error);
    throw error;
  }
}
