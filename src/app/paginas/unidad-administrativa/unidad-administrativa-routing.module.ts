import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnidadAdministrativaIndexComponent } from './unidad-administrativa-index/unidad-administrativa-index.component';

//unidadAdministrativas
const routes: Routes = [{path:'', component: UnidadAdministrativaIndexComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnidadAdministrativaRoutingModule { }
