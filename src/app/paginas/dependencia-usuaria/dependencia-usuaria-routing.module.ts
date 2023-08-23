import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DependenciaUsuariaIndexComponent } from './dependencia-usuaria-index/dependencia-usuaria-index.component';

// dependenciaUsuarias
const routes: Routes = [{path:'', component: DependenciaUsuariaIndexComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DependenciaUsuariaRoutingModule { }
