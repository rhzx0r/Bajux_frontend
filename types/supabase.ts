export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      banner: {
        Row: {
          comercio_id: number | null;
          enlace: string | null;
          fecha_fin: string | null;
          fecha_inicio: string | null;
          id: number;
          imagen_url: string | null;
        };
        Insert: {
          comercio_id?: number | null;
          enlace?: string | null;
          fecha_fin?: string | null;
          fecha_inicio?: string | null;
          id?: number;
          imagen_url?: string | null;
        };
        Update: {
          comercio_id?: number | null;
          enlace?: string | null;
          fecha_fin?: string | null;
          fecha_inicio?: string | null;
          id?: number;
          imagen_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'banner_comercio_id_fkey';
            columns: ['comercio_id'];
            isOneToOne: false;
            referencedRelation: 'comercio';
            referencedColumns: ['id'];
          },
        ];
      };
      categoria_comercio: {
        Row: {
          descripcion: string | null;
          id: number;
          nombre: string | null;
        };
        Insert: {
          descripcion?: string | null;
          id?: number;
          nombre?: string | null;
        };
        Update: {
          descripcion?: string | null;
          id?: number;
          nombre?: string | null;
        };
        Relationships: [];
      };
      categoria_oferta: {
        Row: {
          descripcion: string | null;
          id: number;
          nombre: string | null;
        };
        Insert: {
          descripcion?: string | null;
          id?: number;
          nombre?: string | null;
        };
        Update: {
          descripcion?: string | null;
          id?: number;
          nombre?: string | null;
        };
        Relationships: [];
      };
      comercio: {
        Row: {
          descripcion: string | null;
          horario: Json | null;
          id: number;
          imagen_url: string | null;
          nombre: string | null;
          propietario_id: string | null;
          rfc: string | null;
          ubicacion: string | null;
        };
        Insert: {
          descripcion?: string | null;
          horario?: Json | null;
          id?: number;
          imagen_url?: string | null;
          nombre?: string | null;
          propietario_id?: string | null;
          rfc?: string | null;
          ubicacion?: string | null;
        };
        Update: {
          descripcion?: string | null;
          horario?: Json | null;
          id?: number;
          imagen_url?: string | null;
          nombre?: string | null;
          propietario_id?: string | null;
          rfc?: string | null;
          ubicacion?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'comercio_propietario_id_fkey';
            columns: ['propietario_id'];
            isOneToOne: false;
            referencedRelation: 'perfil_usuario';
            referencedColumns: ['id'];
          },
        ];
      };
      comercio_membresia: {
        Row: {
          activa: boolean | null;
          comercio_id: number | null;
          fecha_fin: string | null;
          fecha_inicio: string | null;
          id: number;
          membresia_id: number | null;
        };
        Insert: {
          activa?: boolean | null;
          comercio_id?: number | null;
          fecha_fin?: string | null;
          fecha_inicio?: string | null;
          id?: number;
          membresia_id?: number | null;
        };
        Update: {
          activa?: boolean | null;
          comercio_id?: number | null;
          fecha_fin?: string | null;
          fecha_inicio?: string | null;
          id?: number;
          membresia_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'comercio_membresia_comercio_id_fkey';
            columns: ['comercio_id'];
            isOneToOne: false;
            referencedRelation: 'comercio';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comercio_membresia_membresia_id_fkey';
            columns: ['membresia_id'];
            isOneToOne: false;
            referencedRelation: 'membresia_comercio';
            referencedColumns: ['id'];
          },
        ];
      };
      comercio_tiene_categoria: {
        Row: {
          categoria_comercio_id: number | null;
          comercio_id: number | null;
          id: number;
        };
        Insert: {
          categoria_comercio_id?: number | null;
          comercio_id?: number | null;
          id?: number;
        };
        Update: {
          categoria_comercio_id?: number | null;
          comercio_id?: number | null;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'comercio_tiene_categoria_categoria_comercio_id_fkey';
            columns: ['categoria_comercio_id'];
            isOneToOne: false;
            referencedRelation: 'categoria_comercio';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comercio_tiene_categoria_comercio_id_fkey';
            columns: ['comercio_id'];
            isOneToOne: false;
            referencedRelation: 'comercio';
            referencedColumns: ['id'];
          },
        ];
      };
      detalle_pedido: {
        Row: {
          cantidad: number | null;
          id: number;
          oferta_id: number | null;
          pedido_id: number | null;
          precio_unitario: number | null;
        };
        Insert: {
          cantidad?: number | null;
          id?: number;
          oferta_id?: number | null;
          pedido_id?: number | null;
          precio_unitario?: number | null;
        };
        Update: {
          cantidad?: number | null;
          id?: number;
          oferta_id?: number | null;
          pedido_id?: number | null;
          precio_unitario?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'detalle_pedido_oferta_id_fkey';
            columns: ['oferta_id'];
            isOneToOne: false;
            referencedRelation: 'oferta';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'detalle_pedido_pedido_id_fkey';
            columns: ['pedido_id'];
            isOneToOne: false;
            referencedRelation: 'pedido';
            referencedColumns: ['id'];
          },
        ];
      };
      membresia_comercio: {
        Row: {
          descripcion: string | null;
          id: number;
          nombre: Database['public']['Enums']['tipo_membresia_comercio'] | null;
          precio: number | null;
        };
        Insert: {
          descripcion?: string | null;
          id?: number;
          nombre?:
            | Database['public']['Enums']['tipo_membresia_comercio']
            | null;
          precio?: number | null;
        };
        Update: {
          descripcion?: string | null;
          id?: number;
          nombre?:
            | Database['public']['Enums']['tipo_membresia_comercio']
            | null;
          precio?: number | null;
        };
        Relationships: [];
      };
      membresia_usuario: {
        Row: {
          descripcion: string | null;
          id: number;
          nombre: Database['public']['Enums']['tipo_membresia_usuario'] | null;
          precio: number | null;
        };
        Insert: {
          descripcion?: string | null;
          id?: number;
          nombre?: Database['public']['Enums']['tipo_membresia_usuario'] | null;
          precio?: number | null;
        };
        Update: {
          descripcion?: string | null;
          id?: number;
          nombre?: Database['public']['Enums']['tipo_membresia_usuario'] | null;
          precio?: number | null;
        };
        Relationships: [];
      };
      notificacion: {
        Row: {
          fecha: string | null;
          id: number;
          leida: boolean | null;
          mensaje: string | null;
          usuario_id: string | null;
        };
        Insert: {
          fecha?: string | null;
          id?: number;
          leida?: boolean | null;
          mensaje?: string | null;
          usuario_id?: string | null;
        };
        Update: {
          fecha?: string | null;
          id?: number;
          leida?: boolean | null;
          mensaje?: string | null;
          usuario_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notificacion_usuario_id_fkey';
            columns: ['usuario_id'];
            isOneToOne: false;
            referencedRelation: 'perfil_usuario';
            referencedColumns: ['id'];
          },
        ];
      };
      oferta: {
        Row: {
          comercio_id: number | null;
          descripcion: string | null;
          disponible: boolean | null;
          id: number;
          imagen_url: string | null;
          nombre: string | null;
          precio: number | null;
          stock: number | null;
          tipo: Database['public']['Enums']['tipo_oferta'] | null;
        };
        Insert: {
          comercio_id?: number | null;
          descripcion?: string | null;
          disponible?: boolean | null;
          id?: number;
          imagen_url?: string | null;
          nombre?: string | null;
          precio?: number | null;
          stock?: number | null;
          tipo?: Database['public']['Enums']['tipo_oferta'] | null;
        };
        Update: {
          comercio_id?: number | null;
          descripcion?: string | null;
          disponible?: boolean | null;
          id?: number;
          imagen_url?: string | null;
          nombre?: string | null;
          precio?: number | null;
          stock?: number | null;
          tipo?: Database['public']['Enums']['tipo_oferta'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'oferta_comercio_id_fkey';
            columns: ['comercio_id'];
            isOneToOne: false;
            referencedRelation: 'comercio';
            referencedColumns: ['id'];
          },
        ];
      };
      oferta_tiene_categoria: {
        Row: {
          categoria_oferta_id: number | null;
          id: number;
          oferta_id: number | null;
        };
        Insert: {
          categoria_oferta_id?: number | null;
          id?: number;
          oferta_id?: number | null;
        };
        Update: {
          categoria_oferta_id?: number | null;
          id?: number;
          oferta_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'oferta_tiene_categoria_categoria_oferta_id_fkey';
            columns: ['categoria_oferta_id'];
            isOneToOne: false;
            referencedRelation: 'categoria_oferta';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'oferta_tiene_categoria_oferta_id_fkey';
            columns: ['oferta_id'];
            isOneToOne: false;
            referencedRelation: 'oferta';
            referencedColumns: ['id'];
          },
        ];
      };
      pago: {
        Row: {
          estado: Database['public']['Enums']['estado_pago'] | null;
          fecha: string | null;
          id: number;
          id_transaccion: string | null;
          metodo: Database['public']['Enums']['metodo_pago'] | null;
          monto: number | null;
          pedido_id: number | null;
        };
        Insert: {
          estado?: Database['public']['Enums']['estado_pago'] | null;
          fecha?: string | null;
          id?: number;
          id_transaccion?: string | null;
          metodo?: Database['public']['Enums']['metodo_pago'] | null;
          monto?: number | null;
          pedido_id?: number | null;
        };
        Update: {
          estado?: Database['public']['Enums']['estado_pago'] | null;
          fecha?: string | null;
          id?: number;
          id_transaccion?: string | null;
          metodo?: Database['public']['Enums']['metodo_pago'] | null;
          monto?: number | null;
          pedido_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'pago_pedido_id_fkey';
            columns: ['pedido_id'];
            isOneToOne: false;
            referencedRelation: 'pedido';
            referencedColumns: ['id'];
          },
        ];
      };
      pedido: {
        Row: {
          codigo_seguridad: string | null;
          comercio_id: number | null;
          direccion_entrega: string | null;
          estado: Database['public']['Enums']['estado_pedido'] | null;
          fecha: string | null;
          id: number;
          tipo_entrega: Database['public']['Enums']['tipo_entrega'] | null;
          total: number | null;
          usuario_id: string | null;
        };
        Insert: {
          codigo_seguridad?: string | null;
          comercio_id?: number | null;
          direccion_entrega?: string | null;
          estado?: Database['public']['Enums']['estado_pedido'] | null;
          fecha?: string | null;
          id?: number;
          tipo_entrega?: Database['public']['Enums']['tipo_entrega'] | null;
          total?: number | null;
          usuario_id?: string | null;
        };
        Update: {
          codigo_seguridad?: string | null;
          comercio_id?: number | null;
          direccion_entrega?: string | null;
          estado?: Database['public']['Enums']['estado_pedido'] | null;
          fecha?: string | null;
          id?: number;
          tipo_entrega?: Database['public']['Enums']['tipo_entrega'] | null;
          total?: number | null;
          usuario_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'pedido_comercio_id_fkey';
            columns: ['comercio_id'];
            isOneToOne: false;
            referencedRelation: 'comercio';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pedido_usuario_id_fkey';
            columns: ['usuario_id'];
            isOneToOne: false;
            referencedRelation: 'perfil_usuario';
            referencedColumns: ['id'];
          },
        ];
      };
      perfil_usuario: {
        Row: {
          cuenta_bancaria: string | null;
          edad: number | null;
          id: string;
          imagen_url: string | null;
          nombre: string;
          rol_actual: Database['public']['Enums']['tipo_rol'] | null;
          ubicacion: string | null;
          username: string;
        };
        Insert: {
          cuenta_bancaria?: string | null;
          edad?: number | null;
          id: string;
          imagen_url?: string | null;
          nombre: string;
          rol_actual?: Database['public']['Enums']['tipo_rol'] | null;
          ubicacion?: string | null;
          username: string;
        };
        Update: {
          cuenta_bancaria?: string | null;
          edad?: number | null;
          id?: string;
          imagen_url?: string | null;
          nombre?: string;
          rol_actual?: Database['public']['Enums']['tipo_rol'] | null;
          ubicacion?: string | null;
          username?: string;
        };
        Relationships: [];
      };
      promocion: {
        Row: {
          comercio_id: number | null;
          descripcion: string | null;
          fecha_fin: string | null;
          fecha_inicio: string | null;
          id: number;
          titulo: string | null;
        };
        Insert: {
          comercio_id?: number | null;
          descripcion?: string | null;
          fecha_fin?: string | null;
          fecha_inicio?: string | null;
          id?: number;
          titulo?: string | null;
        };
        Update: {
          comercio_id?: number | null;
          descripcion?: string | null;
          fecha_fin?: string | null;
          fecha_inicio?: string | null;
          id?: number;
          titulo?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'promocion_comercio_id_fkey';
            columns: ['comercio_id'];
            isOneToOne: false;
            referencedRelation: 'comercio';
            referencedColumns: ['id'];
          },
        ];
      };
      resena_comercio: {
        Row: {
          comentario: string | null;
          comercio_id: number | null;
          fecha: string | null;
          id: number;
          puntuacion: number | null;
          usuario_id: string | null;
        };
        Insert: {
          comentario?: string | null;
          comercio_id?: number | null;
          fecha?: string | null;
          id?: number;
          puntuacion?: number | null;
          usuario_id?: string | null;
        };
        Update: {
          comentario?: string | null;
          comercio_id?: number | null;
          fecha?: string | null;
          id?: number;
          puntuacion?: number | null;
          usuario_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'resena_comercio_comercio_id_fkey';
            columns: ['comercio_id'];
            isOneToOne: false;
            referencedRelation: 'comercio';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'resena_comercio_usuario_id_fkey';
            columns: ['usuario_id'];
            isOneToOne: false;
            referencedRelation: 'perfil_usuario';
            referencedColumns: ['id'];
          },
        ];
      };
      resena_oferta: {
        Row: {
          comentario: string | null;
          fecha: string | null;
          id: number;
          oferta_id: number | null;
          puntuacion: number | null;
          usuario_id: string | null;
        };
        Insert: {
          comentario?: string | null;
          fecha?: string | null;
          id?: number;
          oferta_id?: number | null;
          puntuacion?: number | null;
          usuario_id?: string | null;
        };
        Update: {
          comentario?: string | null;
          fecha?: string | null;
          id?: number;
          oferta_id?: number | null;
          puntuacion?: number | null;
          usuario_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'resena_oferta_oferta_id_fkey';
            columns: ['oferta_id'];
            isOneToOne: false;
            referencedRelation: 'oferta';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'resena_oferta_usuario_id_fkey';
            columns: ['usuario_id'];
            isOneToOne: false;
            referencedRelation: 'perfil_usuario';
            referencedColumns: ['id'];
          },
        ];
      };
      rol: {
        Row: {
          descripcion: string | null;
          id: number;
          nombre: Database['public']['Enums']['tipo_rol'] | null;
        };
        Insert: {
          descripcion?: string | null;
          id?: number;
          nombre?: Database['public']['Enums']['tipo_rol'] | null;
        };
        Update: {
          descripcion?: string | null;
          id?: number;
          nombre?: Database['public']['Enums']['tipo_rol'] | null;
        };
        Relationships: [];
      };
      seguidor: {
        Row: {
          comercio_id: number | null;
          fecha_seguimiento: string | null;
          id: number;
          usuario_id: string | null;
        };
        Insert: {
          comercio_id?: number | null;
          fecha_seguimiento?: string | null;
          id?: number;
          usuario_id?: string | null;
        };
        Update: {
          comercio_id?: number | null;
          fecha_seguimiento?: string | null;
          id?: number;
          usuario_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'seguidor_comercio_id_fkey';
            columns: ['comercio_id'];
            isOneToOne: false;
            referencedRelation: 'comercio';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'seguidor_usuario_id_fkey';
            columns: ['usuario_id'];
            isOneToOne: false;
            referencedRelation: 'perfil_usuario';
            referencedColumns: ['id'];
          },
        ];
      };
      usuario_membresia: {
        Row: {
          activa: boolean | null;
          fecha_fin: string | null;
          fecha_inicio: string | null;
          id: number;
          membresia_id: number | null;
          usuario_id: string | null;
        };
        Insert: {
          activa?: boolean | null;
          fecha_fin?: string | null;
          fecha_inicio?: string | null;
          id?: number;
          membresia_id?: number | null;
          usuario_id?: string | null;
        };
        Update: {
          activa?: boolean | null;
          fecha_fin?: string | null;
          fecha_inicio?: string | null;
          id?: number;
          membresia_id?: number | null;
          usuario_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'usuario_membresia_membresia_id_fkey';
            columns: ['membresia_id'];
            isOneToOne: false;
            referencedRelation: 'membresia_usuario';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'usuario_membresia_usuario_id_fkey';
            columns: ['usuario_id'];
            isOneToOne: false;
            referencedRelation: 'perfil_usuario';
            referencedColumns: ['id'];
          },
        ];
      };
      usuario_rol: {
        Row: {
          fecha_asignacion: string | null;
          rol_id: number;
          usuario_id: string;
        };
        Insert: {
          fecha_asignacion?: string | null;
          rol_id: number;
          usuario_id: string;
        };
        Update: {
          fecha_asignacion?: string | null;
          rol_id?: number;
          usuario_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'usuario_rol_rol_id_fkey';
            columns: ['rol_id'];
            isOneToOne: false;
            referencedRelation: 'rol';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'usuario_rol_usuario_id_fkey';
            columns: ['usuario_id'];
            isOneToOne: false;
            referencedRelation: 'perfil_usuario';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      estado_pago: 'pendiente' | 'completado' | 'fallido' | 'reembolsado';
      estado_pedido:
        | 'pendiente'
        | 'preparando'
        | 'enviado'
        | 'entregado'
        | 'cancelado';
      metodo_pago:
        | 'tarjeta'
        | 'efectivo'
        | 'transferencia'
        | 'billetera_digital';
      tipo_entrega: 'recoger' | 'domicilio';
      tipo_membresia_comercio: 'basica' | 'pro' | 'premium_analitica';
      tipo_membresia_usuario: 'gratis' | 'premium' | 'sin_publicidad';
      tipo_oferta: 'producto' | 'servicio';
      tipo_rol: 'cliente' | 'comerciante' | 'administrador';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      estado_pago: ['pendiente', 'completado', 'fallido', 'reembolsado'],
      estado_pedido: [
        'pendiente',
        'preparando',
        'enviado',
        'entregado',
        'cancelado',
      ],
      metodo_pago: [
        'tarjeta',
        'efectivo',
        'transferencia',
        'billetera_digital',
      ],
      tipo_entrega: ['recoger', 'domicilio'],
      tipo_membresia_comercio: ['basica', 'pro', 'premium_analitica'],
      tipo_membresia_usuario: ['gratis', 'premium', 'sin_publicidad'],
      tipo_oferta: ['producto', 'servicio'],
      tipo_rol: ['cliente', 'comerciante', 'administrador'],
    },
  },
} as const;
