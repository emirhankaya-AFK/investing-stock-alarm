// Application State
let activeAlerts = [];
let triggeredHistory = [];
let trackedNewsSymbols = [];
let appSettings = {};
let selectedStock = null;
let searchTimeout = null;
let priceUpdateInterval = null;

// DOM Elements
const stockSearchInput = document.getElementById('stockSearchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const searchDropdown = document.getElementById('searchDropdown');
const stockPreviewCard = document.getElementById('stockPreviewCard');
const emptyStockState = document.getElementById('emptyStockState');

const previewSymbol = document.getElementById('previewSymbol');
const previewName = document.getElementById('previewName');
const previewExchange = document.getElementById('previewExchange');
const previewPrice = document.getElementById('previewPrice');
const previewCurrency = document.getElementById('previewCurrency');
const previewChangeBadge = document.getElementById('previewChangeBadge');
const previewChangePercent = document.getElementById('previewChangePercent');

const alarmForm = document.getElementById('alarmForm');
const alarmType = document.getElementById('alarmType');
const alarmValue = document.getElementById('alarmValue');
const alarmValueLabel = document.getElementById('alarmValueLabel');
const alarmDescription = document.getElementById('alarmDescription');

// Gelişmiş Aralık / Kanal ve Zincir Elemanları
const alarmValueMin = document.getElementById('alarmValueMin');
const alarmValueMax = document.getElementById('alarmValueMax');
const singleValueGroup = document.getElementById('singleValueGroup');
const rangeValueGroup = document.getElementById('rangeValueGroup');
const parentAlertSelect = document.getElementById('parentAlertSelect');

// ROI Portfolio and News feed Elements
const roiTrackingEnabled = document.getElementById('roiTrackingEnabled');
const roiFieldsGroup = document.getElementById('roiFieldsGroup');
const purchasePrice = document.getElementById('purchasePrice');
const purchaseQuantity = document.getElementById('purchaseQuantity');

const tabKAP = document.getElementById('tabKAP');
const tabNews = document.getElementById('tabNews');
const newsFeedContainer = document.getElementById('newsFeedContainer');
const activeNewsSymbol = document.getElementById('activeNewsSymbol');
const notificationTemplateSelect = document.getElementById('notificationTemplateSelect');

// AI News Symbols Tracking Elements
const newsSymbolsList = document.getElementById('newsSymbolsList');
const newsSymbolsCountTag = document.getElementById('newsSymbolsCountTag');
const addToNewsSymbolsBtn = document.getElementById('addToNewsSymbolsBtn');

// Veri Yönetimi & Yedekleme Elemanları
const exportExcelBtn = document.getElementById('exportExcelBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const restoreFileInput = document.getElementById('restoreFileInput');

const activeAlarmsList = document.getElementById('activeAlarmsList');
const activeAlarmsCount = document.getElementById('activeAlarmsCount');
const activeAlarmsCountTag = document.getElementById('activeAlarmsCountTag');
const historyList = document.getElementById('historyList');

const settingsModal = document.getElementById('settingsModal');
const openSettingsBtn = document.getElementById('openSettingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

const pollingIntervalSlider = document.getElementById('pollingIntervalSlider');
const intervalVal = document.getElementById('intervalVal');
const methodNtfyCard = document.getElementById('methodNtfyCard');
const methodTelegramCard = document.getElementById('methodTelegramCard');
const ntfyConfigPanel = document.getElementById('ntfyConfigPanel');
const telegramConfigPanel = document.getElementById('telegramConfigPanel');
const ntfyTopicInput = document.getElementById('ntfyTopicInput');
const randomizeTopicBtn = document.getElementById('randomizeTopicBtn');
const tgTokenInput = document.getElementById('tgTokenInput');
const tgChatIdInput = document.getElementById('tgChatIdInput');
const soundThemeSelect = document.getElementById('soundThemeSelect');
const testSoundBtn = document.getElementById('testSoundBtn');
const testNotificationBtn = document.getElementById('testNotificationBtn');
const mobileTopicCode = document.getElementById('mobileTopicCode');

// Yapay Zeka Haber Analiz Ayarları Elemanları
const newsAlertsEnabledToggle = document.getElementById('newsAlertsEnabledToggle');
const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
const geminiApiKeyGroup = document.getElementById('geminiApiKeyGroup');
const testNewsBtn = document.getElementById('testNewsBtn');

const toastAlert = document.getElementById('toastAlert');
const toastMessage = document.getElementById('toastMessage');

// Web Audio API Sound Synthesizer
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play Synthetic Alarm Sound Themes
function playAlarmSound(theme) {
  if (theme === 'none') return;
  
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    if (theme === 'digital-chime') {
      // Pleasant dual chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.type = 'sine';
      osc2.type = 'sine';
      
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc2.frequency.setValueAtTime(659.25, now + 0.12); // E5
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start(now);
      osc1.stop(now + 0.8);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.8);
    } 
    else if (theme === 'synthwave') {
      // Rising minor-7th spacey arpeggio
      const notes = [293.66, 349.23, 440.00, 523.25, 587.33]; // D4, F4, A4, C5, D5
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.1);
        
        gainNode.gain.setValueAtTime(0, now + index * 0.1);
        gainNode.gain.linearRampToValueAtTime(0.2, now + index * 0.1 + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.5);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(now + index * 0.1);
        osc.stop(now + index * 0.1 + 0.5);
      });
    } 
    else if (theme === 'ping') {
      // High pitch bubble ping
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.4, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.6);
    } 
    else if (theme === 'siren') {
      // High-priority emergency sweep
      const duration = 1.2;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sawtooth';
      
      // Sweep frequency up and down
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(850, now + 0.3);
      osc.frequency.linearRampToValueAtTime(450, now + 0.6);
      osc.frequency.linearRampToValueAtTime(850, now + 0.9);
      osc.frequency.linearRampToValueAtTime(450, now + 1.2);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + duration);
    }
  } catch (error) {
    console.error('Audio synthesis failed:', error);
  }
}

// Show Alert Toast
function showToast(message, isError = false) {
  toastMessage.textContent = message;
  toastAlert.style.backgroundColor = isError ? '#ef4444' : '#10b981';
  toastAlert.style.display = 'block';
  
  // Icon styling
  const icon = toastAlert.querySelector('.toast-icon');
  if (isError) {
    icon.className = 'fa-solid fa-circle-exclamation toast-icon';
  } else {
    icon.className = 'fa-solid fa-circle-check toast-icon';
  }

  setTimeout(() => {
    toastAlert.style.display = 'none';
  }, 3500);
}

