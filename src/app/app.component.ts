import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isToken = false
  title = 'textile';

  ngOnInit() {
    let auth = localStorage.getItem('auth')
    let authtoken = auth ? JSON.parse(auth) : null;
    this.isToken = authtoken?.token ? true : false
  }
}
