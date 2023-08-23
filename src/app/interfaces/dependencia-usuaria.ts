import { Coordinacion } from "./coordinacion";
import { Subcoordinacion } from "./subcoordinacion";
import { TipoDependenciaUsuaria } from "./tipo-dependencia-usuarias";
import { UnidadAdministrativa } from "./unidad-administrativa";

export interface DependenciaUsuaria {
    id:number,
    tipo_dependencia_usuaria_id:number,
    unidad_administrativa_id:number,
    nombre:string,
    deleted_at?:string | null,
    created_at:string,
    updated_at:string,
    unidad_administrativa?: UnidadAdministrativa;
}


export interface DependenciaUsuariaPaginate {
  current_page: number;
  data: DependenciaUsuaria[];
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

export interface DependenciaUsuariaEdit {
  coordinaciones:          Coordinacion[];
  subcoordinaciones:       Subcoordinacion[];
  tipoDependenciaUsuarias: TipoDependenciaUsuaria[];
  unidadAdministrativas:   UnidadAdministrativa[];
  dependenciaUsuaria:      DependenciaUsuaria;
}


export interface  DependenciaUsuariaAlmacen {
  dependencia_usuaria_id: number,
  nombre: string,
  unidad_administrativa_nombre: string
}
