import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorResponse } from 'src/app/interfaces';
import { ErrorService } from 'src/app/servicios/errores.service';
import { MarcasService } from 'src/app/servicios/marcas.service';

@Component({
  selector: 'app-marcas-add',
  templateUrl: './marcas-add.component.html',
  styleUrls: ['./marcas-add.component.css']
})
export class MarcasAddComponent implements OnInit {
  public form!:FormGroup;
  constructor(
    private errorService:ErrorService,
    private marcasService:MarcasService,
    private matDialogRef:MatDialogRef<MarcasAddComponent>,
    private formBuilder:FormBuilder
  ) { }

  ngOnInit() {
    this.crearControles();
  }
  crearControles(){
    this.form=this.formBuilder.group({
      nombre:['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])]
    });
  }
  add(){
    this.form.controls['nombre'].setValue(this.form.controls['nombre'].value.trim().toLocaleUpperCase());
    if(this.form.valid){
      this.marcasService.add(this.form.value).subscribe({
        complete:()=>{
          this.matDialogRef.close(true);
        },
        error:(e: ErrorResponse | any)=>{
          if (e.status && e.status == 422 && e.error && e.error.errors) {
            for (var key in e.error.errors) {
              this.form.controls[key].setErrors({'isUnique': true});
            }
            return;
          }
          this.errorService.mostrarErrors(e);
        }
      });
    }
  }
}
