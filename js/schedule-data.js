/**
 * Radyo A (Anadolu Üniversitesi 100.5 FM)
 * Haftalık Yayın Akışı ve Program Bilgileri
 */

export const SCHEDULE_DATA = {
  // 1: Pazartesi ... 7: Pazar (veya 0: Pazar, 1: Pazartesi)
  days: [
    {
      id: "pazartesi",
      dayIndex: 1,
      name: "Pazartesi",
      short: "Pzt",
      programs: [
        {
          id: "mon-1",
          start: "08:00",
          end: "10:00",
          title: "Gündoğumu & Sabah Kahvesi",
          host: "Deniz Yılmaz & Caner Kurt",
          category: "Müzik & Sohbet",
          tag: "Gündem",
          image: "assets/images/studio.jpg",
          description: "Eskişehir'de yeni güne uyanırken akustik ezgiler, hava durumu ve kampüsten güncel haberler.",
          tracks: ["Akustik Seçkiler", "Sabah Haberleri", "Günün Sözü"]
        },
        {
          id: "mon-2",
          start: "10:00",
          end: "12:00",
          title: "Kampüs Havadisleri",
          host: "İrem Aksoy",
          category: "Kampüs & Gençlik",
          tag: "Üniversite",
          image: "assets/images/studio.jpg",
          description: "Anadolu Üniversitesi kulüp etkinlikleri, seminerler, kütüphane duyuruları ve öğrenci röportajları.",
          tracks: ["Kulüp Köşesi", "Rektörlük Bülteni", "Haftanın Öğrencisi"]
        },
        {
          id: "mon-3",
          start: "12:00",
          end: "14:00",
          title: "Öğle Molası: Alternatif Ritimler",
          host: "Emre Tekin",
          category: "Müzik",
          tag: "Indie Rock",
          image: "assets/images/studio.jpg",
          description: "Öğle arasında bağımsız müzik sahnesinden en taze indie pop, synth-pop ve yerli alternatif sesler.",
          tracks: ["Yerli Indie", "Global Keşifler", "Haftanın Yeni Çıkışları"]
        },
        {
          id: "mon-4",
          start: "14:00",
          end: "16:00",
          title: "İletişim Masası",
          host: "Prof. Dr. Hakan Aydın & Öğrenci Paneli",
          category: "Kültür-Sanat",
          tag: "Akademi",
          image: "assets/images/studio.jpg",
          description: "İletişim Bilimleri Fakültesi katkılarıyla medya okuryazarlığı, sinema, yeni medya ve reklamcılık analizleri.",
          tracks: ["Medya Eleştirisi", "Akademik Bakış", "Öğrenci Tezi"]
        },
        {
          id: "mon-5",
          start: "16:00",
          end: "18:00",
          title: "Drive Time: Şehrin Sesi 100.5",
          host: "Berk Sarı",
          category: "Müzik & Eğlence",
          tag: "Hit Music",
          image: "assets/images/studio.jpg",
          description: "Ders çıkışında ve iş dönüşünde Eskişehir trafiğine eşlik eden günün en enerjik hit şarkıları ve canlı telefon bağlantıları.",
          tracks: ["Top Hits", "Trafik & Yol Durumu", "Canlı İstekler"]
        },
        {
          id: "mon-6",
          start: "18:00",
          end: "20:00",
          title: "Akustik Saatler & Yerel Sahne",
          host: "Ece Demir",
          category: "Müzik",
          tag: "Canlı Performans",
          image: "assets/images/studio.jpg",
          description: "Eskişehir'in genç müzisyenleri ve öğrenci gruplarının stüdyo canlı performansları ve samimi sohbetler.",
          tracks: ["Canlı Akustik", "Sanatçı Söyleşisi", "Unplugged Klasikler"]
        },
        {
          id: "mon-7",
          start: "20:00",
          end: "22:00",
          title: "Rock A'nd Anadolu",
          host: "Oğuz Karahan",
          category: "Müzik",
          tag: "Anadolu Rock",
          image: "assets/images/studio.jpg",
          description: "Cem Karaca, Barış Manço, Moğollar'dan günümüz psychedelic ve progresif rock temsilcilerine uzanan efsanevi yolculuk.",
          tracks: ["70'ler Anadolu Pop", "Saykodelik Rock", "Gitar Soloları"]
        },
        {
          id: "mon-8",
          start: "22:00",
          end: "00:00",
          title: "Gece Seyri: Caz & Şiir",
          host: "Zeynep Çelik",
          category: "Kültür-Sanat",
          tag: "Gece Kuşağı",
          image: "assets/images/studio.jpg",
          description: "Porsuk Çayı'nın kıyısında sakin bir gece; nostaljik caz standartları, blues kayıtları ve edebiyat pasajları.",
          tracks: ["Late Night Jazz", "Edebi Okumalar", "Mavi Gece"]
        },
        {
          id: "mon-9",
          start: "00:00",
          end: "08:00",
          title: "Radyo A Gece Nöbeti",
          host: "Radyo A Otomasyon",
          category: "Müzik",
          tag: "Chillout",
          image: "assets/images/studio.jpg",
          description: "Gece boyunca çalışan öğrencilere ve yolculara eşlik eden kesintisiz ambient, lofi ve downtempo müzik akışı.",
          tracks: ["Lofi Hip-Hop", "Ambient Soundscapes", "Gece Frekansı"]
        }
      ]
    },
    {
      id: "sali",
      dayIndex: 2,
      name: "Salı",
      short: "Sal",
      programs: [
        {
          id: "tue-1",
          start: "08:00",
          end: "10:00",
          title: "Gündoğumu & Sabah Kahvesi",
          host: "Deniz Yılmaz & Caner Kurt",
          category: "Müzik & Sohbet",
          tag: "Gündem",
          description: "Eskişehir sabahına keyifli başlangıç, kültür ajandası ve seçkin akustik parçalar."
        },
        {
          id: "tue-2",
          start: "10:00",
          end: "12:00",
          title: "Sinestezi: Sinema & Dizi Kuşağı",
          host: "Burak Şen (RTS Kulübü)",
          category: "Kültür-Sanat",
          tag: "Sinema",
          description: "Vizyondaki filmler, Eskişehir Film Festivali analizleri, film müzikleri ve unutulmaz replikler."
        },
        {
          id: "tue-3",
          start: "12:00",
          end: "14:00",
          title: "Dünya Müzik Turu",
          host: "Melisa Yıldız",
          category: "Müzik",
          tag: "World Music",
          description: "Balkan ritimlerinden Latin ezgilerine, Fransız şansonlarından İskandinav melodilerine dünya turu."
        },
        {
          id: "tue-4",
          start: "14:00",
          end: "16:00",
          title: "Girişimci Kampüs",
          host: "Arda Güler & Konuklar",
          category: "Bilim & Teknoloji",
          tag: "İnovasyon",
          description: "Anadolu Üniversitesi Teknopark projeleri, öğrenci start-up'ları ve yapay zeka devrimi."
        },
        {
          id: "tue-5",
          start: "16:00",
          end: "18:00",
          title: "Drive Time 100.5",
          host: "Berk Sarı",
          category: "Müzik & Eğlence",
          tag: "Hit Music",
          description: "Günün en çok dinlenen hit parçaları ve dinleyici istekleri."
        },
        {
          id: "tue-6",
          start: "18:00",
          end: "20:00",
          title: "Kitap Kurdu & Edebiyat Masası",
          host: "Selin Doğan",
          category: "Kültür-Sanat",
          tag: "Edebiyat",
          description: "Haftanın kitap önerileri, yazar röportajları ve şiir dinletileri."
        },
        {
          id: "tue-7",
          start: "20:00",
          end: "22:00",
          title: "Metal Fırtınası",
          host: "Kaan Arslan",
          category: "Müzik",
          tag: "Heavy Metal",
          description: "Hard rock ve heavy metal dünyasının başyapıtları ve yeraltı sahnesinden sert riffler."
        },
        {
          id: "tue-8",
          start: "22:00",
          end: "00:00",
          title: "Gece Mavisi: Blues Ekspresi",
          host: "Bülent Erdem",
          category: "Müzik",
          tag: "Blues",
          description: "Delta blues'tan modern elektrik blues'a ruhu dinlendiren gece yolculuğu."
        },
        {
          id: "tue-9",
          start: "00:00",
          end: "08:00",
          title: "Radyo A Gece Nöbeti",
          host: "Radyo A Otomasyon",
          category: "Müzik",
          tag: "Chillout",
          description: "Kesintisiz gece yayını."
        }
      ]
    },
    {
      id: "carsamba",
      dayIndex: 3,
      name: "Çarşamba",
      short: "Çar",
      programs: [
        {
          id: "wed-1",
          start: "08:00",
          end: "10:00",
          title: "Gündoğumu & Sabah Kahvesi",
          host: "Deniz Yılmaz & Caner Kurt",
          category: "Müzik & Sohbet",
          tag: "Gündem",
          description: "Haftanın ortasında yüksek enerji, günlük gazete turları ve neşeli şarkılar."
        },
        {
          id: "wed-2",
          start: "10:00",
          end: "12:00",
          title: "Spor Kampüsü",
          host: "Mert Çetin",
          category: "Spor",
          tag: "Üniversite Ligi",
          description: "Eskişehirspor gündemi, üniversiteler arası lig karşılaşmaları ve öğrenci spor kulüpleri."
        },
        {
          id: "wed-3",
          start: "12:00",
          end: "14:00",
          title: "90'lar & 2000'ler Nostalji",
          host: "Aylin Koç",
          category: "Müzik",
          tag: "Nostalji",
          description: "Gençliğimizin şarkıları, kaset dönemi pop klasikleri ve unutulmayan video klip anıları."
        },
        {
          id: "wed-4",
          start: "14:00",
          end: "16:00",
          title: "Akademik Perspektif",
          host: "Dr. Nilgün Vural",
          category: "Akademi & Bilim",
          tag: "Röportaj",
          description: "Anadolu Üniversitesi'nin değerli hocalarıyla bilim, sosyoloji ve felsefe sohbetleri."
        },
        {
          id: "wed-5",
          start: "16:00",
          end: "18:00",
          title: "Drive Time 100.5",
          host: "Berk Sarı",
          category: "Müzik & Eğlence",
          tag: "Hit Music",
          description: "Trafik bilgileri, sıcak haberler ve dinleyici oylamalarıyla şekillenen yayın."
        },
        {
          id: "wed-6",
          start: "18:00",
          end: "20:00",
          title: "Elektronik Ritimler: Sound of Eskişehir",
          host: "DJ Furkan Öz",
          category: "Müzik",
          tag: "Electronic / House",
          description: "Deep house, synthwave ve melodik tekno ile akşama geçiş ritmi."
        },
        {
          id: "wed-7",
          start: "20:00",
          end: "22:00",
          title: "Top 20 Anadolu Listesi",
          host: "İrem & Caner",
          category: "Müzik",
          tag: "Geri Sayım",
          description: "Öğrencilerin oylarıyla belirlenen haftanın en popüler 20 şarkısı geri sayımı."
        },
        {
          id: "wed-8",
          start: "22:00",
          end: "00:00",
          title: "Gece Seyri: Yıldızların Altında",
          host: "Zeynep Çelik",
          category: "Müzik & Şiir",
          tag: "Gece Kuşağı",
          description: "Romantik melodiler ve sakin piyano tınıları."
        },
        {
          id: "wed-9",
          start: "00:00",
          end: "08:00",
          title: "Radyo A Gece Nöbeti",
          host: "Radyo A Otomasyon",
          category: "Müzik",
          tag: "Chillout",
          description: "Kesintisiz gece yayını."
        }
      ]
    },
    {
      id: "persembe",
      dayIndex: 4,
      name: "Perşembe",
      short: "Per",
      programs: [
        {
          id: "thu-1",
          start: "08:00",
          end: "10:00",
          title: "Gündoğumu & Sabah Kahvesi",
          host: "Deniz Yılmaz & Caner Kurt",
          category: "Müzik & Sohbet",
          tag: "Gündem",
          description: "Eskişehir'den neşeli sabah melodileri ve günün olayları."
        },
        {
          id: "thu-2",
          start: "10:00",
          end: "12:00",
          title: "Tiyatro & Sahne Sanatları",
          host: "Devlet Konservatuvarı Temsilcileri",
          category: "Kültür-Sanat",
          tag: "Tiyatro",
          description: "Eskişehir Şehir Tiyatroları oyunları, prömiyerler ve oyuncu röportajları."
        },
        {
          id: "thu-3",
          start: "12:00",
          end: "14:00",
          title: "Funk & Soul Kulübü",
          host: "Okan Kaya",
          category: "Müzik",
          tag: "Groove",
          description: "70'lerin funk ritimleri, Motown efsaneleri ve içinizi ısıtacak groove melodiler."
        },
        {
          id: "thu-4",
          start: "14:00",
          end: "16:00",
          title: "Yurt Dışı & Erasmus Günlüğü",
          host: "Gamze Yıldırım",
          category: "Gençlik & Eğitim",
          tag: "Erasmus",
          description: "Erasmus öğrencilerinin deneyimleri, değişim programları ve dünya üniversitelerinden anekdotlar."
        },
        {
          id: "thu-5",
          start: "16:00",
          end: "18:00",
          title: "Drive Time 100.5",
          host: "Berk Sarı",
          category: "Müzik & Eğlence",
          tag: "Hit Music",
          description: "En popüler yerli ve yabancı hit parçalar."
        },
        {
          id: "thu-6",
          start: "18:00",
          end: "20:00",
          title: "İstek Hattı Canlı",
          host: "Selin & Emre",
          category: "İnteraktif",
          tag: "Canlı İstek",
          description: "Web sitemizden ve WhatsApp hattından gelen şarkı istekleri ve anonslar."
        },
        {
          id: "thu-7",
          start: "20:00",
          end: "22:00",
          title: "Progresif Rock Saati",
          host: "Oğuz Karahan",
          category: "Müzik",
          tag: "Prog Rock",
          description: "Pink Floyd, Genesis, King Crimson ve modern saykodelik dünyadan başyapıtlar."
        },
        {
          id: "thu-8",
          start: "22:00",
          end: "00:00",
          title: "Gece Seyri: Radyo Tiyatrosu",
          host: "İletişim Bilimleri Arşivi",
          category: "Kültür-Sanat",
          tag: "Radyo Oyunu",
          description: "Anadolu Üniversitesi stüdyolarında seslendirilmiş tarihi radyo tiyatrosu kayıtları."
        },
        {
          id: "thu-9",
          start: "00:00",
          end: "08:00",
          title: "Radyo A Gece Nöbeti",
          host: "Radyo A Otomasyon",
          category: "Müzik",
          tag: "Chillout",
          description: "Kesintisiz gece yayını."
        }
      ]
    },
    {
      id: "cuma",
      dayIndex: 5,
      name: "Cuma",
      short: "Cum",
      programs: [
        {
          id: "fri-1",
          start: "08:00",
          end: "10:00",
          title: "Gündoğumu: Hafta Sonu Kapıda!",
          host: "Deniz Yılmaz & Caner Kurt",
          category: "Müzik & Sohbet",
          tag: "Gündem",
          description: "Hafta sonu etkinlik rehberi, Eskişehir konserleri ve hareketli sabah müzikleri."
        },
        {
          id: "fri-2",
          start: "10:00",
          end: "12:00",
          title: "Kampüste Yaşam & Gastronomi",
          host: "Begüm Şahin",
          category: "Yaşam",
          tag: "Kampüs",
          description: "Eskişehir'in tarihi lezzetleri, öğrenci mekanları ve bütçe dostu hafta sonu rotaları."
        },
        {
          id: "fri-3",
          start: "12:00",
          end: "14:00",
          title: "Cuma Cazı",
          host: "Zeynep Çelik",
          category: "Müzik",
          tag: "Jazz",
          description: "Miles Davis'ten John Coltrane'e, Türk cazının ustalarından genç trompetçilere özel seçki."
        },
        {
          id: "fri-4",
          start: "14:00",
          end: "16:00",
          title: "Geleceğin Medyası: Dijital Dönüşüm",
          host: "Doç. Dr. Kerem Balcı",
          category: "Teknoloji",
          tag: "Yeni Medya",
          description: "Podcast dünyası, dijital yayıncılık, yapay zeka ve ses mühendisliği sohbetleri."
        },
        {
          id: "fri-5",
          start: "16:00",
          end: "18:00",
          title: "Hafta Sonu Başlıyor! (Weekend Warmup)",
          host: "Berk Sarı & DJ Furkan",
          category: "Müzik & Eğlence",
          tag: "Party Vibes",
          description: "Cuma akşamının coşkusu, dans müziği, mashup'lar ve dinamik miksler."
        },
        {
          id: "fri-6",
          start: "18:00",
          end: "21:00",
          title: "Radyo A Canlı Konser Stüdyosu",
          host: "Canlı Yayın Ekibi",
          category: "Canlı Yayın",
          tag: "Konser",
          description: "Anadolu Üniversitesi Atatürk Kültür Merkezi'nden canlı konser aktarımları ve canlı akustik."
        },
        {
          id: "fri-7",
          start: "21:00",
          end: "00:00",
          title: "Friday Night Club Sessions",
          host: "Konuk DJ'ler",
          category: "Müzik",
          tag: "Club & Dance",
          description: "Türkiye'den ve dünyadan üniversite radyolarına özel hazırlanan setler."
        },
        {
          id: "fri-8",
          start: "00:00",
          end: "08:00",
          title: "Radyo A Gece Nöbeti",
          host: "Radyo A Otomasyon",
          category: "Müzik",
          tag: "Chillout",
          description: "Kesintisiz gece yayını."
        }
      ]
    },
    {
      id: "cumartesi",
      dayIndex: 6,
      name: "Cumartesi",
      short: "Cmt",
      programs: [
        {
          id: "sat-1",
          start: "09:00",
          end: "11:00",
          title: "Hafta Sonu Keyfi: Uyanış",
          host: "Gökhan Demir",
          category: "Müzik",
          tag: "Akustik",
          description: "Cumartesi sabahını tatlandıran akustik şarkılar, kahve sohbetleri ve Eskişehir bülteni."
        },
        {
          id: "sat-2",
          start: "11:00",
          end: "13:00",
          title: "Çizgi Roman & Geek Evreni",
          host: "Tolga & Ceren",
          category: "Kültür-Sanat",
          tag: "Pop Kültür",
          description: "Video oyunları, anime, fantastik kurgu, Marvel/DC evreni ve masaüstü oyunları."
        },
        {
          id: "sat-3",
          start: "13:00",
          end: "15:00",
          title: "Akdeniz Rüzgarı & Flamenko",
          host: "Selin Doğan",
          category: "Müzik",
          tag: "Latin",
          description: "İspanyol gitarı, flamenko tutkusu ve Akdeniz sahillerinin sıcacık melodileri."
        },
        {
          id: "sat-4",
          start: "15:00",
          end: "18:00",
          title: "Dünya Listeleri & Billboard 100",
          host: "Caner Kurt",
          category: "Müzik",
          tag: "Global Hits",
          description: "Birleşik Krallık, ABD ve Avrupa müzik listelerindeki son tırmanışlar."
        },
        {
          id: "sat-5",
          start: "18:00",
          end: "21:00",
          title: "Cumartesi Partisi: 80'ler Disko",
          host: "DJ Mert & Berk",
          category: "Müzik & Nostalji",
          tag: "80s Disco",
          description: "Funk, disko ve synthwave ile cumartesi gecesine retro dans enerjisi."
        },
        {
          id: "sat-6",
          start: "21:00",
          end: "00:00",
          title: "Underground Sessions",
          host: "DJ Furkan Öz",
          category: "Müzik",
          tag: "Underground",
          description: "Techno, progressive house ve indie dance."
        },
        {
          id: "sat-7",
          start: "00:00",
          end: "09:00",
          title: "Gece Nöbeti",
          host: "Radyo A Otomasyon",
          category: "Müzik",
          tag: "Chillout",
          description: "Kesintisiz gece yayını."
        }
      ]
    },
    {
      id: "pazar",
      dayIndex: 0,
      name: "Pazar",
      short: "Paz",
      programs: [
        {
          id: "sun-1",
          start: "09:00",
          end: "11:00",
          title: "Pazar Pazar Klasik Müzik",
          host: "Dr. Selçuk Tuna",
          category: "Müzik",
          tag: "Klasik Müzik",
          description: "Bach'tan Mozart'a, Chopin'den İdil Biret kayıtlarına pazar sabahına dinginlik katan senfoniler."
        },
        {
          id: "sun-2",
          start: "11:00",
          end: "13:00",
          title: "Eskişehir'in Belleği: Kent Kültürü",
          host: "Tarih & Kültür Kulübü",
          category: "Kültür-Sanat",
          tag: "Tarih",
          description: "Odunpazarı evleri, Frig Vadisi, Lületaşı sanatı ve Eskişehir'in köklü tarihi."
        },
        {
          id: "sun-3",
          start: "13:00",
          end: "15:00",
          title: "Radyo A Unplugged",
          host: "Ece Demir",
          category: "Müzik",
          tag: "Akustik",
          description: "En sevilen Türkçe ve yabancı şarkıların akustik ve canlı stüdyo kayıtları."
        },
        {
          id: "sun-4",
          start: "15:00",
          end: "18:00",
          title: "Haftanın Özeti & İstekler",
          host: "Tüm Radyo A Ekibi",
          category: "İnteraktif",
          tag: "İstek Saati",
          description: "Haftanın en çok dinlenen parçaları ve dinleyicilerimizin mesajları."
        },
        {
          id: "sun-5",
          start: "18:00",
          end: "20:00",
          title: "Reggae & Ada Esintileri",
          host: "Okan Kaya",
          category: "Müzik",
          tag: "Reggae",
          description: "Bob Marley'den modern dub ve ska ritimlerine huzurlu pazar akşamı."
        },
        {
          id: "sun-6",
          start: "20:00",
          end: "22:00",
          title: "Anadolu Ozanları & Türküler",
          host: "Kemal Usta",
          category: "Geleneksel Müzik",
          tag: "Halk Müziği",
          description: "Aşık Veysel, Neşet Ertaş, Ruhi Su ve çağdaş halk müziği yorumcuları."
        },
        {
          id: "sun-7",
          start: "22:00",
          end: "00:00",
          title: "Pazar Gecesi Hüzünleri",
          host: "Zeynep Çelik",
          category: "Müzik",
          tag: "Slow & Melancholy",
          description: "Yeni haftaya hazırlanırken sakinleştirici piyano ve yaylılar."
        },
        {
          id: "sun-8",
          start: "00:00",
          end: "08:00",
          title: "Radyo A Gece Nöbeti",
          host: "Radyo A Otomasyon",
          category: "Müzik",
          tag: "Chillout",
          description: "Kesintisiz gece yayını."
        }
      ]
    }
  ]
};

