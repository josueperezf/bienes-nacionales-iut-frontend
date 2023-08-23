import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubcoordinacionRoutingModule } from './subcoordinacion-routing.module';
import { SubcoordinacionIndexComponent } from './subcoordinacion-index/subcoordinacion-index.component';
import { SubcoordinacionAddComponent } from './subcoordinacion-add/subcoordinacion-add.component';
import { SubcoordinacionEditComponent } from './subcoordinacion-edit/subcoordinacion-edit.component';
import { SubcoordinacionShowComponent } from './subcoordinacion-show/subcoordinacion-show.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';


@NgModule({
  declarations: [
    SubcoordinacionIndexComponent,
    SubcoordinacionAddComponent,
    SubcoordinacionEditComponent,
    SubcoordinacionShowComponent
  ],
  imports: [
    CommonModule,
    SubcoordinacionRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SubcoordinacionModule { }
