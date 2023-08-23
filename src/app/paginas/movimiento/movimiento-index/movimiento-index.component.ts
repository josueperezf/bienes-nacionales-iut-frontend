import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {merge, of as observableOf, timer} from 'rxjs';
import { debounce, startWith, switchMap, catchError, map } from 'rxjs/operators';
import { ErrorService, MovimientoService } from 'src/app/servicios';
import { MovimientoAddComponent } from '../movimiento-add/movimiento-add.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovimientoPaginteItem } from 'src/app/interfaces/movimiento';
import { MovimientoShowComponent } from '../movimiento-show/movimiento-show.component';
import { PaginacionParams } from 'src/app/interfaces';

@Component({
  selector: 'app-movimiento-index',
  templateUrl: './movimiento-index.component.html',
  styleUrls: ['./movimiento-index.component.css']
})
export class MovimientoIndexComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  movimientos: MovimientoPaginteItem[] = [];
  buscar:string='';
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id','tipo_movimiento_nombre', 'detalle_tipo_movimiento_nombre','fecha', 'acciones'];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  constructor(
    private movimientoService:MovimientoService,
    private matDialog:MatDialog,
    private errorService:ErrorService,
    private matSnackBar:MatSnackBar,
  ){

  }
  add(){
    const modal = this.matDialog.open(MovimientoAddComponent,{ height:'80%'});

  }

  show(movimiento:MovimientoPaginteItem): void{
    this.matDialog.open(MovimientoShowComponent, {data:movimiento.id,height:'80%'});
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
          return this.movimientoService!.getMovimientos(
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
      .subscribe(data => (this.movimientos = data ));
  }
  applyFilter(): void {
    // IMPORTANTE, CADA VEZ QUE CAMBIO LOS VALORES DE this.sort, DISPARA EL OBSERVABLE QUE TENGO EN METODO ngAfterViewInit 'el que hace llamada http', POR ELLO, AQUI NO HACE FALLTA LLAMAR A updateData() o algo asi
    // coloco el paginador y orden de la tabla a estado inicial
    this.paginator.pageIndex = 0
    this.sort.sort({id: '', start: 'desc', disableClear: false});

  }

  private subscribeDialog(modal: MatDialogRef<MovimientoAddComponent>, mensaje: string = '') {
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
    this.movimientoService!.getMovimientos(
      this.getParametersPagination()
    ).subscribe((data) => {
      this.isLoadingResults = false;
      this.isRateLimitReached = data === null;
      if (data === null) {
        this.movimientos = [];
      }
      this.resultsLength = data.total;
      this.movimientos = data.data;
    });
  }
}
