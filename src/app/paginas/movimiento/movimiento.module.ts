import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';

import { MovimientoRoutingModule } from './movimiento-routing.module';
import { MovimientoAddComponent } from './movimiento-add/movimiento-add.component';
import { MovimientoIndexComponent } from './movimiento-index/movimiento-index.component';
import { MovimientoShowComponent } from './movimiento-show/movimiento-show.component';


@NgModule({
  declarations: [
    MovimientoAddComponent,
    MovimientoIndexComponent,
    MovimientoShowComponent
  ],
  imports: [
    CommonModule,
    MovimientoRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MovimientoModule { }
