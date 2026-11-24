/**
 * 步驟 3：選擇核心生活需求（多選）
 */

import { Eye, Heart, AlertCircle } from 'lucide-react';
import StepContainer from './StepContainer';
import OptionCard from './OptionCard';

interface Step3LifeNeedsProps {
  selectedValues: string[];
  onSelect: (value: string) => void;
}

const options = [
  {
    value: 'smartMonitoring',
    icon: <Eye className="w-12 h-12" />,
    title: '智慧監控',
    description: '即時掌握居家狀況，遠端監看安心無虞',
  },
  {
    value: 'lifeAssistance',
    icon: <Heart className="w-12 h-12" />,
    title: '生活輔助',
    description: '智慧家電減輕家務負擔，提升生活品質',
  },
  {
    value: 'emergencyRescue',
    icon: <AlertCircle className="w-12 h-12" />,
    title: '緊急救援',
    description: '意外偵測與即時通報，守護家人安全',
  },
];

function Step3LifeNeeds({ selectedValues, onSelect }: Step3LifeNeedsProps) {
  const handleToggle = (value: string) => {
    onSelect(value);
  };

  return (
    <StepContainer
      title="您的核心生活需求？"
      description="可複選多個需求，我們將優先推薦符合的家電（至少選擇一項）"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {options.map((option) => (
          <OptionCard
            key={option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            value={option.value}
            isSelected={selectedValues.includes(option.value)}
            onClick={() => handleToggle(option.value)}
            isMultiSelect
          />
        ))}
      </div>

      {/* 提示訊息 */}
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r">
        <p className="text-sm text-blue-700">
          💡 提示：選擇越多需求，推薦結果會更貼近您的期待
        </p>
      </div>
    </StepContainer>
  );
}

export default Step3LifeNeeds;
