import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class SaleListComponent {
  user = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth') || 'no data') : null;
  collectionSize = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  loginRole = ""
  saleList: any = []
  saleDetails = ["Created Date", "OrderNo", "Buyer Name", "Payment Type", "Credit Point Amount", "Discount Amount", "SubTotal", "Total Amount", "Action"]
  paymentTypeList = ["ALL", "ONLINEPAYMENT", "COD"]
  paymentType = ""
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
    this.filter('PAGINATION')
    // this.getSaleList({
    //   page: this.pageIndex + 1,
    //   limit: this.pageSize
    // })
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
        endDate: this.range.controls['end'].value ? endDate : '',
        paymentType: this.paymentType && this.paymentType != 'ALL' ? this.paymentType : '',
      },
      page: this.pageIndex + 1,
      limit: this.pageSize
    }
    this.getSaleList(request)
  }

  getSaleList(request: any) {
    this.adminSerice.getAllSales(request).subscribe(
      (res: any) => {
        this.saleList = []
        res.data.map((ele: any, i: any) => {
          this.saleList[i] = [];
          this.saleList[i].Id = ele._id;
          this.saleList[i]['Created Date'] = ele.createdAt;
          this.saleList[i].OrderNo = ele.orderNo;
          this.saleList[i]['Buyer Name'] = ele.buyerDetails?.name;
          this.saleList[i]['Payment Type'] = ele.paymentType;
          this.saleList[i]['Credit Point Amount'] = ele.creditAmount;
          this.saleList[i]['Discount Amount'] = ele.discountAmount;
          this.saleList[i]['SubTotal'] = ele.subTotal;
          this.saleList[i]['Total Amount'] = ele.totalAmount;
          this.saleList[i].ProductList = ele.productList;
        })
        this.collectionSize = res.count
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err,
          type: NotificationType.error
        })
      }
    );
  }

  delete(orderId: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      height: '200px',
      data: {
        content: 'Are you sure want to delete this sale?',
        btnValue: 'Yes Delete',
        productId: orderId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status) {
        this.adminSerice.deleteSale({ orderId: result.productId }).subscribe(
          (res: any) => {
            this.notificationService.sendMessage({
              message: res.message,
              type: NotificationType.success
            })
            this.getSaleList({
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

  sortChange(field: any) {
    if (field.direction != '' && field.active != 'Action' && field.active != 'Buyer Name') {
      let sortObj = {}
      let sortBy = ''
      let sortType = field.direction === 'desc' ? 1 : -1
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
      if (field.active === 'Created Date') {
        Object.assign(sortObj, { createdAt: sortType })
      }
      else {
        sortBy = field.active.replaceAll(" ", "")
        sortBy = sortBy.replace(/\w\S*/g, (m: any) => m.charAt(0).toLowerCase() + m.substr(1))
        Object.assign(sortObj, { [sortBy]: sortType })
      }
      this.getSaleList({
        filterObj: {
          searchValue: this.search ? this.search : '',
          startDate: this.range.controls['start'].value ? startDate : '',
          endDate: this.range.controls['end'].value ? endDate : '',
          paymentType: this.paymentType && this.paymentType != 'ALL' ? this.paymentType : '',
        },
        sortObj: sortObj,
        page: this.pageIndex + 1,
        limit: this.pageSize
      })
    }
  }

  ngOnInit() {
    let auth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth') || 'no data') : null;
    this.loginRole = auth ? auth.userRole[0] : null;
    this.getSaleList({
      page: this.pageIndex + 1,
      limit: this.pageSize
    })
  }
}
