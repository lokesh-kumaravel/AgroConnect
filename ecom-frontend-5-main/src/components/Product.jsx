import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import GooglePayButton from "@google-pay/button-react";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData, userId } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(`http://localhost:8080/api/product/${id}/image`, { responseType: "blob" });
      setImageUrl(URL.createObjectURL(response.data));
    };

    fetchProduct();
  }, [id]);

  const incrementViewCount = async () => {
    const curUserId = localStorage.getItem("currentuser");

    if (!product) return;

    // Check if the current user is the owner of the product
    console.log(curUserId)
    console.log(product.userId)
    if (curUserId === product.userId) {
      return; // Don't increment the view count if the user is the owner
    }

    try {
      const token = localStorage.getItem('jwt');
      if (!token)
        {
          // navigate('/login')
          // return alert("User not logged in");
        } else
      await axios.post(`http://localhost:8080/api/products/${id}/view`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  useEffect(() => {
    if (product) {
      incrementViewCount();
    }
  }, [product]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`);
      removeFromCart(id);
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handleAddToCart = async (productId, product) => {
    const token = localStorage.getItem('jwt');
    if (!token)
      {
        navigate('/login')
        return alert("User not logged in");
      } 

    try {
      const productResponse = await axios.get(`http://localhost:8080/users/quantity/${productId}/cart`);
      const availableQuantity = productResponse.data;

      const userCartResponse = await axios.get(`http://localhost:8080/users/currentquantity/${userId}/${productId}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const cartQuantity = userCartResponse.data;

      if (cartQuantity >= availableQuantity) {
        return alert("Out of stock");
      }

      const success = await addToCart(product);
      if (success) {
        alert("Product added to cart");
      } else {
        alert("Failed to add product to cart. Please try again. Out of stock!");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add product to cart. Please try again.";
      alert(errorMessage);
      console.error("Error adding to cart", error);
    }
  };

  if (loading) {
    return <h2 className="text-center" style={{ padding: "10rem" }}>Loading...</h2>;
  }

  if (!product) {
    return <h2 className="text-center" style={{ padding: "10rem" }}>Product not found.</h2>;
  }

  const curid = localStorage.getItem("currentuser");

  return (
    <>
      <div className="containers" style={{ display: "flex" }}>
        <img className="left-column-img" src={imageUrl} alt={product.imageName} style={{ width: "50%", height: "auto" }} />

        <div className="right-column" style={{ width: "50%" }}>
          <div className="product-description">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 'lighter' }}>{product.category}</span>
              <p className="release-date" style={{ marginBottom: "2rem" }}>
                <h6>Listed: <span><i>{new Date(product.releaseDate).toLocaleDateString()}</i></span></h6>
              </p>
            </div>

            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", textTransform: 'capitalize', letterSpacing: '1px' }}>{product.name}</h1>
            <i style={{ marginBottom: "3rem" }}>{product.brand}</i>
            <p style={{ fontWeight: 'bold', fontSize: '1rem', margin: '10px 0px 0px' }}>PRODUCT DESCRIPTION:</p>
            <p style={{ marginBottom: "1rem" }}>{product.description}</p>
          </div>

          <div className="product-price">
            <span style={{ fontSize: "2rem", fontWeight: "bold" }}>₹{product.price}</span>
            {product.userId !== curid && ( // Show the button only if the user is not the owner
    <button
      className={`cart-btn ${!product.productAvailable ? "disabled-btn" : ""}`}
      onClick={() => handleAddToCart(product.id, product)}  
      disabled={!product.productAvailable}
      style={{
        padding: "1rem 2rem",
        fontSize: "1rem",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "1rem",
      }}
    >
      {product.productAvailable ? "Add to cart" : "Out of Stock"}
    </button>
  )}

            {/* <button
              className={`cart-btn ${!product.productAvailable ? "disabled-btn" : ""}`}
              onClick={() => handleAddToCart(product.id, product)}  
              disabled={!product.productAvailable}
              style={{
                padding: "1rem 2rem",
                fontSize: "1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "1rem",
              }}
            >
              if (curUserId === product.userId){product.productAvailable ? "Add to cart" : "Out of Stock"}
            </button> */}

            <h6 style={{ marginBottom: "1rem" }}>
              Stock Available: <i style={{ color: "green", fontWeight: "bold" }}>{product.stockQuantity}</i>
            </h6>

            {/* Google Pay Purchase Button */}
            {product.productAvailable && (
              <div>
                <hr />
                <GooglePayButton
                  environment="TEST"
                  paymentRequest={{
                    apiVersion: 2,
                    apiVersionMinor: 0,
                    allowedPaymentMethods: [
                      {
                        type: 'CARD',
                        parameters: {
                          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                          allowedCardNetworks: ['MASTERCARD', 'VISA'],
                        },
                        tokenizationSpecification: {
                          type: 'PAYMENT_GATEWAY',
                          parameters: {
                            gateway: 'example',
                            gatewayMerchantId: 'exampleGatewayMerchantId',
                          },
                        },
                      },
                    ],
                    merchantInfo: {
                      merchantId: '12345678901234567890',
                      merchantName: 'Demo Merchant',
                    },
                    transactionInfo: {
                      totalPriceStatus: 'FINAL',
                      totalPriceLabel: 'Total',
                      totalPrice: '100',
                      currencyCode: 'USD',
                      countryCode: 'US',
                    },
                    shippingAddressRequired: true,
                    callbackIntents: ['SHIPPING_ADDRESS', 'PAYMENT_AUTHORIZATION'],
                  }}
                  onLoadPaymentData={paymentRequest => {
                    console.log('Success', paymentRequest);
                  }}
                  onPaymentAuthorized={paymentData => {
                    console.log('Payment Authorised Success', paymentData);
                    return { transactionState: 'SUCCESS' };
                  }}
                  onPaymentDataChanged={paymentData => {
                    console.log('On Payment Data Changed', paymentData);
                    return {};
                  }}
                  existingPaymentMethodRequired='false'
                  buttonColor='black'
                  buttonType='Buy'
                />
              </div>
            )}

          </div>

          {/* Conditionally render Edit and Delete buttons */}
          {product.userId === curid && ( 
            <div className="update-button" style={{ display: "flex", gap: "1rem" }}>
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleEditClick}
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Update
              </button>
              <button
                className="btn btn-danger"
                type="button"
                onClick={deleteProduct}
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1rem",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;

// import { useNavigate, useParams } from "react-router-dom";
// import { useContext, useEffect, useState } from "react";
// import AppContext from "../Context/Context";
// import axios from "../axios";
// import GooglePayButton from "@google-pay/button-react";

// const Product = () => {
//   const { id } = useParams();
//   const { data, addToCart, removeFromCart, cart, refreshData, islogged, userId  } = useContext(AppContext);
//   const [product, setProduct] = useState(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/product/${id}`);
//         setProduct(response.data);
//         if (response.data.imageName) {
//           fetchImage();
//         }
//       } catch (error) {
//         console.error("Error fetching product:", error);
//       }
//     };

//     const fetchImage = async () => {
//       const response = await axios.get(`http://localhost:8080/api/product/${id}/image`, { responseType: "blob" });
//       setImageUrl(URL.createObjectURL(response.data));
//     };

//     fetchProduct();
//   }, [id]);

//   const curid = localStorage.getItem("currentuser");
//   if (!curid) {
//     console.log("User Id Not found ");
//   }

//   const deleteProduct = async () => {
//     try {
//       await axios.delete(`http://localhost:8080/api/product/${id}`);
//       removeFromCart(id);
//       alert("Product deleted successfully");
//       refreshData();
//       navigate("/");
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   const handleEditClick = () => {
//     navigate(`/product/update/${id}`);
//   };

//   const handleAddToCart = async (productId, product) => {
//     const token = localStorage.getItem('jwt');
//     if (!token) return alert("User not logged in");

//     try {
//       const productResponse = await axios.get(`http://localhost:8080/users/quantity/${productId}/cart`);
//       const availableQuantity = productResponse.data;

//       const userCartResponse = await axios.get(`http://localhost:8080/users/currentquantity/${userId}/${productId}/cart`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const cartQuantity = userCartResponse.data;

//       if (cartQuantity >= availableQuantity) {
//         return alert("Out of stock");
//       }

//       const success = await addToCart(product);
//       if (success) {
//         alert("Product added to cart");
//       } else {
//         alert("Failed to add product to cart. Please try again. Out of stock!");
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "Failed to add product to cart. Please try again.";
//       alert(errorMessage);
//       console.error("Error adding to cart", error);
//     }
//   };

//   // // Function to handle Google Pay payment
//   // const handleGooglePay = async (upiId) => {
//   //   const amount = product.price; // Set the amount dynamically
//   //   const transactionId = `txn_${new Date().getTime()}`; // Generate a unique transaction ID
//   //   const name = "Store"; // You can replace this with your store name
  
//   //   // UPI payment link for QR code and deep link
//   //   const upiPaymentLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&mc=&tid=${transactionId}&am=${amount}&tn=Payment for ${product.name}`;
  
//   //   // Detect mobile devices
//   //   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
//   //   if (isMobile) {
//   //     // Redirect to Google Pay using deep link on mobile
//   //     window.open(`gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&mc=&tid=${transactionId}&am=${amount}&tn=Payment for ${product.name}`, '_blank');
//   //   } else {
//   //     // On desktop, generate a QR code and display it
//   //     const qrCanvas = document.getElementById('qrCodeCanvas'); // Ensure this is a canvas element
  
//   //     // Generate the QR code for UPI payment
//   //     try {
//   //       await QRCode.toCanvas(qrCanvas, upiPaymentLink, { width: 256 });
//   //       alert("Scan the QR code with your UPI app to complete the payment.");
//   //     } catch (err) {
//   //       console.error('QR Code generation failed: ', err);
//   //     }
//   //   }
//   // };
  

//   if (!product) {
//     return <h2 className="text-center" style={{ padding: "10rem" }}>Loading...</h2>;
//   }

//   return (
//     <>
//       <div className="containers" style={{ display: "flex" }}>
//         <img className="left-column-img" src={imageUrl} alt={product.imageName} style={{ width: "50%", height: "auto" }} />
        
//         <div className="right-column" style={{ width: "50%" }}>
//           <div className="product-description">
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <span style={{ fontSize: "1.2rem", fontWeight: 'lighter' }}>{product.category}</span>
//               <p className="release-date" style={{ marginBottom: "2rem" }}>
//                 <h6>Listed: <span><i>{new Date(product.releaseDate).toLocaleDateString()}</i></span></h6>
//               </p>
//             </div>

//             <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", textTransform: 'capitalize', letterSpacing: '1px' }}>{product.name}</h1>
//             <i style={{ marginBottom: "3rem" }}>{product.brand}</i>
//             <p style={{ fontWeight: 'bold', fontSize: '1rem', margin: '10px 0px 0px' }}>PRODUCT DESCRIPTION:</p>
//             <p style={{ marginBottom: "1rem" }}>{product.description}</p>
//           </div>

//           <div className="product-price">
//             <span style={{ fontSize: "2rem", fontWeight: "bold" }}>₹{product.price}</span>
//             <button
//               className={`cart-btn ${!product.productAvailable ? "disabled-btn" : ""}`}
//               onClick={() => handleAddToCart(product.id, product)}  
//               disabled={!product.productAvailable}
//               style={{
//                 padding: "1rem 2rem",
//                 fontSize: "1rem",
//                 backgroundColor: "#007bff",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//                 marginBottom: "1rem",
//               }}
//             >
//               {product.productAvailable ? "Add to cart" : "Out of Stock"}
//             </button>

//             <h6 style={{ marginBottom: "1rem" }}>
//               Stock Available: <i style={{ color: "green", fontWeight: "bold" }}>{product.stockQuantity}</i>
//             </h6>

//             {/* Google Pay Purchase Button */}
// {product.productAvailable && (
//   <div>
//     Helo
//     {/* <h1><img src={logo} className="App-logo" alt="logo" /> Google Pay React Demo</h1> */}
//       <hr />
//       <GooglePayButton
//         environment="TEST"
//         paymentRequest={{
//           apiVersion: 2,
//           apiVersionMinor: 0,
//           allowedPaymentMethods: [
//             {
//               type: 'CARD',
//               parameters: {
//                 allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
//                 allowedCardNetworks: ['MASTERCARD', 'VISA'],
//               },
//               tokenizationSpecification: {
//                 type: 'PAYMENT_GATEWAY',
//                 parameters: {
//                   gateway: 'example',
//                   gatewayMerchantId: 'exampleGatewayMerchantId',
//                 },
//               },
//             },
//           ],
//           merchantInfo: {
//             merchantId: '12345678901234567890',
//             merchantName: 'Demo Merchant',
//           },
//           transactionInfo: {
//             totalPriceStatus: 'FINAL',
//             totalPriceLabel: 'Total',
//             totalPrice: '0',
//             currencyCode: 'USD',
//             countryCode: 'US',
//           },
//           shippingAddressRequired: true,
//           callbackIntents: ['SHIPPING_ADDRESS', 'PAYMENT_AUTHORIZATION'],
//         }}
//         onLoadPaymentData={paymentRequest => {
//           console.log('Success', paymentRequest);
//         }}
//         onPaymentAuthorized={paymentData => {
//             console.log('Payment Authorised Success', paymentData)
//             return { transactionState: 'SUCCESS'}
//           }
//         }
//         onPaymentDataChanged={paymentData => {
//             console.log('On Payment Data Changed', paymentData)
//             return { }
//           }
//         }
//         existingPaymentMethodRequired='false'
//         buttonColor='black'
//         buttonType='Buy'
//       />

//     {/* QR Code Container */}
//     <div id="qrCodeContainer" style={{ marginTop: "20px" }}></div>
//   </div>
// )}

//           </div>

//           {/* Conditionally render Edit and Delete buttons */}
//           {product.userId === curid && ( 
//             <div className="update-button" style={{ display: "flex", gap: "1rem" }}>
//               <button
//                 className="btn btn-primary"
//                 type="button"
//                 onClick={handleEditClick}
//                 style={{
//                   padding: "1rem 2rem",
//                   fontSize: "1rem",
//                   backgroundColor: "#007bff",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Update
//               </button>
//               <button
//                 className="btn btn-danger"
//                 type="button"
//                 onClick={deleteProduct}
//                 style={{
//                   padding: "1rem 2rem",
//                   fontSize: "1rem",
//                   backgroundColor: "#dc3545",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Delete
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Product;

// // import { useNavigate, useParams } from "react-router-dom";
// // import { useContext, useEffect, useState } from "react";
// // import AppContext from "../Context/Context";
// // import axios from "../axios";

// // const Product = () => {
// //   const { id } = useParams();
// //   const { data, addToCart, removeFromCart, cart, refreshData, islogged, userId  } = useContext(AppContext);
// //   const [product, setProduct] = useState(null);
// //   const [imageUrl, setImageUrl] = useState("");
// //   const navigate = useNavigate();
// //   // const Id = "66f77627abfbd9561c15a4ac";
// //   // console.log("log: "+Id)
// //   useEffect(() => {
// //     const fetchProduct = async () => {
// //       try {
// //         const response = await axios.get(`http://localhost:8080/api/product/${id}`);
// //         setProduct(response.data);
// //         if (response.data.imageName) {
// //           fetchImage();
// //         }
// //       } catch (error) {
// //         console.error("Error fetching product:", error);
// //       }
// //     };

// //     const fetchImage = async () => {
// //       const response = await axios.get(`http://localhost:8080/api/product/${id}/image`, { responseType: "blob" });
// //       setImageUrl(URL.createObjectURL(response.data));
// //     };
    
// //     fetchProduct();
// //   }, [id]);
// //   const curid = localStorage.getItem("currentuser")
// //   if(!curid)
// //   {
// //     console.log("User Id Not found ")
// //   }
// //   const deleteProduct = async () => {
// //     try {
// //       await axios.delete(`http://localhost:8080/api/product/${id}`);
// //       removeFromCart(id);
// //       alert("Product deleted successfully");
// //       refreshData();
// //       navigate("/");
// //     } catch (error) {
// //       console.error("Error deleting product:", error);
// //     }
// //   };

// //   const handleEditClick = () => {
// //     navigate(`/product/update/${id}`);
// //   };

// //   const handleAddToCart = async (productId, product) => {
// //     const token = localStorage.getItem('jwt');
// //     if (!token) return alert("User not logged in");

// //     try {
// //         const productResponse = await axios.get(`http://localhost:8080/users/quantity/${productId}/cart`);
// //         const availableQuantity = productResponse.data;

// //         const userCartResponse = await axios.get(`http://localhost:8080/users/currentquantity/${userId}/${productId}/cart`, {
// //             headers: { Authorization: `Bearer ${token}` }
// //         });
// //         const cartQuantity = userCartResponse.data;

// //         if (cartQuantity >= availableQuantity) {
// //             return alert("Out of stock");
// //         }

// //         const success = await addToCart(product);
// //         if (success) {
// //             alert("Product added to cart");
// //         } else {
// //             alert("Failed to add product to cart. Please try again. out of stock!");
// //         }
// //     } catch (error) {
// //         const errorMessage = error.response?.data?.message || "Failed to add product to cart. Please try again.";
// //         alert(errorMessage);
// //         console.error("Error adding to cart", error);
// //     }
// // };

// //   if (!product) {
// //     return <h2 className="text-center" style={{ padding: "10rem" }}>Loading...</h2>;
// //   }

// //   return (
// //     <>
// //       <div className="containers" style={{ display: "flex" }}>
// //         <img className="left-column-img" src={imageUrl} alt={product.imageName} style={{ width: "50%", height: "auto" }} />
        
// //         <div className="right-column" style={{ width: "50%" }}>
// //           <div className="product-description">
// //             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
// //               <span style={{ fontSize: "1.2rem", fontWeight: 'lighter' }}>{product.category}</span>
// //               <p className="release-date" style={{ marginBottom: "2rem" }}>
// //                 <h6>Listed: <span><i>{new Date(product.releaseDate).toLocaleDateString()}</i></span></h6>
// //               </p>
// //             </div>

// //             <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", textTransform: 'capitalize', letterSpacing: '1px' }}>{product.name}</h1>
// //             <i style={{ marginBottom: "3rem" }}>{product.brand}</i>
// //             <p style={{ fontWeight: 'bold', fontSize: '1rem', margin: '10px 0px 0px' }}>PRODUCT DESCRIPTION:</p>
// //             <p style={{ marginBottom: "1rem" }}>{product.description}</p>
// //           </div>

// //           <div className="product-price">
// //             <span style={{ fontSize: "2rem", fontWeight: "bold" }}>${product.price}</span>
// //             <button
// //   className={`cart-btn ${!product.productAvailable ? "disabled-btn" : ""}`}
// //   onClick={() => handleAddToCart(product.id, product)}  // Wrap it in an arrow function
// //   disabled={!product.productAvailable}
// //   style={{
// //     padding: "1rem 2rem",
// //     fontSize: "1rem",
// //     backgroundColor: "#007bff",
// //     color: "white",
// //     border: "none",
// //     borderRadius: "5px",
// //     cursor: "pointer",
// //     marginBottom: "1rem",
// //   }}
// // >
// //   {product.productAvailable ? "Add to cart" : "Out of Stock"}
// // </button>

// //             <h6 style={{ marginBottom: "1rem" }}>
// //               Stock Available: <i style={{ color: "green", fontWeight: "bold" }}>{product.stockQuantity}</i>
// //             </h6>
// //           </div>

// //           {/* Conditionally render Edit and Delete buttons */}
// //               {/* console.log("Pro: "+product.userId) */}
// //               {/* {console.log("product id"+product.userId)}
// //               {console.log("user id"+curid)} */}
// //           {product.userId ==  curid&& ( 
// //             <div className="update-button" style={{ display: "flex", gap: "1rem" }}>
// //               <button
// //                 className="btn btn-primary"
// //                 type="button"
// //                 onClick={handleEditClick}
// //                 style={{
// //                   padding: "1rem 2rem",
// //                   fontSize: "1rem",
// //                   backgroundColor: "#007bff",
// //                   color: "white",
// //                   border: "none",
// //                   borderRadius: "5px",
// //                   cursor: "pointer",
// //                 }}
// //               >
// //                 Update
// //               </button>
// //               <button
// //                 className="btn btn-danger"
// //                 type="button"
// //                 onClick={deleteProduct}
// //                 style={{
// //                   padding: "1rem 2rem",
// //                   fontSize: "1rem",
// //                   backgroundColor: "#dc3545",
// //                   color: "white",
// //                   border: "none",
// //                   borderRadius: "5px",
// //                   cursor: "pointer",
// //                 }}
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //            )} 
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default Product;