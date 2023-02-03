import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-buyer-dialog',
  templateUrl: './buyer-dialog.component.html',
  styleUrls: ['./buyer-dialog.component.scss']
})
export class BuyerDialogComponent {
  buyerForm = new FormGroup({
    buyerMobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
    buyerName: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
  constructor(
    public dialogRef: MatDialogRef<BuyerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  buyer() {
    if (this.buyerForm.valid && this.buyerForm.controls['buyerMobile'].value?.length === 10) {
      let request = {
        buyerName: this.buyerForm.controls['buyerName'].value,
        buyerMobile: this.buyerForm.controls['buyerMobile'].value,
      };
      this.dialogRef.close({ status: true, data: request });
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
