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

    addField(fieldTypeID: number, index: number, parentID?: number, column?: number) {
        const fieldType = this._fieldTypesSubject.getValue().find(x => x.fieldTypeID === fieldTypeID);

        const currentFormFields = this._formFieldsSubject.getValue();
        const formFieldID = currentFormFields !== null ? currentFormFields.length + 1 : 1;

        if (fieldType !== null) {
            const formField = new FormField(formFieldID, fieldType.fieldTypeName + formFieldID, index + 1, fieldType, parentID, column);
            this._formFieldsSubject.getValue().splice(index, 0, formField);

            // set newly added field as selected
            this.setSelectedFormField(formField.formFieldID);
        }
        
        this._formFieldsSubject.next(this.getFormFields());
    }

    setSelectedFormField(formFieldID: number) {
        const selectedField = this.getFormFields().find(x => x.formFieldID == formFieldID);
        this._selectedFormFieldSubject.next(selectedField);
    }

    moveField(formFieldID: number, toIndex: number, parentID?: number, column?: number) {
        let allFormFields = this.getFormFields();
        const toBeMoved = allFormFields.find(x => x.formFieldID === formFieldID);
        const remainingFormFields = allFormFields.filter(x => x.formFieldID !== formFieldID);

        const reorderedItems = [
            ...remainingFormFields.slice(0, toIndex),
            toBeMoved,
            ...remainingFormFields.slice(toIndex)
        ].map((formField, index) => {
            formField.seqNo = index + 1;
            return formField
        });
        this._formFieldsSubject.next(reorderedItems);
    }

    searchField(searchStr: string) {
        this._searchSubject.next(searchStr);
    }
    
    // when calling subject.next()
    // always return from getFormFields or getFieldTypes
    // if not will return a direct reference
    private getFormFields() {
        return [...this._formFieldsSubject.getValue()];
    }

    private getFieldTypes() {
        return [...this._fieldTypesSubject.getValue()];
    }
}