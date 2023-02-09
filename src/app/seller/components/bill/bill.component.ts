import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogComponent } from 'src/app/admin/components/dialog/dialog.component';
import { CartService } from 'src/app/core/services/cart.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';
import { AddToCartDialogComponent } from '../add-to-cart-dialog/add-to-cart-dialog.component';
import { BuyerDialogComponent } from '../buyer-dialog/buyer-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
  providers: [DatePipe]
})
export class BillComponent implements OnInit {
  combinedCode: any
  @HostListener('document:keypress', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      console.log(this.combinedCode);
      if (this.combinedCode.toString().length > 10) {
        let request = {
          userId: this.user._id,
          barcodeId: this.combinedCode,
        };
        this.cartService.addToCart(request).subscribe(
          (res: any) => {
            this.getAllCarts();
            this.barcodeId = '';
          },
          (err: any) => {
            this.notificationService.sendMessage({
              message: err,
              type: NotificationType.error,
            });
          }
        );
      }
      if (this.combinedCode && this.combinedCode.toLocaleUpperCase().startsWith('ESIGN')) {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        });
      }
      this.combinedCode = null;
    } else {
      if (this.combinedCode === null) {
        this.combinedCode = event.key;
      } else {
        this.combinedCode = (this.combinedCode || '') + event.key;
      }
    }
  }
  cartList: any = [];
  images: any = [];
  paymentDetails = {};
  paymentType = "ONLINEPAYMENT";
  buyerDetails: any = {};
  orderDetails: any = {};
  creditDetails: any = {};
  orderTime: any = {}
  orderDate: any = {}
  buyerMobile = ''
  cartCount = 0;
  creditApply = false;
  discountAmount = 0;
  creditPoint = 0;
  creditAmount = 0;
  applicableCreditAmount = 0;
  subTotal = 0;
  totalAmount = 0;
  subTotalCreditAmount = 0;
  totalCreditAmount = 0;
  subTotalDiscountAmount = 0;
  totalDiscountAmount = 0;
  user = localStorage.getItem('auth')
    ? JSON.parse(localStorage.getItem('auth') || 'no data')
    : null;
  barcodeId: any = '';

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    public router: Router,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    protected datePipe: DatePipe,
  ) {
  }

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
          this.subTotal = Number(res.data.payment.subTotal);
          this.totalAmount = Number(res.data.payment.totalAmount);
          this.cartCount = Number(res.data.cartCount);
          this.cartList.forEach((ele: any) => {
            this.images.push(this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${ele.productDetails.productImageData}`))
          });
        }

      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err,
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
        btnName: 'Barcode Number',
        btnValue: 'Add Cart',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.status) {
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
              message: err,
              type: NotificationType.error,
            });
          }
        );
      }
    });
  }

  addtoBuyer() {
    const dialogRef = this.dialog.open(BuyerDialogComponent, {
      width: '400px',
      height: '300px',
      data: {
        content: 'Buyer Details',
        btnValue: 'Submit',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.status) {
        let request = {
          buyerName: result.data.buyerName,
          buyerMobile: result.data.buyerMobile,
        };
        this.cartService.getBuyerDetails(request).subscribe(
          (res: any) => {
            this.buyerDetails = res.data.buyer
            this.creditDetails = res.data.creditPointList
            this.buyerMobile = this.buyerDetails?.buyerMobile
            this.applicableCreditAmount = this.totalAmount / (100 / this.creditDetails.applyPercent)
            this.creditAmount = this.buyerDetails.creditPoints > this.applicableCreditAmount ? this.applicableCreditAmount : this.buyerDetails.creditPoints
            this.subTotalCreditAmount = Number((this.subTotal + this.creditAmount));
            this.totalCreditAmount = Number((this.totalAmount + this.creditAmount));

          },
          (err: any) => {
            this.notificationService.sendMessage({
              message: err,
              type: NotificationType.error,
            });
          }
        );
      };
    });
  }

  applyDiscount() {
    const dialogRef = this.dialog.open(AddToCartDialogComponent, {
      width: '400px',
      height: '300px',
      data: {
        content: 'Discount',
        btnName: 'Discount Amount',
        btnValue: 'Apply',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.status) {
        if (Number(this.totalAmount) < Number(result.data.discountAmount)) {
          this.notificationService.sendMessage({
            message: "Discount amount must less than total amount",
            type: NotificationType.error,
          });
        }
        this.discountAmount = Number(this.totalAmount) > Number(result.data.discountAmount) ? Number(result.data.discountAmount) : 0
        this.subTotal = this.subTotal - this.discountAmount
        this.totalAmount = this.totalAmount - this.discountAmount
        this.subTotalDiscountAmount = this.subTotal + this.discountAmount;
        this.totalDiscountAmount = this.totalAmount + this.discountAmount;
      }
    });
  }

  removeDiscount() {
    this.subTotal = this.subTotal + this.discountAmount
    this.totalAmount = this.totalAmount + this.discountAmount
    this.discountAmount = 0
    this.subTotalDiscountAmount = 0;
    this.totalDiscountAmount = 0;
  }

  creditPointApply() {
    if (this.creditApply) {
      this.subTotal = this.subTotal - this.creditAmount
      this.totalAmount = this.totalAmount - this.creditAmount
      this.subTotalCreditAmount = Number((this.subTotal + this.creditAmount));
      this.totalCreditAmount = Number((this.totalAmount + this.creditAmount));
    }
    else {
      this.subTotal = this.subTotal + this.creditAmount
      this.totalAmount = this.totalAmount + this.creditAmount
      this.subTotalCreditAmount = 0;
      this.totalCreditAmount = 0;
    }
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
          message: err,
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
          message: err,
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
          message: err,
          type: NotificationType.error,
        });
      }
    );
  }

  orderPlace() {
    if (this.buyerMobile == '') {
      this.notificationService.sendMessage({
        message: "Please add buyer details",
        type: NotificationType.info,
      });
      this.addtoBuyer()
      return
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      height: '200px',
      data: {
        content: 'Are you sure want to place this order?',
        btnValue: 'Yes to pay',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.status) {
        let request = {}
        let data = {
          sellerId: this.user._id,
          paymentType: this.paymentType,
          buyerId: this.buyerDetails._id
        }
        if (this.discountAmount > 0) {
          request = { ...data, discountAmount: this.discountAmount.toString() }
        }
        else if (this.creditApply) {
          request = { ...data, isCreditApply: this.creditApply }
        }
        else {
          request = data
        }
        this.cartService.orderPlaced(request).subscribe(
          (res: any) => {
            this.notificationService.sendMessage({
              message: res.message,
              type: NotificationType.success,
            });
            this.orderDetails = res.data
            let date = this.orderDetails.createdAt
            this.orderDate = this.datePipe.transform(date, "dd/MM/yyyy")
            this.orderTime = this.datePipe.transform(date, "h:mm a")
            this.buyerDetails = {}
            this.buyerMobile = ''
            this.getAllCarts();
            this.discountAmount = 0;
            this.creditPoint = 0;
            this.creditAmount = 0;
            this.subTotal = 0;
            this.totalAmount = 0;
            this.subTotalCreditAmount = 0;
            this.totalCreditAmount = 0;
            this.subTotalDiscountAmount = 0;
            this.totalDiscountAmount = 0;
            this.creditApply = false
            this.printReceipt()
          },
          (err: any) => {
            this.notificationService.sendMessage({
              message: err,
              type: NotificationType.error,
            });
          }
        );
      }
    });
  }

  printReceipt() {
    window.print();
  }

  clearData() {
    let request = {
      userId: this.user._id
    }
    this.cartService.deleteAllCart(request).subscribe(
      (res: any) => {
        this.notificationService.sendMessage({
          message: res.message,
          type: NotificationType.success,
        });
        this.orderDetails = {}
        this.buyerDetails = {}
        this.buyerMobile = ''
        this.getAllCarts();
        this.discountAmount = 0;
        this.creditPoint = 0;
        this.creditAmount = 0;
        this.subTotal = 0;
        this.totalAmount = 0;
        this.subTotalCreditAmount = 0;
        this.totalCreditAmount = 0;
        this.subTotalDiscountAmount = 0;
        this.totalDiscountAmount = 0;
        this.creditApply = false
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err,
          type: NotificationType.error,
        });
      }
    );
  }
}
