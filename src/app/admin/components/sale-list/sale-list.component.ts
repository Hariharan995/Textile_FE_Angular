import { Component } from '@angular/core';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class SaleListComponent {

  page = 1
  limit = 10
  collectionSize = 0
  saleList = []
  saleDetails = ["_id", "orderNo", "itemsCount", "buyerMobile", "price"]

  constructor(private adminSerice: AdminService, private notificationService: NotificationService) {
  }

  // Page Change
  onPageChange(currentPage: number) {
    this.page = currentPage;
    let request = {
      page: currentPage,
      limit: this.limit,
    };
    this.getSaleList(request);
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
      page: this.page,
      limit: this.limit
    })
  }
}
