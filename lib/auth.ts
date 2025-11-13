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

      // 2. Verificar que el usuario se creó correctamente en Auth
      if (!authData.user) {
        throw new Error(
          'No se pudo crear el usuario en el sistema de autenticación',
        );
      }

      console.log('Usuario creado en Auth:', authData.user.id);

      // 3. Esperar un momento para asegurar que el usuario esté en la tabla users
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 4. Crear el perfil en la tabla perfil_usuario con el tipo correcto
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

      console.log('Creando perfil con ID:', profileData.id);

      const { error: profileError } = await supabase
        .from('perfil_usuario')
        .insert(profileData);

      if (profileError) {
        console.error('Error creando perfil:', profileError);

        // Si falla la creación del perfil, intentar eliminar el usuario de Auth
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (deleteError) {
          console.error('Error eliminando usuario de Auth:', deleteError);
        }

        throw profileError;
      }

      return {
        data: authData,
        error: null,
        message:
          'Registro exitoso. Por favor, verifica tu email antes de iniciar sesión.',
      };
    } catch (error: any) {
      console.error('Error en registro completo:', error);
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
