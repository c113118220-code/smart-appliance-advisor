/**
 * 智慧套餐推薦演算法
 * 階層式過濾 + 權重評分 + 品類平衡
 */

import { Appliance, ApplianceCategory } from '@/types/appliance';
import { CustomerSelections, Package } from '@/types/proposal';
import { getAllAppliances } from './applianceService';
import { v4 as uuidv4 } from 'uuid';

// 標籤權重對應表（將使用者選擇對應到電器標籤）
const TAG_MAPPING: Record<string, keyof Appliance['tags']> = {
  smartMonitoring: 'smartMonitoring',      // 智慧監控
  lifeAssistance: 'lifeAssistance',        // 生活輔助
  emergencyRescue: 'emergencyRescue',      // 緊急救援
  foolproofSafety: 'foolproofSafety',      // 防呆安全
  energySaving: 'energySaving',            // 節能省電
  healthyAir: 'healthyAir',                // 健康空淨
};

// 套餐配置
const PACKAGE_CONFIGS = {
  economy: {
    name: '💰 經濟安心版',
    largeCount: 1,
    smallCount: 2,
    smartCount: 1,
  },
  standard: {
    name: '🏠 智慧生活版',
    largeCount: 2,
    smallCount: 3,
    smartCount: 2,
  },
  premium: {
    name: '⭐ 全屋旗艦版',
    largeCount: 2,
    smallCount: 4,
    smartCount: 3,
  },
};

/**
 * 主推薦函式：根據顧客選擇生成 3 組套餐
 */
export async function generateRecommendations(
  selections: CustomerSelections
): Promise<Package[]> {
  console.log('🎯 開始生成推薦套餐...', selections);
  
  try {
    // 取得所有電器
    const allAppliances = await getAllAppliances();
    
    // 第一層：硬性過濾
    const filteredAppliances = filterByLayoutAndDemographic(
      allAppliances,
      selections.demographic,
      selections.layout
    );
    
    console.log(`📊 第一層過濾後剩餘 ${filteredAppliances.length} 款電器`);
    
    // 第二層：權重計分
    const scoredAppliances = calculateTagScore(
      filteredAppliances,
      selections.lifeNeeds,
      selections.applianceNeeds
    );
    
    // 第三層：品類平衡組合
    const packages = generateThreePackages(scoredAppliances);
    
    console.log('✅ 套餐生成完成：', packages.map(p => p.packageName));
    
    return packages;
  } catch (error) {
    console.error('❌ 生成推薦套餐失敗：', error);
    throw error;
  }
}

/**
 * 第一層：硬性過濾（根據格局與族群）
 */
