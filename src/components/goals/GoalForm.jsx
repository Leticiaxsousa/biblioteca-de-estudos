// components/goals/GoalForm.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { useGoals } from '../../hooks/useGoals';
import { GOAL_TYPES, getGoalTypeByKey } from '../../utils/goalTypes';
import { getDefaultPeriod, validatePeriod } from '../../utils/goalCalculations';

export default function GoalForm({ user, initial, onSaved, onClose }) {
  const { addGoal, updateGoal } = useGoals(user?.id);
  const [formData, setFormData] = useState({
    title: '',
    type: 'weekly_content',
    target_value: 1,
    period_start: '',
    period_end: ''
  });

  const [selectedGoalType, setSelectedGoalType] = useState(GOAL_TYPES.WEEKLY_CONTENT);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setFormData({
        title: initial.title || '',
        type: initial.type || 'weekly_content',
        target_value: initial.target_value || 1,
        period_start: initial.period_start || '',
        period_end: initial.period_end || ''
      });
      setSelectedGoalType(getGoalTypeByKey(initial.type));
    } else {
      // Valores padrão para nova meta
      const defaultPeriod = getDefaultPeriod();
      
      setFormData({
        title: '',
        type: 'weekly_content',
        target_value: 3,
        period_start: defaultPeriod.start,
        period_end: defaultPeriod.end
      });
      setSelectedGoalType(GOAL_TYPES.WEEKLY_CONTENT);
    }
  }, [initial]);

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    const goalType = getGoalTypeByKey(newType);
    
    setSelectedGoalType(goalType);
    setFormData(prev => ({ ...prev, type: newType }));
    setError('');
    
    // Valores padrão baseados no tipo
    const defaults = {
      weekly_content: 5,
      completion_target: 3, 
      time_study: 10,
      topic_mastery: 2
    };
    
    setFormData(prev => ({ 
      ...prev, 
      target_value: defaults[newType] || 1 
    }));
  };

  const handleSave = async () => {
    setError('');

    // Validações
    if (!formData.title.trim()) {
      setError('Por favor, digite um título para a meta');
      return;
    }

    if (!formData.period_start || !formData.period_end) {
      setError('Por favor, defina o período da meta');
      return;
    }

    const periodValidation = validatePeriod(formData.period_start, formData.period_end);
    if (!periodValidation.isValid) {
      setError(periodValidation.error);
      return;
    }

    try {
      const goalData = {
        title: formData.title.trim(),
        type: formData.type,
        target_value: Number(formData.target_value),
        period_start: formData.period_start,
        period_end: formData.period_end,
        user_id: user.id
      };

      console.log('Salvando meta:', goalData);

      if (initial?.id) {
        await updateGoal(initial.id, goalData);
      } else {
        await addGoal(goalData);
      }
      
      onSaved();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      setError('Erro ao salvar meta: ' + error.message);
    }
  };

  const handleDateChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
      <Typography variant="h6">
        {initial ? 'Editar Meta' : 'Nova Meta de Estudo'}
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Card do Tipo de Meta */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            {selectedGoalType.icon} {selectedGoalType.label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedGoalType.description}
          </Typography>
        </CardContent>
      </Card>

      <TextField
        label="Título da Meta"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        fullWidth
        required
        placeholder={`Ex: ${selectedGoalType.label} esta semana`}
        error={!!error && error.includes('título')}
      />

      <FormControl fullWidth>
        <InputLabel>Tipo de Meta</InputLabel>
        <Select
          value={formData.type}
          label="Tipo de Meta"
          onChange={handleTypeChange}
        >
          {Object.values(GOAL_TYPES).map(type => (
            <MenuItem key={type.key} value={type.key}>
              {type.icon} {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label={`Meta (${selectedGoalType.unit})`}
            type="number"
            value={formData.target_value}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              target_value: Math.max(1, Number(e.target.value || 1))
            }))}
            inputProps={{ min: 1 }}
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Início do Período"
            type="date"
            value={formData.period_start}
            onChange={(e) => handleDateChange('period_start', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            error={!!error && error.includes('data')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Fim do Período"
            type="date"
            value={formData.period_end}
            onChange={(e) => handleDateChange('period_end', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            error={!!error && error.includes('data')}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained">
          {initial ? 'Atualizar' : 'Criar'} Meta
        </Button>
      </Box>
    </Box>
  );
}