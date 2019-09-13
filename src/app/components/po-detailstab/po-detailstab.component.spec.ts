import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDetailstabComponent } from './po-detailstab.component';

describe('PoDetailstabComponent', () => {
  let component: PoDetailstabComponent;
  let fixture: ComponentFixture<PoDetailstabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoDetailstabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDetailstabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
