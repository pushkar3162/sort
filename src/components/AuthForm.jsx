import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.optional(
    z.string().min(3, "Username must be at least 3 characters")
  ),
});

function AuthForm() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
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
      } else {
        // Registration request
        const response = await axios.post('http://127.0.0.1:8000/auth/register', {
          username: data.username,
          email: data.email,
          password: data.password
        });

        setError("Registration successful! Please check your email for verification.");
        setIsLogin(true); // Switch to login form after successful registration
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh", backgroundColor: "#F4EBDC" }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: 400,
          borderRadius: 3,
          backgroundColor: "#F4EBDC",
        }}
      >
        <Card>
          <CardHeader
            title={
              <Typography variant="h5" align="center" fontWeight="bold">
                {isLogin ? "Login" : "Sign Up"}
              </Typography>
            }
          />
          <CardContent>
            {error && (
              <Alert severity={error.includes("successful") ? "success" : "error"} 
                     sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display="flex" flexDirection="column" gap={2}>
                {!isLogin && (
                  <TextField
                    label="Username"
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    fullWidth
                    disabled={isLoading}
                    style={{ backgroundColor: "#F4EBDC" }}
                  />
                )}
                <TextField
                  label="Email"
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                  disabled={isLoading}
                  style={{ backgroundColor: "#F4EBDC" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                  disabled={isLoading}
                  style={{ backgroundColor: "#F4EBDC" }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isLoading}
                  style={{ backgroundColor: "#3A506B", color: "#ffffff" }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    isLogin ? "Login" : "Sign Up"
                  )}
                </Button>
              </Box>
            </form>

            <Typography align="center" mt={2}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button 
                color="primary" 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                disabled={isLoading}
              >
                {isLogin ? "Sign Up" : "Login"}
              </Button>
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Grid>
  );
}

export default AuthForm;