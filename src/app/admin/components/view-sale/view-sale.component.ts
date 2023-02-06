import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';

@Component({
  selector: 'app-view-sale',
  templateUrl: './view-sale.component.html',
  styleUrls: ['./view-sale.component.scss']
})
export class ViewSaleComponent {
  orderDetils: any = {}
  saleId: any = ""
  images: any = []
  constructor(private adminSerice: AdminService, public notificationService: NotificationService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {

  }
  ngOnInit() {
    this.saleId = this.route.snapshot.paramMap.get('saleId')
    let request = {
      saleId: this.saleId
    }
    this.getSaleById(request)
  }
  getSaleById(request: any) {
    this.adminSerice.getSaleById(request).subscribe(
      (res: any) => {
        this.orderDetils = res.data
        this.orderDetils.productList.forEach((ele: any) => {
          this.images.push(this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${ele.productImageData}`))
        });
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err,
          type: NotificationType.error
        })
      }
    );
  }
}
