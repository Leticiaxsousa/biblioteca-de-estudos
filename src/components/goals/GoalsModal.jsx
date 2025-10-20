import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { useGoals } from '../../hooks/useGoals';
import GoalForm from './GoalForm';
import GoalCard from './GoalCard';

export default function GoalsModal({ open, onClose, user }) {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals(user?.id);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const handleGoalSaved = () => {
    setShowForm(false);
    setEditingGoal(null);
  };
  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Gerenciar Metas</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {showForm ? (
          <GoalForm
            user={user}
            initial={editingGoal}
            onSaved={handleGoalSaved}
            onClose={() => {
              setShowForm(false);
              setEditingGoal(null);
            }}
          />
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Minhas Metas</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowForm(true)}
              >
                Nova Meta
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {goals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEditGoal}
                  onDelete={deleteGoal}
                />
              ))}
              
              {goals.length === 0 && (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    Nenhuma meta cadastrada
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}
      </DialogContent>
      {!showForm && (
        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      )}
    </Dialog>
  );
}