import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {merge, Observable, of as observableOf, timer} from 'rxjs';
import {catchError, debounce, map, startWith, switchMap} from 'rxjs/operators';
import { SubcoordinacionsService } from 'src/app/servicios/subcoordinacions.service';
import { DialogConfirm, PaginacionParams, Subcoordinacion } from '../../../interfaces/';
import { ErrorService } from 'src/app/servicios/errores.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubcoordinacionAddComponent } from '../subcoordinacion-add/subcoordinacion-add.component';
import { SubcoordinacionEditComponent } from '../subcoordinacion-edit/subcoordinacion-edit.component';
import { SubcoordinacionShowComponent } from '../subcoordinacion-show/subcoordinacion-show.component';
import { DialogConfirmComponent } from 'src/app/shared/dialog-confirm/dialog-confirm.component';

class Hola {
  public nombre:string = 'josue';
}

@Component({
  templateUrl: './subcoordinacion-index.component.html',
  styleUrls: ['./subcoordinacion-index.component.css'],
  providers:  [ SubcoordinacionsService ]
})
export class SubcoordinacionIndexComponent extends Hola implements AfterViewInit  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  buscar:string='';
  displayedColumns: string[] = ['id', 'ciudad', 'nombre', 'direccion', 'acciones'];
  // subcoordinacionsService!: SubcoordinacionsService | null;
  data: Subcoordinacion[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  constructor(
    private subcoordinacionsService: SubcoordinacionsService,
    private errorService:ErrorService,
    private matDialog:MatDialog,
    private matSnackBar:MatSnackBar,
    ) {
super()
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
          return this.subcoordinacionsService!.getSubcoordinaciones(this.getParametersPagination())
            .pipe(catchError(() => observableOf(null)));
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
      .subscribe(data => (this.data = data ));
  }

  private updateData(): void {
    this.isLoadingResults = true;
    this.subcoordinacionsService!.getSubcoordinaciones(this.getParametersPagination())
      .subscribe((data) => {
        this.isLoadingResults = false;
        this.isRateLimitReached = data === null;
        if (data === null) {
          this.data = [];
        }
        this.resultsLength = data.total;
        this.data = data.data;
      });
  }

  add():void {
    const modal = this.matDialog.open(SubcoordinacionAddComponent);
    this.subscribeDialog(modal, 'Subcordinación creada con exito');
  }

  confirmar(subcoordinacion: Subcoordinacion) {
    const parametros: DialogConfirm = {
      titulo: 'Confirma eliminacion',
      contenido: `Realmente desea eliminar la subcoordinación: ${subcoordinacion.nombre}?`
    };
    let modal = this.matDialog.open(DialogConfirmComponent, {data: parametros });
    modal.afterClosed().subscribe({
      next:(data)=>{
        (data) && this.delete(subcoordinacion);
      },
    });
  }
  delete(subcoordinacion:Subcoordinacion){
    this.subcoordinacionsService.delete(subcoordinacion).subscribe({
      complete:()=>{
        this.updateData();
        this.errorService.mosotrarMensajes('Operacion Exitosa');
      },
      error:(e)=>{
        this.errorService.mostrarErrors(e);
      }
    }
    );
  }

  edit(subcoordinacion: Subcoordinacion):void {
    const modal = this.matDialog.open(SubcoordinacionEditComponent, {
      data:subcoordinacion});
    this.subscribeDialog(modal, 'Subcordinación editada con exito');
  }

  restaurar(subcoordinacion: Subcoordinacion):void {
    subcoordinacion.deleted_at=null;
    this.subcoordinacionsService.put(subcoordinacion).subscribe({
      complete:()=>{
        this.errorService.mosotrarMensajes('Restauracion Exitosa');
        this.updateData();
      },
      error:(e)=>{this.errorService.mostrarErrors(e)}
    });
  }

  show(subcoordinacion: Subcoordinacion):void {
    this.matDialog.open(SubcoordinacionShowComponent, {data:subcoordinacion});
  }

  applyFilter(): void {
    // IMPORTANTE, CADA VEZ QUE CAMBIO LOS VALORES DE this.sort, DISPARA EL OBSERVABLE QUE TENGO EN METODO ngAfterViewInit 'el que hace llamada http', POR ELLO, AQUI NO HACE FALLTA LLAMAR A updateData() o algo asi
    // coloco el paginador y orden de la tabla a estado inicial
    this.paginator.pageIndex = 0
    this.sort.sort({id: '', start: 'desc', disableClear: false});

  }

  private subscribeDialog(modal: MatDialogRef<SubcoordinacionAddComponent | SubcoordinacionEditComponent>, mensaje: string = '') {
    modal.afterClosed().subscribe({
      next:(data) => {
        if(data) {
          this.matSnackBar.open(mensaje, 'Cerrar', {duration:3000});
          this.updateData();
        }
      },
      error:(e)=>{this.errorService.mostrarErrors(e)}
    }
    );
  }
}



