import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutonrenewProfileComponent } from './autonrenew-profile.component';

describe('AutonrenewProfileComponent', () => {
  let component: AutonrenewProfileComponent;
  let fixture: ComponentFixture<AutonrenewProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutonrenewProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutonrenewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
