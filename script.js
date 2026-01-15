// OYUN VERİLERİ VE DEĞİŞKENLER
window.map = null; // Başına window. ekleyerek her yerden görünür yaptık ✨
let geoJsonLayer;
let activeQuests = [];
let currentQ = 0;
let score = 0;
let fails = 0;
// Dosyanın en başında olduğundan emin ol tatlım ✨
let timeLeft = 60;
let timerInterval = null; // null olarak başlatıyoruz



// Firebase Modülleri

import { getFirestore, doc, setDoc, collection, addDoc, getDocs, serverTimestamp} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


// Arkadaşının Config Bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyCZRzxA0EYpUrIenflEx79iuVtK523S7tE",
  authDomain: "anadolu-fatihi.firebaseapp.com",
  projectId: "anadolu-fatihi",
  storageBucket: "anadolu-fatihi.firebasestorage.app",
  messagingSenderId: "1022157411540",
  appId: "1:1022157411540:web:ff49dbffa377b5500e9741",
  measurementId: "G-4YS3EGH9SF"
};

// Firebase Başlatma
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Veritabanını başlattık 🗄️

// --- BİLMECELERİ FİREBASE'DEN YÖNETME ---

// 1. Bilmeceleri Veritabanına İlk Kez Yükleme (Veya Güncelleme)
async function saveRiddleToFirebase(sehir, yeniBilmece) {
    try {
        await setDoc(doc(db, "bilmeceler", sehir), {
            text: yeniBilmece
        }, { merge: true });
        console.log(`${sehir} bilmecesi tarihe kazındı! 📜`);
    } catch (e) {
        console.error("Kayıt hatası: ", e);
    }
}

// startGame fonksiyonunun içine ekle ✨
async function loadRiddlesFromFirebase() {
    const querySnapshot = await getDocs(collection(db, "bilmeceler"));
    querySnapshot.forEach((doc) => {
        riddles[doc.id] = doc.data().text; // Database'deki güncel metni listeye al
    });
    console.log("Database'den taze bilmeceler geldi! 📜✨");
}
window.editRiddle = async function(sehir) {
    const yeniBilmece = prompt(`${sehir} için yeni bilmece:`, riddles[sehir]);
    if (yeniBilmece && yeniBilmece !== riddles[sehir]) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            await setDoc(doc(db, "bilmeceler", sehir), { text: yeniBilmece }, { merge: true });
            riddles[sehir] = yeniBilmece;
            alert("Mühür basıldı, bilmece güncellendi! 📜✨");
            openAdminPanel();
        } catch (e) {
            alert("Hata: " + e.message);
        }
    }
};

// --- EKRAN GEÇİŞ FONKSİYONU ---
window.toggleAuth = function() {
    document.getElementById('login-box').classList.toggle('hidden');
    document.getElementById('signup-box').classList.toggle('hidden');
}

// --- KAYIT OLMA (SIGN UP) ---
document.getElementById('btn-signup-submit').addEventListener('click', async () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Birliklere katıldın, Şehzadem! Şimdi giriş yapabilirsin.");
        toggleAuth(); 
    } catch (error) {
        alert("Kayıt Hatası: " + error.message);
    }
});

// --- GİRİŞ YAPMA (LOGIN) FONKSİYONU ---
document.getElementById('btn-login').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // 1. Siyah Perdeyi (Giriş Ekranını) Kökten Kaldır
        document.getElementById('auth-screen').style.display = 'none'; 
        // ZORLAMA: Giriş yapan herkes Fatihtir! ⚔️
        const conquerorRadio = document.querySelector('input[value="conqueror"]');
        if (conquerorRadio) conquerorRadio.checked = true;
        
        // 2. Hikaye Ekranını (Intro) Görünür Yap
        const intro = document.getElementById('intro-screen');
        if(intro) {
            intro.classList.remove('hidden'); // Siyahlık burada gidecek! ✨
        }
        
    } catch (error) {
        alert("Giriş Başarısız: " + error.message);
    }
});


