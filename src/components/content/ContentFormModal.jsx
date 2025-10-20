
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  MenuItem,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput
} from '@mui/material';
import { useContents } from '../../hooks/useContents';
export default function ContentFormModal({ 
  open, 
  onClose, 
  onSaved, 
  user, 
  initialContent,
  addContent,       
  updateContent      
}) {

  const [formData, setFormData] = React.useState({
    title: '',
    status: 'Quero estudar',
    difficulty: 'Fácil',
    notes: '',
    topicIds: []
  });

  React.useEffect(() => {
    if (initialContent) {
      setFormData({
        title: initialContent.title || '',
        status: initialContent.status || 'Quero estudar',
        difficulty: initialContent.difficulty || 'Fácil',
        notes: initialContent.notes || '',
        topicIds: initialContent.topic_ids || []
      });
    } else {
      setFormData({
        title: '',
        status: 'Quero estudar',
        difficulty: 'Fácil',
        notes: '',
        topicIds: []
      });
    }
  }, [initialContent, open]);

  const handleSave = async () => {
    if (!formData.title.trim()) return;

    try {
      console.log(' Iniciando salvamento dconteúdo');
      const contentData = {
        title: formData.title.trim(),
        status: formData.status,
        difficulty: formData.difficulty,
        notes: formData.notes,
      };
      let result;
      if (initialContent) {
        console.log(' Editando conteúdo :', initialContent.id);
        result = await updateContent(initialContent.id, contentData);
      } else {
        console.log('Criando novo conteúdo');
        result = await addContent({ ...contentData, user_id: user.id });
      }
      console.log(' concluída:', result);
      onSaved();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
    }
  };

  const handleTopicChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({ ...prev, topicIds: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialContent ? 'Editar Conteúdo' : 'Novo Conteúdo'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Título"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            fullWidth
          >
            <MenuItem value="Quero estudar">Quero estudar</MenuItem>
            <MenuItem value="Em andamento">Em andamento</MenuItem>
            <MenuItem value="Concluído">Concluído</MenuItem>
          </TextField>
          <TextField
            select
            label="Dificuldade"
            value={formData.difficulty}
            onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
            fullWidth
          >
            <MenuItem value="Fácil">Fácil</MenuItem>
            <MenuItem value="Médio">Médio</MenuItem>
            <MenuItem value="Difícil">Difícil</MenuItem>
          </TextField>
          
          <TextField
            label="Notas"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            multiline
            rows={4}
            fullWidth
          />
          
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">
          {initialContent ? 'Atualizar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}