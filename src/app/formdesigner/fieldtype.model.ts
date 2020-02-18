export interface FieldType {
    fieldTypeID: number;
    fieldTypeName: string;
    fieldTypeCategory: FieldTypeCategory;
    label: string;
    seqNo: number;
}

export enum FieldTypeCategory {
    Layout = "layout",
    Item = "item",
    Container = "container"
}