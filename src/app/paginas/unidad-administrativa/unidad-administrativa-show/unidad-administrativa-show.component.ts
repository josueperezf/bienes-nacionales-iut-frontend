import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DependenciaUsuaria, Subcoordinacion, UnidadAdministrativa } from 'src/app/interfaces';
import { UnidadAdministrativaService } from 'src/app/servicios/unidad-administrativa.service';
import { DependenciaUsuariaShowComponent } from '../../dependencia-usuaria/dependencia-usuaria-show/dependencia-usuaria-show.component';

@Component({
  selector: 'app-unidad-administrativa-show',
  templateUrl: './unidad-administrativa-show.component.html',
  styleUrls: ['./unidad-administrativa-show.component.css']
})
export class UnidadAdministrativaShowComponent implements OnInit {
  public unidadAdministrativa!: UnidadAdministrativa;
  public dependenciaUsuarias!: any;
  public subcoordinacion!: Subcoordinacion;
  public displayedColumns = ['id', 'nombre', 'estatus','acciones'];
  constructor(
    @Inject(MAT_DIALOG_DATA) private id: number,
    private matDialogRef:MatDialogRef<UnidadAdministrativaShowComponent>,
    private unidadAdministrativaService:UnidadAdministrativaService,
    private matDialog:MatDialog,
  ) { }

  ngOnInit() {
    if(this.id)
      this.cargarData();
  }
  cargarData(){
    this.unidadAdministrativaService.show(this.id).subscribe({
      next:({subcoordinacion, dependencia_usuarias, ...unidadAdministrativa}) => {
        this.unidadAdministrativa = unidadAdministrativa;
        this.dependenciaUsuarias = dependencia_usuarias;
        this.subcoordinacion = subcoordinacion;
      }
    });
  }
  showDependencia(dependenciaUsuaria: DependenciaUsuaria) {
    if(dependenciaUsuaria) {
      this.matDialog.open(DependenciaUsuariaShowComponent,{data:dependenciaUsuaria.id});
    }
  }
}
