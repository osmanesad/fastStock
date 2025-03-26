# fastStock

fastStock, React kullanılarak geliştirilmiş ve Supabase entegrasyonu ile çalışan bir stok takip uygulamasıdır. Uygulama, Supabase veritabanındaki "stok" tablosundan verileri çekerek; listeleme, arama, sıralama ve yeni kayıt ekleme gibi işlemleri gerçekleştirmektedir.

## Özellikler
- **Veri Görüntüleme:** Supabase'deki stok verilerinin listelenmesi.
- **Arama ve Filtreleme:** Girilen arama terimine göre verilerin dinamik olarak filtrelenmesi.
- **Sıralama:** Tablo başlıklarına tıklayarak verileri artan/azalan sırada sıralama.
- **Yeni Kayıt Ekleme:** Ürün adı ve stok bilgilerini girerek yeni kayıt ekleme.
- **Veri Yenileme:** Verilerin Supabase'den yeniden çekilmesi.
- **Responsive Tasarım:** Farklı ekran boyutlarına uyumlu modern tasarım.

## Gereksinimler
- **Node.js:** Önerilen sürüm v16 veya v18 (Node.js v17 ve sonrası için OpenSSL uyumluluğu amacıyla ek ayarlar gerekebilir)
- **npm:** Paket yöneticisi
- **Supabase Hesabı:** Bir Supabase projesi oluşturun ve "stok" tablonuzun şemasını aşağıdaki örneğe uygun şekilde ayarlayın (örneğin, sütunlar: `urun_adi`, `stok`)

## Kurulum Adımları

1. **Depoyu Klonlayın:**

   ```bash
   git clone https://github.com/your-username/fastStock.git
   cd fastStock


2. **Bağımlılıkları Yükleyin:**


npm install


3. **Supabase Ayarları:**

src/supabaseClient.js dosyasını açın.

supabaseUrl ve supabaseKey değerlerini kendi Supabase projenizin bilgileriyle güncelleyin.

4. **(Gerekirse) OpenSSL Ayarları:**

Node.js v17 veya üstü kullanıyorsanız, aşağıdaki ortam değişkenini ayarlamanız gerekebilir:

Windows (CMD):


set NODE_OPTIONS=--openssl-legacy-provider
npm start

Windows (PowerShell):

$env:NODE_OPTIONS="--openssl-legacy-provider"
npm start
Linux/macOS:


export NODE_OPTIONS=--openssl-legacy-provider
npm start

5. **Çalıştırma:**

Geliştirme modunda projeyi başlatmak için:


npm start

Tarayıcınız otomatik olarak açılarak uygulamanın çalıştığını göreceksiniz.

6. **Proje Yapısı**

src/App.js: Uygulamanın ana bileşeni. GoogleSheetsApp bileşenini içerir.

src/GoogleSheetsApp.js: Supabase entegrasyonu, veri çekme, arama, sıralama ve yeni kayıt ekleme işlevlerinin bulunduğu bileşen.

src/GoogleSheetsApp.css: Uygulamanın stil dosyası.

src/supabaseClient.js: Supabase istemcisinin oluşturulduğu ve yapılandırıldığı dosya.

src/index.js: React uygulamasının giriş noktası.

src/App.test.js: Test dosyası (React Testing Library ile temel testler).

src/setupTests.js: Test ortamının yapılandırılması.

7. **Test**

Uygulamayı test etmek için:


npm test

Üretim İçin Derleme

Projeyi üretim moduna derlemek için:

npm run build

Sorun Giderme

"react-scripts is not recognized":

Bağımlılıkların tam olarak yüklendiğinden emin olun (npm install komutunu tekrar çalıştırın).

8. **OpenSSL Hatası:**

Node.js v17 ve sonrası için yukarıdaki NODE_OPTIONS ayarını yapın.

9. **Supabase Hataları:**

supabaseClient.js dosyasında yer alan URL ve API anahtarınızın doğru olduğundan emin olun. Ayrıca, Supabase'deki "stok" tablonuzun şemasının uygulamada kullanılan sütun adlarıyla (örneğin, urun_adi ve stok) uyumlu olduğuna dikkat edin.

10. **Katkıda Bulunma**

Herhangi bir hata bildirimi veya geliştirme öneriniz için lütfen repo sahibine ulaşın ya da pull request gönderin.