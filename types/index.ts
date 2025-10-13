import { Database } from './supabase';

export type Profile = Database['public']['Tables']['perfil_usuario']['Row'];
export type ProfileUpdates =
  Database['public']['Tables']['perfil_usuario']['Update'];
