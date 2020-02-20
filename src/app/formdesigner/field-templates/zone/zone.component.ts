import { Component, OnInit, Input } from '@angular/core';
import { FormField, FieldType, EffectAllowed } from '../../fieldtype.model';
import { DndDropEvent } from 'ngx-drag-drop';
import { Observable, Subject } from 'rxjs';
import { FormDesignerService } from '../../formdesigner.service';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.css']
})
export class ZoneComponent implements OnInit {
  @Input()
  public formField: FormField;
  // used to loops
  public arr: Array<number>;

  // public formFields$: Observable<FormField[]>;
  public formFields: FormField[];
  public searchStr: string;
  public selectedFormField: FormField;

  private _unsubscribe$ = new Subject<void>();

  // fields allowed in zone
  public allowedFieldTypes = [1,2,3];

  constructor(private formDesignService: FormDesignerService) {

  }

  ngOnInit() {
    // keep track of all form fields
    this.formDesignService.formFields$
      .pipe(
        takeUntil(this._unsubscribe$),
        // only child field
        map(x => x.filter(y => y.parentID == this.formField.formFieldID))
      )
      .subscribe(formFields => {
        this.formFields = formFields;
      });


    // keep track of which form field is selected
    this.formDesignService.selectedFormField$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(formField => {
        this.selectedFormField = formField;
      });

    this.formDesignService.search$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(searchStr => {
        this.searchStr = searchStr;
      });
  }

  onDrop(event: DndDropEvent, column: number) {
    switch (event.dropEffect) {
      case EffectAllowed.Copy:
        if (this.allowedFieldTypes.includes(event.data)) {
          this.formDesignService.addField(event.data, event.index, this.formField.formFieldID, column);
        } else {
          // prompt error
        }
        
        break;

      case EffectAllowed.Move:
        if (this.allowedFieldTypes.includes(event.data)) {
          this.formDesignService.moveField(event.data, event.index, this.formField.formFieldID, column);
        } else {
          // prompt error
        }
        // this.formDesignService.moveField(event.data, event.index);
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
