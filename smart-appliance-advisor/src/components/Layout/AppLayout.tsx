import { Routes, Route, useLocation } from 'react-router-dom';
import TabNavigation from './TabNavigation';
import DeveloperMenu from '@/components/UI/DeveloperMenu';
import Toast from '@/components/UI/Toast';
import TestDatabasePage from '@/pages/TestDatabasePage';
import TestRecommendationPage from '@/pages/TestRecommendationPage';
import TestZustandPage from '@/pages/TestZustandPage';
import ThreeDPreviewPage from '@/pages/ThreeDPreviewPage';
import ProposalWizardPage from '@/pages/ProposalWizardPage';
import ProposalRecommendationPage from '@/pages/ProposalRecommendationPage';
import QRCodeGenerationPage from '@/pages/QRCodeGenerationPage';
import ConsumerProposalPage from '@/pages/ConsumerProposalPage';
import ApplianceManagementPage from '@/pages/ApplianceManagementPage';
import ProposalHistoryPage from '@/pages/ProposalHistoryPage';
import DatabaseManagementPage from '@/pages/DatabaseManagementPage';

// 暫時的佔位頁面元件
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-primary-600 mb-4">{title}</h1>
      <p className="text-gray-600">頁面開發中...</p>
    </div>
  </div>
);

function AppLayout() {
  const location = useLocation();
  // 消費者頁面不顯示導覽列和頁尾
  const isConsumerPage = location.pathname === '/consumer';

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* 頂部導覽列（消費者頁面不顯示） */}
      {!isConsumerPage && <TabNavigation />}

      {/* 主要內容區域 */}
      <main className={`flex-1 ${isConsumerPage ? '' : 'container mx-auto px-4 py-4 sm:py-6 md:px-6 md:py-8 lg:px-8 mb-20 md:mb-0'}`}>
        <Routes>
          <Route path="/" element={<ProposalWizardPage />} />
          <Route path="/proposal/recommendations" element={<ProposalRecommendationPage />} />
          <Route path="/proposal/qrcode" element={<QRCodeGenerationPage />} />
          <Route path="/consumer" element={<ConsumerProposalPage />} />
          <Route path="/test/zustand" element={<TestZustandPage />} />
          <Route path="/test/recommendation" element={<TestRecommendationPage />} />
          <Route path="/test/database" element={<TestDatabasePage />} />
          <Route path="/admin/appliances" element={<ApplianceManagementPage />} />
          <Route path="/admin/proposals" element={<ProposalHistoryPage />} />
          <Route path="/admin/database" element={<DatabaseManagementPage />} />
          <Route path="/3d-preview" element={<ThreeDPreviewPage />} />
        </Routes>
      </main>

      {/* 頁尾（消費者頁面不顯示） */}
      {!isConsumerPage && (
        <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-600 mb-16 md:mb-0">
          <p>© 2026 全國電子 Digital City | 智慧家電門市提案系統</p>
        </footer>
      )}

      {/* Toast 通知 */}
      <Toast />

      {/* 開發者選單（僅開發環境顯示） */}
      {!isConsumerPage && <DeveloperMenu />}
    </div>
  );
}

export default AppLayout;
