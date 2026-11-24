/**
 * 步驟容器元件（提供動畫與統一樣式）
 */

import { ReactNode } from 'react';

interface StepContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
}

function StepContainer({ title, description, children }: StepContainerProps) {
  return (
    <div className="animate-fade-in">
      {/* 標題區域 */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 text-sm md:text-base">{description}</p>
        )}
      </div>

      {/* 內容區域 */}
      <div className="animate-slide-up">{children}</div>
    </div>
  );
}

export default StepContainer;
