import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  [x: string]: any;
  constructor(private http: HttpClient) {}
  isSocialSecurityNumber(ssn: string): Observable<boolean> {
    if (!ssn) {
      return of(false);
    }
    return this.http.get(`http://localhost:3000/ssn/${ssn}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
