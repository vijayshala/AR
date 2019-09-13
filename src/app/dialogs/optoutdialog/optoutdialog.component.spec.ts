import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptoutdialogComponent } from './optoutdialog.component';

describe('OptoutdialogComponent', () => {
  let component: OptoutdialogComponent;
  let fixture: ComponentFixture<OptoutdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptoutdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptoutdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
