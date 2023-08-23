import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BienAddComponent } from './bien-add/bien-add.component';
import { BienEditComponent } from './bien-edit/bien-edit.component';
import { BienIndexComponent } from './bien-index/bien-index.component';
import { BienShowComponent } from './bien-show/bien-show.component';
import { BienRoutingModule } from './bien-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';



@NgModule({
  declarations: [
    BienAddComponent,
    BienEditComponent,
    BienIndexComponent,
    BienShowComponent
  ],
  imports: [
    CommonModule,
    BienRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class BienModule { }
