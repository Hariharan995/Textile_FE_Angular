import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogComponent } from 'src/app/admin/components/dialog/dialog.component';
import { CartService } from 'src/app/core/services/cart.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';
import { AddToCartDialogComponent } from '../add-to-cart-dialog/add-to-cart-dialog.component';
import { BuyerDialogComponent } from '../buyer-dialog/buyer-dialog.component';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
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
  totalAmountCreditAmount = 0;
  subTotalDiscountAmount = 0;
  totalAmountDiscountAmount = 0;
  user = localStorage.getItem('auth')
    ? JSON.parse(localStorage.getItem('auth') || 'no data')
    : null;
  barcodeId: any = '';

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    public router: Router,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) { }

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
            this.totalAmountCreditAmount = Number((this.totalAmount + this.creditAmount));

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
        if(Number(this.totalAmount) < Number(result.data.discountAmount))
        {
          this.notificationService.sendMessage({
            message: "Discount amount must less than total amount",
            type: NotificationType.error,
          });
        }
        this.discountAmount = Number(this.totalAmount) > Number(result.data.discountAmount) ? Number(result.data.discountAmount) : 0
        this.subTotal = this.subTotal - this.discountAmount
        this.totalAmount = this.totalAmount - this.discountAmount
        this.subTotalDiscountAmount = this.subTotal + this.discountAmount;
        this.totalAmountDiscountAmount = this.totalAmount + this.discountAmount;
      }
    });
  }

  removeDiscount() {
    this.subTotal = this.subTotal + this.discountAmount
    this.totalAmount = this.totalAmount + this.discountAmount
    this.discountAmount = 0
    this.subTotalDiscountAmount = 0;
    this.totalAmountDiscountAmount = 0;
  }

  creditPointApply() {
    if (this.creditApply) {
      this.subTotal = this.subTotal - this.creditAmount
      this.totalAmount = this.totalAmount - this.creditAmount
      this.subTotalCreditAmount = Number((this.subTotal + this.creditAmount));
      this.totalAmountCreditAmount = Number((this.totalAmount + this.creditAmount));
    }
    else {
      this.subTotal = this.subTotal + this.creditAmount
      this.totalAmount = this.totalAmount + this.creditAmount
      this.subTotalCreditAmount = 0;
      this.totalAmountCreditAmount = 0;
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
        type: NotificationType.error,
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
            this.buyerDetails = {}
            this.buyerMobile = ''
            this.getAllCarts();
            this.discountAmount = 0;
            this.creditPoint = 0;
            this.creditAmount = 0;
            this.subTotal = 0;
            this.totalAmount = 0;
            this.subTotalCreditAmount = 0;
            this.totalAmountCreditAmount = 0;
            this.subTotalDiscountAmount = 0;
            this.totalAmountDiscountAmount = 0;
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
    });
  }

  printReceipt() {
    const receiptData = this.generateReceipt();
    const popup = window.open();
    if (popup) {
      popup.document.write(receiptData);
      popup.print();
      popup.close();
    } else {
      console.error('Failed to open a new window for the receipt.');
    }
  }

  generateReceipt() {
    const order = this.cartList;
    return `
      <html>
        <head>
        <style>
        * {
        font-size: 12px;
        font-family: 'Times New Roman';
      }
      
      td,
      th,
      tr,
      table {
        border-top: 1px dashed black;
        border-collapse: collapse;
      }
      
      td.description,
      th.description {
        text-align: center;
        align-content: center;
        width: 75px;
        max-width: 75px;
      }
      
      td.quantity,
      th.quantity {
        text-align: center;
        align-content: center;
        width: 50px;
        max-width: 50px;
        word-break: break-all;
      }
      
      td.price,
      th.price {
        text-align: center;
        align-content: center;
        width: 20px;
        max-width: 20px;
        word-break: break-all;
      }
      
      .centered {
        text-align: center;
        align-content: center;
      }
      
      .ticket {
        text-align: center;
        align-content: center;
        width: 180px;
        max-width: 180px
      }
      
      img {
        max-width: inherit;
        width: inherit;
      }
      </style>
          <title>Receipt</title>
        </head>
        <body>
        <div class="ticket">
        <p>    
        <img class="centered" src="../../../../assets/test.jpg" alt="Mountain" style="width:100px">
        <img class="centered" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkTQ8DFOgujidIRil33r2QnSZ2Y_ZHahrUlw&usqp=CAU"  alt="Mountain" style="width:50px">

        </p>
        <p class="centered">RECEIPT EXAMPLE
        <br>Address line 1
        <br>Address line 2
        <br>Address line 2
        <br>Address line 2
        <br>Phone: 123456789/ 9876543210
        </p>
          <table>
            <tr>
              <th class="description">Item</th>
              <th class="quantity">Quanty</th>
              <th class="price">Price</th>
            </tr>
            ${order.map((item: any) => `
              <tr>
                <td class="description">${item.productDetails.productName}</td>
                <td class="quantity">${item.quantity}</td>
                <td class="price">₹ ${item.productDetails.price}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="2">Total</td>
              <td>₹ ${order.totalAmount}</td>
            </tr>
          </table>
          <p class="centered">Thanks for your purchase!
          <img class="centered" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkTQ8DFOgujidIRil33r2QnSZ2Y_ZHahrUlw&usqp=CAU"  alt="Mountain" style="width:200px">
          </p>

        </div>
        </body>
      </html>
    `;
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
        this.buyerDetails = {}
        this.buyerMobile = ''
        this.getAllCarts();
        this.discountAmount = 0;
        this.creditPoint = 0;
        this.creditAmount = 0;
        this.subTotal = 0;
        this.totalAmount = 0;
        this.subTotalCreditAmount = 0;
        this.totalAmountCreditAmount = 0;
        this.subTotalDiscountAmount = 0;
        this.totalAmountDiscountAmount = 0;
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
