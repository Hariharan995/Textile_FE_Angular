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
    
    params = new HttpParams();   

    getAllUsers(request: any) {
        let url = this.apiUrl + '/getAllUsers';
        return this.http.post(url, request, );
    }
    
    getAllProducts(request: any) {
        let url = this.apiUrl + '/getAllProducts';
        return this.http.post(url, request, );
    }

    getAllSales(request: any) {
        let url = this.apiUrl + '/getAllSales';
        return this.http.post(url, request, );
    }

    userApproval(request: any) {
        let url = this.apiUrl + '/userApproval';
        return this.http.post(url, request, );
    }

    addProduct(request: any) {
        let url = this.apiUrl + '/addProduct';
        return this.http.post(url, request, );
    }

    updateProduct(request: any) {
        let url = this.apiUrl + '/updateProduct';
        return this.http.post(url, request, );
    }
    
    deleteProduct(request: any) {
        let url = this.apiUrl + '/deleteProduct';
        return this.http.post(url, request, );
    }

    getProductById(request: any) {
        let url = this.apiUrl + '/getProductById';
        return this.http.post(url, request, );
    }
}

