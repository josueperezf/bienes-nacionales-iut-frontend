import {Router} from '@angular/router';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()

export class ErrorService
{
	constructor(
		private matSnackBar:MatSnackBar,
		private router:Router)
	{
	}
	mosotrarMensajes(mensaje: string){
		this.matSnackBar.open(mensaje,'Cerrar',{duration:3000});
	}
	mostrarErrors(e: any)
	{
	    let resp=e;//.json();
	    let texto="";
	    if((e.status==0)|| (e.status >= 500))
	    {
				this.mosotrarMensajes("Error de servidor");
	      //toastr.error("Error de servidor");
	    }else if (e.status == 401)
	    {
				localStorage.removeItem('token');
				//this.router.navigate(['/']);
				//toastr.error("Usuario no autenticado");
				//location.reload();
			}else if ((e.status >= 402) && (e.status <= 403))
	    {
				this.mosotrarMensajes('Acceso denegado');
	      //toastr.error("Acceso denegado");
	    }
			else if(e.status == 404)
	    {
				this.mosotrarMensajes('Solicitud no encontrada en servidor');
	      //toastr.error("Solicitud no encontrada en servidor");
			}
	    else if((e.status > 404) && (e.status < 452))
	    {
	      for (var i in resp.error.errors)
	      {
	        texto=texto+' '+resp.error.errors[i][0]+'<br>';
	        //console.log(resp.errors[i][0]);
				}
				this.mosotrarMensajes(texto);
	      //toastr.error(texto);
	    }
  	}
}
