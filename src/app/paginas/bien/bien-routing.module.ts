import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienIndexComponent } from './bien-index/bien-index.component';

// ruta  /bienes
const routes: Routes = [{path:'', component: BienIndexComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BienRoutingModule { }
