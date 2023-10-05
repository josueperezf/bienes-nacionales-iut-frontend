import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DependenciaUsuaria, DependenciaUsuariaEdit, DependenciaUsuariaPaginate } from '../interfaces/dependencia-usuaria';
import { Observable } from 'rxjs';
import { PaginacionParams } from '../interfaces/paginacion';
import { getUrlPaginate } from '../utils/urlPaginate';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DependenciaUsuariaService {
  private url:string= `${environment.API_URL}/dependenciaUsuarias`;

  constructor(
    private http:HttpClient
  ) { }
  index(parametros?: any): Observable<DependenciaUsuariaPaginate> {
    let anexo;
    (parametros)? anexo=parametros: anexo='';
    return this.http.get<DependenciaUsuariaPaginate>(this.url+anexo);
  }
  getDependenciaUsuarias(paginacionParams: PaginacionParams ): Observable<DependenciaUsuariaPaginate> {
    const url = getUrlPaginate({paginacionParams, url: this.url});
    return this.http.get<DependenciaUsuariaPaginate>(url);
  }
  create(){
    return this.http.get(this.url+'/create');
  }
  porUnidadAdministrativa(unidad_administrativa_id: number){
    return this.http.get(this.url+'/porUnidadAdministrativa/'+unidad_administrativa_id);
  }
  add(data: DependenciaUsuaria){
    return this.http.post(this.url, data);
  }
  show(id: number){
    return this.http.get(this.url+'/'+id);
  }
  edit(id: number): Observable<DependenciaUsuariaEdit>{
    return this.http.get<DependenciaUsuariaEdit>(this.url+'/'+id+'/edit');
  }
  put(data: DependenciaUsuaria){
    return this.http.put(this.url+'/'+data.id, data);
  }
  delete(data: DependenciaUsuaria){
    return this.http.delete(this.url+'/'+data.id);
  }
}
