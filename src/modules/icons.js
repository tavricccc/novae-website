import archive from '@tabler/icons/outline/archive.svg?raw';
import arrowRight from '@tabler/icons/outline/arrow-right.svg?raw';
import bell from '@tabler/icons/outline/bell.svg?raw';
import bellRinging from '@tabler/icons/outline/bell-ringing.svg?raw';
import chartDots from '@tabler/icons/outline/chart-dots.svg?raw';
import check from '@tabler/icons/outline/check.svg?raw';
import chevronDown from '@tabler/icons/outline/chevron-down.svg?raw';
import chevronLeft from '@tabler/icons/outline/chevron-left.svg?raw';
import chevronRight from '@tabler/icons/outline/chevron-right.svg?raw';
import circleCheck from '@tabler/icons/outline/circle-check.svg?raw';
import clockHour4 from '@tabler/icons/outline/clock-hour-4.svg?raw';
import deviceMobileDown from '@tabler/icons/outline/device-mobile-down.svg?raw';
import devices from '@tabler/icons/outline/devices.svg?raw';
import dots from '@tabler/icons/outline/dots.svg?raw';
import externalLink from '@tabler/icons/outline/external-link.svg?raw';
import eye from '@tabler/icons/outline/eye.svg?raw';
import gitBranch from '@tabler/icons/outline/git-branch.svg?raw';
import list from '@tabler/icons/outline/list.svg?raw';
import listDetails from '@tabler/icons/outline/list-details.svg?raw';
import lockHeart from '@tabler/icons/outline/lock-heart.svg?raw';
import login2 from '@tabler/icons/outline/login-2.svg?raw';
import message from '@tabler/icons/outline/message.svg?raw';
import pencil from '@tabler/icons/outline/pencil.svg?raw';
import plus from '@tabler/icons/outline/plus.svg?raw';
import refresh from '@tabler/icons/outline/refresh.svg?raw';
import route from '@tabler/icons/outline/route.svg?raw';
import search from '@tabler/icons/outline/search.svg?raw';
import send from '@tabler/icons/outline/send.svg?raw';
import share2 from '@tabler/icons/outline/share-2.svg?raw';
import shieldLock from '@tabler/icons/outline/shield-lock.svg?raw';
import sortDescending from '@tabler/icons/outline/sort-descending.svg?raw';
import speakerphone from '@tabler/icons/outline/speakerphone.svg?raw';
import switchHorizontal from '@tabler/icons/outline/switch-horizontal.svg?raw';
import thumbUp from '@tabler/icons/outline/thumb-up.svg?raw';
import trash from '@tabler/icons/outline/trash.svg?raw';
import trendingUp from '@tabler/icons/outline/trending-up.svg?raw';
import user from '@tabler/icons/outline/user.svg?raw';
import userShield from '@tabler/icons/outline/user-shield.svg?raw';

const ICONS = {
  archive,
  'arrow-right': arrowRight,
  bell,
  'bell-ringing': bellRinging,
  'chart-dots': chartDots,
  check,
  'chevron-down': chevronDown,
  'chevron-left': chevronLeft,
  'chevron-right': chevronRight,
  'circle-check': circleCheck,
  'clock-hour-4': clockHour4,
  'device-mobile-down': deviceMobileDown,
  devices,
  dots,
  'external-link': externalLink,
  eye,
  'git-branch': gitBranch,
  list,
  'list-details': listDetails,
  'lock-heart': lockHeart,
  'login-2': login2,
  message,
  pencil,
  plus,
  refresh,
  route,
  search,
  send,
  'share-2': share2,
  'shield-lock': shieldLock,
  'sort-descending': sortDescending,
  speakerphone,
  'switch-horizontal': switchHorizontal,
  'thumb-up': thumbUp,
  trash,
  'trending-up': trendingUp,
  user,
  'user-shield': userShield
};

export function icon(name) {
  const source = ICONS[name];
  if (!source) return '';
  return source
    .replace(/class="[^"]*"/, 'class="ti"')
    .replace('<svg', '<svg aria-hidden="true" focusable="false"');
}

export function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((placeholder) => {
    const svg = icon(placeholder.dataset.icon);
    if (svg) placeholder.outerHTML = svg;
  });
}
