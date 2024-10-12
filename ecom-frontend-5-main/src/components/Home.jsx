import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './like.scss'; // Adjust the path as necessary

import { motion } from 'framer-motion';
// import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";
import Loader from "./Loader";
import axios from "../axiosProduct";
const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // const [isLiked, setIsLiked] = useState(false);
  const [likedProducts, setLikedProducts] = useState({});

  // const toggleLike = (productId) => {
  //   setLikedProducts(prev => ({
  //     ...prev,
  //     [productId]: !prev[productId],
  //   }));
  //   updateWishlist(productId);
  // };

  const toggleLike = async (productId) => {
    const currentLiked = likedProducts[productId];
    const newLikedState = !currentLiked;

    setLikedProducts(prev => ({
      ...prev,
      [productId]: newLikedState,
    }));

    await updateWishlist(productId, newLikedState);
  };

  const updateWishlist = async (productId, liked) => {
    try {

      const userId = localStorage.getItem("currentuser"); 
      await axios.post(`/api/wishlist/${userId}`, {
        productId,
        liked
      });
      console.log('Wishlist updated successfully');
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const userId = localStorage.getItem("currentuser"); 
        const response = await axios.get(`/api/wishlist/${userId}`);
        const wishlist = response.data; 

        const initialLikedProducts = {};
        wishlist.forEach(id => {
          initialLikedProducts[id] = true;
        });

        setLikedProducts(initialLikedProducts);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    fetchWishlist();
  }, []);


  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("jwt"); 
    if (!token) {
      console.log("No token found, redirecting to login.");
      navigate("/login"); 
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://172.16.2.211:8080/jwtcheck', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });

      if (!response.ok) {
        console.error("Invalid token, redirecting to login.");
        navigate('/login');
        return;
      }
      setLoading(false);
      const userDetails = await response.json();
      console.log(userDetails);

      const res = await addToCart(product);
      if (res) {
        alert("Product added to cart!");
      } else {
        alert("Out of Stock!");
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched, data]);

  useEffect(() => {
    setLoading(true); 
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `/api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProducts(updatedProducts);
      };

      setTimeout(() => {
        fetchImagesAndUpdateProducts().then(() => {
          setLoading(false); 
        });
      }, 2000); 
    }
  }, [data]);

  if (loading) {
    return <Loader />;
  }

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        <img src={unplugged} alt="Error" style={{ width: '100px', height: '100px' }} />
      </h2>
    );
  }

  return (
    <>
      <div style={{ padding: '1px' }}></div>
      <div
        className="grid"
        style={{
          marginTop: "65px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", 
          padding: "8px",
          gap: "15px", 
        }}
      >
        {filteredProducts.length === 0 ? (
          <h2
            className="text-center"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Loader/> */}
            No Products Available
          </h2>
        ) : (
          filteredProducts.map((product) => {
            const { id, brand, name, price, productAvailable, imageUrl } = product;
            return (
              <div
                className="card mb-3"
                style={{
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: productAvailable ? "#fff" : "#ccc",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "stretch",
                  height: '100%',
                  width: "100%", 
                  maxWidth: "200px",
                }}
                key={id}
              >
                <Link
                  to={`/product/${id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img
                    src={imageUrl}
                    alt={name}
                    style={{
                      width: "100%",
                      height: "90px", 
                      objectFit: "cover",
                      padding: "5px",
                      margin: "0",
                      borderRadius: "10px 10px 0 0", 
                    }}
                  />
                </Link>

                <hr className="hr-line" style={{ margin: "10px 0" }} />
                <div
                  className="card-body"
                  style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "10px",
                  }}
                >
                  <div>
                    <div>

                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>

                        <h5
                          className="card-title"
                          style={{ fontFamily: "Times New Roman", margin: "0 0 1px 0px", fontSize: "1.2rem" }} // Reduced font size
                        >
                          {name}
                          {/* {name.toUpperCase()} */}
                        </h5>
                      </div>
                      {/* <div>
                      Hello
                      </div> */}
                      <div className="heart-container" style={{ width: '50%', height: '50%' }}>
                        <input
                          type="checkbox"
                          id={`like-${product.id}`} 
                          checked={likedProducts[product.id] || false}
                          onChange={() => toggleLike(product.id)}
                          style={{ display: 'none' }}
                        />
                        {/* <input type="checkbox" id="like" name="like" style={{ display: 'none' }} /> */}
                        {/* <label htmlFor="like" style={{width:'300%',height:'10px'}}> */}
                        <label htmlFor={`like-${product.id}`} style={{ width: '270%', height: '15px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 189.2 87.507" style={{ overflow: 'visible', height: '50px', width: '50px', cursor: 'pointer' }}>
                            <g id="hearts" transform="translate(-787.902 -454.998)">
                              <g id="right-hearts">
                                <g id="Group_4" data-name="Group 4" opacity="0.484">
                                  <path id="Path_8" data-name="Path 8" d="M36.508,16.436c-3.141,6.041-11.545,14.257-16.3,18.634a1.342,1.342,0,0,1-1.8,0C13.633,30.693,5.229,22.477,2.087,16.436c-6.9-13.29,10.5-22.151,17.21-8.86C26.01-5.715,43.409,3.146,36.508,16.436Z" transform="translate(936.502 486.145)" fill={likedProducts[product.id] ? "red" : "#fff"} />
                                  <path id="Path_9" data-name="Path 9" d="M19.311,37.916a3.836,3.836,0,0,1-2.575-.99l-.013-.012C11.871,32.47,3.229,24.051-.131,17.589A15.428,15.428,0,0,1-2,10.374,12.021,12.021,0,0,1-.282,4.2,11.848,11.848,0,0,1,16.364.456a13.647,13.647,0,0,1,2.934,2.6,13.649,13.649,0,0,1,2.934-2.6A11.848,11.848,0,0,1,38.879,4.2,12.02,12.02,0,0,1,40.6,10.374a15.428,15.428,0,0,1-1.87,7.214A52.812,52.812,0,0,1,30.8,28.07c-3.2,3.482-6.607,6.728-8.9,8.839l-.018.017a3.836,3.836,0,0,1-2.571.99ZM9.864,3.5A6.907,6.907,0,0,0,3.991,6.8c-1.423,2.342-1.311,5.357.315,8.489,1.013,1.948,4.482,7.467,15,17.213,2.172-2.025,5.076-4.836,7.815-7.813a48.2,48.2,0,0,0,7.166-9.4c1.626-3.131,1.738-6.146.315-8.488a6.848,6.848,0,0,0-9.644-2.149A10.185,10.185,0,0,0,21.529,8.7L19.3,13.121,17.066,8.7a10.185,10.185,0,0,0-3.432-4.057A6.906,6.906,0,0,0,9.864,3.5Z" transform="translate(936.502 486.145)" fill={likedProducts[product.id] ? "#64d26d" : "#fff"} />
                                </g>
                                <g id="Group_5" data-name="Group 5" opacity="0.484">
                                  {/* <path style={{color:'red'}} id="Path_10" data-name="Path 10" d="M36.508,16.436c-3.141,6.041-11.545,14.257-16.3,18.634a1.342,1.342,0,0,1-1.8,0C13.633,30.693,5.229,22.477,2.087,16.436c-6.9-13.29,10.5-22.151,17.21-8.86C26.01-5.715,43.409,3.146,36.508,16.436Z" transform="translate(906.04 497.584)" fill={likedProducts[product.id] ? "#64d26d" : "red"} /> */}
                                  <path id="Path_10" data-name="Path 10" d="M36.508,16.436c-3.141,6.041-11.545,14.257-16.3,18.634a1.342,1.342,0,0,1-1.8,0C13.633,30.693,5.229,22.477,2.087,16.436c-6.9-13.29,10.5-22.151,17.21-8.86C26.01-5.715,43.409,3.146,36.508,16.436Z" transform="translate(906.04 497.584)" fill={likedProducts[product.id] ? "red" : "red"} />
                                  <path id="Path_11" data-name="Path 11" d="M19.311,37.916a3.836,3.836,0,0,1-2.575-.99l-.013-.012C11.871,32.47,3.229,24.051-.131,17.589A15.428,15.428,0,0,1-2,10.374,12.021,12.021,0,0,1-.282,4.2,11.848,11.848,0,0,1,16.364.456a13.647,13.647,0,0,1,2.934,2.6,13.649,13.649,0,0,1,2.934-2.6A11.848,11.848,0,0,1,38.879,4.2,12.02,12.02,0,0,1,40.6,10.374a15.428,15.428,0,0,1-1.87,7.214A52.812,52.812,0,0,1,30.8,28.07c-3.2,3.482-6.607,6.728-8.9,8.839l-.018.017a3.836,3.836,0,0,1-2.571.99ZM9.864,3.5A6.907,6.907,0,0,0,3.991,6.8c-1.423,2.342-1.311,5.357.315,8.489,1.013,1.948,4.482,7.467,15,17.213,2.172-2.025,5.076-4.836,7.815-7.813a48.2,48.2,0,0,0,7.166-9.4c1.626-3.131,1.738-6.146.315-8.488a6.848,6.848,0,0,0-9.644-2.149A10.185,10.185,0,0,0,21.529,8.7L19.3,13.121,17.066,8.7a10.185,10.185,0,0,0-3.432-4.057A6.906,6.906,0,0,0,9.864,3.5Z" transform="translate(906.04 497.584)" fill={likedProducts[product.id] ? "#64d26d" : "#fff"} />
                                </g>
                              </g>
                              <g id="left-hearts">
                                <g id="Group_6" data-name="Group 6" opacity="0.484">
                                  <path id="Path_12" data-name="Path 12" d="M36.508,16.436c-3.141,6.041-11.545,14.257-16.3,18.634a1.342,1.342,0,0,1-1.8,0C13.633,30.693,5.229,22.477,2.087,16.436c-6.9-13.29,10.5-22.151,17.21-8.86C26.01-5.715,43.409,3.146,36.508,16.436Z" transform="translate(827.502 483.705)" fill={likedProducts[product.id] ? "red" : "#fff"} />
                                  <path id="Path_13" data-name="Path 13" d="M19.311,37.916a3.836,3.836,0,0,1-2.575-.99l-.013-.012C11.871,32.47,3.229,24.051-.131,17.589A15.428,15.428,0,0,1-2,10.374,12.021,12.021,0,0,1-.282,4.2,11.848,11.848,0,0,1,16.364.456a13.647,13.647,0,0,1,2.934,2.6,13.649,13.649,0,0,1,2.934-2.6A11.848,11.848,0,0,1,38.879,4.2,12.02,12.02,0,0,1,40.6,10.374a15.428,15.428,0,0,1-1.87,7.214A52.812,52.812,0,0,1,30.8,28.07c-3.2,3.482-6.607,6.728-8.9,8.839l-.018.017a3.836,3.836,0,0,1-2.571.99ZM9.864,3.5A6.907,6.907,0,0,0,3.991,6.8c-1.423,2.342-1.311,5.357.315,8.489,1.013,1.948,4.482,7.467,15,17.213,2.172-2.025,5.076-4.836,7.815-7.813a48.2,48.2,0,0,0,7.166-9.4c1.626-3.131,1.738-6.146.315-8.488a6.848,6.848,0,0,0-9.644-2.149A10.185,10.185,0,0,0,21.529,8.7L19.3,13.121,17.066,8.7a10.185,10.185,0,0,0-3.432-4.057A6.906,6.906,0,0,0,9.864,3.5Z" transform="translate(827.502 483.705)" fill={likedProducts[product.id] ? "#64d26d" : "#fff"} />
                                </g>
                                <g id="Group_7" data-name="Group 7" opacity="0.484">
                                  <path id="Path_14" data-name="Path 14" d="M36.508,16.436c-3.141,6.041-11.545,14.257-16.3,18.634a1.342,1.342,0,0,1-1.8,0C13.633,30.693,5.229,22.477,2.087,16.436c-6.9-13.29,10.5-22.151,17.21-8.86C26.01-5.715,43.409,3.146,36.508,16.436Z" transform="translate(789.902 456.497)" fill={likedProducts[product.id] ? "red" : "#fff"} />
                                  <path id="Path_15" data-name="Path 15" d="M19.311,37.916a3.836,3.836,0,0,1-2.575-.99l-.013-.012C11.871,32.47,3.229,24.051-.131,17.589A15.428,15.428,0,0,1-2,10.374,12.021,12.021,0,0,1-.282,4.2,11.848,11.848,0,0,1,16.364.456a13.647,13.647,0,0,1,2.934,2.6,13.649,13.649,0,0,1,2.934-2.6A11.848,11.848,0,0,1,38.879,4.2,12.02,12.02,0,0,1,40.6,10.374a15.428,15.428,0,0,1-1.87,7.214A52.812,52.812,0,0,1,30.8,28.07c-3.2,3.482-6.607,6.728-8.9,8.839l-.018.017a3.836,3.836,0,0,1-2.571.99ZM9.864,3.5A6.907,6.907,0,0,0,3.991,6.8c-1.423,2.342-1.311,5.357.315,8.489,1.013,1.948,4.482,7.467,15,17.213,2.172-2.025,5.076-4.836,7.815-7.813a48.2,48.2,0,0,0,7.166-9.4c1.626-3.131,1.738-6.146.315-8.488a6.848,6.848,0,0,0-9.644-2.149A10.185,10.185,0,0,0,21.529,8.7L19.3,13.121,17.066,8.7a10.185,10.185,0,0,0-3.432-4.057A6.906,6.906,0,0,0,9.864,3.5Z" transform="translate(789.902 456.497)" fill={likedProducts[product.id] ? "#64d26d" : "#fff"} />
                                </g>
                              </g>
                              <g id="center-heart">
                                <path id="inner" data-name="Path 16" d="M68.82,30.286C62.86,41.748,46.92,57.336,37.9,65.639a2.547,2.547,0,0,1-3.413,0c-9.068-8.3-25.012-23.892-30.972-35.353C-9.578,5.07,23.432-11.741,36.167,13.475,48.9-11.741,81.912,5.07,68.82,30.286Z" transform="translate(853.502 473.705)" fill={likedProducts[product.id] ? "red" : "#fff"} />
                                <path id="outer" data-name="Path 17" d="M36.192,68.8a5.038,5.038,0,0,1-3.382-1.3l-.013-.012C28.5,63.55,22.1,57.47,16,50.84,8.968,43.21,4.022,36.682,1.3,31.439A27.058,27.058,0,0,1-2,18.8,20.564,20.564,0,0,1,.934,8.233,20.236,20.236,0,0,1,29.375,1.847a24.62,24.62,0,0,1,6.792,6.728,24.623,24.623,0,0,1,6.791-6.728A20.236,20.236,0,0,1,71.4,8.233,20.562,20.562,0,0,1,74.336,18.8a27.059,27.059,0,0,1-3.3,12.641c-2.723,5.236-7.666,11.763-14.693,19.4C50.32,57.389,43.909,63.5,39.592,67.478l-.018.017A5.038,5.038,0,0,1,36.192,68.8Zm-.029-5.01a.047.047,0,0,0,.057,0c4.247-3.912,10.543-9.916,16.446-16.332C59.4,40.14,64.084,33.976,66.6,29.132a22.135,22.135,0,0,0,2.734-10.306A15.233,15.233,0,0,0,45.688,6.037,21.52,21.52,0,0,0,38.4,14.6l-2.232,4.418L33.935,14.6a21.521,21.521,0,0,0-7.289-8.566A15.231,15.231,0,0,0,3,18.827,22.133,22.133,0,0,0,5.732,29.134c2.522,4.85,7.213,11.014,13.941,18.319,5.982,6.495,12.268,12.465,16.491,16.333Z" transform="translate(853.502 473.705)" fill="#64d26d" />
                              </g>
                            </g>
                          </svg>

                        </label>
                      </div>
                    </div>
                    <i
                      className="card-brand"
                      style={{ fontFamily: "Times New Roman", fontSize: "0.7rem" }} 
                    >
                      {"Brand : " + brand}
                    </i>
                  </div>
                    <div className="home-cart-price">
                    <h5
                      className="card-text"
                      style={{ fontWeight: "600", fontSize: "1rem", marginBottom: '6px' }}
                    >
                      <i className="bi bi-currency-rupee"></i>
                      {price}
                    </h5>
                  </div>
                  {/* <hr className="hr-line" style={{ margin: "10px 0" }} /> */}
                  <center>
                    <button
                      className="btn-hover color-9"
                      // style={{ margin: '10px 25px 0px ' }}
                      style={{
                        fontFamily: "Times New Roman",
                        height: '130%',
                        margin: '0px 0px 0px ',
                        padding: '6px 15px', 
                        fontSize: '0.8rem', 
                        width: '110%', 
                        maxWidth: '150px',
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      disabled={!productAvailable}
                    >
                      {productAvailable ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </center>
                </div>
                {/* </Link> */}
              </div>
              // </motion.div>
            );
          })
        )}
      </div>

      {/* <div
        className="grid"
        style={{
          marginTop: "64px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          // gap: "20px",
          padding: "20px",
        }}
      >
        {filteredProducts.length === 0 ? (
          <h2
            className="text-center"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No Products Available
          </h2>
        ) : (
          filteredProducts.map((product) => {
            const { id, brand, name, price, productAvailable, imageUrl } = product;
            const cardStyle = {
              width: "18rem",
              height: "12rem",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 3px",
              backgroundColor: productAvailable ? "#fff" : "#ccc",
            };
            return (
              <div
                className="card mb-3"
                style={{
                  width: "250px",
                  height: "360px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: productAvailable ? "#fff" : "#ccc",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: 'flex-start',
                  alignItems: 'stretch'
                }}
                key={id}
              >
                <Link
                  to={`/product/${id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img
                    src={imageUrl}
                    alt={name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      padding: "5px",
                      margin: "0",
                      borderRadius: "10px 10px 10px 10px",
                    }}
                  />
                  <div
                    className="card-body"
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "10px",
                    }}
                  >
                    <div>
                      <h5
                        className="card-title"
                        style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}
                      >
                        {name.toUpperCase()}
                      </h5>
                      <i
                        className="card-brand"
                        style={{ fontStyle: "italic", fontSize: "0.8rem" }}
                      >
                        {"~ " + brand}
                      </i>
                    </div>
                    <hr className="hr-line" style={{ margin: "10px 0" }} />
                    <div className="home-cart-price">
                      <h5
                        className="card-text"
                        style={{ fontWeight: "600", fontSize: "1.1rem", marginBottom: '5px' }}
                      >
                        <i className="bi bi-currency-rupee"></i>
                        {price}
                      </h5>
                    </div>
                    <button
                      className="btn-hover color-9"
                      style={{ margin: '10px 25px 0px ' }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      disabled={!productAvailable}
                    >
                      {productAvailable ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div> */}
    </>
  );
};

