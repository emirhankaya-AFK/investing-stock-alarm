# 📈 Borsa Alarm Uygulaması - Bulut Kurulum & Proje Dokümantasyonu

Bu doküman, Borsa Alarm uygulamasının bulut (cloud) entegrasyonu, veri tabanı eşleşmeleri ve tüm alarm listesini içermektedir. Başka bir AI asistanı veya **Antigravity** örneği bu dokümanı okuyarak projenin mevcut durumunu, veri tabanını ve bulut yapılandırmasını anında kavrayabilir.

---

## ☁️ Bulut Entegrasyon Bilgileri

Uygulama, 7/24 kesintisiz çalışması ve bilgisayar kapalıyken bile telefonuna alarm gönderebilmesi için **Render** üzerinde buluta taşınmıştır.

### 🗄️ 1. JSONBin.io (Bulut Veri Tabanı) Bilgileri
Uygulama verilerinin (aktif alarmlar, geçmiş ve ayarlar) kaybolmaması için veriler bulut veri tabanında tutulmaktadır:
* **Bin ID:** `6a1b6ada21f9ee59d29f41f5`
* **X-Master-Key:** `$2a$10$auWTrilwRLigddQfDc20kuaslsHPmhhQyyBQWBCGugc6ParP7cDFu`

### 💻 2. GitHub Kod Deposu
Proje kodları Git ile sürüm kontrolüne alınmış ve GitHub'a yüklenmiştir:
* **Depo URL:** `https://github.com/emirhankaya-AFK/investing-stock-alarm.git`
* **Ana Dal (Branch):** `main`

### 🚀 3. Render Çevre Değişkenleri (Environment Variables)
Uygulama Render üzerinde çalışırken şu iki değişkeni kullanmaktadır:
1. `JSONBIN_BIN_ID` = `6a1b6ada21f9ee59d29f41f5`
2. `JSONBIN_API_KEY` = `$2a$10$auWTrilwRLigddQfDc20kuaslsHPmhhQyyBQWBCGugc6ParP7cDFu`

---

## 🎯 Kurulan Alarmların Listesi (Toplam 81 Alarm)

Uygulamaya BIST hisseleri, BIST 100 endeksi, kripto paralar ve emtialar için kurulan tüm teknik seviyeler ve açıklamaları aşağıdadır:

### 1. Borsa İstanbul Hisseleri (BIST)
* **ALBRK.IS (Albaraka):**
  * `Fiyat <= 7.50` ➡️ ALBRK - Ana destek / alıcı gelen yer (Meteor düşse de tepki alan yer)
  * `Fiyat <= 6.50` ➡️ ALBRK - 7,50 sert kırılırsa bakılacak alt seviye / stop
  * `Fiyat >= 9.50` ➡️ ALBRK - Satıcı/tepe direnç bölgesi, geçilmeden kopuş zor
  * `Fiyat >= 11.00` ➡️ ALBRK - Yatay bant yukarı kırılırsa olası katlama hedefi
* **CLEBI.IS (Çelebi):**
  * `Fiyat <= 1500.00` ➡️ CLEBI - Dip bölgesi / destek (Abartılı düşüş sonrası tepki beklenen dip)
  * `Fiyat >= 1719.00` ➡️ CLEBI - 20 haftalık ortalama; üzerine atarsa pozitif
  * `Fiyat >= 1950.00` ➡️ CLEBI - İlk tepki hedefi
  * `Fiyat >= 2100.00` ➡️ CLEBI - Yükselişin devamında olası hedef
  * `Fiyat >= 2400.00` ➡️ CLEBI - Geniş yatay bandın üst tarafı direnç
* **OYAKC.IS (Oyak Çimento):**
  * `Fiyat <= 19.50` ➡️ OYAKC - Ana dip/destek bölgesi (Toparlanma ihtimali)
  * `Fiyat >= 23.50` ➡️ OYAKC - Ortalamalar bölgesi direnç
  * `Fiyat >= 25.50` ➡️ OYAKC - İlk hedef / daha önce zorlandığı bölge
  * `Fiyat >= 30.00` ➡️ OYAKC - Ana direnç; geçilmesi için sabır lazım
* **AKSA.IS (Aksa Akrilik):**
  * `Fiyat >= 12.00` ➡️ AKSA - Satıcı gelen bölge direnci
  * `Fiyat >= 12.50` ➡️ AKSA - Yukarı kırılırsa pozitif trend başlar
  * `Fiyat >= 14.00` ➡️ AKSA - Kırılım sonrası olası hedef
