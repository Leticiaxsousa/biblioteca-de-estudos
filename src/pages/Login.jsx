import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { supabase } from "../services/supabaseClient";

const Login = ({ onLogin, goTo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Preencha e-mail e senha.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Erro ao logar: " + error.message);
      return;
    }

    onLogin(data.user);
    goTo("dashboard");
  };

  const handleResetPassword = async () => {
    if (!email) {
      alert("Digite seu e-mail para recuperar a senha.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      alert("Erro ao enviar recuperação: " + error.message);
      return;
    }

    alert("E-mail de recuperação enviado!");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f4f6f8"
      px={2}
    >
      <Paper elevation={4} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom align="center">
          Login
        </Typography>

        <TextField
          label="E-mail"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Entrar
        </Button>

        <Button fullWidth sx={{ mt: 1 }} onClick={() => goTo("register")}>
          Criar conta
        </Button>

        <Button fullWidth sx={{ mt: 1 }} onClick={handleResetPassword}>
          Esqueci minha senha
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
