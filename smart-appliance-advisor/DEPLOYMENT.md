# 智慧家電門市提案系統 - 部署指南

**版本：** 1.0  
**最後更新：** 2026/11/17  
**目標讀者：** DevOps、系統管理員

---

## 📖 目錄

1. [環境需求](#環境需求)
2. [本地建置](#本地建置)
3. [生產環境部署](#生產環境部署)
4. [環境變數配置](#環境變數配置)
5. [效能最佳化](#效能最佳化)
6. [監控與日誌](#監控與日誌)
7. [備份與還原](#備份與還原)
8. [常見問題](#常見問題)

---

## 環境需求

### 開發環境

| 項目 | 最低版本 | 推薦版本 |
|------|----------|----------|
| **Node.js** | 18.0.0 | 20.x LTS |
| **npm** | 9.0.0 | 10.x |
| **瀏覽器** | Chrome 90+ | Chrome 最新版 |

### 生產環境

| 項目 | 要求 |
|------|------|
| **Web Server** | 支援靜態檔案 Hosting（Nginx, Apache, CDN） |
| **HTTPS** | 必須（PWA 與 QR Code 需求） |
| **儲存空間** | 最少 100MB（建置檔案） |
| **頻寬** | 建議 10Mbps+（首次載入約 2-3MB） |

---

## 本地建置

### 1. 安裝相依套件

```bash
# 進入專案目錄
cd smart-appliance-advisor

# 安裝套件
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

**預設網址：** `http://localhost:5173`

**開發模式特性：**
- ✅ Hot Module Replacement (HMR) - 即時更新
- ✅ React StrictMode - 雙重渲染檢查
- ✅ Source Maps - 除錯支援

### 3. 建置生產版本

```bash
npm run build
```

**輸出目錄：** `dist/`

**建置產出：**
```
dist/
├── index.html              # 主 HTML
├── assets/
│   ├── index-[hash].js    # 主 JavaScript bundle
│   ├── index-[hash].css   # 主 CSS bundle
│   └── [vendor]-[hash].js # 第三方庫 bundle
└── vite.svg               # Favicon
```

### 4. 預覽生產版本

```bash
npm run preview
```

**預設網址：** `http://localhost:4173`

---

## 生產環境部署

本系統是**純前端靜態網站**，可部署到任何支援靜態檔案 Hosting 的平台。

### 選項 1：Netlify（推薦）

**優勢：**
- ✅ 免費 SSL 證書
- ✅ 全球 CDN 加速
- ✅ 自動化部署（Git Push）
- ✅ 預覽分支功能

**部署步驟：**

#### 方法 A：透過 Netlify CLI

```bash
# 1. 安裝 Netlify CLI
npm install -g netlify-cli

# 2. 登入 Netlify
netlify login

# 3. 初始化專案
netlify init

# 4. 建置並部署
npm run build
netlify deploy --prod --dir=dist
```

#### 方法 B：透過 Web UI

1. 登入 [Netlify](https://app.netlify.com/)
2. 點擊「New site from Git」
3. 連接 GitHub/GitLab 儲存庫
4. 設定建置命令：
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. 點擊「Deploy site」

**自動部署設定：**
- 推送到 `main` 分支 → 自動部署到生產環境
- 推送到其他分支 → 自動產生預覽網址

---

### 選項 2：Vercel

**優勢：**
- ✅ 與 Vite 深度整合
- ✅ 邊緣運算節點
- ✅ 自動優化圖片與資源

**部署步驟：**

#### 方法 A：透過 Vercel CLI

```bash
# 1. 安裝 Vercel CLI
npm install -g vercel

# 2. 登入 Vercel
vercel login

# 3. 部署
vercel --prod
```

#### 方法 B：透過 Web UI

1. 登入 [Vercel](https://vercel.com/)
2. 點擊「New Project」
3. 導入 Git 儲存庫
4. Vercel 自動偵測 Vite 專案，無需額外設定
5. 點擊「Deploy」

---

### 選項 3：AWS S3 + CloudFront

**優勢：**
- ✅ 高可用性與穩定性
- ✅ 與 AWS 生態系整合
- ✅ 精細的權限控制

**部署步驟：**

#### 1. 建立 S3 Bucket

```bash
# 使用 AWS CLI
aws s3 mb s3://your-bucket-name --region ap-northeast-1
```

#### 2. 設定 Bucket 為靜態網站

```bash
aws s3 website s3://your-bucket-name \
  --index-document index.html \
  --error-document index.html
```

#### 3. 上傳建置檔案

```bash
# 建置專案
npm run build

# 同步到 S3
aws s3 sync dist/ s3://your-bucket-name \
  --delete \
  --cache-control max-age=31536000,public \
  --exclude "index.html"

# 上傳 index.html（較短 cache）
aws s3 cp dist/index.html s3://your-bucket-name/index.html \
  --cache-control max-age=300,public
```

#### 4. 設定 CloudFront CDN

```bash
# 建立 CloudFront Distribution
aws cloudfront create-distribution \
  --origin-domain-name your-bucket-name.s3.amazonaws.com \
  --default-root-object index.html
```

#### 5. 設定 Custom Error Pages

確保 SPA 路由正常運作：
- **Error Code:** 403, 404
- **Response Page:** `/index.html`
- **Response Code:** 200

---

### 選項 4：自建 Nginx

**適用情境：** 自有伺服器或內網環境

#### 1. 建置並上傳檔案

```bash
# 建置
npm run build

# 壓縮
tar -czf dist.tar.gz dist/

# 上傳到伺服器
scp dist.tar.gz user@server:/var/www/
```

#### 2. 設定 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 自動轉跳 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL 憑證
    ssl_certificate /etc/ssl/certs/your-cert.pem;
    ssl_certificate_key /etc/ssl/private/your-key.pem;
    
    # 網站根目錄
    root /var/www/smart-appliance-advisor/dist;
    index index.html;
    
    # SPA 路由支援
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 靜態資源 Cache
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip 壓縮
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # 安全標頭
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 3. 重啟 Nginx

```bash
# 測試設定
sudo nginx -t

# 重啟服務
sudo systemctl restart nginx
```

---

## 環境變數配置

### Vite 環境變數

建立 `.env` 檔案（不同環境）：

#### `.env.development`（開發環境）

```bash
# 開發模式標記
VITE_ENV=development

# API Base URL（如果有後端）
VITE_API_BASE_URL=http://localhost:3000

# 除錯模式
VITE_DEBUG=true
```

#### `.env.production`（生產環境）

```bash
# 生產模式標記
VITE_ENV=production

# API Base URL（如果有後端）
VITE_API_BASE_URL=https://api.your-domain.com

# 除錯模式
VITE_DEBUG=false

# Google Analytics（選用）
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

### 使用環境變數

```typescript
// 在程式碼中使用
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isDebug = import.meta.env.VITE_DEBUG === 'true';

console.log('Current env:', import.meta.env.VITE_ENV);
```

**注意事項：**
- ✅ 環境變數必須以 `VITE_` 開頭
- ⚠️ 不要在 `.env` 中存放敏感資訊（會被打包進前端）
- ✅ 將 `.env` 加入 `.gitignore`

---

## 效能最佳化

### 1. 建置時優化

#### 啟用程式碼分割（已預設）

Vite 自動進行：
- ✅ Vendor Splitting（第三方庫獨立打包）
- ✅ Dynamic Imports（動態載入）
- ✅ Tree Shaking（移除未使用的程式碼）

#### 自訂 Chunk 分割

編輯 `vite.config.ts`：

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心庫
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // 狀態管理
          'store-vendor': ['zustand'],
          
          // UI 庫
          'ui-vendor': ['lucide-react', 'qrcode.react'],
          
          // 資料庫
          'db-vendor': ['dexie'],
        },
      },
    },
  },
});
```

### 2. 圖片優化

**使用 WebP 格式：**
```bash
# 轉換 PNG/JPG 為 WebP
cwebp input.png -q 80 -o output.webp
```

**回退機制：**
```tsx
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.png" alt="..." />
</picture>
```

### 3. 字型優化

**使用系統字型：**
```css
/* tailwind.config.js */
theme: {
  fontFamily: {
    sans: [
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Microsoft JhengHei', // 繁體中文
      'sans-serif',
    ],
  },
}
```

### 4. 懶載入路由

```typescript
// 使用 React.lazy
const ApplianceManagementPage = lazy(() => import('@/pages/ApplianceManagementPage'));
const ProposalHistoryPage = lazy(() => import('@/pages/ProposalHistoryPage'));

// 搭配 Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ApplianceManagementPage />
</Suspense>
```

### 5. 壓縮設定

#### Gzip 壓縮（Vite Plugin）

```bash
npm install -D vite-plugin-compression
```

```typescript
// vite.config.ts
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
});
```

#### Brotli 壓縮（更高壓縮率）

```typescript
viteCompression({
  algorithm: 'brotliCompress',
  ext: '.br',
})
```

---

## 監控與日誌

### 1. 錯誤監控（Sentry）

#### 安裝 Sentry

```bash
npm install @sentry/react
```

#### 初始化

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: import.meta.env.VITE_ENV,
  tracesSampleRate: 1.0,
});

createRoot(document.getElementById('root')!).render(
  <Sentry.ErrorBoundary fallback={<ErrorPage />}>
    <App />
  </Sentry.ErrorBoundary>
);
```

### 2. 效能監控（Google Analytics）

#### 安裝 GA

```bash
npm install react-ga4
```

#### 初始化

```typescript
// src/main.tsx
import ReactGA from 'react-ga4';

ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID);

// 追蹤頁面瀏覽
ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
```

### 3. 自訂日誌

```typescript
// src/lib/logger.ts
const isDev = import.meta.env.VITE_ENV === 'development';

export const logger = {
  info: (message: string, data?: any) => {
    if (isDev) console.log(`ℹ️ ${message}`, data);
  },
  warn: (message: string, data?: any) => {
    console.warn(`⚠️ ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`❌ ${message}`, error);
    // 送到 Sentry（如果有安裝）
    if (window.Sentry) {
      window.Sentry.captureException(error);
    }
  },
};
```

---

## 備份與還原

### IndexedDB 備份策略

由於資料存在瀏覽器本地，需要定期備份重要資料。

#### 方法 1：匯出為 JSON

```typescript
// 匯出所有電器資料
async function exportAppliances() {
  const appliances = await db.appliances.toArray();
  const json = JSON.stringify(appliances, null, 2);
  
  // 下載為檔案
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `appliances-backup-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// 匯入資料
async function importAppliances(file: File) {
  const text = await file.text();
  const appliances = JSON.parse(text);
  await db.appliances.bulkPut(appliances);
}
```

#### 方法 2：雲端同步（未來擴充）

將 IndexedDB 定期同步到後端資料庫：

```typescript
// 定期同步（每 30 分鐘）
setInterval(async () => {
  const proposals = await db.proposals.toArray();
  
  // 上傳到後端
  await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(proposals),
  });
}, 30 * 60 * 1000);
```

---

## 常見問題

### Q1: 部署後 QR Code 掃描失敗？

**檢查清單：**
- [ ] 網站是否使用 HTTPS（必須）
- [ ] 網址是否正確（檢查 `generateConsumerProposalUrl` 函式）
- [ ] 防火牆是否阻擋外部存取
- [ ] DNS 設定是否正確

**解決方法：**
1. 確保使用 HTTPS
2. 測試網址是否可從外部存取
3. 檢查 CORS 設定（如果有後端）

---

### Q2: 建置後檔案過大？

**診斷：**
```bash
# 分析 bundle 大小
npm run build -- --analyze
```

**優化方法：**
1. 檢查是否有未使用的套件
2. 啟用 Code Splitting（見[效能最佳化](#效能最佳化)）
3. 使用 CDN 載入大型庫

---

### Q3: 部署後樣式跑版？

**可能原因：**
- Tailwind CSS 未正確建置
- 瀏覽器 Cache 問題

**解決方法：**
```bash
# 重新建置（清除 cache）
rm -rf dist node_modules/.vite
npm run build
```

---

### Q4: 路由在生產環境無法運作（404）？

**原因：** 伺服器未配置 SPA 回退機制

**解決方法：** 見各平台的 SPA 設定
- Netlify: 自動支援
- Vercel: 自動支援
- Nginx: 見上方 Nginx 設定
- S3: 設定 Custom Error Pages

---

### Q5: 首次載入很慢？

**優化方法：**
1. 啟用 Gzip/Brotli 壓縮
2. 使用 CDN 加速
3. 啟用 HTTP/2
4. 延遲載入非必要元件

---

## 部署檢查清單

部署前請確認：

### 功能檢查
- [ ] 所有頁面可正常載入
- [ ] 問卷流程可完整執行
- [ ] QR Code 可正常生成與掃描
- [ ] 商品管理 CRUD 功能正常
- [ ] 歷史紀錄查詢正常

### 效能檢查
- [ ] Lighthouse Score > 90
- [ ] 首次內容繪製 (FCP) < 2 秒
- [ ] Time to Interactive (TTI) < 3.5 秒
- [ ] Bundle 大小 < 500KB (gzip)

### 相容性檢查
- [ ] Chrome 90+ ✅
- [ ] Safari 15+ (iOS) ✅
- [ ] Edge 90+ ✅
- [ ] iPad 橫向/直向模式 ✅

### 安全檢查
- [ ] 使用 HTTPS ✅
- [ ] 無 Mixed Content 警告 ✅
- [ ] 安全標頭已設定 ✅
- [ ] 無敏感資訊洩漏 ✅

### SEO 檢查（選用）
- [ ] Meta Tags 完整
- [ ] Open Graph Tags
- [ ] Favicon 設定

---

## 部署自動化（CI/CD）

### GitHub Actions 範例

建立 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: 'Deploy from GitHub Actions'
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 緊急應變流程

### 回滾到前一版本

#### Netlify
```bash
# 查看歷史部署
netlify sites:list

# 回滾到指定版本
netlify rollback
```

#### Vercel
```bash
# 查看歷史部署
vercel list

# 回滾（透過 UI）
# Dashboard → Deployments → Previous Deployment → Promote to Production
```

#### S3 + CloudFront
```bash
# 重新部署舊版本
aws s3 sync old-dist/ s3://your-bucket-name --delete

# 清除 CloudFront Cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

## 聯絡支援

遇到部署問題請聯絡：

**DevOps 團隊**
- 📧 Email: devops@tkec.com.tw
- 📞 電話: 0800-123-456（分機 999）
- 💬 Slack: #devops-support

---

**部署順利！**
