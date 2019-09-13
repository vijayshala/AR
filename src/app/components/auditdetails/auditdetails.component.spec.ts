import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditdetailsComponent } from './auditdetails.component';

describe('AuditdetailsComponent', () => {
  let component: AuditdetailsComponent;
  let fixture: ComponentFixture<AuditdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
