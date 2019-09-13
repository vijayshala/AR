import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdercenterDetailsComponent } from './ordercenter-details.component';

describe('OrdercenterDetailsComponent', () => {
  let component: OrdercenterDetailsComponent;
  let fixture: ComponentFixture<OrdercenterDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdercenterDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdercenterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
