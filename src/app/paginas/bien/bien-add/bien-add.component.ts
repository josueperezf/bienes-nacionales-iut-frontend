import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BienAdd, Categoria, Coordinacion, Denominacion, DependenciaUsuaria, DependenciaUsuariaAlmacen, DetalleTipoMovimiento, Marca, Subcoordinacion, SubcoordinacionPaginate } from 'src/app/interfaces';
import { BienService, DenominacionsService, ErrorService, MarcasService, MovimientoService, SubcoordinacionsService, UnidadAdministrativaService } from 'src/app/servicios';
import { MarcasAddComponent } from '../../marcas/marcas-add/marcas-add.component';
import { MovimientoShowComponent } from '../../movimiento/movimiento-show/movimiento-show.component';
import { MovimientoPaginate } from 'src/app/interfaces/movimiento';

@Component({
  selector: 'app-bien-add',
  templateUrl: './bien-add.component.html',
  styleUrls: ['./bien-add.component.css']
})
export class BienAddComponent implements OnInit {
  form!:FormGroup;
  mas:boolean = false;
  marcas:Marca[] = [];
  categorias: Categoria[] = [];
  denominacions: Denominacion[] = [];
  detalleTipoMovimientos:DetalleTipoMovimiento[] = [];
  coordinacions: Coordinacion[] = [];
  subcoordinaciones:Subcoordinacion[] = [];
  dependeciaUsuarias: DependenciaUsuariaAlmacen[] = [];
  constructor(
    private formBuilder:FormBuilder,
    private matDialog:MatDialog,
    private matDialogRef:MatDialogRef<BienAddComponent>,
    private bienService:BienService,
    private marcasService:MarcasService,
    private subcoordinacionsService:SubcoordinacionsService,
    private unidadAdministrativaService:UnidadAdministrativaService,
    private denominacionsService:DenominacionsService,
    private movimientoService:MovimientoService,
    private errorService:ErrorService
  ) { }
  ngOnInit() {
    this.cargarData();
  }
  addMarca(){
    let modal=this.matDialog.open(MarcasAddComponent);
    modal.afterClosed().subscribe({
      next:(data)=>{
        if(data){
          this.errorService.mosotrarMensajes('Operacion Exitosa');
          this.marcasService.index().subscribe({
            next:(data:any)=>{this.marcas=data.data}
          });
        }
      },
      error:(e)=>{ this.errorService.mostrarErrors(e)}
    });
  }
  add(parametro: 'listar' | 'mas' | 'pdf') {
    let form=this.form.value;
    delete form['coordinacion_id'];
    delete form['subcoordinacion_id'];
    delete form['categoria_id'];
    if(!form.movimiento_id)
    delete form['movimiento_id'];
    this.form.controls['codigo'].setValue(this.form.controls['codigo'].value.trim().toUpperCase());
    this.form.controls['serial'].setValue(this.form.controls['serial'].value.trim().toUpperCase());
    //console.log(this.form.controls.descripcion.value.length>0);

    if(this.form.controls['descripcion'].value)
    this.form.controls['descripcion'].setValue(this.form.controls['descripcion'].value.trim().toUpperCase());
    if(this.form.valid){
      this.bienService.add(form).subscribe({
        next:({bien, movimiento_id, message}: BienAdd) => {
          this.errorService.mosotrarMensajes(message || 'Operacion exitosa');
          if(parametro=='listar') {
            this.matDialogRef.close(true);
          } else if(parametro=='mas') {
            this.mas=true;
            this.form.controls['movimiento_id'].setValue(movimiento_id);
            this.form.controls['codigo'].setValue(null);
            this.form.controls['serial'].setValue(null);
            this.form.controls['descripcion'].setValue(null);
          } else if(parametro == 'pdf' ) {
            this.matDialogRef.close(true);
            this.matDialog.open(MovimientoShowComponent, {data: movimiento_id });
          }

        },
        error:(e)=>this.errorService.mostrarErrors(e)
      });
    }
  }
  cargarData(){
    this.bienService.create().subscribe({
      next:(data:any)=>{
        this.marcas=data.marcas;
        this.categorias=data.categorias;
        this.detalleTipoMovimientos=data.detalleTipoMovimientos;
        this.coordinacions=data.coordinacions;
        this.crearControles();
      }
    });
  }
  crearControles(){
    this.form=this.formBuilder.group({
      'coordinacion_id'           : [,Validators.required],
      'subcoordinacion_id'        : [,Validators.required],
      'dependencia_usuaria_id'    : [,Validators.required],
      'categoria_id'      : [,Validators.required],
      'denominacion_id'   : [,Validators.required],
      'detalle_tipo_movimiento_id' : [,Validators.required],
      'marca_id'          : [,Validators.required],
      'codigo'            : [,Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(20)]) ],
      'serial'            : [,Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(20)]) ],
      'monto'             : [,Validators.compose([Validators.required,Validators.minLength(1),Validators.maxLength(20)]) ],
      'descripcion'       : [],
      'movimiento_id'     : [],
    });
    //carga subcoordinaciones al cambiar coordinacion
    this.form.controls['coordinacion_id'].valueChanges.subscribe({
      next:(coordinacion_id:number)=>{
        this.subcoordinacionsService.index().subscribe({
          next:({data: subcoordinaciones})=>{
            this.form.controls['subcoordinacion_id'].setValue(null);
            this.form.controls['dependencia_usuaria_id'].setValue(null);
            this.subcoordinaciones=subcoordinaciones.filter((subcoordinacion) => subcoordinacion.coordinacion_id == coordinacion_id);
          }
        });
      }
    });
    //cargar unidad administrativa  al cambiar subcoordinacion
    this.form.controls['subcoordinacion_id'].valueChanges.subscribe({
      next:(subcoordinacion_id:any)=>{
        if(subcoordinacion_id)
        this.unidadAdministrativaService.ConDependenciaAlmacen(subcoordinacion_id).subscribe({
          next:(data:any)=>{
            this.form.controls['dependencia_usuaria_id'].setValue(null);
            this.dependeciaUsuarias=data.dependenciaUsuariaAlmacen;
          }
        });
      }
    });

    //cargar denominaciones al cambiar categorias
    this.form.controls['categoria_id'].valueChanges.subscribe({
      next:(categoria_id:any)=>{
        if(categoria_id)
        this.denominacionsService.porCategoria(categoria_id).subscribe({
          next:(data:any)=>{
            this.form.controls['denominacion_id'].setValue(null);
            this.denominacions=data.denominacions;
          }
        });
      }
    });
  }
}
