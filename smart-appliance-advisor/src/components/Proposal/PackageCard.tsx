/**
 * 套餐卡片元件
 */

import { Check, Box, ChevronDown, ChevronUp } from 'lucide-react';
import { Package } from '@/types/proposal';
import { Appliance } from '@/types/appliance';
import { formatPrice } from '@/lib/proposalEncoder';
import { useState } from 'react';

interface PackageCardProps {
  package: Package;
  appliances: Appliance[];
  isSelected?: boolean;
  onSelect: () => void;
  onView3D: () => void;
}

function PackageCard({
  package: pkg,
  appliances,
  isSelected = false,
  onSelect,
  onView3D,
}: PackageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryLabels = {
    large: '大型家電',
    small: '健康/生活小家電',
    smart: '智慧監控/安全裝置',
  };

  const categoryCount = {
    large: appliances.filter((a) => a.category === 'large').length,
    small: appliances.filter((a) => a.category === 'small').length,
    smart: appliances.filter((a) => a.category === 'smart').length,
  };

  return (
    <div
      className={`
        relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300
        ${isSelected ? 'border-primary-600 ring-4 ring-primary-100' : 'border-gray-200 hover:shadow-xl'}
      `}
    >
      {/* 選中徽章 */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 bg-primary-600 text-white rounded-full p-2 shadow-lg z-10">
          <Check className="w-6 h-6" />
        </div>
      )}

      <div className="p-6">
        {/* 套餐名稱與推薦理由 */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.packageName}</h3>
          <p className="text-gray-600 text-sm">{pkg.reason}</p>
        </div>

        {/* 總價 */}
        <div className="mb-6">
          <div className="text-3xl font-bold text-primary-600">
            NT$ {formatPrice(pkg.totalPrice)}
          </div>
          <div className="text-sm text-gray-500 mt-1">包含 {appliances.length} 件電器</div>
        </div>

        {/* 類別統計標籤 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categoryCount.large > 0 && (
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {categoryLabels.large} ×{categoryCount.large}
            </span>
          )}
          {categoryCount.small > 0 && (
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              {categoryLabels.small} ×{categoryCount.small}
            </span>
          )}
          {categoryCount.smart > 0 && (
            <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              {categoryLabels.smart} ×{categoryCount.smart}
            </span>
          )}
        </div>

        {/* 電器清單（可展開） */}
        <div className="mb-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
          >
            <span>包含電器清單</span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-3 animate-fade-in">
              {appliances.map((appliance) => (
                <div
                  key={appliance.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{appliance.name}</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>品牌：{appliance.brand}</div>
                        <div>
                          尺寸：{appliance.widthCm} × {appliance.depthCm} × {appliance.heightCm} cm
                        </div>
                      </div>
                      {/* 亮點標籤 */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {appliance.highlights.slice(0, 3).map((highlight, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-primary-50 text-primary-700 text-xs px-2 py-0.5 rounded"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="ml-3 text-right">
                      <div className="font-bold text-gray-900">
                        ${formatPrice(appliance.price)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 操作按鈕 */}
        <div className="space-y-3">
          {/* 選擇此套餐按鈕 */}
          <button
            onClick={onSelect}
            className={`
              w-full py-3 rounded-lg font-bold transition-all duration-200
              flex items-center justify-center space-x-2
              ${
                isSelected
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
              }
            `}
          >
            {isSelected ? (
              <>
                <Check className="w-5 h-5" />
                <span>已選擇此套餐</span>
              </>
            ) : (
              <span>選擇此套餐</span>
            )}
          </button>

          {/* 帶入 3D 空間預覽按鈕 */}
          <button
            onClick={onView3D}
            className="w-full py-3 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors flex items-center justify-center space-x-2"
          >
            <Box className="w-5 h-5" />
            <span>帶入 3D 空間預覽</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PackageCard;
