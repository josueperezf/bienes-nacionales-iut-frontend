import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BienPaginate, Coordinacion, DependenciaUsuaria, DependenciaUsuariaPaginate, DetalleTipoMovimiento, Subcoordinacion, SubcoordinacionPaginate, UnidadAdministrativa, UnidadAdministrativaPaginate } from 'src/app/interfaces';
import { BienService, DependenciaUsuariaService, DetalleTipoMovimientoService, ErrorService, MovimientoService, SubcoordinacionsService, UnidadAdministrativaService } from 'src/app/servicios';

@Component({
  selector: 'app-movimiento-add',
  templateUrl: './movimiento-add.component.html',
  styleUrls: ['./movimiento-add.component.css']
})
export class MovimientoAddComponent implements OnInit {
  form!:FormGroup;
  coordinacions: Coordinacion[] = [];
  subcoordinacions: Subcoordinacion[] = [];
  unidadAdministrativas: UnidadAdministrativa[] = [];
  tipoMovimientos!: any;
  detalleTipoMovimientos: DetalleTipoMovimiento[] = [];
  dependenciaUsuariasDestinosId!: number;
  dependenciaUsuarias: DependenciaUsuaria[] = [];
  todo: any[] = [];
  mover: any[] = [];
  moverAuxiliar = [];
  buscar:string = '';
  constructor(
    private formBuilder:FormBuilder,
    private movimientoService:MovimientoService,
    private errorService:ErrorService,
    private detalleTipoMovmientoService:DetalleTipoMovimientoService,
    private subcoordinacionsService:SubcoordinacionsService,
    private unidadAdministrativaService:UnidadAdministrativaService,
    private dependenciaUsuariaService:DependenciaUsuariaService,
    private bienService:BienService,
    private matDialogRef:MatDialogRef<MovimientoAddComponent>
  ) { }

  ngOnInit() {
    //this.matriz['done']=['Get up','Brush teeth'];
    this.crearControles();
  }
  cargarDataBienes(){
    this.bienService.index().subscribe({
      next:(data:any)=>{
        this.todo=data.data;

      }
    });
  }
  procesar(): void{

    if(this.mover.length==0)
    {
      this.errorService.mosotrarMensajes('Debe arrastrar bienes para ser movidos');
      return;
    }
    if(this.form.valid){
      const form=this.form.value;
      delete form['coordinacion_id'];
      delete form['subcoordinacion_id'];
      delete form['unidad_administrativa_id'];
      //delete form['dependencia_usuaria_id'];
      delete form['buscar'];
      let bienesLocal = this.mover;
      for (let i = 0; i < bienesLocal.length; i++) {
        delete bienesLocal[i].codigo;
        delete bienesLocal[i].serial;
        delete bienesLocal[i].monto;
        delete bienesLocal[i].denominacion_id;
        delete bienesLocal[i].denominacion_nombre;
        delete bienesLocal[i].descripcion;
        delete bienesLocal[i].marca_id;
        delete bienesLocal[i].marca_nombre;
        delete bienesLocal[i].created_at;
        delete bienesLocal[i].updated_at;
        delete bienesLocal[i].dependencia_usuaria_nombre;
        delete bienesLocal[i].dependencia_usuaria_destino_nombre;
      }
      form.bienes=bienesLocal;
      this.movimientoService.add(form).subscribe({
        complete:()=>{
            this.errorService.mosotrarMensajes('Operacion Exitosa');
            this.matDialogRef.close(true);
            },
            error:(e)=>this.errorService.mostrarErrors(e)
        }
      );
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    //alert(this.moverAuxiliar[0].codigo);
    //console.log(this.moverAuxiliar);

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
          //inicio codigo para agregar un elemento al array mover, le coloco el atributo destino
          this.mover=this.mover.map((bien: any)=>{
            if(!bien.dependencia_usuaria_destino_id){
              bien.dependencia_usuaria_destino_id=this.form.controls['dependencia_usuaria_id'].value;
              bien.dependencia_usuaria_destino_nombre = this.dependenciaUsuarias.find((dependencia) => dependencia.id == this.form.controls['dependencia_usuaria_id'].value)?.nombre || '';
            }
            //if(bien.dependencia_usuaria_id!=bien.dependencia_usuaria_destino_id)
            return bien;
          });

          //finn de codigo para agregar a mover
          //inicio ciclo para borrar los del mismo origen y destino
          for (let i = 0; i < this.mover.length; i++) {
            if(this.mover[i].dependencia_usuaria_id==this.mover[i].dependencia_usuaria_destino_id){
              this.todo.push(this.mover[i]);
              this.mover.splice(i,1);
            }
          }

          //fin ciclo para borrar los del mismo origen y destino
          //inicio codigo para quitar atributo en array todo
          this.todo=this.todo.map((bien)=>{
            if(bien.dependencia_usuaria_destino_id){
              delete bien['dependencia_usuaria_destino_id'];
              delete bien['dependencia_usuaria_destino_nombre'];
            }
            return bien;
          });
          //fin de codigo para quitar atributo a todo
    }

  }

