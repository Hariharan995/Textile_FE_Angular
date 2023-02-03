import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPointComponent } from './credit-point.component';

describe('CreditPointComponent', () => {
  let component: CreditPointComponent;
  let fixture: ComponentFixture<CreditPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditPointComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
