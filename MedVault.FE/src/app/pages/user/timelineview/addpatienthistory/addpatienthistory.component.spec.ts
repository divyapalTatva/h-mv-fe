import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpatienthistoryComponent } from './addpatienthistory.component';

describe('AddpatienthistoryComponent', () => {
  let component: AddpatienthistoryComponent;
  let fixture: ComponentFixture<AddpatienthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddpatienthistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddpatienthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
