import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsOptinComponent } from './details-optin.component';

describe('DetailsOptinComponent', () => {
  let component: DetailsOptinComponent;
  let fixture: ComponentFixture<DetailsOptinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsOptinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsOptinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