  buscarBien(){
    let buscar=this.form.controls['buscar'].value;
    this.bienService.index('?buscar='+buscar).subscribe({
      next:(data: BienPaginate)=>{
        this.todo = data.data;
        this.todo = this.todo.filter((articulo)=>{ if(! this.mover.find((data) => data.id==articulo.id ) ) return articulo
         }).map((data)=>data);
      }
    });

  }

  crearControles(){
    this.movimientoService.create().subscribe({
      next:(data:any)=>{
        this.tipoMovimientos=data.tipoMovimientos;
      }
    });
    this.form=this.formBuilder.group({
      tipo_movimiento_id:[,Validators.required],
      detalle_tipo_movimiento_id:[,Validators.required],
      coordinacion_id:[],
      subcoordinacion_id:[],
      unidad_administrativa_id:[],
      dependencia_usuaria_id:[,Validators.required],
      bienes:[],
      buscar:[]
    });

    //cargar detalle tipo de movimiento al cambiar tipo de movimiento
    this.form.controls['tipo_movimiento_id'].valueChanges.subscribe({
      next:(tipo_movimiento_id)=>{
        if(tipo_movimiento_id){
          this.mover=[]
          this.cargarDataBienes();
        }
        this.form.controls['detalle_tipo_movimiento_id'].setValue(null);
        this.form.controls['coordinacion_id'].setValue(null);
        this.form.controls['subcoordinacion_id'].setValue(null);
        this.form.controls['dependencia_usuaria_id'].setValue(null);
        this.form.controls['bienes'].setValue(null);
        this.coordinacions = [];
        this.subcoordinacions = [];
        this.unidadAdministrativas = [];
        this.detalleTipoMovmientoService.porTipoMovimiento(tipo_movimiento_id).subscribe({
          next:(data:any)=>{
            //si es desincorporacion el destino sera la dependencia id 3
            if(this.form.controls['tipo_movimiento_id'].value == 3){
              //this.form.controls.dependencia_usuaria_id.setValue(1);
              //cargar dependencia de desincorporacion
              this.dependenciaUsuariaService.porUnidadAdministrativa(1).subscribe({
                next:(data:any)=>{
                  this.dependenciaUsuarias=data.dependenciaUsuarias;
                }
              });

            }
            else{
              this.form.controls['dependencia_usuaria_id'].setValue(null);
              this.mover = [];
              this.dependenciaUsuarias = [];
              //cargar coordinaciones
              this.subcoordinacionsService.create().subscribe({
                next:(coordinaciones: Coordinacion[]) => {
                  this.coordinacions=coordinaciones.filter((coordinacion) => coordinacion.id != 1);
                }
              });
              //fin de coordinacion
            }
            this.detalleTipoMovimientos=data;
          }
        });
      }
    });
    //cargar Subcoordinacion
    this.form.controls['coordinacion_id'].valueChanges.subscribe({
      next:(coordinacion_id:any)=>{
        if(coordinacion_id){
          this.subcoordinacionsService.index().subscribe({
            next:({data}: SubcoordinacionPaginate ) => {
              this.subcoordinacions = data.filter((subcoordinacion) => subcoordinacion.id !== 1 );
              this.form.controls['unidad_administrativa_id'].setValue(null);
              this.form.controls['dependencia_usuaria_id'].setValue(null);
              this.form.controls['bienes'].setValue('');
              this.mover = [];
              //this.buscarBien();
            }
          });
        }
      }
    });
    //cargar unidad Administrativa al cambiar subcoordinacion
    this.form.controls['subcoordinacion_id'].valueChanges.subscribe({
      next:(subcoordinacion_id:any)=>{
        this.form.controls['dependencia_usuaria_id'].setValue(null);
        this.dependenciaUsuarias = [];
        this.unidadAdministrativaService.index().subscribe({
          next:({data: unidadAdministrativas}: UnidadAdministrativaPaginate ) => {
            this.unidadAdministrativas = unidadAdministrativas.filter((unidadAdministrativa) => unidadAdministrativa.subcoordinacion_id == subcoordinacion_id);
            this.form.controls['dependencia_usuaria_id'].setValue(null);
            this.form.controls['bienes'].setValue('');
            this.mover = [];
              //this.buscarBien();
          }
        });
      }
    });

    //cargar dependencia usuaria al cambiar unidad administrativa
    this.form.controls['unidad_administrativa_id'].valueChanges.subscribe({
      next:(unidad_administrativa_id:any)=>{
        if(unidad_administrativa_id){
        this.dependenciaUsuariaService.index().subscribe({
          next:({data: dependenciaUsuarias}: DependenciaUsuariaPaginate) => {
            this.dependenciaUsuarias=dependenciaUsuarias.filter((dependenciaUsuaria) => dependenciaUsuaria.unidad_administrativa_id == unidad_administrativa_id);
            this.form.controls['dependencia_usuaria_id'].setValue(null);
              this.form.controls['bienes'].setValue('');
              this.mover = [];
              this.cargarDataBienes();
          }
        });
      }
    }
    });



  }

}

