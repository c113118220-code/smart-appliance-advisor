/**
 * 電器圖示對應輔助函式
 * 根據電器名稱關鍵字自動回傳對應的 Emoji
 */

import { ApplianceCategory } from '@/types/appliance';

/**
 * 根據電器名稱和類別回傳對應的 Emoji 圖示
 * @param name - 電器名稱
 * @param category - 電器類別 (large/small/smart)
 * @returns Emoji 圖示字串
 */
export function getApplianceIcon(name: string, category: ApplianceCategory): string {
  const lowerName = name.toLowerCase();

  // 根據名稱關鍵字對應圖示
  if (lowerName.includes('冰箱')) return '🧊';
  if (lowerName.includes('洗衣機')) return '🫧';
  if (lowerName.includes('清淨機') || lowerName.includes('空氣清淨')) return '🌬️';
  if (lowerName.includes('除濕機')) return '💧';
  if (lowerName.includes('掃地機器人') || lowerName.includes('掃地機')) return '🤖';
  if (lowerName.includes('氣炸鍋') || lowerName.includes('烤箱') || lowerName.includes('toaster')) return '🍳';
  if (lowerName.includes('電子鎖') || lowerName.includes('智慧鎖')) return '🔐';
  if (lowerName.includes('攝影機') || lowerName.includes('監視器') || lowerName.includes('camera')) return '📷';
  if (lowerName.includes('跌倒偵測') || lowerName.includes('警報器') || lowerName.includes('偵測器')) return '🚨';
  if (lowerName.includes('吹風機')) return '💨';
  if (lowerName.includes('電視') || lowerName.includes('tv')) return '📺';
  if (lowerName.includes('微波爐')) return '📟';
  if (lowerName.includes('咖啡機')) return '☕';
  if (lowerName.includes('果汁機') || lowerName.includes('調理機')) return '🥤';
  if (lowerName.includes('電風扇') || lowerName.includes('風扇')) return '🌀';
  if (lowerName.includes('暖氣') || lowerName.includes('電暖器')) return '🔥';
  if (lowerName.includes('冷氣') || lowerName.includes('空調')) return '❄️';

  // 如果沒有匹配到特定關鍵字，依照類別回傳預設圖示
  switch (category) {
    case 'large':
      return '🏠'; // 大型家電
    case 'small':
      return '⚡'; // 小型家電
    case 'smart':
      return '🔔'; // 智慧家電
    default:
      return '📦'; // 預設圖示
  }
}
