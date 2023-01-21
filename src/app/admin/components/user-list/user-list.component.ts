import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  collectionSize = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  userList: any = [];
  userDetails = ["Id", "Name", "Mobile", "UserRole", "UserStatus", "Action"]

  constructor(private adminSerice: AdminService, private notificationService: NotificationService, private router: Router,
    public dialog: MatDialog,
  ) {
  }



  pageEvent!: PageEvent;
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.collectionSize = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getUserList({
      page: this.pageIndex + 1,
      limit: this.pageSize
    })
  }

  getUserList(request: any) {
    this.adminSerice.getAllUsers(request).subscribe(
      (res: any) => {
        // this.userList = res.data;
        res.data.map((ele: any, i: any) => {
          let tempUserList: any = [];
          tempUserList.Id = ele._id;
          tempUserList.Name = ele.name;
          tempUserList.Mobile = ele.mobile;
          tempUserList.UserRole = ele.userRole;
          tempUserList.UserStatus = ele.userStatus;
          this.userList.push(tempUserList)
        })
        this.collectionSize = res.count;
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

  ngOnInit() {
    this.getUserList({
      page: this.pageIndex + 1,
      limit: this.pageSize
    })
  }


  reject() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      height: '200px',
      data: {
        content: 'Are you sure want to reject this user?',
        btnValue: 'Yes Reject'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  approve() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      height: '200px',
      data: {
        content: 'Are you sure want to approve this user?',
        btnValue: 'Yes Approve'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }


}
