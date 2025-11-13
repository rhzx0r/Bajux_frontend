import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';
import type {
  NewComercio,
  UpdateComercio,
  Comercio,
  CategoriaComercio,
} from '../types';

export const comercioService = {
  // Crear un nuevo comercio
  async createComercio(
    session: Session,
    comercioData: Omit<NewComercio, 'id' | 'propietario_id'>,
  ): Promise<Comercio> {
    if (!session?.user) throw new Error('No user on the session!');

    const { data, error } = await supabase
      .from('comercio')
      .insert({
        ...comercioData,
        propietario_id: session.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Actualizar el rol del usuario a 'comerciante'
    await supabase
      .from('perfil_usuario')
      .update({ rol_actual: 'comerciante' })
      .eq('id', session.user.id);

    return data;
  },

  // Obtener comercios del usuario
  async getComerciosByUser(session: Session): Promise<Comercio[]> {
    if (!session?.user) throw new Error('No user on the session!');

    const { data, error } = await supabase
      .from('comercio')
      .select('*')
      .eq('propietario_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Obtener un comercio específico
  async getComercioById(id: number): Promise<Comercio | null> {
    const { data, error } = await supabase
      .from('comercio')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  // Actualizar comercio
  async updateComercio(id: number, updates: UpdateComercio): Promise<Comercio> {
    const { data, error } = await supabase
      .from('comercio')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obtener categorías de comercios
  async getCategoriasComercio(): Promise<CategoriaComercio[]> {
    const { data, error } = await supabase
      .from('categoria_comercio')
      .select('*')
      .order('nombre');

    if (error) throw error;
    return data || [];
  },

  // Asignar categoría a comercio
  async asignarCategoriaComercio(
    comercioId: number,
    categoriaId: number,
  ): Promise<void> {
    const { error } = await supabase.from('comercio_tiene_categoria').insert({
      comercio_id: comercioId,
      categoria_comercio_id: categoriaId,
    });

    if (error) throw error;
  },
};
