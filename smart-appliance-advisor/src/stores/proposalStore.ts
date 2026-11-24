/**
 * 提案流程狀態管理（Zustand）
 * 管理問卷步驟、顧客選擇、推薦套餐、選定套餐
 */

import { create } from 'zustand';
import { CustomerSelections, Package } from '@/types/proposal';
import { Appliance } from '@/types/appliance';

interface ProposalStore {
  // 問卷流程狀態
  currentStep: number;
  totalSteps: number;
  
  // 顧客選擇（4 步驟問卷）
  selections: CustomerSelections;
  
  // 推薦結果
  recommendedPackages: Package[];
  selectedPackage: Package | null;
  
  // 3D 模組資料傳遞
  selectedAppliancesFor3D: Appliance[];
  
  // Actions：問卷導覽
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Actions：更新選擇
  updateSelection: <K extends keyof CustomerSelections>(
    field: K,
    value: CustomerSelections[K]
  ) => void;
  
  // Actions：推薦套餐
  setRecommendedPackages: (packages: Package[]) => void;
  selectPackage: (pkg: Package) => void;
  
  // Actions：3D 模組
  setAppliancesFor3D: (appliances: Appliance[]) => void;
  
  // Actions：重置
  resetProposal: () => void;
  resetSelections: () => void;
}

const initialSelections: CustomerSelections = {
  demographic: '',
  layout: '',
  lifeNeeds: [],
  applianceNeeds: [],
};

export const useProposalStore = create<ProposalStore>((set) => ({
  // 初始狀態
  currentStep: 1,
  totalSteps: 4,
  selections: initialSelections,
  recommendedPackages: [],
  selectedPackage: null,
  selectedAppliancesFor3D: [],
  
  // 問卷導覽
  setStep: (step) => set({ currentStep: step }),
  
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps),
    })),
  
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),
  
  // 更新選擇
  updateSelection: (field, value) =>
    set((state) => ({
      selections: {
        ...state.selections,
        [field]: value,
      },
    })),
  
  // 推薦套餐
  setRecommendedPackages: (packages) =>
    set({ recommendedPackages: packages }),
  
  selectPackage: (pkg) =>
    set({ selectedPackage: pkg }),
  
  // 3D 模組
  setAppliancesFor3D: (appliances) =>
    set({ selectedAppliancesFor3D: appliances }),
  
  // 重置
  resetProposal: () =>
    set({
      currentStep: 1,
      selections: initialSelections,
      recommendedPackages: [],
      selectedPackage: null,
      selectedAppliancesFor3D: [],
    }),
  
  resetSelections: () =>
    set({
      selections: initialSelections,
      currentStep: 1,
    }),
}));
