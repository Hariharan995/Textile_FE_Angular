import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/admin/components/dialog/dialog.component';
import { CartService } from 'src/app/core/services/cart.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';
import { AddToCartDialogComponent } from '../add-to-cart-dialog/add-to-cart-dialog.component';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
})
export class BillComponent implements OnInit {
  cartList: any = [];
  paymentDetails = {};
  cartCount = 0;
  subTotal = 0;
  totalAmount = 0;
  user = localStorage.getItem('auth')
    ? JSON.parse(localStorage.getItem('auth') || 'no data')
    : null;
  barcodeId: any = '';

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    public router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getAllCarts();
  }

  getAllCarts() {
    if (!this.user?._id) {
      this.router.navigate(['/login']);
    }
    let request = {
      userId: this.user._id,
    };
    this.cartService.getAllCarts(request).subscribe(
      (res: any) => {
        if (res.data.length != 0) {
          this.cartList = res.data.cartLists;
          this.subTotal = res.data.payment.subTotal;
          this.totalAmount = res.data.payment.totalAmount;
          this.cartCount = res.data.cartCount;
        }
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error,
        });
      }
    );
  }

  onKey(event: any) {
    this.barcodeId = event.target.value;
  }

  addtoCart() {
    const dialogRef = this.dialog.open(AddToCartDialogComponent, {
      width: '400px',
      height: '300px',
      data: {
        content: 'Add To Cart',
        btnValue: 'Add Cart',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.status) {
        let request = {
          userId: this.user._id,
          barcodeId: result.data.barcodeId,
        };
        this.cartService.addToCart(request).subscribe(
          (res: any) => {
            this.getAllCarts();
            this.barcodeId = '';
          },
          (err: any) => {
            this.notificationService.sendMessage({
              message: err.error.message,
              type: NotificationType.error,
            });
          }
        );
      }
    });
  }

  quantityChanges(type: string, barcodeIds: any) {
    let request = {
      userId: this.user._id,
      barcodeId: barcodeIds,
      type: type,
    };
    this.cartService.addToCart(request).subscribe(
      (res: any) => {
        this.getAllCarts();
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error,
        });
      }
    );
  }

  deleteSingleCart(cartId: any) {
    this.cartService.deleteSingleCart({ cartId: cartId }).subscribe(
      (res: any) => {
        this.getAllCarts();
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error,
        });
      }
    );
  }

  deleteAllCart() {
    this.cartService.deleteAllCart({ userId: this.user._id }).subscribe(
      (res: any) => {
        this.getAllCarts();
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error,
        });
      }
    );
  }

  orderPlace() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      height: '200px',
      data: {
        content: 'Are you sure want to place this order?',
        btnValue: 'Yes to pay',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.status) {
        this.cartService.orderPlaced({ sellerId: this.user._id }).subscribe(
          (res: any) => {
            this.notificationService.sendMessage({
              message: res.message,
              type: NotificationType.success,
            });
            this.getAllCarts();
          },
          (err: any) => {
            this.notificationService.sendMessage({
              message: err.error.message,
              type: NotificationType.error,
            });
          }
        );
      }
    });
  }
}
