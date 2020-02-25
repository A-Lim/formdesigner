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
    
    
    // container properties
    public columns: number;
    public subDesignDetails?: FormDesignDetail[][];

    constructor(formDesignDetailID: number, fieldType: FieldType, fieldCode: string) {
        this.formDesignDetailID = formDesignDetailID;
        this.fieldType = fieldType;
        this.fieldCode = fieldCode;

        if (fieldType.fieldTypeID === 4) {
            this.subDesignDetails = new Array();
            // zone default columns
            this.columns = 2;
            for (let i = 0; i < this.columns; i++) {
                this.subDesignDetails.push([]);
            }
        }
    }

    public addSubDesignDetails(formDesignDetail: FormDesignDetail, posIndex: number, columnIndex: number, ) {
        if (columnIndex >= this.columns) {
            for (let i = 0; i < this.columns; i++) {
                if (this.subDesignDetails[i] == null) 
                    this.subDesignDetails.push([]);
            }
        }
        this.subDesignDetails[columnIndex].splice(posIndex, 0, formDesignDetail);
    }

    public deleteSubDesignDetails(formDesignDetail: FormDesignDetail) {
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

        console.log("COLUMN");
        console.log(columnIndex);
        console.log("POSITION");
        console.log(posIndex);
        // this.subDesignDetails[formDesignDetail]
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