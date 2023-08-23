import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from 'src/app/material.module';
import { ReportesRoutingModule } from './reportes-routing.module';
import { InventarioFormComponent } from './inventario/inventario-form/inventario-form.component';
import { InventarioShowComponent } from './inventario/inventario-show/inventario-show.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    InventarioFormComponent,
    InventarioShowComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class ReportesModule { }
