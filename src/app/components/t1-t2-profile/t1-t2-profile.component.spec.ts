import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { T1T2ProfileComponent } from './t1-t2-profile.component';

describe('T1T2ProfileComponent', () => {
  let component: T1T2ProfileComponent;
  let fixture: ComponentFixture<T1T2ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ T1T2ProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(T1T2ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
