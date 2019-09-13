import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReselleroptindialogComponent } from './reselleroptindialog.component';

describe('ReselleroptindialogComponent', () => {
  let component: ReselleroptindialogComponent;
  let fixture: ComponentFixture<ReselleroptindialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReselleroptindialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReselleroptindialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
