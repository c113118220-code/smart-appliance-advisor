/**
 * 選項卡片元件（支援單選與多選）
 */

import { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface OptionCardProps {
  icon: ReactNode;
  title: string;
  description?: string;
  value: string;
  isSelected: boolean;
  onClick: () => void;
  isMultiSelect?: boolean;
}

function OptionCard({
  icon,
  title,
  description,
  value,
  isSelected,
  onClick,
  isMultiSelect = false,
}: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-full p-6 rounded-xl border-2 transition-all duration-200
        text-left
        min-h-[140px] md:min-h-[160px]
        ${
          isSelected
            ? 'border-primary-600 bg-primary-50 shadow-lg scale-105'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }
      `}
    >
      {/* 選中指示器 */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}

      {/* 圖示 */}
      <div
        className={`
          mb-4 transition-colors
          ${isSelected ? 'text-primary-600' : 'text-gray-600'}
        `}
      >
        {icon}
      </div>

      {/* 標題 */}
      <h3
        className={`
          text-lg md:text-xl font-bold mb-2 transition-colors
          ${isSelected ? 'text-primary-900' : 'text-gray-900'}
        `}
      >
        {title}
      </h3>

      {/* 描述 */}
      {description && (
        <p
          className={`
            text-sm transition-colors
            ${isSelected ? 'text-primary-700' : 'text-gray-600'}
          `}
        >
          {description}
        </p>
      )}

      {/* 多選提示 */}
      {isMultiSelect && (
        <div className="mt-3 text-xs text-gray-500">
          {isSelected ? '✓ 已選擇' : '點擊選擇'}
        </div>
      )}
    </button>
  );
}

export default OptionCard;
