import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // استيراد قاعدة البيانات من Firebase
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"; // استيراد الدوال المطلوبة من Firestore

const AddUser = () => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "customer", // قيمة افتراضية هي "عميل"
  });
  const [users, setUsers] = useState([]);

  // دالة للتعامل مع التغييرات في النموذج
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // دالة لإضافة عميل جديد
  const handleAddUser = async (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    try {
      await addDoc(collection(db, "users"), {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });
      alert("User added successfully!");
      setNewUser({ name: "", email: "", role: "customer" }); // مسح النموذج بعد الإضافة
      fetchUsers(); // تحديث قائمة المستخدمين بعد الإضافة
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // دالة لتحميل المستخدمين من Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = [];
      querySnapshot.forEach((doc) => {
        userList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // دالة لحذف عميل
  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      alert("User deleted successfully!");
      fetchUsers(); // تحديث قائمة المستخدمين بعد الحذف
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // تحميل المستخدمين عند تحميل الصفحة
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Add New User</h1>
      <form onSubmit={handleAddUser}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Role</label>
          <select name="role" value={newUser.role} onChange={handleChange}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Add User</button>
      </form>

      <h2>Users List</h2>
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
                <button>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddUser;
