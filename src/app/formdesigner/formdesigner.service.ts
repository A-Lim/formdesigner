import { Injectable } from '@angular/core';
import { FieldType, FieldTypeCategory, FormDesignDetail } from './fieldtype.model';
import { Subject, Observable, BehaviorSubject, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FormDesignerService {
    private _fieldTypesSubject = new BehaviorSubject<FieldType[]>(null);
    private _formDesignDetailsSubject = new BehaviorSubject<FormDesignDetail[]>(null);

    private _selectedFormDesignDetailSubject = new BehaviorSubject<FormDesignDetail>(null);
    private _searchSubject = new Subject<string>();

    public readonly fieldTypes$: Observable<FieldType[]>;
    public readonly formDesignDetail$: Observable<FormDesignDetail[]>;
    public readonly selectedFormDesignDetail$: Observable<FormDesignDetail>;
    public readonly search$: Observable<string>;

    constructor() {
        this.fieldTypes$ = this._fieldTypesSubject.asObservable();
        this.formDesignDetail$ = this._formDesignDetailsSubject.asObservable();
        this.selectedFormDesignDetail$ = this._selectedFormDesignDetailSubject.asObservable();
        this.search$ = this._searchSubject.asObservable();
    }

    retrieveFieldTypes(): void {
        // call http request
        const fieldTypes = [
            { fieldTypeID: 1, fieldTypeName: "Heading", fieldTypeCategory: FieldTypeCategory.Layout, label: "Heading", seqNo: 1 } as FieldType,
            { fieldTypeID: 2, fieldTypeName: "Textbox", fieldTypeCategory: FieldTypeCategory.Item, label: "Textbox", seqNo: 2 } as FieldType,
            { fieldTypeID: 3, fieldTypeName: "TextArea", fieldTypeCategory: FieldTypeCategory.Item, label: "Textarea", seqNo: 3 } as FieldType,
            { fieldTypeID: 4, fieldTypeName: "Zone", fieldTypeCategory: FieldTypeCategory.Layout, label: "Zone", seqNo: 4 } as FieldType
        ];

        this._fieldTypesSubject.next(fieldTypes);
    }

    retrieveFormDesignDetail(): void {
        // const currentFormFields = this._formFieldsSubject.getValue();
        // const formFieldID = currentFormFields !== null ? currentFormFields.length + 1 : 1;
        const headingFieldType = this._fieldTypesSubject.getValue()[0];
        const newFormField = new FormDesignDetail(1, headingFieldType, "Heading1");

        // call http request
        let formfields = [newFormField];

        // for (let i = 1; i < 1000; i++) {
        //     formfields.push(
        //         new FormDesignDetail(i+1, headingFieldType, "Heading"+(i+1))
        //     );
        // }
        this._formDesignDetailsSubject.next(formfields);
    }

    addFormDesignDetail(fieldType: FieldType, index: number, parentFieldCode?: string, column?: number): void {
        const allFormDesignDetails = this.getAllFormDesignDetails();
        const formDesignDetailID = this.getAllFormDesignDetails(true).length + 1;
        const newFieldCode = fieldType.label + formDesignDetailID;

        const newFormDesignDetail  = new FormDesignDetail(formDesignDetailID, fieldType, newFieldCode);

        if (parentFieldCode != null && column != null) {
            allFormDesignDetails.forEach(function (formDesignDetail) {
                if (formDesignDetail.fieldCode === parentFieldCode) {
                    formDesignDetail.addSubDesignDetails(newFormDesignDetail, index, column);
                }
                // if (formDesignDetail.form)
            });
            // allFormFields.forEach(function (formField) {
            //     if (formField.formFieldID === parentID)
            //         formField.addColumnFormField(newFormField, index, column);
            // });
        } else {
            allFormDesignDetails.splice(index, 0, newFormDesignDetail);
        }

        // const updatedFormFields = this.updateSeqNo(allFormFields);
        this._formDesignDetailsSubject.next(allFormDesignDetails);
        // set newly added field as selected
        this.setSelectedFormDesignDetail(newFormDesignDetail);
    }

    moveFormDesignDetail(formDesignDetail: FormDesignDetail, toIndex: number, parentFieldCode?: string, column?: number): void {
        let allFormDesignDetails = this.getAllFormDesignDetails();
        let fromIndex = null;

        // if (parentFieldCode == null) {
            fromIndex = allFormDesignDetails.findIndex(x => x.formDesignDetailID === formDesignDetail.formDesignDetailID);
            if (fromIndex < toIndex) {
                toIndex -= 1;
            }
        // } else {
        //     fromIndex
        // }

        
        
        // no change in position or sequence
        // exit
        // if (fromIndex === toIndex)
        //     return;


        const toBeMoved = formDesignDetail;
        debugger;
        allFormDesignDetails = this.removeFromList(allFormDesignDetails, toBeMoved.fieldCode);
        allFormDesignDetails = this.addToList(allFormDesignDetails, formDesignDetail, toIndex, parentFieldCode, column);
        debugger;
        // allFormDesignDetails.filter(function (formDesignDetail) {
        //     if (formDesignDetail.fieldCode !== toBeMoved.fieldCode) {
        //         return formDesignDetail;
        //     } else {

        //     }
        // });

        // for (let i = 0; i < allFormDesignDetails.length; i++) {
        //     if (allFormDesignDetails[i].fieldCode === toBeMoved.fieldCode) {
        //         allFormDesignDetails.splice(i, 1);
        //         console.log("BREAK");
        //         break;
        //     } else {
        //         console.log("0");
        //         if (allFormDesignDetails[i].subDesignDetails?.length > 0) {
        //             const columnData = allFormDesignDetails[i].subDesignDetails;
        //             console.log("1");
        //             for (let j = 0; j < columnData.length; j++) {
        //                 const subDesignDetails = columnData[j];
        //                 console.log(subDesignDetails);
        //                 for (let k = 0; k < subDesignDetails.length; k++) {
        //                     if (subDesignDetails[k].fieldCode === toBeMoved.fieldCode) {
        //                         console.log("OK");
        //                         // remove
        //                         allFormDesignDetails[i].subDesignDetails[j].splice(k, 1);
        //                         break;
        //                     }
        //                 }
        //             }

        //         }
        //     }
        // }

        // allFormDesignDetails.forEach(function (formDesignDetail, posIndex) {
        //     if (formDesignDetail.fieldCode === toBeMoved.fieldCode) {
                
        //     }
        // });

        // find where it is 
        // remove it 
        // add it to new position

        // if (parentFieldCode != null && column != null) {

        // }

        // const toBeMoved = allFormDesignDetails.find(x => x.formDesignDetailID === formDesignDetail.formDesignDetailID);
        // toBeMoved.seqNo = toIndex + 1;

        // const remainingFormFields = allFormDesignDetails.filter(x => x.formDesignDetailID !== formDesignDetail.formDesignDetailID);

        // const movedFormFields = [
        //     ...remainingFormFields.slice(0, toIndex),
        //     toBeMoved,
        //     ...remainingFormFields.slice(toIndex)
        // ];

        // const sortedFormFields = this.updateSeqNo(movedFormFields);
        this._formDesignDetailsSubject.next(allFormDesignDetails);
    }

    private addToList(formDesignDetails: FormDesignDetail[], newFormDesignDetail: FormDesignDetail, index: number, parentFieldCode?: string, column?: number) {
        if (parentFieldCode != null && column != null) {
            for (let i = 0; i < formDesignDetails.length; i++) {
                if (formDesignDetails[i].fieldCode === parentFieldCode) {
                    formDesignDetails[i].addSubDesignDetails(newFormDesignDetail, index, column);
                }
                break;
            }
        } else {
            formDesignDetails.splice(index, 0, newFormDesignDetail);
        }

        return formDesignDetails;
    }

    // remove formDesignDetail where fieldCode is found
    // will iterate into nested fields as well
    private removeFromList(formDesignDetails: FormDesignDetail[], fieldCode: string): FormDesignDetail[] {
        for (let i = 0; i < formDesignDetails.length; i++) {
            if (formDesignDetails[i].fieldCode === fieldCode) {
                formDesignDetails.splice(i, 1);
                // break for performance
                break;
            } else {
                if (formDesignDetails[i].subDesignDetails?.length > 0) {
                    const columnData = formDesignDetails[i].subDesignDetails;
                    for (let j = 0; j < columnData.length; j++) {
                        const subDesignDetails = columnData[j];
                        for (let k = 0; k < subDesignDetails.length; k++) {
                            if (subDesignDetails[k].fieldCode === fieldCode) {
                                // remove
                                formDesignDetails[i].subDesignDetails[j].splice(k, 1);
                                // break for performance
                                break;
                            }
                        }
                    }

                }
            }
        }

        return formDesignDetails;
    }

    setSelectedFormDesignDetail(formDesignDetail: FormDesignDetail): void {
        this._selectedFormDesignDetailSubject.next(formDesignDetail);
    }
    

    // moveField(formField: FormField, toIndex: number, parentID?: number, column?: number): void {
    //     if (parentID != null && column != null) {
    //         this.moveParented(formField, toIndex, parentID, column);
    //     } else {
    //         this.moveNonParented(formField, toIndex);
    //     }
    // }

    // private moveNonParented(formField: FormField, toIndex: number) {
    //     let allFormFields: FormField[] = this.getFormFields();

    //     const fromIndex = allFormFields.findIndex(x => x.formFieldID === formField.formFieldID);
    //     if (fromIndex < toIndex) {
    //         toIndex -= 1;
    //     }

    //     const toBeMoved = allFormFields.find(x => x.formFieldID === formField.formFieldID);
    //     toBeMoved.seqNo = toIndex + 1;

    //     const remainingFormFields = allFormFields.filter(x => x.formFieldID !== formField.formFieldID);

    //     const movedFormFields = [
    //         ...remainingFormFields.slice(0, toIndex),
    //         toBeMoved,
    //         ...remainingFormFields.slice(toIndex)
    //     ];

    //     const sortedFormFields = this.updateSeqNo(movedFormFields);
    //     console.log(sortedFormFields);
    //     this._formFieldsSubject.next(sortedFormFields);
    // }

    // private moveParented(formField: FormField, toIndex: number, parentID: number, column: number) {
    //     const allFormFields: FormField[] = this.getFormFields();
    //     // move within same parent and same column

    //     allFormFields.forEach(function (formField) {
    //     });


    //     // if (formField.parentID === parentID && formField.column === column) {
    //     //     const parentFormField = allFormFields.find(x => x.formFieldID === parentID);
    //     //     const parentIndex = allFormFields.indexOf(parentFormField);
    //     //     const toBeMoved = parentFormField.columns[column].formFields.find(x => x.formFieldID === formField.formFieldID);
    //     //     const remainingFormFields = parentFormField.columns[column].formFields.filter(x => x.formFieldID !== formField.formFieldID);

    //     //     const movedChildColFormFields = [
    //     //         ...remainingFormFields.slice(0, toIndex),
    //     //         toBeMoved,
    //     //         ...remainingFormFields.slice(toIndex)
    //     //     ].map((x, xIndex) => {
    //     //         x.seqNo = xIndex + 1;
    //     //         return x;
    //     //     });

    //     //     allFormFields[parentIndex].columns[column].formFields = movedChildColFormFields;
    //     // }
    // }

    // private moveChild(formField: FormField, toIndex: number, parentID: number, column: number) {
        // const allFormFields = this.getFormFields();
        // const oldParentIndex = allFormFields.findIndex(x => x.formFieldID === formField.parentID);
        // const newParentIndex = allFormFields.findIndex(x => x.formFieldID === parentID);

        // // if change parent 
        // if (formField.parentID !== parentID) {
        //     // remove from parent
        //     const childFormFields = allFormFields[oldParentIndex].childFormFields;
        //     allFormFields[oldParentIndex].childFormFields = childFormFields.filter(x => x.formFieldID !== formField.formFieldID);

        //     // add to new parent
        //     allFormFields[newParentIndex].childFormFields.
        // }


        // formField.parentID = parentID;
        // formField.column = column;


        // const allFormFields = this.getFormFields();

        // allFormFields.forEach(function (formField) {
        //     if (formField.formFieldID === parentID) {
        //         // const columnChildFormField = formField.childFormFields.filter(x => x.column === column);

        //     }
        // });
        

        // let childFormFields = this.getFormFields().filter(x => x.formFieldID === formField.parentID);
        
        // const fromIndex = childFormFields.findIndex(x => x.formFieldID === formField.formFieldID);
        // if (fromIndex < toIndex) {
        //     toIndex -= 1;
        // }

        // const toBeMoved = childFormFields.find(x => x.formFieldID === formField.formFieldID);
        // toBeMoved.seqNo = toIndex + 1;

        // const remainingFormFields = childFormFields.filter(x => x.formFieldID !== formField.formFieldID);

        // const movedFormFields = [
        //     ...remainingFormFields.slice(0, toIndex),
        //     toBeMoved,
        //     ...remainingFormFields.slice(toIndex)
        // ];

        // const sortedFormFields = this.updateSeqNo(movedFormFields);
        // this._formFieldsSubject.next(sortedFormFields);
    // }

    searchField(searchStr: string): void {
        this._searchSubject.next(searchStr);
    }

    private updateSeqNo(formDesignDetails: FormDesignDetail[], parentID?: number): FormDesignDetail[] {
        // return formFields
        //     .sort((a,b) => { return a.parentID - b.parentID || a.column - b.column || a.seqNo - b.seqNo })
        //     .map((x, index) => { x.seqNo = index + 1; return x; });
        return formDesignDetails.map((x, xIndex) => {
            x.seqNo = xIndex + 1;
            // if (x.columns?.length > 0 && x.zoneProperties != null) {    
            //     x.columns.map(function (column) {
            //         column.formFields.map(function (colFormField, colIndex) {
            //             colFormField.seqNo = colIndex + 1;
            //             return colFormField;
            //         })
            //     });
            //     // x.childFormFields = x.childFormFields
            //     //     .sort((a,b) => a.column - b.column || a.seqNo - b.seqNo);

            //     // for (let i = 1; i < x.zoneProperties.columns + 1; i++) {
            //     //     x.childFormFields.filter(x => x.column === i)
            //     //         .map((y, yIndex) => {
            //     //             y.seqNo = yIndex + 1;
            //     //             return y;
            //     //         });
            //     // }

            //     // x.childFormFields = x.childFormFields
            //     //     .sort((a,b) => a.column - b.column || a.seqNo - b.seqNo);
            // }
            
            return x;
        }).sort((a,b) => a.seqNo - b.seqNo);
    }
    
    // get current copy of subject values
    private getAllFormDesignDetails(flatten: boolean = false) {
        if (flatten) {
            let allFormDesignDetails = [...this._formDesignDetailsSubject.getValue()];
            allFormDesignDetails.forEach(function (formField) {
                if (formField.subDesignDetails != null) {
                    formField.subDesignDetails.forEach(function (subDesignDetail) {
                        allFormDesignDetails.push(...subDesignDetail);
                    });
                }
            });
            return allFormDesignDetails;
        }

        return [...this._formDesignDetailsSubject.getValue()];
    }

    private getFieldTypes() {
        return [...this._fieldTypesSubject.getValue()];
    }
}