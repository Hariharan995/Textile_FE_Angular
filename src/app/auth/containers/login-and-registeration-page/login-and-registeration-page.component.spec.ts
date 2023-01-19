import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAndRegisterationPageComponent } from './login-and-registeration-page.component';

describe('LoginAndRegisterationPageComponent', () => {
  let component: LoginAndRegisterationPageComponent;
  let fixture: ComponentFixture<LoginAndRegisterationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginAndRegisterationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginAndRegisterationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
