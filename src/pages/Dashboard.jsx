import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  Avatar,
  Dialog,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Bookmark as BookmarkIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useContents } from '../hooks/useContents';
import { useGoals } from '../hooks/useGoals';
import ContentCard from '../components/content/ContentCard';
import ContentFormModal from '../components/content/ContentFormModal';
import GoalsModal from '../components/goals/GoalsModal';
import Profile from './Profile';
function StatsCards({ contents }) {
  const stats = {
    total: contents.length,
    completed: contents.filter(c => c.status === 'Concluído').length,
    inProgress: contents.filter(c => c.status === 'Em andamento').length,
    pending: contents.filter(c => c.status === 'Quero estudar').length,
  };
  const cardData = [
    {
      title: 'Concluídos',
      value: stats.completed,
      color: '#4caf50',
      icon: <CheckCircleIcon />,
      description: 'Conteúdos finalizados'
    },
    {
      title: 'Em Andamento',
      value: stats.inProgress,
      color: '#ff9800',
      icon: <PlayArrowIcon />,
      description: 'Estudando agora'
    },
    {
      title: 'Para Estudar',
      value: stats.pending,
      color: '#2196f3',
      icon: <BookmarkIcon />,
      description: 'Na fila de estudos'
    },
    {
      title: 'Total',
      value: stats.total,
      color: '#9c27b0',
      icon: <SchoolIcon />,
      description: 'Todos os conteúdos'
    }
  ];
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              background: `linear-gradient(135deg, ${card.color}20, ${card.color}40)`,
              border: `1px solid ${card.color}30`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              position: 'absolute', 
              top: -10, 
              right: -10,
              opacity: 0.1,
              transform: 'scale(3)'
            }}>
              {card.icon}
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: card.color,
              mb: 1
            }}>
              {card.icon}
            </Box>
            
            <Typography variant="h4" fontWeight="bold" color={card.color}>
              {card.value}
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 1 }}>
              {card.title}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {card.description}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

