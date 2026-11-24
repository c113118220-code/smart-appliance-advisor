/**
 * 智慧提案問卷主頁面（4 步驟精靈）
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useProposalStore } from '@/stores/proposalStore';
import { showToast } from '@/stores/appStore';
import { generateRecommendations } from '@/services/recommendationEngine';
import Stepper from '@/components/Proposal/Stepper';
import Step1Demographic from '@/components/Proposal/Step1Demographic';
import Step2Layout from '@/components/Proposal/Step2Layout';
import Step3LifeNeeds from '@/components/Proposal/Step3LifeNeeds';
import Step4ApplianceNeeds from '@/components/Proposal/Step4ApplianceNeeds';
import { useState } from 'react';

const STEP_NAMES = ['選擇族群', '選擇格局', '生活需求', '電器需求'];

function ProposalWizardPage() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const {
    currentStep,
    selections,
    updateSelection,
    nextStep,
    prevStep,
    setRecommendedPackages,
  } = useProposalStore();

  // 處理單選更新
  const handleSingleSelect = (field: 'demographic' | 'layout', value: string) => {
    updateSelection(field, value);
  };

  // 處理多選更新（切換）
  const handleMultiSelect = (field: 'lifeNeeds' | 'applianceNeeds', value: string) => {
    const currentValues = selections[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    updateSelection(field, newValues);
  };

  // 驗證當前步驟是否完成
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selections.demographic !== '';
      case 2:
        return selections.layout !== '';
      case 3:
        return selections.lifeNeeds.length > 0;
      case 4:
        return selections.applianceNeeds.length > 0;
      default:
        return false;
    }
  };

  // 處理下一步
  const handleNext = () => {
    if (!isStepValid()) {
      showToast.warning('請完成當前步驟的選擇');
      return;
    }
    nextStep();
  };

  // 處理上一步
  const handlePrev = () => {
    prevStep();
  };

  // 生成推薦套餐
  const handleGenerateRecommendations = async () => {
    if (!isStepValid()) {
      showToast.warning('請完成所有選擇');
      return;
    }

    setIsGenerating(true);
    
    try {
      showToast.info('正在分析您的需求...');
      
      // 生成推薦
      const packages = await generateRecommendations(selections);
      setRecommendedPackages(packages);
      
      showToast.success(`成功生成 ${packages.length} 組專屬推薦套餐！`);
      
      // 跳轉到推薦結果頁面
      setTimeout(() => {
        navigate('/proposal/recommendations');
      }, 500);
      
    } catch (error) {
      console.error('生成推薦失敗：', error);
      showToast.error('生成推薦失敗，請稍後再試');
    } finally {
      setIsGenerating(false);
    }
  };

  // 渲染當前步驟內容
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Demographic
            selectedValue={selections.demographic}
            onSelect={(value) => handleSingleSelect('demographic', value)}
          />
        );
      case 2:
        return (
          <Step2Layout
            selectedValue={selections.layout}
            onSelect={(value) => handleSingleSelect('layout', value)}
          />
        );
      case 3:
        return (
          <Step3LifeNeeds
            selectedValues={selections.lifeNeeds}
            onSelect={(value) => handleMultiSelect('lifeNeeds', value)}
          />
        );
      case 4:
        return (
          <Step4ApplianceNeeds
            selectedValues={selections.applianceNeeds}
            onSelect={(value) => handleMultiSelect('applianceNeeds', value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* 標題區域 */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">智慧提案精靈</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          為您量身打造專屬家電方案
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          只需 4 個步驟，快速找到最適合您的智慧家電組合
        </p>
      </div>

      {/* 進度指示器 */}
      <Stepper
        currentStep={currentStep}
        totalSteps={4}
        steps={STEP_NAMES}
      />

      {/* 步驟內容 */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
        {renderStepContent()}
      </div>

      {/* 導覽按鈕 */}
      <div className="flex items-center justify-between">
        {/* 上一步按鈕 */}
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={`
            flex items-center space-x-2 px-6 py-3 rounded-lg
            transition-all duration-200
            ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">上一步</span>
        </button>

        {/* 步驟提示（手機版） */}
        <div className="md:hidden text-sm text-gray-600">
          {currentStep} / 4
        </div>

        {/* 下一步 / 生成套餐按鈕 */}
        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-lg
              transition-all duration-200 shadow-md
              ${
                isStepValid()
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <span>下一步</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleGenerateRecommendations}
            disabled={!isStepValid() || isGenerating}
            className={`
              flex items-center space-x-2 px-8 py-3 rounded-lg
              transition-all duration-200 shadow-lg
              ${
                isStepValid() && !isGenerating
                  ? 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-105'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span className="font-bold">
              {isGenerating ? '生成中...' : '生成推薦套餐'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ProposalWizardPage;
