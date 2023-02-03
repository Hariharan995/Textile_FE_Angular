import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreditPointComponent } from './edit-credit-point.component';

describe('EditCreditPointComponent', () => {
  let component: EditCreditPointComponent;
  let fixture: ComponentFixture<EditCreditPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCreditPointComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCreditPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
