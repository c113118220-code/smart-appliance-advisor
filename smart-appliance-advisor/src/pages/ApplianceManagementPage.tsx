/**
 * 商品資料庫管理頁面（CRUD）
 */

import { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Appliance } from '@/types/appliance';
import {
  getAllAppliances,
  searchAppliances,
  createAppliance,
  updateAppliance,
  deleteAppliance,
  getAllBrands,
  SearchFilters,
} from '@/services/applianceService';
import { showToast } from '@/stores/appStore';
import SearchBar from '@/components/Appliance/SearchBar';
import ApplianceTable from '@/components/Appliance/ApplianceTable';
import ApplianceFormModal from '@/components/Appliance/ApplianceFormModal';

function ApplianceManagementPage() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 搜尋與篩選
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});

  // Modal 狀態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);

  // 載入商品列表
  const loadAppliances = async () => {
    try {
      setIsLoading(true);
      const data = await getAllAppliances();
      setAppliances(data);
      
      // 載入品牌列表
      const brandList = await getAllBrands();
      setBrands(brandList);
    } catch (error) {
      console.error('載入商品失敗：', error);
      showToast.error('載入商品失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始載入
  useEffect(() => {
    loadAppliances();
  }, []);

  // 執行搜尋
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const results = await searchAppliances(searchQuery, filters);
      setAppliances(results);
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
    setFilters({});
    await loadAppliances();
  };

  // 新增商品
  const handleCreate = () => {
    setEditingAppliance(null);
    setIsModalOpen(true);
  };

  // 編輯商品
  const handleEdit = (appliance: Appliance) => {
    setEditingAppliance(appliance);
    setIsModalOpen(true);
  };

  // 刪除商品
  const handleDelete = async (appliance: Appliance) => {
    if (
      !confirm(`確定要刪除「${appliance.name}」嗎？\n此操作無法復原，且可能影響現有提案紀錄。`)
    ) {
      return;
    }

    try {
      await deleteAppliance(appliance.id);
      showToast.success(`已刪除「${appliance.name}」`);
      await loadAppliances();
    } catch (error) {
      console.error('刪除失敗：', error);
      showToast.error('刪除失敗');
    }
  };

  // 提交表單
  const handleSubmit = async (data: Partial<Appliance>) => {
    try {
      setIsSaving(true);

      if (editingAppliance) {
        // 更新
        await updateAppliance(editingAppliance.id, data);
        showToast.success(`已更新「${data.name}」`);
      } else {
        // 新增
        await createAppliance(data as Omit<Appliance, 'id' | 'createdAt' | 'updatedAt'>);
        showToast.success(`已新增「${data.name}」`);
      }

      setIsModalOpen(false);
      setEditingAppliance(null);
      await loadAppliances();
    } catch (error) {
      console.error('儲存失敗：', error);
      showToast.error('儲存失敗');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* 標題區域 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">商品資料庫管理</h1>
            <p className="text-gray-600">新增、編輯、刪除電器商品資料</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadAppliances}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>重新載入</span>
            </button>

            <button
              onClick={handleCreate}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>新增商品</span>
            </button>
          </div>
        </div>
      </div>

      {/* 搜尋與篩選 */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
        brands={brands}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* 商品列表 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">載入中...</p>
          </div>
        </div>
      ) : (
        <ApplianceTable
          appliances={appliances}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* 新增/編輯 Modal */}
      <ApplianceFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAppliance(null);
        }}
        onSubmit={handleSubmit}
        appliance={editingAppliance}
        isLoading={isSaving}
      />
    </div>
  );
}

export default ApplianceManagementPage;