function filterByLayoutAndDemographic(
  appliances: Appliance[],
  demographic: string,
  layout: string
): Appliance[] {
  return appliances.filter((appliance) => {
    // 檢查格局適配度
    if (!appliance.suitableFor.layouts.includes(layout)) {
      return false;
    }
    
    // 檢查族群適配度
    if (!appliance.suitableFor.demographics.includes(demographic)) {
      return false;
    }
    
    // 格局特殊過濾：套房排除過大電器
    if (layout === 'studio') {
      if (appliance.widthCm > 60 || appliance.depthCm > 60) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * 第二層：權重計分
 */
function calculateTagScore(
  appliances: Appliance[],
  lifeNeeds: string[],
  applianceNeeds: string[]
): Array<Appliance & { score: number }> {
  const allNeeds = [...lifeNeeds, ...applianceNeeds];
  
  return appliances.map((appliance) => {
    let score = 0;
    
    // 計算每個需求標籤的分數加總
    allNeeds.forEach((need) => {
      const tagKey = TAG_MAPPING[need];
      if (tagKey && appliance.tags[tagKey]) {
        score += appliance.tags[tagKey];
      }
    });
    
    return {
      ...appliance,
      score,
    };
  });
}

/**
 * 第三層：品類平衡組合（生成 3 組套餐）
 */
function generateThreePackages(
  scoredAppliances: Array<Appliance & { score: number }>
): Package[] {
  // 按類別分組
  const largeAppliances = scoredAppliances
    .filter((a) => a.category === 'large')
    .sort((a, b) => b.score - a.score);
  
  const smallAppliances = scoredAppliances
    .filter((a) => a.category === 'small')
    .sort((a, b) => b.score - a.score);
  
  const smartAppliances = scoredAppliances
    .filter((a) => a.category === 'smart')
    .sort((a, b) => b.score - a.score);
  
  console.log('📦 各類別電器數量：', {
    large: largeAppliances.length,
    small: smallAppliances.length,
    smart: smartAppliances.length,
  });
  
  // 生成三組套餐（確保電器不重複）
  const packages: Package[] = [];
  const usedApplianceIds = new Set<string>();
  
  // 輔助函式：從陣列中選取未使用的電器
  const selectUniqueAppliances = (
    applianceList: Appliance[],
    count: number
  ): Appliance[] => {
    const selected: Appliance[] = [];
    for (const appliance of applianceList) {
      if (!usedApplianceIds.has(appliance.id) && selected.length < count) {
        selected.push(appliance);
        usedApplianceIds.add(appliance.id);
      }
    }
    return selected;
  };
  
  // 經濟安心版
  const economyAppliances = [
    ...selectUniqueAppliances(largeAppliances, PACKAGE_CONFIGS.economy.largeCount),
    ...selectUniqueAppliances(smallAppliances, PACKAGE_CONFIGS.economy.smallCount),
    ...selectUniqueAppliances(smartAppliances, PACKAGE_CONFIGS.economy.smartCount),
  ];
  packages.push(createPackage(
    PACKAGE_CONFIGS.economy.name,
    economyAppliances,
    '精選基礎家電組合，滿足日常生活需求，經濟實惠又安心。'
  ));
  
  // 智慧生活版
  const standardAppliances = [
    ...selectUniqueAppliances(largeAppliances, PACKAGE_CONFIGS.standard.largeCount),
    ...selectUniqueAppliances(smallAppliances, PACKAGE_CONFIGS.standard.smallCount),
    ...selectUniqueAppliances(smartAppliances, PACKAGE_CONFIGS.standard.smartCount),
  ];
  packages.push(createPackage(
    PACKAGE_CONFIGS.standard.name,
    standardAppliances,
    '智慧升級組合，結合科技與便利，打造現代化居家生活。'
  ));
  
  // 全屋旗艦版
  const premiumAppliances = [
    ...selectUniqueAppliances(largeAppliances, PACKAGE_CONFIGS.premium.largeCount),
    ...selectUniqueAppliances(smallAppliances, PACKAGE_CONFIGS.premium.smallCount),
    ...selectUniqueAppliances(smartAppliances, PACKAGE_CONFIGS.premium.smartCount),
  ];
  packages.push(createPackage(
    PACKAGE_CONFIGS.premium.name,
    premiumAppliances,
    '頂級全配方案，完整智慧家電生態系統，享受最優質的居家體驗。'
  ));
  
  return packages;
}

/**
 * 建立套餐物件
 */
function createPackage(
  packageName: string,
  appliances: Appliance[],
  reason: string
): Package {
  const totalPrice = appliances.reduce((sum, a) => sum + a.price, 0);
  const applianceIds = appliances.map((a) => a.id);
  
  return {
    packageId: uuidv4(),
    packageName,
    reason,
    appliances: applianceIds,
    totalPrice,
  };
}

/**
 * 取得套餐的詳細資訊（包含電器物件）
 */
export async function getPackageDetails(pkg: Package) {
  const { getAllAppliances } = await import('./applianceService');
  const allAppliances = await getAllAppliances();
  
  const appliances = pkg.appliances
    .map((id) => allAppliances.find((a) => a.id === id))
    .filter((a): a is Appliance => a !== undefined);
  
  return {
    ...pkg,
    applianceObjects: appliances,
  };
}

/**
 * 測試推薦演算法（用於開發驗證）
 */
export async function testRecommendationEngine() {
  console.log('🧪 開始測試推薦演算法...');
  
  // 測試案例 1：獨居長輩 + 套房 + 緊急救援 + 防呆安全
  const test1: CustomerSelections = {
    demographic: 'senior_solo',
    layout: 'studio',
    lifeNeeds: ['emergencyRescue'],
    applianceNeeds: ['foolproofSafety'],
  };
  
  console.log('\n📋 測試案例 1：獨居長輩 + 套房');
  const result1 = await generateRecommendations(test1);
  console.log('結果：', result1.map(p => ({
    name: p.packageName,
    count: p.appliances.length,
    price: p.totalPrice,
  })));
  
  // 測試案例 2：三代同堂 + 透天厝 + 智慧監控 + 健康空淨
  const test2: CustomerSelections = {
    demographic: 'multi_generation',
    layout: 'house',
    lifeNeeds: ['smartMonitoring'],
    applianceNeeds: ['healthyAir'],
  };
  
  console.log('\n📋 測試案例 2：三代同堂 + 透天厝');
  const result2 = await generateRecommendations(test2);
  console.log('結果：', result2.map(p => ({
    name: p.packageName,
    count: p.appliances.length,
    price: p.totalPrice,
  })));
  
  console.log('\n✅ 測試完成！');
  
  return { test1: result1, test2: result2 };
}
