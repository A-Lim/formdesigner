import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormDesignerService } from '../formdesigner.service';

import { DndDropEvent } from 'ngx-drag-drop';
import { FormField, EffectAllowed } from '../fieldtype.model';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-designer-panel',
  templateUrl: './designer-panel.component.html',
  styleUrls: ['./designer-panel.component.css']
})
export class DesignerPanelComponent implements OnInit, OnDestroy {
  public formFields$: Observable<FormField[]>;
  public selectedFormFieldSub: Subscription;
  public selectedFormField: FormField;

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
    this.formFields$ = this.formDesignService.formFields$;

    // keep track of which form field is selected
    // console.log(this.formDesignService.selectedFormField$);
    this.selectedFormFieldSub = this.formDesignService.selectedFormField$.subscribe(formField => {
      this.selectedFormField = formField;
    });
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
    // console.log(this.formFields);
    switch (event.dropEffect) {
      case EffectAllowed.Copy:
        this.formDesignService.addField(event.data, event.index);
        break;

      case EffectAllowed.Move:
        this.formDesignService.moveField(event.data, event.index);
        break;

      default:
        break;
    }
  }

  onFormFieldFocus(formFieldID: number) {
    this.formDesignService.setSelectedFormField(formFieldID);
    console.log(this.selectedFormField);
  }
  
  ngOnDestroy() {
    // this.formDesignService.formFields$;
    // this.formFieldsSubscription.unsubscribe();
  }
}