// Format Numbers beautifully
function formatNum(val, dec = 2) {
  if (val === undefined || val === null) return '0.00';
  return parseFloat(val).toLocaleString('tr-TR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

// Generate Secure Random String for Topic
function generateRandomTopic() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let str = 'emirh-alarm-';
  for (let i = 0; i < 6; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}

// Init Function
async function init() {
  await loadSettings();
  await loadAlarms();
  await loadHistory();
  await loadNewsSymbols();
  await loadWatchlist();

  // Poll dashboard lists every 4 seconds to keep values fresh in UI
  setInterval(() => {
    loadAlarms();
    loadHistory();
    loadNewsSymbols();
    loadWatchlist();
  }, 4000);
}

// API: Load Tracked News Symbols List
async function loadNewsSymbols() {
  try {
    const res = await fetch('/api/news-symbols');
    const symbols = await res.json();
    trackedNewsSymbols = symbols;
    
    newsSymbolsCountTag.textContent = symbols.length;
    
    if (symbols.length === 0) {
      newsSymbolsList.innerHTML = `<p class="empty-text" style="font-size: 0.78rem; color: var(--text-muted); margin: 0; width: 100%;">Henüz takip listesine sembol eklenmedi. Arama yapıp listenize ekleyebilirsiniz.</p>`;
      return;
    }
    
    newsSymbolsList.innerHTML = '';
    symbols.forEach(sym => {
      const badge = document.createElement('div');
      badge.className = 'news-symbol-badge';
      badge.style.background = 'rgba(139, 92, 246, 0.08)';
      badge.style.border = '1px solid rgba(139, 92, 246, 0.25)';
      badge.style.borderRadius = '6px';
      badge.style.padding = '4px 10px';
      badge.style.display = 'flex';
      badge.style.alignItems = 'center';
      badge.style.gap = '8px';
      badge.style.fontSize = '0.78rem';
      badge.style.fontWeight = '600';
      badge.style.color = 'var(--color-secondary)';
      badge.style.transition = 'var(--transition-smooth)';
      
      // Add custom names for common metals and commodities if selected
      let displayName = sym;
      if (sym === 'GC=F') displayName = '🏆 ALTIN (Gold)';
      else if (sym === 'SI=F') displayName = '🥈 GÜMÜŞ (Silver)';
      else if (sym === 'HG=F') displayName = '🥉 BAKIR (Copper)';
      else if (sym === 'PL=F') displayName = '⚙️ PLATİN (Platinum)';
      else if (sym === 'CL=F') displayName = '🛢️ PETROL (Crude Oil)';
      
      badge.innerHTML = `
        <span>${displayName}</span>
        <i class="fa-solid fa-xmark" style="cursor: pointer; color: var(--text-muted); font-size: 0.8rem; padding: 2px;" onclick="deleteNewsSymbol('${sym}')" title="Haber takibini sonlandır"></i>
      `;
      
      newsSymbolsList.appendChild(badge);
    });
  } catch (error) {
    console.error('Failed to load news symbols:', error);
  }
}

// API: Delete Tracked News Symbol
async function deleteNewsSymbol(sym) {
  try {
    const res = await fetch(`/api/news-symbols/${encodeURIComponent(sym)}`, { method: 'DELETE' });
    if (res.ok) {
      showToast(`${sym} haber takibinden çıkarıldı.`);
      await loadNewsSymbols();
      if (selectedStock && selectedStock.symbol === sym) {
        renderSelectedStock();
      }
    }
  } catch (error) {
    console.error('Failed to delete news symbol:', error);
  }
}
window.deleteNewsSymbol = deleteNewsSymbol;

// API: Load Settings
async function loadSettings() {
  try {
    const res = await fetch('/api/settings');
    appSettings = await res.json();
    
    // Sync to DOM
    pollingIntervalSlider.value = appSettings.pollingInterval;
    intervalVal.textContent = `${appSettings.pollingInterval} Saniye`;
    
    ntfyTopicInput.value = appSettings.ntfyTopic || 'emirh-borsa-alarm';
    mobileTopicCode.textContent = appSettings.ntfyTopic || 'emirh-borsa-alarm';
    
    tgTokenInput.value = appSettings.telegramBotToken || '';
    tgChatIdInput.value = appSettings.telegramChatId || '';
    
    soundThemeSelect.value = appSettings.soundTheme || 'digital-chime';
    notificationTemplateSelect.value = appSettings.notificationTemplate || 'rich_ai';

    // AI & News alerts settings sync
    newsAlertsEnabledToggle.checked = appSettings.newsAlertsEnabled || false;
    geminiApiKeyInput.value = appSettings.geminiApiKey || '';
    
    if (newsAlertsEnabledToggle.checked) {
      geminiApiKeyGroup.style.display = 'block';
    } else {
      geminiApiKeyGroup.style.display = 'none';
    }

    // Set active cards
    if (appSettings.mobileMethod === 'telegram') {
      selectMethod('telegram');
    } else {
      selectMethod('ntfy');
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

// Handle notification method click
function selectMethod(method) {
  appSettings.mobileMethod = method;
  if (method === 'ntfy') {
    methodNtfyCard.classList.add('active');
    methodNtfyCard.querySelector('.radio-check i').className = 'fa-solid fa-circle-check';
    methodTelegramCard.classList.remove('active');
    methodTelegramCard.querySelector('.radio-check i').className = 'fa-regular fa-circle';
    
    ntfyConfigPanel.style.display = 'block';
    telegramConfigPanel.style.display = 'none';
    
    // Update setup guide tag
    document.querySelector('.tag-status').className = 'tag-status ntfy-tag';
    document.querySelector('.tag-status').textContent = 'ntfy.sh';
    document.getElementById('mobileTopicCode').textContent = ntfyTopicInput.value;
  } else {
    methodTelegramCard.classList.add('active');
    methodTelegramCard.querySelector('.radio-check i').className = 'fa-solid fa-circle-check';
    methodNtfyCard.classList.remove('active');
    methodNtfyCard.querySelector('.radio-check i').className = 'fa-regular fa-circle';
    
    telegramConfigPanel.style.display = 'block';
    ntfyConfigPanel.style.display = 'none';
    
    // Update setup guide tag for telegram
    document.querySelector('.tag-status').className = 'tag-status active-badge';
    document.querySelector('.tag-status').textContent = 'Telegram';
    document.getElementById('mobileTopicCode').textContent = '@BotFather & @userinfobot';
  }
}

// API: Load Alarms List
async function loadAlarms() {
  try {
    const res = await fetch('/api/alerts');
    const alerts = await res.json();
    
    // Store price differences and closeness
    const oldAlertsMap = {};
    activeAlerts.forEach(a => { oldAlertsMap[a.id] = a.triggered; });
    
    activeAlerts = alerts;
    renderAlarmsList();
    
    // Check if any alarm just got triggered in background
    alerts.forEach(alert => {
      // If it was not triggered before, but is triggered now
      if (oldAlertsMap[alert.id] === false && alert.triggered === true) {
        // Play browser chime
        playAlarmSound(appSettings.soundTheme);
        showToast(`🚨 ${alert.symbol} alarmı tetiklendi!`);
      }
    });
  } catch (error) {
    console.error('Failed to load alarms:', error);
  }
}

// API: Load History List
async function loadHistory() {
  try {
    const res = await fetch('/api/history');
    triggeredHistory = await res.json();
    renderHistoryList();
  } catch (error) {
    console.error('Failed to load history:', error);
  }
}

// Render Active Alarms in UI
function renderAlarmsList() {
  const activeAlarms = activeAlerts.filter(a => !a.triggered);
  
  // Update header counters
  activeAlarmsCount.textContent = `${activeAlarms.length} Alarm Aktif`;
  activeAlarmsCountTag.textContent = activeAlarms.length;
  
  if (activeAlarms.length === 0) {
    activeAlarmsList.innerHTML = `
      <div class="empty-list-state">
        <i class="fa-regular fa-bell-slash"></i>
        <p>Şu an kurulu aktif alarm bulunmamaktadır.</p>
      </div>
    `;
    return;
  }

  activeAlarmsList.innerHTML = '';
  
  activeAlarms.forEach(alert => {
    const card = document.createElement('div');
    card.className = `alarm-card ${alert.active ? '' : 'inactive'}`;
    card.id = `alarm-${alert.id}`;
    
    let conditionText = '';
    let conditionIcon = '';
    let targetPriceText = '';
    
    if (alert.type === 'above') {
      conditionText = `Fiyat >= ${formatNum(alert.targetValue)}`;
      conditionIcon = 'fa-solid fa-arrow-trend-up';
      targetPriceText = `Hedef: <strong class="current">${formatNum(alert.targetValue)}</strong>`;
    } else if (alert.type === 'below') {
      conditionText = `Fiyat <= ${formatNum(alert.targetValue)}`;
      conditionIcon = 'fa-solid fa-arrow-trend-down';
      targetPriceText = `Hedef: <strong class="current">${formatNum(alert.targetValue)}</strong>`;
    } else if (alert.type === 'percent_up') {
      conditionText = `Günlük >= %${formatNum(alert.targetValue)}`;
      conditionIcon = 'fa-solid fa-percent';
      targetPriceText = `Hedef: <strong class="current">%${formatNum(alert.targetValue)}</strong>`;
    } else if (alert.type === 'percent_down') {
      conditionText = `Günlük <= %${formatNum(alert.targetValue)}`;
      conditionIcon = 'fa-solid fa-percent';
      targetPriceText = `Hedef: <strong class="current">%${formatNum(alert.targetValue)}</strong>`;
    } else if (alert.type === 'range_inside') {
      conditionText = `Kanal İçi: [${formatNum(alert.targetValueMin)} - ${formatNum(alert.targetValueMax)}]`;
      conditionIcon = 'fa-solid fa-arrows-left-right-to-line';
      targetPriceText = `Kanal: <strong class="current">${formatNum(alert.targetValueMin)} - ${formatNum(alert.targetValueMax)}</strong>`;
    } else if (alert.type === 'range_outside') {
      conditionText = `Kanal Dışı: [${formatNum(alert.targetValueMin)} - ${formatNum(alert.targetValueMax)}]`;
      conditionIcon = 'fa-solid fa-arrows-left-right';
      targetPriceText = `Kanal: <strong class="current">${formatNum(alert.targetValueMin)} - ${formatNum(alert.targetValueMax)}</strong>`;
    }

    let sequentialBadge = '';
    if (alert.parentAlertId) {
      const parent = alerts.find(p => p.id === alert.parentAlertId);
      const parentName = parent ? parent.symbol : 'Önceki Aşama';
      sequentialBadge = `<span class="tag-status" style="background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.4); font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;" title="Bu alarm ${parentName} tetiklenene kadar kilitlidir."><i class="fa-solid fa-link"></i> ${parentName} Sonrası</span>`;
    }

    // Dynamic ROI Badge Calculation
    let roiBadge = '';
    if (alert.purchasePrice && alert.purchaseQuantity) {
      const currentVal = alert.currentPrice || (selectedStock && selectedStock.symbol === alert.symbol ? selectedStock.price : 0);
      if (currentVal) {
        const netProfit = (currentVal - alert.purchasePrice) * alert.purchaseQuantity;
        const roiPct = ((currentVal - alert.purchasePrice) / alert.purchasePrice) * 100;
        
        const isProfit = netProfit >= 0;
        const sign = isProfit ? '+' : '';
        const colorStyle = isProfit ? 'color: #10b981; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2);' : 'color: #ef4444; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2);';
        
        roiBadge = `
          <div class="alarm-roi-badge" style="display: flex; flex-direction: column; align-items: flex-end; padding: 4px 10px; border-radius: 8px; font-size: 0.72rem; text-align: right; min-width: 95px; font-weight: bold; ${colorStyle}" title="Maliyet: ${alert.purchasePrice} | Adet: ${alert.purchaseQuantity}">
            <span style="font-family: var(--font-display);">${sign}${formatNum(netProfit)}</span>
            <span style="font-size: 0.65rem; opacity: 0.95;">% ${sign}${formatNum(roiPct)} ROI</span>
          </div>
        `;
      } else {
        roiBadge = `
          <div class="alarm-roi-badge" style="display: flex; align-items: center; justify-content: center; padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; text-align: right; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); color: var(--text-muted); font-weight: 500;" title="Maliyet: ${alert.purchasePrice} | Adet: ${alert.purchaseQuantity}">
            Fiyat bekleniyor...
          </div>
        `;
      }
    }

    card.innerHTML = `
      <div class="alarm-card-header">
        <div class="alarm-card-ticker">
          <div style="display: flex; align-items: center; gap: 6px;">
            <h4>${alert.symbol}</h4>
            ${sequentialBadge}
          </div>
          <span>${alert.name}</span>
        </div>
        <div class="alarm-card-actions">
          <button class="action-btn btn-toggle-active ${alert.active ? 'active' : ''}" onclick="toggleAlarmActive('${alert.id}')" title="${alert.active ? 'Durdur' : 'Aktifleştir'}">
            <i class="fa-solid ${alert.active ? 'fa-pause' : 'fa-play'}"></i>
          </button>
          <button class="action-btn btn-delete-alarm" onclick="deleteAlarm('${alert.id}')" title="Sil">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
      
      <div class="alarm-card-meta" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div class="alarm-card-condition ${alert.type}">
            <i class="${conditionIcon}"></i> ${conditionText}
          </div>
          <div class="alarm-card-prices">
            <span>${targetPriceText}</span>
          </div>
        </div>
        ${roiBadge}
      </div>

      ${alert.description ? `<div class="alarm-card-note" style="border-left: 2px solid var(--color-accent); background: rgba(6, 182, 212, 0.04); font-size: 0.78rem; padding: 6px 10px; border-radius: 4px; font-style: italic; color: var(--text-secondary);" title="${alert.description}"><i class="fa-regular fa-message"></i> ${alert.description}</div>` : ''}
    `;
    
    activeAlarmsList.appendChild(card);
  });
}

// Render Trigger History
function renderHistoryList() {
  if (triggeredHistory.length === 0) {
    historyList.innerHTML = `
      <div class="empty-list-state">
        <i class="fa-solid fa-inbox"></i>
        <p>Henüz tetiklenen bir alarm bildirimi bulunmamaktadır.</p>
      </div>
    `;
    return;
  }

  historyList.innerHTML = '';
  
  triggeredHistory.forEach(item => {
    const time = new Date(item.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const date = new Date(item.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    
    const div = document.createElement('div');
    div.className = 'history-item';
    
    let typeLabel = '';
    if (item.type === 'above') typeLabel = 'Fiyat Üstü';
    else if (item.type === 'below') typeLabel = 'Fiyat Altı';
    else if (item.type === 'percent_up') typeLabel = 'Günlük Artış';
    else if (item.type === 'percent_down') typeLabel = 'Günlük Düşüş';

    div.innerHTML = `
      <div class="history-item-header">
        <div class="history-item-title">
          <strong>${item.symbol}</strong>
          <span class="tag">${typeLabel}</span>
        </div>
        <span class="history-item-time">${date}, ${time}</span>
      </div>
      <div class="history-item-msg">
        🎯 Hedef: <b>${formatNum(item.targetValue)}</b> | Tetiklenen: <b style="color:var(--color-danger)">${formatNum(item.triggerValue)} ${item.currency}</b>
      </div>
      ${item.description ? `<div class="history-item-note">📝 ${item.description}</div>` : ''}
    `;
    
    historyList.appendChild(div);
  });
}

// Toggle Alarm Active State
async function toggleAlarmActive(id) {
  try {
    const res = await fetch(`/api/alerts/${id}/toggle`, { method: 'PUT' });
    if (res.ok) {
      showToast('Alarm durumu güncellendi.');
      loadAlarms();
    }
  } catch (error) {
    console.error('Failed to toggle alarm:', error);
  }
}

// Delete Alarm
async function deleteAlarm(id) {
  try {
    const res = await fetch(`/api/alerts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Alarm başarıyla silindi.');
      loadAlarms();
    }
  } catch (error) {
    console.error('Failed to delete alarm:', error);
  }
}

// Event: Autocomplete Search Input
stockSearchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  
  if (query.length === 0) {
    clearSearchBtn.style.display = 'none';
    searchDropdown.style.display = 'none';
    return;
  }

  clearSearchBtn.style.display = 'block';

  // Debounce API calls (wait 250ms)
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      renderDropdown(data.quotes || []);
    } catch (err) {
      console.error('Failed to fetch search:', err);
    }
  }, 250);
});

// Render Search Autocomplete Dropdown
function renderDropdown(items) {
  if (items.length === 0) {
    searchDropdown.style.display = 'none';
    return;
  }

  searchDropdown.innerHTML = '';
  searchDropdown.style.display = 'block';

  items.slice(0, 7).forEach(item => {
    const div = document.createElement('div');
    div.className = 'search-dropdown-item';
    
    let exchange = item.exchange || 'BIST';
    if (item.symbol.endsWith('.IS')) exchange = 'BIST';
    
    div.innerHTML = `
      <div class="item-left">
        <span class="item-symbol">${item.symbol}</span>
        <span class="item-name" title="${item.name}">${item.name}</span>
      </div>
      <span class="item-exchange">${exchange}</span>
    `;

    div.addEventListener('click', () => {
      selectStockItem(item);
    });

    searchDropdown.appendChild(div);
  });
}

// Select stock and load its pricing detail
async function selectStockItem(item) {
  searchDropdown.style.display = 'none';
  stockSearchInput.value = item.symbol;
  
  try {
    showToast(`${item.symbol} verileri yükleniyor...`);
    const res = await fetch(`/api/price?symbol=${encodeURIComponent(item.symbol)}`);
    if (!res.ok) {
      showToast('Fiyat verisi çekilemedi. Tekrar deneyin.', true);
      return;
    }
    
    selectedStock = await res.json();
    renderSelectedStock();
    loadAINewsFeed(selectedStock.symbol); // Load AI KAP & News Feed!
  } catch (err) {
    console.error('Failed to load stock price:', err);
    showToast('Hisse yükleme hatası.', true);
  }
}

// Render selected stock preview card and open creator form
function renderSelectedStock() {
  if (!selectedStock) return;

  previewSymbol.textContent = selectedStock.symbol;
  previewName.textContent = selectedStock.longName;
  previewExchange.textContent = selectedStock.symbol.endsWith('.IS') ? 'BORSA ISTANBUL' : 'GLOBAL MARKET';
  previewPrice.textContent = formatNum(selectedStock.price);
  previewCurrency.textContent = selectedStock.currency;

  const pct = selectedStock.changePercent;
  previewChangePercent.textContent = `${pct >= 0 ? '+' : ''}${formatNum(pct)}%`;
  
  if (pct >= 0) {
    previewChangeBadge.className = 'percent-badge positive';
    previewChangeBadge.innerHTML = `<i class="fa-solid fa-caret-up"></i> <span>${formatNum(pct)}%</span>`;
  } else {
    previewChangeBadge.className = 'percent-badge negative';
    previewChangeBadge.innerHTML = `<i class="fa-solid fa-caret-down"></i> <span>${formatNum(pct)}%</span>`;
  }

  // Clear and populate parentAlertSelect with active non-triggered alarms of the same symbol
  parentAlertSelect.innerHTML = '<option value="">Ön Koşul Yok (Doğrudan takip başlasın)</option>';
  const activeSameSymbol = activeAlerts.filter(a => !a.triggered && a.active && a.symbol === selectedStock.symbol);
  activeSameSymbol.forEach(a => {
    let cond = '';
    if (a.type === 'above') cond = `>= ${formatNum(a.targetValue)}`;
    else if (a.type === 'below') cond = `<= ${formatNum(a.targetValue)}`;
    else if (a.type === 'percent_up') cond = `>= %${formatNum(a.targetValue)}`;
    else if (a.type === 'percent_down') cond = `<= %${formatNum(a.targetValue)}`;
    else if (a.type === 'range_inside') cond = `Kanal İçi [${formatNum(a.targetValueMin)} - ${formatNum(a.targetValueMax)}]`;
    else if (a.type === 'range_outside') cond = `Kanal Dışı [${formatNum(a.targetValueMin)} - ${formatNum(a.targetValueMax)}]`;

    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = `${a.symbol} (${cond}) ${a.description ? '- ' + a.description : ''}`;
    parentAlertSelect.appendChild(opt);
  });

  // Pre-fill target value with current price
  alarmValue.value = parseFloat(selectedStock.price.toFixed(2));
  alarmDescription.value = ''; // Reset note

  // Update labels dynamically
  updateAlarmFormLabels();

  // Toggle layout preview visibility
  emptyStockState.style.display = 'none';
  stockPreviewCard.style.display = 'block';

  // Update news list tracker button state
  if (trackedNewsSymbols.includes(selectedStock.symbol)) {
    addToNewsSymbolsBtn.innerHTML = '<i class="fa-solid fa-square-minus" style="font-size: 1.05rem;"></i> Bu Sembolü Haber Takip Listesinden Çıkar';
    addToNewsSymbolsBtn.style.background = 'rgba(239, 68, 68, 0.15)';
    addToNewsSymbolsBtn.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    addToNewsSymbolsBtn.style.color = '#ef4444';
  } else {
    addToNewsSymbolsBtn.innerHTML = '<i class="fa-solid fa-square-plus" style="font-size: 1.05rem;"></i> Bu Sembolü Haber Takip Listeme Ekle';
    addToNewsSymbolsBtn.style.background = 'rgba(139, 92, 246, 0.12)';
    addToNewsSymbolsBtn.style.borderColor = 'rgba(139, 92, 246, 0.25)';
    addToNewsSymbolsBtn.style.color = 'var(--color-secondary)';
  }

  // Set up live price update routine for preview card while open
  startPreviewLivePolling();
}

function updateAlarmFormLabels() {
  if (!selectedStock) return;
  const type = alarmType.value;
  
  if (type === 'range_inside' || type === 'range_outside') {
    rangeValueGroup.style.display = 'flex';
    singleValueGroup.style.display = 'none';
    
    alarmValueMin.value = parseFloat((selectedStock.price * 0.98).toFixed(2));
    alarmValueMax.value = parseFloat((selectedStock.price * 1.02).toFixed(2));
  } else {
    rangeValueGroup.style.display = 'none';
    singleValueGroup.style.display = 'flex';
    
    if (type.startsWith('percent')) {
      alarmValueLabel.innerHTML = 'Günlük Değişim Yüzdesi (%)';
      alarmValue.step = '0.05';
      alarmValue.value = parseFloat(selectedStock.changePercent.toFixed(2));
    } else {
      alarmValueLabel.innerHTML = `Hedef Fiyat (${selectedStock.currency})`;
      alarmValue.step = '0.01';
      alarmValue.value = parseFloat(selectedStock.price.toFixed(2));
    }
  }
}

alarmType.addEventListener('change', updateAlarmFormLabels);

// Live update selected stock price card with tick animation
function startPreviewLivePolling() {
  if (priceUpdateInterval) clearInterval(priceUpdateInterval);
  
  priceUpdateInterval = setInterval(async () => {
    if (!selectedStock) return;
    try {
      const res = await fetch(`/api/price?symbol=${encodeURIComponent(selectedStock.symbol)}`);
      if (!res.ok) return;

      const newData = await res.json();
      
      const priceEl = document.getElementById('previewPrice');
      const oldPrice = selectedStock.price;
      const newPrice = newData.price;

      // Update state
      selectedStock = newData;

      // Flash animation on change
      if (newPrice > oldPrice) {
        priceEl.className = 'price-val tick-up-flash';
      } else if (newPrice < oldPrice) {
        priceEl.className = 'price-val tick-down-flash';
      }
      
      // Update values
      previewPrice.textContent = formatNum(newPrice);
      const pct = newData.changePercent;
      previewChangePercent.textContent = `${pct >= 0 ? '+' : ''}${formatNum(pct)}%`;
      if (pct >= 0) {
        previewChangeBadge.className = 'percent-badge positive';
        previewChangeBadge.innerHTML = `<i class="fa-solid fa-caret-up"></i> <span>${formatNum(pct)}%</span>`;
      } else {
        previewChangeBadge.className = 'percent-badge negative';
        previewChangeBadge.innerHTML = `<i class="fa-solid fa-caret-down"></i> <span>${formatNum(pct)}%</span>`;
      }

      // Reset animation class after 1 second
      setTimeout(() => {
        priceEl.className = 'price-val';
      }, 1000);

    } catch (err) {
      console.error('Error polling active preview price:', err);
    }
  }, 6000);
}

// Create Alarm Form Submission
alarmForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!selectedStock) return;
  
  const type = alarmType.value;
  const note = alarmDescription.value.trim();
  const parentId = parentAlertSelect.value || null;
  
  let payload = {
    symbol: selectedStock.symbol,
    name: selectedStock.longName,
    type: type,
    description: note,
    parentAlertId: parentId
  };

  if (roiTrackingEnabled.checked) {
    const cost = parseFloat(purchasePrice.value);
    const qty = parseFloat(purchaseQuantity.value);
    
    if (isNaN(cost) || isNaN(qty)) {
      showToast('Lütfen geçerli bir alış maliyeti ve portföy adedi girin.', true);
      return;
    }
    payload.purchasePrice = cost;
    payload.purchaseQuantity = qty;
  }

  if (type === 'range_inside' || type === 'range_outside') {
    const minVal = parseFloat(alarmValueMin.value);
    const maxVal = parseFloat(alarmValueMax.value);
    
    if (isNaN(minVal) || isNaN(maxVal)) {
      showToast('Lütfen geçerli kanal sınırları (Min/Max) girin.', true);
      return;
    }
    if (minVal >= maxVal) {
      showToast('Kanal alt sınırı (Min), üst sınırdan (Max) küçük olmalıdır.', true);
      return;
    }
    
    payload.targetValueMin = minVal;
    payload.targetValueMax = maxVal;
  } else {
    const targetVal = parseFloat(alarmValue.value);
    if (isNaN(targetVal)) {
      showToast('Lütfen geçerli bir hedef değer girin.', true);
      return;
    }
    payload.targetValue = targetVal;
  }

  try {
    const response = await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      showToast('Mobil alarmınız başarıyla kuruldu!');
      loadAlarms();
      
      // Clear selection card
      selectedStock = null;
      if (priceUpdateInterval) clearInterval(priceUpdateInterval);
      stockPreviewCard.style.display = 'none';
      emptyStockState.style.display = 'block';
      stockSearchInput.value = '';
      clearSearchBtn.style.display = 'none';
      
      // Reset ROI Fields
      roiTrackingEnabled.checked = false;
      roiFieldsGroup.style.display = 'none';
      purchasePrice.value = '';
      purchaseQuantity.value = '';
    } else {
      showToast('Alarm ekleme başarısız.', true);
    }
  } catch (error) {
    console.error('Error creating alarm:', error);
    showToast('Alarm sunucuya iletilemedi.', true);
  }
});

// UI: Close Autocomplete dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!stockSearchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
    searchDropdown.style.display = 'none';
  }
});

clearSearchBtn.addEventListener('click', () => {
  stockSearchInput.value = '';
  clearSearchBtn.style.display = 'none';
  searchDropdown.style.display = 'none';
});

// MODAL CONTROLS
openSettingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
});

const closeModal = () => {
  settingsModal.style.display = 'none';
  loadSettings(); // Reset fields to active state
};

closeSettingsBtn.addEventListener('click', closeModal);
cancelSettingsBtn.addEventListener('click', closeModal);

// Radio cards toggles
methodNtfyCard.addEventListener('click', () => selectMethod('ntfy'));
methodTelegramCard.addEventListener('click', () => selectMethod('telegram'));

// Slider display
pollingIntervalSlider.addEventListener('input', (e) => {
  const val = e.target.value;
  if (val >= 60) {
    intervalVal.textContent = `${Math.floor(val / 60)} Dakika`;
  } else {
    intervalVal.textContent = `${val} Saniye`;
  }
});

// Randomize Topic Button
randomizeTopicBtn.addEventListener('click', () => {
  const rand = generateRandomTopic();
  ntfyTopicInput.value = rand;
  mobileTopicCode.textContent = rand;
});

// Sound Theme tester
testSoundBtn.addEventListener('click', () => {
  const theme = soundThemeSelect.value;
  if (theme === 'none') {
    showToast('Alarm sesi sessiz olarak ayarlı!', true);
    return;
  }
  playAlarmSound(theme);
  showToast(`Ses Teması Test Edildi: ${soundThemeSelect.options[soundThemeSelect.selectedIndex].text}`);
});

// Mobile Push Test Notification trigger
testNotificationBtn.addEventListener('click', async () => {
  showToast('Telefonunuza test bildirimi yola çıktı...');
  try {
    const res = await fetch('/api/test-notification', { method: 'POST' });
    if (res.ok) {
      showToast('Test bildirimi başarıyla gönderildi!');
    } else {
      showToast('Bildirim gönderilemedi. Ayarları kontrol edin.', true);
    }
  } catch (error) {
    console.error('Test notification failed:', error);
    showToast('Bağlantı hatası.', true);
  }
});

// Toggle selected stock in News Symbols Track List
addToNewsSymbolsBtn.addEventListener('click', async () => {
  if (!selectedStock) return;
  const sym = selectedStock.symbol;
  const isTracked = trackedNewsSymbols.includes(sym);
  
  try {
    if (isTracked) {
      // Remove it
      const res = await fetch(`/api/news-symbols/${encodeURIComponent(sym)}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`${sym} haber takip listesinden çıkarıldı.`);
        await loadNewsSymbols();
        renderSelectedStock();
      } else {
        showToast('Kaldırma başarısız oldu.', true);
      }
    } else {
      // Add it
      const res = await fetch('/api/news-symbols', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: sym })
      });
      if (res.ok) {
        showToast(`${sym} haber takip listesine başarıyla eklendi!`);
        await loadNewsSymbols();
        renderSelectedStock();
      } else {
        showToast('Ekleme başarısız oldu.', true);
      }
    }
  } catch (error) {
    console.error('Failed to toggle news symbol:', error);
    showToast('Bağlantı hatası.', true);
  }
});

// Yapay Zeka Haber Ayarları Toggle Görünürlüğü
newsAlertsEnabledToggle.addEventListener('change', (e) => {
  if (e.target.checked) {
    geminiApiKeyGroup.style.display = 'block';
  } else {
    geminiApiKeyGroup.style.display = 'none';
  }
});

// AI Haber Analiz Test Butonu
testNewsBtn.addEventListener('click', async () => {
  let sym = 'AAPL';
  if (selectedStock) {
    sym = selectedStock.symbol;
  } else if (activeAlerts.length > 0) {
    sym = activeAlerts[0].symbol;
  }
  
  showToast(`${sym} için AI haber analizi test ediliyor...`);
  try {
    const apiKey = geminiApiKeyInput.value.trim();
    if (!apiKey) {
      showToast('Lütfen test etmeden önce bir Gemini API Anahtarı girin.', true);
      return;
    }
    
    const res = await fetch(`/api/test-news-alert?symbol=${encodeURIComponent(sym)}`, {
      method: 'POST'
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        showToast('Haber başarıyla analiz edildi ve telefona gönderildi!');
        alert(`AI Test Başarılı!\nHaber: ${data.news.title}\n\nAI Özet ve Etki:\n${data.news.aiSummary}`);
      } else {
        showToast(data.message || 'Haber bulunamadı.', true);
      }
    } else {
      showToast('Test başarısız oldu.', true);
    }
  } catch (err) {
    console.error('Test news error:', err);
    showToast('AI Haber testi bağlantı hatası.', true);
  }
});

// Excel (CSV) Dışa Aktarma
exportExcelBtn.addEventListener('click', () => {
  if (activeAlerts.length === 0) {
    showToast('Aktarılacak alarm verisi bulunmamaktadır.', true);
    return;
  }
  let csvContent = '\uFEFF'; // UTF-8 BOM for Turkish characters in Excel
  csvContent += 'ID;Sembol;Hisse Adı;Alarm Tipi;Hedef Fiyat;Min Limit;Max Limit;Zincir Ön Koşulu;Açıklama;Durum;Tetiklendi Mi;Tetiklenme Zamanı\r\n';
  
  activeAlerts.forEach(a => {
    const row = [
      a.id,
      a.symbol,
      a.name,
      a.type,
      a.targetValue !== null ? a.targetValue : '',
      a.targetValueMin !== null ? a.targetValueMin : '',
      a.targetValueMax !== null ? a.targetValueMax : '',
      a.parentAlertId || '',
      a.description || '',
      a.active ? 'Aktif' : 'Pasif',
      a.triggered ? 'Evet' : 'Hayır',
      a.triggeredAt || ''
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(';');
    csvContent += row + '\r\n';
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `borsa-alarmlar-${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Excel (CSV) yedek dosyası indirildi!');
});

// JSON Veritabanı Yedeği İndirme
exportJsonBtn.addEventListener('click', async () => {
  try {
    const res = await fetch('/api/backup');
    if (!res.ok) throw new Error('Backup fetch failed');
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `borsa-alarm-yedek-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('JSON yedek dosyası indirildi!');
  } catch (error) {
    console.error('JSON export error:', error);
    showToast('Yedek alma başarısız.', true);
  }
});

// JSON Veritabanı Geri Yükleme (Upload)
restoreFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      const backupData = JSON.parse(evt.target.result);
      if (!backupData.alerts || !backupData.settings) {
        showToast('Geçersiz yedekleme dosyası formatı.', true);
        return;
      }
      
      if (!confirm('Yedek yüklendiğinde mevcut tüm alarmlarınız ve ayarlarınız yedeğe göre güncellenecektir. Devam etmek istiyor musunuz?')) {
        restoreFileInput.value = '';
        return;
      }
      
      const res = await fetch('/api/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backupData)
      });
      
      if (res.ok) {
        showToast('Yedek başarıyla geri yüklendi!');
        await init(); // Yeniden başlat
      } else {
        showToast('Yedek yükleme başarısız oldu.', true);
      }
    } catch (error) {
      console.error('JSON restore error:', error);
      showToast('Dosya okuma veya JSON ayrıştırma hatası.', true);
    }
    restoreFileInput.value = '';
  };
  reader.readAsText(file);
});

// Save Settings Button
saveSettingsBtn.addEventListener('click', async () => {
  const body = {
    pollingInterval: parseInt(pollingIntervalSlider.value),
    mobileMethod: appSettings.mobileMethod,
    ntfyTopic: ntfyTopicInput.value.trim(),
    telegramBotToken: tgTokenInput.value.trim(),
    telegramChatId: tgChatIdInput.value.trim(),
    soundTheme: soundThemeSelect.value,
    newsAlertsEnabled: newsAlertsEnabledToggle.checked,
    geminiApiKey: geminiApiKeyInput.value.trim(),
    notificationTemplate: notificationTemplateSelect.value
  };

  if (body.mobileMethod === 'ntfy' && !body.ntfyTopic) {
    showToast('Lütfen geçerli bir ntfy kanalı (Topic) adı yazın.', true);
    return;
  }

  if (body.mobileMethod === 'telegram' && (!body.telegramBotToken || !body.telegramChatId)) {
    showToast('Lütfen Telegram Bot Token ve Chat ID alanlarını doldurun.', true);
    return;
  }

  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (res.ok) {
      showToast('Tüm ayarlar başarıyla kaydedildi!');
      settingsModal.style.display = 'none';
      await loadSettings();
    } else {
      showToast('Ayarlar kaydedilemedi.', true);
    }
  } catch (err) {
    console.error('Save settings error:', err);
    showToast('Ayar kaydetme hatası.', true);
  }
});

