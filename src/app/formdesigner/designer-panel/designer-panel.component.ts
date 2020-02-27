import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormDesignerService } from '../formdesigner.service';

import { DndDropEvent } from 'ngx-drag-drop';
import { FormDesignDetail, EffectAllowed, FieldType } from '../fieldtype.model';
import { Subscription, Observable, Subject } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-designer-panel',
  templateUrl: './designer-panel.component.html',
  styleUrls: ['./designer-panel.component.css']
})
export class DesignerPanelComponent implements OnInit, OnDestroy {
  public formDesignDetails$: Observable<FormDesignDetail[]>;
  
  public selectedFormDesignDetail$: Observable<FormDesignDetail>;
  public search$: Observable<string>;
  // public formDesignDetails: FormDesignDetail[];

  public searchStr: string;
  
  public scale = 100;

  private _unsubscribe$ = new Subject<void>();

  constructor(private formDesignService: FormDesignerService) { }

  ngOnInit() {
    this.formDesignService.retrieveFormDesignDetail();
    
    this.formDesignDetails$ = this.formDesignService.formDesignDetail$;
    this.selectedFormDesignDetail$ = this.formDesignService.selectedFormDesignDetail$;
    this.search$ = this.formDesignService.search$;
    // keep track of all form fields
    // this.formDesignService.formDesignDetail$
    //   .pipe(
    //     takeUntil(this._unsubscribe$),
    //   )
    //   .subscribe(formDesignDetails => {
    //     this.formDesignDetails = formDesignDetails;
    //     console.log(this.formDesignDetails);
    //   });

    // keep track of which form field is selected
    // this.formDesignService.selectedFormDesignDetail$
    //   .pipe(takeUntil(this._unsubscribe$))
    //   .subscribe(selectedFormDesignDetail => {
    //     this.selectedFormDesignDetail = selectedFormDesignDetail;
    //   });

    // keep track search string
    // this.formDesignService.search$
    //   .pipe(takeUntil(this._unsubscribe$))
    //   .subscribe(searchStr => {
    //     this.searchStr = searchStr;
    //   });
  }

  onDrop(event: DndDropEvent) {
    
    switch (event.dropEffect) {
      case EffectAllowed.Copy:
        const fieldType: FieldType = event.data;
        this.formDesignService.addFormDesignDetail(fieldType, event.index);
        break;

      case EffectAllowed.Move:
        const formDesignDetail: FormDesignDetail = event.data;
        this.formDesignService.moveFormDesignDetail(formDesignDetail, event.index);
        break;

      default:
        break;
    }
  }

  onFormFocus() {
    this.formDesignService.setSelectedFormDesignDetail(null);
  }

  onFormDesignDetailFocus(formDesignDetail: FormDesignDetail) {
    this.resetSearch();
    this.formDesignService.setSelectedFormDesignDetail(formDesignDetail);
  }

  private resetSearch() {
    this.searchStr = null;
    this.formDesignService.searchField(null);
  }
  
  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
