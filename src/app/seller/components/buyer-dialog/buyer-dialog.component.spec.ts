import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerDialogComponent } from './buyer-dialog.component';

describe('BuyerDialogComponent', () => {
  let component: BuyerDialogComponent;
  let fixture: ComponentFixture<BuyerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
