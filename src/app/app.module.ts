import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormDesignerComponent } from './formdesigner/formdesigner.component';
import { FieldsPanelComponent } from './formdesigner/fields-panel/fields-panel.component';
import { DesignerPanelComponent } from './formdesigner/designer-panel/designer-panel.component';
import { FieldOptionsPanelComponent } from './formdesigner/field-options-panel/field-options-panel.component';

import { DndModule } from 'ngx-drag-drop';
import { ZoneComponent } from './formdesigner/field-templates/zone/zone.component';
import { TableComponent } from './formdesigner/field-templates/table/table.component';
// import { DragulaModule } from 'ng2-dragula';

@NgModule({
  declarations: [
    AppComponent,
    FormDesignerComponent,
    FieldsPanelComponent,
    DesignerPanelComponent,
    FieldOptionsPanelComponent,
    ZoneComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    DndModule,
    FormsModule,
    // DragulaModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
