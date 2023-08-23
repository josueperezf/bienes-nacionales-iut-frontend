import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DependenciaUsuaria, DialogConfirm, PaginacionParams } from 'src/app/interfaces';
import { DependenciaUsuariaService } from 'src/app/servicios/dependencia-usuaria.service';
import { ErrorService } from 'src/app/servicios/errores.service';
import { DependenciaUsuariaAddComponent } from '../dependencia-usuaria-add/dependencia-usuaria-add.component';
import { DependenciaUsuariaEditComponent } from '../dependencia-usuaria-edit/dependencia-usuaria-edit.component';
import { DependenciaUsuariaShowComponent } from '../dependencia-usuaria-show/dependencia-usuaria-show.component';
import { DialogConfirmComponent } from 'src/app/shared/dialog-confirm/dialog-confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, debounce, map, merge, startWith, switchMap, timer, of as observableOf, Observable, } from 'rxjs';

@Component({
  selector: 'app-dependencia-usuaria-index',
  templateUrl: './dependencia-usuaria-index.component.html',
  styleUrls: ['./dependencia-usuaria-index.component.css']
})
export class DependenciaUsuariaIndexComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  buscar:string='';
  isLoadingResults = true;
  isRateLimitReached = false;
  resultsLength = 0;
  dependenciaUsuarias: DependenciaUsuaria[] = [];
  displayedColumns = ['id', 'nombre','tipo_dependencia_usuaria_nombre','unidad_administrativa_nombre', 'estatus','acciones'];

  constructor(
    private matDialog:MatDialog,
    private dependenciaUsuariaService:DependenciaUsuariaService,
    private errorService:ErrorService,
    private matSnackBar:MatSnackBar,
  ){
  }

  add(): void {
    const modal= this.matDialog.open(DependenciaUsuariaAddComponent);
    this.subscribeDialog(modal, 'Dependencia Usuaria creada con exito');
  }
  edit(dependenciaUsuaria: DependenciaUsuaria): void{
    const modal= this.matDialog.open(DependenciaUsuariaEditComponent, {data: dependenciaUsuaria});
    this.subscribeDialog(modal, 'Dependencia Usuaria editada con exito');
  }
  show(dependenciaUsuaria: DependenciaUsuaria): void {
    this.matDialog.open(DependenciaUsuariaShowComponent,{data: dependenciaUsuaria.id, height: '80%'});
  }
  restaurar(dependenciaUsuaria: DependenciaUsuaria){
    dependenciaUsuaria.deleted_at=null;
    this.dependenciaUsuariaService.put(dependenciaUsuaria).subscribe({
      error:(e)=>this.errorService.mostrarErrors(e),
      complete:()=>{
        this.errorService.mosotrarMensajes('Restauracion Exitosa');
        this.updateData();
      }
    });
  }
  delete(dependenciaUsuaria: DependenciaUsuaria): void {
    this.dependenciaUsuariaService.delete(dependenciaUsuaria).subscribe({
      complete:()=>{
        this.updateData();
        this.errorService.mosotrarMensajes('Eliminacion Exitosa');
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
          return this.dependenciaUsuariaService.getDependenciaUsuarias(this.getParametersPagination()).pipe(catchError(() => observableOf(null)));
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
      .subscribe(data => (this.dependenciaUsuarias = data ));
  }





  applyFilter(): void {
    if (this.buscar.length == 1 && this.buscar.trim().length === 0) {
      this.buscar = '';
      return;
    }
    // IMPORTANTE, CADA VEZ QUE CAMBIO LOS VALORES DE this.sort, DISPARA EL OBSERVABLE QUE TENGO EN METODO ngAfterViewInit 'el que hace llamada http', POR ELLO, AQUI NO HACE FALLTA LLAMAR A updateData() o algo asi
    // coloco el paginador y orden de la tabla a estado inicial

    this.paginator.pageIndex = 0
    this.sort.sort({id: '', start: 'desc', disableClear: false});
  }

  confirmar(dependenciaUsuaria: DependenciaUsuaria) {
    const parametros: DialogConfirm = {
      titulo: 'Confirma eliminacion',
      contenido: `Realmente desea eliminar la Dependencia usuaria: ${dependenciaUsuaria.nombre}?`
    };
    let modal = this.matDialog.open(DialogConfirmComponent, {data: parametros });
    modal.afterClosed().subscribe({
      next:(data)=>{
        (data) && this.delete(dependenciaUsuaria);
      },
    });
  }

  private subscribeDialog<T>(modal: MatDialogRef<T>, mensaje: string = '') {
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
    this.dependenciaUsuariaService!.getDependenciaUsuarias(
      this.getParametersPagination()
    ).subscribe((data) => {
      this.isLoadingResults = false;
      this.isRateLimitReached = data === null;
      if (data === null) {
        this.dependenciaUsuarias = [];
      }
      this.resultsLength = data.total;
      this.dependenciaUsuarias = data.data;
    });
  }

}
