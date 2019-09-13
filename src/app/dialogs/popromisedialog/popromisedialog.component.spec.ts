import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopromisedialogComponent } from './popromisedialog.component';

describe('PopromisedialogComponent', () => {
  let component: PopromisedialogComponent;
  let fixture: ComponentFixture<PopromisedialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopromisedialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopromisedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
