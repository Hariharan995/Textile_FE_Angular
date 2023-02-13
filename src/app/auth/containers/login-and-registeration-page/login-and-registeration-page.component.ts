import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserTypes } from 'src/app/models';
import { NotificationType } from 'src/app/utils/notification-messages';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { RegisterationFormComponent } from '../../components/registeration-form/registeration-form.component';

@Component({
  selector: 'app-login-and-registeration-page',
  templateUrl: './login-and-registeration-page.component.html',
  styleUrls: ['./login-and-registeration-page.component.scss']
})
export class LoginAndRegisterationPageComponent implements OnInit {
  @ViewChild('loginFormCmpnt')
  loginFormCmpnt!: LoginFormComponent;

  @ViewChild('registrationFormCmpnt')
  registrationFormCmpnt!: RegisterationFormComponent;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    public adminService: AdminService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    let auth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth') || 'no data') : null;
    if (auth && auth.userRole[0] == 'ADMIN') {
      this.router.navigate(['/admin/sale-list']);
    }
    else if (auth && auth.userRole[0] == 'SELLER') {
      this.router.navigate(['/seller/bill']);
    }
  }

  onSubmitLoginForm(loginCredentials: any) {
    this.authService.login(loginCredentials).subscribe(
      (res: any) => {

        let userDetails = res.data
        userDetails.token = res.token
        if (userDetails.userStatus != 'APPROVED' && !userDetails.userRole.includes("ADMIN")) {
          this.notificationService.sendMessage({
            message: "Please get approval with admin",
            type: NotificationType.warning
          })
          this.router.navigate(['/login']);
        }
        else {
          this.notificationService.sendMessage({
            message: res.message,
            type: NotificationType.success
          })
          localStorage.setItem('auth', JSON.stringify(userDetails));
          this.adminService.isToken = true;
          if (res.data.userRole.includes(UserTypes.ADMIN)) {
            this.router.navigate(['/admin/sale-list']);
          }
          else {
            this.router.navigate(['/seller/bill']);
          }
        }
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err,
          type: NotificationType.error
        })
      }
    );
  }

  onSubmitRegisterForm(registerDetails: any) {
    this.authService.registerUser(registerDetails).subscribe(
      (res: any) => {
        this.notificationService.sendMessage({
          message: "Please get approval with admin",
          type: NotificationType.info
        })
        this.router.navigate(['/login']);
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err,
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
