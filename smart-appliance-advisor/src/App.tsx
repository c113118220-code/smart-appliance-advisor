import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from '@/components/Layout/AppLayout';
import { checkAndInitializeSeedData } from '@/services/seedService';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 應用程式啟動時檢查並初始化 Seed Data
    const initializeApp = async () => {
      try {
        await checkAndInitializeSeedData();
        setIsInitialized(true);
      } catch (err) {
        console.error('初始化失敗：', err);
        setError('資料庫初始化失敗，請重新整理頁面');
      }
    };

    initializeApp();
  }, []);

  // 載入中畫面
  if (!isInitialized && !error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">正在初始化系統...</p>
        </div>
      </div>
    );
  }

  // 錯誤畫面
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">初始化失敗</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            重新整理
          </button>
        </div>
      </div>
    );
  }

  // 正常運作
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
