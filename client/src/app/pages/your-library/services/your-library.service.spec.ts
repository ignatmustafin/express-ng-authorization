import { TestBed } from '@angular/core/testing';

import { YourLibraryService } from './your-library.service';

describe('YourLibraryService', () => {
  let service: YourLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YourLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
