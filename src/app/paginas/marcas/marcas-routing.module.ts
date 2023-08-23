import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarcasIndexComponent } from './marcas-index/marcas-index.component';

// ruta  /marcas
const routes: Routes = [{path:'', component: MarcasIndexComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarcasRoutingModule { }
