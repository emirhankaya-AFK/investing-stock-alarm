const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Global high-priority stocks directory (Turkey, US, Germany)
const GLOBAL_STOCKS_DATABASE = [
  // --- TURKEY (Borsa Istanbul - BIST) ---
  { symbol: 'THYAO.IS', name: 'Türk Hava Yolları A.O.', exchange: 'BIST' },
  { symbol: 'ASELS.IS', name: 'Aselsan Elektronik Sanayi ve Ticaret A.Ş.', exchange: 'BIST' },
  { symbol: 'EREGL.IS', name: 'Ereğli Demir ve Çelik Fabrikaları T.A.Ş.', exchange: 'BIST' },
  { symbol: 'TUPRS.IS', name: 'Tüpraş Türkiye Petrol Rafinerileri A.Ş.', exchange: 'BIST' },
  { symbol: 'SISE.IS', name: 'Türkiye Şişe ve Cam Fabrikaları A.Ş.', exchange: 'BIST' },
  { symbol: 'GARAN.IS', name: 'Türkiye Garanti Bankası A.Ş.', exchange: 'BIST' },
  { symbol: 'AKBNK.IS', name: 'Akbank T.A.Ş.', exchange: 'BIST' },
  { symbol: 'YKBNK.IS', name: 'Yapı ve Kredi Bankası A.Ş.', exchange: 'BIST' },
  { symbol: 'ISCTR.IS', name: 'Türkiye İş Bankası A.Ş. (C)', exchange: 'BIST' },
  { symbol: 'SAHOL.IS', name: 'Hacı Ömer Sabancı Holding A.Ş.', exchange: 'BIST' },
  { symbol: 'KCHOL.IS', name: 'Koç Holding A.Ş.', exchange: 'BIST' },
  { symbol: 'BIMAS.IS', name: 'BİM Birleşik Mağazalar A.Ş.', exchange: 'BIST' },
  { symbol: 'SASA.IS', name: 'Sasa Polyester Sanayi A.Ş.', exchange: 'BIST' },
  { symbol: 'HEKTS.IS', name: 'Hektaş Ticaret T.A.Ş.', exchange: 'BIST' },
  { symbol: 'PETKM.IS', name: 'Petkim Petrokimya Holding A.Ş.', exchange: 'BIST' },
  { symbol: 'PGSUS.IS', name: 'Pegasus Hava Taşımacılığı A.Ş.', exchange: 'BIST' },
  { symbol: 'TOASO.IS', name: 'Tofaş Türk Otomobil Fabrikası A.Ş.', exchange: 'BIST' },
  { symbol: 'FROTO.IS', name: 'Ford Otomotiv Sanayi A.Ş.', exchange: 'BIST' },
  { symbol: 'ARCLK.IS', name: 'Arçelik A.Ş.', exchange: 'BIST' },
  { symbol: 'VESTL.IS', name: 'Vestel Elektronik Sanayi ve Ticaret A.Ş.', exchange: 'BIST' },
  { symbol: 'VESBE.IS', name: 'Vestel Beyaz Eşya Sanayi ve Ticaret A.Ş.', exchange: 'BIST' },
  { symbol: 'TCELL.IS', name: 'Turkcell İletişim Hizmetleri A.Ş.', exchange: 'BIST' },
  { symbol: 'TTKOM.IS', name: 'Türk Telekomünikasyon A.Ş.', exchange: 'BIST' },
  { symbol: 'XU100.IS', name: 'BIST 100 Endeksi', exchange: 'BIST' },
  { symbol: 'KOZAL.IS', name: 'Koza Altın İşletmeleri A.Ş.', exchange: 'BIST' },
  { symbol: 'ALARK.IS', name: 'Alarko Holding A.Ş.', exchange: 'BIST' },
  { symbol: 'TAVHL.IS', name: 'TAV Havalimanları Holding A.Ş.', exchange: 'BIST' },
  { symbol: 'MGROS.IS', name: 'Migros Ticaret A.Ş.', exchange: 'BIST' },
  { symbol: 'SOKM.IS', name: 'Şok Marketler Ticaret A.Ş.', exchange: 'BIST' },

  // --- UNITED STATES (NASDAQ / NYSE) ---
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc. (Class A)', exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ' },
  { symbol: 'NFLX', name: 'Netflix Inc.', exchange: 'NASDAQ' },
  { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', exchange: 'NASDAQ' },
  { symbol: 'INTC', name: 'Intel Corporation', exchange: 'NASDAQ' },
  { symbol: 'COIN', name: 'Coinbase Global Inc.', exchange: 'NASDAQ' },
  { symbol: 'BABA', name: 'Alibaba Group Holding Ltd.', exchange: 'NYSE' },

  // --- GERMANY (XETRA / Frankfurt) ---
  { symbol: 'SAP.DE', name: 'SAP SE', exchange: 'XETRA' },
  { symbol: 'SIE.DE', name: 'Siemens AG', exchange: 'XETRA' },
  { symbol: 'ALV.DE', name: 'Allianz SE', exchange: 'XETRA' },
  { symbol: 'DTE.DE', name: 'Deutsche Telekom AG', exchange: 'XETRA' },
  { symbol: 'MBG.DE', name: 'Mercedes-Benz Group AG', exchange: 'XETRA' },
  { symbol: 'BMW.DE', name: 'Bayerische Motoren Werke AG (BMW)', exchange: 'XETRA' },
  { symbol: 'VOW3.DE', name: 'Volkswagen AG (Preferred)', exchange: 'XETRA' },
  { symbol: 'BAS.DE', name: 'BASF SE', exchange: 'XETRA' },
  { symbol: 'BAYN.DE', name: 'Bayer AG', exchange: 'XETRA' },
  { symbol: 'DBK.DE', name: 'Deutsche Bank AG', exchange: 'XETRA' },
  { symbol: 'P911.DE', name: 'Porsche AG', exchange: 'XETRA' },
  { symbol: 'DHL.DE', name: 'DHL Group', exchange: 'XETRA' }
];

