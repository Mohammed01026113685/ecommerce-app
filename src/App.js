import React, { useState, createContext, useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import TrackShipment from "./pages/TrackShipment ";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/Dashboard"; // لوحة التحكم
import "./App.css";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // لاستعراض حالة المستخدم

// إنشاء سياق لتخزين حالة المستخدم
const UserContext = createContext();

const App = () => {
  const [cart, setCart] = useState([]); // حالة لسلة التسوق
  const [isCartOpen, setCartOpen] = useState(false); // حالة السليدر
  const [user, setUser] = useState(null); // حالة لتخزين المستخدم
  const [loading, setLoading] = useState(true); // حالة لتحميل بيانات المستخدم

  // وظيفة لإضافة المنتج إلى السلة
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // وظيفة لإزالة المنتج من السلة
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // التحقق من حالة المستخدم (هل هو مسجل دخول أو لا)
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // تعيين المستخدم في حالة "user"
      setLoading(false); // بعد التحقق من المستخدم، يمكننا إيقاف حالة التحميل
    });
    return () => unsubscribe(); // تنظيف الاشتراك بعد فك التوصيل
  }, []);

  // توفير السياق (Context) لبقية التطبيق
  if (loading) {
    return <div>Loading...</div>; // شاشة تحميل أثناء التحقق من حالة المستخدم
  }

  return (
    <UserContext.Provider value={user}>
      <Router>
        {/* Navbar مع زر للسلة */}
        <Navbar cartCount={cart.length} toggleCart={() => setCartOpen(!isCartOpen)} />

        {/* سليدر سلة التسوق */}
        {isCartOpen && (
          <div className="cart-slider">
            <div className="cart-header">
              <h2>Your Cart</h2>
              <button className="close-btn" onClick={() => setCartOpen(false)}>
                ✕
              </button>
            </div>
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <img src={item.imageUrl} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <p>Price: ${item.price.toFixed(2)}</p>
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              ))
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>
        )}

        {/* مسارات الصفحة */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
          <Route path="/track-shipment" element={<TrackShipment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={user && user?.email == "admin@example.com" ? (
              <AdminDashboard />
            ) : (
              <AdminDashboard />
            )}
          />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); // استخدام السياق لاستخراج حالة المستخدم

export default App;
