import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./Home.css";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((product) => product.category === activeCategory);

  const categories = ["all", "electronics", "Phones"];

  const sliderImages = [
    "https://f.nooncdn.com/mpcms/EN0003/assets/baa80a17-8dd6-4e6b-86b6-579e2623b951.png?format=avif",
    "https://f.nooncdn.com/mpcms/EN0003/assets/baa80a17-8dd6-4e6b-86b6-579e2623b951.png?format=avif",
    "https://f.nooncdn.com/mpcms/EN0003/assets/baa80a17-8dd6-4e6b-86b6-579e2623b951.png?format=avif",
  ];

  return (
    <div className="home-container">
      <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <img
                src={image}
                className="d-block w-100"
                alt={`slider-image-${index + 1}`}
              />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <section className="about-us text-center py-4">
        <h2>About Us</h2>
        <p>
          Welcome to Pottery Hub, where tradition meets innovation. Our platform
          empowers craftsmen in Upper Egypt, helping them create unique and
          sustainable pottery products.
        </p>
      </section>

      <section className="categories-section text-center py-4">
        <h2>Browse by Categories</h2>
        <div className="categories d-flex flex-wrap justify-content-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              className={`btn btn-outline-primary ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category === "all" ? "All Products" : category}
            </button>
          ))}
        </div>
      </section>

      <section className="best-products py-4">
        <div className="container">
          <div className="row g-3">
            {filteredProducts.map((product) => (
              <div className="col-12 col-sm-6 col-md-4" key={product.id}>
                <div className="card product-card h-100">
                  <img
                    src={product.imageUrl}
                    className="card-img-top "
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">Price: ${product.price}</p>
                    <p className="card-text">Category: {product.category}</p>
                    <a href={`/product/${product.id}`} className="btn btn-primary">
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reviews-section text-center py-4">
        <h2>Customer Reviews</h2>
        <div className="d-flex flex-column align-items-center gap-3">
          <div className="review-card">
            <p>
              "Amazing products! The craftsmanship is exceptional. Highly
              recommend."
            </p>
            <span>- Ahmed</span>
          </div>
          <div className="review-card">
            <p>"Great experience, the pottery is beautiful and eco-friendly!"</p>
            <span>- Sarah</span>
          </div>
        </div>
      </section>

      <section className="contact-us text-center py-4">
        <h2>Contact Us</h2>
        <p>
          If you have any questions or inquiries, feel free to reach out to us.
        </p>
        <button className="btn btn-primary">Contact Us</button>
      </section>
    </div>
  );
};

export default Home;