// In-Memory cache to serve client requests lightning fast
let dbInMemory = null;

// Asynchronous DB Loader supporting JSONBin.io or local fallback
async function loadDB() {
  const binId = process.env.JSONBIN_BIN_ID;
  const apiKey = process.env.JSONBIN_API_KEY;

  if (binId && apiKey) {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}?meta=false`, {
        headers: { 
          'X-Master-Key': apiKey,
          'Cache-Control': 'no-cache'
        }
      });
      if (res.ok) {
        dbInMemory = await res.json();
        return dbInMemory;
      }
      console.error('[DB] JSONBin.io fetch error, falling back to cache:', res.statusText);
    } catch (err) {
      console.error('[DB] Network error fetching JSONBin.io, falling back to cache:', err);
    }
  }

  // Use memory cache if loaded
  if (dbInMemory && !(binId && apiKey)) {
    return dbInMemory;
  }

  // Local fallback
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    dbInMemory = JSON.parse(data);
  } catch (error) {
    console.log('[DB] Local database file not found, creating default...');
    dbInMemory = {
      alerts: [],
      history: [],
      settings: {
        pollingInterval: 5,
        mobileMethod: 'ntfy',
        ntfyTopic: 'emirh-borsa-alarm',
        telegramBotToken: '',
        telegramChatId: '',
        soundEnabled: true,
        soundTheme: 'digital-chime'
      }
    };
    writeLocalDB(dbInMemory);
  }
  if (dbInMemory && !dbInMemory.newsSymbols) {
    dbInMemory.newsSymbols = [];
  }
  return dbInMemory;
}

// Asynchronous DB Writer supporting JSONBin.io and local database mirror
async function saveDB(data) {
  dbInMemory = data;
  const binId = process.env.JSONBIN_BIN_ID;
  const apiKey = process.env.JSONBIN_API_KEY;

  if (binId && apiKey) {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': apiKey
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        console.log('[DB] Database synchronized with JSONBin.io cloud successfully.');
        return;
      }
      console.error('[DB] Failed to sync database with JSONBin.io:', res.statusText);
    } catch (err) {
      console.error('[DB] Network error syncing JSONBin.io:', err);
    }
  }

  // Always write local mirror as a secondary backup
  writeLocalDB(data);
}

function writeLocalDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('[DB] Error writing local DB mirror:', error);
  }
}

// Send Mobile Notification
async function sendMobileNotification(title, message, description, symbol, clickUrl) {
  const db = await loadDB();
  const { mobileMethod, ntfyTopic, telegramBotToken, telegramChatId } = db.settings;

  let fullMessage = `${message}\n\n📝 Açıklama: ${description || 'Açıklama belirtilmedi.'}`;
  if (clickUrl) {
    fullMessage += `\n\n🔗 Haberin Kaynağı: ${clickUrl}`;
  }

  if (mobileMethod === 'ntfy' && ntfyTopic) {
    try {
      // Node-fetch validation fix: Strip any non-ASCII emojis or characters from the Title header.
      const safeTitle = title.replace(/[^\x00-\x7F]/g, '').trim() || 'Borsa Alarm';

      const headers = {
        'Title': safeTitle,
        'Priority': 'high',
        'Tags': 'chart_increasing,bell,moneybag',
        'X-Title-Encoding': 'utf-8',
        'X-Message-Encoding': 'utf-8'
      };

      if (clickUrl) {
        headers['Click'] = clickUrl;
      }

      const response = await fetch(`https://ntfy.sh/${ntfyTopic}`, {
        method: 'POST',
        headers: headers,
        body: fullMessage
      });
      if (response.ok) {
        console.log(`[ntfy] Notification sent successfully to topic: ${ntfyTopic}`);
      } else {
        console.error(`[ntfy] Failed to send notification: ${response.statusText}`);
      }
    } catch (error) {
      console.error('[ntfy] Error sending notification:', error);
    }
  } else if (mobileMethod === 'telegram' && telegramBotToken && telegramChatId) {
    try {
      const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
      let htmlText = `<b>🔔 HISSE ALARMI: ${symbol}</b>\n\n📈 <b>Durum:</b> ${message}\n\n📝 <b>Açıklama:</b> <i>${description || 'Belirtilmedi.'}</i>\n\n⏰ <b>Zaman:</b> ${new Date().toLocaleTimeString('tr-TR')} ${new Date().toLocaleDateString('tr-TR')}`;
      
      if (clickUrl) {
        htmlText += `\n\n🔗 <a href="${clickUrl}">Haberin Kaynağına Git</a>`;
      }
      
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: htmlText,
          parse_mode: 'HTML'
        })
      });
      
      const resData = await response.json();
      if (resData.ok) {
        console.log('[Telegram] Notification sent successfully.');
      } else {
        console.error('[Telegram] Failed to send notification:', resData.description);
      }
    } catch (error) {
      console.error('[Telegram] Error sending notification:', error);
    }
  }
}

