import React from 'react';
import { Box, Typography, LinearProgress, Paper, Grid } from '@mui/material';

export default function ProgressSummary({ contents, goals }) {
  const totalContents = contents.length;
  const completedContents = contents.filter(c => c.status === 'Concluído').length;
  const inProgressContents = contents.filter(c => c.status === 'Em andamento').length;
  const pendingContents = contents.filter(c => c.status === 'Quero estudar').length;
  
  const contentProgress = totalContents ? Math.round((completedContents / totalContents) * 100) : 0;
  
  const totalGoals = goals.length;
  const averageGoalProgress = totalGoals 
    ? Math.round(goals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / totalGoals)
    : 0;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Resumo do Progresso
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Conteúdos ({contentProgress}%)
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={contentProgress} 
            sx={{ height: 10, borderRadius: 5, mb: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span>✅ {completedContents} concluídos</span>
            <span>🔄 {inProgressContents} em andamento</span>
            <span>📚 {pendingContents} pendentes</span>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Metas ({averageGoalProgress}%)
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={averageGoalProgress} 
            sx={{ height: 10, borderRadius: 5, mb: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span>🎯 {totalGoals} metas</span>
            <span>📅 {goals.filter(g => g.isOverdue).length} atrasadas</span>
            <span>⏳ {goals.filter(g => g.daysRemaining !== null && g.daysRemaining <= 7).length} próximas</span>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}