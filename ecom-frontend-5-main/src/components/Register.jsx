// http://192.168.77.227:8080/jwtcheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css'; // Ensure this is imported in your project

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
            const response = await fetch('http://192.168.77.227:8080/register', {
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
        <div style={{ textAlign: 'center', marginTop: '50px', padding: '40px' }}>
            <div style={{padding:'3%'}}></div>
            <h1 style={{ fontFamily: 'Arial, sans-serif', color: 'green' }}>Register</h1>
            <form onSubmit={handleRegister}>
                <div style={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa fa-user" style={{ marginRight: '10px', color: '#999' }}></i>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            width: '300px',
                        }}
                    />
                </div>
                <div style={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa fa-envelope" style={{ marginRight: '10px', color: '#999' }}></i>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            width: '300px',
                        }}
                    />
                </div>
                <div style={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa fa-lock" style={{ marginRight: '10px', color: '#999' }}></i>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            width: '300px',
                        }}
                    />
                </div>
                <br />
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
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;


// import react, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; 

// const Register = () => 
// {
    
//     const navigate = useNavigate();
//     const [id,setId] = useState("");
//     const [name,setName] = useState("");
//     const [email,setEmail] = useState("");
//     const [password,setPassword] = useState("");

//     const handleRegister = async (e)=>
//     {
//         e.preventDefault();
//         const userData ={
//             // id:id,
//             username: name,
//             mailId: email,
//             password: password
//         }
//         try{
//             const response = await fetch('http://localhost:8080/register',
//                 {
//                     method: 'POST',
//                     headers:
//                     {
//                         'Content-Type':'application/json',
//                     },
//                     body: JSON.stringify(userData),
//                 }
//             );
//             if(response.ok)
//             {
//                 const registeredUser = await response.json();
//                 console.log("User registered successfully", registeredUser);
//                 navigate("/login");
//             }
//             else{
//                 console.log("Registration Failed");
//             }
//         }
//         catch(error)
//         {
//             console.error("Error occured during registration:",error);
//         }
//     }
//     return (
//         <div style={{ textAlign: 'center', marginTop: '50px' , padding:140}}>
//             <h1>Register</h1>
//             <form onSubmit={handleRegister}>
//                 {/* <input
//                     type="text"
//                     placeholder="Id"
//                     value={id}
//                     onChange={(e) => setId(e.target.value)}
//                     // required
//                     style={{ padding: '10px', margin: '10px' }}
//                 /> */}
//                 <input
//                     type="text"
//                     placeholder="Name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                     style={{ padding: '10px', margin: '10px' }}
//                 />
//                 <br />
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     style={{ padding: '10px', margin: '10px' }}
//                 />
//                 {/* <br /> */}
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
//                     Register
//                 </button>
//             </form>
//         </div>
//     );
// }
// export default Register;