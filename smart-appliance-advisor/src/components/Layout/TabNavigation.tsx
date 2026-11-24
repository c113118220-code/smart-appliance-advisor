import { Link, useLocation } from 'react-router-dom';
import { Lightbulb, Database, History, Box } from 'lucide-react';

interface Tab {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const tabs: Tab[] = [
  {
    path: '/',
    label: '智慧提案',
    icon: <Lightbulb className="w-5 h-5" />,
  },
  {
    path: '/admin/appliances',
    label: '商品管理',
    icon: <Database className="w-5 h-5" />,
  },
  {
    path: '/admin/proposals',
    label: '歷史紀錄',
    icon: <History className="w-5 h-5" />,
  },
  {
    path: '/3d-preview',
    label: '3D 空間擬真',
    icon: <Box className="w-5 h-5" />,
    badge: '第二階段',
  },
];

function TabNavigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Logo 與導覽列容器 */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">全國電子 Digital City</h1>
              <p className="text-xs text-gray-600">智慧家電提案系統</p>
            </div>
          </div>

          {/* Tab 導覽（桌面版） */}
          <div className="hidden md:flex space-x-1">
            {tabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`
                  relative flex items-center space-x-2 px-4 py-2 rounded-lg
                  transition-all duration-200 font-medium
                  ${
                    isActive(tab.path)
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Tab 導覽（手機版 - 底部固定） */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="grid grid-cols-4 gap-1 p-2">
            {tabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`
                  relative flex flex-col items-center justify-center py-2 rounded-lg
                  transition-all duration-200 text-xs
                  ${
                    isActive(tab.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 active:bg-gray-100'
                  }
                `}
              >
                {tab.icon}
                <span className="mt-1 font-medium truncate w-full text-center px-1">
                  {tab.label}
                </span>
                {tab.badge && (
                  <span className="absolute top-0 right-1 bg-orange-500 text-white text-[8px] px-1 py-0.5 rounded-full font-bold">
                    階段2
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TabNavigation;
