import { Injectable } from '@angular/core';
import { FieldType, FieldTypeCategory } from './fieldtype.model';

@Injectable({ providedIn: 'root' })
export class FormDesignerService {

    getFieldTypes() {
        // const header:FieldType = { fieldTypeID: 1, fieldTypeName: "Heading", fieldTypeCategory: FieldTypeCategory.Layout, label: "Heading", seqNo: 1 };
        return [
            { fieldTypeID: 1, fieldTypeName: "Heading", fieldTypeCategory: FieldTypeCategory.Layout, label: "Heading", seqNo: 1 } as FieldType,
            { fieldTypeID: 2, fieldTypeName: "Textbox", fieldTypeCategory: FieldTypeCategory.Item, label: "Textbox", seqNo: 2 } as FieldType,
            { fieldTypeID: 3, fieldTypeName: "TextArea", fieldTypeCategory: FieldTypeCategory.Item, label: "Textare", seqNo: 3 } as FieldType
        ];
    }
}