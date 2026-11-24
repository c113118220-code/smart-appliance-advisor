/**
 * 消費者提案頁面（B2C）
 * 顧客掃描 QR Code 後看到的手機版提案單
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, ShoppingCart, Check, Home, Phone } from 'lucide-react';
import { decodeProposalFromUrl, EncodedProposalData, formatPrice } from '@/lib/proposalEncoder';
import { getAppliancesByIds } from '@/services/applianceService';
import { Appliance } from '@/types/appliance';
import { getApplianceIcon } from '@/lib/applianceIcon';

function ConsumerProposalPage() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [proposalData, setProposalData] = useState<EncodedProposalData | null>(null);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProposal = async () => {
      try {
        setIsLoading(true);

        // 解碼 URL 參數
        const decoded = decodeProposalFromUrl(searchParams.toString());
        if (!decoded) {
          setError('無效的提案連結，請確認 QR Code 是否正確');
          return;
        }

        setProposalData(decoded);

        // 載入電器詳細資料
        const applianceIds = decoded.aids.split(',').filter((id) => id);
        const applianceList = await getAppliancesByIds(applianceIds);

        if (applianceList.length === 0) {
          setError('找不到電器資料，請聯繫門市人員');
          return;
        }

        setAppliances(applianceList);
      } catch (err) {
        console.error('載入提案失敗：', err);
        setError('載入失敗，請稍後再試或聯繫門市人員');
      } finally {
        setIsLoading(false);
      }
    };

    loadProposal();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="spinner mx-auto mb-4 border-primary-600"></div>
          <p className="text-gray-600">正在載入您的專屬提案...</p>
        </div>
      </div>
    );
  }

  if (error || !proposalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">無法載入提案</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Phone className="w-4 h-4" />
            <span>歡迎聯繫全國電子門市人員</span>
          </div>
        </div>
      </div>
    );
  }

  const largeAppliances = appliances.filter((a) => a.category === 'large');
  const smallAppliances = appliances.filter((a) => a.category === 'small');
  const smartAppliances = appliances.filter((a) => a.category === 'smart');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      {/* 頂部品牌區 */}
      <div className="bg-primary-600 text-white py-6 px-4 shadow-lg">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-1">全國電子 Digital City</h1>
          <p className="text-primary-100 text-sm">您的智慧家電專屬提案</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 pb-8">
        {/* 套餐資訊卡片 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 mt-6">
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">{proposalData.pn}</h2>
            </div>
            <p className="text-primary-100 text-sm">為您精心搭配的智慧家電組合</p>
          </div>

          {/* 價格資訊 */}
          <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-gray-600">套餐總價</span>
              <div className="text-right">
                <span className="text-3xl font-bold text-gray-900">
                  ${formatPrice(proposalData.tp)}
                </span>
              </div>
            </div>

            <div className="flex items-baseline justify-between p-4 bg-primary-50 rounded-xl border border-primary-100">
              <span className="text-gray-700 font-medium">分期每月只要</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary-600">
                  ${formatPrice(proposalData.mp)}
                </span>
                <span className="text-gray-500 text-sm ml-1">起</span>
              </div>
            </div>
          </div>
        </div>

        {/* 電器清單 */}
        <div className="space-y-4">
          {/* 大型家電 */}
          {largeAppliances.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <h3 className="font-bold text-blue-900 flex items-center space-x-2">
                  <Home className="w-5 h-5" />
                  <span>大型家電（{largeAppliances.length}）</span>
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {largeAppliances.map((appliance) => (
                  <ApplianceItem key={appliance.id} appliance={appliance} />
                ))}
              </div>
            </div>
          )}

          {/* 小家電 */}
          {smallAppliances.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-green-50 px-4 py-3 border-b border-green-100">
                <h3 className="font-bold text-green-900 flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>小型家電（{smallAppliances.length}）</span>
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {smallAppliances.map((appliance) => (
                  <ApplianceItem key={appliance.id} appliance={appliance} />
                ))}
              </div>
            </div>
          )}

          {/* 智慧家電 */}
          {smartAppliances.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-purple-50 px-4 py-3 border-b border-purple-100">
                <h3 className="font-bold text-purple-900 flex items-center space-x-2">
                  <Check className="w-5 h-5" />
                  <span>智慧家電（{smartAppliances.length}）</span>
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {smartAppliances.map((appliance) => (
                  <ApplianceItem key={appliance.id} appliance={appliance} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部 CTA */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">喜歡這個提案嗎？</h3>
            <p className="text-gray-600 text-sm">立即前往全國電子門市洽詢</p>
          </div>

          <button className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl">
            前往門市洽詢
          </button>

          <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            提案編號：{proposalData.pid.slice(0, 8).toUpperCase()}
            <br />
            生成時間：{new Date(proposalData.ts).toLocaleString('zh-TW')}
          </div>
        </div>
      </div>
    </div>
  );
}

// 電器項目元件
function ApplianceItem({ appliance }: { appliance: Appliance }) {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-2xl">{appliance.icon || getApplianceIcon(appliance.name, appliance.category)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 mb-1">{appliance.name}</h4>
          <p className="text-sm text-gray-600 mb-2">{appliance.brand}</p>
          {appliance.keyFeatures && appliance.keyFeatures.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {appliance.keyFeatures.slice(0, 2).map((feature, idx) => (
                <span
                  key={idx}
                  className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold text-primary-600">
              ${formatPrice(appliance.price)}
            </span>
            {appliance.dimensions && (
              <span className="text-xs text-gray-500">
                {appliance.dimensions.width}×{appliance.dimensions.depth}×
                {appliance.dimensions.height}cm
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsumerProposalPage;
