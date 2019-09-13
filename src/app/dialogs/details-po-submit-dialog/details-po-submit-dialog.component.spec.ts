import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPoSubmitDialogComponent } from './details-po-submit-dialog.component';

describe('DetailsPoSubmitDialogComponent', () => {
  let component: DetailsPoSubmitDialogComponent;
  let fixture: ComponentFixture<DetailsPoSubmitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsPoSubmitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPoSubmitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
