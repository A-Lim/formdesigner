import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormDesignerService } from '../formdesigner.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { FormDesignDetail } from '../fieldtype.model';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-field-options-panel',
  templateUrl: './field-options-panel.component.html',
  styleUrls: ['./field-options-panel.component.css']
})
export class FieldOptionsPanelComponent implements OnInit, OnDestroy {
  public selectedFormDesignDetail: FormDesignDetail;
  public searchStr: string;
  public searchField = new Subject<string>();
  // public search$: Observable<string>;
  private _unsubscribe = new Subject<void>();

  constructor(private formDesignService: FormDesignerService) { }

  ngOnInit() {
    // keep track of which form field is selected
    this.formDesignService.selectedFormDesignDetail$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(formDesignDetail => {
      this.selectedFormDesignDetail = formDesignDetail;
    });

    // search
    this.searchField.pipe(
      // add delay
      debounceTime(400),
      // only emit if the current value is different than the last
      distinctUntilChanged(),
      // continue listening for changes until unsubscribe
      takeUntil(this._unsubscribe),
    ).subscribe(searchStr => {
      this.formDesignService.searchField(searchStr);
    });
  }

  onSearchFieldBlur() {
    // reset
    this.searchStr = null;
    this.searchField.next(null);
    this.formDesignService.searchField(null);
  }

  onSearchFieldChange(searchStr: string) {
    this.searchField.next(searchStr);
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}
