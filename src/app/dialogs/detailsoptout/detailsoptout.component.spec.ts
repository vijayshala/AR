import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsoptoutComponent } from './detailsoptout.component';

describe('DetailsoptoutComponent', () => {
  let component: DetailsoptoutComponent;
  let fixture: ComponentFixture<DetailsoptoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsoptoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsoptoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
