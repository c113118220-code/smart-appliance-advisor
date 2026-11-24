/**
 * 測試資料庫頁面（驗收用）
 */

import { useEffect, useState } from 'react';
import { db } from '@/db/database';
import { Appliance } from '@/types/appliance';

function TestDatabasePage() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppliances = async () => {
      try {
        const data = await db.appliances.toArray();
        setAppliances(data);
      } catch (error) {
        console.error('載入電器資料失敗：', error);
      } finally {
        setLoading(false);
      }
    };

    loadAppliances();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  const categoryLabels = {
    large: '大型家電',
    small: '健康/生活小家電',
    smart: '智慧監控/安全裝置',
  };

  const groupedAppliances = {
    large: appliances.filter(a => a.category === 'large'),
    small: appliances.filter(a => a.category === 'small'),
    smart: appliances.filter(a => a.category === 'smart'),
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📦 資料庫測試頁面
        </h1>
        <p className="text-gray-600">
          成功載入 <span className="font-bold text-primary-600">{appliances.length}</span> 款電器
        </p>
      </div>

      {Object.entries(groupedAppliances).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            {categoryLabels[category as keyof typeof categoryLabels]}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({items.length} 款)
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((appliance) => (
              <div
                key={appliance.id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-gray-900 mb-2">{appliance.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>品牌：{appliance.brand}</p>
                  <p className="text-primary-600 font-bold">
                    NT$ {appliance.price.toLocaleString()}
                  </p>
                  <p>
                    尺寸：{appliance.widthCm} × {appliance.depthCm} × {appliance.heightCm} cm
                  </p>
                  <div className="pt-2 flex flex-wrap gap-1">
                    {appliance.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TestDatabasePage;
