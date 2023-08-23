import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Coordinacion, DependenciaUsuaria, DependenciaUsuariaEdit, Subcoordinacion, TipoDependenciaUsuaria, UnidadAdministrativa } from 'src/app/interfaces';
import { DependenciaUsuariaService } from 'src/app/servicios/dependencia-usuaria.service';
import { ErrorService } from 'src/app/servicios/errores.service';
import { SubcoordinacionsService } from 'src/app/servicios/subcoordinacions.service';
import { TipoDependenciaUsuariaService } from 'src/app/servicios/tipo-dependencia-usuaria.service';
import { UnidadAdministrativaService } from 'src/app/servicios/unidad-administrativa.service';

@Component({
  selector: 'app-dependencia-usuaria-edit',
  templateUrl: './dependencia-usuaria-edit.component.html',
  styleUrls: ['./dependencia-usuaria-edit.component.css']
})
export class DependenciaUsuariaEditComponent implements OnInit {

  form!:FormGroup;
  coordinaciones: Coordinacion[] = [];
  subcoordinaciones: Subcoordinacion[] = [];
  unidadAdministrativas: UnidadAdministrativa[] = [];
  tipoDependenciaUsuarias: TipoDependenciaUsuaria[] = [];
  dependenciaUsuaria!: DependenciaUsuaria;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder:FormBuilder,
    private matDialogRef:MatDialogRef<DependenciaUsuariaEditComponent>,
    private tipoDependenciaUsuariaService:TipoDependenciaUsuariaService,
    private dependenciaUsuariaService:DependenciaUsuariaService,
    private subcoordinacionsService:SubcoordinacionsService,
    private unidadAdministrativaService:UnidadAdministrativaService,
    private errorService:ErrorService
  ) { }

  ngOnInit() {
    this.cargarData();
  }

  cargarData(): void {
    if(!this.data)
      return;
    this.dependenciaUsuariaService.edit(this.data.id).subscribe({
      next:(data: DependenciaUsuariaEdit)=>{
        this.dependenciaUsuaria = data.dependenciaUsuaria;
        this.coordinaciones=data.coordinaciones;
        this.subcoordinaciones=data.subcoordinaciones;
        this.unidadAdministrativas=data.unidadAdministrativas;
        this.tipoDependenciaUsuarias=data.tipoDependenciaUsuarias;
        this.crearControles();
      }
    });
  }
  edit(): void {
    this.form.controls['nombre'].setValue(this.form.controls['nombre'].value.trim().toUpperCase());
    this.form.controls['nombre'].setValue(this.form.controls['nombre'].value.trim().toLocaleUpperCase());
    let form=this.form.value;
    delete form['coordinacion_id'];
    delete form['subcoordinacion_id'];

    if(this.form.valid){
      this.dependenciaUsuariaService.put(form).subscribe({
        complete:()=>{
          this.errorService.mosotrarMensajes('operacion Exitosa');
          this.matDialogRef.close(true);
        },
        error:(e)=>this.errorService.mostrarErrors(e)
      })
    }
  }
  crearControles() {
    //const subcoordinacionSeleccionada = this.dependenciaUsuaria.unidad_administrativa.subcoordinacion;
    const subcoordinacionSeleccionada = this.dependenciaUsuaria.unidad_administrativa?.subcoordinacion;
    this.form=this.formBuilder.group({
      id:[this.dependenciaUsuaria.id ,Validators.required],
      coordinacion_id:[subcoordinacionSeleccionada?.coordinacion_id || null ,Validators.required],
      subcoordinacion_id:[subcoordinacionSeleccionada?.id, Validators.required],
      tipo_dependencia_usuaria_id:[this.dependenciaUsuaria.tipo_dependencia_usuaria_id,Validators.required],
      unidad_administrativa_id:[this.dependenciaUsuaria.unidad_administrativa_id,Validators.required],
      nombre:[this.dependenciaUsuaria.nombre,Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)]) ],
    });
    //carga subcoordinaciones al cambiar coordinacion
    this.form.controls['coordinacion_id'].valueChanges.subscribe({
      next:(coordinacion_id:number)=>{
        this.subcoordinacionsService.index().subscribe({
          next:({data: subcoordinaciones}) => {
            this.form.controls['subcoordinacion_id'].setValue(null);
            this.form.controls['unidad_administrativa_id'].setValue(null);
            this.form.controls['tipo_dependencia_usuaria_id'].setValue(null);
            this.subcoordinaciones = subcoordinaciones.filter((subcoordinacion)=> subcoordinacion.coordinacion_id==coordinacion_id);
          }
        });
      }
    });
    //cargar unidad administrativa  al cambiar subcoordinacion
    this.form.controls['subcoordinacion_id'].valueChanges.subscribe({
      next:(subcoordinacion_id:any)=>{
        this.unidadAdministrativaService.index().subscribe({
          next:(data:any)=>{
            this.form.controls['unidad_administrativa_id'].setValue(null);
            this.form.controls['tipo_dependencia_usuaria_id'].setValue(null);
            let unidadAdministrativas=data.data;
            this.unidadAdministrativas=unidadAdministrativas.filter((unidadAdministrativa: UnidadAdministrativa)=> unidadAdministrativa.subcoordinacion_id==subcoordinacion_id);
          }
        });
      }
    });
    //cargar cuando cambie una unidad administrativa
    this.form.controls['unidad_administrativa_id'].valueChanges.subscribe({
      next:(unidad_administrativa_id:number)=>{
        this.tipoDependenciaUsuariaService.porUnidadAdministrativa(unidad_administrativa_id).subscribe({
          next:(data:any)=>{
            this.tipoDependenciaUsuarias=data;
          }
        });

      }
    });
  }
}
