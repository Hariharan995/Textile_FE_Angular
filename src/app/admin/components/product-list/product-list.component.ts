import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';
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
  productDetails = ["Id", "ProductImage", "ProductName", "MRP", "Price", "Quantity", "Action"]

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

  getProductList(request: any) {
    this.adminSerice.getAllProducts(request).subscribe(
      (res: any) => {
        // this.productList = res.data
        res.data.map((ele: any, i: any) => {
          let tempUserList: any = [];
          tempUserList.Id = ele._id;
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
        content: 'Are you sure want to reject this user?',
        btnValue: 'Yes Reject'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  edit() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      height: '200px',
      data: {
        content: 'Are you sure want to approve this user?',
        btnValue: 'Yes Approve'
      }
    });
  }
}
