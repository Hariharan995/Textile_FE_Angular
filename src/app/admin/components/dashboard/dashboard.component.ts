import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  dateStatus = "Today"
  startDate: any = (moment().format("YYYY-MM-DD"))
  endDate: any = (moment().add(1, "days").format("YYYY-MM-DD"))
  collectionSize = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  loginRole = ""
  saleList: any = []
  revenueDetails: any
  saleDetails = ["Created Date", "OrderNo", "Buyer Name", "Payment Type", "Credit Point Amount", "Discount Amount", "SubTotal", "Total Amount", "Action"]
  paymentTypeList = ["ALL", "ONLINEPAYMENT", "COD"]
  sortOption = [
    {
      name: "Today",
      value: "today",
    },
    {
      name: "Last 7 days",
      value: "last_seven_days",
    },
    {
      name: "Last 30 days",
      value: "last_thirty_days",
    },
    {
      name: "This Month",
      value: "this_month",
    },
    {
      name: "This year",
      value: "this_year",
    },
    {
      name: "Last year",
      value: "last_year",
    },
    {
      name: "All time",
      value: "all_time",
    },
  ];
  constructor(private adminSerice: AdminService, private notificationService: NotificationService) {
  }
  async dateFilter(value: any) {
    this.pageIndex = 0
    this.pageSize = 5
    this.handleStatus(value)
    this.getDashboardDetails({
      startDate: this.startDate,
      endDate: this.endDate,
    })
    this.filter('PAGINATION')
  }
  handleStatus(value: any) {
    switch (value) {
      case "today":
        this.startDate = (moment().format("YYYY-MM-DD"))
        this.endDate = (moment().add(1, "days").format("YYYY-MM-DD"))
        break;
      case "last_seven_days":
        this.startDate = (moment().subtract(7, "day").format("YYYY-MM-DD"));
        this.endDate = (moment().add(1, "days").format("YYYY-MM-DD"));
        break;
      case "last_thirty_days":
        this.startDate = (moment().subtract(30, "day").format("YYYY-MM-DD"))
        this.endDate = (moment().add(1, "days").format("YYYY-MM-DD"))
        break;
      case "this_month":
        this.startDate = (moment().set('date', 1).format("YYYY-MM-DD"))
        this.endDate = (moment().add(1, "days").format("YYYY-MM-DD"))
        break;
      case "this_year":
        this.startDate = (moment().set('date', 1).set('month', 0).format("YYYY-MM-DD"))
        this.endDate = (moment().add(1, "days").format("YYYY-MM-DD"))
        break;
      case "last_year":
        this.startDate = (moment().set('date', 1).set('month', 0).subtract(1, 'year').format("YYYY-MM-DD"))
        this.endDate = (moment().set('date', 31).set('month', 11).subtract(1, 'year').format("YYYY-MM-DD"))
        break;
      case "all_time":
        this.startDate = (undefined);
        this.endDate = (undefined);
        break;
      default:
        this.startDate = (moment().format("YYYY-MM-DD"))
        this.endDate = (moment().add(1, "days").format("YYYY-MM-DD"))
        break;
    }
  }
  pageEvent!: PageEvent;
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.collectionSize = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.filter('PAGINATION')
  }
  filter(type: any) {
    this.pageIndex = type == "FILTER" ? 0 : this.pageIndex
    this.pageSize = type == "FILTER" ? 5 : this.pageSize
    let request = {
      filterObj: {
        startDate: this.startDate,
        endDate: this.endDate,
      },
      page: this.pageIndex + 1,
      limit: this.pageSize
    }
    this.getSaleList(request)
  }
  
  sortChange(field: any) {
    if (field.direction != '' && field.active != 'Action' && field.active != 'Buyer Name') {
      let sortObj = {}
      let sortBy = ''
      let sortType = field.direction === 'desc' ? 1 : -1
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
          startDate: this.startDate,
          endDate: this.endDate,
        },
        sortObj: sortObj,
        page: this.pageIndex + 1,
        limit: this.pageSize
      })
    }
  }
  getDashboardDetails(request: any) {
    this.adminSerice.getDashboardDetails(request).subscribe(
      (res: any) => {
        this.revenueDetails = res.data ? res.data : {}
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err,
          type: NotificationType.error
        })
      }
    );
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
  ngOnInit() {
    this.getSaleList({
      filterObj: {
        startDate: this.startDate,
        endDate: this.endDate,
      },
      page: this.pageIndex + 1,
      limit: this.pageSize
    })
    this.getDashboardDetails({
      startDate: this.startDate,
      endDate: this.endDate,
    })
  }
}
