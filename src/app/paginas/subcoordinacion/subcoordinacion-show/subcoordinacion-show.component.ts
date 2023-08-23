import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subcoordinacion } from 'src/app/interfaces';
import { SubcoordinacionsService } from 'src/app/servicios/subcoordinacions.service';
import { UnidadAdministrativaShowComponent } from '../../unidad-administrativa/unidad-administrativa-show/unidad-administrativa-show.component';

@Component({
  templateUrl: './subcoordinacion-show.component.html',
  styleUrls: ['./subcoordinacion-show.component.css']
})
export class SubcoordinacionShowComponent  implements OnInit {
  subcoordinacion!: Subcoordinacion;
  unidad_administrativas:any;
  displayedColumns = ['id', 'nombre','telefono', 'acciones'];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Subcoordinacion,
    private matDialog:MatDialog,
    private matDialogRef:MatDialogRef<SubcoordinacionShowComponent>,
    private subcoordinacionsService:SubcoordinacionsService
  ) { }

  ngOnInit() {
    if(this.data.id)
      this.cargarData();
  }
  cargarData(): void {
    this.subcoordinacionsService.show(this.data).subscribe({
      next:({subcoordinacion}) => {
        this.subcoordinacion = subcoordinacion;
        this.unidad_administrativas = subcoordinacion.unidad_administrativas || [];

      }
    });
  }
  showUnidadAdministrativa(id: number) {
    this.matDialog.open(UnidadAdministrativaShowComponent,{data:id});
  }
}