/**
 * Şu anki saat ve güne göre yayında olan programı bulur
 */
export function getCurrentProgram() {
  const now = new Date();
  const currentDayIndex = now.getDay(); // 0: Pazar, 1: Pazartesi ...
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const dayObj = SCHEDULE_DATA.days.find(d => d.dayIndex === currentDayIndex) || SCHEDULE_DATA.days[0];

  for (let i = 0; i < dayObj.programs.length; i++) {
    const prog = dayObj.programs[i];
    const [startH, startM] = prog.start.split(':').map(Number);
    const [endH, endM] = prog.end.split(':').map(Number);
    
    let startTotal = startH * 60 + startM;
    let endTotal = endH * 60 + endM;

    // Gece yarısı geçişi (ör: 22:00 - 00:00 veya 00:00 - 08:00)
    if (endTotal === 0) endTotal = 24 * 60;

    if (startTotal > endTotal) {
      // Örn: 22:00 - 02:00
      if (currentMinutes >= startTotal || currentMinutes < endTotal) {
        return {
          program: prog,
          day: dayObj,
          nextProgram: dayObj.programs[(i + 1) % dayObj.programs.length],
          progressPercent: calculateProgress(startTotal, endTotal + 24 * 60, currentMinutes < startTotal ? currentMinutes + 24 * 60 : currentMinutes)
        };
      }
    } else {
      if (currentMinutes >= startTotal && currentMinutes < endTotal) {
        return {
          program: prog,
          day: dayObj,
          nextProgram: dayObj.programs[(i + 1) % dayObj.programs.length],
          progressPercent: calculateProgress(startTotal, endTotal, currentMinutes)
        };
      }
    }
  }

  // Varsayılan fallback
  return {
    program: dayObj.programs[0],
    day: dayObj,
    nextProgram: dayObj.programs[1],
    progressPercent: 45
  };
}

function calculateProgress(start, end, current) {
  const total = end - start;
  if (total <= 0) return 50;
  const elapsed = current - start;
  const percent = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  return percent;
}
