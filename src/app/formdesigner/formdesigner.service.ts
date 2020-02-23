import { Injectable } from '@angular/core';
import { FieldType, FieldTypeCategory, FormField } from './fieldtype.model';
import { Subject, Observable, BehaviorSubject, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FormDesignerService {
    private _fieldTypesSubject = new BehaviorSubject<FieldType[]>(null);
    private _formFieldsSubject = new BehaviorSubject<FormField[]>(null);

    private _selectedFormFieldSubject = new BehaviorSubject<FormField>(null);
    private _searchSubject = new Subject<string>();

    public readonly fieldTypes$: Observable<FieldType[]>;
    public readonly formFields$: Observable<FormField[]>;
    public readonly selectedFormField$: Observable<FormField>;
    public readonly search$: Observable<string>;

    constructor() {
        this.fieldTypes$ = this._fieldTypesSubject.asObservable();
        this.formFields$ = this._formFieldsSubject.asObservable();
        this.selectedFormField$ = this._selectedFormFieldSubject.asObservable();
        this.search$ = this._searchSubject.asObservable();
    }

    retrieveFieldTypes() {
        // call http request
        const fieldTypes = [
            { fieldTypeID: 1, fieldTypeName: "Heading", fieldTypeCategory: FieldTypeCategory.Layout, label: "Heading", seqNo: 1 } as FieldType,
            { fieldTypeID: 2, fieldTypeName: "Textbox", fieldTypeCategory: FieldTypeCategory.Item, label: "Textbox", seqNo: 2 } as FieldType,
            { fieldTypeID: 3, fieldTypeName: "TextArea", fieldTypeCategory: FieldTypeCategory.Item, label: "Textarea", seqNo: 3 } as FieldType,
            { fieldTypeID: 4, fieldTypeName: "Zone", fieldTypeCategory: FieldTypeCategory.Layout, label: "Zone", seqNo: 4 } as FieldType
        ];

        this._fieldTypesSubject.next(fieldTypes);
    }

    retrieveFormFields() {
        // const currentFormFields = this._formFieldsSubject.getValue();
        // const formFieldID = currentFormFields !== null ? currentFormFields.length + 1 : 1;

        const newFormField = new FormField(
            1, "Heading1", 1,
            { 
                fieldTypeID: 1, 
                fieldTypeName: "Heading", 
                fieldTypeCategory: FieldTypeCategory.Layout, 
                label: "Heading", seqNo: 1 
            } as FieldType
        );

        // call http request
        let formfields = [newFormField];

        // for (let i = 1; i < 1000; i++) {
        //     formfields.push(
        //         new FormField(
        //             i+1,
        //             "Heading"+(i+1),
        //             i+1,
        //             { 
        //                 fieldTypeID: 1, 
        //                 fieldTypeName: "Heading", 
        //                 fieldTypeCategory: FieldTypeCategory.Layout, 
        //                 label: "Heading", seqNo: 1 
        //             } as FieldType
        //         )
        //     );
        // }
        this._formFieldsSubject.next(formfields);
    }

    addField(fieldType: FieldType, index: number, parentID?: number, column?: number) {
        const allFormFields = this.getFormFields();
        const formFieldID = allFormFields !== null ? allFormFields.length + 1 : 1;

        const formField = new FormField(formFieldID, fieldType.fieldTypeName + formFieldID, index + 1, fieldType, parentID, column);
        allFormFields.splice(index, 0, formField);

        const sortedFormFields = this.sortFormFields(allFormFields);
        this._formFieldsSubject.next(sortedFormFields);

        // set newly added field as selected
        this.setSelectedFormField(formField.formFieldID);
    }

    setSelectedFormField(formFieldID: number) {
        const selectedField = this.getFormFields().find(x => x.formFieldID == formFieldID);
        this._selectedFormFieldSubject.next(selectedField);
    }

    moveField(formField: FormField, toIndex: number, parentID?: number, column?: number) {
        const allFormFields = this.getFormFields();

        allFormFields.map(function (cFormField) {
            if (cFormField.formFieldID === formField.formFieldID) {
                cFormField.parentID = parentID;
                cFormField.column = column;
            }
            return cFormField;
        });
            
        const toBeMoved = allFormFields.find(x => x.formFieldID === formField.formFieldID);
        const remainingFormFields = allFormFields.filter(x => x.formFieldID !== formField.formFieldID);
        
        const newlyAddedFormFields = [
            ...remainingFormFields.slice(0, toIndex),
            toBeMoved,
            ...remainingFormFields.slice(toIndex)
        ];

        const sortedFormFields = this.sortFormFields(newlyAddedFormFields);
        this._formFieldsSubject.next(sortedFormFields);
    }

    searchField(searchStr: string) {
        this._searchSubject.next(searchStr);
    }

    private sortFormFields(formFields: FormField[]) {
        // add seqNo for non parented form fields
        const nonParentedFormFields = formFields
            .filter(x => x.parentID == null)
            .map((x, index) => {
                x.seqNo = index + 1;
                return x;
            });
        
        const parentedFormFields = formFields
            .filter(x => x.parentID != null)
            .sort((a, b) => {
                return a.parentID - b.parentID || a.column - b.column ||  a.seqNo - b.seqNo;
            });

        return [...nonParentedFormFields, ...parentedFormFields];
    }
    
    // get current copy of subject values
    private getFormFields() {
        return [...this._formFieldsSubject.getValue()];
    }

    private getFieldTypes() {
        return [...this._fieldTypesSubject.getValue()];
    }
}