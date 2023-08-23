export interface DetalleTipoMovimiento {
  id: number;
  codigo?: string;
  nombre: string;
  tipo_movimiento_id: number;
  created_at?:string | null;
  updated_at?:string | null;
}
