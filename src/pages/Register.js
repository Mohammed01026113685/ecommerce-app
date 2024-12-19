import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase"; // تأكد من استيراد قاعدة البيانات
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // استيراد تنسيق الـ CSS

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // إضافة حقل الاسم
  const [isAdmin, setIsAdmin] = useState(false); // إضافة حالة لتحديد إذا كان المستخدم أدمن
  const [error, setError] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // تسجيل المستخدم في Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // إضافة بيانات المستخدم إلى Firestore مع حقل isAdmin
      await addDoc(collection(db, "users"), {
        email: user.email,
        name: name || "Default Name", // تعيين اسم افتراضي في حال عدم إدخال الاسم
        role: isAdmin ? "admin" : "user", // تحديد الدور بناءً على اختيار المستخدم
        isAdmin: isAdmin, // حفظ حالة الادمن
      });

      // إعادة توجيه المستخدم إلى لوحة التحكم أو الصفحة الرئيسية بعد التسجيل الناجح
      if (isAdmin) {
        navigate("/admin-dashboard"); // توجيه الأدمن إلى لوحة التحكم الخاصة بالأدمن
      } else {
        navigate("/dashboard"); // توجيه المستخدم العادي إلى الصفحة الرئيسية
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("The email address is already in use. Please try with a different email.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Create an Account</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <div className="input-group">
          <label>Name:</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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

        {/* إضافة خانة اختيار للأدمن */}
        <div className="input-group">
          <label>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            {" "}Are you an Admin?
          </label>
        </div>

        {error && <p className="error-message">{error}</p>}
        <button className="register-btn" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
