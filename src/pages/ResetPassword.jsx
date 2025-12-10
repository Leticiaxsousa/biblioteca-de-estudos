import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
export default function ResetPassword({ goTo }) {
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    if (!token) {
      alert("Solicite novamente a redefinição de senha.");
      goTo("login");
      return;
    }
    setAccessToken(token);
  }, [goTo]);
  const handleReset = async () => {
    if (!password) {
      alert("Digite a nova senha.");
      return;
    }
    setLoading(true);
    try {
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(accessToken);
      if (sessionError) {
        alert("Erro ao criar sessão: " + sessionError.message);
        setLoading(false);
        return;
      }
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        alert("Erro ao redefinir senha: " + updateError.message);
        setLoading(false);
        return;
      }
      alert("Senha alterada com sucesso!");
      goTo("login");
    } catch (err) {
      alert("Erro inesperado: " + err.message);
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
    >
      <Paper sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom align="center">
          Redefinir Senha
        </Typography>

        <TextField
          label="Nova Senha"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleReset}
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar nova senha"}
        </Button>
      </Paper>
    </Box>
  );
}
