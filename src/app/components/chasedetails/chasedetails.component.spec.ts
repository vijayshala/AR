import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChasedetailsComponent } from './chasedetails.component';

describe('ChasedetailsComponent', () => {
  let component: ChasedetailsComponent;
  let fixture: ComponentFixture<ChasedetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChasedetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChasedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
