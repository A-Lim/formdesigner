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
        const currentFormFields = this._formFieldsSubject.getValue();
        const formFieldID = currentFormFields !== null ? currentFormFields.length + 1 : 1;
        // call http request
        const formfields = [
            new FormField(
                formFieldID,
                "Heading1",
                { 
                    fieldTypeID: 1, 
                    fieldTypeName: "Heading", 
                    fieldTypeCategory: FieldTypeCategory.Layout, 
                    label: "Heading", seqNo: 1 
                } as FieldType 
            )
        ];

        this._formFieldsSubject.next(formfields);
    }

    addField(fieldTypeID: number, index: number, parentID?: number, column?: number) {
        const fieldType = this._fieldTypesSubject.getValue().find(x => x.fieldTypeID === fieldTypeID);

        const currentFormFields = this._formFieldsSubject.getValue();
        const formFieldID = currentFormFields !== null ? currentFormFields.length + 1 : 1;

        if (fieldType !== null) {
            const formField = new FormField(formFieldID, fieldType.fieldTypeName + formFieldID, fieldType, parentID, column);
            this._formFieldsSubject.getValue().splice(index, 0, formField);

            console.log(formField);
        }
        
        this._formFieldsSubject.next(this.getFormFields());
    }

    removeField(id: number) {

    }

    setSelectedFormField(formFieldID: number) {
        const selectedField = this.getFormFields().find(x => x.formFieldID == formFieldID);
        this._selectedFormFieldSubject.next(selectedField);
    }

    moveField(formFieldID: number, toIndex: number, parentID?: number, column?: number) {
        let allFormFields = this.getFormFields();

        if (parentID != null && column != null) {
            // get destination formfieldID
            // const destFormField = allFormFields[toIndex];

            allFormFields = allFormFields.filter(x => x.parentID === parentID && x.column === column);
            
            // get destination index after filter
            // toIndex = allFormFields.findIndex(x => x.formFieldID == destFormField.formFieldID);
        }

        const toBeMoved = allFormFields.find(x => x.formFieldID == formFieldID);
        const fromIndex = allFormFields.indexOf(toBeMoved);

        console.log(fromIndex);
        console.log(toIndex);

        // no change in position causing sequence will still be the same
        if (fromIndex + 1 === toIndex || fromIndex === toIndex) {
            return;
        }

        allFormFields.splice(fromIndex, 1);
        allFormFields.splice(toIndex, 0, toBeMoved);

        this._formFieldsSubject.next(allFormFields);
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