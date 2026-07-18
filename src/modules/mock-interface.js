import { getCatalog, getLanguage } from './i18n.js';

const icon = (name) => `<i class="ti ti-${name}" aria-hidden="true"></i>`;
const words = {
  zh: {
    proposals: '提案', public: '公共議題', active: '進行中', closed: '已結案', latest: '最新',
    comments: '討論留言', details: '提案內容', share: '分享', review: '審核提案', delete: '刪除',
    support: '附議', submitted: '提案時間', result: '提案結果', announcement: '公告', notifications: '通知',
    operations: '維運狀態', categories: '分類使用概況', outcomes: '平台成果',
    dashboard: '統計', settings: '我的', create: '新增', processing: '處理中', waiting: '待審核', unanswered: '未回覆',
    completed: '已完成', infeasible: '無法實行', reply: '回覆', search: '搜尋',
  },
  en: {
    proposals: 'Proposals', public: 'Public issues', active: 'Active', closed: 'Closed', latest: 'Latest',
    comments: 'Discussion', details: 'Proposal', share: 'Share', review: 'Review', delete: 'Delete',
    support: 'support', submitted: 'Submitted', result: 'Result', announcement: 'Announcements', notifications: 'Notifications',
    operations: 'Operations', categories: 'Category usage', outcomes: 'Platform outcomes',
    dashboard: 'Dashboard', settings: 'Me', create: 'Create', processing: 'Processing', waiting: 'Under review', unanswered: 'Awaiting reply',
    completed: 'Completed', infeasible: 'Infeasible', reply: 'Reply', search: 'Search',
  },
};

function w(key) {
  return words[getLanguage()]?.[key] ?? words.zh[key] ?? key;
}

function issues() {
  return getCatalog(getLanguage()).demo?.issues ?? [];
}

function statusClass(status) {
  if (status === 'review') return 'review';
  if (status === 'processing') return 'processing';
  if (status === 'completed') return 'completed';
  if (status === 'infeasible') return 'infeasible';
  return 'pending';
}

function statusTag(issue) {
  return `<span class="app-status app-status--${statusClass(issue.status)}">${issue.statusLabel}</span>`;
}

function avatar(issue, size = '') {
  const source = issue.author?.includes('林') ? './assets/avatar-student-2.png' : './assets/avatar-student-1.png';
  return `<img class="app-avatar ${size}" src="${source}" alt="" />`;
}

function profileAvatar(source = 1, size = '') {
  return `<img class="app-avatar ${size}" src="./assets/avatar-student-${source}.png" alt="" />`;
}

function progress(issue) {
  const percent = Math.min(100, Math.round((issue.count / issue.goal) * 100));
  const remaining = issue.days > 0 ? `${getLanguage() === 'en' ? '' : '剩 '}${issue.days}${getLanguage() === 'en' ? ' days' : ' 天'}` : (getLanguage() === 'en' ? 'Goal reached' : '已達標');
  return `<div class="app-progress"><div><strong>${issue.count} / ${issue.goal} ${w('support')}</strong><span>${remaining}</span></div><i><b style="width:${percent}%"></b></i></div>`;
}

function supportButton(issue) {
  return `<button class="app-pill-button${issue.supported ? ' is-active' : ''}" type="button" data-demo-support aria-pressed="${issue.supported}">${icon('thumb-up')}<span>${issue.count}</span></button>`;
}

function issueCard(issue) {
  return `<article class="app-issue-card">
    <header>${statusTag(issue)}<time>${issue.time}</time><button class="app-icon-button" type="button" aria-label="more">${icon('dots')}</button></header>
    <div class="app-issue-title">${avatar(issue)}<div><h4>${issue.title}</h4><p>${issue.author}</p></div></div>
    ${progress(issue)}
    <footer><button class="app-icon-button" type="button" aria-label="comments">${icon('message')}</button>${supportButton(issue)}</footer>
  </article>`;
}

function appSidebar(active = 'proposals') {
  return `<aside class="app-sidebar"><img src="./logo.svg" alt=""/><nav>
    <button class="${active === 'proposals' ? 'is-active' : ''}" aria-label="${w('proposals')}">${icon('message')}</button>
    <button class="${active === 'announcement' ? 'is-active' : ''}" aria-label="${w('announcement')}">${icon('speakerphone')}</button>
    <button aria-label="${w('create')}">${icon('plus')}</button>
    <button class="${active === 'notifications' ? 'is-active' : ''}" aria-label="${w('notifications')}">${icon('bell')}</button>
  </nav>${profileAvatar(2)}</aside>`;
}

