import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  cartList: any = []
  paymentDetails = {}
  cartCount = 0
  subTotal = 0
  totalAmount = 0
  auth = localStorage.getItem('auth')
  user = this.auth ? JSON.parse(this.auth) : null;
  barcodeId = ''

  constructor(private cartService: CartService, private notificationService: NotificationService, public router: Router) {
  }

  ngOnInit() {
    this.getAllCarts()
  }

  getAllCarts() {
    if (!this.user?._id) {
      this.router.navigate(['/login']);
    }
    let request = {
      userId: this.user._id
    }
    this.cartService.getAllCarts(request).subscribe(
      (res: any) => {
        if (res.data.length != 0) {
          this.cartList = res.data.cartLists
          this.subTotal = res.data.payment.subTotal
          this.totalAmount = res.data.payment.totalAmount
          this.cartCount = res.data.cartCount
        }
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error
        })
      }
    );
  }

  onKey(event: any) {
    this.barcodeId = event.target.value;
  }

  addtoCart() {
    let request = {
      userId: this.user._id,
      barcodeId: this.barcodeId
    }
    this.cartService.addToCart(request).subscribe(
      (res: any) => {
        this.getAllCarts()
        this.barcodeId = ''
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error
        })
      }
    );
  }

  quantityChanges(type: string, barcodeIds: any) {
    let request = {
      userId: this.user._id,
      barcodeId: barcodeIds,
      type: type
    }
    this.cartService.addToCart(request).subscribe(
      (res: any) => {
        this.getAllCarts()
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error
        })
      }
    );
  }

  deleteSingleCart(cartId: any) {
    this.cartService.deleteSingleCart({ cartId: cartId }).subscribe(
      (res: any) => {
        this.getAllCarts()
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error
        })
      }
    );
  }

  deleteAllCart() {
    this.cartService.deleteAllCart({ userId: this.user._id }).subscribe(
      (res: any) => {
        this.getAllCarts()
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error
        })
      }
    );
  }

  orderPlace() {
    this.cartService.orderPlaced({ userId: this.user._id }).subscribe(
      (res: any) => {
        this.notificationService.sendMessage({
          message: res.message,
          type: NotificationType.success
        })
        this.getAllCarts()
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error
        })
      }
    );
  }
}
