import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Typography, FormControl, InputLabel, Select } from '@mui/material';

const GOAL_TYPES = [
  { key: 'weekly', label: 'Semanal' },
  { key: 'monthly', label: 'Mensal' },
  { key: 'content', label: 'Por Conteúdo' }
];

export default function GoalForm({ initial, onSaved, onClose, addGoal, updateGoal, contents = [] }) {
  const [form, setForm] = useState({
    title: '',
    goal_type: 'weekly',
    target_value: 3,
    content_id: '',
    due_date: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        goal_type: initial.goal_type || 'weekly',
        target_value: initial.target_value || 1,
        content_id: initial.content_id || '',
        due_date: initial.due_date ? initial.due_date.split('T')[0] : ''
      });
    }
  }, [initial]);

  const handleSave = async () => {
    setError('');
    if (!form.title.trim()) {
      setError('Digite um título');
      return;
    }
    if (form.goal_type !== 'content' && (!form.target_value || form.target_value < 1)) {
      setError('Meta inválida');
      return;
    }
    if (form.goal_type === 'content' && !form.content_id) {
      setError('Selecione um conteúdo');
      return;
    }

    const payload = {
      title: form.title.trim(),
      goal_type: form.goal_type,
      target_value: Number(form.target_value),
      content_id: form.content_id || null,
      due_date: form.due_date || null
    };

    try {
      if (initial?.id) {
        await updateGoal(initial.id, payload);
      } else {
        await addGoal(payload);
      }
      onSaved && onSaved();
    } catch {
      setError('Erro ao salvar meta');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">{initial ? 'Editar Meta' : 'Nova Meta'}</Typography>

      <TextField
        label="Título"
        value={form.title}
        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>Tipo</InputLabel>
        <Select
          value={form.goal_type}
          label="Tipo"
          onChange={(e) => setForm(prev => ({ ...prev, goal_type: e.target.value }))}
        >
          {GOAL_TYPES.map(t => (
            <MenuItem key={t.key} value={t.key}>{t.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {form.goal_type !== 'content' && (
        <TextField
          label="Meta (nº de conteúdos)"
          type="number"
          value={form.target_value}
          onChange={(e) => setForm(prev => ({ ...prev, target_value: Math.max(1, Number(e.target.value || 1)) }))}
          fullWidth
        />
      )}

      {form.goal_type === 'content' && (
        <>
          <FormControl fullWidth>
            <InputLabel>Conteúdo</InputLabel>
            <Select
              value={form.content_id}
              label="Conteúdo"
              onChange={(e) => setForm(prev => ({ ...prev, content_id: e.target.value }))}
            >
              {contents.map(c => (
                <MenuItem key={c.id} value={c.id}>
                  {c.title || `Conteúdo ${c.id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Data limite"
            type="date"
            value={form.due_date}
            onChange={(e) => setForm(prev => ({ ...prev, due_date: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </>
      )}

      {error && <Typography color="error">{error}</Typography>}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>{initial ? 'Atualizar' : 'Criar'}</Button>
      </Box>
    </Box>
  );
}