function boardToolbar() {
  return `<div class="app-board-toolbar"><div><h3>${w('proposals')}</h3><button class="app-text-button">${w('public')}${icon('chevron-down')}</button></div>
    <div class="app-board-controls"><div class="app-segmented"><button class="is-active" type="button">${icon('list-details')}<span>${w('active')}</span></button><button type="button">${icon('archive')}<span>${w('closed')}</span></button></div><button class="app-icon-button">${icon('sort-descending')}</button><button class="app-icon-button">${icon('search')}</button></div></div>`;
}

function boardDemo() {
  return `<section class="app-frame app-frame--board">${appSidebar()}<main>${boardToolbar()}<div class="app-issue-list">${issues().slice(0, 4).map((issue) => issueCard(issue)).join('')}</div></main></section>`;
}

function heroDemo() {
  const data = issues();
  return `<div class="app-hero-stack"><div class="app-stack-card app-stack-card--back">${issueCard(data[1])}</div><div class="app-stack-card app-stack-card--front">${issueCard(data[0])}</div></div>`;
}

function comment(name, body, time) {
  const source = name.includes('林') ? 2 : 1;
  return `<div class="app-comment">${profileAvatar(source)}<div><p><strong>${name}</strong><time>${time}</time></p><span>${body}</span><button type="button">${w('reply')}</button></div></div>`;
}

function detailDemo() {
  const issue = issues()[0] ?? {};
  return `<section class="app-detail" data-detail-demo>
    <header class="app-detail-head"><button class="app-icon-button app-detail-back" type="button" aria-label="${getLanguage() === 'en' ? 'Back' : '返回'}">${icon('chevron-left')}</button><span class="app-category">${w('public')}</span>${statusTag(issue)}<div class="app-segmented app-detail-tabs"><button class="is-active" data-detail-tab="details">${icon('list')}<span>${w('details')}</span></button><button data-detail-tab="comments">${icon('message')}<span>${w('comments')}</span></button></div></header>
    <div class="app-detail-grid">
      <div class="app-detail-main" data-detail-panel="details">
        <div class="app-detail-scroll"><h3>${issue.title}</h3><div class="app-detail-author">${avatar(issue)}<div><strong>${issue.author}</strong><span>${w('submitted')} ${issue.time}</span></div></div><p>期末考週晚上經常找不到安靜的自習空間，希望圖書館能延長開放到晚上十一點，並保留部分樓層供學生使用。</p><p>若能先試行兩週，也能依實際使用人數再評估是否常態化。</p></div>
        <footer class="app-detail-actions">${progress(issue)}<div class="app-detail-button-row">${supportButton(issue)}<button class="app-pill-button">${icon('share-2')}<span>${w('share')}</span></button><button class="app-pill-button">${icon('pencil')}<span>${w('review')}</span></button><button class="app-danger-button">${icon('trash')}<span>${w('delete')}</span></button></div><div class="app-operation-times"><span><b>提案發出時間：</b>${issue.time}</span><span><b>審核通過時間：</b>7月9日 上午09:10</span><span><b>附議截止時間：</b>7月16日 下午11:59</span></div></footer>
      </div>
      <aside class="app-comments" data-detail-panel="comments"><header>${icon('message')}<strong>${w('comments')}</strong></header><div class="app-comment-list">${comment('林同學','如果延長到 23:00，期中考週也能比照辦理嗎？','7月13日 10:15')}${comment('總務處服務組','已收到建議，會先確認人力與門禁安排。','7月14日 09:30')}</div><div class="app-comment-compose"><span>${getLanguage() === 'en' ? 'Write a comment…' : '分享你的想法…'}</span><button>${icon('send')}</button></div></aside>
    </div>
  </section>`;
}

function announcementCards() {
  const cards = [
    { title: '期末考週圖書館延長開放', author: '學務處', time: '7月12日', likes: 28 },
    { title: '提案狀態與通知體驗更新', author: '系統管理員', time: '7月10日', likes: 14 },
  ];
  return `<div class="app-announcement-grid">${cards.map((item, index) => `<article class="app-issue-card app-announcement-card"><header><span class="app-category">${w('announcement')}</span><time>${item.time}</time><button class="app-icon-button" type="button" aria-label="more">${icon('dots')}</button></header><div class="app-issue-title">${profileAvatar(index + 1)}<div><h4>${item.title}</h4><p>${item.author}</p></div></div><footer><button class="app-icon-button" type="button" aria-label="comments">${icon('message')}</button><button class="app-pill-button" type="button">${icon('thumb-up')}<span>${item.likes}</span></button></footer></article>`).join('')}</div>`;
}

function announcementsDemo() {
  return `<section class="app-frame app-frame--announcements">${appSidebar('announcement')}<main><header class="app-page-head"><h3>${w('announcement')}</h3></header>${announcementCards()}</main></section>`;
}

