import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellersubmitComponent } from './resellersubmit.component';

describe('ResellersubmitComponent', () => {
  let component: ResellersubmitComponent;
  let fixture: ComponentFixture<ResellersubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResellersubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResellersubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
