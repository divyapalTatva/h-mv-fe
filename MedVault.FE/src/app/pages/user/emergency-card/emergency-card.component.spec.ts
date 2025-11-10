import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyCardComponent } from './emergency-card.component';

describe('EmergencyCardComponent', () => {
  let component: EmergencyCardComponent;
  let fixture: ComponentFixture<EmergencyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergencyCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmergencyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
