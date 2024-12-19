import React, { useState, useEffect } from "react";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./AdminDashboard.css"; // استيراد تنسيقات CSS
import ManageOrders from "./ManageOrders"; // استيراد مكون إدارة الطلبات
import SalesStats from "./SalesStats "; // استيراد مكون إحصائيات المبيعات

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]); // إضافة حالة لتخزين المنتجات
  const [activeSection, setActiveSection] = useState('manageUsers'); // لحفظ القسم النشط في لوحة التحكم

  // جلب المستخدمين من Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };

    fetchUsers();

    // جلب المنتجات من Firestore
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  // تعديل منتج
  const handleEditProduct = async (id) => {
    const newProductName = prompt("Enter new product name:");
    const newProductPrice = prompt("Enter new product price:");
    const newProductCategory = prompt("Enter new product category:");
    const newProductQuantity = prompt("Enter new product quantity:");

    if (newProductName && newProductPrice && newProductCategory && newProductQuantity) {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        name: newProductName,
        price: newProductPrice,
        category: newProductCategory,
        quantity: newProductQuantity
      });
      setProducts(products.map((product) =>
        product.id === id ? { ...product, name: newProductName, price: newProductPrice, category: newProductCategory, quantity: newProductQuantity } : product
      ));
    }
  };

  // حذف منتج
  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  return (
    <div className="dashboard-container">
      {/* شريط جانبي */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => setActiveSection('manageUsers')}>Manage Users</li>
          <li onClick={() => setActiveSection('manageOrders')}>Manage Orders</li>
          <li onClick={() => setActiveSection('salesStats')}>Sales Stats</li>
        </ul>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="main-content">
        <header>
          <h1>Welcome to the Admin Dashboard</h1>
        </header>

        {/* عرض الأقسام بناءً على القسم النشط */}
        {activeSection === 'manageUsers' && (
          <section className="manage-section">
            <h2>Manage Users</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => handleEditUser(user.id)}>Edit</button>
                      <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeSection === 'manageOrders' && <ManageOrders />}
        {/* {activeSection === 'addProduct' && <AddProduct />} */}
        {activeSection === 'salesStats' && <SalesStats />}

        {/* إدارة المنتجات */}
        {activeSection === 'manageProducts' && (
          <section className="manage-section">
            <h2>Manage Products</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <button onClick={() => handleEditProduct(product.id)}>Edit</button>
                      <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
