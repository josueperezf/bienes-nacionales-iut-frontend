import { Coordinacion } from "./coordinacion";

export interface Subcoordinacion {
    id:number,
    coordinacion_id:number,
    ciudad:string,
    nombre:string,
    direccion:string,
    deleted_at?:string | null,
    created_at:string,
    updated_at:string,
    unidad_administrativas?: [],
    coordinacion?:   Coordinacion,
}

export interface SubcoordinacionPaginate {
  current_page: number;
  data: Subcoordinacion[];
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



// Generated by https://quicktype.io
export interface SubcoordinacionResponseEdit {
  subcoordinacion: Subcoordinacion;
  coordinacion:    Coordinacion;
}