function notificationsDemo() {
  return `<section class="app-frame app-frame--notifications">${appSidebar('notifications')}<main><div class="app-notification-column"><header><div><h3>${w('notifications')}</h3><p>${getLanguage() === 'en' ? 'Recent proposal activity' : '最近的提案進度與互動'}</p></div></header><div class="app-notification-group">
    <button>${profileAvatar(1)}<span><strong>管理單位回覆了你的提案</strong><small>圖書館延長開放時間</small></span>${icon('chevron-right')}</button>
    <button><span class="app-notice-icon app-notice-icon--sage">${icon('circle-check')}</span><span><strong>提案已達附議門檻</strong><small>增加宿舍公共區域充電插座</small></span>${icon('chevron-right')}</button>
    <button><span class="app-notice-icon">${icon('switch-horizontal')}</span><span><strong>提案狀態已更新為處理中</strong><small>改善教學大樓飲水機標示</small></span>${icon('chevron-right')}</button>
  </div></div></main></section>`;
}

function moderationDemo() {
  return `<section class="app-frame app-frame--moderation">${appSidebar()}<main>${boardToolbar()}<div class="app-issue-list">${issues().slice(0, 3).map((issue) => issueCard(issue)).join('')}</div></main><div class="app-dialog-backdrop"><section class="app-review-dialog" role="dialog" aria-label="審核此提案"><h3>審核此提案</h3><p>請審查提案內容，決定是否通過審核。審核通過後，提案將對外公開並開放附議。</p><strong>審核結果</strong><button class="is-selected"><span><b>審核通過</b><small>提案將會公開，並開始接受使用者附議。</small></span>${icon('check')}</button><button><span><b>審核不通過</b><small>提案將不會公開，需提供不通過原因通知提案者。</small></span></button><footer><button class="app-pill-button">取消</button><button class="app-pill-button is-active">確認</button></footer></section></div></section>`;
}

function mobileDemo() {
  return `<section class="app-mobile"><header><strong>${w('proposals')}</strong></header><main>${boardToolbar()}<div class="app-issue-list">${issues().slice(0,2).map((issue) => issueCard(issue)).join('')}</div></main><nav><button class="is-active">${icon('message')}<small>${w('proposals')}</small></button><button>${icon('speakerphone')}<small>${w('announcement')}</small></button><button class="app-mobile-create" type="button" title="${w('create')}" aria-label="${w('create')}">${icon('plus')}</button><button>${icon('bell')}<small>${w('notifications')}</small></button><button>${icon('user')}<small>${w('settings')}</small></button></nav></section>`;
}

function templateFor(variant) {
  if (variant === 'hero') return heroDemo();
  if (variant === 'detail') return detailDemo();
  if (variant === 'announcements') return announcementsDemo();
  if (variant === 'notifications') return notificationsDemo();
  if (variant === 'moderation') return moderationDemo();
  if (variant === 'mobile') return mobileDemo();
  return boardDemo();
}

function fitDemo(root) {
  const surface = root.firstElementChild;
  if (!surface || !root.isConnected) return;
  const available = root.clientWidth;
  if (!available) return;
  const designWidth = root.dataset.novaeDemo === 'hero'
    ? 720
    : root.dataset.novaeDemo === 'mobile'
      ? 390
      : 1120;
  surface.style.width = `${designWidth}px`;
  surface.style.transform = 'scale(1)';
  surface.style.transformOrigin = 'top left';
  const scale = Math.min(1, available / designWidth);
  surface.style.transform = `scale(${scale})`;
  const naturalHeight = root.dataset.novaeDemo === 'mobile' ? 760 : surface.scrollHeight;
  root.style.height = `${Math.ceil(naturalHeight * scale)}px`;
}

function paint(root) {
  root.innerHTML = templateFor(root.dataset.novaeDemo);
  requestAnimationFrame(() => fitDemo(root));
}

function initializeDemoInteractions(root) {
  root.addEventListener('click', (event) => {
    const support = event.target.closest('[data-demo-support]');
    if (support) {
      const active = support.classList.toggle('is-active');
      support.setAttribute('aria-pressed', String(active));
      const count = support.querySelector('span');
      if (count) count.textContent = String(Number(count.textContent || 0) + (active ? 1 : -1));
    }
    const tab = event.target.closest('[data-detail-tab]');
    if (tab) {
      root.querySelectorAll('[data-detail-tab]').forEach((item) => item.classList.toggle('is-active', item === tab));
      root.querySelectorAll('[data-detail-panel]').forEach((panel) => panel.classList.toggle('is-mobile-current', panel.dataset.detailPanel === tab.dataset.detailTab));
    }
  });
}

export function initializeInterfaceDemos() {
  const roots = [...document.querySelectorAll('[data-novae-demo]')];
  if (!roots.length) return;
  roots.forEach((root) => { paint(root); initializeDemoInteractions(root); });
  document.addEventListener('novae:language', () => roots.forEach(paint));
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => roots.forEach((root) => requestAnimationFrame(() => fitDemo(root))));
    roots.forEach((root) => observer.observe(root));
  }
}
