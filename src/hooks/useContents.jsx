import { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
export function useContents(userId) {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchContents = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await contentService.getAll(userId);
      if (error) throw error;
      setContents(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchContents();
  }, [userId]);
  const addContent = async (contentData) => {
    try {
      const { data, error } = await contentService.create(contentData);
      if (error) throw error;
      setContents(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const updateContent = async (id, updates) => {
    try {
      const { data, error } = await contentService.update(id, updates);
      if (error) throw error;
      setContents(prev => prev.map(item => item.id === id ? data : item));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const deleteContent = async (id) => {
    try {
      await contentService.delete(id);
      setContents(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const markComplete = async (id) => {
    return updateContent(id, { status: 'Concluído' });
  };
  return {
    contents,
    loading,
    error,
    addContent,
    updateContent,
    deleteContent,
    markComplete,
    refetch: fetchContents
  };
}