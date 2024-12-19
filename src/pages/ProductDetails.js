import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // تأكد أن هذا هو ملف إعداد Firebase الخاص بك
import "./ProductDetails.css";

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams(); // جلب معرف المنتج من عنوان URL
  const [product, setProduct] = useState(null); // حالة لتخزين بيانات المنتج
  const [loading, setLoading] = useState(true); // حالة لتحميل البيانات

  // جلب بيانات المنتج من Firebase
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, "products", id));
        if (productDoc.exists()) {
          const productData = { id: productDoc.id, ...productDoc.data() };

          // التأكد من أن السعر قيمة عددية
          if (typeof productData.price !== "number") {
            productData.price = parseFloat(productData.price); // تحويل السعر إلى رقم إذا كان نصًا
          }

          setProduct(productData);
        } else {
          console.error("Product not found!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>; // شاشة انتظار أثناء تحميل البيانات
  }

  if (!product) {
    return <div className="error">Product not found!</div>; // رسالة خطأ في حال عدم وجود المنتج
  }

  return (
    <div className="product-details">
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} className="product-image" />
      )}
      <div className="product-info">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p className="product-price">Price: ${product.price}</p>
        <button
          className="add-to-cart"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
