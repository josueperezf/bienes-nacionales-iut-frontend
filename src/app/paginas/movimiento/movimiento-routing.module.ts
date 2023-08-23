import { MovimientoIndexComponent } from './movimiento-index/movimiento-index.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ruta  /movimientos
const routes: Routes = [{path:'', component: MovimientoIndexComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientoRoutingModule { }
