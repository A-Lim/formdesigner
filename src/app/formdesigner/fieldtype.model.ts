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

export class FormField {
    formFieldID: number;
    fieldCode: string;
    seqNo: number;
    fieldType: FieldType;
    parentID: number;
    column: number;
    zoneProperties?: ZoneProperties;

    constructor(formFieldID: number, fieldCode: string, seqNo: number,
        fieldType: FieldType, parentID?: number, column?: number, 
        zoneProperties?: ZoneProperties) {

        this.formFieldID = formFieldID;
        this.fieldCode = fieldCode;
        this.seqNo = seqNo;
        this.fieldType = fieldType;
        this.parentID = parentID;
        this.column = column;
        this.zoneProperties = zoneProperties;

        if (this.fieldType.fieldTypeID === 4 && this.zoneProperties == null) {
            this.zoneProperties = new ZoneProperties();
        }
    }
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