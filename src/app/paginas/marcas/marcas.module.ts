import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarcasRoutingModule } from './marcas-routing.module';
import { MarcasIndexComponent } from './marcas-index/marcas-index.component';
import { MarcasAddComponent } from './marcas-add/marcas-add.component';
import { MarcasEditComponent } from './marcas-edit/marcas-edit.component';
import { MarcasShowComponent } from './marcas-show/marcas-show.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MarcasIndexComponent,
    MarcasAddComponent,
    MarcasEditComponent,
    MarcasShowComponent
  ],
  imports: [
    CommonModule,
    MarcasRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MarcasModule { }
