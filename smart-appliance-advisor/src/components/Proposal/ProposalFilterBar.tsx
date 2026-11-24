/**
 * 提案歷史篩選列元件
 */

import { Search, Filter, X, Calendar } from 'lucide-react';

interface ProposalFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  demographic: string;
  onDemographicChange: (value: string) => void;
  layout: string;
  onLayoutChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

function ProposalFilterBar({
  searchQuery,
  onSearchChange,
  demographic,
  onDemographicChange,
  layout,
  onLayoutChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onSearch,
  onReset,
}: ProposalFilterBarProps) {
  const hasActiveFilters = demographic || layout || startDate || endDate;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      {/* 搜尋輸入框 */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜尋提案編號..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={onSearch}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          搜尋
        </button>
      </div>

      {/* 篩選器 */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Filter className="w-4 h-4" />
          <span className="font-medium">篩選條件</span>
        </div>

        {/* 族群篩選 */}
        <select
          value={demographic}
          onChange={(e) => onDemographicChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">全部族群</option>
          <option value="senior_solo">獨居長輩</option>
          <option value="young_family">雙薪小家庭</option>
          <option value="multi_generation">三代同堂</option>
          <option value="single_renter">單身租屋族</option>
        </select>

        {/* 格局篩選 */}
        <select
          value={layout}
          onChange={(e) => onLayoutChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">全部格局</option>
          <option value="studio">套房</option>
          <option value="2br">兩房一廳</option>
          <option value="3br">三房兩廳</option>
          <option value="house">透天厝</option>
        </select>

        {/* 日期範圍 */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <span className="text-gray-500">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* 重置按鈕 */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>清除篩選</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ProposalFilterBar;