// --- MİSAFİR DEVAM ET ---
document.getElementById('btn-guest').addEventListener('click', () => {
    // 1. Siyah Perdeyi Kaldır
    document.getElementById('auth-screen').style.display = 'none'; 
     // ZORLAMA: Misafirler Şehzade modunda başlar 🏰
    const explorerRadio = document.querySelector('input[value="explorer"]');
    if (explorerRadio) explorerRadio.checked = true;
    // 2. Hikaye Ekranını (Intro) Görünür Yap ✨ (Eksik olan buydu!)
    const intro = document.getElementById('intro-screen');
    if(intro) {
        intro.classList.remove('hidden'); 
    }
    
    alert("Misafir (Şehzade) olarak devam ediliyor...");
});


// Bilmece listesi
const riddles = {
  "Adana": "Türkiye’nin en sıcak illerinden biri olup kebabıyla ünlü il hangisidir?",
  "Adıyaman": "Nemrut Dağı kalıntılarının bulunduğu şehir hangisidir?",
  "Afyonkarahisar": "Lokum ve sucuk üretimiyle ünlü il hangisidir?",
  "Ağrı": "Türkiye’nin en yüksek dağı hangi il sınırları içindedir?",
  "Amasya": "Ferhat ile Şirin efsanesiyle bilinen şehir hangisidir?",
  "Ankara": "Türkiye’nin başkenti neresidir?",
  "Antalya": "Turizmin başkenti olarak bilinen Akdeniz şehri hangisidir?",
  "Artvin": "Karadeniz’in en yeşil ve en yüksek dağlarına sahip şehir hangisidir?",
  "Aydın": "Efes Antik Kenti hangi ilde yer alır?",
  "Balıkesir": "Hem Marmara hem Ege Denizi’ne kıyısı olan il hangisidir?",
  "Bilecik": "Osmanlı Devleti’nin kurulduğu il hangisidir?",
  "Bingöl": "Yüzen adalarıyla ünlü il hangisidir?",
  "Bitlis": "Nemrut Krater Gölü hangi ilde bulunur?",
  "Bolu": "Abant Gölü hangi ilde yer alır?",
  "Burdur": "Salda Gölü hangi ildedir?",
  "Bursa": "İskender kebabının çıktığı, Osmanlı’ya başkentlik yapan şehir hangisidir?",
  "Çanakkale": "Truva Antik Kenti hangi ilde bulunur?",
  "Çankırı": "Tuz mağaralarıyla ünlü il hangisidir?",
  "Çorum": "Leblebisi meşhur il hangisidir?",
  "Denizli": "Pamukkale Travertenleri hangi ilde bulunur?",
  "Diyarbakır": "Kara surları ile ünlü şehir hangisidir?",
  "Edirne": "Mimar Sinan’ın ustalık eseri Selimiye Camisi nerededir?",
  "Elazığ": "Harput Kalesi hangi ilde bulunur?",
  "Erzincan": "Ekşisu Mesire Alanı ve tulumu ile ünlü il hangisidir?",
  "Erzurum": "Palandöken Kayak Merkezi hangi şehirde yer alır?",
  "Eskişehir": "Lületaşı ile ünlü şehir hangisidir?",
  "Gaziantep": "Baklavasıyla ünlü şehir hangisidir?",
  "Giresun": "Kirazın ana vatanı olarak bilinen Karadeniz şehri hangisidir?",
  "Gümüşhane": "Kürtün ve Santa harabeleriyle bilinen il hangisidir?",
  "Hakkari": "Sat Buzul Gölleri hangi ilde yer alır?",
  "Hatay": "Türkiye’nin en güneyindeki şehir hangisidir?",
  "Iğdır": "Ağrı Dağı’nın büyük kısmı hangi il sınırları içindedir?",
  "Isparta": "Gülleriyle ünlü il hangisidir?",
  "İstanbul": "Hem Asya hem Avrupa’da bulunan şehir hangisidir?",
  "İzmir": "Kordon boyu ve Saat Kulesiyle ünlü şehir hangisidir?",
  "Kahramanmaraş": "Dondurmasıyla meşhur il hangisidir?",
  "Karabük": "Safranbolu evleri hangi ilde bulunur?",
  "Karaman": "Türkçenin resmi dil ilan edildiği şehir hangisidir?",
  "Kars": "Ani Harabeleri hangi ilde bulunur?",
  "Kastamonu": "Pastırmasıyla ünlü Karadeniz şehri hangisidir?",
  "Kayseri": "Mantısıyla ünlü Orta Anadolu şehri hangisidir?",
  "Kırıkkale": "MKE fabrikalarıyla bilinen il hangisidir?",
  "Kırklareli": "Dupnisa Mağarası hangi ilde yer alır?",
  "Kırşehir": "Ahi Evran’ın şehri hangisidir?",
  "Kilis": "Cevizli sucuk (oruk) hangi Güneydoğu ilinde meşhurdur?",
  "Kocaeli": "Sanayi başkenti olarak bilinen Marmara şehri hangisidir?",
  "Konya": "Mevlana’nın şehri hangisidir?",
  "Kütahya": "Çinisiyle ünlü şehir hangisidir?",
  "Malatya": "Kayısısı ile meşhur il hangisidir?",
  "Manisa": "Mesir macunu hangi ilde yapılır?",
  "Mardin": "Taş evleriyle ünlü kadim şehir hangisidir?",
  "Muğla": "Bodrum ve Fethiye hangi ilde bulunmaktadır?",
  "Muş": "Lalesi ile ünlü şehir hangisidir?",
  "Nevşehir": "Kapadokya bölgesi hangi il sınırları içindedir?",
  "Niğde": "Aladağlar’ın bir kısmı hangi ilde yer alır?",
  "Ordu": "Fındığıyla ünlü Karadeniz şehri hangisidir?",
  "Osmaniye": "Karatepe Aslantaş açık hava müzesi hangi ilde bulunur?",
  "Rize": "Çayıyla ünlü şehir hangisidir?",
  "Sakarya": "Sapanca Gölü hangi ilde yer alır?",
  "Samsun": "Atatürk’ün 19 Mayıs’ta ayak bastığı şehir hangisidir?",
  "Siirt": "Fıstığıyla bilinen şehir hangisidir?",
  "Sinop": "Türkiye’nin en kuzey noktası hangi ilde bulunur?",
  "Sivas": "Divriği Ulu Camii hangi şehirde yer alır?",
  "Şanlıurfa": "Göbeklitepe hangi ilde bulunur?",
  "Şırnak": "Cudi Dağı hangi ilde yer alır?",
  "Tekirdağ": "Köftesiyle ünlü Marmara şehri hangisidir?",
  "Tokat": "Zile pekmezi hangi ilde ünlüdür?",
  "Trabzon": "Hamsisi ve Uzungölü ile ünlü il hangisidir?",
  "Tunceli": "Munzur Dağları hangi ilde yer alır?",
  "Uşak": "Battaniyesi ve tarhanasıyla ünlü il hangisidir?",
  "Van": "İnci kefali göçü hangi ilde görülür?",
  "Yalova": "Termal kaplıcalarıyla ünlü il hangisidir?",
  "Yozgat": "Çamlığı ile bilinen Orta Anadolu şehri hangisidir?",
  "Zonguldak": "Taş kömürüyle ünlü il hangisidir?"
};

