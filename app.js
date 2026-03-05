const users = {
  '2312280041': { id: 'U001', name: 'Vu Hai Nam', studentId: '2312280041', pin: '1', balance: 487000 },
  '2312280008': { id: 'U002', name: 'Nguyen Minh Anh', studentId: '2312280008', pin: '1', balance: 354000 },
  '2312280055': { id: 'U003', name: 'Nguyen To Uyen', studentId: '2312280055', pin: '1', balance: 621000 },
  '2312280025': { id: 'U004', name: 'Tran Quang Huy', studentId: '2312280025', pin: '1', balance: 275000 },
  '2312280013': { id: 'U005', name: 'Vu Ngoc Linh Chi', studentId: '2312280013', pin: '1', balance: 503000 },
  '2312280039': { id: 'U006', name: 'Ta Duc Minh', studentId: '2312280039', pin: '1', balance: 432000 },
  '2312280030': { id: 'U007', name: 'Do Thuy Hien', studentId: '2312280030', pin: '1', balance: 368000 },
  '2312280803': { id: 'U008', name: 'Nguyen Minh Duc', studentId: '2312280803', pin: '1', balance: 590000 }
};

const translations = {
  en: {
    campusWallet: 'Campus Wallet', wallet: 'Wallet', preOrder: 'Pre-order', room: 'Room', library: 'Library', id: 'ID', locker: 'Locker',
    settings: 'Settings', personalData: 'Personal data', language: 'Language', darkMode: 'Dark mode', logout: 'Logout',
    pay: 'Pay', receive: 'Receive', payQr: 'Pay QR', recentTx: 'Recent transactions', refreshNow: 'Refresh now',
    receiveTitle: 'Receive', topupAmount: 'Top-up amount (VND)', generateTopup: 'Generate new top-up QR', paidTopup: 'I paid this QR (demo add balance)',
    fhub: 'F.HUB Menu', roomBooking: 'Room Booking', libraryQr: 'Library Card QR', studentQr: 'Student ID QR',
    lockerControl: 'Locker Control', openLocker: 'Scan QR to open locker (demo)', releaseLocker: 'Release my locker', lockerStatus: 'View locker status map',
    lockerStatusTitle: 'Locker Status (20)', lockerHint: 'Green = available, Red = occupied',
    merchantPos: 'Merchant POS', demoMerchant: 'Demo merchant: ', service: 'Service', amount: 'Amount (VND)', token: 'Enter token or 6-digit code', charge: 'Charge Student Wallet', waiting: 'Waiting...',
    cart: 'Cart', checkout: 'Checkout cart', cartEmpty: 'Your cart is empty.', total: 'Total', fullScreen: 'Enable full screen', exitFullScreen: 'Exit full screen'
  },
  vi: {
    campusWallet: 'Ví Sinh viên', wallet: 'Ví', preOrder: 'Đặt trước', room: 'Phòng', library: 'Thư viện', id: 'Thẻ SV', locker: 'Tủ đồ',
    settings: 'Cài đặt', personalData: 'Thông tin cá nhân', language: 'Ngôn ngữ', darkMode: 'Chế độ tối', logout: 'Đăng xuất',
    pay: 'Thanh toán', receive: 'Nhận tiền', payQr: 'QR Thanh toán', recentTx: 'Giao dịch gần đây', refreshNow: 'Làm mới',
    receiveTitle: 'Nhận tiền', topupAmount: 'Số tiền nạp (VND)', generateTopup: 'Tạo QR nạp tiền mới', paidTopup: 'Đã quét QR (mô phỏng cộng tiền)',
    fhub: 'Menu F.HUB', roomBooking: 'Đặt phòng', libraryQr: 'QR Thẻ thư viện', studentQr: 'QR Thẻ sinh viên',
    lockerControl: 'Điều khiển tủ', openLocker: 'Quét QR mở tủ (mô phỏng)', releaseLocker: 'Trả tủ của tôi', lockerStatus: 'Xem trạng thái tủ',
    lockerStatusTitle: 'Trạng thái tủ (20)', lockerHint: 'Xanh = trống, Đỏ = đã dùng',
    merchantPos: 'POS Merchant', demoMerchant: 'Merchant demo: ', service: 'Dịch vụ', amount: 'Số tiền (VND)', token: 'Nhập token hoặc mã 6 số', charge: 'Trừ tiền ví sinh viên', waiting: 'Đang chờ...',
    cart: 'Giỏ hàng', checkout: 'Thanh toán giỏ hàng', cartEmpty: 'Giỏ hàng đang trống.', total: 'Tổng cộng', fullScreen: 'Bật toàn màn hình', exitFullScreen: 'Thoát toàn màn hình'
  }
};

