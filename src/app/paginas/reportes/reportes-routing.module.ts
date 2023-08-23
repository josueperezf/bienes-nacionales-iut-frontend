import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioFormComponent } from './inventario/inventario-form/inventario-form.component';

// ruta  /reportes
const routes: Routes = [
  {path:'',  redirectTo:'inventario', pathMatch:'full'},
  {path:'inventario', component: InventarioFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
