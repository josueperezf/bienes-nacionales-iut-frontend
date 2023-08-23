import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Bien } from 'src/app/interfaces';
import { DependenciaUsuariaService } from 'src/app/servicios/dependencia-usuaria.service';
import { UnidadAdministrativaShowComponent } from '../../unidad-administrativa/unidad-administrativa-show/unidad-administrativa-show.component';

@Component({
  selector: 'app-dependencia-usuaria-show',
  templateUrl: './dependencia-usuaria-show.component.html',
  styleUrls: ['./dependencia-usuaria-show.component.css']
})
export class DependenciaUsuariaShowComponent implements OnInit {
  dependenciaUsuarias:any;
  saludo='hola';
  public biens!: Bien[];
  displayedColumns = ['id', 'codigo','serial','monto','denominacion_nombre','marca_nombre'];
  constructor(
    @Inject(MAT_DIALOG_DATA) private id: number,
    private matDialog:MatDialog,
    private matDialogRef:MatDialogRef<DependenciaUsuariaShowComponent>,
    private dependenciaUsuariaService:DependenciaUsuariaService
  ) { }

  ngOnInit() {
    if(this.id)
    this.cargarData();
  }
  cargarData(){
    this.dependenciaUsuariaService.show(this.id).subscribe({
      next:(data:any)=>{
        this.dependenciaUsuarias=data.dependenciaUsuarias;
        this.biens=data.biens;
      }
    });
  }

  showUnidadAdministrativa(id: number){
    this.matDialog.open(UnidadAdministrativaShowComponent,{data:id});
  }
}
