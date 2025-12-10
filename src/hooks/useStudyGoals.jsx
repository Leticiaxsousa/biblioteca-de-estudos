import { useEffect, useState, useCallback } from 'react';
import { studyGoalService } from '../services/studyGoalService';
function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0,0,0,0);
  return monday;
}
function endOfWeek(date) {
  const s = startOfWeek(date);
  const e = new Date(s);
  e.setDate(s.getDate() + 6);
  e.setHours(23,59,59,999);
  return e;
}

function startOfMonth(date) {
  const d = new Date(date);
  const s = new Date(d.getFullYear(), d.getMonth(), 1);
  s.setHours(0,0,0,0);
  return s;
}
function endOfMonth(date) {
  const d = new Date(date);
  const e = new Date(d.getFullYear(), d.getMonth()+1, 0);
  e.setHours(23,59,59,999);
  return e;
}
export function useStudyGoals(userId, contents = []) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const computeProgress = useCallback((goal) => {
    const now = new Date();
    if (goal.goal_type === 'weekly') {
      const s = startOfWeek(now);
      const e = endOfWeek(now);
      const done = contents
        .filter(c => c.status === 'Concluído')
        .filter(c => {
          if (!c.created_at) return false;
          const created = new Date(c.created_at);
          return created >= s && created <= e;
        }).length;

      const target = goal.target_value || 1;

      return {
        ...goal,
        progress: Math.min(100, Math.round((done / target) * 100)),
        current_value: done,
        remaining: Math.max(0, target - done)
      };
    }
    if (goal.goal_type === 'monthly') {
      const s = startOfMonth(now);
      const e = endOfMonth(now);

      const done = contents
        .filter(c => c.status === 'Concluído')
        .filter(c => {
          if (!c.created_at) return false;
          const created = new Date(c.created_at);
          return created >= s && created <= e;
        }).length;
      const target = goal.target_value || 1;
      return {
        ...goal,
        progress: Math.min(100, Math.round((done / target) * 100)),
        current_value: done,
        remaining: Math.max(0, target - done)
      };
    }
    if (goal.goal_type === 'content') {
      const content = contents.find(c => String(c.id) === String(goal.content_id));
      const completed = content && content.status === 'Concluído';

      const due = goal.due_date ? new Date(goal.due_date) : null;
      const daysRemaining = due
        ? Math.max(0, Math.ceil((due - new Date()) / 86400000))
        : null;

      return {
        ...goal,
        progress: completed ? 100 : 0,
        current_value: completed ? 1 : 0,
        remaining: completed ? 0 : 1,
        daysRemaining
      };
    }
    return {
      ...goal,
      progress: 0,
      current_value: 0,
      remaining: goal.target_value || 0
    };

  }, [contents]);
  const fetchGoals = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const { data } = await studyGoalService.getAll(userId);
      setGoals((data || []).map(g => computeProgress(g)));
    } catch {
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, [userId, computeProgress]);
  useEffect(() => {
    fetchGoals();
  }, [contents, fetchGoals]);
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);
  const addGoal = async (payload) => {
    try {
      const { data } = await studyGoalService.create({ ...payload, user_id: userId });
      if (data) {
        setGoals(prev => [computeProgress(data), ...prev]);
      }
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
      throw error;
    }
  };

  const updateGoal = async (id, payload) => {
    try {
      const { data } = await studyGoalService.update(id, payload);
      if (data) {
        setGoals(prev => prev.map(goal =>
          goal.id === id ? computeProgress(data) : goal
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      throw error;
    }
  };

  const deleteGoal = async (id) => {
    try {
      await studyGoalService.delete(id);
      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
      throw error;
    }
  };
  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals
  };
}
