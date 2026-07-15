export const NAV_ZH = [
  { group: '先從這裡開始', items: [
    { id: 'README', title: '文件首頁', file: 'index.html' },
    { id: 'project-overview', title: '產品與流程', file: 'project-overview.html' },
  ] },
  { group: '一步一步上線', items: [
    { id: 'quick-start', title: '部署準備與服務設定', file: 'quick-start.html' },
    { id: 'environment-configuration', title: '憑證填寫表', file: 'environment-configuration.html' },
    { id: 'configuration', title: '分類與平台規則', file: 'configuration.html' },
    { id: 'deployment-guide', title: '最後發布與驗收', file: 'deployment-guide.html' },
  ] },
  { group: '實際使用', items: [
    { id: 'user-guide', title: '使用者流程', file: 'user-guide.html' },
    { id: 'admin-guide', title: '管理員流程', file: 'admin-guide.html' },
  ] },
  { group: '維運與安全', items: [
    { id: 'operations', title: '上線後維運', file: 'operations.html' },
    { id: 'troubleshooting', title: '一步一步排錯', file: 'troubleshooting.html' },
    { id: 'security', title: '安全與隱私', file: 'security.html' },
    { id: 'costs', title: '成本指南', file: 'costs.html' },
  ] },
  { group: '開發與參考', items: [
    { id: 'architecture', title: '系統架構', file: 'architecture.html' },
    { id: 'contributing', title: '貢獻指南', file: 'contributing.html' },
    { id: 'changelog', title: '更新紀錄', file: 'changelog.html' },
  ] },
];

export const NAV_EN = [
  { group: 'Start here', items: [
    { id: 'README', title: 'Docs home', file: 'index.html' },
    { id: 'project-overview', title: 'Product and workflows', file: 'project-overview.html' },
  ] },
  { group: 'Deploy step by step', items: [
    { id: 'quick-start', title: 'Preparation and service setup', file: 'quick-start.html' },
    { id: 'environment-configuration', title: 'Credential worksheet', file: 'environment-configuration.html' },
    { id: 'configuration', title: 'Categories and product rules', file: 'configuration.html' },
    { id: 'deployment-guide', title: 'Final release and acceptance', file: 'deployment-guide.html' },
  ] },
  { group: 'Use Novae', items: [
    { id: 'user-guide', title: 'User workflows', file: 'user-guide.html' },
    { id: 'admin-guide', title: 'Administrator workflows', file: 'admin-guide.html' },
  ] },
  { group: 'Operate and secure', items: [
    { id: 'operations', title: 'Post-launch operations', file: 'operations.html' },
    { id: 'troubleshooting', title: 'Step-by-step troubleshooting', file: 'troubleshooting.html' },
    { id: 'security', title: 'Security and privacy', file: 'security.html' },
    { id: 'costs', title: 'Costs', file: 'costs.html' },
  ] },
  { group: 'Develop and reference', items: [
    { id: 'architecture', title: 'Architecture', file: 'architecture.html' },
    { id: 'contributing', title: 'Contributing', file: 'contributing.html' },
  ] },
];

export const DEPLOYMENT_NAV_ZH = [
  { id: 'deployment/github', title: '1. 準備 GitHub', file: 'deployment/github.html' },
  { id: 'deployment/firebase', title: '2. 建立 Firebase', file: 'deployment/firebase.html' },
  { id: 'deployment/supabase', title: '3. 建立 Supabase', file: 'deployment/supabase.html' },
  { id: 'deployment/cloudinary', title: '4. 建立 Cloudinary', file: 'deployment/cloudinary.html' },
  { id: 'deployment/notion', title: '5. 選用：Notion 副本', file: 'deployment/notion.html' },
  { id: 'deployment/upstash', title: '6. 建立 Upstash', file: 'deployment/upstash.html' },
  { id: 'deployment/vercel-github', title: '7. 建立 Vercel', file: 'deployment/vercel-github.html' },
];

export const DEPLOYMENT_NAV_EN = [
  { id: 'deployment/github', title: '1. Prepare GitHub', file: 'deployment/github.html' },
  { id: 'deployment/firebase', title: '2. Create Firebase', file: 'deployment/firebase.html' },
  { id: 'deployment/supabase', title: '3. Create Supabase', file: 'deployment/supabase.html' },
  { id: 'deployment/cloudinary', title: '4. Create Cloudinary', file: 'deployment/cloudinary.html' },
  { id: 'deployment/notion', title: '5. Optional: Notion copy', file: 'deployment/notion.html' },
  { id: 'deployment/upstash', title: '6. Create Upstash', file: 'deployment/upstash.html' },
  { id: 'deployment/vercel-github', title: '7. Create Vercel', file: 'deployment/vercel-github.html' },
];

export function flattenNav(nav) {
  return nav.flatMap((section) => section.items);
}
