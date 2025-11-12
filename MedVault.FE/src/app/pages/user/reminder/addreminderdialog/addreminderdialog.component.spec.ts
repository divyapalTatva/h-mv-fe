import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreminderdialogComponent } from './addreminderdialog.component';

describe('AddreminderdialogComponent', () => {
  let component: AddreminderdialogComponent;
  let fixture: ComponentFixture<AddreminderdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddreminderdialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddreminderdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
