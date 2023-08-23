import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoDependenciaUsuaria } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TipoDependenciaUsuariaService {
  protected url:string='http://127.0.0.1:8000/api/tipoDependenciaUsuarias';
  //protected url:string='https://josueperezf.000webhostapp.com/api/tipoDependenciaUsuarias';

  constructor(
    private http:HttpClient
  ) { }

  porUnidadAdministrativa($unidad_administrativa_id: number): Observable<TipoDependenciaUsuaria[]> {
    return this.http.get<TipoDependenciaUsuaria[]>(this.url+'/porUnidadAdministrativa/'+$unidad_administrativa_id);
  }
}
