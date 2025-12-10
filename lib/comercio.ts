import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';
import type {
  NewComercio,
  UpdateComercio,
  Comercio,
  CategoriaComercio,
  CategoriaOferta,
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

  // Obtener todos los comercios (público)
  async getAllComercios(searchQuery: string = ''): Promise<Comercio[]> {
    let query = supabase.from('comercio').select('*');

    if (searchQuery) {
      query = query.ilike('nombre', `%${searchQuery}%`);
    }

    const { data, error } = await query.order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Obtener todos los servicios destacados (ofertas tipo servicio)
  async getAllServices(searchQuery: string = ''): Promise<Oferta[]> {
    let query = supabase
      .from('oferta')
      .select('*')
      .eq('tipo', 'servicio')
      .eq('disponible', true);

    if (searchQuery) {
      query = query.ilike('nombre', `%${searchQuery}%`);
    }

    const { data, error } = await query.order('id', { ascending: false });

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

  // === Categorías de Oferta ===

  // Obtener categorías de ofertas
  async getCategoriasOferta(): Promise<CategoriaOferta[]> {
    const { data, error } = await supabase
      .from('categoria_oferta')
      .select('*')
      .order('nombre');

    if (error) throw error;
    return data || [];
  },

  // Obtener categorías asignadas a una oferta
  async getCategoriasByOferta(ofertaId: number): Promise<number[]> {
    const { data, error } = await supabase
      .from('oferta_tiene_categoria')
      .select('categoria_oferta_id')
      .eq('oferta_id', ofertaId);

    if (error) throw error;
    return data.map((item) => item.categoria_oferta_id!).filter(Boolean);
  },

  // Asignar categorías a una oferta (sobrescribe)
  async updateOfertaCategories(
    ofertaId: number,
    categoryIds: number[],
  ): Promise<void> {
    // 1. Eliminar existentes
    const { error: deleteError } = await supabase
      .from('oferta_tiene_categoria')
      .delete()
      .eq('oferta_id', ofertaId);

    if (deleteError) throw deleteError;

    if (categoryIds.length === 0) return;

    // 2. Insertar nuevas
    const toInsert = categoryIds.map((catId) => ({
      oferta_id: ofertaId,
      categoria_oferta_id: catId,
    }));

    const { error: insertError } = await supabase
      .from('oferta_tiene_categoria')
      .insert(toInsert);

    if (insertError) throw insertError;
  },

  // ============================

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

    // Si hay pedidos, lanzamos error de llave foránea simulado
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

  // Eliminar un comercio y sus dependencias
  async deleteComercio(id: number): Promise<void> {
    console.log('Intentando eliminar comercio:', id);

    // 1. Verificar si existen pedidos asociados al comercio
    const { count: pedidoCount, error: pedidoError } = await supabase
      .from('pedido')
      .select('*', { count: 'exact', head: true })
      .eq('comercio_id', id);

    if (pedidoError) throw pedidoError;

    if (pedidoCount && pedidoCount > 0) {
      throw {
        code: '23503',
        message: 'El comercio tiene pedidos asociados y no puede ser eliminado.',
      };
    }

    // 2. Eliminar todas las ofertas asociadas
    const ofertas = await this.getOfertasByComercio(id, true);

    for (const oferta of ofertas) {
      try {
        await this.deleteOferta(oferta.id);
      } catch (error: any) {
        if (error.code === '23503') {
           throw {
             code: '23503',
             message: `La oferta "${oferta.nombre}" tiene historial de ventas.`,
           };
        }
        throw error;
      }
    }

    // 3. Eliminar dependencias directas del comercio
    const dependencies = [
      'banner',
      'resena_comercio',
      'seguidor',
      'promocion',
      'comercio_tiene_categoria',
      'comercio_membresia',
    ] as const;

    for (const table of dependencies) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('comercio_id', id);

      if (error) {
        console.error(`Error eliminando dependencias en ${table}:`, error);
        throw error;
      }
    }

    // 4. Finalmente eliminar el comercio
    const { error } = await supabase.from('comercio').delete().eq('id', id);

    if (error) {
      console.error('Error eliminando comercio:', error);
      throw error;
    }

    console.log('Comercio eliminado correctamente:', id);
  },
};
