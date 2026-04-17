// تسجيل إضافة ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. إعدادات قائمة الموبايل
// ==========================================
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// ==========================================
// 2. إعدادات GSAP (أنيميشن الظهور وحل مشكلة القفز)
// ==========================================
gsap.fromTo(".hero-title", 
    { y: 50, opacity: 0 }, 
    { duration: 1.2, y: 0, opacity: 1, ease: "power3.out", delay: 0.2 }
);
gsap.fromTo(".hero-subtitle", 
    { y: 40, opacity: 0 }, 
    { duration: 1.2, y: 0, opacity: 1, ease: "power3.out", delay: 0.4 }
);
gsap.fromTo(".btn", 
    { y: 30, opacity: 0 }, 
    { duration: 1, y: 0, opacity: 1, ease: "power3.out", delay: 0.6 }
);
gsap.fromTo("header", 
    { y: -50, opacity: 0 }, 
    { duration: 1, y: 0, opacity: 1, ease: "power2.out" }
);

// ==========================================
// 3. إعدادات Three.js (خلفية 3D تفاعلية ومحسنة للموبايل)
// ==========================================
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshBasicMaterial({ 
    color: 0x1E3A8A, // أزرق داكن
    wireframe: true,
    transparent: true,
    opacity: 0.4
}); 
const torusKnot = new THREE.Mesh(geometry, material);

if (window.innerWidth <= 768) {
    torusKnot.scale.set(0.6, 0.6, 0.6);
}

scene.add(torusKnot);

function animate() {
    requestAnimationFrame(animate);
    torusKnot.rotation.x += 0.002;
    torusKnot.rotation.y += 0.002;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (window.innerWidth <= 768) {
        torusKnot.scale.set(0.6, 0.6, 0.6);
    } else {
        torusKnot.scale.set(1, 1, 1);
    }
});

// ==========================================
// 4. تغيير لون الخلفية عند النزول للأسفل (Scroll Effect)
// ==========================================
gsap.to("body", {
    backgroundColor: "#020617", 
    scrollTrigger: {
        trigger: "#about", 
        start: "top 70%",
        end: "top 20%",
        scrub: true 
    }
});

// ==========================================
// 5. إعدادات GSAP ScrollTrigger (أنيميشن الأقسام)
// ==========================================
gsap.utils.toArray('.section-title').forEach(title => {
    gsap.fromTo(title, 
        { y: 50, opacity: 0 },
        {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            duration: 1,
            y: 0,
            opacity: 1,
            ease: "power3.out"
        }
    );
});

gsap.utils.toArray('.about-content, .contact-form-container').forEach(box => {
    gsap.fromTo(box, 
        { y: 60, opacity: 0 },
        {
            scrollTrigger: {
                trigger: box,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            duration: 1,
            y: 0,
            opacity: 1,
            ease: "power3.out"
        }
    );
});

gsap.fromTo('.project-card', 
    { y: 60, opacity: 0 },
    {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        duration: 0.8,
        y: 0,
        opacity: 1,
        ease: "power3.out",
        stagger: 0.2
    }
);

// أنيميشن ناعم لظهور الفوتر
gsap.fromTo('.footer', 
    { y: 50, opacity: 0 },
    {
        scrollTrigger: {
            trigger: '.footer',
            start: "top 90%",
            toggleActions: "play none none reverse"
        },
        duration: 1,
        y: 0,
        opacity: 1,
        ease: "power3.out"
    }
);

// ==========================================
// 6. منع إعادة تحميل الصفحة عند إرسال الفورم
// ==========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        alert('تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا.');
        contactForm.reset(); 
    });
}