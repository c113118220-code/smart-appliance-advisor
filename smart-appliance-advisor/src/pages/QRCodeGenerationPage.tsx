/**
 * QR Code 生成頁面（B2B - 門市顧問使用）
 * 生成消費者提案 QR Code，並提供模擬手機檢視功能
 */

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  Download,
  Share2,
  Smartphone,
  CheckCircle,
  Package,
  AlertCircle,
} from 'lucide-react';
import { useProposalStore } from '@/stores/proposalStore';
import { showToast } from '@/stores/appStore';
import { generateConsumerProposalUrl, formatPrice } from '@/lib/proposalEncoder';
import { createProposal } from '@/services/proposalService';
import { getAppliancesByIds } from '@/services/applianceService';
import { Appliance } from '@/types/appliance';

function QRCodeGenerationPage() {
  const navigate = useNavigate();
  const { selectedPackage, selections, resetProposal } = useProposalStore();

  const [consumerUrl, setConsumerUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedProposalId, setSavedProposalId] = useState<string | null>(null);
  const [appliances, setAppliances] = useState<Appliance[]>([]);

  // 防止 React StrictMode 重複儲存提案
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (!selectedPackage) {
      showToast.warning('尚未選擇套餐，返回推薦頁面');
      navigate('/proposal/recommendations');
      return;
    }

    // 生成消費者提案 URL
    const url = generateConsumerProposalUrl(selectedPackage);
    setConsumerUrl(url);

    // 載入電器資料（用於統計類別）
    loadAppliances();

    // 自動儲存提案到歷史紀錄（嚴格只執行一次）
    if (!hasSavedRef.current) {
      hasSavedRef.current = true;
      handleSaveProposal();
    }
  }, [selectedPackage, navigate]);

  // 載入電器資料
  const loadAppliances = async () => {
    if (!selectedPackage) return;
    try {
      const applianceList = await getAppliancesByIds(selectedPackage.appliances);
      setAppliances(applianceList);
    } catch (error) {
      console.error('載入電器失敗：', error);
    }
  };

  // 儲存提案到歷史紀錄
  const handleSaveProposal = async () => {
    if (!selectedPackage || savedProposalId) return;

    try {
      setIsSaving(true);

      const proposalId = await createProposal({
        customerSelections: {
          demographic: selections.demographic,
          layout: selections.layout,
          lifeNeeds: selections.lifeNeeds,
          applianceNeeds: selections.applianceNeeds,
        },
        selectedPackage: {
          packageId: selectedPackage.packageId,
          appliances: selectedPackage.appliances,
          finalPrice: selectedPackage.totalPrice, // 將 totalPrice 轉換為 finalPrice
        },
        recommendedPackages: [], // 可選：如果需要保存推薦套餐歷史
        qrCodeData: '', // 暫時留空，可在未來擴充
      });

      setSavedProposalId(proposalId);
      showToast.success('提案已自動儲存到歷史紀錄');
    } catch (error) {
      console.error('儲存提案失敗：', error);
      showToast.error('儲存失敗，但不影響 QR Code 使用');
    } finally {
      setIsSaving(false);
    }
  };

  // 下載 QR Code 圖片
  const handleDownloadQRCode = () => {
    try {
      const svg = document.getElementById('qr-code-svg') as SVGElement;
      if (!svg) return;

      // 將 SVG 轉換為 PNG
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `proposal-${selectedPackage?.packageId.slice(0, 8)}.png`;
          link.click();
          URL.revokeObjectURL(url);
        });
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      showToast.success('QR Code 已下載');
    } catch (error) {
      console.error('下載失敗：', error);
      showToast.error('下載失敗，請稍後再試');
    }
  };

  // 複製連結
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(consumerUrl);
      showToast.success('提案連結已複製到剪貼簿');
    } catch (error) {
      console.error('複製失敗：', error);
      showToast.error('複製失敗，請手動複製');
    }
  };

  // 模擬手機檢視（在新分頁開啟消費者頁面）
  const handleSimulateMobileView = () => {
    window.open(consumerUrl, '_blank', 'width=375,height=812');
    showToast.info('已開啟模擬手機檢視視窗');
  };

  // 完成並重新開始
  const handleFinishAndRestart = () => {
    if (confirm('確定要結束並重新開始新的提案流程嗎？')) {
      resetProposal();
      navigate('/');
      showToast.success('已重置，可開始新提案');
    }
  };

  if (!selectedPackage) {
    return null;
  }

  // 中文標籤對照表
  const demographicLabels: Record<string, string> = {
    senior_solo: '獨居長輩',
    young_family: '雙薪小家庭',
    multi_generation: '三代同堂',
    single_renter: '單身租屋族',
  };

  const layoutLabels: Record<string, string> = {
    studio: '套房',
    '2br': '兩房一廳',
    '3br': '三房兩廳',
    house: '透天厝',
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* 標題區域 */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/proposal/recommendations')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回推薦結果</span>
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">提案完成</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            掃描 QR Code 分享給顧客
          </h1>
          <p className="text-gray-600">顧客可在手機上查看完整的提案內容</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左側：QR Code 區域 */}
        <div className="space-y-6">
          {/* QR Code 卡片 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">掃描 QR Code</h2>
              <p className="text-sm text-gray-600">請顧客使用手機相機掃描</p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6 bg-white p-6 rounded-xl border-4 border-gray-100">
              <QRCodeSVG
                id="qr-code-svg"
                value={consumerUrl}
                size={280}
                level="H"
                includeMargin={true}
                fgColor="#1F2937"
                bgColor="#FFFFFF"
              />
            </div>

            {/* 操作按鈕 */}
            <div className="space-y-3">
              <button
                onClick={handleDownloadQRCode}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <Download className="w-5 h-5" />
                <span>下載 QR Code 圖片</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <Share2 className="w-5 h-5" />
                <span>複製提案連結</span>
              </button>

              <button
                onClick={handleSimulateMobileView}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-50 text-blue-700 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium"
              >
                <Smartphone className="w-5 h-5" />
                <span>模擬消費者手機畫面</span>
              </button>
            </div>

            {/* 提示訊息 */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Demo 提醒</p>
                  <p>
                    若 QR Code 掃描不穩定，可使用「模擬消費者手機畫面」按鈕直接查看效果
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 儲存狀態 */}
          {savedProposalId && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <p className="font-medium">提案已儲存到歷史紀錄</p>
                  <p className="text-sm text-green-600">編號：{savedProposalId.slice(0, 12)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 右側：套餐摘要 */}
        <div className="space-y-6">
          {/* 套餐資訊卡片 */}
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Package className="w-6 h-6" />
                <h2 className="text-2xl font-bold">{selectedPackage.packageName}</h2>
              </div>
              <p className="text-primary-100">已選擇的推薦套餐</p>
            </div>

            <div className="p-6 space-y-4">
              {/* 價格資訊 */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-gray-600">套餐總價</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${formatPrice(selectedPackage.totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-600 text-sm">分期月付</span>
                  <span className="text-lg font-bold text-primary-600">
                    ${formatPrice(Math.ceil(selectedPackage.totalPrice / 24))} 起
                  </span>
                </div>
              </div>

              {/* 電器數量 */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {appliances.filter((a) => a.category === 'large').length}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">大型家電</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {appliances.filter((a) => a.category === 'small').length}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">小型家電</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {appliances.filter((a) => a.category === 'smart').length}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">智慧家電</div>
                </div>
              </div>

              {/* 顧客條件 */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">顧客選擇條件</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">家庭組成</span>
                    <span className="font-medium text-gray-900">
                      {demographicLabels[selections.demographic] || selections.demographic}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">房屋格局</span>
                    <span className="font-medium text-gray-900">
                      {layoutLabels[selections.layout] || selections.layout}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">生活需求</span>
                    <span className="font-medium text-gray-900">
                      {selections.lifeNeeds.length} 項
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">電器需求</span>
                    <span className="font-medium text-gray-900">
                      {selections.applianceNeeds.length} 項
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部操作 */}
          <button
            onClick={handleFinishAndRestart}
            className="w-full px-6 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-bold shadow-lg"
          >
            完成並開始新提案
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRCodeGenerationPage;
