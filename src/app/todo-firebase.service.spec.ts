import { TestBed } from '@angular/core/testing';

import { TodoFirebaseService } from './todo-firebase.service';

describe('TodoFirebaseService', () => {
  let service: TodoFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
