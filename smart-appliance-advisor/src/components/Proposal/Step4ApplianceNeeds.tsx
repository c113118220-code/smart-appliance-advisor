/**
 * 步驟 4：選擇核心電器需求（多選）
 */

import { Shield, Zap, Wind } from 'lucide-react';
import StepContainer from './StepContainer';
import OptionCard from './OptionCard';

interface Step4ApplianceNeedsProps {
  selectedValues: string[];
  onSelect: (value: string) => void;
}

const options = [
  {
    value: 'foolproofSafety',
    icon: <Shield className="w-12 h-12" />,
    title: '防呆安全',
    description: '操作簡單直覺，內建安全保護機制',
  },
  {
    value: 'energySaving',
    icon: <Zap className="w-12 h-12" />,
    title: '節能省電',
    description: '一級能效認證，環保又省荷包',
  },
  {
    value: 'healthyAir',
    icon: <Wind className="w-12 h-12" />,
    title: '健康空淨',
    description: '空氣清淨與除濕，打造健康居家環境',
  },
];

function Step4ApplianceNeeds({ selectedValues, onSelect }: Step4ApplianceNeedsProps) {
  const handleToggle = (value: string) => {
    onSelect(value);
  };

  return (
    <StepContainer
      title="您重視的電器特性？"
      description="可複選多個特性，我們將推薦最符合的家電產品（至少選擇一項）"
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

      {/* 已選擇提示 */}
      {selectedValues.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r">
          <p className="text-sm text-green-700">
            ✓ 已選擇 {selectedValues.length} 項特性
          </p>
        </div>
      )}
    </StepContainer>
  );
}

export default Step4ApplianceNeeds;
