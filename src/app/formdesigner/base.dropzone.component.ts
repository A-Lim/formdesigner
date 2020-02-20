import { OnDestroy, OnInit } from '@angular/core';
import { FormField } from './fieldtype.model';
import { Subject, Observable } from 'rxjs';
import { FormDesignerService } from './formdesigner.service';
import { takeUntil } from 'rxjs/operators';

export abstract class BaseDropZoneComponent implements OnInit, OnDestroy {
    
  public searchStr: string;
  public selectedFormField: FormField;
  public searchFormField$: Observable<string>;

  // private fields
  protected _unsubscribe$ = new Subject<void>();

  constructor(public formDesignService: FormDesignerService) {
  }

  /******* COMPONENT LIFECYCLE EVENTS *******/
  ngOnInit() {
    // keep track of which form field is selected
    this.formDesignService.selectedFormField$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(formField => {
        this.selectedFormField = formField;
      });

    // keep track of search
    this.formDesignService.search$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(searchStr => {
        this.searchStr = searchStr;
      });
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete
  }

  /******* IMPLEMENTATIONS *******/
  onFormFocus() {
    this.formDesignService.setSelectedFormField(null);
  }
  
  onFormFieldFocus(formFieldID: number) {
    console.log("ON Form Fiekd Focus");
    this.resetSearch();
    this.formDesignService.setSelectedFormField(formFieldID);
  }

  /******* PRIVATE FUNCTIONS *******/
  private resetSearch() {
    this.searchStr = null;
    this.formDesignService.searchField(null);
  }
}