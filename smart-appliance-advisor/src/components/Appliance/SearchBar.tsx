/**
 * 商品搜尋與篩選列元件
 */

import { Search, Filter, X } from 'lucide-react';
import { SearchFilters } from '@/services/applianceService';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  brands: string[];
  onSearch: () => void;
  onReset: () => void;
}

function SearchBar({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  brands,
  onSearch,
  onReset,
}: SearchBarProps) {
  const hasActiveFilters =
    filters.category || filters.brand || filters.minPrice || filters.maxPrice;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      {/* 搜尋輸入框 */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜尋商品名稱或品牌..."
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
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Filter className="w-4 h-4" />
          <span className="font-medium">篩選條件</span>
        </div>

        {/* 類別篩選 */}
        <select
          value={filters.category || ''}
          onChange={(e) =>
            onFilterChange({ ...filters, category: e.target.value || undefined })
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">全部類別</option>
          <option value="large">大型家電</option>
          <option value="small">小型家電</option>
          <option value="smart">智慧家電</option>
        </select>

        {/* 品牌篩選 */}
        <select
          value={filters.brand || ''}
          onChange={(e) => onFilterChange({ ...filters, brand: e.target.value || undefined })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">全部品牌</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        {/* 價格範圍 */}
        <input
          type="number"
          placeholder="最低價格"
          value={filters.minPrice || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              minPrice: e.target.value ? parseInt(e.target.value) : undefined,
            })
          }
          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <span className="text-gray-500">-</span>
        <input
          type="number"
          placeholder="最高價格"
          value={filters.maxPrice || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              maxPrice: e.target.value ? parseInt(e.target.value) : undefined,
            })
          }
          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />

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

export default SearchBar;
