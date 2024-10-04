import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Navbar = ({ onSelectCategory, onSearch }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const navigate = useNavigate(); 
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("jwt"));

  // Track token updates
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("jwt"));
    };

    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/search?keyword=${value}`
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleCategorySelect = (category) => {
    console.log(category)
    navigate('/')
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("currentuser");
    setToken(null); // Update state to re-render the navbar
  };

  const categories = [
    "Seed",
    "Equipment",
    "Tools",
    "Machinary",
    "Herbicide",
    "Pesticides",
  ];

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="">
            AgroConnect
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">
                  Home
                </a>
              </li>
              {/* <li className="nav-item">
                <a className="nav-link" href="/add_product">
                  Add Product
                </a>
              </li> */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categories
                </a>
                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className="dropdown-item"
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Conditionally render Login/Register or Logout based on token */}
              {!token ? (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/login">
                      Login
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/register">
                      Register
                    </a>
                  </li>
                </>
              ) : (
                <>
                <li className="nav-item">
                <a className="nav-link" href="/add_product">
                  Add Product
                </a>
              </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/profile">
                      Profile
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleLogout} href="/">
                      Logout
                    </a>
                  </li>
                </>
              )}
            </ul>
            <button className="theme-btn" onClick={toggleTheme}>
              {theme === "dark-theme" ? (
                <i className="bi bi-moon-fill"></i>
              ) : (
                <i className="bi bi-sun-fill"></i>
              )}
            </button>
            <div className="d-flex align-items-center cart">
              <a href="/cart" className="nav-link text-dark">
                <i
                  className="bi bi-cart me-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "1.7rem",
                    padding: 10,
                  }}
                >
                  Cart
                </i>
              </a>

              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {showSearchResults && (
                <ul className="list-group">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <li key={result.id} className="list-group-item">
                        <a href={`/product/${result.id}`} className="search-result-link">
                          <span>{result.name}</span>
                        </a>
                      </li>
                    ))
                  ) : (
                    noResults && (
                      <p className="no-results-message">
                        No Product with such Name
                      </p>
                    )
                  )}
                </ul>
              )}
              <div />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Navbar = ({ onSelectCategory, onSearch }) => {
//   const getInitialTheme = () => {
//     const storedTheme = localStorage.getItem("theme");
//     return storedTheme ? storedTheme : "light-theme";
//   };

//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [theme, setTheme] = useState(getInitialTheme());
//   const [input, setInput] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [noResults, setNoResults] = useState(false);
//   const [searchFocused, setSearchFocused] = useState(false);
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [token, setToken] = useState(localStorage.getItem("jwt"));

//   useEffect(() => {
//     const handleStorageChange = () => {
//       setToken(localStorage.getItem("jwt"));
//     };

//     window.addEventListener("storage", handleStorageChange);

//     // Cleanup the event listener on component unmount
//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, []);
//   useEffect(() => {
//     fetchData();
//   }, []);
  
//   // const token = localStorage.getItem("jwt")
//   const fetchData = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/products");
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleChange = async (value) => {
//     setInput(value);
//     if (value.length >= 1) {
//       setShowSearchResults(true);
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/api/products/search?keyword=${value}`
//         );
//         setSearchResults(response.data);
//         setNoResults(response.data.length === 0);
//       } catch (error) {
//         console.error("Error searching:", error);
//       }
//     } else {
//       setShowSearchResults(false);
//       setSearchResults([]);
//       setNoResults(false);
//     }
//   };

//   const handleCategorySelect = (category) => {
//     setSelectedCategory(category);
//     onSelectCategory(category);
//   };

//   const toggleTheme = () => {
//     const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//   };

//   useEffect(() => {
//     document.body.className = theme;
//   }, [theme]);

//   const categories = [
//     "Seed",
//     "Equipment",
//     "Tools",
//     "Machinery",
//     "Herbicide",
//     "Pesticides",
//   ];

