import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-to-cart-dialog',
  templateUrl: './add-to-cart-dialog.component.html',
  styleUrls: ['./add-to-cart-dialog.component.scss'],
})
export class AddToCartDialogComponent {
  addToCartForm = new FormGroup({
    barcodeId: new FormControl('', [Validators.required]),
  });
  constructor(
    public dialogRef: MatDialogRef<AddToCartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  addToCart() {
    if (this.addToCartForm.valid) {
      if (this.data.btnName == 'Barcode Number') {
        let request = {
          barcodeId: this.addToCartForm.controls['barcodeId'].value,
        };
        this.dialogRef.close({ status: true, data: request });
      }
      else {
        let request = {
          discountAmount: this.addToCartForm.controls['barcodeId'].value,
        };
        this.dialogRef.close({ status: true, data: request });
      }
    }
  }

  cancel() {
    this.dialogRef.close({ status: false });
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
