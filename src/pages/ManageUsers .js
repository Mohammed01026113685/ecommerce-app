import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleEditUser = async (id) => {
    const newName = prompt("Enter new name:");
    if (newName) {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        name: newName,
      });
      setUsers(users.map((user) => (user.id === id ? { ...user, name: newName } : user)));
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default ManageUsers;
