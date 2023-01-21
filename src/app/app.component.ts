import { Component, OnInit } from '@angular/core';
import { AdminService } from './core/services/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public adminService: AdminService,)
  {

  }
  title = 'textile';
  auth = localStorage.getItem('auth')
  authtoken = this.auth ? JSON.parse(this.auth) : null;
  ngOnInit() {    
    this.adminService.isToken = this.authtoken?.token ? true : false
  }
}
