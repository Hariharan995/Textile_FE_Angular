import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy {

  showPassword: any = false;
  @Output() onSubmit = new EventEmitter();

  loginForm: FormGroup;
  constructor() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  submit() {
    if (this.loginForm.valid) {
      let request = {
        username: this.loginForm.controls['username'].value,
        password: this.loginForm.controls['password'].value,
      };
      this.onSubmit.emit(request);
    }
  }

  ngOnInit(): void {
    this.loginForm.reset();
  }

  ngOnDestroy(): void {
     this.loginForm.reset();
  }
}