// Clear History Button
document.getElementById('clearHistoryBtn').addEventListener('click', async () => {
  if (!confirm('Tüm bildirim geçmişini temizlemek istediğinize emin misiniz?')) return;
  try {
    const res = await fetch('/api/history', { method: 'DELETE' });
    if (res.ok) {
      showToast('Bildirim geçmişi sıfırlandı.');
      loadHistory();
    }
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
});

// ROI Fields Görünürlük Tetikleyici
roiTrackingEnabled.addEventListener('change', (e) => {
  if (e.target.checked) {
    roiFieldsGroup.style.display = 'flex';
    // Otomatik maliyeti hissenin güncel fiyatına eşitle
    if (selectedStock) {
      purchasePrice.value = parseFloat(selectedStock.price.toFixed(2));
      purchaseQuantity.value = '100'; // Varsayılan adet
    }
  } else {
    roiFieldsGroup.style.display = 'none';
    purchasePrice.value = '';
    purchaseQuantity.value = '';
  }
});

// Sekmeli KAP & Genel Haber İstasyonu logic'i
let currentNewsData = { kap: [], news: [] };
let activeNewsTab = 'kap'; // 'kap' or 'news'

async function loadAINewsFeed(symbol) {
  if (!symbol) return;
  activeNewsSymbol.textContent = symbol;
  newsFeedContainer.innerHTML = `
    <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
      <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 24px; margin-bottom: 12px; color: var(--color-secondary);"></i>
      <p style="font-size: 0.82rem; font-weight: 500;">Gemini AI hisse haberlerini ve KAP akışını analiz ediyor...</p>
    </div>
  `;

  try {
    const res = await fetch(`/api/news-feed?symbol=${encodeURIComponent(symbol)}`);
    if (!res.ok) throw new Error('Failed to load feed');
    currentNewsData = await res.json();
    renderNewsFeed();
  } catch (err) {
    console.error('Error loading news feed:', err);
    newsFeedContainer.innerHTML = `
      <div class="empty-list-state">
        <i class="fa-solid fa-triangle-exclamation" style="color:var(--color-danger)"></i>
        <p>Haber akışı sunucudan çekilemedi.</p>
      </div>
    `;
  }
}

function renderNewsFeed() {
  const feed = activeNewsTab === 'kap' ? currentNewsData.kap : currentNewsData.news;
  
  if (!feed || feed.length === 0) {
    newsFeedContainer.innerHTML = `
      <div class="empty-list-state">
        <i class="fa-solid fa-inbox"></i>
        <p>Hisseye ait güncel ${activeNewsTab === 'kap' ? 'KAP açıklaması' : 'genel haber'} bulunamadı.</p>
      </div>
    `;
    return;
  }

  newsFeedContainer.innerHTML = '';
  
  feed.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.style.background = 'rgba(255, 255, 255, 0.015)';
    card.style.border = '1px solid var(--border-color)';
    card.style.borderRadius = '10px';
    card.style.padding = '12px';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.gap = '8px';
    card.style.transition = 'var(--transition-smooth)';
    
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
        <h5 style="font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; color: #fff; line-height: 1.4; margin: 0;">${item.title}</h5>
        <span style="font-size: 0.65rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.04); color: var(--text-secondary); white-space: nowrap;">
          ${activeNewsTab === 'kap' ? '📢 KAP' : '📰 HABER'}
        </span>
      </div>
      ${item.description ? `<p style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.45; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${item.description}">${item.description}</p>` : ''}
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; gap: 8px;">
        <a href="${item.link}" target="_blank" style="font-size: 0.72rem; color: var(--color-primary); text-decoration: underline; font-weight: 600;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Habere Git</a>
        <button type="button" class="btn btn-secondary summarize-news-btn" style="padding: 4px 8px; font-size: 0.7rem; font-weight: bold;" data-index="${index}">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Yapay Zeka Özeti
        </button>
      </div>
      <div class="ai-summary-box" id="ai-summary-${activeNewsTab}-${index}" style="display: none; background: rgba(139, 92, 246, 0.06); border-left: 2px solid var(--color-secondary); padding: 8px 10px; border-radius: 6px; font-size: 0.78rem; color: var(--text-primary); line-height: 1.45; margin-top: 6px;">
      </div>
    `;

    const summarizeBtn = card.querySelector('.summarize-news-btn');
    summarizeBtn.addEventListener('click', async () => {
      const summaryBox = card.querySelector(`#ai-summary-${activeNewsTab}-${index}`);
      
      if (summaryBox.style.display === 'block') {
        summaryBox.style.display = 'none';
        summarizeBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Yapay Zeka Özeti';
        return;
      }

      summarizeBtn.disabled = true;
      summarizeBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Çözümleniyor...';
      summaryBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 6px; color: var(--text-muted);">
          <i class="fa-solid fa-circle-notch fa-spin"></i>
          <span>Gemini AI rapor çıkartıyor...</span>
        </div>
      `;
      summaryBox.style.display = 'block';

      try {
        const res = await fetch('/api/news-feed/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: item.title,
            description: item.description,
            symbol: currentNewsData.symbol
          })
        });

        if (!res.ok) throw new Error('AI summary failed');
        const data = await res.json();
        
        if (data.success) {
          let outputText = data.summary;
          let sentimentLabel = 'Nötr';
          let sentimentStyle = 'color: #94a3b8; background: rgba(148, 163, 184, 0.1); border: 1px solid rgba(148, 163, 184, 0.2);';
          
          if (outputText.toLowerCase().includes('olumlu')) {
            sentimentLabel = 'Olumlu';
            sentimentStyle = 'color: #10b981; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);';
          } else if (outputText.toLowerCase().includes('olumsuz')) {
            sentimentLabel = 'Olumsuz';
            sentimentStyle = 'color: #ef4444; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);';
          }
          
          outputText = outputText
            .replace(/Özet:/gi, '<strong>🤖 Rapor:</strong>')
            .replace(/Etki:/gi, '<br>📈 <strong>Duygu Analizi:</strong>');

          summaryBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 0.72rem; letter-spacing: 0.5px; color: var(--color-secondary);"><i class="fa-solid fa-chart-pie"></i> ANALİZ BİLGİSİ</span>
              <span style="font-size: 0.65rem; font-weight: bold; padding: 2px 6px; border-radius: 4px; ${sentimentStyle}">${sentimentLabel}</span>
            </div>
            <p style="margin: 0; line-height: 1.5;">${outputText}</p>
          `;
          summarizeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Rapor Hazır';
        } else {
          summaryBox.innerHTML = `
            <div style="color: var(--color-danger); display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-circle-exclamation"></i>
              <span>${data.message}</span>
            </div>
          `;
          summarizeBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Yapay Zeka Özeti';
          summarizeBtn.disabled = false;
        }
      } catch (err) {
        console.error('AI summary err:', err);
        summaryBox.innerHTML = `
          <div style="color: var(--color-danger); display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>Yapay zeka analiz bağlantı hatası.</span>
          </div>
        `;
        summarizeBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Yapay Zeka Özeti';
        summarizeBtn.disabled = false;
      }
    });

    newsFeedContainer.appendChild(card);
  });
}

