import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss']
})
export class AddProductDialogComponent implements OnInit {

  productForm = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    productImage: new FormControl('', [Validators.required]),
    barcodeId: new FormControl('', [Validators.required, Validators.minLength(10)]),
    description: new FormControl(''),
    brand: new FormControl(''),
    gender: new FormControl(''),
    mrp: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
    tax: new FormControl(''),
  });
  genderList = ['MALE', "FEMALE", "CHILD"]
  constructor(
    public dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data.productDetails) {
      this.productForm.controls['productName'].patchValue(this.data.productDetails.ProductName);
      this.productForm.controls['productImage'].patchValue(this.data.productDetails.PoductName);
      this.productForm.controls['barcodeId'].patchValue(this.data.productDetails.BarcodeId);
      this.productForm.controls['description'].patchValue(this.data.productDetails.Description);
      this.productForm.controls['brand'].patchValue(this.data.productDetails.Brand);
      this.productForm.controls['mrp'].patchValue(this.data.productDetails.MRP);
      this.productForm.controls['price'].patchValue(this.data.productDetails.Price);
      this.productForm.controls['quantity'].patchValue(this.data.productDetails.Quantity);
      this.productForm.controls['tax'].patchValue(this.data.productDetails.Tax);
      this.productForm.controls['gender'].patchValue(this.data.productDetails.Gender);
    }
  }

  addProduct() {
    if (this.productForm.valid) {
      let request = {
        productName: this.productForm.controls['productName'].value,
        productImage: this.productForm.controls['productImage'].value,
        barcodeId: this.productForm.controls['barcodeId'].value,
        description: this.productForm.controls['description'].value,
        brand: this.productForm.controls['brand'].value,
        gender: this.productForm.controls['gender'].value,
        mrp: this.productForm.controls['mrp'].value,
        price: this.productForm.controls['price'].value,
        quantity: this.productForm.controls['quantity'].value,
        tax: this.productForm.controls['tax'].value,
      };
      this.dialogRef.close({ status: true, data: request});
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