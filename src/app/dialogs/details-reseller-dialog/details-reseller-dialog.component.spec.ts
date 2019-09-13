import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsResellerDialogComponent } from './details-reseller-dialog.component';

describe('DetailsResellerDialogComponent', () => {
  let component: DetailsResellerDialogComponent;
  let fixture: ComponentFixture<DetailsResellerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsResellerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsResellerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
