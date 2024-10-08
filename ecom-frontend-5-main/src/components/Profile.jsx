// 
// http://192.168.77.227:8080
import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
import axios from "../axiosProduct";
// import AppContext from '../Context/C ontext';
import './Profile.css';
import { Link, useNavigate } from 'react-router-dom'; 
import { left } from '@popperjs/core';
import Wishlist from './Wishlist';
const Profile = () => { 
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    handleUpload(e.target.files[0]);
  };

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('/profile/profile-photo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.imageData) {
          const base64Image = `data:${response.data.imageType};base64,${response.data.imageData}`;
          setProfilePhoto(base64Image);
        }
      } catch (error) {
        console.error('Error fetching profile photo:', error);
      }
    };

    fetchProfilePhoto();
  }, []);

  const handleUpload = async (selectedFile) => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.post('/profile/upload-photo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get('/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.user);
        setProducts(response.data.products);
        setUsername(response.data.user.username);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handlePlaceholderClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('jwt');
      await axios.put('/profile/update-username', { username }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };


  return (
    <>
    <Wishlist/>
    <div style={{padding:40}}></div>
    <div className="profile-card">
    <div>
      {profilePhoto ? (
        <>
          <img
          onClick={handlePlaceholderClick} 
            src={profilePhoto}
            alt="Profile"
            style={{ width: '150px', height: '150px', borderRadius: '80%', cursor: 'pointer' }}
          />
          <br />
          <input type="file" id="fileInput" onChange={handleFileChange} style={{ display: 'none' }} />
          <br />
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </>
      ) : (
        // Placeholder with a clickable symbol for adding a photo
        <div onClick={handlePlaceholderClick} style={{ cursor: 'pointer' }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '2px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#ccc'
            }}
          >
            +
          </div>
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
    <div style={{width:"3%"}}></div>
    <div className="profile-container">
      {isEditing ? (
        <input
        style={{width:"100%"}}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={handleSave} // Save on blur
          autoFocus
          />
        ) : (
          <h2>{username}</h2>
        )}
        <b><p className="profile-email">{userData.mailId}</p></b>
        <b><p className="profile-products">Products Posted: {products.length}</p></b>
      <button onClick={handleEditToggle}>
        {isEditing ? 'Save' : 'Edit Profile'}
      </button>
    </div>
    {/* <div className="profile-container">
    <button className="btn" onClick={() => navigate('/edit-profile')}>
    Edit Profile
</button>
    </div> */}

</div>


    

      <div
        className="grid"
        style={{
          marginTop: "64px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
          {products.map((product) => {
            const { id, brand, name, price, productAvailable, viewCount } =
              product;
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
                  justifyContent:'flex-start',
                  alignItems:'stretch'
                }}
                key={id}
              >
                <Link
                  to={`/product/${id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img
                  src={`data:${product.imageType};base64,${product.imageDate}`}
                  alt={product.name}
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
                        style={{ fontWeight: "600", fontSize: "1.1rem",marginBottom:'5px' }}
                      >
                        <i className="bi bi-currency-rupee"></i>
                        {price}
                      </h5>
                    </div>
                    <p>
                      Views : {product.viewCount} 
                      {/* Views : 0 */}
                    </p>
                    {/* <button
                      className="btn-hover color-9"
                      style={{margin:'10px 25px 0px '  }}
                      onClick={(e) => {
                        e.preventDefault();
                        // addToCart(product);
                        handleAddToCart(product);
                      }}
                      disabled={!productAvailable}
                    >
                      {productAvailable ? "Add to Cart" : "Out of Stock"}
                    </button>  */}
                  </div>
                </Link>
              </div>
            ); 
})}
</div>
    </>
  );
};

export default Profile;
