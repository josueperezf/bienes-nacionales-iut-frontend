import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginacionParams, MovimientoPaginate } from '../interfaces';
import { getUrlPaginate } from '../utils/urlPaginate';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private url:string= `${environment.API_URL}/movimientos`;

  constructor(
    private http:HttpClient
  ) { }

  index(parametros?: any): Observable<MovimientoPaginate>  {
    let anexo;
    (parametros)? anexo=parametros: anexo='';
    return this.http.get<MovimientoPaginate>(this.url+anexo);
  }
  getMovimientos( paginacionParams: PaginacionParams): Observable<MovimientoPaginate>  {
    const url = getUrlPaginate({paginacionParams, url: this.url});
    return this.http.get<MovimientoPaginate>(url);
  }
  show(movimiento_id:number){
    return this.http.get(this.url+'/'+movimiento_id);
  }
  create(){
    return this.http.get(this.url+'/create');
  }
  add(data: any){
    return this.http.post(this.url, data);
  }
}
