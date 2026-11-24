/**
 * 步驟 1：選擇使用者族群
 */

import { User, Users, Home, UserCheck } from 'lucide-react';
import StepContainer from './StepContainer';
import OptionCard from './OptionCard';

interface Step1DemographicProps {
  selectedValue: string;
  onSelect: (value: string) => void;
}

const options = [
  {
    value: 'senior_solo',
    icon: <User className="w-12 h-12" />,
    title: '獨居長輩',
    description: '單身或獨居的銀髮族，重視安全與簡易操作',
  },
  {
    value: 'young_family',
    icon: <Users className="w-12 h-12" />,
    title: '雙薪小家庭',
    description: '年輕夫妻或小家庭，追求效率與品質',
  },
  {
    value: 'multi_generation',
    icon: <Home className="w-12 h-12" />,
    title: '三代同堂',
    description: '祖孫三代同住，需要全方位的家電配置',
  },
  {
    value: 'single_renter',
    icon: <UserCheck className="w-12 h-12" />,
    title: '單身租屋族',
    description: '租屋族或單身貴族，需要彈性與經濟實惠',
  },
];

function Step1Demographic({ selectedValue, onSelect }: Step1DemographicProps) {
  return (
    <StepContainer
      title="您的家庭組成？"
      description="選擇最符合的家庭型態，我們將為您推薦最適合的家電組合"
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

export default Step1Demographic;
