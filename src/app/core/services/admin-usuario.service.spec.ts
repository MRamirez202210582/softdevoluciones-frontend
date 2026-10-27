import { TestBed } from '@angular/core/testing';

import { AdminUsuarioService } from './admin-usuario.service';

describe('AdminUsuarioService', () => {
  let service: AdminUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
