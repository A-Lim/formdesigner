import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldOptionsPanelComponent } from './field-options-panel.component';

describe('FieldOptionsPanelComponent', () => {
  let component: FieldOptionsPanelComponent;
  let fixture: ComponentFixture<FieldOptionsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldOptionsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldOptionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
