import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { supabase } from "../services/supabaseClient";

const Register = ({ goTo }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      const user = signInData.user;
      if (!user) throw new Error("Falha ao obter usuário logado");
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: user.id, name }]);

      if (profileError) throw profileError;

      console.log("Profile criado com sucesso:", profileData);
      goTo("dashboard"); 
    } catch (err) {
      console.error("Erro ao registrar:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
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
          Registrar
        </Typography>

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar"}
        </Button>

        <Button fullWidth sx={{ mt: 1 }} onClick={() => goTo("login")}>
          Já tenho conta
        </Button>
      </Paper>
    </Box>
  );
};

export default Register;
