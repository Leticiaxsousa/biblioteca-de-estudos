import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
export default function ResetPassword({ goTo }) {
  const [password, setPassword] = useState("");
  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert("Erro ao redefinir senha " + error.message);
      return;
    }

    alert("Senha alterada com sucesso");
    goTo("login");
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
        >
          Salvar nova senha
        </Button>
      </Paper>
    </Box>
  );
}
