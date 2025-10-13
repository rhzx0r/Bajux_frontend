import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';
import type { Profile, ProfileUpdates } from '../types';

export async function getProfile(session: Session): Promise<Profile | null> {
  if (!session?.user) throw new Error('No user on the session!');

  const { data, error, status } = await supabase
    .from('perfil_usuario')
    .select(`*`)
    .eq('id', session.user.id)
    .single();

  if (error && status !== 406) {
    throw error;
  }

  return data;
}

export async function updateProfile(session: Session, updates: ProfileUpdates) {
  if (!session?.user) throw new Error('No user on the session!');

  const profileData = {
    ...updates,
    id: session.user.id,
  };

  const { error } = await supabase.from('perfil_usuario').upsert(profileData);

  if (error) {
    throw error;
  }
}
