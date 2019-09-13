import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { orderhistoryComponent } from './orderhistory.component';

describe('orderhistoryComponent', () => {
  let component: orderhistoryComponent;
  let fixture: ComponentFixture<orderhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ orderhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(orderhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
