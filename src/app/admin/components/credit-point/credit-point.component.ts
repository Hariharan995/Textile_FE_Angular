import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';
import { DialogComponent } from '../dialog/dialog.component';
import { EditCreditPointComponent } from '../edit-credit-point/edit-credit-point.component';

@Component({
  selector: 'app-credit-point',
  templateUrl: './credit-point.component.html',
  styleUrls: ['./credit-point.component.scss']
})
export class CreditPointComponent {
  creditPointList: any = [];
  creditPointDetails = ["Points", "Amount", "Action"]
  loginRole = ''

  constructor(private adminSerice: AdminService, private notificationService: NotificationService, private router: Router,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    let auth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth') || 'no data') : null;
    this.loginRole = auth ? auth.userRole[0] : null;
    this.getCreditPointList()
  }

  getCreditPointList() {
    this.adminSerice.getCreditPoints().subscribe(
      (res: any) => {
        this.creditPointList = []
        res.data.map((ele: any, i: any) => {
          this.creditPointList[i] = [];
          this.creditPointList[i].Id = ele._id;
          this.creditPointList[i].Points = ele.point;
          this.creditPointList[i].Amount = ele.amount;
        })
      },
      (err: any) => {
        if (err.statusCode === 401) {
          this.router.navigate(['/login']);
        }
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error
        })
      }
    );
  }

  pointUpdate(points: any) {
    const dialogRef = this.dialog.open(EditCreditPointComponent, {
      width: '400px',
      height: '300px',
      data: {
        content: 'Update Credit Points',
        btnValue: 'Update',
        creditPointDetails: points
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.status) {
        let request = {
          point: result.data.point,
          amount: result.data.amount,
          creditPointId: result.data.creditPointId
        };
        this.adminSerice.updateCreditPoints(request).subscribe(
          (res: any) => {
            this.getCreditPointList()
          },
          (err: any) => {
            this.notificationService.sendMessage({
              message: err.error.message,
              type: NotificationType.error,
            });
          }
        );
      };
    });
  }
}
