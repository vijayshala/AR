import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorenewdetailsComponent } from './autorenewdetails.component';

describe('AutorenewdetailsComponent', () => {
  let component: AutorenewdetailsComponent;
  let fixture: ComponentFixture<AutorenewdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutorenewdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorenewdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
