// استدعاء مكتبات فايربيس من CDN لتعمل مباشرة على المتصفح
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// إعدادات مشروعك
const firebaseConfig = {
  apiKey: "AIzaSyDIc5ZfAqfstHa0UmUgTPDgbgjLwHBj7vQ",
  authDomain: "codly1-1.firebaseapp.com",
  databaseURL: "https://codly1-1-default-rtdb.firebaseio.com",
  projectId: "codly1-1",
  storageBucket: "codly1-1.firebasestorage.app",
  messagingSenderId: "497158450927",
  appId: "1:497158450927:web:192ab8badfce4ed89f751a",
  measurementId: "G-WK8608J3ZK"
};

// تهيئة فايربيس وقاعدة البيانات
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ==========================================
// 1. إرسال البيانات من الفورم إلى Realtime DB
// ==========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // منع إعادة تحميل الصفحة

        // جلب قيم الحقول
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // جلب قيمة التقييم (النجوم)
        const ratingInput = contactForm.querySelector('input[name="rating"]:checked');
        const rating = ratingInput ? parseInt(ratingInput.value) : 5; // الافتراضي 5 لو لم يقم بالاختيار

        // تغيير نص الزر أثناء الإرسال
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "جاري الإرسال...";
        submitBtn.disabled = true;

        try {
            // إنشاء مرجع في قاعدة البيانات باسم 'reviews'
            const reviewsRef = ref(db, 'reviews');
            const newReviewRef = push(reviewsRef); // إنشاء ID فريد للرسالة

            // حفظ البيانات
            await set(newReviewRef, {
                name: name,
                email: email,
                rating: rating,
                message: message,
                timestamp: Date.now() // لحفظ وقت الإرسال وترتيبها لاحقاً
            });

            alert('تم إرسال رسالتك وتقييمك بنجاح! شكراً لك.');
            contactForm.reset(); // تفريغ الحقول

        } catch (error) {
            console.error("خطأ في حفظ البيانات: ", error);
            alert('حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة لاحقاً.');
        } finally {
            // إعادة الزر لحالته الطبيعية
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// ==========================================
// 2. جلب التعليقات وعرضها في شريط المتحرك (Ticker)
// ==========================================
const tickerTrack = document.getElementById('ticker-track');

if (tickerTrack) {
    const reviewsRef = ref(db, 'reviews');

    // دالة onValue تقوم بجلب البيانات وتتحدث تلقائياً (Realtime) عند إضافة أي رسالة جديدة
    onValue(reviewsRef, (snapshot) => {
        const data = snapshot.val();
        tickerTrack.innerHTML = ''; // مسح جملة "جاري التحميل"

        if (data) {
            // تحويل البيانات من كائن (Object) إلى مصفوفة (Array) لسهولة التعامل معها
            const reviewsArray = Object.values(data);
            
            // ترتيب التعليقات من الأحدث للأقدم
            reviewsArray.sort((a, b) => b.timestamp - a.timestamp);

            let allCardsHTML = '';

            // إنشاء الكروت
            reviewsArray.forEach(review => {
                const starsHtml = generateStars(review.rating);
                // استخدام دالة حماية من الـ XSS للهجمات المحتملة
                const safeName = escapeHTML(review.name);
                const safeMessage = escapeHTML(review.message);

                allCardsHTML += `
                    <div class="ticker-item glass-box">
                        <div class="ticker-header">
                            <strong>${safeName}</strong>
                            <div class="ticker-stars">${starsHtml}</div>
                        </div>
                        <p>${safeMessage}</p>
                    </div>
                `;
            });

            // لحل مشكلة توقف الشريط (Ticker)، نقوم بتكرار الكروت مرتين 
            // لكي يستمر شريط الـ CSS Animation في الحركة بشكل لانهائي دون قطع
            tickerTrack.innerHTML = allCardsHTML + allCardsHTML;

        } else {
            // في حال عدم وجود بيانات في القاعدة
            tickerTrack.innerHTML = '<div class="ticker-item glass-box" style="text-align:center;">لا توجد تعليقات حتى الآن. كن أول من يقيّمنا!</div>';
        }
    });
}

// ==========================================
// دوال مساعدة (Helper Functions)
// ==========================================

// دالة لإنشاء نجوم التقييم بناءً على الرقم المتسجل في القاعدة
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star active-star"></i>';
        } else {
            stars += '<i class="fas fa-star inactive-star"></i>';
        }
    }
    return stars;
}

// دالة لحماية الموقع من الأكواد الخبيثة (XSS) إذا حاول أحد كتابة كود في مربع النص
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
