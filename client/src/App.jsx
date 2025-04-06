import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";

import "./Authentication.css"

function Home() {
  return (
    <div className="well-container" >
      <h1 className="test hee">welcom to Test Execution GUI
      </h1>
      <div className="mt-5">
        <Link to="/signin" className="btn">Sign In</Link>
        <Link to="/signup" className="btn">Sign Up</Link>
      </div>
    </div>
  );
}

export function SignIn() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received Token:", data.access_token);
        localStorage.setItem("token", data.access_token);
        console.log("Token after set:", localStorage.getItem("token"));
        navigate("/dashboard");

      } else {
        const errorData = await response.json();
        setError(errorData.error || "Invalid credentials");
      }
    } catch (error) {
      setError("Network error, please try again later");
    }
  };

  return (
    <div className="auth-container">
      <h1>Sign In</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
       
        <input type="text" style={{ color: "black" }} placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} required />
       
        <input type="password" style={{ color: "black" }} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign In</button>
      </form>
      <Link to="/Forgot_password">Forgot Password</Link>
      <Link to="/signup">Don't have an account? Sign Up</Link>
    </div>
  );
}
function Reset() {
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setotp] = useState("")
  const [error,setError] = useState("")

  const handleSubmit = async () => {
    if (!name || !password || !otp) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/reset-password", {
        name,
        password,
        otp,
      });
      alert(response.data.message);
      navigate("/signin");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to reset password");
    }
  };

  return (
    <div className="auth-container">
        <h1>Reset Password</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
      <input type="text" style={{ color: "black" }} placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} required />
    
      <input type="password" style={{ color: "black" }} placeholder="Enter new Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      
      <input type="number" maxLength={6} style={{ color: "black" }} placeholder="Enter OTP" value={otp} onChange={(e) => setotp(e.target.value)}  required />
     
      <button type="submit" onClick={handleSubmit}>save</button>
    </div>
  )
}
function Forgot_password() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const [error, setError] = useState("")

  async function handleSubmit() {
    if (name == "") {
      setError("Enter user name")
      return
    }
    try {
      const response = await axios.post("http://localhost:5000/forgot-password", { name });
      alert("Copy the OTP",);
      alert(response.data.message)
      navigate("/reset")
    } catch (error) {
      setError(error.response?.data?.error || "Failed to send OTP");
    }

  }
  return (
    <div className="auth-container">
       {error && <p style={{ color: "red" }}>{error}</p>}
      <input type="text" style={{ color: "black" }} placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} required />

      <button type="submit" onClick={handleSubmit}>verify</button>
    </div>
  )
}

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:5000/signup", { name, password },
        { headers: { "Content-Type": "application/json" } }
      );
      navigate("/signin");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("User already exists! Please sign in.");
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>Sign Up</h1>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Show error if any */}
      <form onSubmit={handleSubmit}>
        <input type="text" style={{ color: "black" }} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="password" style={{ color: "black" }} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
      <Link to="/signin">Already have an account? Sign In</Link>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Forgot_Password" element={<Forgot_password />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </Router>
  );
}

export default App;
