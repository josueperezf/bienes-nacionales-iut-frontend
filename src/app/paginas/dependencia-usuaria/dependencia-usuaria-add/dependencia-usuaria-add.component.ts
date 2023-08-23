import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Coordinacion, Subcoordinacion, TipoDependenciaUsuaria, UnidadAdministrativa } from 'src/app/interfaces';
import { DependenciaUsuariaService, ErrorService, SubcoordinacionsService, TipoDependenciaUsuariaService, UnidadAdministrativaService} from 'src/app/servicios';


@Component({
  selector: 'app-dependencia-usuaria-add',
  templateUrl: './dependencia-usuaria-add.component.html',
  styleUrls: ['./dependencia-usuaria-add.component.css']
})
export class DependenciaUsuariaAddComponent implements OnInit {
  form!:FormGroup;
  coordinaciones: Coordinacion[] = [];
  subcoordinaciones: Subcoordinacion[] = [];
  unidadAdministrativas: UnidadAdministrativa[] = [];
  tipoDependenciaUsuarias!: any;
  constructor(
    private formBuilder:FormBuilder,
    private matDialogRef:MatDialogRef<DependenciaUsuariaAddComponent>,
    private tipoDependenciaUsuariaService:TipoDependenciaUsuariaService,
    private dependenciaUsuariaService:DependenciaUsuariaService,
    private subcoordinacionsService:SubcoordinacionsService,
    private unidadAdministrativaService:UnidadAdministrativaService,
    private errorService:ErrorService
  ) { }

  ngOnInit() {
    this.cargarCoordinacion();
    this.crearControles();
  }
  add(tipoDeAgregar: 'listar' | 'mas') {
    this.form.controls['nombre'].setValue(this.form.controls['nombre'].value.trim().toUpperCase());
    const form = {...this.form.value};
    delete form['coordinacion_id'];
    delete form['subcoordinacion_id'];
    if(this.form.valid){
      this.dependenciaUsuariaService.add(form).subscribe({
        complete:()=>{
          this.errorService.mosotrarMensajes('operacion Exitosa');
          if(tipoDeAgregar=='listar'){
            this.matDialogRef.close(true);
          }else{
            this.form.controls['nombre'].setValue('');
            this.form.controls['unidad_administrativa_id'].setValue(null);
          }
        },
        error:(e) => this.errorService.mostrarErrors(e)
      })
    }
  }

  cargarCoordinacion():void {
    this.subcoordinacionsService.create().subscribe({
      next:(coordinaciones) => {
        this.coordinaciones = coordinaciones;
      },
      error:(e) => this.errorService.mostrarErrors(e)
    });
  }

  crearControles(): void {
    this.form = this.formBuilder.group({
      coordinacion_id:[null,Validators.required],
      subcoordinacion_id:[,Validators.required],
      tipo_dependencia_usuaria_id:[,Validators.required],
      unidad_administrativa_id:[,Validators.required],
      nombre:[,Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)]) ],
    });
    //carga subcoordinaciones al cambiar coordinacion
    this.form.controls['coordinacion_id'].valueChanges.subscribe({
      next:(coordinacion_id:number)=>{
        this.subcoordinacionsService.porCoordinacion(coordinacion_id).subscribe({
          next:(subcoordinaciones: Subcoordinacion[]) => {
            this.subcoordinaciones = subcoordinaciones;
          }
        });
      }
    });
    //cargar unidad administrativa  al cambiar subcoordinacion
    this.form.controls['subcoordinacion_id'].valueChanges.subscribe({
      next:(subcoordinacion_id:number)=>{
        this.unidadAdministrativaService.index().subscribe({
          next:({data: unidadAdministrativas}) => {
            this.unidadAdministrativas = unidadAdministrativas.filter((uAd)=> uAd.subcoordinacion_id == subcoordinacion_id);
            this.form.controls['unidad_administrativa_id'].setValue(null);
          }
        });
      }
    });
    //cargar cuando cambie una unidad administrativa
    this.form.controls['unidad_administrativa_id'].valueChanges.subscribe({
      next:(unidad_administrativa_id: number) => {
        this.tipoDependenciaUsuariaService.porUnidadAdministrativa(unidad_administrativa_id).subscribe({
          next:(data: TipoDependenciaUsuaria[])=>{
            this.tipoDependenciaUsuarias = data;
          }
        });

      }
    });
  }
}
