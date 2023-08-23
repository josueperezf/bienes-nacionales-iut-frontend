import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BienService, ErrorService } from 'src/app/servicios';
import { BienAddComponent } from '../bien-add/bien-add.component';
import { Bien, DialogConfirm, PaginacionParams } from 'src/app/interfaces';
import { BienEditComponent } from '../bien-edit/bien-edit.component';
import { BienShowComponent } from '../bien-show/bien-show.component';
import { MarcasShowComponent } from '../../marcas/marcas-show/marcas-show.component';
import { DependenciaUsuariaShowComponent } from '../../dependencia-usuaria/dependencia-usuaria-show/dependencia-usuaria-show.component';
import {merge, of as observableOf, timer} from 'rxjs';
import { debounce, startWith, switchMap, catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from 'src/app/shared/dialog-confirm/dialog-confirm.component';


@Component({
  selector: 'app-bien-index',
  templateUrl: './bien-index.component.html',
  styleUrls: ['./bien-index.component.css']
})
export class BienIndexComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  bienes: Bien[] = [];
  buscar:string='';
  displayedColumns = ['id', 'codigo','serial','marca_nombre','denominacion_nombre','dependencia_usuaria_nombre','acciones'];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  constructor(
      private errorService:ErrorService,
      private bienService:BienService,
      private matDialog:MatDialog,
      private matSnackBar:MatSnackBar,
      ){
  }
  add(): void{
    const modal = this.matDialog.open(BienAddComponent);
    this.subscribeDialog(modal, 'Bien almacenado con exito');
  }
  edit(bien: Bien):void {
    const modal=this.matDialog.open(BienEditComponent,{data:bien});
    this.subscribeDialog(modal, 'Bien editado con exito');
  }
  show(bien: Bien):void {
    this.matDialog.open(BienShowComponent,{data:bien.id});
  }
  showMarca(bien: Bien):void {
    this.matDialog.open(MarcasShowComponent,{data:bien.marca_id, height:'80%'});
  }
  showDependenciaUsuaria(bien: Bien):void {
    this.matDialog.open(DependenciaUsuariaShowComponent,{data:bien.dependencia_usuaria_id, height:'80%'});
  }


  private getParametersPagination(): PaginacionParams {
    return {
      buscar: this.buscar,
      direction: this.sort.direction,
      page: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      sort: this.sort.active,
    }
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        debounce(() => timer(200)), // esto lo coloque yo, en vista de que cada vez que alguien escriba algo en el buscador, se hace peticion http. entonces con esto hago de que no haga tantas peticiones si no luego de 200 milisegundos de haber comenzado a escribir
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.bienService!.getBienes(
            this.getParametersPagination()
          ).pipe(catchError(() => observableOf(null)));
        }),
        map((data) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }
          this.resultsLength = data.total;
          return data.data;
        }),
      )
      .subscribe(data => (this.bienes = data ));
  }
  applyFilter(): void {
    // IMPORTANTE, CADA VEZ QUE CAMBIO LOS VALORES DE this.sort, DISPARA EL OBSERVABLE QUE TENGO EN METODO ngAfterViewInit 'el que hace llamada http', POR ELLO, AQUI NO HACE FALLTA LLAMAR A updateData() o algo asi
    // coloco el paginador y orden de la tabla a estado inicial
    this.paginator.pageIndex = 0
    this.sort.sort({id: '', start: 'desc', disableClear: false});

  }


  private subscribeDialog(modal: MatDialogRef<BienAddComponent | BienEditComponent>, mensaje: string = '') {
    modal.afterClosed().subscribe({
      next:(data) => {
        if(data) {
          mensaje && this.matSnackBar.open(mensaje, 'Cerrar', {duration:3000});
          this.updateData();
        }
      },
      error:(e)=>{this.errorService.mostrarErrors(e)}
    }
    );
  }
  private updateData(): void {
    this.isLoadingResults = true;
    this.bienService!.getBienes(
      this.getParametersPagination()
    ).subscribe((data) => {
      this.isLoadingResults = false;
      this.isRateLimitReached = data === null;
      if (data === null) {
        this.bienes = [];
      }
      this.resultsLength = data.total;
      this.bienes = data.data;
    });
  }
}
