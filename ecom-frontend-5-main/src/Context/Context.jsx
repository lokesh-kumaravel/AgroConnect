import axios from "../axios";
import { useState, useEffect, createContext } from "react"; 

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
  refreshData: () => {},
  clearCart: () => {},
  userId: null,
  setUserId: (id) => {},
  logout: () => {},
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [userId, setUserId] = useState(null);

  // Set userId from localStorage on initial render
  useEffect(() => {
    const storedUserId = localStorage.getItem('currentuser');
    if (storedUserId) {
      setUserId(storedUserId); // Set the userId from localStorage if it exists
    }
  }, []);

  const addToCart = async (product) => {
    if (!userId) {
        console.error("User ID is null, cannot add to cart.");
        return; // Early return if userId is null
    }

    console.log(product)
    const cartItem = { productId: product.id, quantity: 1 };

    try {
      const token = localStorage.getItem('jwt');
      console.log(userId)
        const response = await axios.put(`http://localhost:8080/users/${userId}/cart`, cartItem, {
          // method:'PUT',
            headers: { Authorization: "Bearer "+token }
        });
        setCart(response.data.cart); // Update the frontend cart
    } catch (error) {
        console.error("Error adding to cart", error.response ? error.response.data : error);
    }
    console.log("Here")
};


  const removeFromCart = async (productId) => {
    if (!userId) {
      console.error("User ID is null, cannot remove from cart.");
      return; // Early return if userId is null
    }

    try {
      const response = await axios.delete(`/users/${userId}/cart/${productId}`);
      setCart(response.data.cart); // Update the frontend cart
    } catch (error) {
      console.error("Error removing from cart", error);
    }
  };

  const refreshData = async () => {
    try {
      const response = await axios.get("/products");
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('currentuser'); // Clear userId on logout
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchCart = async (userId) => {
        try {
            const token = localStorage.getItem("jwt"); // Assuming token is stored in local storage
            console.log(token+" "+userId)
            const response = await axios.get(`http://localhost:8080/users/${userId}/cart`, {
                headers: {
                    Authorization: "Bearer "+token // Include JWT token in Authorization header
                }
            });
            // Handle response
        } catch (error) {
            console.error("Error fetching cart", error);
        }
    };
    
      var id = localStorage.getItem("currentuser")
      fetchCart(id);
    }
  }, [userId]);

  return (
    <AppContext.Provider value={{ data, isError, cart, addToCart, removeFromCart, refreshData, clearCart, userId, setUserId, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

// import axios from "../axios";
// import { useState, useEffect, createContext } from "react";
// import { useNavigate } from 'react-router-dom'; 

// const AppContext = createContext({
//   data: [],
//   isError: "",
//   cart: [],
//   addToCart: (product) => {},
//   removeFromCart: (productId) => {},
//   refreshData: () => {},
//   clearCart: () => {},
//   userId: null,
//   setUserId: (id) => {},
//   logout: () => {},
// });

// export const AppProvider = ({ children }) => {
//   const [data, setData] = useState([]);
//   const [isError, setIsError] = useState("");
//   const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
//   const [userId, setUserId] = useState(null);

//   const addToCart = (product) => {
//     const existingProductIndex = cart.findIndex((item) => item.id === product.id);
//     if (existingProductIndex !== -1) {
//       const updatedCart = cart.map((item, index) =>
//         index === existingProductIndex
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//       setCart(updatedCart);
//     } else {
//       const updatedCart = [...cart, { ...product, quantity: 1 }];
//       setCart(updatedCart);
//     }
//     localStorage.setItem('cart', JSON.stringify(cart));
//   };

//   const removeFromCart = (productId) => {
//     const updatedCart = cart.filter((item) => item.id !== productId);
//     setCart(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//   };

//   const refreshData = async () => {
//     try {
//       const response = await axios.get("/products");
//       setData(response.data);
//     } catch (error) {
//       setIsError(error.message);
//     }
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const logout = () => {
//     setUserId(null);
//     localStorage.removeItem('jwt');
//   };

//   useEffect(() => {
//     refreshData();
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cart));
//   }, [cart]);

//   return (
//     <AppContext.Provider value={{ data, isError, cart, addToCart, removeFromCart, refreshData, clearCart, userId, setUserId, logout }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export default AppContext;

// import axios from "../axios";
// import { useState, useEffect, createContext } from "react";
// import { useNavigate } from 'react-router-dom'; 

// const AppContext = createContext({
//   data: [],
//   isError: "",
//   cart: [],
//   addToCart: (product) => {},
//   removeFromCart: (productId) => {},
//   refreshData:() =>{},
//   updateStockQuantity: (productId, newQuantity) =>{}
  
// });
// // const Logout = () => {
// //     const navigate = useNavigate();
// //     useEffect(() => {
//   //         localStorage.removeItem('jwt');
//   //         navigate("/login");
//   //     }, [navigate]); 
  
//   //     return null; 
//   // }
  
//   // export default Logout;
  
//   export const AppProvider = ({ children }) => {
//     const [data, setData] = useState([]);
//     const [isError, setIsError] = useState("");
//     const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
//     const [userId, setUserId] = useState(null); 
//   // const navigate = useNavigate();
//   // useEffect(() => {
//   //           var token  localStorage.getItem('jwt');
//   //           navigate("/login");
//   //       }, [navigate]); 
    

//   const addToCart = (product) => {
//     const existingProductIndex = cart.findIndex((item) => item.id === product.id);
//     if (existingProductIndex !== -1) {
//       const updatedCart = cart.map((item, index) =>
//         index === existingProductIndex
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//       setCart(updatedCart);
//       localStorage.setItem('cart', JSON.stringify(updatedCart));
//     } else {
//       const updatedCart = [...cart, { ...product, quantity: 1 }];
//       setCart(updatedCart);
//       localStorage.setItem('cart', JSON.stringify(updatedCart));
//     }
//   };

//   const removeFromCart = (productId) => {
//     console.log("productID",productId)
//     const updatedCart = cart.filter((item) => item.id !== productId);
//     setCart(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//     console.log("CART",cart)
//   };

//   const refreshData = async () => {
//     try {
//       const response = await axios.get("/products");
//       setData(response.data);
//     } catch (error) {
//       setIsError(error.message);
//     }
//   };

//   const clearCart =() =>{
//     setCart([]);
//   }
  
//   useEffect(() => {
//     refreshData();
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cart));
//   }, [cart]);
  
//   return (
//     <AppContext.Provider value={{ data, isError, cart, addToCart, removeFromCart,refreshData, clearCart, userId, setUserId  }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export default AppContext;