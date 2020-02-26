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
            { fieldTypeID: 4, fieldTypeName: "Zone", fieldTypeCategory: FieldTypeCategory.Layout, label: "Zone", seqNo: 4 } as FieldType,
            { fieldTypeID: 5, fieldTypeName: "Table", fieldTypeCategory: FieldTypeCategory.Layout, label: "Table", seqNo: 5 } as FieldType
        ];

        this._fieldTypesSubject.next(fieldTypes);
    }

    retrieveFormDesignDetail(): void {
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

    addFormDesignDetail(fieldType: FieldType, index: number, parentFieldCode?: string, columnIndex?: number): void {
        const allFormDesignDetails = this.getAllFormDesignDetails();
        const formDesignDetailID = this.getAllFormDesignDetails(true).length + 1;
        const newFieldCode = fieldType.label + formDesignDetailID;
        const newFormDesignDetail  = new FormDesignDetail(formDesignDetailID, fieldType, newFieldCode, parentFieldCode, columnIndex);
        // add newFormDesignDetail to list
        const updatedFormDesignDetails = this.addToList(allFormDesignDetails, newFormDesignDetail, index, parentFieldCode, columnIndex);

        const sortedFormDesignDetails = this.updateSeqNo(updatedFormDesignDetails);
        this._formDesignDetailsSubject.next(sortedFormDesignDetails);
        // set newly added field as selected
        this.setSelectedFormDesignDetail(newFormDesignDetail);
    }

    moveFormDesignDetail(formDesignDetail: FormDesignDetail, toIndex: number, parentFieldCode?: string, columnIndex?: number): void {
        let allFormDesignDetails = this.getAllFormDesignDetails();
        let fromIndex = null;

        // if moving within the same parent and column
        // check fromIndex
        if (formDesignDetail.parentFieldCode === parentFieldCode && 
            formDesignDetail.columnNo-1 === columnIndex) {

            fromIndex = this.findFormDesignDetailIndex(formDesignDetail);
            if (fromIndex < toIndex) 
                toIndex -= 1;
        }

        const toBeMoved = formDesignDetail;
        allFormDesignDetails = this.removeFromList(allFormDesignDetails, toBeMoved.fieldCode);
        allFormDesignDetails = this.addToList(allFormDesignDetails, formDesignDetail, toIndex, parentFieldCode, columnIndex);

        const sortedFormFields = this.updateSeqNo(allFormDesignDetails);
        this._formDesignDetailsSubject.next(sortedFormFields);
    }

    setSelectedFormDesignDetail(formDesignDetail: FormDesignDetail): void {
        this._selectedFormDesignDetailSubject.next(formDesignDetail);
    }
    
    searchField(searchStr: string): void {
        this._searchSubject.next(searchStr);
    }

    updateColumnCount(formDesignDetail: FormDesignDetail, columns: number) {
        // if not zone
        // block function usage
        if (formDesignDetail.fieldType.fieldTypeID !== 4)
            return;

        const allFormDesignDetails = this.getAllFormDesignDetails();
        for (let i = 0; i < allFormDesignDetails.length; i++) {
            if (allFormDesignDetails[i].fieldType === formDesignDetail.fieldType) {
                allFormDesignDetails[i].columns = columns;
                allFormDesignDetails[i].updateColumnCount(columns);
            }
        }
    }

    /************** PRIVATE METHODS **************/
    private addToList(formDesignDetails: FormDesignDetail[], newFormDesignDetail: FormDesignDetail, index: number, parentFieldCode?: string, column?: number) {
        if (parentFieldCode != null) {
            for (let i = 0; i < formDesignDetails.length; i++) {
                if (formDesignDetails[i].fieldCode === parentFieldCode) {
                    formDesignDetails[i].addSubDesignDetails(newFormDesignDetail, index, column);
                    break;
                }
            }
        } else {
            formDesignDetails.splice(index, 0, newFormDesignDetail);
        }

        return formDesignDetails;
    }

    // remove formDesignDetail where fieldCode is found
    // will iterate into nested fields as well
    private removeFromList(formDesignDetails: FormDesignDetail[], fieldCode: string): FormDesignDetail[] {
        loop1:
        for (let i = 0; i < formDesignDetails.length; i++) {
            if (formDesignDetails[i].fieldCode === fieldCode) {
                formDesignDetails.splice(i, 1);
                // break for performance
                break;
            } else {
                if (formDesignDetails[i].subDesignDetails?.length > 0) {
                    const columnData = formDesignDetails[i].subDesignDetails;
                    loop2:
                    for (let j = 0; j < columnData.length; j++) {
                        const subDesignDetails = columnData[j];
                        loop3:
                        for (let k = 0; k < subDesignDetails.length; k++) {
                            if (subDesignDetails[k].fieldCode === fieldCode) {
                                // remove
                                formDesignDetails[i].subDesignDetails[j].splice(k, 1);
                                // break for performance
                                break loop1;
                            }
                        }
                    }

                }
            }
        }

        return formDesignDetails;
    }
    
    // find index of given FormDesignDetail
    // if formDesignDetail is nested
    // will return index relative to the nested FormDesignDetail
    private findFormDesignDetailIndex(formDesignDetail: FormDesignDetail): number {
        const allFormDesignDetails = this.getAllFormDesignDetails();
        for (let i = 0; i < allFormDesignDetails.length; i++) {
            // search top level
            if (allFormDesignDetails[i].fieldCode === formDesignDetail.fieldCode) {
                return i;
            // search child level
            } else if (allFormDesignDetails[i].subDesignDetails != null) {
                const columnData = allFormDesignDetails[i].subDesignDetails;
                for (let j = 0; j < columnData.length; j++) {
                    const subDesignDetails = columnData[j];
                    for (let k = 0; k < subDesignDetails.length; k++) {
                        if (subDesignDetails[k].fieldCode === formDesignDetail.fieldCode)
                            return k;
                    }
                }
            }
        }
    }

    // update seqNo of formDesignDetails
    // including nested ones
    private updateSeqNo(formDesignDetails: FormDesignDetail[], parentID?: number): FormDesignDetail[] {
        return formDesignDetails.map((x, xIndex) => {
            x.seqNo = xIndex + 1;
            // if field has columns
            // iterate subDesignDetails to update seqNo
            if (x.columns !== 0) {
                x.subDesignDetails?.map((columns) => {
                    columns.map((childFormField, yIndex) => {
                        childFormField.seqNo = yIndex + 1;
                    });
                })
            }
            return x;
        }).sort((a,b) => a.seqNo - b.seqNo);
    }
    
    // get current copy of all form design details
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

    // get current copy of all field types
    private getAllFieldTypes() {
        return [...this._fieldTypesSubject.getValue()];
    }
}