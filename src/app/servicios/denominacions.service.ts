import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DenominacionsService {
  private url:string= `${environment.API_URL}/denominacions`;

  constructor(private http:HttpClient) { }

  porCategoria(categoria_id: number){
    return this.http.get(this.url+'/porCategoria/'+categoria_id);
  }
}
