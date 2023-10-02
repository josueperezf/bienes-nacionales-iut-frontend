import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Marca, MarcaPaginate} from '../interfaces/marca';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MarcasService {
  private url:string= `${environment.api_url}marcas/`;
  //protected url:string='https://josueperezf.000webhostapp.com/api/marcas';
  //protected url:string='/api/marcas';
  constructor(
    private http:HttpClient
  ) { }
  index(parametros?: any): Observable<MarcaPaginate>{
    let anexo;
    (parametros)? anexo=parametros: anexo='?todos=1';
    return this.http.get<MarcaPaginate>(this.url+anexo);
  }
  add(marca:Marca){
    return this.http.post(this.url,marca);
  }
  show(id:number){
    return this.http.get(this.url+'/'+id);
  }
  put(marca:Marca) {
    return this.http.put(this.url+'/'+marca.id, marca);
  }
  delete(marca:Marca){
    return this.http.delete(this.url+'/'+marca.id);
  }
}