// 1. SAYFA YÜKLENDİĞİNDE HİKAYEYİ YAZDIR


window.onload = function() {
    const btn = document.getElementById('start-btn');
    const storyText = "Yüzyıllardır beklenen an geldi... Kadim Anadolu toprakları, ismini bilen gerçek sahibini arıyor. Kahinin sorularını cevapla, sınırları zihninle çiz. Ama dikkat et, zaman aleyhine işliyor! Hazır mısın?";
    
    const writerElement = document.getElementById('story-writer');
    let i = 0;

    // Daktilo Efekti Fonksiyonu
    function typeWriter() {
        if (i < storyText.length) {
            writerElement.innerHTML += storyText.charAt(i);
            i++;
            setTimeout(typeWriter, 30); // Yazı hızı (ms)
        } else {
            // Hikaye bitince butonu aktifleştir
            if(typeof mapData !== 'undefined') {
                btn.innerText = "SEFERİ BAŞLAT";
                btn.style.boxShadow = "0 0 30px #c5a059";
                btn.disabled = false;
            } else {
                alert("HATA: harita.js bulunamadı!");
            }
        }
    }

    // Başlat
    if(typeof mapData !== 'undefined') {
        typeWriter();
    } else {
        alert("Harita verisi eksik! (harita.js)");
    }
};


