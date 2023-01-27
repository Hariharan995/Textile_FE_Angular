import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  delete() {
    if (this.data.btnValue == 'Yes Reject')
      this.dialogRef.close({ status: true, userId: this.data.userId });
    else
      this.dialogRef.close({ status: true, productId: this.data.productId });
  }

  cancel() {
    this.dialogRef.close({ status: false });
  }

  approve() {
    this.dialogRef.close({ status: true, userId: this.data.userId });
  }

}