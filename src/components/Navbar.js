import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { onAuthStateChanged } from 'firebase/auth'; // لمراقبة تغييرات حالة المستخدم
import { getDoc, doc } from 'firebase/firestore'; // استيراد الوظائف المطلوبة من Firestore
import { auth, db } from '../firebase'; // تأكد من استيراد auth و db من ملف firebase

const Navbar = ({ cartCount, toggleCart }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Shop
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/track-shipment">Track Shipment</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
      <button className="cart-btn" onClick={toggleCart}>
        Cart ({cartCount})
      </button>
    </nav>
  );
};

export default Navbar;
