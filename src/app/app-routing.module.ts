import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormDesignerComponent } from './formdesigner/formdesigner.component';


const routes: Routes = [
  { path: '', component: FormDesignerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
