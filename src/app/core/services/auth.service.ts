import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  headers = new HttpHeaders();

  params = new HttpParams();
  login(loginCredentials: any) {
    let url = this.apiUrl + '/login';
    return this.http.post(url, loginCredentials);
  }

  registerUser(formData: FormData) {
    let url = this.apiUrl + '/signUp';
    return this.http.post(url, formData);
  }

  async logOut(userId: any) {
    let url = this.apiUrl + '/logout';    
    localStorage.clear();
    this.router.navigate(['/login'])
    return this.http.post(url, userId)
  }
}
