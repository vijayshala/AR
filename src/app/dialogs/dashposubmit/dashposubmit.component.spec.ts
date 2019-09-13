import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashposubmitComponent } from './dashposubmit.component';

describe('DashposubmitComponent', () => {
  let component: DashposubmitComponent;
  let fixture: ComponentFixture<DashposubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashposubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashposubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
