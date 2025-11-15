import React, { useState, useEffect } from 'react'; 
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import GoalForm from './GoalForm';
import GoalCard from './GoalCard';
import { useStudyGoals } from '../../hooks/useStudyGoals';

export default function GoalsModal({ open, onClose, user, contents, onSaved }) {
 const { goals, loading, addGoal, updateGoal, deleteGoal, refetch } = useStudyGoals(
  open ? user?.id : null,      
  open ? contents : []         
);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

const handleDelete = async (id) => {
  await deleteGoal(id); 
  onSaved?.();          
};

  const handleNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditing(null);
    refetch();
    onSaved?.(); 
  };

useEffect(() => {
    if (open) {
      setShowForm(false);
      setEditing(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Gerenciar Metas</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {showForm ? (
          <GoalForm
            initial={editing}
            onSaved={handleSaved}
            onClose={() => { setShowForm(false); setEditing(null); }}
            addGoal={addGoal}
            updateGoal={updateGoal}
            contents={contents}
          />
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Minhas Metas</Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleNew}>Nova Meta</Button>
            </Box>

            {loading ? (
              <Typography>Carregando...</Typography>
            ) : goals.length === 0 ? (
              <Box textAlign="center" py={4}><Typography color="text.secondary">Nenhuma meta cadastrada</Typography></Box>
            ) : (
              goals.map(g => (
                <GoalCard
                  key={g.id}
                  goal={g}
                  onEdit={(goal) => { setEditing(goal); setShowForm(true); }}
                  onDelete={handleDelete}
                />
              ))
            )}
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