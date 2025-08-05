import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Link, Marca, MarcaPaginate} from '../interfaces/marca';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MarcasService {
  private url:string= `${environment.API_URL}/marcas`;
  //protected url:string='https://josueperezf.000webhostapp.com/api/marcas';
  //protected url:string='/api/marcas';
  constructor(
    private http:HttpClient,
  ) { }
  index(parametros?: any): Observable<MarcaPaginate>{
    let anexo;
    (parametros)? anexo=parametros: anexo='?todos=1';
    // lo siguiente es solo porque en marcas estadarice las respuestas, tanto para exito como para error, todos llevaran los campos  {"success": true, "message": "Listado de marcas", "data": []}
    return this.http.get<{ success: boolean, message: string, data: MarcaPaginate }>(this.url+anexo).pipe(
      map((response) => {
        if (response.success) {
          return response.data;
        } else {
          return {
            current_page: 0,
            data: [] as Marca[],
            first_page_url: '',
            from: 0,
            last_page: 0,
            last_page_url: '',
            links: [] as Link[],
            next_page_url: '',
            path: '',
            per_page: 0,
            prev_page_url: '',
            to: 0,
            total: 0,
          }  as MarcaPaginate;
        }
      })
    );
  }
  add(marca:Marca){
    return this.http.post(this.url,marca);
  }
  show(id:number){
    return this.http.get<{message: string, data: {marca: Marca, bienes: []}}>(this.url+'/'+id)
      .pipe(
        map((response) => {
          if (response.data) {
            return response.data;
          } else {
            return {};
          }
        })
      );
  }
  put(marca:Marca) {
    return this.http.put(this.url+'/'+marca.id, marca);
  }
  delete(marca:Marca){
    return this.http.delete(this.url+'/'+marca.id);
  }
}
