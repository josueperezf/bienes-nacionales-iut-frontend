import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ErrorService } from 'src/app/servicios/errores.service';
import { UnidadAdministrativaService } from 'src/app/servicios/unidad-administrativa.service';
import { UnidadAdministrativaAddComponent } from '../unidad-administrativa-add/unidad-administrativa-add.component';
import { DialogConfirm, PaginacionParams, UnidadAdministrativa } from 'src/app/interfaces';
import { UnidadAdministrativaEditComponent } from '../unidad-administrativa-edit/unidad-administrativa-edit.component';
import { UnidadAdministrativaShowComponent } from '../unidad-administrativa-show/unidad-administrativa-show.component';
import {merge, of as observableOf, timer} from 'rxjs';
import { debounce, startWith, switchMap, catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from 'src/app/shared/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-unidad-administrativa-index',
  templateUrl: './unidad-administrativa-index.component.html',
  styleUrls: ['./unidad-administrativa-index.component.css']
})
export class UnidadAdministrativaIndexComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  buscar:string='';
  data: UnidadAdministrativa[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id','subcoordinacion_nombre', 'nombre','telefono','estatus', 'acciones'];

  constructor(
    private errorService:ErrorService,
    private unidadAdministrativaService:UnidadAdministrativaService,
    private matDialog:MatDialog,
    private matSnackBar:MatSnackBar,
  ){
  }

  add(): void {
    const modal = this.matDialog.open(UnidadAdministrativaAddComponent);
    this.subscribeDialog(modal, 'Unidad Administrativa creada con exito');
  }

  edit(unidadAdministrativa: UnidadAdministrativa) {
    const modal = this.matDialog.open(UnidadAdministrativaEditComponent, {data:unidadAdministrativa});
    this.subscribeDialog(modal, 'Unidad Administrativa editada con exito');
  }
  show(unidadAdministrativa: UnidadAdministrativa){
    this.matDialog.open(UnidadAdministrativaShowComponent, { data: unidadAdministrativa.id });
  }
  restaurar(unidadAdministrativa: UnidadAdministrativa) {
    unidadAdministrativa.deleted_at=null;
    this.unidadAdministrativaService.put(unidadAdministrativa).subscribe({
      complete:()=>{
        this.errorService.mosotrarMensajes('Operacion Exitosa');
        this.updateData();
      },
      error:(e)=>this.errorService.mostrarErrors(e)
    });
  }
  private delete(unidadAdministrativa: UnidadAdministrativa) {
    this.unidadAdministrativaService.delete(unidadAdministrativa).subscribe({
      complete:()=>{
        this.errorService.mosotrarMensajes('Eliminacion Exitosa');
        this.updateData();
      },
      error:(e)=>this.errorService.mostrarErrors(e)
    });
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
          return this.unidadAdministrativaService.getUnidadAdministrativas(
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
      .subscribe(data => (this.data = data ));
  }
  applyFilter(): void {
    // IMPORTANTE, CADA VEZ QUE CAMBIO LOS VALORES DE this.sort, DISPARA EL OBSERVABLE QUE TENGO EN METODO ngAfterViewInit 'el que hace llamada http', POR ELLO, AQUI NO HACE FALLTA LLAMAR A updateData() o algo asi
    // coloco el paginador y orden de la tabla a estado inicial
    this.paginator.pageIndex = 0
    this.sort.sort({id: '', start: 'desc', disableClear: false});

  }
  confirmar(unidadAdministrativa: UnidadAdministrativa) {
    const parametros: DialogConfirm = {
      titulo: 'Confirma eliminacion',
      contenido: `Realmente desea eliminar la Unidad administrativa: ${unidadAdministrativa.nombre}?`
    };
    let modal = this.matDialog.open(DialogConfirmComponent, {data: parametros });
    modal.afterClosed().subscribe({
      next:(data)=>{
        (data) && this.delete(unidadAdministrativa);
      },
    });
  }

  private subscribeDialog(modal: MatDialogRef<UnidadAdministrativaAddComponent | UnidadAdministrativaEditComponent>, mensaje: string = '') {
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
    this.unidadAdministrativaService!.getUnidadAdministrativas(
      this.getParametersPagination()
    ).subscribe((data) => {
      this.isLoadingResults = false;
      this.isRateLimitReached = data === null;
      if (data === null) {
        this.data = [];
      }
      this.resultsLength = data.total;
      this.data = data.data;
    });
  }
}
