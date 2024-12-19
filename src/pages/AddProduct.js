import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // إضافة المنتج إلى Firestore
      const productsCollection = collection(db, "products");
      await addDoc(productsCollection, {
        name,
        price,
        category,
        imageUrl
      });
      alert("Product added successfully");
      setName("");
      setPrice("");
      setCategory("");
      setImageUrl("");
    } catch (error) {
      console.error("Error adding product: ", error);
      alert("Failed to add product");
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Product Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Product Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
