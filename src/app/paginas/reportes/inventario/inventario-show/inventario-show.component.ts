import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorService, ReportesService } from 'src/app/servicios';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { Inventario, InventarioRequest } from 'src/app/interfaces';



@Component({
  selector: 'app-inventario-show',
  templateUrl: './inventario-show.component.html',
  styleUrls: ['./inventario-show.component.css']
})
export class InventarioShowComponent implements OnInit {
  dependenciaUsuaria:any;
  biens: any[] = [];
  //@Input() form;
  displayedColumns = ['codigo','marca_nombre', 'denominacion_nombre','monto'];

  constructor(
    // @Inject('Window') private window: Window,
    @Inject(MAT_DIALOG_DATA) private form:InventarioRequest,
    private reportesService:ReportesService,
    private errorService:ErrorService,
  ) { }

  ngOnInit() {
    if(this.form)
      this.cargarData();
  }
  cargarData(){
    this.reportesService.inventario(this.form).subscribe({
      next:({biens, dependenciaUsuaria}: Inventario) => {

        this.dependenciaUsuaria = dependenciaUsuaria;
        this.biens = biens || [];

      },
      error:(e)=>{this.errorService.mostrarErrors(e)}
    });
  }
  generarPdf() {
    const plantilla = document.getElementById('plantilla');
    plantilla &&
    html2canvas(plantilla).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 190;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm'); // A4 size page of PDF
      var position = 10;
      pdf.addImage(contentDataURL, 'PNG', 10, position, imgWidth, imgHeight);
      pdf.addPage();
      pdf.save('inventario_.pdf'); // Generated PDF
      });
  }
}
