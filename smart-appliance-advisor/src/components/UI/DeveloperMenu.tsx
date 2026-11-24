/**
 * 開發者選單（僅開發環境顯示）
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Database, Trash2, FileText, Settings } from 'lucide-react';
import { resetDatabase, clearProposals, getDatabaseStats } from '@/services/seedService';

interface DatabaseStats {
  appliances: number;
  proposals: number;
  seedVersion: string;
}

function DeveloperMenu() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 僅在開發環境顯示
  if (import.meta.env.PROD) {
    return null;
  }

  const loadStats = async () => {
    try {
      const data = await getDatabaseStats();
      setStats(data);
    } catch (error) {
      console.error('載入統計資訊失敗：', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  const handleResetDatabase = async () => {
    if (!confirm('確定要重置資料庫嗎？所有資料（包括提案紀錄）將被刪除並重新載入 Seed Data。')) {
      return;
    }

    setIsLoading(true);
    try {
      await resetDatabase();
      await loadStats();
      alert('✅ 資料庫已重置！');
    } catch (error) {
      alert('❌ 重置失敗，請查看 Console');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearProposals = async () => {
    if (!confirm('確定要清空所有提案紀錄嗎？')) {
      return;
    }

    setIsLoading(true);
    try {
      await clearProposals();
      await loadStats();
      alert('✅ 提案紀錄已清空！');
    } catch (error) {
      alert('❌ 清空失敗，請查看 Console');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 浮動按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 md:bottom-4 right-4 w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all z-40 flex items-center justify-center"
        title="開發者選單"
      >
        <Database className="w-6 h-6" />
      </button>

      {/* 選單面板 */}
      {isOpen && (
        <div className="fixed bottom-36 md:bottom-20 right-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-40 animate-scale-in">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 flex items-center">
              <Database className="w-5 h-5 mr-2" />
              開發者選單
            </h3>
            <p className="text-xs text-gray-500 mt-1">資料庫管理與測試工具</p>
          </div>

          <div className="p-4 space-y-4">
            {/* 資料庫統計 */}
            {stats && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="flex items-center mb-2">
                  <FileText className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="font-medium">資料庫統計</span>
                </div>
                <div className="space-y-1 text-gray-600">
                  <div>電器數量：{stats.appliances} 款</div>
                  <div>提案紀錄：{stats.proposals} 筆</div>
                  <div className="text-xs">Seed 版本：{stats.seedVersion}</div>
                </div>
              </div>
            )}

            {/* 操作按鈕 */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/admin/database');
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>資料庫管理</span>
              </button>

              <button
                onClick={handleResetDatabase}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>重置資料庫</span>
              </button>

              <button
                onClick={handleClearProposals}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                <span>清空提案紀錄</span>
              </button>

              <button
                onClick={loadStats}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-4 h-4" />
                <span>重新整理統計</span>
              </button>
            </div>

            {/* 說明文字 */}
            <div className="text-xs text-gray-500 border-t pt-3">
              <p>💡 提示：此選單僅在開發環境顯示</p>
            </div>
          </div>
        </div>
      )}

      {/* 遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default DeveloperMenu;
