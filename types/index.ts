// types/index.ts
import type { Tables, TablesInsert, TablesUpdate, Enums } from './supabase';

// Aliases y tipos personalizados
export type Profile = Tables<'perfil_usuario'>;
export type NewProfile = TablesInsert<'perfil_usuario'>;
export type UpdateProfile = TablesUpdate<'perfil_usuario'>;

// Puedes agregar más aliases según necesites
export type Comercio = Tables<'comercio'>;
export type Oferta = Tables<'oferta'>;
export type Pedido = Tables<'pedido'>;

// Enums comunes
export type TipoRol = Enums<'tipo_rol'>;
export type TipoOferta = Enums<'tipo_oferta'>;
export type EstadoPedido = Enums<'estado_pedido'>;

// Re-exportar todo desde supabase
export type { Database } from './supabase';
export type { Tables, TablesInsert, TablesUpdate, Enums } from './supabase';
