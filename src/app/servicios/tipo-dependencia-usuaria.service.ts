import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoDependenciaUsuaria } from '../interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoDependenciaUsuariaService {
  private url:string= `${environment.API_URL}/tipoDependenciaUsuarias`;

  constructor(
    private http:HttpClient
  ) { }

  porUnidadAdministrativa($unidad_administrativa_id: number): Observable<TipoDependenciaUsuaria[]> {
    return this.http.get<TipoDependenciaUsuaria[]>(this.url+'/porUnidadAdministrativa/'+$unidad_administrativa_id);
  }
}
