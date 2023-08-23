import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort} from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LiveAnnouncer} from '@angular/cdk/a11y';
import { DialogConfirm, Marca, MarcaPaginate} from 'src/app/interfaces';
import { MarcasService } from 'src/app/servicios/marcas.service';
import { ErrorService } from 'src/app/servicios/errores.service';
import { MarcasAddComponent} from '../marcas-add/marcas-add.component';
import { MarcasShowComponent } from '../marcas-show/marcas-show.component';
import { MarcasEditComponent } from '../marcas-edit/marcas-edit.component';
import { DialogConfirmComponent } from 'src/app/shared/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-marcas-index',
  templateUrl: './marcas-index.component.html',
  styleUrls: ['./marcas-index.component.css']
})
export class MarcasIndexComponent implements OnInit, AfterViewInit   {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public displayedColumns: string[] = ['id', 'nombre', 'acciones'];
  public dataSource = new MatTableDataSource<Marca>();
  public marcaPaginate!: MarcaPaginate;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private errorService:ErrorService,
    private marcasService: MarcasService,
    private matDialog:MatDialog,
    private matSnackBar:MatSnackBar,
    ) {}

  ngOnInit(): void {
    this.marcasService.index().subscribe(( marcaPaginate: MarcaPaginate ) => {
      this.marcaPaginate = marcaPaginate;
      this.dataSource.data = marcaPaginate.data
    });
  }

  ngAfterViewInit():void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  add():void {
    let modal = this.matDialog.open(MarcasAddComponent);
    modal.afterClosed().subscribe({
      next:(data)=>{
        if(data){
          this.matSnackBar.open('Operacion Exitosa','Cerrar',{duration:3000});
          this.ngOnInit()
        }
      },
      error:(e)=>{this.errorService.mostrarErrors(e)}
    }
    );
  }
  edit(marca: Marca) {
    let modal = this.matDialog.open(MarcasEditComponent, {
      data: marca
    });
    modal.afterClosed().subscribe(
      (data)=>{
        (data) && this.ngOnInit()
      }
    );
  }
  show(marca: Marca): void {
    this.matDialog.open(MarcasShowComponent,{data:marca.id});
  }
  restaurar(marca: Marca): void {
    marca.deleted_at=null;
    this.marcasService.put(marca).subscribe({
      complete:()=>{
        this.errorService.mosotrarMensajes('Restauracion Exitosa');
        this.ngOnInit();
      },
      error:(e)=>{this.errorService.mostrarErrors(e)}
    });
  }
  confirmar(marca: Marca) {
    const parametros: DialogConfirm = {
      titulo: 'Confirma eliminacion',
      contenido: `Realmente desea eliminar la marca: ${marca.nombre}?`
    };
    let modal = this.matDialog.open(DialogConfirmComponent, {data: parametros });
    modal.afterClosed().subscribe({
      next:(data)=>{
        (data) && this.delete(marca);
      },
    });
  }

  private delete(marca: Marca) {
    this.marcasService.delete(marca).subscribe({
      error:(e)=>{this.errorService.mostrarErrors(e)},
      complete:()=>{
        this.errorService.mosotrarMensajes('Eliminacion Exitosa');
        this.ngOnInit()
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
