import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";
import Loader from "./Loader";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Function to handle adding product to the cart
  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("jwt"); // Check for JWT token
    if (!token) {
      console.log("No token found, redirecting to login.");
      navigate("/login"); // If no token, redirect to login page
      return;
    }

    try {
      setLoading(true); // Show loader while validating token
      const response = await fetch('http://192.168.77.227:8080/jwtcheck', {
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
      setLoading(false); // Hide loader after token validation
      const userDetails = await response.json();
      console.log(userDetails);

      // Add product to the cart if token is valid
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

  // Fetch and update the products only once when the component mounts
  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched, data]);

  // Fetch product images when data is available
  useEffect(() => {
    setLoading(true); // Show loader while fetching images
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `http://192.168.77.227:8080/api/product/${product.id}/image`,
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
  
      // Simulate a delay of 3 seconds for the loader
      setTimeout(() => {
        fetchImagesAndUpdateProducts().then(() => {
          setLoading(false); // Hide loader after 3 seconds
        });
      }, 1500); // Set the timeout to 3 seconds
    }
  }, [data]);
  
  // Show loader while loading is true
  if (loading) {
    return <Loader />;
  }
  
  // Show loader if data is still being fetched

  // Filter products based on the selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  // Handle errors
  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        <img src={unplugged} alt="Error" style={{ width: '100px', height: '100px' }} />
      </h2>
    );
  }

  return (
    <>
    <div style={{padding:'1px'}}></div>
    <div
  className="grid"
  style={{
    marginTop: "65px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", // Adjusted to a smaller min width
    padding: "8px",
    gap: "15px", // Optional: Adds space between cards
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
            height:'90%',
            width: "100%", // Use full width of grid column
            maxWidth: "200px", // Limit max width for larger screens
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
                height: "90px", // Reduced height
                objectFit: "cover",
                padding: "5px",
                margin: "0",
                borderRadius: "10px 10px 0 0", // Slightly adjust border radius
              }}
            />
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
                <h5
                  className="card-title"
                  style={{fontFamily: "Times New Roman", margin: "0 0 1px 0px", fontSize: "1.2rem" }} // Reduced font size
                >
                  {name}
                  {/* {name.toUpperCase()} */}
                </h5>
                <i
                  className="card-brand"
                  style={{ fontFamily: "Times New Roman", fontSize: "0.7rem" }} // Reduced font size
                >
                  {"Brand : " + brand}
                </i>
              </div>
              <div className="home-cart-price">
                <h5
                  className="card-text"
                  style={{ fontWeight: "600", fontSize: "1rem", marginBottom: '6px' }} // Reduced font size
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
                  height: '0%',
                  margin: '0px 0px 0px ',
                  padding: '6px 15px', // Adjust padding for smaller size
                  fontSize: '0.8rem', // Adjust font size
                  width: '100%', // Set a specific width if needed
                  maxWidth: '150px', // Limit max width
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
          </Link>
        </div>
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
