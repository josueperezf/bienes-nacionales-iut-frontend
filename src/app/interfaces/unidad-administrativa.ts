import { DependenciaUsuaria } from "./dependencia-usuaria";
import { Subcoordinacion } from "./subcoordinacion";

export interface UnidadAdministrativa {
    id:number,
    subcoordinacion_id:number,
    nombre:string,
    telefono:string,
    deleted_at?:string | null,
    created_at:string,
    updated_at:string,
    subcoordinacion?:   Subcoordinacion;
}


export interface UnidadAdministrativaPaginate {
  current_page: number;
  data: UnidadAdministrativa[];
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



export interface UnidadAdministrativaShow extends UnidadAdministrativa {
  subcoordinacion: Subcoordinacion;
  dependencia_usuarias: DependenciaUsuaria[];
}

