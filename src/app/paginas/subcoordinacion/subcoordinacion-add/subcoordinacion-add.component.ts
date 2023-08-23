import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Coordinacion } from 'src/app/interfaces';
import { ErrorService } from 'src/app/servicios/errores.service';
import { SubcoordinacionsService } from 'src/app/servicios/subcoordinacions.service';

@Component({
  templateUrl: './subcoordinacion-add.component.html',
  styleUrls: ['./subcoordinacion-add.component.css']
})
export class SubcoordinacionAddComponent  implements OnInit {
  public form!:FormGroup;
  public coordinaciones: Coordinacion[] = [];
  constructor(
    private errorService:ErrorService,
    private subcoordinacionsService:SubcoordinacionsService,
    private matDialogRef:MatDialogRef<SubcoordinacionAddComponent>,
    private formBuilder:FormBuilder
  ) { }

  ngOnInit() {
    this.crearControles();
  }
  crearControles(){
    this.subcoordinacionsService.create().subscribe({
      next:(data: Coordinacion[])=>{
        this.coordinaciones = data;
        this.form=this.formBuilder.group({
          coordinacion_id:[null,Validators.compose([Validators.required])],
          ciudad:['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          nombre:['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          direccion:['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        });
      }
    });
  }
  add(){
    this.form.controls['ciudad'].setValue(this.form.controls['ciudad'].value.trim().toLocaleUpperCase() );
    this.form.controls['nombre'].setValue(this.form.controls['nombre'].value.trim().toLocaleUpperCase() );
    this.form.controls['direccion'].setValue(this.form.controls['direccion'].value.trim().toLocaleUpperCase() );

    if(this.form.valid){
      this.subcoordinacionsService.add(this.form.value).subscribe({
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
