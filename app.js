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

const menuItems = [
  { name: 'Cà phê đen', price: 25000 },
  { name: 'Cà phê nâu', price: 25000 },
  { name: 'Bạc sỉu', price: 25000 },
  { name: 'Espresso', price: 30000 },
  { name: 'Americano', price: 30000 },
  { name: 'Vanilla Latte', price: 30000 },
  { name: 'Caramel Machiato', price: 30000 },
  { name: 'Mocha', price: 30000 },
  { name: 'Trà xanh nhài', price: 30000 },
  { name: 'Trà nho', price: 30000 },
  { name: 'Trà xoài', price: 30000 },
  { name: 'Trà vải', price: 30000 },
  { name: 'Matcha Latte', price: 30000 },
  { name: 'Trà túi lọc', price: 20000 },
  { name: 'Socola đá xay', price: 30000 }
];

const rooms = [
  { id: 'A701', occupiedBy: null },
  { id: 'A702', occupiedBy: null },
  { id: 'A703', occupiedBy: null },
  { id: 'A704', occupiedBy: null },
  { id: 'A705', occupiedBy: null }
];

let currentStudent = null;
let transactions = [];
let currentPayToken = null;
let timer = null;
let countdown = 0;
const TOKEN_TTL_SECONDS = 15;
const screenHistory = [];

const el = (id) => document.getElementById(id);
const fmt = (n) => `${Number(n).toLocaleString('vi-VN')} VND`;
const rand = (len) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();

function showBanner(message) {
  const wrap = el('bannerContainer');
  const item = document.createElement('div');
  item.className = 'banner';
  item.textContent = message;
  wrap.appendChild(item);
  setTimeout(() => item.classList.add('show'), 40);
  setTimeout(() => {
    item.classList.remove('show');
    setTimeout(() => item.remove(), 300);
  }, 2600);
}

function qrImage(payload, label = 'Scan QR') {
  const encoded = encodeURIComponent(payload);
  return `<img class="qr-image" alt="QR" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encoded}"><small class="qr-hint">${label}</small>`;
}

function renderBalance() {
  el('balanceText').textContent = fmt(currentStudent.balance);
}

function showScreen(targetId, remember = true) {
  document.querySelectorAll('.screen').forEach((section) => section.classList.add('hidden'));
  el(targetId).classList.remove('hidden');
  el('homeBtn').classList.toggle('active', targetId === 'homeScreen');
  if (remember) screenHistory.push(targetId);
  el('backBtn').classList.toggle('hidden', targetId === 'homeScreen');
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
  currentPayToken = {
    token: rand(8),
    code: String(Math.floor(100000 + Math.random() * 900000)),
    userId: currentStudent.id,
    issuedAt,
    expiresAt: issuedAt + TOKEN_TTL_SECONDS * 1000,
    used: false
  };

  countdown = TOKEN_TTL_SECONDS;
  const payload = JSON.stringify({ token: currentPayToken.token, userId: currentPayToken.userId, issuedAt });
  el('payQrBox').innerHTML = qrImage(payload, 'Merchant scans this pay QR');
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
  if (amount < 1000) return showBanner('Top-up amount must be at least 1,000 VND');
  const payload = JSON.stringify({
    type: 'TOPUP',
    userId: currentStudent.id,
    studentId: currentStudent.studentId,
    amount,
    nonce: rand(6),
    ts: Date.now()
  });
  el('receiveQrBox').innerHTML = qrImage(payload, 'Scan with bank app (demo only)');
  el('receiveText').textContent = `Top-up request: ${fmt(amount)} (demo QR)`;
  showBanner(`New top-up QR generated for ${fmt(amount)}`);
}

function chargeStudent(amount, service, source = 'merchant') {
  if (currentStudent.balance < amount) return false;
  currentStudent.balance -= amount;
  transactions.push({ userId: currentStudent.id, service, amount: -amount, source, timestamp: Date.now() });
  renderBalance();
  renderTransactions();
  return true;
}

function renderMenu() {
  el('menuList').innerHTML = menuItems.map((item) => `
    <article class="menu-item">
      <div>
        <h4>${item.name}</h4>
        <p>${fmt(item.price)}</p>
      </div>
      <button data-order="${item.name}" data-price="${item.price}">Pre-order</button>
    </article>
  `).join('');

  document.querySelectorAll('[data-order]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-order');
      const price = Number(btn.getAttribute('data-price'));
      if (!chargeStudent(price, `FHUB: ${name}`, 'preorder')) {
        showBanner('Insufficient balance');
        return;
      }
      showBanner(`Pre-order success: ${name} - ${fmt(price)}`);
    });
  });
}

