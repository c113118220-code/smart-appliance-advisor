/**
 * 套餐推薦結果頁面
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { useProposalStore } from '@/stores/proposalStore';
import { showToast } from '@/stores/appStore';
import { getAppliancesByIds } from '@/services/applianceService';
import { Appliance } from '@/types/appliance';
import { Package } from '@/types/proposal';
import PackageCard from '@/components/Proposal/PackageCard';

interface PackageWithAppliances extends Package {
  applianceObjects: Appliance[];
}

function ProposalRecommendationPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [packagesWithAppliances, setPackagesWithAppliances] = useState<PackageWithAppliances[]>(
    []
  );

  const {
    selections,
    recommendedPackages,
    selectedPackage,
    selectPackage,
    setAppliancesFor3D,
    resetProposal,
  } = useProposalStore();

  // 載入電器詳細資訊
  useEffect(() => {
    const loadApplianceDetails = async () => {
      if (recommendedPackages.length === 0) {
        showToast.warning('尚未生成推薦，返回問卷頁面');
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);

        // 批次取得所有電器詳細資訊
        const packagesWithDetails = await Promise.all(
          recommendedPackages.map(async (pkg) => ({
            ...pkg,
            applianceObjects: await getAppliancesByIds(pkg.appliances),
          }))
        );

        setPackagesWithAppliances(packagesWithDetails);
      } catch (error) {
        console.error('載入電器詳細資訊失敗：', error);
        showToast.error('載入失敗，請稍後再試');
      } finally {
        setIsLoading(false);
      }
    };

    loadApplianceDetails();
  }, [recommendedPackages, navigate]);

  // 處理選擇套餐
  const handleSelectPackage = (pkg: Package) => {
    selectPackage(pkg);
    showToast.success(`已選擇${pkg.packageName}`);
  };

  // 處理 3D 預覽
  const handleView3D = async (pkg: Package) => {
    try {
      const appliances = await getAppliancesByIds(pkg.appliances);
      setAppliancesFor3D(appliances);
      showToast.info(`已將 ${appliances.length} 件電器傳遞至 3D 模組`);
      navigate('/3d-preview');
    } catch (error) {
      console.error('傳遞 3D 資料失敗：', error);
      showToast.error('操作失敗，請稍後再試');
    }
  };

  // 處理重新開始
  const handleRestart = () => {
    if (confirm('確定要重新開始提案流程嗎？目前的選擇將被清除。')) {
      resetProposal();
      navigate('/');
      showToast.info('已重置，請重新填寫問卷');
    }
  };

  // 處理生成 QR Code（進入下一步）
  const handleGenerateQRCode = () => {
    if (!selectedPackage) {
      showToast.warning('請先選擇一個套餐');
      return;
    }
    navigate('/proposal/qrcode');
  };

  // 顯示條件標籤
  const getSelectionLabels = () => {
    const demographicLabels: Record<string, string> = {
      senior_solo: '獨居長輩',
      young_family: '雙薪小家庭',
      multi_generation: '三代同堂',
      single_renter: '單身租屋族',
    };

    const layoutLabels: Record<string, string> = {
      studio: '套房',
      '2br': '兩房一廳',
      '3br': '三房兩廳',
      house: '透天厝',
    };

    const needsLabels: Record<string, string> = {
      smartMonitoring: '智慧監控',
      lifeAssistance: '生活輔助',
      emergencyRescue: '緊急救援',
      foolproofSafety: '防呆安全',
      energySaving: '節能省電',
      healthyAir: '健康空淨',
    };

    return {
      demographic: demographicLabels[selections.demographic] || selections.demographic,
      layout: layoutLabels[selections.layout] || selections.layout,
      lifeNeeds: selections.lifeNeeds.map((n) => needsLabels[n] || n),
      applianceNeeds: selections.applianceNeeds.map((n) => needsLabels[n] || n),
    };
  };

  const labels = getSelectionLabels();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">正在為您準備專屬推薦...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* 標題區域 */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回問卷</span>
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">智慧推薦結果</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            為您量身打造的專屬方案
          </h1>
          <p className="text-gray-600">根據您的需求，我們推薦以下 3 組套餐</p>
        </div>

        {/* 顧客條件摘要 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3">您的選擇條件</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">家庭組成：</span>
              <span className="ml-2 font-medium text-gray-900">{labels.demographic}</span>
            </div>
            <div>
              <span className="text-gray-600">房屋格局：</span>
              <span className="ml-2 font-medium text-gray-900">{labels.layout}</span>
            </div>
            <div>
              <span className="text-gray-600">生活需求：</span>
              <span className="ml-2 font-medium text-gray-900">
                {labels.lifeNeeds.join('、')}
              </span>
            </div>
            <div>
              <span className="text-gray-600">電器需求：</span>
              <span className="ml-2 font-medium text-gray-900">
                {labels.applianceNeeds.join('、')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 套餐卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {packagesWithAppliances.map((pkg) => (
          <PackageCard
            key={pkg.packageId}
            package={pkg}
            appliances={pkg.applianceObjects}
            isSelected={selectedPackage?.packageId === pkg.packageId}
            onSelect={() => handleSelectPackage(pkg)}
            onView3D={() => handleView3D(pkg)}
          />
        ))}
      </div>

      {/* 底部操作按鈕 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl shadow-md p-6">
        <button
          onClick={handleRestart}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          <span>重新開始</span>
        </button>

        <div className="flex flex-col sm:flex-row gap-3">
          {selectedPackage && (
            <div className="text-sm text-gray-600 flex items-center">
              <span className="hidden sm:inline">已選擇：</span>
              <span className="ml-1 font-bold text-primary-600">
                {selectedPackage.packageName}
              </span>
            </div>
          )}

          <button
            onClick={handleGenerateQRCode}
            disabled={!selectedPackage}
            className={`
              px-8 py-3 rounded-lg font-bold transition-all duration-200 shadow-md
              ${
                selectedPackage
                  ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {selectedPackage ? '下一步：生成 QR Code' : '請先選擇套餐'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProposalRecommendationPage;
