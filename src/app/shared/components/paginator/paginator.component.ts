import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {

  @Input() collectionSize!: number;
  @Output() onPageChange = new EventEmitter();

  //length = this.collectionSize;
  pageSize = 10;
  pageIndex = 1;


  pageEvent!: PageEvent;

  handlePageEvent(e: PageEvent) {
    // this.pageEvent = e;
    //this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.onPageChange.emit(e.pageIndex + 1);
  }
}
