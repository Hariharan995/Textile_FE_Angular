import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-buyer-list',
  templateUrl: './buyer-list.component.html',
  styleUrls: ['./buyer-list.component.scss']
})
export class BuyerListComponent {
  collectionSize = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  loginRole = ''
  buyerList: any = [];
  buyerDetails = ["Created Date", "Name", "Mobile", "Credit Points", "Buy Count", "Buy Amount"] 
  search = ""

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  })
  constructor(private adminSerice: AdminService, private notificationService: NotificationService, private router: Router,
    public dialog: MatDialog,
  ) {
  }

  pageEvent!: PageEvent;
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.collectionSize = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.filter("PAGINATION")
  }

  ngOnInit() {
    let auth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth') || 'no data') : null;
    this.loginRole = auth ? auth.userRole[0] : null;
    this.getbuyerList({
      page: this.pageIndex + 1,
      limit: this.pageSize
    })
  }

  sortChange(field: any) {
    if (field.direction != '' && field.active != 'Action') {
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
      else if (field.active != 'Action') {
        sortBy = field.active.replaceAll(" ", "")
        sortBy = sortBy.replace(/\w\S*/g, (m: any) => m.charAt(0).toLowerCase() + m.substr(1))
        Object.assign(sortObj, { [sortBy]: sortType })
      }
      console.log(field);
      this.getbuyerList({
        filterObj: {
          searchValue: this.search ? this.search : '',
          startDate: this.range.controls['start'].value ? startDate : '',
          endDate: this.range.controls['end'].value ? endDate : ''
        },
        sortObj: sortObj,
        page: this.pageIndex + 1,
        limit: this.pageSize
      })
    }
  }

  getbuyerList(request: any) {
    this.adminSerice.getAllBuyers(request).subscribe(
      (res: any) => {
        this.buyerList = []
        res.data.map((ele: any, i: any) => {
          this.buyerList[i] = [];
          this.buyerList[i].Id = ele._id;
          this.buyerList[i]['Created Date'] = ele.createdAt;
          this.buyerList[i].Name = ele.name;
          this.buyerList[i].Mobile = ele.mobile;
          this.buyerList[i]['Credit Points'] = ele.creditPoints;
          this.buyerList[i]['Buy Count'] = ele.buyCount;
          this.buyerList[i]['Buy Amount'] = ele.buyAmount;
        })
        this.collectionSize = res.count;
      },
      (err: any) => {
        if (err.statusCode === 401) {
          this.router.navigate(['/login']);
        }
        this.notificationService.sendMessage({
          message: err,
          type: NotificationType.error
        })
      }
    );
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
    this.getbuyerList(request)
  }


}