// Fetch Stock Price from Yahoo Finance
async function fetchYahooPrice(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const prevClose = meta.previousClose || price;
    const change = price - prevClose;
    const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;

    return {
      symbol: meta.symbol,
      price: price,
      previousClose: prevClose,
      change: change,
      changePercent: changePercent,
      currency: meta.currency || 'TRY',
      longName: meta.shortName || meta.symbol
    };
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}

// Clean HTML/CDATA tags from XML string
function cleanXML(str) {
  if (!str) return '';
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

// Parse Yahoo Finance RSS XML Feed without external dependencies
function parseYahooNewsRSS(xmlText) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const content = match[1];
    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = content.match(/<link>([\s\S]*?)<\/link>/);
    const descMatch = content.match(/<description>([\s\S]*?)<\/description>/);
    const guidMatch = content.match(/<guid[\s\S]*?>([\s\S]*?)<\/guid>/);
    
    if (titleMatch) {
      items.push({
        title: cleanXML(titleMatch[1]),
        link: linkMatch ? linkMatch[1].trim() : '',
        description: descMatch ? cleanXML(descMatch[1]) : '',
        guid: guidMatch ? cleanXML(guidMatch[1]) : titleMatch[1].trim()
      });
    }
  }
  return items;
}

// Summarize news using Gemini 2.5 Flash model with user API key
async function summarizeNewsWithAI(apiKey, title, description, symbol) {
  if (!apiKey) return null;
  try {
    const prompt = `Aşağıdaki borsa haberini Türkçe olarak 2-3 cümleyle özetle. Ayrıca haberin ${symbol} hissesi üzerindeki olası etkisini belirt (Olumlu, Olumsuz veya Nötr). Yanıtını tam olarak şu formatta ver:
Özet: [Özet metni]
Etki: [Olumlu / Olumsuz / Nötr] (Nedenini 1 cümleyle açıkla)`;

    const requestBody = {
      contents: [{
        parts: [{
          text: `${prompt}\n\nHaber Başlığı: ${title}\nHaber Detayı: ${description}`
        }]
      }]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.error('[AI] Gemini API returned error status:', response.status);
      return null;
    }

    const data = await response.json();
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return aiText || null;
  } catch (error) {
    console.error('[AI] Error in summarizeNewsWithAI:', error);
    return null;
  }
}

// Global price cache for fast arayüz queries
let latestGlobalPrices = {};

// Check latest news for active alerts
let lastNewsCheckTime = 0;

