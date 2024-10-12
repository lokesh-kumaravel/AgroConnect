// http://192.168.77.227:8080/jwtcheck
import React, { useState, useContext } from "react";
import AppContext from "../Context/Context";
import { Link, useNavigate } from 'react-router-dom'; 
import axios from "../axiosProduct";
function Login() {

    const { setUserId,userId } = useContext(AppContext);

    const navigate = useNavigate(); 

    const [email, setEmail] = useState("lokesh@gmail.com");
    const [password, setPassword] = useState("123");
    const [error, setError] = useState(null); 

    const handleLogin = async (e) => {
        e.preventDefault(); 
        console.log(email);
        console.log(password);
    
        const loginData = {
            mailId: email, 
            password: password
        };
    
        try {
            const response = await axios.post('/login',loginData, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify(loginData),
            });
    
            // const data = await response.json(); // Parse the response
            const data = await response.data; 
    
            if (response) {
                const { token, userId } = data; 
                setUserId(userId);
                console.log("Login successful. JWT Token: ", token);
                console.log("UserId: ", userId);
                localStorage.setItem("currentuser",userId)
                localStorage.setItem('jwt', token); 
                
                navigate('/');
            } else {
                const errorMessage = data?.message || "Login failed"; 
                setError(errorMessage); 
                console.error   ("Login failed:", errorMessage);
            }   
        } catch (error) {
            console.error("Error occurred during login:", error);
            setError("Invalid username or password");
        }
        window.location.reload()    
    };


  return (
    <div style={{ textAlign: 'center', marginTop: '50px', padding:140}}>
            <h1 style={{color:'Green'}}>Login</h1>
            <form onSubmit={handleLogin}>
            <div style={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <i className="fa fa-envelope" style={{ marginRight: '10px', color: 'var(--icon-color)' }}></i>
    <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ padding: '10px', margin: '10px', width: '300px' }}
    />
</div>
<div style={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <i className="fa fa-lock" style={{ marginRight: '10px', color: 'var(--icon-color)' }}></i>
    <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ padding: '10px', margin: '10px', width: '300px' }}
    />
</div>

                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: '#4285F4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Login
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            <p>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
  );
}

export default Login;
// import React, { useState, useContext } from "react";
// import AppContext from "../Context/Context";
// import { Link, useNavigate } from 'react-router-dom'; 
// function Login() {

//     const { setUserId,userId } = useContext(AppContext);

//     const navigate = useNavigate(); // Initialize useNavigate

//     const [email, setEmail] = useState("ram@gmail.com");
//     const [password, setPassword] = useState("123");
//     const [error, setError] = useState(null); // State for error message

//     const handleLogin = async (e) => {
//         e.preventDefault(); // Prevent the default form submission
//         console.log(email);
//         console.log(password);
    
//         const loginData = {
//             mailId: email, // Assuming email is sent as mailId
//             password: password // Assuming password is correctly passed
//         };
    
//         try {
//             const response = await fetch('http://localhost:8080/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(loginData),
//             });
    
//             const data = await response.json(); // Parse the response
    
//             // Check if the response is OK
//             if (response.ok) {
//                 const { token, userId } = data; // Destructure token and userId from the data
//                 setUserId(userId);
//                 console.log("Login successful. JWT Token: ", token);
//                 console.log("UserId: ", userId);
//                 localStorage.setItem("currentuser",userId)
//                 localStorage.setItem('jwt', token); // Store the token after login
                
//                 navigate('/'); // Redirect to the dashboard
//             } else {
//                 const errorMessage = data?.message || "Login failed"; // Get error message from response or set a default message
//                 setError(errorMessage); // Set the error message
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
//             <h1>Login</h1>
//             <form onSubmit={handleLogin}>
//                 <input
//                     type="text"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     style={{ padding: '10px', margin: '10px' }}
//                 />
//                 <br />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     style={{ padding: '10px', margin: '10px' }}
//                 />
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
