import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellerPOdetailsComponent } from './reseller-podetails.component';

describe('ResellerPOdetailsComponent', () => {
  let component: ResellerPOdetailsComponent;
  let fixture: ComponentFixture<ResellerPOdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResellerPOdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResellerPOdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
