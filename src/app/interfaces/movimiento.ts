export interface MovimientoPaginteItem {
  id: number;
  detalle_tipo_movimiento_id: number;
  fecha: string;
  created_at: string;
  updated_at: string;
  detalle_tipo_movimiento_nombre: string;
  tipo_movimiento_nombre: string;
}


export interface MovimientoPaginate {
  current_page: number;
  data: MovimientoPaginteItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url?: any;
  path: string;
  per_page: number;
  prev_page_url?: any;
  to: number;
  total: number;
}

interface Link {
  url?: string;
  label: string;
  active: boolean;
}
