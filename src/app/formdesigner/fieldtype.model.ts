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
    fieldType: FieldType;
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