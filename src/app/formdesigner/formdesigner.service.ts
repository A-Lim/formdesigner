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
        const formFieldID = this.getFormFields(true).length + 1;

        const newFormField = new FormField(formFieldID, fieldType.fieldTypeName + formFieldID, index + 1, fieldType, parentID, column);

        if (parentID != null && column != null) {
            allFormFields.forEach(function (formField) {
                if (formField.formFieldID === parentID)
                    formField.childFormFields.splice(index, 0, newFormField);
            });
        } else {
            allFormFields.splice(index, 0, newFormField);
        }
        
        const updatedFormFields = this.updateSeqNo(allFormFields);
        this._formFieldsSubject.next(updatedFormFields);

        // set newly added field as selected
        this.setSelectedFormField(newFormField.formFieldID, parentID);
    }

    setSelectedFormField(formFieldID: number, parentID?: number) {
        let searchFields = this.getFormFields();

        // if parentID is provided, search their childfields
        if (parentID != null) {
            const parentFormField = this.getFormFields().find(x => x.formFieldID === parentID);
            searchFields = parentFormField.childFormFields;
        }
        
        const selectedField = searchFields.find(x => x.formFieldID == formFieldID);
        this._selectedFormFieldSubject.next(selectedField);
    }

    moveField(formField: FormField, toIndex: number, parentID?: number, column?: number) {
        let allFormFields = this.getFormFields();

        // if (formField.parentID != null) {
        //     allFormFields = allFormFields.map(function (formField) {
        //         if (formField.formFieldID == parentID) {
        //             formField.childFormFields.forEach(function y)
        //         }
        //         return formField;
        //     });
        //     // const currentParentFormField = allFormFields.find(x => x.formFieldID === formField.parentID);
        //     // const currentChildFormField = 
        //     // allFormFields = parentFormField.childFormFields;
        // }

        // console.log(allFormFields);
        const fromIndex = allFormFields.findIndex(x => x.formFieldID === formField.formFieldID);
        if (fromIndex < toIndex) {
            toIndex -= 1;
        }
        console.log(fromIndex);
        console.log(toIndex);
        // console.log("----------ALL------------");
        // console.log(allFormFields);
        // console.log("MOVED");
        // console.log(formField);

        // allFormFields.map(function (cFormField) {
        //     if (cFormField.formFieldID === formField.formFieldID) {
        //         cFormField.parentID = parentID;
        //         cFormField.column = column;
        //     }
        //     return cFormField;
        // });
            
        const toBeMoved = allFormFields.find(x => x.formFieldID === formField.formFieldID);
        const remainingFormFields = allFormFields.filter(x => x.formFieldID !== formField.formFieldID);
        // console.log("----------------------");
        // console.log(...remainingFormFields.slice(0, toIndex));
        // console.log("----------------------");
        // console.log(toBeMoved);
        // console.log("----------------------");
        // console.log(...remainingFormFields.slice(toIndex));
        const movedFormFields = [
            ...remainingFormFields.slice(0, toIndex),
            toBeMoved,
            ...remainingFormFields.slice(toIndex)
        ];
        // console.log(movedFormFields);
        const sortedFormFields = this.updateSeqNo(movedFormFields);
        console.log(sortedFormFields);
        this._formFieldsSubject.next(sortedFormFields);
    }

    searchField(searchStr: string) {
        this._searchSubject.next(searchStr);
    }

    private updateSeqNo(formFields: FormField[]) {
        return formFields.map((x, xIndex) => {
            x.seqNo = xIndex + 1;
            if (x.childFormFields?.length > 0 && x.zoneProperties != null) {

                x.childFormFields = x.childFormFields
                    .sort((a,b) => a.column - b.column || a.seqNo - b.seqNo);

                for (let i = 1; i < x.zoneProperties.columns + 1; i++) {
                    x.childFormFields.filter(x => x.column === i)
                        .map((y, yIndex) => {
                            y.seqNo = yIndex + 1;
                            return y;
                        });
                }

                // x.childFormFields = x.childFormFields
                //     .sort((a,b) => a.column - b.column || a.seqNo - b.seqNo);
            }
            
            return x;
        });
        // return formFields.sort((a, b) => {
        //     return a.parentID - b.parentID || a.column - b.column ||  a.seqNo - b.seqNo;
        // });
        // add seqNo for non parented form fields
        // const nonParentedFormFields = formFields
        //     .filter(x => x.parentID == null)
        //     .map((x, index) => {
        //         x.seqNo = index + 1;
        //         return x;
        //     });
        
        // const parentedFormFields = formFields
        //     .filter(x => x.parentID != null)
        //     .sort((a, b) => {
        //         return a.parentID - b.parentID || a.column - b.column ||  a.seqNo - b.seqNo;
        //     });
        // return [...nonParentedFormFields, ...parentedFormFields];

        // return formFields;
    }
    
    // get current copy of subject values
    private getFormFields(flatten: boolean = false) {
        if (flatten) {
            let allFormFields = [...this._formFieldsSubject.getValue()];
            allFormFields.forEach(function (formField) {
                if (formField.childFormFields != null) {
                    formField.childFormFields.forEach(function (cFormField) {
                        allFormFields.push(cFormField);
                    });
                }
            });
            return allFormFields;
        }

        return [...this._formFieldsSubject.getValue()];
    }

    private getFieldTypes() {
        return [...this._fieldTypesSubject.getValue()];
    }
}