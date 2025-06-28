import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with unauthenticated state', () => {
    expect(service.isAuthenticated()).toBeFalsy();
  });

  it('should handle login correctly', async () => {
    const result = await service.loginAsync('test@test.com', '123456');
    expect(typeof result).toBe('boolean');
  });

  it('should handle register correctly', async () => {
    const result = await service.registerAsync('newuser@test.com', '123456', 'New', 'User', 'Test Address');
    expect(typeof result).toBe('boolean');
  });

  it('should logout correctly', () => {
    service.logout();
    expect(service.isAuthenticated()).toBeFalsy();
    expect(service.getCurrentUser()).toBeNull();
  });
});
