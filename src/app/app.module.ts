import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { PlantillaComponent } from './plantilla/plantilla.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorService } from './servicios/errores.service';
import { MarcasService } from './servicios/marcas.service';
import { SubcoordinacionsService } from './servicios/subcoordinacions.service';
import { UnidadAdministrativaService } from './servicios/unidad-administrativa.service';
import { DependenciaUsuariaService } from './servicios/dependencia-usuaria.service';
import { TipoDependenciaUsuariaService } from './servicios/tipo-dependencia-usuaria.service';
import { BienService } from './servicios/bien.service';
import { DenominacionsService } from './servicios/denominacions.service';
import { MovimientoService } from './servicios/movimiento.service';
import { ReportesService } from './servicios/reportes.service';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    PlantillaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule
  ],
  providers: [
    ErrorService,
    MarcasService,
    SubcoordinacionsService,
    UnidadAdministrativaService,
    DependenciaUsuariaService,
    TipoDependenciaUsuariaService,
    BienService,
    DenominacionsService,
    MovimientoService,
    ReportesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
