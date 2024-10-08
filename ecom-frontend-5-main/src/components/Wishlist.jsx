import React, { useEffect, useState } from 'react';
import axios from "../axiosProduct";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("currentuser"); // Replace with actual user ID

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`/api/wishlist/products/${userId}`); // Adjusted the endpoint
        setWishlist(response.data); // This now contains an array of product objects
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul>
          {wishlist.map(product => (
            <li key={product.id}> {/* Assuming each product has a unique 'id' */}
              <h2>{product.name}</h2> {/* Display product name */}
              <p>Price: ${product.price}</p> {/* Display product price */}
              <span>Product ID: {product.id}</span> {/* Display product ID */}
              {/* You can add more details about the product here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
