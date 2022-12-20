import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { AppService } from './app.service';

describe('Security Number Checker', () => {
  let spectator: Spectator<AppComponent>;
  let service: SpyObject<AppService>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [FormsModule, ReactiveFormsModule, HttpClientModule],
    mocks: [AppService],
  });
  beforeEach(() => {
    spectator = createComponent();
    service = spectator.inject(AppService);
  });

  it('should appear as given mockup', () => {
    expect(spectator.query('form')).toBeTruthy();
    expect(spectator.query('input[name="security-number"]')).toBeTruthy();
    expect(spectator.query('form button')).toBeTruthy();
    expect(spectator.query('[data-cy-global-status]')).toBeNull();
    expect(spectator.query('[data-cy-security-number-error]')).toBeNull();
  });

  it('should be reject bad formatted security number', () => {
    spectator.typeInElement('100 100 00', 'input[name="security-number"]');
    spectator.click('form button');
    expect(spectator.query('[data-cy-security-number-error]')).toBeTruthy();
    expect(spectator.query('[data-cy-global-status]')).toBeTruthy();
  });
  it('should reject invalid security number', () => {
    service.isSocialSecurityNumber.and.returnValue(of(false));
    spectator.typeInElement('778628144113232', 'input[name="security-number"]');
    spectator.click('form button');
    expect(spectator.query('[data-cy-security-number-error]')).toBeTruthy();
    expect(spectator.query('[data-cy-global-status]')).toBeTruthy();
  });
  it('should accept a valid security number', () => {
    service.isSocialSecurityNumber.and.returnValue(of(true));
    spectator.typeInElement('778628144113232', 'input[name="security-number"]');
    spectator.click('form button');
    expect(spectator.query('[data-cy-security-number-error]')).toBeNull();
    expect(spectator.query('[data-cy-global-status]')).toBeTruthy();
  });
});
