import { getCatalog, getLanguage } from './i18n.js';
import { icon } from './icons.js';

const words = {
  zh: {
    active: '進行中', announcement: '公告', announcements: '公告', back: '返回提案',
    categories: '分類使用概況', closed: '已結案', comments: '討論', completed: '已完成',
    create: '新增提案', dashboard: '統計', delete: '刪除提案', details: '提案內容',
    facilities: '設備', infeasible: '無法實行', latest: '最新', more: '更多操作',
    notifications: '通知', operations: '維運狀態', outcomes: '平台成果', processing: '處理中',
    proposals: '提案', public: '公共議題', reply: '回覆', review: '管理狀態',
    search: '搜尋提案', searchPlaceholder: '搜尋提案…', settings: '設定', share: '分享提案',
    submitted: '提案時間', support: '附議', supportProgress: '附議進度', timeline: '時間軸',
    waiting: '待審核', writeComment: '輸入留言…', unanswered: '未回覆',
  },
  en: {
    active: 'Active', announcement: 'Announcement', announcements: 'Announcements', back: 'Back to proposals',
    categories: 'Category usage', closed: 'Closed', comments: 'Discussion', completed: 'Completed',
    create: 'New proposal', dashboard: 'Dashboard', delete: 'Delete proposal', details: 'Proposal',
    facilities: 'Facilities', infeasible: 'Infeasible', latest: 'Latest', more: 'More actions',
    notifications: 'Notifications', operations: 'Operations', outcomes: 'Platform outcomes', processing: 'In progress',
    proposals: 'Proposals', public: 'Public issues', reply: 'Reply', review: 'Manage status',
    search: 'Search proposals', searchPlaceholder: 'Search proposals…', settings: 'Settings', share: 'Share proposal',
    submitted: 'Submitted', support: 'Support', supportProgress: 'Support progress', timeline: 'Timeline',
    waiting: 'Under review', writeComment: 'Enter a comment…', unanswered: 'Awaiting reply',
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

function brandLockup() {
  return `<div class="app-brand"><span><img src="./logo.svg" alt="" /></span><strong>Novae</strong></div>`;
}

function progress(issue, card = false) {
  const percent = Math.min(100, Math.round((issue.count / issue.goal) * 100));
  const remaining = issue.days > 0
    ? `${getLanguage() === 'en' ? '' : '剩 '}${issue.days}${getLanguage() === 'en' ? ' days' : ' 天'}`
    : (getLanguage() === 'en' ? 'Goal reached' : '已達標');
  return `<div class="app-progress${card ? ' app-progress--card' : ''}"><div><span>${w('supportProgress')}</span><strong>${issue.count} / ${issue.goal}</strong></div><i><b style="transform:scaleX(${percent / 100})"></b></i>${card ? `<small>${icon('calendar-time')}${remaining}</small>` : ''}</div>`;
}

function reactionButton({ active = false, count, kind = 'hand', label = '' }) {
  const iconName = kind === 'heart' ? 'heart' : 'hand-stop';
  return `<button class="app-reaction${active ? ' is-active' : ''}" type="button" data-demo-reaction aria-label="${label}" aria-pressed="${active}" data-reaction="${kind}">${icon(iconName)}<span>${count}</span></button>`;
}

function issueCard(issue) {
  return `<article class="app-issue-card">
    <div class="app-card-top"><div class="app-card-copy"><p class="app-card-meta">${avatar(issue, 'xs')}<strong>${issue.author}</strong><span>·</span><time>${issue.time}</time></p><h4>${issue.title}</h4></div>${icon('arrow-up-right')}</div>
    <p class="app-card-excerpt">${getLanguage() === 'en' ? 'A clear proposal with visible progress, discussion, and responsible follow-up.' : '讓提案內容、附議進度與後續回應都能清楚追蹤。'}</p>
    ${progress(issue, true)}
    <footer>${statusTag(issue)}${reactionButton({ active: issue.supported, count: issue.count, label: w('support') })}<span class="app-comment-count">${icon('message')}</span></footer>
  </article>`;
}

function sidebarItem(key, iconName, active) {
  return `<button class="app-nav-item${active ? ' is-active' : ''}" type="button">${icon(iconName)}<span>${w(key)}</span></button>`;
}

function appSidebar(active = 'proposals') {
  return `<aside class="app-sidebar">${brandLockup()}<nav>
    ${sidebarItem('proposals', 'blocks', active === 'proposals')}
    ${sidebarItem('facilities', 'tool', active === 'facilities')}
    ${sidebarItem('announcements', 'speakerphone', active === 'announcement')}
    ${sidebarItem('notifications', 'bell', active === 'notifications')}
    ${sidebarItem('settings', 'settings', active === 'settings')}
  </nav><div class="app-account">${profileAvatar(2)}<span><strong>${getLanguage() === 'en' ? 'Yu-Ching Lin' : '林予晴'}</strong><small>student@school.edu</small></span>${icon('chevron-down')}</div></aside>`;
}

function boardToolbar({ mobile = false } = {}) {
  return `<div class="app-board-toolbar"><button class="app-category-heading" type="button">${w('public')}${icon('chevron-down')}</button><button class="app-new-button" type="button">${icon('plus')}<span>${w('create')}</span></button></div>
    <div class="app-filter-bar"><div class="app-segmented"><button class="is-active" type="button"><span>${w('active')}</span></button><button type="button"><span>${w('closed')}</span></button></div><div class="app-search-field">${icon('search')}<span>${w('searchPlaceholder')}</span></div><button class="app-control-button" aria-label="${w('latest')}">${icon('adjustments-horizontal')}${mobile ? '' : `<span>${w('latest')}</span>`}${icon('chevron-down')}</button></div>`;
}

function boardDemo() {
  return `<section class="app-frame app-frame--board">${appSidebar()}<main>${boardToolbar()}<div class="app-issue-list">${issues().slice(0, 4).map(issueCard).join('')}</div></main></section>`;
}

function heroDemo() {
  const data = issues();
  return `<div class="app-hero-stack"><div class="app-stack-card app-stack-card--back">${issueCard(data[1])}</div><div class="app-stack-card app-stack-card--front">${issueCard(data[0])}</div></div>`;
}

function comment(name, body, time, source = 1) {
  return `<article class="app-comment">${profileAvatar(source)}<div><p><strong>${name}</strong><time>${time}</time></p><span>${body}</span><button type="button" aria-label="${w('reply')}">${icon('message')}</button></div></article>`;
}

function timeline(issue) {
  const items = getLanguage() === 'en'
    ? [['Proposal', issue.time], ['Support deadline', 'Jul 16, 11:59 PM'], ['Reply deadline', 'Jul 23, 11:59 PM']]
    : [['提案', issue.time], ['附議截止', '7月16日 下午11:59'], ['回覆期限', '7月23日 下午11:59']];
  return `<section class="app-timeline"><h4>${icon('calendar-time')}${w('timeline')}</h4>${items.map(([label, value]) => `<div><i></i><span><strong>${label}</strong><small>${value}</small></span></div>`).join('')}</section>`;
}

function detailDemo() {
  const issue = issues()[0] ?? {};
  const description = getLanguage() === 'en'
    ? ['Quiet study space is difficult to find during finals. Extend library access to 11 PM and keep several floors available for students.', 'A two-week pilot would let the school review real attendance before making the change permanent.']
    : ['期末考週晚上經常找不到安靜的自習空間，希望圖書館能延長開放到晚上十一點，並保留部分樓層供學生使用。', '若能先試行兩週，也能依實際使用人數再評估是否常態化。'];
  return `<section class="app-detail" data-detail-demo>
    <div class="app-detail-toolbar"><button class="app-icon-button" type="button" aria-label="${w('back')}">${icon('chevron-left')}</button><span></span><button class="app-icon-button" type="button" aria-label="${w('share')}">${icon('share-2')}</button><button class="app-icon-button" type="button" aria-label="${w('more')}">${icon('dots')}</button></div>
    <div class="app-detail-grid"><article class="app-detail-main"><section class="app-detail-content"><div class="app-detail-labels"><span class="app-category">${w('public')}</span>${statusTag(issue)}</div><h3>${issue.title}</h3><div class="app-detail-author">${avatar(issue)}<strong>${issue.author}</strong><span>·</span><time>${issue.time}</time></div>${description.map(item => `<p>${item}</p>`).join('')}</section>
      <section class="app-discussion"><header>${icon('message')}<strong>${w('comments')}</strong><span>2</span></header><div class="app-comment-list">${comment(getLanguage() === 'en' ? 'Yu-Ching Lin' : '林同學', getLanguage() === 'en' ? 'Could the same schedule apply during midterms?' : '如果延長到 23:00，期中考週也能比照辦理嗎？', getLanguage() === 'en' ? 'Jul 13, 10:15 AM' : '7月13日 10:15', 2)}${comment(getLanguage() === 'en' ? 'Student Affairs' : '總務處服務組', getLanguage() === 'en' ? 'We will confirm staffing and access-control arrangements first.' : '已收到建議，會先確認人力與門禁安排。', getLanguage() === 'en' ? 'Jul 14, 9:30 AM' : '7月14日 09:30')}</div><div class="app-comment-compose"><span>${w('writeComment')}</span><button aria-label="${w('reply')}">${icon('send')}</button></div></section></article>
      <aside class="app-detail-side"><section class="app-support-panel">${progress(issue)}${reactionButton({ active: issue.supported, count: issue.count, label: w('support') })}</section>${timeline(issue)}</aside></div>
  </section>`;
}

function announcementCard(item, index) {
  return `<article class="app-issue-card app-announcement-card"><div class="app-card-top"><div class="app-card-copy"><p class="app-card-meta">${profileAvatar(index + 1, 'xs')}<strong>${item.author}</strong><span>·</span><time>${item.time}</time></p><h4>${item.title}</h4></div>${icon('arrow-up-right')}</div><p class="app-card-excerpt">${item.excerpt}</p><footer>${reactionButton({ count: item.likes, kind: 'heart', label: w('announcement') })}<span class="app-comment-count">${icon('message')}<b>${item.comments}</b></span></footer></article>`;
}

function announcementsDemo() {
  const cards = getLanguage() === 'en'
    ? [
        { title: 'Library hours extended during finals', author: 'Student Affairs', time: 'Jul 12', likes: 28, comments: 6, excerpt: 'Opening hours and access details for the final examination period.' },
        { title: 'Proposal status and notification update', author: 'System Admin', time: 'Jul 10', likes: 14, comments: 3, excerpt: 'Status changes now appear more clearly throughout the application.' },
      ]
    : [
        { title: '期末考週圖書館延長開放', author: '學務處', time: '7月12日', likes: 28, comments: 6, excerpt: '公告期末考期間延長開放時段與夜間出入方式。' },
        { title: '提案狀態與通知體驗更新', author: '系統管理員', time: '7月10日', likes: 14, comments: 3, excerpt: '提案狀態變更現在會在各頁面以一致方式呈現。' },
      ];
  return `<section class="app-frame app-frame--announcements">${appSidebar('announcement')}<main><header class="app-page-head"><h3>${w('announcements')}</h3></header><div class="app-announcement-grid">${cards.map(announcementCard).join('')}</div></main></section>`;
}

function notificationsDemo() {
  return `<section class="app-frame app-frame--notifications">${appSidebar('notifications')}<main><div class="app-notification-column"><header><h3>${w('notifications')}</h3></header><div class="app-notification-group">
    <button>${profileAvatar(1)}<span><strong>${getLanguage() === 'en' ? 'A manager replied to your proposal' : '管理單位回覆了你的提案'}</strong><small>${getLanguage() === 'en' ? 'Extend library hours during finals' : '延長期末考週圖書館開放時間'}</small></span>${icon('chevron-right')}</button>
    <button><span class="app-notice-icon app-notice-icon--success">${icon('circle-check')}</span><span><strong>${getLanguage() === 'en' ? 'Proposal reached its support goal' : '提案已達附議門檻'}</strong><small>${getLanguage() === 'en' ? 'Add charging outlets to common areas' : '增加宿舍公共區域充電插座'}</small></span>${icon('chevron-right')}</button>
    <button><span class="app-notice-icon">${icon('switch-horizontal')}</span><span><strong>${getLanguage() === 'en' ? 'Proposal status changed to In progress' : '提案狀態已更新為處理中'}</strong><small>${getLanguage() === 'en' ? 'Improve water dispenser signage' : '改善教學大樓飲水機標示'}</small></span>${icon('chevron-right')}</button>
  </div></div></main></section>`;
}

function moderationDemo() {
  return `<section class="app-frame app-frame--moderation">${appSidebar()}<main>${boardToolbar()}<div class="app-issue-list">${issues().slice(0, 3).map(issueCard).join('')}</div></main><div class="app-dialog-backdrop"><section class="app-review-dialog" role="dialog" aria-label="${w('review')}"><h3>${w('review')}</h3><p>${getLanguage() === 'en' ? 'Choose the next proposal status. This update is visible to everyone who can read the proposal.' : '選擇提案接下來的狀態；有權閱讀提案的人都會看見這次更新。'}</p><label>${getLanguage() === 'en' ? 'Status' : '狀態'}</label><button class="app-select-button"><span>${w('processing')}</span>${icon('chevron-down')}</button><footer><button class="app-secondary-button">${getLanguage() === 'en' ? 'Cancel' : '取消'}</button><button class="app-primary-button">${getLanguage() === 'en' ? 'Save changes' : '儲存變更'}</button></footer></section></div></section>`;
}

function mobileDemo() {
  return `<section class="app-mobile"><main>${boardToolbar({ mobile: true })}<div class="app-issue-list">${issues().slice(0, 2).map(issueCard).join('')}</div></main><nav>${sidebarItem('proposals', 'blocks', true)}${sidebarItem('facilities', 'tool', false)}${sidebarItem('announcements', 'speakerphone', false)}${sidebarItem('notifications', 'bell', false)}${sidebarItem('settings', 'settings', false)}</nav></section>`;
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

const demoDimensions = {
  announcements: [1280, 720], board: [1280, 720], detail: [1280, 720], hero: [720, 520],
  mobile: [390, 844], moderation: [1280, 720], notifications: [1280, 720],
};

function fitDemo(root) {
  const surface = root.firstElementChild;
  if (!surface || !root.isConnected) return;
  const available = root.clientWidth;
  if (!available) return;
  const [designWidth, designHeight] = demoDimensions[root.dataset.novaeDemo] ?? demoDimensions.board;
  surface.style.width = `${designWidth}px`;
  surface.style.height = `${designHeight}px`;
  surface.style.minHeight = '0';
  surface.style.transformOrigin = 'top left';
  const scale = available / designWidth;
  surface.style.transform = `scale(${scale})`;
  root.style.aspectRatio = `${designWidth} / ${designHeight}`;
  root.style.height = 'auto';
  root.style.setProperty('--demo-scale', String(scale));
  root.dataset.demoFitted = 'true';
}

function paint(root) {
  delete root.dataset.demoFitted;
  root.innerHTML = templateFor(root.dataset.novaeDemo);
  requestAnimationFrame(() => fitDemo(root));
}

function initializeDemoInteractions(root) {
  root.addEventListener('click', (event) => {
    const reaction = event.target.closest('[data-demo-reaction]');
    if (!reaction) return;
    const active = reaction.classList.toggle('is-active');
    reaction.setAttribute('aria-pressed', String(active));
    const count = reaction.querySelector('span');
    if (count) count.textContent = String(Number(count.textContent || 0) + (active ? 1 : -1));
  });
}

export function initializeInterfaceDemos() {
  const roots = [...document.querySelectorAll('[data-novae-demo]')];
  if (!roots.length) return;
  roots.forEach((root) => { paint(root); initializeDemoInteractions(root); });
  document.addEventListener('novae:language', () => roots.forEach(paint));
  if (typeof ResizeObserver !== 'undefined') {
    const scheduled = new WeakSet();
    const observer = new ResizeObserver((entries) => entries.forEach(({ target }) => {
      if (scheduled.has(target)) return;
      scheduled.add(target);
      requestAnimationFrame(() => {
        scheduled.delete(target);
        fitDemo(target);
      });
    }));
    roots.forEach((root) => observer.observe(root));
  }
}
