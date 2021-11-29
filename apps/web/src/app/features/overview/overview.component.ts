import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPageComponent implements OnInit {
  userIdInputFilter!: FormControl;
  userId$!: Observable<string>;

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.userIdInputFilter = new FormControl('');

    this.userId$ = this.userIdInputFilter.valueChanges.pipe(debounceTime(150), distinctUntilChanged());
  }
}
