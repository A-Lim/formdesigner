import { Component, OnInit } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';

@Component({
  selector: 'app-designer-panel',
  templateUrl: './designer-panel.component.html',
  styleUrls: ['./designer-panel.component.css']
})
export class DesignerPanelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onDragover(event: DragEvent) {
    console.log("dragover", JSON.stringify(event, null, 2));
  }

  onDrop(event: DndDropEvent) {
    console.log("dropped", JSON.stringify(event, null, 2));
  }
}
