/**
 * 提案 URL 編碼/解碼工具
 * 用於將提案資料轉換為短 URL 參數，並在消費者端解碼顯示
 */

import { Package } from '@/types/proposal';

export interface EncodedProposalData {
  /** 套餐 ID */
  pid: string;
  /** 套餐名稱 */
  pn: string;
  /** 電器 ID 陣列（逗號分隔） */
  aids: string;
  /** 總價（元） */
  tp: number;
  /** 月付金額（元） */
  mp: number;
  /** 生成時間戳 */
  ts: number;
}

/**
 * 將套餐資料編碼為 URL 查詢參數
 */
export function encodeProposalToUrl(pkg: Package): string {
  const data: EncodedProposalData = {
    pid: pkg.packageId,
    pn: pkg.packageName,
    aids: pkg.appliances.join(','),
    tp: pkg.totalPrice,
    mp: Math.ceil(pkg.totalPrice / 24), // 24 期分期月付金額（無息）
    ts: Date.now(),
  };

  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    params.append(key, value.toString());
  });

  return params.toString();
}

/**
 * 從 URL 查詢參數解碼套餐資料
 */
export function decodeProposalFromUrl(urlParams: string): EncodedProposalData | null {
  try {
    const params = new URLSearchParams(urlParams);

    const data: EncodedProposalData = {
      pid: params.get('pid') || '',
      pn: params.get('pn') || '',
      aids: params.get('aids') || '',
      tp: parseInt(params.get('tp') || '0', 10),
      mp: parseInt(params.get('mp') || '0', 10),
      ts: parseInt(params.get('ts') || '0', 10),
    };

    // 基本驗證
    if (!data.pid || !data.aids || data.tp <= 0) {
      console.error('提案資料不完整或無效');
      return null;
    }

    return data;
  } catch (error) {
    console.error('解碼提案資料失敗：', error);
    return null;
  }
}

/**
 * 產生完整的消費者提案頁面 URL
 */
export function generateConsumerProposalUrl(pkg: Package, baseUrl?: string): string {
  const encoded = encodeProposalToUrl(pkg);
  const base = baseUrl || window.location.origin;
  return `${base}/consumer?${encoded}`;
}

/**
 * 格式化價格顯示（加上千分位逗號）
 */
export function formatPrice(price?: number): string {
  // 防呆機制：若為 undefined、null 或非數字，預設為 0
  const safePrice = price ?? 0;
  if (isNaN(safePrice)) {
    return '0';
  }
  return safePrice.toLocaleString('zh-TW');
}
