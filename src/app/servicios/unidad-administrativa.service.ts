import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnidadAdministrativa, UnidadAdministrativaPaginate, UnidadAdministrativaShow, PaginacionParams } from '../interfaces';
import { getUrlPaginate } from '../utils/urlPaginate';

@Injectable({
  providedIn: 'root'
})
export class UnidadAdministrativaService {
  private url:string='http://127.0.0.1:8000/api/unidadAdministrativas';
  //protected url:string='https://josueperezf.000webhostapp.com/api/unidadAdministrativas';
  constructor(
    private http:HttpClient
  ) { }
  index(parametros?: any) : Observable<UnidadAdministrativaPaginate> {
    let anexo;
    (parametros)? anexo=parametros: anexo='';
    return this.http.get<UnidadAdministrativaPaginate>(this.url+anexo);
  }
  getUnidadAdministrativas(paginacionParams: PaginacionParams ): Observable<UnidadAdministrativaPaginate> {
    const url = getUrlPaginate({paginacionParams, url: this.url});
    return this.http.get<UnidadAdministrativaPaginate>(url);
  }
  ConDependenciaAlmacen(subcoordinacion_id: number) {
    return this.http.get(this.url+'/ConDependenciaAlmacen/'+subcoordinacion_id);
  }
  add(data: UnidadAdministrativa) {
    return this.http.post(this.url,data);
  }
  show(id:number): Observable<UnidadAdministrativaShow>{
    return this.http.get<UnidadAdministrativaShow>(this.url+'/'+id);
  }
  edit(data: UnidadAdministrativa){
    return this.http.get(this.url+'/'+data.id+'/edit');
  }
  put(data: UnidadAdministrativa) {
    return this.http.put(this.url+'/'+data.id, data);
  }
  delete(data: UnidadAdministrativa) {
    return this.http.delete(this.url+'/'+data.id);
  }
}
