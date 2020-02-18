import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsPanelComponent } from './fields-panel.component';

describe('FieldsPanelComponent', () => {
  let component: FieldsPanelComponent;
  let fixture: ComponentFixture<FieldsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
