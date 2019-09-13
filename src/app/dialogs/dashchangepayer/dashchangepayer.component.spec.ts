import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashchangepayerComponent } from './dashchangepayer.component';

describe('DashchangepayerComponent', () => {
  let component: DashchangepayerComponent;
  let fixture: ComponentFixture<DashchangepayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashchangepayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashchangepayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