export default Home;

// import React, { useContext, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import AppContext from "../Context/Context";
// import unplugged from "../assets/unplugged.png"

// const Home = ({ selectedCategory }) => {
//   const { data, isError, addToCart, refreshData } = useContext(AppContext);
//   const [products, setProducts] = useState([]);
//   const [isDataFetched, setIsDataFetched] = useState(false);
//   const navigate = useNavigate(); 

//   const handleAddToCart = async (product) => {
//     const token = localStorage.getItem("jwt"); // Check for JWT token
//     if (!token) {
//       navigate("/login"); // If no token, redirect to login page
//     } 
//     const response = await fetch('http://localhost:8080/jwtcheck', {
//       method: 'POST',
//       headers: {
//           'Authorization': 'Bearer ' + token,
//       },
//   });

//   if (response.ok) {
//       const userDetails = await response.json();
//       console.log(userDetails)
//       const res = await addToCart(product); // If token exists, add to cart
//       if(res)
//       {
//         alert("Productadd to cart!")
//       }
//       else
//       {
//         alert("Out of Stock!")
//       }
//       // Proceed to load dashboard or set user state
//   } else {
//       // Handle invalid token case
//       navigate('/login');
//   }
//     // else {
//     // }
//   };
//   useEffect(() => {
//     if (!isDataFetched) {
//       refreshData();
//       setIsDataFetched(true);
//     }
//   }, [refreshData, isDataFetched, data]);

