import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss']
})
export class AddProductDialogComponent implements OnInit {
  msg = '';
  url: any;
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
    taxPercent: new FormControl(''),
  });
  genderList = ['MALE', "FEMALE", "CHILD"]
  constructor(
    public dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data.productDetails) {
      this.url = this.data.productDetails.ProductImage
      this.productForm.controls['productName'].patchValue(this.data.productDetails.ProductName);
      this.productForm.controls['productImage'].patchValue(this.data.productDetails.ProductImage);
      this.productForm.controls['barcodeId'].patchValue(this.data.productDetails.BarcodeId);
      this.productForm.controls['description'].patchValue(this.data.productDetails.Description);
      this.productForm.controls['brand'].patchValue(this.data.productDetails.Brand);
      this.productForm.controls['mrp'].patchValue(this.data.productDetails.MRP);
      this.productForm.controls['price'].patchValue(this.data.productDetails.Price);
      this.productForm.controls['quantity'].patchValue(this.data.productDetails.Quantity);
      this.productForm.controls['taxPercent'].patchValue(this.data.productDetails.TaxPercent);
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
        taxPercent: this.productForm.controls['taxPercent'].value,
      };
      // if (this.data.content == 'Edit Product') {
      //   request.productId = this.data.productDetails.Id 
      // }
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
  selectFile(event: any) {
    this.url = ''
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }
    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.msg = ""; reader.result
      this.url = reader.result;
      this.productForm.controls['productImage'].patchValue(this.url);
    }
  }
}