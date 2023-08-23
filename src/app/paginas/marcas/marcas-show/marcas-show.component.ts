import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Bien } from 'src/app/interfaces/bien';
import { Marca } from 'src/app/interfaces/marca';
import { MarcasService } from 'src/app/servicios/marcas.service';
import { DependenciaUsuariaShowComponent } from '../../dependencia-usuaria/dependencia-usuaria-show/dependencia-usuaria-show.component';

@Component({
  selector: 'app-marcas-show',
  templateUrl: './marcas-show.component.html',
  styleUrls: ['./marcas-show.component.css']
})
export class MarcasShowComponent implements OnInit {
  public marca!:Marca;
  public biens!:Bien[];
  displayedColumns = ['id', 'codigo','serial','monto','denominacion_nombre','dependencia_usuaria_nombre'];
  constructor(
    @Inject(MAT_DIALOG_DATA) public id: number,
    private marcasService:MarcasService,
    private matDialog:MatDialog
  ) { }

  ngOnInit() {
    if(this.id)
      this.cargarData();
  }
  showDependenciaUsuaria(id: number){
    this.matDialog.open(DependenciaUsuariaShowComponent,{data: id});
  }
  cargarData(){
    this.marcasService.show(this.id).subscribe({
      next:(data:any)=>{
        this.marca=data.marca;
        this.biens=data.biens;
      }
    });
  }
}
