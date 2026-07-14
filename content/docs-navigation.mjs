export const NAV_ZH = [
  { group: '開始了解', items: [
    { id: 'README', title: '文件首頁', file: 'index.html' },
    { id: 'changelog', title: '更新紀錄', file: 'changelog.html' },
    { id: 'project-overview', title: '產品亮點', file: 'project-overview.html' },
  ] },
  { group: '使用平台', items: [
    { id: 'quick-start', title: '快速開始', file: 'quick-start.html' },
    { id: 'user-guide', title: '使用者操作', file: 'user-guide.html' },
    { id: 'admin-guide', title: '管理員操作', file: 'admin-guide.html' },
  ] },
  { group: '自訂與部署', items: [
    { id: 'configuration', title: '產品規則設定', file: 'configuration.html' },
    { id: 'environment-configuration', title: '環境與憑證', file: 'environment-configuration.html' },
    { id: 'deployment-guide', title: '部署指南', file: 'deployment-guide.html' },
  ] },
  { group: '維運與安全', items: [
    { id: 'troubleshooting', title: '故障排除', file: 'troubleshooting.html' },
    { id: 'operations', title: '維運手冊', file: 'operations.html' },
    { id: 'security', title: '安全模型', file: 'security.html' },
    { id: 'costs', title: '成本指南', file: 'costs.html' },
  ] },
  { group: '深入了解', items: [
    { id: 'architecture', title: '系統架構', file: 'architecture.html' },
    { id: 'contributing', title: '貢獻指南', file: 'contributing.html' },
  ] },
];

export const NAV_EN = [
  { group: 'Get started', items: [
    { id: 'README', title: 'Docs home', file: 'index.html' },
    { id: 'project-overview', title: 'Product highlights', file: 'project-overview.html' },
  ] },
  { group: 'Use Novae', items: [
    { id: 'quick-start', title: 'Quick start', file: 'quick-start.html' },
    { id: 'user-guide', title: 'User workflows', file: 'user-guide.html' },
    { id: 'admin-guide', title: 'Administrator workflows', file: 'admin-guide.html' },
  ] },
  { group: 'Customize and deploy', items: [
    { id: 'configuration', title: 'Product rules', file: 'configuration.html' },
    { id: 'environment-configuration', title: 'Environment and credentials', file: 'environment-configuration.html' },
    { id: 'deployment-guide', title: 'Deployment', file: 'deployment-guide.html' },
  ] },
  { group: 'Operate and secure', items: [
    { id: 'troubleshooting', title: 'Troubleshooting', file: 'troubleshooting.html' },
    { id: 'operations', title: 'Operations', file: 'operations.html' },
    { id: 'security', title: 'Security', file: 'security.html' },
    { id: 'costs', title: 'Costs', file: 'costs.html' },
  ] },
  { group: 'Go deeper', items: [
    { id: 'architecture', title: 'Architecture', file: 'architecture.html' },
    { id: 'contributing', title: 'Contributing', file: 'contributing.html' },
  ] },
];

export const DEPLOYMENT_NAV_ZH = [
  { id: 'deployment/github', title: '1. GitHub 與 Environment', file: 'deployment/github.html' },
  { id: 'deployment/firebase', title: '2. Firebase', file: 'deployment/firebase.html' },
  { id: 'deployment/supabase', title: '3. Supabase', file: 'deployment/supabase.html' },
  { id: 'deployment/cloudinary', title: '4. Cloudinary', file: 'deployment/cloudinary.html' },
  { id: 'deployment/notion', title: '5. Notion', file: 'deployment/notion.html' },
  { id: 'deployment/upstash', title: '6. Upstash', file: 'deployment/upstash.html' },
  { id: 'deployment/vercel-github', title: '7. Vercel 與首次部署', file: 'deployment/vercel-github.html' },
];

export const DEPLOYMENT_NAV_EN = [
  { id: 'deployment/github', title: '1. GitHub and Environments', file: 'deployment/github.html' },
  { id: 'deployment/firebase', title: '2. Firebase', file: 'deployment/firebase.html' },
  { id: 'deployment/supabase', title: '3. Supabase', file: 'deployment/supabase.html' },
  { id: 'deployment/cloudinary', title: '4. Cloudinary', file: 'deployment/cloudinary.html' },
  { id: 'deployment/notion', title: '5. Notion', file: 'deployment/notion.html' },
  { id: 'deployment/upstash', title: '6. Upstash', file: 'deployment/upstash.html' },
  { id: 'deployment/vercel-github', title: '7. Vercel and first release', file: 'deployment/vercel-github.html' },
];

export function flattenNav(nav) {
  return nav.flatMap((section) => section.items);
}
