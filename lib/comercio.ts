import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';
import type {
  NewComercio,
  UpdateComercio,
  Comercio,
  CategoriaComercio,
  Oferta,
  NewOferta,
  UpdateOferta,
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
      .order('id', { ascending: false });

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

  // Obtener ofertas de un comercio
  async getOfertasByComercio(
    comercioId: number,
    includeUnavailable = false,
  ): Promise<Oferta[]> {
    let query = supabase
      .from('oferta')
      .select('*')
      .eq('comercio_id', comercioId);

    if (!includeUnavailable) {
      query = query.eq('disponible', true);
    }

    const { data, error } = await query.order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Crear una nueva oferta (producto/servicio)
  async createOferta(ofertaData: Omit<NewOferta, 'id'>): Promise<Oferta> {
    const { data, error } = await supabase
      .from('oferta')
      .insert(ofertaData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar una oferta
  async updateOferta(id: number, updates: UpdateOferta): Promise<Oferta> {
    const { data, error } = await supabase
      .from('oferta')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Eliminar (o desactivar) una oferta
  async deleteOferta(id: number): Promise<void> {
    console.log('Intentando eliminar oferta:', id);

    // 1. Verificar si existen pedidos asociados (bloqueo por historial)
    const { count, error: countError } = await supabase
      .from('detalle_pedido')
      .select('*', { count: 'exact', head: true })
      .eq('oferta_id', id);

    if (countError) {
      console.error('Error verificando pedidos:', countError);
      throw countError;
    }

    // Si hay pedidos, lanzamos error de llave foránea simulado para que el frontend sugiera archivar
    // Esto evita borrar reseñas/categorías si la oferta no se puede eliminar
    if (count && count > 0) {
      console.log('Oferta tiene pedidos asociados, no se puede eliminar permanentemente');
      throw { code: '23503', message: 'Oferta tiene pedidos asociados' };
    }

    // 2. Si no hay pedidos, eliminar dependencias
    const { error: catError } = await supabase
      .from('oferta_tiene_categoria')
      .delete()
      .eq('oferta_id', id);

    if (catError) {
      console.error('Error eliminando categorías:', catError);
      throw catError;
    }

    const { error: revError } = await supabase
      .from('resena_oferta')
      .delete()
      .eq('oferta_id', id);

    if (revError) {
      console.error('Error eliminando reseñas:', revError);
      throw revError;
    }

    // 3. Eliminar la oferta
    const { error } = await supabase.from('oferta').delete().eq('id', id);

    if (error) {
      console.error('Error eliminando oferta:', error);
      throw error;
    }

    console.log('Oferta eliminada correctamente:', id);
  },
};
