import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc, addDoc } from "firebase/firestore";

const SalesStats = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    quantity: "", // كمية المنتجات التي سيتم إنشاؤها
    imageUrl: "" // إضافة حقل الصورة
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productsSnapshot = await getDocs(productsCollection);
      const productList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  // إضافة منتج جديد
  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.category && newProduct.quantity && newProduct.imageUrl) {
      // تحويل الكمية إلى عدد صحيح
      const quantity = parseInt(newProduct.quantity, 10);
      const newProducts = [];
  
      for (let i = 0; i < quantity; i++) {
        const newProductData = {
          name: `${newProduct.name} - ${i + 1}`, // إضافة رقم لتفريق المنتجات
          price: newProduct.price,
          category: newProduct.category,
          quantity: 1, // كل منتج له وحدة واحدة
          imageUrl: newProduct.imageUrl,
        };
  
        try {
          const docRef = await addDoc(collection(db, "products"), newProductData);
          newProducts.push({ id: docRef.id, ...newProductData }); // إضافة المنتج إلى المصفوفة الجديدة بعد إضافة البيانات
        } catch (error) {
          console.error("Error adding product: ", error);
        }
      }
  
      // تحديث الحالة بعد إضافة كل المنتجات
      setProducts([...products, ...newProducts]);
      setNewProduct({ name: "", price: "", category: "", quantity: "", imageUrl: "" }); // إعادة تعيين الحقول بعد الإضافة
    } else {
      alert("Please fill all fields");
    }
  };
  // تعديل منتج
  const handleEditProduct = async (id) => {
    const newProductName = prompt("Enter new product name:");
    const newProductPrice = prompt("Enter new product price:");
    const newProductCategory = prompt("Enter new product category:");
    const newProductQuantity = prompt("Enter new product quantity:");
    const newProductImageUrl = prompt("Enter new product image URL:");

    if (newProductName && newProductPrice && newProductCategory && newProductQuantity && newProductImageUrl) {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        name: newProductName,
        price: newProductPrice,
        category: newProductCategory,
        quantity: newProductQuantity,
        imageUrl: newProductImageUrl, // تحديث الصورة
      });
      setProducts(products.map((product) =>
        product.id === id ? { ...product, name: newProductName, price: newProductPrice, category: newProductCategory, quantity: newProductQuantity, imageUrl: newProductImageUrl } : product
      ));
    }
  };

  // حذف منتج
  const handleDeleteProduct = async (id) => {
    if (!id) {
      console.error("Product ID is missing.");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        const productRef = doc(db, "products", id);
        await deleteDoc(productRef);
        console.log("Product deleted from Firebase.");
        
        // إعادة تحميل المنتجات بعد الحذف
        const productsCollection = collection(db, "products");
        const productSnapshot = await getDocs(productsCollection);
        const updatedProducts = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(updatedProducts); // تحديث الحالة مع البيانات الجديدة
      } catch (error) {
        console.error("Error deleting product: ", error);
      }
    }
  };
  

  return (
    <div>
      <h2>Product Management</h2>
      
      {/* إضافة منتج جديد */}
      <div>
        <h3>Add New Product</h3>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Product Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Product Category"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
        />
        <input
          type="number"
          placeholder="Product Quantity"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
        />
        <input
          type="text"
          placeholder="Product Image URL"
          value={newProduct.imageUrl}
          onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      {/* جدول المنتجات */}
      <table>
        <thead>
          <tr>
            <th>Image</th>
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
              <td>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                ) : (
                  <p>No image</p>
                )}
              </td>
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
    </div>
  );
};

export default SalesStats;