function ProgressChart({ contents }) {
  const data = {
    completed: contents.filter(c => c.status === 'Concluído').length,
    inProgress: contents.filter(c => c.status === 'Em andamento').length,
    pending: contents.filter(c => c.status === 'Quero estudar').length
  };

  const total = contents.length || 1;
  const colors = ['#4caf50', '#ff9800', '#2196f3'];
  const labels = ['Concluídos', 'Em Andamento', 'Para Estudar'];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Distribuição dos Conteúdos
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Box sx={{ position: 'relative', width: 120, height: 120 }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `conic-gradient(
                ${colors[0]} 0% ${(data.completed / total) * 100}%,
                ${colors[1]} 0% ${((data.completed + data.inProgress) / total) * 100}%,
                ${colors[2]} 0% 100%
              )`
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {Object.entries(data).map(([key, value], index) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: colors[index]
                }}
              />
              <Typography variant="body2">
                {labels[index]}: {value} ({Math.round((value / total) * 100)}%)
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
function PeriodProgress({ contents }) {
  const getWeeklyProgress = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyContents = contents.filter(content => {
      const created = new Date(content.created_at);
      return created >= oneWeekAgo;
    });
    const weeklyCompleted = weeklyContents.filter(c => c.status === 'Concluído').length;
    return {
      total: weeklyContents.length,
      completed: weeklyCompleted,
      progress: weeklyContents.length ? Math.round((weeklyCompleted / weeklyContents.length) * 100) : 0
    };
  };
  const getMonthlyProgress = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const monthlyContents = contents.filter(content => {
      const created = new Date(content.created_at);
      return created >= oneMonthAgo;
    });
    const monthlyCompleted = monthlyContents.filter(c => c.status === 'Concluído').length;
    
    return {
      total: monthlyContents.length,
      completed: monthlyCompleted,
      progress: monthlyContents.length ? Math.round((monthlyCompleted / monthlyContents.length) * 100) : 0
    };
  };
  const weekly = getWeeklyProgress();
  const monthly = getMonthlyProgress();

  const ProgressBar = ({ progress, label, period }) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" fontWeight="medium">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          {progress}%
        </Typography>
      </Box>
      <Box
        sx={{
          height: 8,
          backgroundColor: 'grey.200',
          borderRadius: 4,
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            height: '100%',
            backgroundColor: period === 'weekly' ? '#ff9800' : '#2196f3',
            width: `${progress}%`,
            transition: 'width 0.3s ease'
          }}
        />
      </Box>
      <Typography variant="caption" color="text.secondary">
        {period === 'weekly' ? weekly.completed : monthly.completed} de {period === 'weekly' ? weekly.total : monthly.total} concluídos
      </Typography>
    </Box>
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <TrendingUpIcon color="primary" />
        <Typography variant="h6">Progresso por Período</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Esta Semana
          </Typography>
          <ProgressBar 
            progress={weekly.progress} 
            label="Progresso Semanal"
            period="weekly"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Este Mês
          </Typography>
          <ProgressBar 
            progress={monthly.progress} 
            label="Progresso Mensal" 
            period="monthly"
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default function Dashboard({ user, onLogout }) {
  const { 
    contents, 
    loading, 
    addContent, 
    updateContent, 
    deleteContent, 
    markComplete 
  } = useContents(user?.id);
  
  const { goals, loading: goalsLoading } = useGoals(user?.id);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showContentForm, setShowContentForm] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTopicManager, setShowTopicManager] = useState(false);
  const handleContentSaved = () => {
    setShowContentForm(false);
    setSelectedContent(null);
  };
  const handleEditContent = (content) => {
    setSelectedContent(content);
    setShowContentForm(true);
  };
  return (
    <>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <SchoolIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Meus Estudos
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Olá, {user?.user_metadata?.name || user?.email}
            </Typography>
            <IconButton color="inherit" onClick={() => setShowProfile(true)}>
              <AccountCircleIcon />
            </IconButton>
            <IconButton color="inherit" onClick={onLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <StatsCards contents={contents} />

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ProgressChart contents={contents} />
              </Grid>
              <Grid item xs={12} md={6}>
                <PeriodProgress contents={contents} />
              </Grid>
            </Grid>
            <Paper sx={{ p: 3, mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                  Meus Conteúdos
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowContentForm(true)}
                >
                  Novo Conteúdo
                </Button>
              </Box>
              {loading ? (
                <Box textAlign="center" py={4}>
                  <Typography>Carregando conteúdos...</Typography>
                </Box>
              ) : contents.length === 0 ? (
                <Box textAlign="center" py={6}>
                  <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nenhum conteúdo cadastrado
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Comece adicionando seus primeiros materiais de estudo
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowContentForm(true)}
                    size="large"
                  >
                    Adicionar Primeiro Conteúdo
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {contents.map(content => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      onEdit={handleEditContent}
                      onDelete={deleteContent}
                      onMarkComplete={markComplete}
                      user={user}
                    />
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

      
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              
            </Paper>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Minhas Metas
                </Typography>
                <SchoolIcon color="primary" />
              </Box>

              {goalsLoading ? (
                <Typography>Carregando metas...</Typography>
              ) : goals.length === 0 ? (
                <Box textAlign="center" py={2}>
                  <Typography color="text.secondary" gutterBottom>
                    Nenhuma meta definida
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setShowGoals(true)}
                    size="small"
                  >
                    Criar Meta
                  </Button>
                </Box>
              ) : (
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {goals.slice(0, 3).map(goal => (
                      <Paper key={goal.id} variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" noWrap>
                          {goal.title}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Box sx={{ flexGrow: 1, mr: 1 }}>
                            <Box
                              sx={{
                                height: 6,
                                backgroundColor: 'grey.200',
                                borderRadius: 3,
                                overflow: 'hidden'
                              }}
                            >
                              <Box
                                sx={{
                                  height: '100%',
                                  backgroundColor: goal.progress === 100 ? '#4caf50' : '#2196f3',
                                  width: `${goal.progress || 0}%`
                                }}
                              />
                            </Box>
                          </Box>
                          <Typography variant="caption" fontWeight="bold">
                            {goal.progress || 0}%
                          </Typography>
                        </Box>
                        {goal.target_date && (
                          <Typography variant="caption" color="text.secondary">
                            {goal.daysRemaining === 0 ? 'Hoje' : 
                             goal.daysRemaining === 1 ? '1 dia' : 
                             `${goal.daysRemaining} dias`}
                          </Typography>
                        )}
                      </Paper>
                    ))}
                  </Box>

                  {goals.length > 3 && (
                    <Button 
                      fullWidth 
                      variant="text" 
                      onClick={() => setShowGoals(true)}
                      sx={{ mt: 2 }}
                    >
                      Ver todas as {goals.length} metas
                    </Button>
                  )}
                </>
              )}

              <Button 
                fullWidth 
                variant="contained" 
                onClick={() => setShowGoals(true)}
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
              >
                Gerenciar Metas
              </Button>
            </Paper>
            
          </Grid>
        </Grid>
      </Container>
       <ContentFormModal
        open={showContentForm}
        onClose={() => {
          setShowContentForm(false);
          setSelectedContent(null);
        }}
        onSaved={handleContentSaved}
        user={user}
        initialContent={selectedContent}
        addContent={addContent}           
        updateContent={updateContent}     
      />
      <GoalsModal
        open={showGoals}
        onClose={() => setShowGoals(false)}
        user={user}
      />

      <Dialog 
        open={showProfile} 
        onClose={() => setShowProfile(false)} 
        fullWidth 
        maxWidth="md"
      >
        <Profile 
          user={user} 
          onBack={() => setShowProfile(false)} 
        />
      </Dialog>
    </>
  );
}