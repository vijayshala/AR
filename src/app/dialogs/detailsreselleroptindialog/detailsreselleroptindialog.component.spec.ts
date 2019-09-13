import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsreselleroptindialogComponent } from './detailsreselleroptindialog.component';

describe('DetailsreselleroptindialogComponent', () => {
  let component: DetailsreselleroptindialogComponent;
  let fixture: ComponentFixture<DetailsreselleroptindialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsreselleroptindialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsreselleroptindialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
