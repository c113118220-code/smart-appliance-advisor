/**
 * 3D 空間擬真模組預備頁面（第二階段）
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Box, Ruler, MapPin, Palette } from 'lucide-react';
import { useProposalStore } from '@/stores/proposalStore';

function ThreeDPreviewPage() {
  const navigate = useNavigate();
  const { selectedAppliancesFor3D } = useProposalStore();

  const placementTypeLabels = {
    floor: '落地型',
    countertop: '桌面/檯面型',
    wall: '壁掛型',
  };

  const roomLabels = {
    living_room: '客廳',
    kitchen: '廚房',
    bedroom: '臥室',
    entrance: '玄關',
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* 標題區域 */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </button>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Box className="w-8 h-8" />
            <h1 className="text-3xl font-bold">3D 空間擬真模組</h1>
          </div>
          <p className="text-purple-100">第二階段開發中 - 資料已成功接收</p>
        </div>
      </div>

      {/* 說明區域 */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
        <h2 className="text-lg font-bold text-blue-900 mb-2">📐 系統說明</h2>
        <p className="text-blue-700 mb-3">
          已成功接收以下電器資料，將於第二階段整合 Three.js / React Three Fiber 進行空間擺放模擬。
        </p>
        <div className="text-sm text-blue-600 space-y-1">
          <p>✨ 預計功能：</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>3D 電器模型載入（GLTF 格式）</li>
            <li>拖曳式空間擺放</li>
            <li>碰撞偵測與警告提示（基於安全距離）</li>
            <li>擺放位置優化建議</li>
            <li>即時空間預覽與旋轉視角</li>
          </ul>
        </div>
      </div>

      {/* 電器數量統計 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {selectedAppliancesFor3D.length}
          </div>
          <div className="text-gray-600">電器數量</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {selectedAppliancesFor3D.reduce((sum, a) => sum + a.price, 0).toLocaleString()}
          </div>
          <div className="text-gray-600">總價值（NT$）</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {new Set(selectedAppliancesFor3D.map((a) => a.suggestedRoom)).size}
          </div>
          <div className="text-gray-600">建議空間數量</div>
        </div>
      </div>

      {/* 電器清單表格 */}
      {selectedAppliancesFor3D.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">已接收電器清單</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    電器名稱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    品牌
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <Ruler className="w-4 h-4" />
                      <span>尺寸 (cm)</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    擺放類型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>建議空間</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    安全距離
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <Palette className="w-4 h-4" />
                      <span>主題色</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedAppliancesFor3D.map((appliance) => (
                  <tr key={appliance.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{appliance.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appliance.brand}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono text-gray-900">
                        {appliance.widthCm} × {appliance.depthCm} × {appliance.heightCm}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        {placementTypeLabels[appliance.placementType]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                        {roomLabels[appliance.suggestedRoom]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appliance.clearanceCm} cm</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: appliance.themeColor }}
                        />
                        <span className="text-xs font-mono text-gray-600">
                          {appliance.themeColor}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
          <Box className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">尚未選擇任何電器</p>
          <p className="text-sm text-gray-500">
            請從套餐推薦頁面或歷史提案頁面點擊「帶入 3D 空間預覽」按鈕
          </p>
        </div>
      )}

      {/* 返回按鈕 */}
      {selectedAppliancesFor3D.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md"
          >
            返回上一頁
          </button>
        </div>
      )}
    </div>
  );
}

export default ThreeDPreviewPage;
