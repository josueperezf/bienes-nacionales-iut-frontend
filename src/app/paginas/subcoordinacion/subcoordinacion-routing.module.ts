import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubcoordinacionIndexComponent } from './subcoordinacion-index/subcoordinacion-index.component';

// ruta  /subcoordinacions
const routes: Routes = [{path:'', component: SubcoordinacionIndexComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubcoordinacionRoutingModule { }
