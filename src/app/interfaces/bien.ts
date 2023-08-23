import { Categoria } from "./categoria";
import { Denominacion } from "./denominacion";
import { Marca } from "./marca";

export interface Bien {
  id?: number;
  codigo: string;
  denominacion_id: number;
  descripcion: string;
  marca_id: number;
  monto: string;
  serial: string;
  dependencia_usuaria_id?: number;
  denominacion_nombre?: string; // lo utilizo solo en inventario
  deleted_at?:string | null;
  created_at:string;
  updated_at:string;
}


export interface BienAdd {
  bien: Bien;
  message: string;
  movimiento_id: number;
}

export interface BienEdit {
  categorias: Categoria[];
  denominacions: Denominacion[];
  bien: Bien;
  marcas: Marca[];
}


export interface BienPaginate {
  current_page: number;
  data: Bien[];
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
