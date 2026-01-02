"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Stack,
} from "@mui/material";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("/api/users/count");
        const data = await response.json();
        setUserCount(data.count);
      } catch (error) {
        setUserCount(null);
      }
    };
    fetchUserCount();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.replace("/");
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Login failed");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={2}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            bgcolor: "info.light",
            color: "info.contrastText",
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          {userCount !== null ? (
            <>
              <span role="img" aria-label="user">
                👤
              </span>{" "}
              Users signed up:{" "}
              <span style={{ fontWeight: 700 }}>{userCount}</span>
            </>
          ) : (
            "Loading user count..."
          )}
        </Paper>
      </Box>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          📝 Todo App Login
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Sign in to manage your tasks
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleRegister}
              disabled={loading}
            >
              Don&apos;t have an account? Sign Up
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
