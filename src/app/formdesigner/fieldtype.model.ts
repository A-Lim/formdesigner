export class FieldType {
    fieldTypeID: number;
    fieldTypeName: string;
    fieldTypeCategory: FieldTypeCategory;
    label: string;
    seqNo: number;
}

export enum FieldTypeCategory {
    Layout = 'layout',
    Item = 'item',
    Container = 'container'
}

export class FormDesignDetail {
    public formDesignDetailID: number;
    public fieldType: FieldType;
    public fieldCode: string;
    public label: string;
    public description: string;
    public isRequired: boolean;
    public isHidden: boolean;
    public isDisabled: boolean;
    public seqNo: number;
    public options: any;
    public settings: any;
    public parentFieldCode: string;
    public columnNo: number;
    
    // container properties
    public columns: number;
    public subDesignDetails?: FormDesignDetail[][];

    constructor(formDesignDetailID: number, fieldType: FieldType, fieldCode: string, parentFieldCode?: string, columnNo?: number) {
        this.formDesignDetailID = formDesignDetailID;
        this.fieldType = fieldType;
        this.fieldCode = fieldCode;
        this.parentFieldCode = parentFieldCode;
        this.columnNo = columnNo;

        this.initColumns();
    }

    public addSubDesignDetails(formDesignDetail: FormDesignDetail, posIndex: number, columnIndex: number = 0) {
        if (columnIndex >= this.columns) {
            for (let i = 0; i < this.columns; i++) {
                if (this.subDesignDetails[i] == null) 
                    this.subDesignDetails.push([]);
            }
        }

        formDesignDetail.columnNo = columnIndex + 1;
        this.subDesignDetails[columnIndex].splice(posIndex, 0, formDesignDetail);
    }

    public deleteSubDesignDetails(formDesignDetail: FormDesignDetail) {

        if (!this.hasChild(formDesignDetail.fieldCode))
            return;
        
        const toBeDeleted = formDesignDetail;
        let columnIndex: number = null;
        let posIndex: number = null;
        this.subDesignDetails.forEach(function (colDetails, cIndex) {
            colDetails.forEach(function (formDesignDetail, pIndex) {
                if (formDesignDetail.fieldCode === toBeDeleted.fieldCode) {
                    columnIndex = cIndex;
                    posIndex = pIndex;
                }
            });
        });

        this.subDesignDetails[columnIndex].splice(posIndex, 1);
    }

    public hasChild(fieldCode: string) {
        return this.fieldCode === fieldCode;
    }

    public addColumn() {
        this.subDesignDetails.push([]);
    }

    public removeColumn() {
        this.subDesignDetails.pop();
    }

    private initColumns() {
        this.subDesignDetails = new Array();
        switch (this.fieldType.fieldTypeID) {
            // zone
            case 4:
                this.columns = 2;
                break;
            
            // table
            case 5:
                this.columns = 1;
                break;
            
            default:
                break;
        }
        
        for (let i = 0; i < this.columns; i++) {
            this.addColumn();
        }
    }

    public updateColumnCount(columns: number) {
        const difference = this.columns - columns;

        if (difference < 0) {
            for (let i = 0; i < Math.abs(difference); i++) {
                this.addColumn();
            }
        } else if (difference > 0) {
            for (let i = 0; i < Math.abs(difference); i++) {
                this.removeColumn();
            }
        }
    }

    // formFieldID: number;
    // fieldCode: string;
    // seqNo: number;
    // fieldType: FieldType;
    // parentID: number;
    // column: number;
    // columns: [FormField[]];
    // zoneProperties?: ZoneProperties;

    // constructor(formFieldID: number, fieldCode: string, seqNo: number,
    //     fieldType: FieldType, parentID?: number, column?: number, 
    //     zoneProperties?: ZoneProperties) {

    //     this.formFieldID = formFieldID;
    //     this.fieldCode = fieldCode;
    //     this.seqNo = seqNo;
    //     this.fieldType = fieldType;
    //     this.parentID = parentID;
    //     this.column = column;
    //     this.zoneProperties = zoneProperties;

    //     if (this.fieldType.fieldTypeID === 4 && this.zoneProperties == null) {
    //         this.zoneProperties = new ZoneProperties();
    //         this.columns = new Array();
    //         for (let i = 0; i < this.zoneProperties.columns; i++) {
    //             this.columns.push(new ColumnData());
    //         }
    //     }
    // }

    // addColumnFormField(formField: FormField, index: number, columnIndex: number) {
    //     this.columns[columnIndex].formFields.splice(index, 0, formField);
    // }   
}

export enum EffectAllowed {
    Move = 'move',
    Copy = 'copy',
    Link = 'link',
    None = 'none',
    CopyMove = 'copyMove',
    CopyLink = 'copyLink',
    LinkMove = 'linkMove',
    All = 'all'
}

class ZoneProperties {
    public columns: number;

    constructor() {
        this.columns = 2;
    }
}