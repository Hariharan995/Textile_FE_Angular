import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-credit-point',
  templateUrl: './edit-credit-point.component.html',
  styleUrls: ['./edit-credit-point.component.scss']
})
export class EditCreditPointComponent {
  creditForm = new FormGroup({
    point: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    applyPercent: new FormControl('', [Validators.required]),
  });
  constructor(
    public dialogRef: MatDialogRef<EditCreditPointComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data.creditPointDetails) {
      this.creditForm.controls['point'].patchValue(this.data.creditPointDetails.Points);
      this.creditForm.controls['amount'].patchValue(this.data.creditPointDetails.Amount);
      this.creditForm.controls['applyPercent'].patchValue(this.data.creditPointDetails['Apply Percent']);
    }
  }

  creditPoints() {
    if (this.creditForm.valid) {
      let request = {
        point: this.creditForm.controls['point'].value,
        amount: this.creditForm.controls['amount'].value,
        applyPercent: this.creditForm.controls['applyPercent'].value,
        creditPointId: this.data.creditPointDetails.Id
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
