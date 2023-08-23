import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MovimientoService } from 'src/app/servicios';

@Component({
  selector: 'app-movimiento-show',
  templateUrl: './movimiento-show.component.html',
  styleUrls: ['./movimiento-show.component.css']
})
export class MovimientoShowComponent implements OnInit {
  public movimiento:any;
  displayedColumns = ['codigo','marca', 'denominacion','monto', 'origen','destino'];
  constructor(
    @Inject(MAT_DIALOG_DATA) private id: number,
    private movimientoService:MovimientoService,
  ) { }

  ngOnInit() {
    if(this.id)
      this.cargarData();
  }
  cargarData(){
    this.movimientoService.show(this.id).subscribe({
      next:(data:any)=>{
        this.movimiento=data.movimiento;
      }
    });
  }
}
