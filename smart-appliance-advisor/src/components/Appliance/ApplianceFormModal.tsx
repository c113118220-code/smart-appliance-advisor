/**
 * 商品新增/編輯表單 Modal
 */

import { getApplianceIcon } from '@/lib/applianceIcon';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Appliance } from '@/types/appliance';

interface ApplianceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Appliance>) => void;
  appliance?: Appliance | null;
  isLoading?: boolean;
}

function ApplianceFormModal({
  isOpen,
  onClose,
  onSubmit,
  appliance,
  isLoading = false,
}: ApplianceFormModalProps) {
  const isEdit = !!appliance;

  // 表單狀態
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'large' as 'large' | 'small' | 'smart',
    price: '',
    widthCm: '',
    depthCm: '',
    heightCm: '',
    icon: appliance?.icon || '',
    highlights: '',
    keyFeatures: '',
    // 3D 相關
    placementType: 'floor' as 'floor' | 'wall' | 'countertop' | 'ceiling',
    suggestedRoom: 'living_room' as 'living_room' | 'bedroom' | 'kitchen' | 'bathroom',
    clearanceCm: '',
    themeColor: '#FFFFFF',
    // 標籤
    smartMonitoring: false,
    lifeAssistance: false,
    emergencyRescue: false,
    foolproofSafety: false,
    energySaving: false,
    healthyAir: false,
    // 適用對象
    demographics: [] as string[],
    layouts: [] as string[],
  });

  // 當 appliance 改變時更新表單
  useEffect(() => {
    if (appliance) {
      setFormData({
        name: appliance.name,
        brand: appliance.brand,
        category: appliance.category,
        price: appliance.price.toString(),
        widthCm: appliance.widthCm.toString(),
        depthCm: appliance.depthCm.toString(),
        heightCm: appliance.heightCm.toString(),
        icon: appliance.icon || '',
        highlights: appliance.highlights.join('\n'),
        keyFeatures: appliance.keyFeatures?.join('\n') || '',
        placementType: appliance.placementType,
        suggestedRoom: appliance.suggestedRoom,
        clearanceCm: appliance.clearanceCm.toString(),
        themeColor: appliance.themeColor,
        smartMonitoring: appliance.tags.smartMonitoring,
        lifeAssistance: appliance.tags.lifeAssistance,
        emergencyRescue: appliance.tags.emergencyRescue,
        foolproofSafety: appliance.tags.foolproofSafety,
        energySaving: appliance.tags.energySaving,
        healthyAir: appliance.tags.healthyAir,
        demographics: appliance.suitableFor.demographics,
        layouts: appliance.suitableFor.layouts,
      });
    }
  }, [appliance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
    ...formData,
    icon: formData.icon?.trim() || getApplianceIcon(formData.name, formData.category),
  };
    const data: Partial<Appliance> = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      price: parseInt(formData.price),
      widthCm: parseInt(formData.widthCm),
      depthCm: parseInt(formData.depthCm),
      heightCm: parseInt(formData.heightCm),
      icon: formData.icon,
      highlights: formData.highlights.split('\n').filter((h) => h.trim()),
      keyFeatures: formData.keyFeatures.split('\n').filter((k) => k.trim()),
      placementType: formData.placementType,
      suggestedRoom: formData.suggestedRoom,
      clearanceCm: parseInt(formData.clearanceCm),
      themeColor: formData.themeColor,
      tags: {
        smartMonitoring: formData.smartMonitoring,
        lifeAssistance: formData.lifeAssistance,
        emergencyRescue: formData.emergencyRescue,
        foolproofSafety: formData.foolproofSafety,
        energySaving: formData.energySaving,
        healthyAir: formData.healthyAir,
      },
      suitableFor: {
        demographics: formData.demographics,
        layouts: formData.layouts,
      },
    };

    onSubmit(data);
  };

  const handleCheckboxChange = (field: string, value: string) => {
    const currentValues = formData[field as keyof typeof formData] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setFormData({ ...formData, [field]: newValues });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{isEdit ? '編輯商品' : '新增商品'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* 基本資訊 */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">基本資訊</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    商品名稱 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">品牌 *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">類別 *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as 'large' | 'small' | 'smart',
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="large">大型家電</option>
                    <option value="small">小型家電</option>
                    <option value="smart">智慧家電</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">價格 *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    圖示 Emoji
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="例如：🧺"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* 尺寸資訊 */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">尺寸資訊 (cm)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">寬度 *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.widthCm}
                    onChange={(e) => setFormData({ ...formData, widthCm: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">深度 *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.depthCm}
                    onChange={(e) => setFormData({ ...formData, depthCm: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">高度 *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* 特色與功能 */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">特色與功能</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    產品亮點（每行一項）
                  </label>
                  <textarea
                    rows={3}
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    placeholder="例如：&#10;超靜音運轉&#10;節能省電&#10;智慧遙控"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    關鍵功能（每行一項）
                  </label>
                  <textarea
                    rows={3}
                    value={formData.keyFeatures}
                    onChange={(e) => setFormData({ ...formData, keyFeatures: e.target.value })}
                    placeholder="例如：&#10;AI 智慧偵測&#10;APP 遠端控制"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* 功能標籤 */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">功能標籤</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'smartMonitoring', label: '智慧監控' },
                  { key: 'lifeAssistance', label: '生活輔助' },
                  { key: 'emergencyRescue', label: '緊急救援' },
                  { key: 'foolproofSafety', label: '防呆安全' },
                  { key: 'energySaving', label: '節能省電' },
                  { key: 'healthyAir', label: '健康空淨' },
                ].map((tag) => (
                  <label key={tag.key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[tag.key as keyof typeof formData] as boolean}
                      onChange={(e) =>
                        setFormData({ ...formData, [tag.key]: e.target.checked })
                      }
                      className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{tag.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* 適用對象 */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">適用對象</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    適用族群 *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'senior_solo', label: '獨居長輩' },
                      { value: 'young_family', label: '雙薪小家庭' },
                      { value: 'multi_generation', label: '三代同堂' },
                      { value: 'single_renter', label: '單身租屋族' },
                    ].map((demo) => (
                      <label key={demo.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.demographics.includes(demo.value)}
                          onChange={() => handleCheckboxChange('demographics', demo.value)}
                          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{demo.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    適用格局 *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'studio', label: '套房' },
                      { value: '2br', label: '兩房一廳' },
                      { value: '3br', label: '三房兩廳' },
                      { value: 'house', label: '透天厝' },
                    ].map((layout) => (
                      <label key={layout.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.layouts.includes(layout.value)}
                          onChange={() => handleCheckboxChange('layouts', layout.value)}
                          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{layout.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 3D 相關設定 */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">3D 模組設定（第二階段）</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">擺放方式</label>
                  <select
                    value={formData.placementType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        placementType: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="floor">地面擺放</option>
                    <option value="wall">壁掛安裝</option>
                    <option value="countertop">檯面擺放</option>
                    <option value="ceiling">天花板安裝</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">建議空間</label>
                  <select
                    value={formData.suggestedRoom}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        suggestedRoom: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="living_room">客廳</option>
                    <option value="bedroom">臥室</option>
                    <option value="kitchen">廚房</option>
                    <option value="bathroom">浴室</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    需求淨空 (cm)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.clearanceCm}
                    onChange={(e) => setFormData({ ...formData, clearanceCm: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">主題色</label>
                  <input
                    type="color"
                    value={formData.themeColor}
                    onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                    className="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '處理中...' : isEdit ? '儲存變更' : '新增商品'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplianceFormModal;
