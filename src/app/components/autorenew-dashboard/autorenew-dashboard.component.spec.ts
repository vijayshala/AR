import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorenewDashboardComponent } from './autorenew-dashboard.component';

describe('AutorenewDashboardComponent', () => {
  let component: AutorenewDashboardComponent;
  let fixture: ComponentFixture<AutorenewDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutorenewDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorenewDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
