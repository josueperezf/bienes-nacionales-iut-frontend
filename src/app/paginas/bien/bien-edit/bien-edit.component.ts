import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Bien, BienEdit, Categoria, Denominacion, Marca } from 'src/app/interfaces';
import { BienService, DenominacionsService, ErrorService } from 'src/app/servicios';

@Component({
  selector: 'app-bien-edit',
  templateUrl: './bien-edit.component.html',
  styleUrls: ['./bien-edit.component.css']
})
export class BienEditComponent implements OnInit {
  form!:FormGroup;
  bien!: Bien;
  categorias: Categoria[] = [];
  denominacions: Denominacion[] = [];
  marcas: Marca[] = [];
  constructor(
    private formBuilder:FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: Bien,
    private matDialogRef:MatDialogRef<BienEditComponent>,
    private bienService:BienService,
    private denominacionsService:DenominacionsService,
    private errorService:ErrorService
  ) { }

  ngOnInit() {
    if(this.data.id)
      this.cargarControles();
  }
  edit(){
    let form=this.form.value;
    delete form['categoria_id'];
    this.form.controls['codigo'].setValue(this.form.controls['codigo'].value.trim().toUpperCase());
    this.form.controls['serial'].setValue(this.form.controls['serial'].value.trim().toUpperCase());
    if(this.form.controls['descripcion'].value)
    this.form.controls['descripcion'].setValue(this.form.controls['descripcion'].value.trim().toUpperCase());
    if(this.form.valid){
      this.bienService.put(form).subscribe({
        complete:()=>{
          this.errorService.mosotrarMensajes('Operacion Exitosa');
          this.matDialogRef.close(true);
        },
        error:(e)=>this.errorService.mostrarErrors(e)
      });
    }
  }
  cargarControles(){
    this.bienService.edit(this.data.id || 0).subscribe({
      next:({categorias, denominacions, bien, marcas}: BienEdit) => {
        this.bien = bien;
        this.denominacions = denominacions;
        this.categorias = categorias;
        this.marcas = marcas;
        const categoria_id = denominacions.find(d => d.id == bien.denominacion_id)?.categoria_id || null;
        //controles
        this.form=this.formBuilder.group({
          'id'      : [this.bien.id,Validators.required],
          'categoria_id'      : [categoria_id ,Validators.required],
          'denominacion_id'   : [this.bien.denominacion_id,Validators.required],
          'marca_id'          : [this.bien.marca_id ,Validators.required],
          'codigo'            : [this.bien.codigo,Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(20)]) ],
          'serial'            : [this.bien.serial,Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(20)]) ],
          'monto'             : [this.bien.monto,Validators.compose([Validators.required,Validators.minLength(1),Validators.maxLength(20)]) ],
          'descripcion'       : [this.bien.descripcion],
        });
        //cargar denominaciones al cambiar categorias
      this.form.controls['categoria_id'].valueChanges.subscribe({
        next:(categoria_id:number) => {
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
    });
  }
}
