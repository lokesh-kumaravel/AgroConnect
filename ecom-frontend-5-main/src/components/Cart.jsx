import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
// import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from "../axiosProduct";
const Cart = () => {
  const navigate = useNavigate();
  const { clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set()); 

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        navigate("/login");
        return;
      }
  
      try {
        const userId = localStorage.getItem("currentuser");
        const response = await axios.get(`/users/${userId}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("This is the Response : "+response.data)
        const cartData = response.data;
        const productDetails = cartData.map(cartItem => {
          const price = parseFloat(cartItem.product.price) || 0; 
          return {
            ...cartItem.product,
            quantity: cartItem.quantity,
            price,
            imageUrl: cartItem.product.imageDate
          };
        });
  
        setCartItems(productDetails);
      } catch (error) {
        console.error("Error fetching cart or product data:", error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };
  
    fetchCartItems();
  }, [navigate]);
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 0;
      return acc + (itemPrice * itemQuantity);
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const calculateSelectedTotalPrice = () => {
    return cartItems
      .filter(item => selectedItems.has(item.id))
      .reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const handleIncreaseQuantity = async (itemId) => {
    setLoading(true); 
    const userId = localStorage.getItem("currentuser");

    try {
      const productResponse = await axios.get(`/api/product/${itemId}`);
      const currentProductQuantity = productResponse.data.stockQuantity;
      console.log(currentProductQuantity)
      setCartItems((prevItems) => {
        const itemToUpdate = prevItems.find(item => item.id === itemId);

        if (itemToUpdate) {
          if (itemToUpdate.quantity < currentProductQuantity) {
            const updatedItems = prevItems.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );

            updateCartItem(userId, itemId, itemToUpdate.quantity + 1);
            return updatedItems;
          } else {
            alert("Out of Stock!");
            return prevItems;
          }
        }
        return prevItems;
      });
    } catch (error) {
      console.error("Error fetching product data:", error);
      alert("Failed to update quantity. Please try again.");
    }
    setLoading(false);
  };

  const handleDecreaseQuantity = (itemId) => {
    setLoading(true); 
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(item.quantity - 1, 0);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      const itemToRemove = updatedItems.find(item => item.id === itemId && item.quantity === 0);
      if (itemToRemove) {
        handleRemoveFromCart(itemId);
      }

      const updatedItem = updatedItems.find(item => item.id === itemId);
      const userId = localStorage.getItem("currentuser");
      
      if (updatedItem) {
        updateCartItem(userId, itemId, updatedItem.quantity); 
      }
      
      return updatedItems;
    });
    setLoading(false);
  };

  const updateCartItem = async (userId, itemId, newQuantity) => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.put(
        `/users/${userId}/cart/${itemId}`,
        { quantity: newQuantity },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("Cart updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    try {
      const token = localStorage.getItem('jwt');
      const userId = localStorage.getItem('currentuser');
      await axios.delete(`/users/${userId}/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Error removing item from cart in database:", error);
    }
  };
  
  const handleshowdescription = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  const handleCheckboxChange = (itemId) => {
    setSelectedItems(prevSelectedItems => {
      const updatedSelectedItems = new Set(prevSelectedItems);
      if (updatedSelectedItems.has(itemId)) {
        updatedSelectedItems.delete(itemId); 
      } else {
        updatedSelectedItems.add(itemId); 
      }
      return updatedSelectedItems;
    });
  };

  const handleCheckout = async () => {
    const selectedProducts = cartItems.filter(item => selectedItems.has(item.id));
    if (selectedProducts.length === 0) {
      alert("Please select at least one item to proceed to checkout.");
      return;
    }

    const selectedTotalPrice = calculateSelectedTotalPrice();
    console.log("Selected Total Price:", selectedTotalPrice);
  };

  return (
    <div className="cart-container">
      <div className="shopping-cart">
        <div className="title">Shopping Bag</div>
        {cartItems.length === 0 ? (
          <div className="empty" style={{ textAlign: "left", padding: "2rem" }}>
            <h4>Your cart is empty</h4>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="item" style={{ display: "flex", alignItems: "center" }}>
                  <div>
                    <input
                    style={{
                      marginRight: "10px",
                      transform: "scale(1.5)", 
                      cursor: "pointer"
                    }}
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                    <img
                      onClick={() => handleshowdescription(item.id)}
                      style={{ cursor: "pointer" }}
                      src={
                        item.imageDate
                          ? `data:image/png;base64,${item.imageDate.replace(/^Binary\.createFromBase64\('(.+)'\, \d+\)$/, '$1')}`
                          : (item.imageData ? `data:image/png;base64,${item.imageData}` : "placeholder-image-url")
                      }
                      alt={item.name}
                      className="cart-item-image"
                      onError={(e) => {
                        e.target.src = "placeholder-image-url";
                      }}
                    />
                  </div>
                  <div className="description">
                    <span>{item.brand}</span>
                    <span>{item.name}</span>
                  </div>
                  <div className="quantity">
                    <button className="plus-btn" type="button" onClick={() => handleIncreaseQuantity(item.id)} disabled={loading}>
                      <i className="bi bi-plus-square-fill"></i>
                    </button>
                    <input type="text" value={item.quantity} readOnly />
                    <button className="minus-btn" type="button" onClick={() => handleDecreaseQuantity(item.id)} disabled={loading}>
                      <i className="bi bi-dash-square-fill"></i>
                    </button>
                  </div>
                  <div className="total-price" style={{ textAlign: "center" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)}>
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </li>
            ))}
            <div className="total">Total: ${totalPrice.toFixed(2)}</div>
            <Button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setShowModal(true)}>
              Checkout
            </Button>
          </>
        )}
      </div>
      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        selectedItems={selectedItems} 
        cartItems={cartItems}
        totalPrice={calculateSelectedTotalPrice()} 
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;


