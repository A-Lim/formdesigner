import { Component, OnInit } from '@angular/core';
import { FormDesignerService } from '../formdesigner.service';

import { DndDropEvent } from 'ngx-drag-drop';
import { FormField, EffectAllowed } from '../fieldtype.model';

@Component({
  selector: 'app-designer-panel',
  templateUrl: './designer-panel.component.html',
  styleUrls: ['./designer-panel.component.css']
})
export class DesignerPanelComponent implements OnInit {
  public formFields: FormField[];

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
    this.formDesignService.retrieveFormFields();
    this.formDesignService.formFields$.subscribe(formFields => {
      this.formFields = formFields;
      console.log("subscribe");
    })
    // this.formDesignService.getFormFields().subscribe(formFields => {
    //   this.formFields = formFields;
    // });

    // console.log(this.formDesignService.getFormFields().)
  }

  onDragStart(event:DragEvent) {

    // console.log("drag started", JSON.stringify(event, null, 2));
  }
  
  onDragEnd(event:DragEvent) {
    
    // console.log("drag ended", JSON.stringify(event, null, 2));
  }

  onDraggableMoved(event:DragEvent) {
    
    // console.log("draggable moved", JSON.stringify(event, null, 2));
  }

  onDragCancelled(event:DragEvent) {
    
    // console.log("draggable moved", JSON.stringify(event, null, 2));
  }

  onDragover(event: DragEvent) {
    // console.log("dragover", JSON.stringify(event, null, 2));
  }

  onDrop(event: DndDropEvent) {
    console.log(this.formFields);
    switch (event.dropEffect) {
      case EffectAllowed.Copy:
        this.formDesignService.addField(event.data, event.index);
        break;

      case EffectAllowed.Move:
        console.log("Move");
        console.log(event);
        // this.formDesignService.addField(event.data, event.index);
        this.formDesignService.moveField(event.data, event.index);
        break;

      default:
        break;
    }
    // console.log("DROPPED");
    // console.log(event);
    // this.formDesignService.addField(event.data);
    console.log(this.formFields);
  }
  
}
