import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormDesignerComponent } from './formdesigner/formdesigner.component';
import { FieldsPanelComponent } from './formdesigner/fields-panel/fields-panel.component';
import { DesignerPanelComponent } from './formdesigner/designer-panel/designer-panel.component';
import { FieldOptionsPanelComponent } from './formdesigner/field-options-panel/field-options-panel.component';
import { CommonModule } from '@angular/common';
import { DndModule } from 'ngx-drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    FormDesignerComponent,
    FieldsPanelComponent,
    DesignerPanelComponent,
    FieldOptionsPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    DndModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
