import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationType } from 'src/app/utils/notification-messages';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  page = 1
  limit = 10
  collectionSize = 0
  userList = []
  userDetails = ["_id", "name", "mobile", "userRole", "userStatus"]

  constructor(private adminSerice: AdminService, private notificationService: NotificationService) {
  }

  // Page Change
  onPageChange(currentPage: number) {
    this.page = currentPage;
    let request = {
      page: currentPage,
      limit: this.limit,
    };
    this.getUserList(request);
  }

  getUserList(request: any) {
    this.adminSerice.getAllUsers(request).subscribe(
      (res: any) => {
        this.userList = res.data
        this.collectionSize = res.count
      },
      (err: any) => {
        this.notificationService.sendMessage({
          message: err.error.message,
          type: NotificationType.error
        })
      }
    );
  }

  ngOnInit() {
    this.getUserList({
      page: this.page,
      limit: this.limit
    })
  }
}
