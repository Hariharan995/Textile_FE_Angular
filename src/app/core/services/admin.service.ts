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
        return this.http.post(url, request,);
    }

    getAllBuyers(request: any) {
        let url = this.apiUrl + '/getAllBuyers';
        return this.http.post(url, request,);
    }

    getCreditPoints() {
        let url = this.apiUrl + '/getCreditPoints';
        return this.http.get(url);
    }

    getAllProducts(request: any) {
        let url = this.apiUrl + '/getAllProducts';
        return this.http.post(url, request,);
    }

    getAllSales(request: any) {
        let url = this.apiUrl + '/getAllSales';
        return this.http.post(url, request);
    }

    getSaleById(request:any) {
        let url = this.apiUrl + '/getSaleById';
        return this.http.post(url, request);
    }

    deleteSale(request: any) {
        let url = this.apiUrl + '/deleteSale';
        return this.http.post(url, request);
    }

    userApproval(request: any) {
        let url = this.apiUrl + '/userApproval';
        return this.http.post(url, request,);
    }

    updateCreditPoints(request: any) {
        let url = this.apiUrl + '/updateCreditPoints';
        return this.http.post(url, request,);
    }

    addProduct(request: any) {
        let url = this.apiUrl + '/addProduct';
        return this.http.post(url, request);
    }

    updateProduct(request: any) {
        let url = this.apiUrl + '/updateProduct';
        return this.http.post(url, request);
    }

    deleteProduct(request: any) {
        let url = this.apiUrl + '/deleteProduct';
        return this.http.post(url, request);
    }

    getProductById(request: any) {
        let url = this.apiUrl + '/getProductById';
        return this.http.post(url, request);
    }

    imageUpload(request: any) {
        let url = this.apiUrl + '/imageUpload';
        return this.http.post(url, request);
    }    
}

