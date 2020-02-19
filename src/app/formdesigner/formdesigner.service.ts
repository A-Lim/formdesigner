import { Injectable } from '@angular/core';
import { FieldType, FieldTypeCategory, FormField } from './fieldtype.model';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FormDesignerService {
    private _fieldTypes$ = new BehaviorSubject<FieldType[]>(null);
    private _formFields$ = new BehaviorSubject<FormField[]>(null);

    public readonly fieldTypes$: Observable<FieldType[]> = this._fieldTypes$.asObservable();
    public readonly formFields$: Observable<FormField[]> = this._formFields$.asObservable();

    retrieveFieldTypes() {
        // call http request
        const fieldTypes = [
            { fieldTypeID: 1, fieldTypeName: "Heading", fieldTypeCategory: FieldTypeCategory.Layout, label: "Heading", seqNo: 1 } as FieldType,
            { fieldTypeID: 2, fieldTypeName: "Textbox", fieldTypeCategory: FieldTypeCategory.Item, label: "Textbox", seqNo: 2 } as FieldType,
            { fieldTypeID: 3, fieldTypeName: "TextArea", fieldTypeCategory: FieldTypeCategory.Item, label: "Textare", seqNo: 3 } as FieldType
        ];

        this._fieldTypes$.next(fieldTypes);
    }

    retrieveFormFields() {
        const currentFormFields = this._formFields$.getValue();
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

        this._formFields$.next(formfields);
    }

    getFieldTypes(): Observable<FieldType[]> {
        return this._fieldTypes$.asObservable();
    }

    getFormFields(): Observable<FormField[]> {
        return this._formFields$.asObservable();
    }

    addField(fieldTypeID: number, index: number) {
        const fieldType = this._fieldTypes$.getValue().find(x => x.fieldTypeID === fieldTypeID);
        if (fieldType !== null) {
            const formField = { formFieldID: 1, fieldType: fieldType } as FormField;
            this._formFields$.getValue().splice(index, 0, formField);
        }

        // this._formFields$.next(this._formFields$.getValue());
    }

    removeField(id: number) {

    }

    moveField(formFieldID: number, moveTo: number) {
        // this._formFields.splice(moveTo + 1, 0, this._formFields.splice(moveTo, 1)[0]);
        // this.formFields$.next(this.formFields);
    }
}