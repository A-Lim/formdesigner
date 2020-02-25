import { Component, OnInit, Input } from '@angular/core';
import { FormDesignDetail, FieldType, EffectAllowed } from '../../fieldtype.model';
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
  public formDesignDetail: FormDesignDetail;
  // used to loops
  public arr: Array<number>;

  public searchStr: string;
  public selectedFormDesignDetail: FormDesignDetail;
  public horizontal = true;

  private _unsubscribe$ = new Subject<void>();

  // fields allowed in zone
  public allowedFieldTypes = [1,2,3];

  constructor(private formDesignService: FormDesignerService) {

  }

  ngOnInit() {
    // keep track of all form fields
    // this.formDesignService.formFields$
    //   .pipe(
    //     takeUntil(this._unsubscribe$),
    //     // only child field
    //     map(x => x.filter(y => y.parentID == this.formField.formFieldID))
    //   )
    //   .subscribe(formFields => {
    //     this.formFields = formFields;
    //     // console.log(formFields);
    //   });


    // keep track of which form field is selected
    this.formDesignService.selectedFormDesignDetail$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(formDesignDetail => {
        this.selectedFormDesignDetail = formDesignDetail;
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
        const fieldType: FieldType = event.data;
        // if type is allowed
        if (this.allowedFieldTypes.includes(fieldType.fieldTypeID)) {
          this.formDesignService.addFormDesignDetail(fieldType, event.index, this.formDesignDetail.fieldCode, column);
        } else {
          // prompt error
        }
        
        break;

      case EffectAllowed.Move:
        const formDesignDetail: FormDesignDetail = event.data;
        if (this.allowedFieldTypes.includes(formDesignDetail.fieldType.fieldTypeID)) {
          this.formDesignService.moveFormDesignDetail(formDesignDetail, event.index, this.formDesignDetail.fieldCode, column);
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
    // this.formDesignService.setSelectedFormField(null);
  }

  onFormDesignDetailFocus(formDesignDetail: FormDesignDetail, event: MouseEvent) {
    // to prevent triggering parent click event
    event.stopPropagation();
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
