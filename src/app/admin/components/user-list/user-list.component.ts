import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
  userDetails = ["Created Date", "Name", "Mobile", "UserRole", "UserStatus", "Action"]
  userRole = ""
  userRoleList = ["ADMIN", "SELLER"]
  search = ""
  userStatus = ""
  userStatusList = ["UNAPPROVED", "APPROVED", "REJECTED"]

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  })
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
    this.userList = []
    this.adminSerice.getAllUsers(request).subscribe(
      (res: any) => {
        res.data.map((ele: any, i: any) => {
          let tempUserList: any = [];
          tempUserList['Created Date'] = ele.createdAt;
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

  filter() {
    if (this.userRole || this.userStatus || this.search || this.range.controls['start'].value || this.range.controls['end'].value) {
      let startDate = ''
      let endDate = ''
      if (this.range.controls['start'].value) {
        let date = this.range.controls['start'].value;
        const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
        const day = (date.getDate()) > 9 ? (date.getDate()) : '0' + (date.getDate());
        startDate = date.getFullYear() + '-' + month + '-' + day;
      }
      if (this.range.controls['end'].value) {
        let date = this.range.controls['end'].value;
        const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
        const day = (date.getDate()) > 9 ? (date.getDate()) : '0' + (date.getDate());
        endDate = date.getFullYear() + '-' + month + '-' + day;
      }
      let request = {
        filterObj: {
          searchValue: this.search ? this.search : '',
          userStatus: this.userStatus ? this.userStatus : '',
          userRole: this.userRole ? this.userRole : '',
          startDate: this.range.controls['start'].value ? startDate : '',
          endDate: this.range.controls['end'].value ? endDate : ''
        },
        page: this.pageIndex + 1,
        limit: this.pageSize
      }
      this.getUserList(request)
    }
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
        let request = {
          userId: '',
          userStatus: 'REJECTED'
        }
        this.adminSerice.userApproval(request).subscribe(
          (res: any) => {
            this.notificationService.sendMessage({
              message: res.message,
              type: NotificationType.success
            })
          },
          (err: any) => {
            this.notificationService.sendMessage({
              message: err.error.message,
              type: NotificationType.error
            })
          }
        );

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
        let request = {
          userId: '',
          userStatus: 'APPROVED'
        }
        this.adminSerice.userApproval(request).subscribe(
          (res: any) => {
            this.notificationService.sendMessage({
              message: res.message,
              type: NotificationType.success
            })
          },
          (err: any) => {
            this.notificationService.sendMessage({
              message: err.error.message,
              type: NotificationType.error
            })
          }
        );

      }
    });
  }


}
