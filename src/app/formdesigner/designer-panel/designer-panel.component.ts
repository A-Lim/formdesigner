import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormDesignerService } from '../formdesigner.service';

import { DndDropEvent } from 'ngx-drag-drop';
import { FormField, EffectAllowed } from '../fieldtype.model';
import { Subscription, Observable, Subject } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-designer-panel',
  templateUrl: './designer-panel.component.html',
  styleUrls: ['./designer-panel.component.css']
})
export class DesignerPanelComponent implements OnInit, OnDestroy {
  // public formFields$: Observable<FormField[]>;
  public parentFormFields: FormField[];
  public searchFormField$: Observable<string>;

  public searchStr: string;
  public selectedFormField: FormField;

  private _unsubscribe$ = new Subject<void>();

  constructor(private formDesignService: FormDesignerService) { }

  ngOnInit() {
    this.formDesignService.retrieveFormFields();
    
    // keep track of all form fields
    this.formDesignService.formFields$
      .pipe(
        takeUntil(this._unsubscribe$),
        // only get non-parent form fields
        map(x => x.filter(y => y.parentID == null))
      )
      .subscribe(formFields => {
        this.parentFormFields = formFields;
      });

    // keep track of which form field is selected
    this.formDesignService.selectedFormField$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(formField => {
        this.selectedFormField = formField;
      });

    // keep track search string
    this.formDesignService.search$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(searchStr => {
        this.searchStr = searchStr;
      });
  }

  // onDraggableMoved(event) {
  //   // console.log(event);
  // }

  // onDragStart(formFieldID: number, event: DragEvent) {
  //   this.formDesignService.onDragStart(formFieldID);
  // }

  // onDragCanceled(event: DragEvent) {
  //   this.formDesignService.onDragCanceled();
  // }

  // onDragEnd() {

  // }

  onDrop(event: DndDropEvent) {
    switch (event.dropEffect) {
      case EffectAllowed.Copy:
        this.formDesignService.addField(event.data, event.index);
        break;

      case EffectAllowed.Move:
        this.formDesignService.moveField(event.data, event.index);
        break;

      default:
        break;
    }
  }

  onFormFocus() {
    this.formDesignService.setSelectedFormField(null);
  }

  onFormFieldFocus(formFieldID: number) {
    this.resetSearch();
    this.formDesignService.setSelectedFormField(formFieldID);
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
