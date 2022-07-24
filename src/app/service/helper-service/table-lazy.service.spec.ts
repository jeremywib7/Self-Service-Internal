import { TestBed } from '@angular/core/testing';

import { TableLazyService } from './table-lazy.service';

describe('TableLazyService', () => {
  let service: TableLazyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableLazyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
