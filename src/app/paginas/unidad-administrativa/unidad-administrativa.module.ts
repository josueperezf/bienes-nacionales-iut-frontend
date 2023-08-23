import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnidadAdministrativaRoutingModule } from './unidad-administrativa-routing.module';
import { UnidadAdministrativaAddComponent } from './unidad-administrativa-add/unidad-administrativa-add.component';
import { UnidadAdministrativaEditComponent } from './unidad-administrativa-edit/unidad-administrativa-edit.component';
import { UnidadAdministrativaIndexComponent } from './unidad-administrativa-index/unidad-administrativa-index.component';
import { UnidadAdministrativaShowComponent } from './unidad-administrativa-show/unidad-administrativa-show.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UnidadAdministrativaAddComponent,
    UnidadAdministrativaEditComponent,
    UnidadAdministrativaIndexComponent,
    UnidadAdministrativaShowComponent
  ],
  imports: [
    CommonModule,
    UnidadAdministrativaRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UnidadAdministrativaModule { }