// Tab Events
tabKAP.addEventListener('click', () => {
  tabKAP.classList.add('active');
  tabNews.classList.remove('active');
  activeNewsTab = 'kap';
  renderNewsFeed();
});

tabNews.addEventListener('click', () => {
  tabNews.classList.add('active');
  tabKAP.classList.remove('active');
  activeNewsTab = 'news';
  renderNewsFeed();
});

// Watchlist DOM Elements and Event Bindings
let watchlistData = [];

async function loadWatchlist() {
  try {
    const res = await fetch('/api/watchlist');
    if (!res.ok) throw new Error('Failed to load watchlist');
    watchlistData = await res.json();
    renderWatchlist();
  } catch (error) {
    console.error('Failed to load watchlist:', error);
  }
}

function renderWatchlist() {
  const wlList = document.getElementById('watchlistList');
  const countTag = document.getElementById('watchlistCountTag');
  const searchInput = document.getElementById('watchlistSearchInput');
  const analystFilter = document.getElementById('analystFilterSelect');
  
  if (!wlList) return;
  
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const analyst = analystFilter ? analystFilter.value : '';
  
  // Filter watchlistData
  const filtered = watchlistData.filter(item => {
    const nameMatch = item.name && item.name.toLowerCase().includes(query);
    const tickerMatch = item.ticker && item.ticker.toLowerCase().includes(query);
    const noteMatch = item.notes && item.notes.toLowerCase().includes(query);
    const matchesSearch = !query || nameMatch || tickerMatch || noteMatch;
    
    let matchesAnalyst = true;
    if (analyst) {
      if (analyst === 'Oğuz') {
        matchesAnalyst = item.notes && item.notes.includes('[Oğuz Analizi]');
      } else if (analyst === 'Ahmet Mergen') {
        matchesAnalyst = item.notes && item.notes.includes('[Ahmet Mergen Analizi]');
      } else if (analyst === 'Jeremy') {
        matchesAnalyst = item.notes && item.notes.includes('[Jeremy Analizi]');
      } else if (analyst === 'Selçuk Gönençler') {
        matchesAnalyst = item.notes && item.notes.includes('[Selçuk Gönençler Analizi]');
      }
    }
    
    return matchesSearch && matchesAnalyst;
  });
  
  countTag.textContent = filtered.length;
  
  if (filtered.length === 0) {
    wlList.innerHTML = `
      <div class="empty-list-state">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p>Arama kriterlerinize uygun hisse bulunamadı.</p>
      </div>
    `;
    return;
  }
  
  wlList.innerHTML = '';
  
  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'watchlist-item-card';
    card.style.background = 'rgba(255, 255, 255, 0.015)';
    card.style.border = '1px solid var(--border-color)';
    card.style.borderRadius = '10px';
    card.style.padding = '12px';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.gap = '8px';
    card.style.transition = 'var(--transition-smooth)';
    
    // Determine analyst label
    let analystLabel = '';
    let analystStyle = '';
    if (item.notes && item.notes.includes('[Ahmet Mergen Analizi]')) {
      analystLabel = 'Ahmet Mergen';
      analystStyle = 'background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.25);';
    } else if (item.notes && item.notes.includes('[Oğuz Analizi]')) {
      analystLabel = 'Oğuz';
      analystStyle = 'background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.25);';
    } else if (item.notes && item.notes.includes('[Jeremy Analizi]')) {
      analystLabel = 'Jeremy';
      analystStyle = 'background: rgba(139, 92, 246, 0.15); color: #a78bfa; border: 1px solid rgba(139, 92, 246, 0.25);';
    } else if (item.notes && item.notes.includes('[Selçuk Gönençler Analizi]')) {
      analystLabel = 'Selçuk G.';
      analystStyle = 'background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.25);';
    }
    
    const formattedPrice = item.currentPrice ? formatNum(item.currentPrice) : 'Yükleniyor...';
    const currency = item.yahoo_symbol && !item.yahoo_symbol.endsWith('.IS') ? 'USD' : 'TL';
    
    const noteText = item.notes ? item.notes.replace(/\[.*?\]\s*/, '') : 'Analiz notu yok.';
    
    let supportText = item.support ? `📉 Destek: ${formatNum(item.support)}` : '';
    let resistanceText = item.resistance ? `📈 Direnç: ${formatNum(item.resistance)}` : '';
    let targetText = item.profit_target_pct ? `🎯 Hedef: %${item.profit_target_pct}` : '';
    let costText = item.entry_cost ? `💵 Alış: ${formatNum(item.entry_cost)}` : '';
    
    let techRow = [costText, supportText, resistanceText, targetText].filter(t => t !== '').join(' | ');
    
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-family: var(--font-display); font-weight: 700; font-size: 0.9rem; color: #fff;">${item.ticker}</span>
          <span style="font-size: 0.65rem; font-weight: bold; padding: 2px 6px; border-radius: 4px; ${analystStyle}">${analystLabel}</span>
        </div>
        <div style="text-align: right;">
          <span style="font-family: var(--font-display); font-weight: 700; font-size: 0.9rem; color: var(--color-primary);">${formattedPrice} ${currency}</span>
        </div>
      </div>
      <p style="font-size: 0.76rem; color: var(--text-secondary); line-height: 1.4; margin: 0;">${item.name || item.ticker}</p>
      ${techRow ? `<div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600; background: rgba(0,0,0,0.15); padding: 4px 8px; border-radius: 6px; width: fit-content;">${techRow}</div>` : ''}
      <p style="font-size: 0.76rem; color: var(--text-secondary); font-style: italic; line-height: 1.4; margin: 0; padding-top: 2px; border-top: 1px dashed rgba(255,255,255,0.05);">💬 ${noteText}</p>
      <button type="button" class="btn btn-secondary btn-full" style="padding: 6px; font-size: 0.74rem; font-weight: bold; margin-top: 4px; display: flex; align-items: center; justify-content: center; gap: 6px;" onclick="selectWatchlistItem('${item.ticker}', '${item.yahoo_symbol || ''}')">
        <i class="fa-solid fa-bell"></i> Bu Hisseye Alarm Kur
      </button>
    `;
    
    wlList.appendChild(card);
  });
}

async function selectWatchlistItem(ticker, yahooSymbol) {
  const symbol = yahooSymbol || (ticker + (yahooSymbol ? '' : '.IS'));
  showToast(`${symbol} seçiliyor...`);
  try {
    const res = await fetch(`/api/price?symbol=${encodeURIComponent(symbol)}`);
    if (!res.ok) throw new Error('Failed to load price');
    selectedStock = await res.json();
    renderSelectedStock();
    loadAINewsFeed(selectedStock.symbol);
    
    // Smooth scroll to search input
    document.getElementById('stockSearchInput').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Failed to select watchlist item:', error);
    showToast('Hisse seçilemedi.', true);
  }
}

window.selectWatchlistItem = selectWatchlistItem;

const watchlistSearchInput = document.getElementById('watchlistSearchInput');
const analystFilterSelect = document.getElementById('analystFilterSelect');

if (watchlistSearchInput) {
  watchlistSearchInput.addEventListener('keyup', renderWatchlist);
}
if (analystFilterSelect) {
  analystFilterSelect.addEventListener('change', renderWatchlist);
}

// Trigger Initialization
window.addEventListener('DOMContentLoaded', async () => {
  await init();
  
  // İlk yüklemede aktif alarm varsa ilk alarmın haberlerini göster
  setTimeout(() => {
    if (activeAlerts.length > 0 && !selectedStock) {
      loadAINewsFeed(activeAlerts[0].symbol);
    }
  }, 1000);
});