const menuItems = [
  { name: 'Cà phê đen', price: 25000 }, { name: 'Cà phê nâu', price: 25000 }, { name: 'Bạc sỉu', price: 25000 },
  { name: 'Espresso', price: 30000 }, { name: 'Americano', price: 30000 }, { name: 'Vanilla Latte', price: 30000 },
  { name: 'Caramel Machiato', price: 30000 }, { name: 'Mocha', price: 30000 }, { name: 'Trà xanh nhài', price: 30000 },
  { name: 'Trà nho', price: 30000 }, { name: 'Trà xoài', price: 30000 }, { name: 'Trà vải', price: 30000 },
  { name: 'Matcha Latte', price: 30000 }, { name: 'Trà túi lọc', price: 20000 }, { name: 'Socola đá xay', price: 30000 }
];

const rooms = [
  { id: 'A701', occupiedBy: null }, { id: 'A702', occupiedBy: null }, { id: 'A703', occupiedBy: null }, { id: 'A704', occupiedBy: null }, { id: 'A705', occupiedBy: null }
];

const lockers = Array.from({ length: 20 }, (_, i) => ({ id: `L${String(i + 1).padStart(2, '0')}`, occupiedBy: null }));

let currentStudent = null;
let transactions = [];
let currentPayToken = null;
let timer = null;
let countdown = 0;
let currentTopupAmount = 0;
let userLocker = {};
let currentLang = 'en';
let cart = {};
let isFullscreenPreview = false;
const TOKEN_TTL_SECONDS = 15;
const screenHistory = [];

const el = (id) => document.getElementById(id);
const fmt = (n) => `${Number(n).toLocaleString('vi-VN')} VND`;
const rand = (len) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();

function t(key) { return translations[currentLang][key] || key; }

function applyLanguage() {
  el('labelCampusWallet').textContent = t('campusWallet');
  el('labelWallet').textContent = t('wallet');
  el('labelPreOrder').textContent = t('preOrder');
  el('labelRoom').textContent = t('room');
  el('labelLibrary').textContent = t('library');
  el('labelId').textContent = t('id');
  el('labelLocker').textContent = t('locker');
  el('labelSettings').textContent = t('settings');
  el('labelPersonalData').textContent = t('personalData');
  el('labelLanguage').textContent = t('language');
  el('labelDarkMode').textContent = t('darkMode');
  el('settingsLogoutBtn').textContent = t('logout');
  el('labelWalletTitle').textContent = t('wallet');
  el('labelPay').textContent = t('pay');
  el('labelReceive').textContent = t('receive');
  el('labelPayQr').textContent = t('payQr');
  el('labelRecentTx').textContent = t('recentTx');
  el('refreshPayBtn').textContent = t('refreshNow');
  el('labelReceiveTitle').textContent = t('receiveTitle');
  el('labelTopupAmount').textContent = t('topupAmount');
  el('generateTopupBtn').textContent = t('generateTopup');
  el('confirmTopupBtn').textContent = t('paidTopup');
  el('labelFhub').textContent = t('fhub');
  el('labelCart').textContent = t('cart');
  el('checkoutBtn').textContent = t('checkout');
  el('fullscreenBtn').textContent = isFullscreenPreview ? t('exitFullScreen') : t('fullScreen');
  el('labelRoomBooking').textContent = t('roomBooking');
  el('labelLibraryQr').textContent = t('libraryQr');
  el('labelStudentQr').textContent = t('studentQr');
  el('labelLockerControl').textContent = t('lockerControl');
  el('openLockerBtn').textContent = t('openLocker');
  el('releaseLockerBtn').textContent = t('releaseLocker');
  el('lockerStatusBtn').textContent = t('lockerStatus');
  el('labelLockerStatus').textContent = t('lockerStatusTitle');
  el('lockerMapHint').textContent = t('lockerHint');
  el('labelMerchantPos').textContent = t('merchantPos');
  el('labelDemoMerchant').innerHTML = `${t('demoMerchant')}<b>FTU Canteen A</b>`;
  el('labelService').textContent = t('service');
  el('labelAmount').textContent = t('amount');
  el('labelToken').textContent = t('token');
  el('chargeBtn').textContent = t('charge');
  if (el('merchantMsg').textContent.trim() === '' || el('merchantMsg').textContent.trim() === 'Waiting...' || el('merchantMsg').textContent.trim() === 'Đang chờ...') {
    el('merchantMsg').textContent = t('waiting');
  }
  el('navWallet').textContent = t('wallet');
}

