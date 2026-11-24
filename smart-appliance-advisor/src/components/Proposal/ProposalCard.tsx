/**
 * 提案歷史卡片元件
 */

import { Eye, Trash2, Users, Home, Calendar } from 'lucide-react';
import { Proposal } from '@/types/proposal';
import { formatPrice } from '@/lib/proposalEncoder';

interface ProposalCardProps {
  proposal: Proposal;
  onView: (proposal: Proposal) => void;
  onDelete: (proposal: Proposal) => void;
}

function ProposalCard({ proposal, onView, onDelete }: ProposalCardProps) {
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

  // 生活需求中文對照
  const lifeNeedsLabels: Record<string, string> = {
    smartMonitoring: '智慧監控',
    lifeAssistance: '生活輔助',
    emergencyRescue: '緊急救援',
    foolproofSafety: '防呆安全',
    energySaving: '節能省電',
    healthyAir: '健康空淨',
  };

  // 電器需求中文對照（通常也是一樣的，但可以分開定義）
  const applianceNeedsLabels: Record<string, string> = {
    smartMonitoring: '智慧監控',
    lifeAssistance: '生活輔助',
    emergencyRescue: '緊急救援',
    foolproofSafety: '防呆安全',
    energySaving: '節能省電',
    healthyAir: '健康空淨',
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 顯示總價（如果 finalPrice 為 0 或 undefined，顯示為 "計算中"）
  const displayPrice = () => {
    const price = proposal.selectedPackage.finalPrice;
    if (!price || price === 0) {
      return '待計算';
    }
    return formatPrice(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold">{proposal.selectedPackage.packageId}</h3>
            <p className="text-primary-100 text-sm">
              提案編號：{proposal.id.slice(0, 12).toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              ${displayPrice()}
            </div>
            <div className="text-primary-100 text-xs">
              {proposal.selectedPackage.appliances.length} 件電器
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* 顧客條件 */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium mr-2">族群：</span>
            <span className="text-gray-900">
              {demographicLabels[proposal.customerSelections.demographic] ||
                proposal.customerSelections.demographic}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Home className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium mr-2">格局：</span>
            <span className="text-gray-900">
              {layoutLabels[proposal.customerSelections.layout] ||
                proposal.customerSelections.layout}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium mr-2">建立時間：</span>
            <span className="text-gray-900">{formatDate(proposal.createdAt)}</span>
          </div>
        </div>

        {/* 需求標籤 */}
        <div className="flex flex-wrap gap-2">
          {proposal.customerSelections.lifeNeeds.map((need, idx) => (
            <span
              key={idx}
              className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
            >
              {lifeNeedsLabels[need] || need}
            </span>
          ))}
          {proposal.customerSelections.applianceNeeds.map((need, idx) => (
            <span
              key={idx}
              className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs rounded"
            >
              {applianceNeedsLabels[need] || need}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-end space-x-2">
        <button
          onClick={() => onView(proposal)}
          className="flex items-center space-x-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          <span>查看詳情</span>
        </button>
        <button
          onClick={() => onDelete(proposal)}
          className="flex items-center space-x-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          <span>刪除</span>
        </button>
      </div>
    </div>
  );
}

export default ProposalCard;
