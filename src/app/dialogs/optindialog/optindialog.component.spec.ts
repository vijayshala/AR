import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptindialogComponent } from './optindialog.component';

describe('OptindialogComponent', () => {
  let component: OptindialogComponent;
  let fixture: ComponentFixture<OptindialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptindialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptindialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