function showBanner(message) {
  const wrap = el('bannerContainer');
  const item = document.createElement('div');
  item.className = 'banner';
  item.textContent = message;
  wrap.appendChild(item);
  setTimeout(() => item.classList.add('show'), 40);
  setTimeout(() => { item.classList.remove('show'); setTimeout(() => item.remove(), 300); }, 2600);
}

function qrImage(payload, label = 'Scan QR') {
  const encoded = encodeURIComponent(payload);
  return `<img class="qr-image" alt="QR" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encoded}"><small class="qr-hint">${label}</small>`;
}

function withSecurityOverlay(containerId) {
  const box = el(containerId);
  box.innerHTML += `<div class="secure-overlay" data-secure="${containerId}"><div class="secure-icon">🙈</div><p>Protected QR</p><button class="reveal-btn" data-reveal="${containerId}">Reveal with Face ID</button></div>`;
}

function setupSecureReveal() {
  document.querySelectorAll('[data-reveal]').forEach((btn) => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-reveal');
      const overlay = document.querySelector(`.secure-overlay[data-secure="${id}"]`);
      if (!overlay) return;
      overlay.innerHTML = `<div class="faceid-demo"><div class="face-ring"></div><p>Face ID</p><small>Authenticating…</small></div>`;
      setTimeout(() => { overlay.style.opacity = '0'; setTimeout(() => overlay.remove(), 260); showBanner('Identity verified. QR unlocked.'); }, 900);
    };
  });
}

function renderBalance() { el('balanceText').textContent = fmt(currentStudent.balance); }

function showScreen(targetId, remember = true) {
  document.querySelectorAll('.screen').forEach((section) => section.classList.add('hidden'));
  el(targetId).classList.remove('hidden');
  el('homeBtn').classList.toggle('active', targetId === 'homeScreen');
  if (remember) screenHistory.push(targetId);
  el('backBtn').classList.toggle('hidden', targetId === 'homeScreen');

  if (targetId === 'receiveScreen' && currentStudent) generateTopupQr();
  if (targetId === 'roomScreen' && currentStudent) renderRooms();
  if (targetId === 'lockerScreen' && currentStudent) renderLockerUser();
  if (targetId === 'lockerMapScreen' && currentStudent) renderLockerMap();
  if (targetId === 'libraryScreen' || targetId === 'idCardScreen') renderCards();
}

function goBack() {
  if (screenHistory.length <= 1) return showScreen('homeScreen', false);
  screenHistory.pop();
  showScreen(screenHistory[screenHistory.length - 1], false);
}

function renderTransactions() {
  const mine = transactions.filter((t) => t.userId === currentStudent.id).slice(-6).reverse();
  el('txList').innerHTML = mine.length
    ? mine.map((t) => `<div class="tx-item"><span>${t.service}</span><b>${t.amount < 0 ? '-' : '+'}${fmt(Math.abs(t.amount))}</b></div>`).join('')
    : '<small>No transactions yet.</small>';
}

function generatePayToken() {
  const issuedAt = Date.now();
  currentPayToken = { token: rand(8), code: String(Math.floor(100000 + Math.random() * 900000)), userId: currentStudent.id, issuedAt, expiresAt: issuedAt + TOKEN_TTL_SECONDS * 1000, used: false };
  countdown = TOKEN_TTL_SECONDS;
  el('payQrBox').innerHTML = qrImage(JSON.stringify({ token: currentPayToken.token, userId: currentPayToken.userId, issuedAt }), 'Merchant scans this pay QR');
  el('payCodeText').textContent = currentPayToken.code;
  el('countText').textContent = `Refresh in ${countdown}s`;
  el('countdownBar').style.width = '100%';
}

function startTokenTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    countdown = Math.max(0, countdown - 1);
    el('countText').textContent = `Refresh in ${countdown}s`;
    el('countdownBar').style.width = `${(countdown / TOKEN_TTL_SECONDS) * 100}%`;
    if (countdown === 0) generatePayToken();
  }, 1000);
}

function generateTopupQr() {
  const amount = Number(el('topupAmount').value || 0);
  if (!Number.isFinite(amount) || amount < 1000) return showBanner('Top-up amount must be at least 1,000 VND');
  currentTopupAmount = Math.floor(amount);
  el('receiveQrBox').innerHTML = qrImage(JSON.stringify({ type: 'RECEIVE', userId: currentStudent.id, studentId: currentStudent.studentId, amount: currentTopupAmount, nonce: rand(6), ts: Date.now() }), 'Scan with bank app (demo only)');
  el('receiveText').textContent = `Receive request: ${fmt(currentTopupAmount)} (demo QR)`;
}

function chargeStudent(amount, service, source = 'merchant') {
  if (currentStudent.balance < amount) return false;
  currentStudent.balance -= amount;
  transactions.push({ userId: currentStudent.id, service, amount: -amount, source, timestamp: Date.now() });
  renderBalance(); renderTransactions();
  return true;
}

function confirmTopup() {
  if (!currentTopupAmount) return showBanner('Generate a receive QR first');
  currentStudent.balance += currentTopupAmount;
  transactions.push({ userId: currentStudent.id, service: 'Top-up / Receive', amount: currentTopupAmount, source: 'topup', timestamp: Date.now() });
  renderBalance(); renderTransactions();
  showBanner(`Balance added: +${fmt(currentTopupAmount)}`);
  generateTopupQr();
}

function renderMenu() {
  const categories = {
    coffee: ['Cà phê đen', 'Cà phê nâu', 'Bạc sỉu', 'Espresso', 'Americano', 'Vanilla Latte', 'Caramel Machiato', 'Mocha'],
    tea: ['Trà xanh nhài', 'Trà nho', 'Trà xoài', 'Trà vải', 'Trà túi lọc'],
    other: ['Matcha Latte', 'Socola đá xay']
  };
  const labels = {
    en: { coffee: 'Coffee', tea: 'Tea', other: 'Other' },
    vi: { coffee: 'Cà phê', tea: 'Trà', other: 'Khác' }
  };

  el('menuList').innerHTML = ['coffee', 'tea', 'other'].map((group) => {
    const items = menuItems.filter((item) => categories[group].includes(item.name));
    return `<div class="menu-section">${labels[currentLang][group]}</div>${items.map((item) => {
      const qty = cart[item.name] || 0;
      return `<article class="menu-item"><div><h4>${item.name}</h4><p>${fmt(item.price)}</p></div><div class="qty-control"><button data-minus="${item.name}">-</button><b>${qty}</b><button data-plus="${item.name}">+</button></div></article>`;
    }).join('')}`;
  }).join('');

  document.querySelectorAll('[data-plus]').forEach((btn) => btn.onclick = () => updateCart(btn.getAttribute('data-plus'), 1));
  document.querySelectorAll('[data-minus]').forEach((btn) => btn.onclick = () => updateCart(btn.getAttribute('data-minus'), -1));
  renderCart();
}

function updateCart(itemName, change) {
  const next = Math.max(0, (cart[itemName] || 0) + change);
  if (next === 0) delete cart[itemName];
  else cart[itemName] = next;
  renderMenu();
}

function renderCart() {
  const entries = Object.entries(cart);
  if (!entries.length) {
    el('cartList').innerHTML = `<small>${t('cartEmpty')}</small>`;
    return;
  }
  const lines = entries.map(([name, qty]) => {
    const item = menuItems.find((m) => m.name === name);
    return `<div class="cart-item"><span>${name} x${qty}</span><b>${fmt(item.price * qty)}</b></div>`;
  });
  const total = entries.reduce((sum, [name, qty]) => {
    const item = menuItems.find((m) => m.name === name);
    return sum + (item.price * qty);
  }, 0);
  lines.push(`<div class="cart-total">${t('total')}: ${fmt(total)}</div>`);
  el('cartList').innerHTML = lines.join('');
}

