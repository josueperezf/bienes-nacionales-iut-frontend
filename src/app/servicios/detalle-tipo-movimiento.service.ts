import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetalleTipoMovimientoService {
  url:string='http://127.0.0.1:8000/api/detalleTipoMovimientos';
  //protected url:string='https://josueperezf.000webhostapp.com/api/detalleTipoMovimientos';
  constructor(
    private http:HttpClient
  ) { }
  porTipoMovimiento(tipo_movimiento_id: number) {
    return this.http.get(this.url+'/porTipoMovimiento/'+tipo_movimiento_id);
  }
}
