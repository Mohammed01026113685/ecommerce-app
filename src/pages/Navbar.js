import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../App"; // استخدام السياق للحصول على حالة المستخدم
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "../firebase";

const Navbar = () => {
  const user = useUser(); // استخراج المستخدم من السياق

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Pottery Hub</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/track-shipment">Track Shipment</Link>
            </li>
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Sign Up</Link>
                </li>
              </>
            ) : (
              <>
                {/* إذا كان المستخدم مسجلاً دخوله */}
                <li className="nav-item">
                  <span className="nav-link text-white">Hello, {user.email}</span>
                </li>
                {user?.email === "admin@example.com" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin Dashboard</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={() => auth.signOut()}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