async function checkNewsAlerts() {
  const db = await loadDB();
  if (!db.settings.newsAlertsEnabled) return;

  const now = Date.now();
  // Check news at most once every 5 minutes in standard background polling cycle
  if (now - lastNewsCheckTime < 5 * 60 * 1000) {
    return;
  }
  lastNewsCheckTime = now;

  console.log('[NewsEngine] Starting Yahoo RSS News check cycle...');
  
  const uniqueSymbols = db.newsSymbols || [];
  if (uniqueSymbols.length === 0) {
    console.log('[NewsEngine] No news symbols selected for tracking.');
    return;
  }

  let dbChanged = false;

  for (const sym of uniqueSymbols) {
    try {
      const url = `https://finance.yahoo.com/rss/headline?s=${encodeURIComponent(sym)}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
        }
      });
      if (!response.ok) continue;

      const xmlText = await response.text();
      const newsItems = parseYahooNewsRSS(xmlText);

      // Only check the latest 2 news items to prevent spamming older news
      for (const item of newsItems.slice(0, 2)) {
        if (!db.sentNews) db.sentNews = [];
        
        if (db.sentNews.includes(item.guid)) continue;

        console.log(`[NewsEngine] New news item detected for ${sym}: ${item.title}`);
        
        let notificationMsg = item.description || item.title;
        let aiResult = null;

        if (db.settings.geminiApiKey) {
          console.log(`[NewsEngine] Prompting Gemini AI to summarize news for ${sym}...`);
          aiResult = await summarizeNewsWithAI(db.settings.geminiApiKey, item.title, item.description, sym);
        }

        if (aiResult) {
          notificationMsg = aiResult;
        }

        // Send mobile notification with click URL!
        const title = `Yeni Haber: ${sym}`;
        await sendMobileNotification(
          title, 
          `📰 ${item.title.toUpperCase()}\n\n${notificationMsg}`, 
          `Haber Analizi (${sym})`, 
          sym,
          item.link
        );

        // Add to history so it shows up in dashboard logs
        db.history.unshift({
          id: Math.random().toString(36).substring(2, 9),
          symbol: sym,
          name: 'Haber Analiz Bildirimi',
          type: 'news_alert',
          targetValue: 0,
          triggerValue: 0,
          currency: 'HABER',
          description: `AI Özet: ${notificationMsg.substring(0, 150)}...`,
          timestamp: new Date().toISOString()
        });

        db.sentNews.push(item.guid);
        dbChanged = true;
      }
      
      // Delay to respect Yahoo rate limits
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`[NewsEngine] Error fetching/processing news for ${sym}:`, err);
    }
  }

  if (dbChanged) {
    await saveDB(db);
  }
}

// Global Polling Engine
let pollingIntervalId = null;

async function checkAlarms() {
  console.log(`[Engine] Alarm check cycle started at: ${new Date().toLocaleTimeString('tr-TR')}`);
  const db = await loadDB();
  const activeAlerts = db.alerts.filter(a => !a.triggered && a.active);

  if (activeAlerts.length === 0) {
    console.log('[Engine] No active alarms to check.');
    // Check news alerts even when there are no active price alerts
    await checkNewsAlerts();
    return;
  }

  // Filter out locked child alerts in sequential chains
  const evaluatableAlerts = [];
  for (const alert of activeAlerts) {
    if (alert.parentAlertId) {
      const parent = db.alerts.find(a => a.id === alert.parentAlertId);
      // If the parent alert exists and is NOT triggered yet, this child alert is locked/waiting
      if (parent && !parent.triggered) {
        continue;
      }
    }
    evaluatableAlerts.push(alert);
  }

  if (evaluatableAlerts.length === 0) {
    console.log('[Engine] Active alarms exist, but all are currently locked by sequential chain conditions.');
    await checkNewsAlerts();
    return;
  }

  // Group evaluatable alerts by symbol to minimize Yahoo API calls
  const uniqueSymbols = [...new Set(evaluatableAlerts.map(a => a.symbol))];
  
  const priceCache = {};
  for (const sym of uniqueSymbols) {
    const data = await fetchYahooPrice(sym);
    if (data) {
      priceCache[sym] = data;
      latestGlobalPrices[sym] = data.price; // Save to global cache
    }
    // Respectful delay between queries
    await new Promise(r => setTimeout(r, 400));
  }

  let dbChanged = false;

  for (const alert of db.alerts) {
    if (alert.triggered || !alert.active) continue;

    // Check if this alert was filtered out in sequential chain
    if (alert.parentAlertId) {
      const parent = db.alerts.find(a => a.id === alert.parentAlertId);
      if (parent && !parent.triggered) continue;
    }

    const currentData = priceCache[alert.symbol];
    if (!currentData) continue;

    const currentPrice = currentData.price;
    const changePercent = currentData.changePercent;
    let isTriggered = false;
    let triggerMsg = '';

    if (alert.type === 'above' && currentPrice >= alert.targetValue) {
      isTriggered = true;
      triggerMsg = `Fiyat Hedefi Aşıldı: ${currentPrice.toFixed(2)} ${currentData.currency} (Hedef: >= ${alert.targetValue.toFixed(2)})`;
    } else if (alert.type === 'below' && currentPrice <= alert.targetValue) {
      isTriggered = true;
      triggerMsg = `Fiyat Hedefin Altına Düştü: ${currentPrice.toFixed(2)} ${currentData.currency} (Hedef: <= ${alert.targetValue.toFixed(2)})`;
    } else if (alert.type === 'percent_up' && changePercent >= alert.targetValue) {
      isTriggered = true;
      triggerMsg = `Günlük Yükseliş Hedefi Aşıldı: %${changePercent.toFixed(2)} (Hedef: >= %${alert.targetValue.toFixed(2)})`;
    } else if (alert.type === 'percent_down' && changePercent <= alert.targetValue) {
      isTriggered = true;
      triggerMsg = `Günlük Düşüş Hedefi Kırıldı: %${changePercent.toFixed(2)} (Hedef: <= %${alert.targetValue.toFixed(2)})`;
    } else if (alert.type === 'range_inside' && currentPrice >= alert.targetValueMin && currentPrice <= alert.targetValueMax) {
      isTriggered = true;
      triggerMsg = `Fiyat Kanalın İçine Girdi: ${currentPrice.toFixed(2)} ${currentData.currency} (Kanal: [${alert.targetValueMin.toFixed(2)} - ${alert.targetValueMax.toFixed(2)}])`;
    } else if (alert.type === 'range_outside' && (currentPrice < alert.targetValueMin || currentPrice > alert.targetValueMax)) {
      isTriggered = true;
      triggerMsg = `Fiyat Kanalın Dışına Çıktı: ${currentPrice.toFixed(2)} ${currentData.currency} (Kanal: [${alert.targetValueMin.toFixed(2)} - ${alert.targetValueMax.toFixed(2)}])`;
    }

    if (isTriggered) {
      alert.triggered = true;
      alert.triggeredAt = new Date().toISOString();
      alert.triggerValue = alert.type.startsWith('percent') ? changePercent : currentPrice;

      // Add to history
      db.history.unshift({
        id: Math.random().toString(36).substring(2, 9),
        symbol: alert.symbol,
        name: alert.name,
        type: alert.type,
        targetValue: alert.targetValue || 0,
        targetValueMin: alert.targetValueMin || null,
        targetValueMax: alert.targetValueMax || null,
        triggerValue: alert.triggerValue,
        currency: currentData.currency,
        description: alert.description,
        timestamp: new Date().toISOString(),
        purchasePrice: alert.purchasePrice || null,
        purchaseQuantity: alert.purchaseQuantity || null
      });

      dbChanged = true;

      // Format notification message according to selected template and optional ROI data
      let finalMsg = triggerMsg;
      const template = db.settings.notificationTemplate || 'rich_ai';
      
      if (template === 'minimalist') {
        finalMsg = `🔔 ${alert.symbol} alarmı tetiklendi! Güncel: ${currentPrice.toFixed(2)} ${currentData.currency}`;
      } else if (template === 'price_only') {
        finalMsg = `${alert.symbol}: ${currentPrice.toFixed(2)} ${currentData.currency}`;
      } else {
        // rich_ai / standard (including ROI details if present!)
        let roiText = '';
        if (alert.purchasePrice && alert.purchaseQuantity) {
          const profit = (currentPrice - alert.purchasePrice) * alert.purchaseQuantity;
          const roiPct = ((currentPrice - alert.purchasePrice) / alert.purchasePrice) * 100;
          roiText = `\n\n💼 ROI Takibi:\n📊 Kâr/Zarar: ${profit.toFixed(2)} ${currentData.currency} (% ${roiPct >= 0 ? '+' : ''}${roiPct.toFixed(2)})`;
        }
        finalMsg = `🔔 ${triggerMsg}${roiText}`;
      }

      // Trigger phone notification
      const notificationTitle = `Alarm Tetiklendi: ${alert.symbol}`;
      sendMobileNotification(notificationTitle, finalMsg, alert.description, alert.symbol);
    }
  }

  if (dbChanged) {
    await saveDB(db);
  }

  // Check Yahoo RSS news updates at the end of the polling cycle
  await checkNewsAlerts();
}

async function startPollingEngine() {
  if (pollingIntervalId) {
    clearInterval(pollingIntervalId);
  }
  
  const db = await loadDB();
  const seconds = db.settings.pollingInterval || 5;
  console.log(`[Engine] Starting polling engine with an interval of ${seconds} seconds.`);
  
  // Run once immediately on start
  checkAlarms();
  
  pollingIntervalId = setInterval(checkAlarms, seconds * 1000);
}

// REST API: Search Stocks with Local BIST/US/Germany priority
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ quotes: [] });

  try {
    const qLower = query.toLowerCase();

    // 1. Search in local high-priority directory (BIST, US, Germany)
    const localMatches = GLOBAL_STOCKS_DATABASE.filter(s => 
      s.symbol.toLowerCase().includes(qLower) || 
      s.name.toLowerCase().includes(qLower)
    ).map(s => ({
      symbol: s.symbol,
      name: s.name,
      exchange: s.exchange,
      type: 'EQUITY'
    }));

    // 2. Query Yahoo Finance search API for global matches
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&newsCount=0`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
      }
    });
    
    let quotes = [];
    if (response.ok) {
      const data = await response.json();
      quotes = (data.quotes || [])
        .filter(q => q.symbol && (q.shortname || q.longname))
        .map(q => {
          let exchange = q.exchange || 'GLOBAL';
          if (q.symbol.endsWith('.IS')) exchange = 'BIST';
          else if (q.symbol.endsWith('.DE') || q.symbol.endsWith('.F')) exchange = 'XETRA';
          
          return {
            symbol: q.symbol,
            name: q.shortname || q.longname,
            exchange: exchange,
            type: q.quoteType
          };
        });
    }

    // 3. Merge local high-priority matches at the very top, removing duplicates
    const mergedQuotes = [...localMatches];
    const uniqueSymbols = new Set(localMatches.map(m => m.symbol));

    quotes.forEach(q => {
      if (!uniqueSymbols.has(q.symbol)) {
        mergedQuotes.push(q);
        uniqueSymbols.add(q.symbol);
      }
    });

    res.json({ quotes: mergedQuotes });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// REST API: Get Tracked News Symbols
