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

    params = new HttpParams();
    getAllCarts(request: any) {
        let url = this.apiUrl + '/getAllCarts';
        return this.http.post(url, request,);
    }

    addToCart(request: any) {
        let url = this.apiUrl + '/addToCart';
        return this.http.post(url, request,);
    }

    deleteSingleCart(request: any) {
        let url = this.apiUrl + '/deleteSingleCart';
        return this.http.post(url, request,);
    }

    deleteAllCart(request: any) {
        let url = this.apiUrl + '/delelteAllCart';
        return this.http.post(url, request,);
    }

    orderPlaced(request: any) {
        let url = this.apiUrl + '/orderPlaced';
        return this.http.post(url, request,);
    }
}
