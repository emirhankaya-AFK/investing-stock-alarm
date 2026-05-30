# Mobil Bildirimli Borsa Alarm & Takip İstasyonu 📈📱

Bu uygulama, belirlediğiniz Borsa İstanbul (BIST), küresel hisse senetleri (veya kripto paralar) hedeflediğiniz seviyeye ulaştığında **doğrudan cep telefonunuza anlık (push) bildirim göndermek** üzere tasarlanmış, reklamsız, sınırsız ve tamamen size özel bir finansal terminaldir.

---

## 🚀 Öne Çıkan Özellikler
* **Sınırsız & Reklamsız Alarmlar:** Ücretsiz sürüm sınırlamaları veya can sıkıcı reklamlar olmadan dilediğiniz kadar alarm kurun.
* **Özel Alarm Notu / Açıklaması:** Her alarm için özel bir not yazabilirsiniz (örn: *"THYAO Direnci Kırdı, Satış Yap!"*). Alarm tetiklendiğinde telefonunuza doğrudan bu açıklama gönderilir! (Kullanıcı Talebi 🎯)
* **İki Farklı Mobil Bildirim Yöntemi:**
  1. **ntfy.sh (Önerilen - En Pratik):** Üyelik veya hesap açma gerektirmeden, telefonunuza indireceğiniz ücretsiz bir uygulamayla 10 saniyede eşleşir.
  2. **Telegram Bot:** Kendi Telegram botunuzu tanımlayarak zengin biçimlendirilmiş anlık mesajlar alabilirsiniz.
* **Web Audio API Enstrüman Sentezi:** Tarayıcı açıkken alarmlar tetiklendiğinde çalması için Web Audio API ile özel ses efektleri (Synthwave yükselişi, yumuşak dijital melodi, tiz alarm vb.) anlık olarak sentezlenir. Heavy mp3 dosyaları yüklenmez, gecikmesiz çalışır!
* **Anlık Fiyat Takip Kartı:** Arama yaptığınız hissenin fiyatı değiştiğinde yeşil (yükseliş) veya kırmızı (düşüş) renklerle parlayan modern grafik kartı.

---

## 📲 Telefonunuzu Bağlama Sihirbazı (10 Saniyede Kurulum)

### Yöntem A: ntfy.sh Entegrasyonu (Kayıt Gerekmez - Ücretsiz & Hızlı)
1. Telefonunuza **App Store (iOS)** veya **Google Play Store (Android)** üzerinden **ntfy** isimli tamamen ücretsiz uygulamayı indirin.
2. Uygulamayı açın, sağ üstteki/alt köşedeki **+** (Kanal Ekle/Subscribe) butonuna basın.
3. Yönetim panelinizdeki "Ayarlar" sekmesinde veya ana ekranda yer alan özel başlığı yazın (Örn: `emirh-borsa-alarm`).
4. **Subscribe (Abone Ol)** butonuna basarak kanalı takip etmeye başlayın.
5. Yönetim panelindeki **"Telefonuma Test Bildirimi Gönder"** butonuna basarak telefonunuza anında gelen bildirimi test edin!

---

## 🛠️ Nasıl Çalıştırılır? (Sizin Adınıza Ben Çalıştıracağım!)

Ben projenin tüm bağımlılıklarını kurup sunucusunu sizin için arka planda başlatacağım. Sunucu çalışmaya başladığında tarayıcınızdan şu adrese girmeniz yeterlidir:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📂 Proje Dosyaları
* `server.js`: Yahoo Finance sorgulama motoru, arka plan tarayıcı ve Telegram/ntfy API istemcisi.
* `public/index.html`: Modern buzlu cam (glassmorphism) panel düzeni.
* `public/index.css`: Koyu cyberpunk-finans temalı şık stil katmanı.
* `public/app.js`: Hisse arama, canlı grafikler, Web Audio ses sentezi ve ayar yönetimi.
* `data/db.json`: Aktif alarmlarınızın, alarm geçmişinizin ve ayarlarınızın güvenle saklandığı yerel veri tabanı.
