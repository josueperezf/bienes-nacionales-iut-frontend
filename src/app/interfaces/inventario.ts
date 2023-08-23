import { Bien } from "./bien";
import { DependenciaUsuaria } from "./dependencia-usuaria";

export interface BienInventario {
  denominacion_nombre: string;
  marca_nombre: string;
}

export interface Inventario {
  dependenciaUsuaria: DependenciaUsuaria;
  biens: Bien[];
}


export interface InventarioRequest {
  dependencia_usuaria_id: number;
  fecha: string;
}