// import React, { useContext, useState, useEffect } from "react";
// import AppContext from "../Context/Context";
// import axios from "axios";
// import CheckoutPopup from "./CheckoutPopup";
// import { Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom'; 

// const Cart = () => {
//   const navigate = useNavigate();
//   const { clearCart } = useContext(AppContext);
//   const [cartItems, setCartItems] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchCartItems = async () => {
//       const token = localStorage.getItem('jwt');
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       try {
//         const userId = localStorage.getItem("currentuser");
//         // Fetch the cart items from the backend
//         const response = await axios.get(`http://192.168.77.227:8080/users/${userId}/cart`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const cartData = response.data;
//         // Fetch product details for each cart item
//         const productDetails = await Promise.all(
//           cartData.map(async (cartItem) => {
//             console.log("CatrItem: "+cartItem)
//             const productResponse = await axios.get(`http://localhost:8080/api/product/${cartItem.id}`);
//             return {
//               ...cartItem,
//               ...productResponse.data, // Merges the cart item and product details
//             };
//           })
//         );

//         setCartItems(productDetails);
//       } catch (error) {
//         console.error("Error fetching cart or product data:", error);
//         if (error.response && error.response.status === 401) {
//           navigate('/login');
//         }
//       }
//     };

//     fetchCartItems();
//   }, [navigate]);

//   // Calculate total price whenever cartItems are updated
//   useEffect(() => {
//     const total = cartItems.reduce(
//       (acc, item) => acc + parseInt(item.price) * item.quantity,
//       0
//     );
//     setTotalPrice(total);
//   }, [cartItems]);

//   const handleIncreaseQuantity = (itemId) => {  
//     const newCartItems = cartItems.map((item) => {
//       if (item.productId === itemId) {
//         return { ...item, quantity: item.quantity + 1 };
//       }
//       return item;
//     });
//     setCartItems(newCartItems);
//   };

//   const handleDecreaseQuantity = (itemId) => {
//     const newCartItems = cartItems.map((item) =>
//       item.productId === itemId
//         ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
//         : item
//     );
//     setCartItems(newCartItems);
//   };

//   const handleRemoveFromCart = (itemId) => {
//     const newCartItems = cartItems.filter((item) => item.productId !== itemId);
//     setCartItems(newCartItems);
//   };

//   const handleCheckout = async () => {
//     try {
//       clearCart();
//       setCartItems([]);
//       setShowModal(false);
//     } catch (error) {
//       console.error("Error during checkout:", error);
//     }
//   };

//   return (
//     <div className="cart-container">
//       <div className="shopping-cart">
//         <div className="title">Shopping Bag</div>
//         {cartItems.length === 0 ? (
//           <div className="empty" style={{ textAlign: "left", padding: "2rem" }}>
//             <h4>Your cart is empty</h4>
//           </div>
//         ) : (
//           <>
//             {cartItems.map((item) => (
//               <li key={item.productId} className="cart-item">
//                 <div
//                   className="item"
//                   style={{ display: "flex", alignContent: "center" }}
//                   key={item.productId}
//                 >
//                   <div>
//                     <img
//                       src={item.imageUrl || "placeholder-image-url"}
//                       alt={item.name}
//                       className="cart-item-image"
//                     />
//                   </div>
//                   <div className="description">
//                     <span>{item.brand}</span>
//                     <span>{item.name}</span>
//                   </div>

//                   <div className="quantity">
//                     <button
//                       className="plus-btn"
//                       type="button"
//                       onClick={() => handleIncreaseQuantity(item.productId)}
//                     >
//                       <i className="bi bi-plus-square-fill"></i>
//                     </button>
//                     <input
//                       type="button"
//                       value={item.quantity}
//                       readOnly
//                     />
//                     <button
//                       className="minus-btn"
//                       type="button"
//                       onClick={() => handleDecreaseQuantity(item.productId)}
//                     >
//                       <i className="bi bi-dash-square-fill"></i>
//                     </button>
//                   </div>

//                   <div className="total-price" style={{ textAlign: "center" }}>
//                     ${item.price * item.quantity}
//                   </div>
//                   <button
//                     className="remove-btn"
//                     onClick={() => handleRemoveFromCart(item.productId)}
//                   >
//                     <i className="bi bi-trash3-fill"></i>
//                   </button>
//                 </div>
//               </li>
//             ))}
//             <div className="total">Total: ${totalPrice}</div>
//             <Button
//               className="btn btn-primary"
//               style={{ width: "100%" }}
//               onClick={() => setShowModal(true)}
//             >
//               Checkout
//             </Button>
//           </>
//         )}
//       </div>
//       <CheckoutPopup
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         cartItems={cartItems}
//         totalPrice={totalPrice}
//         handleCheckout={handleCheckout}
//       />
//     </div>
//   );
// };

// export default Cart;


// import React, { useContext, useState, useEffect } from "react";
// import AppContext from "../Context/Context";
// import axios from "axios";
// import CheckoutPopup from "./CheckoutPopup";
// import { Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom'; 

// const Cart = () => {

//     const navigate = useNavigate();

//   const { cart, removeFromCart , clearCart } = useContext(AppContext);
//   const [cartItems, setCartItems] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [cartImage, setCartImage] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchImagesAndUpdateCart = async () => {
//       var token = localStorage.getItem('jwt')
//       if(!token)
//       {
//         navigate("/login");
//         return;
//       }
//       const response = await fetch('http://localhost:8080/jwtcheck', {
//         method: 'POST',
//         headers: {
//             'Authorization': 'Bearer ' + token,
//         },
//     });
  
//     if (response.ok) {
//         const userDetails = await response.json();
//         console.log(userDetails)
//         // Proceed to load dashboard or set user state
//     } else {
//         // Handle invalid token case
//         navigate('/login');
//     }
//     try {
//         // console.log("Cart", cart);
//         var id = localStorage.getItem("currentuser")
//         console.log(id)
//         const response = await axios.get("http://localhost:8080/users//products");
//         const backendProductIds = response.data.map((product) => product.id);

//         const updatedCartItems = cart.filter((item) => backendProductIds.includes(item.id));
//         const cartItemsWithImages = await Promise.all(
//           updatedCartItems.map(async (item) => {
//             try {
//               const response = await axios.get(
//                 `http://localhost:8080/api/product/${item.id}/image`,
//                 { responseType: "blob" }
//               );
//               const imageFile = await converUrlToFile(response.data, response.data.imageName);
//               setCartImage(imageFile)
//               const imageUrl = URL.createObjectURL(response.data);
//               return { ...item, imageUrl };
//             } catch (error) {
//               console.error("Error fetching image:", error);
//               return { ...item, imageUrl: "placeholder-image-url" };
//             }
//           })
//         );
//         console.log("cart",cart)
//         setCartItems(cartItemsWithImages);
//       } catch (error) {
//         console.error("Error fetching product data:", error);
//       }
//     };

//     if (cart.length) {
//       fetchImagesAndUpdateCart();
//     }
//   }, [cart,navigate]);

//   useEffect(() => {
//     const total = cartItems.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0
//     );
//     setTotalPrice(total);
//   }, [cartItems]);

//   const converUrlToFile = async (blobData, fileName) => {
//     const file = new File([blobData], fileName, { type: blobData.type });
//     return file;
//   }

//   const handleIncreaseQuantity = (itemId) => {
//     const newCartItems = cartItems.map((item) => {
//       if (item.id === itemId) {
//         if (item.quantity < item.stockQuantity) {
//           return { ...item, quantity: item.quantity + 1 };
//         } else {
//           alert("Cannot add more than available stock");
//         }
//       }
//       return item;
//     });
//     setCartItems(newCartItems);
//   };
  

//   const handleDecreaseQuantity = (itemId) => {
//     const newCartItems = cartItems.map((item) =>
//       item.id === itemId
//         ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
//         : item
//     );
//     setCartItems(newCartItems);
//   };

//   const handleRemoveFromCart = (itemId) => {
//     removeFromCart(itemId);
//     const newCartItems = cartItems.filter((item) => item.id !== itemId);
//     setCartItems(newCartItems);
//   };

//   const handleCheckout = async () => {
//     try {
//       for (const item of cartItems) {
//         const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
//         const updatedStockQuantity = item.stockQuantity - item.quantity;
  
//         const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };
//         console.log("updated product data", updatedProductData)
  
//         const cartProduct = new FormData();
//         cartProduct.append("imageFile", cartImage);
//         cartProduct.append(
//           "product",
//           new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
//         );
  
//         await axios
//           .put(`http://localhost:8080/api/product/${item.id}`, cartProduct, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           })
//           .then((response) => {
//             console.log("Product updated successfully:", (cartProduct));
//           })
//           .catch((error) => {
//             console.error("Error updating product:", error);
//           });
//       }
//       clearCart();
//       setCartItems([]);
//       setShowModal(false);
//     } catch (error) {
//       console.log("error during checkout", error);
//     }
//   };

//   return (
//     <div className="cart-container">
//       <div className="shopping-cart">
//         <div className="title">Shopping Bag</div>
//         {cartItems.length === 0 ? (
//           <div className="empty" style={{ textAlign: "left", padding: "2rem" }}>
//             <h4>Your cart is empty</h4>
//           </div>
//         ) : (
//           <>
//             {cartItems.map((item) => (
//               <li key={item.id} className="cart-item">
//                 <div
//                   className="item"
//                   style={{ display: "flex", alignContent: "center" }}
//                   key={item.id}
//                 >
                 
//                   <div>
//                     <img
//                       src={item.imageUrl}
//                       alt={item.name}
//                       className="cart-item-image"
//                     />
//                   </div>
//                   <div className="description">
//                     <span>{item.brand}</span>
//                     <span>{item.name}</span>
//                   </div>

//                   <div className="quantity">
//                     <button
//                       className="plus-btn"
//                       type="button"
//                       name="button"
//                       onClick={() => handleIncreaseQuantity(item.id)}
//                     >
//                       <i className="bi bi-plus-square-fill"></i>
//                     </button>
//                     <input
//                       type="button"
//                       name="name"
//                       value={item.quantity}
//                       readOnly
//                     />
//                     <button
//                       className="minus-btn"
//                       type="button"
//                       name="button"
//                       onClick={() => handleDecreaseQuantity(item.id)}
//                     >
//                       <i className="bi bi-dash-square-fill"></i>
//                     </button>
//                   </div>

//                   <div className="total-price " style={{ textAlign: "center" }}>
//                     ${item.price * item.quantity}
//                   </div>
//                   <button
//                     className="remove-btn"
//                     onClick={() => handleRemoveFromCart(item.id)}
//                   >
//                     <i className="bi bi-trash3-fill"></i>
//                   </button>
//                 </div>
//               </li>
//             ))}
//             <div className="total">Total: ${totalPrice}</div>
//             <Button
//               className="btn btn-primary"
//               style={{ width: "100%" }}
//               onClick={() => setShowModal(true)}
//             >
//               Checkout
//             </Button>
//           </>
//         )}
//       </div>
//       <CheckoutPopup
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         cartItems={cartItems}
//         totalPrice={totalPrice}
//         handleCheckout={handleCheckout}
//       />
//     </div>

//   );
// };

// export default Cart;
// import React, { useContext, useState, useEffect } from "react";
// import AppContext from "../Context/Context";
// import axios from "axios";
// import CheckoutPopup from "./CheckoutPopup";
// import { Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom'; 

// const Cart = () => {

//     const navigate = useNavigate();

//   const { cart, removeFromCart , clearCart } = useContext(AppContext);
//   const [cartItems, setCartItems] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [cartImage, setCartImage] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchImagesAndUpdateCart = async () => {
//       var token = localStorage.getItem('jwt')
//       if(!token)
//       {
//         navigate("/login");
//         return;
//       }
//       const response = await fetch('http://localhost:8080/jwtcheck', {
//         method: 'POST',
//         headers: {
//             'Authorization': 'Bearer ' + token,
//         },
//     });
  
//     if (response.ok) {
//         const userDetails = await response.json();
//         console.log(userDetails)
//         // Proceed to load dashboard or set user state
//     } else {
//         // Handle invalid token case
//         navigate('/login');
//     }
//       console.log("Cart", cart);
//       try {
//         const response = await axios.get("http://localhost:8080/api/products");
//         const backendProductIds = response.data.map((product) => product.id);

//         const updatedCartItems = cart.filter((item) => backendProductIds.includes(item.id));
//         const cartItemsWithImages = await Promise.all(
//           updatedCartItems.map(async (item) => {
//             try {
//               const response = await axios.get(
//                 `http://localhost:8080/api/product/${item.id}/image`,
//                 { responseType: "blob" }
//               );
//               const imageFile = await converUrlToFile(response.data, response.data.imageName);
//               setCartImage(imageFile)
//               const imageUrl = URL.createObjectURL(response.data);
//               return { ...item, imageUrl };
//             } catch (error) {
//               console.error("Error fetching image:", error);
//               return { ...item, imageUrl: "placeholder-image-url" };
//             }
//           })
//         );
//         console.log("cart",cart)
//         setCartItems(cartItemsWithImages);
//       } catch (error) {
//         console.error("Error fetching product data:", error);
//       }
//     };

//     if (cart.length) {
//       fetchImagesAndUpdateCart();
//     }
//   }, [cart,navigate]);

//   useEffect(() => {
//     const total = cartItems.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0
//     );
//     setTotalPrice(total);
//   }, [cartItems]);

//   const converUrlToFile = async (blobData, fileName) => {
//     const file = new File([blobData], fileName, { type: blobData.type });
//     return file;
//   }

//   const handleIncreaseQuantity = (itemId) => {
//     const newCartItems = cartItems.map((item) => {
//       if (item.id === itemId) {
//         if (item.quantity < item.stockQuantity) {
//           return { ...item, quantity: item.quantity + 1 };
//         } else {
//           alert("Cannot add more than available stock");
//         }
//       }
//       return item;
//     });
//     setCartItems(newCartItems);
//   };
  

//   const handleDecreaseQuantity = (itemId) => {
//     const newCartItems = cartItems.map((item) =>
//       item.id === itemId
//         ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
//         : item
//     );
//     setCartItems(newCartItems);
//   };

//   const handleRemoveFromCart = (itemId) => {
//     removeFromCart(itemId);
//     const newCartItems = cartItems.filter((item) => item.id !== itemId);
//     setCartItems(newCartItems);
//   };

//   const handleCheckout = async () => {
//     try {
//       for (const item of cartItems) {
//         const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
//         const updatedStockQuantity = item.stockQuantity - item.quantity;
  
//         const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };
//         console.log("updated product data", updatedProductData)
  
//         const cartProduct = new FormData();
//         cartProduct.append("imageFile", cartImage);
//         cartProduct.append(
//           "product",
//           new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
//         );
  
//         await axios
//           .put(`http://localhost:8080/api/product/${item.id}`, cartProduct, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           })
//           .then((response) => {
//             console.log("Product updated successfully:", (cartProduct));
//           })
//           .catch((error) => {
//             console.error("Error updating product:", error);
//           });
//       }
//       clearCart();
//       setCartItems([]);
//       setShowModal(false);
//     } catch (error) {
//       console.log("error during checkout", error);
//     }
//   };

//   return (
//     <div className="cart-container">
//       <div className="shopping-cart">
//         <div className="title">Shopping Bag</div>
//         {cartItems.length === 0 ? (
//           <div className="empty" style={{ textAlign: "left", padding: "2rem" }}>
//             <h4>Your cart is empty</h4>
//           </div>
//         ) : (
//           <>
//             {cartItems.map((item) => (
//               <li key={item.id} className="cart-item">
//                 <div
//                   className="item"
//                   style={{ display: "flex", alignContent: "center" }}
//                   key={item.id}
//                 >
                 
//                   <div>
//                     <img
//                       src={item.imageUrl}
//                       alt={item.name}
//                       className="cart-item-image"
//                     />
//                   </div>
//                   <div className="description">
//                     <span>{item.brand}</span>
//                     <span>{item.name}</span>
//                   </div>

//                   <div className="quantity">
//                     <button
//                       className="plus-btn"
//                       type="button"
//                       name="button"
//                       onClick={() => handleIncreaseQuantity(item.id)}
//                     >
//                       <i className="bi bi-plus-square-fill"></i>
//                     </button>
//                     <input
//                       type="button"
//                       name="name"
//                       value={item.quantity}
//                       readOnly
//                     />
//                     <button
//                       className="minus-btn"
//                       type="button"
//                       name="button"
//                       onClick={() => handleDecreaseQuantity(item.id)}
//                     >
//                       <i className="bi bi-dash-square-fill"></i>
//                     </button>
//                   </div>

//                   <div className="total-price " style={{ textAlign: "center" }}>
//                     ${item.price * item.quantity}
//                   </div>
//                   <button
//                     className="remove-btn"
//                     onClick={() => handleRemoveFromCart(item.id)}
//                   >
//                     <i className="bi bi-trash3-fill"></i>
//                   </button>
//                 </div>
//               </li>
//             ))}
//             <div className="total">Total: ${totalPrice}</div>
//             <Button
//               className="btn btn-primary"
//               style={{ width: "100%" }}
//               onClick={() => setShowModal(true)}
//             >
//               Checkout
//             </Button>
//           </>
//         )}
//       </div>
//       <CheckoutPopup
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         cartItems={cartItems}
//         totalPrice={totalPrice}
//         handleCheckout={handleCheckout}
//       />
//     </div>

//   );
// };

// export default Cart;
// import React, { useContext, useState, useEffect } from "react";
// // import axios from '../axios';
// import AppContext from "../Context/Context";
// import axios from "axios";
// import CheckoutPopup from "./CheckoutPopup";
// import { Button } from "react-bootstrap";
// const Cart = () => {
//   const { cart, removeFromCart } = useContext(AppContext);
//   const [cartItems, setCartItems] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [cartImage, setCartImage] =useState([])
//   const [showModal, setShowModal] = useState(false);
  
//   // useEffect(() => {
//   //   const fetchImagesAndUpdateCart = async () => {
//   //     console.log("Cart", cart);
//   //     const updatedCartItems = await Promise.all(
//   //       cart.map(async (item) => {
//   //         console.log("ITEM",item)
//   //         try {
//   //           const response = await axios.get(
//   //             `http://localhost:8080/api/product/${item.id}/image`,
//   //             { responseType: "blob" }
//   //           );
//             // const imageFile = await converUrlToFile(response.data,response.data.imageName)
//   //           setCartImage(imageFile);
//   //           const imageUrl = URL.createObjectURL(response.data);
//   //           return { ...item, imageUrl, available: true };
//   //         } catch (error) {
//   //           console.error("Error fetching image:", error);
//   //           return { ...item, imageUrl: "placeholder-image-url", available: false };
//   //         }
//   //       })
//   //     );
//   //     const filteredCartItems = updatedCartItems.filter((item) => item.available);
//   //     setCartItems(updatedCartItems);
     
//   //   };

//   //   if (cart.length) {
//   //     fetchImagesAndUpdateCart();
//   //   }
//   // }, [cart]);

//   useEffect(() => {
//     const fetchImagesAndUpdateCart = async () => {
//       try {
    
//         const response = await axios.get("http://localhost:8080/api/products");
//         const backendProductIds = response.data.map((product) => product.id);

//         const updatedCartItems = cart.filter((item) => backendProductIds.includes(item.id));
//         const cartItemsWithImages = await Promise.all(
//           updatedCartItems.map(async (item) => {
//             try {
//               const response = await axios.get(
//                 `http://localhost:8080/api/product/${item.id}/image`,
//                 { responseType: "blob" }
//               );
//               const imageFile = await converUrlToFile(response.data, response.data.imageName);
//               setCartImage(imageFile)
//               const imageUrl = URL.createObjectURL(response.data);
//               return { ...item, imageUrl };
//             } catch (error) {
//               console.error("Error fetching image:", error);
//               return { ...item, imageUrl: "placeholder-image-url" };
//             }
//           })
//         );

//         setCartItems(cartItemsWithImages);
//       } catch (error) {
//         console.error("Error fetching product data:", error);
    
//       }
//     };

//     if (cart.length) {
//       fetchImagesAndUpdateCart();
//     }
//   }, [cart]);
  


//   useEffect(() => {
//     console.log("CartItems", cartItems);
//   }, [cartItems]);
//   const converUrlToFile = async(blobData, fileName) => {
//     const file = new File([blobData], fileName, { type: blobData.type });
//     return file;
//   }
//   useEffect(() => {
//     const total = cartItems.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0
//     );
//     setTotalPrice(total);
//   }, [cartItems]);

 
//   const handleIncreaseQuantity = (itemId) => {
//     const newCartItems = cartItems.map((item) =>
//       item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
//     );
//     setCartItems(newCartItems);
//   };
//   const handleDecreaseQuantity = (itemId) => {
//     const newCartItems = cartItems.map((item) =>
//       item.id === itemId
//         ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
//         : item
//     );
//     setCartItems(newCartItems);
//   };

//   const handleRemoveFromCart = (itemId) => {
//     removeFromCart(itemId);
//     const newCartItems = cartItems.filter((item) => item.id !== itemId);
//     setCartItems(newCartItems);
//   };

//   const handleCheckout = async () => {
//     try {
//       for (const item of cartItems) {
//         const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
//         const updatedStockQuantity = item.stockQuantity - item.quantity;
  
//         const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };
//         console.log("updated product data", updatedProductData)
  
//         const cartProduct = new FormData();
//         cartProduct.append("imageFile", cartImage);
//         cartProduct.append(
//           "product",
//           new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
//         );
  
//         await axios
//           .put(`http://localhost:8080/api/product/${item.id}`, cartProduct, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           })
//           .then((response) => {
//             console.log("Product updated successfully:", (cartProduct));
            
//           })
//           .catch((error) => {
//             console.error("Error updating product:", error);
//           });
//       }
//       setCartItems([]);
//       setShowModal(false);
//     } catch (error) {
//       console.log("error during checkout", error);
//     }
//   };
  
//   return (
//     <div className="cart-container">
//       <div className="shopping-cart">
//         <div className="title">Shopping Bag</div>
//         {cartItems.length === 0 ? (
//           <div className="empty" style={{ textAlign: "left", padding: "2rem" }}>
//             <h4>Your cart is empty</h4>
//           </div>
//         ) : (
//           <>
//             {cartItems.map((item) => (
//               <li key={item.id} className="cart-item">
//                 <div
//                   className="item"
//                   style={{ display: "flex", alignContent: "center" }}
//                   key={item.id}
//                 >
//                   <div className="buttons">
//                     <div className="buttons-liked">
//                       <i className="bi bi-heart"></i>
//                     </div>
//                   </div>
//                   <div>
//                     <img
//                       // src={cartImage ? URL.createObjectURL(cartImage) : "Image unavailable"}
//                       src={item.imageUrl}
//                       alt={item.name}
//                       className="cart-item-image"
//                     />
//                   </div>
//                   <div className="description">
//                     <span>{item.brand}</span>
//                     <span>{item.name}</span>
//                   </div>

//                   <div className="quantity">
//                     <button
//                       className="plus-btn"
//                       type="button"
//                       name="button"
//                       onClick={() => handleIncreaseQuantity(item.id)}
//                     >
//                       <i className="bi bi-plus-square-fill"></i>
//                     </button>
//                     <input
//                       type="button"
//                       name="name"
//                       value={item.quantity}
//                       readOnly
//                     />
//                     <button
//                       className="minus-btn"
//                       type="button"
//                       name="button"
//                       // style={{ backgroundColor: "white" }}
//                       onClick={() => handleDecreaseQuantity(item.id)}
//                     >
//                       <i className="bi bi-dash-square-fill"></i>
//                     </button>
//                   </div>

//                   <div className="total-price " style={{ textAlign: "center" }}>
//                     ${item.price * item.quantity}
//                   </div>
//                   <button
//                     className="remove-btn"
//                     onClick={() => handleRemoveFromCart(item.id)}
//                   >
//                     <i className="bi bi-trash3-fill"></i>
//                   </button>
//                 </div>
//               </li>
//             ))}
//             <div className="total">Total: ${totalPrice}</div>
//             <button
//               className="btn btn-primary"
//               style={{ width: "100%" }}
//               onClick={handleCheckout}
//             >
//               Checkout
//             </button>
//           </>
//         )}
//       </div>
//       <CheckoutPopup
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         cartItems={cartItems}
//         totalPrice={totalPrice}
//         handleCheckout={handleCheckout}
//       />
//     </div>

//   );
// };

// export default Cart;



