/**
 * 歷史提案紀錄查詢頁面
 */

import { useState, useEffect } from 'react';
import { RefreshCw, FileText, Trash2 } from 'lucide-react';
import { Proposal } from '@/types/proposal';
import {
  getAllProposals,
  searchProposals,
  deleteProposal,
} from '@/services/proposalService';
import { showToast } from '@/stores/appStore';
import ProposalFilterBar from '@/components/Proposal/ProposalFilterBar';
import ProposalCard from '@/components/Proposal/ProposalCard';
import ProposalDetailModal from '@/components/Proposal/ProposalDetailModal';

function ProposalHistoryPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 篩選條件
  const [searchQuery, setSearchQuery] = useState('');
  const [demographic, setDemographic] = useState('');
  const [layout, setLayout] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal 狀態
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 載入所有提案
  const loadProposals = async () => {
    try {
      setIsLoading(true);
      const data = await getAllProposals();
      setProposals(data);
    } catch (error) {
      console.error('載入提案失敗：', error);
      showToast.error('載入提案失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始載入
  useEffect(() => {
    loadProposals();
  }, []);

  // 執行搜尋
  const handleSearch = async () => {
    try {
      setIsLoading(true);

      // 如果有搜尋關鍵字，先過濾 ID
      let results = await getAllProposals();

      if (searchQuery.trim()) {
        results = results.filter((p) =>
          p.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // 套用其他篩選條件
      const filters: any = {};
      if (demographic) filters.demographic = demographic;
      if (layout) filters.layout = layout;
      if (startDate) filters.startDate = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filters.endDate = end;
      }

      if (Object.keys(filters).length > 0) {
        results = await searchProposals(filters);
      }

      setProposals(results);
    } catch (error) {
      console.error('搜尋失敗：', error);
      showToast.error('搜尋失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 重置搜尋
  const handleReset = async () => {
    setSearchQuery('');
    setDemographic('');
    setLayout('');
    setStartDate('');
    setEndDate('');
    await loadProposals();
  };

  // 查看詳情
  const handleView = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  // 刪除提案
  const handleDelete = async (proposal: Proposal) => {
    if (
      !confirm(
        `確定要刪除此提案嗎？\n提案編號：${proposal.id.slice(0, 12)}\n此操作無法復原。`
      )
    ) {
      return;
    }

    try {
      await deleteProposal(proposal.id);
      showToast.success('已刪除提案');
      await loadProposals();
    } catch (error) {
      console.error('刪除失敗：', error);
      showToast.error('刪除失敗');
    }
  };

  // 批次刪除所有提案
  const handleDeleteAll = async () => {
    if (proposals.length === 0) {
      showToast.warning('沒有提案可刪除');
      return;
    }

    if (
      !confirm(
        `確定要刪除所有 ${proposals.length} 筆提案嗎？\n此操作無法復原，建議謹慎使用。`
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      for (const proposal of proposals) {
        await deleteProposal(proposal.id);
      }
      showToast.success(`已刪除 ${proposals.length} 筆提案`);
      await loadProposals();
    } catch (error) {
      console.error('批次刪除失敗：', error);
      showToast.error('批次刪除失敗');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* 標題區域 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">歷史提案紀錄</h1>
            <p className="text-gray-600">查詢、檢視、管理過往的提案紀錄</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadProposals}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>重新載入</span>
            </button>

            {proposals.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="flex items-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
              >
                <Trash2 className="w-5 h-5" />
                <span>清空全部</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 搜尋與篩選 */}
      <ProposalFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        demographic={demographic}
        onDemographicChange={setDemographic}
        layout={layout}
        onLayoutChange={setLayout}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* 提案列表 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">載入中...</p>
          </div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">查無提案紀錄</h3>
          <p className="text-gray-500">請調整搜尋條件，或開始建立新的提案</p>
        </div>
      ) : (
        <>
          {/* 統計資訊 */}
          <div className="mb-6 flex items-center justify-between text-sm text-gray-600">
            <span>共 {proposals.length} 筆提案</span>
            <div className="flex items-center space-x-4">
              <span>
                獨居長輩：
                {
                  proposals.filter((p) => p.customerSelections.demographic === 'senior_solo')
                    .length
                }
              </span>
              <span>
                雙薪小家庭：
                {
                  proposals.filter((p) => p.customerSelections.demographic === 'young_family')
                    .length
                }
              </span>
              <span>
                三代同堂：
                {
                  proposals.filter(
                    (p) => p.customerSelections.demographic === 'multi_generation'
                  ).length
                }
              </span>
              <span>
                單身租屋族：
                {
                  proposals.filter((p) => p.customerSelections.demographic === 'single_renter')
                    .length
                }
              </span>
            </div>
          </div>

          {/* 卡片網格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* 詳細檢視 Modal */}
      <ProposalDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProposal(null);
        }}
        proposal={selectedProposal}
      />
    </div>
  );
}

export default ProposalHistoryPage;
