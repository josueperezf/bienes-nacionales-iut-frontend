import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario, InventarioRequest } from '../interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private url:string= `${environment.API_URL}/reportes`;

  constructor(
    private http:HttpClient
  ) { }

  inventario(form: InventarioRequest): Observable<Inventario> {
    return this.http.post<Inventario>(this.url+'/inventario', form);
  }
}