function startTimer() {
    console.log("Süreci Başlatıyoruz Komutan! 🔥");
    
    // Eğer çalışan eski bir sayaç varsa durdur ✨
    if (timerInterval) clearInterval(timerInterval);

    timeLeft = 60; 
    const timerElement = document.getElementById('timer');
    if (timerElement) timerElement.innerText = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        if (timerElement) timerElement.innerText = timeLeft;

        // 10 saniye kala heyecan artsın (Blink efekti) 🚨
        const statsBox = document.getElementById('stats');
        if (statsBox && timeLeft <= 10) {
            statsBox.classList.add('emergency-blink');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(true); // Süre dolunca oyunu bitir ✅
        }
    }, 1000);
}


// KONFETİ EFEKTİ
function fireConfetti() {
    const colors = ['#ffd700', '#ff4444', '#00e5ff', '#ffffff'];
    
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.animationDuration = (Math.random() * 1.5 + 1) + 's';
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 2500);
    }
}

// HARİTA OLUŞTURMA
function initMap() {
    // Haritayı window.map'e mühürleyelim ✨
    window.map = L.map('map', { 
        zoomControl: false, 
        minZoom: 5,
        maxBounds: [[35, 25], [43, 46]],
        maxBoundsViscosity: 1.0
    }).setView([39.0, 35.5], 6);

    // Koyu tema isimsiz harita katmanını ekle 🗺️💎
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap & CartoDB'
    }).addTo(window.map);

    // İl sınırlarını ekle
    geoJsonLayer = L.geoJSON(mapData, {
        style: defaultStyle,
        onEachFeature: onEachFeature,
        filter: (f) => f.geometry.type !== "Point" && riddles[f.properties.name]
    }).addTo(window.map);

    // Haritayı zorla çizdirme komutu (invalidateSize) 🪄
    setTimeout(() => {
        window.map.invalidateSize();
    }, 500);
}
function defaultStyle() {
    return {
        fillColor: '#333',
        weight: 1,
        opacity: 1,
        color: '#666',
        fillOpacity: 0.5
    };
}

function onEachFeature(feature, layer) {
    layer.cityName = feature.properties.name;
    layer.isConquered = false;
    
    layer.on('click', () => checkAnswer(layer));

    layer.on('mouseover', function() {
        if (!this.isConquered) {
            this.setStyle({
                weight: 3,
                color: '#c5a059',
                fillColor: '#444',
                fillOpacity: 0.8
            });
            this.bringToFront();
        }
    });

    layer.on('mouseout', function() {
        if (!this.isConquered) {
            geoJsonLayer.resetStyle(this);
        }
    });
}

// CEVAP KONTROLÜ
function checkAnswer(clickedLayer) {
    if (currentQ >= activeQuests.length) return;
    if (clickedLayer.isConquered) return;
    if (timeLeft <= 0) return;

    let targetName = activeQuests[currentQ].name;
    let clickedName = clickedLayer.cityName;

    if (clickedName === targetName) {
        // --- DOĞRU ---
        score++;
        clickedLayer.isConquered = true;

        // Stili değiştir
        clickedLayer.setStyle({
            fillColor: '#ffd700',
            color: '#fff',
            weight: 3,
            fillOpacity: 1
        });
        
        // Animasyon Class'ı ekle
        if(clickedLayer._path) {
            clickedLayer._path.classList.add('conquest-anim');
        }

        // Konfeti patlat
        fireConfetti();

        clickedLayer.bindPopup(`<b style="color:#ffd700; font-size:1.2rem">FETİH BAŞARILI!</b><br>${clickedName}`).openPopup();
        nextTurn();

    } else {
        // --- YANLIŞ ---
        fails++;
        
        clickedLayer.setStyle({
            fillColor: '#ff0000',
            color: '#fff',
            weight: 2,
            fillOpacity: 0.7
        });

        clickedLayer.bindPopup(`<b style="color:#ff4444">YANLIŞ TOPRAK!</b><br>Burası ${clickedName}`).openPopup();

        setTimeout(() => {
            if(!clickedLayer.isConquered) {
                geoJsonLayer.resetStyle(clickedLayer);
                clickedLayer.closePopup();
            }
        }, 1000);


        geoJsonLayer.eachLayer(layer => {
            if (layer.cityName === targetName) {
                layer.setStyle({ color: 'red', weight: 4, dashArray: '10, 10' });
                layer.bringToFront();
                
                setTimeout(() => {
                    if (!layer.isConquered) {
                        geoJsonLayer.resetStyle(layer);
                    } else {
                         layer.setStyle({ color: '#fff', weight: 2, dashArray: '' });
                    }
                }, 1500);
            }
        });

        nextTurn();
    }
}