app.get('/api/news-symbols', async (req, res) => {
  const db = await loadDB();
  res.json(db.newsSymbols || []);
});

// REST API: Add Tracked News Symbol
app.post('/api/news-symbols', async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ error: 'Symbol is required' });
  
  const db = await loadDB();
  if (!db.newsSymbols) db.newsSymbols = [];
  
  const upperSymbol = symbol.toUpperCase().trim();
  if (!db.newsSymbols.includes(upperSymbol)) {
    db.newsSymbols.push(upperSymbol);
    await saveDB(db);
  }
  
  res.json({ success: true, newsSymbols: db.newsSymbols });
});

// REST API: Delete Tracked News Symbol
app.delete('/api/news-symbols/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  if (!symbol) return res.status(400).json({ error: 'Symbol is required' });
  
  const db = await loadDB();
  if (!db.newsSymbols) db.newsSymbols = [];
  
  const upperSymbol = symbol.toUpperCase().trim();
  db.newsSymbols = db.newsSymbols.filter(s => s !== upperSymbol);
  await saveDB(db);
  
  res.json({ success: true, newsSymbols: db.newsSymbols });
});

// REST API: Fetch specific stock price
app.get('/api/price', async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: 'Symbol parameter is required' });

  const data = await fetchYahooPrice(symbol);
  if (!data) return res.status(404).json({ error: 'Stock details not found' });

  res.json(data);
});

