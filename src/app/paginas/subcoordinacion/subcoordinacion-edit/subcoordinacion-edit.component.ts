import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Coordinacion, Subcoordinacion, SubcoordinacionResponseEdit } from 'src/app/interfaces';
import { ErrorService } from 'src/app/servicios/errores.service';
import { SubcoordinacionsService } from 'src/app/servicios/subcoordinacions.service';

@Component({
  templateUrl: './subcoordinacion-edit.component.html',
  styleUrls: ['./subcoordinacion-edit.component.css']
})
export class SubcoordinacionEditComponent implements OnInit {
  public form!:FormGroup;
  protected coordinaciones: Coordinacion[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: Subcoordinacion,
    private errorService:ErrorService,
    private subcoordinacionsService:SubcoordinacionsService,
    private matDialogRef:MatDialogRef<SubcoordinacionEditComponent>,
    private formBuilder:FormBuilder
  ) { }

  ngOnInit() {
    this.subcoordinacionsService.create().subscribe({
      next:(coordinaciones: Coordinacion[]) => {
        this.coordinaciones = coordinaciones;
        this.crearControles();
      }
    });
  }
  crearControles(): void{
    if(this.data.id) {
      this.subcoordinacionsService.edit(this.data).subscribe({
        next:({subcoordinacion}: SubcoordinacionResponseEdit) => {
          this.form = this.formBuilder.group({
            id:[subcoordinacion.id,Validators.compose([Validators.required])],
            coordinacion_id:[subcoordinacion.coordinacion_id,Validators.compose([Validators.required])],
            ciudad:[subcoordinacion.ciudad, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            nombre:[subcoordinacion.nombre, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            direccion:[subcoordinacion.direccion, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          });
        }
      });
    }

  }
  edit(): void {
    this.form.controls['ciudad'].setValue(this.form.controls['ciudad'].value.trim().toLocaleUpperCase() );
    this.form.controls['nombre'].setValue(this.form.controls['nombre'].value.trim().toLocaleUpperCase() );
    this.form.controls['direccion'].setValue(this.form.controls['direccion'].value.trim().toLocaleUpperCase() );
    if(this.form.valid){
      this.subcoordinacionsService.put(this.form.value).subscribe({
        complete:()=>{
          this.matDialogRef.close(true);
        },
        error:(e)=>{
          this.errorService.mostrarErrors(e);
        }
      });
    }
  }
}

