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
  user = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth') || 'no data') : null;
  collectionSize = 0;
  pageSize = 10;
  pageIndex = 0;
  loginRole =""
  pageSizeOptions = [10, 25, 50, 100];
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  productList: any = []
  productDetails = ["Created Date", "BarcodeId", "ProductImage", "ProductName", "MRP", "Price", "Quantity", "Action"]
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

  filter(type: any) {
    let startDate = ''
    let endDate = ''
    this.pageIndex = type == "FILTER" ? 0 : this.pageIndex
    this.pageSize = type == "FILTER" ? 10 : this.pageSize
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

  getProductList(request: any) {
    this.adminSerice.getAllProducts(request).subscribe(
      (res: any) => {
        this.productList = []
        res.data.map((ele: any, i: any) => {
          this.productList[i] = [];
          this.productList[i].Id = ele._id;
          this.productList[i]['Created Date'] = ele.createdAt;
          this.productList[i].ProductImage = ele.productImage;
          this.productList[i].ProductName = ele.productName;
          this.productList[i].MRP = ele.mrp;
          this.productList[i].Price = ele.price;
          this.productList[i].Quantity = ele.quantity;
          this.productList[i].BarcodeId = ele.barcodeId;
          this.productList[i].Gender = ele.gender;
          this.productList[i].TaxPercent = ele.taxPercent;
          this.productList[i].Brand = ele.brand;
          this.productList[i].Description = ele.description;
          // this.productList.push(tempUserList)
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
    let auth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth') || 'no data') : null;
    this.loginRole = auth ? auth.userRole[0] : null;
    this.getProductList({
      page: this.pageIndex + 1,
      limit: this.pageSize
    })
  }

  delete(productId: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      height: '200px',
      data: {
        content: 'Are you sure want to delete this product?',
        btnValue: 'Yes Delete',
        productId: productId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status) {
        this.adminSerice.deleteProduct({ productId: result.productId }).subscribe(
          (res: any) => {
            this.notificationService.sendMessage({
              message: res.message,
              type: NotificationType.success
            })
            this.getProductList({
              page: this.pageIndex + 1,
              limit: this.pageSize
            })
          },
          (err: any) => {
            this.notificationService.sendMessage({
              message: err.error.message,
              type: NotificationType.error
            })
          }
        );
      }
    });
  }

  edit(product: any) {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '800px',
      height: '700px',
      data: {
        content: 'Edit Product',
        btnValue: 'Edit Product',
        productDetails: product
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status) {
        result.data.sellerId = this.user._id
        this.adminSerice.updateProduct(result.data).subscribe(
          (res: any) => {
            this.notificationService.sendMessage({
              message: res.message,
              type: NotificationType.success
            })
            this.getProductList({
              page: this.pageIndex + 1,
              limit: this.pageSize
            })
          },
          (err: any) => {
            this.notificationService.sendMessage({
              message: err,
              type: NotificationType.error
            })
          }
        );
      }
    });
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '800px',
      height: '700px',
      data: {
        content: 'Add New Product',
        btnValue: 'Add Product'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status) {
        result.data.sellerId = this.user._id
        this.adminSerice.addProduct(result.data).subscribe(
          (res: any) => {
            this.notificationService.sendMessage({
              message: res.message,
              type: NotificationType.success
            })
            this.getProductList({
              page: this.pageIndex + 1,
              limit: this.pageSize
            })
          },
          (err: any) => {
            this.notificationService.sendMessage({
              message: err,
              type: NotificationType.error
            })
          }
        );
      }
    });
  }

}
