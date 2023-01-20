import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class SaleListComponent {

  collectionSize = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  saleList = []
  saleDetails = ["_id", "name", "mobile", "userRole", "userStatus"]

  constructor(private adminSerice: AdminService, private notificationService: NotificationService) {
  }

  pageEvent!: PageEvent;
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.collectionSize = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getSaleList({
      page: this.pageIndex + 1,
      limit: this.pageSize
    })
  }

  getSaleList(request: any) {
    this.adminSerice.getAllSales(request).subscribe(
      (res: any) => {
        this.saleList = res.data
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
    this.getSaleList({
      page: this.pageIndex + 1,
      limit: this.pageSize
    })
  }
}