//   return (
//     <>
//       <header>
//         <nav className="navbar navbar-expand-lg fixed-top">
//           <div className="container-fluid">
//             <a className="navbar-brand" href="">
//               AgroConnect
//             </a>
//             <button
//               className="navbar-toggler"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#navbarSupportedContent"
//               aria-controls="navbarSupportedContent"
//               aria-expanded="false"
//               aria-label="Toggle navigation"
//             >
//               <span className="navbar-toggler-icon"></span>
//             </button>
//             <div className="collapse navbar-collapse" id="navbarSupportedContent">
//               <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//                 <li className="nav-item">
//                   <a className="nav-link active" aria-current="page" href="/">
//                     Home
//                   </a>
//                 </li>
//                 <li className="nav-item">
//                   <a className="nav-link" href="/add_product">
//                     Add Product
//                   </a>
//                 </li>
//                 <li className="nav-item dropdown">
//                   <a
//                     className="nav-link dropdown-toggle"
//                     href="/"
//                     role="button"
//                     data-bs-toggle="dropdown"
//                     aria-expanded="false"
//                   >
//                     Categories
//                   </a>
//                   <ul className="dropdown-menu">
//                     {categories.map((category) => (
//                       <li key={category}>
//                         <button
//                           className="dropdown-item"
//                           onClick={() => handleCategorySelect(category)}
//                         >
//                           {category}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 </li>
//                 {!token ? (
//                 <><li className="nav-item">
//                     <a className="nav-link" href="/login">
//                       Login
//                     </a>
//                   </li><li className="nav-item">
//                       <a className="nav-link" href="/register">
//                         Register
//                       </a>
//                     </li>
//                     </>) : (
//                     <li className="nav-item">
//                       <a className="nav-link" href="/logout">
//                         Logout
//                       </a>
//                     </li>
//                   )}
//                 <li className="nav-item">
//                   <a className="nav-link" href="/profile">
//                     Profile
//                   </a>
//                 </li>
//               </ul>
//               <button className="theme-btn" onClick={toggleTheme}>
//                 {theme === "dark-theme" ? (
//                   <i className="bi bi-moon-fill"></i>
//                 ) : (
//                   <i className="bi bi-sun-fill"></i>
//                 )}
//               </button>
//               <div className="d-flex align-items-center cart">
//               <a href="/cart" className="nav-link text-dark">
//   <i
//     className="bi bi-cart me-2"
//     style={{ display: "flex", alignItems: "center", fontSize: "1.7rem", padding:10}} // Adjust fontSize to increase icon size
//   >
//     Cart
//   </i>
// </a>

//                 <input
//                   className="form-control me-2"
//                   type="search"
//                   placeholder="Search"
//                   aria-label="Search"
//                   value={input}
//                   onChange={(e) => handleChange(e.target.value)}
//                   onFocus={() => setSearchFocused(true)}
//                   onBlur={() => setSearchFocused(false)}
//                 />
//                 {showSearchResults && (
//                   <ul className="list-group">
//                     {searchResults.length > 0 ? (
//                       searchResults.map((result) => (
//                         <li key={result.id} className="list-group-item">
//                           <a href={`/product/${result.id}`} className="search-result-link">
//                             <span>{result.name}</span>
//                           </a>
//                         </li>
//                       ))
//                     ) : (
//                       noResults && (
//                         <p className="no-results-message">
//                           No Product with such Name
//                         </p>
//                       )
//                     )}
//                   </ul>
//                 )}
//                 <div />
//               </div>
//             </div>
//           </div>
//         </nav>
//       </header>
//     </>
//   );
// };

// export default Navbar;

// import React, { useEffect, useState } from "react";
// import Home from "./Home"
// import axios from "axios";

// const Navbar = ({ onSelectCategory, onSearch }) => {
//   const getInitialTheme = () => {
//     const storedTheme = localStorage.getItem("theme");
//     return storedTheme ? storedTheme : "light-theme";
//   };
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [theme, setTheme] = useState(getInitialTheme());
//   const [input, setInput] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [noResults, setNoResults] = useState(false);
//   const [searchFocused, setSearchFocused] = useState(false);
//   const [showSearchResults,setShowSearchResults] = useState(false)
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async (value) => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/products");
//       setSearchResults(response.data);
//       console.log(response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleChange = async (value) => {
//     setInput(value);
//     if (value.length >= 1) {
//       setShowSearchResults(true)
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/products/search?keyword=${value}`
//       );
//       setSearchResults(response.data);
//       setNoResults(response.data.length === 0);
//       console.log(response.data);
//     } catch (error) {
//       console.error("Error searching:", error);
//     }
//     } else {
//       setShowSearchResults(false);
//       setSearchResults([]);
//       setNoResults(false);
//     }
//   };

  
//   // const handleChange = async (value) => {
//   //   setInput(value);
//   //   if (value.length >= 1) {
//   //     setShowSearchResults(true);
//   //     try {
//   //       let response;
//   //       if (!isNaN(value)) {
//   //         // Input is a number, search by ID
//   //         response = await axios.get(`http://localhost:8080/api/products/search?id=${value}`);
//   //       } else {
//   //         // Input is not a number, search by keyword
//   //         response = await axios.get(`http://localhost:8080/api/products/search?keyword=${value}`);
//   //       }

