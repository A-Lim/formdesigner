import { Injectable } from '@angular/core';
import { FieldType, FieldTypeCategory, FormField } from './fieldtype.model';
import { Subject, Observable, BehaviorSubject, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FormDesignerService {
    private _fieldTypesSubject = new BehaviorSubject<FieldType[]>(null);
    private _formFieldsSubject = new BehaviorSubject<FormField[]>(null);
    private _selectedFormFieldSubject = new BehaviorSubject<FormField>(null);

    public readonly fieldTypes$: Observable<FieldType[]>;
    public readonly formFields$: Observable<FormField[]>;
    public readonly selectedFormField$: Observable<FormField>;

    constructor() {
        this.fieldTypes$ = this._fieldTypesSubject.asObservable();
        this.formFields$ = this._formFieldsSubject.asObservable();
        this.selectedFormField$ = this._selectedFormFieldSubject.asObservable();
    }

    retrieveFieldTypes() {
        // call http request
        const fieldTypes = [
            { fieldTypeID: 1, fieldTypeName: "Heading", fieldTypeCategory: FieldTypeCategory.Layout, label: "Heading", seqNo: 1 } as FieldType,
            { fieldTypeID: 2, fieldTypeName: "Textbox", fieldTypeCategory: FieldTypeCategory.Item, label: "Textbox", seqNo: 2 } as FieldType,
            { fieldTypeID: 3, fieldTypeName: "TextArea", fieldTypeCategory: FieldTypeCategory.Item, label: "Textare", seqNo: 3 } as FieldType
        ];

        this._fieldTypesSubject.next(fieldTypes);
    }

    retrieveFormFields() {
        const currentFormFields = this._formFieldsSubject.getValue();
        const formFieldID = currentFormFields !== null ? currentFormFields.length + 1 : 1;
        // call http request
        const formfields = [
            { 
                formFieldID: formFieldID,
                fieldType: { 
                    fieldTypeID: 1, 
                    fieldTypeName: "Heading", 
                    fieldTypeCategory: FieldTypeCategory.Layout, 
                    label: "Heading", seqNo: 1 
                } as FieldType 
            } as FormField,
        ];

        this._formFieldsSubject.next(formfields);
    }

    addField(fieldTypeID: number, index: number) {
        const fieldType = this._fieldTypesSubject.getValue().find(x => x.fieldTypeID === fieldTypeID);

        const currentFormFields = this._formFieldsSubject.getValue();
        const formFieldID = currentFormFields !== null ? currentFormFields.length + 1 : 1;

        if (fieldType !== null) {
            const formField = { formFieldID: formFieldID, fieldType: fieldType } as FormField;
            this._formFieldsSubject.getValue().splice(index, 0, formField);
        }

        this._formFieldsSubject.next(this.getFormFields());
    }

    removeField(id: number) {

    }

    setSelectedFormField(formFieldID: number) {
        const selectedField = this.getFormFields().find(x => x.formFieldID == formFieldID);
        this._selectedFormFieldSubject.next(selectedField);
    }

    moveField(formFieldID: number, toIndex: number) {
        const allFormFields = this.getFormFields();
        const toBeMoved = allFormFields.find(x => x.formFieldID == formFieldID);
        const fromIndex = allFormFields.indexOf(toBeMoved);

        // no change in position causing sequence will still be the same
        if (fromIndex + 1 === toIndex || fromIndex === toIndex) {
            return;
        }

        allFormFields.splice(fromIndex, 1);
        allFormFields.splice(toIndex, 0, toBeMoved);

        this._formFieldsSubject.next(allFormFields);
    }

    private getFormFields() {
        return [...this._formFieldsSubject.getValue()];
    }

    private getFieldTypes() {
        return [...this._fieldTypesSubject.getValue()];
    }
}