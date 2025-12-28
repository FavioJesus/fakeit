import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevSetupComponent } from './prev-setup.component';

describe('PrevSetupComponent', () => {
  let component: PrevSetupComponent;
  let fixture: ComponentFixture<PrevSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrevSetupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrevSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
