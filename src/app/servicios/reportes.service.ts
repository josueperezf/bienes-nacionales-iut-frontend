import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario, InventarioRequest } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private url:string='http://127.0.0.1:8000/api/reportes/';
  //protected url:string='https://josueperezf.000webhostapp.com/api/reportes';
  constructor(
    private http:HttpClient
  ) { }

  inventario(form: InventarioRequest): Observable<Inventario> {
    return this.http.post<Inventario>(this.url+'inventario', form);
  }
}
