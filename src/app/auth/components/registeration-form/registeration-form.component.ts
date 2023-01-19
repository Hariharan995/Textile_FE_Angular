import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-registeration-form',
  templateUrl: './registeration-form.component.html',
  styleUrls: ['./registeration-form.component.scss']
})
export class RegisterationFormComponent implements OnInit {
  showPassword: any = false;
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$')]),
  });

  @Output() onSubmit = new EventEmitter();

  constructor() { }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  submit() {
    if (this.registerForm.valid) {
      let request = {
        name: this.registerForm.controls['name'].value,
        mobile: this.registerForm.controls['mobile'].value,
        email: this.registerForm.controls['email'].value,
        password: this.registerForm.controls['password'].value,
      };
      this.onSubmit.emit(request);
    }
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ngOnInit() {
    this.registerForm.reset();
  }

  ngOnDestroy(): void {
    this.registerForm.reset();
 }
}
