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
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => {
    const token = "random_token";
    localStorage.setItem("auth_token", token);
    alert(`${isLogin ? "Logged in" : "Signed up"} successfully!`);
    navigate("/dashboard");
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh", backgroundColor: "#E3F2FD" }}
    >
      <Paper elevation={6} sx={{ padding: 4, width: 400, borderRadius: 3 }}>
        <Card>
          <CardHeader
            title={
              <Typography variant="h5" align="center" fontWeight="bold">
                {isLogin ? "Login" : "Sign Up"}
              </Typography>
            }
          />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display="flex" flexDirection="column" gap={2}>
                {!isLogin && (
                  <TextField
                    label="Username"
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    fullWidth
                  />
                )}
                <TextField
                  label="Email"
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                />
                <TextField
                  label="Password"
                  type="password"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                >
                  {isLogin ? "Login" : "Sign Up"}
                </Button>
              </Box>
            </form>

            <Typography align="center" mt={2}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button color="primary" onClick={() => setIsLogin(!isLogin)}>
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
