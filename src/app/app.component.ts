import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor()
  {

  }
  isToken = false
  title = 'textile';
  auth = localStorage.getItem('auth')
  authtoken = this.auth ? JSON.parse(this.auth) : null;
  ngOnInit() {    
    this.isToken = this.authtoken?.token ? true : false
  }
}
