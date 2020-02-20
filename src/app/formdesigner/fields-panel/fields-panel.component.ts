import { Component, OnInit } from '@angular/core';
import { FormDesignerService } from '../formdesigner.service';
import { FieldType } from '../fieldtype.model';
import { DndDropEvent } from 'ngx-drag-drop';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fields-panel',
  templateUrl: './fields-panel.component.html',
  styleUrls: ['./fields-panel.component.css']
})
export class FieldsPanelComponent implements OnInit {
  // public fieldTypes: FieldType[];
  public fieldTypes$: Observable<FieldType[]>;
  
  draggable = {
    // note that data is handled with JSON.stringify/JSON.parse
    // only set simple data or POJO's as methods will be lost 
    data: "myDragData",
    effectAllowed: "copy",
    disable: false,
    handle: false
  };
  

  constructor(private formDesignService: FormDesignerService) { }

  ngOnInit() {
    this.formDesignService.retrieveFieldTypes();
    this.fieldTypes$ = this.formDesignService.fieldTypes$;
  }

  onDragStart(event:DragEvent, fieldType: FieldType) {
  }
  
  onDragEnd(event:DragEvent) {
  }
  
  onDraggableCopied(event:DragEvent, fieldTypeID: number) {
    // console.log("copied");
    // console.log("draggable linked", JSON.stringify(event));
    // this.formDesignService.addField(fieldTypeID);
  }
  
  onDraggableLinked(event:DragEvent) {
      
    // console.log("draggable linked", JSON.stringify(event, null, 2));
  }

  onDraggableMoved(event:DragEvent) {
      
    // console.log("draggable moved", JSON.stringify(event, null, 2));
  }

  onDragCanceled(event:DragEvent) {
      
    // console.log("draggable cancelled", JSON.stringify(event, null, 2));
  }
    
}
