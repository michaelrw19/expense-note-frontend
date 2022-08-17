import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddEditComponent } from './dialog-add-edit.component';

describe('DialogAddEditComponent', () => {
  let component: DialogAddEditComponent;
  let fixture: ComponentFixture<DialogAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
