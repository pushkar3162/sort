import axios from 'axios';
import React, { useState, createContext, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

// First, let's create a simple AuthContext if you don't have one already
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user from localStorage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration form schema - modified to only require email
const registerSchema = z.object({
  email: z.string().email("Invalid email"),
});

// OTP verification schema - now includes all the fields that were in registration
const otpSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().min(4, "OTP must be at least 4 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Role is required"),
});

function AuthForm() {
  const { login } = useAuth();
  
  const [authMode, setAuthMode] = useState("login"); // login, register, or verifyOtp
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const navigate = useNavigate();
  
  // Get the appropriate schema based on the current auth mode
  const getSchema = () => {
    switch (authMode) {
      case "login":
        return loginSchema;
      case "register":
        return registerSchema;
      case "verifyOtp":
        return otpSchema;
      default:
        return loginSchema;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({ 
    resolver: zodResolver(getSchema())
  });

  // Set default values when switching to OTP mode
  useEffect(() => {
    if (authMode === "verifyOtp" && registrationEmail) {
      setValue("email", registrationEmail);
    }
  }, [authMode, registrationEmail, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      if (authMode === "login") {
        // Login request
        const response = await axios.post('http://127.0.0.1:8000/auth/login', {
          email: data.email,
          password: data.password
        });

        const { access_token, user: userData } = response.data;
        login(userData, access_token);

        // Redirect based on user role
        switch (userData.role) {
          case 'admin':
            navigate('/dashboard');
            break;
          case 'editor':
            navigate('/editordashboard');
            break;
          case 'viewer':
            navigate('/viewerdashboard');
            break;
          default:
            navigate('/dashboard');
        }
      } else if (authMode === "register") {
        // Create FormData object
        const formData = new FormData();
        formData.append('email', data.email);
      
        // Registration request - send as form data
        const response = await axios.post('http://127.0.0.1:8000/auth/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        // Store registration email for OTP verification
        setRegistrationEmail(data.email);
        setError("Registration initiated! Please check your email for OTP.");
        setAuthMode("verifyOtp");
        
      } else if (authMode === "verifyOtp") {
        // OTP verification request - now includes all the user data
        const response = await axios.post('http://127.0.0.1:8000/auth/verify-otp', {
          email: data.email,
          otp: data.otp,
          username: data.username,
          password: data.password,
          role: data.role
        });

        setError("Registration successful! You can now login.");
        setAuthMode("login");
        reset();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    switch (authMode) {
      case "login":
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
              {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
            </div>
          </>
        );
      
      case "register":
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
            </div>
          </>
        );
      
      case "verifyOtp":
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                disabled={true}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                OTP Code
              </label>
              <input
                id="otp"
                type="text"
                {...register("otp")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.otp ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
              {errors.otp && <p className="text-red-500 text-xs italic">{errors.otp.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                {...register("username")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.username ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
              {errors.username && <p className="text-red-500 text-xs italic">{errors.username.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
              {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                Role
              </label>
              <select
                id="role"
                {...register("role")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.role ? 'border-red-500' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs italic">{errors.role.message}</p>}
            </div>
          </>
        );
    }
  };

  const getFormTitle = () => {
    switch (authMode) {
      case "login": return "Login";
      case "register": return "Sign Up";
      case "verifyOtp": return "Complete Registration";
      default: return "Authentication";
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Loading...";
    
    switch (authMode) {
      case "login": return "Login";
      case "register": return "Get OTP";
      case "verifyOtp": return "Complete Registration";
      default: return "Submit";
    }
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setError("");
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4EBDC]">
      <div className="w-full max-w-md p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-center mb-6">
              {getFormTitle()}
            </h2>
            
            {error && (
              <div className={`mb-4 p-3 rounded ${error.includes("successful") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {renderForm()}
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-[#3A506B] text-white rounded hover:bg-[#2D3E50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3A506B] disabled:opacity-50"
                >
                  {getButtonText()}
                </button>
              </div>
            </form>

            {authMode !== "verifyOtp" && (
              <div className="mt-4 text-center">
                {authMode === "login" ? (
                  <p>
                    Don't have an account?{" "}
                    <button
                      onClick={() => switchAuthMode("register")}
                      className="text-[#3A506B] hover:underline focus:outline-none"
                      disabled={isLoading}
                    >
                      Sign Up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      onClick={() => switchAuthMode("login")}
                      className="text-[#3A506B] hover:underline focus:outline-none"
                      disabled={isLoading}
                    >
                      Login
                    </button>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;