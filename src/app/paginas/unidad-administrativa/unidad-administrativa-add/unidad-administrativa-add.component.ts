import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Coordinacion, Subcoordinacion } from 'src/app/interfaces';
import { ErrorService } from 'src/app/servicios/errores.service';
import { SubcoordinacionsService } from 'src/app/servicios/subcoordinacions.service';
import { UnidadAdministrativaService } from 'src/app/servicios/unidad-administrativa.service';

@Component({
  selector: 'app-unidad-administrativa-add',
  templateUrl: './unidad-administrativa-add.component.html',
  styleUrls: ['./unidad-administrativa-add.component.css']
})
export class UnidadAdministrativaAddComponent implements OnInit {
  form!:FormGroup;
  coordinacions: Coordinacion[] = [];
  subcoordinaciones: Subcoordinacion[] = [];
  constructor(
    private formBuilder:FormBuilder,
    private subcoordinacionsService:SubcoordinacionsService,
    private unidadAdministrativaService:UnidadAdministrativaService,
    private errorService:ErrorService,
    private matDialogRef:MatDialogRef<UnidadAdministrativaAddComponent>,
  ) { }

  ngOnInit() {
    this.crearControles();
    this.subcoordinacionsService.create().subscribe({
      next:(data:any)=>{
        this.coordinacions=data;
      }
    });
  }
  add(){
    this.form.controls["nombre"].setValue(this.form.controls["nombre"].value.trim().toUpperCase());
    this.form.controls["telefono"].setValue(this.form.controls["telefono"].value.trim());
    let form=this.form.value;
    delete form['coordinacion_id'];
    if(this.form.valid){
      this.unidadAdministrativaService.add(form).subscribe({
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
      coordinacion_id:[,Validators.compose([Validators.required])],
      subcoordinacion_id:[,Validators.compose([Validators.required])],
      nombre:[, Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
      telefono:[, Validators.compose([Validators.required,Validators.minLength(12), Validators.maxLength(13)])],
    });
    this.form.controls["coordinacion_id"].valueChanges.subscribe({
      next:(coordinacion_id: number)=>{
        this.subcoordinacionsService.porCoordinacion(coordinacion_id).subscribe({
          next:(subcoordinaciones)=>{
            this.subcoordinaciones = subcoordinaciones;
          }
        });
      }
    });
  }
}
