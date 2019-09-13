import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellerOptoutComponent } from './reseller-optout.component';

describe('ResellerOptoutComponent', () => {
  let component: ResellerOptoutComponent;
  let fixture: ComponentFixture<ResellerOptoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResellerOptoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResellerOptoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
