import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // إضافة هذا السطر
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
// import "./Login.css"; // استيراد تنسيق الـ CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = getAuth();
  const navigate = useNavigate(); // استخدام useNavigate هنا

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // جلب بيانات المستخدم من Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid)); // استخدم UID الخاص بالمستخدم
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
  
        // التحقق من الدور
        if (userData.role === "admin") {
          navigate("/admin"); // توجيه المستخدم إلى لوحة التحكم
        } else {
          navigate("/"); // توجيه المستخدم إلى الصفحة الرئيسية
        }
      } else {
        setError("User data not found in database.");
      }
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button className="login-btn" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
