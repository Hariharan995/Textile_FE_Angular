import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserTypes } from 'src/app/models';
import { NotificationType } from 'src/app/utils/notification-messages';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { RegisterationFormComponent } from '../../components/registeration-form/registeration-form.component';

@Component({
  selector: 'app-login-and-registeration-page',
  templateUrl: './login-and-registeration-page.component.html',
  styleUrls: ['./login-and-registeration-page.component.scss']
})
export class LoginAndRegisterationPageComponent {
  @ViewChild('loginFormCmpnt')
  loginFormCmpnt!: LoginFormComponent;

  @ViewChild('registrationFormCmpnt')
  registrationFormCmpnt!: RegisterationFormComponent;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
  }

  onSubmitLoginForm(loginCredentials: any) {
    this.authService.login(loginCredentials).subscribe(
      (res: any) => {
        this.notificationService.sendMessage({
          message: res.message,
          type: NotificationType.success
        })
        localStorage.setItem('auth', JSON.stringify(res.token))
        localStorage.setItem('userId', JSON.stringify(res.data._id))
        if (res.data.userRole.includes(UserTypes.ADMIN)) {
          this.router.navigate(['/admin/user']);
        }
        else {
          this.router.navigate(['/sales']);
        }
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error
        })
      }
    );
  }

  onSubmitRegisterForm(registerDetails: any) {
    this.authService.registerUser(registerDetails).subscribe(
      (res: any) => {
        this.notificationService.sendMessage({
          message: res.message,
          type: NotificationType.success
        })
        this.router.navigate(['/login']);
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error
        })
      }
    );
  }
  tabClick(tab: any) {
    if (tab.index === 0) {
      this.registrationFormCmpnt.registerForm.reset();
    }
    else {
      this.loginFormCmpnt.loginForm.reset();
    }
  }
}
