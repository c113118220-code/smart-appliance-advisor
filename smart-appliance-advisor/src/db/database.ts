/**
 * Dexie 資料庫設定
 */

import Dexie, { Table } from 'dexie';
import { Appliance } from '@/types/appliance';
import { Proposal, Metadata } from '@/types/proposal';

export class AppDatabase extends Dexie {
  // 宣告表格
  appliances!: Table<Appliance, string>;
  proposals!: Table<Proposal, string>;
  metadata!: Table<Metadata, string>;

  constructor() {
    super('SmartApplianceDB');
    
    // 定義資料庫 schema
    this.version(1).stores({
      appliances: 'id, category, brand, price, createdAt',
      proposals: 'id, createdAt',
      metadata: 'key'
    });
  }
}

// 建立全域資料庫實例
export const db = new AppDatabase();
