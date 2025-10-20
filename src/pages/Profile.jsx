// pages/Profile.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { supabase } from '../services/supabaseClient';

export default function Profile({ user, onBack }) {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        email: user.email || '',
        name: user.user_metadata?.name || ''
      }));
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile(prev => ({ ...prev, name: data.name || '' }));
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile.name.trim()) {
      setMessage({ type: 'error', text: 'Nome é obrigatório' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Atualizar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          name: profile.name.trim() 
        });

      if (profileError) throw profileError;

      // Atualizar metadata do usuário
      const { error: authError } = await supabase.auth.updateUser({
        data: { name: profile.name.trim() }
      });

      if (authError) throw authError;

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Erro ao salvar perfil' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user.email) {
      setMessage({ type: 'error', text: 'E-mail não disponível' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      setMessage({ 
        type: 'success', 
        text: 'E-mail de redefinição de senha enviado!' 
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Carregando perfil...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}>
            <AccountCircle fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5">Meu Perfil</Typography>
            <Typography variant="body2" color="text.secondary">
              Gerencie suas informações pessoais
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {message.text && (
          <Alert 
            severity={message.type} 
            sx={{ mb: 3 }}
            onClose={() => setMessage({ type: '', text: '' })}
          >
            {message.text}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="E-mail"
            value={profile.email}
            disabled
            helperText="E-mail não pode ser alterado"
            fullWidth
          />

          <TextField
            label="Nome"
            value={profile.name}
            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
            disabled={saving}
            fullWidth
            helperText="Seu nome como será exibido no app"
          />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} /> : null}
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>

            <Button 
              variant="outlined" 
              onClick={handleResetPassword}
              disabled={loading}
            >
              Redefinir Senha
            </Button>

            <Button 
              variant="text" 
              onClick={onBack}
            >
              Voltar ao Dashboard
            </Button>
            
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Informações da Conta
          </Typography>
          <Typography variant="body2">
            ID: {user.id}
          </Typography>
          <Typography variant="body2">
            Último login: {new Date(user.last_sign_in_at).toLocaleString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}