* **PAHOL.IS (Pasifik Holding):**
  * `Fiyat <= 1.50` ➡️ PAHOL - Ana dip bölgesi
  * `Fiyat >= 1.72` ➡️ PAHOL - İlk beklenebilecek ara seviye
  * `Fiyat >= 1.85` ➡️ PAHOL - Yatay alanın üst tarafı direnç
  * `Fiyat >= 2.25` ➡️ PAHOL - Uzun vadeli yatay alan katlama hedefi (3-5 ay)
* **MIATK.IS (Miatek):**
  * `Fiyat <= 40.00` ➡️ MIATK - Dipten kalkış bölgesi (Destek / stop)
  * `Fiyat >= 65.00` ➡️ MIATK - Olası yükseliş hedefi
  * `Fiyat >= 80.00` ➡️ MIATK - Spekülatör güçlü götürürse büyük hedef
* **REEDR.IS (Reeder - Analizdeki "Raider"):**
  * `Fiyat <= 6.00` ➡️ REEDR - Çok sert düşüş sonrası dip bölgesi
  * `Fiyat >= 7.50` ➡️ REEDR - Tepki potansiyeli direnci
  * `Fiyat >= 9.20` ➡️ REEDR - İlk ciddi hedef / 50 haftalık ortalama bölgesi
  * `Fiyat >= 12.50` ➡️ REEDR - Daha büyük çanak katlarsa olası hedef
* **KTLEV.IS (Katılımevim):**
  * `Fiyat <= 108.00` ➡️ KTLEV - Bir önceki günün dibi; altına inerse sat (stop)
  * `Fiyat <= 94.00` ➡️ KTLEV - 20 günlük ortalama civarı destek
  * `Fiyat <= 92.00` ➡️ KTLEV - 94'ten alınırsa zarar kesilebilecek alt bölge (stop)
* **MAGEN.IS (Margün Enerji):**
  * `Fiyat <= 40.00` ➡️ MAGEN - Spekülatör malı tepede verdiyse indirilebileceği riskli dip bölgesi
  * `Fiyat <= 45.00` ➡️ MAGEN - 50 günlük ortalamadan tepki bölgesi (dikkat edilmeli)
* **YKBNK.IS (Yapı Kredi):**
  * `Fiyat <= 32.20` ➡️ YKBNK - Kritik destek, altında bankalarda sıkıntı bitmemiştir
  * `Fiyat >= 33.40` ➡️ YKBNK - Kanal içine dönüş için ilk eşik
  * `Fiyat >= 35.00` ➡️ YKBNK - Kalıcı toparlanma için aşılması gereken bölge
  * `Fiyat >= 40.00` ➡️ YKBNK - Çanak üstü / önceki direnç
  * `Fiyat >= 46.00` ➡️ YKBNK - Dolar bazlı önemli direnç (1 Dolar seviyesi)
* **TUPRS.IS (Tüpraş):**
  * `Fiyat <= 235.00` ➡️ TUPRS - Kırmızı çizgi / kritik destek, altında risk azaltılmalı
  * `Fiyat <= 200.00` ➡️ TUPRS - ABD-İran barış senaryosunda hızlıca gelebilecek gevşeme bölgesi
  * `Fiyat >= 255.00` ➡️ TUPRS - Aşılmadan yeni trend oluşmaz dediği direnç
* **PETKM.IS (Petkim):**
  * `Fiyat <= 22.00` ➡️ PETKM - Çok kritik destek, altına kırılırsa pozisyonda ısrar edilmemeli
  * `Fiyat >= 24.00` ➡️ PETKM - Tepki yükselişinde direnç / pozisyon azaltma bölgesi
* **THYAO.IS (Türk Hava Yolları):**
  * `Fiyat <= 270.00` ➡️ THYAO - Uzun vadeli trend destek bölgesi
  * `Fiyat >= 300.00` ➡️ THYAO - İki ortalama üst üste geldi. Kısa vadeli ana direnç
  * `Fiyat >= 297.00` ➡️ THYAO - 10 ve 25 günlük ortalama; üstünde haftalık kapanış pozitif (Barışta ilk alınacaklardan)
* **EREGL.IS (Ereğli):**
  * `Fiyat <= 36.00` ➡️ EREGL - Trend bozulmadıkça stop seviyesi
  * `Fiyat >= 42.50` ➡️ EREGL - Kısa vadeli zorlanabileceği direnç / pozisyon azaltma bölgesi
* **SASA.IS (Sasa):**
  * `Fiyat <= 2.25` ➡️ SASA - Alım için dip bölgesi (Çok arz var, yukarı gitmesi zor)
  * `Fiyat >= 3.25` ➡️ SASA - Kısa vadeli boğuşma/satış bölgesi
