import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  apiUrl = environment.apiUrl;
    isToken = false;

    constructor(private http: HttpClient, private router: Router) { }
    auth = localStorage.getItem('auth')
    authtoken = this.auth ? JSON.parse(this.auth) : null;

    headers_object = {"Authorization":"Bearer " + this.authtoken?.token}

    params = new HttpParams();
   
    getAllCarts(request: any) {
        let url = this.apiUrl + '/getAllCarts';
        return this.http.post(url, request, {headers: this.headers_object});
    }
    
    addToCart(request: any) {
        let url = this.apiUrl + '/addToCart';
        return this.http.post(url, request, {headers: this.headers_object});
    }

    deleteSingleCart(request: any) {
        let url = this.apiUrl + '/deleteSingleCart';
        return this.http.post(url, request, {headers: this.headers_object});
    }

    deleteAllCart(request: any) {
        let url = this.apiUrl + '/delelteAllCart';
        return this.http.post(url, request, {headers: this.headers_object});
    }

    orderPlaced(request: any) {
        let url = this.apiUrl + '/orderPlaced';
        return this.http.post(url, request, {headers: this.headers_object});
    }
}
