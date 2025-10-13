import { supabase } from './supabase';
import { AppState } from 'react-native';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) throw error;
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) throw error;
  if (!data.session)
    throw new Error('Please check your inbox for email verification!');
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
