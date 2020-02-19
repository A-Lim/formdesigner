import { Component, OnInit } from '@angular/core';
import { FormDesignerService } from '../formdesigner.service';
import { FieldType } from '../fieldtype.model';
import { DndDropEvent } from 'ngx-drag-drop';

@Component({
  selector: 'app-fields-panel',
  templateUrl: './fields-panel.component.html',
  styleUrls: ['./fields-panel.component.css']
})
export class FieldsPanelComponent implements OnInit {
  public fieldTypes: FieldType[];
  
  draggable = {
    // note that data is handled with JSON.stringify/JSON.parse
    // only set simple data or POJO's as methods will be lost 
    data: "myDragData",
    effectAllowed: "copy",
    disable: false,
    handle: false
  };
  

  constructor(private formDesignService: FormDesignerService) { }

  ngOnInit(): void {
    this.formDesignService.retrieveFieldTypes();
    this.formDesignService.fieldTypes$.subscribe(fieldTypes => {
      this.fieldTypes = fieldTypes;
    });
    // this.formDesignService.getFieldTypes().subscribe(fieldTypes => {
    //   this.fieldTypes = fieldTypes;
    // });
  }

  onDragStart(event:DragEvent) {

    // console.log("drag started", JSON.stringify(event, null, 2));
  }
  
  onDragEnd(event:DragEvent) {
    
    // console.log("drag ended", JSON.stringify(event, null, 2));
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
