import { useState, useEffect } from 'react';
import { goalService } from '../services/goalService';
import { calculateGoalProgress } from '../utils/goalCalculations';
export function useGoals(userId, contents = []) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await goalService.getAll(userId);
      if (error) throw error;
      
      const goalsWithProgress = (data || []).map(goal => 
        calculateGoalProgress(goal, contents)
      );
      
      setGoals(goalsWithProgress);
    } catch (err) {
      console.error('Erro ao buscar metas:', err);
      setError(err.message);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGoals();
  }, [userId]); 

  const addGoal = async (goalData) => {
    try {
      const { data, error } = await goalService.create(goalData);
      if (error) throw error;
      setGoals(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const updateGoal = async (id, updates) => {
    try {
      const { data, error } = await goalService.update(id, updates);
      if (error) throw error;
      setGoals(prev => prev.map(item => item.id === id ? data : item));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const deleteGoal = async (id) => {
    try {
      await goalService.delete(id);
      setGoals(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals
  };
}