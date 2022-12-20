import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  isSocialSecurityNumber$: Observable<boolean> = of(true);
  form = new FormGroup({
    securityNumber: new FormControl('', Validators.pattern(/^[0-9]{15}$/)),
  });

  isSuccess = false;

  constructor(private service: AppService) {}
  handleSubmit() {
    this.service
      .isSocialSecurityNumber(this.form?.value?.securityNumber)
      .subscribe((response) => {
        if (!response) {
          this.isSuccess = false;
          this.form.controls['securityNumber'].setErrors({ validity: true });
        } else {
          this.isSuccess = true;
          this.form.controls['securityNumber'].setErrors({ validity: false });
        }
      });
  }
  get hasPatternError(): boolean {
    return this.form.controls['securityNumber'].hasError('pattern');
  }
  get hasValidityError(): boolean {
    return this.form.controls['securityNumber'].hasError('validity');
  }
}
