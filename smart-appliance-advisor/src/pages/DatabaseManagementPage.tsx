/**
 * 資料庫管理與 Demo 準備頁面
 */

import { useState, useEffect } from 'react';
import { RefreshCw, Database, Trash2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import {
  resetDatabase,
  clearProposals,
  getDatabaseStats,
} from '@/services/seedService';
import { showToast } from '@/stores/appStore';

function DatabaseManagementPage() {
  const [stats, setStats] = useState({
    appliances: 0,
    proposals: 0,
    seedVersion: 'N/A',
  });
  const [isLoading, setIsLoading] = useState(false);

  // 載入統計資訊
  const loadStats = async () => {
    try {
      const data = await getDatabaseStats();
      setStats(data);
    } catch (error) {
      console.error('載入統計失敗：', error);
      showToast.error('載入統計資訊失敗');
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // 完整重置資料庫
  const handleResetDatabase = async () => {
    if (
      !confirm(
        '⚠️ 確定要完整重置資料庫嗎？\n\n此操作將：\n• 刪除所有電器資料\n• 刪除所有提案紀錄\n• 重新載入 15 款 Seed Data\n\n此操作無法復原！'
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      await resetDatabase();
      showToast.success('資料庫已完整重置');
      await loadStats();
    } catch (error) {
      console.error('重置失敗：', error);
      showToast.error('重置失敗，請重新整理頁面');
    } finally {
      setIsLoading(false);
    }
  };

  // 清空提案紀錄
  const handleClearProposals = async () => {
    if (
      !confirm(
        '確定要清空所有提案紀錄嗎？\n\n此操作將刪除所有歷史提案，但保留電器資料。\n\n此操作無法復原！'
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      await clearProposals();
      showToast.success('提案紀錄已清空');
      await loadStats();
    } catch (error) {
      console.error('清空失敗：', error);
      showToast.error('清空失敗');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* 標題區域 */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">資料庫管理</h1>
        <p className="text-gray-600">資料庫統計、重置功能與 Demo 情境準備</p>
      </div>

      {/* 統計資訊卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900">{stats.appliances}</div>
              <div className="text-sm text-blue-700">電器商品</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-green-900">{stats.proposals}</div>
              <div className="text-sm text-green-700">提案紀錄</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-purple-900">{stats.seedVersion}</div>
              <div className="text-sm text-purple-700">Seed 版本</div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo 情境準備說明 */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 mb-8 border border-primary-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2 text-primary-600" />
          Demo 情境準備建議
        </h2>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <span className="text-primary-600 font-bold">1.</span>
            <p>
              <strong>完整重置資料庫</strong>：Demo 前執行，確保資料乾淨（15 款 Seed
              Data，0 筆提案）
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-600 font-bold">2.</span>
            <p>
              <strong>建立示範提案</strong>：走完 1~2 次問卷流程，建立不同情境的提案紀錄
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-600 font-bold">3.</span>
            <p>
              <strong>測試 QR Code</strong>：生成 QR Code
              並用手機掃描，或使用「模擬消費者手機畫面」按鈕
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-600 font-bold">4.</span>
            <p>
              <strong>展示商品管理</strong>：新增、編輯、刪除電器示範 CRUD 功能
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-600 font-bold">5.</span>
            <p>
              <strong>展示歷史紀錄</strong>：查詢、篩選、查看詳情、刪除提案
            </p>
          </div>
        </div>
      </div>

      {/* 操作區域 */}
      <div className="space-y-4">
        {/* 刷新統計 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">刷新統計資訊</h3>
              <p className="text-sm text-gray-600">重新載入資料庫統計數據</p>
            </div>
            <button
              onClick={loadStats}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>刷新</span>
            </button>
          </div>
        </div>

        {/* 清空提案紀錄 */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Trash2 className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-bold text-gray-900">清空提案紀錄</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                刪除所有歷史提案紀錄，但保留電器商品資料。適合 Demo 前清理測試資料。
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  ⚠️ 此操作無法復原，請謹慎使用
                </p>
              </div>
            </div>
            <button
              onClick={handleClearProposals}
              disabled={isLoading || stats.proposals === 0}
              className="ml-4 flex items-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex-shrink-0"
            >
              <Trash2 className="w-5 h-5" />
              <span>清空提案</span>
            </button>
          </div>
        </div>

        {/* 完整重置資料庫 */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-bold text-gray-900">完整重置資料庫</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                刪除所有資料（電器 + 提案），並重新載入 15 款 Seed Data。適合 Demo
                前完整重置。
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-red-800 font-medium">
                  🚨 危險操作：所有資料將被刪除且無法復原！
                </p>
              </div>
            </div>
            <button
              onClick={handleResetDatabase}
              disabled={isLoading}
              className="ml-4 flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex-shrink-0"
            >
              <Database className="w-5 h-5" />
              <span>完整重置</span>
            </button>
          </div>
        </div>
      </div>

      {/* Demo 流程建議 */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Demo 流程建議</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">智慧提案流程</h4>
              <p className="text-sm text-gray-600">
                示範 4 步驟問卷 → 查看 3 組推薦套餐 → 選擇套餐 → 生成 QR Code
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">消費者體驗</h4>
              <p className="text-sm text-gray-600">
                點擊「模擬消費者手機畫面」→ 展示手機版提案單 → 查看電器清單與價格
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">商品管理功能</h4>
              <p className="text-sm text-gray-600">
                示範新增電器 → 編輯電器 → 搜尋/篩選 → 刪除電器
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">歷史紀錄查詢</h4>
              <p className="text-sm text-gray-600">
                示範篩選提案 → 查看詳情 → 複製提案連結 → 刪除提案
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              5
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">RWD 響應式展示</h4>
              <p className="text-sm text-gray-600">
                切換 DevTools 裝置模式 → 展示手機/iPad/桌面版介面
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatabaseManagementPage;
