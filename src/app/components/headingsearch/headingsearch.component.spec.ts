import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingsearchComponent } from './headingsearch.component';

describe('HeadingsearchComponent', () => {
  let component: HeadingsearchComponent;
  let fixture: ComponentFixture<HeadingsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadingsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadingsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
