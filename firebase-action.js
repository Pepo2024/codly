// firebase-action.js
import { db, collection, addDoc, onSnapshot, query, orderBy, limit } from './firebase-config.js';

const contactForm = document.getElementById('contactForm');
const tickerTrack = document.getElementById('ticker-track');

// 1. إرسال البيانات للفايربيس عند الضغط على إرسال
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameInput = contactForm.querySelector('input[type="text"]');
        const emailInput = contactForm.querySelector('input[type="email"]');
        const messageInput = contactForm.querySelector('textarea');
        const submitBtn = contactForm.querySelector('.submit-btn');
        
        const ratingInput = contactForm.querySelector('input[name="rating"]:checked');
        const ratingValue = ratingInput ? parseInt(ratingInput.value) : 5;

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'جاري الإرسال...';
        submitBtn.disabled = true;

        try {
            // فحص وجود دوال Firebase الأساسية
            if (typeof addDoc !== 'function' || typeof collection !== 'function') {
                throw new Error('Firebase غير مهيأ بشكل صحيح. تأكد من firebase-config.js');
            }

            // محاولة الإرسال
            const docRef = await addDoc(collection(db, "messages"), {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value,
                rating: ratingValue,
                timestamp: new Date()
            });

            console.log('تم الإرسال بنجاح. معرف المستند:', docRef.id);

            // تفريغ الحقول يدوياً
            nameInput.value = '';
            emailInput.value = '';
            messageInput.value = '';
            
            const allRatingInputs = contactForm.querySelectorAll('input[name="rating"]');
            allRatingInputs.forEach(input => input.checked = false);

            submitBtn.textContent = 'تم الإرسال! ✓';
            submitBtn.style.backgroundColor = '#10b981';

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 2000);

        } catch (error) {
            console.error('خطأ في الإرسال:', error);
            
            // عرض رسالة خطأ أكثر تفصيلاً
            let errorMsg = 'خطأ في الإرسال!';
            if (error.message.includes('permission-denied')) {
                errorMsg = 'صلاحية غير كافية. راجع قواعد Firebase.';
            } else if (error.message.includes('network')) {
                errorMsg = 'مشكلة في الاتصال بالإنترنت.';
            }
            
            submitBtn.textContent = errorMsg;
            submitBtn.style.backgroundColor = '#ef4444';

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}

// 2. جلب التعليقات لحظياً (Real-time) وعرضها في الشريط
if (tickerTrack) {
    const q = query(collection(db, "messages"), orderBy("timestamp", "desc"), limit(10));
    
    onSnapshot(q, (snapshot) => {
        tickerTrack.innerHTML = ''; 
        
        if (snapshot.empty) {
            tickerTrack.innerHTML = '<div class="ticker-item glass-box">لا توجد رسائل حتى الآن. كن أول من يتواصل معنا!</div>';
            return;
        }

        let itemsHTML = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            const rating = data.rating || 5; 
            
            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    starsHTML += '<i class="fas fa-star active-star"></i>';
                } else {
                    starsHTML += '<i class="far fa-star inactive-star"></i>';
                }
            }

            itemsHTML += `
                <div class="ticker-item glass-box">
                    <div class="ticker-header">
                        <strong>${data.name}</strong>
                        <div class="ticker-stars">${starsHTML}</div>
                    </div>
                    <p>${data.message}</p>
                </div>
            `;
        });

        tickerTrack.innerHTML = itemsHTML; 
    });
}