import { supabase } from './supabaseClient';

export const studyGoalService = {
  getAll: (userId) =>
    supabase
      .from('study_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true }),

  create: (data) =>
    supabase
      .from('study_goals')
      .insert([data])
      .select()
      .single(),

  update: (id, data) =>
    supabase
      .from('study_goals')
      .update(data)
      .eq('id', id)
      .select()
      .single(),

  delete: (id) =>
    supabase
      .from('study_goals')
      .delete()
      .eq('id', id)
};
