import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    apiUrl = environment.apiUrl;
    isToken = false;

    constructor(private http: HttpClient, private router: Router) { }
    auth = localStorage.getItem('auth')
    authtoken = this.auth ? JSON.parse(this.auth) : null;
    // auth = JSON.parse(localStorage.getItem('auth') || "no data")
    // token = this.auth.token
    headers_object = {"Authorization":"Bearer " + this.authtoken?.token}

    params = new HttpParams();
   
    getAllUsers(request: any) {
        let url = this.apiUrl + '/getAllUsers';
        return this.http.post(url, request, {headers: this.headers_object});
    }
    
    getAllProducts(request: any) {
        let url = this.apiUrl + '/getAllProducts';
        return this.http.post(url, request, {headers: this.headers_object});
    }

    getAllSales(request: any) {
        let url = this.apiUrl + '/getAllSales';
        return this.http.post(url, request, {headers: this.headers_object});
    }

    userApproval(request: any) {
        let url = this.apiUrl + '/userApproval';
        return this.http.post(url, request, {headers: this.headers_object});
    }

    addProduct(request: any) {
        let url = this.apiUrl + '/addProduct';
        return this.http.post(url, request, {headers: this.headers_object});
    }

    updateProduct(request: any) {
        let url = this.apiUrl + '/updateProduct';
        return this.http.post(url, request, {headers: this.headers_object});
    }
    
    deleteProduct(request: any) {
        let url = this.apiUrl + '/deleteProduct';
        return this.http.post(url, request, {headers: this.headers_object});
    }

    getProductById(request: any) {
        let url = this.apiUrl + '/getProductById';
        return this.http.post(url, request, {headers: this.headers_object});
    }
}