function checkoutCart() {
  const entries = Object.entries(cart);
  if (!entries.length) return showBanner(t('cartEmpty'));
  const total = entries.reduce((sum, [name, qty]) => {
    const item = menuItems.find((m) => m.name === name);
    return sum + (item.price * qty);
  }, 0);
  if (!chargeStudent(total, 'FHUB Cart Checkout', 'preorder')) return showBanner('Insufficient balance');
  cart = {};
  renderMenu();
  showBanner(`Checkout success: ${fmt(total)}`);
}

function renderRooms() {
  el('roomList').innerHTML = rooms.map((room) => {
    const mine = room.occupiedBy === currentStudent.id;
    const occupied = Boolean(room.occupiedBy);
    return `<article class="room-item ${occupied ? 'occupied' : 'free'}"><div><h4>${room.id}</h4><p>${occupied ? (mine ? 'You are using this room' : 'Occupied') : 'Available'}</p></div><div class="room-actions">${mine ? `<button data-checkout="${room.id}" class="warn">Check out</button>` : ''}${!occupied ? `<button data-use="${room.id}">Use room</button>` : ''}</div></article>`;
  }).join('');
  document.querySelectorAll('[data-use]').forEach((btn) => btn.onclick = () => { const room = rooms.find((r) => r.id === btn.getAttribute('data-use')); room.occupiedBy = currentStudent.id; renderRooms(); });
  document.querySelectorAll('[data-checkout]').forEach((btn) => btn.onclick = () => { const room = rooms.find((r) => r.id === btn.getAttribute('data-checkout')); room.occupiedBy = null; renderRooms(); });
}

function renderCards() {
  el('libraryQrBox').innerHTML = qrImage(JSON.stringify({ type: 'LIB_CARD', userId: currentStudent.id, studentId: currentStudent.studentId, ts: Date.now() }), 'Library scanner QR');
  withSecurityOverlay('libraryQrBox');
  el('libraryText').textContent = `${currentStudent.name} • ${currentStudent.studentId}`;
  el('idQrBox').innerHTML = qrImage(JSON.stringify({ type: 'STUDENT_ID', userId: currentStudent.id, studentId: currentStudent.studentId, name: currentStudent.name }), 'Student ID QR');
  withSecurityOverlay('idQrBox');
  el('idText').textContent = `${currentStudent.name} • FTU Student`;
  setupSecureReveal();
}

function renderLockerUser() {
  const assigned = userLocker[currentStudent.id];
  if (!assigned) {
    el('lockerQrBox').innerHTML = qrImage(JSON.stringify({ type: 'LOCKER_OPEN', userId: currentStudent.id, studentId: currentStudent.studentId, nonce: rand(6), ts: Date.now() }), 'Scan at locker to open one locker');
    el('lockerText').textContent = 'One locker per student. Scan once to claim.';
    el('openLockerBtn').disabled = false;
    el('releaseLockerBtn').disabled = true;
  } else {
    el('lockerQrBox').innerHTML = '<div class="locker-claimed">✅ Locker opened</div>';
    el('lockerText').textContent = `You are using locker ${assigned}.`;
    el('openLockerBtn').disabled = true;
    el('releaseLockerBtn').disabled = false;
  }
}

function renderLockerMap() {
  el('lockerGrid').innerHTML = lockers.map((l) => `<button class="locker-cell ${l.occupiedBy ? 'occupied' : 'free'}" data-locker="${l.id}">${l.id}</button>`).join('');
  document.querySelectorAll('[data-locker]').forEach((btn) => {
    btn.onclick = () => {
      const locker = lockers.find((l) => l.id === btn.getAttribute('data-locker'));
      if (!locker.occupiedBy) return showBanner(`${locker.id} is available`);
      const owner = Object.values(users).find((u) => u.id === locker.occupiedBy);
      showBanner(`${locker.id}: ${owner ? owner.name : locker.occupiedBy} is using it`);
    };
  });
}

function claimLocker() {
  if (userLocker[currentStudent.id]) return;
  const free = lockers.find((l) => !l.occupiedBy);
  if (!free) return showBanner('No free locker left');
  free.occupiedBy = currentStudent.id;
  userLocker[currentStudent.id] = free.id;
  renderLockerUser();
  renderLockerMap();
  showBanner(`Locker ${free.id} opened`);
}

