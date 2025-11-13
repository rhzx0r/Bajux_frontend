import { supabase } from './supabase';

export const storageService = {
  async uploadProfileImage(
    userId: string,
    fileUri: string,
  ): Promise<string | null> {
    try {
      // Convertir URI a blob
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // Crear nombre único para el archivo
      const fileExt = fileUri.split('.').pop() || 'jpg';
      const fileName = `profiles/${userId}/avatar.${fileExt}`;

      // Subir archivo
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, blob, {
          upsert: true, // Sobrescribir si existe
          contentType: 'image/jpeg',
        });

      if (error) throw error;

      // Obtener URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from('images').getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  },

  async updateProfileImage(userId: string, imageUrl: string) {
    try {
      const { data, error } = await supabase
        .from('perfil_usuario')
        .update({ imagen_url: imageUrl })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async uploadComercioImage(
    userId: string,
    fileUri: string,
  ): Promise<string | null> {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const fileExt = fileUri.split('.').pop() || 'jpg';
      const fileName = `comercios/${userId}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, blob, {
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('images').getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading comercio image:', error);
      return null;
    }
  },
};
