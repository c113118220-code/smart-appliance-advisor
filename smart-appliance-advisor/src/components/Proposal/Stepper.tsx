/**
 * 問卷進度指示器元件
 */

import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

function Stepper({ currentStep, totalSteps, steps }: StepperProps) {
  return (
    <div className="w-full mb-8">
      {/* 桌面版：橫向步驟條 */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center flex-1">
              {/* 步驟圓圈 */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    font-bold text-lg transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-primary-600 text-white'
                        : isCurrent
                        ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : stepNumber}
                </div>
                <div
                  className={`
                    mt-2 text-sm font-medium transition-colors
                    ${isCurrent ? 'text-primary-600' : 'text-gray-600'}
                  `}
                >
                  {step}
                </div>
              </div>
              
              {/* 連接線 */}
              {stepNumber < totalSteps && (
                <div
                  className={`
                    flex-1 h-1 mx-4 transition-all duration-300
                    ${stepNumber < currentStep ? 'bg-primary-600' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 手機版：文字 + 進度條 */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-gray-600">
            步驟 {currentStep} / {totalSteps}
          </div>
          <div className="text-sm font-medium text-primary-600">
            {steps[currentStep - 1]}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default Stepper;