// REST API: Alerts CRUD
app.get('/api/alerts', async (req, res) => {
  const db = await loadDB();
  const alertsWithPrices = db.alerts.map(alert => ({
    ...alert,
    currentPrice: latestGlobalPrices[alert.symbol] || null
  }));
  res.json(alertsWithPrices);
});

app.post('/api/alerts', async (req, res) => {
  const { symbol, name, type, targetValue, targetValueMin, targetValueMax, parentAlertId, description, purchasePrice, purchaseQuantity } = req.body;
  if (!symbol || !name || !type) {
    return res.status(400).json({ error: 'Missing alert details' });
  }

  const db = await loadDB();
  const newAlert = {
    id: Math.random().toString(36).substring(2, 9),
    symbol: symbol.toUpperCase(),
    name: name,
    type: type,
    targetValue: targetValue !== undefined && targetValue !== null ? parseFloat(targetValue) : null,
    targetValueMin: targetValueMin !== undefined && targetValueMin !== null ? parseFloat(targetValueMin) : null,
    targetValueMax: targetValueMax !== undefined && targetValueMax !== null ? parseFloat(targetValueMax) : null,
    parentAlertId: parentAlertId || null,
    description: description || '',
    purchasePrice: purchasePrice !== undefined && purchasePrice !== null ? parseFloat(purchasePrice) : null,
    purchaseQuantity: purchaseQuantity !== undefined && purchaseQuantity !== null ? parseFloat(purchaseQuantity) : null,
    active: true,
    triggered: false,
    createdAt: new Date().toISOString()
  };

  db.alerts.unshift(newAlert);
  await saveDB(db);
  
  res.json({ success: true, alert: newAlert });
});

