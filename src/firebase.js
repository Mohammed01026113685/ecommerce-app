import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, updateDoc } from "firebase/firestore";

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBon7TMjnPt8WWVnrIWVwRXPcJrgpd89T4",
  authDomain: "ecommerce-app-8ef3c.firebaseapp.com",
  projectId: "ecommerce-app-8ef3c",
  storageBucket: "ecommerce-app-8ef3c.firebasestorage.app",
  messagingSenderId: "148323387822",
  appId: "1:148323387822:web:071f232545767e9054a03f",
  measurementId: "G-SRQDJ2DQTX"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// دالة لإنشاء حساب مستخدم جديد
export const registerUser = async (email, password, isAdmin = false) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created successfully:", userCredential.user);

    // إضافة بيانات المستخدم إلى Firestore مع الحقل isAdmin
    const userData = {
      email: email,
      isAdmin: isAdmin, // تحديد ما إذا كان المستخدم أدمن أم لا
    };
    
    await addUserToFirestore(userCredential.user.uid, userData);

    return userCredential.user;
  } catch (error) {
    console.error("Error registering user:", error);
  }
};

// دالة لتسجيل دخول المستخدم
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in successfully:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

// دالة لإضافة مستخدم إلى Firestore
export const addUserToFirestore = async (userId, userData) => {
  try {
    const docRef = await setDoc(doc(db, "users", userId), userData);  // التعديل هنا ليتم تخزين بيانات المستخدم مباشرة باستخدام userId
    console.log("User added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// دالة لتحديث بيانات مستخدم
export const updateUserInFirestore = async (userId, updatedData) => {
  const userRef = doc(db, "users", userId); // الوصول إلى المستخدم باستخدام الـ ID
  try {
    await updateDoc(userRef, updatedData);
    console.log("User updated successfully!");
  } catch (e) {
    console.error("Error updating user: ", e);
  }
};
