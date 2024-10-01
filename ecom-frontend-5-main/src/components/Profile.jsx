import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import { Link, useNavigate } from 'react-router-dom'; 
const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('jwt'); // assuming JWT is stored in local storage
            if (!token) {
                navigate("/login");
                return; // Exit early if there's no token
            }

            const response = await axios.get('http://localhost:8080/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUserData(response.data.user);
            setProducts(response.data.products);
            console.log("Fetched products:", response.data.products);
        } catch (error) {
            console.error('Error fetching profile data:', error);
            // Optional: Navigate to login or show a message if there's an error
            navigate("/login");
        }
    };

    fetchProfile();
}, [navigate]); 
const theme = localStorage.getItem("theme");
useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (<div className="profile-container">
    <div className="profile-card">
        <div className="profile-header">
            <h2>Your Profile</h2>
            <p>Products Posted:</p>
        </div>
        <div className="profile-content">
            <div className="product-list">
                {/* <div style={{display:'flex'}}> */}
                    {products.map(product => (
                        <Link 
                          to={`/product/${product.id}`}  // Only one Link component
                          key={product.id}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="product-card">
                                <img 
                                  src={`data:${product.imageType};base64,${product.imageDate}`} 
                                  alt={product.name} 
                                  className="product-image" 
                                />
                                <h4>{product.name}</h4>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                            </div>
                        </Link>
                    ))}
                {/* </div> */}
            </div>
        </div>
    </div>
</div>

  );
};

export default Profile;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Profile.css';

// const Profile = () => {
//   const [userData, setUserData] = useState(null);
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem('jwt'); // assuming JWT is stored in local storage
//         const response = await axios.get('http://localhost:8080/profile', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUserData(response.data.user);
//         setProducts(response.data.products);
//       } catch (error) {
//         console.error('Error fetching profile data:', error);
//       }
//     };
//     fetchProfile();
//   }, []);

//   if (!userData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="profile-container">
//       <div className="profile-card">
//         <div className="profile-header">
//           <h2>{userData.name}</h2>
//           <p>{userData.email}</p>
//         </div>
//         <div className="profile-content">
//           <h3>Products Posted:</h3>
//           <div className="product-list">
//             {products.map((product, index) => (
//               <div key={index} className="product-card">
//                 <h4>{product.name}</h4>
//                 <p>{product.description}</p>
//                 <p>Price: ${product.price}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
