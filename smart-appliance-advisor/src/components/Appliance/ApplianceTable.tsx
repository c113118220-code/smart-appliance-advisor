/**
 * 商品列表表格元件
 */

import { Appliance } from '@/types/appliance';
import { Edit2, Trash2, Package } from 'lucide-react';
import { formatPrice } from '@/lib/proposalEncoder';
import { getApplianceIcon } from '@/lib/applianceIcon';

interface ApplianceTableProps {
  appliances: Appliance[];
  onEdit: (appliance: Appliance) => void;
  onDelete: (appliance: Appliance) => void;
}

function ApplianceTable({ appliances, onEdit, onDelete }: ApplianceTableProps) {
  const categoryLabels: Record<string, string> = {
    large: '大型家電',
    small: '小型家電',
    smart: '智慧家電',
  };

  const categoryColors: Record<string, string> = {
    large: 'bg-blue-100 text-blue-700',
    small: 'bg-green-100 text-green-700',
    smart: 'bg-purple-100 text-purple-700',
  };

  if (appliances.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-400 mb-2">查無商品</h3>
        <p className="text-gray-500">請調整搜尋條件或新增商品</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                商品資訊
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                類別
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                品牌
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                價格
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                尺寸 (cm)
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appliances.map((appliance) => (
              <tr key={appliance.id} className="hover:bg-gray-50 transition-colors">
                {/* 商品資訊 */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      {appliance.icon || getApplianceIcon(appliance.name, appliance.category)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{appliance.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {appliance.highlights?.[0] || '無特色說明'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 類別 */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      categoryColors[appliance.category]
                    }`}
                  >
                    {categoryLabels[appliance.category]}
                  </span>
                </td>

                {/* 品牌 */}
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{appliance.brand}</div>
                </td>

                {/* 價格 */}
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900">
                    ${formatPrice(appliance.price)}
                  </div>
                </td>

                {/* 尺寸 */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    {appliance.widthCm} × {appliance.depthCm} × {appliance.heightCm}
                  </div>
                </td>

                {/* 操作按鈕 */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onEdit(appliance)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="編輯"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(appliance)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="刪除"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 統計資訊 */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>共 {appliances.length} 件商品</span>
          <div className="flex items-center space-x-4">
            <span>
              大型家電：{appliances.filter((a) => a.category === 'large').length}
            </span>
            <span>
              小型家電：{appliances.filter((a) => a.category === 'small').length}
            </span>
            <span>
              智慧家電：{appliances.filter((a) => a.category === 'smart').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplianceTable;
