import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private isMobile$: Observable<boolean>;

  constructor() {
    this.isMobile$ = fromEvent(window, 'resize')
      .pipe(
        startWith(null),
        map(() => window.innerWidth < 750)
      );
  }

  isMobile(): Observable<boolean> {
    return this.isMobile$;
  }
}