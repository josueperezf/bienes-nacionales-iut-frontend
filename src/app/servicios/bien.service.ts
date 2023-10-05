import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bien, BienAdd, BienEdit, BienPaginate, PaginacionParams } from '../interfaces';
import { getUrlPaginate } from '../utils/urlPaginate';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BienService {
  private url:string= `${environment.API_URL}/biens`;
  constructor(
    private http:HttpClient
  ) { }

  index(parametros?: any): Observable<BienPaginate>{
    let anexo;
    (parametros)? anexo=parametros: anexo='';
    return this.http.get<BienPaginate>(this.url+anexo);
  }
  getBienes(paginacionParams: PaginacionParams): Observable<BienPaginate> {
    const url = getUrlPaginate({paginacionParams, url: this.url});
    return this.http.get<BienPaginate>(url);
  }
  create() {
    return this.http.get(this.url+'/create');
  }
  add(data: Bien): Observable<BienAdd> {
    return this.http.post<BienAdd>(this.url, data);
  }
  show(id: number) {
    return this.http.get(this.url+'/'+id);
  }
  edit(id: number): Observable<BienEdit> {
    return this.http.get<BienEdit>(this.url+'/'+id+'/edit');
  }
  put(data: Bien){
    return this.http.put(this.url+'/'+data.id, data);
  }
  delete(data: Bien) {
    return this.http.delete(this.url+'/'+data.id);
  }
}