// REST API: Backup database
app.get('/api/backup', async (req, res) => {
  try {
    const db = await loadDB();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=borsa-alarm-yedek.json');
    res.send(JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Backup error:', err);
    res.status(500).json({ error: 'Yedekleme başarısız.' });
  }
});

// REST API: Restore database
app.post('/api/restore', async (req, res) => {
  try {
    const backupData = req.body;
    if (!backupData || !backupData.alerts || !backupData.settings) {
      return res.status(400).json({ error: 'Geçersiz yedekleme dosyası formatı.' });
    }

    const db = await loadDB();
    db.alerts = backupData.alerts;
    db.history = backupData.history || [];
    db.sentNews = backupData.sentNews || [];
    db.settings = { ...db.settings, ...backupData.settings };

    await saveDB(db);
    
    // Restart polling engine
    startPollingEngine();

    res.json({ success: true, message: 'Yedekleme başarıyla geri yüklendi!' });
  } catch (err) {
    console.error('Restore error:', err);
    res.status(500).json({ error: 'Geri yükleme başarısız.' });
  }
});

// REST API: Test Yahoo news XML & AI summarizer
app.post('/api/test-news-alert', async (req, res) => {
  const symbol = req.query.symbol || 'AAPL';
  try {
    console.log(`[TestNews] Testing RSS & AI news for symbol: ${symbol}`);
    const db = await loadDB();
    const url = `https://finance.yahoo.com/rss/headline?s=${encodeURIComponent(symbol)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(500).json({ error: `Yahoo RSS fetch failed with status: ${response.status}` });
    }

    const xmlText = await response.text();
    const newsItems = parseYahooNewsRSS(xmlText);

    if (newsItems.length === 0) {
      return res.json({ success: false, message: `Hisse için aktif haber bulunamadı: ${symbol}` });
    }

    const item = newsItems[0];
    let notificationMsg = item.description || item.title;
    let aiResult = null;

    if (db.settings.geminiApiKey) {
      console.log(`[TestNews] Triggering Gemini AI summary for: ${item.title}`);
      aiResult = await summarizeNewsWithAI(db.settings.geminiApiKey, item.title, item.description, symbol);
    }

    if (aiResult) {
      notificationMsg = aiResult;
    }

    // Send notification
    await sendMobileNotification(
      `TEST HABER: ${symbol}`,
      `📰 ${item.title.toUpperCase()}\n\n${notificationMsg}\n\n🔗 Haberin Kaynağı: ${item.link}`,
      `Haber Testi (${symbol})`,
      symbol
    );

    res.json({ 
      success: true, 
      message: 'Test haberi alındı, AI özeti çıkarıldı ve mobil bildirim gönderildi!',
      news: {
        title: item.title,
        originalDescription: item.description,
        aiSummary: aiResult || 'AI Devre Dışı (API Anahtarı Yok)'
      }
    });
  } catch (error) {
    console.error('Test news alert error:', error);
    res.status(500).json({ error: 'Haber testi sırasında bir hata oluştu: ' + error.message });
  }
});

// REST API: Categorized news and KAP feed for a symbol
app.get('/api/news-feed', async (req, res) => {
  const symbol = req.query.symbol || 'THYAO.IS';
  try {
    const url = `https://finance.yahoo.com/rss/headline?s=${encodeURIComponent(symbol)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(500).json({ error: `Yahoo RSS fetch failed with status: ${response.status}` });
    }

    const xmlText = await response.text();
    const newsItems = parseYahooNewsRSS(xmlText);

    const kapAnnouncements = [];
    const generalNews = [];

    // Turkish & English disclosure filters
    const kapKeywords = ['kap ', 'kap:', 'kamuyu aydınlatma', 'kamuyu aydinlatma', 'özel durum açıklaması', 'ozel durum aciklamasi', 'bildirim', 'disclosure', 'announcement', 'regulatory'];

    newsItems.forEach(item => {
      const textToAnalyze = `${item.title} ${item.description}`.toLowerCase();
      const isKAP = kapKeywords.some(keyword => textToAnalyze.includes(keyword)) || /kap[:\s]/i.test(item.title);
      
      if (isKAP) {
        kapAnnouncements.push(item);
      } else {
        generalNews.push(item);
      }
    });

    res.json({
      symbol: symbol,
      kap: kapAnnouncements,
      news: generalNews
    });
  } catch (error) {
    console.error('Error fetching news feed:', error);
    res.status(500).json({ error: 'Haber akışı yüklenemedi: ' + error.message });
  }
});

