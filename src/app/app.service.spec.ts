import { HttpClientModule } from '@angular/common/http';
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator';

import { AppService } from './app.service';

describe('AppService', () => {
  const ssnValid = '778628144113235';
  const ssnInvalid = '778628144113230';
  let serviceSpectator: SpectatorHttp<AppService>;
  const createSpectator = createHttpFactory({
    imports: [HttpClientModule],
    service: AppService,
  });

  beforeEach(() => (serviceSpectator = createSpectator()));
  it('should be return  false if arg null or undefined or empty string', () => {
    serviceSpectator.service
      .isSocialSecurityNumber('')
      .subscribe((value) => expect(value).toBeFalse());
  });

  it('should be a 404 status', () => {
    serviceSpectator.service
      .isSocialSecurityNumber(ssnInvalid)
      .subscribe((res) => expect(res).toBeFalsy());
    const req = serviceSpectator.expectOne(
      `http://localhost:3000/ssn/${ssnInvalid}`,
      HttpMethod.GET
    );
    req.error(new ErrorEvent('Not Found'), {
      status: 404,
      statusText: 'Not Found',
    });
  });
  it('should be 202 status ', () => {
    serviceSpectator.service
      .isSocialSecurityNumber(ssnValid)
      .subscribe((isValid) => {
        expect(isValid).toBeTruthy();
      });
    const req = serviceSpectator.expectOne(
      `http://localhost:3000/ssn/${ssnValid}`,
      HttpMethod.GET
    );
    req.flush('Ok', {
      status: 200,
      statusText: 'OK',
    });
  });
});
