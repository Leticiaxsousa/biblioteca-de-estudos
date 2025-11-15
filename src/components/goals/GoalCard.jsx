import React from 'react';
import { Card, CardContent, Typography, LinearProgress, IconButton, Box, Chip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function GoalCard({ goal, onEdit, onDelete }) {
  const progress = goal.progress ?? 0;

  const chip = () => {
    if (progress >= 100) return <Chip label="Concluída" color="success" size="small" />;
    if (goal.goal_type === 'content' && goal.daysRemaining !== null && goal.daysRemaining <= 2)
      return <Chip label={goal.daysRemaining === 0 ? 'Vence hoje' : `${goal.daysRemaining} dias`} color="warning" size="small" />;
    if (goal.goal_type === 'weekly') return <Chip label="Semanal" size="small" />;
    if (goal.goal_type === 'monthly') return <Chip label="Mensal" size="small" />;
    return <Chip label="Por Conteúdo" size="small" />;
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1">{goal.title}</Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {goal.goal_type === 'content'
                ? goal.current_value ? 'Concluído' : 'Pendente'
                : `${goal.current_value || 0} de ${goal.target_value}`}
            </Typography>

            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, mb: 1 }} />

            <Typography variant="caption" color="text.secondary">{progress}%</Typography>

            {goal.due_date && (
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                Até {new Date(goal.due_date).toLocaleDateString()}
              </Typography>
            )}

            <Box sx={{ mt: 1 }}>{chip()}</Box>
          </Box>

          <Box>
            <IconButton size="small" onClick={() => onEdit(goal)}><EditIcon /></IconButton>
            <IconButton size="small" color="error" onClick={() => onDelete(goal.id)}><DeleteIcon /></IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
