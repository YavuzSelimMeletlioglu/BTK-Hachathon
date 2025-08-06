Akıllı Tarif Asistanı – GEMİNİ Destekli E-Ticaret & Yemek Eğitimi Yardımcısı

🎯 Kısa Tanım
Akıllı Tarif Asistanı, kullanıcının yapmak istediği yemeği doğal dille ifade etmesiyle başlayan, tüm süreci yapay zeka desteğiyle yöneten bir sistemdir. Kullanıcı bir yemeği söyleyerek ya da yazarak sisteme giriş yapar; ardından GEMİNİ destekli akıllı sistemimiz, tarifi çıkarır, gerekli malzemeleri listeler, bunları sepete ekler, e-ticaret sisteminden sipariş verir ve aynı zamanda kullanıcıya video rehberi ile yemeği yapmayı öğretir.

🧩 Problem Tanımı
1- Kullanıcılar genellikle yemek yapmak ister ama:
2- Tarifi bulmakta zorlanırlar
3- Malzemeleri eksik olabilir
4- Malzeme listesini oluşturmak ve alışverişe dönüştürmek vakit alır
5- Her zaman yazılı tarif okumak istemezler, video daha etkili olabilir


💡 Çözümümüz
Bu proje, yukarıdaki sorunları tek adımda çözen entegre bir sistem sunar:
1- GEMİNİ ile kullanıcıdan alınan istek yorumlanır.
2- Yemek tarifi ve malzeme listesi otomatik olarak oluşturulur.
3- Yemek Önerisi Sunar.
4- Malzemeler, sistemde kayıtlı e-ticaret ürünleriyle eşleştirilir.
5- Sepete eklenir ve tek tuşla sipariş verilebilir.
6- Aynı anda yemek tarifi videosu kullanıcıya sunulur.


🔧 Teknik Mimari
Katman
Açıklama
💬 LLM API
  Kullanıcının yemek isteğini işleyip malzemeleri ve tarifi çıkarır (örn. Gemini)
🛒 E-Ticaret API
  Malzemeleri sistemdeki ürün verisiyle eşleştirir
📦 Flask Backend
  Kullanıcı, ürün, sepet yönetimini sağlar
📹 YouTube API
  Otomatik olarak yemek tarifi videosu bulur
📱 Frontend 
  Kullanıcı dostu arayüz ile tüm süreci sunar
