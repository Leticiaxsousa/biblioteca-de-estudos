import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { getGoalTypeByKey } from '../../utils/goalTypes';

export default function GoalCard({ goal, onEdit, onDelete }) {
  const goalType = getGoalTypeByKey(goal.type);
  const today = new Date();
  const periodEnd = new Date(goal.period_end);
  const getStatusColor = () => {
    if (goal.status === 'completed') return 'success';
    if (goal.status === 'failed') return 'error';
    if (goal.days_remaining <= 2) return 'warning';
    return 'primary';
  };
  const getStatusText = () => {
    if (goal.status === 'completed') return 'Concluída ';
    if (goal.status === 'failed') return 'Não alcançada ';
    if (goal.days_remaining === 0) return 'Termina hoje!';
    if (goal.days_remaining === 1) return '1 dia restante';
    return `${goal.days_remaining} dias restantes`;
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
       
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6">
                {goalType.icon} {goal.title}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  {goal.current_value} de {goal.target_value} {goalType.unit}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {goal.progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={goal.progress}
                color={getStatusColor()}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={goalType.label}
                size="small"
                variant="outlined"
              />
              <Chip 
                label={getStatusText()}
                size="small"
                color={getStatusColor()}
              />
              <Chip 
                label={`Até ${new Date(goal.period_end).toLocaleDateString()}`}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <IconButton size="small" onClick={() => onEdit(goal)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(goal.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}