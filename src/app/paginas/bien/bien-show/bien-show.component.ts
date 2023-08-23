import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Bien, Denominacion, DependenciaUsuaria, Marca } from 'src/app/interfaces';
import { BienService } from 'src/app/servicios';

@Component({
  selector: 'app-bien-show',
  templateUrl: './bien-show.component.html',
  styleUrls: ['./bien-show.component.css']
})
export class BienShowComponent implements OnInit {
  bien!: Bien;
  marca!: Marca;
  denominacion!: Denominacion;
  dependencia_usuaria!: DependenciaUsuaria;
  displayedColumnsMarcas = ['id', 'nombre','deleted_at','acciones'];
  displayedColumnsDenominaciones = ['id', 'nombre','deleted_at','acciones'];
  constructor(
    @Inject(MAT_DIALOG_DATA) private id: number,
    private matDialog:MatDialog,
    private bienService:BienService
  ) { }

  ngOnInit() {
    if(this.id)
      this.cargarData();
  }
  cargarData(){
    this.bienService.show(this.id).subscribe({
      next:(data:any)=>{
        this.bien=data.bien;
        this.dependencia_usuaria=data.dependencia_usuaria;
        this.denominacion=data.bien.denominacion;
        this.marca=data.bien.marca;
        console.log(this.marca);

      }
    });
  }
}