//   useEffect(() => {
//     if (data && data.length > 0) {
//       const fetchImagesAndUpdateProducts = async () => {
//         const updatedProducts = await Promise.all(
//           data.map(async (product) => {
//             try {
//               const response = await axios.get(
//                 `http://localhost:8080/api/product/${product.id}/image`,
//                 { responseType: "blob" }
//               );
//               const imageUrl = URL.createObjectURL(response.data);
//               return { ...product, imageUrl };
//             } catch (error) {
//               console.error(
//                 "Error fetching image for product ID:",
//                 product.id,
//                 error
//               );
//               return { ...product, imageUrl: "placeholder-image-url" };
//             }
//           })
//         );
//         setProducts(updatedProducts);
//       };

//       fetchImagesAndUpdateProducts();
//     }
//   }, [data]);

//   const filteredProducts = selectedCategory
//     ? products.filter((product) => product.category === selectedCategory)
//     : products;

//   if (isError) {
//     return (
//       <h2 className="text-center" style={{ padding: "18rem" }}>
//       <img src={unplugged} alt="Error" style={{ width: '100px', height: '100px' }}/>
//       </h2>
//     );
//   }
//   return (
//     <>
//       <div
//         className="grid"
//         style={{
//           marginTop: "64px",
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//           gap: "20px",
//           padding: "20px",
//         }}
//       >
//         {filteredProducts.length === 0 ? (
//           <h2
//             className="text-center"
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             No Products Available
//           </h2>
//         ) : (
//           filteredProducts.map((product) => {
//             const { id, brand, name, price, productAvailable, imageUrl } =
//               product;
//             const cardStyle = {
//               width: "18rem",
//               height: "12rem",
//               boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 3px",
//               backgroundColor: productAvailable ? "#fff" : "#ccc",
//             };
//             return (
//               <div
//                 className="card mb-3"
//                 style={{
//                   width: "250px",
//                   height: "360px",
//                   boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//                   borderRadius: "10px",
//                   overflow: "hidden", 
//                   backgroundColor: productAvailable ? "#fff" : "#ccc",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent:'flex-start',
//                   alignItems:'stretch'
//                 }}
//                 key={id}
//               >
//                 <Link
//                   to={`/product/${id}`}
//                   style={{ textDecoration: "none", color: "inherit" }}
//                 >
//                   <img
//                     src={imageUrl}
//                     alt={name}
//                     style={{
//                       width: "100%",
//                       height: "150px", 
//                       objectFit: "cover",  
//                       padding: "5px",
//                       margin: "0",
//                       borderRadius: "10px 10px 10px 10px", 
//                     }}
//                   />
//                   <div
//                     className="card-body"
//                     style={{
//                       flexGrow: 1,
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "space-between",
//                       padding: "10px",
//                     }}
//                   >
//                     <div>
//                       <h5
//                         className="card-title"
//                         style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}
//                       >
//                         {name.toUpperCase()}
//                       </h5>
//                       <i
//                         className="card-brand"
//                         style={{ fontStyle: "italic", fontSize: "0.8rem" }}
//                       >
//                         {"~ " + brand}
//                       </i>
//                     </div>
//                     <hr className="hr-line" style={{ margin: "10px 0" }} />
//                     <div className="home-cart-price">
//                       <h5
//                         className="card-text"
//                         style={{ fontWeight: "600", fontSize: "1.1rem",marginBottom:'5px' }}
//                       >
//                         <i className="bi bi-currency-rupee"></i>
//                         {price}
//                       </h5>
//                     </div>
//                     <button
//                       className="btn-hover color-9"
//                       style={{margin:'10px 25px 0px '  }}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         // addToCart(product);
//                         handleAddToCart(product);
//                       }}
//                       disabled={!productAvailable}
//                     >
//                       {productAvailable ? "Add to Cart" : "Out of Stock"}
//                     </button> 
//                   </div>
//                 </Link>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </>
//   );
// };

// export default Home;
