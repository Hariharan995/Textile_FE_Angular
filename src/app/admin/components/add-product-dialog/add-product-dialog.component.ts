import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';

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
  images: any;
  constructor(
    public dialogRef: MatDialogRef<AddProductDialogComponent>, public adminSerice: AdminService, public notificationService: NotificationService,
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
  selectImage(event: any) {
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

    reader.onload = (event) => {
      reader.result
      this.url = reader.result;
    }
    this.images = event.target.files[0]
    const formData = new FormData()
    formData.append('file', this.images)
    this.adminSerice.imageUpload(formData).subscribe(
      (res: any) => {
        this.productForm.controls['productImage'].patchValue(event.target.files[0].name);
        this.notificationService.sendMessage({
          message: "Image uploaded successfully",
          type: NotificationType.success,
        });
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error,
        });
      }
    );
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
    console.log("event", event.target)

    const file: File = event.target.files[0];
    let fileName = ''
    let formData = new FormData();
    if (file) {
      fileName = file.name;
      formData.append("file", file);
    }
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (event) => {
      this.url = reader.result;
    }
  }
}