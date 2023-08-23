import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InventarioShowComponent } from '../inventario-show/inventario-show.component';
import { Coordinacion, DependenciaUsuaria, Subcoordinacion, SubcoordinacionPaginate, UnidadAdministrativa, UnidadAdministrativaPaginate } from 'src/app/interfaces';
import { DependenciaUsuariaService, ErrorService, SubcoordinacionsService, UnidadAdministrativaService } from 'src/app/servicios';


@Component({
  selector: 'app-inventario-form',
  templateUrl: './inventario-form.component.html',
  styleUrls: ['./inventario-form.component.css'],
})
export class InventarioFormComponent implements OnInit {
  form!:FormGroup;
  coordinacions: Coordinacion[] = [];
  subcoordinacions: Subcoordinacion[] = [];
  unidadAdministrativas: UnidadAdministrativa[] = [];
  dependenciaUsuarias: DependenciaUsuaria[] = [];
  minDate = new Date(2020, 0, 1);
  maxDate = new Date().toLocaleDateString("es-CL");
  dataEnviar:any;
  constructor(
    private formBuilder:FormBuilder,
    private matDialog:MatDialog,
    private subcoordinacionsService:SubcoordinacionsService,
    private unidadAdministrativaService:UnidadAdministrativaService,
    private dependenciaUsuariaService:DependenciaUsuariaService,
    private errorService:ErrorService
  ) { }

  ngOnInit() {
    this.crearControles();
    this.subcoordinacionsService.create().subscribe({
      next:(data:any)=>{
        this.coordinacions=data;
        this.coordinacions.push({'id':1,nombre:'DESINCORPORACION'});
      },
      error:(e)=>{ this.errorService.mostrarErrors(e)}
    });
  }
  generar(){
    /*
    var doc = new jsPDF();
    doc.text(20, 20, 'Hello world!');
    doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
    doc.addPage();
    doc.text(20, 20, 'Do you like that?');

    // Save the PDF
    doc.save('Test.pdf');
    */
    let maxDate=new Date(this.form.controls['fecha'].value);
    var day = maxDate.getDate();
    var monthIndex = ("0" + (maxDate.getMonth() + 1)).slice(-2);
    var year = maxDate.getFullYear();
    if(this.form.valid){
      this.matDialog.open(InventarioShowComponent,{data:
        {
            dependencia_usuaria_id:this.form.controls['dependencia_usuaria_id'].value,
            fecha:year+"-"+monthIndex+"-"+day
          }

      });
    }
  }
  crearControles(){
    this.form=this.formBuilder.group({
      'coordinacion_id':[],
      'subcoordinacion_id':[],
      'unidad_administrativa_id':[],
      'dependencia_usuaria_id':[,Validators.required],
      'fecha':[,Validators.required],
    });
    //cargar Subcoordinacion
    this.form.controls['coordinacion_id'].valueChanges.subscribe({
      next:(coordinacion_id:number)=>{
        if(coordinacion_id){
          this.subcoordinacionsService.index().subscribe({
            next:({data}: SubcoordinacionPaginate) => {
              this.subcoordinacions=data;
              if(coordinacion_id==1)
                this.subcoordinacions = [{'id':1,'nombre':'DESINCORPORACION', ciudad: '', direccion: '', created_at:'', updated_at: '', coordinacion_id:1}];
              this.form.controls['unidad_administrativa_id'].setValue(null);
              this.form.controls['dependencia_usuaria_id'].setValue(null);
              this.unidadAdministrativas = [];
              this.dependenciaUsuarias = [];
            },
            error:(e)=>{ this.errorService.mostrarErrors(e)}
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
          next:({data: unidadAdministrativas}: UnidadAdministrativaPaginate )=>{
            this.unidadAdministrativas = unidadAdministrativas.filter((uAd) => uAd.subcoordinacion_id == subcoordinacion_id);
            this.form.controls['dependencia_usuaria_id'].setValue(null);
          },
          error:(e)=>{ this.errorService.mostrarErrors(e)}
        });
      },
      error:(e)=>{ this.errorService.mostrarErrors(e)}
    });
    //cargar dependencia usuaria al cambiar unidad administrativa
    this.form.controls['unidad_administrativa_id'].valueChanges.subscribe({
      next:(unidad_administrativa_id:any)=>{
        if(unidad_administrativa_id){
        this.dependenciaUsuariaService.index().subscribe({
          next:(data )=>{
            let dependenciaUsuarias=data.data;
            this.dependenciaUsuarias = dependenciaUsuarias.filter((dUsuaria) => dUsuaria.unidad_administrativa_id == unidad_administrativa_id);
            this.form.controls['dependencia_usuaria_id'].setValue(null);
            },
            error:(e)=>{ this.errorService.mostrarErrors(e)}
          });
        }
      },
      error:(e)=>{ this.errorService.mostrarErrors(e)}
    });
  }
}