//   //       const results = response.data;
//   //       setSearchResults(results);
//   //       setNoResults(results.length === 0);
//   //       console.log(results);
//   //     } catch (error) {
//   //       console.error("Error searching:", error.response ? error.response.data : error.message);
//   //     }
//   //   } else {
//   //     setShowSearchResults(false);
//   //     setSearchResults([]);
//   //     setNoResults(false);
//   //   }
//   // };

//   const handleCategorySelect = (category) => {
//     setSelectedCategory(category);
//     onSelectCategory(category);
//   };
//   const toggleTheme = () => {
//     const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//   };

//   useEffect(() => {
//     document.body.className = theme;
//   }, [theme]);

//   const categories = [
//     "Seed",
//     "Equipment",
//     "Tools",
//     "Machinary",
//     "Herbisite",
//     "Pesticides",
//   ];
//   return (
//     <>
//       <header>
//         <nav className="navbar navbar-expand-lg fixed-top">
//           <div className="container-fluid">
//             <a className="navbar-brand" href="">
//               AgroConnect
//             </a>
//             <button
//               className="navbar-toggler"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#navbarSupportedContent"
//               aria-controls="navbarSupportedContent"
//               aria-expanded="false"
//               aria-label="Toggle navigation"
//             >
//               <span className="navbar-toggler-icon"></span>
//             </button>
//             <div
//               className="collapse navbar-collapse"
//               id="navbarSupportedContent"
//             >
//               <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//                 <li className="nav-item">
//                   <a className="nav-link active" aria-current="page" href="/">
//                     Home
//                   </a>
//                 </li>
//                 <li className="nav-item">
//                   <a className="nav-link" href="/add_product">
//                     Add Product
//                   </a>
//                 </li>

//                 <li className="nav-item dropdown">
//                   <a
//                     className="nav-link dropdown-toggle"
//                     href="/"
//                     role="button"
//                     data-bs-toggle="dropdown"
//                     aria-expanded="false"
//                   >
//                     Categories
//                   </a>

//                   <ul className="dropdown-menu">
//                     {categories.map((category) => (
//                       <li key={category}>
//                         <button
//                           className="dropdown-item"
//                           onClick={() => handleCategorySelect(category)}
//                         >
//                           {category}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 </li>
//                 <li className="nav-item"></li>
//               </ul>

//               <button className="theme-btn" onClick={() => toggleTheme()}>
//                 {theme === "dark-theme" ? (
//                   <i className="bi bi-moon-fill"></i>
//                 ) : ( 
//                   <i className="bi bi-sun-fill"></i>
//                 )}
//               </button>
//               <div className="d-flex align-items-center cart">
//                 <a href="/cart" className="nav-link text-dark">
//                   <i
//                     className="bi bi-cart me-2"
//                     style={{ display: "flex", alignItems: "center" }}
//                   >
//                     Cart
//                   </i>
//                 </a>
//                 {/* <form className="d-flex" role="search" onSubmit={handleSearch} id="searchForm"> */}
//                 <input
//                   className="form-control me-2"
//                   type="search"
//                   placeholder="Search"
//                   aria-label="Search"
//                   value={input}
//                   onChange={(e) => handleChange(e.target.value)}
//                   onFocus={() => setSearchFocused(true)} // Set searchFocused to true when search bar is focused
//                   onBlur={() => setSearchFocused(false)} // Set searchFocused to false when search bar loses focus
//                 />
//                 {showSearchResults && (
//                   <ul className="list-group">
//                     {searchResults.length > 0 ? (  
//                         searchResults.map((result) => (
//                           <li key={result.id} className="list-group-item">
//                             <a href={`/product/${result.id}`} className="search-result-link">
//                             <span>{result.name}</span>
//                             </a>
//                           </li>
//                         ))
//                     ) : (
//                       noResults && (
//                         <p className="no-results-message">
//                           No Prouduct with such Name
//                         </p>
//                       )
//                     )}
//                   </ul>
//                 )}
//                 {/* <button
//                   className="btn btn-outline-success"
//                   onClick={handleSearch}
//                 >
//                   Search Products
//                 </button> */}
//                 {/* </form> */}
//                 <div />
//               </div>
//             </div>
//           </div>
//         </nav>
//       </header>
//     </>
//   );
// };

// export default Navbar;
