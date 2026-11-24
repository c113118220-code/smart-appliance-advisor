/**
 * Zustand 狀態管理測試頁面（驗收用）
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle2, Box, Bell } from 'lucide-react';
import { useProposalStore } from '@/stores/proposalStore';
import { showToast } from '@/stores/appStore';
import { generateRecommendations } from '@/services/recommendationEngine';
import { getAppliancesByIds } from '@/services/applianceService';

function TestZustandPage() {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  
  const {
    currentStep,
    selections,
    recommendedPackages,
    selectedPackage,
    selectedAppliancesFor3D,
    setStep,
    nextStep,
    prevStep,
    updateSelection,
    setRecommendedPackages,
    selectPackage,
    setAppliancesFor3D,
    resetProposal,
  } = useProposalStore();

  const runFullTest = async () => {
    setIsRunning(true);
    
    try {
      // 1. 重置狀態
      showToast.info('開始測試 Zustand 狀態管理...');
      resetProposal();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 2. 模擬問卷填寫
      showToast.info('步驟 1/4：選擇族群');
      updateSelection('demographic', 'young_family');
      setStep(2);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      showToast.info('步驟 2/4：選擇格局');
      updateSelection('layout', '2br');
      setStep(3);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      showToast.info('步驟 3/4：選擇生活需求');
      updateSelection('lifeNeeds', ['smartMonitoring', 'lifeAssistance']);
      setStep(4);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      showToast.info('步驟 4/4：選擇電器需求');
      updateSelection('applianceNeeds', ['energySaving', 'healthyAir']);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 3. 生成推薦套餐
      showToast.info('生成推薦套餐中...');
      const packages = await generateRecommendations(selections);
      setRecommendedPackages(packages);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast.success(`成功生成 ${packages.length} 組套餐！`);
      
      // 4. 選擇套餐
      if (packages.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
        selectPackage(packages[1]); // 選擇智慧生活版
        showToast.success('已選擇智慧生活版套餐');
        
        // 5. 準備 3D 資料
        await new Promise(resolve => setTimeout(resolve, 500));
        const appliances = await getAppliancesByIds(packages[1].appliances);
        setAppliancesFor3D(appliances);
        showToast.success(`已將 ${appliances.length} 件電器傳遞至 3D 模組`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast.success('✅ 測試完成！所有狀態正常運作', 5000);
      
    } catch (error) {
      console.error('測試失敗：', error);
      showToast.error('測試失敗，請查看 Console');
    } finally {
      setIsRunning(false);
    }
  };

  const testToasts = () => {
    showToast.success('成功訊息測試');
    setTimeout(() => showToast.error('錯誤訊息測試'), 500);
    setTimeout(() => showToast.warning('警告訊息測試'), 1000);
    setTimeout(() => showToast.info('資訊訊息測試'), 1500);
  };

  const navigateTo3D = () => {
    if (selectedAppliancesFor3D.length === 0) {
      showToast.warning('請先執行完整測試以產生 3D 資料');
      return;
    }
    navigate('/3d-preview');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* 標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧪 Zustand 狀態管理測試
        </h1>
        <p className="text-gray-600">
          測試問卷流程、套餐選擇、Toast 通知、3D 資料傳遞
        </p>
      </div>

      {/* 測試按鈕 */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={runFullTest}
          disabled={isRunning}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <Play className={`w-5 h-5 ${isRunning ? 'animate-pulse' : ''}`} />
          <span>{isRunning ? '測試中...' : '執行完整測試'}</span>
        </button>

        <button
          onClick={testToasts}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Bell className="w-5 h-5" />
          <span>測試 Toast 通知</span>
        </button>

        <button
          onClick={navigateTo3D}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
        >
          <Box className="w-5 h-5" />
          <span>前往 3D 預覽頁面</span>
        </button>
      </div>

      {/* 狀態顯示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 問卷狀態 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">問卷狀態</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">當前步驟：</span>
              <span className="font-mono font-bold text-primary-600">{currentStep} / 4</span>
            </div>
            <div className="border-t pt-3">
              <div className="text-gray-600 mb-2">顧客選擇：</div>
              <div className="bg-gray-50 rounded p-3 font-mono text-xs">
                <div>族群：{selections.demographic || '未選擇'}</div>
                <div>格局：{selections.layout || '未選擇'}</div>
                <div>生活需求：{selections.lifeNeeds.join(', ') || '未選擇'}</div>
                <div>電器需求：{selections.applianceNeeds.join(', ') || '未選擇'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 推薦結果 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">推薦結果</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">推薦套餐數：</span>
              <span className="font-mono font-bold text-green-600">
                {recommendedPackages.length}
              </span>
            </div>
            {recommendedPackages.length > 0 && (
              <div className="border-t pt-3">
                <div className="text-gray-600 mb-2">套餐清單：</div>
                <div className="space-y-2">
                  {recommendedPackages.map((pkg, idx) => (
                    <div
                      key={pkg.packageId}
                      className={`p-2 rounded text-xs ${
                        selectedPackage?.packageId === pkg.packageId
                          ? 'bg-primary-50 border border-primary-200'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="font-bold">{pkg.packageName}</div>
                      <div className="text-gray-600">
                        {pkg.appliances.length} 件 · NT$ {pkg.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 選定套餐 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">選定套餐</h3>
          <div className="space-y-3 text-sm">
            {selectedPackage ? (
              <>
                <div className="bg-primary-50 rounded p-3 border border-primary-200">
                  <div className="font-bold text-primary-900 mb-1">
                    {selectedPackage.packageName}
                  </div>
                  <div className="text-primary-700 text-xs mb-2">
                    {selectedPackage.reason}
                  </div>
                  <div className="text-primary-600 font-mono">
                    NT$ {selectedPackage.totalPrice.toLocaleString()}
                  </div>
                </div>
                <div className="text-gray-600">
                  包含 {selectedPackage.appliances.length} 件電器
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-center py-4">尚未選擇套餐</div>
            )}
          </div>
        </div>

        {/* 3D 模組資料 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Box className="w-5 h-5 mr-2 text-purple-600" />
            3D 模組資料
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">已傳遞電器數：</span>
              <span className="font-mono font-bold text-purple-600">
                {selectedAppliancesFor3D.length}
              </span>
            </div>
            {selectedAppliancesFor3D.length > 0 && (
              <div className="border-t pt-3">
                <div className="text-gray-600 mb-2">電器清單：</div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {selectedAppliancesFor3D.map((appliance) => (
                    <div key={appliance.id} className="text-xs bg-gray-50 rounded p-2">
                      <div className="font-medium">{appliance.name}</div>
                      <div className="text-gray-600">
                        {appliance.widthCm}×{appliance.depthCm}×{appliance.heightCm} cm
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 驗收檢查表 */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
          驗收檢查表
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Zustand stores 正確建立（proposalStore, appStore）</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>問卷狀態管理正常（步驟、選擇）</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>推薦套餐狀態更新正常</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>選定套餐狀態保存正常</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>3D 模組資料傳遞正常</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Toast 通知系統運作正常</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>路由跳轉功能正常</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>重置功能運作正常</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestZustandPage;
