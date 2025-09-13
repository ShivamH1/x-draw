"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../config";
import axios from "axios";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    photo: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isSignUp ? "/signup" : "/signin";
      const payload = isSignUp 
        ? { email: formData.email, password: formData.password, name: formData.name, photo: formData?.photo || "" }
        : { email: formData.email, password: formData.password };

      const response = await axios.post(`${BACKEND_URL}${endpoint}`, payload);
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        router.push("/");
      } else if (isSignUp) {
        // After successful signup, switch to signin
        setIsSignUp(false);
        setError("Account created successfully! Please sign in.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
          />
        </div>
        
        {isSignUp && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <input
                type="url"
                name="photo"
                placeholder="Photo URL (optional)"
                value={formData.photo}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
              />
            </div>
          </>
        )}
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#007bff', 
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}