* **ASELS.IS (Aselsan):**
  * `Fiyat <= 347.00` ➡️ ASELS - 20 haftalık ortalama desteği
  * `Fiyat <= 320.00` ➡️ ASELS - OBO çalışırsa riskli hedef bölgesi
* **ASTOR.IS (Astor):**
  * `Fiyat <= 220.00` ➡️ ASTOR - 20 haftalık ortalama (Ortalamalardan çok açıldı, dinlenebilir)
  * `Fiyat >= 350.00` ➡️ ASTOR - Çok hızlı ulaştığı bölge / direnç
* **SISE.IS (Şişecam):**
  * `Fiyat <= 42.00` ➡️ SISE - Alıcı gelebilecek destek bölgesi
  * `Fiyat >= 50.00` ➡️ SISE - Kısa vadeli yatay bandın üstü
  * `Fiyat >= 56.00` ➡️ SISE - Geçilmesi gereken önemli Golden Cross direnci
* **EKGYO.IS (Emlak Konut):**
  * `Fiyat >= 0.85` ➡️ EKGYO - Dolar bazında 50 aylık ortalama / 80-85 cent potansiyeli
* **ESEN.IS (Esenboğa):**
  * `Fiyat <= 3.50` ➡️ ESEN - Dip/toplama bölgesi. Eski yüksek seviyeler zor
  * `Fiyat >= 5.00` ➡️ ESEN - İlk tepki hedefi

### 2. Endeksler
* **XU100.IS (BIST 100 Endeksi):**
  * `Fiyat <= 13400` ➡️ BIST 100 - Kritik alt eşik ve kanal desteği / stop
  * `Fiyat >= 14000` ➡️ BIST 100 - Teknik ana eşik direnci; haftalık kapanış şart
  * `Fiyat >= 14250` ➡️ BIST 100 - Üzerine çıkarsa çok güçlü tepki olur
  * `Fiyat >= 16800` ➡️ BIST 100 - Uzun vadeli üst bant hedefi

### 3. Kripto Paralar
* **BTC-USD (Bitcoin):**
  * `Fiyat <= 74000` ➡️ BTC - Stop / can sıkar dediği bölge. Altı bozar
  * `Fiyat >= 78000` ➡️ BTC - Pozitif kırılım eşiği. Üstü 82.000'i koklar
  * `Fiyat >= 82000` ➡️ BTC - İlk direnç hedefi. Geçilirse 94.000-97.000 bandı
* **ETH-USD (Ethereum):**
  * `Fiyat <= 1936` ➡️ ETH - Son dip / destek bölgesi
  * `Fiyat >= 2240` ➡️ ETH - 50 günlük ortalama direnci. Üstüne çıkması şart
  * `Fiyat >= 2450` ➡️ ETH - Ortalamalar aşılırsa hedef olabilecek seviye

### 4. Emtialar
* **BZ=F (Brent Petrol):**
  * `Fiyat <= 95.00` ➡️ Brent Petrol - Tutunması gereken bölge / destek
  * `Fiyat >= 105.00` ➡️ Brent Petrol - Yeniden yukarı hareket için geçilmesi gereken direnç
* **GC=F (Altın Futures):**
  * `Fiyat <= 4545` ➡️ Altın - Stop seviyesi. Altı bozar
  * `Fiyat >= 4700` ➡️ Altın - Kısa vadeli hedef
  * `Fiyat >= 4900` ➡️ Altın - Büyük yuvarlanma tamamlanırsa hedef alan
* **SI=F (Gümüş Futures):**
  * `Fiyat <= 73.00` ➡️ Gümüş - Son dip desteği
  * `Fiyat >= 79.00` ➡️ Gümüş - Boyun çizgisi direnci
  * `Fiyat >= 83.00` ➡️ Gümüş - Kısa vadeli TOBO hedefi
  * `Fiyat >= 92.00` ➡️ Gümüş - Önceden beklenen ama ulaşılamayan direnç

---

## 🧠 Gelecek AI Asistanları İçin El Sıkışma (Handover) Notu
> [!NOTE]
> Bu proje, Yahoo Finance API sorgularını node-fetch kullanarak `server.js` üzerinden gerçekleştiren ve kullanıcıya `ntfy` / `Telegram` push bildirimleri yollayan hafif bir Node.js Express servisidir. Veri tabanı senkronizasyonu JSONBin.io bulut servisiyle çift yönlü (in-memory caching & backup) olarak kurgulanmıştır. Kod tabanında değişiklik yapmadan önce buluttaki değişkenleri ve JSONBin modelini kontrol edin.
