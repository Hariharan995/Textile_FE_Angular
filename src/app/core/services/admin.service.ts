import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private router: Router) { }
    auth = JSON.parse(localStorage.getItem('auth') || "no data")
    token = this.auth.token
    headers_object = new HttpHeaders().set("Authorization", "Bearer " + this.token);

    params = new HttpParams();
    getAllUsers(request: any) {
        let url = this.apiUrl + '/getAllUsers';
        return this.http.post(url, request, {headers: this.headers_object});
    }
}

