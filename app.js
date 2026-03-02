const users = {
  '2312280041': { id: 'U001', name: 'Nguyen Minh Anh', studentId: '2312280041', pin: '123456', balance: 550000 },
  '2312280042': { id: 'U002', name: 'Tran Bao Chau', studentId: '2312280042', pin: '123456', balance: 320000 }
};

let currentStudent = null;
let transactions = [];
let currentToken = null;
let timer = null;
let countdown = 0;

const TOKEN_TTL_SECONDS = 15;

const el = (id) => document.getElementById(id);
const fmt = (n) => `${Number(n).toLocaleString('vi-VN')} VND`;
const rand = (len) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();

function showApp() {
  el('loginScreen').classList.add('hidden');
  el('appScreen').classList.remove('hidden');
  el('studentName').textContent = currentStudent.name;
  el('studentIdText').textContent = `ID: ${currentStudent.studentId}`;
  renderBalance();
  renderTx();
}

function renderBalance() {
  el('balanceText').textContent = fmt(currentStudent.balance);
}

function renderQRCode(payload) {
  const qrBox = el('qrBox');
  const encodedData = encodeURIComponent(payload);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodedData}`;
  qrBox.innerHTML = `
    <img src="${qrImageUrl}" alt="Dynamic payment QR" class="qr-image" onerror="this.replaceWith(Object.assign(document.createElement('pre'),{className:'qr-fallback',textContent:${'`'}${payload}${'`'}}));" />
    <small class="qr-hint">Scan this QR from merchant screen</small>
  `;
}

function generateToken() {
  const issuedAt = Date.now();
  currentToken = {
    token: rand(8),
    code: String(Math.floor(100000 + Math.random() * 900000)),
    userId: currentStudent.id,
    issuedAt,
    expiresAt: issuedAt + TOKEN_TTL_SECONDS * 1000,
    used: false
  };

  countdown = TOKEN_TTL_SECONDS;
  const payload = JSON.stringify({
    token: currentToken.token,
    userId: currentToken.userId,
    issuedAt: currentToken.issuedAt
  });

  renderQRCode(payload);
  el('codeText').textContent = currentToken.code;
  el('countText').textContent = `Refresh in ${countdown}s`;
  el('countdownBar').style.width = '100%';
}

function startCountdown() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    countdown = Math.max(0, countdown - 1);
    el('countText').textContent = `Refresh in ${countdown}s`;
    el('countdownBar').style.width = `${(countdown / TOKEN_TTL_SECONDS) * 100}%`;
    if (countdown === 0) generateToken();
  }, 1000);
}

function renderTx() {
  const box = el('txList');
  const mine = transactions.filter((t) => t.userId === currentStudent.id).slice(-5).reverse();
  if (!mine.length) {
    box.innerHTML = '<small>No payments yet.</small>';
    return;
  }
  box.innerHTML = mine.map((t) => `<div class="tx-item"><span>${t.service}</span><b>-${fmt(t.amount)}</b></div>`).join('');
}

el('studentLoginBtn').addEventListener('click', () => {
  const id = el('studentId').value.trim();
  const pin = el('studentPin').value.trim();
  const user = users[id];
  if (!user || user.pin !== pin) return alert('Invalid student ID or PIN');
  currentStudent = user;
  showApp();
  generateToken();
  startCountdown();
});

el('logoutBtn').addEventListener('click', () => {
  currentStudent = null;
  el('appScreen').classList.add('hidden');
  el('loginScreen').classList.remove('hidden');
  if (timer) clearInterval(timer);
});

el('walletBtn').addEventListener('click', () => {
  el('homeTab').classList.add('hidden');
  el('walletTab').classList.remove('hidden');
  el('walletBtn').classList.add('active');
  el('homeBtn').classList.remove('active');
});

el('homeBtn').addEventListener('click', () => {
  el('walletTab').classList.add('hidden');
  el('homeTab').classList.remove('hidden');
  el('homeBtn').classList.add('active');
  el('walletBtn').classList.remove('active');
});

[...document.querySelectorAll('[data-open="walletTab"]')].forEach((b) => b.addEventListener('click', () => el('walletBtn').click()));
el('refreshBtn').addEventListener('click', generateToken);

el('chargeBtn').addEventListener('click', () => {
  if (!currentStudent) return alert('Login student first.');
  const value = el('tokenInput').value.trim();
  const amount = Number(el('amountInput').value);
  const service = el('serviceSelect').value;

  if (!value || !currentToken || (value !== currentToken.token && value !== currentToken.code)) {
    el('merchantMsg').textContent = '❌ Invalid token/code';
    return;
  }
  if (currentToken.used) {
    el('merchantMsg').textContent = '❌ Token already used';
    return;
  }
  if (Date.now() > currentToken.expiresAt) {
    el('merchantMsg').textContent = '❌ Token expired, ask student to refresh';
    return;
  }
  if (currentStudent.balance < amount) {
    el('merchantMsg').textContent = '❌ Insufficient balance';
    return;
  }

  currentToken.used = true;
  currentStudent.balance -= amount;
  transactions.push({ txId: `TX-${transactions.length + 1}`, userId: currentStudent.id, service, amount, timestamp: Date.now() });
  renderBalance();
  renderTx();
  el('tokenInput').value = '';
  el('merchantMsg').textContent = `✅ Payment success: ${fmt(amount)} (${service})`;
});
