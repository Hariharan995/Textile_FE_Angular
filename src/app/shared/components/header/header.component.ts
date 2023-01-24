import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  auth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth') || 'no data') : null;
  userRole =this.auth? this.auth.userRole[0]: null
  constructor(private authService: AuthService,
     public adminService:AdminService,
     public router: Router, public route: Router, public activatedRoute: ActivatedRoute, private notificationService: NotificationService) { }

  logOut() {
    let request = { token: this.auth?.token }
    this.authService.logOut(request).subscribe(
      (res: any) => {
        this.notificationService.sendMessage({
          message: res.message,
          type: NotificationType.success
        })
        localStorage.clear();
        this.adminService.isToken = false;
        this.router.navigate(['']);
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error
        })
      }
    );
  }

  ngOnInit() {
  }
}
