import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.css'],
})
export class PlantillaComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map((result: any) => result.matches)
  );

constructor(private breakpointObserver: BreakpointObserver) {}
}
