import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import 'font-awesome/css/font-awesome.min.css'; 
import './Register.css';
const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        const userData = {
            username: name,
            mailId: email,
            password: password,
        };
        try {
            const response = await fetch('http://172.16.2.211:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                const registeredUser = await response.json();
                console.log("User registered successfully", registeredUser);
                navigate("/login");
            } else {
                console.log("Registration Failed");
            }
        } catch (error) {
            console.error("Error occurred during registration:", error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '5px' }}>
            <div className="container">
                <h1 className="heading">Register</h1>
                <form className="form" onSubmit={handleRegister}>
                    <div className="input-container">
                        <i className="fa fa-user"></i>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                    <div className="input-container">
                        <i className="fa fa-envelope"></i>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                    <div className="input-container">
                        <i className="fa fa-lock"></i>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                    <button
                        type="submit"
                        className="login-button"
                    >
                        Register
                    </button>
                </form>
                <br></br>
                <p>
        Already have an account? <Link to="/login">Login here</Link>
    </p>
            </div>
        </div>
    );
};

export default Register;

// // http://192.168.77.227:8080/jwtcheck
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import 'font-awesome/css/font-awesome.min.css'; // Ensure this is imported in your project
// import axios from "../axiosProduct";
// const Register = () => {
//     const navigate = useNavigate();
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const handleRegister = async (e) => {
//         e.preventDefault();
//         const userData = {
//             username: name,
//             mailId: email,
//             password: password,
//         };
//         try {
//             const response = await fetch('http://172.16.2.211:8080/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(userData),
//             });
//             if (response.ok) {
//                 const registeredUser = await response.json();
//                 console.log("User registered successfully", registeredUser);
//                 navigate("/login");
//             } else {
//                 console.log("Registration Failed");
//             }
//         } catch (error) {
//             console.error("Error occurred during registration:", error);
//         }
//     };

//     return (
//         <div style={{ textAlign: 'center', marginTop: '50px', padding: '40px' }}>
//             <div style={{padding:'3%'}}></div>
//             <h1 style={{ fontFamily: 'Arial, sans-serif', color: 'green' }}>Register</h1>
//             <form onSubmit={handleRegister}>
//                 <div style={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <i className="fa fa-user" style={{ marginRight: '10px', color: '#999' }}></i>
//                     <input
//                         type="text"
//                         placeholder="Name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         required
//                         style={{
//                             padding: '10px',
//                             border: '1px solid #ccc',
//                             borderRadius: '5px',
//                             width: '300px',
//                         }}
//                     />
//                 </div>
//                 <div style={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <i className="fa fa-envelope" style={{ marginRight: '10px', color: '#999' }}></i>
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         style={{
//                             padding: '10px',
//                             border: '1px solid #ccc',
//                             borderRadius: '5px',
//                             width: '300px',
//                         }}
//                     />
//                 </div>
//                 <div style={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <i className="fa fa-lock" style={{ marginRight: '10px', color: '#999' }}></i>
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         style={{
//                             padding: '10px',
//                             border: '1px solid #ccc',
//                             borderRadius: '5px',
//                             width: '300px',
//                         }}
//                     />
//                 </div>
//                 <br />
//                 <button
//                     type="submit"
//                     style={{
//                         padding: '10px 20px',
//                         fontSize: '16px',
//                         cursor: 'pointer',
//                         backgroundColor: '#4285F4',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '5px'
//                     }}
//                 >
//                     Register
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default Register;

