import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DenominacionsService {

  protected url:string='http://127.0.0.1:8000/api/denominacions';
  //protected url:string='https://josueperezf.000webhostapp.com/api/denominacions';
  constructor(private http:HttpClient) { }

  porCategoria(categoria_id: number){
    return this.http.get(this.url+'/porCategoria/'+categoria_id);
  }
}
