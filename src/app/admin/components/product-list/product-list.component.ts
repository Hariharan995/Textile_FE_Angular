import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  collectionSize = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  productList: any = []
  productDetails = ["Created Date", "ProductImage", "ProductName", "MRP", "Price", "Quantity", "Action"]
  search = ""
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  })
  constructor(private adminSerice: AdminService, private notificationService: NotificationService, public dialog: MatDialog,) {
  }

  pageEvent!: PageEvent;
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.collectionSize = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getProductList({
      page: this.pageIndex + 1,
      limit: this.pageSize
    })
  }

  filter() {
    if (this.search || this.range.controls['start'].value || this.range.controls['end'].value) {
      let startDate = ''
      let endDate = ''
      if (this.range.controls['start'].value) {
        let date = this.range.controls['start'].value;
        const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
        const day = (date.getDate()) > 9 ? (date.getDate()) : '0' + (date.getDate());
        startDate = date.getFullYear() + '-' + month + '-' + day;
      }
      if (this.range.controls['end'].value) {
        let date = this.range.controls['end'].value;
        const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
        const day = (date.getDate()) > 9 ? (date.getDate()) : '0' + (date.getDate());
        endDate = date.getFullYear() + '-' + month + '-' + day;
      }
      let request = {
        filterObj: {
          searchValue: this.search ? this.search : '',
          startDate: this.range.controls['start'].value ? startDate : '',
          endDate: this.range.controls['end'].value ? endDate : ''
        },
        page: this.pageIndex + 1,
        limit: this.pageSize
      }
      this.getProductList(request)
    }
  }

  getProductList(request: any) {
    this.productList = []
    this.adminSerice.getAllProducts(request).subscribe(
      (res: any) => {
        // this.productList = res.data
        res.data.map((ele: any, i: any) => {
          let tempUserList: any = [];
          tempUserList.Id = ele._id;
          tempUserList['Created Date'] = ele.createdAt;
          tempUserList.ProductImage = ele.productImage;
          tempUserList.ProductName = ele.productName;
          tempUserList.MRP = ele.mrp;
          tempUserList.Price = ele.price;
          tempUserList.Quantity = ele.quantity;
          this.productList.push(tempUserList)
        })
        this.collectionSize = res.count
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error
        })
      }
    );
  }

  ngOnInit() {
    this.getProductList({
      page: this.pageIndex + 1,
      limit: this.pageSize
    })
  }
  
  delete() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      height: '200px',
      data: {
        content: 'Are you sure want to delete this user?',
        btnValue: 'Yes Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  edit() {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '700px',
      height: '450px',
      data: {
        content:'Edit Product',
        btnValue:'Edit Product'
      }
    });
  }

  addProduct(){
    
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '700px',
      height: '450px',
      data:{
        content:'Add New Product',
        btnValue:'Add Product'
      }
    });

  }

}
