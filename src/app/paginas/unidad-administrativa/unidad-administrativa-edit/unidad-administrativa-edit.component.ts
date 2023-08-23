import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Coordinacion, Subcoordinacion } from 'src/app/interfaces';
import { ErrorService } from 'src/app/servicios/errores.service';
import { SubcoordinacionsService } from 'src/app/servicios/subcoordinacions.service';
import { UnidadAdministrativaService } from 'src/app/servicios/unidad-administrativa.service';
import { UnidadAdministrativa } from '../../../interfaces/unidad-administrativa';

@Component({
  selector: 'app-unidad-administrativa-edit',
  templateUrl: './unidad-administrativa-edit.component.html',
  styleUrls: ['./unidad-administrativa-edit.component.css']
})
export class UnidadAdministrativaEditComponent implements OnInit {
  form!:FormGroup;
  coordinacions: Coordinacion[] = [];
  subcoordinaciones: Subcoordinacion[] = [];
  subcoordinacionSeleccionada!: Subcoordinacion; // la necesito para tener el id de la coordinacion

  constructor(
    @Inject(MAT_DIALOG_DATA) protected unidadAdministrativa: UnidadAdministrativa,
    private formBuilder:FormBuilder,
    private subcoordinacionsService:SubcoordinacionsService,
    private unidadAdministrativaService:UnidadAdministrativaService,
    private errorService:ErrorService,
    private matDialogRef:MatDialogRef<UnidadAdministrativaEditComponent>,
  ) { }

  ngOnInit() {

    // buscar coordinaciones
    this.subcoordinacionsService.create().subscribe({
      next:(coordinacions: Coordinacion[])=>{
        this.coordinacions = coordinacions;
      }
    });
    // buscar las subcoordinaciones
    this.subcoordinacionsService.index().subscribe({
      next:(data)=>{
        const subcoordinaciones=data.data;
        this.subcoordinacionSeleccionada = subcoordinaciones.find(s => s.id === this.unidadAdministrativa.subcoordinacion_id) as Subcoordinacion;
        if (this.subcoordinacionSeleccionada) {
          this.subcoordinaciones = subcoordinaciones.filter(s => s.coordinacion_id == this.subcoordinacionSeleccionada.coordinacion_id ) || [];
        }
        this.crearControles();
      }
    });
  }
  edit(): void {
    this.form.controls['nombre'].setValue(this.form.controls['nombre'].value.trim().toUpperCase());
    this.form.controls['telefono'].setValue(this.form.controls['telefono'].value.trim());
    let form=this.form.value;
    delete form['coordinacion_id'];
    if(this.form.valid){
      this.unidadAdministrativaService.put(form).subscribe({
        complete:()=>{
          this.errorService.mosotrarMensajes('Operacion Exitosa');
          this.matDialogRef.close(true);
        },
        error:(e)=>this.errorService.mostrarErrors(e)
      });
    }
  }

  crearControles(){
    this.form=this.formBuilder.group({
      coordinacion_id:  [this.subcoordinacionSeleccionada.coordinacion_id, Validators.compose([Validators.required])],
      id: [this.unidadAdministrativa.id,Validators.compose([Validators.required])],
      subcoordinacion_id: [this.unidadAdministrativa.subcoordinacion_id,Validators.compose([Validators.required])],
      nombre:   [this.unidadAdministrativa.nombre , Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
      telefono: [this.unidadAdministrativa.telefono, Validators.compose([Validators.required,Validators.minLength(12), Validators.maxLength(13)])],
    });
    this.form.controls['coordinacion_id'].valueChanges.subscribe({
      next:(coordinacion_id: number)=>{
        this.subcoordinacionsService.porCoordinacion(coordinacion_id).subscribe({
          next:(subcoordinaciones: Subcoordinacion[]) => (this.subcoordinaciones = subcoordinaciones)
        });
      }
    });
  }
}