function releaseLocker() {
  const assigned = userLocker[currentStudent.id];
  if (!assigned) return showBanner('You have no locker to release');
  const locker = lockers.find((l) => l.id === assigned);
  if (locker) locker.occupiedBy = null;
  delete userLocker[currentStudent.id];
  renderLockerUser();
  renderLockerMap();
  showBanner(`Locker ${assigned} released`);
}


function toggleFullscreenPreview() {
  isFullscreenPreview = !isFullscreenPreview;
  el('phoneFrame').classList.toggle('fullscreen-mode', isFullscreenPreview);
  el('fullscreenBtn').textContent = isFullscreenPreview ? t('exitFullScreen') : t('fullScreen');
}

function showApp() {
  el('loginScreen').classList.add('hidden');
  el('appScreen').classList.remove('hidden');
  el('profileMain').textContent = currentStudent.studentId;
  el('profileSub').textContent = currentStudent.name;
  el('studentIdText').textContent = `ID: ${currentStudent.studentId}`;
  renderBalance(); renderTransactions(); renderMenu(); renderRooms(); renderCards(); renderLockerUser(); renderLockerMap();
  generatePayToken(); generateTopupQr(); startTokenTimer();
  applyLanguage();
  isFullscreenPreview = false;
  el('phoneFrame').classList.remove('fullscreen-mode');
  cart = {};
  screenHistory.length = 0;
  showScreen('homeScreen');
}

function logout() {
  currentStudent = null;
  cart = {};
  isFullscreenPreview = false;
  el('phoneFrame').classList.remove('fullscreen-mode');
  if (timer) clearInterval(timer);
  el('appScreen').classList.add('hidden');
  el('loginScreen').classList.remove('hidden');
}

el('studentLoginBtn').addEventListener('click', () => {
  const id = el('studentId').value.trim();
  const pin = el('studentPin').value.trim();
  const user = users[id];
  if (!user || user.pin !== pin) return alert('Invalid student ID or PIN');
  currentStudent = user;
  showApp();
});

el('profileBtn').addEventListener('click', () => showScreen('personalScreen'));
el('settingsBtn').addEventListener('click', () => showScreen('settingsScreen'));
el('settingsLogoutBtn').addEventListener('click', logout);
el('backBtn').addEventListener('click', goBack);
el('homeBtn').addEventListener('click', () => showScreen('homeScreen'));

document.querySelectorAll('[data-target]').forEach((btn) => btn.addEventListener('click', () => showScreen(btn.getAttribute('data-target'))));

el('refreshPayBtn').addEventListener('click', generatePayToken);
el('generateTopupBtn').addEventListener('click', generateTopupQr);
el('confirmTopupBtn').addEventListener('click', confirmTopup);
el('openLockerBtn').addEventListener('click', claimLocker);
el('releaseLockerBtn').addEventListener('click', releaseLocker);
el('lockerStatusBtn').addEventListener('click', () => showScreen('lockerMapScreen'));

el('languageSelect').addEventListener('change', (e) => { currentLang = e.target.value; applyLanguage(); });
el('darkToggle').addEventListener('change', (e) => el('appScreen').classList.toggle('dark-mode', e.target.checked));
el('fullscreenBtn').addEventListener('click', toggleFullscreenPreview);
el('checkoutBtn').addEventListener('click', checkoutCart);

el('chargeBtn').addEventListener('click', () => {
  if (!currentStudent) return alert('Login student first.');
  const value = el('tokenInput').value.trim();
  const amount = Number(el('amountInput').value || 0);
  const service = el('serviceSelect').value;

  if (!value || !currentPayToken || (value !== currentPayToken.token && value !== currentPayToken.code)) return (el('merchantMsg').textContent = '❌ Invalid token/code');
  if (currentPayToken.used) return (el('merchantMsg').textContent = '❌ Token already used');
  if (Date.now() > currentPayToken.expiresAt) return (el('merchantMsg').textContent = '❌ Token expired, ask student to refresh');
  if (!chargeStudent(amount, `Merchant: ${service}`, 'merchant')) return (el('merchantMsg').textContent = '❌ Insufficient balance');

  currentPayToken.used = true;
  el('tokenInput').value = '';
  el('merchantMsg').textContent = `✅ Payment success: ${fmt(amount)} (${service})`;
});
