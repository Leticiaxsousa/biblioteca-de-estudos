import { supabase } from './supabaseClient';
export const contentService = {
  getAll: (userId) => 
    supabase
      .from('contents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
  getById: (id) => 
    supabase
      .from('contents')
      .select('*')
      .eq('id', id)
      .single(),

  create: (data) => 
    supabase
      .from('contents')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single(),

  update: (id, data) => 
    supabase
      .from('contents')
      .update({ 
        ...data, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single(),

  delete: (id) => 
    supabase
      .from('contents')
      .delete()
      .eq('id', id),

  markComplete: (id) => 
    supabase
      .from('contents')
      .update({ 
        status: 'Concluído', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()
};