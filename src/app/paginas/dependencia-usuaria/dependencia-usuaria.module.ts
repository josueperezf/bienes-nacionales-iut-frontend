import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DependenciaUsuariaRoutingModule } from './dependencia-usuaria-routing.module';
import { DependenciaUsuariaShowComponent } from './dependencia-usuaria-show/dependencia-usuaria-show.component';
import { DependenciaUsuariaIndexComponent } from './dependencia-usuaria-index/dependencia-usuaria-index.component';
import { DependenciaUsuariaAddComponent } from './dependencia-usuaria-add/dependencia-usuaria-add.component';
import { DependenciaUsuariaEditComponent } from './dependencia-usuaria-edit/dependencia-usuaria-edit.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DependenciaUsuariaShowComponent,
    DependenciaUsuariaIndexComponent,
    DependenciaUsuariaAddComponent,
    DependenciaUsuariaEditComponent
  ],
  imports: [
    CommonModule,
    DependenciaUsuariaRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class DependenciaUsuariaModule { }
