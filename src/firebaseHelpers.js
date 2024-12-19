import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// دالة لإضافة مستخدم جديد
export const addUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, "users"), userData);
    console.log("User added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding user: ", error);
  }
};

// دالة لجلب المستخدمين حسب الدور (عميل أو إدمن)
export const fetchUsers = async (role) => {
  try {
    const q = query(collection(db, "users"), where("role", "==", role));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching users: ", error);
  }
};
