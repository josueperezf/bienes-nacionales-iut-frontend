import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Marca, ErrorResponse } from 'src/app/interfaces';
import { ErrorService } from 'src/app/servicios/errores.service';
import { MarcasService } from 'src/app/servicios/marcas.service';

@Component({
  selector: 'app-marcas-edit',
  templateUrl: './marcas-edit.component.html',
  styleUrls: ['./marcas-edit.component.css']
})
export class MarcasEditComponent implements OnInit {
  form!:FormGroup;
  constructor(
    private errorService:ErrorService,
    private marcasService:MarcasService,
    public dialogRef: MatDialogRef<MarcasEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Marca,
    private formBuilder:FormBuilder
  ) { }

  ngOnInit() {
    this.crearControles();
  }
  crearControles(){
    this.form=this.formBuilder.group({
      id:[this.data.id, Validators.required],
      nombre:[this.data.nombre, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])]
    });
  }
  edit(){
    this.form.controls['nombre'].setValue(this.form.controls['nombre'].value.trim().toLocaleUpperCase());
    if(this.form.valid){
      this.marcasService.put(this.form.value).subscribe({
        complete:()=>{
          this.dialogRef.close(true);
        },
        error:(e: ErrorResponse | any) => {
          if (e.status && e.status == 422 && e.error && e.error.errors) {
            for (var key in e.error.errors) {
              this.form.controls[key].setErrors({'isUnique': true});
            }
            return;
          }
          this.errorService.mostrarErrors(e)
        }
      });
    }
  }
}
