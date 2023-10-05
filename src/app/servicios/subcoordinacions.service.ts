import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coordinacion, PaginacionParams, Subcoordinacion, SubcoordinacionPaginate, SubcoordinacionResponseEdit} from '../interfaces/';
import { getUrlPaginate } from '../utils/urlPaginate';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubcoordinacionsService {
  private url:string= `${environment.API_URL}/subcoordinacions`;

  constructor(
    private http:HttpClient
  ) { }
  index(parametros?: any): Observable<SubcoordinacionPaginate> {
    let anexo;
    (parametros)? anexo=parametros: anexo='';
    return this.http.get<SubcoordinacionPaginate>(this.url+anexo);
  }
  getSubcoordinaciones(paginacionParams:PaginacionParams): Observable<SubcoordinacionPaginate> {
    const url = getUrlPaginate({paginacionParams, url: this.url});
    return this.http.get<SubcoordinacionPaginate>(url);
  }
  create(): Observable<Coordinacion[]>  {
    return this.http.get<Coordinacion[]>(this.url+'/create');
  }
  porCoordinacion(id: number): Observable<Subcoordinacion[]>  {
    return this.http.get<Subcoordinacion[]>(this.url+`/porCoordinacion/${id}`);
  }
  add(subcoordinacion:Subcoordinacion){
    return this.http.post(this.url,subcoordinacion);
  }
  show(subcoordinacion:Subcoordinacion): Observable<{subcoordinacion: Subcoordinacion}> {
    return this.http.get<{subcoordinacion: Subcoordinacion}>(this.url+'/'+subcoordinacion.id);
  }
  edit(subcoordinacion:Subcoordinacion): Observable<SubcoordinacionResponseEdit>{
    return this.http.get<SubcoordinacionResponseEdit>(this.url+'/'+subcoordinacion.id+'/edit');
  }
  put(subcoordinacion:Subcoordinacion){
    return this.http.put(this.url+'/'+subcoordinacion.id, subcoordinacion);
  }
  delete(subcoordinacion:Subcoordinacion){
    return this.http.delete(this.url+'/'+subcoordinacion.id);
  }
}
