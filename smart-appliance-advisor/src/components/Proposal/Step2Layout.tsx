/**
 * 步驟 2：選擇房屋格局
 */

import { Square, Home as HomeIcon, Building, Building2 } from 'lucide-react';
import StepContainer from './StepContainer';
import OptionCard from './OptionCard';

interface Step2LayoutProps {
  selectedValue: string;
  onSelect: (value: string) => void;
}

const options = [
  {
    value: 'studio',
    icon: <Square className="w-12 h-12" />,
    title: '套房',
    description: '單一空間或小坪數套房（10-15 坪）',
  },
  {
    value: '2br',
    icon: <HomeIcon className="w-12 h-12" />,
    title: '兩房一廳',
    description: '標準兩房格局（20-30 坪）',
  },
  {
    value: '3br',
    icon: <Building className="w-12 h-12" />,
    title: '三房兩廳',
    description: '寬敞三房格局（30-45 坪）',
  },
  {
    value: 'house',
    icon: <Building2 className="w-12 h-12" />,
    title: '透天厝',
    description: '獨棟透天或別墅（45 坪以上）',
  },
];

function Step2Layout({ selectedValue, onSelect }: Step2LayoutProps) {
  return (
    <StepContainer
      title="您的房屋格局？"
      description="選擇您的居住空間類型，幫助我們推薦適合尺寸的家電"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {options.map((option) => (
          <OptionCard
            key={option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            value={option.value}
            isSelected={selectedValue === option.value}
            onClick={() => onSelect(option.value)}
          />
        ))}
      </div>
    </StepContainer>
  );
}

export default Step2Layout;
