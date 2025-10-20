import { supabase } from './supabaseClient';
export const goalService = {
  getAll: (userId) => 
    supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('period_end', { ascending: true })
      .order('created_at', { ascending: false }),

  create: (data) => 
    supabase
      .from('goals')
      .insert([data])
      .select()
      .single(),
  update: (id, data) => 
    supabase
      .from('goals')
      .update(data)
      .eq('id', id)
      .select()
      .single(),

  delete: (id) => 
    supabase
      .from('goals')
      .delete()
      .eq('id', id)
};