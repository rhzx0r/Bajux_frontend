import { supabase } from './supabase';
import { NewProfile } from '../types';

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  nombre: string;
  username: string;
  edad?: number;
  ubicacion?: string;
};

export const authService = {
  async login({ email, password }: LoginData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async register(userData: RegisterData) {
    try {
      // 1. Crear usuario en Auth de Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            nombre: userData.nombre,
            username: userData.username,
          },
        },
      });

      if (authError) throw authError;

      // 2. Si el usuario se creó correctamente, crear el perfil en la tabla perfil_usuario
      if (authData.user) {
        const profileData: NewProfile = {
          id: authData.user.id,
          nombre: userData.nombre,
          username: userData.username,
          edad: userData.edad || null,
          ubicacion: userData.ubicacion || null,
          cuenta_bancaria: null,
          rol_actual: 'cliente',
          imagen_url: null,
        };

        const { error: profileError } = await supabase
          .from('perfil_usuario')
          .insert(profileData);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw profileError;
        }
      }

      return {
        data: authData,
        error: null,
        message:
          'Registro exitoso. Por favor, verifica tu email antes de iniciar sesión.',
      };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async upgradeToComerciante(userId: string, comercioData: any) {
    // 1. Actualizar rol en perfil_usuario
    await supabase
      .from('perfil_usuario')
      .update({ rol_actual: 'comerciante' })
      .eq('id', userId);

    // 2. Crear el comercio
    const { data: comercio, error } = await supabase
      .from('comercio')
      .insert({
        ...comercioData,
        propietario_id: userId,
      })
      .select()
      .single();

    return { comercio, error };
  },

  async resendConfirmationEmail(email: string) {
    try {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'bajux://reset-password',
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },
};
