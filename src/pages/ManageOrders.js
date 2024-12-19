import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersList = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
    };

    fetchOrders();
  }, []);

  // تعديل حالة الطلب
  const handleChangeOrderStatus = async (id) => {
    const newStatus = prompt("Enter new status (e.g., Pending, Shipped, Delivered):");
    if (newStatus) {
      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      ));
    }
  };

  // حذف طلب
  const handleDeleteOrder = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "orders", id));
      setOrders(orders.filter((order) => order.id !== id));
    }
  };

  return (
    <div>
      <h2>Manage Orders</h2>

      {/* جدول عرض الطلبات */}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Products</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>{order.products.map((product) => `${product.name} (x${product.quantity})`).join(", ")}</td>
              <td>{order.totalPrice}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => handleChangeOrderStatus(order.id)}>Change Status</button>
                <button onClick={() => handleDeleteOrder(order.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOrders;
