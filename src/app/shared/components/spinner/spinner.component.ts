import { ChangeDetectorRef, Component } from '@angular/core';
import { SpinnerService } from 'src/app/core/services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  showSpinner = false;

  constructor(private spinnerService: SpinnerService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.spinnerService.getSpinnerObserver().subscribe((status:any) => {
      this.showSpinner = (status === 'start');
      this.cdRef.detectChanges();
    });
  }

}
