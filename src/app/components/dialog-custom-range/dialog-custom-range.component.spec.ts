import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCustomRangeComponent } from './dialog-custom-range.component';

describe('DialogCustomRangeComponent', () => {
  let component: DialogCustomRangeComponent;
  let fixture: ComponentFixture<DialogCustomRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCustomRangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCustomRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
