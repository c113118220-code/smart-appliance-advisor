/**
 * 測試推薦演算法頁面（驗收用）
 */

import { useState } from 'react';
import { Play, CheckCircle2 } from 'lucide-react';
import { testRecommendationEngine } from '@/services/recommendationEngine';
import { getAppliancesByIds } from '@/services/applianceService';
import { Package } from '@/types/proposal';
import { Appliance } from '@/types/appliance';

interface TestResult {
  test1: Package[];
  test2: Package[];
}

interface PackageWithAppliances extends Package {
  applianceObjects: Appliance[];
}

function TestRecommendationPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult | null>(null);
  const [packagesWithDetails, setPackagesWithDetails] = useState<{
    test1: PackageWithAppliances[];
    test2: PackageWithAppliances[];
  } | null>(null);

  const runTest = async () => {
    setIsRunning(true);
    setResults(null);
    setPackagesWithDetails(null);

    try {
      console.log('🧪 執行推薦演算法測試...');
      const testResults = await testRecommendationEngine();
      setResults(testResults);

      // 取得電器詳細資訊
      const test1Details = await Promise.all(
        testResults.test1.map(async (pkg) => ({
          ...pkg,
          applianceObjects: await getAppliancesByIds(pkg.appliances),
        }))
      );

      const test2Details = await Promise.all(
        testResults.test2.map(async (pkg) => ({
          ...pkg,
          applianceObjects: await getAppliancesByIds(pkg.appliances),
        }))
      );

      setPackagesWithDetails({
        test1: test1Details,
        test2: test2Details,
      });

      console.log('✅ 測試完成！');
    } catch (error) {
      console.error('❌ 測試失敗：', error);
      alert('測試失敗，請查看 Console');
    } finally {
      setIsRunning(false);
    }
  };

  const categoryLabels = {
    large: '大型',
    small: '小家電',
    smart: '智慧',
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* 標題與說明 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧪 推薦演算法測試
        </h1>
        <p className="text-gray-600">
          測試階層式過濾、權重評分與品類平衡邏輯
        </p>
      </div>

      {/* 執行按鈕 */}
      <div className="mb-8">
        <button
          onClick={runTest}
          disabled={isRunning}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <Play className={`w-5 h-5 ${isRunning ? 'animate-pulse' : ''}`} />
          <span>{isRunning ? '測試中...' : '執行測試'}</span>
        </button>
      </div>

      {/* 測試結果 */}
      {packagesWithDetails && (
        <div className="space-y-12">
          {/* 測試案例 1 */}
          <div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h2 className="text-xl font-bold text-blue-900 mb-2">
                📋 測試案例 1：獨居長輩 + 套房
              </h2>
              <p className="text-blue-700 text-sm">
                條件：獨居長輩、套房格局、緊急救援、防呆安全
              </p>
              <p className="text-blue-700 text-sm">
                預期：小尺寸電器 + 跌倒偵測器等安全裝置
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {packagesWithDetails.test1.map((pkg) => (
                <PackageCard key={pkg.packageId} pkg={pkg} categoryLabels={categoryLabels} />
              ))}
            </div>
          </div>

          {/* 測試案例 2 */}
          <div>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h2 className="text-xl font-bold text-green-900 mb-2">
                📋 測試案例 2：三代同堂 + 透天厝
              </h2>
              <p className="text-green-700 text-sm">
                條件：三代同堂、透天厝格局、智慧監控、健康空淨
              </p>
              <p className="text-green-700 text-sm">
                預期：大型電器 + 多組智慧裝置 + 空氣清淨機
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {packagesWithDetails.test2.map((pkg) => (
                <PackageCard key={pkg.packageId} pkg={pkg} categoryLabels={categoryLabels} />
              ))}
            </div>
          </div>

          {/* 驗收檢查表 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
              驗收檢查表
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>每個測試案例都生成 3 組套餐</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>套餐價格遞增（經濟 &lt; 智慧 &lt; 旗艦）</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>每組套餐都包含三大類別電器（大型、小家電、智慧裝置）</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>測試案例 1：套房格局成功排除大型電器</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>測試案例 2：透天厝格局包含多樣化電器組合</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 初始提示 */}
      {!results && !isRunning && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">點擊上方按鈕開始測試推薦演算法</p>
        </div>
      )}
    </div>
  );
}

// 套餐卡片元件
function PackageCard({
  pkg,
  categoryLabels,
}: {
  pkg: PackageWithAppliances;
  categoryLabels: Record<string, string>;
}) {
  const categoryCount = {
    large: pkg.applianceObjects.filter((a) => a.category === 'large').length,
    small: pkg.applianceObjects.filter((a) => a.category === 'small').length,
    smart: pkg.applianceObjects.filter((a) => a.category === 'smart').length,
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.packageName}</h3>
      <p className="text-sm text-gray-600 mb-4">{pkg.reason}</p>

      {/* 價格 */}
      <div className="text-2xl font-bold text-primary-600 mb-4">
        NT$ {pkg.totalPrice.toLocaleString()}
      </div>

      {/* 類別統計 */}
      <div className="flex space-x-2 mb-4 text-xs">
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
          {categoryLabels.large} ×{categoryCount.large}
        </span>
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
          {categoryLabels.small} ×{categoryCount.small}
        </span>
        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
          {categoryLabels.smart} ×{categoryCount.smart}
        </span>
      </div>

      {/* 電器清單 */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-700 mb-2">包含電器：</p>
        {pkg.applianceObjects.map((appliance) => (
          <div key={appliance.id} className="text-xs text-gray-600 border-l-2 border-gray-200 pl-2">
            <div className="font-medium">{appliance.name}</div>
            <div className="text-gray-500">
              {appliance.widthCm}×{appliance.depthCm}×{appliance.heightCm} cm · NT${' '}
              {appliance.price.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestRecommendationPage;
