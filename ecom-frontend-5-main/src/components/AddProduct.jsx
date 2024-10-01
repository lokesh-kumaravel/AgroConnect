import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    // setProduct({...product, image: e.target.files[0]})
  };

  const handleProtector = async() =>
  {
    var token = localStorage.getItem('jwt')
    console.log(token);
    if (!token) {
      navigate('/login');
      return;
    }
    const response = await fetch('http://localhost:8080/jwtcheck', {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + token,
      },
  });

  if (response.ok) {
      const userDetails = await response.json();
      console.log(userDetails)
      // Proceed to load dashboard or set user state
  } else {
      // Handle invalid token case
      navigate('/login');
  }

  }
  const submitHandler = async (event) => {
    event.preventDefault();
    const curid = localStorage.getItem("currentuser");
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    formData.append("userid",curid);
    var token = localStorage.getItem('jwt')
    const response = await fetch('http://localhost:8080/jwtcheck', {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + token,
      },
  });
  if(response.ok)
  {

    console.log("This is the token: "+token)
    axios
    .post("http://localhost:8080/api/product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // "userid":curid
      },
    })
    .then((response) => {
      console.log("Product added successfully:", response.data);
      alert("Product added successfully");
    })
    .catch((error) => {
      console.error("Error adding product:", error);
      alert("Error adding product");
    });
  };
}
  useEffect(() => {
    handleProtector();
}, []);

  return (
    <div className="container">
    <div className="center-container">
      <form className="row g-3 pt-5" onSubmit={submitHandler}>
        <div className="col-md-6">
          <label className="form-label">
            <h6>Name</h6>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Product Name"
            onChange={handleInputChange}
            value={product.name}
            name="name"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            <h6>Brand</h6>
          </label>
          <input
            type="text"
            name="brand"
            className="form-control"
            placeholder="Enter your Brand"
            value={product.brand}
            onChange={handleInputChange}
            id="brand"
          />
        </div>
        <div className="col-12">
          <label className="form-label">
            <h6>Description</h6>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Add product description"
            value={product.description}
            name="description"
            onChange={handleInputChange}
            id="description"
          />
        </div>
        <div className="col-5">
          <label className="form-label">
            <h6>Price</h6>
          </label>
          <input
            type="number"
            className="form-control"
            placeholder="Eg: $1000"
            onChange={handleInputChange}
            value={product.price}
            name="price"
            id="price"
          />
        </div>
     
           <div className="col-md-6">
          <label className="form-label">
            <h6>Category</h6>
          </label>
          <select
            className="form-select"
            value={product.category}
            onChange={handleInputChange}
            name="category"
            id="category"
          >
            <option value="">Select category</option>
            <option value="Seed">Seed</option>
            <option value="Equipment">Equipment</option>
            <option value="Tools">Tools</option>
            <option value="Machinary">Machinary</option>
            <option value="Herbisite">Herbisite</option>
            <option value="Pesticides">Pesticides</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">
            <h6>Stock Quantity</h6>
          </label>
          <input
            type="number"
            className="form-control"
            placeholder="Stock Remaining"
            onChange={handleInputChange}
            value={product.stockQuantity}
            name="stockQuantity"
            // value={`${stockAlert}/${stockQuantity}`}
            id="stockQuantity"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">
            <h6>Release Date</h6>
          </label>
          <input
            type="date"
            className="form-control"
            value={product.releaseDate}
            name="releaseDate"
            onChange={handleInputChange}
            id="releaseDate"
          />
        </div>
        {/* <input className='image-control' type="file" name='file' onChange={(e) => setProduct({...product, image: e.target.files[0]})} />
    <button className="btn btn-primary" >Add Photo</button>  */}
        <div className="col-md-4">
          <label className="form-label">
            <h6>Image</h6>
          </label>
          <input
            className="form-control"
            type="file"
            onChange={handleImageChange}
          />
        </div>
        <div className="col-12">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="productAvailable"
              id="gridCheck"
              checked={product.productAvailable}
              onChange={(e) =>
                setProduct({ ...product, productAvailable: e.target.checked })
              }
            />
            <label className="form-check-label">Product Available</label>
          </div>
        </div>
        <div className="col-12">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={submitHandler}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddProduct;