function renderRooms() {
  el('roomList').innerHTML = rooms.map((room) => {
    const mine = room.occupiedBy === currentStudent.id;
    const occupied = Boolean(room.occupiedBy);
    return `
      <article class="room-item ${occupied ? 'occupied' : 'free'}">
        <div>
          <h4>${room.id}</h4>
          <p>${occupied ? (mine ? 'You are using this room' : 'Occupied') : 'Available'}</p>
        </div>
        <div class="room-actions">
          ${mine ? `<button data-checkout="${room.id}" class="warn">Check out</button>` : ''}
          ${!occupied ? `<button data-use="${room.id}">Use room</button>` : ''}
        </div>
      </article>
    `;
  }).join('');

  document.querySelectorAll('[data-use]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const roomId = btn.getAttribute('data-use');
      const room = rooms.find((r) => r.id === roomId);
      room.occupiedBy = currentStudent.id;
      showBanner(`You are now using room ${roomId}`);
      renderRooms();
    });
  });

  document.querySelectorAll('[data-checkout]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const roomId = btn.getAttribute('data-checkout');
      const room = rooms.find((r) => r.id === roomId);
      room.occupiedBy = null;
      showBanner(`Checked out from ${roomId}`);
      renderRooms();
    });
  });
}

function renderCards() {
  const libPayload = JSON.stringify({ type: 'LIB_CARD', userId: currentStudent.id, studentId: currentStudent.studentId, ts: Date.now() });
  el('libraryQrBox').innerHTML = qrImage(libPayload, 'Library scanner QR');
  el('libraryText').textContent = `${currentStudent.name} • ${currentStudent.studentId}`;

  const idPayload = JSON.stringify({ type: 'STUDENT_ID', userId: currentStudent.id, studentId: currentStudent.studentId, name: currentStudent.name });
  el('idQrBox').innerHTML = qrImage(idPayload, 'Student ID QR');
  el('idText').textContent = `${currentStudent.name} • FTU Student`;
}

function showApp() {
  el('loginScreen').classList.add('hidden');
  el('appScreen').classList.remove('hidden');
  el('studentName').textContent = currentStudent.name;
  el('studentIdText').textContent = `ID: ${currentStudent.studentId}`;
  renderBalance();
  renderTransactions();
  renderMenu();
  renderRooms();
  renderCards();
  generatePayToken();
  generateTopupQr();
  startTokenTimer();
  screenHistory.length = 0;
  showScreen('homeScreen');
  showBanner(`Welcome ${currentStudent.name}`);
}

el('studentLoginBtn').addEventListener('click', () => {
  const id = el('studentId').value.trim();
  const pin = el('studentPin').value.trim();
  const user = users[id];
  if (!user || user.pin !== pin) return alert('Invalid student ID or PIN');
  currentStudent = user;
  showApp();
});

el('logoutBtn').addEventListener('click', () => {
  currentStudent = null;
  if (timer) clearInterval(timer);
  el('appScreen').classList.add('hidden');
  el('loginScreen').classList.remove('hidden');
  showBanner('Logged out');
});

el('backBtn').addEventListener('click', goBack);
el('homeBtn').addEventListener('click', () => showScreen('homeScreen'));

document.querySelectorAll('[data-target]').forEach((btn) => {
  btn.addEventListener('click', () => showScreen(btn.getAttribute('data-target')));
});

el('refreshPayBtn').addEventListener('click', () => {
  generatePayToken();
  showBanner('Pay QR refreshed');
});
el('generateTopupBtn').addEventListener('click', generateTopupQr);

el('chargeBtn').addEventListener('click', () => {
  if (!currentStudent) return alert('Login student first.');
  const value = el('tokenInput').value.trim();
  const amount = Number(el('amountInput').value || 0);
  const service = el('serviceSelect').value;

  if (!value || !currentPayToken || (value !== currentPayToken.token && value !== currentPayToken.code)) {
    el('merchantMsg').textContent = '❌ Invalid token/code';
    return;
  }
  if (currentPayToken.used) {
    el('merchantMsg').textContent = '❌ Token already used';
    return;
  }
  if (Date.now() > currentPayToken.expiresAt) {
    el('merchantMsg').textContent = '❌ Token expired, ask student to refresh';
    return;
  }

  if (!chargeStudent(amount, `Merchant: ${service}`, 'merchant')) {
    el('merchantMsg').textContent = '❌ Insufficient balance';
    return;
  }

  currentPayToken.used = true;
  el('tokenInput').value = '';
  el('merchantMsg').textContent = `✅ Payment success: ${fmt(amount)} (${service})`;
  showBanner(`Payment success: ${fmt(amount)}`);
});