// REST API: AI summary and sentiment analysis for single news item
app.post('/api/news-feed/summarize', async (req, res) => {
  const { title, description, symbol } = req.body;
  if (!title) return res.status(400).json({ error: 'Haber başlığı gereklidir.' });

  try {
    const db = await loadDB();
    const apiKey = db.settings.geminiApiKey;

    if (!apiKey) {
      return res.json({ 
        success: false, 
        message: 'Lütfen AI analizi için Ayarlar modalından Gemini API anahtarınızı girin.' 
      });
    }

    const aiResult = await summarizeNewsWithAI(apiKey, title, description || '', symbol || 'Borsa');
    
    if (aiResult) {
      res.json({
        success: true,
        summary: aiResult
      });
    } else {
      res.status(500).json({ error: 'AI özetleme motoru boş yanıt döndü.' });
    }
  } catch (error) {
    console.error('AI feed summary error:', error);
    res.status(500).json({ error: 'Yapay zeka analizi yapılamadı: ' + error.message });
  }
});

// Toggle alert state
app.put('/api/alerts/:id/toggle', async (req, res) => {
  const id = req.params.id;
  const db = await loadDB();
  const alertIndex = db.alerts.findIndex(a => a.id === id);

  if (alertIndex === -1) return res.status(404).json({ error: 'Alert not found' });

  db.alerts[alertIndex].active = !db.alerts[alertIndex].active;
  if (db.alerts[alertIndex].active) {
    db.alerts[alertIndex].triggered = false;
  }
  
  await saveDB(db);
  res.json({ success: true, alert: db.alerts[alertIndex] });
});

app.delete('/api/alerts/:id', async (req, res) => {
  const id = req.params.id;
  const db = await loadDB();
  db.alerts = db.alerts.filter(a => a.id !== id);
  await saveDB(db);
  res.json({ success: true });
});

// REST API: History
app.get('/api/history', async (req, res) => {
  const db = await loadDB();
  res.json(db.history);
});

app.delete('/api/history', async (req, res) => {
  const db = await loadDB();
  db.history = [];
  await saveDB(db);
  res.json({ success: true });
});

// REST API: Settings
app.get('/api/settings', async (req, res) => {
  const db = await loadDB();
  res.json(db.settings);
});

app.post('/api/settings', async (req, res) => {
  const newSettings = req.body;
  const db = await loadDB();
  const oldInterval = db.settings.pollingInterval;

  db.settings = { ...db.settings, ...newSettings };
  await saveDB(db);

  if (oldInterval !== db.settings.pollingInterval) {
    startPollingEngine();
  }

  res.json({ success: true, settings: db.settings });
});

// REST API: Send Test Notification
app.post('/api/test-notification', async (req, res) => {
  try {
    const title = 'Test Bildirimi - Borsa Alarm';
    const message = 'Telefon bağlantınız başarıyla kuruldu! Alarmlarınız artık cebinizde.';
    const description = 'Bu bir test bildirimidir. Borsa takip robotunuz hazır!';
    
    await sendMobileNotification(title, message, description, 'TEST');
    res.json({ success: true, message: 'Test notification sent to your phone!' });
  } catch (error) {
    console.error('Test notification failed:', error);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

// CLOUD CRON ENDPOINT: Can be pinged externally every 1 minute
app.get('/api/cron-check', async (req, res) => {
  try {
    console.log('[Cron] External cron trigger received.');
    await checkAlarms();
    res.json({ 
      success: true, 
      message: 'Alarm check complete.',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('[Cron] External trigger error:', error);
    res.status(500).json({ error: 'Cron alarm check failed' });
  }
});

// Start Server and Polling Loop
app.listen(PORT, async () => {
  console.log(`[Server] Stock Alarm backend listening on port ${PORT}`);
  
  // Verify DB on boot
  await loadDB();
  
  // Start local interval loop
  startPollingEngine();
});
