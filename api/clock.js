module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  const GAS_URL = process.env.GAS_URL;
  const LIFF_ID = process.env.LIFF_ID;

  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<title>饗鍋物料理 · 打卡系統</title>
<script charset="utf-8" src="https://static.line-scdn.net/liff/edge/2/sdk.js"></script>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: sans-serif; background: #0e1228; min-height: 100vh; display: flex; flex-direction: column; align-items: center; }
.top-bar { width: 100%; background: #080a16; padding: 16px 20px; text-align: center; border-bottom: 1px solid rgba(201,168,76,0.3); }
.gold-line { height: 2px; background: linear-gradient(90deg, transparent, #c9a84c, #f0d060, #c9a84c, transparent); width: 100%; }
.brand { font-size: 18px; font-weight: 700; color: #e8c860; letter-spacing: 6px; margin: 8px 0 4px; }
.brand-en { font-size: 9px; color: #6a5828; letter-spacing: 4px; }
.user-card { margin: 20px 16px; background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.3); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 14px; width: calc(100% - 32px); }
.avatar { width: 52px; height: 52px; border-radius: 50%; border: 2px solid rgba(201,168,76,0.5); object-fit: cover; }
.user-name { font-size: 16px; font-weight: 700; color: #e8c860; }
.user-time { font-size: 12px; color: #6a5828; margin-top: 3px; }
.section-title { width: calc(100% - 32px); font-size: 11px; color: #6a5828; letter-spacing: 3px; margin: 4px 16px 10px; }
.btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px; width: 100%; }
.clock-btn { background: #111428; border: 1px solid rgba(201,168,76,0.3); border-radius: 12px; padding: 24px 12px; display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
.clock-btn::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #c9a84c, transparent); }
.clock-btn:active { transform: scale(0.96); background: rgba(201,168,76,0.15); }
.clock-btn.disabled { opacity: 0.4; pointer-events: none; }
.btn-icon { font-size: 36px; }
.btn-label { font-size: 15px; font-weight: 700; color: #e8c860; letter-spacing: 2px; }
.btn-sub { font-size: 10px; color: #6a5828; letter-spacing: 1px; }
.result-screen { display: none; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; padding: 32px; text-align: center; width: 100%; }
.result-icon { font-size: 72px; margin-bottom: 20px; }
.result-title { font-size: 22px; font-weight: 700; color: #e8c860; letter-spacing: 3px; margin-bottom: 12px; }
.result-msg { font-size: 14px; color: #c8c0a8; line-height: 1.8; margin-bottom: 24px; white-space: pre-line; }
.back-btn { background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.4); border-radius: 8px; padding: 12px 32px; color: #e8c860; font-size: 13px; letter-spacing: 2px; cursor: pointer; }
.loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; color: #e8c860; font-size: 14px; letter-spacing: 2px; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(201,168,76,0.2); border-top-color: #c9a84c; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>
<div class="loading" id="loading"><div class="spinner"></div>載入中…</div>

<div id="main-content" style="display:none;width:100%;flex-direction:column;align-items:center">
  <div class="top-bar">
    <div class="gold-line"></div>
    <div class="brand">饗 鍋 物 料 理</div>
    <div class="brand-en">EMPLOYEE CLOCK-IN SYSTEM</div>
  </div>
  <div class="user-card">
    <img id="user-avatar" class="avatar" src="" alt="">
    <div>
      <div class="user-name" id="user-name">載入中…</div>
      <div class="user-time" id="current-time"></div>
    </div>
  </div>
  <div class="section-title">選擇打卡類型</div>
  <div class="btn-grid">
    <div class="clock-btn" id="btn-clockin" onclick="doClock('上班打卡')">
      <div class="btn-icon">☀️</div>
      <div class="btn-label">上班打卡</div>
      <div class="btn-sub">開始上班</div>
    </div>
    <div class="clock-btn" id="btn-clockout" onclick="doClock('下班打卡')">
      <div class="btn-icon">🌙</div>
      <div class="btn-label">下班打卡</div>
      <div class="btn-sub">結束上班</div>
    </div>
    <div class="clock-btn" id="btn-breakstart" onclick="doClock('休息開始')">
      <div class="btn-icon">☕</div>
      <div class="btn-label">休息開始</div>
      <div class="btn-sub">開始休息</div>
    </div>
    <div class="clock-btn" id="btn-breakend" onclick="doClock('休息結束')">
      <div class="btn-icon">💪</div>
      <div class="btn-label">休息結束</div>
      <div class="btn-sub">繼續上班</div>
    </div>
  </div>
</div>

<div class="result-screen" id="result-screen">
  <div class="result-icon" id="result-icon">✅</div>
  <div class="result-title" id="result-title">打卡成功</div>
  <div class="result-msg" id="result-msg"></div>
  <div class="back-btn" onclick="showMain()">返回選單</div>
</div>

<script>
const GAS_URL = '${GAS_URL}';
const LIFF_ID = '${LIFF_ID}';
let userId = '';
let userName = '';
let processing = false;

async function init() {
  try {
    await liff.init({ liffId: LIFF_ID });
    if (!liff.isLoggedIn()) { liff.login(); return; }
    const profile = await liff.getProfile();
    userId = profile.userId;
    userName = profile.displayName;
    document.getElementById('user-name').textContent = userName;
    document.getElementById('user-avatar').src = profile.pictureUrl || '';
    updateTime();
    setInterval(updateTime, 1000);
    document.getElementById('loading').style.display = 'none';
    document.getElementById('main-content').style.display = 'flex';
  } catch(e) {
    document.getElementById('loading').innerHTML = '載入失敗：' + e.message;
  }
}

function updateTime() {
  const now = new Date();
  const days = ['日','一','二','三','四','五','六'];
  document.getElementById('current-time').textContent =
    (now.getMonth()+1) + '/' + now.getDate() + ' 週' + days[now.getDay()] + '　' +
    String(now.getHours()).padStart(2,'0') + ':' +
    String(now.getMinutes()).padStart(2,'0') + ':' +
    String(now.getSeconds()).padStart(2,'0');
}

async function doClock(type) {
  if (processing) return;
  processing = true;

  // 顯示處理中
  document.querySelectorAll('.clock-btn').forEach(b => b.classList.add('disabled'));

  try {
    const payload = {
      action: 'clock',
      userId: userId,
      userName: userName,
      type: type,
      time: new Date().toISOString()
    };

    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const url = GAS_URL + '?liff=1&b64=' + encodeURIComponent(encoded);

    const res = await fetch(url, { cache: 'no-store' });
    const text = await res.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      data = { success: false, msg: '回應解析失敗' };
    }

    showResult(type, data);
  } catch(e) {
    showResult(type, { success: false, msg: '網路錯誤：' + e.message });
  }

  processing = false;
  document.querySelectorAll('.clock-btn').forEach(b => b.classList.remove('disabled'));
}

function showResult(type, data) {
  const isSuccess = data.success !== false;
  const icons = { '上班打卡':'✅', '下班打卡':'🔚', '休息開始':'☕', '休息結束':'💪' };
  document.getElementById('result-icon').textContent = isSuccess ? (icons[type]||'✅') : '⚠️';
  document.getElementById('result-title').textContent = isSuccess ? type + ' 成功' : '無法打卡';
  document.getElementById('result-msg').textContent = data.msg || '';
  document.getElementById('main-content').style.display = 'none';
  document.getElementById('result-screen').style.display = 'flex';
  if (isSuccess) {
    setTimeout(() => {
      if (liff.isInClient()) liff.closeWindow();
      else showMain();
    }, 2500);
  }
}

function showMain() {
  document.getElementById('result-screen').style.display = 'none';
  document.getElementById('main-content').style.display = 'flex';
}

init();
</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
};
