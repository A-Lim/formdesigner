import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormDesignerService } from '../formdesigner.service';
import { Subscription, Subject, Observable, iif } from 'rxjs';
import { FormDesignDetail, FieldType, FieldTypeID } from '../fieldtype.model';
import { takeUntil, debounceTime, distinctUntilChanged, debounce, skipUntil, skipWhile } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import ValidationUtil from '../validation.util';
@Component({
  selector: 'app-field-options-panel',
  templateUrl: './field-options-panel.component.html',
  styleUrls: ['./field-options-panel.component.css']
})
export class FieldOptionsPanelComponent implements OnInit, OnDestroy {
  public formDesignDetail: FormDesignDetail;
  // public selectedFormDesignDetail$: Observable<FormDesignDetail>;
  public updateFormDesignDetail = new Subject<FormDesignDetail>();

  public searchStr: string;
  public searchField = new Subject<string>();

  public formDesignDetailPropertiesForm: FormGroup;
  
  // public search$: Observable<string>;
  private _unsubscribe = new Subject<void>();

  constructor(private formDesignService: FormDesignerService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    
    this.initServiceObservables();
  }

  // save() {

  // }

  // updateFieldCode(formDesignDetail: FormDesignDetail, fieldCode: string) {
  //   if (!this.formDesignService.fieldCodeIsTaken(fieldCode))
  //     this.updateFormDesignDetail.next(formDesignDetail);
  // }

  // updateColumn(formDesignDetail: FormDesignDetail) {
  //   formDesignDetail.updateColumnCount();
  //   this.updateFormDesignDetail.next(formDesignDetail);
  // }

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

  // expose enum to be used in HTML
  get FieldTypeID() {
    return FieldTypeID;
  }

  get fddProperties() {
    return this.formDesignDetailPropertiesForm.controls;
  }
  
  private initServiceObservables() {
    // keep track of which form field is selected
    // this.selectedFormDesignDetail$ = this.formDesignService.selectedFormDesignDetail$;

    this.formDesignService.selectedFormDesignDetail$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(formDesignDetail => {
        if (formDesignDetail != null) {
          // assign
          this.formDesignDetail = formDesignDetail;
          // setup form
          this.setUpFormDesignDetailPropertiesForm();
          // populate form with model details
          this.formDesignDetailPropertiesForm.patchValue(this.formDesignDetail);
        }
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


    this.updateFormDesignDetail.pipe(
      // add delay
      debounceTime(400),
      // only emit if the current value is different than the last
      distinctUntilChanged(),
      // continue listening for changes until unsubscribe
      takeUntil(this._unsubscribe),
    ).subscribe(formDesignDetail => {
      this.formDesignService.updateFormDesignDetailProperties(formDesignDetail);
    });
  }

  private setUpFormDesignDetailPropertiesForm() {
    if (this.formDesignDetail == null)
      return;

    this.formDesignDetailPropertiesForm = this.formBuilder.group({
      // generic
      fieldCode: ['', [Validators.required]],
      label: ['', Validators.required],
      isRequired: [''],
      isHidden: [''],
      isDisabled: [''],
      // zone
      columns: ['', [
          Validators.min(1),
          ValidationUtil.requiredIfFieldTypeID(this.formDesignDetail.fieldType.fieldTypeID, FieldTypeID.Zone), 
        ]
      ],
      // multiple-select, dropdown, radiobutton, checkbox
      optionType: ['', [ 
          Validators.required,
          ValidationUtil.requiredIfFieldTypeID(
            this.formDesignDetail.fieldType.fieldTypeID, 
            [FieldTypeID.MultipleSelect, FieldTypeID.Dropdown, FieldTypeID.RadioButton, FieldTypeID.Checkbox]
          ),
        ]
      ],
      // number / currency
      regex: ['', [
          Validators.required,
          ValidationUtil.requiredIfFieldTypeID(this.formDesignDetail.fieldType.fieldTypeID, FieldTypeID.TextBoxNum)
        ]
      ],
      // userProfile
      userProfileField: ['', [
          Validators.required,
          ValidationUtil.requiredIfFieldTypeID(this.formDesignDetail.fieldType.fieldTypeID, FieldTypeID.UserProfile)
        ]
      ],
      // workflow stage
      workflow: ['', [
          Validators.required,
          ValidationUtil.requiredIfFieldTypeID(this.formDesignDetail.fieldType.fieldTypeID, FieldTypeID.WorkflowStage)
        ]
      ],
      workflowStage: ['', [
          Validators.required,
          ValidationUtil.requiredIfFieldTypeID(this.formDesignDetail.fieldType.fieldTypeID, FieldTypeID.WorkflowStage)
        ]
      ],
      stageProperty: ['', [
          Validators.required,
          ValidationUtil.requiredIfFieldTypeID(this.formDesignDetail.fieldType.fieldTypeID, FieldTypeID.WorkflowStage)
        ]
      ],
      // table
      tableRowNumber: [''],
      tableWidthType: ['', [
          Validators.required,
          ValidationUtil.requiredIfFieldTypeID(this.formDesignDetail.fieldType.fieldTypeID, FieldTypeID.Table)
        ]
      ],
      // systemfield
      systemProperty: [''],
      // calendar
      calendarFormat: ['', [
          Validators.required,
          ValidationUtil.requiredIfFieldTypeID(this.formDesignDetail.fieldType.fieldTypeID, FieldTypeID.Calendar)
        ]
      ],
      // lookuptype:
      lookupType: ['', [
          Validators.required,
          ValidationUtil.requiredIfFieldTypeID(this.formDesignDetail.fieldType.fieldTypeID, FieldTypeID.LookUp)
        ]
      ],
    });

    this.formDesignDetailPropertiesForm.valueChanges
      .pipe(
        // add delay
        debounceTime(400),
        // if form is valid
        // skipWhile(x => this.formDesignDetailPropertiesForm.valid),
        // only emit if the current value is different than the last
        distinctUntilChanged(),
        // continue listening for changes until unsubscribe
        takeUntil(this._unsubscribe),
      )
      .subscribe(data => {
        Object.keys(this.formDesignDetailPropertiesForm.controls).forEach(key => {

          const controlErrors = this.formDesignDetailPropertiesForm.get(key).errors;
          if (controlErrors != null) {
                Object.keys(controlErrors).forEach(keyError => {
                  console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                });
              }
            });


        console.log(this.formDesignDetailPropertiesForm.errors);
        console.log(this.formDesignDetailPropertiesForm.valid);
      });
  }

  private initFormPropertiesForm() {

  }


  // TODO move to Validation class
  // validate required if currentFieldTypeID is same as the fieldTypeID specified
  requiredIfFieldTypeID(formControl: FormControl, currentFieldTypeID: number, fieldTypeIDs: FieldTypeID | FieldTypeID[]): any {
    return (formGroup: FormGroup) => {
      // const control = formGroup.controls[controlName];

      // if control is empty
      // and currentFieldTypeID and specified fieldTypeID matched
      let conditionsMatch = false;
      if (fieldTypeIDs instanceof Array)
        conditionsMatch = fieldTypeIDs.includes(currentFieldTypeID);
      else 
        conditionsMatch = currentFieldTypeID === fieldTypeIDs

      if (formControl.value && conditionsMatch)
        formControl.setErrors({ requiredIf: true });

      formControl.setErrors(null);
    };
  }
}
