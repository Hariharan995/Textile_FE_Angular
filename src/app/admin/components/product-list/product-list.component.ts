import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  page = 1
  limit = 10
  collectionSize = 0
  productList = []
  productDetails = ["_id", "productImage", "productName", "mrpPrice", "price", "quantity"]

  constructor(private adminSerice: AdminService, private notificationService: NotificationService) {
  }

  // Page Change
  onPageChange(currentPage: number) {
    this.page = currentPage;
    let request = {
      page: currentPage,
      limit: this.limit,
    };
    this.getProductList(request);
  }

  getProductList(request: any) {
    this.adminSerice.getAllProducts(request).subscribe(
      (res: any) => {
        this.productList = res.data
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
      page: this.page,
      limit: this.limit
    })
  }
}
