import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsResellerOptoutComponent } from './details-reseller-optout.component';

describe('DetailsResellerOptoutComponent', () => {
  let component: DetailsResellerOptoutComponent;
  let fixture: ComponentFixture<DetailsResellerOptoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsResellerOptoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsResellerOptoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
