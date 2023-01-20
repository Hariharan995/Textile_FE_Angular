import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  auth = JSON.parse(localStorage.getItem('auth') || "no data");
  apiUrl = environment.apiUrl;
  product: boolean = false;

  defalultProfileImage = 'assets/img/profile-avatar.jpg';
  constructor(private authService: AuthService, public router: Router, public route: Router, public activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
  }

  logOut() {
    this.authService.logOut({ userId: this.auth._id });
  }
}
