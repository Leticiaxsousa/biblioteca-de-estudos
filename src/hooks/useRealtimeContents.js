// hooks/useRealtime.js
import { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export function useRealtime(callbacks) {
  useEffect(() => {
    const channel = supabase.channel('realtime-changes');
    
    if (callbacks.onContent) {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contents' },
        callbacks.onContent
      );
    }
    
    if (callbacks.onGoal) {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'goals' },
        callbacks.onGoal
      );
    }
    
    if (callbacks.onTopic) {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'topics' },
        callbacks.onTopic
      );
    }

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [callbacks]);
}