// ==========================================
// 1. إعدادات GSAP (أنيميشن ظهور العناصر)
// ==========================================
// ده بيخلي الكلام ينزل من فوق لتحت بشفافية أول ما الموقع يفتح
gsap.from(".hero-title", { duration: 1.5, y: -50, opacity: 0, ease: "power3.out", delay: 0.5 });
gsap.from(".hero-subtitle", { duration: 1.5, y: 50, opacity: 0, ease: "power3.out", delay: 0.8 });
gsap.from(".btn", { duration: 1, scale: 0, opacity: 0, ease: "elastic.out(1, 0.3)", delay: 1.2 });
gsap.from("header", { duration: 1, y: -100, opacity: 0, ease: "power2.out" });

// ==========================================
// 2. إعدادات Three.js (خلفية 3D تفاعلية)
// ==========================================
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();

// إعداد الكاميرا
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// إعداد الريندر (المُصيّر)
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// عمل شكل هندسي (TorusKnot - شكل شبكي معقد)
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
// مادة شبكية بلون الموقع عشان تليق مع الديزاين
const material = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true }); 
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// دالة التحديث المستمر عشان الشكل يلف
function animate() {
    requestAnimationFrame(animate);
    
    // سرعة الدوران
    torusKnot.rotation.x += 0.005;
    torusKnot.rotation.y += 0.005;
    
    renderer.render(scene, camera);
}
animate();


// عشان لو المستخدم غير حجم الشاشة (Responsive Canvas)
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});