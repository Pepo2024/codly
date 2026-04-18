// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// قم بتبديل هذه البيانات ببيانات مشروعك من منصة Firebase
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
// تهيئة الفايربيس وقاعدة بيانات Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// تصدير الأدوات لاستخدامها في الملفات الأخرى
export { db, collection, addDoc, onSnapshot, query, orderBy, limit };