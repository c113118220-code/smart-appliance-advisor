/**
 * 提案詳細資訊 Modal
 */

import { getApplianceIcon } from '@/lib/applianceIcon';
import { useState, useEffect } from 'react';
import { X, Package, Users, Home, Tag, Calendar, QrCode } from 'lucide-react';
import { Proposal } from '@/types/proposal';
import { Appliance } from '@/types/appliance';
import { getAppliancesByIds } from '@/services/applianceService';
import { formatPrice, generateConsumerProposalUrl } from '@/lib/proposalEncoder';
import { showToast } from '@/stores/appStore';

interface ProposalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: Proposal | null;
}

function ProposalDetailModal({ isOpen, onClose, proposal }: ProposalDetailModalProps) {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (proposal && isOpen) {
      loadAppliances();
    }
  }, [proposal, isOpen]);

  const loadAppliances = async () => {
    if (!proposal) return;

    try {
      setIsLoading(true);
      const applianceList = await getAppliancesByIds(proposal.selectedPackage.appliances);
      setAppliances(applianceList);
    } catch (error) {
      console.error('載入電器失敗：', error);
      showToast.error('載入電器資料失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 計算套餐總價（保險機制：如果 finalPrice 為 0 或 undefined，就加總電器價格）
  const calculateTotalPrice = () => {
    if (!proposal) return 0;
    
    // 如果 finalPrice 有值且大於 0，直接使用
    if (proposal.selectedPackage.finalPrice && proposal.selectedPackage.finalPrice > 0) {
      return proposal.selectedPackage.finalPrice;
    }
    
    // 否則，加總所有電器價格
    const total = appliances.reduce((sum, appliance) => sum + appliance.price, 0);
    return total;
  };

  const totalPrice = calculateTotalPrice();
  const monthlyPayment = Math.ceil(totalPrice / 24); // 24 期分期

  const handleCopyQRLink = () => {
    if (!proposal) return;

    // 重建套餐物件
    const packageData = {
      packageId: proposal.selectedPackage.packageId,
      packageName: proposal.selectedPackage.packageId,
      reason: '',
      appliances: proposal.selectedPackage.appliances,
      totalPrice: proposal.selectedPackage.finalPrice,
    };

    const url = generateConsumerProposalUrl(packageData);
    navigator.clipboard.writeText(url);
    showToast.success('提案連結已複製');
  };

  if (!isOpen || !proposal) return null;

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

  const categoryLabels: Record<string, string> = {
    large: '大型家電',
    small: '小型家電',
    smart: '智慧家電',
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">提案詳細資訊</h2>
            <p className="text-primary-100 text-sm">
              編號：{proposal.id.slice(0, 12).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
          {/* 套餐資訊 */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-primary-600" />
              套餐資訊
            </h3>
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-4 border border-primary-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">套餐 ID</div>
                  <div className="font-bold text-gray-900">
                    {proposal.selectedPackage.packageId}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">套餐總價</div>
                  <div className="font-bold text-primary-600 text-xl">
                    ${formatPrice(totalPrice)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">電器數量</div>
                  <div className="font-bold text-gray-900">
                    {proposal.selectedPackage.appliances.length} 件
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">分期月付</div>
                  <div className="font-bold text-gray-900">
                    ${formatPrice(monthlyPayment)} 起
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 顧客條件 */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary-600" />
              顧客選擇條件
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center">
                <span className="text-gray-600 w-24">族群：</span>
                <span className="font-medium text-gray-900">
                  {demographicLabels[proposal.customerSelections.demographic]}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-24">格局：</span>
                <span className="font-medium text-gray-900">
                  {layoutLabels[proposal.customerSelections.layout]}
                </span>
              </div>
              <div>
                <span className="text-gray-600 block mb-2">生活需求：</span>
                <div className="flex flex-wrap gap-2">
                  {proposal.customerSelections.lifeNeeds.map((need, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {need}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-gray-600 block mb-2">電器需求：</span>
                <div className="flex flex-wrap gap-2">
                  {proposal.customerSelections.applianceNeeds.map((need, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {need}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 電器清單 */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-primary-600" />
              電器清單
            </h3>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">載入電器資料中...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appliances.map((appliance) => (
                  <div
                    key={appliance.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl mr-4">
                        {appliance.icon || getApplianceIcon(appliance.name, appliance.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900">{appliance.name}</h4>
                            <p className="text-sm text-gray-600">{appliance.brand}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              ${formatPrice(appliance.price)}
                            </div>
                            <span className="text-xs text-gray-500">
                              {categoryLabels[appliance.category]}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {appliance.highlights.slice(0, 3).map((highlight, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 時間戳記 */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary-600" />
              時間資訊
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">建立時間：</span>
                <span className="font-medium text-gray-900">{formatDate(proposal.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">最後更新：</span>
                <span className="font-medium text-gray-900">{formatDate(proposal.updatedAt)}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleCopyQRLink}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-medium"
          >
            <QrCode className="w-5 h-5" />
            <span>複製提案連結</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProposalDetailModal;
