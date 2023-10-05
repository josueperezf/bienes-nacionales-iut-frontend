import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetalleTipoMovimientoService {
  private url:string= `${environment.API_URL}/detalleTipoMovimientos`;

  constructor(
    private http:HttpClient
  ) { }
  porTipoMovimiento(tipo_movimiento_id: number) {
    return this.http.get(this.url+'/porTipoMovimiento/'+tipo_movimiento_id);
  }
}
