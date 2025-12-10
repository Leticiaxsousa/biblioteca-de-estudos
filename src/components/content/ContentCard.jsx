import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Bookmark as BookmarkIcon,
  Warning as WarningIcon
} from '@mui/icons-material';


export default function ContentCard({ content, onEdit, onDelete, onMarkComplete, user }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(content);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(content.id);
    handleMenuClose();
  };

  const handleMarkComplete = (event) => {
    event.stopPropagation();
    onMarkComplete(content.id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluído': return 'success';
      case 'Em andamento': return 'warning';
      default: return 'default';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Difícil': return 'error';
      case 'Médio': return 'warning';
      default: return 'success';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Concluído': return <CheckCircleIcon color="success" />;
      case 'Em andamento': return <PlayArrowIcon color="warning" />;
      default: return <BookmarkIcon color="disabled" />;
    }
  };
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': { 
          boxShadow: 3,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" noWrap sx={{ mb: 1 }}>
              {content.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip 
                icon={getStatusIcon(content.status)}
                label={content.status} 
                size="small" 
                color={getStatusColor(content.status)}
                variant="outlined"
              />
              <Chip 
                label={content.difficulty} 
                size="small" 
                color={getDifficultyColor(content.difficulty)}
              />
            </Box>
      
            {content.notes && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {content.notes}
              </Typography>
            )}
           
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <IconButton 
              size="small" 
              onClick={handleMarkComplete }
              color={content.status === 'Concluído' ? 'success' : 'default'}
            >
              <CheckCircleIcon />
            </IconButton>
            
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Editar
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Excluir
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}