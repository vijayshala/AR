import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptOutDashboardComponent } from './opt-out-dashboard.component';

describe('OptOutDashboardComponent', () => {
  let component: OptOutDashboardComponent;
  let fixture: ComponentFixture<OptOutDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptOutDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptOutDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
