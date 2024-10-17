import React, { useState, useContext } from "react";
import AppContext from "../Context/Context"; // Your context for user state
import { Link, useNavigate } from 'react-router-dom'; 
import axios from "../axiosProduct"; // Your axios instance
import './Login.css';

function Login() {
    const { setUserId } = useContext(AppContext);
    const navigate = useNavigate(); 

    const [email, setEmail] = useState("lokesh@gmail.com");
    const [password, setPassword] = useState("123");
    const [error, setError] = useState(null); 

    const handleLogin = async (e) => {
        e.preventDefault(); 
        
        const loginData = {
            mailId: email, 
            password: password
        };
    
        try {
            const response = await axios.post('/login', loginData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.data; 
    
            if (response) {
                const { token, userId } = data; 
                setUserId(userId);
                localStorage.setItem("currentuser", userId);
                localStorage.setItem('jwt', token); 
                
                navigate('/'); // Redirect to homepage
            } else {
                const errorMessage = data?.message || "Login failed"; 
                setError(errorMessage); 
            }   
        } catch (error) {
            console.error("Error occurred during login:", error);
            setError("Invalid username or password");
        }
    };

    return (
        <>
        <br></br>
        <br></br>
        <div className="container" style={{display: 'flex', paddingTop: '0%'}}>
            <div className="heading">Sign In</div>
            <br />
            <div>
                <form className="form" onSubmit={handleLogin}>
                    {/* Email Input with Icon */}
                    <div className="input-container">
                        <i className="fa fa-envelope icon" style={{marginTop:'15%', fontSize:'17px'}}></i>
                        <input
                            required
                            className="input"
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Input with Icon */}
                    <div className="input-container">
                        <i className="fa fa-lock icon" style={{marginTop:'15%', fontSize:'22px'}}></i>
                        <input
                            required
                            className="input"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Error Message */}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {/* Login Button */}
                    <input className="login-button" type="submit" value="Sign In" />
                </form>
            </div>

            {/* <div>
                <div className="social-account-container">
                    <span className="title">Or Sign in with</span>
                    <div className="social-accounts">
                    </div>
                </div>
            </div> */}
            <br></br>
            
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
        </>
    );
}

export default Login;

// import React, { useState, useContext } from "react";
// import AppContext from "../Context/Context"; // Your context for user state
// import { Link, useNavigate } from 'react-router-dom'; 
// import axios from "../axiosProduct"; // Your axios instance
// import './Login.css'
// function Login() {
//     const { setUserId } = useContext(AppContext);
//     const navigate = useNavigate(); 

//     const [email, setEmail] = useState("lokesh@gmail.com");
//     const [password, setPassword] = useState("123");
//     const [error, setError] = useState(null); 

//     const handleLogin = async (e) => {
//         e.preventDefault(); 
        
//         const loginData = {
//             mailId: email, 
//             password: password
//         };
    
//         try {
//             const response = await axios.post('/login', loginData, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             const data = await response.data; 
    
//             if (response) {
//                 const { token, userId } = data; 
//                 setUserId(userId);
//                 localStorage.setItem("currentuser", userId);
//                 localStorage.setItem('jwt', token); 
                
//                 navigate('/'); // Redirect to homepage
//             } else {
//                 const errorMessage = data?.message || "Login failed"; 
//                 setError(errorMessage); 
//             }   
//         } catch (error) {
//             console.error("Error occurred during login:", error);
//             setError("Invalid username or password");
//         }
//     };

//     return (
//         <div className="container">
//             <div className="heading">Sign In</div>
//             <form className="form" onSubmit={handleLogin}>
//                 <input
//                     required
//                     className="input"
//                     type="email"
//                     name="email"
//                     placeholder="E-mail"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <input
//                     required
//                     className="input"
//                     type="password"
//                     name="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//                 {error && <p style={{ color: 'red' }}>{error}</p>}
//                 <span className="forgot-password"><a href="#">Forgot Password?</a></span>
//                 <input className="login-button" type="submit" value="Sign In" />
//             </form>
//             <div className="social-account-container">
//                 <span className="title">Or Sign in with</span>
//                 <div className="social-accounts">
//                     <button className="social-button google">
//                         {/* Google SVG Icon */}
//                         <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512">
//                             <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
//                         </svg>
//                     </button>
//                     <button className="social-button apple">
//                         {/* Apple SVG Icon */}
//                         <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
//                             <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
//                         </svg>
//                     </button>
//                     <button className="social-button twitter">
//                         {/* Twitter SVG Icon */}
//                         <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
//                             <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
//                         </svg>
//                     </button>
//                 </div>
//             </div>
//             <p>
//                 Don't have an account? <Link to="/register">Register here</Link>
//             </p>
//         </div>
//     );
// }

// export default Login;

// // http://192.168.77.227:8080/jwtcheck
// import React, { useState, useContext } from "react";
// import AppContext from "../Context/Context";
// import { Link, useNavigate } from 'react-router-dom'; 
// import axios from "../axiosProduct";
// function Login() {

//     const { setUserId,userId } = useContext(AppContext);

//     const navigate = useNavigate(); 

//     const [email, setEmail] = useState("lokesh@gmail.com");
//     const [password, setPassword] = useState("123");
//     const [error, setError] = useState(null); 

//     const handleLogin = async (e) => {
//         e.preventDefault(); 
//         console.log(email);
//         console.log(password);
    
//         const loginData = {
//             mailId: email, 
//             password: password
//         };
    
//         try {
//             const response = await axios.post('/login',loginData, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 // body: JSON.stringify(loginData),
//             });
    
//             // const data = await response.json(); // Parse the response
//             const data = await response.data; 
    
//             if (response) {
//                 const { token, userId } = data; 
//                 setUserId(userId);
//                 console.log("Login successful. JWT Token: ", token);
//                 console.log("UserId: ", userId);
//                 localStorage.setItem("currentuser",userId)
//                 localStorage.setItem('jwt', token); 
                
//                 navigate('/');
//             } else {
//                 const errorMessage = data?.message || "Login failed"; 
//                 setError(errorMessage); 
//                 console.error   ("Login failed:", errorMessage);
//             }   
//         } catch (error) {
//             console.error("Error occurred during login:", error);
//             setError("Invalid username or password");
//         }
//         window.location.reload()    
//     };


//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px', padding:140}}>
//             <h1 style={{color:'Green'}}>Login</h1>
//             <form onSubmit={handleLogin}>
//             <div style={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//     <i className="fa fa-envelope" style={{ marginRight: '10px', color: 'var(--icon-color)' }}></i>
//     <input
//         type="text"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//         style={{ padding: '10px', margin: '10px', width: '300px' }}
//     />
// </div>
// <div style={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//     <i className="fa fa-lock" style={{ marginRight: '10px', color: 'var(--icon-color)' }}></i>
//     <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//         style={{ padding: '10px', margin: '10px', width: '300px' }}
//     />
// </div>

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
//                     Login
//                 </button>
//             </form>
//             {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
//             <p>
//                 Don't have an account? <Link to="/register">Register here</Link>
//             </p>
//         </div>
//   );
// }

// export default Login;