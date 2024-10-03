import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AppContext from "../Context/Context";
import './Profile.css';
import { Link, useNavigate } from 'react-router-dom'; 
const Profile = () => {

  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const count = products.length;
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const token = localStorage.getItem('jwt'); // Assuming JWT is stored in local storage
        const response = await axios.get('http://localhost:8080/profile/profile-photo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.imageData) {
          const base64Image = `data:${response.data.imageType};base64,${response.data.imageData}`;
          setProfilePhoto(base64Image); // Set the image URL for display
        }
      } catch (error) {
        console.error('Error fetching profile photo:', error);
      }
    };

    fetchProfilePhoto();
  }, []);
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('jwt'); // Assuming you store the token in localStorage
      const response = await axios.post('http://localhost:8080/profile/upload-photo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response.data);
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
    window.location.reload()  
  };
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

  return (
    <>
    {/* <br></br><br></br><br></br><br></br> */}
    <div style={{padding:40}}></div>
    <div className="profile-card">
    <div>
      {profilePhoto ? (
        <>
        <img src={profilePhoto} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
        <br></br><input type="file" onChange={handleFileChange} placeholder='edit profile'/>
        <br></br><button onClick={handleUpload}>Edit</button>
        </>
      ) : (
        // <p>No profile photo available</p>
        <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Profile Photo</button>
    </div>
      )}
    </div>
    {/* <img src="profile-photo-url.jpg" alt="Profile Photo" class="profile-photo" /> */}
    <div className="profile-info">
        <h2 className="profile-name">John Doe</h2>
        <p className="profile-email">johndoe@example.com</p>
        <b><p className="profile-products">Products Posted: {count}</p></b>
    </div>
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
        {/* <h2>Your Profile</h2>
        <p>Products Posted:</p> */}
          {products.map((product) => {
            const { id, brand, name, price, productAvailable } =
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
                      Views : 0
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
