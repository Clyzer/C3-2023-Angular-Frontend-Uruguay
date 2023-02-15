import { TestBed } from '@angular/core/testing';

import { LastMovementsCustomerService } from './last-movements-customer.service';

describe('UserAccountsService', () => {
  let service: LastMovementsCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastMovementsCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
