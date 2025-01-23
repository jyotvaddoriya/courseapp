import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../public/logo.png";
import axios from 'axios';
import toast from "react-hot-toast";
import { BACKEND_URL } from '../../utils/utils';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${ BACKEND_URL }/user/login`, {
        email,
        password
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Login successful", response.data);
      toast.success(response.data.message);
      localStorage.setItem('user', JSON.stringify({
        token: response.data.token  // response.data.token should be the JWT returned from the backend
      }));
       
      navigate("/courses"); // Redirect to courses page after login
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error || "Login failed");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950">
      <div className="h-screen container mx-auto flex items-center justify-center text-white">
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <Link to={"/"} className="text-xl font-bold text-orange-500">CourseHaven</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to={"/signup"} className="bg-transparent border border-gray-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md">Signup</Link>
            <Link to={"/courses"} className="bg-orange-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md">Join now</Link>
          </div>
        </header>
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[500px] m-8 md:m-0 mt-20">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Welcome to <span className="text-orange-500">CourseHaven</span>
          </h2>
          <p className="text-center text-gray-400 mb-6">Log in to access courses</p>
          <form onSubmit={handelSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="text-gray-400 mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="name@email.com" 
                required 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="text-gray-400 mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} // Toggle between password and text
                  id="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="********" 
                  required 
                />
                <span 
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer" 
                  onClick={togglePasswordVisibility} // Toggle password visibility
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
            {errorMessage && <div className="mb-4 text-red-500 text-center">{errorMessage}</div>}
            <button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;