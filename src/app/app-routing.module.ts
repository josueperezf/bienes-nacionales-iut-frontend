import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'',  redirectTo:'bienes', pathMatch:'full'},
  {path:'bienes', loadChildren: () => import('./paginas/bien/bien.module').then(m => m.BienModule)},
  {path:'marcas', loadChildren: () => import('./paginas/marcas/marcas.module').then(m => m.MarcasModule)},
  {path:'subcoordinacions', loadChildren: () => import('./paginas/subcoordinacion/subcoordinacion.module').then(m => m.SubcoordinacionModule)},
  {path:'unidadAdministrativas', loadChildren: () => import('./paginas/unidad-administrativa/unidad-administrativa.module').then(m => m.UnidadAdministrativaModule)},
  {path:'dependenciaUsuarias', loadChildren: () => import('./paginas/dependencia-usuaria/dependencia-usuaria.module').then(m => m.DependenciaUsuariaModule)},
  {path:'movimientos', loadChildren: () => import('./paginas/movimiento/movimiento.module').then(m => m.MovimientoModule)},
  {path:'reportes', loadChildren: () => import('./paginas/reportes/reportes.module').then(m => m.ReportesModule)},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