function nextTurn() {
    currentQ++;
    setTimeout(() => {
        map.closePopup();
        updateUI();
    }, 1500);
}

function updateUI() {
    document.getElementById('score').innerText = score;
    document.getElementById('fail').innerText = fails;

    if (currentQ < activeQuests.length) {
        let txt = document.getElementById('riddle-text');
        txt.style.opacity = 0;
        setTimeout(() => {
            txt.innerText = activeQuests[currentQ].riddle;
            txt.style.opacity = 1;
        }, 300);
    } else {
        endGame(false);
    }
}

function endGame(timeOut = false) {

    if (score > 0) {
        saveScoreToFirebase(score);
    }
    if(timerInterval) clearInterval(timerInterval);

    setTimeout(() => {
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('end-screen').classList.remove('hidden');
        
        let title = "SEFER SONUCU";
        let msg = `Fethedilen: ${score} - Kaybedilen: ${fails}`;

        if (timeOut) {
            title = "⏳ SÜRE DOLDU!";
            msg = `Zaman tükendi! Skorun: ${score}`;
        } else if (score > fails) {
            title = "👑 ZAFER SENİNDİR!";
        } else {
            title = "DAHA ÇOK ÇALIŞMALISIN";
        }

        document.getElementById('end-title').innerText = title;
        document.getElementById('end-msg').innerText = msg;
    }, 500);
   
    setTimeout(() => {
        updateLeaderboardUI(); 
    }, 1000);
}


document.getElementById('btn-guest').addEventListener('click', () => {
    document.getElementById('auth-screen').style.display = 'none'; // Siyah perdeyi kapat
    const intro = document.getElementById('intro-screen');
    if(intro) {
        intro.classList.remove('hidden'); // Hikayeyi göster
    }
    

    const statsDiv = document.getElementById('stats');
    if(statsDiv && !document.getElementById('user-display')) {
        statsDiv.insertAdjacentHTML('afterbegin', `<div id="user-display" style="color:#aaa; font-weight:bold; margin-bottom:5px;">ŞEHZADE: MİSAFİR (Antrenman Modu)</div>`);
    }
});


async function saveScoreToFirebase(finalScore) {
    const user = auth.currentUser;
    if (!user) {
        console.log("Misafir oyuncu, skor kaydedilmedi. 🛡️");
        return; 
    }
    try {
        await addDoc(collection(db, "skorlar"), {
            kullanici: user.email,
            skor: finalScore,
            tarih: serverTimestamp()
        });
        console.log("Şehzade skoru tarihe kazındı! 📜");
    } catch (e) {
        console.error("Kayıt hatası: ", e);
    }
}

import { query, orderBy, limit} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


async function getLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = ""; // Temizle

    try {
        const q = query(collection(db, "skorlar"), orderBy("skor", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const name = data.kullanici.split('@')[0].toUpperCase();
            leaderboardList.innerHTML += `<li style="margin-bottom:5px; border-bottom:1px border-bottom:1px solid #333;">👑 ${name} - ${data.skor} Puan</li>`;
        });
    } catch (e) {
        console.error("Tablo çekilemedi: ", e);
        leaderboardList.innerHTML = "<li>Henüz kayıtlı fatih yok.</li>";
    }
}

setTimeout(() => {
    getLeaderboard(); 
}, 1000);


document.getElementById('btn-admin').addEventListener('click', () => {
    const sifre = prompt("Vezir-i Azam şifresini giriniz:");
    if (sifre === "fatih1453") { 
        openAdminPanel();
    } else {
        alert("Destur! Şifre hatalıdır.");
    }
});

function openAdminPanel() {
    document.getElementById('admin-panel').classList.remove('hidden');
    const listContainer = document.getElementById('admin-riddle-list');
    listContainer.innerHTML = ""; 


    Object.keys(riddles).forEach(sehir => {
        listContainer.innerHTML += `
            <div style="border-bottom: 1px solid #333; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <b style="color: #c5a059;">${sehir}:</b> 
                    <span style="font-size: 0.8rem; color: #aaa;">${riddles[sehir]}</span>
                </div>
                <button onclick="editRiddle('${sehir}')" style="padding: 5px 10px; font-size: 0.7rem; border-color: #ffd700; color: #ffd700;">DÜZENLE</button>
            </div>
        `;
    });
}

window.editRiddle = function(sehir) {
    const yeniBilmece = prompt(`${sehir} için yeni bilmeceyi girin:`, riddles[sehir]);
    if (yeniBilmece) {
        riddles[sehir] = yeniBilmece; 
        openAdminPanel(); 
        alert(`${sehir} bilgeliği güncellendi!`);
    }
};

window.closeAdminPanel = function() {
    document.getElementById('admin-panel').classList.add('hidden');
};


async function setupDatabase() {
    console.log("Database inşası başlıyor... 🏗️");
    for (const sehir in riddles) {
        try {
            await setDoc(doc(db, "bilmeceler", sehir), {
                text: riddles[sehir]
            });
            console.log(`${sehir} yüklendi! ✅`);
        } catch (e) {
            console.error("Hata oluştu: ", e);
        }
    }
    alert("Vezir-i Azam, tüm bilmeceler veritabanına nakşedildi! 📜");
}

async function updateLeaderboardUI() {
    const leaderboardList = document.getElementById('leaderboard-list');
    if (!leaderboardList) return;
    
    leaderboardList.innerHTML = "<li>Destanlar yükleniyor...</li>";

    try {

        const q = query(collection(db, "skorlar"), orderBy("skor", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        
        leaderboardList.innerHTML = ""; 
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const name = data.kullanici ? data.kullanici.split('@')[0].toUpperCase() : "FATİH";
            leaderboardList.innerHTML += `
                <li style="margin-bottom:8px; padding:5px; border-bottom:1px solid #333; list-style:none;">
                    👑 <span style="color:#ffd700">${name}</span>: <b>${data.skor} Puan</b>
                </li>`;
        });
        
        if (leaderboardList.innerHTML === "") {
            leaderboardList.innerHTML = "<li>Henüz bu topraklarda destan yazılmadı...</li>";
        }
    } catch (e) {
        console.error("Tablo hatası: ", e);
        leaderboardList.innerHTML = "<li>Sultan meclisi toplanamadı.</li>";
    }
}


const originalUpdateUI = updateUI; 
updateUI = function() {
    originalUpdateUI(); 
    
    const statsBox = document.getElementById('stats');
    if (statsBox) {
        const timerRow = statsBox.querySelector('div:first-child');

        if (window.currentGameMode === "explorer" && timerRow && timerRow.innerHTML.includes('⏳')) {
            timerRow.style.display = 'none'; 
        } else if (timerRow) {
            timerRow.style.display = 'block';
        }
    }
};

window.editRiddle = async function(sehir) {
    const eskiMetin = riddles[sehir] || "";
    const yeniBilmece = prompt(`${sehir} için yeni bilmeceyi girin:`, eskiMetin);
    
    if (yeniBilmece && yeniBilmece !== eskiMetin) {
        try {
            console.log(`${sehir} için mühür basılıyor... 🚀`);
            

            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            

            await setDoc(doc(db, "bilmeceler", sehir), {
                text: yeniBilmece
            }, { merge: true });

            riddles[sehir] = yeniBilmece; 
            console.log("Firestore BAŞARILI! ✅");
            alert(`${sehir} bilmecesi veritabanında güncellendi Sultanım! ✨`);
            
            if (typeof openAdminPanel === "function") openAdminPanel();
            
        } catch (error) {
            console.error("Hata Detayı:", error);
            alert("Mühür basılamadı! Sebep: " + error.message);
        }
    }
};

console.log(" final yamaları başarıyla yüklendi! 🏰🛡️✨");


const assignmentData = {
    "MARMARA": ["İstanbul", "Edirne", "Kırklareli", "Tekirdağ", "Çanakkale", "Kocaeli", "Yalova", "Sakarya", "Bilecik", "Bursa", "Balıkesir"],
    "EGE": ["İzmir", "Aydın", "Muğla", "Manisa", "Denizli", "Uşak", "Kütahya", "Afyonkarahisar"],
    "İÇ ANADOLU": ["Ankara", "Konya", "Kayseri", "Eskişehir", "Sivas", "Kırıkkale", "Aksaray", "Karaman", "Kırşehir", "Niğde", "Nevşehir", "Yozgat", "Çankırı"],
    "AKDENİZ": ["Antalya", "Adana", "Mersin", "Hatay", "Isparta", "Burdur", "Osmaniye", "Kahramanmaraş"],
    "KARADENİZ": ["Trabzon", "Rize", "Artvin", "Giresun", "Ordu", "Samsun", "Sinop", "Kastamonu", "Zonguldak", "Bartın", "Karabük", "Düzce", "Bolu", "Tokat", "Amasya", "Gümüşhane", "Bayburt", "Çorum"],
    "DOĞU ANADOLU": ["Erzurum", "Erzincan", "Kars", "Ardahan", "Iğdır", "Ağrı", "Van", "Bitlis", "Muş", "Bingöl", "Tunceli", "Hakkari", "Elazığ", "Malatya"],
    "GÜNEYDOĞU ANADOLU": ["Gaziantep", "Diyarbakır", "Şanlıurfa", "Mardin", "Adıyaman", "Kilis", "Siirt", "Şırnak", "Batman"]
};

window.setRegion = function(region) {
    window.selectedRegion = region;
    console.log(`Hedef Bölge Kaydedildi: ${region} 🏹`);
    
    // Butonları sadece görsel olarak işaretle ✨
    document.querySelectorAll('.region-buttons button').forEach(btn => {
        btn.style.border = btn.innerText.includes(region) ? "2px solid #ffd700" : "1px solid #333";
    });
};


window.repairMapDisplay = function() {
    if (window.map) {
        console.log("Harita Sultanın emriyle canlandırılıyor... 🪄");
        window.map.invalidateSize(); 
        window.map.setView([39.0, 35.5], 6); 
    }
};


window.startGame = async function() {
    console.log("Sefer emri verildi! ⚔️");


    if (!window.map) {
        initMap();
    }

  
    await loadRiddlesFromFirebase();

    let features = mapData.features.filter(f => f.geometry.type !== 'Point' && riddles[f.properties.name]);
    
    if (window.selectedRegion && window.selectedRegion !== "TÜMÜ" && typeof assignmentData !== 'undefined') {
        const allowed = assignmentData[window.selectedRegion];
        if (allowed) {
            features = features.filter(f => allowed.includes(f.properties.name));
        }
    }

 
    activeQuests = features.map(f => ({
        name: f.properties.name,
        riddle: riddles[f.properties.name]
    })).sort(() => Math.random() - 0.5);

 
    if (activeQuests.length === 0) {
        activeQuests = mapData.features
            .filter(f => f.geometry.type !== 'Point' && riddles[f.properties.name])
            .map(f => ({ name: f.properties.name, riddle: riddles[f.properties.name] }))
            .sort(() => Math.random() - 0.5);
    }

    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');


    currentQ = 0; score = 0; fails = 0;
    updateUI();

    const isConqueror = document.querySelector('input[value="conqueror"]')?.checked;
    if (isConqueror) {
        window.currentGameMode = "conqueror";
        startTimer(); 
    } else {
        window.currentGameMode = "explorer";
    }

   
    setTimeout(() => {
        if (window.map) {
            window.map.invalidateSize();
            window.map.setView([39.0, 35.5], 6);
        }
    }, 400);
};
