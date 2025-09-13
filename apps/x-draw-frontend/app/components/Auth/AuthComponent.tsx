"use client";

import React from "react";
import { LoginForm } from "./LoginComponent";
import { SignupForm } from "./SignupComponent";
import { LoginData, SignupData } from "./types";
import { BACKEND_URL } from "../../../properties";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../services/hooks/useAuth";

export const AuthContainer: React.FC<{ isSignup?: boolean }> = ({
  isSignup = false,
}) => {
  const { login } = useAuth();

  const handleLogin = async (data: LoginData) => {
    try {
      const response = await axiosInstance.post(`${BACKEND_URL}/signin`, data);
      
      // Use the login method from useAuth hook
      login(response.data.token);
      
      alert("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleSignup = async (data: SignupData) => {
    try {
      await axiosInstance.post(`${BACKEND_URL}/signup`, data);
      alert("Signup successful! Please login.");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-emerald-900/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="transition-all duration-500 ease-in-out">
          {isSignup ? (
            <SignupForm onSubmit={handleSignup} />
          ) : (
            <LoginForm onSubmit={handleLogin} />
          )}
        </div>
      </div>
    </div>
  );
};
